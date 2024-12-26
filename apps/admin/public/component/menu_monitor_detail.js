/**
 * Displays monitor
 * 
 * Connected
 *      menu_monitor_detail_connected          contains records
 * App log
 *      menu_monitor_detail_app_log            contains records
 *      list_app_pagination     contains page navigation buttons
 * Server log 
 *      menu_monitor_detail_server_log_form    contains log parameters and is mounted first so records knows what logscope is used
 *      menu_monitor_detail_server_log         contains records
 * @module apps/admin/component/menu_monitor_detail
 */

/**
 * @import {CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @import {appSecureDialogueSendBroadcastShow} from '../js/app.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{
 *          service_socket_client_ID:number,
 *          monitor_detail:'CONNECTED'|'APP_LOG'|'SERVER_LOG',
 *          function_commonWindowUserAgentPlatform:CommonModuleCommon['commonWindowUserAgentPlatform'],
 *          function_get_order_by:function,
 *          function_roundOff:CommonModuleCommon['commonMiscRoundOff'],
 *          logs:[],
 *          SERVICE_LOG_DATA_PARAMETERS:{
 *                                      SCOPE_REQUEST:string,
 *                                      SCOPE_SERVER:string, 
 *                                      SCOPE_SERVICE:string,
 *                                      SCOPE_APP:string,
 *                                      SCOPE_DB:string,
 *                                      REQUEST_LEVEL:number,
 *                                      SERVICE_LEVEL:number,
 *                                      DB_LEVEL:number,
 *                                      LEVEL_VERBOSE:string,
 *                                      LEVEL_ERROR:string,
 *                                      LEVEL_INFO:string,
 *                                      FILE_INTERVAL:string}}} props
 * @returns {string}
 */
