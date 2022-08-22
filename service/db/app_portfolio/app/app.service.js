const {execute_db_sql} = require ("../../common/database");
module.exports = {
	getApp:(id, app_id, lang_code, callBack) => {
		let sql;
		let parameters;
		if (typeof id=='undefined')
			id=null;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	a.id,
							a.app_name,
							a.url,
							a.logo,
							aot.text app_description,
							act.text app_category
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app a
						LEFT OUTER JOIN ${process.env.SERVICE_DB_DB1_NAME}.app_object_translation aot
							ON aot.app_object_app_id = a.id
						AND aot.app_object_object_name = 'APP_DESCRIPTION'
							AND aot.language_id IN (SELECT id 
													FROM ${process.env.SERVICE_DB_DB1_NAME}.language l
													WHERE (l.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
															OR (l.lang_code = 'en'
																AND NOT EXISTS(SELECT NULL
																				FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object_translation aot1,
																					 ${process.env.SERVICE_DB_DB1_NAME}.language l1
																				WHERE l1.id  = aot1.language_id
																				AND aot1.app_object_app_id  = aot.app_object_app_id
																				AND aot1.app_object_object_name = aot.app_object_object_name
																				AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
																			)
															)
														)
												)
						LEFT OUTER JOIN ${process.env.SERVICE_DB_DB1_NAME}.app_category_translation act
							ON act.app_category_id = a.app_category_id
							AND act.language_id IN (SELECT id 
													  FROM ${process.env.SERVICE_DB_DB1_NAME}.language l
													  WHERE (l.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
															OR (l.lang_code = 'en'
																AND NOT EXISTS(SELECT NULL
																				FROM ${process.env.SERVICE_DB_DB1_NAME}.app_category_translation act1,
																					 ${process.env.SERVICE_DB_DB1_NAME}.language l1
																				WHERE l1.id  = act1.language_id
																				AND act1.app_category_id  = act.app_category_id
																				AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
																			)
															)
														)
							)
					WHERE (a.id = COALESCE(?, a.id)
						OR 
						? = 0)
					AND a.enabled = 1
					ORDER BY 1 `;
			parameters = [	lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							id,
							id];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	id "id",
							app_name "app_name",
							url "url",
							logo "logo",
							aot.text "app_description",
							act.text "app_category"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app a
							LEFT OUTER JOIN ${process.env.SERVICE_DB_DB2_NAME}.app_object_translation aot
							  ON aot.app_object_app_id = a.id
							 AND aot.app_object_object_name = 'APP_DESCRIPTION'
							 AND aot.language_id IN (SELECT id 
														FROM ${process.env.SERVICE_DB_DB2_NAME}.language l
														WHERE (l.lang_code IN (:lang_code, 
																			SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
																			SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
																OR (l.lang_code = 'en'
																	AND NOT EXISTS(SELECT NULL
																					FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object_translation aot1,
																						${process.env.SERVICE_DB_DB2_NAME}.language l1
																					WHERE l1.id  = aot1.language_id
																					AND aot1.app_object_app_id  = aot.app_object_app_id
																					AND aot1.app_object_object_name = aot.app_object_object_name
																					AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
																				)
																)
															)
													)
							LEFT OUTER JOIN ${process.env.SERVICE_DB_DB2_NAME}.app_category_translation act
							  ON act.app_category_id = a.app_category_id
							 AND act.language_id IN (SELECT id 
													   FROM ${process.env.SERVICE_DB_DB2_NAME}.language l
													  WHERE (l.lang_code IN (:lang_code, 
																			  SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
																			  SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
															OR (l.lang_code = 'en'
																AND NOT EXISTS(SELECT NULL
																				 FROM ${process.env.SERVICE_DB_DB2_NAME}.app_category_translation act1,
																					  ${process.env.SERVICE_DB_DB2_NAME}.language l1
																				WHERE l1.id  = act1.language_id
																				AND act1.app_category_id  = act.app_category_id
																				AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
																			)
															)
													)
							)
					WHERE (id= NVL(:id, id)
						OR 
						:id = 0)
					AND enabled = 1
					ORDER BY 1`;
			parameters = {	lang_code: lang_code,
							id: id};
		}
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getAppsAdmin:(id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	id,
							app_name,
							url,
							logo,
							enabled
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app
					ORDER BY 1 `;
			parameters = [];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	id "id",
							app_name "app_name",
							url "url",
							logo "logo",
							enabled "enabled"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app
					ORDER BY 1`;
			parameters = {};
		}
		execute_db_sql(id, null, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	updateApp:(id, body, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app
					  SET app_name = ?,
						  url = ?,
						  logo = ?,
						  enabled = ?
					WHERE id = ?`;
			parameters = [	body.app_name,
							body.url,
							body.logo,
							body.enabled,
							id];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `UPDATE ${process.env.SERVICE_DB_DB2_NAME}.app
					  SET app_name = :app_name,
						  url = :url,
						  logo = :logo,
						  enabled = :enabled
					WHERE id = :id`;
			parameters = {	app_name: body.app_name,
							url: body.url,
							logo: body.logo,
							enabled: body.enabled,
							id: id};
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