/**
 * @module apps/admin/component/menu_monitor_detail_server_log
 */
/**
 * Displays server logs
 * 
 */
/**
 * @param {{system_admin:string|null,
*          function_get_order_by:function,
*          function_roundOff:function,
*          logs:[],
*          logscope:'REQUEST'|'SERVER'|'APP'|'SERVICE'|'DB'|''}} props
*/
const template = props => ` ${  /*
                                use this grouping to decide column orders
                                [log columns][server columns][user columns][detail columms][app columns(broadcast, edit etc)]
                                */
                                props.logscope=='REQUEST'?
                                `<div class='list_server_log_row'>
                                    <div data-column='logdate' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='host' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('host')}'>
                                        HOST
                                    </div>
                                    <div data-column='ip' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('ip')}'>
                                        IP
                                    </div>
                                    <div data-column='requestid' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('requestid')}'>
                                        REQUEST_ID
                                    </div>
                                    <div data-column='correlationid' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('correlationid')}'>
                                        CORRELATION_ID
                                    </div>
                                    <div data-column='url' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('url')}'>
                                        URL
                                    </div>
                                    <div data-column='http_info' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('http_info')}'>
                                        HTTP INFO
                                    </div>
                                    <div data-column='method' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('method')}'>
                                        METHOD
                                    </div>
                                    <div data-column='statuscode' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('statuscode')}'>
                                        STATUSCODE
                                    </div>
                                    <div data-column='statusmessage' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('statusmessage')}'>
                                        STATUSMESSAGE
                                    </div>
                                    <div data-column='user-agent' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('user-agent')}'>
                                        USER AGENT
                                    </div>
                                    <div data-column='accept-language' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('accept-language')}'>
                                        ACCEPT LANGUAGE
                                    </div>
                                    <div data-column='referer' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('referer')}'>
                                        REFERER
                                    </div>
                                    <div data-column='size_received' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('size_received')}'>
                                        SIZE_RECEIVED
                                    </div>
                                    <div data-column='size_sent' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('size_sent')}'>
                                        SIZE_SENT
                                    </div>
                                    <div data-column='responsetime' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('responsetime')}'>
                                        RESPONSE_TIME
                                    </div>
                                    <div data-column='logtext' class='list_request_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
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
                                    `<div class='list_server_log_row'>
                                        <div class='list_request_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='list_request_log_col common_wide_list_column'>
                                            ${log.host}
                                        </div>
                                        <div class='list_request_log_col gps_click' data-ip='${log.ip==''?'':log.ip.replace('::ffff:','')}'>
                                            ${log.ip==''?'':log.ip.replace('::ffff:','')}
                                        </div>
                                        <div class='list_request_log_col'>
                                            ${log.requestid}
                                        </div>
                                        <div class='list_request_log_col'>
                                            ${log.correlationid}
                                        </div>
                                        <div class='list_request_log_col common_wide_list_column'>
                                            ${log.url}
                                        </div>
                                        <div class='list_request_log_col'>
                                            ${log.http_info}
                                        </div>
                                        <div class='list_request_log_col'>
                                            ${log.method}
                                        </div>
                                        <div class='list_request_log_col'>
                                            ${log.statusCode}
                                        </div>
                                        <div class='list_request_log_col common_wide_list_column'>
                                            ${log.statusMessage}
                                        </div>
                                        <div class='list_request_log_col common_wide_list_column'>
                                            ${log['user-agent']}
                                        </div>
                                        <div class='list_request_log_col common_wide_list_column'>
                                            ${log['accept-language']}
                                        </div>
                                        <div class='list_request_log_col common_wide_list_column'>
                                            ${log.referer}
                                        </div>
                                        <div class='list_request_log_col'>
                                            ${log.size_received}
                                        </div>
                                        <div class='list_request_log_col'>
                                            ${log.size_sent}
                                        </div>
                                        <div class='list_request_log_col'>
                                            ${props.function_roundOff(log.responsetime)}
                                        </div>
                                        <div class='list_request_log_col common_wide_list_column'>${typeof log.logtext === 'object'?JSON.stringify(log.logtext):log.logtext}</div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='SERVER'?
                                `<div class='list_server_log_row'>
                                    <div data-column='logdate' class='list_server_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='logtext' class='list_server_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOGTEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{logdate:string,
                                                            logtext:string
                                                            }}*/log)=>
                                    `<div class='list_server_log_row'>
                                        <div class='list_server_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='list_server_log_col'>
                                            ${log.logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='APP'?
                                `<div class='list_server_log_row'>
                                    <div data-column='logdate' class='list_server_app_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='app_id' class='list_server_app_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                        APP ID
                                    </div>
                                    <div data-column='filename' class='list_server_app_log_col list_sort_click list_title ${props.function_get_order_by('filename')}'>
                                        FILENAME
                                    </div>
                                    <div data-column='function' class='list_server_app_log_col list_sort_click list_title ${props.function_get_order_by('function')}'>
                                        FUNCTION
                                    </div>
                                    <div data-column='line' class='list_server_app_log_col list_sort_click list_title ${props.function_get_order_by('line')}'>
                                        LINE
                                    </div>
                                    <div data-column='logtext' class='list_server_app_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
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
                                    `<div class='list_server_log_row'>
                                        <div class='list_server_app_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='list_server_app_log_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='list_server_app_log_col common_wide_list_column'>
                                            ${log.app_filename}
                                        </div>
                                        <div class='list_server_app_log_col common_wide_list_column'>
                                            ${log.app_function_name}
                                        </div>
                                        <div class='list_server_app_log_col'>
                                            ${log.app_app_line}
                                        </div>
                                        <div class='list_server_app_log_col common_wide_list_column'>
                                            ${log.logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='SERVICE'?
                                `<div class='list_server_log_row'>
                                    <div data-column='logdate' class='list_service_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='app_id' class='list_service_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                        APP ID
                                    </div>
                                    <div data-column='service' class='list_service_log_col list_sort_click list_title ${props.function_get_order_by('service')}'>
                                        SERVICE
                                    </div>
                                    <div data-column='parameters' class='list_service_log_col list_sort_click list_title ${props.function_get_order_by('parameters')}'>
                                        PARAMETERS
                                    </div>
                                    <div data-column='logtext' class='list_service_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{logdate:string,
                                                            app_id:number,
                                                            service:string,
                                                            parameters:string,
                                                            logtext:string
                                                            }}*/log)=>
                                    `<div class='list_server_log_row'>
                                        <div class='list_service_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='list_service_log_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='list_service_log_col'>
                                            ${log.service}
                                        </div>
                                        <div class='list_service_log_col common_wide_list_column'>
                                            ${log.parameters}
                                        </div>
                                        <div class='list_service_log_col common_wide_list_column'>
                                            ${log.logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }    
                            ${props.logscope=='DB'?
                                `<div class='list_server_log_row'>
                                    <div data-column='logdate' class='list_db_log_col list_sort_click list_title ${props.function_get_order_by('logdate')}'>
                                        LOGDATE
                                    </div>
                                    <div data-column='app_id' class='list_db_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                        APP ID
                                    </div>
                                    <div data-column='db' class='list_db_log_col list_sort_click list_title ${props.function_get_order_by('db')}'>
                                        DB
                                    </div>
                                    <div data-column='sql' class='list_db_log_col list_sort_click list_title ${props.function_get_order_by('sql')}'>
                                        SQL
                                    </div>
                                    <div data-column='parameters' class='list_db_log_col list_sort_click list_title ${props.function_get_order_by('parameters')}'>
                                        PARAMETERS
                                    </div>
                                    <div data-column='logtext' class='list_db_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
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
                                    `<div class='list_server_log_row'>
                                        <div class='list_db_log_col'>
                                            ${log.logdate}
                                        </div>
                                        <div class='list_db_log_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='list_db_log_col'>
                                            ${log.db}
                                        </div>
                                        <div class='list_db_log_col common_wide_list_column'>
                                            ${log.sql}
                                        </div>
                                        <div class='list_db_log_col common_wide_list_column'>
                                            ${log.parameters}
                                        </div>
                                        <div class='list_db_log_col common_wide_list_column'>
                                            ${log.logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }`;
                            
/**
* 
* @param {{ data:{      commonMountdiv:string,
*                       system_admin:string,
*                       path:string,
*                       query:string,
*                       token_type:import('../../../common_types.js').CommonRESTAPIAuthorizationType,
*                       sort:string,
*                       order_by:string,
*                       LIMIT:number},
*           methods:{   COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
*                       commonRoundOff:import('../../../common_types.js').CommonModuleCommon['commonRoundOff'],
*                       commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']},
*           lifeycle:   null}} props 
* @returns {Promise.<{ lifecycle:   import('../../../common_types.js').CommonComponentLifecycle, 
*                      data:        {page_last:number},
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
        data:       {page_last :logs.rows.length>0?(Math.floor(logs.page_header.total_count/props.data.LIMIT) * props.data.LIMIT):0},
        methods:    null,
        template:   template({system_admin:props.data.system_admin, 
                            function_get_order_by:get_order_by,
                            function_roundOff:props.methods.commonRoundOff,
                            logs:logs.rows,
                            logscope:props.methods.COMMON_DOCUMENT.querySelector('#select_logscope5 .common_select_dropdown_value').getAttribute('data-value').split('-')[0]})
    };
};
export default component;