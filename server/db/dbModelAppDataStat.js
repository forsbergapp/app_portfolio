/** @module server/db/dbModelAppDataStat */

/**
 * @import {server_server_response,
 *          server_db_common_result_insert, server_db_sql_result_app_data_stat_getStatUniqueVisitor, 
 *          server_db_sql_result_app_data_stat_logGet, server_db_sql_result_app_data_stat_get} from '../types.js'
 */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name get
 * @description Get stat
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  id?:number|null,
 *                  data_app_id?:number|null,
 *                  resource_name_entity?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_data_stat_get[] }>}
 */
const get = async parameters =>{
    /**@type{import('./fileModelAppSetting.js')} */
    const fileModelAppSetting = await import(`file://${process.cwd()}/server/db/fileModelAppSetting.js`);
    return import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_DATA_STAT_SELECT, 
                        {   resource_id         : serverUtilNumberValue(parameters.data.id),
							data_app_id         : serverUtilNumberValue(parameters.data.data_app_id)},
                        null)
                        .then(result=>result.http?result:
                            {result:result.result
                                    .map((/**@type{server_db_sql_result_app_data_stat_get}*/row)=>{
                                        const app_setting = fileModelAppSetting.get({   app_id:parameters.app_id, 
                                                                                        resource_id:row.app_setting_id,
                                                                                        data:{data_app_id:row.app_data_entity_resource_app_data_entity_app_id}}).result[0];
                                        row.app_setting_name = app_setting?.name;
                                        row.app_setting_value = app_setting?.value;
                                        row.app_setting_display_data = app_setting?.display_data;
                                        return row;
                                    })    
                                    .filter((/**@type{server_db_sql_result_app_data_stat_get}*/row)=>
                                        row.app_setting_value == (parameters.data?.resource_name_entity ?? row.app_setting_value)
                                    ),
                            type:'JSON'}));
};
/**
 * @name getLog
 * @description Get stat log
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  sort?:string|null,
 *                  order_by?:string|null,
 *                  select_app_id?:string|null,
 *                  year?:string|null,
 *                  month?:string|null,
 *                  day?:string|null,
 *                  offset?:string|null,
 *                  limit?:string|null,
 *                  app_data_entity_resource_id?:number|null,
 *                  app_data_entity_resource_app_data_entity_app_id?:number|null,
 *                  app_data_entity_resource_app_data_entity_id?:number|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_data_stat_logGet[] }>}
 */
const getLog = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_DATA_STAT_SELECT_LOG
                                .replace('<SORT/>', parameters.data.sort=='date_created'?'date_created':'app_id')
                                .replace('<ORDER_BY/>',parameters.data.order_by??''), 
                        {   app_id:serverUtilNumberValue(parameters.data.select_app_id),
                            year:serverUtilNumberValue(parameters.data.year),
                            month:serverUtilNumberValue(parameters.data.month),
                            day:serverUtilNumberValue(parameters.data.day),
                            offset:serverUtilNumberValue(parameters.data.offset),
                            limit:serverUtilNumberValue(parameters.data.limit),
                            app_data_entity_resource_id: serverUtilNumberValue(parameters.data.app_data_entity_resource_id),
                            app_data_entity_resource_app_data_entity_app_id: serverUtilNumberValue(parameters.data.app_data_entity_resource_app_data_entity_app_id),
                            app_data_entity_resource_app_data_entity_id :  serverUtilNumberValue(parameters.data.app_data_entity_resource_app_data_entity_id)},
                        null))
        .then(result =>{
                if (result.result)
                    if (parameters.data.sort!='date_created' && parameters.data.sort!='app_id'){
                        //sort json_data columns
                        result.result.rows = result.result.rows.sort((
                                /**@ts-ignore */
                                first, second)=>{
                            //sort column inside json string
                            /**@ts-ignore */
                            const first_sort = JSON.parse(first.json_data)[parameters.data.sort]?.toLowerCase();
                            /**@ts-ignore */
                            const second_sort = JSON.parse(second.json_data)[parameters.data.sort]?.toLowerCase();
                            //using localeCompare as collation method for strings
                            if (first_sort !=null && second_sort != null && 
                                ((  typeof first_sort == 'number' && first_sort < second_sort) || 
                                (  typeof first_sort == 'string' && first_sort.localeCompare(second_sort)<0) ))
                                return parameters.data.order_by?.toLowerCase()=='asc'?-1:1;
                            else if (first_sort !=null && second_sort != null && 
                                ((  typeof first_sort == 'number' && first_sort > second_sort) || 
                                (  typeof first_sort == 'string' && first_sort.localeCompare(second_sort)>0) ))
                                return parameters.data.order_by?.toLowerCase()=='asc'?1:-1;
                            else
                                return 0;
                        });
                    }
                return result;
        });
