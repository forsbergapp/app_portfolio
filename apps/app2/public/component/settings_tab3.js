/**
 * @module apps/app2/component/settings_tab3
 */
/**
 * @param {{spinner:string,
 *                  settings_themes:[{app_setting_type_name:string, value:string}]|[]}} props
 */
const template = props =>`  <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_theme_day' class='common_icon ${props.spinner}'></div>
                                    <div id='setting_themes_day_slider' class='slider'>
                                        <div class='slider_wrapper'>
                                            <div id='slides_day' class='slides'>
                                                ${props.settings_themes.filter(theme=>theme.app_setting_type_name.indexOf('DAY')>-1).map(theme=>
                                                    `<div class="slide slide_day">
                                                        <div id='theme_day_${theme.value}' data-theme_id='${theme.value}'> 
                                                        </div>
                                                    </div>`
                                                ).join('')
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div id='slider_prev_day' class='common_dialogue_button slider_prev common_icon'></div>
                                    <div id='slider_next_day' class='common_dialogue_button slider_next common_icon'></div>
                                    <div id='slider_theme_day_id'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_theme_month' class='common_icon ${props.spinner}'></div>
                                    <div id='setting_themes_month_slider' class='slider '>
                                        <div class='slider_wrapper'>
                                            <div id='slides_month' class='slides'>
                                                ${props.settings_themes.filter(theme=>theme.app_setting_type_name.indexOf('MONTH')>-1).map(theme=>
                                                    `<div class="slide slide_month">
                                                        <div id='theme_month_${theme.value}' data-theme_id='${theme.value}'> 
                                                        </div>
                                                    </div>`
                                                ).join('')
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div id='slider_prev_month' class='common_dialogue_button slider_prev common_icon'></div>
                                    <div id='slider_next_month' class='common_dialogue_button slider_next common_icon'></div>
                                    <div id='slider_theme_month_id'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_design_theme_year' class='common_icon ${props.spinner}'></div>
                                    <div id='setting_themes_year_slider' class='slider'>
                                        <div class='slider_wrapper'>
                                            <div id='slides_year' class='slides'>
                                                ${props.settings_themes.filter(theme=>theme.app_setting_type_name.indexOf('YEAR')>-1).map(theme=>
                                                    `<div class="slide slide_year">
                                                        <div id='theme_year_${theme.value}' data-theme_id='${theme.value}'> 
                                                        </div>
                                                    </div>`
                                                ).join('')
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div id='slider_prev_year' class='common_dialogue_button slider_prev common_icon'></div>
                                    <div id='slider_next_year' class='common_dialogue_button slider_next common_icon'></div>
                                    <div id='slider_theme_year_id'></div>
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
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          function_load_themes:function,
 *          function_update_all_theme_thumbnails:function
 *          function_ComponentRender:function,
 *          function_app_settings_get:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {

    const post_component = async () =>{
        const settings = await props.function_app_settings_get();
        props.common_document.querySelector(`#${props.common_mountdiv}`).innerHTML = template({ spinner:'', 
                                                                                                settings_themes:settings.filter((/**@type{*}*/setting)=>
                                                                                                    setting.app_id == props.app_id && 
                                                                                                    setting.app_setting_type_name.startsWith('REPORT_THEME'))});
        //
        //paper size
        await props.function_ComponentRender('setting_select_report_papersize', 
            {
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
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        //highlight row
        await props.function_ComponentRender('setting_select_report_highlight_row',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>
                                        setting.app_id == props.app_id && 
                                        setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW'))[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>
                                setting.app_id == props.app_id && 
                                setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW'))[0].text,
                options: settings.filter((/**@type{*}*/setting)=>
                            setting.app_id == props.app_id && 
                            setting.app_setting_type_name.startsWith('HIGHLIGHT_ROW')),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        props.function_load_themes();
        props.function_update_all_theme_thumbnails();
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template({spinner:'css_spinner',settings_themes:[]})
    };
};
export default method;