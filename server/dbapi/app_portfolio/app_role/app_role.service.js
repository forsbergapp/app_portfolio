const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const getAppRoleAdmin = (app_id, id, callBack) => {
        const sql = `SELECT ar.id "id",
							ar.role_name "role_name",
							ar.icon "icon"
					   FROM ${db_schema()}.app_role ar
					  WHERE ((ar.id = :id) OR :id IS NULL)
					 ORDER BY 1`;
        
		const parameters = {id: id};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
export{getAppRoleAdmin};