/** @module server/db/IamControlIp */

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
 * @returns {server['server']['response'] & {result?:server['ORM']['IamControlIp'][] }}
 */
const get = (app_id, resource_id) =>server.ORM.getObject(app_id, 'IamControlIp',resource_id, null);

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['IamControlIp']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (data.from!=null && data.to!=null){
        const id = Date.now();
        return server.ORM.Execute({  app_id:app_id, dml:'POST', object:'IamControlIp', 
                                    post:{data:{id:id, 
                                                app_id:data.app_id,
                                                from:data.from, 
                                                to:data.to,
                                                hour_from:data.hour_from,
                                                hour_to:data.hour_to,
                                                date_from:data.date_from,
                                                date_to:data.date_to,
                                                action:data.action}}}).then((/**@type{server['ORMMetaData']['common_result_insert']}*/result)=>{
            if (result.affectedRows>0){
                result.insertId = id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(app_id, 404);
        });
    }
    else
        return server.ORM.getError(app_id, 400);

};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server['ORM']['IamControlIp']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_update'] }>}
 */
const update = async (app_id, resource_id, data) => {
    if (data.from!=null && data.to!=null){
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
            return server.ORM.Execute({app_id:app_id, dml:'UPDATE', object:'IamControlIp', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORMMetaData']['common_result_update']}*/result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return server.ORM.getError(app_id, 404);
            });
        else
            return server.ORM.getError(app_id, 400);
    }
    else
        return server.ORM.getError(app_id, 400);
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamControlIp', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORMMetaData']['common_result_delete']}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};