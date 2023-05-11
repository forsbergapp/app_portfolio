--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 546, '商');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 546, '通信');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 546, '教育');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 546, '金融');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 546, '房子和家');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 546, '生產力');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 546, '購物');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 546, '遊戲');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20100','用戶名 5 - 100 個字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20101','無效的用戶名');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20102','簡歷最多 100 個字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20103','電子郵件最多 100 個字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20104','提醒最多 100 個字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20105','無效的電子郵件');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20106','密碼 10 - 100 個字符');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20107','需要用戶名、密碼和電子郵件');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20200','電子郵件已存在');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20201','Provider 已存在');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20203','用戶名已存在');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20204','值太長');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20300','未找到用戶名或密碼');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20301','密碼不一樣');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20302','您不能刪除最後一個用戶設置');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20303','請輸入用戶名');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20304','請輸入密碼');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20305','未找到用戶');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20306','代碼無效');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20307','不允許的文件類型');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20308','文件過大');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20309','文本無效');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20310','文本太長');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20400','記錄不存在');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20401','無效的密碼');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('上市','0',546);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('私人共享','1',546);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('私人的','2',546);
