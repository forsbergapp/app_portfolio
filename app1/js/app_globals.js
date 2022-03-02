var global_rest_url_base 				= '/service/db/api/';
var global_rest_app_parameter 			= 'app_parameter/';
var global_app_id 						= 1;

var global_app_hostname;
var global_app_name

//GLOBAL APP VARIABLES
var global_app_rest_client_id;
var global_app_rest_client_secret;
var global_app_copyright;
var global_app_default_startup_page;

var global_app_user_provider1_use;
var global_app_user_provider1_id;
var global_app_user_provider1_name;
var global_app_user_provider1_api_src;
var global_app_user_provider2_use;
var global_app_user_provider2_id;
var global_app_user_provider2_name;
var global_app_user_provider2_api_version;
var global_app_user_provider2_api_src;
var global_app_user_provider2_api_src2;
var global_rest_at;
var global_rest_dt;
var global_rest_app;
var global_rest_app_log;
var global_rest_app_object;
var global_rest_app_timetables_user_setting;
var global_rest_app_timetables_user_setting_user_account_id;
var global_rest_app_timetables_user_setting_profile;
var global_rest_app_timetables_user_setting_like;
var global_rest_app_timetables_user_setting_view;
var global_rest_country;
var global_rest_language_locale;
var global_rest_message_translation;
var global_rest_user_account;
var global_rest_user_account_common;
var global_rest_user_account_profile_username;
var global_rest_user_account_profile_userid;
var global_rest_user_account_profile_search;
var global_rest_user_account_profile_top;
var global_rest_user_account_profile_detail;
var global_rest_user_account_activate;
var global_rest_user_account_login;
var global_rest_user_account_signup;
var global_rest_user_account_provider;
var global_rest_user_account_like;
var global_rest_user_account_follow;
//services
var global_service_auth;
var global_service_geolocation;
var global_service_geolocation_gps_place;
var global_service_geolocation_gps_ip;
var global_service_report;
var global_service_worldcities;
//APP 1 VARIABLES
var global_pwa_scope;
var global_info_social_link1_url;
var global_info_social_link2_url;
var global_info_social_link3_url;
var global_info_social_link4_url;
var global_info_social_link1_name;
var global_info_social_link2_name;
var global_info_social_link3_name;
var global_info_social_link4_name;
var global_info_link_1_url;
var global_info_link_2_url;
var global_info_link_3_url;
var global_info_link_4_url;
var global_info_link_5_url;
var global_info_link_1_name;
var global_info_link_2_name;
var global_info_link_3_name;
var global_info_link_4_name;
var global_info_link_5_name;

var global_info_email_policy;
var global_info_email_disclaimer;
var global_info_email_terms;

var global_regional_def_calendar_lang;
var global_regional_def_locale_ext_prefix;
var global_regional_def_locale_ext_number_system;
var global_regional_def_locale_ext_calendar;
var global_regional_def_calendar_type_greg;
var global_regional_def_calendar_number_system;
var global_regional_default_direction;
var global_regional_default_locale_second;
var global_regional_default_coltitle;
var global_regional_default_arabic_script;
var global_regional_default_calendartype;
var global_regional_default_calendar_hijri_type;

var global_gps_default_country;
var global_gps_default_city;
var global_gps_default_place_id;
var global_gps_map_container;
var global_gps_map_zoom;
var global_gps_map_zoom_city;
var global_gps_map_zoom_pp;
var global_gps_map_flyto;
var global_gps_map_jumpto;
var global_gps_map_popup_offset;
var global_gps_map_style_baseurl;
var global_gps_map_default_style;
var global_gps_map_marker_div_pp;
var global_gps_map_marker_div_city;
var global_gps_map_marker_div_gps;
var global_gps_map_maptype;
var global_gps_map_access_token;
var global_gps_map_qibbla_title;
var global_gps_map_qibbla_text_size;
var global_gps_map_qibbla_lat;
var global_gps_map_qibbla_long;
var global_gps_map_qibbla_color;
var global_gps_map_qibbla_width;
var global_gps_map_qibbla_opacity;
var global_gps_map_qibbla_old_title;
var global_gps_map_qibbla_old_text_size;
var global_gps_map_qibbla_old_lat;
var global_gps_map_qibbla_old_long;
var global_gps_map_qibbla_old_color;
var global_gps_map_qibbla_old_width;
var global_gps_map_qibbla_old_opacity;

