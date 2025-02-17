/**
 * All constants of SQL statements
 * @module server/db/dbSql
 */

const APP_SELECT =
    `SELECT id "id"
       FROM <DB_SCHEMA/>.app
      WHERE id						= :id OR :id IS NULL`;
const APP_INSERT =
      `INSERT INTO  <DB_SCHEMA/>.app (id)
       VALUES (:id)`;

const APP_DELETE =
      `DELETE FROM  <DB_SCHEMA/>.app (id)
       WHERE id = :id`;
  
const APP_DATA_ENTITY_RESOURCE_SELECT =
    `SELECT ader.id 										"id",
            ader.json_data 									"json_data",
            ader.app_data_entity_app_id 					"app_data_entity_app_id",
            ader.app_data_entity_id 						"app_data_entity_id",
            ader.app_setting_id                             "app_setting_id",
            null   	                                        "app_setting_name",
            null                                    	    "app_setting_value",
            null                             	            "app_setting_display_data"
       FROM <DB_SCHEMA/>.app_data_entity_resource 	ader
      WHERE (ader.id						= :resource_id OR :resource_id IS NULL)
        AND (ader.app_data_entity_app_id	= :data_app_id OR :data_app_id IS NULL)
        AND (ader.app_data_entity_id 		= :entity_id OR :entity_id IS NULL)`;
const APP_DATA_ENTITY_SELECT = 
    `SELECT id "id",
            app_id "app_id",
            json_data "json_data"
       FROM <DB_SCHEMA/>.app_data_entity
      WHERE (id		= :resource_id OR :resource_id IS NULL)
        AND (app_id = :data_app_id OR :data_app_id IS NULL)`;
const APP_DATA_RESOURCE_DETAIL_DATA_SELECT = 
    `SELECT adrdd.id                                                        "id",
            adrdd.json_data                                                 "json_data",
            adrdd.date_created                                              "date_created",
            adrdd.date_modified                                             "date_modified",
            adrdd.app_data_resource_detail_id                               "app_data_resource_detail_id",
            adrdd.app_data_resource_master_attribute_id                     "app_data_resource_master_attribute_id",
            ader_attribute_master.app_setting_id                            "as_attribute_master_app_setting_id",
            null		                                                    "as_attribute_master_app_setting_name",
            null										                    "as_attribute_master_app_setting_value",
            null										                    "as_attribute_master_app_setting_display_data",
            adrm_attribute_master.json_data									 "adrm_attribute_master_json_data",
            adrd.app_data_resource_master_id                                "app_data_detail_app_data_resource_master_id",
            adrd.app_data_entity_resource_id                                "app_data_detail_app_data_entity_resource_id",
            adrd.app_data_entity_resource_app_data_entity_app_id            "app_data_detail_app_data_entity_resource_app_data_entity_app_id",
            adrd.app_data_entity_resource_app_data_entity_id                "app_data_detail_app_data_entity_resource_app_data_entity_id",
            adrd.app_data_resource_master_attribute_id                      "app_data_detail_app_data_resource_master_attribute_id",
            adrm.app_data_entity_resource_app_data_entity_app_id            "app_data_resource_master_app_data_entity_resource_app_data_entity_app_id",
            adrm.app_data_entity_resource_app_data_entity_id                "app_data_resource_master_app_data_entity_resource_app_data_entity_id",
            adrm.app_data_entity_resource_id                                "app_data_resource_master_app_data_entity_resource_id",
            adrm.user_account_app_user_account_id                           "user_account_app_user_account_id",
            adrm.user_account_app_app_id                                    "user_account_app_app_id",
            adrm_attribute.app_data_entity_resource_app_data_entity_app_id  "app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_app_id",
            adrm_attribute.app_data_entity_resource_app_data_entity_id      "app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_id",
            adrm_attribute.app_data_entity_resource_id                      "app_data_resource_master_attribute_app_data_entity_resource_id",
            adrm_attribute.user_account_app_user_account_id                 "app_data_resource_master_attribute_user_account_app_user_account_id",
            adrm_attribute.user_account_app_app_id                          "app_data_resource_master_attribute_user_account_app_app_id",
            ader_attribute.app_setting_id                                   "app_data_resource_master_app_setting_id",
            null                                                            "app_data_resource_master_app_setting_name",
            null                                                            "app_data_resource_master_app_setting_value",
            null                                                            "app_setting_attribute_display_data",
            ader.app_setting_id                                             "app_setting_id",
            null                                                            "app_setting_name",
            null                                                            "app_setting_value",
            null                                                            "app_setting_display_data"
    FROM <DB_SCHEMA/>.app_data_resource_detail_data  adrdd
            LEFT OUTER JOIN <DB_SCHEMA/>.app_data_resource_master   adrm_attribute_master
                ON adrm_attribute_master.id	= adrdd.app_data_resource_master_attribute_id
                LEFT JOIN <DB_SCHEMA/>.app_data_entity_resource     ader_attribute_master
                ON ader_attribute_master.id = adrm_attribute_master.app_data_entity_resource_id,
            <DB_SCHEMA/>.app_data_resource_master       adrm,
            <DB_SCHEMA/>.app_data_resource_detail       adrd
            LEFT OUTER JOIN <DB_SCHEMA/>.app_data_resource_master   adrm_attribute
                ON adrm_attribute.id        = adrd.app_data_resource_master_id
                LEFT JOIN <DB_SCHEMA/>.app_data_entity_resource     ader_attribute
                ON ader_attribute.id        = adrm_attribute.app_data_entity_resource_id,
            <DB_SCHEMA/>.app_data_entity_resource ader
      WHERE adrdd.app_data_resource_detail_id                       = adrd.id
        AND ader.id                                                 = adrd.app_data_entity_resource_id
        AND ader.app_data_entity_app_id                             = adrd.app_data_entity_resource_app_data_entity_app_id
        AND adrm.id                                                 = adrd.app_data_resource_master_id
        AND (adrdd.id                                               = :resource_id OR :resource_id IS NULL)
        AND ( (
            (adrm.user_account_app_user_account_id                  = COALESCE(:user_account_id, adrm.user_account_app_user_account_id)
            AND
            adrm.user_account_app_app_id                           = COALESCE(:user_account_app_id, adrm.user_account_app_app_id) AND :user_null=0) OR :data_app_id IS NULL
            )
            OR
            (adrm.user_account_app_user_account_id                  IS NULL AND :user_null=1)
        )
        AND (adrm.app_data_entity_resource_app_data_entity_app_id       = :data_app_id OR :data_app_id IS NULL)
        AND (adrm.app_data_entity_resource_app_data_entity_id           = :entity_id OR :entity_id IS NULL)
        AND (adrdd.app_data_resource_detail_id                          = :resource_app_data_detail_id OR :resource_app_data_detail_id IS NULL)`;
