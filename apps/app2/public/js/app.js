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
    if (COMMON_DOCUMENT.querySelector('#common_app_dialogues_apps').style.visibility=='visible' ||
        COMMON_DOCUMENT.querySelector('#common_app_dialogues_apps').style.visibility==''){
        COMMON_DOCUMENT.querySelector('#common_app_dialogues_apps').style.visibility='hidden';
        COMMON_DOCUMENT.querySelector('#common_app_profile_toolbar_stat').style.visibility='hidden';
    }
    else{
        COMMON_DOCUMENT.querySelector('#common_app_dialogues_apps').style.visibility='visible';
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
            if (event_target_id == 'common_app_dialogues_user_menu_iam_user_app_arabic_script_select')
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
        //dialogue user menu
        case 'common_app_iam_user_menu':
        case 'common_app_iam_user_menu_logged_in':
        case 'common_app_iam_user_menu_avatar':
        case 'common_app_iam_user_menu_avatar_img':
        case 'common_app_iam_user_menu_logged_out':
        case 'common_app_iam_user_menu_default_avatar':{
            if (common.commonGlobalGet('iam_user_id')==null)
                common.commonComponentRender({
                    mountDiv:   'common_app_dialogues_user_menu_app_theme',
                    data:       null,
                    methods:    {appPreferencesPostMount:appPreferencesPostMount},
                    path:       '/component/app_theme.js'});
            break;
        }
        case 'common_app_dialogues_user_menu_nav_iam_user_app':{
            common.commonComponentRender({
                    mountDiv:   'common_app_dialogues_user_menu_app_theme',
                    data:       null,
                    methods:    {appPreferencesPostMount:appPreferencesPostMount},
                    path:       '/component/app_theme.js'});
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
        mountDiv:   'common_app_dialogues_apps',
        data:       {
                    app_id:common.commonGlobalGet('app_id')
                    },
        methods:    null,
        path:       '/common/component/common_app_dialogues_apps.js'});
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

export{appCommonInit, appPreferencesPostMount, appMetadata};
export default appCommonInit;