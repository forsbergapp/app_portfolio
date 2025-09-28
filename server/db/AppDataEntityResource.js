/** @module server/db/App */

/**
 * @import {server_server_response,server_db_table_AppDataEntityResource, server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  app_data_entity_id?:number|null,
 *                  resource_name?:string|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_AppDataEntityResource & {app_data_name:string, app_data_value:string, app_data_display_data:string}[] }}
 */
const get = parameters =>{ 
    const result = (server.ORM.getObject(parameters.app_id, 'AppDataEntityResource',parameters.resource_id, null).result ?? [])
                    .filter((/**@type{server_db_table_AppDataEntityResource}*/row)=>
                                row.id                      == (parameters.resource_id ?? row.id) &&
                                row.app_data_entity_id      == (parameters.data.app_data_entity_id ?? row.app_data_entity_id));
    if (result)
        return {result:result
                        .map((/**@type{server_db_table_AppDataEntityResource & {app_data_name:string, app_data_value:string, app_data_display_data:string}}*/row)=>{
                            const app_data = server.ORM.db.AppData.getServer({ app_id:parameters.app_id, 
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
        return server.ORM.getError(parameters.app_id, 404);
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
       return server.ORM.getError(parameters.app_id, 400);
   }
   else{
       /**@type{server_db_table_AppDataEntityResource} */
       const data_new =     {
                                id:Date.now(),
                                app_data_entity_id:parameters.data.app_data_entity_id,
                                app_data_id:parameters.data.app_data_id,
                                Document:parameters.data.Document,
                                created:new Date().toISOString(),
                                modified:null
                       };
       return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'AppDataEntityResource', post:{data:data_new}}).then((/**@type{server_db_common_result_insert}*/result)=>{
           if (result.affectedRows>0){
               result.insertId=data_new.id;
               return {result:result, type:'JSON'};
           }
           else
               return server.ORM.getError(parameters.app_id, 404);
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
       return server.ORM.getError(parameters.app_id, 400);
   }
   else{
       /**@type{server_db_table_AppDataEntityResource} */
       const data_update = {};
       //allowed parameters to update:
       if (parameters.data.Document!=null)
           data_update.Document = parameters.data.Document;
       data_update.modified = new Date().toISOString();
       if (Object.entries(data_update).length>0)
           return server.ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppDataEntityResource', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server_db_common_result_update}*/result)=>{
               if (result.affectedRows>0)
                   return {result:result, type:'JSON'};
               else
                   return server.ORM.getError(parameters.app_id, 404);
           });
       else
           return server.ORM.getError(parameters.app_id, 400);
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
    return server.ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'AppDataEntityResource', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server_db_common_result_delete}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};        
export {get, post, update, deleteRecord};