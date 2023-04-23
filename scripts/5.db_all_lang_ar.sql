--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 25, 'مهنة');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 25, 'الاتصالات');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 25, 'تعليم');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 25, 'الماليه');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 25, 'المنزل والمنزل');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 25, 'الانتاجيه');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 25, 'تسوق');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 25, 'لعب');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20100','اسم المستخدم 5 - 100 حرف');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20101','اسم مستخدم غير صالح');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20102','الحد الأقصى للسيرة الذاتية 100 حرف');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20103','بريد إلكتروني بحد أقصى 100 حرف');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20104','تذكير بحد أقصى 100 حرف');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20105','بريد إلكتروني غير صالح');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20106','كلمة المرور 10-100 حرف');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20107','مطلوب اسم المستخدم وكلمة المرور والبريد الإلكتروني');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20200','البريد الالكتروني موجود مسبقا');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20201','Provider موجود بالفعل');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20203','اسم المستخدم موجود بالفعل');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20204','قيمة طويلة جدًا');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20300','لم يتم العثور على اسم المستخدم أو كلمة المرور');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20301','كلمة المرور ليست هي نفسها');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20302','لا يمكنك حذف إعداد المستخدم الأخير');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20303','الرجاء إدخال اسم المستخدم');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20304','الرجاء إدخال كلمة المرور');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20305','المستخدم ليس موجود');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20306','الرمز غير صالح');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20307','الملف المطبوع سري');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20308','حجم الملف كبير جدًا');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20309','النص غير صالح');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20310','نص طويل جدا');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20400','لم يتم العثور على السجل');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20401','رمز مرور خاطئ');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (25,'20500','خط العرض أو خط الطول مفقود');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('عام','0',25);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('مشترك خاص','1',25);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('خاص','2',25);
