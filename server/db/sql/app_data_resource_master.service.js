/** @module server/db/sql */


/**@type{import('../common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number}      app_id 
 * @param {number|null} resource_id
 * @param {number|null} user_account_id
 * @param {number|null} data_app_id
 * @param {string|null} resource_name
 * @param {number|null} entity_id
 * @param {string|null} locale
 * @param {boolean|null} user_null
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_master_get[]>}
 */
const get = async (app_id, resource_id, user_account_id, data_app_id, resource_name, entity_id, locale, user_null) => {
		const sql = `SELECT adrm.id                                                 "id",
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
                                app_s.display_data                                      "app_setting_display_data",

                                (SELECT CONCAT(CONCAT('[',GROUP_CONCAT(adrm_resource.json_data,',')),']')
                                   FROM <DB_SCHEMA/>.app_data_resource_master adrm_resource
                                  WHERE adrm_resource.app_data_entity_resource_id IN
                                          (SELECT ader.id
                                             FROM <DB_SCHEMA/>.app_data_entity_resource 	ader
                                            WHERE ader.app_setting_id               = app_s.id
                                              AND ader.app_data_entity_app_id       = app_s.app_setting_type_app_id
                                              AND ader.app_data_entity_id 		= adrm.app_data_entity_resource_app_data_entity_id)
                                    AND adrm_resource.user_account_app_user_account_id IS NULL
                                    AND adrm_resource.user_account_app_app_id IS NULL) "resource_metadata"
				   FROM <DB_SCHEMA/>.app_data_resource_master adrm,
                                <DB_SCHEMA/>.app_data_entity_resource ader,
                                <DB_SCHEMA/>.app_setting              app_s
				  WHERE ader.id                                                   = adrm.app_data_entity_resource_id
                            AND ader.app_data_entity_app_id                               = adrm.app_data_entity_resource_app_data_entity_app_id
                            AND app_s.id                                                  = ader.app_setting_id
                            AND app_s.app_setting_type_app_id                             = ader.app_data_entity_app_id
                            AND (adrm.id                                                  = :resource_id OR :resource_id IS NULL)
                            AND ( (
                                  (adrm.user_account_app_user_account_id                  = :user_account_id 
                                   AND
                                   adrm.user_account_app_app_id                           = :user_account_app_id) OR :data_app_id IS NULL
                                  )
                                  OR
                                  (adrm.user_account_app_user_account_id                   IS NULL AND :user_null=1)
                                 )
                            AND (adrm.app_data_entity_resource_app_data_entity_app_id     = :data_app_id OR :data_app_id IS NULL)
                            AND (adrm.app_data_entity_resource_app_data_entity_id         = :entity_id OR :entity_id IS NULL)
                            AND (app_s.value                                              = :resource_name OR :resource_name IS NULL)`;
		const parameters = {resource_id     : resource_id,
                            user_account_id     : user_account_id,
                            user_account_app_id : user_account_id?data_app_id:null,
                            data_app_id         : data_app_id,
                            entity_id           : entity_id,
                            resource_name       : resource_name,
                            user_null           : user_null?1:0
                            };
		return await db_execute(app_id, sql, parameters, null, null, resource_id?false:true);
	};

/**
 * 
 * @param {number}      app_id
 * @param {*}           data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_master_post[]>}
 */
const post = async (app_id, data) => {
    const sql = `INSERT INTO <DB_SCHEMA/>.app_data_resource_master (json_data, 
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
    const parameters = {json_data                                   : JSON.stringify(data.json_data),
                        user_account_id                             : data.user_account_id,
                        user_account_app_id                         : data.user_account_id?data.user_account_app_id:null,
                        data_app_id                                 : data.data_app_id,
                        app_data_entity_resource_app_data_entity_id : data.app_data_entity_resource_app_data_entity_id,
                        app_data_entity_resource_id                 : data.app_data_entity_resource_id
                        };
    return await db_execute(app_id, sql, parameters);
};

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*}      data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_master_update[]>}
 */
 const update = async (app_id, resource_id, data) => {
    const sql = `UPDATE <DB_SCHEMA/>.app_data_resource_master 
                    SET json_data                                       = :json_data, 
                        user_account_app_user_account_id                = :user_account_id, 
                        user_account_app_app_id                         = :user_account_app_id, 
                        app_data_entity_resource_app_data_entity_app_id = app_data_entity_resource_app_data_entity_app_id,
                        app_data_entity_resource_app_data_entity_id     = :app_data_entity_resource_app_data_entity_id, 
                        app_data_entity_resource_id                     = :app_data_entity_resource_id
                  WHERE id = :resource_id
                    AND ((user_account_app_user_account_id              = :user_account_id AND
                          user_account_app_app_id                       = :user_account_app_id) OR :user_account_id IS NUL)
                    AND (app_data_entity_resource_app_data_entity_app_id   = :data_app_id OR :data_app_id IS NULL)`;
    const parameters = {resource_id                                     : resource_id,
                        json_data                                       : JSON.stringify(data.json_data),
                        user_account_id                                 : data.user_account_id,
                        user_account_app_id                             : data.user_account_id?data.data_app_id:null,
                        data_app_id                                     : data.data_app_id,
                        app_data_entity_resource_app_data_entity_id     : data.app_data_entity_resource_app_data_entity_id,
                        app_data_entity_resource_id                     : data.app_data_entity_resource_id
                        };
    return await db_execute(app_id, sql, parameters);
};

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_resource_master_delete[]>}
 */
 const deleteRecord = async (app_id, resource_id, data) => {
    const sql = `DELETE FROM <DB_SCHEMA/>.app_data_resource_master 
                    WHERE id = :resource_id
                      AND ((user_account_app_user_account_id                 = :user_account_id AND
                            user_account_app_app_id                          = :user_account_app_id) OR :user_account_id IS NULL)
                      AND (app_data_entity_resource_app_data_entity_app_id   = :data_app_id OR :data_app_id IS NULL)`;
    const parameters = {resource_id        : resource_id,
                        user_account_id    : data.user_account_id,
                        user_account_app_id: data.user_account_id?data.data_app_id:null,
                        data_app_id        : data.data_app_id};
    return await db_execute(app_id, sql, parameters);
};
export{get, post, update, deleteRecord};