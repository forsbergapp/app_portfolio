window.global_app_email;
window.global_img_diagram_img = '/app0/info/app_portfolio.jpg';
window.global_img_datamodel_img = '/app0/info/datamodel.jpg';


window.global_qr_width;
window.global_qr_height;
window.global_qr_color_dark;
window.global_qr_color_light;
window.global_qr_logo_file_path;
window.global_qr_logo_width;
window.global_qr_logo_height;
window.global_qr_background_color;

function keyfunctions(){

    document.getElementById('toggle_checkbox').addEventListener('click', function() { toggle_switch() }, false);
    document.getElementById('login_close').addEventListener('click', function() { document.getElementById('dialogue_login').style.visibility = 'hidden' }, false);
    document.getElementById('info_diagram').addEventListener('click', function() {info(1);}, false);
    document.getElementById('info_datamodel').addEventListener('click', function() {info(2);}, false);
    document.getElementById('toolbar_btn_close').addEventListener('click', function() {info(3);}, false);
    document.getElementById('toolbar_btn_zoomout').addEventListener('click', function() {zoom_info(-1);}, false);
    document.getElementById('toolbar_btn_zoomin').addEventListener('click', function() {zoom_info(1);}, false);
    document.getElementById('toolbar_btn_left').addEventListener('click', function() {move_info(-1,0);}, false);
    document.getElementById('toolbar_btn_right').addEventListener('click', function() {move_info(1,0);}, false);
    document.getElementById('toolbar_btn_up').addEventListener('click', function() {move_info(0,-1);}, false);
    document.getElementById('toolbar_btn_down').addEventListener('click', function() {move_info(0,1);}, false);
    
    document.getElementById('message_cancel').addEventListener('click', function() { document.getElementById("dialogue_message").style.visibility = "hidden" }, false);

    document.getElementById( 'start_message' ).addEventListener( 'click', function( event ) {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-1';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-2';
    }, false );
    document.getElementById('start_profile').addEventListener('click', function() {profile_home()}, false);
    document.getElementById('profile_home').addEventListener('click', function() {profile_home()}, false);
    document.getElementById('profile_close').addEventListener('click', function() {profile_close()}, false);
    document.getElementById('profile_search_input').addEventListener('keyup', function() { window.global_typewatch("search_profile(document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code, null);", 500); }, false);
    
    document.getElementById('profile_top_row1_1').addEventListener('click', function() { profile_top(1, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code)}, false);
    document.getElementById('profile_top_row1_2').addEventListener('click', function() { profile_top(2, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code)}, false);
    document.getElementById('profile_top_row1_3').addEventListener('click', function() { profile_top(3, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code)}, false);

    document.getElementById('profile_follow').addEventListener('click', function() { user_function_app('FOLLOW') }, false);
	document.getElementById('profile_like').addEventListener('click', function() { user_function_app('LIKE') }, false);

    document.getElementById('profile_main_btn_following').addEventListener('click', function() { profile_detail(1, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code, null, true, null) }, false);
    document.getElementById('profile_main_btn_followed').addEventListener('click', function() { profile_detail(2, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code, null, true, null) }, false);
    document.getElementById('profile_main_btn_likes').addEventListener('click', function() { profile_detail(3, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code, null, true, null) }, false);
    document.getElementById('profile_main_btn_liked').addEventListener('click', function() { profile_detail(4, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code, null, true, null) }, false);
    document.getElementById('profile_main_btn_cloud').addEventListener('click', function() { profile_detail(5, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code, window.global_rest_user_account_app, true, global_profile_detail_header_cloud, null) }, false);
    

    document.getElementById( 'info_message' ).addEventListener( 'click', function( event ) {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip';
    }, false );

    document.getElementById('user_menu').addEventListener('click', function() { user_menu_click() }, false);
    
    document.getElementById('user_menu_dropdown_profile').addEventListener('click', function() { user_menu_item_click(this) }, false);
    document.getElementById('user_menu_dropdown_edit').addEventListener('click', function() { user_menu_item_click(this) }, false);
    document.getElementById('user_menu_dropdown_log_out').addEventListener('click', function() { user_menu_item_click(this) }, false);

    document.getElementById('user_menu_dropdown_signup').addEventListener('click', function() { user_menu_item_click(this) }, false);
    document.getElementById('user_menu_dropdown_log_in').addEventListener('click', function() { user_menu_item_click(this) }, false);
    

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
    document.getElementById('login_signup').addEventListener('click', function() { show_common_dialogue('SIGNUP') }, false);
    
    document.getElementById('login_button').addEventListener('click', function() { user_login_app() }, false);
    document.getElementById('login_close').addEventListener('click', function() { document.getElementById('dialogue_login').style.visibility = 'hidden' }, false);
    document.getElementById('user_edit_close').addEventListener('click', function() { user_edit_app() }, false);
    document.getElementById('user_edit_btn_avatar_img').addEventListener('click', function() { document.getElementById('user_edit_input_avatar_img').click() }, false);
    document.getElementById('user_edit_input_avatar_img').addEventListener('change', function() { show_image(document.getElementById('user_edit_avatar_img'), this.id, window.global_user_image_avatar_width, window.global_user_image_avatar_height, window.global_lang_code); }, false);
    document.getElementById('user_edit_close').addEventListener('click', function() { document.getElementById('dialogue_user_edit').style.visibility = 'hidden' }, false);
    document.getElementById('signup_login').addEventListener('click', function() { show_common_dialogue('LOGIN') }, false);
    document.getElementById('setting_btn_user_update').addEventListener('click', function() { user_update_app(); }, false);
    document.getElementById('setting_btn_user_delete_account').addEventListener('click', function() { user_delete_app(); }, false);
    document.getElementById('signup_button').addEventListener('click', function() { user_signup(document.getElementById('user_menu_user_id'), window.global_lang_code) }, false);
    document.getElementById('signup_close').addEventListener('click', function() { document.getElementById('dialogue_signup').style.visibility = 'hidden' }, false);

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
            //read only app_name from app id 0
            for (var i = 0; i < json.data.length; i++) {
                if (i==0){
                    window.global_app_name = json.data[i].app_name;
                    document.getElementById('login_logo').style.backgroundImage=`url(${json.data[i].logo})`;
                    document.getElementById('signup_logo').style.backgroundImage=`url(${json.data[i].logo})`;
                    document.getElementById('login_app_name').innerHTML = window.global_app_name;
                    document.getElementById('signup_app_name').innerHTML = window.global_app_name;
                    set_app_globals_head();
                }
                else{   
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
          else
            show_message('EXCEPTION', null,null, result, window.global_app_id, window.global_lang_code);
        });
}

