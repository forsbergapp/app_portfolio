/** @module server/dbapi/app_portfolio/user_account_app */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @returns {Promise.<Types.db_result_user_account_app_createUserAccountApp>}
 */
const createUserAccountApp = async (app_id, user_account_id) => {
		const sql = `INSERT INTO ${db_schema()}.user_account_app(
							app_id, user_account_id, date_created)
						SELECT :app_id, ua.id, CURRENT_TIMESTAMP
						  FROM ${db_schema()}.user_account ua
						 WHERE ua.id = :user_account_id
						   AND NOT EXISTS (SELECT NULL
											 FROM ${db_schema()}.user_account_app uap
										    WHERE uap.app_id = :app_id
											  AND uap.user_account_id = ua.id)`;
		const parameters = {
						app_id: app_id,
						user_account_id: user_account_id
					};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @returns {Promise.<Types.db_result_user_account_app_getUserAccountApps[]>}
 */
const getUserAccountApps = async (app_id, user_account_id) => {
		const sql = `SELECT uap.app_id "app_id",
							uap.date_created "date_created"
					   FROM ${db_schema()}.user_account_app uap,
							${db_schema()}.app a
					  WHERE a.id = uap.app_id
						AND uap.user_account_id = :user_account_id
						AND a.enabled = 1`;
		const parameters = {
						user_account_id: user_account_id
						};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @returns {Promise.<Types.db_result_user_account_app_getUserAccountApp[]>}
 */
const getUserAccountApp = async (app_id, user_account_id) => {
		const sql = `SELECT preference_locale "preference_locale",
							app_setting_preference_timezone_id "app_setting_preference_timezone_id",
							app_setting_preference_direction_id "app_setting_preference_direction_id",
							app_setting_preference_arabic_script_id "app_setting_preference_arabic_script_id",
							date_created "date_created"
					   FROM ${db_schema()}.user_account_app
					  WHERE user_account_id = :user_account_id
						AND app_id = :app_id`;
		const parameters = {
						user_account_id: user_account_id,
						app_id: app_id
						};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @param {Types.db_parameter_user_account_app_updateUserAccountApp} data 
 * @returns {Promise.<Types.db_result_user_account_app_updateUserAccountApp>}
 */
const updateUserAccountApp = async (app_id, user_account_id, data) => {
		const sql = `UPDATE ${db_schema()}.user_account_app
						SET preference_locale = :preference_locale,
							app_setting_preference_timezone_id = :app_setting_preference_timezone_id,
							app_setting_preference_direction_id = :app_setting_preference_direction_id,
							app_setting_preference_arabic_script_id = :app_setting_preference_arabic_script_id,
							date_created = CURRENT_TIMESTAMP
					  WHERE user_account_id = :user_account_id
						AND app_id = :app_id`;
		const parameters = {
						preference_locale: data.preference_locale,
						app_setting_preference_timezone_id: data.app_setting_preference_timezone_id,
						app_setting_preference_direction_id: data.app_setting_preference_direction_id,
						app_setting_preference_arabic_script_id: data.app_setting_preference_arabic_script_id,
						user_account_id: user_account_id,
						app_id: app_id
						};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @param {number} data_app_id 
 * @returns {Promise.<Types.db_result_user_account_app_deleteUserAccountApp>}
 */
const deleteUserAccountApp = async (app_id, user_account_id, data_app_id) => {
		const sql = `DELETE FROM ${db_schema()}.user_account_app
					WHERE user_account_id = :user_account_id
					AND app_id = :app_id`;
		const parameters = {
						user_account_id: user_account_id,
						app_id: data_app_id
						};
		return await db_execute(app_id, sql, parameters, null);
	};
export{createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApp};