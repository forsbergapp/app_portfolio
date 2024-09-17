/**
 * @module apps/admin/component/menu_monitor_detail
 */
/**
 * Displays monitor
 * 
 * Connected
 *      list_connected          contains records
 * App log
 *      list_app_log            contains records
 *      list_app_pagination     contains page navigation buttons
 * Server log 
 *      list_server_log_form    contains log parameters and is mounted first so records knows what logscope is used
 *      list_server_log         contains records
 * 
 */
/**
 * @param {{spinner:string,
*          system_admin:string|null,
*          service_socket_client_ID:number,
*          monitor_detail:'CONNECTED'|'APP_LOG'|'SERVER_LOG',
*          function_getUserAgentPlatform:function,
*          function_role_icon_class:function,
*          function_get_order_by:function,
*          function_roundOff:function,
*          logs:[],
*          monitor_log_data:{   SCOPE_REQUEST:string,
*                               SCOPE_SERVER:string, 
*                               SCOPE_SERVICE:string,
*                               SCOPE_APP:string,
*                               SCOPE_DB:string,
*                               REQUEST_LEVEL:number,
*                               SERVICE_LEVEL:number,
*                               DB_LEVEL:number,
*                               LEVEL_VERBOSE:string,
*                               LEVEL_ERROR:string,
*                               LEVEL_INFO:string,
*                               FILE_INTERVAL:string}}} props
*/
const template = props => ` ${props.monitor_detail=='CONNECTED'?
                                `<div id='list_connected_form'>    
                                    <div id='list_connected' class='common_list_scrollbar ${props.spinner}'>
                                        <div class='list_connected_row'>
                                            <div data-column='id' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('id')}'>
                                                ID
                                            </div>
                                            <div data-column='connection_date' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('connection_date')}'>
                                                CONNECTION DATE
                                            </div>
                                            <div data-column='app_id' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                                APP ID
                                            </div>
                                            <div data-column='app_role_icon' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('app_role_icon')}'>
                                                ROLE
                                            </div>
                                            <div data-column='user_account_id' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('user_account_id')}'>
                                                USER ID
                                            </div>
                                            <div data-column='system_admin' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('system_admin')}'>
                                                SYSTEM ADMIN
                                            </div>
                                            <div data-column='ip' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('ip')}'>
                                                IP
                                            </div>
                                            <div data-column='gps_latitude' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('gps_latitude')}'>
                                                GPS LAT
                                            </div>
                                            <div data-column='gps_longitude' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('gps_longitude')}'>
                                                GPS LONG
                                            </div>
                                            <div data-column='place' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('place')}'>
                                                PLACE
                                            </div>
                                            <div data-column='timezone' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('timezone')}'>
                                                TIMEZONE
                                            </div>
                                            <div data-column='user_agent' class='list_connected_col list_sort_click list_title ${props.function_get_order_by('user_agent')}'>
                                                USER AGENT
                                            </div>
                                            <div data-column='broadcast' class='list_connected_col list_title ${props.function_get_order_by('broadcast')}'>
                                                BROADCAST
                                            </div>
                                        </div>
                                        ${props.logs.map((/**@type{{id:number,
                                                                    connection_date:string,
                                                                    app_id:number,
                                                                    system_admin:string,
                                                                    ip:string,
                                                                    app_role_id:number,
                                                                    app_role_icon:string,
                                                                    user_account_id:number,
                                                                    gps_latitude:string,
                                                                    gps_longitude:string,
                                                                    place:string,
                                                                    timezone:string,
                                                                    user_agent:string
                                                                    }}*/log)=>
                                            `<div class='list_connected_row ${log.id==props.service_socket_client_ID?'list_current_user_row':''}'>
                                                <div class='list_connected_col'>
                                                    ${log.id}
                                                </div>
                                                <div class='list_connected_col'>
                                                    ${log.connection_date}
                                                </div>
                                                <div class='list_connected_col'>
                                                    ${log.app_id}
                                                </div>
                                                <div class='list_connected_col ${props.function_role_icon_class(log.system_admin, log.app_role_id)}'>
                                                    ${log.system_admin!=''?'':log.app_role_icon}
                                                </div>
                                                <div class='list_connected_col'>
                                                    ${log.user_account_id ?? ''}
                                                </div>
                                                <div class='list_connected_col'>
                                                    ${log.system_admin}
                                                </div>
                                                <div class='list_connected_col'>
                                                    ${log.ip.replace('::ffff:','')}
                                                </div>
                                                <div class='list_connected_col gps_click' 
                                                    data-latitude='${log.gps_latitude ?? ''}'
                                                    data-longitude='${log.gps_longitude ?? ''}'>
                                                    ${log.gps_latitude ?? ''}
                                                </div>
                                                <div class='list_connected_col gps_click'
                                                    data-latitude='${log.gps_latitude ?? ''}'
                                                    data-longitude='${log.gps_longitude ?? ''}'>
                                                    ${log.gps_longitude ?? ''}
                                                </div>
                                                <div class='list_connected_col'>
                                                    ${log.place}
                                                </div>
                                                <div class='list_connected_col'>
                                                    ${log.timezone}
                                                </div>
                                                <div class='list_connected_col common_wide_list_column'>
                                                    ${props.function_getUserAgentPlatform(log.user_agent) ?? ''}
                                                </div>
                                                <div class='list_connected_col chat_click common_icon' data-id='${log.id}'></div>
                                            </div>`
                                            ).join('')
                                        }
                                    </div>
                                </div>`:
                                ''
                            }
                            ${props.monitor_detail=='APP_LOG'?`
                                <div id='list_app_log_form'>
                                    <div id='list_app_log' class='common_list_scrollbar ${props.spinner}'>
                                        <div class='list_app_log_row'>
                                            <div data-column='date_created' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('date_created')}'>
                                                DATE
                                            </div>
                                            <div data-column='server_http_host' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('server_http_host')}'>
                                                HOST
                                            </div>
                                            <div  data-column='app_id' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('app_id')}'>
                                                APP ID
                                            </div>
                                            <div data-column='app_module' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('app_module')}'>
                                                MODULE
                                            </div>
                                            <div data-column='app_module_type' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('app_module_type')}'>
                                                MODULE TYPE
                                            </div>
                                            <div data-column='app_module_request' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('app_module_request')}'>
                                                MODULE REQUEST
                                            </div>
                                            <div data-column='app_module_result' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('app_module_result')}'>
                                                MODULE RESULT
                                            </div>
                                            <div data-column='app_user_id' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('app_user_id')}'>
                                                USER ID
                                            </div>
                                            <div data-column='server_remote_addr' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('server_remote_addr')}'>
                                                IP
                                            </div>
                                            <div data-column='client_latitude' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('client_latitude')}'>
                                                GPS LAT
                                            </div>
                                            <div data-column='client_longitude' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('client_longitude')}'>
                                                GPS LONG
                                            </div>
                                            <div data-column='user_language' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('user_language')}'>
                                                USER LANGUAGE
                                            </div>
                                            <div data-column='user_timezone' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('user_timezone')}'>
                                                USER TIMEZONE
                                            </div>
                                            <div data-column='user_number_system' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('user_number_system')}'>
                                                USER NUMBER_SYSTEM
                                            </div>
                                            <div data-column='user_platform' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('user_platform')}'>
                                                USER PLATFORM
                                            </div>
                                            <div data-column='server_user_agent' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('server_user_agent')}'>
                                                USER AGENT
                                            </div>
                                            <div data-column='http_accept_language' class='list_app_log_col list_sort_click list_title ${props.function_get_order_by('http_accept_language')}'>
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
                                            `<div class='list_app_log_row'>
                                                <div class='list_app_log_col'>
                                                    ${log.date_created}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.server_http_host}
                                                </div>
                                                <div class='list_app_log_col'>
                                                    ${log.app_id}
                                                </div>
                                                <div class='list_app_log_col'>
                                                    ${log.app_module}
                                                </div>
                                                <div class='list_app_log_col'>
                                                    ${log.app_module_type}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.app_module_request}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.app_module_result}
                                                </div>
                                                <div class='list_app_log_col'>
                                                    ${log.app_user_id}
                                                </div>
                                                <div class='list_app_log_col'>
                                                    ${log.server_remote_addr.replace('::ffff:','')}
                                                </div>
                                                <div class='list_app_log_col gps_click'
                                                    data-latitude='${log.client_latitude ?? ''}'
                                                    data-longitude='${log.client_longitude ?? ''}'>
                                                    ${log.client_latitude ?? ''}
                                                </div>
                                                <div class='list_app_log_col gps_click'
                                                    data-latitude='${log.client_latitude ?? ''}'
                                                    data-longitude='${log.client_longitude ?? ''}'>
                                                    ${log.client_longitude ?? ''}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.user_language}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.user_timezone}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.user_number_system}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.user_platform}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.server_user_agent}
                                                </div>
                                                <div class='list_app_log_col common_wide_list_column'>
                                                    ${log.server_http_accept_language}
                                                </div>
                                            </div>`
                                            ).join('')
                                        }
                                    </div>
                                    <div id='list_app_pagination'>
                                        <div id='list_app_log_first' class='common_icon'></div>
                                        <div id='list_app_log_previous' class='common_icon'></div>
                                        <div id='list_app_log_next' class='common_icon'></div>
                                        <div id='list_app_log_last' class='common_icon'></div>
                                    </div>
                                </div>`:
                                ''
                            }
                            ${props.monitor_detail=='SERVER_LOG'?
                                `<div id='list_server_log_form' class='${props.spinner}'>
                                    ${props.spinner==''?
                                        `<div id='select_logscope5'></div>
                                        <div id='filesearch_menu5' class='common_dialogue_button common_icon'></div>
                                        <div id='menu5_row_parameters'>
                                            <div class='menu5_row_parameters_col'>
                                                <div id='menu5_row_parameters_col1' class='common_icon'></div>
                                                ${(props.monitor_log_data.REQUEST_LEVEL==1 ||props.monitor_log_data.REQUEST_LEVEL==2)?
                                                    '<div id=\'menu5_row_parameters_col1_1\' class=\'common_icon\'></div>':
                                                    '<div id=\'menu5_row_parameters_col1_0\' class=\'common_icon\'></div>'
                                                }
                                            </div>
                                            <div class='menu5_row_parameters_col'>
                                                <div id='menu5_row_parameters_col2' class='common_icon'></div>
                                                ${(props.monitor_log_data.SERVICE_LEVEL==1 || props.monitor_log_data.SERVICE_LEVEL==2)?
                                                    '<div id=\'menu5_row_parameters_col2_1\' class=\'common_icon\'></div>':
                                                    '<div id=\'menu5_row_parameters_col2_0\' class=\'common_icon\'></div>'
                                                }
                                            </div>
                                            <div class='menu5_row_parameters_col'>
                                                <div id='menu5_row_parameters_col3' class='common_icon'></div>
                                                ${(props.monitor_log_data.DB_LEVEL==1 || props.monitor_log_data.DB_LEVEL==2)?
                                                    '<div id=\'menu5_row_parameters_col3_1\' class=\'common_icon\'></div>':
                                                    '<div id=\'menu5_row_parameters_col3_0\' class=\'common_icon\'></div>'
                                                }
                                            </div>
                                        </div>
                                        <div class='list_search'>
                                            <div id='list_server_log_search_input' contentEditable='true' class='common_input list_search_input'/></div>
                                            <div id='list_server_log_search_icon' class='list_search_icon common_icon'></div>
                                        </div>
                                        <div id='list_server_log' class='common_list_scrollbar css_spinner'></div>`:''
                                    }
                                </div>
                                `:''
                            }`;
                            
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          app_id:number,
*          system_admin:string,
*          monitor_detail:'CONNECTED'|'APP_LOG'|'SERVER_LOG',
*          query:string,
*          sort:string,
*          order_by:string,
*          service_socket_client_ID:number,
*          limit:number,
*          function_input_control:function,
*          function_ComponentRender:function,
*          function_getUserAgentPlatform:function,
*          function_get_log_parameters:function,
*          function_show_app_log:function,
*          function_roundOff:function,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:{function_page_navigation:function, function_monitor_detail_server_log:function},
*                      template:string}>}
*/
const component = async props => {
    let token_type = '';
    let path = '';
    let page = 0;
    let page_last= 0;
    let service_log_file_interval = '';
    switch (props.monitor_detail){
        case 'CONNECTED':{
            if (props.system_admin!=null){
                path = '/server-socket/socket';
                token_type = 'SYSTEMADMIN';
            }
            else{
                path = '/server-socket/socket';
                token_type = 'APP_ACCESS';
            }
            break;
        }
        case 'APP_LOG':{
            path = '/server-db_admin/app_data_stat-log';
            token_type = 'APP_ACCESS';
            break;
        }
        case 'SERVER_LOG':{
            path = '/server-log/log';
            token_type = 'SYSTEMADMIN';
            break;
        }
    }
    /**
     * @param {string} system_admin
     * @param {number|null} app_role_id
     * @returns {string}
     */
    const role_icon_class =(system_admin, app_role_id) =>{
        if (system_admin!='')
            return 'app_role_system_admin common_icon';
        else
            switch (app_role_id){
                case 0:{
                    return 'app_role_superadmin';
                }
                case 1:{
                    return 'app_role_admin';
                }
                default:{
                    return 'app_role_user';
                }
            }
        };
    /**
     * Get order by if column matches
     * @param {string} column
     */
    const get_order_by = column =>column==props.sort?props.order_by:'';

    /**
     * Get column sort
     * @param {number} order_by 
     * @returns{'asc'|'desc'|string}
     */
    const get_sort = (order_by=0) => {
        const sort = '';
        for (const col_title of props.common_document.querySelectorAll('#list_app_log .list_title')){
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
        return sort;
    };

    /**
     * Page navigation
     * @param {string} item 
     * @returns {void}
     */
    const page_navigation = (item) => {
        
        let sort = get_sort();
        const order_by = get_sort(1);
        if (sort =='')
            sort = 'date_created';
        switch (item){
            case 'list_app_log_first':{
                page = 0;
                props.function_show_app_log(sort, order_by, 0);
                break;
            }
            case 'list_app_log_previous':{
                page = page - props.limit;
                if (page - props.limit < 0)
                    page = 0;
                else
                    page = page - props.limit;
                props.function_show_app_log(sort, order_by, page);
                break;
            }
            case 'list_app_log_next':{
                if (page + props.limit > page_last)
                    page = page_last;
                else
                    page = page + props.limit;
                props.function_show_app_log(sort, order_by, page);
                break;
            }
            case 'list_app_log_last':{
                page = page_last;
                props.function_show_app_log(sort, order_by, page);
                break;
            }
        }
    };
    const get_query = ()=>{
        const app_id = props.common_document.querySelector('#select_app_menu5 .common_select_dropdown_value').getAttribute('data-value'); 
        const year = props.common_document.querySelector('#select_year_menu5 .common_select_dropdown_value').getAttribute('data-value');
        const month = props.common_document.querySelector('#select_month_menu5 .common_select_dropdown_value').getAttribute('data-value');
        const day  = props.common_document.querySelector('#select_day_menu5 .common_select_dropdown_value').getAttribute('data-value');
        
        switch (props.monitor_detail){
            case 'CONNECTED':
            case 'APP_LOG':{
                props.common_document.querySelector('#select_app_menu5').style.display = 'inline-block';
                //search month + 1 for CONNECTED
                return `select_app_id=${app_id}&year=${year}&month=${props.monitor_detail=='CONNECTED'?Number(month)+1:month}&day=${day}&sort=${props.sort}&order_by=${props.order_by}${props.query}&limit=${props.limit}`;
            }
            case 'SERVER_LOG':{
                //search default logscope REQUEST and loglevel INFO
                const logscope = props.common_document.querySelector('#select_logscope5 .common_select_dropdown_value').getAttribute('data-value').split('-')[0];
                const loglevel = props.common_document.querySelector('#select_logscope5 .common_select_dropdown_value').getAttribute('data-value').split('-')[1];
                let app_id_filter='';
                if (logscope=='APP' || logscope=='SERVICE' || logscope=='SERVER-DB'){
                    //show app filter and use it
                    props.common_document.querySelector('#select_app_menu5').style.display = 'inline-block';
                    app_id_filter = `select_app_id=${app_id}&`;
                }
                else{
                    //no app filter for request
                    props.common_document.querySelector('#select_app_menu5').style.display = 'none';
                    app_id_filter = 'select_app_id=&';
                }
                let url_parameters;

                if (service_log_file_interval=='1M')
                    url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}`;
                else
                    url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&day=${day}`;
                return `${url_parameters}&sort=${props.sort}&order_by=${props.order_by}&limit=${props.limit}`;
                
            }
        }
    };
    /**
     * Display server logs
     * @param {string} sort
     * @param {string} order_by
     */
    const monitor_detail_server_log = (sort, order_by) =>{
        let search = props.common_document.querySelector('#list_server_log_search_input').innerText;
        if (search != null){
            if (props.function_input_control(null,{check_valid_list_elements:[[props.common_document.querySelector('#list_server_log_search_input'),100]]})==false)
                return;
        }
        search=search?encodeURI(search):search;
        props.function_ComponentRender('list_server_log', 
            {system_admin:props.system_admin,
             path:path,
             query:`${get_query()}&search=${search ?? ''}`,
             token_type: token_type,
             sort:sort,
             order_by:order_by,
             function_roundOff:props.function_roundOff,
             function_FFB:props.function_FFB}, '/component/menu_monitor_detail_server_log.js');
    };
    const post_component = async () =>{
        //fetch log parameter data if SERVER_LOG
        const monitor_log_data = props.monitor_detail=='SERVER_LOG'?
                                    await props.function_get_log_parameters():{ parameters:{SCOPE_REQUEST:'',
                                                                                            SCOPE_SERVER:'', 
                                                                                            SCOPE_SERVICE:'',
                                                                                            SCOPE_APP:'',
                                                                                            SCOPE_DB:'',
                                                                                            REQUEST_LEVEL:0,
                                                                                            SERVICE_LEVEL:0,
                                                                                            DB_LEVEL:0,
                                                                                            LEVEL_VERBOSE:'',
                                                                                            LEVEL_ERROR:'',
                                                                                            LEVEL_INFO:'',
                                                                                            FILE_INTERVAL:''},
                                                                                logscope_level_options:
                                    ''};
        //save value for query
        service_log_file_interval = monitor_log_data.parameters.FILE_INTERVAL ?? '';
        //fetch logs except for SERVER_LOG
        const logs = props.monitor_detail=='SERVER_LOG'?[]:await props.function_FFB(path, get_query(), 'GET', token_type, null).then((/**@type{string}*/result)=>JSON.parse(result).rows);
        const limit = await props.function_FFB(`/server-config/config-apps/${props.app_id}`, 'key=PARAMETERS', 'GET', props.system_admin!=null?'SYSTEMADMIN':'APP_ACCESS', null)
                            .then((/**@type{string}*/result)=>parseInt(JSON.parse(result)[0].PARAMETERS.filter((/**@type{{APP_LIMIT_RECORDS:number}}*/parameter)=>parameter.APP_LIMIT_RECORDS)[0].APP_LIMIT_RECORDS));
        if (props.monitor_detail=='APP_LOG')
            page_last = logs.length>0?(Math.floor(logs[0].total_rows/limit) * limit):0;

        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({  spinner:  '',
                                                                                                        system_admin:props.system_admin, 
                                                                                                        service_socket_client_ID:props.service_socket_client_ID,
                                                                                                        monitor_detail:props.monitor_detail,
                                                                                                        function_getUserAgentPlatform:props.function_getUserAgentPlatform,
                                                                                                        function_role_icon_class:role_icon_class,
                                                                                                        function_get_order_by:get_order_by,
                                                                                                        function_roundOff: props.function_roundOff,
                                                                                                        logs:logs,
                                                                                                        monitor_log_data:monitor_log_data.parameters});

        //mount list_server_log to outerHTML removing spinner class if SERVER_LOG
        if (props.monitor_detail=='SERVER_LOG'){
            //convert normalized arrary to options in array format
            /**@type{[{VALUE:string, TEXT:string}]} */
            const options = monitor_log_data.logscope_level_options.map((/**@type{{log_scope:string, log_level: string}}*/row)=>{
                                return {VALUE:`${row.log_scope}-${row.log_level}`, TEXT:`${row.log_scope} - ${row.log_level}`};});

            await props.function_ComponentRender('select_logscope5', 
                {
                    default_value:'REQUEST - INFO',
                    default_data_value:'REQUEST-INFO',
                    options:options,
                    path:'',
                    query:'',
                    method:'',
                    authorization_type:'',
                    column_value:'VALUE',
                    column_text:'TEXT',
                    function_FFB:props.function_FFB
                }, '/common/component/select.js');
            monitor_detail_server_log(props.sort, props.order_by);
        }
            
            
    };
    /**
     * @param {{   spinner:string,
     *             system_admin:string|null,
     *             service_socket_client_ID:number,
     *             monitor_detail:'CONNECTED'|'APP_LOG'|'SERVER_LOG',
     *             function_getUserAgentPlatform:function,
     *             function_role_icon_class:function,
     *             function_get_order_by:function,
     *             function_roundOff:function,
     *             logs:[],
     *             monitor_log_data:{  SCOPE_REQUEST:string,
     *                                             SCOPE_SERVER:string, 
     *                                             SCOPE_SERVICE:string,
     *                                             SCOPE_APP:string,
     *                                             SCOPE_DB:string,
     *                                             REQUEST_LEVEL:number,
     *                                             SERVICE_LEVEL:number,
     *                                             DB_LEVEL:number,
     *                                             LEVEL_VERBOSE:string,
     *                                             LEVEL_ERROR:string,
     *                                             LEVEL_INFO:string,
     *                                             FILE_INTERVAL:string}}} template_props
     */
    const render_template = template_props =>{
        return template({   spinner:template_props.spinner,
                            system_admin:template_props.system_admin,
                            service_socket_client_ID:template_props.service_socket_client_ID,
                            monitor_detail:template_props.monitor_detail,
                            function_getUserAgentPlatform:template_props.function_getUserAgentPlatform,
                            function_role_icon_class:role_icon_class,
                            function_get_order_by:get_order_by,
                            function_roundOff:props.function_roundOff,
                            logs:template_props.logs,
                            monitor_log_data:template_props.monitor_log_data
        });
    };
    return {
        props:  {function_post:post_component},
        data:   {function_page_navigation:page_navigation,
                 function_monitor_detail_server_log:monitor_detail_server_log
        },
        template: render_template({ spinner:'css_spinner', 
                                    system_admin:props.system_admin, 
                                    service_socket_client_ID:props.service_socket_client_ID,
                                    monitor_detail:props.monitor_detail,
                                    function_getUserAgentPlatform:props.function_getUserAgentPlatform,
                                    function_role_icon_class:role_icon_class,
                                    function_get_order_by:get_order_by,
                                    function_roundOff:props.function_roundOff,
                                    logs:[],
                                    monitor_log_data:{  SCOPE_REQUEST:'',
                                                        SCOPE_SERVER:'', 
                                                        SCOPE_SERVICE:'',
                                                        SCOPE_APP:'',
                                                        SCOPE_DB:'',
                                                        REQUEST_LEVEL:0,
                                                        SERVICE_LEVEL:0,
                                                        DB_LEVEL:0,
                                                        LEVEL_VERBOSE:'',
                                                        LEVEL_ERROR:'',
                                                        LEVEL_INFO:'',
                                                        FILE_INTERVAL:''}})
    };
};
export default component;