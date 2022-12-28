--
-- app_category_translation
--
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(1, 531, 'వ్యాపారం');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(2, 531, 'కమ్యూనికేషన్స్');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(3, 531, 'చదువు');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(4, 531, 'ఫైనాన్స్');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(5, 531, 'ఇల్లు & ఇల్లు');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(6, 531, 'ఉత్పాదకత');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(7, 531, 'షాపింగ్');
INSERT INTO app_portfolio.app_category_translation(app_category_id, language_id, text) VALUES(8, 531, 'గేమ్');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','USERNAME',531,'వినియోగదారు పేరు');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD',531,'పాస్వర్డ్');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','BIO',531,'బయో');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','EMAIL',531,'ఇమెయిల్');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_EMAIL',531,'కొత్త ఇమెయిల్');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_CONFIRM',531,'పాస్వర్డ్ నిర్ధారించండి');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','PASSWORD_REMINDER',531,'పాస్వర్డ్ రిమైండర్');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD_CONFIRM',531,'కొత్త పాస్‌వర్డ్ నిర్ధారించండి');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','NEW_PASSWORD',531,'కొత్త పాస్వర్డ్');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'COMMON','CONFIRM_QUESTION',531,'మీరు చెప్పేది నిజమా?');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20100','వినియోగదారు పేరు 5 - 100 అక్షరాలు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20101','చెల్లుబాటు అయ్యే వినియోగదారు పేరు కాదు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20102','బయో గరిష్టంగా 100 అక్షరాలు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20103','గరిష్టంగా 100 అక్షరాలు ఇమెయిల్ చేయండి');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20104','రిమైండర్ గరిష్టంగా 100 అక్షరాలు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20105','చెల్లని ఇమెయిల్');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20106','పాస్వర్డ్ 10 - 100 అక్షరాలు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20107','వినియోగదారు పేరు, పాస్‌వర్డ్ మరియు ఇమెయిల్ అవసరం');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20200','ఇమెయిల్ ఇప్పటికే ఉంది');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20201','ప్రొవైడర్ ఇప్పటికే ఉన్నారు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20203','వినియోగదారు పేరు ఇప్పటికే ఉంది');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20204','చాలా పొడవు విలువ');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20300','వినియోగదారు పేరు లేదా పాస్‌వర్డ్ కనుగొనబడలేదు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20301','పాస్‌వర్డ్ ఒకేలా ఉండదు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20302','మీరు చివరి వినియోగదారు సెట్టింగ్‌ని తొలగించలేరు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20303','దయచేసి వినియోగదారు పేరును నమోదు చేయండి');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20304','దయచేసి పాస్‌వర్డ్‌ని నమోదు చేయండి');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20305','వినియోగదారుడు కనపడలేదు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20306','కోడ్ చెల్లదు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20307','ఫైల్ రకం అనుమతించబడదు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20308','ఫైల్ పరిమాణం చాలా పెద్దది');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20309','వచనం చెల్లదు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20310','టెక్స్ట్ చాలా పొడవుగా ఉంది');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20400','రికార్డు దొరకలేదు');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20401','చెల్లని పాస్వర్డ్');
INSERT INTO app_portfolio.message_translation (language_id, message_code, text) VALUES (531,'20500','అక్షాంశం లేదా రేఖాంశం లేదు');
--
-- parameter_type_translation
--
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('ప్రజా','0',531);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('ప్రైవేట్ భాగస్వామ్యం చేయబడింది','1',531);
INSERT INTO app_portfolio.parameter_type_translation (text, parameter_type_id, language_id) VALUES ('ప్రైవేట్','2',531);
--
-- setting_translation
--
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (1,531,'A4 (210 x 297 mm) పోర్ట్రెయిట్');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (2,531,'లేఖ (8.5in x 11 in) పోర్ట్రెయిట్');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (3,531,'ఏదీ లేదు');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (4,531,'శుక్రవారం');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (5,531,'శనివారం');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (6,531,'ఆదివారం');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (7,531,'10 రోజుల సమూహాలు');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (26,531,'ప్రామాణికం');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (27,531,'హనాఫీ');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (28,531,'అర్ధరాత్రి');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (29,531,'కోణం/రాత్రి 60వ తేదీ (సిఫార్సు చేయబడింది)');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (30,531,'రాత్రి 1/7వ వంతు');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (31,531,'సర్దుబాటు లేదు');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (32,531,'ప్రత్యయం లేకుండా 12-గంటలు');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (33,531,'24-గంటలు');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (34,531,'ప్రత్యయంతో 12-గంటలు');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (40,531,'ఏదీ లేదు');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (41,531,'10 నిమిషాల');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (42,531,'15 నిమిషాల');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (43,531,'20 నిమిషాల');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (44,531,'25 నిమిషాల');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (45,531,'30 నిమిషాల');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (46,531,'తదుపరి గంట');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (47,531,'తదుపరి గంట + 15 నిమిషాల');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (48,531,'తదుపరి గంట + 30 నిమిషాల');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (49,531,'సంఖ్య');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (50,531,'Fajr & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (51,531,'Imsak & Mahgrib');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (52,531,'Fajr & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (53,531,'Imsak & Isha');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (532,531,'ఎడమ నుండి కుడికి');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (533,531,'కుడి నుండి ఎడమ');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (534,531,'లిప్యంతరీకరణ');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (535,531,'లిప్యంతరీకరణ, అనువాదం');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (536,531,'అనువాదం, లిప్యంతరీకరణ');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (537,531,'అనువాదం');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (543,531,'గ్రెగోరియన్');
INSERT INTO app_portfolio.setting_translation (setting_id, language_id, text) VALUES (544,531,'హిజ్రీ');