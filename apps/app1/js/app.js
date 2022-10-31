window.global_app_email;
window.global_img_diagram_img = '/app1/images/app_portfolio.png';
window.global_img_datamodel_img = '/app1/images/data_model.png';


window.global_qr_width;
window.global_qr_height;
window.global_qr_color_dark;
window.global_qr_color_light;
window.global_qr_logo_file_path;
window.global_qr_logo_width;
window.global_qr_logo_height;
window.global_qr_background_color;

function show_hide_apps_dialogue(){
    if (document.getElementById('dialogue_start_content').style.visibility=='visible' ||
        document.getElementById('dialogue_start_content').style.visibility==''){
        document.getElementById('dialogue_start_content').style.visibility='hidden';
        document.getElementById('dialogue_info_content').style.visibility='hidden';
    }
    else{
        document.getElementById('dialogue_start_content').style.visibility='visible';
        document.getElementById('dialogue_info_content').style.visibility='visible';
    }
}
function setEvents(){

    //app
    document.getElementById('theme_background').addEventListener('click', function() { show_hide_apps_dialogue()  }, false);

    //
    //user menu
    
    document.getElementById('user_menu_username').addEventListener('click', function() { user_menu_item_click(this) }, false);

    document.getElementById('toggle_checkbox').addEventListener('click', function() { toggle_switch() }, false);
    document.getElementById('user_menu_dropdown_log_out').addEventListener('click', function() { user_menu_item_click(this) }, false);
    document.getElementById('user_menu_dropdown_profile_top').addEventListener('click', function() {user_menu_item_click(this)}, false);
    document.getElementById('user_locale_select').addEventListener('change', function() { document.getElementById('apps').innerHTML = window.global_app_spinner;common_translate_ui(this.value, (err, result)=>{get_apps()});}, false);
    document.getElementById('user_arabic_script_select').addEventListener('change', function() { toggle_switch()}, false);

    //start page
    document.getElementById( 'start_message' ).addEventListener( 'click', function( event ) {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-1';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-2';
    }, false );
    //second page
    document.getElementById('info_diagram').addEventListener('click', function() {show_window_info(0, true, window.global_img_diagram_img)}, false);
    document.getElementById('info_datamodel').addEventListener('click', function() {show_window_info(0, true, window.global_img_datamodel_img)}, false);
   
    document.getElementById( 'info_message' ).addEventListener( 'click', function( event ) {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip';
    }, false );
    //common with app specific settings
    //dialogue profile
    document.getElementById('profile_home').addEventListener('click', function() {profile_top(1);}, false);
    document.getElementById('profile_close').addEventListener('click', function() {profile_close()}, false);
    document.getElementById('profile_search_input').addEventListener('keyup', function(event) { search_input(event, null);}, false);
    document.getElementById('profile_top_row1_1').addEventListener('click', function() { profile_top(1)}, false);
    document.getElementById('profile_top_row1_2').addEventListener('click', function() { profile_top(2)}, false);
    document.getElementById('profile_top_row1_3').addEventListener('click', function() { profile_top(3)}, false);
    document.getElementById('profile_follow').addEventListener('click', function() { user_function_app('FOLLOW') }, false);
	document.getElementById('profile_like').addEventListener('click', function() { user_function_app('LIKE') }, false);
    document.getElementById('profile_main_btn_following').addEventListener('click', function() { profile_detail(1, null, true, null) }, false);
    document.getElementById('profile_main_btn_followed').addEventListener('click', function() { profile_detail(2, null, true, null) }, false);
    document.getElementById('profile_main_btn_likes').addEventListener('click', function() { profile_detail(3, null, true, null) }, false);
    document.getElementById('profile_main_btn_liked').addEventListener('click', function() { profile_detail(4, null, true, null) }, false);
    document.getElementById('profile_main_btn_cloud').addEventListener('click', function() { profile_detail(5, window.global_rest_user_account_app + 'apps/', true, global_icon_sky_cloud, null) }, false);
    //dialogue login/signup/forgot
    let input_username_login = document.getElementById("login_username");
    input_username_login.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            user_login_app().then(function(){
                //unfocus
                document.getElementById("login_username").blur();
            });
        }
    });
    let input_password_login = document.getElementById("login_password");
    input_password_login.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            user_login_app().then(function(){
                //unfocus
                document.getElementById("login_password").blur();
            });
        }
    });
    document.getElementById('login_button').addEventListener('click', function() { user_login_app() }, false);    
    document.getElementById('signup_button').addEventListener('click', function() { user_signup() }, false);
    //dialogue user edit
    document.getElementById('user_edit_close').addEventListener('click', function() { dialogue_user_edit_clear() }, false);
    document.getElementById('user_edit_btn_avatar_img').addEventListener('click', function() { document.getElementById('user_edit_input_avatar_img').click() }, false);
    document.getElementById('user_edit_input_avatar_img').addEventListener('change', function() { show_image(document.getElementById('user_edit_avatar_img'), this.id, window.global_image_avatar_width, window.global_image_avatar_height); }, false);
    document.getElementById('user_edit_close').addEventListener('click', function() { document.getElementById('dialogue_user_edit').style.visibility = 'hidden' }, false);    
    document.getElementById('user_edit_btn_user_update').addEventListener('click', function() { user_update_app(); }, false);
    document.getElementById('user_edit_btn_user_delete_account').addEventListener('click', function() { user_delete_app(); }, false);
    //dialogue verify
    document.getElementById('user_verify_verification_char1').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char2") }, false);
    document.getElementById('user_verify_verification_char2').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char3") }, false);
    document.getElementById('user_verify_verification_char3').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char4") }, false);
    document.getElementById('user_verify_verification_char4').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char5") }, false);
    document.getElementById('user_verify_verification_char5').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char6") }, false);
    document.getElementById('user_verify_verification_char6').addEventListener('keyup', function() { user_verify_check_input_app(this, "") }, false);
}
function toggle_switch(){
    if(document.getElementById('toggle_checkbox').checked){
        document.body.className = 'theme_sun ' + document.getElementById('user_arabic_script_select').value;
    }
    else{
        document.body.className = 'theme_moon ' + document.getElementById('user_arabic_script_select').value;
    }
    return null;
}

