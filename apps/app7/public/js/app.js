/**
 * Map app
 * @module apps/app7/app
 */

/**
 * @import {commonMetadata, CommonAppEvent, CommonModuleCommon, COMMON_DOCUMENT} from '../../../common_types.js'
 */

/**@type{COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

/**@type {CommonModuleCommon} */
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
 * @param {CommonAppEvent} event 
 * @returns {void}
 */
const appEventClick = event =>{
    const event_target_id = common.commonMiscElementId(event.target);
    switch (event_target_id){
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
                    methods:    {
                                commonMiscThemeDefaultList:common.commonMiscThemeDefaultList,
                                commonComponentRender:common.commonComponentRender, 
                                app_theme_update:common.commonMiscPreferencesPostMount
                                },
                    path:       '/common/component/common_dialogue_user_menu_app_theme.js'});
            break;
        }
        case 'common_dialogue_user_menu_nav_iam_user_app':{
            common.commonComponentRender({
                    mountDiv:   'common_dialogue_user_menu_app_theme',
                    data:       null,
                    methods:    {
                                commonMiscThemeDefaultList:common.commonMiscThemeDefaultList,
                                commonComponentRender:common.commonComponentRender, 
                                app_theme_update:common.commonMiscPreferencesPostMount
                                },
                    path:       '/common/component/common_dialogue_user_menu_app_theme.js'});
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
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       null,
        methods:    null,
        path:       '/component/app.js'});
        common.commonComponentRender({
            mountDiv:   'mapid',
            data:       { 
                        data_app_id :common.COMMON_GLOBAL.app_common_app_id,
                        longitude:common.COMMON_GLOBAL.client_longitude,
                        latitude:common.COMMON_GLOBAL.client_latitude
                        },
            methods:    {
                        commonComponentRender:common.commonComponentRender,
                        commonComponentRemove:common.commonComponentRemove,
                        commonWindowFromBase64:common.commonWindowFromBase64,
                        commonMiscListKeyEvent:common.commonMiscListKeyEvent,
                        commonMiscElementRow:common.commonMiscElementRow,
                        commonMiscElementId:common.commonMiscElementId,
                        commonUserLocale:common.commonUserLocale,
                        commonFFB:common.commonFFB
                        },
            path:       '/common/component/common_map.js'});
};
/**
 * @name appCommonInit
 * @description Init common
 * @function
 * @param {CommonModuleCommon} commonLib
 * @param {Object.<String,*>} parameters 
 * @returns {Promise.<void>}
 */
const appCommonInit = async (commonLib, parameters) => {
    parameters;
    common = commonLib;
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = appException;
    common.COMMON_GLOBAL.app_function_session_expired = null;
    appInit();
};
/**
 * @name appMetadata
 * @description App metadata for event delegataion and lifecycle events
 * @function
 * @returns {commonMetadata}
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