const { createUserSetting, 
		getUserSettingsByUserId,
		getProfileUserSettings,
		getUserSetting,
		updateUserSetting, 
		deleteUserSetting,
		deleteUserSettingsByUserId} = require ("./app_timetables_user_setting.service");
		const { getMessage } = require("../message_translation/message_translation.service");
module.exports = {
	createUserSetting: (req, res) =>{
		const body = req.body;
		createUserSetting(body, (err,results) => {
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			return res.status(200).json({
				success: 1,
				id: results.insertId,
				data: results
			})
		});
	},
	getUserSettingsByUserId: (req, res) => {
		const id = req.params.id;
		getUserSettingsByUserId(id, (err, results) =>{
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			if (!results){
				//Record not found
				getMessage(20400, 
					req.query.app_id, 
					'en', (err2,results2)  => {
						return res.status(500).send(
								results2.text
						);
					});
			}
			return res.status(200).json({
				count: results.length,
				success: 1,
				items: results
			});
		});
	},
	getProfileUserSettings: (req, res) => {
		const id = req.params.id;
		var id_current_user;
		if (typeof req.query.id !== 'undefined')
			id_current_user = req.query.id;
		getProfileUserSettings(id, id_current_user, (err, results) =>{
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			if (!results){
				//Record not found
				getMessage(20400, 
					req.query.app_id, 
					'en', (err2,results2)  => {
						return res.status(500).send(
							results2.text
						);
					});
			}
			return res.status(200).json({
				count: results.length,
				success: 1,
				items: results
			});
		});
	},
	getUserSetting: (req, res) => {
		const id = req.params.id;
		getUserSetting(id, (err, results) =>{
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			//send without {} so the variablename is not sent
			return res.status(200).json(
				results[0]
			);
		});
	},
	updateUserSetting: (req, res) => {
		const body = req.body;
		const id = req.params.id;
		updateUserSetting(body, id, (err, results) =>{
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			else{
				if (!results){
					//Failed to update user setting
					getMessage(20401, 
						req.body.app_id, 
						'en', (err2,results2)  => {
							return res.status(500).send(
								results2.text
							);
						});
				}
				else
					return res.status(200).json({
						success: 1
					});
			}
		});
	},
	deleteUserSetting: (req, res) => {
		const id = req.params.id;
		deleteUserSetting(id, (err, results) =>{
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			if (!results){
				//Record not found
				getMessage(20400, 
					req.query.app_id, 
					'en', (err2,results2)  => {
						return res.status(500).send(
							results2.text
						);
					});
			}
			return res.status(200).json({
				success: 1
			});
		});
	},
	deleteUserSettingsByUserId: (req, res) => {
		const id = req.params.id;
		deleteUserSettingsByUserId(id, (err, results) =>{
			if (err) {
				console.log(err);
				return res.status(500).send(
					err
				);
			}
			if (!results){
				//Record not found
				getMessage(20400, 
					req.query.app_id, 
					'en', (err2,results2)  => {
						return res.status(500).send(
							results2.text
						);
					});
			}
			return res.status(200).json({
				success: 1
			});
		});
	}
}