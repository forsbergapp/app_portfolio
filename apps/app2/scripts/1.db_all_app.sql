--
-- app
--
INSERT INTO app_portfolio.app (id, enabled, app_category_id) VALUES (2, 1, 6);
--
-- setting_type
--
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('APP_THEME', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_BASIC_DAY', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_BASIC_MONTH', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_BASIC_YEAR', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_PREMIUM_DAY', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_PREMIUM_MONTH', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_PREMIUM_YEAR', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('PLACE', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('COLUMN_TITLE', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('HIGHLIGHT_ROW', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('METHOD', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('METHOD_ASR', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('HIGH_LATITUDE_ADJUSTMENT', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('TIMEFORMAT', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('HIJRI_DATE_ADJUSTMENT', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('IQAMAT', 2);
INSERT INTO app_portfolio.app_setting_type (app_setting_type_name, app_id) VALUES ('FAST_START_END', 2);
--
-- app setting with display data only
--
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'APP_THEME','1','Light',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'APP_THEME','2','Dark',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'APP_THEME','3','Caffè Latte',NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10001','Blue gold 1',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10002','Blue gold 2',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10003','Blue 1',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10004','Blue 2',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10005','Blue light background 1',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10006','Blue light background 1',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10007','Blue light 1',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10008','Blue light 2',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10009','Blue simple',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_DAY','10010','Simple',NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20001','Blue gold no highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20002','Blue gold row highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20003','Blue gold column highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20004','Blue gold no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20005','Blue no highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20006','Blue row highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20007','Blue column highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20008','Blue no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20009','Blue light background no highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20010','Blue light background row highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20011','Blue light background column highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20012','Blue light background no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20013','Blue light no highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20014','Blue light row highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20015','Blue light column highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20016','Blue light no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20017','Blue light simple no highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20018','Blue light simple row highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20019','Blue light simple column highlight',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20020','Blue light simple no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20021','Blue simple',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_MONTH','20022','Simple',NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_BASIC_YEAR','Simple','30001',NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_PREMIUM_MONTH','Pink with Cinzel Decorative','20030',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'REPORT_THEME_PREMIUM_MONTH','Blue gold with Caveat and Montserrat','20031',NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'PLACE','Kaaba, Masjid al-Haram, Makkah','40002','+21.4225','+39.8262','Asia/Riyadh','🕌');
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'PLACE','Al-Masjid an-Nabawi, Medina','40003','+24.469','+39.611','Asia/Riyadh','🕌');
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'PLACE','Al-Aqsa, Jerusalem','40004','+31.7765','+35.2356','Asia/Jerusalem','🕌');

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'COLUMN_TITLE','0','0',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'COLUMN_TITLE','1','1',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'COLUMN_TITLE','2','2',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'COLUMN_TITLE','3','3',NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','ALGERIAN','Algerian Ministry of Religious Affairs and Wakfs','18','17',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','DIYANET','Diyanet İşleri Başkanlığı','18','17',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','EGYPT','Egyptian General Authority of Survey','19.5','17.5',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','EGYPTBIS','Egyptian General Authority of Survey Bis','20','18',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','FRANCE15','French15','15','15',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','FRANCE18','French18','18','18',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','GULF','Gulf region','19.5','90 min',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','KARACHI','University of Islamic Sciences, Karachi','18','18',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','KEMENAG','Kementerian Agama Republik Indonesia','20','18',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','ISNA','Islamic Society of North America (ISNA)','15','15',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','JAFARI','Shia Ithna-Ashari, Leva Institute, Qum','16','14','4','Jafari');
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','JAKIM','Jabatan Kemajuan Islam Malaysia','20','18',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','MAKKAH','Umm Al-Qura University, Makkah','18.5','90 min',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','MUIS','Majlis Ugama Islam Singapura','20','18',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','MWL','Muslim World League','18','17',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','TUNISIA','Tunisian Ministry of Religious Affairs','18','18',NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','TEHRAN','Institute of Geophysics, University of Tehran','17.7','4','4.5','Jafari');
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD','UOIF','Union des Organisations Islamiques de France','12','12',NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIJRI_DATE_ADJUSTMENT','2','2+',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIJRI_DATE_ADJUSTMENT','1','1+',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIJRI_DATE_ADJUSTMENT','0','0',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIJRI_DATE_ADJUSTMENT','-1','-1',NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIJRI_DATE_ADJUSTMENT','-2','-2',NULL,NULL,NULL,NULL);
--
-- app setting with translation
--
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGHLIGHT_ROW','0',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGHLIGHT_ROW','1',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGHLIGHT_ROW','2',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGHLIGHT_ROW','3',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGHLIGHT_ROW','4',NULL,NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD_ASR','Standard',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'METHOD_ASR','Hanafi',NULL,NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGH_LATITUDE_ADJUSTMENT','NightMiddle',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGH_LATITUDE_ADJUSTMENT','AngleBased',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGH_LATITUDE_ADJUSTMENT','OneSeventh',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'HIGH_LATITUDE_ADJUSTMENT','None',NULL,NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'TIMEFORMAT','12hNS',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'TIMEFORMAT','24h',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'TIMEFORMAT','12h',NULL,NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','0',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','1',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','2',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','3',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','4',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','5',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','6',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','7',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'IQAMAT','8',NULL,NULL,NULL,NULL,NULL);

INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'FAST_START_END','0',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'FAST_START_END','1',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'FAST_START_END','2',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'FAST_START_END','3',NULL,NULL,NULL,NULL,NULL);
INSERT INTO app_portfolio.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (2,'FAST_START_END','4',NULL,NULL,NULL,NULL,NULL);
--
-- app_object
--
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (2,'REPORT');
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (2,'APP_LOV');
--
-- app_object_item
--
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_ASR','METHOD_ASR', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_CALENDARTYPE','CALENDAR_TYPE', 0);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_HIGHLATITUDE','HIGH_LATITUDE_ADJUSTMENT', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_POPULAR_PLACE',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_COLTITLE','COLUMN_TITLE', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_DIRECTION','DIRECTION', 0);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_HIGHLIGHT_ROW','HIGHLIGHT_ROW', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_ASR','IQAMAT', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_DHUHR','IQAMAT', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_FAJR','IQAMAT', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_ISHA','IQAMAT', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_MAGHRIB','IQAMAT', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_LOCALE_SECOND',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_PAPERSIZE','PAPER_SIZE', 0);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_SHOW_FAST_START_END','FAST_START_END', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'APP_LOV','SETTING_SELECT_TIMEFORMAT','TIMEFORMAT', 2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_ASR',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_ASR_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_CALTYPE_GREGORIAN',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_CALTYPE_HIJRI',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_DAY',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_DHUHR',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_DHUHR_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_FAJR',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_FAJR_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_IMSAK',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_ISHA',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_ISHA_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_MAGHRIB',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_MAGHRIB_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_MIDNIGHT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_NOTES',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_SUNRISE',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_SUNSET',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ASR',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ASR_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_DHUHR',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_DHUHR_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_FAJR',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_FAJR_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_IMSAK',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ISHA',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ISHA_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MAGHRIB',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MAGHRIB_IQAMAT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MIDNIGHT',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_SUNRISE',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_SUNSET',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_WEEKDAY',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','COLTITLE_WEEKDAY_TR',NULL, NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, app_setting_type_app_setting_type_name, app_setting_type_app_id) VALUES (2,'REPORT','TIMETABLE_TITLE',NULL, NULL);
--
-- app_message
--
INSERT INTO app_portfolio.app_message (app_id, code, message_level_id, message_type_id) VALUES (2, '20302', 1, 1);
--
-- app_parameter
--
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','APP_COPYRIGHT','{COPYRIGHT TEXT}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','APP_DEFAULT_STARTUP_PAGE','3','1=print, 2=day, 3=month, 4=year, 5=settings, 6=profile');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','APP_REPORT_TIMETABLE','TIMETABLE',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_EMAIL_DISCLAIMER','{EMAIL_DISCLAIMER}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_EMAIL_POLICY','{EMAIL_POLICY}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_EMAIL_TERMS','{EMAIL_TERMS}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_POLICY_NAME','Privacy Policy',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_POLICY_URL','/info/privacy_policy',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_DISCLAIMER_NAME','Disclaimer',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_DISCLAIMER_URL','/info/disclaimer',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_TERMS_NAME','Terms',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_TERMS_URL','/info/terms',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_ABOUT_NAME','About',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','INFO_LINK_ABOUT_URL','/info/about',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK1_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK1_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK2_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK2_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK3_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK3_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK4_ICON',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','INFO_SOCIAL_LINK4_URL',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_ARABIC_SCRIPT','font_arabic_sans','Arabic script:Sans');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE','islamic-civil','Calendar hijri type: islamic-civil');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDAR_LANG','en-us',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM','latn','ex "-nu-latn"');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDAR_TYPE_GREG','gregory','ex "-u-ca-gregory"');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_CALENDARTYPE','GREGORIAN','Calendar type: Gregorian');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_COLTITLE','1','Column title: transliterated, translation');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_DIRECTION','ltr','Direction:Left to right');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR','-ca-',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM','-nu-',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_LOCALE_EXT_PREFIX','-u',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','REGIONAL_DEFAULT_LOCALE_SECOND','0','Second languague:None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_DEFAULT_PLACE_ID','40002','Default place: Kabba, Makkah');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_CONTAINER','mapid',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_COLOR','#a49775',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_LAT','21.4226',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_LONG','39.8261',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_COLOR','#404040',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_LAT','30.3289',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_LONG','35.4423',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_OPACITY','0.4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_TEXT_SIZE','14','');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_TITLE','Petra, jordan','Qibbla old Great temple');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OLD_WIDTH','4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_OPACITY','1',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_TEXT_SIZE','14',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_TITLE','Kaaba, Makkah','Qibbla Kabba, Makkah');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','GPS_MODULE_LEAFLET_QIBBLA_WIDTH','4',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_HIGHLIGHT_ROW','1','highlight row: Friday');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_PAPERSIZE','A4','A4 paper');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_CALENDARTYPE','true','Column calendartype: true');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_GPS','false','Show GPS: false');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_NOTES','false','Show notes: false');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_TIMEZONE','false','Show timezone: false');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_SHOW_WEEKDAY','true','Show weekday: true');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_THEME_DAY','10001',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_THEME_MONTH','20001',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','DESIGN_DEFAULT_THEME_YEAR','30001',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTFOOTER1','بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTFOOTER2','In the name of God, the Almighty, the Merciful',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTFOOTER3','',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTTITLE1',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTTITLE2',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','TEXT_DEFAULT_REPORTTITLE3',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','IMAGE_HEADER_FOOTER_HEIGHT','160',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','IMAGE_HEADER_FOOTER_WIDTH','800',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','IMAGE_DEFAULT_REPORT_FOOTER_SRC',NULL,NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','IMAGE_DEFAULT_REPORT_HEADER_SRC','/app2/images/banner_default.webp',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_ASR','Standard','Asr method: Standard');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_HIGHLATITUDE','AngleBased','High latitude adj.: Angle/60th of night');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_HIJRI_ADJUSTMENT','0','Hijri date adjustment: 0');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_ASR','0','Asr Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR','0','Dhuhr Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_FAJR','0','Fajr Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_ISHA','0','Isha Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB','0','Maghrib Iqamat: None');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_METHOD','MWL','Method: Muslim World League (MWL)');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_SHOW_FAST_START_END','1','Fajr and Maghrib fasting info');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_SHOW_IMSAK','false','Column imsak: no');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_SHOW_MIDNIGHT','false','Column midnight: no');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_SHOW_SUNSET','false','Column sunset: no');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','PRAYER_DEFAULT_TIMEFORMAT','12hNS','Timeformat: 12h with no suffix');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_BACKGROUND_COLOR','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_COLOR_DARK','#2b2b32',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_COLOR_LIGHT','#ffffff',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_HEIGHT','128',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','MODULE_EASY.QRCODE_WIDTH','128',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'2','SERVICE_DB_APP_USER','app2',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'2','SERVICE_DB_APP_PASSWORD','<APP_PASSWORD/>',NULL);
--
-- app_device
--
INSERT INTO app_portfolio.app_device(app_id, device_id) VALUES(2, 1);

