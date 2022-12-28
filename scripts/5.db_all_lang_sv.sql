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
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (515,'20500','Saknar latitud eller longitud');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Publik','0',515);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat delad','1',515);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privat','2',515);
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,515,'A4 (210 x 297 mm) porträtt');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,515,'Brev (8,5 tum x 11 tum).');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,515,'Inga');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,515,'Fredag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,515,'Lördag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,515,'Söndag');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,515,'10 dagars grupp');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,515,'Standard');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,515,'Hanafi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,515,'Mitten av natten');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,515,'Vinkel/60 av natt (rekommenderad)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,515,'1/7 av natt');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,515,'Ingen justering');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,515,'12-tim utan suffix');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,515,'24-tim');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,515,'12-tim med suffix');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,515,'Inga');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,515,'10 minuter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,515,'15 minuter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,515,'20 minuter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,515,'25 minuter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,515,'30 minuter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,515,'Nästa timme');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,515,'Nästa timme + 15 minuter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,515,'Nästa timme + 30 minuter');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,515,'Nej');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,515,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,515,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,515,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,515,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,515,'Vänster till höger');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,515,'Höger till vänster');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,515,'Translitterering');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,515,'Translitterering, översättning');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,515,'Översättning, translitterering');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,515,'Översättning');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,515,'Gregoriansk');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,515,'Hijri');
