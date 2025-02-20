/** @module server/db/IamUserAppDataPostLike */

/**
 * @import {server_server_response,
 *          server_db_table_iam_user_app_data_post_like,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_id:number|null,
 *                  data_app_id:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_iam_user_app_data_post_like[] }}
 */
const get = parameters =>{
    const result = fileDBGet(parameters.app_id, 'IAM_USER_APP_DATA_POST_LIKE',parameters.resource_id, parameters.data.data_app_id??null).rows
                    .filter(row=>row.iam_user_id == (parameters.data.iam_user_id ?? row.iam_user_id) );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  data_app_id:number,
 *                  iam_user_id:number,
 *                  iam_user_app_data_post_id:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async parameters =>{
    //check required attributes
    if (parameters.data.data_app_id==null || parameters.data.iam_user_id==null){
        return dbCommonRecordError(parameters.app_id, 400);
    }
    else{
        const record = get({app_id:parameters.app_id, 
                            resource_id:parameters.data.iam_user_app_data_post_id, 
                            data:{data_app_id:parameters.data.data_app_id, iam_user_id:parameters.data.iam_user_id}}).result[0];
        if (record){
            /**@type{server_db_table_iam_user_app_data_post_like} */
            const data_new =     {
                                    id:Date.now(),
                                    iam_user_app_id:parameters.data.data_app_id, 
                                    iam_user_app_data_post_id:parameters.data.iam_user_app_data_post_id ??record.id,
                                    created:new Date().toISOString()
                            };
            return fileDBPost(parameters.app_id, 'IAM_USER_APP_DATA_POST_LIKE', data_new).then((result)=>{
                if (result.affectedRows>0){
                    result.insertId=data_new.id;
                    return {result:result, type:'JSON'};
                }
                else
                    return dbCommonRecordError(parameters.app_id, 404);
            });
        }
        else
            return dbCommonRecordError(parameters.app_id, 404);
    }
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  data_app_id:number,
 *                  iam_user_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{
    const record = get({  app_id:parameters.app_id, 
                            resource_id:parameters.resource_id, 
                            data:{data_app_id:parameters.data.data_app_id, iam_user_id:parameters.data.iam_user_id}}).result[0];
    if (record){
        //delete using resource id or id for searched user and app
        return fileDBDelete(parameters.app_id, 'IAM_USER_APP_DATA_POST_LIKE', parameters.resource_id ?? record.id, null).then((result)=>{
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