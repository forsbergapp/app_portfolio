/**
 * @module apps/admin/component/menu_monitor
 */
/**
 * Displays config
 * 
 */
/**
 * @param {{system_admin:string|null}} props
 */
const template = props => `<div id='menu_5_content_widget1' class='widget'>
                                <div id='list_monitor_nav' class='list_nav'>
                                    <div id='list_monitor_nav_connected' class='list_nav_list list_button common_icon'></div>
                                    ${props.system_admin==null?'<div id=\'list_monitor_nav_app_log\' class=\'list_nav_list list_button common_icon\'></div>':''}
                                    ${props.system_admin!=null?'<div id=\'list_monitor_nav_server_log\' class=\'list_nav_list list_button common_icon\'></div>':''}
                                </div>
                                <div id='list_row_sample'>
                                    <div id='select_app_menu5'></div>
                                    <div id='select_year_menu5'></div>
                                    <div id='select_month_menu5'></div>
                                    <div id='select_day_menu5'></div>
                                </div>
                                <div id='list_monitor'></div>
                            </div>
                            <div id='menu_5_content_widget2' class='widget'>
                                <div id='mapid'></div>
                            </div>`;
/**
 * 
 * @param {{data:{      commonMountdiv:string,
 *                      app_id:number,
 *                      system_admin:string,
 *                      system_admin_only:number,
 *                      service_socket_client_ID: number,
 *                      client_latitude:string,
 *                      client_longitude:string,
 *                      client_place:string},
 *          methods:{   COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      show_broadcast_dialogue:import('../js/secure.js')['show_broadcast_dialogue'], 
 *                      map_update:import('../../../common_types.js').CommonModuleCommon['COMMON_GLOBAL']['moduleLeaflet']['methods']['map_update'],
 *                      commonModuleLeafletInit:import('../../../common_types.js').CommonModuleCommon['commonModuleLeafletInit'],
 *                      commonElementRow:import('../../../common_types.js').CommonModuleCommon['commonElementRow'],
 *                      commonInputControl:import('../../../common_types.js').CommonModuleCommon['commonInputControl'],
 *                      commonComponentRender:import('../../../common_types.js').CommonModuleCommon['commonComponentRender'],
 *                      commonWindowUserAgentPlatform:import('../../../common_types.js').CommonModuleCommon['commonWindowUserAgentPlatform'],
 *                      commonRoundOff:import('../../../common_types.js').CommonModuleCommon['commonRoundOff'],
 *                      commonLovClose:import('../../../common_types.js').CommonModuleCommon['commonLovClose'],
 *                      commonLovShow:import('../../../common_types.js').CommonModuleCommon['commonLovShow'],
 *                      commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']}}} props 
 * @returns {Promise.<{ lifecycle:  import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:       {service_log_file_interval:string},
 *                      methods:    {monitorShow:                monitorShow,
 *                                   monitorDetailShowLogDir:    monitorDetailShowLogDir,
 *                                   monitorDetailShowServerLog: monitorDetailShowServerLog,
 *                                   monitorDetailPage:          monitorDetailPage,
 *                                   monitorDetailClickSort:     monitorDetailClickSort,
 *                                   monitorDetailClickItem:     monitorDetailClickItem},
 *                      template:   string}>}
 */
