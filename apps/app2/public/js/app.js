/**
 * App Portfolio app
 * @module apps/app2/app
 */

/**
 * @import {commonMetadata,commonInitAppParameters, CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

 /**@type {CommonModuleCommon} */
let common;

/**
 * @name appDialogueAppsShowHide
 * @description Show or hide dialogue
 * @function
 * @returns {void}
 */
const appDialogueAppsShowHide = () => {
    if (COMMON_DOCUMENT.querySelector('#common_dialogue_apps').style.visibility=='visible' ||
        COMMON_DOCUMENT.querySelector('#common_dialogue_apps').style.visibility==''){
        COMMON_DOCUMENT.querySelector('#common_dialogue_apps').style.visibility='hidden';
        COMMON_DOCUMENT.querySelector('#common_profile_btn_top').style.visibility='hidden';
    }
    else{
        COMMON_DOCUMENT.querySelector('#common_dialogue_apps').style.visibility='visible';
        COMMON_DOCUMENT.querySelector('#common_profile_btn_top').style.visibility='visible';
    }
};
/**
 * @name appEventClick
 * @description App event click
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click', (/**@type{CommonAppEvent}*/event) => {
            appEventClick(event);
        }, true);
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('click',event)
        .then(()=>{
            switch (event_target_id){
                case event.target.classList.contains('common_select_option')?event_target_id:'':
                case event.target.parentNode?.classList.contains('common_select_option')?event_target_id:'':{
                    if (event_target_id == 'common_dialogue_user_menu_iam_user_app_locale_select')
                        appAppsGet();
                    if (event_target_id == 'common_dialogue_user_menu_iam_user_app_arabic_script_select')
                        appThemeUpdate();
                    break;
                }
                case 'theme_background':{
                    appDialogueAppsShowHide();
                    break;
                }                    
                //user preferences
                case 'app_theme_checkbox':{
                    appThemeUpdate(true);
                    break;
                }
                //common
                case 'common_toolbar_framework_js':{
                    appFrameworkSet(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                    appFrameworkSet(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                    appFrameworkSet(3);
                    break;
                }
                //dialogue user menu
                case 'common_iam_avatar':
                case 'common_iam_avatar_logged_in':
                case 'common_iam_avatar_avatar':
                case 'common_iam_avatar_avatar_img':
                case 'common_iam_avatar_logged_out':
                case 'common_iam_avatar_default_avatar':{
                    if (common.COMMON_GLOBAL.iam_user_id==null)
                        common.commonComponentRender({
                            mountDiv:   'common_dialogue_user_menu_app_theme',
                            data:       null,
                            methods:    {appPreferencesPostMount:appPreferencesPostMount},
                            path:       '/component/app_theme.js'});
                    break;
                }
                case 'common_dialogue_user_menu_nav_iam_user_app':{
                    common.commonComponentRender({
                            mountDiv:   'common_dialogue_user_menu_app_theme',
                            data:       null,
                            methods:    {appPreferencesPostMount:appPreferencesPostMount},
                            path:       '/component/app_theme.js'});
                    break;
                }
                case 'common_dialogue_user_menu_log_out':{
                    common.commonUserLogout();
                    appUserLogout();
                    break;
                }
                //dialogue profile info
                case 'common_profile_follow':{
                    common.commonProfileFollowLike('FOLLOW');
                    break;
                }
                case 'common_profile_like':{
                    common.commonProfileFollowLike('LIKE');
                    break;
                }
                case 'common_dialogue_iam_start_login_button':{
                    appUserLogin().catch(()=>null);
                    break;
                }
            }
        });
    }
};
/**
 * @name appEventChange
 * @description App event change
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventChange = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change', (/**@type{CommonAppEvent}*/event) => {
            appEventChange(event);
        }, true);
    }
    else
        common.commonEvent('change',event);
};
/**
 * @name appEventKeyUp
 * @description App event keyup
 * @function
 * @param {CommonAppEvent} event
 * @returns {void} 
 */
const appEventKeyUp = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup', (/**@type{CommonAppEvent}*/event) => {
            appEventKeyUp(event);
        });
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_dialogue_iam_start_login_username':
                case 'common_dialogue_iam_start_login_password':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        appUserLogin().catch(()=>null);
                    }        
                    break;
                }
                
            }
        });
    }
};
/**
 * @name appThemeUpdate
 * @description App theme update
 * @function
 * @param {boolean} toggle_theme 
 * @returns {void}
 */
