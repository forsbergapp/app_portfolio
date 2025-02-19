/** @module server/db/AppParameter */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_app_parameter} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get records for given appid
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_app_parameter[] }}
 */
const get = parameters =>{
    const result = fileDBGet(parameters.app_id, 'APP_PARAMETER',null, serverUtilNumberValue(parameters.resource_id));
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Add record
 *              Table is designed to add one parameter in the same record
 *              so update function is called  and returns same resource id
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, resource_id, data) => update({app_id:app_id, resource_id:resource_id, data:data})
                                                        .then((result_update)=>{
                                                            return result_update.http?result_update:{result:{insertId:resource_id, affectedRows:result_update.result.affectedRows}, type:'JSON'};
                                                        }) ;
/**
 * @name update
 * @description Update
 *              Table is designed to update one parameter in the same record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  parameter_name:string,
 *                  parameter_value:string,
 *                  parameter_comment:string}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
    if  (parameters.data.parameter_name=='app_id'){
        return dbCommonRecordError(parameters.app_id, 400);
    }
    else{
        //updates only one key in the record
        return fileDBUpdate(parameters.app_id, 'APP_PARAMETER', null, parameters.resource_id, {[parameters.data.parameter_name]:{value:parameters.data.parameter_value, 
                                                                                                comment:parameters.data.parameter_comment}}).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(parameters.app_id, 404);
        });
    }
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return fileDBDelete(app_id, 'APP_PARAMETER', null, resource_id).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};