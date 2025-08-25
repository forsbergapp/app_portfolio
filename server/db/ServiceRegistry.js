/** @module server/db/ServiceRegistry */

/**
 * @import {server_server_response,server_db_common_result_update,
 *          server_db_table_ServiceRegistry} from '../types.js'
 */
const {ORM} = await import ('../server.js');
/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  name:string|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_ServiceRegistry[] }}
 */
const get = parameters =>{
    const result = ORM.getObject(parameters.app_id, 'ServiceRegistry',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_ServiceRegistry}*/row)=>
                        row.name == (parameters.data.name ?? row.name ));
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
};

/**
 * @name update
 * @description Update record
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_table_ServiceRegistry}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters => {
   /**@type{server_db_table_ServiceRegistry} */
   const data_update = {};
   //allowed parameters to update:
   if (parameters.data.name!=null)
       data_update.name = parameters.data.name;
   if (parameters.data.server_host!=null)
       data_update.server_host = parameters.data.server_host;
   if (parameters.data.server_port!=null)
       data_update.server_port = parameters.data.server_port;
   if (parameters.data.metrics_url!=null)
       data_update.metrics_url = parameters.data.metrics_url;
   if (parameters.data.health_url!=null)
        data_update.health_url = parameters.data.health_url;
   if (parameters.data.rest_api_version!=null)
        data_update.rest_api_version = parameters.data.rest_api_version;
   if (parameters.data.status!=null)
        data_update.status = parameters.data.status;
   data_update.modified = new Date().toISOString();
   if (Object.entries(data_update).length>0)
       return ORM.Execute({ app_id:parameters.app_id, 
                            dml:'UPDATE', 
                            object:'ServiceRegistry', 
                            update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}})
                .then((result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return ORM.getError(parameters.app_id, 404);
                });
   else
       return ORM.getError(parameters.app_id, 400);
};

export {get, update};