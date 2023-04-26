const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

function log_db_sql(app_id, sql, parameters){
	let parsed_sql = sql;
	//ES7 Object.entries
	Object.entries(parameters).forEach((parameter) => {
		//replace bind parameters with values in log
		parsed_sql = parsed_sql.replace(/\:(\w+)/g, (txt, key) => {
			if (key == parameter[0])
				if (parameter[1] == null)
					return parameter[1];
				else 
					return `'${parameter[1]}'`;
			else
				return txt;
		})
	});
	import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogDB}) => {
		createLogDB(app_id, `DB:${ConfigGet(1, 'SERVICE_DB', 'USE')} Pool: ${app_id} SQL: ${parsed_sql}`);
	})
}
const get_app_code = (errorNum, message, code, errno, sqlMessage) => {
	var app_error_code = parseInt((JSON.stringify(errno) ?? JSON.stringify(errorNum)));
    //check if user defined exception
    if (app_error_code >= 20000){
        return app_error_code;
    } 
    else{
		//if known SQL error, example:
		//MariaDB sqlMessage
		//'Duplicate entry '[value]' for key 'user_account_username_un''
		//MySQL sqlMessage
		//'Duplicate entry '[value]' for key 'user_account.user_account_username_un''
		//PostgreSQL message:
		//'duplicate key value violates unique constraint "user_account_username_un"'
		//Oracle message:
		//'ORA-00001: unique constraint (APP_PORTFOLIO.USER_ACCOUNT_USERNAME_UN) violated'
		const db_use = ConfigGet(1, 'SERVICE_DB', 'USE');
		if ((db_use =='1' && code == 'ER_DUP_ENTRY') || //MariaDB/MySQL
		    (db_use =='2' && errorNum ==1) ||  		  //Oracle
			(db_use =='3' && code=='23505')){ 		  //PostgreSQL
			let text_check;
			if (sqlMessage)
				text_check = JSON.stringify(sqlMessage);	//MariaDB/MySQL
			else
				text_check = JSON.stringify(message);		//Oracle/PostgreSQL
			let app_message_code = '';
			//check constraints errors, must be same name in mySQL and Oracle
			if (text_check.toUpperCase().includes("USER_ACCOUNT_EMAIL_UN"))
				app_message_code = 20200;
			if (text_check.toUpperCase().includes("USER_ACCOUNT_PROVIDER_ID_UN"))
				app_message_code = 20201;
			if (text_check.toUpperCase().includes("USER_ACCOUNT_USERNAME_UN"))
				app_message_code = 20203;
			if (app_message_code != '')
				return app_message_code;
			else
				return null;	
		}
		else
			return null;
	}
};

