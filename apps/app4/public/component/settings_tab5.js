/**
 * Settings tab 5
 * @module apps/app4/component/settings_tab5
 */
/**
 * @import {CommonAppDataRecord, CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
 * @import {appComponentSettingUpdate}  from '../js/app.js'
 * @import {APP_user_setting_record, APP_REPORT_GLOBAL}  from '../js/types.js'
 */

/**
 * @name template
 * @description Template
 * @returns {string}
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
 * @name component
 * @description Component
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      app_id:number,
 *                      user_settings:APP_user_setting_record,
 *                      methods:APP_REPORT_GLOBAL['CommonModulePrayTimes_methods']
 *                      },
 *          methods:    {
 *                      COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      appComponentSettingUpdate:appComponentSettingUpdate,
 *                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                      commonFFB:CommonModuleCommon['commonFFB'],
 *                      commonMiscSelectCurrentValueSet:CommonModuleCommon['commonMiscSelectCurrentValueSet'],
 *                      commonWindowFromBase64:CommonModuleCommon['commonWindowFromBase64']
 *                       }}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    //fetch all settings for current app id
    /**@type{CommonAppDataRecord[]} */
    const settings = await props.methods.commonFFB({path:'/server-db/appdata/',
                                                    query:`IAM_data_app_id=${props.data.app_id}`,
                                                    method:'GET', 
                                                    authorization_type:'APP_ID'}).then((/**@type{string}*/result)=>JSON.parse(props.methods.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
    const onMounted = async () =>{
        //Method
        await props.methods.commonComponentRender({ 
            mountDiv:   'setting_select_method',
            data:       {
                        default_data_value: Object.entries(props.data.methods).map(method=>{return {value:method[0], text:method[1].name};})[0].value,
                        default_value:      Object.entries(props.data.methods).map(method=>{return {value:method[0], text:method[1].name};})[0].text,
                        options:            Object.entries(props.data.methods).map(method=>{return {value:method[0], text:method[1].name};}),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //Method asr
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_asr',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'METHOD_ASR')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'METHOD_ASR')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'METHOD_ASR'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //Highlatitude adjustment
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_highlatitude',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'HIGH_LATITUDE_ADJUSTMENT')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'HIGH_LATITUDE_ADJUSTMENT')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'HIGH_LATITUDE_ADJUSTMENT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:'/common/component/common_select.js'});
        //Timeformat
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_timeformat',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'TIMEFORMAT')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'TIMEFORMAT')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'TIMEFORMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //Hijri date adjustment
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_hijri_adjustment',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'HIJRI_DATE_ADJUSTMENT')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'HIJRI_DATE_ADJUSTMENT')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'HIJRI_DATE_ADJUSTMENT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:'/common/component/common_select.js'});
        //Iqamat
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_fajr',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_dhuhr',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_asr',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_maghrib',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_isha',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'IQAMAT'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //Fasting start end
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_show_fast_start_end',
            data:       {
                        default_data_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'FAST_START_END')[0].value,
                        default_value:settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'FAST_START_END')[0].display_data,
                        options: settings.filter(setting=>setting.app_id == props.data.app_id && setting.name == 'FAST_START_END'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'display_data'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});

        props.methods.commonMiscSelectCurrentValueSet('setting_select_method', props.data.user_settings.prayer_method);
        props.methods.appComponentSettingUpdate('PRAYER', 'METHOD');
        props.methods.commonMiscSelectCurrentValueSet('setting_select_asr', props.data.user_settings.prayer_asr_method);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_highlatitude', props.data.user_settings.prayer_high_latitude_adjustment);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_timeformat', props.data.user_settings.prayer_time_format);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_hijri_adjustment', props.data.user_settings.prayer_hijri_date_adjustment);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_iqamat_title_fajr', props.data.user_settings.prayer_fajr_iqamat);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_iqamat_title_dhuhr', props.data.user_settings.prayer_dhuhr_iqamat);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_iqamat_title_asr', props.data.user_settings.prayer_asr_iqamat);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_iqamat_title_maghrib', props.data.user_settings.prayer_maghrib_iqamat);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_iqamat_title_isha', props.data.user_settings.prayer_isha_iqamat);
        
        if (Number(props.data.user_settings.prayer_column_imsak_checked))
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_imsak').classList.add('checked');
        else
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_imsak').classList.remove('checked');
        if (Number(props.data.user_settings.prayer_column_sunset_checked))
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_sunset').classList.add('checked');
        else
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_sunset').classList.remove('checked');
        if (Number(props.data.user_settings.prayer_column_midnight_checked))
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_midnight').classList.add('checked');
        else
            props.methods.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_midnight').classList.remove('checked');
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_show_fast_start_end', props.data.user_settings.prayer_column_fast_start_end);
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template()
    };
};
export default component;