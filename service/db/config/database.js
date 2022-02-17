var pool_db1_0;
var pool_db1_1;
var pool_db1_2;
var pool_db2_0;
var pool_db2_1;
var pool_db2_2;
var oracledb;
var oracle_options;

function get_db_credentials(app_id, db){
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
    if (db==1)
        return `{'user' : '${db_user1}', 'password': '${db_password1}'}`;
    else
        if (db==2)
            return `{"connectString": "${process.env.SERVICE_DB_DB2_CONNECTSTRING}" ,
					 "poolAlias": "default", 
					 "homogeneous": false,
					 "user" : "${db_user2}", 
					 "password": "${db_password2}"}`;
}

function get_pool(app_id){
	let pool;
	if (process.env.SERVICE_DB_USE==1){
		switch (parseInt(app_id)){
			case 0:{
				console.log('pool 0');
				pool = pool_db1_0;
				break;
			}
			case 1:{
				console.log('pool 1');
				pool = pool_db1_1;
				break;
			}
			case 2:{
				console.log('pool 2');
				pool = pool_db1_2;
				break;
			}
			default:{
				console.log('get_pool app_id error app_id:' + app_id);
				break;
			}
		}
	}
	else if (process.env.SERVICE_DB_USE==2)
	switch (parseInt(app_id)){
		case 0:{
			console.log('pool 1');
			pool = pool_db2_1;
			break;
		}
		case 1:{
			console.log('pool 1');
			pool = pool_db2_1;
			break;
		}
		case 2:{
			console.log('pool 1');
			pool = pool_db2_1;
			break;
		}
		default:{
			console.log('get_pool app_id error app_id:' + app_id);
			break;
		}
	}
	return pool;
}

if (process.env.SERVICE_DB_USE==1){
	const mysql = require("mysql");
	pool_db1_0 = mysql.createPool({
		port: process.env.SERVICE_DB_DB1_PORT,
		host: process.env.SERVICE_DB_DB1_HOST,
		user: process.env.SERVICE_DB_DB1_USER0,
		password: process.env.SERVICE_DB_DB1_PASS0,
		database: process.env.SERVICE_DB_DB1_NAME,
		charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
		connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
	});
	console.log('mysql createPool 0 user:' + process.env.SERVICE_DB_DB1_USER0);
	pool_db1_1 = mysql.createPool({
			port: process.env.SERVICE_DB_DB1_PORT,
			host: process.env.SERVICE_DB_DB1_HOST,
			user: process.env.SERVICE_DB_DB1_USER1,
			password: process.env.SERVICE_DB_DB1_PASS1,
			database: process.env.SERVICE_DB_DB1_NAME,
			charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
			connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
		});
	console.log('mysql createPool 1 user:' + process.env.SERVICE_DB_DB1_USER1);
	pool_db1_2 = mysql.createPool({
			port: process.env.SERVICE_DB_DB1_PORT,
			host: process.env.SERVICE_DB_DB1_HOST,
			user: process.env.SERVICE_DB_DB1_USER2,
			password: process.env.SERVICE_DB_DB1_PASS2,
			database: process.env.SERVICE_DB_DB1_NAME,
			charset: process.env.SERVICE_DB_DB1_CHARACTERSET,
			connnectionLimit: process.env.SERVICE_DB_DB1_CONNECTION_LIMIT
		});
	console.log('mysql createPool 2 user:' + process.env.SERVICE_DB_DB1_USER2);
}
else if (process.env.SERVICE_DB_USE==2){
	oracledb = require('oracledb');
	oracledb.autoCommit = true;
	oracledb.fetchAsBuffer = [ oracledb.BLOB ];
	oracledb.initOracleClient({ libDir: process.env.SERVICE_DB_DB2_LIBDIR,
						 		configDir:process.env.SERVICE_DB_DB2_CONFIGDIR});
														 
	oracle_options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
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
		/*
		try{
			pool_db2_0 = oracledb;
			await pool_db2_0.createPool({
				user: process.env.SERVICE_DB_DB2_USER0,
				password: process.env.SERVICE_DB_DB2_PASS0,
				connectString: process.env.SERVICE_DB_DB2_CONNECTSTRING,
				poolMin: parseInt(process.env.SERVICE_DB_DB2_POOL_MIN),
				poolMax: parseInt(process.env.SERVICE_DB_DB2_POOL_MAX),
				poolIncrement: parseInt(process.env.SERVICE_DB_DB2_POOL_INCREMENT)
			}, (err,result) => {
				if (err)
					console.log(`oracledb.createPool 0 user: ${process.env.SERVICE_DB_DB2_USER0}, err:${err}`);
				else
					console.log(`oracledb.createPool 0 ok user:${process.env.SERVICE_DB_DB2_USER0})`);
			});
		}catch (err) {
			console.log(`oracledb.createPool 0 err:${err.message}`);
		} finally {
			console.log(`finally oracledb.createPool 0 ok`);
		}
		*/
		try{
			pool_db2_1 = oracledb;
			/*
			user: process.env.SERVICE_DB_DB2_USER1,
			password: process.env.SERVICE_DB_DB2_PASS1,
			*/
			await pool_db2_1.createPool({	
				user: process.env.SERVICE_DB_DB2_USER1,
				password: process.env.SERVICE_DB_DB2_PASS1,
				connectString: process.env.SERVICE_DB_DB2_CONNECTSTRING,
				poolMin: parseInt(process.env.SERVICE_DB_DB2_POOL_MIN),
				poolMax: parseInt(process.env.SERVICE_DB_DB2_POOL_MAX),
				poolIncrement: parseInt(process.env.SERVICE_DB_DB2_POOL_INCREMENT),
				homogeneous: false,
				poolAlias: 'default'
			}, (err,result) => {
				if (err)
					console.log(`oracledb.createPool 1 user: ${process.env.SERVICE_DB_DB2_USER1}, err:${err}`);
				else
					console.log(`oracledb.createPool 1 ok user:${process.env.SERVICE_DB_DB2_USER1}`);
			});
		}catch (err) {
			console.log(`oracledb.createPool 1 err:${err.message}`);
		} finally {
			console.log(`finally oracledb.createPool 1 ok`);
		}
		/*
		try{
			pool_db2_2 = oracledb;
			await pool_db2_2.createPool({
				user: process.env.SERVICE_DB_DB2_USER2,
				password: process.env.SERVICE_DB_DB2_PASS2,
				connectString: process.env.SERVICE_DB_DB2_CONNECTSTRING,
				poolMin: parseInt(process.env.SERVICE_DB_DB2_POOL_MIN),
				poolMax: parseInt(process.env.SERVICE_DB_DB2_POOL_MAX),
				poolIncrement: parseInt(process.env.SERVICE_DB_DB2_POOL_INCREMENT)
			}, (err,result) => {
				if (err)
					console.log(`oracledb.createPool 2 user: ${process.env.SERVICE_DB_DB2_USER2}, err:${err}`);
				else
					console.log(`oracledb.createPool 2 ok user:${process.env.SERVICE_DB_DB2_USER2})`);
			});
		}catch (err) {
			console.log(`oracledb.createPool 2 err:${err.message}`);
		} finally {
			console.log(`finally oracledb.createPool 2 ok`);
		}
		*/
	}
	init();
}
module.exports.oracle_options = oracle_options;
module.exports.get_pool = get_pool;
module.exports.get_db_credentials = get_db_credentials;
