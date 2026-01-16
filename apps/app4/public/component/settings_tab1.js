/**
 * Settings tab 1
 * @module apps/app4/component/settings_tab1
 */

/**
 * @import {common}  from '../../../common_types.js'
 * @import {appComponentSettingUpdate}  from '../js/app.js'
 * 
 */

/**
 * @name template
 * @description Template
 * @function
 * @param {{user_timezone:string,
 *          icons:{
 *                   regional_locale:string,
 *                   regional_timezone_current:string,
 *                   regional_timezone:string,
 *                   regional_numbersystem:string,
 *                   regional_direction:string,
 *                   regional_locale_second:string,
 *                   regional_arabic_script:string,
 *                   regional_calendartype:string,
 *                   regional_calendar_hijri_type:string}}} props
 * @returns {string}
 */
const template = props => ` <div class='settings_row'>
                                <div >${props.icons.regional_locale}</div>
                                <div id='setting_select_locale'></div>	
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.regional_timezone_current}</div>
                                <div id='setting_timezone_current'>${props.user_timezone}</div>
                            </div>
                            <div class='settings_row'>
                                <div ></div>
                                <div id='setting_current_date_time_display'>...</div>
                            </div>
                            <div class='settings_row'>
                                <div >${props.icons.regional_timezone}</div>
                                <div id='setting_select_report_timezone'></div>
                            </div>
                            <div class='settings_row'>
                                <div ></div>
                                <div id='setting_report_date_time_display'>...</div>
                            </div>
                            <div class='settings_row'>
                                <div settings_row>${props.icons.regional_numbersystem}</div>
                                <div id='setting_select_report_numbersystem'></div>
                            </div>
                            <div class='settings_row'>
                                <div settings_row>${props.icons.regional_direction}</div>
                                <div id='setting_select_report_direction'></div>
                            </div>
                            <div class='settings_row'>
                                <div settings_row>${props.icons.regional_locale_second}</div>
                                <div id='setting_select_report_locale_second'></div>
                            </div>
                            <div class='settings_row'>
                                <div settings_row>${props.icons.regional_arabic_script}</div>
                                <div id='setting_select_report_arabic_script'></div>
                            </div>
                            <div class='settings_row'>
                                <div settings_row>${props.icons.regional_calendartype}</div>
                                <div id='setting_select_calendartype'></div>
                            </div>
                            <div class='settings_row'>
                                <div settings_row>${props.icons.regional_calendar_hijri_type}</div>
                                <div id='setting_select_calendar_hijri_type'></div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      user_settings:import('../js//types.js').APP_user_setting_record
 *                      },
 *          methods:    {COMMON:common['CommonModuleCommon'],
 *                      appComponentSettingUpdate:appComponentSettingUpdate}}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    //fetch locales using user locale
    /**@type{{locale:string, text:string}[]} */
    const locales = await props.methods.COMMON.commonFFB({
                                                    path:'/app-common-module/COMMON_LOCALE', 
                                                    method:'POST', authorization_type:'APP_ID',
                                                    body:{  type:'FUNCTION',
                                                            IAM_data_app_id : props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id,
                                                            locale: props.methods.COMMON.commonGlobalGet('UserApp').user_locale}
                                                })
                            .then((/**@type{string}*/result)=>JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
    const onMounted = async () =>{
        //Locale using setting locale
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_locale',
            data:       {
                        default_data_value:props.data.user_settings.RegionalLanguageLocale,
                        default_value:'',
                        options: locales,
                        column_value:'locale',
                        column_text:'text'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //Locale second using setting locale with first one empty
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_locale_second',
            data:       {
                        default_data_value:'',
                        default_value:'',
                        options: [{locale:'', text:''}].concat(locales),
                        column_value:'locale',
                        column_text:'text'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //common
        //Timezone
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_timezone',
            data:       {
                        default_data_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'TIMEZONE',props.data.user_settings.RegionalTimezone))[0].Value,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'TIMEZONE',props.data.user_settings.RegionalTimezone))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'TIMEZONE'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //number system
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_numbersystem',
            data:       {
                        default_data_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'NUMBER_SYSTEM',props.data.user_settings.RegionalNumberSystem))[0].Value,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'NUMBER_SYSTEM',props.data.user_settings.RegionalNumberSystem))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'NUMBER_SYSTEM'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //direction with first one empty
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_direction',
            data:       {
                        default_data_value:props.data.user_settings.RegionalLayoutDirection,
                        default_value:['',null].includes(props.data.user_settings.RegionalLayoutDirection)?
                                            ' ':
                                            (await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,
                                                                                        'DIRECTION',
                                                                                        props.data.user_settings.RegionalLayoutDirection))[0].DisplayData??'',
                        options: [{Value:'', DisplayData:''}].concat(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'DIRECTION')),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //arabic script with first one empty
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_arabic_script',
            data:       {
                        default_data_value:props.data.user_settings.RegionalArabicScript,
                        default_value:['',null].includes(props.data.user_settings.RegionalArabicScript)?
                                            ' ':
                                                (await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,
                                                                                            'ARABIC_SCRIPT',
                                                                                            props.data.user_settings.RegionalArabicScript))[0].DisplayData??'',
                        options: [{Value:'', DisplayData:''}].concat(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'ARABIC_SCRIPT')),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //calendar type
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_calendartype',
            data:       {
                        default_data_value:props.data.user_settings.RegionalCalendarType,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,
                                                                                    'CALENDAR_TYPE', 
                                                                                    props.data.user_settings.RegionalCalendarType))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'CALENDAR_TYPE'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //calendar hijri type
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_calendar_hijri_type',
            data:       {
                        default_data_value:props.data.user_settings.RegionalCalendarHijriType,
                        default_value:(await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,
                                                                                    'CALENDAR_HIJRI_TYPE',
                                                                                    props.data.user_settings.RegionalCalendarHijriType))[0].DisplayData,
                        options: await props.methods.COMMON.commonGetAppData(props.methods.COMMON.commonGlobalGet('Parameters').app_common_app_id ,'CALENDAR_HIJRI_TYPE'),
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:'/common/component/common_select.js'});
      
        //update select with settings values
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_locale', props.data.user_settings.RegionalLanguageLocale);
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_report_locale_second', props.data.user_settings.RegionalSecondLanguageLocale);

        //display live timezone time
        props.methods.appComponentSettingUpdate('REGIONAL', 'TIMEZONE');

    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({user_timezone:props.methods.COMMON.commonGlobalGet('UserApp').user_timezone,
                            icons:{
                                regional_locale:props.methods.COMMON.commonGlobalGet('ICONS').regional_locale,
                                regional_timezone_current:props.methods.COMMON.commonGlobalGet('ICONS').regional_timezone + props.methods.COMMON.commonGlobalGet('ICONS').gps_position,
                                regional_timezone:props.methods.COMMON.commonGlobalGet('ICONS').regional_timezone + props.methods.COMMON.commonGlobalGet('ICONS').regional_calendar,
                                regional_numbersystem:props.methods.COMMON.commonGlobalGet('ICONS').regional_numbersystem,
                                regional_direction:props.methods.COMMON.commonGlobalGet('ICONS').regional_direction,
                                regional_locale_second:props.methods.COMMON.commonGlobalGet('ICONS').regional_locale + props.methods.COMMON.commonGlobalGet('ICONS').misc_second,
                                regional_arabic_script:props.methods.COMMON.commonGlobalGet('ICONS').regional_script,
                                regional_calendartype:props.methods.COMMON.commonGlobalGet('ICONS').regional_calendar,
                                regional_calendar_hijri_type:props.methods.COMMON.commonGlobalGet('ICONS').regional_calendar_hijri_type
                            }
        })                            
    };
};
export default component;