/** @module server/db/dbModelUserAccountAppDataPost */

/**
 * @import {server_server_response,
 *          server_db_common_result_delete,
 *          server_db_common_result_update,
 *          server_db_common_result_insert,
 *          server_db_sql_result_user_account_app_data_post_getProfileUserPostDetail,
 *          server_db_sql_result_user_account_app_data_post_getProfileStatPost,
 *          server_db_sql_result_user_account_data_post_getProfileStatLike,
 *          server_db_sql_result_user_account_app_data_post_getProfileUserPosts,
 *          server_db_sql_result_user_account_app_data_post_getUserPostsByUserId,
 *          server_db_sql_result_user_account_app_data_post_getUserPost} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);


/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('../db/common.js')} */
const { dbCommonExecute, dbCommonRecordError } = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name getUserPost
 * @description Get user post
 * @function
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_app_data_post_getUserPost[] }>}
 */
const getUserPost = async (app_id, id) => 
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_ID, 
                        {id: id});
/**
 * @name getUserPostsByUserId
 * @description Get user post by id
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data_app_id:number|null}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_app_data_post_getUserPostsByUserId[] }>}
 */
const getUserPostsByUserId = async parameters =>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER, 
                        {
                            user_account_id:    parameters.resource_id,
                            app_id:             parameters.data_app_id
                        })
                        .then(result=>(result.http ||result.result)?result:dbCommonRecordError(parameters.app_id, 404));
                                
/**
 * @name getProfileUserPosts
 * @description Get user profile post
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{id_current_user?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_app_data_post_getProfileUserPosts[] }>}
 */
const getProfileUserPosts = async parameters =>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE, 
                        {
                            user_account_id_current: serverUtilNumberValue(parameters.data?.id_current_user),
                            user_account_id: parameters.resource_id,
                            app_id: parameters.app_id
                            })
                        .then(result=>(result.http ||result.result)?result:dbCommonRecordError(parameters.app_id, 404));
/**
 * @name getProfileStatLike
 * @description Get profile stat like
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_data_post_getProfileStatLike[] }>}
 */
 const getProfileStatLike = async parameters =>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_STAT_LIKE, 
                        {
                            id: parameters.resource_id,
                            app_id: parameters.app_id
                        })
                        .then(result=>(result.http ||result.result[0])?result:dbCommonRecordError(parameters.app_id, 404));
/**
 * @name getProfileStatPost
 * @description Get profile post stat
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *         data:{statchoice?:string|null}
 *       }} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_app_data_post_getProfileStatPost[] }>}
 */
const getProfileStatPost = async parameters =>
    {
        if (parameters.data.statchoice==null)
            return dbCommonRecordError(parameters.app_id, 400);
        else{
            /**@type{import('./fileModelIamUser.js')} */
            const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
            return dbCommonExecute(parameters.app_id, 
                                    dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_STAT_POST, 
                                    {
                                        app_id: parameters.app_id,
                                        statchoice: serverUtilNumberValue(parameters.data?.statchoice)
                                    })
                                    .then(result=>{return {result:result.result
                                                                    .filter((/**@type{server_db_sql_result_user_account_app_data_post_getProfileStatPost}*/row)=>{
                                                                        //add condition active and private
                                                                        const user = fileModelIamUser.get(parameters.app_id, row.iam_user_id).result[0];
                                                                        return user.active==1 && user.private !=1;
                                                                    })              
                                                                    .map((/**@type{server_db_sql_result_user_account_app_data_post_getProfileStatPost}*/row)=>{
                                                                        //add avatar and username from iam_user
                                                                        const user = fileModelIamUser.get(parameters.app_id, row.iam_user_id).result[0];
                                                                        row.username    = user.username;
                                                                        row.avatar      = user.avatar;
                                                                        return row;
                                                                    }),
                                                            type:'JSON'};
                                                    });
        }
    };

/**
 * @name getProfileUserPostDetail
 * @description Get profile user detail post
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{detailchoice?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_app_data_post_getProfileUserPostDetail[] }>}
 */
