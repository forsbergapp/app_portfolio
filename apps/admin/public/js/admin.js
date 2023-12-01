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
    document.querySelector('#admin_login_username_input').value = '';
    document.querySelector('#admin_login_password_input').value = '';
    document.querySelector('#system_admin_login_username_input').value = '';
    document.querySelector('#system_admin_login_password_input').value = '';
    document.querySelector('#admin_first_time').style.display = 'none';
    document.querySelector('#system_admin_login_password_confirm_input').value = '';
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
    if (common.COMMON_GLOBAL.system_admin == 1) {
        clear_common();
        common.COMMON_GLOBAL.system_admin = 0;
    }
    else
        common.user_logoff().then(() => {
            clear_common();
        });
};
const admin_login = async () => {
    const old_button = document.querySelector('#admin_login_button').innerHTML;
    if (document.querySelector('#system_admin_login').style.display == 'block') {
        if (document.querySelector('#system_admin_login_username_input').value == '') {
            common.show_message('INFO', null, null, common.ICONS.app_system_admin + ' ' + common.ICONS.message_text, common.COMMON_GLOBAL.common_app_id);
            return;
        }
        if (document.querySelector('#system_admin_login_password_input').value == '') {
            common.show_message('INFO', null, null, common.ICONS.user_password + ' ' + common.ICONS.message_text, common.COMMON_GLOBAL.common_app_id);
            return;
        }
        if (common.check_input(document.querySelector('#system_admin_login_username_input').value, 100, true) == false ||
            common.check_input(document.querySelector('#system_admin_login_password_input').value, 100, true) == false)
            return;
        //no : in username
        if (document.querySelector('#system_admin_login_username_input').value.indexOf(':') > -1) {
            common.show_message('INFO', null, null, common.ICONS.app_system_admin + ' ":" ' + common.ICONS.message_error, common.COMMON_GLOBAL.common_app_id);
            return;
        }
        //no : in username
        if (document.querySelector('#system_admin_login_password_input').value.indexOf(':') > -1) {
            common.show_message('INFO', null, null, common.ICONS.user_password + ' ":" ' + common.ICONS.message_error, common.COMMON_GLOBAL.common_app_id);
            return;
        }
        //if first time then password confirm is shown
        if (document.querySelector('#system_admin_login_password_confirm').style.display == 'block') {
            if (document.querySelector('#system_admin_login_password_confirm_input').value == '') {
                common.show_message('INFO', null, null, common.ICONS.user_password + ' ' + common.ICONS.message_text, common.COMMON_GLOBAL.common_app_id);
                return;
            }
            if (document.querySelector('#system_admin_login_password_input').value !=
                document.querySelector('#system_admin_login_password_confirm_input').value) {
                common.show_message('INFO', null, null, common.ICONS.user_password + ' <> ' + common.ICONS.user_password, common.COMMON_GLOBAL.common_app_id);
                return;
            }
        }
        common.FFB ('AUTH', '/auth/systemadmin?', 'POST', 'SYSTEMADMIN', {username: encodeURI(document.querySelector('#system_admin_login_username_input').value),
                                                        password: encodeURI(document.querySelector('#system_admin_login_password_input').value)}, (err, result_login) => {
            document.querySelector('#admin_login_button').innerHTML = old_button;
            if (err)
                null;
            else{
                common.COMMON_GLOBAL.rest_admin_at = JSON.parse(result_login).token_at;
                common.COMMON_GLOBAL.system_admin = 1;
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
            }
        });
    }
    else {
        await common.user_login(encodeURI(document.querySelector('#admin_login_username_input').value),
                                encodeURI(document.querySelector('#admin_login_password_input').value), (err, result) => {
                document.querySelector('#admin_login_button').innerHTML = old_button;
                if (err == null) {
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
                }
            });
    }
};
const setEvents = () => {

    document.querySelector('#admin_login_form').addEventListener('keyup', (event) => {
        if (event.target.id == 'admin_login_username_input' ||
            event.target.id == 'admin_login_password_input' ||
            event.target.id == 'system_admin_login_username_input' ||
            event.target.id == 'system_admin_login_password_input' ||
            event.target.id == 'system_admin_login_password_confirm_input')
            if (event.code === 'Enter') {
                event.preventDefault();
                admin_login();
                //unfocus
                document.querySelector('#' + event.target.id).blur();
            }
    });
    document.querySelector('#admin_login_button').addEventListener('click', () => { admin_login(); }, false);
    document.querySelector('#admin_login_nav').addEventListener('click', (event) => { admin_login_nav(event.target); }, true);


    if (common.COMMON_GLOBAL.system_admin_only == 1)
        common.set_event_user_menu();
    else {
        //common
        //profile
        document.querySelector('#common_profile_home').addEventListener('click', () => { common.profile_top(1); }, false);
        document.querySelector('#common_profile_close').addEventListener('click', () => { common.profile_close(); }, false);
        document.querySelector('#common_profile_search_input').addEventListener('keyup', (event) => { common.search_input(event, 'profile', null); }, false);
        document.querySelector('#common_profile_top_row1_1').addEventListener('click', () => { common.profile_top(1); }, false);
        document.querySelector('#common_profile_top_row1_2').addEventListener('click', () => { common.profile_top(2); }, false);
        document.querySelector('#common_profile_top_row1_3').addEventListener('click', () => { common.profile_top(3); }, false);
        document.querySelector('#common_profile_follow').addEventListener('click', () => { common.profile_follow_like('FOLLOW'); }, false);
        document.querySelector('#common_profile_like').addEventListener('click', () => { common.profile_follow_like('LIKE'); }, false);
        document.querySelector('#common_profile_main_btn_following').addEventListener('click', () => { common.profile_detail(1, null, true, null); }, false);
        document.querySelector('#common_profile_main_btn_followed').addEventListener('click', () => { common.profile_detail(2, null, true, null); }, false);
        document.querySelector('#common_profile_main_btn_likes').addEventListener('click', () => { common.profile_detail(3, null, true, null); }, false);
        document.querySelector('#common_profile_main_btn_liked').addEventListener('click', () => { common.profile_detail(4, null, true, null); }, false);
        //user preferences
        document.querySelector('#common_user_menu_username').addEventListener('click', () => {
            document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
            common.profile_show(null,null,()=>{});
            document.querySelector('#common_user_menu_dropdown').style = 'none';
        }, false);

        document.querySelector('#common_user_locale_select').addEventListener('change', (event) => {
            common.common_translate_ui(event.target.value, null, ()=>{});
        }, false);
        document.querySelector('#common_user_arabic_script_select').addEventListener('change', () => { document.querySelector('#common_app_select_theme').dispatchEvent(new Event('change')); }, false);
    }
    document.querySelector('#common_app_select_theme').addEventListener('change', () => { document.body.className = 'app_theme' + document.querySelector('#common_app_select_theme').value + ' ' + document.querySelector('#common_user_arabic_script_select').value; }, false);

};

