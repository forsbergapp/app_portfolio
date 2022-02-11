const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	//returns parameters for app_id=0 and given app_id
	getParameters: (app_id, callBack) => {
		if (process.env.SERVER_DB_USE==1){
			pool.query(
				`SELECT
						app_id,
						parameter_type_id,
						parameter_name,
						parameter_value,
						parameter_comment
				FROM app_parameter
                WHERE app_id = ?
					OR app_id = 0
				ORDER BY 1 `,
				[app_id],
				(error, results, fields) => {
					if (error){
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}
		else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`SELECT
                            app_id "app_id",
                            parameter_type_id "parameter_type_id",
                            parameter_name "parameter_name",
                            parameter_value "parameter_value",
							parameter_comment "parameter_comment"
                       FROM app_parameter
                      WHERE app_id = :app_id
					  OR app_id = 0
					ORDER BY 1`,
					{app_id: app_id},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	}
};