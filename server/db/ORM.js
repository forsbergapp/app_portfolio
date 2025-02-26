/** 
 *  Database using race condition, pessimistic lock, constraints and database transaction pattern
 *  Tables implemented using object mapping relation (ORM), PK and UK patterns
 *  See data Model for an overview.
 *  
 *  File types supported
 *  DOCUMENT        json
 *                  uses fileFsRead and fileFsWrite by admin and config files
 *  TABLE           json that can be managed as table and implemented using object mapping relation (ORM) pattern
 *                  consists of 3 layers
 *                  App layer
 *                  *.js                app logic, ex iamAuthenticateUser() in /server/iam.js
 *                  Object layer
 *                  /server/db/*.js     data model API with constraints, ex IamUser() in /server/db/IamUser.js
 *                                      returns server response format
 *                  Database layer
 *                  ORM.js              file management API using async fileCommonExecute() with file read and write
 *                                      and fileDBGet() reading directly from cached object in memory using closure pattern
 *                                      in /server/db/ORM.js
 *                                      manages objects, constraints, transactions with commit and rollback
 *                                      returns database result
 * 
 *                  Explanation fileCommonExecute():
 *                                  fileDBGet               reads file content from `cache_content` and should be used by default for performance
 *                                                          so a synchronous function can be used and to avoid disk read
 *                                                          since TABLE files stores new content in `cache_content` after each change
 *                                  fileFsRead              reads file content from file, 
 *                                                          used at transaction start,in microservice that does not read `cache_content`
 *                                                          from other server process and at server start
 *                                  fileDBPost              saves file content to file and updates `cachec_content`
 *                                  fileDBUpdate            saves file content to file and updates `cache_content`
 *                                  fileDBDelete            saves file content to file and updates `cache_content`
 *                                  fileConstraints         checks constraints for fileDBPost and fileDBDelete
 *                                  fileTransactionStart    reads and sets `transaction_id` and `lock` key in DB and 
 *                                                          uses setTimeout loop until lock is available,
 *                                                          waits maximum 10 seconds for lock,
 *                                                          saves file content in `transaction_content` that is used to rollback info if
 *                                                          something goes wrong and can also be used for debugging purpose
 *                                  fileTransactionCommit   empties `transaction_id`, `transaction_content` and sets `lock =0`
 *                                  fileTransactionRollback empties `transaction_id`, `transaction_content` and sets `lock =0`
 *  TABLE_LOG       json records, comma separated
 *                  uses fileFsDBLogGet and fileFsDBLogPost
 *  TABLE_LOG_DATE  json record, comma separateed with file name suffixes
 *                  uses fileFsLogGet, fileFsDBLogPost and fileSuffix
 *  BINARY          used by sqLite database and *.js file not implemented
 *  Admin can also use fileFsWriteAdmin and fileFsDeleteAdmin without transaction if needed
 * 
 * @module server/db/ORM
 */

/**
 * @import {server_server_response, server_server_error,
 *          server_DbObject, server_DbObject_record, 
 *          server_db_database_demo_data,
 *          server_db_result_fileFsRead,
 *          server_db_common_result_select, server_db_common_result_update, server_db_common_result_delete,server_db_common_result_insert,
 *          server_db_table_IamUser,
 *          server_db_table_IamUserAppDataPost,
 *          server_db_table_IamUserView,
 *          server_db_table_AppDataResourceMaster, server_db_table_AppDataResourceDetail, server_db_table_AppDataResourceDetailData} from '../types.js'
 */

const fs = await import('node:fs');

const DB_DEMO_PATH              = '/server/install/db/demo/';
const DB_DEMO_FILE              = 'demo_data.json';

/**
 * @name DB
 * @description File database using ORM pattern, is loaded from external file at server start
 * @constant
 * @type{{data:server_DbObject_record[]}}
 */
const DB = {data: []};
Object.seal(DB);

/**
 * @name DB_DIR
 * @description File database paths
 * @constant
 * @type{{db:string, backup:string}}
 */
const DB_DIR = {db:'/data/db/', backup:'/data/db/backup/'};
Object.seal(DB_DIR);

/**
 * @name fileRecord
 * @description Get file record from file db
 * @function
 * @param {server_DbObject} filename 
 * @returns {server_DbObject_record}
 */
const fileRecord = filename =>DB.data.filter(file_db=>file_db.name == filename)[0];

/**
 * @name fileRecordFilename
 * @description Get filename from file db for given file
 * @function
 * @param {server_DbObject} file
 * @returns {{filename:string, suffix:string}}
 */
const fileRecordFilename = file => {const record = fileRecord(file);
                                    return {filename:file, 
                                            suffix:record.type=='BINARY'?
                                                        '':
                                                        record.type.startsWith('TABLE_LOG')?
                                                            '.log':
                                                                '.json'};};

/**
 * @name fileTransactionStart
 * @description Start transaction
 *              Using race condition, pessmistic lock and database transaction pattern
 * @function
 * @param {server_DbObject} file 
 * @param {string} filepath
 * @returns {Promise.<number>}
 */
const fileTransactionStart = async (file, filepath)=>{
    
    const transaction = async ()=>{
        const record = fileRecord(file);
        const transaction_id = Date.now();
        record.transaction_id = transaction_id;
        const file_content = await fs.promises.readFile(process.cwd() + filepath, 'utf8').catch(()=>'');
        //parse TABLE and DOCUMENT, others are binary or json log files
        record.transaction_content = (record.type=='TABLE' || record.type=='DOCUMENT')?JSON.parse(file_content==''?'[]':file_content):file_content;
        return transaction_id;
    };
    return new Promise((resolve, reject)=>{
        if  (fileRecord(file).lock==0){
            fileRecord(file).lock = 1;
            //add 1ms wait so transaction_id will be guaranteed unique on a fast server
            setTimeout(()=>{
                resolve(transaction()); 
                }, 1);
        }
        else{
            let tries = 0;
            const lock = () =>{
                tries++;
                if (tries > 10000)
                    reject ('timeout');
                else
                    if (fileRecord(file).lock==0){
                        fileRecord(file).lock = 1;
                        resolve(transaction());
                    }
                    else
                        setTimeout(()=>{lock(), 1;});
            };
            lock();
        }
    });
};
/**
 * @name fileTransactionCommit
 * @description Transation commit
 * @function
 * @param {server_DbObject} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const fileTransactionCommit = (file, transaction_id)=>{
    if (fileRecord(file).transaction_id==transaction_id){
        fileRecord(file).lock = 0;
        fileRecord(file).transaction_id = null;
        fileRecord(file).transaction_content = null;
        return true;
    }
    else
        return false;
};
/**
 * @name fileTransactionRollback
 * @description Transaction rollback
 * @function
 * @param {server_DbObject} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const fileTransactionRollback = (file, transaction_id)=>{
    if (fileRecord(file).transaction_id==transaction_id){
        fileRecord(file).lock = 0;
        fileRecord(file).transaction_id = null;
        fileRecord(file).transaction_content = null;
        return true;
    }
    else
        return false;
};
/**
 * @name fileNamePartition
 * @description Get filename partition using YYYYMMDD or YYYYMM format
 * @function
 * @param {string|null} partitionformat
 * @param {string|null} sample 
 * @returns 
 */
 const fileNamePartition = (partitionformat=null, sample=null) =>{
    const year = new Date().toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric'});
    const month = new Date().toLocaleString('en-US', { timeZone: 'UTC', month: '2-digit'});
    const day   = new Date().toLocaleString('en-US', { timeZone: 'UTC', day: '2-digit'});
    let file_partition = '';
    if (sample)
        file_partition = `${sample}`;
    else
        switch (partitionformat){
            case 'YYYYMMDD':{
                file_partition = `${year}${month}${day}`;
                break;
            }
            case 'YYYYMM':{
                file_partition = `${year}${month}`;
                break;
            }
            default:{
                break;
            }
        }
    return file_partition;
};

