/**
 * Admin app
 * @module apps/admin/admin
 */
/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

const path_common ='common';
/**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(path_common);
const path_app_secure ='app_secure';
/**
 * @type {{ delete_globals:function, 
 *          show_menu:function, 
 *          app_events:function, 
 *          init:function}} 
 */
const app_secure = await import(path_app_secure);

/**
 * Admin logout
 * @returns {void}
 */
const admin_logout_app = () => {
    common.commonUserLogout().then(() => {
        common.commonComponentRemove('admin_secure');
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
            mountDiv:   'admin_secure',
            data:       null,
            methods:    null,
            path:       '/component/admin_secure.js'})
        .then(()=>{
            common.commonComponentRender({
                mountDiv:   'app_user_account',
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
    .catch(()=>common.commonComponentRemove('admin_secure'));
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
                case 'menu_open':{
                    COMMON_DOCUMENT.querySelector('#menu').style.display = 'block';
                    break;
                }
                case 'menu_close': {
                    COMMON_DOCUMENT.querySelector('#menu').style.display = 'none';
                    break;
                }
                case 'menu_1':
                case 'menu_2':
                case 'menu_3':
                case 'menu_4':
                case 'menu_5':
                case 'menu_6':
                case 'menu_7':
                case 'menu_8':
                case 'menu_9':
                case 'menu_10':{
                    app_secure.show_menu(parseInt(event_target_id.substring(5)));
                    break;
                }
                case 'menu_11': {
                    admin_logout_app();
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
                /**Dialogue user start */
                case 'common_user_start_identity_provider_login':{
                    const target_row = common.commonElementRow(event.target);
                    const provider_element = target_row.querySelector('.common_login_provider_id');
                    if (provider_element && provider_element.textContent)
                        common.commonUserLogin(null, null, null, parseInt(provider_element.textContent));
                    break;
                }
                case 'common_user_start_login_button':
                case 'common_user_start_login_admin_button':{
                    admin_login();
                    break;
                }
                /**Dialogue profile */
                case 'common_dialogue_profile_home':{
                    common.commonProfileStat(1);
                    break;
                }
                case 'common_profile_stat_row1_1':{
                    common.commonProfileStat(1);
                    break;
                }
                case 'common_profile_stat_row1_2':{
                    common.commonProfileStat(2);
                    break;
                }
                case 'common_profile_stat_row1_3':{
                    common.commonProfileStat(3);
                    break;
                }
                case 'common_profile_follow':{
                    common.commonProfileFollowLike('FOLLOW');
                    break;
                }
                case 'common_profile_like':{
                    common.commonProfileFollowLike('LIKE');
                    break;
                }
                case 'common_profile_main_btn_following':{
                    common.commonProfileDetail(1);
                    break;
                }
                case 'common_profile_main_btn_followed':{
                    common.commonProfileDetail(2);
                    break;
                }
                case 'common_profile_main_btn_likes':{
                    common.commonProfileDetail(3);
                    break;
                }
                case 'common_profile_main_btn_liked':
                case 'common_profile_main_btn_liked_heart':
                case 'common_profile_main_btn_liked_users':{
                    common.commonProfileDetail(4);
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
                case 'common_user_start_login_username':
                case 'common_user_start_login_password':
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
    await common.commonComponentRender({  mountDiv:   common.COMMON_GLOBAL.app_div,
                                    data:       null,
                                    methods:    null,
                                    path:       '/component/app.js'});
    if (parameters.app_service.admin_only == 0)
        for (const parameter of parameters.app) {
            if (parameter['MODULE_EASY.QRCODE_WIDTH'])
                common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(parameter['MODULE_EASY.QRCODE_WIDTH']);
            if (parameter['MODULE_EASY.QRCODE_HEIGHT'])
                common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(parameter['MODULE_EASY.QRCODE_HEIGHT']);
            if (parameter['MODULE_EASY.QRCODE_COLOR_DARK'])
                common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = parameter['MODULE_EASY.QRCODE_COLOR_DARK'];
            if (parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'])
                common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'];
        }
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