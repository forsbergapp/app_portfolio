/**
 * @module apps/admin/component/menu_start
 */
/**
 * Displays start
 * 
 */
/**
 * @param {{spinner:string,
 *          system_admin:string|null,
 *          maintenance:0|1|null}} props
 */
const template = props => ` <div id='menu_1_content_widget1' class='widget'>
                                <div id='menu_1_row_sample'>
                                    ${props.system_admin!=null?
                                        '<div id=\'select_system_admin_stat\'></div>':
                                        ''
                                    }
                                    <div id='select_app_menu1'></div>
                                    <div id='select_year_menu1'></div>
                                    <div id='select_month_menu1'></div>
                                </div>
                                <div id='graphBox'></div>
                            </div>
                            <div id='menu_1_content_widget2' class='widget'>
                                    ${props.system_admin!=null?
                                        `<div id='menu_1_maintenance'>
                                            <div id='menu_1_maintenance_title' class='common_icon'></div>
                                            <div id='menu_1_maintenance_checkbox'>
                                                <div id='menu_1_checkbox_maintenance' class='common_switch ${props.maintenance==1?'checked':''}'></div>
                                            </div>
                                        </div>`:
                                        ''
                                    }
                                <div id='menu_1_broadcast'>
                                    <div id='menu_1_broadcast_title' class='common_icon'></div>
                                    <div id='menu_1_broadcast_button' class='chat_click common_icon'></div>
                                </div>
                            </div>`;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          system_admin:string,
*          function_ComponentRender:function,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null,
*                      template:string}>}
*/
const component = async props => {
   const post_component = async () =>{
        //system admin
        /**@type{{status_codes:[number, string][]}} */
        const result_obj = props.system_admin!=null?await props.function_FFB('/server/info-statuscode', null, 'GET', 'SYSTEMADMIN', null).then((/**@type{string}*/result)=>JSON.parse(result)):[];

        //system admin
        // syntax {VALUE:'[ADMIN_statGroup]#[value]#[unique 0/1]#[statgroup]', TEXT:['[ADMIN_STATGROUP] - [VALUE replaced '_' with ' ']']}
        // response has empty statgroup
        const stat_options = props.system_admin!=null?[
            {VALUE:'request#ip_total#0#ip',                             TEXT:'REQUEST - IP TOTAL'},
            {VALUE:'request#ip_unqiue#1#ip',                            TEXT:'REQUEST - IP UNIQUE'},
            {VALUE:'request#url_total#0#url',                           TEXT:'REQUEST - URL TOTAL'},
            {VALUE:'request#url_unqiue#1#url',                          TEXT:'REQUEST - URL UNIQUE'},
            {VALUE:'request#accept_language_total#0#accept-language',   TEXT:'REQUEST - ACCEPT LANGUAGE TOTAL'},
            {VALUE:'request#accept_language_unqiue#1#accept-language',  TEXT:'REQUEST - ACCEPT LANGUAGE UNIQUE'},
            {VALUE:'request#user_agent_total#0#user-agent',             TEXT:'REQUEST - USER#AGENT TOTAL'},
            {VALUE:'request#user_agent_unqiue#1#user-agent',            TEXT:'REQUEST - USER#AGENT UNIQUE'},
            {VALUE:'response##0#',                                 TEXT:'REPONSE - ∞'},
            ...Object.entries(result_obj.status_codes).map(code=>{
                return {VALUE:`response#${code[0]}#1#`, TEXT:`RESPONSE - ${code[0]} - ${code[1]}`};
            })
        ]:[];
        //system admin
        /**@type{0|1|null} */
        const maintenance = props.system_admin!=null?await props.function_FFB('/server-config/config/SERVER', 'config_group=METADATA&parameter=MAINTENANCE', 'GET', 'SYSTEMADMIN', null)
                                    .then((/**@type{string}*/result)=>JSON.parse(result).data):null;

        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template({spinner:'', system_admin:props.system_admin, maintenance:maintenance});

        //mount select
        if (props.system_admin)
            await props.function_ComponentRender('select_system_admin_stat',
                {
                default_value:'REQUEST - IP TOTAL',
                default_data_value:'request#ip_total#0#ip',
                options:stat_options,
                path:'',
                query:'',
                method:'',
                authorization_type:'',
                column_value:'VALUE',
                column_text:'TEXT',
                function_FFB:props.function_FFB
                }, '/common/component/select.js');

        await props.function_ComponentRender('select_year_menu1',
            {
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
            }, '/common/component/select.js');

        await props.function_ComponentRender('select_month_menu1', 
            {
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
            }, '/common/component/select.js');

        await props.function_ComponentRender('select_app_menu1', 
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

   };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template({spinner:'css_spinner', system_admin:props.system_admin, maintenance:0})
    };
};
export default component;