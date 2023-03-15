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
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,453,'A4 (210 x 297 мм), книжная ориентация');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,453,'Письмо (8,5 дюймов x 11 дюймов), портретная');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,453,'Никакой');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,453,'Пятница');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,453,'Суббота');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,453,'Воскресенье');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,453,'10-дневные группы');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,453,'Стандарт');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,453,'Ханафи');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,453,'Посреди ночи');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,453,'Угол/60-я ночь (рекомендуется)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,453,'1/7 ночи');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,453,'Без регулировки');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,453,'12 часов без суффикса');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,453,'24 часа в сутки');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,453,'12 часов с суффиксом');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,453,'Никакой');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,453,'10 протокол');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,453,'15 протокол');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,453,'20 протокол');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,453,'25 протокол');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,453,'30 протокол');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,453,'Следующий час');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,453,'Следующий час + 15 протокол');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,453,'Следующий час + 30 протокол');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,453,'Нет');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,453,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,453,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,453,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,453,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,453,'Слева направо');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,453,'Справа налево');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,453,'Транслитерация');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,453,'Транслитерация, перевод');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,453,'Перевод, транслитерация');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,453,'Перевод');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,453,'Григорианский');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,453,'Хиджра');