async function get_parameters() {
    let status;
    let json;
    await fetch( window.global_rest_url_base + window.global_rest_app_parameter + window.global_app_id,
      {method: 'GET'})
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status==200){
                json = JSON.parse(result);
                for (var i = 0; i < json.data.length; i++) {
                    if (json.data[i].parameter_name=='APP_REST_CLIENT_ID')
                        window.global_app_rest_client_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_REST_CLIENT_SECRET')
                        window.global_app_rest_client_secret = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_COPYRIGHT')
                        window.global_app_copyright =json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_EMAIL')
                        window.global_app_email = json.data[i].parameter_value;
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
                    if (json.data[i].parameter_name=='SERVICE_AUTH')
                        window.global_service_auth = json.data[i].parameter_value;
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
                    if (json.data[i].parameter_name=='REST_APP_LOG')
                        window.global_rest_app_log = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_MESSAGE_TRANSLATION')
                        window.global_rest_message_translation = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT')
                        window.global_rest_user_account = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_ACTIVATE')
                        window.global_rest_user_account_activate = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_APP')
                        window.global_rest_user_account_app = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_LIKE')
                        window.global_rest_user_account_like = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_FOLLOW')
                        window.global_rest_user_account_follow = json.data[i].parameter_value;
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
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                        window.global_service_geolocation = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION_GPS_IP')
                        window.global_service_geolocation_gps_ip = json.data[i].parameter_value;
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
                show_message('EXCEPTION', null,null, result, window.global_app_id, window.global_lang_code);
        });
}
function zoom_info(zoomvalue = '') {
    let old;
    let old_scale;
    let div = document.getElementById('info');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == '') {
        div.style.transform = 'scale(1)';
    } else {
        old = div.style.transform;
        old_scale = parseFloat(old.substr(old.indexOf("(") + 1, old.indexOf(")") - 1));
        div.style.transform = 'scale(' + (old_scale + ((zoomvalue*5) / 10)) + ')';
    }
    return null;
}
function move_info(move1, move2) {
    let old;
    let div = document.getElementById('info');
    if (move1==null && move2==null) {
        div.style.transformOrigin = '50% 50%';
    } else {
        old = div.style.transformOrigin;
        let old_move1 = parseFloat(old.substr(0, old.indexOf("%")));
        let old_move2 = parseFloat(old.substr(old.indexOf("%") +1, old.length -1));
        div.style.transformOrigin =  `${old_move1 + (move1*5)}% ${old_move2 + (move2*5)}%`;
    }
    return null;
}

