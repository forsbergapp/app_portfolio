/** @module server/db/dbModelUserAccount */

/**
 * @import {server_db_sql_result_user_account_getDemousers,
 *          server_db_sql_result_user_account_getProfileDetail,
 *          server_db_sql_result_user_account_deleteUser,
 *          server_db_sql_result_user_account_checkPassword,
 *          server_db_sql_result_user_account_getUserByUserId,
 *          server_db_sql_result_user_account_updateUserCommon,
 *          server_db_sql_result_user_account_updateUserLocal,
 *          server_db_sql_parameter_user_account_event_insertUserEvent,
 *          server_db_sql_result_user_account_getStatCountAdmin,
 *          server_db_sql_result_user_account_getUsersAdmin,
 *          server_db_sql_result_user_account_updateAdmin,
 *          server_db_sql_result_user_account_getProfileStat, 
 *          server_server_error,
 *          server_db_sql_parameter_app_data_stat_post,
 *          server_db_sql_result_user_account_getProfileUser,server_server_res,
 *          server_db_sql_result_user_account_getEmailUser,
 *          server_db_sql_result_user_account_activateUser,
 *          server_db_sql_result_user_account_create,
 *          server_db_sql_result_user_account_updateSigninProvider,
 *          server_db_sql_result_user_account_updateUserVerificationCode,
 *          server_db_sql_result_user_account_providerSignIn,
 *          server_db_sql_parameter_user_account_userLogin,
 *          server_db_sql_result_user_account_userLogin,
 *          server_db_sql_parameter_user_account_updateUserCommon, server_db_sql_parameter_user_account_updatePassword,
 *          server_db_sql_parameter_user_account_create,
 * 			server_db_sql_parameter_user_account_updateUserLocal,
 *         	server_db_sql_parameter_user_account_updateAdmin} from '../types.js'
 */


/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('../iam.service.js')} */
const { iamUserGetLastLogin } = await import(`file://${process.cwd()}/server/iam.service.js`);

/**@type{import('../db/common.js')} */
const { dbCommonCheckedError } = await import(`file://${process.cwd()}/server/db/common.js`);

/**@type{import('./dbModelUserAccountEvent.js')} */
const dbModelUserAccountEvent = await import(`file://${process.cwd()}/server/db/dbModelUserAccountEvent.js`);

/**
 * @name set_password
 * @description Sets password using defined encryption
 * @function
 * @param {string|null} password 
 * @returns {Promise.<string|null>}
 */
const set_password = async (password) =>{
	/**@type{import('../security.js')} */
	const {securityPasswordCreate}= await import(`file://${process.cwd()}/server/security.js`);
	return password==null?null:await securityPasswordCreate(password);
};
/**
 * @name data_validation_password
 * @description Checks password between 10 and 100 characters
 * @function
 * @param {server_db_sql_parameter_user_account_updatePassword} data 
 * @returns {object|null}
 */
const data_validation_password = (data) => {
    if (data.password_new == null || data.password_new.length < 10 || data.password_new.length > 100){
        //'Password 10 - 100 characters'
		return {'errorNum' : 20106};
    }
    else
        return null;
};

/**
 * @name data_validation_common
 * @description Common validation logic
 * @function
 * @param {server_db_sql_parameter_user_account_updateUserCommon} data 
 * @returns {object|null}
 */
 const data_validation_common = data => {
	data.username = data.username ?? null;
	data.bio = data.bio ?? null;
	if (data.username != null && (data.username.length < 5 || data.username.length > 100)){
		//'username 5 - 100 characters'
		return {'errorNum' : 20100};
	}
	else
		if (data.username != null &&
			(data.username.indexOf(' ') > -1 || 
			data.username.indexOf('?') > -1 ||
			data.username.indexOf('/') > -1 ||
			data.username.indexOf('+') > -1 ||
			data.username.indexOf('"') > -1 ||
			data.username.indexOf('\'\'') > -1)){
			//'not valid username'
			return {'errorNum' : 20101};
		}
		else
			return null;
 };
