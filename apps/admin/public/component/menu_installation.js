/**
 * @module apps/admin/component/menu_installation
 */
/**
 * Displays stat of users
 * @param {{spinner:string,
 *          system_admin:string|null,
 *          installed:boolean}} props
 */
const template = props => props.system_admin?`  <div id='menu_7_content_widget1' class='widget'>
                                                    <div id='install_db'>
                                                        <div id='install_db_icon' class='common_icon ${props.spinner} ${props.installed?'installed':''}'></div>
                                                        <div id='install_db_button_row'>
                                                            <div id='install_db_button_install' class='common_dialogue_button common_icon'></div>
                                                            <div id='install_db_button_uninstall' class='common_dialogue_button common_icon'></div>
                                                        </div>
                                                        <div id='install_db_input'>
                                                            <div id='install_db_country_language_translations_icon' class='common_icon'></div>
                                                            <div id='install_db_country_language_translations' class='common_switch'></div>
                                                        </div>
                                                    </div>
                                                </div>`:
                                                `<div id='menu_7_content_widget2' class='widget'>
                                                    <div id='install_demo'>
                                                        <div id='install_demo_demo_users_icon' class='common_icon'></div>
                                                        <div id='install_demo_button_row'>
                                                            <div id='install_demo_button_install' class='common_dialogue_button common_icon'></div>
                                                            <div id='install_demo_button_uninstall' class='common_dialogue_button common_icon'></div>
                                                        </div>
                                                        <div id='install_demo_input'>
                                                            <div id="install_demo_password_icon" class='common_icon'></div>
                                                            <div class='common_password_container common_input'>
                                                                    <div id='install_demo_password' contentEditable='true' class='common_input common_password'></div>
                                                                    <div id='install_demo_password_mask' class='common_input common_password_mask'/></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`;
/**
* 
* @param {{common_document:import('../../../common_types.js').CommonAppDocument,
*          common_mountdiv:string,
*          system_admin:string,
*          function_FFB:function}} props 
* @returns {Promise.<{ props:{function_post:function}, 
*                      data:null, 
*                      template:string}>}
*/
const component = async props => {
   const post_component = async () =>{
        //checks installed if system admin
        /**@type{boolean} */
        const installed = props.system_admin?props.function_FFB('/server-db_admin/database-installation', null, 'GET', 'SYSTEMADMIN', null)
                                    .then((/**@type{string}*/result)=>JSON.parse(result)[0].installed==1?true:false):null;

       props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template({  spinner:'',
                                                                                                system_admin:props.system_admin,
                                                                                                installed:installed
                                                                                            });
   };
   return {
       props:  {function_post:post_component},
       data:   null,
       template: template({ spinner:'css_spinner',
                            system_admin:props.system_admin,
                            installed:false
       })
   };
};
export default component;