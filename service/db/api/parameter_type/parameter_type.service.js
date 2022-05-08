const {oracledb, get_pool_admin} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
	getParameterType: (id, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`SELECT
						id,
						parameter_type_name
                   FROM ${process.env.SERVICE_DB_DB1_NAME}.parameter_type
                  WHERE id = COALESCE(?, id)
				  ORDER BY 1`,
				[id],
				(error, results, fields) => {
					if (error){
						createLogAppSE(id, __appfilename, __appfunction, __appline, error);
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
				pool2 = await oracledb.getConnection(get_pool_admin());
				const result = await pool2.execute(
					`SELECT
                            id "id",
                            parameter_type_name "parameter_type_name"
                    FROM ${process.env.SERVICE_DB_DB2_NAME}.parameter_type
                    WHERE id = NVL(:id, id)
					ORDER BY 1`,
					{id: id},
					(err,result) => {
						if (err) {
							createLogAppSE(id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					createLogAppSE(id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	}
};