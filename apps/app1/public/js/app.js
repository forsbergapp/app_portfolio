/**@type{{body:{className:string, classList:{add:function}},
 *        querySelector:function,
 *        querySelectorAll:function}} */
 const AppDocument = document;

 /**
  * @typedef {object}        AppEvent
  * @property {string}       code
  * @property {function}     preventDefault
  * @property {function}     stopPropagation
  * @property {{ id:                 string,
  *              innerHTML:          string,
  *              value:              string,
  *              parentNode:         {nextElementSibling:{querySelector:function}},
  *              nextElementSibling: {dispatchEvent:function},
  *              focus:              function,
  *              getAttribute:       function,
  *              setAttribute:       function,
  *              dispatchEvent:      function,
  *              classList:          {contains:function}
  *              className:          string
  *            }}  target
  */
 
/**@ts-ignore */
const common = await import('common');

/**
 * Show or hide dialogue
 * @returns {void}
 */
const show_hide_apps_dialogue = () => {
    if (AppDocument.querySelector('#dialogue_start_content').style.visibility=='visible' ||
        AppDocument.querySelector('#dialogue_start_content').style.visibility==''){
        AppDocument.querySelector('#dialogue_start_content').style.visibility='hidden';
        AppDocument.querySelector('#dialogue_info_content').style.visibility='hidden';
        AppDocument.querySelector('#common_profile_btn_top').style.visibility='hidden';
    }
    else{
        AppDocument.querySelector('#dialogue_start_content').style.visibility='visible';
        AppDocument.querySelector('#dialogue_info_content').style.visibility='visible';
        AppDocument.querySelector('#common_profile_btn_top').style.visibility='visible';
    }
};
/**
 * App event click
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
        common.common_event('click',event)
        .then(()=>{
            if (event.target.className == 'common_dialogue_apps_app_logo')
                window.open(common.element_row(event.target).querySelector('.common_dialogue_apps_app_url').innerHTML);
            else{
                switch (event_target_id){
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
                                                                {function_app_theme_update:app_preferences_post_mount},
                                                                '/component/app_theme.js'));
                            break;
                        }
                    case 'common_dialogue_user_menu_username':{
                        profile_show_app(null,null);
                        common.ComponentRemove('common_dialogue_user_menu');
                        break;
                    }
                    case 'common_dialogue_user_menu_log_out':{
                        user_logoff_app();
                        break;
                    }
                    //profile button
                    case 'common_profile_btn_top':{
                        common.profile_stat(1);
                        break;
                    }
                    //common with app specific settings
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
                        common.profile_detail(1, true);
                        break;
                    }
                    case 'common_profile_main_btn_followed':{
                        common.profile_detail(2, true);
                        break;
                    }
                    case 'common_profile_main_btn_likes':{
                        common.profile_detail(3, true);
                        break;
                    }
                    case 'common_profile_main_btn_liked':
                    case 'common_profile_main_btn_liked_users':{
                        common.profile_detail(4, true);
                        break;
                    }
                    case 'common_profile_main_btn_cloud':{
                        common.profile_detail(5, true);
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
                        user_login_app(null, null, null, target_row.querySelector('.common_login_provider_id').innerHTML);
                        break;
                    }
                    case 'common_user_edit_btn_user_delete_account':{
                        user_delete_app();
                        break;
                    }
                }
            }
        });
    };
};
/**
 * App event change
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_change = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change', (/**@type{AppEvent}*/event) => {
            app_event_change(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('change',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_dialogue_user_menu_user_locale_select':{
                    common.common_translate_ui(event.target.value).then(()=>get_apps());
                    break;
                }
                case 'common_dialogue_user_menu_user_arabic_script_select':{
                    app_theme_update();
                    break;
                }
            }
        });
    };
};
/**
 * App event keyup
 * @param {AppEvent} event
 * @returns {void} 
 */
const app_event_keyup = event => {
    if (event==null){
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup', (/**@type{AppEvent}*/event) => {
            app_event_keyup(event);
        });
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keyup',event)
        .then(()=>{
            switch (event_target_id){
                case 'common_profile_search_input':{
                    common.list_key_event(event, 'profile', profile_show_app);
                    break;
                }
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
                    common.user_verify_check_input( AppDocument.querySelector(`#${event_target_id}`), 
                                                    'common_user_verify_verification_char' + (Number(event_target_id.substring(event_target_id.length-1))+1), user_login_app);
                    break;
                }
                case 'common_user_verify_verification_char6':{
                    common.user_verify_check_input(AppDocument.querySelector(`#${event_target_id}`), '', user_login_app);
                    break;
                }
            }
        });
    };
};
/**
 * App theme update
 * @param {boolean} toggle_theme 
 * @returns {void}
 */