const APP_DATA_RESOURCE_DETAIL_DATA_INSERT = 
    `INSERT INTO <DB_SCHEMA/>.app_data_resource_detail_data (   json_data, 
                                                                date_created, 
                                                                date_modified, 
                                                                app_data_resource_detail_id,
                                                                app_data_resource_master_attribute_id)
     SELECT :json_data, 
            CURRENT_TIMESTAMP,
            NULL,
            :app_data_resource_detail_id, 
            :app_data_resource_master_attribute_id
       FROM <DB_SCHEMA/>.app_data_resource_detail adrd,
            <DB_SCHEMA/>.app_data_resource_master adrm
      WHERE adrd.id = :app_data_resource_detail_id
        AND adrm.id = adrd.app_data_resource_master_id
        AND (adrm.app_data_entity_resource_app_data_entity_app_id    = :data_app_id OR :data_app_id IS NULL)
        AND ((adrm.user_account_app_user_account_id                  = :user_account_id AND
              adrm.user_account_app_app_id                           = :user_account_app_id) OR :user_account_id IS NULL)`;

const APP_DATA_RESOURCE_DETAIL_DATA_UPDATE = 
    `UPDATE <DB_SCHEMA/>.app_data_resource_detail_data 
        SET json_data                                       = :json_data, 
            app_data_resource_detail_id                     = :app_data_resource_detail_id,
            app_data_resource_master_attribute_id           = :app_data_resource_master_attribute_id,
            date_modified                                   = CURRENT_TIMESTAMP
      WHERE id = :resource_id
        AND EXISTS(SELECT NULL
                        FROM <DB_SCHEMA/>.app_data_resource_detail adrd,
                            <DB_SCHEMA/>.app_data_resource_master adrm
                    WHERE adrd.id = :app_data_resource_detail_id
                        AND adrm.id = adrd.app_data_resource_master_id
                        AND (adrm.app_data_entity_resource_app_data_entity_app_id     = :data_app_id OR :data_app_id IS NULL)
                        AND ((adrm.user_account_app_user_account_id                   = :user_account_id AND
                            adrm.user_account_app_app_id                            = :user_account_app_id) OR :user_account_id IS NULL)))`;
const APP_DATA_RESOURCE_DETAIL_DATA_DELETE = 
    `DELETE FROM <DB_SCHEMA/>.app_data_resource_detail_data 
     WHERE id = :resource_id
       AND EXISTS(SELECT NULL
                    FROM <DB_SCHEMA/>.app_data_resource_detail adrd,
                         <DB_SCHEMA/>.app_data_resource_master adrm
                   WHERE adrd.id = :app_data_resource_detail_id
                     AND adrm.id = adrd.app_data_resource_master_id
                     AND (adrm.app_data_entity_resource_app_data_entity_app_id     = :data_app_id OR :data_app_id IS NULL)
                     AND ((adrm.user_account_app_user_account_id                   = :user_account_id AND
                         adrm.user_account_app_app_id                            = :user_account_app_id) OR :user_account_id IS NULL)))`;