/**
 * @name data_validation
 * @description Data validation
 * @function
 * @param {	server_db_sql_parameter_user_account_create|
 * 			server_db_sql_parameter_user_account_updateUserLocal|
 *         	server_db_sql_parameter_user_account_updateAdmin} data 
 * @returns {object|null}
 */
const data_validation = data => {
	data.username = data.username ?? null;
	data.bio = data.bio ?? null;
	data.password_reminder = data.password_reminder ?? null;
	data.email_unverified = data.email_unverified ?? null;
	data.verification_code = data.verification_code ?? null;
	data.provider_id = data.provider_id ?? null;
	
	if (data.provider_id != null){
		data.password = null;
		data.password_new = null;
		data.password_reminder = null;
		data.email = null;
		data.email_unverified = null;
		data.avatar = null;
		data.verification_code = null;
	}
    if (data.username != null && (data.username.length < 5 || data.username.length > 100)){
		//'username 5 - 100 characters'
		return {'errorNum' : 20100};
	}
	else 
		if (data.username != null &&
			(data.username.indexOf(' ') > -1 || 
			data.username.indexOf('?') > -1 ||
			data.username.indexOf('/') > -1 ||
			data.username.indexOf('+') > -1 ||
			data.username.indexOf('"') > -1 ||
			data.username.indexOf('\'\'') > -1)){
			//'not valid username'
			return {'errorNum' : 20101};
		}
		else
			if (data.bio != null && data.bio.length > 100){
				//'bio max 100 characters'
				return {'errorNum' : 20102};
			}
			else 
				if (data.email != null && data.email.length > 100){
					//'email max 100 characters'
					return {'errorNum' : 20103};
				}
				else
					if (data.password_reminder != null && data.password_reminder.length > 100){
						//'reminder max 100 characters'
						return {'errorNum' : 20104};
					}
					else{
						//Email validation: sequence of non-whitespace characters, followed by an @, followed by more non-whitespace characters, a dot, and more non-whitespace.
						/**
						 * 
						 * @param {string} email 
						 * @returns 
						 */
						const email_ok = email =>{
							const email_regexp = /[^\s@]+@[^\s@]+\.[^\s@]+/gi;
							try {
								/**@ts-ignore */
								return email == email.match(email_regexp)[0];	
							} catch (error) {
								return false;
							}
							
						};
						if (data.email != null && data.email.slice(-10) != '@localhost' && email_ok(data.email)==false){
							//'not valid email' (ignore emails that ends with '@localhost')
							return {'errorNum' : 20105};
						}
						else
							if (data.email_unverified != null && email_ok(data.email_unverified)==false){
								//'not valid email'
								return {'errorNum' : 20105};
							}
							else
								if (data.provider_id == null && (data.username == null || (data.password_new??data.admin==1?data.admin:data.password)==null || data.email==null)){
									//'Username, password and email are required'
									return {'errorNum' : 20107};
								}
								else
									if (data.provider_id == null && ((data.admin==1 && data.password_new != null) || data.admin==0))
										return data_validation_password({password_new: data.password_new??data.password, auth:null});
									else
										return null;
					}
};

/**
 * @name userGetUsername
 * @description Get username
 * @function
 * @param {number} app_id
 * @param {server_db_sql_parameter_user_account_userLogin} data
 * @returns {Promise.<server_db_sql_result_user_account_userLogin[]>}
 */
const userGetUsername = (app_id, data) =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_SELECT_USERNAME,
                        {
                            username: data.username
                        },
                        null, 
                        null));

/**
 * @name userGetProvider
 * @description Get user provider
 * @function
 * @param {number} app_id 
 * @param {number|null} identity_provider_id 
 * @param {number} search_id
 * @returns {Promise.<server_db_sql_result_user_account_providerSignIn[]>}
 */
const userGetProvider = async (app_id, identity_provider_id, search_id) =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_SELECT_PROVIDER,
                        {
                            provider_id: search_id,
                            identity_provider_id: identity_provider_id
                        },
                        null, 
                        null));
/**
 * @name updateUserVerificationCode
 * @description Update verification code
 * @function
 * @param {number} app_id 
 * @param {number} id 
 * @param {string} verification_code 
 * @returns {Promise.<server_db_sql_result_user_account_updateUserVerificationCode>}
 */
