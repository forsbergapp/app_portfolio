const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

//mysql module used for both MariaDB and MySQL
let MYSQL               = await import("mysql");
let {default: PG}       = await import('pg');
let {default: ORACLEDB} = await import('oracledb');


let POOL_DB1_APP = [];
let POOL_DB2_APP = [];
let POOL_DB3_APP = [];
let POOL_DB4_APP = [];

const DBInit = () => {
   if (ConfigGet(1, 'SERVICE_DB', 'USE')=='4'){
      ORACLEDB.autoCommit = true;
      ORACLEDB.fetchAsString = [ ORACLEDB.CLOB ];
      ORACLEDB.initOracleClient({ libDir: ConfigGet(1, 'SERVICE_DB', 'DB4_LIBDIR'),
                                  configDir:ConfigGet(1, 'SERVICE_DB', 'DB4_CONFIGDIR')});
      ORACLEDB.outFormat = ORACLEDB.OUT_FORMAT_OBJECT;
   }
}
const DBInfo = async (app_id, callBack) => {
   const {db_execute, db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);
   let sql;
   let parameters;
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
   parameters = {	
                  database: db_use,
                  Xdatabase_schema: db_schema()
                  };
   let stack = new Error().stack;
   import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
      db_execute(app_id, sql, parameters, 2, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
         if (err)
            return callBack(err, null);
         else{
               if (db_use == 4){
                  let hostname = JSON.parse(result[0].hostname.toLowerCase()).public_domain_name + 
                                 ' (' + JSON.parse(result[0].hostname.toLowerCase()).outbound_ip_address + ')';
                  result[0].database_schema += ' (' + JSON.parse(result[0].hostname.toLowerCase()).database_name + ')';
                  result[0].hostname = hostname;
               }
               return callBack(null, result[0]);
            }
            
      });
   })
}
const DBInfoSpace = async (app_id, callBack) => {
   const {db_execute, db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);
   let sql;
   let parameters;
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
   parameters = {db_schema: db_schema()};
   let stack = new Error().stack;
   import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
      db_execute(app_id, sql, parameters, 2, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
         if (err)
            return callBack(err, null);
         else
            return callBack(null, result);
      });
   })
}
const DBInfoSpaceSum = async (app_id, callBack) => {
   const {db_execute, db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);
   let sql;
   let parameters;
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
                   AND ds.segment_type = 'TABLE'`
         break;
      }
   }
   parameters = {db_schema: db_schema()};
   let stack = new Error().stack;
   import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
      db_execute(app_id, sql, parameters, 2, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
         if (err)
            return callBack(err, null);
         else
            return callBack(null, result[0]);
      });
   })
}
const DBStart = async () => {
   const {COMMON} = await import(`file://${process.cwd()}/server/server.service.js`);
   const {createLogAppS} = await import(`file://${process.cwd()}/server/log/log.service.js`);
   return await new Promise((resolve, reject) => {
      let stack = new Error().stack;
      if (ConfigGet(1, 'SERVICE_DB', 'START')=='1'){
         DBInit();
         const startDBpool = async (app_id, db_user, db_password) => {
            return await new Promise((resolve, reject) => {
               const db_use = ConfigGet(1, 'SERVICE_DB', 'USE');
               const pool_log = (err) =>{
                  if (err){
                     createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                    `DB ${db_use} startDBpool ${app_id} user: ` + db_user + `, err:${err}`).then(() => {
                        reject(err);
                     })
                  }
                  else{
                     // log with common app id at startup for all apps
                     createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                    `DB ${db_use} startDBpool ${app_id} user: ` + db_user).then(() => {
                        resolve();
                     })
                  }
               }
               switch(db_use){
                  case '1':{
                     POOL_DB1_APP.push([app_id,
                                       MYSQL.createPool({
                                          port: ConfigGet(1, 'SERVICE_DB', 'DB1_PORT'),
                                          host: ConfigGet(1, 'SERVICE_DB', 'DB1_HOST'),
                                          user: db_user,
                                          password: db_password,
                                          database: ConfigGet(1, 'SERVICE_DB', 'DB1_NAME'),
                                          charset: ConfigGet(1, 'SERVICE_DB', 'DB1_CHARACTERSET'),
                                          connnectionLimit: ConfigGet(1, 'SERVICE_DB', 'DB1_CONNECTION_LIMIT')
                                       })
                                       ]);
                     pool_log();
                     break;
                  }
                  case '2':{
                     POOL_DB2_APP.push([app_id,
                                       MYSQL.createPool({
                                          port: ConfigGet(1, 'SERVICE_DB', 'DB2_PORT'),
                                          host: ConfigGet(1, 'SERVICE_DB', 'DB2_HOST'),
                                          user: db_user,
                                          password: db_password,
                                          database: ConfigGet(1, 'SERVICE_DB', 'DB2_NAME'),
                                          charset: ConfigGet(1, 'SERVICE_DB', 'DB2_CHARACTERSET'),
                                          connnectionLimit: ConfigGet(1, 'SERVICE_DB', 'DB2_CONNECTION_LIMIT')
                                       })
                                       ]);
                     pool_log();
                     break;
                  }
                  case '3':{
                     POOL_DB3_APP.push([app_id,
                                                new PG.Pool({
                                                   user: db_user,
                                                   password: db_password,
                                                   host: ConfigGet(1, 'SERVICE_DB', 'DB3_HOST'),
                                                   database: ConfigGet(1, 'SERVICE_DB', 'DB3_NAME'),
                                                   port: ConfigGet(1, 'SERVICE_DB', 'DB3_PORT'),
                                                   connectionTimeoutMillis: ConfigGet(1, 'SERVICE_DB', 'DB3_TIMEOUT_CONNECTION'),
                                                   idleTimeoutMillis: ConfigGet(1, 'SERVICE_DB', 'DB3_TIMEOUT_IDLE'),
                                                   max: ConfigGet(1, 'SERVICE_DB', 'DB3_MAX')})
                                                ]);
                     pool_log();
                     break;
                  }
                  case '4':{
                     POOL_DB4_APP.push([app_id, 
                                        `POOL_DB4_APP_${app_id}`
                                       ]);
                     ORACLEDB.createPool({	
                        user:  db_user,
                        password: db_password,
                        connectString: ConfigGet(1, 'SERVICE_DB', 'DB4_CONNECTSTRING'),
                        poolMin: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_MIN')),
                        poolMax: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_MAX')),
                        poolIncrement: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_INCREMENT')),
                        poolAlias: `POOL_DB4_APP_${app_id}`
                     }, (err,result) => {
                        if (err)
                           pool_log(err);
                        else
                           pool_log();
                     });
                     break;
                  }
               }
         })
         }
         const startDBApps = () => {
            let json;
            import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_parameter/app_parameter.service.js`).then(({ getAppDBParametersAdmin }) => {
               //app_id inparameter for log, all apps will be returned
               getAppDBParametersAdmin(ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),(err, results) =>{
                  if (err) {
                     createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                                    `getAppDBParameters, err:${err}`).then(() => {
                        reject(err);
                     })
                  }
                  else {
                     json = JSON.parse(JSON.stringify(results));
                     let dbcounter =1;
                     for (let i = 1; i < json.length; i++) {
                        let startDBpool_result = startDBpool(json[i].id, json[i].db_user, json[i].db_password)
                        .then(() => {
                           dbcounter++;
                           //return when all db pools started, can be in random order
                           if (dbcounter==json.length)
                              resolve();
                        })
                        .catch((err) => {
                           reject(err);
                        });
                     }
                  }
               }); 
            })
         }
         const admin_pool_log_startDBApps = (db_use, admin_user, err) => {
            if (err){
               createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                              `${db_use} admin_pool_log ADMIN user: ${admin_user}, err:${err}`).then(() => {
                  reject(err);
               })
            }
            else{
               // log with common app id at startup for all apps
               createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                           `${db_use} admin_pool_log ADMIN user: ${admin_user}`).then(() => {
                  startDBApps()
               })
            }
         }
         /*
         db pool usage where get_pool() gets correct pool to access database 
         with the correct admin, system admin or app credentials:
         POOL_DB[USE]_APP [APP_COMMON_APP_ID,   admin pool, system admin pool]
         POOL_DB[USE]_APP [app_id,              app pool]
         */
         switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
            case '1':{
               //both system admin db pool and admin db pool should be enabled
               if (ConfigGet(1, 'SERVICE_DB', 'DB1_SYSTEM_ADMIN_USER') &&
                   ConfigGet(1, 'SERVICE_DB', 'DB1_APP_ADMIN_USER')){
                  POOL_DB1_APP.push([ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
                                    MYSQL.createPool({
                                       port: ConfigGet(1, 'SERVICE_DB', 'DB1_PORT'),
                                       host: ConfigGet(1, 'SERVICE_DB', 'DB1_HOST'),
                                       user: ConfigGet(1, 'SERVICE_DB', 'DB1_APP_ADMIN_USER'),
                                       password: ConfigGet(1, 'SERVICE_DB', 'DB1_APP_ADMIN_PASS'),
                                       database: ConfigGet(1, 'SERVICE_DB', 'DB1_NAME'),
                                       charset: ConfigGet(1, 'SERVICE_DB', 'DB1_CHARACTERSET'),
                                       connnectionLimit: ConfigGet(1, 'SERVICE_DB', 'DB1_CONNECTION_LIMIT')
                                    }),
                                    MYSQL.createPool({
                                       port: ConfigGet(1, 'SERVICE_DB', 'DB1_PORT'),
                                       host: ConfigGet(1, 'SERVICE_DB', 'DB1_HOST'),
                                       user: ConfigGet(1, 'SERVICE_DB', 'DB1_SYSTEM_ADMIN_USER'),
                                       password: ConfigGet(1, 'SERVICE_DB', 'DB1_SYSTEM_ADMIN_PASS'),
                                       database: ConfigGet(1, 'SERVICE_DB', 'DB1_NAME'),
                                       charset: ConfigGet(1, 'SERVICE_DB', 'DB1_CHARACTERSET'),
                                       connnectionLimit: ConfigGet(1, 'SERVICE_DB', 'DB1_CONNECTION_LIMIT')
                                    })
                                    ]);
                  return admin_pool_log_startDBApps(1, ConfigGet(1, 'SERVICE_DB', 'DB1_APP_ADMIN_USER'));
               }
               else
                  resolve();
               break;
            }
            case '2':{
               //both system admin db pool and admin db pool should be enabled
               if (ConfigGet(1, 'SERVICE_DB', 'DB2_SYSTEM_ADMIN_USER') &&
                   ConfigGet(1, 'SERVICE_DB', 'DB2_APP_ADMIN_USER')){
                  POOL_DB2_APP.push([ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
                                    MYSQL.createPool({
                                       port: ConfigGet(1, 'SERVICE_DB', 'DB2_PORT'),
                                       host: ConfigGet(1, 'SERVICE_DB', 'DB2_HOST'),
                                       user: ConfigGet(1, 'SERVICE_DB', 'DB2_APP_ADMIN_USER'),
                                       password: ConfigGet(1, 'SERVICE_DB', 'DB2_APP_ADMIN_PASS'),
                                       database: ConfigGet(1, 'SERVICE_DB', 'DB2_NAME'),
                                       charset: ConfigGet(1, 'SERVICE_DB', 'DB2_CHARACTERSET'),
                                       connnectionLimit: ConfigGet(1, 'SERVICE_DB', 'DB2_CONNECTION_LIMIT')
                                    }),
                                    MYSQL.createPool({
                                       port: ConfigGet(1, 'SERVICE_DB', 'DB2_PORT'),
                                       host: ConfigGet(1, 'SERVICE_DB', 'DB2_HOST'),
                                       user: ConfigGet(1, 'SERVICE_DB', 'DB2_SYSTEM_ADMIN_USER'),
                                       password: ConfigGet(1, 'SERVICE_DB', 'DB2_SYSTEM_ADMIN_PASS'),
                                       database: ConfigGet(1, 'SERVICE_DB', 'DB2_NAME'),
                                       charset: ConfigGet(1, 'SERVICE_DB', 'DB2_CHARACTERSET'),
                                       connnectionLimit: ConfigGet(1, 'SERVICE_DB', 'DB2_CONNECTION_LIMIT')
                                    })
                                    ]);
                  return admin_pool_log_startDBApps(2, ConfigGet(1, 'SERVICE_DB', 'DB2_APP_ADMIN_USER'));
               }
               else
                  resolve();
               break;
            }
            case '3':{
               //both system admin db pool and admin db pool should be enabled
               if (ConfigGet(1, 'SERVICE_DB', 'DB3_SYSTEM_ADMIN_USER') &&
                   ConfigGet(1, 'SERVICE_DB', 'DB3_APP_ADMIN_USER')){
                  POOL_DB3_APP.push([ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
                                    new PG.Pool({
                                       user: ConfigGet(1, 'SERVICE_DB', 'DB3_APP_ADMIN_USER'),
                                       password: ConfigGet(1, 'SERVICE_DB', 'DB3_APP_ADMIN_PASS'),
                                       host: ConfigGet(1, 'SERVICE_DB', 'DB3_HOST'),
                                       database: ConfigGet(1, 'SERVICE_DB', 'DB3_NAME'),
                                       port: ConfigGet(1, 'SERVICE_DB', 'DB3_PORT'),
                                       connectionTimeoutMillis: ConfigGet(1, 'SERVICE_DB', 'DB3_TIMEOUT_CONNECTION'),
                                       idleTimeoutMillis: ConfigGet(1, 'SERVICE_DB', 'DB3_TIMEOUT_IDLE'),
                                       max: ConfigGet(1, 'SERVICE_DB', 'DB3_MAX')
                                    }),
                                    new PG.Pool({
                                       user: ConfigGet(1, 'SERVICE_DB', 'DB3_SYSTEM_ADMIN_USER'),
                                       password: ConfigGet(1, 'SERVICE_DB', 'DB3_SYSTEM_ADMIN_PASS'),
                                       host: ConfigGet(1, 'SERVICE_DB', 'DB3_HOST'),
                                       database: ConfigGet(1, 'SERVICE_DB', 'DB3_NAME'),
                                       port: ConfigGet(1, 'SERVICE_DB', 'DB3_PORT'),
                                       connectionTimeoutMillis: ConfigGet(1, 'SERVICE_DB', 'DB3_TIMEOUT_CONNECTION'),
                                       idleTimeoutMillis: ConfigGet(1, 'SERVICE_DB', 'DB3_TIMEOUT_IDLE'),
                                       max: ConfigGet(1, 'SERVICE_DB', 'DB3_MAX')
                                    })
                                    ]);
                  return admin_pool_log_startDBApps(3, ConfigGet(1, 'SERVICE_DB', 'DB3_APP_ADMIN_USER'));
               }
               else
                  resolve();
               break;
            }
            case '4':{
               /* 
               other params and default values
               // edition: 'ORA$BASE', // used for Edition Based Redefintion
               // events: false, // whether to handle Oracle Database FAN and RLB events or support CQN
               // externalAuth: false, // whether connections should be established using External Authentication
               // homogeneous: true, // all connections in the pool have the same credentials
               // poolAlias: 'default', // set an alias to allow access to the pool via a name.
               // poolIncrement: 1, // only grow the pool by one connection at a time
               // poolMax: 4, // maximum size of the pool. Increase UV_THREADPOOL_SIZE if you increase poolMax
               // poolMin: 0, // start with no connections; let the pool shrink completely
               // poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
               // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
               // queueMax: 500, // don't allow more than 500 unsatisfied getConnection() calls in the pool queue
               // queueTimeout: 60000, // terminate getConnection() calls queued for longer than 60000 milliseconds
               // sessionCallback: myFunction, // function invoked for brand new connections or by a connection tag mismatch
               // sodaMetaDataCache: false, // Set true to improve SODA collection access performance
               // stmtCacheSize: 30, // number of statements that are cached in the statement cache of each connection
               // enableStatistics: false // record pool usage for ORACLEDB.getPool().getStatistics() and logStatistics()
               */
               //both system admin db pool and admin db pool should be enabled
               if (ConfigGet(1, 'SERVICE_DB', 'DB4_SYSTEM_ADMIN_USER') &&
                   ConfigGet(1, 'SERVICE_DB', 'DB4_APP_ADMIN_USER')){
                     ORACLEDB.createPool({ user: ConfigGet(1, 'SERVICE_DB', 'DB4_APP_ADMIN_USER'),
                                           password: ConfigGet(1, 'SERVICE_DB', 'DB4_APP_ADMIN_PASS'),
                                           connectString: ConfigGet(1, 'SERVICE_DB', 'DB4_CONNECTSTRING'),
                                           poolMin: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_MIN')),
                                           poolMax: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_MAX')),
                                           poolIncrement: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_INCREMENT')),
                                           poolAlias: `POOL_DB4_APP_${ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')}_APP_ADMIN`}, (err,result_app_admin_pool) => {
                        // log with common app id at startup for all apps
                        if (err)
                           return admin_pool_log_startDBApps(4, ConfigGet(1, 'SERVICE_DB', 'DB4_APP_ADMIN_USER'), err);
                        else{
                           ORACLEDB.createPool({ user: ConfigGet(1, 'SERVICE_DB', 'DB4_SYSTEM_ADMIN_USER'),
                                                 password: ConfigGet(1, 'SERVICE_DB', 'DB4_SYSTEM_ADMIN_PASS'),
                                                 connectString: ConfigGet(1, 'SERVICE_DB', 'DB4_CONNECTSTRING'),
                                                 poolMin: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_MIN')),
                                                 poolMax: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_MAX')),
                                                 poolIncrement: parseInt(ConfigGet(1, 'SERVICE_DB', 'DB4_POOL_INCREMENT')),
                                                 poolAlias: `POOL_DB4_APP_${ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')}_SYSTEM_ADMIN`}, (err,result_system_admin_pool) => {
                              if (err){
                                 return admin_pool_log_startDBApps(4, ConfigGet(1, 'SERVICE_DB', 'DB4_SYSTEM_ADMIN_USER'), err);
                              }
                              else{
                                 POOL_DB4_APP.push([ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
                                    `POOL_DB4_APP_${ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')}_APP_ADMIN`,
                                    `POOL_DB4_APP_${ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')}_SYSTEM_ADMIN`
                                 ]);
                                 return admin_pool_log_startDBApps(4, ConfigGet(1, 'SERVICE_DB', 'DB4_SYSTEM_ADMIN_USER'));
                              }
                           })
                        }							
                     });
               }
               else
                  resolve();
               break;
            }
         }
      }
      else
         resolve();
   })
}
const DBStop = async (app_id, callBack) => {
   //relase db pools from memory, not shutting down db
   POOL_DB1_APP = [];
   POOL_DB2_APP = [];
   POOL_DB3_APP = [];
   POOL_DB4_APP = [];
   MYSQL = null;
   MYSQL = await import('mysql');
   PG = null;
   PG = await import('pg');
   ORACLEDB = null;
   ORACLEDB = await import('oracledb');
}
const get_pool = (app_id, pool_col=1) => {
   let pool = null;
   let stack = new Error().stack;
   const pool_filter = (dbpool) => (parseInt(dbpool[0]) == parseInt(app_id));
   if (pool_col==null)
      pool_col = 1;
   try{
      switch (ConfigGet(1, 'SERVICE_DB', 'USE')){
         case '1':{
            pool = POOL_DB1_APP.filter(pool_filter)[0][pool_col];
            break;
         }
         case '2':{
            pool = POOL_DB2_APP.filter(pool_filter)[0][pool_col];
            break;
         }
         case '3':{
            pool = POOL_DB3_APP.filter(pool_filter)[0][pool_col];
            break;
         }
         case '4':{
            pool = POOL_DB4_APP.filter(pool_filter)[0][pool_col];
            break;
         }
      }
   }catch (err) {
      //unknown app id requested
      import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
         import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
            createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                          'get_pool error app_id: ' + app_id).then(() => {
               return null;
            })
         });
      })
   }
   return pool;
}
const demo_add = async (app_id, demo_password, lang_code, callBack)=> {
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
		let password_encrypted = hashSync(demo_password, genSaltSync(10));
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
					create(app_id, JSON.parse(json_data_user), (err, results_create) => {
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
		let apps = await getAppsAdminId(app_id);
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
							result_insert = await create_likeuser(app_id, user1, user2);
							break;
						}
						case 'VIEW':{
							result_insert = await create_user_account_view(app_id, JSON.parse(
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
							result_insert = await create_user_account_view(app_id, JSON.parse(
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
							result_insert = await create_user_account_follow(app_id, user1, user2);
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
      return callBack(null, {
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
			return callBack(checked_error(app_id, lang_code, error, res));
		})
	}	
}
const demo_delete = async (app_id, callBack)=> {
	import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`).then(({getDemousers, deleteUser})=>{
		getDemousers(app_id, (err, result_demo_users) =>{
			if (err) {
            return callBack(err, null);
			}
			else{
				let deleted_user = 0;
				if (result_demo_users.length>0){
					const delete_user = async () => {
						return new Promise((resolve, reject)=>{
							for (let user of result_demo_users){
								deleteUser(app_id, user.id,  (err, result_deleteUser) =>{
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
                  return callBack(null, result_demo_users.length);
					});
				}
				else
               return callBack(null, result_demo_users.length);
			}
		});
	})
}
const demo_get = async (app_id, callBack)=> {
	import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`).then(({getDemousers})=>{
		getDemousers(app_id, (err, result_demo_users) =>{
			if (err)
            return callBack(err, null);
         else
            return callBack(null, result_demo_users);
		})
	})
}
const install_db_execute_statement = async (app_id, sql, parameters) => {
   let {COMMON} = await import(`file://${process.cwd()}/server/server.service.js`);
   let stack = new Error().stack;
   return new Promise((resolve, reject) =>{
      db_execute(app_id, sql, parameters, 2, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
         if (err)
            reject(err);
         else
            resolve(result);
      });

   })
}
const install_db = async (app_id, callBack)=> {
   
   const {db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);
   let {createHash} = await import('node:crypto');
   let fs = await import('node:fs');
   let count_statements = 0;
   let users_created = [];
   try {
      const files = [
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
               ]
            } 
         */
         [0, `file://${process.cwd()}/scripts/install_database.json`],
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
         [1, `file://${process.cwd()}/apps/admin/scripts/install_database.json`]
      ];
      //loop apps
      let app_installed = 1;
      fs.access(`${process.cwd()}/apps/app${app_installed}/scripts/install_database.json`, (err) => {
            if (err)
               return;
            else{
               files.push([app_installed + 1, `file://${process.cwd()}/apps/app${app_installed}/scripts/install_database.json`]);
               app_installed += 1; 
            }
      })
      for (let json in files){
         for (let install_row in install_json.install.filter((db) => db == ConfigGet(1, 'SERVICE_DB', 'USE') || null)){
            let install_json;
            switch (json[0]){
               case 0:{
                  //main script
                  install_json = JSON.parse(await fs.promises.readFile(`file://${process.cwd()}/scripts/${install_row.script}`, 'utf8'));
                  break;
               }
               case 1:{
                  //admin script
                  install_json = JSON.parse(await fs.promises.readFile(`file://${process.cwd()}/apps/admin/scripts/${install_row.script}`, 'utf8'));
                  break;
               }
               default:{
                  //app scripts
                  install_json = JSON.parse(await fs.promises.readFile(`file://${process.cwd()}/apps/app${app_installed}/scripts/${install_row.script}`, 'utf8'));
               }
            }
            //split script file into separate sql statements
            for (let sql in install_json.split(';')){
               let result_statement;
               //ignore some sql in main script, these are executed in users sql
               if (json[0] == 0 && 
                  (sql.includes('CREATE USER app_admin') ||
                   sql.includes('CREATE USER app_app1') ||
                   sql.includes('CREATE USER app_app2') ||
                   sql.includes('CREATE USER app_app3') ||
                   sql.includes('GRANT role_app_admin TO app_admin') ||
                   sql.includes('GRANT role_app_common TO app1') ||
                   sql.includes('GRANT role_app_common TO app2') ||
                   sql.includes('GRANT role_app_common TO app3')))
                  continue;
               else{
                  if (json[0] == 0){
                     if (sql.includes('<APP_PASSWORD/>')){
                        let sha256_password = createHash('sha256').update(new Date().toISOString()).digest('hex');
                        users_created.push({"username": "app_portfolio", "password": sha256_password});
                        sql.replace('<APP_PASSWORD/>', sha256_password);
                     }
                  }
                  result_statement = await install_db_execute_statement(app_id, sql, {});
               }
            }  
         }
         for (let users_row in install_json.users.filter((db) => db == ConfigGet(1, 'SERVICE_DB', 'USE'))){
            switch (json[0]){
               case 1:{
                  if (users_row.sql.includes('<APP_PASSWORD/>')){
                     let sha256_password = createHash('sha256').update(new Date().toISOString()).digest('hex');
                     users_created.push({"username": "admin", "password": sha256_password});
                     users_row.sql.replace('<APP_PASSWORD/>', sha256_password);
                     //update server parameter
                  }
                  break;
               }
               default:{
                  if (users_row.sql.includes('<APP_PASSWORD/>')){
                     let sha256_password = createHash('sha256').update(new Date().toISOString()).digest('hex');
                     users_created.push({"username": `app${json[0]}`, "password": sha256_password});
                     users_row.sql.replace('<APP_PASSWORD/>', sha256_password);
                     result_statement = await install_db_execute_statement(
                                                               app_id, 
                                                               `UPDATE ${db_schema()}.app_parameter 
                                                                     SET parameter_value = :password;
                                                                  WHERE app_id = :app_id
                                                                     AND parameter_name = :parameter_name`, 
                                                               {	
                                                                  app_id: json[0],
                                                                  password: sha256_password,
                                                                  parameter_name: 'SERVICE_DB_APP_PASSWORD'
                                                               });
                     count_statements += 1;
                  }
                  break;
               }
            }
            result_statement = await execute_statement(app_id, users_row.sql, {});
            count_statements += 1;
         }
      }
      return callBack(null, {"count_statements": count_statements});
   } 
      catch (error) {
			return callBack(error, null);
   }
}
const install_db_check = async (app_id, callBack)=> {
   const {db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);
   try {
      let result_statement = await install_db_execute_statement(
         app_id, 
         `SELECT 1 FROM ${db_schema()}.app
            WHERE id = :app_id`, 
         {app_id: app_id});
         return callBack(null, {"installed": 1});
   } catch (error) {
      return callBack(null, {"installed": 0});
   }
}
const install_db_delete = async (app_id, callBack)=> {
   const {db_execute, db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);
   let fs = await import('node:fs');
   let count_statements = 0;
   const files = [
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
      [0, `file://${process.cwd()}/scripts/uninstall_database.json`],
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
      [1, `file://${process.cwd()}/apps/admin/scripts/uninstall_database.json`]
   ];
   //loop apps with uninstall_database.json
   let app_installed = 1;
   fs.access(`${process.cwd()}/apps/app${app_installed}/scripts/uninstall_database.json`, (err) => {
      if (err)
         return;
      else{
         files.push([app_installed + 1, `file://${process.cwd()}/apps/app${app_installed}/scripts/uninstall_database.json`]);
         app_installed += 1; 
      }
   })
   for (let json in files){
      for (let install_row in install_json.install.filter((db) => db == ConfigGet(1, 'SERVICE_DB', 'USE') || null)){
         let uninstall_json;
         let result_statement;
         switch (json[0]){
            case 0:{
               //main script
               uninstall_json = JSON.parse(await fs.promises.readFile(`file://${process.cwd()}/scripts/${install_row.script}`, 'utf8'));
               break;
            }
            case 1:{
               //admin script
               uninstall_json = JSON.parse(await fs.promises.readFile(`file://${process.cwd()}/apps/admin/scripts/${install_row.script}`, 'utf8'));
               break;
            }
            default:{
               //app scripts
               uninstall_json = JSON.parse(await fs.promises.readFile(`file://${process.cwd()}/apps/app${app_installed}/scripts/${install_row.script}`, 'utf8'));
            }
         }
         for (let sql_row in uninstall_json.uninstall.filter((db) => db == ConfigGet(1, 'SERVICE_DB', 'USE'))){
            result_statement = await install_db_execute_statement(app_id, sql_row.sql, {});
            count_statements += 1;
         }
         /*update parameters in config.json
            DB[USE]_SYSTEM_ADMIN_USER = null
            DB[USE]_SYSTEM_ADMIN_PASS = null
            DB[USE]_APP_ADMIN_USER = null
            DB[USE]_APP_ADMIN_PASS = null
         */
      }
   }
	return callBack(null);
}

export{ORACLEDB, 
       DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop, get_pool, demo_add, demo_get, demo_delete, install_db, install_db_check, install_db_delete}