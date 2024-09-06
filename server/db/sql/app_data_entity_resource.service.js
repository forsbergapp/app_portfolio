/** @module server/db/sql/app_data_entity_resource */


/**@type{import('../common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} 		app_id 
 * @param {number|null} resource_id 
 * @param {number|null} data_app_id
 * @param {string|null} resource_name
 * @param {number|null} entity_id
 * @param {string|null} locale
 * @returns {Promise.<import('../../../types.js').db_result_app_data_entity_resource_get[]>}
 */
const get = async (app_id, resource_id, data_app_id, resource_name, entity_id, locale) => {
		const sql = `SELECT ader.id 										"id",
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
		const parameters = {resource_id: resource_id,
							data_app_id: data_app_id,
							entity_id: entity_id,
							resource_name: resource_name
							};
		return await db_execute(app_id, sql, parameters, null, null);
	};
export{get};