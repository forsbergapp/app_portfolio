const {oracledb, get_pool} = require ("../../config/database");

module.exports = {
	getApp:(id, callBack) => {
		if (typeof id=='undefined')
			id=null;
		if (process.env.SERVICE_DB_USE==1){
			get_pool(id).query(
				`SELECT
						id,
						app_name,
						url,
						logo
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app
				WHERE id = COALESCE(?, id)
				OR ? = 0
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
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(id));
				const result = await pool2.execute(
					`SELECT
							id "id",
							app_name "app_name",
							url "url",
							logo "logo"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app
					WHERE id= NVL(:id, id)
					OR :id = 0
					ORDER BY 1`,
					{id: id}, 
					(err,result) => {
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