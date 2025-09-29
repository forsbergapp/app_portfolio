/** @module server/db/AppData */

/**
 * @import {server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete, server_server_response,server_db_table_AppData} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get record
 *              Returns records in base64 format to avoid records limit
 *              Data key contains:
 *              server_db_table_AppData[]
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  name?:string,
 *                  value?:string,
 *                  data_app_id?:string|number|null}}} parameters
 * @returns {server_server_response & {result?:{data:string}[]}}
 */
const get = parameters => {
    const result = server.ORM.getObject(parameters.app_id, 'AppData',parameters.resource_id, server.ORM.UtilNumberValue(parameters.data.data_app_id));
    if (result.result)
        return {result:[{
                            data:Buffer.from (JSON.stringify(result.result.filter((/**@type{server_db_table_AppData}*/row)=>row.name==(parameters.data?.name ?? row.name) && row.value==(parameters.data?.value ?? row.value)))).toString('base64')
                        }], 
                type:'JSON'};
    else
        return result;
};

/**
 * @name getServer
 * @description Get record, called from server without base64 encoding
 * @function
 * @param {{app_id:Number,
*          resource_id:number|null,
*          data:{  name?:string,
*                  value?:string,
*                  data_app_id?:string|number|null}}} parameters
* @returns {server_server_response & {result?:server_db_table_AppData[]}}
*/
const getServer = parameters => {
   const result = server.ORM.getObject(parameters.app_id, 'AppData',parameters.resource_id, server.ORM.UtilNumberValue(parameters.data.data_app_id));
   if (result.result)
       return {result:result.result.filter((/**@type{server_db_table_AppData}*/row)=>row.name==(parameters.data?.name ?? row.name) && row.value==(parameters.data?.value ?? row.value)), 
               type:'JSON'};
   else
       return result;
};

/**
 * @name post
 * @description Create record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null && data.app_id!=null){
        /**@type{server_db_table_AppData} */
        const data_new ={
            id:                 Date.now(),
            app_id:             data.app_id,
            name:               data.name,
            value:              data.value,
            display_data:       data.display_data,
            data2:              data.data2,
            data3:              data.data3,
            data4:              data.data4,
            data5:              data.data5
        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'AppData', post:{data:data_new}}).then((/**@type{server_db_common_result_insert}*/result)=>{
            if (result.affectedRows>0){
                result.insertId = data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(app_id, 404);
        });
    }
    else{
        return server.ORM.getError(app_id, 400);
    }
};
/**
 * @name update
 * @description Update record
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_table_AppData}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
    /**@type{server_db_table_AppData} */
    const data_update = {};
    //allowed parameters to update:
    if (parameters.data.name!=null)
        data_update.name = parameters.data.name;
    if (parameters.data.value!=null)
        data_update.value = parameters.data.value;
    if (parameters.data.display_data!=null)
        data_update.display_data = parameters.data.display_data;
    if (parameters.data.data2!=null)
        data_update.data2 = parameters.data.data2;
    if (parameters.data.data3!=null)
        data_update.data3 = parameters.data.data3;
    if (parameters.data.data4!=null)
        data_update.data4 = parameters.data.data4;
    if (parameters.data.data5!=null)
        data_update.data5 = parameters.data.data5;
    if (Object.entries(data_update).length>0)
        return server.ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppData', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server_db_common_result_update}*/result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return server.ORM.getError(parameters.app_id, 404);
        });
    else
        return server.ORM.getError(parameters.app_id, 400);
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
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'AppData', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server_db_common_result_delete}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, getServer, post, update, deleteRecord};