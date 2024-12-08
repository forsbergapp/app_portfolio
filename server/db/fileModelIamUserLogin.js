/** @module server/db/fileModelIamUserLogin */

/**
 * @import {server_db_file_iam_user_login} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileFsDBLogPost, fileFsDBLogGet, fileFsDBLogUpdate} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {Promise.<server_db_file_iam_user_login[]>}
 */
const get = async (app_id, resource_id) => fileFsDBLogGet(app_id, 'IAM_USER_LOGIN', resource_id, null,'');

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
        data.token != null &&
        data.ip != null){
        //security check that token is not used already
        if (await fileFsDBLogGet(app_id, 'IAM_USER_LOGIN', null, null,'').then(result=>result.filter((/**@type{server_db_file_iam_user_login} */row)=>row.token==data.token).length==0)){
            /**@type{server_db_file_iam_user_login} */
            const data_new = {};
            data_new.id =  Date.now();
            //required
            data_new.iam_user_id = data.iam_user_id;
            data_new.app_id = data.app_id;
            data_new.user = data.user;
            data_new.res = data.res;
            data_new.token = data.token;
            data_new.ip = data.ip;
            //optional
            if (data.db!=null)
                data_new.db = data.db;    
            if (data.ua!=null)
                data_new.ua = data.ua;
            if (data.long!=null)
                data_new.long = data.long;
            if (data.lat!=null)
                data_new.lat = data.lat;
            data_new.created = new Date().toISOString();
            return fileFsDBLogPost(app_id, 'IAM_USER_LOGIN',data_new, '').then((result)=>{
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
        if (Object.entries(data_update).length>0){
            const result = await fileFsDBLogUpdate(app_id, 'IAM_USER_LOGIN',resource_id, data);
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