/** @module server/db/AppDataResourceDetail */

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
 *          all_users?:boolean,
 *          join?:boolean,
 *          data:{  data_app_id?:number|null,
 *                  iam_user_id:number|null,
 *                  app_data_resource_master_id:number|null,
 *                  resource_name :string|null,
 *                  app_data_entity_id:number}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['AppDataResourceDetail'][] }}
 */
const get = parameters =>{ 
    const entity_id = parameters.data?.app_data_entity_id??server.ORM.db.AppDataEntity.get({  app_id:parameters.app_id, 
                                        resource_id:null,
                                        data:{data_app_id:parameters.data.data_app_id}}).result[0].Id;
    const result_AppDataEntityResource =    server.ORM.db.AppDataEntityResource.get({ app_id:parameters.app_id, 
                                                                        resource_id:null,
                                                                        data:{  app_data_entity_id:entity_id,
                                                                                resource_name:parameters.data.resource_name
                                                                        }}).result;

    const  result_AppDataResourceMaster = server.ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                        join:true,
                                                                        resource_id:null,
                                                                        data:{data_app_id:parameters.data.data_app_id,
                                                                            iam_user_id:parameters.data.iam_user_id,
                                                                            resource_name:null,
                                                                            app_data_entity_id:entity_id}}).result;
    const result = (server.ORM.getObject(parameters.app_id, 'AppDataResourceDetail',parameters.resource_id, null).result ?? [])
                    .filter((/**@type{server['ORM']['Object']['AppDataResourceDetail']}*/row)=>
                            row.AppDataResourceMasterId == (parameters.data.app_data_resource_master_id ?? row.AppDataResourceMasterId) &&
                            result_AppDataEntityResource
                            .filter((/**@type{server['ORM']['Object']['AppDataEntityResource']}*/row_AppDataEntityResource)=>
                                row_AppDataEntityResource.Id == row.AppDataEntityResourceId
                            ).length>0 &&
                            result_AppDataResourceMaster
                            .filter((/**@type{server['ORM']['Object']['AppDataResourceMaster']}*/row_master)=>
                                parameters.all_users || row_master.Id == row.AppDataResourceMasterId
                            ).length>0
                        );
    if (result.length>0 || parameters.resource_id==null ||parameters.join)
        return {result:result, type:'JSON'};
    else
        return server.ORM.getError(parameters.app_id, 404);
};
/**
 * @name post
 * @description Create record
 * @function
 * @param {{app_id:number,
 *          data:server['ORM']['Object']['AppDataResourceDetail']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert']}>}
 */
const post = async parameters => {
  //check required attributes
  if (  parameters.data.AppDataResourceMasterId==null || parameters.data.AppDataEntityResourceId==null){
      return server.ORM.getError(parameters.app_id, 400);
  }
  else{
      /**@type{server['ORM']['Object']['AppDataResourceDetail']} */
      const data_new =     {
                               Id:Date.now(),
                               AppDataResourceMasterId:parameters.data.AppDataResourceMasterId,
                               AppDataEntityResourceId:parameters.data.AppDataEntityResourceId,
                               AppDataResourceMasterAttributeId:parameters.data.AppDataResourceMasterAttributeId,
                               Document:parameters.data.Document,
                               Created:new Date().toISOString(),
                               Modified:null
                      };
      return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'AppDataResourceDetail', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
          if (result.AffectedRows>0){
              result.InsertId=data_new.Id;
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
 *          data:server['ORM']['Object']['AppDataResourceDetail']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async parameters =>{
    //check required attributes
    if (parameters.resource_id==null){
        return server.ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['AppDataResourceDetail']} */
        const data_update = {};
        //allowed parameters to update:
        if (parameters.data.Document!=null)
            data_update.Document = parameters.data.Document;
        if (parameters.data.AppDataResourceMasterAttributeId!=null)
            data_update.AppDataResourceMasterAttributeId = parameters.data.AppDataResourceMasterAttributeId;
        data_update.Modified = new Date().toISOString();
        if (Object.entries(data_update).length>0)
            return server.ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppDataResourceDetail', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                if (result.AffectedRows>0)
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
* @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
*/
const deleteRecord = async parameters =>{
    return server.ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'AppDataResourceDetail', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};        
export {get, post, update, deleteRecord};