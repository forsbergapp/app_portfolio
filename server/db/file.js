/** 
 *  File database using race condition, pessimistic lock, constraints and database transaction pattern
 *  Database files are saved in /data/db
 *  /data directory is created automatically first server start
 *  Tables implemented using object mapping relation (ORM), PK and UK patterns
 *  each TABLE has fileModel*.js file with methods
 *  LOG*, CONFIG* and MESSAGE_QUEUE* tables use subtypes and common fileModel*.js files.
 *  See ER Model for an overview.
 *  
 *  File types supported
 *  DOCUMENT        json
 *                  uses fileFsRead and fileFsWrite by admin and config files
 *  TABLE           json that can be managed as table and implemented using object mapping relation (ORM) pattern
 *                  so each table is mapped to one fileModel*.js
 *                  consists of 3 layers
 *                  *.js            app logic that transforms and filter data, ex iamUserGet() in /server/iam.js
 *                  fileModel*.js   data model API with constraints, ex fileModelIamUser() in /server/db/fileModelIamUser.js
 *                  file.js         file management API, ex fileDBGet() in /server/db/file.js
 *                                  fileDBGet               reads file content from `cache_content` and should be used by default for performance
 *                                                          so a synchronous function can be used and to avoid disk read
 *                                                          since TABLE files stores new content in `cache_content` after each change
 *                                  fileFsRead              reads file content from file, 
 *                                                          used at transaction start,in microservice that does not read `cache_content`
 *                                                          from other server process and at server start
 *                                  fileDBPost              saves file content to file and updates `cachec_content`
 *                                  fileDBUpdate            saves file content to file and updates `cache_content`
 *                                  fileDBDelete            saves file content to file and updates `cache_content`
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
 *  BINARY          used by sqLite database and fileModel*.js file not implemented
 *  Admin can also use fileFsWriteAdmin and fileFsDeleteAdmin without transaction if needed
 * 
 * @module server/db/file 
 */

/**
 * @import {server_db_result_fileFsRead,
 *          server_db_common_result_select, server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete,
 *          server_server_error, server_db_config_files, server_db_object, server_db_object_record} from '../types.js'
 */

const fs = await import('node:fs');

/**
 * @name DB
 * @description File database using ORM pattern, is loaded from external file at server start
 * @constant
 * @type{{data:server_db_object_record[]}}
 */
const DB = {data: []};
Object.seal(DB);

/**
 * @name fileRecord
 * @description Get file record from file db
 * @function
 * @param {server_db_object} filename 
 * @returns {server_db_object_record}
 */
const fileRecord = filename =>DB.data.filter(file_db=>file_db.name == filename)[0];

/**
 * @name fileRecordFilename
 * @description Get filename from file db for given file
 * @function
 * @param {server_db_object} file
 * @returns {{filename:string, suffix:string}}
 */
const fileRecordFilename = file => {return {filename:file.toLowerCase(), suffix:fileRecord(file).type=='BINARY'?'':fileRecord(file).type.startsWith('TABLE_LOG')?'.log':'.json'};};

/**
 * @name fileTransactionStart
 * @description Start transaction
 *              Using race condition, pessmistic lock and database transaction pattern
 * @function
 * @param {server_db_object} file 
 * @param {string} filepath
 * @returns {Promise.<number>}
 */
