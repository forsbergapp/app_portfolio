/** @module server/db/fileModelIamControlUserAgent */

/**
 * @import {server_server_res,
 *          server_db_file_iam_control_user_agent} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {number|null} app_id
 * @param {number|null} resource_id
 * @param {server_server_res|null} res
 * @returns {server_db_file_iam_control_user_agent[]}
 */
const get = (app_id, resource_id, res) => fileDBGet(app_id, 'IAM_CONTROL_USER_AGENT',resource_id, null, res);

/**
 * Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_file_iam_control_user_agent} data
 * @param {server_server_res} res
 * @returns {Promise.<{id:number}>}
 */
const post = async (app_id, data, res) => {
    //check required attributes
    if (data.name && data.user_agent){
        const id = Date.now();
        return fileDBPost(app_id, 'IAM_CONTROL_USER_AGENT', {id:id, name:data.name, user_agent:data.user_agent}, res).then(()=>{return {id:id};});
    }
    else{
        res.statusCode = 400;
        throw '⛔';    
    }

};
/**
 * Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_file_iam_control_user_agent} data
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
   
    /**@type{server_db_file_iam_control_user_agent}*/
    const record = get(app_id, resource_id, null)[0];
    if (record){
        if (data.name && data.user_agent){
            const data_update = {};
            data_update.name = data.name;
            data_update.user_agent = data.user_agent;
            if (Object.entries(data_update).length==2)
                return fileDBUpdate(app_id, 'IAM_CONTROL_USER_AGENT', resource_id, null, data_update, res);
            else{
                res.statusCode = 404;
                throw '⛔';    
            }
        }
        else{
            res.statusCode = 400;
            throw '⛔';        
        }
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
    return fileDBDelete(app_id, 'IAM_CONTROL_USER_AGENT', resource_id, null, res);
};
                   
export {get, post, update, deleteRecord};