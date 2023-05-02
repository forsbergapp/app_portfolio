const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const getCountries = (app_id, lang_code, callBack) => {
     let sql;
     let parameters;
     sql = `SELECT c.id "id",
                   c.country_code "country_code",
                   c.flag_emoji "flag_emoji",
                   ct.text "text",
                   cg.group_name "group_name"
              FROM ${db_schema()}.country  c,
                   ${db_schema()}.country_group cg,
                   ${db_schema()}.country_translation ct
             WHERE ct.country_id = c.id
               AND cg.id = c.country_group_id
               AND ct.language_id IN (SELECT id 
                                        FROM ${db_schema()}.language l
                                       WHERE l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
                                                              FROM ${db_schema()}.country_translation ct1,
                                                                   ${db_schema()}.language l1
                                                             WHERE ct1.country_id = ct.country_id
                                                               AND l1.id = ct1.language_id
                                                               AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
                                                            )
                                        )
               ORDER BY 5, 4`;
     parameters = {
                    lang_code1: get_locale(lang_code, 1),
                    lang_code2: get_locale(lang_code, 2),
                    lang_code3: get_locale(lang_code, 3)
                  };
     let stack = new Error().stack;
     import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {                  
          db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
               if (err)
                    return callBack(err, null);
               else
                    return callBack(null, result);
          });
     })
}
export{getCountries};