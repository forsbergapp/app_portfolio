const {execute_db_sql} = require ("../../config/database");
module.exports = {
	insertUserEvent: (data, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.user_account_event(
								user_account_id, event_id, event_status_id,
								date_created, date_modified,
								user_language, user_timezone, user_number_system, user_platform,
								client_latitude, client_longitude,
								server_remote_addr,server_user_agent, server_http_host, server_http_accept_language)
					SELECT ?, e.id, es.id, 
						SYSDATE(), SYSDATE(),
						?, ?, ?, ?, 
						?, ?,
						?, ?, ?, ?
					FROM  ${process.env.SERVICE_DB_DB1_NAME}.event e,
						${process.env.SERVICE_DB_DB1_NAME}.event_status es
					WHERE  e.event_name = ?
					AND  es.status_name = ?`;
			parameters = [
							data.user_account_id, 
							data.user_language,
							data.user_timezone,
							data.user_number_system, 
							data.user_platform,
							data.client_latitude, 
							data.client_longitude,
							data.server_remote_addr,
							data.server_user_agent,
							data.server_http_host, 
							data.server_http_accept_language,
							data.event,
							data.event_status
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.user_account_event(
								user_account_id, event_id, event_status_id,
								date_created, date_modified,
								user_language, user_timezone, user_number_system, user_platform,
								client_latitude, client_longitude,
								server_remote_addr,server_user_agent, server_http_host, server_http_accept_language)
					SELECT :user_account_id, e.id, es.id, 
						SYSDATE, SYSDATE,
						:user_language, :user_timezone, :user_number_system, :user_platform, 
						:client_latitude, :client_longitude,
						:server_remote_addr, :server_user_agent, :server_http_host, :server_http_accept_language
					FROM ${process.env.SERVICE_DB_DB2_NAME}.event e,
						${process.env.SERVICE_DB_DB2_NAME}.event_status es
						WHERE e.event_name = :event
					AND es.status_name = :event_status`;
			parameters = {
							user_account_id : data.user_account_id, 
							user_language: data.user_language,
							user_timezone: data.user_timezone,
							user_number_system : data.user_number_system, 
							user_platform : data.user_platform,
							client_latitude : data.client_latitude, 
							client_longitude : data.client_longitude,
							server_remote_addr : data.server_remote_addr,
							server_user_agent : data.server_user_agent,
							server_http_host : data.server_http_host, 
							server_http_accept_language : data.server_http_accept_language,
							event : data.event,
							event_status : data.event_status
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
	getLastUserEvent: (app_id, user_account_id, event, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT 	uae.user_account_id,
							uae.event_id,
							e.event_name,
							uae.event_status_id,
							es.status_name,
							uae.date_created,
							uae.date_modified,
							to_days(sysdate()) - to_days(uae.date_created) event_days
					FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_event uae,
							${process.env.SERVICE_DB_DB1_NAME}.event e,
							${process.env.SERVICE_DB_DB1_NAME}.event_status es
					WHERE uae.user_account_id = ?
						AND e.id = uae.event_id
						AND e.event_name = ?
						AND es.id = uae.event_status_id
						AND uae.date_created = (SELECT MAX(uae_max.date_created)
												FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account_event uae_max,
													${process.env.SERVICE_DB_DB1_NAME}.event_status es_max
												WHERE uae_max.user_account_id = uae.user_account_id
												AND uae_max.event_id = uae.event_id
												AND es_max.id = uae_max.event_status_id)`;
			parameters = [
							user_account_id,
							event
						 ];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT 	uae.user_account_id "user_account_id",
							uae.event_id "event_id",
							e.event_name "event_name",
							uae.event_status_id "event_status_id",
							es.status_name "status_name",
							uae.date_created "date_created",
							uae.date_modified "date_modified",
							TO_NUMBER(TO_CHAR(SYSDATE,'J')) - TO_NUMBER(TO_CHAR(date_created,'J')) "event_days"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_event uae,
							${process.env.SERVICE_DB_DB2_NAME}.event e,
							${process.env.SERVICE_DB_DB2_NAME}.event_status es
					WHERE uae.user_account_id = :user_account_id
						AND e.id = uae.event_id
						AND e.event_name = :event
						AND es.id = uae.event_status_id
						AND uae.date_created = (SELECT MAX(uae_max.date_created)
												FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account_event uae_max,
														${process.env.SERVICE_DB_DB2_NAME}.event_status es_max
												WHERE uae_max.user_account_id = uae.user_account_id
												AND uae_max.event_id = uae.event_id
												AND es_max.id = uae_max.event_status_id)`;
			parameters = {
							user_account_id: user_account_id,
							event : event
						 };
		}
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	}
};