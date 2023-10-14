const service = await import('./user_account_app_setting.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const createUserSetting = (req, res) => {
	const data = {	description:		req.body.description,
					settings_json: 		req.body.settings_json,
					user_account_id:	getNumberValue(req.body.user_account_id)
				};
	service.createUserSetting(getNumberValue(req.query.app_id), req.query.initial, data, (err,results) => {
		if (err)
			return res.status(500).send(
				err
			);
		else
			return res.status(200).json({
				id: results.insertId,
				data: results
			});
	});
};
const getUserSettingsByUserId = (req, res) => {
	service.getUserSettingsByUserId(getNumberValue(req.query.app_id), req.params.id, (err, results) =>{
		if (err)
			return res.status(500).send(
				err
			);
		else
			if (results)
				return res.status(200).json({
					count: results.length,
					items: results
				});
			else
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
				});
	});
};
const getProfileUserSetting = (req, res) => {
	service.getProfileUserSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results) =>{
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else
			if (results)
				return res.status(200).json({
					count: results.length,
					items: results
				});
			else
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				});
	});
};
const getProfileUserSettings = (req, res) => {
	service.getProfileUserSettings(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.id), (err, results) =>{
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else
			if (results)
				return res.status(200).json({
					count: results.length,
					items: results
				});
			else
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
				});
	});
};
const getProfileUserSettingDetail = (req, res) => {
	service.getProfileUserSettingDetail(getNumberValue(req.query.app_id), getNumberValue(req.params.id), getNumberValue(req.query.detailchoice), (err, results) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else{
			if (results)
				return res.status(200).json({
					count: results.length,
					items: results
				});
			else
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
				});
		}
	});
};
const getProfileTopSetting = (req, res) => {
	service.getProfileTopSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.statchoice), (err, results) => {
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else{
			if (results)
				return res.status(200).json({
					count: results.length,
					items: results
				}); 
			else
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
				});
		}
	});
};
const getUserSetting = (req, res) => {
	service.getUserSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results) =>{
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else{
			//send without {} so the variablename is not sent
			return res.status(200).json(
				results[0]
			);
		}
	});
};
const updateUserSetting = (req, res) => {
	const data = {	description:		req.body.description,
					settings_json: 		req.body.settings_json,
					user_account_id:	getNumberValue(req.body.user_account_id)};
	service.updateUserSetting(getNumberValue(req.query.app_id), data, getNumberValue(req.params.id), (err, results) =>{
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else{
			if (results)
				return res.status(200).json(
					results
				);
			else
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
				});
		}
	});
};
const deleteUserSetting = (req, res) => {
	service.deleteUserSetting(getNumberValue(req.query.app_id), getNumberValue(req.params.id), (err, results) =>{
		if (err) {
			return res.status(500).send(
				err
			);
		}
		else{
			if (results)
				return res.status(200).json(
					results
				);
			else
				import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
					return record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
				});
		}
	});
};
export{	createUserSetting, getUserSettingsByUserId, getProfileUserSetting, getProfileUserSettings, getProfileUserSettingDetail,
		getProfileTopSetting, getUserSetting, updateUserSetting, deleteUserSetting};