-- COMMON
--
-- app
--
INSERT INTO app_portfolio.app (id, app_name, url, logo, enabled, app_category_id) VALUES (1,'App Portfolio', 'https://localhost','/app1/images/logo.png',1, 1);
--
-- app_object
--
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (1,'APP_DESCRIPTION');
--
-- app_parameter
--
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','APP_COPYRIGHT','{COPYRIGHT TEXT}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','APP_EMAIL','{HOMEPAGE EMAIL}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_EMAIL_DISCLAIMER','{EMAIL_DISCLAIMER}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_EMAIL_POLICY','{EMAIL_POLICY}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_EMAIL_TERMS','{EMAIL_TERMS}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','INFO_LINK_POLICY_NAME','Privacy Policy',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','INFO_LINK_POLICY_URL','/info/privacy_policy',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','INFO_LINK_DISCLAIMER_NAME','Disclaimer',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','INFO_LINK_DISCLAIMER_URL','/info/disclaimer',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','INFO_LINK_TERMS_NAME','Terms',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','INFO_LINK_TERMS_URL','/info/terms',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','INFO_LINK_ABOUT_NAME','About',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','INFO_LINK_ABOUT_URL','/info/about',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_SOCIAL_LINK1_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_SOCIAL_LINK1_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_SOCIAL_LINK2_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_SOCIAL_LINK2_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_SOCIAL_LINK3_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_SOCIAL_LINK3_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_SOCIAL_LINK4_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'1','INFO_SOCIAL_LINK4_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','QR_BACKGROUND_COLOR','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','QR_COLOR_DARK','#2b2b32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','QR_COLOR_LIGHT','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','QR_HEIGHT','128',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','QR_LOGO_FILE_PATH','/app1/images/logo.png',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','QR_LOGO_HEIGHT','32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','QR_LOGO_WIDTH','32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'0','QR_WIDTH','128',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'2','SERVICE_DB_APP_USER','app1',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (1,'2','SERVICE_DB_APP_PASSWORD','APP_1_portfolio',NULL);
--
-- app_device
--
INSERT INTO app_portfolio.app_device(app_id, device_id) VALUES(1, 1);