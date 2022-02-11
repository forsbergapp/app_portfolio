--modified manually after SQL Developer Data modeler file generation to Mysql syntax
CREATE TABLE app (
    id        INTEGER NOT NULL,
    app_name  VARCHAR(100) NOT NULL,
    url       VARCHAR(100),
    logo      VARCHAR(100),
	CONSTRAINT app_pk PRIMARY KEY ( id )
);

CREATE TABLE app_log (
    id                           INT NOT NULL AUTO_INCREMENT,
    app_module                   VARCHAR(100),
    app_module_type              VARCHAR(100),
    app_module_request           VARCHAR(100),
    app_module_result            VARCHAR(4000),
    app_user_id                  VARCHAR(100),
    user_language                VARCHAR(100),
    user_timezone                VARCHAR(100),
    user_number_system           VARCHAR(100),
    user_platform                VARCHAR(100),
    user_gps_latitude            VARCHAR(100),
    user_gps_longitude           VARCHAR(100),
    server_remote_addr           VARCHAR(100),
    server_user_agent            VARCHAR(500),
    server_http_host             VARCHAR(100),
    server_http_accept_language  VARCHAR(100),
    date_created                 DATETIME,
	app_id                       INTEGER NOT NULL,
	CONSTRAINT app_log_pk PRIMARY KEY ( id )
);

ALTER TABLE app_log MODIFY COLUMN app_log.app_module VARCHAR(100) COMMENT
    'INIT
AUTH
MAIL
GEOLOCATION
REPORT
WORLDCITIES';

ALTER TABLE app_log MODIFY COLUMN app_log.app_module_type VARCHAR(100) COMMENT
    'INIT 			
AUTH_TOKEN_GET
send:
MAIL_SIGNUP			1 //Template, signup
MAIL_UNVERIFIED		2 //Template, unverified user
			 	     when logging in
MAIL_RESET_PASSWORD	3 //Template, reset password
MAIL_CHANGE_EMAIL		4 //Template, change email
read:
MAIL_SIGNUP_READ		1 //Read email, signup
MAIL_UNVERIFIED_READ	2 //Read email, unverified user
				     when logging in
MAIL_RESET_PASSWORD_READ	3 //Read email, reset password
MAIL_CHANGE_EMAIL_READ	4 //Read email, change email
MAIL_LOGO_READ		Read only logo used in email

GEOLOCATION_PLACE
GEOLOCATION_IP
REPORT_TIMETABLE_DAY
REPORT_TIMETABLE_MONTH
REPORT_TIMETABLE_YEAR
WORLDCITIES_CITIES';

ALTER TABLE app_log MODIFY COLUMN app_log.app_module_request VARCHAR(100) COMMENT
    'INIT: 
AUTH_TOKEN_GET:	AT: token, DT: token
MAIL%: 		emailaddress
GEOLOCATION%: 	url
REPORT%: 		url
WORLDCITIES%:	countrycode';

ALTER TABLE app_log MODIFY COLUMN app_log.app_module_result VARCHAR(100) COMMENT
    'successful info or any error message';

ALTER TABLE app_log MODIFY COLUMN user_language VARCHAR(100) COMMENT
    'navigator.language';

ALTER TABLE app_log MODIFY COLUMN user_timezone VARCHAR(100) COMMENT
    'Intl.DateTimeFormat().resolvedOptions().timeZone;';

ALTER TABLE app_log MODIFY COLUMN user_number_system VARCHAR(100) COMMENT
    'Intl.NumberFormat().resolvedOptions().numberingSystem';

ALTER TABLE app_log MODIFY COLUMN user_platform VARCHAR(100) COMMENT
    'navigator.platform';

CREATE TABLE app_message (
    message_code      VARCHAR(100) NOT NULL,
    app_id            INTEGER NOT NULL
	CONSTRAINT app_message_pk PRIMARY KEY ( message_code,
                                            app_id )
);

CREATE TABLE app_object (
    app_id       INTEGER NOT NULL,
    object_name  VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_pk PRIMARY KEY ( object_name,
                                           app_id )
);

ALTER TABLE app_object ADD CONSTRAINT app_object_object_name_un UNIQUE ( object_name );

CREATE TABLE app_object_item (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_item_pk PRIMARY KEY ( object_name,
	                                                    app_id,
	                                                    object_item_name )
);

CREATE TABLE app_object_item_subitem (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
    subitem_name      VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_item_subitem_pk PRIMARY KEY ( subitem_name,
	                                                            object_item_name,
	                                                            object_name,
	                                                            app_id )
);


CREATE TABLE app_object_item_subitem_fixed (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
    subitem_name      VARCHAR(100) NOT NULL,
    subitem_text      VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_item_subitem_fixed_pk PRIMARY KEY ( subitem_name,
	                                                                  object_item_name,
	                                                                  object_name,
	                                                                  app_id )
);


CREATE TABLE app_object_item_translation (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
    language_id       INTEGER NOT NULL,
    text              VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_item_translation_pk PRIMARY KEY ( language_id,
	                                                                object_item_name,
	                                                                object_name,
	                                                                app_id )
);


CREATE TABLE app_object_subitem_translation (
    app_id            INTEGER NOT NULL,
    object_name       VARCHAR(100) NOT NULL,
    object_item_name  VARCHAR(100) NOT NULL,
    subitem_name      VARCHAR(100) NOT NULL,
    language_id       INTEGER NOT NULL,
    text              VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_subitem_translation_pk PRIMARY KEY ( language_id,
	                                                                   subitem_name,
	                                                                   object_item_name,
	                                                                   object_name,
	                                                                   app_id )
);
CREATE TABLE app_object_translation (
    app_id      INTEGER NOT NULL,
    object_name VARCHAR(100) NOT NULL,
    language_id INTEGER NOT NULL,
    text        VARCHAR(100) NOT NULL,
    CONSTRAINT app_object_translation_pk PRIMARY KEY ( app_id,
                                                           object_name,
                                                           language_id )
);

CREATE TABLE app_parameter (
    app_id             INTEGER NOT NULL,
    parameter_type_id  VARCHAR(100) NOT NULL,
    parameter_name     VARCHAR(100) NOT NULL,
    parameter_value    VARCHAR(100),
    parameter_comment  VARCHAR(100),
	CONSTRAINT app_parameter_pk PRIMARY KEY ( app_id,
	                                                  parameter_name )
);

CREATE TABLE app_timetables_place (
    id               INTEGER NOT NULL,
    title            VARCHAR(100) NOT NULL,
    latitude         VARCHAR(100),
    longitude        VARCHAR(100),
    timezone         VARCHAR(100),
    country1_id      INTEGER NOT NULL,
    country2_id      INTEGER,
    group_place1_id  INTEGER NOT NULL,
    group_place2_id  INTEGER NOT NULL,
	CONSTRAINT app_timetables_place_pk PRIMARY KEY ( id )
);