const updateUserVerificationCode = async (app_id, id, verification_code) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_UPDATE_VERIFICATION_CODE,
                        {
                            verification_code: verification_code,
                            id: id   
                        },
                        null, 
                        null));

/**
 * @name userUpdateProvider
 * @description Update user provider
 * @function
 * @param {number} app_id 
 * @param {number} id 
 * @param {server_db_sql_parameter_user_account_create} data
 * @returns {Promise.<server_db_sql_result_user_account_updateSigninProvider>}
 */
const userUpdateProvider = async (app_id, id, data) => {
    const error_code = data_validation(data);
    if (error_code==null)
        return import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_UPDATE_PROVIDER,
                            {
                                identity_provider_id: data.identity_provider_id,
                                provider_id: data.provider_id,
                                provider_first_name: data.provider_first_name,
                                provider_last_name: data.provider_last_name,
                                provider_image: data.provider_image,
                                provider_image_url: data.provider_image_url,
                                provider_email: data.provider_email,
                                id: id,
                                DB_CLOB: ['provider_image']
                            },
                            null, 
                            null));
    else
        throw error_code;
};

/**
 * @name userPost
 * @description Create user
 * @function
 * @param {number} app_id 
 * @param {server_db_sql_parameter_user_account_create} data 
 * @returns {Promise.<server_db_sql_result_user_account_create>}
 */
const userPost = async (app_id, data) =>{ 
    const error_code = data_validation(data);
    if (error_code==null)
        return import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            set_password(data.password_new)
            .then(password=>dbCommonExecute(app_id, 
                                            dbSql.USER_ACCOUNT_INSERT,
                                            {
                                                bio: data.bio,
                                                private: data.private,
                                                user_level: data.user_level,
                                                username: data.username,
                                                password_new: password,
                                                password_reminder: data.password_reminder,
                                                email: data.email,
                                                avatar: data.avatar,
                                                verification_code: data.verification_code,
                                                active: data.active,
                                                identity_provider_id: data.identity_provider_id,
                                                provider_id: data.provider_id,
                                                provider_first_name: data.provider_first_name,
                                                provider_last_name: data.provider_last_name,
                                                provider_image: data.provider_image,
                                                provider_image_url: data.provider_image_url,
                                                provider_email: data.provider_email,
                                                DB_RETURN_ID:'id',
                                                DB_CLOB: ['avatar', 'provider_image']
                                            },
                                            null, 
                                            null)));
    else
        throw error_code;
};

/**
 * @name userUpdateActivate
 * @description Update user activate
 * @function
 * @param {number} app_id 
 * @param {number} id 
 * @param {number|null} verification_type 
 * @param {string} verification_code 
 * @param {string|null} auth 
 * @returns {Promise.<server_db_sql_result_user_account_activateUser>}
 */
const userUpdateActivate = async (app_id, id, verification_type, verification_code, auth) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_UPDATE_ACTIVATE,
                        {
                            auth: auth,
                            verification_type: verification_type,
                            id: id,
                            verification_code: verification_code
                        },
                        null, 
                        null));
    
/**
 * @name userGetEmail
 * @description Get user email
 * @function
 * @param {number} app_id 
 * @param {string} email 
 * @returns {Promise.<server_db_sql_result_user_account_getEmailUser[]>}
 */
const userGetEmail = async (app_id, email) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_SELECT_EMAIL,
                        {
                            email: email
                        },
                        null, 
                        null));

/**
 * @name getProfile
 * @description Get user profile
 * @function
 * @param {{app_id:Number,
 *          resource_id:number|null,
 *          ip:string,
 *          user_agent:string,
 *          data:{  resource_id_name:string|null,
 *                  id?:string|null,
 *                  search?:string|null,
 *                  client_latitude?:string|null,
 *                  client_longitude?:string|null,
 *                  POST_ID?:string |null},
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_getProfileUser[]>}
 */
