/** @module server/dbapi/app_portfolio/user_account_app */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./user_account_app.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const createUserAccountApp = (req, res) => {
	service.createUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.body.user_account_id))
	.then((/**@type{Types.db_result_user_account_app_createUserAccountApp}*/result)=>{
		res.status(200).json({
			count: result.affectedRows,
			items: Array(result)
		});
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send(
			error
		);
	});
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getUserAccountApps = (req, res) => {
	service.getUserAccountApps(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id))
	.then((/**@type{Types.db_result_user_account_app_getUserAccountApps[]}*/result)=>{
		res.status(200).json({
			count: result.length,
			items: result
		});
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send(
			error
		);
	});
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getUserAccountApp = (req, res) => {
	service.getUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.query.user_account_id))
	.then((/**@type{Types.db_result_user_account_app_getUserAccountApp[]}*/result)=>{
		res.status(200).json({
			items: result
		});
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send(
			error
		);
	});
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const updateUserAccountApp = (req, res) => {
	/**@type{Types.db_parameter_user_account_app_updateUserAccountApp} */
	const data = {	setting_preference_direction_id: 	getNumberValue(req.body.setting_preference_direction_id),
					setting_preference_arabic_script_id:getNumberValue(req.body.setting_preference_arabic_script_id),
					setting_preference_timezone_id: 	getNumberValue(req.body.setting_preference_timezone_id),
					preference_locale:					req.body.preference_locale
				};
	service.updateUserAccountApp(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), data)
	.then((/**@type{Types.db_result_user_account_app_updateUserAccountApp}*/result)=>{
		res.status(200).json({
			items: result
		});
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send(
			error
		);
	});
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const deleteUserAccountApps = (req, res) => {
	service.deleteUserAccountApps(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), getNumberValue(req.params.app_id))
	.then((/**@type{Types.db_result_user_account_app_deleteUserAccountApps}*/result)=>{
		res.status(200).send(
			result
		);
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send(
			error
		);
	});	
};
export{createUserAccountApp, getUserAccountApps, getUserAccountApp, updateUserAccountApp, deleteUserAccountApps};