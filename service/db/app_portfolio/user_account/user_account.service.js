const {execute_db_sql, get_schema_name} = require ("../../common/common.service");
function password_length_wrong(password){
    //constraint should be in db but password is encrypted when in db trigger
    //and saved with constant 60 characters length
    //check length before encrypted here
    if (password.length < 10 || password.length > 100){
        //'Password 10 - 100 characters'
        return true;
    }
    else
        return false;
}
function get_app_code (errorNum, message, code, errno, sqlMessage){
    var app_error_code = parseInt((JSON.stringify(errno) ?? JSON.stringify(errorNum)));
    //check if user defined exception
    if (app_error_code >= 20000){
        return app_error_code;
    } 
    else{
        //if known sql error
        if (errorNum ==1 || code == "ER_DUP_ENTRY") {
            var text_check;
            if (sqlMessage)
                text_check = JSON.stringify(sqlMessage);
            else
                text_check = JSON.stringify(message);
            var app_message_code = '';
            //check constraints errors, must be same name in mySQL and Oracle
            if (text_check.toUpperCase().includes("USER_ACCOUNT_EMAIL_UN"))
                app_message_code = 20200;
            if (text_check.toUpperCase().includes("USER_ACCOUNT_PROVIDER_ID_UN"))
                app_message_code = 20201;
            if (text_check.toUpperCase().includes("USER_ACCOUNT_USERNAME_UN"))
                app_message_code = 20203;
            if (app_message_code != ''){
                return app_message_code;
            }
            else
                return null;	
        }
        else
            //Oracle: value too large for column...
            //returns errorNum, message and offset 
            //mySQL:  gives more info
            //"code":"ER_DATA_TOO_LONG",
            //"errno":1406,
            //"sqlMessage":"Data too long for column 'password_reminder' at row 1",
            //"sqlState":"22001"
            if (errorNum ==12899 || errno==1406)
                return 20204;
            else
                return null;
    }
};
function verification_code(){
    return Math.floor(100000 + Math.random() * 900000);
}
function data_validation(data){
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
function validation_before_insert(data){
	let error_code = data_validation(data);
	if (error_code==null)
		return null;
	else
		return {"errorNum" : error_code};
}
function validation_before_update(data){
	let error_code = data_validation(data);
	if (error_code==null)
		return null;
	else
		return {"errorNum" : error_code};
}
module.exports = {
    create: (app_id, data, callBack) => {
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
			sql = `INSERT INTO ${get_schema_name()}.user_account(
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
			if (process.env.SERVICE_DB_USE == 2) {
				if (data.avatar != null)
					data.avatar = Buffer.from(data.avatar, 'utf8');
				if (data.provider_image != null)
					data.provider_image = Buffer.from(data.provider_image, 'utf8');
			}
			parameters = {
							bio: data.bio,
							private: data.private,
							user_level: data.user_level,
							username: data.username,
							password: data.password,
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
							provider_email: data.provider_email
						 };
			execute_db_sql(app_id, sql, parameters, null, 
						   __appfilename, __appfunction, __appline, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					if (process.env.SERVICE_DB_USE==1)
						return callBack(null, result);
					else{
						//Fetch id from rowid returned from Oracle
						//sample output:
						//{"lastRowid":"AAAWwdAAAAAAAdHAAC","rowsAffected":1}
						//remove "" before and after
						var lastRowid = JSON.stringify(result.lastRowid).replace(/"/g, '');
						sql = `SELECT id "insertId"
								 FROM ${get_schema_name()}.user_account
								WHERE rowid = :lastRowid`;
						parameters = {
										lastRowid: lastRowid
									 };
						execute_db_sql(app_id, sql, parameters, null, 
									   __appfilename, __appfunction, __appline, (err, result_id2)=>{
							if (err)
								return callBack(err, null);
							else
								return callBack(null, result_id2.rows[0]);
						})
					}
			});
		}
		else
			callBack(error_code, null);
        
    },
    activateUser: (app_id, id, verification_type, verification_code, auth, callBack) => {
		let sql;
    	let parameters;

		sql = `UPDATE ${get_schema_name()}.user_account
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
		parameters ={
						auth: auth,
						verification_type: verification_type,
						id: id,
						verification_code: verification_code
					};
		execute_db_sql(app_id, sql, parameters, null, 
					__appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else{
				if (process.env.SERVICE_DB_USE == 1) {
					return callBack(null, result);
				}
				else
					if (process.env.SERVICE_DB_USE == 2) {
						var oracle_json = {
							"count": result.rowsAffected,
							"affectedRows": result.rowsAffected
						};
						//use affectedRows as mysql in app
						return callBack(null, oracle_json);
					}
			}
		});
    },
	updateUserVerificationCode: (app_id, id, verification_code, callBack) => {
		let sql;
    	let parameters;
		sql = `UPDATE ${get_schema_name()}.user_account
				  SET verification_code = :verification_code,
					  active = 0,
					  date_modified = CURRENT_TIMESTAMP
				WHERE id = :id `;
		parameters ={verification_code: verification_code,
						id: id   
					}; 
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else{
				if (process.env.SERVICE_DB_USE == 1) {
					return callBack(null, result);
				}
				else
					if (process.env.SERVICE_DB_USE == 2) {
						var oracle_json = {
							"count": result.rowsAffected,
							"affectedRows": result.rowsAffected
						};
						//use affectedRows as mysql in app
						return callBack(null, oracle_json);
					}	
			}
		});
    },
    getUserByUserId: (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	u.id "id",
						u.bio "bio",
						(SELECT MAX(ul.date_created)
							FROM ${get_schema_name()}.user_account_logon ul
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
				 FROM   ${get_schema_name()}.user_account u
				WHERE   u.id = :id `;
		parameters = {
					  id: id
					 }; 
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    },
    getProfileUser: (app_id, id, username, id_current_user, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	u.id "id",
						u.bio "bio",
						(SELECT 1
							FROM DUAL
							WHERE u.private = 1
								AND (NOT EXISTS (SELECT NULL
											FROM ${get_schema_name()}.user_account_follow  uaf 
											WHERE uaf.user_account_id = u.id
												AND uaf.user_account_id_follow = :user_accound_id_current_user)
								OR 
								NOT EXISTS (SELECT NULL
											FROM ${get_schema_name()}.user_account_follow  uaf 
											WHERE uaf.user_account_id_follow = u.id
												AND uaf.user_account_id = :user_accound_id_current_user))
						UNION
						SELECT NULL
						FROM DUAL
						WHERE EXISTS (SELECT NULL
										FROM ${get_schema_name()}.user_account_follow  uaf 
										WHERE uaf.user_account_id = u.id
										AND uaf.user_account_id_follow = :user_accound_id_current_user)
							AND EXISTS (SELECT NULL
										FROM ${get_schema_name()}.user_account_follow  uaf 
										WHERE uaf.user_account_id_follow = u.id
										AND uaf.user_account_id = :user_accound_id_current_user)) "private",
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
							FROM ${get_schema_name()}.user_account_follow  u_following
							WHERE u_following.user_account_id = u.id) 					"count_following",
						(SELECT COUNT(u_followed.user_account_id_follow) 
							FROM ${get_schema_name()}.user_account_follow  u_followed
							WHERE u_followed.user_account_id_follow = u.id) 				"count_followed",
						(SELECT COUNT(u_likes.user_account_id)
							FROM ${get_schema_name()}.user_account_like    u_likes
							WHERE u_likes.user_account_id = u.id ) 						"count_likes",
						(SELECT COUNT(u_likes.user_account_id_like)
							FROM ${get_schema_name()}.user_account_like    u_likes
							WHERE u_likes.user_account_id_like = u.id )					"count_liked",
						(SELECT COUNT(u_views.user_account_id_view)
							FROM ${get_schema_name()}.user_account_view    u_views
							WHERE u_views.user_account_id_view = u.id ) 					"count_views",
						(SELECT COUNT(u_followed_current_user.user_account_id)
							FROM ${get_schema_name()}.user_account_follow  u_followed_current_user 
							WHERE u_followed_current_user.user_account_id_follow = u.id
							AND u_followed_current_user.user_account_id = :user_accound_id_current_user) 	"followed",
						(SELECT COUNT(u_liked_current_user.user_account_id)  
							FROM ${get_schema_name()}.user_account_like    u_liked_current_user
							WHERE u_liked_current_user.user_account_id_like = u.id
							AND u_liked_current_user.user_account_id = :user_accound_id_current_user)      "liked"
					FROM ${get_schema_name()}.user_account u
				WHERE (u.id = :id 
						OR 
						u.username = :username)
					AND u.active = 1
					AND EXISTS(SELECT NULL
								FROM ${get_schema_name()}.user_account_app uap
								WHERE uap.user_account_id = u.id
									AND uap.app_id = :app_id)`;
		parameters ={
			user_accound_id_current_user: id_current_user,
			id: id,
			username: username,
			app_id: app_id
		}; 
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    },
    searchProfileUser: (app_id, username, callBack) => {
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
				FROM ${get_schema_name()}.user_account u
				WHERE (u.username LIKE :username
						OR
						u.provider_first_name LIKE :provider_first_name)
				AND u.active = 1 
				AND EXISTS(SELECT NULL
								FROM ${get_schema_name()}.user_account_app uap
							WHERE uap.user_account_id = u.id
								AND uap.app_id = :app_id)`;
		parameters = {
						username: '%' + username + '%',
						provider_first_name: '%' + username + '%',
						app_id: app_id
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    getProfileDetail: (app_id, id, detailchoice, callBack) => {
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
						 FROM ${get_schema_name()}.user_account_follow u_follow,
							  ${get_schema_name()}.user_account u
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
						 FROM ${get_schema_name()}.user_account_follow u_followed,
							  ${get_schema_name()}.user_account u
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
						 FROM ${get_schema_name()}.user_account_like u_like,
							  ${get_schema_name()}.user_account u
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
						 FROM ${get_schema_name()}.user_account_like u_liked,
							  ${get_schema_name()}.user_account u
						WHERE u_liked.user_account_id_like = :user_account_id
						  AND u.id = u_liked.user_account_id
						  AND u.active = 1
						  AND 4 = :detailchoice) t
					ORDER BY 1, COALESCE(username, provider_first_name) `;
		parameters ={
						user_account_id: id,
						detailchoice: detailchoice
					}; 
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    getProfileTop: (app_id, statchoice, callBack) => {
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
				FROM (SELECT 'FOLLOWING' top,
							 u.id,
							 u.identity_provider_id,
							 u.provider_id,
							 u.avatar,
							 u.provider_image,
							 u.provider_image_url,
							 u.username,
							 u.provider_first_name,
							 (SELECT COUNT(u_follow.user_account_id_follow)
							    FROM ${get_schema_name()}.user_account_follow u_follow
							   WHERE u_follow.user_account_id_follow = u.id) count
						FROM ${get_schema_name()}.user_account u
					   WHERE u.active = 1
						 AND u.private <> 1
						 AND 1 = :statchoice
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
							 	FROM ${get_schema_name()}.user_account_like u_like
							   WHERE u_like.user_account_id_like = u.id) count
						FROM ${get_schema_name()}.user_account u
					   WHERE  u.active = 1
						 AND  u.private <> 1
						 AND  2 = :statchoice
					  UNION ALL
					  SELECT 'VISITED' top,
							 u.id,
							 u.identity_provider_id,
							 u.provider_id,
							 u.avatar,
							 u.provider_image,
							 u.provider_image_url,
							 u.username,
							 u.provider_first_name,
							 (SELECT COUNT(u_visited.user_account_id_view)
							 	FROM ${get_schema_name()}.user_account_view u_visited
							   WHERE u_visited.user_account_id_view = u.id) count
						FROM ${get_schema_name()}.user_account u
					   WHERE u.active = 1
						 AND u.private <> 1
						 AND 3 = :statchoice) t
				WHERE EXISTS(SELECT NULL
							   FROM ${get_schema_name()}.user_account_app uap
							  WHERE uap.user_account_id = t.id
								AND uap.app_id = :app_id)
				ORDER BY 1,10 DESC, COALESCE(username, provider_first_name) `;
		let limit = 10;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = sql + ` LIMIT ${limit}`;
		}
		else if (process.env.SERVICE_DB_USE == 2) {
			sql = sql + ` FETCH NEXT ${limit} ROWS ONLY`;
		}
		parameters = {
						statchoice: statchoice,
						app_id: app_id
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    checkPassword: (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT password "password"
				 FROM ${get_schema_name()}.user_account
				WHERE id = :id `;
		parameters = {
						id: id
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    },
	updatePassword: (app_id, id, data, callBack) => {
		let sql;
		let parameters;
		let error_code = validation_before_update(data);
		if (error_code==null){
			sql = `UPDATE ${get_schema_name()}.user_account
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
			execute_db_sql(app_id, sql, parameters, null, 
						__appfilename, __appfunction, __appline, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		}
		else
			callBack(error_code, null);
    },
    updateUserLocal: (app_id, data, search_id, callBack) => {
		let sql;
		let parameters;
		let error_code = validation_before_update(data);
		data.user_level = data.user_level ?? null;
		if (error_code==null){
			sql = `UPDATE ${get_schema_name()}.user_account
					  SET bio = :bio,
						  private = :private,
						  user_level = :user_level,
						  username = :username,
						  password = :password,
						  password_reminder = :password_reminder,
						  email = :email,
						  email_unverified = :new_email,
						  avatar = :avatar,
						  verification_code = :verification_code,
						  date_modified = CURRENT_TIMESTAMP
					WHERE id = :id `;
			if (process.env.SERVICE_DB_USE == 2) {
				data.avatar = Buffer.from(data.avatar, 'utf8');
			}
			parameters ={
				bio: data.bio,
				private: data.private,
				user_level: data.user_level,
				username: data.username,
				password: data.password,
				password_reminder: data.password_reminder,
				email: data.email,
				new_email: data.new_email,
				avatar: data.avatar,
				verification_code: data.verification_code,
				id: search_id
			}; 
			execute_db_sql(app_id, sql, parameters, null, 
						__appfilename, __appfunction, __appline, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		}
		else
			callBack(error_code, null);
    },
    updateUserCommon: (app_id, data, id, callBack) => {
		let sql;
		let parameters;
		let error_code = validation_before_update(data);
		if (error_code==null){
			sql = `UPDATE ${get_schema_name()}.user_account
					  SET username = :username,
						  bio = :bio,
						  private = :private,
						  user_level = :user_level,
						  date_modified = CURRENT_TIMESTAMP
					WHERE id = :id `;
			parameters ={	username: username,
							bio: data.bio,
							private: data.private,
							user_level: data.user_level,
							id: id
						}; 
			execute_db_sql(app_id, sql, parameters, null, 
						__appfilename, __appfunction, __appline, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		}
		else
			callBack(error_code, null);
    },
    deleteUser: (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${get_schema_name()}.user_account
				WHERE id = :id `;
		parameters = {
						id: id
					 };
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    userLogin: (app_id, data, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	id "id",
						bio "bio",
						username "username",
						password "password",
						email "email",
						active "active",
						avatar "avatar"
					FROM ${get_schema_name()}.user_account
				WHERE username = :username 
					AND provider_id IS NULL`;
		parameters ={
						username: data.username
					}; 
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    },
    updateSigninProvider: (app_id, id, data, callBack) => {
		let sql;
		let parameters;
		let error_code = validation_before_update(data);
		if (error_code==null){
			sql = `UPDATE ${get_schema_name()}.user_account
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
			if (process.env.SERVICE_DB_USE == 2) {
				data.provider_image = Buffer.from(data.provider_image, 'utf8');
			}
			parameters ={
							identity_provider_id: data.identity_provider_id,
							provider_id: data.provider_id,
							provider_first_name: data.provider_first_name,
							provider_last_name: data.provider_last_name,
							provider_image: data.provider_image,
							provider_image_url: data.provider_image_url,
							provider_email: data.provider_email,
							id: id
						}; 
			execute_db_sql(app_id, sql, parameters, null, 
						__appfilename, __appfunction, __appline, (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result[0]);
			});
		}
		else
			callBack(error_code, null);
    },
    providerSignIn: (app_id, identity_provider_id, search_id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	u.id "id",
						u.bio "bio",
						(SELECT MAX(ul.date_created)
							FROM ${get_schema_name()}.user_account_logon ul
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
					FROM ${get_schema_name()}.user_account u
					WHERE u.provider_id = :provider_id
					AND u.identity_provider_id = :identity_provider_id`;
		parameters = {
						provider_id: search_id,
						identity_provider_id: identity_provider_id
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    getStatCountAdmin: (app_id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT ua.identity_provider_id "identity_provider_id",
						CASE 
						WHEN ip.provider_name IS NULL THEN 
							'Local' 
						ELSE 
							ip.provider_name 
						END "provider_name",
						COUNT(*) "count_users"
				 FROM ${get_schema_name()}.user_account ua
					  LEFT OUTER JOIN ${get_schema_name()}.identity_provider ip
						ON ip.id = ua.identity_provider_id
				GROUP BY ua.identity_provider_id, ip.provider_name
				ORDER BY ua.identity_provider_id`;
		parameters = {};
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
	getEmailUser: (app_id, email, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT id "id",
					  email "email"
				 FROM ${get_schema_name()}.user_account
				WHERE email = :email `;
		parameters ={
						email: email
					}; 
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    }
};
module.exports.password_length_wrong = password_length_wrong;
module.exports.get_app_code = get_app_code;
module.exports.verification_code = verification_code;