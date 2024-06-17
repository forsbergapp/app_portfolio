/** @module server/db */

/**@type{import('../server.service')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('../config.service')} */
const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('./file.service')} */
const {SLASH} = await import(`file://${process.cwd()}/server/db/file.service.js`);

//mysql module used for both MariaDB and MySQL
const MYSQL               = await import('mysql');
const {default: PG}       = await import('pg');
const {default: ORACLEDB} = await import('oracledb');
const {default:sqlite3}   = await import('sqlite3');
const sqlite              = await import('sqlite');
/**
 * POOL_DB
 * All database pool connections are saved here
 * Oracle uses number to 
 * @type{import('../../types.js').db_pool[]}
 */
const POOL_DB =[ 
                  [1, null, null], //MySQL pools      [db number, dba pool object, apps pool object]
                  [2, null, null], //MariaDB pools    [db number, dba pool object, apps pool object]
                  [3, null, null], //PostgreSQL pools [db number, dba pool object, apps pool object]
                  [4, null, null], //Oracle pools     [db number, dba pool object {pool_id_dba: 0}, apps pool object {pool_id_app: 0}]
                  [5, null, null]  //SQLite           [db number, db object, null]
               ];                     

if (getNumberValue(ConfigGet('SERVICE_DB', 'USE'))==4){
   ORACLEDB.autoCommit = true;
   ORACLEDB.fetchAsString = [ ORACLEDB.CLOB ];
   ORACLEDB.outFormat = ORACLEDB.OUT_FORMAT_OBJECT;
}
/**
 * Delete all pools for given database
 * Deletes variable content, not the same as 
 * using API to close, release or end connection
 * and all database API use different logic.
 * Needed to restart database connection after admin
 * have changed parameters and without having to restart server
 * @param {number} db
 */
const pool_delete_all = (db)=>{
      //relase db pools from memory
      POOL_DB.map(pool=>{if (pool[0]==db){
                           pool[1]=null;
                           pool[2]=null;
                        }
                        });
};
/**
 * Pool start
 * 
 *    parameters:
 * 
 *    use:                     1-5
 *    pool_id:                 start with 0 and increase pool id value +1 for each new pool where pool will be saved
 *    port:                    port,
 *    host:                    host,
 *    dba:                     1/0,
 *    user:                    username,
 *    password:                password,
 *    database:                database,
 *
 *    db 1 + 2 parameters      see MariaDB/MySQL documentation
 *    charset:                 character set,
 *    connnectionLimit:        connection limit
 *
 *    db 3 parameters          see PostgreSQL documentation
 *    connectionTimeoutMillis: connection timout milliseconds
 *    idleTimeoutMillis:       idle timeout milliseconds
 *    max:                     max
 *
 *    db 4 parameters          see Oracle documentation
 *    connectString:           connectstring
 *    poolMin:                 pool min
 *    poolMax:                 pool max
 *    poolIncrement:           pool increment
 * 
 *    db 5 parameter
 *    fileName                 default app_portfolio.db saved in /data
 *    
 * @param {import('../../types.js').db_pool_parameters} dbparameters 
 * @returns {Promise.<null>}
 */
