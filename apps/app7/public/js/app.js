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
        mountDiv:   common.commonGlobalGet('Parameters').app_div,
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
        common.commonComponentRender({
            mountDiv:   'mapid',
            data:       { 
                        longitude:common.commonGlobalGet('Data').client_longitude,
                        latitude:common.commonGlobalGet('Data').client_latitude
                        },
            methods:    null,
            path:       '/common/component/common_map.js'});
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {common['CommonModuleCommon']} commonLib
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib) => {
    common = commonLib;
    common.commonGlobalSet({key:'Functions', name:'app_function_session_expired', value:null});
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