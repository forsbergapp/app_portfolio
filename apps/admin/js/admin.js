window.global_rest_admin_at = '';
function admin_login_nav(target){
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
function start_admin_secure(app){
    document.getElementById('admin_login_username_input').value='';
    document.getElementById('admin_login_password_input').value='';
    document.getElementById('system_admin_login_username_input').value='';
    document.getElementById('system_admin_login_password_input').value='';
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
async function admin_login(){
    let old_button = document.getElementById('admin_login_button').innerHTML;
    if (document.getElementById('system_admin_login').style.display == 'block'){
        let status;
        let json;
        fetch('/service/auth/admin',
        {method: 'POST',
            headers: {
            'Authorization': 'Basic ' + window.btoa(document.getElementById("system_admin_login_username_input").value + ':' + document.getElementById("system_admin_login_password_input").value)
            }
        })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(result_login) {
                document.getElementById('admin_login_button').innerHTML = old_button;
                if (status == 200){
                    json = JSON.parse(result_login);
                    window.global_rest_admin_at = json.token_at;
                    window.global_system_admin = 1;
                    updateOnlineStatus();
                    fetch('/service/forms/admin/secure',
                    {method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + window.global_rest_admin_at,
                        }
                    })
                        .then(function(response) {
                            status = response.status;
                            return response.text();
                        })
                        .then(function(result_form) {
                            if (status == 200){
                                dialogue_close('dialogue_admin_login').then(function(){
                                    document.getElementById("login_username").value='';
                                    document.getElementById("login_password").value='';                        
                                    document.getElementById('dialogue_login').style.visibility = 'hidden';
                                    start_admin_secure(JSON.parse(result_form).app)
                                    document.getElementById('system_admin_avatar').innerHTML = window.global_icon_app_system_admin;
                                })
                            }
                            else{
                                show_message('EXCEPTION', null,null, result_form, window.global_app_id);
                            }
                        })
                }
                else{
                    show_message('EXCEPTION', null,null, result_login, window.global_app_id);
                }
            })
    }
    else{
        await user_login(document.getElementById('admin_login_username_input').value, 
                         document.getElementById('admin_login_password_input').value, (err, result)=>{
            document.getElementById('admin_login_button').innerHTML = old_button;
            if (err==null){         
                dialogue_close('dialogue_admin_login').then(function(){
                    //set avatar or empty
                    document.getElementById('user_account').style.visibility = 'visible';
                    set_avatar(result.avatar, document.getElementById('user_menu_avatar_img'));
                    document.getElementById('user_menu_username').innerHTML = result.username;
                    
                    document.getElementById('user_menu_logged_in').style.display = 'inline-block';
                    document.getElementById('user_menu').classList.add('user_menu_logged_in');
                    document.getElementById('user_menu_logged_out').style.display = 'none';
    
                    document.getElementById('user_menu_username').style.display = 'block';
                    document.getElementById('user_menu_dropdown_logged_in').style.display = 'inline-block';
                    document.getElementById('user_menu_dropdown_logged_out').style.display = 'none';
    
                    start_admin_secure(result.app)
                })  
            }
        })
    }
}
function setEvents(system_admin_only=0){
    
    document.getElementById('admin_login_form').addEventListener('keyup', function(event) {
        if (event.target.id=='admin_login_username_input' ||
            event.target.id=='admin_login_password_input' ||
            event.target.id=='system_admin_login_username_input' ||
            event.target.id=='system_admin_login_password_input')
            if (event.code === 'Enter') {
                event.preventDefault();
                admin_login();
                //unfocus
                document.getElementById(event.target.id).blur();
            }
    })
    document.getElementById('admin_login_button').addEventListener('click', function() { admin_login() }, false);
    document.getElementById('admin_login_nav').addEventListener('click', function(event) { admin_login_nav(event.target) }, true);
    
    if (system_admin_only==0){
        //common
        //profile
        document.getElementById('profile_home').addEventListener('click', function() {profile_top(1);}, false);
        document.getElementById('profile_close').addEventListener('click', function() {profile_close()}, false);
        document.getElementById('profile_search_input').addEventListener('keyup', function(event) { search_input(event, null);}, false);
        document.getElementById('profile_top_row1_1').addEventListener('click', function() { profile_top(1)}, false);
        document.getElementById('profile_top_row1_2').addEventListener('click', function() { profile_top(2)}, false);
        document.getElementById('profile_top_row1_3').addEventListener('click', function() { profile_top(3)}, false);
        document.getElementById('profile_follow').addEventListener('click', function() { profile_follow_like('FOLLOW') }, false);
        document.getElementById('profile_like').addEventListener('click', function() { profile_follow_like('LIKE') }, false);
        document.getElementById('profile_main_btn_following').addEventListener('click', function() { profile_detail(1, null, true, null) }, false);
        document.getElementById('profile_main_btn_followed').addEventListener('click', function() { profile_detail(2, null, true, null) }, false);
        document.getElementById('profile_main_btn_likes').addEventListener('click', function() { profile_detail(3, null, true, null) }, false);
        document.getElementById('profile_main_btn_liked').addEventListener('click', function() { profile_detail(4, null, true, null) }, false);
        //user preferences
        document.getElementById('user_menu_username').addEventListener('click', function() { 
                                                                                    document.getElementById('dialogue_profile').style.visibility = 'visible';
                                                                                    profile_show(null,
                                                                                                null,
                                                                                                (err, result)=>{
                                                                                                    null;
                                                                                                });
                                                                                    document.getElementById('user_menu_dropdown').style='none';
                                                                                }, false);

        document.getElementById('common_app_select_theme').addEventListener('change', function() { document.body.className = 'app_theme' + document.getElementById('common_app_select_theme').value + ' ' + document.getElementById('user_arabic_script_select').value; }, false);
        document.getElementById('user_locale_select').addEventListener('change', function() { 
                                                                                    common_translate_ui(this.value, null, (err, result)=>{
                                                                                            null
                                                                                        });
                                                                                }, false);
        document.getElementById('user_arabic_script_select').addEventListener('change', function() { document.getElementById('common_app_select_theme').dispatchEvent(new Event('change'));}, false);
    }
    
}
function delete_globals(){
    //delete all globals in this file, not globals declared elsewhere
    //and not some start variables
    delete window.global_rest_app;
    delete window.global_rest_parameter_type;
    delete window.global_rest_user_account;
    delete window.global_service_geolocation;
    delete window.global_service_geolocation_gps_ip;
    delete window.global_service_geolocation_gps_place;
    delete window.global_service_log;
    delete window.global_service_log_scope_server;
    delete window.global_service_log_scope_service;
    delete window.global_service_log_scope_db;
    delete window.global_service_log_scope_router;
    delete window.global_service_log_scope_controller;
    delete window.global_service_log_level_verbose;
    delete window.global_service_log_level_error;
    delete window.global_service_log_level_info;                        
    delete window.global_service_log_destination;
    delete window.global_service_log_url_destination;
    delete window.global_service_log_url_destination_username;
    delete window.global_service_log_url_destination_password;
    delete window.global_service_log_file_interval;
    delete window.global_service_log_file_path_server;
    delete window.global_service_log_date_format;
    delete window.global_gps_map_container;
    delete window.global_gps_map_zoom;
    delete window.global_service_map_style;
    delete window.global_service_map_flyto;
    delete window.global_service_map_jumpto;
    delete window.global_service_map_popup_offset;
    delete window.global_gps_map_marker_div_gps;
    delete window.global_client_latitude;
    delete window.global_client_longitude;
    delete window.global_client_place;
    delete window.global_page;
    delete window.global_page_last;
    delete window.global_limit;
    delete window.global_previous_row;
}

