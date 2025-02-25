/**
 * All SQL statements for database model used by admin
 * @module server/db/dbSqlDatabase
 */

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('./Config.js')} */
const Config = await import(`file://${process.cwd()}/server/db/Config.js`);

/**
 * @name DATABASE_INFO_SELECT
 * @description Database info select
 * @function
 * @example Oracle Cloud syntax for v$pdbs.cloud_identity: 
 *    {
 *    "DATABASE_NAME" : "[DATABASE NAME]",
 *    "REGION" : "[REGION]",
 *    "TENANT_OCID" : "[TENANT_OCID]",
 *    "DATABASE_OCID" : "[DATABASE_OCID]",
 *    "COMPARTMENT_OCID" : "[iCOMPARTMENT_OCID]",
 *    "OUTBOUND_IP_ADDRESS" :
 *      [
 *          "[IP ADDRESS]"
 *      ],
 *    "PUBLIC_DOMAIN_NAME" : "[DOMAIN NAME]",
 *    "TENANT_ACCOUNT_NAME" : "[ACCOUNT NAME]",
 *    "AUTOSCALABLE_STORAGE" : [AUTOSCALABLE_STORAGE],
 *    "BASE_SIZE" : [SIZE],
 *    "INFRASTRUCTURE" : "[INFRASTRUCTURE]",
 *    "SERVICE" : "[SERVICE]",
 *    "APPLICATIONS" :
 *    [
 *      "ODI",
 *      "ORDS",
 *      "DATABASEACTIONS",
 *      "OMLMOD",
 *      "APEX",
 *      "OML"
 *    ],
 *    "AVAILABILITY_DOMAIN" : "[AVAILABILITY_DOMAIN]"
 *    }
 * @returns {string}
 */
const DATABASE_INFO_SELECT = () => {
    const db_use = serverUtilNumberValue(Config.get('ConfigServer','SERVICE_DB', 'USE'));
    switch (db_use){
        case 1:
        case 2:{
            const sql = 
            `SELECT :database database_use,
                    (SELECT variable_value
                    FROM information_schema.global_variables
                    WHERE variable_name = 'version_comment') database_name,
                    (SELECT variable_value
                    FROM information_schema.global_variables
                    WHERE variable_name='version') version,
                    :database_schema database_schema,
                    (SELECT variable_value
                    FROM information_schema.global_variables
                    WHERE variable_name='hostname') hostname,
                    (SELECT variable_value
                    FROM information_schema.global_status
                    WHERE variable_name='Threads_connected') connections,
                    (SELECT DATE_SUB( NOW(),  INTERVAL variable_value SECOND)
                    FROM information_schema.global_status
                    WHERE variable_name='Uptime') started
            FROM DUAL`;
            return db_use==1?sql:sql.replaceAll('information_schema','performance_schema');
        }
        case 3:{
            return `SELECT  :database "database_use",
                            version() "database_name",
                            current_setting('server_version') "version",
                            :database_schema "database_schema",
                            inet_server_addr() "hostname", 
                            (SELECT count(*) 
                            FROM pg_stat_activity 
                            WHERE datname IS NOT NULL) "connections",
                            pg_postmaster_start_time() "started"`;
        }
        case 4:{
            return `SELECT :database "database_use",
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
                           (SELECT CASE 
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
        }
        case 5:{
            return `SELECT :database "database_use",
                           'SQLite (' || file || ')' "database_name", 
                           sqlite_version() "version", 
                           :database_schema "database_schema",
                           '${Config.get('ConfigServer','SERVER', 'HOST')}' "hostname", 
                           '-' "connections",
                           '-' "started"
                      FROM pragma_database_list
                     WHERE seq=0`;
        }
        default:{
            return '';
        }
    }
};
/**
 * @name DATABASE_INFO_SELECT_SPACE
 * @description Database info select space
 * @function
 * @returns {string}
 */
const DATABASE_INFO_SELECT_SPACE = () => {
    const db_use = serverUtilNumberValue(Config.get('ConfigServer','SERVICE_DB', 'USE'));
    switch (db_use){
        case 1:
        case 2:{
            return `SELECT t.table_name table_name,
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
        }
        case 3:{
            return `SELECT t.tablename "table_name",
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
        }
        case 4:{
            return `SELECT dt.table_name "table_name",
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
        }
        case 5:{
            return `SELECT name "table_name",
                           printf("%.2f",SUM(pgsize)/1024/1024) "total_size",
                           printf("%.2f",SUM(pgsize-unused)/1024/1024) "data_used",
                           printf("%.2f",(SUM(pgsize) - SUM(pgsize-unused))/1024/1024) "data_free",
                           printf("%.2f",SUM(pgsize-unused)*100/SUM(pgsize)) "pct_used"
                      FROM dbstat
                     WHERE name NOT LIKE 'sqlite%'
                     GROUP BY name 
                     ORDER BY 2 DESC`;
        }
        default:{
            return '';
        }
    }
};
/**
 * @name DATABASE_INFO_SELECT_SPACE_SUM
 * @description Database info select space sum
 * @function
 * @returns {string}
 */
