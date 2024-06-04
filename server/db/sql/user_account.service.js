/** @module server/db/sql */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * @param {string|null} password 
 * @returns {Promise.<string|null>}
 */
const set_password = async (password) =>{
	/**@type{import('../../security.service.js')} */
	const {PasswordCreate}= await import(`file://${process.cwd()}/server/security.service.js`);
	return password==null?null:await PasswordCreate(password);
};
/**
 * Checks password between 10 and 100 characters
 * @param {import('../../../types.js').db_parameter_user_account_updatePassword} data 
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
 * Generate random verification code between 100000 and 999999
 * @returns {string}
 */
const verification_code = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
/**
 * 
 * @param {import('../../../types.js').db_parameter_user_account_updateUserCommon} data 
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
 * 
 * @param {	import('../../../types.js').db_parameter_user_account_create|
 * 			import('../../../types.js').db_parameter_user_account_updateUserLocal|
 *         	import('../../../types.js').db_parameter_user_account_updateUserSuperAdmin} data 
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
 * 
 * @param {number} app_id 
 * @param {string} search 
 * @param {string} sort 
 * @param {string} order_by 
 * @param {number|null} offset 
 * @param {number|null} limit 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getUsersAdmin[]>}
 */
const getUsersAdmin = async (app_id, search, sort, order_by, offset, limit) => {
		let sql;
		sql = `SELECT ua.id "id",
					  ua.avatar "avatar",
					  ua.app_role_id "app_role_id",
					  (SELECT ap_user.icon
						 FROM <DB_SCHEMA/>.app_role ap_user
						WHERE ap_user.id = COALESCE(ua.app_role_id,2)) "app_role_icon",
					  ua.active "active",
					  ua.user_level "user_level",
					  ua.private "private",
					  ua.username "username",
					  ua.bio "bio",
					  ua.email "email",
					  ua.email_unverified "email_unverified",
					  ua.password "password",
					  ua.password_reminder "password_reminder",
					  ua.verification_code "verification_code",
		              ua.identity_provider_id "identity_provider_id",
					  ip.provider_name "provider_name",
					  ua.provider_id "provider_id",
					  ua.provider_first_name "provider_first_name",
					  ua.provider_last_name "provider_last_name",
					  ua.provider_image "provider_image",
					  ua.provider_image_url "provider_image_url",
					  ua.provider_email "provider_email",
					  ua.date_created "date_created",
					  ua.date_modified "date_modified",
					  count(*) over() "total_rows"
				 FROM <DB_SCHEMA/>.user_account ua
					  LEFT OUTER JOIN <DB_SCHEMA/>.identity_provider ip
						ON ip.id = ua.identity_provider_id
					  LEFT OUTER JOIN <DB_SCHEMA/>.app_role ap
						ON ap.id = ua.app_role_id
				WHERE (ua.username LIKE :search
				   OR ua.bio LIKE :search
				   OR ua.email LIKE :search
				   OR ua.email_unverified LIKE :search
				   OR ua.provider_first_name LIKE :search
				   OR ua.provider_last_name LIKE :search
				   OR ua.provider_email LIKE :search
				   OR CAST(ua.id as VARCHAR(11)) LIKE :search)
				   OR :search = '*'
				ORDER BY ${sort} ${order_by}
				<APP_PAGINATION_LIMIT_OFFSET/>`;
		if (search!='*')
			search = '%' + search + '%';
		const parameters = {search: search,
							offset: offset ?? 0,
							limit: limit
							};
		return await db_execute(app_id, sql, parameters, null, null, false);
    };
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getUserAppRoleAdmin[]>}
 */
const getUserAppRoleAdmin = async (app_id, id) => {
	const sql = `SELECT app_role_id "app_role_id"
				   FROM <DB_SCHEMA/>.user_account
				  WHERE id = :id`;
	const parameters = {id: id};
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number} app_id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getStatCountAdmin[]>}
 */
