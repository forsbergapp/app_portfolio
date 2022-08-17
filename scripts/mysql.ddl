CREATE DATABASE app_portfolio
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_0900_ai_ci;

CREATE ROLE role_app_admin;
CREATE ROLE role_app_dba;
CREATE ROLE role_app1;
CREATE ROLE role_app3;
CREATE ROLE role_app2;

CREATE USER app_admin IDENTIFIED BY 'APP_1_portfolio'
    ACCOUNT UNLOCK;
GRANT role_app_admin TO app_admin;
SET DEFAULT ROLE ALL TO app_admin;

CREATE USER app0 IDENTIFIED BY 'APP_1_portfolio'
    ACCOUNT UNLOCK;
GRANT role_app1 TO app0;
SET DEFAULT ROLE ALL TO app0;

CREATE USER app_portfolio IDENTIFIED BY 'APP_1_portfolio'
    ACCOUNT UNLOCK;
GRANT role_app_dba TO app_portfolio;
SET DEFAULT ROLE ALL TO app_portfolio;

CREATE USER app1 IDENTIFIED BY 'APP_1_portfolio'
    ACCOUNT UNLOCK;
GRANT role_app2 TO app1;
SET DEFAULT ROLE ALL TO app1;

CREATE USER app2 IDENTIFIED BY 'APP_1_portfolio'
    ACCOUNT UNLOCK;
GRANT role_app3 TO app2;
SET DEFAULT ROLE ALL TO app2;

