/**
 * Timetable app
 * @module apps/app4/app
 */
/**
 * @import {common} from '../../../common_types.js'
 * @import {APP_PARAMETERS, APP_user_setting_data, APP_user_setting_record, APP_REPORT_day_user_account_app_data_posts, 
 *          APP_REPORT_settings, APP_GLOBAL, 
 *          APP_user_setting} from './types.js'
 */


/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

/**@type {common['CommonModuleCommon']} */
let common;


/**@type{APP_user_setting} */
const APP_USER_SETTINGS_EMPTY = {current_id:0,
                             data:[{Id:0,
                                    Document: { Description: '',
                                                RegionalLanguageLocale: '',
                                                RegionalTimezone: '',
                                                RegionalNumberSystem: '',
                                                RegionalLayoutDirection: '',
                                                RegionalSecondLanguageLocale: '',
                                                RegionalArabicScript: '',
                                                RegionalCalendarType: 'GREGORIAN',
                                                RegionalCalendarHijriType: '',
                                                GpsLatText: null,
                                                GpsLongText: null,
                
                                                DesignThemeDayId: '',
                                                DesignThemeMonthId: '',
                                                DesignThemeYearId: '',
                                                DesignPaperSize: '',
                                                DesignRowHighlight: '0',
                                                DesignColumnWeekdayChecked: 0,
                                                DesignColumnCalendarTypeChecked: 0,
                                                DesignColumnNotesChecked: 0,
                                                DesignColumnGpsChecked: 0,
                                                DesignColumnTimezoneChecked: 0,
                
                                                ImageHeaderImageImg: '',
                                                ImageFooterImageImg: '',
                
                                                TextHeader1Text: '',
                                                TextHeader2Text: '',
                                                TextHeader3Text: '',
                                                TextHeaderAlign: null,
                                                TextFooter1Text: '',
                                                TextFooter2Text: '',
                                                TextFooter3Text: '',
                                                TextFooterAlign: null,
                
                                                PrayerMethod: '',
                                                PrayerAsrMethod: '',
                                                PrayerHighLatitudeAdjustment: '',
                                                PrayerTimeFormat: '',
                                                PrayerHijriDateAdjustment: 0,
                                                PrayerFajrIqamat: '',
                                                PrayerDhuhrIqamat: '',
                                                PrayerAsrIqamat: '',
                                                PrayerMaghribIqamat: '',
                                                PrayerIshaIqamat: '',
                                                PrayerColumnImsakChecked: 0,
                                                PrayerColumnSunsetChecked: 0,
                                                PrayerColumnMidnightChecked: 0,
                                                PrayerColumnFastStartEnd: 0}}
                                ]
                            };

/**@type{APP_GLOBAL} */
const APP_GLOBAL = {
    description:null,
    app_default_startup_page:0,
    app_report_timetable:'',

    regional_default_direction:'',
    regional_default_locale_second:'',
    regional_default_arabic_script:'',
    regional_default_calendartype:'GREGORIAN',
    regional_default_calendar_hijri_type:'',

    gps_qibbla_title:'',
    gps_qibbla_text_size:0,
    gps_qibbla_lat:0,
    gps_qibbla_long:0,
    gps_qibbla_color:'',
    gps_qibbla_width:0,
    gps_qibbla_opacity:0,
    gps_qibbla_old_title:'',
    gps_qibbla_old_text_size:0,
    gps_qibbla_old_lat:0,
    gps_qibbla_old_long:0,
    gps_qibbla_old_color:'',
    gps_qibbla_old_width:0,
    gps_qibbla_old_opacity:0,

    design_default_theme_day:'',
    design_default_theme_month:'',
    design_default_theme_year:'',
    design_default_papersize:'',
    design_default_highlight_row:'0',
    design_default_show_weekday:false,
    design_default_show_calendartype:false,
    design_default_show_notes:false,
    design_default_show_gps:false,
    design_default_show_timezone:false,

    image_default_report_header_src:'',
    image_default_report_footer_src:'',

    text_default_reporttitle1:'',
    text_default_reporttitle2:'',
    text_default_reporttitle3:'',
    text_default_reportfooter1:'',
    text_default_reportfooter2:'',
    text_default_reportfooter3:'',

    prayer_default_method:'',
    prayer_default_asr:'',
    prayer_default_highlatitude:'',
    prayer_default_timeformat:'',
    prayer_default_hijri_adjustment:0,
    prayer_default_iqamat_title_fajr:'',
    prayer_default_iqamat_title_dhuhr:'',
    prayer_default_iqamat_title_asr:'',
    prayer_default_iqamat_title_maghrib:'',
    prayer_default_iqamat_title_isha:'',
    prayer_default_show_imsak:false,
    prayer_default_show_sunset:false,
    prayer_default_show_midnight:false,
    prayer_default_show_fast_start_end:0,
    timetable_type:0,
    user_settings:APP_USER_SETTINGS_EMPTY,
    themes: {data:[{type:'', value:'', text:''}]},
    //profile_info functions
    function_profile_user_setting_update: ()=>null,
    function_profile_show_user_setting_detail: ()=>null,
    function_profile_user_setting_stat: ()=>null,
    /**@ts-ignore */
    appLibTimetable:null
};
Object.seal(APP_GLOBAL);

/**
 * @name appReportTimetablePrint
 * @description Print timetable
 * @function
 * @returns {Promise.<void>}
 */
const appReportTimetablePrint = async () => {
    /**@type{common['CommonComponentResult']}*/
    const {template} = await common.commonComponentRender({ mountDiv:   null,
                                                            data:  {   
                                                                    commonMountdiv:null, 
                                                                    appHtml:COMMON_DOCUMENT.querySelector('#paper').outerHTML
                                                                    },
                                                            methods:null,
                                                            path: '/component/print.js'});
    template?common.commonMiscPrint(template):null;
};
/**
 * @name appReportTimetableSettings
 * @description Get report settings
 * @function
 * @returns {APP_REPORT_settings}
 */
const appReportTimetableSettings = () => {
    const setting_global = APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document;
    return {    locale              	: setting_global.RegionalLanguageLocale,
                timezone            	: setting_global.RegionalTimezone,
                number_system       	: setting_global.RegionalNumberSystem,
                direction           	: setting_global.RegionalLayoutDirection,
                second_locale       	: setting_global.RegionalSecondLanguageLocale,
                arabic_script       	: setting_global.RegionalArabicScript,
                calendartype        	: setting_global.RegionalCalendarType,
                calendar_hijri_type 	: setting_global.RegionalCalendarHijriType,

                place               	: setting_global.Description ??'',
                gps_lat             	: setting_global.GpsLatText??0,
                gps_long            	: setting_global.GpsLongText??0,

                theme_day           	: 'theme_day_' + setting_global.DesignThemeDayId,
                theme_month         	: 'theme_month_' + setting_global.DesignThemeMonthId,
                theme_year          	: 'theme_year_' + setting_global.DesignThemeYearId,    
                //papersize missing
                highlight           	: setting_global.DesignRowHighlight,
                show_weekday        	: setting_global.DesignColumnWeekdayChecked,
                show_calendartype   	: setting_global.DesignColumnCalendarTypeChecked,
                show_notes          	: setting_global.DesignColumnNotesChecked,
                show_gps   	       		: setting_global.DesignColumnGpsChecked,
                show_timezone       	: setting_global.DesignColumnTimezoneChecked,
                
                header_img_src      	: setting_global.ImageHeaderImageImg,
				footer_img_src      	: setting_global.ImageFooterImageImg,

                header_txt1         	: setting_global.TextHeader1Text,
                header_txt2         	: setting_global.TextHeader2Text,
                header_txt3         	: setting_global.TextHeader3Text,
                header_align            : setting_global.TextHeaderAlign,
                footer_txt1         	: setting_global.TextFooter1Text,
                footer_txt2         	: setting_global.TextFooter2Text,
                footer_txt3    	   		: setting_global.TextFooter3Text,
                footer_align            : setting_global.TextFooterAlign,
                
                method              	: setting_global.PrayerMethod,
                asr                 	: setting_global.PrayerAsrMethod,
                highlat             	: setting_global.PrayerHighLatitudeAdjustment,
                format              	: setting_global.PrayerTimeFormat,
                hijri_adj           	: setting_global.PrayerHijriDateAdjustment,
                iqamat_fajr         	: setting_global.PrayerFajrIqamat,
                iqamat_dhuhr        	: setting_global.PrayerDhuhrIqamat,
                iqamat_asr          	: setting_global.PrayerAsrIqamat,
                iqamat_maghrib      	: setting_global.PrayerMaghribIqamat,
                iqamat_isha         	: setting_global.PrayerIshaIqamat,
                show_imsak          	: setting_global.PrayerColumnImsakChecked,
                show_sunset         	: setting_global.PrayerColumnSunsetChecked,
                show_midnight       	: setting_global.PrayerColumnMidnightChecked,
                show_fast_start_end 	: setting_global.PrayerColumnFastStartEnd,
                
                timetable_class			: 'timetable_class',
                timetable_month         : 'timetable_month_class', //class to add for month
                timetable_year_month    : 'timetable_year_month', //class to add for year
                reporttype_year_month 	: 'MONTH',  //default MONTH: normal month with more info, 
                                                    //YEAR: month with less info
                
                ui_navigation_left      : 'toolbar_btn_left',
                ui_navigation_right     : 'toolbar_btn_right'};
};
/**
 * @name appReportTimetableUpdate
 * @description Timetable update
 * @function
 * @param {number} timetable_type 
 * @param {'toolbar_btn_left' | 'toolbar_btn_right' | null} item_id 
 * @param {APP_REPORT_settings} settings 
 * @returns {Promise.<void>}
 */
