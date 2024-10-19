/** @module server/db/components/user_account_app_data_post */

/**@type{import('../sql/user_account_app_data_post.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/user_account_app_data_post.service.js`);

/**@type{import('../sql/user_account_app_data_post_like.service.js')} */
const user_account_app_data_post_like_service = await import(`file://${process.cwd()}/server/db/sql/user_account_app_data_post_like.service.js`);
/**@type{import('../../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {import('../../types.js').server_server_error} res
 */
const getUserPostsByUserId = (app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getUserPostsByUserId(app_id, resource_id)
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query
 * @param {import('../../types.js').server_server_res} res
 */
const getProfileUserPosts =(app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUserPosts(app_id, resource_id, serverUtilNumberValue(query.get('id_current_user')))
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query
 * @param {import('../../types.js').server_server_res} res
 */
 const getProfileStatLike = (app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileStatLike(app_id, resource_id)
        .then(result=>{
            if (result[0])
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {import('../../types.js').server_server_res} res
 */
const getProfileStatPost = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileStatPost(app_id, serverUtilNumberValue(query.get('statchoice')))
        .then(result=>{
            if (result)
                resolve(result); 
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {*} res
 */
const getProfileUserPostDetail = (app_id, resource_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getProfileUserPostDetail(app_id, resource_id, serverUtilNumberValue(query.get('detailchoice')))
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id
 * @param {*} query
 * @param {*} data
 */
const createUserPost = (app_id, query, data) => {
    return new Promise((resolve, reject)=>{
        /**@type{import('../../types.js').server_db_sql_parameter_user_account_app_data_post_createUserPost} */
        const data_create = {	description:		data.description,
                                json_data: 		    data.json_data,
                                user_account_id:	serverUtilNumberValue(data.user_account_id)
                            };
        const call_service = ()=> {
            service.createUserPost(app_id, data_create)
            .then(result=>{
                resolve({
                    id: result.insertId,
                    data: result
                });
            })
            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
        };
        //Check if first time
        if (serverUtilNumberValue(query.get('initial'))==1){
            service.getUserPostsByUserId(app_id, serverUtilNumberValue(data.user_account_id))
            .then(result=>{
                if (result.length==0){
                    //no user settings found, ok to create initial user setting
                    call_service();
                }
                else
                    resolve({
                        id: null,
                        data: null
                    });
            })
            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
        }
        else
            call_service();
    });
	
};
/**
 * 
 * @param {number} app_id 
 * @param {*} resource_id
 * @param {*} query 
 * @param {*} data 
 * @param {import('../../types.js').server_server_res} res
 */
const updateUserPost = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{import('../../types.js').server_db_sql_parameter_user_account_app_data_post_updateUserPost} */
        const data_update = {	description:		data.description,
                                json_data: 		    data.json_data,
                                user_account_id:	serverUtilNumberValue(data.user_account_id)};
        service.updateUserPost(app_id, data_update, resource_id)
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @param {*} query 
 * @param {import('../../types.js').server_server_res} res
 */
const deleteUserPost = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        service.deleteUserPost(app_id, resource_id, data.user_account_id)
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
const like = (app_id, resource_id, data) => user_account_app_data_post_like_service.like(app_id, resource_id, serverUtilNumberValue(data.user_account_app_data_post_id))
                                        .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
const unlike = (app_id, resource_id, data) => user_account_app_data_post_like_service.unlike(app_id, resource_id, serverUtilNumberValue(data.user_account_app_data_post_id))
                                            .catch((/**@type{import('../../types.js').server_server_error}*/error)=>{throw error;});

export{ getUserPostsByUserId, getProfileUserPosts, getProfileStatLike, getProfileStatPost,
        /*ACCESS */
        getProfileUserPostDetail, createUserPost, updateUserPost, deleteUserPost, like, unlike};