CREATE TABLE app_timetables_theme (
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
    theme_type_id         INTEGER NOT NULL,
    theme_category_id     INTEGER NOT NULL,
	CONSTRAINT app_timetables_theme_pk PRIMARY KEY ( id )
);

CREATE TABLE app_timetables_user_setting (
    id                                         INT NOT NULL AUTO_INCREMENT,
    description                                VARCHAR(100),
    regional_language_locale	               VARCHAR(100),
    regional_current_timezone_select_id        DECIMAL(10,0),
    regional_timezone_select_id                DECIMAL(10,0),
    regional_number_system_select_id           DECIMAL(10,0),
    regional_layout_direction_select_id        DECIMAL(10,0),
    regional_second_language_locale		       VARCHAR(100),
    regional_column_title_select_id            DECIMAL(10,0),
    regional_arabic_script_select_id           DECIMAL(10,0),
    regional_calendar_type_select_id           DECIMAL(10,0),
    regional_calendar_hijri_type_select_id     DECIMAL(10,0),
    gps_map_type_select_id                     DECIMAL(10,0),
    gps_country_id                             INTEGER,
    gps_city_id                                INTEGER,
    gps_popular_place_id                       INTEGER,
    gps_lat_text                               VARCHAR(100),
    gps_long_text                              VARCHAR(100),
    design_theme_day_id                        INTEGER,
    design_theme_month_id                      INTEGER,
    design_theme_year_id                       INTEGER,
    design_paper_size_select_id                DECIMAL(10,0),
    design_row_highlight_select_id             DECIMAL(10,0),
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
    prayer_method_select_id                    DECIMAL(10,0),
    prayer_asr_method_select_id                DECIMAL(10,0),
    prayer_high_latitude_adjustment_select_id  DECIMAL(10,0),
    prayer_time_format_select_id               DECIMAL(10,0),
    prayer_hijri_date_adjustment_select_id     DECIMAL(10,0),
    prayer_fajr_iqamat_select_id               DECIMAL(10,0),
    prayer_dhuhr_iqamat_select_id              DECIMAL(10,0),
    prayer_asr_iqamat_select_id                DECIMAL(10,0),
    prayer_maghrib_iqamat_select_id            DECIMAL(10,0),
    prayer_isha_iqamat_select_id               DECIMAL(10,0),
    prayer_column_imsak_checked                DECIMAL(1,0),
    prayer_column_sunset_checked               DECIMAL(1,0),
    prayer_column_midnight_checked             DECIMAL(1,0),
    prayer_column_fast_start_end_select_id     DECIMAL(10,0),
    date_created                               DATETIME,
    date_modified                              DATETIME,
    user_account_id                            INT NOT NULL,
	CONSTRAINT app_timetables_user_setting_pk PRIMARY KEY ( id )
);

ALTER TABLE app_timetables_user_setting
    ADD CONSTRAINT arc_1 CHECK ( ( ( gps_country_id IS NOT NULL )
                                   AND ( gps_popular_place_id IS NULL ) )
                                 OR ( ( gps_popular_place_id IS NOT NULL )
                                      AND ( gps_country_id IS NULL ) )
                                 OR ( ( gps_country_id IS NULL )
                                      AND ( gps_popular_place_id IS NULL ) ) );

CREATE TABLE app_timetables_user_setting_hist (
    id                                         INT NOT NULL AUTO_INCREMENT,
    dml                                        VARCHAR(1),
    dml_date                                   DATETIME,
    user_setting_id                            INTEGER,
    description                                VARCHAR(100),
    regional_language_locale	               VARCHAR(100),
    regional_current_timezone_select_id        DECIMAL(10,0),
    regional_timezone_select_id                DECIMAL(10,0),
    regional_number_system_select_id           DECIMAL(10,0),
    regional_layout_direction_select_id        DECIMAL(10,0),
    regional_second_language_locale		       VARCHAR(100),
    regional_column_title_select_id            DECIMAL(10,0),
    regional_arabic_script_select_id           DECIMAL(10,0),
    regional_calendar_type_select_id           DECIMAL(10,0),
    regional_calendar_hijri_type_select_id     DECIMAL(10,0),
    gps_map_type_select_id                     DECIMAL(10,0),
    gps_country_id                             INTEGER,
    gps_city_id                                INTEGER,
    gps_popular_place_id                       INTEGER,
    gps_lat_text                               VARCHAR(100),
    gps_long_text                              VARCHAR(100),
    design_theme_day_id                        INTEGER,
    design_theme_month_id                      INTEGER,
    design_theme_year_id                       INTEGER,
    design_paper_size_select_id                DECIMAL(10,0),
    design_row_highlight_select_id             DECIMAL(10,0),
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
    prayer_method_select_id                    DECIMAL(10,0),
    prayer_asr_method_select_id                DECIMAL(10,0),
    prayer_high_latitude_adjustment_select_id  DECIMAL(10,0),
    prayer_time_format_select_id               DECIMAL(10,0),
    prayer_hijri_date_adjustment_select_id     DECIMAL(10,0),
    prayer_fajr_iqamat_select_id               DECIMAL(10,0),
    prayer_dhuhr_iqamat_select_id              DECIMAL(10,0),
    prayer_asr_iqamat_select_id                DECIMAL(10,0),
    prayer_maghrib_iqamat_select_id            DECIMAL(10,0),
    prayer_isha_iqamat_select_id               DECIMAL(10,0),
    prayer_column_imsak_checked                DECIMAL(1,0),
    prayer_column_sunset_checked               DECIMAL(1,0),
    prayer_column_midnight_checked             DECIMAL(1,0),
    prayer_column_fast_start_end_select_id     DECIMAL(10,0),
    date_created                               DATETIME,
    date_modified                              DATETIME,
    user_account_id                            INT NOT NULL,
	CONSTRAINT app_timetables_user_setting_hist_pk PRIMARY KEY ( id )
);

CREATE TABLE app_timetables_user_setting_like (
    id               INT NOT NULL AUTO_INCREMENT,
    user_account_id  INTEGER NOT NULL,
    user_setting_id  INTEGER NOT NULL,
	date_created     DATETIME,	
	CONSTRAINT app_timetables_user_setting_like_pk PRIMARY KEY ( user_account_id, user_setting_id )
);
ALTER TABLE app_timetables_user_setting_like ADD CONSTRAINT app_timetables_user_setting_like_un UNIQUE ( id );

CREATE TABLE app_timetables_user_setting_like_hist (
    id                    INT NOT NULL AUTO_INCREMENT,
    dml                   VARCHAR(1),
    dml_date              DATETIME,
    user_setting_like_id  INTEGER,
    user_account_id       INTEGER,
    user_setting_id       INTEGER,
    date_created          DATETIME,
	CONSTRAINT app_timetables_user_setting_like_hist_pk PRIMARY KEY ( id )
);

