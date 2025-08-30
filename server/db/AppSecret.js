/** @module server/db/AppParameter */

/**
 * @import {server_server_response,server_db_common_result_update,server_db_common_result_insert,server_db_common_result_delete,
 *          server_db_table_AppSecret} from '../types.js'
 */

const {server} = await import ('../server.js');

/**
 * @name get
 * @description Get record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_AppSecret[] }}
 */
const get = parameters => server.ORM.getObject(parameters.app_id, 'AppSecret',null, server.ORM.UtilNumberValue(parameters.resource_id));

/**
 * @name post
 * @description Create record
 *              Object saves key values for given app id and adds one parameter to the same record
 *              and update function is called and returns same resource id
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, resource_id, data) => update({app_id:app_id, resource_id:resource_id, data:data})
                                                        .then(result_update=>{return {result:{insertid:resource_id, affectedRows:result_update.result.affectedRows}, type:'JSON'};}) ;
/**
 * @name update
 * @description Update record
 *              Object saves key values for given app id and adds one parameter to the same record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  parameter_name:string,
 *                  parameter_value:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
    if  (parameters.data.parameter_name=='app_id')
        return server.ORM.getError(parameters.app_id, 400);
    else{
        //updates only one key in the record
        return server.ORM.Execute({app_id:parameters.app_id, 
                            dml:'UPDATE', 
                            object:'AppSecret', 
                            update:{    resource_id:null, 
                                        data_app_id:parameters.resource_id, 
                                        data:{[parameters.data.parameter_name]:parameters.data.parameter_value}}})
                .then((/**@type{server_db_common_result_update}*/result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return server.ORM.getError(parameters.app_id, 404);
                });
    }
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'AppSecret', delete:{resource_id:null, data_app_id:resource_id}}).then((/**@type{server_db_common_result_delete}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};