/**
 * @name getStatUniqueVisitor
 * @description Get stat unique visitors
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  select_app_id?:string|null,
 *                  year?:string|null,
 *                  month?:string|null}}} parameters
 * @returns {Promise.<server_server_response & {result?:server_db_sql_result_app_data_stat_getStatUniqueVisitor[] }>}
 */
const getStatUniqueVisitor = parameters =>{
    /**
     * Convert to array with object
     * @param {*} log
     * @param {boolean} log_amount
     * @returns {*}
     */
     const to_object = (log, log_amount) => {
        /**@type{*} */
        const log_array_with_object = [];
        log.forEach((/**@type{*}*/log_row)=>
                {
                    const log_split = log_row.split(';');
                    log_array_with_object.push({chart:Number(log_split[0]),
                                                app_id:log_split[1]=='null'?null:Number(log_split[1]),
                                                year:Number(log_split[2]),
                                                month:Number(log_split[3]),
                                                day:log_split[4]=='null'?null:Number(log_split[4]),
                                                amount:log_amount?Number(log_split[5]):null});
                }
        );
        return log_array_with_object;
    };
    return new Promise((resolve)=>{
        import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
            dbCommonExecute(parameters.app_id, 
                            dbSql.APP_DATA_STAT_SELECT_UNIQUE_VISITORS, 
                            {   app_id_log: serverUtilNumberValue(parameters.data.select_app_id),
                                year_log: serverUtilNumberValue(parameters.data.year),
                                month_log: serverUtilNumberValue(parameters.data.month),
                                app_data_entity_resource_id: 0,
                                app_data_entity_resource_app_data_entity_app_id: serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')),
                                app_data_entity_resource_app_data_entity_id : 0},
                            null))
            .then(result_logs =>{
                if (result_logs.result)
                    if (result_logs.result.length>0){
                        //use SQL group by and count() in javascript
                        //save unique server_remote_addr in a set
                        const log_unique_ip = new Set();
                        for (const log of result_logs.result){
                            log_unique_ip.add( `${log.chart};${log.app_id};${log.year};${log.month};${log.day};${JSON.parse(log.json_data).server_remote_addr}`);
                        }
                        //convert to array with objects
                        const log_unique = to_object(log_unique_ip, false);
                        //save amount in unique server_remote_addr list in a set
                        const log_unique_with_amount = new Set();
                        log_unique.forEach((/**@type{*}*/log)=>{
                            log_unique_with_amount.add( `${log.chart};${log.app_id};${log.year};${log.month};${log.day};${log_unique.filter((/**@type{*}*/log_amount)=>   
                                                                                                                                log_amount.chart==log.chart && 
                                                                                                                                log_amount.app_id == log.app_id &&
                                                                                                                                log_amount.year == log.year &&
                                                                                                                                log_amount.month == log.month &&
                                                                                                                                log_amount.day == log.day).length}`);
                        });
                        //convert to array with objects
                        const result_getStatUniqueVisitorAdmin = to_object(log_unique_with_amount, true);
                        result_logs.result = result_getStatUniqueVisitorAdmin;
                    }
                    else{
                        result_logs.result = [];
                    }
                resolve(result_logs);
            });
    });
};
/**
 * @name post
 * @description Create stat record
 * @function
 * @param {number}      app_id
 * @param {*}           data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.APP_DATA_STAT_INSERT, 
                        {json_data:                                             JSON.stringify(data.json_data),
                            app_id:                                             data.app_id ?? null,
                            user_account_id:                                    data.user_account_id ?? null,
                            user_account_app_user_account_id:                   data.user_account_app_user_account_id ?? null,
                            user_account_app_app_id:                            data.user_account_app_app_id ?? null,
                            app_data_resource_master_id:                        data.app_data_resource_master_id ?? null,
                            app_data_entity_resource_id:                        data.app_data_entity_resource_id,
                            app_data_entity_resource_app_data_entity_app_id:    data.app_data_entity_resource_app_data_entity_app_id,
                            app_data_entity_resource_app_data_entity_id:        data.app_data_entity_resource_app_data_entity_id
                            },
                        null));

export{get, getLog, getStatUniqueVisitor, post};