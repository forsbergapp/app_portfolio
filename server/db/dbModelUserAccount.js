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
 * Sets password using defined encryption
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
 * Checks password between 10 and 100 characters
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
 * Common validation logic
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
 * Data validation
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
 * Get username
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
 * Get user provider
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
 * Update verification code
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
 * Update user provider
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
 * Create user
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
 * Update user activate
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
 * Get user email
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
 * Get user profile
 * @function
 * @param {number} app_id 
 * @param {number|null} resource_id_number
 * @param {string|null} resource_id_name
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {*} query 
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<server_db_sql_result_user_account_getProfileUser[]>}
 */
const getProfile = (app_id, resource_id_number, resource_id_name, ip, user_agent, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        /**
         * Clear private data if private
         * @param {server_db_sql_result_user_account_getProfileUser[]} result_getProfileUser 
         * @returns {server_db_sql_result_user_account_getProfileUser[]}
         */
        const clear_private = result_getProfileUser =>
            result_getProfileUser.map(row=>{
                if (row.id ==resource_id_number){
                    //profile of current logged in user should always be displayed
                    row.private = null;
                }
                else
                    if ((row.private==1 && row.friends==null) || query.get('search')!=null){
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
                case (resource_id_name!='' && resource_id_name != null):{
                    return 'u.username = :user_value';
                }
                case (resource_id_number != null):{
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
                case (resource_id_name!='' && resource_id_name != null):{
                    return resource_id_name;
                }
                case (resource_id_number != null):{
                    return resource_id_number;
                }
                default:{
                    return null;
                }
            }
        };
        //resource id can be number, string or empty if searching
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_SELECT_PROFILE
                            .replace('<USER_WHERE/>',user_where(query.get('search'))),
                            {
                                user_accound_id_current_user: serverUtilNumberValue(query.get('id')),
                                user_value: user_where_value(query.get('search'))
                            },
                            null, 
                            null))
        .then(result_getProfileUser=>{
            if (query.get('search')){
                //searching, return result
                import(`file://${process.cwd()}/server/db/dbModelAppDataStat.js`)
                .then((/**@type{import('./dbModelAppDataStat.js')} */{ post }) => {
                    /**@type{server_db_sql_parameter_app_data_stat_post} */
                    const data_insert = {json_data:                                         {   search:             query.get('search') ?? resource_id_number ?? resource_id_name,
                                                                                                client_ip:          ip,
                                                                                                client_user_agent:  user_agent,
                                                                                                client_longitude:   query.get('client_longitude'),
                                                                                                client_latitude:    query.get('client_latitude')},
                                        //if user logged not logged in then save resource on app
                                        app_id:                                             serverUtilNumberValue(query.get('id'))?null:app_id,
                                        user_account_id:                                    null,
                                        //save user account if logged in else set null in both user account app columns
                                        user_account_app_user_account_id:                   serverUtilNumberValue(query.get('id')) ?? null,
                                        user_account_app_app_id:                            serverUtilNumberValue(query.get('id'))?app_id:null,
                                        app_data_resource_master_id:                        null,
                                        app_data_entity_resource_id:                        1,  //PROFILE_SEARCH
                                        app_data_entity_resource_app_data_entity_app_id:    serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) ?? 0,
                                        app_data_entity_resource_app_data_entity_id:        0   //COMMON
                                        };
                    post(app_id, data_insert)
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
                        const data_body = { user_account_id:        serverUtilNumberValue(query.get('id')),    //who views
                                            user_account_id_view:   serverUtilNumberValue(query.get('POST_ID')) ?? result_getProfileUser[0].id, //viewed account
                                            client_ip:              ip,
                                            client_user_agent:      user_agent,
                                            client_longitude:       query.get('client_longitude'),
                                            client_latitude:        query.get('client_latitude')};
                        dbModelUserAccountView.post(app_id, data_body)
                        .then(()=>{
                            resolve(clear_private(result_getProfileUser));
                        })
                        .catch((/**@type{server_server_error}*/error)=>reject(error));
                    });
                }
                else{
                    import(`file://${process.cwd()}/server/db/common.js`)
                    .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                        dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                    });
                }
        })
        .catch((/**@type{server_server_error}*/error)=>reject(error));
    });
};
/**
 * Get profile stat
 * @function
 * @param {number} app_id 
 * @param {*} query
 * @returns {Promise.<server_db_sql_result_user_account_getProfileStat[]>}
 */
