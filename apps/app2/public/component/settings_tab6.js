/**
 * @module apps/app2/component/settings_tab6
 */

const template = () =>`   <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_method' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_method'></div>
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
                            <div id='setting_select_asr'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_highlatitude' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_highlatitude'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_timeformat' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_timeformat'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_hijri_adjustment' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_hijri_adjustment'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_fajr' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_report_iqamat_title_fajr'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_dhuhr' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_report_iqamat_title_dhuhr'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_asr' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_report_iqamat_title_asr'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_maghrib' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_report_iqamat_title_maghrib'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>
                    <div class='setting_horizontal_row'>
                        <div class='setting_horizontal_col'></div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_icon_prayer_report_iqamat_title_isha' class='common_icon'></div>
                        </div>
                        <div class='setting_horizontal_col'>
                            <div id='setting_select_report_iqamat_title_isha'></div>
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
                            <div id='setting_select_report_show_fast_start_end'></div>
                        </div>
                        <div class='setting_horizontal_col'></div>
                    </div>`;
/**
 * 
 * @param {{common_document:import('../../../common_types.js').CommonAppDocument,
 *          common_mountdiv:string,
 *          app_id:number,
 *          user_settings:import('../js//types.js').APP_user_setting_record,
 *          function_set_current_value:function,
 *          function_component_setting_update:function,
 *          function_ComponentRender:function,
 *          function_app_settings_get:function}} props 
 * @returns {Promise.<{ props:{function_post:function}, 
 *                      data:null, 
 *                      template:string}>}
 */
const method = async props => {
    
    const post_component = async () =>{
        /**@type{[{value:string, data2:string, data3:string, data4:string, data5:string, text:string}]} */
        const settings = await props.function_app_settings_get();
        //Method
        await props.function_ComponentRender('setting_select_method',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'METHOD')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'METHOD')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'METHOD'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        //Method asr
        await props.function_ComponentRender('setting_select_asr',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'METHOD_ASR')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'METHOD_ASR')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'METHOD_ASR'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        //Highlatitude adjustment
        await props.function_ComponentRender('setting_select_highlatitude',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'HIGH_LATITUDE_ADJUSTMENT')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'HIGH_LATITUDE_ADJUSTMENT')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'HIGH_LATITUDE_ADJUSTMENT'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        //Timeformat
        await props.function_ComponentRender('setting_select_timeformat',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'TIMEFORMAT')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'TIMEFORMAT')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'TIMEFORMAT'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        //Hijri date adjustment
        await props.function_ComponentRender('setting_select_hijri_adjustment',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'HIJRI_DATE_ADJUSTMENT')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'HIJRI_DATE_ADJUSTMENT')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'HIJRI_DATE_ADJUSTMENT'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        //Iqamat
        await props.function_ComponentRender('setting_select_report_iqamat_title_fajr',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        await props.function_ComponentRender('setting_select_report_iqamat_title_dhuhr',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        await props.function_ComponentRender('setting_select_report_iqamat_title_asr',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        await props.function_ComponentRender('setting_select_report_iqamat_title_maghrib',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        await props.function_ComponentRender('setting_select_report_iqamat_title_isha',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'IQAMAT'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');
        //Fasting start end
        await props.function_ComponentRender('setting_select_report_show_fast_start_end',
            {
                default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'FAST_START_END')[0].value,
                default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'FAST_START_END')[0].text,
                options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.app_id && setting.app_setting_type_name == 'FAST_START_END'),
                path:null,
                query:null,
                method:null,
                authorization_type:null,
                column_value:'value',
                column_text:'text',
                function_FFB:null
            }, '/common/component/select.js');

        props.function_set_current_value('setting_select_method', props.user_settings.prayer_method);
        props.function_component_setting_update('PRAYER', 'METHOD');
        props.function_set_current_value('setting_select_asr', props.user_settings.prayer_asr_method);
        props.function_set_current_value('setting_select_highlatitude', props.user_settings.prayer_high_latitude_adjustment);
        props.function_set_current_value('setting_select_timeformat', props.user_settings.prayer_time_format);
        props.function_set_current_value('setting_select_hijri_adjustment', props.user_settings.prayer_hijri_date_adjustment);
        props.function_set_current_value('setting_select_report_iqamat_title_fajr', props.user_settings.prayer_fajr_iqamat);
        props.function_set_current_value('setting_select_report_iqamat_title_dhuhr', props.user_settings.prayer_dhuhr_iqamat);
        props.function_set_current_value('setting_select_report_iqamat_title_asr', props.user_settings.prayer_asr_iqamat);
        props.function_set_current_value('setting_select_report_iqamat_title_maghrib', props.user_settings.prayer_maghrib_iqamat);
        props.function_set_current_value('setting_select_report_iqamat_title_isha', props.user_settings.prayer_isha_iqamat);

        if (Number(props.user_settings.prayer_column_imsak_checked))
            props.common_document.querySelector('#setting_checkbox_report_show_imsak').classList.add('checked');
        else
            props.common_document.querySelector('#setting_checkbox_report_show_imsak').classList.remove('checked');
        if (Number(props.user_settings.prayer_column_sunset_checked))
            props.common_document.querySelector('#setting_checkbox_report_show_sunset').classList.add('checked');
        else
            props.common_document.querySelector('#setting_checkbox_report_show_sunset').classList.remove('checked');
        if (Number(props.user_settings.prayer_column_midnight_checked))
            props.common_document.querySelector('#setting_checkbox_report_show_midnight').classList.add('checked');
        else
            props.common_document.querySelector('#setting_checkbox_report_show_midnight').classList.remove('checked');
        props.common_document.querySelector('#setting_select_report_show_fast_start_end').value = props.user_settings.prayer_column_fast_start_end;
    };
    return {
        props:  {function_post:post_component},
        data:   null,
        template: template()
    };
};
export default method;