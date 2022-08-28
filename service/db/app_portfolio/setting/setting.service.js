const {execute_db_sql} = require ("../../common/database");
module.exports = {
	getSettings: (app_id, lang_code, setting_type_name, callBack) => {
    let sql;
    let parameters;
    if (typeof setting_type_name=='undefined' ||setting_type_name=='' ||setting_type_name==null)
          setting_type_name = null;
    if (process.env.SERVICE_DB_USE == 1) {
      sql = `SELECT st.setting_type_name,
                    s.id,
                    s.data,
                    COALESCE(str.text, s.description) text
               FROM ${process.env.SERVICE_DB_DB1_NAME}.setting_type st,
                    ${process.env.SERVICE_DB_DB1_NAME}.setting s
                    LEFT OUTER JOIN(SELECT str.setting_id,
                                           str.text
                                      FROM ${process.env.SERVICE_DB_DB1_NAME}.setting_translation str,
                                           ${process.env.SERVICE_DB_DB1_NAME}.language l
                                      WHERE l.id = str.language_id
                                        AND (l.lang_code = (SELECT MIN(l1.lang_code)
                                                              FROM ${process.env.SERVICE_DB_DB1_NAME}.setting_translation str1,
                                                                   ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                                            WHERE l1.id  = str1.language_id
                                                              AND str1.setting_id = str.setting_id
                                                              AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                           )
                                             OR (l.lang_code = 'en'
                                                  AND NOT EXISTS(SELECT NULL
                                                                    FROM ${process.env.SERVICE_DB_DB1_NAME}.setting_translation str1,
                                                                        ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                                                  WHERE l1.id  = str1.language_id
                                                                    AND str1.setting_id = str.setting_id
                                                                    AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                                )
                                                )
                                           ))  str
                    ON str.setting_id = s.id
              WHERE st.setting_type_name = COALESCE(?, st.setting_type_name)
                AND s.setting_type_id = st.id  
            ORDER BY 1, 2 `;
      parameters = [lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    lang_code,
                    setting_type_name];
    }else if (process.env.SERVICE_DB_USE==2){
      sql = `SELECT st.setting_type_name "setting_type_name",
                    s.id "id",
                    s.data "data",
                    NVL(str.text, s.description) "text"
               FROM ${process.env.SERVICE_DB_DB2_NAME}.setting_type st,
                    ${process.env.SERVICE_DB_DB2_NAME}.setting s
                    LEFT OUTER JOIN(SELECT str.setting_id,
                                           str.text
                                      FROM ${process.env.SERVICE_DB_DB2_NAME}.regional_setting_translation str,
                                           ${process.env.SERVICE_DB_DB2_NAME}.language l
                                     WHERE l.id = str.language_id
                                       AND (l.lang_code = (SELECT MIN(l1.lang_code)
                                                             FROM ${process.env.SERVICE_DB_DB2_NAME}.regional_setting_translation str1,
                                                                  ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                                            WHERE l1.id  = str1.language_id
                                                              AND str1.setting_id = str.setting_id
                                                              AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                          )
                                            OR (l.lang_code = 'en'
                                                  AND NOT EXISTS(SELECT NULL
                                                                   FROM ${process.env.SERVICE_DB_DB2_NAME}.regional_setting_translation str1,
                                                                        ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                                                  WHERE l1.id  = str1.language_id
                                                                    AND str1.setting_id = str.setting_id
                                                                    AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                                )
                                               )
                                            ))  str
                  ON str.setting_id = s.id
              WHERE st.setting_type_name = NVL(:setting_type_name, st.setting_type_name)
                AND s.setting_type_id = st.id  
              ORDER BY 1, 2`;
      parameters = {
                    lang_code: lang_code,
                    setting_type_name: setting_type_name
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