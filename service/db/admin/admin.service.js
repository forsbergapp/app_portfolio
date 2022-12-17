var global_pool_db1_app = [];
var global_pool_db2_app = [];
var global_pool_db3_app = [];
var mysql = require("mysql");
var oracledb = require('oracledb');
var pg = require('pg');
function DBInit(){
   if (process.env.SERVICE_DB_USE==2){
      oracledb.autoCommit = true;
      oracledb.fetchAsString = [ oracledb.CLOB ];
      oracledb.initOracleClient({ libDir: process.env.SERVICE_DB_DB2_LIBDIR,
                                  configDir:process.env.SERVICE_DB_DB2_CONFIGDIR});
      oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
   }
}

const { createLogAppSI, createLogAppSE } = require("../../log/log.controller");

module.exports = {
	DBInfo:(app_id, callBack) => {
      const {execute_db_sql, get_schema_name} = require ("../common/common.service");
		let sql;
		let parameters;
      switch (process.env.SERVICE_DB_USE){
         case '1':{
            let table_global_variables;
            if (process.env.SERVICE_DB_DB1_VARIANT==1){
               //MySQL
               table_global_variables = 'performance_schema';
            }
            else{
               //MariaDB
               table_global_variables = 'information_schema';
            }
               
            sql = `SELECT	:database database_use,
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
         case '2':{
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
      }
      parameters = {	
                     database: process.env.SERVICE_DB_USE,
                     Xdatabase_schema: get_schema_name()
                   };
      execute_db_sql(app_id, sql, parameters,
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else{
                if (process.env.SERVICE_DB_USE==2){
                    let hostname = JSON.parse(result[0].hostname.toLowerCase()).public_domain_name + 
                                   ' (' + JSON.parse(result[0].hostname.toLowerCase()).outbound_ip_address + ')';
                    result[0].database_schema += ' (' + JSON.parse(result[0].hostname.toLowerCase()).database_name + ')';
                    result[0].hostname = hostname;
                }
                return callBack(null, result[0]);
            }
				
		});
	},
   DBInfoSpace:(app_id, callBack) => {
      const {execute_db_sql, get_schema_name} = require ("../common/common.service");
		let sql;
		let parameters;
      switch (process.env.SERVICE_DB_USE){
         case '1':{
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
         case '2':{
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
      }
      parameters = {db_schema: get_schema_name()};
		execute_db_sql(app_id, sql, parameters,
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	DBInfoSpaceSum:(app_id, callBack) => {
      const {execute_db_sql, get_schema_name} = require ("../common/common.service");
		let sql;
		let parameters;
      switch (process.env.SERVICE_DB_USE){
         case '1':{
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
         case '2':{
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
      }
      parameters = {db_schema: get_schema_name()};
		execute_db_sql(app_id, sql, parameters,
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	},
	DBStart: async () => {
      return await new Promise(function (resolve, reject){
         if (process.env.SERVER_DB_START==1){
            DBInit();
            async function startDBpool(app_id, db_user, db_password) {
               return await new Promise(function (resolve, reject){
                  switch(process.env.SERVICE_DB_USE){
                     case '1':{
                        global_pool_db1_app.push(mysql.createPool({
                           port: process.env.SERVICE_DB_DB1_PORT,
                           host: process.env.SERVICE_DB_DB1_HOST,
                           user: db_user,
                           password: db_password,
                           database: process.env.SERVICE_DB_DB1_NAME,
                           charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
                           connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
                        }));
                        // log with common app id at startup for all apps
                        createLogAppSI(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                                       `mysql createPool ${app_id} user: ` + db_user).then(function(){
                           resolve();
                        })
                        break;
                     }
                     case '2':{
                        global_pool_db2_app.push(`global_pool_db2_app_${app_id}`);
                        oracledb.createPool({	
                           user:  db_user,
                           password: db_password,
                           connectString: process.env.SERVICE_DB_DB2_CONNECTSTRING,
                           poolMin: parseInt(process.env.SERVICE_DB_DB2_POOL_MIN),
                           poolMax: parseInt(process.env.SERVICE_DB_DB2_POOL_MAX),
                           poolIncrement: parseInt(process.env.SERVICE_DB_DB2_POOL_INCREMENT),
                           poolAlias: global_pool_db2_app[app_id]
                        }, (err,result) => {
                           // log with common app id at startup for all apps
                           if (err){
                              createLogAppSE(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                                             `oracledb.createPool ${app_id} user: ` + db_user + `, err:${err}`).then(function(){
                                 reject(err);
                              })
                           }
                           else{
                              createLogAppSI(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                                             `oracledb.createPool ${app_id} ok user: ` + db_user).then(function(){
                                 resolve();
                              })
                           }
                        });
                        break;
                     }
                     case '3':{
                        global_pool_db3_app.push(new pg.Pool({
                           user: db_user,
                           password: db_password,
                           host: process.env.SERVICE_DB_DB3_HOST,
                           database: process.env.SERVICE_DB_DB3_NAME,
                           port: process.env.SERVICE_DB_DB3_PORT,
                           connectionTimeoutMillis: process.env.SERVICE_DB_DB3_TIMEOUT_CONNECTION,
                           idleTimeoutMillis: process.env.SERVICE_DB_DB3_TIMEOUT_IDLE,
                           max: process.env.SERVICE_DB_DB3_MAX
                        }));
                        // log with common app id at startup for all apps
                        createLogAppSI(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                                       `pg createPool ${app_id} user: ` + db_user).then(function(){
                           resolve();
                        })
                        break;
                     }
                  }
               })
            }
            function startDBApps(){
               let json;
               const { getAppDBParametersAdmin } = require ("../app_portfolio/app_parameter/app_parameter.service");
               //app_id inparameter for log, all apps will be returned
               getAppDBParametersAdmin(process.env.COMMON_APP_ID,(err, results) =>{
                  if (err) {
                     createLogAppSE(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, `getAppDBParameters, err:${err}`).then(function(){
                        reject(err);
                    })
                  }
                  else {
                     json = JSON.parse(JSON.stringify(results));
                     let dbcounter =1;
                     for (let i = 1; i < json.length; i++) {
                        let startDBpool_result = startDBpool(json[i].id, json[i].db_user, json[i].db_password)
                        .then(function(){
                           dbcounter++;
                           //return when all db pools started, can be in random order
                           if (dbcounter==json.length)
                              resolve();
                        })
                        .catch(function(err) {
                           reject(err);
                        });
                     }
                  }
               }); 
            }
            switch (process.env.SERVICE_DB_USE){
               case '1':{
                  global_pool_db1_app.push(mysql.createPool({
                     port: process.env.SERVICE_DB_DB1_PORT,
                     host: process.env.SERVICE_DB_DB1_HOST,
                     user: process.env.SERVICE_DB_DB1_APP_ADMIN_USER,
                     password: process.env.SERVICE_DB_DB1_APP_ADMIN_PASS,
                     database: process.env.SERVICE_DB_DB1_NAME,
                     charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
                     connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
                  }));
                  // log with common app id at startup for all apps
                  createLogAppSI(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                                 `mysql createPool ADMIN user: ${process.env.SERVICE_DB_DB1_APP_ADMIN_USER}`).then(function(){
                     startDBApps()
                  })
                  break;
               }
               case '2':{
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
                  // enableStatistics: false // record pool usage for oracledb.getPool().getStatistics() and logStatistics()
                  */
                  // start first with admin app id = common app id 
                  global_pool_db2_app.push(`global_pool_db2_app_${process.env.COMMON_APP_ID}`);
                  oracledb.createPool({ user: process.env.SERVICE_DB_DB2_APP_ADMIN_USER,
                                                password: process.env.SERVICE_DB_DB2_APP_ADMIN_PASS,
                                                connectString: process.env.SERVICE_DB_DB2_CONNECTSTRING,
                                                poolMin: parseInt(process.env.SERVICE_DB_DB2_POOL_MIN),
                                                poolMax: parseInt(process.env.SERVICE_DB_DB2_POOL_MAX),
                                                poolIncrement: parseInt(process.env.SERVICE_DB_DB2_POOL_INCREMENT),
                                                poolAlias: global_pool_db2_app[process.env.COMMON_APP_ID]}, (err,result) => {
                     // log with common app id at startup for all apps
                     if (err)
                        createLogAppSE(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                                       `oracledb.createPool ADMIN user: ${process.env.SERVICE_DB_DB2_APP_ADMIN_USER}, err:${err}`).then(function(){
                           reject(err);
                        })
                     else{
                        createLogAppSI(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                                       `oracledb.createPool ADMIN ok user: ${process.env.SERVICE_DB_DB2_APP_ADMIN_USER}`).then(function(){
                           startDBApps()
                        })
                     }							
                  });
                  break;
               }
               case '3':{
                  global_pool_db3_app.push(new pg.Pool({
                     user: process.env.SERVICE_DB_DB3_APP_ADMIN_USER,
                     password: process.env.SERVICE_DB_DB3_APP_ADMIN_PASS,
                     host: process.env.SERVICE_DB_DB3_HOST,
                     database: process.env.SERVICE_DB_DB3_NAME,
                     port: process.env.SERVICE_DB_DB3_PORT,
                     connectionTimeoutMillis: process.env.SERVICE_DB_DB3_TIMEOUT_CONNECTION,
                     idleTimeoutMillis: process.env.SERVICE_DB_DB3_TIMEOUT_IDLE,
                     max: process.env.SERVICE_DB_DB3_MAX
                  }));
                  // log with common app id at startup for all apps
                  createLogAppSI(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                                 `pg createPool ADMIN user: ${process.env.SERVICE_DB_DB3_APP_ADMIN_USER}`).then(function(){
                     startDBApps()
                  })
                  break;
               }
            }
         }
         else
            resolve();
      })
   },
   DBStop: (app_id, callBack) => {
      //relase db pools from memory, not shutting down db
		global_pool_db1_app = [];
      global_pool_db2_app = [];
      global_pool_db3_app = [];
      mysql = null;
      mysql = require('mysql');
      oracledb = null;
      oracledb = require('oracledb');
      pg = null;
      pg = require('pg');
	},
   get_pool: (app_id) =>{
      let pool = null;
      try{
         switch (process.env.SERVICE_DB_USE){
            case '1':{
               pool = global_pool_db1_app[parseInt(app_id)];
               break;
            }
            case '2':{
               pool = global_pool_db2_app[parseInt(app_id)];
               break;
            }
            case '3':{
               pool = global_pool_db3_app[parseInt(app_id)];
               break;
            }
         }
      }catch (err) {
         //unknown app id requested
         createLogAppSE(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, 
                        'get_pool error app_id: ' + app_id).then(function(){
            return null;
         })
      }
      return pool;
   }
};
module.exports.oracledb = oracledb;