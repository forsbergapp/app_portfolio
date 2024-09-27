--
-- app_translation app
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_id, language_id, json_data) VALUES (0,31,'{"name":"ադմին"}');
--
-- app_translation app_setting
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),31,'A4 (210 x 297 մմ) դիմանկար');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),31,'Նամակ (8,5 x 11 դյույմ) դիմանկար');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),31,'Գրիգորյանը');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),31,'հիջրի');
