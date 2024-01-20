--
-- app_translation app
--
INSERT INTO app_portfolio.app_translation (app_id, language_id, text) VALUES (0,393,'Admin-app for app-administratorer og systemadministratorer med konfigurasjon, overvåking av live-tilkoblinger og logger, statistikk,
kringkastingsfunksjoner, databaseinfo, OS-info, prosessinfo og brukerrollehåndtering');
--
--  app_translation app_object_item
--
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',393,'Brukernavn');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',393,'Passord');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',393,'Bio');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',393,'E-post');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',393,'Ny epost');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',393,'Bekreft passord');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',393,'Påminnelse om passord');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',393,'Bekreft nytt passord');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',393,'Nytt passord');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',393,'Er du sikker?');
--
-- app_translation app_setting
--
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),393,'A4 (210 x 297 mm) portrett');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),393,'Brev (8,5 tommer x 11 tommer).');

INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),393,'Gregoriansk');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),393,'Hijri');
--
-- app_translation app_message
--
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',393,'Brukernavn 5 - 100 tegn');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',393,'Ikke gyldig brukernavn');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',393,'Bio maks 100 tegn');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',393,'E-post maks 100 tegn');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',393,'Reminder max 100 characters');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',393,'Ikke gyldig e-post');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',393,'Passord 10 - 100 tegn');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',393,'Brukernavn, passord og e-post er påkrevd');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',393,'E-post eksisterer allerede');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',393,'Leverandøren finnes allerede');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',393,'Brukernavnet eksisterer allerede');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',393,'For lang verdi');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',393,'Finner ikke brukernavn eller passord');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',393,'Bruker ikke funnet');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',393,'Koden er ikke gyldig');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',393,'Filtype ikke tillatt');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',393,'Filstørrelsen er for stor');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',393,'Finner ikke posten');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',393,'Ugyldig passord');