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
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,214,'Potret A4 (210 x 297 mm)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,214,'Potret huruf (8,5 inci x 11 inci)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,214,'Tidak ada');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,214,'Jumat');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,214,'Sabtu');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,214,'Minggu');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,214,'10 hari kelompok');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,214,'Standar');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,214,'Hanafi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,214,'Tengah malam');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,214,'Sudut/60 malam (disarankan)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,214,'1/7 malam');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,214,'Tidak ada penyesuaian');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,214,'12 jam tanpa akhiran');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,214,'24 jam');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,214,'12 jam dengan akhiran');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,214,'Tidak ada');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,214,'10 menit');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,214,'15 menit');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,214,'20 menit');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,214,'25 menit');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,214,'30 menit');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,214,'Jam berikutnya');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,214,'Jam berikutnya + 15 menit');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,214,'Jam berikutnya + 30 menit');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,214,'Tidak');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,214,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,214,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,214,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,214,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,214,'Kiri ke kanan');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,214,'Kanan ke kiri');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,214,'Transliterasi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,214,'Transliterasi, terjemahan');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,214,'Terjemahan, transliterasi');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,214,'Terjemahan');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,214,'Gregorian');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,214,'Hijri');
