const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const insertUserAccountView = (app_id, data, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${db_schema()}.user_account_view(
							user_account_id, user_account_id_view, client_ip, client_user_agent, client_longitude, client_latitude, date_created)
				VALUES(:user_account_id,:user_Xaccount_id_view,:client_ip,:client_user_agent,:client_longitude,:client_latitude, CURRENT_TIMESTAMP) `;
		parameters = {
						user_account_id: data.user_account_id,
						user_Xaccount_id_view: data.user_account_id_view,
						client_ip: data.client_ip,
						client_user_agent: data.client_user_agent,
						client_longitude: data.client_longitude,
						client_latitude: data.client_latitude
					};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{insertUserAccountView};