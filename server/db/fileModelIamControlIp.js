/** @module server/db/fileModelIamControlIp */

/**
 * @import {server_server_res,
 *          server_db_file_iam_control_ip} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @param {server_server_res|null} res
 * @returns {server_db_file_iam_control_ip[]}
 */
const get = (app_id, resource_id, res) =>{
    const result = fileDBGet(app_id, 'IAM_CONTROL_IP',resource_id, null);
    if (result.length>0 || resource_id==null)
        return result;
    else
        throw fileCommonRecordNotFound(res);

};

/**
 * Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_file_iam_control_ip} data
 * @param {server_server_res} res
 * @returns {Promise.<{id:number}>}
 */
const post = async (app_id, data, res) => {
    //check required attributes
    if (data.from && data.to){
        const id = Date.now();
        return fileDBPost(app_id, 'IAM_CONTROL_IP', {   id:id, 
                                                        app_id:data.app_id,
                                                        from:data.from, 
                                                        to:data.to,
                                                        hour_from:data.hour_from,
                                                        hour_to:data.hour_to,
                                                        date_from:data.date_from,
                                                        date_to:data.date_to,
                                                        action:data.action}).then((result)=>{
            if (result.affectedRows>0)
                return {id:id};
            else
                throw fileCommonRecordNotFound(res);
        });
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
 * @param {server_db_file_iam_control_ip} data
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
   
    /**@type{server_db_file_iam_control_ip}*/
    const ip_record = get(app_id, resource_id, null)[0];
    if (ip_record){
        if (data.from && data.to){
            const data_update = {};
            if (data.from)
                data_update.from = data.from;
            if (data.to)
                data_update.to = data.to;
            if (data.hour_from)
                data_update.hour_from = data.hour_from;
            if (data.hour_to)
                data_update.hour_to = data.hour_to;
            if (data.date_from)
                data_update.date_from = data.date_from;
            if (data.date_to)
                data_update.date_to = data.date_to;
            if (data.action)
                data_update.action = data.action;

            if (Object.entries(data_update).length==2)
                return fileDBUpdate(app_id, 'IAM_CONTROL_IP', resource_id, null, data_update).then((result)=>{
                    if (result.affectedRows>0)
                        return result;
                    else
                        throw fileCommonRecordNotFound(res);
                });
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
    return fileDBDelete(app_id, 'IAM_CONTROL_IP', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return result;
        else
            throw fileCommonRecordNotFound(res);
    });
};
                   
export {get, post, update, deleteRecord};