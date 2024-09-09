/**
 * @module apps/app2/component/settings_tab1
 */

const template =`       <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_locale' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_locale' >
                                    <AppLocales/>
                                </select>	
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_timezone_current' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_timezone_current'></div>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_current_date_time_display'>...</div>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_timezone' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_report_timezone' >
                                    <AppTimezones/>
                                </select>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_report_date_time_display'>...</div>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_numbersystem' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_report_numbersystem' >
                                    <AppNumbersystem/>
                                </select>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_direction' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_report_direction' >
                                    <AppDirection/>
                                </select>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_locale_second' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_report_locale_second' >
                                    <AppLocalessecond/>
                                </select>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>      
                                <div id='setting_icon_regional_coltitle' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_report_coltitle' >
                                    <AppColumntitle/>
                                </select>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_arabic_script' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_report_arabic_script' >
                                    <AppArabicscript/>
                                </select>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_calendartype' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_calendartype' >
                                    <AppCalendartype/>
                                </select>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>
                        <div class='setting_horizontal_row'>
                            <div class='setting_horizontal_col'></div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_regional_calendar_hijri_type' class='common_icon'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <select id='setting_select_calendar_hijri_type' >
                                    <AppCalendarhijritype/>
                                </select>
                            </div>
                            <div class='setting_horizontal_col'></div>
                        </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          AppLocales:string,
 *          AppTimezones:string,
 *          AppNumbersystem:string,
 *          AppDirection:string,
 *          AppLocalessecond:string,
 *          AppColumntitle:string,
 *          AppArabicscript:string,
 *          AppCalendartype:string,
 *          AppCalendarhijritype:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template
                    .replace('<AppLocales/>',props.AppLocales ?? '')
                    .replace('<AppTimezones/>',props.AppTimezones ?? '')
                    .replace('<AppNumbersystem/>',props.AppNumbersystem ?? '')
                    .replace('<AppDirection/>',props.AppDirection ?? '')
                    .replace('<AppLocalessecond/>',props.AppLocalessecond ?? '')
                    .replace('<AppColumntitle/>',props.AppColumntitle ?? '')
                    .replace('<AppArabicscript/>',props.AppArabicscript ?? '')
                    .replace('<AppCalendartype/>',props.AppCalendartype ?? '')
                    .replace('<AppCalendarhijritype/>',props.AppCalendarhijritype ?? '');
    };
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
};
export default method;