/**
 * @module apps/app2/app/types
 */
/**
 * Type CommonModulePrayTimes
 * @typedef {{default:{adjust:function, getTimes:function, setMethod:function}}} CommonModulePrayTimes
 */

/**
 * Type CommonModuleLibTimetable
 * @typedef {{ REPORT_GLOBAL:APP_REPORT_GLOBAL, 
 *             timetable_translate_settings:function, 
 *             set_prayer_method:function,
 *             displayDay:function, 
 *             displayMonth:function, 
 *                          displayYear:function}} CommonModuleLibTimetable
 */

/**
 * @typedef {{  description: string,
 *              regional_language_locale: string,
 *              regional_timezone: string,
 *              regional_number_system: string,
 *              regional_layout_direction: string,
 *              regional_second_language_locale: string,
 *              regional_column_title: string,
 *              regional_arabic_script: string,
 *              regional_calendar_type: string,
 *              regional_calendar_hijri_type: string,
 *              gps_popular_place_id: number|null,
 *              gps_lat_text: number|null,
 *              gps_long_text: number|null,
 *              design_theme_day_id: string,
 *              design_theme_month_id: string,
 *              design_theme_year_id: string,
 *              design_paper_size: string,
 *              design_row_highlight: string,
 *              design_column_weekday_checked: number,
 *              design_column_calendartype_checked: number,
 *              design_column_notes_checked: number,
 *              design_column_gps_checked: number,
 *              design_column_timezone_checked: number,
 *              image_header_image_img: string,
 *              image_footer_image_img: string,
 *              text_header_1_text: string,
 *              text_header_2_text: string,
 *              text_header_3_text: string,
 *              text_header_align: string|null,
 *              text_footer_1_text: string,
 *              text_footer_2_text: string,
 *              text_footer_3_text: string,
 *              text_footer_align: string|null,
 *              prayer_method: string,
 *              prayer_asr_method: string,
 *              prayer_high_latitude_adjustment: string,
 *              prayer_time_format: string,
 *              prayer_hijri_date_adjustment: number,
 *              prayer_fajr_iqamat: string,
 *              prayer_dhuhr_iqamat: string,
 *              prayer_asr_iqamat: string,
 *              prayer_maghrib_iqamat: string,
 *              prayer_isha_iqamat: string,
 *              prayer_column_imsak_checked: number,
 *              prayer_column_sunset_checked: number,
 *              prayer_column_midnight_checked: number,
 *              prayer_column_fast_start_end: number}} APP_user_setting_record
 * Type report APP_user_setting
 * @typedef {{current_id:number,
 *            data: [{   id:number|null, 
 *                      json_data:APP_user_setting_record}]|[]
 *          }} APP_user_setting
 */
/** 
 * Type APP_place
 * @typedef {{id:string|null, app_id:number|null, app_setting_type_name:string, value:string, data2:string, data3:string, data4:string, data5:string, text:string}} APP_place
 */
/** 
 * Type APP_GLOBAL
 * @typedef {{
 *          app_default_startup_page:number,
 *          app_report_timetable:string,
 *          regional_default_direction:string,
 *          regional_default_locale_second:string,
 *          regional_default_coltitle:string,
 *          regional_default_arabic_script:string,
 *          regional_default_calendartype:string,
 *          regional_default_calendar_hijri_type:string,
 *          gps_default_place_id:number,
 *          gps_module_leaflet_qibbla_title:string,
 *          gps_module_leaflet_qibbla_text_size:number,
 *          gps_module_leaflet_qibbla_lat:number,
 *          gps_module_leaflet_qibbla_long:number,
 *          gps_module_leaflet_qibbla_color:string,
 *          gps_module_leaflet_qibbla_width:number,
 *          gps_module_leaflet_qibbla_opacity:number,
 *          gps_module_leaflet_qibbla_old_title:string,
 *          gps_module_leaflet_qibbla_old_text_size:number,
 *          gps_module_leaflet_qibbla_old_lat:number,
 *          gps_module_leaflet_qibbla_old_long:number,
 *          gps_module_leaflet_qibbla_old_color:string,
 *          gps_module_leaflet_qibbla_old_width:number,
 *          gps_module_leaflet_qibbla_old_opacity:number,
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
 *          image_header_footer_width:number,
 *          image_header_footer_height:number,
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
 *          places:APP_place[]|null,
 *          user_settings:APP_user_setting,
 *          lib_prayTimes:CommonModulePrayTimes|null,
 *          lib_timetable:CommonModuleLibTimetable
 *          }} APP_GLOBAL
 */

/** 
 * Type APP_REPORT_settings
 * @typedef {object} 	APP_REPORT_settings
 * @property {string}	locale
 * @property {string}	timezone
 * @property {string}	number_system
 * @property {string}	direction
 * @property {string}	second_locale
 * @property {string}	coltitle
 * @property {string}	arabic_script
 * @property {string}	calendartype
 * @property {string}	calendar_hijri_type
 * @property {string}	place
 * @property {number|null}	gps_lat
 * @property {number|null}	gps_long
 * @property {string}	theme_day
 * @property {string}	theme_month
 * @property {string}	theme_year
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
 * @property {string}	ui_navigation_left
 * @property {string}	ui_navigation_right
 */
/** 
 * Type APP_REPORT_column_titles
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
 * Type APP_REPORT_times
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
 * Type APP_REPORT_day_user_account_app_data_posts
 * @typedef {object}	APP_REPORT_day_user_account_app_data_posts
 * @property {string}	description
 * @property {string}	regional_language_locale
 * @property {string}	regional_timezone
 * @property {string}	regional_number_system
 * @property {string}	regional_calendar_hijri_type
 * @property {number|null}	gps_lat_text
 * @property {number|null}	gps_long_text
 * @property {string}	prayer_method
 * @property {string}	prayer_asr_method
 * @property {string}	prayer_high_latitude_adjustment
 * @property {string}	prayer_time_format
 * @property {number}	prayer_hijri_date_adjustment
 */
 
/**
 * Type APP_REPORT_GLOBAL
 * @typedef {{	
 * 			app_copyright:string,
 * 			session_currentDate:Date,
 * 			session_currentHijriDate:[number, number],
 * 			CommonModulePrayTimes_methods:{[index:string]:{	name:string,
 *														    params:{fajr:string, 
 *															isha:string|null, 
 *															maghrib:string|null, 
 *															midnight:string|null
 *														    }
 *													}
 *									},
 * 			regional_def_calendar_lang:string,
 * 			regional_def_locale_ext_prefix:string,
 * 			regional_def_locale_ext_number_system:string,
 * 			regional_def_locale_ext_calendar:string,
 * 			regional_def_calendar_type_greg:string,
 * 			regional_def_calendar_number_system:string,
 * 			timezone_text: string,
 * 		    gps_lat_text: string,
 * 		    gps_long_text: string
 * 			}} APP_REPORT_GLOBAL
 */

export{};