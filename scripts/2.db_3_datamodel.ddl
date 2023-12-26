CREATE ROLE role_app_admin;
CREATE ROLE role_app_common;
CREATE ROLE role_app_dba;

CREATE USER app_portfolio PASSWORD <APP_PASSWORD/>;
GRANT role_app_dba TO app_portfolio;

CREATE SCHEMA AUTHORIZATION app_portfolio;
GRANT USAGE ON SCHEMA app_portfolio TO role_app_dba;
GRANT USAGE ON SCHEMA app_portfolio TO role_app_admin;
GRANT USAGE ON SCHEMA app_portfolio TO role_app_common;
GRANT ALL PRIVILEGES ON DATABASE app_portfolio TO role_app_dba;

CREATE TABLE app_portfolio.app (
    id        INTEGER NOT NULL,
    app_category_id INTEGER,
	CONSTRAINT app_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.app TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app TO role_app_admin;

CREATE TABLE app_portfolio.app_category (
    id            SERIAL NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    CONSTRAINT app_category_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.app_category TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_category TO role_app_admin;

CREATE TABLE app_portfolio.app_device (
    app_id    INTEGER NOT NULL,
    device_id INTEGER NOT NULL,
    CONSTRAINT app_device_pk PRIMARY KEY ( app_id,
                                           device_id )
);

GRANT SELECT ON app_portfolio.app_device TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_device TO role_app_admin;

CREATE TABLE app_portfolio.app_log (
    id                           SERIAL NOT NULL,
    app_module                   VARCHAR(100),
    app_module_type              VARCHAR(100),
    app_module_request           VARCHAR(500),
    app_module_result            VARCHAR(4000),
    app_user_id                  VARCHAR(100),
    user_language                VARCHAR(1000),
    user_timezone                VARCHAR(1000),
    user_number_system           VARCHAR(100),
    user_platform                VARCHAR(1000),
    client_latitude              VARCHAR(100),
    client_longitude             VARCHAR(100),
    server_remote_addr           VARCHAR(1000),
    server_user_agent            VARCHAR(1000),
    server_http_host             VARCHAR(1000),
    server_http_accept_language  VARCHAR(1000),
    date_created                 TIMESTAMP,
	app_id                       INTEGER NOT NULL,
	CONSTRAINT app_log_pk PRIMARY KEY ( id )
);

CREATE INDEX app_log_date_created_index ON
    app_portfolio.app_log (
        date_created
    ASC );

GRANT SELECT, INSERT ON app_portfolio.app_log TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_log TO role_app_admin;

CREATE TABLE app_portfolio.app_message (
    app_id            INTEGER NOT NULL,
    code              VARCHAR(100) NOT NULL,
    message_level_id  INTEGER NOT NULL,
    message_type_id   INTEGER NOT NULL,
	CONSTRAINT app_message_pk PRIMARY KEY ( app_id, 
                                            code )
);

GRANT SELECT ON app_portfolio.app_message TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_message TO role_app_admin;

CREATE TABLE app_portfolio.app_object (
    app_id       INTEGER NOT NULL,
    object_name  VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_pk PRIMARY KEY ( object_name,
                                           app_id )
);

GRANT SELECT ON app_portfolio.app_object TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object TO role_app_admin;


CREATE TABLE app_portfolio.app_object_item (
    app_object_object_name                  VARCHAR(100) NOT NULL,
    object_item_name                        VARCHAR(100) NOT NULL,
    app_object_app_id                       INTEGER NOT NULL,
    app_setting_type_app_setting_type_name  VARCHAR(100),
    app_setting_type_app_id                 INTEGER,
	CONSTRAINT app_object_item_pk PRIMARY KEY ( object_item_name,
                                                app_object_object_name,
                                                app_object_app_id )
);

GRANT SELECT ON app_portfolio.app_object_item TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object_item TO role_app_admin;

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

GRANT SELECT ON app_portfolio.app_parameter TO role_app_common;

CREATE TABLE app_portfolio.app_role (
    id        INTEGER NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    icon      VARCHAR(10) NOT NULL
);

GRANT SELECT ON app_portfolio.app_role TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_role TO role_app_admin;

ALTER TABLE app_portfolio.app_role ADD CONSTRAINT app_role_pk PRIMARY KEY ( id );

CREATE TABLE app_portfolio.app_screenshot (
    id                   SERIAL NOT NULL,
    app_device_app_id    INTEGER NOT NULL,
    app_device_device_id INTEGER NOT NULL,
    screenshot           TEXT NOT NULL,
    CONSTRAINT app_screenshot_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.app_screenshot TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_screenshot TO role_app_admin;

CREATE TABLE app_portfolio.app_setting (
    id                                      SERIAL NOT NULL,
    app_setting_type_app_id                 INTEGER NOT NULL,
    app_setting_type_app_setting_type_name  VARCHAR(100) NOT NULL,
    value                                   VARCHAR(500) NOT NULL,
    display_data                            VARCHAR(500),
    data2                                   VARCHAR(500),
    data3                                   VARCHAR(500),
    data4                                   VARCHAR(500),
    data5                                   VARCHAR(500),
    CONSTRAINT app_setting_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.app_setting TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_setting TO role_app_admin;

ALTER TABLE app_portfolio.app_setting
    ADD CONSTRAINT app_setting_un UNIQUE ( app_setting_type_app_setting_type_name,
                                           value,
                                           app_setting_type_app_id );

CREATE TABLE app_portfolio.app_setting_type (
    app_id                      INTEGER NOT NULL,
    app_setting_type_name       VARCHAR(100) NOT NULL,
    CONSTRAINT app_setting_type_pk PRIMARY KEY ( app_setting_type_name,
                                                 app_id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_setting_type TO role_app_admin;

GRANT SELECT ON app_portfolio.app_setting_type TO role_app_common;

CREATE TABLE app_portfolio.app_translation (
    language_id                            INTEGER NOT NULL,
    app_id                                 INTEGER,
    app_category_id                        INTEGER,
    app_setting_id                         INTEGER,
    app_object_object_name                 VARCHAR(100),
    app_object_app_id                      INTEGER,
    app_object_item_app_object_app_id      INTEGER,
    app_object_item_app_object_object_name VARCHAR(100),
    app_object_item_object_item_name       VARCHAR(100),
    parameter_type_id                      VARCHAR(100),
    app_message_code                       VARCHAR(100),
    app_message_app_id                     INTEGER,
    country_id                             INTEGER,
    language_id_translation                INTEGER,
    text                                   VARCHAR(2000) NOT NULL
);

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT arc_3 CHECK ( ( ( app_object_object_name IS NOT NULL )
                                   AND ( app_object_app_id IS NOT NULL )
                                   AND ( app_object_item_object_item_name IS NULL )
                                   AND ( app_object_item_app_object_object_name IS NULL )
                                   AND ( app_object_item_app_object_app_id IS NULL )
                                   AND ( app_setting_id IS NULL )
                                   AND ( parameter_type_id IS NULL )
                                   AND ( app_id IS NULL )
                                   AND ( app_category_id IS NULL )
                                   AND ( country_id IS NULL )
                                   AND ( app_message_app_id IS NULL )
                                   AND ( app_message_code IS NULL )
                                   AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_object_item_object_item_name IS NOT NULL )
                                      AND ( app_object_item_app_object_object_name IS NOT NULL )
                                      AND ( app_object_item_app_object_app_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( parameter_type_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( app_message_app_id IS NULL )
                                      AND ( app_message_code IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_setting_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( parameter_type_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( app_message_app_id IS NULL )
                                      AND ( app_message_code IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( parameter_type_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( app_message_app_id IS NULL )
                                      AND ( app_message_code IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( parameter_type_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( app_message_app_id IS NULL )
                                      AND ( app_message_code IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_category_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( parameter_type_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( app_message_app_id IS NULL )
                                      AND ( app_message_code IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( country_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( parameter_type_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( app_message_app_id IS NULL )
                                      AND ( app_message_code IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_message_app_id IS NOT NULL )
                                      AND ( app_message_code IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( parameter_type_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( language_id_translation IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( parameter_type_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( app_message_app_id IS NULL )
                                      AND ( app_message_code IS NULL ) ) );

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_translation TO role_app_admin;

GRANT SELECT ON app_portfolio.app_translation TO role_app_common;

ALTER TABLE app_portfolio.app_translation ADD CONSTRAINT app_translation_app_un UNIQUE ( app_id,
                                                                                         language_id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_category_un UNIQUE ( app_category_id,
                                                            app_id,
                                                            language_id );

ALTER TABLE app_portfolio.app_translation ADD CONSTRAINT app_translation_parameter_type_un UNIQUE ( parameter_type_id,
                                                                                                    language_id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_object_un UNIQUE ( app_object_object_name,
                                                          app_object_app_id,
                                                          language_id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_object_item_un UNIQUE ( app_object_item_object_item_name,
                                                               app_object_item_app_object_object_name,
                                                               app_object_item_app_object_app_id,
                                                               language_id );

ALTER TABLE app_portfolio.app_translation ADD CONSTRAINT app_translation_app_setting_un UNIQUE ( app_setting_id,
                                                                                                 language_id );

ALTER TABLE app_portfolio.app_translation ADD CONSTRAINT app_translation_country_un UNIQUE ( country_id,
                                                                                             language_id );

ALTER TABLE app_portfolio.app_translation ADD CONSTRAINT app_translation_language_translation_un UNIQUE ( language_id_translation,
                                                                                                          language_id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_message_un UNIQUE ( app_message_code,
                                                           app_message_app_id,
                                                           language_id );
    
CREATE TABLE app_portfolio.country (
    id            SERIAL NOT NULL,
    country_code  VARCHAR(10) NOT NULL,
    flag_emoji    VARCHAR(10),
    flag_url      VARCHAR(100),
    country_group_id  INTEGER NOT NULL,
	CONSTRAINT country_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.country TO role_app_admin;

GRANT SELECT ON app_portfolio.country TO role_app_common;

CREATE TABLE app_portfolio.country_group (
    id          SERIAL NOT NULL,
    group_name  VARCHAR(100) NOT NULL,
	CONSTRAINT country_group_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.country_group TO role_app_admin;

GRANT SELECT ON app_portfolio.country_group TO role_app_common;

CREATE TABLE app_portfolio.device (
    id             SERIAL NOT NULL,
    device_name    VARCHAR(100) NOT NULL,
    screen_x       INTEGER,
    screen_y       INTEGER,
    device_type_id INTEGER NOT NULL,
    CONSTRAINT device_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.device TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.device TO role_app_admin;

CREATE TABLE app_portfolio.device_type (
    id                          SERIAL NOT NULL,
    device_type_name            VARCHAR(100) NOT NULL,
    CONSTRAINT device_type_pk   PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.device_type TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.device_type TO role_app_admin;

CREATE TABLE app_portfolio.event (
    id            SERIAL NOT NULL,
    event_name    VARCHAR(100) NOT NULL,
    event_type_id INTEGER NOT NULL,
    CONSTRAINT event_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event TO role_app_admin;

GRANT SELECT ON app_portfolio.event TO role_app_common;

CREATE TABLE app_portfolio.event_status (
    id          SERIAL NOT NULL,
    status_name VARCHAR(100) NOT NULL,
    CONSTRAINT event_status_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.event_status TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event_status TO role_app_admin;

CREATE TABLE app_portfolio.event_type (
    id              SERIAL NOT NULL,
    event_type_name VARCHAR(100) NOT NULL,
    CONSTRAINT event_type_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event_type TO role_app_admin;

GRANT SELECT ON app_portfolio.event_type TO role_app_common;

CREATE TABLE app_portfolio.identity_provider (
    id                      INTEGER NOT NULL,
    provider_name           VARCHAR(100) NOT NULL,
    provider_url_logo       VARCHAR(100),
    api_src                 VARCHAR(100),
    api_src2                VARCHAR(100),
    api_version             VARCHAR(100),
	api_id                  VARCHAR(100),
    identity_provider_order INTEGER NOT NULL,
    enabled                 INTEGER,
    CONSTRAINT identity_provider_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.identity_provider TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.identity_provider TO role_app_admin;

ALTER TABLE app_portfolio.identity_provider ADD CONSTRAINT identity_provider_order_un UNIQUE ( identity_provider_order );

CREATE TABLE app_portfolio.language (
    id         SERIAL NOT NULL,
    lang_code  VARCHAR(10) NOT NULL,
	CONSTRAINT language_pk PRIMARY KEY ( id )
);

CREATE INDEX lang_code_index ON
    app_portfolio.language (
        lang_code
    ASC );
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.language TO role_app_admin;

GRANT SELECT ON app_portfolio.language TO role_app_common;

CREATE TABLE app_portfolio.locale (
    language_id  INTEGER NOT NULL,
    country_id   INTEGER NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.locale TO role_app_admin;

GRANT SELECT ON app_portfolio.locale TO role_app_common;

ALTER TABLE app_portfolio.locale ADD CONSTRAINT locale_language_id_country_id_un UNIQUE ( language_id,
                                                     country_id );

CREATE TABLE app_portfolio.message_level (
    id             SERIAL NOT NULL,
    message_level  VARCHAR(10) NOT NULL,
	CONSTRAINT message_level_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.message_level TO role_app_admin;

GRANT SELECT ON app_portfolio.message_level TO role_app_common;

ALTER TABLE app_portfolio.message_level ADD CONSTRAINT message_level_message_level_un UNIQUE ( message_level );

CREATE TABLE app_portfolio.message_type (
    id            SERIAL NOT NULL,
    message_type  VARCHAR(10) NOT NULL,
	CONSTRAINT message_type_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.message_type TO role_app_admin;

GRANT SELECT ON app_portfolio.message_type TO role_app_common;

ALTER TABLE app_portfolio.message_type ADD CONSTRAINT message_type_message_type_un UNIQUE ( message_type );

CREATE TABLE app_portfolio.parameter_type (
    id VARCHAR(100) NOT NULL,
    parameter_type_name VARCHAR(100) NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.parameter_type TO role_app_admin;

GRANT SELECT ON app_portfolio.parameter_type TO role_app_common;

ALTER TABLE app_portfolio.parameter_type ADD CONSTRAINT parameter_type_pk PRIMARY KEY ( id );

CREATE TABLE app_portfolio.profile_search (
    user_account_id    INTEGER,
    search             VARCHAR(100) NOT NULL,
    client_ip          VARCHAR(1000),
    client_user_agent  VARCHAR(1000),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       TIMESTAMP NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.profile_search TO role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.profile_search TO role_app_common;

CREATE TABLE app_portfolio.user_account (
    id                    SERIAL NOT NULL,
    username              VARCHAR(100),
    bio                   VARCHAR(150),
    private               DECIMAL(1,0),
    user_level            DECIMAL(1,0),
    date_created          TIMESTAMP,
    date_modified         TIMESTAMP,
    password              VARCHAR(100),
    password_reminder     VARCHAR(100),
    email                 VARCHAR(100),
    email_unverified      VARCHAR(100),
    avatar                TEXT,
    verification_code     VARCHAR(6),
    active                DECIMAL(1,0),
    identity_provider_id  INTEGER,
    provider_id           VARCHAR(100),
    provider_first_name   VARCHAR(1000),
    provider_last_name    VARCHAR(1000),
    provider_image        TEXT,
    provider_image_url    VARCHAR(1000),
    provider_email        VARCHAR(1000),
    app_role_id           INTEGER,
	CONSTRAINT user_account_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account TO role_app_admin;

ALTER TABLE app_portfolio.user_account ADD CONSTRAINT user_account_provider_id_un UNIQUE ( provider_id );

ALTER TABLE app_portfolio.user_account ADD CONSTRAINT user_account_username_un UNIQUE ( username );

ALTER TABLE app_portfolio.user_account ADD CONSTRAINT user_account_email_un UNIQUE ( email );

CREATE TABLE app_portfolio.user_account_app (
    user_account_id                                   INTEGER NOT NULL,
    app_id                                            INTEGER NOT NULL,
    preference_locale                                 VARCHAR(100),
    app_setting_preference_timezone_id                INTEGER,
    app_setting_preference_direction_id               INTEGER,
    app_setting_preference_arabic_script_id           INTEGER,
    date_created                                      TIMESTAMP NOT NULL,
    CONSTRAINT user_account_app_pk PRIMARY KEY ( user_account_id,
                                                 app_id
                                                 )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app TO role_app_admin;

CREATE TABLE app_portfolio.user_account_app_data_post (
    id                                         SERIAL NOT NULL,
    description                                VARCHAR(100),
    json_data                                  TEXT,
    date_created                               TIMESTAMP,
    date_modified                              TIMESTAMP,
    user_account_app_user_account_id           INT NOT NULL,
    user_account_app_app_id                    INT NOT NULL,
	CONSTRAINT user_account_app_data_json_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app_data_post TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app_data_post TO role_app_common;

CREATE TABLE app_portfolio.user_account_app_data_post_like (
    date_created                        TIMESTAMP,	
    user_account_app_data_post_id       INTEGER NOT NULL,
    user_account_app_user_account_id    INTEGER NOT NULL,
    user_account_app_app_id             INTEGER NOT NULL,
	CONSTRAINT user_account_app_data_post_like_pk PRIMARY KEY ( user_account_app_user_account_id, user_account_app_data_post_id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app_data_post_like TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app_data_post_like TO role_app_common;

CREATE TABLE app_portfolio.user_account_app_data_post_view (
    client_ip                           VARCHAR(1000),
    client_user_agent                   VARCHAR(1000),
    client_longitude                    VARCHAR(100),
    client_latitude                     VARCHAR(100),
    date_created                        TIMESTAMP NOT NULL,
    user_account_app_data_post_id       INTEGER NOT NULL,
    user_account_app_user_account_id    INTEGER,
    user_account_app_app_id             INTEGER
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app_data_post_view TO role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app_data_post_view TO role_app_common;

CREATE TABLE app_portfolio.user_account_event (
    user_account_id             INTEGER NOT NULL,
    event_id                    INTEGER NOT NULL,
    event_status_id             INTEGER NOT NULL,
    date_created                TIMESTAMP NOT NULL,
    date_modified               TIMESTAMP,
    user_language               VARCHAR(1000),
    user_timezone               VARCHAR(1000),
    user_number_system          VARCHAR(100),
    user_platform               VARCHAR(1000),
    client_latitude             VARCHAR(100),
    client_longitude            VARCHAR(100),
    server_remote_addr          VARCHAR(1000),
    server_user_agent           VARCHAR(1000),
    server_http_host            VARCHAR(1000),
    server_http_accept_language VARCHAR(1000)
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_event TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_event TO role_app_admin;

CREATE TABLE app_portfolio.user_account_follow (
    user_account_id         INTEGER NOT NULL,
    user_account_id_follow  INTEGER NOT NULL,
	date_created            TIMESTAMP,
	CONSTRAINT user_account_follow_pk PRIMARY KEY ( user_account_id, user_account_id_follow )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_follow TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_follow TO role_app_admin;


CREATE TABLE app_portfolio.user_account_like (
    user_account_id       INTEGER NOT NULL,
    user_account_id_like  INTEGER NOT NULL,
	date_created          TIMESTAMP,
	CONSTRAINT user_account_like_pk PRIMARY KEY ( user_account_id, user_account_id_like )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_like TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_like TO role_app_admin;

CREATE TABLE app_portfolio.user_account_logon (
    user_account_id    INTEGER NOT NULL,
    app_id             INTEGER NOT NULL,
    result             INTEGER NOT NULL,
    access_token       VARCHAR(500),
    client_ip          VARCHAR(1000),
    client_user_agent  VARCHAR(1000),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       TIMESTAMP NOT NULL
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_logon TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_logon TO role_app_admin;

ALTER TABLE app_portfolio.user_account_logon ADD CONSTRAINT user_account_logon_access_token_un UNIQUE ( access_token );

CREATE TABLE app_portfolio.user_account_view (
    user_account_id       INTEGER,
    user_account_id_view  INTEGER NOT NULL,
    client_ip             VARCHAR(1000),
    client_user_agent     VARCHAR(1000),
    client_longitude      VARCHAR(100),
    client_latitude       VARCHAR(100),
    date_created          TIMESTAMP NOT NULL
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_view TO role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_view TO role_app_admin;

ALTER TABLE app_portfolio.app
    ADD CONSTRAINT app_app_category_fk FOREIGN KEY ( app_category_id )
        REFERENCES app_portfolio.app_category ( id );

ALTER TABLE app_portfolio.app_device
    ADD CONSTRAINT app_device_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_device
    ADD CONSTRAINT app_device_device_fk FOREIGN KEY ( device_id )
        REFERENCES app_portfolio.device ( id );

ALTER TABLE app_portfolio.app_log
    ADD CONSTRAINT app_log_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_message
    ADD CONSTRAINT app_message_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_message
    ADD CONSTRAINT app_message_message_level_fk FOREIGN KEY ( message_level_id )
        REFERENCES app_portfolio.message_level ( id );

ALTER TABLE app_portfolio.app_message
    ADD CONSTRAINT app_message_message_type_fk FOREIGN KEY ( message_type_id )
        REFERENCES app_portfolio.message_type ( id );

ALTER TABLE app_portfolio.app_object
    ADD CONSTRAINT app_object_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_object_item
    ADD CONSTRAINT app_object_item_app_object_fk FOREIGN KEY ( app_object_object_name,
                                                               app_object_app_id )
        REFERENCES app_portfolio.app_object ( object_name,
                                              app_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_object_item
    ADD CONSTRAINT app_object_item_app_setting_type_fk FOREIGN KEY ( app_setting_type_app_setting_type_name,
                                                                     app_setting_type_app_id )
        REFERENCES app_portfolio.app_setting_type ( app_setting_type_name,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_parameter
    ADD CONSTRAINT app_parameter_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_parameter
    ADD CONSTRAINT app_parameter_parameter_type_fk FOREIGN KEY ( parameter_type_id )
        REFERENCES app_portfolio.parameter_type ( id );

ALTER TABLE app_portfolio.app_screenshot
    ADD CONSTRAINT app_screenshot_app_device_fk FOREIGN KEY ( app_device_app_id,
                                                              app_device_device_id )
        REFERENCES app_portfolio.app_device ( app_id,
                                              device_id )
            ON DELETE CASCADE;
        
ALTER TABLE app_portfolio.app_setting
    ADD CONSTRAINT app_setting_app_setting_type_fk FOREIGN KEY ( app_setting_type_app_setting_type_name,
                                                                 app_setting_type_app_id )
        REFERENCES app_portfolio.app_setting_type ( app_setting_type_name,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_setting_type
    ADD CONSTRAINT app_setting_type_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_category_fk FOREIGN KEY ( app_category_id )
        REFERENCES app_portfolio.app_category ( id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_message_fk FOREIGN KEY ( app_message_app_id,
                                                                app_message_code )
        REFERENCES app_portfolio.app_message ( app_id,
                                               code )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_object_fk FOREIGN KEY ( app_object_object_name,
                                                               app_object_app_id )
        REFERENCES app_portfolio.app_object ( object_name,
                                              app_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_object_item_fk FOREIGN KEY ( app_object_item_object_item_name,
                                                                    app_object_item_app_object_object_name,
                                                                    app_object_item_app_object_app_id )
        REFERENCES app_portfolio.app_object_item ( object_item_name,
                                                   app_object_object_name,
                                                   app_object_app_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_setting_fk FOREIGN KEY ( app_setting_id )
        REFERENCES app_portfolio.app_setting ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_country_fk FOREIGN KEY ( country_id )
        REFERENCES app_portfolio.country ( id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_language_fk FOREIGN KEY ( language_id_translation )
        REFERENCES app_portfolio.language ( id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_language_translation_fk FOREIGN KEY ( language_id )
        REFERENCES app_portfolio.language ( id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_parameter_type_fk FOREIGN KEY ( parameter_type_id )
        REFERENCES app_portfolio.parameter_type ( id );

ALTER TABLE app_portfolio.country
    ADD CONSTRAINT country_country_group_fk FOREIGN KEY ( country_group_id )
        REFERENCES app_portfolio.country_group ( id );

ALTER TABLE app_portfolio.device
    ADD CONSTRAINT device_device_type_fk FOREIGN KEY ( device_type_id )
        REFERENCES app_portfolio.device_type ( id );

ALTER TABLE app_portfolio.event
    ADD CONSTRAINT event_event_type_fk FOREIGN KEY ( event_type_id )
        REFERENCES app_portfolio.event_type ( id );

ALTER TABLE app_portfolio.locale
    ADD CONSTRAINT locale_country_fk FOREIGN KEY ( country_id )
        REFERENCES app_portfolio.country ( id );

ALTER TABLE app_portfolio.locale
    ADD CONSTRAINT locale_language_fk FOREIGN KEY ( language_id )
        REFERENCES app_portfolio.language ( id );

ALTER TABLE app_portfolio.profile_search
    ADD CONSTRAINT profile_search_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES app_portfolio.user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_app_setting_arabic_script_fk FOREIGN KEY ( app_setting_preference_arabic_script_id )
        REFERENCES app_portfolio.app_setting ( id );

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_app_setting_direction_fk FOREIGN KEY ( app_setting_preference_direction_id )
        REFERENCES app_portfolio.app_setting ( id );

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_app_setting_timezone_fk FOREIGN KEY ( app_setting_preference_timezone_id )
        REFERENCES app_portfolio.app_setting ( id );

ALTER TABLE app_portfolio.user_account_app_data_post_like
    ADD CONSTRAINT user_account_app_data_post_like_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                                   user_account_app_app_id )
        REFERENCES app_portfolio.user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_app_data_post_like
    ADD CONSTRAINT user_account_app_data_post_like_user_account_app_data_post_fk FOREIGN KEY ( user_account_app_data_post_id )
        REFERENCES app_portfolio.user_account_app_data_post ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_app_data_post
    ADD CONSTRAINT user_account_app_data_post_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                              user_account_app_app_id )
        REFERENCES app_portfolio.user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_app_data_post_view
    ADD CONSTRAINT user_account_app_data_post_view_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                                   user_account_app_app_id )
        REFERENCES app_portfolio.user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_app_data_post_view
    ADD CONSTRAINT user_account_app_data_post_view_user_account_app_data_post_fk FOREIGN KEY ( user_account_app_data_post_id )
        REFERENCES app_portfolio.user_account_app_data_post ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account
    ADD CONSTRAINT user_account_app_role_fk FOREIGN KEY ( app_role_id )
        REFERENCES app_portfolio.app_role ( id );

ALTER TABLE app_portfolio.user_account_app
    ADD CONSTRAINT user_account_app_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES app_portfolio.user_account ( id )
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
        REFERENCES app_portfolio.user_account ( id )
		    ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_follow
    ADD CONSTRAINT user_account_follow_user_account_follow_fk FOREIGN KEY ( user_account_id_follow )
        REFERENCES app_portfolio.user_account ( id )
		    ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account
    ADD CONSTRAINT user_account_identity_provider_fk FOREIGN KEY ( identity_provider_id )
        REFERENCES app_portfolio.identity_provider ( id );

ALTER TABLE app_portfolio.user_account_like
    ADD CONSTRAINT user_account_like_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES app_portfolio.user_account ( id )
		    ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_like
    ADD CONSTRAINT user_account_like_user_account_like_fk FOREIGN KEY ( user_account_id_like )
        REFERENCES app_portfolio.user_account ( id )
		    ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_logon
    ADD CONSTRAINT user_account_logon_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id );

ALTER TABLE app_portfolio.user_account_logon
    ADD CONSTRAINT user_account_logon_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES app_portfolio.user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_view
    ADD CONSTRAINT user_account_view_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES app_portfolio.user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.user_account_view
    ADD CONSTRAINT user_account_view_user_account_view_fk FOREIGN KEY ( user_account_id_view )
        REFERENCES app_portfolio.user_account ( id )
            ON DELETE CASCADE;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_portfolio TO role_app_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app_portfolio TO role_app_common;

ALTER TABLE app_portfolio.app OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_category OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_category_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_device OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_log OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_message OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_object OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_object_item OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_object_item_subitem OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_object_item_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_object_subitem_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_object_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_parameter OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_role OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_screenshot OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_setting OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_setting_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.app_setting_type OWNER TO app_portfolio;
ALTER TABLE app_portfolio.country OWNER TO app_portfolio;
ALTER TABLE app_portfolio.country_group OWNER TO app_portfolio;
ALTER TABLE app_portfolio.country_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.device OWNER TO app_portfolio;
ALTER TABLE app_portfolio.device_type OWNER TO app_portfolio;
ALTER TABLE app_portfolio.event OWNER TO app_portfolio;
ALTER TABLE app_portfolio.event_status OWNER TO app_portfolio;
ALTER TABLE app_portfolio.event_type OWNER TO app_portfolio;
ALTER TABLE app_portfolio.identity_provider OWNER TO app_portfolio;
ALTER TABLE app_portfolio.language OWNER TO app_portfolio;
ALTER TABLE app_portfolio.language_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.locale OWNER TO app_portfolio;
ALTER TABLE app_portfolio.message OWNER TO app_portfolio;
ALTER TABLE app_portfolio.message_level OWNER TO app_portfolio;
ALTER TABLE app_portfolio.message_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.message_type OWNER TO app_portfolio;
ALTER TABLE app_portfolio.parameter_type OWNER TO app_portfolio;
ALTER TABLE app_portfolio.parameter_type_translation OWNER TO app_portfolio;
ALTER TABLE app_portfolio.profile_search OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_app OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_app_data_post OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_app_data_post_like OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_app_data_post_view OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_event OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_follow OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_like OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_logon OWNER TO app_portfolio;
ALTER TABLE app_portfolio.user_account_view OWNER TO app_portfolio;