CREATE TABLE app_timetables_user_setting_view (
    user_account_id    INTEGER,
    user_setting_id    INTEGER NOT NULL,
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       DATETIME NOT NULL
);

CREATE TABLE app_timetables_user_setting_view_hist (
    id                 INT NOT NULL AUTO_INCREMENT,
    dml                VARCHAR(1),
    dml_date           DATETIME,
    user_account_id    INTEGER,
    user_setting_id    INTEGER,
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_latitude    VARCHAR(100),
    client_longitude   VARCHAR(100),
    date_created       DATETIME,
	CONSTRAINT app_timetables_user_setting_view_hist_pk PRIMARY KEY ( id )
);

CREATE TABLE country (
    id            INT NOT NULL AUTO_INCREMENT,
    country_code  VARCHAR(10) NOT NULL,
    flag_emoji    VARCHAR(10),
    flag_url      VARCHAR(100),
    country_group_id  INTEGER NOT NULL,
	CONSTRAINT country_pk PRIMARY KEY ( id )
);

CREATE TABLE country_group (
    id          INT NOT NULL AUTO_INCREMENT,
    group_name  VARCHAR(100) NOT NULL,
	CONSTRAINT country_group_pk PRIMARY KEY ( id )
);


CREATE TABLE country_translation (
    country_id   INTEGER NOT NULL,
    language_id  INTEGER NOT NULL,
    text         VARCHAR(100) NOT NULL,
	CONSTRAINT country_translation_pk PRIMARY KEY ( country_id,
	                                                language_id )
);

CREATE TABLE group_place (
    id          INT NOT NULL AUTO_INCREMENT,
    group_name  VARCHAR(100) NOT NULL,
    icon_emoji  VARCHAR(10) NOT NULL,
    icon_url    VARCHAR(100),
	CONSTRAINT group_pk PRIMARY KEY ( id )
);

ALTER TABLE group_place ADD CONSTRAINT group_group_name_un UNIQUE ( group_name );

CREATE TABLE language (
    id         INT NOT NULL AUTO_INCREMENT,
    lang_code  VARCHAR(10) NOT NULL,
	CONSTRAINT language_pk PRIMARY KEY ( id )
);

CREATE INDEX lang_code_index ON
    language (
        lang_code
    ASC );

CREATE TABLE language_translation (
    language_id              INTEGER NOT NULL,
    language_translation_id  INTEGER NOT NULL,
    text                     VARCHAR(100) NOT NULL,
	CONSTRAINT language_translation_pk PRIMARY KEY ( language_translation_id,
	                                                 language_id )
);

CREATE TABLE locale (
    language_id  INTEGER NOT NULL,
    country_id   INTEGER
);

ALTER TABLE locale ADD CONSTRAINT locale_un UNIQUE ( language_id,
                                                     country_id );

CREATE TABLE message (
    message_level_id INTEGER NOT NULL,
    message_type_id  INTEGER NOT NULL,
    code             VARCHAR(100) NOT NULL,
    CONSTRAINT message_pk PRIMARY KEY ( code );
);

CREATE TABLE message_level (
    id             INT NOT NULL AUTO_INCREMENT,
    message_level  VARCHAR(10) NOT NULL,
	CONSTRAINT message_level_pk PRIMARY KEY ( id )
);


ALTER TABLE message_level ADD CONSTRAINT message_level_message_level_un UNIQUE ( message_level );

CREATE TABLE message_translation (
    language_id  INTEGER NOT NULL,
    message_code VARCHAR(100) NOT NULL,
    text         VARCHAR(100),
    CONSTRAINT message_translation_pk PRIMARY KEY ( language_id,
                                                    message_code );
);

CREATE TABLE message_type (
    id            INT NOT NULL AUTO_INCREMENT,
    message_type  VARCHAR(10) NOT NULL,
	CONSTRAINT message_type_pk PRIMARY KEY ( id )
);

ALTER TABLE message_type ADD CONSTRAINT message_type_message_type_un UNIQUE ( message_type );


CREATE TABLE parameter_type (
    id VARCHAR(100) NOT NULL,
    name VARCHAR2(100) NOT NULL
);

ALTER TABLE parameter_type ADD CONSTRAINT parameter_type_pk PRIMARY KEY ( id );

CREATE TABLE profile_search (
    user_account_id    INTEGER,
    search             VARCHAR(100) NOT NULL,
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       DATETIME NOT NULL
);

