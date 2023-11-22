/** @module server/dbapi/object/user_account_app_setting */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getUserSettingsByUserId = (app_id, query) =>{
    return new Promise((resolve, reject)=>{
        service.getUserSettingsByUserId(app_id, getNumberValue(query.get('user_account_id')))
        .then((/**@type{Types.db_result_user_account_app_setting_getUserSettingsByUserId[]}*/result)=>{
            if (result)
                resolve({
                    count: result.length,
                    items: result
                });
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                    record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getProfileUserSetting = (app_id, query) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUserSetting(app_id, getNumberValue(query.get('id')))
        .then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSetting[]}*/result)=>{
            if (result[0])
                resolve({items: result[0]});
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                    record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 */
const getProfileUserSettings =(app_id, query) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUserSettings(app_id, getNumberValue(query.get('id')), getNumberValue(query.get('id_current_user')))
        .then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSettings[]}*/result)=>{
            if (result)
                resolve({
                    count: result.length,
                    items: result
                });
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                    record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getProfileTopSetting = (app_id, query) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileTopSetting(app_id, getNumberValue(query.get('statchoice')))
        .then((/**@type{Types.db_result_user_account_app_setting_getProfileTopSetting[]}*/result)=>{
            if (result)
                resolve({
                    count: result.length,
                    items: result
                }); 
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found_promise}) => {
                    record_not_found_promise(app_id, query.get('lang_code')).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip 
 * @param {string} user_agent
 * @param {*} data 
 * @returns 
 */
const insertUserSettingView =(app_id, ip, user_agent, data) =>{
    return new Promise((resolve)=>{
        /**@type{Types.db_parameter_user_account_app_setting_view_insertUserSettingView} */
        const data_insert = {   client_ip:          ip,
                                client_user_agent:  user_agent,
                                client_longitude:   data.client_longitude,
                                client_latitude:    data.client_latitude,
                                user_account_id:    getNumberValue(data.user_account_id),
                                user_setting_id:    getNumberValue(data.user_setting_id) ?? 0};
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_view.service.js`).then(({ insertUserSettingView})=>{
            insertUserSettingView(app_id, data_insert)
            .then((/**@type{Types.db_result_user_account_app_setting_view_insertUserSettingView}*/result)=>{
                resolve({
                    count: result.affectedRows,
                    items: Array(result)
                });
            });
        });
    });
};
                    

export{ getUserSettingsByUserId, getProfileUserSetting, getProfileUserSettings, getProfileTopSetting,
        insertUserSettingView};