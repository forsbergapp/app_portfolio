const { createLogAppSE } = require("../../log/log.controller");
const { createLogDB } = require("../../log/log.service");

const { oracledb, get_pool} = require("../admin/admin.service");

function log_db_sql(app_id, sql, parameters){
	let parsed_sql = sql;
	Object.entries(parameters).forEach(function(parameter){
		if (parameter[1] == null)
			parsed_sql = parsed_sql.replaceAll(`:${parameter[0]}`, `${parameter[1]}`);
		else
			parsed_sql = parsed_sql.replaceAll(`:${parameter[0]}`, `'${parameter[1]}'`);
		
	});
	createLogDB(app_id, `DB:${process.env.SERVICE_DB_USE} Pool: ${app_id} SQL: ${parsed_sql}`);
}
async function execute_db_sql(app_id, sql, parameters, admin, 
							  app_filename, app_function, app_line, callBack){

		if (process.env.SERVICE_LOG_ENABLE_DB==1){
			log_db_sql(app_id, sql, parameters);
		}
		switch (process.env.SERVICE_DB_USE){
		case '1':{
			let conn;
			function config_connection(conn, query, values){
				//change parameters from [] to json syntax with bind variable names
				//old syntax: connection.query("UPDATE posts SET title = ?", ["value"];
				//new syntax: connection.query("UPDATE posts SET title = :title", { title: "value" });
				conn.config.queryFormat = function (query, values) {
					if (!values) return query;
					return query.replace(/\:(\w+)/g, function (txt, key) {
						if (values.hasOwnProperty(key)) {
						return this.escape(values[key]);
						}
						return txt;
					}.bind(this));
				};
			}
			//Both MySQL and MariaDB use MySQL npm module
			get_pool(app_id).getConnection(function (err, conn){
				if (err)
					return callBack(err, null);
				else
					config_connection(conn, sql, parameters);
					conn.query(sql, parameters, function (err, result, fields){
						conn.release();
						if (err)
							return callBack(err, null);
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
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(sql, parameters, (err,result) => {
														if (err) {
															createLogAppSE(app_id, app_filename, app_function, app_line, `${err.message}, SQL:${sql.substring(0,100)}...`, (err_log, result_log)=>{
																return callBack(err);
															})
														}
														else{
															if (!result.rows && result)
																return callBack(null, result);
															else
																return callBack(null, result.rows);
														}
													});
			}catch (err) {
				createLogAppSE(app_id, __appfilename, __appfunction, __appline, err.message, (err_log, result_log)=>{
					return callBack(err.message);
				})
			} finally {
				if (pool2) {
					try {
						await pool2.close(); 
					} catch (err) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, err.message, (err_log, result_log)=>{
							return callBack(err.message);
						})
					}
				}
			}
			break;
		}
		case '3':{
			let conn;
			/*original typescript
			type QueryReducerArray = [string, any[], number];
			function queryConvert(parameterizedSql: string, params: Dict<any>) {
			    const [text, values] = Object.entries(params).reduce(
			        ([sql, array, index], [key, value]) => [sql.replace(`:${key}`, `$${index}`), [...array, value], index + 1] as QueryReducerArray,
				        [parameterizedSql, [], 1] as QueryReducerArray
			    );
			    return { text, values };
			}	
			*/
			function queryConvert(parameterizedSql, params) {
			    const [text, values] = Object.entries(params).reduce(
			        ([sql, array, index], [key, value]) => [sql.replaceAll(`:${key}`, `$${index}`), [...array, value], index + 1],
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
					return callBack(null, result.rows);
				  })
				  .catch((err) => {
					pool3.release();
					return callBack(err, null);
				  })
			  })
			break;
		}
	}
}
function get_schema_name(){
	switch (process.env.SERVICE_DB_USE){
		case '1':{
			return process.env.SERVICE_DB_DB1_NAME;
			break;
		}
		case '2':{
			return process.env.SERVICE_DB_DB2_NAME;
			break;
		}
		case '3':{
			return process.env.SERVICE_DB_DB3_NAME;
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
function limit_sql(sql, limit_type){
	if (process.env.SERVICE_DB_USE == 1 || process.env.SERVICE_DB_USE == 3)
		switch (limit_type){
			case 1:{
				//use env limit
				return sql + ` LIMIT ${process.env.SERVICE_DB_LIMIT_LIST_SEARCH} `;
			}
			case 2:{
				//use env limit
				return sql + ` LIMIT ${process.env.SERVICE_DB_LIMIT_LIST_PROFILE_TOP} `;
			}
			case null:{
				//use app function limit
				return sql + ` LIMIT :limit OFFSET :offset`;	
			}
		}
	else 
		if (process.env.SERVICE_DB_USE == 2)
			switch (limit_type){
				case 1:{
					//use env limit
					return sql + ` FETCH NEXT ${process.env.SERVICE_DB_LIMIT_LIST_SEARCH} ROWS ONLY`;
				}
				case 2:{
					//use env limit
					return sql + ` FETCH NEXT ${process.env.SERVICE_DB_LIMIT_LIST_PROFILE_TOP} ROWS ONLY`;
				}
				case null:{
					//use app function limit
					return sql + ` OFFSET :offset FETCH NEXT :limit ROWS ONLY`;
				}
			}
		else
			return sql;
}
module.exports.execute_db_sql = execute_db_sql;
module.exports.get_schema_name = get_schema_name;
module.exports.get_locale = get_locale;
module.exports.limit_sql = limit_sql;