/**
 * @name filePath
 * @description Returns file path for given file
 * @function
 * @param {server_DbObject} file 
 * @returns {string}
 */
const filePath = file =>DB_DIR.db + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;

/**
 * @name fileCache
 * @description Get file from cache already JSON parsed
 * @function
 * @param {server_DbObject} file
 * @returns {*}
 */
 const fileCache = file => JSON.parse(JSON.stringify(fileRecord(file).cache_content));

/**
 * @name fileFsDir
 * @description Get files from directory
 * @function
 * @returns {Promise.<string[]>}
 */
const fileFsDir = async () => await fs.promises.readdir(`${process.cwd()}${DB_DIR.db}`);
/**
 * @name fileFsRead
 * @description Returns file content for given file
 *              Specify lock=true when updating a file to get transaction id 
 *              when file is available to update.
 *              Function returns file content after a lock of file and transaction id is given, lock info and transaction id.
 *              This transaction id must be provided when updating file in fileFsWrite()
 * @function
 * @param {server_DbObject} file 
 * @param {boolean} lock
 * @returns {Promise.<server_db_result_fileFsRead>}
 */
const fileFsRead = async (file, lock=false) =>{
    const filepath = DB_DIR.db + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;
    if (lock){
        const transaction_id = await fileTransactionStart(file, filepath);
        return {   file_content:    fileRecord(file).transaction_content,
                    lock:           lock,
                    transaction_id: transaction_id};
    }
    else{
        return {   file_content:    await fs.promises.readFile(process.cwd() + filepath, 'utf8').then((file)=>JSON.parse(file.toString())),
                    lock:           lock,
                    transaction_id: null};
    }    
};
/**
 * @name fileFsWrite
 * @description Writes file
 *              Must specify valid transaction id given from fileFsRead()
 *              to be able to update a file
 *              Backup of old file will be written to backup directory
 * @function
 * @param {server_DbObject} file 
 * @param {number|null} transaction_id 
 * @param {[]} file_content 
 * @returns {Promise.<string|null>}
 */

const fileFsWrite = async (file, transaction_id, file_content) =>{  
    const record = fileRecord(file);
    if (!transaction_id || record.transaction_id != transaction_id){
        /**@type{import('../iam.js')} */
        const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
        return iamUtilMessageNotAuthorized();
    }
    else{
        try {
            const fileRecordFile = fileRecordFilename(file);
            const filepath = fileRecordFile.filename + fileRecordFile.suffix;
            //write backup of old config file
            await fs.promises.writeFile(process.cwd() + `${DB_DIR.backup + filepath}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, 
                                        record.type=='TABLE'?
                                        //save records in new row and compact format
                                        /**@ts-ignore */
                                        '[\n' + record.transaction_content.map(row=>JSON.stringify(row)).join(',\n') + '\n]':
                                            //JSON, convert to string
                                            JSON.stringify(record.transaction_content, undefined, 2)
                                        ,  
                                        'utf8');
            //write new file content
            await fs.promises.writeFile( process.cwd() + DB_DIR.db + filepath, 
                                                record.type=='TABLE'?
                                                //save records in new row and compact format
                                                '[\n' + file_content.map(row=>JSON.stringify(row)).join(',\n') + '\n]':
                                                    //JSON, convert to string
                                                    JSON.stringify(file_content, undefined, 2)
                                                ,  
                                                'utf8');
            fileRecord(file).cache_content = file_content;
            if (fileTransactionCommit(file, transaction_id))
                return null;
            else{
                /**@type{import('../iam.js')} */
                const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
                throw (iamUtilMessageNotAuthorized());
            }
        } catch (error) {
            if (fileTransactionRollback(file, transaction_id))
                throw(error);
            else
                throw('⛔ ' + error);
        }   
    }
};

/**
 * @name fileFSDirDataExists
 * @description Checks if /data directory is created
 * @function
 * @returns {Promise<boolean>}
 */
const fileFSDirDataExists = async () => {
    
    try {
        await fs.promises.access(process.cwd() + '/data');
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * @name fileFsAccessMkdir
 * @description Created directories and should be used only when server is started first time
 * @function
 * @param {string[]} paths
 * @returns{Promise.<void>}
 */
const fileFsAccessMkdir = async paths => {
    const mkdir = async (/**@type{string} */dir) =>{
        await fs.promises.mkdir(process.cwd() + dir)
        .catch((error)=>{
            throw error;
        });
    };
    for (const dir of paths){
        await fs.promises.access(process.cwd() + dir)
        .catch(()=>{
            mkdir(dir);  
        });
    }
};
/**
 * @name fileFsWriteAdmin
 * @description Write to a file in database
 *              Should only be used by admin since no transaction is used
 * @function
 * @param {server_DbObject} file 
 * @param {{}} file_content 
 * @returns {Promise.<void>}
 */
const fileFsWriteAdmin = async (file, file_content) =>{
    await fs.promises.writeFile(process.cwd() + 
                                DB_DIR.db +
                                fileRecordFilename(file).filename + fileRecordFilename(file).suffix, 
                                file_content?JSON.stringify(file_content, undefined, 2):'',  'utf8')
    .catch((error)=> {
        throw error;
    });
    if (fileRecord(file).cache_content)
        fileRecord(file).cache_content = file_content;
};

/**
 * @name fileFsDeleteAdmin
 * @description Delete a file in database
 * @function
 * @param {server_DbObject} file 
 * @returns {Promise.<void>}
 */
const fileFsDeleteAdmin = async file => {                                 
    const filepath =    process.cwd() + 
                        DB_DIR.db +
                        fileRecordFilename(file).filename + fileRecordFilename(file).suffix;
    await fs.promises.rm(filepath)
            .then(()=>{if (fileRecord(file).cache_content)
                        fileRecord(file).cache_content = null;
            })
            .catch((error=>{throw error;}));
};

 /**
  * @name fileFsDBLogGet
  * @description Get log file with given suffix or none or use sample to get specific suffix
  *              for statistics
  *              Filters for given resource_id if requested
  * @function
  * @param {number|null} app_id
  * @param {server_DbObject} file
  * @param {number|null} resource_id
  * @param {string|null} filenamepartition
  * @param {string|null} sample
  * @returns {Promise.<server_db_common_result_select>}
  */
 const fileFsDBLogGet = async (app_id, file, resource_id, filenamepartition=null, sample=null) =>{
    const record = fileRecordFilename(file);
    const filepath = `${record.filename}_${fileNamePartition(filenamepartition, sample)}${record.suffix}`;
    const fileBuffer = await fs.promises.readFile(process.cwd() + DB_DIR.db + filepath, 'utf8');
    return {rows:fileBuffer.toString().split('\r\n').filter(row=>row !='').map(row=>row = JSON.parse(row)).filter(row=>row.id == (resource_id??row.id))};
};
/**
 * @name fileFsDBLogPost
 * @description Create log record with given suffix or none
 * @function
 * @param {number|null} app_id
 * @param {server_DbObject} file
 * @param {object} file_content 
 * @param {string|null} filenamepartition
 * @returns {Promise.<server_db_common_result_insert>}
 */
const fileFsDBLogPost = async (app_id, file, file_content, filenamepartition = null) =>{

    const record = fileRecordFilename(file);

    const filepath = `${DB_DIR.db}${record.filename}_${fileNamePartition(filenamepartition, null)}${record.suffix}`;
    const transaction_id = await fileTransactionStart(file, filepath);
    
     await fs.promises.appendFile(`${process.cwd()}${filepath}`, JSON.stringify(file_content) + '\r\n', 'utf8')
            .catch((error)=>{
                if (fileTransactionRollback(file, transaction_id))
                    throw(error);
                else{
                    import(`file://${process.cwd()}/server/iam.js`).then(({iamUtilMessageNotAuthorized})=>{
                        throw iamUtilMessageNotAuthorized() + ' ' + error;
                    });
                }
            });
    if (fileTransactionCommit(file, transaction_id))
        return {affectedRows:1};
    else{
        /**@type{import('../iam.js')} */
        const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
        throw (iamUtilMessageNotAuthorized());
    }
};
/**
 * @name fileDBGet
 * @description Gets a record or records in a TABLE
 *              for given app id and if resource id if specified
 *              TABLE should have column id as primary key using this function
 * @function
 * @param {number|null} app_id
 * @param {server_DbObject} table
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @returns {server_db_common_result_select}
 */
