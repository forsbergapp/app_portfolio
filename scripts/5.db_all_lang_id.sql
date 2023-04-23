--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 214, 'Bisnis');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 214, 'Komunikasi');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 214, 'Pendidikan');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 214, 'Keuangan');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 214, 'Rumah Rumah');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 214, 'Produktifitas');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 214, 'Belanja');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 214, 'Permainan');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20100','Nama pengguna 5 - 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20101','Bukan nama pengguna yang valid');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20102','Bio max 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20103','Email maksimal 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20104','Pengingat maks 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20105','Email tidak valid');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20106','Kata sandi 10 - 100 karakter');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20107','Nama pengguna, kata sandi, dan email diperlukan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20200','Email sudah ada');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20201','Penyedia sudah ada');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20203','Nama pengguna sudah ada');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20204','Nilai terlalu panjang');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20300','Nama pengguna atau kata sandi tidak ditemukan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20301','Kata sandi tidak sama');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20302','Anda tidak dapat menghapus pengaturan pengguna terakhir');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20303','Silakan masukkan nama pengguna');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20304','Silakan masukkan kata sandi');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20305','Pengguna tidak ditemukan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20306','Kode tidak valid');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20307','Jenis file tidak diizinkan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20308','Ukuran file terlalu besar');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20309','Teks tidak valid');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20310','Teks terlalu panjang');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20400','Rekaman tidak ditemukan');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20401','Kata sandi salah');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (214,'20500','Garis lintang atau garis bujur tidak ada');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Publik','0',214);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Pribadi dibagikan','1',214);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Pribadi','2',214);
