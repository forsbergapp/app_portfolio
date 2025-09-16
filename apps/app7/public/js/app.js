/**
 * Map app
 * @module apps/app7/app
 */

/**
 * @import {common} from '../../../common_types.js'
 */

/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

/**@type {common['CommonModuleCommon']} */
let common;

/**
 * @name appException
 * @description App exception function
 * @function
 * @param {*} error 
 * @returns {void}
 */
const appException = error => {
    common.commonMessageShow('EXCEPTION', null, null, error);
};
/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventClick = event =>{
    const event_target_id = common.commonMiscElementId(event.target);
    switch (event_target_id){
        case 'common_app_dialogues_user_menu_log_out':{
            common.commonUserLogout();
            break;
        }
        /*Dialogue user start */
        case 'common_app_dialogues_iam_start_login_button':{
            common.commonUserLogin().catch(()=>null);
            break;
        }
    }
};

/**
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () =>{
    await common.commonComponentRender({
        mountDiv:   common.commonGlobalGet('app_div'),
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
        common.commonComponentRender({
            mountDiv:   'mapid',
            data:       { 
                        data_app_id :common.commonGlobalGet('app_common_app_id'),
                        longitude:common.commonGlobalGet('client_longitude'),
                        latitude:common.commonGlobalGet('client_latitude')
                        },
            methods:    null,
            path:       '/common/component/common_map.js'});
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {common['CommonModuleCommon']} commonLib
 * @param {Object.<String,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {
    parameters;
    common = commonLib;
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.commonGlobalSet('app_function_exception', appException);
    common.commonGlobalSet('app_function_session_expired', null);
    appInit();
};
/**
 * @name appMetadata
 * @description App metadata for event delegataion and lifecycle events
 * @function
 * @returns {common['commonMetadata']}
 */
const appMetadata = () =>{
    return { 
        events:{  
            click:   appEventClick},
        lifeCycle:{onMounted:null}
    };
};
export{appCommonInit, appMetadata};
export default appCommonInit;