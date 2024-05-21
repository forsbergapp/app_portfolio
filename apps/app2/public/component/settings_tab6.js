/**@type{import('../../../types.js').AppDocument} */
const AppDocument = document;
const template =`   <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_method' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_method' >
                                <AppMethod/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_method_params'>
                                <div id='setting_method_param_fajr'></div>
                                <div id='setting_method_param_isha'></div>
                            </div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_asr' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_asr' >
                                <AppMethodAsr/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_highlatitude' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_highlatitude' >
                                <AppHighlatitudeadjustment/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_timeformat' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_timeformat' >
                                <AppTimeformat/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_hijri_adjustment' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_hijri_adjustment' >
                                <AppHijridateadjustment/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_fajr' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_report_iqamat_title_fajr' >
                                <AppIqamat/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_dhuhr' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_report_iqamat_title_dhuhr' >
                                <AppIqamat/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_asr' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_report_iqamat_title_asr' >
                                <AppIqamat/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_maghrib' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_report_iqamat_title_maghrib' >
                                <AppIqamat/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_isha' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_report_iqamat_title_isha' >
                                <AppIqamat/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_show_imsak' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_checkbox_report_show_imsak' class='common_switch'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_show_sunset' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_checkbox_report_show_sunset' class='common_switch'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_show_midnight' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_checkbox_report_show_midnight' class='common_switch'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_show_fast_start_end' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <select id='setting_select_report_show_fast_start_end' >
                                <AppFaststartend/>
                            </select>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>`;
/**
 * 
 * @param {{common_document:AppDocument,
 *          common_mountdiv:string,
 *          AppMethod:string,
 *          AppMethodAsr:string,
 *          AppHighlatitudeadjustment:string,
 *          AppTimeformat:string,
 *          AppHijridateadjustment :string,
 *          AppIqamat:string,
 *          AppFaststartend:string}} props 
 * @returns {Promise.<{ props:{function_post:null}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const render_template = () =>{
        return template
                    .replace('<AppMethod/>',props.AppMethod ?? '')
                    .replace('<AppMethodAsr/>',props.AppMethodAsr ?? '')
                    .replace('<AppHighlatitudeadjustment/>',props.AppHighlatitudeadjustment ?? '')
                    .replace('<AppTimeformat/>',props.AppTimeformat ?? '')
                    .replace('<AppHijridateadjustment/>',props.AppHijridateadjustment ?? '')
                    .replaceAll('<AppIqamat/>',props.AppIqamat ?? '')
                    .replace('<AppFaststartend/>',props.AppFaststartend ?? '');
    }
    return {
        props:  {function_post:null},
        data:   null,
        template: render_template()
    };
}
export default method;