function get_apps() {
    let json;
    let old_button = document.getElementById('apps').innerHTML;

    common_fetch(window.global_rest_url_base + window.global_rest_app + `?id=${window.global_common_app_id}`, 
                 'GET', 0, null, null,null, (err, result) =>{
        if (err)
            document.getElementById('apps').innerHTML = old_button;
        else{
            json = JSON.parse(result);
            let html ='';
            for (var i = 0; i < json.data.length; i++) {
                html +=`<div class='app_link_row'>
                            <div class='app_link_col'>
                                <div class='app_id'>${json.data[i].id}</div>
                            </div>
                            <div class='app_link_col'>
                                <div class='app_url'>${json.data[i].url}</div>
                            </div>
                            <div class='app_link_col'>
                                <img class='app_logo' src='${json.data[i].logo}' />
                            </div>
                            <div class='app_link_col'>
                                <div class='app_name'>${json.data[i].app_name}</div>
                                <div class='app_category'>${json.data[i].app_category==null?'':json.data[i].app_category}</div>
                                <div class='app_description'>${json.data[i].app_description==null?'':json.data[i].app_description}</div>
                            </div>
                        </div>`;
            }
            var clickappevent = function(event) { 
                window.open(event.target.parentNode.parentNode.children[1].children[0].innerHTML);};

            document.querySelectorAll('.app_logo').forEach(e => e.removeEventListener('click', clickappevent));
            document.getElementById('apps').innerHTML = html;
            document.querySelectorAll('.app_logo').forEach(e => e.addEventListener('click', clickappevent));
        }
    })
}

