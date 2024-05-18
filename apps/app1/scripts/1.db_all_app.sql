-- COMMON
--
-- app
--
INSERT INTO <DB_SCHEMA/>.app (id, app_category_id) VALUES (<APP_ID/>, 1);
--
-- app_setting_type
--
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('APP_THEME', <APP_ID/>);
--
-- app_setting
--
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'APP_THEME','sun','Sun',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'APP_THEME','moon','Moon',NULL,NULL,NULL,NULL);