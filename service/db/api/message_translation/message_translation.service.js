const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	getMessage: (code, app_id, lang_code, callBack) => {
		if (process.env.SERVER_DB_USE==1){
			pool.query(
				`SELECT m.code,
						m.message_level_id,
						m.message_type_id,
						mt.language_id,
						l.lang_code,
						mt.text,
						am.app_id
				FROM message m,
					 message_translation mt,
					 app_message am,
				     language l
				WHERE mt.language_id = l.id
				  AND mt.message_code = m.code
				  AND am.message_code = m.code
				  AND am.app_id = ?
				  AND m.code = ?
				  AND (l.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
						OR (l.lang_code = 'en'
							AND NOT EXISTS(SELECT NULL
											FROM message_translation mt1,
												language l1
											WHERE mt1.message_code = mt.message_code
												AND l1.id = mt1.language_id
												AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
										)
							)
						)`,
				[app_id,
				 code,
				 lang_code,
				 lang_code,
				 lang_code,
				 lang_code,
				 lang_code,
				 lang_code
				 ],
				(error, results, fields) => {
					if (error){
						return callBack(error);
					}
					return callBack(null, results[0]);
				}
			);
		}
		else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`SELECT m.code "code",
							m.message_level_id "message_level_id",
							m.message_type_id "message_type_id",
							mt.language_id "language_id",
							l.lang_code "lang_code",
							mt.text "text",
							am.app_id "app_id"
					   FROM message m,
							message_translation mt,
							app_message am,
							language l
					  WHERE mt.language_id = l.id
						AND mt.message_code = m.code
						AND am.message_code = m.code
						AND am.app_id = :app_id
					    AND m.code = :code
						AND (l.lang_code IN (:lang_code, 
											SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
											SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
						OR (l.lang_code = 'en'
							AND NOT EXISTS(SELECT NULL
											FROM message_translation mt1,
												language l1
										WHERE mt1.message_code = mt.message_code
											AND l1.id = mt1.language_id
											AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
											)
							)
						)`,
					{
						app_id: app_id,
						code: code,
						lang_code: lang_code
					},
					oracle_options, (err,result) => {
						if (err) {
							console.log('getMessage err:' + JSON.stringify(err));
							return callBack(err);
						}
						else{
							return callBack(null, result.rows[0]);
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