CREATE TABLE profile_search_hist (
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

CREATE TABLE theme_category (
    id     INT NOT NULL AUTO_INCREMENT,
    title  VARCHAR(100) NOT NULL,
	CONSTRAINT theme_category_pk PRIMARY KEY ( id )
);

CREATE TABLE theme_type (
    id     INT NOT NULL AUTO_INCREMENT,
    title  VARCHAR(10) NOT NULL,
	CONSTRAINT theme_type_pk PRIMARY KEY ( id )
);
	
CREATE TABLE user_account (
    id                    INT NOT NULL AUTO_INCREMENT,
    bio                   VARCHAR(150),
    private               DECIMAL(1,0),
    user_level            DECIMAL(1,0),
    date_created          DATETIME,
    date_modified         DATETIME,
    username              VARCHAR(100),
    password              VARCHAR(100),
    password_reminder     VARCHAR(100),
    email                 VARCHAR(100),
    avatar                LONGBLOB,
    validation_code       VARCHAR(6),
    active                DECIMAL(1,0),
    provider1_id          VARCHAR(21),
    provider1_first_name  VARCHAR(1000),
    provider1_last_name   VARCHAR(1000),
    provider1_image		  LONGBLOB,
    provider1_image_url   VARCHAR(1000),
    provider1_email       VARCHAR(1000),
    provider2_id          VARCHAR(15),
    provider2_first_name  VARCHAR(1000),
    provider2_last_name   VARCHAR(1000),
    provider2_image		  LONGBLOB,
    provider2_image_url   VARCHAR(1000),
    provider2_email       VARCHAR(1000),
	CONSTRAINT user_account_pk PRIMARY KEY ( id )
);


ALTER TABLE user_account ADD CONSTRAINT user_account_provider1_id_un UNIQUE ( provider1_id );

ALTER TABLE user_account ADD CONSTRAINT user_account_provider2_id_un UNIQUE ( provider2_id );

ALTER TABLE user_account ADD CONSTRAINT user_account_username_un UNIQUE ( username );

ALTER TABLE user_account ADD CONSTRAINT user_account_email_un UNIQUE ( email );

CREATE TABLE user_account_app (
    user_account_id INTEGER NOT NULL,
    app_id          INTEGER NOT NULL,
    date_created    DATETIME NOT NULL,
    CONSTRAINT user_account_app_pk PRIMARY KEY ( app_id,
                                                user_account_id );
);

CREATE TABLE user_account_app_hist (
    id              INTEGER NOT NULL,
    dml             VARCHAR(1),
    dml_date        DATE,
    user_account_id INTEGER,
    app_id          INTEGER,
    date_created    DATE,
    CONSTRAINT user_account_app_hist_pk PRIMARY KEY ( id );
);

CREATE TABLE user_account_follow (
    id                      INT NOT NULL AUTO_INCREMENT,
    user_account_id         INTEGER NOT NULL,
    user_account_id_follow  INTEGER NOT NULL,
	date_created            DATETIME,
	CONSTRAINT user_account_follow_pk PRIMARY KEY ( user_account_id, user_account_id_follow )
);
ALTER TABLE user_account_follow ADD CONSTRAINT user_account_follow_un UNIQUE ( id );

CREATE TABLE user_account_follow_hist (
    id                      INT NOT NULL AUTO_INCREMENT,
    dml                     VARCHAR(1),
    dml_date                DATETIME,
    user_account_follow_id  INTEGER,
    user_account_id         INTEGER,
    user_account_id_follow  INTEGER,
    date_created            DATETIME,
	CONSTRAINT user_account_follow_hist_pk PRIMARY KEY ( id )
);

CREATE TABLE user_account_hist (
    id                    INT NOT NULL AUTO_INCREMENT,
    dml                   VARCHAR(1),
    dml_date              DATETIME,
    user_account_id       INTEGER,
    bio                   VARCHAR(150),
    private               DECIMAL(1,0),
    user_level            DECIMAL(1,0),
    date_created          DATETIME,
    date_modified         DATETIME,
    username              VARCHAR(100),
    password              VARCHAR(100),
    password_reminder     VARCHAR(100),
    email                 VARCHAR(100),
    avatar                LONGBLOB,
    validation_code       VARCHAR(6),
    active                DECIMAL(1,0),
    provider1_id          VARCHAR(21),
    provider1_first_name  VARCHAR(1000),
    provider1_last_name   VARCHAR(1000),
    provider1_image_url   VARCHAR(1000),
    provider1_email       VARCHAR(1000),
    provider2_id          VARCHAR(15),
    provider2_first_name  VARCHAR(1000),
    provider2_last_name   VARCHAR(1000),
    provider2_image_url   VARCHAR(1000),
    provider2_email       VARCHAR(1000),
	CONSTRAINT user_account_hist_pk PRIMARY KEY ( id )
);

CREATE TABLE user_account_like (
    id                    INT NOT NULL AUTO_INCREMENT,
    user_account_id       INTEGER NOT NULL,
    user_account_id_like  INTEGER NOT NULL,
	date_created          DATETIME,
	CONSTRAINT user_account_like_pk PRIMARY KEY ( user_account_id, user_account_id_like )
);
ALTER TABLE user_account_like ADD CONSTRAINT user_account_like_un UNIQUE ( id );

CREATE TABLE user_account_like_hist (
    id                    INT NOT NULL AUTO_INCREMENT,
    dml                   VARCHAR(1),
    dml_date              DATETIME,
    user_account_like_id  INTEGER,
    user_account_id       INTEGER,
    user_account_id_like  INTEGER,
    date_created          DATETIME,
	CONSTRAINT user_account_like_hist_pk PRIMARY KEY ( id )
);

CREATE TABLE user_account_logon (
    user_account_id    INTEGER NOT NULL,
    app_id             INTEGER NOT NULL,
    result             INTEGER NOT NULL,
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       DATETIME NOT NULL
);

CREATE TABLE user_account_logon_hist (
    id                 INT NOT NULL AUTO_INCREMENT,
    dml_type           VARCHAR(1),
    dml_date           DATETIME,
    user_account_id    INTEGER,
    app_id             INTEGER,
    result             INTEGER,
    client_ip          VARCHAR(100),
    client_user_agent  VARCHAR(500),
    client_latitude    VARCHAR(100),
    client_longitude   VARCHAR(100),
    date_created       DATETIME,
	CONSTRAINT user_account_logon_hist_pk PRIMARY KEY ( id )
);

CREATE TABLE user_account_view (
    user_account_id       INTEGER,
    user_account_id_view  INTEGER NOT NULL,
    client_ip             VARCHAR(100),
    client_user_agent     VARCHAR(500),
    client_longitude      VARCHAR(100),
    client_latitude       VARCHAR(100),
    date_created          DATETIME NOT NULL
);

CREATE TABLE user_account_view_hist (
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


ALTER TABLE app_log
    ADD CONSTRAINT app_log_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_message
    ADD CONSTRAINT app_message_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_message
    ADD CONSTRAINT app_message_message_fk FOREIGN KEY ( message_code )
        REFERENCES message ( code );

ALTER TABLE app_object
    ADD CONSTRAINT app_object_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_object_item
    ADD CONSTRAINT app_object_item_app_object_fk FOREIGN KEY ( object_name,
                                                               app_id )
        REFERENCES app_object ( object_name,
                                app_id );

ALTER TABLE app_object_item_subitem
    ADD CONSTRAINT app_object_item_subitem_app_object_item_fk FOREIGN KEY ( object_name,
                                                                            app_id,
                                                                            object_item_name )
        REFERENCES app_object_item ( object_name,
                                     app_id,
                                     object_item_name );

ALTER TABLE app_object_item_subitem_fixed
    ADD CONSTRAINT app_object_item_subitem_fixed_app_object_item_fk FOREIGN KEY ( object_name,
                                                                                  app_id,
                                                                                  object_item_name )
        REFERENCES app_object_item ( object_name,
                                     app_id,
                                     object_item_name );

ALTER TABLE app_object_item_translation
    ADD CONSTRAINT app_object_item_translation_app_object_item_fk FOREIGN KEY ( object_name,
                                                                                app_id,
                                                                                object_item_name )
        REFERENCES app_object_item ( object_name,
                                     app_id,
                                     object_item_name );

ALTER TABLE app_object_item_translation
    ADD CONSTRAINT app_object_item_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_object_subitem_translation
    ADD CONSTRAINT app_object_subitem_translation_app_object_item_subitem_fk FOREIGN KEY ( subitem_name,
                                                                                           object_item_name,
                                                                                           object_name,
                                                                                           app_id )
        REFERENCES app_object_item_subitem ( subitem_name,
                                             object_item_name,
                                             object_name,
                                             app_id );

ALTER TABLE app_object_subitem_translation
    ADD CONSTRAINT app_object_subitem_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_object_translation
    ADD CONSTRAINT app_object_translation_app_object_fk FOREIGN KEY ( object_name,
                                                                      app_id )
        REFERENCES app_object ( object_name,
                                app_id );

ALTER TABLE app_object_translation
    ADD CONSTRAINT app_object_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE app_parameter
    ADD CONSTRAINT app_parameter_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE app_parameter
    ADD CONSTRAINT app_parameter_parameter_type_fk FOREIGN KEY ( parameter_type_id )
        REFERENCES parameter_type ( id );

ALTER TABLE app_timetables_place
    ADD CONSTRAINT app_timetables_place_country_fk FOREIGN KEY ( country1_id )
        REFERENCES country ( id );

ALTER TABLE app_timetables_place
    ADD CONSTRAINT app_timetables_place_country_fkv1 FOREIGN KEY ( country2_id )
        REFERENCES country ( id );

ALTER TABLE app_timetables_place
    ADD CONSTRAINT app_timetables_place_group_place_fk FOREIGN KEY ( group_place1_id )
        REFERENCES group_place ( id );

ALTER TABLE app_timetables_place
    ADD CONSTRAINT app_timetables_place_group_place_fkv1 FOREIGN KEY ( group_place2_id )
        REFERENCES group_place ( id );

ALTER TABLE app_timetables_theme
    ADD CONSTRAINT app_timetables_theme_theme_category_fk FOREIGN KEY ( theme_category_id )
        REFERENCES theme_category ( id );

ALTER TABLE app_timetables_theme
    ADD CONSTRAINT app_timetables_theme_theme_type_fk FOREIGN KEY ( theme_type_id )
        REFERENCES theme_type ( id );

ALTER TABLE app_timetables_user_setting
    ADD CONSTRAINT app_timetables_user_setting_app_timetables_place_fk FOREIGN KEY ( gps_popular_place_id )
        REFERENCES app_timetables_place ( id );

ALTER TABLE app_timetables_user_setting
    ADD CONSTRAINT app_timetables_user_setting_app_timetables_theme_fk FOREIGN KEY ( design_theme_day_id )
        REFERENCES app_timetables_theme ( id );

ALTER TABLE app_timetables_user_setting
    ADD CONSTRAINT app_timetables_user_setting_app_timetables_theme_fkv1 FOREIGN KEY ( design_theme_month_id )
        REFERENCES app_timetables_theme ( id );

ALTER TABLE app_timetables_user_setting
    ADD CONSTRAINT app_timetables_user_setting_app_timetables_theme_fkv2 FOREIGN KEY ( design_theme_year_id )
        REFERENCES app_timetables_theme ( id );

ALTER TABLE app_timetables_user_setting
    ADD CONSTRAINT app_timetables_user_setting_country_fk FOREIGN KEY ( gps_country_id )
        REFERENCES country ( id );

ALTER TABLE app_timetables_user_setting_like
    ADD CONSTRAINT app_timetables_user_setting_like_app_timetables_user_setting_fk FOREIGN KEY ( user_setting_id )
        REFERENCES app_timetables_user_setting ( id )
		ON DELETE CASCADE;

ALTER TABLE app_timetables_user_setting_like
    ADD CONSTRAINT app_timetables_user_setting_like_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE app_timetables_user_setting
    ADD CONSTRAINT app_timetables_user_setting_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id );

ALTER TABLE app_timetables_user_setting_view
    ADD CONSTRAINT app_timetables_user_setting_view_app_timetables_user_setting_fk FOREIGN KEY ( user_setting_id )
        REFERENCES app_timetables_user_setting ( id )
        ON DELETE CASCADE;

ALTER TABLE app_timetables_user_setting_view
    ADD CONSTRAINT app_timetables_user_setting_view_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
        ON DELETE CASCADE;

ALTER TABLE country
    ADD CONSTRAINT country_country_group_fk FOREIGN KEY ( country_group_id )
        REFERENCES country_group ( id );

ALTER TABLE country_translation
    ADD CONSTRAINT country_translation_country_fk FOREIGN KEY ( country_id )
        REFERENCES country ( id );

ALTER TABLE country_translation
    ADD CONSTRAINT country_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE language_translation
    ADD CONSTRAINT language_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE language_translation
    ADD CONSTRAINT language_translation_language_fkv1 FOREIGN KEY ( language_translation_id )
        REFERENCES language ( id );

ALTER TABLE locale
    ADD CONSTRAINT locale_country_fk FOREIGN KEY ( country_id )
        REFERENCES country ( id );

ALTER TABLE locale
    ADD CONSTRAINT locale_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE message
    ADD CONSTRAINT message_message_level_fk FOREIGN KEY ( message_level_id )
        REFERENCES message_level ( id );

ALTER TABLE message
    ADD CONSTRAINT message_message_type_fk FOREIGN KEY ( message_type_id )
        REFERENCES message_type ( id );

ALTER TABLE message_translation
    ADD CONSTRAINT message_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id );

