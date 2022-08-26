--Oracle, uncomment:
--SET DEFINE OFF;
--
-- Dumping data for table app2_setting_type
--
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (1,'PAPER_SIZE');
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (2,'HIGHLIGHT_ROW');
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (3,'METHOD');
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (4,'METHOD_ASR');
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (5,'HIGH_LATITUDE_ADJUSTMENT');
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (6,'TIMEFORMAT');
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (7,'HIJRI_DATE_ADJUSTMENT');
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (8,'IQAMAT');
INSERT INTO app_portfolio.app2_setting_type (id, setting_type_name) VALUES (9,'FAST_START_END');
--
-- Dumping data for table app2_setting
--
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (1,'A4 (210 x 297 mm) portrait','A4',NULL,NULL,NULL,NULL,1);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (2,'Letter (8.5in x 11 in) portrait','Letter',NULL,NULL,NULL,NULL,1);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (3,'None','0',NULL,NULL,NULL,NULL,2);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (4,'Friday','1',NULL,NULL,NULL,NULL,2);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (5,'Saturday','2',NULL,NULL,NULL,NULL,2);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (6,'Sunday','3',NULL,NULL,NULL,NULL,2);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (7,'10 day groups','4',NULL,NULL,NULL,NULL,2);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (8,'Algerian Ministry of Religious Affairs and Wakfs','ALGERIAN','18','17',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (9,'Diyanet İşleri Başkanlığı','DIYANET','18','17',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (10,'Egyptian General Authority of Survey','EGYPT','19.5','17.5',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (11,'Egyptian General Authority of Survey Bis','EGYPTBIS','20','18',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (12,'French15','FRANCE15','15','15',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (13,'French18','FRANCE18','18','18',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (14,'Gulf region','GULF','19.5','90 min',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (15,'University of Islamic Sciences, Karachi','KARACHI','18','18',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (16,'Kementerian Agama Republik Indonesia','KEMENAG','20','18',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (17,'Islamic Society of North America (ISNA)','ISNA','15','15',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (18,'Shia Ithna-Ashari, Leva Institute, Qum','JAFARI','16','14','4','Jafari',3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (19,'Jabatan Kemajuan Islam Malaysia','JAKIM','20','18',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (20,'Umm Al-Qura University, Makkah','MAKKAH','18.5','90 min',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (21,'Majlis Ugama Islam Singapura','MUIS','20','18',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (22,'Muslim World League','MWL','18','17',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (23,'Tunisian Ministry of Religious Affairs','TUNISIA','18','18',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (24,'Institute of Geophysics, University of Tehran','TEHRAN','17.7','4','4.5','Jafari',3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (25,'Union des Organisations Islamiques de France','UOIF','12','12',NULL,NULL,3);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (26,'Standard','STANDARD',NULL,NULL,NULL,NULL,4);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (27,'Hanafi','HANAFI',NULL,NULL,NULL,NULL,4);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (28,'Middle of night','NightMiddle',NULL,NULL,NULL,NULL,5);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (29,'Angle/60th of night (recommended)','AngleBased',NULL,NULL,NULL,NULL,5);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (30,'1/7th of night','OneSeventh',NULL,NULL,NULL,NULL,5);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (31,'No adjustment','None',NULL,NULL,NULL,NULL,5);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (32,'12h with no suffix','12hNS',NULL,NULL,NULL,NULL,6);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (33,'24h','24h',NULL,NULL,NULL,NULL,6);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (34,'12h with suffix','12h',NULL,NULL,NULL,NULL,6);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (35,'2+','2',NULL,NULL,NULL,NULL,7);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (36,'1+','1',NULL,NULL,NULL,NULL,7);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (37,'0','0',NULL,NULL,NULL,NULL,7);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (38,'-1','-1',NULL,NULL,NULL,NULL,7);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (39,'-2','-2',NULL,NULL,NULL,NULL,7);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (40,'None','0',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (41,'10 min','1',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (42,'15 min','2',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (43,'20 min','3',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (44,'25 min','4',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (45,'30 min','5',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (46,'Next hour','6',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (47,'Next hour + 15 min','7',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (48,'Next hour + 30 min','8',NULL,NULL,NULL,NULL,8);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (49,'No','0',NULL,NULL,NULL,NULL,9);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (50,'Fajr & Mahgrib','1',NULL,NULL,NULL,NULL,9);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (51,'Imsak & Mahgrib','2',NULL,NULL,NULL,NULL,9);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (52,'Fajr & Isha','3',NULL,NULL,NULL,NULL,9);
INSERT INTO app_portfolio.app2_setting (id, description, data, data2, data3, data4, data5, app2_setting_type_id) VALUES (53,'Imsak & Isha','4',NULL,NULL,NULL,NULL,9);

--
-- Dumping data for table app2_theme_category
--
INSERT INTO app_portfolio.app2_theme_category (id, title) VALUES (1,'Basic');
--
-- Dumping data for table app2_theme_type
--
INSERT INTO app_portfolio.app2_theme_type (id, title) VALUES (1,'DAY');
INSERT INTO app_portfolio.app2_theme_type (id, title) VALUES (2,'MONTH');
INSERT INTO app_portfolio.app2_theme_type (id, title) VALUES (3,'YEAR');
--
-- Dumping data for table app2_theme
--
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10001,'Blue','GF','',NULL,NULL,'/app2/css/images/theme_day_10001.jpg',NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10002,'Green','GF','',NULL,NULL,'/app2/css/images/theme_day_10002.jpg',NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10003,'Green Gold','GF','',NULL,NULL,'/app2/css/images/theme_day_10003.jpg',NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20001,'White','GF','',NULL,NULL,'/app2/css/images/theme_month_20001.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20002,'White with lines','GF','',NULL,NULL,'/app2/css/images/theme_month_20002.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20003,'Green Gold','GF','',NULL,NULL,'/app2/css/images/theme_month_20003.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20004,'Naive','GF','',NULL,NULL,'/app2/css/images/theme_month_20004.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20005,'Green vertical','GF','',NULL,NULL,'/app2/css/images/theme_month_20005.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20006,'Blue vertical','GF','',NULL,NULL,'/app2/css/images/theme_month_20006.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20007,'Beige vertical','GF','',NULL,NULL,'/app2/css/images/theme_month_20007.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20008,'Lady','GF','',NULL,NULL,'/app2/css/images/theme_month_20008.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20009,'Light blue','GF','',NULL,NULL,'/app2/css/images/theme_month_20009.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20010,'Orange blue','GF','',NULL,NULL,'/app2/css/images/theme_month_20010.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20011,'Orange grey','GF','',NULL,NULL,'/app2/css/images/theme_month_20011.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20012,'Light blue simple','GF','',NULL,NULL,'/app2/css/images/theme_month_20012.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20013,'Gradient grey','GF','',NULL,NULL,'/app2/css/images/theme_month_20013.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20014,'Red grey','GF','',NULL,NULL,'/app2/css/images/theme_month_20014.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20015,'Beige horizontal','GF','',NULL,NULL,'/app2/css/images/theme_month_20015.jpg',NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (30001,'White','GF','',NULL,NULL,'/app2/css/images/theme_year_30001.jpg',NULL,NULL,NULL,NULL,NULL,NULL,3,1);