CREATE ROLE app_portfolio_role_app_admin;
CREATE ROLE app_portfolio_role_app_common;
CREATE ROLE app_portfolio_role_app_dba;

CREATE USER app_portfolio IDENTIFIED BY <APP_PASSWORD/>
    ACCOUNT UNLOCK;
GRANT app_portfolio_role_app_dba TO app_portfolio;

GRANT ALL PRIVILEGES ON app_portfolio.* TO app_portfolio_role_app_dba;

CREATE TABLE app_portfolio.app (
    id        INTEGER NOT NULL,
    app_category_id INTEGER,
	CONSTRAINT app_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.app TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.app_category (
    id            INT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    CONSTRAINT app_category_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.app_category TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_category TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.app_data_entity (
    id        INTEGER NOT NULL,
    app_id    INTEGER NOT NULL,
    json_data LONGBLOB,
    CONSTRAINT app_data_entity_pk PRIMARY KEY ( app_id,
                                                id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_data_entity TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_data_entity TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.app_data_entity_resource (
    id                     INTEGER NOT NULL,
    json_data              LONGBLOB,
    app_setting_id         INTEGER NOT NULL,
    app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_id     INTEGER NOT NULL,
    CONSTRAINT app_data_entity_resource_pk PRIMARY KEY (app_data_entity_app_id,
                                                        app_data_entity_id,
                                                        id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_data_entity_resource TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_data_entity_resource TO app_portfolio_role_app_common;


CREATE TABLE app_portfolio.app_data_resource_detail (
    id                                              INTEGER NOT NULL,
    json_data                                       LONGBLOB,
    app_data_resource_master_id                     INTEGER NOT NULL,
    app_data_entity_resource_id                     INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_id     INTEGER NOT NULL,
    app_data_resource_master_attribute_id           INTEGER NOT NULL,
    CONSTRAINT app_data_resource_detail_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_data_resource_detail TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_data_resource_detail TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.app_data_resource_detail_data (
    id                                    INTEGER NOT NULL,
    json_data                             LONGBLOB,
    date_created                          DATE,
    date_modified                         DATE,
    app_data_resource_detail_id           INTEGER NOT NULL,
    app_data_resource_master_attribute_id INTEGER,
    CONSTRAINT app_data_resource_detail_data_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_data_resource_detail_data TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_data_resource_detail_data TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.app_data_resource_master (
    id                                              INTEGER NOT NULL,
    json_data                                       LONGBLOB,
    user_account_app_user_account_id                INTEGER,
    user_account_app_app_id                         INTEGER,
    app_data_entity_resource_app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_id     INTEGER NOT NULL,
    app_data_entity_resource_id                     INTEGER NOT NULL,
    CONSTRAINT app_data_resource_master_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_data_resource_master TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_data_resource_master TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.app_data_stat (
    json_data                                       LONGBLOB,
    date_created                                    DATE,
    app_id                                          INTEGER NOT NULL,
    user_account_app_user_account_id                INTEGER,
    user_account_app_app_id                         INTEGER,
    app_data_resource_master_id                     INTEGER,
    app_data_entity_resource_id                     INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_id     INTEGER NOT NULL
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_data_stat TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_data_stat TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.app_data_translation (
    json_data                   LONGBLOB,
    language_id                 INTEGER NOT NULL,
    app_data_resource_master_id INTEGER NOT NULL,
    CONSTRAINT app_data_translation_pk PRIMARY KEY ( language_id,
                                                    app_data_resource_master_id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_data_translation TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_data_translation TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.app_device (
    app_id          INTEGER NOT NULL,
    app_setting_id  INTEGER NOT NULL,
    json_data       LONGBLOB,
    CONSTRAINT app_device_pk PRIMARY KEY ( app_id,
                                           app_setting_id )
);

GRANT SELECT ON app_portfolio.app_device TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_device TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.app_log (
    id                           INT NOT NULL AUTO_INCREMENT,
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
    date_created                 DATETIME,
	app_id                       INTEGER NOT NULL,
	CONSTRAINT app_log_pk PRIMARY KEY ( id )
);

CREATE INDEX app_log_date_created_index ON
    app_portfolio.app_log (
        date_created
    ASC );

GRANT SELECT, INSERT ON app_portfolio.app_log TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_log TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.app_object (
    app_id       INTEGER NOT NULL,
    object_name  VARCHAR(100) NOT NULL,
	CONSTRAINT app_object_pk PRIMARY KEY ( object_name,
                                           app_id )
);

GRANT SELECT ON app_portfolio.app_object TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object TO app_portfolio_role_app_admin;


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

GRANT SELECT ON app_portfolio.app_object_item TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_object_item TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.app_role (
    id        INTEGER NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    icon      VARCHAR(10) NOT NULL
);

GRANT SELECT ON app_portfolio.app_role TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_role TO app_portfolio_role_app_admin;

ALTER TABLE app_portfolio.app_role ADD CONSTRAINT app_role_pk PRIMARY KEY ( id );

CREATE TABLE app_portfolio.app_setting (
    id                                      INT NOT NULL AUTO_INCREMENT,
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

GRANT SELECT ON app_portfolio.app_setting TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_setting TO app_portfolio_role_app_admin;

ALTER TABLE app_portfolio.app_setting
    ADD CONSTRAINT app_setting_un UNIQUE ( app_setting_type_app_setting_type_name,
                                           value,
                                           app_setting_type_app_id );
                                                               
CREATE TABLE app_portfolio.app_setting_type (
    app_id                  INTEGER NOT NULL,
    app_setting_type_name   VARCHAR(100) NOT NULL,
    CONSTRAINT app_setting_type_pk PRIMARY KEY ( app_setting_type_name,
                                                 app_id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_setting_type TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_setting_type TO app_portfolio_role_app_common;

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
    country_id                             INTEGER,
    language_id_translation                INTEGER,
    text                                   VARCHAR(2000),
    json_data                              LONGBLOB
);

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT arc_3 CHECK ( ( ( app_object_object_name IS NOT NULL )
                                   AND ( app_object_app_id IS NOT NULL )
                                   AND ( app_object_item_object_item_name IS NULL )
                                   AND ( app_object_item_app_object_object_name IS NULL )
                                   AND ( app_object_item_app_object_app_id IS NULL )
                                   AND ( app_setting_id IS NULL )
                                   AND ( app_id IS NULL )
                                   AND ( app_category_id IS NULL )
                                   AND ( country_id IS NULL )
                                   AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_object_item_object_item_name IS NOT NULL )
                                      AND ( app_object_item_app_object_object_name IS NOT NULL )
                                      AND ( app_object_item_app_object_app_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_setting_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( app_category_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( country_id IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( country_id IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( language_id_translation IS NULL ) )
                                 OR ( ( language_id_translation IS NOT NULL )
                                      AND ( app_object_object_name IS NULL )
                                      AND ( app_object_app_id IS NULL )
                                      AND ( app_object_item_object_item_name IS NULL )
                                      AND ( app_object_item_app_object_object_name IS NULL )
                                      AND ( app_object_item_app_object_app_id IS NULL )
                                      AND ( app_setting_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( app_category_id IS NULL )
                                      AND ( country_id IS NULL ) ) );

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.app_translation TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.app_translation TO app_portfolio_role_app_common;

ALTER TABLE app_portfolio.app_translation ADD CONSTRAINT app_translation_app_un UNIQUE ( app_id,
                                                                                         language_id );

ALTER TABLE app_portfolio.app_translation
    ADD CONSTRAINT app_translation_app_category_un UNIQUE ( app_category_id,
                                                            app_id,
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

CREATE TABLE app_portfolio.country (
    id            INT NOT NULL AUTO_INCREMENT,
    country_code  VARCHAR(10) NOT NULL,
    flag_emoji    VARCHAR(10),
    flag_url      VARCHAR(100),
    country_group_id  INTEGER NOT NULL,
	CONSTRAINT country_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.country TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.country TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.country_group (
    id          INT NOT NULL AUTO_INCREMENT,
    group_name  VARCHAR(100) NOT NULL,
	CONSTRAINT country_group_pk PRIMARY KEY ( id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.country_group TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.country_group TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.event (
    id            INT NOT NULL AUTO_INCREMENT,
    event_name    VARCHAR(100) NOT NULL,
    event_type_id INTEGER NOT NULL,
    CONSTRAINT event_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.event TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.event_status (
    id          INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(100) NOT NULL,
    CONSTRAINT event_status_pk PRIMARY KEY ( id )
);

GRANT SELECT ON app_portfolio.event_status TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event_status TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.event_type (
    id              INT NOT NULL AUTO_INCREMENT,
    event_type_name VARCHAR(100) NOT NULL,
    CONSTRAINT event_type_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.event_type TO app_portfolio_role_app_admin;


GRANT SELECT ON app_portfolio.event_type TO app_portfolio_role_app_common;

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

GRANT SELECT ON app_portfolio.identity_provider TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.identity_provider TO app_portfolio_role_app_admin;

ALTER TABLE app_portfolio.identity_provider ADD CONSTRAINT identity_provider_order_un UNIQUE ( identity_provider_order );

CREATE TABLE app_portfolio.language (
    id         INT NOT NULL AUTO_INCREMENT,
    lang_code  VARCHAR(10) NOT NULL,
	CONSTRAINT language_pk PRIMARY KEY ( id )
);

CREATE INDEX lang_code_index ON
    app_portfolio.language (
        lang_code
    ASC );
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.language TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.language TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.locale (
    language_id  INTEGER NOT NULL,
    country_id   INTEGER NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.locale TO app_portfolio_role_app_admin;

GRANT SELECT ON app_portfolio.locale TO app_portfolio_role_app_common;

ALTER TABLE app_portfolio.locale ADD CONSTRAINT locale_language_id_country_id_un UNIQUE ( language_id,
                                                     country_id );

CREATE TABLE app_portfolio.profile_search (
    user_account_id    INTEGER,
    search             VARCHAR(100) NOT NULL,
    client_ip          VARCHAR(1000),
    client_user_agent  VARCHAR(1000),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       DATETIME NOT NULL
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.profile_search TO app_portfolio_role_app_admin;

GRANT SELECT, INSERT ON app_portfolio.profile_search TO app_portfolio_role_app_common;
	
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
    app_role_id           INTEGER,
	CONSTRAINT user_account_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account TO app_portfolio_role_app_admin;

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
    date_created                                      DATETIME NOT NULL,
    CONSTRAINT user_account_app_pk PRIMARY KEY ( user_account_id,
                                                 app_id
                                                 )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.user_account_app_data_post (
    id                                         INT NOT NULL AUTO_INCREMENT,
    description                                VARCHAR(100),
    json_data                                  LONGBLOB,
    date_created                               DATETIME,
    date_modified                              DATETIME,
    user_account_app_user_account_id           INT NOT NULL,
    user_account_app_app_id                    INT NOT NULL,
	CONSTRAINT user_account_app_data_post_pk PRIMARY KEY ( id )
);

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app_data_post TO app_portfolio_role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app_data_post TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.user_account_app_data_post_like (
    date_created                        DATETIME,	
    user_account_app_data_post_id         INTEGER NOT NULL,
    user_account_app_user_account_id    INTEGER NOT NULL,
    user_account_app_app_id             INTEGER NOT NULL,
	CONSTRAINT user_account_app_data_post_like_pk PRIMARY KEY ( user_account_app_user_account_id, user_account_app_data_post_id )
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app_data_post_like TO app_portfolio_role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app_data_post_like TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.user_account_app_data_post_view (
    client_ip                           VARCHAR(1000),
    client_user_agent                   VARCHAR(1000),
    client_longitude                    VARCHAR(100),
    client_latitude                     VARCHAR(100),
    date_created                        DATETIME NOT NULL,
    user_account_app_data_post_id       INTEGER NOT NULL,
    user_account_app_user_account_id    INTEGER,
    user_account_app_app_id             INTEGER
);
GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_app_data_post_view TO app_portfolio_role_app_admin;

GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_app_data_post_view TO app_portfolio_role_app_common;

CREATE TABLE app_portfolio.user_account_event (
    user_account_id             INTEGER NOT NULL,
    event_id                    INTEGER NOT NULL,
    event_status_id             INTEGER NOT NULL,
    date_created                DATETIME NOT NULL,
    date_modified               DATETIME,
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

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_event TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_event TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.user_account_follow (
    user_account_id         INTEGER NOT NULL,
    user_account_id_follow  INTEGER NOT NULL,
	date_created            DATETIME,
	CONSTRAINT user_account_follow_pk PRIMARY KEY ( user_account_id, user_account_id_follow )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_follow TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_follow TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.user_account_like (
    user_account_id       INTEGER NOT NULL,
    user_account_id_like  INTEGER NOT NULL,
	date_created          DATETIME,
	CONSTRAINT user_account_like_pk PRIMARY KEY ( user_account_id, user_account_id_like )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_like TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_like TO app_portfolio_role_app_admin;

CREATE TABLE app_portfolio.user_account_logon (
    user_account_id    INTEGER NOT NULL,
    app_id             INTEGER NOT NULL,
    result             INTEGER NOT NULL,
    access_token       VARCHAR(500),
    client_ip          VARCHAR(1000),
    client_user_agent  VARCHAR(1000),
    client_longitude   VARCHAR(100),
    client_latitude    VARCHAR(100),
    date_created       DATETIME NOT NULL
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_logon TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_logon TO app_portfolio_role_app_admin;

ALTER TABLE app_portfolio.user_account_logon ADD CONSTRAINT user_account_logon_access_token_un UNIQUE ( access_token );

CREATE TABLE app_portfolio.user_account_view (
    user_account_id       INTEGER,
    user_account_id_view  INTEGER NOT NULL,
    client_ip             VARCHAR(1000),
    client_user_agent     VARCHAR(1000),
    client_longitude      VARCHAR(100),
    client_latitude       VARCHAR(100),
    date_created          DATETIME NOT NULL
);
GRANT SELECT, INSERT, DELETE, UPDATE ON app_portfolio.user_account_view TO app_portfolio_role_app_common;

GRANT DELETE, INSERT, SELECT, UPDATE ON app_portfolio.user_account_view TO app_portfolio_role_app_admin;

ALTER TABLE app_portfolio.app
    ADD CONSTRAINT app_app_category_fk FOREIGN KEY ( app_category_id )
        REFERENCES app_portfolio.app_category ( id );

ALTER TABLE app_portfolio.app_device
    ADD CONSTRAINT app_device_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

ALTER TABLE app_portfolio.app_device
    ADD CONSTRAINT app_device_app_setting_fk FOREIGN KEY ( app_setting_id )
        REFERENCES app_portfolio.app_setting ( id );

ALTER TABLE app_portfolio.app_log
    ADD CONSTRAINT app_log_app_fk FOREIGN KEY ( app_id )
        REFERENCES app_portfolio.app ( id )
            ON DELETE CASCADE;

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

ALTER TABLE app_portfolio.country
    ADD CONSTRAINT country_country_group_fk FOREIGN KEY ( country_group_id )
        REFERENCES app_portfolio.country_group ( id );

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