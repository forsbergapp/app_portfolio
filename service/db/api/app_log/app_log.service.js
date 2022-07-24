const {execute_db_sql} = require ("../../config/database");
module.exports = {
	createLog: (data, callBack) => {
		let sql;
		let parameters;
		//max 4000 characters can be saved
		if (data.app_module_result!=null)
			data.app_module_result = data.app_module_result.substr(0,3999);
		if (process.env.SERVICE_DB_USE==1){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.app_log(
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
					VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,SYSDATE())`;
			parameters = [
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
							data.client_latitude,
							data.client_longitude,
							data.server_remote_addr,
							data.server_user_agent,
							data.server_http_host,
							data.server_http_accept_language
							];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.app_log(
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
						:app_module_type,
						:app_module_request,
						:app_module_result,
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
						SYSDATE)`;
			parameters = {
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
							client_latitude:data.client_latitude,
							client_longitude:data.client_longitude,
							server_remote_addr:data.server_remote_addr,
							server_user_agent:data.server_user_agent,
							server_http_host:data.server_http_host,
							server_http_accept_language:data.server_http_accept_language
						};
		}
		execute_db_sql(data.app_id, data.app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getLogs: (app_id, year, month, sort, order_by, offset, limit, callBack) => {
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
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	id,
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
							date_created,
							count(*) over() total_rows
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app_log 
					WHERE app_id = COALESCE(?, app_id)
					AND   DATE_FORMAT(date_created, '%Y') = ?
					AND   DATE_FORMAT(date_created, '%c') = ?
					ORDER BY ${sort} ${order_by}
					LIMIT ?,?`;
			parameters = [	app_id,
							year,
							month,
							offset,
							limit];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	id "id",
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
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app_log
					WHERE app_id = NVL(:app_id, app_id)
					AND   TO_CHAR(date_created, 'YYYY') = :year
					AND   TO_CHAR(date_created, 'fmMM') = :month
					ORDER BY ${sort} ${order_by}
					OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY`;
			parameters = {	app_id:app_id,
							year:year,
							month:month,
							offset:offset,
							limit:limit};
		}
		execute_db_sql(process.env.MAIN_APP_ID, null, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getStatUniqueVisitor: (app_id, statchoice, year, month, callBack) => {
		let sql;
		let parameters;
		if (app_id=='')
			app_id = null;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	app_id,
							DATE_FORMAT(date_created, '%Y') year,
							DATE_FORMAT(date_created, '%c') month,
							null 							day,
							COUNT(DISTINCT server_remote_addr) amount
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app_log
					WHERE 1 = ?
					AND   app_id = COALESCE(?, app_id)
					AND   DATE_FORMAT(date_created, '%Y') = ?
					AND   DATE_FORMAT(date_created, '%c') = ?
					GROUP BY app_id,
							DATE_FORMAT(date_created, '%Y'),
							DATE_FORMAT(date_created, '%c')
					UNION ALL
					SELECT
							app_id,
							DATE_FORMAT(date_created, '%Y') year,
							DATE_FORMAT(date_created, '%c') month,
							DATE_FORMAT(date_created, '%e') day,
							COUNT(DISTINCT server_remote_addr) amount
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app_log
					WHERE 2 = ?
					AND   app_id = COALESCE(?, app_id)
					AND   DATE_FORMAT(date_created, '%Y') = ?
					AND   DATE_FORMAT(date_created, '%c') = ?
					GROUP BY app_id,
							DATE_FORMAT(date_created, '%Y'),
							DATE_FORMAT(date_created, '%c'),
							DATE_FORMAT(date_created, '%e')
					ORDER BY 4`;
			parameters = [	statchoice,
							app_id,
							year,
							month,
							statchoice,
							app_id,
							year,
							month];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	app_id "app_id",
							TO_CHAR(date_created, 'YYYY') 	"year",
							TO_CHAR(date_created, 'fmMM') 	"month",
							null 							"day",
							COUNT(DISTINCT server_remote_addr) "amount"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app_log
					WHERE 1 = :statchoice
					AND  app_id = NVL(:app_id, app_id)
					AND TO_CHAR(date_created, 'YYYY') = :year
					AND TO_CHAR(date_created, 'fmMM') = :month
					GROUP BY app_id,
							TO_CHAR(date_created, 'YYYY'),
							TO_CHAR(date_created, 'fmMM')
					UNION ALL
					SELECT
							app_id "app_id",
							TO_CHAR(date_created, 'YYYY') 	"year",
							TO_CHAR(date_created, 'fmMM') 	"month",
							TO_CHAR(date_created, 'DD') 	"day",
							COUNT(DISTINCT server_remote_addr) "amount"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app_log
					WHERE 2 = :statchoice
					AND  app_id = NVL(:app_id, app_id)
					AND TO_CHAR(date_created, 'YYYY') = :year
					AND TO_CHAR(date_created, 'fmMM') = :month
					GROUP BY app_id,
							TO_CHAR(date_created, 'YYYY'),
							TO_CHAR(date_created, 'fmMM'),
							TO_CHAR(date_created, 'DD')
					ORDER BY 4`;
			parameters = {	statchoice: statchoice,
							app_id: app_id,
							year: year,
							month:month};
		}
		execute_db_sql(app_id, null, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};