-- COMMON
--
-- app
--
INSERT INTO app_portfolio.app (id, app_category_id) VALUES (<APP_ID/>, 1);
--
-- setting_type
--
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('APP_THEME', <APP_ID/>);
--
-- setting
--
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'APP_THEME','sun','Sun',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'APP_THEME','moon','Moon',NULL,NULL,NULL,NULL);
--
-- app_parameter
--
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (<APP_ID/>,'0','MODULE_EASY.QRCODE_BACKGROUND_COLOR','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (<APP_ID/>,'0','MODULE_EASY.QRCODE_COLOR_DARK','#2b2b32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (<APP_ID/>,'0','MODULE_EASY.QRCODE_COLOR_LIGHT','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (<APP_ID/>,'0','MODULE_EASY.QRCODE_HEIGHT','128',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (<APP_ID/>,'0','MODULE_EASY.QRCODE_WIDTH','128',NULL);