/** @module server/db/IamUserEvent */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_delete,
 *          server_db_table_IamUserEvent} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileDBGet, fileCommonExecute} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get record 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_table_IamUserEvent[] }}
 */
const get = (app_id, resource_id) =>{
    const result = fileDBGet(app_id, 'IamUserEvent',resource_id, null);
    if (result.rows.length>0 || resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(app_id, 404);
};

/**
 * @name post
 * @description Create record
 * @function
 * @param {number} app_id 
 * @param {server_db_table_IamUserEvent} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (data.iam_user_id==null || data.event==null || data.event_status==null||
        //check not allowed attributes when creating a user
        data.id||data.created){
            return dbCommonRecordError(app_id, 400);
    }
    else{
        /**@type{server_db_table_IamUserEvent} */
        const data_new =     {
                                id:Date.now(),
                                iam_user_id:data.iam_user_id, 
                                event:data.event,
                                event_status:data.event_status,
                                created:new Date().toISOString()
                        };
        return fileCommonExecute({app_id:app_id, dml:'POST', object:'IamUserEvent', post:{data:data_new}}).then((result)=>{
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
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return fileCommonExecute({app_id:app_id, dml:'DELETE', object:'IamUserEvent', delete:{resource_id:resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(app_id, 404);
    });
};

export {get, post, deleteRecord };