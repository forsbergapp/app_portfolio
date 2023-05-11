--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 575, 'Việc kinh doanh');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 575, 'Thông tin liên lạc');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 575, 'Giáo dục');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 575, 'Tài chính');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 575, 'Nhà & Nhà');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 575, 'Năng suất');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 575, 'Mua sắm');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 575, 'Trò chơi');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20100','Tên người dùng 5 - 100 ký tự');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20101','Tên người dùng không hợp lệ');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20102','Sinh học tối đa 100 ký tự');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20103','Email tối đa 100 ký tự');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20104','Lời nhắc tối đa 100 ký tự');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20105','Email không hợp lệ');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20106','Mật khẩu 10 - 100 ký tự');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20107','Tên người dùng, mật khẩu và email là bắt buộc');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20200','Thư điện tử đã tồn tại');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20201','Nhà cung cấp đã tồn tại');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20203','Tên người dùng đã tồn tại');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20204','Giá trị quá dài');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20300','Tên người dùng hoặc mật khẩu không được tìm thấy');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20301','Mật khẩu không giống nhau');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20302','Bạn không thể xóa cài đặt người dùng cuối cùng');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20303','Vui lòng nhập tên người dùng');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20304','Xin vui lòng nhập mật khẩu');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20305','Người dùng không được tìm thấy');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20306','Mã không hợp lệ');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20307','Loại tệp không được phép');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20308','Kích thước tệp quá lớn');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20309','Văn bản không hợp lệ');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20310','Văn bản quá dài');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20400','Không tìm thấy bản ghi');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (575,'20401','Mật khẩu không hợp lệ');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Công cộng','0',575);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Chia sẻ riêng tư','1',575);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('Riêng tư','2',575);
