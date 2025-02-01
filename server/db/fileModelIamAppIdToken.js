/** @module server/db/fileModelIamAppIdToken */

/**
 * @import {server_server_response,server_db_common_result_insert, server_db_file_iam_app_id_token_insert, server_db_file_iam_app_id_token} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBPost, fileDBGet} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get user
 * @function
 * @param {number} app_id
 * @returns {server_server_response & {result?:server_db_file_iam_app_id_token[] }}
 */
const get = app_id => {return {result:fileDBGet(app_id, 'IAM_APP_ID_TOKEN', null, null).rows, type:'JSON'};};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_file_iam_app_id_token_insert} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null &&
        data.app_id != null &&
        data.res != null &&
        data.token != null &&
        data.ip != null){
        //security check that token is not used already
        if (fileDBGet(app_id, 'IAM_APP_ID_TOKEN', null, null).rows.filter((/**@type{server_db_file_iam_app_id_token} */row)=>row.token==data.token).length==0){
            /**@type{server_db_file_iam_app_id_token} */
            const data_new = {};
            //required
            data_new.app_id = data.app_id;
            data_new.res = data.res;
            data_new.token = data.token;
            data_new.ip = data.ip;
            //optional
            if (data.ua!=null)
                data_new.ua = data.ua;
            data_new.created = new Date().toISOString();
            return fileDBPost(app_id, 'IAM_APP_ID_TOKEN',data_new).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return dbCommonRecordError(app_id, 404);
            });
        }
        else
            return dbCommonRecordError(app_id, 401);
    }
    else
        return dbCommonRecordError(app_id, 400);
};

export {get, post};