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
    if (COMMON_DOCUMENT.querySelector('#common_apps').style.visibility=='visible' ||
        COMMON_DOCUMENT.querySelector('#common_apps').style.visibility==''){
        COMMON_DOCUMENT.querySelector('#common_apps').style.visibility='hidden';
        COMMON_DOCUMENT.querySelector('#common_app_profile_toolbar_stat').style.visibility='hidden';
    }
    else{
        COMMON_DOCUMENT.querySelector('#common_apps').style.visibility='visible';
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
        case event.target.classList.contains('common_select_option')?event_target_id:'':
        case event.target.parentNode?.classList.contains('common_select_option')?event_target_id:'':{
            if (event_target_id == 'common_app_dialogues_user_menu_iam_user_app_locale_select')
                appAppsGet();
            break;
        }
        case 'theme_background':{
            appDialogueAppsShowHide();
            break;
        }                    
        case 'common_app_dialogues_user_menu_log_out':{
            common.commonUserLogout();
            appUserLogout();
            break;
        }
        //dialogue profile info
        case 'common_app_dialogues_profile_info_follow':{
            common.commonProfileFollowLike('FOLLOW');
            break;
        }
        case 'common_app_dialogues_profile_info_like':{
            common.commonProfileFollowLike('LIKE');
            break;
        }
        case 'common_app_dialogues_iam_start_login_button':{
            appUserLogin().catch(()=>null);
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
                appUserLogin().catch(()=>null);
            }        
            break;
        }
        
    }
};

/**
 * @name appUserLogin
 * @description User login app
 * @function
 * @returns {Promise.<void>}
 */
const appUserLogin = async () =>{
    common.commonUserLogin()
    .then(()=>appAppsGet());
};
/**
 * @name appUserLogout
 * @description User logout app
 * @function
 * @returns {Promise.<void>}
 */
 const appUserLogout = async () =>appAppsGet();

/**
 * @name appAppsGet
 * @description Get apps
 * @function
 * @returns {void}
 */
const appAppsGet = () => {
    common.commonComponentRender({
        mountDiv:   'common_apps',
        data:       {
                    app_id:common.commonGlobalGet('app_id')
                    },
        methods:    null,
        path:       '/common/component/common_apps.js'});
};
/**
 * @name appException
 * @description App exception function
 * @function
 * @param {Error} error 
 * @returns {void}
 */
const appException = error => {
    common.commonMessageShow('EXCEPTION', null, null, error);
};
/**
 * @name appInit
 * @description Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () => {
    await common.commonComponentRender({
        mountDiv:   common.commonGlobalGet('app_div'),
        data:       null,
        methods:    null,
        path:       '/component/app.js'})
        .then(()=>appAppsGet());
        
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
    common.commonGlobalSet('app_function_exception', appException);
    common.commonGlobalSet('app_function_session_expired', appUserLogout);
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
            click:   appEventClick,
            keyup:   appEventKeyUp},
        lifeCycle:{onMounted:null}
    };
};

export{appCommonInit, appMetadata};
export default appCommonInit;