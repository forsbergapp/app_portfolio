const common = await import('common');
const app_secure = await import('app_secure');
common.COMMON_GLOBAL.rest_admin_at = '';

const admin_login_nav = (target) => {
    document.querySelector('#admin_login_title').classList.remove('login_nav_button_selected');
    document.querySelector('#system_admin_login_title').classList.remove('login_nav_button_selected');
    if (target.id == 'admin_login_title' || target.parentElement.id == 'admin_login_title') {
        document.querySelector('#admin_login').style.display = 'block';
        document.querySelector('#system_admin_login').style.display = 'none';
        document.querySelector('#admin_login_title').classList.add('login_nav_button_selected');
    }
    if (target.id == 'system_admin_login_title' || target.parentElement.id == 'system_admin_login_title') {
        document.querySelector('#admin_login').style.display = 'none';
        document.querySelector('#system_admin_login').style.display = 'block';
        document.querySelector('#system_admin_login_title').classList.add('login_nav_button_selected');
    }
};
const clear_login = () => {
    document.querySelector('#admin_login_username_input').innerHTML = '';
    document.querySelector('#admin_login_password_input').innerHTML = '';
    document.querySelector('#admin_login_password_input_mask').innerHTML = '';
    document.querySelector('#system_admin_login_username_input').innerHTML = '';
    document.querySelector('#system_admin_login_password_input').innerHTML = '';
    document.querySelector('#system_admin_login_password_input_mask').innerHTML = '';
    document.querySelector('#admin_first_time').style.display = 'none';
    document.querySelector('#system_admin_login_password_confirm_input').innerHTML = '';
    document.querySelector('#system_admin_login_password_confirm_input_mask').innerHTML = '';
    document.querySelector('#system_admin_login_password_confirm').style.display = 'none';
};
const admin_logoff_app = () => {
    common.COMMON_GLOBAL.rest_admin_at = '';
    document.querySelector('#common_user_menu_default_avatar').innerHTML = '';
    const clear_common = () => {
        app_secure.delete_globals();
        document.querySelectorAll('.main_content').forEach(content => {
            content.innerHTML = '';
        });
        document.querySelector('#dialogue_admin_login').style.visibility = 'visible';
        document.querySelector('#menu').style.visibility = 'hidden';
        document.querySelector('#menu_open').style.visibility = 'hidden';
        document.querySelector('#admin_secure').style.visibility = 'hidden';
    };
    if (common.COMMON_GLOBAL.system_admin != '') {
        clear_common();
        common.COMMON_GLOBAL.system_admin = '';
    }
    else
        common.user_logoff().then(() => {
            clear_common();
        });
};
const admin_login = async () => {
    if (document.querySelector('#system_admin_login').style.display == 'block') {
        if (document.querySelector('#system_admin_login_username_input').innerHTML == '') {
            common.show_message('INFO', null, null, common.ICONS.app_system_admin + ' ' + common.ICONS.message_text, common.COMMON_GLOBAL.common_app_id);
            return;
        }
        if (document.querySelector('#system_admin_login_password_input').innerHTML == '') {
            common.show_message('INFO', null, null, common.ICONS.user_password + ' ' + common.ICONS.message_text, common.COMMON_GLOBAL.common_app_id);
            return;
        }
        if (common.check_input(document.querySelector('#system_admin_login_username_input').innerHTML, 100, true) == false ||
            common.check_input(document.querySelector('#system_admin_login_password_input').innerHTML, 100, true) == false)
            return;
        //no : in username
        if (document.querySelector('#system_admin_login_username_input').innerHTML.indexOf(':') > -1) {
            common.show_message('INFO', null, null, common.ICONS.app_system_admin + ' ":" ' + common.ICONS.message_error, common.COMMON_GLOBAL.common_app_id);
            return;
        }
        //no : in username
        if (document.querySelector('#system_admin_login_password_input').innerHTML.indexOf(':') > -1) {
            common.show_message('INFO', null, null, common.ICONS.user_password + ' ":" ' + common.ICONS.message_error, common.COMMON_GLOBAL.common_app_id);
            return;
        }
        //if first time then password confirm is shown
        if (document.querySelector('#system_admin_login_password_confirm').style.display == 'block') {
            if (document.querySelector('#system_admin_login_password_confirm_input').innerHTML == '') {
                common.show_message('INFO', null, null, common.ICONS.user_password + ' ' + common.ICONS.message_text, common.COMMON_GLOBAL.common_app_id);
                return;
            }
            if (document.querySelector('#system_admin_login_password_input').innerHTML !=
                document.querySelector('#system_admin_login_password_confirm_input').innerHTML) {
                common.show_message('INFO', null, null, common.ICONS.user_password + ' <> ' + common.ICONS.user_password, common.COMMON_GLOBAL.common_app_id);
                return;
            }
        }
        document.querySelector('#admin_login_button').classList.add('css_spinner');
        common.FFB('IAM', '/systemadmin?', 'POST', 'IAM', {username: encodeURI(document.querySelector('#system_admin_login_username_input').innerHTML),
                                                            password: encodeURI(document.querySelector('#system_admin_login_password_input').innerHTML)})
        .then((result_login)=>{
            common.COMMON_GLOBAL.system_admin = JSON.parse(result_login).username;
            common.COMMON_GLOBAL.rest_admin_at = JSON.parse(result_login).token_at;
            common.updateOnlineStatus();
            common.dialogue_close('dialogue_admin_login').then(() => {
                document.querySelector('#common_user_menu_default_avatar').innerHTML = common.ICONS.app_system_admin;
                document.querySelector('#common_user_menu_username').innerHTML = common.ICONS.app_system_admin;
                document.querySelector('#menu').style.visibility = 'visible';
                document.querySelector('#menu_open').style.visibility = 'visible';
                document.querySelector('#common_user_preferences').style.display = 'none';
                document.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'none';
                document.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';
                document.querySelector('#common_dialogue_login').style.visibility = 'hidden';
                clear_login();
                document.querySelector('#admin_secure').style.visibility = 'visible';
                app_secure.init();
            });
        })
        .catch(()=>document.querySelector('#admin_login_button').classList.remove('css_spinner'));
    }
    else {
        await common.user_login(encodeURI(document.querySelector('#admin_login_username_input').innerHTML),
                                encodeURI(document.querySelector('#admin_login_password_input').innerHTML))
            .then((result)=>{
                common.dialogue_close('dialogue_admin_login').then(() => {
                    document.querySelector('#menu').style.visibility = 'visible';
                    document.querySelector('#menu_open').style.visibility = 'visible';
                    document.querySelector('#common_user_preferences').style.display = 'block';
                    common.set_avatar(result.avatar, document.querySelector('#common_user_menu_avatar_img'));
                    document.querySelector('#common_user_menu_username').innerHTML = result.username;

                    document.querySelector('#common_user_menu_logged_in').style.display = 'inline-block';
                    document.querySelector('#common_user_menu').classList.add('user_menu_logged_in');
                    document.querySelector('#common_user_menu_logged_out').style.display = 'none';

                    document.querySelector('#common_user_menu_username').style.display = 'block';
                    document.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'inline-block';
                    document.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';
                    clear_login();
                    document.querySelector('#admin_secure').style.visibility = 'visible';
                    app_secure.init();
                });
            })
            .catch(()=>null)
            .finally(document.querySelector('#admin_login_button').classList.remove('css_spinner'));
    }
};
const setEvents = () => {

    document.querySelector('#app').addEventListener('click', event => {
        const event_target_id = common.element_id(event.target);
        const list_title = common.element_list_title(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                case 'admin_login_button':{
                    admin_login();
                    break;
                }
                case 'admin_login_title':
                case 'system_admin_login_title':{
                    admin_login_nav(event.target);
                    break;
                }
                case 'menu_open':{
                    document.querySelector('#menu').style.display = 'block';
                    break;
                }
                case 'menu_close': {
                    document.querySelector('#menu').style.display = 'none';
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
                case 'common_message_cancel':{
                    document.querySelector('#common_dialogue_message').style.visibility = 'hidden';
                    break;
                }
                case 'common_profile_home':{
                    common.profile_top(1);
                    break;
                }
                case 'common_profile_close':{
                    common.profile_close();
                    break;
                }
                case 'common_profile_top_row1_1':{
                    common.profile_top(1);
                    break;
                }
                case 'common_profile_top_row1_2':{
                    common.profile_top(2);
                    break;
                }
                case 'common_profile_top_row1_3':{
                    common.profile_top(3);
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
                    common.profile_detail(1, null, true, null);
                    break;
                }
                case 'common_profile_main_btn_followed':{
                    common.profile_detail(2, null, true, null);
                    break;
                }
                case 'common_profile_main_btn_likes':{
                    common.profile_detail(3, null, true, null);
                    break;
                }
                case 'common_profile_main_btn_liked':{
                    common.profile_detail(4, null, true, null);
                    break;
                }
                case 'common_user_menu_username':{
                    if (common.COMMON_GLOBAL.system_admin_only == 0){
                        document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
                        common.profile_show(null,null);
                        document.querySelector('#common_user_menu_dropdown').style = 'none';
                    }
                    break;
                }
                default:{
                    app_secure.app_events('click', event, event_target_id, list_title);
                    break;
                }
            }
        });
    }, true);
    
    document.querySelector('#app').addEventListener('change', event => {
        const target_id = common.element_id(event.target);
        common.common_event('change',event)
        .then(()=>{
            switch (target_id){
                case 'common_user_locale_select':{
                    common.common_translate_ui(event.target.value, ()=>{});
                    break;
                }
                case 'common_user_arabic_script_select':{
                    document.querySelector('#common_app_select_theme').dispatchEvent(new Event('change'));
                    break;
                }
                case 'common_app_select_theme':{
                    document.body.className = 'app_theme' + 
                                                document.querySelector('#common_app_select_theme').value + ' ' + 
                                                document.querySelector('#common_user_arabic_script_select').value;
                    break;
                }
                default:{
                    app_secure.app_events('change', event, target_id);
                    break;
                }
            }
        });
    });
    document.querySelector('#app').addEventListener('keyup', event => {
        const target_id = common.element_id(event.target);
        common.common_event('keyup',event)
        .then(()=>{
            switch (target_id){
                case 'admin_login_username_input':
                case 'admin_login_password_input':
                case 'system_admin_login_username_input':
                case 'system_admin_login_password_input':
                case 'system_admin_login_password_confirm_input':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        admin_login();
                        //unfocus
                        document.querySelector('#' + event.target.id).blur();
                    }    
                    break;
                }
                default:
                    app_secure.app_events('keyup', event, target_id);
                    break;
            }
        });
    });
    document.querySelector('#app').addEventListener('keydown', event => {
        const target_id = common.element_id(event.target);
        common.common_event('keydown',event)
        .then(()=>{
            app_secure.app_events('keydown', event, target_id);
        });
    });
    document.querySelector('#app').addEventListener('input', event => {
        const target_id = common.element_id(event.target);
        app_secure.app_events('input', event, target_id);
    }, true);
    document.querySelector('#app').addEventListener('focus', event => {
        const target_id = common.element_id(event.target);
        app_secure.app_events('focus', event, target_id);
    }, true);
};