CREATE TABLE app_portfolio.app (
    id        INTEGER NOT NULL,
    app_name  VARCHAR(100) NOT NULL,
    url       VARCHAR(100),
    logo      VARCHAR(100),
    enabled   INTEGER NOT NULL,
    app_category_id INTEGER,
	CONSTRAINT app_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.app TO role_app1;

GRANT SELECT ON app_portfolio.app TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app TO role_app_dba;

GRANT SELECT ON app_portfolio.app TO role_app2;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app TO role_app_admin;

CREATE TABLE app_portfolio.app_category (
    id            INT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    CONSTRAINT app_category_pk PRIMARY KEY ( id );
);

GRANT SELECT ON app_portfolio.app_category TO role_app1;

GRANT SELECT ON app_portfolio.app_category TO role_app2;

GRANT SELECT ON app_portfolio.app_category TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_category TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.app_category TO role_app_dba;

CREATE TABLE app_category_translation (
    app_category_id INTEGER NOT NULL,
    language_id     INTEGER NOT NULL,
    text            VARCHAR(1000) NOT NULL,
    CONSTRAINT app_category_translation_pk PRIMARY KEY ( app_category_id,
                                                         language_id )
);

GRANT SELECT ON app_category_translation TO role_app1;

GRANT SELECT ON app_category_translation TO role_app2;

GRANT SELECT ON app_category_translation TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_category_translation TO role_app_admin;

GRANT ALL PRIVILEGES ON app_category_translation TO role_app_dba;

CREATE TABLE app_portfolio.app_device (
    app_id    INTEGER NOT NULL,
    device_id INTEGER NOT NULL,
    CONSTRAINT app_device_pk PRIMARY KEY ( app_id,
                                           device_id )
);

GRANT SELECT ON app_portfolio.app_device TO role_app1;

GRANT SELECT ON app_portfolio.app_device TO role_app2;

GRANT SELECT ON app_portfolio.app_device TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_device TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.app_device TO role_app_dba;

CREATE TABLE app_portfolio.app_log (
    id                           INT NOT NULL AUTO_INCREMENT,
    app_module                   VARCHAR(100),
    app_module_type              VARCHAR(100),
    app_module_request           VARCHAR(500),
    app_module_result            VARCHAR(4000),
    app_user_id                  VARCHAR(100),
    user_language                VARCHAR(100),
    user_timezone                VARCHAR(100),
    user_number_system           VARCHAR(100),
    user_platform                VARCHAR(100),
    client_latitude              VARCHAR(100),
    client_longitude             VARCHAR(100),
    server_remote_addr           VARCHAR(100),
    server_user_agent            VARCHAR(500),
    server_http_host             VARCHAR(100),
    server_http_accept_language  VARCHAR(100),
    date_created                 DATETIME,
	app_id                       INTEGER NOT NULL,
	CONSTRAINT app_log_pk PRIMARY KEY ( id )
);

ALTER TABLE app_portfolio.app_log MODIFY COLUMN app_module VARCHAR(100) COMMENT
    'AUTH
BROADCAST
FORMS
GEOLOCATION
MAIL
REPORT
WORLDCITIES';

ALTER TABLE app_portfolio.app_log MODIFY COLUMN app_module_type VARCHAR(100) COMMENT
    'AUTH
	DATATOKEN_OK
	DATATOKEN_FAIL
	ACCESSTOKEN
	ADMINTOKEN_OK
	ADMINTOKEN_FAIL
BROADCAST
	CONNECT
FORMS
	APP
	ADMIN
	ADMIN_SECURE
	MAINTENANCE
GEOLOCATION
	IP
	PLACE
MAI
	READ
	SEND
REPORT
	HTML
	PDF
WORLDCITIES
	CITIES';

ALTER TABLE app_portfolio.app_log MODIFY COLUMN app_module_request VARCHAR(100) COMMENT
    'MAIL%: 		emailaddress
GEOLOCATION%: 	url
REPORT%: 		url
WORLDCITIES%:	countrycode';

ALTER TABLE app_portfolio.app_log MODIFY COLUMN app_module_result VARCHAR(100) COMMENT
    'AUTH
ADMINTOKEN_OK	AT: token
ADMINTOKEN_FAIL	error message
DATATOKEN_OK	DT: token
DATATOKEN_FAIL	error message
ACCESSTOKEN_OK	AT: token

FORMS
APP			geolocation place
ADMIN			geolocation place
ADMIN_SECURE		geolocation place
MAINTENANCE		geolocation place

GEOLOCATION
IP			geodata
PLACE			geodata

MAIL
			result or error message
';

ALTER TABLE app_portfolio.app_log MODIFY COLUMN user_language VARCHAR(100) COMMENT
    'navigator.language';

ALTER TABLE app_portfolio.app_log MODIFY COLUMN user_timezone VARCHAR(100) COMMENT
    'Intl.DateTimeFormat().resolvedOptions().timeZone;';

ALTER TABLE app_portfolio.app_log MODIFY COLUMN user_number_system VARCHAR(100) COMMENT
    'Intl.NumberFormat().resolvedOptions().numberingSystem';

ALTER TABLE app_portfolio.app_log MODIFY COLUMN user_platform VARCHAR(100) COMMENT
    'navigator.platform';

CREATE INDEX app_log_date_created_index ON
    app_portfolio.app_log (
        date_created
    ASC );

GRANT SELECT, INSERT ON app_portfolio.app_log TO role_app1;

GRANT SELECT, INSERT ON app_portfolio.app_log TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_log TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.app_log TO role_app2;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_log TO role_app_admin;

CREATE TABLE app_portfolio.app_message (
    message_code      VARCHAR(100) NOT NULL,
    app_id            INTEGER NOT NULL,
	CONSTRAINT app_message_pk PRIMARY KEY ( message_code,
                                            app_id )
);

GRANT SELECT ON app_portfolio.app_message TO role_app1;

GRANT SELECT ON app_portfolio.app_message TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_message TO role_app_dba;

GRANT SELECT ON app_portfolio.app_message TO role_app2;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_message TO role_app_admin;

CREATE TABLE app_portfolio.app_object (
    app_id       INTEGER NOT NULL,
    object_name  VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_pk PRIMARY KEY ( object_name,
                                           app_id )
);

GRANT SELECT ON app_portfolio.app_object TO role_app1;

GRANT SELECT ON app_portfolio.app_object TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_object TO role_app_dba;

GRANT SELECT ON app_portfolio.app_object TO role_app2;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object TO role_app_admin;


CREATE TABLE app_portfolio.app_object_item (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_item_pk PRIMARY KEY ( object_name,
	                                                    app_id,
	                                                    object_item_name )
);

GRANT SELECT ON app_portfolio.app_object_item TO role_app1;

GRANT SELECT ON app_portfolio.app_object_item TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_object_item TO role_app_dba;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object_item TO role_app_admin;

GRANT SELECT ON app_portfolio.app_object_item TO role_app2;

CREATE TABLE app_portfolio.app_object_item_subitem (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
    subitem_name      VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_item_subitem_pk PRIMARY KEY ( subitem_name,
	                                                            object_item_name,
	                                                            object_name,
	                                                            app_id )
);
GRANT SELECT ON app_portfolio.app_object_item_subitem TO role_app1;

GRANT SELECT ON app_portfolio.app_object_item_subitem TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_object_item_subitem TO role_app_dba;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object_item_subitem TO role_app_admin;

GRANT SELECT ON app_portfolio.app_object_item_subitem TO role_app2;


CREATE TABLE app_portfolio.app_object_item_subitem_fixed (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
    subitem_name      VARCHAR(100) NOT NULL,
    subitem_text      VARCHAR(2000) NOT NULL,
	CONSTRAINT app_object_item_subitem_fixed_pk PRIMARY KEY ( subitem_name,
	                                                                  object_item_name,
	                                                                  object_name,
	                                                                  app_id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object_item_subitem_fixed TO role_app_admin;

GRANT SELECT ON app_portfolio.app_object_item_subitem_fixed TO role_app1;

GRANT SELECT ON app_portfolio.app_object_item_subitem_fixed TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_object_item_subitem_fixed TO role_app_dba;

GRANT SELECT ON app_portfolio.app_object_item_subitem_fixed TO role_app2;


CREATE TABLE app_portfolio.app_object_item_translation (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
    language_id       INTEGER NOT NULL,
    text              VARCHAR(2000) NOT NULL,
	CONSTRAINT app_object_item_translation_pk PRIMARY KEY ( language_id,
	                                                                object_item_name,
	                                                                object_name,
	                                                                app_id )
);
GRANT SELECT ON app_portfolio.app_object_item_translation TO role_app2;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object_item_translation TO role_app_admin;

GRANT SELECT ON app_portfolio.app_object_item_translation TO role_app1;

GRANT SELECT ON app_portfolio.app_object_item_translation TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_object_item_translation TO role_app_dba;


CREATE TABLE app_portfolio.app_object_subitem_translation (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
    subitem_name      VARCHAR(100) NOT NULL,
    language_id       INTEGER NOT NULL,
    text              VARCHAR(2000) NOT NULL,
	CONSTRAINT app_object_subitem_translation_pk PRIMARY KEY ( language_id,
	                                                                   subitem_name,
	                                                                   object_item_name,
	                                                                   object_name,
	                                                                   app_id )
);
GRANT SELECT ON app_portfolio.app_object_subitem_translation TO role_app2;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object_subitem_translation TO role_app_admin;

GRANT SELECT ON app_portfolio.app_object_subitem_translation TO role_app1;

GRANT SELECT ON app_portfolio.app_object_subitem_translation TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_object_subitem_translation TO role_app_dba;

CREATE TABLE app_portfolio.app_object_translation (
    app_id      INTEGER NOT NULL,
    object_name VARCHAR(100) NOT NULL,
    language_id INTEGER NOT NULL,
    text        VARCHAR(2000) NOT NULL,
    CONSTRAINT app_object_translation_pk PRIMARY KEY ( app_id,
                                                           object_name,
                                                           language_id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object_translation TO role_app_admin;

GRANT SELECT ON app_portfolio.app_object_translation TO role_app2;

GRANT SELECT ON app_portfolio.app_object_translation TO role_app1;

GRANT SELECT ON app_portfolio.app_object_translation TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_object_translation TO role_app_dba;

CREATE TABLE app_portfolio.app_parameter (
    app_id             INTEGER NOT NULL,
    parameter_type_id  VARCHAR(100) NOT NULL,
    parameter_name     VARCHAR(100) NOT NULL,
    parameter_value    VARCHAR(100),
    parameter_comment  VARCHAR(100),
	CONSTRAINT app_parameter_pk PRIMARY KEY ( app_id,
	                                                  parameter_name )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_parameter TO role_app_admin;

GRANT SELECT ON app_portfolio.app_parameter TO role_app2;

GRANT SELECT ON app_portfolio.app_parameter TO role_app1;

GRANT SELECT ON app_portfolio.app_parameter TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.app_parameter TO role_app_dba;

CREATE TABLE app_portfolio.app_screenshot (
    id                   INT NOT NULL AUTO_INCREMENT,
    app_device_app_id    INTEGER NOT NULL,
    app_device_device_id INTEGER NOT NULL,
    screenshot           BLOB NOT NULL,
    CONSTRAINT app_screenshot_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.app_screenshot TO role_app1;

GRANT SELECT ON app_portfolio.app_screenshot TO role_app2;

GRANT SELECT ON app_portfolio.app_screenshot TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_screenshot TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.app_screenshot TO role_app_dba;

CREATE TABLE app_portfolio.app2_group_place (
    id          INT NOT NULL AUTO_INCREMENT,
    group_name  VARCHAR(100) NOT NULL,
    icon_emoji  VARCHAR(10) NOT NULL,
    icon_url    VARCHAR(100),
	CONSTRAINT group_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_group_place TO role_app_admin;

GRANT SELECT ON app_portfolio.app2_group_place TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_group_place TO role_app_dba;

ALTER TABLE app_portfolio.app2_group_place ADD CONSTRAINT app2_group_place_group_name_un UNIQUE ( group_name );

CREATE TABLE app_portfolio.app2_place (
    id               INTEGER NOT NULL,
    title            VARCHAR(100) NOT NULL,
    latitude         VARCHAR(100),
    longitude        VARCHAR(100),
    timezone         VARCHAR(100),
    country1_id      INTEGER NOT NULL,
    country2_id      INTEGER,
    group_place1_id  INTEGER NOT NULL,
    group_place2_id  INTEGER NOT NULL,
	CONSTRAINT app2_place_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_place TO role_app_admin;

GRANT SELECT ON app_portfolio.app2_place TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_place TO role_app_dba;

CREATE TABLE app_portfolio.app2_theme (
    id                    INTEGER NOT NULL,
    title                 VARCHAR(100) NOT NULL,
    author                VARCHAR(100) NOT NULL,
    author_url            VARCHAR(100),
    premium               DECIMAL(1,0),
    image_preview         LONGBLOB,
    image_preview_url     VARCHAR(100),
    image_header          LONGBLOB,
    image_header_url      VARCHAR(100),
    image_footer          LONGBLOB,
    image_footer_url      VARCHAR(100),
    image_background      LONGBLOB,
    image_background_url  VARCHAR(100),
    app2_theme_type_id         INTEGER NOT NULL,
    app2_theme_category_id     INTEGER NOT NULL,
	CONSTRAINT app2_theme_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_theme TO role_app_admin;

GRANT SELECT ON app_portfolio.app2_theme TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_theme TO role_app_dba;

CREATE TABLE app_portfolio.app2_theme_category (
    id     INT NOT NULL AUTO_INCREMENT,
    title  VARCHAR(100) NOT NULL,
	CONSTRAINT app2_theme_category_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_theme_category TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.app2_theme_category TO role_app_dba;

GRANT SELECT ON app_portfolio.app2_theme_category TO role_app2;

CREATE TABLE app_portfolio.app2_theme_type (
    id     INT NOT NULL AUTO_INCREMENT,
    title  VARCHAR(10) NOT NULL,
	CONSTRAINT theme_type_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_theme_type TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.app2_theme_type TO role_app_dba;

GRANT SELECT ON app_portfolio.app2_theme_type TO role_app2;

CREATE TABLE app_portfolio.app2_user_setting (
    id                                         INT NOT NULL AUTO_INCREMENT,
    description                                VARCHAR(100),
    regional_language_locale	               VARCHAR(100),
    regional_timezone                          VARCHAR(100),
    regional_number_system                     VARCHAR(100),
    regional_layout_direction                  VARCHAR(100),
    regional_second_language_locale		       VARCHAR(100),
    regional_column_title                      VARCHAR(100),
    regional_arabic_script                     VARCHAR(100),
    regional_calendar_type                     VARCHAR(100),
    regional_calendar_hijri_type               VARCHAR(100),
    gps_map_type                               VARCHAR(100),
    gps_country_id                             INTEGER,
    gps_city_id                                INTEGER,
    gps_popular_place_id                       INTEGER,
    gps_lat_text                               VARCHAR(100),
    gps_long_text                              VARCHAR(100),
    design_theme_day_id                        INTEGER,
    design_theme_month_id                      INTEGER,
    design_theme_year_id                       INTEGER,
    design_paper_size                          VARCHAR(100),
    design_row_highlight                       VARCHAR(100),
    design_column_weekday_checked              DECIMAL(1,0),
    design_column_calendartype_checked         DECIMAL(1,0),
    design_column_notes_checked                DECIMAL(1,0),
    design_column_gps_checked                  DECIMAL(1,0),
    design_column_timezone_checked             DECIMAL(1,0),
    image_header_image_img                     LONGBLOB,
    image_footer_image_img                     LONGBLOB,
    text_header_1_text                         VARCHAR(100),
    text_header_2_text                         VARCHAR(100),
    text_header_3_text                         VARCHAR(100),
    text_header_align                          VARCHAR(10),
    text_footer_1_text                         VARCHAR(100),
    text_footer_2_text                         VARCHAR(100),
    text_footer_3_text                         VARCHAR(100),
    text_footer_align                          VARCHAR(10),
    prayer_method                              VARCHAR(100),
    prayer_asr_method                          VARCHAR(100),
    prayer_high_latitude_adjustment            VARCHAR(100),
    prayer_time_format                         VARCHAR(100),
    prayer_hijri_date_adjustment               VARCHAR(100),
    prayer_fajr_iqamat                         VARCHAR(100),
    prayer_dhuhr_iqamat                        VARCHAR(100),
    prayer_asr_iqamat                          VARCHAR(100),
    prayer_maghrib_iqamat                      VARCHAR(100),
    prayer_isha_iqamat                         VARCHAR(100),
    prayer_column_imsak_checked                DECIMAL(1,0),
    prayer_column_sunset_checked               DECIMAL(1,0),
    prayer_column_midnight_checked             DECIMAL(1,0),
    prayer_column_fast_start_end               VARCHAR(100),
    date_created                               DATETIME,
    date_modified                              DATETIME,
    user_account_id                            INT NOT NULL,
    app_id                                     INT NOT NULL,
	CONSTRAINT app2_user_setting_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_user_setting TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.app2_user_setting TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_user_setting TO role_app_dba;

ALTER TABLE app_portfolio.app2_user_setting
    ADD CONSTRAINT arc_1 CHECK ( ( ( gps_country_id IS NOT NULL )
                                   AND ( gps_popular_place_id IS NULL ) )
                                 OR ( ( gps_popular_place_id IS NOT NULL )
                                      AND ( gps_country_id IS NULL ) )
                                 OR ( ( gps_country_id IS NULL )
                                      AND ( gps_popular_place_id IS NULL ) ) );

CREATE TABLE app_portfolio.app2_user_setting_hist (
    id                                         INT NOT NULL AUTO_INCREMENT,
    dml                                        VARCHAR(1),
    dml_date                                   DATETIME,
    app2_user_setting_id                       INTEGER,
    description                                VARCHAR(100),
    regional_language_locale	               VARCHAR(100),
    regional_timezone                          VARCHAR(100),
    regional_number_system                     VARCHAR(100),
    regional_layout_direction                  VARCHAR(100),
    regional_second_language_locale		       VARCHAR(100),
    regional_column_title                      VARCHAR(100),
    regional_arabic_script                     VARCHAR(100),
    regional_calendar_type                     VARCHAR(100),
    regional_calendar_hijri_type               VARCHAR(100),
    gps_map_type                               VARCHAR(100),
    gps_country_id                             INTEGER,
    gps_city_id                                INTEGER,
    gps_popular_place_id                       INTEGER,
    gps_lat_text                               VARCHAR(100),
    gps_long_text                              VARCHAR(100),
    design_theme_day_id                        INTEGER,
    design_theme_month_id                      INTEGER,
    design_theme_year_id                       INTEGER,
    design_paper_size                          VARCHAR(100),
    design_row_highlight                       VARCHAR(100),
    design_column_weekday_checked              DECIMAL(1,0),
    design_column_calendartype_checked         DECIMAL(1,0),
    design_column_notes_checked                DECIMAL(1,0),
    design_column_gps_checked                  DECIMAL(1,0),
    design_column_timezone_checked             DECIMAL(1,0),
    image_header_image_img                     LONGBLOB,
    image_footer_image_img                     LONGBLOB,
    text_header_1_text                         VARCHAR(100),
    text_header_2_text                         VARCHAR(100),
    text_header_3_text                         VARCHAR(100),
    text_header_align                          VARCHAR(10),
    text_footer_1_text                         VARCHAR(100),
    text_footer_2_text                         VARCHAR(100),
    text_footer_3_text                         VARCHAR(100),
    text_footer_align                          VARCHAR(10),
    prayer_method                              VARCHAR(100),
    prayer_asr_method                          VARCHAR(100),
    prayer_high_latitude_adjustment            VARCHAR(100),
    prayer_time_format                         VARCHAR(100),
    prayer_hijri_date_adjustment               VARCHAR(100),
    prayer_fajr_iqamat                         VARCHAR(100),
    prayer_dhuhr_iqamat                        VARCHAR(100),
    prayer_asr_iqamat                          VARCHAR(100),
    prayer_maghrib_iqamat                      VARCHAR(100),
    prayer_isha_iqamat                         VARCHAR(100),
    prayer_column_imsak_checked                DECIMAL(1,0),
    prayer_column_sunset_checked               DECIMAL(1,0),
    prayer_column_midnight_checked             DECIMAL(1,0),
    prayer_column_fast_start_end               VARCHAR(100),
    date_created                               DATETIME,
    date_modified                              DATETIME,
    user_account_id                            INTEGER,
    app_id                                     INTEGER,
	CONSTRAINT app2_user_setting_hist_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_user_setting_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.app2_user_setting_hist TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_user_setting_hist TO role_app_dba;

CREATE TABLE app_portfolio.app2_user_setting_like (
    id               INT NOT NULL AUTO_INCREMENT,
    user_account_id  INTEGER NOT NULL,
    app2_user_setting_id  INTEGER NOT NULL,
	date_created     DATETIME,	
	CONSTRAINT app2_user_setting_like_pk PRIMARY KEY ( user_account_id, app2_user_setting_id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_user_setting_like TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.app2_user_setting_like TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_user_setting_like TO role_app_dba;

ALTER TABLE app_portfolio.app2_user_setting_like ADD CONSTRAINT app2_user_setting_like_un UNIQUE ( id );

CREATE TABLE app_portfolio.app2_user_setting_like_hist (
    id                    INT NOT NULL AUTO_INCREMENT,
    dml                   VARCHAR(1),
    dml_date              DATETIME,
    app2_user_setting_like_id  INTEGER,
    user_account_id       INTEGER,
    app2_user_setting_id       INTEGER,
    date_created          DATETIME,
	CONSTRAINT app2_user_setting_like_hist_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_user_setting_like_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.app2_user_setting_like_hist TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_user_setting_like_hist TO role_app_dba;

CREATE TABLE app_portfolio.app2_user_setting_view (
    user_account_id    INTEGER,
    app2_user_setting_id    INTEGER NOT NULL,
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       DATETIME NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_user_setting_view TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.app2_user_setting_view TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_user_setting_view TO role_app_dba;

CREATE TABLE app_portfolio.app2_user_setting_view_hist (
    id                 INT NOT NULL AUTO_INCREMENT,
    dml                VARCHAR(1),
    dml_date           DATETIME,
    user_account_id    INTEGER,
    app2_user_setting_id    INTEGER,
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_latitude    VARCHAR(100),
    client_longitude   VARCHAR(100),
    date_created       DATETIME,
	CONSTRAINT app2_user_setting_view_hist_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app2_user_setting_view_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.app2_user_setting_view_hist TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.app2_user_setting_view_hist TO role_app_dba;

CREATE TABLE app_portfolio.country (
    id            INT NOT NULL AUTO_INCREMENT,
    country_code  VARCHAR(10) NOT NULL,
    flag_emoji    VARCHAR(10),
    flag_url      VARCHAR(100),
    country_group_id  INTEGER NOT NULL,
	CONSTRAINT country_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.country TO role_app_admin;

GRANT SELECT ON app_portfolio.country TO role_app2;

GRANT SELECT ON app_portfolio.country TO role_app1;

GRANT SELECT ON app_portfolio.country TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.country TO role_app_dba;

CREATE TABLE app_portfolio.country_group (
    id          INT NOT NULL AUTO_INCREMENT,
    group_name  VARCHAR(100) NOT NULL,
	CONSTRAINT country_group_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.country_group TO role_app_admin;

GRANT SELECT ON app_portfolio.country_group TO role_app1;

GRANT SELECT ON app_portfolio.country_group TO role_app2;

GRANT SELECT ON app_portfolio.country_group TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.country_group TO role_app_dba;

CREATE TABLE app_portfolio.country_translation (
    country_id   INTEGER NOT NULL,
    language_id  INTEGER NOT NULL,
    text         VARCHAR(2000) NOT NULL,
	CONSTRAINT country_translation_pk PRIMARY KEY ( country_id,
	                                                language_id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.country_translation TO role_app_admin;

GRANT SELECT ON app_portfolio.country_translation TO role_app1;

GRANT SELECT ON app_portfolio.country_translation TO role_app2;

GRANT SELECT ON app_portfolio.country_translation TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.country_translation TO role_app_dba;

CREATE TABLE app_portfolio.device (
    id             INT NOT NULL AUTO_INCREMENT,
    device_name    VARCHAR(100) NOT NULL,
    screen_x       INTEGER,
    screen_y       INTEGER,
    device_type_id INTEGER NOT NULL,
    CONSTRAINT device_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.device TO role_app1;

GRANT SELECT ON app_portfolio.device TO role_app2;

GRANT SELECT ON app_portfolio.device TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.device TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.device TO role_app_dba;

CREATE TABLE app_portfolio.device_type (
    id                          INT NOT NULL AUTO_INCREMENT,
    device_type_name            VARCHAR(100) NOT NULL,
    CONSTRAINT device_type_pk   PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.device_type TO role_app1;

GRANT SELECT ON app_portfolio.device_type TO role_app2;

GRANT SELECT ON app_portfolio.device_type TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.device_type TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.device_type TO role_app_dba;

CREATE TABLE app_portfolio.event (
    id            INT NOT NULL AUTO_INCREMENT,
    event_name    VARCHAR(100) NOT NULL,
    event_type_id INTEGER NOT NULL,
    CONSTRAINT event_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.event TO role_app_dba;

GRANT SELECT ON app_portfolio.event TO role_app1;

GRANT SELECT ON app_portfolio.event TO role_app2;

GRANT SELECT ON app_portfolio.event TO role_app3;

CREATE TABLE app_portfolio.event_status (
    id          INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(100) NOT NULL,
    CONSTRAINT event_status_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.event_status TO role_app1;

GRANT SELECT ON app_portfolio.event_status TO role_app2;

GRANT SELECT ON app_portfolio.event_status TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event_status TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.event_status TO role_app_dba;

CREATE TABLE app_portfolio.event_type (
    id              INT NOT NULL AUTO_INCREMENT,
    event_type_name VARCHAR(100) NOT NULL,
    CONSTRAINT event_type_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event_type TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.event_type TO role_app_dba;

GRANT SELECT ON app_portfolio.event_type TO role_app1;

GRANT SELECT ON app_portfolio.event_type TO role_app2;

GRANT SELECT ON app_portfolio.event_type TO role_app3;

CREATE TABLE app_portfolio.identity_provider (
    id                      INTEGER NOT NULL,
    provider_name           VARCHAR(100) NOT NULL,
    api_src                 VARCHAR(100),
    api_src2                VARCHAR(100),
    api_version             VARCHAR(100),
	api_id                  VARCHAR(100),
    identity_provider_order INTEGER NOT NULL,
    enabled                 INTEGER,
    date_created            DATETIME NOT NULL,
    date_modified           DATETIME,
    CONSTRAINT identity_provider_pk PRIMARY KEY ( id );
);

GRANT SELECT ON app_portfolio.identity_provider TO role_app1;

GRANT SELECT ON app_portfolio.identity_provider TO role_app2;

GRANT SELECT ON app_portfolio.identity_provider TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.identity_provider TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.identity_provider TO role_app_dba;

ALTER TABLE app_portfolio.identity_provider ADD CONSTRAINT identity_provider_order_un UNIQUE ( identity_provider_order );

CREATE TABLE app_portfolio.language (
    id         INT NOT NULL AUTO_INCREMENT,
    lang_code  VARCHAR(10) NOT NULL,
	CONSTRAINT language_pk PRIMARY KEY ( id )
);

CREATE INDEX lang_code_index ON
    language (
        lang_code
    ASC );
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.language TO role_app_admin;

GRANT SELECT ON app_portfolio.language TO role_app1;

GRANT SELECT ON app_portfolio.language TO role_app3;

GRANT SELECT ON app_portfolio.language TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.language TO role_app_dba;

CREATE TABLE app_portfolio.language_translation (
    language_id              INTEGER NOT NULL,
    language_translation_id  INTEGER NOT NULL,
    text                     VARCHAR(2000) NOT NULL,
	CONSTRAINT language_translation_pk PRIMARY KEY ( language_translation_id,
	                                                 language_id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.language_translation TO role_app_admin;

GRANT SELECT ON app_portfolio.language_translation TO role_app3;

GRANT SELECT ON app_portfolio.language_translation TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.language_translation TO role_app_dba;

GRANT SELECT ON app_portfolio.language_translation TO role_app1;

CREATE TABLE app_portfolio.locale (
    language_id  INTEGER NOT NULL,
    country_id   INTEGER NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.locale TO role_app_admin;

GRANT SELECT ON app_portfolio.locale TO role_app3;

GRANT SELECT ON app_portfolio.locale TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.locale TO role_app_dba;

GRANT SELECT ON app_portfolio.locale TO role_app1;

ALTER TABLE app_portfolio.locale ADD CONSTRAINT locale_language_id_country_id_un UNIQUE ( language_id,
                                                     country_id );

CREATE TABLE app_portfolio.message (
    message_level_id INTEGER NOT NULL,
    message_type_id  INTEGER NOT NULL,
    code             VARCHAR(100) NOT NULL,
    CONSTRAINT message_pk PRIMARY KEY ( code )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.message TO role_app_admin;

GRANT SELECT ON app_portfolio.message TO role_app1;

GRANT SELECT ON app_portfolio.message TO role_app3;

GRANT SELECT ON app_portfolio.message TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.message TO role_app_dba;

CREATE TABLE app_portfolio.message_level (
    id             INT NOT NULL AUTO_INCREMENT,
    message_level  VARCHAR(10) NOT NULL,
	CONSTRAINT message_level_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.message_level TO role_app_admin;

GRANT SELECT ON app_portfolio.message_level TO role_app1;

GRANT SELECT ON app_portfolio.message_level TO role_app3;

GRANT SELECT ON app_portfolio.message_level TO role_app2;

GRANT ALL PRIVILEGES ON app_portfolio.message_level TO role_app_dba;

ALTER TABLE app_portfolio.message_level ADD CONSTRAINT message_level_message_level_un UNIQUE ( message_level );

CREATE TABLE app_portfolio.message_translation (
    language_id  INTEGER NOT NULL,
    message_code VARCHAR(100) NOT NULL,
    text         VARCHAR(2000),
    CONSTRAINT message_translation_pk PRIMARY KEY ( language_id,
                                                    message_code )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.message_translation TO role_app_admin;

GRANT SELECT ON app_portfolio.message_translation TO role_app1;

GRANT SELECT ON app_portfolio.message_translation TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.message_translation TO role_app_dba;

GRANT SELECT ON app_portfolio.message_translation TO role_app2;

CREATE TABLE app_portfolio.message_type (
    id            INT NOT NULL AUTO_INCREMENT,
    message_type  VARCHAR(10) NOT NULL,
	CONSTRAINT message_type_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.message_type TO role_app_admin;

GRANT SELECT ON app_portfolio.message_type TO role_app1;

GRANT SELECT ON app_portfolio.message_type TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.message_type TO role_app_dba;

GRANT SELECT ON app_portfolio.message_type TO role_app2;

ALTER TABLE app_portfolio.message_type ADD CONSTRAINT message_type_message_type_un UNIQUE ( message_type );

CREATE TABLE app_portfolio.parameter_type (
    id VARCHAR(100) NOT NULL,
    parameter_type_name VARCHAR(100) NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.parameter_type TO role_app_admin;

GRANT SELECT ON app_portfolio.parameter_type TO role_app1;

GRANT SELECT ON app_portfolio.parameter_type TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.parameter_type TO role_app_dba;

GRANT SELECT ON app_portfolio.parameter_type TO role_app2;

ALTER TABLE app_portfolio.parameter_type ADD CONSTRAINT parameter_type_pk PRIMARY KEY ( id );

CREATE TABLE app_portfolio.profile_search (
    user_account_id    INTEGER,
    search             VARCHAR(100) NOT NULL,
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       DATETIME NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.profile_search TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.profile_search TO role_app1;

GRANT SELECT, INSERT ON app_portfolio.profile_search TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.profile_search TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.profile_search TO role_app2;

CREATE TABLE app_portfolio.profile_search_hist (
    id                 INT NOT NULL AUTO_INCREMENT,
    dml_type           VARCHAR(1),
    dml_date           DATETIME,
    user_account_id    INTEGER,
    search             VARCHAR(100),
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_latitude    VARCHAR(100),
    client_longitude   VARCHAR(100),
    date_created       DATETIME,
	CONSTRAINT profile_search_hist_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.profile_search_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.profile_search_hist TO role_app1;

GRANT SELECT, INSERT ON app_portfolio.profile_search_hist TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.profile_search_hist TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.profile_search_hist TO role_app2;

CREATE TABLE app_portfolio.regional_setting (
    id               INT NOT NULL AUTO_INCREMENT,
    data             VARCHAR(100) NOT NULL,
    regional_type_id INTEGER NOT NULL,
    CONSTRAINT regional_setting_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.regional_setting TO role_app1;

GRANT SELECT ON app_portfolio.regional_setting TO role_app2;

GRANT SELECT ON app_portfolio.regional_setting TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.regional_setting TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.regional_setting TO role_app_dba;

CREATE TABLE app_portfolio.regional_setting_translation (
    regional_setting_id INTEGER NOT NULL,
    language_id              INTEGER NOT NULL,
    text                     VARCHAR(2000) NOT NULL
);

GRANT SELECT ON app_portfolio.regional_setting_translation TO role_app1;

GRANT SELECT ON app_portfolio.regional_setting_translation TO role_app2;

GRANT SELECT ON app_portfolio.regional_setting_translation TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.regional_setting_translation TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.regional_setting_translation TO role_app_dba;

CREATE TABLE app_portfolio.regional_type (
    id            INT NOT NULL AUTO_INCREMENT,
    regional_type VARCHAR(100) NOT NULL,
    CONSTRAINT regional_type_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.regional_type TO role_app1;

GRANT SELECT ON app_portfolio.regional_type TO role_app2;

GRANT SELECT ON app_portfolio.regional_type TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.regional_type TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.regional_type TO role_app_dba;
	
CREATE TABLE app_portfolio.user_account (
    id                    INT NOT NULL AUTO_INCREMENT,
    username              VARCHAR(100),
    bio                   VARCHAR(150),
    private               DECIMAL(1,0),
    user_level            DECIMAL(1,0),
    date_created          DATETIME,
    date_modified         DATETIME,
    password              VARCHAR(100),
    password_reminder     VARCHAR(100),
    email                 VARCHAR(100),
    email_unverified      VARCHAR(100),
    avatar                LONGBLOB,
    verification_code     VARCHAR(6),
    active                DECIMAL(1,0),
    identity_provider_id  INTEGER,
    provider_id           VARCHAR(100),
    provider_first_name   VARCHAR(1000),
    provider_last_name    VARCHAR(1000),
    provider_image        LONGBLOB,
    provider_image_url    VARCHAR(1000),
    provider_email        VARCHAR(1000),
	CONSTRAINT user_account_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account TO role_app_dba;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account TO role_app2;

ALTER TABLE app_portfolio.user_account ADD CONSTRAINT user_account_provider_id_un UNIQUE ( provider_id );

ALTER TABLE app_portfolio.user_account ADD CONSTRAINT user_account_username_un UNIQUE ( username );

ALTER TABLE app_portfolio.user_account ADD CONSTRAINT user_account_email_un UNIQUE ( email );

CREATE TABLE app_portfolio.user_account_app (
    user_account_id                                   INTEGER NOT NULL,
    app_id                                            INTEGER NOT NULL,
    preference_locale                                 VARCHAR(100),
    regional_setting_preference_timezone_id           INTEGER,
    regional_setting_preference_direction_id          INTEGER,
    regional_setting_preference_arabic_script_id      INTEGER,
    date_created                                      DATETIME NOT NULL,
    CONSTRAINT user_account_app_pk PRIMARY KEY ( app_id,
                                                user_account_id )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_app TO role_app_dba;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app TO role_app2;

CREATE TABLE app_portfolio.user_account_app_hist (
    id                                                INTEGER NOT NULL AUTO_INCREMENT,
    dml                                               VARCHAR(1),
    dml_date                                          DATETIME,
    user_account_id                                   INTEGER,
    app_id                                            INTEGER,
    preference_locale                                 VARCHAR(100),
    regional_setting_preference_timezone_id           INTEGER,
    regional_setting_preference_direction_id          INTEGER,
    regional_setting_preference_arabic_script_id      INTEGER,
    date_created                                      DATETIME,
    CONSTRAINT user_account_app_hist_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT ON app_portfolio.user_account_app_hist TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.user_account_app_hist TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_app_hist TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.user_account_app_hist TO role_app2;

CREATE TABLE app_portfolio.user_account_event (
    user_account_id             INTEGER NOT NULL,
    event_id                    INTEGER NOT NULL,
    event_status_id             INTEGER NOT NULL,
    date_created                DATETIME NOT NULL,
    date_modified               DATETIME,
    user_language               VARCHAR(1000),
    user_timezone               VARCHAR(1000),
    user_number_system          VARCHAR(1000),
    user_platform               VARCHAR(1000),
    client_latitude             VARCHAR(1000),
    client_longitude            VARCHAR(1000),
    server_remote_addr          VARCHAR(1000),
    server_user_agent           VARCHAR(1000),
    server_http_host            VARCHAR(1000),
    server_http_accept_language VARCHAR(1000)
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_event TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_event TO role_app2;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_event TO role_app3;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_event TO role_app_admin;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_event TO role_app_dba;

CREATE TABLE app_portfolio.user_account_follow (
    id                      INT NOT NULL AUTO_INCREMENT,
    user_account_id         INTEGER NOT NULL,
    user_account_id_follow  INTEGER NOT NULL,
	date_created            DATETIME,
    CONSTRAINT user_account_follow_id_un UNIQUE ( id ),
	CONSTRAINT user_account_follow_pk PRIMARY KEY ( user_account_id, user_account_id_follow )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_follow TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_follow TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_follow TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_follow TO role_app_dba;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_follow TO role_app2;

CREATE TABLE app_portfolio.user_account_follow_hist (
    id                      INT NOT NULL AUTO_INCREMENT,
    dml                     VARCHAR(1),
    dml_date                DATETIME,
    user_account_follow_id  INTEGER,
    user_account_id         INTEGER,
    user_account_id_follow  INTEGER,
    date_created            DATETIME,
	CONSTRAINT user_account_follow_hist_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT ON app_portfolio.user_account_follow_hist TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_follow_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.user_account_follow_hist TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_follow_hist TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.user_account_follow_hist TO role_app2;

CREATE TABLE app_portfolio.user_account_hist (
    id                    INT NOT NULL AUTO_INCREMENT,
    dml                   VARCHAR(1),
    dml_date              DATETIME,
    user_account_id       INTEGER,
    username              VARCHAR(100),
    bio                   VARCHAR(150),
    private               DECIMAL(1,0),
    user_level            DECIMAL(1,0),
    date_created          DATETIME,
    date_modified         DATETIME,
    password              VARCHAR(100),
    password_reminder     VARCHAR(100),
    email                 VARCHAR(100),
    email_unverified      VARCHAR(100),
    avatar                LONGBLOB,
    verification_code     VARCHAR(6),
    active                DECIMAL(1,0),
    identity_provider_id  INTEGER,
    provider_id           VARCHAR(100),
    provider_first_name   VARCHAR(1000),
    provider_last_name    VARCHAR(1000),
    provider_image_url    VARCHAR(1000),
    provider_email        VARCHAR(1000),
	CONSTRAINT user_account_hist_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT ON app_portfolio.user_account_hist TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.user_account_hist TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_hist TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.user_account_hist TO role_app2;

CREATE TABLE app_portfolio.user_account_like (
    id                    INT NOT NULL AUTO_INCREMENT,
    user_account_id       INTEGER NOT NULL,
    user_account_id_like  INTEGER NOT NULL,
	date_created          DATETIME,
    CONSTRAINT user_account_like_id_un UNIQUE ( id ),
	CONSTRAINT user_account_like_pk PRIMARY KEY ( user_account_id, user_account_id_like )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_like TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_like TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_like TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_like TO role_app_dba;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_like TO role_app2;

CREATE TABLE app_portfolio.user_account_like_hist (
    id                    INT NOT NULL AUTO_INCREMENT,
    dml                   VARCHAR(1),
    dml_date              DATETIME,
    user_account_like_id  INTEGER,
    user_account_id       INTEGER,
    user_account_id_like  INTEGER,
    date_created          DATETIME,
	CONSTRAINT user_account_like_hist_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT ON app_portfolio.user_account_like_hist TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_like_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.user_account_like_hist TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_like_hist TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.user_account_like_hist TO role_app2;

CREATE TABLE app_portfolio.user_account_logon (
    user_account_id    INTEGER NOT NULL,
    app_id             INTEGER NOT NULL,
    result             INTEGER NOT NULL,
    access_token       VARCHAR(500),
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       DATETIME NOT NULL
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_logon TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_logon TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_logon TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_logon TO role_app_dba;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_logon TO role_app2;

ALTER TABLE app_portfolio.user_account_logon ADD CONSTRAINT user_account_logon_accesstoken_un UNIQUE ( access_token );

CREATE TABLE app_portfolio.user_account_logon_hist (
    id                 INT NOT NULL AUTO_INCREMENT,
    dml                VARCHAR(1),
    dml_date           DATETIME,
    user_account_id    INTEGER,
    app_id             INTEGER,
    result             INTEGER,
    access_token       VARCHAR(500),
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_latitude    VARCHAR(100),
    client_longitude   VARCHAR(100),
    date_created       DATETIME,
	CONSTRAINT user_account_logon_hist_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT ON app_portfolio.user_account_logon_hist TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_logon_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.user_account_logon_hist TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_logon_hist TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.user_account_logon_hist TO role_app2;

CREATE TABLE app_portfolio.user_account_view (
    user_account_id       INTEGER,
    user_account_id_view  INTEGER NOT NULL,
    client_ip             VARCHAR(100),
    client_user_agent     VARCHAR(500),
    client_longitude      VARCHAR(100),
    client_latitude       VARCHAR(100),
    date_created          DATETIME NOT NULL
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_view TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_view TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_view TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_view TO role_app_dba;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_view TO role_app2;

CREATE TABLE app_portfolio.user_account_view_hist (
    id                    INT NOT NULL AUTO_INCREMENT,
    dml_type              VARCHAR(1),
    dml_date              DATETIME,
    user_account_id       INTEGER,
    user_account_id_view  INTEGER,
    client_ip             VARCHAR(100),
    client_user_agent     VARCHAR(500),
    client_latitude       VARCHAR(100),
    client_longitude      VARCHAR(100),
    date_created          DATETIME,
	CONSTRAINT user_account_view_hist_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT ON app_portfolio.user_account_view_hist TO role_app1;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_view_hist TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.user_account_view_hist TO role_app3;

GRANT ALL PRIVILEGES ON app_portfolio.user_account_view_hist TO role_app_dba;

GRANT SELECT, INSERT ON app_portfolio.user_account_view_hist TO role_app2;

GRANT trigger on app_portfolio.app2_user_setting to role_app_admin;
GRANT trigger on app_portfolio.app2_user_setting to role_app2;

GRANT trigger on app_portfolio.app2_user_setting_like to role_app_admin;
GRANT trigger on app_portfolio.app2_user_setting_like to role_app2;

GRANT trigger on app_portfolio.app2_user_setting_view to role_app_admin;
GRANT trigger on app_portfolio.app2_user_setting_view to role_app2;

GRANT trigger on app_portfolio.profile_search to role_app_admin;
GRANT trigger on app_portfolio.profile_search to role_app1;
GRANT trigger on app_portfolio.profile_search to role_app3;
GRANT trigger on app_portfolio.profile_search to role_app2;

GRANT trigger on app_portfolio.user_account_app to role_app_admin;
GRANT trigger on app_portfolio.user_account_app to role_app1;
GRANT trigger on app_portfolio.user_account_app to role_app3;
GRANT trigger on app_portfolio.user_account_app to role_app2;

GRANT trigger on app_portfolio.user_account to role_app_admin;
GRANT trigger on app_portfolio.user_account to role_app1;
GRANT trigger on app_portfolio.user_account to role_app3;
GRANT trigger on app_portfolio.user_account to role_app2;

GRANT trigger on app_portfolio.user_account_follow to role_app_admin;
GRANT trigger on app_portfolio.user_account_follow to role_app1;
GRANT trigger on app_portfolio.user_account_follow to role_app3;
GRANT trigger on app_portfolio.user_account_follow to role_app2;

GRANT trigger on app_portfolio.user_account_like to role_app_admin;
GRANT trigger on app_portfolio.user_account_like to role_app1;
GRANT trigger on app_portfolio.user_account_like to role_app3;
GRANT trigger on app_portfolio.user_account_like to role_app2;

GRANT trigger on app_portfolio.user_account_logon to role_app_admin;
GRANT trigger on app_portfolio.user_account_logon to role_app1;
GRANT trigger on app_portfolio.user_account_logon to role_app3;
GRANT trigger on app_portfolio.user_account_logon to role_app2;

GRANT trigger on app_portfolio.user_account_view to role_app_admin;
GRANT trigger on app_portfolio.user_account_view to role_app1;
GRANT trigger on app_portfolio.user_account_view to role_app3;
GRANT trigger on app_portfolio.user_account_view to role_app2;

ALTER TABLE app_portfolio.app
    ADD CONSTRAINT app_app_category_fk FOREIGN KEY ( app_category_id )
        REFERENCES app_portfolio.app_category ( id );

ALTER TABLE app_category_translation
    ADD CONSTRAINT app_category_translation_app_category_fk FOREIGN KEY ( app_category_id )
        REFERENCES app_portfolio.app_category ( id );

ALTER TABLE app_category_translation
    ADD CONSTRAINT app_category_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES app_portfolio.language ( id );

ALTER TABLE app_portfolio.app_device
    ADD CONSTRAINT app_device_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id );

ALTER TABLE app_portfolio.app_device
    ADD CONSTRAINT app_device_device_fk FOREIGN KEY ( device_id )
        REFERENCES app_portfolio.device ( id );

ALTER TABLE app_portfolio.app_log
    ADD CONSTRAINT app_log_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_portfolio.app_message
    ADD CONSTRAINT app_message_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_portfolio.app_message
    ADD CONSTRAINT app_message_message_fk FOREIGN KEY ( message_code )
        REFERENCES message ( code );

ALTER TABLE app_portfolio.app_object
    ADD CONSTRAINT app_object_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_portfolio.app_object_item
    ADD CONSTRAINT app_object_item_app_object_fk FOREIGN KEY ( object_name,
                                                               app_id )
        REFERENCES app_object ( object_name,
                                app_id );

ALTER TABLE app_portfolio.app_object_item_subitem
    ADD CONSTRAINT app_object_item_subitem_app_object_item_fk FOREIGN KEY ( object_name,
                                                                            app_id,
                                                                            object_item_name )
        REFERENCES app_object_item ( object_name,
                                     app_id,
                                     object_item_name );

ALTER TABLE app_portfolio.app_object_item_subitem_fixed
    ADD CONSTRAINT app_object_item_subitem_fixed_app_object_item_fk FOREIGN KEY ( object_name,
                                                                                  app_id,
                                                                                  object_item_name )
        REFERENCES app_object_item ( object_name,
                                     app_id,
                                     object_item_name );

ALTER TABLE app_portfolio.app_object_item_translation
    ADD CONSTRAINT app_object_item_translation_app_object_item_fk FOREIGN KEY ( object_name,
                                                                                app_id,
                                                                                object_item_name )
        REFERENCES app_object_item ( object_name,
                                     app_id,
                                     object_item_name );

ALTER TABLE app_portfolio.app_object_item_translation
    ADD CONSTRAINT app_object_item_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_portfolio.app_object_subitem_translation
    ADD CONSTRAINT app_object_subitem_translation_app_object_item_subitem_fk FOREIGN KEY ( subitem_name,
                                                                                           object_item_name,
                                                                                           object_name,
                                                                                           app_id )
        REFERENCES app_object_item_subitem ( subitem_name,
                                             object_item_name,
                                             object_name,
                                             app_id );

ALTER TABLE app_portfolio.app_object_subitem_translation
    ADD CONSTRAINT app_object_subitem_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_portfolio.app_object_translation
    ADD CONSTRAINT app_object_translation_app_object_fk FOREIGN KEY ( object_name,
                                                                      app_id )
        REFERENCES app_object ( object_name,
                                app_id );

ALTER TABLE app_portfolio.app_object_translation
    ADD CONSTRAINT app_object_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_portfolio.app_parameter
    ADD CONSTRAINT app_parameter_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_portfolio.app_parameter
    ADD CONSTRAINT app_parameter_parameter_type_fk FOREIGN KEY ( parameter_type_id )
        REFERENCES parameter_type ( id );

ALTER TABLE app_portfolio.app_screenshot
    ADD CONSTRAINT app_screenshot_app_device_fk FOREIGN KEY ( app_device_app_id,
                                                              app_device_device_id )
        REFERENCES app_portfolio.app_device ( app_id,
                                              device_id );

ALTER TABLE app_portfolio.app2_place
    ADD CONSTRAINT app2_place_country1_fk FOREIGN KEY ( country1_id )
        REFERENCES country ( id );

ALTER TABLE app_portfolio.app2_place
    ADD CONSTRAINT app2_place_country2_fk FOREIGN KEY ( country2_id )
        REFERENCES country ( id );

ALTER TABLE app_portfolio.app2_place
    ADD CONSTRAINT app2_place_group_place_fk FOREIGN KEY ( group_place1_id )
        REFERENCES group_place ( id );

ALTER TABLE app_portfolio.app2_place
    ADD CONSTRAINT app2_place_group_place2_fk FOREIGN KEY ( group_place2_id )
        REFERENCES group_place ( id );

ALTER TABLE app_portfolio.app2_theme
    ADD CONSTRAINT app2_theme_theme_category_fk FOREIGN KEY ( theme_category_id )
        REFERENCES theme_category ( id );

ALTER TABLE app_portfolio.app2_theme
    ADD CONSTRAINT app2_theme_theme_type_fk FOREIGN KEY ( theme_type_id )
        REFERENCES theme_type ( id );

ALTER TABLE app_portfolio.app2_user_setting
    ADD CONSTRAINT app2_user_setting_app2_place_fk FOREIGN KEY ( gps_popular_place_id )
        REFERENCES app2_place ( id );

ALTER TABLE app_portfolio.app2_user_setting
    ADD CONSTRAINT app2_user_setting_app2_theme_day_fk FOREIGN KEY ( design_theme_day_id )
        REFERENCES app2_theme ( id );

ALTER TABLE app_portfolio.app2_user_setting
    ADD CONSTRAINT app2_user_setting_app2_theme_month_fk FOREIGN KEY ( design_theme_month_id )
        REFERENCES app2_theme ( id );

ALTER TABLE app_portfolio.app2_user_setting
    ADD CONSTRAINT app2_user_setting_app2_theme_year_fk FOREIGN KEY ( design_theme_year_id )
        REFERENCES app2_theme ( id );

ALTER TABLE app_portfolio.app2_user_setting
    ADD CONSTRAINT app2_user_setting_country_fk FOREIGN KEY ( gps_country_id )
        REFERENCES country ( id );

ALTER TABLE app_portfolio.app2_user_setting_like
    ADD CONSTRAINT app2_user_setting_like_app2_user_setting_fk FOREIGN KEY ( app2_user_setting_id )
        REFERENCES app2_user_setting ( id )
		ON DELETE CASCADE;

ALTER TABLE app_portfolio.app2_user_setting_like
    ADD CONSTRAINT app2_user_setting_like_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE app_portfolio.app2_user_setting
    ADD CONSTRAINT app2_user_setting_user_account_app_fk FOREIGN KEY ( app_id,
                                                                       user_account_id )
        REFERENCES user_account_app ( app_id,
                                      user_account_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app2_user_setting_view
    ADD CONSTRAINT app2_user_setting_view_app2_user_setting_fk FOREIGN KEY ( app2_user_setting_id )
        REFERENCES app2_user_setting ( id )
        ON DELETE CASCADE;

ALTER TABLE app_portfolio.app2_user_setting_view
    ADD CONSTRAINT app2_user_setting_view_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
        ON DELETE CASCADE;

ALTER TABLE app_portfolio.country
    ADD CONSTRAINT country_country_group_fk FOREIGN KEY ( country_group_id )
        REFERENCES country_group ( id );

ALTER TABLE app_portfolio.country_translation
    ADD CONSTRAINT country_translation_country_fk FOREIGN KEY ( country_id )
        REFERENCES country ( id );

ALTER TABLE app_portfolio.country_translation
    ADD CONSTRAINT country_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_portfolio.device
    ADD CONSTRAINT device_device_type_fk FOREIGN KEY ( device_type_id )
        REFERENCES app_portfolio.device_type ( id );

ALTER TABLE app_portfolio.event
    ADD CONSTRAINT event_event_type_fk FOREIGN KEY ( event_type_id )
        REFERENCES app_portfolio.event_type ( id );

ALTER TABLE app_portfolio.language_translation
    ADD CONSTRAINT language_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_portfolio.language_translation
    ADD CONSTRAINT language_translation_language_translation_fk FOREIGN KEY ( language_translation_id )
        REFERENCES language ( id );

ALTER TABLE app_portfolio.locale
    ADD CONSTRAINT locale_country_fk FOREIGN KEY ( country_id )
        REFERENCES country ( id );

ALTER TABLE app_portfolio.locale
    ADD CONSTRAINT locale_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_portfolio.message
    ADD CONSTRAINT message_message_level_fk FOREIGN KEY ( message_level_id )
        REFERENCES message_level ( id );

ALTER TABLE app_portfolio.message
    ADD CONSTRAINT message_message_type_fk FOREIGN KEY ( message_type_id )
        REFERENCES message_type ( id );

ALTER TABLE app_portfolio.message_translation
    ADD CONSTRAINT message_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_portfolio.message_translation
    ADD CONSTRAINT message_translation_message_fk FOREIGN KEY ( message_code )
        REFERENCES message ( code );

ALTER TABLE app_portfolio.profile_search
    ADD CONSTRAINT profile_search_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
        ON DELETE CASCADE;

ALTER TABLE app_portfolio.regional_setting_translation
    ADD CONSTRAINT regional_setting_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES app_portfolio.language ( id );

ALTER TABLE app_portfolio.regional_setting_translation
    ADD CONSTRAINT regional_setting_translation_regional_setting_fk FOREIGN KEY ( regional_setting_id )
        REFERENCES app_portfolio.regional_setting ( id );

ALTER TABLE app_portfolio.regional_setting
    ADD CONSTRAINT regional_setting_regional_type_fk FOREIGN KEY ( regional_type_id )
        REFERENCES app_portfolio.regional_type ( id );

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id )
        ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_regional_setting_preference_arabic_script_fk FOREIGN KEY ( regional_setting_preference_arabic_script_id )
        REFERENCES app_portfolio.regional_setting ( id )
    NOT DEFERRABLE;

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_regional_setting_preference_direction_fk FOREIGN KEY ( regional_setting_preference_direction_id )
        REFERENCES app_portfolio.regional_setting ( id )
    NOT DEFERRABLE;

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_regional_setting_preference_timezone_fk FOREIGN KEY ( regional_setting_preference_timezone_id )
        REFERENCES app_portfolio.regional_setting ( id )
    NOT DEFERRABLE;

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
        ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_event
    ADD CONSTRAINT user_account_event_event_fk FOREIGN KEY ( event_id )
        REFERENCES app_portfolio.event ( id );

ALTER TABLE app_portfolio.user_account_event
    ADD CONSTRAINT user_account_event_event_status_fk FOREIGN KEY ( event_status_id )
        REFERENCES app_portfolio.event_status ( id );

ALTER TABLE app_portfolio.user_account_event
    ADD CONSTRAINT user_account_event_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES app_portfolio.user_account ( id )
            ON DELETE CASCADE;
	
ALTER TABLE app_portfolio.user_account_follow
    ADD CONSTRAINT user_account_follow_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_follow
    ADD CONSTRAINT user_account_follow_user_account_follow_fk FOREIGN KEY ( user_account_id_follow )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_like
    ADD CONSTRAINT user_account_like_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_like
    ADD CONSTRAINT user_account_like_user_account_like_fk FOREIGN KEY ( user_account_id_like )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_logon
    ADD CONSTRAINT user_account_logon_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_portfolio.user_account_logon
    ADD CONSTRAINT user_account_logon_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_view
    ADD CONSTRAINT user_account_view_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_view
    ADD CONSTRAINT user_account_view_user_account_view_fk FOREIGN KEY ( user_account_id_view )
        REFERENCES user_account ( id )
        ON DELETE CASCADE;

CREATE TRIGGER app_portfolio.app2_user_setting_before_delete 
    BEFORE DELETE ON app_portfolio.app2_user_setting 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_hist
(dml,
dml_date,
app2_user_setting_id,
description,
regional_language_locale,
regional_timezone,
regional_number_system,
regional_layout_direction,
regional_second_language_locale,
regional_column_title,
regional_arabic_script,
regional_calendar_type,
regional_calendar_hijri_type,
gps_map_type,
gps_country_id,
gps_city_id,
gps_popular_place_id,
gps_lat_text,
gps_long_text,
design_theme_day_id,
design_theme_month_id,
design_theme_year_id,
design_paper_size,
design_row_highlight,
design_column_weekday_checked,
design_column_calendartype_checked,
design_column_notes_checked,
design_column_gps_checked,
design_column_timezone_checked,
image_header_image_img,
image_footer_image_img,
text_header_1_text,
text_header_2_text,
text_header_3_text,
text_header_align,
text_footer_1_text,
text_footer_2_text,
text_footer_3_text,
text_footer_align,
prayer_method,
prayer_asr_method,
prayer_high_latitude_adjustment,
prayer_time_format,
prayer_hijri_date_adjustment,
prayer_fajr_iqamat,
prayer_dhuhr_iqamat,
prayer_asr_iqamat,
prayer_maghrib_iqamat,
prayer_isha_iqamat,
prayer_column_imsak_checked,
prayer_column_sunset_checked,
prayer_column_midnight_checked,
prayer_column_fast_start_end,
date_created,
date_modified,
user_account_id,
app_id)
VALUES(
'D',
SYSDATE(),
old.id,
old.description,
old.regional_language_locale,
old.regional_timezone,
old.regional_number_system,
old.regional_layout_direction,
old.regional_second_language_locale,
old.regional_column_title,
old.regional_arabic_script,
old.regional_calendar_type,
old.regional_calendar_hijri_type,
old.gps_map_type,
old.gps_country_id,
old.gps_city_id,
old.gps_popular_place_id,
old.gps_lat_text,
old.gps_long_text,
old.design_theme_day_id,
old.design_theme_month_id,
old.design_theme_year_id,
old.design_paper_size,
old.design_row_highlight,
old.design_column_weekday_checked,
old.design_column_calendartype_checked,
old.design_column_notes_checked,
old.design_column_gps_checked,
old.design_column_timezone_checked,
null,
null,
old.text_header_1_text,
old.text_header_2_text,
old.text_header_3_text,
old.text_header_align,
old.text_footer_1_text,
old.text_footer_2_text,
old.text_footer_3_text,
old.text_footer_align,
old.prayer_method,
old.prayer_asr_method,
old.prayer_high_latitude_adjustment,
old.prayer_time_format,
old.prayer_hijri_date_adjustment,
old.prayer_fajr_iqamat,
old.prayer_dhuhr_iqamat,
old.prayer_asr_iqamat,
old.prayer_maghrib_iqamat,
old.prayer_isha_iqamat,
old.prayer_column_imsak_checked,
old.prayer_column_sunset_checked,
old.prayer_column_midnight_checked,
old.prayer_column_fast_start_end,
old.date_created,
old.date_modified,
old.user_account_id,
old.app_id);
END; 
/

CREATE TRIGGER app_portfolio.app2_user_setting_before_insert 
    BEFORE INSERT ON app_portfolio.app2_user_setting 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_hist
(dml,
dml_date,
app2_user_setting_id,
description,
regional_language_locale,
regional_timezone,
regional_number_system,
regional_layout_direction,
regional_second_language_locale,
regional_column_title,
regional_arabic_script,
regional_calendar_type,
regional_calendar_hijri_type,
gps_map_type,
gps_country_id,
gps_city_id,
gps_popular_place_id,
gps_lat_text,
gps_long_text,
design_theme_day_id,
design_theme_month_id,
design_theme_year_id,
design_paper_size,
design_row_highlight,
design_column_weekday_checked,
design_column_calendartype_checked,
design_column_notes_checked,
design_column_gps_checked,
design_column_timezone_checked,
image_header_image_img,
image_footer_image_img,
text_header_1_text,
text_header_2_text,
text_header_3_text,
text_header_align,
text_footer_1_text,
text_footer_2_text,
text_footer_3_text,
text_footer_align,
prayer_method,
prayer_asr_method,
prayer_high_latitude_adjustment,
prayer_time_format,
prayer_hijri_date_adjustment,
prayer_fajr_iqamat,
prayer_dhuhr_iqamat,
prayer_asr_iqamat,
prayer_maghrib_iqamat,
prayer_isha_iqamat,
prayer_column_imsak_checked,
prayer_column_sunset_checked,
prayer_column_midnight_checked,
prayer_column_fast_start_end,
date_created,
date_modified,
user_account_id,
app_id)
VALUES(
'I',
SYSDATE(),
new.id,
new.description,
new.regional_language_locale,
new.regional_timezone,
new.regional_number_system,
new.regional_layout_direction,
new.regional_second_language_locale,
new.regional_column_title,
new.regional_arabic_script,
new.regional_calendar_type,
new.regional_calendar_hijri_type,
new.gps_map_type,
new.gps_country_id,
new.gps_city_id,
new.gps_popular_place_id,
new.gps_lat_text,
new.gps_long_text,
new.design_theme_day_id,
new.design_theme_month_id,
new.design_theme_year_id,
new.design_paper_size,
new.design_row_highlight,
new.design_column_weekday_checked,
new.design_column_calendartype_checked,
new.design_column_notes_checked,
new.design_column_gps_checked,
new.design_column_timezone_checked,
null,
null,
new.text_header_1_text,
new.text_header_2_text,
new.text_header_3_text,
new.text_header_align,
new.text_footer_1_text,
new.text_footer_2_text,
new.text_footer_3_text,
new.text_footer_align,
new.prayer_method,
new.prayer_asr_method,
new.prayer_high_latitude_adjustment,
new.prayer_time_format,
new.prayer_hijri_date_adjustment,
new.prayer_fajr_iqamat,
new.prayer_dhuhr_iqamat,
new.prayer_asr_iqamat,
new.prayer_maghrib_iqamat,
new.prayer_isha_iqamat,
new.prayer_column_imsak_checked,
new.prayer_column_sunset_checked,
new.prayer_column_midnight_checked,
new.prayer_column_fast_start_end,
new.date_created,
new.date_modified,
new.user_account_id,
new.app_id);
END; 
/

CREATE TRIGGER app_portfolio.app2_user_setting_before_update 
    BEFORE UPDATE ON app_portfolio.app2_user_setting 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_hist
(dml,
dml_date,
app2_user_setting_id,
description,
regional_language_locale,
regional_timezone,
regional_number_system,
regional_layout_direction,
regional_second_language_locale,
regional_column_title,
regional_arabic_script,
regional_calendar_type,
regional_calendar_hijri_type,
gps_map_type,
gps_country_id,
gps_city_id,
gps_popular_place_id,
gps_lat_text,
gps_long_text,
design_theme_day_id,
design_theme_month_id,
design_theme_year_id,
design_paper_size,
design_row_highlight,
design_column_weekday_checked,
design_column_calendartype_checked,
design_column_notes_checked,
design_column_gps_checked,
design_column_timezone_checked,
image_header_image_img,
image_footer_image_img,
text_header_1_text,
text_header_2_text,
text_header_3_text,
text_header_align,
text_footer_1_text,
text_footer_2_text,
text_footer_3_text,
text_footer_align,
prayer_method,
prayer_asr_method,
prayer_high_latitude_adjustment,
prayer_time_format,
prayer_hijri_date_adjustment,
prayer_fajr_iqamat,
prayer_dhuhr_iqamat,
prayer_asr_iqamat,
prayer_maghrib_iqamat,
prayer_isha_iqamat,
prayer_column_imsak_checked,
prayer_column_sunset_checked,
prayer_column_midnight_checked,
prayer_column_fast_start_end,
date_created,
date_modified,
user_account_id,
app_id)
VALUES(
'U',
SYSDATE(),
old.id,
old.description,
old.regional_language_locale,
old.regional_timezone,
old.regional_number_system,
old.regional_layout_direction,
old.regional_second_language_locale,
old.regional_column_title,
old.regional_arabic_script,
old.regional_calendar_type,
old.regional_calendar_hijri_type,
old.gps_map_type,
old.gps_country_id,
old.gps_city_id,
old.gps_popular_place_id,
old.gps_lat_text,
old.gps_long_text,
old.design_theme_day_id,
old.design_theme_month_id,
old.design_theme_year_id,
old.design_paper_size,
old.design_row_highlight,
old.design_column_weekday_checked,
old.design_column_calendartype_checked,
old.design_column_notes_checked,
old.design_column_gps_checked,
old.design_column_timezone_checked,
null,
null,
old.text_header_1_text,
old.text_header_2_text,
old.text_header_3_text,
old.text_header_align,
old.text_footer_1_text,
old.text_footer_2_text,
old.text_footer_3_text,
old.text_footer_align,
old.prayer_method,
old.prayer_asr_method,
old.prayer_high_latitude_adjustment,
old.prayer_time_format,
old.prayer_hijri_date_adjustment,
old.prayer_fajr_iqamat,
old.prayer_dhuhr_iqamat,
old.prayer_asr_iqamat,
old.prayer_maghrib_iqamat,
old.prayer_isha_iqamat,
old.prayer_column_imsak_checked,
old.prayer_column_sunset_checked,
old.prayer_column_midnight_checked,
old.prayer_column_fast_start_end,
old.date_created,
old.date_modified,
old.user_account_id,
old.app_id);
END; 
/

CREATE TRIGGER app_portfolio.app2_user_setting_like_before_delete 
    BEFORE DELETE ON app_portfolio.app2_user_setting_like 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_like_hist
(dml,
dml_date,
app2_user_setting_like_id,
user_account_id,
app2_user_setting_id,
date_created)
VALUES
('D',
SYSDATE(),
old.id,
old.user_account_id,
old.app2_user_setting_id,
old.date_created);
END; 
/

CREATE TRIGGER app_portfolio.app2_user_setting_like_before_insert 
    BEFORE INSERT ON app_portfolio.app2_user_setting_like 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_like_hist
(dml,
dml_date,
user_setting_like_id,
user_account_id,
app2_user_setting_id,
date_created)
VALUES
('I',
SYSDATE(),
new.id,
new.user_account_id,
new.app2_user_setting_id,
new.date_created);
END; 
/

CREATE TRIGGER app_portfolio.app2_user_setting_like_before_update 
    BEFORE UPDATE ON app_portfolio.app2_user_setting_like 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_like_hist
(dml,
dml_date,
app2_user_setting_like_id,
user_account_id,
app2_user_setting_id,
date_created)
VALUES
('U',
SYSDATE(),
old.id,
old.user_account_id,
old.app2_user_setting_id,
old.date_created);
END; 
/
CREATE TRIGGER app_portfolio.app2_user_setting_view_before_delete 
    BEFORE DELETE ON app_portfolio.app2_user_setting_view 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_view_hist
(dml,
dml_date,
user_account_id,
app2_user_setting_id,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('D',
SYSDATE(),
old.user_account_id,
old.app2_user_setting_id,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
CREATE TRIGGER app_portfolio.app2_user_setting_view_before_insert 
    BEFORE INSERT ON app_portfolio.app2_user_setting_view 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_view_hist
(dml,
dml_date,
user_account_id,
app2_user_setting_id,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('I',
SYSDATE(),
new.user_account_id,
new.app2_user_setting_id,
new.client_ip,
new.client_user_agent,
new.client_longitude,
new.client_latitude,
new.date_created);
END; 
/
CREATE TRIGGER app_portfolio.app2_user_setting_view_before_update 
    BEFORE UPDATE ON app_portfolio.app2_user_setting_view 
    FOR EACH ROW 
BEGIN
INSERT INTO app2_user_setting_view_hist
(dml,
dml_date,
user_account_id,
app2_user_setting_id,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('U',
SYSDATE(),
old.user_account_id,
old.app2_user_setting_id,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/

CREATE TRIGGER app_portfolio.profile_search_before_delete 
    BEFORE DELETE ON app_portfolio.profile_search 
    FOR EACH ROW 
BEGIN
INSERT INTO profile_search_hist
(dml,
dml_date,
user_account_id,
search,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('D',
SYSDATE(),
old.user_account_id,
old.search,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
CREATE TRIGGER app_portfolio.profile_search_before_insert 
    BEFORE INSERT ON app_portfolio.profile_search 
    FOR EACH ROW 
BEGIN
INSERT INTO profile_search_hist
(dml,
dml_date,
user_account_id,
search,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('I',
SYSDATE(),
new.user_account_id,
new.search,
new.client_ip,
new.client_user_agent,
new.client_longitude,
new.client_latitude,
new.date_created);
END; 
/
CREATE TRIGGER app_portfolio.profile_search_before_update 
    BEFORE UPDATE ON app_portfolio.profile_search 
    FOR EACH ROW 
BEGIN
INSERT INTO profile_search_hist
(dml,
dml_date,
user_account_id,
search,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('U',
SYSDATE(),
old.user_account_id,
old.search,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/

CREATE TRIGGER app_portfolio.user_account_app_before_delete 
    BEFORE DELETE ON app_portfolio.user_account_app 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_app_hist
(dml,
dml_date,
user_account_id,
app_id,
preference_locale,
regional_setting_preference_timezone_id,
regional_setting_preference_direction_id,
regional_setting_preference_arabic_script_id,
date_created)
VALUES
('D',
SYSDATE(),
old.user_account_id,
old.app_id,
old.preference_locale,
old.regional_setting_preference_timezone_id,
old.regional_setting_preference_direction_id,
old.regional_setting_preference_arabic_script_id,
old.date_created);
END; 
/
CREATE TRIGGER app_portfolio.user_account_app_before_insert 
    BEFORE INSERT ON app_portfolio.user_account_app 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_app_hist
(dml,
dml_date,
user_account_id,
app_id,
preference_locale,
regional_setting_preference_timezone_id,
regional_setting_preference_direction_id,
regional_setting_preference_arabic_script_id,
date_created)
VALUES
('I',
SYSDATE(),
new.user_account_id,
new.app_id,
new.preference_locale,
new.regional_setting_preference_timezone_id,
new.regional_setting_preference_direction_id,
new.regional_setting_preference_arabic_script_id,
new.date_created);
END; 
/
CREATE TRIGGER app_portfolio.user_account_app_before_update 
    BEFORE UPDATE ON app_portfolio.user_account_app 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_app_hist
(dml,
dml_date,
user_account_id,
app_id,
preference_locale,
regional_setting_preference_timezone_id,
regional_setting_preference_direction_id,
regional_setting_preference_arabic_script_id,
date_created)
VALUES
('U',
SYSDATE(),
old.user_account_id,
old.app_id,
old.preference_locale,
old.regional_setting_preference_timezone_id,
old.regional_setting_preference_direction_id,
old.regional_setting_preference_arabic_script_id,
old.date_created);
END; 
/

CREATE TRIGGER app_portfolio.user_account_before_delete 
    BEFORE DELETE ON app_portfolio.user_account 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_hist
	(dml,
	dml_date,
	user_account_id,
    username,
	bio,
	private,
	user_level,
	date_created,
	date_modified,
	password,
	password_reminder,
	email,
    email_unverified,
	avatar,
	verification_code,
	active,
	identity_provider_id,
	provider_id,
	provider_first_name,
	provider_last_name,
	provider_image_url,
	provider_email)
	VALUES
	('D',
	SYSDATE(),
	old.id,
    old.username,
	old.bio,
	old.private,
	old.user_level,
	old.date_created,
	old.date_modified,
	old.password,
	old.password_reminder,
	old.email,
    old.email_unverified,
	null,
	old.verification_code,
	old.active,
	old.identity_provider_id,
	old.provider_id,
	old.provider_first_name,
	old.provider_last_name,
	old.provider_image_url,
	old.provider_email);
END; 
/
		
CREATE TRIGGER app_portfolio.user_account_before_insert 
    BEFORE INSERT ON app_portfolio.user_account 
    FOR EACH ROW 
	BEGIN
	IF new.provider_id IS NOT NULL THEN
        SET new.password = null;
		SET new.password_reminder = null;
		SET new.email = null;
        SET new.email_unverified = null;
		SET new.avatar = null;
		SET new.verification_code = null;
	END IF;
    IF (LENGTH(new.username) < 5 OR LENGTH(new.username) > 100) THEN 
		signal SQLSTATE '45000'
		SET message_text = 'username 5 - 100 characters', MYSQL_ERRNO = 20100;
	ELSEIF (new.username LIKE '% %' OR 
		   new.username LIKE '%?%' OR
		   new.username LIKE '%/%' OR
		   new.username LIKE '%+%' OR
             new.username LIKE '%"%' OR
             new.username LIKE "%'%") THEN 
		signal SQLSTATE '45000'
		SET message_text = 'not valid username', MYSQL_ERRNO = 20101;
	ELSEIF (LENGTH(new.bio) > 100) THEN 
		signal SQLSTATE '45000'
		SET message_text = 'bio max 100 characters', MYSQL_ERRNO = 20102;
	ELSEIF (LENGTH(new.email) > 100) THEN 
		signal SQLSTATE '45000'
		SET message_text = 'email max 100 characters', MYSQL_ERRNO = 20103;
	ELSEIF (LENGTH(new.password_reminder) > 100) THEN 
		signal SQLSTATE '22001'
		SET message_text = 'reminder max 100 characters', MYSQL_ERRNO = 20104;
	ELSEIF NOT REGEXP_LIKE(new.email, '^[A-Za-z]+[A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$') THEN
		signal SQLSTATE '45000'
		SET message_text = 'not valid email', MYSQL_ERRNO = 20105;
	ELSEIF NOT REGEXP_LIKE(new.email_unverified, '^[A-Za-z]+[A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$') THEN
		signal SQLSTATE '45000'
		SET message_text = 'not valid email', MYSQL_ERRNO = 20105;
	ELSEIF new.provider_id IS NULL AND
		   (new.username IS NULL OR new.password IS NULL OR new.email IS NULL) THEN 
           signal SQLSTATE '45000'
		SET message_text = 'Username, password and email are required', MYSQL_ERRNO = 20107;
    END IF;
	INSERT INTO user_account_hist
	(dml,
	dml_date,
	user_account_id,
    username,
	bio,
	private,
	user_level,
	date_created,
	date_modified,
	password,
	password_reminder,
	email,
    email_unverified,
	avatar,
	verification_code,
	active,
	identity_provider_id,
	provider_id,
	provider_first_name,
	provider_last_name,
	provider_image_url,
	provider_email)
	VALUES
	('I',
	SYSDATE(),
	new.id,
    new.username,
	new.bio,
	new.private,
	new.user_level,
	new.date_created,
	new.date_modified,
	new.password,
	new.password_reminder,
	new.email,
    new.email_unverified,
	null,
	new.verification_code,
	new.active,
	new.identity_provider_id,
	new.provider_id,
	new.provider_first_name,
	new.provider_last_name,
	new.provider_image_url,
	new.provider_email);
END; 
/

CREATE TRIGGER app_portfolio.user_account_before_update 
    BEFORE UPDATE ON app_portfolio.user_account 
    FOR EACH ROW 
    BEGIN
	IF new.provider_id IS NOT NULL THEN
        SET new.password = null;
		SET new.password_reminder = null;
		SET new.email = null;
        SET new.email_unverified = null;
		SET new.avatar = null;
		SET new.verification_code = null;
	END IF;
    IF (LENGTH(new.username) < 5 OR LENGTH(new.username) > 100) THEN 
		signal SQLSTATE '45000'
		SET message_text = 'username 5 - 100 characters', MYSQL_ERRNO = 20100;
	ELSEIF (new.username LIKE '% %' OR 
		   new.username LIKE '%?%' OR
		   new.username LIKE '%/%' OR
		   new.username LIKE '%+%' OR
             new.username LIKE '%"%' OR
             new.username LIKE "%'%") THEN 
		signal SQLSTATE '45000'
		SET message_text = 'not valid username', MYSQL_ERRNO = 20101;
	ELSEIF (LENGTH(new.bio) > 100) THEN 
		signal SQLSTATE '45000'
		SET message_text = 'bio max 100 characters', MYSQL_ERRNO = 20102;
	ELSEIF (LENGTH(new.email) > 100) THEN 
		signal SQLSTATE '45000'
		SET message_text = 'email max 100 characters', MYSQL_ERRNO = 20103;
	ELSEIF (LENGTH(new.password_reminder) > 100) THEN 
		signal SQLSTATE '22001'
		SET message_text = 'reminder max 100 characters', MYSQL_ERRNO = 20104;
	ELSEIF NOT REGEXP_LIKE(new.email, '^[A-Za-z]+[A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$') THEN
		signal SQLSTATE '45000'
		SET message_text = 'not valid email', MYSQL_ERRNO = 20105;
	ELSEIF NOT REGEXP_LIKE(new.email_unverified, '^[A-Za-z]+[A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$') THEN
		signal SQLSTATE '45000'
		SET message_text = 'not valid email', MYSQL_ERRNO = 20105;
	ELSEIF new.provider_id IS NULL AND
		   (new.username IS NULL OR new.password IS NULL OR new.email IS NULL) THEN 
           signal SQLSTATE '45000'
		SET message_text = 'Username, password and email are required', MYSQL_ERRNO = 20107;
	END IF;
	INSERT INTO user_account_hist
		(dml,
		dml_date,
		user_account_id,
        username,
		bio,
		private,
		user_level,
		date_created,
		date_modified,
		password,
		password_reminder,
		email,
        email_unverified,
		avatar,
		verification_code,
		active,
        identity_provider_id,
        provider_id,
        provider_first_name,
        provider_last_name,
        provider_image_url,
        provider_email)
		VALUES
		('U',
		SYSDATE(),
		old.id,
        old.username,
		old.bio,
		old.private,
		old.user_level,
		old.date_created,
		old.date_modified,
		old.password,
		old.password_reminder,
		old.email,
        old.email_unverified,
		null,
		old.verification_code,
		old.active,
        old.identity_provider_id,
        old.provider_id,
        old.provider_first_name,
        old.provider_last_name,
        old.provider_image_url,
        old.provider_email);
END;
/

CREATE TRIGGER app_portfolio.user_account_follow_before_delete 
    BEFORE DELETE ON app_portfolio.user_account_follow 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_follow_hist
(dml,
dml_date,
user_account_follow_id,
user_account_id,
user_account_id_follow,
date_created)
VALUES
('D',
SYSDATE(),
old.id,
old.user_account_id,
old.user_account_id_follow,
old.date_created);
END; 
/

CREATE TRIGGER app_portfolio.user_account_follow_before_insert 
    BEFORE INSERT ON app_portfolio.user_account_follow 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_follow_hist
(dml,
dml_date,
user_account_follow_id,
user_account_id,
user_account_id_follow,
date_created)
VALUES
('I',
SYSDATE(),
new.id,
new.user_account_id,
new.user_account_id_follow,
new.date_created);
END; 
/

CREATE TRIGGER app_portfolio.user_account_follow_before_update 
    BEFORE UPDATE ON app_portfolio.user_account_follow 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_follow_hist
(dml,
dml_date,
user_account_follow_id,
user_account_id,
user_account_id_follow,
date_created)
VALUES
('U',
SYSDATE(),
old.id,
old.user_account_id,
old.user_account_id_follow,
old.date_created);
END; 
/

CREATE TRIGGER app_portfolio.user_account_like_before_delete 
    BEFORE DELETE ON app_portfolio.user_account_like 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_like_hist
(dml,
dml_date,
user_account_like_id,
user_account_id,
user_account_id_like,
date_created)
VALUES
('D',
SYSDATE(),
old.id,
old.user_account_id,
old.user_account_id_like,
old.date_created);
END; 
/

CREATE TRIGGER app_portfolio.user_account_like_before_insert 
    BEFORE INSERT ON app_portfolio.user_account_like 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_like_hist
(dml,
dml_date,
user_account_like_id,
user_account_id,
user_account_id_like,
date_created)
VALUES
('I',
SYSDATE(),
new.id,
new.user_account_id,
new.user_account_id_like,
new.date_created);
END; 
/

CREATE TRIGGER app_portfolio.user_account_like_before_update 
    BEFORE UPDATE ON app_portfolio.user_account_like 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_like_hist
(dml,
dml_date,
user_account_like_id,
user_account_id,
user_account_id_like,
date_created)
VALUES
('U',
SYSDATE(),
old.id,
old.user_account_id,
old.user_account_id_like,
old.date_created);
END; 
/
CREATE TRIGGER app_portfolio.user_account_logon_before_delete 
    BEFORE DELETE ON app_portfolio.user_account_logon 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_logon_hist
(dml,
dml_date,
user_account_id,
app_id,
result,
access_token,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('D',
SYSDATE(),
old.user_account_id,
old.app_id,
old.result,
old.access_token,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
CREATE TRIGGER app_portfolio.user_account_logon_before_insert 
    BEFORE INSERT ON app_portfolio.user_account_logon 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_logon_hist
(dml,
dml_date,
user_account_id,
app_id,
result,
access_token,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('I',
SYSDATE(),
new.user_account_id,
new.app_id,
new.result,
new.access_token,
new.client_ip,
new.client_user_agent,
new.client_longitude,
new.client_latitude,
new.date_created);
END; 
/
CREATE TRIGGER app_portfolio.user_account_logon_before_update 
    BEFORE UPDATE ON app_portfolio.user_account_logon 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_logon_hist
(dml,
dml_date,
user_account_id,
app_id,
result,
access_token,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('U',
SYSDATE(),
old.user_account_id,
old.app_id,
old.result,
old.access_token,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
CREATE TRIGGER app_portfolio.user_account_view_before_delete 
    BEFORE DELETE ON app_portfolio.user_account_view 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_view_hist
(dml,
dml_date,
user_account_id,
user_account_id_view,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('D',
SYSDATE(),
old.user_account_id,
old.user_account_id_view,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
CREATE TRIGGER app_portfolio.user_account_view_before_insert 
    BEFORE INSERT ON app_portfolio.user_account_view 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_view_hist
(dml,
dml_date,
user_account_id,
user_account_id_view,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('I',
SYSDATE(),
new.user_account_id,
new.user_account_id_view,
new.client_ip,
new.client_user_agent,
new.client_longitude,
new.client_latitude,
new.date_created);
END; 
/
CREATE TRIGGER app_portfolio.user_account_view_before_update 
    BEFORE UPDATE ON app_portfolio.user_account_view 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_view_hist
(dml,
dml_date,
user_account_id,
user_account_id_view,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('U',
SYSDATE(),
old.user_account_id,
old.user_account_id_view,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
