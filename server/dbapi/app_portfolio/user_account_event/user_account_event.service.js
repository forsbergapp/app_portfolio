const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const insertUserEvent = (app_id, data, callBack) => {
		const sql = `INSERT INTO ${db_schema()}.user_account_event(
							user_account_id, event_id, event_status_id,
							date_created, date_modified,
							user_language, user_timezone, user_number_system, user_platform,
							client_latitude, client_longitude,
							server_remote_addr,server_user_agent, server_http_host, server_http_accept_language)
					SELECT :user_account_id, e.id, es.id, 
						   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
						   :user_language, :user_timezone, :user_number_system, :user_platform, 
						   :client_latitude, :client_longitude,
						   :server_remote_addr, :server_user_agent, :server_http_host, :server_http_accept_language
					  FROM ${db_schema()}.event e,
						   ${db_schema()}.event_status es
					 WHERE e.event_name = :event
					   AND es.status_name = :event_status`;
		const parameters = {
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
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
const getLastUserEvent = (app_id, user_account_id, event, callBack) => {
		const sql = `SELECT uae.user_account_id "user_account_id",
							uae.event_id "event_id",
							e.event_name "event_name",
							uae.event_status_id "event_status_id",
							es.status_name "status_name",
							uae.date_created "date_created",
							uae.date_modified "date_modified",
							CURRENT_TIMESTAMP "current_timestamp"
					   FROM ${db_schema()}.user_account_event uae,
							${db_schema()}.event e,
							${db_schema()}.event_status es
					  WHERE uae.user_account_id = :user_account_id
						AND e.id = uae.event_id
						AND e.event_name = :event
						AND es.id = uae.event_status_id
						AND uae.date_created = (SELECT MAX(uae_max.date_created)
												  FROM ${db_schema()}.user_account_event uae_max,
													   ${db_schema()}.event_status es_max
												 WHERE uae_max.user_account_id = uae.user_account_id
												   AND uae_max.event_id = uae.event_id
												   AND es_max.id = uae_max.event_status_id)`;
		const parameters = {
						user_account_id: user_account_id,
						event : event
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
export{insertUserEvent, getLastUserEvent};