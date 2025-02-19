/** @module server/db/AppModule */

/**
 * @import {server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete, server_server_response,server_db_table_app_module} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get records for given appid
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          resource_id:number|null,
 *          data:{data_app_id?:string|number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_app_module[] }}
 */
const get = parameters => {
    const result = fileDBGet(parameters.app_id, 'APP_MODULE',parameters.resource_id, serverUtilNumberValue(parameters.data.data_app_id));
    if (result.rows.length>0 || parameters.resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null && data.app_id!=null && data.common_type!=null && data.common_name!=null && data.common_role!=null && data.common_path!=null){
        /**@type{server_db_table_app_module} */
        const data_new ={
            id:                 Date.now(),
            app_id:             data.app_id,
            common_type:        data.common_type,
            common_name:        data.common_name,
            common_role:        data.common_role,
            common_path:        data.common_path,
            common_description: data.common_description
        };
        return fileDBPost(app_id, 'APP_MODULE', data_new).then((result)=>{
            if (result.affectedRows>0){
                result.insertId = data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return dbCommonRecordError(app_id, 404);
        });
    }
    else{
        return dbCommonRecordError(app_id, 400);
    }
};
/**
 * @name update
 * @description Update record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_table_app_module}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
    /**@type{server_db_table_app_module} */
    const data_update = {};
    //allowed parameters to update:
    if (parameters.data.common_type!=null)
        data_update.common_type = parameters.data.common_type;
    if (parameters.data.common_name!=null)
        data_update.common_name = parameters.data.common_name;
    if (parameters.data.common_role!=null)
        data_update.common_role = parameters.data.common_role;
    if (parameters.data.common_path!=null)
        data_update.common_path = parameters.data.common_path;
    if (parameters.data.common_description!=null)
        data_update.common_description = parameters.data.common_description;
    if (Object.entries(data_update).length>0)
        return fileDBUpdate(parameters.app_id, 'APP_MODULE', parameters.resource_id, null, data_update).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(parameters.app_id, 404);
        });
    else
        return dbCommonRecordError(parameters.app_id, 400);
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
    return fileDBDelete(app_id, 'APP_MODULE', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};