const getProfileUserPostDetail = async parameters =>{
    /**@type{import('./fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    return dbCommonExecute(parameters.app_id, 
                            dbSql.USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_DETAIL, 
                            {
                                user_account_id: parameters.resource_id,
                                app_id: parameters.app_id,
                                detailchoice: serverUtilNumberValue(parameters.data?.detailchoice)
                            })
                            .then(result=>{return {result:result.result
                                                            .filter((/**@type{server_db_sql_result_user_account_app_data_post_getProfileStatPost}*/row)=>{
                                                                //add condition active and private
                                                                const user = fileModelIamUser.get(parameters.app_id, row.iam_user_id).result[0];
                                                                return user.active==1 && user.private !=1;
                                                            })              
                                                            .map((/**@type{server_db_sql_result_user_account_app_data_post_getProfileStatPost}*/row)=>{
                                                                //add avatar and username from iam_user
                                                                const user = fileModelIamUser.get(parameters.app_id, row.iam_user_id).result[0];
                                                                row.username    = user.username;
                                                                row.avatar      = user.avatar;
                                                                return row;
                                                            }),
                                                    type:'JSON'};
                                            });
};
/**
 * @name createUserPost
 * @description Create user post
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  initial:number,
 *                  description:string,
 *                  json_data:*,
 *                  data_app_id:number,
 *                  user_account_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:{id:number|null,data: server_db_common_result_insert|null} }>}
 */
const createUserPost = parameters => {
    return new Promise((resolve)=>{
        const create = ()=> {
                dbCommonExecute(parameters.app_id, 
                                dbSql.USER_ACCOUNT_APP_DATA_POST_INSERT, 
                                {
                                    description: parameters.data?.description,
                                    json_data: JSON.stringify(parameters.data?.json_data),
                                    user_account_id: serverUtilNumberValue(parameters.data?.user_account_id),
                                    app_id: parameters.data.data_app_id,
                                    DB_RETURN_ID:'id',
                                    DB_CLOB: ['json_data']
                                })
                                .then(result=>resolve({ result:{
                                                                id: result.result.insertId,
                                                                data: result.result
                                                                },
                                                        type:'JSON'}));
                                
        };
        //Check if first time
        if (serverUtilNumberValue(parameters.data?.initial)==1){
            getUserPostsByUserId({  app_id:parameters.app_id, 
                                    data_app_id:parameters.data.data_app_id, 
                                    resource_id:serverUtilNumberValue(parameters.data?.user_account_id)})
            .then(result=>{
                if (result.result)
                    if (result.result.length==0){
                        //no user settings found, ok to create initial user setting
                        create();
                    }
                    else
                        resolve({result:{
                                        id: null,
                                        data: null
                                        },
                                type:'JSON'});
                else
                    resolve(result);
            });
        }
        else
            create();
    });
	
};
/**
 * @name updateUserPost
 * @description Update user post
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  description:string,
 *                  json_data:string,
 *                  user_account_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
 */
const updateUserPost = parameters =>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_UPDATE, 
                        {
                            description: parameters.data?.description,
                            json_data: JSON.stringify(parameters.data?.json_data),
                            user_account_id: serverUtilNumberValue(parameters.data?.user_account_id),
                            app_id: parameters.app_id,
                            id: parameters.resource_id,
                            DB_CLOB: ['json_data']
                        })
                        .then(result=>(result.http ||result.result)?result:dbCommonRecordError(parameters.app_id, 404));
/**
 * @name deleteUserPost
 * @description Delete user post
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{  user_account_id:number}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteUserPost = parameters =>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_APP_DATA_POST_DELETE, 
                        {   
                            id: parameters.resource_id,
                            user_account_id: serverUtilNumberValue(parameters.data?.user_account_id),
                            app_id:parameters.app_id
                        })
                        .then(result=>(result.http ||result.result)?result:dbCommonRecordError(parameters.app_id, 404));

export{ getUserPost, getUserPostsByUserId, getProfileUserPosts, getProfileStatLike, getProfileStatPost,
        getProfileUserPostDetail, createUserPost, updateUserPost, deleteUserPost};