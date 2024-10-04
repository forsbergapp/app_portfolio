/** @module server/db/file */

const fs = await import('node:fs');

/**@type{string} */
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';

/**@type{import('../../types.js').server_db_file_db_record[]} */
const FILE_DB = [   {NAME:'CONFIG_APPS',                        LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,             FILENAME:'config_apps.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_SERVER',                      LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,             FILENAME:'config_server.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_IAM_BLOCKIP',                 LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,             FILENAME:'config_iam_blockip.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_IAM_POLICY',                  LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,             FILENAME:'config_iam_policy.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_IAM_USER',                    LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,             FILENAME:'config_iam_user.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_IAM_USERAGENT',               LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,             FILENAME:'config_iam_useragent.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_MICROSERVICE',                LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,             FILENAME:'config_microservice.json', CACHE_CONTENT:null},
                    {NAME:'CONFIG_MICROSERVICE_SERVICES',       LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}`,             FILENAME:'config_microservice_services.json', CACHE_CONTENT:null},
                    {NAME:'DB_FILE',                            LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}db${SLASH}`,   FILENAME:'sqlite.db'},
                    {NAME:'IAM_APP_TOKEN',                      LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}iam_app_token_`},
                    {NAME:'IAM_SYSTEMADMIN_LOGIN',              LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}iam${SLASH}iam_systemadmin_login_`},
                    {NAME:'LOG_APP_INFO',                       LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}APP_INFO_`},
                    {NAME:'LOG_APP_ERROR',                      LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}APP_ERROR_`},
                    {NAME:'LOG_DB_INFO',                        LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}DB_INFO_`},
                    {NAME:'LOG_DB_ERROR',                       LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}DB_ERROR_`},
                    {NAME:'LOG_REQUEST_INFO',                   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}REQUEST_INFO_`},
                    {NAME:'LOG_REQUEST_VERBOSE',                LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}REQUEST_VERBOSE_`},
                    {NAME:'LOG_REQUEST_ERROR',                  LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}REQUEST_ERROR_`},
                    {NAME:'LOG_SERVER_INFO',                    LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}SERVER_INFO_`},
                    {NAME:'LOG_SERVER_ERROR',                   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}SERVER_ERROR_`},
                    {NAME:'LOG_SERVICE_INFO',                   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}SERVICE_INFO_`},
                    {NAME:'LOG_SERVICE_ERROR',                  LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}logs${SLASH}SERVICE_ERROR_`},
                    {NAME:'MICROSERVICE_MESSAGE_QUEUE_PUBLISH', LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}message_queue_publish.log`},
                    {NAME:'MICROSERVICE_MESSAGE_QUEUE_CONSUME', LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}message_queue_consume.log`},
                    {NAME:'MICROSERVICE_MESSAGE_QUEUE_ERROR',   LOCK:0, TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}data${SLASH}microservice${SLASH}message_queue_error.log`}];
Object.seal(FILE_DB);

/**
 * 
 * @param {import('../../types.js').server_db_file_db_name} filename 
 * @returns {import('../../types.js').server_db_file_db_record}
 */
const fileDB = filename =>FILE_DB.filter(file_db=>file_db.NAME == filename)[0];

/**
 * 
 * @param {import('../../types.js').server_db_file_db_name} file 
 * @param {object|string} filecontent
 * @returns {Promise.<number>}
 */
const transaction_start = async (file, filecontent)=>{
    return new Promise((resolve, reject)=>{
        if  (fileDB(file).LOCK==0){
            fileDB(file).LOCK = 1;
            //add 1ms wait so transaction_id will be guaranteed unique on a fast server
            setTimeout(()=>{
                const transaction_id = Date.now();
                fileDB(file).TRANSACTION_ID = transaction_id;
                fileDB(file).TRANSACTION_CONTENT = filecontent;
                resolve(transaction_id);}, 1);
        }
        else{
            const tries = 0;
            const timer = setInterval(() => {
                if (tries > 10000)
                    reject ('timeout');
                else
                    if (fileDB(file).LOCK==0){
                        fileDB(file).LOCK = 1;
                        const transaction_id = Date.now();
                        fileDB(file).TRANSACTION_ID = transaction_id;
                        fileDB(file).TRANSACTION_CONTENT = filecontent;
                        clearInterval(timer);
                        resolve(transaction_id);
                    }
            }, 1);
        }
            
    });
};
/**
 * 
 * @param {import('../../types.js').server_db_file_db_name} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const transaction_commit = (file, transaction_id)=>{
    if (fileDB(file).TRANSACTION_ID==transaction_id){
        fileDB(file).LOCK = 0;
        fileDB(file).TRANSACTION_ID = null;
        fileDB(file).TRANSACTION_CONTENT = null;
        return true;
    }
    else{
        return false;
    }
};
/**
 * 
 * @param {import('../../types.js').server_db_file_db_name} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const transaction_rollback = (file, transaction_id)=>{

    if (fileDB(file).TRANSACTION_ID==transaction_id){
        fileDB(file).LOCK = 0;
        fileDB(file).TRANSACTION_ID = null;
        fileDB(file).TRANSACTION_CONTENT = null;
        
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
 const getFilesuffix = (filesuffix=null, sample=null) =>{
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
 * Get log file with given suffix or none or use sample to get specific suffix
 * for statistics
 * @param {import('../../types.js').server_db_file_db_name} file 
 * @param {string|null} filesuffix 
 * @param {string|null} sample
 * @returns {Promise.<*>}
 */
 const file_get_log = async (file, filesuffix=null, sample=null) =>{
    
    const filepath = `${fileDB(file).PATH}${getFilesuffix(filesuffix, sample)}`;
    const fileBuffer = await fs.promises.readFile(process.cwd() + filepath, 'utf8');
    return fileBuffer.toString().split('\r\n').filter(row=>row !='').map(row=>row = JSON.parse(row));
};
/**
 * 
 * Returns file content in FILE_DB.PATH for given file
 * @param {import('../../types.js').server_db_file_db_name} file 
 * @param {boolean} lock
 * @returns {Promise.<import('../../types.js').server_db_file_result_file_get>}
 */
