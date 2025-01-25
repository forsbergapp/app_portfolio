/** @module server/db/fileModelIamControlIp */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_file_iam_control_ip} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_file_iam_control_ip[] }}
 */
const get = (app_id, resource_id) =>{
    const result = fileDBGet(app_id, 'IAM_CONTROL_IP',resource_id, null);
    if (result.rows.length>0 || resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(app_id, 404);
};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_file_iam_control_ip} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (data.from && data.to){
        const id = Date.now();
        return fileDBPost(app_id, 'IAM_CONTROL_IP', {   id:id, 
                                                        app_id:data.app_id,
                                                        from:data.from, 
                                                        to:data.to,
                                                        hour_from:data.hour_from,
                                                        hour_to:data.hour_to,
                                                        date_from:data.date_from,
                                                        date_to:data.date_to,
                                                        action:data.action}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId = id;
                return {result:result, type:'JSON'};
            }
            else
                return dbCommonRecordError(app_id, 404);
        });
    }
    else
        return dbCommonRecordError(app_id, 400);

};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_file_iam_control_ip} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async (app_id, resource_id, data) => {
    /**@type{server_db_file_iam_control_ip}*/
    const ip_record = get(app_id, resource_id).result[0];
    if (ip_record){
        if (data.from && data.to){
            const data_update = {};
            if (data.from!=null)
                data_update.from = data.from;
            if (data.to!=null)
                data_update.to = data.to;
            if (data.hour_from!=null)
                data_update.hour_from = data.hour_from;
            if (data.hour_to!=null)
                data_update.hour_to = data.hour_to;
            if (data.date_from!=null)
                data_update.date_from = data.date_from;
            if (data.date_to!=null)
                data_update.date_to = data.date_to;
            if (data.action!=null)
                data_update.action = data.action;

            if (Object.entries(data_update).length==2)
                return fileDBUpdate(app_id, 'IAM_CONTROL_IP', resource_id, null, data_update).then((result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return dbCommonRecordError(app_id, 404);
                });
            else
                return dbCommonRecordError(app_id, 400);
        }
        else
            return dbCommonRecordError(app_id, 400);
    }
    else
        return dbCommonRecordError(app_id, 404);
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return fileDBDelete(app_id, 'IAM_CONTROL_IP', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};