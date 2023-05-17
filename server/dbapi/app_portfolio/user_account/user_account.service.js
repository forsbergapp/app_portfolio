const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema, db_limit_rows} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
const password_length_wrong = (password) => {
    if (password.length < 10 || password.length > 100){
        //'Password 10 - 100 characters'
        return true;
    }
    else
        return false;
}
const verification_code = () => {
    return Math.floor(100000 + Math.random() * 900000);
}
const data_validation = (data) => {
	data.username = data.username ?? null;
	data.bio = data.bio ?? null;
	data.password_reminder = data.password_reminder ?? null;
	data.email_unverified = data.email_unverified ?? null;
	data.verification_code = data.verification_code ?? null;
	data.provider_id = data.provider_id ?? null;
	
	if (data.provider_id != null){
		data.password = null;
		data.password_reminder = null;
		data.email = null;
		data.email_unverified = null;
		data.avatar = null;
		data.verification_code = null;
	}
    if (data.username != null && (data.username.length < 5 || data.username.length > 100)){
		//'username 5 - 100 characters'
		return 20100;
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
			return 20101;
		}
		else
			if (data.bio != null && data.bio.length > 100){
				//'bio max 100 characters'
				return 20102;
			}
			else 
				if (data.email != null && data.email.length > 100){
					//'email max 100 characters'
					return 20103;
				}
				else
					if (data.password_reminder != null && data.password_reminder.length > 100){
						//'reminder max 100 characters'
						return 20104;
					}
					else
						if (data.email != null && data.email.slice(-10) != '@localhost' && data.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)==null){
							//'not valid email' (ignore emails that ends with '@localhost')
							return 20105;
						}
						else
							if (data.email_unverified != null && data.email_unverified.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)==null){
								//'not valid email'
								return 20105;
							}
							else
								if (data.provider_id == null && (data.username == null || data.password==null || data.email==null)){
									//'Username, password and email are required'
									return 20107;
								}
								else
									return null;
}
const validation_before_insert = (data) => {
	let error_code = data_validation(data);
	if (error_code==null)
		return null;
	else
		return {"errorNum" : error_code};
}
const validation_before_update = (data) => {
	let error_code = data_validation(data);
	if (error_code==null)
		return null;
	else
		return {"errorNum" : error_code};
}

