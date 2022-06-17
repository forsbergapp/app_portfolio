var global_main_app_id 					= 0;
// if app not using translation then use default lang_code from navigator
var global_lang_code                    = navigator.language;
var global_rest_url_base 				= '/service/db/api/';
var global_rest_app_parameter 			= 'app_parameter/';

var global_app_rest_client_id;
var global_app_rest_client_secret;
var global_app_copyright;

var global_app_user_provider1_use;
var global_app_user_provider1_id;
var global_app_user_provider1_name;
var global_app_user_provider1_api_src;
var global_app_user_provider2_use;
var global_app_user_provider2_id;
var global_app_user_provider2_name;
var global_app_user_provider2_api_version;
var global_app_user_provider2_api_src;
var global_app_user_provider2_api_src2;
var global_rest_at;
var global_rest_dt;
var global_rest_app;
var global_rest_app_log;
var global_rest_app_object;
var global_rest_country;
var global_rest_language_locale;
var global_rest_message_translation;
var global_rest_user_account;
var global_rest_user_account_activate;
var global_rest_user_account_app;
var global_rest_user_account_common;
var global_rest_user_account_login;
var global_rest_user_account_profile_username;
var global_rest_user_account_profile_userid;
var global_rest_user_account_profile_searchA;
var global_rest_user_account_profile_searchD;
var global_rest_user_account_profile_top;
var global_rest_user_account_profile_detail;
var global_rest_user_account_provider;
var global_rest_user_account_signup;
var global_rest_user_account_like;
var global_rest_user_account_follow;
//Images uploaded
var global_image_file_allowed_type1;
var global_image_file_allowed_type2;
var global_image_file_allowed_type3;
var global_image_file_mime_type;
var global_image_file_max_size;

//services
var global_service_auth;
var global_service_geolocation;
var global_service_geolocation_gps_place;
var global_service_geolocation_gps_ip;
var global_service_report;
var global_service_worldcities;

//session variables
var global_session_user_gps_latitude;
var global_session_user_gps_longitude;
var global_session_user_gps_place;

const clientId = Date.now();
const eventSource = new EventSource(`/service/broadcast/connect/${clientId}?app_id=${global_app_id}`);

//delay API calls when typing to avoid too many calls 
var typewatch = function() {
    let timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}();

