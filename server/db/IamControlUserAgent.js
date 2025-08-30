/** @module server/db/IamControlUserAgent */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_table_IamControlUserAgent} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_table_IamControlUserAgent[] }}
 */
const get = (app_id, resource_id) =>server.ORM.getObject(app_id, 'IamControlUserAgent',resource_id, null);

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_table_IamControlUserAgent} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (data.name!=null && data.user_agent!=null){
        const id = Date.now();
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamControlUserAgent', post:{data:{id:id, name:data.name, user_agent:data.user_agent}}}).then((/**@type{server_db_common_result_insert}*/result)=>{
            if (result.affectedRows>0){
                result.insertId=id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(app_id,404);
        });
    }
    else
        return server.ORM.getError(app_id,400);

};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_table_IamControlUserAgent} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async (app_id, resource_id, data) => {
    if (data.name!=null && data.user_agent!=null){
        const data_update = {};
        data_update.name = data.name;
        data_update.user_agent = data.user_agent;
        if (Object.entries(data_update).length==2)
            return server.ORM.Execute({app_id:app_id, dml:'UPDATE', object:'IamControlUserAgent', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((/**@type{server_db_common_result_update}*/result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return server.ORM.getError(app_id,404);
            });
        else
            return server.ORM.getError(app_id,400);
    }
    else
        return server.ORM.getError(app_id,400);
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
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamControlUserAgent', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server_db_common_result_delete}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id,404);
    });
};
                   
export {get, post, update, deleteRecord};