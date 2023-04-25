const service = await import('./admin.service.js');

const DBInfo = (req, res) => {
	service.DBInfo(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const DBInfoSpace = (req, res) => {
	service.DBInfoSpace(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const DBInfoSpaceSum = (req, res) => {
	service.DBInfoSpaceSum(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const DBStart = async (req, res, callBack) => {
	service.DBStart(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const DBStop = (req, res) => {
	service.DBStop(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const demo_add = (req, res)=> {
	/* create demo users with user settings from /scripts/demo/demo.json
	   and reading images in /scripts/demo/demo*.webp
	*/
	import('node:fs').then((fs) => {
		/*  Demo script format:
			{"demo_users":[
				[
					{ "username": "[username]" },
					{ "bio": "[bio text]]" },
					{ "avatar": [BASE64 string] },
					[ 
						{"app_id": [app_id], "description": "[description]", [settings attributes] ...}
					]
				],   
				...
			]}
		*/
		fs.readFile(`${process.cwd()}/scripts/demo/demo.json`, 'utf8', (err, fileBuffer) => {
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			else{
				try {
					let demo_users = JSON.parse(fileBuffer.toString());
					let email_index = 1000;
					let insert_record_user = 0;
					import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`).then(({create})=>{
						import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_app_setting/user_account_app_setting.service.js`).then(({createUserSetting})=>{
							for (let user of demo_users){
								let email = `demo${++email_index}@localhost`;
								let json_data_user = `{
														"username":"${user.username}",
														"bio":"${user.bio}",
														"avatar":"${user.avatar}",
														"password":"${req.body.demo_password}",
														"password_reminder":"",
														"email":"${email}",
														"active":1,
														"private":0,
														"user_level":2,
														"verification_code":null,
														"identity_provider_id": null,
														"provider_id":null,
														"provider_first_name":null,
														"provider_last_name":null,
														"provider_image":null,
														"provider_image_url":null,
														"provider_email":null
													}`;
								create(req.query.app_id, json_data_user, (err, results_create) => {
									if (err)
										return res.status(500).send({
											err
										});
									else{
										insert_record_user++;
										let user_settings = JSON.parse(user[3]);
										let insert_user_settings = 0;
										for (let user_setting of user_settings){
											let user_setting_app_id = user_setting.app_id;
											delete user_setting.app_id;
											let settings_header_image;
											//use file in settings or if missing then use filename same as demo username
											if (user_settings.user_setting.image_header_image_img)
												settings_header_image = `${user_settings.user_setting.image_header_image_img}.webp`;
											else
												settings_header_image = `${user.username}.webp`;
											fs.readFile(`${process.cwd()}/scripts/demo/${settings_header_image}`, 'utf8', (err, image) => {
												//update settings with loaded image into BASE64 format
												user_settings.user_setting.image_header_image_img = new Buffer.from(image, 'base64').toString();
												let json_data_user_setting = `{
													"description": ${user_setting.description},
													"settings_json": ${JSON.stringify(user_setting)},
													"user_account_id": ${results_create.insertId}
													}`;	
													
												createUserSetting(user_setting_app_id, 1, json_data_user_setting, (err,results) => {
													insert_user_settings++;
													if (insert_record_user == demo_users.length && insert_user_settings == user_settings.length)

														/*
															generate followers, likes and views
															user account like
															user account view with user
															user account view anonymous
															user account follow
															user account setting likes
															user account setting views
																		order by random and limit:
															MariaDB		ORDER BY RAND()
																		LIMIT 500;
															MySQL		ORDER BY RAND()
																		LIMIT 500;
															PostgreSQL	LIMIT 500;
															Oracle		FETCH NEXT 500 ROWS ONLY;
														*/

														return res.status(200).json({
															count_created: demo_users.length
														});
												})
											})
										}
									}
								})
							}
						})
					});
				} catch (error) {
					return res.status(500).send({
						error
					});
				}
			}			
		})
		
	})
}
const demo_delete = (req, res)=> {
	import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`).then(({getDemousers, deleteUser})=>{
		getDemousers(req.query.app_id, (err, result_demo_users) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			else{
				let deleted_user = 0;
				for (let user in result_demo_users){
					deleteUser(req.query.app_id, user.id,  (err, result_deleteUser) =>{
						if (err) {
							return res.status(500).send({
								data: err
							});
						}
						else{
							if (deleted_user == result_demo_users.length)
								return res.status(200).json({
									count_deleted: result_demo_users.length
								});
						}
					})
				}
			}
		});
	})
}
const demo_get = (req, res)=> {
	import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`).then(({getDemousers})=>{
		getDemousers(req.query.app_id, (err, result_demo_users) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			else{
				return res.status(200).json({
					data: result_demo_users
				});
			}
		})
	})
}

export{DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop, demo_add, demo_delete, demo_get}