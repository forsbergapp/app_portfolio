const {execute_db_sql} = require ("../../common/database");
module.exports = {
	getSettings: (app_id, lang_code, regional_type, callBack) => {
    let sql;
    let parameters;
    if (process.env.SERVICE_DB_USE == 1) {
      sql = `SELECT rs.id,
                    rs.data,
                    COALESCE(rst.text, rs.data) text
               FROM ${process.env.SERVICE_DB_DB1_NAME}.regional_type rt,
                    ${process.env.SERVICE_DB_DB1_NAME}.regional_setting rs
                    LEFT OUTER JOIN(SELECT rst.regional_setting_id,
                                           rst.text
                                      FROM ${process.env.SERVICE_DB_DB1_NAME}.regional_setting_translation rst,
                                           ${process.env.SERVICE_DB_DB1_NAME}.language l
                                      WHERE l.id = rst.language_id
                                        AND (l.lang_code = (SELECT MIN(l1.lang_code)
                                                              FROM ${process.env.SERVICE_DB_DB1_NAME}.regional_setting_translation rst1,
                                                                   ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                                            WHERE l1.id  = rst1.language_id
                                                              AND rst1.regional_setting_id = rst.regional_setting_id
                                                              AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                           )
                                             OR (l.lang_code = 'en'
                                                  AND NOT EXISTS(SELECT NULL
                                                                    FROM ${process.env.SERVICE_DB_DB1_NAME}.regional_setting_translation rst1,
                                                                        ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                                                  WHERE l1.id  = rst1.language_id
                                                                    AND rst1.regional_setting_id = rst.regional_setting_id
                                                                    AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                                )
                                                )
                                           ))  rst
                    ON rst.regional_setting_id = rs.id
              WHERE rt.regional_type = ?
                AND rs.regional_type_id = rt.id  
            ORDER BY 2 `;
      parameters = [lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    regional_type];
    }else if (process.env.SERVICE_DB_USE==2){
      sql = `SELECT rs.id "id",
                    rs.data "data",
                    NVL(rst.text, rs.data) "text"
               FROM ${process.env.SERVICE_DB_DB2_NAME}.regional_type rt,
                    ${process.env.SERVICE_DB_DB2_NAME}.regional_setting rs
                    LEFT OUTER JOIN(SELECT rst.regional_setting_id,
                                           rst.text
                                      FROM ${process.env.SERVICE_DB_DB2_NAME}.regional_setting_translation rst,
                                           ${process.env.SERVICE_DB_DB2_NAME}.language l
                                     WHERE l.id = rst.language_id
                                       AND (l.lang_code = (SELECT MIN(l1.lang_code)
                                                             FROM ${process.env.SERVICE_DB_DB2_NAME}.regional_setting_translation rst1,
                                                                  ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                                            WHERE l1.id  = rst1.language_id
                                                              AND rst1.regional_setting_id = rst.regional_setting_id
                                                              AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                          )
                                            OR (l.lang_code = 'en'
                                                  AND NOT EXISTS(SELECT NULL
                                                                   FROM ${process.env.SERVICE_DB_DB2_NAME}.regional_setting_translation rst1,
                                                                        ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                                                  WHERE l1.id  = rst1.language_id
                                                                    AND rst1.regional_setting_id = rst.regional_setting_id
                                                                    AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                                )
                                               )
                                            ))  rst
                  ON rst.regional_setting_id = rs.id
              WHERE rt.regional_type = :regional_type
                AND rs.regional_type_id = rt.id  
              ORDER BY 2`;
      parameters = {
                    lang_code: lang_code,
                    regional_type: regional_type
                   };
		}
    execute_db_sql(app_id, app_id, sql, parameters, null, 
                   __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};