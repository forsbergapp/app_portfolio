const {oracledb, get_pool, get_pool_admin} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
    create: (app_id, data, callBack) => {
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
            get_pool(app_id).query(
                `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account(
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
				VALUES(?,?,?,SYSDATE(),SYSDATE(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `, [
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
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            );
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    if (data.avatar != null)
                        data.avatar = Buffer.from(data.avatar, 'utf8');
                    if (data.provider1_image != null)
                        data.provider1_image = Buffer.from(data.provider1_image, 'utf8');
                    if (data.provider2_image != null)
                        data.provider2_image = Buffer.from(data.provider2_image, 'utf8');
					pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account(
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
						   :provider2_email) `, {
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
                        },
                        (err, result) => {
                            if (err) {
                                createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                //Fetch id from rowid returned from Oracle
                                //sample output:
                                //{"lastRowid":"AAAWwdAAAAAAAdHAAC","rowsAffected":1}
                                async function execute_sql2(err_id, result_id) {
                                    //remove "" before and after
                                    var lastRowid = JSON.stringify(result.lastRowid).replace(/"/g, '');
									let pool3;
									try{
										pool3 = await oracledb.getConnection(get_pool(app_id));
										const result_rowid = await pool3.execute(
											`SELECT id "insertId"
										   	   FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
											  WHERE rowid = :lastRowid`, {
												lastRowid: lastRowid
											},
											(err_id2, result_id2) => {
												if (err_id2) {
													createLogAppSE(app_id, __appfilename, __appfunction, __appline, err_id2);
													return callBack(err_id2);
												} else {
													return callBack(null, result_id2.rows[0]);
												}
											});
									}catch (err) {
										createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
										return callBack(err);
									} finally {
										if (pool3) {
											try {
												await pool3.close(); 
											} catch (err) {
												createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
											}
										}
									}
                                }
                                execute_sql2();
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    activateUser: (app_id, id, verification_code, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
					SET	active = 1,
				  	    verification_code = null,
						date_modified = SYSDATE()
				  WHERE id = ?
					AND verification_code = ?`, 
				[id,
                 verification_code
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    //can be one of these formats:
                    //"{"count":0,"success":1,"items":[{"fieldCount":0,"affectedRows":0,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 0  Changed: 0  Warnings: 0","protocol41":true,"changedRows":0}]}"
                    //"{"count":1,"success":1,"items":[{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1}]}"
                    //use affectedRows in app
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
					pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result_sql = await pool2.execute(
                        `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
						    SET	active = 1,
								verification_code = null,
								date_modified = SYSDATE
						  WHERE id = :id
						    AND verification_code = :verification_code `, 
						{
                            id: id,
                            verification_code: verification_code
                        },
                        (err2, result2) => {
                            if (err2) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err2);
                                return callBack(err2);
                            } else {
                                var oracle_json = {
                                    "count": result2.rowsAffected,
                                    "affectedRows": result2.rowsAffected
                                };
                                //use affectedRows as mysql in app
                                return callBack(null, oracle_json);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
	updateUserVerificationCode: (app_id, id, verification_code, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
					SET	verification_code = ?,
						date_modified = SYSDATE()
				  WHERE id = ?`, 
				[verification_code,
				 id
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    //can be one of these formats:
                    //"{"count":0,"success":1,"items":[{"fieldCount":0,"affectedRows":0,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 0  Changed: 0  Warnings: 0","protocol41":true,"changedRows":0}]}"
                    //"{"count":1,"success":1,"items":[{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1}]}"
                    //use affectedRows in app
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
					pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result_sql = await pool2.execute(
                        `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
						    SET	verification_code = :verification_code,
								date_modified = SYSDATE
						  WHERE id = :id `, 
						{verification_code: verification_code,
                         id: id   
                        },
                        (err2, result2) => {
                            if (err2) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err2);
                                return callBack(err2);
                            } else {
                                var oracle_json = {
                                    "count": result2.rowsAffected,
                                    "affectedRows": result2.rowsAffected
                                };
                                //use affectedRows as mysql in app
                                return callBack(null, oracle_json);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    getUserByUserId: (app_id, id, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT
					u.id,
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
				WHERE u.id = ? `, 
				[id],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results[0]);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT
							u.id "id",
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
						WHERE u.id = :id `, 
						{
                            id: id
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows[0]);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    getProfileUser: (app_id, id, username, id_current_user, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT
					u.id,
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
							   AND uap.app_id = ?)`,
				[id_current_user,
				 id_current_user,
				 id_current_user,
				 id_current_user,
				 id_current_user,
                 id_current_user,
                 id,
				 username,
				 app_id
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results[0]);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT
							u.id "id",
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
  									   AND uap.app_id = :app_id)`,
						{
                            user_accound_id_current_user: id_current_user,
                            id: id,
							username: username,
							app_id: app_id
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows[0]);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    searchProfileUser: (app_id, username, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT
						u.id,
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
								AND uap.app_id = ?)`, 
				['%' + username + '%',
                 '%' + username + '%',
                 '%' + username + '%',
				 app_id
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT
								u.id "id",
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
										 AND uap.app_id = :app_id)`,
					{
                    	username: '%' + username + '%',
                        provider1_first_name: '%' + username + '%',
                        provider2_first_name: '%' + username + '%',
						app_id: app_id
                    },
					(err, result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						} else {
							return callBack(null, result.rows);
						}
					});
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    getProfileDetail: (app_id, id, detailchoice, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT *
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
											provider2_first_name)`, 
				[id,
				 detailchoice,
			 	 id,
				 detailchoice,
				 id,
				 detailchoice,
				 id,
				 detailchoice
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT *
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
												"provider2_first_name") `, 
						{
                            user_account_id_following: id,
                            detailchoice_following: detailchoice,
                            user_account_id_followed: id,
                            detailchoice_followed: detailchoice,
                            user_account_id_like_user: id,
                            detailchoice_like_user: detailchoice,
                            user_account_id_liked_user: id,
                            detailchoice_liked_user: detailchoice
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    getProfileTop: (app_id, statchoice, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT *
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
					LIMIT 10`, 
				[statchoice,
				 statchoice,
				 statchoice,
				 app_id
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT *
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
														 "provider2_first_name") `, 
						{
                            statchoice_following: statchoice,
                            statchoice_like_user: statchoice,
                            statchoice_visited: statchoice,
							app_id: app_id
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }

    },
    checkPassword: (app_id, id, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT password
				   FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
				  WHERE id = ? `, [id],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results[0]);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT password "password"
				           FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
				   	      WHERE id = :id `, {
                            id: id
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows[0]);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    updateUserLocal: (app_id, data, search_id, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
					SET bio = ?,
					private = ?,
					user_level = ?,
					username = ?,
					password = ?,
					password_reminder = ?,
					email = ?,
					avatar = ?,
					date_modified = SYSDATE()
				WHERE id = ? `, [
                    data.bio,
                    data.private,
                    data.user_level,
                    data.username,
                    data.password,
                    data.password_reminder,
                    data.email,
                    data.avatar,
                    search_id
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
							SET bio = :bio,
							private = :private,
							user_level = :user_level,
							username = :username,
							password = :password,
							password_reminder = :password_reminder,
							email = :email,
							avatar = :avatar,
							date_modified = SYSDATE
						WHERE id = :id `, {
                            bio: data.bio,
                            private: data.private,
                            user_level: data.user_level,
                            username: data.username,
                            password: data.password,
                            password_reminder: data.password_reminder,
                            email: data.email,
                            avatar: Buffer.from(data.avatar, 'utf8'),
                            id: search_id
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    updateUserCommon: (app_id, data, id, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
					SET username = ?,
					bio = ?,
					private = ?,
					user_level = ?,
					date_modified = SYSDATE()
				WHERE id = ? `, 
				[   
					data.username,
                    data.bio,
                    data.private,
                    data.user_level,
                    id
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
							SET username = :username,
							bio = :bio,
							private = :private,
							user_level = :user_level,
							date_modified = SYSDATE
						WHERE id = :id `, 
						{	username: username,
                            bio: data.bio,
                            private: data.private,
                            user_level: data.user_level,
                            id: id
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    deleteUser: (app_id, id, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
				  WHERE id = ? `, [id],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
						  WHERE id = :id `, {
                            id: id
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    userLogin: (data, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(data.app_id).query(
                `SELECT
					id,
					bio,
					username,
					password,
					email,
					active,
					CONVERT(avatar USING UTF8) avatar
				FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
			   WHERE username = ? 
				 AND provider1_id IS NULL
				 AND provider2_id IS NULL`, 
				[data.username
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results[0]);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(data.app_id));
                    const result = await pool2.execute(
                        `SELECT
							id "id",
							bio "bio",
							username "username",
							password "password",
							email "email",
							active "active",
							avatar "avatar"
						FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
					   WHERE username = :username 
						 AND provider1_id IS NULL
						 AND provider2_id IS NULL`, 
						{
                            username: data.username
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows[0]);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    updateSigninProvider: (app_id, provider_no, id, data, callBack) => {
        if (provider_no == 1) {
            if (process.env.SERVICE_DB_USE == 1) {
                get_pool(app_id).query(
                    `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
					    SET provider1_id = ?,
							provider1_first_name = ?,
							provider1_last_name = ?,
							provider1_image = ?,
							provider1_image_url = ?,
							provider1_email = ?,
							date_modified = SYSDATE()
					  WHERE id = ?
					    AND active =1 `, 
					[data.provider1_id,
					 data.provider1_first_name,
					 data.provider1_last_name,
					 data.provider1_image,
					 data.provider1_image_url,
					 data.provider1_email,
					 id
                    ],
                    (error, results, fields) => {
                        if (error) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                            return callBack(error);
                        }
                        return callBack(null, results[0]);
                    }
                )
            } else if (process.env.SERVICE_DB_USE == 2) {
                async function execute_sql(err, result) {
					let pool2;
                    try {
                        pool2 = await oracledb.getConnection(get_pool(app_id));
                        const result = await pool2.execute(
                            `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
								SET provider1_id = :provider1_id,
									provider1_first_name = :provider1_first_name,
									provider1_last_name = :provider1_last_name,
									provider1_image = :provider1_image,
									provider1_image_url = :provider1_image_url,
									provider1_email = :provider1_email,
									date_modified = SYSDATE
							  WHERE id = :id
								AND active =1 `, 
							{
                                provider1_id: data.provider1_id,
                                provider1_first_name: data.provider1_first_name,
                                provider1_last_name: data.provider1_last_name,
                                provider1_image: Buffer.from(data.provider1_image, 'utf8'),
                                provider1_image_url: data.provider1_image_url,
                                provider1_email: data.provider1_email,
                                id: id
                            },
                            (err, result) => {
                                if (err) {
                                    createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                    return callBack(err);
                                } else {
                                    return callBack(null, result[0]);
                                }
                            });
                    } catch (err) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                        return callBack(err.message);
                    } finally {
                        if (pool2) {
							try {
								await pool2.close(); 
							} catch (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							}
						}
                    }
                }
                execute_sql();
            }
        } else {
            if (process.env.SERVICE_DB_USE == 1) {
                get_pool(app_id).query(
                    `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.user_account
						SET provider2_id = ?,
							provider2_first_name = ?,
							provider2_last_name = ?,
							provider2_image = ?,
							provider2_image_url = ?,
							provider2_email = ?,
							date_modified = SYSDATE()
					  WHERE id = ?
						AND active =1 `, 
					[
						data.provider2_id,
                        data.provider2_first_name,
                        data.provider2_last_name,
                        data.provider2_image,
                        data.provider2_image_url,
                        data.provider2_email,
                        id
                    ],
                    (error, results, fields) => {
                        if (error) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                            return callBack(error);
                        }
                        return callBack(null, results[0]);
                    }
                )
            } else if (process.env.SERVICE_DB_USE == 2) {
                async function execute_sql(err, result) {
					let pool2;
                    try {
                        pool2 = await oracledb.getConnection(get_pool(app_id));
                        const result = await pool2.execute(
                            `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.user_account
								SET provider2_id = :provider2_id,
									provider2_first_name = :provider2_first_name,
									provider2_last_name = :provider2_last_name,
									provider2_image = :provider2_image,
									provider2_image_url = :provider2_image_url,
									provider2_email = :provider2_email,
									date_modified = SYSDATE
							  WHERE id = :id
								AND active =1 `, 
							{
                                provider2_id: data.provider2_id,
                                provider2_first_name: data.provider2_first_name,
                                provider2_last_name: data.provider2_last_name,
                                provider2_image: Buffer.from(data.provider2_image, 'utf8'),
                                provider2_image_url: data.provider2_image_url,
                                provider2_email: data.provider2_email,
                                id: id
                            },
                            (err, result) => {
                                if (err) {
									createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                    return callBack(err);
                                } else {
                                    return callBack(null, result[0]);
                                }
                            });
                    } catch (err) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                        return callBack(err.message);
                    } finally {
                        if (pool2) {
							try {
								await pool2.close(); 
							} catch (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							}
						}
                    }
                }
                execute_sql();
            }
        }
    },
    getUserByProviderId: (app_id, provider_no, search_id, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT
					u.id,
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
					2 = ?)`, 
				[search_id,
                 provider_no,
                 search_id,
                 provider_no
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT
							u.id "id",
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
							2 = :provider2_no) `, {
                            provider1_id: search_id,
                            provider1_no: provider_no,
                            provider2_id: search_id,
                            provider2_no: provider_no
                        },
                        (err, result) => {
                            if (err) {
                                createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
    getStatCount: (callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool_admin().query(
                `SELECT 
						(SELECT COUNT(*)
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
						  WHERE provider1_id IS NULL
							AND provider2_id IS NULL) count_local,
						(SELECT COUNT(*)
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
						  WHERE provider1_id IS NOT NULL) count_provider1,
						(SELECT COUNT(*)
						   FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account
						  WHERE provider2_id IS NOT NULL) count_provider2
				 FROM DUAL`, 
				[],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results[0]);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool_admin());
                    const result = await pool2.execute(
                        `SELECT 
								(SELECT COUNT(*)
								   FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
								  WHERE provider1_id IS NULL
									AND provider2_id IS NULL) "count_local",
								(SELECT COUNT(*)
								   FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
								  WHERE provider1_id IS NOT NULL) "count_provider1",
								(SELECT COUNT(*)
								   FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account
								  WHERE provider2_id IS NOT NULL) "count_provider2"
						FROM DUAL`,  
				 		{},
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows[0]);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    }
};