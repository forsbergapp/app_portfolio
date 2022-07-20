const {oracledb, get_pool, get_pool_admin} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
	getApp:(id, lang_code, callBack) => {
		if (typeof id=='undefined')
			id=null;
		if (process.env.SERVICE_DB_USE==1){
			get_pool(id).query(
				`SELECT
						a.id,
						a.app_name,
						a.url,
						a.logo,
						aoit.text app_description
				  FROM ${process.env.SERVICE_DB_DB1_NAME}.app a
				       LEFT OUTER JOIN ${process.env.SERVICE_DB_DB1_NAME}.app_object_translation aoit
				        ON aoit.app_id = a.id
					   AND aoit.object_name = 'APP_DESCRIPTION'
				   	   AND aoit.language_id IN (SELECT id 
												  FROM ${process.env.SERVICE_DB_DB1_NAME}.language l
												 WHERE (l.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
														OR (l.lang_code = 'en'
															AND NOT EXISTS(SELECT NULL
																			 FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object_translation aoit1,
																				  ${process.env.SERVICE_DB_DB1_NAME}.language l1
																			WHERE l1.id  = aoit1.language_id
																			  AND aoit1.app_id  = aoit.app_id
																			  AND aoit1.object_name = aoit.object_name
																			  AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
																		  )
														   )
													   )
											   )
				 WHERE (a.id = COALESCE(?, a.id)
				       OR 
					   ? = 0)
				   AND a.enabled = 1
				ORDER BY 1 `,
				[lang_code,
				 lang_code,
				 lang_code,
				 lang_code,
				 lang_code,
				 lang_code,
				 id,
				 id],
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
				pool2 = await oracledb.getConnection(get_pool(id));
				const result = await pool2.execute(
					`SELECT
							id "id",
							app_name "app_name",
							url "url",
							logo "logo",
							aoit.text "app_description"
					   FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
							LEFT OUTER JOIN ${process.env.SERVICE_DB_DB2_NAME}.app_object_translation aoit
								ON aoit.app_id = a.id
							AND aoit.object_name = 'APP_DESCRIPTION'
							AND aoit.language_id IN (SELECT id 
														FROM ${process.env.SERVICE_DB_DB2_NAME}.language l
														WHERE (l.lang_code IN (:lang_code, 
																			   SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
																			   SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
																OR (l.lang_code = 'en'
																	AND NOT EXISTS(SELECT NULL
																					 FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object_translation aoit1,
																						  ${process.env.SERVICE_DB_DB2_NAME}.language l1
																					WHERE l1.id  = aoit1.language_id
																					  AND aoit1.app_id  = aoit.app_id
																					  AND aoit1.object_name = aoit.object_name
																					  AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
																				)
																)
															)
													)
					WHERE (id= NVL(:id, id)
						   OR 
						   :id = 0)
					AND enabled = 1
					ORDER BY 1`,
					{lang_code: lang_code,
					 id: id}, 
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
	},
	getAppsAdmin:(id, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`SELECT
						id,
						app_name,
						url,
						logo,
						enabled
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app
				ORDER BY 1 `,
				[],
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
							app_name "app_name",
							url "url",
							logo "logo",
							enabled "enabled"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app
					ORDER BY 1`,
					{}, 
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
	},
	updateApp:(id, body, callBack) => {
		if (process.env.SERVICE_DB_USE==1){
			get_pool_admin().query(
				`UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app
				 SET    app_name = ?,
						url = ?,
						logo = ?,
						enabled = ?
				WHERE id = ?`,
				[body.app_name,
				 body.url,
				 body.logo,
				 body.enabled,
				 id],
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
					`UPDATE ${process.env.SERVICE_DB_DB2_NAME}.app
						SET app_name = :app_name,
							url = :url,
							logo = :logo,
							enabled = :enabled
					WHERE id = :id`,
					{app_name: body.app_name,
					 url: body.url,
					 logo: body.logo,
					 enabled: body.enabled,
					 id: id},
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