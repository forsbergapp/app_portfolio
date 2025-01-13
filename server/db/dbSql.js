/**
 * All constants of SQL statements
 * @module server/db/dbSql
 */

const APP_DATA_ENTITY_RESOURCE_SELECT =
    `SELECT ader.id 										"id",
            ader.json_data 									"json_data",
            ader.app_setting_id 							"app_setting_id",
            ader.app_data_entity_app_id 					"app_data_entity_app_id",
            ader.app_data_entity_id 						"app_data_entity_id",
            app_s.app_setting_type_app_setting_type_name   	"app_setting_type_app_setting_type_name",
            app_s.value                                    	"app_setting_value",
            app_s.display_data                             	"app_setting_display_data"
       FROM <DB_SCHEMA/>.app_data_entity_resource 	ader,
            <DB_SCHEMA/>.app_setting            	app_s
      WHERE app_s.id                       	= ader.app_setting_id
        AND app_s.app_setting_type_app_id  	= ader.app_data_entity_app_id
        AND (ader.id						= :resource_id OR :resource_id IS NULL)
        AND (ader.app_data_entity_app_id	= :data_app_id OR :data_app_id IS NULL)
        AND (ader.app_data_entity_id 		= :entity_id OR :entity_id IS NULL)
        AND (app_s.value 					= :resource_name OR :resource_name IS NULL)`;
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
            as_attribute_master.app_setting_type_app_setting_type_name		  "as_attribute_master_app_setting_type_app_setting_type_name",
            as_attribute_master.value										                    "as_attribute_master_value",
            adrm_attribute_master.json_data									                "adrm_attribute_master_json_data",
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
            app_s.id                                                        "app_data_resource_master_app_setting_id",
            as_attribute.app_setting_type_app_setting_type_name             "app_data_resource_master_app_setting_type_app_setting_type_name",
            as_attribute.value                                              "app_data_resource_master_app_setting_value",
            as_attribute.display_data                                       "app_setting_attribute_display_data",
            app_s.id                                                        "app_setting_id",
            app_s.app_setting_type_app_setting_type_name                    "app_setting_type_app_setting_type_name",
            app_s.value                                                     "app_setting_value",
            app_s.display_data                                              "app_setting_display_data"
    FROM <DB_SCHEMA/>.app_data_resource_detail_data  adrdd
            LEFT OUTER JOIN MAIN.app_data_resource_master   adrm_attribute_master
                ON adrm_attribute_master.id	= adrdd.app_data_resource_master_attribute_id
                LEFT JOIN MAIN.app_data_entity_resource     ader_attribute_master
                ON ader_attribute_master.id = adrm_attribute_master.app_data_entity_resource_id
                LEFT JOIN MAIN.app_setting                  as_attribute_master
                ON as_attribute_master.id 	= ader_attribute_master.app_setting_id,
            <DB_SCHEMA/>.app_data_resource_detail       adrd,
            <DB_SCHEMA/>.app_data_resource_master       adrm
            LEFT OUTER JOIN <DB_SCHEMA/>.app_data_resource_master   adrm_attribute
                ON adrm_attribute.id        = adrd.app_data_resource_master_id
                LEFT JOIN <DB_SCHEMA/>.app_data_entity_resource     ader_attribute
                ON ader_attribute.id        = adrm_attribute.app_data_entity_resource_id
                LEFT JOIN <DB_SCHEMA/>.app_setting                  as_attribute
                ON as_attribute.id          = ader_attribute.app_setting_id,
            <DB_SCHEMA/>.app_data_entity_resource ader,
            <DB_SCHEMA/>.app_setting              app_s
    WHERE adrdd.app_data_resource_detail_id                       = adrd.id
        AND ader.id                                                 = adrd.app_data_entity_resource_id
        AND ader.app_data_entity_app_id                             = adrd.app_data_entity_resource_app_data_entity_app_id
        AND adrm.id                                                 = adrd.app_data_resource_master_id
        AND app_s.id                                                = ader.app_setting_id
        AND app_s.app_setting_type_app_id                           = ader.app_data_entity_app_id
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
        AND (app_s.app_setting_type_app_setting_type_name               = :resource_name_type OR :resource_name_type IS NULL)
        AND (app_s.value                                                = :resource_name_value OR :resource_name_value IS NULL)
        AND (as_attribute.app_setting_type_app_setting_type_name        = :resource_name_master_attribute_type OR :resource_name_master_attribute_type IS NULL)
        AND (as_attribute.value                                         = :resource_name_master_attribute_value OR :resource_name_master_attribute_value IS NULL)
        AND (as_attribute_master.app_setting_type_app_setting_type_name = :resource_name_data_master_attribute_type OR :resource_name_data_master_attribute_type IS NULL)
        AND (as_attribute_master.value    							                = :resource_name_data_master_attribute_value OR :resource_name_data_master_attribute_value IS NULL)
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
            app_s.id                                                        "app_data_resource_master_app_setting_id",
            as_attribute.app_setting_type_app_setting_type_name             "app_data_resource_master_app_setting_type_app_setting_type_name",
            as_attribute.value                                              "app_data_resource_master_app_setting_value",
            as_attribute.display_data                                       "app_setting_attribute_display_data",
            app_s.id                                                        "app_setting_id",
            app_s.app_setting_type_app_setting_type_name                    "app_setting_type_app_setting_type_name",
            app_s.value                                                     "app_setting_value",
            app_s.display_data                                              "app_setting_display_data"
        FROM <DB_SCHEMA/>.app_data_resource_detail adrd,
            <DB_SCHEMA/>.app_data_resource_master adrm
                LEFT OUTER JOIN <DB_SCHEMA/>.app_data_resource_master   adrm_attribute
                    ON adrm_attribute.id           = adrd.app_data_resource_master_id
                    LEFT JOIN <DB_SCHEMA/>.app_data_entity_resource     ader_attribute
                    ON ader_attribute.id = adrm_attribute.app_data_entity_resource_id
                    LEFT JOIN <DB_SCHEMA/>.app_setting                  as_attribute
                    ON as_attribute.id = ader_attribute.app_setting_id,
            <DB_SCHEMA/>.app_data_entity_resource ader,
            <DB_SCHEMA/>.app_setting              app_s
        WHERE ader.id                                                 = adrd.app_data_entity_resource_id
        AND ader.app_data_entity_app_id                             = adrd.app_data_entity_resource_app_data_entity_app_id
        AND adrm.id                                                 = adrd.app_data_resource_master_id
        AND app_s.id                                                = ader.app_setting_id
        AND app_s.app_setting_type_app_id                           = ader.app_data_entity_app_id
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
        AND (app_s.value                                            = :resource_name OR :resource_name IS NULL)
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
            app_s.app_setting_type_app_setting_type_name            "app_setting_type_app_setting_type_name",
            app_s.value                                             "app_setting_value",
            app_s.display_data                                      "app_setting_display_data"
       FROM <DB_SCHEMA/>.app_data_resource_master adrm,
            <DB_SCHEMA/>.app_data_entity_resource ader,
            <DB_SCHEMA/>.app_setting              app_s
      WHERE ader.id                                                   = adrm.app_data_entity_resource_id
            AND ader.app_data_entity_app_id                               = adrm.app_data_entity_resource_app_data_entity_app_id
            AND app_s.id                                                  = ader.app_setting_id
            AND app_s.app_setting_type_app_id                             = ader.app_data_entity_app_id
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
            AND (adrm.app_data_entity_resource_app_data_entity_id         = :entity_id OR :entity_id IS NULL)
            AND (app_s.value                                              = :resource_name OR :resource_name IS NULL)`;
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
const APP_DATA_STAT_SELECT =
    `SELECT ads.app_id                                              "app_id",
            ads.json_data                                           "json_data",
            ads.date_created                                        "date_created",
            
            ads.user_account_id                                     "user_account_id",

            ads.user_account_app_user_account_id                    "user_account_app_user_account_id",
            ads.user_account_app_app_id                             "user_account_app_app_id",

            ads.app_data_resource_master_id                         "app_data_resource_master_id",
            adrm.app_data_entity_resource_app_data_entity_app_id    "app_data_resource_master_app_data_entity_resource_app_data_entity_app_id",
            adrm.app_data_entity_resource_app_data_entity_id        "app_data_resource_master_app_data_entity_resource_app_data_entity_id",
            adrm.app_data_entity_resource_id                        "app_data_resource_master_app_data_entity_resource_id",
            adrm.user_account_app_user_account_id                   "app_data_resource_master_user_account_app_user_account_id",
            adrm.user_account_app_app_id                            "app_data_resource_master_user_account_app_app_id",

            ads.app_data_entity_resource_id                         "app_data_entity_resource_id",
            as.id                                                   "app_setting_id",
            as.app_setting_type_app_setting_type_name               "app_setting_type_app_setting_type_name"
            as.value                                                "app_setting_value"
            as.display_data                                         "app_setting_display_data"

            ads.app_data_entity_resource_app_data_entity_app_id     "app_data_entity_resource_app_data_entity_app_id",
            ads.app_data_entity_resource_app_data_entity_id         "app_data_entity_resource_app_data_entity_id"
                    FROM <DB_SCHEMA/>.app_data_stat  ads,
            <DB_SCHEMA/>.app_data_entity_resource ader,
            <DB_SCHEMA/>.app_setting    as
            LEFT OUTER JOIND <DB_SCHEMA/>.app_data_resource_master adrm
                    ON adrm.id = ads.app_data_resource_master_id
      WHERE ader.id     = app_data_entity_resource_id
        AND as.id       = ader.app_setting_id
        AND (ads.id		= :resource_id OR :resource_id IS NULL)
                    AND (ads.app_id = :data_app_id OR :data_app_id IS NULL)
        AND (as.app_setting_type_app_setting_type_name = :resource_name_entity OR :resource_name_entity IS NULL)`;

const APP_DATA_STAT_SELECT_LOG =
    `SELECT app_id                                          "app_id",
            app_data_entity_resource_id                     "app_data_entity_resource_id",
            app_data_entity_resource_app_data_entity_app_id "app_data_entity_resource_app_data_entity_app_id",
            app_data_entity_resource_app_data_entity_id     "app_data_entity_resource_app_data_entity_id",
            json_data                                       "json_data",
            date_created                                    "date_created",
            count(*) over()                                 "total_rows"
       FROM <DB_SCHEMA/>.app_data_stat
      WHERE ((app_id = :app_id) OR :app_id IS NULL)
        AND (app_data_entity_resource_id = :app_data_entity_resource_id OR :app_data_entity_resource_id IS NULL)
        AND (app_data_entity_resource_app_data_entity_app_id = :app_data_entity_resource_app_data_entity_app_id OR :app_data_entity_resource_app_data_entity_app_id IS NULL)
        AND (app_data_entity_resource_app_data_entity_id = :app_data_entity_resource_app_data_entity_id OR :app_data_entity_resource_app_data_entity_id IS NULL)
        AND <DATE_PERIOD_YEAR/> = :year
        AND <DATE_PERIOD_MONTH/> = :month
        AND <DATE_PERIOD_DAY/> = :day
        ORDER BY <SORT/> <ORDER_BY/>
        <APP_PAGINATION_LIMIT_OFFSET/>`;
const APP_DATA_STAT_SELECT_UNIQUE_VISITORS = 
    `SELECT t.chart "chart",
            t.app_id 		"app_id",
            :year_log 	"year",
            :month_log 	"month",
            t.day_log 	"day",
            json_data 	"json_data"
       FROM (SELECT 1								chart,
                    app_id,
                    NULL 							day_log,
                    json_data
                FROM <DB_SCHEMA/>.app_data_stat
            WHERE <DATE_PERIOD_YEAR/> =                             :year_log
                AND <DATE_PERIOD_MONTH/> =                            :month_log
                AND app_data_entity_resource_id =                     :app_data_entity_resource_id
                AND app_data_entity_resource_app_data_entity_app_id = :app_data_entity_resource_app_data_entity_app_id
                AND app_data_entity_resource_app_data_entity_id =     :app_data_entity_resource_app_data_entity_id
            UNION ALL
            SELECT 2								chart,
                    NULL 							app_id,
                    <DATE_PERIOD_DAY/> 			day_log,
                    json_data
                FROM <DB_SCHEMA/>.app_data_stat
            WHERE ((app_id = :app_id_log) OR :app_id_log IS NULL)
                AND <DATE_PERIOD_YEAR/> =                             :year_log
                AND <DATE_PERIOD_MONTH/> =                            :month_log
                AND app_data_entity_resource_id =                     :app_data_entity_resource_id
                AND app_data_entity_resource_app_data_entity_app_id = :app_data_entity_resource_app_data_entity_app_id
                AND app_data_entity_resource_app_data_entity_id =     :app_data_entity_resource_app_data_entity_id) t
    ORDER BY 1, 2`;
const APP_DATA_STAT_INSERT = 
    `INSERT INTO <DB_SCHEMA/>.app_data_stat (   json_data, 
                                                date_created,
                                                app_id,
                                                user_account_id,
                                                user_account_app_user_account_id,
                                                user_account_app_app_id,
                                                app_data_resource_master_id,
                                                app_data_entity_resource_id,
                                                app_data_entity_resource_app_data_entity_app_id,
                                                app_data_entity_resource_app_data_entity_id)
        VALUES( :json_data, 
                CURRENT_TIMESTAMP,
                :app_id,
                :user_account_id,
                :user_account_app_user_account_id,
                :user_account_app_app_id,
                :app_data_resource_master_id,
                :app_data_entity_resource_id,
                :app_data_entity_resource_app_data_entity_app_id,
                :app_data_entity_resource_app_data_entity_id)`;

const APP_SETTING_SELECT = 
    `SELECT s.id "id",
            s.app_setting_type_app_id "app_id",
            s.app_setting_type_app_setting_type_name "app_setting_type_name",
            s.value "value",
            s.data2 "data2",
            s.data3 "data3",
            s.data4 "data4",
            s.data5 "data5",
            (SELECT str.text
            FROM <DB_SCHEMA/>.language l,
                    <DB_SCHEMA/>.app_translation str
            WHERE l.id = str.language_id
                AND str.app_setting_id = s.id
                AND l.locale = (SELECT COALESCE(MAX(l1.locale),'en')
                                    FROM <DB_SCHEMA/>.app_translation str1,
                                        <DB_SCHEMA/>.language l1
                                    WHERE l1.id  = str1.language_id
                                    AND str1.app_setting_id = str.app_setting_id
                                    AND l1.locale IN (<LOCALE/>)
                                    )
            ) "text"
      FROM <DB_SCHEMA/>.app_setting s
     WHERE s.app_setting_type_app_setting_type_name LIKE COALESCE(:app_setting_type_name, s.app_setting_type_app_setting_type_name)
       AND (((s.app_setting_type_app_id = :app_id) OR :app_id IS NULL)
            OR
            s.app_setting_type_app_id = :common_app_id)
       AND s.display_data IS NULL
     UNION ALL
     SELECT s.id "id",
            s.app_setting_type_app_id "app_id",
            s.app_setting_type_app_setting_type_name "app_setting_type_name",
            s.value "value",
            s.data2 "data2",
            s.data3 "data3",
            s.data4 "data4",
            s.data5 "data5",
            s.display_data "text"
       FROM <DB_SCHEMA/>.app_setting s
      WHERE s.app_setting_type_app_setting_type_name LIKE COALESCE(:app_setting_type_name, s.app_setting_type_app_setting_type_name)
        AND (((s.app_setting_type_app_id = :app_id) OR :app_id IS NULL)
            OR
            s.app_setting_type_app_id = :common_app_id)
        AND s.display_data IS NOT NULL
        ORDER BY 1, 2, 3`;
const APP_SETTING_SELECT_DISPLAYDATA = 
    `SELECT s.id                                         "id", 
            s.app_setting_type_app_setting_type_name     "app_setting_type_name",
            s.value                                      "value", 
            null                                         "name", 
            s.display_data                               "display_data", 
            data2                                        "data2", 
            data3                                        "data3", 
            data4                                        "data4",
            data5                                        "data5"
       FROM <DB_SCHEMA/>.app_setting s
      WHERE (s.app_setting_type_app_setting_type_name = :app_setting_type_name OR :app_setting_type_name IS NULL)
        AND s.app_setting_type_app_id = :app_id
        AND (s.value = :value OR :value IS NULL)
        AND s.display_data IS NOT NULL
        ORDER BY 1`;
const IDENTITY_PROVIDER_SELECT =
    `SELECT id "id",
            provider_name "provider_name",
            api_src "api_src",
            api_src2 "api_src2",
            api_version "api_version",
            api_id "api_id"
       FROM <DB_SCHEMA/>.identity_provider
      WHERE enabled = 1
      ORDER BY identity_provider_order ASC`;
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
            identity_provider_id "identity_provider_id", 
            provider_id "provider_id", 
            avatar "avatar",
            provider_image "provider_image",
            provider_image_url "provider_image_url",
            username "username",
            provider_first_name "provider_first_name",
            count(*) over() "total_rows"
        FROM (SELECT 'LIKE_POST' detail,
                    u.id,
                    u.identity_provider_id,
                    u.provider_id,
                    u.avatar,
                    u.provider_image,
                    u.provider_image_url,
                    u.username,
                    u.provider_first_name
                FROM <DB_SCHEMA/>.user_account u
            WHERE u.id IN (SELECT us.user_account_app_user_account_id
                                FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
                                    <DB_SCHEMA/>.user_account_app_data_post us
                            WHERE u_like.user_account_app_user_account_id = :user_account_id
                                AND u_like.user_account_app_app_id = :app_id
                                AND us.user_account_app_app_id = u_like.user_account_app_app_id
                                AND us.id = u_like.user_account_app_data_post_id)
                AND    u.active = 1
                AND    6 = :detailchoice
                UNION ALL
                SELECT 'LIKED_POST' detail,
                        u.id,
                        u.identity_provider_id,
                        u.provider_id,
                        u.avatar,
                        u.provider_image,
                        u.provider_image_url,
                        u.username,
                        u.provider_first_name
                FROM  <DB_SCHEMA/>.user_account u
                WHERE  u.id IN (SELECT u_like.user_account_app_user_account_id
                                FROM <DB_SCHEMA/>.user_account_app_data_post us,
                                        <DB_SCHEMA/>.user_account_app_data_post_like u_like
                                WHERE us.user_account_app_user_account_id = :user_account_id
                                    AND us.user_account_app_app_id = :app_id
                                    AND us.id = u_like.user_account_app_data_post_id
                                    AND u_like.user_account_app_app_id = us.user_account_app_app_id)
                AND  u.active = 1
                AND  7 = :detailchoice) t
            ORDER BY 1, COALESCE(username, provider_first_name) 
            <APP_LIMIT_RECORDS/>`;
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
            identity_provider_id "identity_provider_id", 
            provider_id "provider_id", 
            avatar "avatar",
            provider_image "provider_image",
            provider_image_url "provider_image_url",
            username "username",
            provider_first_name "provider_first_name",
            count "count",
            count(*) over() "total_rows"
        FROM (	SELECT 'LIKE_POST' top,
                        u.id,
                        u.identity_provider_id,
                        u.provider_id,
                        u.avatar,
                        u.provider_image,
                        u.provider_image_url,
                        u.username,
                        u.provider_first_name,
                        (SELECT COUNT(us.user_account_app_user_account_id)
                        FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
                                <DB_SCHEMA/>.user_account_app_data_post us
                        WHERE us.user_account_app_user_account_id = u.id
                            AND us.user_account_app_app_id = :app_id
                            AND u_like.user_account_app_data_post_id = us.id
                            AND u_like.user_account_app_app_id = us.user_account_app_app_id) count
                FROM  <DB_SCHEMA/>.user_account u
                WHERE  u.active = 1
                AND  u.private <> 1
                AND  4 = :statchoice
                UNION ALL
                SELECT 'VISITED_POST' top,
                        u.id,
                        u.identity_provider_id,
                        u.provider_id,
                        u.avatar,
                        u.provider_image,
                        u.provider_image_url,
                        u.username,
                        u.provider_first_name,
                        (SELECT COUNT(us.user_account_app_user_account_id)
                        FROM <DB_SCHEMA/>.user_account_app_data_post_view u_view,
                                <DB_SCHEMA/>.user_account_app_data_post us
                        WHERE us.user_account_app_user_account_id = u.id
                            AND us.user_account_app_app_id = :app_id
                            AND u_view.user_account_app_data_post_id = us.id
                            AND u_view.user_account_app_app_id = us.user_account_app_app_id) count
                FROM  <DB_SCHEMA/>.user_account u
                WHERE  u.active = 1
                AND  u.private <> 1
                AND  5 = :statchoice) t
        ORDER BY 1,10 DESC, COALESCE(username, provider_first_name) 
        <APP_LIMIT_RECORDS/>`;
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
     SELECT :app_id, ua.id, CURRENT_TIMESTAMP
       FROM <DB_SCHEMA/>.user_account ua
      WHERE ua.id = :user_account_id
        AND NOT EXISTS (SELECT NULL
                          FROM <DB_SCHEMA/>.user_account_app uap
                         WHERE uap.app_id = :app_id
                           AND uap.user_account_id = ua.id)`;
