/**
 * Settings tab 1
 * @module apps/app2/component/settings_tab1
 */

/**
 * @import {CommonModuleCommon, COMMON_DOCUMENT,CommonComponentLifecycle}  from '../../../common_types.js'
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
                                    <div id='setting_icon_regional_timezone_current' class='common_icon'></div>
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
                                    <div id='setting_icon_regional_timezone' class='common_icon'></div>
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
                                    <div id='setting_icon_regional_arabic_script' class='common_icon'></div>
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
                                    <div id='setting_icon_regional_calendar_hijri_type' class='common_icon'></div>
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
 *          methods:    {COMMON_DOCUMENT:COMMON_DOCUMENT,
 *                      appComponentSettingUpdate:appComponentSettingUpdate,
 *                      commonMiscDbAppSettingsGet:CommonModuleCommon['commonMiscDbAppSettingsGet'],
 *                      commonMiscSelectCurrentValueSet:CommonModuleCommon['commonMiscSelectCurrentValueSet'],
 *                      commonComponentRender:CommonModuleCommon['commonComponentRender'],
 *                      commonFFB:CommonModuleCommon['commonFFB']}}} props
 * @returns {Promise.<{ lifecycle:CommonComponentLifecycle, 
 *                      data:null, 
 *                      methods:null,
 *                      template:string}>}
 */
const component = async props => {
    const settings = await props.methods.commonMiscDbAppSettingsGet();
    //get locales using user locale
    /**@type{{locale:string, text:string}[]} */
    const locales = await props.methods.commonFFB({
                                                    path:'/app-module-function/COMMON_LOCALE', 
                                                    query:`locale=${props.data.user_locale}`, 
                                                    method:'POST', authorization_type:'APP_ID',
                                                    body:{data_app_id : props.data.common_app_id}
                                                })
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows);
    const onMounted = async () =>{
        //Locale using setting locale
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_locale',
            data:       {
                        default_data_value:props.data.user_settings.regional_language_locale,
                        default_value:'',
                        options: locales,
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'locale',
                        column_text:'text'
                        },
            methods:    {commonFFB:props.methods.commonFFB},
            path:       '/common/component/common_select.js'});
        //Locale second using setting locale with first one empty
        await props.methods.commonComponentRender({
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
            methods:    {commonFFB:props.methods.commonFFB},
            path:       '/common/component/common_select.js'});
        //commmon
        //Timezone
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_timezone',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'TIMEZONE')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'TIMEZONE')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'TIMEZONE'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //number system
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_numbersystem',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'NUMBER_SYSTEM')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'NUMBER_SYSTEM')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'NUMBER_SYSTEM'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //direction with first one empty
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_direction',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'DIRECTION')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'DIRECTION')[0].text,
                        options: [{value:'', text:''}].concat(settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'DIRECTION')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //arabic script with first one empty
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_report_arabic_script',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'ARABIC_SCRIPT')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'ARABIC_SCRIPT')[0].text,
                        options: [{value:'', text:''}].concat(settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'ARABIC_SCRIPT')),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //calendar type
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_calendartype',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'CALENDAR_TYPE')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'CALENDAR_TYPE')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'CALENDAR_TYPE'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:       '/common/component/common_select.js'});
        //calendar hijri type
        await props.methods.commonComponentRender({
            mountDiv:   'setting_select_calendar_hijri_type',
            data:       {
                        default_data_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'CALENDAR_HIJRI_TYPE')[0].value,
                        default_value:settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'CALENDAR_HIJRI_TYPE')[0].text,
                        options: settings.filter((/**@type{*}*/setting)=>setting.app_setting_type_name == 'CALENDAR_HIJRI_TYPE'),
                        path:null,
                        query:null,
                        method:null,
                        authorization_type:null,
                        column_value:'value',
                        column_text:'text'
                        },
            methods:    {commonFFB:null},
            path:'/common/component/common_select.js'});
      
        //update select with settings values
        props.methods.commonMiscSelectCurrentValueSet('setting_select_locale', props.data.user_settings.regional_language_locale);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_locale_second', props.data.user_settings.regional_second_language_locale);

        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_timezone', props.data.user_settings.regional_timezone);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_numbersystem', props.data.user_settings.regional_number_system);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_direction', props.data.user_settings.regional_layout_direction);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_report_arabic_script', props.data.user_settings.regional_arabic_script);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_calendartype', props.data.user_settings.regional_calendar_type);
        props.methods.commonMiscSelectCurrentValueSet('setting_select_calendar_hijri_type', props.data.user_settings.regional_calendar_hijri_type);

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