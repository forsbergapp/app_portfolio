CREATE ROLE app_portfolio_role_app_common;
CREATE ROLE app_portfolio_role_app_dba;

CREATE USER app_portfolio IDENTIFIED BY <APP_PASSWORD/>
    ACCOUNT UNLOCK;
GRANT app_portfolio_role_app_dba TO app_portfolio;

GRANT ALL PRIVILEGES ON <DB_SCHEMA/>.* TO app_portfolio_role_app_dba;

CREATE TABLE <DB_SCHEMA/>.app (
    id        BIGINT NOT NULL,
	CONSTRAINT app_pk PRIMARY KEY ( id )
);

GRANT SELECT ON <DB_SCHEMA/>.app TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_entity (
    id        BIGINT NOT NULL AUTO_INCREMENT,
    app_id    BIGINT NOT NULL,
    json_data LONGTEXT,
    CONSTRAINT app_data_entity_pk PRIMARY KEY ( app_id,
                                                id ),
    INDEX (id)
);

ALTER TABLE <DB_SCHEMA/>.app_data_entity AUTO_INCREMENT=1000000;

GRANT SELECT ON <DB_SCHEMA/>.app_data_entity TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_entity_resource (
    id                     BIGINT NOT NULL AUTO_INCREMENT,
    json_data              LONGTEXT,
    app_setting_id         BIGINT NOT NULL,
    app_data_entity_app_id BIGINT NOT NULL,
    app_data_entity_id     BIGINT NOT NULL,
    CONSTRAINT app_data_entity_resource_pk PRIMARY KEY (app_data_entity_app_id,
                                                        app_data_entity_id,
                                                        id ),
    INDEX (id)
);

ALTER TABLE <DB_SCHEMA/>.app_data_entity_resource AUTO_INCREMENT=1000000;

GRANT SELECT ON <DB_SCHEMA/>.app_data_entity_resource TO app_portfolio_role_app_common;


CREATE TABLE <DB_SCHEMA/>.app_data_resource_detail (
    id                                              BIGINT NOT NULL AUTO_INCREMENT,
    json_data                                       LONGTEXT,
    app_data_resource_master_id                     BIGINT NOT NULL,
    app_data_entity_resource_id                     BIGINT NOT NULL,
    app_data_entity_resource_app_data_entity_app_id BIGINT NOT NULL,
    app_data_entity_resource_app_data_entity_id     BIGINT NOT NULL,
    app_data_resource_master_attribute_id           BIGINT,
    CONSTRAINT app_data_resource_detail_pk PRIMARY KEY ( id )
);

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail AUTO_INCREMENT=1000000;

GRANT DELETE, INSERT, SELECT, UPDATE ON <DB_SCHEMA/>.app_data_resource_detail TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_resource_detail_data (
    id                                    BIGINT NOT NULL AUTO_INCREMENT,
    json_data                             LONGTEXT,
    date_created                          DATE,
    date_modified                         DATE,
    app_data_resource_detail_id           BIGINT NOT NULL,
    app_data_resource_master_attribute_id BIGINT,
    CONSTRAINT app_data_resource_detail_data_pk PRIMARY KEY ( id )
);

ALTER TABLE <DB_SCHEMA/>.app_data_resource_detail_data AUTO_INCREMENT=1000000;

GRANT DELETE, INSERT, SELECT, UPDATE ON <DB_SCHEMA/>.app_data_resource_detail_data TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_resource_master (
    id                                              BIGINT NOT NULL AUTO_INCREMENT,
    json_data                                       LONGTEXT,
    user_account_app_user_account_id                BIGINT,
    user_account_app_app_id                         BIGINT,
    app_data_entity_resource_app_data_entity_app_id BIGINT NOT NULL,
    app_data_entity_resource_app_data_entity_id     BIGINT NOT NULL,
    app_data_entity_resource_id                     BIGINT NOT NULL,
    CONSTRAINT app_data_resource_master_pk PRIMARY KEY ( id )
);

