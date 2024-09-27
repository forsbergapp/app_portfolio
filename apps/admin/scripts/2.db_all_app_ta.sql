--
-- app_translation app
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_id, language_id, json_data) VALUES (0,527,'{"name":"நிர்வாகம்"}');
--
-- app_translation app_setting
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),527,'A4 (210 x 297 மிமீ) உருவப்படம்');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),527,'கடிதம் (8.5in x 11 in) உருவப்படம்');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),527,'கிரிகோரியன்');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),527,'ஹிஜ்ரி');