const appReportTimetableUpdate = async (timetable_type = 0, item_id = null, settings) => {
    APP_GLOBAL.timetable_type = timetable_type;
    switch (timetable_type){
        //create timetable month or day or year if they are visible instead
        case 0:{
            /**@type{APP_REPORT_day_user_account_app_data_posts[]} */
            const current_user_settings =[];
            for (const setting of APP_GLOBAL.user_settings.data){
                current_user_settings.push(
                {
                Description : setting.Document.Description??'',
                RegionalLanguageLocale : setting.Document.RegionalLanguageLocale,
                RegionalTimezone : setting.Document.RegionalTimezone,
                RegionalNumberSystem : setting.Document.RegionalNumberSystem,
                RegionalCalendarHijri_type : setting.Document.RegionalCalendarHijriType,
                GpsLatText : setting.Document.GpsLatText,
                GpsLongText : setting.Document.GpsLongText,
                PrayerMethod : setting.Document.PrayerMethod,
                PrayerAsrMethod : setting.Document.PrayerAsrMethod,
                PrayerHighLatitudeAdjustment : setting.Document.PrayerHighLatitudeAdjustment,
                PrayerTimeFormat : setting.Document.PrayerTimeFormat,
                PrayerHijriDateAdjustment : setting.Document.PrayerHijriDateAdjustment
                });
            }
            COMMON_DOCUMENT.querySelector('#paper').innerHTML = APP_GLOBAL.appLibTimetable.component({	data:		{
                                                                                        commonMountdiv:null,
                                                                                        button_id:item_id,
                                                                                        timetable:'DAY',
                                                                                        user_account_app_data_post:settings,
                                                                                        user_account_app_data_posts_parameters:current_user_settings
                                                                                        },
                                                                            methods:	{
                                                                                        COMMON_DOCUMENT:null
                                                                                        }
                                                                            }).template;
            break;
        }
        //1=create timetable month
        case 1:{
            COMMON_DOCUMENT.querySelector('#paper').innerHTML = APP_GLOBAL.appLibTimetable.component({	data:		{
                                                                                        commonMountdiv:null,
                                                                                        button_id:item_id,
                                                                                        timetable:'MONTH',
                                                                                        user_account_app_data_post:settings,
                                                                                        user_account_app_data_posts_parameters:null
                                                                                        },
                                                                            methods:	{
                                                                                        COMMON_DOCUMENT:null
                                                                                        }
                                                                            }).template;
            break;
        }
        //2=create timetable year
        case 2:{
            COMMON_DOCUMENT.querySelector('#paper').innerHTML = APP_GLOBAL.appLibTimetable.component({	data:		{
                                                                                        commonMountdiv:null,
                                                                                        button_id:item_id,
                                                                                        timetable:'YEAR',
                                                                                        user_account_app_data_post:settings,
                                                                                        user_account_app_data_posts_parameters:null
                                                                                        },
                                                                            methods:	{
                                                                                        COMMON_DOCUMENT:null
                                                                                        }
                                                                            }).template;
            break;
        }
        default:{
            break;
        }
    }
};
/**
 * @name appReportUrl
 * @description Get report url
 * @function
 * @param {number|null} id 
 * @param {number} sid 
 * @param {string} papersize 
 * @param {string} item 
 * @param {string} format 
 * @param {boolean} profile_display 
 * @returns {string}
 */
const appReportUrl = (id, sid, papersize, item, format, profile_display=true) => {
    let module_parameters = `&id=${id}&sid=${sid}`;
    if (item =='profile_user_settings_day' || item.substr(0,8)=='user_day')
        module_parameters += '&type=0';
    if (item =='profile_user_settings_month' || item.substr(0,10)=='user_month')
        module_parameters += '&type=1';
    if (item == 'profile_user_settings_year' || item.substr(0,9)=='user_year')
        module_parameters += '&type=2';
    if (profile_display)
        module_parameters += `&uid_view=${common.commonGlobalGet('iam_user_app_id')??''}`;
    const service_parameter = `&format=${format}&ps=${papersize}`;
    const encodedurl = common.commonWindowToBase64( module_parameters + service_parameter);
    //url query parameters are decoded in report module and in report service
    return `/app-common-module-report/${APP_GLOBAL.app_report_timetable}?parameters=${common.commonWindowToBase64(`type=REPORT&reportid=${encodedurl}`)}`;

};

/**
 * @name appSettingThemeThumbnailsUpdate
 * @description Update thumbnails with timetables
 * @function
 * @param {{type:'day'|'month'|'year'|null,
 *          theme_id:string}|null} theme
 * @returns {Promise.<void>}
 */
const appSettingThemeThumbnailsUpdate = async (theme=null) => {
    if (theme?.type =='day' || theme==null){
        const current_user_settings = APP_GLOBAL.user_settings.data.map(setting=>{
            return {
                Description : setting.Document.Description??'',
                RegionalLanguageLocale : setting.Document.RegionalLanguageLocale,
                RegionalTimezone : setting.Document.RegionalTimezone,
                RegionalNumberSystem : setting.Document.RegionalNumberSystem,
                RegionalCalendarHijri_type : setting.Document.RegionalCalendarHijriType,
                GpsLatText : setting.Document.GpsLatText,
                GpsLongText : setting.Document.GpsLongText,
                PrayerMethod : setting.Document.PrayerMethod,
                PrayerAsrMethod : setting.Document.PrayerAsrMethod,
                PrayerHighLatitudeAdjustment : setting.Document.PrayerHighLatitudeAdjustment,
                PrayerTimeFormat : setting.Document.PrayerTimeFormat,
                PrayerHijriDateAdjustment : setting.Document.PrayerHijriDateAdjustment
            };
        });
        
        const result = APP_GLOBAL.appLibTimetable.component({	data:		{
                                                commonMountdiv:null,
                                                button_id:null,
                                                timetable:'DAY',
                                                user_account_app_data_post:appReportTimetableSettings(),
                                                user_account_app_data_posts_parameters:current_user_settings
                                                },
                                    methods:	{
                                                COMMON_DOCUMENT:null
                                                }
                                    });

        await common.commonComponentRender({
            mountDiv:   'setting_design_theme_day',
            data:       { 
                        class:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignPaperSize,
                        theme_id:COMMON_DOCUMENT.querySelector('#setting_design_theme_day').getAttribute('data-theme_id'),
                        type:'day',
                        html:result.template
                        },
            methods:    null,
            path:       '/component/settings_tab3_theme_thumbnail.js'});
    }
    if (theme?.type =='month' || theme?.type=='year' || theme==null){
        const result_month = APP_GLOBAL.appLibTimetable.component({	data:		{
                                                        commonMountdiv:null,
                                                        button_id:null,
                                                        timetable:'MONTH',
                                                        user_account_app_data_post:appReportTimetableSettings(),
                                                        user_account_app_data_posts_parameters:null
                                                        },
                                            methods:	{
                                                        COMMON_DOCUMENT:null
                                                        }
                                            });
        const result_year = APP_GLOBAL.appLibTimetable.component({	data:		{
                                                    commonMountdiv:null,
                                                    button_id:null,
                                                    timetable:'YEAR',
                                                    user_account_app_data_post:appReportTimetableSettings(),
                                                    user_account_app_data_posts_parameters:null
                                                    },
                                        methods:	{
                                                    COMMON_DOCUMENT:null
                                                    }
                                        });
        await common.commonComponentRender({  mountDiv:   'setting_design_theme_month',
                                        data:       { 
                                                    class:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignPaperSize,
                                                    theme_id:COMMON_DOCUMENT.querySelector('#setting_design_theme_month').getAttribute('data-theme_id'),
                                                    type:'month',
                                                    html:result_month.template
                                                    },
                                        methods:    null,
                                        path:       '/component/settings_tab3_theme_thumbnail.js'});
        await common.commonComponentRender({  mountDiv:   'setting_design_theme_year',
                                        data:       { 
                                                    class:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignPaperSize,
                                                    theme_id:COMMON_DOCUMENT.querySelector('#setting_design_theme_year').getAttribute('data-theme_id'),
                                                    type:'year',
                                                    html:result_year.template
                                                    },
                                        methods:    null,
                                        path:       '/component/settings_tab3_theme_thumbnail.js'});
    }
};

/**
 * @name appSettingThemeId
 * @description Get theme id
 * @function
 * @param {string} type 
 * @returns {string}
 */
const appSettingThemeId = type => {
    if (COMMON_DOCUMENT.querySelector(`#setting_design_theme_${type}`))
        return COMMON_DOCUMENT.querySelector(`#setting_design_theme_${type}`).getAttribute('data-theme_id');
    else{
        /**@ts-ignore */
        return APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id]['design_theme_' + type + '_id'];
    }
        
};

/**
 * @name appSettingThemeNav
 * @description Updates settings theme thumbnail
 * @function
 * @param {number} nav 
 * @param {'day'|'month'|'year'} type 
 * @returns {Promise.<void>}
 */
const appSettingThemeNav = async (nav, type) => {
    
    let theme_index_APP_GLOBAL = 0;

    //get current index
    const current_user_theme_id = APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document[`DesignTheme${type=='day'?'Day':type=='month'?'Month':'Year'}Id`];
  
    theme_index_APP_GLOBAL = APP_GLOBAL.themes.data.filter(theme=>theme.type.toLowerCase().endsWith(type)).findIndex( theme => theme.value == current_user_theme_id);

    //set next index
    if (nav == 1){
        if ((theme_index_APP_GLOBAL + 1) == APP_GLOBAL.themes.data.filter(theme=>theme.type.toLowerCase().endsWith(type)).length)
            theme_index_APP_GLOBAL = 0;
        else
            theme_index_APP_GLOBAL++;

    }
    else 
        if (nav == -1){
            if (theme_index_APP_GLOBAL == 0)
                theme_index_APP_GLOBAL = APP_GLOBAL.themes.data.filter(theme=>theme.type.toLowerCase().endsWith(type)).length-1;
            else
                theme_index_APP_GLOBAL--;

        }
    //set user setting theme id since getReportSetting will fetch user settings
    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document[`DesignTheme${type=='day'?'Day':type=='month'?'Month':'Year'}Id`] = 
        APP_GLOBAL.themes.data.filter(theme=>theme.type.toLowerCase().endsWith(type))[theme_index_APP_GLOBAL].value;
    COMMON_DOCUMENT.querySelector(`#setting_design_theme_${type}`).setAttribute('data-theme_id', APP_GLOBAL.themes.data.filter(theme=>theme.type.toLowerCase().endsWith(type))[theme_index_APP_GLOBAL].value);
    COMMON_DOCUMENT.querySelector(`#setting_design_theme_${type}_id`).textContent = APP_GLOBAL.themes.data.filter(theme=>theme.type.toLowerCase().endsWith(type))[theme_index_APP_GLOBAL].value;
    await appSettingThemeThumbnailsUpdate({   type: type,
                                    theme_id :APP_GLOBAL.themes.data.filter(theme=>theme.type.toLowerCase().endsWith(type))[theme_index_APP_GLOBAL].value});
};

/**
 * @name appSettingAlignGet
 * @description Get horizontal alignment
 * @function
 * @param {boolean} al 
 * @param {boolean} ac 
 * @param {boolean} ar 
 * @returns {string|null }
 */
