/** @module server/db/AppDataResourceDetailData */

/**
 * @import {server_server_response,server_db_table_app_data_resource_detail_data, server_db_common_result_insert, server_db_common_result_update, server_db_common_result_delete} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBDelete, fileDBUpdate, fileDBPost} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number|null,
 *          resource_id:number|null,
 *          data:{data_app_id?:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_app_data_resource_detail_data[] }}
 */
const get = parameters =>{ 
    const result = fileDBGet(parameters.app_id, 'APP_DATA_RESOURCE_DETAIL_DATA',parameters.resource_id, parameters.data.data_app_id??null);
    if (result.rows.length>0 || parameters.resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};
/**
 * @name post
 * @description Create record
 * @function
 * @param {{app_id:number,
 *          data:{  json_data:*,
 *                  data_app_id:number,
 *                  app_data_resource_detail_id: number,
 *                  app_data_resource_master_attribute_id:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert}>}
 */
const post = async parameters => {
 //check required attributes
 if (  parameters.data.data_app_id==null ||
       parameters.data.app_data_resource_detail_id==null){
     return dbCommonRecordError(parameters.app_id, 400);
 }
 else{
     /**@type{server_db_table_app_data_resource_detail_data} */
     const data_new =     {
                              id:Date.now(),
                              app_data_resource_detail_id:parameters.data.app_data_resource_detail_id,
                              app_data_resource_master_attribute_id:parameters.data.app_data_resource_master_attribute_id,
                              json_data:parameters.data.json_data?JSON.stringify(parameters.data.json_data):null,
                              created:new Date().toISOString(),
                              modified:null
                     };
     return fileDBPost(parameters.app_id, 'APP_DATA_RESOURCE_DETAIL_DATA', data_new).then((result)=>{
         if (result.affectedRows>0){
             result.insertId=data_new.id;
             return {result:result, type:'JSON'};
         }
         else
             return dbCommonRecordError(parameters.app_id, 404);
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
  if (parameters.resource_id==null || parameters.data.data_app_id==null){
      return dbCommonRecordError(parameters.app_id, 400);
  }
  else{
      /**@type{server_db_table_app_data_resource_detail_data} */
      const data_update = {};
      //allowed parameters to update:
      if (parameters.data.json_data!=null)
          data_update.json_data = JSON.stringify(parameters.data.json_data);
      data_update.modified = new Date().toISOString();
      if (Object.entries(data_update).length>0)
          return fileDBUpdate(parameters.app_id, 'APP_DATA_RESOURCE_DETAIL_DATA', parameters.resource_id, null, data_update).then((result)=>{
              if (result.affectedRows>0)
                  return {result:result, type:'JSON'};
              else
                  return dbCommonRecordError(parameters.app_id, 404);
          });
      else
          return dbCommonRecordError(parameters.app_id, 400);
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
    return fileDBDelete(parameters.app_id, 'APP_DATA_RESOURCE_DETAIL_DATA', parameters.resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(parameters.app_id, 404);
    });
};        
export {get, post, update, deleteRecord};