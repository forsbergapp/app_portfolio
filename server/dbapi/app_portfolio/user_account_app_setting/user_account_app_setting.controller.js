const service = await import("./user_account_app_setting.service.js");

const createUserSetting = (req, res) => {
	const body = req.body;
	service.createUserSetting(req.query.app_id, req.query.initial, body, (err,results) => {
		if (err)
			return res.status(500).send(
				err
			);
		else
			return res.status(200).json({
				id: results.insertId,
				data: results
			})
	});
}
const getUserSettingsByUserId = (req, res) => {
	req.params.id = parseInt(req.params.id);
	service.getUserSettingsByUserId(req.query.app_id, req.params.id, (err, results) =>{
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
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				})
	});
}
const getProfileUserSetting = (req, res) => {
	req.params.id = parseInt(req.params.id);
	service.getProfileUserSetting(req.query.app_id, req.params.id, (err, results) =>{
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
				})
	});
}
const getProfileUserSettings = (req, res) => {
	req.params.id = parseInt(req.params.id);
	let id_current_user;
	if (typeof req.query.id !== 'undefined')
		id_current_user = req.query.id;
	service.getProfileUserSettings(req.query.app_id, req.params.id, id_current_user, (err, results) =>{
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
				})
	});
}
const getProfileUserSettingDetail = (req, res) => {
	req.params.id = parseInt(req.params.id);
	let detailchoice;
	if (typeof req.query.detailchoice !== 'undefined')
		detailchoice = req.query.detailchoice;

	service.getProfileUserSettingDetail(req.query.app_id, req.params.id, detailchoice, (err, results) => {
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
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				})
		}
	});
}
const getProfileTopSetting = (req, res) => {
	if (typeof req.params.statchoice !== 'undefined')
		req.params.statchoice = parseInt(req.params.statchoice)
	service.getProfileTopSetting(req.query.app_id, req.params.statchoice, (err, results) => {
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
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				})
		}
	});
}
const getUserSetting = (req, res) => {
	req.params.id = parseInt(req.params.id);
	service.getUserSetting(req.query.app_id, req.params.id, (err, results) =>{
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
}
const updateUserSetting = (req, res) => {
	req.params.id = parseInt(req.params.id);
	service.updateUserSetting(req.query.app_id, req.body, req.params.id, (err, results) =>{
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
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				})
		}
	});
}
const deleteUserSetting = (req, res) => {
	req.params.id = parseInt(req.params.id);
	service.deleteUserSetting(req.query.app_id, req.params.id, (err, results) =>{
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
					return record_not_found(res, req.query.app_id, req.query.lang_code);
				})
		}
	});
}
export{createUserSetting, getUserSettingsByUserId, getProfileUserSetting, getProfileUserSettings, getProfileUserSettingDetail,
	   getProfileTopSetting, getUserSetting, updateUserSetting, deleteUserSetting};