/** @module server/dbapi/app_portfolio/app_log */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const { getNumberValue } = await import(`file://${process.cwd()}/server/server.service.js`);
const { ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
const {db_execute, db_schema, db_limit_rows} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} data_app_id 
 * @param {Types.db_parameter_app_log_createLog} json_data
 * @returns {Promise.<Types.db_result_app_log_createLog[]|null>}
 */
const createLog = async (app_id, data_app_id, json_data) => {
	if (ConfigGet('SERVICE_DB', 'APP_LOG')=='1'){
		const sql = `INSERT INTO ${db_schema()}.app_log(
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
	}
	else
		return (null);
};
/**
 * 
 * @param {number} app_id 
 * @param {number} data_app_id 
 * @param {number} year 
 * @param {number} month 
 * @param {string} sort 
 * @param {string} order_by 
 * @param {number} offset 
 * @param {number} limit 
 * @returns {Promise.<Types.db_result_app_log_getLogsAdmin[]>}
 */
const getLogsAdmin = async (app_id, data_app_id, year, month, sort, order_by, offset, limit) => {
		let sql;
		sql = `SELECT id "id",
					  app_id "app_id",
					  json_data "json_data",
					  date_created "date_created",
					  count(*) over() "total_rows"
				 FROM ${db_schema()}.app_log
				WHERE ((app_id = :app_id) OR :app_id IS NULL)
				  AND EXTRACT(year from date_created) = :year
				  AND EXTRACT(month from date_created) = :month
				ORDER BY ${sort} ${order_by} `;
		sql = db_limit_rows(sql, null);
		const parameters = {app_id:data_app_id,
							year:year,
							month:month,
							offset:offset,
							limit:limit};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} data_app_id 
 * @param {number} year 
 * @param {number} month 
 * @returns {Promise.<Types.db_result_app_log_getStatUniqueVisitorAdmin[]>}
 */
const getStatUniqueVisitorAdmin = async (app_id, data_app_id, year, month) => {
		
		const sql = `SELECT t.chart "chart",
		              t.app_id 		"app_id",
					  :year_log 	"year",
					  :month_log 	"month",
					  t.day_log 	"day",
					  json_data 	"json_data"
				 FROM (SELECT 1										chart,
							  app_id,
					          NULL 									day_log,
					          json_data
						 FROM ${db_schema()}.app_log
						 WHERE EXTRACT(YEAR FROM date_created) = :year_log
						  AND EXTRACT(MONTH FROM date_created) = :month_log
						UNION ALL
					   SELECT 2										chart,
					   		  NULL 									app_id,
							  EXTRACT(DAY FROM date_created) 		day_log,
							  json_data
						 FROM ${db_schema()}.app_log
						 WHERE ((app_id = :app_id_log) OR :app_id_log IS NULL)
						  AND EXTRACT(YEAR FROM date_created) = :year_log
						  AND EXTRACT(MONTH FROM date_created) = :month_log) t
				ORDER BY 1, 2`;
		const parameters = {app_id_log: data_app_id,
							year_log: year,
							month_log: month};
		return await db_execute(app_id, sql, parameters, null);
	};
export{createLog, getLogsAdmin, getStatUniqueVisitorAdmin};