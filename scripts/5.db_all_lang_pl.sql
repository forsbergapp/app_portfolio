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
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',434,'Nazwa użytkownika');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',434,'Hasło');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',434,'Bio');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',434,'E-mail');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',434,'Nowy e-mail');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',434,'Potwierdź hasło');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',434,'Przypomnienie hasła');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',434,'Potwierdź nowe hasło');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',434,'Nowe hasło');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',434,'Jesteś pewny?');
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
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,434,'A4 (210 x 297 mm) portret');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,434,'Letter (8,5 cala x 11 cali) portret');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,434,'Nic');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,434,'Piątek');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,434,'Sobota');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,434,'Niedziela');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,434,'10-dniowe grupy');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,434,'Standard');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,434,'Hanafi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,434,'Środek nocy');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,434,'Kąt/60 noc (zalecane)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,434,'1/7 nocy');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,434,'Brak regulacji');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,434,'12 godzin bez przyrostka');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,434,'24 godziny');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,434,'12-godzinny z sufiksem');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,434,'Nic');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,434,'10 minut');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,434,'15 minut');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,434,'20 minut');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,434,'25 minut');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,434,'30 minut');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,434,'Następna godzina');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,434,'Następna godzina + 15 minut');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,434,'Następna godzina + 30 minut');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,434,'Nie');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,434,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,434,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,434,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,434,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,434,'Z lewej na prawą');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,434,'Od prawej do lewej');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,434,'Transliteracja');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,434,'Transliteracja, tłumaczenie');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,434,'Tłumaczenie, transliteracja');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,434,'Tłumaczenie');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,434,'Gregoriański');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,434,'Hidżry');
