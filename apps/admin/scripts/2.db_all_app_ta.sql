--
-- app_translation app_object
--
INSERT INTO app_portfolio.app_translation (app_id, language_id, text) VALUES (0,527,'உள்ளமைவு, நேரடி இணைப்புகள் மற்றும் பதிவுகளை கண்காணித்தல், புள்ளிவிவரங்கள், பயன்பாட்டு நிர்வாகிகள் மற்றும் கணினி நிர்வாகிகளுக்கான நிர்வாகி பயன்பாடு
ஒளிபரப்பு செயல்பாடுகள், தரவுத்தள தகவல், OS தகவல், செயல்முறை தகவல் மற்றும் பயனர் பங்கு மேலாண்மை');
--
-- app_translation app_object_item
--
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',527,'பயனர் பெயர்');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',527,'கடவுச்சொல்');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',527,'உயிர்');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',527,'மின்னஞ்சல்');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',527,'புதிய மின்னஞ்சல்');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',527,'கடவுச்சொல்லை உறுதிப்படுத்து');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',527,'கடவுச்சொல் நினைவூட்டல்');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',527,'புதிய கடவுச்சொல் உறுதிப்படுத்தல்');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',527,'புதிய கடவுச்சொல்');
INSERT INTO app_portfolio.app_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',527,'நீ சொல்வது உறுதியா?');
--
-- app_translation app_setting
--
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='A4'),527,'A4 (210 x 297 மிமீ) உருவப்படம்');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND value='Letter'),527,'கடிதம் (8.5in x 11 in) உருவப்படம்');

INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='GREGORIAN'),527,'கிரிகோரியன்');
INSERT INTO app_portfolio.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND value='HIJRI'),527,'ஹிஜ்ரி');
--
-- app_translation app_message
--
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',527,'பயனர்பெயர் 5 - 100 எழுத்துகள்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',527,'தவறான பயனர்பெயர்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',527,'பயோ அதிகபட்சம் 100 எழுத்துகள்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',527,'மின்னஞ்சல் அதிகபட்சம் 100 எழுத்துகள்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',527,'நினைவூட்டல் அதிகபட்சம் 100 எழுத்துகள்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',527,'தவறான மின்னஞ்சல்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',527,'கடவுச்சொல் 10 - 100 எழுத்துகள்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',527,'பயனர்பெயர், கடவுச்சொல் மற்றும் மின்னஞ்சல் தேவை');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',527,'மின்னஞ்சல் ஏற்கனவே உள்ளது');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',527,'வழங்குநர் ஏற்கனவே இருக்கிறார்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',527,'பயனர் பெயர் ஏற்கனவே உள்ளது');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',527,'மிக நீண்ட மதிப்பு');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',527,'பயனர் பெயர் அல்லது கடவுச்சொல் கிடைக்கவில்லை');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20301',527,'கடவுச்சொல் ஒன்றல்ல');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20303',527,'பயனர் பெயரை உள்ளிடவும்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20304',527,'கடவுச்சொல்லை உள்ளிடவும்');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',527,'பயனர் கிடைக்கவில்லை');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',527,'குறியீடு செல்லாது');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',527,'கோப்பு வகை அனுமதிக்கப்படவில்லை');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',527,'கோப்பு அளவு மிகவும் பெரியது');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20309',527,'உரை செல்லாது');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20310',527,'உரை மிக நீளமானது');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',527,'பதிவு கிடைக்கவில்லை');
INSERT INTO app_portfolio.app_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',527,'தவறான கடவுச்சொல்');