const APP_DATA_RESOURCE_DETAIL_SELECT =
    `SELECT adrd.id                                                         "id",
            adrd.json_data                                                  "json_data",
            adrd.app_data_resource_master_id                                "app_data_resource_master_id",
            adrd.app_data_entity_resource_id                                "app_data_entity_resource_id",
            adrd.app_data_entity_resource_app_data_entity_app_id            "app_data_entity_resource_app_data_entity_app_id",
            adrd.app_data_entity_resource_app_data_entity_id                "app_data_entity_resource_app_data_entity_id",
            adrd.app_data_resource_master_attribute_id                      "app_data_resource_master_attribute_id",
            adrm.app_data_entity_resource_app_data_entity_app_id            "app_data_resource_master_app_data_entity_resource_app_data_entity_app_id",
            adrm.app_data_entity_resource_app_data_entity_id                "app_data_resource_master_app_data_entity_resource_app_data_entity_id",
            adrm.app_data_entity_resource_id                                "app_data_resource_master_app_data_entity_resource_id",
            adrm.user_account_app_user_account_id                           "user_account_app_user_account_id",
            adrm.user_account_app_app_id                                    "user_account_app_app_id",
            adrm_attribute.app_data_entity_resource_app_data_entity_app_id  "app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_app_id",
            adrm_attribute.app_data_entity_resource_app_data_entity_id      "app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_id",
            adrm_attribute.app_data_entity_resource_id                      "app_data_resource_master_attribute_app_data_entity_resource_id",
            adrm_attribute.user_account_app_user_account_id                 "app_data_resource_master_attribute_user_account_app_user_account_id",
            adrm_attribute.user_account_app_app_id                          "app_data_resource_master_attribute_user_account_app_app_id",
            ader_attribute.app_setting_id                                   "app_data_resource_master_app_setting_id",
            null                                                            "app_data_resource_master_app_setting_name",
            null                                                            "app_data_resource_master_app_setting_value",
            null                                                            "app_setting_attribute_display_data",
            ader.app_setting_id                                             "app_setting_id",
            null                                                            "app_setting_name",
            null                                                            "app_setting_value",
            null                                                            "app_setting_display_data"
       FROM <DB_SCHEMA/>.app_data_resource_master adrm,
            <DB_SCHEMA/>.app_data_resource_detail adrd
                LEFT OUTER JOIN <DB_SCHEMA/>.app_data_resource_master   adrm_attribute
                    ON adrm_attribute.id           = adrd.app_data_resource_master_id
                    LEFT JOIN <DB_SCHEMA/>.app_data_entity_resource     ader_attribute
                    ON ader_attribute.id = adrm_attribute.app_data_entity_resource_id,
            <DB_SCHEMA/>.app_data_entity_resource ader
      WHERE ader.id                                                 = adrd.app_data_entity_resource_id
        AND ader.app_data_entity_app_id                             = adrd.app_data_entity_resource_app_data_entity_app_id
        AND adrm.id                                                 = adrd.app_data_resource_master_id
        AND (adrm.id                                                = :resource_id OR :resource_id IS NULL)
        AND (adrm.id                                                = :master_id OR :master_id IS NULL)
        AND ( (
                (adrm.user_account_app_user_account_id                  = COALESCE(:user_account_id, adrm.user_account_app_user_account_id)
                AND
                adrm.user_account_app_app_id                           = COALESCE(:user_account_app_id, adrm.user_account_app_app_id) AND :user_null=0) OR :data_app_id IS NULL
                )
                OR
                (adrm.user_account_app_user_account_id                IS NULL AND :user_null=1)
            )
        AND (adrm.app_data_entity_resource_app_data_entity_app_id   = :data_app_id OR :data_app_id IS NULL)
        AND (adrm.app_data_entity_resource_app_data_entity_id       = :entity_id OR :entity_id IS NULL)`;

const APP_DATA_RESOURCE_DETAIL_INSERT = 
    `INSERT INTO <DB_SCHEMA/>.app_data_resource_detail (json_data, 
                                                        app_data_resource_master_id,
                                                        app_data_entity_resource_id, 
                                                        app_data_entity_resource_app_data_entity_app_id, 
                                                        app_data_entity_resource_app_data_entity_id,
                                                        app_data_resource_master_attribute_id)
        SELECT :json_data, 
                :app_data_resource_master_id, 
                :app_data_entity_resource_id, 
                adrm.app_data_entity_resource_app_data_entity_app_id,
                :app_data_entity_resource_app_data_entity_id,
                :app_data_resource_master_attribute_id
            FROM <DB_SCHEMA/>.app_data_resource_master adrm
            WHERE adrm.id                                                = :app_data_resource_master_id
            AND (adrm.app_data_entity_resource_app_data_entity_app_id  = :data_app_id OR :data_app_id IS NULL)
            AND ((adrm.user_account_app_user_account_id                = :user_account_id AND
                    adrm.user_account_app_app_id                         = :user_account_app_id) OR :user_account_id IS NULL)`;
const APP_DATA_RESOURCE_DETAIL_UPDATE =
    `UPDATE <DB_SCHEMA/>.app_data_resource_detail adrd
        SET adrd.json_data                                       = :json_data, 
            adrd.app_data_resource_master_id                     = :app_data_resource_master_id, 
            adrd.app_data_entity_resource_id                     = :app_data_entity_resource_id, 
            adrd.app_data_entity_resource_app_data_entity_app_id = adrd.app_data_entity_resource_app_data_entity_app_id,
            adrd.app_data_entity_resource_app_data_entity_id     = :app_data_entity_resource_app_data_entity_id,
            adrd.app_data_resource_master_attribute_id           = :app_data_resource_master_attribute_id
        WHERE adrd.id = :resource_id
        AND (adrd.app_data_entity_resource_app_data_entity_app_id = :data_app_id OR :data_app_id IS NULL)
        AND EXISTS (SELECT NULL
                        FROM <DB_SCHEMA/>.app_data_resource_master adrm
                        WHERE adrm.id                                              = adrd.app_data_resource_master_id
                        AND adrm.app_data_entity_resource_app_data_entity_app_id = adrd.app_data_entity_resource_app_data_entity_app_id
                        AND ((adrm.user_account_app_user_account_id              = :user_account_id AND
                                adrm.user_account_app_app_id                       = :user_account_app_id) OR :user_account_id IS NULL))`;
