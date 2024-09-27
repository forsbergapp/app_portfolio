/**
 * @module apps/admin/component/menu_monitor
 */
/**
 * Displays config
 * 
 */
/**
 * @param {{spinner:string,
 *          system_admin:string|null}} props
 */
const template = props => `<div id='menu_5_content_widget1' class='widget'>
                                <div id='list_monitor_nav' class='list_nav'>
                                    <div id='list_monitor_nav_connected' class='list_nav_list list_button common_icon'></div>
                                    ${props.system_admin==null?'<div id=\'list_monitor_nav_app_log\' class=\'list_nav_list list_button common_icon\'></div>':''}
                                    ${props.system_admin!=null?'<div id=\'list_monitor_nav_server_log\' class=\'list_nav_list list_button common_icon\'></div>':''}
                                </div>
                                <div id='list_row_sample' class='${props.spinner}'>
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
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          system_admin:string,
 *          function_map_mount:function,
 *          function_ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *          function_FFB:import('../../../common_types.js').CommonModuleCommon['FFB']}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:{limit:number},
 *                      template:string}>}
 */
const component = async props => {
    const post_component = async () =>{
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template({spinner:'', system_admin:props.system_admin});
        //mount select
        await props.function_ComponentRender({mountDiv:'select_year_menu5',
            props:{
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
                column_text:'TEXT',
                function_FFB:props.function_FFB
              },
            methods:null,
            lifecycle:null,
            path:'/common/component/select.js'});
        await props.function_ComponentRender({mountDiv:'select_month_menu5',
                props:{
                    default_value:new Date().getMonth()+1,
                    default_data_value:new Date().getMonth()+1,
                    options:Array(...Array(12)).map((row,index)=>{return {VALUE:index+1, TEXT:index+1};}),
                    path:'',
                    query:'',
                    method:'',
                    authorization_type:'',
                    column_value:'VALUE',
                    column_text:'TEXT',
                    function_FFB:props.function_FFB
                },
                methods:null,
                lifecycle:null,
                path:'/common/component/select.js'});

        await props.function_ComponentRender({mountDiv:'select_day_menu5',
                props:{
                    default_value:new Date().getDate(),
                    default_data_value:new Date().getDate(),
                    options:Array(...Array(31)).map((row,index)=>{return {VALUE:index+1, TEXT:index+1};}),
                    path:'',
                    query:'',
                    method:'',
                    authorization_type:'',
                    column_value:'VALUE',
                    column_text:'TEXT',
                    function_FFB:props.function_FFB
                },
                methods:null,
                lifecycle:null,
                path:'/common/component/select.js'});

        await props.function_ComponentRender({mountDiv:'select_app_menu5',
                props:{
                    default_value:'∞',
                    options:[{APP_ID:'', NAME:'∞'}],
                    path:'/server-config/config-apps/',
                    query:'key=NAME',
                    method:'GET',
                    authorization_type:props.system_admin?'SYSTEMADMIN':'APP_ACCESS',
                    column_value:'APP_ID',
                    column_text:'NAME',
                    function_FFB:props.function_FFB
                  },
                methods:null,
                lifecycle:null,
                path:'/common/component/select.js'});

        //mount the map
        props.function_map_mount();

    };

    return {
        props:  {function_post:post_component},
        data:   {limit:await props.function_FFB(`/server-config/config-apps/${props.app_id}`, 'key=PARAMETERS', 'GET', props.system_admin!=null?'SYSTEMADMIN':'APP_ACCESS', null)
                            .then((/**@type{string}*/result)=>parseInt(JSON.parse(result)[0].PARAMETERS.filter((/**@type{{APP_LIMIT_RECORDS:number}}*/parameter)=>parameter.APP_LIMIT_RECORDS)[0].APP_LIMIT_RECORDS))},
        template: template({spinner:'css_spinner', system_admin:props.system_admin})
    };
};
export default component;