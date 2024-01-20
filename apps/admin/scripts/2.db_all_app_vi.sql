--
-- app_translation app
--
INSERT INTO app_portfolio.app_translation (app_id, language_id, text) VALUES (0,575,'Ứng dụng quản trị dành cho quản trị viên ứng dụng và quản trị viên hệ thống với cấu hình, giám sát các kết nối và nhật ký trực tiếp, số liệu thống kê,
chức năng phát sóng, thông tin cơ sở dữ liệu, thông tin hệ điều hành, thông tin quy trình và quản lý vai trò người dùng');
--
--  app_translation app_object_item
--
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',575,'Tên tài khoản');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',575,'Mật khẩu');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',575,'Tiểu sử');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',575,'E-mail');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',575,'Email mới');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',575,'Xác nhận mật khẩu');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',575,'Nhắc nhở mật khẩu');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',575,'Xác nhận mật khẩu mới');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',575,'Mật khẩu mới');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',575,'Bạn có chắc không?');
--
-- app_translation app_setting
--
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),575,'A4 (210 x 297 mm) dọc');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),575,'Chân dung Letter (8,5in x 11 inch)');

INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),575,'Gregorian');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),575,'Hijri');
--
-- app_translation app_message
--
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',575,'Tên người dùng 5 - 100 ký tự');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',575,'Tên người dùng không hợp lệ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',575,'Sinh học tối đa 100 ký tự');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',575,'Email tối đa 100 ký tự');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',575,'Lời nhắc tối đa 100 ký tự');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',575,'Email không hợp lệ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',575,'Mật khẩu 10 - 100 ký tự');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',575,'Tên người dùng, mật khẩu và email là bắt buộc');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',575,'Thư điện tử đã tồn tại');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',575,'Nhà cung cấp đã tồn tại');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',575,'Tên người dùng đã tồn tại');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',575,'Giá trị quá dài');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',575,'Tên người dùng hoặc mật khẩu không được tìm thấy');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',575,'Người dùng không được tìm thấy');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',575,'Mã không hợp lệ');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',575,'Loại tệp không được phép');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',575,'Kích thước tệp quá lớn');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',575,'Không tìm thấy bản ghi');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',575,'Mật khẩu không hợp lệ');