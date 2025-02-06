/**
 * Displays settings
 * @module apps/app4/component/settings
 */

/**
 * @import {COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{user_account_id:number|null,
 *          avatar:string|null}} props
 * @returns {string}
 */
const template = props =>`      
                        <div id='settings_tab_navigation'>
                            <div id='settings_tab_nav_1' class='settings_tab_nav settings_tab_nav_selected common_icon'></div>
                            <div id='settings_tab_nav_2' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_3' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_4' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_5' class='settings_tab_nav common_icon'></div>
                            <div id='settings_tab_nav_6' class='settings_tab_nav common_icon'></div>
                            ${props.user_account_id!=null?
                                `<div id='settings_tab_nav_7' class='settings_tab_nav common_icon'>
                                    <div id='user_setting_avatar_img' class='common_image' style='${props.avatar==null?'':`background-image:url(${props.avatar});`}'></div>
                                </div>`:
                                ''
                            }
                        </div>
                        <div id='settings_content' class='settings_tab_content'></div>
                        <div id='settings_close' class='common_dialogue_button common_icon' ></div>
                        `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                          commonMountdiv:string,
 *                          user_account_id:number|null,
 *                          avatar:string|null
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      SettingShow:function}}} props 
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const onMounted =() =>{
        props.methods.SettingShow(1);
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({  user_account_id:props.data.user_account_id,
                                avatar:props.data.avatar
                            })
    };
};
export default component;