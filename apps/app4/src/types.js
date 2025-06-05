/** @module apps/app4/src/types */

/**
 * @description Type APP_user_setting_record
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
 *               prayer_fajr_iqamat: string,
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
 * @typedef	{{[index: string]:string|number}}	APP_REPORT_times
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
 * 		    gps_lat_text: string,
 * 		    gps_long_text: string
 * 			}}  APP_REPORT_GLOBAL
 */
/** 
 * @description Type APP_PARAMETERS
 * @typedef {{
 *          app_copyright:                                    {value:string, comment:string}
 *          app_default_startup_page:                         {value:string, comment:string}
 *          app_report_timetable:                             {value:string, comment:string}
 *          app_regional_default_direction:                   {value:string, comment:string}
 *          app_regional_default_locale_second:               {value:string, comment:string}
 *          app_regional_default_arabic_script:               {value:string, comment:string}
 *          app_regional_default_calendartype:                {value:string, comment:string}
 *          app_regional_default_calendar_hijri_type:         {value:string, comment:string}
 *          app_regional_default_calendar_lang:               {value:string, comment:string}
 *          app_regional_default_locale_ext_prefix:           {value:string, comment:string}
 *          app_regional_default_locale_ext_number_system:    {value:string, comment:string}
 *          app_regional_default_locale_ext_calendar:         {value:string, comment:string}
 *          app_regional_default_calendar_type_greg:          {value:string, comment:string}
 *          app_regional_default_calendar_number_system:      {value:string, comment:string}
 *          app_gps_default_place_id:                         {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_title:              {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_text_size:          {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_lat:                {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_long:               {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_color:              {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_width:              {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_opacity:            {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_old_title:          {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_old_text_size:      {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_old_lat:            {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_old_long:           {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_old_color:          {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_old_width:          {value:string, comment:string}
 *          app_gps_module_leaflet_qibbla_old_opacity:        {value:string, comment:string}
 *          app_design_default_theme_day:                     {value:string, comment:string}
 *          app_design_default_theme_month:                   {value:string, comment:string}
 *          app_design_default_theme_year:                    {value:string, comment:string}
 *          app_design_default_papersize:                     {value:string, comment:string}
 *          app_design_default_highlight_row:                 {value:string, comment:string}
 *          app_design_default_show_weekday:                  {value:boolean, comment:string}
 *          app_design_default_show_calendartype:             {value:boolean, comment:string}
 *          app_design_default_show_notes:                    {value:boolean, comment:string}
 *          app_design_default_show_gps:                      {value:boolean, comment:string}
 *          app_design_default_show_timezone:                 {value:boolean, comment:string}
 *          app_image_default_report_header_src:              {value:string, comment:string}
 *          app_image_default_report_footer_src:              {value:string, comment:string}
 *          app_text_default_reporttitle1:                    {value:string, comment:string}
 *          app_text_default_reporttitle2:                    {value:string, comment:string}
 *          app_text_default_reporttitle3:                    {value:string, comment:string}
 *          app_text_default_reportfooter1:                   {value:string, comment:string}
 *          app_text_default_reportfooter2:                   {value:string, comment:string}
 *          app_text_default_reportfooter3:                   {value:string, comment:string}
 *          app_prayer_default_method:                        {value:string, comment:string}
 *          app_prayer_default_asr:                           {value:string, comment:string}
 *          app_prayer_default_highlatitude:                  {value:string, comment:string}
 *          app_prayer_default_timeformat:                    {value:string, comment:string}
 *          app_prayer_default_hijri_adjustment:              {value:number, comment:string}
 *          app_prayer_default_iqamat_title_fajr:             {value:string, comment:string}
 *          app_prayer_default_iqamat_title_dhuhr:            {value:string, comment:string}
 *          app_prayer_default_iqamat_title_asr:              {value:string, comment:string}
 *          app_prayer_default_iqamat_title_maghrib:          {value:string, comment:string}
 *          app_prayer_default_iqamat_title_isha:             {value:string, comment:string}
 *          app_prayer_default_show_imsak:                    {value:boolean, comment:string}
 *          app_prayer_default_show_sunset:                   {value:boolean, comment:string}
 *          app_prayer_default_show_midnight:                 {value:boolean, comment:string}
 *          app_prayer_default_show_fast_start_end:           {value:string, comment:string}
 *          }} APP_PARAMETERS
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