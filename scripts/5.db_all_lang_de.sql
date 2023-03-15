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
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,178,'A4 (210 x 297 mm) Hochformat');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,178,'Letter (8,5 Zoll x 11 Zoll) Hochformat');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,178,'Keiner');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,178,'Freitag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,178,'Samstag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,178,'Sonntag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,178,'10 Tage Gruppen');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,178,'Standard');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,178,'Hanafi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,178,'Mitte der Nacht');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,178,'Winkel/60. Nacht (empfohlen)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,178,'1/7 der Nacht');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,178,'Keine Anpassung');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,178,'12 Stunden ohne Suffix');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,178,'24 Stunden');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,178,'12 Stunden mit Suffix');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,178,'Keiner');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,178,'10 minuten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,178,'15 minuten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,178,'20 minuten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,178,'25 minuten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,178,'30 minuten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,178,'Nächste Stunde');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,178,'Nächste Stunde + 15 minuten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,178,'Nächste Stunde + 30 minuten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,178,'Nein');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,178,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,178,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,178,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,178,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,178,'Links nach rechts');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,178,'Rechts nach links');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,178,'Transliteration');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,178,'Transliteration, übersetzung');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,178,'Übersetzung, transliteration');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,178,'Übersetzung');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,178,'Gregorianisch');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,178,'Hijri');
