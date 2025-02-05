CREATE ROLE app_portfolio_role_app_common;
CREATE ROLE app_portfolio_role_app_dba;

CREATE USER app_portfolio IDENTIFIED BY <APP_PASSWORD/>
    ACCOUNT UNLOCK;
GRANT app_portfolio_role_app_dba TO app_portfolio;

GRANT ALL PRIVILEGES ON <DB_SCHEMA/>.* TO app_portfolio_role_app_dba;

CREATE TABLE <DB_SCHEMA/>.app (
    id        INTEGER NOT NULL,
	CONSTRAINT app_pk PRIMARY KEY ( id )
);

GRANT SELECT ON <DB_SCHEMA/>.app TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_entity (
    id        INT NOT NULL AUTO_INCREMENT,
    app_id    INTEGER NOT NULL,
    json_data TEXT,
    CONSTRAINT app_data_entity_pk PRIMARY KEY ( app_id,
                                                id ),
    INDEX (id)
);

ALTER TABLE <DB_SCHEMA/>.app_data_entity AUTO_INCREMENT=1000000;

GRANT SELECT ON <DB_SCHEMA/>.app_data_entity TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_entity_resource (
    id                     INT NOT NULL AUTO_INCREMENT,
    json_data              TEXT,
    app_setting_id         INTEGER NOT NULL,
    app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_id     INTEGER NOT NULL,
    CONSTRAINT app_data_entity_resource_pk PRIMARY KEY (app_data_entity_app_id,
                                                        app_data_entity_id,
                                                        id ),
    INDEX (id)
);

ALTER TABLE <DB_SCHEMA/>.app_data_entity_resource AUTO_INCREMENT=1000000;

GRANT SELECT ON <DB_SCHEMA/>.app_data_entity_resource TO app_portfolio_role_app_common;


CREATE TABLE <DB_SCHEMA/>.app_data_resource_detail (
    id                                              INT NOT NULL AUTO_INCREMENT,
    json_data                                       TEXT,
    app_data_resource_master_id                     INTEGER NOT NULL,
    app_data_entity_resource_id                     INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_id     INTEGER NOT NULL,
    app_data_resource_master_attribute_id           INTEGER,
    CONSTRAINT app_data_resource_detail_pk PRIMARY KEY ( id )
);

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail AUTO_INCREMENT=1000000;

GRANT DELETE, INSERT, SELECT, UPDATE ON <DB_SCHEMA/>.app_data_resource_detail TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_resource_detail_data (
    id                                    INT NOT NULL AUTO_INCREMENT,
    json_data                             TEXT,
    date_created                          DATE,
    date_modified                         DATE,
    app_data_resource_detail_id           INTEGER NOT NULL,
    app_data_resource_master_attribute_id INTEGER,
    CONSTRAINT app_data_resource_detail_data_pk PRIMARY KEY ( id )
);

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail_data AUTO_INCREMENT=1000000;

GRANT DELETE, INSERT, SELECT, UPDATE ON <DB_SCHEMA/>.app_data_resource_detail_data TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_resource_master (
    id                                              INT NOT NULL AUTO_INCREMENT,
    json_data                                       TEXT,
    user_account_app_user_account_id                INTEGER,
    user_account_app_app_id                         INTEGER,
    app_data_entity_resource_app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_id     INTEGER NOT NULL,
    app_data_entity_resource_id                     INTEGER NOT NULL,
    CONSTRAINT app_data_resource_master_pk PRIMARY KEY ( id )
);

ALTER TABLE <DB_SCHEMA/>.app_data_resource_master AUTO_INCREMENT=1000000;

GRANT DELETE, INSERT, SELECT, UPDATE ON <DB_SCHEMA/>.app_data_resource_master TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_stat (
    json_data                                       TEXT,
    date_created                                    DATE,
    app_id                                          INTEGER,
    user_account_app_user_account_id                INTEGER,
    user_account_app_app_id                         INTEGER,
    app_data_resource_master_id                     INTEGER,
    app_data_entity_resource_id                     INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_id     INTEGER NOT NULL,
    user_account_id                                 INTEGER
);

