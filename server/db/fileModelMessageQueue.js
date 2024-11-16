/** @module server/config */

/**
 * @import {server_db_file_db_name_message_queue} from '../types.js'
 */


/**@type{import('./file.js')} */
const {fileFsAppend, fileFsReadLog} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {server_db_file_db_name_message_queue} file
 * @returns {Promise.<*>}
 */
const get = async file => fileFsReadLog(null, file, null,'');

/**
 * Add record
 * @function
 * @param {server_db_file_db_name_message_queue} file
 * @param {*} data
 * @returns {Promise.<null>}
 */
const post = async (file,data) => fileFsAppend(file,data, '');

export {get, post};