/** @module server/db/fileModelIamControlUserAgent */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_file_iam_control_user_agent} from '../types.js'
 * @typedef {server_server_response & {result?:server_db_file_iam_control_user_agent[] }} get
 * @typedef {server_server_response & {result?:server_db_common_result_insert }} post
 * @typedef {server_server_response & {result?:server_db_common_result_update }} update
 * @typedef {server_server_response & {result?:server_db_common_result_delete }} deleteRecord
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);
/**
 * @name get
 * @description Get user 
 * @function
 * @param {number|null} app_id
 * @param {number|null} resource_id
 * @returns {get}
 */
const get = (app_id, resource_id) =>{
    const result = fileDBGet(app_id, 'IAM_CONTROL_USER_AGENT',resource_id, null);
    if (result.rows.length>0 || resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(app_id,404);
};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_file_iam_control_user_agent} data
 * @returns {Promise.<post>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (data.name!=null && data.user_agent!=null){
        const id = Date.now();
        return fileDBPost(app_id, 'IAM_CONTROL_USER_AGENT', {id:id, name:data.name, user_agent:data.user_agent}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=id;
                return {result:result, type:'JSON'};
            }
            else
                return dbCommonRecordError(app_id,404);
        });
    }
    else
        return dbCommonRecordError(app_id,400);

};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_file_iam_control_user_agent} data
 * @returns {Promise.<update>}
 */
const update = async (app_id, resource_id, data) => {
    /**@type{server_db_file_iam_control_user_agent}*/
    const record = get(app_id, resource_id).result[0];
    if (record){
        if (data.name!=null && data.user_agent!=null){
            const data_update = {};
            data_update.name = data.name;
            data_update.user_agent = data.user_agent;
            if (Object.entries(data_update).length==2)
                return fileDBUpdate(app_id, 'IAM_CONTROL_USER_AGENT', resource_id, null, data_update).then((result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return dbCommonRecordError(app_id,404);
                });
            else
                return dbCommonRecordError(app_id,400);
        }
        else
            return dbCommonRecordError(app_id,400);
    }
    else
        return dbCommonRecordError(app_id,404);
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<deleteRecord>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return fileDBDelete(app_id, 'IAM_CONTROL_USER_AGENT', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(app_id,404);
    });
};
                   
export {get, post, update, deleteRecord};