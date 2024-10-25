/**
 * Setings tab 3
 * @module apps/app2/component/settings_tab3
 */
/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @typedef {CommonModuleCommon['commonDbAppSettingsGet']} commonDbAppSettingsGet
 * @typedef {CommonModuleCommon['commonSelectCurrentValueSet']} commonSelectCurrentValueSet
 * @typedef {CommonModuleCommon['commonComponentRender']} commonComponentRender
 * @import {appSettingThemeThumbnailsUpdate}  from '../js/app.js'
 * @import {APP_GLOBAL, APP_user_setting_record}  from '../js/types.js'
 * @typedef {APP_GLOBAL['themes']} themes
 */

/**
 * @param {{theme_id_day:string,
 *          theme_id_month:string,
 *          theme_id_year:string}} props
 * @returns {string}
 */
const template = props =>`  <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_day' class='common_icon'></div>
                                    <div id='setting_design_theme_day' class='setting_design_thumbnail' data-theme_id='${props.theme_id_day}'></div>
                                    <div id='setting_design_prev_day' class='common_dialogue_button setting_design_prev common_icon'></div>
                                    <div id='setting_design_next_day' class='common_dialogue_button setting_design_next common_icon'></div>
                                    <div id='setting_design_theme_day_id'>${props.theme_id_day}</div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_month' class='common_icon'></div>
                                    <div id='setting_design_theme_month' class='setting_design_thumbnail' data-theme_id='${props.theme_id_month}'></div>
                                    <div id='setting_design_prev_month' class='common_dialogue_button setting_design_prev common_icon'></div>
                                    <div id='setting_design_next_month' class='common_dialogue_button setting_design_next common_icon'></div>
                                    <div id='setting_design_theme_month_id'>${props.theme_id_month}</div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_design_icon_theme_year' class='common_icon'></div>
                                    <div id='setting_design_theme_year' class='setting_design_thumbnail' data-theme_id='${props.theme_id_year}'></div>
                                    <div id='setting_design_prev_year' class='common_dialogue_button setting_design_prev common_icon'></div>
                                    <div id='setting_design_next_year' class='common_dialogue_button setting_design_next common_icon'></div>
                                    <div id='setting_design_theme_year_id'>${props.theme_id_year}</div>
                                </div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_papersize' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_report_papersize' ></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_highlight_row' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_report_highlight_row' ></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_weekday' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_weekday' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_calendartype' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_calendartype' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_notes' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_notes' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_gps' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_gps' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_show_timezone' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_checkbox_report_show_timezone' class='common_switch'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>`;
/**
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      user_settings:APP_user_setting_record,
 *                      themes:themes
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      appSettingThemeThumbnailsUpdate:appSettingThemeThumbnailsUpdate,
 *                      commonSelectCurrentValueSet:commonSelectCurrentValueSet,
 *                      commonComponentRender:commonComponentRender,
 *                      commonDbAppSettingsGet:commonDbAppSettingsGet}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {

    const settings = await props.methods.commonDbAppSettingsGet();
    //update APP_GLOBAL with themes
    /**@type{import('../js//types.js').APP_GLOBAL['themes']} */
    props.data.themes.data = settings.filter(setting=>
            setting.app_id == props.data.app_id && 
            setting.app_setting_type_name.startsWith('REPORT_THEME'))
            .map(theme=>{
                return {type:theme.app_setting_type_name, value:theme.value, text:theme.text};
            });

    const onMounted = async () =>{
        //paper size
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_papersize',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>
                                                setting.app_setting_type_name.startsWith('PAPER_SIZE'))[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>
                                        setting.app_setting_type_name.startsWith('PAPER_SIZE'))[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>
                                    setting.app_setting_type_name.startsWith('PAPER_SIZE')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //highlight row
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_highlight_row',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>
                                                setting.app_id == props.data.app_id && 
                                                setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW'))[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>
                                        setting.app_id == props.data.app_id && 
                                        setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW'))[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>
                                    setting.app_id == props.data.app_id && 
                                    setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:'/common/component/common_select.js'});

        props.methods.commonSelectCurrentValueSet('setting_select_report_papersize', props.data.user_settings.design_paper_size);
        
        props.methods.COMMON_DOCUMENT.querySelector('#paper').className=props.data.user_settings.design_paper_size;

        props.methods.commonSelectCurrentValueSet('setting_select_report_highlight_row', props.data.user_settings.design_row_highlight);

        if (Number(props.data.user_settings.design_column_weekday_checked))
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_weekday').classList.add('checked');
        else
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_weekday').classList.remove('checked');
        if (Number(props.data.user_settings.design_column_calendartype_checked))
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_calendartype').classList.add('checked');
        else
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_calendartype').classList.remove('checked');
        if (Number(props.data.user_settings.design_column_notes_checked))
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_notes').classList.add('checked');
        else
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_notes').classList.remove('checked');
        if (Number(props.data.user_settings.design_column_gps_checked))
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_gps').classList.add('checked');
        else
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_gps').classList.remove('checked');
        if (Number(props.data.user_settings.design_column_timezone_checked))
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_timezone').classList.add('checked');
        else
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_timezone').classList.remove('checked');

        props.methods.appSettingThemeThumbnailsUpdate();
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({
                            theme_id_day:props.data.user_settings.design_theme_day_id,
                            theme_id_month:props.data.user_settings.design_theme_month_id,
                            theme_id_year:props.data.user_settings.design_theme_year_id})
    };
};
export default method;