const template = props => ` ${props.monitor_detail=='CONNECTED'?
                                `<div id='menu_monitor_detail_connected_form'>    
                                    <div id='menu_monitor_detail_connected' class='common_list_scrollbar'>
                                        <div class='menu_monitor_detail_connected_row'>
                                            <div data-column='id' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('id')}'>
                                                ID
                                            </div>
                                            <div data-column='connection_date' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('connection_date')}'>
                                                CONNECTION DATE
                                            </div>
                                            <div data-column='app_id' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                                APP ID
                                            </div>
                                            <div data-column='user_account_id' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('user_account_id')}'>
                                                DB USER ID
                                            </div>
                                            <div data-column='iam_user_id' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('iam_user_id')}'>
                                                IAM ID
                                            </div>
                                            <div data-column='iam_user_username' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('iam_user_username')}'>
                                                IAM USERNAME
                                            </div>
                                            <div data-column='iam_user_type' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('iam_user_type')}'>
                                                IAM TYPE
                                            </div>
                                            <div data-column='ip' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('ip')}'>
                                                IP
                                            </div>
                                            <div data-column='gps_latitude' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('gps_latitude')}'>
                                                GPS LAT
                                            </div>
                                            <div data-column='gps_longitude' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('gps_longitude')}'>
                                                GPS LONG
                                            </div>
                                            <div data-column='place' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('place')}'>
                                                PLACE
                                            </div>
                                            <div data-column='timezone' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('timezone')}'>
                                                TIMEZONE
                                            </div>
                                            <div data-column='user_agent' class='menu_monitor_detail_connected_col list_sort_click list_title ${props.function_get_order_by('user_agent')}'>
                                                USER AGENT
                                            </div>
                                            <div data-column='broadcast' class='menu_monitor_detail_connected_col list_title ${props.function_get_order_by('broadcast')}'>
                                                BROADCAST
                                            </div>
                                        </div>
                                        ${props.logs.map((/**@type{{id:number,
                                                                    connection_date:string,
                                                                    app_id:number,
                                                                    iam_user_id:number|null,
                                                                    iam_user_username:string|null,
                                                                    iam_user_type:'ADMIN'|'USER'|null,
                                                                    ip:string,
                                                                    user_account_id:number,
                                                                    gps_latitude:string,
                                                                    gps_longitude:string,
                                                                    place:string,
                                                                    timezone:string,
                                                                    user_agent:string
                                                                    }}*/log)=>
                                            `<div class='menu_monitor_detail_connected_row ${log.id==props.service_socket_client_ID?'list_current_user_row':''}'>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.id}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.connection_date}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.app_id}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.user_account_id ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.iam_user_id ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.iam_user_username ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.iam_user_type ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.ip.replace('::ffff:','')}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col gps_click' 
                                                    data-latitude='${log.gps_latitude ?? ''}'
                                                    data-longitude='${log.gps_longitude ?? ''}'>
                                                    ${log.gps_latitude ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col gps_click'
                                                    data-latitude='${log.gps_latitude ?? ''}'
                                                    data-longitude='${log.gps_longitude ?? ''}'>
                                                    ${log.gps_longitude ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.place}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.timezone}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col common_wide_list_column'>
                                                    ${props.function_commonWindowUserAgentPlatform(log.user_agent) ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col chat_click common_icon' data-id='${log.id}'></div>
                                            </div>`
                                            ).join('')
                                        }
                                    </div>
                                </div>`:
                                ''
                            }
                            ${props.monitor_detail=='APP_LOG'?`
                                <div id='menu_monitor_detail_app_log_form'>
                                    <div id='menu_monitor_detail_app_log' class='common_list_scrollbar'>
                                        <div class='menu_monitor_detail_app_log_row'>
                                            <div data-column='date_created' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('date_created')}'>
                                                DATE
                                            </div>
                                            <div data-column='server_http_host' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('server_http_host')}'>
                                                HOST
                                            </div>
                                            <div  data-column='app_id' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                                APP ID
                                            </div>
                                            <div data-column='app_module' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('app_module')}'>
                                                MODULE
                                            </div>
                                            <div data-column='app_module_type' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('app_module_type')}'>
                                                MODULE TYPE
                                            </div>
                                            <div data-column='app_module_request' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('app_module_request')}'>
                                                MODULE REQUEST
                                            </div>
                                            <div data-column='app_module_result' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('app_module_result')}'>
                                                MODULE RESULT
                                            </div>
                                            <div data-column='app_user_id' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('app_user_id')}'>
                                                USER ID
                                            </div>
                                            <div data-column='server_remote_addr' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('server_remote_addr')}'>
                                                IP
                                            </div>
                                            <div data-column='client_latitude' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('client_latitude')}'>
                                                GPS LAT
                                            </div>
                                            <div data-column='client_longitude' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('client_longitude')}'>
                                                GPS LONG
                                            </div>
                                            <div data-column='user_language' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('user_language')}'>
                                                USER LANGUAGE
                                            </div>
                                            <div data-column='user_timezone' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('user_timezone')}'>
                                                USER TIMEZONE
                                            </div>
                                            <div data-column='user_number_system' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('user_number_system')}'>
                                                USER NUMBER_SYSTEM
                                            </div>
                                            <div data-column='user_platform' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('user_platform')}'>
                                                USER PLATFORM
                                            </div>
                                            <div data-column='server_user_agent' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('server_user_agent')}'>
                                                USER AGENT
                                            </div>
                                            <div data-column='http_accept_language' class='menu_monitor_detail_app_log_col list_sort_click list_title ${props.function_get_order_by('http_accept_language')}'>
                                                ACCEPT LANGUAGE
                                            </div>
                                        </div>
                                        ${props.logs.map((/**@type{{date_created:string,
                                                                    server_http_host:string,
                                                                    app_id:number,
                                                                    app_module:string,
                                                                    app_module_type:string,
                                                                    app_module_request:string,
                                                                    app_module_result:string,
                                                                    app_user_id:number,
                                                                    server_remote_addr:string,
                                                                    client_latitude:string,
                                                                    client_longitude:string,
                                                                    user_language:string
                                                                    user_timezone:string
                                                                    user_number_system:string,
                                                                    user_platform:string,
                                                                    server_user_agent:string,
                                                                    server_http_accept_language:string
                                                                    }}*/log)=>
                                            `<div class='menu_monitor_detail_app_log_row'>
                                                <div class='menu_monitor_detail_app_log_col'>
                                                    ${log.date_created}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.server_http_host}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col'>
                                                    ${log.app_id}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col'>
                                                    ${log.app_module}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col'>
                                                    ${log.app_module_type}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.app_module_request}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.app_module_result}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col'>
                                                    ${log.app_user_id}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col'>
                                                    ${log.server_remote_addr.replace('::ffff:','')}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col gps_click'
                                                    data-latitude='${log.client_latitude ?? ''}'
                                                    data-longitude='${log.client_longitude ?? ''}'>
                                                    ${log.client_latitude ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col gps_click'
                                                    data-latitude='${log.client_latitude ?? ''}'
                                                    data-longitude='${log.client_longitude ?? ''}'>
                                                    ${log.client_longitude ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.user_language}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.user_timezone}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.user_number_system}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.user_platform}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.server_user_agent}
                                                </div>
                                                <div class='menu_monitor_detail_app_log_col common_wide_list_column'>
                                                    ${log.server_http_accept_language}
                                                </div>
                                            </div>`
                                            ).join('')
                                        }
                                    </div>
                                </div>`:
                                ''
                            }
                            ${props.monitor_detail=='SERVER_LOG'?
                                `<div id='menu_monitor_detail_server_log_form'>
                                    <div id='menu_monitor_detail_select_logscope'></div>
                                    <div id='menu_monitor_detail_filesearch' class='common_dialogue_button common_icon'></div>
                                    <div id='menu_monitor_detail_parameters_row'>
                                        <div class='menu_monitor_detail_parameters_row_col'>
                                            <div id='menu_monitor_detail_parameters_row_col1' class='common_icon'></div>
                                            ${(props.SERVICE_LOG_DATA_PARAMETERS.REQUEST_LEVEL==1 ||props.SERVICE_LOG_DATA_PARAMETERS.REQUEST_LEVEL==2)?
                                                '<div id=\'menu_monitor_detail_parameters_row_col1_1\' class=\'common_icon\'></div>':
                                                '<div id=\'menu_monitor_detail_parameters_row_col1_0\' class=\'common_icon\'></div>'
                                            }
                                        </div>
                                        <div class='menu_monitor_detail_parameters_row_col'>
                                            <div id='menu_monitor_detail_parameters_row_col2' class='common_icon'></div>
                                            ${(props.SERVICE_LOG_DATA_PARAMETERS.SERVICE_LEVEL==1 || props.SERVICE_LOG_DATA_PARAMETERS.SERVICE_LEVEL==2)?
                                                '<div id=\'menu_monitor_detail_parameters_row_col2_1\' class=\'common_icon\'></div>':
                                                '<div id=\'menu_monitor_detail_parameters_row_col2_0\' class=\'common_icon\'></div>'
                                            }
                                        </div>
                                        <div class='menu_monitor_detail_parameters_row_col'>
                                            <div id='menu_monitor_detail_parameters_row_col3' class='common_icon'></div>
                                            ${(props.SERVICE_LOG_DATA_PARAMETERS.DB_LEVEL==1 || props.SERVICE_LOG_DATA_PARAMETERS.DB_LEVEL==2)?
                                                '<div id=\'menu_monitor_detail_parameters_row_col3_1\' class=\'common_icon\'></div>':
                                                '<div id=\'menu_monitor_detail_parameters_row_col3_0\' class=\'common_icon\'></div>'
                                            }
                                        </div>
                                    </div>
                                    <div class='list_search'>
                                        <div id='menu_monitor_detail_server_log_search_input' contentEditable='true' class='common_input list_search_input'/></div>
                                        <div id='menu_monitor_detail_server_log_search_icon' class='list_search_icon common_icon'></div>
                                    </div>
                                </div>
                                <div id='menu_monitor_detail_server_log' class='common_list_scrollbar'></div>`:
                                ''
                            }`;
