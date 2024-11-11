/** @module server/db/fileModelIamUserLogin */

/**
 * @import {server_iam_user_login} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileFsAppend, fileFsReadLog} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_iam_user_login[]>}
 */
const get = async app_id => fileFsReadLog(app_id, 'IAM_USER_LOGIN', null,'');

/**
 * Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<null>}
 */
const post = async (app_id, data) => fileFsAppend('IAM_USER_LOGIN',data, '');

export {get, post};