--
-- app_translation app
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_id, language_id, json_data) VALUES (0,107,'{"name":"行政"}');
--
-- app_translation app_setting
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = <APP_ID/> AND value='A4'),107,'A4（210 x 297 毫米）纵向');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = <APP_ID/> AND value='Letter'),107,'Letter（8.5 英寸 x 11 英寸）纵向');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = <APP_ID/> AND value='GREGORIAN'),107,'格里高利安');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = <APP_ID/> AND value='HIJRI'),107,'Hijri');