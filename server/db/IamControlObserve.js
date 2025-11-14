/** @module server/db/IamControlObserve */

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
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['IamControlObserve'][] }}
 */
const get = (app_id, resource_id) =>server.ORM.getObject(app_id, 'IamControlObserve',resource_id, null);
    
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server['ORM']['Object']['IamControlObserve']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if ((data.Status==0 ||data.Status==1) && data.Type){
        const id = Date.now();
        /**@type{server['ORM']['Object']['IamControlObserve']}*/
        const data_new = {  Id:id, 
                            IamUserId:data.IamUserId,
                            AppId:data.AppId,
                            Ip:data.Ip, 
                            UserAgent:data.UserAgent,
                            Host:data.Host,
                            AcceptLanguage:data.AcceptLanguage,
                            Method:data.Method,
                            Url:data.Url,
                            Status:data.Status, //0=dont stop, 1=stop immediately 
                            Type:data.Type,
                            Created:new Date().toISOString()};
        return server.ORM.Execute({  app_id:app_id, dml:'POST', object:'IamControlObserve', 
                                    post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId = id;
                return {result:result,type:'JSON'};
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
 * @param {server['ORM']['Object']['IamControlObserve']} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async (app_id, resource_id, data) => {
    if ((data.Status==0 ||data.Status==1)){
        /**@type{server['ORM']['Object']['IamControlObserve']}*/
        const data_update = {};
        if (data.AppId!=null)
            data_update.AppId = data.AppId;
        if (data.Ip!=null)
            data_update.Ip = data.Ip;
        if (data.UserAgent!=null)
            data_update.UserAgent = data.UserAgent;
        if (data.Host!=null)
            data_update.Host = data.Host;
        if (data.AcceptLanguage!=null)
            data_update.AcceptLanguage = data.AcceptLanguage;
        if (data.Method!=null)
            data_update.Method = data.Method;
        if (data.Url!=null)
            data_update.Url = data.Url;
        data_update.Status = data.Status;
        data_update.Modified = new Date().toISOString();
        //id and type not allowed to update
        if (Object.entries(data_update).length>0)
            return server.ORM.Execute({app_id:app_id, dml:'UPDATE',object:'IamControlObserve', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                if (result.AffectedRows>0)
                    return {result:result,type:'JSON'};
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
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'IamControlObserve', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};