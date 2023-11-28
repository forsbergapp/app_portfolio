/** @module server/dbapi/object/user_account_app_setting */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting.service.js`);
const user_account_app_setting_like_service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_like.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {Types.error} res
 */
const getUserSettingsByUserId = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getUserSettingsByUserId(app_id, getNumberValue(query.get('user_account_id')))
        .then((/**@type{Types.db_result_user_account_app_setting_getUserSettingsByUserId[]}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {Types.res} res
 */
const getProfileUserSetting = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUserSetting(app_id, getNumberValue(query.get('id')))
        .then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSetting[]}*/result)=>{
            if (result[0])
                resolve({items: result[0]});
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        });
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {Types.res} res
 */
const getProfileUserSettings =(app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileUserSettings(app_id, getNumberValue(query.get('id')), getNumberValue(query.get('id_current_user')))
        .then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSettings[]}*/result)=>{
            if (result)
                resolve({
                    count: result.length,
                    items: result
                });
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};

/**
 * 
 * @param {number} app_id 
 * @param {*} query
 * @param {Types.res} res
 */
const getProfileTopSetting = (app_id, query, res) =>{
    return new Promise((resolve, reject)=>{
        service.getProfileTopSetting(app_id, getNumberValue(query.get('statchoice')))
        .then((/**@type{Types.db_result_user_account_app_setting_getProfileTopSetting[]}*/result)=>{
            if (result)
                resolve({
                    count: result.length,
                    items: result
                }); 
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} res
 */
const getProfileUserSettingDetail = (app_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.getProfileUserSettingDetail(app_id, getNumberValue(query.get('user_account_id')), getNumberValue(query.get('detailchoice')))
        .then((/**@type{Types.db_result_user_account_app_setting_getProfileUserSettingDetail[]}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id
 * @param {*} query
 * @param {*} data
 */
const createUserSetting = (app_id, query, data) => {
    return new Promise((resolve, reject)=>{
        /**@type{Types.db_parameter_user_account_app_setting_createUserSetting} */
        const data_create = {	description:		data.description,
                                settings_json: 		data.settings_json,
                                user_account_id:	getNumberValue(data.user_account_id)
                            };
        const call_service = ()=> {
            service.createUserSetting(app_id, data_create)
            .then((/**@type{Types.db_result_user_account_app_setting_createUserSetting}*/result)=>{
                resolve({
                    id: result.insertId,
                    data: result
                });
            })
            .catch((/**@type{Types.error}*/error)=>reject(error));
        };
        //Check if first time
        if (getNumberValue(query.get('initial'))==1){
            service.getUserSettingsByUserId(app_id, getNumberValue(data.user_account_id))
            .then((/**@type{Types.db_result_user_account_app_setting_getUserSettingsByUserId[]}*/result)=>{
                if (result.length==0){
                    //no user settings found, ok to create initial user setting
                    call_service();
                }
                else
                    resolve({
                        id: null,
                        data: null
                    });
            })
            .catch((/**@type{Types.error}*/error)=>reject(error));
        }
        else
            call_service();
    });
	
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data 
 * @param {Types.res} res
 */
const updateUserSetting = (app_id, query, data, res) => {
    return new Promise((resolve, reject)=>{
        /**@type{Types.db_parameter_user_account_app_setting_updateUserSetting} */
        const data_update = {	description:		data.description,
                                settings_json: 		data.settings_json,
                                user_account_id:	getNumberValue(data.user_account_id)};
        service.updateUserSetting(app_id, data_update, getNumberValue(query.get('PUT_ID')))
        .then((/**@type{Types.db_result_user_account_app_setting_updateUserSetting}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {Types.res} res
 */
const deleteUserSetting = (app_id, query, res) => {
    return new Promise((resolve, reject)=>{
        service.deleteUserSetting(app_id, getNumberValue(query.get('DELETE_ID')))
        .then((/**@type{Types.db_result_user_account_app_setting_deleteUserSetting}*/result)=>{
            if (result)
                resolve(result);
            else
                import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
                    record_not_found(app_id, query.get('lang_code'), res).then((/**@type{string}*/message)=>reject(message));
                });
        })
        .catch((/**@type{Types.error}*/error)=>reject(error));
    });
};
/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data
 */
const like = (app_id, query, data) => user_account_app_setting_like_service.like(app_id, getNumberValue(query.get('user_account_id')), getNumberValue(data.user_setting_id))
                                        .catch((/**@type{Types.error}*/error)=>{throw error;});

/**
 * 
 * @param {number} app_id 
 * @param {*} query 
 * @param {*} data
 */
const unlike = (app_id, query, data) => user_account_app_setting_like_service.unlike(app_id, getNumberValue(query.get('user_account_id')), getNumberValue(data.user_setting_id))
                                            .catch((/**@type{Types.error}*/error)=>{throw error;});

export{ getUserSettingsByUserId, getProfileUserSetting, getProfileUserSettings, getProfileTopSetting,
        /*ACCESS */
        getProfileUserSettingDetail, createUserSetting, updateUserSetting, deleteUserSetting, like, unlike};