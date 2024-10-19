/** @module apps/app2/src/types */

/**
 * Type APP_user_setting_record
 * @typedef {{  id?:number,
*              description: string,
*              regional_language_locale: string,
*              regional_timezone: string,
*              regional_number_system: string,
*              regional_layout_direction: string,
*              regional_second_language_locale: string,
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
*/
/**
 * Type APP_REPORT_settings
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
 * @property {number}	gps_lat_text
 * @property {number}	gps_long_text
 * @property {string}	prayer_method
 * @property {string}	prayer_asr_method
 * @property {string}	prayer_high_latitude_adjustment
 * @property {string}	prayer_time_format
 * @property {string}	prayer_hijri_date_adjustment
 */

/**
 * Type APP_REPORT_GLOBAL
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
 * 		    gps_lat_text: string,
 * 		    gps_long_text: string
 * 			}}  APP_REPORT_GLOBAL
 */
/** 
 * Type APP_PARAMETERS
 * @typedef {{
 *          APP_COPYRIGHT:                                    {VALUE:string, COMMENT:string},
 *          APP_DEFAULT_STARTUP_PAGE:                         {VALUE:string, COMMENT:string},
 *          APP_REPORT_TIMETABLE:                             {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_DIRECTION:                   {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_LOCALE_SECOND:               {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_ARABIC_SCRIPT:               {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_CALENDARTYPE:                {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE:         {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_CALENDAR_LANG:               {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_LOCALE_EXT_PREFIX:           {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM:    {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR:         {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_CALENDAR_TYPE_GREG:          {VALUE:string, COMMENT:string},
 *          APP_REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM:      {VALUE:string, COMMENT:string},
 *          APP_GPS_DEFAULT_PLACE_ID:                         {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_TITLE:              {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_TEXT_SIZE:          {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_LAT:                {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_LONG:               {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_COLOR:              {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_WIDTH:              {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_OPACITY:            {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_OLD_TITLE:          {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_OLD_TEXT_SIZE:      {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_OLD_LAT:            {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_OLD_LONG:           {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_OLD_COLOR:          {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_OLD_WIDTH:          {VALUE:string, COMMENT:string},
 *          APP_GPS_MODULE_LEAFLET_QIBBLA_OLD_OPACITY:        {VALUE:string, COMMENT:string},
 *          APP_DESIGN_DEFAULT_THEME_DAY:                     {VALUE:string, COMMENT:string},
 *          APP_DESIGN_DEFAULT_THEME_MONTH:                   {VALUE:string, COMMENT:string},
 *          APP_DESIGN_DEFAULT_THEME_YEAR:                    {VALUE:string, COMMENT:string},
 *          APP_DESIGN_DEFAULT_PAPERSIZE:                     {VALUE:string, COMMENT:string},
 *          APP_DESIGN_DEFAULT_HIGHLIGHT_ROW:                 {VALUE:string, COMMENT:string},
 *          APP_DESIGN_DEFAULT_SHOW_WEEKDAY:                  {VALUE:boolean, COMMENT:string},
 *          APP_DESIGN_DEFAULT_SHOW_CALENDARTYPE:             {VALUE:boolean, COMMENT:string},
 *          APP_DESIGN_DEFAULT_SHOW_NOTES:                    {VALUE:boolean, COMMENT:string},
 *          APP_DESIGN_DEFAULT_SHOW_GPS:                      {VALUE:boolean, COMMENT:string},
 *          APP_DESIGN_DEFAULT_SHOW_TIMEZONE:                 {VALUE:boolean, COMMENT:string},
 *          APP_IMAGE_DEFAULT_REPORT_HEADER_SRC:              {VALUE:string, COMMENT:string},
 *          APP_IMAGE_DEFAULT_REPORT_FOOTER_SRC:              {VALUE:string, COMMENT:string},
 *          APP_IMAGE_HEADER_FOOTER_WIDTH:                    {VALUE:number, COMMENT:string},
 *          APP_IMAGE_HEADER_FOOTER_HEIGHT:                   {VALUE:number, COMMENT:string},
 *          APP_TEXT_DEFAULT_REPORTTITLE1:                    {VALUE:string, COMMENT:string},
 *          APP_TEXT_DEFAULT_REPORTTITLE2:                    {VALUE:string, COMMENT:string},
 *          APP_TEXT_DEFAULT_REPORTTITLE3:                    {VALUE:string, COMMENT:string},
 *          APP_TEXT_DEFAULT_REPORTFOOTER1:                   {VALUE:string, COMMENT:string},
 *          APP_TEXT_DEFAULT_REPORTFOOTER2:                   {VALUE:string, COMMENT:string},
 *          APP_TEXT_DEFAULT_REPORTFOOTER3:                   {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_METHOD:                        {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_ASR:                           {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_HIGHLATITUDE:                  {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_TIMEFORMAT:                    {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_HIJRI_ADJUSTMENT:              {VALUE:number, COMMENT:string},
 *          APP_PRAYER_DEFAULT_IQAMAT_TITLE_FAJR:             {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR:            {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_IQAMAT_TITLE_ASR:              {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB:          {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_IQAMAT_TITLE_ISHA:             {VALUE:string, COMMENT:string},
 *          APP_PRAYER_DEFAULT_SHOW_IMSAK:                    {VALUE:boolean, COMMENT:string},
 *          APP_PRAYER_DEFAULT_SHOW_SUNSET:                   {VALUE:boolean, COMMENT:string},
 *          APP_PRAYER_DEFAULT_SHOW_MIDNIGHT:                 {VALUE:boolean, COMMENT:string},
 *          APP_PRAYER_DEFAULT_SHOW_FAST_START_END:           {VALUE:string, COMMENT:string}
 *          }} APP_PARAMETERS
 */

export{};