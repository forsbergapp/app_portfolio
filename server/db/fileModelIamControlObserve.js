/** @module server/db/fileModelIamControlObserve */

/**
 * @import {server_server_res,
 *          server_db_file_iam_control_observe} from '../types.js'
 */

/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);

/**
 * @name get
 * @description Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @param {server_server_res|null} res
 * @returns {server_db_file_iam_control_observe[]}
 */
const get = (app_id, resource_id, res) =>{
    const result = fileDBGet(app_id, 'IAM_CONTROL_OBSERVE',resource_id, null);
    if (result.length>0 || resource_id==null)
        return result;
    else
        throw fileCommonRecordNotFound(res);
};
/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_file_iam_control_observe} data
 * @param {server_server_res} res
 * @returns {Promise.<{id:number}>}
 */
const post = async (app_id, data, res) => {
    //check required attributes
    if ((data.status==0 ||data.status==1) && data.type){
        const id = Date.now();
        return fileDBPost(app_id, 'IAM_CONTROL_OBSERVE', {  id:id, 
                                                            app_id:data.app_id,
                                                            ip:data.ip, 
                                                            lat:data.lat,
                                                            lng:data.lng,
                                                            user_agent:data.user_agent,
                                                            host:data.host,
                                                            accept_language:data.accept_language,
                                                            method:data.method,
                                                            url:data.url,
                                                            status:data.status,
                                                            type:data.type}).then((result)=>{
            if (result.affectedRows>0)
                return {id:id};
            else
                throw fileCommonRecordNotFound(res);
        });
    }
    else{
        /**@type{import('../iam.js')} */
        const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
        res.statusCode = 400;
        throw iamUtilMesssageNotAuthorized();    
    }

};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_file_iam_control_observe} data
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {
    /**@type{import('../iam.js')} */
    const  {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
    /**@type{server_db_file_iam_control_observe}*/
    const ip_record = get(app_id, resource_id, null)[0];
    if (ip_record){
        if ((data.status==0 ||data.status==1)){
            const data_update = {};
            if (data.app_id!=null)
                data_update.app_id = data.app_id;
            if (data.ip!=null)
                data_update.ip = data.ip;
            if (data.lat!=null)
                data_update.lat = data.lat;
            if (data.lng!=null)
                data_update.lng = data.lng;
            if (data.user_agent!=null)
                data_update.user_agent = data.user_agent;
            if (data.host!=null)
                data_update.host = data.host;
            if (data.accept_language!=null)
                data_update.accept_language = data.accept_language;
            if (data.method!=null)
                data_update.method = data.method;
            if (data.url!=null)
                data_update.url = data.url;
            data_update.status = data.status;
            //id and type not allowed to update
            if (Object.entries(data_update).length>0)
                return fileDBUpdate(app_id, 'IAM_CONTROL_OBSERVE', resource_id, null, data_update).then((result)=>{
                    if (result.affectedRows>0)
                        return result;
                    else
                        throw fileCommonRecordNotFound(res);
                });
            else{
                res.statusCode = 404;
                throw iamUtilMesssageNotAuthorized();
            }
        }
        else{
            res.statusCode = 400;
            throw iamUtilMesssageNotAuthorized();
        }
    }
    else{
        res.statusCode = 404;
        throw iamUtilMesssageNotAuthorized();
    }
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const deleteRecord = async (app_id, resource_id, res) => {
    return fileDBDelete(app_id, 'IAM_CONTROL_OBSERVE', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return result;
        else
            throw fileCommonRecordNotFound(res);
    });
};
                   
export {get, post, update, deleteRecord};