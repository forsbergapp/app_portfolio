/** @module server/db/sql/app_data_stat */


/**@type{import('../common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id 
 * @param {number|null} data_app_id 
 * @param {string|null} resource_name_entity
 * @param {string|null} locale
 * @returns {Promise.<import('../../../types.js').server_db_sql_result_app_data_stat_get[]>}
 */
const get = async (app_id, resource_id, data_app_id, resource_name_entity, locale) => {
		const sql = `SELECT ads.app_id                                              "app_id",
							ads.json_data                                           "json_data",
                            ads.date_created                                        "date_created",
                            
                            ads.user_account_id                                     "user_account_id",

                            ads.user_account_app_user_account_id                    "user_account_app_user_account_id",
                            ads.user_account_app_app_id                             "user_account_app_app_id",

                            ads.app_data_resource_master_id                         "app_data_resource_master_id",
                            adrm.app_data_entity_resource_app_data_entity_app_id    "app_data_resource_master_app_data_entity_resource_app_data_entity_app_id",
                            adrm.app_data_entity_resource_app_data_entity_id        "app_data_resource_master_app_data_entity_resource_app_data_entity_id",
                            adrm.app_data_entity_resource_id                        "app_data_resource_master_app_data_entity_resource_id",
                            adrm.user_account_app_user_account_id                   "app_data_resource_master_user_account_app_user_account_id",
                            adrm.user_account_app_app_id                            "app_data_resource_master_user_account_app_app_id",

                            ads.app_data_entity_resource_id                         "app_data_entity_resource_id",
                            as.id                                                   "app_setting_id",
                            as.app_setting_type_app_setting_type_name               "app_setting_type_app_setting_type_name"
                            as.value                                                "app_setting_value"
                            as.display_data                                         "app_setting_display_data"

                            ads.app_data_entity_resource_app_data_entity_app_id     "app_data_entity_resource_app_data_entity_app_id",
                            ads.app_data_entity_resource_app_data_entity_id         "app_data_entity_resource_app_data_entity_id"

					   FROM <DB_SCHEMA/>.app_data_stat  ads,
                            <DB_SCHEMA/>.app_data_entity_resource ader,
                            <DB_SCHEMA/>.app_setting    as
                            LEFT OUTER JOIND <DB_SCHEMA/>.app_data_resource_master adrm
					            ON adrm.id = ads.app_data_resource_master_id
                      WHERE ader.id     = app_data_entity_resource_id
                        AND as.id       = ader.app_setting_id
                        AND (ads.id		= :resource_id OR :resource_id IS NULL)
					    AND (ads.app_id = :data_app_id OR :data_app_id IS NULL)
                        AND (as.app_setting_type_app_setting_type_name = :resource_name_entity OR :resource_name_entity IS NULL)`;
		const parameters = {resource_id         : resource_id,
							data_app_id         : data_app_id,
                            resource_name_entity: resource_name_entity};
		return await db_execute(app_id, sql, parameters, null, null);
	};
/**
 * 
 * @param {number}      app_id
 * @param {*}           data
 * @returns {Promise.<import('../../../types.js').server_db_sql_result_app_data_stat_post[]>}
 */
const post = async (app_id, data) => {
    const sql = `INSERT INTO <DB_SCHEMA/>.app_data_stat (   json_data, 
                                                            date_created,
                                                            app_id,
                                                            user_account_id,
                                                            user_account_app_user_account_id,
                                                            user_account_app_app_id,
                                                            app_data_resource_master_id,
                                                            app_data_entity_resource_id,
                                                            app_data_entity_resource_app_data_entity_app_id,
                                                            app_data_entity_resource_app_data_entity_id)
                    VALUES( :json_data, 
                            CURRENT_TIMESTAMP,
                            :app_id,
                            :user_account_id,
                            :user_account_app_user_account_id,
                            :user_account_app_app_id,
                            :app_data_resource_master_id,
                            :app_data_entity_resource_id,
                            :app_data_entity_resource_app_data_entity_app_id,
                            :app_data_entity_resource_app_data_entity_id)
`;
    const parameters = {json_data:                                          JSON.stringify(data.json_data),
                        app_id:                                             data.app_id ?? null,
                        user_account_id:                                    data.user_account_id ?? null,
                        user_account_app_user_account_id:                   data.user_account_app_user_account_id ?? null,
                        user_account_app_app_id:                            data.user_account_app_app_id ?? null,
                        app_data_resource_master_id:                        data.app_data_resource_master_id ?? null,
                        app_data_entity_resource_id:                        data.app_data_entity_resource_id,
                        app_data_entity_resource_app_data_entity_app_id:    data.app_data_entity_resource_app_data_entity_app_id,
                        app_data_entity_resource_app_data_entity_id:        data.app_data_entity_resource_app_data_entity_id
                        };
    return await db_execute(app_id, sql, parameters);
};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} data_app_id 
 * @param {number|null} year 
 * @param {number|null} month 
 * @param {string} sort 
 * @param {string} order_by 
 * @param {number|null} offset 
 * @param {number|null} limit 
 * @returns {Promise.<import('../../../types.js').server_db_sql_result_app_data_stat_getLogs[]>}
 */
