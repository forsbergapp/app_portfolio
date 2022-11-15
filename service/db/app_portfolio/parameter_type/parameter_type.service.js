const {execute_db_sql, get_schema_name} = require ("../../common/common.service");
module.exports = {
	getParameterType: (app_id, id, callBack) => {
		let sql;
    	let parameters;
		sql = `SELECT id "id",
					  parameter_type_name "parameter_type_name"
				 FROM ${get_schema_name()}.parameter_type
				WHERE id = COALESCE(:id, id)
				ORDER BY 1`;
		parameters = {id: id};
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};