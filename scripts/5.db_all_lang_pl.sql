--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 434, 'Biznes');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 434, 'Komunikacja');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 434, 'Edukacja');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 434, 'Finanse');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 434, 'Dom dom');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 434, 'Wydajność');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 434, 'Zakupy');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 434, 'Gra');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20100','Nazwa użytkownika 5 - 100 znaków');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20101','Nieprawidłowa nazwa użytkownika');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20102','Bio max 100 znaków');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20103','E-mail maks. 100 znaków');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20104','Przypomnienie maks. 100 znaków');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20105','Nieprawidłowy e-mail');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20106','Hasło 10 - 100 znaków');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20107','Nazwa użytkownika, hasło i adres e-mail są wymagane');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20200','E-mail już istnieje');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20201','Dostawca już istnieje');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20203','Nazwa użytkownika już istnieje');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20204','Zbyt długa wartość');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20300','Nie znaleziono nazwy użytkownika lub hasła');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20301','Hasło nie jest takie samo');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20302','Nie możesz usunąć ostatniego ustawienia użytkownika');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20303','Proszę podać nazwę użytkownika');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20304','Proszę wprowadzić hasło');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20305','Użytkownik nie znaleziony');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20306','Kod nieważny');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20307','Niedozwolony typ pliku');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20308','Zbyt duży rozmiar pliku');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20309','Tekst niepoprawny');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20310','Tekst jest za długi');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20400','Nie znaleziono rekordu');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20401','Nieprawidłowe hasło');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (434,'20500','Brak szerokości lub długości geograficznej');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Publiczny','0',434);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Prywatne wspólne','1',434);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Prywatny','2',434);