const DATABASE_INFO_SELECT_SPACE_SUM = () => {
    const db_use = serverUtilNumberValue(Config.get('ConfigServer','SERVICE_DB', 'USE'));
    switch (db_use){
        case 1:
        case 2:{
            return `SELECT IFNULL(ROUND((SUM(t.data_length)+SUM(t.index_length))/1024/1024,2),0.00) total_size,
                           IFNULL(ROUND(((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/1024/1024,2),0.00) data_used,
                           IFNULL(ROUND(SUM(data_free)/1024/1024,2),0.00) data_free,
                           IFNULL(ROUND((((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/((SUM(t.data_length)+SUM(t.index_length)))*100),2),0) pct_used
                      FROM INFORMATION_SCHEMA.SCHEMATA s, 
                           INFORMATION_SCHEMA.TABLES t
                     WHERE s.schema_name = t.table_schema
                       AND s.schema_name = :db_schema`;
        }
        case 3:{
            return `SELECT SUM(pg_table_size(t.schemaname || '.' || t.tablename)/1024/1024)::decimal "total_size",
                           SUM(pg_relation_size(t.schemaname || '.' || t.tablename)/1024/1024)::decimal "data_used",
                           SUM((pg_table_size(t.schemaname || '.' || t.tablename) - pg_relation_size(t.schemaname || '.' || t.tablename))/1024/1024)::decimal "data_free",
                           SUM(pg_relation_size(t.schemaname || '.' || t.tablename)) / SUM(CASE pg_table_size(t.schemaname || '.' || t.tablename) 
                                                                                           WHEN 0 THEN 1 
                                                                                           ELSE pg_table_size(t.schemaname || '.' || t.tablename)::decimal
                                                                                           END) *100 "pct_used"
                      FROM pg_tables t
                     WHERE t.tableowner = LOWER(:db_schema)`;
        }
        case 4:{
            return `SELECT SUM(ds.bytes)/1024/1024 "total_size",
                           SUM(dt.num_rows*dt.avg_row_len/1024/1024) "data_used",
                           (SUM(ds.bytes)/1024/1024) - SUM(dt.num_rows*dt.avg_row_len/1024/1024) "data_free",
                           SUM(dt.num_rows*dt.avg_row_len/1024/1024) / (SUM(ds.bytes)/1024/1024)*100 "pct_used"
                      FROM DBA_TABLES dt,
                           DBA_SEGMENTS ds
                     WHERE dt.owner = UPPER(:db_schema)
                       AND ds.segment_name = dt.table_name
                       AND ds.segment_type = 'TABLE'`;
        }
        case 5:{
            return `SELECT printf("%.2f",SUM(pgsize)/1024/1024) "total_size",
                           printf("%.2f",SUM(pgsize-unused)/1024/1024) "data_used",
                           printf("%.2f",(SUM(pgsize) - SUM(pgsize-unused))/1024/1024) "data_free",
                           printf("%.2f",SUM(pgsize-unused)*100/SUM(pgsize)) "pct_used"
                      FROM dbstat
                     WHERE name NOT LIKE 'sqlite%'`;
        }
        default:{
            return '';
        }
    }
};
/**
 * @name DATABASE_SELECT_INSTALLED_CHECK
 * @description Database select installed check
 * @constant
 */
const DATABASE_SELECT_INSTALLED_CHECK = 
        `SELECT 1 "installed"
           FROM <DB_SCHEMA/>.app
          WHERE id = :app_id`;

export {/**DATABASE_INFO */
        DATABASE_INFO_SELECT, 
        DATABASE_INFO_SELECT_SPACE,
        DATABASE_INFO_SELECT_SPACE_SUM,
        DATABASE_SELECT_INSTALLED_CHECK
        };