ALTER TABLE <DB_SCHEMA/>.app_data_resource_master AUTO_INCREMENT=1000000;

GRANT DELETE, INSERT, SELECT, UPDATE ON <DB_SCHEMA/>.app_data_resource_master TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.app_data_stat (
    json_data                                       LONGTEXT,
    date_created                                    DATE,
    app_id                                          BIGINT,
    user_account_app_user_account_id                BIGINT,
    user_account_app_app_id                         BIGINT,
    app_data_resource_master_id                     BIGINT,
    app_data_entity_resource_id                     BIGINT NOT NULL,
    app_data_entity_resource_app_data_entity_app_id BIGINT NOT NULL,
    app_data_entity_resource_app_data_entity_id     BIGINT NOT NULL,
    user_account_id                                 BIGINT
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

CREATE TABLE <DB_SCHEMA/>.user_account (
    id                    BIGINT NOT NULL AUTO_INCREMENT,
    iam_user_id           BIGINT,
    date_created          DATETIME,
    date_modified         DATETIME,
    
	CONSTRAINT user_account_pk PRIMARY KEY ( id )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_app (
    user_account_id                                   BIGINT NOT NULL,
    app_id                                            BIGINT NOT NULL,
    date_created                                      DATETIME NOT NULL,
    json_data                                         LONGTEXT,
    CONSTRAINT user_account_app_pk PRIMARY KEY ( user_account_id,
                                                 app_id
                                                 )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_app TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post (
    id                                         BIGINT NOT NULL AUTO_INCREMENT,
    description                                VARCHAR(100),
    json_data                                  LONGTEXT,
    date_created                               DATETIME,
    date_modified                              DATETIME,
    user_account_app_user_account_id           BIGINT NOT NULL,
    user_account_app_app_id                    BIGINT NOT NULL,
	CONSTRAINT user_account_app_data_post_pk PRIMARY KEY ( id )
);

GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_app_data_post TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post_like (
    date_created                        DATETIME,	
    user_account_app_data_post_id         BIGINT NOT NULL,
    user_account_app_user_account_id    BIGINT NOT NULL,
    user_account_app_app_id             BIGINT NOT NULL,
	CONSTRAINT user_account_app_data_post_like_pk PRIMARY KEY ( user_account_app_user_account_id, user_account_app_data_post_id )
);

GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_app_data_post_like TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_app_data_post_view (
    client_ip                           VARCHAR(1000),
    client_user_agent                   VARCHAR(1000),
    date_created                        DATETIME NOT NULL,
    user_account_app_data_post_id       BIGINT NOT NULL,
    user_account_app_user_account_id    BIGINT,
    user_account_app_app_id             BIGINT
);

GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_app_data_post_view TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_follow (
    user_account_id         BIGINT NOT NULL,
    user_account_id_follow  BIGINT NOT NULL,
	date_created            DATETIME,
	CONSTRAINT user_account_follow_pk PRIMARY KEY ( user_account_id, user_account_id_follow )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_follow TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_like (
    user_account_id       BIGINT NOT NULL,
    user_account_id_like  BIGINT NOT NULL,
	date_created          DATETIME,
	CONSTRAINT user_account_like_pk PRIMARY KEY ( user_account_id, user_account_id_like )
);
GRANT SELECT, INSERT, DELETE, UPDATE ON <DB_SCHEMA/>.user_account_like TO app_portfolio_role_app_common;

CREATE TABLE <DB_SCHEMA/>.user_account_view (
    user_account_id       BIGINT,
    user_account_id_view  BIGINT NOT NULL,
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

ALTER TABLE <DB_SCHEMA/>.user_account_app
    ADD CONSTRAINT user_account_app_app_fk FOREIGN KEY ( app_id )
        REFERENCES <DB_SCHEMA/>.app ( id )
            ON DELETE CASCADE;

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