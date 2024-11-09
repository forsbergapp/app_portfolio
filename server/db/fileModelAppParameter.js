/** @module server/db/fileModelAppParameter */

/**
 * @import {server_server_res,
 *          server_db_file_app_parameter} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get records for given appid
 * @function
 * @param {number} app_id
 * @param {server_server_res|null} res
 * @returns {server_db_file_app_parameter[]}
 */
const get = (app_id, res) => fileDBGet(app_id, 'APP_PARAMETER',null, app_id, res);

/**
 * Add record
 * Table is designed to add one parameter in the same record
 * so update function is called  and returns same resource id
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{id:number}>}
 */
const post = async (app_id, resource_id, data, res) => update(app_id, resource_id, data, res).then(()=>{return {id:resource_id};}) ;
/**
 * Update
 * Table is designed to update one parameter in the same record
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
    if  (data.parameter_name=='app_id'){
        res.statusCode = 400;
        throw '⛔';    
    }
    else{
        //updates only one key in the record
        return fileDBUpdate(app_id, 'APP_PARAMETER', null, resource_id, {[data.parameter_name]:{    value:data.parameter_value, 
                                                                                                    comment:data.parameter_comment}}, res);
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
    return fileDBDelete(app_id, 'APP_PARAMETER', null, resource_id, res);
};
                   
export {get, post, update, deleteRecord};