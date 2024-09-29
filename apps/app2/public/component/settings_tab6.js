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
 * @param {{data:       {
 *                      common_mountdiv:string,
 *                      app_id:number,
 *                      user_settings:import('../js//types.js').APP_user_setting_record
 *                      },
 *          methods:    {
 *                      common_document:import('../../../common_types.js').CommonAppDocument,
 *                      set_current_value:import('../../../common_types.js').CommonModuleCommon['set_current_value'],
 *                      component_setting_update:import('../js/app.js')['component_setting_update'],
 *                      ComponentRender:import('../../../common_types.js').CommonModuleCommon['ComponentRender'],
 *                      app_settings_get:import('../../../common_types.js').CommonModuleCommon['app_settings_get']
 *                       },
 *          lifecycle:  null}} props
 * @returns {Promise.<{ lifecycle:import('../../../common_types.js').CommonComponentLifecycleReturn, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const method = async props => {
    
    const onMounted = async () =>{
        const settings = await props.methods.app_settings_get();
        //Method
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_method',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'METHOD')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'METHOD')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'METHOD'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        //Method asr
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_asr',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'METHOD_ASR')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'METHOD_ASR')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'METHOD_ASR'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        //Highlatitude adjustment
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_highlatitude',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'HIGH_LATITUDE_ADJUSTMENT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'HIGH_LATITUDE_ADJUSTMENT')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'HIGH_LATITUDE_ADJUSTMENT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:null,
            path:'/common/component/common_select.js'});
        //Timeformat
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_timeformat',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'TIMEFORMAT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'TIMEFORMAT')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'TIMEFORMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        //Hijri date adjustment
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_hijri_adjustment',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'HIJRI_DATE_ADJUSTMENT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'HIJRI_DATE_ADJUSTMENT')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'HIJRI_DATE_ADJUSTMENT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:null,
            path:'/common/component/common_select.js'});
        //Iqamat
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_fajr',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_dhuhr',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_asr',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    null,
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_maghrib',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_isha',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});
        //Fasting start end
        await props.methods.ComponentRender({
            mountDiv:   'setting_select_report_show_fast_start_end',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'FAST_START_END')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'FAST_START_END')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_id == props.data.app_id && setting.app_setting_type_name == 'FAST_START_END'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {FFB:null},
            lifecycle:  null,
            path:       '/common/component/common_select.js'});

        props.methods.set_current_value('setting_select_method', props.data.user_settings.prayer_method);
        props.methods.component_setting_update('PRAYER', 'METHOD');
        props.methods.set_current_value('setting_select_asr', props.data.user_settings.prayer_asr_method);
        props.methods.set_current_value('setting_select_highlatitude', props.data.user_settings.prayer_high_latitude_adjustment);
        props.methods.set_current_value('setting_select_timeformat', props.data.user_settings.prayer_time_format);
        props.methods.set_current_value('setting_select_hijri_adjustment', props.data.user_settings.prayer_hijri_date_adjustment);
        props.methods.set_current_value('setting_select_report_iqamat_title_fajr', props.data.user_settings.prayer_fajr_iqamat);
        props.methods.set_current_value('setting_select_report_iqamat_title_dhuhr', props.data.user_settings.prayer_dhuhr_iqamat);
        props.methods.set_current_value('setting_select_report_iqamat_title_asr', props.data.user_settings.prayer_asr_iqamat);
        props.methods.set_current_value('setting_select_report_iqamat_title_maghrib', props.data.user_settings.prayer_maghrib_iqamat);
        props.methods.set_current_value('setting_select_report_iqamat_title_isha', props.data.user_settings.prayer_isha_iqamat);

        if (Number(props.data.user_settings.prayer_column_imsak_checked))
            props.methods.common_document.querySelector('#setting_checkbox_report_show_imsak').classList.add('checked');
        else
            props.methods.common_document.querySelector('#setting_checkbox_report_show_imsak').classList.remove('checked');
        if (Number(props.data.user_settings.prayer_column_sunset_checked))
            props.methods.common_document.querySelector('#setting_checkbox_report_show_sunset').classList.add('checked');
        else
            props.methods.common_document.querySelector('#setting_checkbox_report_show_sunset').classList.remove('checked');
        if (Number(props.data.user_settings.prayer_column_midnight_checked))
            props.methods.common_document.querySelector('#setting_checkbox_report_show_midnight').classList.add('checked');
        else
            props.methods.common_document.querySelector('#setting_checkbox_report_show_midnight').classList.remove('checked');
        props.methods.common_document.querySelector('#setting_select_report_show_fast_start_end').value = props.data.user_settings.prayer_column_fast_start_end;
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template()
    };
};
export default method;