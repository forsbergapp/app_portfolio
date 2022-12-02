const {execute_db_sql, get_schema_name, limit_sql} = require ("../../common/common.service");
module.exports = {
	createLog: (app_id, data, callBack) => {
		let sql;
		let parameters;
		//max 4000 characters can be saved
		if (data.app_module_result!=null)
			data.app_module_result = data.app_module_result.substr(0,3999);
		sql = `INSERT INTO ${get_schema_name()}.app_log(
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
					client_latitude,
					client_longitude,
					server_remote_addr,
					server_user_agent,
					server_http_host,
					server_http_accept_language,
					date_created)
				VALUES(:app_id,
					:app_module,
					:app_Xmodule_type,
					:app_Xmodule_request,
					:app_Xmodule_result,
					:app_user_id,
					:user_language,
					:user_timezone,
					:user_number_system,
					:user_platform,
					:client_latitude,
					:client_longitude,
					:server_remote_addr,
					:server_user_agent,
					:server_http_host,
					:server_http_accept_language,
					CURRENT_TIMESTAMP)`;
		parameters = {
						app_id: data.app_id,
						app_module: data.app_module,
						app_Xmodule_type: data.app_module_type,
						app_Xmodule_request: data.app_module_request,
						app_Xmodule_result: data.app_module_result,
						app_user_id: data.app_user_id,
						user_language: data.user_language,
						user_timezone: data.user_timezone,
						user_number_system: data.user_number_system,
						user_platform: data.user_platform,
						client_latitude: data.client_latitude,
						client_longitude: data.client_longitude,
						server_remote_addr: data.server_remote_addr,
						server_user_agent: data.server_user_agent,
						server_http_host: data.server_http_host,
						server_http_accept_language: data.server_http_accept_language
					};
		execute_db_sql(app_id, sql, parameters, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	createLogAdmin: (app_id, data, callBack) => {
		let sql;
		let parameters;
		//max 4000 characters can be saved
		if (data.app_module_result!=null)
			data.app_module_result = data.app_module_result.substr(0,3999);
		sql = `INSERT INTO ${get_schema_name()}.app_log(
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
					client_latitude,
					client_longitude,
					server_remote_addr,
					server_user_agent,
					server_http_host,
					server_http_accept_language,
					date_created)
				VALUES(:app_id,
					:app_module,
					:app_Xmoduletype,
					:app_Xmodulerequest,
					:app_Xmoduleresult,
					:app_user_id,
					:user_language,
					:user_timezone,
					:user_number_system,
					:user_platform,
					:client_latitude,
					:client_longitude,
					:server_remote_addr,
					:server_user_agent,
					:server_http_host,
					:server_http_accept_language,
					CURRENT_TIMESTAMP)`;
		parameters = {
						app_id: data.app_id,
						app_module: data.app_module,
						app_Xmoduletype: data.app_module_type,
						app_Xmodulerequest: data.app_module_request,
						app_Xmoduleresult: data.app_module_result,
						app_user_id: data.app_user_id,
						user_language: data.user_language,
						user_timezone: data.user_timezone,
						user_number_system: data.user_number_system,
						user_platform: data.user_platform,
						client_latitude: data.client_latitude,
						client_longitude: data.client_longitude,
						server_remote_addr: data.server_remote_addr,
						server_user_agent: data.server_user_agent,
						server_http_host: data.server_http_host,
						server_http_accept_language: data.server_http_accept_language
					};
		execute_db_sql(app_id, sql, parameters,
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getLogsAdmin: (app_id, data_app_id, year, month, sort, order_by, offset, limit, callBack) => {
		/* 	sort in UI:
			1=ID
			2=APP ID
			3=MODULE
			4=MODULE TYPE
			5=IP
			6=GPS LAT
			7=GPS LONG
			8=DATE
		*/
		let sql;
		let parameters;
		switch (sort){
			case 5:{
				sort=14;
				break
			}
			case 6:{
				sort=12;
				break
			}
			case 7:{
				sort=13;
				break
			}
			case 8:{
				sort=18;
				break
			}
		}
		if (data_app_id=='')
			data_app_id = null;
		sql = `SELECT id "id",
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
					  client_latitude "client_latitude",
					  client_longitude "client_longitude",
					  server_remote_addr "server_remote_addr",
					  server_user_agent "server_user_agent",
					  server_http_host "server_http_host",
					  server_http_accept_language "server_http_accept_language",
					  date_created "date_created",
					  count(*) over() "total_rows"
				 FROM ${get_schema_name()}.app_log
				WHERE app_id = COALESCE(:app_id, app_id)
				  AND EXTRACT(year from date_created) = :year
				  AND EXTRACT(month from date_created) = :month
				ORDER BY ${sort} ${order_by} `;
		sql = limit_sql(sql, null);
		parameters = {	app_id:data_app_id,
						year:year,
						month:month,
						offset:offset,
						limit:limit};
		execute_db_sql(app_id, sql, parameters,
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getStatUniqueVisitorAdmin: (app_id, data_app_id, statchoice, year, month, callBack) => {
		let sql;
		let parameters;
		if (data_app_id=='')
			data_app_id = null;
		sql = `SELECT t.app_id "app_id",
					  t.year_log "year",
					  t.month_log "month",
					  t.day_log "day",
					  COUNT(DISTINCT t.server_remote_addr) 	"amount"
				 FROM (SELECT app_id,
					          EXTRACT(YEAR FROM date_created)		year_log,
					          EXTRACT(MONTH FROM date_created) 		month_log,
					          NULL 									day_log,
					          server_remote_addr
						 FROM ${get_schema_name()}.app_log
						WHERE 1 = :statchoice
						  AND app_id = COALESCE(:app_id_log, app_id)
						  AND EXTRACT(YEAR FROM date_created) = :year_log
						  AND EXTRACT(MONTH FROM date_created) = :month_log
						UNION ALL
					   SELECT NULL 									app_id,
							  EXTRACT(YEAR FROM date_created) 		year_log,
							  EXTRACT(MONTH FROM date_created) 		month_log,
							  EXTRACT(DAY FROM date_created) 		day_log,
							  server_remote_addr
						 FROM ${get_schema_name()}.app_log
						WHERE 2 = :statchoice
						  AND app_id = COALESCE(:app_id_log, app_id)
						  AND EXTRACT(YEAR FROM date_created) = :year_log
						  AND EXTRACT(MONTH FROM date_created) = :month_log) t
				GROUP BY t.app_id,
						 t.year_log,
						 t.month_log,
						 t.day_log
				ORDER BY 4`;
		parameters = {	statchoice: statchoice,
						app_id_log: data_app_id,
						year_log: year,
						month_log:month};
		execute_db_sql(app_id, sql, parameters,
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};