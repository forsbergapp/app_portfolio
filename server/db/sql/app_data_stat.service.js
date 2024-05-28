/** @module server/db/sql */


/**@type{import('../common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id 
 * @param {number|null} data_app_id 
 * @param {string|null} resource_name_entity
 * @param {string|null} locale
 * @returns {Promise.<import('../../../types.js').db_result_app_data_stat_get[]>}
 */
const get = async (app_id, resource_id, data_app_id, resource_name_entity, locale) => {
		const sql = `SELECT ads.id                                                  "id",
                            ads.app_id                                              "app_id",
							ads.json_data                                           "json_data",
                            ads.date_created                                        "date_created",
                            
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
		const parameters = {resource_id         : resource_id,
							data_app_id         : data_app_id,
                            resource_name_entity: resource_name_entity};
		return await db_execute(app_id, sql, parameters, null, null, resource_id?false:true);
	};
/**
 * 
 * @param {number}      app_id
 * @param {*}           data
 * @returns {Promise.<import('../../../types.js').db_result_app_data_stat_post[]>}
 */
const post = async (app_id, data) => {
    const sql = `INSERT INTO <DB_SCHEMA/>.app_data_stat (   app_id,
                                                            json_data, 
                                                            date_created,
                                                            user_account_app_user_account_id,
                                                            user_account_app_app_id,
                                                            app_data_resource_master_id,
                                                            app_data_entity_resource_id,
                                                            app_data_entity_resource_app_data_entity_app_id,
                                                            app_data_entity_resource_app_data_entity_id)
                    VALUES( :json_data, 
                            :date_created,
                            :user_account_app_user_account_id,
                            :user_account_app_app_id,
                            :app_data_resource_master_id,
                            :app_data_entity_resource_id,
                            :app_data_entity_resource_app_data_entity_app_id,
                            :app_data_entity_resource_app_data_entity_id)
`;
    const parameters = {json_data:                                          JSON.stringify(data.json_data),
                        user_account_app_user_account_id:                   data.user_account_app_user_account_id,
                        user_account_app_app_id:                            data.user_account_app_app_id,
                        app_data_resource_master_id:                        data.app_data_resource_master_id,
                        app_data_entity_resource_id:                        data.app_data_entity_resource_id,
                        app_data_entity_resource_app_data_entity_app_id:    data.app_data_entity_resource_app_data_entity_app_id,
                        app_data_entity_resource_app_data_entity_id:        data.app_data_entity_resource_app_data_entity_id
                        };
    return await db_execute(app_id, sql, parameters);
};
export{get, post};