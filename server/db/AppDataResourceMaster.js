/** @module server/db/AppDataResourceMaster */

/**
 * @import {server_server_response,
 *          server_db_table_AppDataResourceMaster, server_db_table_AppDataEntityResource,
 *          server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */

const ORM = await import('./ORM.js');
const AppDataEntity = await import('./AppDataEntity.js');
const AppDataEntityResource = await import('./AppDataEntityResource.js');
const IamUserApp = await import('./IamUserApp.js');
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
 *                  resource_name :string|null,
 *                  app_data_entity_id:number}}} parameters
 * @returns {server_server_response & {result?:server_db_table_AppDataResourceMaster[] }}
 */
const get = parameters =>{ 
    const iam_user_app = parameters.data.iam_user_id==null?null:IamUserApp.get({app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  data_app_id:parameters.data.data_app_id??null,
                                                                                        iam_user_id:parameters.data.iam_user_id}}).result[0];

    const result_AppDataEntityResource = AppDataEntityResource.get({ app_id:parameters.app_id, 
                                                                    resource_id:null,
                                                                    data:{  app_data_entity_id:parameters.data?.app_data_entity_id?? 
                                                                                                AppDataEntity.get({ app_id:parameters.app_id, 
                                                                                                                    resource_id:null,
                                                                                                                    data:{data_app_id:parameters.app_id}}).result[0].id,
                                                                            resource_name:parameters.data.resource_name
                                                                    }}).result;

    const result = ORM.getObject(parameters.app_id, 'AppDataResourceMaster',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_AppDataResourceMaster}*/row)=>
                            (parameters.all_users ||
                                ((parameters.data.iam_user_id==null && row.iam_user_app_id==null)|| 
                                 (parameters.data.iam_user_id!=null && row.iam_user_app_id == iam_user_app?.id && row.iam_user_app_id !=null))) &&
                            result_AppDataEntityResource
                            .filter((/**@type{server_db_table_AppDataEntityResource}*/row_AppDataEntityResource)=>
                                row_AppDataEntityResource.id == row.app_data_entity_resource_id
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
 *          data:server_db_table_AppDataResourceMaster}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const post = async parameters => {
    //check required attributes
    if (parameters.data.app_data_entity_resource_id==null){
        return ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server_db_table_AppDataResourceMaster} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_app_id:parameters.data.iam_user_app_id,
                                app_data_entity_resource_id:parameters.data.app_data_entity_resource_id,
                                json_data:parameters.data.json_data,
                                created:new Date().toISOString(),
                                modified:null
                        };
        return ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'AppDataResourceMaster', post:{data:data_new}}).then((result)=>{
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
 *          data:{  json_data:*,
 *                  data_app_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters =>{
   //check required attributes
   if (parameters.resource_id==null){
       return ORM.getError(parameters.app_id, 400);
   }
   else{
       /**@type{server_db_table_AppDataResourceMaster} */
       const data_update = {};
       //allowed parameters to update:
       if (parameters.data.json_data!=null)
           data_update.json_data = parameters.data.json_data;
       data_update.modified = new Date().toISOString();
       if (Object.entries(data_update).length>0)
           return ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppDataResourceMaster', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
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
    return ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'AppDataResourceMaster', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(parameters.app_id, 404);
    });
};        
export {get, post, update, deleteRecord};