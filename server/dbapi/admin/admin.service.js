const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

const DBA=1;

const DBStart = async () => {
   const {pool_start} = await import(`file://${process.cwd()}/server/db/db.service.js`);
   const {LogServerI, LogServerE} = await import(`file://${process.cwd()}/server/log/log.service.js`);
   if (ConfigGet(1, 'SERVICE_DB', 'START')=='1'){    
      let user;
      let password;
      let dba = 0;
      const db_use = parseInt(ConfigGet(1, 'SERVICE_DB', 'USE'));
      const host = ConfigGet(1, 'SERVICE_DB', `DB${db_use}_HOST`);
      const port = ConfigGet(1, 'SERVICE_DB', `DB${db_use}_PORT`);
      const database = ConfigGet(1, 'SERVICE_DB', `DB${db_use}_NAME`);
      const pool_db = async (dba, user, password, pool_id) =>{
         return new Promise ((resolve, reject)=>{
            const dbparameters = {
               use:                       db_use,
               pool_id:                   pool_id,
               host:                      host,
               port:                      port,
               dba:                       dba,
               user:                      user,
               password:                  password,
               database:                  database,
               //db 1 + 2 parameters
               charset:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CHARACTERSET`),
               connnectionLimit:          ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`),
               // db 3 parameters
               connectionTimeoutMillis:   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`),
               idleTimeoutMillis:         ConfigGet(1, 'SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`),
               max:                       ConfigGet(1, 'SERVICE_DB', `DB${db_use}_MAX`),
               // db 4 parameters
               connectString:             ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CONNECTSTRING`),
               poolMin:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_MIN`),
               poolMax:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_MAX`),
               poolIncrement:             ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_INCREMENT`)
            };
            pool_start(dbparameters)
            .then(result=>{
               LogServerI(`Started pool ${pool_id}, db ${db_use}, host ${host}, port ${port}, dba ${dba}, user ${user}, database ${database}`);
               resolve(result);
            })
            .catch(error=>{
               LogServerE('Starting pool error: ' + error);
               reject(error);
            });
         });
      };
      if (ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`)){
         user = `${ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`)}`;
         password = `${ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_PASS`)}`;
         dba = 1;
         await pool_db(dba, user, password, null);
      }
      if (ConfigGet(1, 'SERVICE_DB', `DB${db_use}_APP_ADMIN_USER`)){
         user = `${ConfigGet(1, 'SERVICE_DB', `DB${db_use}_APP_ADMIN_USER`)}`;
         password = `${ConfigGet(1, 'SERVICE_DB', `DB${db_use}_APP_ADMIN_PASS`)}`;
         dba = 0;
         await pool_db(dba, user, password, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'))
         .then(()=>{
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.service.js`).then(({ getAppDBParametersAdmin }) => {
               //app_id inparameter for log, all apps will be returned
               getAppDBParametersAdmin(ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),(err, result_apps) =>{
                  if (err)
                     throw err;
                  else {
                     //get app id, db username and db password
                     for (const app  of result_apps){
                        if (app.id != ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'))
                           pool_db(dba, app.db_user, app.db_password, app.id);
                     }
                  }
               });
            });
         });
      }  
   }
};
const DBInfo = async (app_id, callBack) => {
   const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
   let sql;
   const db_use = ConfigGet(1, 'SERVICE_DB', 'USE');
   switch (db_use){
      case '1':
      case '2':{
         let table_global_variables;
         if (db_use == 1){
            //MariaDB
            table_global_variables = 'information_schema';
         }
         else{
            //MySQL
            table_global_variables = 'performance_schema';
         }
         sql = `SELECT :database database_use,
                       (SELECT variable_value
                          FROM ${table_global_variables}.global_variables
                         WHERE variable_name = 'version_comment') database_name,
                       (SELECT variable_value
                          FROM ${table_global_variables}.global_variables
                         WHERE variable_name='version') version,
                       :Xdatabase_schema database_schema,
                       (SELECT variable_value
                          FROM ${table_global_variables}.global_variables
                         WHERE variable_name='hostname') hostname,
                       (SELECT variable_value
                          FROM ${table_global_variables}.global_status
                         WHERE variable_name='Threads_connected') connections,
                       (SELECT DATE_SUB( NOW(),  INTERVAL variable_value SECOND)
                          FROM ${table_global_variables}.global_status
                         WHERE variable_name='Uptime') started
               FROM DUAL`;
         break;
      }
      case '3':{
         sql = `SELECT :database "database_use",
                        version() "database_name",
                        current_setting('server_version') "version",
                        :Xdatabase_schema "database_schema",
                        inet_server_addr() "hostname", 
                        (SELECT count(*) 
                           FROM pg_stat_activity 
                          WHERE datname IS NOT NULL) "connections",
                        pg_postmaster_start_time() "started"`;
         break;
      }
      case '4':{
         sql = `SELECT :database "database_use",
                        (SELECT product
                           FROM product_component_version) "database_name", 
                        (SELECT version_full
                           FROM product_component_version) "version", 
                        :Xdatabase_schema "database_schema",
                        (SELECT cloud_identity
                           FROM v$pdbs) "hostname", 
                        (SELECT COUNT(*) 
                           FROM v$session) "connections",
                        v.startup_time "started"
                  FROM V$INSTANCE v`;
         break;
      }
   }
   const parameters = {	
                  database: db_use,
                  Xdatabase_schema: db_schema()
                  };
   db_execute(app_id, sql, parameters, DBA, (err, result)=>{
      if (err)
         return callBack(err, null);
      else{
         if (db_use == 4){
            const hostname = JSON.parse(result[0].hostname.toLowerCase()).public_domain_name + 
                           ' (' + JSON.parse(result[0].hostname.toLowerCase()).outbound_ip_address + ')';
            result[0].database_schema += ' (' + JSON.parse(result[0].hostname.toLowerCase()).database_name + ')';
            result[0].hostname = hostname;
         }
         return callBack(null, result[0]);
      }
   });
};
const DBInfoSpace = async (app_id, callBack) => {
   const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
   let sql;
   switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
      case '1':
      case '2':{
         sql = `SELECT t.table_name table_name,
                       IFNULL(ROUND((SUM(t.data_length)+SUM(t.index_length))/1024/1024,2),0.00) total_size,
                       IFNULL(ROUND(((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/1024/1024,2),0.00) data_used,
                       IFNULL(ROUND(SUM(data_free)/1024/1024,2),0.00) data_free,
                       IFNULL(ROUND((((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/((SUM(t.data_length)+SUM(t.index_length)))*100),2),0) pct_used
                  FROM INFORMATION_SCHEMA.SCHEMATA s, 
                       INFORMATION_SCHEMA.TABLES t
                 WHERE s.schema_name = t.table_schema
                   AND s.schema_name = :db_schema
                 GROUP BY table_name
                 ORDER BY IFNULL(ROUND((SUM(t.data_length)+SUM(t.index_length))/1024/1024,2),0.00) DESC`;
         break;
      }
      case '3':{
         sql = `SELECT t.tablename "table_name",
                       pg_table_size(t.schemaname || '.' || t.tablename)/1024/1024::decimal "total_size",
                       pg_relation_size(t.schemaname || '.' || t.tablename)/1024/1024::decimal "data_used",
                       (pg_table_size(t.schemaname || '.' || t.tablename) - pg_relation_size(t.schemaname || '.' || t.tablename))/1024/1024::decimal "data_free",
                       pg_relation_size(t.schemaname || '.' || t.tablename) / CASE pg_table_size(t.schemaname || '.' || t.tablename) 
                                                                              WHEN 0 THEN 1 
                                                                              ELSE pg_table_size(t.schemaname || '.' || t.tablename)::decimal
                                                                              END *100 "pct_used"
                  FROM pg_tables t
                 WHERE t.tableowner = LOWER(:db_schema)
                 GROUP BY t.schemaname, t.tablename
                 ORDER BY 2 DESC`;
         break;
      }
      case '4':{
         sql = `SELECT dt.table_name "table_name",
                       SUM(ds.bytes)/1024/1024 "total_size",
                       dt.num_rows*dt.avg_row_len/1024/1024 "data_used",
                       (SUM(ds.bytes)/1024/1024) - (dt.num_rows*dt.avg_row_len/1024/1024) "data_free",
                       (dt.num_rows*dt.avg_row_len/1024/1024) / (SUM(ds.bytes)/1024/1024)*100 "pct_used"
                  FROM DBA_TABLES dt,
                       DBA_SEGMENTS ds
                 WHERE dt.owner = UPPER(:db_schema)
                   AND ds.segment_name = dt.table_name
                   AND ds.segment_type = 'TABLE'
                 GROUP BY dt.table_name, dt.num_rows,dt.avg_row_len
                 ORDER BY 2 DESC`;
         break;
      }
   }
   const parameters = {db_schema: db_schema()};
   db_execute(app_id, sql, parameters, DBA, (err, result)=>{
      if (err)
         return callBack(err, null);
      else
         return callBack(null, result);
   });
};
const DBInfoSpaceSum = async (app_id, callBack) => {
   const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
   let sql;
   switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
      case '1':
      case '2':{
         sql = `SELECT IFNULL(ROUND((SUM(t.data_length)+SUM(t.index_length))/1024/1024,2),0.00) total_size,
                       IFNULL(ROUND(((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/1024/1024,2),0.00) data_used,
                       IFNULL(ROUND(SUM(data_free)/1024/1024,2),0.00) data_free,
                       IFNULL(ROUND((((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/((SUM(t.data_length)+SUM(t.index_length)))*100),2),0) pct_used
                  FROM INFORMATION_SCHEMA.SCHEMATA s, 
                       INFORMATION_SCHEMA.TABLES t
                 WHERE s.schema_name = t.table_schema
                   AND s.schema_name = :db_schema`;
         break;
      }
      case '3':{
         sql = `SELECT SUM(pg_table_size(t.schemaname || '.' || t.tablename)/1024/1024)::decimal "total_size",
                       SUM(pg_relation_size(t.schemaname || '.' || t.tablename)/1024/1024)::decimal "data_used",
                       SUM((pg_table_size(t.schemaname || '.' || t.tablename) - pg_relation_size(t.schemaname || '.' || t.tablename))/1024/1024)::decimal "data_free",
                       SUM(pg_relation_size(t.schemaname || '.' || t.tablename)) / SUM(CASE pg_table_size(t.schemaname || '.' || t.tablename) 
                                                                                       WHEN 0 THEN 1 
                                                                                       ELSE pg_table_size(t.schemaname || '.' || t.tablename)::decimal
                                                                                       END) *100 "pct_used"
                  FROM pg_tables t
                 WHERE t.tableowner = LOWER(:db_schema)
                 ORDER BY 2 DESC`;
         break;
      }
      case '4':{
         sql = `SELECT SUM(ds.bytes)/1024/1024 "total_size",
                       SUM(dt.num_rows*dt.avg_row_len/1024/1024) "data_used",
                       (SUM(ds.bytes)/1024/1024) - SUM(dt.num_rows*dt.avg_row_len/1024/1024) "data_free",
                       SUM(dt.num_rows*dt.avg_row_len/1024/1024) / (SUM(ds.bytes)/1024/1024)*100 "pct_used"
                  FROM DBA_TABLES dt,
                       DBA_SEGMENTS ds
                 WHERE dt.owner = UPPER(:db_schema)
                   AND ds.segment_name = dt.table_name
                   AND ds.segment_type = 'TABLE'`;
         break;
      }
   }
   const parameters = {db_schema: db_schema()};
   db_execute(app_id, sql, parameters, DBA, (err, result)=>{
      if (err)
         return callBack(err, null);
      else
         return callBack(null, result[0]);
   });
};
const demo_add = async (app_id, demo_password, lang_code, callBack)=> {
   /* create demo users with user settings from /scripts/demo/demo.json
	   and reading images in /scripts/demo/demo*.webp
	*/
	const { default: {genSaltSync, hashSync} } = await import('bcryptjs');
	const {getAppsAdminId} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app/app.service.js`);
	const {create} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`);
	const {createUserAccountApp} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app/user_account_app.service.js`);
	const {createUserSetting, getUserSettingsByUserId} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting/user_account_app_setting.service.js`);
	const {likeUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_like/user_account_like.service.js`);
	const {insertUserAccountView} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_view/user_account_view.service.js`);
	const {followUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_follow/user_account_follow.service.js`);
	const {likeUserSetting} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_like/user_account_app_setting_like.service.js`);
	const {insertUserSettingView} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_view/user_account_app_setting_view.service.js`);
	const fs = await import('node:fs');
   const install_result = [];
   install_result.push({'start': new Date().toISOString()});
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
		const demo_users = JSON.parse(fileBuffer.toString()).demo_users;
		let email_index = 1000;
		let records_user_account = 0;
		let records_user_account_app = 0;
		let records_user_account_app_setting = 0;
		const password_encrypted = hashSync(demo_password, genSaltSync(10));
		const create_users = async (demo_users) =>{
			return await new Promise((resolve, reject)=>{
				const create_update_id = (demo_user)=>{
					const email = `demo${++email_index}@localhost`;
					const json_data_user = {
											username:               demo_user.username,
											bio:                    demo_user.bio,
											avatar:                 demo_user.avatar,
											password:               password_encrypted,
											password_reminder:      '',
											email:                  email,
											active:                 1,
											private:                0,
											user_level:             2,
											verification_code:      null,
											identity_provider_id:   null,
											provider_id:            null,
											provider_first_name:    null,
											provider_last_name:     null,
											provider_image:         null,
											provider_image_url:     null,
											provider_email:         null
										};
					create(app_id, json_data_user, (err, results_create) => {
						if (err)
							reject(err);
						else{
							demo_user.id = results_create.insertId;
							records_user_account++;
							if (records_user_account == demo_users.length)
								resolve();
						}
					});
				};
				for (const demo_user of demo_users){
					create_update_id(demo_user);
				}
			});
		};
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
				});
			});
		};
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
            });
			});
		};
		//create all users first and update with id
		await create_users(demo_users);
		const apps = await getAppsAdminId(app_id);
		//create user settings
		for (const demo_user of demo_users){
			//create user_account_app record for all apps
			for (const app of apps){
				await create_user_account_app(app.id, demo_user.id);
			}
			for (let i = 0; i < demo_user.settings.length; i++){
				const user_setting_app_id = demo_user.settings[i].app_id;
				let settings_header_image;
				//use file in settings or if missing then use filename same as demo username
				if (demo_user.settings[i].image_header_image_img)
					settings_header_image = `${demo_user.settings[i].image_header_image_img}.webp`;
				else
					settings_header_image = `${demo_user.username}.webp`;
				let image = await fs.promises.readFile(`${process.cwd()}/scripts/demo/${settings_header_image}`);
				image = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
				//update settings with loaded image into BASE64 format
				demo_user.settings[i].image_header_image_img = image;
				//use random day and month themes
				//day 10001-10010
				demo_user.settings[i].design_theme_day_id = Math.floor(10001 + Math.random() * 10);
				//month 20001-20022
				demo_user.settings[i].design_theme_month_id = Math.floor(20001 + Math.random() * 22);
				demo_user.settings[i].design_theme_year_id = 30001;
				const settings_no_app_id = JSON.parse(JSON.stringify(demo_user.settings[i]));
				delete settings_no_app_id.app_id;
				const json_data_user_setting = {
                                             description: demo_user.settings[i].description,
                                             settings_json: settings_no_app_id,
                                             user_account_id: demo_user.id
                                           };	
				await create_setting(user_setting_app_id, json_data_user_setting, i);
			}
		}
		let records_user_account_like = 0;
		let records_user_account_view = 0;
		let records_user_account_follow = 0;
		let records_user_account_setting_like = 0;
		let records_user_account_setting_view = 0;
		//create social records
		const social_types = ['LIKE', 'VIEW', 'VIEW_ANONYMOUS', 'FOLLOWER', 'SETTINGS_LIKE', 'SETTINGS_VIEW', 'SETTINGS_VIEW_ANONYMOUS'];
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
				});
			});
		};
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
				});
			});
		};
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
				});
			});
		};
		const create_user_account_app_setting_like = async (app_id, user1, user2 ) =>{
			return new Promise((resolve, reject) => {
				getUserSettingsByUserId(app_id, user1, (err,results_settings) => {
					if (err)
						reject(err);
					else{
						const random_settings_index = Math.floor(1 + Math.random() * results_settings.length - 1 );
						likeUserSetting(app_id, user2, results_settings[random_settings_index].id, (err,results) => {
							if (err)
								reject(err);
							else{
								if (results.affectedRows == 1)
									records_user_account_setting_like++;
								resolve(results);
							}
						});
					}
				});
			});
		};
		const create_user_account_app_setting_view = async (app_id, user1, user2 , social_type) =>{
			return new Promise((resolve, reject) => {
				getUserSettingsByUserId(app_id, user1, (err,results_settings) => {
					if (err)
						reject(err);
					else{
						//choose random setting from user
						const random_index = Math.floor(1 + Math.random() * results_settings.length -1);
						let user_account_id;
						if (social_type == 'SETTINGS_VIEW')
							user_account_id = user2;
						else
							user_account_id = null;
						insertUserSettingView(app_id, {  user_account_id: user_account_id,
                                                   user_setting_id: results_settings[random_index].id,
                                                   client_ip: null,
                                                   client_user_agent: null,
                                                   client_longitude: null,
                                                   client_latitude: null
															}, (err,results) => {
							if (err)
								reject(err);
							else{
								if (results.affectedRows == 1)
									records_user_account_setting_view++;
								resolve(results);
							}
						});
					}
				});
			});
		};
		for (const social_type of social_types){
			//select new random sample for each social type
			const random_users1 = [];
			const random_users2 = [];
			//loop until two groups both have 50% samples with unique users in each sample
			const sample_amount = Math.floor(demo_users.length * 0.5);
			while (random_users1.length < sample_amount || random_users2.length < sample_amount){
				const random_array_index1 = Math.floor(1 + Math.random() * demo_users.length - 1 );
				const random_array_index2 = Math.floor(1 + Math.random() * demo_users.length - 1 );
				if (random_users1.length <sample_amount && !random_users1.includes(demo_users[random_array_index1].id) )
					random_users1.push(demo_users[random_array_index1].id);
				if (random_users2.length <sample_amount && !random_users2.includes(demo_users[random_array_index2].id))
					random_users2.push(demo_users[random_array_index2].id);
			}
			for (const user1 of random_users1){
				for(const user2 of random_users2){
					switch (social_type){
						case 'LIKE':{
							await create_likeuser(app_id, user1, user2);
							break;
						}
						case 'VIEW':{
							await create_user_account_view(app_id, 
                                                   {user_account_id: user1,
                                                    user_account_id_view: user2,
                                                    client_ip: null,
                                                    client_user_agent: null,
                                                    client_longitude: null,
                                                    client_latitude: null
                                                   });
							break;
						}
						case 'VIEW_ANONYMOUS':{
							await create_user_account_view(app_id, 
                                                            {
                                                            user_account_id: null,
                                                            user_account_id_view: user1,
                                                            client_ip: null,
                                                            client_user_agent: null,
                                                            client_longitude: null,
                                                            client_latitude: null
                                                            });
							break;
						}
						case 'FOLLOWER':{
							await create_user_account_follow(app_id, user1, user2);
							break;
						}
						case 'SETTINGS_LIKE':{
							//pick a random user setting from the user and return the app_id
							const user_settings = demo_users.filter(user=>user.id == user1)[0].settings;
							const settings_app_id = user_settings[Math.floor(1 + Math.random() * user_settings.length - 1 )].app_id;
							await create_user_account_app_setting_like(settings_app_id, user1, user2);
							break;
						}
						case 'SETTINGS_VIEW':
						case 'SETTINGS_VIEW_ANONYMOUS':{
							//pick a random user setting from the user and return the app_id
							const user_settings = demo_users.filter(user=>user.id == user1)[0].settings;
							const settings_app_id = user_settings[Math.floor(1 + Math.random() * user_settings.length - 1 )].app_id;
							await create_user_account_app_setting_view(settings_app_id, user1, user2 , social_type) ;
							break;
						}
					}						
				}
			}
		}
      install_result.push({'user_account': records_user_account});
      install_result.push({'user_account_app': records_user_account_app});
      install_result.push({'user_account_app_setting': records_user_account_app_setting});
      install_result.push({'user_account_like': records_user_account_like});
      install_result.push({'user_account_view': records_user_account_view});
      install_result.push({'user_account_follow': records_user_account_follow});
      install_result.push({'user_account_setting_like': records_user_account_setting_like});
      install_result.push({'user_account_setting_view': records_user_account_setting_view});
      install_result.push({'finished': new Date().toISOString()});
      return callBack(null, {'info': install_result});
	} catch (error) {
		return callBack(error, null);
	}	
};
const demo_delete = async (app_id, callBack)=> {
	import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({getDemousers, deleteUser})=>{
		getDemousers(app_id, (err, result_demo_users) =>{
			if (err) {
            return callBack(err, null);
			}
			else{
				let deleted_user = 0;
				if (result_demo_users.length>0){
					const delete_user = async () => {
						return new Promise((resolve)=>{
							for (const user of result_demo_users){
								deleteUser(app_id, user.id,  (err) =>{
									if (err) {
										resolve(err);
									}
									else{
										deleted_user++;
										if (deleted_user == result_demo_users.length)
											resolve();
									}
								});
							}
						});
					};
					delete_user().then(()=>{
                  if (err)
                     return callBack(err, null);
                  else
                     return callBack(null, {'info': [{'count': deleted_user}]});
					});
				}
				else
               return callBack(null, {'info': [{'count': result_demo_users.length}]});
			}
		});
	});
};
const demo_get = async (app_id, callBack)=> {
	import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({getDemousers})=>{
		getDemousers(app_id, (err, result_demo_users) =>{
			if (err)
            return callBack(err, null);
         else
            return callBack(null, result_demo_users);
		});
	});
};
const install_db_execute_statement = async (app_id, sql, parameters) => {
   const {db_execute} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
   return new Promise((resolve, reject) =>{
      db_execute(app_id, sql, parameters, DBA, (err, result)=>{
         if (err)
            reject(err);
         else
            resolve(result);
      });
   });
};
const install_db_get_files = async (json_type) =>{
   let files;
   let app_installed = 1;
   const fs = await import('node:fs');
   if (json_type == 'install')
      files = [
      /*
         /scripts/install_database.json syntax:
         contanins one statement for app_portfolio user with <APP_PASSWORD/> in "install"
         {
            "install": [
               {"db": 1, "script": "[filename]"},
               {"db": 2, "script": "[filename]"},
               {"db": 3, "script": "[filename]"},
               {"db": 4, "script": "[filename]"},
               {"db": null, "script": "[filename]"}, //execute in all databases
               {"db": null, "script": "[filename]", "optional":1}, //installs if optional is chosen
            ]
         } 
      */
      [0, '/scripts/install_database.json'],
      /*
         /apps/admin/scripts/install_database.json and /apps/app[app_id]/scripts/install_database.json syntax:
         contanins one statement for app_admin or app[app_id] user with <APP_PASSWORD/> in "users"
         {
            "install": [
               {"db": 1, "script": "[filename]"},
               {"db": 2, "script": "[filename]"},
               {"db": 3, "script": "[filename]"},
               {"db": 4, "script": "[filename]"},
               {"db": null, "script": "[filename]"} //execute in all databases
            ],
            "users":[
               {"db": 1, "app_id": 0, "sql": "[sql]"},
               {"db": 2, "app_id": 0, "sql": "[sql]"},
               {"db": 3, "app_id": 0, "sql": "[sql]"},
               {"db": 4, "app_id": 0, "sql": "[sql]"}
            ]
         }
      */
      [1, '/apps/admin/scripts/install_database.json']
   ];
   else
      files  = [
      /*
         /scripts/uninstall_database.json syntax:
         {
            "uninstall": [
               {"db": 1, "sql": "[sql]"},
               {"db": 2, "sql": "[sql]"},
               {"db": 3, "sql": "[sql]"},
               {"db": 4, "sql": "[sql]"}
            ]
         } 
      */
      [0, '/scripts/uninstall_database.json'],
      /*
         /apps/admin/scripts/uninstall_database.json and /apps/app[app_id]/scripts/uninstall_database.json syntax:
         {
            "uninstall": [
               {"db": 1, "sql": "[sql]"},
               {"db": 2, "sql": "[sql]"},
               {"db": 3, "sql": "[sql]"},
               {"db": 4, "sql": "[sql]"}
               {"db": null, "sql": "[sql]"}  //deletes data, can be ignored if database is dropped
            ]
         }
      */
      [1, '/apps/admin/scripts/uninstall_database.json']
   ];
   while (true){
      try {
         await fs.promises.access(`${process.cwd()}/apps/app${app_installed}/scripts/${json_type}_database.json`);   
         files.push([app_installed + 1, `/apps/app${app_installed}/scripts/${json_type}_database.json`, app_installed]);
         app_installed += 1; 
      } catch (error) {
         return files;
      }
   }
};
const install_db = async (app_id, optional=null, callBack)=> {
   
   const {db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
   const {CreateRandomString} = await import(`file://${process.cwd()}/server/server.service.js`);
   const {pool_close, pool_start} = await import(`file://${process.cwd()}/server/db/db.service.js`);
   const {createHash} = await import('node:crypto');
   const { default: {genSaltSync, hashSync} } = await import('bcryptjs');
   const fs = await import('node:fs');
   let count_statements = 0;
   let count_statements_optional = 0;
   const install_result = [];
   const password_tag = '<APP_PASSWORD/>';
   let change_system_admin_pool=true;
   const db_use = ConfigGet(1, 'SERVICE_DB', 'USE');
   install_result.push({'start': new Date().toISOString()});
   const sql_with_password = (username, sql) =>{
      let password;
      //USER_ACCOUNT uses bcrypt, save as bcrypt but return sha256 password
      //Database users use SHA256
      password = createHash('sha256').update(CreateRandomString()).digest('hex');
      if (ConfigGet(1, 'SERVICE_DB', 'USE')=='4'){
         // max 30 characters for passwords and without double quotes
         // also fix ORA-28219: password verification failed for mandatory profile
         // ! + random A-Z character
         const random_characters = '!' + String.fromCharCode(0|Math.random()*26+97).toUpperCase();
         password = password.substring(0,28) + random_characters;
         //use singlequote for INSERT, else doublequote for CREATE USER
         if (sql.toUpperCase().includes('INSERT INTO'))
            sql = sql.replace(password_tag, `'${hashSync(password, genSaltSync(10))}'`);
         else
            sql = sql.replace(password_tag, `"${password}"`);
      }   
      else
         if (sql.toUpperCase().includes('INSERT INTO'))
            sql = sql.replace(password_tag, `'${hashSync(password, genSaltSync(10))}'`);
         else
            sql = sql.replace(password_tag, `'${password}'`);
      install_result.push({[`${username}`]: password});         
      return [sql, password];
   };
   try {
      const files = await install_db_get_files('install');
      for (const file of files){
         let install_json = await fs.promises.readFile(`${process.cwd()}${file[1]}`, 'utf8');
         install_json = JSON.parse(install_json);
         //filter for current database or for all databases and optional rows
         install_json.install = install_json.install.filter((row) => 
               (Object.prototype.hasOwnProperty.call(row, 'optional')==false || (Object.prototype.hasOwnProperty.call(row, 'optional')==1 && row.optional==optional)) && 
               (row.db == ConfigGet(1, 'SERVICE_DB', 'USE') || row.db == null));
         for (const install_row of install_json.install){
            let install_sql;
            switch (file[0]){
               case 0:{
                  //main script
                  install_sql = await fs.promises.readFile(`${process.cwd()}/scripts/${install_row.script}`, 'utf8');
                  break;
               }
               case 1:{
                  //admin script
                  install_sql = await fs.promises.readFile(`${process.cwd()}/apps/admin/scripts/${install_row.script}`, 'utf8');
                  break;
               }
               default:{
                  //app scripts
                  install_sql = await fs.promises.readFile(`${process.cwd()}/apps/app${file[2]}/scripts/${install_row.script}`, 'utf8');
               }
            }
            
            //split script file into separate sql statements
            for (let sql of install_sql.split(';')){
               const check_sql = (sql) =>{
                  if (!sql || sql.endsWith('\r\n') || sql=='\n' || sql=='\n\n')
                     return false;
                  else
                     return true;
               };
               if (check_sql(sql)){
                  if (file[0] == 0 && sql.includes(password_tag)){
                        let sql_and_pw;
                        if (sql.toUpperCase().includes('INSERT INTO'))
                           sql_and_pw = sql_with_password('admin', sql);
                        else
                           sql_and_pw = sql_with_password('app_portfolio', sql);
                        sql = sql_and_pw[0];
                  }
                  //if ; must be in wrong place then set tag in import script and convert it
                  if (sql.includes('<SEMICOLON/>'))
                     sql = sql.replace('<SEMICOLON/>', ';');
                  //close and start pool when creating database, some modules dont like database name when creating database
                  //exclude db 4
                  if (db_use != '4')
                     if (sql.toUpperCase().includes('CREATE DATABASE')){
                           //remove database name in dba pool
                           await pool_close(null, db_use, DBA);
                           const json_data = {
                                 use:                     db_use,
                                 pool_id:                 '',
                                 port:                    ConfigGet(1, 'SERVICE_DB', `DB${db_use}_PORT`),
                                 host:                     ConfigGet(1, 'SERVICE_DB', `DB${db_use}_HOST`),
                                 dba:                     DBA,
                                 user:                    ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`),
                                 password:                ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_PASS`),
                                 database:                '',
                                 //db 1 + 2 parameters
                                 charset:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CHARACTERSET`),
                                 connnectionLimit:          ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`),
                                 // db 3 parameters
                                 connectionTimeoutMillis:   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`),
                                 idleTimeoutMillis:         ConfigGet(1, 'SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`),
                                 max:                       ConfigGet(1, 'SERVICE_DB', `DB${db_use}_MAX`),
                                 // db 4 parameters
                                 connectString:             ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CONNECTSTRING`),
                                 poolMin:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_MIN`),
                                 poolMax:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_MAX`),
                                 poolIncrement:             ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_INCREMENT`)
                              };
                           await pool_start(json_data);
                     }
                     else{
                        if (change_system_admin_pool == true){
                           //add database name in dba pool
                           await pool_close(null, db_use, DBA);
                           const json_data = {
                              use:                     db_use,
                              pool_id:                 '',
                              port:                    ConfigGet(1, 'SERVICE_DB', `DB${db_use}_PORT`),
                              host:                    ConfigGet(1, 'SERVICE_DB', `DB${db_use}_HOST`),
                              dba:                     DBA,
                              user:                    ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`),
                              password:                ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_PASS`),
                              database:                ConfigGet(1, 'SERVICE_DB', `DB${db_use}_NAME`),
                              //db 1 + 2 parameters
                              charset:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CHARACTERSET`),
                              connnectionLimit:          ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`),
                              // db 3 parameters
                              connectionTimeoutMillis:   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`),
                              idleTimeoutMillis:         ConfigGet(1, 'SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`),
                              max:                       ConfigGet(1, 'SERVICE_DB', `DB${db_use}_MAX`),
                              // db 4 parameters
                              connectString:             ConfigGet(1, 'SERVICE_DB', `DB${db_use}_CONNECTSTRING`),
                              poolMin:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_MIN`),
                              poolMax:                   ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_MAX`),
                              poolIncrement:             ConfigGet(1, 'SERVICE_DB', `DB${db_use}_POOL_INCREMENT`)
                           };
                           await pool_start(json_data);
                           //change to database value for the rest of the function
                           change_system_admin_pool = false;
                        }
                     }
                  await install_db_execute_statement(app_id, sql, {});
                  if (Object.prototype.hasOwnProperty.call(install_row, 'optional')==true && install_row.optional==optional)
                     count_statements_optional += 1;
                  else
                     count_statements += 1;
               }
            }  
         }
         if (install_json.users)
            for (const users_row of install_json.users.filter((row) => row.db == ConfigGet(1, 'SERVICE_DB', 'USE') || row.db == null)){
               switch (file[0]){
                  case 1:{
                        if (users_row.sql.includes(password_tag)){
                           const sql_and_pw = sql_with_password('app_admin', users_row.sql);
                           users_row.sql = sql_and_pw[0];
                        }   
                     break;
                  }
                  default:{
                     if (users_row.sql.includes(password_tag)){
                        const sql_and_pw = sql_with_password('app' + file[2], users_row.sql);
                        users_row.sql = sql_and_pw[0];
                        await install_db_execute_statement(
                           app_id, 
                           `UPDATE ${db_schema()}.app_parameter 
                                 SET parameter_value = :password
                              WHERE app_id = :app_id
                                 AND parameter_name = :parameter_name`, 
                           {	
                              app_id: file[2],
                              password: sql_and_pw[1],
                              parameter_name: 'SERVICE_DB_APP_PASSWORD'
                           });            
                        count_statements += 1;
                     }
                     break;
                  }
               }
               await install_db_execute_statement(app_id, users_row.sql, {});
               count_statements += 1;
            }
      }
      install_result.push({'SQL': count_statements});
      install_result.push({'SQL optional': count_statements_optional});
      install_result.push({'finished': new Date().toISOString()});
      return callBack(null, {'info': install_result});
   } 
      catch (error) {
            return callBack(error, null);
   }
};
const install_db_check = async (app_id, callBack)=> {
   const {db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
   try {
      await install_db_execute_statement(
         app_id, 
         `SELECT 1 FROM ${db_schema()}.app
            WHERE id = :app_id`, 
         {app_id: app_id});
         return callBack(null, {'installed': 1});
   } catch (error) {
      return callBack(null, {'installed': 0});
   }
};
const install_db_delete = async (app_id, callBack)=> {
   const {pool_close, pool_start} = await import(`file://${process.cwd()}/server/db/db.service.js`);
   let count_statements = 0;
   const count_statements_fail = 0;
   const fs = await import('node:fs');
   const files = await install_db_get_files('uninstall');
   const db_use = ConfigGet(1, 'SERVICE_DB', 'USE');
   try {
      for (const file of  files){
         let uninstall_sql = await fs.promises.readFile(`${process.cwd()}${file[1]}`, 'utf8');
         uninstall_sql = JSON.parse(uninstall_sql).uninstall.filter((row) => row.db == ConfigGet(1, 'SERVICE_DB', 'USE'));
         for (const sql_row of uninstall_sql){
            if (db_use=='3')
               if (sql_row.sql.toUpperCase().includes('DROP DATABASE')){
                  //add database name in dba pool
                  await pool_close(null, db_use, DBA);
                  const json_data = {
                     use:                     db_use,
                     pool_id:                 '',
                     port:                    ConfigGet(1, 'SERVICE_DB', `DB${db_use}_PORT`),
                     ost:                     ConfigGet(1, 'SERVICE_DB', `DB${db_use}_HOST`),
                     dba:                     DBA,
                     user:                    ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`),
                     password:                ConfigGet(1, 'SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_PASS`),
                     database:                '',
                     connectionTimeoutMillis: ConfigGet(1, 'SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`),
                     idleTimeoutMillis:       ConfigGet(1, 'SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`),
                     max:                     ConfigGet(1, 'SERVICE_DB', `DB${db_use}_MAX`)
                  };
                  await pool_start(json_data);
               }
               await install_db_execute_statement(app_id, sql_row.sql, {});   
            count_statements += 1;
         }      
         /*update parameters in config.json
               DB[USE]_SYSTEM_ADMIN_USER = null
               DB[USE]_SYSTEM_ADMIN_PASS = null
               DB[USE]_APP_ADMIN_USER = null
               DB[USE]_APP_ADMIN_PASS = null
         */
      }
      return callBack(null, {'info':[{'count'     : count_statements},
                                    {'count_fail': count_statements_fail}
                                    ]});
   } 
   catch (error) {
         return callBack(error, null);
   }
};
export{DBStart, 
       DBInfo, DBInfoSpace, DBInfoSpaceSum,
       demo_add, demo_get, demo_delete, 
       install_db, install_db_check, install_db_delete};