function admin_logoff_app(app_id, error){
    window.global_rest_admin_at = '';
    document.getElementById('system_admin_avatar').innerHTML = '';
    function clear_common(){
        delete_globals();
        document.getElementById('user_account').style.visibility = 'hidden';
        document.getElementById('dialogue_admin_login').style.visibility = 'visible';
        document.getElementById('menu_open').outerHTML = `<div id='menu_open' class='dialogue_button'></div>`;
        document.getElementById('admin_secure').style.visibility = 'hidden';
        document.getElementById('admin_secure').innerHTML = '';
        document.getElementById('menu_secure').innerHTML = '';
    }
    if (window.global_system_admin==1){
        clear_common();
        window.global_system_admin=0;
    }
    else
        user_logoff().then(function(){
            clear_common();
        })
}

function admin_exception_before(app_id, error){
    show_message('EXCEPTION', null,null, error, app_id);
}
function init_app(system_admin_only){
    setEvents(system_admin_only);
    if (system_admin_only==0)
        common_translate_ui(window.global_user_locale, null, (err, result)=>{
            null
        });
}
function init(parameters){
    //show admin login as default
    admin_login_nav(document.getElementById('admin_login_title'));

    init_common(parameters, (err, global_app_parameters)=>{
        document.getElementById('admin_login_title').innerHTML = window.global_icon_user;
        document.getElementById('system_admin_login_title').innerHTML = window.global_icon_app_system_admin;
        document.getElementById('system_admin_login_username_icon').innerHTML = window.global_icon_app_system_admin;
        document.getElementById('system_admin_login_password_icon').innerHTML = window.global_icon_user_password;
        document.getElementById('admin_login_button').innerHTML = window.global_icon_app_login;

        document.getElementById('message_close').innerHTML = window.global_icon_app_close;
        document.getElementById('admin_login_username_icon').innerHTML = window.global_icon_user;
        document.getElementById('admin_login_password_icon').innerHTML = window.global_icon_user_password;
        if (parameters.system_admin_only == 1){
            document.getElementById('admin_login_nav').style.display = 'none';
            document.getElementById('admin_login').style.display = 'none';
            document.getElementById('system_admin_login').style.display = 'block';
        }
        else{
            for (let i = 0; i < global_app_parameters.length; i++) {
                //QR
                if (global_app_parameters[i].parameter_name=='QR_LOGO_FILE_PATH')
                    window.global_qr_logo_file_path = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='QR_WIDTH')
                    window.global_qr_width = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='QR_HEIGHT')
                    window.global_qr_height = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='QR_COLOR_DARK')
                    window.global_qr_color_dark = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='QR_COLOR_LIGHT')
                    window.global_qr_color_light = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='QR_LOGO_WIDTH')
                    window.global_qr_logo_width = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='QR_LOGO_HEIGHT')
                    window.global_qr_logo_height = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='QR_BACKGROUND_COLOR')
                    window.global_qr_background_color = global_app_parameters[i].parameter_value;
            }
        }
        init_app(parameters.system_admin_only);
    })
}