const APP_DATA_RESOURCE_DETAIL_DELETE =
    `DELETE FROM <DB_SCHEMA/>.app_data_resource_detail adrd
        WHERE adrd.id = :resource_id
        AND (adrd.app_data_entity_resource_app_data_entity_app_id = :data_app_id OR :data_app_id IS NULL)
        AND EXISTS (SELECT NULL
                        FROM <DB_SCHEMA/>.app_data_resource_master adrm
                        WHERE adrm.id                                              = adrd.app_data_resource_master_id
                        AND adrm.app_data_entity_resource_app_data_entity_app_id = adrd.app_data_entity_resource_app_data_entity_app_id
                        AND ((adrm.user_account_app_user_account_id              = :user_account_id AND
                                adrm.user_account_app_app_id                       = :user_account_app_id) OR :user_account_id IS NULL))`;
const APP_DATA_RESOURCE_MASTER_SELECT =
    `SELECT adrm.id                                                 "id",
            adrm.json_data                                          "json_data",
            adrm.user_account_app_user_account_id                   "user_account_app_user_account_id",
            adrm.user_account_app_app_id                            "user_account_app_app_id",
            adrm.app_data_entity_resource_app_data_entity_app_id    "app_data_entity_resource_app_data_entity_app_id",
            adrm.app_data_entity_resource_app_data_entity_id        "app_data_entity_resource_app_data_entity_id",
            adrm.app_data_entity_resource_id                        "app_data_entity_resource_id",

            ader.json_data                                          "app_data_entity_resource_json_data",
            ader.app_setting_id                                     "app_setting_id",
            null                                                    "app_setting_name",
            null                                                    "app_setting_value",
            null                                                    "app_setting_display_data"
       FROM <DB_SCHEMA/>.app_data_resource_master adrm,
            <DB_SCHEMA/>.app_data_entity_resource ader
      WHERE ader.id                                                   = adrm.app_data_entity_resource_id
            AND ader.app_data_entity_app_id                               = adrm.app_data_entity_resource_app_data_entity_app_id
            AND (adrm.id                                                  = :resource_id OR :resource_id IS NULL)
            AND ( (
                    (adrm.user_account_app_user_account_id                  = COALESCE(:user_account_id, adrm.user_account_app_user_account_id)
                    AND
                    adrm.user_account_app_app_id                           = COALESCE(:user_account_app_id, adrm.user_account_app_app_id) AND :user_null=0) OR :data_app_id IS NULL
                    )
                    OR
                    (adrm.user_account_app_user_account_id                   IS NULL AND :user_null=1)
                    )
            AND (adrm.app_data_entity_resource_app_data_entity_app_id     = :data_app_id OR :data_app_id IS NULL)
            AND (adrm.app_data_entity_resource_app_data_entity_id         = :entity_id OR :entity_id IS NULL)`;
const APP_DATA_RESOURCE_MASTER_INSERT =
    `INSERT INTO <DB_SCHEMA/>.app_data_resource_master (json_data, 
                                                        user_account_app_user_account_id, 
                                                        user_account_app_app_id, 
                                                        app_data_entity_resource_app_data_entity_app_id,
                                                        app_data_entity_resource_app_data_entity_id, 
                                                        app_data_entity_resource_id)
        VALUES( :json_data, 
                :user_account_id, 
                :user_account_app_id, 
                :data_app_id,
                :app_data_entity_resource_app_data_entity_id, 
                :app_data_entity_resource_id)`;
const APP_DATA_RESOURCE_MASTER_UPDATE =
    `UPDATE <DB_SCHEMA/>.app_data_resource_master 
        SET json_data                                       = :json_data, 
            user_account_app_user_account_id                = :user_account_id, 
            user_account_app_app_id                         = :user_account_app_id, 
            app_data_entity_resource_app_data_entity_app_id = app_data_entity_resource_app_data_entity_app_id,
            app_data_entity_resource_app_data_entity_id     = :app_data_entity_resource_app_data_entity_id, 
            app_data_entity_resource_id                     = :app_data_entity_resource_id
      WHERE id = :resource_id
        AND ((user_account_app_user_account_id              = :user_account_id AND
              user_account_app_app_id                       = :user_account_app_id) OR :user_account_id IS NULL)
        AND (app_data_entity_resource_app_data_entity_app_id   = :data_app_id OR :data_app_id IS NULL)`;
const APP_DATA_RESOURCE_MASTER_DELETE =
    `DELETE FROM <DB_SCHEMA/>.app_data_resource_master 
     WHERE id = :resource_id
       AND ((user_account_app_user_account_id                 = :user_account_id AND
             user_account_app_app_id                          = :user_account_app_id) OR :user_account_id IS NULL)
       AND (app_data_entity_resource_app_data_entity_app_id   = :data_app_id OR :data_app_id IS NULL)`;

const USER_ACCOUNT_APP_DATA_POST_LIKE_INSERT =
      `INSERT INTO <DB_SCHEMA/>.user_account_app_data_post_like(
					user_account_app_user_account_id, user_account_app_data_post_id, user_account_app_app_id, date_created)
	    VALUES(:user_account_id,:user_account_app_data_post_id, :app_id, CURRENT_TIMESTAMP) `;
const USER_ACCOUNT_APP_DATA_POST_LIKE_DELETE =
    `DELETE FROM <DB_SCHEMA/>.user_account_app_data_post_like
     WHERE user_account_app_user_account_id = :user_account_id
       AND user_account_app_data_post_id = :user_account_app_data_post_id 
       AND user_account_app_app_id = :app_id`;
