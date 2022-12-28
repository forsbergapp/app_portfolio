--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 222, 'Affare');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 222, 'Comunicazioni');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 222, 'Formazione scolastica');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 222, 'Finanza');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 222, 'Casa');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 222, 'Produttività');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 222, 'Acquisti');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 222, 'Gioco');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',222,'Nome utente');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',222,'Parola d''ordine');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',222,'Bio');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',222,'Email');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',222,'Nuova email');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',222,'Conferma la password');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',222,'Promemoria password');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',222,'Conferma nuova password');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',222,'Nuova password');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',222,'Sei sicuro?');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20100','Nome utente 5 - 100 caratteri');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20101','Nome utente non valido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20102','Bio max 100 caratteri');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20103','Email max 100 caratteri');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20104','Promemoria max 100 caratteri');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20105','E-mail non valida');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20106','Password 10 - 100 caratteri');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20107','Sono richiesti nome utente, password ed e-mail');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20200','L''e-mail esiste già');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20201','Il provider esiste già');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20203','Il nome utente è già esistente');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20204','Valore troppo lungo');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20300','Nome utente o password non trovati');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20301','La password non è la stessa');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20302','Non è possibile eliminare l''ultima impostazione utente');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20303','Per favore inserisci il nome utente');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20304','Per favore, inserisci la password');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20305','Utente non trovato');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20306','Codice non valido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20307','Tipo di file non consentito');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20308','Dimensione del file troppo grande');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20309','Testo non valido');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20310','Testo troppo lungo');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20400','Inserimento non trovato');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20401','Password non valida');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (222,'20500','Latitudine o longitudine mancanti');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Pubblico','0',222);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privato condiviso','1',222);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Privato','2',222);
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,222,'Ritratto A4 (210 x 297 mm).');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,222,'Ritratto di lettera (8,5 pollici x 11 pollici).');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,222,'Nessuno');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,222,'Venerdì');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,222,'Sabato');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,222,'Domenica');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,222,'Gruppi di 10 giorni');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,222,'Standard');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,222,'Hanafi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,222,'Mezza notte');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,222,'Angolo/60° di notte (consigliato)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,222,'1/7 di notte');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,222,'Nessun aggiustamento');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,222,'12 ore senza suffisso');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,222,'24 ore');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,222,'12 ore con suffisso');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,222,'Nessuno');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,222,'10 minuti');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,222,'15 minuti');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,222,'20 minuti');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,222,'25 minuti');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,222,'30 minuti');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,222,'Prossima ora');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,222,'Prossima ora + 15 minuti');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,222,'Prossima ora + 30 minuti');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,222,'No');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,222,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,222,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,222,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,222,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,222,'Da sinistra a destra');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,222,'Da destra a sinistra');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,222,'Traslitterazione');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,222,'Traslitterazione, traduzione');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,222,'Traduzione, traslitterazione');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,222,'Traduzione');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,222,'Gregoriano');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,222,'Hijri');