eventSource.onmessage = function (event) {
    if (global_app_id === '')
        null;
    else
        show_broadcast(event.data);
}
eventSource.onerror = function (err) {
    eventSource.close();
}
function maintenance_countdown(remaining) {
    if(remaining <= 0)
        location.reload(true);
    document.getElementById('maintenance_countdown').innerHTML = remaining;
    setTimeout(function(){ maintenance_countdown(remaining - 1); }, 1000);
};
function show_broadcast(broadcast_message){
    broadcast_message = atob(broadcast_message);
    let broadcast_type = JSON.parse(broadcast_message).broadcast_type;
    let message = JSON.parse(broadcast_message).broadcast_message;
    if (broadcast_type=='MAINTENANCE'){
        show_maintenance(message);
    }
    else
        if (broadcast_type=='INFO'){
            show_broadcast_info(message);
        }
}
function show_broadcast_info(message){
    var hide_function = function() { document.getElementById('broadcast_info').style.visibility='hidden';
                                     document.getElementById('broadcast_close').removeEventListener('click', hide_function);
                                     document.getElementById('broadcast_info_message_item').innerHTML='';
                                     document.getElementById('broadcast_info_message').style.animationName='unset';};
    document.getElementById('broadcast_info_message').style.animationName='ticker';
    document.getElementById('broadcast_close').addEventListener('click', hide_function);
    document.getElementById('broadcast_info_message_item').innerHTML = message;
    document.getElementById('broadcast_info').style.visibility='visible';
}
function show_maintenance(message, init){
    let countdown_timer = 60;

    if (init==1){
        document.getElementById('dialogue_maintenance').style.visibility='visible';
        maintenance_countdown(countdown_timer);
    }
    else
        if (document.getElementById('maintenance_countdown').innerHTML=='') {
            let divs = document.body.getElementsByTagName('div');

            for (let i = 0; i < divs.length; i += 1) {
                divs[i].style.visibility ='hidden';
            }
            let maintenance_divs = document.getElementById('dialogue_maintenance').getElementsByTagName('div');
            for (let i = 0; i < maintenance_divs.length; i += 1) {
                maintenance_divs[i].style.visibility ='visible';
            }
            document.getElementById('dialogue_maintenance').style.visibility='visible';
            maintenance_countdown(countdown_timer);
            document.getElementById('maintenance_footer').innerHTML = message;
        }
        else
            if (message!='')
                document.getElementById('maintenance_footer').innerHTML = message;
}
/*Profile*/
function show_profile_click_events(item, profile_id, user_id, timezone, lang_code, click_function){
    document.querySelectorAll(item).forEach(e => e.addEventListener('click', function(event) {
        //execute function from inparameter or use default when not specified
        let profile_id = event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML;
        if (click_function ==null){
            profile_show(profile_id,
                         null,
                         user_id,
                         timezone,
                         lang_code,
                         (err, result)=>{
                             null;
                         });
        }
        else{
            eval(`(function (){${click_function}(${profile_id},
                    ${null},
                    ${user_id==''?"''":user_id},
                    '${timezone}',
                    '${lang_code}')}());`);
        }
    }));
}
function profile_top(statschoice, user_id, timezone, lang_code, app_rest_url = null, click_function=null) {
    let status;
    let url;
    if (statschoice ==1 || statschoice ==2 || statschoice ==3){
        /*statschoice 1,2,3: user_account*/
        url = global_rest_url_base + global_rest_user_account_profile_top;
    }
    else{
        /*other statschoice, apps can use >3 and return same columns*/
        url = global_rest_url_base + app_rest_url;
    }
    //TOP
    fetch(url + statschoice + 
            '?app_id=' + global_app_id +
            '&lang_code=' + lang_code, 
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + global_rest_dt
            }
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                json = JSON.parse(response);
                let profile_top_list = document.getElementById('profile_top_list');
                profile_top_list.innerHTML = '';
                let html ='';
                let image='';
                let name='';
                for (i = 0; i < json.count; i++) {
                    image = image_format(json.items[i].avatar ?? json.items[i].provider1_image ?? json.items[i].provider2_image);
                    name = json.items[i].username;
                    html +=
                    `<div class='profile_top_list_row'>
                        <div class='profile_top_list_col'>
                            <div class='profile_top_list_user_account_id'>${json.items[i].id}</div>
                        </div>
                        <div class='profile_top_list_col'>
                            <img class='profile_top_list_avatar' src='${image}'>
                        </div>
                        <div class='profile_top_list_col'>
                            <div class='profile_top_list_username'>
                                <a href='#'>${name}</a>
                            </div>
                        </div>
                        <div class='profile_top_list_col'>
                            <div class='profile_top_list_count'>${json.items[i].count}</div>
                        </div>
                    </div>`;
                }
                profile_top_list.innerHTML = html;
                show_profile_click_events('.profile_top_list_username', profile_id, user_id, timezone, lang_code, click_function);
            }
        })
        .catch(function(error) {
            show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
        });
}
function profile_detail(detailchoice, user_id, timezone, lang_code, rest_url_app, fetch_detail, header_app, click_function) {
    let status;
    let url;
    if (detailchoice == 1 || detailchoice == 2 || detailchoice == 3 || detailchoice == 4){
        /*detailchoice 1,2,3, 4: user_account*/
        url = global_rest_url_base + global_rest_user_account_profile_detail;
    }
    else{
        /*other detailchoice, apps can use >4 and return same columns*/
        url = global_rest_url_base + rest_url_app;
    }
    //DETAIL
    //show only if user logged in
    if (parseInt(user_id) || 0 !== 0) {
        switch (detailchoice) {
            case 1:
                {
                    //Following
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'block';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_app').style.display = 'none';
                    document.getElementById('profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 2:
                {
                    //Followed
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'block';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_app').style.display = 'none';
                    document.getElementById('profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 3:
                {
                    //Like user
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'block';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_app').style.display = 'none';
                    document.getElementById('profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 4:
                {
                    //Liked user
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'block';
                    document.getElementById('profile_detail_header_app').style.display = 'none';
                    document.getElementById('profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 5:
            case 6:
                {
                    //show app specific
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_app').style.display = 'block';
                    document.getElementById('profile_detail_header_app').innerHTML = header_app;
                    break;
                }
            case 7:
                {
                    //show only other app specfic hide common
                    document.getElementById('profile_detail').style.display = 'none';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_app').style.display = 'none';
                    document.getElementById('profile_detail_header_app').innerHTML = '';
                    break;
                }
            default:
                break;
        }
        if (fetch_detail)
        {
            fetch(url + document.getElementById('profile_id').innerHTML +
            '?app_id=' + global_app_id +
            '&lang_code=' + lang_code +
            '&detailchoice=' + detailchoice, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + global_rest_at
            }
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(result) {
                if (status == 200) {
                    json = JSON.parse(result);
                    let profile_detail_list = document.getElementById('profile_detail_list');
                    profile_detail_list.innerHTML = '';

                    let html = '';
                    let image = '';
                    let name='';
                    for (i = 0; i < json.count; i++) {
                        image = image_format(json.items[i].avatar ?? json.items[i].provider1_image ?? json.items[i].provider2_image);
                        name = json.items[i].username;
                        html += 
                        `<div class='profile_detail_list_row'>
                            <div class='profile_detail_list_col'>
                                <div class='profile_detail_list_user_account_id'>${json.items[i].id}</div>
                            </div>
                            <div class='profile_detail_list_col'>
                                <img class='profile_detail_list_avatar' src='${image}'>
                            </div>
                            <div class='profile_detail_list_col'>
                                <div class='profile_detail_list_username'>
                                    <a href='#'>${name}</a>
                                </div>
                            </div>
                        </div>`;

                    }
                    profile_detail_list.innerHTML = html;
                    show_profile_click_events('.profile_detail_list_username', profile_id, user_id, timezone, lang_code, click_function);
                } else {
                    exception(status, result, lang_code);
                }
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
            });
        }
    } else
        show_common_dialogue('LOGIN');
}
function search_profile(user_id, timezone, lang_code, click_function) {
    let status;
    let searched_username = document.getElementById('profile_search_input').value;
    let profile_search_list = document.getElementById('profile_search_list');
    profile_search_list.innerHTML = '';
    document.getElementById('profile_search_list').style.display = "none";
    let url;
    let token;
    let json_data;
    if (user_id!=''){
        //search using access token with logged in user_account_id
        url = global_rest_url_base + global_rest_user_account_profile_searchA;
        token = global_rest_at;
        json_data = `{
                    "user_account_id":${user_id},
                    "client_longitude": "${global_session_user_gps_longitude}",
                    "client_latitude": "${global_session_user_gps_latitude}"
                    }`;
    }
    else{
        //search using data token without logged in user_account_id
        url = global_rest_url_base + global_rest_user_account_profile_searchD;
        token = global_rest_dt;
        json_data = `{
                    "client_longitude": "${global_session_user_gps_longitude}",
                    "client_latitude": "${global_session_user_gps_latitude}"
                    }`;
    }
    fetch(url + searched_username +
          '?app_id=' + global_app_id +
          '&lang_code=' + lang_code, 
          {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
          },
          body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                json = JSON.parse(response);
                if (json.count > 0)
                    document.getElementById('profile_search_list').style.display = "block";
                let html = '';
                let image= '';
                let name = '';
                profile_search_list.style.height = (json.count * 24).toString() + 'px';
                for (i = 0; i < json.count; i++) {
                    image = image_format(json.items[i].avatar ?? json.items[i].provider1_image ?? json.items[i].provider2_image);
                    name = json.items[i].username;
                    html +=
                    `<div class='profile_search_list_row'>
                        <div class='profile_search_list_col'>
                            <div class='profile_search_list_user_account_id'>${json.items[i].id}</div>
                        </div>
                        <div class='profile_search_list_col'>
                            <img class='profile_search_list_avatar' src='${image}'>
                        </div>
                        <div class='profile_search_list_col'>
                            <div class='profile_search_list_username'>
                                <a href='#'>${name}</a>
                            </div>
                        </div>
                    </div>`;
                }
                profile_search_list.innerHTML = html;
                show_profile_click_events('.profile_search_list_username', profile_id, user_id, timezone, lang_code, click_function);
            }
        })
        .catch(function(error) {
            show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
        });
}
/* call 
profile_show(null, null, user_id, lang_code)     from popupmenu
profile_show(userid, null, user_id, lang_code) 	 from choosing profile in profile_top
profile_show(userid, null, user_id, lang_code) 	 from choosing profile in profile_detail
profile_show(userid, null, user_id, lang_code) 	 from choosing profile in search_profile
profile_show(null, username, user_id, lang_code) from init startup when user enters url*/
async function profile_show(user_account_id_other = null, username = null, user_id, timezone, lang_code, callBack) {
    let status;
    let json;
    let user_account_id_search;
    let url;

    document.getElementById('profile_info').style.display = "none";
    document.getElementById('profile_top').style.display = "none";
    document.getElementById('profile_top_list').style.display = "none";

    document.getElementById('profile_detail').style.display = "none";

    //empty search
    document.getElementById('profile_search_input').value = '';
    document.getElementById('profile_search_list').style.display = "none";
    document.getElementById('profile_search_list').innerHTML = '';
    
    if (user_account_id_other == null && user_id == '' && username == null) {
        //empty except profile top, always visible even not logged in
        document.getElementById('profile_main').style.display = "none";
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

        document.getElementById('profile_detail').style.display = "none";
        document.getElementById('profile_detail_list').innerHTML = '';

        return callBack(null,null);

    } else {
        if (user_account_id_other !== null) {
            user_account_id_search = user_account_id_other;
            url = global_rest_url_base + global_rest_user_account_profile_userid + user_account_id_search;
        } else
        if (username !== null) {
            user_account_id_search = '';
            url = global_rest_url_base + global_rest_user_account_profile_username + username;
        } else {
            user_account_id_search = user_id;
            url = global_rest_url_base + global_rest_user_account_profile_userid + user_account_id_search;
        }
        //PROFILE MAIN
        let json_data =
            `{
            "client_longitude": "${global_session_user_gps_longitude}",
            "client_latitude": "${global_session_user_gps_latitude}"
            }`;
        fetch(url + 
                '?app_id=' + global_app_id + 
                '&lang_code=' + lang_code +
                '&id=' + user_id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global_rest_dt
                },
                body: json_data
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(response) {
                if (status == 200) {
                    json = JSON.parse(response);
                    document.getElementById('profile_info').style.display = "block";
                    document.getElementById('profile_main').style.display = "block";
                    document.getElementById('profile_id').innerHTML = json.id;

                    document.getElementById('profile_avatar').src = image_format(json.avatar ?? json.provider1_image ?? json.provider2_image);
                    //show local username
                    document.getElementById('profile_username').innerHTML = json.username;

                    document.getElementById('profile_bio').innerHTML = get_null_or_value(json.bio);
                    document.getElementById('profile_joined_date').innerHTML = format_json_date(json.date_created, true, timezone, lang_code);
                    document.getElementById("profile_qr").innerHTML = '';
                    create_qr('profile_qr', `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}/` + json.username);

                    document.getElementById('profile_info_view_count').innerHTML = json.count_views;

                    document.getElementById('profile_info_following_count').innerHTML = json.count_following;
                    document.getElementById('profile_info_followers_count').innerHTML = json.count_followed;
                    document.getElementById('profile_info_likes_count').innerHTML = json.count_likes;
                    document.getElementById('profile_info_liked_count').innerHTML = json.count_liked;
                    

                    if (json.followed == 1) {
                        //followed
                        document.getElementById('profile_follow').children[0].style.display = 'none';
                        document.getElementById('profile_follow').children[1].style.display = 'block';
                    } else {
                        //not followed
                        document.getElementById('profile_follow').children[0].style.display = 'block';
                        document.getElementById('profile_follow').children[1].style.display = 'none';
                    }
                    if (json.liked == 1) {
                        //liked
                        document.getElementById('profile_like').children[0].style.display = 'none';
                        document.getElementById('profile_like').children[1].style.display = 'block';
                    } else {
                        //not liked
                        document.getElementById('profile_like').children[0].style.display = 'block';
                        document.getElementById('profile_like').children[1].style.display = 'none';
                    }
                    if (user_id ==''){
                        setTimeout(function(){show_common_dialogue('LOGIN')}, 2000);
                    }
                    return callBack(null,json.id);
                    
                } else
                    return callBack(status,null);
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, global_appp_id, lang_code);
                return callBack(error,null);
            });
    }
}
/* User */
async function user_login(username, password, lang_code, callBack) {
    
    let json;
    let json_data;
    let status;

    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, global_main_app_id, lang_code);
        return callBack('ERROR', null);
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, global_main_app_id,lang_code);
        return callBack('ERROR', null);
    }

    json_data = `{
                    "app_id": ${global_app_id},
                    "username":"${username}",
                    "password":"${password}",
                    "active":1,
                    "client_longitude":"${global_session_user_gps_longitude}",
                    "client_latitude":"${global_session_user_gps_latitude}"
                 }`;

    //get user with username and password from REST API
    fetch(global_rest_url_base + global_rest_user_account_login + 
            '?lang_code=' + lang_code, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + global_rest_dt
        },
        body: json_data
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status == 200) {
            json = JSON.parse(result);
            global_rest_at	= json.accessToken;
            return callBack(null, {user_id: json.items[0].id,
                                   username: json.items[0].username,
                                   bio: json.items[0].bio,
                                   avatar: json.items[0].avatar})

        } else {
            exception(status, result, lang_code);
            return callBack(result, null);
        }
    })
    .catch(function(error) {
        show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
        return callBack(error, null);
    });
    
}
async function user_logoff(user_id, lang_code){
    //remove access token
    global_rest_at ='';
    //get new data token to avoid endless loop och invalid token
    get_data_token(user_id, lang_code).then(function(){
        if (global_app_user_provider1_use==1){
            //sign out from Google if Google loaded
            //nothing to do with Google Identity
            null;
        }
        if (global_app_user_provider2_use==1){
            //Sign out from Facebook if signed in
            //do nothing since FB.getLoginStatus logs out user in browser
            null;
            /*
            FB.getLoginStatus(function(response) {
                //statusChangeCallback(response);
                if (response.authResponse) {
                    FB.logout(function(response) {
                        // user is now logged out
                        null;
                    });
                }
            });
            */
        }
        document.getElementById('dialogue_user_edit').style.visibility = "hidden";

        //clear user edit
        document.getElementById('setting_checkbox_profile_private').checked = false;
        document.getElementById('setting_input_username_edit').value = '';
        document.getElementById('setting_input_bio_edit').value = '';
        document.getElementById('setting_input_email_edit').value = '';
        document.getElementById('setting_input_password_edit').value = '';
        document.getElementById('setting_input_password_confirm_edit').value = '';
        document.getElementById('setting_input_new_password_edit').value = '';
        document.getElementById('setting_input_new_password_confirm_edit').value = '';
        document.getElementById('setting_input_password_reminder_edit').value = '';

        //clear signup
        document.getElementById('signup_username').value = '';
        document.getElementById('signup_email').value = '';
        document.getElementById('signup_password').value = '';
        document.getElementById('signup_password_confirm').value = '';
        document.getElementById('signup_password_reminder').value = '';

        //clear profile
        document.getElementById('profile_main').style.display = "none";
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
        document.getElementById('profile_detail').style.display = "none";
        document.getElementById('profile_detail_list').innerHTML = '';
        
    })
}
async function user_edit(user_id, timezone, lang_code,callBack) {
    let json;
    if (document.getElementById('dialogue_user_edit').style.visibility == 'visible') {
        document.getElementById('dialogue_user_edit').style.visibility = "hidden";
        document.getElementById('setting_checkbox_profile_private').checked = false;
        //common
        document.getElementById('setting_input_username_edit').value = '';
        document.getElementById('setting_input_bio_edit').value = '';
        //local
        document.getElementById('setting_input_email_edit').value = '';
        document.getElementById('setting_input_password_edit').value = '';
        document.getElementById('setting_input_password_confirm_edit').value = '';
        document.getElementById('setting_input_new_password_edit').value = '';
        document.getElementById('setting_input_new_password_confirm_edit').value = '';
        document.getElementById('setting_input_password_reminder_edit').value = '';
        //provider
        document.getElementById('setting_user_edit_provider_logo').innerHTML = '';
        document.getElementById('setting_label_provider_id_edit_data').innerHTML = '';
        document.getElementById('setting_label_provider_name_edit_data').innerHTML = '';
        document.getElementById('setting_label_provider_email_edit_data').innerHTML = '';
        document.getElementById('setting_label_provider_image_url_edit_data').innerHTML = '';

        //account info
        document.getElementById('setting_label_data_last_logontime_edit').value = '';
        document.getElementById('setting_label_data_account_created_edit').value = '';
        document.getElementById('setting_label_data_account_modified_edit').value = '';
        return callBack(null, null);
    } else {
        let status;
        //get user from REST API
        fetch(global_rest_url_base + global_rest_user_account + user_id +
                '?app_id=' + global_app_id +
                '&lang_code=' + lang_code, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_at
                }
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(result) {
                if (status == 200) {
                    json = JSON.parse(result);
                    if (user_id == json.id) {
                        document.getElementById('user_edit_local').style.display = 'none';
                        document.getElementById('user_edit_provider').style.display = 'none';
                        document.getElementById('dialogue_user_edit').style.visibility = "visible";

                        document.getElementById('setting_checkbox_profile_private').checked = number_to_boolean(json.private);
                        document.getElementById('setting_input_username_edit').value = json.username;
                        document.getElementById('setting_input_bio_edit').value = get_null_or_value(json.bio);

                        if (json.provider1_id == null && json.provider2_id == null) {
                            document.getElementById('user_edit_local').style.display = 'block';
                            document.getElementById('user_edit_provider').style.display = 'none';

                            //display fetched avatar editable
                            document.getElementById('user_edit_avatar').style.display = 'block';
                            if (json.avatar == null || json.avatar == '')
                                recreate_img(document.getElementById('user_edit_avatar_img'));
                            else
                                document.getElementById('user_edit_avatar_img').src = image_format(json.avatar);

                            document.getElementById('setting_input_email_edit').value = json.email;

                            document.getElementById('setting_input_password_edit').value = '',
                                document.getElementById('setting_input_password_confirm_edit').value = '',
                                document.getElementById('setting_input_new_password_edit').value = '';
                            document.getElementById('setting_input_new_password_confirm_edit').value = '';

                            document.getElementById('setting_input_password_reminder_edit').value = json.password_reminder;
                        } else
                            if (json.provider1_id !== null) {
                                document.getElementById('user_edit_provider').style.display = 'block';
                                document.getElementById('setting_user_edit_provider_logo').innerHTML = '<i class="fab fa-google"></i>';
                                document.getElementById('user_edit_local').style.display = 'none';
                                document.getElementById('setting_label_provider_id_edit_data').innerHTML = json.provider1_id;
                                document.getElementById('setting_label_provider_name_edit_data').innerHTML = json.provider1_first_name + ' ' + json.provider1_last_name;
                                document.getElementById('setting_label_provider_email_edit_data').innerHTML = json.provider1_email;
                                document.getElementById('setting_label_provider_image_url_edit_data').innerHTML = json.provider1_image_url;
                                document.getElementById('user_edit_avatar').style.display = 'none';
                                if (json.provider1_image == null || json.provider1_image == '')
                                    recreate_img(document.getElementById('user_edit_avatar_img'));
                                else
                                    document.getElementById('user_edit_avatar_img').src = image_format(json.provider1_image);
                            } else
                                if (json.provider2_id !== null) {
                                    document.getElementById('user_edit_provider').style.display = 'block';
                                    document.getElementById('setting_user_edit_provider_logo').innerHTML = '<i class="fab fa-facebook"></i>';
                                    document.getElementById('user_edit_local').style.display = 'none';
                                    document.getElementById('setting_label_provider_id_edit_data').innerHTML = json.provider2_id;
                                    document.getElementById('setting_label_provider_name_edit_data').innerHTML = json.provider2_first_name + ' ' + json.provider2_last_name;
                                    document.getElementById('setting_label_provider_email_edit_data').innerHTML = json.provider2_email;
                                    document.getElementById('setting_label_provider_image_url_edit_data').innerHTML = json.provider2_image_url;
                                    document.getElementById('user_edit_avatar').style.display = 'none';
                                    if (json.provider2_image == null || json.provider2_image == '')
                                        recreate_img(document.getElementById('user_edit_avatar_img'));
                                    else
                                        document.getElementById('user_edit_avatar_img').src = image_format(json.provider2_image);
                                }
                        document.getElementById('setting_label_data_last_logontime_edit').innerHTML = format_json_date(json.last_logontime, null, timezone, lang_code);
                        document.getElementById('setting_label_data_account_created_edit').innerHTML = format_json_date(json.date_created, null, timezone, lang_code);
                        document.getElementById('setting_label_data_account_modified_edit').innerHTML = format_json_date(json.date_modified, null, timezone, lang_code);
                        return callBack(null, {id: json.id,
                                               provider_1:      json.provider1_id,
                                               provider_2:      json.provider2_id,
                                               avatar:          json.avatar,
                                               provider1_image: json.provider1_image,
                                               provider2_image: json.provider2_image
                                              });
                    } else {
                        //User not found
                        show_message('ERROR', 20305, null, null, global_main_app_id, lang_code);
                        return callBack('ERROR', null);
                    }
                } else {
                    exception(status, result, lang_code);
                    return callBack(result, null);
                }
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
                return callBack(error, null);
            });
    }
}
async function user_update(user_id, lang_code, callBack) {
    let avatar = btoa(document.getElementById('user_edit_avatar_img').src);
    let username = document.getElementById('setting_input_username_edit').value;
    let bio = document.getElementById('setting_input_bio_edit').value;
    let email = document.getElementById('setting_input_email_edit').value;
    let password = document.getElementById('setting_input_password_edit').value;
    let password_confirm = document.getElementById('setting_input_password_confirm_edit').value;
    let new_password = document.getElementById('setting_input_new_password_edit').value;
    let new_password_confirm = document.getElementById('setting_input_new_password_confirm_edit').value;
    let password_reminder = document.getElementById('setting_input_password_reminder_edit').value;
    
    let url;
    let json;
    let json_data;
    let status;

    //validate input
    if (username == '') {
        //"Please enter username"
        document.getElementById('setting_input_username_edit').classList.add('input_error');
        show_message('ERROR', 20303, null, null, lang_code);
        return callBack('ERROR', null);
    }
    
    if (document.getElementById('user_edit_local').style.display == 'block') {
        json_data = `{ 
                        "username":"${username}",
                        "bio":"${bio}",
                        "private": ${boolean_to_number(document.getElementById('setting_checkbox_profile_private').checked)},
                        "password":"${password}",
                        "new_password":"${new_password}",
                        "password_reminder":"${password_reminder}",
                        "email":"${email}",
                        "avatar":"${avatar}"
                    }`;
        url = global_rest_url_base + global_rest_user_account + user_id;
        document.getElementById('setting_input_username_edit').classList.remove('input_error');

        document.getElementById('setting_input_bio_edit').classList.remove('input_error');
        document.getElementById('setting_input_email_edit').classList.remove('input_error');

        document.getElementById('setting_input_password_edit').classList.remove('input_error');
        document.getElementById('setting_input_password_confirm_edit').classList.remove('input_error');
        document.getElementById('setting_input_new_password_edit').classList.remove('input_error');
        document.getElementById('setting_input_new_password_confirm_edit').classList.remove('input_error');

        document.getElementById('setting_input_password_reminder_edit').classList.remove('input_error');

        if (password == '') {
            //"Please enter password"
            document.getElementById('setting_input_password_edit').classList.add('input_error');
            show_message('ERROR', 20304, null, null, global_main_app_id, lang_code);
            return callBack('ERROR', null);
        }
        if (password != password_confirm) {
            //Password not the same
            document.getElementById('setting_input_password_confirm_edit').classList.add('input_error');
            show_message('ERROR', 20301, null, null, global_main_app_id, lang_code);
            return callBack('ERROR', null);
        }
        //check new passwords
        if (new_password != new_password_confirm) {
            //New Password are entered but they are not the same
            document.getElementById('setting_input_new_password_edit').classList.add('input_error');
            document.getElementById('setting_input_new_password_confirm_edit').classList.add('input_error');
            show_message('ERROR', 20301, null, null, lang_code);
            return callBack('ERROR', null);
        }
    } else {
        json_data = `{"username":"${username}",
                      "bio":"${bio}",
                      "private":${boolean_to_number(document.getElementById('setting_checkbox_profile_private').checked)}
                     }`;
        url = global_rest_url_base + global_rest_user_account_common + user_id
    }
    spinner('UPDATE', 'visible');
    //update user using REST API
    fetch(url + '?app_id=' + global_app_id +
                '&lang_code=' + lang_code, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status == 200) {
                json = JSON.parse(result);
                document.getElementById('dialogue_user_edit').style.visibility = "hidden";
                document.getElementById('user_edit_avatar').style.display = 'none';

                document.getElementById('setting_checkbox_profile_private').checked = false;
                document.getElementById('setting_input_username_edit').value = '';
                document.getElementById('setting_input_bio_edit').value = '';
                document.getElementById('setting_input_email_edit').value = '';
                document.getElementById('setting_input_password_edit').value = '';
                document.getElementById('setting_input_password_confirm_edit').value = '';
                document.getElementById('setting_input_new_password_edit').value = '';
                document.getElementById('setting_input_new_password_confirm_edit').value = '';
                document.getElementById('setting_input_password_reminder_edit').value = '';
                //provider
                document.getElementById('setting_user_edit_provider_logo').innerHTML = '';
                document.getElementById('setting_label_provider_id_edit_data').innerHTML = '';
                document.getElementById('setting_label_provider_name_edit_data').innerHTML = '';
                document.getElementById('setting_label_provider_email_edit_data').innerHTML = '';
                document.getElementById('setting_label_provider_image_url_edit_data').innerHTML = '';

                document.getElementById('setting_label_data_last_logontime_edit').innerHTML = '';
                document.getElementById('setting_label_data_account_created_edit').innerHTML = '';
                document.getElementById('setting_label_data_account_modified_edit').innerHTML = '';
                spinner('UPDATE', 'hidden');
                return callBack(null, {username: username, 
                                       avatar: avatar,
                                       bio: bio});
            } else {
                spinner('UPDATE', 'hidden');
                exception(status, result, lang_code);
                return callBack(result, null);
            }
        })
        .catch(function(error) {
            spinner('UPDATE', 'hidden');
            show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
            return callBack(error, null);
        });
}
function user_signup(item_destination_user_id, lang_code) {
    let username = document.getElementById('signup_username').value;
    let email = document.getElementById('signup_email').value;
    let password = document.getElementById('signup_password').value;
    let password_confirm = document.getElementById('signup_password_confirm').value;
    let password_reminder = document.getElementById('signup_password_reminder').value;

    let json_data = `{
                    "user_language": "${navigator.language}",
                    "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
                    "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
                    "user_platform": "${navigator.platform}",
                    "username":"${username}",
                    "password":"${password}",
                    "password_reminder":"${password_reminder}",
                    "email":"${email}",
                    "active":0 }`;
    let status;
    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, global_main_app_id, lang_code);
        return null;
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, global_main_app_id, lang_code);
        return null;
    }
    if (password != password_confirm) {
        //Password not the same
        show_message('ERROR', 20301, null, null, global_main_app_id, lang_code);
        return null;
    }

    spinner('SIGNUP', 'visible');
    fetch(global_rest_url_base + global_rest_user_account_signup +
            '?app_id=' + global_app_id +
            '&lang_code=' + lang_code, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_dt
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            spinner('SIGNUP', 'hidden');
            if (status == 200) {
                json = JSON.parse(result);
                global_rest_at = json.accessToken;
                //update item with new user_account.id
                item_destination_user_id.innerHTML = json.id;
                show_common_dialogue('VERIFY');
            } else {
                exception(status, result, lang_code);
            }
        })
        .catch(function(error) {
            spinner('SIGNUP', 'hidden');
            show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
        });
}
async function user_verify_check_input(item, user_id, nextField, lang_code, callBack) {

    let status;
    let json;
    let json_data;
    //only accept 0-9
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(document.getElementById(item.id).value) > -1)
        if (nextField == '' || (document.getElementById('user_verify_verification_char1').value != '' &
                document.getElementById('user_verify_verification_char2').value != '' &
                document.getElementById('user_verify_verification_char3').value != '' &
                document.getElementById('user_verify_verification_char4').value != '' &
                document.getElementById('user_verify_verification_char5').value != '' &
                document.getElementById('user_verify_verification_char6').value != '')) {
            //last field, validate entered code
            let validation_code = parseInt(document.getElementById('user_verify_verification_char1').value +
                document.getElementById('user_verify_verification_char2').value +
                document.getElementById('user_verify_verification_char3').value +
                document.getElementById('user_verify_verification_char4').value +
                document.getElementById('user_verify_verification_char5').value +
                document.getElementById('user_verify_verification_char6').value);
            spinner('SIGNUP', 'visible');
            document.getElementById('user_verify_verification_char1').classList.remove('input_error');
            document.getElementById('user_verify_verification_char2').classList.remove('input_error');
            document.getElementById('user_verify_verification_char3').classList.remove('input_error');
            document.getElementById('user_verify_verification_char4').classList.remove('input_error');
            document.getElementById('user_verify_verification_char5').classList.remove('input_error');
            document.getElementById('user_verify_verification_char6').classList.remove('input_error');

            //activate user
            json_data = '{"validation_code":"' + validation_code + '"}';
            fetch(global_rest_url_base + global_rest_user_account_activate + user_id +
                    '?app_id=' + global_app_id + 
                    '&lang_code=' + lang_code, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + global_rest_dt
                    },
                    body: json_data
                })
                .then(function(response) {
                    status = response.status;
                    return response.text();
                })
                .then(function(result) {
                    spinner('SIGNUP', 'hidden');
                    if (status == 200) {
                        json = JSON.parse(result);
                        if (json.items[0].affectedRows == 1) {
                            //login with username and password from signup fields
                            document.getElementById('dialogue_login').style.visibility = "hidden";
                            document.getElementById('login_username').value =
                                document.getElementById('signup_username').value;
                            document.getElementById('login_password').value =
                                document.getElementById('signup_password').value;

                            document.getElementById('dialogue_signup').style.visibility = 'hidden';
                            document.getElementById('signup_username').value = '';
                            document.getElementById('signup_email').value = '';
                            document.getElementById('signup_password').value = '';
                            document.getElementById('signup_password_confirm').value = '';
                            document.getElementById('signup_password_reminder').value = '';
                            
                            document.getElementById('dialogue_user_verify').style.visibility = 'hidden';
                            document.getElementById('user_verify_verification_char1').value = '';
                            document.getElementById('user_verify_verification_char2').value = '';
                            document.getElementById('user_verify_verification_char3').value = '';
                            document.getElementById('user_verify_verification_char4').value = '';
                            document.getElementById('user_verify_verification_char5').value = '';
                            document.getElementById('user_verify_verification_char6').value = '';
                            return callBack(null, {actived: 1});

                        } else {
                            document.getElementById('user_verify_verification_char1').classList.add('input_error');
                            document.getElementById('user_verify_verification_char2').classList.add('input_error');
                            document.getElementById('user_verify_verification_char3').classList.add('input_error');
                            document.getElementById('user_verify_verification_char4').classList.add('input_error');
                            document.getElementById('user_verify_verification_char5').classList.add('input_error');
                            document.getElementById('user_verify_verification_char6').classList.add('input_error');
                            //code not valid
                            show_message('ERROR', 20306, null, null, global_main_app_id, lang_code);
                            return callBack('ERROR', null);
                        }
                    } else {
                        exception(status, result, lang_code);
                        return callBack(result, null);
                    }
                })
                .catch(function(error) {
                    spinner('SIGNUP', 'hidden');
                    show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
                    return callBack(error, null);
                });
        } else{
            //not last, next!
            document.getElementById(nextField).focus();
            return callBack(null, null);
        }
    else{
        //remove anything else than 0-9
        document.getElementById(item.id).value = '';
        return callBack(null, null);
    }
}
async function user_delete(choice=null, user_account_id, user_local, function_delete_event, lang_code, callBack ) {
    let password = document.getElementById('setting_input_password_edit').value;
    let status;
    switch (choice){
        case null:{
            if (user_local==true && password == '') {
                //"Please enter password"
                document.getElementById('setting_input_password_edit').classList.add('input_error');
                show_message('ERROR', 20304, null, null, global_main_app_id, lang_code);
                return null;
            }
            show_message('CONFIRM',null,function_delete_event, null, null, global_app_id, lang_code);
            return callBack('CONFIRM',null);
            break;
        }
        case 1:{
            document.getElementById("dialogue_message").style.visibility = "hidden";
            document.getElementById('setting_input_username_edit').classList.remove('input_error');
            document.getElementById('setting_input_bio_edit').classList.remove('input_error');
            document.getElementById('setting_input_email_edit').classList.remove('input_error');
            document.getElementById('setting_input_password_edit').classList.remove('input_error');
            document.getElementById('setting_input_password_confirm_edit').classList.remove('input_error');
            document.getElementById('setting_input_new_password_edit').classList.remove('input_error');
            document.getElementById('setting_input_new_password_confirm_edit').classList.remove('input_error');
            document.getElementById('setting_input_password_reminder_edit').classList.remove('input_error');
    
            spinner('DELETE_ACCOUNT', 'visible');
            let json_data = `{"password":"${password}"}`;
            fetch(global_rest_url_base + global_rest_user_account + user_account_id + 
                    '?app_id=' + global_app_id +
                    '&lang_code=' + lang_code, 
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + global_rest_at
                    },
                    body: json_data
                })
                .then(function(response) {
                    status = response.status;
                    return response.text();
                })
                .then(function(result) {
                    spinner('DELETE_ACCOUNT', 'hidden');
                    if (status == 200)
                        return callBack(null,{deleted: 1});
                    else{
                        exception(status, result, lang_code);
                        return callBack(result,null);
                    }
                })
                .catch(function(error) {
                    spinner('DELETE_ACCOUNT', 'hidden');
                    show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
                    return callBack(error,null);
                });
            break;
        }
        default:
            break;
    }
}
function user_function(user_function, user_id, lang_code, callBack) {
    let user_id_profile = document.getElementById('profile_id').innerHTML;
    let status;
    let json_data;
    let method;
    let rest_path;
    let check_div;
    switch (user_function) {
        case 'FOLLOW':
            {
                rest_path = global_rest_user_account_follow;
                json_data = '{"user_account_id":' + user_id_profile + '}';
                check_div = document.getElementById('profile_follow');
                break;
            }
        case 'LIKE':
            {
                rest_path = global_rest_user_account_like;
                json_data = '{"user_account_id":' + user_id_profile + '}';
                check_div = document.getElementById('profile_like');
                break;
            }
    }

    if (user_id == '')
        show_common_dialogue('LOGIN');
    else {
        if (check_div.children[0].style.display == 'block') {
            method = 'POST';
        } else {
            method = 'DELETE';
        }
        fetch(global_rest_url_base + rest_path + user_id +
                '?app_id=' + global_app_id + 
                '&lang_code=' + lang_code, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global_rest_at
                },
                body: json_data
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(result) {
                if (status == 200) {
                    json = JSON.parse(result);
                    switch (user_function) {
                        case 'FOLLOW':
                            {
                                if (document.getElementById('profile_follow').children[0].style.display == 'block'){
                                    //follow
                                    document.getElementById('profile_follow').children[0].style.display = 'none';
                                    document.getElementById('profile_follow').children[1].style.display = 'block';
                                }
                                else{
                                    //unfollow
                                    document.getElementById('profile_follow').children[0].style.display = 'block';
                                    document.getElementById('profile_follow').children[1].style.display = 'none';
                                }
                                break;
                            }
                        case 'LIKE':
                            {
                                if (document.getElementById('profile_like').children[0].style.display == 'block'){
                                    //like
                                    document.getElementById('profile_like').children[0].style.display = 'none';
                                    document.getElementById('profile_like').children[1].style.display = 'block';
                                }
                                else{
                                    //unlike
                                    document.getElementById('profile_like').children[0].style.display = 'block';
                                    document.getElementById('profile_like').children[1].style.display = 'none';
                                }
                                break;
                            }
                    }
                    return callBack(null, {});
                } else {
                    exception(status, result, lang_code);
                    return callBack(result, null);
                }
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
                return callBack(error, null);
            });
    }
}
function user_account_app(app_id, user_account_id, lang_code) {
    let status;
    let json_data =
        `{"app_id": ${app_id},
          "user_account_id": ${user_account_id}
         }`;
    fetch(global_rest_url_base + global_rest_user_account_app +
            '?lang_code=' + lang_code, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status === 200) {
                let json = JSON.parse(result);
            } else {
                exception(status, result, lang_code);
            }
        })
        .catch(function(error) {
            show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
        });
}
async function profile_update_stat(lang_code, callBack){
    let profile_id = document.getElementById('profile_id');
    let json_data =
    `{
    "client_longitude": "${global_session_user_gps_longitude}",
    "client_latitude": "${global_session_user_gps_latitude}"
    }`;
    //get updated stat for given user
    //to avoid update in stat set searched by same user
    let url = global_rest_url_base + global_rest_user_account_profile_userid + profile_id.innerHTML;
    let status;
    fetch(url + 
        '?app_id=' + global_app_id + 
        '&lang_code=' + lang_code +
        '&id=' + profile_id.innerHTML, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + global_rest_dt
        },
        body: json_data
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status == 200) {
            json = JSON.parse(result);
            document.getElementById('profile_info_view_count').innerHTML = json.count_views;
            document.getElementById('profile_info_following_count').innerHTML = json.count_following;
            document.getElementById('profile_info_followers_count').innerHTML = json.count_followed;
            document.getElementById('profile_info_likes_count').innerHTML = json.count_likes;
            document.getElementById('profile_info_liked_count').innerHTML = json.count_liked;
            return callBack(null, {id : json.id})
        }
        else
            return callBack(result, null);
    })
}
function set_app_globals_head() {
    //call this function from index.html i head before body is loaded
    //set meta tags in header        
    document.title = global_app_name;
    document.querySelector('meta[name="apple-mobile-web-app-title"]').setAttribute("content", global_app_name)
}

