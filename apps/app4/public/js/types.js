/**
 * @description App types
 * @module apps/app4/app/types
 */
/**
 * @import {CommonModuleCommon, CommonComponentLifecycle} from '../../../common_types.js'
 */
/**
 * @description Type CommonModuleLibTimetableParam
 * @typedef {{
 *              data:       {
 * 						    commonMountdiv:null,
 * 						    timetable:'DAY'|'MONTH'|'YEAR',
 * 						    user_account_app_data_post:APP_REPORT_settings, 
 * 						    button_id:'toolbar_btn_left'|'toolbar_btn_right'|null,
 * 						    user_account_app_data_posts_parameters:APP_REPORT_day_user_account_app_data_posts[]|null
 * 						    },
 *              methods:    {COMMON:CommonModuleCommon}}} CommonModuleLibTimetableParam
 */
/**
 * @description Type CommonModuleLibTimetable
 * @typedef {{  APP_REPORT_GLOBAL:APP_REPORT_GLOBAL,
 *              component:{(arg0:CommonModuleLibTimetableParam) : 
 *                                  {   
 *                                      lifecycle:CommonComponentLifecycle, 
 *                                      data:   	null,
 *                                      methods:	null,
 *                                      template:   string
 *                                  }
 *                      }
 *          }} CommonModuleLibTimetable
 */
/**
 * @description Type CommonModuleLibTimetable
 * @typedef {{  () : number}} test
 *
 */
/**
 * @description Type APP_user_setting_record
 * @typedef {{  Id?:number,
 *              Description: string|null,
 *              RegionalLanguageLocale: string,
 *              RegionalTimezone: string,
 *              RegionalNumberSystem: string,
 *              RegionalLayoutDirection: string,
 *              RegionalSecondLanguageLocale: string,
 *              RegionalArabicScript: string,
 *              RegionalCalendarType: 'GREGORIAN'|'HIJRI',
 *              RegionalCalendarHijriType: string,
 *              GpsLatText: number|null,
 *              GpsLongText: number|null,
 *              DesignThemeDayId: string,
 *              DesignThemeMonthId: string,
 *              DesignThemeYearId: string,
 *              DesignPaperSize: string,
 *              DesignRowHighlight: string,
 *              DesignColumnWeekdayChecked: number,
 *              DesignColumnCalendarTypeChecked: number,
 *              DesignColumnNotesChecked: number,
 *              DesignColumnGpsChecked: number,
 *              DesignColumnTimezoneChecked: number,
 *              ImageHeaderImageImg: string,
 *              ImageFooterImageImg: string,
 *              TextHeader1Text: string,
 *              TextHeader2Text: string,
 *              TextHeader3Text: string,
 *              TextHeaderAlign: string|null,
 *              TextFooter1Text: string,
 *              TextFooter2Text: string,
 *              TextFooter3Text: string,
 *              TextFooterAlign: string|null,
 *              PrayerMethod: string,
 *              PrayerAsrMethod: string,
 *              PrayerHighLatitudeAdjustment: string,
 *              PrayerTimeFormat: string,
 *              PrayerHijriDateAdjustment: number,
 *              PrayerFajrIqamat: string,
 *              PrayerDhuhrIqamat: string,
 *              PrayerAsrIqamat: string,
 *              PrayerMaghribIqamat: string,
 *              PrayerIshaIqamat: string,
 *              PrayerColumnImsakChecked: number,
 *              PrayerColumnSunsetChecked: number,
 *              PrayerColumnMidnightChecked: number,
 *              PrayerColumnFastStartEnd: number}} APP_user_setting_record
 */
/**
 * @description Type report APP_user_setting_data
 * @typedef {{   Id:number|null, 
 *               Document:APP_user_setting_record}} APP_user_setting_data
 */
/** 
 * @description Type report APP_user_setting
 * @typedef {{current_id:number,
 *            data: [APP_user_setting_data]|[]
 *          }} APP_user_setting
 */