ALTER TABLE message_translation
    ADD CONSTRAINT message_translation_message_fk FOREIGN KEY ( message_code )
        REFERENCES message ( code );

ALTER TABLE profile_search
    ADD CONSTRAINT profile_search_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
        ON DELETE CASCADE;

ALTER TABLE user_account_app
    ADD CONSTRAINT user_account_app_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE user_account_app
    ADD CONSTRAINT user_account_app_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id );
					
ALTER TABLE user_account_follow
    ADD CONSTRAINT user_account_follow_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE user_account_follow
    ADD CONSTRAINT user_account_follow_user_account_fkv2 FOREIGN KEY ( user_account_id_follow )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE user_account_like
    ADD CONSTRAINT user_account_like_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE user_account_like
    ADD CONSTRAINT user_account_like_user_account_fkv2 FOREIGN KEY ( user_account_id_like )
        REFERENCES user_account ( id )
		ON DELETE CASCADE;

ALTER TABLE user_account_logon
    ADD CONSTRAINT user_account_logon_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id );

ALTER TABLE user_account_logon
    ADD CONSTRAINT user_account_logon_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE user_account_view
    ADD CONSTRAINT user_account_view_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE user_account_view
    ADD CONSTRAINT user_account_view_user_account_fkv2 FOREIGN KEY ( user_account_id_view )
        REFERENCES user_account ( id )
        ON DELETE CASCADE;

CREATE TRIGGER app_timetables_user_setting_before_delete 
    BEFORE DELETE ON app_timetables_user_setting 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_hist