/**
 * @name component
 * @description Component
 * @function 
 * @param {{ data:       {
 *                       commonMountdiv:string,
 *                       app_id:number,
 *                       monitor_detail:'CONNECTED'|'APP_LOG'|'SERVER_LOG',
 *                       offset:number,
 *                       sort:string,
 *                       order_by:string,
 *                       page:number|null,
 *                       page_last:number|null,
 *                       service_socket_client_ID:number,
 *                       LIMIT:number,
 *                       SERVICE_LOG_FILE_INTERVAL:string,
 *                       SERVICE_LOG_DATA:{parameters:{  SCOPE_REQUEST:string,
 *                                                       SCOPE_SERVER:string, 
 *                                                       SCOPE_SERVICE:string,
 *                                                       SCOPE_APP:string,
 *                                                       SCOPE_DB:string,
 *                                                       REQUEST_LEVEL:number,
 *                                                       SERVICE_LEVEL:number,
 *                                                       DB_LEVEL:number,
 *                                                       APP_LEVEL:number,
 *                                                       LEVEL_VERBOSE:string 
 *                                                       LEVEL_ERROR:string
 *                                                       LEVEL_INFO:string,
 *                                                       FILE_INTERVAL:string
 *                                                    },
 *                                       logscope_level_options:{log_scope:string, log_level:string}[]}
 *                       },
 *           methods:    {
 *                       COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       monitorShow:function,
 *                       map_update:CommonModuleCommon['COMMON_GLOBAL']['moduleLeaflet']['methods']['map_update'],
 *                       appSecureDialogueSendBroadcastShow:appSecureDialogueSendBroadcastShow,
 *                       commonMiscElementRow:CommonModuleCommon['commonMiscElementRow'],
 *                       commonLovClose:CommonModuleCommon['commonLovClose'],
 *                       commonLovShow:CommonModuleCommon['commonLovShow'],
 *                       commonMiscInputControl:CommonModuleCommon['commonMiscInputControl'],
 *                       commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                       commonWindowUserAgentPlatform:CommonModuleCommon['commonWindowUserAgentPlatform'],
 *                       commonMiscRoundOff:CommonModuleCommon['commonMiscRoundOff'],
 *                       commonFFB:CommonModuleCommon['commonFFB']
 *                       },
 *           lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:    null,
 *                      methods: {
 *                               monitorDetailPage:function,
 *                               monitorDetailShowServerLog:function,
 *                               monitorDetailShowLogDir:function,
 *                               monitorDetailClickSort:function,
 *                               monitorDetailClickItem:function
 *                               },
 *                      template:string}>}
 */
