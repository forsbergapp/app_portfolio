/** 
 *  Database using race condition, pessimistic lock, constraints and database transaction pattern
 *  Tables implemented using object mapping relation (ORM), PK and UK patterns
 *  See data Model for an overview.
 *  
 *  File types supported
 *  DOCUMENT        json
 *                  uses getFsFile and updateFsFile by admin and config files
 *  TABLE           json that can be managed as table and implemented using object mapping relation (ORM) pattern
 *                  consists of 3 layers
 *                  App layer
 *                  *.js                app logic, ex iamAuthenticateUser() in /server/iam.js
 *                  Object layer
 *                  /server/db/*.js     data model API with constraints, ex IamUser() in /server/db/IamUser.js
 *                                      returns server response format
 *                  Database layer
 *                  ORM.js              file management API using async Execute() with file read and write
 *                                      and getObject() reading directly from cached object in memory using closure pattern
 *                                      in /server/db/ORM.js
 *                                      manages objects, constraints, transactions with commit and rollback
 *                                      returns database result
 * 
 *                  Explanation Execute():
 *                                  getObject               reads file content from `cache_content` and should be used by default for performance
 *                                                          so a synchronous function can be used and to avoid disk read
 *                                                          since TABLE files stores new content in `cache_content` after each change
 *                                  getFsFile              reads file content from file, 
 *                                                          used at transaction start,in microservice that does not read `cache_content`
 *                                                          from other server process and at server start
 *                                  postObject              saves file content to file and updates `cachec_content`
 *                                  updateObject            saves file content to file and updates `cache_content`
 *                                  deleteObject            saves file content to file and updates `cache_content`
 *                                  fileConstraints         checks constraints for postObject and deleteObject
 *                                  fileTransactionStart    reads and sets `transaction_id` and `lock` key in DB and 
 *                                                          uses setTimeout loop until lock is available,
 *                                                          waits maximum 10 seconds for lock,
 *                                                          saves file content in `transaction_content` that is used to rollback info if
 *                                                          something goes wrong and can also be used for debugging purpose
 *                                  fileTransactionCommit   empties `transaction_id`, `transaction_content` and sets `lock =0`
 *                                  fileTransactionRollback empties `transaction_id`, `transaction_content` and sets `lock =0`
 *  TABLE_LOG       json records, comma separated
 *                  uses getFsLog and postFsLog
 *  TABLE_LOG_DATE  json record, comma separateed with file name suffixes
 *                  uses fileFsLogGet, postFsLog and fileSuffix
 *  Admin can also use postFsAdmin and deleteFsAdmin without transaction if needed
 * 
 * @module server/db/ORM
 */

/**
 * @import {server_server_response, server_server_error,
 *          server_DbObject, server_DbObject_record, 
 *          server_db_result_fileFsRead,
 *          server_db_common_result_select, server_db_common_result_update, server_db_common_result_delete,server_db_common_result_insert} from '../types.js'
 */

const fs = await import('node:fs');

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
 * @name getObjectRecord
 * @description Get file record from file db
 * @function
 * @param {server_DbObject} filename 
 * @returns {server_DbObject_record}
 */
const getObjectRecord = filename =>JSON.parse(JSON.stringify(DB.data.filter(file_db=>file_db.name == filename)[0]));

/**
 * @name fileRecordFilename
 * @description Get filename from file db for given file
 * @function
 * @param {server_DbObject} file
 * @returns {{filename:string, suffix:string}}
 */
