--
-- app_object_translation
--
INSERT INTO app_portfolio.app_object_translation (app_object_app_id, app_object_object_name, language_id, text) VALUES (0,'APP_DESCRIPTION',555,'Yapılandırma, canlı bağlantıların ve günlüklerin izlenmesi, istatistikler ile uygulama yöneticileri ve sistem yöneticileri için yönetici uygulaması,
yayın işlevleri, veritabanı bilgisi, işletim sistemi bilgisi, işlem bilgisi ve kullanıcı rolü yönetimi');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',555,'Kullanıcı adı');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',555,'Parola');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',555,'İdi');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',555,'E-posta');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',555,'Yeni e-posta');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',555,'Şifre onaylama');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',555,'Şifre hatırlatıcısı');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',555,'Yeni şifre onaylama');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',555,'Yeni şifre');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',555,'Emin misiniz?');
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='A4'),555,'A4 (210 x 297 mm) portre');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 2 and data='Letter'),555,'Letter (8,5 inç x 11 inç) portre');

INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='GREGORIAN'),555,'Gregoryen');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.setting WHERE setting_type_id = 7 and data='HIJRI'),555,'Hicri');
