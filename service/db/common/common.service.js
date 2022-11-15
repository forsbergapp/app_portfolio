const { createLogAppSE } = require("../../log/log.controller");
const { createLogDB } = require("../../log/log.service");

const { oracledb, get_pool} = require("../admin/admin.service");

function log_db_sql(app_id, sql, parameters){
	let parsed_sql = sql;
	Object.entries(parameters).forEach(function(parameter){
		if (parameter[1] == null)
			parsed_sql = parsed_sql.replace(`:${parameter[0]}`, `${parameter[1]}`);
		else
			parsed_sql = parsed_sql.replace(`:${parameter[0]}`, `'${parameter[1]}'`);
		
	});
	createLogDB(app_id, `DB:${process.env.SERVICE_DB_USE} Pool: ${app_id} SQL: ${parsed_sql}`);
}
async function execute_db_sql(app_id, sql, parameters, admin, 
							  app_filename, app_function, app_line, callBack){

	switch (process.env.SERVICE_DB_USE){
		case '1':{
			if (process.env.SERVICE_LOG_ENABLE_DB==1){
				log_db_sql(app_id, sql, parameters);
			}
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
						else
							return callBack(null, result);
					})
			});
			break;
		}
		case '2':{
			if (process.env.SERVICE_LOG_ENABLE_DB==1){
				log_db_sql(app_id, sql, parameters);
			}
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
	}
}
module.exports.execute_db_sql = execute_db_sql;
module.exports.get_schema_name = get_schema_name;