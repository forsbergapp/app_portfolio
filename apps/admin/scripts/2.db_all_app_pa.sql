--
-- app_translation app
--
INSERT INTO app_portfolio.app_translation (app_id, language_id, text) VALUES (0,438,'ਸੰਰਚਨਾ ਦੇ ਨਾਲ ਐਪ ਪ੍ਰਸ਼ਾਸਕਾਂ ਅਤੇ ਸਿਸਟਮ ਪ੍ਰਸ਼ਾਸਕਾਂ ਲਈ ਐਡਮਿਨ ਐਪ, ਲਾਈਵ ਕਨੈਕਸ਼ਨਾਂ ਅਤੇ ਲੌਗਾਂ ਦੀ ਨਿਗਰਾਨੀ, ਅੰਕੜੇ,
ਪ੍ਰਸਾਰਣ ਫੰਕਸ਼ਨ, ਡੇਟਾਬੇਸ ਜਾਣਕਾਰੀ, OS ਜਾਣਕਾਰੀ, ਪ੍ਰਕਿਰਿਆ ਜਾਣਕਾਰੀ ਅਤੇ ਉਪਭੋਗਤਾ ਭੂਮਿਕਾ ਪ੍ਰਬੰਧਨ');
--
--  app_translation app_object_item
--
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',438,'ਯੂਜ਼ਰਨੇਮ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',438,'ਪਾਸਵਰਡ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',438,'ਬਾਇਓ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',438,'ਈ - ਮੇਲ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',438,'ਨਵੀਂ ਈਮੇਲ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',438,'ਪਾਸਵਰਡ ਪੁਸ਼ਟੀ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',438,'ਪਾਸਵਰਡ ਰੀਮਾਈਂਡਰ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',438,'ਨਵੇਂ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',438,'ਨਵਾਂ ਪਾਸਵਰਡ');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',438,'ਤੁਹਾਨੂੰ ਪੂਰਾ ਵਿਸ਼ਵਾਸ ਹੈ?');
--
-- app_translation app_setting
--
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),438,'A4 (210 x 297 mm) ਪੋਰਟਰੇਟ');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),438,'ਅੱਖਰ (8.5in x 11 in) ਪੋਰਟਰੇਟ');

INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),438,'ਗ੍ਰੈਗੋਰੀਅਨ');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),438,'ਹਿਜਰੀ');
--
-- app_translation app_message
--
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',438,'ਉਪਭੋਗਤਾ ਨਾਮ 5 - 100 ਅੱਖਰ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',438,'ਵੈਧ ਉਪਭੋਗਤਾ ਨਾਮ ਨਹੀਂ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',438,'ਬਾਇਓ ਅਧਿਕਤਮ 100 ਅੱਖਰ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',438,'ਈਮੇਲ ਅਧਿਕਤਮ 100 ਅੱਖਰ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',438,'ਰੀਮਾਈਂਡਰ ਅਧਿਕਤਮ 100 ਅੱਖਰ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',438,'ਵੈਧ ਈਮੇਲ ਨਹੀਂ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',438,'ਪਾਸਵਰਡ 10 - 100 ਅੱਖਰ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',438,'ਉਪਭੋਗਤਾ ਨਾਮ, ਪਾਸਵਰਡ ਅਤੇ ਈਮੇਲ ਦੀ ਲੋੜ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',438,'ਈਮੇਲ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',438,'ਪ੍ਰਦਾਤਾ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',438,'ਉਪਭੋਗਤਾ ਨਾਮ ਪਹਿਲਾਂ ਹੀ ਮੌਜੂਦ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',438,'ਬਹੁਤ ਲੰਮਾ ਮੁੱਲ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',438,'ਯੂਜ਼ਰਨਾਮ ਜਾਂ ਪਾਸਵਰਡ ਨਹੀਂ ਮਿਲਿਆ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20301',438,'ਪਾਸਵਰਡ ਇੱਕੋ ਜਿਹਾ ਨਹੀਂ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20303',438,'ਕਿਰਪਾ ਕਰਕੇ ਉਪਭੋਗਤਾ ਨਾਮ ਦਾਖਲ ਕਰੋ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20304',438,'ਕਿਰਪਾ ਕਰਕੇ ਪਾਸਵਰਡ ਦਾਖਲ ਕਰੋ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',438,'ਉਪਭੋਗਤਾ ਨਹੀਂ ਮਿਲਿਆ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',438,'ਕੋਡ ਵੈਧ ਨਹੀਂ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',438,'ਫ਼ਾਈਲ ਕਿਸਮ ਦੀ ਇਜਾਜ਼ਤ ਨਹੀਂ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',438,'ਫ਼ਾਈਲ ਦਾ ਆਕਾਰ ਬਹੁਤ ਵੱਡਾ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20309',438,'ਲਿਖਤ ਵੈਧ ਨਹੀਂ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20310',438,'ਟੈਕਸਟ ਬਹੁਤ ਲੰਮਾ ਹੈ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',438,'ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',438,'ਗਲਤ ਪਾਸਵਰਡ');