--
-- app_object_translation
--
INSERT INTO app_portfolio.app_object_translation (app_object_app_id, app_object_object_name, language_id, text) VALUES (0,'APP_DESCRIPTION',568,'ایپ ایڈمنز اور سسٹم ایڈمنز کے لیے ایڈمن ایپ کنفیگریشن، لائیو کنکشنز اور لاگز کی نگرانی، شماریات،
براڈکاسٹ فنکشنز، ڈیٹا بیس کی معلومات، OS کی معلومات، عمل کی معلومات اور صارف کے کردار کا انتظام');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',568,'صارف نام');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',568,'پاس ورڈ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',568,'بایو');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',568,'ای میل');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',568,'نیا ای میل');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',568,'پاس ورڈ کی تصدیق');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',568,'پاس ورڈ یاد دہانی');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',568,'نئے پاس ورڈ کی تصدیق');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',568,'نیا پاس ورڈ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',568,'کیا تمہیں یقین ہے؟');
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='A4'),568,'A4 (210 x 297 ملی میٹر) پورٹریٹ');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='Letter'),568,'خط (8.5 انچ x 11 انچ) پورٹریٹ');

INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='GREGORIAN'),568,'گریگورین');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='HIJRI'),568,'ہجری');