/** 
 * @description Type APP_GLOBAL
 * @typedef {{
 *          description:string|null,
 *          app_default_startup_page:number,
 *          app_report_timetable:string,
 *          regional_default_direction:string,
 *          regional_default_locale_second:string,
 *          regional_default_arabic_script:string,
 *          regional_default_calendartype:'GREGORIAN'|'HIJRI',
 *          regional_default_calendar_hijri_type:string,
 *          gps_qibbla_title:string,
 *          gps_qibbla_text_size:number,
 *          gps_qibbla_lat:number,
 *          gps_qibbla_long:number,
 *          gps_qibbla_color:string,
 *          gps_qibbla_width:number,
 *          gps_qibbla_opacity:number,
 *          gps_qibbla_old_title:string,
 *          gps_qibbla_old_text_size:number,
 *          gps_qibbla_old_lat:number,
 *          gps_qibbla_old_long:number,
 *          gps_qibbla_old_color:string,
 *          gps_qibbla_old_width:number,
 *          gps_qibbla_old_opacity:number,
 *          design_default_theme_day:string,
 *          design_default_theme_month:string,
 *          design_default_theme_year:string,
 *          design_default_papersize:string,
 *          design_default_highlight_row:string,
 *          design_default_show_weekday:boolean,
 *          design_default_show_calendartype:boolean,
 *          design_default_show_notes:boolean,
 *          design_default_show_gps:boolean,
 *          design_default_show_timezone:boolean,
 *          image_default_report_header_src:string,
 *          image_default_report_footer_src:string,
 *          text_default_reporttitle1:string,
 *          text_default_reporttitle2:string,
 *          text_default_reporttitle3:string,
 *          text_default_reportfooter1:string,
 *          text_default_reportfooter2:string,
 *          text_default_reportfooter3:string,
 *          prayer_default_method:string,
 *          prayer_default_asr:string,
 *          prayer_default_highlatitude:string,
 *          prayer_default_timeformat:string,
 *          prayer_default_hijri_adjustment:number,
 *          prayer_default_iqamat_title_fajr:string,
 *          prayer_default_iqamat_title_dhuhr:string,
 *          prayer_default_iqamat_title_asr:string,
 *          prayer_default_iqamat_title_maghrib:string,
 *          prayer_default_iqamat_title_isha:string,
 *          prayer_default_show_imsak:boolean,
 *          prayer_default_show_sunset:boolean,
 *          prayer_default_show_midnight:boolean,
 *          prayer_default_show_fast_start_end:number,
 *          timetable_type:number,
 *          user_settings:APP_user_setting,
 *          themes: {data:{type:string, value:string, text:string}[]},
 *          function_profile_user_setting_update:function,
 *          function_profile_show_user_setting_detail: function,
 *          function_profile_user_setting_stat: function
 *          appLibTimetable:CommonModuleLibTimetable
 *          }} APP_GLOBAL
 */

