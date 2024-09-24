--
-- app_translation app
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_id, language_id, json_data) VALUES (<APP_ID/>,147,'{"name":"Timetables"}');
--
-- app_translation app_setting
--
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'COLUMN_TITLE' and app_setting_type_app_id = 2 AND value='0'),147,'Transliteration');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'COLUMN_TITLE' and app_setting_type_app_id = 2 AND value='1'),147,'Transliteration, translation');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'COLUMN_TITLE' and app_setting_type_app_id = 2 AND value='2'),147,'Translation, transliteration');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'COLUMN_TITLE' and app_setting_type_app_id = 2 AND value='3'),147,'Translation');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGHLIGHT_ROW' and app_setting_type_app_id = 2 AND value='0'),147,'None');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGHLIGHT_ROW' and app_setting_type_app_id = 2 AND value='1'),147,'Friday');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGHLIGHT_ROW' and app_setting_type_app_id = 2 AND value='2'),147,'Saturday');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGHLIGHT_ROW' and app_setting_type_app_id = 2 AND value='3'),147,'Sunday');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGHLIGHT_ROW' and app_setting_type_app_id = 2 AND value='4'),147,'10 days groups');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'METHOD_ASR' and app_setting_type_app_id = 2 AND value='Standard'),147,'Standard');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'METHOD_ASR' and app_setting_type_app_id = 2 AND value='Hanafi'),147,'Hanafi');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGH_LATITUDE_ADJUSTMENT' and app_setting_type_app_id = 2 AND value='NightMiddle'),147,'Middle of night');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGH_LATITUDE_ADJUSTMENT' and app_setting_type_app_id = 2 AND value='AngleBased'),147,'Angle/60th of night (recommended)');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGH_LATITUDE_ADJUSTMENT' and app_setting_type_app_id = 2 AND value='OneSeventh'),147,'1/7th of night');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'HIGH_LATITUDE_ADJUSTMENT' and app_setting_type_app_id = 2 AND value='None'),147,'No adjustment');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'TIMEFORMAT' and app_setting_type_app_id = 2 AND value='12hNS'),147,'12-hour without suffix');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'TIMEFORMAT' and app_setting_type_app_id = 2 AND value='24h'),147,'24-hour');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'TIMEFORMAT' and app_setting_type_app_id = 2 AND value='12h'),147,'12-hour with suffix');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='0'),147,'None');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='1'),147,'10 minutes');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='2'),147,'15 minutes');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='3'),147,'20 minutes');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='4'),147,'25 minutes');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='5'),147,'30 minutes');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='6'),147,'Next hour');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='7'),147,'Next hour + 15 minutes');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'IQAMAT' and app_setting_type_app_id = 2 AND value='8'),147,'Next hour + 30 minutes');

INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'FAST_START_END' and app_setting_type_app_id = 2 AND value='0'),147,'No');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'FAST_START_END' and app_setting_type_app_id = 2 AND value='1'),147,'Fajr & Mahgrib');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'FAST_START_END' and app_setting_type_app_id = 2 AND value='2'),147,'Imsak & Mahgrib');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'FAST_START_END' and app_setting_type_app_id = 2 AND value='3'),147,'Fajr & Isha');
INSERT INTO <DB_SCHEMA/>.app_translation (app_setting_id, language_id, text) VALUES ((SELECT id FROM <DB_SCHEMA/>.app_setting WHERE app_setting_type_app_setting_type_name = 'FAST_START_END' and app_setting_type_app_id = 2 AND value='4'),147,'Imsak & Isha');