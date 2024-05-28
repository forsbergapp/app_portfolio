/** @module server/db/sql */

/**
 * 
 * @param {number} app_id 
 * @param {number} DBA
 * @returns {Promise.<import('../../../types.js').db_result_admin_DBInfo[]>}
 */
 const Info = async (app_id, DBA) => {
   /**@type{import('../../server.service.js')} */
   const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
   /**@type{import('../../config.service.js')} */
   const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
   /**@type{import('../../db/common.service.js')} */
   const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);
   
   let sql = '';
   const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
   switch (db_use){
      case 1:
      case 2:{
         let table_global_variables;
         if (db_use == 1){
            //MariaDB
            table_global_variables = 'information_schema';
         }
         else{
            //MySQL
            table_global_variables = 'performance_schema';
         }
         sql = `SELECT :database database_use,
                     (SELECT variable_value
                        FROM ${table_global_variables}.global_variables
                        WHERE variable_name = 'version_comment') database_name,
                     (SELECT variable_value
                        FROM ${table_global_variables}.global_variables
                        WHERE variable_name='version') version,
                     :database_schema database_schema,
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
      case 3:{
         sql = `SELECT :database "database_use",
                        version() "database_name",
                        current_setting('server_version') "version",
                        :database_schema "database_schema",
                        inet_server_addr() "hostname", 
                        (SELECT count(*) 
                           FROM pg_stat_activity 
                           WHERE datname IS NOT NULL) "connections",
                        pg_postmaster_start_time() "started"`;
         break;
      }
      case 4:{
         /*
         Oracle Cloud syntax for v$pdbs.cloud_identity: 
         {
            "DATABASE_NAME" : "[DATABASE NAME]",
            "REGION" : "[REGION]",
            "TENANT_OCID" : "[TENANT_OCID]",
            "DATABASE_OCID" : "[DATABASE_OCID]",
            "COMPARTMENT_OCID" : "[iCOMPARTMENT_OCID]",
            "OUTBOUND_IP_ADDRESS" :
            [
               "[IP ADDRESS]"
            ],
            "PUBLIC_DOMAIN_NAME" : "[DOMAIN NAME]",
            "TENANT_ACCOUNT_NAME" : "[ACCOUNT NAME]",
            "AUTOSCALABLE_STORAGE" : [AUTOSCALABLE_STORAGE],
            "BASE_SIZE" : [SIZE],
            "INFRASTRUCTURE" : "[INFRASTRUCTURE]",
            "SERVICE" : "[SERVICE]",
            "APPLICATIONS" :
            [
               "ODI",
               "ORDS",
               "DATABASEACTIONS",
               "OMLMOD",
               "APEX",
               "OML"
            ],
            "AVAILABILITY_DOMAIN" : "[AVAILABILITY_DOMAIN]"
            }
         */
         sql = `SELECT :database "database_use",
                        (SELECT product
                           FROM product_component_version) "database_name", 
                        (SELECT version_full
                           FROM product_component_version) "version", 
                        (SELECT CASE 
                                 WHEN cloud_identity IS NULL THEN 
                                    :database_schema
                                 ELSE 
                                    :database_schema ||' ('|| REPLACE(JSON_QUERY(cloud_identity, '$.DATABASE_NAME'), CHR(34), NULL) || ')'
                                 END
                           FROM v$pdbs) "database_schema",
                        (SELECT  CASE 
                                 WHEN cloud_identity IS NULL THEN
                                    sys_context('USERENV','SERVER_HOST')
                                 ELSE
                                    REPLACE(JSON_QUERY(cloud_identity, '$.PUBLIC_DOMAIN_NAME'), CHR(34), NULL) ||
                                    ' ('|| REPLACE(JSON_QUERY(cloud_identity, '$.OUTBOUND_IP_ADDRESS[0]'), CHR(34), NULL) ||')'
                                 END
                           FROM v$pdbs) "hostname", 
                        (SELECT COUNT(*) 
                           FROM v$session) "connections",
                        v.startup_time "started"
                  FROM V$INSTANCE v`;
         break;
      }
      case 5:{
         sql = `SELECT :database "database_use",
                       'SQLite (' || file || ')' "database_name", 
                       sqlite_version() "version", 
                       :database_schema "database_schema",
                       '${ConfigGet('SERVER', 'HOST')}' "hostname", 
                       '-' "connections",
                       '-' "started"
                  FROM pragma_database_list
                 WHERE seq=0`;
         break;
      }
    }
    const parameters = {	
                   database: db_use,
                   database_schema: ConfigGet('SERVICE_DB', `DB${ConfigGet('SERVICE_DB', 'USE')}_NAME`)
                   };
    return await db_execute(app_id, sql, parameters, DBA, null, false);
 };
 /**
 * 
 * @param {number} app_id
 * @param {number} DBA
 * @returns {Promise.<import('../../../types.js').db_result_admin_DBInfoSpace[]>}
 */
const InfoSpace = async (app_id, DBA) => {
   /**@type{import('../../server.service.js')} */
   const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
   /**@type{import('../../config.service.js')} */
   const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
   /**@type{import('../../db/common.service.js')} */
   const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

   let sql = '';
   switch (getNumberValue(ConfigGet('SERVICE_DB', 'USE'))){
      case 1:
      case 2:{
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
      case 3:{
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
      case 4:{
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
      case 5:{
         sql = `SELECT  name "table_name",
                        printf("%.2f",SUM(pgsize)/1024/1024) "total_size",
                        printf("%.2f",SUM(pgsize-unused)/1024/1024) "data_used",
                        printf("%.2f",(SUM(pgsize) - SUM(pgsize-unused))/1024/1024) "data_free",
                        printf("%.2f",SUM(pgsize-unused)*100/SUM(pgsize)) "pct_used"
                  FROM  dbstat
                 WHERE  name NOT LIKE 'sqlite%'
                 GROUP BY name 
                 ORDER BY 2 DESC`
      break;
      }
    }
    const parameters = getNumberValue(ConfigGet('SERVICE_DB', 'USE'))==5?{}:{db_schema: ConfigGet('SERVICE_DB', `DB${ConfigGet('SERVICE_DB', 'USE')}_NAME`)};
    return await db_execute(app_id, sql, parameters, DBA, null, true);
 };
 /**
 * 
 * @param {number} app_id
 * @param {number} DBA
 * @returns {Promise.<import('../../../types.js').db_result_admin_DBInfoSpaceSum[]>}
 */
const InfoSpaceSum = async (app_id, DBA) => {
   /**@type{import('../../server.service.js')} */
   const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
   /**@type{import('../../config.service.js')} */
   const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
   /**@type{import('../../db/common.service.js')} */
   const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);
    
   let sql = '';
   switch (getNumberValue(ConfigGet('SERVICE_DB', 'USE'))){
      case 1:
      case 2:{
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
      case 3:{
         sql = `SELECT SUM(pg_table_size(t.schemaname || '.' || t.tablename)/1024/1024)::decimal "total_size",
                       SUM(pg_relation_size(t.schemaname || '.' || t.tablename)/1024/1024)::decimal "data_used",
                       SUM((pg_table_size(t.schemaname || '.' || t.tablename) - pg_relation_size(t.schemaname || '.' || t.tablename))/1024/1024)::decimal "data_free",
                       SUM(pg_relation_size(t.schemaname || '.' || t.tablename)) / SUM(CASE pg_table_size(t.schemaname || '.' || t.tablename) 
                                                                                       WHEN 0 THEN 1 
                                                                                       ELSE pg_table_size(t.schemaname || '.' || t.tablename)::decimal
                                                                                       END) *100 "pct_used"
                  FROM pg_tables t
                 WHERE t.tableowner = LOWER(:db_schema)`;
         break;
      }
      case 4:{
         sql = `SELECT SUM(ds.bytes)/1024/1024 "total_size",
                       SUM(dt.num_rows*dt.avg_row_len/1024/1024) "data_used",
                       (SUM(ds.bytes)/1024/1024) - SUM(dt.num_rows*dt.avg_row_len/1024/1024) "data_free",
                       SUM(dt.num_rows*dt.avg_row_len/1024/1024) / (SUM(ds.bytes)/1024/1024)*100 "pct_used"
                  FROM DBA_TABLES dt,
                       DBA_SEGMENTS ds
                 WHERE dt.owner = UPPER(:db_schema)
                   AND ds.segment_name = dt.table_name
                   AND ds.segment_type = 'TABLE'`;
         break;
      }
      case 5:{
         sql = `SELECT printf("%.2f",SUM(pgsize)/1024/1024) "total_size",
                       printf("%.2f",SUM(pgsize-unused)/1024/1024) "data_used",
                       printf("%.2f",(SUM(pgsize) - SUM(pgsize-unused))/1024/1024) "data_free",
                       printf("%.2f",SUM(pgsize-unused)*100/SUM(pgsize)) "pct_used"
                  FROM dbstat
                 WHERE name NOT LIKE 'sqlite%'`
         break;
      }
   }
   const parameters = getNumberValue(ConfigGet('SERVICE_DB', 'USE'))==5?{}:{db_schema: ConfigGet('SERVICE_DB', `DB${ConfigGet('SERVICE_DB', 'USE')}_NAME`)};
   return await db_execute(app_id, sql, parameters, DBA, null, false);
 };
 
 /**
  * A simple check of database is installed.
  * @param {number} app_id 
  * @param {number} DBA 
  * @returns 
  */
 const InstalledCheck = async (app_id, DBA) =>{
   /**@type{import('../../db/common.service.js')} */
   const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);
   const sql = `SELECT 1 "installed"
                  FROM <DB_SCHEMA/>.app
                  WHERE id = :app_id`;
   const parameters = {app_id: app_id};
   return await db_execute(app_id, sql, parameters, DBA, null, false);
 }; 
 export {Info, InfoSpace, InfoSpaceSum, InstalledCheck};