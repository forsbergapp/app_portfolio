--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 128, 'Forretning');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 128, 'Kommunikation');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 128, 'Uddannelse');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 128, 'Finansiere');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 128, 'Hus hjem');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 128, 'Produktivitet');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 128, 'Handle ind');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 128, 'Spil');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20100','Brugernavn 5 - 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20101','Ikke gyldigt brugernavn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20102','Bio max 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20103','Email max 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20104','Påmindelse max 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20105','Ikke gyldig e-mail');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20106','Adgangskode 10 - 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20107','Brugernavn, adgangskode og e-mail er påkrævet');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20200','E-mail findes allerede');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20201','Udbyderen findes allerede');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20203','Brugernavn eksisterer allerede');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20204','For lang værdi');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20300','Brugernavn eller adgangskode blev ikke fundet');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20301','Adgangskoden er ikke den samme');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20302','Du kan ikke slette sidste brugerindstilling');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20303','Indtast venligst brugernavn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20304','Indtast venligst adgangskode');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20305','Bruger ikke fundet');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20306','Koden er ikke gyldig');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20307','Filtype ikke tilladt');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20308','Filstørrelsen er for stor');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20309','Teksten er ikke gyldig');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20310','Teksten er for lang');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20400','Optegnelsen blev ikke fundet');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20401','Forkert kodeord');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (128,'20500','Manglende breddegrad eller længdegrad');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Offentlig','0',128);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat delt','1',128);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat','2',128);
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,128,'A4 (210 x 297 mm) portræt');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,128,'Brev (8,5 tommer x 11 tommer).');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,128,'Ingen');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,128,'Fredag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,128,'Lørdag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,128,'Søndag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,128,'10 dages grupper');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,128,'Standard');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,128,'Hanafi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,128,'Midt om natten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,128,'Vinkel/60. af natten (anbefales)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,128,'1/7 af natten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,128,'Ingen justering');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,128,'12 timer uden suffiks');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,128,'24 timer');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,128,'12 timer med suffiks');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,128,'Ingen');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,128,'10 minutter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,128,'15 minutter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,128,'20 minutter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,128,'25 minutter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,128,'30 minutter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,128,'Næste time');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,128,'Næste time + 15 minutter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,128,'Næste time + 30 minutter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,128,'Nej');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,128,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,128,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,128,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,128,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,128,'Venstre til højre');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,128,'Højre til venstre');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,128,'Translitteration');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,128,'Translitteration, oversættelse');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,128,'Oversættelse, translitteration');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,128,'Oversættelse');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,128,'Gregoriansk');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,128,'Hijri');
