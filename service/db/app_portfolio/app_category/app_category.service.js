const {execute_db_sql} = require ("../../common/common.service");
module.exports = {
	getAppCategoryAdmin:(app_id, id, lang_code, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	ac.id,
							ac.category_name,
							act.text app_category_text
					FROM ${process.env.SERVICE_DB_DB1_NAME}.app_category ac
						LEFT OUTER JOIN ${process.env.SERVICE_DB_DB1_NAME}.app_category_translation act
							ON act.app_category_id = ac.id
							AND act.language_id IN (SELECT id 
													FROM ${process.env.SERVICE_DB_DB1_NAME}.language l
													WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																			FROM ${process.env.SERVICE_DB_DB1_NAME}.app_category_translation act1,
																				${process.env.SERVICE_DB_DB1_NAME}.language l1
																			WHERE l1.id  = act1.language_id
																			AND act1.app_category_id  = act.app_category_id
																			AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
																		)
													)
					WHERE ac.id = COALESCE(?, ac.id)
                    ORDER BY 1`;
			parameters = [lang_code,
						  lang_code,
						  lang_code,
                          id];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	ac.id "id",
							ac.category_name "category_name",
							act.text "app_category_text"
					 FROM ${process.env.SERVICE_DB_DB2_NAME}.app_category ac
						LEFT OUTER JOIN ${process.env.SERVICE_DB_DB2_NAME}.app_category_translation act
							ON act.app_category_id = ac.id
							AND act.language_id IN (SELECT id 
													FROM ${process.env.SERVICE_DB_DB2_NAME}.language l
													WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
																		   FROM ${process.env.SERVICE_DB_DB2_NAME}.app_category_translation act1,
																				${process.env.SERVICE_DB_DB2_NAME}.language l1
																		  WHERE l1.id  = act1.language_id
																			AND act1.app_category_id  = act.app_category_id
																			AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
																		)
													)
                    WHERE ac.id = COALESCE(:id, ac.id)
                    ORDER BY 1`;
			parameters = {lang_code: lang_code,
                          id: id};
		}
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};