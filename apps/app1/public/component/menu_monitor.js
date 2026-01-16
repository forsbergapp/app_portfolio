/**
 * Displays config
 * @module apps/app1/component/menu_monitor
 */

/**
 * @import {common}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{
 *              first:string,
 *              previous:string,
 *              next:string,
 *              last:string,
 *              connected:string,
 *              server_log:string}}} props
 * @returns {string}
 */
const template = props => `<div id='menu_monitor_content_widget1' class='widget'>
                                <div id='menu_monitor' class='list_nav'>
                                    <div id='menu_monitor_connected' class='list_nav_list list_button common_link'>${props.icons.connected}</div>
                                    <div id='menu_monitor_server_log' class='list_nav_list list_button common_link'>${props.icons.server_log}</div>
                                </div>
                                <div id='menu_monitor_sample'>
                                    <div id='menu_monitor_select_app'></div>
                                    <div id='menu_monitor_select_year'></div>
                                    <div id='menu_monitor_select_month'></div>
                                    <div id='menu_monitor_select_day'></div>
                                </div>
                                <div id='menu_monitor_detail'></div>
                                <div id='menu_monitor_pagination'>
                                    <div></div>
                                    <div></div>
                                    <div id='menu_monitor_pagination_first'     class='common_link common_icon_button'>${props.icons.first}</div>
                                    <div id='menu_monitor_pagination_previous'  class='common_link common_icon_button'>${props.icons.previous}</div>
                                    <div id='menu_monitor_pagination_next'      class='common_link common_icon_button'>${props.icons.next}</div>
                                    <div id='menu_monitor_pagination_last'      class='common_link common_icon_button'>${props.icons.last}</div>
                                    <div id='menu_monitor_pagination_page'></div>
                                    <div id='menu_monitor_pagination_page_last'></div>
                                    <div id='menu_monitor_pagination_page_total_count'></div>
                                </div>
                            </div>
                            </div>
                            <div id='menu_monitor_content_widget2' class='widget'>
                                <div id='menu_monitor_mapid'></div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:{      commonMountdiv:string},
 *          methods:{   COMMON:common['CommonModuleCommon']}}} props 
 * @returns {Promise.<{ lifecycle:  common['CommonComponentLifecycle'], 
 *                      data:       null,
 *                      methods:    {monitorShow:                monitorShow,
 *                                   monitorDetailShowServerLog: monitorDetailShowServerLog,
 *                                   monitorDetailPage:          monitorDetailPage,
 *                                   monitorDetailClickSort:     monitorDetailClickSort},
 *                      template:   string}>}
 */
const component = async props => {

    const apps = await props.methods.COMMON.commonFFB({ path:'/server-db/app', 
                                                        query:'key=Name', 
                                                        method:'GET', authorization_type:'ADMIN'})
                .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    /**
     * Page navigation
     * @param {string} item 
     * @returns {void}
     */
    let monitorDetailPageDetail = item =>{item;};
    /**
     * Display server logs
     * @param {number} offset
     * @param {string} sort
     * @param {string} order_by
     */
    let monitorDetailShowServerLogDetail = (offset, sort, order_by) => {offset;sort;order_by;};
    
    /**
     * List sort click
     * @param {string} list 
     * @param {string} sortcolumn 
     * @param {string} order_by 
     * @returns {void}
     */
    let monitorDetailClickSortDetail = (list, sortcolumn, order_by) => {list;sortcolumn;order_by;};
    
    /**
     * Get log parameters
     * @returns {Promise.<{ parameters:{ 
     *                                  REQUEST_LEVEL:number,
     *                                  BFF_LEVEL:number,
     *                                  DB_LEVEL:number,
     *                                  APP_LEVEL:number,
     *                                  FILE_INTERVAL:string},
     *                      logObjects:{VALUE:string, TEXT:string}[]}>}
     */
    const get_log_parameters = async () => {
        //service_log parameters
        const result_parameters = await props.methods.COMMON.commonFFB({path:'/server-db/openapi/config', method:'GET', authorization_type:'ADMIN'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result));
        /**@type{common['server']['ORM']['View']['ORMGetObjects'][]}*/
        const result_log_objects = await props.methods.COMMON.commonFFB({path:'/server-db/ORM-objects', method:'GET', authorization_type:'ADMIN'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result).rows);
        
        const log_parameters = {
            REQUEST_LEVEL : result_parameters.LOG_REQUEST_LEVEL.default,
            BFF_LEVEL :     result_parameters.LOG_BFF_LEVEL.default,
            DB_LEVEL :      result_parameters.LOG_DB_LEVEL.default,
            APP_LEVEL :     result_parameters.LOG_APP_LEVEL.default,
            FILE_INTERVAL : result_parameters.LOG_FILE_INTERVAL.default
            };
        
        return {parameters:log_parameters,
                logObjects:result_log_objects
                            .filter(row=>row.Name.startsWith('Log'))
                            .map(row=>{return {VALUE:row.Name, TEXT:row.Name};})
                };
    };
    const SERVICE_LOG_DATA = await get_log_parameters();
    //save value for query
    const SERVICE_LOG_FILE_INTERVAL = SERVICE_LOG_DATA.parameters.FILE_INTERVAL ?? '';
    
    /**
     * Monitor show
     * @param {'CONNECTED'|'APP_DATA_STAT'|'SERVER_LOG'} list_detail
     * @param {number} offset
     * @param {string} sort 
     * @param {string} order_by 
     * @param {number|null} page
     * @param {number|null} page_last
     */
    const monitorShow = async (list_detail, offset, sort, order_by, page=null, page_last=null) => {
        
        props.methods.COMMON.commonComponentRender({
            mountDiv:   'menu_monitor_detail',
            data:       {
                        app_id:props.methods.COMMON.commonGlobalGet('UserApp').app_id,
                        monitor_detail:list_detail,
                        offset:offset,
                        sort:sort,
                        order_by:order_by,
                        page:page,
                        page_last:page_last,
                        iam_user_id:props.methods.COMMON.commonGlobalGet('User').iam_user_id,
                        SERVICE_LOG_FILE_INTERVAL:SERVICE_LOG_FILE_INTERVAL,
                        SERVICE_LOG_DATA:SERVICE_LOG_DATA
                        },
            methods:    {
                        monitorShow:monitorShow
                        },
            path:       '/component/menu_monitor_detail.js'})
            .then(result=>{
                monitorDetailPageDetail = result.methods.monitorDetailPage;
                monitorDetailShowServerLogDetail = result.methods.monitorDetailShowServerLog;
                monitorDetailClickSortDetail = result.methods.monitorDetailClickSort;
 
            });
    };

    /**
     * Page navigation
     * @param {string} item 
     * @returns {void}
     */
    const monitorDetailPage = item => monitorDetailPageDetail(item);
    /**
     * Display server logs
     * @param {number} offset
     * @param {string} sort
     * @param {string} order_by
     */
    const monitorDetailShowServerLog = (offset, sort, order_by) => monitorDetailShowServerLogDetail(offset, sort, order_by);

    /**
     * List sort click
     * @param {string} list 
     * @param {string} sortcolumn 
     * @param {string} order_by 
     * @returns {void}
     */    
    const monitorDetailClickSort = (list, sortcolumn, order_by) => monitorDetailClickSortDetail(list, sortcolumn, order_by);    

    const onMounted = async () =>{
        //mount select
        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_monitor_select_year',
            data:       {
                        default_value:new Date().getFullYear(),
                        default_data_value:new Date().getFullYear(),
                        options:[ {VALUE:new Date().getFullYear(), TEXT:new Date().getFullYear()}, 
                                {VALUE:new Date().getFullYear() - 1, TEXT:new Date().getFullYear() -1},
                                {VALUE:new Date().getFullYear() - 2, TEXT:new Date().getFullYear() -2},
                                {VALUE:new Date().getFullYear() - 3, TEXT:new Date().getFullYear() -3},
                                {VALUE:new Date().getFullYear() - 4, TEXT:new Date().getFullYear() -4},
                                {VALUE:new Date().getFullYear() - 5, TEXT:new Date().getFullYear() -5}],
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_monitor_select_month',
                data:   {
                        default_value:new Date().getMonth()+1,
                        default_data_value:new Date().getMonth()+1,
                        options:Array(...Array(12)).map((row,index)=>{return {VALUE:index+1, TEXT:index+1};}),
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
                methods:null,
                path:   '/common/component/common_select.js'});

        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_monitor_select_day',
                data:   {
                        default_value:new Date().getDate(),
                        default_data_value:new Date().getDate(),
                        options:Array(...Array(31)).map((row,index)=>{return {VALUE:index+1, TEXT:index+1};}),
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
                methods:null,
                path:   '/common/component/common_select.js'});

        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_monitor_select_app',
                data:   {
                        default_value:props.methods.COMMON.commonGlobalGet('ICONS').infinite,
                        default_data_value:'',
                        options:apps.map((/**@type{common['server']['ORM']['Object']['App']}*/row)=>{return {Id:row.Id, Name:row.Name}}).concat({Id:'',Name:props.methods.COMMON.commonGlobalGet('ICONS').infinite}),
                        column_value:'Id',
                        column_text:'Name'
                        },
                methods:null,
                path:   '/common/component/common_select.js'});

        //mount the map
        props.methods.COMMON.commonComponentRender({
            mountDiv:   'menu_monitor_mapid',
            data:       { 
                        longitude:props.methods.COMMON.commonGlobalGet('Data').client_longitude,
                        latitude:props.methods.COMMON.commonGlobalGet('Data').client_latitude
                        },
            methods:    null,
            path:       '/common/component/common_map.js'});
    };

    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    {   
                        monitorShow:                monitorShow,
                        monitorDetailShowServerLog: monitorDetailShowServerLog,
                        monitorDetailPage:          monitorDetailPage,
                        monitorDetailClickSort:     monitorDetailClickSort
                    },
        template:   template({icons:{
                                first:props.methods.COMMON.COMMON_DOCUMENT.body.classList.contains('rtl')?
                                        props.methods.COMMON.commonGlobalGet('ICONS')['last']:
                                            props.methods.COMMON.commonGlobalGet('ICONS')['first'],
                                previous:props.methods.COMMON.COMMON_DOCUMENT.body.classList.contains('rtl')?
                                            props.methods.COMMON.commonGlobalGet('ICONS')['next']:
                                                props.methods.COMMON.commonGlobalGet('ICONS')['previous'],
                                next:props.methods.COMMON.COMMON_DOCUMENT.body.classList.contains('rtl')?
                                            props.methods.COMMON.commonGlobalGet('ICONS')['previous']:
                                                props.methods.COMMON.commonGlobalGet('ICONS')['next'],
                                last:props.methods.COMMON.COMMON_DOCUMENT.body.classList.contains('rtl')?
                                        props.methods.COMMON.commonGlobalGet('ICONS')['first']:
                                            props.methods.COMMON.commonGlobalGet('ICONS')['last'],
                                connected:props.methods.COMMON.commonGlobalGet('ICONS').user_connections+props.methods.COMMON.commonGlobalGet('ICONS').log,
                                server_log:props.methods.COMMON.commonGlobalGet('ICONS').server+props.methods.COMMON.commonGlobalGet('ICONS').log
                                }

                            })
    };
};

export default component;