const fileDBGet = (app_id, table, resource_id, data_app_id) =>{
    try {
        const records = fileCache(table).filter((/**@type{*}*/row)=> row.id ==(resource_id ?? row.id) && row.app_id == (data_app_id ?? row.app_id));
        
        //log in background without waiting if db log is enabled
        import(`file://${process.cwd()}/server/db/Log.js`).then((/**@type{import('./Log.js')} */Log)=>
            Log.postDBI(app_id, table, 'GET', {resource_id:resource_id, data_app_id:data_app_id}, records));

        if (records.length>0)
            return {rows:records};
        else{
            return {rows:[]};
        }    
    } catch (error) {
        return {rows:[]};
    }
    
};
/**
 * @name fileConstraints
 * @description Authenticates PK constraint that can have one primary key column and UK constraint that can have several columns. 
 *              Implements contraints pattern using some() function for best performane to check if value already exist
 * @function
 * @param {server_DbObject} table
 * @param {[]} table_rows
 * @param {*} data
 * @param {'UPDATE'|'POST'} dml
 * @param {number|null} [resource_id]
 * @returns {boolean}
 */
const fileConstraints = (table, table_rows, data, dml, resource_id) =>{
    const filerecord = fileRecord(table);
    //update of PK not alllowed
    if (dml=='POST' && filerecord.pk && table_rows.some((/**@type{server_DbObject_record}*/record)=>
        /**@ts-ignore */
        record[filerecord.pk]==data[filerecord.pk]))
            return false;
    else{
        //no record can exist having given values for POST
        if (dml=='POST' && filerecord.uk && table_rows.some((/**@type{server_DbObject_record}*/record)=>
            /**@ts-ignore */
            filerecord.uk?.filter(column=>record[column]==data[column]).length==filerecord.uk?.length))
                return false;
        else
            //max one record can exist having given values for UPDATE
            if (dml=='UPDATE' && filerecord.uk && table_rows.some((/**@type{server_DbObject_record}*/record)=>
                //check value is the same, ignore empty UK
                /**@ts-ignore */
                filerecord.uk.filter(column=>record[column] && record[column]==data[column]).length==filerecord.uk.length &&
                //check it is NOT the same user
                /**@ts-ignore */
                record[filerecord.pk]!=resource_id))
                    return false;
            else
                return true;
    }
};
/**
 * @name fileDBPost
 * @description Creates a record in a TABLE
 *              and returns the record
 * @function
 * @param {number} app_id
 * @param {server_DbObject} table
 * @param {*} data
 * @returns {Promise.<server_db_common_result_insert>}
 */
const fileDBPost = async (app_id, table, data) =>{
    if (app_id!=null){
        /**@type{server_db_result_fileFsRead} */
        const file = await fileFsRead(table, true);
        if (fileConstraints(table, file.file_content, data, 'POST')){
            await fileFsWrite(table, file.transaction_id, file.file_content.concat(data))
            .catch((/**@type{server_server_error}*/error)=>{throw error;});
            return {affectedRows:1};
        }
        else{
            fileTransactionRollback(table,
                                    /**@ts-ignore */
                                    file.transaction_id);
            return {affectedRows:0};
        }
    }
    else{
        return {affectedRows:0};
    }
};
/**
 * @name fileDBUpdate
 * @description Updates a record in a TABLE
 *              with given values in given columns in data parameter
 *              and returns updated record
 *              TABLE should have column id as primary key using this function
 * @function
 * @param {number} app_id
 * @param {server_DbObject} table
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @param {*} data
 * @returns {Promise<server_db_common_result_update>}
 */
const fileDBUpdate = async (app_id, table, resource_id, data_app_id, data) =>{
    if (app_id!=null){
        /**@type{server_db_result_fileFsRead} */
        const file = await fileFsRead(table, true);
        if (fileConstraints(table, file.file_content, data, 'UPDATE', resource_id)){
            let update = false;
            let count = 0;
            for (const index in file.file_content)
                //a TABLE must have ID or APP_ID as PK to be able to update
                if ((file.file_content[index].id==resource_id && resource_id!=null)|| (file.file_content[index].app_id == data_app_id && data_app_id != null)){
                    count++;
                    //update columns requested
                    for (const key of Object.entries(data)){
                        update = true;
                        file.file_content[index][key[0]] = key[1];
                    }
                }
            if (update){
                await fileFsWrite(table, file.transaction_id, file.file_content)
                        .catch((/**@type{server_server_error}*/error)=>{throw error;});
                return {affectedRows:count};
            }
            else
                return {affectedRows:0};
        }
        else{
            fileTransactionRollback(table,
                                    /**@ts-ignore */
                                    file.transaction_id);
            return {affectedRows:0};
        }
    }
    else
        return {affectedRows:0};
};
/**
 * @name fileDBDelete
 * @description Deletes a record in a TABLE
 *              for given resource id and app id
 *              TABLE should have column id as primary key using this function
 * @function
 * @param {number} app_id
 * @param {server_DbObject} table
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @returns {Promise<server_db_common_result_delete>}
 */
const fileDBDelete = async (app_id, table, resource_id, data_app_id) =>{
    /**@type{server_db_result_fileFsRead} */
    const file = await fileFsRead(table, true);
    if (file.file_content.filter((/**@type{*}*/row)=>(data_app_id==null && row.id==resource_id && resource_id!=null)|| (resource_id==null && row.app_id == data_app_id && data_app_id != null)).length>0){
        await fileFsWrite(  table, 
                            file.transaction_id, 
                            //filter unique id
                            file.file_content
                            .filter((/**@type{*}*/row)=>(data_app_id==null && resource_id!=null && row.id!=resource_id) || (resource_id==null && data_app_id!=null && row.app_id!=data_app_id)))
                .catch((/**@type{server_server_error}*/error)=>{throw error;});
        return {affectedRows:   file.file_content.length -
                                file.file_content
                                .filter((/**@type{*}*/row)=>(data_app_id==null && resource_id!=null && row.id!=resource_id) || (resource_id==null && data_app_id!=null && row.app_id!=data_app_id)).length
                };
    }
    else
        return {affectedRows:0};    
};
/**
 * @name fileCommonExecute
 * @description Execute a db statement
 * @function
 * @param {{app_id:number,
 *          dml:'UPDATE'|'POST'|'DELETE',
 *          object:server_DbObject,
 *          update?: {resource_id:number|null, data_app_id:number|null, data:*},
 *          post?:   {data:*},
 *          delete?: {resource_id:number|null, data_app_id:number|null}
 *          }} parameters
 * @returns {Promise<server_db_common_result_insert & server_db_common_result_delete & server_db_common_result_update>}
 */
