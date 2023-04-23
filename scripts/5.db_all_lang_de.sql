--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 178, 'Geschäft');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 178, 'Kommunikation');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 178, 'Ausbildung');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 178, 'Finanzen');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 178, 'Eigenheim');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 178, 'Produktivität');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 178, 'Das Einkaufen');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 178, 'Spiel');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20100','Benutzername 5 - 100 Zeichen');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20101','Ungültiger Benutzername');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20102','Bio max. 100 Zeichen');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20103','E-Mail max. 100 Zeichen');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20104','Erinnerung max. 100 Zeichen');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20105','Ungültige E-Mail');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20106','Passwort 10 - 100 Zeichen');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20107','Benutzername, Passwort und E-Mail sind erforderlich');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20200','E-Mail existiert bereits');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20201','Anbieter existiert bereits');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20203','Der Benutzername existiert bereits');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20204','Wert zu lang');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20300','Benutzername oder Passwort nicht gefunden');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20301','Passwort nicht gleich');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20302','Sie können die letzte Benutzereinstellung nicht löschen');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20303','Bitte geben sie einen Benutzernamen ein');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20304','Bitte Passwort eingeben');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20305','Benutzer nicht gefunden');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20306','Code not valid');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20307','Dateityp nicht erlaubt');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20308','Dateigröße zu groß');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20309','Text ungültig');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20310','Text zu lang');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20400','Aufnahme nicht gefunden');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20401','Ungültiges Passwort');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (178,'20500','Breiten- oder Längengrad fehlt');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Öffentlichkeit','0',178);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat geteilt','1',178);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privatgelände','2',178);
