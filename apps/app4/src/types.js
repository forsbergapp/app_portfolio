/** @module apps/app4/src/types */

/**
 * @description Type APP_user_setting_record
 * @typedef {{  id?:number,
 *              description: string,
 *              RegionalLanguageLocale: string,
 *              RegionalTimezone: string,
 *              RegionalNumberSystem: string,
 *              RegionalLayoutDirection: string,
 *              RegionalSecondLanguageLocale: string,
 *              RegionalArabicScript: string,
 *              RegionalCalendarType: string,
 *              RegionalCalendarHijri_type: string,
 *              GpsLatText: number|null,
 *              GpsLongText: number|null,
 *              DesignThemeDayId: string,
 *              DesignThemeMonthId: string,
 *              DesignThemeYearId: string,
 *              DesignPaperSize: string,
 *              DesignRowHighlight: string,
 *              DesignColumnWeekdayChecked: number,
 *              DesignColumnCalendartypeChecked: number,
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
 *               PrayerFajrIqamat: string,
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
 * @description Type APP_REPORT_settings
 * 
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
 * @property {string}	papersize
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
 * @property {string}	header_align
 * @property {string}	footer_txt1
 * @property {string}	footer_txt2
 * @property {string}	footer_txt3
 * @property {string}	footer_align
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
 * @property {'toolbar_btn_left'|null}	ui_navigation_left      - used in app client
 * @property {'toolbar_btn_right'|null}	ui_navigation_right     - used in app client
 */

/**
 * @description Type APP_REPORT_day_user_account_app_data_posts
 * @typedef {object}	APP_REPORT_day_user_account_app_data_posts
 * @property {string}	description
 * @property {string}	RegionalLanguageLocale
 * @property {string}	RegionalTimezone
 * @property {string}	RegionalNumberSystem
 * @property {string}	RegionalCalendarHijri_type
 * @property {number}	GpsLatText
 * @property {number}	GpsLongText
 * @property {string}	PrayerMethod
 * @property {string}	PrayerAsrMethod
 * @property {string}	PrayerHighLatitudeAdjustment
 * @property {string}	PrayerTimeFormat
 * @property {string}	PrayerHijriDateAdjustment
 */

/**
 * @description Type APP_REPORT_GLOBAL
 * @typedef {{	app_copyright:string,
 * 			session_currentDate:Date,
 * 			session_currentHijriDate:[number, number],
 * 			CommonModulePrayTimes_methods:{[index:string]:{	name:string,
 *														params:{fajr:string|number, 
 *																isha:string|number|null, 
 *																maghrib?:number, 
 *																midnight?:string
 *															}
 *													}
 *									},
 * 			regional_def_calendar_lang:string,
 * 			regional_def_locale_ext_prefix:string,
 * 			regional_def_locale_ext_number_system:string,
 * 			regional_def_locale_ext_calendar:string,
 * 			regional_def_calendar_type_greg:string,
 * 			regional_def_calendar_number_system:string,
 * 			timezone_text: string,
 * 		    GpsLatText: string,
 * 		    GpsLongText: string
 * 			}}  APP_REPORT_GLOBAL
 */

export{};