async function init_providers(provider1_function, provider2_function){
    //enable provider 1 if used
    if (global_app_user_provider1_use==1){
        document.getElementById('g_id_onload').setAttribute('data-client_id', global_app_user_provider1_id);
        document.getElementById('g_id_onload').setAttribute('data-callback', provider1_function);
        document.getElementById('g_id_onload').setAttribute('data-auto_select', 'true');
        document.getElementsByClassName('g_id_signin')[0].setAttribute('data-shape', 'circle');
        document.getElementsByClassName('g_id_signin')[0].setAttribute('data-width', '268');
        document.getElementsByClassName('g_id_signin')[0].setAttribute('data-text', 'continue_with');

        /*Provider 1 SDK*/
        let tag = document.createElement('script');
        tag.src = global_app_user_provider1_api_src;
        tag.defer = true;
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    else
        document.getElementsByClassName('g_id_signin')[0].className += 'login_button_hidden';
    //enable provider 2 if used
    if (global_app_user_provider2_use==1){
        document.getElementById('login_facebook').addEventListener('click', provider2_function, false);
        /*Provider 2 SDK*/
        window.fbAsyncInit = function() {
            FB.init({
            appId      : global_app_user_provider2_id,
            cookie     : true,
            xfbml      : true,
            version    : global_app_user_provider2_api_version
            });
            
            /*FB.AppEvents.logPageView();   */
            
        };
        (function(d, s, id){
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = global_app_user_provider2_api_src + 
                    navigator.language.replace(/-/g, '_') + 
                    global_app_user_provider2_api_src2;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    else
        document.getElementById('login_facebook').className = 'login_button_hidden';
}
async function updateProviderUser(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, lang_code, callBack) {
    let json;
    let status;
    let profile_image;
    let img = new Image();

    img.src = profile_image_url;
    img.crossOrigin = 'Anonymous';
    img.onload = function(el) {
        let elem = document.createElement('canvas');
        elem.width = global_user_image_avatar_width;
        elem.height = global_user_image_avatar_height;
        let ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
        profile_image = ctx.canvas.toDataURL(global_image_file_mime_type);
        let json_data =
            `{
            "app_id": ${global_app_id},
            "user_language": "${navigator.language}",
            "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
            "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
            "user_platform": "${navigator.platform}",
            "active": 1,
            "provider_no": ${provider_no},
            "${'provider' + provider_no + '_id'}":"${profile_id}",
            "${'provider' + provider_no + '_first_name'}":"${profile_first_name}",
            "${'provider' + provider_no + '_last_name'}":"${profile_last_name}",
            "${'provider' + provider_no + '_image'}":"${btoa(profile_image)}",
            "${'provider' + provider_no + '_image_url'}":"${profile_image_url}",
            "${'provider' + provider_no + '_email'}":"${profile_email}"}`;
        fetch(global_rest_url_base + global_rest_user_account_provider + profile_id +
                '?lang_code=' + lang_code, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global_rest_dt
                },
                body: json_data
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(result) {
                if (status == 200) {
                    json = JSON.parse(result);
                    global_rest_at = json.accessToken;
                    document.getElementById('dialogue_login').style.visibility = 'hidden';
                    document.getElementById('dialogue_signup').style.visibility = 'hidden';
                    return callBack(null, {user_account_id: json.items[0].id,
                                           username: json.items[0].username,
                                           bio: json.items[0].bio,
                                           avatar: profile_image,
                                           first_name: profile_first_name,
                                           last_name: profile_last_name,
                                           userCreated: json.userCreated});
                } 
                else {
                    exception(status, result, lang_code);
                    return callBack(result, null);
                }
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
                return callBack(error, null);
            });
    }
}
async function onProviderSignIn(googleUser, callBack) {
    let profile;
    function fb_api(){
        FB.api('/me?fields=id,first_name,last_name,picture, email', function(response) {
            return callBack(null, {provider_no: 2,
                                   profile_id: response.id,
                                   profile_first_name: response.first_name,
                                   profile_last_name: response.last_name,
                                   profile_image_url: response.picture.data.url,
                                   profile_email: response.email});
        });
    }
    if (googleUser) {
        profile = parseJwt(googleUser.credential);
        return callBack(null, {provider_no: 1,
                               profile_id: profile.sub,
                               profile_first_name: profile.given_name,
                               profile_last_name: profile.family_name,
                               profile_image_url: profile.picture,
                               profile_email: profile.email});
    } else {
        FB.getLoginStatus(function(response) {
            if (response.status === 'connected') 
                return fb_api();
            else
                FB.login(function(response) {
                    if (response.authResponse) {
                        return fb_api();
                    } else
                        console.log('User cancelled login or did not fully authorize.');
                        return callBack('ERROR', null);
                });
        });
    }
}
async function get_data_token(user_id, lang_code) {
    let status;
    await fetch(global_service_auth + 
                '?app_id=' + global_app_id + 
                '&app_user_id=' + user_id +
                '&lang_code=' + lang_code, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(global_app_rest_client_id + ':' + global_app_rest_client_secret)
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            let json = JSON.parse(result);
            global_rest_dt = json.token_dt;
        } else {
            show_message('EXCEPTION', null,null, result, global_app_id, lang_code);
        }    
    })
}
async function get_gps_from_ip(user_id, lang_code) {

    let status;
    await fetch(global_service_geolocation + global_service_geolocation_gps_ip + 
                '?app_id=' + global_app_id + 
                '&app_user_id=' +  user_id +
                '&lang_code=' + lang_code, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + global_rest_dt,
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            let json = JSON.parse(result);
            global_session_user_gps_latitude  = json.geoplugin_latitude;
            global_session_user_gps_longitude = json.geoplugin_longitude;
            global_session_user_gps_place     = json.geoplugin_city + ', ' +
                                                json.geoplugin_regionName + ', ' +
                                                json.geoplugin_countryName;
        } else {
            exception(status, result, lang_code);
        }
    })
}
function app_log(app_module, app_module_type, app_module_request, app_module_result, app_user_id,
    user_gps_latitude, user_gps_longitude, lang_code){
    var status;
    let json_data =`{
                    "app_id":"${global_app_id}",
                    "app_module":"${app_module}",
                    "app_module_type":"${app_module_type}",
                    "app_module_request":"${app_module_request}",
                    "app_module_result":"${app_module_result}",
                    "app_user_id":"${app_user_id}",
                    "user_language": "${navigator.language}",
                    "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
                    "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
                    "user_platform": "${navigator.platform}",
                    "user_gps_latitude": "${user_gps_latitude}",
                    "user_gps_longitude": "${user_gps_longitude}"
                    }`;

    fetch(global_rest_url_base + global_rest_app_log +
        '?lang_code=' + lang_code,
        {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + global_rest_dt
        },
        body: json_data
    })
    .then(function(response){
        status = response.status;
        return response.text();
    })
    .then(function(response) {
        if (status === 200)
            return null;
        else
            return null;
    })
    .catch(function(error) {
        show_message('EXCEPTION', null,null, error, global_app_id, lang_code);
    });
}

