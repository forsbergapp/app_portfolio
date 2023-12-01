--
-- app
--
INSERT INTO app_portfolio.app (id, enabled, app_category_id) VALUES (2, 1, 6);
--
-- setting_type
--
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (200, 'APP_THEME', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (201, 'REPORT_THEME_BASIC_DAY', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (202, 'REPORT_THEME_BASIC_MONTH', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (203, 'REPORT_THEME_BASIC_YEAR', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (204, 'REPORT_THEME_PREMIUM_DAY', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (205, 'REPORT_THEME_PREMIUM_MONTH', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (206, 'REPORT_THEME_PREMIUM_YEAR', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (207, 'PLACE', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (208, 'COLUMN_TITLE', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (209, 'HIGHLIGHT_ROW', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (210, 'METHOD', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (211, 'METHOD_ASR', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (212, 'HIGH_LATITUDE_ADJUSTMENT', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (213, 'TIMEFORMAT', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (214, 'HIJRI_DATE_ADJUSTMENT', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (215, 'IQAMAT', 2);
INSERT INTO app_portfolio.setting_type (id, setting_type_name, app_id) VALUES (216, 'FAST_START_END', 2);
--
-- setting
--
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Light','1',NULL,NULL,NULL,NULL,200);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Dark','2',NULL,NULL,NULL,NULL,200);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Caffè Latte','3',NULL,NULL,NULL,NULL,200);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue gold 1','10001',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue gold 2','10002',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue 1','10003',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue 2','10004',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light background 1','10005',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light background 1','10006',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light 1','10007',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light 2','10008',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue simple','10009',NULL,NULL,NULL,NULL,201);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Simple','10010',NULL,NULL,NULL,NULL,201);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue gold no highlight','20001',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue gold row highlight','20002',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue gold column highlight','20003',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue gold no highlight + extra first','20004',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue no highlight','20005',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue row highlight','20006',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue column highlight','20007',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue no highlight + extra first','20008',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light background no highlight','20009',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light background row highlight','20010',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light background column highlight','20011',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light background no highlight + extra first','20012',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light no highlight','20013',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light row highlight','20014',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light column highlight','20015',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light no highlight + extra first','20016',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light simple no highlight','20017',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light simple row highlight','20018',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light simple column highlight','20019',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue light simple no highlight + extra first','20020',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue simple','20021',NULL,NULL,NULL,NULL,202);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Simple','20022',NULL,NULL,NULL,NULL,202);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Simple','30001',NULL,NULL,NULL,NULL,203);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Pink with Cinzel Decorative','20030',NULL,NULL,NULL,NULL,205);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Blue gold with Caveat and Montserrat','20031',NULL,NULL,NULL,NULL,205);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Kaaba, Masjid al-Haram, Makkah','40002','+21.4225','+39.8262','Asia/Riyadh','🕌',207);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Al-Masjid an-Nabawi, Medina','40003','+24.469','+39.611','Asia/Riyadh','🕌',207);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Al-Aqsa, Jerusalem','40004','+31.7765','+35.2356','Asia/Jerusalem','🕌',207);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('0','0',NULL,NULL,NULL,NULL,208);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('1','1',NULL,NULL,NULL,NULL,208);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('2','2',NULL,NULL,NULL,NULL,208);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('3','3',NULL,NULL,NULL,NULL,208);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('None','0',NULL,NULL,NULL,NULL,209);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Friday','1',NULL,NULL,NULL,NULL,209);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Saturday','2',NULL,NULL,NULL,NULL,209);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Sunday','3',NULL,NULL,NULL,NULL,209);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('10 day groups','4',NULL,NULL,NULL,NULL,209);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Algerian Ministry of Religious Affairs and Wakfs','ALGERIAN','18','17',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Diyanet İşleri Başkanlığı','DIYANET','18','17',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Egyptian General Authority of Survey','EGYPT','19.5','17.5',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Egyptian General Authority of Survey Bis','EGYPTBIS','20','18',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('French15','FRANCE15','15','15',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('French18','FRANCE18','18','18',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Gulf region','GULF','19.5','90 min',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('University of Islamic Sciences, Karachi','KARACHI','18','18',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Kementerian Agama Republik Indonesia','KEMENAG','20','18',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Islamic Society of North America (ISNA)','ISNA','15','15',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Shia Ithna-Ashari, Leva Institute, Qum','JAFARI','16','14','4','Jafari',210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Jabatan Kemajuan Islam Malaysia','JAKIM','20','18',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Umm Al-Qura University, Makkah','MAKKAH','18.5','90 min',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Majlis Ugama Islam Singapura','MUIS','20','18',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Muslim World League','MWL','18','17',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Tunisian Ministry of Religious Affairs','TUNISIA','18','18',NULL,NULL,210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Institute of Geophysics, University of Tehran','TEHRAN','17.7','4','4.5','Jafari',210);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Union des Organisations Islamiques de France','UOIF','12','12',NULL,NULL,210);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Standard','Standard',NULL,NULL,NULL,NULL,211);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Hanafi','Hanafi',NULL,NULL,NULL,NULL,211);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Middle of night','NightMiddle',NULL,NULL,NULL,NULL,212);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Angle/60th of night (recommended)','AngleBased',NULL,NULL,NULL,NULL,212);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('1/7th of night','OneSeventh',NULL,NULL,NULL,NULL,212);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('No adjustment','None',NULL,NULL,NULL,NULL,212);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('12h with no suffix','12hNS',NULL,NULL,NULL,NULL,213);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('24h','24h',NULL,NULL,NULL,NULL,213);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('12h with suffix','12h',NULL,NULL,NULL,NULL,213);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('2+','2',NULL,NULL,NULL,NULL,214);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('1+','1',NULL,NULL,NULL,NULL,214);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('0','0',NULL,NULL,NULL,NULL,214);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('-1','-1',NULL,NULL,NULL,NULL,214);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('-2','-2',NULL,NULL,NULL,NULL,214);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('None','0',NULL,NULL,NULL,NULL,215);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('10 min','1',NULL,NULL,NULL,NULL,215);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('15 min','2',NULL,NULL,NULL,NULL,215);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('20 min','3',NULL,NULL,NULL,NULL,215);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('25 min','4',NULL,NULL,NULL,NULL,215);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('30 min','5',NULL,NULL,NULL,NULL,215);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Next hour','6',NULL,NULL,NULL,NULL,215);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Next hour + 15 min','7',NULL,NULL,NULL,NULL,215);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Next hour + 30 min','8',NULL,NULL,NULL,NULL,215);

INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('No','0',NULL,NULL,NULL,NULL,216);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Fajr & Mahgrib','1',NULL,NULL,NULL,NULL,216);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Imsak & Mahgrib','2',NULL,NULL,NULL,NULL,216);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Fajr & Isha','3',NULL,NULL,NULL,NULL,216);
INSERT INTO app_portfolio.setting (description, data, data2, data3, data4, data5, setting_type_id) VALUES ('Imsak & Isha','4',NULL,NULL,NULL,NULL,216);
--
-- app_object
--
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (2,'APP_DESCRIPTION');
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (2,'REPORT');
INSERT INTO app_portfolio.app_object (app_id, object_name) VALUES (2,'APP_LOV');
--
-- app_object_item
--
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_ASR',211);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_CALENDARTYPE',7);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_HIGHLATITUDE',212);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_POPULAR_PLACE',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_COLTITLE',208);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_DIRECTION',5);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_HIGHLIGHT_ROW',209);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_ASR',215);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_DHUHR',215);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_FAJR',215);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_ISHA',215);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_IQAMAT_TITLE_MAGHRIB',215);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_LOCALE_SECOND',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_PAPERSIZE',2);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_REPORT_SHOW_FAST_START_END',216);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'APP_LOV','SETTING_SELECT_TIMEFORMAT',213);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_ASR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_ASR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_CALTYPE_GREGORIAN',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_CALTYPE_HIJRI',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_DAY',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_DHUHR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_DHUHR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_FAJR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_FAJR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_IMSAK',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_ISHA',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_ISHA_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_MAGHRIB',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_MAGHRIB_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_MIDNIGHT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_NOTES',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_SUNRISE',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_SUNSET',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ASR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ASR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_DHUHR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_DHUHR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_FAJR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_FAJR_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_IMSAK',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ISHA',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_ISHA_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MAGHRIB',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MAGHRIB_IQAMAT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_MIDNIGHT',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_SUNRISE',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_TRANSLITERATION_SUNSET',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_WEEKDAY',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','COLTITLE_WEEKDAY_TR',NULL);
INSERT INTO app_portfolio.app_object_item (app_object_app_id, app_object_object_name, object_item_name, setting_type_id) VALUES (2,'REPORT','TIMETABLE_TITLE',NULL);
--
-- app_message
--
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20302',2);
INSERT INTO app_portfolio.app_message (message_code, app_id) VALUES ('20400',2);
--
-- app_parameter
--
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'1','APP_COPYRIGHT','{COPYRIGHT TEXT}',NULL);
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','APP_DEFAULT_STARTUP_PAGE','3','1=print, 2=day, 3=month, 4=year, 5=settings, 6=profile');
INSERT INTO app_portfolio.app_parameter (app_id, parameter_type_id, parameter_name, parameter_value, parameter_comment) VALUES (2,'0','APP_REPORT_TIMETABLE','timetable.html',NULL);
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

