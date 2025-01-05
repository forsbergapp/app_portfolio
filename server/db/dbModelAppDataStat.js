/** @module server/db/dbModelAppDataStat */

/**
 * @import {server_db_sql_result_app_data_stat_post, server_db_sql_result_app_data_stat_getStatUniqueVisitor, 
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
 * @memberof REST_API
 * @param {{app_id:number,
 *          data:{  id?:string|null,
 *                  data_app_id?:string|null,
 *                  resource_name_entity?:string|null}}} parameters
 * @returns {Promise.<server_db_sql_result_app_data_stat_get[]>}
 */
const get = parameters => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(parameters.app_id, 
                        dbSql.APP_DATA_STAT_SELECT, 
                        {   resource_id         : serverUtilNumberValue(parameters.data.id),
							data_app_id         : serverUtilNumberValue(parameters.data.data_app_id),
                            resource_name_entity: parameters.data.resource_name_entity},
                        null, 
                        null));
/**
 * @name getLog
 * @description Get stat log
 * @function
 * @memberof REST_API
 * @param {{app_id:number,
 *          data:{  sort?:string|null,
 *                  order_by?:string|null,
 *                  select_app_id?:string|null,
 *                  year?:string|null,
 *                  month?:string|null,
 *                  day?:string|null,
 *                  offset?:string|null,
 *                  limit?:string|null,
 *                  data_app_id?:string|null,
 *                  resource_name_entity?:string|null}}} parameters
 * @returns {Promise.<server_db_sql_result_app_data_stat_logGet[]>}
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
                            app_data_entity_resource_id: 0,
                            app_data_entity_resource_app_data_entity_app_id: serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID')),
                            app_data_entity_resource_app_data_entity_id : 0},
                        null, 
                        null))
        .then(result =>{
                if (parameters.data.sort!='date_created' && parameters.data.sort!='app_id'){
                    //sort json_data columns
                    /**@ts-ignore*/
                    result.rows = result.rows.sort((first, second)=>{
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
 * @memberof REST_API
 * @param {{app_id:number,
 *          data:{  select_app_id?:string|null,
 *                  year?:string|null,
 *                  month?:string|null}}} parameters
 * @returns {Promise.<server_db_sql_result_app_data_stat_getStatUniqueVisitor[]>}
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
                            null, 
                            null))
            .then(result_logs =>{
                if (result_logs.length>0){
                    //use SQL group by and count() in javascript
                    //save unique server_remote_addr in a set
                    const log_unique_ip = new Set();
                    for (const log of result_logs){
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
                    resolve(result_getStatUniqueVisitorAdmin);
                }
                else{
                    resolve([]);
                }
            });
    });
};
/**
 * @name post
 * @description Create stat record
 * @function
 * @param {number}      app_id
 * @param {*}           data
 * @returns {Promise.<server_db_sql_result_app_data_stat_post[]>}
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
                        null, 
                        null));

export{get, getLog, getStatUniqueVisitor, post};
