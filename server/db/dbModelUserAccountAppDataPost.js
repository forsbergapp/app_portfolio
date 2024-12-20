/** @module server/db/dbModelUserAccountAppDataPost */

/**
 * @import {server_db_sql_result_user_account_app_data_post_deleteUserPost,
 *          server_db_sql_result_user_account_app_data_post_updateUserPost,
 *          server_db_sql_result_user_account_app_data_post_createUserPost,
 *          server_db_sql_result_user_account_app_data_post_getProfileUserPostDetail,
 *          server_db_sql_result_user_account_app_data_post_getProfileStatPost,
 *          server_db_sql_result_user_account_data_post_getProfileStatLike,
 *          server_db_sql_result_user_account_app_data_post_getProfileUserPosts,
 *          server_server_res,
 *          server_db_sql_result_user_account_app_data_post_getUserPostsByUserId,
 *          server_server_error,
 *          server_db_sql_result_user_account_app_data_post_getUserPost} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);


/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * Get user post
 * @function
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_getUserPost[]>}
 */
const getUserPost = async (app_id, id) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_ID, 
                        {id: id},
                        null, 
                        null));
/**
 * Get user post by id
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id
 * @param {*} query 
 * @param {server_server_error|null} res
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_getUserPostsByUserId[]>}
 */
const getUserPostsByUserId = (app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER, 
                            {
                                user_account_id: resource_id,
                                app_id: app_id
                            },
                            null, 
                            null))
        .then(result=>{
            if (result)
                resolve(result);
            else
                if (res)
                    import(`file://${process.cwd()}/server/db/common.js`)
                    .then((/**@type{import('./common.js')} */{dbCommonRecordNotFound}) => {
                        dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                    });
                else
                    resolve(result);
        });
    });
};
/**
 * Get user profile post
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query
 * @param {server_server_res} res
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_getProfileUserPosts[]>}
 */
const getProfileUserPosts =(app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE, 
                            {
                                user_account_id_current: serverUtilNumberValue(query.get('id_current_user')),
                                user_account_id: resource_id,
                                app_id: app_id
                                },
                            null, 
                            null))
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('./common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * Get profile stat like
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query
 * @param {server_server_res} res
 * @returns {Promise.<server_db_sql_result_user_account_data_post_getProfileStatLike[]>}
 */
 const getProfileStatLike = (app_id, resource_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_STAT_LIKE, 
                            {
                                id: resource_id,
                                app_id: app_id
                            },
                            null, 
                            null))
        .then(result=>{
            if (result[0])
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('./common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * Get profile post stat
 * @function
 * @param {number} app_id 
 * @param {*} query
 * @param {server_server_res} res
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_getProfileStatPost[]>}
 */
const getProfileStatPost = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_STAT_POST, 
                            {
                                app_id: app_id,
                                statchoice: serverUtilNumberValue(query.get('statchoice'))
                            },
                            null, 
                            null))
        .then(result=>{
            if (result)
                resolve(result); 
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('./common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * Get profile user detail post
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {*} res
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_getProfileUserPostDetail[]>}
 */
const getProfileUserPostDetail = (app_id, resource_id, query, res) => {
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_DETAIL, 
                            {
                                user_account_id: resource_id,
                                app_id: app_id,
                                detailchoice: serverUtilNumberValue(query.get('detailchoice'))
                            },
                            null, 
                            null))
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('./common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * Create user post
 * @function
 * @param {number} app_id
 * @param {*} query
 * @param {*} data
 * @returns {Promise.<{ id:number|null,
 *                      data: server_db_sql_result_user_account_app_data_post_createUserPost|null}>}
 */
const createUserPost = (app_id, query, data) => {
    return new Promise((resolve, reject)=>{
        const create = ()=> {
            import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                dbCommonExecute(app_id, 
                                dbSql.USER_ACCOUNT_APP_DATA_POST_INSERT, 
                                {
                                    description: data.description,
                                    json_data: JSON.stringify(data.json_data),
                                    user_account_id: serverUtilNumberValue(data.user_account_id),
                                    app_id: app_id,
                                    DB_RETURN_ID:'id',
                                    DB_CLOB: ['json_data']
                                },
                                null, 
                                null))
            .then(result=>{
                resolve({
                    id: result.insertId,
                    data: result
                });
            })
            .catch((/**@type{server_server_error}*/error)=>reject(error));
        };
        //Check if first time
        if (serverUtilNumberValue(query.get('initial'))==1){
            getUserPostsByUserId(app_id, serverUtilNumberValue(data.user_account_id), query,null)
            .then(result=>{
                if (result.length==0){
                    //no user settings found, ok to create initial user setting
                    create();
                }
                else
                    resolve({
                        id: null,
                        data: null
                    });
            })
            .catch((/**@type{server_server_error}*/error)=>reject(error));
        }
        else
            create();
    });
	
};
/**
 * Update user post
 * @function
 * @param {number} app_id 
 * @param {*} resource_id
 * @param {*} query 
 * @param {*} data 
 * @param {server_server_res} res
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_updateUserPost>}
 */
const updateUserPost = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_APP_DATA_POST_UPDATE, 
                            {
                                description: data.description,
                                json_data: JSON.stringify(data.json_data),
                                user_account_id: serverUtilNumberValue(data.user_account_id),
                                app_id: app_id,
                                id: resource_id,
                                DB_CLOB: ['json_data']
                            },
                            null, 
                            null))
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('./common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * Delete user post
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} data
 * @param {*} query 
 * @param {server_server_res} res
 * @returns {Promise.<server_db_sql_result_user_account_app_data_post_deleteUserPost>}
 */
const deleteUserPost = (app_id, resource_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_APP_DATA_POST_DELETE, 
                            {   id: resource_id,
                                user_account_id: serverUtilNumberValue(data.user_account_id),
                                app_id:app_id},
                            null, 
                            null))
        .then(result=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('./common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};

export{ getUserPost, getUserPostsByUserId, getProfileUserPosts, getProfileStatLike, getProfileStatPost,
        getProfileUserPostDetail, createUserPost, updateUserPost, deleteUserPost};