/** @module server/db/IamAppAccess */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_table_IamAppAccess} from '../types.js'
 */

/**@type{import('./ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

/**
 * @name get
 * @description Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_table_IamAppAccess[] }}
 */
const get = (app_id, resource_id) =>{
    const result = ORM.getObject(app_id, 'IamAppAccess',resource_id, null);
    if (result.rows.length>0)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(app_id, 404);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_table_IamAppAccess} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>{
    //check required attributes
    if (app_id!=null &&
        data.app_id != null &&
        data.res != null &&
        data.ip != null){
        //security check that token is not used already
        if (ORM.getObject(app_id, 'IamAppAccess', null, null).rows.filter((/**@type{server_db_table_IamAppAccess} */row)=>row.token==data.token && data.token !=null).length==0){
            /**@type{server_db_table_IamAppAccess} */
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
            return ORM.Execute({app_id:app_id, dml:'POST', object:'IamAppAccess',post:{data:data_new}}).then((result)=>{
                if (result.affectedRows>0){
                    result.insertId=data_new.id;
                    return {result:result,type:'JSON'};
                }
                else
                    return ORM.getError(app_id, 404);
            });
        }
        else{
            //token already used, user can not login
            return ORM.getError(app_id, 401);
        }
    }
    else
        return ORM.getError(app_id, 400);
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
        /**@type{server_db_table_IamAppAccess} */
        const data_update = {};
        //check allowed attributes to update
        if (data.res!=null)
            data_update.res = data.res;
        data_update.modified = data.modified;
        if (Object.entries(data_update).length>1){
            const result = await ORM.Execute({app_id:app_id, dml:'UPDATE', object:'IamAppAccess', update:{resource_id:resource_id, data_app_id:null, data:data}});
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return ORM.getError(app_id, 404);
        }
        else
            return ORM.getError(app_id, 400);
    }
    else
        return ORM.getError(app_id, 400);
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
    return ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamAppAccess', delete:{resource_id:resource_id, data_app_id:null}}).then(result=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(app_id, 404);
    });
};
export {get, post, update, deleteRecord};