const file_get = async (file, lock=false) =>{
    const filepath = fileDB(file).PATH + (fileDB(file).FILENAME?fileDB(file).FILENAME:'');
    const fileBuffer = await fs.promises.readFile(process.cwd() + filepath, 'utf8');    
    if (lock){
        const transaction_id = await transaction_start(file, JSON.parse(fileBuffer.toString()));
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
 * Returns file path for given file
 * @param {import('../../types.js').server_db_file_db_name} file 
 * @returns {string}
 */
const file_get_path = file =>(fileDB(file).PATH ?? '') + (fileDB(file).FILENAME?fileDB(file).FILENAME:'');
/**
 * 
 * @returns {Promise.<string[]>}
 */
const file_get_log_dir = async () => await fs.promises.readdir(`${process.cwd()}${SLASH}data${SLASH}logs`);
/**
 * 
 * @param {import('../../types.js').server_db_file_db_name} file
 * @returns {*}
 */
 const file_get_cached = file => fileDB(file).CACHE_CONTENT ?? null;
/**
 * 
 * @returns {Promise.<void>}
 */
 const file_set_cache_all = async () => {
    for (const file_db_record of FILE_DB){
        if ('CACHE_CONTENT' in file_db_record){
            const file = await fs.promises.readFile(process.cwd() + file_db_record.PATH + file_db_record.FILENAME, 'utf8')
                                .then((/**@type{string}*/file)=>JSON.parse(file.toString()))
                                .catch(()=>null);
            file_db_record.CACHE_CONTENT = file?file:null;
        }
    }
    /**@type{import('../../types.js').server_config_apps['APPS']}*/
    const APPS = fileDB('CONFIG_APPS').CACHE_CONTENT.APPS;
    for (const app of APPS){
        if (app.RENDER_CONFIG?.RENDER_FILES)
            for (const renderfile of app.RENDER_CONFIG.RENDER_FILES){
                //save file content (html) in new arrayindex so apps can read files faster
                renderfile.push(await fs.promises.readFile(process.cwd() + renderfile[3], 'utf8').then(filebuffer=>filebuffer.toString()));
            }
    }
 };
/**
 * 
 * Updates config files
 * @param {import('../../types.js').server_db_file_db_name} file 
 * @param {number|null} transaction_id 
 * @param {object} file_content 
 * @returns 
 */
const file_update = async (file, transaction_id, file_content) =>{
    if (!transaction_id || fileDB(file).TRANSACTION_ID != transaction_id)
        return ('⛔');
    else{
        const filepath = fileDB(file).PATH + (fileDB(file).FILENAME?fileDB(file).FILENAME:'');
        const filepath_backup = fileDB(file).PATH + 'backup/' + (fileDB(file).FILENAME?fileDB(file).FILENAME:'');
        //write backup of old config file
        await fs.promises.writeFile(process.cwd() + `${filepath_backup}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, 
                                    JSON.stringify(fileDB(file).TRANSACTION_CONTENT, undefined, 2),  
                                    'utf8');
        //write new file content
        await fs.promises.writeFile(process.cwd() + filepath, 
                                    JSON.stringify(file_content, undefined, 2),  
                                    'utf8')
        .then(()=>{
            fileDB(file).CACHE_CONTENT = file_content;
            if (transaction_commit(file, transaction_id))
                return null;
            else
                throw ('⛔');
        })
        .catch((error)=>{
            if (transaction_rollback(file, transaction_id))
                throw(error);
            else
                throw('⛔ ' + error);
        });
    }
};
/**
 * 
 * @param {import('../../types.js').server_db_file_db_name} file 
 * @param {import('../../types.js').server_db_file_config_files} file_content 
 */
const file_create = async (file, file_content) =>{
    const filepath = fileDB(file).PATH + (fileDB(file).FILENAME?fileDB(file).FILENAME:'');
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
 * @param {import('../../types.js').server_db_file_db_name} file
 * @param {object} file_content 
 * @param {string|null} filesuffix
 */
const file_append_log = async (file, file_content, filesuffix = null) =>{
    const filepath = `${fileDB(file).PATH}${getFilesuffix(filesuffix, null)}`;
    const old_file = await fs.promises.readFile(`${process.cwd()}${filepath}`, 'utf8')
    .catch(()=>null);
    const transaction_id = await transaction_start(file, old_file ?? '');
    
    await fs.promises.appendFile(`${process.cwd()}${filepath}`, JSON.stringify(file_content) + '\r\n', 'utf8')
    .then(()=>{
        if (transaction_commit(file, transaction_id))
            return null;
        else
            throw ('⛔');
    })
    .catch((error)=>{
        if (transaction_rollback(file, transaction_id))
            throw(error);
        else
            throw('⛔ ' + error);
    });
};

const create_config_and_logs_dir = async () => {
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

export {SLASH, file_get, file_get_path, file_get_log_dir, file_get_log, file_get_cached, file_set_cache_all, file_update, file_create, file_append_log, create_config_and_logs_dir};