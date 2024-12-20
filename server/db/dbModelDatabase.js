/** @module server/db/dbModelDatabase */

/**
 * @import {server_db_file_app_secret,
 *          server_db_sql_parameter_user_account_view_insertUserAccountView,
 *          server_db_sql_parameter_user_account_app_data_post_createUserPost, server_server_error, 
 *          server_db_sql_parameter_user_account_create, server_db_database_demo_user,
 *          server_db_database_uninstall_database_script,server_db_database_uninstall_database_app_script,
 *          server_db_database_install_uninstall_result, server_db_database_install_db_check,
 *          server_db_database_install_database_app_user_script, server_db_db_pool_parameters,
 *          server_db_database_install_database_app_script, server_db_database_install_database_script, 
 *          server_db_database_install_result, server_db_database_script_files, 
 *          server_db_sql_result_admin_DBInfoSpaceSum, server_db_sql_result_admin_DBInfoSpace, server_db_sql_result_admin_DBInfo} from '../types.js'
 */

/**@type{import('./dbSqlDatabase.js')} */
const dbSqlDatabase = await import(`file://${process.cwd()}/server/db/dbSqlDatabase.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

const DBA                       = 1;
const DB_DEMO_PATH              = '/server/install/db/demo/';
const DB_DEMO_FILE              = 'demo.json';

const DB_INSTALL_PATH           = '/server/install/db/';
const DB_INSTALL                = 'install_database.json';
const DB_UNINSTALL              = 'uninstall_database.json';

const DB_ADMIN_INSTALL_PATH     = '/apps/admin/scripts/';
const DB_ADMIN_INSTALL          = 'install_database.json';
const DB_ADMIN_UNINSTALL        = 'uninstall_database.json';

const DB_APP_PATH               = '/apps/app';
//each app should be installed in /apps[appid] and have these files:
const DB_APP_INSTALL_PATH       = '/scripts/';
const DB_APP_INSTALL            = 'install_database.json';
const DB_APP_UNINSTALL          = 'uninstall_database.json';
/**
 * Database info
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_db_sql_result_admin_DBInfo[]>}
 */
const dbInfo = app_id => import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                            dbCommonExecute(app_id, 
                                            dbSqlDatabase.DATABASE_INFO_SELECT(), 
                                            {   database: serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')), 
                                                database_schema: fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`)
                                            }, 
                                            DBA, 
                                            null));
/**
 * Database info space
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_db_sql_result_admin_DBInfoSpace[]>}
 */
const dbInfoSpace = app_id =>import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                                dbCommonExecute(app_id, 
                                                dbSqlDatabase.DATABASE_INFO_SELECT_SPACE(), 
                                                serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))==5?
                                                    {}:
                                                        {db_schema: fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`)}, 
                                                DBA, 
                                                null));
/**
 * Dataabse info space sum
 * @function
 * @param {number} app_id
 * @returns {Promise.<server_db_sql_result_admin_DBInfoSpaceSum[]>}
 */
const dbInfoSpaceSum = (app_id) =>import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                                    dbCommonExecute(app_id, 
                                                    dbSqlDatabase.DATABASE_INFO_SELECT_SPACE_SUM(), 
                                                    serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))==5?
                                                        {}:
                                                            {db_schema: fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`)},
                                                    DBA, 
                                                    null));

/**
  * Database install get files
  * @function
  * @param {'install'|'uninstall'} install_type 
  * @returns {Promise.<server_db_database_script_files>}
  */
const dbInstallGetFiles = async (install_type) =>{
    const fs = await import('node:fs');
    let app_id = 1;
    /**@type{server_db_database_script_files} */
    const files = [
       //add main script with id 0 and without app_id
       [0, install_type=='install'?(DB_INSTALL_PATH + DB_INSTALL):(DB_INSTALL_PATH + DB_UNINSTALL), null],
       //add admin script with id 1 and without app_id
       [1, install_type=='install'?(DB_ADMIN_INSTALL_PATH + DB_ADMIN_INSTALL):(DB_ADMIN_INSTALL_PATH + DB_ADMIN_UNINSTALL), null]
    ];
    //Loop file directories /apps/app + id until not found anymore and return files found
    while (true){
       try {
          await fs.promises.access(`${process.cwd()}${DB_APP_PATH}${app_id}${install_type=='install'?(DB_APP_INSTALL_PATH + DB_APP_INSTALL):(DB_APP_INSTALL_PATH + DB_APP_UNINSTALL)}`);
          //add app script, first index not used for apps, save app id instead
          files.push([null, `${DB_APP_PATH}${app_id}${install_type=='install'?(DB_APP_INSTALL_PATH + DB_APP_INSTALL):(DB_APP_INSTALL_PATH + DB_APP_UNINSTALL)}`, app_id]);
          app_id += 1; 
       } catch (error) {
          return files;
       }
    }
 };
