/** @module server/db/dbModelUserAccountEvent */

/**@type{import('./dbSql.js')} */
const dbSql = await import(`file://${process.cwd()}/server/db/dbSql.js`);

/**
 * 
 * @param {number} app_id 
 * @param {import('../types.js').server_db_sql_parameter_user_account_event_insertUserEvent} data 
 * @returns {Promise.<import('../types.js').server_db_sql_result_user_account_event_insertUserEvent>}
 */
const insertUserEvent = async (app_id, data) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_EVENT_INSERT, 
                        {
                            user_account_id : data.user_account_id, 
                            user_language: data.user_language,
                            user_timezone: data.user_timezone,
                            user_number_system : data.user_number_system, 
                            user_platform : data.user_platform,
                            client_latitude : data.client_latitude, 
                            client_longitude : data.client_longitude,
                            server_remote_addr : data.server_remote_addr,
                            server_user_agent : data.server_user_agent,
                            server_http_host : data.server_http_host, 
                            server_http_accept_language : data.server_http_accept_language,
                            event : data.event,
                            event_status : data.event_status
                        },
                        null, 
                        null));
/**
 * 
 * @param {number} app_id 
 * @param {number|null} user_account_id 
 * @param {string} event 
 * @returns {Promise.<import('../types.js').server_db_sql_result_user_account_event_getLastUserEvent[]>}
 */
const getLastUserEvent = async (app_id, user_account_id, event) => 
    import(`file://${process.cwd()}/server/db/common.js`).then((/**@type{import('./common.js')} */{dbCommonExecute})=>
        dbCommonExecute(app_id, 
                        dbSql.USER_ACCOUNT_EVENT_INSERT, 
                        {
                            user_account_id: user_account_id,
                            event : event
                        },
                        null, 
                        null));

export {insertUserEvent, getLastUserEvent};