const appSettingAlignGet = (al,ac,ar) => {
	if (al==true)
		return 'left';
	if (ac==true)
		return 'center';
	if (ar==true)
		return 'right';
	return null;
};
/**
 * @name settingsTimesShow
 * @description Show settings times for users timezone and timetable timezone
 * @function
 * @returns {Promise.<void>}
 */
const settingsTimesShow = async () => {
    const setting_select_locale                 = COMMON_DOCUMENT.querySelector('#setting_select_locale .common_select_dropdown_value')?.getAttribute('data-value');
    const element_setting_current_date          = COMMON_DOCUMENT.querySelector('#setting_current_date_time_display');
    const setting_select_report_timezone        = COMMON_DOCUMENT.querySelector('#setting_select_report_timezone .common_select_dropdown_value')?.getAttribute('data-value');
    const element_setting_report_data_time      = COMMON_DOCUMENT.querySelector('#setting_report_date_time_display');
    
    /**@type{Intl.DateTimeFormatOptions} */
    const options = {
        timeZone: common.commonGlobalGet('user_timezone'),
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    if (element_setting_current_date){     
        element_setting_current_date.textContent = new Date().toLocaleTimeString(common.commonGlobalGet('user_locale'), options);    
        if (setting_select_report_timezone){
            options.timeZone = setting_select_report_timezone;
            element_setting_report_data_time.textContent = new Date().toLocaleTimeString(setting_select_locale, options);
        }
        //wait 1 second
        await common.commonWindowWait(1000);
        settingsTimesShow();
    }
    
};
/**
 * @name appToolbarButton
 * @description Toolbar button
 * @function
 * @param {number} choice 
 * @returns {Promise.<void>}
 */
const appToolbarButton = async (choice) => {
    switch (choice) {
        //print
        case 1:
            {
                if (common.commonMiscMobile())
                    COMMON_DOCUMENT.querySelector('#paper').style.display = 'block';
                appReportTimetablePrint();
                break;
            }
        case 2:
        case 3:
        case 4:
            {
                if (common.commonMiscMobile())
                    COMMON_DOCUMENT.querySelector('#paper').style.display = 'block';
                common.commonComponentRemove('common_app_dialogues_app_custom');
                COMMON_DOCUMENT.querySelector('#toolbar_btn_day').classList.remove('toolbar_bottom_selected');
                COMMON_DOCUMENT.querySelector('#toolbar_btn_month').classList.remove('toolbar_bottom_selected');
                COMMON_DOCUMENT.querySelector('#toolbar_btn_year').classList.remove('toolbar_bottom_selected');
                COMMON_DOCUMENT.querySelector(`#toolbar_btn_${choice==2?'day':choice==3?'month':'year'}`).classList.add('toolbar_bottom_selected');

                //choice day=0, month=1, year=2
                await appReportTimetableUpdate(choice==2?0:choice==3?1:2, null, appReportTimetableSettings());
                break;
            }
        //settings
        case 5:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (common.commonMiscMobile())
                    COMMON_DOCUMENT.querySelector('#paper').style.display = 'none';
                common.commonComponentRender({  
                    mountDiv:   'common_app_dialogues_app_custom',
                    data:       {
                                iam_user_id:common.commonGlobalGet('iam_user_id'),
                                avatar:COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_avatar_img')?.getAttribute('data-image')
                                },
                    methods:    {
                                SettingShow:SettingShow
                                },
                    path:       '/component/settings.js'});
                break;
            }
        //profile
        case 6:
            {
                common.commonComponentRemove('common_app_dialogues_app_custom');
                break;
            }
        //profile stat
        case 7:
            {
                common.commonComponentRemove('common_app_dialogues_app_custom');
                common.commonComponentRender({
                    mountDiv:   'common_app_dialogues_profile_stat_row2',
                    data:       null,
                    methods:    null,
                    path:       '/component/profile_stat.js'});
                break;
            }
    }
};

/**
 * @name SettingShow
 * @description Show setting
 * @function
 * @param {number} tab_selected 
 * @returns {Promise.<void>}
 */
const SettingShow = async (tab_selected) => {
    //remove mark for all tabs
    COMMON_DOCUMENT.querySelectorAll('.settings_tab_nav').forEach((/**@type{HTMLElement}*/tab)=>tab.classList.remove('settings_tab_nav_selected'));
    //mark active tab
    COMMON_DOCUMENT.querySelector('#settings_tab_nav_' + tab_selected).classList.add('settings_tab_nav_selected');
    //empty old content
    COMMON_DOCUMENT.querySelector('#settings_content').textContent = '';
    //update with class to style each settings component
    COMMON_DOCUMENT.querySelector('#settings_content').className = `settings_tab_content settings_tab${tab_selected}`;
    //mount the selected component
    switch (tab_selected){
        case 1:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document,
                            common_app_id:common.commonGlobalGet('app_common_app_id'),
                            app_id:common.commonGlobalGet('app_id'),
                            user_locale:common.commonGlobalGet('user_locale'),
                            user_timezone:common.commonGlobalGet('user_timezone')},
                methods:    {
                            appComponentSettingUpdate:appComponentSettingUpdate                            
                            },
                path:       `/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 2:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            common_app_id:common.commonGlobalGet('app_common_app_id'),
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document
                            },
                methods:    {
                            appComponentSettingUpdate:appComponentSettingUpdate
                            },
                path:       `/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 3:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            common_app_id:common.commonGlobalGet('app_common_app_id'),
                            app_id:common.commonGlobalGet('app_id'),
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document,
                            themes:APP_GLOBAL.themes},
                methods:    {
                            appSettingThemeThumbnailsUpdate:appSettingThemeThumbnailsUpdate
                            },
                path:       `/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 4:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            app_id:common.commonGlobalGet('app_id'),
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document
                            },
                methods:    {appComponentSettingUpdate:appComponentSettingUpdate},
                path:`/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 5:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            app_id:common.commonGlobalGet('app_id'),
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document,
                            methods:APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods
                            },
                methods:    {
                            appComponentSettingUpdate:appComponentSettingUpdate
                            },
                path:`/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 6:{
            common.commonComponentRender({
                mountDiv:   'settings_content',
                data:       {user_settings:APP_GLOBAL.user_settings},
                methods:    null,
                path:       `/component/settings_tab${tab_selected}.js`});
            break;
        }
    }
    
};
/**
 * @name appSettingButtonAlignValue
 * @description Get alignment for button
 * @function
 * @param {string} report_align_where 
 * @returns {string}
 */
const appSettingButtonAlignValue = (report_align_where) => {

    if (COMMON_DOCUMENT.querySelector('#setting_icon_text_' + report_align_where + '_aleft').classList.contains('setting_button_active'))
        return 'left';
    if (COMMON_DOCUMENT.querySelector('#setting_icon_text_' + report_align_where + '_acenter').classList.contains('setting_button_active'))
        return 'center';
    if (COMMON_DOCUMENT.querySelector('#setting_icon_text_' + report_align_where + '_aright').classList.contains('setting_button_active'))
        return 'right';
    return '';
};
/**
 * @name appPaperZoom
 * @description Zoom paper
 * @function
 * @param {number|null} zoomvalue 
 * @returns {void}
 */
const appPaperZoom = (zoomvalue = null) => {
    let old;
    let old_scale;
    const div = COMMON_DOCUMENT.querySelector('#paper');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == null) {
        if (common.commonMiscMobile())
            div.style.transform = 'scale(0.5)';
        else
            div.style.transform = 'scale(0.7)';
    } else {
        old = COMMON_DOCUMENT.querySelector('#paper').style.transform;
        old_scale = parseFloat(old.substr(old.indexOf('(') + 1, old.indexOf(')') - 1));
        div.style.transform = 'scale(' + (old_scale + (zoomvalue / 10)) + ')';
    }
};

/**
 * @name appComponentSettingUpdate
 * @description Update component
 * @function
 * @param {'REGIONAL'|'GPS'|'DESIGN'|'IMAGE'|'TEXT'|'PRAYER'|'USER'} setting_tab
 * @param {string} setting_type
 * @param {string|null} item_id 
 * @returns {Promise.<void>}
 */
const appComponentSettingUpdate = async (setting_tab, setting_type, item_id=null) => {
    switch (setting_tab + '_' + setting_type) {
        case 'REGIONAL_TIMEZONE':
            {
                settingsTimesShow();
                break;
            }
        case 'GPS_CITY':
            {                    
                //read from latest popup
                const popup = COMMON_DOCUMENT.querySelectorAll('.common_map_popup_sub_title_gps')[COMMON_DOCUMENT.querySelectorAll('.common_map_popup_sub_title_gps').length - 1 ];
                if (popup.getAttribute('data-latitude') && popup.getAttribute('data-longitude') &&
                    popup.getAttribute('data-latitude')!='' && popup.getAttribute('data-longitude')!='' &&
                    popup.getAttribute('data-timezone')!='?'){
                    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.Description = 
                    COMMON_DOCUMENT.querySelectorAll('.common_map_popup_title')[COMMON_DOCUMENT.querySelectorAll('.common_map_popup_title').length - 1 ].textContent;
                    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLatText =
                        popup.getAttribute('data-latitude');
                    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLongText = 
                        popup.getAttribute('data-longitude');
                    appMapQibblaShow();
                    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalTimezone = popup.getAttribute('data-timezone');
                    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate = common.commonMiscTimezoneDate(popup.getAttribute('data-timezone'));
                    appUserSettingUpdate('GPS');
                }
                break;
            }
        case 'DESIGN_PAPER':
            {
                const paper = COMMON_DOCUMENT.querySelector('#paper');
                const paper_size = COMMON_DOCUMENT.querySelector('#setting_select_report_papersize .common_select_dropdown_value').getAttribute('data-value');
                 
                switch (paper_size) {
                    case 'A4':
                        {
                            paper.className='A4';
                            break;
                        }
                    case 'Letter':
                        {
                            paper.className='Letter';
                            break;
                        }
                    default:
                        break;
                }
                break;
            }
        
        case 'TEXT_HEADER_ALIGN':
        case 'TEXT_FOOTER_ALIGN':
            {
                const button_active_class  = 'setting_button_active';
                const header_footer = setting_type=='HEADER_ALIGN'?'header':'footer';
                //check if clicking on button that is already active then deactivate so no alignment
                if (COMMON_DOCUMENT.querySelector('#' + item_id).classList.contains(button_active_class)){
                    COMMON_DOCUMENT.querySelector('#' + item_id).classList.remove(button_active_class);
                }
                else{
                    COMMON_DOCUMENT.querySelector(`#setting_icon_text_${header_footer}_aleft`).classList.remove(button_active_class);
                    COMMON_DOCUMENT.querySelector(`#setting_icon_text_${header_footer}_acenter`).classList.remove(button_active_class);
                    COMMON_DOCUMENT.querySelector(`#setting_icon_text_${header_footer}_aright`).classList.remove(button_active_class);
                    
                    COMMON_DOCUMENT.querySelector('#' + item_id).classList.add(button_active_class);
                }
                const align = appSettingAlignGet(COMMON_DOCUMENT.querySelector(`#setting_icon_text_${header_footer}_aleft`).classList.contains('setting_button_active'),
                                        COMMON_DOCUMENT.querySelector(`#setting_icon_text_${header_footer}_acenter`).classList.contains('setting_button_active'),
                                        COMMON_DOCUMENT.querySelector(`#setting_icon_text_${header_footer}_aright`).classList.contains('setting_button_active'));
                COMMON_DOCUMENT.querySelector(`#setting_input_report${header_footer}1`).style.textAlign= align;
                COMMON_DOCUMENT.querySelector(`#setting_input_report${header_footer}2`).style.textAlign= align;
                COMMON_DOCUMENT.querySelector(`#setting_input_report${header_footer}3`).style.textAlign= align;
                break;
            }
        case 'PRAYER_METHOD':
            {
                const method = COMMON_DOCUMENT.querySelector('#setting_select_method .common_select_dropdown_value').getAttribute('data-value');
                let suffix;

                COMMON_DOCUMENT.querySelector('#setting_method_param_fajr').textContent = '';
                COMMON_DOCUMENT.querySelector('#setting_method_param_isha').textContent = '';
                if (typeof APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods[method].params.fajr == 'string')
                    suffix = '';
                else
                    suffix = '°';
                COMMON_DOCUMENT.querySelector('#setting_method_param_fajr').textContent = 'Fajr:' + APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods[method].params.fajr + suffix;
                if (typeof APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods[method].params.isha == 'string')
                    suffix = '';
                else
                    suffix = '°';
                COMMON_DOCUMENT.querySelector('#setting_method_param_isha').textContent = 'Isha:' + APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods[method].params.isha + suffix;
                break;
            }
        case 'USER_SETTING':{
            APP_GLOBAL.user_settings.current_id = COMMON_DOCUMENT.querySelector('#setting_select_user_setting .common_select_dropdown_value').getAttribute('data-value');
        }
    }
};