function show_common_dialogue(dialogue, file = '') {
    switch (dialogue) {
        case 'VERIFY':
            {
                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                document.getElementById('dialogue_user_verify').style.visibility = 'visible';
                break;
            }
        case 'LOGIN':
            {
                document.getElementById('dialogue_login').style.visibility = 'visible';
                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                document.getElementById('login_username').focus();
                break;
            }
        case 'SIGNUP':
            {
                document.getElementById('dialogue_signup').style.visibility = 'visible';
                document.getElementById('dialogue_login').style.visibility = 'hidden';
                document.getElementById('signup_username').focus();
                break;
            }
    }
    return null;   
}

function show_message(message_type, code, function_event, message_text='', app_id, lang_code='en-us'){
    let confirm_question = document.getElementById('confirm_question');
    let message_title = document.getElementById('message_title');
    let dialogue = document.getElementById('dialogue_message');
    let old_close = document.getElementById('message_close');
    let button_cancel = document.getElementById('message_cancel');
    let function_close = function() { document.getElementById('dialogue_message').style.visibility = 'hidden'};
    let show = 'inline-block';
    let hide = 'none';
    //this removes old eventlistener
    let button_close = old_close.cloneNode(true);
    old_close.parentNode.replaceChild(button_close, old_close);
    //INFO, ERROR, CONFIRM, EXCEPTION
    switch (message_type){
        case 'ERROR':{
            fetch(global_rest_url_base + global_rest_message_translation + code + 
                '?app_id=' + app_id +
                '&lang_code=' + lang_code, 
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_dt
                }
            })
            .then(function(response) {
                return response.text();
            })
            .then(function(response) {
                confirm_question.style.display = hide;
                button_cancel.style.display = hide;
                message_title.style.display = show;
                message_title.innerHTML = JSON.parse(response).data.text;
                button_close.addEventListener('click', function_close, false);
                dialogue.style.visibility = 'visible';
                button_close.focus();
            }).catch(function(error) {
                show_message('EXCEPTION', null,null, error, app_id, lang_code);
            })
            break;
        }
        case 'INFO':{
            confirm_question.style.display = hide;
            button_cancel.style.display = hide;
            message_title.style.display = show;
            message_title.innerHTML = message_text;
            button_close.addEventListener('click', function_close, false);
            dialogue.style.visibility = 'visible';
            button_close.focus();
            break;
        }
        case 'EXCEPTION':{
            confirm_question.style.display = hide;
            button_cancel.style.display = hide;
            message_title.style.display = show;
            try {
                // dont show code or errno returned from json
                if (typeof JSON.parse(message_text).message !== "undefined"){
                    // message from Node controller.js and service.js files
                    message_title.innerHTML= JSON.parse(message_text).message;
                }
                else{
                    //message from Mysql, code + sqlMessage
                    if (typeof JSON.parse(message_text).sqlMessage !== "undefined")
                        message_title.innerHTML= JSON.parse(message_text).sqlMessage;
                    else{
                        //message from Oracle, errorNum, offset
                        if (typeof JSON.parse(message_text).errorNum !== "undefined")
                            message_title.innerHTML= JSON.parse(message_text).errorNum;
                        else{
                            message_text = message_text.replace('<pre>','');
                            message_text = message_text.replace('</pre>','');
                            message_title.innerHTML= message_text;
                        }
                    }    
                }
            } catch (e) {
                //other error and json not returned, return the whole text
                message_title.innerHTML = message_text;
            }
            button_close.addEventListener('click', function_close, false);
            dialogue.style.visibility = 'visible';
            button_close.focus();
            break;
        }
        case 'CONFIRM':{
            confirm_question.style.display = show;
            button_cancel.style.display = show;
            message_title.style.display = hide;
            message_title.innerHTML = '';
            button_close.addEventListener('click', function_event, false);
            dialogue.style.visibility = 'visible';
            button_close.focus();
            break;
        }
    }
}
/*----------------------- */
/* QR functions */
/*----------------------- */

