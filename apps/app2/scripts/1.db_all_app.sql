-- COMMON
--
-- app
--
INSERT INTO app_portfolio.app (id, app_name, url, logo, enabled, app_category_id) VALUES (2,'Timetables','https://app2.localhost','/app2/images/logo.png',1, 6);
--
-- app_object
--
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (2,'APP_DESCRIPTION');
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (2,'REPORT');
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (2,'APP_LOV');
--
-- app_object_item
--
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_ASR',4);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_CALENDARTYPE',15);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_HIGHLATITUDE',5);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_MAPTYPE',17);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_POPULAR_PLACE',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_COLTITLE',13);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_DIRECTION',12);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_HIGHLIGHT_ROW',2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_ASR',8);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_DHUHR',8);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_FAJR',8);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_ISHA',8);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_MAGHRIB',8);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_LOCALE_SECOND',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_PAPERSIZE',1);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_SHOW_FAST_START_END',9);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_TIMEFORMAT',6);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_ASR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_ASR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_CALTYPE_GREGORIAN',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_CALTYPE_HIJRI',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_DAY',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_DHUHR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_DHUHR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_FAJR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_FAJR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_IMSAK',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_ISHA',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_ISHA_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_MAGHRIB',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_MAGHRIB_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_MIDNIGHT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_NOTES',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_SUNRISE',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_SUNSET',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ASR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ASR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_DHUHR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_DHUHR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_FAJR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_FAJR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_IMSAK',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ISHA',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ISHA_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MAGHRIB',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MAGHRIB_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MIDNIGHT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_SUNRISE',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_SUNSET',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_WEEKDAY',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_WEEKDAY_TR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','TIMETABLE_TITLE',NULL);
--
-- app_message
--
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20302',2);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20400',2);
--
-- app_parameter
--
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','APP_COPYRIGHT','{COPYRIGHT TEXT}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','APP_DEFAULT_STARTUP_PAGE','3','1=print, 2=day, 3=month, 4=year, 5=settings, 6=profile');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','APP_REPORT_TIMETABLE','timetable.html',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_PLACE','/app2_place/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_THEME','/app2_theme/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_USER_SETTING','/app2_user_setting/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_USER_SETTING_LIKE','/app2_user_setting_like/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_USER_SETTING_PROFILE','/app2_user_setting/profile/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_USER_SETTING_PROFILE_ALL','/app2_user_setting/profile/all/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_USER_SETTING_PROFILE_DETAIL','/app2_user_setting/profile/detail/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_USER_SETTING_PROFILE_TOP','/app2_user_setting/profile/top/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_USER_SETTING_USER_ACCOUNT_ID','/app2_user_setting/user_account_id/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REST_APP2_USER_SETTING_VIEW','/app2_user_setting_view/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_EMAIL_DISCLAIMER','{EMAIL_DISCLAIMER}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_EMAIL_POLICY','{EMAIL_POLICY}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_EMAIL_TERMS','{EMAIL_TERMS}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_POLICY_NAME','Privacy Policy',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_POLICY_URL','/info/privacy_policy',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_DISCLAIMER_NAME','Disclaimer',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_DISCLAIMER_URL','/info/disclaimer',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_TERMS_NAME','Terms',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_TERMS_URL','/info/terms',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_ABOUT_NAME','About',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_ABOUT_URL','/info/about',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK1_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK1_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK2_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK2_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK3_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK3_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK4_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK4_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_ARABIC_SCRIPT','font_arabic_sans','Arabic script:Sans');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE','islamic','Calendar hijri type: islamic');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDAR_LANG','en-us',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM','latn','ex "-nu-latn"');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDAR_TYPE_GREG','gregory','ex "-u-ca-gregory"');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDARTYPE','GREGORIAN','Calendar type: Gregorian');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_COLTITLE','1','Column title: transliterated, translation');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_DIRECTION','ltr','Direction:Left to right');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR','-ca-',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM','-nu-',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_LOCALE_EXT_PREFIX','-u',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_LOCALE_SECOND','0','Second languague:None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_DEFAULT_CITY',NULL,'City:... (none)');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_DEFAULT_COUNTRY',NULL,'Country:... (none)');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_DEFAULT_PLACE_ID','40002','Default place: Kabba, Makkah');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_CONTAINER','mapid',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_ZOOM','14',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_ZOOM_CITY','8',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_ZOOM_PP','14',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_MARKER_DIV_CITY','map_marker_city',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_MARKER_DIV_GPS','map_marker_gps',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_MARKER_DIV_PP','map_marker_popular_place',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_COLOR','#a49775',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_LAT','21.4226',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_LONG','39.8261',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_COLOR','#404040',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_LAT','30.3289',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_LONG','35.4423',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_OPACITY','0.4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_TEXT_SIZE','14','');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_TITLE','Petra, jordan','Qibbla old Great temple');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_WIDTH','4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OPACITY','1',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_TEXT_SIZE','14',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_TITLE','Kaaba, Makkah','Qibbla Kabba, Makkah');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_WIDTH','4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_HIGHLIGHT_ROW','1','highlight row: Friday');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_PAPERSIZE','A4','A4 paper');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_CALENDARTYPE','true','Column calendartype: true');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_GPS','false','Show GPS: false');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_NOTES','false','Show notes: false');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_TIMEZONE','false','Show timezone: false');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_WEEKDAY','true','Show weekday: true');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_THEME_DAY','10001',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_THEME_MONTH','20001',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_THEME_YEAR','30001',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTFOOTER1','بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTFOOTER2','In the name of God, the Almighty, the Merciful',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTFOOTER3','',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTTITLE1',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTTITLE2',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTTITLE3',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','IMAGE_HEADER_FOOTER_HEIGHT','160',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','IMAGE_HEADER_FOOTER_WIDTH','800',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','IMAGE_DEFAULT_REPORT_FOOTER_SRC',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','IMAGE_DEFAULT_REPORT_HEADER_SRC','/app2/images/banner_default.webp',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_ASR','Standard','Asr method: Standard');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_HIGHLATITUDE','AngleBased','High latitude adj.: Angle/60th of night');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_HIJRI_ADJUSTMENT','0','Hijri date adjustment: 0');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_ASR','0','Asr Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR','0','Dhuhr Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_FAJR','0','Fajr Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_ISHA','0','Isha Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB','0','Maghrib Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_METHOD','MWL','Method: Muslim World League (MWL)');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_SHOW_FAST_START_END','1','Fajr and Maghrib fasting info');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_SHOW_IMSAK','false','Column imsak: no');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_SHOW_MIDNIGHT','false','Column midnight: no');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_SHOW_SUNSET','false','Column sunset: no');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_TIMEFORMAT','12hNS','Timeformat: 12h with no suffix');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_BACKGROUND_COLOR','#FFFFFF',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_DESCRIPTION','Progressive web app (PWA) single page application (SPA).',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_DISPLAY','standalone',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_ICONS1_SIZES','192x192',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_ICONS1_SRC','/app2/images/pwa/icon-192x192.png',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_ICONS1_TYPE','image/png',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_ICONS2_SIZES','512x512',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_ICONS2_SRC','/app2/images/pwa/icon-512x512.png',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_ICONS2_TYPE','image/png',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_NAME','Timetables',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_ORIENTATION','portrait-primary',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_SCOPE','/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_SHORT_NAME','Timetables',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_START_URL','/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PWA_THEME_COLOR','#a49775',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_BACKGROUND_COLOR','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_COLOR_DARK','#2b2b32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_COLOR_LIGHT','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_HEIGHT','128',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_LOGO_FILE_PATH','/app2/images/logo.png',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_LOGO_HEIGHT','32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_LOGO_WIDTH','32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_WIDTH','128',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'2','SERVICE_DB_APP_USER','app2',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'2','SERVICE_DB_APP_PASSWORD','APP_1_portfolio',NULL);
--
-- app_device
--
INSERT INTO app_portfolio.app_device(app_id, device_id) VALUES(2, 1);
-- APP
--
-- app2_group_place
--
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (1,'Africa','🌍',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (2,'America','🌎',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (3,'Antarctic','🇦🇶',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (4,'Asia','🌏',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (5,'Australia/Oceania','🌏',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (6,'Churches','⛪️',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (7,'Europe','🌍',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (8,'Mandir','🛕',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (9,'Mosques','🕌',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (10,'Mystery places','👽',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (11,'Popular places','🤩',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (12,'Synagogue','🕍',NULL);

--
-- app2_place
--
INSERT INTO app_portfolio.app2_place (id, title, latitude, longitude, timezone, country1_id, country2_id, group_place1_id, group_place2_id) VALUES (40002,'Kaaba, Masjid al-Haram, Makkah','+21.4225','+39.8262','Asia/Riyadh',438,NULL,9,4);
INSERT INTO app_portfolio.app2_place (id, title, latitude, longitude, timezone, country1_id, country2_id, group_place1_id, group_place2_id) VALUES (40003,'Al-Masjid an-Nabawi, Medina','+24.469','+39.611','Asia/Riyadh',438,NULL,9,4);
INSERT INTO app_portfolio.app2_place (id, title, latitude, longitude, timezone, country1_id, country2_id, group_place1_id, group_place2_id) VALUES (40004,'Al-Aqsa, Jerusalem','+31.7765','+35.2356','Asia/Jerusalem',420,360,9,4);
--
-- app2_theme_category
--
INSERT INTO app_portfolio.app2_theme_category (id, title) VALUES (1,'Basic');
--
-- app2_theme_type
--
INSERT INTO app_portfolio.app2_theme_type (id, title) VALUES (1,'DAY');
INSERT INTO app_portfolio.app2_theme_type (id, title) VALUES (2,'MONTH');
INSERT INTO app_portfolio.app2_theme_type (id, title) VALUES (3,'YEAR');
--
-- app2_theme
--
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10001,'Blue','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10002,'Green','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10003,'Green Gold','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20001,'Blue vertical','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20002,'White with lines','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20003,'Green Gold','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20004,'Naive','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20005,'Green vertical','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20006,'White','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20007,'Beige vertical','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20008,'Lady','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20009,'Light blue','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20010,'Orange blue','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20011,'Orange grey','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20012,'Light blue simple','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20013,'Gradient grey','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20014,'Red grey','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20015,'Beige horizontal','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (30001,'White','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,1);