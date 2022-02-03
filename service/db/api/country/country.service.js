const {pool, oracledb, oracle_options} = require("../../config/database");

module.exports = {
        getCountries: (lang_code, callBack) => {
                if (process.env.SERVER_DB_USE == 1) {
                        pool.query(
                                `SELECT    c.id,
                                        c.country_code,
                                        c.flag_emoji,
                                        ct.text,
                                        cg.group_name
                                FROM    country  c,
                                        country_group cg, 
                                        country_translation ct,
                                        language l
                                WHERE ct.country_id = c.id
                                AND   cg.id = c.country_group_id
                                AND   l.id = ct.language_id
                                AND (l.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
						OR (l.lang_code = 'en'
							AND NOT EXISTS(SELECT NULL
                                                                        FROM country_translation ct1,
                                                                             language l1
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
                                                return callBack(error);
                                        }
                                        return callBack(null, results);
                                }
                        );
                } else if (process.env.SERVER_DB_USE == 2) {
                        async function execute_sql(err, result) {
                                try {
                                        const pool2 = await oracledb.getConnection();
                                        const result = await pool2.execute(
                                                `SELECT    c.id "id",
                                                        c.country_code "country_code",
                                                        c.flag_emoji "flag_emoji",
                                                        ct.text "text",
                                                        cg.group_name "group_name"
                                                FROM    country  c,
                                                        country_group cg,
                                                        country_translation ct,
                                                        language l
                                                WHERE ct.country_id = c.id
                                                AND   cg.id = c.country_group_id
                                                AND   l.id = ct.language_id
                                                AND (l.lang_code IN (:lang_code, 
                                                                SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
                                                                SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
                                                        OR (l.lang_code = 'en'
                                                                AND NOT EXISTS(SELECT NULL
                                                                                FROM country_translation ct1,
                                                                                     language l1
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
                                                oracle_options, (err, result) => {
                                                        if (err) {
                                                                return callBack(err);
                                                        }
                                                        else {
                                                                return callBack(null, result.rows);
                                                        }
                                                });
                                        await pool2.close();
                                } catch (err) {
                                        return callBack(err.message);
                                } finally {
                                        null;
                                }
                        }
                        execute_sql();
                }
        }
};