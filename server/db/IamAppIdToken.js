/** @module server/db/IamAppIdToken */

/**
 * @import {server_server_response,server_db_common_result_insert, server_db_iam_app_id_token_insert, server_db_table_IamAppIdToken} from '../types.js'
 */

/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

/**
 * @name get
 * @description Get user
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamAppIdToken[] }}
 */
const get = parameters => {return {result:ORM.getObject(parameters.app_id, 'IamAppIdToken', parameters.resource_id, parameters.app_id).rows, type:'JSON'};};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_iam_app_id_token_insert} data
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
        if (ORM.getObject(app_id, 'IamAppIdToken', null, null).rows.filter((/**@type{server_db_table_IamAppIdToken} */row)=>row.token==data.token).length==0){
            /**@type{server_db_table_IamAppIdToken} */
            const data_new = {};
            data_new.id = Date.now();
            //required
            data_new.app_id = data.app_id;
            data_new.res = data.res;
            data_new.token = data.token;
            data_new.ip = data.ip;
            //optional
            if (data.ua!=null)
                data_new.ua = data.ua;
            data_new.created = new Date().toISOString();
            return ORM.Execute({app_id:app_id, dml:'POST', object:'IamAppIdToken', post:{data:data_new}}).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return ORM.getError(app_id, 404);
            });
        }
        else
            return ORM.getError(app_id, 401);
    }
    else
        return ORM.getError(app_id, 400);
};

export {get, post};