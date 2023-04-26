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
const demo_add = async (req, res)=> {
	/* create demo users with user settings from /scripts/demo/demo.json
	   and reading images in /scripts/demo/demo*.webp
	*/
	const { default: {genSaltSync, hashSync} } = await import("bcryptjs");
	const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
	const {create} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`);
	const {createUserAccountApp} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_app/user_account_app.service.js`);
	const {createUserSetting, getUserSettingsByUserId} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_app_setting/user_account_app_setting.service.js`);
	const {likeUser} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_like/user_account_like.service.js`);
	const {insertUserAccountView} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_view/user_account_view.service.js`);
	const {followUser} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_follow/user_account_follow.service.js`);
	const {likeUserSetting} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_app_setting_like/user_account_app_setting_like.service.js`);
	const {insertUserSettingView} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account_app_setting_view/user_account_app_setting_view.service.js`);
	const fs = await import('node:fs');
	try {
		const fileBuffer = await fs.promises.readFile(`${process.cwd()}/scripts/demo/demo.json`, 'utf8');
		let demo_users = JSON.parse(fileBuffer.toString()).demo_users;
		let email_index = 1000;
		let records_user_account = 0;
		let records_user_account_app = 0;
		let records_user_account_app_setting = 0;
		let password_encrypted = hashSync(req.body.demo_password, genSaltSync(10));
		//loop demo users and create them and update with id
		const create_users = async (demo_user) =>{
			return await new Promise((resolve, reject)=>{
				const create_update_id = (demo_user)=>{
					let email = `demo${++email_index}@localhost`;
					let json_data_user = `{
											"username":"${demo_user.username}",
											"bio":"${demo_user.bio}",
											"avatar":"${demo_user.avatar}",
											"password":"${password_encrypted}",
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
					create(req.query.app_id, JSON.parse(json_data_user), (err, results_create) => {
						if (err)
							reject(err);
						else{
							demo_user.id = results_create.insertId
							records_user_account++;
							if (records_user_account == demo_users.length)
								resolve();
						}
					})
				}
				for (let demo_user of demo_users){
					create_update_id(demo_user)
				}
			})
		}
		const create_user_account_app = (app_id, user_account_id) =>{
			return new Promise((resolve, reject) => {
				createUserAccountApp(app_id, user_account_id,  (err,results) => {
					if (err)
						reject(err);
					else{
						if (results.affectedRows == 1)
							records_user_account_app++;
						resolve(results);
					}
				})
			});
		}
		const create_setting = async (user_setting_app_id, json_data) => {
			return new Promise((resolve, reject) => {
				  createUserSetting(user_setting_app_id, 1, json_data, (err,results) => {
					if (err)
						reject(err);
					else{
						if (results.affectedRows == 1)
							records_user_account_app_setting++;
						resolve(results);
					}
				  })
			});
		}
		let result_create_user = await create_users();
		for (let demo_user of demo_users){
			for (let i = 0; i < demo_user.settings.length; i++){
				let user_setting_app_id = demo_user.settings[i].app_id;
				let result_createUserAccountApp = await create_user_account_app(user_setting_app_id, demo_user.id);
				delete demo_user.settings[i].app_id;
				let settings_header_image;
				//use file in settings or if missing then use filename same as demo username
				if (demo_user.settings[i].image_header_image_img)
					settings_header_image = `${demo_user.settings[i].image_header_image_img}.webp`;
				else
					settings_header_image = `${demo_user.username}.webp`;
				let image = await fs.promises.readFile(`${process.cwd()}/scripts/demo/${settings_header_image}`)
				image = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
				//update settings with loaded image into BASE64 format
				demo_user.settings[i].image_header_image_img = image;
				//use random day and month themes
				//day 10001-10010
				demo_user.settings[i].design_theme_day_id = Math.floor(10001 + Math.random() * 10);
				//month 20001-20022
				demo_user.settings[i].design_theme_month_id = Math.floor(20001 + Math.random() * 22);
				demo_user.settings[i].design_theme_year_id = 30001;
				let json_data_user_setting = `{
					"description": "${demo_user.settings[i].description}",
					"settings_json": ${JSON.stringify(demo_user.settings[i])},
					"user_account_id": ${demo_user.id}
					}`;	
				let result_createUserSetting = await create_setting(user_setting_app_id, JSON.parse(json_data_user_setting));
				/*
				let social_types = ['LIKE', 'VIEW', 'VIEW_ANONYMOUS', 'FOLLOWER', 'SETTINGS_LIKE', 'SETTINGS_VIEW', 'SETTINGS_VIEW_ANONYMOUS'];
				social_types.ForEach(social_type => {
					//select new random sample for each social type
					let random_users1 = [];
					let random_users2 = [];
					//loop until two groups both have 20 samples with unique users in each sample
					while (random_users1.length <= 20 && random_users2.length <= 20){
						let random_array_index1 = Math.floor(1 + Math.random() * insert_record_user.length - 1 )
						let random_array_index2 = Math.floor(1 + Math.random() * insert_record_user.length - 1 )
						if (random_users1.length <20 && !random_users1.includes(random_array_index1) )
							random_users1.push(insert_record_user[random_array_index1])
						if (random_users2.length <20 && !random_users2.includes(random_array_index2))
							random_users2.push(insert_record_user[random_array_index2])
					}
					const check_finished = () =>{
						if (total_records==social_type.length * random_users1.length * random_users1.length)
							return res.status(200).json({
								count_created: total_records
							});
					}
					random_users1.foreach(user1 =>{
						random_users2.foreach(user2 => {
							if (social_type == 'LIKE')
								likeUser(req.query.app_id, user1, user2, (err,results_likeUser) => {
									total_records++;
									check_finished();
								})
							if (social_type == 'VIEW'){
								insertUserAccountView(req.query.app_id,JSON.parse(
																			`{"user_account_id": ${user1},
																			"user_account_id_view": ${user2},
																			"client_ip": null,
																			"client_user_agent": null,
																			"client_longitude": null,
																			"client_latitude": null
																		}`), (err,results_insertUserAccountView) => {
									total_records++;
									check_finished();
								})
							}
							if (social_type == 'VIEW_ANONYMOUS')
							insertUserAccountView(req.query.app_id, JSON.parse(
																		`{ "user_account_id": ${user1},
																		"user_account_id_view": null,
																		"client_ip": null,
																		"client_user_agent": null,
																		"client_longitude": null,
																		"client_latitude": null
																		}`), (err,results_insertUserAccountView) => {
								total_records++;
								check_finished();
							})

							if (social_type == 'FOLLOWER')
								followUser(req.query.app_id, user1, user2, (err,results_followUser) => {
									total_records++;
									check_finished();
								})
							if (social_type == 'SETTINGS_LIKE')
								getUserSettingsByUserId(req.query.app_id, user1, (err,results_settings) => {
									likeUserSetting(req.query.app_id, user2, results_settings.id, (err,results_likeUserSetting) => {
										total_records++;
										check_finished();
									})
								})
							if (social_type == 'SETTINGS_VIEW' || social_type == 'SETTINGS_VIEW_ANONYMOUS'){
								getUserSettingsByUserId(req.query.app_id, user1, (err,results_getUserSettingsByUserId) => {
									//choose random setting from user
									let random_index = Math.floor(1 + Math.random() * results_getUserSettingsByUserId.length )
									let settings_user_id;
									if (social_type == 'SETTINGS_VIEW')
										settings_user_id = user2;
									else
										user_account_id = 'null';
									insertUserSettingView(req.query.app_id, JSON.parse(
																			'{  "user_account_id":' + user_account_id + ',' + 
																			`	"user_setting_id": ${results_getUserSettingsByUserId[random_index].id},
																				"client_ip": null,
																				"client_user_agent": null,
																				"client_longitude": null,
																				"client_latitude": null
																				}`), (err,results_insertUserSettingView) => {
										total_records++;
										check_finished();
									})
								})
							}
						})
					})
				})
				*/
			}
		}
		return res.status(200).json({
			count_records_user_account: records_user_account,
			count_records_user_account_app: records_user_account_app,
			count_records_user_account_app_setting: records_user_account_app_setting
		});
	} catch (error) {
		import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.controller.js`).then(({checked_error}) =>{
			return checked_error(req.query.app_id, req.query.lang_code, error, res);
		})
	}
	
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
}
const demo_delete = async (req, res)=> {
	const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
	import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`).then(({getDemousers, deleteUser})=>{
		getDemousers(req.query.app_id, (err, result_demo_users) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			else{
				let deleted_user = 0;
				if (result_demo_users.length>0)
					for (let user of result_demo_users){
						deleteUser(req.query.app_id, user.id,  (err, result_deleteUser) =>{
							if (err) {
								return res.status(500).send({
									data: err
								});
							}
							else{
								deleted_user++;
								if (deleted_user == result_demo_users.length)
									return res.status(200).json({
										count_deleted: result_demo_users.length
									});
							}
						})
					}
				else
					return res.status(200).json({
						count_deleted: result_demo_users.length
					});
			}
		});
	})
}
const demo_get = async (req, res)=> {
	const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
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