const getStatCountAdmin = async app_id => {
	const sql = `SELECT ua.identity_provider_id "identity_provider_id",
						CASE 
						WHEN ip.provider_name IS NULL THEN 
							NULL
						ELSE 
							ip.provider_name 
						END "provider_name",
						COUNT(*) "count_users"
				   FROM <DB_SCHEMA/>.user_account ua
						LEFT OUTER JOIN <DB_SCHEMA/>.identity_provider ip
						ON ip.id = ua.identity_provider_id
				  GROUP BY ua.identity_provider_id, ip.provider_name
				  ORDER BY ua.identity_provider_id`;
	const parameters = {};
	return await db_execute(app_id, sql, parameters, null, null, true);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {import('../../../types.js').db_parameter_user_account_updateUserSuperAdmin} data 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_updateUserSuperAdmin>}
 */
const updateUserSuperAdmin = async (app_id, id, data) => {
	let sql;
	let parameters;
	if (data.email_unverified =='')
		data.email_unverified = null;
	if (data.bio=='')
		data.bio = null;
	if (data.password_reminder=='')
		data.password_reminder = null;
	if (data.verification_code=='')
		data.verification_code = null;
	const error_code = data_validation(data);
	if (error_code==null){
		sql = `UPDATE <DB_SCHEMA/>.user_account
				SET app_role_id = :app_role_id,
					active = :active,
					user_level = :user_level,
					private = :private,
					username = :username,
					bio = :bio,
					email = :email,
					email_unverified = :email_unverified,
					password = 	CASE WHEN :password_new IS NULL THEN 
									password 
								ELSE 
									:password_new 
								END,
					password_reminder = :password_reminder,
					verification_code = :verification_code
				WHERE id = :id`;
		parameters = {id: id,
					app_role_id: data.app_role_id,
					active: data.active,
					user_level: data.user_level,
					private: data.private,
					username: data.username,
					bio: data.bio,
					email: data.email,
					email_unverified: data.email_unverified,
					password_new: await set_password(data.password_new),
					password_reminder: data.password_reminder,
					verification_code: data.verification_code
					};
		return await db_execute(app_id, sql, parameters, null);
	}
	else
		throw error_code;
};
/**
 * 
 * @param {number} app_id 
 * @param {import('../../../types.js').db_parameter_user_account_create} data 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_create>}
 */
const create = async (app_id, data) => {
	let sql;
	let parameters;
	
	const error_code = data_validation(data);
	if (error_code==null){
		sql = `INSERT INTO <DB_SCHEMA/>.user_account(
					bio,
					private,
					user_level,
					date_created,
					date_modified,
					username,
					password,
					password_reminder,
					email,
					avatar,
					verification_code,
					active,
					identity_provider_id,
					provider_id,
					provider_first_name,
					provider_last_name,
					provider_image,
					provider_image_url,
					provider_email)
				VALUES( :bio,
						:private,
						:user_level,
						CURRENT_TIMESTAMP,
						CURRENT_TIMESTAMP,
						:username,
						:password_new,
						:password_reminder,
						:email,
						:avatar,
						:verification_code,
						:active,
						:identity_provider_id,
						:provider_id,
						:provider_first_name,
						:provider_last_name,
						:provider_image,
						:provider_image_url,
						:provider_email) `;				
		parameters = {
						bio: data.bio,
						private: data.private,
						user_level: data.user_level,
						username: data.username,
						password_new: await set_password(data.password_new),
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
					};
			return await db_execute(app_id, sql, parameters, null);
	}
	else
		throw error_code;      
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number|null} verification_type 
 * @param {string} verification_code 
 * @param {string|null} auth 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_activateUser>}
 */
