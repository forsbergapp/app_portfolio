/** @module server/db/components/user_account_app_data_post */

/**@type{import('../sql/user_account_app_data_post.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/user_account_app_data_post.service.js`);

/**@type{import('../sql/user_account_app_data_post_like.service.js')} */
const user_account_app_data_post_like_service = await import(`file://${process.cwd()}/server/db/sql/user_account_app_data_post_like.service.js`);
/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {import('../../../types.js').error} res
 */
const getUserPostsByUserId = (app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getUserPostsByUserId(app_id, resource_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_app_data_post_getUserPostsByUserId[]}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query
 * @param {import('../../../types.js').res} res
 */
const getProfileUserPosts =(app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUserPosts(app_id, resource_id, getNumberValue(query.get('id_current_user')))
        .then((/**@type{import('../../../types.js').db_result_user_account_app_data_post_getProfileUserPosts[]}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query
 * @param {import('../../../types.js').res} res
 */
 const getProfileStatLike = (app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileStatLike(app_id, resource_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_data_post_getProfileStatLike[]}*/result)=>{
            if (result[0])
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {import('../../../types.js').res} res
 */
const getProfileStatPost = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileStatPost(app_id, getNumberValue(query.get('statchoice')))
        .then((/**@type{import('../../../types.js').db_result_user_account_app_data_post_getProfileStatPost[]}*/result)=>{
            if (result)
                resolve(result); 
            else
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
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
        service.getProfileUserPostDetail(app_id, resource_id, getNumberValue(query.get('detailchoice')))
        .then((/**@type{import('../../../types.js').db_result_user_account_app_data_post_getProfileUserPostDetail[]}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
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
        /**@type{import('../../../types.js').db_parameter_user_account_app_data_post_createUserPost} */
        const data_create = {	description:		data.description,
                                json_data: 		    data.json_data,
                                user_account_id:	getNumberValue(data.user_account_id)
                            };
        const call_service = ()=> {
            service.createUserPost(app_id, data_create)
            .then((/**@type{import('../../../types.js').db_result_user_account_app_data_post_createUserPost}*/result)=>{
                resolve({
                    id: result.insertId,
                    data: result
                });
            })
            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
        };
        //Check if first time
        if (getNumberValue(query.get('initial'))==1){
            service.getUserPostsByUserId(app_id, getNumberValue(data.user_account_id))
            .then((/**@type{import('../../../types.js').db_result_user_account_app_data_post_getUserPostsByUserId[]}*/result)=>{
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
            .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
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
 * @param {import('../../../types.js').res} res
 */
const updateUserPost = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{import('../../../types.js').db_parameter_user_account_app_data_post_updateUserPost} */
        const data_update = {	description:		data.description,
                                json_data: 		    data.json_data,
                                user_account_id:	getNumberValue(data.user_account_id)};
        service.updateUserPost(app_id, data_update, resource_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_app_data_post_updateUserPost}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @param {*} query 
 * @param {import('../../../types.js').res} res
 */
const deleteUserPost = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        service.deleteUserPost(app_id, resource_id, data.user_account_id)
        .then((/**@type{import('../../../types.js').db_result_user_account_app_data_post_deleteUserPost}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.service.js`)
                .then((/**@type{import('../common.service.js')} */{record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
const like = (app_id, resource_id, data) => user_account_app_data_post_like_service.like(app_id, resource_id, getNumberValue(data.user_account_app_data_post_id))
                                        .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 */
const unlike = (app_id, resource_id, data) => user_account_app_data_post_like_service.unlike(app_id, resource_id, getNumberValue(data.user_account_app_data_post_id))
                                            .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

export{ getUserPostsByUserId, getProfileUserPosts, getProfileStatLike, getProfileStatPost,
        /*ACCESS */
        getProfileUserPostDetail, createUserPost, updateUserPost, deleteUserPost, like, unlike};