const getUsersAdmin = (app_id, search, sort, order_by, offset, limit, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT ua.avatar "avatar",
		              ua.id "id",
					  ua.app_role_id "app_role_id",
					  (SELECT ap_user.icon
						 FROM ${db_schema()}.app_role ap_user
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
					  ua.date_modified "date_modified"
				 FROM ${db_schema()}.user_account ua
					  LEFT OUTER JOIN ${db_schema()}.identity_provider ip
						ON ip.id = ua.identity_provider_id
					  LEFT OUTER JOIN ${db_schema()}.app_role ap
						ON ap.id = ua.app_role_id
				WHERE (ua.username LIKE :search
				   OR ua.bio LIKE :search
				   OR ua.email LIKE :search
				   OR ua.email_unverified LIKE :search
				   OR ua.provider_first_name LIKE :search
				   OR ua.provider_last_name LIKE :search
				   OR ua.provider_email LIKE :search)
				   OR :search = '*'
				ORDER BY ${sort} ${order_by}`;
		sql = db_limit_rows(sql, null);
		if (search!='*')
			search = '%' + search + '%';
		parameters = {search: search,
					  offset: offset ?? 0,
					  limit: limit ?? parseInt(ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_SEARCH')),
					 };
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const getUserAppRoleAdmin = (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT app_role_id "app_role_id"
				 FROM ${db_schema()}.user_account
				WHERE id = :id`;
		parameters = {id: id};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
const getStatCountAdmin = (app_id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT ua.identity_provider_id "identity_provider_id",
						CASE 
						WHEN ip.provider_name IS NULL THEN 
							NULL
						ELSE 
							ip.provider_name 
						END "provider_name",
						COUNT(*) "count_users"
				 FROM ${db_schema()}.user_account ua
					  LEFT OUTER JOIN ${db_schema()}.identity_provider ip
						ON ip.id = ua.identity_provider_id
				GROUP BY ua.identity_provider_id, ip.provider_name
				ORDER BY ua.identity_provider_id`;
		parameters = {};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const updateUserSuperAdmin = (app_id, id, data, callBack) => {
		let sql;
		let parameters;
		if (data.active =='')
			data.active = null;
		if (data.email_unverified =='')
			data.email_unverified = null;
		if (data.app_role_id=='')
			data.app_role_id = null;
		if (data.bio=='')
			data.bio = null;
		if (data.user_level=='')
			data.user_level = null;
		if (data.password_reminder=='')
			data.password_reminder = null;
		if (data.verification_code=='')
			data.verification_code = null;
		let error_code = validation_before_update(data);
		if (error_code==null){
			sql = `UPDATE ${db_schema()}.user_account
					SET app_role_id = :app_role_id,
						active = :active,
						user_level = :user_level,
						private = :private,
						username = :username,
						bio = :bio,
						email = :email,
						email_unverified = :email_unverified,
						password = :password,
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
						password: data.password,
						password_reminder: data.password_reminder,
						verification_code: data.verification_code
						};
			db_execute(app_id, sql, parameters, null, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		}
		else
			callBack(error_code, null);
    }
const create = (app_id, data, callBack) => {
		let sql;
    	let parameters;
		if (typeof data.provider_id != 'undefined' && 
		    data.provider_id != '' && 
			data.provider_id){
            //generate local username for provider 1
            data.username = `${data.provider_first_name}${Date.now()}`;
        }
		let error_code = validation_before_insert(data);
		if (error_code==null){
			sql = `INSERT INTO ${db_schema()}.user_account(
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
							:password,
							:Xpassword_reminder,
							:email,
							:avatar,
							:verification_code,
							:active,
							:identity_provider_id,
							:provider_id,
							:provider_first_name,
							:provider_last_name,
							:provider_image,
							:provider_Ximage_url,
							:provider_email) `;				
			if (ConfigGet(1, 'SERVICE_DB', 'USE') == '3') {
				sql = sql + ' RETURNING id ';
			}
			parameters = {
							bio: data.bio,
							private: data.private,
							user_level: data.user_level,
							username: data.username,
							password: data.password,
							Xpassword_reminder: data.password_reminder,
							email: data.email,
							avatar: data.avatar,
							verification_code: data.verification_code,
							active: data.active,
							identity_provider_id: data.identity_provider_id,
							provider_id: data.provider_id,
							provider_first_name: data.provider_first_name,
							provider_last_name: data.provider_last_name,
							provider_image: data.provider_image,
							provider_Ximage_url: data.provider_image_url,
							provider_email: data.provider_email
						 };
			db_execute(app_id, sql, parameters, null, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
						case '1':
						case '2':
						case '3':{
							return callBack(null, result);
							break;
						}
						case '4':{
							//Fetch id from rowid returned from Oracle
							//sample output:
							//{"lastRowid":"AAAWwdAAAAAAAdHAAC","rowsAffected":1}
							//remove "" before and after
							let lastRowid = JSON.stringify(result.lastRowid).replace(/"/g, '');
							sql = `SELECT id "insertId"
									FROM ${db_schema()}.user_account
									WHERE rowid = :lastRowid`;
							parameters = {
											lastRowid: lastRowid
										};
							db_execute(app_id, sql, parameters, null, (err, result_id2)=>{
								if (err)
									return callBack(err, null);
								else
									return callBack(null, result_id2[0]);
							});
							break;
						}
					}
			});
		}
		else
			callBack(error_code, null);
        
    }