const USER_ACCOUNT_APP_SELECT_USER_APPS = 
    `SELECT uap.app_id "app_id",
            uap.date_created "date_created"
       FROM <DB_SCHEMA/>.user_account_app uap,
            <DB_SCHEMA/>.app a
      WHERE a.id = uap.app_id
        AND uap.user_account_id = :user_account_id`;
const USER_ACCOUNT_APP_SELECT_USER_APP = 
    `SELECT uaa.preference_locale "preference_locale",
            uaa.app_setting_preference_timezone_id "app_setting_preference_timezone_id",
            (SELECT s.value
                FROM <DB_SCHEMA/>.app_setting s
                WHERE s.id = uaa.app_setting_preference_timezone_id) "app_setting_preference_timezone_value",
            uaa.app_setting_preference_direction_id "app_setting_preference_direction_id",
            (SELECT s.value
                FROM <DB_SCHEMA/>.app_setting s
                WHERE s.id = uaa.app_setting_preference_direction_id) "app_setting_preference_direction_value",
            uaa.app_setting_preference_arabic_script_id "app_setting_preference_arabic_script_id",
            (SELECT s.value
                FROM <DB_SCHEMA/>.app_setting s
                WHERE s.id = uaa.app_setting_preference_arabic_script_id) "app_setting_preference_arabic_script_value",
            uaa.date_created "date_created"
       FROM <DB_SCHEMA/>.user_account_app uaa
      WHERE uaa.user_account_id = :user_account_id
        AND uaa.app_id = :app_id`;
