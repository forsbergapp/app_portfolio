/** @module server/db/fileModelIamUser */

/**
 * @import {server_server_res,
 *          server_db_file_iam_user} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileCommonRecordNotFound, fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**
 * Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @param {server_server_res|null} res
 * @returns {server_db_file_iam_user[]}
 */
const get = (app_id, resource_id, res) =>{
    const result = fileDBGet(app_id, 'IAM_USER',resource_id, null);
    if (result.length>0 || resource_id==null)
        return result;
    else
        throw fileCommonRecordNotFound(res);
};

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
    if (!data.username || !data.password ||
        //check not allowed attributes when creating a user
        data.id||data.user_level ||data.verification_code||data.status||data.created||data.modified){
        res.statusCode = 400;
        throw '⛔';    
    }
    else{
        /**@type{import('../security.js')} */
        const {securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);
        /**@type{server_db_file_iam_user} */
        const data_new =     {
                                id:Date.now(),
                                username:data.username, 
                                //save encrypted password
                                password:await securityPasswordCreate(data.password), 
                                type: data.type, 
                                bio:data.bio, 
                                private:data.private, 
                                email:data.email, 
                                email_unverified:data.email_unverified, 
                                avatar:data.avatar,
                                user_level:null, 
                                verification_code: null, 
                                status:null, 
                                created:new Date().toISOString(), 
                                modified:new Date().toISOString()
                        };
        return fileDBPost(app_id, 'IAM_USER', data_new).then((result)=>{
            if (result.affectedRows>0)
                return {id:data_new.id};
            else
                throw fileCommonRecordNotFound(res);
        });
    }
};
/**
 * Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<{affectedRows:number}>}
 */
const update = async (app_id, resource_id, data, res) => {

    /**@type{import('../security.js')} */
    const {securityPasswordCompare, securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);
    
    /**@type{server_db_file_iam_user}*/
    const user = get(app_id, resource_id, null)[0];
    if (user){
        if (user.username == data.username && data.password && await securityPasswordCompare(data.password, user.password)){
            /**@type{server_db_file_iam_user} */
            const data_update = {};
            //allowed parameters to update:
            if (data.username!=null)
                data_update.username = data.username;
            if (data.password!=null){
                data_update.password = await securityPasswordCreate(data.password_new ?? data.password);
            }
            if (data.bio!=null)
                data_update.bio = data.bio;
            if (data.email!=null)
                data_update.email = data.email;
            if (data.email_unverified!=null)
                data_update.email_unverified = data.email_unverified;
            if (data.avatar!=null)
                data_update.avatar = data.avatar;
            data_update.modified = new Date().toISOString();

            if (Object.entries(data_update).length>0)
                return fileDBUpdate(app_id, 'IAM_USER', resource_id, null, data_update).then((result)=>{
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
    return fileDBDelete(app_id, 'IAM_USER', resource_id, null).then((result)=>{
        if (result.affectedRows>0)
            return result;
        else
            throw fileCommonRecordNotFound(res);
    });
};
                   
export {get, post, update, deleteRecord};