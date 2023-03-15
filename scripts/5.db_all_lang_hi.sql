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
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,201,'A4 (210 x 297 मिमी) पोर्ट्रेट');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,201,'अक्षर (8.5in x 11 इंच) पोर्ट्रेट');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,201,'कोई भी नहीं');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,201,'शुक्रवार');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,201,'शनिवार');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,201,'रविवार');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,201,'10 दिन समूह');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,201,'मानक');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,201,'हनाफी');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,201,'आधी रात');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,201,'रात का कोण/60वां (अनुशंसित)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,201,'1/7 रात');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,201,'कोई समायोजन नहीं');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,201,'प्रत्यय के बिना 12 घंटे');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,201,'24 घंटे');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,201,'प्रत्यय के साथ 12 घंटे');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,201,'कोई भी नहीं');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,201,'10 मिनटों');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,201,'15 मिनटों');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,201,'20 मिनटों');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,201,'25 मिनटों');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,201,'30 मिनटों');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,201,'अगले घंटे');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,201,'अगले घंटे + 15 मिनटों');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,201,'अगले घंटे + 30 मिनटों');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,201,'नहीं');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,201,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,201,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,201,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,201,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,201,'बाएं से दायां');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,201,'दाएं से बाएं');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,201,'लिप्यंतरण');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,201,'लिप्यंतरण, अनुवाद');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,201,'अनुवाद, लिप्यंतरण');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,201,'अनुवाद');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,201,'ग्रेगोरियन');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,201,'हिजरी');
