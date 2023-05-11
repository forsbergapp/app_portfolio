--
-- app_category_translation
-- (https://www.ijunoon.com/punjabi/shahmukhi.aspx)
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 1035, 'کاروبار/دھندا');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 1035, 'مواصلات');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 1035, 'Education');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 1035, 'Finance');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 1035, 'گھر & گھربار');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 1035, 'Productivity');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 1035, 'Shopping');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 1035, 'بازی');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20100','Username 5 - 100 characters');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20101','Not valid username');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20102','Bio max 100 characters');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20103','Email max 100 characters');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20104','Reminder max 100 characters');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20105','Not valid email');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20106','Password 10 - 100 characters');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20107','Username, password and email are required');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20200','Email already exist');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20201','Provider already exist');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20203','Username already exist');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20204','Too long value');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20300','Username or password not found');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20301','Password not the same');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20302','You can not delete last user setting');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20303','Please enter username');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20304','Please enter password');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20305','User not found');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20306','Code not valid');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20307','File type not allowed');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20308','File size too large');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20309','Text not valid');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20310','Text too long');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20400','Record not found');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20401','Invalid password');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Public','0',1035);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Private shared','1',1035);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Private','2',1035);
