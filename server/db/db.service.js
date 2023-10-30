/** @module server/db */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
//mysql module used for both MariaDB and MySQL
const MYSQL               = await import('mysql');
const {default: PG}       = await import('pg');
const {default: ORACLEDB} = await import('oracledb');

/**
 * POOL_DB
 * All database pool connections are saved here
 * Oracle uses number to 
 * @type{Types.pool_db[]}
 */
const POOL_DB =[ 
                  [1, null, null], //MySQL pools        [db number, dba pool object, apps pool object]
                  [2, null, null], //MariaDB pools      [db number, dba pool object, apps pool object]
                  [3, null, null], //PostgreSQL pools   [db number, dba pool object, apps pool object]
                  [4, null, null]  //Oracle pools       [db number, dba pool object {pool_id_dba: 0}, apps pool object {pool_id_app: 0}]
               ];                     

if (ConfigGet('SERVICE_DB', 'USE')=='4'){
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
 * dbparameters in JSON format:
 *      "use":                     1-4
 *      "pool_id":                 start with 0 and increase pool id value +1 for each new pool where pool will be saved
 *      "port":                    port,
 *      "host":                    host,
 *      "dba":                     1/0,
 *      "user":                    username,
 *      "password":                password,
 *      "database":                database,
 *
 *      //db 1 + 2 parameters      see MariaDB/MySQL documentation
 *      "charset":                 character set,
 *      "connnectionLimit":        connection limit
 *
 *      // db 3 parameters         see PostgreSQL documentation
 *      "connectionTimeoutMillis": connection timout milliseconds
 *      "idleTimeoutMillis":       idle timeout milliseconds
 *      "max":                     max
 *
 *      //db 4 parameters          see Oracle documentation
 *      "connectString":           connectstring
 *      "poolMin":                 pool min
 *      "poolMax":                 pool max
 *      "poolIncrement":           pool increment
 * @param {Types.pool_parameters} dbparameters 
 * @returns {Promise.<null>}
 */
const pool_start = async (dbparameters) =>{
   return new Promise((resolve, reject) => {
      switch(dbparameters.use){
         case 1:
         case 2:{            
            /**@type{object} */
            const mysql_pool = MYSQL.createPool({
                                 host: dbparameters.host,
                                 port: dbparameters.port,
                                 user: dbparameters.user,
                                 password: dbparameters.password,
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
                     user: dbparameters.user,
                     password: dbparameters.password,
                     host: dbparameters.host,
                     port: dbparameters.port,
                     database: dbparameters.database==null?'':dbparameters.database,
                     connectionTimeoutMillis: dbparameters.connectionTimeoutMillis,
                     idleTimeoutMillis: dbparameters.idleTimeoutMillis,
                     max: dbparameters.max
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
                  user: dbparameters.user,
                  password: dbparameters.password,
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
               /**@ts-ignore */
               createpoolOracle(dbparameters.pool_id.toString());
            }
            break;
         }
      }
   });
};
/**
 * Delete pool for given database
 * @param {number} pool_id 
 * @param {number} db_use 
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
         POOL_DB.map(db=>{
            if (db[0]==db_use)
               if (db[2])
                  db[2][pool_id] = null;
         });
   } catch (err) {
      return null;   
   }
   return null;

};
/**
 * Get pool for database
 * @param {number} pool_id 
 * @param {number} db_use 
 * @param {number} dba 
 * @returns {object|string|null}
 */
const pool_get = (pool_id, db_use, dba) => {
   let pool;
   try {
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
   } catch (err) {
      return null;
   }  
};

/**
 * Execute query for given database
 * @param {number} pool_id 
 * @param {number} db_use     - 1/2 MariaDB + MySQL use MySQL npm module
 *                            - 3 PostgreSQL
 *                            - 4 Oracle
 * @param {string} sql
 * @param {*} parameters      - can have an extra RETURN_ID key used for Oracle
 *                            - to add extra RETURNING clause to SQL, syntax specific for Oracle
 * @param {number} dba 
 * @returns 
 */
const db_query = async (pool_id, db_use, sql, parameters, dba) => {
   return new Promise((resolve,reject)=>{
      switch (db_use){
         case 1:
         case 2:{
            try {
               if ('RETURN_ID' in parameters)
                  delete parameters.RETURN_ID;
               /**@ts-ignore */
               pool_get(pool_id, db_use, dba).getConnection((/**@type{Types.error}*/err, /**@type{Types.pool_connection_1_2}*/conn) => {
                  if (err)
                     return reject (err);
                  else{
                     //change json parameters to [] syntax with bind variable names
                     //common syntax: connection.query("UPDATE [table] SET [column] = :title", { title: "value" });
                     //mysql syntax: connection.query("UPDATE [table] SET [column] = ?", ["value"];
                     conn.config.queryFormat = (/**@type{string}*/sql, /**@type{[]}*/parameters) => {
                        if (!parameters) return sql;
                        return sql.replace(/:(\w+)/g, (txt, key) => {
                           if (Object.prototype.hasOwnProperty.call(parameters, key)) {
                           return conn.escape(parameters[key]);
                           }
                           return txt;
                        });
                     };
                     conn.query(sql, parameters, (/**@type{Types.error}*/err, /**@type{[Types.pool_connection_1_2_result]}*/result, /**@type{Types.pool_connection_3_fields}*/fields) => {
                        if (err){
                           return reject (err);
                        }
                        else{
                           conn.release();
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
            if ('RETURN_ID' in parameters){
               delete parameters.RETURN_ID;
               sql += ' RETURNING id ';
            }
            /**
             * @param {string} parameterizedSql
             * @param {object} params
             */
            const queryConvert = (parameterizedSql, params) => {
               //change json parameters to $ syntax
               //use unique index with $1, $2 etc, parameter can be used several times
               //example: sql with parameters :id, :id, :id and :id2, will get $1, $1, $1 and $2
               //use indexorder received from parameters
               //common syntax: connection.query("UPDATE [table] SET [column] = :title", { title: "value" });
               //postgresql syntax: connection.query("UPDATE [table] SET [column] = $1", [0, "value"];
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
               pool_get(pool_id, db_use, dba).connect().then((/**@type{Types.pool_connection_3}*/pool3)=>{
                  pool3.query(parsed_result.text, parsed_result.values)
                  .then((/**@type{Types.pool_connection_3_result}*/result) => {
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
                                 if (result.fields[dbcolumn]['name'] == Object.keys(result.rows[i])[dbcolumn])
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
                  .catch((/**@type{Types.error}*/err) => {
                     return reject(err);
                  });
               }).catch((/**@type{Types.error}*/err)=>{
                  return reject(err);   
               });
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
                  /*
                  Fix CLOB column syntax to avoid ORA-01461 for these columns:
                     APP_ACCOUNT.SCREENSHOT
                     USER_ACCOUNT.AVATAR
                     USER_ACCOUNT.PROVIDER_IMAGE
                     USER_ACCOUNT_APP_SETTING.SETTINGS_JSON
                     use same parameter name as column name
                  */
                  Object.keys(parameters).forEach(key => {
                     if (key.toLowerCase() == 'screenshot' ||
                        key.toLowerCase() == 'avatar' ||
                        key.toLowerCase() == 'provider_image' ||
                        key.toLowerCase() == 'settings_json')
                        /**@ts-ignore */
                        parameters[key] = { dir: ORACLEDB.BIND_IN, val: parameters[key], type: ORACLEDB.CLOB };
                  });
                  // add RETURNING statement to get insertId
                  if ('RETURN_ID' in parameters){
                     delete parameters.RETURN_ID;
                     sql += ' RETURNING id INTO :insertId';
                     Object.assign(parameters, {insertId:   { type: ORACLEDB.NUMBER, dir: ORACLEDB.BIND_OUT }});
                  }
                  /**@ts-ignore */
                  pool.execute(sql, parameters, (/**@type{Types.error}*/err, /**@type{Types.pool_connection_4_result}*/result) => {
                     if (err) {
                        return reject(err);
                     }
                     else{
                        pool.close();
                        //add common attributes
                        if (result.outBinds){
                           result.insertId = result.outBinds.insertId[0];
                        }
                        if (result.rowsAffected){
                           //add custom key using same name as other databases
                           /**@ts-ignore */
                           result.affectedRows = result.rowsAffected;
                        }
                        if (result.rows)
                           return resolve(result.rows);
                        else
                           return resolve(result);
                     }
                  });
               })
               .catch(err=>{
                  return reject(err);
               });
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