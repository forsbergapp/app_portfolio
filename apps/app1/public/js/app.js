/**
 * App Portfolio app
 * @module apps/app1/app
 */

/**@type{import('../../../common_types.js').CommonAppDocument} */
const CommonAppDocument = document;

const path_common ='common';
 /**@type {import('../../../common_types.js').CommonModuleCommon} */
const common = await import(path_common);

/**
 * Show or hide dialogue
 * @returns {void}
 */
const show_hide_apps_dialogue = () => {
    if (CommonAppDocument.querySelector('#common_dialogue_apps').style.visibility=='visible' ||
        CommonAppDocument.querySelector('#common_dialogue_apps').style.visibility==''){
        CommonAppDocument.querySelector('#common_dialogue_apps').style.visibility='hidden';
        CommonAppDocument.querySelector('#common_profile_btn_top').style.visibility='hidden';
    }
    else{
        CommonAppDocument.querySelector('#common_dialogue_apps').style.visibility='visible';
        CommonAppDocument.querySelector('#common_profile_btn_top').style.visibility='visible';
    }
};
/**
 * App event click
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_click = event => {
    if (event==null){
        CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click', (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_click(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case event.target.classList.contains('common_select_option')?event_target_id:'':
                case event.target.parentNode?.classList.contains('common_select_option')?event_target_id:'':{
                    if (event_target_id == 'common_dialogue_user_menu_user_locale_select')
                        get_apps();
                    if (event_target_id == 'common_dialogue_user_menu_user_arabic_script_select')
                        app_theme_update();
                    break;
                }
                case 'theme_background':{
                    show_hide_apps_dialogue();
                    break;
                }                    
                //user preferences
                case 'app_theme_checkbox':{
                    app_theme_update(true);
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
                //dialogue user menu
                case 'common_user_menu':
                    case 'common_user_menu_logged_in':
                    case 'common_user_menu_avatar':
                    case 'common_user_menu_avatar_img':
                    case 'common_user_menu_logged_out':
                    case 'common_user_menu_default_avatar':{
                        common.ComponentRender({
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
                                        system_admin:common.COMMON_GLOBAL.system_admin,
                                        user_locale:common.COMMON_GLOBAL.user_locale,
                                        user_timezone:common.COMMON_GLOBAL.user_timezone,
                                        user_direction:common.COMMON_GLOBAL.user_direction,
                                        user_arabic_script:common.COMMON_GLOBAL.user_arabic_script
                                        },
                            methods:    {
                                        set_current_value:common.set_current_value,
                                        FFB:common.FFB,
                                        ComponentRender:common.ComponentRender,
                                        user_session_countdown:common.user_session_countdown,
                                        show_message:common.show_message
                                        },
                            path:       '/common/component/common_dialogue_user_menu.js'})
                        .then(()=>
                            common.ComponentRender({
                                mountDiv:   'common_dialogue_user_menu_app_theme',
                                data:       null,
                                methods:    {app_theme_update:app_preferences_post_mount},
                                path:       '/component/app_theme.js'}));
                        break;
                    }
                case 'common_dialogue_user_menu_log_out':{
                    user_logout_app();
                    break;
                }
                //dialogue profile info
                case 'common_profile_follow':{
                    common.profile_follow_like('FOLLOW');
                    break;
                }
                case 'common_profile_like':{
                    common.profile_follow_like('LIKE');
                    break;
                }
                case 'common_user_start_login_button':{
                    user_login_app().catch(()=>null);
                    break;
                }
                case 'common_user_start_signup_button':{
                    common.user_signup();
                    break;
                }
                case 'common_user_start_identity_provider_login':{
                    const target_row = common.element_row(event.target);
                    const provider_element = target_row.querySelector('.common_login_provider_id');
                    if (provider_element && provider_element.innerHTML)
                        user_login_app(null, null, null, parseInt(provider_element.innerHTML));
                    break;
                }
            }
        });
    }
};
/**
 * App event change
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const app_event_change = event => {
    if (event==null){
        CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change', (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_change(event);
        }, true);
    }
    else
        common.common_event('change',event);
};
/**
 * App event keyup
 * @param {import('../../../common_types.js').CommonAppEvent} event
 * @returns {void} 
 */