const getProfileStat = (app_id, query) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_SELECT_PROFILE_STAT,
                        {
                            statchoice: serverUtilNumberValue(query.get('statchoice')),
                            app_id: app_id
                        },
                        null, 
                        null));

/**
 * Updates user by admin
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
 * Gets user and updates user by admin
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {*} data
 * @param {server_server_res} res
 * @returns {Promise.<server_db_sql_result_user_account_updateAdmin>}
 */
const updateAdmin =(app_id, resource_id, query, data, res) =>{
    return new Promise((resolve, reject)=>{
        // get avatar and provider column used to validate
        getUserByUserId(app_id, resource_id, query, res)
        .then(result_user=>{
            if (result_user) {
                /**@type{server_db_sql_parameter_user_account_updateAdmin} */
                const body = {  active:             serverUtilNumberValue(data.active),
                                user_level:         serverUtilNumberValue(data.user_level),
                                private:            serverUtilNumberValue(data.private),
                                username:           data.username,
                                bio:                data.bio,
                                email:              data.email,
                                email_unverified:   data.email_unverified,
                                password:           null,
                                password_new:       data.password_new==''?null:data.password_new,
                                password_reminder:  data.password_reminder,
                                verification_code:  data.verification_code,
                                provider_id:        result_user.provider_id,
                                avatar:             result_user.avatar,
                                admin:              1};
                userUpdateAdmin(app_id, resource_id, body)
                .then(result_update=>{
                    resolve(result_update);
                })
                .catch((/**@type{server_server_error}*/error)=>{
                    dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
                });
            }
            else{
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        })
        .catch((/**@type{server_server_error}*/error)=>reject(error));
    });
};
/**
 * Get users by admin
 * @function
 * @param {number} app_id 
 * @param {*} query 
 * @returns {Promise.<server_db_sql_result_user_account_getUsersAdmin[]>}
 */
const getUsersAdmin = (app_id, query) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_SELECT
                        .replace('<SORT/>', query.get('sort'))
                        .replace('<ORDER_BY/>', query.get('order_by')),
                        {   search: query.get('search')=='*'?query.get('search'):'%' + query.get('search') + '%',
							offset: serverUtilNumberValue(query.get('offset')) ?? 0,
							limit:  serverUtilNumberValue(query.get('limit'))
							},
                        null, 
                        null));

/**
 * Get user stat
 * @function
 * @param {number} app_id 
 * @returns {Promise.<server_db_sql_result_user_account_getStatCountAdmin[]>}
 */
const getStatCountAdmin = app_id => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_SELECT_STAT_COUNT,
                        {},
                        null, 
                        null));
 
