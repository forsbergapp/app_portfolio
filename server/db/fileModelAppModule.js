/** @module server/db/fileModelAppModule */

/**
 * @import {server_server_res,
 *          server_db_file_app_module} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get records for given appid
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @param {number|null} data_app_id
 * @param {server_server_res|null} res
 * @returns {server_db_file_app_module[]}
 */
const get = (app_id, resource_id, data_app_id, res) => fileDBGet(app_id, 'APP_MODULE',resource_id, data_app_id, res);

/**
 * Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{id:number}>}
 */
const post = async (app_id, data, res) => {
    //check required attributes
    if (app_id!=null && data.app_id!=null && data.common_type!=null && data.common_name!=null && data.common_role!=null && data.common_path!=null){
        /**@type{server_db_file_app_module} */
        const data_new ={
            id:                 Date.now(),
            app_id:             data.app_id,
            common_type:        data.common_type,
            common_name:        data.common_name,
            common_role:        data.common_role,
            common_path:        data.common_path,
            common_description: data.common_description
        };
        return fileDBPost(app_id, 'APP_MODULE', data_new, res).then(()=>{return {id:data_new.id};});
    }
    else{
        res.statusCode = 400;
        throw '⛔';    
    }
};
/**
 * Update record
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
    /**@type{server_db_file_app_module} */
    const data_update = {};
    //allowed parameters to update:
    if (data.common_type)
        data_update.common_type = data.common_type;
    if (data.common_name)
        data_update.common_name = data.common_name;
    if (data.common_role)
        data_update.common_role = data.common_role;
    if (data.common_path)
        data_update.common_path = data.common_path;
    if (data.common_description)
        data_update.common_description = data.common_description;
    if (Object.entries(data_update).length>0){
        return fileDBUpdate(app_id, 'APP_MODULE', resource_id, null, data_update, res);
    }
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
    return fileDBDelete(app_id, 'APP_MODULE', resource_id, null, res);
};
                   
export {get, post, update, deleteRecord};