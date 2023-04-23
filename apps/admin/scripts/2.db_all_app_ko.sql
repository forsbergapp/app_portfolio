--
-- app_object_translation
--
INSERT INTO app_portfolio.app_object_translation (app_object_app_id, app_object_object_name, language_id, text) VALUES (0,'APP_DESCRIPTION',267,'앱 관리자 및 시스템 관리자를 위한 관리 앱으로 구성, 실시간 연결 및 로그 모니터링, 통계,
브로드캐스트 기능, 데이터베이스 정보, OS 정보, 프로세스 정보 및 사용자 역할 관리');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',267,'사용자 이름');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',267,'비밀번호');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',267,'바이오');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',267,'이메일');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',267,'새 이메일');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',267,'비밀번호 확인');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',267,'비밀번호 알림');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',267,'새 비밀번호 확인');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',267,'새 비밀번호');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',267,'확실합니까?');
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='A4'),267,'A4(210 x 297mm) 세로');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='Letter'),267,'레터(8.5인치 x 11인치) 세로');

INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 5 and data='ltr'),267,'왼쪽에서 오른쪽으로');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 5 and data='rtl'),267,'오른쪽에서 왼쪽으로');

INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='GREGORIAN'),267,'그레고리우스');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='HIJRI'),267,'히즈리');
