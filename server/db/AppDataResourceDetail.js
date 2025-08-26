/** @module server/db/AppDataResourceDetail */

/**
 * @import {server_server_response,
 *          server_db_table_AppDataResourceMaster,server_db_table_AppDataResourceDetail, server_db_table_AppDataEntityResource,
 *          server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */

const {ORM} = await import ('../server.js');

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
 * @returns {server_server_response & {result?:server_db_table_AppDataResourceDetail[] }}
 */
const get = parameters =>{ 
    const entity_id = parameters.data?.app_data_entity_id??ORM.db.AppDataEntity.get({  app_id:parameters.app_id, 
                                        resource_id:null,
                                        data:{data_app_id:parameters.data.data_app_id}}).result[0].id;
    const result_AppDataEntityResource =    ORM.db.AppDataEntityResource.get({ app_id:parameters.app_id, 
                                                                        resource_id:null,
                                                                        data:{  app_data_entity_id:entity_id,
                                                                                resource_name:parameters.data.resource_name
                                                                        }}).result;

    const  result_AppDataResourceMaster = ORM.db.AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                        join:true,
                                                                        resource_id:null,
                                                                        data:{data_app_id:parameters.data.data_app_id,
                                                                            iam_user_id:parameters.data.iam_user_id,
                                                                            resource_name:null,
                                                                            app_data_entity_id:entity_id}}).result;
    const result = ORM.getObject(parameters.app_id, 'AppDataResourceDetail',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_AppDataResourceDetail}*/row)=>
                            row.app_data_resource_master_id == (parameters.data.app_data_resource_master_id ?? row.app_data_resource_master_id) &&
                            result_AppDataEntityResource
                            .filter((/**@type{server_db_table_AppDataEntityResource}*/row_AppDataEntityResource)=>
                                row_AppDataEntityResource.id == row.app_data_entity_resource_id
                            ).length>0 &&
                            result_AppDataResourceMaster
                            .filter((/**@type{server_db_table_AppDataResourceMaster}*/row_master)=>
                                parameters.all_users || row_master.id == row.app_data_resource_master_id
                            ).length>0
                        );
    if (result.length>0 || parameters.resource_id==null ||parameters.join)
        return {result:result, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
};
/**
 * @name post
 * @description Create record
 * @function
 * @param {{app_id:number,
 *          data:server_db_table_AppDataResourceDetail}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const post = async parameters => {
  //check required attributes
  if (  parameters.data.app_data_resource_master_id==null || parameters.data.app_data_entity_resource_id==null){
      return ORM.getError(parameters.app_id, 400);
  }
  else{
      /**@type{server_db_table_AppDataResourceDetail} */
      const data_new =     {
                               id:Date.now(),
                               app_data_resource_master_id:parameters.data.app_data_resource_master_id,
                               app_data_entity_resource_id:parameters.data.app_data_entity_resource_id,
                               app_data_resource_master_attribute_id:parameters.data.app_data_resource_master_attribute_id,
                               json_data:parameters.data.json_data,
                               created:new Date().toISOString(),
                               modified:null
                      };
      return ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'AppDataResourceDetail', post:{data:data_new}}).then((/**@type{server_db_common_result_insert}*/result)=>{
          if (result.affectedRows>0){
              result.insertId=data_new.id;
              return {result:result, type:'JSON'};
          }
          else
              return ORM.getError(parameters.app_id, 404);
      });
  }
};
/**
 * @name update
 * @description Update record
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_table_AppDataResourceDetail}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters =>{
    //check required attributes
    if (parameters.resource_id==null){
        return ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server_db_table_AppDataResourceDetail} */
        const data_update = {};
        //allowed parameters to update:
        if (parameters.data.json_data!=null)
            data_update.json_data = parameters.data.json_data;
        if (parameters.data.app_data_resource_master_attribute_id!=null)
            data_update.app_data_resource_master_attribute_id = parameters.data.app_data_resource_master_attribute_id;
        data_update.modified = new Date().toISOString();
        if (Object.entries(data_update).length>0)
            return ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppDataResourceDetail', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server_db_common_result_update}*/result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return ORM.getError(parameters.app_id, 404);
            });
        else
            return ORM.getError(parameters.app_id, 400);
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
    return ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'AppDataResourceDetail', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server_db_common_result_delete}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(parameters.app_id, 404);
    });
};        
export {get, post, update, deleteRecord};