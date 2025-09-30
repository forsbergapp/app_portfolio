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
 * @returns {server['server']['response'] & {result?:server['ORM']['AppModuleQueue'][] }}
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
 *          status:server_db_app_module_queue_status
 *          user:string}} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_insert'] }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null && data.type!=null && data.name!=null && data.parameters!=null && data.user!=null){
        /**@type{server['ORM']['AppModuleQueue']} */
        const job =     {
                            id:Date.now(),
                            iam_user_id:data.iam_user_id,       //FK iam_user
                            app_module_id:data.app_module_id,   //FK app_module
                            app_id:app_id,                      //copied from app
                            type: data.type,                    //copied from app_module
                            name:data.name,                     //copied from app_module
                            parameters:data.parameters,
                            user: data.user,                    //copied from iam_user
                            start:null,
                            end:null,
                            progress:null,
                            status:data.status,
                            message:null
                        };
        return server.ORM.Execute({app_id:app_id, dml:'POST', object:'AppModuleQueue', post:{data:job}}).then((/**@type{server['ORMMetaData']['common_result_insert']}*/result)=>{
            if (result.affectedRows>0)
                return  {result:{insertId:job.id, affectedRows:result.affectedRows}, type:'JSON'};
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_insert'] }>}
 */
const postResult = async (app_id, id, result) =>{
    await fs.promises.writeFile(server.ORM.serverProcess.cwd() + `/data/${server.ORM.db.ConfigServer.get({app_id:app_id, data:{config_group:'SERVER',parameter:'PATH_JOBS'}}).result}/${id}.html`, result,  'utf8');
    return {result:{affectedRows:1}, type:'JSON'};
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
 *          status?:server_db_app_module_queue_status,
 *          message?:string|null}} data
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_update'] }>}
 */
const update = async (app_id, resource_id, data) => {
    const data_update = {};
    //allowed parameters to update (not alloewd to update user info or module info):
    if (data.start!=null)
        data_update.start = data.start;
    if (data.end!=null)
        data_update.end = data.end;
    if (data.progress!=null)
        data_update.progress = data.progress;
    if (data.status!=null)
        data_update.status = data.status;
    if (data.message!=null)
        data_update.message = data.message;
    if (Object.entries(data_update).length>0)
        return server.ORM.Execute({app_id:app_id, dml:'UPDATE', object:'AppModuleQueue', update:{resource_id:resource_id, data_app_id:null, data:data_update}}).then((/**@type{server['ORMMetaData']['common_result_update']}*/result)=>{
            if (result.affectedRows>0)
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
 * @returns {Promise.<server['server']['response'] & {result?:server['ORMMetaData']['common_result_delete'] }>}
 */
const deleteRecord = async (app_id, resource_id) => {
    return server.ORM.Execute({app_id:app_id, dml:'DELETE', object:'AppModuleQueue', delete:{resource_id:resource_id, data_app_id:null}}).then((/**@type{server['ORMMetaData']['common_result_delete']}*/result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return server.ORM.getError(app_id, 404);
    });
};
                   
export {get, getResult, post, postResult, update, deleteRecord};