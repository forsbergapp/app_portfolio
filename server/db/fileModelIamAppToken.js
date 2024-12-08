/** @module server/db/fileModelIamAppToken */

/**
 * @import {server_db_file_iam_app_token} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileFsDBLogPost, fileFsDBLogGet} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_db_file_iam_app_token[]>}
 */
const get = async app_id => fileFsDBLogGet(app_id, 'IAM_APP_TOKEN', null, null,'');

/**
 * Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<{affectedRows:number}>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null &&
        data.app_id != null &&
        data.res != null &&
        data.token != null &&
        data.ip != null){
        //security check that token is not used already
        if (await fileFsDBLogGet(app_id, 'IAM_APP_TOKEN', null, null,'').then(result=>result.filter((/**@type{server_db_file_iam_app_token} */row)=>row.token==data.token).length==0)){
            /**@type{server_db_file_iam_app_token} */
            const data_new = {};
            //required
            data_new.app_id = data.app_id;
            data_new.res = data.res;
            data_new.token = data.token;
            data_new.ip = data.ip;
            //optional
            if (data.ua!=null)
                data_new.ua = data.ua;
            if (data.long!=null)
                data_new.long = data.long;
            if (data.lat!=null)
                data_new.lat = data.lat;
            data_new.created = new Date().toISOString();
            return fileFsDBLogPost(app_id, 'IAM_APP_TOKEN',data_new, '').then((result)=>{
                if (result.affectedRows>0)
                    return result;
                else
                    throw fileCommonRecordNotFound(null);
            });
        }
        else
            throw '⛔';    
    }
    else
        throw '⛔';
};

export {get, post};