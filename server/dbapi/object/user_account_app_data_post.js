/** @module server/dbapi/object/user_account_app_data_post */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_data_post.service.js`);
const user_account_app_data_post_like_service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_data_post_like.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {Types.error} res
 */
const getUserPostsByUserId = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getUserPostsByUserId(app_id, getNumberValue(query.get('user_account_id')))
        .then((/**@type{Types.db_result_user_account_app_data_post_getUserPostsByUserId[]}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {Types.res} res
 */
const getProfileUserPost = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUserPost(app_id, getNumberValue(query.get('id')))
        .then((/**@type{Types.db_result_user_account_app_data_post_getProfileUserPost[]}*/result)=>{
            if (result[0])
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {Types.res} res
 */
const getProfileUserPosts =(app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUserPosts(app_id, getNumberValue(query.get('id')), getNumberValue(query.get('id_current_user')))
        .then((/**@type{Types.db_result_user_account_app_data_post_getProfileUserPosts[]}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {Types.res} res
 */
const getProfileTopPost = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileTopPost(app_id, getNumberValue(query.get('statchoice')))
        .then((/**@type{Types.db_result_user_account_app_data_post_getProfileTopPost[]}*/result)=>{
            if (result)
                resolve(result); 
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} res
 */
const getProfileUserPostDetail = (app_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getProfileUserPostDetail(app_id, getNumberValue(query.get('user_account_id')), getNumberValue(query.get('detailchoice')))
        .then((/**@type{Types.db_result_user_account_app_data_post_getProfileUserPostDetail[]}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
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
        /**@type{Types.db_parameter_user_account_app_data_post_createUserPost} */
        const data_create = {	description:		data.description,
                                json_data: 		    data.json_data,
                                user_account_id:	getNumberValue(data.user_account_id)
                            };
        const call_service = ()=> {
            service.createUserPost(app_id, data_create)
            .then((/**@type{Types.db_result_user_account_app_data_post_createUserPost}*/result)=>{
                resolve({
                    id: result.insertId,
                    data: result
                });
            })
            .catch((/**@type{Types.error}*/error)=>reject(error));
        };
        //Check if first time
        if (getNumberValue(query.get('initial'))==1){
            service.getUserPostsByUserId(app_id, getNumberValue(data.user_account_id))
            .then((/**@type{Types.db_result_user_account_app_data_post_getUserPostsByUserId[]}*/result)=>{
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
            .catch((/**@type{Types.error}*/error)=>reject(error));
        }
        else
            call_service();
    });
	
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data 
 * @param {Types.res} res
 */
const updateUserPost = (app_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{Types.db_parameter_user_account_app_data_post_updateUserPost} */
        const data_update = {	description:		data.description,
                                json_data: 		    data.json_data,
                                user_account_id:	getNumberValue(data.user_account_id)};
        service.updateUserPost(app_id, data_update, getNumberValue(query.get('PUT_ID')))
        .then((/**@type{Types.db_result_user_account_app_data_post_updateUserPost}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {Types.res} res
 */
const deleteUserPost = (app_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.deleteUserPost(app_id, getNumberValue(query.get('DELETE_ID')))
        .then((/**@type{Types.db_result_user_account_app_data_post_deleteUserPost}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data
 */
const like = (app_id, query, data) => user_account_app_data_post_like_service.like(app_id, getNumberValue(query.get('user_account_id')), getNumberValue(data.user_account_app_data_post_id))
                                        .catch((/**@type{Types.error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data
 */
const unlike = (app_id, query, data) => user_account_app_data_post_like_service.unlike(app_id, getNumberValue(query.get('user_account_id')), getNumberValue(data.user_account_app_data_post_id))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});

export{ getUserPostsByUserId, getProfileUserPost, getProfileUserPosts, getProfileTopPost,
        /*ACCESS */
        getProfileUserPostDetail, createUserPost, updateUserPost, deleteUserPost, like, unlike};