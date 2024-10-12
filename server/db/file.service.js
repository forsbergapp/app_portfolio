/** @module server/db/file */

const fs = await import('node:fs');

/**@type{string} */
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';

/**@type{import('../types.js').server_db_file_db_record[]} */
const FILE_DB = [   {NAME:'CONFIG_APPS',                        TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_apps.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_SERVER',                      TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_server.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_IAM_BLOCKIP',                 TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_iam_blockip.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_IAM_POLICY',                  TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_iam_policy.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_IAM_USERAGENT',               TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_iam_useragent.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_MICROSERVICE',                TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_microservice.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_MICROSERVICE_SERVICES',       TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,                     FILENAME:'config_microservice_services.json', CACHE_CONTENT:null},
                    {NAME:'DB_FILE',                            TYPE:'BINARY',          LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,           FILENAME:'sqlite.db'},
                    {NAME:'IAM_APP_TOKEN',                      TYPE:'JSON_LOG',        LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_app_token.log'},
                    {NAME:'IAM_ADMIN_LOGIN',                    TYPE:'JSON_LOG',        LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_systemadmin_login.log'},
                    {NAME:'IAM_USER',                           TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_user.json', CACHE_CONTENT:null},
                    {NAME:'IAM_USER_LOGIN',                     TYPE:'JSON',            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}`,          FILENAME:'iam_user_login.log'},
                    {NAME:'LOG_APP_INFO',                       TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'APP_INFO_'},
                    {NAME:'LOG_APP_ERROR',                      TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'APP_ERROR_'},
                    {NAME:'LOG_DB_INFO',                        TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'DB_INFO_'},
                    {NAME:'LOG_DB_ERROR',                       TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'DB_ERROR_'},
                    {NAME:'LOG_REQUEST_INFO',                   TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'REQUEST_INFO_'},
                    {NAME:'LOG_REQUEST_VERBOSE',                TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'REQUEST_VERBOSE_'},
                    {NAME:'LOG_REQUEST_ERROR',                  TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'REQUEST_ERROR_'},
                    {NAME:'LOG_SERVER_INFO',                    TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'SERVER_INFO_'},
                    {NAME:'LOG_SERVER_ERROR',                   TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'SERVER_ERROR_'},
                    {NAME:'LOG_SERVICE_INFO',                   TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'SERVICE_INFO_'},
                    {NAME:'LOG_SERVICE_ERROR',                  TYPE:'JSON_LOG_DATE',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}`,         FILENAME:'SERVICE_ERROR_'},
                    {NAME:'MICROSERVICE_MESSAGE_QUEUE_PUBLISH', TYPE:'JSON_LOG',        LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}`, FILENAME:'message_queue_publish.log'},
                    {NAME:'MICROSERVICE_MESSAGE_QUEUE_CONSUME', TYPE:'JSON_LOG',        LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}`, FILENAME:'message_queue_consume.log'},
                    {NAME:'MICROSERVICE_MESSAGE_QUEUE_ERROR',   TYPE:'JSON_LOG',        LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}`, FILENAME:'message_queue_error.log'}];
Object.seal(FILE_DB);

/**
 * 
 * @param {import('../types.js').server_db_file_db_name} filename 
 * @returns {import('../types.js').server_db_file_db_record}
 */
const fileRecord = filename =>FILE_DB.filter(file_db=>file_db.NAME == filename)[0];

/**
 * 
 * @param {import('../types.js').server_db_file_db_name} file 
 * @param {object|string} filecontent
 * @returns {Promise.<number>}
 */
const fileTransactionStart = async (file, filecontent)=>{
    return new Promise((resolve, reject)=>{
        if  (fileRecord(file).LOCK==0){
            fileRecord(file).LOCK = 1;
            //add 1ms wait so transaction_id will be guaranteed unique on a fast server
            setTimeout(()=>{
                const transaction_id = Date.now();
                fileRecord(file).TRANSACTION_ID = transaction_id;
                fileRecord(file).TRANSACTION_CONTENT = filecontent;
                resolve(transaction_id);}, 1);
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
                        const transaction_id = Date.now();
                        fileRecord(file).TRANSACTION_ID = transaction_id;
                        fileRecord(file).TRANSACTION_CONTENT = filecontent;
                        resolve(transaction_id);
                    }
                    else
                        setTimeout(()=>{lock(), 1;});
            };
            lock();
        }
    });
};
/**
 * 
 * @param {import('../types.js').server_db_file_db_name} file 
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
    else{
        return false;
    }
};
/**
 * 
 * @param {import('../types.js').server_db_file_db_name} file 
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
    else{
        return false;
    }
};
/**
 * 
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
 * Returns file path for given file
 * @param {import('../types.js').server_db_file_db_name} file 
 * @returns {string}
 */
const filePath = file =>fileRecord(file).PATH + fileRecord(file).FILENAME;

/**
 * 
 * @param {import('../types.js').server_db_file_db_name} file
 * @returns {*}
 */
 const fileCache = file => fileRecord(file).CACHE_CONTENT ?? null;
 /**
 * Get log file with given suffix or none or use sample to get specific suffix
 * for statistics
 * @param {import('../types.js').server_db_file_db_name} file 
 * @param {string|null} filesuffix 
 * @param {string|null} sample
 * @returns {Promise.<*>}
 */
 const fileFsReadLog = async (file, filesuffix=null, sample=null) =>{
    
    const filepath = `${fileRecord(file).PATH}${fileRecord(file).FILENAME}${fileSuffix(filesuffix, sample)}`;
    const fileBuffer = await fs.promises.readFile(process.cwd() + filepath, 'utf8');
    return fileBuffer.toString().split('\r\n').filter(row=>row !='').map(row=>row = JSON.parse(row));
};
/**
 * 
 * @returns {Promise.<string[]>}
 */
const fileFsDir = async () => await fs.promises.readdir(`${process.cwd()}${SLASH}data${SLASH}logs`);
/**
 * 
 * Returns file content in FILE_DB.PATH + FILE_DB.FILENAME for given file
 * @param {import('../types.js').server_db_file_db_name} file 
 * @param {boolean} lock
 * @returns {Promise.<import('../types.js').server_db_file_result_fileFsRead>}
 */
const fileFsRead = async (file, lock=false) =>{
    const filepath = fileRecord(file).PATH + fileRecord(file).FILENAME;
    const fileBuffer = await fs.promises.readFile(process.cwd() + filepath, 'utf8');    
    if (lock){
        const transaction_id = await fileTransactionStart(file, JSON.parse(fileBuffer.toString()));
        return {   file_content:    JSON.parse(fileBuffer.toString()),
                    lock:           lock,
                    transaction_id: transaction_id};
    }
    else{
        return {   file_content:    JSON.parse(fileBuffer.toString()),
                    lock:           lock,
                    transaction_id: null};
    }
};
/**
 * 
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
 * 
 * Updates config files
 * @param {import('../types.js').server_db_file_db_name} file 
 * @param {number|null} transaction_id 
 * @param {object} file_content 
 * @returns 
 */
const fileFsWrite = async (file, transaction_id, file_content) =>{
    if (!transaction_id || fileRecord(file).TRANSACTION_ID != transaction_id)
        return ('⛔');
    else{
        const filepath = fileRecord(file).PATH + fileRecord(file).FILENAME;
        const filepath_backup = fileRecord(file).PATH + 'backup/' + fileRecord(file).FILENAME;
        //write backup of old config file
        await fs.promises.writeFile(process.cwd() + `${filepath_backup}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, 
                                    JSON.stringify(fileRecord(file).TRANSACTION_CONTENT, undefined, 2),  
                                    'utf8');
        //write new file content
        await fs.promises.writeFile(process.cwd() + filepath, 
                                    JSON.stringify(file_content, undefined, 2),  
                                    'utf8')
        .then(()=>{
            fileRecord(file).CACHE_CONTENT = file_content;
            if (fileTransactionCommit(file, transaction_id))
                return null;
            else
                throw ('⛔');
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
 * 
 * @param {import('../types.js').server_db_file_db_name} file 
 * @param {import('../types.js').server_db_file_config_files} file_content 
 */
const fileFsWriteAdmin = async (file, file_content) =>{
    const filepath = fileRecord(file).PATH + (fileRecord(file).FILENAME?fileRecord(file).FILENAME:'');
    await fs.promises.writeFile(process.cwd() + filepath, JSON.stringify(file_content, undefined, 2),  'utf8')
    .then(() => {
        return null;
    })
    .catch((error)=> {
        throw error;
    });
};

/**
 * 
 * @param {import('../types.js').server_db_file_db_name} file
 * @param {object} file_content 
 * @param {string|null} filesuffix
 */
const fileFsAppend = async (file, file_content, filesuffix = null) =>{
    const filepath = `${fileRecord(file).PATH}${fileRecord(file).FILENAME}${fileSuffix(filesuffix, null)}`;
    const old_file = await fs.promises.readFile(`${process.cwd()}${filepath}`, 'utf8')
    .catch(()=>null);
    const transaction_id = await fileTransactionStart(file, old_file ?? '');
    
    await fs.promises.appendFile(`${process.cwd()}${filepath}`, JSON.stringify(file_content) + '\r\n', 'utf8')
    .then(()=>{
        if (fileTransactionCommit(file, transaction_id))
            return null;
        else
            throw ('⛔');
    })
    .catch((error)=>{
        if (fileTransactionRollback(file, transaction_id))
            throw(error);
        else
            throw('⛔ ' + error);
    });
};

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
                        `${SLASH}data${SLASH}iam`,
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

export {SLASH, filePath, fileCache, fileFsRead, fileFsDir, fileFsReadLog, fileFsCacheSet, fileFsWrite, fileFsWriteAdmin, fileFsAppend, fileFsAccessMkdir};