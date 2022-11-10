const { createLogAppSE } = require("../../log/log.controller");
const { createLogDB } = require("../../log/log.service");

const { oracledb, get_pool} = require("../admin/admin.service");

function log_db_sql(app_id, sql, parameters){
	let parsed_sql = sql;
	switch (process.env.SERVICE_DB_USE){
		case '1':
			parameters.forEach(function(parameter){
				if (parameter == null)
					parsed_sql = parsed_sql.replace('?', `${parameter}`);
				else
					parsed_sql = parsed_sql.replace('?', `'${parameter}'`);
			});
			break;
		case '2':{
			Object.entries(parameters).forEach(function(parameter){
				if (parameter[1] == null)
					parsed_sql = parsed_sql.replace(`:${parameter[0]}`, `${parameter[1]}`);
				else
					parsed_sql = parsed_sql.replace(`:${parameter[0]}`, `'${parameter[1]}'`);
				
			});
			break;
		}
	}
	createLogDB(app_id, `DB:${process.env.SERVICE_DB_USE} Pool: ${app_id} SQL: ${parsed_sql}`);
}
async function execute_db_sql(app_id, sql, parameters, admin, 
							  app_filename, app_function, app_line, callBack){

	switch (process.env.SERVICE_DB_USE){
		case '1':{
			if (process.env.SERVICE_LOG_ENABLE_DB==1){
				log_db_sql(app_id, sql, parameters);
			}
			if (process.env.SERVICE_DB_DB1_VARIANT==1){
				//MySQL
				get_pool(app_id).query(sql, parameters, 
					(error, results, fields) => {
						if (error){
							createLogAppSE(app_id, app_filename, app_function, app_line, error, (err_log, result_log)=>{
								return callBack(error);
							})
						}
						else
							return callBack(null, results);
				})
			}
			else{
				//MariaDB
				let conn;
				//BigInt can be returned in MariaDB, to avoid: 'TypeError: Do not know how to serialize a BigInt\n    
				BigInt.prototype.toJSON = function() { return this.toString() }
				try {
					conn = await get_pool(app_id).getConnection();
					const conn_result = await conn.query(sql, parameters).then(function(result){
						return callBack(null, result);
					});														
				} catch (err) {
					createLogAppSE(app_id, app_filename, app_function, app_line, err, (err_log, result_log)=>{
						return callBack(err);
					})
				} finally {
					if (conn) 
						return conn.end();
				}
			}
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
module.exports.execute_db_sql = execute_db_sql;