/** @module server/db/dbModelUserAccountApp */

/**@type{import('./sql/user_account_app.service.js')} */
const service = await import(`file://${process.cwd()}/server/db/sql/user_account_app.service.js`);

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {*} data
 */
const update = (app_id, resource_id, query, data) => {
    return new Promise((resolve, reject)=> {
        /**@type{import('../types.js').server_db_sql_parameter_user_account_app_updateUserAccountApp} */
        const data_update = {	app_setting_preference_direction_id: 	serverUtilNumberValue(data.app_setting_preference_direction_id),
                                app_setting_preference_arabic_script_id:serverUtilNumberValue(data.app_setting_preference_arabic_script_id),
                                app_setting_preference_timezone_id: 	serverUtilNumberValue(data.app_setting_preference_timezone_id),
                                preference_locale:					data.preference_locale
        };
        service.updateUserAccountApp(app_id, resource_id, data_update)
        .then(result=>{
            resolve(result);
        })
        .catch((/**@type{import('../types.js').server_server_error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 */
const getUserAccountApp = (app_id, resource_id) => service.getUserAccountApp(app_id, resource_id)
                                                .catch((/**@type{import('../types.js').server_server_error}*/error)=>{throw error;});
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 * @param {string} locale
 * @returns {Promise.<import('../../server/types.js').server_config_apps_with_db_columns[]>}
 */
const getUserAccountApps = async (app_id, resource_id, locale) => {
    
   
    /**@type{import('../../apps/common/src/common.js')} */
    const {commonAppsGet} = await import(`file://${process.cwd()}/apps/common/src/common.js`);
    
    const apps_db = await service.getUserAccountApps(app_id, resource_id);

    return (await commonAppsGet(app_id, app_id, locale)).filter(app=>app.APP_ID == apps_db.filter(app_db=>app_db.app_id==app.APP_ID)[0].app_id);
};

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 */
const deleteUserAccountApp = (app_id, resource_id, query) => service.deleteUserAccountApp(app_id, resource_id, serverUtilNumberValue(query.get('delete_app_id')))
                                                    .catch((/**@type{import('../types.js').server_server_error}*/error)=>{throw error;});

export {/*ADMIN + ACCESS*/
        update, getUserAccountApp,
        /*ACCESS */
        getUserAccountApps, deleteUserAccountApp};