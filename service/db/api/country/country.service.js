const {oracledb, get_pool} = require ("../../config/database");

module.exports = {
        getCountries: (app_id, lang_code, callBack) => {
                if (process.env.SERVICE_DB_USE == 1) {
                        get_pool(app_id).query(
                                `SELECT    c.id,
                                        c.country_code,
                                        c.flag_emoji,
                                        ct.text,
                                        cg.group_name
                                FROM    ${process.env.SERVICE_DB_DB1_NAME}.country  c,
                                        ${process.env.SERVICE_DB_DB1_NAME}.country_group cg, 
                                        ${process.env.SERVICE_DB_DB1_NAME}.country_translation ct,
                                        ${process.env.SERVICE_DB_DB1_NAME}.language l
                                WHERE ct.country_id = c.id
                                AND   cg.id = c.country_group_id
                                AND   l.id = ct.language_id
                                AND (l.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                        OR (l.lang_code = 'en'
                                                AND NOT EXISTS(SELECT NULL
                                                                FROM ${process.env.SERVICE_DB_DB1_NAME}.country_translation ct1,
                                                                        ${process.env.SERVICE_DB_DB1_NAME}.language l1
                                                                WHERE ct1.country_id = ct.country_id
                                                                AND l1.id = ct1.language_id
                                                                AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
                                                        )
                                                )
                                        )
                                ORDER BY 5, 4`,
                                [lang_code,
                                        lang_code,
                                        lang_code,
                                        lang_code,
                                        lang_code,
                                        lang_code],
                                (error, results, fields) => {
                                        if (error) {
                                                console.log('getCountries err:' + error);
                                                return callBack(error);
                                        }
                                        return callBack(null, results);
                                }
                        );
                } else if (process.env.SERVICE_DB_USE == 2) {
                        async function execute_sql(err, result) {
                                let pool2;
                                try {
                                        pool2 = await oracledb.getConnection(get_pool(app_id));
                                        const result = await pool2.execute(
                                                `SELECT    c.id "id",
                                                        c.country_code "country_code",
                                                        c.flag_emoji "flag_emoji",
                                                        ct.text "text",
                                                        cg.group_name "group_name"
                                                FROM    ${process.env.SERVICE_DB_DB2_NAME}.country  c,
                                                        ${process.env.SERVICE_DB_DB2_NAME}.country_group cg,
                                                        ${process.env.SERVICE_DB_DB2_NAME}.country_translation ct,
                                                        ${process.env.SERVICE_DB_DB2_NAME}.language l
                                                WHERE ct.country_id = c.id
                                                AND   cg.id = c.country_group_id
                                                AND   l.id = ct.language_id
                                                AND (l.lang_code IN (:lang_code, 
                                                                SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
                                                                SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                        OR (l.lang_code = 'en'
                                                                AND NOT EXISTS(SELECT NULL
                                                                                FROM ${process.env.SERVICE_DB_DB2_NAME}.country_translation ct1,
                                                                                     ${process.env.SERVICE_DB_DB2_NAME}.language l1
                                                                                WHERE ct1.country_id = ct.country_id
                                                                                AND l1.id = ct1.language_id
                                                                                AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                                                )
                                                                )
                                                        )
                                                ORDER BY 5, 4`,
                                                {
                                                        lang_code: lang_code
                                                },
                                                (err, result) => {
                                                        if (err) {
                                                                return callBack(err);
                                                        }
                                                        else {
                                                                return callBack(null, result.rows);
                                                        }
                                                });
                                } catch (err) {
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