const fileCommonExecute = async parameters =>{
    /**@type{import('./Log.js')} */
    const Log = await import(`file://${process.cwd()}/server/db/Log.js`);
    try{
        if (parameters.dml!='UPDATE' && parameters.dml!='POST' && parameters.dml!='DELETE'){
            /**@type{import('../iam.js')} */
            const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
            throw iamUtilMessageNotAuthorized();
        }
        else{
            const result =  parameters.dml=='UPDATE'?  await fileDBUpdate(  parameters.app_id, 
                                                                            parameters.object, 
                                                                            parameters.update?.resource_id??null, 
                                                                            parameters.update?.data_app_id??null, 
                                                                            parameters.update?.data):
                            parameters.dml=='POST'?    await fileDBPost(    parameters.app_id,   
                                                                            parameters.object, 
                                                                            parameters.post?.data):
                                await fileDBDelete(                         parameters.app_id, 
                                                                            parameters.object, 
                                                                            parameters.delete?.resource_id??null, 
                                                                            parameters.delete?.data_app_id??null);
            
            return Log.postDBI(parameters.app_id, parameters.object, parameters.dml, parameters, result)
                    .then(()=>result);
        }
    } 
    catch (error) {
        return Log.postDBE(parameters.app_id, parameters.object, parameters.dml, parameters, error)
			.then(()=>{
                throw error;
            });
    }
};

/**
 * Returns error message in ISO20022 format
 * @param {number|null} app_id
 * @param {number} statusCode
 * @param {*} error
 * @returns {server_server_response}
 */
const getError = (app_id, statusCode, error=null) =>{
	if (error){
		return {http:statusCode,
				code:'DB',
				text:error,
				developerText:null,
				moreInfo:null,
				type:'JSON'};
	}
	else{
		return {http:statusCode,
				code:'DB',
				text:error?error:statusCode==404?'?!':'⛔',
				developerText:null,
				moreInfo:null,
				type:'JSON'};
	}
};

/**
 * @name fileDbInit
 * @description Load default database or read existing from disk. Set cache for files in existing database using `cache_content` key to increase performance
 * @function
 * @param {server_DbObject[]|null} default_db
 * @returns {Promise.<void>}
 */
 const fileDbInit = async (default_db=null) => {
    
    DB.data = default_db?default_db:await fs.promises.readFile(process.cwd() + DB_DIR.db + 'DbObjects.json', 'utf8')
                    .then(result=>JSON.parse(result))
                    .catch(()=>'');
    
    if (default_db == null)
        for (const file_db_record of DB.data){
            if ('cache_content' in file_db_record){
                const file = await fs.promises.readFile(process.cwd() + DB_DIR.db + fileRecordFilename(file_db_record.name).filename + fileRecordFilename(file_db_record.name).suffix, 'utf8')
                                    .then((/**@type{string}*/file)=>JSON.parse(file.toString()))
                                    .catch(()=>null);
                file_db_record.cache_content = file?file:null;
            }
        }
 };
 
 /**
 * @name getViewInfo
 * @description Database info
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {Promise.<server_server_response & {result?:{   database_name:string, 
 *                                                          version:number,
 *                                                          hostname:string,
 *                                                          connections:Number,
 *                                                          started:number}[]}>}
 */
const getViewInfo = async parameters =>{
    parameters;
    /**@type{import('./Config.js')} */
    const Config = await import(`file://${process.cwd()}/server/db/Config.js`);
    /**@type{import('../socket.js')} */
    const {socketConnectedCount} = await import(`file://${process.cwd()}/server/socket.js`);
    return {result: [{
                        database_name: Config.get('ConfigServer','METADATA').CONFIGURATION,
                        version: 1,
                        hostname:Config.get('ConfigServer','SERVER','HOST')??'',
                        connections: socketConnectedCount({data:{logged_in:'1'}}).result.count_connected??0,
                        started: process.uptime()
                    }],
            type:'JSON'};
};
        
/**
 * @name getViewObjects
 * @description Database info
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {server_server_response & {result?:{name:server_DbObject_record['name'],
 *                                              type:server_DbObject_record['type'],
 *                                              pk:server_DbObject_record['pk'],
 *                                              uk:server_DbObject_record['uk'],
 *                                              lock:server_DbObject_record['lock'],
 *                                              transaction_id:server_DbObject_record['transaction_id'],
 *                                              rows:number|null,
 *                                              size:number|null}[]}}
 */
const getViewObjects = parameters =>{
    

    const result = DB.data.map(row=>{
        return {
            name: row.name,
            type: row.type,
            pk: row.pk,
            uk: row.uk,
            lock: row.lock,
            transaction_id: row.transaction_id,
            rows: ('cache_content' in row && row.type=='TABLE')?
                    row.cache_content?
                        row.cache_content.length??0:
                            0:
                                null,
            size: ('cache_content' in row)?
                    row.cache_content?
                        JSON.stringify(row.cache_content)?.length??0:
                            0:
                                null
        };
    });
    if (result.length>0)
        return {result:result, type:'JSON'};
    else
        return getError(parameters.app_id, 404);
};

