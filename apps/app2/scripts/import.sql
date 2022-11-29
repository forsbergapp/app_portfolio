--
-- app2_group_place
--
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (1,'Africa','🌍',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (2,'America','🌎',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (3,'Antarctic','🇦🇶',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (4,'Asia','🌏',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (5,'Australia/Oceania','🌏',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (6,'Churches','⛪️',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (7,'Europe','🌍',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (8,'Mandir','🛕',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (9,'Mosques','🕌',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (10,'Mystery places','👽',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (11,'Popular places','🤩',NULL);
INSERT INTO app_portfolio.app2_group_place (id, group_name, icon_emoji, icon_url) VALUES (12,'Synagogue','🕍',NULL);

--
-- Dumping data for table app2_place
--
INSERT INTO app_portfolio.app2_place (id, title, latitude, longitude, timezone, country1_id, country2_id, group_place1_id, group_place2_id) VALUES (40002,'Kaaba, Masjid al-Haram, Makkah','+21.4225','+39.8262','Asia/Riyadh',438,NULL,9,4);
INSERT INTO app_portfolio.app2_place (id, title, latitude, longitude, timezone, country1_id, country2_id, group_place1_id, group_place2_id) VALUES (40003,'Al-Masjid an-Nabawi, Medina','+24.469','+39.611','Asia/Riyadh',438,NULL,9,4);
INSERT INTO app_portfolio.app2_place (id, title, latitude, longitude, timezone, country1_id, country2_id, group_place1_id, group_place2_id) VALUES (40004,'Al-Aqsa, Jerusalem','+31.7765','+35.2356','Asia/Jerusalem',420,360,9,4);
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
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10001,'Blue','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10002,'Green','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (10003,'Green Gold','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20001,'Blue vertical','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20002,'White with lines','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20003,'Green Gold','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20004,'Naive','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20005,'Green vertical','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20006,'White','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20007,'Beige vertical','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20008,'Lady','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20009,'Light blue','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20010,'Orange blue','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20011,'Orange grey','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20012,'Light blue simple','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20013,'Gradient grey','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20014,'Red grey','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (20015,'Beige horizontal','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2,1);
INSERT INTO app_portfolio.app2_theme (id, title, author, author_url, premium, image_preview, image_preview_url, image_header, image_header_url, image_footer, image_footer_url, image_background, image_background_url, app2_theme_type_id, app2_theme_category_id) VALUES (30001,'White','GF','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,3,1);