const getProfile = parameters =>{
    return new Promise((resolve, reject)=>{
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
        /**
         * @param {string} search
         */
        const user_where = search =>{
            switch (true){
                case (search!='' && search != null):{
                    return 'u.username LIKE :user_value OR u.provider_first_name LIKE :user_value';
                }
                case (parameters.data.resource_id_name!='' && parameters.data.resource_id_name != null):{
                    return 'u.username = :user_value';
                }
                case (parameters.resource_id != null):{
                    return 'u.id = :user_value';
                }
                default:{
                    return '1=2';
                }
            }
        };
        /**
         * @param {string} search
         */
        const user_where_value = search =>{
            switch (true){
                case (search!='' && search != null):{
                    return `${search}%`;
                }
                case (parameters.data.resource_id_name!='' && parameters.data.resource_id_name != null):{
                    return parameters.data.resource_id_name;
                }
                case (parameters.resource_id != null):{
                    return parameters.resource_id;
                }
                default:{
                    return null;
                }
            }
        };
        //resource id can be number, string or empty if searching
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(parameters.app_id, 
                            dbSql.USER_ACCOUNT_SELECT_PROFILE
                            .replace('<USER_WHERE/>',user_where(parameters.data.search ??'')),
                            {
                                user_accound_id_current_user: serverUtilNumberValue(parameters.data.id),
                                user_value: user_where_value(parameters.data.search??'')
                            },
                            null, 
                            null))
        .then(result_getProfileUser=>{
            if (parameters.data.search){
                //searching, return result
                import(`file://${process.cwd()}/server/db/dbModelAppDataStat.js`)
                .then((/**@type{import('./dbModelAppDataStat.js')} */{ post }) => {
                    /**@type{server_db_sql_parameter_app_data_stat_post} */
                    const data_insert = {json_data:                                         {   search:             parameters.data.search ?? parameters.resource_id ?? parameters.data.resource_id_name,
                                                                                                client_ip:          parameters.ip,
                                                                                                client_user_agent:  parameters.user_agent,
                                                                                                client_longitude:   parameters.data.client_longitude,
                                                                                                client_latitude:    parameters.data.client_latitude},
                                        //if user logged not logged in then save resource on app
                                        app_id:                                             serverUtilNumberValue(parameters.data.id)?null:parameters.app_id,
                                        user_account_id:                                    null,
                                        //save user account if logged in else set null in both user account app columns
                                        user_account_app_user_account_id:                   serverUtilNumberValue(parameters.data.id) ?? null,
                                        user_account_app_app_id:                            serverUtilNumberValue(parameters.data.id)?parameters.app_id:null,
                                        app_data_resource_master_id:                        null,
                                        app_data_entity_resource_id:                        1,  //PROFILE_SEARCH
                                        app_data_entity_resource_app_data_entity_app_id:    serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) ?? 0,
                                        app_data_entity_resource_app_data_entity_id:        0   //COMMON
                                        };
                    post(parameters.app_id, data_insert)
                    .then(()=>{
                        resolve(clear_private(result_getProfileUser));
                    })
                    .catch((/**@type{server_server_error}*/error)=>reject(error));
                });
            }
            else
                if (result_getProfileUser[0]){
                    //always save stat who is viewing, same user, none or someone else
                    import(`file://${process.cwd()}/server/db/dbModelUserAccountView.js`)
                    .then((/**@type{import('./dbModelUserAccountView.js')} */dbModelUserAccountView) => {
                        const data_body = { user_account_id:        serverUtilNumberValue(parameters.data.id),    //who views
                                            user_account_id_view:   serverUtilNumberValue(parameters.data.POST_ID) ?? result_getProfileUser[0].id, //viewed account
                                            client_ip:              parameters.ip,
                                            client_user_agent:      parameters.user_agent,
                                            client_longitude:       parameters.data.client_longitude??'',
                                            client_latitude:        parameters.data.client_latitude??''};
                        dbModelUserAccountView.post(parameters.app_id, data_body)
                        .then(()=>{
                            resolve(clear_private(result_getProfileUser));
                        })
                        .catch((/**@type{server_server_error}*/error)=>reject(error));
                    });
                }
                else{
                    import(`file://${process.cwd()}/server/db/common.js`)
                    .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                        dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>reject(message));
                    });
                }
        })
        .catch((/**@type{server_server_error}*/error)=>reject(error));
    });
};
/**
 * @name getProfileStat
 * @description Get profile stat
 * @function
 * @param {{app_id:number,
 *          data:{statchoice?:string|null}}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_getProfileStat[]>}
 */
