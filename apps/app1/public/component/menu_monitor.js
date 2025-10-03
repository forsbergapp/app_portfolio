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
 * @returns {string}
 */
const template = () => `<div id='menu_monitor_content_widget1' class='widget'>
                                <div id='menu_monitor' class='list_nav'>
                                    <div id='menu_monitor_connected' class='list_nav_list list_button common_icon'></div>
                                    <div id='menu_monitor_server_log' class='list_nav_list list_button common_icon'></div>
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
                                    <div id='menu_monitor_pagination_first'     class='common_pagination_first common_icon'></div>
                                    <div id='menu_monitor_pagination_previous'  class='common_pagination_previous common_icon'></div>
                                    <div id='menu_monitor_pagination_next'      class='common_pagination_next common_icon'></div>
                                    <div id='menu_monitor_pagination_last'      class='common_pagination_last common_icon'></div>
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
     *                                  SERVICE_LEVEL:number,
     *                                  DB_LEVEL:number,
     *                                  APP_LEVEL:number,
     *                                  FILE_INTERVAL:string},
     *                      logObjects:{VALUE:string, TEXT:string}[]}>}
     */
    const get_log_parameters = async () => {
        const result_parameters = await props.methods.COMMON.commonFFB({path:'/server-db/configserver', query:'config_group=SERVICE_LOG', method:'GET', authorization_type:'ADMIN'})
                                    .then((/**@type{string}*/result)=>JSON.parse(result).rows);
        const result_log_objects = await props.methods.COMMON.commonFFB({path:'/server-db/ORM-objects', method:'GET', authorization_type:'ADMIN'});
        
        const log_parameters = {
            REQUEST_LEVEL : result_parameters.filter((/**@type{*}*/row)=>'REQUEST_LEVEL' in row)[0]['REQUEST_LEVEL'],
            SERVICE_LEVEL : result_parameters.filter((/**@type{*}*/row)=>'SERVICE_LEVEL' in row)[0]['SERVICE_LEVEL'],
            DB_LEVEL :      result_parameters.filter((/**@type{*}*/row)=>'DB_LEVEL' in row)[0]['DB_LEVEL'],
            APP_LEVEL :     result_parameters.filter((/**@type{*}*/row)=>'APP_LEVEL' in row)[0]['APP_LEVEL'],
            FILE_INTERVAL : result_parameters.filter((/**@type{*}*/row)=>'FILE_INTERVAL' in row)[0]['FILE_INTERVAL']
            };
        
        return {parameters:log_parameters,
                logObjects:JSON.parse(result_log_objects).rows
                            .filter((/**@type{{name:string}}*/row)=>row.name.startsWith('Log'))
                            .map((/**@type{{name:string}}*/row)=>{return {VALUE:row.name, TEXT:row.name};})
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
                        app_id:props.methods.COMMON.commonGlobalGet('app_id'),
                        monitor_detail:list_detail,
                        offset:offset,
                        sort:sort,
                        order_by:order_by,
                        page:page,
                        page_last:page_last,
                        iam_user_id:props.methods.COMMON.commonGlobalGet('iam_user_id'),
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
                        path:'',
                        query:'',
                        method:'',
                        authorization_type:'',
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
                        path:'',
                        query:'',
                        method:'',
                        authorization_type:'',
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
                        path:'',
                        query:'',
                        method:'',
                        authorization_type:'',
                        column_value:'VALUE',
                        column_text:'TEXT'
                        },
                methods:null,
                path:   '/common/component/common_select.js'});

        await props.methods.COMMON.commonComponentRender({mountDiv:'menu_monitor_select_app',
                data:   {
                        default_value:'∞',
                        default_data_value:'',
                        options:[{id:'', name:'∞'}],
                        path:'/server-db/app',
                        query:'key=Name',
                        method:'GET',
                        authorization_type:'ADMIN',
                        column_value:'Id',
                        column_text:'Name'
                        },
                methods:null,
                path:   '/common/component/common_select.js'});

        //mount the map
        props.methods.COMMON.commonComponentRender({
            mountDiv:   'menu_monitor_mapid',
            data:       { 
                        data_app_id :props.methods.COMMON.commonGlobalGet('app_common_app_id'),
                        longitude:props.methods.COMMON.commonGlobalGet('client_longitude'),
                        latitude:props.methods.COMMON.commonGlobalGet('client_latitude')
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
        template:   template()
    };
};

export default component;