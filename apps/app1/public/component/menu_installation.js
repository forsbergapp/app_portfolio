/**
 * Displays stat of users
 * @module apps/app1/component/menu_installation
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{installed:boolean|null}} props
 * @returns {string}
 */
const template = props => ` <div id='menu_installation_content_widget1' class='widget'>
                                <div id='menu_installation_db'>
                                    <div id='menu_installation_db_icon' class='common_icon ${props.installed?'installed':''}'></div>
                                    <div id='menu_installation_db_button_row'>
                                        <div id='menu_installation_db_button_install' class='common_dialogue_button common_icon'></div>
                                        <div id='menu_installation_db_button_uninstall' class='common_dialogue_button common_icon'></div>
                                    </div>
                                </div>
                            </div>
                            <div id='menu_installation_content_widget2' class='widget'>
                                <div id='menu_installation_demo'>
                                    <div id='menu_installation_demo_demo_users_icon' class='common_icon'></div>
                                    <div id='menu_installation_demo_button_row'>
                                        <div id='menu_installation_demo_button_install' class='common_dialogue_button common_icon'></div>
                                        <div id='menu_installation_demo_button_uninstall' class='common_dialogue_button common_icon'></div>
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
 *                       COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                       commonFFB:CommonModuleCommon['commonFFB']
 *                       },
 *          lifecycle:   null}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    //checks installed if admin
    /**@type{boolean|null} */
    const installed = await props.methods.commonFFB({path:'/server-db/database-installation', method:'GET', authorization_type:'ADMIN'})
                                .then((/**@type{string}*/result)=>JSON.parse(result).rows[0].installed==1?true:false);
   return {
       lifecycle:   null,
       data:        null,
       methods:     null,
       template:    template({  installed:installed
       })
   };
};
export default component;