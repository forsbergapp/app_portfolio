window.global_app_email;
window.global_img_diagram_img = '/info/app_portfolio.jpg';
window.global_img_datamodel_img = '/info/datamodel.jpg';


window.global_qr_width;
window.global_qr_height;
window.global_qr_color_dark;
window.global_qr_color_light;
window.global_qr_logo_file_path;
window.global_qr_logo_width;
window.global_qr_logo_height;
window.global_qr_background_color;

function setEvents(){

    //app
    //user menu
    
    document.getElementById('user_menu_username').addEventListener('click', function() { user_menu_item_click(this) }, false);

    document.getElementById('toggle_checkbox').addEventListener('click', function() { toggle_switch() }, false);
    document.getElementById('user_menu_dropdown_edit').addEventListener('click', function() { user_menu_item_click(this) }, false);
    document.getElementById('user_menu_dropdown_log_out').addEventListener('click', function() { user_menu_item_click(this) }, false);
    document.getElementById('user_menu_dropdown_signup').addEventListener('click', function() { user_menu_item_click(this) }, false);
    document.getElementById('user_menu_dropdown_log_in').addEventListener('click', function() { user_menu_item_click(this) }, false);
    //start page
    document.getElementById( 'start_message' ).addEventListener( 'click', function( event ) {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-1';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-2';
    }, false );
    //second page
    document.getElementById('info_diagram').addEventListener('click', function() {show_window_info(0, true, `<img src="${window.global_img_diagram_img}"/>`);}, false);
    document.getElementById('info_datamodel').addEventListener('click', function() {show_window_info(0, true, `<img src="${window.global_img_datamodel_img}"/>`);}, false);
   
    document.getElementById( 'info_message' ).addEventListener( 'click', function( event ) {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip';
    }, false );
    //common with app specific settings
    //dialogue profile
    document.getElementById('profile_home').addEventListener('click', function() {profile_home(Intl.DateTimeFormat().resolvedOptions().timeZone);}, false);
    document.getElementById('profile_close').addEventListener('click', function() {profile_close()}, false);
    document.getElementById('profile_search_input').addEventListener('keyup', function() { window.global_typewatch("search_profile(Intl.DateTimeFormat().resolvedOptions().timeZone, null);", 500); }, false);
    document.getElementById('profile_top_row1_1').addEventListener('click', function() { profile_top(1, Intl.DateTimeFormat().resolvedOptions().timeZone)}, false);
    document.getElementById('profile_top_row1_2').addEventListener('click', function() { profile_top(2, Intl.DateTimeFormat().resolvedOptions().timeZone)}, false);
    document.getElementById('profile_top_row1_3').addEventListener('click', function() { profile_top(3, Intl.DateTimeFormat().resolvedOptions().timeZone)}, false);
    document.getElementById('profile_follow').addEventListener('click', function() { user_function_app('FOLLOW') }, false);
	document.getElementById('profile_like').addEventListener('click', function() { user_function_app('LIKE') }, false);
    document.getElementById('profile_main_btn_following').addEventListener('click', function() { profile_detail(1, Intl.DateTimeFormat().resolvedOptions().timeZone, null, true, null) }, false);
    document.getElementById('profile_main_btn_followed').addEventListener('click', function() { profile_detail(2, Intl.DateTimeFormat().resolvedOptions().timeZone, null, true, null) }, false);
    document.getElementById('profile_main_btn_likes').addEventListener('click', function() { profile_detail(3, Intl.DateTimeFormat().resolvedOptions().timeZone, null, true, null) }, false);
    document.getElementById('profile_main_btn_liked').addEventListener('click', function() { profile_detail(4, Intl.DateTimeFormat().resolvedOptions().timeZone, null, true, null) }, false);
    document.getElementById('profile_main_btn_cloud').addEventListener('click', function() { profile_detail(5, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_rest_user_account_app, true, global_button_default_icon_cloud, null) }, false);
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
    document.getElementById('user_edit_input_avatar_img').addEventListener('change', function() { show_image(document.getElementById('user_edit_avatar_img'), this.id, window.global_user_image_avatar_width, window.global_user_image_avatar_height); }, false);
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
    if(document.getElementById('toggle_checkbox').checked)
        document.body.className = 'theme_sun';
    else
        document.body.className = 'theme_moon';
    return null;
}

