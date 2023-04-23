--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 201, 'व्यवसाय');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 201, 'संचार');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 201, 'शिक्षा');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 201, 'वित्त');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 201, 'घर - बार');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 201, 'उत्पादकता');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 201, 'खरीदारी');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 201, 'खेल');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20100','उपयोगकर्ता नाम 5 - 100 वर्ण');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20101','मान्य उपयोगकर्ता नाम नहीं');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20102','जैव अधिकतम 100 वर्ण');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20103','ईमेल अधिकतम 100 वर्ण');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20104','रिमाइंडर अधिकतम 100 वर्ण');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20105','मान्य ईमेल नहीं');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20106','पासवर्ड 10 - 100 अक्षर');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20107','उपयोगकर्ता नाम, पासवर्ड और ईमेल की आवश्यकता है');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20200','ईमेल पहले से मौजूद है');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20201','प्रदाता पहले से मौजूद है');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20203','उपयोगकर्ता नाम पहले से मौजूद');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20204','बहुत लंबा मान');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20300','उपयोगकर्ता नाम या पासवर्ड नहीं मिला');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20301','पासवर्ड समान नहीं');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20302','आप अंतिम उपयोगकर्ता सेटिंग नहीं हटा सकते');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20303','कृपया उपयोगकर्ता नाम दर्ज करें');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20304','कृप्या पास्वर्ड भरो');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20305','उपयोगकर्ता नहीं मिला');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20306','कोड मान्य नहीं है');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20307','फ़ाइल प्रकार की अनुमति नहीं है');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20308','फ़ाइल का आकार बहुत बड़ा');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20309','टेक्स्ट मान्य नहीं है');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20310','टेक्स्ट बहुत लंबा');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20400','रिकॉर्ड नहीं मिला');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20401','अवैध पासवर्ड');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (201,'20500','लापता अक्षांश या देशांतर');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('जनता','0',201);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('निजी साझा किया गया','1',201);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('निजी','2',201);
