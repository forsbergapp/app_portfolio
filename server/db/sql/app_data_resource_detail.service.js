/** @module server/db/sql/app_data_resource_detail */


/**@type{import('../common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number}      app_id 
 * @param {number|null} resource_id
 * @param {number|null} master_id
 * @param {number|null} user_account_id
 * @param {number|null} data_app_id
 * @param {string|null} resource_name
 * @param {number|null} entity_id
 * @param {string|null} locale
 * @param {boolean|null} user_null
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_detail_get[]>}
 */
 const get = async (app_id, resource_id, master_id, user_account_id, data_app_id, resource_name, entity_id, locale, user_null) => {
    const sql = `SELECT adrd.id                                                         "id",
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
    const parameters = {resource_id         : resource_id ?? null,
                        master_id           : master_id,
                        user_account_id     : user_account_id ?? null,
                        user_account_app_id : user_account_id?data_app_id:null,
                        data_app_id         : data_app_id,
                        resource_name       : resource_name,
                        entity_id           : entity_id ?? null,
                        user_null           : user_null?1:0
                        };
    return await db_execute(app_id, sql, parameters, null, null);
};
/**
 * 
 * @param {number}      app_id
 * @param {*}           data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_detail_post>}
 */
 const post = async (app_id, data) => {
    const sql = `INSERT INTO <DB_SCHEMA/>.app_data_resource_detail (json_data, 
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
    const parameters = {json_data                                       : JSON.stringify(data.json_data),
                        app_data_resource_master_id                     : data.app_data_resource_master_id,
                        app_data_entity_resource_id                     : data.app_data_entity_resource_id,
                        user_account_id                                 : data.user_account_id,
                        user_account_app_id                             : data.user_account_id?data.data_app_id:null,
                        data_app_id                                     : data.data_app_id,
                        app_data_entity_resource_app_data_entity_id     : data.app_data_entity_resource_app_data_entity_id,
                        app_data_resource_master_attribute_id           : data.app_data_resource_master_attribute_id ?? null,
                        };
    return await db_execute(app_id, sql, parameters);
};

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*}      data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_detail_update>}
 */
 const update = async (app_id, resource_id, data) => {
    const sql = `UPDATE <DB_SCHEMA/>.app_data_resource_detail adrd
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
    const parameters = {resource_id:                                resource_id,
                        json_data:                                  JSON.stringify(data.json_data),
                        app_data_resource_master_id                 :data.app_data_resource_master_id, 
                        app_data_entity_resource_id                 :data.app_data_entity_resource_id, 
                        user_account_id                             :data.user_account_id,
                        user_account_app_id                         :data.user_account_id?data.data_app_id:null,
                        data_app_id                                 :data.data_app_id, 
                        app_data_entity_resource_app_data_entity_id :data.app_data_entity_resource_app_data_entity_id,
                        app_data_resource_master_attribute_id       :data.app_data_resource_master_attribute_id
                        };
    return await db_execute(app_id, sql, parameters);
};

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_detail_delete>}
 */
 const deleteRecord = async (app_id, resource_id, data) => {
    const sql = `DELETE FROM <DB_SCHEMA/>.app_data_resource_detail adrd
                  WHERE adrd.id = :resource_id
                    AND (adrd.app_data_entity_resource_app_data_entity_app_id = :data_app_id OR :data_app_id IS NULL)
                    AND EXISTS (SELECT NULL
                                  FROM <DB_SCHEMA/>.app_data_resource_master adrm
                                 WHERE adrm.id                                              = adrd.app_data_resource_master_id
                                   AND adrm.app_data_entity_resource_app_data_entity_app_id = adrd.app_data_entity_resource_app_data_entity_app_id
                                   AND ((adrm.user_account_app_user_account_id              = :user_account_id AND
                                         adrm.user_account_app_app_id                       = :user_account_app_id) OR :user_account_id IS NULL))`;
    const parameters = {resource_id         :resource_id,
                        user_account_id     :data.user_account_id,
                        user_account_app_id :data.user_account_id?data.data_app_id:null,
                        data_app_id         :data.data_app_id};
    return await db_execute(app_id, sql, parameters);
};
export{get, post, update, deleteRecord};