async function execute_db_sql(app_id, sql, parameters, 
							  app_filename, app_function, app_line, callBack){	
	const { ORACLEDB, get_pool} = await import(`file://${process.cwd()}/service/db/admin/admin.service.js`);
	const database_error = 'DATABASE ERROR';
	if (ConfigGet(1, 'SERVICE_LOG', 'ENABLE_DB')=='1'){
		log_db_sql(app_id, sql, parameters);
	}
	switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
		case '1':
		case '2':{
			//Both MySQL and MariaDB use MySQL npm module
			function config_connection(conn, query, values){
				//change json parameters to [] syntax with bind variable names
				//common syntax: connection.query("UPDATE [table] SET [column] = :title", { title: "value" });
				//mysql syntax: connection.query("UPDATE [table] SET [column] = ?", ["value"];
				conn.config.queryFormat = (query, values) => {
					if (!values) return query;
					return query.replace(/\:(\w+)/g, (txt, key) => {
						if (values.hasOwnProperty(key)) {
						return conn.escape(values[key]);
						}
						return txt;
					});
				};
			}
			get_pool(app_id).getConnection((err, conn) => {
				if (err){
					import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppS}) => {
						//Both MariaDB and MySQL use err.sqlMessage
						createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 1 getConnection:' + err.sqlMessage).then(() => {
							return callBack(database_error, null);
						})
					});
				}
				else
					config_connection(conn, sql, parameters);
					conn.query(sql, parameters, (err, result, fields) => {
						conn.release();
							if (err){
								let app_code = get_app_code(err.errorNum, 
									err.message, 
									err.code, 
									err.errno, 
									err.sqlMessage);
								if (app_code != null)
									return callBack(err, null);
								else
									import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppS}) => {
										//Both MariaDB and MySQL use err.sqlMessage
										createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 1 query:' + err.sqlMessage).then(() => {
											return callBack(database_error, null);
										})
									});
							}
						else{
							//convert blob buffer to string if any column is a BLOB type
							if (result.length>0){
								for (let dbcolumn=0;dbcolumn<fields.length; dbcolumn++){
									if (fields[dbcolumn].type == 252) { //BLOB
										for (let i=0;i<result.length;i++){
											if (fields[dbcolumn]['name'] == Object.keys(result[i])[dbcolumn])
												if (result[i][Object.keys(result[i])[dbcolumn]]!=null && result[i][Object.keys(result[i])[dbcolumn]]!='')
													result[i][Object.keys(result[i])[dbcolumn]] = Buffer.from(result[i][Object.keys(result[i])[dbcolumn]]).toString();
										}
									}
								};
							}
							return callBack(null, result);
						}
					})
			});
			break;
		}
		case '3':{
			function queryConvert(parameterizedSql, params) {
				//change json parameters to $ syntax
				//use unique index with $1, $2 etc, parameter can be used several times
				//example: sql with parameters :id, :id, :id and :id2, will get $1, $1, $1 and $2
				//use indexorder received from parameters
				//common syntax: connection.query("UPDATE [table] SET [column] = :title", { title: "value" });
				//postgresql syntax: connection.query("UPDATE [table] SET [column] = $1", [0, "value"];
			    const [text, values] = Object.entries(params).reduce(
			        ([sql, array, index], [key, value]) => [sql.replace(/\:(\w+)/g, (txt, key) => {
																						if (params.hasOwnProperty(key)){
																							return `$${Object.keys(params).indexOf(key) + 1}`;
																						}
																						else
																							return txt;
																					}), 
														   [...array, value], index + 1],
				        								   [parameterizedSql, [], 1]
			    );
			    return { text, values };
			}	
			let parsed_result = queryConvert(sql, parameters);
			get_pool(app_id).connect().then((pool3) => {
				return pool3
				  .query(parsed_result.text, parsed_result.values)
				  .then((result) => {
					//add common attributes
					if (result.command == 'INSERT' && result.rows.length>0)
						result.insertId = result.rows[0].id;
					if (result.command == 'INSERT' ||
					    result.command == 'DELETE' ||
						result.command == 'UPDATE'){
						result.affectedRows = result.rowCount;
					}
					pool3.release();
					//convert blob buffer to string if any column is a BYTEA type
					if (result.rows.length>0){
						for (let dbcolumn=0;dbcolumn<result.fields.length; dbcolumn++){
							if (result.fields[dbcolumn].dataTypeID == 17) { //BYTEA
								for (let i=0;i<result.rows.length;i++){
									if (result.fields[dbcolumn]['name'] == Object.keys(result.rows[i])[dbcolumn])
										if (result.rows[i][Object.keys(result.rows[i])[dbcolumn]]!=null && result.rows[i][Object.keys(result.rows[i])[dbcolumn]]!='')
											result.rows[i][Object.keys(result.rows[i])[dbcolumn]] = Buffer.from(result.rows[i][Object.keys(result.rows[i])[dbcolumn]]).toString();
								}
							}
						};
					}
					if (result.command == 'SELECT')
						return callBack(null, result.rows);
					else
						return callBack(null, result);
				  })
				  .catch((err) => {
					pool3.release();
					let app_code = get_app_code(err.errorNum, 
						err.message, 
						err.code, 
						err.errno, 
						err.sqlMessage);
					if (app_code != null)
						return callBack(err, null);
					else
						import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppS}) => {
							//PostgreSQL use err.message
							createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 3 catch:' + err.message).then(() => {
								return callBack(database_error, null);
							})
						});
				  })
			  })
			break;
		}
		case '4':{
			let pool4;
			try{
				pool4 = await ORACLEDB.getConnection(get_pool(app_id));
				const result = await pool4.execute(sql, parameters, (err,result) => {
														if (err) {
															let app_code = get_app_code(err.errorNum, 
																err.message, 
																err.code, 
																err.errno, 
																err.sqlMessage);
															if (app_code != null)
																return callBack(err, null);
															else
																import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppS}) => {
																	//Oracle uses err.message
																	createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line,
																				'DB 4 execute:' + `${err.message}, SQL:${sql.substring(0,100)}...`).then(() => {
																		return callBack(database_error, null);
																	})
																});
														}
														else{
															if (result.rowsAffected)
																result.affectedRows = result.rowsAffected;
															if (result.rows)
																return callBack(null, result.rows);
															else
																return callBack(null, result);
														}
															
																
													});
			}catch (err) {
				import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppS}) => {
					createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 4 catch:' + err.message).then(() => {
						return callBack(database_error);
					})
				});
			} finally {
				if (pool4) {
					try {
						await pool4.close(); 
					} catch (err) {
						import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/log/log.service.js`).then(({createLogAppS}) => {
							createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 4 finally:' + err.message).then(() => {
								return callBack(database_error);
							})
						});
					}
				}
			}
			break;
		}
	}
}
const get_schema_name = () => ConfigGet(1, 'SERVICE_DB', `DB${ConfigGet(1, 'SERVICE_DB', 'USE')}_NAME`);

const get_locale = (lang_code, part) => {
	if (lang_code==null)
		return null;
	else
		switch (part){
			case 1:{
				return lang_code;
				break;
			}
			case 2:{
				if (lang_code.indexOf('-',lang_code.indexOf('-')+1) >-1)
					//ex zh-hant from zh-hant-cn
					return lang_code.substring(0,lang_code.indexOf('-',lang_code.indexOf('-')+1));
				else
					return lang_code;
				break;
			}
			case 3:{
				if (lang_code.indexOf('-')>-1)
					//ex zh from zh-hant-cn
					return lang_code.substring(0,lang_code.indexOf('-'));
				else
					return lang_code;
				break;
			}
		}
}
const limit_sql = (sql, limit_type = null) => {
	const db_use = ConfigGet(1, 'SERVICE_DB', 'USE');
	if (db_use == '1' || db_use == '2' || db_use == '3')
		switch (limit_type){
			case 1:{
				//use env limit
				return sql + ` LIMIT ${ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_SEARCH')} `;
			}
			case 2:{
				//use env limit
				return sql + ` LIMIT ${ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_PROFILE_TOP')} `;
			}
			case null:{
				//use app function limit
				return sql + ` LIMIT :limit OFFSET :offset`;	
			}
		}
	else 
		if (db_use == '4')
			switch (limit_type){
				case 1:{
					//use env limit
					return sql + ` FETCH NEXT ${ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_SEARCH')} ROWS ONLY`;
				}
				case 2:{
					//use env limit
					return sql + ` FETCH NEXT ${ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_PROFILE_TOP')} ROWS ONLY`;
				}
				case null:{
					//use app function limit
					return sql + ` OFFSET :offset FETCH NEXT :limit ROWS ONLY`;
				}
			}
		else
			return sql;
}
const record_not_found = (res, app_id, lang_code) => {
	import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
		import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/message_translation/message_translation.service.js`).then(({ getMessage }) => {
			getMessage( app_id, 
						ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
						20400, 
						lang_code, (err,results_message)  => {
							return res.status(404).send(
								err ?? results_message.text
							);
						});
		})
	})
}

export{get_app_code, execute_db_sql, get_schema_name, get_locale, limit_sql, record_not_found}