ALTER TABLE <DB_SCHEMA/>.app_data_stat
    ADD CONSTRAINT arc_2 CHECK ( ( ( app_data_resource_master_id IS NOT NULL )
                                   AND ( user_account_id IS NULL )
                                   AND ( app_id IS NULL )
                                   AND ( user_account_app_user_account_id IS NULL )
                                   AND ( user_account_app_app_id IS NULL ) )
                                 OR ( ( user_account_id IS NOT NULL )
                                      AND ( app_data_resource_master_id IS NULL )
                                      AND ( app_id IS NULL )
                                      AND ( user_account_app_user_account_id IS NULL )
                                      AND ( user_account_app_app_id IS NULL ) )
                                 OR ( ( app_id IS NOT NULL )
                                      AND ( app_data_resource_master_id IS NULL )
                                      AND ( user_account_id IS NULL )
                                      AND ( user_account_app_user_account_id IS NULL )
                                      AND ( user_account_app_app_id IS NULL ) )
                                 OR ( ( user_account_app_user_account_id IS NOT NULL )
                                      AND ( user_account_app_app_id IS NOT NULL )
                                      AND ( app_data_resource_master_id IS NULL )
                                      AND ( user_account_id IS NULL )
                                      AND ( app_id IS NULL ) ) );

GRANT SELECT ON <DB_SCHEMA/>.app_data_stat TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_translation (
    json_data                   TEXT,
    language_id                 INTEGER NOT NULL,
    app_data_resource_master_id INTEGER NOT NULL,
    CONSTRAINT app_data_translation_pk PRIMARY KEY ( language_id,
                                                    app_data_resource_master_id )
);

