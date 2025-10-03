/** @module server/db/ServiceRegistry */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  name:string|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['ServiceRegistry'][] }}
 */
const get = parameters =>{
    const result = (server.ORM.getObject(parameters.app_id, 'ServiceRegistry',parameters.resource_id, null).result??[])
                    .filter((/**@type{server['ORM']['Object']['ServiceRegistry']}*/row)=>
                        row.Name == (parameters.data.name ?? row.Name ));
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return server.ORM.getError(parameters.app_id, 404);
};

/**
 * @name update
 * @description Update record
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server['ORM']['Object']['ServiceRegistry']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async parameters => {
   /**@type{server['ORM']['Object']['ServiceRegistry']} */
   const data_update = {};
   //allowed parameters to update:
   if (parameters.data.Name!=null)
       data_update.Name = parameters.data.Name;
   if (parameters.data.ServerHost!=null)
       data_update.ServerHost = parameters.data.ServerHost;
   if (parameters.data.ServerPort!=null)
       data_update.ServerPort = parameters.data.ServerPort;
   if (parameters.data.MetricsUrl!=null)
       data_update.MetricsUrl = parameters.data.MetricsUrl;
   if (parameters.data.HealthUrl!=null)
        data_update.HealthUrl = parameters.data.HealthUrl;
   if (parameters.data.RestApiVersion!=null)
        data_update.RestApiVersion = parameters.data.RestApiVersion;
   if (parameters.data.Status!=null)
        data_update.Status = parameters.data.Status;
   data_update.Modified = new Date().toISOString();
   if (Object.entries(data_update).length>0)
       return server.ORM.Execute({ app_id:parameters.app_id, 
                            dml:'UPDATE', 
                            object:'ServiceRegistry', 
                            update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}})
                .then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                    if (result.AffectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return server.ORM.getError(parameters.app_id, 404);
                });
   else
       return server.ORM.getError(parameters.app_id, 400);
};

export {get, update};