const activateUser = async (app_id, id, verification_type, verification_code, auth) => {
	const sql = `UPDATE <DB_SCHEMA/>.user_account
					SET active = 1,
						verification_code = :auth,
						email = CASE 
								WHEN  :verification_type = 4 THEN 
									email_unverified
								ELSE 
									email
								END,
						email_unverified = CASE 
											WHEN  :verification_type = 4 THEN 
												NULL
											ELSE 
												email_unverified
											END,
						date_modified = CURRENT_TIMESTAMP
				WHERE id = :id
				AND verification_code = :verification_code `;
	const parameters ={
						auth: auth,
						verification_type: verification_type,
						id: id,
						verification_code: verification_code
					};
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {string} verification_code 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_updateUserVerificationCode>}
 */
const updateUserVerificationCode = async (app_id, id, verification_code) => {
	const sql = `UPDATE <DB_SCHEMA/>.user_account
					SET verification_code = :verification_code,
						active = 0,
						date_modified = CURRENT_TIMESTAMP
				WHERE id = :id `;
	const parameters ={
						verification_code: verification_code,
						id: id   
					}; 
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getUserByUserId[]>}
 */
const getUserByUserId = async (app_id, id) => {
	const sql = `SELECT	u.id "id",
						u.bio "bio",
						u.private "private",
						u.user_level "user_level",
						u.username "username",
						u.password "password",
						u.password_reminder "password_reminder",
						u.email "email",
						u.email_unverified "email_unverified",
						u.avatar "avatar",
						u.verification_code "verification_code",
						u.active "active",
						u.identity_provider_id "identity_provider_id",
						u.provider_id "provider_id",
						u.provider_first_name "provider_first_name",
						u.provider_last_name "provider_last_name",
						u.provider_image "provider_image",
						u.provider_image_url "provider_image_url",
						u.provider_email "provider_email",
						u.date_created "date_created",
						u.date_modified "date_modified"
				FROM   <DB_SCHEMA/>.user_account u
			WHERE   u.id = :id `;
	const parameters = {id: id};
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id_number 
 * @param {string|null} resource_id_name 
 * @param {string|null} search
 * @param {number|null} id_current_user
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getProfileUser[]>}
 */
const getProfileUser = async (app_id, resource_id_number, resource_id_name, search, id_current_user) => {
	const user_where = () =>{
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
	}
	const user_where_value = () =>{
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
	}
	const sql = `SELECT	u.id "id",
						u.bio "bio",
						u.private "private",
						(SELECT 1 
							FROM <DB_SCHEMA/>.user_account ua_current
						   WHERE ua_current.id = :user_accound_id_current_user
								AND EXISTS 
							(SELECT NULL
							   FROM <DB_SCHEMA/>.user_account_follow  uaf 
							  WHERE (uaf.user_account_id = u.id
									 AND uaf.user_account_id_follow = ua_current.id)
								or  (
									 uaf.user_account_id_follow = u.id
									 AND uaf.user_account_id = ua_current.id)
							)
				
						) "friends",
						u.user_level "user_level",
						u.date_created "date_created",
						u.username "username",
						u.avatar "avatar",
						u.identity_provider_id "identity_provider_id",
						u.provider_id "provider_id",
						u.provider_first_name "provider_first_name",
						u.provider_last_name "provider_last_name",
						u.provider_image "provider_image",
						u.provider_image_url "provider_image_url",
						(SELECT COUNT(u_following.user_account_id)   
							FROM <DB_SCHEMA/>.user_account_follow  u_following
							WHERE u_following.user_account_id = u.id) 					"count_following",
						(SELECT COUNT(u_followed.user_account_id_follow) 
							FROM <DB_SCHEMA/>.user_account_follow  u_followed
							WHERE u_followed.user_account_id_follow = u.id) 				"count_followed",
						(SELECT COUNT(u_likes.user_account_id)
							FROM <DB_SCHEMA/>.user_account_like    u_likes
							WHERE u_likes.user_account_id = u.id ) 						"count_likes",
						(SELECT COUNT(u_likes.user_account_id_like)
							FROM <DB_SCHEMA/>.user_account_like    u_likes
							WHERE u_likes.user_account_id_like = u.id )					"count_liked",
						(SELECT COUNT(u_views.user_account_id_view)
							FROM <DB_SCHEMA/>.user_account_view    u_views
							WHERE u_views.user_account_id_view = u.id ) 					"count_views",
						(SELECT COUNT(u_followed_current_user.user_account_id)
							FROM <DB_SCHEMA/>.user_account_follow  u_followed_current_user 
							WHERE u_followed_current_user.user_account_id_follow = u.id
							AND u_followed_current_user.user_account_id = :user_accound_id_current_user) 	"followed",
						(SELECT COUNT(u_liked_current_user.user_account_id)  
							FROM <DB_SCHEMA/>.user_account_like    u_liked_current_user
							WHERE u_liked_current_user.user_account_id_like = u.id
							AND u_liked_current_user.user_account_id = :user_accound_id_current_user)      "liked"
				 FROM <DB_SCHEMA/>.user_account u
				WHERE ${user_where()}
				  AND u.active = 1
				  AND EXISTS(SELECT NULL
							   FROM <DB_SCHEMA/>.user_account_app uap
							  WHERE uap.user_account_id = u.id
								AND uap.app_id = :app_id)`;
	const parameters ={
						user_accound_id_current_user: id_current_user,
						user_value: user_where_value(),
						app_id: app_id
					}; 
	return await db_execute(app_id, sql, parameters, null, null, (search!='' && search != null));
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number|null} detailchoice
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getProfileDetail[]>}
 */
