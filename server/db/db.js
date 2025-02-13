/** 
 * Tables implemented using object mapping relation (ORM) pattern
 * each table has dbModel*.js file with methods
 * not implemented for tables:
 *       app (fileModelApp is used)
 *       app_data_translation
 *       app_translation
 *       event
 *       event_status
 *       event_type
 *       language
 * since dml logic not implemented and some SQL use select from these tables using joins
 * 
 * @module server/db/db 
 */

/**
 * @import {server_server_error, server_db_db_pool, server_db_db_pool_parameters, 
 *          server_db_db_pool_connection_1_2, server_db_db_pool_connection_1_2_result, 
 *          server_db_db_pool_connection_3_fields,server_db_db_pool_connection_3_result,
 *          server_db_db_pool_connection_4_result} from '../types.js'
*/

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

//mysql module used for both MariaDB and MySQL
const MYSQL               = await import('mysql');
const {default: PG}       = await import('pg');
const {default: ORACLEDB} = await import('oracledb');
const {default:sqlite3}   = await import('sqlite3');
const sqlite              = await import('sqlite');
/**
 * @name DB_POOL
 * @description DB_POOL
 *             All database pool connections are saved here
 *             Oracle uses number to 
 * @constant
 * @type{server_db_db_pool[]}
 */
const DB_POOL =[ 
                  [1, null, null], //MySQL pools      [db number, dba pool object, apps pool object]
                  [2, null, null], //MariaDB pools    [db number, dba pool object, apps pool object]
                  [3, null, null], //PostgreSQL pools [db number, dba pool object, apps pool object]
                  [4, null, null], //Oracle pools     [db number, dba pool object {pool_id_dba: 0}, apps pool object {pool_id_app: 0}]
                  [5, null, null]  //SQLite           [db number, db object, null]
               ];                     

if (serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))==4){
   ORACLEDB.autoCommit = true;
   ORACLEDB.fetchAsString = [ ORACLEDB.CLOB ];
   ORACLEDB.outFormat = ORACLEDB.OUT_FORMAT_OBJECT;
}
/**
 * @name dbPoolDeleteAll
 * @description Delete all pools for given database
 *              Deletes variable content, not the same as 
 *              using API to close, release or end connection
 *              and all database API use different logic.
 *              Needed to restart database connection after admin
 *              have changed parameters and without having to restart server
 * @function
 * @param {number} db
 * @returns {void}
 */
const dbPoolDeleteAll = (db)=>{
      //relase db pools from memory
      DB_POOL.map(pool=>{if (pool[0]==db){
                           pool[1]=null;
                           pool[2]=null;
                        }
                        });
};
/**
 * @name dbPoolStart
 * @description Pool start
 *                parameters:
 *                use:                     1-5
 *                pool_id:                 start with 0 and increase pool id value +1 for each new pool where pool will be saved
 *                port:                    port,
 *                host:                    host,
 *                dba:                     1/0,
 *                user:                    username,
 *                password:                password,
 *                database:                database,
 *
 *                db 1 + 2 parameters      see MariaDB/MySQL documentation
 *                charset:                 character set,
 *                connnectionLimit:        connection limit
 *
 *                db 3 parameters          see PostgreSQL documentation
 *                connectionTimeoutMillis: connection timout milliseconds
 *                idleTimeoutMillis:       idle timeout milliseconds
 *                max:                     max
 *
 *                db 4 parameters          see Oracle documentation
 *                connectString:           connectstring
 *                poolMin:                 pool min
 *                poolMax:                 pool max
 *                poolIncrement:           pool increment
 * @function
 * @param {server_db_db_pool_parameters} dbparameters 
 * @returns {Promise.<null>}
 */
