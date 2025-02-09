/** 
 *  File database using race condition, pessimistic lock and database transaction pattern
 *  Tables implemented using object mapping relation (ORM) pattern
 *  each JSON_TABLE has fileModel*.js file with methods
 *  LOG*, CONFIG* and MESSAGE_QUEUE* tables use subtypes and common fileModel*.js files.
 *  See ER Model for an overview.
 *  
 *  File types supported
 *  JSON            json
 *                  uses fileFsRead and fileFsWrite by admin and config files
 *  JSON_TABLE      json that can be managed as table and implemented using object mapping relation (ORM) pattern
 *                  so each table is mapped to one fileModel*.js
 *                  consists of 3 layers
 *                  *.js            app logic that transforms and filter data, ex iamUserGet() in /server/iam.js
 *                  fileModel*.js   data model API with constraints, ex fileModelIamUser() in /server/db/fileModelIamUser.js
 *                  file.js         file management API, ex fileDBGet() in /server/db/file.js
 *                                  fileDBGet               reads file content from CACHE_CONTENT and should be used by default for performance
 *                                                          so a synchronous function can be used and to avoid disk read
 *                                                          since JSON_TABLE files stores new content in CACHE_CONTENT after each change
 *                                  fileFsRead              reads file content from file, 
 *                                                          used at transaction start,in microservice that does not read CACHE_CONTENT
 *                                                          from other server process and at server start
 *                                  fileDBPost              saves file content to file and updates CACHE_CONTENT
 *                                  fileDBUpdate            saves file content to file and updates CACHE_CONTENT
 *                                  fileDBDelete            saves file content to file and updates CACHE_CONTENT
 *                                  fileTransactionStart    reads and sets TRANSACTION_ID and LOCK key in FILE_DB and 
 *                                                          uses setTimeout loop until LOCK is available,
 *                                                          waits maximum 10 seconds for LOCK,
 *                                                          saves file content in TRANSACTION_CONTENT that is used to rollback info if
 *                                                          something goes wrong and can also be used for debugging purpose
 *                                  fileTransactionCommit   empties TRANSACTION_ID, TRANSACTION_CONTENT and sets LOCK =0
 *                                  fileTransactionRollback empties TRANSACTION_ID, TRANSACTION_CONTENT and sets LOCK =0
 *  JSON_LOG        json records, comma separated
 *                  uses fileFsDBLogGet and fileFsDBLogPost
 *  JSON_LOG_DATE   json record, comma separateed with file name suffixes
 *                  uses fileFsLogGet, fileFsDBLogPost and fileSuffix
 *  BINARY          used by sqLite database and fileModel*.js file not implemented
 *  Admin can also use fileFsWriteAdmin and fileFsDeleteAdmin without transaction if needed
 * 
 * @module server/db/file 
 */

/**
 * @import {server_db_file_result_fileFsRead,
 *          server_db_common_result_select, server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete,
 *          server_server_error, server_db_file_config_files, server_db_file_db_name, server_db_file_db_record} from '../types.js'
 */

const fs = await import('node:fs');

/**
 * @name SLASH
 * @description Path separator depending the process.platform value
 * @constant
 * @type{string}
 */
const SLASH = process.platform == 'win32'?'\\':'/';

/**
 * @name FILE_DB
 * @description File database using ORM pattern
 * @constant
 * @type{server_db_file_db_record[]} 
 */
