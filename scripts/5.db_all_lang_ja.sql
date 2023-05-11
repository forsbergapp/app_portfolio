--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 224, '仕事');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 224, 'コミュニケーション');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 224, '教育');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 224, 'ファイナンス');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 224, '家と家');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 224, '生産性');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 224, '買い物');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 224, 'ゲーム');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20100','ユーザー名 5～100文字');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20101','ユーザー名が無効です');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20102','バイオマックス100キャラ');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20103','メールの最大文字数は 100 文字です');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20104','リマインダー最大 100 文字');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20105','無効な電子メール');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20106','パスワード 10～100文字');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20107','ユーザー名、パスワード、メールアドレスが必要です');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20200','メールは既に存在します');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20201','プロバイダーは既に存在します');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20203','ユーザー名は既に存在します');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20204','値が長すぎます');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20300','ユーザー名またはパスワードが見つかりません');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20301','パスワードが同じではありません');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20302','最後のユーザー設定は削除できません');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20303','ユーザー名を入力してください');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20304','パスワードを入力してください');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20305','ユーザーが見つかりません');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20306','コードが無効です');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20307','ファイル形式は許可されていません');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20308','ファイルサイズが大きすぎます');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20309','テキストが無効です');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20310','テキストが長すぎます');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20400','記録が見当たりませんでした');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (224,'20401','無効なパスワード');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('公衆','0',224);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('プライベート共有','1',224);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('プライベート','2',224);