(dml,
dml_date,
user_setting_id,
description,
regional_language_locale,
regional_current_timezone_select_id,
regional_timezone_select_id,
regional_number_system_select_id,
regional_layout_direction_select_id,
regional_second_language_locale,
regional_column_title_select_id,
regional_arabic_script_select_id,
regional_calendar_type_select_id,
regional_calendar_hijri_type_select_id,
gps_map_type_select_id,
gps_country_id,
gps_city_id,
gps_popular_place_id,
gps_lat_text,
gps_long_text,
design_theme_day_id,
design_theme_month_id,
design_theme_year_id,
design_paper_size_select_id,
design_row_highlight_select_id,
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
prayer_method_select_id,
prayer_asr_method_select_id,
prayer_high_latitude_adjustment_select_id,
prayer_time_format_select_id,
prayer_hijri_date_adjustment_select_id,
prayer_fajr_iqamat_select_id,
prayer_dhuhr_iqamat_select_id,
prayer_asr_iqamat_select_id,
prayer_maghrib_iqamat_select_id,
prayer_isha_iqamat_select_id,
prayer_column_imsak_checked,
prayer_column_sunset_checked,
prayer_column_midnight_checked,
prayer_column_fast_start_end_select_id,
date_created,
date_modified,
user_account_id)
VALUES(
'D',
SYSDATE(),
old.id,
old.description,
old.regional_language_locale,
old.regional_current_timezone_select_id,
old.regional_timezone_select_id,
old.regional_number_system_select_id,
old.regional_layout_direction_select_id,
old.regional_second_language_locale,
old.regional_column_title_select_id,
old.regional_arabic_script_select_id,
old.regional_calendar_type_select_id,
old.regional_calendar_hijri_type_select_id,
old.gps_map_type_select_id,
old.gps_country_id,
old.gps_city_id,
old.gps_popular_place_id,
old.gps_lat_text,
old.gps_long_text,
old.design_theme_day_id,
old.design_theme_month_id,
old.design_theme_year_id,
old.design_paper_size_select_id,
old.design_row_highlight_select_id,
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
old.prayer_method_select_id,
old.prayer_asr_method_select_id,
old.prayer_high_latitude_adjustment_select_id,
old.prayer_time_format_select_id,
old.prayer_hijri_date_adjustment_select_id,
old.prayer_fajr_iqamat_select_id,
old.prayer_dhuhr_iqamat_select_id,
old.prayer_asr_iqamat_select_id,
old.prayer_maghrib_iqamat_select_id,
old.prayer_isha_iqamat_select_id,
old.prayer_column_imsak_checked,
old.prayer_column_sunset_checked,
old.prayer_column_midnight_checked,
old.prayer_column_fast_start_end_select_id,
old.date_created,
old.date_modified,
old.user_account_id);
END; 
/

CREATE TRIGGER app_timetables_user_setting_before_insert 
    BEFORE INSERT ON app_timetables_user_setting 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_hist
(dml,
dml_date,
user_setting_id,
description,
regional_language_locale,
regional_current_timezone_select_id,
regional_timezone_select_id,
regional_number_system_select_id,
regional_layout_direction_select_id,
regional_second_language_locale,
regional_column_title_select_id,
regional_arabic_script_select_id,
regional_calendar_type_select_id,
regional_calendar_hijri_type_select_id,
gps_map_type_select_id,
gps_country_id,
gps_city_id,
gps_popular_place_id,
gps_lat_text,
gps_long_text,
design_theme_day_id,
design_theme_month_id,
design_theme_year_id,
design_paper_size_select_id,
design_row_highlight_select_id,
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
prayer_method_select_id,
prayer_asr_method_select_id,
prayer_high_latitude_adjustment_select_id,
prayer_time_format_select_id,
prayer_hijri_date_adjustment_select_id,
prayer_fajr_iqamat_select_id,
prayer_dhuhr_iqamat_select_id,
prayer_asr_iqamat_select_id,
prayer_maghrib_iqamat_select_id,
prayer_isha_iqamat_select_id,
prayer_column_imsak_checked,
prayer_column_sunset_checked,
prayer_column_midnight_checked,
prayer_column_fast_start_end_select_id,
date_created,
date_modified,
user_account_id)
VALUES(
'I',
SYSDATE(),
new.id,
new.description,
new.regional_language_locale,
new.regional_current_timezone_select_id,
new.regional_timezone_select_id,
new.regional_number_system_select_id,
new.regional_layout_direction_select_id,
new.regional_second_language_locale,
new.regional_column_title_select_id,
new.regional_arabic_script_select_id,
new.regional_calendar_type_select_id,
new.regional_calendar_hijri_type_select_id,
new.gps_map_type_select_id,
new.gps_country_id,
new.gps_city_id,
new.gps_popular_place_id,
new.gps_lat_text,
new.gps_long_text,
new.design_theme_day_id,
new.design_theme_month_id,
new.design_theme_year_id,
new.design_paper_size_select_id,
new.design_row_highlight_select_id,
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
new.prayer_method_select_id,
new.prayer_asr_method_select_id,
new.prayer_high_latitude_adjustment_select_id,
new.prayer_time_format_select_id,
new.prayer_hijri_date_adjustment_select_id,
new.prayer_fajr_iqamat_select_id,
new.prayer_dhuhr_iqamat_select_id,
new.prayer_asr_iqamat_select_id,
new.prayer_maghrib_iqamat_select_id,
new.prayer_isha_iqamat_select_id,
new.prayer_column_imsak_checked,
new.prayer_column_sunset_checked,
new.prayer_column_midnight_checked,
new.prayer_column_fast_start_end_select_id,
new.date_created,
new.date_modified,
new.user_account_id);
END; 
/

CREATE TRIGGER app_timetables_user_setting_before_update 
    BEFORE UPDATE ON app_timetables_user_setting 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_hist
(dml,
dml_date,
user_setting_id,
description,
regional_language_locale,
regional_current_timezone_select_id,
regional_timezone_select_id,
regional_number_system_select_id,
regional_layout_direction_select_id,
regional_second_language_locale,
regional_column_title_select_id,
regional_arabic_script_select_id,
regional_calendar_type_select_id,
regional_calendar_hijri_type_select_id,
gps_map_type_select_id,
gps_country_id,
gps_city_id,
gps_popular_place_id,
gps_lat_text,
gps_long_text,
design_theme_day_id,
design_theme_month_id,
design_theme_year_id,
design_paper_size_select_id,
design_row_highlight_select_id,
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
prayer_method_select_id,
prayer_asr_method_select_id,
prayer_high_latitude_adjustment_select_id,
prayer_time_format_select_id,
prayer_hijri_date_adjustment_select_id,
prayer_fajr_iqamat_select_id,
prayer_dhuhr_iqamat_select_id,
prayer_asr_iqamat_select_id,
prayer_maghrib_iqamat_select_id,
prayer_isha_iqamat_select_id,
prayer_column_imsak_checked,
prayer_column_sunset_checked,
prayer_column_midnight_checked,
prayer_column_fast_start_end_select_id,
date_created,
date_modified,
user_account_id)
VALUES(
'U',
SYSDATE(),
old.id,
old.description,
old.regional_language_locale,
old.regional_current_timezone_select_id,
old.regional_timezone_select_id,
old.regional_number_system_select_id,
old.regional_layout_direction_select_id,
old.regional_second_language_locale,
old.regional_column_title_select_id,
old.regional_arabic_script_select_id,
old.regional_calendar_type_select_id,
old.regional_calendar_hijri_type_select_id,
old.gps_map_type_select_id,
old.gps_country_id,
old.gps_city_id,
old.gps_popular_place_id,
old.gps_lat_text,
old.gps_long_text,
old.design_theme_day_id,
old.design_theme_month_id,
old.design_theme_year_id,
old.design_paper_size_select_id,
old.design_row_highlight_select_id,
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
old.prayer_method_select_id,
old.prayer_asr_method_select_id,
old.prayer_high_latitude_adjustment_select_id,
old.prayer_time_format_select_id,
old.prayer_hijri_date_adjustment_select_id,
old.prayer_fajr_iqamat_select_id,
old.prayer_dhuhr_iqamat_select_id,
old.prayer_asr_iqamat_select_id,
old.prayer_maghrib_iqamat_select_id,
old.prayer_isha_iqamat_select_id,
old.prayer_column_imsak_checked,
old.prayer_column_sunset_checked,
old.prayer_column_midnight_checked,
old.prayer_column_fast_start_end_select_id,
old.date_created,
old.date_modified,
old.user_account_id);
END; 
/

