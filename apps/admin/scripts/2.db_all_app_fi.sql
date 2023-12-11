--
-- app_object_translation
--
INSERT INTO app_portfolio.app_object_translation (app_object_app_id, app_object_object_name, language_id, text) VALUES (0,'APP_DESCRIPTION',162,'Järjestelmänvalvojasovellus sovellusten järjestelmänvalvojille ja järjestelmänvalvojille määrityksellä, reaaliaikaisten yhteyksien ja lokien valvonnalla, tilastoilla,
lähetystoiminnot, tietokantatiedot, käyttöjärjestelmätiedot, prosessitiedot ja käyttäjien roolien hallinta');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',162,'Käyttäjätunnus');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',162,'Salasana');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',162,'Bio');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',162,'Sähköposti');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',162,'Uusi sähköposti');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',162,'Vahvista salasana');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',162,'Salasanan muistuttaja');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',162,'Vahvista uusi salasana');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',162,'Uusi salasana');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',162,'Oletko varma?');
--
-- setting_translation
--
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND data='A4'),162,'A4 (210 x 297 mm) muotokuva');
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND data='Letter'),162,'Letter (8,5 x 11 tuumaa) muotokuva');

INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND data='GREGORIAN'),162,'Gregoriaaninen');
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND data='HIJRI'),162,'Hijri');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',162,'Käyttäjätunnus 5 - 100 merkkiä');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',162,'Ei kelvollinen käyttäjätunnus');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',162,'Bio max 100 merkkiä');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',162,'Sähköposti enintään 100 merkkiä');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',162,'Muistutus enintään 100 merkkiä');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',162,'Virheellinen sähköpostiosoite');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',162,'Salasana 10-100 merkkiä');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',162,'Käyttäjätunnus, salasana ja sähköpostiosoite vaaditaan');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',162,'Sähköposti on jo olemassa');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',162,'Palveluntarjoaja on jo olemassa');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',162,'Käyttäjänimi on jo olemassa');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',162,'Liian pitkä arvo');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',162,'Käyttäjätunnusta tai salasanaa ei löydy');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20301',162,'Salasana ei ole sama');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20303',162,'Anna käyttäjänimi');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20304',162,'Anna salasana');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',162,'Käyttäjää ei löydy');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',162,'Koodi ei kelpaa');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',162,'Tiedostotyyppiä ei sallita');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',162,'Tiedoston koko on liian suuri');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20309',162,'Teksti ei kelpaa');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20310',162,'Teksti liian pitkä');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',162,'Tietuetta ei löydy');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',162,'Väärä salasana');