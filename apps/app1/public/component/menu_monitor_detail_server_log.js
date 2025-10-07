/**
 * Displays server logs
 * @module apps/app1/component/menu_monitor_detail_server_log
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 *              use this grouping to decide column orders
 *              [log columns][server columns][user columns][detail columms][app columns(broadcast, edit etc)]
 * @function
 * @param {{function_get_order_by:function,
 *          function_roundOff:common['CommonModuleCommon']['commonMiscRoundOff'],
 *          logs:[],
 *          logscope:'LogRequest'|'LogServer'|'LogApp'|'LogService'|'LogDb'|''}} props
 * @returns {string}
 */
const template = props => ` ${  props.logscope=='LogRequest'?
                                `<div class='menu_monitor_detail_server_log_row'>
                                    <div data-column='Id' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('Id')}'>
                                        ID
                                    </div>
                                    <div data-column='Created' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('Created')}'>
                                        CREATED
                                    </div>
                                    <div data-column='Host' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('Host')}'>
                                        HOST
                                    </div>
                                    <div data-column='AppId' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('AppId')}'>
                                        APP_ID
                                    </div>
                                    <div data-column='AppIdAuth' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('AppIdAuth')}'>
                                        APP_ID_AUTH
                                    </div>
                                    <div data-column='Ip' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('Ip')}'>
                                        IP
                                    </div>
                                    <div data-column='RequestId' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('RequestId')}'>
                                        REQUEST_ID
                                    </div>
                                    <div data-column='CorrelationId' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('CorrelationId')}'>
                                        CORRELATION_ID
                                    </div>
                                    <div data-column='Url' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('Url')}'>
                                        URL
                                    </div>
                                    <div data-column='XUrl' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('XUrl')}'>
                                        X_URL
                                    </div>
                                    <div data-column='HttpInfo' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('HttpInfo')}'>
                                        HTTP INFO
                                    </div>
                                    <div data-column='Method' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('Method')}'>
                                        METHOD
                                    </div>
                                    <div data-column='XMethod' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('XMethod')}'>
                                        X_METHOD
                                    </div>
                                    <div data-column='StatusCode' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('StatusCode')}'>
                                        STATUSCODE
                                    </div>
                                    <div data-column='StatusMessage' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('StatusMessage')}'>
                                        STATUSMESSAGE
                                    </div>
                                    <div data-column='UserAgent' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('UserAgent')}'>
                                        USER AGENT
                                    </div>
                                    <div data-column='AacceptLanguage' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('AcceptLanguage')}'>
                                        ACCEPT LANGUAGE
                                    </div>
                                    <div data-column='Referer' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('Referer')}'>
                                        REFERER
                                    </div>
                                    <div data-column='SizeReceived' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('SizeReceived')}'>
                                        SIZE_RECEIVED
                                    </div>
                                    <div data-column='SizeSent' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('SizeSent')}'>
                                        SIZE_SENT
                                    </div>
                                    <div data-column='ResponseTime' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('ResponseTime')}'>
                                        RESPONSE_TIME
                                    </div>
                                    <div data-column='Logtext' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('Logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((
                                                    /**@type{common['server']['ORM']['Object']['LogRequestInfo']}*/
                                                    log)=>
                                    `<div class='menu_monitor_detail_server_log_row'>
                                    <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.Id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.Created}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.Host}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.AppId}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.AppIdAuth}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col gps_click' data-ip='${log.Ip}'>
                                            ${log.Ip}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.RequestId}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.CorrelationId}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.Url}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.XUrl}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.HttpInfo}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.Method}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.XMethod}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.StatusCode}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.StatusMessage}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.UserAgent}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.AcceptLanguage}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.Referer}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.SizeReceived}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.SizeSent}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${props.function_roundOff(log.Responsetime)}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>${typeof log.Logtext === 'object'?JSON.stringify(log.Logtext):log.Logtext}</div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='LogServer'?
                                `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_server_row'>
                                    <div data-column='Id' class='menu_monitor_detail_server_log_col list_sort_click list_title ${props.function_get_order_by('Id')}'>
                                        ID
                                    </div>
                                    <div data-column='Created' class='menu_monitor_detail_server_log_col list_sort_click list_title ${props.function_get_order_by('Created')}'>
                                        CREATED
                                    </div>
                                    <div data-column='Logtext' class='menu_monitor_detail_server_log_col list_sort_click list_title ${props.function_get_order_by('Logtext')}'>
                                        LOGTEXT
                                    </div>
                                </div>
                                ${props.logs.map((
                                                    /**@type{common['server']['ORM']['Object']['LogServerInfo']}*/
                                                    log)=>
                                    `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_server_row'>
                                        <div class='menu_monitor_detail_server_log_col'>
                                            ${log.Id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_col'>
                                            ${log.Created}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_col'>
                                            ${log.LogText}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='LogApp'?
                                `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_app_row'>
                                    <div data-column='Id' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('Id')}'>
                                        ID
                                    </div>
                                    <div data-column='Created' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('Created')}'>
                                        CREATED
                                    </div>
                                    <div data-column='AppId' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('AppId')}'>
                                        APP ID
                                    </div>
                                    <div data-column='AppFilename' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('AppFilename')}'>
                                        FILENAME
                                    </div>
                                    <div data-column='AppFunction' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('AppFunction')}'>
                                        FUNCTION
                                    </div>
                                    <div data-column='AppLine' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('AppLine')}'>
                                        LINE
                                    </div>
                                    <div data-column='Logtext' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('Logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((
                                                    /**@type{common['server']['ORM']['Object']['LogAppInfo']}*/
                                                    log)=>
                                    `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_app_row'>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.Id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.Created}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.AppId}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col common_wide_list_column'>
                                            ${log.AppFilename}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col common_wide_list_column'>
                                            ${log.AppFunction_name}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.AppAppLine}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col common_wide_list_column'>
                                            ${log.Logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='LogService'?
                                `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_service_row'>
                                    <div data-column='Id' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('Id')}'>
                                        ID
                                    </div>
                                    <div data-column='Created' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('Created')}'>
                                        CREATED
                                    </div>
                                    <div data-column='AppId' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('AppId')}'>
                                        APP ID
                                    </div>
                                    <div data-column='Service' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('Service')}'>
                                        SERVICE
                                    </div>
                                    <div data-column='Parameters' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('Parameters')}'>
                                        PARAMETERS
                                    </div>
                                    <div data-column='Logtext' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('Logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((
                                                    /**@type{common['server']['ORM']['Object']['LogServiceInfo']}*/
                                                    log)=>
                                    `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_service_row'>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.Id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.Created}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.AppId}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.Service}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col common_wide_list_column'>
                                            ${log.Parameters}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col common_wide_list_column'>
                                            ${log.Logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }    
                            ${props.logscope=='LogDb'?
                                `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_db_row'>
                                    <div data-column='Id' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('Id')}'>
                                        ID
                                    </div>
                                    <div data-column='Created' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('Created')}'>
                                        CREATED
                                    </div>
                                    <div data-column='AppId' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('AppId')}'>
                                        APP ID
                                    </div>
                                    <div data-column='Object' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('Object')}'>
                                        OBJECT
                                    </div>
                                    <div data-column='Dml' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('Dml')}'>
                                        DML
                                    </div>
                                    <div data-column='Parameters' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('Parameters')}'>
                                        PARAMETERS
                                    </div>
                                    <div data-column='Logtext' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('Logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{common['server']['ORM']['Object']['LogDbInfo']}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_db_row'>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.Id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.Created}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.AppId}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.Object}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col common_wide_list_column'>
                                            ${log.Dml}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col common_wide_list_column'>
                                            ${typeof log.Parameters=='object'?JSON.stringify(log.Parameters):log.Parameters}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col common_wide_list_column'>
                                            ${log.Logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }`;
                            
/**
 * @name component
 * @description Component
 * @function
 * @param {{ data:{      commonMountdiv:string,
 *                       path:string,
 *                       query:string,
 *                       token_type:common['CommonRESTAPIAuthorizationType'],
 *                       sort:string,
 *                       order_by:string},
 *           methods:{   COMMON:common['CommonModuleCommon']},
 *           lifeycle:   null}} props 
 * @returns {Promise.<{ lifecycle:   common['CommonComponentLifecycle'], 
 *                      data:        {page_last:number, count:Number, total_count:number},
 *                      methods:     null,
 *                      template:    string}>}
 */
const component = async props => {
    const logs = await props.methods.COMMON.commonFFB({path:props.data.path, query:props.data.query, method:'GET', authorization_type:props.data.token_type}).then((/**@type{string}*/result)=>JSON.parse(result));
    /**
     * Get order by if column matches
     * @param {string} column
     */
    const get_order_by = column =>column==props.data.sort?props.data.order_by:'';

    return {
        lifecycle:  null,
        data:       {page_last :    logs.rows.length>0?(Math.ceil(logs.page_header.total_count/logs.page_header.count)):0,
                     count:         logs.page_header.count,
                     total_count:   logs.page_header.total_count
        },
        methods:    null,
        template:   template({  function_get_order_by:get_order_by,
                                function_roundOff:props.methods.COMMON.commonMiscRoundOff,
                                logs:logs.rows,
                                logscope:props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logobject .common_select_dropdown_value').getAttribute('data-value').replace('Info','').replace('Error','').replace('Verbose','')})
    };
};
export default component;