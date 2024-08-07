const template =`   <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_design_theme_day' class='common_icon'></div>
                            <div id='setting_themes_day_slider' class='slider'>
                                <div class='slider_wrapper'>
                                    <div id='slides_day' class='slides'>
                                        <AppSettingsThemesDay/>
                                    </div>
                                </div>
                            </div>
                            <div id='slider_prev_day' class='common_dialogue_button slider_prev common_icon'></div>
                            <div id='slider_next_day' class='common_dialogue_button slider_next common_icon'></div>
                            <div id='slider_theme_day_id'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_design_theme_month' class='common_icon'></div>
                            <div id='setting_themes_month_slider' class='slider'>
                                <div class='slider_wrapper'>
                                    <div id='slides_month' class='slides'>
                                        <AppSettingsThemesMonth/>
                                    </div>
                                </div>
                            </div>
                            <div id='slider_prev_month' class='common_dialogue_button slider_prev common_icon'></div>
                            <div id='slider_next_month' class='common_dialogue_button slider_next common_icon'></div>
                            <div id='slider_theme_month_id'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_design_theme_year' class='common_icon'></div>
                            <div id='setting_themes_year_slider' class='slider'>
                                <div class='slider_wrapper'>
                                    <div id='slides_year' class='slides'>
                                        <AppSettingsThemesYear/>
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
                            <select id='setting_select_report_papersize' >
                            <AppPapersize/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_design_highlight_row' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_report_highlight_row' >
                                <AppHighlightrow/>
                            </select>
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
 * @param {{common_document:import('../../../types.js').AppDocument,
 *          common_mountdiv:string,
 *          AppSettingsThemesDay:string,
 *          AppSettingsThemesMonth:string,
 *          AppSettingsThemesYear:string,
 *          AppPapersize:string,
 *          AppHighlightrow:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template
                    .replace('<AppSettingsThemesDay/>',props.AppSettingsThemesDay ?? '')
                    .replace('<AppSettingsThemesMonth/>',props.AppSettingsThemesMonth ?? '')
                    .replace('<AppSettingsThemesYear/>',props.AppSettingsThemesYear ?? '')
                    .replace('<AppPapersize/>',props.AppPapersize ?? '')
                    .replace('<AppHighlightrow/>',props.AppHighlightrow ?? '');
    };
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
};
export default method;