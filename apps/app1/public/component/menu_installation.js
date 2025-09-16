/**
 * Displays stat of users
 * @module apps/app1/component/menu_installation
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
const template = () => ` <div id='menu_installation_content_widget1' class='widget'>
                                <div id='menu_installation_demo'>
                                    <div id='menu_installation_demo_demo_users_icon' class='common_icon'></div>
                                    <div id='menu_installation_demo_button_row'>
                                        <div id='menu_installation_demo_button_install' class='common_app_dialogues_button common_icon'></div>
                                        <div id='menu_installation_demo_button_uninstall' class='common_app_dialogues_button common_icon'></div>
                                    </div>
                                    <div id='menu_installation_demo_input'>
                                        <div id="menu_installation_demo_password_icon" class='common_icon'></div>
                                        <div class='common_password_container common_input'>
                                                <div id='menu_installation_demo_password' contentEditable='true' class='common_input common_password'></div>
                                                <div id='menu_installation_demo_password_mask' class='common_input common_password_mask'/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:        {commonMountdiv:string},
 *          methods:     {
 *                       COMMON:common['CommonModuleCommon']
 *                       },
 *          lifecycle:   null}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
   return {
       lifecycle:   null,
       data:        null,
       methods:     null,
       template:    template()
   };
};
export default component;