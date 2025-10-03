/** @module server/db/AppDataEntity */

/**
 * @import {server} from '../types.js'
 */
const {server} = await import ('../server.js');

/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{data_app_id?:number|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['AppDataEntity'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'AppDataEntity',parameters.resource_id, parameters.data.data_app_id??null);
    
/**
 * @name post
 * @description Create record
 * @function
 * @param {{app_id:number,
 *          data:server['ORM']['Object']['AppDataEntity']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert']}>}
 */
const post = async parameters => {
    //check required attributes
    if (parameters.data.AppId==null){
        return server.ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['AppDataEntity']} */
        const data_new =     {
                                Id:Date.now(),
                                AppId:parameters.data.AppId, 
                                Document:parameters.data.Document,
                                Created:new Date().toISOString(),
                                Modified:null
                        };
        return server.ORM.Execute({app_id:parameters.app_id, dml:'POST', object:'AppDataEntity', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId=data_new.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(parameters.app_id, 404);
        });
    }
};
/**
 * @name update
 * @description Update record
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server['ORM']['Object']['AppDataEntity']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async parameters =>{
    //check required attributes
    if (parameters.resource_id==null){
        return server.ORM.getError(parameters.app_id, 400);
    }
    else{
        /**@type{server['ORM']['Object']['AppDataEntity']} */
        const data_update = {};
        //allowed parameters to update:
        if (parameters.data.Document!=null)
            data_update.Document = parameters.data.Document;
        data_update.Modified = new Date().toISOString();
        if (Object.entries(data_update).length>0)
            return server.ORM.Execute({app_id:parameters.app_id, dml:'UPDATE',object:'AppDataEntity', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
                if (result.AffectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return server.ORM.getError(parameters.app_id, 404);
            });
        else
            return server.ORM.getError(parameters.app_id, 400);
    }
};
/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async parameters =>{
    return server.ORM.Execute({app_id:parameters.app_id, dml:'DELETE', object:'AppDataEntity', delete:{resource_id:parameters.resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(parameters.app_id, 404);
    });
};
export {get, post, update, deleteRecord};