function get_apps() {
	let status;
    let json;
    let old_button = document.getElementById('apps').innerHTML;
    document.getElementById('apps').innerHTML = window.global_button_spinner;
    fetch(window.global_rest_url_base + window.global_rest_app + '?id=' + window.global_app_id,
    {method: 'GET',
     headers: {
			'Authorization': 'Bearer ' + window.global_rest_dt
        }
    })
      .then(function(response) {
            status = response.status;
            return response.text();
      })
      .then(function(result) {
          if (status == 200){
            json = JSON.parse(result);
            let html='';
            for (var i = 0; i < json.data.length; i++) {
                if (i!=0){
                    html +=`<div class='app_link'>
                                <div class='app_url'>${json.data[i].url}</div>
                                <div class='app_logo_div'><img class='app_logo' src='${json.data[i].logo}' /></div>
                                <div class='app_name'>${json.data[i].app_name}</div>
                            </div>`;
                }
            }
            document.getElementById('apps').innerHTML = html;
            document.querySelectorAll('.app_link').forEach(e => e.addEventListener('click', function(event) {
                window.open(event.target.parentNode.parentNode.children[0].innerHTML);
            }))
          }
          else{
            document.getElementById('apps').innerHTML = old_button;
            show_message('EXCEPTION', null,null, result, window.global_app_id);
          }
        });
}

async function get_parameters() {
    let status;
    let json;
    await fetch( window.global_rest_url_base + window.global_rest_app_parameter + window.global_app_id,
                {method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + window.global_rest_dt
                }
                })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status==200){
            json = JSON.parse(result);
            for (var i = 0; i < json.data.length; i++) {
                //app 0 variables same for all apps
                if (json.data[i].parameter_name=='IMAGE_FILE_ALLOWED_TYPE1')
                    window.global_image_file_allowed_type1 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='IMAGE_FILE_ALLOWED_TYPE2')
                    window.global_image_file_allowed_type2 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='IMAGE_FILE_ALLOWED_TYPE3')
                    window.global_image_file_allowed_type3 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='IMAGE_FILE_MIME_TYPE')
                    window.global_image_file_mime_type = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='IMAGE_FILE_MAX_SIZE')
                    window.global_image_file_max_size = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_IMAGE_AVATAR_WIDTH')
                    window.global_user_image_avatar_width = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_IMAGE_AVATAR_HEIGHT')
                    window.global_user_image_avatar_height = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER1_USE')
                    window.global_app_user_provider1_use = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER1_ID')
                    window.global_app_user_provider1_id = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER1_NAME')
                    window.global_app_user_provider1_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER1_API_SRC')
                    window.global_app_user_provider1_api_src = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_USE')
                    window.global_app_user_provider2_use = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_ID')
                    window.global_app_user_provider2_id = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_NAME')
                    window.global_app_user_provider2_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_API_VERSION')
                    window.global_app_user_provider2_api_version = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_API_SRC')
                    window.global_app_user_provider2_api_src = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_API_SRC2')
                    window.global_app_user_provider2_api_src2 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP')
                    window.global_rest_app = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP_OBJECT')
                    window.global_rest_app_object = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_MESSAGE_TRANSLATION')
                    window.global_rest_message_translation = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT')
                    window.global_rest_user_account = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_ACTIVATE')
                    window.global_rest_user_account_activate = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_COMMON')
                    window.global_rest_user_account_common = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_APP')
                    window.global_rest_user_account_app = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_FOLLOW')
                    window.global_rest_user_account_follow = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_FORGOT')
                    window.global_rest_user_account_forgot = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_LIKE')
                    window.global_rest_user_account_like = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_LOGIN')
                    window.global_rest_user_account_login = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_DETAIL')
                    window.global_rest_user_account_profile_detail = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_SEARCHA')
                    window.global_rest_user_account_profile_searchA = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_SEARCHD')
                    window.global_rest_user_account_profile_searchD = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_TOP')
                    window.global_rest_user_account_profile_top = json.data[i].parameter_value;                        
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_USERID')
                    window.global_rest_user_account_profile_userid = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_USERNAME')
                    window.global_rest_user_account_profile_username = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROVIDER')
                    window.global_rest_user_account_provider = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_SIGNUP')
                    window.global_rest_user_account_signup = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PASSWORD')
                    window.global_rest_user_account_password = json.data[i].parameter_value;
                //app 0 specific variables
                if (json.data[i].parameter_name=='APP_COPYRIGHT')
                    window.global_app_copyright =json.data[i].parameter_value;
                if (json.data[i].parameter_name=='APP_EMAIL') //0
                    window.global_app_email = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_SOCIAL_LINK1_URL')
                    window.global_info_social_link1_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_SOCIAL_LINK2_URL')
                    window.global_info_social_link2_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_SOCIAL_LINK3_URL')
                    window.global_info_social_link3_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_SOCIAL_LINK4_URL')
                    window.global_info_social_link4_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_SOCIAL_LINK1_ICON')
                    window.global_info_social_link1_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_SOCIAL_LINK2_ICON')
                    window.global_info_social_link2_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_SOCIAL_LINK3_ICON')
                    window.global_info_social_link3_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_SOCIAL_LINK4_ICON')
                    window.global_info_social_link4_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK_POLICY_URL')
                    window.global_info_link_policy_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK_DISCLAIMER_URL')
                    window.global_info_link_disclaimer_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK_TERMS_URL')
                    window.global_info_link_terms_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK_ABOUT_URL')
                    window.global_info_link_about_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK_POLICY_NAME')
                    window.global_info_link_policy_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK_DISCLAIMER_NAME')
                    window.global_info_link_disclaimer_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK_TERMS_NAME')
                    window.global_info_link_terms_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK_ABOUT_NAME')
                    window.global_info_link_about_name = json.data[i].parameter_value;
                //QR
                if (json.data[i].parameter_name=='QR_LOGO_FILE_PATH')
                    window.global_qr_logo_file_path = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='QR_WIDTH')
                    window.global_qr_width = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='QR_HEIGHT')
                    window.global_qr_height = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='QR_COLOR_DARK')
                    window.global_qr_color_dark = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='QR_COLOR_LIGHT')
                    window.global_qr_color_light = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='QR_LOGO_WIDTH')
                    window.global_qr_logo_width = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='QR_LOGO_HEIGHT')
                    window.global_qr_logo_height = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='QR_BACKGROUND_COLOR')
                    window.global_qr_background_color = json.data[i].parameter_value;
            }
        }
        else
            show_message('EXCEPTION', null,null, result, window.global_app_id);
    });
}

