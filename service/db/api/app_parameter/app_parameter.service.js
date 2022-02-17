const {oracle_options,get_pool} = require ("../../config/database");

module.exports = {
	//returns parameters for app_id=0 and given app_id
	getParameters: (app_id, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool(app_id).query(
				`SELECT
						APP_ID,
						parameter_type_id,
						parameter_name,
						parameter_value,
						parameter_comment
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app_parameter
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
		else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await get_pool(app_id).getConnection();
				const result = await pool2.execute(
					`SELECT
                            app_id "app_id",
                            parameter_type_id "parameter_type_id",
                            parameter_name "parameter_name",
                            parameter_value "parameter_value",
							parameter_comment "parameter_comment"
                       FROM ${process.env.SERVICE_DB_DB2_NAME}.app_parameter
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
				}catch (err) {
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							console.error(err);
						}
					}
				}
			}
			execute_sql();
		}
	}
};