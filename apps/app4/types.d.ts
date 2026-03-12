/**
 * @description App types
 * @module apps/app4/types
 */

import type {common} from '../common/types.d.ts'
/**
 * @name CommonModuleLibTimetableParam
 * @description Type CommonModuleLibTimetableParam
 */
type CommonModuleLibTimetableParam = {
               data:       {
  						    commonMountdiv:null,
  						    timetable:'DAY'|'MONTH'|'YEAR',
  						    user_account_app_data_post:APP_REPORT_settings, 
  						    button_id:'toolbar_btn_left'|'toolbar_btn_right'|null,
  						    user_account_app_data_posts_parameters:APP_REPORT_day_user_account_app_data_posts[]|null
  						    },
               methods:    {COMMON:types_common.CommonModuleCommon}
}
/**
 * @name CommonModuleLibTimetable
 * @type
 * @description Type CommonModuleLibTimetable
 */
type CommonModuleLibTimetable = {  APP_REPORT_GLOBAL:APP_REPORT_GLOBAL,
        component:{(arg0:CommonModuleLibTimetableParam) : 
                            {   
                                lifecycle:types_common.CommonComponentLifecycle, 
                                data:   	null,
                                methods:	null,
                                template:   string
                            }
                }
}
/**
 * @description Type CommonModuleLibTimetable
 *
 */
type test = {  
    () : number
}
/**
 * @name APP_user_setting_record
 * @description Type APP_user_setting_record
 */
type APP_user_setting_record = {  
        Id?:number,
        Description: string|null,
        RegionalLanguageLocale: string,
        RegionalTimezone: string,
        RegionalNumberSystem: string,
        RegionalLayoutDirection: string,
        RegionalSecondLanguageLocale: string,
        RegionalArabicScript: string,
        RegionalCalendarType: 'GREGORIAN'|'HIJRI',
        RegionalCalendarHijriType: string,
        GpsLatText: number|null,
        GpsLongText: number|null,
        DesignThemeDayId: string,
        DesignThemeMonthId: string,
        DesignThemeYearId: string,
        DesignPaperSize: string,
        DesignRowHighlight: string,
        DesignColumnWeekdayChecked: number,
        DesignColumnCalendarTypeChecked: number,
        DesignColumnNotesChecked: number,
        DesignColumnGpsChecked: number,
        DesignColumnTimezoneChecked: number,
        ImageHeaderImageImg: string,
        ImageFooterImageImg: string,
        TextHeader1Text: string,
        TextHeader2Text: string,
        TextHeader3Text: string,
        TextHeaderAlign: string|null,
        TextFooter1Text: string,
        TextFooter2Text: string,
        TextFooter3Text: string,
        TextFooterAlign: string|null,
        PrayerMethod: string,
        PrayerAsrMethod: string,
        PrayerHighLatitudeAdjustment: string,
        PrayerTimeFormat: string,
        PrayerHijriDateAdjustment: number,
        PrayerFajrIqamat: string,
        PrayerDhuhrIqamat: string,
        PrayerAsrIqamat: string,
        PrayerMaghribIqamat: string,
        PrayerIshaIqamat: string,
        PrayerColumnImsakChecked: number,
        PrayerColumnSunsetChecked: number,
        PrayerColumnMidnightChecked: number,
        PrayerColumnFastStartEnd: number
}
/**
 * @name APP_user_setting_data
 * @description Type report APP_user_setting_data
 */
type APP_user_setting_data = {
        Id:number|null, 
        Document:APP_user_setting_record
}
/** 
 * @name APP_user_setting
 * @description Type report APP_user_setting
 */
type APP_user_setting = {
    current_id:number,
    data: [APP_user_setting_data]|[]
}
/** 
 * @name APP_GLOBAL
 * @description Type APP_GLOBAL
 */
