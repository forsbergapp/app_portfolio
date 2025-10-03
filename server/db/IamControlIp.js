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
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamControlIp'][] }}
 */
const get = (app_id, resource_id) =>server.ORM.getObject(app_id, 'IamControlIp',resource_id, null);

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamControlIp']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (data.From!=null && data.To!=null){
        /**@type{server['ORM']['Object']['IamControlIp']} */
        const data_new = {};
        data_new.Id = Date.now();
        data_new.AppId = data.AppId;
        data_new.From = data.From;
        data_new.To = data.To;
        data_new.HourFrom = data.HourFrom;
        data_new.HourTo = data.HourTo;
        data_new.DateFrom = data.DateFrom;
        data_new.DateTo = data.DateTo;
        data_new.Action = data.Action;
        return server.ORM.Execute({  app_id:app_id, dml:'POST', object:'IamControlIp', 
                                    post:{data:{data_new}}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId = data_new.Id;
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
 * @param {server['ORM']['Object']['IamControlIp']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async (app_id, resource_id, data) => {
    if (data.From!=null && data.To!=null){
        /**@type{server['ORM']['Object']['IamControlIp']} */
        const data_update = {};
        if (data.From!=null)
            data_update.From = data.From;
        if (data.To!=null)
            data_update.To = data.To;
        if (data.HourFrom!=null)
            data_update.HourFrom = data.HourFrom;
        if (data.HourTo!=null)
            data_update.HourTo = data.HourTo;
        if (data.DateFrom!=null)
            data_update.DateFrom = data.DateFrom;
        if (data.DateTo!=null)
            data_update.DateTo = data.DateTo;
        if (data.Action!=null)
            data_update.Action = data.Action;

        if (Object.entries(data_update).length==2)
            return server.ORM.Execute({app_id:app_id, dml:'UPDATE', object:'IamControlIp', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                if (result.AffectedRows>0)
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamControlIp', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};