const app_theme_update = (toggle_theme=false) => {
    let theme = '';
    if(AppDocument.querySelector('#app_theme_checkbox').classList.contains('checked')){
        theme = 'app_theme_sun';
        if (toggle_theme){
            AppDocument.querySelector('#app_theme_checkbox').classList.remove('checked');
            theme = 'app_theme_moon';
        }
    }
    else{
        theme = 'app_theme_moon';
        if (toggle_theme){
            AppDocument.querySelector('#app_theme_checkbox').classList.add('checked');
            theme = 'app_theme_sun';
        }
    }    
    AppDocument.body.className = theme;
    common.common_preferences_update_body_class_from_preferences();
};
/**
 * App theme get
 * @returns {void}
 */
 const app_theme_update_from_body = () => {
    if (AppDocument.body.className.split(' ')[0] == 'app_theme_sun')
        AppDocument.querySelector('#app_theme_checkbox').classList.add('checked');
    else
        AppDocument.querySelector('#app_theme_checkbox').classList.remove('checked');
};
/**
 * App preference post mount
 * @returns {void}
 */
 const app_preferences_post_mount = () => {
    AppDocument.body.className ='';
    if (AppDocument.querySelector('#app_theme_checkbox').classList.contains('checked'))
        AppDocument.body.className = 'app_theme_sun';
    else
        AppDocument.body.className = 'app_theme_moon';
    common.common_preferences_update_body_class_from_preferences();
    app_theme_update_from_body();
};
/**
 * @param {number|null} user_account_id_other 
 * @param {string|null} username 
 * @returns {Promise.<void>}
 */
const profile_show_app = async (user_account_id_other, username) =>{
    await common.profile_show(user_account_id_other, username)
    .then((/**@type{{profile_id:number, private:number}}*/result)=>{
        if (result.profile_id != null){
            if (result.private==1 && (common.COMMON_GLOBAL.user_account_id == result.profile_id)==false) {
                //private
                null;
            }
            else
                common.ComponentRender('common_profile_main_stat_row2', 
                                        {},
                                        '/component/profile_info.js')
                .then(()=>{
                    common.ComponentRender(`profile_info_apps`, 
                                            {},
                                            '/common/component/profile_info_apps.js');
                });
        }
    });
}
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
}
/**
 * User logoff app
 * @returns {Promise.<void>}
 */
 const user_logoff_app = async () =>{
    common.user_logoff()
    .then(()=>get_apps());
}

/**
 * Get apps
 * @returns {void}
 */
const get_apps = () => {
    common.ComponentRender('common_dialogue_apps',
                            {
                                common_app_id:common.COMMON_GLOBAL.common_app_id,
                                app_copyright:common.COMMON_GLOBAL.app_copyright,
                                app_email:common.COMMON_GLOBAL.app_email,
                                app_link_url:common.COMMON_GLOBAL.app_link_url,
                                app_link_title:common.COMMON_GLOBAL.app_link_title,
                                info_link_policy_name:common.COMMON_GLOBAL.info_link_policy_name,
                                info_link_disclaimer_name:common.COMMON_GLOBAL.info_link_disclaimer_name,
                                info_link_terms_name:common.COMMON_GLOBAL.info_link_terms_name,
                                info_link_about_name:common.COMMON_GLOBAL.info_link_about_name,
                                function_FFB:common.FFB,
                                function_ComponentRender:common.ComponentRender
                            },
                            '/common/component/dialogue_apps.js');
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
 * User delete
 * @returns {Promise.<void>}
 */
const user_delete_app = async () => {
    
    const function_delete_user_account = () => { 
                                                common.user_delete(1, null)
                                                .then(()=>user_logoff_app())
                                                .catch(()=>null);
                                            };
    await common.user_delete(null, function_delete_user_account)
    .then(()=>null)
    .catch(()=>null);
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
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js')    
    .then(()=>common.ComponentRender('common_profile_search',{}, '/common/component/profile_search.js'))
    .then(()=>common.ComponentRender('app_profile_toolbar',{}, '/common/component/profile_toolbar.js'))
    .then(()=>common.ComponentRender('common_user_account', {},'/common/component/user_account.js'));

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
        await common.common_translate_ui(common.COMMON_GLOBAL.user_locale);
    get_apps();
    
    const user = window.location.pathname.substring(1);
    if (user !='') {
        //show profile for user entered in url
        profile_show_app(null, user);
    }
   framework_set();
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {void}
 */
const init = parameters => {
    AppDocument.body.className = 'app_theme_sun';
    common.COMMON_GLOBAL.app_function_exception = app_exception;
    common.COMMON_GLOBAL.app_function_session_expired = user_logoff_app;
    common.init_common(parameters).then((/**@type{{ app:{}[], app_service:{system_admin_only:number, first_time:number}}}*/decodedparameters)=>{
        init_app(decodedparameters);
    });
};
export{init};