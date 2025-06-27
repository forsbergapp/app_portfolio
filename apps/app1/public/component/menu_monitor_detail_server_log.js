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
 *          logscope:'LogRequest'|'LogServer'|'LogApp'|'LogService'|'LogDb'|''}} props
 * @returns {string}
 */
const template = props => ` ${  /*
                                use this grouping to decide column orders
                                [log columns][server columns][user columns][detail columms][app columns(broadcast, edit etc)]
                                */
                                props.logscope=='LogRequest'?
                                `<div class='menu_monitor_detail_server_log_row'>
                                    <div data-column='id' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('id')}'>
                                        ID
                                    </div>
                                    <div data-column='created' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('created')}'>
                                        CREATED
                                    </div>
                                    <div data-column='host' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('host')}'>
                                        HOST
                                    </div>
                                    <div data-column='app_id' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                        APP_ID
                                    </div>
                                    <div data-column='app_id_auth' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('app_id_auth')}'>
                                        APP_ID_AUTH
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
                                    <div data-column='x_url' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('x_url')}'>
                                        X_URL
                                    </div>
                                    <div data-column='http_info' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('http_info')}'>
                                        HTTP INFO
                                    </div>
                                    <div data-column='method' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('method')}'>
                                        METHOD
                                    </div>
                                    <div data-column='x_method' class='menu_monitor_detail_server_log_request_log_col list_sort_click list_title ${props.function_get_order_by('x_method')}'>
                                        X_METHOD
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
                                ${props.logs.map((/**@type{{id:number,
                                                            host:string,
                                                            app_id:number|null,
                                                            app_id_auth:1|0|null,
                                                            ip:string,
                                                            requestid:string,
                                                            correlationid:string,
                                                            url:string,
                                                            x_url:string|null,
                                                            http_info:string,
                                                            method:string,
                                                            x_method:string|null,
                                                            statusCode:string,
                                                            statusMessage:string,
                                                            'user-agent':string,
                                                            'accept-language':string,
                                                            referer:string,
                                                            size_received:number,
                                                            size_sent:number,
                                                            responsetime:number,
                                                            logtext:string,
                                                            created:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row'>
                                    <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.created}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.host}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.app_id_auth}
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
                                        <div class='menu_monitor_detail_server_log_request_log_col common_wide_list_column'>
                                            ${log.x_url}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.http_info}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.method}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_request_log_col'>
                                            ${log.x_method}
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
                            ${props.logscope=='LogServer'?
                                `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_server_row'>
                                    <div data-column='id' class='menu_monitor_detail_server_log_col list_sort_click list_title ${props.function_get_order_by('id')}'>
                                        ID
                                    </div>
                                    <div data-column='created' class='menu_monitor_detail_server_log_col list_sort_click list_title ${props.function_get_order_by('created')}'>
                                        CREATED
                                    </div>
                                    <div data-column='logtext' class='menu_monitor_detail_server_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOGTEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{id:number,
                                                            logtext:string,
                                                            created:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_server_row'>
                                        <div class='menu_monitor_detail_server_log_col'>
                                            ${log.id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_col'>
                                            ${log.created}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_col'>
                                            ${log.logtext}
                                        </div>
                                    </div>`
                                    ).join('')
                                }`:''
                            }
                            ${props.logscope=='LogApp'?
                                `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_app_row'>
                                    <div data-column='id' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('id')}'>
                                        ID
                                    </div>
                                    <div data-column='created' class='menu_monitor_detail_server_log_app_data_stat_col list_sort_click list_title ${props.function_get_order_by('created')}'>
                                        CREATED
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
                                ${props.logs.map((/**@type{{id:number,
                                                            app_id:number,
                                                            app_filename:string,
                                                            app_function_name:string,
                                                            app_app_line:string,
                                                            logtext:string,
                                                            created:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_app_row'>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_app_data_stat_col'>
                                            ${log.created}
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
                            ${props.logscope=='LogService'?
                                `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_service_row'>
                                    <div data-column='id' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('id')}'>
                                        ID
                                    </div>
                                    <div data-column='created' class='menu_monitor_detail_server_log_service_log_col list_sort_click list_title ${props.function_get_order_by('created')}'>
                                        CREATED
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
                                ${props.logs.map((/**@type{{id:number,
                                                            app_id:number,
                                                            service:string,
                                                            parameters:string,
                                                            logtext:string,
                                                            created:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_service_row'>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_service_log_col'>
                                            ${log.created}
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
                            ${props.logscope=='LogDb'?
                                `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_db_row'>
                                    <div data-column='id' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('id')}'>
                                        ID
                                    </div>
                                    <div data-column='created' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('created')}'>
                                        CREATED
                                    </div>
                                    <div data-column='app_id' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                        APP ID
                                    </div>
                                    <div data-column='object' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('object')}'>
                                        OBJECT
                                    </div>
                                    <div data-column='dml' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('dml')}'>
                                        DML
                                    </div>
                                    <div data-column='parameters' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('parameters')}'>
                                        PARAMETERS
                                    </div>
                                    <div data-column='logtext' class='menu_monitor_detail_server_log_db_log_col list_sort_click list_title ${props.function_get_order_by('logtext')}'>
                                        LOG TEXT
                                    </div>
                                </div>
                                ${props.logs.map((/**@type{{id:number,
                                                            app_id:number,
                                                            object:string,
                                                            dml:string,
                                                            parameters:string,
                                                            logtext:string,
                                                            created:string
                                                            }}*/log)=>
                                    `<div class='menu_monitor_detail_server_log_row menu_monitor_detail_server_log_db_row'>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.created}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.app_id}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col'>
                                            ${log.object}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col common_wide_list_column'>
                                            ${log.dml}
                                        </div>
                                        <div class='menu_monitor_detail_server_log_db_log_col common_wide_list_column'>
                                            ${typeof log.parameters=='object'?JSON.stringify(log.parameters):log.parameters}
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
                                logscope:props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logobject .common_select_dropdown_value').getAttribute('data-value').replace('Info','').replace('Error','').replace('Verbose','')})
    };
};
export default component;