const appThemeUpdate = (toggle_theme=false) => {
    let theme = '';
    if(COMMON_DOCUMENT.querySelector('#app_theme_checkbox').classList.contains('checked')){
        theme = 'app_theme_sun';
        if (toggle_theme){
            COMMON_DOCUMENT.querySelector('#app_theme_checkbox').classList.remove('checked');
            theme = 'app_theme_moon';
        }
    }
    else{
        theme = 'app_theme_moon';
        if (toggle_theme){
            COMMON_DOCUMENT.querySelector('#app_theme_checkbox').classList.add('checked');
            theme = 'app_theme_sun';
        }
    }    
    COMMON_DOCUMENT.body.className = theme;
    common.commonMiscPreferencesUpdateBodyClassFromPreferences();
};
/**
 * @name appThemeUpdateFromBody
 * @description App theme get
 * @function
 * @returns {void}
 */
 const appThemeUpdateFromBody = () => {
    if (COMMON_DOCUMENT.body.className.split(' ')[0] == 'app_theme_sun')
        COMMON_DOCUMENT.querySelector('#app_theme_checkbox').classList.add('checked');
    else
        COMMON_DOCUMENT.querySelector('#app_theme_checkbox').classList.remove('checked');
};
/**
 * @name appPreferencesPostMount
 * @description App preference post mount
 * @returns {void}
 */
 const appPreferencesPostMount = () => {
    if (COMMON_DOCUMENT.body.classList.contains('app_theme_moon'))
        COMMON_DOCUMENT.querySelector('#app_theme_checkbox').classList.remove('checked');
    common.commonMiscPreferencesUpdateBodyClassFromPreferences();
    appThemeUpdateFromBody();
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
        mountDiv:   'common_dialogue_apps',
        data:       {
                    app_id:common.COMMON_GLOBAL.app_id
                    },
        methods:    {
                    commonFFB:common.commonFFB,
                    commonMiscShowDateUpdate:common.commonMiscShowDateUpdate
                    },
        path:       '/common/component/common_dialogue_apps.js'});
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
 * @name appFrameworkSet
 * @description Sets framework
 * @function
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const appFrameworkSet = async (framework=null) =>
    await common.commonFrameworkSet(framework,appMetadata().events);
/**
 * @name appInit
 * @description Init app
 * @function
 * @param {commonInitAppParameters} parameters 
 * @returns {Promise.<void>}
 */
const appInit = async (parameters) => {
    parameters;
    appAppsGet();
    await common.commonComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       null,
        methods:    null,
        path:       '/component/app.js'})
    .then(()=>
        common.commonComponentRender({
            mountDiv:   'common_profile_search',
            data:       null,
            methods:    null,
            path:       '/common/component/common_profile_search.js'}))
    .then(()=>
        common.commonComponentRender({
            mountDiv:   'app_profile_toolbar',
            data:       null,
            methods:    null,
            path:       '/common/component/common_profile_toolbar.js'}))
    .then(()=>
        common.commonComponentRender({
            mountDiv:   'common_user_account',
            data:       null,
            methods:    null,
            path:       '/common/component/common_iam_avatar.js'}));
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {CommonModuleCommon} commonLib
 * @param {function} start
 * @param {commonInitAppParameters} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, start, parameters) => {        
    common = commonLib;
    await start();
    COMMON_DOCUMENT.body.className = 'app_theme_sun';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = appUserLogout;
    appInit(parameters);
};
/**
 * @returns {commonMetadata}
 */
const appMetadata = () =>{
    return { 
        events:{  
            Click:   appEventClick,
            Change:  appEventChange,
            KeyDown: null,
            KeyUp:   appEventKeyUp,
            Focus:   null,
            Input:   null},
        fonts:{
            font_default:   true,
            font_arabic:    true,
            font_asian:     true,
            font_prio1:     true,
            font_prio2:     true,
            font_prio3:     true
        }
    };
};

export{appCommonInit, appPreferencesPostMount, appMetadata};
export default appCommonInit;