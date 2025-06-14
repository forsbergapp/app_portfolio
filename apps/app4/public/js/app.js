/**
 * Timetable app
 * @module apps/app4/app
 */
/**
 * @import {commonMetadata, CommonAppEvent, CommonRESTAPIMethod, CommonComponentResult, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 * @import {APP_PARAMETERS, APP_user_setting_data, APP_user_setting_record, APP_REPORT_day_user_account_app_data_posts, APP_REPORT_settings, APP_GLOBAL, 
 *          CommonModuleLibTimetable, APP_user_setting} from './types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

/**@type {CommonModuleCommon} */
let common;

/**@type {CommonModuleLibTimetable} */
let appLibTimetable;

/**@type{APP_user_setting} */
const APP_USER_SETTINGS_EMPTY = {current_id:0,
                             data:[{id:0,
                                    json_data: {description: '',
                                                regional_language_locale: '',
                                                regional_timezone: '',
                                                regional_number_system: '',
                                                regional_layout_direction: '',
                                                regional_second_language_locale: '',
                                                regional_arabic_script: '',
                                                regional_calendar_type: '',
                                                regional_calendar_hijri_type: '',
                                                gps_popular_place_id: null,
                                                gps_lat_text: null,
                                                gps_long_text: null,
                
                                                design_theme_day_id: '',
                                                design_theme_month_id: '',
                                                design_theme_year_id: '',
                                                design_paper_size: '',
                                                design_row_highlight: '0',
                                                design_column_weekday_checked: 0,
                                                design_column_calendartype_checked: 0,
                                                design_column_notes_checked: 0,
                                                design_column_gps_checked: 0,
                                                design_column_timezone_checked: 0,
                
                                                image_header_image_img: '',
                                                image_footer_image_img: '',
                
                                                text_header_1_text: '',
                                                text_header_2_text: '',
                                                text_header_3_text: '',
                                                text_header_align: null,
                                                text_footer_1_text: '',
                                                text_footer_2_text: '',
                                                text_footer_3_text: '',
                                                text_footer_align: null,
                
                                                prayer_method: '',
                                                prayer_asr_method: '',
                                                prayer_high_latitude_adjustment: '',
                                                prayer_time_format: '',
                                                prayer_hijri_date_adjustment: 0,
                                                prayer_fajr_iqamat: '',
                                                prayer_dhuhr_iqamat: '',
                                                prayer_asr_iqamat: '',
                                                prayer_maghrib_iqamat: '',
                                                prayer_isha_iqamat: '',
                                                prayer_column_imsak_checked: 0,
                                                prayer_column_sunset_checked: 0,
                                                prayer_column_midnight_checked: 0,
                                                prayer_column_fast_start_end: 0}}
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
    regional_default_calendartype:'',
    regional_default_calendar_hijri_type:'',

    gps_default_place_id:0,
    gps_module_leaflet_qibbla_title:'',
    gps_module_leaflet_qibbla_text_size:0,
    gps_module_leaflet_qibbla_lat:0,
    gps_module_leaflet_qibbla_long:0,
    gps_module_leaflet_qibbla_color:'',
    gps_module_leaflet_qibbla_width:0,
    gps_module_leaflet_qibbla_opacity:0,
    gps_module_leaflet_qibbla_old_title:'',
    gps_module_leaflet_qibbla_old_text_size:0,
    gps_module_leaflet_qibbla_old_lat:0,
    gps_module_leaflet_qibbla_old_long:0,
    gps_module_leaflet_qibbla_old_color:'',
    gps_module_leaflet_qibbla_old_width:0,
    gps_module_leaflet_qibbla_old_opacity:0,

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
    places:null,
    user_settings:APP_USER_SETTINGS_EMPTY,
    themes: {data:[{type:'', value:'', text:''}]},
    //profile_info functions
    function_profile_user_setting_update: ()=>null,
    function_profile_show_user_setting_detail: ()=>null,
    function_profile_user_setting_stat: ()=>null
};
Object.seal(APP_GLOBAL);

/**
 * @name appReportTimetablePrint
 * @description Print timetable
 * @function
 * @returns {Promise.<void>}
 */
const appReportTimetablePrint = async () => {
    /**@type{CommonComponentResult}*/
    const {template} = await common.commonComponentRender({ mountDiv:   null,
                                                            data:  {   
                                                            commonMountdiv:null, 
                                                            appHtml:COMMON_DOCUMENT.querySelector('#paper').outerHTML
                                                            },
                                                    methods:{
                                                            COMMON_DOCUMENT:COMMON_DOCUMENT,
                                                            commonMiscResourceFetch:common.commonMiscResourceFetch
                                                            },
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
    const setting_global = APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data;
    const place = APP_GLOBAL.places?APP_GLOBAL.places.filter(place=>place.id==setting_global.gps_popular_place_id)[0]:null;
    return {    locale              	: setting_global.regional_language_locale,
                timezone            	: setting_global.regional_timezone,
                number_system       	: setting_global.regional_number_system,
                direction           	: setting_global.regional_layout_direction,
                second_locale       	: setting_global.regional_second_language_locale,
                arabic_script       	: setting_global.regional_arabic_script,
                calendartype        	: setting_global.regional_calendar_type,
                calendar_hijri_type 	: setting_global.regional_calendar_hijri_type,

                place               	: place?place.text:setting_global.description ??'',
                gps_lat             	: setting_global.gps_lat_text,
                gps_long            	: setting_global.gps_long_text,

                theme_day           	: 'theme_day_' + setting_global.design_theme_day_id,
                theme_month         	: 'theme_month_' + setting_global.design_theme_month_id,
                theme_year          	: 'theme_year_' + setting_global.design_theme_year_id,    
                //papersize missing
                highlight           	: setting_global.design_row_highlight,
                show_weekday        	: setting_global.design_column_weekday_checked,
                show_calendartype   	: setting_global.design_column_calendartype_checked,
                show_notes          	: setting_global.design_column_notes_checked,
                show_gps   	       		: setting_global.design_column_gps_checked,
                show_timezone       	: setting_global.design_column_timezone_checked,
                
                header_img_src      	: setting_global.image_header_image_img,
				footer_img_src      	: setting_global.image_footer_image_img,

                header_txt1         	: setting_global.text_header_1_text,
                header_txt2         	: setting_global.text_header_2_text,
                header_txt3         	: setting_global.text_header_3_text,
                header_align            : setting_global.text_header_align,
                footer_txt1         	: setting_global.text_footer_1_text,
                footer_txt2         	: setting_global.text_footer_2_text,
                footer_txt3    	   		: setting_global.text_footer_3_text,
                footer_align            : setting_global.text_footer_align,
                
                method              	: setting_global.prayer_method,
                asr                 	: setting_global.prayer_asr_method,
                highlat             	: setting_global.prayer_high_latitude_adjustment,
                format              	: setting_global.prayer_time_format,
                hijri_adj           	: setting_global.prayer_hijri_date_adjustment,
                iqamat_fajr         	: setting_global.prayer_fajr_iqamat,
                iqamat_dhuhr        	: setting_global.prayer_dhuhr_iqamat,
                iqamat_asr          	: setting_global.prayer_asr_iqamat,
                iqamat_maghrib      	: setting_global.prayer_maghrib_iqamat,
                iqamat_isha         	: setting_global.prayer_isha_iqamat,
                show_imsak          	: setting_global.prayer_column_imsak_checked,
                show_sunset         	: setting_global.prayer_column_sunset_checked,
                show_midnight       	: setting_global.prayer_column_midnight_checked,
                show_fast_start_end 	: setting_global.prayer_column_fast_start_end,
                
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
                description : setting.json_data.description??'',
                regional_language_locale : setting.json_data.regional_language_locale,
                regional_timezone : setting.json_data.regional_timezone,
                regional_number_system : setting.json_data.regional_number_system,
                regional_calendar_hijri_type : setting.json_data.regional_calendar_hijri_type,
                gps_lat_text : setting.json_data.gps_lat_text,
                gps_long_text : setting.json_data.gps_long_text,
                prayer_method : setting.json_data.prayer_method,
                prayer_asr_method : setting.json_data.prayer_asr_method,
                prayer_high_latitude_adjustment : setting.json_data.prayer_high_latitude_adjustment,
                prayer_time_format : setting.json_data.prayer_time_format,
                prayer_hijri_date_adjustment : setting.json_data.prayer_hijri_date_adjustment
                });
            }
            COMMON_DOCUMENT.querySelector('#paper').innerHTML = appLibTimetable.component({	data:		{
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
            COMMON_DOCUMENT.querySelector('#paper').innerHTML = appLibTimetable.component({	data:		{
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
            COMMON_DOCUMENT.querySelector('#paper').innerHTML = appLibTimetable.component({	data:		{
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
        module_parameters += `&uid_view=${common.COMMON_GLOBAL.iam_user_app_id??''}`;
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
                description : setting.json_data.description??'',
                regional_language_locale : setting.json_data.regional_language_locale,
                regional_timezone : setting.json_data.regional_timezone,
                regional_number_system : setting.json_data.regional_number_system,
                regional_calendar_hijri_type : setting.json_data.regional_calendar_hijri_type,
                gps_lat_text : setting.json_data.gps_lat_text,
                gps_long_text : setting.json_data.gps_long_text,
                prayer_method : setting.json_data.prayer_method,
                prayer_asr_method : setting.json_data.prayer_asr_method,
                prayer_high_latitude_adjustment : setting.json_data.prayer_high_latitude_adjustment,
                prayer_time_format : setting.json_data.prayer_time_format,
                prayer_hijri_date_adjustment : setting.json_data.prayer_hijri_date_adjustment
            };
        });
        
        const result = appLibTimetable.component({	data:		{
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
                        class:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_paper_size,
                        theme_id:COMMON_DOCUMENT.querySelector('#setting_design_theme_day').getAttribute('data-theme_id'),
                        type:'day',
                        html:result.template
                        },
            methods:    null,
            path:       '/component/settings_tab3_theme_thumbnail.js'});
    }
    if (theme?.type =='month' || theme?.type=='year' || theme==null){
        const result_month = appLibTimetable.component({	data:		{
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
        const result_year = appLibTimetable.component({	data:		{
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
                                                    class:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_paper_size,
                                                    theme_id:COMMON_DOCUMENT.querySelector('#setting_design_theme_month').getAttribute('data-theme_id'),
                                                    type:'month',
                                                    html:result_month.template
                                                    },
                                        methods:    null,
                                        path:       '/component/settings_tab3_theme_thumbnail.js'});
        await common.commonComponentRender({  mountDiv:   'setting_design_theme_year',
                                        data:       { 
                                                    class:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_paper_size,
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
    const current_user_theme_id = APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data[`design_theme_${type}_id`];

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
    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data[`design_theme_${type}_id`] = 
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
        timeZone: common.COMMON_GLOBAL.user_timezone,
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
        element_setting_current_date.textContent = new Date().toLocaleTimeString(common.COMMON_GLOBAL.user_locale, options);    
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
    const paper = COMMON_DOCUMENT.querySelector('#paper');
    const settings = COMMON_DOCUMENT.querySelector('#settings');

    switch (choice) {
        //print
        case 1:
            {
                if (common.commonMiscMobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                appReportTimetablePrint();
                break;
            }
        case 2:
        case 3:
        case 4:
            {
                if (common.commonMiscMobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
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
                    paper.style.display = 'none';
                settings.style.visibility = 'visible';
                common.commonComponentRender({  
                    mountDiv:   'settings',
                    data:       {
                                iam_user_id:common.COMMON_GLOBAL.iam_user_id,
                                avatar:COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img')?.getAttribute('data-image')
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
                settings.style.visibility = 'hidden';
                break;
            }
        //profile stat
        case 7:
            {
                settings.style.visibility = 'hidden';
                common.commonComponentRender({
                    mountDiv:   'common_profile_stat_row2',
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
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data,
                            common_app_id:common.COMMON_GLOBAL.app_common_app_id,
                            app_id:common.COMMON_GLOBAL.app_id,
                            user_locale:common.COMMON_GLOBAL.user_locale,
                            user_timezone:common.COMMON_GLOBAL.user_timezone},
                methods:    {
                            appComponentSettingUpdate:appComponentSettingUpdate,
                            commonComponentRender:common.commonComponentRender,
                            commonFFB:common.commonFFB,
                            commonMiscSelectCurrentValueSet:common.commonMiscSelectCurrentValueSet,
                            commonWindowFromBase64:common.commonWindowFromBase64,
                            
                            },
                path:       `/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 2:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            app_id:common.COMMON_GLOBAL.app_id,
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data
                            },
                methods:    {
                            lib_timetable_APP_REPORT_GLOBAL:appLibTimetable.APP_REPORT_GLOBAL,
                            appComponentSettingUpdate:appComponentSettingUpdate,
                            getTimezone:(await common.commonMiscImport(common.commonMiscImportmap('regional'))).getTimezone,
                            commonComponentRender:common.commonComponentRender,
                            commonFFB:common.commonFFB,
                            commonMiscSelectCurrentValueSet:common.commonMiscSelectCurrentValueSet,
                            commonMiscTimezoneDate:common.commonMiscTimezoneDate,
                            commonModuleLeafletInit:common.commonModuleLeafletInit,
                            commonWindowFromBase64:common.commonWindowFromBase64
                            },
                path:       `/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 3:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            common_app_id:common.COMMON_GLOBAL.app_common_app_id,
                            app_id:common.COMMON_GLOBAL.app_id,
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data,
                            themes:APP_GLOBAL.themes},
                methods:    {
                            appSettingThemeThumbnailsUpdate:appSettingThemeThumbnailsUpdate,
                            commonComponentRender:common.commonComponentRender,
                            commonFFB:common.commonFFB,
                            commonMiscSelectCurrentValueSet:common.commonMiscSelectCurrentValueSet,
                            commonWindowFromBase64:common.commonWindowFromBase64
                            },
                path:       `/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 4:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            app_id:common.COMMON_GLOBAL.app_id,
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data
                            },
                methods:    {appComponentSettingUpdate:appComponentSettingUpdate},
                path:`/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 5:{
            common.commonComponentRender({  
                mountDiv:   'settings_content',
                data:       {
                            app_id:common.COMMON_GLOBAL.app_id,
                            user_settings:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data,
                            methods:appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods
                            },
                methods:    {
                            appComponentSettingUpdate:appComponentSettingUpdate,
                            commonComponentRender:common.commonComponentRender,
                            commonFFB:common.commonFFB,
                            commonMiscSelectCurrentValueSet:common.commonMiscSelectCurrentValueSet,
                            commonWindowFromBase64:common.commonWindowFromBase64
                            },
                path:`/component/settings_tab${tab_selected}.js`});
            break;
        }
        case 6:{
            common.commonComponentRender({
                mountDiv:   'settings_content',
                data:       {user_settings:APP_GLOBAL.user_settings},
                methods:    {commonComponentRender:common.commonComponentRender},
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
        case 'GPS_MAP':
            {
                const gps_lat_input = COMMON_DOCUMENT.querySelector('#setting_input_lat');
                const gps_long_input = COMMON_DOCUMENT.querySelector('#setting_input_long');
                appModuleLeafletMapUpdate({longitude:gps_long_input.textContent,
                                latitude:gps_lat_input.textContent,
                                text_place:COMMON_DOCUMENT.querySelector('#setting_input_place').textContent,
                                country:'',
                                city:'',
                                timezone_text :null
                            });
                break;
            }
        case 'GPS_CITY':
            {                    
                //read from Leaflet module and custom code
                //read from latest popup
                const popup = COMMON_DOCUMENT.querySelectorAll('.common_module_leaflet_popup_sub_title_gps')[COMMON_DOCUMENT.querySelectorAll('.common_module_leaflet_popup_sub_title_gps').length - 1 ];
                const country = popup.getAttribute('data-country');
                const city = popup.getAttribute('data-city');
                const timezone = popup.getAttribute('data-timezone');
                const latitude = popup.getAttribute('data-latitude');
                const longitude = popup.getAttribute('data-longitude');
                
                //update value in app
                
                
                const gps_lat_input = COMMON_DOCUMENT.querySelector('#setting_input_lat');
                const gps_long_input = COMMON_DOCUMENT.querySelector('#setting_input_long');
                gps_long_input.textContent = longitude;
                gps_lat_input.textContent = latitude;

                if (city=='' && country==''){
                    //Set place from city + country from popup title
                    COMMON_DOCUMENT.querySelector('#setting_input_place').textContent = 
                        COMMON_DOCUMENT.querySelectorAll('.common_module_leaflet_popup_title')[COMMON_DOCUMENT.querySelectorAll('.common_module_leaflet_popup_title').length - 1 ].textContent;
                }
                else{
                    //Set place from city + country from data attributes
                    COMMON_DOCUMENT.querySelector('#setting_input_place').textContent = city + ', ' + country;
                }
                //display empty popular place select
                common.commonMiscSelectCurrentValueSet('setting_select_popular_place', null, 'id', null);
                appModuleLeafletMapQibblaShow();
                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_timezone = timezone;
                appLibTimetable.APP_REPORT_GLOBAL.session_currentDate = common.commonMiscTimezoneDate(timezone);
                appUserSettingUpdate('GPS');    
                break;
            }
        case 'GPS_POPULAR_PLACES':
            {
                
                const select_place = JSON.parse(COMMON_DOCUMENT.querySelector('#setting_select_popular_place .common_select_dropdown_value').getAttribute('data-value'));
                const gps_lat_input = COMMON_DOCUMENT.querySelector('#setting_input_lat');
                const gps_long_input = COMMON_DOCUMENT.querySelector('#setting_input_long');
                
                //set GPS and timezone
                const longitude_selected = select_place.longitude;
                const latitude_selected = select_place.latitude;
                const timezone_selected = select_place.timezone;

                gps_long_input.textContent = longitude_selected;
                gps_lat_input.textContent = latitude_selected;

                    //Update map
                    appModuleLeafletMapUpdate({longitude:      longitude_selected,
                                    latitude:       latitude_selected,
                                    text_place:     COMMON_DOCUMENT.querySelector('#setting_select_popular_place .common_select_dropdown_value').textContent,
                                    country:        '',
                                    city:           '',
                                    timezone_text : timezone_selected
                                });
                    
                    common.COMMON_GLOBAL.moduleLeaflet.methods.map_toolbar_reset();
                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_timezone = timezone_selected;
                const title = COMMON_DOCUMENT.querySelector('#setting_select_popular_place .common_select_dropdown_value').textContent;
                COMMON_DOCUMENT.querySelector('#setting_input_place').textContent = title;
                appUserSettingUpdate('GPS');
                break;
            }
        case 'GPS_POSITION':
            {
                
                const gps_lat_input = COMMON_DOCUMENT.querySelector('#setting_input_lat');
                const gps_long_input = COMMON_DOCUMENT.querySelector('#setting_input_long');
                
                common.commonMiscSelectCurrentValueSet('setting_select_popular_place', null, 'id', null);

                common.commonMicroserviceGeolocationPlace(gps_long_input.textContent, gps_lat_input.textContent).then((/**@type{string}*/gps_place) => {
                    //Update map
                    COMMON_DOCUMENT.querySelector('#setting_input_place').textContent = gps_place;
                    appModuleLeafletMapUpdate({longitude:gps_long_input.textContent,
                                    latitude:gps_lat_input.textContent,
                                    text_place:gps_place,
                                    country:'',
                                    city:'',
                                    timezone_text :null})
                    .then((timezone_text) => {
                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_timezone = timezone_text ?? '';
                    });
                    common.COMMON_GLOBAL.moduleLeaflet.methods.map_toolbar_reset();
                    appUserSettingUpdate('GPS');
                });
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
                if (typeof appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods[method].params.fajr == 'string')
                    suffix = '';
                else
                    suffix = '°';
                COMMON_DOCUMENT.querySelector('#setting_method_param_fajr').textContent = 'Fajr:' + appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods[method].params.fajr + suffix;
                if (typeof appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods[method].params.isha == 'string')
                    suffix = '';
                else
                    suffix = '°';
                COMMON_DOCUMENT.querySelector('#setting_method_param_isha').textContent = 'Isha:' + appLibTimetable.APP_REPORT_GLOBAL.CommonModulePrayTimes_methods[method].params.isha + suffix;
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
    if (common.COMMON_GLOBAL.iam_user_id !=null){
        //if user has not any posts saved then create default
        const result = await common.commonFFB({ path:'/server-db/iamuserappdatapost/', 
                                                query:`IAM_data_app_id=${common.COMMON_GLOBAL.app_id}&iam_user_id=${common.COMMON_GLOBAL.iam_user_id??''}`, 
                                                method:'GET', authorization_type:'APP_ID'});
        if (JSON.parse(result).rows.length==0){
            await appUserSettingFunction('ADD_LOGIN', true);
        }
        //Hide settings
        COMMON_DOCUMENT.querySelector('#settings').style.visibility = 'hidden';
        common.commonComponentRemove('common_dialogue_profile');
        
        COMMON_DOCUMENT.querySelector('#paper').textContent='';
        appUserSettingsGet().then(() => {
            //show default startup
            appToolbarButton(APP_GLOBAL.app_default_startup_page);
        });
    }
    
};

/**
 * @name appUserFunction
 * @description User function
 * @function
 * @param {'FOLLOW'|'LIKE'} function_name 
 * @returns {Promise.<void>}
 */
const appUserFunction = async (function_name) => {
    await common.commonUserFunction(function_name)
    .then(()=>appUserProfileStatUpdate())
    .catch(()=>null);
};

/**
 * @name appUserLogout
 * @description User logout
 * @function
 * @returns {void}
 */
const appUserLogout = () => {
    common.commonComponentRemove('settings_tab_nav_6');
    common.commonComponentRemove('common_dialogue_profile', true);
    //set default settings
    appUserSettingDefaultSet().then(() => {
        //show default startup
        appToolbarButton(APP_GLOBAL.app_default_startup_page);
    });
};

/**
 * @name appUserProfileStatUpdate
 * @description Profile stat update
 * @function
 * @returns {Promise.<void>}
 */
const appUserProfileStatUpdate = async () => {
    const result = await common.commonProfileUpdateStat();
    APP_GLOBAL.function_profile_user_setting_stat(result.id);
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
            mountDiv:   'common_profile_stat_row2',
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
    if (common.COMMON_GLOBAL.iam_user_id || 0 !== 0) {
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
        common.commonFFB({path:'/server-db/iamuserappdatapost/', query:`IAM_data_app_id=${common.COMMON_GLOBAL.app_id}&iam_user_id=${common.COMMON_GLOBAL.iam_user_id??''}`, method:'GET', authorization_type:'APP_ID'})
        .then((/**@type{string}*/result)=>{
            const settings = JSON.parse(result).rows.map((/** @type{APP_user_setting_record}*/setting)=>{
                const json_data = {description:setting.description,
                    regional_language_locale:setting.regional_language_locale,
                    regional_timezone:setting.regional_timezone,
                    regional_number_system:setting.regional_number_system,
                    regional_layout_direction:setting.regional_layout_direction,
                    regional_second_language_locale:setting.regional_second_language_locale,
                    regional_arabic_script:setting.regional_arabic_script,
                    regional_calendar_type:setting.regional_calendar_type,
                    regional_calendar_hijri_type:setting.regional_calendar_hijri_type,
                    gps_popular_place_id: setting.gps_popular_place_id,
                    gps_lat_text:typeof setting.gps_lat_text== 'string'?appCommonFixFloat(setting.gps_lat_text):setting.gps_lat_text,
                    gps_long_text:typeof setting.gps_long_text=='string'?appCommonFixFloat(setting.gps_long_text):setting.gps_long_text,
                    design_theme_day_id:setting.design_theme_day_id,
                    design_theme_month_id:setting.design_theme_month_id,
                    design_theme_year_id:setting.design_theme_year_id,
                    design_paper_size:setting.design_paper_size,
                    design_row_highlight:setting.design_row_highlight,
                    design_column_weekday_checked:Number(setting.design_column_weekday_checked),
                    design_column_calendartype_checked:Number(setting.design_column_calendartype_checked),
                    design_column_notes_checked:Number(setting.design_column_notes_checked),
                    design_column_gps_checked:Number(setting.design_column_gps_checked),
                    design_column_timezone_checked:Number(setting.design_column_timezone_checked),
                    image_header_image_img:setting.image_header_image_img,
                    image_footer_image_img:setting.image_footer_image_img,
                    text_header_1_text:setting.text_header_1_text,
                    text_header_2_text:setting.text_header_2_text,
                    text_header_3_text:setting.text_header_3_text,
                    text_header_align:setting.text_header_align==''?null:setting.text_header_align,
                    text_footer_1_text:setting.text_footer_1_text,
                    text_footer_2_text:setting.text_footer_2_text,
                    text_footer_3_text:setting.text_footer_3_text,
                    text_footer_align:setting.text_footer_align==''?null:setting.text_footer_align,
                    prayer_method:setting.prayer_method,
                    prayer_asr_method:setting.prayer_asr_method,
                    prayer_high_latitude_adjustment:setting.prayer_high_latitude_adjustment,
                    prayer_time_format:setting.prayer_time_format,
                    prayer_hijri_date_adjustment:Number(setting.prayer_hijri_date_adjustment),
                    prayer_fajr_iqamat:setting.prayer_fajr_iqamat,
                    prayer_dhuhr_iqamat:setting.prayer_dhuhr_iqamat,
                    prayer_asr_iqamat:setting.prayer_asr_iqamat,
                    prayer_maghrib_iqamat:setting.prayer_maghrib_iqamat,
                    prayer_isha_iqamat:setting.prayer_isha_iqamat,
                    prayer_column_imsak_checked:Number(setting.prayer_column_imsak_checked),
                    prayer_column_sunset_checked:Number(setting.prayer_column_sunset_checked),
                    prayer_column_midnight_checked:Number(setting.prayer_column_midnight_checked),
                    prayer_column_fast_start_end:Number(setting.prayer_column_fast_start_end) 
                };
                return {
                        id:setting.id,
                        json_data:json_data
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
    const sid = APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].id;
    switch (item.id){
        case 'user_day_html':
        case 'user_month_html':
        case 'user_year_html':{
            const url = appReportUrl( common.COMMON_GLOBAL.iam_user_id, 
                                        sid ?? 0, 
                                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_paper_size,
                                        item.id,
                                        'HTML');
            common.commonComponentRender({
                    mountDiv:   'common_window_info',
                    data:       {
                                info:'URL',
                                path:url,
                                method:'GET',
                                authorization:'APP_ID',
                                class:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_paper_size
                                },
                    methods:    {commonFFB:common.commonFFB},
                    path:       '/common/component/common_window_info.js'});
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
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.description??'',null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.gps_lat_text?.toString()??'',null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.gps_long_text?.toString()??'',null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_header_1_text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_header_2_text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_header_3_text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_footer_1_text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_footer_2_text,null],
                                                [APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_footer_3_text,null]
                                                ]})==true){
        
        const body = {  json_data:              APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data,
                        IAM_iam_user_app_id:    common.COMMON_GLOBAL.iam_user_app_id
                    };
        /**@type {CommonRESTAPIMethod}*/
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
                const user_setting_id = APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].id;
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
                        const data = {  id:         JSON.parse(result).id, 
                                        json_data:  JSON.parse(JSON.stringify(APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data))};
                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.data.length+0] = data;
                        APP_GLOBAL.user_settings.current_id = APP_GLOBAL.user_settings.data.length -1;
                    }
                    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].id = JSON.parse(result).insertId;

                    //Update select
                    common.commonComponentRender({
                        mountDiv:   'setting_select_user_setting',
                        data:       {
                                    default_data_value:APP_GLOBAL.user_settings.current_id,
                                    default_value:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.description,
                                    options: APP_GLOBAL.user_settings.data.map((setting, index)=>{return {value:index, text:setting.json_data.description};}),
                                    path:null,
                                    query:null,
                                    method:null,
                                    authorization_type:null,
                                    column_value:'value',
                                    column_text:'text'
                                    },
                        methods:    {commonFFB:null},
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
    const user_setting_id = APP_GLOBAL.user_settings.data[COMMON_DOCUMENT.querySelector('#setting_select_user_setting .common_select_dropdown_value').getAttribute('data-value')].id;
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
                                body:{IAM_iam_user_app_id:common.COMMON_GLOBAL.iam_user_app_id}, spinner_id:'setting_btn_user_delete'})
            .then(()=>{
                common.commonComponentRemove('common_dialogue_message', true);
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
                                    default_value:APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.description,
                                    /**@ts-ignore */
                                    options: APP_GLOBAL.user_settings.data.map((setting, index)=>{return {value:index, text:setting.json_data.description};}),
                                    path:null,
                                    query:null,
                                    method:null,
                                    authorization_type:null,
                                    column_value:'value',
                                    column_text:'text'
                                    },
                        methods:    {commonFFB:null},
                        path:       '/common/component/common_select.js'});
                }
                
            })
            .catch(()=>common.commonComponentRemove('common_dialogue_message', true));
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
    const json_data = {
        description:                        common.COMMON_GLOBAL.client_place,
        regional_language_locale:           common.COMMON_GLOBAL.user_locale,
        regional_timezone:                  (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude)?
                                                (await common.commonMiscImport(common.commonMiscImportmap('regional')))
                                                    .getTimezone(common.COMMON_GLOBAL.client_latitude, common.COMMON_GLOBAL.client_longitude):
                                                    (APP_GLOBAL.places?APP_GLOBAL.places.filter((/**@type{*}*/place)=>place.value==APP_GLOBAL.gps_default_place_id)[0].data4:
                                                        Intl.DateTimeFormat().resolvedOptions().timeZone),
        regional_number_system:             Intl.NumberFormat().resolvedOptions().numberingSystem,
        regional_layout_direction:          APP_GLOBAL.regional_default_direction,
        regional_second_language_locale:    APP_GLOBAL.regional_default_locale_second,
        regional_arabic_script:             APP_GLOBAL.regional_default_arabic_script,
        regional_calendar_type:             APP_GLOBAL.regional_default_calendartype,
        regional_calendar_hijri_type:       APP_GLOBAL.regional_default_calendar_hijri_type,
        gps_popular_place_id:               (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude)?null:
                                                APP_GLOBAL.gps_default_place_id,
        gps_lat_text:                       (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude)?appCommonFixFloat(common.COMMON_GLOBAL.client_latitude):
                                                (APP_GLOBAL.places?appCommonFixFloat(APP_GLOBAL.places.filter((/**@type{*}*/place)=>place.value==APP_GLOBAL.gps_default_place_id)[0].data2):0),
        gps_long_text:                      (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude)?appCommonFixFloat(common.COMMON_GLOBAL.client_longitude):
                                                (APP_GLOBAL.places?appCommonFixFloat(APP_GLOBAL.places.filter((/**@type{*}*/place)=>place.value==APP_GLOBAL.gps_default_place_id)[0].data3):0),
        design_theme_day_id:                APP_GLOBAL.design_default_theme_day,
        design_theme_month_id:              APP_GLOBAL.design_default_theme_month,
        design_theme_year_id:               APP_GLOBAL.design_default_theme_year,
        design_paper_size:                  APP_GLOBAL.design_default_papersize,
        design_row_highlight:               APP_GLOBAL.design_default_highlight_row,
        design_column_weekday_checked:      Number(APP_GLOBAL.design_default_show_weekday),
        design_column_calendartype_checked: Number(APP_GLOBAL.design_default_show_calendartype),
        design_column_notes_checked:        Number(APP_GLOBAL.design_default_show_notes),
        design_column_gps_checked:          Number(APP_GLOBAL.design_default_show_gps),
        design_column_timezone_checked:     Number(APP_GLOBAL.design_default_show_timezone),
        image_header_image_img:             APP_GLOBAL.image_default_report_header_src,
        image_footer_image_img:             APP_GLOBAL.image_default_report_footer_src,
        text_header_1_text:                 APP_GLOBAL.text_default_reporttitle1,
        text_header_2_text:                 APP_GLOBAL.text_default_reporttitle2,
        text_header_3_text:                 APP_GLOBAL.text_default_reporttitle3,
        text_header_align:                  null,
        text_footer_1_text:                 APP_GLOBAL.text_default_reportfooter1,
        text_footer_2_text:                 APP_GLOBAL.text_default_reportfooter2,
        text_footer_3_text:                 APP_GLOBAL.text_default_reportfooter3,
        text_footer_align:                  null,
        prayer_method:                      APP_GLOBAL.prayer_default_method,
        prayer_asr_method:                  APP_GLOBAL.prayer_default_asr,
        prayer_high_latitude_adjustment:    APP_GLOBAL.prayer_default_highlatitude,
        prayer_time_format:                 APP_GLOBAL.prayer_default_timeformat,
        prayer_hijri_date_adjustment:       Number(APP_GLOBAL.prayer_default_hijri_adjustment),
        prayer_fajr_iqamat:                 APP_GLOBAL.prayer_default_iqamat_title_fajr,
        prayer_dhuhr_iqamat:                APP_GLOBAL.prayer_default_iqamat_title_dhuhr,
        prayer_asr_iqamat:                  APP_GLOBAL.prayer_default_iqamat_title_asr,
        prayer_maghrib_iqamat:              APP_GLOBAL.prayer_default_iqamat_title_maghrib,
        prayer_isha_iqamat:                 APP_GLOBAL.prayer_default_iqamat_title_isha,
        prayer_column_imsak_checked:        Number(APP_GLOBAL.prayer_default_show_imsak),
        prayer_column_sunset_checked:       Number(APP_GLOBAL.prayer_default_show_sunset),
        prayer_column_midnight_checked:     Number(APP_GLOBAL.prayer_default_show_midnight),
        prayer_column_fast_start_end:       Number(APP_GLOBAL.prayer_default_show_fast_start_end)
    };
    APP_GLOBAL.user_settings = {current_id:0,
                                data:[{  id:null,
                                        json_data:json_data}]
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

    const json_data = { description:                        setting_tab=='GPS'?COMMON_DOCUMENT.querySelector('#setting_input_place').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.description,
                        regional_language_locale:           setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_locale .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_language_locale,
                        regional_timezone:                  setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_timezone .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_timezone,
                        regional_number_system:             setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_numbersystem .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_number_system,
                        regional_layout_direction:          setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_direction .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_layout_direction,
                        regional_second_language_locale:    setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_locale_second .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_second_language_locale,
                        regional_arabic_script:             setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_report_arabic_script .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_arabic_script,
                        regional_calendar_type:             setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_calendartype .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_calendar_type,
                        regional_calendar_hijri_type:       setting_tab=='REGIONAL'?COMMON_DOCUMENT.querySelector('#setting_select_calendar_hijri_type .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_calendar_hijri_type,
                        gps_popular_place_id:               setting_tab=='GPS'?JSON.parse(COMMON_DOCUMENT.querySelector('#setting_select_popular_place .common_select_dropdown_value').getAttribute('data-value')).id:
                                                                    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.gps_popular_place_id,
                        gps_lat_text:                       setting_tab=='GPS'?appCommonFixFloat(COMMON_DOCUMENT.querySelector('#setting_input_lat').textContent):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.gps_lat_text,
                        gps_long_text:                      setting_tab=='GPS'?appCommonFixFloat(COMMON_DOCUMENT.querySelector('#setting_input_long').textContent):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.gps_long_text,
                        design_theme_day_id:                setting_tab=='DESIGN'?appSettingThemeId('day'):APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_theme_day_id,
                        design_theme_month_id:              setting_tab=='DESIGN'?appSettingThemeId('month'):APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_theme_month_id,
                        design_theme_year_id:               setting_tab=='DESIGN'?appSettingThemeId('year'):APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_theme_year_id,
                        design_paper_size:                  setting_tab=='DESIGN'?COMMON_DOCUMENT.querySelector('#setting_select_report_papersize .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_paper_size,
                        design_row_highlight:               setting_tab=='DESIGN'?COMMON_DOCUMENT.querySelector('#setting_select_report_highlight_row .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_row_highlight,
                        design_column_weekday_checked:      setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_weekday').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_column_weekday_checked,
                        design_column_calendartype_checked: setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_calendartype').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_column_calendartype_checked,
                        design_column_notes_checked:        setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_notes').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_column_notes_checked,
                        design_column_gps_checked:          setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_gps').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_column_gps_checked,
                        design_column_timezone_checked:     setting_tab=='DESIGN'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_timezone').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.design_column_timezone_checked,
                        image_header_image_img:             setting_tab=='IMAGE'?COMMON_DOCUMENT.querySelector('#setting_reportheader_img').getAttribute('data-image'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.image_header_image_img,
                        image_footer_image_img:             setting_tab=='IMAGE'?COMMON_DOCUMENT.querySelector('#setting_reportfooter_img').getAttribute('data-image'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.image_footer_image_img,
                        text_header_1_text:                 setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportheader1').textContent:  
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_header_1_text,
                        text_header_2_text:                 setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportheader2').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_header_2_text,
                        text_header_3_text:                 setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportheader3').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_header_3_text,
                        text_header_align:                  setting_tab=='TEXT'? (appSettingButtonAlignValue('header')==''?null:appSettingButtonAlignValue('header')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_header_align,
                        text_footer_1_text:                 setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportfooter1').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_footer_1_text,
                        text_footer_2_text:                 setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportfooter2').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_footer_2_text,
                        text_footer_3_text:                 setting_tab=='TEXT'?COMMON_DOCUMENT.querySelector('#setting_input_reportfooter3').textContent:
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_footer_3_text,
                        text_footer_align:                  setting_tab=='TEXT'? (appSettingButtonAlignValue('footer')==''?null:appSettingButtonAlignValue('footer')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.text_footer_align,
                        prayer_method:                      setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_method .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_method,
                        prayer_asr_method:                  setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_asr .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_asr_method,
                        prayer_high_latitude_adjustment:    setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_highlatitude .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_high_latitude_adjustment,
                        prayer_time_format:                 setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_timeformat .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_time_format,
                        prayer_hijri_date_adjustment:       setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_select_hijri_adjustment .common_select_dropdown_value').getAttribute('data-value')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_hijri_date_adjustment,
                        prayer_fajr_iqamat:                 setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_fajr .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_fajr_iqamat,
                        prayer_dhuhr_iqamat:                setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_dhuhr .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_dhuhr_iqamat,
                        prayer_asr_iqamat:                  setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_asr .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_asr_iqamat,
                        prayer_maghrib_iqamat:              setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_maghrib .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_maghrib_iqamat,
                        prayer_isha_iqamat:                 setting_tab=='PRAYER'?COMMON_DOCUMENT.querySelector('#setting_select_report_iqamat_title_isha .common_select_dropdown_value').getAttribute('data-value'):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_isha_iqamat,
                        prayer_column_imsak_checked:        setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_imsak').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_column_imsak_checked,
                        prayer_column_sunset_checked:       setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_sunset').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_column_sunset_checked,
                        prayer_column_midnight_checked:     setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_checkbox_report_show_midnight').classList.contains('checked')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_column_midnight_checked,
                        prayer_column_fast_start_end:       setting_tab=='PRAYER'?Number(COMMON_DOCUMENT.querySelector('#setting_select_report_show_fast_start_end .common_select_dropdown_value').getAttribute('data-value')):
                                                                APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.prayer_column_fast_start_end
                    };
    APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data = json_data;
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
                    mountDiv:   'common_window_info',
                    data:       {
                                info:'URL',
                                class:paper_size,
                                path:url,
                                method:'GET',
                                body:null,
                                authorization:'APP_ID'
                                },
                    methods:    {commonFFB:common.commonFFB},
                    path:       '/common/component/common_window_info.js'});
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
    /**@type{CommonRESTAPIMethod} */
    let method;
    const json_data = { iam_user_app_data_post_id: user_account_app_data_post_id, 
                        IAM_iam_user_id: common.COMMON_GLOBAL.iam_user_id,
                        IAM_data_app_id:common.COMMON_GLOBAL.app_id};
    if (common.COMMON_GLOBAL.iam_user_id == null)
        common.commonDialogueShow('LOGIN');
    else {
        let path;
        if (COMMON_DOCUMENT.querySelector('#profile_user_settings_like').children[0].style.display == 'block'){
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
                            body:json_data})
        .then(()=>APP_GLOBAL.function_profile_user_setting_update(  COMMON_DOCUMENT.querySelector('#common_profile_id').textContent,
                                                                    JSON.parse(COMMON_DOCUMENT.querySelector('#profile_select_user_settings .common_select_dropdown_value')
                                                                                .getAttribute('data-value')).sid))
        .catch(()=>null);
    }
};
/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{CommonAppEvent}*/event) => {
            appEventClick(event);
        }, true);
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('click',event)
        .then(()=>{
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
                    if(event_target_id=='setting_select_popular_place'){
                        appUserSettingUpdate('GPS');
                        appComponentSettingUpdate('GPS', 'POPULAR_PLACES');
                    }
                    //settings design
                    if(event_target_id == 'setting_select_report_papersize'){
                        appUserSettingUpdate('DESIGN');
                        appComponentSettingUpdate('DESIGN', 'PAPER');
                    }
                    if(event_target_id== 'setting_select_report_highlight_row')
                        appUserSettingUpdate('DESIGN');
                    //module leaflet
                    if (event_target_id == 'common_module_leaflet_select_country')
                        appUserSettingUpdate('GPS');
                    if(event_target_id == 'common_module_leaflet_select_city'){
                        //popular place not on map is read when saving
                        appComponentSettingUpdate('GPS', 'CITY');
                    }
                    if (event_target_id == 'common_module_leaflet_select_mapstyle')
                        appComponentSettingUpdate('GPS', 'MAP');

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
                //info dialogue
                case 'app_link':{
                    if (common.COMMON_GLOBAL.app_link_url)
                        common.commonWindowOpen(common.COMMON_GLOBAL.app_link_url);
                    break;
                }
                case 'info_link1':{
                    common.commonComponentRender({
                        mountDiv:   'common_window_info',
                        data:       {
                                    info:'URL',
                                    path:'/app-resource/' + common.COMMON_GLOBAL.info_link_policy_url,
                                    query:`type=INFO&IAM_data_app_id=${common.COMMON_GLOBAL.app_common_app_id}`,
                                    method:'GET',
                                    authorization:'APP_ID'
                                    },
                        methods:    {commonFFB:common.commonFFB},
                        path:       '/common/component/common_window_info.js'});
                    break;
                }
                case 'info_link2':{
                    common.commonComponentRender({
                        mountDiv:   'common_window_info',
                        data:       {
                                    info:'URL',
                                    path:'/app-resource/' + common.COMMON_GLOBAL.info_link_disclaimer_url,
                                    query:`type=INFO&IAM_data_app_id=${common.COMMON_GLOBAL.app_common_app_id}`,
                                    method:'GET',
                                    authorization:'APP_ID'
                                    },
                        methods:    {commonFFB:common.commonFFB},
                        path:       '/common/component/common_window_info.js'});
                    break;
                }
                case 'info_link3':{
                    common.commonComponentRender({
                        mountDiv:   'common_window_info',
                        data:       {
                                    info:'URL',
                                    path:'/app-resource/' + common.COMMON_GLOBAL.info_link_terms_url,
                                    query:`type=INFO&IAM_data_app_id=${common.COMMON_GLOBAL.app_common_app_id}`,
                                    method:'GET',
                                    authorization:'APP_ID'
                                    },
                        methods:    {commonFFB:common.commonFFB},
                        path:       '/common/component/common_window_info.js'});
                    break;
                }
                case 'info_close':{
                    common.commonComponentRemove('dialogue_info', true);
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
                    const input_row = COMMON_DOCUMENT.querySelector('#common_profile_search_input');
                    const searchlist = COMMON_DOCUMENT.querySelector('#common_profile_search_list_wrap');
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
                    COMMON_DOCUMENT.querySelector('#common_profile_search_input').focus();
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
                    common.commonComponentRemove('settings');
                    if (common.commonMiscMobile())
                        COMMON_DOCUMENT.querySelector('#paper').style.display = 'block';
                    COMMON_DOCUMENT.querySelector('#settings').style.visibility = 'hidden';
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
                    COMMON_DOCUMENT.querySelector('#setting_icon_text_theme_day').classList.remove('common_dialogue_button');
                    COMMON_DOCUMENT.querySelector('#setting_icon_text_theme_month').classList.remove('common_dialogue_button');
                    COMMON_DOCUMENT.querySelector('#setting_icon_text_theme_year').classList.remove('common_dialogue_button');
                    const  theme_type = event_target_id.substring(24);
                    //mark active icon
                    COMMON_DOCUMENT.querySelector('#' + event_target_id).classList.add('common_dialogue_button');
                    COMMON_DOCUMENT.querySelector('#setting_paper_preview_text').className =  'setting_paper_preview' + ' ' +
                                                                                        `theme_${theme_type}_${appSettingThemeId(theme_type)} ` + 
                                                                                        APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_arabic_script;
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
                    COMMON_DOCUMENT.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                    COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                    appUserProfileDetail(0);
                    break;
                }
                case 'profile_main_btn_user_setting_likes':
                case 'profile_main_btn_user_setting_likes_user_setting':{
                    COMMON_DOCUMENT.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                    COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                    appUserProfileDetail(6);
                    break;
                }
                case 'profile_main_btn_user_setting_liked':
                case 'profile_main_btn_user_setting_liked_user_setting':{
                    COMMON_DOCUMENT.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                    COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
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
                //common
                case 'common_app_toolbar_framework_js':{
                   appFrameworkSet(1);
                    break;
                }
                case 'common_app_toolbar_framework_vue':{
                   appFrameworkSet(2);
                    break;
                }
                case 'common_app_toolbar_framework_react':{
                   appFrameworkSet(3);
                    break;
                }
                //dialogue user menu
                case 'common_iam_avatar':
                case 'common_iam_avatar_logged_in':
                case 'common_iam_avatar_avatar':
                case 'common_iam_avatar_avatar_img':
                case 'common_iam_avatar_logged_out':
                case 'common_iam_avatar_default_avatar':{
                    if (common.COMMON_GLOBAL.iam_user_id==null)
                        common.commonComponentRender({
                            mountDiv:   'common_dialogue_user_menu_app_theme',
                            data:       null,
                            methods:    {
                                        commonMiscThemeDefaultList:common.commonMiscThemeDefaultList,
                                        commonComponentRender:common.commonComponentRender, 
                                        app_theme_update:common.commonMiscPreferencesPostMount
                                        },
                            path:       '/common/component/common_dialogue_user_menu_app_theme.js'});
                    break;
                }
                case 'common_dialogue_user_menu_nav_iam_user_app':{
                    common.commonComponentRender({
                        mountDiv:   'common_dialogue_user_menu_app_theme',
                        data:       null,
                        methods:    {
                                    commonMiscThemeDefaultList:common.commonMiscThemeDefaultList,
                                    commonComponentRender:common.commonComponentRender, 
                                    app_theme_update:common.commonMiscPreferencesPostMount
                                    },
                        path:       '/common/component/common_dialogue_user_menu_app_theme.js'});
                    break;
                    }
                case 'common_dialogue_user_menu_log_out':{
                    common.commonUserLogout().then(() => {
                        appUserLogout();
                    });
                    break;
                }
                case 'common_dialogue_user_menu_username':{
                    appToolbarButton(6);
                    break;
                }
                //profile button
                case 'common_profile_btn_top':
                case 'common_profile_stat_row1_1':
                case 'common_profile_stat_row1_2':
                case 'common_profile_stat_row1_3':{
                    appToolbarButton(7);
                    break;
                }
                
                //dialogue user start
                case 'common_dialogue_iam_start_login_button':{
                    appUserLogin();
                    break;
                }
                //dialogue profile 
                case 'common_dialogue_profile_home':{
                    appToolbarButton(7);
                    break;
                }
                case 'common_profile_follow':{
                    appUserFunction('FOLLOW');
                    break;
                }
                case 'common_profile_like':{
                    appUserFunction('LIKE');
                    break;
                }
                //dialogue profile stat and info list
                case 'common_profile_search_list':
                case 'common_profile_detail_list':
                case 'common_profile_stat_list':{
                    if (COMMON_DOCUMENT.querySelector('#common_profile_main_stat_row2'))
                        common.commonComponentRender({
                            mountDiv:   'common_profile_main_stat_row2',
                            data:       {   
                                        iam_user_id:common.COMMON_GLOBAL.iam_user_id,
                                        profile_id:common.commonMiscElementRow(event.target).getAttribute('data-iam_user_id')},
                            methods:    {
                                        commonComponentRender:common.commonComponentRender,
                                       commonFFB:common.commonFFB
                                        },
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

                //module leaflet
                case 'common_module_leaflet_search_list':{
                    appComponentSettingUpdate('GPS', 'CITY');
                    break;
                }
                case 'common_module_leaflet_control_my_location_id':{
                    common.commonMiscSelectCurrentValueSet('setting_select_popular_place', null, 'id', null);
                    COMMON_DOCUMENT.querySelector('#setting_input_place').textContent = common.COMMON_GLOBAL.client_place;
                    COMMON_DOCUMENT.querySelector('#setting_input_long').textContent = common.COMMON_GLOBAL.client_longitude;
                    COMMON_DOCUMENT.querySelector('#setting_input_lat').textContent = common.COMMON_GLOBAL.client_latitude;
                    //update timezone
                    common.commonMiscImport(common.commonMiscImportmap('regional'))
                        .then(({getTimezone})=>{
                            APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_timezone =
                                getTimezone(common.COMMON_GLOBAL.client_latitude, common.COMMON_GLOBAL.client_longitude);
                            //set qibbla
                            appModuleLeafletMapQibblaShow();
                            appLibTimetable.APP_REPORT_GLOBAL.session_currentDate = common.commonMiscTimezoneDate(APP_GLOBAL.user_settings.data[APP_GLOBAL.user_settings.current_id].json_data.regional_timezone);
                            appUserSettingUpdate('GPS');
                        });
                    break;
                }       
            }
        });
    }
};
/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventKeyUp = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{CommonAppEvent}*/event) => {
            appEventKeyUp(event);
        }, true);
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('keyup',event)
        .then(()=>{
            switch(event_target_id){
                //settings gps
                case 'setting_input_place':{
                    common.commonMiscSelectCurrentValueSet('setting_select_popular_place', null, 'id', null);
                    appUserSettingUpdate('GPS');
                    break;
                }
                case 'setting_input_long':
                case 'setting_input_lat':{
                    appUserSettingUpdate('GPS');
                    common.commonMiscTypewatch(appComponentSettingUpdate, 'GPS', 'POSITION');
                    break;
                }
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
                case 'common_dialogue_iam_start_login_username':
                case 'common_dialogue_iam_start_login_password':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        appUserLogin().catch(()=>null);
                    }
                    break;
                }
            }
        });
    }
};

/**
 * @name appModuleLeafletMapQibblaShow
 * @description Map show qibbla
 * @function
 * @returns {void}
 */
const appModuleLeafletMapQibblaShow = () => {
    common.COMMON_GLOBAL.moduleLeaflet.methods.map_line_removeall();
    common.COMMON_GLOBAL.moduleLeaflet.methods.map_line_create('qibbla', 
                    APP_GLOBAL.gps_module_leaflet_qibbla_title,
                    APP_GLOBAL.gps_module_leaflet_qibbla_text_size,
                    APP_GLOBAL.gps_module_leaflet_qibbla_long,
                    APP_GLOBAL.gps_module_leaflet_qibbla_lat,
                    COMMON_DOCUMENT.querySelector('#setting_input_long').textContent,
                    COMMON_DOCUMENT.querySelector('#setting_input_lat').textContent,
                    APP_GLOBAL.gps_module_leaflet_qibbla_color,
                    APP_GLOBAL.gps_module_leaflet_qibbla_width,
                    APP_GLOBAL.gps_module_leaflet_qibbla_opacity);
    common.COMMON_GLOBAL.moduleLeaflet.methods.map_line_create('qibbla_old', 
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_title,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_text_size,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_long,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_lat,
                    COMMON_DOCUMENT.querySelector('#setting_input_long').textContent,
                    COMMON_DOCUMENT.querySelector('#setting_input_lat').textContent,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_color,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_width,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_opacity);
};
/**
 * @name appModuleLeafletMapUpdate
 * @description Map update
 * @function
 * @param {{longitude:string,
 *          latitude:string,
 *          text_place:string,
 *          country:string,
 *          city:string,
 *          timezone_text :string|null
 *          }} parameters
 * @returns {Promise.<string|null>}
 */
const appModuleLeafletMapUpdate = async (parameters) => {
    return new Promise((resolve) => {
        appModuleLeafletMapQibblaShow();
        common.COMMON_GLOBAL.moduleLeaflet.methods.map_update({ longitude:parameters.longitude,
                                                                latitude:parameters.latitude,
                                                                text_place:parameters.text_place,
                                                                country:'',
                                                                city:'',
                                                                timezone_text :parameters.timezone_text,
                                                                to_method:1
                                                            }).then((/**@type{string}*/timezonetext)=> {
            resolve(timezonetext);
        });
    });
};

/**
 * @name appException
 * @description App exception function
 * @function
 * @param {Error} error
 * @returns {void}
 */
const appException = error => {
    common.commonMessageShow('EXCEPTION', null, null, error);
};
/**
 * @name appFrameworkSet
 * @description Sets framework
 * @function
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const appFrameworkSet = async (framework=null) =>
    await common.commonFrameworkSet(framework, appMetadata().events);

/**
 * @name appInit
 * @description Init app
 * @function
 * @param {APP_PARAMETERS} parameters 
 * @returns {Promise.<void>}
 */
const appInit = async parameters => {
    const appLibTimetable_path = '/app-common-module-asset/MODULE_LIB_TIMETABLE';
    /**@type {CommonModuleLibTimetable} */
    appLibTimetable = await common.commonMiscImport(appLibTimetable_path, true);
    await common.commonComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       null,
        methods:    null,
        path:       '/component/app.js'})
    .then(()=>
        common.commonComponentRender({
            mountDiv:   'app_profile_search',
            data:       null,
            methods:    null,
            path:       '/common/component/common_profile_search.js'}))
    .then(()=>
        common.commonComponentRender({
            mountDiv:   'app_profile_toolbar',
            data:       null,
            methods:    null,
            path:       '/common/component/common_profile_toolbar.js'}));
    //set papersize
    appPaperZoom();
    //set app and report globals
    appLibTimetable.APP_REPORT_GLOBAL.app_copyright = common.COMMON_GLOBAL.app_copyright ?? '';
    APP_GLOBAL.app_default_startup_page = parseInt(parameters.app_default_startup_page.value);
    APP_GLOBAL.app_report_timetable = parameters.app_report_timetable.value;

    appLibTimetable.APP_REPORT_GLOBAL.regional_def_calendar_lang = parameters.app_regional_default_calendar_lang.value;
    appLibTimetable.APP_REPORT_GLOBAL.regional_def_locale_ext_prefix = parameters.app_regional_default_locale_ext_prefix.value;
    appLibTimetable.APP_REPORT_GLOBAL.regional_def_locale_ext_number_system = parameters.app_regional_default_locale_ext_number_system.value;
    appLibTimetable.APP_REPORT_GLOBAL.regional_def_locale_ext_calendar = parameters.app_regional_default_locale_ext_calendar.value;
    appLibTimetable.APP_REPORT_GLOBAL.regional_def_calendar_type_greg = parameters.app_regional_default_calendar_type_greg.value;
    appLibTimetable.APP_REPORT_GLOBAL.regional_def_calendar_number_system = parameters.app_regional_default_calendar_number_system.value;

    APP_GLOBAL.regional_default_direction = parameters.app_regional_default_direction.value;
    APP_GLOBAL.regional_default_locale_second = parameters.app_regional_default_locale_second.value;
    APP_GLOBAL.regional_default_arabic_script = parameters.app_regional_default_arabic_script.value;
    APP_GLOBAL.regional_default_calendartype = parameters.app_regional_default_calendartype.value;
    APP_GLOBAL.regional_default_calendar_hijri_type = parameters.app_regional_default_calendar_hijri_type.value;
    APP_GLOBAL.gps_default_place_id = parseInt(parameters.app_gps_default_place_id.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_title = parameters.app_gps_module_leaflet_qibbla_title.value;
    APP_GLOBAL.gps_module_leaflet_qibbla_text_size = parseFloat(parameters.app_gps_module_leaflet_qibbla_text_size.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_lat = parseFloat(parameters.app_gps_module_leaflet_qibbla_lat.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_long = parseFloat(parameters.app_gps_module_leaflet_qibbla_long.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_color = parameters.app_gps_module_leaflet_qibbla_color.value;
    APP_GLOBAL.gps_module_leaflet_qibbla_width = parseFloat(parameters.app_gps_module_leaflet_qibbla_width.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_opacity = parseFloat(parameters.app_gps_module_leaflet_qibbla_opacity.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_old_title = parameters.app_gps_module_leaflet_qibbla_old_title.value;
    APP_GLOBAL.gps_module_leaflet_qibbla_old_text_size = parseFloat(parameters.app_gps_module_leaflet_qibbla_old_text_size.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_old_lat = parseFloat(parameters.app_gps_module_leaflet_qibbla_old_lat.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_old_long = parseFloat(parameters.app_gps_module_leaflet_qibbla_old_long.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_old_color = parameters.app_gps_module_leaflet_qibbla_old_color.value;
    APP_GLOBAL.gps_module_leaflet_qibbla_old_width = parseFloat(parameters.app_gps_module_leaflet_qibbla_old_width.value);
    APP_GLOBAL.gps_module_leaflet_qibbla_old_opacity = parseFloat(parameters.app_gps_module_leaflet_qibbla_old_opacity.value);
    APP_GLOBAL.design_default_theme_day = parameters.app_design_default_theme_day.value;
    APP_GLOBAL.design_default_theme_month = parameters.app_design_default_theme_month.value;
    APP_GLOBAL.design_default_theme_year = parameters.app_design_default_theme_year.value;
    APP_GLOBAL.design_default_papersize = parameters.app_design_default_papersize.value;
    APP_GLOBAL.design_default_highlight_row = parameters.app_design_default_highlight_row.value;
    APP_GLOBAL.design_default_show_weekday = (parameters.app_design_default_show_weekday.value=== true);
    APP_GLOBAL.design_default_show_calendartype = (parameters.app_design_default_show_calendartype.value=== true);
    APP_GLOBAL.design_default_show_notes = (parameters.app_design_default_show_notes.value=== true);
    APP_GLOBAL.design_default_show_gps = (parameters.app_design_default_show_gps.value=== true);
    APP_GLOBAL.design_default_show_timezone = (parameters.app_design_default_show_timezone.value=== true);
    APP_GLOBAL.text_default_reporttitle1 = parameters.app_text_default_reporttitle1.value;
    APP_GLOBAL.text_default_reporttitle2 = parameters.app_text_default_reporttitle2.value;
    APP_GLOBAL.text_default_reporttitle3 = parameters.app_text_default_reporttitle3.value;
    APP_GLOBAL.text_default_reportfooter1 = parameters.app_text_default_reportfooter1.value;
    APP_GLOBAL.text_default_reportfooter2 = parameters.app_text_default_reportfooter2.value;
    APP_GLOBAL.text_default_reportfooter3 = parameters.app_text_default_reportfooter3.value;
    APP_GLOBAL.image_default_report_header_src = parameters.app_image_default_report_header_src.value;
    APP_GLOBAL.image_default_report_footer_src = parameters.app_image_default_report_footer_src.value;
    APP_GLOBAL.prayer_default_method = parameters.app_prayer_default_method.value;
    APP_GLOBAL.prayer_default_asr = parameters.app_prayer_default_asr.value;
    APP_GLOBAL.prayer_default_highlatitude = parameters.app_prayer_default_highlatitude.value;
    APP_GLOBAL.prayer_default_timeformat = parameters.app_prayer_default_timeformat.value;
    APP_GLOBAL.prayer_default_hijri_adjustment = parameters.app_prayer_default_hijri_adjustment.value;
    APP_GLOBAL.prayer_default_iqamat_title_fajr = parameters.app_prayer_default_iqamat_title_fajr.value;
    APP_GLOBAL.prayer_default_iqamat_title_dhuhr = parameters.app_prayer_default_iqamat_title_dhuhr.value;
    APP_GLOBAL.prayer_default_iqamat_title_asr = parameters.app_prayer_default_iqamat_title_asr.value;
    APP_GLOBAL.prayer_default_iqamat_title_maghrib = parameters.app_prayer_default_iqamat_title_maghrib.value;
    APP_GLOBAL.prayer_default_iqamat_title_isha = parameters.app_prayer_default_iqamat_title_isha.value;
    APP_GLOBAL.prayer_default_show_imsak = (parameters.app_prayer_default_show_imsak.value=== true);
    APP_GLOBAL.prayer_default_show_sunset = (parameters.app_prayer_default_show_sunset.value=== true);
    APP_GLOBAL.prayer_default_show_midnight = (parameters.app_prayer_default_show_midnight.value=== true);
    APP_GLOBAL.prayer_default_show_fast_start_end = parseInt(parameters.app_prayer_default_show_fast_start_end.value);

    //set current date for report month
    //if client_timezone is set, set Date with client_timezone
    if (common.COMMON_GLOBAL.client_timezone)
        appLibTimetable.APP_REPORT_GLOBAL.session_currentDate = common.commonMiscTimezoneDate(common.COMMON_GLOBAL.client_timezone);
    else
        appLibTimetable.APP_REPORT_GLOBAL.session_currentDate = new Date();
    appLibTimetable.APP_REPORT_GLOBAL.session_currentHijriDate = [0,0];
    //get Hijri date from initial Gregorian date
    appLibTimetable.APP_REPORT_GLOBAL.session_currentHijriDate[0] = parseInt(new Date(appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getFullYear(),
        appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getMonth(),
        appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { month: 'numeric' }));
    appLibTimetable.APP_REPORT_GLOBAL.session_currentHijriDate[1] = parseInt(new Date(appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getFullYear(),
        appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getMonth(),
        appLibTimetable.APP_REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { year: 'numeric' }));

    await appUserSettingDefaultSet();
    //show default startup
    await appToolbarButton(APP_GLOBAL.app_default_startup_page);
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {CommonModuleCommon} commonLib
 * @param {APP_PARAMETERS} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {
    common = commonLib;
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = appUserLogout;
    await appInit(parameters);
};
/**
 * @name appMetadata
 * @description App metadata for event delegataion and lifecycle events
 * @function
 * @returns {commonMetadata}
 */
const appMetadata = () =>{
    return { 
        events:{  
            Click:   appEventClick,
            Change:  null,
            KeyDown: null,
            KeyUp:   appEventKeyUp,
            Focus:   null,
            Input:   null},
        lifeCycle:{onMounted:appUserLoginPost}
    };
};
export{ appCommonInit, appComponentSettingUpdate, appSettingThemeThumbnailsUpdate, appMetadata};
export default appCommonInit;