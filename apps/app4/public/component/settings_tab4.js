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
 * @returns {string}
 */
const template = () =>` <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_text_theme_col'>
                                    <div id='setting_icon_text_theme_day' class='common_dialogue_button common_icon'></div>
                                    <div id='setting_icon_text_theme_month' class='common_dialogue_button common_icon'></div>
                                    <div id='setting_icon_text_theme_year' class='common_dialogue_button common_icon'></div>
                                </div>
                                <div id='setting_paper_preview_text' class='setting_paper_preview'>
                                    <div id='setting_paper_preview_header_text' class='setting_paper_preview_header'>
                                        <div id='setting_input_header'>
                                            <div id='setting_input_reportheader1' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                            <div id='setting_input_reportheader2' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                            <div id='setting_input_reportheader3' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                        </div>
                                        <div id='setting_icon_text_header_aleft' class='setting_button common_icon' ></div>
                                        <div id='setting_icon_text_header_acenter' class='setting_button common_icon' ></div>
                                        <div id='setting_icon_text_header_aright' class='setting_button common_icon' ></div>
                                    </div>
                                    <div class='setting_paper_preview_space'></div>
                                    <div id='setting_paper_preview_footer_text' class='setting_paper_preview_footer'>
                                        <div id='setting_icon_text_footer_aleft' class='setting_button common_icon' ></div>
                                        <div id='setting_icon_text_footer_acenter' class='setting_button common_icon' ></div>
                                        <div id='setting_icon_text_footer_aright' class='setting_button common_icon' ></div>
                                        <div id='setting_input_footer'>
                                            <div id='setting_input_reportfooter1' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                            <div id='setting_input_reportfooter2' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                            <div id='setting_input_reportfooter3' contentEditable='true' class='common_input setting_report_title display_font'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>        
                            <div class='setting_horizontal_col'></div>
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
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportheader1').textContent = props.data.user_settings.text_header_1_text;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportheader2').textContent = props.data.user_settings.text_header_2_text;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportheader3').textContent = props.data.user_settings.text_header_3_text;
        if (props.data.user_settings.text_header_align == null) {
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_header_aleft').classList.remove('setting_button_active');
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_header_acenter').classList.remove('setting_button_active');
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_header_aright').classList.remove('setting_button_active');
        } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
            //remove active class if it is active
            props.methods.COMMON.COMMON_DOCUMENT.querySelector(  '#setting_icon_text_header_a' + 
                                        props.data.user_settings.text_header_align).classList.remove('setting_button_active');
            props.methods.appComponentSettingUpdate('TEXT', 'HEADER_ALIGN', 'setting_icon_text_header_a' + props.data.user_settings.text_header_align);
        }
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportfooter1').textContent = props.data.user_settings.text_footer_1_text;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportfooter2').textContent = props.data.user_settings.text_footer_2_text;
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_input_reportfooter3').textContent = props.data.user_settings.text_footer_3_text;
        if (props.data.user_settings.text_footer_align == null) {
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_footer_aleft').classList.remove('setting_button_active');
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_footer_acenter').classList.remove('setting_button_active');
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_footer_aright').classList.remove('setting_button_active');
        } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
            //remove active class if it is active
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_footer_a' +
                props.data.user_settings.text_footer_align).classList.remove('setting_button_active');
            props.methods.appComponentSettingUpdate('TEXT', 'FOOTER_ALIGN', 'setting_icon_text_footer_a' + props.data.user_settings.text_footer_align);
        }
        props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_icon_text_theme_day').dispatchEvent(new Event('click'));
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;