const getProfileDetail = async (app_id, id, detailchoice) => {
	let sql;
	sql = `SELECT 	detail "detail",
					id "id",
					provider_id "provider_id",
					avatar "avatar",
					provider_image "provider_image",
					provider_image_url "provider_image_url",
					username "username",
					provider_first_name "provider_first_name",
					count(*) over() "total_rows"
			 FROM (SELECT 	'FOLLOWING' detail,
							u.id,
							u.provider_id,
							u.avatar,
							u.provider_image,
							u.provider_image_url,
							u.username,
							u.provider_first_name
					 FROM <DB_SCHEMA/>.user_account_follow u_follow,
						  <DB_SCHEMA/>.user_account u
				    WHERE u_follow.user_account_id = :user_account_id
 					  AND u.id = u_follow.user_account_id_follow
					  AND u.active = 1
					  AND 1 = :detailchoice
				    UNION ALL
				   SELECT 	'FOLLOWED' detail,
							u.id,
							u.provider_id,
							u.avatar,
							u.provider_image,
							u.provider_image_url,
							u.username,
							u.provider_first_name
					 FROM <DB_SCHEMA/>.user_account_follow u_followed,
						  <DB_SCHEMA/>.user_account u
					WHERE u_followed.user_account_id_follow = :user_account_id
 					  AND u.id = u_followed.user_account_id
					  AND u.active = 1
					  AND 2 = :detailchoice
				    UNION ALL
				   SELECT	'LIKE_USER' detail,
							u.id,
							u.provider_id,
							u.avatar,
							u.provider_image,
							u.provider_image_url,
							u.username,
							u.provider_first_name
					 FROM <DB_SCHEMA/>.user_account_like u_like,
						  <DB_SCHEMA/>.user_account u
				    WHERE u_like.user_account_id = :user_account_id
 					  AND u.id = u_like.user_account_id_like
					  AND u.active = 1
					  AND 3 = :detailchoice
				    UNION ALL
				   SELECT	'LIKED_USER' detail,
							u.id,
							u.provider_id,
							u.avatar,
							u.provider_image,
							u.provider_image_url,
							u.username,
							u.provider_first_name
					 FROM <DB_SCHEMA/>.user_account_like u_liked,
						  <DB_SCHEMA/>.user_account u
				    WHERE u_liked.user_account_id_like = :user_account_id
  					  AND u.id = u_liked.user_account_id
					  AND u.active = 1
					  AND 4 = :detailchoice) t
				ORDER BY 1, COALESCE(username, provider_first_name) 
				<APP_LIMIT_RECORDS/>`;
	const parameters ={
						user_account_id: id,
						detailchoice: detailchoice
					}; 
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} statchoice 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getProfileStat[]>}
 */