const fileRecordFilename = file => {const record = getObjectRecord(file);
                                    return {filename:file, 
                                            suffix:record.type.startsWith('TABLE_LOG')?
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
    const record = DB.data.filter(file_db=>file_db.name == file)[0];
    const transaction = async ()=>{
        const transaction_id = Date.now();
        record.transaction_id = transaction_id;
        const file_content = await fs.promises.readFile(process.cwd() + filepath, 'utf8').catch(()=>'');
        //parse TABLE and DOCUMENT, others are binary or json log files
        record.transaction_content = (record.type=='TABLE' || record.type=='DOCUMENT')?JSON.parse(file_content==''?'[]':file_content):file_content;
        return transaction_id;
    };
    return new Promise((resolve, reject)=>{
        if  (record.lock==0){
            record.lock = 1;
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
                    if (record.lock==0){
                        record.lock = 1;
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
 * @description Transaction commit
 * @function
 * @param {server_DbObject} file 
 * @param {number} transaction_id 
 * @param {*} [cache_content]
 * @returns {boolean}
 */
const fileTransactionCommit = (file, transaction_id, cache_content=null)=>{
    const record = DB.data.filter(file_db=>file_db.name == file)[0];
    if (record.transaction_id==transaction_id){
        record.lock = 0;
        record.transaction_id = null;
        record.transaction_content = null;
        if (cache_content)
            record.cache_content = cache_content;
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
    const record = DB.data.filter(file_db=>file_db.name == file)[0];
    if (record.transaction_id==transaction_id){
        record.lock = 0;
        record.transaction_id = null;
        record.transaction_content = null;
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
 * @name getFsPath
 * @description Returns file path for given file
 * @function
 * @param {server_DbObject} file 
 * @returns {string}
 */
const getFsPath = file =>DB_DIR.db + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;

/**
 * @name getFsDir
 * @description Get files from directory
 * @function
 * @returns {Promise.<string[]>}
 */
const getFsDir = async () => await fs.promises.readdir(`${process.cwd()}${DB_DIR.db}`);
/**
 * @name getFsFile
 * @description Returns file content for given file
 *              Specify lock=true when updating a file to get transaction id 
 *              when file is available to update.
 *              Function returns file content after a lock of file and transaction id is given, lock info and transaction id.
 *              This transaction id must be provided when updating file in updateFsFile()
 * @function
 * @param {server_DbObject} file 
 * @param {boolean} lock
 * @returns {Promise.<server_db_result_fileFsRead>}
 */
const getFsFile = async (file, lock=false) =>{
    const filepath = DB_DIR.db + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;
    if (lock){
        const transaction_id = await fileTransactionStart(file, filepath);
        return {   file_content:    getObjectRecord(file).transaction_content,
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
 * @name updateFsFile
 * @description Writes file
 *              Must specify valid transaction id given from getFsFile()
 *              to be able to update a file
 *              Backup of old file will be written to backup directory
 * @function
 * @param {server_DbObject} file 
 * @param {number|null} transaction_id 
 * @param {[]} file_content 
 * @returns {Promise.<string|null>}
 */

const updateFsFile = async (file, transaction_id, file_content) =>{  
    const record = getObjectRecord(file);
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
            if (fileTransactionCommit(file, transaction_id, file_content))
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
 * @name getFsDataExists
 * @description Checks if /data directory is created
 * @function
 * @returns {Promise<boolean>}
 */
const getFsDataExists = async () => {
    
    try {
        await fs.promises.access(process.cwd() + '/data');
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * @name postFsDir
 * @description Created directories and should be used only when server is started first time
 * @function
 * @param {string[]} paths
 * @returns{Promise.<void>}
 */
const postFsDir = async paths => {
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
 * @name postFsAdmin
 * @description Write to a file in database
 *              Should only be used by admin since no transaction is used
 * @function
 * @param {server_DbObject} file 
 * @param {{}} file_content 
 * @returns {Promise.<void>}
 */
const postFsAdmin = async (file, file_content) =>{
    await fs.promises.writeFile(process.cwd() + 
                                DB_DIR.db +
                                fileRecordFilename(file).filename + fileRecordFilename(file).suffix, 
                                file_content?JSON.stringify(file_content, undefined, 2):'',  'utf8')
    .catch((error)=> {
        throw error;
    });
    if (DB.data.filter(file_db=>file_db.name == file)[0].cache_content)
        DB.data.filter(file_db=>file_db.name == file)[0].cache_content = file_content;
};

/**
 * @name deleteFsAdmin
 * @description Delete a file in database
 * @function
 * @param {server_DbObject} file 
 * @returns {Promise.<void>}
 */
const deleteFsAdmin = async file => {                                 
    const filepath =    process.cwd() + 
                        DB_DIR.db +
                        fileRecordFilename(file).filename + fileRecordFilename(file).suffix;
    await fs.promises.rm(filepath)
            .then(()=>{if (DB.data.filter(file_db=>file_db.name == file)[0].cache_content)
                        DB.data.filter(file_db=>file_db.name == file)[0].cache_content = null;
            })
            .catch((error=>{throw error;}));
};

 /**
  * @name getFsLog
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
 const getFsLog = async (app_id, file, resource_id, filenamepartition=null, sample=null) =>{
    const record = fileRecordFilename(file);
    const filepath = `${record.filename}_${fileNamePartition(filenamepartition, sample)}${record.suffix}`;
    const fileBuffer = await fs.promises.readFile(process.cwd() + DB_DIR.db + filepath, 'utf8');
    return {rows:fileBuffer.toString().split('\r\n').filter(row=>row !='').map(row=>row = JSON.parse(row)).filter(row=>row.id == (resource_id??row.id))};
};
/**
 * @name postFsLog
 * @description Create log record with given suffix or none
 * @function
 * @param {number|null} app_id
 * @param {server_DbObject} file
 * @param {object} file_content 
 * @param {string|null} filenamepartition
 * @returns {Promise.<server_db_common_result_insert>}
 */
const postFsLog = async (app_id, file, file_content, filenamepartition = null) =>{

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
 * @name getObjectDocument
 * @description Get document from cache already JSON parsed
 * @function
 * @param {server_DbObject} file
 * @returns {*}
 */
const getObjectDocument = file => JSON.parse(JSON.stringify(DB.data.filter(object=>object.name == file && object.type=='DOCUMENT')[0].cache_content));

/**
 * @name getObject
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
const getObject = (app_id, table, resource_id, data_app_id) =>{
    try {
        //copy array using JON.stringify and JSON.parse since spread operator, Array.from() and Object.assign({},array) do not work
        /**@type{*} */
        const records = JSON.parse(JSON.stringify(DB.data.filter(object=>object.name == table && object.type=='TABLE')[0].cache_content.filter((/**@type{*}*/row)=> row.id ==(resource_id ?? row.id) && row.app_id == (data_app_id ?? row.app_id))))
                        .map((/**@type{*}*/row)=>{
                            if ('json_data' in row)
                                return {...row,
                                        ...{...row.json_data}
                                };
                            else
                                return row;
                        });
        
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
    const filerecord = getObjectRecord(table);
    //update of PK not alllowed
    if (dml=='POST' && filerecord.pk && table_rows.some((/**@type{server_DbObject_record}*/record)=>
        /**@ts-ignore */
        record[filerecord.pk]==data[filerecord.pk]))
            return false;
    else{
        //no record can exist having given values for POST
        if (dml=='POST' && filerecord.uk && table_rows.some((/**@type{server_DbObject_record}*/record)=>
            //ignore empty value
            /**@ts-ignore */
            filerecord.uk?.filter(column=>record[column] && record[column]==data[column]).length==filerecord.uk?.length))
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
 * @name postObject
 * @description Creates a record in a TABLE
 *              and returns the record
 * @function
 * @param {number} app_id
 * @param {server_DbObject} table
 * @param {*} data
 * @returns {Promise.<server_db_common_result_insert>}
 */
const postObject = async (app_id, table, data) =>{
    if (app_id!=null){
        /**@type{server_db_result_fileFsRead} */
        const file = await getFsFile(table, true);
        if (fileConstraints(table, file.file_content, data, 'POST')){
            await updateFsFile(table, file.transaction_id, file.file_content.concat(data))
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
 * @name updateObject
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
const updateObject = async (app_id, table, resource_id, data_app_id, data) =>{
    if (app_id!=null){
        /**@type{server_db_result_fileFsRead} */
        const file = await getFsFile(table, true);
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
                await updateFsFile(table, file.transaction_id, file.file_content)
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
 * @name deleteObject
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
const deleteObject = async (app_id, table, resource_id, data_app_id) =>{
    /**@type{server_db_result_fileFsRead} */
    const file = await getFsFile(table, true);
    if (file.file_content.filter((/**@type{*}*/row)=>(data_app_id==null && row.id==resource_id && resource_id!=null)|| (resource_id==null && row.app_id == data_app_id && data_app_id != null)).length>0){
        await updateFsFile(  table, 
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
 * @name Execute
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
const Execute = async parameters =>{
    /**@type{import('./Log.js')} */
    const Log = await import(`file://${process.cwd()}/server/db/Log.js`);
    try{
        if (parameters.dml!='UPDATE' && parameters.dml!='POST' && parameters.dml!='DELETE'){
            /**@type{import('../iam.js')} */
            const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
            throw iamUtilMessageNotAuthorized();
        }
        else{
            const result =  parameters.dml=='UPDATE'?  await updateObject(  parameters.app_id, 
                                                                            parameters.object, 
                                                                            parameters.update?.resource_id??null, 
                                                                            parameters.update?.data_app_id??null, 
                                                                            parameters.update?.data):
                            parameters.dml=='POST'?    await postObject(    parameters.app_id,   
                                                                            parameters.object, 
                                                                            parameters.post?.data):
                                await deleteObject(                         parameters.app_id, 
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
 * @name Init
 * @description Load default database or read existing from disk. Set cache for files in existing database using `cache_content` key to increase performance
 * @function
 * @param {server_DbObject[]|null} default_db
 * @returns {Promise.<void>}
 */
 const Init = async (default_db=null) => {
    
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


export {
        getFsPath, getFsFile, getFsDir, getFsDataExists, postFsDir, updateFsFile, 
        postFsAdmin, deleteFsAdmin,
        getFsLog, postFsLog,
        getObjectDocument,
        getObject, Execute,
        getError,
        Init,
        getViewInfo, getViewObjects};