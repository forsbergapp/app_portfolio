/** @module server/db/IamUserFollow */

/**
 * @import {server_server_response,
 *          server_db_table_IamUserFollow,
 *          server_db_common_result_delete,
 *          server_db_common_result_insert} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileDBGet, fileCommonExecute} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  iam_user_id:number|null,
 *                  iam_user_id_follow:number|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_IamUserFollow[] }}
 */
const get = parameters =>{
    const result = fileDBGet(parameters.app_id, 'IamUserFollow',parameters.resource_id, null).rows
                    .filter(row=>
                        row.iam_user_id == (parameters.data.iam_user_id ?? row.iam_user_id) &&
                        row.iam_user_id_follow == (parameters.data.iam_user_id_follow ?? row.iam_user_id_follow) );
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
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:server_db_table_IamUserFollow}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async parameters =>{
    //check required attributes
    if (parameters.data.iam_user_id==null || parameters.data.iam_user_id_follow==null){
        return dbCommonRecordError(parameters.app_id, 400);
    }
    else{
        /**@type{server_db_table_IamUserFollow} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_id:parameters.data.iam_user_id, 
                                iam_user_id_follow:parameters.data.iam_user_id_follow,
                                created:new Date().toISOString()
                        };
        return fileCommonExecute({app_id:parameters.app_id, dml:'POST', object:'IamUserFollow', post:{data:data_new}}).then((result)=>{
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
 * @name deleteRecord
 * @description Delete record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async parameters =>{
    return fileCommonExecute({  app_id:parameters.app_id, 
                                dml:'DELETE', 
                                object:'IamUserFollow', 
                                delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(parameters.app_id, 404);
    });
};

export {get, post, deleteRecord};