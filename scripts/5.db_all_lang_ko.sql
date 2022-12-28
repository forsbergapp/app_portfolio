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
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,267,'A4(210 x 297mm) 세로');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,267,'레터(8.5인치 x 11인치) 세로');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,267,'없음');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,267,'금요일');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,267,'토요일');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,267,'일요일');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,267,'10일 그룹');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,267,'기준');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,267,'하나피');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,267,'한밤중');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,267,'각도/야간 60도(권장)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,267,'밤의 1/7');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,267,'조정 없음');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,267,'접미사 없이 12시간');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,267,'24 시간');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,267,'접미사 포함 12시간');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,267,'없음');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,267,'10 분');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,267,'15 분');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,267,'20 분');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,267,'25 분');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,267,'30 분');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,267,'다음 시간');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,267,'다음 시간 + 15 분');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,267,'다음 시간 + 30 분');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,267,'아니');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,267,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,267,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,267,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,267,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,267,'왼쪽에서 오른쪽으로');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,267,'오른쪽에서 왼쪽으로');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,267,'음역');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,267,'음역, 번역');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,267,'번역, 음역');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,267,'번역');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,267,'그레고리우스');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,267,'히즈리');
