const {execute_db_sql} = require ("../../config/database");
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
            if (text_check.toUpperCase().includes("USER_ACCOUNT_PROVIDER1_ID_UN"))
                app_message_code = 20201;
            if (text_check.toUpperCase().includes("USER_ACCOUNT_PROVIDER2_ID_UN"))
                app_message_code = 20202;
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
module.exports = {
    create: (app_id, data, callBack) => {
		let sql;
    	let parameters;
		if (typeof data.provider1_id != 'undefined' && 
		    data.provider1_id != '' && 
			data.provider1_id){
            //generate local username for provider 1
            data.username = `${data.provider1_first_name}${Date.now()}`;
        }
		if (typeof data.provider2_id != 'undefined' && 
		    data.provider2_id != '' && 
			data.provider2_id){
            //generate local username for provider 2
            data.username = `${data.provider2_first_name}${Date.now()}`;
        }
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account(
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
						provider1_id,
						provider1_first_name,
						provider1_last_name,
						provider1_image,
						provider1_image_url,
						provider1_email,
						provider2_id,
						provider2_first_name,
						provider2_last_name,
						provider2_image,
						provider2_image_url,
						provider2_email)
					VALUES(?,?,?,SYSDATE(),SYSDATE(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `;
			parameters = [
							data.bio,
							data.private,
							data.user_level,
							data.username,
							data.password,
							data.password_reminder,
							data.email,
							data.avatar,
							data.verification_code,
							data.active,
							data.provider1_id,
							data.provider1_first_name,
							data.provider1_last_name,
							data.provider1_image,
							data.provider1_image_url,
							data.provider1_email,
							data.provider2_id,
							data.provider2_first_name,
							data.provider2_last_name,
							data.provider2_image,
							data.provider2_image_url,
							data.provider2_email
						];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account(
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
						provider1_id,
						provider1_first_name,
						provider1_last_name,
						provider1_image,
						provider1_image_url,
						provider1_email,
						provider2_id,
						provider2_first_name,
						provider2_last_name,
						provider2_image,
						provider2_image_url,
						provider2_email)
					VALUES(:bio,
						:private,
						:user_level,
						SYSDATE,
						SYSDATE,
						:username,
						:password,
						:password_reminder,
						:email,
						:avatar,
						:verification_code,
						:active,
						:provider1_id,
						:provider1_first_name,
						:provider1_last_name,
						:provider1_image,
						:provider1_image_url,
						:provider1_email,
						:provider2_id,
						:provider2_first_name,
						:provider2_last_name,
						:provider2_image,
						:provider2_image_url,
						:provider2_email) `;
			if (data.avatar != null)
				data.avatar = Buffer.from(data.avatar, 'utf8');
			if (data.provider1_image != null)
				data.provider1_image = Buffer.from(data.provider1_image, 'utf8');
			if (data.provider2_image != null)
				data.provider2_image = Buffer.from(data.provider2_image, 'utf8');
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
							provider1_id: data.provider1_id,
							provider1_first_name: data.provider1_first_name,
							provider1_last_name: data.provider1_last_name,
							provider1_image: data.provider1_image,
							provider1_image_url: data.provider1_image_url,
							provider1_email: data.provider1_email,
							provider2_id: data.provider2_id,
							provider2_first_name: data.provider2_first_name,
							provider2_last_name: data.provider2_last_name,
							provider2_image: data.provider2_image,
							provider2_image_url: data.provider2_image_url,
							provider2_email: data.provider2_email
						};
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
							 FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
							WHERE rowid = :lastRowid`;
					parameters = {
									lastRowid: lastRowid
								 };
					execute_db_sql(app_id, app_id, sql, parameters, null, 
						           __appfilename, __appfunction, __appline, (err, result_id2)=>{
						if (err)
							return callBack(err, null);
						else
							return callBack(null, result_id2.rows[0]);
					})
				}
		});
    },
    activateUser: (app_id, id, verification_type, verification_code, auth, callBack) => {
		let sql;
    	let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
						SET	active = 1,
							verification_code = ?,
							email = CASE 
									WHEN  ? = 4 THEN 
										email_unverified
									ELSE 
										email
									END,
							email_unverified = CASE 
											WHEN  ? = 4 THEN 
													null
											ELSE 
													email_unverified
											END,
							date_modified = SYSDATE()
					WHERE id = ?
						AND verification_code = ?`;
			parameters = [	auth,
							verification_type,
							verification_type,
							id,
							verification_code
						 ];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
						SET	active = 1,
							verification_code = :auth,
							email = CASE 
									WHEN  :verification_type = 4 THEN 
										email_unverified
									ELSE 
										email
									END,
							email_unverified = CASE 
											WHEN  :verification_type = 4 THEN 
													null
											ELSE 
													email_unverified
											END,
							date_modified = SYSDATE
					WHERE id = :id
						AND verification_code = :verification_code `;
			parameters ={
							auth: auth,
							verification_type: verification_type,
							id: id,
							verification_code: verification_code
						};
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
						SET	verification_code = ?,
							active = 0,
							date_modified = SYSDATE()
					WHERE id = ?`;
			parameters = [verification_code,
						  id
						 ];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
						SET	verification_code = :verification_code,
							active = 0,
							date_modified = SYSDATE
					WHERE id = :id `;
			parameters ={verification_code: verification_code,
						 id: id   
						}; 
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT	u.id,
							u.bio,
							(SELECT MAX(ul.date_created)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_logon ul
							WHERE ul.user_account_id = u.id
								AND ul.result=1) last_logontime,
							u.private,
							u.user_level,
							u.date_created,
							u.date_modified,
							u.username,
							u.password,
							u.password_reminder,
							u.email,
							u.email_unverified,
							CONVERT(u.avatar USING UTF8) avatar,
							u.verification_code,
							u.active,
							u.provider1_id,
							u.provider1_first_name,
							u.provider1_last_name,
							CONVERT(u.provider1_image USING UTF8) provider1_image,
							u.provider1_image_url,
							u.provider1_email,
							u.provider2_id,
							u.provider2_first_name,
							u.provider2_last_name,
							CONVERT(u.provider2_image USING UTF8) provider2_image,
							u.provider2_image_url,
							u.provider2_email
						FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account u
						WHERE u.id = ? `;
			parameters = [id];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT	u.id "id",
							u.bio "bio",
							(SELECT MAX(ul.date_created)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_logon ul
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
							u.provider1_id "provider1_id",
							u.provider1_first_name "provider1_first_name",
							u.provider1_last_name "provider1_last_name",
							u.provider1_image "provider1_image",
							u.provider1_image_url "provider1_image_url",
							u.provider1_email "provider1_email",
							u.provider2_id "provider2_id",
							u.provider2_first_name "provider2_first_name",
							u.provider2_last_name "provider2_last_name",
							u.provider2_image "provider2_image",
							u.provider2_image_url "provider2_image_url",
							u.provider2_email "provider2_email"
						FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account u
						WHERE u.id = :id `;
			parameters = {
							id: id
						 }; 
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT	u.id,
							u.bio,
							(SELECT 1
							FROM DUAL
							WHERE u.private = 1
								AND (NOT EXISTS (SELECT NULL
												FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  uaf 
												WHERE uaf.user_account_id = u.id
												AND uaf.user_account_id_follow = ?)
									OR 
									NOT EXISTS (SELECT NULL
												FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  uaf 
												WHERE uaf.user_account_id_follow = u.id
													AND uaf.user_account_id = ?))
							UNION
							SELECT NULL
							FROM DUAL
							WHERE EXISTS (SELECT NULL
											FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  uaf 
											WHERE uaf.user_account_id = u.id
											AND uaf.user_account_id_follow = ?)
							AND EXISTS (SELECT NULL
											FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  uaf 
											WHERE uaf.user_account_id_follow = u.id
											AND uaf.user_account_id = ?)) private,
							u.user_level,
							u.date_created,
							u.username,
							CONVERT(u.avatar USING UTF8) avatar,
							u.provider1_id,
							u.provider1_first_name,
							u.provider1_last_name,
							CONVERT(u.provider1_image USING UTF8) provider1_image,
							u.provider1_image_url,
							u.provider2_id,
							u.provider2_first_name,
							u.provider2_last_name,
							CONVERT(u.provider2_image USING UTF8) provider2_image,
							u.provider2_image_url,
							(SELECT COUNT(u_following.user_account_id)   
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  u_following
							WHERE u_following.user_account_id = u.id) 					count_following,
							(SELECT COUNT(u_followed.user_account_id_follow) 
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  u_followed
							WHERE u_followed.user_account_id_follow = u.id) 				count_followed,
							(SELECT COUNT(u_likes.user_account_id)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_like    u_likes
							WHERE u_likes.user_account_id = u.id ) 						count_likes,
							(SELECT COUNT(u_likes.user_account_id_like)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_like    u_likes
							WHERE u_likes.user_account_id_like = u.id )					count_liked,
							(SELECT COUNT(u_views.user_account_id_view)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_view    u_views
							WHERE u_views.user_account_id_view = u.id ) 					count_views,
							(SELECT COUNT(u_followed_current_user.user_account_id)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  u_followed_current_user 
							WHERE u_followed_current_user.user_account_id_follow = u.id
								AND u_followed_current_user.user_account_id = ?) 			followed,
							(SELECT COUNT(u_liked_current_user.user_account_id)  
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_like    u_liked_current_user
							WHERE u_liked_current_user.user_account_id_like = u.id
								AND u_liked_current_user.user_account_id = ?)      			liked
						FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account u
					WHERE (u.id = ? 
							OR 
							u.username = ?)
						AND u.active = 1
						AND EXISTS(SELECT NULL
									FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app uap
									WHERE uap.user_account_id = u.id
									AND uap.app_id = ?)`;
			parameters = [	id_current_user,
							id_current_user,
							id_current_user,
							id_current_user,
							id_current_user,
							id_current_user,
							id,
							username,
							app_id
						];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT	u.id "id",
							u.bio "bio",
							(SELECT 1
								FROM DUAL
							WHERE u.private = 1
								AND (NOT EXISTS (SELECT NULL
												FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  uaf 
												WHERE uaf.user_account_id = u.id
													AND uaf.user_account_id_follow = :user_accound_id_current_user)
									OR 
									NOT EXISTS (SELECT NULL
												FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  uaf 
												WHERE uaf.user_account_id_follow = u.id
													AND uaf.user_account_id = :user_accound_id_current_user))
							UNION
							SELECT NULL
							FROM DUAL
							WHERE EXISTS (SELECT NULL
											FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  uaf 
											WHERE uaf.user_account_id = u.id
											AND uaf.user_account_id_follow = :user_accound_id_current_user)
								AND EXISTS (SELECT NULL
											FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow  uaf 
											WHERE uaf.user_account_id_follow = u.id
											AND uaf.user_account_id = :user_accound_id_current_user)) "private",
							u.user_level "user_level",
							u.date_created "date_created",
							u.username "username",
							u.avatar "avatar",
							u.provider1_id "provider1_id",
							u.provider1_first_name "provider1_first_name",
							u.provider1_last_name "provider1_last_name",
							u.provider1_image "provider1_image",
							u.provider1_image_url "provider1_image_url",
							u.provider2_id "provider2_id",
							u.provider2_first_name "provider2_first_name",
							u.provider2_last_name "provider2_last_name",
							u.provider2_image "provider2_image",
							u.provider2_image_url "provider2_image_url",
							(SELECT COUNT(u_following.user_account_id)   
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_follow  u_following
							WHERE u_following.user_account_id = u.id) 					"count_following",
							(SELECT COUNT(u_followed.user_account_id_follow) 
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_follow  u_followed
							WHERE u_followed.user_account_id_follow = u.id) 				"count_followed",
							(SELECT COUNT(u_likes.user_account_id)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_like    u_likes
							WHERE u_likes.user_account_id = u.id ) 						"count_likes",
							(SELECT COUNT(u_likes.user_account_id_like)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_like    u_likes
							WHERE u_likes.user_account_id_like = u.id )					"count_liked",
							(SELECT COUNT(u_views.user_account_id_view)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_view    u_views
							WHERE u_views.user_account_id_view = u.id ) 					"count_views",
							(SELECT COUNT(u_followed_current_user.user_account_id)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_follow  u_followed_current_user 
							WHERE u_followed_current_user.user_account_id_follow = u.id
								AND u_followed_current_user.user_account_id = :user_accound_id_current_user) 	"followed",
							(SELECT COUNT(u_liked_current_user.user_account_id)  
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_like    u_liked_current_user
							WHERE u_liked_current_user.user_account_id_like = u.id
								AND u_liked_current_user.user_account_id = :user_accound_id_current_user)      "liked"
						FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account u
					WHERE (u.id = :id 
							OR 
							u.username = :username)
						AND u.active = 1
						AND EXISTS(SELECT NULL
									FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app uap
									WHERE uap.user_account_id = u.id
										AND uap.app_id = :app_id)`;
			parameters ={
							user_accound_id_current_user: id_current_user,
							id: id,
							username: username,
							app_id: app_id
						}; 
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT	u.id,
							u.username,
							CONVERT(u.avatar USING UTF8) avatar,
							u.provider1_id,
							u.provider1_first_name,
							CONVERT(u.provider1_image USING UTF8) provider1_image,
							u.provider1_image_url,
							u.provider2_id,
							u.provider2_first_name,
							CONVERT(u.provider2_image USING UTF8) provider2_image,
							u.provider2_image_url
					FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account u
					WHERE (u.username LIKE ?
							OR
							u.provider1_first_name LIKE ?
							OR
							u.provider2_first_name LIKE ?)
					AND u.active = 1
					AND EXISTS(SELECT NULL
								FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app uap
								WHERE uap.user_account_id = u.id
									AND uap.app_id = ?)`;
			parameters = [	'%' + username + '%',
							'%' + username + '%',
							'%' + username + '%',
							app_id
						];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql= `SELECT	u.id "id",
							u.username "username",
							u.avatar "avatar",
							u.provider1_id "provider1_id",
							u.provider1_first_name "provider1_first_name",
							u.provider1_image "provider1_image",
							u.provider1_image_url "provider1_image_url",
							u.provider2_id "provider2_id",
							u.provider2_first_name "provider2_first_name",
							u.provider2_image "provider2_image",
							u.provider2_image_url "provider2_image_url"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account u
					WHERE (u.username LIKE :username
							OR
							u.provider1_first_name LIKE :provider1_first_name
							OR
							u.provider2_first_name LIKE :provider2_first_name)
					AND u.active = 1 
					AND EXISTS(SELECT NULL
									FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app uap
								WHERE uap.user_account_id = u.id
									AND uap.app_id = :app_id)`;
			parameters = {
							username: '%' + username + '%',
							provider1_first_name: '%' + username + '%',
							provider2_first_name: '%' + username + '%',
							app_id: app_id
						};
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT *
					FROM (SELECT 'FOLLOWING' detail,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name
							FROM    ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow u_follow,
									${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u_follow.user_account_id = ?
							AND    u.id = u_follow.user_account_id_follow
							AND    u.active = 1
							AND    1 = ?
							UNION ALL
							SELECT 'FOLLOWED' detail,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name
							FROM    ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow u_followed,
									${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u_followed.user_account_id_follow = ?
							AND    u.id = u_followed.user_account_id
							AND    u.active = 1
							AND    2 = ?
							UNION ALL
							SELECT 'LIKE_USER' detail,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name
							FROM    ${process.env.SERVICE_DB_DB1_NAME}.user_account_like u_like,
									${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u_like.user_account_id = ?
							AND    u.id = u_like.user_account_id_like
							AND    u.active = 1
							AND    3 = ?
							UNION ALL
							SELECT 'LIKED_USER' detail,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name
							FROM    ${process.env.SERVICE_DB_DB1_NAME}.user_account_like u_liked,
									${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u_liked.user_account_id_like = ?
							AND    u.id = u_liked.user_account_id
							AND    u.active = 1
							AND    4 = ?) t
						ORDER BY 1, COALESCE(username, 
											provider1_first_name,
											provider2_first_name)`;
			parameters = [	id,
							detailchoice,
							id,
							detailchoice,
							id,
							detailchoice,
							id,
							detailchoice
						];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT *
					FROM (SELECT 'FOLLOWING' "detail",
									u.id "id",
									u.provider1_id "provider1_id",
									u.provider2_id "provider2_id",
									u.avatar "avatar",
									u.provider1_image "provider1_image",
									u.provider1_image_url "provider1_image_url",
									u.provider2_image "provider2_image",
									u.provider2_image_url "provider2_image_url",
									u.username "username",
									u.provider1_first_name "provider1_first_name",
									u.provider2_first_name "provider2_first_name"
							FROM   	${process.env.SERVICE_DB_DB2_NAME}.user_account_follow u_follow,
									${process.env.SERVICE_DB_DB2_NAME}.user_account u
							WHERE  u_follow.user_account_id = :user_account_id_following
							AND    u.id = u_follow.user_account_id_follow
							AND    u.active = 1
							AND    1 = :detailchoice_following
							UNION ALL
							SELECT 'FOLLOWED' "detail",
									u.id "id",
									u.provider1_id "provider1_id",
									u.provider2_id "provider2_id",
									u.avatar "avatar",
									u.provider1_image "provider1_image",
									u.provider1_image_url "provider1_image_url",
									u.provider2_image "provider2_image",
									u.provider2_image_url "provider2_image_url",
									u.username "username",
									u.provider1_first_name "provider1_first_name",
									u.provider2_first_name "provider2_first_name"
							FROM   	${process.env.SERVICE_DB_DB2_NAME}.user_account_follow u_followed,
									${process.env.SERVICE_DB_DB2_NAME}.user_account u
							WHERE  u_followed.user_account_id_follow = :user_account_id_followed
							AND    u.id = u_followed.user_account_id
							AND    u.active = 1
							AND    2 = :detailchoice_followed
							UNION ALL
							SELECT 'LIKE_USER' "detail",
									u.id "id",
									u.provider1_id "provider1_id",
									u.provider2_id "provider2_id",
									u.avatar "avatar",
									u.provider1_image "provider1_image",
									u.provider1_image_url "provider1_image_url",
									u.provider2_image "provider2_image",
									u.provider2_image_url "provider2_image_url",
									u.username "username",
									u.provider1_first_name "provider1_first_name",
									u.provider2_first_name "provider2_first_name"
							FROM   	${process.env.SERVICE_DB_DB2_NAME}.user_account_like u_like,
									${process.env.SERVICE_DB_DB2_NAME}.user_account u
							WHERE  u_like.user_account_id = :user_account_id_like_user
							AND    u.id = u_like.user_account_id_like
							AND    u.active = 1
							AND    3 = :detailchoice_like_user
							UNION ALL
							SELECT 'LIKED_USER' "detail",
									u.id "id",
									u.provider1_id "provider1_id",
									u.provider2_id "provider2_id",
									u.avatar "avatar",
									u.provider1_image "provider1_image",
									u.provider1_image_url "provider1_image_url",
									u.provider2_image "provider2_image",
									u.provider2_image_url "provider2_image_url",
									u.username "username",
									u.provider1_first_name "provider1_first_name",
									u.provider2_first_name "provider2_first_name"
							FROM   	${process.env.SERVICE_DB_DB2_NAME}.user_account_like u_liked,
									${process.env.SERVICE_DB_DB2_NAME}.user_account u
							WHERE  u_liked.user_account_id_like = :user_account_id_liked_user
							AND    u.id = u_liked.user_account_id
							AND    u.active = 1
							AND    4 = :detailchoice_liked_user) t
						ORDER BY 1, COALESCE("username", 
											"provider1_first_name",
											"provider2_first_name") `;
			parameters ={
							user_account_id_following: id,
							detailchoice_following: detailchoice,
							user_account_id_followed: id,
							detailchoice_followed: detailchoice,
							user_account_id_like_user: id,
							detailchoice_like_user: detailchoice,
							user_account_id_liked_user: id,
							detailchoice_liked_user: detailchoice
						}; 
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT *
					FROM (SELECT 'FOLLOWING' top,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name,
									(SELECT COUNT(u_follow.user_account_id_follow)
									FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_follow u_follow
									WHERE u_follow.user_account_id_follow = u.id) count
							FROM 	${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE   u.active = 1
							AND   u.private <> 1
							AND   1 = ?
							UNION ALL
							SELECT 'LIKE_USER' top,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name,
									(SELECT COUNT(u_like.user_account_id_like)
									FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_like u_like
									WHERE u_like.user_account_id_like = u.id) count
							FROM  ${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u.active = 1
							AND  u.private <> 1
							AND  2 = ?
							UNION ALL
							SELECT 'VISITED' top,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name,
									(SELECT COUNT(u_visited.user_account_id_view)
									FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_view u_visited
									WHERE u_visited.user_account_id_view = u.id) count
							FROM  ${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u.active = 1
							AND  u.private <> 1
							AND  3 = ?)  t
					WHERE EXISTS(SELECT NULL
								FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_app uap
								WHERE uap.user_account_id = t.id
									AND uap.app_id = ?)
					ORDER BY 1,13 DESC, COALESCE(username, 
												provider1_first_name,
												provider2_first_name)
					LIMIT 10`;
			parameters = [	statchoice,
							statchoice,
							statchoice,
							app_id
						];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT *
					FROM (SELECT 'FOLLOWING' "top",
									u.id "id",
									u.provider1_id "provider1_id",
									u.provider2_id "provider2_id",
									u.avatar "avatar",
									u.provider1_image "provider1_image",
									u.provider1_image_url "provider1_image_url",
									u.provider2_image "provider2_image",
									u.provider2_image_url "provider2_image_url",
									u.username "username",
									u.provider1_first_name "provider1_first_name",
									u.provider2_first_name "provider2_first_name",
									(SELECT COUNT(u_follow.user_account_id_follow)
									FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_follow u_follow
									WHERE u_follow.user_account_id_follow = u.id) "count"
							FROM  	${process.env.SERVICE_DB_DB2_NAME}.user_account u
							WHERE   u.active = 1
							AND   u.private <> 1
							AND   1 = :statchoice_following
							UNION ALL
							SELECT 'LIKE_USER' "top",
									u.id "id",
									u.provider1_id "provider1_id",
									u.provider2_id "provider2_id",
									u.avatar "avatar",
									u.provider1_image "provider1_image",
									u.provider1_image_url "provider1_image_url",
									u.provider2_image "provider2_image",
									u.provider2_image_url "provider2_image_url",
									u.username "username",
									u.provider1_first_name "provider1_first_name",
									u.provider2_first_name "provider2_first_name",
									(SELECT COUNT(u_like.user_account_id_like)
									FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_like u_like
									WHERE u_like.user_account_id_like = u.id) "count"
							FROM  ${process.env.SERVICE_DB_DB2_NAME}.user_account u
							WHERE  u.active = 1
							AND  u.private <> 1
							AND  2 = :statchoice_like_user
							UNION ALL
							SELECT 'VISITED' "top",
									u.id "id",
									u.provider1_id "provider1_id",
									u.provider2_id "provider2_id",
									u.avatar "avatar",
									u.provider1_image "provider1_image",
									u.provider1_image_url "provider1_image_url",
									u.provider2_image "provider2_image",
									u.provider2_image_url "provider2_image_url",
									u.username "username",
									u.provider1_first_name "provider1_first_name",
									u.provider2_first_name "provider2_first_name",
									(SELECT COUNT(u_visited.user_account_id_view)
									FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_view u_visited
									WHERE u_visited.user_account_id_view = u.id) "count"
							FROM  ${process.env.SERVICE_DB_DB2_NAME}.user_account u
							WHERE  u.active = 1
							AND  u.private <> 1
							AND  3 = :statchoice_visited) t
					WHERE EXISTS(SELECT NULL
								FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_app uap
								WHERE uap.user_account_id = t."id"
									AND uap.app_id = :app_id)
					AND    ROWNUM <=10
					ORDER BY 1,13 DESC, COALESCE("username", 
												"provider1_first_name",
												"provider2_first_name") `;
			parameters = {
							statchoice_following: statchoice,
							statchoice_like_user: statchoice,
							statchoice_visited: statchoice,
							app_id: app_id
						};
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT password
					FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
				WHERE id = ? `;
			parameters = [id];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT password "password"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
					WHERE id = :id `;
			parameters = {
							id: id
						};
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
					SET password = ?,
						verification_code = null
					WHERE id = ? 
						AND verification_code = ?
						AND verification_code IS NOT NULL`;
			parameters = [	data.new_password,
							id,
							data.auth];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
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
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    updateUserLocal: (app_id, data, search_id, callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
						SET bio = ?,
							private = ?,
							user_level = ?,
							username = ?,
							password = ?,
							password_reminder = ?,
							email = ?,
							email_unverified = ?,
							avatar = ?,
							verification_code = ?,
							date_modified = SYSDATE()
					WHERE id = ? `;
			parameters = [
							data.bio,
							data.private,
							data.user_level,
							data.username,
							data.password,
							data.password_reminder,
							data.email,
							data.new_email,
							data.avatar,
							data.verification_code,
							search_id
						];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
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
						date_modified = SYSDATE
					WHERE id = :id `;
			parameters ={
							bio: data.bio,
							private: data.private,
							user_level: data.user_level,
							username: data.username,
							password: data.password,
							password_reminder: data.password_reminder,
							email: data.email,
							new_email: data.new_email,
							avatar: Buffer.from(data.avatar, 'utf8'),
							verification_code: data.verification_code,
							id: search_id
						}; 
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    updateUserCommon: (app_id, data, id, callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
					SET username = ?,
						bio = ?,
						private = ?,
						user_level = ?,
						date_modified = SYSDATE()
					WHERE id = ? `;
			parameters = [   
							data.username,
							data.bio,
							data.private,
							data.user_level,
							id
						];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
					SET username = :username,
						bio = :bio,
						private = :private,
						user_level = :user_level,
						date_modified = SYSDATE
					WHERE id = :id `;
			parameters ={	username: username,
							bio: data.bio,
							private: data.private,
							user_level: data.user_level,
							id: id
						}; 
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    deleteUser: (app_id, id, callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
					WHERE id = ? `;
			parameters = [id];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
					WHERE id = :id `;
			parameters = {
							id: id
						 };
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    userLogin: (data, callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql =`SELECT	id,
							bio,
							username,
							password,
							email,
							active,
							CONVERT(avatar USING UTF8) avatar
						FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
					WHERE username = ? 
						AND provider1_id IS NULL
						AND provider2_id IS NULL`;
			parameters = [data.username
						 ];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT	id "id",
							bio "bio",
							username "username",
							password "password",
							email "email",
							active "active",
							avatar "avatar"
						FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
					WHERE username = :username 
						AND provider1_id IS NULL
						AND provider2_id IS NULL`;
			parameters ={
							username: data.username
						}; 
        }
		execute_db_sql(data.app_id, data.app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    },
    updateSigninProvider: (app_id, provider_no, id, data, callBack) => {
		let sql;
		let parameters;
        if (provider_no == 1) {
            if (process.env.SERVICE_DB_USE == 1) {
				sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
							SET provider1_id = ?,
								provider1_first_name = ?,
								provider1_last_name = ?,
								provider1_image = ?,
								provider1_image_url = ?,
								provider1_email = ?,
								date_modified = SYSDATE()
						WHERE id = ?
							AND active =1 `;
				parameters = [	data.provider1_id,
								data.provider1_first_name,
								data.provider1_last_name,
								data.provider1_image,
								data.provider1_image_url,
								data.provider1_email,
								id
							]
            } else if (process.env.SERVICE_DB_USE == 2) {
				sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
							SET provider1_id = :provider1_id,
								provider1_first_name = :provider1_first_name,
								provider1_last_name = :provider1_last_name,
								provider1_image = :provider1_image,
								provider1_image_url = :provider1_image_url,
								provider1_email = :provider1_email,
								date_modified = SYSDATE
						WHERE id = :id
							AND active =1 `;
				parameters ={
								provider1_id: data.provider1_id,
								provider1_first_name: data.provider1_first_name,
								provider1_last_name: data.provider1_last_name,
								provider1_image: Buffer.from(data.provider1_image, 'utf8'),
								provider1_image_url: data.provider1_image_url,
								provider1_email: data.provider1_email,
								id: id
							}; 
            }
        } else {
            if (process.env.SERVICE_DB_USE == 1) {
				sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
							SET provider2_id = ?,
								provider2_first_name = ?,
								provider2_last_name = ?,
								provider2_image = ?,
								provider2_image_url = ?,
								provider2_email = ?,
								date_modified = SYSDATE()
						WHERE id = ?
							AND active =1 `;
				parameters = [
								data.provider2_id,
								data.provider2_first_name,
								data.provider2_last_name,
								data.provider2_image,
								data.provider2_image_url,
								data.provider2_email,
								id
							];
            } else if (process.env.SERVICE_DB_USE == 2) {
				sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
							SET provider2_id = :provider2_id,
								provider2_first_name = :provider2_first_name,
								provider2_last_name = :provider2_last_name,
								provider2_image = :provider2_image,
								provider2_image_url = :provider2_image_url,
								provider2_email = :provider2_email,
								date_modified = SYSDATE
						WHERE id = :id
							AND active =1 `;
				parameters ={
								provider2_id: data.provider2_id,
								provider2_first_name: data.provider2_first_name,
								provider2_last_name: data.provider2_last_name,
								provider2_image: Buffer.from(data.provider2_image, 'utf8'),
								provider2_image_url: data.provider2_image_url,
								provider2_email: data.provider2_email,
								id: id
							}; 
            }
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    },
    getUserByProviderId: (app_id, provider_no, search_id, callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT	u.id,
							u.bio,
							(SELECT MAX(ul.date_created)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_logon ul
							WHERE ul.user_account_id = u.id
								AND ul.result=1) last_logontime,
							u.date_created,
							u.date_modified,
							u.username,
							u.password,
							u.password_reminder,
							u.email,
							CONVERT(u.avatar USING UTF8) avatar,
							u.verification_code,
							u.active,
							u.provider1_id,
							u.provider1_first_name,
							u.provider1_last_name,
							CONVERT(u.provider1_image USING UTF8) provider1_image,
							u.provider1_image_url,
							u.provider1_email,
							u.provider2_id,
							u.provider2_first_name,
							u.provider2_last_name,
							CONVERT(u.provider2_image USING UTF8) provider2_image,
							u.provider2_image_url,
							u.provider2_email
						FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account u
						WHERE (u.provider1_id = ?
							AND
							1 = ?) 
						OR    (u.provider2_id = ?
							AND
							2 = ?)`;
			parameters = [search_id,
							provider_no,
							search_id,
							provider_no
						];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT	u.id "id",
							u.bio "bio",
							(SELECT MAX(ul.date_created)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_logon ul
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
							u.provider1_id "provider1_id",
							u.provider1_first_name "provider1_first_name",
							u.provider1_last_name "provider1_last_name",
							u.provider1_image "provider1_image",
							u.provider1_image_url "provider1_image_url",
							u.provider1_email "provider1_email",
							u.provider2_id "provider2_id",
							u.provider2_first_name "provider2_first_name",
							u.provider2_last_name "provider2_last_name",
							u.provider2_image "provider2_image",
							u.provider2_image_url "provider2_image_url",
							u.provider2_email "provider2_email"
						FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account u
						WHERE (u.provider1_id = :provider1_id
							AND
							1 = :provider1_no) 
						OR    (u.provider2_id = :provider2_id
							AND
							2 = :provider2_no) `;
			parameters = {
							provider1_id: search_id,
							provider1_no: provider_no,
							provider2_id: search_id,
							provider2_no: provider_no
						};
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
    getStatCount: (callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT  (SELECT COUNT(*)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
							WHERE provider1_id IS NULL
								AND provider2_id IS NULL) count_local,
							(SELECT COUNT(*)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
							WHERE provider1_id IS NOT NULL) count_provider1,
							(SELECT COUNT(*)
							FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
							WHERE provider2_id IS NOT NULL) count_provider2
					FROM DUAL`;
			parameters = [];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT  (SELECT COUNT(*)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
							WHERE provider1_id IS NULL
								AND provider2_id IS NULL) "count_local",
							(SELECT COUNT(*)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
							WHERE provider1_id IS NOT NULL) "count_provider1",
							(SELECT COUNT(*)
							FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
							WHERE provider2_id IS NOT NULL) "count_provider2"
					FROM DUAL`;
			parameters = {};
        }
		execute_db_sql(process.env.MAIN_APP_ID, null, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    },
	getEmailUser: (app_id, email, callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT id,
							email
					FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
					WHERE email = ? `;
			parameters = [email];
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT id "id",
							email "email"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
					WHERE email = :email `;
			parameters ={
							email: email
						}; 
        }
		execute_db_sql(app_id, app_id, sql, parameters, null, 
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