--
-- app_object_translation
--
INSERT INTO app_portfolio.app_object_translation (app_object_app_id, app_object_object_name, language_id, text) VALUES (0,'APP_DESCRIPTION',63,'কনফিগারেশন, লাইভ সংযোগ এবং লগ পর্যবেক্ষণ, পরিসংখ্যান সহ অ্যাপ অ্যাডমিন এবং সিস্টেম অ্যাডমিনদের জন্য অ্যাডমিন অ্যাপ
ব্রডকাস্ট ফাংশন, ডাটাবেস তথ্য, ওএস তথ্য, প্রক্রিয়া তথ্য এবং ব্যবহারকারীর ভূমিকা পরিচালনা');
--
-- app_object_item_translation
--
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','USERNAME',63,'ব্যবহারকারীর নাম');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD',63,'পাসওয়ার্ড');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','BIO',63,'বায়ো');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','EMAIL',63,'ইমেইল');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_EMAIL',63,'নতুন ইমেইল');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_CONFIRM',63,'পাসওয়ার্ড নিশ্চিত করুন');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','PASSWORD_REMINDER',63,'পাসওয়ার্ড অনুস্মারক');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD_CONFIRM',63,'নতুন পাসওয়ার্ড অনুস্মারক নিশ্চিত করুন');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','NEW_PASSWORD',63,'নতুন পাসওয়ার্ড');
INSERT INTO app_portfolio.app_object_item_translation (app_object_item_app_object_app_id, app_object_item_app_object_object_name, app_object_item_object_item_name, language_id, text) VALUES (0,'APP','CONFIRM_QUESTION',63,'তুমি কি নিশ্চিত?');
--
-- setting_translation
--
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND data='A4'),63,'A4 (210 x 297 মিমি) প্রতিকৃতি');
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'PAPER_SIZE' and app_setting_type_app_id = 0 AND data='Letter'),63,'চিঠি (8.5in x 11 in) পোর্ট্রেট');

INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND data='GREGORIAN'),63,'গ্রেগরিয়ান');
INSERT INTO app_portfolio.app_setting_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM app_portfolio.app_setting WHERE app_setting_type_app_setting_type_name = 'CALENDAR_TYPE' and app_setting_type_app_id = 0 AND data='HIJRI'),63,'হিজরি');
--
-- message_translation
--
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20100',63,'ব্যবহারকারীর নাম 5 - 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20101',63,'বৈধ ব্যবহারকারীর নাম নয়');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20102',63,'বায়ো সর্বোচ্চ 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20103',63,'ইমেল সর্বাধিক 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20104',63,'অনুস্মারক সর্বাধিক 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20105',63,'বৈধ ইমেইল নয়');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20106',63,'পাসওয়ার্ড 10 - 100 অক্ষর');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20107',63,'ব্যবহারকারীর নাম, পাসওয়ার্ড এবং ইমেল প্রয়োজন');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20200',63,'ইমেল টি ইতিমধ্যেটই আছে');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20201',63,'প্রদানকারী ইতিমধ্যেই বিদ্যমান');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20203',63,'ব্যবহারকারীর নাম ইতিমধ্যে বিদ্যমান');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20204',63,'অনেক লম্বা মান');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20300',63,'ব্যবহারকারীর নাম বা পাসওয়ার্ড পাওয়া যায়নি');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20301',63,'পাসওয়ার্ড একই নয়');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20303',63,'অনুগ্রহ করে ব্যবহারকারীর নাম লিখুন');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20304',63,'পাসওয়ার্ড লিখুন');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20305',63,'ব্যবহারকারী খুঁজে পাওয়া যায় না');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20306',63,'কোড বৈধ নয়');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20307',63,'ফাইলের ধরন অনুমোদিত নয়');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20308',63,'ফাইলের আকার খুব বড়');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20309',63,'পাঠ্য বৈধ নয়');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20310',63,'টেক্সট অনেক লম্বা');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20400',63,'রেকর্ড পাওয়া যায়নি');
INSERT INTO app_portfolio.message_translation (app_message_app_id, app_message_code, language_id, text) VALUES (0,'20401',63,'অবৈধ পাসওয়ার্ড');