/** @module server/config */

/**
 * @import {server_db_file_db_name_message_queue} from '../types.js'
 */


/**@type{import('./file.js')} */
const {fileFsDBLogPost, fileFsDBLogGet} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {server_db_file_db_name_message_queue} file
 * @returns {Promise.<*>}
 */
const get = async file => fileFsDBLogGet(null, file, null, null,'');

/**
 * Add record
 * @function
 * @param {server_db_file_db_name_message_queue} file
 * @param {*} data
 * @returns {Promise.<{affectedRows:number}>}
 */
const post = async (file,data) => fileFsDBLogPost(null, file,data, '');

export {get, post};