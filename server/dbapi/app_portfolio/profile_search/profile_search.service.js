const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const insertProfileSearch = (app_id, data, callBack) => {
		const sql = `INSERT INTO ${db_schema()}.profile_search(
								user_account_id, search, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
					VALUES(:user_account_id,:search,:client_ip,:client_user_agent,:client_longitude,:client_latitude, CURRENT_TIMESTAMP)`;
		const parameters = {
						user_account_id: data.user_account_id,
						search: data.search,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
export{insertProfileSearch};