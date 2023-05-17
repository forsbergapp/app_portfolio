const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

//mysql module used for both MariaDB and MySQL
let MYSQL               = await import("mysql");
let {default: PG}       = await import('pg');
let {default: ORACLEDB} = await import('oracledb');


let POOL_DB1_APP = [];
let POOL_DB2_APP = [];
let POOL_DB3_APP = [];
let POOL_DB4_APP = [];

const DBInit = async (DB_USE) => {
   const fs = await import('node:fs');
   const fileBuffer = await fs.promises.readFile(`${process.cwd()}/service/db/config/config.json`, 'utf8');
   const DBCONFIG = JSON.parse(fileBuffer.toString());
   if (DB_USE=='4'){
      ORACLEDB.autoCommit = true;
      ORACLEDB.fetchAsString = [ ORACLEDB.CLOB ];
      ORACLEDB.initOracleClient({ libDir: DBCONFIG.DB4.filter(row=>Object.keys(row).includes('LIBRARY_DIR'))[0].LIBRARY_DIR,
                                  configDir:DBCONFIG.DB4.filter(row=>Object.keys(row).includes('CONFIG_DIR'))[0].CONFIG_DIR});
      ORACLEDB.outFormat = ORACLEDB.OUT_FORMAT_OBJECT;
   }
}
const start_pool_admin = async (dbparameters) => {

   dbparameters = JSON.parse(dbparameters);
   await DBInit(dbparameters.use);
   return await new Promise((resolve, reject) => {
      
      switch (dbparameters.use){
         case '1':
         case '2':{
            let app_admin_pool = null;
            let system_admin_pool = null;
            //both system admin db pool and admin db pool should be enabled
            if (dbparameters.system_admin_user)
               system_admin_pool = MYSQL.createPool({
                  host: dbparameters.host,
                  port: dbparameters.port,
                  user: dbparameters.system_admin_user,
                  password: dbparameters.system_admin_password,
                  database: null,
                  charset: dbparameters.charset,
                  connnectionLimit: dbparameters.connectionLimit
               });
               
            if (dbparameters.app_admin_user)
               app_admin_pool = MYSQL.createPool({
                  host: dbparameters.host,
                  port: dbparameters.port,
                  user: dbparameters.app_admin_user,
                  password: dbparameters.app_admin_password,
                  database: dbparameters.database,
                  charset: dbparameters.charset,
                  connnectionLimit: dbparameters.connectionLimit
               });   
            if (dbparameters.use == 1)
               POOL_DB1_APP.push([dbparameters.startpool_app_id, app_admin_pool, system_admin_pool]);
            else
               POOL_DB2_APP.push([dbparameters.startpool_app_id, app_admin_pool, system_admin_pool]);
            resolve();
            break;
         }
         case '3':{
            let app_admin_pool = null;
            let system_admin_pool = null;
            if (dbparameters.system_admin_user)
               system_admin_pool = new PG.Pool({
                                       user: dbparameters.system_admin_user,
                                       password: dbparameters.system_admin_password,
                                       host: dbparameters.host,
                                       port: dbparameters.port,
                                       database: null,
                                       connectionTimeoutMillis: dbparameters.connectionTimeoutMillis,
                                       idleTimeoutMillis: dbparameters.idleTimeoutMillis,
                                       max: dbparameters.max
                                    });
               
            if (dbparameters.app_admin_user)
               app_admin_pool = new PG.Pool({
                                    user: dbparameters.app_admin_user,
                                    password: dbparameters.app_admin_password,
                                    host: dbparameters.host,
                                    port: dbparameters.port,
                                    database: dbparameters.database,
                                    connectionTimeoutMillis: dbparameters.connectionTimeoutMillis,
                                    idleTimeoutMillis: dbparameters.idleTimeoutMillis,
                                    max: dbparameters.max
                                 });
            POOL_DB3_APP.push([dbparameters.startpool_app_id, app_admin_pool, system_admin_pool]);
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
            if (dbparameters.system_admin_user){
               ORACLEDB.createPool({ user: dbparameters.system_admin_user,
                                       password: dbparameters.system_admin_password,
                                       connectString: dbparameters.connectString,
                                       poolMin: dbparameters.poolMin,
                                       poolMax: dbparameters.poolMax,
                                       poolIncrement: dbparameters.poolIncrement,
                                       poolAlias: dbparameters.poolAlias_system_admin}, (err,result_system_admin_pool) => {
                  if (err)
                     reject(err);
                  else
                     if (dbparameters.app_admin_user){
                        ORACLEDB.createPool({ user: dbparameters.app_admin_user,
                                          password: dbparameters.app_admin_password,
                                          connectString: dbparameters.connectString,
                                          poolMin: dbparameters.poolMin,
                                          poolMax: dbparameters.poolMax,
                                          poolIncrement: dbparameters.poolIncrement,
                                          poolAlias: dbparameters.poolAlias_app_admin}, (err,result_app_admin_pool) => {
                           if (err)
                              reject(err);
                           else{
                              POOL_DB4_APP.push([dbparameters.startpool_app_id,dbparameters.poolAlias_app_admin,dbparameters.poolAlias_system_admin]);
                              resolve();
                           }
                        })
                     }
                     else{
                        POOL_DB4_APP.push([dbparameters.startpool_app_id, null, dbparameters.poolAlias_system_admin]);
                        resolve();
                     }
               })
            }
            else
               if (dbparameters.app_admin_user){
                  ORACLEDB.createPool({ user: dbparameters.app_admin_user,
                                       password: dbparameters.app_admin_password,
                                       connectString: dbparameters.connectString,
                                       poolMin: dbparameters.poolMin,
                                       poolMax: dbparameters.poolMax,
                                       poolIncrement: dbparameters.poolIncrement,
                                       poolAlias: dbparameters.poolAlias_app_admin}, (err,result_app_admin_pool) => {
                     if (err)
                        reject(err);
                     else{
                        POOL_DB4_APP.push([dbparameters.startpool_app_id, dbparameters.poolAlias_app_admin, null]);
                        resolve();
                     }
                  })
               }
               else
                  resolve();
            break;
         }
      }
   })
}
const start_pool_apps = async (dbparameters, apps)=>{
   dbparameters = JSON.parse(dbparameters);
   apps = JSON.parse(apps).APPS;
   const startDBpool = async (app_id, db_user, db_password) => {
      return new Promise((resolve, reject) => {
         switch(dbparameters.use){
            case '1':{
               POOL_DB1_APP.push([app_id,
                                 MYSQL.createPool({
                                    host: dbparameters.host,
                                    port: dbparameters.port,
                                    user: db_user,
                                    password: db_password,
                                    database: dbparameters.database,
                                    charset: dbparameters.charset,
                                    connnectionLimit: dbparameters.connnectionLimit
                                 })
                                 ]);
               resolve();
               break;
            }
            case '2':{
               POOL_DB2_APP.push([app_id,
                                 MYSQL.createPool({
                                    host: dbparameters.host,
                                    port: dbparameters.port,
                                    user: db_user,
                                    password: db_password,
                                    database: dbparameters.database,
                                    charset: dbparameters.charset,
                                    connnectionLimit: dbparameters.connnectionLimit
                                 })
                                 ]);
               resolve();
               break;
            }
            case '3':{
               POOL_DB3_APP.push([app_id,
                                          new PG.Pool({
                                             user: db_user,
                                             password: db_password,
                                             host: dbparameters.host,
                                             port: dbparameters.port,
                                             database: dbparameters.database,
                                             connectionTimeoutMillis: dbparameters.connectionTimeoutMillis,
                                             idleTimeoutMillis: dbparameters.idleTimeoutMillis,
                                             max: dbparameters.max
                                          })
                                          ]);
               resolve();
               break;
            }
            case '4':{
               POOL_DB4_APP.push([app_id, `POOL_DB${dbparameters.use}_${app_id}`]);
               ORACLEDB.createPool({	
                  user:  db_user,
                  password: db_password,
                  connectString: dbparameters.connectString,
                  poolMin: dbparameters.poolMin,
                  poolMax: dbparameters.poolMax,
                  poolIncrement: dbparameters.poolIncrement,
                  poolAlias: `POOL_DB${dbparameters.use}_${app_id}`
               }, (err,result) => {
                  if (err)
                     reject(err);
                  else
                     resolve();
               });
               break;
            }
         }
      })
   }
   return new Promise((resolve, reject) => {
      let dbcounter =1;
      for (let app of apps) {
         startDBpool(app.id, app.db_user, app.db_password)
         .then((result) => {
            dbcounter++;
            //return when all db pools started, can be in random order
            if (dbcounter==apps.length)
               resolve();
         })
         .catch((err) => {
            reject(err);
         });
      }
   })
}
const close_pools = async (app_id, callBack) => {
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
const db_query = async (app_id, db_use, sql, parameters, pool_col, callBack) => {
	switch (db_use){
		case '1':
		case '2':{
			//Both MySQL and MariaDB use MySQL npm module
			const config_connection = (conn, query, values) => {
				//change json parameters to [] syntax with bind variable names
				//common syntax: connection.query("UPDATE [table] SET [column] = :title", { title: "value" });
				//mysql syntax: connection.query("UPDATE [table] SET [column] = ?", ["value"];
				conn.config.queryFormat = (query, values) => {
					if (!values) return query;
					return query.replace(/\:(\w+)/g, (txt, key) => {
						if (values.hasOwnProperty(key)) {
						return conn.escape(values[key]);
						}
						return txt;
					});
				};
			}
			try {
				get_pool(app_id, db_use, pool_col).getConnection((err, conn) => {
					conn.release();
					if (err){
                  //return full error to system admin
						if (pool_col==2)
                     return callBack(err, null);
                  else
                     return callBack(database_error, null);
					}
					else{
						config_connection(conn, sql, parameters);
						conn.query(sql, parameters, (err, result, fields) => {
							if (err){
								return callBack(err, null);
							}
							else{
								//convert blob buffer to string if any column is a BLOB type
								if (result.length>0){
									for (let dbcolumn=0;dbcolumn<fields.length; dbcolumn++){
										if (fields[dbcolumn].type == 252) { //BLOB
											for (let i=0;i<result.length;i++){
												if (fields[dbcolumn]['name'] == Object.keys(result[i])[dbcolumn])
													if (result[i][Object.keys(result[i])[dbcolumn]]!=null && result[i][Object.keys(result[i])[dbcolumn]]!='')
														result[i][Object.keys(result[i])[dbcolumn]] = Buffer.from(result[i][Object.keys(result[i])[dbcolumn]]).toString();
											}
										}
									};
								}
								return callBack(null, result);
							}
						})
					}
				});					
			} catch (error) {
            return callBack(error, null);
			}
			break;
		}
		case '3':{
			const queryConvert = (parameterizedSql, params) => {
				//change json parameters to $ syntax
				//use unique index with $1, $2 etc, parameter can be used several times
				//example: sql with parameters :id, :id, :id and :id2, will get $1, $1, $1 and $2
				//use indexorder received from parameters
				//common syntax: connection.query("UPDATE [table] SET [column] = :title", { title: "value" });
				//postgresql syntax: connection.query("UPDATE [table] SET [column] = $1", [0, "value"];
			    const [text, values] = Object.entries(params).reduce(
			        ([sql, array, index], [key, value]) => [sql.replace(/\:(\w+)/g, (txt, key) => {
																						if (params.hasOwnProperty(key)){
																							return `$${Object.keys(params).indexOf(key) + 1}`;
																						}
																						else
																							return txt;
																					}), 
														   [...array, value], index + 1],
				        								   [parameterizedSql, [], 1]
			    );
			    return { text, values };
			}	
			let parsed_result = queryConvert(sql, parameters);
			let pool3;
			try {
				pool3 = await get_pool(app_id, db_use, pool_col).connect();
				pool3.query(parsed_result.text, parsed_result.values)
					.then((result) => {
					//add common attributes
					if (result.command == 'INSERT' && result.rows.length>0)
						result.insertId = result.rows[0].id;
					if (result.command == 'INSERT' ||
						result.command == 'DELETE' ||
						result.command == 'UPDATE'){
						result.affectedRows = result.rowCount;
					}
					//convert blob buffer to string if any column is a BYTEA type
					if (result.rows.length>0){
						for (let dbcolumn=0;dbcolumn<result.fields.length; dbcolumn++){
							if (result.fields[dbcolumn].dataTypeID == 17) { //BYTEA
								for (let i=0;i<result.rows.length;i++){
									if (result.fields[dbcolumn]['name'] == Object.keys(result.rows[i])[dbcolumn])
										if (result.rows[i][Object.keys(result.rows[i])[dbcolumn]]!=null && result.rows[i][Object.keys(result.rows[i])[dbcolumn]]!='')
											result.rows[i][Object.keys(result.rows[i])[dbcolumn]] = Buffer.from(result.rows[i][Object.keys(result.rows[i])[dbcolumn]]).toString();
								}
							}
						};
					}
					if (result.command == 'SELECT')
						return callBack(null, result.rows);
					else
						return callBack(null, result);
					})
					.catch((error) => {
						return callBack(error, null);
							
					})
			} catch (error) {
				return callBack(error, null);
			}
			finally{
				if (pool3)
					pool3.release();
			}
			break;
		}
		case '4':{
			let pool4;
			try{
				pool4 = await ORACLEDB.getConnection(get_pool(app_id, db_use, pool_col));
				/*
				Fix CLOB column syntax to avoid ORA-01461 for these columns:
					APP_ACCOUNT.SCREENSHOT
					USER_ACCOUNT.AVATAR
					USER_ACCOUNT.PROVIDER_IMAGE
					USER_ACCOUNT_APP_SETTING.SETTINGS_JSON
					use same parameter name as column name
				*/
				Object.keys(parameters).forEach((key, index) => {
					if (key.toLowerCase() == 'screenshot' ||
					    key.toLowerCase() == 'avatar' ||
						key.toLowerCase() == 'provider_image' ||
						key.toLowerCase() == 'settings_json')
						parameters[key] = { dir: ORACLEDB.BIND_IN, val: parameters[key], type: ORACLEDB.CLOB };
				});
				const result = await pool4.execute(sql, parameters, (err,result) => {
														if (err) {
															return callBack(err, null);
														}
														else{
															if (result.rowsAffected)
																result.affectedRows = result.rowsAffected;
															if (result.rows)
																return callBack(null, result.rows);
															else
																return callBack(null, result);
														}
															
																
													});
			}catch (error) {
				return callBack(error, null);
			} finally {
				if (pool4) {
					pool4.close(); 
				}
			}
			break;
		}
	}
}
const get_pool = (app_id, db_use, pool_col=1) => {
   let pool = null;
   const pool_filter = (dbpool) => (parseInt(dbpool[0]) == parseInt(app_id));
   if (pool_col==null)
      pool_col = 1;
   try{
      switch (db_use){
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
      return null;
   }
   return pool;
}

const admin_pool_started = (startpool_app_id, db_use) =>{
   if (get_pool(startpool_app_id,db_use, null)==null)
      return 0;
   else
      return 1;
}
export{ORACLEDB, 
       start_pool_admin, start_pool_apps, close_pools, db_query,
       get_pool, admin_pool_started}