const component = async props => {
    
    /**
     * Returns query
     * @param {string} list_detail
     * @param {number} offset
     * @param {string} sort
     * @param {string} order_by
     * @returns {string}
     */
    const get_query = (list_detail, offset, sort, order_by) =>{
        const app_id = props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_app .common_select_dropdown_value').getAttribute('data-value'); 
        const year = props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_year .common_select_dropdown_value').getAttribute('data-value');
        const month = props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_month .common_select_dropdown_value').getAttribute('data-value');
        const day  = props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_day .common_select_dropdown_value').getAttribute('data-value');
        
        switch (list_detail){
            case 'CONNECTED':
            case 'APP_LOG':{
                props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_app').style.display = 'inline-block';
                //search month + 1 for CONNECTED
                return `select_app_id=${app_id}&year=${year}&month=${month}&day=${day}&sort=${sort}&order_by=${order_by}&offset=${offset}&limit=${props.data.LIMIT}`;
            }
            case 'SERVER_LOG':{
                //search default logscope REQUEST and loglevel INFO
                const logscope = props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logscope .common_select_dropdown_value').getAttribute('data-value').split('-')[0];
                const loglevel = props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logscope .common_select_dropdown_value').getAttribute('data-value').split('-')[1];
                let app_id_filter='';
                if (logscope=='APP' || logscope=='SERVICE' || logscope=='DB'){
                    //show app filter and use it
                    props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_app').style.display = 'inline-block';
                    app_id_filter = `select_app_id=${app_id}&`;
                }
                else{
                    //no app filter for request
                    props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_app').style.display = 'none';
                    app_id_filter = 'select_app_id=&';
                }
                let url_parameters;

                if (props.data.SERVICE_LOG_FILE_INTERVAL=='1M')
                    url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}`;
                else
                    url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&day=${day}`;
                return `${url_parameters}&sort=${sort}&order_by=${order_by}&offset=${offset}&limit=${props.data.LIMIT}`;
                
            }
            default:{
                return '';
            }
        }
    };
    //use page navigation values or 1 if component with new query
    let page =      props.data.page?props.data.page:1;
    let page_last=  props.data.page_last?props.data.page_last:1;

    let path = '';
    
    switch (props.data.monitor_detail){
        case 'CONNECTED':{
            path = '/server-socket/socket';
            break;
        }
        case 'APP_LOG':{
            path = '/server-db_admin/app_data_stat-log';
            break;
        }
    }
    //fetch logs except for SERVER_LOG
    const logs = props.data.monitor_detail=='SERVER_LOG'?[]:await props.methods.commonFFB({path:path, query:get_query(props.data.monitor_detail, props.data.offset, props.data.sort, props.data.order_by), method:'GET', authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result));
    if (props.data.monitor_detail=='APP_LOG'||props.data.monitor_detail=='CONNECTED'){
        page_last = logs.rows.length>0?(Math.ceil(logs.page_header.total_count/props.data.LIMIT)):0;
        props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page').textContent = page; 
        props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_last').textContent = page_last;
        props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_total_count').textContent = logs.page_header.total_count;
    }
        

    /**
     * Page navigation
     * @param {string} item 
     * @returns {void}
     */
    const monitorDetailPage = (item) => {
        /**
         * Get column sort
         * @param {number} order_by 
         * @returns{'asc'|'desc'|string}
         */
        const get_sort = (order_by=0) => {
            const sort = '';
            if (props.data.monitor_detail=='APP_LOG')
                for (const col_title of props.methods.COMMON_DOCUMENT.querySelectorAll('#menu_monitor_detail_app_log .list_title')){
                    if (col_title.classList.contains('asc'))
                        if (order_by==0)
                            return col_title.id.substring(col_title.id.indexOf('col_title_')+'col_title_'.length);
                        else
                            return 'asc';
                    if (col_title.classList.contains('desc'))
                        if (order_by==0)
                            return col_title.id.substring(col_title.id.indexOf('col_title_')+'col_title_'.length);
                        else
                            return 'desc';
                }
            if (props.data.monitor_detail=='CONNECTED' || props.data.monitor_detail=='SERVER_LOG')
                for (const col_title of props.methods.COMMON_DOCUMENT.querySelectorAll(`#menu_monitor_detail_${props.data.monitor_detail.toLowerCase()} .list_title`)){
                    if (col_title.classList.contains('asc'))
                        if (order_by==0)
                                return col_title.getAttribute('data-column');
                        else
                            return 'asc';
                    if (col_title.classList.contains('desc'))
                        if (order_by==0)
                                return col_title.getAttribute('data-column');
                        else
                            return 'desc';
                }
                    
            return sort;
        };    
        let sort = get_sort();
        const order_by = get_sort(1);
        if (sort =='')
            sort = 'date_created';
        switch (item){
            case 'menu_monitor_pagination_first':{
                page = 1;
                break;
            }
            case 'menu_monitor_pagination_previous':{
                if (page - 1 < 1)
                    page = 1;
                else
                    page = page - 1;
                break;
            }
            case 'menu_monitor_pagination_next':{
                if (page + 1 > page_last)
                    page = page_last;
                else
                    page = page + 1;
                break;
            }
            case 'menu_monitor_pagination_last':{
                page = page_last;
                break;
            }
        }
        if (props.data.monitor_detail=='CONNECTED')
            props.methods.monitorShow('CONNECTED',  (page==1?0:page-1) * props.data.LIMIT, sort, order_by, page, page_last);
        if (props.data.monitor_detail=='APP_LOG')
            props.methods.monitorShow('APP_LOG',    (page==1?0:page-1) * props.data.LIMIT, sort, order_by, page, page_last);
        if (props.data.monitor_detail=='SERVER_LOG')
            monitorDetailShowServerLog(             (page==1?0:page-1) * props.data.LIMIT,props.data.sort, props.data.order_by);

        props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page').textContent = page; 
        props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_last').textContent = page_last;
    };
    /**
     * List sort click
     * @param {string} list 
     * @param {string} sortcolumn 
     * @param {string} order_by 
     * @returns {void}
     */
    const monitorDetailClickSort = (list, sortcolumn, order_by) => {
        switch (list){
            case 'menu_monitor_detail_app_log':{
                props.methods.monitorShow('APP_LOG', 0,  sortcolumn, order_by);
                break;
            }
            case 'menu_monitor_detail_connected':{
                props.methods.monitorShow('CONNECTED', 
                    '', 
                    sortcolumn,
                    order_by);
                break;
            }
            case 'menu_monitor_detail_server_log':{
                monitorDetailShowServerLog( 0, sortcolumn, order_by);
                break;
            }
        }
    };
    /**
     * List item click
     * @param {string} item_type 
     * @param {{ip:string,
     *          latitude:string,
     *          longitude:string,
     *          id:number}} data 
     * @returns {void}
     */
    const monitorDetailClickItem = (item_type, data) => {
        if (item_type=='GPS'){
            if (data['ip']){
                props.methods.commonFFB({path:'/geolocation/ip', query:data['ip'] != '::1'?`ip=${data['ip']}`:null, method: 'GET', authorization_type:'APP_DATA'})
                .then((/**@type{string}*/result)=>{
                    const geodata = JSON.parse(result);
                    props.methods.map_update({  longitude:geodata.geoplugin_longitude,
                                                latitude:geodata.geoplugin_latitude,
                                                text_place: geodata.geoplugin_city + ', ' +
                                                            geodata.geoplugin_regionName + ', ' +
                                                            geodata.geoplugin_countryName,
                                                country:'',
                                                city:'',
                                                timezone_text :null
                                            });
                })
                .catch(()=>null);
            }
            else{
                props.methods.commonFFB({path:'/geolocation/place', query:`latitude=${data['latitude']}&longitude=${data['longitude']}`, method:'GET', authorization_type:'APP_DATA'})
                .then((/**@type{string}*/result)=>{
                    /**@type{{geoplugin_place:string, geoplugin_region:string, geoplugin_countryCode:string}} */
                    const geodata = JSON.parse(result);
                    props.methods.map_update({  longitude:data['longitude'],
                                                latitude:data['latitude'],
                                                text_place: geodata.geoplugin_place + ', ' + 
                                                            geodata.geoplugin_region + ', ' + 
                                                            geodata.geoplugin_countryCode,
                                                country:'',
                                                city:'',
                                                timezone_text :null
                                            });
                })
                .catch(()=>null);
            }
        }
        else
            if (item_type=='CHAT'){
                props.methods.appSecureDialogueSendBroadcastShow('CHAT', data['id']);
            }
        
    };

    /**
     * Show existing logfiles
     * @returns {void}
     */
    const monitorDetailShowLogDir = () => {
        /**
         * Event for LOV
         * @param {CommonAppEvent} event 
         */
        const function_event = event => {
                                //format: 'LOGSCOPE_LOGLEVEL_20220101.log'
                                //logscope and loglevel
                                let filename = props.methods.commonMiscElementRow(event.target).getAttribute('data-value') ?? '';
                                const logscope = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                const loglevel = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                const year     = parseInt(filename.substring(0, 4));
                                const month    = parseInt(filename.substring(4, 6));
                                const day      = parseInt(filename.substring(6, 8));

                                //logscope and loglevel
                                props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logscope .common_select_dropdown_value').setAttribute('data-value', `${logscope}-${loglevel}`);
                                props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logscope .common_select_dropdown_value').textContent = `${logscope} - ${loglevel}`;
                                //year
                                props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_year .common_select_dropdown_value').setAttribute('data-value', year);
                                props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_year .common_select_dropdown_value').textContent = year;

                                //month
                                props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_month .common_select_dropdown_value').setAttribute('data-value', month);
                                props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_month .common_select_dropdown_value').textContent = month;
                                //day if applicable
                                if (props.data.SERVICE_LOG_FILE_INTERVAL=='1D'){
                                    props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_day .common_select_dropdown_value').setAttribute('data-value', day);
                                    props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_select_day .common_select_dropdown_value').textContent = day;
                                }
                                monitorDetailShowServerLog( 0, 'logdate', 'desc');
                                props.methods.commonLovClose();
                            };
        props.methods.commonLovShow({lov:'SERVER_LOG_FILES', function_event:function_event});
    };
    /**
     * Display server logs
     * @param {number} offset
     * @param {string} sort
     * @param {string} order_by
     */
    const monitorDetailShowServerLog = (offset, sort, order_by) =>{
        let search = props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_server_log_search_input').textContent;
        if (search != null){
            if (props.methods.commonMiscInputControl(null,{check_valid_list_elements:[[props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_server_log_search_input'),100]]})==false)
                return;
        }
        if(offset==0){
            page =1;
            page_last=1;
        }
        search=search?encodeURI(search):search;
        props.methods.commonComponentRender(
                {   mountDiv:'menu_monitor_detail_server_log',
                    data:{  
                                path:'/server-log/log',
                                query:`${get_query('SERVER_LOG', offset, sort, order_by)}&search=${search ?? ''}`,
                                token_type: 'ADMIN',
                                sort:sort,
                                order_by:order_by,
                                LIMIT:props.data.LIMIT
                    },
                    methods:{   commonMiscRoundOff:props.methods.commonMiscRoundOff,
                                commonFFB:props.methods.commonFFB},
                    path:'/component/menu_monitor_detail_server_log.js'})
                    .then(result=>{
                        page_last=result.data.page_last;
                        props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page').textContent = page; 
                        props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_last').textContent = page_last;
                        props.methods.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_total_count').textContent = result.data.total_count;
                    });
    };
   
    /**
     * Get order by if column matches
     * @param {string} column
     */
    const get_order_by = column =>column==props.data.sort?props.data.order_by:'';


    const onMounted = async () =>{
        if (props.data.monitor_detail=='SERVER_LOG'){
            //convert normalized arrary to options in array format
            /**@type{{VALUE:string, TEXT:string}[]} */
            const options = props.data.SERVICE_LOG_DATA.logscope_level_options.map((/**@type{{log_scope:string, log_level: string}}*/row)=>{
                                return {VALUE:`${row.log_scope}-${row.log_level}`, TEXT:`${row.log_scope} - ${row.log_level}`};});

            await props.methods.commonComponentRender({
                mountDiv:'menu_monitor_detail_select_logscope', 
                data:{ 
                            default_value:'REQUEST - INFO',
                            default_data_value:'REQUEST-INFO',
                            options:options,
                            path:'',
                            query:'',
                            method:'',
                            authorization_type:'',
                            column_value:'VALUE',
                            column_text:'TEXT'
                },
                methods:{  commonFFB:props.methods.commonFFB},
                path:       '/common/component/common_select.js'});
            monitorDetailShowServerLog(0,props.data.sort, props.data.order_by);
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {monitorDetailPage:monitorDetailPage,
                    monitorDetailShowServerLog:monitorDetailShowServerLog,
                    monitorDetailShowLogDir:monitorDetailShowLogDir,
                    monitorDetailClickSort:monitorDetailClickSort,
                    monitorDetailClickItem:monitorDetailClickItem
        },
        template:   template({  service_socket_client_ID:props.data.service_socket_client_ID,
                                monitor_detail:props.data.monitor_detail,
                                function_commonWindowUserAgentPlatform:props.methods.commonWindowUserAgentPlatform,
                                function_get_order_by:get_order_by,
                                function_roundOff: props.methods.commonMiscRoundOff,
                                logs:logs.rows,
                                SERVICE_LOG_DATA_PARAMETERS:props.data.SERVICE_LOG_DATA.parameters})
    };
};
export default component;