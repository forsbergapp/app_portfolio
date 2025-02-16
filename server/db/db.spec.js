/**
 * @module server/db/db.spec
 */
/**
 * @name describe
 * @description describe: Unit test, dbSQLParamConvert
 *              it: should return converted sql and parameters in correct format for the database used for SELECT, INSERT, DELETE and UPDATE sql
 * @function
 * @returns {void}
 */
describe('Unit test, dbSQLParamConvert', ()=> {
    it('should return converted sql and parameters in correct format for the database used for SELECT, INSERT, DELETE and UPDATE sql', async () =>{
        /**@type{import('./fileModelConfig.js')} */
        const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
        /**@type{import('./db.js')} */
        const db = await import(`file://${process.cwd()}/server/db/db.js`);

        /**@type{import('./dbSql.js')} */
        const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);
        /**@type{import('../server.js')} */
        const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

        //function for mySQL and MariaDB connection
        /**
         * @param {number} app_id
         * @param {number} db_use
         */
        const pool_1_2 = async (app_id, db_use) =>{
            /**@type{server_db_db_pool_parameters} */
            const parameters = {use:            db_use, 
                                pool_id:        app_id, 
                                port:           serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'DB1_PORT')),
                                host:           fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'DB1_HOST'),
                                dba:            true,
                                user:           fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'DB1_DBA_USER'),
                                password:       fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'DB1_DBA_PASS'),
                                                //test with empty database if not installed
                                database:       fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_NAME`),
                                charset:        fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CHARACTERSET`),
                                connectionLimit:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_CONNECTION_LIMIT`)),
                                connectionTimeoutMillis:   null,
                                idleTimeoutMillis:         null,
                                max:                       null,
                                connectString:             null,
                                poolMin:                   null,
                                poolMax:                   null,
                                poolIncrement:             null
                            };
            await db.dbPoolStart(parameters);
            return new Promise(resolve=>{
                db.dbPoolGet(app_id, db_use, true)
                    /**@ts-ignore */
                    ?.getConnection((/**@type{server_server_error}*/err, /**@type{server_db_db_pool_connection_1_2}*/conn) => {
                        resolve(conn);
                });
            });
        };
        /**
         * @description Extract logic from dbCommonExecute since SQL should not be executed
         * @param {string} sql
         * @param {{[key:string]:any}} parameters
         */
        const adjustSqlParams = (sql, parameters) =>{
            const DB_USE = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
            sql = sql.replaceAll('<DB_SCHEMA/>', fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${DB_USE}_NAME`) ?? '');
            return {sql:sql, parameters:parameters};
                                
        };
        //set parameters
        //test as non DBA, app_id 0, current database
        const app_id = 0; //also pool_id
        const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) ?? 0;
        //Use default 5 if none is configured
        /**@type{*} */
        const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE'));
        const connection = (db_use==1 ||db_use==2)?await pool_1_2(app_id, db_use):null;
        
        //Test sql and parameters SELECT that contains <DB_SCHEMA/> tags
        const {sql:sql_select, parameters:sql_select_params} = adjustSqlParams(dbSql.APP_DATA_RESOURCE_DETAIL_DATA_SELECT, {app_id : app_id,
                                                                                                                            common_app_id: common_app_id,
                                                                                                                            resource_id: 1,
                                                                                                                            user_account_id:1,
                                                                                                                            user_account_app_id:1,
                                                                                                                            user_null:1,
                                                                                                                            data_app_id:1,
                                                                                                                            entity_id:1,
                                                                                                                            resource_app_data_detail_id:1
                                                                                                                            });

        const result_select = db.dbSQLParamConvert(db_use, connection, sql_select, sql_select_params);

        //Test sql and parameters INSERT that uses DB_RETURN_ID and DB_CLOB 
        const {sql:sql_insert, parameters:sql_insert_params} = adjustSqlParams(dbSql.USER_ACCOUNT_APP_DATA_POST_INSERT, {
                                                                                                            description: null,
                                                                                                            json_data: null,
                                                                                                            user_account_id: null,
                                                                                                            app_id: null,
                                                                                                            DB_RETURN_ID:'id',
                                                                                                            DB_CLOB: ['json_data']
                                                                                                        });
        const result_insert = db.dbSQLParamConvert(db_use, connection, sql_insert, sql_insert_params);

        //Test sql and parameters DELETE that uses DB_RETURN_ID
        const {sql:sql_delete, parameters:sql_delete_params} = adjustSqlParams(dbSql.USER_ACCOUNT_DELETE, { id: 1, DB_RETURN_ID:'id'});
        const result_delete = db.dbSQLParamConvert(db_use, connection, sql_delete, sql_delete_params);

        //Test sql and parameters UPDATE 
        const {sql:sql_update, parameters:sql_update_params} = adjustSqlParams(dbSql.USER_ACCOUNT_UPDATE, { iam_user_id: null,
                                                                                                            id: null});
        const result_update = db.dbSQLParamConvert(db_use, connection, sql_update, sql_update_params);
        
        console.log('Unit test dbSQLParamConvert parameter app_id/pool_id:', app_id);
        console.log('Unit test dbSQLParamConvert parameter DB_USE:', db_use);
        console.log('Unit test dbSQLParamConvert parameter db name:', fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${db_use}_NAME`) ?? '');

        console.log('Unit test dbSQLParamConvert parameter SELECT sql:', sql_select);
        console.log('Unit test dbSQLParamConvert parameter SELECT parameters:', sql_select_params);
        console.log('Unit test dbSQLParamConvert parameter SELECT result:', result_select);
        
        console.log('Unit test dbSQLParamConvert parameter INSERT sql:', sql_insert);
        console.log('Unit test dbSQLParamConvert parameter INSERT parameters:', sql_insert_params);
        console.log('Unit test dbSQLParamConvert parameter INSERT result:', result_insert);

        console.log('Unit test dbSQLParamConvert parameter DELETE sql:', sql_delete);
        console.log('Unit test dbSQLParamConvert parameter DELETE parameters:', sql_delete_params);
        console.log('Unit test dbSQLParamConvert parameter DELETE result:', result_delete);

        console.log('Unit test dbSQLParamConvert parameter UPDATE sql:', sql_update);
        console.log('Unit test dbSQLParamConvert parameter UPDATE parameters:', sql_update_params);
        console.log('Unit test dbSQLParamConvert parameter UPDATE result:', result_update);

        //expect common result
        //expect <DB_SCHEMA/> not to be found, should be replaced by schema name
        expect(result_select.sql.indexOf('<DB_SCHEMA/>')).toBe(-1);
        //expect deleted key DB_RETURN_ID
        expect(result_insert.parameters?.DB_RETURN_ID).toBeUndefined();
        //expect deleted key DB_CLOB
        expect(result_insert.parameters?.DB_CLOB).toBeUndefined();
        //expect deleted key DB_RETURN_ID
        expect(result_delete.parameters?.DB_RETURN_ID).toBeUndefined();
        //expect deleted key DB_RETURN_ID
        expect(result_update.parameters?.DB_RETURN_ID).toBeUndefined();
        //expect deleted key DB_CLOB
        expect(result_update.parameters?.DB_CLOB).toBeUndefined();
        if (db_use==1||db_use==2){
            //expect correct parameters in INSERT
            //expect NULL to occur 4 times in INSERT sql
            expect(result_insert.sql.match(/NULL/g).length).toBe(4);
            //expect correct parameters in INSERT and with correct value
            expect(result_insert.parameters?.['description']).toBe(null);
            expect(result_insert.parameters?.['json_data']).toBe(null);
            expect(result_insert.parameters?.['user_account_id']).toBe(null);
            expect(result_insert.parameters?.['app_id']).toBe(null);

            //expect correct parameter in DELETE
            //expect 'id = 1' to exist once in DELETE sql
            expect(result_delete.sql.match(/id = 1/g).length).toBe(1);
            //expect key id to contain value 1
            expect(result_delete.parameters?.id).toBe(1);

            //expect correct parameters in UPDATE
            //expect NULL to occur 13 times in UPDATE sql
            expect(result_update.sql.match(/NULL/g).length).toBe(13);

            //expect UPDATE parameter key names be set and with value null for all
            expect(result_update.parameters?.id).toBe(null);
            expect(result_update.parameters?.iam_user_id).toBe(null);
        }
        if (db_use==3){
            //expect return statement IN INSERT
            expect(result_insert.sql.indexOf('RETURNING id')).toBeGreaterThan(-1);
            //expect correct parameters in INSERT
            //expect '$1, $2, $3, $4)' to each exist once in INSERT sql
            expect(result_insert.sql.match(/\$1,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$2,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$3,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$4,/g).length).toBe(1);
            
            //expect 4 array indexes to contain null value
            expect(result_insert.parameters.length).toBe(4);
            expect(result_insert.parameters.filter((/**@type{*}*/param)=>param==null).length).toBe(4);

            //expect correct parameter in DELETE
            //expect '$1' to exist once in DELETE sql
            expect(result_delete.sql.match(/\$1/g).length).toBe(1);
            //expect one array index to contain value 1
            expect(result_delete.parameters.length).toBe(1);
            expect(result_delete.parameters.filter((/**@type{*}*/param)=>param==1).length).toBe(1);

            //expect correct parameters in UPDATE
            //expect '$1, $2' to each exist once in UPDATE sql
            expect(result_update.sql.match(/\$1 /g).length).toBe(1);
            expect(result_update.sql.match(/\$2,/g).length).toBe(1);
            //expect one array index to contain value 1
            expect(result_update.parameters.length).toBe(2);
            expect(result_update.parameters.filter((/**@type{*}*/param)=>param==null).length).toBe(11);
        }
        //expect different result in each database
        if (db_use==4){
            //expect return statement IN INSERT
            expect(result_insert.sql.indexOf('RETURNING id INTO :insertId')).toBeGreaterThan(-1);
            expect(result_insert.parameters?.insertId.type).not.toBeUndefined();
            expect(result_insert.parameters?.insertId.dir).not.toBeUndefined();

            //expect CLOB attributes in INSERT
            expect(result_insert.parameters?.json_data?.dir).not.toBeUndefined();
            expect(result_insert.parameters?.json_data?.val).not.toBeUndefined();
            expect(result_insert.parameters?.json_data?.type).not.toBeUndefined();

            //expect return statement IN DELETE
            expect(result_delete.sql.indexOf('RETURNING id INTO :insertId')).toBeGreaterThan(-1);
            expect(result_delete.parameters?.insertId.type).not.toBeUndefined();
            expect(result_delete.parameters?.insertId.dir).not.toBeUndefined();

        }        
        if (db_use==5){
            //expect $username to occur 1 time in sql INSERT
            expect(result_insert.sql.match(/\$description/g).length).toBe(1);
            expect(result_insert.sql.match(/\$json_data/g).length).toBe(1);
            expect(result_insert.sql.match(/\$user_account_id/g).length).toBe(1);
            expect(result_insert.sql.match(/\$app_id/g).length).toBe(1);
            //expect correct parameters in INSERT and with correct value
            expect(result_insert.parameters?.['$description']).toBe(null);
            expect(result_insert.parameters?.['$json_data']).toBe(null);
            expect(result_insert.parameters?.['$user_account_id']).toBe(null);
            expect(result_insert.parameters?.['$app_id']).toBe(null);

            //expect $id to occur 1 time in sql DELETE
            expect(result_delete.sql.match(/\$id/g).length).toBe(1);
            //expect correct parameters in DELETE and with correct value
            expect(result_delete.parameters?.['$id']).toBe(1);

            //expect $id to occur 1 time in sql UPDATE
            expect(result_update.sql.match(/\$id/g).length).toBe(1);
            expect(result_update.sql.match(/\$iam_user_id/g).length).toBe(1);

            //expect UPDATE parameter key names be set and with value null for all
            expect(result_update.parameters?.['$id']).toBe(null);
            expect(result_update.parameters?.['$iam_user_id']).toBe(null);
        }
    });
});