function user_menu_item_click(item){
    switch (item.id){
        case 'user_menu_username':{
            document.getElementById('dialogue_profile').style.visibility = 'visible';
            profile_show(null,
                         null,
                        (err, result)=>{
                            null;
                        });
            break;
        }
        case 'user_menu_dropdown_log_out':{
            user_logoff_app();            
            break;
        }
        case 'user_menu_dropdown_profile_top':{
            profile_top(1)
            break;
        }
        default:
            break;
    }
    document.getElementById('user_menu_dropdown').style='none';
}
async function user_login_app(){
    let username = document.getElementById('login_username');
    let password = document.getElementById('login_password');
    let old_button = document.getElementById('login_button').innerHTML;
    document.getElementById('login_button').innerHTML = window.global_app_spinner;
            
    await user_login(username.value, password.value, (err, result)=>{
        document.getElementById('login_button').innerHTML = old_button;
        if (err==null){            
            //set avatar or empty
            set_avatar(result.avatar, document.getElementById('user_menu_avatar_img'));
            document.getElementById('user_menu_username').innerHTML = result.username;
            
            document.getElementById('user_menu_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu').classList.add('user_menu_logged_in');
            document.getElementById('user_menu_logged_out').style.display = 'none';

            document.getElementById('user_menu_username').style.display = 'block';
            document.getElementById('user_menu_dropdown_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu_dropdown_logged_out').style.display = 'none';

            dialogue_login_clear();
            dialogue_signup_clear();
        }
        
    })
}
function app_exception(){
    user_logoff_app();
}
function user_logoff_app() {
    user_logoff().then(function(){
        set_avatar(null, document.getElementById('user_menu_avatar_img'));
        document.getElementById('user_menu_username').style.display = 'none';
        document.getElementById('user_menu_username').innerHTML = '';
        document.getElementById('user_menu_logged_in').style.display = 'none';
        document.getElementById('user_menu').classList.remove('user_menu_logged_in');
        document.getElementById('user_menu_logged_out').style.display = 'inline-block';
        document.getElementById('user_menu_dropdown_logged_in').style.display = 'none';
        document.getElementById('user_menu_dropdown_logged_out').style.display = 'inline-block';
    })
}
async function user_update_app(){
    await user_update((err, result) => {
        if (err==null){
            set_avatar(result.avatar, document.getElementById('user_menu_avatar_img'));
            document.getElementById('user_menu_username').innerHTML = result.username;
        }
    });
}
async function user_verify_check_input_app(item, nextField){
    await user_verify_check_input(item, nextField, (err, result) => {
        if ((err==null && result==null)==false)
            if(err==null){
                //login if LOGIN  or SIGNUP were verified successfully
                if (result.verification_type==1 ||
                    result.verification_type==2)
                    user_login_app();
            }
    })
}
async function user_function_app(function_name){
    await user_function(function_name, (err, result) => {
        if (err==null){
            profile_update_stat();
        }
    })
}
async function  user_delete_app(){
    let user_local;
    if (document.getElementById('user_edit_local').style.display == 'block')
        user_local = true;
    else
        user_local = false;
    let function_delete_user_account = function() { 
                                            document.getElementById('dialogue_message').style.visibility = 'hidden';
                                            user_delete(1, user_local, null, (err, result)=>{
                                                if (err==null){
                                                    user_logoff_app();
                                                }
                                            }) 
                                        };
    await user_delete(null, user_local, function_delete_user_account, (err, result) =>{
        if (err==null){
            user_logoff_app();
        }
    })
}
async function ProviderUser_update_app(identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email){
    await ProviderUser_update(identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, (err, result)=>{
        if(err==null){
            //set avatar or empty
            set_avatar(result.avatar, document.getElementById('user_menu_avatar_img'));
            document.getElementById('user_menu_username').innerHTML = result.username;

            document.getElementById('user_menu_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu').classList.add('user_menu_logged_in');
            document.getElementById('user_menu_logged_out').style.display = 'none';

            document.getElementById('user_menu_dropdown_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu_dropdown_logged_out').style.display = 'none';
        }
    })
}
async function ProviderSignIn_app(provider_button){
    await ProviderSignIn(provider_button, (err, result)=>{
        if (err==null){
            ProviderUser_update_app(result.identity_provider_id, 
                                   result.profile_id, 
                                   result.profile_first_name, 
                                   result.profile_last_name, 
                                   result.profile_image_url, 
                                   result.profile_email);
        }
    })
}
async function init_app(){
    //start
    document.getElementById('about_name').innerHTML = window.global_app_name;
    document.getElementById('start_message').innerHTML = window.global_icon_app_info;    
    //theme switcher
    document.getElementById("toggle_checkbox").checked = true;
    //info
    document.getElementById('info_diagram_img').src=window.global_img_diagram_img;
    document.getElementById('info_datamodel_img').src=window.global_img_datamodel_img;
    document.getElementById('title1').innerHTML = 'App Portfolio Diagram';
    document.getElementById('title2').innerHTML = 'App Portfolio Data model';
    document.getElementById('info_message').innerHTML = window.global_icon_app_close;
    document.getElementById('contact_text').innerHTML = 'Contact'    
    document.getElementById('copyright').innerHTML = window.global_app_copyright;
    document.getElementById('app_email').href='mailto:' + window.global_app_email;
    document.getElementById('app_email').innerHTML=window.global_app_email;

    if (window.global_info_social_link1_url)
        document.getElementById('social_link1').addEventListener('click', function() { window.open(window.global_info_social_link1_url,'_blank',''); }, false);
    if (window.global_info_social_link2_url)
        document.getElementById('social_link2').addEventListener('click', function() { window.open(window.global_info_social_link2_url,'_blank',''); }, false);
    if (window.global_info_social_link3_url)
        document.getElementById('social_link3').addEventListener('click', function() { window.open(window.global_info_social_link3_url,'_blank',''); }, false);
    if (window.global_info_social_link4_url)
        document.getElementById('social_link4').addEventListener('click', function() { window.open(window.global_info_social_link4_url,'_blank',''); }, false);            

    if (window.global_info_social_link1_url!=null)
        document.getElementById('social_link1').innerHTML = window.global_info_social_link1_icon;;
    if (window.global_info_social_link2_url!=null)
        document.getElementById('social_link2').innerHTML = window.global_info_social_link2_icon;;
    if (window.global_info_social_link3_url!=null)
        document.getElementById('social_link3').innerHTML = window.global_info_social_link3_icon;;
    if (window.global_info_social_link4_url!=null)
        document.getElementById('social_link4').innerHTML = window.global_info_social_link4_icon;;
    document.getElementById('info_link1').innerHTML = window.global_info_link_policy_name;
    document.getElementById('info_link2').innerHTML = window.global_info_link_disclaimer_name;
    document.getElementById('info_link3').innerHTML = window.global_info_link_terms_name;
    document.getElementById('info_link4').innerHTML = window.global_info_link_about_name;

    document.getElementById('info_link1').addEventListener('click', function() { show_window_info(1);}, false);
    document.getElementById('info_link2').addEventListener('click', function() { show_window_info(2);}, false);
    document.getElementById('info_link3').addEventListener('click', function() { show_window_info(3);}, false);
    document.getElementById('info_link4').addEventListener('click', function() { show_window_info(4);}, false);

    //profile info
    document.getElementById('profile_main_btn_cloud').innerHTML = window.global_icon_sky_cloud;
    
    setEvents();
    zoom_info('');
    move_info(null,null);
}

