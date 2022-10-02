const {execute_db_sql} = require ("../../common/database");
module.exports = {
	getIdentityProviders: (app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT id,
			              provider_name,
						  api_src,
						  api_src2,
						  api_version,
						  api_id
			         FROM ${process.env.SERVICE_DB_DB1_NAME}.identity_provider
					WHERE enabled = 1
					ORDER BY identity_provider_order ASC`;
			parameters = [];
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT id "id",
						  provider_name "provider_name",
						  api_src "api_src",
						  api_src2 "api_src2",
						  api_version "api_version",
						  api_id "api_id"
					 FROM ${process.env.SERVICE_DB_DB2_NAME}.identity_provider
					WHERE enabled = 1
					ORDER BY identity_provider_order ASC`;
			parameters = {};
		}
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};