/**
 * Install db and sends server side events of progress
 * @function
 * @param {number}      app_id 
 * @param {*}           query
 * @returns {Promise.<{info: {}[]}>}
 */
 const dbInstall = async (app_id, query)=> {
    /**@type{import('./fileModelAppSecret.js')} */
    const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);
    /**@type{import('../db/db.js')} */
    const {dbPoolClose, dbPoolStart} = await import(`file://${process.cwd()}/server/db/db.js`);
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('../socket.js')} */
    const {socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('../db/common.js')} */
    const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('../security.js')} */
	const {securityPasswordCreate, securitySecretCreate}= await import(`file://${process.cwd()}/server/security.js`);
    const fs = await import('node:fs');

    let count_statements = 0;
    /**@type{server_db_database_install_result} */
    const install_result = [];
    const password_tag = '<APP_PASSWORD/>';
    let change_DBA_pool=true;
    const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
    install_result.push({'start': new Date().toISOString()});
    /**
     * @param {string} username 
     * @param {string} sql 
     * @returns [string,string]
     */
    const sql_with_password = async (username, sql) =>{
       let password;
       
       if (db_use==4){
          // max 30 characters for passwords and without double quotes
          // also fix ORA-28219: password verification failed for mandatory profile
          // ! + random A-Z character
          password = securitySecretCreate(true, 30);
          //use singlequote for INSERT, else doublequote for CREATE USER
          if (sql.toUpperCase().includes('INSERT INTO'))
             sql = sql.replace(password_tag, `'${await securityPasswordCreate(password)}'`);
          else
             sql = sql.replace(password_tag, `"${password}"`);
       }   
       else{
            password = securitySecretCreate();
            if (sql.toUpperCase().includes('INSERT INTO'))
                sql = sql.replace(password_tag, `'${await securityPasswordCreate(password)}'`);
            else
                sql = sql.replace(password_tag, `'${password}'`);
       }
          
       sql = sql.replace('<APP_USERNAME/>', username);
       install_result.push({[`${username}`]: password});         
       return [sql, password];
    };
    const files = await dbInstallGetFiles('install');
    const DB_SCHEMA = fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`) ?? '';
    let install_count = 0;
    for (const file of files){
        socketAdminSend(app_id, {   app_id:null,
                                    client_id:serverUtilNumberValue(query.get('client_id')),
                                    client_id_current:null,
                                    broadcast_type:'PROGRESS',
                                    broadcast_message:btoa(JSON.stringify({part:install_count, total:files.length, text:file[1]}))});
        install_count++;
        const install_json = await fs.promises.readFile(`${process.cwd()}${file[1]}`, 'utf8');
        const install_obj = JSON.parse(install_json);
        //filter for current database or for all databases
        install_obj.install = install_obj.install.filter((/**@type{server_db_database_install_database_script|server_db_database_install_database_app_script}*/row) =>  
            row.db == db_use || row.db == null);
        
        for (const install_row of install_obj.install){
            let install_sql;
            switch (file[0]){
                case 0:{
                    //main script
                    install_sql = await fs.promises.readFile(`${process.cwd()}${DB_INSTALL_PATH + install_row.script}`, 'utf8');
                    break;
                }
                case 1:{
                    //admin script
                    install_sql = await fs.promises.readFile(`${process.cwd()}${DB_ADMIN_INSTALL_PATH + install_row.script}`, 'utf8');
                    break;
                }
                default:{
                    //app scripts
                    install_sql = await fs.promises.readFile(`${process.cwd()}${DB_APP_PATH + file[2]}${DB_APP_INSTALL_PATH + install_row.script}`, 'utf8');
                }
            }
            //remove comments
            //rows starting with '--' and ends width '\r\n' or '\n'
            const sql_split = process.platform == 'win32'?'\r\n':'\n';
            //remove rows starting with '--' and contains only '\r\n' or '\n'
            install_sql = install_sql.split(sql_split).filter(row=>!row.startsWith('--') && (row != sql_split)).join(sql_split);
            //split script file into separate sql statements
            for (let sql of install_sql.split(';')){
                if (sql.startsWith(sql_split))
                    sql = sql.substring(sql_split.length);
                if (sql.length>0){
                    if (file[0] == 0 && sql.includes(password_tag)){
                        const sql_and_pw = await sql_with_password('app_portfolio', sql);
                        sql = sql_and_pw[0];
                    }
                    sql = sql.replaceAll('<APP_ID/>', file[2]?file[2].toString():'0');
                    sql = sql.replaceAll('<DB_SCHEMA/>', DB_SCHEMA);
                        
                    //if ; must be in wrong place then set tag in import script and convert it
                    if (sql.includes('<SEMICOLON/>'))
                        sql = sql.replace('<SEMICOLON/>', ';');
                    //close and start pool when creating database, some modules dont like database name when creating database
                    //exclude db 4 and db 5
                    if (db_use != 4 && db_use != 5)
                        if (sql.toUpperCase().includes('CREATE DATABASE')){
                            //remove database name in dba pool
                            await dbPoolClose(null, db_use, DBA);
                            /**@type{server_db_db_pool_parameters} */
                            const json_data = {
                                    use:                       db_use,
                                    pool_id:                   null,
                                    port:                      serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_PORT`)),
                                    host:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_HOST`),
                                    dba:                       DBA,
                                    user:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`),
                                    password:                  fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_PASS`),
                                    database:                  null,
                                    //db 1 + 2 parameters
                                    charset:                   fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CHARACTERSET`),
                                    connectionLimit:           serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`)),
                                    // db 3 parameters
                                    connectionTimeoutMillis:   serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`)),
                                    idleTimeoutMillis:         serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`)),
                                    max:                       serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_MAX`)),
                                    // db 4 parameters not used here
                                    connectString:             null,
                                    poolMin:                   null,
                                    poolMax:                   null,
                                    poolIncrement:             null
                                };
                            await dbPoolStart(json_data);
                        }
                        else{
                            if (change_DBA_pool == true){
                            //add database name in dba pool
                            await dbPoolClose(null, db_use, DBA);
                            /**@type{server_db_db_pool_parameters} */
                            const json_data = {
                                use:                       db_use,
                                pool_id:                   null,
                                port:                      serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_PORT`)),
                                host:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_HOST`),
                                dba:                       DBA,
                                user:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`),
                                password:                  fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_PASS`),
                                database:                  fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_NAME`),
                                //db 1 + 2 parameters
                                charset:                   fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CHARACTERSET`),
                                connectionLimit:           serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`)),
                                // db 3 parameters
                                connectionTimeoutMillis:   serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`)),
                                idleTimeoutMillis:         serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`)),
                                max:                       serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_MAX`)),
                                // db 4 parameters not used here
                                connectString:             null,
                                poolMin:                   null,
                                poolMax:                   null,
                                poolIncrement:             null
                            };
                            await dbPoolStart(json_data);
                            //change to database value for the rest of the function
                            change_DBA_pool = false;
                            }
                        }
                    await dbCommonExecute(app_id, sql, {}, DBA);
                    count_statements += 1;
                }
            }
        }
        if (install_obj.users){
            let sql_and_pw = null;
            for (const users_row of install_obj.users.filter((/**@type{server_db_database_install_database_app_user_script}*/row) => row.db == db_use || row.db == null)){
                switch (file[0]){
                    case 1:{
                        //do not install any database user for admin app, admin app uses database dba user
                        break;
                    }
                    default:{
                        const app_username = 'app_portfolio_app' + file[2];
                        if (users_row.sql.includes(password_tag)){
                            
                            sql_and_pw = await sql_with_password(app_username, users_row.sql);
                            users_row.sql = sql_and_pw[0];
                            await fileModelAppSecret.update(file[2]??0, file[2]??0,{  parameter_name:     `service_db_db${db_use}_app_user`,
                                                                                    parameter_value:    app_username}, null);
                            await fileModelAppSecret.update(file[2]??0, file[2]??0,{  parameter_name:     `service_db_db${db_use}_app_password`,
                                                                                    parameter_value:    sql_and_pw[1]}, null);
                        }
                        users_row.sql = users_row.sql.replaceAll('<APP_ID/>', file[2]);
                        users_row.sql = users_row.sql.replace('<APP_USERNAME/>', app_username);
                        break;
                    }
                }
                await dbCommonExecute(app_id, users_row.sql, {}, DBA);
                count_statements += 1;
            }
        }   
    }
    install_result.push({'SQL': count_statements});
    install_result.push({'finished': new Date().toISOString()});
    fileModelLog.postServerI(`Database install result: ${install_result.reduce((result, current)=> result += `${Object.keys(current)[0]}:${Object.values(current)[0]} `, '')}`);
    return {info: install_result};
 };
 /**
  * Checks if database is installed
  * @function
  * @param {number|null} app_id
  * @returns {Promise.<server_db_database_install_db_check>}
  */
 const dbInstalledCheck = async app_id =>import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                                        dbCommonExecute(app_id, 
                                                        dbSqlDatabase.DATABASE_SELECT_INSTALLED_CHECK, 
                                                        {app_id: app_id}, 
                                                        DBA, 
                                                        null)
                                                        .catch(()=>{
                                                            const not_installed = [{installed: 0}];
                                                            return not_installed;
                                                        }));
 /**
  * Uninstall database installation
  * @function
  * @param {number} app_id
  * @param {*} query
  * @returns {Promise.<server_db_database_install_uninstall_result>} 
  */
 const dbUninstall = async (app_id, query)=> {
    /**@type{import('../../apps/common/src/common.js')} */
    const {commonRegistryAppSecretDBReset} = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    
    /**@type{import('../db/file.js')} */
    const {fileFsWriteAdmin} = await import(`file://${process.cwd()}/server/db/file.js`);

    /**@type{import('../db/db.js')} */
    const {dbPoolClose, dbPoolStart} = await import(`file://${process.cwd()}/server/db/db.js`);
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('../socket.js')} */
    const {socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('../db/common.js')} */
    const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.js`);
    

    const fs = await import('node:fs');

    let count_statements = 0;
    let count_statements_fail = 0;
    
    
    const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
    if (db_use==5){
        await dbPoolClose(null, db_use, 0);
        await fileFsWriteAdmin('DB_FILE', null);
        await DB_POOL(db_use, 0, null, null, null);
        count_statements++;
    }
    else{
        let install_count=0;
        const files = await dbInstallGetFiles('uninstall');
        for (const file of  files){
            socketAdminSend(app_id, { app_id:null, client_id:serverUtilNumberValue(query.get('client_id')),client_id_current:null,broadcast_type:'PROGRESS',broadcast_message:btoa(JSON.stringify({part:install_count, total:files.length, text:file[1]}))});
            install_count++;
            const uninstall_sql_file = await fs.promises.readFile(`${process.cwd()}${file[1]}`, 'utf8');
            const uninstall_sql = JSON.parse(uninstall_sql_file).uninstall.filter((/**@type{server_db_database_uninstall_database_script|server_db_database_uninstall_database_app_script}*/row) => row.db == db_use);
            for (const sql_row of uninstall_sql){
                if (db_use==3 && sql_row.sql.toUpperCase().includes('DROP DATABASE')){
                    //add database name in dba pool
                    await dbPoolClose(null, db_use, DBA);
                    /**@type{server_db_db_pool_parameters} */
                    const json_data = {
                        use:                       db_use,
                        pool_id:                   null,
                        port:                      serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_PORT`)),
                        host:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_HOST`),
                        dba:                       DBA,
                        user:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`),
                        password:                  fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_PASS`),
                        database:                  null,
                        //db 1 + 2 not used here
                        charset:                   null,
                        connectionLimit:           null,
                        //db 3
                        connectionTimeoutMillis:   serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`)),
                        idleTimeoutMillis:         serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`)),
                        max:                       serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_MAX`)),
                        //db 4 not used here
                        connectString:             null,
                        poolMin:                   null,
                        poolMax:                   null,
                        poolIncrement:             null
                    };
                    await dbPoolStart(json_data);
                }
                if (file[2]==null)
                    sql_row.sql = sql_row.sql.replace('<APP_USERNAME/>', 'app_portfolio_app_admin');
                else
                    sql_row.sql = sql_row.sql.replace('<APP_USERNAME/>', 'app_portfolio_app' + file[2]);
                sql_row.sql = sql_row.sql.replaceAll('<APP_ID/>', file[2]?file[2]:'0');
                await dbCommonExecute(app_id, sql_row.sql, {}, DBA)
                .then(()=>{count_statements += 1;})
                .catch(()=>{count_statements_fail += 1;});
                
            }      
        }
        //remove db users and password
        commonRegistryAppSecretDBReset(app_id);
    }
    fileModelLog.postServerI(`Database uninstall result db ${db_use}: count: ${count_statements}, count_fail: ${count_statements_fail}`);
    return {info:[  { count    : count_statements},
                    {count_fail: count_statements_fail}
                ]};
};
/**
 * Install demo users and sends server side events of progress
 * Creates user settings and imports images to base64 format
 * Creates random social records for social types LIKE, VIEW, VIEW_ANONYMOUS, FOLLOWER, POSTS_LIKE, POSTS_VIEW and POSTS_VIEW_ANONYMOUS
 * Random records are created using 2 lists of all users and creates records until two groups both have 50% samples with unique users in each sample of social type
 * Returns log about records created
 * @function
 * @param {number} app_id
 * @param {*} query
 * @param {*} data
 * @returns {Promise.<{info: {}[]}>}
 */
 const dbDemoInstall = async (app_id, query, data)=> {
    /**@type{import('../socket.js')} */
    const {socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);

    /**@type{import('./dbModelUserAccount.js')} */
    const {userPost} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    /**@type{import('./dbModelUserAccountApp.js')} */
    const dbModelUserAccountApp = await import(`file://${process.cwd()}/server/db/dbModelUserAccountApp.js`);
    /**@type{import('./dbModelUserAccountLike.js')} */
    const user_account_like = await import(`file://${process.cwd()}/server/db/dbModelUserAccountLike.js`);
    /**@type{import('./dbModelUserAccountView.js')} */
    const dbModelUserAccountView = await import(`file://${process.cwd()}/server/db/dbModelUserAccountView.js`);
    /**@type{import('./dbModelUserAccountFollow.js')} */
    const user_account_follow = await import(`file://${process.cwd()}/server/db/dbModelUserAccountFollow.js`);
    /**@type{import('./dbModelUserAccountAppDataPost.js')} */
    const {createUserPost, getUserPostsByUserId} = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPost.js`);
    /**@type{import('./dbModelUserAccountAppDataPostLike.js')} */
    const user_account_app_data_post_like = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPostLike.js`);
    /**@type{import('./dbModelUserAccountAppDataPostView.js')} */
    const dbModelUserAccountAppDataPostView = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPostView.js`);
    /**@type{import('./dbModelAppDataResourceMaster.js')} */
    const dbModelAppDataResourceMaster = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceMaster.js`);

    /**@type{import('./dbModelAppDataResourceDetail.js')} */
    const dbModelAppDataResourceDetail = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetail.js`);

    /**@type{import('./dbModelAppDataResourceDetailData.js')} */
    const dbModelAppDataResourceDetailData = await import(`file://${process.cwd()}/server/db/dbModelAppDataResourceDetailData.js`);

    /**@type{import('./fileModelApp.js')} */
    const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);

    /**@type{import('./fileModelAppSecret.js')} */
    const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

    /**@type{import('../security.js')} */
    const {securityKeyPairCreate, securityUUIDCreate, securitySecretCreate} = await import(`file://${process.cwd()}/server/security.js`);
    
    const fs = await import('node:fs');
    /**@type{server_db_database_install_result} */
    const install_result = [];
    install_result.push({'start': new Date().toISOString()});
    const fileBuffer = await fs.promises.readFile(`${process.cwd()}${DB_DEMO_PATH}${DB_DEMO_FILE}`, 'utf8');
    /**@type{[server_db_database_demo_user]}*/
    const demo_users = JSON.parse(fileBuffer.toString()).demo_users;
    //create social records
    const social_types = ['LIKE', 'VIEW', 'VIEW_ANONYMOUS', 'FOLLOWER', 'POSTS_LIKE', 'POSTS_VIEW', 'POSTS_VIEW_ANONYMOUS'];
    let email_index = 1000;
    let records_user_account = 0;
    let records_user_account_app = 0;
    let records_user_account_app_data_post = 0;
    let records_user_account_resource_master = 0;
    let records_user_account_resource_detail = 0;
    let records_user_account_resource_detail_data = 0;
    let install_count=0;
    const install_total_count = demo_users.length + social_types.length;
    install_count++;
    /**
     * Create demo users
     * @param {[server_db_database_demo_user]} demo_users 
     * @returns {Promise.<void>}
     */
    const create_users = async (demo_users) =>{
            /**
             * 
             * @param {server_db_database_demo_user} demo_user
             * @returns 
             */
            const create_update_id = async demo_user=>{
            /**@type{server_db_sql_parameter_user_account_create}*/
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
                return await userPost(app_id, data_create)
                                .catch((/**@type{server_server_error}*/err)=> {
                                    throw err;
                                });
            };
            for (const demo_user of demo_users){
                demo_user.id = await create_update_id(demo_user).then(user=>user.insertId);
                records_user_account++;
            }
    };
    /**
     * Create user account app
     * @param {number} app_id 
     * @param {number} user_account_id 
     * @returns {Promise.<null>}
     */
    const create_user_account_app = async (app_id, user_account_id) =>{
        return new Promise((resolve, reject) => {
            dbModelUserAccountApp.post(app_id, user_account_id)
            .then(result=>{
                if (result.affectedRows == 1)
                    records_user_account_app++;
                resolve(null);
            })
            .catch((/**@type{server_server_error}*/error)=>{
                reject(error);
            });
        });
    };
    /**
     * Create user post
     * @param {number} user_account_post_app_id 
     * @param {server_db_sql_parameter_user_account_app_data_post_createUserPost} data 
     * @returns {Promise.<null>}
     */
    const create_user_post = async (user_account_post_app_id, data) => {
        return new Promise((resolve, reject) => {
            createUserPost(user_account_post_app_id, new URLSearchParams('initial=0'), data)
            .then(result=>{
                if (result.data?.affectedRows == 1)
                    records_user_account_app_data_post++;
                resolve(null);
            })
            .catch((/**@type{server_server_error}*/error)=>{
                reject(error);
            });
        });
    };

    /**
     * 
     * @param {number} user_account_post_app_id 
     * @param {*} data 
     * @returns {Promise.<number>}
     */
    const create_resource_master = async (user_account_post_app_id, data) => {
        return new Promise((resolve, reject) => {
            dbModelAppDataResourceMaster.post(user_account_post_app_id, data)
            .then(result=>{
                if (result.affectedRows == 1)
                    records_user_account_resource_master++;
                resolve(result.insertId);
            })
            .catch((/**@type{server_server_error}*/error)=>{
                reject(error);
            });
        });
    };
    /**
     * 
     * @param {number} user_account_post_app_id 
     * @param {*} data 
     * @returns {Promise.<number>}
     */
    const create_resource_detail = async (user_account_post_app_id, data) => {
        return new Promise((resolve, reject) => {
            dbModelAppDataResourceDetail.post(user_account_post_app_id, data)
            .then(result=>{
                if (result.affectedRows == 1)
                    records_user_account_resource_detail++;
                resolve(result.insertId);
            })
            .catch((/**@type{server_server_error}*/error)=>{
                reject(error);
            });
        });
    };

    /**
     * 
     * @param {number} user_account_post_app_id 
     * @param {*} data 
     * @returns {Promise.<number>}
     */
    const create_resource_detail_data = async (user_account_post_app_id, data) => {
        return new Promise((resolve, reject) => {
            dbModelAppDataResourceDetailData.post(user_account_post_app_id, data)
            .then(result=>{
                if (result.affectedRows == 1)
                    records_user_account_resource_detail_data++;
                resolve(result.insertId);
            })
            .catch((/**@type{server_server_error}*/error)=>{
                reject(error);
            });
        });
    };

    //create all users first and update with id
    await create_users(demo_users);
    /**@type{server_db_file_app[]}*/
    const apps = fileModelApp.get(app_id, null, null);
    
    //generate key pairs for each user that can be saved both in resource and apps configuration
    //Use same for all demo users since key creation can be slow
    socketAdminSend(app_id, {   app_id:null,
                                client_id:serverUtilNumberValue(query.get('client_id')),
                                client_id_current:null,
                                broadcast_type:'PROGRESS',
                                broadcast_message:btoa(JSON.stringify({part:install_count, total:install_total_count, text:'Generating key pair...'}))});
    const {publicKey, privateKey} = await securityKeyPairCreate();
    const demo_public_key = publicKey;
    const demo_private_key = privateKey;
    //create user posts
    for (const demo_user of demo_users){
        socketAdminSend(app_id, {   app_id:null,
                                    client_id:serverUtilNumberValue(query.get('client_id')),
                                    client_id_current:null,
                                    broadcast_type:'PROGRESS',
                                    broadcast_message:btoa(JSON.stringify({part:install_count, total:install_total_count, text:demo_user.username}))});
        install_count++;

        //generate vpa for each user that can be saved both in resource and apps configuration
        const demo_vpa = securityUUIDCreate();
        //create user_account_app record for all apps except admin
        for (const app of apps.filter(app=>app.id != serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))) ){
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
            const image = await fs.promises.readFile(`${process.cwd()}${DB_DEMO_PATH}${settings_header_image}`);
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
        /**
         * Updates resource values
         * @param {*} resource
         * @returns {Promise.<*>} 
         */
        const demo_data_update = async resource => {
            /**
             * 
             * @param {[string, string]} key_name 
             * @returns {string}
             */
            const value_set = key_name =>{
                if (resource.app_update_secret && resource.app_update_secret.filter((/**@type{*}*/secret_key)=>key_name[0] in secret_key)[0])
                    switch (resource.app_update_secret.filter((/**@type{*}*/secret_key)=>key_name[0] in secret_key)[0][key_name[0]]){
                        case 'DATE_NOW':
                            return Date.now().toString();
                        case 'DATE_NOW_PADSTART_16':
                            return Date.now().toString().padStart(16,'0');
                        case 'DATE_ISO':
                            return new Date().toISOString();
                        case 'UUID':
                            return demo_vpa;
                        case 'SECRET':
                            return securitySecretCreate();
                        case 'PUBLIC_KEY':
                            return demo_public_key;
                        case 'PRIVATE_KEY':
                            return demo_private_key;
                        case 'USER_ACCOUNT_ID':
                            return demo_user.id.toString();
                        default:{
                            //replace if containing HOST parameter
                            return key_name[1].replaceAll('<HOST/>', fileModelConfig.get('CONFIG_SERVER','SERVER','HOST') ?? '');
                        }
                            
                    }
                else
                    return key_name[1];
            };
            //loop json_data keys
            for (const key of Object.entries(resource.json_data)){
                const value = value_set(key);
                if (resource.app_registry_update_app_id && resource.app_update_secret.filter((/**@type{*}*/secret_key)=>key[0] in secret_key).length>0)
                    await fileModelAppSecret.update(serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, 
                                                        resource.app_registry_update_app_id,
                                                        {   
                                                            parameter_name:     key[0],
                                                            parameter_value:    value
                                                        },null);
                resource.json_data[key[0]] = value;
            }
            //loop custom secret keys containing USER_ACCOUNT_ID not in json_data
            if (resource.app_update_secret)
                for (const key of resource.app_update_secret.filter((/**@type{*}*/secret_key)=>Object.values(secret_key)[0]=='USER_ACCOUNT_ID')){
                    const value = value_set([Object.keys(key)[0], Object.values(key)[0]]);
                    await fileModelAppSecret.update(serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, 
                                                        resource.app_registry_update_app_id,
                                                        {   
                                                            parameter_name:     Object.keys(key)[0],
                                                            parameter_value:    value
                                                        },null);
                }
            return resource.json_data;
        };

        for (const resource_master of demo_user.resource_master ?? []){
            const data = {  
                            user_account_id:                                demo_user.id,
                            user_account_app_id:                            resource_master.user_account_app_app_id,
                            data_app_id:                                    resource_master.app_data_entity_resource_app_data_entity_app_id,
                            app_data_entity_resource_app_data_entity_id:    resource_master.app_data_entity_resource_app_data_entity_id,
                            app_data_entity_resource_id:                    resource_master.app_data_entity_resource_id,
                            json_data:                                      await demo_data_update(resource_master)
            };
            const master_id = await create_resource_master(app_id, data);
            for (const resource_detail of resource_master.resource_detail ?? []){
                const data = {  app_data_resource_master_id                     : master_id,
                                app_data_entity_resource_id                     : resource_detail.app_data_entity_resource_id,
                                user_account_id                                 : demo_user.id,
                                user_account_app_id                             : resource_detail.user_account_app_id,
                                data_app_id                                     : resource_detail.data_app_id,
                                app_data_entity_resource_app_data_entity_id     : resource_detail.app_data_entity_resource_app_data_entity_id,
                                app_data_resource_master_attribute_id           : resource_detail.app_data_resource_master_attribute_id,
                                json_data                                       : await demo_data_update(resource_detail)
                                };
                const detail_id = await create_resource_detail(app_id, data);
                for (const resource_detail_data of resource_detail.resource_detail_data ?? []){
                    const data ={   app_data_resource_detail_id             : detail_id,
                                    user_account_id                         : demo_user.id,
                                    user_account_app_id                     : resource_detail_data.user_account_app_id,
                                    data_app_id                             : resource_detail_data.data_app_id,
                                    app_data_resource_master_attribute_id   : resource_detail_data.app_data_resource_master_attribute_id,
                                    json_data                               : await demo_data_update(resource_detail_data)
                                    };
                    create_resource_detail_data(app_id, data);
                }
            }
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
            user_account_like.post(app_id, id, {user_account_id:id_like})
            .then(result => {
                if (result.affectedRows == 1)
                    records_user_account_like++;
                resolve(null);
            })
            .catch((/**@type{server_server_error}*/error)=>{
                reject(error);
            });
        });
    };
    /**
     * Create user account view
     * @param {number} app_id 
     * @param {server_db_sql_parameter_user_account_view_insertUserAccountView} data 
     * @returns {Promise.<null>}
     */
    const create_user_account_view = async (app_id, data ) =>{
        return new Promise((resolve, reject) => {
            dbModelUserAccountView.post(app_id, data)
            .then(result => {
                if (result.affectedRows == 1)
                        records_user_account_view++;
                resolve(null);
            })
            .catch((/**@type{server_server_error}*/error)=>{
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
            user_account_follow.post(app_id, id, {user_account_id:id_follow})
            .then(result=>{
                if (result.affectedRows == 1)
                    records_user_account_follow++;
                resolve(null);
            })
            .catch((/**@type{server_server_error}*/error)=>{
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
            getUserPostsByUserId(app_id, user1,null,null)
            .then(result_posts=>{
                const random_posts_index = Math.floor(1 + Math.random() * result_posts.length - 1 );
                user_account_app_data_post_like.post(app_id, user2, {user_account_app_data_post_id:result_posts[random_posts_index].id})
                .then(result => {
                    if (result.affectedRows == 1)
                        records_user_account_app_data_post_like++;
                    resolve(null);
                })
                .catch((/**@type{server_server_error}*/error)=>{
                    reject(error);
                });
            })
            .catch((/**@type{server_server_error}*/error)=>{
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
            getUserPostsByUserId(app_id, user1, null,null)
            .then(result_posts=>{
                //choose random post from user
                        const random_index = Math.floor(1 + Math.random() * result_posts.length -1);
                        let user_account_id;
                        if (social_type == 'POSTS_VIEW')
                            user_account_id = user2;
                        else
                            user_account_id = null;
                            dbModelUserAccountAppDataPostView.post(app_id, {  user_account_id: user_account_id,
                                                    user_account_app_data_post_id: result_posts[random_index].id,
                                                    client_ip: null,
                                                    client_user_agent: null,
                                                    client_longitude: null,
                                                    client_latitude: null
                                                            })
                    .then(result=>{
                        if (result.affectedRows == 1)
                                records_user_account_app_data_post_view++;
                            resolve(null);
                    })
                    .catch((/**@type{server_server_error}*/error)=>{
                        reject(error);
                    });
            })
            .catch((/**@type{server_server_error}*/error)=>{
                reject(error);
            });
        });
    };
    for (const social_type of social_types){
        socketAdminSend(app_id, {   app_id:null,
                                    client_id:serverUtilNumberValue(query.get('client_id')),
                                    client_id_current:null,
                                    broadcast_type:'PROGRESS',
                                    broadcast_message:btoa(JSON.stringify({part:install_count, total:install_total_count, text:social_type}))});
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
                        if (user_account_app_data_posts.length>0){
                            const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].app_id;
                            await create_user_account_app_data_post_like(settings_app_id, user1, user2);
                        }
                        break;
                    }
                    case 'POSTS_VIEW':
                    case 'POSTS_VIEW_ANONYMOUS':{
                        //pick a random user setting from the user and return the app_id
                        const user_account_app_data_posts = demo_users.filter(user=>user.id == user1)[0].settings;
                        if (user_account_app_data_posts.length>0){
                            const settings_app_id = user_account_app_data_posts[Math.floor(1 + Math.random() * user_account_app_data_posts.length - 1 )].app_id;
                            await create_user_account_app_data_post_view(settings_app_id, user1, user2 , social_type) ;
                        }
                        break;
                    }
                }						
            }
        }
    }
    install_result.push({'user_account': records_user_account});
    install_result.push({'user_account_app': records_user_account_app});
    install_result.push({'user_account_resource_master': records_user_account_resource_master});
    install_result.push({'user_account_resource_detail': records_user_account_resource_detail});
    install_result.push({'user_account_resource_detail_data': records_user_account_resource_detail_data});
    install_result.push({'user_account_like': records_user_account_like});
    install_result.push({'user_account_view': records_user_account_view});
    install_result.push({'user_account_follow': records_user_account_follow});
    install_result.push({'user_account_app_data_post': records_user_account_app_data_post});
    install_result.push({'user_account_app_data_post_like': records_user_account_app_data_post_like});
    install_result.push({'user_account_app_data_post_view': records_user_account_app_data_post_view});
    install_result.push({'finished': new Date().toISOString()});
    fileModelLog.postServerI(`Demo install result: ${install_result.reduce((result, current)=> result += `${Object.keys(current)[0]}:${Object.values(current)[0]} `, '')}`);
    return {info: install_result};
};
/**
 * Demo uninstall
 * Deletes all demo users and send server side events of progress
 * @function
 * @param {number} app_id
 * @param {*} query
 * @returns {Promise.<{info: {}[]}>}
 */