const admin_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const init_app = (parameters) => {
    admin_login_nav(document.querySelector('#admin_login_title'));
    if (parameters.app_service.first_time == 1) {
        document.querySelector('#admin_first_time').style.display = 'block';
        document.querySelector('#system_admin_login_password_confirm').style.display = 'block';
    }
    if (parameters.app_service.system_admin_only == 1) {
        document.querySelector('#admin_login_nav').style.display = 'none';
        document.querySelector('#admin_login').style.display = 'none';
        document.querySelector('#system_admin_login').style.display = 'block';
    }
    else {
        for (let i = 0; i < parameters.app.length; i++) {
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_WIDTH')
                common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(parameters.app[i].parameter_value);
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_HEIGHT')
                common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(parameters.app[i].parameter_value);
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_COLOR_DARK')
                common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = parameters.app[i].parameter_value;
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_COLOR_LIGHT')
                common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = parameters.app[i].parameter_value;
            if (parameters.app[i].parameter_name == 'MODULE_EASY.QRCODE_BACKGROUND_COLOR')
                common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = parameters.app[i].parameter_value;
        }
    }
    document.querySelector('#admin_login_logo').style.backgroundImage=`url(${common.COMMON_GLOBAL.app_logo})`;
    
    setEvents();
    if (parameters.app_service.system_admin_only == 0)
        if (common.COMMON_GLOBAL.user_locale != navigator.language.toLowerCase())
            common.common_translate_ui(common.COMMON_GLOBAL.user_locale);
};
const init = (parameters) => {
    //show admin login as default
    document.querySelector('#admin_login_button').classList.add('css_spinner');
    common.COMMON_GLOBAL.exception_app_function = admin_exception;
    common.init_common(parameters).then(()=>{
        init_app(parameters);  
    })
    .finally(document.querySelector('#admin_login_button').classList.remove('css_spinner'));
};
export { init };