const USER_ACCOUNT_APP_DATA_POST_VIEW_INSERT =
    `INSERT INTO <DB_SCHEMA/>.user_account_app_data_post_view(
            client_ip,
            client_user_agent,
            date_created,
            user_account_app_user_account_id,
            user_account_app_data_post_id,
            user_account_app_app_id)
    VALUES( :client_ip,
            :client_user_agent,
            CURRENT_TIMESTAMP,
            :user_account_id,
            :user_account_app_data_post_id,
            :app_id) `;
const USER_ACCOUNT_APP_DATA_POST_INSERT = 
    `INSERT INTO <DB_SCHEMA/>.user_account_app_data_post(
            description, 
            json_data,
            date_created,
            date_modified,
            user_account_app_user_account_id,
            user_account_app_app_id
            )
     VALUES(:description,:json_data,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,:user_account_id,:app_id)`;
const USER_ACCOUNT_APP_DATA_POST_SELECT_ID = 
    `SELECT	id "id",
            description "description",
            json_data "json_data",
            date_created "date_created",
            date_modified "date_modified",
            user_account_app_user_account_id "user_account_app_user_account_id",
            user_account_app_app_id "user_account_app_app_id"
       FROM <DB_SCHEMA/>.user_account_app_data_post 
      WHERE id = :id `;
const USER_ACCOUNT_APP_DATA_POST_SELECT_USER = 
    `SELECT	id "id",
            description "description",
            json_data "json_data",
            date_created "date_created",
            date_modified "date_modified",
            user_account_app_user_account_id "user_account_app_user_account_id",
            user_account_app_app_id "app_id"
       FROM <DB_SCHEMA/>.user_account_app_data_post
      WHERE user_account_app_user_account_id = :user_account_id 
        AND user_account_app_app_id = :app_id`;
const USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE = 
    `SELECT us.id "id",
            us.description "description",
            us.user_account_app_user_account_id "user_account_app_user_account_id",
            us.json_data "json_data",
            (SELECT COUNT(0)
                FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like
                WHERE u_like.user_account_app_data_post_id = us.id
                AND  u_like.user_account_app_app_id = us.user_account_app_app_id)					"count_likes",
            (SELECT COUNT(0)
                FROM <DB_SCHEMA/>.user_account_app_data_post_view u_view
                WHERE u_view.user_account_app_data_post_id = us.id
                AND  u_view.user_account_app_app_id = us.user_account_app_app_id)					"count_views",
            (SELECT COUNT(0)
                FROM <DB_SCHEMA/>.user_account_app_data_post_like u_liked_current_user
                WHERE u_liked_current_user.user_account_app_user_account_id = :user_account_id_current
                AND u_liked_current_user.user_account_app_data_post_id = us.id
                AND u_liked_current_user.user_account_app_app_id = us.user_account_app_app_id) 		"liked"
        FROM <DB_SCHEMA/>.user_account_app_data_post us
        WHERE us.user_account_app_user_account_id = :user_account_id
        AND us.user_account_app_app_id = :app_id `;
const USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_DETAIL =
    `SELECT detail "detail", 
            id "id", 
            iam_user_id "iam_user_id", 
            null "avatar",
            null "username",
            count(*) over() "total_rows"
        FROM (SELECT 'LIKE_POST' detail,
                    u.id,
                    u.iam_user_id,
                    null avatar,
                    null username
                FROM <DB_SCHEMA/>.user_account u
            WHERE u.id IN (SELECT us.user_account_app_user_account_id
                                FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
                                    <DB_SCHEMA/>.user_account_app_data_post us
                            WHERE u_like.user_account_app_user_account_id = :user_account_id
                                AND u_like.user_account_app_app_id = :app_id
                                AND us.user_account_app_app_id = u_like.user_account_app_app_id
                                AND us.id = u_like.user_account_app_data_post_id)
                AND    6 = :detailchoice
                UNION ALL
                SELECT 'LIKED_POST' detail,
                        u.id,
                        u.iam_user_id,
                        null avatar,
                        null username
                FROM  <DB_SCHEMA/>.user_account u
                WHERE  u.id IN (SELECT u_like.user_account_app_user_account_id
                                FROM <DB_SCHEMA/>.user_account_app_data_post us,
                                        <DB_SCHEMA/>.user_account_app_data_post_like u_like
                                WHERE us.user_account_app_user_account_id = :user_account_id
                                    AND us.user_account_app_app_id = :app_id
                                    AND us.id = u_like.user_account_app_data_post_id
                                    AND u_like.user_account_app_app_id = us.user_account_app_app_id)
                AND  7 = :detailchoice) t
            ORDER BY 1`;
const USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_STAT_LIKE =
    ` SELECT (SELECT COUNT(DISTINCT us.user_account_app_user_account_id)
                FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
                     <DB_SCHEMA/>.user_account_app_data_post us
               WHERE u_like.user_account_app_user_account_id = u.id
                 AND u_like.user_account_app_app_id = :app_id
                 AND us.id = u_like.user_account_app_data_post_id
                 AND us.user_account_app_app_id = u_like.user_account_app_app_id)		"count_user_post_likes",
             (SELECT COUNT(DISTINCT u_like.user_account_app_user_account_id)
                FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
                    <DB_SCHEMA/>.user_account_app_data_post us
               WHERE us.user_account_app_user_account_id = u.id
                 AND us.user_account_app_app_id = :app_id
                 AND u_like.user_account_app_data_post_id = us.id
                 AND u_like.user_account_app_app_id = us.user_account_app_app_id)		"count_user_post_liked"
        FROM <DB_SCHEMA/>.user_account u
        WHERE u.id = :id`;
const USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_STAT_POST = 
    `SELECT top "top", 
            id "id", 
            iam_user_id "iam_user_id", 
            null "avatar",
            null "username",
            count "count",
            count(*) over() "total_rows"
        FROM (	SELECT 'LIKE_POST' top,
                        u.id,
                        u.iam_user_id,
                        null avatar,
                        null username,
                        (SELECT COUNT(us.user_account_app_user_account_id)
                        FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
                                <DB_SCHEMA/>.user_account_app_data_post us
                        WHERE us.user_account_app_user_account_id = u.id
                            AND us.user_account_app_app_id = :app_id
                            AND u_like.user_account_app_data_post_id = us.id
                            AND u_like.user_account_app_app_id = us.user_account_app_app_id) count
                FROM  <DB_SCHEMA/>.user_account u
                WHERE  4 = :statchoice
                UNION ALL
                SELECT 'VISITED_POST' top,
                        u.id,
                        u.iam_user_id,
                        null avatar,
                        null username,
                        (SELECT COUNT(us.user_account_app_user_account_id)
                        FROM <DB_SCHEMA/>.user_account_app_data_post_view u_view,
                                <DB_SCHEMA/>.user_account_app_data_post us
                        WHERE us.user_account_app_user_account_id = u.id
                            AND us.user_account_app_app_id = :app_id
                            AND u_view.user_account_app_data_post_id = us.id
                            AND u_view.user_account_app_app_id = us.user_account_app_app_id) count
                FROM  <DB_SCHEMA/>.user_account u
                WHERE  5 = :statchoice) t
        ORDER BY 1,6 DESC`;
const USER_ACCOUNT_APP_DATA_POST_UPDATE = 
    `UPDATE <DB_SCHEMA/>.user_account_app_data_post
        SET description = :description,
            json_data = :json_data,
            date_modified = CURRENT_TIMESTAMP
      WHERE id = :id 
        AND user_account_app_user_account_id = :user_account_id
        AND user_account_app_app_id = :app_id`;
const USER_ACCOUNT_APP_DATA_POST_DELETE =
    `DELETE FROM <DB_SCHEMA/>.user_account_app_data_post
     WHERE id = :id 
       AND user_account_app_user_account_id = :user_account_id
       AND user_account_app_app_id = :app_id`;
const USER_ACCOUNT_APP_INSERT =
    `INSERT INTO <DB_SCHEMA/>.user_account_app(
            app_id, user_account_id, date_created)
     VALUES (:app_id, :user_account_id, CURRENT_TIMESTAMP)`;
const USER_ACCOUNT_APP_SELECT_USER_APPS = 
    `SELECT uap.app_id "app_id",
            uap.date_created "date_created"
       FROM <DB_SCHEMA/>.user_account_app uap,
            <DB_SCHEMA/>.app a
      WHERE a.id = uap.app_id
        AND uap.user_account_id = :user_account_id`;
const USER_ACCOUNT_APP_SELECT_USER_APP = 
    `SELECT uaa.json_data "json_data",
            uaa.date_created "date_created"
       FROM <DB_SCHEMA/>.user_account_app uaa
      WHERE uaa.user_account_id = :user_account_id
        AND uaa.app_id = :app_id`;
const USER_ACCOUNT_APP_UPDATE =
    `UPDATE <DB_SCHEMA/>.user_account_app
        SET json_data = :json_data,
            date_created = CURRENT_TIMESTAMP
      WHERE user_account_id = :user_account_id
        AND app_id = :app_id`;
const USER_ACCOUNT_APP_DELETE = 
    `DELETE FROM <DB_SCHEMA/>.user_account_app
     WHERE user_account_id = :user_account_id
       AND app_id = :app_id`;
const USER_ACCOUNT_FOLLOW_INSERT =
    `INSERT INTO <DB_SCHEMA/>.user_account_follow(
                user_account_id, user_account_id_follow, date_created)
     VALUES(:user_account_id,:user_account_id_follow, CURRENT_TIMESTAMP)`;
const USER_ACCOUNT_FOLLOW_DELETE =
    `DELETE FROM <DB_SCHEMA/>.user_account_follow
     WHERE user_account_id = :user_account_id
       AND user_account_id_follow = :user_account_id_follow`;
const USER_ACCOUNT_LIKE_INSERT = 
    `INSERT INTO <DB_SCHEMA/>.user_account_like(
            user_account_id, user_account_id_like, date_created)
     VALUES(:user_account_id,:user_account_id_like, CURRENT_TIMESTAMP) `;
const USER_ACCOUNT_LIKE_DELETE =
    `DELETE FROM <DB_SCHEMA/>.user_account_like
     WHERE user_account_id = :user_account_id
       AND user_account_id_like = :user_account_id_like `;
const USER_ACCOUNT_VIEW_INSERT =
    `INSERT INTO <DB_SCHEMA/>.user_account_view(
            user_account_id, user_account_id_view, client_ip, client_user_agent, date_created)
     VALUES(:user_account_id,:user_account_id_view,:client_ip,:client_user_agent, CURRENT_TIMESTAMP) `;
const USER_ACCOUNT_SELECT_STAT_COUNT = 
    `SELECT COUNT(*) "count_users"
       FROM <DB_SCHEMA/>.user_account`;
const USER_ACCOUNT_INSERT = 
    `INSERT INTO <DB_SCHEMA/>.user_account(
        date_created,
        date_modified,
        iam_user_id)
    VALUES( CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            :iam_user_id) `;
