const {execute_db_sql} = require ("../common/database");
module.exports = {
	getDBInfo:(app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT	? database_use,
                            (SELECT variable_value
                               FROM performance_schema.global_variables
                              WHERE variable_name = 'version_comment') database_name,
							(SELECT variable_value
                               FROM performance_schema.global_variables
                              WHERE variable_name='version') version,
                            ? database_schema,
							(SELECT variable_value
                               FROM performance_schema.global_variables
                              WHERE variable_name='hostname') hostname,
							(SELECT variable_value
                               FROM performance_schema.global_status
                              WHERE variable_name='Threads_connected') connections,
							(SELECT DATE_SUB( NOW(),  INTERVAL variable_value SECOND)
                               FROM performance_schema.global_status
                              WHERE variable_name='Uptime') started
					FROM DUAL`;
			parameters = [	process.env.SERVICE_DB_USE,
                            process.env.SERVICE_DB_DB1_NAME];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT :database "database_use",
                          (SELECT product
                             FROM product_component_version) "database_name", 
                          (SELECT version_full
                             FROM product_component_version) "version", 
                          :database_schema "database_schema",
                          (SELECT cloud_identity
                             FROM v$pdbs) "hostname", 
                          (SELECT COUNT(*) 
                             FROM v$session) "connections",
                          v.startup_time "started"
                     FROM V$INSTANCE v`;
			parameters = {	database: process.env.SERVICE_DB_USE,
                            database_schema: process.env.SERVICE_DB_DB2_NAME};
		}
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else{
                if (process.env.SERVICE_DB_USE==2){
                    let hostname = JSON.parse(result[0].hostname.toLowerCase()).public_domain_name + 
                                   ' (' + JSON.parse(result[0].hostname.toLowerCase()).outbound_ip_address + ')';
                    result[0].database_schema += ' (' + JSON.parse(result[0].hostname.toLowerCase()).database_name + ')';
                    result[0].hostname = hostname;
                }
                return callBack(null, result[0]);
            }
				
		});
	},
    getDBInfoSpace:(app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT    t.table_name table_name,
                          IFNULL(ROUND((SUM(t.data_length)+SUM(t.index_length))/1024/1024,2),0.00) total_size,
                          IFNULL(ROUND(((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/1024/1024,2),0.00) data_used,
                          IFNULL(ROUND(SUM(data_free)/1024/1024,2),0.00) data_free,
                          IFNULL(ROUND((((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/((SUM(t.data_length)+SUM(t.index_length)))*100),2),0) pct_used
                     FROM INFORMATION_SCHEMA.SCHEMATA s, 
                          INFORMATION_SCHEMA.TABLES t
                    WHERE s.schema_name = t.table_schema
                      AND s.schema_name = ?
                    GROUP BY table_name
                    ORDER BY IFNULL(ROUND((SUM(t.data_length)+SUM(t.index_length))/1024/1024,2),0.00) DESC`;
			parameters = [process.env.SERVICE_DB_DB1_NAME];
		}
		else if (process.env.SERVICE_DB_USE==2){
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

			parameters = {db_schema: process.env.SERVICE_DB_DB2_NAME};
		}
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getDBInfoSpaceSum:(app_id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = `SELECT    IFNULL(ROUND((SUM(t.data_length)+SUM(t.index_length))/1024/1024,2),0.00) total_size,
                          IFNULL(ROUND(((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/1024/1024,2),0.00) data_used,
                          IFNULL(ROUND(SUM(data_free)/1024/1024,2),0.00) data_free,
                          IFNULL(ROUND((((SUM(t.data_length)+SUM(t.index_length))-SUM(t.data_free))/((SUM(t.data_length)+SUM(t.index_length)))*100),2),0) pct_used
                     FROM INFORMATION_SCHEMA.SCHEMATA s, 
                          INFORMATION_SCHEMA.TABLES t
                    WHERE s.schema_name = t.table_schema
                      AND s.schema_name = ?`;
			parameters = [process.env.SERVICE_DB_DB1_NAME];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT SUM(ds.bytes)/1024/1024 "total_size",
                       SUM(dt.num_rows*dt.avg_row_len/1024/1024) "data_used",
                       (SUM(ds.bytes)/1024/1024) - SUM(dt.num_rows*dt.avg_row_len/1024/1024) "data_free",
                       SUM(dt.num_rows*dt.avg_row_len/1024/1024) / (SUM(ds.bytes)/1024/1024)*100 "pct_used"
                  FROM DBA_TABLES dt,
                       DBA_SEGMENTS ds
                 WHERE dt.owner = UPPER(:db_schema)
                   AND ds.segment_name = dt.table_name
                   AND ds.segment_type = 'TABLE'`
			parameters = {db_schema: process.env.SERVICE_DB_DB2_NAME};
		}
		execute_db_sql(app_id, sql, parameters, true, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
	}
};