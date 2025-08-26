/** @module server/db/IamEncryption */

/**
 * @import {server_server_response,server_db_common_result_insert, server_db_table_IamEncryption} from '../types.js'
 */
const {ORM} = await import ('../server.js');
/**
 * @name get
 * @description Get
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{data_app_id:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamEncryption[] }}
 */
const get = parameters =>ORM.getObject(parameters.app_id, 'IamEncryption',parameters.resource_id, parameters.data.data_app_id);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_table_IamEncryption} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null &&
        data.app_id != null &&
        data.uuid != null &&
        data.secret != null){
        /**@type{server_db_table_IamEncryption} */
        const data_new = {};
        data_new.id = Date.now();
        data_new.app_id = data.app_id;
        data_new.iam_app_id_token_id = data.iam_app_id_token_id;
        data_new.uuid = data.uuid;
        data_new.secret = data.secret;
        data_new.type = data.type;
        data_new.url = data.url;
        data_new.created = new Date().toISOString();
        return ORM.Execute({app_id:app_id, dml:'POST', object:'IamEncryption', post:{data:data_new}}).then((/**@type{server_db_common_result_insert}*/result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return ORM.getError(app_id, 404);
        });
    }
    else
        return ORM.getError(app_id, 400);
};

export {get, post};