/**
 * Displays server logs
 * @module apps/app1/component/menu_monitor_detail_server_log
 */

/**
 * @import {CommonRESTAPIAuthorizationType, CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{function_get_order_by:function,
 *          function_roundOff:CommonModuleCommon['commonMiscRoundOff'],
 *          logs:[],
 *          logscope:'Request'|'Server'|'App'|'Service'|'Db'|''}} props
 * @returns {string}
 */
const template = props => ` ${  /*
                                use this grouping to decide column orders
                                [log columns][server columns][user columns][detail columms][app columns(broadcast, edit etc)]
                                */
                                props.logscope=='Request'?
                                `<div class='menu_monitor_detail_server_log_row'>
                                    <div data-column='logdate' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='host' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('host')}'>
                                        HOST
                                    </div>
                                    <div data-column='ip' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('ip')}'>
                                        IP
                                    </div>
                                    <div data-column='requestid' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('requestid')}'>
                                        REQUEST_ID
                                    </div>
                                    <div data-column='correlationid' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('correlationid')}'>
                                        CORRELATION_ID
                                    </div>
                                    <div data-column='url' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('url')}'>
                                        URL
                                    </div>
                                    <div data-column='http_info' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('http_info')}'>
                                        HTTP INFO
                                    </div>
                                    <div data-column='method' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('method')}'>
                                        METHOD
                                    </div>
                                    <div data-column='statuscode' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('statuscode')}'>
                                        STATUSCODE
                                    </div>
                                    <div data-column='statusmessage' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('statusmessage')}'>
                                        STATUSMESSAGE
                                    </div>
                                    <div data-column='user-agent' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('user-agent')}'>
                                        USER AGENT
                                    </div>
                                    <div data-column='accept-language' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('accept-language')}'>
                                        ACCEPT LANGUAGE
                                    </div>
                                    <div data-column='referer' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('referer')}'>
                                        REFERER
                                    </div>
                                    <div data-column='size_received' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('size_received')}'>
                                        SIZE_RECEIVED
                                    </div>
                                    <div data-column='size_sent' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('size_sent')}'>
                                        SIZE_SENT
                                    </div>
                                    <div data-column='responsetime' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('responsetime')}'>
                                        RESPONSE_TIME
                                    </div>
                                    <div data-column='logtext' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{logdate:string,
                                                            host:string,
                                                            ip:string,
                                                            requestid:string,
                                                            correlationid:string,
                                                            url:string,
                                                            http_info:string,
                                                            method:string,
                                                            statusCode:string,
                                                            statusMessage:string,
                                                            'user-agent':string,
                                                            'accept-language':string,
                                                            referer:string,
                                                            size_received:number,
                                                            size_sent:number,
                                                            responsetime:number,
                                                            logtext:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row'>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.host}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col gps_click' data-ip='${log.ip}'>
                                            ${log.ip}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.requestid}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.correlationid}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.url}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.http_info}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.method}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.statusCode}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.statusMessage}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log['user-agent']}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log['accept-language']}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.referer}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.size_received}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.size_sent}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${props.function_roundOff(log.responsetime)}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>${typeof log.logtext === 'object'?JSON.stringify(log.logtext):log.logtext}</div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='Server'?
                                `<div class='menu_monitor_detail_server_log_row'>
                                    <div data-column='logdate' class='menu_monitor_detail_server_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='logtext' class='menu_monitor_detail_server_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOGTEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{logdate:string,
                                                            logtext:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row'>
                                        <div class='menu_monitor_detail_server_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_col'>
                                            ${log.logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='App'?
                                `<div class='menu_monitor_detail_server_log_row'>
                                    <div data-column='logdate' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='app_id' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                        APP ID
                                    </div>
                                    <div data-column='filename' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('filename')}'>
                                        FILENAME
                                    </div>
                                    <div data-column='function' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('function')}'>
                                        FUNCTION
                                    </div>
                                    <div data-column='line' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('line')}'>
                                        LINE
                                    </div>
                                    <div data-column='logtext' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{logdate:string,
                                                            app_id:number,
                                                            app_filename:string,
                                                            app_function_name:string,
                                                            app_app_line:string,
                                                            logtext:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row'>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col common_wide_list_column'>
                                            ${log.app_filename}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col common_wide_list_column'>
                                            ${log.app_function_name}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.app_app_line}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col common_wide_list_column'>
                                            ${log.logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='Service'?
                                `<div class='menu_monitor_detail_server_log_row'>
                                    <div data-column='logdate' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='app_id' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                        APP ID
                                    </div>
                                    <div data-column='service' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('service')}'>
                                        SERVICE
                                    </div>
                                    <div data-column='parameters' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('parameters')}'>
                                        PARAMETERS
                                    </div>
                                    <div data-column='logtext' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{logdate:string,
                                                            app_id:number,
                                                            service:string,
                                                            parameters:string,
                                                            logtext:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row'>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.service}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col common_wide_list_column'>
                                            ${log.parameters}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col common_wide_list_column'>
                                            ${log.logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }    
                            ${props.logscope=='Db'?
                                `<div class='menu_monitor_detail_server_log_row'>
                                    <div data-column='logdate' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='app_id' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                        APP ID
                                    </div>
                                    <div data-column='db' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('db')}'>
                                        DB
                                    </div>
                                    <div data-column='sql' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('sql')}'>
                                        SQL
                                    </div>
                                    <div data-column='parameters' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('parameters')}'>
                                        PARAMETERS
                                    </div>
                                    <div data-column='logtext' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{logdate:string,
                                                            app_id:number,
                                                            db:string,
                                                            sql:string,
                                                            parameters:string,
                                                            logtext:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row'>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.db}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col common_wide_list_column'>
                                            ${log.sql}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col common_wide_list_column'>
                                            ${log.parameters}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col common_wide_list_column'>
                                            ${log.logtext}
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
 *                       token_type:CommonRESTAPIAuthorizationType,
 *                       sort:string,
 *                       order_by:string},
 *           methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonMiscRoundOff:CommonModuleCommon['commonMiscRoundOff'],
 *                       commonFFB:CommonModuleCommon['commonFFB']},
 *           lifeycle:   null}} props 
 * @returns {Promise.<{ lifecycle:   CommonComponentLifecycle, 
 *                      data:        {page_last:number, count:Number, total_count:number},
 *                      methods:     null,
 *                      template:    string}>}
 */
const component = async props => {
    const logs = await props.methods.commonFFB({path:props.data.path, query:props.data.query, method:'GET', authorization_type:props.data.token_type}).then((/**@type{string}*/result)=>JSON.parse(result));
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
                                function_roundOff:props.methods.commonMiscRoundOff,
                                logs:logs.rows,
                                logscope:props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logscope .common_select_dropdown_value').getAttribute('data-value').split('-')[0]})
    };
};
export default component;