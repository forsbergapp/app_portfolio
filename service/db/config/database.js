var pool;
var oracledb;
var oracle_options;
let db_user1;
let db_password1;
let db_user2;
let db_password2;
let app_id = 1;

switch (app_id){
	case 0:{
		db_user1 = process.env.SERVICE_DB_DB1_USER0;
		db_password1 = process.env.SERVICE_DB_DB1_PASS0;
		db_user2 = process.env.SERVICE_DB_DB2_USER0;
		db_password2 = process.env.SERVICE_DB_DB2_PASS0;
		break;
	}
	case 1:{
		db_user1 = process.env.SERVICE_DB_DB1_USER1;
		db_password1 = process.env.SERVICE_DB_DB1_PASS1;
		db_user2 = process.env.SERVICE_DB_DB2_USER1;
		db_password2 = process.env.SERVICE_DB_DB2_PASS1;
		break;
	}
	case 2:{
		db_user1 = process.env.SERVICE_DB_DB1_USER2;
		db_password1 = process.env.SERVICE_DB_DB1_PASS2;
		db_user2 = process.env.SERVICE_DB_DB2_USER2;
		db_password2 = process.env.SERVICE_DB_DB2_PASS2;
		break;
	}
	default:{
		db_user1 = process.env.SERVICE_DB_DB1_USER0;
		db_password1 = process.env.SERVICE_DB_DB1_PASS0;
		db_user2 = process.env.SERVICE_DB_DB2_USER0;
		db_password2 = process.env.SERVICE_DB_DB2_PASS0;
		break;
	}
}

if (process.env.SERVICE_DB_USE==1){
	const { createPool } = require("mysql");
	pool = createPool({
		port: process.env.SERVICE_DB_DB1_PORT,
		host: process.env.SERVICE_DB_DB1_HOST,
		user: db_user1,
		password: db_password1,
		database: process.env.SERVICE_DB_DB1_NAME,
		charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
		connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
	});
}
else if (process.env.SERVICE_DB_USE==2){
	oracledb = require('oracledb');
	oracledb.autoCommit = true;
	oracledb.fetchAsBuffer = [ oracledb.BLOB ];
	oracledb.initOracleClient({ libDir: process.env.SERVICE_DB_DB2_LIBDIR,
						 		configDir:process.env.SERVICE_DB_DB2_CONFIGDIR});
	oracle_options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
	async function init(){
		try{
			await oracledb.createPool({
				user: db_user2,
				password: db_password2,
				connectString: process.env.SERVICE_DB_DB2_CONNECTSTRING,
				poolMin: parseInt(process.env.SERVICE_DB_DB2_POOL_MIN),
				poolMax: parseInt(process.env.SERVICE_DB_DB2_POOL_MAX),
				poolIncrement: parseInt(process.env.SERVICE_DB_DB2_POOL_INCREMENT)
				/* other params and default values
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
			}, (err,result) => {
				if (err) {
					console.log('oracledb.createPool err:' + err);
				}
				else{
					console.log('oracledb.createPool ok');
				}
			});
		}catch (err) {
			console.error('oracledb.createPool error: ' + err.message);
		} finally {
			console.log('finally oracledb.createPool');
		}
	}
	init();
}
module.exports.pool = pool;
module.exports.oracledb = oracledb;
module.exports.oracle_options = oracle_options;
