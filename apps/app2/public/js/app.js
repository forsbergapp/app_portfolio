/**
 * App Portfolio app
 * @module apps/app1/app
 */

/**
 * @import {commonInitAppParameters, CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='/common/js/common.js';
 /**@type {CommonModuleCommon} */
const common = await import(commonPath);

/**
 * Show or hide dialogue
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
 * App event click
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
                    if (event_target_id == 'common_dialogue_user_menu_user_locale_select')
                        appAppsGet();
                    if (event_target_id == 'common_dialogue_user_menu_user_arabic_script_select')
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
                        common.commonComponentRender({
                            mountDiv:   'common_dialogue_user_menu',
                            data:       {
                                        app_id:common.COMMON_GLOBAL.app_id,
                                        user_account_id:common.COMMON_GLOBAL.user_account_id,
                                        common_app_id:common.COMMON_GLOBAL.common_app_id,
                                        data_app_id:common.COMMON_GLOBAL.common_app_id,
                                        username:common.COMMON_GLOBAL.user_account_username,
                                        token_exp:common.COMMON_GLOBAL.token_exp,
                                        token_iat:common.COMMON_GLOBAL.token_iat,
                                        token_timestamp: common.COMMON_GLOBAL.token_timestamp,
                                        admin:common.COMMON_GLOBAL.iam_user_name,
                                        user_locale:common.COMMON_GLOBAL.user_locale,
                                        user_timezone:common.COMMON_GLOBAL.user_timezone,
                                        user_direction:common.COMMON_GLOBAL.user_direction,
                                        user_arabic_script:common.COMMON_GLOBAL.user_arabic_script
                                        },
                            methods:    {
                                        commonMiscSelectCurrentValueSet:common.commonMiscSelectCurrentValueSet,
                                        commonFFB:common.commonFFB,
                                        commonComponentRender:common.commonComponentRender,
                                        commonUserSessionCountdown:common.commonUserSessionCountdown,
                                        commonMessageShow:common.commonMessageShow
                                        },
                            path:       '/common/component/common_dialogue_user_menu.js'})
                        .then(()=>
                            common.commonComponentRender({
                                mountDiv:   'common_dialogue_user_menu_app_theme',
                                data:       null,
                                methods:    {appPreferencesPostMount:appPreferencesPostMount},
                                path:       '/component/app_theme.js'}));
                        break;
                    }
                case 'common_dialogue_user_menu_log_out':{
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
                case 'common_dialogue_iam_start_identity_provider_login':{
                    const target_row = common.commonMiscElementRow(event.target);
                    const provider_element = target_row.querySelector('.common_login_provider_id');
                    if (provider_element && provider_element.textContent)
                        appUserLogin(null, null, null, parseInt(provider_element.textContent));
                    break;
                }
            }
        });
    }
};
/**
 * App event change
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
 * App event keyup
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
                //dialogue verify
                case 'common_dialogue_iam_verify_verification_char1':
                case 'common_dialogue_iam_verify_verification_char2':
                case 'common_dialogue_iam_verify_verification_char3':
                case 'common_dialogue_iam_verify_verification_char4':
                case 'common_dialogue_iam_verify_verification_char5':{
                    common.commonUserVerifyCheckInput( COMMON_DOCUMENT.querySelector(`#${event_target_id}`), 
                                                    'common_dialogue_iam_verify_verification_char' + (Number(event_target_id.substring(event_target_id.length-1))+1), appUserLogin);
                    break;
                }
                case 'common_dialogue_iam_verify_verification_char6':{
                    common.commonUserVerifyCheckInput(COMMON_DOCUMENT.querySelector(`#${event_target_id}`), '', appUserLogin);
                    break;
                }
            }
        });
    }
};
/**
 * App theme update
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
 * App theme get
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
 * App preference post mount
 * @returns {void}
 */
 const appPreferencesPostMount = () => {
    COMMON_DOCUMENT.body.className ='';
    if (COMMON_DOCUMENT.querySelector('#app_theme_checkbox').classList.contains('checked'))
        COMMON_DOCUMENT.body.className = 'app_theme_sun';
    else
        COMMON_DOCUMENT.body.className = 'app_theme_moon';
    common.commonMiscPreferencesUpdateBodyClassFromPreferences();
    appThemeUpdateFromBody();
};

/**
 * User login app
 * @function
 * @param {boolean|null} admin 
 * @param {string|null} username_verify
 * @param {string|null} password_verify
 * @param {number|null} provider_id 
 * @returns {Promise.<void>}
 */
const appUserLogin = async (admin=false, username_verify=null, password_verify=null, provider_id=null) =>{
    common.commonUserLogin(admin, username_verify, password_verify, provider_id)
    .then(()=>appAppsGet());
};
/**
 * User logout app
 * @function
 * @returns {Promise.<void>}
 */
 const appUserLogout = async () =>{
    common.commonUserLogout()
    .then(()=>appAppsGet());
};

/**
 * Get apps
 * @function
 * @returns {void}
 */
const appAppsGet = () => {
    common.commonComponentRender({
        mountDiv:   'common_dialogue_apps',
        data:       {
                    common_app_id:common.COMMON_GLOBAL.common_app_id,
                    app_id:common.COMMON_GLOBAL.app_id,
                    app_copyright:common.COMMON_GLOBAL.app_copyright,
                    app_email:common.COMMON_GLOBAL.app_email,
                    app_link_url:common.COMMON_GLOBAL.app_link_url,
                    app_link_title:common.COMMON_GLOBAL.app_link_title,
                    info_link_policy_name:common.COMMON_GLOBAL.info_link_policy_name,
                    info_link_disclaimer_name:common.COMMON_GLOBAL.info_link_disclaimer_name,
                    info_link_terms_name:common.COMMON_GLOBAL.info_link_terms_name
                    },
        methods:    {commonFFB:common.commonFFB},
        path:       '/common/component/common_dialogue_apps.js'});
};
/**
 * App exception function
 * @function
 * @param {Error} error 
 * @returns {void}
 */
const appException = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};
/**
 * Sets framework
 * @function
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const appFrameworkSet = async (framework=null) => {
    await common.commonFrameworkSet(framework,
        {   Click: appEventClick,
            Change: appEventChange,
            KeyDown: null,
            KeyUp: appEventKeyUp,
            Focus: null,
            Input:null});
};
/**
 * Init app
 * @function
 * @param {commonInitAppParameters} parameters 
 * @returns {Promise.<void>}
 */
const appInit = async (parameters) => {
    parameters;
    appFrameworkSet();
    //common app component
    await common.commonComponentRender({mountDiv:   'common_app',
                                        data:       {
                                                    framework:      common.COMMON_GLOBAL.app_framework,
                                                    font_default:   true,
                                                    font_arabic:    true,
                                                    font_asian:     true,
                                                    font_prio1:     true,
                                                    font_prio2:     true,
                                                    font_prio3:     true
                                                    },
                                        methods:    null,
                                        path:       '/common/component/common_app.js'});
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

    appAppsGet();
    
    const user = common.commonWindowLocationPathname(0).split('/profile/')[1];
    if (user && user !='') {
        //show profile for user entered in url
        common.commonProfileShow(null, user);
    }
   
};
/**
 * Init common
 * @function
 * @param {string} parameters 
 * @returns {void}
 */
const appCommonInit= parameters => {
    COMMON_DOCUMENT.body.className = 'app_theme_sun';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = appUserLogout;
    common.commonInit(parameters).then(decodedparameters=>{
        appInit(decodedparameters);
    });
};
export{appCommonInit, appPreferencesPostMount};