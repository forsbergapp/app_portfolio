const common = await import('/common/js/common.js');
common.COMMON_GLOBAL['rest_admin_at'] = '';

const APP_GLOBAL = {
    "page":"",
    "page_last":"",
    "limit":"",
    "previous_row":"",
    "module_leaflet_map_container":"",
    "module_leaflet_map_zoom":"",
    "module_leaflet_map_marker_div_gps":"",
    "service_log_scope_server":"",
    "service_log_scope_service":"",
    "service_log_scope_db":"",
    "service_log_scope_router":"",
    "service_log_scope_controller":"",
    "service_log_level_verbose":"",
    "service_log_level_error":"",
    "service_log_level_info":"",
    "service_log_file_interval":"",
    "service_log_file_path_server":"",
    "service_log_destination":"",
    "service_log_url_destination":"",
    "service_log_url_destination_username":"",
    "service_log_url_destination_password":"",
    "service_log_date_format":""
}

const admin_login_nav = (target) => {
    document.getElementById('admin_login_title').classList.remove('login_nav_button_selected');
    document.getElementById('system_admin_login_title').classList.remove('login_nav_button_selected');
    if (target.id=='admin_login_title' ||target.parentElement.id=='admin_login_title'){
            document.getElementById('admin_login').style.display = 'block';
            document.getElementById('system_admin_login').style.display = 'none';
            document.getElementById('admin_login_title').classList.add('login_nav_button_selected');
    }
    if  (target.id=='system_admin_login_title' ||target.parentElement.id=='system_admin_login_title'){
            document.getElementById('admin_login').style.display = 'none';
            document.getElementById('system_admin_login').style.display = 'block';
            document.getElementById('system_admin_login_title').classList.add('login_nav_button_selected');
    }
}
const start_admin_secure = (app) => {
    document.getElementById('admin_login_username_input').value='';
    document.getElementById('admin_login_password_input').value='';
    document.getElementById('system_admin_login_username_input').value='';
    document.getElementById('system_admin_login_password_input').value='';
    document.getElementById('admin_first_time').style.display = 'none';
    document.getElementById('system_admin_login_password_confirm_input').value='';
    document.getElementById('system_admin_login_password_confirm').style.display = 'none';
    let secure_div = 'admin_secure';                 
    document.getElementById(secure_div).style.visibility = 'visible';
    document.getElementById(secure_div).innerHTML = app;
    //make script in innerHTML work:
    let scripts = Array.prototype.slice.call(document.getElementById(secure_div).getElementsByTagName('script'));
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src != '') {
            let tag = document.createElement('script');
            tag.src = scripts[i].src;
            document.getElementById(secure_div).insertBefore(tag, document.getElementById(secure_div).firstChild);
        }
        else {
            eval(scripts[i].innerHTML);
        }
    }
}
const admin_login = async () => {
    let old_button = document.getElementById('admin_login_button').innerHTML;
    if (document.getElementById('system_admin_login').style.display == 'block'){
        if (document.getElementById("system_admin_login_username_input").value == '') {
            common.show_message('INFO', null, null, common.ICONS['app_system_admin'] + ' ' + common.ICONS['message_text'], common.COMMON_GLOBAL['common_app_id']);
            return callBack('ERROR', null);
        }
        if (document.getElementById("system_admin_login_password_input").value == '') {
            common.show_message('INFO', null, null, common.ICONS['user_password'] + ' ' + common.ICONS['message_text'], common.COMMON_GLOBAL['common_app_id']);
            return callBack('ERROR', null);
        }
        if (common.check_input(document.getElementById("system_admin_login_username_input").value, 100, true) == false || 
            common.check_input(document.getElementById("system_admin_login_password_input").value, 100, true)== false)
            return callBack('ERROR', null);
        //no : in username
        if (document.getElementById("system_admin_login_username_input").value.indexOf(':') > -1) {
            common.show_message('INFO', null, null, common.ICONS['app_system_admin'] + ' ":" ' + common.ICONS['message_error'], common.COMMON_GLOBAL['common_app_id']);
            return callBack('ERROR', null);
        }
        //no : in username
        if (document.getElementById("system_admin_login_password_input").value.indexOf(':') > -1) {
            common.show_message('INFO', null, null, common.ICONS['user_password'] + ' ":" ' + common.ICONS['message_error'], common.COMMON_GLOBAL['common_app_id']);
            return callBack('ERROR', null);
        }
        //if first time then password confirm is shown
        if (document.getElementById("system_admin_login_password_confirm").style.display == 'block'){
            if (document.getElementById("system_admin_login_password_confirm_input").value == '') {
                common.show_message('INFO', null, null, common.ICONS['user_password'] + ' ' + common.ICONS['message_text'], common.COMMON_GLOBAL['common_app_id']);
                return callBack('ERROR', null);
            }
            if (document.getElementById("system_admin_login_password_input").value != 
                document.getElementById("system_admin_login_password_confirm_input").value) {
                common.show_message('INFO', null, null, common.ICONS['user_password'] + ' <> ' + common.ICONS['user_password'], common.COMMON_GLOBAL['common_app_id']);
                return callBack('ERROR', null);
            }
        }
        let status;
        let json;
        fetch(`${common.COMMON_GLOBAL['rest_resource_server']}/auth/admin`,
        {method: 'POST',
            headers: {
            'Authorization': 'Basic ' + window.btoa(document.getElementById("system_admin_login_username_input").value + ':' + document.getElementById("system_admin_login_password_input").value)
            }
        })
            .then((response) => {
                status = response.status;
                return response.text();
            })
            .then((result_login) => {
                document.getElementById('admin_login_button').innerHTML = old_button;
                if (status == 200){
                    json = JSON.parse(result_login);
                    common.COMMON_GLOBAL['rest_admin_at'] = json.token_at;
                    common.COMMON_GLOBAL['system_admin'] = 1;
                    common.updateOnlineStatus();
                    fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/forms/admin/secure`,
                    {method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + common.COMMON_GLOBAL['rest_admin_at'],
                        }
                    })
                        .then((response) => {
                            status = response.status;
                            return response.text();
                        })
                        .then((result_form) => {
                            if (status == 200){
                                common.dialogue_close('dialogue_admin_login').then(() => {
                                    document.getElementById('common_app_select_theme').style.display = 'block';
                                    document.getElementById('common_app_select_theme').style.visibility = 'visible';
                                    document.getElementById('common_dialogue_login').style.visibility = 'hidden';
                                    start_admin_secure(JSON.parse(result_form).app)
                                    document.getElementById('system_admin_avatar').innerHTML = common.ICONS['app_system_admin'];
                                })
                            }
                            else{
                                common.show_message('EXCEPTION', null,null, result_form, common.COMMON_GLOBAL['app_id']);
                            }
                        })
                }
                else{
                    common.show_message('EXCEPTION', null,null, result_login, common.COMMON_GLOBAL['app_id']);
                }
            })
    }
    else{
        await common.user_login(document.getElementById('admin_login_username_input').value, 
                                document.getElementById('admin_login_password_input').value, (err, result)=>{
            document.getElementById('admin_login_button').innerHTML = old_button;
            if (err==null){         
                common.dialogue_close('dialogue_admin_login').then(() => {
                    document.getElementById('common_user_account').style.visibility = 'visible';
                    common.set_avatar(result.avatar, document.getElementById('common_user_menu_avatar_img'));
                    document.getElementById('common_user_menu_username').innerHTML = result.username;
                    
                    document.getElementById('common_user_menu_logged_in').style.display = 'inline-block';
                    document.getElementById('common_user_menu').classList.add('user_menu_logged_in');
                    document.getElementById('common_user_menu_logged_out').style.display = 'none';
    
                    document.getElementById('common_user_menu_username').style.display = 'block';
                    document.getElementById('common_user_menu_dropdown_logged_in').style.display = 'inline-block';
                    document.getElementById('common_user_menu_dropdown_logged_out').style.display = 'none';
    
                    start_admin_secure(result.app)
                })  
            }
        })
    }
}
const setEvents = (system_admin_only=0) => {
    
    document.getElementById('admin_login_form').addEventListener('keyup', (event) => {
        if (event.target.id=='admin_login_username_input' ||
            event.target.id=='admin_login_password_input' ||
            event.target.id=='system_admin_login_username_input' ||
            event.target.id=='system_admin_login_password_input' ||
            event.target.id=='system_admin_login_password_confirm_input')
            if (event.code === 'Enter') {
                event.preventDefault();
                admin_login();
                //unfocus
                document.getElementById(event.target.id).blur();
            }
    })
    document.getElementById('admin_login_button').addEventListener('click', () => { admin_login() }, false);
    document.getElementById('admin_login_nav').addEventListener('click', (event) => { admin_login_nav(event.target) }, true);
    
    if (system_admin_only==0){
        //common
        //profile
        document.getElementById('common_profile_home').addEventListener('click', () => {common.profile_top(1);}, false);
        document.getElementById('common_profile_close').addEventListener('click', () => {common.profile_close()}, false);
        document.getElementById('common_profile_search_input').addEventListener('keyup', (event) => { common.search_input(event, null);}, false);
        document.getElementById('common_profile_top_row1_1').addEventListener('click', () => { common.profile_top(1)}, false);
        document.getElementById('common_profile_top_row1_2').addEventListener('click', () => { common.profile_top(2)}, false);
        document.getElementById('common_profile_top_row1_3').addEventListener('click', () => { common.profile_top(3)}, false);
        document.getElementById('common_profile_follow').addEventListener('click', () => { common.profile_follow_like('FOLLOW') }, false);
        document.getElementById('common_profile_like').addEventListener('click', () => { common.profile_follow_like('LIKE') }, false);
        document.getElementById('common_profile_main_btn_following').addEventListener('click', () => { common.profile_detail(1, null, true, null) }, false);
        document.getElementById('common_profile_main_btn_followed').addEventListener('click', () => { common.profile_detail(2, null, true, null) }, false);
        document.getElementById('common_profile_main_btn_likes').addEventListener('click', () => { common.profile_detail(3, null, true, null) }, false);
        document.getElementById('common_profile_main_btn_liked').addEventListener('click', () => { common.profile_detail(4, null, true, null) }, false);
        //user preferences
        document.getElementById('common_user_menu_username').addEventListener('click', () => { 
                                                                                    document.getElementById('common_dialogue_profile').style.visibility = 'visible';
                                                                                    common.profile_show(null,
                                                                                                        null,
                                                                                                        (err, result)=>{
                                                                                                            null;
                                                                                                        });
                                                                                    document.getElementById('common_user_menu_dropdown').style='none';
                                                                                }, false);

        document.getElementById('common_app_select_theme').addEventListener('change', () => { document.body.className = 'app_theme' + document.getElementById('common_app_select_theme').value + ' ' + document.getElementById('common_user_arabic_script_select').value; }, false);
        document.getElementById('common_user_locale_select').addEventListener('change', (event) => { 
                                                                                    common.common_translate_ui(event.target.value, null, (err, result)=>{
                                                                                            null
                                                                                        });
                                                                                }, false);
        document.getElementById('common_user_arabic_script_select').addEventListener('change', () => { document.getElementById('common_app_select_theme').dispatchEvent(new Event('change'));}, false);
    }
    
}
const delete_globals = () => {
    APP_GLOBAL['page'] = null;
    APP_GLOBAL['page_last'] = null;
    APP_GLOBAL['limit'] = null;
    APP_GLOBAL['previous_row'] = null;
    APP_GLOBAL['module_leaflet_map_zoom'] = null;
    APP_GLOBAL['module_leaflet_map_marker_div_gps'] = null;
    APP_GLOBAL['module_leaflet_map_container'] = null;
    APP_GLOBAL['service_log_scope_server'] = null;
    APP_GLOBAL['service_log_scope_service'] = null;
    APP_GLOBAL['service_log_scope_db'] = null;
    APP_GLOBAL['service_log_scope_router'] = null;
    APP_GLOBAL['service_log_scope_controller'] = null;
    APP_GLOBAL['service_log_level_verbose'] = null;
    APP_GLOBAL['service_log_level_error'] = null;
    APP_GLOBAL['service_log_level_info'] = null;
    APP_GLOBAL['service_log_destination'] = null;
    APP_GLOBAL['service_log_url_destination'] = null;
    APP_GLOBAL['service_log_url_destination_username'] = null;
    APP_GLOBAL['service_log_url_destination_password'] = null;
    APP_GLOBAL['service_log_file_interval'] = null;
    APP_GLOBAL['service_log_file_path_server'] = null;
    APP_GLOBAL['service_log_date_format'] = null;

    common.COMMON_GLOBAL['client_latitude'] = null;
    common.COMMON_GLOBAL['client_longitude'] = null;
    common.COMMON_GLOBAL['client_place'] = null;
    common.COMMON_GLOBAL['module_leaflet_style'] = null;
    common.COMMON_GLOBAL['module_leaflet_jumpto'] = null;
    common.COMMON_GLOBAL['module_leaflet_popup_offset'] = null;
}

const admin_logoff_app = (error) => {
    common.COMMON_GLOBAL['rest_admin_at'] = '';
    document.getElementById('system_admin_avatar').innerHTML = '';
    const clear_common = () => {
        delete_globals();
        document.getElementById('common_app_select_theme').style.display = 'unset';
        document.getElementById('common_app_select_theme').style.visibility = 'unset';
        document.getElementById('common_user_account').style.visibility = 'hidden';
        document.getElementById('dialogue_admin_login').style.visibility = 'visible';
        document.getElementById('menu_open').outerHTML = `<div id='menu_open' class='common_dialogue_button'></div>`;
        document.getElementById('admin_secure').style.visibility = 'hidden';
        document.getElementById('admin_secure').innerHTML = '';
        document.getElementById('menu_secure').innerHTML = '';
    }
    if (common.COMMON_GLOBAL['system_admin']==1){
        clear_common();
        common.COMMON_GLOBAL['system_admin']=0;
    }
    else
        common.user_logoff().then(() => {
            clear_common();
        })
}

const admin_exception_before = (error) => {
    common.show_message('EXCEPTION', null,null, error);
}
const init_app = (system_admin_only) => {
    setEvents(system_admin_only);
    if (system_admin_only==0)
        common.common_translate_ui(common.COMMON_GLOBAL['user_locale'], null, (err, result)=>{
            null
        });
}
const init = (parameters) => {
    //show admin login as default
    admin_login_nav(document.getElementById('admin_login_title'));

    common.init_common(parameters, (err, global_app_parameters)=>{
        document.getElementById('admin_login_title').innerHTML = common.ICONS['user'];
        document.getElementById('system_admin_login_title').innerHTML = common.ICONS['app_system_admin'];
        document.getElementById('system_admin_login_username_icon').innerHTML = common.ICONS['app_system_admin'];
        document.getElementById('system_admin_login_password_icon').innerHTML = common.ICONS['user_password'];
        
        document.getElementById('admin_login_button').innerHTML = common.ICONS['app_login'];

        document.getElementById('common_message_close').innerHTML = common.ICONS['app_close'];
        document.getElementById('admin_login_username_icon').innerHTML = common.ICONS['user'];
        document.getElementById('admin_login_password_icon').innerHTML = common.ICONS['user_password'];
        if (parameters.first_time == 1){
            document.getElementById('admin_first_time').innerHTML = common.ICONS['init'];
            document.getElementById('admin_first_time').style.display = 'block';
            document.getElementById('system_admin_login_password_confirm').style.display = 'block';
            document.getElementById('system_admin_login_password_icon_confirm').innerHTML = common.ICONS['user_password'];
        }

        if (parameters.system_admin_only == 1){
            document.getElementById('admin_login_nav').style.display = 'none';
            document.getElementById('admin_login').style.display = 'none';
            document.getElementById('system_admin_login').style.display = 'block';
        }
        else{
            for (let i = 0; i < global_app_parameters.length; i++) {
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_WIDTH')
                    common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_HEIGHT')
                    common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_COLOR_DARK')
                    common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_COLOR_LIGHT')
                    common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_FILE_PATH')
                    common.COMMON_GLOBAL['module_easy.qrcode_logo_file_path'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_WIDTH')
                    common.COMMON_GLOBAL['module_easy.qrcode_logo_width'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_HEIGHT')
                    common.COMMON_GLOBAL['module_easy.qrcode_logo_height'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_BACKGROUND_COLOR')
                    common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = global_app_parameters[i].parameter_value;
            }
        }
        init_app(parameters.system_admin_only);
    })
}
export{admin_login_nav, start_admin_secure, admin_login, setEvents, delete_globals, admin_logoff_app, admin_exception_before,
       init_app, init}