const USER_ACCOUNT_APP_UPDATE =
    `UPDATE <DB_SCHEMA/>.user_account_app
        SET preference_locale = :preference_locale,
            app_setting_preference_timezone_id = :app_setting_preference_timezone_id,
            app_setting_preference_direction_id = :app_setting_preference_direction_id,
            app_setting_preference_arabic_script_id = :app_setting_preference_arabic_script_id,
            date_created = CURRENT_TIMESTAMP
      WHERE user_account_id = :user_account_id
        AND app_id = :app_id`;
const USER_ACCOUNT_APP_DELETE = 
    `DELETE FROM <DB_SCHEMA/>.user_account_app
     WHERE user_account_id = :user_account_id
       AND app_id = :app_id`;
const USER_ACCOUNT_EVENT_INSERT =
    `INSERT INTO <DB_SCHEMA/>.user_account_event(
                user_account_id, event_id, event_status_id,
                date_created, date_modified)
     SELECT :user_account_id, e.id, es.id, 
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
       FROM <DB_SCHEMA/>.event e,
            <DB_SCHEMA/>.event_status es
      WHERE e.event_name = :event
        AND es.status_name = :event_status`;
const USER_ACCOUNT_EVENT_SELECT_LAST =
    `SELECT uae.user_account_id "user_account_id",
            uae.event_id "event_id",
            e.event_name "event_name",
            uae.event_status_id "event_status_id",
            es.status_name "status_name",
            uae.date_created "date_created",
            uae.date_modified "date_modified",
            CURRENT_TIMESTAMP "current_timestamp"
       FROM <DB_SCHEMA/>.user_account_event uae,
            <DB_SCHEMA/>.event e,
            <DB_SCHEMA/>.event_status es
      WHERE uae.user_account_id = :user_account_id
        AND e.id = uae.event_id
        AND e.event_name = :event
        AND es.id = uae.event_status_id
        AND uae.date_created = (SELECT MAX(uae_max.date_created)
                                  FROM <DB_SCHEMA/>.user_account_event uae_max,
                                       <DB_SCHEMA/>.event_status es_max
                                 WHERE uae_max.user_account_id = uae.user_account_id
                                   AND uae_max.event_id = uae.event_id
                                   AND es_max.id = uae_max.event_status_id)`;
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
const USER_ACCOUNT_SELECT = 
    `SELECT ua.id "id",
            ua.avatar "avatar",
            ua.active "active",
            ua.user_level "user_level",
            ua.private "private",
            ua.username "username",
            ua.bio "bio",
            ua.email "email",
            ua.email_unverified "email_unverified",
            ua.password "password",
            ua.password_reminder "password_reminder",
            ua.verification_code "verification_code",
            ua.identity_provider_id "identity_provider_id",
            ip.provider_name "provider_name",
            ua.provider_id "provider_id",
            ua.provider_first_name "provider_first_name",
            ua.provider_last_name "provider_last_name",
            ua.provider_image "provider_image",
            ua.provider_image_url "provider_image_url",
            ua.provider_email "provider_email",
            ua.date_created "date_created",
            ua.date_modified "date_modified",
            count(*) over() "total_rows"
        FROM <DB_SCHEMA/>.user_account ua
            LEFT OUTER JOIN <DB_SCHEMA/>.identity_provider ip
                ON ip.id = ua.identity_provider_id
        WHERE (ua.username LIKE :search
        OR ua.bio LIKE :search
        OR ua.email LIKE :search
        OR ua.email_unverified LIKE :search
        OR ua.provider_first_name LIKE :search
        OR ua.provider_last_name LIKE :search
        OR ua.provider_email LIKE :search
        OR CAST(ua.id as VARCHAR(11)) LIKE :search)
        OR :search = '*'
        ORDER BY <SORT/> <ORDER_BY/>
        <APP_PAGINATION_LIMIT_OFFSET/>`;
