const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const getSettings = (app_id, lang_code, setting_type_name, callBack) => {
    let sql;
    let parameters;
    if (typeof setting_type_name=='undefined' ||setting_type_name=='' ||setting_type_name==null)
          setting_type_name = null;
     sql = `SELECT st.setting_type_name "setting_type_name",
                   s.id "id",
                   s.data "data",
                   s.data2 "data2",
                   s.data3 "data3",
                   s.data4 "data4",
                   s.data5 "data5",
                   COALESCE(str.text, s.description) "text"
             FROM ${db_schema()}.setting_type st,
                  ${db_schema()}.setting s
             LEFT OUTER JOIN(SELECT str.setting_id,
                                    str.text
                               FROM ${db_schema()}.setting_translation str,
                                    ${db_schema()}.language l
                              WHERE l.id = str.language_id
                                AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
                                                     FROM ${db_schema()}.setting_translation str1,
                                                          ${db_schema()}.language l1
                                                    WHERE l1.id  = str1.language_id
                                                      AND str1.setting_id = str.setting_id
                                                      AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
                                                  )
                         )  str
                    ON str.setting_id = s.id
            WHERE st.setting_type_name LIKE COALESCE(:setting_type_name, st.setting_type_name)
              AND s.setting_type_id = st.id  
          ORDER BY 1, 2`;
     parameters = {
                    lang_code1: get_locale(lang_code, 1),
                    lang_code2: get_locale(lang_code, 2),
                    lang_code3: get_locale(lang_code, 3),
                    setting_type_name: setting_type_name
                   };
     db_execute(app_id, sql, parameters, null, (err, result)=>{
          if (err)
               return callBack(err, null);
          else
               return callBack(null, result);
     });
}
export{getSettings};