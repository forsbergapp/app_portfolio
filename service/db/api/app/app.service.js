const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	getApp:(id, callBack) => {
		if (typeof id=='undefined')
			id=null;
		if (process.env.SERVICE_DB_USE==1){
			pool.query(
				`SELECT
						id,
						app_name,
						url,
						logo
				FROM app
				WHERE id = COALESCE(?, id)
				ORDER BY 1 `,
				[id,
				 id],
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
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`SELECT
							id "id",
							app_name "app_name",
							url "url",
							logo "logo"
					FROM app
					WHERE id= NVL(:id, id)
					ORDER BY 1`,
					{id: id},
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