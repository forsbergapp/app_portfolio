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
 *                      system_admin:string},
 *          methods:{   COMMON_DOCUMENT:import('../../../common_types.js').COMMON_DOCUMENT,
 *                      map_mount:import('../js/secure.js')['map_mount'],
 *                      commonComponentRender:import('../../../common_types.js').CommonModuleCommon['commonComponentRender'],
 *                      commonFFB:import('../../../common_types.js').CommonModuleCommon['commonFFB']}}} props 
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:{limit:number},
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
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
        props.methods.map_mount();

    };

    return {
        lifecycle:  {onMounted:onMounted},
        data:       {
                    limit:await props.methods.commonFFB({path:`/server-config/config-apps/${props.data.app_id}`, query:'key=PARAMETERS', method:'GET', authorization_type:props.data.system_admin!=null?'SYSTEMADMIN':'APP_ACCESS'})
                            .then((/**@type{string}*/result)=>parseInt(JSON.parse(result)[0].PARAMETERS.filter((/**@type{{APP_LIMIT_RECORDS:number}}*/parameter)=>parameter.APP_LIMIT_RECORDS)[0].APP_LIMIT_RECORDS))
                    },
        methods:    null,
        template:   template({system_admin:props.data.system_admin})
    };
};
export default component;