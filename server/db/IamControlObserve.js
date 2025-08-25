/** @module server/db/IamControlObserve */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_table_IamControlObserve} from '../types.js'
 */
const {ORM} = await import ('../server.js');
/**
 * @name get
 * @description Get 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_table_IamControlObserve[] }}
 */
const get = (app_id, resource_id) =>{
    const result = ORM.getObject(app_id, 'IamControlObserve',resource_id, null);
    if (result.rows.length>0 || resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return ORM.getError(app_id, 404);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_table_IamControlObserve} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if ((data.status==0 ||data.status==1) && data.type){
        const id = Date.now();
        return ORM.Execute({  app_id:app_id, dml:'POST', object:'IamControlObserve', 
                                    post:{data:{id:id, 
                                                iam_user_id:data.iam_user_id,
                                                app_id:data.app_id,
                                                ip:data.ip, 
                                                user_agent:data.user_agent,
                                                host:data.host,
                                                accept_language:data.accept_language,
                                                method:data.method,
                                                url:data.url,
                                                status:data.status,
                                                type:data.type,
                                                created:new Date().toISOString()}}}).then((result)=>{
            if (result.affectedRows>0){
                result.insertId = id;
                return {result:result,type:'JSON'};
            }
            else
                return ORM.getError(app_id, 404);
        });
    }
    else
        return ORM.getError(app_id, 400);
};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_table_IamControlObserve} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async (app_id, resource_id, data) => {
    if ((data.status==0 ||data.status==1)){
        const data_update = {};
        if (data.app_id!=null)
            data_update.app_id = data.app_id;
        if (data.ip!=null)
            data_update.ip = data.ip;
        if (data.user_agent!=null)
            data_update.user_agent = data.user_agent;
        if (data.host!=null)
            data_update.host = data.host;
        if (data.accept_language!=null)
            data_update.accept_language = data.accept_language;
        if (data.method!=null)
            data_update.method = data.method;
        if (data.url!=null)
            data_update.url = data.url;
        data_update.status = data.status;
        data_update.modified = new Date().toISOString();
        //id and type not allowed to update
        if (Object.entries(data_update).length>0)
            return ORM.Execute({app_id:app_id, dml:'UPDATE',object:'IamControlObserve', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result,type:'JSON'};
                else
                    return ORM.getError(app_id, 404);
            });
        else
            return ORM.getError(app_id, 400);
    }
    else
        return ORM.getError(app_id, 400);
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
    return ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamControlObserve', delete:{resource_id:resource_id, data_app_id:null}}).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return ORM.getError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};