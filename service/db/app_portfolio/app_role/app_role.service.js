const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const getAppRoleAdmin = (app_id, id, callBack) => {
		let sql;
		let parameters;
        sql = `SELECT ar.id "id",
                      ar.role_name "role_name",
                      ar.icon "icon"
                 FROM ${db_schema()}.app_role ar
                WHERE ar.id = COALESCE(:id, ar.id)
                ORDER BY 1`;
        
		parameters = {id: id};
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
export{getAppRoleAdmin};