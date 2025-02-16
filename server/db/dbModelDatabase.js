/** @module server/db/dbModelDatabase */

/**
 * @import {server_server_response,
 *          server_db_file_app_secret,
 *          server_db_sql_parameter_user_account_view_insertUserAccountView,
 *          server_db_sql_parameter_user_account_app_data_post_createUserPost, server_server_error, 
 *          server_db_file_iam_user,server_db_database_demo_user,
 *          server_db_database_uninstall_database_script,server_db_database_uninstall_database_app_script,
 *          server_db_database_install_uninstall_result, server_db_database_install_db_check,
 *          server_db_db_pool_parameters,
 *          server_db_database_install_database_app_script, server_db_database_install_database_script, 
 *          server_db_database_install_result, 
 *          server_db_sql_result_admin_DBInfoSpaceSum, server_db_sql_result_admin_DBInfoSpace, server_db_sql_result_admin_DBInfo} from '../types.js'
 */

/**@type{import('./dbSqlDatabase.js')} */
const dbSqlDatabase = await import(`file://${process.cwd()}/server/db/dbSqlDatabase.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

const DB_DEMO_PATH              = '/server/install/db/demo/';
const DB_DEMO_FILE              = 'demo.json';

const DB_INSTALL_PATH           = '/server/install/db/';
const DB_INSTALL                = 'install_database.json';
const DB_UNINSTALL              = 'uninstall_database.json';
const DB_INSTALL_DATA           = 'install_database_data.json';
/**
 * @name dbInfo
 * @description Database info
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_admin_DBInfo[] }>}
 */
const dbInfo = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSqlDatabase.DATABASE_INFO_SELECT(), 
                        {   database: serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')), 
                            database_schema: fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`)
                        }));
/**
 * @name dbInfoSpace
 * @description Database info space
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_admin_DBInfoSpace[] }>}
 */
const dbInfoSpace = parameters =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSqlDatabase.DATABASE_INFO_SELECT_SPACE(), 
                        serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))==5?
                            {}:
                                {db_schema: fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`)}));
/**
 * @name dbInfoSpaceSum
 * @description Database info space sum
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number}}parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_admin_DBInfoSpaceSum[] }>}
 */
const dbInfoSpaceSum = parameters =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSqlDatabase.DATABASE_INFO_SELECT_SPACE_SUM(), 
                        serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))==5?
                            {}:
                                {db_schema: fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`)}));