const getProfileStat = async (app_id, statchoice) => {
	let sql;
	sql = `SELECT	top "top", 
					id "id", 
					identity_provider_id "identity_provider_id", 
					provider_id "provider_id", 
					avatar "avatar",
					provider_image "provider_image",
					provider_image_url "provider_image_url",
					username "username",
					provider_first_name "provider_first_name",
					count "count",
					count(*) over() "total_rows"
			 FROM (SELECT 	'VISITED' top,
							u.id,
							u.identity_provider_id,
							u.provider_id,
							u.avatar,
							u.provider_image,
							u.provider_image_url,
							u.username,
							u.provider_first_name,
							(SELECT COUNT(u_visited.user_account_id_view)
							   FROM <DB_SCHEMA/>.user_account_view u_visited
							  WHERE u_visited.user_account_id_view = u.id) count
				     FROM <DB_SCHEMA/>.user_account u
				    WHERE u.active = 1
					  AND u.private <> 1
					  AND 1 = :statchoice
				    UNION ALL
				   SELECT 	'FOLLOWING' top,
							u.id,
							u.identity_provider_id,
							u.provider_id,
							u.avatar,
							u.provider_image,
							u.provider_image_url,
							u.username,
							u.provider_first_name,
							(SELECT COUNT(u_follow.user_account_id_follow)
							   FROM <DB_SCHEMA/>.user_account_follow u_follow
							  WHERE u_follow.user_account_id_follow = u.id) count
					 FROM <DB_SCHEMA/>.user_account u
				    WHERE u.active = 1
  					  AND u.private <> 1
					  AND 2 = :statchoice
				    UNION ALL
				   SELECT 	'LIKE_USER' top,
							u.id,
							u.identity_provider_id,
							u.provider_id,
							u.avatar,
							u.provider_image,
							u.provider_image_url,
							u.username,
							u.provider_first_name,
							(SELECT COUNT(u_like.user_account_id_like)
							   FROM <DB_SCHEMA/>.user_account_like u_like
						      WHERE u_like.user_account_id_like = u.id) count
					 FROM <DB_SCHEMA/>.user_account u
					WHERE  u.active = 1
 					  AND  u.private <> 1
					  AND  3 = :statchoice) t
			WHERE EXISTS(SELECT NULL
						   FROM <DB_SCHEMA/>.user_account_app uap
						  WHERE uap.user_account_id = t.id
						    AND uap.app_id = :app_id)
		    ORDER BY 1,10 DESC, COALESCE(username, provider_first_name) 
			<APP_LIMIT_RECORDS/>`;
	const parameters = {
						statchoice: statchoice,
						app_id: app_id
					};
	return await db_execute(app_id, sql, parameters, null, null, true);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id
 * @returns {Promise.<import('../../../types.js').db_result_user_account_checkPassword[]>}
 */
const checkPassword = async (app_id, id) => {
	const sql = `SELECT password "password"
				   FROM <DB_SCHEMA/>.user_account
				  WHERE id = :id `;
	const parameters = {id: id};
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {import('../../../types.js').db_parameter_user_account_updatePassword} data 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_updatePassword>}
 */
const updatePassword = async (app_id, id, data) => {
	const error_code = data_validation_password(data);
	if (error_code==null){
		const sql = `UPDATE <DB_SCHEMA/>.user_account
						SET password = :password_new,
							verification_code = null
						WHERE id = :id  
						AND verification_code = :auth
						AND verification_code IS NOT NULL`;
		const parameters ={
							password_new: await set_password(data.password_new),
							id: id,
							auth: data.auth
						}; 
		return await db_execute(app_id, sql, parameters, null);
	}
	else
		throw error_code;
};
/**
 * 
 * @param {number} app_id 
 * @param {import('../../../types.js').db_parameter_user_account_updateUserLocal} data 
 * @param {number} search_id
 * @returns {Promise.<import('../../../types.js').db_result_user_account_updateUserLocal>}
 */
const updateUserLocal = async (app_id, data, search_id) => {
	let sql;
	let parameters;
	const error_code = data_validation(data);
	if (error_code==null){
		sql = `UPDATE <DB_SCHEMA/>.user_account
					SET bio = :bio,
						private = :private,
						username = :username,
						password = 	COALESCE(:password_new, password),
						password_reminder = :password_reminder,
						email = :email,
						email_unverified = :email_unverified,
						avatar = :avatar,
						verification_code = :verification_code,
						date_modified = CURRENT_TIMESTAMP
				  WHERE id = :id `;
		parameters ={
						bio: data.bio,
						private: data.private,
						username: data.username,
						password_new: await set_password(data.password_new),
						password_reminder: data.password_reminder,
						email: data.email,
						email_unverified: data.email_unverified,
						avatar: data.avatar,
						verification_code: data.verification_code,
						id: search_id,
						DB_CLOB: ['avatar']
					}; 
		return await db_execute(app_id, sql, parameters, null);
	}
	else
		throw error_code;
};
/**
 * 
 * @param {number} app_id 
 * @param {import('../../../types.js').db_parameter_user_account_updateUserCommon} data 
 * @param {number} id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_updateUserCommon>}
 */
const updateUserCommon = async (app_id, data, id) => {
	let sql;
	let parameters;
	const error_code = data_validation_common(data);
	if (error_code==null){
		sql = `UPDATE <DB_SCHEMA/>.user_account
					SET username = :username,
						bio = :bio,
						private = :private,
						date_modified = CURRENT_TIMESTAMP
				  WHERE id = :id `;
		parameters ={	username: data.username,
						bio: data.bio,
						private: data.private,
						id: id
					};
		return await db_execute(app_id, sql, parameters, null);
	}
	else
		throw error_code;
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_deleteUser>}
 */
const deleteUser = async (app_id, id) => {
	const sql = `DELETE FROM <DB_SCHEMA/>.user_account
				  WHERE id = :id `;
	const parameters = {id: id};
	return await db_execute(app_id, sql, parameters, null);
};
/**
 * 
 * @param {number} app_id 
 * @param {import('../../../types.js').db_parameter_user_account_userLogin} data
 * @returns {Promise.<import('../../../types.js').db_result_user_account_userLogin[]>}
 */
const userLogin = async (app_id, data) => {
	const sql = `SELECT	id "id",
						bio "bio",
						username "username",
						password "password",
						email "email",
						active "active",
						avatar "avatar",
						app_role_id "app_role_id"
				   FROM <DB_SCHEMA/>.user_account
				  WHERE username = :username 
					AND provider_id IS NULL`;
	const parameters ={
						username: data.username
					};
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {import('../../../types.js').db_parameter_user_account_create} data
 * @returns {Promise.<import('../../../types.js').db_result_user_account_updateSigninProvider>}
 */
const updateSigninProvider = async (app_id, id, data) => {
	let parameters;
	const error_code = data_validation(data);
	if (error_code==null){
		const sql = `UPDATE <DB_SCHEMA/>.user_account
						SET identity_provider_id = :identity_provider_id,
							provider_id = :provider_id,
							provider_first_name = :provider_first_name,
							provider_last_name = :provider_last_name,
							provider_image = :provider_image,
							provider_image_url = :provider_image_url,
							provider_email = :provider_email,
							date_modified = CURRENT_TIMESTAMP
					WHERE id = :id
						AND active =1 `;
		parameters ={
						identity_provider_id: data.identity_provider_id,
						provider_id: data.provider_id,
						provider_first_name: data.provider_first_name,
						provider_last_name: data.provider_last_name,
						provider_image: data.provider_image,
						provider_image_url: data.provider_image_url,
						provider_email: data.provider_email,
						id: id,
						DB_CLOB: ['provider_image']
					};
		return await db_execute(app_id, sql, parameters);
	}
	else
		throw error_code;
};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} identity_provider_id 
 * @param {number} search_id
 * @returns {Promise.<import('../../../types.js').db_result_user_account_providerSignIn[]>}
 */
const providerSignIn = async (app_id, identity_provider_id, search_id) => {
	const sql = `SELECT	u.id "id",
						u.bio "bio",
						u.username "username",
						u.identity_provider_id "identity_provider_id",
						u.provider_id "provider_id",
						u.provider_first_name "provider_first_name",
						u.provider_last_name "provider_last_name",
						u.provider_image "provider_image",
						u.provider_image_url "provider_image_url",
						u.provider_email "provider_email",
						u.app_role_id "app_role_id"
				FROM <DB_SCHEMA/>.user_account u
				WHERE u.provider_id = :provider_id
				AND u.identity_provider_id = :identity_provider_id`;
	const parameters = {
						provider_id: search_id,
						identity_provider_id: identity_provider_id
					};
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number} app_id 
 * @param {string} email 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getEmailUser[]>}
 */
