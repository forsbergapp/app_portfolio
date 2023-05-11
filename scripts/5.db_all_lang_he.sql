--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 198, 'עֵסֶק');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 198, 'תקשורת');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 198, 'חינוך');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 198, 'לְמַמֵן');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 198, 'בית בית');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 198, 'פִּריוֹן');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 198, 'קניות');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 198, 'מִשְׂחָק');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20100','שם משתמש 5 - 100 תווים');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20101','שם משתמש לא חוקי');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20102','ביו מקסימום 100 תווים');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20103','אימייל עד 100 תווים');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20104','תזכורת מקסימום 100 תווים');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20105','אימייל לא חוקי');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20106','סיסמה 10 - 100 תווים');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20107','נדרשים שם משתמש, סיסמה ואימייל');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20200','האימייל כבר קיים');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20201','הספק כבר קיים');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20203','שם המשתמש כבר קיים');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20204','ערך ארוך מדי');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20300','שם משתמש או סיסמה לא נמצאו');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20301','סיסמא לא זהה');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20302','לא ניתן למחוק את הגדרת המשתמש האחרונה');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20303','נא להזין שם משתמש');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20304','נא להזין סיסמה');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20305','המשתמש לא נמצא');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20306','הקוד לא חוקי');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20307','סוג הקובץ אינו מותר');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20308','גודל הקובץ גדול מדי');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20309','טקסט לא חוקי');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20310','טקסט ארוך מדי');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20400','רשומה לא נמצאה');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (198,'20401','סיסמה שגויה');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('פּוּמְבֵּי','0',198);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('משותף פרטי','1',198);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('פְּרָטִי','2',198);
