--
-- app_object_translation
--
INSERT INTO app_portfolio.app_object_translation (app_object_app_id, app_object_object_name, language_id, text) VALUES (0,'APP_DESCRIPTION',515,'Administratörsapp för appadministratörer och systemadministratörer med konfiguration, övervakning av liveanslutningar och loggar, statistik,
sändningsfunktioner, databasinfo, OS-info, processinfo och användarrollshantering');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',515,'Användarnamn');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',515,'Lösenord');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',515,'Bio');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',515,'E-post');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',515,'Ny e-post');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',515,'Bekräfta lösenord');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',515,'Lösenordspåminnelse');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',515,'Nytt bekräfta lösenord');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',515,'Nytt lösenord');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',515,'Är du säker?');
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='A4'),515,'A4 (210 x 297 mm) porträtt');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='Letter'),515,'Brev (8,5 tum x 11 tum).');

INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 5 and data='ltr'),515,'Vänster till höger');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 5 and data='rtl'),515,'Höger till vänster');

INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='GREGORIAN'),515,'Gregoriansk');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='HIJRI'),515,'Hijri');
