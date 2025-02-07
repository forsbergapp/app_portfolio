/** @module server/db/dbModelUserAccount */

/**
 * @import {server_db_sql_result_user_account_getProfileDetail,
 *          server_db_common_result_delete,
 *          server_db_common_result_update,
 *          server_db_common_result_insert,
 *          server_db_sql_result_user_account_get,
 *          server_db_sql_result_user_account_getStatCountAdmin,
 *          server_db_sql_result_user_account_getProfileStat,
 *          server_db_sql_parameter_app_data_stat_post,
 *          server_db_sql_result_user_account_getProfileUser,
 *          server_server_response,
 *          server_db_sql_parameter_user_account} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('../db/common.js')} */
const { dbCommonExecute, dbCommonRecordError } = await import(`file://${process.cwd()}/server/db/common.js`);

/**
 * @name get
 * @description Get user
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_get[] }>}
 */                            
const get = async parameters =>dbCommonExecute(   parameters.app_id, 
                                            dbSql.USER_ACCOUNT_SELECT,
                                            {id: parameters.resource_id},
                                            null, 
                                            null);

/**
 * @name getProfile
 * @description Get user profile
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
*          resource_id:number|string|null,
*          ip:string,
*          user_agent:string,
*          data:{  name?:string|null,
*                  id?:string|null,
*                  search?:string|null,
*                  POST_ID?:string |null}}} parameters
* @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_getProfileUser[] }>}
*/
const getProfile = async parameters =>{
  /**@type{import('./fileModelIamUser.js')} */
  const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
  /**
   * Clear private data if private
   * @param {server_db_sql_result_user_account_getProfileUser[]} result_getProfileUser 
   * @returns {server_db_sql_result_user_account_getProfileUser[]}
   */
  const clear_private = result_getProfileUser =>
      result_getProfileUser.map(row=>{
          if (row.id ==parameters.resource_id){
              //profile of current logged in user should always be displayed
              row.private = null;
          }
          else
              if ((row.private==1 && row.friends==null) || parameters.data.search!=null){
                  //private and not friends or anonymous visit, remove stats
                  row.count_following = null;
                  row.count_followed = null;
                  row.count_likes = null;
                  row.count_liked = null;
              }
              else
                  if (row.private==1 && row.friends==1){
                      //private and friends, remove private
                      row.private = null;
                  }
          return row;
      });
  const result_getProfileUser = await  dbCommonExecute(parameters.app_id, 
                                          dbSql.USER_ACCOUNT_SELECT_PROFILE,
                                          {
                                              user_accound_id_current_user: serverUtilNumberValue(parameters.data.id),
                                              id: parameters.resource_id
                                          }
                                          ,
                                          null, 
                                          null)
                                          .then(result=>result.result
                                                          .map((/**@type{server_db_sql_result_user_account_getProfileUser}*/row)=>{
                                                              // get username, bio, private, user_level, avatar from iam_user
                                                              const user = fileModelIamUser.get(parameters.app_id, row.iam_user_id).result[0];
                                                              if (user.active==1 && user.private !=1 &&
                                                                  /**@ts-ignore */
                                                                  (user.username.indexOf((parameters.data.search!=''&parameters.data.search!=null)?parameters.data.search:user.username)>-1 ||
                                                                  /**@ts-ignore */
                                                                  user.username.indexOf((parameters.data.name!='' &&parameters.data.name!=null)?parameters.data.name:user.username)>-1)
                                                                  ){
                                                                  row.username    = user.username;
                                                                  row.bio         = user.bio;
                                                                  row.private     = user.private;
                                                                  row.user_level  = user.user_level;
                                                                  row.avatar      = user.avatar;
                                                                  return row;
                                                              }
                                                              
                                                          }))
                                          .catch(error=>{throw error;});  
  if (parameters.data.search){
      //searching, return result
      /**@type{import('./dbModelAppDataStat.js')} */
      const { post } = await import(`file://${process.cwd()}/server/db/dbModelAppDataStat.js`);
      /**@type{server_db_sql_parameter_app_data_stat_post} */
      const data_insert = {json_data:                                         {   search:             parameters.data.search ?? parameters.resource_id,
                                                                                  client_ip:          parameters.ip,
                                                                                  client_user_agent:  parameters.user_agent},
                          //if user logged is not logged in then save resource on app
                          app_id:                                             serverUtilNumberValue(parameters.data.id)?null:parameters.app_id,
                          user_account_id:                                    null,
                          //save user account if logged in else set null in both user account app columns
                          user_account_app_user_account_id:                   serverUtilNumberValue(parameters.data.id) ?? null,
                          user_account_app_app_id:                            serverUtilNumberValue(parameters.data.id)?parameters.app_id:null,
                          app_data_resource_master_id:                        null,
                          app_data_entity_resource_id:                        1,  //PROFILE_SEARCH
                          app_data_entity_resource_app_data_entity_app_id:    serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) ?? 0,
                          app_data_entity_resource_app_data_entity_id:        1   //COMMON
                          };
      return await post(parameters.app_id, data_insert).then(()=>{return {result:clear_private(result_getProfileUser), type:'JSON'};});
  }
  else
      if (result_getProfileUser[0]){
          //always save stat who is viewing, same user, none or someone else
          /**@type{import('./dbModelUserAccountView.js')} */
          const dbModelUserAccountView = await import(`file://${process.cwd()}/server/db/dbModelUserAccountView.js`);
          const data_body = { user_account_id:        serverUtilNumberValue(parameters.data.id),    //who views
                              user_account_id_view:   serverUtilNumberValue(parameters.data.POST_ID) ?? result_getProfileUser[0].id, //viewed account
                              client_ip:              parameters.ip,
                              client_user_agent:      parameters.user_agent};
          return await dbModelUserAccountView.post(parameters.app_id, data_body).then(()=>{return {result:clear_private(result_getProfileUser), type:'JSON'};});
      }
      else
          return result_getProfileUser.http?result_getProfileUser:dbCommonRecordError(parameters.app_id, 404);
};
/**
* @name getProfileStat
* @description Get profile stat
* @function
* @memberof ROUTE_REST_API
* @param {{app_id:number,
*          data:{statchoice?:string|null}}} parameters
* @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_getProfileStat[] }>}
*/
const getProfileStat = async parameters =>{
  /**@type{import('./fileModelIamUser.js')} */
  const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
  return dbCommonExecute(parameters.app_id, 
                          dbSql.USER_ACCOUNT_SELECT_PROFILE_STAT,
                                          {
                                              statchoice: serverUtilNumberValue(parameters.data?.statchoice),
                                              app_id: parameters.app_id
                                          },
                          null, 
                          null)
                          .then(result=>{return {result:result.result
                                                          .filter((/**@type{server_db_sql_result_user_account_getProfileUser}*/row)=>{
                                                              //add condition active and private
                                                              const user = fileModelIamUser.get(parameters.app_id, row.iam_user_id).result[0];
                                                              return user.active==1 && user.private !=1;
                                                          })              
                                                          .map((/**@type{server_db_sql_result_user_account_getProfileUser}*/row)=>{
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
 * @name getProfileDetail
 * @description Get user profile detail
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{detailchoice?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_getProfileDetail[] }>}
 */
 const getProfileDetail = async parameters =>{
    /**@type{import('./fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    return dbCommonExecute(parameters.app_id, 
                            dbSql.USER_ACCOUNT_SELECT_PROFILE_DETAIL,
                            {
                                user_account_id: parameters.resource_id,
                                detailchoice: serverUtilNumberValue(parameters.data?.detailchoice)
                            },
                            null, 
                            null)
                            .then(result=>{return {result:result.result
                                                        .filter((/**@type{server_db_sql_result_user_account_getProfileDetail}*/row)=>{
                                                            //add condition active and private
                                                            const user = fileModelIamUser.get(parameters.app_id, row.iam_user_id).result[0];
                                                            return user.active==1 && user.private !=1;
                                                        })              
                                                        .map((/**@type{server_db_sql_result_user_account_getProfileDetail}*/row)=>{
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
* @name getStatCountAdmin
* @description Get user stat
* @function
* @memberof ROUTE_REST_API
* @param {{app_id:number}}parameters
* @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_getStatCountAdmin[] }>}
*/
const getStatCountAdmin = parameters => 
    dbCommonExecute(parameters.app_id, 
                    dbSql.USER_ACCOUNT_SELECT_STAT_COUNT,
                    {},
                    null, 
                    null);

/**
* @name getIamUser
* @description Get user for given iam_user.id
* @function
* @memberof ROUTE_REST_API
* @param {{app_id:number,
*          iam_user_id:number}} parameters
* @returns {Promise.<server_server_response & {result?:server_db_sql_result_user_account_get[] }>}
*/                            
const getIamUser = async parameters =>dbCommonExecute(   parameters.app_id, 
                                          dbSql.USER_ACCOUNT_SELECT_IAM_USER,
                                          {iam_user_id: parameters.iam_user_id},
                                          null, 
                                          null);

/**
 * @name update
 * @description Updates user
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id :number,
*          resource_id:number,
*          data:{  iam_user_id:number|null}}} parameters
* @returns {Promise.<server_server_response & {result?:server_db_common_result_update }>}
*/
const update = async parameters =>dbCommonExecute(parameters.app_id, 
                               dbSql.USER_ACCOUNT_UPDATE,
                               {
                                   iam_user_id:parameters.data.iam_user_id,
                                   id: parameters.resource_id
                               },
                               null, 
                               null);

/**
 * @name post
 * @description Create user
 * @function
 * @param {number} app_id 
 * @param {server_db_sql_parameter_user_account} data 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>
    dbCommonExecute(app_id, 
                    dbSql.USER_ACCOUNT_INSERT,
                    {
                        iam_user_id:data.iam_user_id,
                        DB_RETURN_ID:'id'
                    },
                    null, 
                    null);

                    /**
 * @name userDelete
 * @description Delete user
 * @function
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_delete }>}
 */
const deleteUser = async (app_id, id) =>
    dbCommonExecute(app_id, 
                    dbSql.USER_ACCOUNT_DELETE,
                    {id: id},
                    null, 
                    null);

export {get, 
        getProfile, getProfileStat,getProfileDetail,
        getStatCountAdmin,
        getIamUser,
        post,
        update,
        deleteUser };
