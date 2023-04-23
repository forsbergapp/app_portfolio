--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 453, 'дело');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 453, 'Связь');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 453, 'Образование');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 453, 'Финансировать');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 453, 'Дом и дом');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 453, 'Продуктивность');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 453, 'Шоппинг');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 453, 'Игра');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20100','Имя пользователя 5 - 100 символов');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20101','Недопустимое имя пользователя');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20102','Био максимум 100 символов');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20103','Электронная почта не более 100 символов');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20104','Напоминание не более 100 символов');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20105','Недопустимый адрес электронной почты');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20106','Пароль от 10 до 100 символов');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20107','Требуется имя пользователя, пароль и адрес электронной почты');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20200','Электронная почта уже существует');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20201','Провайдер уже существует');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20203','Имя пользователя уже существует');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20204','Слишком длинное значение');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20300','Имя пользователя или пароль не найдены');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20301','Пароль не совпадает');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20302','Вы не можете удалить последний пользовательский параметр');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20303','Пожалуйста, введите имя пользователя');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20304','Пожалуйста, введите пароль');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20305','Пользователь не найден');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20306','Недопустимый код');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20307','Тип файла не разрешен');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20308','Слишком большой размер файла');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20309','Недопустимый текст');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20310','Слишком длинный текст');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20400','Запись не найдена');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20401','Неверный пароль');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (453,'20500','Отсутствующая широта или долгота');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Общественный','0',453);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Частный общий','1',453);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Частный','2',453);
