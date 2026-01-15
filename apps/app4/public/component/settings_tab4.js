/**
 * Settings tab 4
 * @module apps/app4/component/settings_tab4
 */
/**
 * @import {common}  from '../../../common_types.js'
 * @import {appComponentSettingUpdate}  from '../js/app.js'
 * @import {APP_user_setting_record}  from '../js/types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param{{icons:{
 *               theme_day:string,
 *               theme_month:string,
 *               theme_year:string,
 *               aleft:string,
 *               acenter:string,
 *               aright:string}}} props
 * @returns {string}
 */
const template = props =>` <div class='settings_row'>
                                <div >
                                    <div id='setting_icon_text_theme_day' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.theme_day}</div>
                                    <div id='setting_icon_text_theme_month' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.theme_month}</div>
                                    <div id='setting_icon_text_theme_year' class='common_app_dialogues_button common_link common_icon_button'>${props.icons.theme_year}</div>
                                </div>
                                <div id='setting_paper_preview_text' class='setting_paper_preview'>
                                    <div id='setting_paper_preview_header_text' class='setting_paper_preview_header'>
                                        <div id='setting_input_header'>
                                            <div id='setting_input_reportheader1' contentEditable='true' class='common_input display_font'></div>
                                            <div id='setting_input_reportheader2' contentEditable='true' class='common_input display_font'></div>
                                            <div id='setting_input_reportheader3' contentEditable='true' class='common_input display_font'></div>
                                        </div>
                                        <div id='setting_icon_text_header_aleft' class='setting_button common_link common_icon_button' >${props.icons.aleft}</div>
                                        <div id='setting_icon_text_header_acenter' class='setting_button common_link common_icon_button' >${props.icons.acenter}</div>
                                        <div id='setting_icon_text_header_aright' class='setting_button common_link common_icon_button' >${props.icons.aright}</div>
                                    </div>
                                    <div id='setting_paper_preview_footer_text' class='setting_paper_preview_footer'>
                                        <div id='setting_icon_text_footer_aleft' class='setting_button common_link common_icon_button' >${props.icons.aleft}</div>
                                        <div id='setting_icon_text_footer_acenter' class='setting_button common_link common_icon_button' >${props.icons.acenter}</div>
                                        <div id='setting_icon_text_footer_aright' class='setting_button common_link common_icon_button' >${props.icons.aright}</div>
                                        <div id='setting_input_footer'>
                                            <div id='setting_input_reportfooter1' contentEditable='true' class='common_input display_font'></div>
                                            <div id='setting_input_reportfooter2' contentEditable='true' class='common_input display_font'></div>
                                            <div id='setting_input_reportfooter3' contentEditable='true' class='common_input display_font'></div>
                                        </div>
                                    </div>
                                </div>
                        </div>`;
/**
 * @name component
 * @description Component
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_settings:APP_user_setting_record
 *                      },
 *          methods:    {
 *                       COMMON:common['CommonModuleCommon'],
 *                       appComponentSettingUpdate:appComponentSettingUpdate
 *                       }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const onMounted = async () =>{
        //Text
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportheader1').textContent = props.data.user_settings.TextHeader1Text;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportheader2').textContent = props.data.user_settings.TextHeader2Text;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportheader3').textContent = props.data.user_settings.TextHeader3Text;
        if (props.data.user_settings.TextHeaderAlign == null) {
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_header_aleft').classList.remove('setting_button_active');
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_header_acenter').classList.remove('setting_button_active');
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_header_aright').classList.remove('setting_button_active');
        } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
            //remove active class if it is active
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(  '#setting_icon_text_header_a' + 
                                        props.data.user_settings.TextHeaderAlign).classList.remove('setting_button_active');
            props.methods.appComponentSettingUpdate('TEXT', 'HEADER_ALIGN', 'setting_icon_text_header_a' + props.data.user_settings.TextHeaderAlign);
        }
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportfooter1').textContent = props.data.user_settings.TextFooter1Text;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportfooter2').textContent = props.data.user_settings.TextFooter2Text;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportfooter3').textContent = props.data.user_settings.TextFooter3Text;
        if (props.data.user_settings.TextFooterAlign == null) {
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_footer_aleft').classList.remove('setting_button_active');
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_footer_acenter').classList.remove('setting_button_active');
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_footer_aright').classList.remove('setting_button_active');
        } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
            //remove active class if it is active
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_footer_a' +
                props.data.user_settings.TextFooterAlign).classList.remove('setting_button_active');
            props.methods.appComponentSettingUpdate('TEXT', 'FOOTER_ALIGN', 'setting_icon_text_footer_a' + props.data.user_settings.TextFooterAlign);
        }
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_theme_day').dispatchEvent(new Event('click'));
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({icons:{
                                        theme_day:props.methods.COMMON.commonGlobalGet('ICONS').regional_day,
                                        theme_month:props.methods.COMMON.commonGlobalGet('ICONS').regional_month,
                                        theme_year:props.methods.COMMON.commonGlobalGet('ICONS').regional_year,
                                        aleft:props.methods.COMMON.commonGlobalGet('ICONS').align_left,
                                        acenter:props.methods.COMMON.commonGlobalGet('ICONS').align_center,
                                        aright:props.methods.COMMON.commonGlobalGet('ICONS').align_right
                            }})
    };
};
export default component;