const getProfileStat = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_SELECT_PROFILE_STAT,
                        {
                            statchoice: serverUtilNumberValue(parameters.data?.statchoice),
                            app_id: parameters.app_id
                        },
                        null, 
                        null));

/**
 * @name userUpdateAdmin
 * @description Updates user by admin
 * @function
 * @param {number} app_id 
 * @param {number} id 
 * @param {server_db_sql_parameter_user_account_updateAdmin} data 
 * @returns {Promise.<server_db_sql_result_user_account_updateAdmin>}
 */
const userUpdateAdmin = async (app_id, id, data) =>{
	const error_code = data_validation(data);
	if (error_code==null)
        return import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            set_password(data.password_new)
            .then(password=>dbCommonExecute(app_id, 
                                            dbSql.USER_ACCOUNT_UPDATE,
                                            {id: id,
                                                active: data.active,
                                                user_level: data.user_level,
                                                private: data.private,
                                                username: data.username,
                                                bio: data.bio==''?null:data.bio,
                                                email: data.email,
                                                email_unverified: data.email_unverified==''?null:data.email_unverified,
                                                password_new: password,
                                                password_reminder: data.password_reminder==''?null:data.password_reminder,
                                                verification_code: data.verification_code==''?null:data.verification_code
                                                },
                                            null, 
                                            null)));
    else
        throw error_code;
};
/**
 * @name updateAdmin
 * @description Gets user and updates user by admin
 * @function 
 * @param {{app_id :number,
 *          resource_id:number,
 *          data:{  username:string,
 *                  bio:string,
 *                  email:string,
 *                  email_unverified:string,
 *                  password_new:string,
 *                  password_reminder:string,
 *                  active:number,
 *                  user_level:number,
 *                  private:number,
 *                  verification_code:string},
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_updateAdmin>}
 */
const updateAdmin = parameters =>{
    return new Promise((resolve, reject)=>{
        // get avatar and provider column used to validate
        getUserByUserId({app_id:parameters.app_id, resource_id:parameters.resource_id, locale:parameters.locale, res:parameters.res})
        .then(result_user=>{
            if (result_user) {
                /**@type{server_db_sql_parameter_user_account_updateAdmin} */
                const body = {  active:             serverUtilNumberValue(parameters.data.active),
                                user_level:         serverUtilNumberValue(parameters.data.user_level),
                                private:            serverUtilNumberValue(parameters.data.private),
                                username:           parameters.data.username,
                                bio:                parameters.data.bio,
                                email:              parameters.data.email,
                                email_unverified:   parameters.data.email_unverified,
                                password:           null,
                                password_new:       parameters.data.password_new==''?null:parameters.data.password_new,
                                password_reminder:  parameters.data.password_reminder,
                                verification_code:  parameters.data.verification_code,
                                provider_id:        result_user.provider_id,
                                avatar:             result_user.avatar,
                                admin:              1};
                userUpdateAdmin(parameters.app_id, parameters.resource_id, body)
                .then(result_update=>{
                    resolve(result_update);
                })
                .catch((/**@type{server_server_error}*/error)=>{
                    dbCommonCheckedError(parameters.app_id, parameters.locale, error, parameters.res).then((/**@type{string}*/message)=>reject(message));
                });
            }
            else{
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{server_server_error}*/error)=>reject(error));
    });
};
/**
 * @name getUsersAdmin
 * @description Get users by admin
 * @function
 * @param {{app_id:number,
 *          data:{  sort?:string|null,
 *                  order_by?:string|null,
 *                  search?:string|null,
 *                  offset?:string|null,
 *                  limit?:string|null}}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_getUsersAdmin[]>}
 */
const getUsersAdmin = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_SELECT
                        .replace('<SORT/>', parameters.data.sort ?? '')
                        .replace('<ORDER_BY/>', parameters.data.order_by ?? ''),
                        {   search: parameters.data.search=='*'?parameters.data.search:'%' + parameters.data.search + '%',
							offset: serverUtilNumberValue(parameters.data.offset) ?? 0,
							limit:  serverUtilNumberValue(parameters.data.limit)
							},
                        null, 
                        null));

