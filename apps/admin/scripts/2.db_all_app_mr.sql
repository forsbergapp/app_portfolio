--
-- app_object_translation
--
INSERT INTO app_portfolio.app_object_translation (app_object_app_id, app_object_object_name, language_id, text) VALUES (0,'APP_DESCRIPTION',338,'कॉन्फिगरेशनसह ऍप ऍडमिन आणि सिस्टम ऍडमिनसाठी ऍडमिन ऍप, लाइव्ह कनेक्शन आणि लॉगचे निरीक्षण, आकडेवारी,
ब्रॉडकास्ट फंक्शन्स, डेटाबेस माहिती, OS माहिती, प्रक्रिया माहिती आणि वापरकर्ता भूमिका व्यवस्थापन');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',338,'वापरकर्तानाव');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',338,'पासवर्ड');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',338,'जैव');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',338,'ईमेल');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',338,'नवीन ई - मेल');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',338,'पासवर्ड पुष्टी');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',338,'पासवर्ड रिमाइंडर');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',338,'नवीन पासवर्ड पुष्टी');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',338,'नवीन पासवर्ड');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',338,'तुला खात्री आहे?');
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='A4'),338,'A4 (210 x 297 मिमी) पोर्ट्रेट');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='Letter'),338,'पत्र (8.5in x 11 इंच) पोर्ट्रेट');

INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='GREGORIAN'),338,'ग्रेगोरियन');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='HIJRI'),338,'हिजरी');