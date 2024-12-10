/** @module server/db/fileModelIamUserLogin */

/**
 * @import {server_db_file_iam_user_login} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileDBPost, fileDBGet, fileDBUpdate} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_db_file_iam_user_login[]}
 */
const get = (app_id, resource_id) => fileDBGet(app_id, 'IAM_USER_LOGIN', resource_id, null);

/**
 * Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<{affectedRows:number}>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (app_id!=null &&
        data.iam_user_id!=null &&
        data.app_id != null &&
        data.user != null &&
        data.res != null &&
        data.ip != null){
        //security check that token is not used already
        if (fileDBGet(app_id, 'IAM_USER_LOGIN', null, null).filter((/**@type{server_db_file_iam_user_login} */row)=>row.token==data.token).length==0){
            /**@type{server_db_file_iam_user_login} */
            const data_new = {};
            data_new.id =  Date.now();
            //required
            data_new.iam_user_id = data.iam_user_id;
            data_new.app_id = data.app_id;
            data_new.user = data.user;
            data_new.res = data.res;
            data_new.ip = data.ip;
            //optional
            if (data.token!=null)
                data_new.token = data.token;
            if (data.db!=null)
                data_new.db = data.db;    
            if (data.ua!=null)
                data_new.ua = data.ua;
            if (data.long!=null)
                data_new.long = data.long;
            if (data.lat!=null)
                data_new.lat = data.lat;
            data_new.created = new Date().toISOString();
            return fileDBPost(app_id, 'IAM_USER_LOGIN',data_new).then((result)=>{
                if (result.affectedRows>0)
                    return result;
                else
                    throw fileCommonRecordNotFound(null);
            });
        }
        else{
            //token already used, user can not login
            throw '⛔';
        }
            
    }
    else
        throw '⛔';
}; 

/**
 * Update record
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} data
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data) =>{
    //check required attributes
    if (app_id!=null && resource_id != null){
        /**@type{server_db_file_iam_user_login} */
        const data_update = {};
        //check allowed attributes to update
        if (data.res!=null)
            data_update.res = data.res;
        data_update.modified = data.modified;
        if (Object.entries(data_update).length>1){
            const result = await fileDBUpdate(app_id, 'IAM_USER_LOGIN',resource_id, null, data);
            if (result.affectedRows>0)
                return result;
            else
                throw fileCommonRecordNotFound(null);    
        }
        else
            throw '⛔';
    }
    else
        throw '⛔';
};

export {get, post, update};