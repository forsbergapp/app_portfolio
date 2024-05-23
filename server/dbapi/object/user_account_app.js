/** @module server/dbapi/object/user_account_app */

/**@type{import('../../dbapi/sql/user_account_app.service.js')} */
const service = await import(`file://${process.cwd()}/server/dbapi/sql/user_account_app.service.js`);

/**@type{import('../../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id
 * @param {number} resource_id
 * @param {*} query
 * @param {*} data
 */
const update = (app_id, resource_id, query, data) => {
    return new Promise((resolve, reject)=> {
        /**@type{import('../../../types.js').db_parameter_user_account_app_updateUserAccountApp} */
        const data_update = {	app_setting_preference_direction_id: 	getNumberValue(data.app_setting_preference_direction_id),
                                app_setting_preference_arabic_script_id:getNumberValue(data.app_setting_preference_arabic_script_id),
                                app_setting_preference_timezone_id: 	getNumberValue(data.app_setting_preference_timezone_id),
                                preference_locale:					data.preference_locale
        };
        service.updateUserAccountApp(app_id, resource_id, data_update)
        .then((/**@type{import('../../../types.js').db_result_user_account_app_updateUserAccountApp}*/result)=>{
            resolve(result);
        })
        .catch((/**@type{import('../../../types.js').error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 */
const getUserAccountApp = (app_id, resource_id) => service.getUserAccountApp(app_id, resource_id)
                                                .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});
/**
 * 
 * @param {number} app_id 
 * @param {number} resource_id
 */
const getUserAccountApps = async (app_id, resource_id) => {
    
    /**@type{import('../../config.service.js')} */
    const {ConfigGet, ConfigGetApps} = await import(`file://${process.cwd()}/server/config.service.js`);
    
    const fs = await import('node:fs');

    /**@type{import('../../../types.js').db_result_user_account_app_getUserAccountApps_with_app_registry[]}*/
    const apps_db = await service.getUserAccountApps(app_id, resource_id);
    const apps_registry = ConfigGetApps();
    /**@type{import('../../../types.js').config_apps_with_db_columns[]}*/
    const apps = apps_registry.reduce(( /**@type{import('../../../types.js').config_apps_record} */app, /**@type {import('../../../types.js').config_apps_record}*/current)=> 
                                        app.concat({APP_ID:current.APP_ID,
                                                    NAME:current.NAME,
                                                    LOGO:current.PATH + current.LOGO,
                                                    SUBDOMAIN:current.SUBDOMAIN
                                                    }) , []);    
    for (const app of apps_db){
        app.NAME = apps.filter(app_registry=>app_registry.APP_ID == app.app_id)[0].NAME;
        app.PROTOCOL = ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?'https://':'http://';
        app.SUBDOMAIN = apps.filter(app_registry=>app_registry.APP_ID == app.app_id)[0].SUBDOMAIN;
        app.HOST = ConfigGet('SERVER', 'HOST');
        app.PORT = getNumberValue(ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?ConfigGet('SERVER', 'HTTPS_PORT'):ConfigGet('SERVER', 'HTTP_PORT'));
        app.LOGO = apps.filter(app_registry=>app_registry.APP_ID == app.app_id)[0].LOGO;
        const image = await fs.promises.readFile(`${process.cwd()}${app.LOGO}`);
        /**@ts-ignore */
        app.LOGO = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
        app.APP_ID = app.app_id;
    }
    return apps_db;        
};

/**
 * 
 * @param {number} app_id
 * @param {*} query
 */
const deleteUserAccountApp = (app_id, query) => service.deleteUserAccountApp(app_id, getNumberValue(query.get('delete_user_accound_id')), getNumberValue(query.get('delete_app_id')))
                                                    .catch((/**@type{import('../../../types.js').error}*/error)=>{throw error;});

export {/*ADMIN + ACCESS*/
        update, getUserAccountApp,
        /*ACCESS */
        getUserAccountApps, deleteUserAccountApp};