const activateUser = (app_id, id, verification_type, verification_code, auth, callBack) => {
		let sql;
    	let parameters;

		sql = `UPDATE ${db_schema()}.user_account
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
		if (ConfigGet(1, 'SERVICE_DB', 'USE')=='3'){
			sql = sql + ' RETURNING id';
		}
		parameters ={
						auth: auth,
						verification_type: verification_type,
						id: id,
						verification_code: verification_code
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const updateUserVerificationCode = (app_id, id, verification_code, callBack) => {
		let sql;
    	let parameters;
		sql = `UPDATE ${db_schema()}.user_account
				  SET verification_code = :verification_code,
					  active = 0,
					  date_modified = CURRENT_TIMESTAMP
				WHERE id = :id `;
		if (ConfigGet(1, 'SERVICE_DB', 'USE')=='3'){
			sql = sql + ' RETURNING id';
		}
		parameters ={
						verification_code: verification_code,
						id: id   
					}; 
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const getUserByUserId = (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	u.id "id",
						u.bio "bio",
						(SELECT MAX(ul.date_created)
							FROM ${db_schema()}.user_account_logon ul
							WHERE ul.user_account_id = u.id
							AND ul.result=1) "last_logontime",
						u.private "private",
						u.user_level "user_level",
						u.date_created "date_created",
						u.date_modified "date_modified",
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
						u.provider_email "provider_email"
				 FROM   ${db_schema()}.user_account u
				WHERE   u.id = :id `;
		parameters = {
					  id: id
					 };
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    }
const getProfileUser = (app_id, id, username, id_current_user, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	u.id "id",
						u.bio "bio",
						(SELECT 1
						   FROM ${db_schema()}.user_account ua_current
						  WHERE u.private = 1
						    AND ua_current.id = :user_accound_id_current_user
							and u.id <> :user_accound_id_current_user
							AND (NOT EXISTS (SELECT NULL
											   FROM ${db_schema()}.user_account_follow  uaf 
											  WHERE uaf.user_account_id = u.id
												AND uaf.user_account_id_follow = ua_current.id)
								 OR 
								 NOT EXISTS (SELECT NULL
											   FROM ${db_schema()}.user_account_follow  uaf 
											  WHERE uaf.user_account_id_follow = u.id
												AND uaf.user_account_id = ua_current.id)
								)) "private",
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
							FROM ${db_schema()}.user_account_follow  u_following
							WHERE u_following.user_account_id = u.id) 					"count_following",
						(SELECT COUNT(u_followed.user_account_id_follow) 
							FROM ${db_schema()}.user_account_follow  u_followed
							WHERE u_followed.user_account_id_follow = u.id) 				"count_followed",
						(SELECT COUNT(u_likes.user_account_id)
							FROM ${db_schema()}.user_account_like    u_likes
							WHERE u_likes.user_account_id = u.id ) 						"count_likes",
						(SELECT COUNT(u_likes.user_account_id_like)
							FROM ${db_schema()}.user_account_like    u_likes
							WHERE u_likes.user_account_id_like = u.id )					"count_liked",
						(SELECT COUNT(u_views.user_account_id_view)
							FROM ${db_schema()}.user_account_view    u_views
							WHERE u_views.user_account_id_view = u.id ) 					"count_views",
						(SELECT COUNT(u_followed_current_user.user_account_id)
							FROM ${db_schema()}.user_account_follow  u_followed_current_user 
							WHERE u_followed_current_user.user_account_id_follow = u.id
							AND u_followed_current_user.user_account_id = :user_accound_id_current_user) 	"followed",
						(SELECT COUNT(u_liked_current_user.user_account_id)  
							FROM ${db_schema()}.user_account_like    u_liked_current_user
							WHERE u_liked_current_user.user_account_id_like = u.id
							AND u_liked_current_user.user_account_id = :user_accound_id_current_user)      "liked"
				 FROM ${db_schema()}.user_account u
				WHERE (u.id = :id 
					   OR 
					   u.username = :username)
				  AND u.active = 1
				  AND EXISTS(SELECT NULL
							   FROM ${db_schema()}.user_account_app uap
							  WHERE uap.user_account_id = u.id
								AND uap.app_id = :app_id)`;
		parameters ={
			user_accound_id_current_user: id_current_user,
			id: id,
			username: username,
			app_id: app_id
		}; 
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    }
const searchProfileUser = (app_id, username, callBack) => {
		let sql;
		let parameters;
		sql= `SELECT	u.id "id",
						u.username "username",
						u.avatar "avatar",
						u.identity_provider_id "identity_provider_id",
						u.provider_id "provider_id",
						u.provider_first_name "provider_first_name",
						u.provider_image "provider_image",
						u.provider_image_url "provider_image_url"
				FROM ${db_schema()}.user_account u
				WHERE (u.username LIKE :username
						OR
						u.provider_first_name LIKE :provider_first_name)
				AND u.active = 1 
				AND EXISTS(SELECT NULL
								FROM ${db_schema()}.user_account_app uap
							WHERE uap.user_account_id = u.id
								AND uap.app_id = :app_id)`;
		sql = db_limit_rows(sql, 1);
		parameters = {
						username: '%' + username + '%',
						provider_first_name: '%' + username + '%',
						app_id: app_id
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const getProfileDetail = (app_id, id, detailchoice, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT detail "detail",
		              id "id",
					  provider_id "provider_id",
					  avatar "avatar",
					  provider_image "provider_image",
					  provider_image_url "provider_image_url",
					  username "username",
					  provider_first_name "provider_first_name"
				 FROM (SELECT 'FOLLOWING' detail,
							  u.id,
							  u.provider_id,
							  u.avatar,
							  u.provider_image,
							  u.provider_image_url,
							  u.username,
							  u.provider_first_name
						 FROM ${db_schema()}.user_account_follow u_follow,
							  ${db_schema()}.user_account u
						WHERE u_follow.user_account_id = :user_account_id
						  AND u.id = u_follow.user_account_id_follow
						  AND u.active = 1
						  AND 1 = :detailchoice
					   UNION ALL
					   SELECT 'FOLLOWED' detail,
							  u.id,
							  u.provider_id,
							  u.avatar,
							  u.provider_image,
							  u.provider_image_url,
							  u.username,
							  u.provider_first_name
						 FROM ${db_schema()}.user_account_follow u_followed,
							  ${db_schema()}.user_account u
						WHERE u_followed.user_account_id_follow = :user_account_id
						  AND u.id = u_followed.user_account_id
						  AND u.active = 1
						  AND 2 = :detailchoice
					   UNION ALL
					   SELECT 'LIKE_USER' detail,
							  u.id,
							  u.provider_id,
							  u.avatar,
							  u.provider_image,
							  u.provider_image_url,
							  u.username,
							  u.provider_first_name
						 FROM ${db_schema()}.user_account_like u_like,
							  ${db_schema()}.user_account u
						WHERE u_like.user_account_id = :user_account_id
						  AND u.id = u_like.user_account_id_like
						  AND u.active = 1
						  AND 3 = :detailchoice
					   UNION ALL
					   SELECT 'LIKED_USER' detail,
							  u.id,
							  u.provider_id,
							  u.avatar,
							  u.provider_image,
							  u.provider_image_url,
							  u.username,
							  u.provider_first_name
						 FROM ${db_schema()}.user_account_like u_liked,
							  ${db_schema()}.user_account u
						WHERE u_liked.user_account_id_like = :user_account_id
						  AND u.id = u_liked.user_account_id
						  AND u.active = 1
						  AND 4 = :detailchoice) t
					ORDER BY 1, COALESCE(username, provider_first_name) `;
		sql = db_limit_rows(sql,1);
		parameters ={
						user_account_id: id,
						detailchoice: detailchoice
					}; 
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const getProfileTop = (app_id, statchoice, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT top "top", 
					  id "id", 
					  identity_provider_id "identity_provider_id", 
					  provider_id "provider_id", 
					  avatar "avatar",
					  provider_image "provider_image",
					  provider_image_url "provider_image_url",
					  username "username",
					  provider_first_name "provider_first_name",
					  count "count"
				FROM (SELECT 'VISITED' top,
							  u.id,
							  u.identity_provider_id,
							  u.provider_id,
							  u.avatar,
							  u.provider_image,
							  u.provider_image_url,
							  u.username,
							  u.provider_first_name,
							  (SELECT COUNT(u_visited.user_account_id_view)
							     FROM ${db_schema()}.user_account_view u_visited
							    WHERE u_visited.user_account_id_view = u.id) count
						FROM ${db_schema()}.user_account u
					   WHERE u.active = 1
						 AND u.private <> 1
						 AND 1 = :statchoice
					  UNION ALL
					  SELECT 'FOLLOWING' top,
							 u.id,
							 u.identity_provider_id,
							 u.provider_id,
							 u.avatar,
							 u.provider_image,
							 u.provider_image_url,
							 u.username,
							 u.provider_first_name,
							 (SELECT COUNT(u_follow.user_account_id_follow)
							    FROM ${db_schema()}.user_account_follow u_follow
							   WHERE u_follow.user_account_id_follow = u.id) count
						FROM ${db_schema()}.user_account u
					   WHERE u.active = 1
						 AND u.private <> 1
						 AND 2 = :statchoice
					  UNION ALL
					  SELECT 'LIKE_USER' top,
							 u.id,
							 u.identity_provider_id,
							 u.provider_id,
							 u.avatar,
							 u.provider_image,
							 u.provider_image_url,
							 u.username,
							 u.provider_first_name,
							 (SELECT COUNT(u_like.user_account_id_like)
							 	FROM ${db_schema()}.user_account_like u_like
							   WHERE u_like.user_account_id_like = u.id) count
						FROM ${db_schema()}.user_account u
					   WHERE  u.active = 1
						 AND  u.private <> 1
						 AND  3 = :statchoice) t
				WHERE EXISTS(SELECT NULL
							   FROM ${db_schema()}.user_account_app uap
							  WHERE uap.user_account_id = t.id
								AND uap.app_id = :app_id)
				ORDER BY 1,10 DESC, COALESCE(username, provider_first_name) `;
		sql = db_limit_rows(sql,2);
		parameters = {
						statchoice: statchoice,
						app_id: app_id
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const checkPassword = (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT password "password"
				 FROM ${db_schema()}.user_account
				WHERE id = :id `;
		parameters = {
						id: id
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    }
const updatePassword = (app_id, id, data, callBack) => {
		let sql;
		let parameters;
		let error_code = validation_before_update(data);
		if (error_code==null){
			sql = `UPDATE ${db_schema()}.user_account
					  SET password = :new_password,
						  verification_code = null
					WHERE id = :id  
					  AND verification_code = :auth
					  AND verification_code IS NOT NULL`;
			parameters ={
							new_password: data.new_password,
							id: id,
							auth: data.auth
						}; 
			db_execute(app_id, sql, parameters, null, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		}
		else
			callBack(error_code, null);
    }
const updateUserLocal = (app_id, data, search_id, callBack) => {
		let sql;
		let parameters;
		let error_code = validation_before_update(data);
		if (error_code==null){
			sql = `UPDATE ${db_schema()}.user_account
					  SET bio = :bio,
						  private = :private,
						  username = :username,
						  password = :password,
						  password_reminder = :Xpassword_reminder,
						  email = :email,
						  email_unverified = :new_email,
						  avatar = :avatar,
						  verification_code = :verification_code,
						  date_modified = CURRENT_TIMESTAMP
					WHERE id = :id `;
			parameters ={
				bio: data.bio,
				private: data.private,
				username: data.username,
				password: data.password,
				Xpassword_reminder: data.password_reminder,
				email: data.email,
				new_email: data.new_email,
				avatar: data.avatar,
				verification_code: data.verification_code,
				id: search_id
			}; 
			db_execute(app_id, sql, parameters, null, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		}
		else
			callBack(error_code, null);
    }
const updateUserCommon = (app_id, data, id, callBack) => {
		let sql;
		let parameters;
		let error_code = validation_before_update(data);
		if (error_code==null){
			sql = `UPDATE ${db_schema()}.user_account
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
			db_execute(app_id, sql, parameters, null, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		}
		else
			callBack(error_code, null);
    }
const deleteUser = (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${db_schema()}.user_account
				WHERE id = :id `;
		parameters = {
						id: id
					 };
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const userLogin = (app_id, data, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	id "id",
						bio "bio",
						username "username",
						password "password",
						email "email",
						active "active",
						avatar "avatar",
						app_role_id "app_role_id"
					FROM ${db_schema()}.user_account
				WHERE username = :username 
					AND provider_id IS NULL`;
		parameters ={
						username: data.username
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    }
const updateSigninProvider = (app_id, id, data, callBack) => {
		let sql;
		let parameters;
		let error_code = validation_before_update(data);
		if (error_code==null){
			sql = `UPDATE ${db_schema()}.user_account
					  SET identity_provider_id = :identity_provider_id,
						  provider_id = :provider_id,
						  provider_first_name = :provider_first_name,
						  provider_last_name = :provider_last_name,
						  provider_image = :provider_image,
						  provider_image_url = :provider_Ximage_url,
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
							provider_Ximage_url: data.provider_image_url,
							provider_email: data.provider_email,
							id: id
						};
			db_execute(app_id, sql, parameters, null, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result[0]);
			});
		}
		else
			callBack(error_code, null);
    }
const providerSignIn = (app_id, identity_provider_id, search_id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	u.id "id",
						u.bio "bio",
						(SELECT MAX(ul.date_created)
							FROM ${db_schema()}.user_account_logon ul
							WHERE ul.user_account_id = u.id
							AND ul.result=1) "last_logontime",
						u.date_created "date_created",
						u.date_modified "date_modified",
						u.username "username",
						u.password "password",
						u.password_reminder "password_reminder",
						u.email "email",
						u.avatar "avatar",
						u.verification_code "verification_code",
						u.active "active",
						u.identity_provider_id "identity_provider_id",
						u.provider_id "provider_id",
						u.provider_first_name "provider_first_name",
						u.provider_last_name "provider_last_name",
						u.provider_image "provider_image",
						u.provider_image_url "provider_image_url",
						u.provider_email "provider_email"
					FROM ${db_schema()}.user_account u
					WHERE u.provider_id = :provider_id
					AND u.identity_provider_id = :identity_provider_id`;
		parameters = {
						provider_id: search_id,
						identity_provider_id: identity_provider_id
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    }
const getEmailUser = (app_id, email, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT id "id",
					  email "email"
				 FROM ${db_schema()}.user_account
				WHERE email = :email `;
		parameters ={
						email: email
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    }
const getUserRoleAdmin = (app_id, user_account_id, system_admin, callBack) => {
		let sql;
		let parameters;
		if (user_account_id =='')
			user_account_id = null;
		sql = `SELECT app_role_id "app_role_id",
					  COALESCE(ar.icon,ar_user.icon) "icon"
				 FROM ${db_schema()}.user_account ua
				      LEFT OUTER JOIN ${db_schema()}.app_role ar
				      ON ar.id = ua.app_role_id,
					  ${db_schema()}.app_role ar_user
				WHERE ua.id = :id 
				 AND  ar_user.id = :id_user_icon
				 AND :id IS NOT NULL
				UNION ALL
			   SELECT NULL "app_role_id",
			          ar.icon "icon"
				 FROM ${db_schema()}.app_role ar
				WHERE ar.id = :id_user_icon
				  AND :id IS NULL`;
		parameters ={
						id: user_account_id,
						id_user_icon: 2
					};
		//use pool column 2 for system admin
		db_execute(app_id, sql, parameters, system_admin==1?2:null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	}
	const getDemousers = (app_id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT id "id"
				 FROM ${db_schema()}.user_account
				WHERE user_level = :demo_level`;
		parameters ={
						demo_level: 2
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}

export{password_length_wrong, verification_code,
	   getUsersAdmin, getUserAppRoleAdmin, getStatCountAdmin, updateUserSuperAdmin, create,
	   activateUser, updateUserVerificationCode, getUserByUserId, getProfileUser,
	   searchProfileUser, getProfileDetail, getProfileTop, checkPassword, updatePassword,
	   updateUserLocal, updateUserCommon, deleteUser, userLogin, updateSigninProvider, providerSignIn,
	   getEmailUser, getUserRoleAdmin, getDemousers}