const USER_ACCOUNT_SELECT_STAT_COUNT = 
    `SELECT ua.identity_provider_id "identity_provider_id",
            CASE 
            WHEN ip.provider_name IS NULL THEN 
                NULL
            ELSE 
                ip.provider_name 
            END "provider_name",
            COUNT(*) "count_users"
       FROM <DB_SCHEMA/>.user_account ua
            LEFT OUTER JOIN <DB_SCHEMA/>.identity_provider ip
            ON ip.id = ua.identity_provider_id
       GROUP BY ua.identity_provider_id, ip.provider_name
       ORDER BY ua.identity_provider_id`;
const USER_ACCOUNT_UPDATE =
    `UPDATE <DB_SCHEMA/>.user_account
        SET active = :active,
            user_level = :user_level,
            private = :private,
            username = :username,
            bio = :bio,
            email = :email,
            email_unverified = :email_unverified,
            password = 	CASE WHEN :password_new IS NULL THEN 
                            password 
                        ELSE 
                            :password_new 
                        END,
            password_reminder = :password_reminder,
            verification_code = :verification_code
      WHERE id = :id`;
const USER_ACCOUNT_INSERT = 
    `INSERT INTO <DB_SCHEMA/>.user_account(
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
        verification_code,
        active,
        identity_provider_id,
        provider_id,
        provider_first_name,
        provider_last_name,
        provider_image,
        provider_image_url,
        provider_email)
    VALUES( :bio,
            :private,
            :user_level,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            :username,
            :password_new,
            :password_reminder,
            :email,
            :avatar,
            :verification_code,
            :active,
            :identity_provider_id,
            :provider_id,
            :provider_first_name,
            :provider_last_name,
            :provider_image,
            :provider_image_url,
            :provider_email) `;
