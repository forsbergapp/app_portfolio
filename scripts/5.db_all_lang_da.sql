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
