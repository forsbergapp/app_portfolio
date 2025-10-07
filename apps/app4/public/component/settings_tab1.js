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
 * @param {{user_timezone:string}} props
 * @returns {string}
 */
const template = props => ` <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_regional_locale' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_locale'></div>	
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_RegionalTimezone_current' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_timezone_current'>${props.user_timezone}</div>
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
                                    <div id='setting_icon_RegionalTimezone' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_report_timezone'></div>
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
                                    <div id='setting_select_report_numbersystem'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_regional_direction' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_report_direction'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_regional_locale_second' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_report_locale_second'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_RegionalArabicScript' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_report_arabic_script'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_regional_calendartype' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_calendartype'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>
                            <div class='setting_horizontal_row'>
                                <div class='setting_horizontal_col'></div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_icon_RegionalCalendarHijri_type' class='common_icon'></div>
                                </div>
                                <div class='setting_horizontal_col'>
                                    <div id='setting_select_calendar_hijri_type'></div>
                                </div>
                                <div class='setting_horizontal_col'></div>
                            </div>`;
/**
 * @name component
 * @description Component
 * @function
 * @param {{data:       {
 *                      commonMountdiv:string,
 *                      common_app_id:number,
 *                      app_id:number,
 *                      user_settings:import('../js//types.js').APP_user_setting_record,
 *                      user_locale:string,
 *                      user_timezone:string
 *                      },
 *          methods:    {COMMON:common['CommonModuleCommon'],
 *                      appComponentSettingUpdate:appComponentSettingUpdate}}} props
 * @returns {Promise.<{ lifecycle:common['CommonComponentLifecycle'], 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    //fetch all settings for common app id
    /**@type{common['server']['ORM']['Object']['AppData'][]} */
    const settings = await props.methods.COMMON.commonFFB({path:'/server-db/appdata/',
                                                    query:`IAM_data_app_id=${props.data.common_app_id}`,
                                                    method:'GET', 
                                                    authorization_type:'APP_ID'}).then((/**@type{string}*/result)=>
                                                        JSON.parse(props.methods.COMMON.commonWindowFromBase64(JSON.parse(result).rows[0].data)));
    //fetch locales using user locale
    /**@type{{locale:string, text:string}[]} */
    const locales = await props.methods.COMMON.commonFFB({
                                                    path:'/app-common-module/COMMON_LOCALE', 
                                                    query:`locale=${props.data.user_locale}`, 
                                                    method:'POST', authorization_type:'APP_ID',
                                                    body:{type:'FUNCTION',IAM_data_app_id : props.data.common_app_id}
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
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
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
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
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
                        default_data_value:settings.filter(setting=>setting.Name == 'TIMEZONE')[0].Value,
                        default_value:settings.filter(setting=>setting.Name == 'TIMEZONE')[0].DisplayData,
                        options: settings.filter(setting=>setting.Name == 'TIMEZONE'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //number system
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_numbersystem',
            data:       {
                        default_data_value:settings.filter(setting=>setting.Name == 'NUMBER_SYSTEM')[0].Value,
                        default_value:settings.filter(setting=>setting.Name == 'NUMBER_SYSTEM')[0].DisplayData,
                        options: settings.filter(setting=>setting.Name == 'NUMBER_SYSTEM'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //direction with first one empty
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_direction',
            data:       {
                        default_data_value:settings.filter(setting=>setting.Name == 'DIRECTION')[0].Value,
                        default_value:settings.filter(setting=>setting.Name == 'DIRECTION')[0].DisplayData,
                        options: [{Value:'', DisplayData:''}].concat(settings.filter(setting=>setting.Name == 'DIRECTION')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //arabic script with first one empty
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_report_arabic_script',
            data:       {
                        default_data_value:settings.filter(setting=>setting.Name == 'ARABIC_SCRIPT')[0].Value,
                        default_value:settings.filter(setting=>setting.Name == 'ARABIC_SCRIPT')[0].DisplayData,
                        options: [{Value:'', DisplayData:''}].concat(settings.filter(setting=>setting.Name == 'ARABIC_SCRIPT')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //calendar type
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_calendartype',
            data:       {
                        default_data_value:settings.filter(setting=>setting.Name == 'CALENDAR_TYPE')[0].Value,
                        default_value:settings.filter(setting=>setting.Name == 'CALENDAR_TYPE')[0].DisplayData,
                        options: settings.filter(setting=>setting.Name == 'CALENDAR_TYPE'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:       '/common/component/common_select.js'});
        //calendar hijri type
        await props.methods.COMMON.commonComponentRender({
            mountDiv:   'setting_select_calendar_hijri_type',
            data:       {
                        default_data_value:settings.filter(setting=>setting.Name == 'CALENDAR_HIJRI_TYPE')[0].Value,
                        default_value:settings.filter(setting=>setting.Name == 'CALENDAR_HIJRI_TYPE')[0].DisplayData,
                        options: settings.filter(setting=>setting.Name == 'CALENDAR_HIJRI_TYPE'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'Value',
                        column_text:'DisplayData'
                        },
            methods:    null,
            path:'/common/component/common_select.js'});
      
        //update select with settings values
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_locale', props.data.user_settings.RegionalLanguageLocale);
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_report_locale_second', props.data.user_settings.RegionalSecondLanguageLocale);

        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_report_timezone', props.data.user_settings.RegionalTimezone);
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_report_numbersystem', props.data.user_settings.RegionalNumberSystem);
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_report_direction', props.data.user_settings.RegionalLayoutDirection);
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_report_arabic_script', props.data.user_settings.RegionalArabicScript);
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_calendartype', props.data.user_settings.RegionalCalendarType);
        props.methods.COMMON.commonMiscSelectCurrentValueSet('setting_select_calendar_hijri_type', props.data.user_settings.RegionalCalendarHijri_type);

        //display live timezone time
        props.methods.appComponentSettingUpdate('REGIONAL', 'TIMEZONE');

    };
    return {
        lifecycle:  {onMounted:onMounted},
        data:   null,
        methods:null,
        template: template({user_timezone:props.data.user_timezone})
    };
};
export default component;