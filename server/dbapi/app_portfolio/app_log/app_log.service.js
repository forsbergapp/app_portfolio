const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema, db_limit_rows} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const createLog = (app_id, data, callBack) => {
	if (ConfigGet('SERVICE_AUTH', 'ENABLE_DBLOG')=='1'){
		//max 4000 characters can be saved
		if (data.app_module_result!=null)
			data.app_module_result = data.app_module_result.substr(0,3999);
		const sql = `INSERT INTO ${db_schema()}.app_log(
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
		const parameters = {
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
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
	else
		return callBack(null, null);
};

const getLogsAdmin = (app_id, data_app_id, year, month, sort, order_by, offset, limit, callBack) => {
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
		switch (sort){
			case 5:{
				sort=14;
				break;
			}
			case 6:{
				sort=12;
				break;
			}
			case 7:{
				sort=13;
				break;
			}
			case 8:{
				sort=18;
				break;
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
				 FROM ${db_schema()}.app_log
				WHERE app_id = COALESCE(:app_id, app_id)
				  AND EXTRACT(year from date_created) = :year
				  AND EXTRACT(month from date_created) = :month
				ORDER BY ${sort} ${order_by} `;
		sql = db_limit_rows(sql, null);
		const parameters = {app_id:data_app_id,
							year:year,
							month:month,
							offset:offset,
							limit:limit};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const getStatUniqueVisitorAdmin = (app_id, data_app_id, year, month, callBack) => {
		
		const sql = `SELECT t.chart "chart",
		              t.app_id "app_id",
					  t.year_log "year",
					  t.month_log "month",
					  t.day_log "day",
					  COUNT(DISTINCT t.server_remote_addr) 	"amount"
				 FROM (SELECT 1										chart,
							  app_id,
					          EXTRACT(YEAR FROM date_created)		year_log,
					          EXTRACT(MONTH FROM date_created) 		month_log,
					          NULL 									day_log,
					          server_remote_addr
						 FROM ${db_schema()}.app_log
						WHERE EXTRACT(YEAR FROM date_created) = :year_log
						  AND EXTRACT(MONTH FROM date_created) = :month_log
						UNION ALL
					   SELECT 2										chart,
					   		  NULL 									app_id,
							  EXTRACT(YEAR FROM date_created) 		year_log,
							  EXTRACT(MONTH FROM date_created) 		month_log,
							  EXTRACT(DAY FROM date_created) 		day_log,
							  server_remote_addr
						 FROM ${db_schema()}.app_log
						WHERE app_id = COALESCE(:app_id_log, app_id)
						  AND EXTRACT(YEAR FROM date_created) = :year_log
						  AND EXTRACT(MONTH FROM date_created) = :month_log) t
				GROUP BY t.chart,
				         t.app_id,
						 t.year_log,
						 t.month_log,
						 t.day_log
				ORDER BY 1, 5`;
		const parameters = {app_id_log: data_app_id,
							year_log: year,
							month_log: month};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
export{createLog, getLogsAdmin, getStatUniqueVisitorAdmin};