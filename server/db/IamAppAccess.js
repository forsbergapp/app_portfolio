/** @module server/db/IamAppAccess */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_table_iam_app_access} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBPost, fileDBGet, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_table_iam_app_access[] }}
 */
const get = (app_id, resource_id) =>{
    const result = fileDBGet(app_id, 'IAM_APP_ACCESS',null, resource_id);
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(app_id, 404);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_table_iam_app_access} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (app_id!=null &&
        data.app_id != null &&
        data.res != null &&
        data.ip != null){
        //security check that token is not used already
        if (fileDBGet(app_id, 'IAM_APP_ACCESS', null, null).rows.filter((/**@type{server_db_table_iam_app_access} */row)=>row.token==data.token && data.token !=null).length==0){
            /**@type{server_db_table_iam_app_access} */
            const data_new = {};
            data_new.id =  Date.now();
            //required
            data_new.app_id =               data.app_id;
            data_new.res =                  data.res;
            data_new.ip =                   data.ip;
            data_new.type =                 data.type;
            data_new.iam_user_id =          data.iam_user_id;
            //optional
            data_new.iam_user_username =    data.iam_user_username; //for security reason can be omitted in a user verification process
            data_new.user_account_id =      data.user_account_id;
            data_new.app_custom_id =        data.app_custom_id; //used by app_access_external
            data_new.token =                data.token;
            data_new.db =                   data.db;
            data_new.ua =                   data.ua;
            //required server value
            data_new.created =              new Date().toISOString();
            return fileDBPost(app_id, 'IAM_APP_ACCESS',data_new).then((result)=>{
                if (result.affectedRows>0){
                    result.insertId=data_new.id;
                    return {result:result,type:'JSON'};
                }
                else
                    return dbCommonRecordError(app_id, 404);
            });
        }
        else{
            //token already used, user can not login
            return dbCommonRecordError(app_id, 401);
        }
    }
    else
        return dbCommonRecordError(app_id, 400);
}; 

/**
 * @name update
 * @description Update record
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async (app_id, resource_id, data) =>{
    //check required attributes
    if (app_id!=null && resource_id != null){
        /**@type{server_db_table_iam_app_access} */
        const data_update = {};
        //check allowed attributes to update
        if (data.res!=null)
            data_update.res = data.res;
        data_update.modified = data.modified;
        if (Object.entries(data_update).length>1){
            const result = await fileDBUpdate(app_id, 'IAM_APP_ACCESS',resource_id, null, data);
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(app_id, 404);
        }
        else
            return dbCommonRecordError(app_id, 400);
    }
    else
        return dbCommonRecordError(app_id, 400);
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
    /**@type{server_db_table_iam_app_access}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        return fileDBDelete(app_id, 'IAM_APP_ACCESS', resource_id, null).then(result=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(app_id, 404);
        });
    }
    else
        return user;
};
export {get, post, update, deleteRecord};