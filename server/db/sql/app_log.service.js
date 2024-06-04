/** @module server/db/sql */

/**@type{import('../../server.service.js')} */
const { getNumberValue } = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('../../config.service.js')} */
const { ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('../common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} data_app_id 
 * @param {import('../../../types.js').db_parameter_app_log_createLog} json_data
 * @returns {Promise.<import('../../../types.js').db_result_app_log_createLog[]|null>}
 */
const createLog = async (app_id, data_app_id, json_data) => {
		
	const sql = `INSERT INTO <DB_SCHEMA/>.app_log(
				app_id,
				json_data,
				date_created)
			VALUES(	:app_id,
					:json_data,
					CURRENT_TIMESTAMP)`;
	const parameters = {
							app_id: data_app_id,
							json_data: JSON.stringify(json_data)
						};
	return await db_execute(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), sql, parameters, null);
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
 * @returns {Promise.<import('../../../types.js').db_result_app_log_getLogsAdmin[]>}
 */
const getLogsAdmin = async (app_id, data_app_id, year, month, sort, order_by, offset, limit) => {
		let sql;
		sql = `SELECT id "id",
					  app_id "app_id",
					  json_data "json_data",
					  date_created "date_created",
					  count(*) over() "total_rows"
				 FROM <DB_SCHEMA/>.app_log
				WHERE ((app_id = :app_id) OR :app_id IS NULL)
				  AND <DATE_PERIOD_YEAR/> = :year
				  AND <DATE_PERIOD_MONTH/> = :month
				ORDER BY ${sort} ${order_by} 
				<APP_PAGINATION_LIMIT_OFFSET/>`;
		const parameters = {app_id:data_app_id,
							year:year,
							month:month,
							offset:offset,
							limit:limit};
		return await db_execute(app_id, sql, parameters, null,null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} data_app_id 
 * @param {number|null} year 
 * @param {number|null} month 
 * @returns {Promise.<import('../../../types.js').db_result_app_log_getStatUniqueVisitorAdmin[]>}
 */
const getStatUniqueVisitorAdmin = async (app_id, data_app_id, year, month) => {
		
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
						 FROM <DB_SCHEMA/>.app_log
						WHERE <DATE_PERIOD_YEAR/> = :year_log
						  AND <DATE_PERIOD_MONTH/> = :month_log
						UNION ALL
					   SELECT 2								chart,
					   		  NULL 							app_id,
							  <DATE_PERIOD_DAY/> 			day_log,
							  json_data
						 FROM <DB_SCHEMA/>.app_log
						WHERE ((app_id = :app_id_log) OR :app_id_log IS NULL)
						  AND <DATE_PERIOD_YEAR/> = :year_log
						  AND <DATE_PERIOD_MONTH/> = :month_log) t
				ORDER BY 1, 2`;
		const parameters = {app_id_log: data_app_id,
							year_log: year,
							month_log: month};
		return await db_execute(app_id, sql, parameters, null, null);
	};
export{createLog, getLogsAdmin, getStatUniqueVisitorAdmin};