GRANT SELECT ON <DB_SCHEMA/>.app_data_translation TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_setting (
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

GRANT SELECT ON <DB_SCHEMA/>.app_setting TO app_portfolio_role_app_common;

ALTER TABLE <DB_SCHEMA/>.app_setting
    ADD CONSTRAINT app_setting_un UNIQUE ( app_setting_type_app_setting_type_name,
                                           value,
                                           app_setting_type_app_id );
                                                               
CREATE TABLE <DB_SCHEMA/>.app_setting_type (
    app_id                  INTEGER NOT NULL,
    app_setting_type_name   VARCHAR(100) NOT NULL,
    CONSTRAINT app_setting_type_pk PRIMARY KEY ( app_setting_type_name,
                                                 app_id )
);

GRANT SELECT ON <DB_SCHEMA/>.app_setting_type TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_translation (
    language_id                            INTEGER NOT NULL,
    app_setting_id                         INTEGER NOT NULL,
    text                                   VARCHAR(2000),
    json_data                              TEXT
);

GRANT SELECT ON <DB_SCHEMA/>.app_translation TO app_portfolio_role_app_common;

ALTER TABLE <DB_SCHEMA/>.app_translation ADD CONSTRAINT app_translation_app_setting_un UNIQUE ( app_setting_id,
                                                                                                 language_id );


CREATE TABLE <DB_SCHEMA/>.event (
    id            INT NOT NULL AUTO_INCREMENT,
    event_name    VARCHAR(100) NOT NULL,
    event_type_id INTEGER NOT NULL,
    CONSTRAINT event_pk PRIMARY KEY ( id )
);

GRANT SELECT ON <DB_SCHEMA/>.event TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.event_status (
    id          INT NOT NULL AUTO_INCREMENT,
    status_name VARCHAR(100) NOT NULL,
    CONSTRAINT event_status_pk PRIMARY KEY ( id )
);

GRANT SELECT ON <DB_SCHEMA/>.event_status TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.event_type (
    id              INT NOT NULL AUTO_INCREMENT,
    event_type_name VARCHAR(100) NOT NULL,
    CONSTRAINT event_type_pk PRIMARY KEY ( id )
);

GRANT SELECT ON <DB_SCHEMA/>.event_type TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.language (
    id         INT NOT NULL AUTO_INCREMENT,
    locale     VARCHAR(10) NOT NULL,
	CONSTRAINT language_pk PRIMARY KEY ( id )
);

CREATE INDEX locale_index ON
    <DB_SCHEMA/>.language (
        locale
    ASC );

GRANT SELECT ON <DB_SCHEMA/>.language TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account (
    id                    INT NOT NULL AUTO_INCREMENT,
    iam_user_id           INTEGER,
    date_created          DATETIME,
    date_modified         DATETIME,
    
	CONSTRAINT user_account_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_app (
    user_account_id                                   INTEGER NOT NULL,
    app_id                                            INTEGER NOT NULL,
    preference_locale                                 VARCHAR(100),
    app_setting_preference_timezone_id                INTEGER,
    app_setting_preference_direction_id               INTEGER,
    app_setting_preference_arabic_script_id           INTEGER,
    date_created                                      DATETIME NOT NULL,
    json_data                                         TEXT,
    CONSTRAINT user_account_app_pk PRIMARY KEY ( user_account_id,
                                                 app_id
                                                 )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_app TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post (
    id                                         INT NOT NULL AUTO_INCREMENT,
    description                                VARCHAR(100),
    json_data                                  TEXT,
    date_created                               DATETIME,
    date_modified                              DATETIME,
    user_account_app_user_account_id           INT NOT NULL,
    user_account_app_app_id                    INT NOT NULL,
	CONSTRAINT user_account_app_data_post_pk PRIMARY KEY ( id )
);

GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_app_data_post TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post_like (
    date_created                        DATETIME,	
    user_account_app_data_post_id         INTEGER NOT NULL,
    user_account_app_user_account_id    INTEGER NOT NULL,
    user_account_app_app_id             INTEGER NOT NULL,
	CONSTRAINT user_account_app_data_post_like_pk PRIMARY KEY ( user_account_app_user_account_id, user_account_app_data_post_id )
);

GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_app_data_post_like TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post_view (
    client_ip                           VARCHAR(1000),
    client_user_agent                   VARCHAR(1000),
    date_created                        DATETIME NOT NULL,
    user_account_app_data_post_id       INTEGER NOT NULL,
    user_account_app_user_account_id    INTEGER,
    user_account_app_app_id             INTEGER
);

GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_app_data_post_view TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_event (
    user_account_id             INTEGER NOT NULL,
    event_id                    INTEGER NOT NULL,
    event_status_id             INTEGER NOT NULL,
    date_created                DATETIME NOT NULL,
    date_modified               DATETIME
);

GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_event TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_follow (
    user_account_id         INTEGER NOT NULL,
    user_account_id_follow  INTEGER NOT NULL,
	date_created            DATETIME,
	CONSTRAINT user_account_follow_pk PRIMARY KEY ( user_account_id, user_account_id_follow )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_follow TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_like (
    user_account_id       INTEGER NOT NULL,
    user_account_id_like  INTEGER NOT NULL,
	date_created          DATETIME,
	CONSTRAINT user_account_like_pk PRIMARY KEY ( user_account_id, user_account_id_like )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_like TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_view (
    user_account_id       INTEGER,
    user_account_id_view  INTEGER NOT NULL,
    client_ip             VARCHAR(1000),
    client_user_agent     VARCHAR(1000),
    date_created          DATETIME NOT NULL
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_view TO app_portfolio_role_app_common;

ALTER TABLE <DB_SCHEMA/>.app_data_entity
    ADD CONSTRAINT app_data_entity_app_fk FOREIGN KEY ( app_id )
        REFERENCES <DB_SCHEMA/>.app ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_entity_resource
    ADD CONSTRAINT app_data_entity_resource_app_data_entity_fk FOREIGN KEY ( app_data_entity_app_id,
                                                                             app_data_entity_id )
        REFERENCES <DB_SCHEMA/>.app_data_entity ( app_id,
                                                   id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_entity_resource
    ADD CONSTRAINT app_data_entity_resource_app_setting_fk FOREIGN KEY ( app_setting_id )
        REFERENCES <DB_SCHEMA/>.app_setting ( id );

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail
    ADD CONSTRAINT app_data_resource_detail_app_data_entity_resource_fk FOREIGN KEY ( app_data_entity_resource_app_data_entity_app_id
    ,
                                                                                      app_data_entity_resource_app_data_entity_id,
                                                                                      app_data_entity_resource_id )
        REFERENCES <DB_SCHEMA/>.app_data_entity_resource ( app_data_entity_app_id,
                                                            app_data_entity_id,
                                                            id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail
    ADD CONSTRAINT app_data_resource_detail_app_data_resource_master_attribute_fk FOREIGN KEY ( app_data_resource_master_attribute_id )
        REFERENCES <DB_SCHEMA/>.app_data_resource_master ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail
    ADD CONSTRAINT app_data_resource_detail_app_data_resource_master_fk FOREIGN KEY ( app_data_resource_master_id )
        REFERENCES <DB_SCHEMA/>.app_data_resource_master ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail_data
    ADD CONSTRAINT app_data_resource_detail_data_app_data_resource_detail_fk FOREIGN KEY ( app_data_resource_detail_id )
        REFERENCES <DB_SCHEMA/>.app_data_resource_detail ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail_data
    ADD CONSTRAINT app_data_resource_detail_data_app_data_resource_master_fk FOREIGN KEY ( app_data_resource_master_attribute_id )
        REFERENCES <DB_SCHEMA/>.app_data_resource_master ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_resource_master
    ADD CONSTRAINT app_data_resource_master_app_data_entity_resource_fk FOREIGN KEY ( app_data_entity_resource_app_data_entity_app_id
    ,
                                                                                      app_data_entity_resource_app_data_entity_id,
                                                                                      app_data_entity_resource_id )
        REFERENCES <DB_SCHEMA/>.app_data_entity_resource ( app_data_entity_app_id,
                                                            app_data_entity_id,
                                                            id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_resource_master
    ADD CONSTRAINT app_data_resource_master_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                              user_account_app_app_id )
        REFERENCES <DB_SCHEMA/>.user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_stat
    ADD CONSTRAINT app_data_stat_app_data_entity_resource_fk FOREIGN KEY ( app_data_entity_resource_app_data_entity_app_id,
                                                                           app_data_entity_resource_app_data_entity_id,
                                                                           app_data_entity_resource_id )
        REFERENCES <DB_SCHEMA/>.app_data_entity_resource ( app_data_entity_app_id,
                                                            app_data_entity_id,
                                                            id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_stat
    ADD CONSTRAINT app_data_stat_app_data_resource_master_fk FOREIGN KEY ( app_data_resource_master_id )
        REFERENCES <DB_SCHEMA/>.app_data_resource_master ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_stat
    ADD CONSTRAINT app_data_stat_app_fk FOREIGN KEY ( app_id )
        REFERENCES <DB_SCHEMA/>.app ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_stat
    ADD CONSTRAINT app_data_stat_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                   user_account_app_app_id )
        REFERENCES <DB_SCHEMA/>.user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_stat
    ADD CONSTRAINT app_data_stat_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_translation
    ADD CONSTRAINT app_data_translation_app_data_resource_master_fk FOREIGN KEY ( app_data_resource_master_id )
        REFERENCES <DB_SCHEMA/>.app_data_resource_master ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_data_translation
    ADD CONSTRAINT app_data_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES <DB_SCHEMA/>.language ( id );

ALTER TABLE <DB_SCHEMA/>.app_setting
    ADD CONSTRAINT app_setting_app_setting_type_fk FOREIGN KEY ( app_setting_type_app_setting_type_name,
                                                                 app_setting_type_app_id )
        REFERENCES <DB_SCHEMA/>.app_setting_type ( app_setting_type_name,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_setting_type
    ADD CONSTRAINT app_setting_type_app_fk FOREIGN KEY ( app_id )
        REFERENCES <DB_SCHEMA/>.app ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_translation
    ADD CONSTRAINT app_translation_app_setting_fk FOREIGN KEY ( app_setting_id )
        REFERENCES <DB_SCHEMA/>.app_setting ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.app_translation
    ADD CONSTRAINT app_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES <DB_SCHEMA/>.language ( id );

ALTER TABLE <DB_SCHEMA/>.event
    ADD CONSTRAINT event_event_type_fk FOREIGN KEY ( event_type_id )
        REFERENCES <DB_SCHEMA/>.event_type ( id );

ALTER TABLE <DB_SCHEMA/>.user_account_app
    ADD CONSTRAINT user_account_app_app_fk FOREIGN KEY ( app_id )
        REFERENCES <DB_SCHEMA/>.app ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_app
    ADD CONSTRAINT user_account_app_app_setting_arabic_script_fk FOREIGN KEY ( app_setting_preference_arabic_script_id )
        REFERENCES <DB_SCHEMA/>.app_setting ( id );

ALTER TABLE <DB_SCHEMA/>.user_account_app
    ADD CONSTRAINT user_account_app_app_setting_direction_fk FOREIGN KEY ( app_setting_preference_direction_id )
        REFERENCES <DB_SCHEMA/>.app_setting ( id );

ALTER TABLE <DB_SCHEMA/>.user_account_app
    ADD CONSTRAINT user_account_app_app_setting_timezone_fk FOREIGN KEY ( app_setting_preference_timezone_id )
        REFERENCES <DB_SCHEMA/>.app_setting ( id );

ALTER TABLE <DB_SCHEMA/>.user_account_app_data_post_like
    ADD CONSTRAINT user_account_app_data_post_like_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                                   user_account_app_app_id )
        REFERENCES <DB_SCHEMA/>.user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_app_data_post_like
    ADD CONSTRAINT user_account_app_data_post_like_user_account_app_data_post_fk FOREIGN KEY ( user_account_app_data_post_id )
        REFERENCES <DB_SCHEMA/>.user_account_app_data_post ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_app_data_post
    ADD CONSTRAINT user_account_app_data_post_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                              user_account_app_app_id )
        REFERENCES <DB_SCHEMA/>.user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_app_data_post_view
    ADD CONSTRAINT user_account_app_data_post_view_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                                   user_account_app_app_id )
        REFERENCES <DB_SCHEMA/>.user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_app_data_post_view
    ADD CONSTRAINT user_account_app_data_post_view_user_account_app_data_post_fk FOREIGN KEY ( user_account_app_data_post_id )
        REFERENCES <DB_SCHEMA/>.user_account_app_data_post ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_app
    ADD CONSTRAINT user_account_app_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_event
    ADD CONSTRAINT user_account_event_event_fk FOREIGN KEY ( event_id )
        REFERENCES <DB_SCHEMA/>.event ( id );

ALTER TABLE <DB_SCHEMA/>.user_account_event
    ADD CONSTRAINT user_account_event_event_status_fk FOREIGN KEY ( event_status_id )
        REFERENCES <DB_SCHEMA/>.event_status ( id );

ALTER TABLE <DB_SCHEMA/>.user_account_event
    ADD CONSTRAINT user_account_event_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
            ON DELETE CASCADE;
	
ALTER TABLE <DB_SCHEMA/>.user_account_follow
    ADD CONSTRAINT user_account_follow_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
		    ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_follow
    ADD CONSTRAINT user_account_follow_user_account_follow_fk FOREIGN KEY ( user_account_id_follow )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
		    ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_like
    ADD CONSTRAINT user_account_like_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
		    ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_like
    ADD CONSTRAINT user_account_like_user_account_like_fk FOREIGN KEY ( user_account_id_like )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
		    ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_view
    ADD CONSTRAINT user_account_view_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
            ON DELETE CASCADE;

ALTER TABLE <DB_SCHEMA/>.user_account_view
    ADD CONSTRAINT user_account_view_user_account_view_fk FOREIGN KEY ( user_account_id_view )
        REFERENCES <DB_SCHEMA/>.user_account ( id )
            ON DELETE CASCADE;