function user_menu_item_click(item){
    switch (item.id){
        case 'user_menu_username':{
            //profile_home();
            document.getElementById('dialogue_profile').style.visibility = 'visible';
            profile_show(null,
                         null,
                         Intl.DateTimeFormat().resolvedOptions().timeZone,
                        (err, result)=>{
                            null;
                        });
            break;
        }
        case 'user_menu_dropdown_edit':{
            user_edit_app();
            break;
        }
        case 'user_menu_dropdown_log_out':{
            user_logoff_app();            
            break;
        }
        case 'user_menu_dropdown_signup':{
            show_common_dialogue('SIGNUP');
            break;
        }
        case 'user_menu_dropdown_log_in':{
            show_common_dialogue('LOGIN');
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
    document.getElementById('login_button').innerHTML = window.global_button_spinner;
            
    await user_login(username.value, password.value, (err, result)=>{
        document.getElementById('login_button').innerHTML = old_button;
        if (err==null){            
            //set avatar or empty
            set_avatar(result.avatar, document.getElementById('user_menu_avatar_img'));
            document.getElementById('user_menu_username').innerHTML = result.username;
            
            document.getElementById('user_menu_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu').classList.add('user_menu_logged_in');
            document.getElementById('user_menu_logged_out').style.display = 'none';

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
        document.getElementById('user_menu_username').innerHTML = '';
        document.getElementById('user_menu_logged_in').style.display = 'none';
        document.getElementById('user_menu').classList.remove('user_menu_logged_in');
        document.getElementById('user_menu_logged_out').style.display = 'inline-block';
        document.getElementById('user_menu_dropdown_logged_in').style.display = 'none';
        document.getElementById('user_menu_dropdown_logged_out').style.display = 'inline-block';
    })
}
async function user_edit_app() {
    await user_edit(Intl.DateTimeFormat().resolvedOptions().timeZone,(err, result) => {
        if ((err==null && result==null) == false)
            if (err==null){
                set_avatar(result.avatar ?? result.provider1_image ?? result.provider2_image, document.getElementById('user_menu_avatar_img'));
            }
    });
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
                //login if LOGIN  or SIGNUP were verified succesfully
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
async function updateProviderUser_app(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email){
    await updateProviderUser(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, (err, result)=>{
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
async function onProviderSignIn_app(provider1User){
    await onProviderSignIn(provider1User, (err, result)=>{
        if (err==null){
            updateProviderUser_app(result.provider_no, 
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
    document.getElementById('start_message').innerHTML = window.global_button_default_icon_info;
    document.getElementById('start_profile').innerHTML = window.global_button_default_icon_user;
    document.getElementById('info_message').innerHTML = window.global_button_default_icon_close;
    document.getElementById("toggle_checkbox").checked = true;
    document.getElementById('info_diagram_img').src=window.global_img_diagram_img;
    document.getElementById('info_datamodel_img').src=window.global_img_datamodel_img;
    document.getElementById('title1').innerHTML = 'App Portfolio Diagram';
    document.getElementById('title2').innerHTML = 'App Portfolio Data model';
    document.getElementById('contact_text').innerHTML = 'Contact'    
    //user menu
    //document.getElementById('user_menu_dropdown_profile').innerHTML = window.global_button_default_icon_profile;
    document.getElementById('user_menu_dropdown_edit').innerHTML = window.global_button_default_icon_edit;
    document.getElementById('user_menu_dropdown_log_out').innerHTML = window.global_button_default_icon_logoff;
    document.getElementById('user_menu_dropdown_signup').innerHTML = window.global_button_default_icon_signup;
    document.getElementById('user_menu_dropdown_log_in').innerHTML = window.global_button_default_icon_login;
    //profile info
    document.getElementById('profile_main_btn_cloud').innerHTML = window.global_button_default_icon_cloud;
    document.getElementById('user_menu_default_avatar').innerHTML = window.global_button_default_icon_user_avatar;
    
    setEvents();
    zoom_info('');
    move_info(null,null);
    await get_data_token();
}

function init(parameters){
    init_common(parameters);
    init_app().then(function(){
        get_parameters().then(function(){
            
            if (window.global_info_social_link1_url)
                document.getElementById('social_link1').addEventListener('click', function() { window.open(window.global_info_social_link1_url,'_blank',''); }, false);
            if (window.global_info_social_link2_url)
                document.getElementById('social_link2').addEventListener('click', function() { window.open(window.global_info_social_link2_url,'_blank',''); }, false);
            if (window.global_info_social_link3_url)
                document.getElementById('social_link3').addEventListener('click', function() { window.open(window.global_info_social_link3_url,'_blank',''); }, false);
            if (window.global_info_social_link4_url)
                document.getElementById('social_link4').addEventListener('click', function() { window.open(window.global_info_social_link4_url,'_blank',''); }, false);            

            document.getElementById('info_link1').addEventListener('click', function() { show_window_info(1);}, false);
            document.getElementById('info_link2').addEventListener('click', function() { show_window_info(2);}, false);
            document.getElementById('info_link3').addEventListener('click', function() { show_window_info(3);}, false);
            document.getElementById('info_link4').addEventListener('click', function() { show_window_info(4);}, false);

            document.getElementById('start_profile').addEventListener('click', function() {profile_home(Intl.DateTimeFormat().resolvedOptions().timeZone)}, false);
            common_translate_ui(window.global_lang_code);
            document.getElementById('copyright').innerHTML = window.global_app_copyright;
            document.getElementById('app_email').href='mailto:' + window.global_app_email;
            document.getElementById('app_email').innerHTML=window.global_app_email;
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
            get_apps();
            async function show_start(){
                let user = window.location.pathname.substring(1);
                if (user !='') {
                    //show profile for user entered in url
                    document.getElementById('dialogue_profile').style.visibility = "visible";
                    profile_show(null, 
                                 user, 
                                 Intl.DateTimeFormat().resolvedOptions().timeZone,
                                 (err, result)=>{
                                    null;
                                 });
                }
            }
            show_start().then(function(){
                init_providers('onProviderSignIn_app', function() { onProviderSignIn_app() }).then(function(){
                    null;
                });
            })
        })
    })
}