const dbDemoUninstall = async (app_id, query)=> {
    /**@type{import('../socket.js')} */
    const {socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('./dbModelUserAccount.js')} */
	const {userDemoGet, userDelete} = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    return new Promise((resolve, reject)=>{
        userDemoGet(app_id)
        .then(result_demo_users=>{
            let deleted_user = 0;
            if (result_demo_users.length>0){
                const delete_users = async () => {
                    for (const user of result_demo_users){
                        socketAdminSend(app_id, {   app_id:null,
                                                    client_id:serverUtilNumberValue(query.get('client_id')),
                                                    client_id_current:null,
                                                    broadcast_type:'PROGRESS',
                                                    broadcast_message:btoa(JSON.stringify({part:deleted_user, total:result_demo_users.length, text:user.username}))});
                        await userDelete(app_id, user.id)
                        .then(()=>{
                            deleted_user++;
                            if (deleted_user == result_demo_users.length)
                                return null;
                        })
                        .catch((/**@type{server_server_error}*/error)=>{
                            throw error;
                        });
                    }
                };
                delete_users()
                .then(()=>{
                    fileModelLog.postServerI(`Demo uninstall count: ${deleted_user}`);
                    resolve({info: [{'count': deleted_user}]});
                })
                .catch((/**@type{server_server_error}*/error)=>{
                    reject(error);
                });
            }
            else{
                fileModelLog.postServerI(`Demo uninstall count: ${result_demo_users.length}`);
                resolve({info: [{'count': result_demo_users.length}]});
            }
        })
        .catch((/**@type{server_server_error}*/error)=>{
            reject(error);
        });
    });
    
};

