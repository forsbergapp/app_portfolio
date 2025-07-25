/** @module server/db/IamUserApp */

/**
 * @import {server_server_response,
 *          server_db_table_IamUserApp,
 *          server_db_common_result_delete,
 *          server_db_common_result_update,
 *          server_db_common_result_insert} from '../types.js'
 */

const ORM = await import('./ORM.js');

/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_id:number|null,
 *                  data_app_id:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamUserApp[] }}
 */
const get = parameters =>{
    const result = ORM.getObject(parameters.app_id, 'IamUserApp',parameters.resource_id, parameters.data.data_app_id??null).rows
                    .filter((/**@type{server_db_table_IamUserApp}*/row)=>row.iam_user_id == (parameters.data.iam_user_id ?? row.iam_user_id) );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @param {number} app_id  
 * @param {server_db_table_IamUserApp} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (data.app_id==null || data.iam_user_id==null){
        return ORM.getError(app_id, 400);
    }
    else{
        /**@type{server_db_table_IamUserApp} */
        const data_new =     {
                                id:Date.now(),
                                app_id:data.app_id, 
                                iam_user_id:data.iam_user_id,
                                json_data:data.json_data,
                                created:new Date().toISOString(),
                                modified:null
                        };
        return ORM.Execute({app_id:app_id, dml:'POST', object:'IamUserApp', post:{data:data_new}}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return ORM.getError(app_id, 404);
        });
    }
};

/**
 * @name update
 * @description Update record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_table_IamUserApp}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async parameters =>{
    /**@type{server_db_table_IamUserApp} */
    const data_update = {};
    //allowed parameters to update:
    if (parameters.data.json_data!=null)
        data_update.json_data = parameters.data.json_data;
    
    data_update.modified = new Date().toISOString();

    if (Object.entries(data_update).length>0)
        return ORM.Execute({  app_id:parameters.app_id, 
                                    dml:'UPDATE', 
                                    object:'IamUserApp', 
                                    update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return ORM.getError(parameters.app_id, 404);
        });
    else
        return ORM.getError(parameters.app_id, 400);
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
    return ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'IamUserApp', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(parameters.app_id, 404);
    });
};

export {get, post,update, deleteRecord};