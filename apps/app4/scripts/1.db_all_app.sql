--
-- app
--
INSERT INTO <DB_SCHEMA/>.app (id) VALUES (<APP_ID/>);
--
-- setting_type
--
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_BASIC_DAY', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_BASIC_MONTH', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_BASIC_YEAR', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_PREMIUM_DAY', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_PREMIUM_MONTH', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('REPORT_THEME_PREMIUM_YEAR', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('PLACE', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('HIGHLIGHT_ROW', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('METHOD_ASR', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('HIGH_LATITUDE_ADJUSTMENT', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('TIMEFORMAT', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('HIJRI_DATE_ADJUSTMENT', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('IQAMAT', <APP_ID/>);
INSERT INTO <DB_SCHEMA/>.app_setting_type (app_setting_type_name, app_id) VALUES ('FAST_START_END', <APP_ID/>);
--
-- app setting with display data only
--
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10001','Blue gold 1',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10002','Blue gold 2',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10003','Blue 1',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10004','Blue 2',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10005','Blue light background 1',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10006','Blue light background 1',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10007','Blue light 1',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10008','Blue light 2',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10009','Blue simple',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_DAY','10010','Simple',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20001','Blue gold no highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20002','Blue gold row highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20003','Blue gold column highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20004','Blue gold no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20005','Blue no highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20006','Blue row highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20007','Blue column highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20008','Blue no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20009','Blue light background no highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20010','Blue light background row highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20011','Blue light background column highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20012','Blue light background no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20013','Blue light no highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20014','Blue light row highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20015','Blue light column highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20016','Blue light no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20017','Blue light simple no highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20018','Blue light simple row highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20019','Blue light simple column highlight',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20020','Blue light simple no highlight + extra first',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20021','Blue simple',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_MONTH','20022','Simple',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_BASIC_YEAR','30001','Simple',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_PREMIUM_MONTH','20030','Pink with Cinzel Decorative',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'REPORT_THEME_PREMIUM_MONTH','20031','Blue gold with Caveat and Montserrat',NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'PLACE','40002','Kaaba, Masjid al-Haram, Makkah','+21.4225','+39.8262','Asia/Riyadh','🕌');
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'PLACE','40003','Al-Masjid an-Nabawi, Medina','+24.469','+39.611','Asia/Riyadh','🕌');
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'PLACE','40004','Al-Aqsa, Jerusalem','+31.7765','+35.2356','Asia/Jerusalem','🕌');

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIJRI_DATE_ADJUSTMENT','2','2+',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIJRI_DATE_ADJUSTMENT','1','1+',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIJRI_DATE_ADJUSTMENT','0','0',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIJRI_DATE_ADJUSTMENT','-1','-1',NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIJRI_DATE_ADJUSTMENT','-2','-2',NULL,NULL,NULL,NULL);
--
-- app setting with translation
--
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGHLIGHT_ROW','0',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGHLIGHT_ROW','1',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGHLIGHT_ROW','2',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGHLIGHT_ROW','3',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGHLIGHT_ROW','4',NULL,NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'METHOD_ASR','Standard',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'METHOD_ASR','Hanafi',NULL,NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGH_LATITUDE_ADJUSTMENT','NightMiddle',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGH_LATITUDE_ADJUSTMENT','AngleBased',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGH_LATITUDE_ADJUSTMENT','OneSeventh',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'HIGH_LATITUDE_ADJUSTMENT','None',NULL,NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TIMEFORMAT','12hNS',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TIMEFORMAT','24h',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'TIMEFORMAT','12h',NULL,NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','0',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','1',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','2',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','3',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','4',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','5',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','6',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','7',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'IQAMAT','8',NULL,NULL,NULL,NULL,NULL);

INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'FAST_START_END','0',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'FAST_START_END','1',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'FAST_START_END','2',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'FAST_START_END','3',NULL,NULL,NULL,NULL,NULL);
INSERT INTO <DB_SCHEMA/>.app_setting (app_setting_type_app_id, app_setting_type_app_setting_type_name, value, display_data, data2, data3, data4, data5) VALUES (<APP_ID/>,'FAST_START_END','4',NULL,NULL,NULL,NULL,NULL);