function init(parameters){
    init_common(parameters, (err, global_app_parameters)=>{
        if (err)
            null;
        else{
            for (var i = 0; i < global_app_parameters.length; i++) {
                if (global_app_parameters[i].parameter_name=='APP_COPYRIGHT')
                    window.global_app_copyright =global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='APP_EMAIL') //0
                    window.global_app_email = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK1_URL')
                    window.global_info_social_link1_url = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK2_URL')
                    window.global_info_social_link2_url = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK3_URL')
                    window.global_info_social_link3_url = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK4_URL')
                    window.global_info_social_link4_url = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK1_ICON')
                    window.global_info_social_link1_name = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK2_ICON')
                    window.global_info_social_link2_name = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK3_ICON')
                    window.global_info_social_link3_name = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK4_ICON')
                    window.global_info_social_link4_name = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_POLICY_URL')
                    window.global_info_link_policy_url = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_DISCLAIMER_URL')
                    window.global_info_link_disclaimer_url = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_TERMS_URL')
                    window.global_info_link_terms_url = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_ABOUT_URL')
                    window.global_info_link_about_url = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_POLICY_NAME')
                    window.global_info_link_policy_name = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_DISCLAIMER_NAME')
                    window.global_info_link_disclaimer_name = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_TERMS_NAME')
                    window.global_info_link_terms_name = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_ABOUT_NAME')
                    window.global_info_link_about_name = global_app_parameters[i].parameter_value;
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
            init_app().then(function(){
                document.getElementById('apps').innerHTML = window.global_app_spinner;
                common_translate_ui(window.global_user_locale, (err, result)=>{
                        get_apps();
                })
                async function show_start(){
                    let user = window.location.pathname.substring(1);
                    if (user !='') {
                        //show profile for user entered in url
                        document.getElementById('dialogue_profile').style.visibility = "visible";
                        profile_show(null, 
                                        user,
                                        (err, result)=>{
                                        null;
                                        });
                    }
                }
                show_start().then(function(){
                    Providers_init(function() { ProviderSignIn_app(this); });
                })
            })
        }
    })
}
