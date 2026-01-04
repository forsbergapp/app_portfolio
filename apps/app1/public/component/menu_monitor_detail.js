/**
 * Displays monitor of connected clients and server logs
 * 
 * @module apps/app1/component/menu_monitor_detail
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{
 *          iam_user_id:number,
 *          monitor_detail:'CONNECTED'|'SERVER_LOG',
 *          function_commonWindowUserAgentPlatform:common['CommonModuleCommon']['commonWindowUserAgentPlatform'],
 *          function_get_order_by:function,
 *          function_roundOff:common['CommonModuleCommon']['commonMiscRoundOff'],
 *          logs:[],
 *          SERVICE_LOG_DATA_PARAMETERS:{
 *                                      REQUEST_LEVEL:number,
 *                                      BFF_LEVEL:number,
 *                                      DB_LEVEL:number,
 *                                      FILE_INTERVAL:string},
 *          icons:{
 *              filesearch:string,
 *              chat:string,
 *              scope_request:string,
 *              scope_bff:string,
 *              scope_database:string,
 *              checked:string,
 *              empty:string,
 *              search:string
 *          }}} props
 * @returns {string}
 */
const template = props => ` ${props.monitor_detail=='CONNECTED'?
                                `<div id='menu_monitor_detail_connected_form'>    
                                    <div id='menu_monitor_detail_connected' class='common_list_scrollbar'>
                                        <div class='menu_monitor_detail_connected_row row_title'>
                                            <div data-column='Id' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('Id')}'>
                                                ID
                                            </div>
                                            <div data-column='Created' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('Created')}'>
                                                CONNECTION DATE
                                            </div>
                                            <div data-column='AppId' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('AppId')}'>
                                                APP ID
                                            </div>
                                            <div data-column='IamUserId' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('IamUserId')}'>
                                                IAM ID
                                            </div>
                                            <div data-column='IamUserUsername' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('IamUserUsername')}'>
                                                IAM USERNAME
                                            </div>
                                            <div data-column='IamUserType' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('IamUserType')}'>
                                                IAM TYPE
                                            </div>
                                            <div data-column='Ip' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('Ip')}'>
                                                IP
                                            </div>
                                            <div data-column='GpsLatitude' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('GpsLatitude')}'>
                                                GPS LAT
                                            </div>
                                            <div data-column='GpsLongitude' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('GpsLongitude')}'>
                                                GPS LONG
                                            </div>
                                            <div data-column='Place' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('Place')}'>
                                                PLACE
                                            </div>
                                            <div data-column='Timezone' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('Timezone')}'>
                                                TIMEZONE
                                            </div>
                                            <div data-column='UserAgent' class='menu_monitor_detail_connected_col list_sort_click ${props.function_get_order_by('UserAgent')}'>
                                                USER AGENT
                                            </div>
                                            <div data-column='Broadcast' class='menu_monitor_detail_connected_col ${props.function_get_order_by('Broadcast')}'>
                                                BROADCAST
                                            </div>
                                        </div>
                                        ${props.logs.map((/**@type{common['server']['socket']['SocketConnectedClient']}*/log)=>
                                            `<div class='menu_monitor_detail_connected_row ${log.IamUserid==props.iam_user_id?'list_current_user_row':''}'>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.Id}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.Created}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.AppId}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.IamUserid ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.IamUserUsername ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.IamUserType ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col common_link gps_click' data-ip='${log.Ip}'>
                                                    ${log.Ip}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col common_link gps_click' 
                                                    data-latitude='${log.GpsLatitude ?? ''}'
                                                    data-longitude='${log.GpsLongitude ?? ''}'>
                                                    ${log.GpsLatitude ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col common_link gps_click'
                                                    data-latitude='${log.GpsLatitude ?? ''}'
                                                    data-longitude='${log.GpsLongitude ?? ''}'>
                                                    ${log.GpsLongitude ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.Place}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col'>
                                                    ${log.Timezone}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col common_wide_list_column'>
                                                    ${props.function_commonWindowUserAgentPlatform(log.UserAgent) ?? ''}
                                                </div>
                                                <div class='menu_monitor_detail_connected_col chat_click common_link' data-id='${log.Id}'>${props.icons.chat}</div>
                                            </div>`
                                            ).join('')
                                        }
                                    </div>
                                </div>`:
                                ''
                            }
                            ${props.monitor_detail=='SERVER_LOG'?
                                `<div id='menu_monitor_detail_server_log_form'>
                                    <div id='menu_monitor_detail_select_logobject'></div>
                                    <div id='menu_monitor_detail_filesearch' class='common_app_dialogues_button common_link common_icon_list'>${props.icons.filesearch}</div>
                                    <div id='menu_monitor_detail_parameters_row'>
                                        <div class='menu_monitor_detail_parameters_row_col'>
                                            <div id='menu_monitor_detail_parameters_row_col1' >${props.icons.scope_request}</div>
                                            ${(props.SERVICE_LOG_DATA_PARAMETERS.REQUEST_LEVEL==1 ||props.SERVICE_LOG_DATA_PARAMETERS.REQUEST_LEVEL==2)?
                                                `<div id='menu_monitor_detail_parameters_row_col1_1' >${props.icons.checked}</div>`:
                                                `<div id='menu_monitor_detail_parameters_row_col1_0'>${props.icons.empty}</div>`
                                            }
                                        </div>
                                        <div class='menu_monitor_detail_parameters_row_col'>
                                            <div id='menu_monitor_detail_parameters_row_col2'>${props.icons.scope_bff}</div>
                                            ${(props.SERVICE_LOG_DATA_PARAMETERS.BFF_LEVEL==1 || props.SERVICE_LOG_DATA_PARAMETERS.BFF_LEVEL==2)?
                                                `<div id='menu_monitor_detail_parameters_row_col2_1' >${props.icons.checked}</div>`:
                                                `<div id='menu_monitor_detail_parameters_row_col2_0' >${props.icons.empty}</div>`
                                            }
                                        </div>
                                        <div class='menu_monitor_detail_parameters_row_col'>
                                            <div id='menu_monitor_detail_parameters_row_col3'>${props.icons.scope_database}</div>
                                            ${(props.SERVICE_LOG_DATA_PARAMETERS.DB_LEVEL==1 || props.SERVICE_LOG_DATA_PARAMETERS.DB_LEVEL==2)?
                                                `<div id='menu_monitor_detail_parameters_row_col3_1' >${props.icons.checked}</div>`:
                                                `<div id='menu_monitor_detail_parameters_row_col3_0' >${props.icons.empty}</div>`
                                            }
                                        </div>
                                    </div>
                                    <div class='list_search'>
                                        <div id='menu_monitor_detail_server_log_search_input' contentEditable='true' class='common_input list_search_input'/></div>
                                        <div id='menu_monitor_detail_server_log_search_icon' class='common_link common_icon_list'>${props.icons.search}</div>
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
 *                       monitor_detail:'CONNECTED'|'SERVER_LOG',
 *                       offset:number,
 *                       sort:string,
 *                       order_by:string,
 *                       page:number|null,
 *                       page_last:number|null,
 *                       iam_user_id:number,
 *                       SERVICE_LOG_FILE_INTERVAL:string,
 *                       SERVICE_LOG_DATA:{parameters:{  REQUEST_LEVEL:number,
 *                                                       BFF_LEVEL:number,
 *                                                       DB_LEVEL:number,
 *                                                       APP_LEVEL:number,
 *                                                       FILE_INTERVAL:string
 *                                                    },
 *                                       logObjects:{VALUE:string, TEXT:string}[]}
 *                       },
 *           methods:    {
 *                       COMMON:common['CommonModuleCommon'],
 *                       monitorShow:function
 *                       },
 *           lifecycle:  null}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:    null,
 *                      methods: {
 *                               monitorDetailPage:function,
 *                               monitorDetailShowServerLog:function,
 *                               monitorDetailClickSort:function
 *                               },
 *                      events:common['commonComponentEvents'],
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
        const app_id = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_app .common_select_dropdown_value').getAttribute('data-value'); 
        const year = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_year .common_select_dropdown_value').getAttribute('data-value');
        const month = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_month .common_select_dropdown_value').getAttribute('data-value');
        const day  = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_day .common_select_dropdown_value').getAttribute('data-value');
        
        switch (list_detail){
            case 'CONNECTED':{
                props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_app').style.display = 'inline-block';
                //search month + 1 for CONNECTED
                return `data_app_id=${app_id}&year=${year}&month=${month}&day=${day}&sort=${sort}&order_by=${order_by}&offset=${offset}`;
            }
            case 'SERVER_LOG':{
                const logObject = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logobject .common_select_dropdown_value').getAttribute('data-value');
                let app_id_filter='';
                if (logObject.startsWith('LogApp') || logObject.startsWith('LogBff') || logObject.startsWith('LogDb')){
                    //show app filter and use it
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_app').style.display = 'inline-block';
                    app_id_filter = `data_app_id=${app_id}&`;
                }
                else{
                    //no app filter for request
                    props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_app').style.display = 'none';
                    app_id_filter = 'data_app_id=&';
                }
                let url_parameters;

                if (props.data.SERVICE_LOG_FILE_INTERVAL=='1M')
                    url_parameters = `${app_id_filter}logobject=${logObject}&year=${year}&month=${month}`;
                else
                    url_parameters = `${app_id_filter}logobject=${logObject}&year=${year}&month=${month}&day=${day}`;
                return `${url_parameters}&sort=${sort}&order_by=${order_by}&offset=${offset}`;
                
            }
            default:{
                return '';
            }
        }
    };
    //use page navigation values or 1 if component with new query
    let page =      props.data.page?props.data.page:1;
    let page_last=  props.data.page_last?props.data.page_last:1;
    let page_limit= 0;
    
    //fetch logs except for SERVER_LOG
    const logs = props.data.monitor_detail=='SERVER_LOG'?[]:await props.methods.COMMON.commonFFB({ path:'/server-socket/socket', 
                                                                                            query:get_query(props.data.monitor_detail, props.data.offset, props.data.sort, props.data.order_by), 
                                                                                            method:'GET', 
                                                                                            authorization_type:'ADMIN'}).then((/**@type{string}*/result)=>JSON.parse(result));
    if (props.data.monitor_detail=='CONNECTED'){
        page_last = logs.rows.length>0?(Math.ceil(logs.page_header.total_count/logs.page_header.count)):0;
        page_limit = logs.page_header.count;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page').textContent = page; 
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_last').textContent = page_last;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_total_count').textContent = logs.page_header.total_count;
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
            for (const col_title of props.methods.COMMON.COMMON_DOCUMENT.querySelectorAll(`#menu_monitor_detail_${props.data.monitor_detail.toLowerCase()}.row_title >div`)){
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
            sort = 'created';
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
            props.methods.monitorShow('CONNECTED',  (page==1?0:page-1) * page_limit, sort, order_by, page, page_last);
        if (props.data.monitor_detail=='SERVER_LOG')
            monitorDetailShowServerLog(             (page==1?0:page-1) * page_limit,props.data.sort, props.data.order_by);

        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page').textContent = page; 
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_last').textContent = page_last;
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
     * @description Show existing logfiles
     * @param{{id:*, value:*}} record
     */
    const monitorDetailShowLogDir = async record => {
        //format [db object]_YYYYMMDD.json
        const year     = parseInt(record.value.split('_')[1].substring(0,4));
        const month    = parseInt(record.value.split('_')[1].substring(4,6));
        const day      = parseInt(record.value.split('_')[1].substring(6,8));

        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logobject .common_select_dropdown_value').setAttribute('data-value', `${record.value.split('_')[0]}`);
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_select_logobject .common_select_dropdown_value').textContent = `${record.value.split('_')[0]}`;
        //year
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_year .common_select_dropdown_value').setAttribute('data-value', year);
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_year .common_select_dropdown_value').textContent = year;

        //month
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_month .common_select_dropdown_value').setAttribute('data-value', month);
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_month .common_select_dropdown_value').textContent = month;
        //day if applicable
        if (props.data.SERVICE_LOG_FILE_INTERVAL=='1D'){
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_day .common_select_dropdown_value').setAttribute('data-value', day);
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_select_day .common_select_dropdown_value').textContent = day;
        }
        monitorDetailShowServerLog( 0, 'created', 'desc');
    };
    /**
     * Display server logs
     * @param {number} offset
     * @param {string} sort
     * @param {string} order_by
     */
    const monitorDetailShowServerLog = (offset, sort, order_by) =>{
        let search = props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_server_log_search_input').textContent;
        if (search != null){
            if (props.methods.COMMON.commonMiscInputControl(null,{check_valid_list_elements:[[props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_detail_server_log_search_input'),100]]})==false)
                return;
        }
        if(offset==0){
            page =1;
            page_last=1;
        }
        search=search?encodeURI(search):search;
        props.methods.COMMON.commonComponentRender(
                {   mountDiv:'menu_monitor_detail_server_log',
                    data:{  
                                path:'/server-db/log',
                                query:`${get_query('SERVER_LOG', offset, sort, order_by)}&search=${search ?? ''}`,
                                token_type: 'ADMIN',
                                sort:sort,
                                order_by:order_by
                    },
                    methods:    null,
                    path:'/component/menu_monitor_detail_server_log.js'})
                    .then(result=>{
                        page_last=result.data.page_last;
                        page_limit = result.data.count;
                        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page').textContent = page; 
                        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_last').textContent = page_last;
                        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#menu_monitor_pagination_page_total_count').textContent = result.data.total_count;
                    });
    };
   
    /**
     * Get order by if column matches
     * @param {string} column
     */
    const get_order_by = column =>column==props.data.sort?props.data.order_by:'';

    /**
     * @name events
     * @descption Events
     * @function
     * @param {common['commonEventType']} event_type
     * @param {common['CommonAppEvent']} event
     * @returns {Promise.<void>}
     */
    const events = async (event_type, event) =>{
        const event_target_id = props.methods.COMMON.commonMiscElementId(event.target);
        switch (true){
            case event_type =='click' && event_target_id == 'menu_monitor_detail_filesearch':{
                props.methods.COMMON.commonComponentRender({
                    mountDiv:   'common_app_dialogues_lov',
                    data:       {
                                lov:                'SERVER_LOG_FILES',
                                lov_custom_value:   null
                                },
                    methods:    {
                                functionData:       null,
                                functionRow:        monitorDetailShowLogDir,
                                event_target:       event.target
                                },
                    path:       '/common/component/common_app_dialogues_lov.js'});
                break;                      
            }
        }
    }
    const onMounted = async () =>{
        if (props.data.monitor_detail=='SERVER_LOG'){
            await props.methods.COMMON.commonComponentRender({
                mountDiv:'menu_monitor_detail_select_logobject', 
                data:{ 
                            default_value:props.data.SERVICE_LOG_DATA.logObjects.filter(row=>row.VALUE=='LogRequestInfo')[0].VALUE,
                            default_data_value:props.data.SERVICE_LOG_DATA.logObjects.filter(row=>row.TEXT=='LogRequestInfo')[0].TEXT,
                            options:props.data.SERVICE_LOG_DATA.logObjects,
                            column_value:'VALUE',
                            column_text:'TEXT'
                },
                methods:    null,
                path:       '/common/component/common_select.js'});
            monitorDetailShowServerLog(0,props.data.sort, props.data.order_by);
        }
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {monitorDetailPage:monitorDetailPage,
                    monitorDetailShowServerLog:monitorDetailShowServerLog,
                    monitorDetailClickSort:monitorDetailClickSort
        },
        events:     events,
        template:   template({  iam_user_id:props.data.iam_user_id,
                                monitor_detail:props.data.monitor_detail,
                                function_commonWindowUserAgentPlatform:props.methods.COMMON.commonWindowUserAgentPlatform,
                                function_get_order_by:get_order_by,
                                function_roundOff: props.methods.COMMON.commonMiscRoundOff,
                                logs:logs.rows,
                                SERVICE_LOG_DATA_PARAMETERS:props.data.SERVICE_LOG_DATA.parameters,
                                icons:{
                                    filesearch:props.methods.COMMON.commonGlobalGet('ICONS').lov,
                                    chat:props.methods.COMMON.commonGlobalGet('ICONS').chat,
                                    scope_request:props.methods.COMMON.commonGlobalGet('ICONS').server+'REQUEST',
                                    scope_bff:props.methods.COMMON.commonGlobalGet('ICONS').server+'BFF',
                                    scope_database:props.methods.COMMON.commonGlobalGet('ICONS').database,
                                    checked:props.methods.COMMON.commonGlobalGet('ICONS').checkbox_checked,
                                    empty:props.methods.COMMON.commonGlobalGet('ICONS').checkbox_empty,
                                    search:props.methods.COMMON.commonGlobalGet('ICONS').reload
                                }
                            })
    };
};
export default component;