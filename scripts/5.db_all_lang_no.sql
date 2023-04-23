--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 393, 'Virksomhet');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 393, 'Kommunikasjon');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 393, 'Utdanning');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 393, 'Finansiere');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 393, 'Hus hjem');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 393, 'Produktivitet');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 393, 'Shopping');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 393, 'Spill');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20100','Brukernavn 5 - 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20101','Ikke gyldig brukernavn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20102','Bio maks 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20103','E-post maks 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20104','Reminder max 100 characters');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20105','Ikke gyldig e-post');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20106','Passord 10 - 100 tegn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20107','Brukernavn, passord og e-post er påkrevd');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20200','E-post eksisterer allerede');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20201','Leverandøren finnes allerede');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20203','Brukernavnet eksisterer allerede');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20204','For lang verdi');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20300','Finner ikke brukernavn eller passord');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20301','Passordet er ikke det samme');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20302','Du kan ikke slette siste brukerinnstilling');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20303','Vennligst skriv inn brukernavn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20304','Skriv inn passord');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20305','Bruker ikke funnet');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20306','Koden er ikke gyldig');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20307','Filtype ikke tillatt');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20308','Filstørrelsen er for stor');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20309','Teksten er ikke gyldig');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20310','Teksten er for lang');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20400','Finner ikke posten');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20401','Ugyldig passord');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (393,'20500','Mangler breddegrad eller lengdegrad');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Offentlig','0',393);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat delt','1',393);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat','2',393);
