--
-- app_translation app
--
INSERT INTO app_portfolio.app_translation (app_id, language_id, text) VALUES (0,267,'앱 관리자 및 시스템 관리자를 위한 관리 앱으로 구성, 실시간 연결 및 로그 모니터링, 통계,
브로드캐스트 기능, 데이터베이스 정보, OS 정보, 프로세스 정보 및 사용자 역할 관리');
--
--  app_translation app_object_item
--
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',267,'사용자 이름');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',267,'비밀번호');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',267,'바이오');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',267,'이메일');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',267,'새 이메일');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',267,'비밀번호 확인');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',267,'비밀번호 알림');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',267,'새 비밀번호 확인');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',267,'새 비밀번호');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',267,'확실합니까?');
--
-- app_translation app_setting
--
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),267,'A4(210 x 297mm) 세로');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),267,'레터(8.5인치 x 11인치) 세로');

INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),267,'그레고리우스');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),267,'히즈리');
--
-- app_translation app_message
--
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',267,'사용자 이름 5 - 100자');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',267,'잘못된 사용자 이름');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',267,'바이오 최대 100자');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',267,'이메일 최대 100자');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',267,'미리 알림 최대 100자');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',267,'유효하지 않은 이메일');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',267,'비밀번호 10 - 100자');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',267,'사용자 이름, 비밀번호 및 이메일이 필요합니다');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',267,'이메일이 이미 존재합니다.');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',267,'공급자가 이미 존재합니다.');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',267,'사용자 이름이 이미 존재합니다');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',267,'값이 너무 깁니다.');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',267,'사용자 이름 또는 암호를 찾을 수 없습니다');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',267,'사용자를 찾을 수 없음');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',267,'코드가 유효하지 않음');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',267,'허용되지 않는 파일 형식');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',267,'파일 크기가 너무 큽니다.');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',267,'레코드를 찾을 수 없음');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',267,'유효하지 않은 비밀번호');