var global_design_default_theme_day;
var global_design_default_theme_month;
var global_design_default_theme_year;
var global_design_default_papersize;
var global_design_default_highlight_row;
var global_design_default_show_weekday;
var global_design_default_show_calendartype;
var global_design_default_show_notes;
var global_design_default_show_gps;
var global_design_default_show_timezone;

var global_image_default_report_header_src;
var global_image_default_report_footer_src;
var global_image_header_footer_width;
var global_image_header_footer_height;
var global_image_allowed_type1;
var global_image_allowed_type2;
var global_image_allowed_type3;
var global_image_mime_type;
var global_image_max_size;

var global_text_default_reporttitle1;
var global_text_default_reporttitle2;
var global_text_default_reporttitle3;
var global_text_default_reportfooter1;
var global_text_default_reportfooter2;
var global_text_default_reportfooter3;

var global_prayer_default_method;
var global_prayer_default_asr;
var global_prayer_default_highlatitude;
var global_prayer_default_timeformat;
var global_prayer_default_hijri_adjustment;
var global_prayer_default_iqamat_title_fajr;
var global_prayer_default_iqamat_title_dhuhr;
var global_prayer_default_iqamat_title_asr;
var global_prayer_default_iqamat_title_maghrib;
var global_prayer_default_iqamat_title_isha;
var global_prayer_default_show_imsak;
var global_prayer_default_show_sunset;
var global_prayer_default_show_midnight;
var global_prayer_default_show_fast_start_end;
//praytimes.org override without modifying original code
//Adding more known methods and a custom method so any angle can be supported
var global_prayer_praytimes_methods = {
	ALGERIAN: {
		name: 'Algerian Ministry of Religious Affairs and Wakfs',
		params: { fajr: 18, isha: 17 } },
	DIYANET: {
		name: 'Diyanet İşleri Başkanlığı',
		params: { fajr: 18, isha: 17 } },
	EGYPT: {
		name: 'Egyptian General Authority of Survey',
		params: { fajr: 19.5, isha: 17.5 } },
	EGYPTBIS: {
		name: 'Egyptian General Authority of Survey Bis',
		params: { fajr: 20, isha: 18 } },
	FRANCE15: {
		name: 'French15',
		params: { fajr: 15, isha: 15 } },
	FRANCE18: {
		name: 'French18',
		params: { fajr: 18, isha: 18 } },
	GULF: {
		name: 'Gulf region',
		params: { fajr: 19.5, isha: '90 min' } },
	KARACHI: {
		name: 'University of Islamic Sciences, Karachi',
		params: { fajr: 18, isha: 18 } },
	KEMENAG: {
		name: 'Kementerian Agama Republik Indonesia',
		params: { fajr: 20, isha: 18 } },
	ISNA: {
		name: 'Islamic Society of North America (ISNA)',
		params: { fajr: 15, isha: 15 } },
	JAFARI: {
		name: 'Shia Ithna-Ashari, Leva Institute, Qum',
		params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' } },
	JAKIM: {
		name: 'Jabatan Kemajuan Islam Malaysia',
		params: { fajr: 20, isha: 18} },
	MAKKAH: {
		name: 'Umm Al-Qura University, Makkah',
		params: { fajr: 18.5, isha: '90 min' } },  // fajr was 19 degrees before 1430 hijri
	MUIS: {
		name: 'Majlis Ugama Islam Singapura',
		params: { fajr: 20, isha: 18 } },	
	MWL: {
		name: 'Muslim World League',
		params: { fajr: 18, isha: 17 } },
	TUNISIA: {
		name: 'Tunisian Ministry of Religious Affairs',
		params: { fajr: 18, isha: 18 } },
	TEHRAN: {
		name: 'Institute of Geophysics, University of Tehran',
		params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' } },  // isha is not explicitly specified in this method
	UOIF: {
		name: 'Union des Organisations Islamiques de France',
		params: { fajr: 12, isha: 12 } }
};

var global_user_image_avatar_width;
var global_user_image_avatar_height;

var global_qr_logo_file_path;
var global_qr_width;
var global_qr_height;
var global_qr_color_dark;
var global_qr_color_light;
var global_qr_logo_width;
var global_qr_logo_height;
var global_qr_background_color;
//session variables
var global_session_currentDate;
var global_session_CurrentHijriDate;
var global_session_user_gps_latitude;
var global_session_user_gps_longitude;
var global_session_user_gps_place;
var global_session_gps_map_mymap;