const component = async props => {
    let page = 0;
    let page_last= 0;
    let service_log_file_interval = '';
    const LIMIT = await props.methods.commonFFB({path:`/server-config/config-apps/${props.data.app_id}`, query:'key=PARAMETERS', method:'GET', authorization_type:props.data.system_admin!=null?'SYSTEMADMIN':'APP_ACCESS'})
                            .then((/**@type{string}*/result)=>parseInt(JSON.parse(result)[0].PARAMETERS.filter((/**@type{{APP_LIMIT_RECORDS:number}}*/parameter)=>parameter.APP_LIMIT_RECORDS)[0].APP_LIMIT_RECORDS));                            
    
    /**
     * Get log parameters
     * @returns {Promise.<{parameters:{ SCOPE_REQUEST:string,
     *                                  SCOPE_SERVER:string, 
     *                                  SCOPE_SERVICE:string,
     *                                  SCOPE_APP:string,
     *                                  SCOPE_DB:string,
     *                                  REQUEST_LEVEL:number,
     *                                  SERVICE_LEVEL:number,
     *                                  DB_LEVEL:number,
     *                                  APP_LEVEL:number,
     *                                  LEVEL_VERBOSE:string 
     *                                  LEVEL_ERROR:string
     *                                  LEVEL_INFO:string,
     *                                  FILE_INTERVAL:string},
     *                     logscope_level_options:{log_scope:string, log_level:string}[]}>}
     */
    const get_log_parameters = async () => {
       return new Promise((resolve)=>{
           props.methods.commonFFB({path:'/server-config/config/CONFIG_SERVER', query:'config_group=SERVICE_LOG', method:'GET', authorization_type:'SYSTEMADMIN'})
           .then((/**@type{string}*/result)=>{
               const log_parameters = {
                   SCOPE_REQUEST : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_REQUEST' in row)[0]['SCOPE_REQUEST'],
                   SCOPE_SERVER :  JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_SERVER' in row)[0]['SCOPE_SERVER'],
                   SCOPE_SERVICE : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_SERVICE' in row)[0]['SCOPE_SERVICE'],
                   SCOPE_APP :     JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_APP' in row)[0]['SCOPE_APP'],
                   SCOPE_DB :      JSON.parse(result).data.filter((/**@type{*}*/row)=>'SCOPE_DB' in row)[0]['SCOPE_DB'],
                   REQUEST_LEVEL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'REQUEST_LEVEL' in row)[0]['REQUEST_LEVEL'],
                   SERVICE_LEVEL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'SERVICE_LEVEL' in row)[0]['SERVICE_LEVEL'],
                   DB_LEVEL :      JSON.parse(result).data.filter((/**@type{*}*/row)=>'DB_LEVEL' in row)[0]['DB_LEVEL'],
                   APP_LEVEL :     JSON.parse(result).data.filter((/**@type{*}*/row)=>'APP_LEVEL' in row)[0]['APP_LEVEL'],
                   LEVEL_INFO :    JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_INFO' in row)[0]['LEVEL_INFO'],
                   LEVEL_ERROR :   JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_ERROR' in row)[0]['LEVEL_ERROR'],
                   LEVEL_VERBOSE : JSON.parse(result).data.filter((/**@type{*}*/row)=>'LEVEL_VERBOSE' in row)[0]['LEVEL_VERBOSE'],
                   FILE_INTERVAL : JSON.parse(result).data.filter((/**@type{*}*/row)=>'FILE_INTERVAL' in row)[0]['FILE_INTERVAL']
                  };
               const logscope_level_options = [
                   {log_scope:log_parameters.SCOPE_REQUEST,    log_level: log_parameters.LEVEL_INFO},
                   {log_scope:log_parameters.SCOPE_REQUEST,    log_level: log_parameters.LEVEL_ERROR},
                   {log_scope:log_parameters.SCOPE_REQUEST,    log_level: log_parameters.LEVEL_VERBOSE},
                   {log_scope:log_parameters.SCOPE_SERVER,     log_level: log_parameters.LEVEL_INFO},
                   {log_scope:log_parameters.SCOPE_SERVER,     log_level: log_parameters.LEVEL_ERROR},
                   {log_scope:log_parameters.SCOPE_APP,        log_level: log_parameters.LEVEL_INFO},
                   {log_scope:log_parameters.SCOPE_APP,        log_level: log_parameters.LEVEL_ERROR},
                   {log_scope:log_parameters.SCOPE_SERVICE,    log_level: log_parameters.LEVEL_INFO},
                   {log_scope:log_parameters.SCOPE_SERVICE,    log_level: log_parameters.LEVEL_ERROR},
                   {log_scope:log_parameters.SCOPE_DB,         log_level: log_parameters.LEVEL_INFO},
                   {log_scope:log_parameters.SCOPE_DB,         log_level: log_parameters.LEVEL_ERROR}
               ];
               service_log_file_interval = log_parameters.FILE_INTERVAL;               
               resolve({   parameters:log_parameters,
                           logscope_level_options:logscope_level_options});
           });
       })
       .catch(()=>null);
   };
    /**
     * Returns query
     * @param {string} list_detail
     * @param {string} query
     * @param {string} sort
     * @param {string} order_by
     * @param {string} service_log_file_interval
     * @returns {string}
     */
    const get_query = (list_detail, query, sort, order_by, service_log_file_interval) =>{
        const app_id = props.methods.COMMON_DOCUMENT.querySelector('#select_app_menu5 .common_select_dropdown_value').getAttribute('data-value'); 
        const year = props.methods.COMMON_DOCUMENT.querySelector('#select_year_menu5 .common_select_dropdown_value').getAttribute('data-value');
        const month = props.methods.COMMON_DOCUMENT.querySelector('#select_month_menu5 .common_select_dropdown_value').getAttribute('data-value');
        const day  = props.methods.COMMON_DOCUMENT.querySelector('#select_day_menu5 .common_select_dropdown_value').getAttribute('data-value');
        
        switch (list_detail){
            case 'CONNECTED':
            case 'APP_LOG':{
                props.methods.COMMON_DOCUMENT.querySelector('#select_app_menu5').style.display = 'inline-block';
                //search month + 1 for CONNECTED
                return `select_app_id=${app_id}&year=${year}&month=${month}&day=${day}&sort=${sort}&order_by=${order_by}${query}&limit=${LIMIT}`;
            }
            case 'SERVER_LOG':{
                //search default logscope REQUEST and loglevel INFO
                const logscope = props.methods.COMMON_DOCUMENT.querySelector('#select_logscope5 .common_select_dropdown_value').getAttribute('data-value').split('-')[0];
                const loglevel = props.methods.COMMON_DOCUMENT.querySelector('#select_logscope5 .common_select_dropdown_value').getAttribute('data-value').split('-')[1];
                let app_id_filter='';
                if (logscope=='APP' || logscope=='SERVICE' || logscope=='SERVER-DB'){
                    //show app filter and use it
                    props.methods.COMMON_DOCUMENT.querySelector('#select_app_menu5').style.display = 'inline-block';
                    app_id_filter = `select_app_id=${app_id}&`;
                }
                else{
                    //no app filter for request
                    props.methods.COMMON_DOCUMENT.querySelector('#select_app_menu5').style.display = 'none';
                    app_id_filter = 'select_app_id=&';
                }
                let url_parameters;

                if (service_log_file_interval=='1M')
                    url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}`;
                else
                    url_parameters = `${app_id_filter}logscope=${logscope}&loglevel=${loglevel}&year=${year}&month=${month}&day=${day}`;
                return `${url_parameters}&sort=${sort}&order_by=${order_by}&limit=${LIMIT}`;
                
            }
            default:{
                return '';
            }
        }
    };
    /**
     * Monitor show
     * @param {'CONNECTED'|'APP_LOG'|'SERVER_LOG'} list_detail
     * @param {string} query
     * @param {string} sort 
     * @param {string} order_by 
     */
    const monitorShow = async (list_detail, query, sort, order_by) => {
        /**@type{import('../../../common_types.js').CommonRESTAPIAuthorizationType}*/
        let token_type = 'APP_ACCESS';
        let path = '';
        
        switch (list_detail){
            case 'CONNECTED':{
                if (props.data.system_admin!=null){
                    path = '/server-socket/socket';
                    token_type = 'SYSTEMADMIN';
                }
                else{
                    path = '/server-socket/socket';
                }
                break;
            }
            case 'APP_LOG':{
                path = '/server-db_admin/app_data_stat-log';
                break;
            }
        }
        //fetch logs except for SERVER_LOG
        const logs = list_detail=='SERVER_LOG'?[]:await props.methods.commonFFB({path:path, query:get_query(list_detail, query, sort, order_by, service_log_file_interval), method:'GET', authorization_type:token_type}).then((/**@type{string}*/result)=>JSON.parse(result).rows);
        if (list_detail=='APP_LOG')
            page_last = logs.length>0?(Math.floor(logs[0].total_rows/LIMIT) * LIMIT):0;
        //fetch log parameter data if SERVER_LOG
        const monitor_log_data = list_detail=='SERVER_LOG'?
                                    await get_log_parameters():{ parameters:{SCOPE_REQUEST:'',
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
                                    []};
        //save value for query
        service_log_file_interval = monitor_log_data.parameters.FILE_INTERVAL ?? '';

        props.methods.commonComponentRender({
            mountDiv:   'list_monitor',
            data:       {
                        app_id:props.data.app_id,
                        system_admin:props.data.system_admin,
                        monitor_detail:list_detail,
                        sort:sort,
                        order_by:order_by,
                        service_socket_client_ID:props.data.service_socket_client_ID,
                        limit:LIMIT,
                        logs:logs,
                        monitor_log_data:monitor_log_data
                        },
            methods:    {
                        monitorDetailShowServerLog:monitorDetailShowServerLog,
                        commonInputControl:props.methods.commonInputControl,
                        commonComponentRender:props.methods.commonComponentRender,
                        commonWindowUserAgentPlatform:props.methods.commonWindowUserAgentPlatform,
                        commonRoundOff:props.methods.commonRoundOff,
                        commonFFB:props.methods.commonFFB
                        },
            path:       '/component/menu_monitor_detail.js'});
    };

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
            for (const col_title of props.methods.COMMON_DOCUMENT.querySelectorAll('#list_app_log .list_title')){
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
        let sort = get_sort();
        const order_by = get_sort(1);
        if (sort =='')
            sort = 'date_created';
        switch (item){
            case 'list_app_log_first':{
                page = 0;
                monitorShow('APP_LOG', `&offset=${0}`, sort, order_by);
                break;
            }
            case 'list_app_log_previous':{
                page = page - LIMIT;
                if (page - LIMIT < 0)
                    page = 0;
                else
                    page = page - LIMIT;
                monitorShow('APP_LOG', `&offset=${page}`, sort, order_by);
                break;
            }
            case 'list_app_log_next':{
                if (page + LIMIT > page_last)
                    page = page_last;
                else
                    page = page + LIMIT;
                monitorShow('APP_LOG', `&offset=${page}`, sort, order_by);
                break;
            }
            case 'list_app_log_last':{
                page = page_last;
                monitorShow('APP_LOG', `&offset=${page}`, sort, order_by);
                break;
            }
        }
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
            case 'list_app_log':{
                monitorShow('APP_LOG', `&offset=${0}`, sortcolumn, order_by);
                break;
            }
            case 'list_connected':{
                monitorShow('CONNECTED', 
                    '', 
                    sortcolumn,
                    order_by);
                break;
            }
            case 'list_server_log':{
                monitorDetailShowServerLog(sortcolumn, order_by);
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
     */
    const monitorDetailClickItem = (item_type, data) => {
        //check if gps_click and if not system admin only when map is not loaded
        if (item_type=='GPS' && props.data.system_admin_only != 1){
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
                props.methods.show_broadcast_dialogue('CHAT', data['id']);
            }
        
    };

    /**
     * Show existing logfiles
     * @returns {void}
     */
    const monitorDetailShowLogDir = () => {
        /**
         * Event for LOV
         * @param {import('../../../common_types.js').CommonAppEvent} event 
         */
        const function_event = event => {
                                //format: 'LOGSCOPE_LOGLEVEL_20220101.log'
                                //logscope and loglevel
                                let filename = props.methods.commonElementRow(event.target).getAttribute('data-value') ?? '';
                                const logscope = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                const loglevel = filename.substring(0,filename.indexOf('_'));
                                filename = filename.substring(filename.indexOf('_')+1);
                                const year     = parseInt(filename.substring(0, 4));
                                const month    = parseInt(filename.substring(4, 6));
                                const day      = parseInt(filename.substring(6, 8));

                                //logscope and loglevel
                                props.methods.COMMON_DOCUMENT.querySelector('#select_logscope5 .common_select_dropdown_value').setAttribute('data-value', `${logscope}-${loglevel}`);
                                props.methods.COMMON_DOCUMENT.querySelector('#select_logscope5 .common_select_dropdown_value').textContent = `${logscope} - ${loglevel}`;
                                //year
                                props.methods.COMMON_DOCUMENT.querySelector('#select_year_menu5 .common_select_dropdown_value').setAttribute('data-value', year);
                                props.methods.COMMON_DOCUMENT.querySelector('#select_year_menu5 .common_select_dropdown_value').textContent = year;

                                //month
                                props.methods.COMMON_DOCUMENT.querySelector('#select_month_menu5 .common_select_dropdown_value').setAttribute('data-value', month);
                                props.methods.COMMON_DOCUMENT.querySelector('#select_month_menu5 .common_select_dropdown_value').textContent = month;
                                //day if applicable
                                if (service_log_file_interval=='1D'){
                                    props.methods.COMMON_DOCUMENT.querySelector('#select_day_menu5 .common_select_dropdown_value').setAttribute('data-value', day);
                                    props.methods.COMMON_DOCUMENT.querySelector('#select_day_menu5 .common_select_dropdown_value').textContent = day;
                                }
                                monitorDetailShowServerLog('logdate', 'desc');
                                props.methods.commonLovClose();
                            };
        props.methods.commonLovShow({lov:'SERVER_LOG_FILES', function_event:function_event});
    };
    /**
     * Display server logs
     * @param {string} sort
     * @param {string} order_by
     */
    const monitorDetailShowServerLog = (sort, order_by) =>{
        let search = props.methods.COMMON_DOCUMENT.querySelector('#list_server_log_search_input').textContent;
        if (search != null){
            if (props.methods.commonInputControl(null,{check_valid_list_elements:[[props.methods.COMMON_DOCUMENT.querySelector('#list_server_log_search_input'),100]]})==false)
                return;
        }
        search=search?encodeURI(search):search;
        props.methods.commonComponentRender(
                {   mountDiv:'list_server_log',
                    data:{  
                                system_admin:props.data.system_admin,
                                path:'/server-log/log',
                                query:`${get_query('SERVER_LOG', '', sort, order_by, service_log_file_interval)}&search=${search ?? ''}`,
                                token_type: 'SYSTEMADMIN',
                                sort:sort,
                                order_by:order_by,
                    },
                    methods:{   commonRoundOff:props.methods.commonRoundOff,
                                commonFFB:props.methods.commonFFB},
                    path:'/component/menu_monitor_detail_server_log.js'});
    };

    const onMounted = async () =>{
        //mount select
        await props.methods.commonComponentRender({mountDiv:'select_year_menu5',
            data:{
                default_value:new Date().getFullYear(),
                default_data_value:new Date().getFullYear(),
                options:[ {VALUE:new Date().getFullYear(), TEXT:new Date().getFullYear()}, 
                          {VALUE:new Date().getFullYear() - 1, TEXT:new Date().getFullYear() -1},
                          {VALUE:new Date().getFullYear() - 2, TEXT:new Date().getFullYear() -2},
                          {VALUE:new Date().getFullYear() - 3, TEXT:new Date().getFullYear() -3},
                          {VALUE:new Date().getFullYear() - 4, TEXT:new Date().getFullYear() -4},
                          {VALUE:new Date().getFullYear() - 5, TEXT:new Date().getFullYear() -5}],
                path:'',
                query:'',
                method:'',
                authorization_type:'',
                column_value:'VALUE',
                column_text:'TEXT'
              },
            methods:{commonFFB:props.methods.commonFFB},
            path:'/common/component/common_select.js'});
        await props.methods.commonComponentRender({mountDiv:'select_month_menu5',
                data:{
                    default_value:new Date().getMonth()+1,
                    default_data_value:new Date().getMonth()+1,
                    options:Array(...Array(12)).map((row,index)=>{return {VALUE:index+1, TEXT:index+1};}),
                    path:'',
                    query:'',
                    method:'',
                    authorization_type:'',
                    column_value:'VALUE',
                    column_text:'TEXT'
                },
                methods:{commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});

        await props.methods.commonComponentRender({mountDiv:'select_day_menu5',
                data:{
                    default_value:new Date().getDate(),
                    default_data_value:new Date().getDate(),
                    options:Array(...Array(31)).map((row,index)=>{return {VALUE:index+1, TEXT:index+1};}),
                    path:'',
                    query:'',
                    method:'',
                    authorization_type:'',
                    column_value:'VALUE',
                    column_text:'TEXT'
                },
                methods:{commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});

        await props.methods.commonComponentRender({mountDiv:'select_app_menu5',
                data:{
                    default_value:'∞',
                    options:[{APP_ID:'', NAME:'∞'}],
                    path:'/server-config/config-apps/',
                    query:'key=NAME',
                    method:'GET',
                    authorization_type:props.data.system_admin?'SYSTEMADMIN':'APP_ACCESS',
                    column_value:'APP_ID',
                    column_text:'NAME'
                  },
                methods:{commonFFB:props.methods.commonFFB},
                path:'/common/component/common_select.js'});

        //mount the map
        //show map only for this condition
        if (props.data.system_admin_only != 1)
            props.methods.commonModuleLeafletInit({mount_div:'mapid',
                            longitude:props.data.client_longitude,
                            latitude:props.data.client_latitude,
                            place:props.data.client_place,
                            doubleclick_event:null,
                            update_map:true});
    };

    return {
        lifecycle:  {onMounted:onMounted},
        data:       {service_log_file_interval : service_log_file_interval},
        methods:    {   
                        monitorShow:                monitorShow,
                        monitorDetailShowLogDir:    monitorDetailShowLogDir,
                        monitorDetailShowServerLog: monitorDetailShowServerLog,
                        monitorDetailPage:          monitorDetailPage,
                        monitorDetailClickSort:     monitorDetailClickSort,
                        monitorDetailClickItem:     monitorDetailClickItem
                    },
        template:   template({system_admin:props.data.system_admin})
    };
};
export default component;