const fileTransactionStart = async (file, filepath)=>{
    const transaction = async ()=>{
        const transaction_id = Date.now();
        fileRecord(file).transaction_id = transaction_id;
        const file_content = await fs.promises.readFile(process.cwd() + filepath, 'utf8').catch(()=>'');
        //parse TABLE and DOCUMENT, others are binary or json log files
        fileRecord(file).transaction_content = (fileRecord(file).type=='TABLE' || fileRecord(file).type=='DOCUMENT')?JSON.parse(file_content==''?'[]':file_content):file_content;
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
 * @param {server_db_object} file 
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
 * @param {server_db_object} file 
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
 * @param {server_db_object} file 
 * @returns {string}
 */
const filePath = file =>'/data/db/' + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;

/**
 * @name fileCache
 * @description Get file from cache already JSON parsed
 * @function
 * @param {server_db_object} file
 * @returns {*}
 */
 const fileCache = file => JSON.parse(JSON.stringify(fileRecord(file).cache_content));

/**
 * @name fileFsDir
 * @description Get files from directory
 * @function
 * @returns {Promise.<string[]>}
 */
const fileFsDir = async () => await fs.promises.readdir(`${process.cwd()}/data/db`);
/**
 * @name fileFsRead
 * @description Returns file content for given file
 *              Specify lock=true when updating a file to get transaction id 
 *              when file is available to update.
 *              Function returns file content after a lock of file and transaction id is given, lock info and transaction id.
 *              This transaction id must be provided when updating file in fileFsWrite()
 * @function
 * @param {server_db_object} file 
 * @param {boolean} lock
 * @returns {Promise.<import('../types.js').server_db_result_fileFsRead>}
 */
const fileFsRead = async (file, lock=false) =>{
    const filepath = '/data/db/' + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;
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
 * @name fileDbInit
 * @description Load default database or read existing from disk. Set cache for files in existing database using `cache_content` key to increase performance
 * @function
 * @param {server_db_object[]|null} default_db
 * @returns {Promise.<void>}
 */
 const fileDbInit = async (default_db=null) => {
    DB.data = default_db?default_db:await fs.promises.readFile(process.cwd() + '/data/db/db_objects.json', 'utf8')
                    .then(result=>JSON.parse(result))
                    .catch(()=>'');
    if (default_db == null)
        for (const file_db_record of DB.data){
            if ('cache_content' in file_db_record){
                const file = await fs.promises.readFile(process.cwd() + '/data/db/' + fileRecordFilename(file_db_record.name).filename + fileRecordFilename(file_db_record.name).suffix, 'utf8')
                                    .then((/**@type{string}*/file)=>JSON.parse(file.toString()))
                                    .catch(()=>null);
                file_db_record.cache_content = file?file:null;
            }
        }
 };
/**
 * @name fileFsWrite
 * @description Writes file
 *              Must specify valid transaction id given from fileFsRead()
 *              to be able to update a file
 *              Backup of old file will be written to backup directory
 * @function
 * @param {server_db_object} file 
 * @param {number|null} transaction_id 
 * @param {[]} file_content 
 * @returns {Promise.<string|null>}
 */
const fileFsWrite = async (file, transaction_id, file_content) =>{
    /**@type{import('../iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
    if (!transaction_id || fileRecord(file).transaction_id != transaction_id){
        return (iamUtilMessageNotAuthorized());
    }
    else{
        const filepath = '/data/db/' + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;
        const filepath_backup = '/data/db/backup/' + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;
        //write backup of old config file
        await fs.promises.writeFile(process.cwd() + `${filepath_backup}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, 
                                    fileRecord(file).type=='TABLE'?
                                    //save records in new row and compact format
                                    /**@ts-ignore */
                                    '[\n' + fileRecord(file).transaction_content.map(row=>JSON.stringify(row)).join(',\n') + '\n]':
                                        //JSON, convert to string
                                        JSON.stringify(fileRecord(file).transaction_content, undefined, 2)
                                    ,  
                                    'utf8');
        //write new file content
        return await fs.promises.writeFile( process.cwd() + filepath, 
                                            fileRecord(file).type=='TABLE'?
                                            //save records in new row and compact format
                                            '[\n' + file_content.map(row=>JSON.stringify(row)).join(',\n') + '\n]':
                                                //JSON, convert to string
                                                JSON.stringify(file_content, undefined, 2)
                                            ,  
                                            'utf8')
        .then(()=>{
            fileRecord(file).cache_content = file_content;
            if (fileTransactionCommit(file, transaction_id))
                return null;
            else
                throw (iamUtilMessageNotAuthorized());
        })
        .catch((error)=>{
            if (fileTransactionRollback(file, transaction_id))
                throw(error);
            else
                throw('⛔ ' + error);
        });
    }
};

/**
 * @name fileFSDirDataExists
 * @description Checks if /data direcotry is created where all config files exist
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
 * @param {server_db_object} file 
 * @param {server_db_config_files} file_content 
 * @returns {Promise.<void>}
 */
const fileFsWriteAdmin = async (file, file_content) =>{

    await fs.promises.writeFile(process.cwd() + 
                                '/data/db/' + fileRecordFilename(file).filename + fileRecordFilename(file).suffix, 
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
 * @param {server_db_object} file 
 * @returns {Promise.<void>}
 */
const fileFsDeleteAdmin = async file => {
    const filepath = process.cwd() + '/data/db/' + fileRecordFilename(file).filename + fileRecordFilename(file).suffix;
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
  * @param {server_db_object} file
  * @param {number|null} resource_id
  * @param {string|null} filenamepartition
  * @param {string|null} sample
  * @returns {Promise.<server_db_common_result_select>}
  */
 const fileFsDBLogGet = async (app_id, file, resource_id, filenamepartition=null, sample=null) =>{
    
    const filepath = `${fileRecordFilename(file).filename}${fileNamePartition(filenamepartition, sample)}${fileRecordFilename(file).suffix}`;
    const fileBuffer = await fs.promises.readFile(process.cwd() + '/data/db/' + filepath, 'utf8');
    return {rows:fileBuffer.toString().split('\r\n').filter(row=>row !='').map(row=>row = JSON.parse(row)).filter(row=>row.id == (resource_id??row.id))};
};
/**
 * @name fileFsDBLogPost
 * @description Create log record with given suffix or none
 * @function
 * @param {number|null} app_id
 * @param {server_db_object} file
 * @param {object} file_content 
 * @param {string|null} filenamepartition
 * @returns {Promise.<server_db_common_result_insert>}
 */
const fileFsDBLogPost = async (app_id, file, file_content, filenamepartition = null) =>{
    /**@type{import('../iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    const filepath = `/data/db/${fileRecordFilename(file).filename}${fileNamePartition(filenamepartition, null)}${fileRecordFilename(file).suffix}`;
    const transaction_id = await fileTransactionStart(file, filepath);
    
    return await fs.promises.appendFile(`${process.cwd()}${filepath}`, JSON.stringify(file_content) + '\r\n', 'utf8')
    .then(()=>{
        if (fileTransactionCommit(file, transaction_id))
            return {affectedRows:1};
        else
            throw (iamUtilMessageNotAuthorized());
    })
    .catch((error)=>{
        if (fileTransactionRollback(file, transaction_id))
            throw(error);
        else
            throw(iamUtilMessageNotAuthorized() + ' ' + error);
    });
};
/**
 * @name fileDBGet
 * @description Gets a record or records in a TABLE
 *              for given app id and if resource id if specified
 *              TABLE should have column id as primary key using this function
 * @function
 * @param {number|null} app_id
 * @param {server_db_object} table
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @returns {server_db_common_result_select}
 */
const fileDBGet = (app_id, table, resource_id, data_app_id) =>{
    try {
        const records = fileCache(table).filter((/**@type{*}*/row)=> row.id ==(resource_id ?? row.id) && row.app_id == (data_app_id ?? row.app_id));
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
 * @param {server_db_object} table
 * @param {[]} table_rows
 * @param {*} data
 * @param {'UPDATE'|'POST'} dml
 * @param {number|null} [resource_id]
 * @returns {boolean}
 */
const fileConstraints = (table, table_rows, data, dml, resource_id) =>{
    //update of PK not alllowed
    if (dml=='POST' && fileRecord(table).pk && table_rows.some((/**@type{server_db_object_record}*/record)=>
        /**@ts-ignore */
        record[fileRecord(table).pk]==data[fileRecord(table).pk]))
            return false;
    else{
        //no record can exist having given values for POST
        if (dml=='POST' && fileRecord(table).uk && table_rows.some((/**@type{server_db_object_record}*/record)=>
            /**@ts-ignore */
            fileRecord(table).uk?.filter(column=>record[column]==data[column]).length==fileRecord(table).uk?.length))
                return false;
        else
            //max one record can exist having given values for UPDATE
            if (dml=='UPDATE' && fileRecord(table).uk && table_rows.some((/**@type{server_db_object_record}*/record)=>
                //check value is the same, ignore empty UK
                /**@ts-ignore */
                fileRecord(table).uk.filter(column=>record[column] && record[column]==data[column]).length==fileRecord(table).uk.length &&
                //check it is NOT the same user
                /**@ts-ignore */
                record[fileRecord(table).uk]!=resource_id))
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
 * @param {server_db_object} table
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
 * @param {server_db_object} table
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
 * @param {server_db_object} table
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @returns {Promise<server_db_common_result_delete>}
 */
const fileDBDelete = async (app_id, table, resource_id, data_app_id) =>{
    /**@type{server_db_result_fileFsRead} */
    const file = await fileFsRead(table, true);
    if (file.file_content.filter((/**@type{*}*/row)=>(row.id==resource_id && resource_id!=null)|| (row.app_id == data_app_id && data_app_id != null)).length>0){
        await fileFsWrite(  table, 
                            file.transaction_id, 
                            file.file_content
                            //filter unique id
                            .filter((/**@type{*}*/row)=>row.id!=resource_id))
                .catch((/**@type{server_server_error}*/error)=>{throw error;});
        //should return 1 record deleted or wrong data is saved in file
        return {affectedRows:   file.file_content
                                .filter((/**@type{*}*/row)=>row.id==resource_id && row.app_id == (data_app_id ?? row.app_id)).length -
                                file.file_content
                                //filter unique id
                                .filter((/**@type{*}*/row)=>row.id!=resource_id).length
                };
    }
    else
        return {affectedRows:0};    
};
export {fileRecord, filePath, fileCache, fileFsRead, fileFsDir, fileDbInit, fileFsWrite, fileFSDirDataExists, fileFsAccessMkdir, fileFsWriteAdmin, fileFsDeleteAdmin,
        fileFsDBLogGet, fileFsDBLogPost,
        fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete};