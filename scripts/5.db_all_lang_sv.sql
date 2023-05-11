--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 515, 'Affär');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 515, 'Kommunikation');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 515, 'Utbildning');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 515, 'Finans');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 515, 'Hus & Hem');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 515, 'Produktivitet');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 515, 'Shopping');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 515, 'Spel');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20100','Username 5 - 100 characters');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20101','Not valid username');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20102','Bio max 100 tecken');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20103','E-post max 100 tecken');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20104','Påminnelse max 100 tecken');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20105','Vänlingen ange giltig e-post');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20106','Lösenord 10 - 100 tecken');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20107','Användarnamn, lösenord och e-post är obligatoriskt');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20200','E-post finns redan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20201','Provider finns redan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20203','Användare finns redan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20204','För långt värde');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20300','Användare eller lösenord hittades inte');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20301','Lösenord är inte samma');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20302','Du kan inte ta bort sista användarinställningen');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20303','Vänlingen ange användarenamn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20304','Vänlingen ange lösenord');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20305','Användare hittades inte');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20306','Kod inte giltig');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20307','Fil typ inte tillåten');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20308','Fil storlek för stor');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20309','Text inte giltig');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20310','Text för lång');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20400','Post finns inte');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20401','Ogiltigt lösenord');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Publik','0',515);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat delad','1',515);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat','2',515);
