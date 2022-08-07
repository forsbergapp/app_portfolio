const {execute_db_sql} = require ("../../common/database");
module.exports = {
	getParameterType: (id, callBack) => {
		let sql;
    	let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	id,
							parameter_type_name
					FROM ${process.env.SERVICE_DB_DB1_NAME}.parameter_type
					WHERE id = COALESCE(?, id)
					ORDER BY 1`;
			parameters = [id];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	id "id",
							parameter_type_name "parameter_type_name"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.parameter_type
					WHERE id = NVL(:id, id)
					ORDER BY 1`;
			parameters = {id: id};
		}
		execute_db_sql(id, null, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};