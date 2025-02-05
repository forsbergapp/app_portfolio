/** @module server/db/fileModelIamUser */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_file_iam_user} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_file_iam_user[] }}
 */
const get = (app_id, resource_id) =>{
    const result = fileDBGet(app_id, 'IAM_USER',resource_id, null);
    if (result.rows.length>0 || resource_id==null)
        return {result:result.rows, type:'JSON'};
    else
        return dbCommonRecordError(app_id, 404);
};

/**
 * @name post
 * @description Add record
 * @function
 * @param {number} app_id 
 * @param {server_db_file_iam_user} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (!data.username || !data.password ||
        //check not allowed attributes when creating a user
        data.id||data.user_level ||data.verification_code||data.status||data.created||data.modified){
            return dbCommonRecordError(app_id, 400);
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
                                password_reminder:data.password_reminder,
                                type: data.type, 
                                bio:data.bio, 
                                private:data.private, 
                                email:data.email, 
                                email_unverified:data.email_unverified, 
                                avatar:data.avatar,
                                user_level:data.user_level, 
                                verification_code: data.verification_code, 
                                status:data.status, 
                                active:data.active,
                                created:new Date().toISOString(), 
                                modified:new Date().toISOString()
                        };
        return fileDBPost(app_id, 'IAM_USER', data_new).then((result)=>{
            if (result.affectedRows>0){
                result.insertId=data_new.id;
                return {result:result, type:'JSON'};
            }
            else
                return dbCommonRecordError(app_id, 404);
        });
    }
};
/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_file_iam_user} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async (app_id, resource_id, data) => {
    /**@type{import('../security.js')} */
    const {securityPasswordCompare, securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);    
    /**@type{server_db_file_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (user.username == data.username && data.password && await securityPasswordCompare(data.password, user.password)){
            /**@type{server_db_file_iam_user} */
            const data_update = {};
            //allowed parameters to update:
            if (data.username!=null)
                data_update.username = data.username;
            if (data.password!=null)
                data_update.password = await securityPasswordCreate(data.password_new ?? data.password);
            if (data.password_reminder!=null)
                data_update.password_reminder = data.password_reminder;
            if (data.bio!=null)
                data_update.bio = data.bio;
            if (data.email!=null)
                data_update.email = data.email;
            if (data.email_unverified!=null)
                data_update.email_unverified = data.email_unverified;
            if (data.avatar!=null)
                data_update.avatar = data.avatar;
            //admin columns
            if (data.status!=null)
                data_update.status = data.status;
            if (data.active!=null)
                data_update.active = data.active;
            if (data.verification_code!=null)
                data_update.verification_code = data.verification_code;
            data_update.modified = new Date().toISOString();

            if (Object.entries(data_update).length>0)
                return fileDBUpdate(app_id, 'IAM_USER', resource_id, null, data_update).then((result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return dbCommonRecordError(app_id, 404);
                });
            else
                return dbCommonRecordError(app_id, 400);
        }
        else
            return dbCommonRecordError(app_id, 400);
    }
    else
        return dbCommonRecordError(app_id, 404);
};

/**
 * @name updateVerificationCodeAuthenticate
 * @description updateVerificationCodeAuthenticate
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{verification_code:string}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const updateVerificationCodeAuthenticate = async (app_id, resource_id, data) => {
    /**@type{server_db_file_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (user.verification_code==data.verification_code){
            /**@type{server_db_file_iam_user} */
            const data_update = {};
            data_update.verification_code = null;
            data_update.active = 1;
            data_update.modified = new Date().toISOString();
            if (Object.entries(data_update).length>0)
                return fileDBUpdate(app_id, 'IAM_USER', resource_id, null, data_update).then((result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return dbCommonRecordError(app_id, 404);
                });
            else
                return dbCommonRecordError(app_id, 400);
        }
        else
            return dbCommonRecordError(app_id, 401);
    }
    else
        return dbCommonRecordError(app_id, 404);
};
/**
 * @name updateVerificationCodeAdd
 * @description updateVerificationCodeAdd
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{verification_code:string}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const updateVerificationCodeAdd = async (app_id, resource_id, data) => {
    /**@type{server_db_file_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        /**@type{server_db_file_iam_user} */
        const data_update = {};
        data_update.verification_code = data.verification_code;
        data_update.active = 0;
        data_update.modified = new Date().toISOString();
        if (Object.entries(data_update).length>0)
            return fileDBUpdate(app_id, 'IAM_USER', resource_id, null, data_update).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return dbCommonRecordError(app_id, 404);
            });
        else
            return dbCommonRecordError(app_id, 400);
    }
    else
        return dbCommonRecordError(app_id, 404);
};

/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{password_new:string}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const updatePassword = async (app_id, resource_id, data) => {
    /**@type{server_db_file_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        /**@type{server_db_file_iam_user} */
        const data_update = {};
        data_update.password = data.password_new;
        data_update.modified = new Date().toISOString();
        if (Object.entries(data_update).length>0)
            return fileDBUpdate(app_id, 'IAM_USER', resource_id, null, data_update).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return dbCommonRecordError(app_id, 404);
            });
        else
            return dbCommonRecordError(app_id, 400);
    }
    else
        return dbCommonRecordError(app_id, 404);
};

/**
 * @name deleteRecord
 * @description Delete
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{password:string}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecord = async (app_id, resource_id, data) => {
    /**@type{import('../security.js')} */
    const {securityPasswordCompare}= await import(`file://${process.cwd()}/server/security.js`);    
    /**@type{server_db_file_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (data.password && await securityPasswordCompare(data.password, user.password))
            return fileDBDelete(app_id, 'IAM_USER', resource_id, null).then((result)=>{
                if (result.affectedRows>0)
                    return {result:result, type:'JSON'};
                else
                    return dbCommonRecordError(app_id, 404);
            });
        else
            return dbCommonRecordError(app_id, 400);
    }
    else
        return user;
};
                   
/**
 * @name deleteRecordDemo
 * @description Delete demo record
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecordDemo = async (app_id, resource_id) => {
    /**@type{server_db_file_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        return fileDBDelete(app_id, 'IAM_USER', resource_id, null).then((result)=>{
            if (result.affectedRows>0)
                return {result:result, type:'JSON'};
            else
                return dbCommonRecordError(app_id, 404);
        });
    }
    else
        return user;
};

export {get, post, update, updateVerificationCodeAuthenticate, updateVerificationCodeAdd, updatePassword, deleteRecord, deleteRecordDemo};