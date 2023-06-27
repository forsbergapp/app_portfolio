const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
//mysql module used for both MariaDB and MySQL
let MYSQL               = await import('mysql');
let {default: PG}       = await import('pg');
let {default: ORACLEDB} = await import('oracledb');

const POOL_DB =[
                  [1, null, []], //MySQL pools        [db number, dba, apps in array]
                  [2, null, []], //MariaDB pools      [db number, dba, apps in array]
                  [3, null, []], //PostgreSQL pools   [db number, dba, apps in array]
                  [4, null, []]  //Oracle pools       [db number, dba, apps in array]
               ];                     

if (ConfigGet(1, 'SERVICE_DB', 'USE')=='4'){
   ORACLEDB.autoCommit = true;
   ORACLEDB.fetchAsString = [ ORACLEDB.CLOB ];
   ORACLEDB.initOracleClient({ libDir: ConfigGet(1, 'SERVICE_DB', 'DB4_LIBDIR'),
                                 configDir: ConfigGet(1, 'SERVICE_DB', 'DB4_CONFIGDIR')});
   ORACLEDB.outFormat = ORACLEDB.OUT_FORMAT_OBJECT;
}

const pool_close_all = async (db)=>{
      //relase db pools from memory, not shutting down db
      for (const dbnumber in POOL_DB){
         if (dbnumber[0]==parseInt(db)){
            db[1] = null;
            db[2] = [];
         }
      }
      //reset db variables
      switch (parseInt(db)){
         case 1:
         case 2:{
            MYSQL = null;
            MYSQL = await import('mysql');
            break;
         }
         case 3:{
            PG = null;
            PG = await import('pg');
            break;
         }
         case 4:{
            ORACLEDB = null;
            ORACLEDB = await import('oracledb');
            break;
         }
      }
};
const pool_start = async (dbparameters) =>{
   /* dbparameters in JSON format:
      "use":                     1-4
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
   return new Promise((resolve, reject) => {
      switch(dbparameters.use){
         case 1:
         case 2:{
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
               });
               resolve();
            });
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
                                       }));
                                 });
               resolve();

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
                     database: dbparameters.database,
                     connectionTimeoutMillis: dbparameters.connectionTimeoutMillis,
                     idleTimeoutMillis: dbparameters.idleTimeoutMillis,
                     max: dbparameters.max
                  }));
               });
            };
            if (dbparameters.dba==1)
               createpoolPostgreSQL()
               .then(pool=>{
                  POOL_DB.map(db=>{ if (db[0]==parseInt(dbparameters.use))    
                     db[1]=pool;
                  });
                  resolve();
               });
            else
               createpoolPostgreSQL()
               .then(pool=>{
                  POOL_DB.map(db=>{ if (db[0]==parseInt(dbparameters.use))    
                     db[2].push(pool);
                  });
                  resolve();
               });
            break;
         }
         case 4:{
            let pool_id;
            const createpoolOracle= ()=>{
               ORACLEDB.createPool({	
                  user: dbparameters.user,
                  password: dbparameters.password,
                  connectString: dbparameters.connectString,
                  poolMin: dbparameters.poolMin,
                  poolMax: dbparameters.poolMax,
                  poolIncrement: dbparameters.poolIncrement,
                  poolAlias: pool_id
               }, (err,result) => {
                  if (err)
                     reject(err);
                  else
                     resolve();
               });
            };
            if (dbparameters.dba==1){
               pool_id = 'DBA';
               POOL_DB.map(db=>{if (db[0]==parseInt(dbparameters.use)) db[1]=pool_id;});
               createpoolOracle();
            }
            else{
               pool_id = `'${dbparameters.pool_id}'`;
               POOL_DB.map(db=>{if (db[0]==parseInt(dbparameters.use)) db[2].push(pool_id);});
               createpoolOracle();
            }
            break;
         }
      }
   });
};
const pool_close = async (pool_id, db_use, dba) =>{
   try {
      if (dba==1)
         POOL_DB.filter(db=>db[0]==parseInt(db_use))[0][1] = null;
      else
         POOL_DB.filter(db=>db[0]==parseInt(db_use))[0][2][parseInt(pool_id)] = null;
   } catch (err) {
      return null;   
   }
   return null;

};
const pool_get = (pool_id, db_use, dba) => {
   let pool;
   try {
      
      if (dba==1){
         pool = POOL_DB.filter(db=>db[0]==parseInt(db_use))[0][1];
         return pool;
      }
      else{
         pool = POOL_DB.filter(db=>db[0]==parseInt(db_use))[0][2][parseInt(pool_id)];
         return pool;
      }
   } catch (err) {
      return null;
   }  
};
const db_query = async (pool_id, db_use, sql, parameters, dba) => {
   return new Promise((resolve,reject)=>{
      switch (db_use){
         case 1:
         case 2:{
            //Both MySQL and MariaDB use MySQL npm module
            try {
               pool_get(pool_id, db_use, dba).getConnection((err, conn) => {
                  conn.release();
                  if (err)
                     return reject (err);
                  else{
                     //change json parameters to [] syntax with bind variable names
                     //common syntax: connection.query("UPDATE [table] SET [column] = :title", { title: "value" });
                     //mysql syntax: connection.query("UPDATE [table] SET [column] = ?", ["value"];
                     conn.config.queryFormat = (sql, parameters) => {
                        if (!parameters) return sql;
                        return sql.replace(/:(\w+)/g, (txt, key) => {
                           if (Object.prototype.hasOwnProperty.call(parameters, key)) {
                           return conn.escape(parameters[key]);
                           }
                           return txt;
                        });
                     };
                     conn.query(sql, parameters, (err, result, fields) => {
                        if (err){
                           return reject (err);
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
            const queryConvert = (parameterizedSql, params) => {
               //change json parameters to $ syntax
               //use unique index with $1, $2 etc, parameter can be used several times
               //example: sql with parameters :id, :id, :id and :id2, will get $1, $1, $1 and $2
               //use indexorder received from parameters
               //common syntax: connection.query("UPDATE [table] SET [column] = :title", { title: "value" });
               //postgresql syntax: connection.query("UPDATE [table] SET [column] = $1", [0, "value"];
                const [text, values] = Object.entries(params).reduce(
                    ([sql, array, index], [key, value]) => [sql.replace(/:(\w+)/g, (txt, key) => {
                                                                     if (Object.prototype.hasOwnProperty.call(params, key)){
                                                                        return `$${Object.keys(params).indexOf(key) + 1}`;
                                                                     }
                                                                     else
                                                                        return txt;
                                                                  }), 
                                                [...array, value], index + 1],
                                                  [parameterizedSql, [], 1]
                );
                return { text, values };
            };	
            const parsed_result = queryConvert(sql, parameters);
            try {
               pool_get(pool_id, db_use, dba).connect().then((pool3)=>{
                  pool3.query(parsed_result.text, parsed_result.values)
                  .then((result) => {
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
                  .catch(err => {
                     return reject(err);
                  });
               }).catch(err=>{
                  return reject(err);   
               });
            } catch (err) {
               return reject(err);
            }
            break;
         }
         case 4:{
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
                  Object.keys(parameters).forEach(key => {
                     if (key.toLowerCase() == 'screenshot' ||
                        key.toLowerCase() == 'avatar' ||
                        key.toLowerCase() == 'provider_image' ||
                        key.toLowerCase() == 'settings_json')
                        parameters[key] = { dir: ORACLEDB.BIND_IN, val: parameters[key], type: ORACLEDB.CLOB };
                  });
                  pool4.execute(sql, parameters, (err,result) => {
                     pool4.close();
                     if (err) {
                        return reject(err);
                     }
                     else{
                        if (result.rowsAffected)
                           result.affectedRows = result.rowsAffected;
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

export{pool_close_all, 
       pool_start, pool_close, pool_get,
       db_query};