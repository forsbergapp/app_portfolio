/** @module server/db/sql */


/**@type{import('../common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number}      app_id 
 * @param {number|null} resource_id
 * @param {number|null} user_account_id
 * @param {number|null} user_account_app_id
 * @param {number|null} data_app_id
 * @param {string|null} resource_name
 * @param {string|null} resource_name_master_attribute
 * @param {number|null} entity_id
 * @param {string|null} locale
 * @param {boolean|null} user_null
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_detail_data_get[]>}
 */
 const get = async (app_id, resource_id, user_account_id, user_account_app_id, data_app_id, resource_name, resource_name_master_attribute, entity_id, locale, user_null=false) => {
    const sql = `SELECT adrdd.id                                                        "id",
                        adrdd.json_data                                                 "json_data",
                        adrdd.date_created                                              "date_created",
                        adrdd.date_modified                                             "date_modified",
                        adrdd.app_data_resource_detail_id                               "app_data_resource_detail_id",
                        adrdd.app_data_resource_master_attribute_id                     "app_data_resource_master_attribute_id",
                        
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
                        as.id                                                           "app_data_resource_master_app_setting_id"
                        as_attribute.app_setting_type_app_setting_type_name             "app_data_resource_master_app_setting_type_app_setting_type_name"
                        as_attribute.value                                              "app_data_resource_master_app_setting_value"
                        as_attribute.display_data                                       "app_setting_attribute_display_data"
                        as.id                                                           "app_setting_id",
                        as.app_setting_type_app_setting_type_name                       "app_setting_type_app_setting_type_name"
                        as.value                                                        "app_setting_value"
                        as.display_data                                                 "app_setting_display_data"
                   FROM <DB_SCHEMA/>.app_data_resource_detail_data  adrdd,
                        <DB_SCHEMA/>.app_data_resource_detail       adrd,
                        <DB_SCHEMA/>.app_data_resource_master       adrm
                        LEFT OUTER JOIN <DB_SCHEMA/>.app_data_resource_master   adrm_attribute
                            ON adrm_attribute.id           = adrd.app_data_resource_master_id
                            LEFT JOIN <DB_SCHEMA/>.app_data_entity_resource     ader_attribute
                            ON ader_attribute.id = adrm_attribute.app_data_entity_resource_id
                            LEFT JOIN <DB_SCHEMA/>.app_setting                  as_attribute
                            ON as_attribute.id = ader_attribute.app_setting_id
                        <DB_SCHEMA/>.app_data_entity_resource ader,
                        <DB_SCHEMA/>.app_setting              as,
                  WHERE adrdd.app_data_resource_detail_id                       = adrd.id
                    AND ader.id                                                 = adrd.app_data_entity_resource_id
                    AND ader.app_data_entity_app_id                             = adrd.app_data_entity_resource_app_data_entity_app_id
                    AND adrm.id                                                 = adrd.app_data_resource_master_id
                    AND as.id                                                   = ader.app_setting_id
                    AND as.app_setting_type_app_id                              = ader.app_data_entity_app_id
                    AND (adrdd.id                                               = :resource_id OR :resource_id IS NULL)
                    AND ((adrm.user_account_app_user_account_id                 = :user_account_id &&
                          adrm.user_account_app_app_id                          = :user_account_app_id) OR 
                         (:user_account_id IS NULL && :user_account_app_id IS NULL))                    
                    AND ((adrm.user_account_app_user_account_id                 = NULL && :user_null=1) OR :user_null=0)
                    AND (adrm.app_data_entity_resource_app_data_entity_app_id   = :data_app_id OR :data_app_id IS NULL)
                    AND (as.value                                               = :resource_name OR :resource_name IS NULL)
                    AND (as_attribute.app_setting_type_app_setting_type_name    = :resource_name_master_attribute OR :resource_name_master_attribute IS NULL)
                    AND (adrm.app_data_entity_resource_app_data_entity_id       = :entity_id OR :entity_id IS NULL)`;
    const parameters = {resource_id                     : resource_id,
                        user_account_id                 : user_account_id,
                        user_account_app_id             : user_account_app_id,
                        data_app_id                     : data_app_id,
                        resource_name                   : resource_name,
                        resource_name_master_attribute  : resource_name_master_attribute,
                        entity_id                       : entity_id,
                        user_null                       : user_null?1:0
                        };
    return await db_execute(app_id, sql, parameters, null, null, resource_id?false:true);
};
/**
 * 
 * @param {number}      app_id
 * @param {*}           data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_detail_data_post[]>}
 */
 const post = async (app_id, data) => {
    const sql = `INSERT INTO <DB_SCHEMA/>.app_data_resource_detail_data (json_data, date_created, date_modified, app_data_resource_detail_id,app_data_resource_master_attribute_id)
                    VALUES( :json_data, 
                            CURRENT_TIMESTAMP, 
                            NULL, 
                            :app_data_resource_detail_id, 
                            :app_data_resource_master_attribute_id)
`;
    const parameters = {json_data                               : JSON.stringify(data.json_data),
                        app_data_resource_detail_id             : data.app_data_resource_detail_id,
                        app_data_resource_master_attribute_id   : data.app_data_resource_master_attribute_id
                        };
    return await db_execute(app_id, sql, parameters);
};

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*}      data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_detail_data_update[]>}
 */
 const update = async (app_id, resource_id, data) => {
    const sql = `UPDATE <DB_SCHEMA/>.app_data_resource_detail 
                    SET json_data                                       = :json_data, 
                        app_data_resource_detail_id                     = :app_data_resource_detail_id,
                        app_data_resource_master_attribute_id           = :app_data_resource_master_attribute_id,
                        date_modified                                   = CURRENT_TIMESTAMP
                  WHERE id = :resource_id`;
    const parameters = {resource_id:                                        resource_id,
                        json_data:                                          JSON.stringify(data.json_data),
                        app_data_resource_detail_id                         :data.app_data_resource_detail_id, 
                        app_data_resource_master_attribute_id               :data.app_data_resource_master_attribute_id
                        };
    return await db_execute(app_id, sql, parameters);
};

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_detail_data_delete[]>}
 */
 const deleteRecord = async (app_id, resource_id) => {
    const sql = `DELETE FROM <DB_SCHEMA/>.app_data_resource_detail_data 
                    WHERE id = :resource_id`;
    const parameters = {resource_id: resource_id};
    return await db_execute(app_id, sql, parameters);
};
export{get, post, update, deleteRecord};