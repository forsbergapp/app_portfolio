--
-- app_translation app
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_id, language_id, json_data) VALUES (0,338,'{"name":"प्रशासक"}');
--
--  app_translation app_object_item
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',338,'वापरकर्तानाव');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',338,'पासवर्ड');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',338,'जैव');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',338,'ईमेल');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',338,'नवीन ई - मेल');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',338,'पासवर्ड पुष्टी');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',338,'पासवर्ड रिमाइंडर');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',338,'नवीन पासवर्ड पुष्टी');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',338,'नवीन पासवर्ड');
INSERT INTO <DB_SCHEMA/>.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',338,'तुला खात्री आहे?');
--
-- app_translation app_setting
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),338,'A4 (210 x 297 मिमी) पोर्ट्रेट');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),338,'पत्र (8.5in x 11 इंच) पोर्ट्रेट');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),338,'ग्रेगोरियन');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),338,'हिजरी');