/**
 * Starts pool with parameters
 * @function
 * @param {number|null} db_use 
 * @param {number|null} dba 
 * @param {string|null} user 
 * @param {string|null} password 
 * @param {number|null} pool_id 
 * @returns {Promise.<null>}
 */
 const DB_POOL = async (db_use, dba, user, password, pool_id) =>{
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('../db/db.js')} */
    const {dbPoolStart} = await import(`file://${process.cwd()}/server/db/db.js`);
    
    return new Promise ((resolve, reject)=>{
       /**@type{server_db_db_pool_parameters} */
       const dbparameters = {
          use:                       db_use,
          pool_id:                   pool_id,
          host:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_HOST`),
          port:                      serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_PORT`)),
          dba:                       dba,
          user:                      user,
          password:                  password,
          database:                  fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_NAME`),
          //db 1 + 2 parameters
          charset:                   fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CHARACTERSET`),
          connectionLimit:           serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`)),
          // db 3 parameters
          connectionTimeoutMillis:   serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_TIMEOUT_CONNECTION`)),
          idleTimeoutMillis:         serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_TIMEOUT_IDLE`)),
          max:                       serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_MAX`)),
          // db 4 parameters
          connectString:             fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CONNECTSTRING`),
          poolMin:                   serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_POOL_MIN`)),
          poolMax:                   serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_POOL_MAX`)),
          poolIncrement:             serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_POOL_INCREMENT`))
       };
       dbPoolStart(dbparameters)
       .then((/**@type{null}*/result)=>{
        fileModelLog.postServerI(`Started pool ${dbparameters.pool_id}, db ${dbparameters.use}, host ${dbparameters.host}, port ${dbparameters.port}, dba ${dbparameters.dba}, user ${dbparameters.user}, database ${dbparameters.database}`);
          resolve(result);
       })
       .catch((/**@type{server_server_error}*/error)=>{
        fileModelLog.postServerE('Starting pool error: ' + error);
          reject(error);
       });
    });
 };
 /**
  * Start pools for database used
  * @function
  * @returns {Promise.<void>}
  */