/** 
 * @description Type APP_PARAMETERS
 * @typedef {{
 *          app_default_startup_page:                         string,
 *          app_report_timetable:                             string,
 *          app_regional_default_direction:                   string,
 *          app_regional_default_locale_second:               string,
 *          app_regional_default_arabic_script:               string,
 *          app_regional_default_calendartype:                'GREGORIAN'|'HIJRI',
 *          app_regional_default_calendar_hijri_type:         string,
 *          app_regional_default_calendar_lang:               string,
 *          app_regional_default_locale_ext_prefix:           string,
 *          app_regional_default_locale_ext_number_system:    string,
 *          app_regional_default_locale_ext_calendar:         string,
 *          app_regional_default_calendar_type_greg:          string,
 *          app_regional_default_calendar_number_system:      string,
 *          app_gps_qibbla_title:                             string,
 *          app_gps_qibbla_text_size:                         string,
 *          app_gps_qibbla_lat:                               string,
 *          app_gps_qibbla_long:                              string,
 *          app_gps_qibbla_color:                             string,
 *          app_gps_qibbla_width:                             string,
 *          app_gps_qibbla_opacity:                           string,
 *          app_gps_qibbla_old_title:                         string,
 *          app_gps_qibbla_old_text_size:                     string,
 *          app_gps_qibbla_old_lat:                           string,
 *          app_gps_qibbla_old_long:                          string,
 *          app_gps_qibbla_old_color:                         string,
 *          app_gps_qibbla_old_width:                         string,
 *          app_gps_qibbla_old_opacity:                       string,
 *          app_design_default_theme_day:                     string,
 *          app_design_default_theme_month:                   string,
 *          app_design_default_theme_year:                    string,
 *          app_design_default_papersize:                     string,
 *          app_design_default_highlight_row:                 string,
 *          app_design_default_show_weekday:                  boolean,
 *          app_design_default_show_calendartype:             boolean,
 *          app_design_default_show_notes:                    boolean,
 *          app_design_default_show_gps:                      boolean,
 *          app_design_default_show_timezone:                 boolean,
 *          app_image_default_report_header_src:              string,
 *          app_image_default_report_footer_src:              string,
 *          app_image_header_footer_width:                    number,
 *          app_image_header_footer_height:                   number,
 *          app_text_default_reporttitle1:                    string,
 *          app_text_default_reporttitle2:                    string,
 *          app_text_default_reporttitle3:                    string,
 *          app_text_default_reportfooter1:                   string,
 *          app_text_default_reportfooter2:                   string,
 *          app_text_default_reportfooter3:                   string,
 *          app_prayer_default_method:                        string,
 *          app_prayer_default_asr:                           string,
 *          app_prayer_default_highlatitude:                  string,
 *          app_prayer_default_timeformat:                    string,
 *          app_prayer_default_hijri_adjustment:              number,
 *          app_prayer_default_iqamat_title_fajr:             string,
 *          app_prayer_default_iqamat_title_dhuhr:            string,
 *          app_prayer_default_iqamat_title_asr:              string,
 *          app_prayer_default_iqamat_title_maghrib:          string,
 *          app_prayer_default_iqamat_title_isha:             string,
 *          app_prayer_default_show_imsak:                    boolean,
 *          app_prayer_default_show_sunset:                   boolean,
 *          app_prayer_default_show_midnight:                 boolean,
 *          app_prayer_default_show_fast_start_end:           string
 *          }} APP_PARAMETERS
 */

/** 
 * @description Type APP_REPORT_settings
 * @typedef {object} 	APP_REPORT_settings
 * @property {string}	locale
 * @property {string}	timezone
 * @property {string}	number_system
 * @property {string}	direction
 * @property {string}	second_locale
 * @property {string}	arabic_script
 * @property {'GREGORIAN'|'HIJRI'}	calendartype
 * @property {string}	calendar_hijri_type
 * @property {string}	place
 * @property {number}	gps_lat
 * @property {number}	gps_long
 * @property {string}	theme_day
 * @property {string}	theme_month
 * @property {string}	theme_year
 * @property {string}	paper_size
 * @property {string}	highlight
 * @property {number}	show_weekday
 * @property {number}	show_calendartype
 * @property {number}	show_notes
 * @property {number}	show_gps
 * @property {number}	show_timezone
 * @property {string}	header_img_src
 * @property {string}	footer_img_src
 * @property {string}	header_txt1
 * @property {string}	header_txt2
 * @property {string}	header_txt3
 * @property {string|null}	header_align
 * @property {string}	footer_txt1
 * @property {string}	footer_txt2
 * @property {string}	footer_txt3
 * @property {string|null}	footer_align
 * @property {string}	method
 * @property {string}	asr
 * @property {string}	highlat
 * @property {string}	format
 * @property {number}	hijri_adj
 * @property {string}	iqamat_fajr
 * @property {string}	iqamat_dhuhr
 * @property {string}	iqamat_asr
 * @property {string}	iqamat_maghrib
 * @property {string}	iqamat_isha
 * @property {number}	show_imsak
 * @property {number}	show_sunset
 * @property {number}	show_midnight
 * @property {number}	show_fast_start_end
 * @property {string}	timetable_class
 * @property {string}	timetable_month			- class to add for month
 * @property {string}	timetable_year_month	- class to add for year
 * @property {string}	reporttype_year_month	- MONTH:default, normal month with more info, 
 *												- YEAR:	month with less info
 * @property {'toolbar_btn_left'|null}	ui_navigation_left
 * @property {'toolbar_btn_right'|null}	ui_navigation_right
 */
