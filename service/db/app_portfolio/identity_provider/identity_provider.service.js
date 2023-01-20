const {execute_db_sql, get_schema_name} = await import(`file://${process.cwd()}/service/db/common/common.service.js`);

function getIdentityProviders(app_id, callBack){
		let sql;
		let parameters;
		sql = `SELECT id "id",
				 	  provider_name "provider_name",
					  api_src "api_src",
					  api_src2 "api_src2",
					  api_version "api_version",
					  api_id "api_id"
				 FROM ${get_schema_name()}.identity_provider
				WHERE enabled = 1
				ORDER BY identity_provider_order ASC`;
		parameters = {};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(function({COMMON}){
			execute_db_sql(app_id, sql, parameters, 
						COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{getIdentityProviders};