/**
 * @name getStatCountAdmin
 * @description Get user stat
 * @function 
 * @param {{app_id:number}}parameters
 * @returns {Promise.<server_db_sql_result_user_account_getStatCountAdmin[]>}
 */
const getStatCountAdmin = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.USER_ACCOUNT_SELECT_STAT_COUNT,
                        {},
                        null, 
                        null));
 
/**
 * @name updatePassword
 * @description Update user password
 * @function 
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          ip:string,
 *          user_agent:string,
 *          host:string,
 *          accept_language:string,
 *          data:{  password_new:string,
 *                  auth:string,
 *                  user_language:string,
 *                  user_timezone:string,
 *                  user_number_system:string,
 *                  user_platform:string,
 *                  client_latitude:string,
 *                  client_longitude:string},
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<void>}
 */
 const updatePassword = async parameters => {
    const error_code = data_validation_password(parameters.data);
    if (error_code==null){
        import(`file://${process.cwd()}/server/db/common.js`)
            .then((/**@type{import('./common.js')} */{dbCommonExecute})=>{
                set_password(parameters.data.password_new)
                .then(password=>dbCommonExecute(parameters.app_id, 
                                dbSql.USER_ACCOUNT_UPDATE_PASSWORD,
                                {
                                    password_new: password,
                                    id: parameters.resource_id,
                                    auth: parameters.data.auth
                                },
                                null, 
                                null))
                .then(result_update=>{
                    if (result_update) {
                        /**@type{server_db_sql_parameter_user_account_event_insertUserEvent}*/
                        const eventData = {
                            /**@ts-ignore */
                            user_account_id: parameters.resource_id,
                            event: 'PASSWORD_RESET',
                            event_status: 'SUCCESSFUL',
                            user_language: parameters.data.user_language,
                            user_timezone: parameters.data.user_timezone,
                            user_number_system: parameters.data.user_number_system,
                            user_platform: parameters.data.user_platform,
                            server_remote_addr : parameters.ip,
                            server_user_agent : parameters.user_agent,
                            server_http_host : parameters.host,
                            server_http_accept_language : parameters.accept_language,
                            client_latitude : parameters.data.client_latitude,
                            client_longitude : parameters.data.client_longitude
                        };
                        dbModelUserAccountEvent.post(parameters.app_id, eventData);
                    }
                    else{
                        return import(`file://${process.cwd()}/server/db/common.js`)
                        .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) =>
                            dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>{throw message;}));
                    }
                })
                .catch((/**@type{server_server_error}*/error)=>
                        dbCommonCheckedError(parameters.app_id, parameters.locale, error, parameters.res).then((/**@type{string}*/message)=>{throw message;}));
            });
    }
    else
        throw error_code;
};
/**
 * @name userUpdateLocal
 * @description Update user local
 * @function
 * @param {number} app_id 
 * @param {server_db_sql_parameter_user_account_updateUserLocal} data 
 * @param {number} search_id
 * @returns {Promise.<server_db_sql_result_user_account_updateUserLocal>}
 */
const userUpdateLocal = async (app_id, data, search_id) =>{
    const error_code = data_validation(data);
    if (error_code==null)
        return import(`file://${process.cwd()}/server/db/common.js`)
            .then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                set_password(data.password_new)
                .then(password=>dbCommonExecute(app_id, 
                                dbSql.USER_ACCOUNT_UPDATE_LOCAL,
                                {
                                    bio: data.bio,
                                    private: data.private,
                                    username: data.username,
                                    password_new: password,
                                    password_reminder: data.password_reminder,
                                    email: data.email,
                                    email_unverified: data.email_unverified,
                                    avatar: data.avatar,
                                    verification_code: data.verification_code,
                                    id: search_id,
                                    DB_CLOB: ['avatar']
                                },
                                null, 
                                null)));
    else
        throw error_code;
};