/**
 * @name dbDemoInstall
 * @description Install demo users and sends server side events of progress
 *              Installation steps:
 *              1.Create all users (user_level=2) first and update with id
 *              2.Generate key pairs for each user that can be saved both in resource and apps configuration
 *              3.Loop users created
 *                  3A.Generate vpa for each user that can be saved both in resource and apps configuration            
 *                  3B.Create user_account_app record for all apps except admin
 *                  3C.Create user posts if any
 *                  3D.Create app data master records if any
 *                      3E.Update app data entity record if anything to update
 *                      3F.Create app data detail records if any
 *                          3G.Create app data detail data records if any
 *                  4.Create social record LIKE, VIEW, VIEW_ANONYMOUS, FOLLOWER, POSTS_LIKE, POSTS_VIEW and POSTS_VIEW_ANONYMOUS
 *                      4A.Create random sample
 *                          Random records are created using 2 lists of all users and creates records until two groups both have 50% samples with unique users in each sample of social type
 *                      4B.Loop random users group 1
 *                      4C.Loop random users group 2
 *                      4D.Create user like
 *                      4E.Create user view by a user
 *                      4F.Create user view by anonymous
 *                      4G.Create user follow
 *                      4H.Create user account app data post like
 *                      4I.Create user account app data post view
 *                  5.Return result
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
*          idToken:string,
*          data:{  demo_password?:string|null}}} parameters
* @returns {Promise.<server_server_response & {result?:{info: {}[]} }>}
*/
const postDemo = async parameters=> {
   /**@type{import('../socket.js')} */
   const {socketClientGet, socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
   /**@type{import('./Log.js')} */
   const Log = await import(`file://${process.cwd()}/server/db/Log.js`);
   /**@type{import('./common.js')} */
   const {getError} = await import(`file://${process.cwd()}/server/db/common.js`);
   /**@type{import('./IamUser.js')} */
   const IamUser = await import(`file://${process.cwd()}/server/db/IamUser.js`);
   /**@type{import('./IamUserApp.js')} */
   const IamUserApp = await import(`file://${process.cwd()}/server/db/IamUserApp.js`);
   /**@type{import('./IamUserLike.js')} */
   const IamUserLike = await import(`file://${process.cwd()}/server/db/IamUserLike.js`);
   /**@type{import('./IamUserView.js')} */
   const IamUserView = await import(`file://${process.cwd()}/server/db/IamUserView.js`);
   /**@type{import('./IamUserFollow.js')} */
   const IamUserFollow = await import(`file://${process.cwd()}/server/db/IamUserFollow.js`);
   /**@type{import('./IamUserAppDataPost.js')} */
   const IamUserAppDataPost = await import(`file://${process.cwd()}/server/db/IamUserAppDataPost.js`);
   /**@type{import('./IamUserAppDataPostLike.js')} */
   const IamUserAppDataPostLike = await import(`file://${process.cwd()}/server/db/IamUserAppDataPostLike.js`);
   /**@type{import('./IamUserAppDataPostView.js')} */
   const IamUserAppDataPostView = await import(`file://${process.cwd()}/server/db/IamUserAppDataPostView.js`);

   /**@type{import('./AppDataEntity.js')} */
   const AppDataEntity = await import(`file://${process.cwd()}/server/db/AppDataEntity.js`);

   /**@type{import('./AppDataResourceMaster.js')} */
   const AppDataResourceMaster = await import(`file://${process.cwd()}/server/db/AppDataResourceMaster.js`);
   /**@type{import('./AppDataResourceDetail.js')} */
   const AppDataResourceDetail = await import(`file://${process.cwd()}/server/db/AppDataResourceDetail.js`);
   /**@type{import('./AppDataResourceDetailData.js')} */
   const AppDataResourceDetailData = await import(`file://${process.cwd()}/server/db/AppDataResourceDetailData.js`);

   /**@type{import('./Config.js')} */
   const Config = await import(`file://${process.cwd()}/server/db/Config.js`);

   /**@type{import('../security.js')} */
   const {securityKeyPairCreate, securityUUIDCreate, securitySecretCreate} = await import(`file://${process.cwd()}/server/security.js`);

   const fs = await import('node:fs');
   /**@type{{[key:string]: string|number}[]} */
   const install_result = [];
   install_result.push({'start': new Date().toISOString()});
   const fileBuffer = await fs.promises.readFile(`${process.cwd()}${DB_DEMO_PATH}${DB_DEMO_FILE}`, 'utf8');
   /**@type{[server_db_database_demo_data]}*/
   const demo_users = JSON.parse(fileBuffer.toString()).demo_users;
   //create social records
   const social_types = ['LIKE', 'VIEW', 'VIEW_ANONYMOUS', 'FOLLOWER', 'POSTS_LIKE', 'POSTS_VIEW', 'POSTS_VIEW_ANONYMOUS'];
   let email_index = 1000;
   let records_iam_user = 0;
   let records_iam_user_app = 0;
   let records_iam_user_app_data_post = 0;
   let records_app_data_resource_master = 0;
   let records_app_data_resource_detail = 0;
   let records_app_data_resource_detail_data = 0;
   let install_count=0;
   const install_total_count = demo_users.length + social_types.length;
   install_count++;
   try {
       /**
        * Create demo users
        * @param {[server_db_database_demo_data]} demo_users 
        * @returns {Promise.<void>}
        */
       const create_users = async (demo_users) =>{
               /**
                * 
                * @param {server_db_database_demo_data} demo_user
                * @returns 
                */
               const create_update_id = async demo_user=>{
                   /**@type{{  username:           server_db_table_IamUser['username'],
                    *          bio:                server_db_table_IamUser['bio'],
                    *          avatar:             server_db_table_IamUser['avatar'],
                    *          password:           server_db_table_IamUser['password'],
                    *          password_reminder:  server_db_table_IamUser['password_reminder'],
                    *          email:              server_db_table_IamUser['email'],
                    *          email_unverified:   server_db_table_IamUser['email_unverified'],
                    *          active:             server_db_table_IamUser['active'],
                    *          private:            server_db_table_IamUser['private'],
                    *          user_level:         server_db_table_IamUser['user_level'],
                    *          type:               server_db_table_IamUser['type'],
                    *          verification_code:  server_db_table_IamUser['verification_code']
                    * 
                   }}*/
                   const data_create = {   username:               demo_user.username,
                                           bio:                    demo_user.bio,
                                           avatar:                 demo_user.avatar,
                                           password:               parameters.data.demo_password ?? '',
                                           password_reminder:      null,
                                           email:                  `demo${++email_index}@localhost`,
                                           email_unverified:       null,
                                           active:                 1,
                                           private:                0,
                                           user_level:             2,
                                           type:                   'USER',
                                           verification_code:      null
                                       };
                   //create iam user then database user
                   /**@ts-ignore */
                   return await IamUser.postAdmin(parameters.app_id,data_create)
                                .then(result=>{
                                    if (result.result)
                                        return result;
                                    else
                                        throw result;
                                });
               };
               for (const demo_user of demo_users){
                   demo_user.id = await create_update_id(demo_user).then(user=>user.result.insertId);
                   records_iam_user++;
               }
       };
       /**
        * Create iam user app
        * @param {number} app_id 
        * @param {number} iam_user_id
        * @returns {Promise.<server_db_common_result_insert>}
        */
       const create_iam_user_app = async (app_id, iam_user_id) =>{
           return new Promise((resolve, reject) => {
               IamUserApp.post(parameters.app_id, 
                    /**@ts-ignore */
                    {app_id:app_id, json_data:null, iam_user_id:iam_user_id})
               .then(result=>{
                   if(result.result){
                       if (result.result.affectedRows == 1)
                           records_iam_user_app++;
                       resolve(result.result);
                   }
                   else
                       reject(result);
               });
           });
       };
       /**
        * Create iam user app data post
        * @param {{ json_data:      server_db_table_IamUserAppDataPost['json_data'],
        *           iam_user_app_id:server_db_table_IamUserAppDataPost['iam_user_app_id']}} data 
        * @returns {Promise.<null>}
        */
       const create_iam_user_app_data_post = async (data) => {
           return new Promise((resolve, reject) => {
               IamUserAppDataPost.post({app_id:parameters.app_id, 
                                        /**@ts-ignore */
                                        data:data})
               .then(result=>{
                   if(result.result){
                       if (result.result.data?.affectedRows == 1)
                           records_iam_user_app_data_post++;
                       resolve(null);
                   }
                   else
                       reject(result);
               });
           });
       };

       /**
        * 
        * @param {{ json_data:                                      server_db_table_AppDataResourceMaster['json_data'],
        *           iam_user_app_id:                                server_db_table_AppDataResourceMaster['iam_user_app_id'],
        *           app_data_entity_resource_app_data_entity_id:    server_db_table_AppDataResourceMaster['app_data_entity_resource_app_data_entity_id'],
        *           app_data_entity_resource_id:                    server_db_table_AppDataResourceMaster['app_data_entity_resource_id']}} data 
        * @returns {Promise.<number>}
        */
       const create_app_data_resource_master = async data => {
           return new Promise((resolve, reject) => {
                /**@ts-ignore */
               AppDataResourceMaster.post({app_id:parameters.app_id, data:data})
               .then(result=>{
                   if(result.result){
                       if (result.result.affectedRows == 1)
                           records_app_data_resource_master++;
                       resolve(result.result.insertId);
                   }
                   else
                       reject(result);
               });
           });
       };
       /**
        * 
        * @param {{app_data_resource_master_id: number;
        *          app_data_entity_resource_app_data_entity_id: number;
        *          app_data_entity_resource_id: number;
        *          app_data_resource_master_attribute_id: number|null,
        *          json_data: server_db_table_AppDataResourceDetail['json_data'],}} data 
        * @returns {Promise.<number>}
        */
       const create_app_data_resource_detail = async data => {
            return new Promise((resolve, reject) => {
                /**@ts-ignore */
                AppDataResourceDetail.post({app_id:parameters.app_id, data:data})
                .then(result=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_app_data_resource_detail++;
                        resolve(result.result.insertId);
                    }
                    else
                        reject(result);
                });
            });
        };
       /**
        * Update app_data entity with additional keys
        * @param {number} user_account_post_app_id 
        * @param {server_db_database_demo_data['app_data_resource_master'][0]['app_data_entity']} data 
        * @returns {Promise.<number>}
        */
       const update_app_data_entity = async (user_account_post_app_id,data) => {
           const result_get = AppDataEntity.get({   app_id:user_account_post_app_id, 
                                                    /**@ts-ignore */
                                                    resource_id:data.id, 
                                                    data:{data_app_id:null}});
           if(result_get.result){
               const update_json_data = result_get.result[0].json_data;
               for (const key of Object.entries(data??{}))
                   //skip PK
                   if (key[0]!='id')
                       update_json_data[key[0]] = key[1];
               const result_update = await AppDataEntity.update({   app_id:user_account_post_app_id, 
                                                                           /**@ts-ignore */
                                                                           resource_id:data.id, 
                                                                           /**@ts-ignore */
                                                                           data:{json_data:update_json_data}});
               if(result_update.result){
                   if (result_update.result.affectedRows == 1)
                       records_app_data_resource_detail++;
                   return result_update.result.affectedRows;
               }
               else
                   throw result_update;
           }
           else
               throw result_get;
       };

       /**
        * 
        * @param {number} user_account_post_app_id 
        * @param {{ json_data: server_db_table_AppDataResourceDetailData['json_data'],
        *           app_data_resource_detail_id: server_db_table_AppDataResourceDetailData['app_data_resource_detail_id'],
        *           app_data_resource_master_attribute_id:server_db_table_AppDataResourceDetailData['app_data_resource_master_attribute_id']}} data 
        * @returns {Promise.<number>}
        */
       const create_app_data_resource_detail_data = async (user_account_post_app_id, data) => {
            return new Promise((resolve, reject) => {
                /**@ts-ignore */
                AppDataResourceDetailData.post({app_id:user_account_post_app_id, data:data})
                .then(result=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_app_data_resource_detail_data++;
                        resolve(result.result.insertId);
                    }
                    else
                        reject(result);
                });
            });
       };

       //1.Create all users first and update with id
       await create_users(demo_users);
       
       //2.Generate key pairs for each user that can be saved both in resource and apps configuration
       //Use same for all demo users since key creation can be slow
       socketAdminSend({   app_id:parameters.app_id, 
                           idToken:parameters.idToken,
                           data:{  app_id:null,
                                   client_id:socketClientGet(parameters.idToken),
                                   broadcast_type:'PROGRESS',
                                   broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:install_total_count, text:'Generating key pair...'})).toString('base64')
                               }});
       const {publicKey, privateKey} = await securityKeyPairCreate();
       const demo_public_key = publicKey;
       const demo_private_key = privateKey;
       //3.Loop users created
       for (const demo_user of demo_users){
           socketAdminSend({   app_id:parameters.app_id, 
                               idToken:parameters.idToken,
                               data:{  app_id:null,        
                                       client_id:socketClientGet(parameters.idToken),
                                       broadcast_type:'PROGRESS',
                                       broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:install_total_count, text:demo_user.username})).toString('base64')
                               }
                           });
           install_count++;

           //3A.Generate vpa for each user that can be saved both in resource and apps configuration
           const demo_vpa = securityUUIDCreate();
           //3B.Create iam_user_app record
           const iam_user_app_id = await create_iam_user_app(demo_user.iam_user_app.app_id, demo_user.id).then(result=>{
            if (result)
                return result.insertId;
            else
                throw getError(parameters.app_id, 500, '');
           });
                                                    
                
           //3C.Create user posts if any
           for (const demo_user_account_app_data_post of demo_user.iam_user_app_data_post){
               let settings_header_image;
               //use file in settings or if missing then use filename same as demo username
               if (demo_user_account_app_data_post.json_data.image_header_image_img)
                   settings_header_image = `${demo_user_account_app_data_post.json_data.image_header_image_img}.webp`;
               else
                   settings_header_image = `${demo_user.username}.webp`;
               /**@type{Buffer} */
               const image = await fs.promises.readFile(`${process.cwd()}${DB_DEMO_PATH}${settings_header_image}`);
               /**@ts-ignore */
               const image_string = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
               //update settings with loaded image into BASE64 format
               demo_user_account_app_data_post.json_data.image_header_image_img = image_string;
               //use random day and month themes
               //day 10001-10010
               demo_user_account_app_data_post.json_data.design_theme_day_id = Math.floor(10001 + Math.random() * 10);
               //month 20001-20022
               demo_user_account_app_data_post.json_data.design_theme_month_id = Math.floor(20001 + Math.random() * 22);
               demo_user_account_app_data_post.json_data.design_theme_year_id = 30001;
               const json_data_user_account_app_data_post = {
                                               json_data: JSON.parse(JSON.stringify(demo_user_account_app_data_post.json_data)),
                                               iam_user_app_id: iam_user_app_id
                                           };	
                                                    /**@ts-ignore */
               await create_iam_user_app_data_post(json_data_user_account_app_data_post);
           }
           /**
            * Updates resource values
            * @param {*} resource
            * @returns {Promise.<{[key:string]:string}>} 
            */
           const demo_data_update = async resource => {
               /**
                * 
                * @param {[string, string]} key_name 
                * @returns {string}
                */
               const value_set = key_name =>{
                       switch (key_name[1]){
                           case '<DATE_NOW/>':
                               return Date.now().toString();
                           case '<DATE_NOW_PADSTART_16/>':
                               return Date.now().toString().padStart(16,'0');
                           case '<DATE_ISO/>':
                               return new Date().toISOString();
                           case '<UUID/>':
                               return demo_vpa;
                           case '<SECRET/>':
                               return securitySecretCreate();
                           case '<PUBLIC_KEY/>':
                               return demo_public_key;
                           case '<PRIVATE_KEY/>':
                               return demo_private_key;
                           case '<USER_ACCOUNT_ID/>':
                               return demo_user.id.toString();
                           default:{
                               //replace if containing HOST parameter
                               if (key_name[1]!=null && typeof key_name[1]=='string' && key_name[1].indexOf('<HOST/>')>-1)
                                   return key_name[1]?.replaceAll('<HOST/>', Config.get('ConfigServer','SERVER','HOST') ?? '');
                               else
                                   return key_name[1];
                           }        
                       }
               };
               //loop json_data keys
               for (const key of Object.entries(resource.json_data)){
                   resource.json_data[key[0]] = value_set(key);
               }
               return resource.json_data;
           };
           //3D.Create app data master records if any
           for (const resource_master of demo_user.app_data_resource_master ?? []){
               const data = {  
                               iam_user_app_id:                                 iam_user_app_id,
                               app_data_entity_resource_app_data_entity_id:     resource_master.app_data_entity_resource_app_data_entity_id,
                               app_data_entity_resource_id:                     resource_master.app_data_entity_resource_id,
                               json_data:                                       await demo_data_update(resource_master)
               };
               /**@ts-ignore */
               const master_id = await create_app_data_resource_master(data);
               //3E.Update app data entity record if anything to update
               if (resource_master.app_data_entity && resource_master.app_data_entity.id){
                   //set values used in app data master
                   for (const key of Object.entries(data.json_data)){
                       if (key[0]!='id' &&
                           (key[0]=='merchant_id' ||
                           key[0]=='merchant_name' ||
                           key[0]=='merchant_api_url_payment_request_create' ||
                           key[0]=='merchant_api_url_payment_request_get_status' ||
                           key[0]=='merchant_api_secret' ||
                           key[0]=='merchant_public_key' ||
                           key[0]=='merchant_private_key' ||
                           key[0]=='merchant_vpa')
                       )
                           resource_master.app_data_entity[key[0]] = key[1];
                   }
                   //set demo user id values in app data entity if used
                   if (resource_master.app_data_entity.iam_user_id_owner)
                       resource_master.app_data_entity.iam_user_id_owner = demo_user.id;
                   if (resource_master.app_data_entity.iam_user_id_anonymous)
                       resource_master.app_data_entity.iam_user_id_anonymous = demo_user.id;
                   await update_app_data_entity(parameters.app_id, resource_master.app_data_entity);
               }
                   
               //3F.Create app data detail records if any
               for (const resource_detail of resource_master.app_data_resource_detail ?? []){
                   const data = {  app_data_resource_master_id                     : master_id,
                                   app_data_entity_resource_id                     : resource_detail.app_data_entity_resource_id,
                                   app_data_entity_resource_app_data_entity_id     : resource_detail.app_data_entity_resource_app_data_entity_id,
                                   app_data_resource_master_attribute_id           : resource_detail.app_data_resource_master_attribute_id,
                                   json_data                                       : await demo_data_update(resource_detail)
                                   };
                   const detail_id = await create_app_data_resource_detail(data);
                   //3G.Create app data detail data records if any
                   for (const resource_detail_data of resource_detail.app_data_resource_detail_data ?? []){
                       const data ={   app_data_resource_detail_id             : detail_id,
                                       app_data_resource_master_attribute_id   : resource_detail_data.app_data_resource_master_attribute_id,
                                       json_data                               : await demo_data_update(resource_detail_data)
                                       };
                       create_app_data_resource_detail_data(parameters.app_id, data);
                   }
               }
           }
       }
       let records_iam_user_like = 0;
       let records_iam_user_view = 0;
       let records_iam_user_follow = 0;
       let records_iam_user_app_data_post_like = 0;
       let records_iam_user_app_data_post_view = 0;
       
       /**
        * Create like user
        * @param {number} app_id 
        * @param {number} id 
        * @param {number} id_like 
        * @returns {Promise.<null>}
        */
       const create_iam_user_like = async (app_id, id, id_like ) =>{
           return new Promise((resolve, reject) => {
                /**@ts-ignore */
                IamUserLike.post({app_id:app_id, data:{iam_user_id:id,iam_user_id_like:id_like}})
                .then(result => {
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_iam_user_like++;
                        resolve(null);
                    }
                    else
                        reject(result);
                });
            });
       };
       /**
        * Create user account view
        * @param {number} app_id 
        * @param {{ iam_user_id: server_db_table_IamUserView['iam_user_id'],
        *           iam_user_id_view: server_db_table_IamUserView['iam_user_id_view'],
        *           client_ip: server_db_table_IamUserView['client_ip'],
        *           client_user_agent:server_db_table_IamUserView['client_user_agent']}} data 
        * @returns {Promise.<null>}
        */
       const create_iam_user_view = async (app_id, data ) =>{
           return new Promise((resolve, reject) => {
                /**@ts-ignore */
               IamUserView.post(app_id, data)
               .then(result => {
                   if(result.result){
                       if (result.result.affectedRows == 1)
                               records_iam_user_view++;
                       resolve(null);
                   }
                   else
                       reject(result);
               });
           });
       };
       /**
        * Create user acccount follow
        * @param {number} app_id 
        * @param {number} id 
        * @param {number} id_follow 
        * @returns {Promise.<null>}
        */
       const create_iam_user_follow = async (app_id, id, id_follow ) =>{
           return new Promise((resolve, reject) => {
               IamUserFollow.post({app_id:app_id, 
                                    /**@ts-ignore */
                                    data:{iam_user_id:id, iam_user_id_follow:id_follow}})
               .then(result=>{
                   if(result.result){
                       if (result.result.affectedRows == 1)
                           records_iam_user_follow++;
                       resolve(null);
                   }
                   else
                       reject(result);
               });
           });
       };
       /**
        * Create user account app setting like
        * @param {number} app_id 
        * @param {number} user1 
        * @param {number} user2 
        * @returns {Promise.<null>}
        */
       const create_iam_user_app_data_post_like = async (app_id, user1, user2 ) =>{
           return new Promise((resolve, reject) => {
               const result_posts = IamUserAppDataPost.get({app_id:parameters.app_id, resource_id:null, data:{iam_user_id:user1,data_app_id:app_id}});
                if (result_posts.result){
                    const random_posts_index = Math.floor(1 + Math.random() * result_posts.result.length - 1 );
                    IamUserAppDataPostLike.post({app_id:parameters.app_id, 
                                                            /**@ts-ignore */
                                                            data:{  iam_user_app_id:IamUserApp.get({app_id:app_id, resource_id:null, data:{iam_user_id:user2, data_app_id:app_id}}).result[0].id,
                                                                    iam_user_app_data_post_id:result_posts.result[random_posts_index].id}})
                    .then(result => {
                        if (result.result){
                            if (result.result.affectedRows == 1)
                                records_iam_user_app_data_post_like++;
                            resolve(null);
                        }
                        else
                            reject(result_posts);
                    });
                }
                else
                    reject(result_posts);
           });
       };
       /**
        * Create user account app setting view
        * @param {number} app_id 
        * @param {number} user1 
        * @param {number} user2 
        * @param {string} social_type 
        * @returns {Promise.<null>}
        */
       const create_iam_user_app_data_post_view = async (app_id, user1, user2 , social_type) =>{
           return new Promise((resolve, reject) => {
               const result_posts = IamUserAppDataPost.get({app_id:parameters.app_id, resource_id:null, data:{iam_user_id:user1, data_app_id:app_id}});
                if (result_posts.result){
                    //choose random post from user
                    const random_index = Math.floor(1 + Math.random() * result_posts.result.length -1);
                    let iam_user_id;
                    if (social_type == 'POSTS_VIEW')
                        iam_user_id = user2;
                    else
                        iam_user_id = null;
                    /**@ts-ignore */
                    IamUserAppDataPostView.post(parameters.app_id, {iam_user_app_id: iam_user_id?IamUserApp.get({app_id:app_id, resource_id:null, data:{iam_user_id:user2, data_app_id:app_id}}).result[0].id:null,
                                                                    iam_user_app_data_post_id: result_posts.result[random_index].id,
                                                                    client_ip: null,
                                                                    client_user_agent: null
                                                                    })
                    .then(result=>{
                        if (result.result){
                            if (result.result.affectedRows == 1)
                                records_iam_user_app_data_post_view++;
                            resolve(null);
                        }
                        else
                            reject(result);
                    });
                }
                else
                    reject(result_posts);
           });
       };
       //4.Create social record
       for (const social_type of social_types){
           socketAdminSend({   app_id:parameters.app_id, 
                               idToken:parameters.idToken,
                               data:{  app_id:null,
                                       client_id:socketClientGet(parameters.idToken),
                                       broadcast_type:'PROGRESS',
                                       broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:install_total_count, text:social_type})).toString('base64')
                               }
                           });
           //4A.Create random sample
           install_count++;
           //select new random sample for each social type
           /**@type{[number]|[]} */
           const random_users1 = [];
           /**@type{[number]|[]} */
           const random_users2 = [];
           //loop until two groups both have 50% samples with unique users in each sample
           const sample_amount = Math.floor(demo_users.length * 0.5);
           while (random_users1.length < sample_amount || random_users2.length < sample_amount){
               const random_array_index1 = Math.floor(1 + Math.random() * demo_users.length - 1 );
               const random_array_index2 = Math.floor(1 + Math.random() * demo_users.length - 1 );
               const random_include_id1 = demo_users[random_array_index1].id;
               /**@ts-ignore */
               if (random_users1.length <sample_amount && !random_users1.includes(random_include_id1) ){
                   /**@ts-ignore */
                   random_users1.push(demo_users[random_array_index1].id);
               }
               /**@ts-ignore */
               if (random_users2.length <sample_amount && !random_users2.includes(demo_users[random_array_index2].id)){
                   /**@ts-ignore */
                   random_users2.push(demo_users[random_array_index2].id);
               }
           }
           //4B.Loop random users group 1
           for (const user1 of random_users1){
               //4C.Loop random users group 2
               for(const user2 of random_users2){
                   switch (social_type){
                       case 'LIKE':{
                           //4D.Create user like
                           await create_iam_user_like(parameters.app_id, user1, user2);
                           break;
                       }
                       case 'VIEW':{
                           //4E.Create user view by a user
                           await create_iam_user_view(parameters.app_id, 
                                                           {   iam_user_id: user1,
                                                               iam_user_id_view: user2,
                                                               client_ip: null,
                                                               client_user_agent: null
                                                           });
                           break;
                       }
                       case 'VIEW_ANONYMOUS':{
                           //4F.Create user view by anonymous
                           await create_iam_user_view(parameters.app_id, 
                                                           {
                                                               iam_user_id: null,
                                                               iam_user_id_view: user1,
                                                               client_ip: null,
                                                               client_user_agent: null
                                                           });
                           break;
                       }
                       case 'FOLLOWER':{
                           //4G.Create user follow
                           await create_iam_user_follow(parameters.app_id, user1, user2);
                           break;
                       }
                       case 'POSTS_LIKE':{
                           //4H.Create user account app data post like
                           //pick a random user setting from the user and return the app_id
                           const user_account_app_data_posts = demo_users.filter(user=>user.id == user1)[0].iam_user_app_data_post;
                           if (user_account_app_data_posts.length>0){
                               const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].app_id;
                               await create_iam_user_app_data_post_like(settings_app_id, user1, user2);
                           }
                           break;
                       }
                       case 'POSTS_VIEW':
                       case 'POSTS_VIEW_ANONYMOUS':{
                           //4I.Create user account app data post view
                           //pick a random user setting from the user and return the app_id
                           const user_account_app_data_posts = demo_users.filter(user=>user.id == user1)[0].iam_user_app_data_post;
                           if (user_account_app_data_posts.length>0){
                               const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].app_id;
                               await create_iam_user_app_data_post_view(settings_app_id, user1, user2 , social_type) ;
                           }
                           break;
                       }
                   }						
               }
           }
       }
       //5.Return result
       install_result.push({'iam_user': records_iam_user});
       install_result.push({'iam_user_app': records_iam_user_app});
       install_result.push({'iam_user_like': records_iam_user_like});
       install_result.push({'iam_user_view': records_iam_user_view});
       install_result.push({'iam_user_follow': records_iam_user_follow});
       install_result.push({'iam_user_app_data_post': records_iam_user_app_data_post});
       install_result.push({'iam_user_app_data_post_like': records_iam_user_app_data_post_like});
       install_result.push({'iam_user_app_data_post_view': records_iam_user_app_data_post_view});
       install_result.push({'app_data_resource_master': records_app_data_resource_master});
       install_result.push({'app_data_resource_detail': records_app_data_resource_detail});
       install_result.push({'app_data_resource_detail_data': records_app_data_resource_detail_data});
       install_result.push({'finished': new Date().toISOString()});
       Log.postServerI(`Demo install result: ${install_result.reduce((result, current)=> result += `${Object.keys(current)[0]}:${Object.values(current)[0]} `, '')}`);
       return {result:{info: install_result}, type:'JSON'};
   } catch (error) {
       /**@ts-ignore */
       return error.http?error:getError(parameters.app_id, 500, error);
   }
   
};
/**
* @name dbDemoUninstall
* @description Demo uninstall
*              Deletes all demo users and send server side events of progress
* @function
* @memberof ROUTE_REST_API
* @param {{app_id:number,
*          idToken:string}} parameters
* @returns {Promise.<server_server_response & {result?:{info: {}[]} }>}
*/
const deleteDemo = async parameters => {
   /**@type{import('../socket.js')} */
   const {socketClientGet, socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
   /**@type{import('./Log.js')} */
   const Log = await import(`file://${process.cwd()}/server/db/Log.js`);
   /**@type{import('./IamUser.js')} */
   const IamUser = await import(`file://${process.cwd()}/server/db/IamUser.js`);
   /**@type{import('./common.js')} */
   const {getError} = await import(`file://${process.cwd()}/server/db/common.js`);
   
   const result_demo_users = IamUser.get(parameters.app_id, null).result.filter((/**@type{server_db_table_IamUser}*/row)=>row.user_level==2);
   if (result_demo_users){
       let deleted_user = 0;
       if (result_demo_users.length>0){
           const delete_users = async () => {
               for (const user of result_demo_users){
                   socketAdminSend({   app_id:parameters.app_id, 
                                       idToken:parameters.idToken,
                                       data:{  app_id:null,
                                               client_id:socketClientGet(parameters.idToken),
                                               broadcast_type:'PROGRESS',
                                               broadcast_message:Buffer.from(JSON.stringify({part:deleted_user, total:result_demo_users.length, text:user.username})).toString('base64')
                                       }
                                   });
                    //delete iam user
                    await IamUser.deleteRecordAdmin(parameters.app_id,user.id)
                    .then((result)=>{
                        if (result.result )
                            deleted_user++;
                    });
               }
           };
           await delete_users().catch(error=>{
               if (error.http)
                   throw error;
               else
                   throw getError(parameters.app_id, 500, error);
           });
           //set demo key values to null
           /**@type{import('./AppDataEntity.js')} */
           const AppDataEntity = await import(`file://${process.cwd()}/server/db/AppDataEntity.js`);
           const result_get = AppDataEntity.get({ app_id:parameters.app_id, resource_id:null, data:{data_app_id:null}});
           if(result_get.result){
               for (const row of result_get.result){
                   const update_json_data = JSON.parse(row.json_data);
                   for (const key of Object.entries(update_json_data??{})){
                       if (key[0]=='iam_user_id_owner' ||
                           key[0]=='merchant_id' ||
                           key[0]=='merchant_name' ||
                           key[0]=='merchant_api_url_payment_request_create' ||
                           key[0]=='merchant_api_url_payment_request_get_status' ||
                           key[0]=='merchant_api_secret' ||
                           key[0]=='merchant_public_key' ||
                           key[0]=='merchant_private_key' ||
                           key[0]=='merchant_vpa' ||
                           key[0]=='iam_user_id_anonymous' 
                       )
                           update_json_data[key[0]] = null;
                   }
                   await AppDataEntity.update({ app_id:parameters.app_id,
                                                resource_id:row.id,
                                                /**@ts-ignore */
                                                data:{json_data:update_json_data}});
               }
           }
           else
               throw result_get;
           Log.postServerI(`Demo uninstall count: ${deleted_user}`);
           return {result:{info: [{'count': deleted_user}]}, type:'JSON'};
       }
       else{
           Log.postServerI(`Demo uninstall count: ${result_demo_users.length}`);
           return {result:{info: [{'count': result_demo_users.length}]},type:'JSON'};
       }
   }
   else
       return result_demo_users;
};


export {
        fileRecord, filePath, fileCache, fileFsRead, fileFsDir, fileFsWrite, fileFSDirDataExists, fileFsAccessMkdir, fileFsWriteAdmin, fileFsDeleteAdmin,
        fileFsDBLogGet, fileFsDBLogPost,
        fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete, fileCommonExecute,
        getError,
        fileDbInit,
        getViewInfo, getViewObjects, 
        postDemo, deleteDemo};