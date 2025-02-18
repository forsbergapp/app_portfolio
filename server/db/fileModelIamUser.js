/** @module server/db/fileModelIamUser */

/**
 * @import {server_server_response,server_db_common_result_insert,server_db_common_result_update,server_db_common_result_delete,
 *          server_db_table_iam_user, server_db_table_iam_app_access, server_db_table_iam_user_event,server_db_iam_user_admin} from '../types.js'
 */
/**@type{import('./file.js')} */
const {fileDBGet, fileDBPost, fileDBUpdate, fileDBDelete} = await import(`file://${process.cwd()}/server/db/file.js`);
/**@type{import('../db/common.js')} */
const { dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);
/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**
 * @name get
 * @description Get user 
 * @function
 * @param {number} app_id
 * @param {number|null} resource_id
 * @returns {server_server_response & {result?:server_db_table_iam_user[] }}
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
 * @param {server_db_table_iam_user} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) => {
    //check required attributes
    if (!data.username || !data.password || !data.type||
        //check not allowed attributes when creating a user
        data.id||data.user_level ||data.status||data.created||data.modified){
            return dbCommonRecordError(app_id, 400);
    }
    else{
        /**@type{import('../security.js')} */
        const {securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);
        /**@type{server_db_iam_user_admin} */
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
 * @name postAdmin
 * @description Add record admin
 * @function
 * @param {number} app_id 
 * @param {server_db_table_iam_user} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const postAdmin = async (app_id, data) => {
    /**@type{import('../security.js')} */
    const {securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);
    /**@type{server_db_iam_user_admin} */
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
};

/**
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {server_db_table_iam_user} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const update = async (app_id, resource_id, data) => {
    /**@type{import('../security.js')} */
    const {securityPasswordCompare, securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);    
    /**@type{server_db_table_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (user.username == data.username && data.password && await securityPasswordCompare(data.password, user.password)){
            /**@type{server_db_table_iam_user} */
            const data_update = {};
            //allowed parameters to update:
            if (data.username!=null && data.username != '')
                data_update.username = data.username;
            if (data.password!=null && data.password != '')
                data_update.password = await securityPasswordCreate(data.password_new ?? data.password);
            if (data.password_reminder!=null)
                data_update.password_reminder = data.password_reminder;
            if (data.bio!=null)
                data_update.bio = data.bio;
            if (data.private!=null)
                data_update.private = serverUtilNumberValue(data.private);
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
 * @name updateAdmin
 * @description UpdateAdmin
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data :server_db_iam_user_admin}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const updateAdmin = async parameters => {
    /**@type{import('../security.js')} */
    const {securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);    
    /**@type{server_db_table_iam_user}*/
    const user = get(parameters.app_id, parameters.resource_id).result[0];
    if (user){
            /**@type{server_db_table_iam_user} */
            const data_update = {};
            //allowed parameters to update:
            if (parameters.data?.username!=null && parameters.data?.username!='')
                data_update.username = parameters.data.username;
            if (parameters.data?.password!=null && parameters.data?.password!='')
                data_update.password = await securityPasswordCreate(parameters.data?.password_new ?? parameters.data.password);
            if (parameters.data?.password_reminder!=null)
                data_update.password_reminder = parameters.data.password_reminder;
            if (parameters.data?.bio!=null)
                data_update.bio = parameters.data.bio;
            if (parameters.data?.private!=null)
                data_update.private = serverUtilNumberValue(parameters.data.private) ?? 0;
            if (parameters.data?.email!=null)
                data_update.email = parameters.data.email;
            if (parameters.data?.email_unverified!=null)
                data_update.email_unverified = parameters.data.email_unverified;
            if (parameters.data?.avatar!=null)
                data_update.avatar = parameters.data.avatar;
            //admin columns
            if (parameters.data?.type!=null)
                data_update.type = parameters.data.type;
            if (parameters.data?.user_level!=null)
                data_update.user_level = serverUtilNumberValue(parameters.data.user_level);
            if (parameters.data?.verification_code!=null)
                data_update.verification_code = parameters.data.verification_code;
            if (parameters.data?.status!=null)
                data_update.status = parameters.data.status;
            if (parameters.data?.active!=null)
                data_update.active = serverUtilNumberValue(parameters.data.active) ?? 0;
            data_update.modified = new Date().toISOString();

            if (Object.entries(data_update).length>0)
                return fileDBUpdate(parameters.app_id, 'IAM_USER', parameters.resource_id, null, data_update).then((result)=>{
                    if (result.affectedRows>0)
                        return {result:result, type:'JSON'};
                    else
                        return dbCommonRecordError(parameters.app_id, 404);
                });
            else
                return dbCommonRecordError(parameters.app_id, 400);
    }
    else
        return dbCommonRecordError(parameters.app_id, 404);
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
    /**@type{server_db_table_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (user.verification_code==data.verification_code){
            /**@type{server_db_table_iam_user} */
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
 * @name update
 * @description Update
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{password_new:string}} data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const updatePassword = async (app_id, resource_id, data) => {
    /**@type{server_db_table_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        /**@type{server_db_table_iam_user} */
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
    /**@type{server_db_table_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        if (data.password && await securityPasswordCompare(data.password, user.password))
            return deleteCascade(app_id, resource_id).then(result_cascade=>result_cascade.http?
                                                            result_cascade:fileDBDelete(app_id, 'IAM_USER', resource_id, null).then((result)=>{
                                                            if (result.affectedRows>0)
                                                                return {result:result, type:'JSON'};
                                                            else
                                                                return dbCommonRecordError(app_id, 404);
                                                        }));
        else
            return dbCommonRecordError(app_id, 400);
    }
    else
        return user;
};
/**
 * @name deleteCascade
 * @description delete records in table with FK to IAM_USER
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteCascade = async (app_id, resource_id) =>{
    /**@type{import('./fileModelIamUserEvent.js')} */
    const fileModelIamUserEvent = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);
    /**@type{import('./fileModelIamAppAccess.js')} */
    const fileModelIamAppAccess = await import(`file://${process.cwd()}/server/db/fileModelIamAppAccess.js`);

    const result_recordsUserEvent = fileModelIamUserEvent.get(app_id, resource_id);        
    if (result_recordsUserEvent.result){
        let count_delete = 0;
        let error ;
        for (const record of result_recordsUserEvent.result.filter((/**@type{server_db_table_iam_user_event}*/row)=>row.iam_user_id == resource_id)){
            count_delete++;
            const result_delete = await fileModelIamUserEvent.deleteRecord( app_id, 
                                                                            /**@ts-ignore */
                                                                            record.id);
            if (result_delete.http)
                error = result_delete;
        }
        if (error)
            return error;
        else{
            const result_recordsIamAppAccess = fileModelIamAppAccess.get(app_id, null);
            if (result_recordsIamAppAccess.result){
                for (const record of result_recordsIamAppAccess.result.filter((/**@type{server_db_table_iam_app_access}*/row)=>row.iam_user_id == resource_id)){
                    count_delete++;
                    const result_delete = await fileModelIamAppAccess.deleteRecord( app_id, 
                                                                                    /**@ts-ignore */
                                                                                    record.id);
                    if (result_delete.http)
                        error = result_delete;
                }
                if (error)
                    return error;
                else
                    return {result:{affectedRows:count_delete}, type:'JSON'};
            }
            else
                return result_recordsIamAppAccess;
        }
    }
    else
        return result_recordsUserEvent;
};
/**
 * @name deleteRecordAdmin
 * @description Delete record admin
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteRecordAdmin = async (app_id, resource_id) => {
    /**@type{server_db_table_iam_user}*/
    const user = get(app_id, resource_id).result[0];
    if (user){
        return deleteCascade(app_id, resource_id).then(result_cascade=>result_cascade.http?
                                result_cascade:
                                    fileDBDelete(app_id, 'IAM_USER', resource_id, null)
                                    .then(result=>{
                                            if (result.affectedRows>0)
                                                return {result:result, type:'JSON'};
                                            else
                                                return dbCommonRecordError(app_id, 404);
                                            }));
    }
    else
        return user;
};

export {get, post, postAdmin, update, updateAdmin, updateVerificationCodeAuthenticate, updatePassword, deleteRecord, deleteRecordAdmin};