/**
 * @name updateUserCommon
 * @description Update user common
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:server_db_sql_parameter_user_account_updateUserCommon,
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_updateUserCommon>}
 */
 const updateUserCommon = parameters => {
    const error_code = data_validation_common(parameters.data);
	if (error_code==null)
        return new Promise((resolve, reject)=>{
            import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                dbCommonExecute(parameters.app_id, 
                                dbSql.USER_ACCOUNT_UPDATE_COMMON,
                                {	username: parameters.data.username,
                                    bio: parameters.data.bio,
                                    private: parameters.data.private,
                                    id: parameters.resource_id
                                },
                                null, 
                                null))
            .then(result_update=>{
                if (result_update)
                    resolve(result_update);
                else{
                    import(`file://${process.cwd()}/server/db/common.js`)
                    .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                        dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>reject(message));
                    });
                }
            })
            .catch((/**@type{server_server_error}*/error)=>{
                dbCommonCheckedError(parameters.app_id, parameters.locale, error, parameters.res).then((/**@type{string}*/message)=>reject(message));
            });
        });
    else
        throw error_code;
};
/**
 * @name getUserByUserId
 * @description Get user by id
 * @function 
 * @param {{app_id:number,
 *          resource_id:number,
 *          locale:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_getUserByUserId>}
 */
const getUserByUserId = parameters => {
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(parameters.app_id, 
                            dbSql.USER_ACCOUNT_SELECT_ID,
                            {id: parameters.resource_id},
                            null, 
                            null))
            .then(result=>{
                if (result[0]){
                    resolve({...result[0], ...{last_logintime:iamUserGetLastLogin(parameters.app_id, parameters.resource_id)}});
                }
                else{
                    import(`file://${process.cwd()}/server/db/common.js`)
                    .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                        dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>reject(message));
                    });
                }
            })
            .catch((/**@type{server_server_error}*/error)=>reject(error));
    });
};

/**
 * @name userGetPassword
 * @description Get password for given user
 * @function
 * @param {number} app_id 
 * @param {number} id
 * @returns {Promise.<server_db_sql_result_user_account_checkPassword[]>}
 */
const userGetPassword = async (app_id, id) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_SELECT_PASWORD,
                        {id: id},
                        null, 
                        null));

/**
 * @name userDelete
 * @description Delete user
 * @function
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<server_db_sql_result_user_account_deleteUser>}
 */
const userDelete = async (app_id, id) =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_DELETE,
                        {id: id},
                        null, 
                        null));
/**
 * @name getProfileDetail
 * @description Get user profile detail
 * @function
 * @param {{app_id:number,
 *          resource_id:number,
 *          data:{detailchoice?:string|null},
 *          locale:String,
 *          res:server_server_res}} parameters
 * @returns {Promise.<server_db_sql_result_user_account_getProfileDetail[]>}
 */
 const getProfileDetail = parameters => {
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(parameters.app_id, 
                            dbSql.USER_ACCOUNT_SELECT_PROFILE_DETAIL,
                            {
                                user_account_id: parameters.resource_id,
                                detailchoice: serverUtilNumberValue(parameters.data?.detailchoice)
                            },
                            null, 
                            null))
        .then(result=>{
            if (result)
                resolve(result);
            else {
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(parameters.app_id, parameters.locale, parameters.res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        });
    });
    
};
/**
 * @name userDemoGet
 * @description Get demo users
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_db_sql_result_user_account_getDemousers[]>}
 */
const userDemoGet = async app_id => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_SELECT_DEMO,
                        {
                            demo_level: 2
                        },
                        null, 
                        null));
                        
export {userGetUsername,
        userGetProvider,
        userUpdateProvider,
        updateUserVerificationCode,
        userPost,
        userUpdateActivate, 
        userGetEmail,
        userUpdateAdmin,
        getProfile, getProfileStat,
        updateAdmin, getUsersAdmin, getStatCountAdmin,
        updatePassword, updateUserCommon, userUpdateLocal, getUserByUserId, userGetPassword, userDelete, getProfileDetail,
        userDemoGet};
