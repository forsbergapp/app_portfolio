--
-- app_translation app
--
INSERT INTO app_portfolio.app_translation (app_id, language_id, text) VALUES (0,546,'應用程序管理員和系統管理員的管理應用程序，具有配置、實時連接和日誌監控、統計信息、
廣播功能、數據庫信息、操作系統信息、進程信息和用戶角色管理');
--
--  app_translation app_object_item
--
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',546,'用戶名');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',546,'密碼');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',546,'傳');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',546,'電子郵件');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',546,'新電子郵件');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',546,'確認密碼');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',546,'密碼提醒');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',546,'新的確認密碼');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',546,'新密碼');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',546,'你確定嗎？');
--
-- app_translation app_setting
--
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),546,'A4（210 x 297 毫米）縱向');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),546,'Letter（8.5 英寸 x 11 英寸）縱向');

INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),546,'格里高利安');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),546,'Hijri');
--
-- app_translation app_message
--
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',546,'用戶名 5 - 100 個字符');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',546,'無效的用戶名');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',546,'簡歷最多 100 個字符');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',546,'電子郵件最多 100 個字符');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',546,'提醒最多 100 個字符');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',546,'無效的電子郵件');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',546,'密碼 10 - 100 個字符');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',546,'需要用戶名、密碼和電子郵件');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',546,'電子郵件已存在');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',546,'Provider 已存在');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',546,'用戶名已存在');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',546,'值太長');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',546,'未找到用戶名或密碼');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20301',546,'密碼不一樣');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20303',546,'請輸入用戶名');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20304',546,'請輸入密碼');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',546,'未找到用戶');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',546,'代碼無效');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',546,'不允許的文件類型');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',546,'文件過大');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20309',546,'文本無效');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20310',546,'文本太長');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',546,'記錄不存在');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',546,'無效的密碼');
