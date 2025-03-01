/** @module server/db/AppDataResourceDetailData */

/**
 * @import {server_server_response,
 *          server_db_table_AppDataResourceMaster, server_db_table_AppDataResourceDetail, server_db_table_AppDataResourceDetailData, 
 *          server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */

/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);
/**@type{import('./AppDataEntity.js')} */
const AppDataEntity = await import(`file://${process.cwd()}/server/db/AppDataEntity.js`);
/**@type{import('./AppDataResourceMaster.js')} */
const AppDataResourceMaster = await import(`file://${process.cwd()}/server/db/AppDataResourceMaster.js`);
/**@type{import('./AppDataResourceDetail.js')} */
const AppDataResourceDetail = await import(`file://${process.cwd()}/server/db/AppDataResourceDetail.js`);
/**@type{import('./IamUserApp.js')} */
const IamUserApp = await import(`file://${process.cwd()}/server/db/IamUserApp.js`);


/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          join?:boolean,
 *          data:{  data_app_id?:number|null,
 *                  iam_user_id:number|null,
 *                  resource_name:string|null,
 *                  resource_name_master_attribute:string|null,
 *                  resource_name_data_master_attribute:string|null,
 *                  app_data_resource_detail_id:number|null,
 *                  app_data_entity_id:number}}} parameters
 * @returns {server_server_response & {result?:server_db_table_AppDataResourceDetailData & {adrm_attribute_master_json_data:{}}[]|*}}
 */
const get = parameters =>{ 
    const iam_user_app = parameters.data.iam_user_id==null?null:IamUserApp.get({app_id:parameters.app_id, 
                                                                                resource_id:null, 
                                                                                data:{  data_app_id:parameters.data.data_app_id??null,
                                                                                        iam_user_id:parameters.data.iam_user_id}}).result[0];
    const result = ORM.getObject(parameters.app_id, 'AppDataResourceDetailData',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_AppDataResourceDetailData}*/row)=>
                        row.app_data_resource_detail_id == (parameters.data.app_data_resource_detail_id??row.app_data_resource_detail_id) && 
                        //detail data master attribute
                        AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                    join:true,
                                                    resource_id:row.app_data_resource_master_attribute_id,
                                                    data:{  data_app_id:null,
                                                            iam_user_id:null,
                                                            resource_name:parameters.data.resource_name_data_master_attribute,
                                                            app_data_entity_id:parameters.data.app_data_entity_id}}).result
                        .filter((/**@type{server_db_table_AppDataResourceMaster}*/row_master)=>
                            (parameters.data.iam_user_id==null || (parameters.data.iam_user_id!=null && row_master.iam_user_app_id == iam_user_app?.id && row_master.iam_user_app_id !=null)) 
                        ).length>0 &&

                        AppDataResourceDetail.get({ app_id:parameters.app_id, 
                                                    join:true,
                                                    resource_id:row.app_data_resource_detail_id,
                                                    data:{  data_app_id:null,
                                                            iam_user_id:null,
                                                            resource_name:parameters.data.resource_name,
                                                            app_data_resource_master_id:null,
                                                            app_data_entity_id:parameters.data.app_data_entity_id}}).result
                        .filter((/**@type{server_db_table_AppDataResourceDetail}*/row_detail)=>
                            //detail master attribute
                            AppDataResourceMaster.get({ app_id:parameters.app_id, 
                                                        join:true,
                                                        resource_id:row_detail.app_data_resource_master_id,
                                                        data:{  data_app_id:null,
                                                                iam_user_id:null,
                                                                resource_name:parameters.data.resource_name_master_attribute,
                                                                app_data_entity_id:parameters.data.app_data_entity_id}}).result
                            .filter((/**@type{server_db_table_AppDataResourceMaster}*/row_master)=>
                                (parameters.data.iam_user_id==null || (parameters.data.iam_user_id!=null && row_master.iam_user_app_id == iam_user_app?.id && row_master.iam_user_app_id !=null)) &&
                                AppDataEntity.get({ app_id:parameters.app_id, 
                                                    resource_id:row_master.app_data_entity_resource_app_data_entity_id,
                                                    data:{data_app_id:parameters.data.data_app_id}}).result.length>0
                            )
                        ).length>0
                    )
                    .map((/**@type{server_db_table_AppDataResourceDetailData & {adrm_attribute_master_json_data:{}}}*/row)=>{     
                            row.adrm_attribute_master_json_data = AppDataResourceMaster.get({   app_id:parameters.app_id, 
                                                                                                join:true,
                                                                                                resource_id:row.app_data_resource_master_attribute_id,
                                                                                                data:{  data_app_id:null,
                                                                                                        iam_user_id:null,
                                                                                                        resource_name:null,
                                                                                                        app_data_entity_id:parameters.data.app_data_entity_id}}).result[0].json_data;
                        return row;
                    });
    if (result.length>0 || parameters.resource_id==null||parameters.join)
        return {result:result, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @param {{app_id:number,
 *          data:server_db_table_AppDataResourceDetailData}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const post = async parameters => {
 //check required attributes
 if (  parameters.data.app_data_resource_detail_id==null){
     return ORM.getError(parameters.app_id, 400);
 }
 else{
     /**@type{server_db_table_AppDataResourceDetailData} */
     const data_new =     {
                              id:Date.now(),
                              app_data_resource_detail_id:parameters.data.app_data_resource_detail_id,
                              app_data_resource_master_attribute_id:parameters.data.app_data_resource_master_attribute_id,
                              json_data:parameters.data.json_data,
                              created:new Date().toISOString(),
                              modified:null
                     };
     return ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'AppDataResourceDetailData', post:{data:data_new}}).then((result)=>{
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
 *          data:server_db_table_AppDataResourceDetailData}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters =>{
  //check required attributes
  if (parameters.resource_id==null){
      return ORM.getError(parameters.app_id, 400);
  }
  else{
      /**@type{server_db_table_AppDataResourceDetailData} */
      const data_update = {};
      //allowed parameters to update:
      if (parameters.data.json_data!=null)
          data_update.json_data = parameters.data.json_data;
      data_update.modified = new Date().toISOString();
      if (Object.entries(data_update).length>0)
          return ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppDataResourceDetailData', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
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
    return ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'AppDataResourceDetailData', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(parameters.app_id, 404);
    });
};        
export {get, post, update, deleteRecord};