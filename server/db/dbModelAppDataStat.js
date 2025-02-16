/** @module server/db/dbModelAppDataStat */

/**
 * @import {server_server_response,
 *          server_db_common_result_insert,
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
							data_app_id         : serverUtilNumberValue(parameters.data.data_app_id)})
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
                            app_data_entity_resource_id: serverUtilNumberValue(parameters.data.app_data_entity_resource_id),
                            app_data_entity_resource_app_data_entity_app_id: serverUtilNumberValue(parameters.data.app_data_entity_resource_app_data_entity_app_id),
                            app_data_entity_resource_app_data_entity_id :  serverUtilNumberValue(parameters.data.app_data_entity_resource_app_data_entity_id)}))
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
 * @name post
 * @description Create stat record
 * @function
 * @param {number}      app_id
 * @param {*}           data
 * @returns {Promise.<server_server_response & {result?:server_db_common_result_insert }>}
 */
const post = async (app_id, data) =>
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_ADMIN_APP_ID')), 
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
                            }));

export{get, getLog, post};