/**
 * Map app
 * @module apps/app4/app
 */

/**
 * @import {CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const commonPath ='/common/js/common.js';
/**@type {CommonModuleCommon} */
const common = await import(commonPath);

/**
 * App exception function
 * @function
 * @param {*} error 
 * @returns {void}
 */
const appException = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};
/**
 * App event click
 * @function
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event =>{
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{CommonAppEvent}*/event) => {
            appEventClick(event);
        });
    }
    else{
        const event_target_id = common.commonMiscElementId(event.target);
        common.commonEvent('click',event)
        .then(()=>{
            switch (event_target_id){
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
                                    user_arabic_script:common.COMMON_GLOBAL.user_arabic_script},
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
                            methods:    {
                                        commonMiscThemeDefaultList:common.commonMiscThemeDefaultList,
                                        commonComponentRender:common.commonComponentRender, 
                                        app_theme_update:common.commonMiscPreferencesPostMount
                                        },
                            path:       '/common/component/common_dialogue_user_menu_app_theme.js'}));
                    break;
                }
                case 'common_dialogue_user_menu_log_out':{
                    common.commonUserLogout();
                    break;
                }
                /*Dialogue user start */
                case 'common_dialogue_iam_start_login_button':{
                    common.commonUserLogin().catch(()=>null);
                    break;
                }
                case 'common_dialogue_iam_start_identity_provider_login':{
                    const target_row = common.commonMiscElementRow(event.target);
                    const provider_element = target_row.querySelector('.common_login_provider_id');
                    if (provider_element && provider_element.textContent)
                        common.commonUserLogin(null, null, null, parseInt(provider_element.textContent));
                    break;
                }
                
            }
        });
    }
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
            Change: null,
            KeyDown: null,
            KeyUp: null,
            Focus: null,
            Input:null});
};

/**
 * Init app
 * @function
 * @returns {Promise.<void>}
 */
const appInit = async () =>{
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
        path:       '/component/app.js'});
    await common.commonComponentRender({
        mountDiv:   'common_user_account',
        data:       null,
        methods:    null,
        path:       '/common/component/common_iam_avatar.js'});
    common.commonModuleLeafletInit({mount_div:'mapid',
                                    latitude:common.COMMON_GLOBAL.client_latitude,
                                    longitude:common.COMMON_GLOBAL.client_longitude,
                                    place:common.COMMON_GLOBAL.client_place,
                                    doubleclick_event:null, 
                                    update_map:true});

};
/**
 * Init common
 * @function
 * @param {string} parameters 
 * @returns {void}
 */
const appCommonInit= parameters => {
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = common.commonUserLogout;
    common.commonInit(parameters).then(()=>{
        appInit();
    });
};
export{appCommonInit};