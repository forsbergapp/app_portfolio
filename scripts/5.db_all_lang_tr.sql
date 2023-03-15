--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 555, 'İş');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 555, 'Iletişim');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 555, 'Eğitim');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 555, 'Maliye');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 555, 'Ev & Ev');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 555, 'Verimlilik');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 555, 'Alışveriş');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 555, 'Oyun');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20100','Kullanıcı adı 5 - 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20101','Geçerli kullanıcı adı değil');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20102','Biyo maksimum 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20103','E-posta maksimum 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20104','Hatırlatıcı maksimum 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20105','Geçerli e-posta değil');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20106','Şifre 10 - 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20107','Kullanıcı adı, şifre ve e-posta gerekli');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20200','E-posta zaten var');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20201','Sağlayıcı zaten var');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20203','Kullanıcı adı zaten var');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20204','Çok uzun değer');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20300','Kullanıcı adı veya şifre bulunamadı');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20301','Şifre aynı değil');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20302','Son kullanıcı ayarını silemezsiniz');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20303','Lütfen kullanıcı adını girin');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20304','Lütfen şifre giriniz');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20305','Kullanıcı bulunamadı');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20306','Kod geçerli değil');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20307','dosya türüne izin verilmedi');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20308','Dosya boyutu çok büyük');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20309','Metin geçerli değil');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20310','Metin çok uzun');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20400','Kayıt bulunamadı');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20401','Geçersiz şifre');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (555,'20500','Eksik enlem veya boylam');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Halk','0',555);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Özel paylaşımlı','1',555);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Özel','2',555);
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,555,'A4 (210 x 297 mm) portre');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,555,'Letter (8,5 inç x 11 inç) portre');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,555,'Hiçbiri');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,555,'Cuma');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,555,'Cumartesi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,555,'Pazar');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,555,'10 günlük gruplar');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,555,'Standart');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,555,'Hanefi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,555,'Gece yarısı');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,555,'Açı/60. gece (önerilen)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,555,'1/7 gece');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,555,'Ayarlama yok');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,555,'son ek olmadan 12 saat');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,555,'24 saat');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,555,'son ek ile 12 saat');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,555,'Hiçbiri');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,555,'10 dakika');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,555,'15 dakika');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,555,'20 dakika');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,555,'25 dakika');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,555,'30 dakika');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,555,'Sonraki saat');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,555,'Sonraki saat + 15 dakika');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,555,'Sonraki saat + 30 dakika');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,555,'Numara');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,555,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,555,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,555,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,555,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,555,'Soldan sağa');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,555,'Sağdan sola');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,555,'Başka alfabeyle yazma');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,555,'Başka alfabeyle yazma, Çeviri');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,555,'Çeviri, başka alfabeyle yazma');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,555,'Çeviri');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,555,'Gregoryen');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,555,'Hicri');