const USER_ACCOUNT_UPDATE_ACTIVATE =
    `UPDATE <DB_SCHEMA/>.user_account
        SET active = 1,
            verification_code = :auth,
            email = CASE 
                    WHEN  :verification_type = 4 THEN 
                        email_unverified
                    ELSE 
                        email
                    END,
            email_unverified = CASE 
                                WHEN  :verification_type = 4 THEN 
                                    NULL
                                ELSE 
                                    email_unverified
                                END,
            date_modified = CURRENT_TIMESTAMP
     WHERE id = :id
       AND verification_code = :verification_code `;
const USER_ACCOUNT_UPDATE_VERIFICATION_CODE =
    `UPDATE <DB_SCHEMA/>.user_account
        SET verification_code = :verification_code,
            active = 0,
            date_modified = CURRENT_TIMESTAMP
      WHERE id = :id `;
const USER_ACCOUNT_SELECT_ID =
    `SELECT	u.id "id",
            u.bio "bio",
            u.private "private",
            u.user_level "user_level",
            u.username "username",
            u.password "password",
            u.password_reminder "password_reminder",
            u.email "email",
            u.email_unverified "email_unverified",
            u.avatar "avatar",
            u.verification_code "verification_code",
            u.active "active",
            u.identity_provider_id "identity_provider_id",
            u.provider_id "provider_id",
            u.provider_first_name "provider_first_name",
            u.provider_last_name "provider_last_name",
            u.provider_image "provider_image",
            u.provider_image_url "provider_image_url",
            u.provider_email "provider_email",
            u.date_created "date_created",
            u.date_modified "date_modified"
      FROM  <DB_SCHEMA/>.user_account u
     WHERE  u.id = :id `;
