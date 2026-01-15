/**
 * Displays settings
 * @module apps/app4/component/settings
 */

/**
 * @import {common}  from '../../../common_types.js'
 */
/**
 * @name template
 * @description Template
 * @function
 * @param {{iam_user_id:number|null,
 *          avatar:string|null,
 *          icons:{
 *                   regional:string,
 *                   gps:string,
 *                   design:string,
 *                   text:string,
 *                   prayer:string,
 *                   close:string}}} props
 * @returns {string}
 */
const template = props =>`      
                        <div id='settings'>
                            <div id='settings_tab_navigation'>
                                <div id='settings_tab_nav_1' class='settings_tab_nav settings_tab_nav_selected common_link common_icon_button'>${props.icons.regional}</div>
                                <div id='settings_tab_nav_2' class='settings_tab_nav common_link common_icon_button'>${props.icons.gps}</div>
                                <div id='settings_tab_nav_3' class='settings_tab_nav common_link common_icon_button'>${props.icons.design}</div>
                                <div id='settings_tab_nav_4' class='settings_tab_nav common_link common_icon_button'>${props.icons.text}</div>
                                <div id='settings_tab_nav_5' class='settings_tab_nav common_link common_icon_button'>${props.icons.prayer}</div>
                                ${props.iam_user_id!=null?
                                    `<div id='settings_tab_nav_6' class='settings_tab_nav common_link common_icon_button'>
                                        <div id='user_setting_avatar_img' class='common_image' style='${props.avatar==null?'':`background-image:url(${props.avatar});`}'></div>
                                    </div>`:
                                    ''
                                }
                            </div>
                            <div id='settings_content' class='settings_tab_content'></div>
                            <div id='settings_close' class='common_app_dialogues_button common_link common_icon_button' >${props.icons.close}</div>
                        </div>
                        `;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                          commonMountdiv:string,
 *                          avatar:string|null
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon'],
 *                      SettingShow:function}}} props 
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    props.methods.COMMON.COMMON_DOCUMENT.querySelector(`#${props.data.commonMountdiv}`).classList.add('common_app_dialogues_show0');
    const onMounted =() =>{
        props.methods.SettingShow(1);
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({  iam_user_id:props.methods.COMMON.commonGlobalGet('iam_user_id'),
                                avatar:props.data.avatar,
                                icons:{
                                    regional:props.methods.COMMON.commonGlobalGet('ICONS').regional,
                                    gps:props.methods.COMMON.commonGlobalGet('ICONS').gps,
                                    design:props.methods.COMMON.commonGlobalGet('ICONS').misc_design,
                                    text:props.methods.COMMON.commonGlobalGet('ICONS').misc_text,
                                    prayer:props.methods.COMMON.commonGlobalGet('ICONS').misc_prayer,
                                    close:props.methods.COMMON.commonGlobalGet('ICONS').close
                                }
                            })
    };
};
export default component;