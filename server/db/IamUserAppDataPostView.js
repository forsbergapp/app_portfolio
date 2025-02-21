/** @module server/db/IamUserAppDataPostView */

/**
 * @import {server_server_response,
 *          server_db_table_iam_user_app_data_post_view,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);
/**@type{import('./IamUserApp.js')} */
const IamUserApp = await import(`file://${process.cwd()}/server/db/IamUserApp.js`);
/**
 * @name get
 * @description Get user account app
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_id:number|null,
 *                  data_app_id:number}}} parameters
 * @returns {server_server_response & {result?:server_db_table_iam_user_app_data_post_view[] }}
 */
const get = parameters =>{
    const result = fileDBGet(parameters.app_id, 'IAM_USER_APP_DATA_POST_VIEW',parameters.resource_id, parameters.data.data_app_id??null).rows
                    .filter((/**@type{server_db_table_iam_user_app_data_post_view}*/row)=>
                        IamUserApp.get({app_id:parameters.app_id,
                                        resource_id:row.iam_user_app_id, 
                                        data:{iam_user_id:parameters.data.iam_user_id, data_app_id:parameters.data.data_app_id}}).result.length>0
                    );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @param {number} app_id  
 * @param {{data_app_id:number,
 *          json_data:string|null,
 *          client_ip:string,
 *          client_user_agent:string,
 *          iam_user_app_data_post_id:number}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (data.data_app_id==null || data.iam_user_app_data_post_id==null){
        return dbCommonRecordError(app_id, 400);
    }
    else{
        /**@type{server_db_table_iam_user_app_data_post_view} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_app_id:data.data_app_id, 
                                iam_user_app_data_post_id:data.iam_user_app_data_post_id,
                                client_ip: data.client_ip,
                                client_user_agent: data.client_user_agent,
                                created:new Date().toISOString()
                        };
        return fileDBPost(app_id, 'IAM_USER_APP_DATA_POST_LIKE', data_new).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return dbCommonRecordError(app_id, 404);
        });
    }
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  data_app_id:number,
 *                  iam_user_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{
   
    const record = get({ app_id:parameters.app_id, 
                                            resource_id:parameters.resource_id, 
                                            data:{data_app_id:parameters.data.data_app_id, iam_user_id:parameters.data.iam_user_id}}).result[0];
    if (record){
        //delete using resource id or id for searched user and app
        return fileDBDelete(parameters.app_id, 'IAM_USER_APP_DATA_POST_VIEW', parameters.resource_id ?? record.id, null).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(parameters.app_id, 404);
        });
    }
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

export {get, post, deleteRecord};