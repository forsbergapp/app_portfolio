/** @module server/db/fileModelAppModuleQueue */

/**
 * @import {server_server_res,
 *          server_db_file_app_module_queue} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get records for given appid
 * @function
 * @param {number} app_id
 * @param {server_server_res} res
 * @returns {server_db_file_app_module_queue[]}
 */
const get = (app_id, res) => fileDBGet(app_id, 'APP_MODULE_QUEUE',null, app_id, res);

/**
 * Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<server_db_file_app_module_queue>}
 */
const post = async (app_id, data, res) => {
    //check required attributes
    if (!app_id || !data.type || !data.name || !data.parameters || !data.user){
        res.statusCode = 400;
        throw '⛔';    
    }
    else{
        /**@type{server_db_file_app_module_queue} */
        const job =     {
                            id:Date.now(),
                            app_id:app_id,                            
                            type: data.type, 
                            name:data.name,
                            parameters:data.parameters,
                            user: data.user,
                            start:null,
                            end:null,
                            progress:null,
                            status:'PENDING',
                            message:null
                        };
        return fileDBPost(app_id, 'APP_MODULE_QUEUE', job, res).then(()=>job);
    }
};
/**
 * Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
    const data_update = {};
    //allowed parameters to update:
    if (data.start)
        data_update.start = data.start;
    if (data.end)
        data_update.end = data.end;
    if (data.progress)
        data_update.progress = data.progress;
    if (data.message)
        data_update.message = data.message;
    if (Object.entries(data_update).length>0)
        return fileDBUpdate(app_id, 'APP_MODULE_QUEUE', resource_id, app_id, data_update, res);
    else{
        res.statusCode = 404;
        throw '⛔';    
    }
    
};

/**
 * Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const deleteRecord = async (app_id, resource_id, res) => {
    return fileDBDelete(app_id, 'APP_MODULE_QUEUE', resource_id, app_id, res);
};
                   
export {get, post, update, deleteRecord};