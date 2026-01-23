/**
 * Settings tab 5
 * @module apps/app4/component/settings_tab5
 */
/**
 * @import {common}  from '../../../common_types.js'
 * @import {appComponentSettingUpdate}  from '../js/app.js'
 * @import {APP_user_setting_record, APP_REPORT_GLOBAL}  from '../js/types.js'
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{icons:{
 *                  method:string,
 *                  asr:string,
 *                  highlatitude:string,
 *                  timeformat:string,
 *                  hijri_adjustment:string,
 *                  iqamat_fajr:string,
 *                  iqamat_dhuhr:string,
 *                  iqamat_asr:string,
 *                  iqamat_maghrib:string,
 *                  iqamat_isha:string,
 *                  show_imsak:string,
 *                  show_sunset:string,
 *                  show_midnight:string,
 *                  show_fast_start_end:string}}} props
 * @returns {string}
 */
const template = props =>`   <div class='settings_row'>
                                <div >${props.icons.method}</div>
                                <div id='setting_select_method'></div>
                            </div>
                            <div class='settings_row'>
                                <div ></div>
                                <div id='setting_method_params'>
                                    <div id='setting_method_param_fajr'></div>
                                    <div id='setting_method_param_isha'></div>
                                </div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.asr}</div>
                                <div id='setting_select_asr'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.highlatitude}</div>
                                <div id='setting_select_highlatitude'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.timeformat}</div>
                                <div id='setting_select_timeformat'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.hijri_adjustment}</div>
                                <div id='setting_select_hijri_adjustment'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.iqamat_fajr}</div>
                                <div id='setting_select_report_iqamat_title_fajr'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.iqamat_dhuhr}</div>
                                <div id='setting_select_report_iqamat_title_dhuhr'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.iqamat_asr}</div>
                                <div id='setting_select_report_iqamat_title_asr'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.iqamat_maghrib}</div>
                                <div id='setting_select_report_iqamat_title_maghrib'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.iqamat_isha}</div>
                                <div id='setting_select_report_iqamat_title_isha'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_imsak}</div>
                                <div id='setting_checkbox_report_show_imsak' class='common_switch'></div>                                
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_sunset}</div>
                                <div id='setting_checkbox_report_show_sunset' class='common_switch'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_midnight}</div>
                                <div id='setting_checkbox_report_show_midnight' class='common_switch'></div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.show_fast_start_end}</div>
                                <div id='setting_select_report_show_fast_start_end'></div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_settings:APP_user_setting_record,
 *                      methods:APP_REPORT_GLOBAL['CommonModulePrayTimes_methods']
 *                      },
 *          methods:    {
 *                      COMMON:common['CommonModuleCommon'],
 *                      appComponentSettingUpdate:appComponentSettingUpdate
 *                       }}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const onMounted = async () =>{
        //Method
        await props.methods.COMMON.commonComponentRender({ 
            mountDiv:   'setting_select_method',
            data:       {
                        default_data_value: Object.entries(props.data.methods).map(method=>{return {value:method[0], text:method[1].name};})[0].value,
                        default_value:      Object.entries(props.data.methods).map(method=>{return {value:method[0], text:method[1].name};})[0].text,
                        options:            Object.entries(props.data.methods).map(method=>{return {value:method[0], text:method[1].name};}),
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //Method asr
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_asr',
            data:       {
                        default_data_value:props.data.user_settings.PrayerAsrMethod,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'METHOD_ASR',
                                                                                    props.data.user_settings.PrayerAsrMethod))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'METHODA_ASR'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //Highlatitude adjustment
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_highlatitude',
            data:       {
                        default_data_value:props.data.user_settings.PrayerHighLatitudeAdjustment,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'HIGH_LATITUDE_ADJUSTMENT',
                                                                                    props.data.user_settings.PrayerHighLatitudeAdjustment))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'HIGH_LATITUDE_ADJUSTMENT'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //Timeformat
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_timeformat',
            data:       {
                        default_data_value:props.data.user_settings.PrayerTimeFormat,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'TIMEFORMAT',
                                                                                    props.data.user_settings.PrayerTimeFormat))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'TIMEFORMAT'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //Hijri date adjustment
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_hijri_adjustment',
            data:       {
                        default_data_value:props.data.user_settings.PrayerHijriDateAdjustment,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'HIJRI_DATE_ADJUSTMENT',
                                                                                    props.data.user_settings.PrayerHijriDateAdjustment.toString()))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'HIJRI_DATE_ADJUSTMENT'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:'/common/component/common_select.js'});
        //Iqamat
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_fajr',
            data:       {
                        default_data_value:props.data.user_settings.PrayerFajrIqamat,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'IQAMAT',
                                                                                    props.data.user_settings.PrayerFajrIqamat))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'IQAMAT'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_dhuhr',
            data:       {
                        default_data_value:props.data.user_settings.PrayerDhuhrIqamat,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'IQAMAT',
                                                                                    props.data.user_settings.PrayerDhuhrIqamat))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'IQAMAT'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_asr',
            data:       {
                        default_data_value:props.data.user_settings.PrayerAsrIqamat,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'IQAMAT',
                                                                                    props.data.user_settings.PrayerAsrIqamat))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'IQAMAT'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_maghrib',
            data:       {
                        default_data_value:props.data.user_settings.PrayerMaghribIqamat,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'IQAMAT',
                                                                                    props.data.user_settings.PrayerMaghribIqamat))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'IQAMAT'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_iqamat_title_isha',
            data:       {
                        default_data_value:props.data.user_settings.PrayerIshaIqamat,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'IQAMAT',
                                                                                    props.data.user_settings.PrayerIshaIqamat))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'IQAMAT'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //Fasting start end
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_show_fast_start_end',
            data:       {
                        default_data_value:props.data.user_settings.PrayerColumnFastStartEnd,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,
                                                                                    'FAST_START_END',
                                                                                    props.data.user_settings.PrayerColumnFastStartEnd.toString()))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Data').UserApp.app_id ,'FAST_START_END'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});

        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_method', props.data.user_settings.PrayerMethod);
        props.methods.appComponentSettingUpdate('PRAYER', 'METHOD');
        
        if (Number(props.data.user_settings.PrayerColumnImsakChecked))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_imsak').classList.add('checked');
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_imsak').classList.remove('checked');
        if (Number(props.data.user_settings.PrayerColumnSunsetChecked))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_sunset').classList.add('checked');
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_sunset').classList.remove('checked');
        if (Number(props.data.user_settings.PrayerColumnMidnightChecked))
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_midnight').classList.add('checked');
        else
            props.methods.COMMON.COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_midnight').classList.remove('checked');
    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:       null,
        methods:    null,
        template:   template({icons:{
                                    method:props.methods.COMMON.commonGlobalGet('ICONS').misc_book,
                                    asr:props.methods.COMMON.commonGlobalGet('ICONS').misc_book + props.methods.COMMON.commonGlobalGet('ICONS').sky_afternoon,
                                    highlatitude:props.methods.COMMON.commonGlobalGet('ICONS').gps_high_latitude,
                                    timeformat:props.methods.COMMON.commonGlobalGet('ICONS').regional_timeformat,
                                    hijri_adjustment:props.methods.COMMON.commonGlobalGet('ICONS').settings + props.methods.COMMON.commonGlobalGet('ICONS').regional_calendar,
                                    iqamat_fajr:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').misc_calling + props.methods.COMMON.commonGlobalGet('ICONS').misc_prayer + props.methods.COMMON.commonGlobalGet('ICONS').sky_sunrise_before,
                                    iqamat_dhuhr:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').misc_calling + props.methods.COMMON.commonGlobalGet('ICONS').misc_prayer + props.methods.COMMON.commonGlobalGet('ICONS').sky_midday,
                                    iqamat_asr:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').misc_calling + props.methods.COMMON.commonGlobalGet('ICONS').misc_prayer + props.methods.COMMON.commonGlobalGet('ICONS').sky_afternoon,
                                    iqamat_maghrib:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').misc_calling + props.methods.COMMON.commonGlobalGet('ICONS').misc_prayer + props.methods.COMMON.commonGlobalGet('ICONS').sky_sunset,
                                    iqamat_isha:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').misc_calling + props.methods.COMMON.commonGlobalGet('ICONS').misc_prayer + props.methods.COMMON.commonGlobalGet('ICONS').sky_night,
                                    show_imsak:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').sky_sunrise_before + props.methods.COMMON.commonGlobalGet('ICONS').misc_food,
                                    show_sunset:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').sky_sunset,
                                    show_midnight:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').sky_midnight + props.methods.COMMON.commonGlobalGet('ICONS').misc_prayer,
                                    show_fast_start_end:props.methods.COMMON.commonGlobalGet('ICONS').show + props.methods.COMMON.commonGlobalGet('ICONS').misc_food + props.methods.COMMON.commonGlobalGet('ICONS').misc_ban
        }})    };
};
export default component;