--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 564, 'Бізнес');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 564, 'Комунікації');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 564, 'Освіта');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 564, 'Фінанси');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 564, 'Будинок і дім');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 564, 'Продуктивність');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 564, 'Шопінг');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 564, 'Гра');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20100','Ім''я користувача 5 - 100 символів');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20101','Недійсне ім''я користувача');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20102','Біо максимум 100 символів');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20103','Електронна пошта не більше 100 символів');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20104','Нагадування максимум 100 символів');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20105','Недійсна електронна адреса');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20106','Пароль 10 - 100 символів');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20107','Ім''я користувача, пароль і електронна адреса є обов''язковими');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20200','Електронна пошта вже існує');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20201','Провайдер вже існує');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20203','Ім''я користувача вже існує');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20204','Занадто довге значення');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20300','Ім''я користувача або пароль не знайдено');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20301','Пароль не той');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20302','Ви не можете видалити останні налаштування користувача');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20303','Будь ласка, введіть ім''я користувача');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20304','Будь ласка, введіть пароль');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20305','Користувача не знайдено');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20306','Код недійсний');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20307','Тип файлу заборонений');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20308','Розмір файлу завеликий');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20309','Текст недійсний');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20310','Надто довгий текст');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20400','Запис не знайдено');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20401','Недійсний пароль');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (564,'20500','Відсутня широта або довгота');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Громадський','0',564);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Приватний спільний доступ','1',564);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Приватний','2',564);