const getEmailUser = async (app_id, email) => {
	const sql = `SELECT id "id",
						email "email"
				   FROM <DB_SCHEMA/>.user_account
				  WHERE email = :email `;
	const parameters ={
					email: email
				};
	return await db_execute(app_id, sql, parameters, null, null, false);
};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} user_account_id 
 * @param {number} dba 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_getUserRoleAdmin[]>}
 */
const getUserRoleAdmin = async (app_id, user_account_id, dba) => {
	const sql = `SELECT app_role_id "app_role_id",
						COALESCE(ar.icon,ar_user.icon) "icon"
				   FROM <DB_SCHEMA/>.user_account ua
						LEFT OUTER JOIN <DB_SCHEMA/>.app_role ar
						ON ar.id = ua.app_role_id,
						<DB_SCHEMA/>.app_role ar_user
				  WHERE ua.id = :id 
					AND ar_user.id = :id_user_icon
					AND :id IS NOT NULL
				UNION ALL
				 SELECT	NULL "app_role_id",
						ar.icon "icon"
				   FROM <DB_SCHEMA/>.app_role ar
				  WHERE ar.id = :id_user_icon
					AND :id IS NULL`;
	const parameters ={
					id: user_account_id,
					id_user_icon: 2
				};
	return await db_execute(app_id, sql, parameters, dba, null, false);
};
/**
 * 
 * @param {number} app_id
 * @returns {Promise.<{rows:import('../../../types.js').db_result_user_account_getDemousers[]}>}
 */
const getDemousers = async app_id => {
	const sql = `SELECT id "id",
						username "username"	
				   FROM <DB_SCHEMA/>.user_account
				  WHERE user_level = :demo_level`;
	const parameters ={
					demo_level: 2
				};
	return await db_execute(app_id, sql, parameters, null, null, true);
};

export{	verification_code,
		/* database functions */
		getUsersAdmin, getUserAppRoleAdmin, getStatCountAdmin, updateUserSuperAdmin, create,
		activateUser, updateUserVerificationCode, getUserByUserId, getProfileUser,
		getProfileDetail, getProfileStat, checkPassword, updatePassword,
		updateUserLocal, updateUserCommon, deleteUser, userLogin, updateSigninProvider, providerSignIn,
		getEmailUser, getUserRoleAdmin, getDemousers};