const USER_ACCOUNT_SELECT_PROFILE =
    `SELECT	u.id "id",
            u.bio "bio",
            u.private "private",
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
            u.user_level "user_level",
            u.date_created "date_created",
            u.username "username",
            u.avatar "avatar",
            u.identity_provider_id "identity_provider_id",
            u.provider_id "provider_id",
            u.provider_first_name "provider_first_name",
            u.provider_last_name "provider_last_name",
            u.provider_image "provider_image",
            u.provider_image_url "provider_image_url",
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
       WHERE ((:search IS NOT NULL AND (u.username LIKE :search OR u.provider_first_name LIKE :search))
                OR
                (u.username = :name)
                OR
                (u.id = :id)
            )        
         AND u.active = 1`;
const USER_ACCOUNT_SELECT_PROFILE_DETAIL =
    `SELECT detail "detail",
            id "id",
            provider_id "provider_id",
            avatar "avatar",
            provider_image "provider_image",
            provider_image_url "provider_image_url",
            username "username",
            provider_first_name "provider_first_name",
            count(*) over() "total_rows"
    FROM (SELECT 	'FOLLOWING' detail,
                    u.id,
                    u.provider_id,
                    u.avatar,
                    u.provider_image,
                    u.provider_image_url,
                    u.username,
                    u.provider_first_name
            FROM <DB_SCHEMA/>.user_account_follow u_follow,
                <DB_SCHEMA/>.user_account u
            WHERE u_follow.user_account_id = :user_account_id
            AND u.id = u_follow.user_account_id_follow
            AND u.active = 1
            AND 1 = :detailchoice
            UNION ALL
        SELECT 	'FOLLOWED' detail,
                    u.id,
                    u.provider_id,
                    u.avatar,
                    u.provider_image,
                    u.provider_image_url,
                    u.username,
                    u.provider_first_name
            FROM <DB_SCHEMA/>.user_account_follow u_followed,
                <DB_SCHEMA/>.user_account u
            WHERE u_followed.user_account_id_follow = :user_account_id
            AND u.id = u_followed.user_account_id
            AND u.active = 1
            AND 2 = :detailchoice
            UNION ALL
        SELECT	'LIKE_USER' detail,
                    u.id,
                    u.provider_id,
                    u.avatar,
                    u.provider_image,
                    u.provider_image_url,
                    u.username,
                    u.provider_first_name
            FROM <DB_SCHEMA/>.user_account_like u_like,
                <DB_SCHEMA/>.user_account u
            WHERE u_like.user_account_id = :user_account_id
            AND u.id = u_like.user_account_id_like
            AND u.active = 1
            AND 3 = :detailchoice
            UNION ALL
        SELECT	'LIKED_USER' detail,
                    u.id,
                    u.provider_id,
                    u.avatar,
                    u.provider_image,
                    u.provider_image_url,
                    u.username,
                    u.provider_first_name
            FROM <DB_SCHEMA/>.user_account_like u_liked,
                <DB_SCHEMA/>.user_account u
            WHERE u_liked.user_account_id_like = :user_account_id
            AND u.id = u_liked.user_account_id
            AND u.active = 1
            AND 4 = :detailchoice) t
        ORDER BY 1, COALESCE(username, provider_first_name) 
        <APP_LIMIT_RECORDS/>`;