const dbPoolStart = async (dbparameters) =>{
   /**@type{import('./file.js')} */
   const {filePath} = await import(`file://${process.cwd()}/server/db/file.js`);
   return new Promise((resolve, reject) => {
      switch(dbparameters.use){
         case 1:
         case 2:{            
            /**@type{object} */
            const mysql_pool = MYSQL.createPool({
                                 host: dbparameters.host ?? '',
                                 port: dbparameters.port ?? undefined,
                                 user: dbparameters.user ?? '',
                                 password: dbparameters.password ?? '',
                                 database: dbparameters.database==null?'':dbparameters.database,
                                 charset: dbparameters.charset==null?'':dbparameters.charset,
                                 connectionLimit: dbparameters.connectionLimit==null?0:dbparameters.connectionLimit
                              });
            DB_POOL.map(db=>
               {if (db[0]==dbparameters.use)
                  if (dbparameters.dba==1)
                     db[1]= mysql_pool;
                  else
                     if (db[2])
                        db[2].push(mysql_pool);
                     else
                        db[2] = [mysql_pool];
            });
            resolve(null);
            break;
         }
         case 3:{
            const createpoolPostgreSQL = () =>{
               return new Promise(resolve=>{
                  resolve(new PG.Pool({
                     user: dbparameters.user ?? '',
                     password: dbparameters.password ?? '',
                     host: dbparameters.host ?? '',
                     port: dbparameters.port ?? undefined,
                     database: dbparameters.database==null?'':dbparameters.database,
                     connectionTimeoutMillis: dbparameters.connectionTimeoutMillis ?? undefined,
                     idleTimeoutMillis: dbparameters.idleTimeoutMillis ?? undefined,
                     max: dbparameters.max ?? undefined
                  }));
               });
            };
            if (dbparameters.dba==1)
               createpoolPostgreSQL()
               .then(pool=>{
                  DB_POOL.map(db=>{ if (db[0]==dbparameters.use)
                     db[1]=pool;
                  });
                  resolve(null);
               });
            else
               createpoolPostgreSQL()
               .then(pool=>{
                  DB_POOL.map(db=>{ if (db[0]==dbparameters.use)
                     if (db[2])
                        db[2].push(pool);
                     else
                        db[2] = [pool];
                  });
                  resolve(null);
               });
            break;
         }
         case 4:{
            /**
             * 
             * @param {string} poolAlias
             */
            const createpoolOracle= poolAlias=>{
               ORACLEDB.createPool({	
                  user: dbparameters.user ?? '',
                  password: dbparameters.password ?? '',
                  connectString: dbparameters.connectString==null?'':dbparameters.connectString,
                  poolMin: dbparameters.poolMin==null?0:dbparameters.poolMin,
                  poolMax: dbparameters.poolMax==null?0:dbparameters.poolMax,
                  poolIncrement: dbparameters.poolIncrement==null?0:dbparameters.poolIncrement,
                  poolAlias: poolAlias
               }, (err) => {
                  if (err)
                     reject(err);
                  else
                     resolve(null);
               });
            };
            if (dbparameters.dba==1){
               const pool_id_dba = 'DBA';
               DB_POOL.map(db=>{ if (db[0]==dbparameters.use) 
                                    db[1]={pool_id_dba};
                              });
               createpoolOracle(pool_id_dba);
            }
            else{
               DB_POOL.map(db=>{if (db[0]==dbparameters.use) 
                                 if (db[2])
                                    db[2].push({pool_id_app:dbparameters.pool_id?.toString()});
                                 else
                                    db[2] = [{pool_id_app: dbparameters.pool_id?.toString()}];
                              });
               if (dbparameters.pool_id!=null)
                  createpoolOracle(dbparameters.pool_id.toString());
            }
            break;
         }
         case 5:{
            DB_POOL.map(db=>{
               if (db[0]==dbparameters.use)
                  sqlite.open({
                     filename: process.cwd() + filePath('DB_FILE'),
                     driver: sqlite3.Database
                  })
                  .then((sqlite_db)=>{
                     db[1]=sqlite_db;
                     sqlite_db.get('PRAGMA foreign_keys = ON');
                     resolve(null);
                  })
                  .catch((error)=>reject(error));
            });
            break;
         }
      }
   });
};
/**
 * @name dbPoolClose
 * @description Delete pool for given database
 * @function
 * @param {number|null} pool_id 
 * @param {number|null} db_use 
 * @param {number} dba 
 * @returns {Promise.<void>}
 */
