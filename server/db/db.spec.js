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
                                dba:            1,
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
                db.dbPoolGet(app_id, db_use, DBA)
                    /**@ts-ignore */
                    ?.getConnection((/**@type{server_server_error}*/err, /**@type{server_db_db_pool_connection_1_2}*/conn) => {
                        resolve(conn);
                });
            });
        };
        /**
         * @param {string} sql
         * @param {{[key:string]:any}} parameters
         */
        const adjustSqlParams = (sql, parameters) =>{
            sql = sql.replaceAll('<DB_SCHEMA/>', db_name);
            return {sql:sql, parameters:parameters};
                                
        };
        //set parameters
        //test as non DBA, app_id 0, current database
        const DBA = 1;
        const app_id = 0; //also pool_id
        const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')) ?? 0;
        //Use default 5 if none is configured
        const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB','USE')) ?? 5;
        const db_name = fileModelConfig.get('CONFIG_SERVER','SERVICE_DB',`DB${db_use}_NAME`);
        const connection = (db_use==1 ||db_use==2)?await pool_1_2(app_id, db_use):null;
        
        //Test sql and parameters SELECT that contains <DB_SCHEMA/> tags
        const {sql:sql_select, parameters:sql_select_params} = adjustSqlParams(dbSql.APP_SETTING_SELECT, {  app_id : app_id,
                                                                                                            common_app_id: common_app_id,
                                                                                                            app_setting_type_name: 'PAPER_SIZE'
                                                                                                            });
                                                                                                            
        const result_select = db.dbSQLParamConvert(db_use, connection, sql_select, sql_select_params);
        
        //Test sql and parameters INSERT that uses DB_RETURN_ID and DB_CLOB 
        const {sql:sql_insert, parameters:sql_insert_params} = adjustSqlParams(dbSql.USER_ACCOUNT_INSERT, {
                                                                                                            bio: null,
                                                                                                            private: null,
                                                                                                            user_level: null,
                                                                                                            username: null,
                                                                                                            password_new: null,
                                                                                                            password_reminder: null,
                                                                                                            email: null,
                                                                                                            avatar: null,
                                                                                                            verification_code: null,
                                                                                                            active: null,
                                                                                                            identity_provider_id: null,
                                                                                                            provider_id: null,
                                                                                                            provider_first_name: null,
                                                                                                            provider_last_name: null,
                                                                                                            provider_image: null,
                                                                                                            provider_image_url: null,
                                                                                                            provider_email: null,
                                                                                                            DB_RETURN_ID:'id',
                                                                                                            DB_CLOB: ['avatar', 'provider_image']
                                                                                                        });
        const result_insert = db.dbSQLParamConvert(db_use, connection, sql_insert, sql_insert_params);

        //Test sql and parameters DELETE that uses DB_RETURN_ID
        const {sql:sql_delete, parameters:sql_delete_params} = adjustSqlParams(dbSql.USER_ACCOUNT_DELETE, { id: 1, DB_RETURN_ID:'id'});
        const result_delete = db.dbSQLParamConvert(db_use, connection, sql_delete, sql_delete_params);

        //Test sql and parameters UPDATE that uses DB_RETURN_ID
        const {sql:sql_update, parameters:sql_update_params} = adjustSqlParams(dbSql.USER_ACCOUNT_UPDATE, { id: null,
                                                                                                            active: null,
                                                                                                            user_level: null,
                                                                                                            private: null,
                                                                                                            username: null,
                                                                                                            bio: null,
                                                                                                            email: null,
                                                                                                            email_unverified: null,
                                                                                                            password_new: null,
                                                                                                            password_reminder: null,
                                                                                                            verification_code: null,
                                                                                                            DB_RETURN_ID:'id'});
        const result_update = db.dbSQLParamConvert(db_use, connection, sql_update, sql_update_params);
        
        console.log('Unit test dbSQLParamConvert parameter DBA:', DBA);
        console.log('Unit test dbSQLParamConvert parameter app_id/pool_id:', app_id);
        console.log('Unit test dbSQLParamConvert parameter DB_USE:', db_use);
        console.log('Unit test dbSQLParamConvert parameter db name:', db_name);

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
            //expect NULL to occur 17 times in INSERT sql
            expect(result_insert.sql.match(/NULL/g).length).toBe(17);
            //expect correct parameters in INSERT and with correct value
            expect(result_insert.parameters?.['bio']).toBe(null);
            expect(result_insert.parameters?.['private']).toBe(null);
            expect(result_insert.parameters?.['user_level']).toBe(null);
            expect(result_insert.parameters?.['username']).toBe(null);
            expect(result_insert.parameters?.['password_new']).toBe(null);
            expect(result_insert.parameters?.['password_reminder']).toBe(null);
            expect(result_insert.parameters?.['email']).toBe(null);
            expect(result_insert.parameters?.['avatar']).toBe(null);
            expect(result_insert.parameters?.['verification_code']).toBe(null);
            expect(result_insert.parameters?.['active']).toBe(null);
            expect(result_insert.parameters?.['identity_provider_id']).toBe(null);
            expect(result_insert.parameters?.['provider_id']).toBe(null);
            expect(result_insert.parameters?.['provider_first_name']).toBe(null);
            expect(result_insert.parameters?.['provider_last_name']).toBe(null);
            expect(result_insert.parameters?.['provider_image']).toBe(null);
            expect(result_insert.parameters?.['provider_image_url']).toBe(null);
            expect(result_insert.parameters?.['provider_email']).toBe(null);

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
            expect(result_update.parameters?.active).toBe(null);
            expect(result_update.parameters?.user_level).toBe(null);
            expect(result_update.parameters?.private).toBe(null);
            expect(result_update.parameters?.username).toBe(null);
            expect(result_update.parameters?.bio).toBe(null);
            expect(result_update.parameters?.email).toBe(null);
            expect(result_update.parameters?.email_unverified).toBe(null);
            expect(result_update.parameters?.password_new).toBe(null);
            expect(result_update.parameters?.password_reminder).toBe(null);
            expect(result_update.parameters?.verification_code).toBe(null);
        }
        if (db_use==3){
            //expect return statement IN INSERT
            expect(result_insert.sql.indexOf('RETURNING id')).toBeGreaterThan(-1);
            //expect correct parameters in INSERT
            //expect '$1,', '$2,' ... '$17)' to each exist once in INSERT sql
            expect(result_insert.sql.match(/\$1,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$2,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$3,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$4,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$5,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$6,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$7,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$8,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$9,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$10,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$11,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$12,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$13,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$14,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$15,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$16,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$17\)/g).length).toBe(1);
            //expect 17 array indexes to contain null value
            expect(result_insert.parameters.length).toBe(17);
            expect(result_insert.parameters.filter((/**@type{*}*/param)=>param==null).length).toBe(17);

            //expect correct parameter in DELETE
            //expect '$1' to exist once in DELETE sql
            expect(result_delete.sql.match(/\$1/g).length).toBe(1);
            //expect one array index to contain value 1
            expect(result_delete.parameters.length).toBe(1);
            expect(result_delete.parameters.filter((/**@type{*}*/param)=>param==1).length).toBe(1);

            //expect correct parameters in UPDATE
            //expect '$1 ', '$2,' - '$8,' to each exist once in UPDATE sql
            //expect '$9 ' to exist 2 times in UPDATE sql
            //expect '$10,' to exist 1 time in UPDATE sql
            //expect '$11' to exist 1 time in UPDATE sql
            expect(result_update.sql.match(/\$1 /g).length).toBe(1);
            expect(result_update.sql.match(/\$2,/g).length).toBe(1);
            expect(result_update.sql.match(/\$3,/g).length).toBe(1);
            expect(result_update.sql.match(/\$4,/g).length).toBe(1);
            expect(result_update.sql.match(/\$5,/g).length).toBe(1);
            expect(result_update.sql.match(/\$6,/g).length).toBe(1);
            expect(result_update.sql.match(/\$7,/g).length).toBe(1);
            expect(result_update.sql.match(/\$8,/g).length).toBe(1);
            expect(result_update.sql.match(/\$9 /g).length).toBe(2);
            expect(result_update.sql.match(/\$10,/g).length).toBe(1);
            expect(result_update.sql.match(/\$11/g).length).toBe(1);
            //expect one array index to contain value 1
            expect(result_update.parameters.length).toBe(11);
            expect(result_update.parameters.filter((/**@type{*}*/param)=>param==null).length).toBe(11);
        }
        //expect different result in each database
        if (db_use==4){
            //expect return statement IN INSERT
            expect(result_insert.sql.indexOf('RETURNING id INTO :insertId')).toBeGreaterThan(-1);
            expect(result_insert.parameters?.insertId.type).not.toBeUndefined();
            expect(result_insert.parameters?.insertId.dir).not.toBeUndefined();

            //expect CLOB attributes in INSERT
            expect(result_insert.parameters?.avatar?.dir).not.toBeUndefined();
            expect(result_insert.parameters?.avatar?.val).not.toBeUndefined();
            expect(result_insert.parameters?.avatar?.type).not.toBeUndefined();
            expect(result_insert.parameters?.provider_image?.dir).not.toBeUndefined();
            expect(result_insert.parameters?.provider_image?.val).not.toBeUndefined();
            expect(result_insert.parameters?.provider_image?.type).not.toBeUndefined();

            //expect return statement IN DELETE
            expect(result_delete.sql.indexOf('RETURNING id INTO :insertId')).toBeGreaterThan(-1);
            expect(result_delete.parameters?.insertId.type).not.toBeUndefined();
            expect(result_delete.parameters?.insertId.dir).not.toBeUndefined();

            //expect return statement IN UPDATE
            expect(result_update.sql.indexOf('RETURNING id INTO :insertId')).toBeGreaterThan(-1);
            expect(result_update.parameters?.insertId.type).not.toBeUndefined();
            expect(result_update.parameters?.insertId.dir).not.toBeUndefined();
        }        
        if (db_use==5){
            //expect $username to occur 1 time in sql INSERT
            expect(result_insert.sql.match(/\$bio/g).length).toBe(1);
            expect(result_insert.sql.match(/\$private/g).length).toBe(1);
            expect(result_insert.sql.match(/\$user_level/g).length).toBe(1);
            expect(result_insert.sql.match(/\$username/g).length).toBe(1);
            expect(result_insert.sql.match(/\$password_new/g).length).toBe(1);
            expect(result_insert.sql.match(/\$password_reminder/g).length).toBe(1);
            expect(result_insert.sql.match(/\$email,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$avatar/g).length).toBe(1);
            expect(result_insert.sql.match(/\$verification_code/g).length).toBe(1);
            expect(result_insert.sql.match(/\$active/g).length).toBe(1);
            expect(result_insert.sql.match(/\$identity_provider_id/g).length).toBe(1);
            expect(result_insert.sql.match(/\$provider_id,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$provider_first_name/g).length).toBe(1);
            expect(result_insert.sql.match(/\$provider_last_name/g).length).toBe(1);
            expect(result_insert.sql.match(/\$provider_image,/g).length).toBe(1);
            expect(result_insert.sql.match(/\$provider_image_url/g).length).toBe(1);
            expect(result_insert.sql.match(/\$provider_email/g).length).toBe(1);
            //expect correct parameters in INSERT and with correct value
            expect(result_insert.parameters?.['$bio']).toBe(null);
            expect(result_insert.parameters?.['$private']).toBe(null);
            expect(result_insert.parameters?.['$user_level']).toBe(null);
            expect(result_insert.parameters?.['$username']).toBe(null);
            expect(result_insert.parameters?.['$password_new']).toBe(null);
            expect(result_insert.parameters?.['$password_reminder']).toBe(null);
            expect(result_insert.parameters?.['$email']).toBe(null);
            expect(result_insert.parameters?.['$avatar']).toBe(null);
            expect(result_insert.parameters?.['$verification_code']).toBe(null);
            expect(result_insert.parameters?.['$active']).toBe(null);
            expect(result_insert.parameters?.['$identity_provider_id']).toBe(null);
            expect(result_insert.parameters?.['$provider_id']).toBe(null);
            expect(result_insert.parameters?.['$provider_first_name']).toBe(null);
            expect(result_insert.parameters?.['$provider_last_name']).toBe(null);
            expect(result_insert.parameters?.['$provider_image']).toBe(null);
            expect(result_insert.parameters?.['$provider_image_url']).toBe(null);
            expect(result_insert.parameters?.['$provider_email']).toBe(null);

            //expect $id to occur 1 time in sql DELETE
            expect(result_delete.sql.match(/\$id/g).length).toBe(1);
            //expect correct parameters in DELETE and with correct value
            expect(result_delete.parameters?.['$id']).toBe(1);

            //expect $id to occur 1 time in sql UPDATE
            expect(result_update.sql.match(/\$id/g).length).toBe(1);
            expect(result_update.sql.match(/\$active/g).length).toBe(1);
            expect(result_update.sql.match(/\$user_level/g).length).toBe(1);
            expect(result_update.sql.match(/\$private/g).length).toBe(1);
            expect(result_update.sql.match(/\$username/g).length).toBe(1);
            expect(result_update.sql.match(/\$bio/g).length).toBe(1);
            expect(result_update.sql.match(/\$email,/g).length).toBe(1);
            expect(result_update.sql.match(/\$email_unverified,/g).length).toBe(1);
            expect(result_update.sql.match(/\$password_new/g).length).toBe(2);
            expect(result_update.sql.match(/\$password_reminder/g).length).toBe(1);
            expect(result_update.sql.match(/\$verification_code/g).length).toBe(1);

            //expect UPDATE parameter key names be set and with value null for all
            expect(result_update.parameters?.['$id']).toBe(null);
            expect(result_update.parameters?.['$active']).toBe(null);
            expect(result_update.parameters?.['$user_level']).toBe(null);
            expect(result_update.parameters?.['$private']).toBe(null);
            expect(result_update.parameters?.['$username']).toBe(null);
            expect(result_update.parameters?.['$bio']).toBe(null);
            expect(result_update.parameters?.['$email']).toBe(null);
            expect(result_update.parameters?.['$email_unverified']).toBe(null);
            expect(result_update.parameters?.['$password_new']).toBe(null);
            expect(result_update.parameters?.['$password_reminder']).toBe(null);
            expect(result_update.parameters?.['$verification_code']).toBe(null);
        }
    });
});