const USER_ACCOUNT_SELECT_PROFILE_STAT = 
    `SELECT	top "top", 
            id "id", 
            identity_provider_id "identity_provider_id", 
            provider_id "provider_id", 
            avatar "avatar",
            provider_image "provider_image",
            provider_image_url "provider_image_url",
            username "username",
            provider_first_name "provider_first_name",
            count "count",
            count(*) over() "total_rows"
       FROM (SELECT 'VISITED' top,
                    u.id,
                    u.identity_provider_id,
                    u.provider_id,
                    u.avatar,
                    u.provider_image,
                    u.provider_image_url,
                    u.username,
                    u.provider_first_name,
                    (SELECT COUNT(u_visited.user_account_id_view)
                    FROM <DB_SCHEMA/>.user_account_view u_visited
                    WHERE u_visited.user_account_id_view = u.id) count
               FROM <DB_SCHEMA/>.user_account u
              WHERE u.active = 1
                AND u.private <> 1
                AND 1 = :statchoice
            UNION ALL
            SELECT 	'FOLLOWING' top,
                        u.id,
                        u.identity_provider_id,
                        u.provider_id,
                        u.avatar,
                        u.provider_image,
                        u.provider_image_url,
                        u.username,
                        u.provider_first_name,
                        (SELECT COUNT(u_follow.user_account_id_follow)
                        FROM <DB_SCHEMA/>.user_account_follow u_follow
                        WHERE u_follow.user_account_id_follow = u.id) count
                FROM <DB_SCHEMA/>.user_account u
                WHERE u.active = 1
                AND u.private <> 1
                AND 2 = :statchoice
            UNION ALL
            SELECT 	'LIKE_USER' top,
                        u.id,
                        u.identity_provider_id,
                        u.provider_id,
                        u.avatar,
                        u.provider_image,
                        u.provider_image_url,
                        u.username,
                        u.provider_first_name,
                        (SELECT COUNT(u_like.user_account_id_like)
                        FROM <DB_SCHEMA/>.user_account_like u_like
                        WHERE u_like.user_account_id_like = u.id) count
                FROM <DB_SCHEMA/>.user_account u
                WHERE  u.active = 1
                AND  u.private <> 1
                AND  3 = :statchoice) t
       WHERE EXISTS(SELECT NULL
                      FROM <DB_SCHEMA/>.user_account_app uap
                     WHERE uap.user_account_id = t.id
                       AND uap.app_id = :app_id)
      ORDER BY 1,10 DESC, COALESCE(username, provider_first_name) 
      <APP_LIMIT_RECORDS/>`;
const USER_ACCOUNT_SELECT_PASWORD = 
    `SELECT password "password"
       FROM <DB_SCHEMA/>.user_account
      WHERE id = :id `;
const USER_ACCOUNT_UPDATE_PASSWORD =
    `UPDATE <DB_SCHEMA/>.user_account
        SET password = :password_new,
            verification_code = null
      WHERE id = :id  
        AND verification_code = :auth
        AND verification_code IS NOT NULL`;
const USER_ACCOUNT_UPDATE_LOCAL =
    `UPDATE <DB_SCHEMA/>.user_account
        SET bio = :bio,
            private = :private,
            username = :username,
            password = 	COALESCE(:password_new, password),
            password_reminder = :password_reminder,
            email = :email,
            email_unverified = :email_unverified,
            avatar = :avatar,
            verification_code = :verification_code,
            date_modified = CURRENT_TIMESTAMP
      WHERE id = :id `;
const USER_ACCOUNT_UPDATE_COMMON =
    `UPDATE <DB_SCHEMA/>.user_account
        SET username = :username,
            bio = :bio,
            private = :private,
            date_modified = CURRENT_TIMESTAMP
      WHERE id = :id `;
