/** @module server/db/fileModelAppModuleQueue */

/**
 * @import {server_server_response,server_db_app_module_queue_status,
 *          server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_table_app_module_queue} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileRecord, fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);

/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);


/**
 * @name get
 * @description Get records for given appid
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {server_server_response & {result?:server_db_table_app_module_queue[] }}
 */
const get = parameters =>{ 
    const result = fileDBGet(parameters.app_id, 'APP_MODULE_QUEUE',parameters.resource_id, parameters.app_id);
    if (result.rows.length>0 || parameters.resource_id==null)
        return  {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(parameters.app_id, 404);
};

/**
 * @name getResult
 * @description Get result for given resource_id, returns HTML
 *              (bff controls if file exists)
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<server_server_response & {result?:{sendfile:String} }>}
 */
const getResult = async parameters => {
    /**@type{import('./fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    return {sendfile:process.cwd() + `${fileModelConfig.get('CONFIG_SERVER','SERVER','PATH_DATA_JOBS')}/${parameters.resource_id}.html`, type:'HTML'};
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {{type:'REPORT',
 *          app_module_id:number,
 *          iam_user_id:number,
 *          name:string,
 *          parameters:string,
 *          status:server_db_app_module_queue_status
 *          user:string}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (app_id!=null && data.type!=null && data.name!=null && data.parameters!=null && data.user!=null){
        /**@type{server_db_table_app_module_queue} */
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
        return fileDBPost(app_id, 'APP_MODULE_QUEUE', job).then((result)=>{
            if (result.affectedRows>0)
                return  {result:{insertId:job.id, affectedRows:result.affectedRows}, type:'JSON'};
            else
                return dbCommonRecordError(app_id, 404);
        });
    }
    else
        return dbCommonRecordError(app_id, 400);
};
/**
 * @name postResult
 * @description Post result
 * @function
 * @param {number} app_id
 * @param {number} id
 * @param {string} result
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postResult = async (app_id, id, result) =>{
    const fs = await import('node:fs');
    const filepath = `${fileRecord('DB_FILE').PATH}/jobs/${id}.html`;
    await fs.promises.writeFile(process.cwd() + filepath, result,  'utf8');
    return {result:{affectedRows:1}, type:'JSON'};
};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{start?:string|null,
 *          end?:string|null,
 *          progress?:number|null,
 *          status?:server_db_app_module_queue_status,
 *          message?:string|null}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
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
        return fileDBUpdate(app_id, 'APP_MODULE_QUEUE', resource_id, null, data_update).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(app_id, 404);
        });
    else
        return dbCommonRecordError(app_id, 400);
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
    return fileDBDelete(app_id, 'APP_MODULE_QUEUE', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return {result:result, type:'JSON'};
        else
            return dbCommonRecordError(app_id, 404);
    });
};
                   
export {get, getResult, post, postResult, update, deleteRecord};