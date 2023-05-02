const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const getIdentityProviders = (app_id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT id "id",
				 	  provider_name "provider_name",
					  api_src "api_src",
					  api_src2 "api_src2",
					  api_version "api_version",
					  api_id "api_id"
				 FROM ${db_schema()}.identity_provider
				WHERE enabled = 1
				ORDER BY identity_provider_order ASC`;
		parameters = {};
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
export{getIdentityProviders};