const dbPoolClose = async (pool_id, db_use, dba) =>{

      if (dba==1)
         DB_POOL.map(db=>{
                           if (db[0]==db_use)
                              db[1] = null;
         });
      else
         if (db_use==5){
            DB_POOL.map(db=>{
               if (db[0]==db_use)
                  db[1] = null;
            });           
         }
         else
            if (pool_id)
               DB_POOL.map(db=>{
                  if (db[0]==db_use)
                     if (db[2])
                        db[2][pool_id] = null;
               });
      

};
/**
 * @name dbPoolGet
 * @description Get pool for database
 * @function
 * @param {number|null} pool_id 
 * @param {number} db_use 
 * @param {number|null} dba 
 * @returns {object|string|null}
 */
const dbPoolGet = (pool_id, db_use, dba) => {
   let pool;
   try {
      if (db_use==5)
         return DB_POOL.filter(db=>db[0]==db_use)[0][1];
      else
         if (pool_id!=null)
            if (dba==1)
               if (db_use==4){
                  /**@ts-ignore */
                  return DB_POOL.filter(db=>db[0]==db_use)[0][1].pool_id_dba;
               }
               else
                  return DB_POOL.filter(db=>db[0]==db_use)[0][1];
            else{
               pool = DB_POOL.filter(db=>db[0]==db_use)[0];
               if (pool[2])
                  if (db_use==4){
                     /**@ts-ignore */
                     return pool[2][pool_id].pool_id_app;
                  }
                  else
                     return pool[2][pool_id];
               else
                  return null;
            }
         else
            return null;
   } catch (err) {
      return null;
   }  
};
/**
 * @name dbSQLParamConvert
 * @description Converts SQL syntax and parameters depending what database is used
 * 
 *              common syntax used and also used by Oracle that should be converted:
 *                      SQL:        UPDATE [table] SET [column] = :title" 
 *                      parameters: { title: "value" }
 * 
 *              postgreSql syntax:   
 *                      SQL:        UPDATE [table] SET [column] = $1"
 *                      parameters: [0, "value"]
 *                      uses unique index with $1, $2 etc, parameter can be used several times
 *                      example: sql with parameters :id, :id, :id and :id2, will get $1, $1, $1 and $2
 *                      use indexorder received from parameters
 * 
 *              MariaDB + mySql syntax:
 *                      SQL:        UPDATE [table] SET [column] = ?"
 *                      parameters: ["value"]
 *                      solution implemented here is to set values in the sql
 *                      using connection?.escape(params[key]) syntax
 *                      to avoid SQL injection and without having to use ? syntax
 *                      that requires specific parameter order but a parameter key
 *                      is only allowed to occur once in this implementation
 * 
 *              SQLite syntax:       
 *                      SQL:        UPDATE [table] SET [column] = $title"
 *                      parameters: [$title, "value"]
 * @function
 * @param {number} db
 * @param {server_db_db_pool_connection_1_2|null} connection
 * @param {string} parameterizedSql
 * @param {{[key:string]:any}} params
 * @returns {{sql:*, parameters:*}}
 */
