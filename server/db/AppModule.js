/** @module server/db/AppModule */

/**
 * @import {server} from '../types.js'
 */

const {server} = await import ('../server.js');

/**
 * @name get
 * @description Get record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          resource_id:number|null,
 *          data:{data_app_id?:string|number|null}}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['AppModule'][] }}
 */
const get = parameters => server.ORM.getObject(parameters.app_id, 'AppModule',parameters.resource_id, server.ORM.UtilNumberValue(parameters.data.data_app_id));

/**
 * @name post
 * @description Create record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null && data.app_id!=null && data.ModuleType!=null && data.ModuleName!=null && data.ModuleRole!=null && data.ModulePath!=null){
        /**@type{server['ORM']['Object']['AppModule']} */
        const data_new ={
            Id:                 Date.now(),
            AppId:             data.app_id,
            ModuleType:         data.ModuleType,
            ModuleName:         data.ModuleName,
            ModuleRole:         data.ModuleRole,
            ModulePath:         data.ModulePath,
            ModuleDescription:  data.ModuleDescription
        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'AppModule', post:{data:data_new}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0){
                result.InsertId = data_new.Id;
                return {result:result, type:'JSON'};
            }
            else
                return server.ORM.getError(app_id, 404);
        });
    }
    else{
        return server.ORM.getError(app_id, 400);
    }
};
/**
 * @name update
 * @description Update record
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server['ORM']['Object']['AppModule']}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async parameters => {
    /**@type{server['ORM']['Object']['AppModule']} */
    const data_update = {};
    //allowed parameters to update:
    if (parameters.data.ModuleType!=null)
        data_update.ModuleType = parameters.data.ModuleType;
    if (parameters.data.ModuleName!=null)
        data_update.ModuleName = parameters.data.ModuleName;
    if (parameters.data.ModuleRole!=null)
        data_update.ModuleRole = parameters.data.ModuleRole;
    if (parameters.data.ModulePath!=null)
        data_update.ModulePath = parameters.data.ModulePath;
    if (parameters.data.ModuleDescription!=null)
        data_update.ModuleDescription = parameters.data.ModuleDescription;
    if (Object.entries(data_update).length>0)
        return server.ORM.Execute({app_id:parameters.app_id, dml:'UPDATE', object:'AppModule', update:{resource_id:parameters.resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
            if (result.AffectedRows>0)
                return {result:result, type:'JSON'};
            else
                return server.ORM.getError(parameters.app_id, 404);
        });
    else
        return server.ORM.getError(parameters.app_id, 400);
};

/**
 * @name deleteRecord
 * @description Delete record
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'AppModule', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, post, update, deleteRecord};