const {oracledb, get_pool} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
	createLog: (data, callBack) => {
		//max 4000 characters can be saved
		data.app_module_result = data.app_module_result.substr(0,3999);
		if (process.env.SERVICE_DB_USE==1){
			get_pool(data.app_id).query(
				`INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.app_log(
					app_id,
					app_module,
					app_module_type,
					app_module_request,
					app_module_result,
					app_user_id,
					user_language,
					user_timezone,
					user_number_system,
					user_platform,
					user_gps_latitude,
					user_gps_longitude,
					server_remote_addr,
					server_user_agent,
					server_http_host,
					server_http_accept_language,
					date_created)
				VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,SYSDATE())`,
				[
				data.app_id,
				data.app_module,
				data.app_module_type,
				data.app_module_request,
				data.app_module_result,
				data.app_user_id,
				data.user_language,
				data.user_timezone,
				data.user_number_system,
				data.user_platform,
				data.user_gps_latitude,
				data.user_gps_longitude,
				data.server_remote_addr,
				data.server_user_agent,
				data.server_http_host,
				data.server_http_accept_language
				],
				(error, results, fields) => {
					if (error){
						createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}	
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(data.app_id));
				const result = await pool2.execute(
					`INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.app_log(
						app_id,
						app_module,
						app_module_type,
						app_module_request,
						app_module_result,
						app_user_id,
						user_language,
						user_timezone,
						user_number_system,
						user_platform,
						user_gps_latitude,
						user_gps_longitude,
						server_remote_addr,
						server_user_agent,
						server_http_host,
						server_http_accept_language,
						date_created)
					VALUES(:app_id,
						   :app_module,
						   :app_module_type,
						   :app_module_request,
						   :app_module_result,
						   :app_user_id,
						   :user_language,
						   :user_timezone,
						   :user_number_system,
						   :user_platform,
						   :user_gps_latitude,
						   :user_gps_longitude,
						   :server_remote_addr,
						   :server_user_agent,
						   :server_http_host,
						   :server_http_accept_language,
						   SYSDATE)`,
					{
						app_id: data.app_id,
						app_module:data.app_module,
						app_module_type:data.app_module_type,
						app_module_request:data.app_module_request,
						app_module_result:data.app_module_result,
						app_user_id:data.app_user_id,
						user_language:data.user_language,
						user_timezone:data.user_timezone,
						user_number_system:data.user_number_system,
						user_platform:data.user_platform,
						user_gps_latitude:data.user_gps_latitude,
						user_gps_longitude:data.user_gps_longitude,
						server_remote_addr:data.server_remote_addr,
						server_user_agent:data.server_user_agent,
						server_http_host:data.server_http_host,
						server_http_accept_language:data.server_http_accept_language
					},
					(err,result) => {
						if (err) {
							createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
				}catch (err) {
					createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(data.app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	getLogs: callBack => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool(app_id).query(
				`SELECT
						id,
						app_id,
						app_module,
						app_module_type,
						app_module_request,
						app_module_result,
						app_user_id,
						user_language,
						user_timezone,
						user_number_system,
						user_platform,
						user_gps_latitude,
						user_gps_longitude,
						server_remote_addr,
						server_user_agent,
						server_http_host,
						server_http_accept_language,
						date_created
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app_log `,
				[],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}
		else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`SELECT
							id "id",
							app_id "app_id",
							app_module "app_module",
							app_module_type "app_module_type",
							app_module_request "app_module_request",
							app_module_result "app_module_result",
							app_user_id "app_user_id",
							user_language "user_language",
							user_timezone "user_timezone",
							user_number_system "user_number_system",
							user_platform "user_platform",
							user_gps_latitude "user_gps_latitude",
							user_gps_longitude "user_gps_longitude",
							server_remote_addr "server_remote_addr",
							server_user_agent "server_user_agent",
							server_http_host "server_http_host",
							server_http_accept_language "server_http_accept_language",
							date_created "date_created"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app_log`,
					{},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
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