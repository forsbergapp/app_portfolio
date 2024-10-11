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
 * @param {{
 *          system_admin:string|null,
 *          service_socket_client_ID:number,
 *          monitor_detail:'CONNECTED'|'APP_LOG'|'SERVER_LOG',
 *          function_commonWindowUserAgentPlatform:function,
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
                                    <div id='list_connected' class='common_list_scrollbar'>
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
                                                    ${props.function_commonWindowUserAgentPlatform(log.user_agent) ?? ''}
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
                                    <div id='list_app_log' class='common_list_scrollbar'>
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
                                `<div id='list_server_log_form'>
                                    <div id='select_logscope5'></div>
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
                                    <div id='list_server_log' class='common_list_scrollbar'></div>
                                </div>`:
                                ''
                            }`;
/**
* 
* @param {{ data:       {
*                       commonMountdiv:string,
*                       app_id:number,
*                       system_admin:string,
*                       monitor_detail:'CONNECTED'|'APP_LOG'|'SERVER_LOG',
*                       sort:string,
*                       order_by:string,
*                       service_socket_client_ID:number,
*                       limit:number,
*                       logs:[],
*                       monitor_log_data:{parameters:{  SCOPE_REQUEST:string,
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
*                       COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
*                       monitorDetailShowServerLog:function,
*                       commonInputControl:import('../../../common_types.js').CommonModuleCommon['commonInputControl'],
*                       commonComponentRender:import('../../../common_types.js').CommonModuleCommon['commonComponentRender'],
*                       commonWindowUserAgentPlatform:import('../../../common_types.js').CommonModuleCommon['commonWindowUserAgentPlatform'],
*                       commonRoundOff:import('../../../common_types.js').CommonModuleCommon['commonRoundOff'],
*                       commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']
*                       },
*           lifecycle:  null}} props 
* @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
*                      data:    null,
*                      methods: null,
*                      template:string}>}
*/
const component = async props => {

   
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
    const get_order_by = column =>column==props.data.sort?props.data.order_by:'';


    const onMounted = async () =>{
        if (props.data.monitor_detail=='SERVER_LOG'){
            //convert normalized arrary to options in array format
            /**@type{{VALUE:string, TEXT:string}[]} */
            const options = props.data.monitor_log_data.logscope_level_options.map((/**@type{{log_scope:string, log_level: string}}*/row)=>{
                                return {VALUE:`${row.log_scope}-${row.log_level}`, TEXT:`${row.log_scope} - ${row.log_level}`};});

            await props.methods.commonComponentRender({
                mountDiv:'select_logscope5', 
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
            props.methods.monitorDetailShowServerLog(props.data.sort, props.data.order_by);
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({  system_admin:props.data.system_admin, 
                                service_socket_client_ID:props.data.service_socket_client_ID,
                                monitor_detail:props.data.monitor_detail,
                                function_commonWindowUserAgentPlatform:props.methods.commonWindowUserAgentPlatform,
                                function_role_icon_class:role_icon_class,
                                function_get_order_by:get_order_by,
                                function_roundOff: props.methods.commonRoundOff,
                                logs:props.data.logs,
                                monitor_log_data:props.data.monitor_log_data.parameters})
    };
};
export default component;