/** 
 * @description Type APP_REPORT_column_titles
 * @typedef {object}	APP_REPORT_column_titles
 * @property {string}	day
 * @property {string}	weekday
 * @property {string}	weekday_tr
 * @property {string}	caltype
 * @property {string}	imsak
 * @property {string}	fajr
 * @property {string}	iqamat_fajr
 * @property {string}	sunrise
 * @property {string}	dhuhr
 * @property {string}	iqamat_dhuhr
 * @property {string}	asr
 * @property {string}	iqamat_asr
 * @property {string}	sunset
 * @property {string}	maghrib
 * @property {string}	iqamat_maghrib
 * @property {string}	isha
 * @property {string}	iqamat_isha
 * @property {string}	midnight
 * @property {string}	notes
 */
/**
 * @description Type APP_REPORT_times
 * @typedef	{{[index: string]:number}}	APP_REPORT_times
 * @property{number}	day
 * @property{number}	fajr
 * @property{number}	dhuhr
 * @property{number}	asr
 * @property{number}	maghrib
 * @property{number}	isha
 * @property{number}	midnight
 */
/**
 * @description Type APP_REPORT_day_user_account_app_data_posts
 * @typedef {object}	APP_REPORT_day_user_account_app_data_posts
 * @property {string}	Description
 * @property {string}	RegionalLanguageLocale
 * @property {string}	RegionalTimezone
 * @property {string}	RegionalNumberSystem
 * @property {string}	RegionalCalendarHijri_type
 * @property {number|null}	GpsLatText
 * @property {number|null}	GpsLongText
 * @property {string}	PrayerMethod
 * @property {string}	PrayerAsrMethod
 * @property {string}	PrayerHighLatitudeAdjustment
 * @property {string}	PrayerTimeFormat
 * @property {number}	PrayerHijriDateAdjustment
 */
 
/**
 * @description Type APP_REPORT_GLOBAL
 * @typedef {{	
 * 			app_copyright:string,
 * 			session_currentDate:Date,
 * 			session_currentHijriDate:[number, number],
 * 			CommonModulePrayTimes_methods:{[index:string]:{	name:string,
 *														    params:{fajr:string|number, 
 *																      isha:string|number|null, 
 *																      maghrib?:number, 
 *																      midnight?:string
 *														    }
 *													}
 *									},
 * 			regional_def_calendar_lang:string,
 * 			regional_def_locale_ext_prefix:string,
 * 			regional_def_locale_ext_number_system:string,
 * 			regional_def_locale_ext_calendar:string,
 * 			regional_def_calendar_type_greg:string,
 * 			regional_def_calendar_number_system:string
 * 			}} APP_REPORT_GLOBAL
 */

/**
 * @description Type timesType
 *              added day key for timetables
 * @typedef {{  day?:number|string, 
 *              imsak:number|string, 
 *              fajr:number|string, 
 *              sunrise:number|string, 
 *              dhuhr:number|string, 
 *              asr:number|string, 
 *              sunset:number|string, 
 *              maghrib:number|string, 
 *              isha:number|string, 
 *              midnight?:number|string}} timesType
 */

export{};