CREATE TRIGGER app_timetables_user_setting_like_before_delete 
    BEFORE DELETE ON app_timetables_user_setting_like 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_like_hist
(dml,
dml_date,
user_setting_like_id,
user_account_id,
user_setting_id,
date_created)
VALUES
('D',
SYSDATE(),
old.id,
old.user_account_id,
old.user_setting_id,
old.date_created);
END; 
/

CREATE TRIGGER app_timetables_user_setting_like_before_insert 
    BEFORE INSERT ON app_timetables_user_setting_like 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_like_hist
(dml,
dml_date,
user_setting_like_id,
user_account_id,
user_setting_id,
date_created)
VALUES
('I',
SYSDATE(),
new.id,
new.user_account_id,
new.user_setting_id,
new.date_created);
END; 
/

CREATE TRIGGER app_timetables_user_setting_like_before_update 
    BEFORE UPDATE ON app_timetables_user_setting_like 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_like_hist
(dml,
dml_date,
user_setting_like_id,
user_account_id,
user_setting_id,
date_created)
VALUES
('U',
SYSDATE(),
old.id,
old.user_account_id,
old.user_setting_id,
old.date_created);
END; 
/
CREATE TRIGGER app_timetables_user_setting_view_before_delete 
    BEFORE DELETE ON app_timetables_user_setting_view 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_view_hist
