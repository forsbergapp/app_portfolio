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
                                    <select id='select_year_menu5'> <option value="${new Date().getFullYear()}">${new Date().getFullYear()}</option>
                                                                    <option value="${new Date().getFullYear() -1}">${new Date().getFullYear()-1}</option>
                                                                    <option value="${new Date().getFullYear() -2}">${new Date().getFullYear()-2}</option>
                                                                    <option value="${new Date().getFullYear() -3}">${new Date().getFullYear()-3}</option>
                                                                    <option value="${new Date().getFullYear() -4}">${new Date().getFullYear()-4}</option>
                                                                    <option value="${new Date().getFullYear() -5}">${new Date().getFullYear()-5}</option></select>
                                    <select id='select_month_menu5'>
                                        ${Array(...Array(12)).map((row,index)=>`<option value='${index+1}'>${index+1}</option>`).join('')}
                                    </select>
                                    <select id='select_day_menu5'>
                                        ${Array(...Array(31)).map((row,index)=>`<option value='${index+1}'>${index+1}</option>`).join('')}
                                    </select>
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
 *          function_ComponentRender:function,
 *          function_FFB:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:{limit:number},
 *                      template:string}>}
 */
const component = async props => {
    const post_component = async () =>{
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = render_template({spinner:'', system_admin:props.system_admin});

        await props.function_ComponentRender('select_app_menu5', 
            {
              default_value:'∞',
              options:[{APP_ID:'', NAME:'∞'}],
              path:'/server-config/config-apps/',
              query:'key=NAME',
              method:'GET',
              authorization_type:props.system_admin?'SYSTEMADMIN':'APP_ACCESS',
              column_value:'APP_ID',
              column_text:'NAME',
              function_FFB:props.function_FFB
            }, '/common/component/select.js');

        if (props.system_admin!=null){
            props.common_document.querySelector('#select_day_menu5').selectedIndex = new Date().getDate() -1;
        }
        props.common_document.querySelector('#select_year_menu5').selectedIndex = 0;
        props.common_document.querySelector('#select_month_menu5').selectedIndex = new Date().getMonth();
        props.function_map_mount();

    };
 /**
  * @param {{   spinner:string,
  *             system_admin:string|null}} template_props
  */
 const render_template = template_props =>{
     return template({  spinner:template_props.spinner,
                        system_admin:template_props.system_admin
     });
 };
 return {
     props:  {function_post:post_component},
     data:   {limit:await props.function_FFB(`/server-config/config-apps/${props.app_id}`, 'key=PARAMETERS', 'GET', props.system_admin!=null?'SYSTEMADMIN':'APP_ACCESS', null)
                        .then((/**@type{string}*/result)=>parseInt(JSON.parse(result)[0].PARAMETERS.filter((/**@type{{APP_LIMIT_RECORDS:number}}*/parameter)=>parameter.APP_LIMIT_RECORDS)[0].APP_LIMIT_RECORDS))},
     template: render_template({spinner:'css_spinner', system_admin:props.system_admin})
 };
};
export default component;