function create_qr(div, url) {
    let qrcode = new QRCode(document.getElementById(div), {
        text: url,
        width: global_qr_width,
        height: global_qr_height,
        colorDark: global_qr_color_dark,
        colorLight: global_qr_color_light,
        logo: global_qr_logo_file_path,
        logoWidth: global_qr_logo_width,
        logoHeight: global_qr_logo_height,
        logoBackgroundColor: global_qr_background_color,
        logoBackgroundTransparent: false
    });
}
/*----------------------------- */
/* General javascript functions */
/*----------------------------- */
function get_null_or_value(value) {
    if (value == null)
        return '';
    else
        return value;
}
function format_json_date(db_date, short, timezone, lang_code) {
    if (db_date == null)
        return null;
    else {
        //Json returns UTC time
        //in ISO 8601 format
        //JSON returns format 2020-08-08T05:15:28Z
        //"yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        let settings = {
            timezone_current: timezone,
            locale: lang_code
        }
        let options;
        if (short)
            options = {
                timeZone: settings.timezone_current,
                year: 'numeric',
                month: 'long'
            };
        else
            options = {
                timeZone: settings.timezone_current,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'long'
            };
        let utc_date = new Date(Date.UTC(
            db_date.substr(0, 4), //year
            db_date.substr(5, 2) - 1, //month
            db_date.substr(8, 2), //day
            db_date.substr(11, 2), //hour
            db_date.substr(14, 2), //min
            db_date.substr(17, 2) //sec
        ));
        let format_date = utc_date.toLocaleDateString(settings.locale, options);
        return format_date;
    }
}

