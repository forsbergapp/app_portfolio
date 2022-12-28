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
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',546,'用戶名');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',546,'密碼');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',546,'傳');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',546,'電子郵件');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',546,'新電子郵件');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',546,'確認密碼');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',546,'密碼提醒');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',546,'新的確認密碼');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',546,'新密碼');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',546,'你確定嗎？');
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
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (546,'20500','缺少緯度或經度');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('上市','0',546);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('私人共享','1',546);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('私人的','2',546);
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,546,'A4（210 x 297 毫米）縱向');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,546,'Letter（8.5 英寸 x 11 英寸）縱向');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,546,'沒有');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,546,'星期五');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,546,'星期六');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,546,'星期日');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,546,'10天組');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,546,'標準');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,546,'Hanafi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,546,'午夜');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,546,'角度/夜間60度（推薦）');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,546,'晚上1/7');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,546,'沒有調整');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,546,'12小時無後綴');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,546,'24小時');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,546,'12小時帶後綴');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,546,'沒有');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,546,'10 分鐘');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,546,'15 分鐘');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,546,'20 分鐘');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,546,'25 分鐘');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,546,'30 分鐘');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,546,'下一個小時');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,546,'下一個小時 + 15 分鐘');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,546,'下一個小時 + 30 分鐘');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,546,'沒有');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,546,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,546,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,546,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,546,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,546,'左到右');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,546,'右到左');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,546,'音譯');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,546,'音譯，翻譯');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,546,'翻譯，音譯');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,546,'翻譯');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,546,'格里高利安');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,546,'Hijri');