const admin_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
const init_app = (system_admin_only) => {
    //SET ICONS
    document.querySelector('#admin_login_logo').style.backgroundImage=`url(${common.COMMON_GLOBAL.app_logo})`;

    document.querySelector('#common_message_close').innerHTML = common.ICONS.app_close;
    document.querySelector('#common_message_cancel').innerHTML = common.ICONS.app_cancel;

    document.querySelector('#menu_open').innerHTML = common.ICONS.app_menu_open;

    document.querySelector('#send_broadcast_send').innerHTML = common.ICONS.app_send;
    document.querySelector('#send_broadcast_close').innerHTML = common.ICONS.app_close;
    document.querySelector('#common_lov_close').innerHTML = common.ICONS.app_close;

    document.querySelector('#send_broadcast_title').innerHTML = common.ICONS.app_broadcast;
    document.querySelector('#client_id_label').innerHTML = common.ICONS.user;

    //SET EVENTLISTENERS
    document.querySelector('#common_message_cancel').addEventListener('click', () => { document.querySelector('#common_dialogue_message').style.visibility = 'hidden'; }, false);
    document.querySelector('#menu_open').addEventListener('click', () => { document.querySelector('#menu').style.display = 'block'; }, false);

    document.querySelector('#select_broadcast_type').addEventListener('change', () => { app_secure.set_broadcast_type(); }, false);
    document.querySelector('#send_broadcast_send').addEventListener('click', () => { app_secure.sendBroadcast(); }, false);
    document.querySelector('#send_broadcast_close').addEventListener('click', () => { app_secure.closeBroadcast(); }, false);

    //MENU ITEMS
    document.querySelector('#menu_close').innerHTML = common.ICONS.app_menu_close;
    //DASHBOARD
    document.querySelector('#menu_1').innerHTML = common.ICONS.app_chart;
    //USER STAT
    document.querySelector('#menu_2').innerHTML = common.ICONS.app_users + common.ICONS.app_log;
    //USERS
    document.querySelector('#menu_3').innerHTML = common.ICONS.app_users;
    //APP ADMIN
    document.querySelector('#menu_4').innerHTML = common.ICONS.app_apps + common.ICONS.app_settings;
    //MONITOR
    document.querySelector('#menu_5').innerHTML = common.ICONS.app_log;
    //PARAMETER
    document.querySelector('#menu_6').innerHTML = common.ICONS.app_server + common.ICONS.app_settings;
    //INSTALLATION 
    document.querySelector('#menu_7').innerHTML = common.ICONS.app_server + common.ICONS.app_install;
    //DATABASE
    document.querySelector('#menu_8').innerHTML = common.ICONS.app_server + common.ICONS.app_database;
    //'BACKUP/RESTORE'
    document.querySelector('#menu_9').innerHTML = common.ICONS.app_server + common.ICONS.app_backup + common.ICONS.app_restore;
    //SERVER
    document.querySelector('#menu_10').innerHTML = common.ICONS.app_server;
    //LOGOUT
    document.querySelector('#menu_11').innerHTML = common.ICONS.app_logoff;

    document.querySelector('#menu_secure').addEventListener('click', (event) => {
        let target_id;
        if (event.target.id.startsWith('menu_')) {
            //menuitem
            target_id = event.target.id;
        }
        else
            if (event.target.parentNode.id.startsWith('menu_')) {
                //svg or icon in menuitem
                target_id = event.target.parentNode.id;
            }
            else
                if (event.target.parentNode.parentNode.id.startsWith('menu_')) {
                    //path in svg in menuitem
                    target_id = event.target.parentNode.parentNode.id;
                }
        switch (target_id) {
            case 'menu_close': {
                document.querySelector('#menu').style.display = 'none';
                break;
            }
            case 'menu_11': {
                admin_logoff_app();
                break;
            }
            default: {
                app_secure.show_menu(parseInt(target_id.substring(5)));
            }
        }
    }, false);
    document.querySelector('#common_user_direction_select').addEventListener('change', (event) => { app_secure.fix_pagination_buttons(event.target.value); }, false);
    setEvents();
    if (system_admin_only == 0)
        if (common.COMMON_GLOBAL.user_locale != navigator.language.toLowerCase())
            common.common_translate_ui(common.COMMON_GLOBAL.user_locale, null, ()=>{});
};
const init = (parameters) => {
    //show admin login as default
    document.querySelector('#admin_login_button').innerHTML = common.APP_SPINNER;
    common.COMMON_GLOBAL.exception_app_function = admin_exception;
    

    common.init_common(parameters).then(()=>{
        admin_login_nav(document.querySelector('#admin_login_title'));
        document.querySelector('#admin_login_title').innerHTML = common.ICONS.user;
        document.querySelector('#system_admin_login_title').innerHTML = common.ICONS.app_system_admin;
        document.querySelector('#system_admin_login_username_icon').innerHTML = common.ICONS.app_system_admin;
        document.querySelector('#system_admin_login_password_icon').innerHTML = common.ICONS.user_password;
        
        document.querySelector('#common_message_close').innerHTML = common.ICONS.app_close;
        document.querySelector('#admin_login_username_icon').innerHTML = common.ICONS.user;
        document.querySelector('#admin_login_password_icon').innerHTML = common.ICONS.user_password;
        if (parameters.app_service.first_time == 1) {
            document.querySelector('#admin_first_time').innerHTML = common.ICONS.app_init;
            document.querySelector('#admin_first_time').style.display = 'block';
            document.querySelector('#system_admin_login_password_confirm').style.display = 'block';
            document.querySelector('#system_admin_login_password_icon_confirm').innerHTML = common.ICONS.user_password;
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
        init_app(parameters.app_service.system_admin_only);
        document.querySelector('#admin_login_button').innerHTML = common.ICONS.app_login;
    });
};
export { init };