function info(id){
    switch (id){
        case 1:{
            document.getElementById('window_info').style.visibility = 'visible';
            document.getElementById('info').innerHTML = `<img src="${window.global_img_diagram_img}"/>`;
            break;
        }
        case 2:{
            document.getElementById('window_info').style.visibility = 'visible';
            document.getElementById('info').innerHTML = `<img src="${window.global_img_datamodel_img}"/>`;
            break;
        }
        case 3:{
            document.getElementById('window_info').style.visibility = 'hidden';
            document.getElementById('info').innerHTML = '';
            zoom_info('');
            move_info(null,null);
            break;
        }
        default:
            break;
    }

}
function profile_home(){
    let profile = document.getElementById('dialogue_profile');
    let profile_info_div = document.getElementById('profile_info');
    let profile_detail_div = document.getElementById('profile_detail');
    let profile_top_div = document.getElementById('profile_top');
    let profile_top_list_div = document.getElementById('profile_top_list');

    profile.style.visibility = 'visible';
    profile_detail_div.style.display = 'none';
    profile_info_div.style.display = 'none';
    profile_top_div.style.display = 'block';
    profile_top_list_div.style.display = 'block';
    document.getElementById('profile_detail_list').innerHTML = '';
    profile_top(1, document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code);
}
function profile_close(){
    let profile = document.getElementById('dialogue_profile');
    let profile_info_div = document.getElementById('profile_info');
    let profile_detail_div = document.getElementById('profile_detail');
    let profile_top_div = document.getElementById('profile_top');
    let profile_top_list_div = document.getElementById('profile_top_list');

    profile.style.visibility = 'hidden';
    profile_info_div.style.display = 'none';
    profile_detail_div.style.display = 'none';
    profile_top_div.style.display = 'none';
    profile_top_list_div.style.display = 'none';
    profile_top_list_div.innerHTML = '';
    document.getElementById('profile_avatar').src = '';
    document.getElementById('profile_username').innerHTML = '';
    document.getElementById('profile_bio').innerHTML = '';
    document.getElementById('profile_joined_date').innerHTML = '';
    document.getElementById('profile_follow').children[0].style.display = 'block';
    document.getElementById('profile_follow').children[1].style.display = 'none';
    document.getElementById('profile_like').children[0].style.display = 'block';
    document.getElementById('profile_like').children[1].style.display = 'none';

    document.getElementById('profile_info_following_count').innerHTML = '';
    document.getElementById('profile_info_followers_count').innerHTML = '';
    document.getElementById('profile_info_likes_count').innerHTML = '';
    document.getElementById('profile_qr').innerHTML = '';

    document.getElementById('profile_detail_list').innerHTML = '';
}
function user_menu_click(){
    if (document.getElementById('user_menu_dropdown').style.visibility=='visible')
        document.getElementById('user_menu_dropdown').style.visibility = 'hidden';
    else
        document.getElementById('user_menu_dropdown').style.visibility = 'visible';
}
function user_menu_item_click(item){
    switch (item.id){
        case 'user_menu_dropdown_profile':{
            //profile_home();
            document.getElementById('dialogue_profile').style.visibility = 'visible';
            profile_show(document.getElementById('user_menu_user_id').innerHTML,
                null,
                document.getElementById('user_menu_user_id').innerHTML,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                window.global_lang_code,
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
    document.getElementById('user_menu_dropdown').style.visibility = 'hidden';
}
async function user_login_app(){
    let username = document.getElementById('login_username');
    let password = document.getElementById('login_password');
    let user_id = document.getElementById('user_menu_user_id');
    spinner('LOGIN', 'visible');
    await user_login(username.value, password.value, window.global_lang_code, (err, result)=>{
        spinner('LOGIN', 'hidden');
        if (err==null){
            username.value = '';
            password.value = '';
            
            user_id.innerHTML = result.user_id;
            //set avatar or empty
            if (result.avatar == null || result.avatar == '') {
                recreate_img(document.getElementById('user_menu_avatar_img'));
                result.avatar = '';
            } else
                document.getElementById('user_menu_avatar_img').src = image_format(result.avatar);
            document.getElementById('user_menu_username').innerHTML = result.username;
            
            document.getElementById('user_menu_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu').classList.add('user_menu_logged_in');
            document.getElementById('user_menu_logged_out').style.display = 'none';

            document.getElementById('user_menu_dropdown_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu_dropdown_logged_out').style.display = 'none';

            document.getElementById('dialogue_login').style.visibility = 'hidden';
            document.getElementById('dialogue_signup').style.visibility = 'hidden';
        }
        
    })
}
function app_exception(){
    user_logoff_app();
}
function user_logoff_app() {
    user_logoff(document.getElementById('user_menu_user_id').innerHTML, window.global_lang_code).then(function(){
        document.getElementById('user_menu_user_id').innerHTML = '';
        recreate_img(document.getElementById('user_menu_avatar_img'));
        document.getElementById('user_menu_username').innerHTML = '';
        document.getElementById('user_menu_logged_in').style.display = 'none';
        document.getElementById('user_menu').classList.remove('user_menu_logged_in');
        document.getElementById('user_menu_logged_out').style.display = 'inline-block';
        document.getElementById('user_menu_dropdown_logged_in').style.display = 'none';
        document.getElementById('user_menu_dropdown_logged_out').style.display = 'inline-block';
    })
}
async function user_edit_app() {
    await user_edit(document.getElementById('user_menu_user_id').innerHTML, Intl.DateTimeFormat().resolvedOptions().timeZone, window.global_lang_code.value,(err, result) => {
        if ((err==null && result==null) == false)
            if (err==null){
                document.getElementById('user_menu_avatar_img').src = image_format(result.avatar ?? result.provider1_image ?? result.provider2_image);
            }
    });
}
async function user_update_app(){
    await user_update(document.getElementById('user_menu_user_id').innerHTML, window.global_lang_code,(err, result) => {
        if (err==null){
            document.getElementById('user_menu_avatar_img').src = atob(result.avatar);
            document.getElementById('user_menu_username').innerHTML = result.username;
        }
    });

}
async function user_verify_check_input_app(item, nextField){
    await user_verify_check_input(item, document.getElementById('user_menu_user_id').innerHTML, nextField, window.global_lang_code, (err, result) => {
        if ((err==null && result==null)==false)
            if(err==null){
                user_login_app();
            }
    })
}
async function user_function_app(function_name){
    await user_function(function_name, document.getElementById('user_menu_user_id').innerHTML, window.global_lang_code, (err, result) => {
        if (err==null){
            profile_update_stat_app();
        }
    })
}
async function profile_update_stat_app(){
    await profile_update_stat(window.global_lang_code, (err, result) =>{
        null;
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
                                            user_delete(1, document.getElementById('user_menu_user_id').innerHTML, user_local, null, window.global_lang_code, (err, result)=>{
                                                if (err==null){
                                                    user_logoff_app();
                                                }
                                            }) 
                                        };
    await user_delete(null, document.getElementById('user_menu_user_id').innerHTML, user_local, function_delete_user_account, window.global_lang_code, (err, result) =>{
        if (err==null){
            user_logoff_app();
        }
    })
}
async function updateProviderUser_app(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email){
    let user_id = document.getElementById('user_menu_user_id');
    await updateProviderUser(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, window.global_lang_code, (err, result)=>{
        if(err==null){
            user_id.innerHTML = result.user_account_id;
            //set avatar or empty
            if (result.avatar == null || result.avatar == '') {
                recreate_img(document.getElementById('user_menu_avatar_img'));
                result.avatar = '';
            } else
                document.getElementById('user_menu_avatar_img').src = result.avatar;
            document.getElementById('user_menu_username').innerHTML = result.username;

            document.getElementById('user_menu_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu').classList.add('user_menu_logged_in');
            document.getElementById('user_menu_logged_out').style.display = 'none';

            document.getElementById('user_menu_dropdown_logged_in').style.display = 'inline-block';
            document.getElementById('user_menu_dropdown_logged_out').style.display = 'none';
        }
    })
}
async function onProviderSignIn_app(googleUser){
    await onProviderSignIn(googleUser, (err, result)=>{
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
function init(){
    init_common(0, 'APP', 'HOME', 'app_exception');
    document.getElementById("toggle_checkbox").checked = true;
    document.getElementById('info_diagram_img').src=window.global_img_diagram_img;
    document.getElementById('info_datamodel_img').src=window.global_img_datamodel_img;

    document.getElementById('login_username').placeholder = 'Username';
    document.getElementById('login_password').placeholder = 'Password';
    document.getElementById('signup_username').placeholder = 'Username';
    document.getElementById('signup_email').placeholder = 'Email';
    document.getElementById('signup_password').placeholder = 'Password';
    document.getElementById('signup_password_confirm').placeholder = 'Password confirm';
    document.getElementById('signup_password_reminder').placeholder = 'Password reminder';

    document.getElementById('login_btn_signup').innerHTML = 'Signup';
    document.getElementById('signup_btn_login').innerHTML = 'Login';

    document.getElementById('user_menu_dropdown_profile').innerHTML = 'Profile';
    document.getElementById('user_menu_dropdown_edit').innerHTML = 'Edit';
    document.getElementById('user_menu_dropdown_log_out').innerHTML = 'Log out';

    document.getElementById('user_menu_dropdown_signup').innerHTML = 'Signup';
    document.getElementById('user_menu_dropdown_log_in').innerHTML = 'Log in';    

    document.getElementById('confirm_question').innerHTML = 'Are you sure?';

    keyfunctions();
    zoom_info('');
    move_info(null,null);
    get_parameters().then(function(){
        document.getElementById('copyright').innerHTML = window.global_app_copyright;
        document.getElementById('app_email').href='mailto:' + window.global_app_email;
        document.getElementById('app_email').innerHTML=window.global_app_email;
    
        get_data_token(null, window.global_lang_code).then(function(){
            get_gps_from_ip(null, window.global_lang_code).then(function(){
                app_log(window.global_module, 
                        window.global_module_type, 
                        location.hostname, 
                        window.global_session_user_gps_place, 
                        '', 
                        window.global_session_user_gps_latitude, 
                        window.global_session_user_gps_longitude,
                        window.global_lang_code);
                get_apps();
                init_providers('onProviderSignIn_app', function() { onProviderSignIn_app() }).then(function(){
                    null;
                });
            })
        })
    })
}
