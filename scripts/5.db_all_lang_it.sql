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