(dml,
dml_date,
user_account_id,
user_setting_id,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('D',
SYSDATE(),
old.user_account_id,
old.user_setting_id,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
CREATE TRIGGER app_timetables_user_setting_view_before_insert 
    BEFORE INSERT ON app_timetables_user_setting_view 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_view_hist
(dml,
dml_date,
user_account_id,
user_setting_id,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('I',
SYSDATE(),
new.user_account_id,
new.user_setting_id,
new.client_ip,
new.client_user_agent,
new.client_longitude,
new.client_latitude,
new.date_created);
END; 
/
CREATE TRIGGER app_timetables_user_setting_view_before_update 
    BEFORE UPDATE ON app_timetables_user_setting_view 
    FOR EACH ROW 
BEGIN
INSERT INTO app_timetables_user_setting_view_hist
(dml,
dml_date,
user_account_id,
user_setting_id,
client_ip,
client_user_agent,
client_longitude,
client_latitude,
date_created)
VALUES
('U',
SYSDATE(),
old.user_account_id,
old.user_setting_id,
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/

CREATE TRIGGER profile_search_before_delete 
    BEFORE DELETE ON profile_search 
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
CREATE TRIGGER profile_search_before_insert 
    BEFORE INSERT ON profile_search 
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
CREATE TRIGGER profile_search_before_update 
    BEFORE UPDATE ON profile_search 
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

CREATE TRIGGER user_account_app_before_delete 
    BEFORE DELETE ON user_account_app 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_app_hist
(dml,
dml_date,
user_account_id,
app_id,
date_created)
VALUES
('D',
SYSDATE(),
old.user_account_id,
old.app_id,
old.date_created);
END; 
/
CREATE TRIGGER user_account_app_before_insert 
    BEFORE INSERT ON user_account_app 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_app_hist
(dml,
dml_date,
user_account_id,
app_id,
date_created)
VALUES
('I',
SYSDATE(),
new.user_account_id,
new.app_id,
new.date_created);
END; 
/
CREATE TRIGGER user_account_app_before_update 
    BEFORE UPDATE ON user_account_app 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_app_hist
(dml,
dml_date,
user_account_id,
app_id,
date_created)
VALUES
('U',
SYSDATE(),
old.user_account_id,
old.app_id,
old.date_created);
END; 
/

CREATE TRIGGER user_account_before_delete 
    BEFORE DELETE ON user_account 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_hist
	(dml,
	dml_date,
	user_account_id,
	bio,
	private,
	user_level,
	date_created,
	date_modified,
	username,
	password,
	password_reminder,
	email,
	avatar,
	validation_code,
	active,
	provider1_id,
	provider1_first_name,
	provider1_last_name,
	provider1_image_url,
	provider1_email,
	provider2_id,
	provider2_first_name,
	provider2_last_name,
	provider2_image_url,
	provider2_email)
	VALUES
	('D',
	SYSDATE(),
	old.id,
	old.bio,
	old.private,
	old.user_level,
	old.date_created,
	old.date_modified,
	old.username,
	old.password,
	old.password_reminder,
	old.email,
	null,
	old.validation_code,
	old.active,
	old.provider1_id,
	old.provider1_first_name,
	old.provider1_last_name,
	old.provider1_image_url,
	old.provider1_email,
	old.provider2_id,
	old.provider2_first_name,
	old.provider2_last_name,
	old.provider2_image_url,
	old.provider2_email);
END; 
/
		
CREATE TRIGGER user_account_before_insert 
    BEFORE INSERT ON user_account 
    FOR EACH ROW 
	BEGIN
    IF new.username IS NOT NULL THEN
    	SET new.provider1_first_name = null;
		SET new.provider1_last_name = null;
		SET new.provider1_image = null;
		SET new.provider1_image_url = null;
		SET new.provider1_email = null;
		SET new.provider2_first_name = null;
		SET new.provider2_last_name = null;
		SET new.provider2_image = null;
		SET new.provider2_image_url = null;
		SET new.provider2_email = null;
    END IF;
	IF new.provider1_id IS NOT NULL OR new.provider2_id IS NOT NULL THEN
		SET new.username = null;
        SET new.password = null;
		SET new.password_reminder = null;
		SET new.email = null;
		SET new.avatar = null;
		SET new.validation_code = null;
		IF new.provider1_id IS NOT NULL THEN
			SET new.provider2_first_name = null;
			SET	new.provider2_last_name = null;
			SET new.provider2_image = null;
			SET new.provider2_image_url = null;
			SET new.provider2_email = null;
		ELSE
			SET new.provider1_first_name = null;
			SET	new.provider1_last_name = null;
			SET new.provider1_image = null;
			SET new.provider1_image_url = null;
			SET new.provider1_email = null;
		END IF;
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
	ELSEIF (LENGTH(new.password) < 10 OR LENGTH(new.password) > 100) THEN 
		signal SQLSTATE '45000'
		SET message_text = 'Password 10 - 100 characters', MYSQL_ERRNO = 20106;
	ELSEIF new.provider1_id IS NULL AND new.provider2_id IS NULL AND
		   (new.username IS NULL OR new.password IS NULL OR new.email IS NULL) THEN 
           signal SQLSTATE '45000'
		SET message_text = 'Username, password and email are required', MYSQL_ERRNO = 20107;
	ELSEIF (new.provider1_id IS NOT NULL AND new.provider2_id IS NOT NULL) OR
		   (new.username IS NOT NULL AND (new.provider1_id IS NOT NULL OR new.provider2_id IS NOT NULL)) THEN 
           signal SQLSTATE '45000'
		SET message_text = 'One provider one user', MYSQL_ERRNO = 20108;
    END IF;
	INSERT INTO user_account_hist
	(dml,
	dml_date,
	user_account_id,
	bio,
	private,
	user_level,
	date_created,
	date_modified,
	username,
	password,
	password_reminder,
	email,
	avatar,
	validation_code,
	active,
	provider1_id,
	provider1_first_name,
	provider1_last_name,
	provider1_image_url,
	provider1_email,
	provider2_id,
	provider2_first_name,
	provider2_last_name,
	provider2_image_url,
	provider2_email)
	VALUES
	('I',
	SYSDATE(),
	new.id,
	new.bio,
	new.private,
	new.user_level,
	new.date_created,
	new.date_modified,
	new.username,
	new.password,
	new.password_reminder,
	new.email,
	null,
	new.validation_code,
	new.active,
	new.provider1_id,
	new.provider1_first_name,
	new.provider1_last_name,
	new.provider1_image_url,
	new.provider1_email,
	new.provider2_id,
	new.provider2_first_name,
	new.provider2_last_name,
	new.provider2_image_url,
	new.provider2_email);
END; 
/

CREATE TRIGGER user_account_before_update 
    BEFORE UPDATE ON user_account 
    FOR EACH ROW 
    BEGIN
    IF new.username IS NOT NULL THEN
    	SET new.provider1_first_name = null;
		SET new.provider1_last_name = null;
		SET new.provider1_image = null;
		SET new.provider1_image_url = null;
		SET new.provider1_email = null;
		SET new.provider2_first_name = null;
		SET new.provider2_last_name = null;
		SET new.provider2_image = null;
		SET new.provider2_image_url = null;
		SET new.provider2_email = null;
    END IF;
	IF new.provider1_id IS NOT NULL OR new.provider2_id IS NOT NULL THEN
		SET new.username = null;
        SET new.password = null;
		SET new.password_reminder = null;
		SET new.email = null;
		SET new.avatar = null;
		SET new.validation_code = null;
		IF new.provider1_id IS NOT NULL THEN
			SET new.provider2_first_name = null;
			SET	new.provider2_last_name = null;
			SET new.provider2_image = null;
			SET new.provider2_image_url = null;
			SET new.provider2_email = null;
		ELSE
			SET new.provider1_first_name = null;
			SET	new.provider1_last_name = null;
			SET new.provider1_image = null;
			SET new.provider1_image_url = null;
			SET new.provider1_email = null;
		END IF;
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
	ELSEIF (LENGTH(new.password) < 10 OR LENGTH(new.password) > 100) THEN 
		signal SQLSTATE '45000'
		SET message_text = 'Password 10 - 100 characters', MYSQL_ERRNO = 20106;
	ELSEIF new.provider1_id IS NULL AND new.provider2_id IS NULL AND
		   (new.username IS NULL OR new.password IS NULL OR new.email IS NULL) THEN 
           signal SQLSTATE '45000'
		SET message_text = 'Username, password and email are required', MYSQL_ERRNO = 20107;
	ELSEIF (new.provider1_id IS NOT NULL AND new.provider2_id IS NOT NULL) OR
		   (new.username IS NOT NULL AND (new.provider1_id IS NOT NULL OR new.provider2_id IS NOT NULL)) THEN 
           signal SQLSTATE '45000'
		SET message_text = 'One provider one user', MYSQL_ERRNO = 20108;
    END IF;
	INSERT INTO user_account_hist
		(dml,
		dml_date,
		user_account_id,
		bio,
		private,
		user_level,
		date_created,
		date_modified,
		username,
		password,
		password_reminder,
		email,
		avatar,
		validation_code,
		active,
		provider1_id,
		provider1_first_name,
		provider1_last_name,
		provider1_image_url,
		provider1_email,
		provider2_id,
		provider2_first_name,
		provider2_last_name,
		provider2_image_url,
		provider2_email)
		VALUES
		('U',
		SYSDATE(),
		old.id,
		old.bio,
		old.private,
		old.user_level,
		old.date_created,
		old.date_modified,
		old.username,
		old.password,
		old.password_reminder,
		old.email,
		null,
		old.validation_code,
		old.active,
		old.provider1_id,
		old.provider1_first_name,
		old.provider1_last_name,
		old.provider1_image_url,
		old.provider1_email,
		old.provider2_id,
		old.provider2_first_name,
		old.provider2_last_name,
		old.provider2_image_url,
		old.provider2_email);
END;
/

CREATE TRIGGER user_account_follow_before_delete 
    BEFORE DELETE ON user_account_follow 
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

CREATE TRIGGER user_account_follow_before_insert 
    BEFORE INSERT ON user_account_follow 
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

CREATE TRIGGER user_account_follow_before_update 
    BEFORE UPDATE ON user_account_follow 
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

CREATE TRIGGER user_account_like_before_delete 
    BEFORE DELETE ON user_account_like 
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

CREATE TRIGGER user_account_like_before_insert 
    BEFORE INSERT ON user_account_like 
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

CREATE TRIGGER user_account_like_before_update 
    BEFORE UPDATE ON user_account_like 
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
CREATE TRIGGER user_account_logon_before_delete 
    BEFORE DELETE ON user_account_logon 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_logon_hist
(dml,
dml_date,
user_account_id,
app_id,
result,
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
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
CREATE TRIGGER user_account_logon_before_insert 
    BEFORE INSERT ON user_account_logon 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_logon_hist
(dml,
dml_date,
user_account_id,
app_id,
result,
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
new.client_ip,
new.client_user_agent,
new.client_longitude,
new.client_latitude,
new.date_created);
END; 
/
CREATE TRIGGER user_account_logon_before_update 
    BEFORE UPDATE ON user_account_logon 
    FOR EACH ROW 
BEGIN
INSERT INTO user_account_logon_hist
(dml,
dml_date,
user_account_id,
app_id,
result,
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
old.client_ip,
old.client_user_agent,
old.client_longitude,
old.client_latitude,
old.date_created);
END; 
/
CREATE TRIGGER user_account_view_before_delete 
    BEFORE DELETE ON user_account_view 
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
CREATE TRIGGER user_account_view_before_insert 
    BEFORE INSERT ON user_account_view 
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
CREATE TRIGGER user_account_view_before_update 
    BEFORE UPDATE ON user_account_view 
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