/**
 * @name dbInstall
 * @description Install db and sends server side events of progress
 *              1.Installs scripts with datamodel
 *              2.Inserts apps and creates database user for each app and updates secrets in app_secret table
 *              3.Installs scripts with data
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string,}} parameters
 * @returns {Promise.<server_server_response & {result?:{info: {}[]} }>}
 */
 const dbInstall = async parameters => {
    /**@type{import('./fileModelAppSecret.js')} */
    const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);
    /**@type{import('../db/db.js')} */
    const {dbPoolClose, dbPoolStart} = await import(`file://${process.cwd()}/server/db/db.js`);
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('../socket.js')} */
    const {socketClientGet, socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('../db/common.js')} */
    const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('./dbModelApp.js')} */
    const dbModelApp = await import(`file://${process.cwd()}/server/db/dbModelApp.js`);

    /**@type{import('../security.js')} */
	const {securitySecretCreate}= await import(`file://${process.cwd()}/server/security.js`);

    /**@type{import('../db/fileModelApp.js')} */
    const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);
    
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
            sql = sql.replace(password_tag, `"${password}"`);
       }   
       else{
            password = securitySecretCreate();
            sql = sql.replace(password_tag, `'${password}'`);
       }
       install_result.push({[`${username}`]: password});         
       return [sql, password];
    };
    const DB_SCHEMA = fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`) ?? '';
    
    let install_count = 0;
    install_count++;
    const install_json = await fs.promises.readFile(`${process.cwd()}${DB_INSTALL_PATH + DB_INSTALL}`, 'utf8');
    const install_obj = JSON.parse(install_json);
    //filter for current database or for all databases
    install_obj.install = install_obj.install.filter((/**@type{server_db_database_install_database_script|server_db_database_install_database_app_script}*/row) =>  
        row.db == db_use || row.db == null);

    const apps = fileModelApp.get({app_id:parameters.app_id,resource_id:null}).result;
    const install_data_json = await fs.promises.readFile(`${process.cwd()}${DB_INSTALL_PATH + DB_INSTALL_DATA}`, 'utf8');
    const install_data_obj = JSON.parse(install_data_json);
    
    const install_total = install_obj.install.length + apps.length + install_data_obj;
    /**
     * @param {{app_id:number|null,
     *          script:string}} parametersDB
     */
    const executeDatabase = async parametersDB =>{
        let install_sql;
        install_sql = await fs.promises.readFile(`${process.cwd()}${DB_INSTALL_PATH + parametersDB.script}`, 'utf8');

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
                if (sql.includes(password_tag)){
                    const sql_and_pw = await sql_with_password('app_portfolio', sql);
                    sql = sql_and_pw[0];
                }
                if (parametersDB.app_id !=null)
                    sql = sql.replaceAll('<APP_ID/>', parametersDB.app_id.toString());
                sql = sql.replaceAll('<DB_SCHEMA/>', DB_SCHEMA);
                    
                //if ; must be in wrong place then set tag in import script and convert it
                if (sql.includes('<SEMICOLON/>'))
                    sql = sql.replace('<SEMICOLON/>', ';');
                //close and start pool when creating database, some modules dont like database name when creating database
                //exclude db 4 and db 5
                if (db_use != 4 && db_use != 5)
                    if (sql.toUpperCase().includes('CREATE DATABASE')){
                        //remove database name in dba pool
                        await dbPoolClose(null, db_use, true);
                        /**@type{server_db_db_pool_parameters} */
                        const json_data = {
                                use:                       db_use,
                                pool_id:                   null,
                                port:                      serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_PORT`)),
                                host:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_HOST`),
                                dba:                       true,
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
                            await dbPoolClose(null, db_use, true);
                            /**@type{server_db_db_pool_parameters} */
                            const json_data = {
                                use:                       db_use,
                                pool_id:                   null,
                                port:                      serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_PORT`)),
                                host:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_HOST`),
                                dba:                       true,
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
                //all SQL uses admin pool and app id
                const db_result = await dbCommonExecute(parameters.app_id, sql, {});
                if (db_result.result)
                    count_statements += 1;
                else
                    throw  db_result;
            }
        }
    };
    for (const install_row of install_obj.install){
        install_count++;
        socketAdminSend({   app_id:parameters.app_id,
            idToken:parameters.idToken,
            data:{app_id:null,
                client_id:socketClientGet(parameters.idToken),
                broadcast_type:'PROGRESS',
                broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:install_total, text:DB_INSTALL_PATH + install_row.script})).toString('base64')}});
        //app id not used in DDL SQL
        await executeDatabase({app_id:null, script:install_row.script});
    }
    socketAdminSend({   app_id:parameters.app_id,
                        idToken:parameters.idToken,
                        data:{app_id:null,
                            client_id:socketClientGet(parameters.idToken),
                            broadcast_type:'PROGRESS',
                            broadcast_message:Buffer.from(JSON.stringify({  part:install_count, 
                                                                            total:install_total, 
                                                                            text:'Inserting apps and users'})).toString('base64')}});

    for (const app of apps){
        const result_app_create = await dbModelApp.post({app_id:parameters.app_id, data:{data_app_id:app.id}});
        if (result_app_create.result){
            count_statements += 1;
            //if db has DB[DB]_DBA_USER parameter means users can be created
            if (fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`) &&
                app.id !=serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) &&
                app.id !=serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_ADMIN_APP_ID'))){
                //create db users except for common app id and admin app id
                const sql_and_pw = await sql_with_password(`app_portfolio_app${app.id}`, password_tag);
                await dbUserCreate({app_id:parameters.app_id, username:`app_portfolio_app${app.id}`, password:sql_and_pw[0]});
                count_statements += 1;
                await fileModelAppSecret.update({app_id:parameters.app_id, resource_id:app.id,data:{  parameter_name:     `service_db_db${db_use}_app_user`,
                                                        parameter_value:    `app_portfolio_app${app.id}`}});
                await fileModelAppSecret.update({app_id:parameters.app_id, resource_id:app.id,data:{  parameter_name:     `service_db_db${db_use}_app_password`,
                                                            parameter_value:    sql_and_pw[1]}});
            }   
        }
        else
            throw result_app_create;
    }
    for (const install_row of install_data_obj.install){
        install_count++;
        socketAdminSend({   app_id:parameters.app_id,
            idToken:parameters.idToken,
            data:{app_id:null,
                client_id:socketClientGet(parameters.idToken),
                broadcast_type:'PROGRESS',
                broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:install_total, text:DB_INSTALL_PATH + install_row.script})).toString('base64')}});
        //use app_id from installation script for DML SQL
        await executeDatabase({app_id:install_row.app_id, script:install_row.script});
    }
    install_result.push({'SQL': count_statements});
    install_result.push({'finished': new Date().toISOString()});
    fileModelLog.postServerI(`Database install result: ${install_result.reduce((result, current)=> result += `${Object.keys(current)[0]}:${Object.values(current)[0]} `, '')}`);
    return {result:{info: install_result}, type:'JSON'};
 };
 /**
  * @name dbInstalledCheck
  * @description Checks if database is installed
  * @function
  * @memberof ROUTE_REST_API
  * @param {{app_id:number|null}}parameters
  * @returns {Promise.<server_server_response & {result?:server_db_database_install_db_check }>}
  */
 const dbInstalledCheck = async parameters =>
    /**@ts-ignore */
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSqlDatabase.DATABASE_SELECT_INSTALLED_CHECK, 
                        {app_id: parameters.app_id})
                        .then((result)=>{
                            return {result:[{installed: result.http?0:1}], type:'JSON'};
                        })
                        .catch(()=>{        
                            return {result:[{installed: 0}], type:'JSON'};
                        }));
 /**
  * @name dbUninstall
  * @description Uninstall database installation
  * @function
  * @memberof ROUTE_REST_API
  * @param {{app_id:number,
  *          idToken:string}} parameters
  * @returns {Promise.<server_server_response & {result?:server_db_database_install_uninstall_result }>} 
  */
 const dbUninstall = async parameters => {
    
    /**@type{import('./fileModelAppSecret.js')} */
    const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

    /**@type{import('../db/file.js')} */
    const {fileFsWriteAdmin} = await import(`file://${process.cwd()}/server/db/file.js`);

    /**@type{import('../db/db.js')} */
    const {dbPoolClose, dbPoolStart} = await import(`file://${process.cwd()}/server/db/db.js`);
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('../socket.js')} */
    const {socketClientGet, socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('../db/common.js')} */
    const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.js`);

    /**@type{import('../db/fileModelApp.js')} */
    const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);
     
    const fs = await import('node:fs');

    let count_statements = 0;
    let count_statements_fail = 0;
    
    
    const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
    if (db_use==5){
        await dbPoolClose(null, db_use, false);
        await fileFsWriteAdmin('DB_FILE', null);
        await DB_POOL(db_use, false, null, null, null);
        count_statements++;
    }
    else{
        let install_count=0;
        install_count++;
        const uninstall_sql_file = await fs.promises.readFile(`${process.cwd()}${DB_INSTALL_PATH + DB_UNINSTALL}`, 'utf8');
        const uninstall_sql = JSON.parse(uninstall_sql_file).uninstall.filter((/**@type{server_db_database_uninstall_database_script|server_db_database_uninstall_database_app_script}*/row) => row.db == db_use);
        //get apps if db credentials configured or use empty array for progress message count
        const apps = fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`)?fileModelApp.get({app_id:parameters.app_id,resource_id:null}).result
                    .filter((/**@type{server_db_file_app}*/app)=>
                            app.id !=serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) &&
                            app.id !=serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_ADMIN_APP_ID'))):[];
        //drop users first to avoid db connection error
        //if db has DB[DB]_DBA_USER parameter means users can be dropped
        if (fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`)){
            socketAdminSend({   app_id:parameters.app_id, 
                idToken:parameters.idToken,
                data:{  app_id:null, 
                        client_id:socketClientGet(parameters.idToken),
                        broadcast_type:'PROGRESS',
                        broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:uninstall_sql.length + apps.length, text:'Dropping users...'})).toString('base64')
    
                }});    
            //drop db users except for common app id and admin app id
            for (const app of apps){
                const result_drop = await dbUserDrop({app_id:parameters.app_id, username:`app_portfolio_app${app.id}`});
                if (result_drop.result){
                    fileModelAppSecret.update({app_id:parameters.app_id, resource_id:app.id, data:{ parameter_name:`service_db_db${db_use}_app_user`,
                        parameter_value:''}});
                    fileModelAppSecret.update({app_id:parameters.app_id, resource_id:app.id, data:{ parameter_name:`service_db_db${db_use}_app_password`,
                        parameter_value:''}});
                }
                else
                    throw result_drop;
            }
        }
        
        for (const sql_row of uninstall_sql){
            install_count++;
            socketAdminSend({   app_id:parameters.app_id, 
                idToken:parameters.idToken,
                data:{  app_id:null, 
                        client_id:socketClientGet(parameters.idToken),
                        broadcast_type:'PROGRESS',
                        broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:uninstall_sql.length, text:'Dropping database...'})).toString('base64')
    
                }});    
            if (db_use==3 && sql_row.sql.toUpperCase().includes('DROP DATABASE')){
                //add database name in dba pool
                await dbPoolClose(null, db_use, true);
                /**@type{server_db_db_pool_parameters} */
                const json_data = {
                    use:                       db_use,
                    pool_id:                   null,
                    port:                      serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_PORT`)),
                    host:                      fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_HOST`),
                    dba:                       true,
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
            await dbCommonExecute(parameters.app_id, sql_row.sql, {})
            .then(()=>{count_statements += 1;})
            .catch(()=>{count_statements_fail += 1;});
            
        }      
    }
    fileModelLog.postServerI(`Database uninstall result db ${db_use}: count: ${count_statements}, count_fail: ${count_statements_fail}`);
    /**@ts-ignore */
    return {result:{info:[  { count    : count_statements},
                            {count_fail: count_statements_fail}]},
            type:'JSON'};
};
/**
 * @name dbDemoInstall
 * @description Install demo users and sends server side events of progress
 *              Installation steps:
 *              1.Create all users (user_level=2) first and update with id
 *              2.Generate key pairs for each user that can be saved both in resource and apps configuration
 *              3.Loop users created
 *                  3A.Generate vpa for each user that can be saved both in resource and apps configuration            
 *                  3B.Create user_account_app record for all apps except admin
 *                  3C.Create user posts if any
 *                  3D.Create app data master records if any
 *                      3E.Create app data detail records if any
 *                          3F.Create app data detail data records if any
 *                  4.Create social record LIKE, VIEW, VIEW_ANONYMOUS, FOLLOWER, POSTS_LIKE, POSTS_VIEW and POSTS_VIEW_ANONYMOUS
 *                      4A.Create random sample
 *                          Random records are created using 2 lists of all users and creates records until two groups both have 50% samples with unique users in each sample of social type
 *                      4B.Loop random users group 1
 *                      4C.Loop random users group 2
 *                      4D.Create user like
 *                      4E.Create user view by a user
 *                      4F.Create user view by anonymous
 *                      4G.Create user follow
 *                      4H.Create user account app data post like                        
 *                      4I.Create user account app data post view
 *                  5.Return result
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string,
 *          data:{  demo_password?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:{info: {}[]} }>}
 */
 const dbDemoInstall = async parameters=> {
    /**@type{import('../socket.js')} */
    const {socketClientGet, socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('./common.js')} */
    const {dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);
    /**@type{import('./dbModelUserAccount.js')} */
    const dbModelUserAccount = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    /**@type{import('./fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    /**@type{import('./dbModelUserAccountApp.js')} */
    const dbModelUserAccountApp = await import(`file://${process.cwd()}/server/db/dbModelUserAccountApp.js`);
    /**@type{import('./dbModelUserAccountLike.js')} */
    const dbModelUserAccountLike = await import(`file://${process.cwd()}/server/db/dbModelUserAccountLike.js`);
    /**@type{import('./dbModelUserAccountView.js')} */
    const dbModelUserAccountView = await import(`file://${process.cwd()}/server/db/dbModelUserAccountView.js`);
    /**@type{import('./dbModelUserAccountFollow.js')} */
    const dbModelUserAccountFollow = await import(`file://${process.cwd()}/server/db/dbModelUserAccountFollow.js`);
    /**@type{import('./dbModelUserAccountAppDataPost.js')} */
    const dbModelUserAccountAppDataPost = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPost.js`);
    /**@type{import('./dbModelUserAccountAppDataPostLike.js')} */
    const dbModelUserAccountAppDataPostLike = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPostLike.js`);
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
    try {
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
                /**@type{server_db_file_iam_user}*/
                    const data_create = {   username:               demo_user.username,
                                            bio:                    demo_user.bio,
                                            avatar:                 demo_user.avatar,
                                            password:               parameters.data.demo_password ?? '',
                                            password_reminder:      null,
                                            email:                  `demo${++email_index}@localhost`,
                                            email_unverified:       null,
                                            active:                 1,
                                            private:                0,
                                            user_level:             2,
                                            type:                   'USER',
                                            verification_code:      null
                                        };
                    //create iam user then database user
                    return await fileModelIamUser.postAdmin(parameters.app_id,data_create)
                                 .then(new_iam_user=>{
                                        if (new_iam_user.result)
                                                return dbModelUserAccount.post(parameters.app_id, {iam_user_id:new_iam_user.result.insertId })
                                                    .then(result=>{
                                                        if (result.result)
                                                            return result;
                                                        else
                                                            throw result;
                                                            });
                                        else
                                            throw new_iam_user;
                                });
                };
                for (const demo_user of demo_users){
                    demo_user.id = await create_update_id(demo_user).then(user=>user.result.insertId);
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
                dbModelUserAccountApp.post(parameters.app_id, {data_app_id:app_id, user_account_id:user_account_id})
                .then(result=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_user_account_app++;
                        resolve(null);
                    }
                    else
                        reject(result);
                });
            });
        };
        /**
         * Create user post
         * @param {server_db_sql_parameter_user_account_app_data_post_createUserPost} data 
         * @returns {Promise.<null>}
         */
        const create_user_post = async (data) => {
            return new Promise((resolve, reject) => {
                /**@ts-ignore */
                data.initial=0;
                dbModelUserAccountAppDataPost.createUserPost({app_id:parameters.app_id, 
                                /**@ts-ignore */
                                data:data})
                .then(result=>{
                    if(result.result){
                        if (result.result.data?.affectedRows == 1)
                            records_user_account_app_data_post++;
                        resolve(null);
                    }
                    else
                        reject(result);
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
                dbModelAppDataResourceMaster.post({app_id:user_account_post_app_id, data:data})
                .then(result=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_user_account_resource_master++;
                        resolve(result.result.insertId);
                    }
                    else
                        reject(result);
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
                dbModelAppDataResourceDetail.post({app_id:user_account_post_app_id, data:data})
                .then(result=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_user_account_resource_detail++;
                        resolve(result.result.insertId);
                    }
                    else
                        reject(result);
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
                dbModelAppDataResourceDetailData.post({app_id:user_account_post_app_id, data:data})
                .then(result=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_user_account_resource_detail_data++;
                        resolve(result.result.insertId);
                    }
                    else
                        reject(result);
                });
            });
        };

        //1.Create all users first and update with id
        await create_users(demo_users);
        /**@type{server_db_file_app[]}*/
        const apps = fileModelApp.get({app_id:parameters.app_id, resource_id:null}).result;
        
        //2.Generate key pairs for each user that can be saved both in resource and apps configuration
        //Use same for all demo users since key creation can be slow
        socketAdminSend({   app_id:parameters.app_id, 
                            idToken:parameters.idToken,
                            data:{  app_id:null,
                                    client_id:socketClientGet(parameters.idToken),
                                    broadcast_type:'PROGRESS',
                                    broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:install_total_count, text:'Generating key pair...'})).toString('base64')
                                }});
        const {publicKey, privateKey} = await securityKeyPairCreate();
        const demo_public_key = publicKey;
        const demo_private_key = privateKey;
        //3.Loop users created
        for (const demo_user of demo_users){
            socketAdminSend({   app_id:parameters.app_id, 
                                idToken:parameters.idToken,
                                data:{  app_id:null,        
                                        client_id:socketClientGet(parameters.idToken),
                                        broadcast_type:'PROGRESS',
                                        broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:install_total_count, text:demo_user.username})).toString('base64')
                                }
                            });
            install_count++;

            //3A.Generate vpa for each user that can be saved both in resource and apps configuration
            const demo_vpa = securityUUIDCreate();
            //3B.Create user_account_app record for all apps except admin
            for (const app of apps.filter(app=>app.id != serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))) ){
                await create_user_account_app(app.id, demo_user.id);
            }
            //3C.Create user posts if any
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
                                                data_app_id: demo_user_account_app_data_post.app_id,
                                                user_account_id: demo_user.id
                                            };	
                await create_user_post(json_data_user_account_app_data_post);
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
                        await fileModelAppSecret.update({   app_id:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, 
                                                            resource_id:resource.app_registry_update_app_id,
                                                            data:{   
                                                                parameter_name:     key[0],
                                                                parameter_value:    value
                                                            }});
                    resource.json_data[key[0]] = value;
                }
                //loop custom secret keys containing USER_ACCOUNT_ID not in json_data
                if (resource.app_update_secret)
                    for (const key of resource.app_update_secret.filter((/**@type{*}*/secret_key)=>Object.values(secret_key)[0]=='USER_ACCOUNT_ID')){
                        const value = value_set([Object.keys(key)[0], Object.values(key)[0]]);
                        await fileModelAppSecret.update({   app_id:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, 
                                                            resource_id:resource.app_registry_update_app_id,
                                                            data:{   
                                                                parameter_name:     Object.keys(key)[0],
                                                                parameter_value:    value
                                                            }});
                    }
                return resource.json_data;
            };
            //3D.Create app data master records if any
            for (const resource_master of demo_user.resource_master ?? []){
                const data = {  
                                user_account_id:                                demo_user.id,
                                user_account_app_id:                            resource_master.user_account_app_app_id,
                                data_app_id:                                    resource_master.app_data_entity_resource_app_data_entity_app_id,
                                app_data_entity_resource_app_data_entity_id:    resource_master.app_data_entity_resource_app_data_entity_id,
                                app_data_entity_resource_id:                    resource_master.app_data_entity_resource_id,
                                json_data:                                      await demo_data_update(resource_master)
                };
                const master_id = await create_resource_master(parameters.app_id, data);
                //3E.Create app data detail records if any
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
                    const detail_id = await create_resource_detail(parameters.app_id, data);
                    //3F.Create app data detail data records if any
                    for (const resource_detail_data of resource_detail.resource_detail_data ?? []){
                        const data ={   app_data_resource_detail_id             : detail_id,
                                        user_account_id                         : demo_user.id,
                                        user_account_app_id                     : resource_detail_data.user_account_app_id,
                                        data_app_id                             : resource_detail_data.data_app_id,
                                        app_data_resource_master_attribute_id   : resource_detail_data.app_data_resource_master_attribute_id,
                                        json_data                               : await demo_data_update(resource_detail_data)
                                        };
                        create_resource_detail_data(parameters.app_id, data);
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
                dbModelUserAccountLike.post({app_id:app_id, resource_id:id, data:{user_account_id:id_like}})
                .then(result => {
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_user_account_like++;
                        resolve(null);
                    }
                    else
                        reject(result);
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
                    if(result.result){
                        if (result.result.affectedRows == 1)
                                records_user_account_view++;
                        resolve(null);
                    }
                    else
                        reject(result);
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
                dbModelUserAccountFollow.post({app_id:app_id, resource_id:id, data:{user_account_id:id_follow}})
                .then(result=>{
                    if(result.result){
                        if (result.result.affectedRows == 1)
                            records_user_account_follow++;
                        resolve(null);
                    }
                    else
                        reject(result);
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
                dbModelUserAccountAppDataPost.getUserPostsByUserId({app_id:parameters.app_id, resource_id:user1, data_app_id:app_id})
                .then(result_posts=>{
                    if (result_posts.result){
                        const random_posts_index = Math.floor(1 + Math.random() * result_posts.result.length - 1 );
                        dbModelUserAccountAppDataPostLike.post({app_id:parameters.app_id, 
                                                                resource_id:user2, 
                                                                data:{  data_app_id:app_id,
                                                                        user_account_app_data_post_id:result_posts.result[random_posts_index].id}})
                        .then(result => {
                            if (result.result){
                                if (result.result.affectedRows == 1)
                                    records_user_account_app_data_post_like++;
                                resolve(null);
                            }
                            else
                                reject(result_posts);
                        });
                    }
                    else
                        reject(result_posts);
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
                dbModelUserAccountAppDataPost.getUserPostsByUserId({app_id:parameters.app_id, resource_id:user1, data_app_id:app_id})
                .then(result_posts=>{
                    if (result_posts.result){
                        //choose random post from user
                        const random_index = Math.floor(1 + Math.random() * result_posts.result.length -1);
                        let user_account_id;
                        if (social_type == 'POSTS_VIEW')
                            user_account_id = user2;
                        else
                            user_account_id = null;
                            dbModelUserAccountAppDataPostView.post(parameters.app_id, {user_account_id: user_account_id,
                                                                            user_account_app_data_post_id: result_posts.result[random_index].id,
                                                                            data_app_id:app_id,
                                                                            client_ip: null,
                                                                            client_user_agent: null
                                                                            })
                            .then(result=>{
                                if (result.result){
                                    if (result.result.affectedRows == 1)
                                        records_user_account_app_data_post_view++;
                                    resolve(null);
                                }
                                else
                                    reject(result);
                            });
                    }
                    else
                        reject(result_posts);
                });
            });
        };
        //4.Create social record
        for (const social_type of social_types){
            socketAdminSend({   app_id:parameters.app_id, 
                                idToken:parameters.idToken,
                                data:{  app_id:null,
                                        client_id:socketClientGet(parameters.idToken),
                                        broadcast_type:'PROGRESS',
                                        broadcast_message:Buffer.from(JSON.stringify({part:install_count, total:install_total_count, text:social_type})).toString('base64')
                                }
                            });
            //4A.Create random sample
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
            //4B.Loop random users group 1
            for (const user1 of random_users1){
                //4C.Loop random users group 2
                for(const user2 of random_users2){
                    switch (social_type){
                        case 'LIKE':{
                            //4D.Create user like
                            await create_likeuser(parameters.app_id, user1, user2);
                            break;
                        }
                        case 'VIEW':{
                            //4E.Create user view by a user
                            await create_user_account_view(parameters.app_id, 
                                                            {   user_account_id: user1,
                                                                user_account_id_view: user2,
                                                                client_ip: null,
                                                                client_user_agent: null
                                                            });
                            break;
                        }
                        case 'VIEW_ANONYMOUS':{
                            //4F.Create user view by anonymous
                            await create_user_account_view(parameters.app_id, 
                                                            {
                                                                user_account_id: null,
                                                                user_account_id_view: user1,
                                                                client_ip: null,
                                                                client_user_agent: null
                                                            });
                            break;
                        }
                        case 'FOLLOWER':{
                            //4G.Create user follow
                            await create_user_account_follow(parameters.app_id, user1, user2);
                            break;
                        }
                        case 'POSTS_LIKE':{
                            //4H.Create user account app data post like
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
                            //4I.Create user account app data post view
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
        //5.Return result
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
        return {result:{info: install_result}, type:'JSON'};
    } catch (error) {
        /**@ts-ignore */
        return error.http?error:dbCommonRecordError(parameters.app_id, 500, error);
    }
    
};
/**
 * @name dbDemoUninstall
 * @description Demo uninstall
 *              Deletes all demo users and send server side events of progress
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          idToken:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{info: {}[]} }>}
 */
const dbDemoUninstall = async parameters => {
    /**@type{import('../socket.js')} */
    const {socketClientGet, socketAdminSend} = await import(`file://${process.cwd()}/server/socket.js`);
    /**@type{import('./fileModelLog.js')} */
    const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
    /**@type{import('./fileModelIamUser.js')} */
	const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);
    /**@type{import('./dbModelUserAccount.js')} */
	const dbModelUserAccount = await import(`file://${process.cwd()}/server/db/dbModelUserAccount.js`);
    /**@type{import('./common.js')} */
    const {dbCommonRecordError} = await import(`file://${process.cwd()}/server/db/common.js`);
    
    const result_demo_users = fileModelIamUser.get(parameters.app_id, null).result.filter((/**@type{server_db_file_iam_user}*/row)=>row.user_level==2);
    if (result_demo_users){
        let deleted_user = 0;
        if (result_demo_users.length>0){
            const delete_users = async () => {
                for (const user of result_demo_users){
                    socketAdminSend({   app_id:parameters.app_id, 
                                        idToken:parameters.idToken,
                                        data:{  app_id:null,
                                                client_id:socketClientGet(parameters.idToken),
                                                broadcast_type:'PROGRESS',
                                                broadcast_message:Buffer.from(JSON.stringify({part:deleted_user, total:result_demo_users.length, text:user.username})).toString('base64')
                                        }
                                    });
                    //delete database user if found
                    const dbUser = await dbModelUserAccount.getIamUser({app_id:parameters.app_id, 
                                                                        /**@ts-ignore */
                                                                        iam_user_id: user.id});
                    if (dbUser.result)
                        await dbModelUserAccount.deleteUser(parameters.app_id,dbUser.result[0]?.id)
                                .then((result)=>{
                                            if (result.result ||result.http==404)
                                                //delete iam user
                                                fileModelIamUser.deleteRecordAdmin(parameters.app_id,user.id)
                                                .then((result)=>{
                                                    if (result.result){
                                                        deleted_user++;
                                                        if (deleted_user == result_demo_users.length)
                                                            return null;
                                                    }
                                                });
                                            else
                                                throw result;
                        });
                    else
                        if (dbUser.result.http!=404)
                            throw dbUser;
                }
            };
            await delete_users().catch(error=>{
                if (error.http)
                    throw error;
                else
                    throw dbCommonRecordError(parameters.app_id, 500, error);
                });
            fileModelLog.postServerI(`Demo uninstall count: ${deleted_user}`);
            return {result:{info: [{'count': deleted_user}]}, type:'JSON'};
        }
        else{
            fileModelLog.postServerI(`Demo uninstall count: ${result_demo_users.length}`);
            return {result:{info: [{'count': result_demo_users.length}]},type:'JSON'};
        }
    }
    else
        return result_demo_users;
};

/**
 * @name DB_POOL
 * @description Starts pool with parameters
 * @function
 * @param {number|null} db_use 
 * @param {boolean} dba 
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
  * @name dbStart
  * @description Start pools for database used
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
        const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
       
        if (db_use == 5)
            await DB_POOL(db_use, false, null, null, null);
        else{
            if (fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`)){
                user = `${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_USER`)}`;
                password = `${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_DBA_PASS`)}`;
                await DB_POOL(db_use, true, user, password, null);
            }
            for (const app  of fileModelApp.get({app_id:null, resource_id:null}).result.filter((/**@type{server_db_file_app}*/app)=>
                app.id !=serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) &&
                app.id !=serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_ADMIN_APP_ID')))){
                const app_secret = fileModelAppSecret.get({app_id:common_app_id, resource_id:null}).result.filter((/**@type{server_db_file_app_secret}*/app_secret)=> app.id == app_secret.app_id)[0];
                /**@ts-ignore */
                if (app_secret[`service_db_db${db_use}_app_user`])
                    await DB_POOL(  db_use, 
                                    false, 
                                    /**@ts-ignore */
                                    app_secret[`service_db_db${db_use}_app_user`],
                                    /**@ts-ignore */
                                    app_secret[`service_db_db${db_use}_app_password`],
                                    app.id);
            }  
        }
    }
 };
 /**
  * @name dbUserCreate
  * @description Creates app user in database with basic grant and default role if the database supports it
  * @function
  * @param {{   app_id:number,
  *             username:string,
  *             password:string}} parameters
  * @returns {Promise.<server_server_response & {result:null}>}
  */
 const dbUserCreate = async parameters =>{
    /**@type{import('./common.js')} */
    const {dbCommonExecute} = await import(`file://${process.cwd()}/server/db/common.js`);
    //using template literals since bind variables not supported for DDL
    const user_sql = [
        {db: 1, sql: `CREATE USER ${parameters.username} IDENTIFIED BY ${parameters.password} ACCOUNT UNLOCK`},
        {db: 1, sql: `GRANT app_portfolio_role_app_common TO ${parameters.username}`},
        {db: 1, sql: `SET DEFAULT ROLE app_portfolio_role_app_common FOR ${parameters.username}`},
        {db: 2, sql: `CREATE USER ${parameters.username} IDENTIFIED BY ${parameters.password} ACCOUNT UNLOCK`},
        {db: 2, sql: `GRANT app_portfolio_role_app_common TO ${parameters.username}`},
        {db: 2, sql: `SET DEFAULT ROLE ALL TO ${parameters.username}`},
        {db: 3, sql: `CREATE USER ${parameters.username} PASSWORD ${parameters.password}`},
        {db: 3, sql: `GRANT app_portfolio_role_app_common TO ${parameters.username}`},
        {db: 4, sql: `CREATE USER ${parameters.username} IDENTIFIED BY ${parameters.password}`},
        {db: 4, sql: `GRANT app_portfolio_role_app_common TO ${parameters.username}`},
        {db: 4, sql: `GRANT UNLIMITED TABLESPACE TO ${parameters.username}`}
    ];
    if (serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))==5)
        return {result:null,type:'JSON'};
    else{
        for (const row of user_sql.filter(row=>
                                /**@ts-ignore */
                                row.db == [serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))])){
            const result = await dbCommonExecute(parameters.app_id, 
                            /**@ts-ignore */
                            row.sql, 
                            {});
            if (result.http) 
                throw result;
        }
        return {result : null, type:'JSON'};
    }
 };
 /**
  * @name dbUserDrop
  * @description Drops user in database
  * @function
  * @param {{   app_id:number,
  *             username:string}} parameters
  * @returns {*}
  */
const dbUserDrop = parameters =>{
    if (serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))==5)
        return null;
    else
        //return all result in an arrray
        return import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
                dbCommonExecute(parameters.app_id, 
                    /**@ts-ignore */
                    `DROP USER ${parameters.username}`, 
                    {}));
 };
 
export{dbInfo, dbInfoSpace, dbInfoSpaceSum, dbInstall, dbInstalledCheck, dbUninstall, dbDemoInstall, dbDemoUninstall, dbStart,
    dbUserCreate, dbUserDrop
};