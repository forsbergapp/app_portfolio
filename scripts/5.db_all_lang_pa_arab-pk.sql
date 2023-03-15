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
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (1035,'20500','Missing latitude or longitude');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Public','0',1035);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Private shared','1',1035);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Private','2',1035);
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,1035,'A4 (210 x 297 mm) portrait');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,1035,'Letter (8.5in x 11 in) portrait');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,1035,'None');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,1035,'Friday');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,1035,'Saturday');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,1035,'Sunday');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,1035,'10 days groups');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,1035,'Standard');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,1035,'Hanafi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,1035,'Middle of night');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,1035,'Angle/60th of night (recommended)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,1035,'1/7th of night');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,1035,'No adjustment');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,1035,'12-hour without suffix');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,1035,'24-hour');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,1035,'12-hour with suffix');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,1035,'None');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,1035,'10 minutes');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,1035,'15 minutes');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,1035,'20 minutes');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,1035,'25 minutes');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,1035,'30 minutes');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,1035,'Next hour');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,1035,'Next hour + 15 minutes');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,1035,'Next hour + 30 minutes');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,1035,'No');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,1035,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,1035,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,1035,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,1035,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,1035,'Left to right');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,1035,'Right to left');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,1035,'Transliteration');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,1035,'Transliteration, translation');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,1035,'Translation, transliteration');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,1035,'Translation');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,1035,'Gregorian');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,1035,'Hijri');
