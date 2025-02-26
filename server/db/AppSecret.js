/** @module server/db/AppParameter */

/**
 * @import {server_server_response,server_db_common_result_update,server_db_common_result_insert,server_db_common_result_delete,
 *          server_db_table_AppSecret} from '../types.js'
 */
/**@type{import('./ORM.js')} */
const {fileFsRead, fileDBGet, fileCommonExecute} = await import(`file://${process.cwd()}/server/db/ORM.js`);
/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('../db/ORM.js')} */
const { getError} = await import(`file://${process.cwd()}/server/db/ORM.js`);
/**
 * @name get
 * @description Get record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number|null,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_AppSecret[] }}
 */
const get = parameters => {
    const result = fileDBGet(parameters.app_id, 'AppSecret',null, serverUtilNumberValue(parameters.resource_id));
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return getError(parameters.app_id, 404);
};

/**
 * @name getFile
 * @description Get record from file
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_server_response & {result?:server_db_table_AppSecret }>}
 */
const getFile = async app_id => {
    return {result:await fileFsRead('AppSecret').then(result=>result.file_content.filter((/**@type{server_db_table_AppSecret}*/row)=> row.app_id == app_id)[0]),
            type:'JSON'};};

/**
 * @name post
 * @description Create record
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
        return getError(parameters.app_id, 400);
    else{
        //updates only one key in the record
        return fileCommonExecute({app_id:parameters.app_id, dml:'UPDATE', object:'AppSecret', update:{resource_id:null, data_app_id:parameters.resource_id, data:{[parameters.data.parameter_name]:parameters.data.parameter_value}}}).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return getError(parameters.app_id, 404);
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
    return fileCommonExecute({app_id:app_id, dml:'DELETE', object:'AppSecret', delete:{resource_id:null, data_app_id:resource_id}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return getError(app_id, 404);
    });
};
                   
export {get, getFile, post, update, deleteRecord};