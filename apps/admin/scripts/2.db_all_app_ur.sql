--
-- app_translation app
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_id, language_id, json_data) VALUES (0,568,'{"name":"منتظم"}');
--
--  app_translation app_object_item
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',568,'صارف نام');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',568,'پاس ورڈ');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',568,'بایو');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',568,'ای میل');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',568,'نیا ای میل');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',568,'پاس ورڈ کی تصدیق');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',568,'پاس ورڈ یاد دہانی');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',568,'نئے پاس ورڈ کی تصدیق');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',568,'نیا پاس ورڈ');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',568,'کیا تمہیں یقین ہے؟');
--
-- app_translation app_setting
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),568,'A4 (210 x 297 ملی میٹر) پورٹریٹ');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),568,'خط (8.5 انچ x 11 انچ) پورٹریٹ');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),568,'گریگورین');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),568,'ہجری');