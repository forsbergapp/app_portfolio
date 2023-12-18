/** @module server/db */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const fs = await import('node:fs');

/**@type{string} */
let SLASH;
if (process.platform == 'win32')
    SLASH = '\\';
else
    SLASH = '/';

/**@type{Types.db_file_db} */
const FILE_DB = [   {APPS:0,                    TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}config${SLASH}apps.json`, CACHE_CONTENT:null},
                    {CONFIG:0,                  TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}config${SLASH}config.json`, CACHE_CONTENT:null},
                    {IAM_BLOCKIP:0,             TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}config${SLASH}iam_blockip.json`, CACHE_CONTENT:null},
                    {IAM_POLICY:0,              TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}config${SLASH}iam_policy.json`, CACHE_CONTENT:null},
                    {IAM_USER:0,                TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}config${SLASH}iam_user.json`, CACHE_CONTENT:null},
                    {IAM_USER_AGENT:0,          TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}config${SLASH}iam_user_agent.json`, CACHE_CONTENT:null},
                    {LOG_APP_INFO:0,            TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_APP_ERROR:0,           TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_DB_INFO:0,             TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_DB_ERROR:0,            TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_REQUEST_INFO:0,        TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_REQUEST_ERROR:0,       TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_SERVER_INFO:0,         TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_SERVER_ERROR:0,        TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_SERVICE_INFO:0,        TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {LOG_SERVICE_ERROR:0,       TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:null},
                    {MICROSERVICE_CONFIG:0,     TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}microservice${SLASH}config${SLASH}config.json`, CACHE_CONTENT:null},
                    {MICROSERVICE_SERVICES:0,   TRANSACTION_ID:0,   TRANSACTION_CONTENT: null, PATH:`${SLASH}microservice${SLASH}config${SLASH}services.json`, CACHE_CONTENT:null}];
Object.seal(FILE_DB);

/**
 * 
 * @param {Types.db_file_db_name} file 
 * @param {object} filecontent
 * @returns {Promise.<number>}
 */
const transaction_start = async (file, filecontent)=>{
    return new Promise((resolve, reject)=>{
        if  (FILE_DB.filter(file_db_record=>(file in file_db_record))[0][file]==0){
            FILE_DB.filter(file_db_record=>(file in file_db_record))[0][file] = 1;
            //add 1ms wait so transaction_id will be guaranteed unique on a fast server
            setTimeout(()=>{
                const transaction_id = Date.now();
                FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_ID = transaction_id;
                FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_CONTENT = filecontent;
                resolve(transaction_id);}, 1);
        }
        else{
            const tries = 0;
            const timer = setInterval(() => {
                if (tries > 100)
                    reject ('timeout');
                else
                    if (FILE_DB.filter(file_db_record=>(file in file_db_record))[0][file]==0){
                        FILE_DB.filter(file_db_record=>(file in file_db_record))[0][file] = 1;
                        const transaction_id = Date.now();
                        FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_ID = transaction_id;
                        FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_CONTENT = filecontent;
                        clearInterval(timer);
                        resolve(transaction_id);
                    }
            }, 100);
        }
            
    });
};
/**
 * 
 * @param {Types.db_file_db_name} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const transaction_commit = (file, transaction_id)=>{
    if (FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_ID==transaction_id){
        FILE_DB.filter(file_db_record=>(file in file_db_record))[0][file] = 0;
        FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_ID = null;
        FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_CONTENT = null;
        return true;
    }
    else{
        return false;
    }
};
/**
 * 
 * @param {Types.db_file_db_name} file 
 * @param {number} transaction_id 
 * @returns {boolean}
 */
const transaction_rollback = (file, transaction_id)=>{
    if (FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_ID==transaction_id){
        FILE_DB.filter(file_db_record=>(file in file_db_record))[0][file] = 0;
        FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_ID = null;
        FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_CONTENT = null;
        
        return true;
    }
    else{
        return false;
    }
};

/**
 * 
 * @param {Types.db_file_db_name} file 
 * @param {boolean} lock 
 * @returns {Promise.<Types.db_file_result_file_get>}
 */
const file_get = async (file, lock=false) =>{
    const filepath = FILE_DB.filter(file_db_record=>(file in file_db_record))[0].PATH;
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
 * 
 * @param {Types.db_file_db_name} file
 * @returns {object|null}
 */
 const file_get_cached = (file) => FILE_DB.filter(file_db_record=>(file in file_db_record))[0].CACHE_CONTENT;
/**
 * 
 * @returns {Promise.<void>}
 */
 const file_set_cache_all = async () => {
    for (const file_db_record of FILE_DB){
        if ('CACHE_CONTENT' in file_db_record){
            const fileBuffer = await fs.promises.readFile(process.cwd() + file_db_record.PATH, 'utf8');    
            file_db_record.CACHE_CONTENT = JSON.parse(fileBuffer.toString());
        }
    }
 };
/**
 * 
 * @param {Types.db_file_db_name} file 
 * @param {number} transaction_id 
 * @param {object} file_content 
 * @returns 
 */
const file_update = async (file, transaction_id, file_content) =>{
    if (FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_ID != transaction_id)
        return ('⛔');
    else{
        const filepath = FILE_DB.filter(file_db_record=>(file in file_db_record))[0].PATH;
        //write backup of old file
        await fs.promises.writeFile(process.cwd() + `${filepath}.${new Date().toISOString().replace(new RegExp(':', 'g'),'.')}`, 
                                    JSON.stringify(FILE_DB.filter(file_db_record=>(file in file_db_record))[0].TRANSACTION_CONTENT, undefined, 2),  
                                    'utf8');
        //write new file content
        await fs.promises.writeFile(process.cwd() + filepath, 
                                    JSON.stringify(file_content, undefined, 2),  
                                    'utf8')
        .then(()=>{
            FILE_DB.filter(file_db_record=>(file in file_db_record))[0].CACHE_CONTENT = file_content;
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
 * @param {Types.db_file_db_name} file 
 * @param {object} file_content 
 */
const file_create = async (file, file_content) =>{
    const filepath = FILE_DB.filter(file_db_record=>(file in file_db_record))[0].PATH;
    await fs.promises.writeFile(process.cwd() + filepath, JSON.stringify(file_content, undefined, 2),  'utf8')
    .then(() => {
        return null;
    })
    .catch((error)=> {
        throw error;
    });
};
const create_config_and_logs_dir = async () => {
    const mkdir = async (/**@type{string} */dir) =>{
        await fs.promises.mkdir(process.cwd() + dir)
        .catch((error)=>{
            throw error;
        });
    };
    for (const dir of [ `${SLASH}config`, 
                        `${SLASH}logs`, 
                        `${SLASH}microservice${SLASH}config`, 
                        `${SLASH}microservice${SLASH}logs`, 
                        `${SLASH}microservice${SLASH}temp`]){
        await fs.promises.access(process.cwd() + dir)
        .catch(()=>{
            mkdir(dir);  
        });
    }
};
export {file_get, file_get_cached, file_set_cache_all, file_update, file_create, create_config_and_logs_dir};