const dbSQLParamConvert = (db, connection, parameterizedSql, params) => {
   switch (db){
      //MariaDB + mySQL
      case 1:
      case 2:{
         //DB_RETURN_ID not used here
         if ('DB_RETURN_ID' in params)
            delete params.DB_RETURN_ID;
         //DB_CLOB not used here
         if ('DB_CLOB' in params)
            delete params.DB_CLOB;

         if (!params) 
            return {sql:parameterizedSql, 
                     parameters:params};
         return { sql:parameterizedSql.replace(/:(\w+)/g, (txt, key) => {
                        if (key in params)
                           return connection?.escape(params[key]);
                        else
                           return txt;
                     }), 
                  parameters:params};
      }
      case 4:{
         //Oracle 
         //Fix CLOB column syntax to avoid ORA-01461 for these columns:
         if ('DB_CLOB' in params){
            /**@ts-ignore */
            params.DB_CLOB.forEach((/**@type{string}*/column) => {
               /**@ts-ignore */
               params[column] = {  dir: ORACLEDB.BIND_IN, val: params[column], 
                                       type: ORACLEDB.CLOB };
            });
            delete params.DB_CLOB;
         }
         // add RETURNING statement to get insertId
         if ('DB_RETURN_ID' in params){
            parameterizedSql += ` RETURNING ${params.DB_RETURN_ID} INTO :insertId` ;
            delete params.DB_RETURN_ID;
            Object.assign(params, {insertId:   { type: ORACLEDB.NUMBER, dir: ORACLEDB.BIND_OUT }});
         }
         return {sql:parameterizedSql, parameters:params};
      }
      //PostgreSQL + SQLite
      case 3:
      case 5:{
         // add RETURNING statement to get column with id that was inserted, updated or deleted
         if ('DB_RETURN_ID' in params){
            if (db==3)
               parameterizedSql += ` RETURNING ${params.DB_RETURN_ID}` ;
            delete params.DB_RETURN_ID;
         }
         //DB_CLOB not used here
         if ('DB_CLOB' in params)
            delete params.DB_CLOB;
      
         const [text, values] = Object.entries(params).reduce(
            /**@ts-ignore */
            ([sql, array, index], param) => [sql.replace(/:(\w+)/g, (txt, key) => {
                                                      if (key in params)
                                                         //the difference between PostgreSQL and SQLite:
                                                         return db==3?`$${Object.keys(params).indexOf(key) + 1}`:
                                                                      `$${key}`;
                                                      else
                                                         return txt;
                                                      }),
                                             [...array, param[1]], 
                                             index + 1
                                             ],
                                             [parameterizedSql, [], 1]
            );
         if (db==3){
            //PostgreSQL
            return { sql:text, parameters:values};
         }
         else{
            //SQLite
            const parameters_convert = {};
            // change parameter key names to $[parameter name] syntax
            Object.entries(params).map(parameter=>{
               parameter[0]= `$${parameter[0]}`;
               /**@ts-ignore*/
               parameters_convert[parameter[0]] = parameter[1];
            });
            return { sql:text, parameters:parameters_convert};
         }
      }
      default:{
         return { sql:parameterizedSql, parameters:params};
      }
   }
};	
/**
 * @name dbSQLResultConvert
 * @description Sets common attributes for SQL execution result:
 *                insertId       returns id of inserted row
 *                affectedRows   returns number of updated, inserted or deleted rows
 * @function
 * @param {number} db
 * @param {*} result
 * @param {server_db_db_pool_connection_3_fields} fields
 */
const dbSQLResultConvert = (db, result, fields=[{type:0, name:''}]) =>{
   switch (db){
      case 1:
      case 2:{
         //convert blob buffer to string if any column is a BLOB type
         if (result.length>0){
            for (let dbcolumn=0;dbcolumn<fields.length; dbcolumn++){
               if (fields[dbcolumn].type == 252) { //BLOB
                  for (let i=0;i<result.length;i++){
                     if (fields[dbcolumn].name == Object.keys(result[i])[dbcolumn])
                        if (result[i][Object.keys(result[i])[dbcolumn]]!=null && result[i][Object.keys(result[i])[dbcolumn]]!='')
                           result[i][Object.keys(result[i])[dbcolumn]] = Buffer.from(result[i][Object.keys(result[i])[dbcolumn]]).toString();
                  }
               }
            }
         }
         return result;
      }
      case 3:{
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
                     if (result.fields[dbcolumn].name == Object.keys(result.rows[i])[dbcolumn])
                        if (result.rows[i][Object.keys(result.rows[i])[dbcolumn]]!=null && result.rows[i][Object.keys(result.rows[i])[dbcolumn]]!='')
                           result.rows[i][Object.keys(result.rows[i])[dbcolumn]] = Buffer.from(result.rows[i][Object.keys(result.rows[i])[dbcolumn]]).toString();
                  }
               }
            }
         }
         if (result.command == 'SELECT')
            return result.rows;
         else
            return result;
      }
      case 4:{
         //add common attributes
         if (result.outBinds)
            result.insertId = result.outBinds.insertId[0];
         if (result.rowsAffected){
            //add custom key using same name as other databases
            result.affectedRows = result.rowsAffected;
         }
         if (result.rows)
            return result.rows;
         else
            return result;
      }
      case 5:{
         if (result.lastID)
            result.insertId = result.lastID;
         if (result.changes)
            result.affectedRows = result.changes;
         return result;
      }
   }

};
/**
 * @name dbSQL
 * @description Execute query for given database
 *                Common optional parameters:
 *                DB_RETURN_ID
 *                Returns new inserted id from table if used for given column in the parameter
 *                DB_CLOB
 *                Sets CLOB attributes if used 
 *                contains array of columns with CLOB datatype
 * 
 *                All databases return same metadata keys
 *                INSERT:
 *                result.insertId
 *                INSERT, DELETE, UPDATE:
 *                result.affectedRows 
 * 
 *                Conversion functions are implemented to support same parameter syntax inside SQL for all databases
 *                and supports ':' before parameter in the SQL
 * 
 * @function
 * @param {number|null} pool_id 
 * @param {number|null} db_use   - 1 MariaDB 
 *                               - 2 MySQL
 *                               - 3 PostgreSQL
 *                               - 4 Oracle
 *                               - 5 SQLite
 * @param {string} sql
 * @param {*} parameters      - can have an extra DB_RETURN_ID and DB_CLOB key
 * @param {number|null} dba 
 * @returns {Promise.<*>}
 */