type APP_GLOBAL = {
        description:string|null,
        app_default_startup_page:number,
        app_report_timetable:string,
        regional_default_direction:string,
        regional_default_locale_second:string,
        regional_default_arabic_script:string,
        regional_default_calendartype:'GREGORIAN'|'HIJRI',
        regional_default_calendar_hijri_type:string,
        gps_qibbla_title:string,
        gps_qibbla_text_size:number,
        gps_qibbla_lat:number,
        gps_qibbla_long:number,
        gps_qibbla_color:string,
        gps_qibbla_width:number,
        gps_qibbla_opacity:number,
        gps_qibbla_old_title:string,
        gps_qibbla_old_text_size:number,
        gps_qibbla_old_lat:number,
        gps_qibbla_old_long:number,
        gps_qibbla_old_color:string,
        gps_qibbla_old_width:number,
        gps_qibbla_old_opacity:number,
        design_default_theme_day:string,
        design_default_theme_month:string,
        design_default_theme_year:string,
        design_default_papersize:string,
        design_default_highlight_row:string,
        design_default_show_weekday:boolean,
        design_default_show_calendartype:boolean,
        design_default_show_notes:boolean,
        design_default_show_gps:boolean,
        design_default_show_timezone:boolean,
        image_default_report_header_src:string,
        image_default_report_footer_src:string,
        text_default_reporttitle1:string,
        text_default_reporttitle2:string,
        text_default_reporttitle3:string,
        text_default_reportfooter1:string,
        text_default_reportfooter2:string,
        text_default_reportfooter3:string,
        prayer_default_method:string,
        prayer_default_asr:string,
        prayer_default_highlatitude:string,
        prayer_default_timeformat:string,
        prayer_default_hijri_adjustment:number,
        prayer_default_iqamat_title_fajr:string,
        prayer_default_iqamat_title_dhuhr:string,
        prayer_default_iqamat_title_asr:string,
        prayer_default_iqamat_title_maghrib:string,
        prayer_default_iqamat_title_isha:string,
        prayer_default_show_imsak:boolean,
        prayer_default_show_sunset:boolean,
        prayer_default_show_midnight:boolean,
        prayer_default_show_fast_start_end:number,
        timetable_type:number,
        user_settings:APP_user_setting,
        themes: {data:{type:string, value:string, text:string}[]},
        function_profile_user_setting_update:Function,
        function_profile_show_user_setting_detail: Function,
        function_profile_user_setting_stat: Function
        appLibTimetable:CommonModuleLibTimetable
}
/** 
 * @name APP_PARAMETERS
 * @description Type APP_PARAMETERS
 */
type APP_PARAMETERS = {
        app_default_startup_page:                         string,
        app_report_timetable:                             string,
        app_regional_default_direction:                   string,
        app_regional_default_locale_second:               string,
        app_regional_default_arabic_script:               string,
        app_regional_default_calendartype:                'GREGORIAN'|'HIJRI',
        app_regional_default_calendar_hijri_type:         string,
        app_regional_default_calendar_lang:               string,
        app_regional_default_locale_ext_prefix:           string,
        app_regional_default_locale_ext_number_system:    string,
        app_regional_default_locale_ext_calendar:         string,
        app_regional_default_calendar_type_greg:          string,
        app_regional_default_calendar_number_system:      string,
        app_gps_qibbla_title:                             string,
        app_gps_qibbla_text_size:                         string,
        app_gps_qibbla_lat:                               string,
        app_gps_qibbla_long:                              string,
        app_gps_qibbla_color:                             string,
        app_gps_qibbla_width:                             string,
        app_gps_qibbla_opacity:                           string,
        app_gps_qibbla_old_title:                         string,
        app_gps_qibbla_old_text_size:                     string,
        app_gps_qibbla_old_lat:                           string,
        app_gps_qibbla_old_long:                          string,
        app_gps_qibbla_old_color:                         string,
        app_gps_qibbla_old_width:                         string,
        app_gps_qibbla_old_opacity:                       string,
        app_design_default_theme_day:                     string,
        app_design_default_theme_month:                   string,
        app_design_default_theme_year:                    string,
        app_design_default_papersize:                     string,
        app_design_default_highlight_row:                 string,
        app_design_default_show_weekday:                  boolean,
        app_design_default_show_calendartype:             boolean,
        app_design_default_show_notes:                    boolean,
        app_design_default_show_gps:                      boolean,
        app_design_default_show_timezone:                 boolean,
        app_image_default_report_header_src:              string,
        app_image_default_report_footer_src:              string,
        app_image_header_footer_width:                    number,
        app_image_header_footer_height:                   number,
        app_text_default_reporttitle1:                    string,
        app_text_default_reporttitle2:                    string,
        app_text_default_reporttitle3:                    string,
        app_text_default_reportfooter1:                   string,
        app_text_default_reportfooter2:                   string,
        app_text_default_reportfooter3:                   string,
        app_prayer_default_method:                        string,
        app_prayer_default_asr:                           string,
        app_prayer_default_highlatitude:                  string,
        app_prayer_default_timeformat:                    string,
        app_prayer_default_hijri_adjustment:              number,
        app_prayer_default_iqamat_title_fajr:             string,
        app_prayer_default_iqamat_title_dhuhr:            string,
        app_prayer_default_iqamat_title_asr:              string,
        app_prayer_default_iqamat_title_maghrib:          string,
        app_prayer_default_iqamat_title_isha:             string,
        app_prayer_default_show_imsak:                    boolean,
        app_prayer_default_show_sunset:                   boolean,
        app_prayer_default_show_midnight:                 boolean,
        app_prayer_default_show_fast_start_end:           string
}
/** 
 * @name APP_REPORT_settings
 * @description Type APP_REPORT_settings
 */
 type APP_REPORT_settings ={
        locale:string,
        timezone:string,
        number_system:string,
        direction:string
        second_locale:string,
        arabic_script:string,
        calendartype:'GREGORIAN'|'HIJRI',
        calendar_hijri_type:string,
        place:string,
        gps_lat:number,
        gps_long:number,
        theme_day:string,
        theme_month:string,
        theme_year:string,
        paper_size:string,
        highlight:string,
        show_weekday:number,
        show_calendartype:number,
        show_notes:number,
        show_gps:number,
        show_timezone:number,
        header_img_src:string,
        footer_img_src:string
        header_txt1:string,
        header_txt2:string,
        header_txt3:string,
        header_align:string|null,
        footer_txt1:string,
        footer_txt2:string,
        footer_txt3:string,
        footer_align:string|null,
        method:string, 
        asr:string,
        highlat:string,
        format:string,
        hijri_adj:number,	
        iqamat_fajr:string,
        iqamat_dhuhr:string,
        iqamat_asr:string,
        iqamat_maghrib:string,
        iqamat_isha:string,
        show_imsak:number,
        show_sunset:number,
        show_midnight:number,
        show_fast_start_end:number,
        timetable_class:string,
        timetable_month:string,         //class to add for month
        timetable_year_month:string,    //class to add for year
        reporttype_year_month:string,   //MONTH:default, normal month with more info, 
                                        //YEAR:	month with less info
        ui_navigation_left:'toolbar_btn_left'|null
        ui_navigation_right:'toolbar_btn_right'|null
 }