function mobile(){
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
   }
   
//function to convert buffert to one string
function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return atob(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}
function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

//function to check image if to read buffer or not
function image_format(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    if (arr == null || arr == '')
        return '';
    else {
        //Oracle returns buffer for BLOB
        if (arr.data) {
            //buffer
            return toBase64(arr.data);
        } else {
            //not buffer
            return atob(arr);
        }
    }
}
function spinner(button, visibility) {
    let button_spinner = `<div id="button_spinner" class="load-spinner">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                         </div>`;
    let button_default_icon_login = '<i class="fas fa-arrow-alt-circle-right"></i>';
    let button_default_icon_signup = '<i class="fas fa-arrow-alt-circle-right"></i>';
    let button_default_icon_update = '<i class="fas fa-save"></i>';
    let button_default_icon_delete_account = '<i class="fas fa-trash-alt"></i>';
    
    let button_update_text = document.getElementById('setting_btn_label_user_update').outerHTML;
    let button_delete_account_text = document.getElementById('setting_btn_label_user_delete_account').outerHTML;
    
    switch (button) {
        case 'LOGIN':
            {
                if (visibility == 'visible')
                    document.getElementById('login_button').innerHTML = button_spinner;
                else
                    document.getElementById('login_button').innerHTML = button_default_icon_login;
                break;
            }
        case 'SIGNUP':
            {
                if (visibility == 'visible')
                    document.getElementById('signup_button').innerHTML = button_spinner;
                else
                    document.getElementById('signup_button').innerHTML = button_default_icon_signup;
                break;
            }
        case 'UPDATE':
            {
                if (visibility == 'visible')
                    document.getElementById('setting_btn_user_update').innerHTML = button_spinner + button_update_text;
                else
                    document.getElementById('setting_btn_user_update').innerHTML = button_default_icon_update + button_update_text;
                break;
            }
        case 'DELETE_ACCOUNT':
            {
                if (visibility == 'visible')
                    document.getElementById('setting_btn_user_delete_account').innerHTML = button_spinner + button_delete_account_text;
                else
                    document.getElementById('setting_btn_user_delete_account').innerHTML = button_default_icon_delete_account + button_delete_account_text;
                break;
            }
        default:
            {
                null;
            }
    }
    return null;
}
function exception(status, message, lang_code){
    if (status == 401)
        eval(`(function (){${global_exception_app_function}()}());`);
    else
        show_message('EXCEPTION',  null, null, message, global_app_id, lang_code);
}
function recreate_img(img_item) {
    //cant set img src to null, it will containt url or show corrupt image
    //recreating the img is the workaround
    let parentnode = img_item.parentNode;
    let id = img_item.id;
    let alt = img_item.alt;
    let img = document.createElement('img');

    parentnode.removeChild(img_item);
    img.id = id;
    img.alt = alt;
    parentnode.appendChild(img);
    return null;
}
function boolean_to_number(boolean_value) {
    if (boolean_value == true)
        return 1;
    else
        return 0;
}
function number_to_boolean(number_value) {
    if (number_value == 1)
        return true;
    else
        return false;
}
function show_image(item_img, item_input, image_width, image_height, lang_code) {
    let file = document.getElementById(item_input).files[0];
    let reader = new FileReader();

    const allowedExtensions = [global_image_file_allowed_type1,
                               global_image_file_allowed_type2,
                               global_image_file_allowed_type3
                              ];
    const { name: fileName, size: fileSize } = file;
    const fileExtension = fileName.split(".").pop();
    if (!allowedExtensions.includes(fileExtension)){
        //File type not allowed
        show_message('ERROR', 20307, null,null, global_main_app_id, lang_code);
    }
    else
        if (fileSize > global_image_file_max_size){
            //File size too large
            show_message('ERROR', 20308, null, null, global_main_app_id, lang_code);
        }
        else {
            /*Save all file in mime type format specified in parameter
             using direct "...item_img.src = event.target.result;..." instead
             of "...ctx.canvas.toDataURL()..." usage would not convert uploaded file 
             to desired format, for example uploading png file will convert to jpg image
             and to specified size, this will save space in database */
            reader.onloadend = function(event) {
                let img = new Image();
                img.src = event.target.result;
                
                img.onload = function(el) {
                    let elem = document.createElement('canvas');
                    elem.width = image_width;
                    elem.height = image_height;
                    let ctx = elem.getContext('2d');
                    ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
                    let srcEncoded = ctx.canvas.toDataURL(global_image_file_mime_type);
                    item_img.src = srcEncoded;
                }
            }
        }
    if (file)
        reader.readAsDataURL(file); //reads the data as a URL
    else
        item_show.src = '';
    return null;
}