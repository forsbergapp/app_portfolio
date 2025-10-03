/** @module server/db/IamControlUserAgent */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');
/**
 * @name get
 * @description Get 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamControlUserAgent'][] }}
 */
const get = (app_id, resource_id) =>server.ORM.getObject(app_id, 'IamControlUserAgent',resource_id, null);

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamControlUserAgent']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (data.Name!=null && data.UserAgent!=null){
        const id = Date.now();
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'IamControlUserAgent', post:{data:{id:id, name:data.Name, user_agent:data.UserAgent}}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId=id;
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
 * @param {server['ORM']['Object']['IamControlUserAgent']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async (app_id, resource_id, data) => {
    if (data.Name!=null && data.UserAgent!=null){
        const data_update = {};
        data_update.Name = data.Name;
        data_update.UserAgent = data.UserAgent;
        if (Object.entries(data_update).length==2)
            return server.ORM.Execute({app_id:app_id, dml:'UPDATE', object:'IamControlUserAgent', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                if (result.AffectedRows>0)
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamControlUserAgent', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id,404);
    });
};
                   
export {get, post, update, deleteRecord};