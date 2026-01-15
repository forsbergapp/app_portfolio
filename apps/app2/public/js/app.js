/**
 * App Portfolio app
 * @module apps/app2/app
 */

/**
 * @import {common} from '../../../common_types.js'
 */

/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

 /**@type {common['CommonModuleCommon']} */
let common;

/**
 * @name appDialogueAppsShowHide
 * @description Show or hide dialogue
 * @function
 * @returns {void}
 */
const appDialogueAppsShowHide = () => {
    if (COMMON_DOCUMENT.querySelector('#apps').style.visibility=='visible' ||
        COMMON_DOCUMENT.querySelector('#apps').style.visibility==''){
        COMMON_DOCUMENT.querySelector('#apps').style.visibility='hidden';
        COMMON_DOCUMENT.querySelector('#common_app_profile_toolbar_stat').style.visibility='hidden';
    }
    else{
        COMMON_DOCUMENT.querySelector('#apps').style.visibility='visible';
        COMMON_DOCUMENT.querySelector('#common_app_profile_toolbar_stat').style.visibility='visible';
    }
};
/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {common['CommonAppEvent']} event 
 * @returns {void}
 */
const appEventClick = event => {
    const event_target_id = common.commonMiscElementId(event.target);
    switch (event_target_id){
        case 'theme_background':{
            appDialogueAppsShowHide();
            break;
        }                    
        case 'common_app_dialogues_user_menu_log_out':{
            common.commonUserLogout();
            break;
        }
        case 'common_app_dialogues_iam_start_login_button':{
            common.commonUserLogin();
            break;
        }
    }
};

/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {common['CommonAppEvent']} event
 * @returns {void} 
 */
const appEventKeyUp = event => {
    const event_target_id = common.commonMiscElementId(event.target);
    switch (event_target_id){
        case 'common_app_dialogues_iam_start_login_username':
        case 'common_app_dialogues_iam_start_login_password':{
            if (event.code === 'Enter') {
                event.preventDefault();
                common.commonUserLogin();
            }        
            break;
        }
        
    }
};

/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {common['CommonModuleCommon']} commonLib
 * @param {Object.<string,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {
    parameters;
    common = commonLib;
    COMMON_DOCUMENT.body.className = 'app_theme_sun';
    common.commonGlobalSet('app_function_session_expired', null);
    await common.commonComponentRender({
        mountDiv:   common.commonGlobalGet('app_div'),
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
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
            click:   appEventClick,
            keyup:   appEventKeyUp},
        lifeCycle:{onMounted:null}
    };
};

export{appCommonInit, appMetadata};
export default appCommonInit;