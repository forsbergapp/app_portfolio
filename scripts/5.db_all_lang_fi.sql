--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 162, 'Liiketoimintaa');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 162, 'Viestintä');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 162, 'Koulutus');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 162, 'Rahoittaa');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 162, 'Talo koti');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 162, 'Tuottavuus');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 162, 'Ostokset');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 162, 'Peli');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20100','Käyttäjätunnus 5 - 100 merkkiä');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20101','Ei kelvollinen käyttäjätunnus');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20102','Bio max 100 merkkiä');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20103','Sähköposti enintään 100 merkkiä');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20104','Muistutus enintään 100 merkkiä');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20105','Virheellinen sähköpostiosoite');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20106','Salasana 10-100 merkkiä');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20107','Käyttäjätunnus, salasana ja sähköpostiosoite vaaditaan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20200','Sähköposti on jo olemassa');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20201','Palveluntarjoaja on jo olemassa');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20203','Käyttäjänimi on jo olemassa');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20204','Liian pitkä arvo');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20300','Käyttäjätunnusta tai salasanaa ei löydy');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20301','Salasana ei ole sama');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20302','Et voi poistaa viimeistä käyttäjän asetusta');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20303','Anna käyttäjänimi');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20304','Anna salasana');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20305','Käyttäjää ei löydy');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20306','Koodi ei kelpaa');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20307','Tiedostotyyppiä ei sallita');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20308','Tiedoston koko on liian suuri');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20309','Teksti ei kelpaa');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20310','Teksti liian pitkä');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20400','Tietuetta ei löydy');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (162,'20401','Väärä salasana');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Julkinen','0',162);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Yksityinen jaettu','1',162);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Yksityinen','2',162);