/**
 * @name appUserLogin
 * @description User login
 * @function
 * @returns {Promise.<void>}
 */
const appUserLogin = async () => {
    await common.commonUserLogin();   
    await appUserLoginPost();
};
/**
 * @name appUserLoginPost
 * @description User login post
 * @function
 * @returns {Promise.<void>}
 */
const appUserLoginPost = async () =>{
    if (common.commonGlobalGet('iam_user_id') !=null){
        //if user has not any posts saved then create default
        const result = await common.commonFFB({ path:'/server-db/iamuserappdatapost/', 
                                                query:`IAM_data_app_id=${common.commonGlobalGet('app_id')}&iam_user_id=${common.commonGlobalGet('iam_user_id')??''}`, 
                                                method:'GET', authorization_type:'APP_ID'});
        if (JSON.parse(result).rows.length==0){
            await appUserSettingFunction('ADD_LOGIN', true);
        }
        common.commonComponentRemove('common_app_dialogues_app_custom')
        common.commonComponentRemove('common_app_dialogues_profile');
        
        COMMON_DOCUMENT.querySelector('#paper').textContent='';
        appUserSettingsGet().then(() => {
            //show default startup
            appToolbarButton(APP_GLOBAL.app_default_startup_page);
        });
    }
    
};

/**
 * @name appUserLogout
 * @description User logout
 * @function
 * @returns {void}
 */
const appUserLogout = () => {
    common.commonComponentRemove('settings_tab_nav_6');
    common.commonComponentRemove('common_app_dialogues_profile');
    //set default settings
    appUserSettingDefaultSet().then(() => {
        //show default startup
        appToolbarButton(APP_GLOBAL.app_default_startup_page);
    });
};

/**
 * @name appUserProfileStat
 * @description Profile stat
 * @function
 * @param {number} statchoice 
 * @param {string|null} app_rest_url
 * @returns {Promise.<void>}
 */
 const appUserProfileStat = async (statchoice, app_rest_url) => {
    await common.commonProfileStat(statchoice, app_rest_url)
    .then(()=>{
        common.commonComponentRender({
            mountDiv:   'common_app_dialogues_profile_stat_row2',
            data:      null,
            methods:    null,
            path:       '/component/profile_stat.js'});
    });
 };
/**
 * @name appUserProfileDetail
 * @description Profile detail
 * @function
 * @param {number} detailchoice 
 * @returns {void}
 */
const appUserProfileDetail = (detailchoice) => {
    if (common.commonGlobalGet('iam_user_id') || 0 !== 0) {
        if (detailchoice == 0){
            //user settings
            COMMON_DOCUMENT.querySelector('#profile_user_settings_row').style.display = 'block';
        }
        else{
            //common 1 -4
            //app
            //7 Like user setting
            //8 Liked user setting
            COMMON_DOCUMENT.querySelector('#profile_user_settings_row').style.display = 'none';
        }
        common.commonProfileDetail(detailchoice);
    } 
    else
        common.commonDialogueShow('LOGIN');
};
/**
 * @name appUserSettingsGet
 * @description User settings get
 * @function
 * @returns {Promise.<null>}
 */
const appUserSettingsGet = async () => {
    return new Promise(resolve=>{
        common.commonFFB({path:'/server-db/iamuserappdatapost/', query:`IAM_data_app_id=${common.commonGlobalGet('app_id')}&iam_user_id=${common.commonGlobalGet('iam_user_id')??''}`, method:'GET', authorization_type:'APP_ID'})
        .then((/**@type{string}*/result)=>{
            const settings = JSON.parse(result).rows.map((/** @type{APP_user_setting_record}*/setting)=>{
                const json = {Description:setting.Description,
                    RegionalLanguageLocale:setting.RegionalLanguageLocale,
                    RegionalTimezone:setting.RegionalTimezone,
                    RegionalNumberSystem:setting.RegionalNumberSystem,
                    RegionalLayoutDirection:setting.RegionalLayoutDirection,
                    RegionalSecondLanguageLocale:setting.RegionalSecondLanguageLocale,
                    RegionalArabicScript:setting.RegionalArabicScript,
                    RegionalCalendarType:setting.RegionalCalendarType,
                    RegionalCalendarHijriType:setting.RegionalCalendarHijriType,
                    GpsLatText:typeof setting.GpsLatText== 'string'?appCommonFixFloat(setting.GpsLatText):setting.GpsLatText,
                    GpsLongText:typeof setting.GpsLongText=='string'?appCommonFixFloat(setting.GpsLongText):setting.GpsLongText,
                    DesignThemeDayId:setting.DesignThemeDayId,
                    DesignThemeMonthId:setting.DesignThemeMonthId,
                    DesignThemeYearId:setting.DesignThemeYearId,
                    DesignPaperSize:setting.DesignPaperSize,
                    DesignRowHighlight:setting.DesignRowHighlight,
                    DesignColumnWeekdayChecked:Number(setting.DesignColumnWeekdayChecked),
                    DesignColumnCalendarTypeChecked:Number(setting.DesignColumnCalendarTypeChecked),
                    DesignColumnNotesChecked:Number(setting.DesignColumnNotesChecked),
                    DesignColumnGpsChecked:Number(setting.DesignColumnGpsChecked),
                    DesignColumnTimezoneChecked:Number(setting.DesignColumnTimezoneChecked),
                    ImageHeaderImageImg:setting.ImageHeaderImageImg,
                    ImageFooterImageImg:setting.ImageFooterImageImg,
                    TextHeader1Text:setting.TextHeader1Text,
                    TextHeader2Text:setting.TextHeader2Text,
                    TextHeader3Text:setting.TextHeader3Text,
                    TextHeaderAlign:setting.TextHeaderAlign==''?null:setting.TextHeaderAlign,
                    TextFooter1Text:setting.TextFooter1Text,
                    TextFooter2Text:setting.TextFooter2Text,
                    TextFooter3Text:setting.TextFooter3Text,
                    TextFooterAlign:setting.TextFooterAlign==''?null:setting.TextFooterAlign,
                    PrayerMethod:setting.PrayerMethod,
                    PrayerAsrMethod:setting.PrayerAsrMethod,
                    PrayerHighLatitudeAdjustment:setting.PrayerHighLatitudeAdjustment,
                    PrayerTimeFormat:setting.PrayerTimeFormat,
                    PrayerHijriDateAdjustment:Number(setting.PrayerHijriDateAdjustment),
                    PrayerFajrIqamat:setting.PrayerFajrIqamat,
                    PrayerDhuhrIqamat:setting.PrayerDhuhrIqamat,
                    PrayerAsrIqamat:setting.PrayerAsrIqamat,
                    PrayerMaghribIqamat:setting.PrayerMaghribIqamat,
                    PrayerIshaIqamat:setting.PrayerIshaIqamat,
                    PrayerColumnImsakChecked:Number(setting.PrayerColumnImsakChecked),
                    PrayerColumnSunsetChecked:Number(setting.PrayerColumnSunsetChecked),
                    PrayerColumnMidnightChecked:Number(setting.PrayerColumnMidnightChecked),
                    PrayerColumnFastStartEnd:Number(setting.PrayerColumnFastStartEnd) 
                };
                return {
                        Id:setting.Id,
                        Document:json
                        };
            });
            APP_GLOBAL.user_settings = {current_id:0,   data:settings};
            resolve(null);
        });
    });
};
/**
 * @name appUserSettingLink
 * @description User setting show link
 * @function
 * @param {HTMLElement} item 
 * @returns {void}
 */
const appUserSettingLink = (item) => {
    const sid = APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Id;
    switch (item.id){
        case 'user_day_html':
        case 'user_month_html':
        case 'user_year_html':{
            const url = appReportUrl( common.commonGlobalGet('iam_user_id'), 
                                        sid ?? 0, 
                                        '',
                                        item.id,
                                        'HTML');
            common.commonComponentRender({
                    mountDiv:   'common_app_window_info',
                    data:       {
                                info:'URL',
                                path:url,
                                method:'GET',
                                authorization:'APP_ID',
                                class:''
                                },
                    methods:    null,
                    path:       '/common/component/common_app_window_info.js'});
            break;
        }
    }
};
/**
 * @name appUserSettingLink
 * @description User settings function
 * @function
 * @param {'ADD'|'ADD_LOGIN'|'SAVE'} function_name 
 * @param {boolean} add_settings
 * @returns {Promise.<void>}
 */
