var global_module = 'APP';
var global_module_type = 'HOME';
var global_app_id = 0;
var global_app_name;
var global_app_email;
var global_img_diagram_img = '/app0/info/app_portfolio.jpg';
var global_img_datamodel_img = '/app0/info/datamodel.jpg';

var global_qr_width;
var global_qr_height;
var global_qr_color_dark;
var global_qr_color_light;
var global_qr_logo_file_path;
var global_qr_logo_width;
var global_qr_logo_height;
var global_qr_background_color;

function keyfunctions(){
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
    
    document.getElementById('message_close').addEventListener('click', function() {document.getElementById('dialogue_message').style.visibility= 'hidden'}, false);

    document.getElementById( 'start_message' ).addEventListener( 'click', function( event ) {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-1';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip dialogue_flip-side-2';
    }, false );
    document.getElementById('start_profile').addEventListener('click', function() {profile_home()}, false);
    document.getElementById('profile_home').addEventListener('click', function() {profile_home()}, false);
    document.getElementById('profile_close').addEventListener('click', function() {profile_close()}, false);
    document.getElementById('profile_top_row1_1').addEventListener('click', function() { profile_top(1, '', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code)}, false);
    document.getElementById('profile_top_row1_2').addEventListener('click', function() { profile_top(2, '', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code)}, false);
    document.getElementById('profile_top_row1_3').addEventListener('click', function() { profile_top(3, '', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code)}, false);
    document.getElementById('profile_search_input').addEventListener('keyup', function() { typewatch("search_profile('', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code, null);", 500); }, false);

    document.getElementById('profile_main_btn_following').addEventListener('click', function() { profile_detail(1,'', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code, null, true, null) }, false);
    document.getElementById('profile_main_btn_followed').addEventListener('click', function() { profile_detail(2, '', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code, null, true, null) }, false);
    document.getElementById('profile_main_btn_likes').addEventListener('click', function() { profile_detail(3, '', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code, null, true, null) }, false);
    document.getElementById('profile_main_btn_liked').addEventListener('click', function() { profile_detail(4, '', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code, null, true, null) }, false);
    
    document.getElementById( 'info_message' ).addEventListener( 'click', function( event ) {
        event.preventDefault();
        document.getElementById( 'dialogue_info_content' ).className = 'dialogue_content dialogue_flip';
        document.getElementById( 'dialogue_start_content' ).className = 'dialogue_content dialogue_flip';
    }, false );

    document.getElementById('login_signup').addEventListener('click', function() { show_common_dialogue('SIGNUP') }, false);
    /*
    document.getElementById('login_button').addEventListener('click', function() { user_login() }, false);
    if (global_app_user_provider2_use==1)
        document.getElementById('login_facebook').addEventListener('click', function() { onProviderSignIn() }, false);
    */
    document.getElementById('login_close').addEventListener('click', function() { document.getElementById('dialogue_login').style.visibility = 'hidden' }, false);
    //document.getElementById('user_edit_close').addEventListener('click', function() { user_edit() }, false);
    document.getElementById('signup_login').addEventListener('click', function() { show_common_dialogue('LOGIN') }, false);

    //document.getElementById('signup_button').addEventListener('click', function() { user_signup() }, false);
    document.getElementById('signup_close').addEventListener('click', function() { document.getElementById('dialogue_signup').style.visibility = 'hidden' }, false);
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
    fetch(global_rest_url_base + global_rest_app + '?id=' + global_app_id,
    {method: 'GET',
     headers: {
			'Authorization': 'Bearer ' + global_rest_dt
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
                    global_app_name = json.data[i].app_name;
                    document.getElementById('login_logo').style.backgroundImage=`url(${json.data[i].logo})`;
                    document.getElementById('signup_logo').style.backgroundImage=`url(${json.data[i].logo})`;
                    document.getElementById('login_app_name').innerHTML = global_app_name;
                    document.getElementById('signup_app_name').innerHTML = global_app_name;
                }
                else{
                    html +=`<div class='app_link' onclick='window.open("${json.data[i].url}");'>
                                    <div class='app_logo_div'><img class='app_logo' src='${json.data[i].logo}' /></div>
                                    <div class='app_name'>${json.data[i].app_name}</div>
                            </div>`;
                }
            }
            document.getElementById('apps').innerHTML = html;
          }
          else
            show_message('EXCEPTION', null,null, result, global_app_id, global_lang_code);
        });
}