const FILE_DB = [   {NAME:'CONFIG_SERVER',                  TYPE:'JSON',            PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_server.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_REST_API',                TYPE:'JSON',            PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_rest_api.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_IAM_POLICY',              TYPE:'JSON',            PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_iam_policy.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_MICROSERVICE',            TYPE:'JSON',            PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_microservice.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_MICROSERVICE_SERVICES',   TYPE:'JSON',            PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_microservice_services.json', CACHE_CONTENT:null},
                    {NAME:'APP',                            TYPE:'JSON_TABLE',      PK:'id', UK:null,                         LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,           FILENAME:'app.json', CACHE_CONTENT:null},
                    {NAME:'APP_MODULE',                     TYPE:'JSON_TABLE',      PK:'id', UK:['common_type, common_name'], LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,           FILENAME:'app_module.json', CACHE_CONTENT:null},
                    {NAME:'APP_MODULE_QUEUE',               TYPE:'JSON_TABLE',      PK:'id', UK:null,                         LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,           FILENAME:'app_module_queue.json', CACHE_CONTENT:null},
                    {NAME:'APP_PARAMETER',                  TYPE:'JSON_TABLE',      PK:'app_id', UK:null,                     LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,           FILENAME:'app_parameter.json', CACHE_CONTENT:null},
                    {NAME:'APP_SECRET',                     TYPE:'JSON_TABLE',      PK:'app_id', UK:null,                     LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,           FILENAME:'app_secret.json', CACHE_CONTENT:null},
                    {NAME:'APP_TRANSLATION',                TYPE:'JSON_TABLE',      PK:'id', UK:null,                         LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,           FILENAME:'app_translation.json', CACHE_CONTENT:null},
                    {NAME:'DB_FILE',                        TYPE:'BINARY',          PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,           FILENAME:'sqlite.db'},
                    {NAME:'IAM_APP_ID_TOKEN',               TYPE:'JSON_TABLE',      PK:'created', UK:['token'],               LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_app_id_token.json', CACHE_CONTENT:null},
                    {NAME:'IAM_APP_ACCESS',                 TYPE:'JSON_TABLE',      PK:'id', UK:['token'],                    LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_app_access.json', CACHE_CONTENT:null},
                    {NAME:'IAM_CONTROL_IP',                 TYPE:'JSON_TABLE',      PK:'id', UK:null,                         LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_control_ip.json', CACHE_CONTENT:null},
                    {NAME:'IAM_CONTROL_USER_AGENT',         TYPE:'JSON_TABLE',      PK:'id', UK:null,                         LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_control_user_agent.json', CACHE_CONTENT:null},
                    {NAME:'IAM_CONTROL_OBSERVE',            TYPE:'JSON_TABLE',      PK:'id', UK:null,                         LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_control_observe.json', CACHE_CONTENT:null},
                    {NAME:'IAM_USER',                       TYPE:'JSON_TABLE',      PK:'id', UK:['username'],                 LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_user.json', CACHE_CONTENT:null},                    
                    {NAME:'LOG_APP_INFO',                   TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'APP_INFO_'},
                    {NAME:'LOG_APP_ERROR',                  TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'APP_ERROR_'},
                    {NAME:'LOG_DB_INFO',                    TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'DB_INFO_'},
                    {NAME:'LOG_DB_ERROR',                   TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'DB_ERROR_'},
                    {NAME:'LOG_REQUEST_INFO',               TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'REQUEST_INFO_'},
                    {NAME:'LOG_REQUEST_VERBOSE',            TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'REQUEST_VERBOSE_'},
                    {NAME:'LOG_REQUEST_ERROR',              TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'REQUEST_ERROR_'},
                    {NAME:'LOG_SERVER_INFO',                TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'SERVER_INFO_'},
                    {NAME:'LOG_SERVER_ERROR',               TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'SERVER_ERROR_'},
                    {NAME:'LOG_SERVICE_INFO',               TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'SERVICE_INFO_'},
                    {NAME:'LOG_SERVICE_ERROR',              TYPE:'JSON_LOG_DATE',   PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'SERVICE_ERROR_'},
                    {NAME:'MESSAGE_QUEUE_PUBLISH',          TYPE:'JSON_LOG',        PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}`, FILENAME:'message_queue_publish.log'},
                    {NAME:'MESSAGE_QUEUE_CONSUME',          TYPE:'JSON_LOG',        PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}`, FILENAME:'message_queue_consume.log'},
                    {NAME:'MESSAGE_QUEUE_ERROR',            TYPE:'JSON_LOG',        PK:null, UK:null,                           LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}`, FILENAME:'message_queue_error.log'}];
Object.seal(FILE_DB);

/**
 * @name fileRecord
 * @description Get file record from file db
 * @function
 * @param {server_db_file_db_name} filename 
 * @returns {server_db_file_db_record}
 */
const fileRecord = filename =>FILE_DB.filter(file_db=>file_db.NAME == filename)[0];

/**
 * @name fileTransactionStart
 * @description Start transaction
 *              Using race condition, pessmistic lock and database transaction pattern
 * @function
 * @param {server_db_file_db_name} file 
 * @param {string} filepath
 * @returns {Promise.<number>}
 */
const fileTransactionStart = async (file, filepath)=>{
    const transaction = async ()=>{
        const transaction_id = Date.now();
        fileRecord(file).TRANSACTION_ID = transaction_id;
        const file_content = await fs.promises.readFile(process.cwd() + filepath, 'utf8').catch(()=>'');
        //parse JSON_TABLE and JSON, others are binary or json log files
        fileRecord(file).TRANSACTION_CONTENT = (fileRecord(file).TYPE=='JSON_TABLE' || fileRecord(file).TYPE=='JSON')?JSON.parse(file_content==''?'[]':file_content):file_content;
        return transaction_id;
    };
    return new Promise((resolve, reject)=>{
        if  (fileRecord(file).LOCK==0){
            fileRecord(file).LOCK = 1;
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
                    if (fileRecord(file).LOCK==0){
                        fileRecord(file).LOCK = 1;
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
 * @param {server_db_file_db_name} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const fileTransactionCommit = (file, transaction_id)=>{
    if (fileRecord(file).TRANSACTION_ID==transaction_id){
        fileRecord(file).LOCK = 0;
        fileRecord(file).TRANSACTION_ID = null;
        fileRecord(file).TRANSACTION_CONTENT = null;
        return true;
    }
    else
        return false;
};
/**
 * @name fileTransactionRollback
 * @description Transaction rollback
 * @function
 * @param {server_db_file_db_name} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const fileTransactionRollback = (file, transaction_id)=>{
    if (fileRecord(file).TRANSACTION_ID==transaction_id){
        fileRecord(file).LOCK = 0;
        fileRecord(file).TRANSACTION_ID = null;
        fileRecord(file).TRANSACTION_CONTENT = null;
        return true;
    }
    else
        return false;
};
/**
 * @name fileSuffix
 * @description Get file suffix
 * @function
 * @param {string|null} filesuffix 
 * @param {string|null} sample 
 * @returns 
 */
 const fileSuffix = (filesuffix=null, sample=null) =>{
    const year = new Date().toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric'});
    const month = new Date().toLocaleString('en-US', { timeZone: 'UTC', month: '2-digit'});
    const day   = new Date().toLocaleString('en-US', { timeZone: 'UTC', day: '2-digit'});
    let file_filesuffix = '';
    if (sample)
        file_filesuffix = `${sample}.log`;
    else
        switch (filesuffix){
            case 'YYYYMMDD':{
                file_filesuffix = `${year}${month}${day}.log`;    
                break;
            }
            case 'YYYYMM':{
                file_filesuffix = `${year}${month}.log`;
                break;
            }
            default:{
                break;
            }
        }
    return file_filesuffix;
};

/**
 * @name filePath
 * @description Returns file path for given file
 * @function
 * @param {server_db_file_db_name} file 
 * @returns {string}
 */
const filePath = file =>fileRecord(file).PATH + fileRecord(file).FILENAME;

/**
 * @name fileCache
 * @description Get file from cache already JSON parsed
 * @function
 * @param {server_db_file_db_name} file
 * @returns {*}
 */
 const fileCache = file => JSON.parse(JSON.stringify(fileRecord(file).CACHE_CONTENT));

/**
 * @name fileFsDir
 * @description Get files from directory
 * @function
 * @param {server_db_file_db_name} file
 * @returns {Promise.<string[]>}
 */
const fileFsDir = async file => await fs.promises.readdir(`${process.cwd()}${fileRecord(file).PATH}`);
/**
 * @name fileFsRead
 * @description Returns file content in FILE_DB.PATH + FILE_DB.FILENAME for given file
 *              Specify lock=true when updating a file to get transaction id 
 *              when file is available to update.
 *              Function returns file content after a lock of file and transaction id is given, lock info and transaction id.
 *              This transaction id must be provided when updating file in fileFsWrite()
 * @function
 * @param {server_db_file_db_name} file 
 * @param {boolean} lock
 * @returns {Promise.<import('../types.js').server_db_file_result_fileFsRead>}
 */
const fileFsRead = async (file, lock=false) =>{
    const filepath = fileRecord(file).PATH + fileRecord(file).FILENAME;
    if (lock){
        const transaction_id = await fileTransactionStart(file, filepath);
        return {   file_content:    fileRecord(file).TRANSACTION_CONTENT,
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
 * @name fileFsCacheSet
 * @description Set cache for files using CACHE_CONTENT key to avoid using too much disk read
 *              to increase performance
 *              Cache content is updated after admin updates a file
 * @function
 * @returns {Promise.<void>}
 */
 const fileFsCacheSet = async () => {
    for (const file_db_record of FILE_DB){
        if ('CACHE_CONTENT' in file_db_record){
            const file = await fs.promises.readFile(process.cwd() + file_db_record.PATH + file_db_record.FILENAME, 'utf8')
                                .then((/**@type{string}*/file)=>JSON.parse(file.toString()))
                                .catch(()=>null);
            file_db_record.CACHE_CONTENT = file?file:null;
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
 * @param {server_db_file_db_name} file 
 * @param {number|null} transaction_id 
 * @param {[]} file_content 
 * @returns {Promise.<string|null>}
 */
const fileFsWrite = async (file, transaction_id, file_content) =>{
    /**@type{import('../iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
    if (!transaction_id || fileRecord(file).TRANSACTION_ID != transaction_id){
        return (iamUtilMessageNotAuthorized());
    }
    else{
        const filepath = fileRecord(file).PATH + fileRecord(file).FILENAME;
        const filepath_backup = fileRecord(file).PATH + 'backup/' + fileRecord(file).FILENAME;
        //write backup of old config file
        await fs.promises.writeFile(process.cwd() + `${filepath_backup}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, 
                                    fileRecord(file).TYPE=='JSON_TABLE'?
                                    //save records in new row and compact format
                                    /**@ts-ignore */
                                    '[\n' + fileRecord(file).TRANSACTION_CONTENT.map(row=>JSON.stringify(row)).join(',\n') + '\n]':
                                        //JSON, convert to string
                                        JSON.stringify(fileRecord(file).TRANSACTION_CONTENT, undefined, 2)
                                    ,  
                                    'utf8');
        //write new file content
        return await fs.promises.writeFile( process.cwd() + filepath, 
                                            fileRecord(file).TYPE=='JSON_TABLE'?
                                            //save records in new row and compact format
                                            '[\n' + file_content.map(row=>JSON.stringify(row)).join(',\n') + '\n]':
                                                //JSON, convert to string
                                                JSON.stringify(file_content, undefined, 2)
                                            ,  
                                            'utf8')
        .then(()=>{
            fileRecord(file).CACHE_CONTENT = file_content;
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
 * @name fileFsAccessMkdir
 * @description Created directories and should be used only when server is started first time
 * @function
 * @returns{Promise.<void>}
 */
const fileFsAccessMkdir = async () => {
    const mkdir = async (/**@type{string} */dir) =>{
        await fs.promises.mkdir(process.cwd() + dir)
        .catch((error)=>{
            throw error;
        });
    };
    for (const dir of [ `${SLASH}data`,
                        `${SLASH}data${SLASH}backup`,
                        `${SLASH}data${SLASH}db`,
                        `${SLASH}data${SLASH}db${SLASH}jobs`,
                        `${SLASH}data${SLASH}db${SLASH}backup`,
                        `${SLASH}data${SLASH}iam`,
                        `${SLASH}data${SLASH}iam${SLASH}backup`,
                        `${SLASH}data${SLASH}logs`,
                        `${SLASH}data${SLASH}ssl`,
                        `${SLASH}data${SLASH}microservice`,
                        `${SLASH}data${SLASH}microservice${SLASH}data`,
                        `${SLASH}data${SLASH}microservice${SLASH}ssl`]){
        await fs.promises.access(process.cwd() + dir)
        .catch(()=>{
            mkdir(dir);  
        });
    }
};
/**
 * @name fileFsWriteAdmin
 * @description Write to a file.
 *              Should only be used by admin since no transaction is used
 * @function
 * @param {server_db_file_db_name} file 
 * @param {server_db_file_config_files} file_content 
 * @returns {Promise.<void>}
 */
const fileFsWriteAdmin = async (file, file_content) =>{
    const filepath = fileRecord(file).PATH + (fileRecord(file).FILENAME?fileRecord(file).FILENAME:'');
    await fs.promises.writeFile(process.cwd() + filepath, file_content?JSON.stringify(file_content, undefined, 2):'',  'utf8')
    .catch((error)=> {
        throw error;
    });
};

/**
 * @name fileFsDeleteAdmin
 * @description Delete a file
 * @function
 * @param {server_db_file_db_name} file 
 * @returns {Promise.<void>}
 */
const fileFsDeleteAdmin = async file => {
    const filepath = process.cwd() + fileRecord(file).PATH + (fileRecord(file).FILENAME?fileRecord(file).FILENAME:'');
    await fs.promises.rm(filepath).catch((error=>{throw error;}));
};

 /**
  * @name fileFsDBLogGet
  * @description Get log file with given suffix or none or use sample to get specific suffix
  *              for statistics
  *              Filters for given resource_id if requested
  * @function
  * @param {number|null} app_id
  * @param {server_db_file_db_name} file
  * @param {number|null} resource_id
  * @param {string|null} filesuffix 
  * @param {string|null} sample
  * @returns {Promise.<server_db_common_result_select>}
  */
 const fileFsDBLogGet = async (app_id, file, resource_id, filesuffix=null, sample=null) =>{
    
    const filepath = `${fileRecord(file).PATH}${fileRecord(file).FILENAME}${fileSuffix(filesuffix, sample)}`;
    const fileBuffer = await fs.promises.readFile(process.cwd() + filepath, 'utf8');
    return {rows:fileBuffer.toString().split('\r\n').filter(row=>row !='').map(row=>row = JSON.parse(row)).filter(row=>row.id == (resource_id??row.id))};
};
/**
 * @name fileFsDBLogPost
 * @description Create log record with given suffix or none
 * @function
 * @param {number|null} app_id
 * @param {server_db_file_db_name} file
 * @param {object} file_content 
 * @param {string|null} filesuffix
 * @returns {Promise.<server_db_common_result_insert>}
 */
const fileFsDBLogPost = async (app_id, file, file_content, filesuffix = null) =>{
    /**@type{import('../iam.js')} */
    const  {iamUtilMessageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);

    const filepath = `${fileRecord(file).PATH}${fileRecord(file).FILENAME}${fileSuffix(filesuffix, null)}`;
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
 * @description Gets a record or records in a JSON_TABLE
 *              for given app id and if resource id if specified
 *              JSON_TABLE should have column id as primary key using this function
 * @function
 * @param {number|null} app_id
 * @param {server_db_file_db_name} table
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
 * @param {server_db_file_db_name} table
 * @param {[]} table_rows
 * @param {*} data
 * @param {'UPDATE'|'POST'} dml
 * @param {number|null} [resource_id]
 * @returns {boolean}
 */
const fileConstraints = (table, table_rows, data, dml, resource_id) =>{
    //update of PK not alllowed
    if (dml=='POST' && fileRecord(table).PK && table_rows.some((/**@type{server_db_file_db_record}*/record)=>
        /**@ts-ignore */
        record[fileRecord(table).PK]==data[fileRecord(table).PK]))
            return false;
    else{
        //no record can exist having given values for POST
        if (dml=='POST' && fileRecord(table).UK && table_rows.some((/**@type{server_db_file_db_record}*/record)=>
            /**@ts-ignore */
            fileRecord(table).UK?.filter(column=>record[column]==data[column]).length==fileRecord(table).UK?.length))
                return false;
        else
            //max one record can exist having given values for UPDATE
            if (dml=='UPDATE' && fileRecord(table).UK && table_rows.some((/**@type{server_db_file_db_record}*/record)=>
                //check value is the same, ignore empty UK
                /**@ts-ignore */
                fileRecord(table).UK.filter(column=>record[column] && record[column]==data[column]).length==fileRecord(table).UK.length &&
                //check it is NOT the same user
                /**@ts-ignore */
                record[fileRecord(table).PK]!=resource_id))
                    return false;
            else
                return true;
    }
};
/**
 * @name fileDBPost
 * @description Creates a record in a JSON_TABLE
 *              and returns the record
 * @function
 * @param {number} app_id
 * @param {server_db_file_db_name} table
 * @param {*} data
 * @returns {Promise.<server_db_common_result_insert>}
 */
const fileDBPost = async (app_id, table, data) =>{
    if (app_id!=null){
        /**@type{server_db_file_result_fileFsRead} */
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
 * @description Updates a record in a JSON_TABLE
 *              with given values in given columns in data parameter
 *              and returns updated record
 *              JSON_TABLE should have column id as primary key using this function
 * @function
 * @param {number} app_id
 * @param {server_db_file_db_name} table
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @param {*} data
 * @returns {Promise<server_db_common_result_update>}
 */
const fileDBUpdate = async (app_id, table, resource_id, data_app_id, data) =>{
    if (app_id!=null){
        /**@type{server_db_file_result_fileFsRead} */
        const file = await fileFsRead(table, true);
        if (fileConstraints(table, file.file_content, data, 'UPDATE', resource_id)){
            let update = false;
            let count = 0;
            for (const index in file.file_content)
                //a JSON_TABLE must have ID or APP_ID as PK to be able to update
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
 * @description Deletes a record in a JSON_TABLE
 *              for given resource id and app id
 *              JSON_TABLE should have column id as primary key using this function
 * @function
 * @param {number} app_id
 * @param {server_db_file_db_name} table
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @returns {Promise<server_db_common_result_delete>}
 */
const fileDBDelete = async (app_id, table, resource_id, data_app_id) =>{
    /**@type{server_db_file_result_fileFsRead} */
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
export {SLASH, fileRecord, filePath, fileCache, fileFsRead, fileFsDir, fileFsCacheSet, fileFsWrite, fileFsAccessMkdir, fileFsWriteAdmin, fileFsDeleteAdmin,
        fileFsDBLogGet, fileFsDBLogPost,
        fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete};