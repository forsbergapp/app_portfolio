/** @module server/dbapi/component/user_account_app */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id
 * @param {*} query
 * @param {*} data
 * @returns 
 */
const update = (app_id, query, data) => {
    return new Promise((resolve)=> {
        /**@type{Types.db_parameter_user_account_app_updateUserAccountApp} */
        const data_update = {	setting_preference_direction_id: 	getNumberValue(data.setting_preference_direction_id),
                                setting_preference_arabic_script_id:getNumberValue(data.setting_preference_arabic_script_id),
                                setting_preference_timezone_id: 	getNumberValue(data.setting_preference_timezone_id),
                                preference_locale:					data.preference_locale
        };
        service.updateUserAccountApp(app_id, getNumberValue(query.get('PATCH_ID')), data_update)
        .then((/**@type{Types.db_result_user_account_app_updateUserAccountApp}*/result)=>{
            resolve({items: result});
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @returns 
 */
const getUserAccountApp = (app_id, query) => service.getUserAccountApp(app_id, getNumberValue(query.get('user_account_id')));

export {update, getUserAccountApp};