const USER_ACCOUNT_SELECT =
    `SELECT	u.id "id",
            u.iam_user_id "iam_user_id",
            u.date_modified "date_modified",
            u.date_created "date_created"
      FROM  <DB_SCHEMA/>.user_account u
     WHERE  u.id = :id `;
const USER_ACCOUNT_SELECT_IAM_USER =
     `SELECT u.id "id",
             u.iam_user_id "iam_user_id",
             u.date_modified "date_modified",
             u.date_created "date_created"
       FROM  <DB_SCHEMA/>.user_account u
      WHERE  u.iam_user_id = :iam_user_id `;
const USER_ACCOUNT_SELECT_PROFILE =
    `SELECT	u.id "id",
            null "bio",
            null "private",
            (SELECT 1 
                FROM <DB_SCHEMA/>.user_account ua_current
                WHERE ua_current.id = :user_accound_id_current_user
                    AND EXISTS 
                (SELECT NULL
                    FROM <DB_SCHEMA/>.user_account_follow  uaf 
                    WHERE (uaf.user_account_id = u.id
                            AND uaf.user_account_id_follow = ua_current.id)
                    or  (
                            uaf.user_account_id_follow = u.id
                            AND uaf.user_account_id = ua_current.id)
                )
    
            ) "friends",
            null "user_level",
            u.date_created "date_created",
            null "username",
            null "avatar",
            u.iam_user_id "iam_user_id",
            (SELECT COUNT(u_following.user_account_id)   
                FROM <DB_SCHEMA/>.user_account_follow  u_following
                WHERE u_following.user_account_id = u.id) 					"count_following",
            (SELECT COUNT(u_followed.user_account_id_follow) 
                FROM <DB_SCHEMA/>.user_account_follow  u_followed
                WHERE u_followed.user_account_id_follow = u.id) 				"count_followed",
            (SELECT COUNT(u_likes.user_account_id)
                FROM <DB_SCHEMA/>.user_account_like    u_likes
                WHERE u_likes.user_account_id = u.id ) 						"count_likes",
            (SELECT COUNT(u_likes.user_account_id_like)
                FROM <DB_SCHEMA/>.user_account_like    u_likes
                WHERE u_likes.user_account_id_like = u.id )					"count_liked",
            (SELECT COUNT(u_views.user_account_id_view)
                FROM <DB_SCHEMA/>.user_account_view    u_views
                WHERE u_views.user_account_id_view = u.id ) 					"count_views",
            (SELECT COUNT(u_followed_current_user.user_account_id)
                FROM <DB_SCHEMA/>.user_account_follow  u_followed_current_user 
                WHERE u_followed_current_user.user_account_id_follow = u.id
                AND u_followed_current_user.user_account_id = :user_accound_id_current_user) 	"followed",
            (SELECT COUNT(u_liked_current_user.user_account_id)  
                FROM <DB_SCHEMA/>.user_account_like    u_liked_current_user
                WHERE u_liked_current_user.user_account_id_like = u.id
                AND u_liked_current_user.user_account_id = :user_accound_id_current_user)      "liked"
        FROM <DB_SCHEMA/>.user_account u
       WHERE u.id = :id OR :id IS NULL`;
const USER_ACCOUNT_SELECT_PROFILE_DETAIL =
    `SELECT detail "detail",
            id "id",
            iam_user_id "iam_user_id",
            null "avatar",
            null "username",
            count(*) over() "total_rows"
    FROM (SELECT 	'FOLLOWING' detail,
                    u.id,
                    u.iam_user_id,
                    null avatar,
                    null username
            FROM <DB_SCHEMA/>.user_account_follow u_follow,
                <DB_SCHEMA/>.user_account u
            WHERE u_follow.user_account_id = :user_account_id
            AND u.id = u_follow.user_account_id_follow
            AND 1 = :detailchoice
            UNION ALL
        SELECT 	'FOLLOWED' detail,
                    u.id,
                    u.iam_user_id,
                    null avatar,
                    null username
            FROM <DB_SCHEMA/>.user_account_follow u_followed,
                <DB_SCHEMA/>.user_account u
            WHERE u_followed.user_account_id_follow = :user_account_id
            AND u.id = u_followed.user_account_id
            AND 2 = :detailchoice
            UNION ALL
        SELECT	'LIKE_USER' detail,
                    u.id,
                    u.iam_user_id,
                    null avatar,
                    null username
            FROM <DB_SCHEMA/>.user_account_like u_like,
                <DB_SCHEMA/>.user_account u
            WHERE u_like.user_account_id = :user_account_id
            AND u.id = u_like.user_account_id_like
            AND 3 = :detailchoice
            UNION ALL
        SELECT	'LIKED_USER' detail,
                    u.id,
                    u.iam_user_id,
                    null avatar,
                    null username
            FROM <DB_SCHEMA/>.user_account_like u_liked,
                <DB_SCHEMA/>.user_account u
            WHERE u_liked.user_account_id_like = :user_account_id
            AND u.id = u_liked.user_account_id
            AND 4 = :detailchoice) t
        ORDER BY 1`;
