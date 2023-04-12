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
	import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogDB}) => {
		createLogDB(app_id, `DB:${ConfigGet(1, 'SERVICE_DB', 'USE')} Pool: ${app_id} SQL: ${parsed_sql}`);
	})
}
async function execute_db_sql(app_id, sql, parameters, 
							  app_filename, app_function, app_line, callBack){	
	const { ORACLEDB, get_pool} = await import(`file://${process.cwd()}/service/db/admin/admin.service.js`);
	const database_error = 'DATABASE ERROR';
	if (ConfigGet(1, 'SERVICE_LOG', 'ENABLE_DB')=='1'){
		log_db_sql(app_id, sql, parameters);
	}
	switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
		case '1':{
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
			//Both MySQL and MariaDB use MySQL npm module
			get_pool(app_id).getConnection((err, conn) => {
				if (err){
					import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppS}) => {
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
						if (err)
							import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppS}) => {
								//Both MariaDB and MySQL use err.sqlMessage
								createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 1 query:' + err.sqlMessage).then(() => {
									return callBack(database_error, null);
								})
							});
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
		case '2':{
			let pool2;
			try{
				pool2 = await ORACLEDB.getConnection(get_pool(app_id));
				const result = await pool2.execute(sql, parameters, (err,result) => {
														if (err) {
															import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppS}) => {
																//Oracle uses err.message
																createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line,
																			  'DB 2 execute:' + `${err.message}, SQL:${sql.substring(0,100)}...`).then(() => {
																	return callBack(database_error, null);
																})
															});
														}
														else{
															if (!result.rows && result)
																return callBack(null, result);
															else
																return callBack(null, result.rows);
														}
													});
			}catch (err) {
				import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppS}) => {
					createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 2 catch:' + err.message).then(() => {
						return callBack(database_error);
					})
				});
			} finally {
				if (pool2) {
					try {
						await pool2.close(); 
					} catch (err) {
						import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppS}) => {
							createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 2 finally:' + err.message).then(() => {
								return callBack(database_error);
							})
						});
					}
				}
			}
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
					return callBack(null, result.rows);
				  })
				  .catch((err) => {
					pool3.release();
					import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppS}) => {
						//PostgreSQL use err.message
						createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, app_filename, app_function, app_line, 'DB 3 catch:' + err.message).then(() => {
							return callBack(database_error, null);
						})
					});
				  })
			  })
			break;
		}
	}
}
function get_schema_name(){
	switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
		case '1':{
			return ConfigGet(1, 'SERVICE_DB', 'DB1_NAME');
			break;
		}
		case '2':{
			return ConfigGet(1, 'SERVICE_DB', 'DB2_NAME');
			break;
		}
		case '3':{
			return ConfigGet(1, 'SERVICE_DB', 'DB3_NAME');
			break;
		}
	}
}
function get_locale(lang_code, part){
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
function limit_sql(sql, limit_type = null){
	if (ConfigGet(1, 'SERVICE_DB', 'USE') == '1' || ConfigGet(1, 'SERVICE_DB', 'USE') == '3')
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
		if (ConfigGet(1, 'SERVICE_DB', 'USE') == '2')
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
function record_not_found(res, app_id, lang_code){
	import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
		import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/message_translation/message_translation.service.js`).then(({ getMessage }) => {
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

export{execute_db_sql, get_schema_name, get_locale, limit_sql, record_not_found}