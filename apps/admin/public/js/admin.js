/**
 * Admin app
 * @module apps/admin/admin
 */
/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const path_common ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(path_common);

/**@type {import('./secure.js')} */
const app_secure = await import('./secure.js');

/**
 * Admin logout
 * @returns {void}
 */
const admin_logout_app = () => {
    common.commonUserLogout().then(() => {
        common.commonComponentRemove('secure');
        common.commonDialogueShow('LOGIN_ADMIN');
    });
};
/**
 * Admin login
 * @returns {Promise.<void>}
 */
const admin_login = async () => {
    await common.commonUserLogin(true)
    .then(()=>{
        common.commonComponentRender({
            mountDiv:   'secure',
            data:       null,
            methods:    null,
            path:       '/component/secure.js'})
        .then(()=>{
            common.commonComponentRender({
                mountDiv:   'secure_app_user_account',
                data:       null,
                methods:    null,
                path:       '/common/component/common_user_account.js'})
            .then(()=>{
                COMMON_DOCUMENT.querySelector('#common_user_menu_default_avatar').classList.add('app_role_admin');
                COMMON_DOCUMENT.querySelector('#common_user_menu_logged_in').style.display = 'none';
                COMMON_DOCUMENT.querySelector('#common_user_menu_logged_out').style.display = 'inline-block';
                app_secure.init();
            });
        });
    })
    .catch(()=>common.commonComponentRemove('secure'));
};
/**
 * Event click
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click', (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_click(event);
        }, true);
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        const list_title = common.commonElementListTitle(event.target);
        common.commonEvent('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'secure_menu_open':{
                    COMMON_DOCUMENT.querySelector('#menu').style.display = 'block';
                    break;
                }
                case 'secure_menu_close': {
                    COMMON_DOCUMENT.querySelector('#menu').style.display = 'none';
                    break;
                }
                case 'secure_menu_1':
                case 'secure_menu_2':
                case 'secure_menu_3':
                case 'secure_menu_4':
                case 'secure_menu_5':
                case 'secure_menu_6':
                case 'secure_menu_7':
                case 'secure_menu_8':
                case 'secure_menu_9':
                case 'secure_menu_10':{
                    app_secure.show_menu(parseInt(event_target_id.substring('secure_menu_'.length)));
                    break;
                }
                case 'secure_menu_11': {
                    admin_logout_app();
                    break;
                }
                case 'common_user_start_login_admin_button':{
                    admin_login();
                    break;
                }
                //common
                case 'common_toolbar_framework_js':{
                   framework_set(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                   framework_set(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                   framework_set(3);
                    break;
                }
                /**user account */
                case 'common_user_menu':
                case 'common_user_menu_logged_in':
                case 'common_user_menu_avatar':
                case 'common_user_menu_avatar_img':
                case 'common_user_menu_logged_out':
                case 'common_user_menu_default_avatar':{
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
                                                    admin:common.COMMON_GLOBAL.admin,
                                                    admin_only:common.COMMON_GLOBAL.admin_only,
                                                    user_locale:common.COMMON_GLOBAL.user_locale,
                                                    user_timezone:common.COMMON_GLOBAL.user_timezone,
                                                    user_direction:common.COMMON_GLOBAL.user_direction,
                                                    user_arabic_script:common.COMMON_GLOBAL.user_arabic_script
                                                    },
                                        methods:    {
                                                    commonSelectCurrentValueSet:common.commonSelectCurrentValueSet,
                                                   commonFFB:common.commonFFB,
                                                    commonComponentRender:common.commonComponentRender,
                                                    commonUserSessionCountdown:common.commonUserSessionCountdown,
                                                    commonMessageShow:common.commonMessageShow
                                                    },
                                        path:       '/common/component/common_dialogue_user_menu.js'})

                        .then(()=>common.commonComponentRender(
                                        {mountDiv:  'common_dialogue_user_menu_app_theme',
                                        data:       null,
                                        methods:    {
                                                    commonThemeDefaultList:common.commonThemeDefaultList, 
                                                    commonComponentRender:common.commonComponentRender, 
                                                    app_theme_update:common.commonPreferencesPostMount
                                                    },
                                        path:'/common/component/common_dialogue_user_menu_app_theme.js'}));
                    break;
                }
                default:{
                    app_secure.app_events('click', event, event_target_id, list_title);
                    break;
                }
            }
        });
    }
};
/**
 * Event change
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_change = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_change(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('change',event)
        .then(()=>app_secure.app_events('change', event, event_target_id));
    }
};
/**
 * Event keyup
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_keyup = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_keyup(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_user_start_login_admin_username':
                case 'common_user_start_login_admin_password':
                case 'common_user_start_login_admin_password_confirm':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        admin_login().catch(()=>null);
                    }
                    break;
                }
                default:
                    app_secure.app_events('keyup', event, event_target_id);
                    break;
            }
        });
    }
};
/**
 * Event keydown
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_keydown = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keydown',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_keydown(event);
        });
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('keydown',event)
        .then(()=>{
            app_secure.app_events('keydown', event, event_target_id);
        });
    }
};
/**
 * Event input
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_input = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('input',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_input(event);
        }, true);
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('input',event)
        .then(()=>{
            app_secure.app_events('input', event, event_target_id);
        });
    }
};
/**
 * Event focus
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_focus = event => {
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('focus',(/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_focus(event);
        }, true);
    }
    else{
        const event_target_id = common.commonElementId(event.target);
        common.commonEvent('focus',event)
        .then(()=>{
            app_secure.app_events('focus', event, event_target_id);
        });
    }
};

/**
 * Exception function
 * @param {Error} error
 * @returns {void}
 */
const admin_exception = (error) => {
    common.commonMessageShow('EXCEPTION', null, null, null, error);
};
/**
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const framework_set = async (framework=null) => {
    common.commonFrameworkSet(framework,
                    {   Click: app_event_click,
                        Change: app_event_change,
                        KeyDown: app_event_keydown,
                        KeyUp: app_event_keyup,
                        Focus: app_event_focus,
                        Input:app_event_input})
    .then(()=>{
        if (common.COMMON_GLOBAL.user_account_id ==null && common.COMMON_GLOBAL.admin==null)
            common.commonDialogueShow('LOGIN_ADMIN');
    });                        
};
/**
 * App init
 * @param {{app:*[],
 *          app_service:{admin_only:number, first_time:number}}} parameters 
 * @returns {Promise.<void>}
 */
const init_app = async (parameters) => {
    parameters;
    await common.commonComponentRender({  mountDiv:   common.COMMON_GLOBAL.app_div,
                                    data:       null,
                                    methods:    null,
                                    path:       '/component/app.js'});
   framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {Promise.<void>}
 */
const init = async parameters => {        
    COMMON_DOCUMENT.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = admin_exception;
    common.COMMON_GLOBAL.app_function_session_expired = admin_logout_app;
    
    common.commonInit(parameters).then((/**@type{{ app:{}[], app_service:{admin_only:number, first_time:number}}}*/decodedparameters)=>{
        init_app(decodedparameters);
    });
};
export { init };