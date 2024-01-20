--
-- app_translation app
--
INSERT INTO app_portfolio.app_translation (app_id, language_id, text) VALUES (0,1035,'Admin app for app admins and system admins with configuration, monitoring of live connections and logs, statistics, 
		broadcast functions, database info, OS info, process info and user role management');
--
--  app_translation app_object_item
--
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',1035,'Username');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',1035,'Password');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',1035,'Bio');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',1035,'Email');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',1035,'New email');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',1035,'Password confirm');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',1035,'Password reminder');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',1035,'New password confirm');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',1035,'New password');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',1035,'Are you sure?');
--
-- app_translation app_setting
--
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),1035,'A4 (210 x 297 mm) portrait');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),1035,'Letter (8.5in x 11 in) portrait');

INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),1035,'Gregorian');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),1035,'Hijri');
--
-- app_translation app_message
--
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',1035,'Username 5 - 100 characters');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',1035,'Not valid username');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',1035,'Bio max 100 characters');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',1035,'Email max 100 characters');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',1035,'Reminder max 100 characters');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',1035,'Not valid email');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',1035,'Password 10 - 100 characters');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',1035,'Username, password and email are required');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',1035,'Email already exist');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',1035,'Provider already exist');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',1035,'Username already exist');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',1035,'Too long value');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',1035,'Username or password not found');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',1035,'User not found');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',1035,'Code not valid');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',1035,'File type not allowed');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',1035,'File size too large');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',1035,'Record not found');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',1035,'Invalid password');