const getLogs = async (app_id, data_app_id, year, month, sort, order_by, offset, limit) => {
    /**@type{import('../../../server/server.service.js')} */
    const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
    /**@type{import('../../../server/config.service.js')} */
    const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    const sql = `SELECT app_id "app_id",
                        json_data "json_data",
                        date_created "date_created",
                        count(*) over() "total_rows"
                   FROM <DB_SCHEMA/>.app_data_stat
                  WHERE ((app_id = :app_id) OR :app_id IS NULL)
                    AND app_data_entity_resource_id = :app_data_entity_resource_id
                    AND app_data_entity_resource_app_data_entity_app_id = :app_data_entity_resource_app_data_entity_app_id
                    AND app_data_entity_resource_app_data_entity_id = :app_data_entity_resource_app_data_entity_id
                    AND <DATE_PERIOD_YEAR/> = :year
                    AND <DATE_PERIOD_MONTH/> = :month
                  ORDER BY ${sort=='date_created'?'date_created':'app_id'} ${order_by} 
                  <APP_PAGINATION_LIMIT_OFFSET/>`;
    const parameters = {app_id:data_app_id,
                        year:year,
                        month:month,
                        offset:offset,
                        limit:limit,
                        app_data_entity_resource_id: 0,
                        app_data_entity_resource_app_data_entity_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
                        app_data_entity_resource_app_data_entity_id : 0};
    return await db_execute(app_id, sql, parameters, null,null);
};
/**
* 
* @param {number} app_id 
* @param {number|null} data_app_id 
* @param {number|null} year 
* @param {number|null} month 
* @returns {Promise.<import('../../../types.js').server_db_sql_result_app_data_stat_getStatUniqueVisitor[]>}
*/
const getStatUniqueVisitor = async (app_id, data_app_id, year, month) => {
    /**@type{import('../../../server/server.service.js')} */
    const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
    /**@type{import('../../../server/config.service.js')} */
    const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    const sql = `SELECT t.chart "chart",
                  t.app_id 		"app_id",
                  :year_log 	"year",
                  :month_log 	"month",
                  t.day_log 	"day",
                  json_data 	"json_data"
             FROM (SELECT 1								chart,
                          app_id,
                          NULL 							day_log,
                          json_data
                     FROM <DB_SCHEMA/>.app_data_stat
                    WHERE <DATE_PERIOD_YEAR/> =                             :year_log
                      AND <DATE_PERIOD_MONTH/> =                            :month_log
                      AND app_data_entity_resource_id =                     :app_data_entity_resource_id
                      AND app_data_entity_resource_app_data_entity_app_id = :app_data_entity_resource_app_data_entity_app_id
                      AND app_data_entity_resource_app_data_entity_id =     :app_data_entity_resource_app_data_entity_id
                    UNION ALL
                   SELECT 2								chart,
                          NULL 							app_id,
                          <DATE_PERIOD_DAY/> 			day_log,
                          json_data
                     FROM <DB_SCHEMA/>.app_data_stat
                    WHERE ((app_id = :app_id_log) OR :app_id_log IS NULL)
                      AND <DATE_PERIOD_YEAR/> =                             :year_log
                      AND <DATE_PERIOD_MONTH/> =                            :month_log
                      AND app_data_entity_resource_id =                     :app_data_entity_resource_id
                      AND app_data_entity_resource_app_data_entity_app_id = :app_data_entity_resource_app_data_entity_app_id
                      AND app_data_entity_resource_app_data_entity_id =     :app_data_entity_resource_app_data_entity_id) t
            ORDER BY 1, 2`;
    const parameters = {app_id_log: data_app_id,
                        year_log: year,
                        month_log: month,
                        app_data_entity_resource_id: 0,
                        app_data_entity_resource_app_data_entity_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
                        app_data_entity_resource_app_data_entity_id : 0};
    return await db_execute(app_id, sql, parameters, null, null);
};
export{get, post, getLogs, getStatUniqueVisitor};