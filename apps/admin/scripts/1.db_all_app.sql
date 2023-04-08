--
-- app
--
INSERT INTO app_portfolio.app (id, app_name, url, logo, enabled, app_category_id) VALUES (0,'Admin', 'https://localhost/admin', '/admin/images/logo.png', 1, null);
--
-- app_object
--
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (0,'COMMON');
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (0,'APP_DESCRIPTION');
--
-- app_object_item
--
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','BIO',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','CONFIRM_QUESTION',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','EMAIL',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','NEW_EMAIL',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','NEW_PASSWORD',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','PASSWORD',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','PASSWORD_CONFIRM',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','PASSWORD_REMINDER',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (0,'COMMON','USERNAME',NULL);
--
-- app_parameter
--
-- common parameters
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_APP','/app',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_APP_CATEGORY','/app_category/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_APP_LOG','/app_log/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_APP_OBJECT','/app_object/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_APP_PARAMETER','/app_parameter/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_APP_ROLE','/app_role/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_COUNTRY','/country/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_IDENTITY_PROVIDER','/identity_provider/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_LANGUAGE_LOCALE','/language/locale/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_MESSAGE_TRANSLATION','/message_translation/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_PARAMETER_TYPE','/parameter_type/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_SETTING','/setting/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT','/user_account/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_ACTIVATE','/user_account/activate/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_APP','/user_account_app/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_COMMON','/user_account/common/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_FOLLOW','/user_account_follow/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_FORGOT','/user_account/password_reset/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_LIKE','/user_account_like/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_LOGIN','/user_account/login',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_LOGON','/user_account_logon/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_PROFILE_DETAIL','/user_account/profile/detail/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_PROFILE_SEARCHD','/user_account/profile/username/searchD/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_PROFILE_SEARCHA','/user_account/profile/username/searchA/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_PROFILE_TOP','/user_account/profile/top/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_PROFILE_USERID','/user_account/profile/id/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_PROFILE_USERNAME','/user_account/profile/username/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_PROVIDER','/user_account/provider/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_SIGNUP','/user_account/signup',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','REST_USER_ACCOUNT_PASSWORD','/user_account/password/',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_AUTH','/service/auth',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'2','SERVICE_AUTH_TOKEN_ACCESS_EXPIRE','1h',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'2','SERVICE_AUTH_TOKEN_DATA_EXPIRE','2d',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'2','SERVICE_DB_ENABLE_AUDIT','1',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_GEOLOCATION','/service/geolocation',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_GEOLOCATION_GPS_IP','/ip',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_GEOLOCATION_GPS_PLACE','/place',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_GEOLOCATION_GPS_TIMEZONE','/timezone',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_MAIL_TYPE_SIGNUP','1',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'1','SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME','{EMAIL_FROM_NAME}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_MAIL_TYPE_UNVERIFIED','2',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'1','SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME','{EMAIL_FROM_NAME}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_MAIL_TYPE_PASSWORD_RESET','3',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'1','SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME','{EMAIL_FROM_NAME}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_MAIL_TYPE_CHANGE_EMAIL','4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'1','SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME','{EMAIL_FROM_NAME}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'2','SERVICE_MAIL_HOST','{EMAIL_HOST}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'2','SERVICE_MAIL_PORT','{EMAIL_PORT}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'2','SERVICE_MAIL_SECURE','{EMAIL_SECURE}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'2','SERVICE_MAIL_USERNAME','{EMAIL_USERNAME}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'2','SERVICE_MAIL_PASSWORD','{EMAIL_PASSWORD}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_REPORT','/service/report',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','SERVICE_WORLDCITIES','/service/worldcities',NULL);

INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_FILE_ALLOWED_TYPE1','jpg',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_FILE_ALLOWED_TYPE2','jpeg',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_FILE_ALLOWED_TYPE3','png',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_FILE_ALLOWED_TYPE4','webp',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_FILE_ALLOWED_TYPE5','gif',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_FILE_MAX_SIZE','2000000',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_FILE_MIME_TYPE','image/webp',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_AVATAR_HEIGHT','64',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','IMAGE_AVATAR_WIDTH','64',NULL);

INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_LEAFLET_POPUP_OFFSET','-25',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_LEAFLET_FLYTO','1',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_LEAFLET_JUMPTO','0',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_LEAFLET_STYLE','OpenStreetMap_Mapnik',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_EASY.QRCODE_BACKGROUND_COLOR','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_EASY.QRCODE_COLOR_DARK','#2b2b32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_EASY.QRCODE_COLOR_LIGHT','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_EASY.QRCODE_HEIGHT','128',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_EASY.QRCODE_LOGO_FILE_PATH','/admin/images/logo.png',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_EASY.QRCODE_LOGO_HEIGHT','32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_EASY.QRCODE_LOGO_WIDTH','32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (0,'0','MODULE_EASY.QRCODE_WIDTH','128',NULL);
--
-- app_message
--
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20100',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20101',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20102',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20103',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20104',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20105',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20106',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20107',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20200',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20201',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20203',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20204',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20300',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20301',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20303',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20304',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20305',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20306',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20307',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20308',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20309',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20310',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20400',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20401',0);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20500',0);
--
-- app_device
--
INSERT INTO app_portfolio.app_device(app_id, device_id) VALUES(0, 1);
