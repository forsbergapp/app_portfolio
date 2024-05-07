/** @module server/dbapi/object/database */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/database.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const {ConfigGet, ConfigGetApp, ConfigGetApps} = await import(`file://${process.cwd()}/server/config.service.js`);
const DBA=1;
/**
 * 
 * @param {number} app_id
 */
const Info = (app_id) => service.Info(app_id, DBA);
/**
 * 
 * @param {number} app_id
 */
const InfoSpace = (app_id) =>service.InfoSpace(app_id, DBA);
/**
 * 
 * @param {number} app_id
 */
const InfoSpaceSum = (app_id) =>service.InfoSpaceSum(app_id, DBA);

/**
  * Install get files
  * @param {'install'|'uninstall'} json_type 
  * @returns {Promise.<Types.database_script_files>}
  */
const install_db_get_files = async (json_type) =>{
    const fs = await import('node:fs');
    let app_id = 1;
    /**@type{Types.database_script_files} */
    const files = [
       //add main script with id 0 and without app_id
       [0, `/scripts/${json_type}_database.json`, null],
       //add admin script with id 1 and without app_id
       [1, `/apps/admin/scripts/${json_type}_database.json`, null]
    ];
    //Loop file directories /apps/app + id until not found anymore and return files found
    while (true){
       try {
          await fs.promises.access(`${process.cwd()}/apps/app${app_id}/scripts/${json_type}_database.json`);   
          //add app script, first index not used for apps, save app id instead
          files.push([null, `/apps/app${app_id}/scripts/${json_type}_database.json`, app_id]);
          app_id += 1; 
       } catch (error) {
          return files;
       }
    }
 };
