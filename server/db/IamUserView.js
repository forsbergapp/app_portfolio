/** @module server/db/IamUserView */

/**
 * @import {server_server_response,
 *          server_db_table_iam_user_view,
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
 *                  iam_user_id_view:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_iam_user_view[] }}
 */
const get = parameters =>{
    const result = fileDBGet(parameters.app_id, 'IAM_USER_VIEW',parameters.resource_id, null).rows
                    .filter(row=>
                        row.iam_user_id == (parameters.data.iam_user_id ?? row.iam_user_id) &&
                        row.iam_user_id_view == (parameters.data.iam_user_id_view ?? row.iam_user_id_view) );
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @function
 * @param {number} app_id,
 * @param {{iam_user_id?:number|null,
 *          iam_user_id_view?:number|null,
 *          client_ip: string,
 *          client_user_agent: string}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (data.iam_user_id==null || data.iam_user_id_view==null){
        return dbCommonRecordError(app_id, 400);
    }
    else{
        /**@type{server_db_table_iam_user_view} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_id:data.iam_user_id, 
                                iam_user_id_view:data.iam_user_id_view,
                                client_ip:data.client_ip,
                                client_user_agent:data.client_user_agent,
                                created:new Date().toISOString()
                        };
        return fileDBPost(app_id, 'IAM_USER_VIEW', data_new).then((result)=>{
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
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_id:number|null,
 *                  iam_user_id_view:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{
    const record = get({  app_id:parameters.app_id, 
                            resource_id:parameters.resource_id, 
                            data:{  iam_user_id:parameters.data.iam_user_id,
                                    iam_user_id_view:parameters.data.iam_user_id_view
                            }}).result[0];
    if (record){
        //delete using resource id or id for searched user
        return fileDBDelete(parameters.app_id, 'IAM_USER_VIEW', parameters.resource_id ?? record.id, null).then((result)=>{
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