const dbSQL = async (pool_id, db_use, sql, parameters, dba) => {
   return new Promise((resolve,reject)=>{
      switch (db_use){
         case 1:
         case 2:{
            try {
               /**@ts-ignore */
               dbPoolGet(pool_id, db_use, dba).getConnection((/**@type{server_server_error}*/err, /**@type{server_db_db_pool_connection_1_2}*/conn) => {
                  if (err)
                     return reject (err);
                  else{
                     conn.config.queryFormat = dbSQLParamConvert(db_use, conn, sql, parameters).sql; 
                     conn.query(sql, parameters, (/**@type{server_server_error}*/err, /**@type{[server_db_db_pool_connection_1_2_result]}*/result, /**@type{server_db_db_pool_connection_3_fields}*/fields) => {
                        if (err)
                           return reject (err);
                        else{
                           conn.release();
                           return resolve(dbSQLResultConvert(db_use, result, fields));
                        }
                     });
                  }
               });					
            } catch (err) {
               return reject (err);
            }
            break;
         }
         case 3:{                  
            const parsed_result = dbSQLParamConvert(db_use, null, sql, parameters);
            try {
               /**@ts-ignore */
               dbPoolGet(pool_id, db_use, dba).connect().then((/**@type{server_db_db_pool_connection_3}*/pool3)=>{
                  pool3.query(parsed_result.sql, parsed_result.parameters)
                  .then((/**@type{server_db_db_pool_connection_3_result}*/result) => {
                     pool3.release();
                     resolve(dbSQLResultConvert(db_use, result));
                  })
                  .catch((/**@type{server_server_error}*/err) => reject(err));
               }).catch((/**@type{server_server_error}*/err)=> reject(err));
            } catch (err) {
               return reject(err);
            }
            break;
         }
         case 4:{
            try{
               const db_pool_id = dbPoolGet(pool_id, db_use, dba);
               /**@ts-ignore */
               const pool4 = ORACLEDB.getPool(db_pool_id);
               pool4.getConnection().then((pool)=>{
                  const parsed_result = dbSQLParamConvert(db_use, null, sql, parameters);
                  /**@ts-ignore */
                  pool.execute(parsed_result.sql, parsed_result.parameters, (/**@type{server_server_error}*/err, /**@type{server_db_db_pool_connection_4_result}*/result) => {
                     if (err)
                        return reject(err);
                     else{
                        pool.close();
                        resolve(dbSQLResultConvert(db_use, result));
                     }
                  });
               })
               .catch(err=> reject(err));
            }catch (err) {
               return reject(err);
            }
            break;
         }
         case 5:{
            const parsed_result = dbSQLParamConvert(db_use, null, sql, parameters);
            const db = dbPoolGet(pool_id, db_use, dba);
            try {
               
               (sql.trimStart().toUpperCase().startsWith('SELECT')?
                     /**@ts-ignore */
                     db.all(parsed_result.sql, parsed_result.parameters):
                        /**@ts-ignore */
                        db.run(parsed_result.sql, parsed_result.parameters))
               .then((/**@type{*}*/result)=>{
                  resolve(dbSQLResultConvert(db_use, result));
               })
               .catch((/**@type{Error}*/err)=> reject(err));   
            }catch (err) {
               return reject(err);
            }
            break;
         }
         default:{
            return reject();
         }
      }
   });
};

export{dbPoolDeleteAll, 
       dbPoolStart, dbPoolClose, dbPoolGet,
       dbSQLParamConvert, dbSQLResultConvert,
       dbSQL};