const app_event_keyup = event => {
    if (event==null){
        CommonAppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup', (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            app_event_keyup(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_user_start_login_username':
                case 'common_user_start_login_password':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        user_login_app().catch(()=>null);
                    }        
                    break;
                }
                //dialogue verify
                case 'common_user_verify_verification_char1':
                case 'common_user_verify_verification_char2':
                case 'common_user_verify_verification_char3':
                case 'common_user_verify_verification_char4':
                case 'common_user_verify_verification_char5':{
                    common.user_verify_check_input( CommonAppDocument.querySelector(`#${event_target_id}`), 
                                                    'common_user_verify_verification_char' + (Number(event_target_id.substring(event_target_id.length-1))+1), user_login_app);
                    break;
                }
                case 'common_user_verify_verification_char6':{
                    common.user_verify_check_input(CommonAppDocument.querySelector(`#${event_target_id}`), '', user_login_app);
                    break;
                }
            }
        });
    }
};
/**
 * App theme update
 * @param {boolean} toggle_theme 
 * @returns {void}
 */
const app_theme_update = (toggle_theme=false) => {
    let theme = '';
    if(CommonAppDocument.querySelector('#app_theme_checkbox').classList.contains('checked')){
        theme = 'app_theme_sun';
        if (toggle_theme){
            CommonAppDocument.querySelector('#app_theme_checkbox').classList.remove('checked');
            theme = 'app_theme_moon';
        }
    }
    else{
        theme = 'app_theme_moon';
        if (toggle_theme){
            CommonAppDocument.querySelector('#app_theme_checkbox').classList.add('checked');
            theme = 'app_theme_sun';
        }
    }    
    CommonAppDocument.body.className = theme;
    common.common_preferences_update_body_class_from_preferences();
};
/**
 * App theme get
 * @returns {void}
 */
 const app_theme_update_from_body = () => {
    if (CommonAppDocument.body.className.split(' ')[0] == 'app_theme_sun')
        CommonAppDocument.querySelector('#app_theme_checkbox').classList.add('checked');
    else
        CommonAppDocument.querySelector('#app_theme_checkbox').classList.remove('checked');
};
/**
 * App preference post mount
 * @returns {void}
 */
 const app_preferences_post_mount = () => {
    CommonAppDocument.body.className ='';
    if (CommonAppDocument.querySelector('#app_theme_checkbox').classList.contains('checked'))
        CommonAppDocument.body.className = 'app_theme_sun';
    else
        CommonAppDocument.body.className = 'app_theme_moon';
    common.common_preferences_update_body_class_from_preferences();
    app_theme_update_from_body();
};

/**
 * User login app
 * @param {boolean|null} system_admin 
 * @param {string|null} username_verify
 * @param {string|null} password_verify
 * @param {number|null} provider_id 
 * @returns {Promise.<void>}
 */
const user_login_app = async (system_admin=false, username_verify=null, password_verify=null, provider_id=null) =>{
    common.user_login(system_admin, username_verify, password_verify, provider_id)
    .then(()=>get_apps());
};
/**
 * User logout app
 * @returns {Promise.<void>}
 */
 const user_logout_app = async () =>{
    common.user_logout()
    .then(()=>get_apps());
};

/**
 * Get apps
 * @returns {void}
 */
const get_apps = () => {
    common.ComponentRender({
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
        methods:    {FFB:common.FFB},
        path:       '/common/component/common_dialogue_apps.js'});
};
/**
 * App exception function
 * @param {Error} error 
 * @returns {void}
 */
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
/**
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const framework_set = async (framework=null) => {
    await common.framework_set(framework,
        {   Click: app_event_click,
            Change: app_event_change,
            KeyDown: null,
            KeyUp: app_event_keyup,
            Focus: null,
            Input:null});
};
/**
 * Init app
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {Promise.<void>}
 */
const init_app = async (parameters) => {
    await common.ComponentRender({
        mountDiv:   common.COMMON_GLOBAL.app_div,
        data:       null,
        methods:    null,
        path:       '/component/app.js'})
    .then(()=>
        common.ComponentRender({
            mountDiv:   'common_profile_search',
            data:       null,
            methods:    null,
            path:       '/common/component/common_profile_search.js'}))
    .then(()=>
        common.ComponentRender({
            mountDiv:   'app_profile_toolbar',
            data:       null,
            methods:    null,
            path:       '/common/component/common_profile_toolbar.js'}))
    .then(()=>
        common.ComponentRender({
            mountDiv:   'common_user_account',
            data:       null,
            methods:    null,
            path:       '/common/component/common_user_account.js'}));

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
    get_apps();
    
    const user = common.WindowLocationPathname(1);
    if (user !='') {
        //show profile for user entered in url
        common.profile_show(null, user);
    }
   framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = parameters => {
    CommonAppDocument.body.className = 'app_theme_sun';
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = user_logout_app;
    common.init_common(parameters).then((/**@type{{ app:{}[], app_service:{system_admin_only:number, first_time:number}}}*/decodedparameters)=>{
        init_app(decodedparameters);
    });
};
export{init, app_theme_update};