const appUserSettingFunction = async (function_name, add_settings=true) => {
   
    if (common.commonMiscInputControl(null,{
                                    check_valid_list_values:[
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.Description??'',null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLatText?.toString()??'',null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLongText?.toString()??'',null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextHeader1Text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextHeader2Text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextHeader3Text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextFooter1Text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextFooter2Text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextFooter3Text,null]
                                                ]})==true){
        
        const body = {  document:              APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document,
                        IAM_iam_user_app_id:    common.commonGlobalGet('iam_user_app_id')
                    };
        /**@type {common['CommonRESTAPIMethod']}*/
        let method;
        let path = '';
        let spinner_id;
        switch (function_name){
            case 'ADD_LOGIN':
            case 'ADD':{
                if (function_name=='ADD')
                    spinner_id = 'setting_btn_user_add';
                method = 'POST';
                path = '/server-db/iamuserappdatapost';
                break;
            }
            case 'SAVE':{
                spinner_id = 'setting_btn_user_save';
                method = 'PUT';
                const user_setting_id = APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Id;
                path = `/server-db/iamuserappdatapost/${user_setting_id}`;
                break;
            }
        }
        await common.commonFFB({path:path, method:method, authorization_type:'APP_ACCESS', body:body, spinner_id:spinner_id?spinner_id:null})
        .then((/**@type{string}*/result)=>{
            switch (function_name){
                case 'ADD':{
                    if (add_settings==true){
                        //update user settings
                        /** @type{APP_user_setting_data}*/
                        const data = {  Id:         JSON.parse(result).id, 
                                        Document:  JSON.parse(JSON.stringify(APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document))};
                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.data.length+0] = data;
                        APP_GLOBAL.user_settings.current_id = APP_GLOBAL.user_settings.data.length -1;
                    }
                    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Id = JSON.parse(result).InsertId;

                    //Update select
                    common.commonComponentRender({
                        mountDiv:   'setting_select_user_setting',
                        data:       {
                                    default_data_value:APP_GLOBAL.user_settings.current_id,
                                    default_value:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.Description,
                                    options: APP_GLOBAL.user_settings.data.map((setting, index)=>{return {value:index, text:setting.Document.Description};}),
                                    path:null,
                                    query:null,
                                    method:null,
                                    authorization_type:null,
                                    column_value:'value',
                                    column_text:'text'
                                    },
                        methods:    null,
                        path:       '/common/component/common_select.js'});
                    break;
                }
                default:{
                    break;
                }
            }
        });
    }
};
/**
 * @name appUserSettingDelete
 * @description User settings delete
 * @function
 * @param {number|null} choice 
 * @returns {void}
 */
const appUserSettingDelete = (choice=null) => {
    const user_setting_id = APP_GLOBAL.user_settings.data[COMMON_DOCUMENT.querySelector('#setting_select_user_setting .common_select_dropdown_value').getAttribute('data-value')].Id;
    const function_delete_user_setting = () => { appUserSettingDelete(1); };
    
    switch (choice){
        case null:{
            common.commonMessageShow('CONFIRM',function_delete_user_setting, null, null);
            break;
        }
        case 1:{
            common.commonFFB({  path:`/server-db/iamuserappdatapost/${user_setting_id}`, 
                                method:'DELETE', 
                                authorization_type:'APP_ACCESS', 
                                body:{IAM_iam_user_app_id:common.commonGlobalGet('iam_user_app_id')}, spinner_id:'setting_btn_user_delete'})
            .then(()=>{
                //check if last setting
                if (APP_GLOBAL.user_settings.data.length == 1)
                    appUserSettingFunction('ADD', false);
                else{
                    //remove current element from array
                    APP_GLOBAL.user_settings.data.splice(COMMON_DOCUMENT.querySelector('#setting_select_user_setting .common_select_dropdown_value').getAttribute('data-value'),1);
                    //show next or last setting
                    APP_GLOBAL.user_settings.current_id = Math.min(COMMON_DOCUMENT.querySelector('#setting_select_user_setting .common_select_dropdown_value').getAttribute('data-value') +1, APP_GLOBAL.user_settings.data.length - 1);

                    //Update select
                    common.commonComponentRender({
                        mountDiv:   'setting_select_user_setting',
                        data:       {
                                    default_data_value:APP_GLOBAL.user_settings.current_id,
                                    /**@ts-ignore */
                                    default_value:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.Description,
                                    /**@ts-ignore */
                                    options: APP_GLOBAL.user_settings.data.map((setting, index)=>{return {value:index, text:setting.Document.Description};}),
                                    path:null,
                                    query:null,
                                    method:null,
                                    authorization_type:null,
                                    column_value:'value',
                                    column_text:'text'
                                    },
                        methods:    null,
                        path:       '/common/component/common_select.js'});
                }
                
            })
            .catch(error=>{throw error});
        }
    }
};
/**
 * @name appUserSettingDefaultSet
 * @description Set default settings
 * @function
 * @returns {Promise.<void>}
 */
const appUserSettingDefaultSet = async () => {
    //update APP_GLOBAL
    const Document = {
        Description:                        common.commonGlobalGet('client_place'),
        RegionalLanguageLocale:             common.commonGlobalGet('user_locale'),
        RegionalTimezone:                   (common.commonGlobalGet('client_latitude') && common.commonGlobalGet('client_longitude'))?
                                                (await common.commonMiscImport(common.commonMiscImportmap('regional')))
                                                    .getTimezone(common.commonGlobalGet('client_latitude'), common.commonGlobalGet('client_longitude')):
                                                        Intl.DateTimeFormat().resolvedOptions().timeZone,
        RegionalNumberSystem:               Intl.NumberFormat().resolvedOptions().numberingSystem,
        RegionalLayoutDirection:            APP_GLOBAL.regional_default_direction,
        RegionalSecondLanguageLocale:       APP_GLOBAL.regional_default_locale_second,
        RegionalArabicScript:               APP_GLOBAL.regional_default_arabic_script,
        RegionalCalendarType:               APP_GLOBAL.regional_default_calendartype,
        RegionalCalendarHijriType:         APP_GLOBAL.regional_default_calendar_hijri_type,
        GpsLatText:                         appCommonFixFloat(common.commonGlobalGet('client_latitude')??''),
        GpsLongText:                        appCommonFixFloat(common.commonGlobalGet('client_longitude')??''),
        DesignThemeDayId:                   APP_GLOBAL.design_default_theme_day,
        DesignThemeMonthId:                 APP_GLOBAL.design_default_theme_month,
        DesignThemeYearId:                  APP_GLOBAL.design_default_theme_year,
        DesignPaperSize:                    APP_GLOBAL.design_default_papersize,
        DesignRowHighlight:                 APP_GLOBAL.design_default_highlight_row,
        DesignColumnWeekdayChecked:         Number(APP_GLOBAL.design_default_show_weekday),
        DesignColumnCalendarTypeChecked:    Number(APP_GLOBAL.design_default_show_calendartype),
        DesignColumnNotesChecked:           Number(APP_GLOBAL.design_default_show_notes),
        DesignColumnGpsChecked:             Number(APP_GLOBAL.design_default_show_gps),
        DesignColumnTimezoneChecked:        Number(APP_GLOBAL.design_default_show_timezone),
        ImageHeaderImageImg:                APP_GLOBAL.image_default_report_header_src,
        ImageFooterImageImg:                APP_GLOBAL.image_default_report_footer_src,
        TextHeader1Text:                    APP_GLOBAL.text_default_reporttitle1,
        TextHeader2Text:                    APP_GLOBAL.text_default_reporttitle2,
        TextHeader3Text:                    APP_GLOBAL.text_default_reporttitle3,
        TextHeaderAlign:                    null,
        TextFooter1Text:                    APP_GLOBAL.text_default_reportfooter1,
        TextFooter2Text:                    APP_GLOBAL.text_default_reportfooter2,
        TextFooter3Text:                    APP_GLOBAL.text_default_reportfooter3,
        TextFooterAlign:                    null,
        PrayerMethod:                       APP_GLOBAL.prayer_default_method,
        PrayerAsrMethod:                    APP_GLOBAL.prayer_default_asr,
        PrayerHighLatitudeAdjustment:       APP_GLOBAL.prayer_default_highlatitude,
        PrayerTimeFormat:                   APP_GLOBAL.prayer_default_timeformat,
        PrayerHijriDateAdjustment:          Number(APP_GLOBAL.prayer_default_hijri_adjustment),
        PrayerFajrIqamat:                   APP_GLOBAL.prayer_default_iqamat_title_fajr,
        PrayerDhuhrIqamat:                  APP_GLOBAL.prayer_default_iqamat_title_dhuhr,
        PrayerAsrIqamat:                    APP_GLOBAL.prayer_default_iqamat_title_asr,
        PrayerMaghribIqamat:                APP_GLOBAL.prayer_default_iqamat_title_maghrib,
        PrayerIshaIqamat:                   APP_GLOBAL.prayer_default_iqamat_title_isha,
        PrayerColumnImsakChecked:           Number(APP_GLOBAL.prayer_default_show_imsak),
        PrayerColumnSunsetChecked:          Number(APP_GLOBAL.prayer_default_show_sunset),
        PrayerColumnMidnightChecked:        Number(APP_GLOBAL.prayer_default_show_midnight),
        PrayerColumnFastStartEnd:           Number(APP_GLOBAL.prayer_default_show_fast_start_end)
    };
    APP_GLOBAL.user_settings = {current_id:0,
                                data:[{  Id:null,
                                        Document:Document}]
                                };
    //Design
    COMMON_DOCUMENT.querySelector('#paper').className=APP_GLOBAL.design_default_papersize;
};
 /**
  * @name appCommonFixFloat
  * @description Fix float number
  * @function
  * @param {string} value 
  * @returns {number|null}
  */
const appCommonFixFloat = value =>  (value==''||value==null)?null:parseFloat(value);
/**
 * @name appUserSettingUpdate
 * @description Settings update
 * @function
 * @param {'REGIONAL'|'GPS'|'DESIGN'|'IMAGE'|'TEXT'|'PRAYER'|'USER'} setting_tab
 * @returns {void}
 */