/**
 * Install db
 * @param {number}      app_id 
 * @param {*}           query
 */
 const Install = async (app_id, query)=> {
    const {db_execute} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
    const {CreateRandomString, ConfigAppSecretUpdate} = await import(`file://${process.cwd()}/server/config.service.js`);
    const {pool_close, pool_start} = await import(`file://${process.cwd()}/server/db/db.service.js`);
    const {LogServerI} = await import(`file://${process.cwd()}/server/log.service.js`);
    const {SocketSendSystemAdmin} = await import(`file://${process.cwd()}/server/socket.service.js`);
    const {createHash} = await import('node:crypto');
    const { default: {genSalt, hash} } = await import('bcrypt');
    const fs = await import('node:fs');
    let count_statements = 0;
    let count_statements_optional = 0;
    const install_result = [];
    const password_tag = '<APP_PASSWORD/>';
    let change_system_admin_pool=true;
    const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
    install_result.push({'start': new Date().toISOString()});
    /**
     * 
     * @param {string} username 
     * @param {string} sql 
     * @returns [string,string]
     */
    const sql_with_password = async (username, sql) =>{
       let password;
       //USER_ACCOUNT uses bcrypt, save as bcrypt but return sha256 password
       //Database users use SHA256
       password = createHash('sha256').update(CreateRandomString()).digest('hex');
       if (db_use==4){
          // max 30 characters for passwords and without double quotes
          // also fix ORA-28219: password verification failed for mandatory profile
          // ! + random A-Z character
          const random_characters = '!' + String.fromCharCode(0|Math.random()*26+97).toUpperCase();
          password = password.substring(0,28) + random_characters;
          //use singlequote for INSERT, else doublequote for CREATE USER
          if (sql.toUpperCase().includes('INSERT INTO'))
             sql = sql.replace(password_tag, `'${await hash(password, await genSalt(10))}'`);
          else
             sql = sql.replace(password_tag, `"${password}"`);
       }   
       else
          if (sql.toUpperCase().includes('INSERT INTO'))
             sql = sql.replace(password_tag, `'${await hash(password, await genSalt(10))}'`);
          else
             sql = sql.replace(password_tag, `'${password}'`);
       sql = sql.replace('<APP_USERNAME/>', username);
       install_result.push({[`${username}`]: password});         
       return [sql, password];
    };
    const files = await install_db_get_files('install');
    let install_count = 0;
    for (const file of files){
        SocketSendSystemAdmin(app_id, getNumberValue(query.get('client_id')), null, 'PROGRESS', btoa(JSON.stringify({part:install_count, total:files.length, text:file[1]})));
        install_count++;
        const install_json = await fs.promises.readFile(`${process.cwd()}${file[1]}`, 'utf8');
        const install_obj = JSON.parse(install_json);
        //filter for current database or for all databases and optional rows
        install_obj.install = install_obj.install.filter((/**@type{Types.install_database_script|Types.install_database_app_script}*/row) =>  
            row.db == db_use || row.db == null);
        
        for (const install_row of install_obj.install){
            if (install_row.optional && install_row.optional != getNumberValue(query.get('optional')))
                null;
            else{
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
                //remove comments
                //rows starting with '--' and ends width '\r\n'
                const sql_split = '\r\n';
                install_sql = install_sql.split(sql_split).filter(row=>!row.startsWith('--')).join(sql_split);
                //split script file into separate sql statements
                for (let sql of install_sql.split(';')){
                    if (sql.startsWith(sql_split))
                        sql = sql.substring(2);
                    if (sql.length>0){
                        if (file[0] == 0 && sql.includes(password_tag)){
                            let sql_and_pw;
                            if (sql.toUpperCase().includes('INSERT INTO'))
                                sql_and_pw = await sql_with_password('superadmin', sql);
                            else
                                sql_and_pw = await sql_with_password('app_portfolio', sql);
                            sql = sql_and_pw[0];
                        }
                        sql = sql.replaceAll('<APP_ID/>', file[2]?file[2].toString():'0');
                            
                        //if ; must be in wrong place then set tag in import script and convert it
                        if (sql.includes('<SEMICOLON/>'))
                            sql = sql.replace('<SEMICOLON/>', ';');
                        //close and start pool when creating database, some modules dont like database name when creating database
                        //exclude db 4
                        if (db_use != 4)
                            if (sql.toUpperCase().includes('CREATE DATABASE')){
                                //remove database name in dba pool
                                await pool_close(null, db_use, DBA);
                                /**@type{Types.db_pool_parameters} */
                                const json_data = {
                                        use:                       db_use,
                                        pool_id:                   null,
                                        port:                      getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_PORT`)),
                                        host:                      ConfigGet('SERVICE_DB', `DB${db_use}_HOST`),
                                        dba:                       DBA,
                                        user:                      ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`),
                                        password:                  ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_PASS`),
                                        database:                  null,
                                        //db 1 + 2 parameters
                                        charset:                   ConfigGet('SERVICE_DB', `DB${db_use}_CHARACTERSET`),
                                        connectionLimit:           getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`)),
                                        // db 3 parameters
                                        connectionTimeoutMillis:   getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`)),
                                        idleTimeoutMillis:         getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`)),
                                        max:                       getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_MAX`)),
                                        // db 4 parameters not used here
                                        connectString:             null,
                                        poolMin:                   null,
                                        poolMax:                   null,
                                        poolIncrement:             null
                                    };
                                await pool_start(json_data);
                            }
                            else{
                                if (change_system_admin_pool == true){
                                //add database name in dba pool
                                await pool_close(null, db_use, DBA);
                                /**@type{Types.db_pool_parameters} */
                                const json_data = {
                                    use:                       db_use,
                                    pool_id:                   null,
                                    port:                      getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_PORT`)),
                                    host:                      ConfigGet('SERVICE_DB', `DB${db_use}_HOST`),
                                    dba:                       DBA,
                                    user:                      ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`),
                                    password:                  ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_PASS`),
                                    database:                  ConfigGet('SERVICE_DB', `DB${db_use}_NAME`),
                                    //db 1 + 2 parameters
                                    charset:                   ConfigGet('SERVICE_DB', `DB${db_use}_CHARACTERSET`),
                                    connectionLimit:           getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`)),
                                    // db 3 parameters
                                    connectionTimeoutMillis:   getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`)),
                                    idleTimeoutMillis:         getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`)),
                                    max:                       getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_MAX`)),
                                    // db 4 parameters not used here
                                    connectString:             null,
                                    poolMin:                   null,
                                    poolMax:                   null,
                                    poolIncrement:             null
                                };
                                await pool_start(json_data);
                                //change to database value for the rest of the function
                                change_system_admin_pool = false;
                                }
                            }
                        await db_execute(app_id, sql, {}, DBA);
                        if (('optional' in install_row)==true && install_row.optional==getNumberValue(query.get('optional')))
                            count_statements_optional += 1;
                        else
                            count_statements += 1;
                    }
                }  
            }
        }
        if (install_obj.users){
            let sql_and_pw = null;
            for (const users_row of install_obj.users.filter((/**@type{Types.install_database_app_user_script}*/row) => row.db == db_use || row.db == null)){
                switch (file[0]){
                    case 1:{
                        const app_admin_username = 'app_portfolio_app_admin';
                        if (users_row.sql.includes(password_tag)){
                            sql_and_pw = await sql_with_password(app_admin_username, users_row.sql);
                            users_row.sql = sql_and_pw[0];
                            await ConfigAppSecretUpdate(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                            {   app_id:             getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
                                                                parameter_name:     `SERVICE_DB_DB${db_use}_APP_USER`,
                                                                parameter_value:    app_admin_username});
                            await ConfigAppSecretUpdate(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                            {   app_id:             getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
                                                                parameter_name:     `SERVICE_DB_DB${db_use}_APP_PASSWORD`,
                                                                parameter_value:    sql_and_pw[1]});
                        }
                        users_row.sql = users_row.sql.replace('<APP_USERNAME/>', app_admin_username);
                        break;
                    }
                    default:{
                        const app_username = 'app_portfolio_app' + file[2];
                        if (users_row.sql.includes(password_tag)){
                            sql_and_pw = await sql_with_password(app_username, users_row.sql);
                            users_row.sql = sql_and_pw[0];
                            await ConfigAppSecretUpdate(file[2], {app_id:             file[2],
                                                            parameter_name:     `SERVICE_DB_DB${db_use}_APP_USER`,
                                                            parameter_value:    app_username});
                            await ConfigAppSecretUpdate(file[2], {app_id:             file[2],
                                                            parameter_name:     `SERVICE_DB_DB${db_use}_APP_PASSWORD`,
                                                            parameter_value:    sql_and_pw[1]});
                        }
                        users_row.sql = users_row.sql.replaceAll('<APP_ID/>', file[2]);
                        users_row.sql = users_row.sql.replace('<APP_USERNAME/>', app_username);
                        break;
                    }
                }
                await db_execute(app_id, users_row.sql, {}, DBA);
                count_statements += 1;
            }
        }   
    }
    install_result.push({'SQL': count_statements});
    install_result.push({'SQL optional': count_statements_optional});
    install_result.push({'finished': new Date().toISOString()});
    LogServerI(`Database install result: ${install_result.reduce((result, current)=> result += `${Object.keys(current)[0]}:${Object.values(current)[0]} `, '')}`);
    return {'info': install_result};
 };
 /**
  * Install db check
  * @param {number} app_id
  */
 const InstalledCheck = async (app_id)=>{
    return service.InstalledCheck(app_id, DBA)
    .catch(()=>{
        return [{installed: 0}];
    });
 }; 
 /**
  * Uninstall database installation
  * @param {number} app_id
  * @param {*} query
  */
 const Uninstall = async (app_id, query)=> {
    const {db_execute} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
    const {ConfigAppSecretDBReset} = await import(`file://${process.cwd()}/server/config.service.js`);
    const {pool_close, pool_start} = await import(`file://${process.cwd()}/server/db/db.service.js`);
    const {LogServerI} = await import(`file://${process.cwd()}/server/log.service.js`);
    const {SocketSendSystemAdmin} = await import(`file://${process.cwd()}/server/socket.service.js`);
    let count_statements = 0;
    let count_statements_fail = 0;
    const fs = await import('node:fs');
    const files = await install_db_get_files('uninstall');
    const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
    let install_count=0;
    for (const file of  files){
        SocketSendSystemAdmin(app_id, getNumberValue(query.get('client_id')), null, 'PROGRESS', btoa(JSON.stringify({part:install_count, total:files.length, text:file[1]})));
        install_count++;
        const uninstall_sql_file = await fs.promises.readFile(`${process.cwd()}${file[1]}`, 'utf8');
        const uninstall_sql = JSON.parse(uninstall_sql_file).uninstall.filter((/**@type{Types.uninstall_database_script|Types.uninstall_database_app_script}*/row) => row.db == db_use);
        for (const sql_row of uninstall_sql){
            if (db_use==3 && sql_row.sql.toUpperCase().includes('DROP DATABASE')){
                //add database name in dba pool
                await pool_close(null, db_use, DBA);
                /**@type{Types.db_pool_parameters} */
                const json_data = {
                    use:                       db_use,
                    pool_id:                   null,
                    port:                      getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_PORT`)),
                    host:                      ConfigGet('SERVICE_DB', `DB${db_use}_HOST`),
                    dba:                       DBA,
                    user:                      ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`),
                    password:                  ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_PASS`),
                    database:                  null,
                    //db 1 + 2 not used here
                    charset:                   null,
                    connectionLimit:           null,
                    //db 3
                    connectionTimeoutMillis:   getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`)),
                    idleTimeoutMillis:         getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`)),
                    max:                       getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_MAX`)),
                    //db 4 not used here
                    connectString:             null,
                    poolMin:                   null,
                    poolMax:                   null,
                    poolIncrement:             null
                };
                await pool_start(json_data);
            }
            if (file[2]==null)
                sql_row.sql = sql_row.sql.replace('<APP_USERNAME/>', 'app_portfolio_app_admin');
            else
                sql_row.sql = sql_row.sql.replace('<APP_USERNAME/>', 'app_portfolio_app' + file[2]);
            sql_row.sql = sql_row.sql.replaceAll('<APP_ID/>', file[2]?file[2]:'0');
            await db_execute(app_id, sql_row.sql, {}, DBA)
            .then(()=>{count_statements += 1;})
            .catch(()=>{count_statements_fail += 1;});
            
        }      
    }
    //remove db users and password in apps.json
    ConfigAppSecretDBReset(app_id);
    LogServerI(`Database uninstall result db ${db_use}: count: ${count_statements}, count_fail: ${count_statements_fail}`);
    return {'info':[  { count    : count_statements},
                        {count_fail: count_statements_fail}
                    ]};
};
/**
 * Install demo users with user settings from /scripts/demo/demo.json
 * and reading images in /scripts/demo/demo*.webp
 * @param {number} app_id
 * @param {*} query
 * @param {*} data
 */
 const DemoInstall = async (app_id, query, data)=> {
    const {getAppsAdminId} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app.service.js`);
    const {create} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`);
    const {createUserAccountApp} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app.service.js`);
    const user_account_like = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_like.service.js`);
    const {insertUserAccountView} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_view.service.js`);
    const user_account_follow = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_follow.service.js`);
    const {createUserPost, getUserPostsByUserId} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_data_post.service.js`);
    const user_account_app_data_post_like = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_data_post_like.service.js`);
    const {insertUserPostView} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_data_post_view.service.js`);
    const {SocketSendAdmin} = await import(`file://${process.cwd()}/server/socket.service.js`);
    const {LogServerI} = await import(`file://${process.cwd()}/server/log.service.js`);
    const fs = await import('node:fs');
    const install_result = [];
    install_result.push({'start': new Date().toISOString()});
    const fileBuffer = await fs.promises.readFile(`${process.cwd()}/scripts/demo/demo.json`, 'utf8');
    /**@type{[Types.demo_user]}*/
    const demo_users = JSON.parse(fileBuffer.toString()).demo_users;
    //create social records
    const social_types = ['LIKE', 'VIEW', 'VIEW_ANONYMOUS', 'FOLLOWER', 'POSTS_LIKE', 'POSTS_VIEW', 'POSTS_VIEW_ANONYMOUS'];
    let email_index = 1000;
    let records_user_account = 0;
    let records_user_account_app = 0;
    let records_user_account_app_data_post = 0;
    let install_count=0;
    const install_total_count = demo_users.length + social_types.length;
    install_count++;
    /**
     * Create demo users
     * @param {[Types.demo_user]} demo_users 
     * @returns {Promise.<null>}
     */
    const create_users = async (demo_users) =>{
        return await new Promise((resolve, reject)=>{
            const create_update_id = (/**@type{Types.demo_user}*/demo_user)=>{
            /**@type{Types.db_parameter_user_account_create}*/
                const data_create = {   username:               demo_user.username,
                                        bio:                    demo_user.bio,
                                        avatar:                 demo_user.avatar,
                                        password:               null,
                                        password_new:           data.demo_password,
                                        password_reminder:      null,
                                        email:                  `demo${++email_index}@localhost`,
                                        email_unverified:       null,
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
                                        provider_email:         null,
                                        admin:                  1
                                    };
                create(app_id, data_create)
            .then((/**@type{Types.db_result_insert}*/result_create)=> {
                demo_user.id = result_create.insertId;
                records_user_account++;
                if (records_user_account == demo_users.length)
                    resolve(null);
            })
            .catch((/**@type{Types.error}*/err)=> {
                reject(err);
            });
            };
            for (const demo_user of demo_users){
                create_update_id(demo_user);
            }
        });
    };
    /**
     * Create user account app
     * @param {number} app_id 
     * @param {number|undefined} user_account_id 
     * @returns {Promise.<null>}
     */
    const create_user_account_app = async (app_id, user_account_id) =>{
        return new Promise((resolve, reject) => {
            createUserAccountApp(app_id, user_account_id)
            .then((/**@type{Types.db_result_user_account_app_createUserAccountApp}*/result)=>{
                if (result.affectedRows == 1)
                    records_user_account_app++;
                resolve(null);
            })
            .catch((/**@type{Types.error}*/error)=>{
                reject(error);
            });
        });
    };
    /**
     * Create user post
     * @param {number} user_account_post_app_id 
     * @param {object} data 
     * @returns {Promise.<null>}
     */
    const create_user_post = async (user_account_post_app_id, data) => {
        return new Promise((resolve, reject) => {
            createUserPost(user_account_post_app_id, data)
            .then((/**@type{Types.db_result_user_account_app_data_post_createUserPost}*/result)=>{
                if (result.affectedRows == 1)
                            records_user_account_app_data_post++;
                        resolve(null);
            })
            .catch((/**@type{Types.error}*/error)=>{
                reject(error);
            });
        });
    };
    //create all users first and update with id
    await create_users(demo_users);
    const apps = await getAppsAdminId(app_id);
    //create user posts
    for (const demo_user of demo_users){
        SocketSendAdmin(app_id, getNumberValue(query.get('client_id')), null, 'PROGRESS', btoa(JSON.stringify({part:install_count, total:install_total_count, text:demo_user.username})));
        install_count++;
        //create user_account_app record for all apps
        for (const app of apps){
            await create_user_account_app(app.id, demo_user.id);
        }
        for (const demo_user_account_app_data_post of demo_user.settings){
            let settings_header_image;
            //use file in settings or if missing then use filename same as demo username
            if (demo_user_account_app_data_post.image_header_image_img)
                settings_header_image = `${demo_user_account_app_data_post.image_header_image_img}.webp`;
            else
                settings_header_image = `${demo_user.username}.webp`;
            /**@type{Buffer} */
            const image = await fs.promises.readFile(`${process.cwd()}/scripts/demo/${settings_header_image}`);
            /**@ts-ignore */
            const image_string = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
            //update settings with loaded image into BASE64 format
            demo_user_account_app_data_post.image_header_image_img = image_string;
            //use random day and month themes
            //day 10001-10010
            demo_user_account_app_data_post.design_theme_day_id = Math.floor(10001 + Math.random() * 10);
            //month 20001-20022
            demo_user_account_app_data_post.design_theme_month_id = Math.floor(20001 + Math.random() * 22);
            demo_user_account_app_data_post.design_theme_year_id = 30001;
            const settings_no_app_id = JSON.parse(JSON.stringify(demo_user_account_app_data_post));
            delete settings_no_app_id.app_id;
            const json_data_user_account_app_data_post = {
                                            description: demo_user_account_app_data_post.description,
                                            json_data: settings_no_app_id,
                                            user_account_id: demo_user.id
                                        };	
            await create_user_post(demo_user_account_app_data_post.app_id, json_data_user_account_app_data_post);
        }
    }
    let records_user_account_like = 0;
    let records_user_account_view = 0;
    let records_user_account_follow = 0;
    let records_user_account_app_data_post_like = 0;
    let records_user_account_app_data_post_view = 0;
    
    /**
     * Create like user
     * @param {number} app_id 
     * @param {number} id 
     * @param {number} id_like 
     * @returns {Promise.<null>}
     */
    const create_likeuser = async (app_id, id, id_like ) =>{
        return new Promise((resolve, reject) => {
            user_account_like.like(app_id, id, id_like)
            .then((/**@type{Types.db_result_user_account_like_like}*/result) => {
                if (result.affectedRows == 1)
                    records_user_account_like++;
                resolve(null);
            })
            .catch((/**@type{Types.error}*/error)=>{
                reject(error);
            });
        });
    };
    /**
     * Create user account view
     * @param {number} app_id 
     * @param {Types.db_parameter_user_account_view_insertUserAccountView} data 
     * @returns {Promise.<null>}
     */
    const create_user_account_view = async (app_id, data ) =>{
        return new Promise((resolve, reject) => {
            insertUserAccountView(app_id, data)
            .then((/**@type{Types.db_result_user_account_view_insertUserAccountView}*/result) => {
                if (result.affectedRows == 1)
                        records_user_account_view++;
                resolve(null);
            })
            .catch((/**@type{Types.error}*/error)=>{
                reject(error);
            });
        });
    };
    /**
     * Create user acccount follow
     * @param {number} app_id 
     * @param {number} id 
     * @param {number} id_follow 
     * @returns {Promise.<null>}
     */
    const create_user_account_follow = async (app_id, id, id_follow ) =>{
        return new Promise((resolve, reject) => {
            user_account_follow.follow(app_id, id, id_follow)
            .then((/**@type{Types.db_result_user_account_follow_follow}*/result)=>{
                if (result.affectedRows == 1)
                    records_user_account_follow++;
                resolve(null);
            })
            .catch((/**@type{Types.error}*/error)=>{
                reject(error);
            });
        });
    };
    /**
     * Create user account app setting like
     * @param {number} app_id 
     * @param {number} user1 
     * @param {number} user2 
     * @returns {Promise.<null>}
     */
    const create_user_account_app_data_post_like = async (app_id, user1, user2 ) =>{
        return new Promise((resolve, reject) => {
            getUserPostsByUserId(app_id, user1)
            .then((/**@type{Types.db_result_user_account_app_data_post_getUserPostsByUserId[]}*/result_posts)=>{
                const random_posts_index = Math.floor(1 + Math.random() * result_posts.length - 1 );
                user_account_app_data_post_like.like(app_id, user2, result_posts[random_posts_index].id)
                .then((/**@type{Types.db_result_user_account_app_data_post_like_like}*/result) => {
                    if (result.affectedRows == 1)
                        records_user_account_app_data_post_like++;
                    resolve(null);
                })
                .catch((/**@type{Types.error}*/error)=>{
                    reject(error);
                });
            })
            .catch((/**@type{Types.error}*/error)=>{
                reject(error);
            });
        });
    };
    /**
     * Create user account app setting view
     * @param {number} app_id 
     * @param {number} user1 
     * @param {number} user2 
     * @param {string} social_type 
     * @returns {Promise.<null>}
     */
    const create_user_account_app_data_post_view = async (app_id, user1, user2 , social_type) =>{
        return new Promise((resolve, reject) => {
            getUserPostsByUserId(app_id, user1)
            .then((/**@type{Types.db_result_user_account_app_data_post_getUserPostsByUserId[]}*/result_posts)=>{
                //choose random post from user
                        const random_index = Math.floor(1 + Math.random() * result_posts.length -1);
                        let user_account_id;
                        if (social_type == 'POSTS_VIEW')
                            user_account_id = user2;
                        else
                            user_account_id = null;
                        insertUserPostView(app_id, {  user_account_id: user_account_id,
                                                    user_account_app_data_post_id: result_posts[random_index].id,
                                                    client_ip: null,
                                                    client_user_agent: null,
                                                    client_longitude: null,
                                                    client_latitude: null
                                                            })
                    .then((/**@type{Types.db_result_user_account_app_data_post_view_insertUserPostView}*/result)=>{
                        if (result.affectedRows == 1)
                                records_user_account_app_data_post_view++;
                            resolve(null);
                    })
                    .catch((/**@type{Types.error}*/error)=>{
                        reject(error);
                    });
            })
            .catch((/**@type{Types.error}*/error)=>{
                reject(error);
            });
        });
    };
    for (const social_type of social_types){
        SocketSendAdmin(app_id, getNumberValue(query.get('client_id')), null, 'PROGRESS', btoa(JSON.stringify({part:install_count, total:install_total_count, text:social_type})));
        install_count++;
        //select new random sample for each social type
        /**@type{[number]|[]} */
        const random_users1 = [];
        /**@type{[number]|[]} */
        const random_users2 = [];
        //loop until two groups both have 50% samples with unique users in each sample
        const sample_amount = Math.floor(demo_users.length * 0.5);
        while (random_users1.length < sample_amount || random_users2.length < sample_amount){
            const random_array_index1 = Math.floor(1 + Math.random() * demo_users.length - 1 );
            const random_array_index2 = Math.floor(1 + Math.random() * demo_users.length - 1 );
        const random_include_id1 = demo_users[random_array_index1].id;
        /**@ts-ignore */
            if (random_users1.length <sample_amount && !random_users1.includes(random_include_id1) ){
            /**@ts-ignore */
            random_users1.push(demo_users[random_array_index1].id);
        }
        /**@ts-ignore */
            if (random_users2.length <sample_amount && !random_users2.includes(demo_users[random_array_index2].id)){
            /**@ts-ignore */
            random_users2.push(demo_users[random_array_index2].id);
        }
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
                    case 'POSTS_LIKE':{
                        //pick a random user setting from the user and return the app_id
                        const user_account_app_data_posts = demo_users.filter(user=>user.id == user1)[0].settings;
                        const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].app_id;
                        await create_user_account_app_data_post_like(settings_app_id, user1, user2);
                        break;
                    }
                    case 'POSTS_VIEW':
                    case 'POSTS_VIEW_ANONYMOUS':{
                        //pick a random user setting from the user and return the app_id
                        const user_account_app_data_posts = demo_users.filter(user=>user.id == user1)[0].settings;
                        const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].app_id;
                        await create_user_account_app_data_post_view(settings_app_id, user1, user2 , social_type) ;
                        break;
                    }
                }						
            }
        }
    }
    install_result.push({'user_account': records_user_account});
    install_result.push({'user_account_app': records_user_account_app});
    install_result.push({'user_account_like': records_user_account_like});
    install_result.push({'user_account_view': records_user_account_view});
    install_result.push({'user_account_follow': records_user_account_follow});
    install_result.push({'user_account_app_data_post': records_user_account_app_data_post});
    install_result.push({'user_account_app_data_post_like': records_user_account_app_data_post_like});
    install_result.push({'user_account_app_data_post_view': records_user_account_app_data_post_view});
    install_result.push({'finished': new Date().toISOString()});
    LogServerI(`Demo install result: ${install_result.reduce((result, current)=> result += `${Object.keys(current)[0]}:${Object.values(current)[0]} `, '')}`);
    return {'info': install_result};
};
/**
 * Demo uninstall
 * @param {number} app_id
 * @param {*} query
 */