const USER_ACCOUNT_SELECT_PROFILE_STAT = 
    `SELECT	top "top", 
            id "id", 
            iam_user_id "iam_user_id", 
            null "avatar",
            null "username",
            count "count",
            count(*) over() "total_rows"
       FROM (SELECT 'VISITED' top,
                    u.id,
                    u.iam_user_id,
                    null avatar,
                    null username,
                    (SELECT COUNT(u_visited.user_account_id_view)
                    FROM <DB_SCHEMA/>.user_account_view u_visited
                    WHERE u_visited.user_account_id_view = u.id) count
               FROM <DB_SCHEMA/>.user_account u
              WHERE 1 = :statchoice
            UNION ALL
            SELECT 	'FOLLOWING' top,
                        u.id,
                        u.iam_user_id,
                        null avatar,
                        null username,
                        (SELECT COUNT(u_follow.user_account_id_follow)
                        FROM <DB_SCHEMA/>.user_account_follow u_follow
                        WHERE u_follow.user_account_id_follow = u.id) count
                FROM <DB_SCHEMA/>.user_account u
                WHERE 2 = :statchoice
            UNION ALL
            SELECT 	'LIKE_USER' top,
                        u.id,
                        u.iam_user_id,
                        null avatar,
                        null username,
                        (SELECT COUNT(u_like.user_account_id_like)
                        FROM <DB_SCHEMA/>.user_account_like u_like
                        WHERE u_like.user_account_id_like = u.id) count
                FROM <DB_SCHEMA/>.user_account u
                WHERE 3 = :statchoice) t
       WHERE EXISTS(SELECT NULL
                      FROM <DB_SCHEMA/>.user_account_app uap
                     WHERE uap.user_account_id = t.id
                       AND uap.app_id = :app_id)
      ORDER BY 1,6 DESC`;
const USER_ACCOUNT_UPDATE =
    `UPDATE <DB_SCHEMA/>.user_account
        SET iam_user_id = :iam_user_id,
            date_modified = CURRENT_TIMESTAMP
      WHERE id = :id `;
const USER_ACCOUNT_DELETE =
    `DELETE FROM <DB_SCHEMA/>.user_account
	 WHERE id = :id `;
export {
        /**APP */
        APP_SELECT, APP_INSERT, APP_DELETE, 
        /**APP_DATA_ENTITIY_RESOURCE */
        APP_DATA_ENTITY_RESOURCE_SELECT, 
        /**APP_DATA_ENTITIY */
        APP_DATA_ENTITY_SELECT,
        /**APP_DATA_RESOURCE_DETAIL_DATA */
        APP_DATA_RESOURCE_DETAIL_DATA_SELECT,APP_DATA_RESOURCE_DETAIL_DATA_INSERT, APP_DATA_RESOURCE_DETAIL_DATA_UPDATE, APP_DATA_RESOURCE_DETAIL_DATA_DELETE,
        /**APP_DATA_RESOURCE_DETAIL */
        APP_DATA_RESOURCE_DETAIL_SELECT, APP_DATA_RESOURCE_DETAIL_INSERT,APP_DATA_RESOURCE_DETAIL_UPDATE,APP_DATA_RESOURCE_DETAIL_DELETE,
        /**APP_DATA_RESOURCE_MASTER */
        APP_DATA_RESOURCE_MASTER_SELECT,APP_DATA_RESOURCE_MASTER_INSERT, APP_DATA_RESOURCE_MASTER_UPDATE, APP_DATA_RESOURCE_MASTER_DELETE,
        /**USER_ACCOUNT_APP_DATA_POST_LIKE */
        USER_ACCOUNT_APP_DATA_POST_LIKE_INSERT,USER_ACCOUNT_APP_DATA_POST_LIKE_DELETE,
        /**USER_ACCOUNT_APP_DATA_POST_VIEW */
        USER_ACCOUNT_APP_DATA_POST_VIEW_INSERT,
        /**USER_ACCOUNT_APP_DATA_POST */
        USER_ACCOUNT_APP_DATA_POST_INSERT, USER_ACCOUNT_APP_DATA_POST_SELECT_ID,USER_ACCOUNT_APP_DATA_POST_SELECT_USER,
        USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE,USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_DETAIL,
        USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_STAT_LIKE,USER_ACCOUNT_APP_DATA_POST_SELECT_USER_PROFILE_STAT_POST,
        USER_ACCOUNT_APP_DATA_POST_UPDATE,
        USER_ACCOUNT_APP_DATA_POST_DELETE,
        /**USER_ACCOUNT_APP */
        USER_ACCOUNT_APP_INSERT,
        USER_ACCOUNT_APP_SELECT_USER_APPS,
        USER_ACCOUNT_APP_SELECT_USER_APP,
        USER_ACCOUNT_APP_UPDATE,USER_ACCOUNT_APP_DELETE,
        /**USER_ACCOUNT_FOLLOW */
        USER_ACCOUNT_FOLLOW_INSERT,USER_ACCOUNT_FOLLOW_DELETE,
        /**USER_ACCOUNT_LIKE */
        USER_ACCOUNT_LIKE_INSERT,USER_ACCOUNT_LIKE_DELETE,
        /**USER_ACCOUNT_VIEW */
        USER_ACCOUNT_VIEW_INSERT,
        /**USER_ACCOUNT */
        USER_ACCOUNT_SELECT,
        USER_ACCOUNT_SELECT_IAM_USER,
        USER_ACCOUNT_SELECT_STAT_COUNT,
        USER_ACCOUNT_UPDATE,
        USER_ACCOUNT_INSERT,
        USER_ACCOUNT_SELECT_PROFILE,
        USER_ACCOUNT_SELECT_PROFILE_DETAIL,
        USER_ACCOUNT_SELECT_PROFILE_STAT,
        USER_ACCOUNT_DELETE
        };