/**
 * Update user password
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {string} host 
 * @param {string} accept_language 
 * @param {*} query 
 * @param {*} data 
 * @param {server_server_res} res
 * @returns {Promise.<void>}
 */
 const updatePassword = async (app_id, resource_id, ip, user_agent, host, accept_language, query, data, res) => {
    const error_code = data_validation_password(data);
    if (error_code==null){
        import(`file://${process.cwd()}/server/db/common.js`)
            .then((/**@type{import('./common.js')} */{dbCommonExecute})=>{
                set_password(data.password_new)
                .then(password=>dbCommonExecute(app_id, 
                                dbSql.USER_ACCOUNT_UPDATE_PASSWORD,
                                {
                                    password_new: password,
                                    id: resource_id,
                                    auth: data.auth
                                },
                                null, 
                                null))
                .then(result_update=>{
                    if (result_update) {
                        /**@type{server_db_sql_parameter_user_account_event_insertUserEvent}*/
                        const eventData = {
                            user_account_id: resource_id,
                            event: 'PASSWORD_RESET',
                            event_status: 'SUCCESSFUL',
                            user_language: data.user_language,
                            user_timezone: data.user_timezone,
                            user_number_system: data.user_number_system,
                            user_platform: data.user_platform,
                            server_remote_addr : ip,
                            server_user_agent : user_agent,
                            server_http_host : host,
                            server_http_accept_language : accept_language,
                            client_latitude : data.client_latitude,
                            client_longitude : data.client_longitude
                        };
                        dbModelUserAccountEvent.post(app_id, eventData);
                    }
                    else{
                        return import(`file://${process.cwd()}/server/db/common.js`)
                        .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) =>
                            dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>{throw message;}));
                    }
                })
                .catch((/**@type{server_server_error}*/error)=>
                        dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>{throw message;}));
            });
    }
    else
        throw error_code;
};
/**
 * Update user local
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
 * Update user common
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {server_db_sql_parameter_user_account_updateUserCommon} data 
 * @param {server_server_res} res
 * @returns {Promise.<server_db_sql_result_user_account_updateUserCommon>}
 */
 const updateUserCommon = (app_id, resource_id, query, data, res) => {
    const error_code = data_validation_common(data);
	if (error_code==null)
        return new Promise((resolve, reject)=>{
            import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                dbCommonExecute(app_id, 
                                dbSql.USER_ACCOUNT_UPDATE_COMMON,
                                {	username: data.username,
                                    bio: data.bio,
                                    private: data.private,
                                    id: resource_id
                                },
                                null, 
                                null))
            .then(result_update=>{
                if (result_update)
                    resolve(result_update);
                else{
                    import(`file://${process.cwd()}/server/db/common.js`)
                    .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                        dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                    });
                }
            })
            .catch((/**@type{server_server_error}*/error)=>{
                dbCommonCheckedError(app_id, query.get('lang_code'), error, res).then((/**@type{string}*/message)=>reject(message));
            });
        });
    else
        throw error_code;
};
/**
 * Get user by id
 * @function
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {*} query 
 * @param {server_server_res} res 
 * @returns {Promise.<server_db_sql_result_user_account_getUserByUserId>}
 */
const getUserByUserId = (app_id, resource_id, query, res) => {
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_SELECT_ID,
                            {id: resource_id},
                            null, 
                            null))
            .then(result=>{
                if (result[0]){
                    resolve({...result[0], ...{last_logintime:iamUserGetLastLogin(app_id, resource_id)}});
                }
                else{
                    import(`file://${process.cwd()}/server/db/common.js`)
                    .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                        dbCommonRecordNotFound(app_id, query?.get('lang_code') ?? 'en', res).then((/**@type{string}*/message)=>reject(message));
                    });
                }
            })
            .catch((/**@type{server_server_error}*/error)=>reject(error));
    });
};

/**
 * Get password for given user
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
 * Delete user
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
 * Get user profile detail
 * @function
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {server_server_res} res 
 * @returns {Promise.<server_db_sql_result_user_account_getProfileDetail[]>}
 */
 const getProfileDetail = (app_id, resource_id, query, res) => {
    return new Promise((resolve, reject)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(app_id, 
                            dbSql.USER_ACCOUNT_SELECT_PROFILE_DETAIL,
                            {
                                user_account_id: resource_id,
                                detailchoice: serverUtilNumberValue(query.get('detailchoice'))
                            },
                            null, 
                            null))
        .then(result=>{
            if (result)
                resolve(result);
            else {
                import(`file://${process.cwd()}/server/db/common.js`)
                .then((/**@type{import('../db/common.js')} */{dbCommonRecordNotFound}) => {
                    dbCommonRecordNotFound(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
            }
        });
    });
    
};
/**
 * Get demo users
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