const dbStart = async () => {

    /**@type{import('./fileModelApp.js')} */
    const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);

    /**@type{import('./fileModelAppSecret.js')} */
    const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

    const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID'));
    if (fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'START')=='1'){    
        let user;
        let password;
        let dba = 0;
        const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
       
        if (db_use == 5)
            await DB_POOL(db_use, dba, null, null, null);
        else{
            if (fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`)){
                user = `${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`)}`;
                password = `${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_PASS`)}`;
                dba = 1;
                await DB_POOL(db_use, dba, user, password, null);
                }
                dba = 0;
                for (const app  of fileModelApp.get(null, null, null)){
                    const app_secret = fileModelAppSecret.get(null, null).filter((/**@type{server_db_file_app_secret}*/app)=> app.app_id == common_app_id)[0];
                    /**@ts-ignore */
                    if (app_secret[`service_db_db${db_use}_app_user`])
                        await DB_POOL(  db_use, 
                                        dba, 
                                        /**@ts-ignore */
                                        app_secret[`service_db_db${db_use}_app_user`],
                                        /**@ts-ignore */
                                        app_secret[`service_db_db${db_use}_app_password`],
                                        app.id);
            }  
        }
    }
 };
export{dbInfo, dbInfoSpace, dbInfoSpaceSum, dbInstall, dbInstalledCheck, dbUninstall, dbDemoInstall, dbDemoUninstall, dbStart};