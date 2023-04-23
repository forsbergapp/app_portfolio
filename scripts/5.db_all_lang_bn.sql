--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 63, 'ব্যবসা');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 63, 'যোগাযোগ');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 63, 'শিক্ষা');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 63, 'অর্থায়ন');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 63, 'বাড়ি ও বাড়ি');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 63, 'প্রমোদ');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 63, 'কেনাকাটা');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 63, 'খেলা');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20100','ব্যবহারকারীর নাম 5 - 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20101','বৈধ ব্যবহারকারীর নাম নয়');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20102','বায়ো সর্বোচ্চ 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20103','ইমেল সর্বাধিক 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20104','অনুস্মারক সর্বাধিক 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20105','বৈধ ইমেইল নয়');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20106','পাসওয়ার্ড 10 - 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20107','ব্যবহারকারীর নাম, পাসওয়ার্ড এবং ইমেল প্রয়োজন');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20200','ইমেল টি ইতিমধ্যেটই আছে');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20201','প্রদানকারী ইতিমধ্যেই বিদ্যমান');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20203','ব্যবহারকারীর নাম ইতিমধ্যে বিদ্যমান');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20204','অনেক লম্বা মান');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20300','ব্যবহারকারীর নাম বা পাসওয়ার্ড পাওয়া যায়নি');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20301','পাসওয়ার্ড একই নয়');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20302','আপনি শেষ ব্যবহারকারী সেটিং মুছে ফেলতে পারবেন না');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20303','অনুগ্রহ করে ব্যবহারকারীর নাম লিখুন');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20304','পাসওয়ার্ড লিখুন');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20305','ব্যবহারকারী খুঁজে পাওয়া যায় না');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20306','কোড বৈধ নয়');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20307','ফাইলের ধরন অনুমোদিত নয়');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20308','ফাইলের আকার খুব বড়');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20309','পাঠ্য বৈধ নয়');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20310','টেক্সট অনেক লম্বা');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20400','রেকর্ড পাওয়া যায়নি');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20401','অবৈধ পাসওয়ার্ড');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (63,'20500','অনুপস্থিত অক্ষাংশ বা দ্রাঘিমাংশ');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('পাবলিক','0',63);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('ব্যক্তিগত ভাগ করা','1',63);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('ব্যক্তিগত','2',63);
