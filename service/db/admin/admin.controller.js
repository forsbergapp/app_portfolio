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
	const {getAppsAdminId} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app/app.service.js`);
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
		const fileBuffer = await fs.promises.readFile(`${process.cwd()}/scripts/demo/demo.json`, 'utf8');
		let demo_users = JSON.parse(fileBuffer.toString()).demo_users;
		let email_index = 1000;
		let records_user_account = 0;
		let records_user_account_app = 0;
		let records_user_account_app_setting = 0;
		let password_encrypted = hashSync(req.body.demo_password, genSaltSync(10));
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
		const create_user_account_app = async (app_id, user_account_id) =>{
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
			})
		}
		const create_setting = async (user_setting_app_id, json_data, i) => {
			return new Promise((resolve, reject) => {
				  let initial;
				  if (i==0)
				  	initial = 1;
				  else
				  	initial = 0;
				  createUserSetting(user_setting_app_id, initial, json_data, (err,results) => {
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
		//create all users first and update with id
		let result_create_user = await create_users();
		let apps = await getAppsAdminId(req.query.app_id);
		//create user settings
		for (let demo_user of demo_users){
			//create user_account_app record for all apps
			for (let app of apps){
				let result_createUserAccountApp = await create_user_account_app(app.id, demo_user.id);
			}
			for (let i = 0; i < demo_user.settings.length; i++){
				let user_setting_app_id = demo_user.settings[i].app_id;
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
				let settings_no_app_id = JSON.parse(JSON.stringify(demo_user.settings[i]));
				delete settings_no_app_id.app_id;
				let json_data_user_setting = `{
					"description": "${demo_user.settings[i].description}",
					"settings_json": ${JSON.stringify(settings_no_app_id)},
					"user_account_id": ${demo_user.id}
					}`;	
				let result_createUserSetting = await create_setting(user_setting_app_id, JSON.parse(json_data_user_setting), i);
			}
		}
		let records_user_account_like = 0;
		let records_user_account_view = 0;
		let records_user_account_follow = 0;
		let records_user_account_setting_like = 0;
		let records_user_account_setting_view = 0;
		//create social records
		let social_types = ['LIKE', 'VIEW', 'VIEW_ANONYMOUS', 'FOLLOWER', 'SETTINGS_LIKE', 'SETTINGS_VIEW', 'SETTINGS_VIEW_ANONYMOUS'];
		const create_likeuser = async (app_id, id, id_like ) =>{
			return new Promise((resolve, reject) => {
				likeUser(app_id, id, id_like, (err,results) => {
					if (err)
						reject(err);
					else{
						if (results.affectedRows == 1)
							records_user_account_like++;
						resolve(results);
					}
				})
			})
		}
		const create_user_account_view = async (app_id, json_data ) =>{
			return new Promise((resolve, reject) => {
				insertUserAccountView(app_id, json_data, (err,results) => {
					if (err)
						reject(err);
					else{
						if (results.affectedRows == 1)
							records_user_account_view++;
						resolve(results);
					}
				})
			})
		}
		const create_user_account_follow = async (app_id, id, id_follow ) =>{
			return new Promise((resolve, reject) => {
				followUser(app_id, id, id_follow, (err,results) => {
					if (err)
						reject(err);
					else{
						if (results.affectedRows == 1)
							records_user_account_follow++;
						resolve(results);
					}
				})
			})
		}
		const create_user_account_app_setting_like = async (app_id, user1, user2 ) =>{
			return new Promise((resolve, reject) => {
				getUserSettingsByUserId(app_id, user1, (err,results_settings) => {
					if (err)
						reject(err);
					else{
						let random_settings_index = Math.floor(1 + Math.random() * results_settings.length - 1 )
						likeUserSetting(app_id, user2, results_settings[random_settings_index].id, (err,results) => {
							if (err)
								reject(err);
							else{
								if (results.affectedRows == 1)
									records_user_account_setting_like++;
								resolve(results);
							}
						})
					}
				})
			})
		}
		const create_user_account_app_setting_view = async (app_id, user1, user2 , social_type) =>{
			return new Promise((resolve, reject) => {
				getUserSettingsByUserId(app_id, user1, (err,results_settings) => {
					if (err)
						reject(err);
					else{
						//choose random setting from user
						let random_index = Math.floor(1 + Math.random() * results_settings.length -1)
						let user_account_id;
						if (social_type == 'SETTINGS_VIEW')
							user_account_id = user2;
						else
							user_account_id = 'null';
						insertUserSettingView(app_id, JSON.parse(
														'{  "user_account_id":' + user_account_id + ',' + 
														`	"user_setting_id": ${results_settings[random_index].id},
															"client_ip": null,
															"client_user_agent": null,
															"client_longitude": null,
															"client_latitude": null
															}`), (err,results) => {
							if (err)
								reject(err);
							else{
								if (results.affectedRows == 1)
									records_user_account_setting_view++;
								resolve(results);
							}
						})
					}
				})
			})
		}
		for (let social_type of social_types){
			//select new random sample for each social type
			let random_users1 = [];
			let random_users2 = [];
			//loop until two groups both have 50% samples with unique users in each sample
			let sample_amount = Math.floor(demo_users.length * 0.5);
			while (random_users1.length < sample_amount || random_users2.length < sample_amount){
				let random_array_index1 = Math.floor(1 + Math.random() * demo_users.length - 1 )
				let random_array_index2 = Math.floor(1 + Math.random() * demo_users.length - 1 )
				if (random_users1.length <sample_amount && !random_users1.includes(demo_users[random_array_index1].id) )
					random_users1.push(demo_users[random_array_index1].id)
				if (random_users2.length <sample_amount && !random_users2.includes(demo_users[random_array_index2].id))
					random_users2.push(demo_users[random_array_index2].id)
			}
			let result_insert;
			for (let user1 of random_users1){
				for(let user2 of random_users2){
					switch (social_type){
						case 'LIKE':{
							result_insert = await create_likeuser(req.query.app_id, user1, user2);
							break;
						}
						case 'VIEW':{
							result_insert = await create_user_account_view(req.query.app_id,JSON.parse(
														`{  "user_account_id": ${user1},
															"user_account_id_view": ${user2},
															"client_ip": null,
															"client_user_agent": null,
															"client_longitude": null,
															"client_latitude": null
														}`));
							break;
						}
						case 'VIEW_ANONYMOUS':{
							result_insert = await create_user_account_view(req.query.app_id, JSON.parse(
														`{  "user_account_id": null,
															"user_account_id_view": ${user1},
															"client_ip": null,
															"client_user_agent": null,
															"client_longitude": null,
															"client_latitude": null
														}`));
							break;
						}
						case 'FOLLOWER':{
							result_insert = await create_user_account_follow(req.query.app_id, user1, user2);
							break;
						}
						case 'SETTINGS_LIKE':{
							//pick a random user setting from the user and return the app_id
							let user_settings = demo_users.filter(user=>user.id == user1)[0].settings;
							let settings_app_id = user_settings[Math.floor(1 + Math.random() * user_settings.length - 1 )].app_id;
							result_insert = await create_user_account_app_setting_like(settings_app_id, user1, user2);
							break;
						}
						case 'SETTINGS_VIEW':
						case 'SETTINGS_VIEW_ANONYMOUS':{
							//pick a random user setting from the user and return the app_id
							let user_settings = demo_users.filter(user=>user.id == user1)[0].settings;
							let settings_app_id = user_settings[Math.floor(1 + Math.random() * user_settings.length - 1 )].app_id;
							result_insert = await create_user_account_app_setting_view(settings_app_id, user1, user2 , social_type) ;
							break;
						}
					}						
				}
			}
		}
		return res.status(200).json({
			count_records_user_account: records_user_account,
			count_records_user_account_app: records_user_account_app,
			count_records_user_account_app_setting: records_user_account_app_setting,
			count_records_user_account_like: records_user_account_like,
			count_records_user_account_view: records_user_account_view,
			count_records_user_account_follow: records_user_account_follow,
			count_records_user_account_setting_like: records_user_account_setting_like,
			count_records_user_account_setting_view: records_user_account_setting_view
		});
	} catch (error) {
		import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.controller.js`).then(({checked_error}) =>{
			return checked_error(req.query.app_id, req.query.lang_code, error, res);
		})
	}	
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
				if (result_demo_users.length>0){
					const delete_user = async () => {
						return new Promise((resolve, reject)=>{
							for (let user of result_demo_users){
								deleteUser(req.query.app_id, user.id,  (err, result_deleteUser) =>{
									if (err) {
										resolve(err);
									}
									else{
										deleted_user++;
										if (deleted_user == result_demo_users.length)
											resolve();
									}
								})
							}
						})
					}
					delete_user().then(()=>{
						return res.status(200).json({
							count_deleted: result_demo_users.length
						});
					});
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