const appUserSettingUpdate = setting_tab => {

    const Document = {  Description:                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.Description,
                        RegionalLanguageLocale:             setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_locale .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalLanguageLocale,
                        RegionalTimezone:                   setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_timezone .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalTimezone,
                        RegionalNumberSystem:               setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_numbersystem .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalNumberSystem,
                        RegionalLayoutDirection:            setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_direction .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalLayoutDirection,
                        RegionalSecondLanguageLocale:       setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_locale_second .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalSecondLanguageLocale,
                        RegionalArabicScript:               setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_arabic_script .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalArabicScript,
                        RegionalCalendarType:               setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_calendartype .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalCalendarType,
                        RegionalCalendarHijriType:          setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_calendar_hijri_type .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalCalendarHijriType,
                        GpsLatText:                         APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLatText,
                        GpsLongText:                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLongText,
                        DesignThemeDayId:                   setting_tab=='DESIGN'?appSettingThemeId('day'):APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignThemeDayId,
                        DesignThemeMonthId:                 setting_tab=='DESIGN'?appSettingThemeId('month'):APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignThemeMonthId,
                        DesignThemeYearId:                  setting_tab=='DESIGN'?appSettingThemeId('year'):APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignThemeYearId,
                        DesignPaperSize:                    setting_tab=='DESIGN'?COMMON_DOCUMENT.querySelector('#setting_select_report_papersize .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignPaperSize,
                        DesignRowHighlight:                 setting_tab=='DESIGN'?COMMON_DOCUMENT.querySelector('#setting_select_report_highlight_row .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignRowHighlight,
                        DesignColumnWeekdayChecked:         setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_weekday').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignColumnWeekdayChecked,
                        DesignColumnCalendarTypeChecked:    setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_calendartype').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignColumnCalendarTypeChecked,
                        DesignColumnNotesChecked:           setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_notes').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignColumnNotesChecked,
                        DesignColumnGpsChecked:             setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_gps').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignColumnGpsChecked,
                        DesignColumnTimezoneChecked:        setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_timezone').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.DesignColumnTimezoneChecked,
                        ImageHeaderImageImg:                setting_tab=='IMAGE'?COMMON_DOCUMENT.querySelector('#setting_reportheader_img').getAttribute('data-image'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.ImageHeaderImageImg,
                        ImageFooterImageImg:                setting_tab=='IMAGE'?COMMON_DOCUMENT.querySelector('#setting_reportfooter_img').getAttribute('data-image'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.ImageFooterImageImg,
                        TextHeader1Text:                    setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportheader1').textContent:  
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextHeader1Text,
                        TextHeader2Text:                    setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportheader2').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextHeader2Text,
                        TextHeader3Text:                    setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportheader3').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextHeader3Text,
                        TextHeaderAlign:                    setting_tab=='TEXT'? (appSettingButtonAlignValue('header')==''?null:appSettingButtonAlignValue('header')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextHeaderAlign,
                        TextFooter1Text:                    setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportfooter1').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextFooter1Text,
                        TextFooter2Text:                    setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportfooter2').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextFooter2Text,
                        TextFooter3Text:                    setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportfooter3').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextFooter3Text,
                        TextFooterAlign:                    setting_tab=='TEXT'? (appSettingButtonAlignValue('footer')==''?null:appSettingButtonAlignValue('footer')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.TextFooterAlign,
                        PrayerMethod:                       setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_method .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerMethod,
                        PrayerAsrMethod:                    setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_asr .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerAsrMethod,
                        PrayerHighLatitudeAdjustment:       setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_highlatitude .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerHighLatitudeAdjustment,
                        PrayerTimeFormat:                   setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_timeformat .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerTimeFormat,
                        PrayerHijriDateAdjustment:          setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_select_hijri_adjustment .common_select_dropdown_value').getAttribute('data-value')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerHijriDateAdjustment,
                        PrayerFajrIqamat:                   setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_fajr .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerFajrIqamat,
                        PrayerDhuhrIqamat:                  setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_dhuhr .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerDhuhrIqamat,
                        PrayerAsrIqamat:                    setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_asr .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerAsrIqamat,
                        PrayerMaghribIqamat:                setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_maghrib .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerMaghribIqamat,
                        PrayerIshaIqamat:                   setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_isha .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerIshaIqamat,
                        PrayerColumnImsakChecked:           setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_imsak').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerColumnImsakChecked,
                        PrayerColumnSunsetChecked:          setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_sunset').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerColumnSunsetChecked,
                        PrayerColumnMidnightChecked:        setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_midnight').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerColumnMidnightChecked,
                        PrayerColumnFastStartEnd:           setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_select_report_show_fast_start_end .common_select_dropdown_value').getAttribute('data-value')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.PrayerColumnFastStartEnd
                    };
    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document = Document;
};

/**
 * @name appUserSettingProfileLink
 * @description Profile user setting show link
 * @function
 * @param {HTMLElement} item 
 * @returns {void}
 */
const appUserSettingProfileLink = item => {
    const select_user_setting = COMMON_DOCUMENT.querySelector('#profile_select_user_settings .common_select_dropdown_value').getAttribute('data-value');
    const sid = JSON.parse(select_user_setting).sid;
    const paper_size = JSON.parse(select_user_setting).paper_size;
    switch (item.id){
        case 'profile_user_settings_day':
        case 'profile_user_settings_month':
        case 'profile_user_settings_year':{
            const url = appReportUrl(JSON.parse(select_user_setting).iam_user_id, 
                                     sid, 
                                     paper_size,
                                     item.id,
                                     'HTML',
                                     true);
            common.commonComponentRender({
                    mountDiv:   'common_app_window_info',
                    data:       {
                                info:'URL',
                                class:paper_size,
                                path:url,
                                method:'GET',
                                body:null,
                                authorization:'APP_ID'
                                },
                    methods:    null,
                    path:       '/common/component/common_app_window_info.js'});
            break;
        }
        case 'profile_user_settings_like':{
            appUserSettingsLike(sid);
            break;
        }
    }
};

/**
 * @name appUserSettingsLike
 * @description User settings like
 * @function
 * @param {number} user_account_app_data_post_id 
 * @returns {void}
 */
const appUserSettingsLike = user_account_app_data_post_id => {
    /**@type{common['CommonRESTAPIMethod']} */
    let method;
    const json = { iam_user_app_data_post_id: user_account_app_data_post_id, 
                        IAM_iam_user_id: common.commonGlobalGet('iam_user_id'),
                        IAM_data_app_id:common.commonGlobalGet('app_id')};
    if (common.commonGlobalGet('iam_user_id') == null)
        common.commonDialogueShow('LOGIN');
    else {
        let path;
        if (COMMON_DOCUMENT.querySelector('#profile_user_settings_like .common_unlike').style.display == 'block'){
            path= '/server-db/iamuserappdatapostlike';
            method = 'POST';
        }
        else{
            path= '/server-db/iamuserappdatapostlike/';
            method = 'DELETE';
        }
        common.commonFFB({  path:path, 
                            method:method, 
                            authorization_type:'APP_ACCESS', 
                            body:json})
        .then(()=>APP_GLOBAL.function_profile_user_setting_update(  COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_id').textContent,
                                                                    JSON.parse(COMMON_DOCUMENT.querySelector('#profile_select_user_settings .common_select_dropdown_value')
                                                                                .getAttribute('data-value')).sid))
        .catch(()=>null);
    }
};
/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventClick = event => {
    const event_target_id = common.commonMiscElementId(event.target);
    switch (event_target_id){
        case event.target?.classList.contains('common_select_option')?event_target_id:'':
        case event.target.parentNode?.classList.contains('common_select_option')?event_target_id:'':{
            //settings regional
            if(event_target_id == 'setting_select_locale'){
                appUserSettingUpdate('REGIONAL');
            }
            if(event_target_id == 'setting_select_report_timezone'){
                appUserSettingUpdate('REGIONAL');
            }
            if(event_target_id == 'setting_select_report_numbersystem' ||
                event_target_id == 'setting_select_report_direction'){
                appUserSettingUpdate('REGIONAL');
            }
            if(event_target_id == 'setting_select_report_locale_second'){
                appUserSettingUpdate('REGIONAL');
            }
            if( event_target_id == 'setting_select_report_arabic_script' ||
                event_target_id == 'setting_select_calendartype' ||
                event_target_id == 'setting_select_calendar_hijri_type'){
                appUserSettingUpdate('REGIONAL');
            }
            //settings gps
            if (event_target_id == 'common_map_control_expand_select_country')
                appUserSettingUpdate('GPS');
            if(event_target_id == 'common_map_control_expand_select_city'){
                appComponentSettingUpdate('GPS', 'CITY');
            }
            //settings design
            if(event_target_id == 'setting_select_report_papersize'){
                appUserSettingUpdate('DESIGN');
                appComponentSettingUpdate('DESIGN', 'PAPER');
            }
            if(event_target_id== 'setting_select_report_highlight_row')
                appUserSettingUpdate('DESIGN');
            //settings prayer
            if (event_target_id == 'setting_select_method'){
                appComponentSettingUpdate('PRAYER', 'METHOD');
                appUserSettingUpdate('PRAYER');
            }
            if (event_target_id == 'setting_select_asr' ||
                event_target_id == 'setting_select_highlatitude' ||
                event_target_id == 'setting_select_timeformat' ||
                event_target_id == 'setting_select_hijri_adjustment' ||
                event_target_id == 'setting_select_report_iqamat_title_fajr' ||
                event_target_id == 'setting_select_report_iqamat_title_dhuhr' ||
                event_target_id == 'setting_select_report_iqamat_title_asr' ||
                event_target_id == 'setting_select_report_iqamat_title_maghrib' ||
                event_target_id == 'setting_select_report_iqamat_title_isha' ||
                event_target_id == 'setting_select_report_show_fast_start_end'){
                appUserSettingUpdate('PRAYER');
            }
            //settings user
            if (event_target_id == 'setting_select_user_setting'){
                appComponentSettingUpdate('USER', 'SETTING');
            }
            //profile
            if (event_target_id== 'profile_select_user_settings'){
                APP_GLOBAL.function_profile_show_user_setting_detail(   Number(JSON.parse(event.target.getAttribute('data-value')).liked), 
                                                                        Number(JSON.parse(event.target.getAttribute('data-value')).count_likes), 
                                                                        Number(JSON.parse(event.target.getAttribute('data-value')).count_views));
            }
            break;
        }
        //toolbar top
        case 'toolbar_btn_zoomout':{
            appPaperZoom(-1);
            break;
        }
        case 'toolbar_btn_zoomin':{
            appPaperZoom(1);
            break;
        }
        case 'toolbar_btn_left':{
            appReportTimetableUpdate(APP_GLOBAL.timetable_type, event_target_id, appReportTimetableSettings());
            break;
        }
        case 'toolbar_btn_right':{
            appReportTimetableUpdate(APP_GLOBAL.timetable_type, event_target_id, appReportTimetableSettings());
            break;
        }
        case 'toolbar_btn_search':{
            const input_row = COMMON_DOCUMENT.querySelector('#common_app_profile_search_input');
            const searchlist = COMMON_DOCUMENT.querySelector('#common_app_profile_search_list_wrap');
            if (input_row.style.visibility == 'visible'){
                input_row.style.visibility='hidden';
                input_row.textContent = '';
                searchlist.style.visibility = 'hidden';
                searchlist.style.display  = 'flex';
                searchlist.textContent = '';
            }
            else{
                input_row.style.visibility='visible';
                searchlist.style.visibility = 'visible';
                searchlist.style.display  = 'none';
            }                   
            COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').focus();
            break;
        }
        case 'toolbar_btn_print':{
            appToolbarButton(1);
            break;
        }
        case 'toolbar_btn_day':{
            appToolbarButton(2);
            break;
        }
        case 'toolbar_btn_month':{
            appToolbarButton(3);
            break;
        }
        case 'toolbar_btn_year':{
            appToolbarButton(4);
            break;
        }
        case 'toolbar_btn_settings':{
            appToolbarButton(5);
            break;
        }
        //tab navigation
        case 'settings_tab_nav_1':
        case 'settings_tab_nav_2':
        case 'settings_tab_nav_3':
        case 'settings_tab_nav_4':
        case 'settings_tab_nav_5':{
            SettingShow(Number(event_target_id.substring(event_target_id.length-1)));
            break;
        }
        case 'settings_tab_nav_6':
        case 'user_setting_avatar_img':{
            SettingShow(6);
            break;
        }
        //settings
        case 'settings_close':{
            common.commonComponentRemove('common_app_dialogues_app_custom');
            const timetable_type = COMMON_DOCUMENT.querySelector('#toolbar_bottom .toolbar_bottom_selected').id
                                        .toLowerCase()
                                        .substring('toolbar_btn_'.length);
            appReportTimetableUpdate(timetable_type=='day'?0:timetable_type=='month'?1:2, null, appReportTimetableSettings());
            break;
        }
        
        //setting design
        case 'setting_design_prev_day':
        case 'setting_design_next_day':
        case 'setting_design_prev_month':
        case 'setting_design_next_month':
        case 'setting_design_prev_year':
        case 'setting_design_next_year':{
            /**@ts-ignore */
            appSettingThemeNav(event_target_id.split('_')[2]=='prev'?-1:1, event_target_id.split('_')[3])
            .then(()=>appUserSettingUpdate('DESIGN'));
            
            break;
        }
        case 'setting_checkbox_report_show_weekday':
        case 'setting_checkbox_report_show_calendartype':
        case 'setting_checkbox_report_show_notes':
        case 'setting_checkbox_report_show_gps':
        case 'setting_checkbox_report_show_timezone':{
            appUserSettingUpdate('DESIGN');
            break;
        }    
        //settings text
        case 'setting_icon_text_theme_day':
        case 'setting_icon_text_theme_month':
        case 'setting_icon_text_theme_year':{
            COMMON_DOCUMENT.querySelector('#setting_icon_text_theme_day').classList.remove('common_app_dialogues_button');
            COMMON_DOCUMENT.querySelector('#setting_icon_text_theme_month').classList.remove('common_app_dialogues_button');
            COMMON_DOCUMENT.querySelector('#setting_icon_text_theme_year').classList.remove('common_app_dialogues_button');
            const  theme_type = event_target_id.substring(24);
            //mark active icon
            COMMON_DOCUMENT.querySelector('#' + event_target_id).classList.add('common_app_dialogues_button');
            COMMON_DOCUMENT.querySelector('#setting_paper_preview_text').className =  'setting_paper_preview' + ' ' +
                                                                                `theme_${theme_type}_${appSettingThemeId(theme_type)} ` + 
                                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.RegionalArabicScript;
            break;
        }
        case 'setting_icon_text_header_aleft':
        case 'setting_icon_text_header_acenter':
        case 'setting_icon_text_header_aright':{
            appComponentSettingUpdate('TEXT', 'HEADER_ALIGN', event_target_id);
            appUserSettingUpdate('TEXT');
            break;
        }
        case 'setting_icon_text_footer_aleft':
        case 'setting_icon_text_footer_acenter':
        case 'setting_icon_text_footer_aright':{
            appComponentSettingUpdate('TEXT', 'FOOTER_ALIGN', event_target_id);
            appUserSettingUpdate('TEXT');
            break;
        }
        //settings prayer
        case 'setting_checkbox_report_show_imsak':
        case 'setting_checkbox_report_show_sunset':
        case 'setting_checkbox_report_show_midnight':{
            appUserSettingUpdate('PRAYER');
            break;
        }
        //settings user
        case 'setting_btn_user_save':{
            appUserSettingFunction('SAVE', false);
            break;
        }
        case 'setting_btn_user_add':{
            appUserSettingFunction('ADD', true);
            break;
        }
        case 'setting_btn_user_delete':{
            appUserSettingDelete();
            break;
        }
        case 'user_day_html':        
        case 'user_month_html':
        case 'user_year_html':{
            appUserSettingLink(COMMON_DOCUMENT.querySelector('#' + event_target_id));
            break;
        }
        //app profile
        case 'profile_main_btn_user_settings':{
            COMMON_DOCUMENT.querySelectorAll('.common_app_dialogues_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_app_dialogues_profile_btn_selected'));
            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_app_dialogues_profile_btn_selected');
            appUserProfileDetail(0);
            break;
        }
        case 'profile_main_btn_user_setting_likes':
        case 'profile_main_btn_user_setting_likes_user_setting':{
            COMMON_DOCUMENT.querySelectorAll('.common_app_dialogues_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_app_dialogues_profile_btn_selected'));
            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_app_dialogues_profile_btn_selected');
            appUserProfileDetail(6);
            break;
        }
        case 'profile_main_btn_user_setting_liked':
        case 'profile_main_btn_user_setting_liked_user_setting':{
            COMMON_DOCUMENT.querySelectorAll('.common_app_dialogues_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_app_dialogues_profile_btn_selected'));
            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_app_dialogues_profile_btn_selected');
            appUserProfileDetail(7);
            break;
        }
        case 'profile_stat_row2_1':{
            appUserProfileStat(4, '/server-db/iamuserappdatapost-profile-stat');
            break;
        }
        case 'profile_stat_row2_2':{
            appUserProfileStat(5, '/server-db/iamuserappdatapost-profile-stat');
            break;
        }
        case 'profile_user_settings_day':
        case 'profile_user_settings_month':
        case 'profile_user_settings_year':
        case 'profile_user_settings_like':{
            appUserSettingProfileLink(COMMON_DOCUMENT.querySelector(`#${event_target_id}`));
            break;
        }
        case 'common_app_dialogues_user_menu_log_out':{
            common.commonUserLogout().then(() => {
                appUserLogout();
            });
            break;
        }
        case 'common_app_dialogues_user_menu_username':{
            appToolbarButton(6);
            break;
        }
        //profile button
        case 'common_app_profile_toolbar_stat':
        case 'common_app_dialogues_profile_stat_row1_1':
        case 'common_app_dialogues_profile_stat_row1_2':
        case 'common_app_dialogues_profile_stat_row1_3':{
            appToolbarButton(7);
            break;
        }
        
        //dialogue user start
        case 'common_app_dialogues_iam_start_login_button':{
            appUserLogin();
            break;
        }
        //dialogue profile 
        case 'common_app_dialogues_profile_home':{
            appToolbarButton(7);
            break;
        }
        case 'common_app_dialogues_profile_info_follow':
        case 'common_app_dialogues_profile_info_like':{
            APP_GLOBAL.function_profile_user_setting_stat(COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_id').textContent);
            break;
        }
        //dialogue profile stat and info list
        case 'common_app_profile_search_list':
        case 'common_app_dialogues_profile_info_list':
        case 'common_app_dialogues_profile_stat_list':{
            if (COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_stat_row2'))
                common.commonComponentRender({
                    mountDiv:   'common_app_dialogues_profile_info_stat_row2',
                    data:       {   
                                iam_user_id:common.commonGlobalGet('iam_user_id'),
                                profile_id:common.commonMiscElementRow(event.target).getAttribute('data-iam_user_id')},
                    methods:    null,
                    path:       '/component/profile_info.js'})
                .then((/**@type{{data:       null, 
                                methods:    {
                                            profile_user_setting_update:function,
                                            commonProfileShow_user_setting_detail:function, 
                                            profile_user_setting_stat:function}}}*/component)=>{
                    APP_GLOBAL.function_profile_user_setting_update = component.methods.profile_user_setting_update;
                    APP_GLOBAL.function_profile_show_user_setting_detail= component.methods.commonProfileShow_user_setting_detail;
                    APP_GLOBAL.function_profile_user_setting_stat = component.methods.profile_user_setting_stat;
                });
            break;
        }

        //map
        case event.target.classList.contains('common_map_tile')?event_target_id:'':
        case event.target.classList.contains('common_map_line')?event_target_id:'':{
            COMMON_DOCUMENT.querySelector('#common_map_control_query').classList.contains('common_map_control_active')?
                appComponentSettingUpdate('GPS', 'CITY'):
                    null;
            break;
        }
        case 'common_map_control_my_location_id':
        case 'common_map_control_expand_search_list':{
            appComponentSettingUpdate('GPS', 'CITY');
            break;
        }
    }
};
/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventKeyUp = event => {
    const event_target_id = common.commonMiscElementId(event.target);
    switch(event_target_id){
        //settings text
        case 'setting_input_reportheader1':
        case 'setting_input_reportheader2':
        case 'setting_input_reportheader3':
        case 'setting_input_reportfooter1':
        case 'setting_input_reportfooter2':
        case 'setting_input_reportfooter3':{
            appUserSettingUpdate('TEXT');
            break;
        }
        //common
        case 'common_app_dialogues_iam_start_login_username':
        case 'common_app_dialogues_iam_start_login_password':{
            if (event.code === 'Enter') {
                event.preventDefault();
                appUserLogin().catch(()=>null);
            }
            break;
        }
    }
};

/**
 * @name appMapQibblaShow
 * @description Map show qibbla
 * @function
 * @returns {void}
 */
const appMapQibblaShow = () => {
    if (APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLongText  &&
        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLatText ){
        /**@type{common['commonGeoJSONPolyline']}*/
        const geoJSONQibbla = 
        {
            type: 'Feature',
            properties: {
                title: APP_GLOBAL.gps_qibbla_title,
                color: APP_GLOBAL.gps_qibbla_color,
                width: APP_GLOBAL.gps_qibbla_width,
                opacity:APP_GLOBAL.gps_qibbla_opacity
            },
            geometry: {
                type: 'LineString',
                coordinates: [  
                    [
                        APP_GLOBAL.gps_qibbla_long, 
                        APP_GLOBAL.gps_qibbla_lat
                    ],
                    [
                        /**@ts-ignore */
                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLongText, 
                        /**@ts-ignore */
                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLatText
                    ]
                ]
            }
        };
        common.commonGlobalGet('component')[common.commonGlobalGet('app_common_app_id') + '_' + 'common_map']?.methods?.drawVectors([geoJSONQibbla]);
        /**@type{common['commonGeoJSONPolyline']}*/
        const geoJSONQibblaOld = 
        {
            type: 'Feature',
            properties: {
                title: APP_GLOBAL.gps_qibbla_old_title,
                color: APP_GLOBAL.gps_qibbla_old_color,
                width: APP_GLOBAL.gps_qibbla_old_width,
                opacity:APP_GLOBAL.gps_qibbla_old_opacity
            },
            geometry: {
                type: 'LineString',
                coordinates: [  
                    [
                        APP_GLOBAL.gps_qibbla_old_long, 
                        APP_GLOBAL.gps_qibbla_old_lat
                    ],
                    [
                        /**@ts-ignore */
                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLongText, 
                        /**@ts-ignore */
                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].Document.GpsLatText
                    ]
                ]
            }
        };
        common.commonGlobalGet('component')[common.commonGlobalGet('app_common_app_id') + '_' + 'common_map']?.methods?.drawVectors([geoJSONQibblaOld]);
    }
};

/**
 * @name appInit
 * @description Init app
 * @function
 * @param {APP_PARAMETERS} parameters 
 * @returns {Promise.<void>}
 */
const appInit = async parameters => {
    await common.commonComponentRender({
        mountDiv:   common.commonGlobalGet('app_div'),
        data:       null,
        methods:    null,
        path:       '/component/app.js'})
        .then(result=>APP_GLOBAL.appLibTimetable = result.methods.appLibTimetable);
    //set papersize
    appPaperZoom();
    //set app and report globals
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.app_copyright = common.commonGlobalGet('app_copyright') ?? '';
    APP_GLOBAL.app_default_startup_page = parseInt(parameters.app_default_startup_page);
    APP_GLOBAL.app_report_timetable = parameters.app_report_timetable;

    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.regional_def_calendar_lang = parameters.app_regional_default_calendar_lang;
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.regional_def_locale_ext_prefix = parameters.app_regional_default_locale_ext_prefix;
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.regional_def_locale_ext_number_system = parameters.app_regional_default_locale_ext_number_system;
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.regional_def_locale_ext_calendar = parameters.app_regional_default_locale_ext_calendar;
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.regional_def_calendar_type_greg = parameters.app_regional_default_calendar_type_greg;
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.regional_def_calendar_number_system = parameters.app_regional_default_calendar_number_system;

    APP_GLOBAL.regional_default_direction = parameters.app_regional_default_direction;
    APP_GLOBAL.regional_default_locale_second = parameters.app_regional_default_locale_second;
    APP_GLOBAL.regional_default_arabic_script = parameters.app_regional_default_arabic_script;
    APP_GLOBAL.regional_default_calendartype = parameters.app_regional_default_calendartype;
    APP_GLOBAL.regional_default_calendar_hijri_type = parameters.app_regional_default_calendar_hijri_type;
    APP_GLOBAL.gps_qibbla_title = parameters.app_gps_qibbla_title;
    APP_GLOBAL.gps_qibbla_text_size = parseFloat(parameters.app_gps_qibbla_text_size);
    APP_GLOBAL.gps_qibbla_lat = parseFloat(parameters.app_gps_qibbla_lat);
    APP_GLOBAL.gps_qibbla_long = parseFloat(parameters.app_gps_qibbla_long);
    APP_GLOBAL.gps_qibbla_color = parameters.app_gps_qibbla_color;
    APP_GLOBAL.gps_qibbla_width = parseFloat(parameters.app_gps_qibbla_width);
    APP_GLOBAL.gps_qibbla_opacity = parseFloat(parameters.app_gps_qibbla_opacity);
    APP_GLOBAL.gps_qibbla_old_title = parameters.app_gps_qibbla_old_title;
    APP_GLOBAL.gps_qibbla_old_text_size = parseFloat(parameters.app_gps_qibbla_old_text_size);
    APP_GLOBAL.gps_qibbla_old_lat = parseFloat(parameters.app_gps_qibbla_old_lat);
    APP_GLOBAL.gps_qibbla_old_long = parseFloat(parameters.app_gps_qibbla_old_long);
    APP_GLOBAL.gps_qibbla_old_color = parameters.app_gps_qibbla_old_color;
    APP_GLOBAL.gps_qibbla_old_width = parseFloat(parameters.app_gps_qibbla_old_width);
    APP_GLOBAL.gps_qibbla_old_opacity = parseFloat(parameters.app_gps_qibbla_old_opacity);
    APP_GLOBAL.design_default_theme_day = parameters.app_design_default_theme_day;
    APP_GLOBAL.design_default_theme_month = parameters.app_design_default_theme_month;
    APP_GLOBAL.design_default_theme_year = parameters.app_design_default_theme_year;
    APP_GLOBAL.design_default_papersize = parameters.app_design_default_papersize;
    APP_GLOBAL.design_default_highlight_row = parameters.app_design_default_highlight_row;
    APP_GLOBAL.design_default_show_weekday = (parameters.app_design_default_show_weekday=== true);
    APP_GLOBAL.design_default_show_calendartype = (parameters.app_design_default_show_calendartype=== true);
    APP_GLOBAL.design_default_show_notes = (parameters.app_design_default_show_notes=== true);
    APP_GLOBAL.design_default_show_gps = (parameters.app_design_default_show_gps=== true);
    APP_GLOBAL.design_default_show_timezone = (parameters.app_design_default_show_timezone=== true);
    APP_GLOBAL.text_default_reporttitle1 = parameters.app_text_default_reporttitle1;
    APP_GLOBAL.text_default_reporttitle2 = parameters.app_text_default_reporttitle2;
    APP_GLOBAL.text_default_reporttitle3 = parameters.app_text_default_reporttitle3;
    APP_GLOBAL.text_default_reportfooter1 = parameters.app_text_default_reportfooter1;
    APP_GLOBAL.text_default_reportfooter2 = parameters.app_text_default_reportfooter2;
    APP_GLOBAL.text_default_reportfooter3 = parameters.app_text_default_reportfooter3;
    APP_GLOBAL.image_default_report_header_src = parameters.app_image_default_report_header_src;
    APP_GLOBAL.image_default_report_footer_src = parameters.app_image_default_report_footer_src;
    APP_GLOBAL.prayer_default_method = parameters.app_prayer_default_method;
    APP_GLOBAL.prayer_default_asr = parameters.app_prayer_default_asr;
    APP_GLOBAL.prayer_default_highlatitude = parameters.app_prayer_default_highlatitude;
    APP_GLOBAL.prayer_default_timeformat = parameters.app_prayer_default_timeformat;
    APP_GLOBAL.prayer_default_hijri_adjustment = parameters.app_prayer_default_hijri_adjustment;
    APP_GLOBAL.prayer_default_iqamat_title_fajr = parameters.app_prayer_default_iqamat_title_fajr;
    APP_GLOBAL.prayer_default_iqamat_title_dhuhr = parameters.app_prayer_default_iqamat_title_dhuhr;
    APP_GLOBAL.prayer_default_iqamat_title_asr = parameters.app_prayer_default_iqamat_title_asr;
    APP_GLOBAL.prayer_default_iqamat_title_maghrib = parameters.app_prayer_default_iqamat_title_maghrib;
    APP_GLOBAL.prayer_default_iqamat_title_isha = parameters.app_prayer_default_iqamat_title_isha;
    APP_GLOBAL.prayer_default_show_imsak = (parameters.app_prayer_default_show_imsak=== true);
    APP_GLOBAL.prayer_default_show_sunset = (parameters.app_prayer_default_show_sunset=== true);
    APP_GLOBAL.prayer_default_show_midnight = (parameters.app_prayer_default_show_midnight=== true);
    APP_GLOBAL.prayer_default_show_fast_start_end = parseInt(parameters.app_prayer_default_show_fast_start_end);

    //set current date for report month
    //if client_timezone is set, set Date with client_timezone
    if (common.commonGlobalGet('client_timezone'))
        APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate = common.commonMiscTimezoneDate(common.commonGlobalGet('client_timezone'));
    else
        APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate = new Date();
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentHijriDate = [0,0];
    //get Hijri date from initial Gregorian date
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentHijriDate[0] = 
        parseInt(new Date(  APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getFullYear(),
                            APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getMonth(),
                            APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { month: 'numeric' }));
    APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentHijriDate[1] = 
        parseInt(new Date(  APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getFullYear(),
                            APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getMonth(),
                            APP_GLOBAL.appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { year: 'numeric' }));

    await appUserSettingDefaultSet();
    //show default startup
    await appToolbarButton(APP_GLOBAL.app_default_startup_page);
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {common['CommonModuleCommon']} commonLib
 * @param {APP_PARAMETERS} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {
    common = commonLib;
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.commonGlobalSet('app_function_session_expired', appUserLogout);
    await appInit(parameters);
};
/**
 * @name appMetadata
 * @description App metadata for event delegataion and lifecycle events
 * @function
 * @returns {common['commonMetadata']}
 */
const appMetadata = () =>{
    return { 
        events:{  
            click:   appEventClick,
            keyup:   appEventKeyUp},
        lifeCycle:{onMounted:appUserLoginPost}
    };
};
export{ appCommonInit, appComponentSettingUpdate, appSettingThemeThumbnailsUpdate, appMetadata};
export default appCommonInit;