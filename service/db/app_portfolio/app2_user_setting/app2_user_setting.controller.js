const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
const { createUserSetting, 
		getUserSettingsByUserId,
		getProfileUserSetting,
		getProfileUserSettings,
		getProfileUserSettingDetail,
		getProfileTop,
		getUserSetting,
		updateUserSetting, 
		deleteUserSetting} = require ("./app2_user_setting.service");
		const { getMessage } = require(global.SERVER_ROOT + ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') +"/message_translation/message_translation.service");
module.exports = {
	createUserSetting: (req, res) =>{
		const body = req.body;
		createUserSetting(req.query.app_id, req.query.initial, body, (err,results) => {
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
	},
	getUserSettingsByUserId: (req, res) => {
		req.params.id = parseInt(req.params.id);
		getUserSettingsByUserId(req.query.app_id, req.params.id, (err, results) =>{
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
				else{
					//Record not found
					getMessage( req.query.app_id, 
								req.query.app_id,
								20400, 
								req.query.lang_code, (err,results_message)  => {
									return res.status(404).send(
											err ?? results_message.text
									);
								});
				}
		});
	},
	getProfileUserSetting: (req, res) => {
		req.params.id = parseInt(req.params.id);
		getProfileUserSetting(req.query.app_id, req.params.id, (err, results) =>{
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
				else{
					//Record not found
					getMessage( req.query.app_id, 
								req.query.app_id, 
								20400, 
								req.query.lang_code, (err,results_message)  => {
									return res.status(404).send(
										err ?? results_message.text
									);
								});
				}
		});
	},
	getProfileUserSettings: (req, res) => {
		req.params.id = parseInt(req.params.id);
		let id_current_user;
		if (typeof req.query.id !== 'undefined')
			id_current_user = req.query.id;
		getProfileUserSettings(req.query.app_id, req.params.id, id_current_user, (err, results) =>{
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
				else{
					//Record not found
					getMessage( req.query.app_id, 
								req.query.app_id, 
								20400, 
								req.query.lang_code, (err,results_message)  => {
									return res.status(404).send(
										err ?? results_message.text
									);
								});
				}
		});
	},
	getProfileUserSettingDetail: (req, res) => {
        req.params.id = parseInt(req.params.id);
        let detailchoice;
        if (typeof req.query.detailchoice !== 'undefined')
            detailchoice = req.query.detailchoice;

		getProfileUserSettingDetail(req.query.app_id, req.params.id, detailchoice, (err, results) => {
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
				else {
                    //Record not found
                    getMessage( req.query.app_id, 
								req.query.app_id, 
								20400, 
								req.query.lang_code, (err,results_message)  => {
									return res.status(404).json({
											count: 0,
											message: err ?? results_message.text
										});
								});
				}
            }
        });
    },
	getProfileTop: (req, res) => {
        if (typeof req.params.statchoice !== 'undefined')
            req.params.statchoice = parseInt(req.params.statchoice)
        getProfileTop(req.query.app_id, req.params.statchoice, (err, results) => {
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
				else{
                    //Record not found
                    getMessage( req.query.app_id, 
								req.query.app_id, 
								20400, 
								req.query.lang_code, (err,results_message)  => {
									return res.status(404).json({
											count: 0,
											message: err ?? results_message.text
										});
								});
                }   
            }
        });
    },
	getUserSetting: (req, res) => {
		req.params.id = parseInt(req.params.id);
		getUserSetting(req.query.app_id, req.params.id, (err, results) =>{
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
	},
	updateUserSetting: (req, res) => {
		req.params.id = parseInt(req.params.id);
		updateUserSetting(req.query.app_id, req.body, req.params.id, (err, results) =>{
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
					//Record not found
					getMessage( req.query.app_id, 
								req.query.app_id, 
								20400, 
								req.query.lang_code, (err,results_message)  => {
									return res.status(404).send(
										err ?? results_message.text
									);
								});
			}
		});
	},
	deleteUserSetting: (req, res) => {
		req.params.id = parseInt(req.params.id);
		deleteUserSetting(req.query.app_id, req.params.id, (err, results) =>{
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
					//Record not found
					getMessage( req.query.app_id, 
								req.query.app_id, 
								20400, 
								req.query.lang_code, (err,results_message)  => {
									return res.status(404).send(
										err ?? results_message.text
									);
								});
			}
		});
	}
}