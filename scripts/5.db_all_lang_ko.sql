--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 267, '사업');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 267, '연락');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 267, '교육');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 267, '재원');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 267, '집 집');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 267, '생산력');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 267, '쇼핑');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 267, '게임');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20100','사용자 이름 5 - 100자');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20101','잘못된 사용자 이름');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20102','바이오 최대 100자');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20103','이메일 최대 100자');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20104','미리 알림 최대 100자');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20105','유효하지 않은 이메일');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20106','비밀번호 10 - 100자');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20107','사용자 이름, 비밀번호 및 이메일이 필요합니다');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20200','이메일이 이미 존재합니다.');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20201','공급자가 이미 존재합니다.');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20203','사용자 이름이 이미 존재합니다');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20204','값이 너무 깁니다.');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20300','사용자 이름 또는 암호를 찾을 수 없습니다');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20301','비밀번호가 같지 않음');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20302','마지막 사용자 설정을 삭제할 수 없습니다');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20303','사용자 이름을 입력하십시오');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20304','비밀번호를 입력 해주세요');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20305','사용자를 찾을 수 없음');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20306','코드가 유효하지 않음');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20307','허용되지 않는 파일 형식');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20308','파일 크기가 너무 큽니다.');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20309','텍스트가 잘못되었습니다.');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20310','텍스트가 너무 깁니다.');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20400','레코드를 찾을 수 없음');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20401','유효하지 않은 비밀번호');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (267,'20500','위도 또는 경도 누락');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('공공의','0',267);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('비공개 공유','1',267);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('사적인','2',267);
