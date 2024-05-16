/**@type{{body:{className:string},
 *        querySelector:function,
 *        querySelectorAll:function}} 
 */
 const AppDocument = document;
/**
 * @typedef {object} AppEvent
 * @property {string} code
 * @property {function} preventDefault
 * @property {object} target
 * @property {string} target.id
 * @property {string} target.value
 */

/**@ts-ignore */
const common = await import('common');
/**@ts-ignore */
const app_secure = await import('app_secure');

/**
 * Admin log off
 * @returns {void}
 */
const admin_logoff_app = () => {
    common.user_logoff().then(() => {
        common.ComponentRemove('admin_secure');
        common.show_common_dialogue('LOGIN_ADMIN');
    });
};
/**
 * Admin login
 * @returns {Promise.<void>}
 */
const admin_login = async () => {
    let system_admin = false;
    if (AppDocument.querySelector('#common_user_start_nav .common_user_start_selected').id == 'common_user_start_login_system_admin')
        system_admin = true;
    await common.ComponentRender('admin_secure', {}, '/component/admin_secure.js')
    .then(()=>common.ComponentRender('app_user_account', {},'/common/component/user_account.js'));
    await common.user_login(system_admin)
    .then(()=>{
        app_secure.init();
    })
    .catch(()=>common.ComponentRemove('admin_secure'));
};
/**
 * Event click
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click', (/**@type{AppEvent}*/event) => {
            app_event_click(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        const list_title = common.element_list_title(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'menu_open':{
                    AppDocument.querySelector('#menu').style.display = 'block';
                    break;
                }
                case 'menu_close': {
                    AppDocument.querySelector('#menu').style.display = 'none';
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
                    admin_logoff_app();
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
                    common.ComponentRender('common_dialogue_user_menu', 
                        {   app_id:common.COMMON_GLOBAL.app_id,
                            user_account_id:common.COMMON_GLOBAL.user_account_id,
                            common_app_id:common.COMMON_GLOBAL.common_app_id,
                            data_app_id:common.COMMON_GLOBAL.common_app_id,
                            username:common.COMMON_GLOBAL.user_account_username,
                            token_exp:common.COMMON_GLOBAL.token_exp,
                            token_iat:common.COMMON_GLOBAL.token_iat,
                            token_timestamp: common.COMMON_GLOBAL.token_timestamp,
                            system_admin:common.COMMON_GLOBAL.system_admin,
                            system_admin_only:common.COMMON_GLOBAL.system_admin_only,
                            current_locale:common.COMMON_GLOBAL.user_locale,
                            current_timezone:common.COMMON_GLOBAL.user_timezone,
                            current_direction:common.COMMON_GLOBAL.user_direction,
                            current_arabic_script:common.COMMON_GLOBAL.user_arabic_script,
                            //functions
                            function_FFB:common.FFB,
                            function_user_session_countdown:common.user_session_countdown,
                            function_show_message:common.show_message},
                                                '/common/component/dialogue_user_menu.js')
                        .then(()=>common.ComponentRender(   'common_dialogue_user_menu_app_theme', 
                                                            {function_app_theme_update:common.common_preferences_post_mount},
                                                            '/common/component/app_theme.js'));
                    break;
                }
                /**Dialogue user start */
                case 'common_user_start_identity_provider_login':{
                    const target_row = common.element_row(event.target);
                    common.user_login(null, null, null, target_row.querySelector('.common_login_provider_id').innerHTML);
                    break;
                }
                case 'common_user_start_login_button':
                case 'common_user_start_login_system_admin_button':{
                    admin_login();
                    break;
                }
                /* Dialogue user menu */
                case 'common_dialogue_user_menu_username':{
                    if (common.COMMON_GLOBAL.system_admin == null){
                        common.profile_show(null,null);
                        common.ComponentRemove('common_dialogue_user_menu');
                    }
                    break;
                }
                /**Dialogue profile */
                case 'common_profile_home':{
                    common.profile_stat(1);
                    break;
                }
                case 'common_profile_close':{
                    common.profile_close();
                    break;
                }
                case 'common_profile_stat_row1_1':{
                    common.profile_stat(1);
                    break;
                }
                case 'common_profile_stat_row1_2':{
                    common.profile_stat(2);
                    break;
                }
                case 'common_profile_stat_row1_3':{
                    common.profile_stat(3);
                    break;
                }
                case 'common_profile_follow':{
                    common.profile_follow_like('FOLLOW');
                    break;
                }
                case 'common_profile_like':{
                    common.profile_follow_like('LIKE');
                    break;
                }
                case 'common_profile_main_btn_following':{
                    common.profile_detail(1, true, null);
                    break;
                }
                case 'common_profile_main_btn_followed':{
                    common.profile_detail(2, true, null);
                    break;
                }
                case 'common_profile_main_btn_likes':{
                    common.profile_detail(3, true, null);
                    break;
                }
                case 'common_profile_main_btn_liked':
                case 'common_profile_main_btn_liked_heart':
                case 'common_profile_main_btn_liked_users':{
                    common.profile_detail(4, true, null);
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
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_change = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{AppEvent}*/event) => {
            app_event_change(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('change',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_dialogue_user_menu_user_locale_select':{
                    common.common_translate_ui((/**@type{AppEvent}*/event.target.value), ()=>{});
                    break;
                }
                case 'common_dialogue_user_menu_user_arabic_script_select':
                case 'common_dialogue_user_menu_app_select_theme':{
                    AppDocument.body.className = 'app_theme' + AppDocument.querySelector('#common_dialogue_user_menu_app_select_theme').value;
                    common.common_preferences_update_body_class_from_preferences()
                    break;
                }
                default:{
                    app_secure.app_events('change', event, event_target_id);
                    break;
                }
            }
        });
    }
};
/**
 * Event keyup
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_keyup = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{AppEvent}*/event) => {
            app_event_keyup(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_user_start_login_username':
                case 'common_user_start_login_password':
                case 'common_user_start_login_system_admin_username':
                case 'common_user_start_login_system_admin_password':
                case 'common_user_start_login_system_admin_password_confirm':{
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
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_keydown = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keydown',(/**@type{AppEvent}*/event) => {
            app_event_keydown(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keydown',event)
        .then(()=>{
            app_secure.app_events('keydown', event, event_target_id);
        });
    }
};
/**
 * Event input
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_input = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('input',(/**@type{AppEvent}*/event) => {
            app_event_input(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('input',event)
        .then(()=>{
            app_secure.app_events('input', event, event_target_id);
        });
    }
};
/**
 * Event focus
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_focus = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('focus',(/**@type{AppEvent}*/event) => {
            app_event_focus(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('focus',event)
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
    common.show_message('EXCEPTION', null, null, null, error);
};
/**
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const framework_set = async (framework=null) => {
    common.framework_set(framework,
                    {   Click: app_event_click,
                        Change: app_event_change,
                        KeyDown: app_event_keydown,
                        KeyUp: app_event_keyup,
                        Focus: app_event_focus,
                        Input:app_event_input})
    .then(()=>{
        if (common.COMMON_GLOBAL.user_account_id ==null && common.COMMON_GLOBAL.system_admin==null)
            common.show_common_dialogue('LOGIN_ADMIN');
    });                        
};
/**
 * App init
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {Promise.<void>}
 */
const init_app = async (parameters) => {
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js');
    if (parameters.app_service.system_admin_only == 0)
        for (const parameter of parameters.app) {
            if (parameter['MODULE_EASY.QRCODE_WIDTH'])
                common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(parameter['MODULE_EASY.QRCODE_WIDTH']);
            if (parameter['MODULE_EASY.QRCODE_HEIGHT'])
                common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(parameter['MODULE_EASY.QRCODE_HEIGHT']);
            if (parameter['MODULE_EASY.QRCODE_COLOR_DARK'])
                common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = parameter['MODULE_EASY.QRCODE_COLOR_DARK'];
            if (parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'])
                common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'];
            if (parameter['MODULE_EASY.QRCODE_BACKGROUND_COLOR'])
                common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = parameter['MODULE_EASY.QRCODE_BACKGROUND_COLOR'];
        }
        if (common.COMMON_GLOBAL.user_locale != navigator.language.toLowerCase())
            common.common_translate_ui(common.COMMON_GLOBAL.user_locale);
   framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {Promise.<void>}
 */
const init = async parameters => {        
    AppDocument.body.className = 'app_theme1';
    common.COMMON_GLOBAL.app_function_exception = admin_exception;
    common.COMMON_GLOBAL.app_function_session_expired = admin_logoff_app;
    
    common.init_common(parameters).then((/**@type{{ app:{}[], app_service:{system_admin_only:number, first_time:number}}}*/decodedparameters)=>{
        init_app(decodedparameters);
    });
};
export { init };