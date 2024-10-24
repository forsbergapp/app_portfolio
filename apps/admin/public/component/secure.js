/**
 * Displays menu and logged in user
 * @module apps/admin/component/secure
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonFFB']} commonFFB
 */

const template = () =>` <div id='secure'>
                            <div id='dialogues'>
                                <div id='dialogue_send_broadcast' class='common_dialogue common_dialogue_content'></div>
                            </div>
                            <div id='secure_menu_open' class='common_dialogue_button common_icon'></div>
                            <div id='secure_menu'>
                                <div id='secure_app_user_account' class='secure_menuitem'></div>
                                <div id='secure_menu_menus'>
                                    <div id='secure_menu_close' class='common_dialogue_button common_icon'></div>
                                    <div id='secure_menu_1' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_2' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_3' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_4' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_5' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_6' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_7' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_8' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_9' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_10' class='secure_menuitem common_icon'></div>
                                    <div id='secure_menu_11' class='secure_menuitem common_icon'></div>
                                </div>
                            </div>
                            <div id='secure_main'>
                                <div id='secure_menu_content'></div>
                            </div>
                        </div>
                        `;
/**
 * 
 * @param {{data:{      commonMountdiv:string},
 *          methods:{   COMMON_DOCUMENT:COMMON_DOCUMENT}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props;
    return {
        lifecycle:  {onMounted:null},
        data:   null,
        methods:null,
        template: template()
    };
};
export default component;