const pool_start = async (dbparameters) =>{
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
            POOL_DB.map(db=>
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
                  POOL_DB.map(db=>{ if (db[0]==dbparameters.use)
                     db[1]=pool;
                  });
                  resolve(null);
               });
            else
               createpoolPostgreSQL()
               .then(pool=>{
                  POOL_DB.map(db=>{ if (db[0]==dbparameters.use)
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
               POOL_DB.map(db=>{ if (db[0]==dbparameters.use) 
                                    db[1]={pool_id_dba};
                              });
               createpoolOracle(pool_id_dba);
            }
            else{
               POOL_DB.map(db=>{if (db[0]==dbparameters.use) 
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
            POOL_DB.map(db=>{
               if (db[0]==dbparameters.use)
                  sqlite.open({
                     filename: process.cwd() + `${SLASH}data${SLASH}${dbparameters.fileName ?? ''}`,
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
 * Delete pool for given database
 * @param {number|null} pool_id 
 * @param {number|null} db_use 
 * @param {number} dba 
 * @returns 
 */
const pool_close = async (pool_id, db_use, dba) =>{
   try {
      if (dba==1)
         POOL_DB.map(db=>{
                           if (db[0]==db_use)
                              db[1] = null;
         });
      else
         if (pool_id)
            POOL_DB.map(db=>{
               if (db[0]==db_use)
                  if (db[2])
                     db[2][pool_id] = null;
            });
         else
            return null;   
   } catch (err) {
      return null;
   }
   return null;

};
/**
 * Get pool for database
 * @param {number|null} pool_id 
 * @param {number} db_use 
 * @param {number|null} dba 
 * @returns {object|string|null}
 */
const pool_get = (pool_id, db_use, dba) => {
   let pool;
   try {
      if (db_use==5)
         return POOL_DB.filter(db=>db[0]==db_use)[0][1];
      else
         if (pool_id!=null)
            if (dba==1)
               if (db_use==4){
                  /**@ts-ignore */
                  return POOL_DB.filter(db=>db[0]==db_use)[0][1].pool_id_dba;
               }
               else
                  return POOL_DB.filter(db=>db[0]==db_use)[0][1];
            else{
               pool = POOL_DB.filter(db=>db[0]==db_use)[0];
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
 * Execute query for given database
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
const db_query = async (pool_id, db_use, sql, parameters, dba) => {
   return new Promise((resolve,reject)=>{
      switch (db_use){
         case 1:
         case 2:{
            try {
               //DB_RETURN_ID not used here
               if ('DB_RETURN_ID' in parameters)
                  delete parameters.DB_RETURN_ID;
               //DB_CLOB not used here
               if ('DB_CLOB' in parameters)
                  delete parameters.DB_CLOB;
               /**@ts-ignore */
               pool_get(pool_id, db_use, dba).getConnection((/**@type{import('../../types.js').error}*/err, /**@type{import('../../types.js').pool_connection_1_2}*/conn) => {
                  if (err)
                     return reject (err);
                  else{
                     //change parameters to [] syntax with bind variable names
                     //common syntax:  ... ("UPDATE [table] SET [column] = :title", { title: "value" });
                     //mysql syntax:   ... ("UPDATE [table] SET [column] = ?", ["value"];
                     conn.config.queryFormat = (/**@type{string}*/sql, /**@type{[]}*/parameters) => {
                        if (!parameters) return sql;
                        return sql.replace(/:(\w+)/g, (txt, key) => {
                           if (key in parameters)
                              return conn.escape(parameters[key]);
                           else
                              return txt;
                        });
                     };
                     conn.query(sql, parameters, (/**@type{import('../../types.js').error}*/err, /**@type{[import('../../types.js').db_pool_connection_1_2_result]}*/result, /**@type{import('../../types.js').db_pool_connection_3_fields}*/fields) => {
                        if (err)
                           return reject (err);
                        else{
                           conn.release();
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
                           return resolve(result);
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
            // add RETURNING statement to get insertId
            if ('DB_RETURN_ID' in parameters){
               sql += ` RETURNING ${parameters.DB_RETURN_ID}` ;
               delete parameters.DB_RETURN_ID;
            }
            //DB_CLOB not used here
            if ('DB_CLOB' in parameters)
                  delete parameters.DB_CLOB;
            /**
             * change parameters to $ syntax
             * use unique index with $1, $2 etc, parameter can be used several times
             * example: sql with parameters :id, :id, :id and :id2, will get $1, $1, $1 and $2
             * use indexorder received from parameters
             * common syntax:     ... ("UPDATE [table] SET [column] = :title", { title: "value" });
             * postgresql syntax: ... ("UPDATE [table] SET [column] = $1", [0, "value"];
             * @param {string} parameterizedSql
             * @param {object} params
             */
            const queryConvert = (parameterizedSql, params) => {
                const [text, values] = Object.entries(params).reduce(
               /**@ts-ignore */
                    ([sql, array, index], param) => [sql.replace(/:(\w+)/g, (txt, key) => {
                                                               if (key in params)
                                                                  return `$${Object.keys(params).indexOf(key) + 1}`;
                                                               else
                                                                  return txt;
                                                               }),
                                                      [...array, param[1]], 
                                                      index + 1
                                                    ],
                                                    [parameterizedSql, [], 1]
                );
                return { text, values };
            };	
            const parsed_result = queryConvert(sql, parameters);
            try {
               /**@ts-ignore */
               pool_get(pool_id, db_use, dba).connect().then((/**@type{import('../../types.js').pool_connection_3}*/pool3)=>{
                  pool3.query(parsed_result.text, parsed_result.values)
                  .then((/**@type{import('../../types.js').db_pool_connection_3_result}*/result) => {
                     pool3.release();
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
                        return resolve(result.rows);
                     else
                        return resolve(result);
                  })
                  .catch((/**@type{import('../../types.js').error}*/err) => reject(err));
               }).catch((/**@type{import('../../types.js').error}*/err)=> reject(err));
            } catch (err) {
               return reject(err);
            }
            break;
         }
         case 4:{
            try{
               const db_pool_id = pool_get(pool_id, db_use, dba);
               /**@ts-ignore */
               const pool4 = ORACLEDB.getPool(db_pool_id);
               pool4.getConnection().then((pool)=>{
                  //Fix CLOB column syntax to avoid ORA-01461 for these columns:
                  if ('DB_CLOB' in parameters){
                     parameters.DB_CLOB.forEach((/**@type{string}*/column) => {
                        parameters[column] = {  dir: ORACLEDB.BIND_IN, val: parameters[column], 
                                                type: ORACLEDB.CLOB };
                     });
                     delete parameters.DB_CLOB;
                  }
                  // add RETURNING statement to get insertId
                  if ('DB_RETURN_ID' in parameters){
                     sql += ` RETURNING ${parameters.DB_RETURN_ID} INTO :insertId` ;
                     delete parameters.DB_RETURN_ID;
                     Object.assign(parameters, {insertId:   { type: ORACLEDB.NUMBER, dir: ORACLEDB.BIND_OUT }});
                  }
                  /**@ts-ignore */
                  pool.execute(sql, parameters, (/**@type{import('../../types.js').error}*/err, /**@type{import('../../types.js').pool_connection_4_result}*/result) => {
                     if (err)
                        return reject(err);
                     else{
                        pool.close();
                        //add common attributes
                        if (result.outBinds)
                           result.insertId = result.outBinds.insertId[0];
                        if (result.rowsAffected){
                           //add custom key using same name as other databases
                           result.affectedRows = result.rowsAffected;
                        }
                        if (result.rows)
                           return resolve(result.rows);
                        else
                           return resolve(result);
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
            //DB_RETURN_ID not used here
            if ('DB_RETURN_ID' in parameters)
                  delete parameters.DB_RETURN_ID;
            //DB_CLOB not used here
            if ('DB_CLOB' in parameters)
               delete parameters.DB_CLOB;
            /**
             * change parameters to $[parameter name] syntax
             * common syntax: ... "UPDATE [table] SET [column] = :title", { title: "value" });
             * SQLite syntax: ... "UPDATE [table] SET [column] = $title", [$title, "value"];
             * @param {string} parameterizedSql
             * @param {*} params
             */
            const queryConvert = (parameterizedSql, params) => {
                const [text] = Object.entries(params).reduce(
               /**@ts-ignore */
                    ([sql, array, index], param) => [sql.replace(/:(\w+)/g, (txt, key) => {
                                                               if (key in params){
                                                                  return `$${key}`;
                                                               }
                                                               else
                                                                  return txt;
                                                               }),
                                                      [...array, param[1]], 
                                                      index + 1
                                                    ],
                                                    [parameterizedSql, [], 1]
                );
                return text;
            };	
            // change parameter key names to $[parameter name] syntax
            const parameters_convert = {};
            Object.entries(parameters).map(parameter=>{
               parameter[0]= `$${parameter[0]}`;
               /**@ts-ignore*/
               parameters_convert[parameter[0]] = parameter[1];
            });
            const sql_convert = queryConvert(sql, parameters);
            const db = pool_get(pool_id, db_use, dba);
            try {
               /**@ts-ignore */
               (sql.trimStart().toUpperCase().startsWith('SELECT')?db.all(sql_convert, parameters_convert):db.run(sql_convert, parameters_convert))
               .then((/**@type{*}*/result)=>{
                  if (result.lastID)
                     result.insertId = result.lastID;
                  if (result.changes)
                        result.affectedRows = result.changes;
                  resolve(result);
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

export{pool_delete_all, 
       pool_start, pool_close, pool_get,
       db_query};