const DemoUninstall = async (app_id, query)=> {
    const {SocketSendSystemAdmin} = await import(`file://${process.cwd()}/server/socket.service.js`);
    const {LogServerI} = await import(`file://${process.cwd()}/server/log.service.js`);
	const {getDemousers, deleteUser} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`);
    return new Promise((resolve, reject)=>{
        getDemousers(app_id)
        .then((/**@type{Types.db_result_user_account_getDemousers[]}*/result_demo_users) =>{
            let deleted_user = 0;
            if (result_demo_users.length>0){
                const delete_users = async () => {
                    for (const user of result_demo_users){
                        SocketSendSystemAdmin(app_id, getNumberValue(query.get('client_id')), null, 'PROGRESS', btoa(JSON.stringify({part:deleted_user, total:result_demo_users.length, text:user.username})));
                        await deleteUser(app_id, user.id)
                        .then(()=>{
                            deleted_user++;
                            if (deleted_user == result_demo_users.length)
                                return null;
                        })
                        .catch((/**@type{Types.error}*/error)=>{
                            throw error;
                        });
                    }
                };
                delete_users()
                .then(()=>{
                    LogServerI(`Demo uninstall count: ${deleted_user}`);
                    resolve({'info': [{'count': deleted_user}]});
                })
                .catch((/**@type{Types.error}*/error)=>{
                    reject(error);
                });
            }
            else{
                LogServerI(`Demo uninstall count: ${result_demo_users.length}`);
                resolve({'info': [{'count': result_demo_users.length}]});
            }
        })
        .catch((/**@type{Types.error}*/error)=>{
            reject(error);
        });
    });
    
};

/**
 * Starts pool with parameters
 * @param {number} db_use 
 * @param {number} dba 
 * @param {string} user 
 * @param {string} password 
 * @param {number|null} pool_id 
 * @returns {Promise.<null>}
 */
 const pool_db = async (db_use, dba, user, password, pool_id) =>{
    const {pool_start} = await import(`file://${process.cwd()}/server/db/db.service.js`);
    const {LogServerI, LogServerE} = await import(`file://${process.cwd()}/server/log.service.js`);
    return new Promise ((resolve, reject)=>{
       /**@type{Types.db_pool_parameters} */
       const dbparameters = {
          use:                       db_use,
          pool_id:                   pool_id,
          host:                      ConfigGet('SERVICE_DB', `DB${db_use}_HOST`),
          port:                      getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_PORT`)),
          dba:                       dba,
          user:                      user,
          password:                  password,
          database:                  ConfigGet('SERVICE_DB', `DB${db_use}_NAME`),
          //db 1 + 2 parameters
          charset:                   ConfigGet('SERVICE_DB', `DB${db_use}_CHARACTERSET`),
          connectionLimit:           getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`)),
          // db 3 parameters
          connectionTimeoutMillis:   getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`)),
          idleTimeoutMillis:         getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`)),
          max:                       getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_MAX`)),
          // db 4 parameters
          connectString:             ConfigGet('SERVICE_DB', `DB${db_use}_CONNECTSTRING`),
          poolMin:                   getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_POOL_MIN`)),
          poolMax:                   getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_POOL_MAX`)),
          poolIncrement:             getNumberValue(ConfigGet('SERVICE_DB', `DB${db_use}_POOL_INCREMENT`))
       };
       pool_start(dbparameters)
       .then((/**@type{null}*/result)=>{
          LogServerI(`Started pool ${dbparameters.pool_id}, db ${dbparameters.use}, host ${dbparameters.host}, port ${dbparameters.port}, dba ${dbparameters.dba}, user ${dbparameters.user}, database ${dbparameters.database}`);
          resolve(result);
       })
       .catch((/**@type{Types.error}*/error)=>{
          LogServerE('Starting pool error: ' + error);
          reject(error);
       });
    });
 };
 /**
  * Start pools for database used
  */
 const Start = async () => {
    if (ConfigGet('SERVICE_DB', 'START')=='1'){    
       let user;
       let password;
       let dba = 0;
       const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
       
       if (ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`)){
          user = `${ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_USER`)}`;
          password = `${ConfigGet('SERVICE_DB', `DB${db_use}_SYSTEM_ADMIN_PASS`)}`;
          dba = 1;
          await pool_db(db_use, dba, user, password, null);
        }
        dba = 0;
        for (const app  of ConfigGetApps()){
            if (ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                app.APP_ID, 'SECRETS')[`SERVICE_DB_DB${db_use}_APP_USER`])
               await pool_db(   db_use, 
                                dba, 
                                ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                app.APP_ID, 'SECRETS')[`SERVICE_DB_DB${db_use}_APP_USER`], 
                                ConfigGetApp(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
                                                app.APP_ID, 'SECRETS')[`SERVICE_DB_DB${db_use}_APP_PASSWORD`], 
                                app.APP_ID);
       }  
    }
 };
export{Info, InfoSpace, InfoSpaceSum, Install, InstalledCheck, Uninstall, DemoInstall, DemoUninstall, Start};