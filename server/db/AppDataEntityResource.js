/** @module server/db/App */

/**
 * @import {server_server_response,server_db_table_AppDataEntityResource, server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */

/**@type{import('./ORM.js')} */
const {fileDBGet, fileCommonExecute} = await import(`file://${process.cwd()}/server/db/ORM.js`);
/**@type{import('../db/ORM.js')} */
const { getError} = await import(`file://${process.cwd()}/server/db/ORM.js`);

/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number|null,
 *          resource_id:number|null,
 *          data:{  entity_id?:string|null,
 *                  resource_name?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_table_AppDataEntityResource & {app_data_name:string, app_data_value:string, app_data_display_data:string}[] }>}
 */
const get = async parameters =>{ 
    /**@type{import('./AppData.js')} */
    const AppData = await import(`file://${process.cwd()}/server/db/AppData.js`);

    const result = fileDBGet(parameters.app_id, 'AppDataEntityResource',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_AppDataEntityResource}*/row)=>
                                row.id                      == (parameters.resource_id ?? row.id) &&
                                row.app_data_entity_id      == (parameters.data.entity_id ?? row.app_data_entity_id));
    if (result.length>0 || parameters.resource_id==null)
        /**@ts-ignore */
        return {result:result
                        .map((/**@type{server_db_table_AppDataEntityResource & {app_data_name:string, app_data_value:string, app_data_display_data:string}}*/row)=>{
                            /**@ts-ignore */
                            const app_data = AppData.getServer({ app_id:parameters.app_id, 
                                                                                resource_id:row.app_data_id,
                                                                                data:{data_app_id:null}}).result[0];
                            row.app_data_name = app_data?.name;
                            row.app_data_value = app_data?.value;
                            row.app_data_display_data = app_data?.display_data;
                            return row;
                        })
                        .filter((/**@type{server_db_table_AppDataEntityResource & {app_data_name:string, app_data_value:string, app_data_display_data:string}}*/row)=>
                            row.app_data_value == (parameters.data?.resource_name ?? row.app_data_value)
                        ),
                type:'JSON'};
    else
        return getError(parameters.app_id, 404);
};
/**
 * @name post
 * @description Create record
 * @function
 * @param {{app_id:number,
 *          data:server_db_table_AppDataEntityResource}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const post = async parameters => {
   //check required attributes
   if (parameters.data.app_data_entity_id==null ||parameters.data.app_data_id==null){
       return getError(parameters.app_id, 400);
   }
   else{
       /**@type{server_db_table_AppDataEntityResource} */
       const data_new =     {
                                id:Date.now(),
                                app_data_entity_id:parameters.data.app_data_entity_id,
                                app_data_id:parameters.data.app_data_id,
                                json_data:parameters.data.json_data,
                                created:new Date().toISOString(),
                                modified:null
                       };
       return fileCommonExecute({app_id:parameters.app_id, dml:'POST', object:'AppDataEntityResource', post:{data:data_new}}).then((result)=>{
           if (result.affectedRows>0){
               result.insertId=data_new.id;
               return {result:result, type:'JSON'};
           }
           else
               return getError(parameters.app_id, 404);
       });
   }
};
/**
 * @name update
 * @description Update record
 * @function
 * @param {{app_id:number,
*          resource_id:number,
*          data:server_db_table_AppDataEntityResource}} parameters
* @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
*/
const update = async parameters =>{
   //check required attributes
   if (parameters.resource_id==null){
       return getError(parameters.app_id, 400);
   }
   else{
       /**@type{server_db_table_AppDataEntityResource} */
       const data_update = {};
       //allowed parameters to update:
       if (parameters.data.json_data!=null)
           data_update.json_data = parameters.data.json_data;
       data_update.modified = new Date().toISOString();
       if (Object.entries(data_update).length>0)
           return fileCommonExecute({app_id:parameters.app_id, dml:'UPDATE', object:'AppDataEntityResource', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
               if (result.affectedRows>0)
                   return {result:result, type:'JSON'};
               else
                   return getError(parameters.app_id, 404);
           });
       else
           return getError(parameters.app_id, 400);
   }
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{
    return fileCommonExecute({app_id:parameters.app_id, dml:'DELETE', object:'AppDataEntityResource', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return getError(parameters.app_id, 404);
    });
};        
export {get, post, update, deleteRecord};