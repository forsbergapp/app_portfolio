/** @module server/db/fileModelIamAppToken */

/**
 * @import {server_iam_app_token} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileFsAppend, fileFsReadLog} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_iam_app_token[]>}
 */
const get = async app_id => fileFsReadLog(app_id, 'IAM_APP_TOKEN', null,'');

/**
 * Add record
 * @function
 * @param {number} app_id 
 * @param {*} data
 * @returns {Promise.<null>}
 */
const post = async (app_id, data) => fileFsAppend('IAM_APP_TOKEN',data, '');

export {get, post};