--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 107, '商');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 107, '通信');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 107, '教育');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 107, '金融');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 107, '房子和家');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 107, '生产力');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 107, '购物');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 107, '游戏');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20100','用户名 5 - 100 个字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20101','无效的用户名');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20102','简历最多 100 个字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20103','电子邮件最多 100 个字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20104','提醒最多 100 个字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20105','无效的电子邮件');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20106','密码 10 - 100 个字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20107','需要用户名、密码和电子邮件');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20200','电子邮件已存在');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20201','Provider 已存在');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20203','用户名已存在');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20204','值太长');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20300','未找到用户名或密码');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20301','密码不一样');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20302','您不能删除最后一个用户设置');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20303','请输入用户名');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20304','请输入密码');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20305','未找到用户');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20306','代码无效');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20307','不允许的文件类型');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20308','文件过大');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20309','文本无效');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20310','文本太长');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20400','记录不存在');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (107,'20401','无效的密码');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('上市','0',107);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('私人共享','1',107);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('私人的','2',107);
