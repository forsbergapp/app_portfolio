/** @module server/db/IamMicroserviceToken */

/**
 * @import {server_server_response,server_db_common_result_insert, server_db_table_IamMicroserviceToken} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamMicroserviceToken[] }}
 */
const get = parameters => server.ORM.getObject(parameters.app_id, 'IamMicroserviceToken', parameters.resource_id, parameters.app_id);

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_table_IamMicroserviceToken} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null &&
        data.app_id != null &&
        data.service_registry_id != null &&
        data.service_registry_name != null &&
        data.res != null &&
        data.token != null &&
        data.ip != null &&
        data.host != null){
        //security check that token is not used already
        if (server.ORM.getObject(app_id, 'IamMicroserviceToken', null, null).result.filter((/**@type{server_db_table_IamMicroserviceToken} */row)=>row.token==data.token).length==0){
            /**@type{server_db_table_IamMicroserviceToken} */
            const data_new = {};
            data_new.id = Date.now();
            //required
            data_new.app_id =data.app_id; 
            data_new.service_registry_id = data.service_registry_id;
            data_new.service_registry_name = data.service_registry_name;
            data_new.res = data.res;
            data_new.token = data.token;
            data_new.ip = data.ip;
            data_new.host = data.host;
            //optional
            if (data.ua!=null)
                data_new.ua = data.ua;
            data_new.created = new Date().toISOString();
            return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamMicroserviceToken', post:{data:data_new}}).then((/**@type{server_db_common_result_insert}*/result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return server.ORM.getError(app_id, 404);
            });
        }
        else
            return server.ORM.getError(app_id, 401);
    }
    else
        return server.ORM.getError(app_id, 400);
};

export {get, post};