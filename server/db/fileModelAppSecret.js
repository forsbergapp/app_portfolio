/** @module server/db/fileModelAppParameter */

/**
 * @import {server_server_res,
 *          server_db_file_app_secret} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileFsRead, fileDBGet, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get records for given appid
 * @function
 * @param {number} app_id
 * @param {server_server_res|null} res
 * @returns {server_db_file_app_secret[]}
 */
const get = (app_id, res) => fileDBGet(app_id, 'APP_SECRET',null, app_id, res);

/**
 * Get records from file
 * @param {number} app_id
 * @returns {Promise.<server_db_file_app_secret>}
 */
const getFile = async app_id => fileFsRead('APP_SECRET').then(result=>result.file_content.filter((/**@type{server_db_file_app_secret}*/row)=> row.app_id == app_id)[0]);

/**
 * Add record
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
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @param {server_server_res|null} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
    if  (data.parameter_name=='app_id'){
        if(res)
            res.statusCode = 400;
        throw '⛔';    
    }
    else{
        //updates only one key in the record
        return fileDBUpdate(app_id, 'APP_SECRET', null, resource_id, {[data.parameter_name]:data.parameter_value}, res);
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
    return fileDBDelete(app_id, 'APP_SECRET', null, resource_id, res);
};
                   
export {get, getFile, post, update, deleteRecord};