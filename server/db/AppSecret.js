/** @module server/db/AppParameter */

/**
 * @import {server_server_response,server_db_common_result_update,server_db_common_result_insert,server_db_common_result_delete,
 *          server_db_table_app_secret} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileFsRead, fileDBGet, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);
/**
 * @name get
 * @description Get record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number|null,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_app_secret[] }}
 */
const get = parameters => {
    const result = fileDBGet(parameters.app_id, 'APP_SECRET',null, serverUtilNumberValue(parameters.resource_id));
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

/**
 * @name getFile
 * @description Get record from file
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_server_response & {result?:server_db_table_app_secret }>}
 */
const getFile = async app_id => {
    return {result:await fileFsRead('APP_SECRET').then(result=>result.file_content.filter((/**@type{server_db_table_app_secret}*/row)=> row.app_id == app_id)[0]),
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
        return dbCommonRecordError(parameters.app_id, 400);
    else{
        //updates only one key in the record
        return fileDBUpdate(parameters.app_id, 'APP_SECRET', null, parameters.resource_id, {[parameters.data.parameter_name]:parameters.data.parameter_value}).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(parameters.app_id, 404);
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
    return fileDBDelete(app_id, 'APP_SECRET', null, resource_id).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(app_id, 404);
    });
};
                   
export {get, getFile, post, update, deleteRecord};