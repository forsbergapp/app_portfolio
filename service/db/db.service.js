//mysql module used for both MariaDB and MySQL
let MYSQL               = await import("mysql");
let {default: PG}       = await import('pg');
let {default: ORACLEDB} = await import('oracledb');

const POOL_DB =[
                  [1, null, []], //MySQL pools        [db number, dba, apps in array]
                  [2, null, []], //MariaDB pools      [db number, dba, apps in array]
                  [3, null, []], //PostgreSQL pools   [db number, dba, apps in array]
                  [4, null, []]  //Oracle pools       [db number, dba, apps in array]
               ];                     

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
const DBShutdown = async (db)=>{
      //relase db pools from memory, not shutting down db
      for (let dbnumber in POOL_DB_EMPTY){
         if (dbnumber[0]==parseInt(db)){
            db[1] = null;
            db[2] = []
         }
      }
      //reset db variables
      switch (parseInt(db)){
         case 1:
         case 2:{
            MYSQL = null;
            MYSQL = await import('mysql');
         }
         case 3:{
            PG = null;
            PG = await import('pg');
         }
         case 4:{
            ORACLEDB = null;
            ORACLEDB = await import('oracledb');
         }
      }
}
const pool_start = async (dbparameters) =>{
   /* dbparameters in JSON format:
      "use":                     1-4
      "init":                    1/0,
      "pool_id":                 start with 0 and increase pool id value +1 for each new pool where pool will be saved
      "port":                    port,
      "host":                    host,
      "dba":                     1/0,
      "user":                    username,
      "password":                password,
      "database":                database,

      //db 1 + 2 parameters      see MySQL/MariaDB documentation
      "charset":                 character set,
      "connnectionLimit":        connection limit

      // db 3 parameters         see PostgreSQL documentation
      "connectionTimeoutMillis": connection timout milliseconds
      "idleTimeoutMillis":       idle timeout milliseconds
      "max":                     max

      //db 4 parameters          see Oracle documentation
      "connectString":           connectstring
      "poolMin":                 pool min
      "poolMax":                 pool max
      "poolIncrement":           pool increment
   */
   if (dbparameters.init == 1)
      await DBInit(dbparameters.use);
   return new Promise((resolve, reject) => {
      switch(dbparameters.use){
         case '1':
         case '2':{
            if (dbparameters.dba==1)
               POOL_DB.map(db=>{ if (db[0]==parseInt(dbparameters.use)) 
                                    db[1]=MYSQL.createPool({
                                          host: dbparameters.host,
                                          port: dbparameters.port,
                                          user: dbparameters.user,
                                          password: dbparameters.password,
                                          database: dbparameters.database,
                                          charset: dbparameters.charset,
                                          connnectionLimit: dbparameters.connnectionLimit
               })
               resolve();
            })
            else
               POOL_DB.map(db=>{if (db[0]==parseInt(dbparameters.use))
                                    db[2].push(
                                       MYSQL.createPool({
                                       host: dbparameters.host,
                                       port: dbparameters.port,
                                       user: dbparameters.user,
                                       password: dbparameters.password,
                                       database: dbparameters.database,
                                       charset: dbparameters.charset,
                                       connnectionLimit: dbparameters.connnectionLimit
                                       }))
                                 })
               resolve();

            break;
         }
         case '3':{
            const createpoolPostgreSQL = () =>{
               return new Promise(resolve=>{
                  resolve(new PG.Pool({
                     user: dbparameters.user,
                     password: dbparameters.password,
                     host: dbparameters.host,
                     port: dbparameters.port,
                     database: dbparameters.database,
                     connectionTimeoutMillis: dbparameters.connectionTimeoutMillis,
                     idleTimeoutMillis: dbparameters.idleTimeoutMillis,
                     max: dbparameters.max
                  }))
               })
            }
            if (dbparameters.dba==1)
               createpoolPostgreSQL()
               .then(pool=>{
                  POOL_DB.map(db=>{ if (db[0]==parseInt(dbparameters.use))    
                     db[1]=pool;
                  })
                  resolve();
               })
            else
               createpoolPostgreSQL()
               .then(pool=>{
                  POOL_DB.map(db=>{ if (db[0]==parseInt(dbparameters.use))    
                     db[2].push(pool);
                  })
                  resolve();
               })
            break;
         }
         case '4':{
            let pool_id;
            const createpoolOracle= ()=>{
               ORACLEDB.createPool({	
                  user: dbparameters.user,
                  password: dbparameters.password,
                  connectString: dbparameters.connectString,
                  poolMin: dbparameters.poolMin,
                  poolMax: dbparameters.poolMax,
                  poolIncrement: dbparameters.poolIncrement,
                  poolAlias: pool_id.toString()
               }, (err,result) => {
                  if (err)
                     reject(err);
                  else
                     resolve();
               });
            }
            if (dbparameters.dba==1){
               pool_id = 'DBA';
               POOL_DB.map(db=>{if (db[0]==parseInt(dbparameters.use)) db[1]=pool_id})
               createpoolOracle();
            }
            else{
               pool_id = dbparameters.pool_id;
               POOL_DB.map(db=>{if (db[0]==parseInt(dbparameters.use)) db[2].push(pool_id)})
               createpoolOracle();
            }
            break;
         }
      }
   })
}
const pool_close = async (pool_id, db_use, dba) =>{
   try {
      if (dba==1)
         POOL_DB.filter(db=>db[0]==parseInt(db_use))[0][1] = null;
      else
         POOL_DB.filter(db=>db[0]==parseInt(db_use))[0][2][parseInt(pool_id)] = null;
   } catch (error) {
      return null;   
   }
   return null;

}
const pool_get = (pool_id, db_use, dba) => {
   try {
      let pool;
      if (dba==1){
         pool = POOL_DB.filter(db=>db[0]==parseInt(db_use))[0][1];
         return pool;
      }
      else{
         pool = POOL_DB.filter(db=>db[0]==parseInt(db_use))[0][2][parseInt(pool_id)];
         return pool;
      }
   } catch (error) {
      return null;
   }  
}
const db_query = async (pool_id, db_use, sql, parameters, dba) => {
   return new Promise((resolve,reject)=>{
      sql = Buffer.from(sql, 'base64').toString('utf-8');
      parameters = Buffer.from(parameters, 'base64').toString('utf-8');
      parameters = JSON.parse(parameters);
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
               pool_get(pool_id, db_use, dba).getConnection((err, conn) => {
                  conn.release();
                  if (err)
                     reject (err);
                  else{
                     config_connection(conn, sql, parameters);
                     conn.query(sql, parameters, (err, result, fields) => {
                        if (err){
                           reject (err);
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
                           resolve(result);
                        }
                     })
                  }
               });					
            } catch (error) {
               reject (err);
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
               pool_get(pool_id, db_use, dba).connect().then((pool3)=>{
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
                     resolve(result.rows);
                  else
                     resolve(result);
                  })
                  .catch((error) => {
                     reject(error);
                        
                  })
               });
            } catch (error) {
               reject(error);
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
               ORACLEDB.getConnection(pool_get(pool_id, db_use, dba)).then((pool4)=>{
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
                  pool4.execute(sql, parameters, (err,result) => {
                     if (err) {
                        reject(error);
                     }
                     else{
                        if (result.rowsAffected)
                           result.affectedRows = result.rowsAffected;
                        if (result.rows)
                           resolve(result.rows);
                        else
                           resolve(result);
                     }
                  });
               });
            }catch (error) {
               reject(error);
            } finally {
               if (pool4) {
                  pool4.close(); 
               }
            }
            break;
         }
      }
   })
}

export{DBInit, DBShutdown, 
       pool_start, pool_close, pool_get,
       db_query}