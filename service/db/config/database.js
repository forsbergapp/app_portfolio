var pool_db1_app_admin;
var pool_db1_app = [];
var pool_db2_app_admin = 'pool_db2_app_admin';
var pool_db2_app = [];
const mysql = require("mysql");
var oracledb = require('oracledb');

const { createLogDB, createLogAppSI, createLogAppSE } = require("../../log/log.service");

function get_pool_admin(){
	let pool;
	if (process.env.SERVICE_DB_USE==1)
		return pool_db1_app_admin;		
	else 
		if (process.env.SERVICE_DB_USE==2)
			return pool_db2_app_admin;
}
function get_pool(app_id){
	let pool;
	try{
		if (process.env.SERVICE_DB_USE==1)
			pool = pool_db1_app[parseInt(app_id)];	
		if (process.env.SERVICE_DB_USE==2)
			pool = pool_db2_app[parseInt(app_id)];
	}catch (err) {
		createLogAppSE(null, __appfilename, __appfunction, __appline, 'get_pool error app_id: ' + app_id);
	}
	return pool;
}

async function oracle_pool(app_id, db_user, db_password, callBack){
	try{
		pool_db2_app.push(`pool_db2_app_${app_id}`);
		await oracledb.createPool({	
			user:  db_user,
			password: db_password,
			connectString: process.env.SERVICE_DB_DB2_CONNECTSTRING,
			poolMin: parseInt(process.env.SERVICE_DB_DB2_POOL_MIN),
			poolMax: parseInt(process.env.SERVICE_DB_DB2_POOL_MAX),
			poolIncrement: parseInt(process.env.SERVICE_DB_DB2_POOL_INCREMENT),
			poolAlias: pool_db2_app[app_id]
		}, (err,result) => {
			if (err){
				createLogAppSE(app_id, __appfilename, __appfunction, __appline, `oracledb.createPool ${app_id} user: ` + db_user + `, err:${err}`);
				callBack(err, null);
			}
			else{
				createLogAppSI(app_id, __appfilename, __appfunction, __appline, `oracledb.createPool ${app_id} ok user: ` + db_user);
				callBack(null, result);
			}
				
		});
	}catch (err) {
		createLogAppSE(app_id, __appfilename, __appfunction, __appline, `oracledb.createPool ${app_id} err:${err.message}`);
		callBack(err,null);
	}
}
async function mysql_pool(app_id, db_user, db_password, callBack){
	pool_db1_app.push(mysql.createPool({
		port: process.env.SERVICE_DB_DB1_PORT,
		host: process.env.SERVICE_DB_DB1_HOST,
		user: db_user,
		password: db_password,
		database: process.env.SERVICE_DB_DB1_NAME,
		charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
		connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
	}));
	createLogAppSI(app_id, __appfilename, __appfunction, __appline, `mysql createPool ${app_id} user: ` + db_user);
	if (process.env.SERVICE_LOG_ENABLE_DB==1){
		pool_db1_app[i].on('connection', function(connection) {
			connection.on('enqueue', function(sequence) {
				// if (sequence instanceof mysql.Sequence.Query) {
				if ('Query' === sequence.constructor.name) {
					createLogDB(app_id, sequence.sql);
				}
			});
		});
	}
	callBack(null, null);
}
async function init_db(callBack){
	if (process.env.SERVICE_DB_USE==1){
		pool_db1_app_admin = mysql.createPool({
			port: process.env.SERVICE_DB_DB1_PORT,
			host: process.env.SERVICE_DB_DB1_HOST,
			user: process.env.SERVICE_DB_DB1_APP_ADMIN_USER,
			password: process.env.SERVICE_DB_DB1_APP_ADMIN_PASS,
			database: process.env.SERVICE_DB_DB1_NAME,
			charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
			connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
		});
		createLogAppSI(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, `mysql createPool ADMIN user: ${process.env.SERVICE_DB_DB1_APP_ADMIN_USER}`);
		if (process.env.SERVICE_LOG_ENABLE_DB==1){
			pool_db1_app_admin.on('connection', function(connection) {
				connection.on('enqueue', function(sequence) {
					// if (sequence instanceof mysql.Sequence.Query) {
					if ('Query' === sequence.constructor.name) {
						createLogDB(process.env.MAIN_APP_ID, sequence.sql);
					}
				});
			});
		}
		pool_db1_app.push(mysql.createPool({
			port: process.env.SERVICE_DB_DB1_PORT,
			host: process.env.SERVICE_DB_DB1_HOST,
			user: process.env.SERVICE_DB_DB1_APP0_USER,
			password: process.env.SERVICE_DB_DB1_APP0_PASS,
			database: process.env.SERVICE_DB_DB1_NAME,
			charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
			connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
		}));
		createLogAppSI(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, `mysql createPool ${process.env.MAIN_APP_ID} user: ${process.env.SERVICE_DB_DB1_APP0_USER}`);
		if (process.env.SERVICE_LOG_ENABLE_DB==1){		
			pool_db1_app[0].on('connection', function(connection) {
				connection.on('enqueue', function(sequence) {
					// if (sequence instanceof mysql.Sequence.Query) {
					if ('Query' === sequence.constructor.name) {
						createLogDB(process.env.MAIN_APP_ID, sequence.sql);
					}
				});
			});
		}
		callBack(null, null);
	}
	else if (process.env.SERVICE_DB_USE==2){
		oracledb.autoCommit = true;
		oracledb.fetchAsBuffer = [ oracledb.BLOB ];
		oracledb.initOracleClient({ libDir: process.env.SERVICE_DB_DB2_LIBDIR,
									 configDir:process.env.SERVICE_DB_DB2_CONFIGDIR});
		oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
		async function init(){
			/* createPool
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
			async function create_pool(user, password, pool, callBack){
				try{
					await oracledb.createPool({
						user: user,
						password: password,
						connectString: process.env.SERVICE_DB_DB2_CONNECTSTRING,
						poolMin: parseInt(process.env.SERVICE_DB_DB2_POOL_MIN),
						poolMax: parseInt(process.env.SERVICE_DB_DB2_POOL_MAX),
						poolIncrement: parseInt(process.env.SERVICE_DB_DB2_POOL_INCREMENT),
						poolAlias: pool
					}, (err,result) => {
						if (err)
							callBack(err, null);
						else{
							callBack(null, null);
						}							
					});
				}catch (err) {
					callBack(err, null);
				}
			}
			create_pool(process.env.SERVICE_DB_DB2_APP_ADMIN_USER,
						process.env.SERVICE_DB_DB2_APP_ADMIN_PASS,
						pool_db2_app_admin, (err, result) =>{
				if (err){
					createLogAppSE(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, `oracledb.createPool ADMIN user: ${process.env.SERVICE_DB_DB2_APP_ADMIN_USER}, err:${err}`);
					callBack(err, null);
				}
				else{
					createLogAppSI(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, `oracledb.createPool ADMIN ok user: ${process.env.SERVICE_DB_DB2_APP_ADMIN_USER}`);
					pool_db2_app.push('pool_db2_app_0');
					create_pool(process.env.SERVICE_DB_DB2_APP0_USER,
						process.env.SERVICE_DB_DB2_APP0_PASS,
						pool_db2_app[0], (err, result) =>{
							if (err){
								createLogAppSE(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, `oracledb.createPool ${process.env.MAIN_APP_ID} user: ${process.env.SERVICE_DB_DB2_APP0_USER}, err:${err}`);
								callBack(err, null);
							}
							else{				
								createLogAppSI(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, `oracledb.createPool ${process.env.MAIN_APP_ID} ok user: ${process.env.SERVICE_DB_DB2_APP0_USER}`);				
								callBack(null, null);
							}
						});
				}
			});
		}
		init();
	}
}

module.exports.get_pool = get_pool;
module.exports.get_pool_admin = get_pool_admin;
module.exports.oracledb = oracledb;
module.exports.init_db = init_db;
module.exports.mysql_pool = mysql_pool;
module.exports.oracle_pool = oracle_pool;