const { createUserSetting, 
		getUserSettingsByUserId,
		getProfileUserSetting,
		getProfileUserSettings,
		getProfileUserSettingDetail,
		getProfileTop,
		getUserSetting,
		updateUserSetting, 
		deleteUserSetting} = require ("./app2_user_setting.service");
		const { getMessage } = require("../message_translation/message_translation.service");
module.exports = {
	createUserSetting: (req, res) =>{
		const body = req.body;
		createUserSetting(req.query.app_id, req.query.initial, body, (err,results) => {
			if (err) {
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
		getUserSettingsByUserId(req.query.app_id, id, (err, results) =>{
			if (err) {
				return res.status(500).send(
					err
				);
			}
			if (!results){
				//Record not found
				getMessage(20400, 
					req.query.app_id, 
					req.query.lang_code, (err2,results2)  => {
						return res.status(404).send(
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
	getProfileUserSetting: (req, res) => {
		const id = req.params.id;
		getProfileUserSetting(req.query.app_id, id, (err, results) =>{
			if (err) {
				return res.status(500).send(
					err
				);
			}
			if (!results){
				//Record not found
				getMessage(20400, 
					req.query.app_id, 
					req.query.lang_code, (err2,results2)  => {
						return res.status(404).send(
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
		getProfileUserSettings(req.query.app_id, id, id_current_user, (err, results) =>{
			if (err) {
				return res.status(500).send(
					err
				);
			}
			if (!results){
				//Record not found
				getMessage(20400, 
					req.query.app_id, 
					req.query.lang_code, (err2,results2)  => {
						return res.status(404).send(
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
	getProfileUserSettingDetail: (req, res) => {
        const id = req.params.id;
        var detailchoice;
        if (typeof req.query.detailchoice !== 'undefined')
            detailchoice = req.query.detailchoice;

		getProfileUserSettingDetail(req.query.app_id, id, detailchoice, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (!results) {
                    //Record not found
                    //return ok even if records not found
                    getMessage(20400, 
                        req.query.app_id, 
                        req.query.lang_code, (err2,results2)  => {
                            return res.status(404).json({
                                    count: 0,
                                    message: results2.text
                                });
                        });
                }
                else
                    return res.status(200).json({
                        count: results.length,
                        success: 1,
                        items: results
                    });
            }
        });
    },
	getProfileTop: (req, res) => {
        var statchoice;
        if (typeof req.params.statchoice !== 'undefined')
            statchoice = req.params.statchoice;
        getProfileTop(req.query.app_id, statchoice, (err, results) => {
            if (err) {
                return res.status(500).send(
                    err
                );
            }
            else{
                if (!results) {
                    //Record not found
                    //return ok even if records not found
                    getMessage(20400, 
                        req.query.app_id, 
                        req.query.lang_code, (err2,results2)  => {
                            return res.status(404).json({
                                    count: 0,
                                    message: results2.text
                                });
                        });
                }
                else
                    return res.status(200).json({
                        count: results.length,
                        success: 1,
                        items: results
                    });
            }
        });
    },
	getUserSetting: (req, res) => {
		const id = req.params.id;
		getUserSetting(req.query.app_id, id, (err, results) =>{
			if (err) {
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
		updateUserSetting(req.query.app_id, body, id, (err, results) =>{
			if (err) {
				return res.status(500).send(
					err
				);
			}
			else{
				if (!results){
					//id, not found, nothing updated
					getMessage(20400, 
						req.query.app_id, 
						req.query.lang_code, (err2,results2)  => {
							return res.status(404).send(
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
		deleteUserSetting(req.query.app_id, id, (err, results) =>{
			if (err) {
				return res.status(500).send(
					err
				);
			}
			if (!results){
				//Record not found
				getMessage(20400, 
					req.query.app_id, 
					req.query.lang_code, (err2,results2)  => {
						return res.status(404).send(
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