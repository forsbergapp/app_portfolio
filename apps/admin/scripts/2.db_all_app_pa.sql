--
-- app_object_translation
--
INSERT INTO app_portfolio.app_object_translation (app_object_app_id, app_object_object_name, language_id, text) VALUES (0,'APP_DESCRIPTION',438,'ਸੰਰਚਨਾ ਦੇ ਨਾਲ ਐਪ ਪ੍ਰਸ਼ਾਸਕਾਂ ਅਤੇ ਸਿਸਟਮ ਪ੍ਰਸ਼ਾਸਕਾਂ ਲਈ ਐਡਮਿਨ ਐਪ, ਲਾਈਵ ਕਨੈਕਸ਼ਨਾਂ ਅਤੇ ਲੌਗਾਂ ਦੀ ਨਿਗਰਾਨੀ, ਅੰਕੜੇ,
ਪ੍ਰਸਾਰਣ ਫੰਕਸ਼ਨ, ਡੇਟਾਬੇਸ ਜਾਣਕਾਰੀ, OS ਜਾਣਕਾਰੀ, ਪ੍ਰਕਿਰਿਆ ਜਾਣਕਾਰੀ ਅਤੇ ਉਪਭੋਗਤਾ ਭੂਮਿਕਾ ਪ੍ਰਬੰਧਨ');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',438,'ਯੂਜ਼ਰਨੇਮ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',438,'ਪਾਸਵਰਡ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',438,'ਬਾਇਓ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',438,'ਈ - ਮੇਲ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',438,'ਨਵੀਂ ਈਮੇਲ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',438,'ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',438,'ਪਾਸਵਰਡ ਰੀਮਾਈਂਡਰ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',438,'ਨਵੇਂ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',438,'ਨਵਾਂ ਪਾਸਵਰਡ');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',438,'ਤੁਹਾਨੂੰ ਪੂਰਾ ਵਿਸ਼ਵਾਸ ਹੈ?');
--
-- setting_translation
--
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND data='A4'),438,'A4 (210 x 297 mm) ਪੋਰਟਰੇਟ');
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND data='Letter'),438,'ਅੱਖਰ (8.5in x 11 in) ਪੋਰਟਰੇਟ');

INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND data='GREGORIAN'),438,'ਗ੍ਰੈਗੋਰੀਅਨ');
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND data='HIJRI'),438,'ਹਿਜਰੀ');
