CREATE TABLE <DB_SCHEMA/>.app (
    id        INTEGER NOT NULL,
	CONSTRAINT app_pk PRIMARY KEY ( id )
);

CREATE TABLE <DB_SCHEMA/>.app_data_entity (
    id        INTEGER NOT NULL CONSTRAINT app_data_entity_pk PRIMARY KEY AUTOINCREMENT,
    app_id    INTEGER NOT NULL,
    json_data TEXT,
    CONSTRAINT app_data_entity_uk UNIQUE (  app_id,
                                            id ),
    CONSTRAINT app_data_entity_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id )
            ON DELETE CASCADE
);
CREATE INDEX <DB_SCHEMA/>.app_data_entity_id_index ON app_data_entity (id);

UPDATE SQLITE_SEQUENCE SET seq = 1000000 WHERE name = 'app_data_entity';

CREATE TABLE <DB_SCHEMA/>.app_data_entity_resource (
    id                     INTEGER NOT NULL CONSTRAINT app_data_entity_resource_pk PRIMARY KEY AUTOINCREMENT,
    json_data              TEXT,
    app_setting_id         INTEGER NOT NULL,
    app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_id     INTEGER NOT NULL,
    CONSTRAINT app_data_entity_resource_uk UNIQUE (app_data_entity_app_id,
                                                        app_data_entity_id,
                                                        id ),
    CONSTRAINT app_data_entity_resource_app_data_entity_fk FOREIGN KEY ( app_data_entity_app_id,
                                                                             app_data_entity_id )
        REFERENCES app_data_entity (    app_id,
                                        id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_entity_resource_app_setting_fk FOREIGN KEY ( app_setting_id )
        REFERENCES app_setting ( id )
);
CREATE INDEX <DB_SCHEMA/>.app_data_entity_resource_id_index ON app_data_entity_resource (id);

UPDATE SQLITE_SEQUENCE SET seq = 1000000 WHERE name = 'app_data_entity_resource';

CREATE TABLE <DB_SCHEMA/>.app_data_resource_detail (
    id                                              INTEGER NOT NULL CONSTRAINT app_data_resource_detail_pk PRIMARY KEY AUTOINCREMENT,
    json_data                                       TEXT,
    app_data_resource_master_id                     INTEGER NOT NULL,
    app_data_entity_resource_id                     INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_id     INTEGER NOT NULL,
    app_data_resource_master_attribute_id           INTEGER,
    CONSTRAINT app_data_resource_detail_app_data_entity_resource_fk FOREIGN KEY ( app_data_entity_resource_app_data_entity_app_id,
                                                                                      app_data_entity_resource_app_data_entity_id,
                                                                                      app_data_entity_resource_id )
        REFERENCES app_data_entity_resource ( app_data_entity_app_id,
                                                            app_data_entity_id,
                                                            id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_resource_detail_app_data_resource_master_attribute_fk FOREIGN KEY ( app_data_resource_master_attribute_id )
        REFERENCES app_data_resource_master ( id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_resource_detail_app_data_resource_master_fk FOREIGN KEY ( app_data_resource_master_id )
        REFERENCES app_data_resource_master ( id )
            ON DELETE CASCADE    
);

UPDATE SQLITE_SEQUENCE SET seq = 1000000 WHERE name = 'app_data_resource_detail';

CREATE TABLE <DB_SCHEMA/>.app_data_resource_detail_data (
    id                                    INTEGER NOT NULL CONSTRAINT app_data_resource_detail_data_pk PRIMARY KEY AUTOINCREMENT,
    json_data                             TEXT,
    date_created                          DATE,
    date_modified                         DATE,
    app_data_resource_detail_id           INTEGER NOT NULL,
    app_data_resource_master_attribute_id INTEGER,
    CONSTRAINT app_data_resource_detail_data_app_data_resource_detail_fk FOREIGN KEY ( app_data_resource_detail_id )
        REFERENCES app_data_resource_detail ( id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_resource_detail_data_app_data_resource_master_attribute_fk FOREIGN KEY ( app_data_resource_master_attribute_id )
        REFERENCES app_data_resource_master ( id )
            ON DELETE CASCADE
);

UPDATE SQLITE_SEQUENCE SET seq = 1000000 WHERE name = 'app_data_resource_detail_data';

CREATE TABLE <DB_SCHEMA/>.app_data_resource_master (
    id                                              INTEGER NOT NULL CONSTRAINT app_data_resource_master_pk PRIMARY KEY AUTOINCREMENT,
    json_data                                       TEXT,
    user_account_app_user_account_id                INTEGER,
    user_account_app_app_id                         INTEGER,
    app_data_entity_resource_app_data_entity_app_id INTEGER NOT NULL,
    app_data_entity_resource_app_data_entity_id     INTEGER NOT NULL,
    app_data_entity_resource_id                     INTEGER NOT NULL,
    CONSTRAINT app_data_resource_master_app_data_entity_resource_fk FOREIGN KEY ( app_data_entity_resource_app_data_entity_app_id,
                                                                                      app_data_entity_resource_app_data_entity_id,
                                                                                      app_data_entity_resource_id )
        REFERENCES app_data_entity_resource ( app_data_entity_app_id,
                                                            app_data_entity_id,
                                                            id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_resource_master_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                              user_account_app_app_id )
        REFERENCES user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE
);

UPDATE SQLITE_SEQUENCE SET seq = 1000000 WHERE name = 'app_data_resource_master';

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
    user_account_id                                 INTEGER,
    CONSTRAINT arc_2 CHECK ( ( ( app_data_resource_master_id IS NOT NULL )
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
                                      AND ( app_id IS NULL ) ) ),
    CONSTRAINT app_data_stat_app_data_entity_resource_fk FOREIGN KEY ( app_data_entity_resource_app_data_entity_app_id,
                                                                           app_data_entity_resource_app_data_entity_id,
                                                                           app_data_entity_resource_id )
        REFERENCES app_data_entity_resource ( app_data_entity_app_id,
                                                            app_data_entity_id,
                                                            id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_stat_app_data_resource_master_fk FOREIGN KEY ( app_data_resource_master_id )
        REFERENCES app_data_resource_master ( id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_stat_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_stat_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                   user_account_app_app_id )
        REFERENCES user_account_app ( user_account_id,
                                        app_id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_stat_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
            ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.app_data_translation (
    json_data                   TEXT,
    language_id                 INTEGER NOT NULL,
    app_data_resource_master_id INTEGER NOT NULL,
    CONSTRAINT app_data_translation_pk PRIMARY KEY ( language_id,
                                                    app_data_resource_master_id ),
    CONSTRAINT app_data_translation_app_data_resource_master_fk FOREIGN KEY ( app_data_resource_master_id )
        REFERENCES app_data_resource_master ( id )
            ON DELETE CASCADE,
    CONSTRAINT app_data_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id )
);

CREATE TABLE <DB_SCHEMA/>.app_setting (
    id                                      INTEGER NOT NULL CONSTRAINT app_setting_pk PRIMARY KEY AUTOINCREMENT,
    app_setting_type_app_id                 INTEGER NOT NULL,
    app_setting_type_app_setting_type_name  VARCHAR(100) NOT NULL,
    value                                   VARCHAR(500) NOT NULL,
    display_data                            VARCHAR(500),
    data2                                   VARCHAR(500),
    data3                                   VARCHAR(500),
    data4                                   VARCHAR(500),
    data5                                   VARCHAR(500),
    CONSTRAINT app_setting_un UNIQUE ( app_setting_type_app_setting_type_name,
                                           value,
                                           app_setting_type_app_id ),
    CONSTRAINT app_setting_app_setting_type_fk FOREIGN KEY ( app_setting_type_app_setting_type_name,
                                                                 app_setting_type_app_id )
        REFERENCES app_setting_type ( app_setting_type_name,
                                                    app_id )
            ON DELETE CASCADE
);
                                                               
CREATE TABLE <DB_SCHEMA/>.app_setting_type (
    app_id                  INTEGER NOT NULL,
    app_setting_type_name   VARCHAR(100) NOT NULL,
    CONSTRAINT app_setting_type_pk PRIMARY KEY ( app_setting_type_name,
                                                 app_id ),
    CONSTRAINT app_setting_type_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id )
            ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.app_translation (
    language_id                            INTEGER NOT NULL,
    app_setting_id                         INTEGER NOT NULL,
    text                                   VARCHAR(2000),
    json_data                              TEXT,
    CONSTRAINT app_translation_app_setting_un UNIQUE ( app_setting_id, language_id ),
    CONSTRAINT app_translation_app_setting_fk FOREIGN KEY ( app_setting_id )
        REFERENCES app_setting ( id )
            ON DELETE CASCADE,
    CONSTRAINT app_translation_language_fk FOREIGN KEY ( language_id )
        REFERENCES language ( id )
);

CREATE TABLE <DB_SCHEMA/>.event (
    id            INTEGER NOT NULL CONSTRAINT event_pk PRIMARY KEY AUTOINCREMENT,
    event_name    VARCHAR(100) NOT NULL,
    event_type_id INTEGER NOT NULL,
    CONSTRAINT event_event_type_fk FOREIGN KEY ( event_type_id )
        REFERENCES event_type ( id )
);

CREATE TABLE <DB_SCHEMA/>.event_status (
    id          INTEGER NOT NULL CONSTRAINT event_status_pk PRIMARY KEY AUTOINCREMENT,
    status_name VARCHAR(100) NOT NULL
);

CREATE TABLE <DB_SCHEMA/>.event_type (
    id              INTEGER NOT NULL CONSTRAINT event_type_pk PRIMARY KEY AUTOINCREMENT,
    event_type_name VARCHAR(100) NOT NULL
);

CREATE TABLE <DB_SCHEMA/>.language (
    id         INTEGER NOT NULL CONSTRAINT language_pk PRIMARY KEY AUTOINCREMENT,
    locale     VARCHAR(10) NOT NULL
);

CREATE INDEX <DB_SCHEMA/>.locale_index ON
    language (
        locale
    ASC );

CREATE TABLE <DB_SCHEMA/>.user_account (
    id                    INTEGER NOT NULL CONSTRAINT user_account_pk PRIMARY KEY AUTOINCREMENT,
    iam_user_id           INTEGER,
    date_created          DATETIME,
    date_modified         DATETIME
);

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
                                                 ),
    CONSTRAINT user_account_app_app_fk FOREIGN KEY ( app_id )
        REFERENCES app ( id )
            ON DELETE CASCADE,
    CONSTRAINT user_account_app_app_setting_arabic_script_fk FOREIGN KEY ( app_setting_preference_arabic_script_id )
        REFERENCES app_setting ( id ),
    CONSTRAINT user_account_app_app_setting_direction_fk FOREIGN KEY ( app_setting_preference_direction_id )
        REFERENCES app_setting ( id ),
    CONSTRAINT user_account_app_app_setting_timezone_fk FOREIGN KEY ( app_setting_preference_timezone_id )
        REFERENCES app_setting ( id ),
    CONSTRAINT user_account_app_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
            ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post (
    id                                         INTEGER NOT NULL CONSTRAINT user_account_app_data_post_pk PRIMARY KEY AUTOINCREMENT,
    description                                VARCHAR(100),
    json_data                                  TEXT,
    date_created                               DATETIME,
    date_modified                              DATETIME,
    user_account_app_user_account_id           INTEGER NOT NULL,
    user_account_app_app_id                    INTEGER NOT NULL,
    CONSTRAINT user_account_app_data_post_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                              user_account_app_app_id )
        REFERENCES user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post_like (
    date_created                        DATETIME,	
    user_account_app_data_post_id         INTEGER NOT NULL,
    user_account_app_user_account_id    INTEGER NOT NULL,
    user_account_app_app_id             INTEGER NOT NULL,
	CONSTRAINT user_account_app_data_post_like_pk PRIMARY KEY ( user_account_app_user_account_id, user_account_app_data_post_id ),
    CONSTRAINT user_account_app_data_post_like_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                                   user_account_app_app_id )
        REFERENCES user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE,
    CONSTRAINT user_account_app_data_post_like_user_account_app_data_post_fk FOREIGN KEY ( user_account_app_data_post_id )
        REFERENCES user_account_app_data_post ( id )
            ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post_view (
    client_ip                           VARCHAR(1000),
    client_user_agent                   VARCHAR(1000),
    date_created                        DATETIME NOT NULL,
    user_account_app_data_post_id       INTEGER NOT NULL,
    user_account_app_user_account_id    INTEGER,
    user_account_app_app_id             INTEGER,
    CONSTRAINT user_account_app_data_post_view_user_account_app_fk FOREIGN KEY ( user_account_app_user_account_id,
                                                                                   user_account_app_app_id )
        REFERENCES user_account_app ( user_account_id,
                                                    app_id )
            ON DELETE CASCADE,
    CONSTRAINT user_account_app_data_post_view_user_account_app_data_post_fk FOREIGN KEY ( user_account_app_data_post_id )
        REFERENCES user_account_app_data_post ( id )
            ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.user_account_event (
    user_account_id             INTEGER NOT NULL,
    event_id                    INTEGER NOT NULL,
    event_status_id             INTEGER NOT NULL,
    date_created                DATETIME NOT NULL,
    date_modified               DATETIME,
    CONSTRAINT user_account_event_event_fk FOREIGN KEY ( event_id )
        REFERENCES event ( id ),
    CONSTRAINT user_account_event_event_status_fk FOREIGN KEY ( event_status_id )
        REFERENCES event_status ( id ),
    CONSTRAINT user_account_event_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
            ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.user_account_follow (
    user_account_id         INTEGER NOT NULL,
    user_account_id_follow  INTEGER NOT NULL,
	date_created            DATETIME,
	CONSTRAINT user_account_follow_pk PRIMARY KEY ( user_account_id, user_account_id_follow ),
    CONSTRAINT user_account_follow_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
		    ON DELETE CASCADE,
    CONSTRAINT user_account_follow_user_account_follow_fk FOREIGN KEY ( user_account_id_follow )
        REFERENCES user_account ( id )
		    ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.user_account_like (
    user_account_id       INTEGER NOT NULL,
    user_account_id_like  INTEGER NOT NULL,
	date_created          DATETIME,
	CONSTRAINT user_account_like_pk PRIMARY KEY ( user_account_id, user_account_id_like ),
    CONSTRAINT user_account_like_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
		    ON DELETE CASCADE,
    CONSTRAINT user_account_like_user_account_like_fk FOREIGN KEY ( user_account_id_like )
        REFERENCES user_account ( id )
		    ON DELETE CASCADE
);

CREATE TABLE <DB_SCHEMA/>.user_account_view (
    user_account_id       INTEGER,
    user_account_id_view  INTEGER NOT NULL,
    client_ip             VARCHAR(1000),
    client_user_agent     VARCHAR(1000),
    date_created          DATETIME NOT NULL,
    CONSTRAINT user_account_view_user_account_fk FOREIGN KEY ( user_account_id )
        REFERENCES user_account ( id )
            ON DELETE CASCADE,
    CONSTRAINT user_account_view_user_account_view_fk FOREIGN KEY ( user_account_id_view )
        REFERENCES user_account ( id )
            ON DELETE CASCADE
);