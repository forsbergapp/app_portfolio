/** @module server/dbapi/app_portfolio/user_account_app_setting */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./user_account_app_setting.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const createUserSetting = (req, res) => {
	/**@type{Types.db_parameter_user_account_app_setting_createUserSetting} */
	const data = {	description:		req.body.description,
					settings_json: 		req.body.settings_json,
					user_account_id:	getNumberValue(req.body.user_account_id)
				};
	const call_service = ()=> {
		service.createUserSetting(getNumberValue(req.query.app_id), data)
		.then((/**@type{Types.db_result_user_account_app_setting_createUserSetting}*/result)=>{
			res.status(200).json({
				id: result.insertId,
				data: result
			});
		})
		.catch((error)=>{
			res.status(500).send(
				error
			);
		});
	};
	//Check if first time
	if (getNumberValue(req.query.initial)==1){
		service.getUserSettingsByUserId(getNumberValue(req.query.app_id), getNumberValue(req.body.user_account_id))
		.then((/**@type{Types.db_result_user_account_app_setting_getUserSettingsByUserId[]}*/result)=>{
			if (result.length==0){
				//no user settings found, ok to create initial user setting
				call_service();
			}
			else
				res.status(200).json({
					id: null,
					data: null
				});
		})
		.catch((error)=>{
			res.status(500).send(
				error
			);
		});
	}
	else
		call_service();
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getUserSettingsByUserId = (req, res) => {
	service.getUserSettingsByUserId(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
	.then((/**@type{Types.db_result_user_account_app_setting_getUserSettingsByUserId[]}*/result)=>{
		if (result)
			res.status(200).json({
				count: result.length,
				items: result
			});
		else
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
			});
	})
	.catch((error)=>{
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
const getProfileUserSetting = (req, res) => {
	service.getProfileUserSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
	.then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSetting[]}*/result)=>{
		if (result[0])
			res.status(200).json({
				items: result[0]
			});
		else
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				record_not_found(res, req.query.app_id, req.query.lang_code);
			});
	})
	.catch((error)=>{
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
const getProfileUserSettings = (req, res) => {
	service.getProfileUserSettings(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.id))
	.then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSettings[]}*/result)=>{
		if (result)
			res.status(200).json({
				count: result.length,
				items: result
			});
		else
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
			});
	})
	.catch((error)=>{
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
const getProfileUserSettingDetail = (req, res) => {
	service.getProfileUserSettingDetail(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.detailchoice))
	.then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSettingDetail[]}*/result)=>{
		if (result)
			res.status(200).json({
				count: result.length,
				items: result
			});
		else
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
			});
	})
	.catch((error)=>{
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
const getProfileTopSetting = (req, res) => {
	service.getProfileTopSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.statchoice))
	.then((/**@type{Types.db_result_user_account_app_setting_getProfileTopSetting[]}*/result)=>{
		if (result)
			res.status(200).json({
				count: result.length,
				items: result
			}); 
		else
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
			});
	})
	.catch((error)=>{
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
const getUserSetting = (req, res) => {
	service.getUserSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
	.then((/**@type{Types.db_result_user_account_app_setting_getUserSetting[]}*/result)=>{
		//send without {} so the variablename is not sent
		res.status(200).json(
			result[0]
		);
	})
	.catch((error)=>{
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
const updateUserSetting = (req, res) => {
	/**@type{Types.db_parameter_user_account_app_setting_updateUserSetting} */
	const data = {	description:		req.body.description,
					settings_json: 		req.body.settings_json,
					user_account_id:	getNumberValue(req.body.user_account_id)};
	service.updateUserSetting(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id))
	.then((/**@type{Types.db_result_user_account_app_setting_updateUserSetting}*/result)=>{
		if (result)
			res.status(200).json(
				result
			);
		else
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
			});
	})
	.catch((error)=>{
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
const deleteUserSetting = (req, res) => {
	service.deleteUserSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.id))
	.then((/**@type{Types.db_result_user_account_app_setting_deleteUserSetting}*/result)=>{
		if (result)
			res.status(200).json(
				result
			);
		else
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
			});
	})
	.catch((error)=>{
		res.status(500).send(
			error
		);
	});
};
export{	createUserSetting, getUserSettingsByUserId, getProfileUserSetting, getProfileUserSettings, getProfileUserSettingDetail,
		getProfileTopSetting, getUserSetting, updateUserSetting, deleteUserSetting};