async function get_parameters() {
    let status;
    let json;
    await fetch( global_rest_url_base + global_rest_app_parameter + global_app_id,
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
                        global_app_rest_client_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_REST_CLIENT_SECRET')
                        global_app_rest_client_secret = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_COPYRIGHT')
                        global_app_copyright =json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_EMAIL')
                        global_app_email = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_AUTH')
                        global_service_auth = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER1_USE')
                        global_app_user_provider1_use = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER1_ID')
                        global_app_user_provider1_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER1_NAME')
                        global_app_user_provider1_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER1_API_SRC')
                        global_app_user_provider1_api_src = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_USE')
                        global_app_user_provider2_use = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_ID')
                        global_app_user_provider2_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_NAME')
                        global_app_user_provider2_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_API_VERSION')
                        global_app_user_provider2_api_version = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_API_SRC')
                        global_app_user_provider2_api_src = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_API_SRC2')
                        global_app_user_provider2_api_src2 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP')
                        global_rest_app = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP_LOG')
                        global_rest_app_log = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_DETAIL')
                        global_rest_user_account_profile_detail = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_SEARCHA')
                        global_rest_user_account_profile_searchA = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_SEARCHD')
                        global_rest_user_account_profile_searchD = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_TOP')
                        global_rest_user_account_profile_top = json.data[i].parameter_value;                        
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_USERID')
                        global_rest_user_account_profile_userid = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_USERNAME')
                        global_rest_user_account_profile_username = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                        global_service_geolocation = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION_GPS_IP')
                        global_service_geolocation_gps_ip = json.data[i].parameter_value;
                    //QR
                    if (json.data[i].parameter_name=='QR_LOGO_FILE_PATH')
                        global_qr_logo_file_path = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='QR_WIDTH')
                        global_qr_width = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='QR_HEIGHT')
                        global_qr_height = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='QR_COLOR_DARK')
                        global_qr_color_dark = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='QR_COLOR_LIGHT')
                        global_qr_color_light = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='QR_LOGO_WIDTH')
                        global_qr_logo_width = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='QR_LOGO_HEIGHT')
                        global_qr_logo_height = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='QR_BACKGROUND_COLOR')
                        global_qr_background_color = json.data[i].parameter_value;
                }
            }
            else
                show_message('EXCEPTION', null,null, result, global_app_id, global_lang_code);
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
            document.getElementById('info').innerHTML = `<img src="${global_img_diagram_img}"/>`;
            break;
        }
        case 2:{
            document.getElementById('window_info').style.visibility = 'visible';
            document.getElementById('info').innerHTML = `<img src="${global_img_datamodel_img}"/>`;
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
    profile_top(1, '', Intl.DateTimeFormat().resolvedOptions().timeZone, global_lang_code);
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
function init(){
    document.getElementById("toggle_checkbox").checked = true;
    document.getElementById('info_diagram_img').src=global_img_diagram_img;
    document.getElementById('info_datamodel_img').src=global_img_datamodel_img;

    document.getElementById('login_username').placeholder = 'Username';
    document.getElementById('login_password').placeholder = 'Password';
    document.getElementById('signup_username').placeholder = 'Username';
    document.getElementById('signup_email').placeholder = 'Email';
    document.getElementById('signup_password').placeholder = 'Password';
    document.getElementById('signup_password_confirm').placeholder = 'Password confirm';
    document.getElementById('signup_password_reminder').placeholder = 'Password reminder';

    document.getElementById('login_btn_signup').innerHTML = 'Signup';
    document.getElementById('signup_btn_login').innerHTML = 'Login';
    

    keyfunctions();
    zoom_info('');
    move_info(null,null);
    get_parameters().then(function(){
        document.getElementById('copyright').innerHTML = global_app_copyright;
        document.getElementById('app_email').href='mailto:' + global_app_email;
        document.getElementById('app_email').innerHTML=global_app_email;
    
        get_data_token(null, global_lang_code).then(function(){
            get_gps_from_ip(null, global_lang_code).then(function(){
                app_log(global_module, 
                        global_module_type, 
                        location.hostname, 
                        global_session_user_gps_place, 
                        '', 
                        global_session_user_gps_latitude, 
                        global_session_user_gps_longitude,
                        global_lang_code);
                get_apps();
            })
        })
    })
}