const USER_ACCOUNT_DELETE =
    `DELETE FROM <DB_SCHEMA/>.user_account
	 WHERE id = :id `;
const USER_ACCOUNT_SELECT_USERNAME =
    `SELECT	id "id",
            bio "bio",
            username "username",
            password "password",
            email "email",
            active "active",
            avatar "avatar"
       FROM <DB_SCHEMA/>.user_account
      WHERE username = :username 
        AND provider_id IS NULL`;
const USER_ACCOUNT_UPDATE_PROVIDER = 
    `UPDATE <DB_SCHEMA/>.user_account
        SET identity_provider_id = :identity_provider_id,
            provider_id = :provider_id,
            provider_first_name = :provider_first_name,
            provider_last_name = :provider_last_name,
            provider_image = :provider_image,
            provider_image_url = :provider_image_url,
            provider_email = :provider_email,
            date_modified = CURRENT_TIMESTAMP
      WHERE id = :id
        AND active =1 `;
const USER_ACCOUNT_SELECT_PROVIDER =
    `SELECT	u.id "id",
            u.bio "bio",
            u.username "username",
            u.identity_provider_id "identity_provider_id",
            u.provider_id "provider_id",
            u.provider_first_name "provider_first_name",
            u.provider_last_name "provider_last_name",
            u.provider_image "provider_image",
            u.provider_image_url "provider_image_url",
            u.provider_email "provider_email"
       FROM <DB_SCHEMA/>.user_account u
      WHERE u.provider_id = :provider_id
        AND u.identity_provider_id = :identity_provider_id`;
const USER_ACCOUNT_SELECT_EMAIL =
    `SELECT id "id",
            email "email"
       FROM <DB_SCHEMA/>.user_account
      WHERE email = :email `;
const USER_ACCOUNT_SELECT_DEMO = 
    `SELECT id "id",
            username "username"	
       FROM <DB_SCHEMA/>.user_account
      WHERE user_level = :demo_level`;
export {/**APP_DATA_ENTITIY_RESOURCE */
        APP_DATA_ENTITY_RESOURCE_SELECT, 
        /**APP_DATA_ENTITIY */
        APP_DATA_ENTITY_SELECT,
        /**APP_DATA_RESOURCE_DETAIL_DATA */
        APP_DATA_RESOURCE_DETAIL_DATA_SELECT,APP_DATA_RESOURCE_DETAIL_DATA_INSERT, APP_DATA_RESOURCE_DETAIL_DATA_UPDATE, APP_DATA_RESOURCE_DETAIL_DATA_DELETE,
        /**APP_DATA_RESOURCE_DETAIL */
        APP_DATA_RESOURCE_DETAIL_SELECT, APP_DATA_RESOURCE_DETAIL_INSERT,APP_DATA_RESOURCE_DETAIL_UPDATE,APP_DATA_RESOURCE_DETAIL_DELETE,
        /**APP_DATA_RESOURCE_MASTER */
        APP_DATA_RESOURCE_MASTER_SELECT,APP_DATA_RESOURCE_MASTER_INSERT, APP_DATA_RESOURCE_MASTER_UPDATE, APP_DATA_RESOURCE_MASTER_DELETE,
        /**APP_DATA_STAT */
        APP_DATA_STAT_SELECT, APP_DATA_STAT_SELECT_LOG, APP_DATA_STAT_SELECT_UNIQUE_VISITORS,APP_DATA_STAT_INSERT,
        /**APP_SETTING */
        APP_SETTING_SELECT, APP_SETTING_SELECT_DISPLAYDATA,
        /**IDENTITY_PROVIDER */
        IDENTITY_PROVIDER_SELECT,
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
        /**USER_ACCOUNT_EVENT */
        USER_ACCOUNT_EVENT_INSERT,USER_ACCOUNT_EVENT_SELECT_LAST,
        /**USER_ACCOUNT_FOLLOW */
        USER_ACCOUNT_FOLLOW_INSERT,USER_ACCOUNT_FOLLOW_DELETE,
        /**USER_ACCOUNT_LIKE */
        USER_ACCOUNT_LIKE_INSERT,USER_ACCOUNT_LIKE_DELETE,
        /**USER_ACCOUNT_VIEW */
        USER_ACCOUNT_VIEW_INSERT,
        /**USER_ACCOUNT */
        USER_ACCOUNT_SELECT,USER_ACCOUNT_SELECT_STAT_COUNT,
        USER_ACCOUNT_UPDATE,
        USER_ACCOUNT_INSERT,USER_ACCOUNT_UPDATE_ACTIVATE,USER_ACCOUNT_UPDATE_VERIFICATION_CODE,
        USER_ACCOUNT_SELECT_ID,USER_ACCOUNT_SELECT_PROFILE,USER_ACCOUNT_SELECT_PROFILE_DETAIL,USER_ACCOUNT_SELECT_PROFILE_STAT,
        USER_ACCOUNT_SELECT_PASWORD,USER_ACCOUNT_UPDATE_PASSWORD,USER_ACCOUNT_UPDATE_LOCAL,USER_ACCOUNT_UPDATE_COMMON,USER_ACCOUNT_DELETE,
        USER_ACCOUNT_SELECT_USERNAME,USER_ACCOUNT_UPDATE_PROVIDER,USER_ACCOUNT_SELECT_PROVIDER,USER_ACCOUNT_SELECT_EMAIL,USER_ACCOUNT_SELECT_DEMO};