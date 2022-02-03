const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	getApp: callBack => {
		if (process.env.SERVER_DB_USE==1){
			pool.query(
				`SELECT
						id,
						app_name
				FROM app `,
				[],
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
							id, "id"
							app_name "app_name"
					FROM app`,
					{},
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