/** @module server/db/AppModuleQueue */

/**
 * @import {server} from '../types.js'
 */

const {server} = await import ('../server.js');
const fs = await import('node:fs');
/**
 * @name get
 * @description Get records for given appid
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['AppModuleQueue'][] }}
 */
const get = parameters =>server.ORM.getObject(parameters.app_id, 'AppModuleQueue',parameters.resource_id, parameters.app_id);

/**
 * @name getResult
 * @description Get record, returns HTML
 *              (bff controls if file exists)
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{resource:string}}>}
 */
const getResult = async parameters => {
    return {result:{resource:(await fs.promises.readFile(server.ORM.serverProcess.cwd() + `/data/${server.ORM.db.ConfigServer.get({app_id:parameters.app_id, 
                                                                    data:{config_group:'SERVER',parameter:'PATH_JOBS'}}).result}/${parameters.resource_id}.html`)).toString()}, 
            type:'JSON'};
};
/**
 * @name post
 * @description Create record
 * @function
 * @param {number} app_id 
 * @param {{type:'REPORT',
 *          app_module_id:number,
 *          iam_user_id:number,
 *          name:string,
 *          parameters:string,
 *          status:server['ORM']['Object']['AppModuleQueue']['Status']
 *          user:string}} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null && data.type!=null && data.name!=null && data.parameters!=null && data.user!=null){
        /**@type{server['ORM']['Object']['AppModuleQueue']} */
        const job =     {
                            Id:Date.now(),
                            IamUserId:data.iam_user_id,       //FK iam_user
                            AppModuleId:data.app_module_id,   //FK app_module
                            AppId:app_id,                      //copied from app
                            Type: data.type,                    //copied from app_module
                            Name:data.name,                     //copied from app_module
                            Parameters:data.parameters,
                            User: data.user,                    //copied from iam_user
                            Start:null,
                            End:null,
                            Progress:null,
                            Status:data.status,
                            Message:null
                        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'AppModuleQueue', post:{data:job}}).then((/**@type{server['ORM']['MetaData']['common_result_insert']}*/result)=>{
            if (result.AffectedRows>0)
                return  {result:{insertId:job.Id, affectedRows:result.AffectedRows}, type:'JSON'};
            else
                return server.ORM.getError(app_id, 404);
        });
    }
    else
        return server.ORM.getError(app_id, 400);
};
/**
 * @name postResult
 * @description Create record
 * @function
 * @param {number} app_id
 * @param {number} id
 * @param {string} result
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_insert'] }>}
 */
const postResult = async (app_id, id, result) =>{
    await fs.promises.writeFile(server.ORM.serverProcess.cwd() + `/data/${server.ORM.db.ConfigServer.get({app_id:app_id, data:{config_group:'SERVER',parameter:'PATH_JOBS'}}).result}/${id}.html`, result,  'utf8');
    return {result:{AffectedRows:1}, type:'JSON'};
};
/**
 * @name update
 * @description Update record
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{start?:string|null,
 *          end?:string|null,
 *          progress?:number|null,
 *          status?:server['ORM']['Object']['AppModuleQueue']['Status'],
 *          message?:string|null}} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORM']['MetaData']['common_result_update'] }>}
 */
const update = async (app_id, resource_id, data) => {
    /**@type{server['ORM']['Object']['AppModuleQueue']} */
    const data_update = {};
    //allowed parameters to update (not alloewd to update user info or module info):
    if (data.start!=null)
        data_update.Start = data.start;
    if (data.end!=null)
        data_update.End = data.end;
    if (data.progress!=null)
        data_update.Progress = data.progress;
    if (data.status!=null)
        data_update.Status = data.status;
    if (data.message!=null)
        data_update.Message = data.message;
    if (Object.entries(data_update).length>0)
        return server.ORM.Execute({app_id:app_id, dml:'UPDATE', object:'AppModuleQueue', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORM']['MetaData']['common_result_update']}*/result)=>{
            if (result.AffectedRows>0)
                return {result:result, type:'JSON'};
            else
                return server.ORM.getError(app_id, 404);
        });
    else
        return server.ORM.getError(app_id, 400);
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
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'AppModuleQueue', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORM']['MetaData']['common_result_delete']}*/result)=>{
        if (result.AffectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, getResult, post, postResult, update, deleteRecord};