/** 
 * @name APP_REPORT_column_titles
 * @description Type APP_REPORT_column_titles
 */
type APP_REPORT_column_titles = {
        day: string, // string to support toLocaleString()
        weekday:string,
        weekday_tr:string,
        caltype:string,
        imsak:timesType['imsak'],
        fajr:timesType['fajr'],
        iqamat_fajr:string,
        sunrise:timesType['sunrise'],
        dhuhr:timesType['dhuhr'],
        iqamat_dhuhr:string,
        asr:timesType['asr'],
        iqamat_asr:string,
        sunset:timesType['sunset'],
        maghrib:timesType['maghrib'],
        iqamat_maghrib:string,
        isha:timesType['isha'],
        iqamat_isha:string,
        midnight:timesType['midnight'],
        notes:string
}
/**
 * @name APP_REPORT_day_user_account_app_data_posts
 * @description Type APP_REPORT_day_user_account_app_data_posts
 */
type APP_REPORT_day_user_account_app_data_posts = {
        Description:string,
        RegionalLanguageLocale:string,
        RegionalTimezone:string,
        RegionalNumberSystem:string,
        RegionalCalendarHijri_type:string,
        GpsLatText:number|null,
        GpsLongText:number|null,
        PrayerMethod:string,
        PrayerAsrMethod:string,
        PrayerHighLatitudeAdjustment:string,
        PrayerTimeFormat:string,
        PrayerHijriDateAdjustment:number
}
/**
 * @nme APP_REPORT_GLOBAL
 * @description Type APP_REPORT_GLOBAL
 */
type APP_REPORT_GLOBAL = {	
        app_copyright:string,
        session_currentDate:Date,
        session_currentHijriDate:[number, number],
        CommonModulePrayTimes_methods:{[index:string]:{	name:string,
                                                        params:{fajr:string|number, 
                                                                    isha:string|number|null, 
                                                                    maghrib?:number, 
                                                                    midnight?:string
                                                        }
                                                }
                                },
        regional_def_calendar_lang:string,
        regional_def_locale_ext_prefix:string,
        regional_def_locale_ext_number_system:string,
        regional_def_locale_ext_calendar:string,
        regional_def_calendar_type_greg:string,
        regional_def_calendar_number_system:string
}
/**
 * @name timesType
 * @description Type timesType
 *              added day key for timetables
 */
type timesType = {  
        imsak:number|string, 
        fajr:number|string, 
        sunrise:number|string, 
        dhuhr:number|string, 
        asr:number|string, 
        sunset:number|string, 
        maghrib:number|string, 
        isha:number|string, 
        midnight?:number|string
}

export{ CommonModuleLibTimetableParam,
        CommonModuleLibTimetable,
        test,
        APP_user_setting_record,
        APP_user_setting_data,
        APP_user_setting,
        APP_GLOBAL,
        APP_PARAMETERS,
        APP_REPORT_settings,
        APP_REPORT_column_titles,
        APP_REPORT_day_user_account_app_data_posts,
        APP_REPORT_GLOBAL,
        timesType};