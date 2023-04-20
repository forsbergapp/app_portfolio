/*  Functions and globals in this order:
    GLOBALS
    MISC
    MESSAGE & DIALOGUE
    WINDOW INFO
    PROFILE
    USER
    USER PROVIDER
    MODULE EASY.QRCODE
    MODULE LEAFLET
    SERVICE BROADCAST
    SERVICE GEOLOCATION
    SERVICE WORLDCITIES
    EXCEPTION
    INIT
 */
/*----------------------- */
/* GLOBALS                */
/*----------------------- */

//CONTINUE
const COMMON_GLOBAL = {
    "common_app_id":"",
    "app_id":null,
    "app_name":"",
    "app_url":"",
    "app_logo":"",
    "exception_app_function":"",
    "app_rest_client_id":"",
    "app_rest_client_secret":"",
    "user_app_role_id":"",
    "system_admin":"",
    "system_admin_only":"",
    "user_identity_provider_id":"",
    "user_account_id":"",
    "client_latitude":"",
    "client_longitude":"",
    "client_place":"",
    "rest_at":"",
    "rest_dt":"",
    "rest_admin_at":"",
    "image_file_allowed_type1":"",
    "image_file_allowed_type2":"",
    "image_file_allowed_type3":"",
    "image_file_allowed_type4":"",
    "image_file_allowed_type5":"",
    "image_file_mime_type":"",
    "image_file_max_size":"",
    "image_avatar_width":"",
    "image_avatar_height":"",
    "user_locale":"",
    "user_timezone":"",
    "user_direction":"",
    "user_arabic_script":"",
    "user_preference_save":"",
    "module_leaflet_path":"/common/modules/leaflet/leaflet-src.module.js",
    "module_leaflet_library": "",
    "module_leaflet_flyto":"",
    "module_leaflet_jumpto":"",
    "module_leaflet_popup_offset":"",
    "module_leaflet_style":"",
    "module_leaflet_session_map":"",
    "module_leaflet_session_map_layer":"",
    "module_leaflet_session_map_OpenStreetMap_Mapnik":"",
    "module_leaflet_session_map_Esri_WorldImagery":"",
    "module_easy.qrcode_path":"/common/modules/easy.qrcode/easy.qrcode.module.js",
    "module_easy.qrcode_width":"",
    "module_easy.qrcode_height":"",
    "module_easy.qrcode_color_dark":"",
    "module_easy.qrcode_color_light":"",
    "module_easy.qrcode_logo_file_path":"",
    "module_easy.qrcode_logo_width":"",
    "module_easy.qrcode_logo_height":"",
    "module_easy.qrcode_background_color":"",
    "service_broadcast_client_ID":"",
    "service_broadcast_eventsource":""
};
const icon_string = (hexvalue) => `<div class='common_icon'>${String.fromCharCode(parseInt(hexvalue, 16))}</div>`;
const ICONS = {
    "app_system_admin":         icon_string('f4fe'),
    "app_apps":                 `<svg viewBox='0 0 24 24' enable-background='new 0 0 24 24'>
                                    <path d='M10,2H3C2.4,2,2,2.4,2,3v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1V3C11,2.4,10.6,2,10,2z M10,13H3c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1v-7C11,13.4,10.6,13,10,13z M21,2h-7c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1V3C22,2.4,21.6,2,21,2z M21,13h-7c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1v-7C22,13.4,21.6,13,21,13z'/>
                                </svg>`,
    "app_maintenance":          '⚒',
    "app_alert":                '🚨',
    "app_mobile":               icon_string('f3cf'),
    "app_save":                 icon_string('f0c7'),
    "app_add":                  icon_string('2b'),
    "app_delete":               icon_string('f2ed'),
    "app_update":               icon_string('f0c7'),
    "app_edit":                 icon_string('f044'),
    "app_lov":                  icon_string('f139'),
    "app_send":                 icon_string('f1d8'),
    "app_sendmail":             icon_string('f0e0'),
    "app_email":                icon_string('f0e0'),
    "app_settings":             icon_string('f013'),
    "app_chat":                 icon_string('f075'),
    "app_log":                  icon_string('f03a'),
    "app_chart":                icon_string('f200'),
    "app_server":               icon_string('f233'),
    "app_route":                icon_string('f0e8'),
    "app_database":             icon_string('f1c0'),
    "app_database_schema":      icon_string('f0e8'),
    "app_users":                icon_string('f0c0'),
    "app_user_connections":     icon_string('e595'),
    "app_database_started":     icon_string('f205'),
    "app_database_notstarted":  icon_string('f204'),
    "app_database_calc":        icon_string('f1ec'),
    "app_backup":               icon_string('f0ed'),
    "app_install":              icon_string('f019'),
    "app_file_path":            icon_string('f802'),
    "app_broadcast":            icon_string('f519'),
    "app_restore":              icon_string('f0ee'),
    "app_checkbox_checked":     icon_string('f14a'),
    "app_checkbox_empty":       icon_string('f0c8'),
    "app_info":                 icon_string('f05a'),
    "app_close":                icon_string('f058'),
    "app_online":               icon_string('f111'),
    "app_search":               icon_string('f002'),
    "app_menu_open":            '☰',
    "app_menu_close":           icon_string('f410'),
    "app_broadcast_close":      icon_string('f410'),
    "app_first":                icon_string('f048'),
    "app_previous":             icon_string('f0d9'),
    "app_next":                 icon_string('f0da'),
    "app_last":                 icon_string('f051'),
    "app_slider_left":          icon_string('f137'),
    "app_slider_right":         icon_string('f138'),
    "app_align_left":           icon_string('f036'),
    "app_align_center":         icon_string('f037'),
    "app_align_right":          icon_string('f038'),
    "app_cancel":               icon_string('f057'),
    "app_zoomout":              icon_string('f010'),
    "app_zoomin":               icon_string('f00e'),
    "app_left":                 icon_string('f359'),
    "app_right":                icon_string('f35a'),
    "app_up":                   icon_string('f35b'),
    "app_down":                 icon_string('f358'),
    "app_remove":               icon_string('f00d'),
    "app_html":                 icon_string('f1c9'),
    "app_copy":                 icon_string('f0c5'),
    "app_pdf":                  icon_string('f1c1'),
    "app_link":                 icon_string('f0c1'),
    "app_print":                icon_string('f02f'),
    "app_private":              icon_string('f023'),
    "app_papersize":            icon_string('f15b'),
    "app_highlight":            '🔦',
    "app_show":                 icon_string('f06e'),
    "app_notes":                icon_string('f249'),
    "app_login":                icon_string('f2f6'),
    "app_logoff":               icon_string('f2f5'),
    "app_signup":               icon_string('f4ff'),
    "app_forgot":               icon_string('f059'),
    "app_timetable":            icon_string('f073'),
    "app_role":                 icon_string('f630'),
    "app_active":               icon_string('f205'),
    "app_inactive":             icon_string('f204'),
    "app_verification_code":    '❂❂❂❂❂❂',
    "app_sum":                  '∑',
    "app_home":                 icon_string('f015'),
    "app_type":                 icon_string('f059'),
    "app_internet":             icon_string('f0ac'),
    "app_shield":               icon_string('f132'),
    "app_browser":              icon_string('f2d2'),
    "init":                     '⭐',
    //user
    "user":                     icon_string('f007'),
    "username":                 icon_string('41') + icon_string('42') + icon_string('43'),
    "user_last_logontime":      icon_string('f2f6'),
    "user_account_created":     icon_string('f4c6'),
    "user_account_modified":    icon_string('f044'),
    "user_password":            icon_string('f084'),
    "user_delete_account":      icon_string('f2ed'),
    "user_account_reminder":    icon_string('f059'),
    "user_avatar_edit":         icon_string('f030'),
    "user_avatar":              icon_string('f2bd'),
    "user_follow_user":         icon_string('f234'),
    "user_followed_user":       icon_string('f4fc'),
    "user_like":                icon_string('f004'),
    "user_unlike":              icon_string('f7a9'),
    "user_views":               icon_string('f06e'),
    "user_follows":             icon_string('f500'),
    "user_followed":            icon_string('f0c0'),
    "user_bio":                 icon_string('f2c2') + icon_string('41') + icon_string('42') + icon_string('43'),
    "user_profile":             icon_string('f2c2'),
    "user_profile_top":         icon_string('f5a2'),
    //provider
    "provider":                 icon_string('f5ab'),
    "provider_id":              icon_string('f2c1'),
    //gps
    "gps":                      icon_string('f3c5'),
    "gps_map":                  icon_string('f279'),
    "gps_country":              icon_string('f57c'),
    "gps_city":                 icon_string('f64f'),
    "gps_popular_place":        icon_string('f005'),
    "gps_position":             icon_string('f276'),
    "gps_high_latitude":        icon_string('f0ac') + icon_string('f2dc'),
    "map_my_location":          icon_string('f601'),
    "map_fullscreen":           '⛶',
    //regional
    "regional":                 icon_string('f0ac'),
    "regional_day":             icon_string('f185'),
    "regional_month":           icon_string('f186'),
    "regional_year":            icon_string('f073'),
    "regional_weekday":         icon_string('f784'),
    "regional_locale":          icon_string('f1ab'),
    "regional_timezone":        icon_string('f0ac'),
    "regional_calendar":        icon_string('f073'),
    "regional_numbersystem":    icon_string('31') + icon_string('32') + icon_string('33'),
    "regional_direction":       icon_string('f362'),
    "regional_script":          icon_string('f70e'),
    "regional_calendartype":    icon_string('f073'),
    "regional_calendar_hijri_type":icon_string('f073'),
    "regional_timeformat":      icon_string('31') + icon_string('32') + '/' + icon_string('32') + icon_string('34'),
    //sky
    "sky_cloud":                icon_string('f0c2'),
    "sky_sunrise":              icon_string('f185') + icon_string('f30c'),
    "sky_midday":               icon_string('f185'),
    "sky_afternoon":            icon_string('f6c4'),
    "sky_sunset":               icon_string('f185') + icon_string('f309'),
    "sky_night":                icon_string('f6c3'),
    "sky_midnight":             icon_string('f6c3'),
    //misc
    "misc_design":              icon_string('f53f'),
    "misc_image":               icon_string('f03e'),
    "misc_text":                icon_string('f034'),
    "misc_text_prayer":         icon_string('f683'),
    "misc_second":              icon_string('32'),
    "misc_title":               icon_string('f1ea'),
    "misc_book":                icon_string('f02d'),
    "misc_food":                icon_string('f2e7'),
    "misc_prayer":              icon_string('f683'),
    "misc_calling":             '🗣',
    "misc_ban":                 icon_string('f05e'),
    "presentation":             `<svg height="28.5px" width="28.5px">
                                    <path d=\"M2 4h8a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h8v1h-1v11h-5.732l1.608 6H14.84l-1.607-6H9.767L8.16 22H7.124l1.608-6H3V5H2V4Zm17 11V5H4v10h15Zm-9-8h1l3 3l-3 3h-1V7Zm1 1.414v3.172L12.586 10L11 8.414Z\"
                                    stroke="black" stroke-width="2" stroke-linejoin="round"/>,
                                </svg>`,
    "infinite":                 '∞',
    //message
    "message_user":             icon_string('f2bd'),
    "message_error":            icon_string('f00d'),
    "message_error_file":       icon_string('e4eb'),
    "message_missing":          icon_string('21'),
    "message_not_found":        icon_string('3f'),
    "message_text":             icon_string('41') + icon_string('42') + icon_string('43'),
    "message_password":         icon_string('f084'),
    "message_email":            icon_string('f0e0'),
    "message_record":           icon_string('f1c0')
};
const APP_SPINNER = `<div id="common_app_spinner" class="common_load-spinner">
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
/*----------------------- */
/* MISC                   */
/*----------------------- */
const getGregorian = (HijriDate, adjustment) =>{
    let DAY = 86400000; // a day in milliseconds
    let UNIX_EPOCH_JULIAN_DATE = 2440587.5; // January 1, 1970 GMT

    //The epoch of Hijri calendar for 1 Muharram, AH 1
    //The civil and the Friday epoch will be used here
    //const hijri_epoch_julian_astronomical 	= 1948439;	//Gregorian: Thursday 15 July 622
	const hijri_epoch_julian_civil 		    = 1948440;	//Gregorian: Friday 16 July 622	

    let year =  parseInt(HijriDate[0]);
    let month = parseInt(HijriDate[1]);
    let day =   parseInt(HijriDate[2]);
    //calculate julian date
    let julian_day = Math.floor(((11*year+3)/30)+(354*year)+(30*month)-((month-1)/2)+day+hijri_epoch_julian_civil-385);
    //adjust day with +- given number of days
    julian_day = julian_day + parseInt(adjustment);
    return [new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getFullYear(),
            new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getMonth() + 1,
            new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getDate()];
}
const checkconnected = async () => {
    try {
      const testconnection = await fetch("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap", {method: "head", mode : 'no-cors'});
      return true;
    } catch (err) {
      return false;
    }
  };
let timer = 0;
//delay API calls when typing to avoid too many calls 
// ES6 spread operator, arrow function without function keyword
const typewatch = (callBack, ...parameter) =>{
    clearTimeout(timer);
    timer = setTimeout(() => {
        callBack(...parameter);
    }, 500);
};
const common_fetch_basic = async (token_type, json_data,  username, password, callBack) => {
    let url;
    let status;
    if (token_type==0){
        //data token
        url = COMMON_GLOBAL['rest_resource_service'] + '/auth' + 
              '?app_user_id=' + COMMON_GLOBAL['user_account_id'] +
              '&app_id=' + COMMON_GLOBAL['app_id'] + 
              '&lang_code=' + COMMON_GLOBAL['user_locale'];
        username = COMMON_GLOBAL['app_rest_client_id'];
        password = COMMON_GLOBAL['app_rest_client_secret'];
    }
    await fetch(url,
                {method: 'POST',
                 headers: {
                            'Authorization': 'Basic ' + window.btoa(username + ':' + password)
                          },
                 body: json_data
    })
    .then((response) => {
        status = response.status;
        return response.text();
    })
    .then((result) => {
        switch (status){
            case 200:{
                //OK
                switch (token_type){
                    case 0:{
                        //data token
                        COMMON_GLOBAL['rest_dt'] = JSON.parse(result).token_dt;
                        break;
                    }
                }
                callBack(null, result);
                break;
            }
            case 400:{
                //Bad request
                show_message('INFO', null,null, result, COMMON_GLOBAL['app_id']);
                callBack(result, null);
                break;
            }
            case 401:{
                //Unauthorized, wrong credentials
                show_message('INFO', null,null, JSON.parse(result).message, COMMON_GLOBAL['app_id']);
                callBack(result, null);
                break;
            }
            case 404:{
                //Not found
                show_message('INFO', null,null, result, COMMON_GLOBAL['app_id']);
                callBack(result, null);
                break;
            }
            case 500:{
                //Unknown error
                show_message('EXCEPTION', null,null, result, COMMON_GLOBAL['app_id']);
                callBack(result, null);
                break;
            }
        }
    })
}
const common_fetch = async (url_parameters, method, token_type, json_data, app_id_override, lang_code_override, callBack) => {
    let status;
    let headers;

    let token;
    switch (token_type){
        case 0:{
            //data token
            token = COMMON_GLOBAL['rest_dt'];
            break;
        }
        case 1:{
            //access token for users admin and superadmin
            token = COMMON_GLOBAL['rest_at'];
            break;
        }
        case 2:{
            //systemadmin token
            token = COMMON_GLOBAL['rest_admin_at'];
            break;
        }
    }
    if (json_data !='' && json_data !=null){
        headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  };
    }
    else{
        headers = {
                    'Authorization': 'Bearer ' + token
                  };
    }
    let fetch_parameters = {
                                method: method,
                                headers: headers,
                                body: json_data
                           };
    let app_id;
    if (app_id_override !=null)
        app_id = app_id_override;
    else{
        app_id = COMMON_GLOBAL['app_id'];
    }
    
    let lang_code;
    if (lang_code_override != null && lang_code_override !='')
       lang_code = lang_code_override;
    else
       lang_code = COMMON_GLOBAL['user_locale'];
    let url = url_parameters +
              '&app_id=' + app_id + 
              '&lang_code=' + lang_code;
    //for accesstoken add parameter for authorization check
    if (token_type==1)
        url = url + '&user_account_logon_user_account_id=' + COMMON_GLOBAL['user_account_id'];
    await fetch(url, 
                fetch_parameters)
    .then((response) => {
        status = response.status;
        return response.text();
    })
    .then((result) => {
        switch (status){
            case 200:{
                //OK
                callBack(null, result);
                break;
            }
            case 400:{
                //Bad request
                show_message('INFO', null,null, result, app_id);
                callBack(result, null);
                break;
            }
            case 404:{
                //Not found
                show_message('INFO', null,null, result, app_id);
                callBack(result, null);
                break;
            }
            case 401:{
                //Unauthorized, token expired
                exception(COMMON_GLOBAL['exception_app_function'], result);
                break;
            }
            case 403:{
                //Forbidden, not allowed to login or register new user
                show_message('INFO', null,null, JSON.parse(result).message, app_id);
                callBack(result, null);
                break;
            }
            case 500:{
                //Unknown error
                show_message('EXCEPTION', null,null, result, app_id);
                callBack(result, null);
                break;
            }
        }
    })
}
const toBase64 = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
}	
const fromBase64 = (str) => {
    return decodeURIComponent(escape(window.atob(str)));
}
const common_translate_ui = async (lang_code, object = null, callBack) => {
    let json;
    let object_parameter;
    let url='';
    if  (object==null)
        object_parameter ='';
    else
        object_parameter = `object=${object}`;
    if (COMMON_GLOBAL['app_id'] == COMMON_GLOBAL['common_app_id']){
        url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/app_object/admin/${lang_code}?${object_parameter}`;
    }
    else{
        url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/app_object/${lang_code}?${object_parameter}`;
    }
    //translate objects
    await common_fetch(url, 'GET', 0, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            for (let i = 0; i < json.data.length; i++){
                switch (json.data[i].object){
                    case 'APP_OBJECT_ITEM':{
                        switch(json.data[i].object_name){
                            case 'COMMON':{
                                //translate common items
                                switch  (json.data[i].object_item_name){
                                    case 'USERNAME':{
                                        document.getElementById('common_login_username').placeholder = json.data[i].text;
                                        document.getElementById('common_signup_username').placeholder = json.data[i].text;
                                        document.getElementById('common_user_edit_input_username').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'EMAIL':{
                                        document.getElementById('common_signup_email').placeholder = json.data[i].text;
                                        document.getElementById('common_forgot_email').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'NEW_EMAIL':{
                                        document.getElementById('common_user_edit_input_new_email').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'BIO':{
                                        document.getElementById('common_signup_email').placeholder = json.data[i].text;
                                        document.getElementById('common_forgot_email').placeholder = json.data[i].text;
                                        document.getElementById('common_user_edit_input_bio').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'PASSWORD':{
                                        document.getElementById('common_login_password').placeholder = json.data[i].text;
                                        document.getElementById('common_signup_password').placeholder = json.data[i].text;
                                        document.getElementById('common_user_edit_input_password').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'PASSWORD_CONFIRM':{
                                        document.getElementById('common_signup_password_confirm').placeholder = json.data[i].text;
                                        document.getElementById('common_user_edit_input_password_confirm').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'PASSWORD_REMINDER':{
                                        document.getElementById('common_signup_password_reminder').placeholder = json.data[i].text;
                                        document.getElementById('common_user_edit_input_password_reminder').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'NEW_PASSWORD_CONFIRM':{
                                        document.getElementById('common_user_edit_input_new_password_confirm').placeholder = json.data[i].text;
                                        document.getElementById('common_user_new_password_confirm').placeholder = json.data[i].text;    
                                        break;
                                    }
                                    case 'NEW_PASSWORD':{
                                        document.getElementById('common_user_edit_input_new_password').placeholder = json.data[i].text;
                                        document.getElementById('common_user_new_password').placeholder = json.data[i].text;    
                                        break;
                                    }
                                    case 'CONFIRM_QUESTION':{
                                        document.getElementById('common_confirm_question').innerHTML = json.data[i].text;
                                        break;
                                    }
                                } 
                                break;
                            }
                            case 'APP':{
                                //translate items in current app
                                if (document.getElementById(json.data[i].object_item_name.toLowerCase()))
                                    document.getElementById(json.data[i].object_item_name.toLowerCase()).innerHTML = json.data[i].text;
                                break;
                            }
                            case 'APP_LOV':{
                                //translate items in select lists in current app
                                let select_element = document.getElementById(json.data[i].object_item_name.toLowerCase());
                                for (let option_element = 0; option_element < select_element.options.length; option_element++){
                                    if (select_element.options[option_element].id == json.data[i].id)
                                        select_element.options[option_element].text = json.data[i].text
                                }
                                break;
                            }
                        }
                        break;
                    }   
                }
            }
            //translate locales
            json = '';
            if (COMMON_GLOBAL['app_id'] == COMMON_GLOBAL['common_app_id']){
                url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/language/locale/admin/${lang_code}?`;
            }
            else{
                url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/language/locale/${lang_code}?`;
            }
            common_fetch(url, 'GET', 0, null, null, null, (err, result) =>{
                if (err)
                    null;
                else{
                    json = JSON.parse(result);
                    let html='';
                    let select_locale = document.getElementById('common_user_locale_select');
                    for (let i = 0; i < json.locales.length; i++){
                        html += `<option id="${i}" value="${json.locales[i].locale}">${json.locales[i].text}</option>`;
                    }
                    select_locale.innerHTML = html;
                    select_locale.value = lang_code;
                }
                //translate regional settings
                json = '';
                if (COMMON_GLOBAL['app_id'] == COMMON_GLOBAL['common_app_id']){
                    url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/setting/admin?setting_type=DIRECTION`;
                }
                else{
                    url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/setting?setting_type=DIRECTION`;
                }
                common_fetch(url, 'GET', 0, null, null, null, (err, result) =>{
                    if (err)
                        null;
                    else{
                        json = JSON.parse(result);
                        let html='';
                        let select = document.getElementById('common_user_direction_select');
                        let current_value = select.value;
                        for (let i = 0; i < json.settings.length; i++){
                            html += `<option id="${json.settings[i].id}" value="${json.settings[i].data}">${json.settings[i].text}</option>`;
                        }
                        select.innerHTML = select.options[0].outerHTML + html;
                        select.value = current_value;
                        callBack(null,null);
                    }
                })
            })
        }

    })                            
}
const get_null_or_value = (value) => {
    if (value == null)
        return '';
    else
        return value;
}
const format_json_date = (db_date, short) => {
    if (db_date == null)
        return null;
    else {
        //Json returns UTC time
        //in ISO 8601 format
        //JSON returns format 2020-08-08T05:15:28Z
        //"yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        let options;
        if (short)
            options = {
                timeZone: COMMON_GLOBAL['user_timezone'],
                year: 'numeric',
                month: 'long'
            };
        else
            options = {
                timeZone: COMMON_GLOBAL['user_timezone'],
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
        let format_date = utc_date.toLocaleDateString(COMMON_GLOBAL['user_locale'], options);
        return format_date;
    }
}

const mobile = () =>{
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
   }
   
const parseJwt = (token) => {
    try {
      return JSON.parse(window.atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

const checkbox_value = (checkbox) => {
    if (checkbox.checked)
        return 'YES';
    else
        return 'NO';
}
const checkbox_checked = (checkbox) => {
    if (checkbox == 1)
        return 'YES';
    else
        return 'NO';
}

const image_format = (image) => {
    if (image == '' || image == null )
        return '';
    else
        return image;
            
}
const list_image_format_src = (image) => {
    if (image == '' || image == null)
        return '';
    else
        return `src='${image_format(image)}'`;
}
const recreate_img = (img_item) => {
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
const convert_image = async (image_url, image_width, image_height) => {
    //function to convert images to specified size and mime type according to parameters
    return new Promise((resolve) => {
        if (image_url=='')
            resolve('');
        else{
            let img = new Image();
            img.src = image_url;
            //update Content Security Policy with allowed domain
            //to allow any image url source, uncomment:
            //img.crossOrigin = 'Anonymous';
            img.onload = (el) => {
                let elem = document.createElement('canvas');
                elem.width = image_width;
                elem.height = image_height;
                let ctx = elem.getContext('2d');
                ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
                resolve(ctx.canvas.toDataURL(COMMON_GLOBAL['image_file_mime_type']));    
            }
        }
    })
}
const set_avatar = (avatar, item) => {
    if (avatar == null || avatar == '')
        recreate_img(item);
    else
        item.src = image_format(avatar);
}
const boolean_to_number = (boolean_value) => {
    if (boolean_value == true)
        return 1;
    else
        return 0;
}
const number_to_boolean = (number_value) => {
    if (number_value == 1)
        return true;
    else
        return false;
}
/* check if run inside an iframe*/
const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
const show_image = (item_img, item_input, image_width, image_height) => {
    let file = document.getElementById(item_input).files[0];
    let reader = new FileReader();

    const allowedExtensions = [COMMON_GLOBAL['image_file_allowed_type1'],
                               COMMON_GLOBAL['image_file_allowed_type2'],
                               COMMON_GLOBAL['image_file_allowed_type3'],
                               COMMON_GLOBAL['image_file_allowed_type4'],
                               COMMON_GLOBAL['image_file_allowed_type5']
                              ];
    const { name: fileName, size: fileSize } = file;
    const fileExtension = fileName.split(".").pop();
    if (!allowedExtensions.includes(fileExtension)){
        //File type not allowed
        show_message('ERROR', 20307, null,null, COMMON_GLOBAL['common_app_id']);
    }
    else
        if (fileSize > COMMON_GLOBAL['image_file_max_size']){
            //File size too large
            show_message('ERROR', 20308, null, null, COMMON_GLOBAL['common_app_id']);
        }
        else {
            reader.onloadend = (event) => {
                convert_image(event.target.result, image_width, image_height).then((srcEncoded)=>{
                    item_img.src = srcEncoded;
                });
            }
        }
    if (file)
        reader.readAsDataURL(file); //reads the data as a URL
    else
        item_show.src = '';
    return null;
}
const getHostname = () =>{
    return `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}`;
}
const check_input = (text, text_length=100, nodb_message=false) => {
    if (text==null || text=='')
        return true;
    else{
        try {
            let check_text = JSON.parse(JSON.stringify(text));
            if (text.includes('"') ||
                text.includes('\\')){
                //not valid text
                if (nodb_message==true)
                    show_message('INFO', null, null, COMMON_GLOBAL['icon_message_error'], COMMON_GLOBAL['app_id']);
                else
                    show_message('ERROR', 20309, null, null, COMMON_GLOBAL['common_app_id']);
                return false;
            }
        } catch (error) {
            //not valid text
            if (nodb_message==true)
                show_message('INFO', null, null, COMMON_GLOBAL['icon_message_error'], COMMON_GLOBAL['app_id']);
            else
                show_message('ERROR', 20309, null, null, COMMON_GLOBAL['common_app_id']);
            return false;
        }
        try {
            //check default max length 100 characters or parameter value
            if (text.length>text_length){
                //text too long
                if (nodb_message==true)
                    show_message('INFO', null, null, COMMON_GLOBAL['icon_message_error'], COMMON_GLOBAL['app_id']);
                else
                    show_message('ERROR', 20310, null, null, COMMON_GLOBAL['common_app_id']);
                return false;
            }
        } catch (error) {
            return false;
        }
        return true;
    }
}
const get_uservariables = () => {
    return `"user_language": "${navigator.language}",
            "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
            "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
            "user_platform": "${navigator.platform}",
            "client_latitude": "${COMMON_GLOBAL['client_latitude']}",
            "client_longitude": "${COMMON_GLOBAL['client_longitude']}",
            "client_place": "${COMMON_GLOBAL['client_place']}"`;
}
const SearchAndSetSelectedIndex = (search, select_item, colcheck) => {
    //colcheck=0 search id
    //colcheck=1 search value
    for (let i = 0; i < select_item.options.length; i++) {
        if ((colcheck==0 && select_item.options[i].id == search) ||
            (colcheck==1 && select_item.options[i].value == search)) {
            select_item.selectedIndex = i;
            return null;
        }
    }
    return null;
}
/*----------------------- */
/* MESSAGE & DIALOGUE     */
/*----------------------- */
const dialogue_close = async (dialogue) => {
    return new Promise((resolve, reject)=>{
        let animationDuration = 400;
        /*
        //add sound effect if needed
        let meepmeep = document.createElement("audio");
        meepmeep.src = '/common/audio/meepmeep.ogg';
        meepmeep.play();
        */
        //setTimeout(()=>{
            document.getElementById(dialogue).classList.add('common_dialogue_close');
            setTimeout(()=>{
                document.getElementById(dialogue).style.visibility = 'hidden';
                document.getElementById(dialogue).classList.remove('common_dialogue_close');
                resolve();
            }, animationDuration);
        //}, animationDuration);
    })
}
const show_common_dialogue = (dialogue, user_verification_type, title=null, icon=null, click_cancel_event) => {
    switch (dialogue) {
        case 'PROFILE':
            {    
                dialogue_profile_clear();
                document.getElementById('common_dialogue_profile').style.visibility = 'visible';
                break;
            }
        case 'NEW_PASSWORD':
            {    
                document.getElementById('common_user_new_password_auth').innerHTML=title;
                document.getElementById('common_user_new_password').value='';
                document.getElementById('common_user_new_password_confirm').value='';
                document.getElementById('common_dialogue_user_new_password').style.visibility = 'visible';
                break;
            }
        case 'VERIFY':
            {    
                dialogue_verify_clear();
                switch (user_verification_type){
                    case 'LOGIN':{
                        document.getElementById('common_user_verification_type').innerHTML = 1;
                        break;
                    }
                    case 'SIGNUP':{
                        document.getElementById('common_user_verification_type').innerHTML = 2;
                        break;
                    }
                    case 'FORGOT':{
                        document.getElementById('common_user_verification_type').innerHTML = 3;
                        break;
                    }
                    case 'NEW_EMAIL':{
                        document.getElementById('common_user_verification_type').innerHTML = 4;
                        break;
                    }
                }
                document.getElementById('common_user_verify_cancel').addEventListener('click', click_cancel_event);

                document.getElementById('common_user_verify_email').innerHTML = title;
                document.getElementById('common_user_verify_cancel').innerHTML = icon;
                
                document.getElementById('common_dialogue_login').style.visibility = 'hidden';
                document.getElementById('common_dialogue_signup').style.visibility = 'hidden';
                document.getElementById('common_dialogue_forgot').style.visibility = 'hidden';
                document.getElementById('common_dialogue_user_verify').style.visibility = 'visible';
                break;
            }
        case 'LOGIN':
            {
                document.getElementById('common_dialogue_login').style.visibility = 'visible';
                document.getElementById('common_dialogue_signup').style.visibility = 'hidden';
                document.getElementById('common_dialogue_forgot').style.visibility = 'hidden';
                document.getElementById('common_login_username').focus();
                break;
            }
        case 'SIGNUP':
            {
                document.getElementById('common_dialogue_login').style.visibility = 'hidden';
                document.getElementById('common_dialogue_signup').style.visibility = 'visible';
                document.getElementById('common_dialogue_forgot').style.visibility = 'hidden';
                document.getElementById('common_signup_username').focus();
                break;
            }
        case 'FORGOT':
            {
                document.getElementById('common_dialogue_login').style.visibility = 'hidden';
                document.getElementById('common_dialogue_signup').style.visibility = 'hidden';
                document.getElementById('common_dialogue_forgot').style.visibility = 'visible';
                document.getElementById('common_forgot_email').focus();
                break;
            }
    }
    return null;   
}

const show_message = (message_type, code, function_event, message_text='', data_app_id=null) => {
    let confirm_question = document.getElementById('common_confirm_question');
    let message_title = document.getElementById('common_message_title');
    let dialogue = document.getElementById('common_dialogue_message');
    let old_close = document.getElementById('common_message_close');
    let button_cancel = document.getElementById('common_message_cancel');
    const function_close = () => { document.getElementById('common_dialogue_message').style.visibility = 'hidden'};
    let show = 'inline-block';
    let hide = 'none';
    //this removes old eventlistener
    let button_close = old_close.cloneNode(true);
    old_close.parentNode.replaceChild(button_close, old_close);
    //INFO, ERROR, CONFIRM, EXCEPTION
    switch (message_type){
        case 'ERROR':{
            common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/message_translation/${code}?data_app_id=${data_app_id}`, 
                         'GET', 0, null, null, null, (err, result) =>{
                confirm_question.style.display = hide;
                button_cancel.style.display = hide;
                message_title.style.display = show;
                if(err)
                    message_title.innerHTML = err;
                else
                    message_title.innerHTML = JSON.parse(result).data.text;
                button_close.addEventListener('click', function_close, false);
                dialogue.style.visibility = 'visible';
                button_close.focus();
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
                        message_title.innerHTML= 'DB Error: ' + JSON.parse(message_text).sqlMessage;
                    else{
                        //message from Oracle, errorNum, offset
                        if (typeof JSON.parse(message_text).errorNum !== "undefined")
                            message_title.innerHTML= 'DB Error: ' + message_text;
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
const dialogue_verify_clear = () => {
    document.getElementById('common_dialogue_user_verify').style.visibility = 'hidden';
    //this removes old eventlistener
    let old_cancel = document.getElementById('common_user_verify_cancel');
    let button_cancel = old_cancel.cloneNode(true);
    old_cancel.parentNode.replaceChild(button_cancel, old_cancel);
    document.getElementById('common_user_verification_type').innerHTML='';
    document.getElementById('common_user_verify_email').innerHTML='';
    document.getElementById('common_user_verify_cancel').innerHTML='';
    document.getElementById('common_user_verify_verification_char1').value = '';
    document.getElementById('common_user_verify_verification_char2').value = '';
    document.getElementById('common_user_verify_verification_char3').value = '';
    document.getElementById('common_user_verify_verification_char4').value = '';
    document.getElementById('common_user_verify_verification_char5').value = '';
    document.getElementById('common_user_verify_verification_char6').value = '';
}
const dialogue_new_password_clear = () => {
    document.getElementById("common_dialogue_user_new_password").style.visibility = "hidden";
    document.getElementById("common_user_new_password_auth").innerHTML='';
    document.getElementById("common_user_new_password").value='';
    document.getElementById("common_user_new_password_confirm").value='';
    COMMON_GLOBAL['user_account_id'] = '';
    COMMON_GLOBAL['rest_at'] = '';
}
const dialogue_user_edit_clear = () => {
    document.getElementById('common_dialogue_user_edit').style.visibility = "hidden";
    document.getElementById('common_user_edit_avatar').style.display = 'none';
                
    //common
    document.getElementById('common_user_edit_checkbox_profile_private').checked = false;
    document.getElementById('common_user_edit_input_username').value = '';
    document.getElementById('common_user_edit_input_bio').value = '';
    //local
    document.getElementById('common_user_edit_input_email').innerHTML = '';
    document.getElementById('common_user_edit_input_new_email').value = '';
    document.getElementById('common_user_edit_input_password').value = '';
    document.getElementById('common_user_edit_input_password_confirm').value = '';
    document.getElementById('common_user_edit_input_new_password').value = '';
    document.getElementById('common_user_edit_input_new_password_confirm').value = '';
    document.getElementById('common_user_edit_input_password_reminder').value = '';
    //provider
    document.getElementById('common_user_edit_provider_id').innerHTML = '';
    document.getElementById('common_user_edit_label_provider_id_data').innerHTML = '';
    document.getElementById('common_user_edit_label_provider_name_data').innerHTML = '';
    document.getElementById('common_user_edit_label_provider_email_data').innerHTML = '';
    document.getElementById('common_user_edit_label_provider_image_url_data').innerHTML = '';
    //account info
    document.getElementById('common_user_edit_label_data_last_logontime').innerHTML = '';
    document.getElementById('common_user_edit_label_data_account_created').innerHTML = '';
    document.getElementById('common_user_edit_label_data_account_modified').innerHTML = '';
}
const dialogue_login_clear = () => {
    document.getElementById('common_dialogue_login').style.visibility = 'hidden';
    document.getElementById('common_login_username').value = '';
    document.getElementById('common_login_password').value = '';
}
const dialogue_signup_clear = () => {
    document.getElementById('common_dialogue_signup').style.visibility = 'hidden';
    document.getElementById('common_signup_username').value = '';
    document.getElementById('common_signup_email').value = '';
    document.getElementById('common_signup_password').value = '';
    document.getElementById('common_signup_password_confirm').value = '';
    document.getElementById('common_signup_password_reminder').value = '';
}
const dialogue_forgot_clear = () => {
    document.getElementById('common_forgot_email').value = '';
}
const dialogue_profile_clear = () => {
    document.getElementById('common_profile_info').style.display = 'none';
    document.getElementById('common_profile_top').style.display = 'none';
    document.getElementById('common_profile_detail').style.display = 'none';
    
    document.getElementById('common_profile_follow').children[0].style.display = 'block';
    document.getElementById('common_profile_follow').children[1].style.display = 'none';
    document.getElementById('common_profile_like').children[0].style.display = 'block';
    document.getElementById('common_profile_like').children[1].style.display = 'none';

    document.getElementById('common_profile_avatar').src = '';
    document.getElementById('common_profile_username').innerHTML = '';
    document.getElementById('common_profile_bio').innerHTML = '';
    document.getElementById('common_profile_joined_date').innerHTML = '';

    document.getElementById('common_profile_info_view_count').innerHTML = '';
    document.getElementById('common_profile_info_following_count').innerHTML = '';
    document.getElementById('common_profile_info_followers_count').innerHTML = '';
    document.getElementById('common_profile_info_likes_count').innerHTML = '';
    document.getElementById('common_profile_info_liked_count').innerHTML = '';
    
    document.getElementById('common_profile_qr').innerHTML = '';
    document.getElementById('common_profile_detail_list').innerHTML = '';
    document.getElementById('common_profile_top_list').innerHTML = '';
}
const dialogue_user_edit_remove_error = () => {
    document.getElementById('common_user_edit_input_username').classList.remove('common_input_error');

    document.getElementById('common_user_edit_input_bio').classList.remove('common_input_error');
    document.getElementById('common_user_edit_input_new_email').classList.remove('common_input_error');

    document.getElementById('common_user_edit_input_password').classList.remove('common_input_error');
    document.getElementById('common_user_edit_input_password_confirm').classList.remove('common_input_error');
    document.getElementById('common_user_edit_input_new_password').classList.remove('common_input_error');
    document.getElementById('common_user_edit_input_new_password_confirm').classList.remove('common_input_error');

    document.getElementById('common_user_edit_input_password_reminder').classList.remove('common_input_error');
}
const lov_close = () => {
    //remove all event listeners
    document.querySelectorAll('.common_list_lov_row').forEach(e => 
        e.replaceWith(e.cloneNode(true))
    );
    document.getElementById('common_dialogue_lov').style.visibility = 'hidden';
    document.getElementById('common_lov_title').innerHTML='';
    document.getElementById('common_lov_search_input').value='';
    document.getElementById('common_lov_list').innerHTML='';
    
}
const lov_show = (lov, function_event) => {
    
    document.getElementById('common_dialogue_lov').style.visibility = 'visible';
    document.getElementById('common_lov_list').innerHTML = APP_SPINNER;
    let url = '';
    let token_type = '';
    let lov_column_value='';
    switch (lov){
        case 'PARAMETER_TYPE':{
            document.getElementById('common_lov_title').innerHTML = ICONS['app_apps'] + ' ' + ICONS['app_settings']  + ' ' + ICONS['app_type'];
            lov_column_value = 'parameter_type_text';            
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/parameter_type/admin?`;
            token_type = 1;
            break;
        }
        case 'SERVER_LOG_FILES':{
            document.getElementById('common_lov_title').innerHTML = ICONS['app_server'] + ' ' + ICONS['app_file_path'];
            lov_column_value = 'filename';
            url = `${COMMON_GLOBAL['rest_resource_service']}/log/files?`;
            token_type = 2;
            break;
        }
        case 'APP_CATEGORY':{
            document.getElementById('common_lov_title').innerHTML = ICONS['app_apps'] + ' ' + ICONS['app_type'];
            lov_column_value = 'app_category_text';
            
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/app_category/admin?`;
            token_type = 1;
            break;
        }
        case 'APP_ROLE':{
            document.getElementById('common_lov_title').innerHTML = ICONS['app_role'];
            lov_column_value = 'icon';
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/app_role/admin?`;
            token_type = 1;
            break;
        }
    }
    common_fetch(url, 'GET', token_type, null, null, null, (err, result) =>{
        if (err)
            document.getElementById('common_lov_list').innerHTML = '';
        else{
            document.getElementById('common_lov_list').innerHTML = '';
            let json = JSON.parse(result);
            let html = '';
            for (let i = 0; i < json.data.length; i++) {
                html += 
                `<div id='common_list_lov_row_${i}' class='common_list_lov_row'>
                    <div class='common_list_lov_col'>
                        <div>${json.data[i].id}</div>
                    </div>
                    <div class='common_list_lov_col'>
                        <div>${json.data[i][lov_column_value]}</div>
                    </div>
                </div>`;
            }
            document.getElementById('common_lov_list').innerHTML = html;
            document.getElementById('common_lov_search_input').focus();
            document.querySelectorAll('.common_list_lov_row').forEach(e => e.addEventListener('click', function_event));
        }
    })
}
const lov_keys = (event) => {
    switch (event.code){
        case 'ArrowLeft':
        case 'ArrowRight':{
            break;
        }
        case 'ArrowUp':
        case 'ArrowDown':{
            //loop rows not hidden
            let x = document.querySelectorAll('.common_list_lov_row:not(.list_lov_row_hide)');
            for (let i = 0; i <= x.length -1; i++) {
                if (x[i].classList.contains('common_list_lov_row_selected')){
                    //if up and first or
                    //if down and last
                    if ((event.code=='ArrowUp' && i == 0)||
                        (event.code=='ArrowDown' && i == x.length -1)){
                        if(event.code=='ArrowUp'){
                            //if the first, set the last
                            x[i].classList.remove ('common_list_lov_row_selected');
                            x[x.length -1].classList.add ('common_list_lov_row_selected');
                        }
                        else{
                            //if the last, set the first
                            x[i].classList.remove ('common_list_lov_row_selected');
                            x[0].classList.add ('common_list_lov_row_selected');
                        }
                        return;
                    }
                    else{
                        if(event.code=='ArrowUp'){
                            //remove highlight, highlight previous
                            x[i].classList.remove ('common_list_lov_row_selected');
                            x[i-1].classList.add ('common_list_lov_row_selected');
                        }
                        else{
                            //down
                            //remove highlight, highlight next
                            x[i].classList.remove ('common_list_lov_row_selected');
                            x[i+1].classList.add ('common_list_lov_row_selected');
                        }
                        return;
                    }
                }
            }
            //no highlight found, highlight first
            x[0].classList.add ('common_list_lov_row_selected');
            break
        }
        case 'Enter':{
            //enter
            let x = document.querySelectorAll('.common_list_lov_row');
            for (let i = 0; i <= x.length -1; i++) {
                if (x[i].classList.contains('common_list_lov_row_selected')){
                    //event on row is set in app when calling lov, dispatch it!
                    x[i].dispatchEvent(new Event('click'))
                    x[i].classList.remove ('common_list_lov_row_selected');
                }
            }
            break
        }
        default:{
            //if db call will be implemented, add delay
            //typewatch(lov_filter, document.getElementById('common_lov_search_input').value); 
            lov_filter(document.getElementById('common_lov_search_input').value); 
            break;
        }    
    }
}
const lov_filter = (text_filter) => {
    let x = document.querySelectorAll('.common_list_lov_row');
    for (let i = 0; i <= x.length -1; i++) {
        x[i].classList.remove ('common_list_lov_row_hide');
        x[i].classList.remove ('common_list_lov_row_selected');
    }
    for (let i = 0; i <= x.length -1; i++) {
        if (x[i].children[0].children[0].innerHTML.toUpperCase().indexOf(text_filter.toUpperCase()) > -1 ||
            x[i].children[1].children[0].innerHTML.toUpperCase().indexOf(text_filter.toUpperCase()) > -1){
                x[i].classList.remove ('common_list_lov_row_hide');
            }
        else{
            x[i].classList.remove ('common_list_lov_row_hide');
            x[i].classList.add ('common_list_lov_row_hide');
        }
    }
}

/*----------------------- */
/* WINDOW INFO            */
/*----------------------- */
const zoom_info = (zoomvalue = '') => {
    let old;
    let old_scale;
    let div = document.getElementById('common_window_info_info');
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
const move_info = (move1, move2) => {
    let old;
    let div = document.getElementById('common_window_info_info');
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
const show_window_info = (info, show_toolbar, url, content_type, iframe_content) => {
    /*
    common_window_info_info     use to display image                    case 0
    common_window_info_info     use to display spinner                  case null
    common_window_info_content  url in iframe, HTML or PDF              case null
    common_window_info_content  url in iframe, use overflowY=hidden     case 1-4
    */
    let display_toolbar;
    if (show_toolbar)
        display_toolbar = 'inline-block';
    else
        display_toolbar = 'none';
    document.getElementById('common_window_info_toolbar_btn_zoomout').style.display = display_toolbar;
    document.getElementById('common_window_info_toolbar_btn_zoomin').style.display = display_toolbar;
    document.getElementById('common_window_info_toolbar_btn_left').style.display = display_toolbar;
    document.getElementById('common_window_info_toolbar_btn_right').style.display = display_toolbar;
    document.getElementById('common_window_info_toolbar_btn_up').style.display = display_toolbar;
    document.getElementById('common_window_info_toolbar_btn_down').style.display = display_toolbar;
    document.getElementById('common_window_info').style.overflowY = 'auto'
    document.getElementById('common_window_info_info').innerHTML = '';
    document.getElementById('common_window_info_info').style.display = 'none';
    document.getElementById('common_window_info_content').src='';
    zoom_info('');
    move_info(null,null);


    const show_url = (url) => {
        document.getElementById('common_window_info_content').src=url;
        document.getElementById('common_window_info').style.overflowY = 'hidden'
        document.getElementById('common_window_info').style.visibility = 'visible';
    }
    switch(info){
        case 0:{
            document.getElementById('common_window_info_info').style.display = 'inline-block';
            document.getElementById('common_window_info_info').innerHTML = `<img src='${url}'/>`;
            document.getElementById('common_window_info').style.visibility = 'visible';
            break;
        }
        case 1:{
            show_url(url);
            break;
        }    
        case 2:{
            show_url(url); 
            break;
        }    
        case 3:{
            show_url(url);
            break;
        }    
        case 4:{
            show_url(url); 
            break;
        }
        case null:{
            document.getElementById('common_window_info').style.visibility = 'visible';
            document.getElementById('common_window_info_info').innerHTML = APP_SPINNER;
            document.getElementById('common_window_info_info').style.display = 'inline-block';
            if (content_type == 'HTML'){
                document.getElementById('common_window_info_info').innerHTML = ''
                document.getElementById('common_window_info_content').src=iframe_content;
            }
            else
                if (content_type=='PDF'){
                    fetch (iframe_content,
                            {
                                headers: {
                                    'Content-Type': 'application/pdf;charset=UTF-8'
                                }
                            }
                    )
                    .then((response) => {
                        return response.blob();
                    })
                    .then((pdf) => {
                        let reader = new FileReader();
                        reader.readAsDataURL(pdf); 
                        reader.onloadend = () => {
                            let base64PDF = reader.result;
                            document.getElementById('common_window_info_info').innerHTML = '';
                            document.getElementById('common_window_info_info').style.display = 'none';
                            document.getElementById('common_window_info_content').src = base64PDF;
                        }
                    })
                }
        }
    }
}
/*----------------------- */
/* PROFILE                */
/*----------------------- */
const profile_follow_like = async (function_name) => {
    await user_function(function_name, (err, result) => {
        if (err==null){
            profile_update_stat((err, result) =>{
                null;
            })
        }
    })
}
const show_profile_click_events = (item, click_function) => {
    document.querySelectorAll(item).forEach(e => e.addEventListener('click', (event) => {
        //execute function from inparameter or use default when not specified
        let profile_id = event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML;
        if (click_function ==null){
            profile_show(profile_id,
                        null,
                        (err, result)=>{
                            null;
                        });
        }
        else{
            click_function(profile_id);
        }
    }));
}
const profile_top = (statschoice, app_rest_url = null, click_function=null) => {
    let url;
    document.getElementById('common_dialogue_profile').style.visibility = 'visible';
    document.getElementById('common_profile_info').style.display = 'none';
    document.getElementById('common_profile_top').style.display = 'block';
                
    if (statschoice ==1 || statschoice ==2 || statschoice ==3){
        /*statschoice 1,2,3: user_account*/
        url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/profile/top?`;
    }
    else{
        /*other statschoice, apps can use >3 and return same columns*/
        url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}${app_rest_url}?`;
    }
    //TOP
    common_fetch(url + statschoice + '?', 
                 'GET', 0, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            let json = JSON.parse(result);
            let profile_top_list = document.getElementById('common_profile_top_list');
            profile_top_list.innerHTML = '';
            let html ='';
            let image='';
            let name='';
            for (let i = 0; i < json.count; i++) {
                image = list_image_format_src(json.items[i].avatar ?? json.items[i].provider_image)
                name = json.items[i].username;
                html +=
                `<div class='common_profile_top_list_row'>
                    <div class='common_profile_top_list_col'>
                        <div class='common_profile_top_list_user_account_id'>${json.items[i].id}</div>
                    </div>
                    <div class='common_profile_top_list_col'>
                        <img class='common_profile_top_list_avatar' ${image}>
                    </div>
                    <div class='common_profile_top_list_col'>
                        <div class='common_profile_top_list_username'>
                            <a href='#'>${name}</a>
                        </div>
                    </div>
                    <div class='common_profile_top_list_col'>
                        <div class='common_profile_top_list_count'>${json.items[i].count}</div>
                    </div>
                </div>`;
            }
            profile_top_list.innerHTML = html;
            show_profile_click_events('.common_profile_top_list_username', click_function);
        }
    })
}
const profile_detail = (detailchoice, rest_url_app, fetch_detail, header_app, click_function) => {
    let url;
    if (detailchoice == 1 || detailchoice == 2 || detailchoice == 3 || detailchoice == 4){
        /*detailchoice 1,2,3, 4: user_account*/
        url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/profile/detail?`;
    }
    else{
        /* detailchoice 5, apps, returns same columns*/
        url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}${rest_url_app}?`;
    }
    //DETAIL
    //show only if user logged in
    if (parseInt(COMMON_GLOBAL['user_account_id']) || 0 !== 0) {
        switch (detailchoice) {
            case 0:
                {
                    //show only other app specific hide common
                    document.getElementById('common_profile_detail').style.display = 'none';
                    document.getElementById('common_profile_detail_header_following').style.display = 'none';
                    document.getElementById('common_profile_detail_header_followed').style.display = 'none';
                    document.getElementById('common_profile_detail_header_like').style.display = 'none';
                    document.getElementById('common_profile_detail_header_liked').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 1:
                {
                    //Following
                    document.getElementById('common_profile_detail').style.display = 'block';
                    document.getElementById('common_profile_detail_header_following').style.display = 'block';
                    document.getElementById('common_profile_detail_header_followed').style.display = 'none';
                    document.getElementById('common_profile_detail_header_like').style.display = 'none';
                    document.getElementById('common_profile_detail_header_liked').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 2:
                {
                    //Followed
                    document.getElementById('common_profile_detail').style.display = 'block';
                    document.getElementById('common_profile_detail_header_following').style.display = 'none';
                    document.getElementById('common_profile_detail_header_followed').style.display = 'block';
                    document.getElementById('common_profile_detail_header_like').style.display = 'none';
                    document.getElementById('common_profile_detail_header_liked').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 3:
                {
                    //Like user
                    document.getElementById('common_profile_detail').style.display = 'block';
                    document.getElementById('common_profile_detail_header_following').style.display = 'none';
                    document.getElementById('common_profile_detail_header_followed').style.display = 'none';
                    document.getElementById('common_profile_detail_header_like').style.display = 'block';
                    document.getElementById('common_profile_detail_header_liked').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 4:
                {
                    //Liked user
                    document.getElementById('common_profile_detail').style.display = 'block';
                    document.getElementById('common_profile_detail_header_following').style.display = 'none';
                    document.getElementById('common_profile_detail_header_followed').style.display = 'none';
                    document.getElementById('common_profile_detail_header_like').style.display = 'none';
                    document.getElementById('common_profile_detail_header_liked').style.display = 'block';
                    document.getElementById('common_profile_detail_header_app').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            default:
                {
                    //show app specific
                    document.getElementById('common_profile_detail').style.display = 'block';
                    document.getElementById('common_profile_detail_header_following').style.display = 'none';
                    document.getElementById('common_profile_detail_header_followed').style.display = 'none';
                    document.getElementById('common_profile_detail_header_like').style.display = 'none';
                    document.getElementById('common_profile_detail_header_liked').style.display = 'none';
                    document.getElementById('common_profile_detail_header_app').style.display = 'block';
                    document.getElementById('common_profile_detail_header_app').innerHTML = header_app;
                    break;
                }
        }
        if (fetch_detail){
            common_fetch(url + document.getElementById('common_profile_id').innerHTML +
                        '?detailchoice=' + detailchoice, 
                         'GET', 1, null, null, null, (err, result) =>{
                if (err)
                    null;
                else{
                    let json = JSON.parse(result);
                    let profile_detail_list = document.getElementById('common_profile_detail_list');
                    profile_detail_list.innerHTML = '';

                    let html = '';
                    let image = '';
                    let delete_div ='';
                    for (let i = 0; i < json.count; i++) {
                        //id for username list, app_id for app list
                        if (detailchoice==5 && typeof json.items[i].id =='undefined'){
                            if (document.getElementById('common_profile_id').innerHTML==COMMON_GLOBAL['user_account_id'])
                                delete_div = `<div class='common_profile_detail_list_app_delete'>${ICONS['app_delete']}</div>`;
                                
                            //App list in app 0
                            html += 
                            `<div class='common_profile_detail_list_row'>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_app_id'>${json.items[i].app_id}</div>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <img class='common_profile_detail_list_app_logo' src='${json.items[i].logo}'>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_app_name common_link'>
                                        ${json.items[i].app_name}
                                    </div>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    ${delete_div}
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_app_url'>${json.items[i].url}</div>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_date_created'>${json.items[i].date_created}</div>
                                </div>
                            </div>`;
                        }
                        else{
                            //Username list
                            image = list_image_format_src(json.items[i].avatar ?? json.items[i].provider_image)
                            html += 
                            `<div class='common_profile_detail_list_row'>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_user_account_id'>${json.items[i].id}</div>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <img class='common_profile_detail_list_avatar' ${image}>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_username'>
                                        <a href='#'>${json.items[i].username}</a>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                    profile_detail_list.innerHTML = html;
                    if (detailchoice==5){
                        document.querySelector('#common_profile_detail_list').addEventListener('click', (event)=>{
                            if (event.target.classList.contains('common_profile_detail_list_app_name'))
                                window.open(event.target.parentNode.parentNode.children[4].children[0].innerHTML, '_blank');
                            else
                                if (document.getElementById('common_profile_id').innerHTML==COMMON_GLOBAL['user_account_id']){
                                    if (event.target.parentNode.classList.contains('common_profile_detail_list_app_delete'))
                                        user_account_app_delete(null, 
                                                                document.getElementById('common_profile_id').innerHTML,
                                                                event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML,
                                                                () => { 
                                                                    document.getElementById('common_dialogue_message').style.visibility = 'hidden';
                                                                    user_account_app_delete(1, 
                                                                                            document.getElementById('common_profile_id').innerHTML, 
                                                                                            event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML, 
                                                                                            null);
                                                                });
                            }
                        }, false)
                    }
                    else
                        show_profile_click_events('.common_profile_detail_list_username', click_function);
                }
            })
        }
    } else
        show_common_dialogue('LOGIN');
}
const search_profile = (click_function) => {
    document.getElementById('common_profile_search_input').classList.remove('common_input_error');
    let profile_search_list = document.getElementById('common_profile_search_list');
    profile_search_list.innerHTML = '';
    document.getElementById('common_profile_search_list_wrap').style.display = 'none';
    profile_search_list.style.display = 'none';
    if (document.getElementById('common_profile_search_input').value=='')
        document.getElementById('common_profile_search_input').classList.add('common_input_error');
    else{
        let searched_username = document.getElementById('common_profile_search_input').value;
        let url;
        let token;
        let json_data;
        if (check_input(searched_username) == false)
            return;
        if (COMMON_GLOBAL['user_account_id']!=''){
            //search using access token with logged in user_account_id
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/profile/username/searchA?search=${searched_username}`;
            token = 1;
            json_data = `{
                        "user_account_id":${COMMON_GLOBAL['user_account_id']},
                        "client_latitude": "${COMMON_GLOBAL['client_latitude']}",
                        "client_longitude": "${COMMON_GLOBAL['client_longitude']}"
                        }`;
        }
        else{
            //search using data token without logged in user_account_id
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/profile/username/searchD?search=${searched_username}`;
            token = 0;
            json_data = `{
                        "client_latitude": "${COMMON_GLOBAL['client_latitude']}",
                        "client_longitude": "${COMMON_GLOBAL['client_longitude']}"
                        }`;
        }
        common_fetch(url, 'POST', token, json_data, null, null, (err, result) =>{
            if (err)
                null;
            else{
                let json = JSON.parse(result);
                if (json.count > 0){
                    profile_search_list.style.display = "inline-block";
                    document.getElementById('common_profile_search_list_wrap').style.display = 'flex';
                }
                let html = '';
                let image= '';
                let name = '';
                for (let i = 0; i < json.count; i++) {
                    image = list_image_format_src(json.items[i].avatar ?? json.items[i].provider_image)
                    name = json.items[i].username;
                    html +=
                    `<div class='common_profile_search_list_row'>
                        <div class='common_profile_search_list_col'>
                            <div class='common_profile_search_list_user_account_id'>${json.items[i].id}</div>
                        </div>
                        <div class='common_profile_search_list_col'>
                            <img class='common_profile_search_list_avatar' ${image}>
                        </div>
                        <div class='common_profile_search_list_col'>
                            <div class='common_profile_search_list_username'>
                                <a href='#'>${name}</a>
                            </div>
                        </div>
                    </div>`;
                }
                profile_search_list.innerHTML = html;
                show_profile_click_events('.common_profile_search_list_username', click_function);
            }
        })
    }
}
/*
profile_show(null, null)     from dropdown menu in apps or choosing logged in users profile
profile_show(userid, null) 	 from choosing profile in profile_top
profile_show(userid, null) 	 from choosing profile in profile_detail
profile_show(userid, null) 	 from choosing profile in search_profile
profile_show(null, username) from init startup when user enters url
*/
const profile_show = async (user_account_id_other = null, username = null, callBack) => {
    let json;
    let user_account_id_search;
    let url;

    show_common_dialogue('PROFILE');
    if (user_account_id_other == null && COMMON_GLOBAL['user_account_id'] == '' && username == null) {
        return callBack(null,null);
    } else {
        if (user_account_id_other !== null) {
            user_account_id_search = user_account_id_other;
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/profile/id/${user_account_id_search}?id=${COMMON_GLOBAL['user_account_id']}`;
        } else
        if (username !== null) {
            user_account_id_search = '';
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/profile/username?search=${username}&id=${COMMON_GLOBAL['user_account_id']}`;
        } else {
            user_account_id_search = COMMON_GLOBAL['user_account_id'];
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/profile/id/${user_account_id_search}?id=${COMMON_GLOBAL['user_account_id']}`;
        }
        //PROFILE MAIN
        let json_data =
            `{
            "client_latitude": "${COMMON_GLOBAL['client_latitude']}",
            "client_longitude": "${COMMON_GLOBAL['client_longitude']}"
            }`;

        common_fetch(url, 'POST', 0, json_data, null, null, (err, result) =>{
            if (err)
                return callBack(err,null);
            else{
                json = JSON.parse(result);
                document.getElementById('common_profile_info').style.display = "block";
                document.getElementById('common_profile_main').style.display = "block";
                document.getElementById('common_profile_id').innerHTML = json.id;
                set_avatar(json.avatar ?? json.provider_image, document.getElementById('common_profile_avatar')); 
                //show local username
                document.getElementById('common_profile_username').innerHTML = json.username;

                document.getElementById('common_profile_bio').innerHTML = get_null_or_value(json.bio);
                document.getElementById('common_profile_joined_date').innerHTML = format_json_date(json.date_created, true);
                document.getElementById("common_profile_qr").innerHTML = '';
                create_qr('common_profile_qr', getHostname() + '/' + json.username);
                //User account followed and liked
                if (json.followed == 1) {
                    //followed
                    document.getElementById('common_profile_follow').children[0].style.display = 'none';
                    document.getElementById('common_profile_follow').children[1].style.display = 'block';
                } else {
                    //not followed
                    document.getElementById('common_profile_follow').children[0].style.display = 'block';
                    document.getElementById('common_profile_follow').children[1].style.display = 'none';
                }
                if (json.liked == 1) {
                    //liked
                    document.getElementById('common_profile_like').children[0].style.display = 'none';
                    document.getElementById('common_profile_like').children[1].style.display = 'block';
                } else {
                    //not liked
                    document.getElementById('common_profile_like').children[0].style.display = 'block';
                    document.getElementById('common_profile_like').children[1].style.display = 'none';
                } 
                //if private then hide info, sql decides if private, no need to check here if same user
                if (json.private==1) {
                    //private
                    document.getElementById('common_profile_public').style.display = "none";
                    document.getElementById('common_profile_private').style.display = "block";
                } else {
                    //public
                    document.getElementById('common_profile_public').style.display = "block";
                    document.getElementById('common_profile_private').style.display = "none";
                    document.getElementById('common_profile_info_view_count').innerHTML = json.count_views;
                    document.getElementById('common_profile_info_following_count').innerHTML = json.count_following;
                    document.getElementById('common_profile_info_followers_count').innerHTML = json.count_followed;
                    document.getElementById('common_profile_info_likes_count').innerHTML = json.count_likes;
                    document.getElementById('common_profile_info_liked_count').innerHTML = json.count_liked;
                }    
                if (COMMON_GLOBAL['user_account_id'] =='')
                    setTimeout(()=> {show_common_dialogue('LOGIN')}, 2000);
                else
                    checkOnline('common_profile_avatar_online_status', json.id);
                return callBack(null,{profile_id: json.id,
                                      private: json.private});   
            }
        })
    }
}
const profile_close = () => {
    document.getElementById('common_dialogue_profile').style.visibility = 'hidden';
    dialogue_profile_clear();
}
const profile_update_stat = async (callBack) => {
    let profile_id = document.getElementById('common_profile_id');
    let json_data =
    `{
        "client_latitude": "${COMMON_GLOBAL['client_latitude']}",
        "client_longitude": "${COMMON_GLOBAL['client_longitude']}"
    }`;
    //get updated stat for given user
    //to avoid update in stat set searched by same user
    let url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/profile/id/${profile_id.innerHTML}`;
    
    common_fetch(url + '?id=' + profile_id.innerHTML, 
                 'POST', 0, json_data, null, null, (err, result) =>{
        if (err)
            return callBack(err,null);
        else{
            let json = JSON.parse(result);
            document.getElementById('common_profile_info_view_count').innerHTML = json.count_views;
            document.getElementById('common_profile_info_following_count').innerHTML = json.count_following;
            document.getElementById('common_profile_info_followers_count').innerHTML = json.count_followed;
            document.getElementById('common_profile_info_likes_count').innerHTML = json.count_likes;
            document.getElementById('common_profile_info_liked_count').innerHTML = json.count_liked;
            return callBack(null, {id : json.id})
        }
    })
}
const search_input = (event, event_function) => {
    switch (event.code){
        case 'ArrowLeft':
        case 'ArrowRight':{
            break;
        }
        case 'ArrowUp':
        case 'ArrowDown':{
            if (document.getElementById('common_profile_search_list').style.display=='inline-block'){
                let x = document.querySelectorAll('.common_profile_search_list_row');
                for (let i = 0; i <= x.length -1; i++) {
                    if (x[i].classList.contains('common_profile_search_list_selected'))
                        //if up and first or
                        //if down and last
                        if ((event.code=='ArrowUp' && i == 0)||
                            (event.code=='ArrowDown' && i == x.length -1)){
                            if(event.code=='ArrowUp'){
                                //if the first, set the last
                                x[i].classList.remove ('common_profile_search_list_selected');
                                x[x.length -1].classList.add ('common_profile_search_list_selected');
                            }
                            else{
                                //down
                                //if the last, set the first
                                x[i].classList.remove ('common_profile_search_list_selected');
                                x[0].classList.add ('common_profile_search_list_selected');
                            }
                            return;
                        }
                        else{
                            if(event.code=='ArrowUp'){
                                //remove highlight, highlight previous
                                x[i].classList.remove ('common_profile_search_list_selected');
                                x[i-1].classList.add ('common_profile_search_list_selected');
                            }
                            else{
                                //down
                                //remove highlight, highlight next
                                x[i].classList.remove ('common_profile_search_list_selected');
                                x[i+1].classList.add ('common_profile_search_list_selected');
                            }
                            return;
                        }
                }
                //no highlight found, highlight first
                x[0].classList.add ('common_profile_search_list_selected');
                return;
            }
            break
        }
        case 'Enter':{
            //enter
            if (document.getElementById('common_profile_search_list').style.display=='inline-block'){
                let x = document.querySelectorAll('.common_profile_search_list_row');
                for (let i = 0; i <= x.length -1; i++) {
                    if (x[i].classList.contains('common_profile_search_list_selected')){
                        /*Show profile and leave searchresult so user can go back to searchresult again*/
                        if (event_function ==null){
                            profile_show(x[i].children[0].children[0].innerHTML,
                                         null,
                                        (err, result)=>{
                                            null;
                                        });
                        }
                        else{
                            event_function(x[i].children[0].children[0].innerHTML);
                        }
                            
                        x[i].classList.remove ('common_profile_search_list_selected');
                    }
                }
                return;
            }
            break
        }
        default:{
            typewatch(search_profile, event_function==null?null:event_function); 
            break;
        }            
    }
}
/*----------------------- */
/* USER                   */
/*----------------------- */
const user_login = async (username, password, callBack) => {
    
    let json;
    let json_data;

    if (check_input(username) == false || check_input(password)== false)
        return callBack('ERROR', null);

    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, COMMON_GLOBAL['common_app_id']);
        return callBack('ERROR', null);
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, COMMON_GLOBAL['common_app_id']);
        return callBack('ERROR', null);
    }

    json_data = `{
                    "app_id": ${COMMON_GLOBAL['app_id']},
                    "username":"${username}",
                    "password":"${password}",
                    ${get_uservariables()}
                 }`;

    //get user with username and password from REST API
    common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/login?`, 
                 'PUT', 0, json_data, null, null, (err, result) =>{
        if (err)
            return callBack(err, null);
        else{
            profile_close();
            json = JSON.parse(result);
            COMMON_GLOBAL['user_account_id'] = json.items[0].id;
            COMMON_GLOBAL['user_identity_provider_id'] = '';
            COMMON_GLOBAL['rest_at']	= json.accessToken;
            updateOnlineStatus();
            user_preference_get((err, results) =>{
                if (json.items[0].active==0){
                    const function_cancel_event = () => { dialogue_verify_clear();
                                                          exception(COMMON_GLOBAL['exception_app_function'], null);
                                                        };
                    show_common_dialogue('VERIFY', 'LOGIN', json.items[0].email, ICONS['app_logoff'], function_cancel_event);
                    return callBack('ERROR', null);
                }
                else{
                    dialogue_login_clear();
                    dialogue_signup_clear();
                    return callBack(null, {user_id: json.items[0].id,
                        username: json.items[0].username,
                        bio: json.items[0].bio,
                        avatar: json.items[0].avatar,
                        app: json.app})
                }
            })
        }
    })    
}
const user_logoff = async () => {
    //remove access token
    COMMON_GLOBAL['rest_at'] ='';
    COMMON_GLOBAL['user_account_id'] = '';
    
    set_avatar(null, document.getElementById('common_user_menu_avatar_img')); 
    //clear logged in info
    document.getElementById('common_user_menu_username').innerHTML = '';
    document.getElementById('common_user_menu_username').style.display = 'none';
    document.getElementById('common_user_menu_logged_in').style.display = 'none';
    document.getElementById('common_user_menu_logged_out').style.display = 'inline-block';
    document.getElementById('common_user_menu_dropdown_logged_in').style.display = 'none';
    document.getElementById('common_user_menu_dropdown_logged_out').style.display = 'inline-block';

    updateOnlineStatus();
    document.getElementById('common_profile_avatar_online_status').className='';
    //get new data token to avoid endless loop och invalid token
    await common_fetch_basic(0, null,  null, null,  (err, result)=>{
        dialogue_user_edit_clear();
        dialogue_verify_clear();
        dialogue_new_password_clear();
        dialogue_login_clear();
        dialogue_signup_clear();
        dialogue_forgot_clear();
        document.getElementById('common_dialogue_profile').style.visibility = 'hidden';
        dialogue_profile_clear();
        user_preferences_set_default_globals('LOCALE');
        user_preferences_set_default_globals('TIMEZONE');
        user_preferences_set_default_globals('DIRECTION');
        user_preferences_set_default_globals('ARABIC_SCRIPT');
        user_preferences_update_select();
    })
}
const user_edit = async () => {
    let json;
    //get user from REST API
    common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/${COMMON_GLOBAL['user_account_id']}?`, 
                 'GET', 1, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            if (COMMON_GLOBAL['user_account_id'] == json.id) {
                document.getElementById('common_user_edit_local').style.display = 'none';
                document.getElementById('common_user_edit_provider').style.display = 'none';
                document.getElementById('common_dialogue_user_edit').style.visibility = "visible";

                document.getElementById('common_user_edit_checkbox_profile_private').checked = number_to_boolean(json.private);
                document.getElementById('common_user_edit_input_username').value = json.username;
                document.getElementById('common_user_edit_input_bio').value = get_null_or_value(json.bio);

                if (json.provider_id == null) {
                    document.getElementById('common_user_edit_local').style.display = 'block';
                    document.getElementById('common_user_edit_provider').style.display = 'none';

                    //display fetched avatar editable
                    document.getElementById('common_user_edit_avatar').style.display = 'block';
                    set_avatar(json.avatar, document.getElementById('common_user_edit_avatar_img')); 
                    document.getElementById('common_user_edit_input_email').innerHTML = json.email;
                    document.getElementById('common_user_edit_input_new_email').value = json.email_unverified;
                    document.getElementById('common_user_edit_input_password').value = '',
                        document.getElementById('common_user_edit_input_password_confirm').value = '',
                        document.getElementById('common_user_edit_input_new_password').value = '';
                    document.getElementById('common_user_edit_input_new_password_confirm').value = '';

                    document.getElementById('common_user_edit_input_password_reminder').value = json.password_reminder;
                } else{
                        document.getElementById('common_user_edit_local').style.display = 'none';
                        document.getElementById('common_user_edit_provider').style.display = 'block';
                        document.getElementById('common_user_edit_provider_id').innerHTML = json.identity_provider_id;
                        document.getElementById('common_user_edit_label_provider_id_data').innerHTML = json.provider_id;
                        document.getElementById('common_user_edit_label_provider_name_data').innerHTML = json.provider_first_name + ' ' + json.provider_last_name;
                        document.getElementById('common_user_edit_label_provider_email_data').innerHTML = json.provider_email;
                        document.getElementById('common_user_edit_label_provider_image_url_data').innerHTML = json.provider_image_url;
                        document.getElementById('common_user_edit_avatar').style.display = 'none';
                        set_avatar(json.provider_image, document.getElementById('common_user_edit_avatar_img')); 
                    } 
                document.getElementById('common_user_edit_label_data_last_logontime').innerHTML = format_json_date(json.last_logontime, null);
                document.getElementById('common_user_edit_label_data_account_created').innerHTML = format_json_date(json.date_created, null);
                document.getElementById('common_user_edit_label_data_account_modified').innerHTML = format_json_date(json.date_modified, null);
                set_avatar(json.avatar ?? json.provider_image, document.getElementById('common_user_menu_avatar_img'));
            } else {
                //User not found
                show_message('ERROR', 20305, null, null, COMMON_GLOBAL['common_app_id']);
            }
        }
    })
}
const user_update = async () => {
    let username = document.getElementById('common_user_edit_input_username').value;
    let bio = document.getElementById('common_user_edit_input_bio').value;
    let avatar = document.getElementById('common_user_edit_avatar_img').src;
    let new_email = document.getElementById('common_user_edit_input_new_email').value;

    let url;
    let json_data;

    if (check_input(bio, 150) == false)
        return null;
        
    if (document.getElementById('common_user_edit_local').style.display == 'block') {
        let email = document.getElementById('common_user_edit_input_email').innerHTML;    
        let password = document.getElementById('common_user_edit_input_password').value;
        let password_confirm = document.getElementById('common_user_edit_input_password_confirm').value;
        let new_password = document.getElementById('common_user_edit_input_new_password').value;
        let new_password_confirm = document.getElementById('common_user_edit_input_new_password_confirm').value;
        let password_reminder = document.getElementById('common_user_edit_input_password_reminder').value;
        if (check_input(username) == false ||
            check_input(new_email) == false ||
            check_input(password) == false ||
            check_input(password_confirm) == false ||
            check_input(new_password) == false ||
            check_input(new_password_confirm) == false ||
            check_input(password_reminder) == false)
            return null;

        dialogue_user_edit_remove_error();
    
        //validate input
        if (username == '') {
            //"Please enter username"
            document.getElementById('common_user_edit_input_username').classList.add('common_input_error');
            show_message('ERROR', 20303, null, null);
            return null;
        }
        if (password == '') {
            //"Please enter password"
            document.getElementById('common_user_edit_input_password').classList.add('common_input_error');
            show_message('ERROR', 20304, null, null, COMMON_GLOBAL['common_app_id']);
            return null;
        }
        if (password != password_confirm) {
            //Password not the same
            document.getElementById('common_user_edit_input_password_confirm').classList.add('common_input_error');
            show_message('ERROR', 20301, null, null, COMMON_GLOBAL['common_app_id']);
            return null;
        }
        //check new passwords
        if (new_password != new_password_confirm) {
            //New Password are entered but they are not the same
            document.getElementById('common_user_edit_input_new_password').classList.add('common_input_error');
            document.getElementById('common_user_edit_input_new_password_confirm').classList.add('common_input_error');
            show_message('ERROR', 20301, null, null);
            return null;
        }
        json_data = `{ 
                        "username":"${username}",
                        "bio":"${bio}",
                        "private": ${boolean_to_number(document.getElementById('common_user_edit_checkbox_profile_private').checked)},
                        "password":"${password}",
                        "new_password":"${new_password}",
                        "password_reminder":"${password_reminder}",
                        "email":"${email}",
                        "new_email":${new_email==''?null:'"' + new_email + '"'},
                        "avatar":"${avatar}",
                        ${get_uservariables()}
                    }`;
        url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/${COMMON_GLOBAL['user_account_id']}`;
    } else {
        json_data = `{"provider_id": "${document.getElementById('common_user_edit_provider_id').innerHTML}",
                      "username":"${username}",
                      "bio":"${bio}",
                      "private":${boolean_to_number(document.getElementById('common_user_edit_checkbox_profile_private').checked)}
                     }`;
        url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/common/${COMMON_GLOBAL['user_account_id']}`;
    }
    let old_button = document.getElementById('common_user_edit_btn_user_update').innerHTML;
    let json;
    document.getElementById('common_user_edit_btn_user_update').innerHTML = APP_SPINNER;
    //update user using REST API
    common_fetch(url + '?', 
                 'PUT', 1, json_data, null, null, (err, result) =>{
        document.getElementById('common_user_edit_btn_user_update').innerHTML = old_button;
        if (err){    
            return null;
        }
        else{
            json = JSON.parse(result);
            set_avatar(avatar, document.getElementById('common_user_menu_avatar_img'));
            document.getElementById('common_user_menu_username').innerHTML = username;
            if (json.sent_change_email == 1){
                const function_cancel_event = () => { document.getElementById('common_dialogue_user_verify').style.visibility='hidden';};
                show_common_dialogue('VERIFY', 'NEW_EMAIL', new_email, ICONS['app_cancel'], function_cancel_event);
            }
            else
                dialogue_user_edit_clear();
            return null;
        }
    })
}
const user_signup = () => {
    let username = document.getElementById('common_signup_username').value;
    let email = document.getElementById('common_signup_email').value;
    let password = document.getElementById('common_signup_password').value;
    let password_confirm = document.getElementById('common_signup_password_confirm').value;
    let password_reminder = document.getElementById('common_signup_password_reminder').value;

    if (check_input(username) == false || 
        check_input(email)== false ||
        check_input(password)== false ||
        check_input(password_confirm)== false ||
        check_input(password_reminder)== false)
        return null;

    let json_data = `{
                        "username":"${username}",
                        "password":"${password}",
                        "password_reminder":"${password_reminder}",
                        "email":"${email}",
                        "active":0 ,
                        ${get_uservariables()}
                     }`;
    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, COMMON_GLOBAL['common_app_id']);
        return null;
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, COMMON_GLOBAL['common_app_id']);
        return null;
    }
    if (password != password_confirm) {
        //Password not the same
        show_message('ERROR', 20301, null, null, COMMON_GLOBAL['common_app_id']);
        return null;
    }

    let old_button = document.getElementById('common_signup_button').innerHTML;
    document.getElementById('common_signup_button').innerHTML = APP_SPINNER;
    common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/signup?`,
                 'POST', 0, json_data, null, null, (err, result) =>{    
        document.getElementById('common_signup_button').innerHTML = old_button;
        if (err){    
            null;
        }
        else{
            let json = JSON.parse(result);
            COMMON_GLOBAL['rest_at'] = json.accessToken;
            COMMON_GLOBAL['user_account_id'] = json.id;
            const function_cancel_event = () => { dialogue_verify_clear();
                                                  exception(COMMON_GLOBAL['exception_app_function'], null);
                                                };
            show_common_dialogue('VERIFY', 'SIGNUP', email, ICONS['app_logoff'], function_cancel_event);
        }
    })
}
const user_verify_check_input = async (item, nextField, callBack) => {

    let json;
    let json_data;
    let verification_type = parseInt(document.getElementById('common_user_verification_type').innerHTML);
    //only accept 0-9
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(document.getElementById(item.id).value) > -1)
        if (nextField == '' || (document.getElementById('common_user_verify_verification_char1').value != '' &
                document.getElementById('common_user_verify_verification_char2').value != '' &
                document.getElementById('common_user_verify_verification_char3').value != '' &
                document.getElementById('common_user_verify_verification_char4').value != '' &
                document.getElementById('common_user_verify_verification_char5').value != '' &
                document.getElementById('common_user_verify_verification_char6').value != '')) {
            //last field, validate entered code
            let verification_code = parseInt(document.getElementById('common_user_verify_verification_char1').value +
                document.getElementById('common_user_verify_verification_char2').value +
                document.getElementById('common_user_verify_verification_char3').value +
                document.getElementById('common_user_verify_verification_char4').value +
                document.getElementById('common_user_verify_verification_char5').value +
                document.getElementById('common_user_verify_verification_char6').value);
            let old_button = document.getElementById('common_user_verify_email').innerHTML;
            document.getElementById('common_user_verify_email').innerHTML = APP_SPINNER;
            document.getElementById('common_user_verify_verification_char1').classList.remove('common_input_error');
            document.getElementById('common_user_verify_verification_char2').classList.remove('common_input_error');
            document.getElementById('common_user_verify_verification_char3').classList.remove('common_input_error');
            document.getElementById('common_user_verify_verification_char4').classList.remove('common_input_error');
            document.getElementById('common_user_verify_verification_char5').classList.remove('common_input_error');
            document.getElementById('common_user_verify_verification_char6').classList.remove('common_input_error');

            //activate user
            json_data = `{"verification_code":${verification_code},
                          "verification_type": ${verification_type},
                          ${get_uservariables()}
                         }`;
            common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/activate/${COMMON_GLOBAL['user_account_id']}?`, 
                         'PUT', 0, json_data, null, null, (err, result) =>{    
                document.getElementById('common_user_verify_email').innerHTML = old_button;
                if (err){    
                    return callBack(err, null);
                }
                else{
                    json = JSON.parse(result);
                    if (json.items[0].affectedRows == 1) {
                        switch (verification_type){
                            case 1:{
                                //LOGIN
                                break;
                            }
                            case 2:{
                                //SIGNUP
                                //login with username and password from signup fields
                                document.getElementById('common_login_username').value =
                                    document.getElementById('common_signup_username').value;
                                document.getElementById('common_login_password').value =
                                    document.getElementById('common_signup_password').value;
                                break;
                            }
                            case 3:{
                                //FORGOT
                                COMMON_GLOBAL['rest_at']	= json.accessToken;
                                //show dialogue new password
                                show_common_dialogue('NEW_PASSWORD', null, json.auth);
                                break;
                            }
                            case 4:{
                                //NEW EMAIL
                                break;
                            }
                        }
                        
                        document.getElementById('common_dialogue_login').style.visibility = "hidden";
                        
                        dialogue_signup_clear();
                        dialogue_forgot_clear();
                        dialogue_verify_clear();
                        dialogue_user_edit_clear();
                        return callBack(null, {"actived": 1, 
                                                "verification_type" : verification_type});

                        } else {
                            document.getElementById('common_user_verify_verification_char1').classList.add('common_input_error');
                            document.getElementById('common_user_verify_verification_char2').classList.add('common_input_error');
                            document.getElementById('common_user_verify_verification_char3').classList.add('common_input_error');
                            document.getElementById('common_user_verify_verification_char4').classList.add('common_input_error');
                            document.getElementById('common_user_verify_verification_char5').classList.add('common_input_error');
                            document.getElementById('common_user_verify_verification_char6').classList.add('common_input_error');
                            //code not valid
                            show_message('ERROR', 20306, null, null, COMMON_GLOBAL['common_app_id']);
                            return callBack('ERROR', null);
                        }
                }
            })
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
const user_delete = async (choice=null, user_local, function_delete_event, callBack ) => {
    let password = document.getElementById('common_user_edit_input_password').value;
    switch (choice){
        case null:{
            if (user_local==true && password == '') {
                //"Please enter password"
                document.getElementById('common_user_edit_input_password').classList.add('common_input_error');
                show_message('ERROR', 20304, null, null, COMMON_GLOBAL['common_app_id']);
                return null;
            }
            show_message('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL['app_id']);
            return callBack('CONFIRM',null);
            break;
        }
        case 1:{
            document.getElementById('common_dialogue_message').style.visibility = "hidden";
            dialogue_user_edit_remove_error();
    
            let old_button = document.getElementById('common_user_edit_btn_user_delete_account').innerHTML;
            document.getElementById('common_user_edit_btn_user_delete_account').innerHTML = APP_SPINNER;
            let json_data = `{"password":"${password}"}`;

            common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/${COMMON_GLOBAL['user_account_id']}?`, 
                         'DELETE', 1, json_data, null, null, (err, result) =>{    
                document.getElementById('common_user_edit_btn_user_delete_account').innerHTML = old_button;
                if (err){
                    return callBack(err,null);
                }
                else{
                    return callBack(null,{deleted: 1});
                }
            })
            break;
        }
        default:
            break;
    }
}
const user_function = (user_function, callBack) => {
    let user_id_profile = document.getElementById('common_profile_id').innerHTML;
    let json_data;
    let method;
    let rest_path;
    let check_div;
    switch (user_function) {
        case 'FOLLOW':
            {
                rest_path = '/user_account/follow';
                json_data = '{"user_account_id":' + user_id_profile + '}';
                check_div = document.getElementById('common_profile_follow');
                break;
            }
        case 'LIKE':
            {
                rest_path = '/user_account/like';
                json_data = '{"user_account_id":' + user_id_profile + '}';
                check_div = document.getElementById('common_profile_like');
                break;
            }
    }

    if (COMMON_GLOBAL['user_account_id'] == '')
        show_common_dialogue('LOGIN');
    else {
        if (check_div.children[0].style.display == 'block') {
            method = 'POST';
        } else {
            method = 'DELETE';
        }
        common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}${rest_path}/${COMMON_GLOBAL['user_account_id']}?`, 
                         method, 1, json_data, null, null, (err, result) =>{    
            if (err)
                return callBack(err, null);
            else{
                let json = JSON.parse(result);
                switch (user_function) {
                    case 'FOLLOW':
                        {
                            if (document.getElementById('common_profile_follow').children[0].style.display == 'block'){
                                //follow
                                document.getElementById('common_profile_follow').children[0].style.display = 'none';
                                document.getElementById('common_profile_follow').children[1].style.display = 'block';
                            }
                            else{
                                //unfollow
                                document.getElementById('common_profile_follow').children[0].style.display = 'block';
                                document.getElementById('common_profile_follow').children[1].style.display = 'none';
                            }
                            break;
                        }
                    case 'LIKE':
                        {
                            if (document.getElementById('common_profile_like').children[0].style.display == 'block'){
                                //like
                                document.getElementById('common_profile_like').children[0].style.display = 'none';
                                document.getElementById('common_profile_like').children[1].style.display = 'block';
                            }
                            else{
                                //unlike
                                document.getElementById('common_profile_like').children[0].style.display = 'block';
                                document.getElementById('common_profile_like').children[1].style.display = 'none';
                            }
                            break;
                        }
                }
                return callBack(null, {});
            }
        })
    }
}
const user_account_app_delete = (choice=null, user_account_id, app_id, function_delete_event) => {
    switch (choice){
        case null:{
            show_message('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL['app_id']);
            break;
        }
        case 1:{
            document.getElementById('common_dialogue_message').style.visibility = "hidden";
            common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account_app/${user_account_id}/${app_id}?`, 
                         'DELETE', 1, null, null, null, (err, result) =>{    
                if (err)
                    null;
                else{
                    //execute event and refresh app list
                    document.getElementById('common_profile_main_btn_cloud').click()
                }
            })
            break;
        }
        default:
            break;
    }
}
const user_forgot = async () => {
    let email = document.getElementById('common_forgot_email').value;
    let json_data = `{
                        "email": "${email}",
                        ${get_uservariables()}
                     }`;
    if (check_input(email) == false || email =='')
        return;
    else{
        let old_button = document.getElementById('common_forgot_button').innerHTML;
        document.getElementById('common_forgot_button').innerHTML = APP_SPINNER;
        common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/forgot?`,
                     'PUT', 0, json_data, null, null, (err, result) =>{
            document.getElementById('common_forgot_button').innerHTML = old_button;
            if (err)
                null;
            else{
                let json = JSON.parse(result);
                if (json.sent == 1){
                    COMMON_GLOBAL['user_account_id'] = json.id;
                    const function_cancel_event = () => { document.getElementById('common_dialogue_user_verify').style.visibility='hidden';};
                    show_common_dialogue('VERIFY', 'FORGOT', email, ICONS['app_cancel'], function_cancel_event);
                }
            }
        })
    }
}
const updatePassword = () => {
    let new_password = document.getElementById('common_user_new_password').value;
    let new_password_confirm = document.getElementById('common_user_new_password_confirm').value;
    let user_new_password_auth = document.getElementById('common_user_new_password_auth').innerHTML;
    let json_data = `{
                        "new_password" : "${new_password}",
                        "auth" : "${user_new_password_auth}",
                        ${get_uservariables()}
                     }`;
    if (check_input(new_password) == false ||
        check_input(new_password_confirm) == false)
        return;
    else{
        if (new_password == '') {
            //"Please enter password"
            document.getElementById('common_user_new_password').classList.add('common_input_error');
            show_message('ERROR', 20304, null, null, COMMON_GLOBAL['common_app_id']);
            return callBack('ERROR', null);
        }
        if (new_password != new_password_confirm) {
            //Password not the same
            show_message('ERROR', 20301, null, null, COMMON_GLOBAL['common_app_id']);
            return null;
        }
        let old_button = document.getElementById('common_user_new_password_icon').innerHTML;
        document.getElementById('common_user_new_password_icon').innerHTML = APP_SPINNER;

        common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/password/${COMMON_GLOBAL['user_account_id']}?`,
                     'PUT', 1, json_data, null, null, (err, result) =>{
            document.getElementById('common_user_new_password_icon').innerHTML = old_button;
            if (err)
                null;
            else{
                dialogue_new_password_clear();
                show_common_dialogue('LOGIN');
            }
        })
    }
}
const user_preference_save = async () => {
    if (COMMON_GLOBAL['user_preference_save']==true && COMMON_GLOBAL['user_account_id'] != ''){
        let json_data =
        `{
        "preference_locale": "${document.getElementById('common_user_locale_select').value}",
        "setting_preference_timezone_id": "${document.getElementById('common_user_timezone_select').options[document.getElementById('common_user_timezone_select').selectedIndex].id}",
        "setting_preference_direction_id": "${document.getElementById('common_user_direction_select').options[document.getElementById('common_user_direction_select').selectedIndex].id}",
        "setting_preference_arabic_script_id": "${document.getElementById('common_user_arabic_script_select').options[document.getElementById('common_user_arabic_script_select').selectedIndex].id}"
        }`;

        await common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account_app/${COMMON_GLOBAL['user_account_id']}?`, 
                    'PATCH', 1, json_data, null, null, (err, result) =>{
            if (err)
                null;
            else{
                null;
            }
        })
    }
    
}
const user_preference_get = async (callBack) => {
    await common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account_app/${COMMON_GLOBAL['user_account_id']}?`, 
                 'GET', 1, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            let json = JSON.parse(result);
            //locale
            if (json.items[0].preference_locale==null){
                user_preferences_set_default_globals('LOCALE');
            }
            else{
                COMMON_GLOBAL['user_locale'] = json.items[0].preference_locale
            }
            //timezone
            if (json.items[0].setting_preference_timezone_id==null){
                user_preferences_set_default_globals('TIMEZONE');
            }
            else{
                SearchAndSetSelectedIndex(json.items[0].setting_preference_timezone_id, document.getElementById('common_user_timezone_select'), 0);
                COMMON_GLOBAL['user_timezone'] = document.getElementById('common_user_timezone_select').value;
            }
            //direction
            SearchAndSetSelectedIndex(json.items[0].setting_preference_direction_id, document.getElementById('common_user_direction_select'), 0);
            COMMON_GLOBAL['user_direction'] = document.getElementById('common_user_direction_select').value;
            //arabic script
            SearchAndSetSelectedIndex(json.items[0].setting_preference_arabic_script_id, document.getElementById('common_user_arabic_script_select'), 0);
            COMMON_GLOBAL['user_arabic_script'] = document.getElementById('common_user_arabic_script_select').value;
            user_preferences_update_select();
            return callBack(null, null)
        }
    })
}
const user_preferences_set_default_globals = (preference) => {
    switch (preference){
        case 'LOCALE':{
            COMMON_GLOBAL['user_locale']         = navigator.language.toLowerCase();
            break;
        }
        case 'TIMEZONE':{
            COMMON_GLOBAL['user_timezone']       = Intl.DateTimeFormat().resolvedOptions().timeZone;
            break;
        }
        case 'DIRECTION':{
            COMMON_GLOBAL['user_direction']      = ''; // ltr, rtl, initial, inherit
            break;
        }
        case 'ARABIC_SCRIPT':{
            COMMON_GLOBAL['user_arabic_script']  = ''; /*classes 
                                                                font_arabic_sans (default)
                                                                font_arabic_kufi
                                                                font_arabic_nashk
                                                                font_arabic_nastaliq
                                                            */
            break;
        }
    }
}
const user_preferences_update_select = () => {
    SearchAndSetSelectedIndex(COMMON_GLOBAL['user_locale'], document.getElementById('common_user_locale_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL['user_timezone'], document.getElementById('common_user_timezone_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL['user_direction'], document.getElementById('common_user_direction_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL['user_arabic_script'], document.getElementById('common_user_arabic_script_select'), 1);

    //don't save changes now, just execute other code
    //or it would save preferences 4 times
    COMMON_GLOBAL['user_preference_save'] = false;
    document.getElementById('common_user_locale_select').dispatchEvent(new Event('change'))
	document.getElementById('common_user_timezone_select').dispatchEvent(new Event('change'))
	document.getElementById('common_user_direction_select').dispatchEvent(new Event('change'))
	document.getElementById('common_user_arabic_script_select').dispatchEvent(new Event('change'))
    COMMON_GLOBAL['user_preference_save'] = true;
}
/*----------------------- */
/* USER PROVIDER          */
/*----------------------- */
const Providers_init = async (function_event) => {
    let div = document.getElementById('identity_provider_login');
    let json;
    div.innerHTML = APP_SPINNER;
    common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/identity_provider?`, 
                 'GET', 0, null, null, null, (err, result) =>{
        if (err)
            div.innerHTML = '';
        else{
            div.innerHTML = '';
            json = JSON.parse(result);
            //load the buttons
            //user provider should use REST API on server if used
            let html = '';
            for (let i=0;i <=json.items.length-1;i++){
                html += `<button id='login_provider_${i}' class='common_login_button common_login_provider_button' >
                            <div class='common_login_provider_id'>${json.items[i].id}</div>
                            <div class='common_login_provider_name'>${json.items[i].provider_name}</div>
                         </button>`;
                
            }
            div.innerHTML = html;
            document.querySelectorAll('.common_login_provider_button').forEach(e => e.addEventListener('click', function_event));
        }
    })
}
const ProviderUser_update = async (identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, callBack) => {
    convert_image(profile_image_url, 
                  COMMON_GLOBAL['image_avatar_width'],
                  COMMON_GLOBAL['image_avatar_height']).then((profile_image)=>{
        let json;
        let json_data =
        `{
        "app_id": ${COMMON_GLOBAL['app_id']},
        "active": 1,
        "identity_provider_id": ${identity_provider_id},
        "provider_id":"${profile_id}",
        "provider_first_name":"${profile_first_name}",
        "provider_last_name":"${profile_last_name}",
        "provider_image":"${window.btoa(profile_image)}",
        "provider_image_url":"${profile_image_url}",
        "provider_email":"${profile_email}",
        ${get_uservariables()}
        }`;
        common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account/provider/${profile_id}?`, 
                    'PUT', 0, json_data, null, null, (err, result) =>{
            if (err)
                return callBack(err, null);
            else{
                json = JSON.parse(result);
                COMMON_GLOBAL['rest_at'] = json.accessToken;
                COMMON_GLOBAL['user_account_id'] = json.items[0].id;
                COMMON_GLOBAL['user_identity_provider_id'] = json.items[0].identity_provider_id;
                updateOnlineStatus();
                user_preference_get((err, results) =>{
                    dialogue_login_clear();
                    dialogue_signup_clear();
                    return callBack(null, {user_account_id: json.items[0].id,
                                            username: json.items[0].username,
                                            bio: json.items[0].bio,
                                            avatar: profile_image,
                                            first_name: profile_first_name,
                                            last_name: profile_last_name,
                                            userCreated: json.userCreated});
                });
            }
        })
    })
}
const ProviderSignIn = async (provider_button, callBack) => {
    //add REST API to get user provider data
    return callBack(null, { identity_provider_id: provider_button.children[0].innerHTML,
                            profile_id: provider_button.children[0].innerHTML,
                            profile_first_name: `PROVIDER_USERNAME${provider_button.children[0].innerHTML}`,
                            profile_last_name: `PROVIDER LAST_NAME${provider_button.children[0].innerHTML}`,
                            profile_image_url: '',
                            profile_email: `PROVIDER_EMAIL${provider_button.children[0].innerHTML}@${location.hostname}`});
    
}
/*----------------------- */
/* MODULE EASY.QRCODE     */
/*----------------------- */
const create_qr = (div, url) => {
    import(COMMON_GLOBAL['module_easy.qrcode_path']).then(({QRCode})=>{
        let qrcode = new QRCode(document.getElementById(div), {
            text: url,
            width: COMMON_GLOBAL['module_easy.qrcode_width'],
            height: COMMON_GLOBAL['module_easy.qrcode_height'],
            colorDark: COMMON_GLOBAL['module_easy.qrcode_color_dark'],
            colorLight: COMMON_GLOBAL['module_easy.qrcode_color_light'],
            logo: COMMON_GLOBAL['module_easy.qrcode_logo_file_path'],
            logoWidth: COMMON_GLOBAL['module_easy.qrcode_logo_width'],
            logoHeight: COMMON_GLOBAL['module_easy.qrcode_logo_height'],
            logoBackgroundColor: COMMON_GLOBAL['module_easy.qrcode_background_color'],
            logoBackgroundTransparent: false,
            drawer: 'svg'
        });
    })
    
}
/*----------------------- */
/* MODULE LEAFLET         */
/*----------------------- */
const map_init = async (containervalue, stylevalue, longitude, latitude, map_marker_div_gps, zoomvalue) => {
    return await new Promise((resolve)=>{
        if (checkconnected()) {
            import(COMMON_GLOBAL['module_leaflet_path']).then(({L})=>{
                //save library in variable for optimization
                COMMON_GLOBAL['module_leaflet_library'] = L;
                COMMON_GLOBAL['module_leaflet_session_map'] = '';
                COMMON_GLOBAL['module_leaflet_session_map'] = COMMON_GLOBAL['module_leaflet_library'].map(containervalue).setView([latitude, longitude], zoomvalue);
                map_setstyle(stylevalue).then(()=>{
                    //disable doubleclick in event dblclick since e.preventdefault() does not work
                    COMMON_GLOBAL['module_leaflet_session_map'].doubleClickZoom.disable(); 
        
                    //add fullscreen button and my location button with eventlisteners
                    let mapcontrol = document.querySelectorAll(`#${containervalue} .leaflet-control`)
                    mapcontrol[0].innerHTML += `<a id='common_leaflet_fullscreen_id' href="#" title="Full Screen" role="button"></a>`;
                    document.getElementById('common_leaflet_fullscreen_id').innerHTML= ICONS['map_fullscreen'];
                    if (COMMON_GLOBAL['client_latitude']!='' && COMMON_GLOBAL['client_longitude']!=''){
                        mapcontrol[0].innerHTML += `<a id='common_leaflet_my_location_id' href="#" title="My location" role="button"></a>`;
                        document.getElementById('common_leaflet_my_location_id').innerHTML= ICONS['map_my_location'];
                    }
                    //add events to the buttons
                    document.getElementById('common_leaflet_fullscreen_id').addEventListener('click', 
                                            () => { 
                                                    if (document.fullscreenElement)
                                                        document.exitFullscreen();
                                                    else
                                                        document.getElementById(containervalue).requestFullscreen();
                                                    }, 
                                            false);
                    if (COMMON_GLOBAL['client_latitude']!='' && COMMON_GLOBAL['client_longitude']!='')
                        document.getElementById('common_leaflet_my_location_id').addEventListener('click', 
                                                () => { 
                                                        map_update(COMMON_GLOBAL['client_longitude'],
                                                                COMMON_GLOBAL['client_latitude'],
                                                                zoomvalue,
                                                                COMMON_GLOBAL['client_place'],
                                                                null,
                                                                map_marker_div_gps,
                                                                COMMON_GLOBAL['module_leaflet_jumpto']);
                                                        }, 
                                                false);
                    resolve();
                })
            })
        }
        else
            resolve();
    })
    
}
const map_resize = async () => {
    if (checkconnected()) {
        //fixes not rendering correct showing map div
        COMMON_GLOBAL['module_leaflet_session_map'].invalidateSize();
    }
}
const map_line_removeall = () => {
    if(COMMON_GLOBAL['module_leaflet_session_map_layer'])
        for (let i=0;i<COMMON_GLOBAL['module_leaflet_session_map_layer'].length;i++)
            COMMON_GLOBAL['module_leaflet_session_map'].removeLayer(COMMON_GLOBAL['module_leaflet_session_map_layer'][i]);
            COMMON_GLOBAL['module_leaflet_session_map_layer']=[];
}
const map_line_create = (id, title, text_size, from_longitude, from_latitude, to_longitude, to_latitude, color, width, opacity) => {
    if (checkconnected()) {
        let geojsonFeature = {
            "id": `"${id}"`,
            "type": "Feature",
            "properties": { "title": title },
            "geometry": {
                "type": "LineString",
                    "coordinates": [
                        [from_longitude, from_latitude],
                        [to_longitude, to_latitude]
                    ]
            }
        };
        //use GeoJSON to draw a line
        let myStyle = {
            "color": color,
            "weight": width,
            "opacity": opacity
        };
        let layer = COMMON_GLOBAL['module_leaflet_library'].geoJSON(geojsonFeature, {style: myStyle}).addTo(COMMON_GLOBAL['module_leaflet_session_map']);
        if(!COMMON_GLOBAL['module_leaflet_session_map_layer'])
            COMMON_GLOBAL['module_leaflet_session_map_layer']=[];
            COMMON_GLOBAL['module_leaflet_session_map_layer'].push(layer);
    }
}
const map_setevent = (event, function_event) => {
    if (checkconnected()) {
        //also creates event:
        //COMMON_GLOBAL['module_leaflet_library'].DomEvent.addListener(COMMON_GLOBAL['module_leaflet_session_map'], 'dblclick', function_event);
        COMMON_GLOBAL['module_leaflet_session_map'].on(event, function_event);
    }
}
const map_setstyle = async (mapstyle) => {
    return await new Promise ((resolve, reject) => {
        if (checkconnected()) {
            if(COMMON_GLOBAL['module_leaflet_session_map_OpenStreetMap_Mapnik'])
                COMMON_GLOBAL['module_leaflet_session_map'].removeLayer(COMMON_GLOBAL['module_leaflet_session_map_OpenStreetMap_Mapnik']);
            if (COMMON_GLOBAL['module_leaflet_session_map_Esri_WorldImagery'])
                COMMON_GLOBAL['module_leaflet_session_map'].removeLayer(COMMON_GLOBAL['module_leaflet_session_map_Esri_WorldImagery']);
            switch (mapstyle){
                case 'OpenStreetMap_Mapnik':{
                    COMMON_GLOBAL['module_leaflet_session_map_OpenStreetMap_Mapnik'] = 
                        COMMON_GLOBAL['module_leaflet_library'].tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            maxZoom: 19,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        }).addTo(COMMON_GLOBAL['module_leaflet_session_map']);
                    break;
                }
                case 'Esri.WorldImagery':{
                    COMMON_GLOBAL['module_leaflet_session_map_Esri_WorldImagery'] = 
                        COMMON_GLOBAL['module_leaflet_library'].tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        }).addTo(COMMON_GLOBAL['module_leaflet_session_map']);
                    break;
                }
            }
            resolve();
        }  
        else
            resolve();
    })
}
const map_update_popup = (title) => {
    document.getElementById('common_module_leaflet_popup_title').innerHTML = title;
}
const map_update = async (longitude, latitude, zoom, text_place, timezone_text = null, marker_id, to_method) => {
    return new Promise((resolve)=> {
        if (checkconnected()) {
            const map_update_gps = (to_method, zoomvalue, longitude, latitude) => {
                switch (to_method){
                    case 0:{
                        if (zoomvalue == '')
                            COMMON_GLOBAL['module_leaflet_session_map'].setView(new COMMON_GLOBAL['module_leaflet_library'].LatLng(latitude, longitude));
                        else
                            COMMON_GLOBAL['module_leaflet_session_map'].setView(new COMMON_GLOBAL['module_leaflet_library'].LatLng(latitude, longitude), zoomvalue);
                        break;
                    }
                    case 1:{
                        COMMON_GLOBAL['module_leaflet_session_map'].flyTo([latitude, longitude], zoomvalue)
                        break;
                    }
                    //also have COMMON_GLOBAL['module_leaflet_session_map'].panTo(new COMMON_GLOBAL['module_leaflet_library'].LatLng({lng: longitude, lat: latitude}));
                }
            }
            const map_update_text = (timezone_text) => {
                let popuptext = `<div id="common_module_leaflet_popup_title">${text_place}</div>
                                 <div id="common_module_leaflet_popup_sub_title">${ICONS['regional_timezone'] + ICONS['gps_position']}</div>
                                 <div id="common_module_leaflet_popup_sub_title_timezone">${timezone_text}</div>`;
                let popup = COMMON_GLOBAL['module_leaflet_library'].popup({ offset: [0, COMMON_GLOBAL['module_leaflet_popup_offset']], closeOnClick: false })
                            .setLatLng([latitude, longitude])
                            .setContent(popuptext)
                            .openOn(COMMON_GLOBAL['module_leaflet_session_map']);
                let marker = COMMON_GLOBAL['module_leaflet_library'].marker([latitude, longitude]).addTo(COMMON_GLOBAL['module_leaflet_session_map']);
                //setting id so apps can customize if necessary
                marker._icon.id = marker_id;
                resolve(timezone_text);
            }
            map_update_gps(to_method, zoom, longitude, latitude);
            if (timezone_text == null)
                tzlookup(latitude, longitude).then((tzlookup_text)=>{
                    map_update_text(tzlookup_text);
                })
            else{
                map_update_text(timezone_text);
            }
        }
    })
}
/*----------------------- */
/* SERVICE BROADCAST      */
/*----------------------- */
const broadcast_init = (close_eventsource) => {
    //broadcast
    document.getElementById('common_broadcast_close').innerHTML = ICONS['app_broadcast_close'];
    document.getElementById('common_broadcast_info_title').innerHTML = ICONS['app_alert'];
    if (close_eventsource==true){
        COMMON_GLOBAL['service_broadcast_eventsource'].close();
        connectOnline();
    }
    else{
        connectOnline();
    }
}
const maintenance_countdown = (remaining) => {
    if(remaining <= 0)
        location.reload(true);
    document.getElementById('common_maintenance_countdown').innerHTML = remaining;
    setTimeout(()=>{ maintenance_countdown(remaining - 1); }, 1000);
};
const show_broadcast = (broadcast_message) => {
    broadcast_message = window.atob(broadcast_message);
    let broadcast_type = JSON.parse(broadcast_message).broadcast_type;
    let message = JSON.parse(broadcast_message).broadcast_message;
    if (broadcast_type=='MAINTENANCE'){
        if (COMMON_GLOBAL['user_account_id'] !='' && COMMON_GLOBAL['user_account_id'] !=null)
            exception(COMMON_GLOBAL['exception_app_function'], null);
        document.getElementById('common_maintenance_message').innerHTML = ICONS['app_maintenance'];
        show_maintenance(message);
    }
    else
        if (broadcast_type=='INFO' || broadcast_type=='CHAT'){
            show_broadcast_info(message);
        }
}
const show_broadcast_info = (message) => {
    const hide_function = () => { document.getElementById('common_broadcast_info').style.visibility='hidden';
                                document.getElementById('common_broadcast_close').removeEventListener('click', hide_function);
                                document.getElementById('common_broadcast_info_message_item').innerHTML='';
                                document.getElementById('common_broadcast_info_message').style.animationName='unset';};
    document.getElementById('common_broadcast_info_message').style.animationName='common_ticker';
    document.getElementById('common_broadcast_close').addEventListener('click', hide_function);
    document.getElementById('common_broadcast_info_message_item').innerHTML = message;
    document.getElementById('common_broadcast_info').style.visibility='visible';
}
const show_maintenance = (message, init) => {
    let countdown_timer = 60;

    if (init==1){
        document.getElementById('common_dialogue_maintenance').style.visibility='visible';
        maintenance_countdown(countdown_timer);
    }
    else
        if (document.getElementById('common_maintenance_countdown').innerHTML=='') {
            //hide all divs except broadcast and maintenance
            let divs = document.body.getElementsByTagName('div');
            for (let i = 0; i < divs.length; i += 1) {
                if (divs[i].id.indexOf('common_broadcast') !=0 &&
                    divs[i].id.indexOf('common_dialogue_maintenance') !=0 &&
                    divs[i].id.indexOf('common_maintenance') !=0)
                    divs[i].style.visibility ='hidden';
            }
            let maintenance_divs = document.getElementById('common_dialogue_maintenance').getElementsByTagName('div');
            for (let i = 0; i < maintenance_divs.length; i += 1) {
                maintenance_divs[i].style.visibility ='visible';
            }
            document.getElementById('common_dialogue_maintenance').style.visibility='visible';
            maintenance_countdown(countdown_timer);
            document.getElementById('common_maintenance_footer').innerHTML = message;
        }
        else
            if (message!='')
                document.getElementById('common_maintenance_footer').innerHTML = message;
}
const reconnect = () => {
    setTimeout(connectOnline, 5000);
}
const updateOnlineStatus = () => {
    let token_type='';
    let url='';
    if (COMMON_GLOBAL['system_admin']==1){
        url =   `${COMMON_GLOBAL['rest_resource_service']}/broadcast/connection/SystemAdmin`+ 
                `?client_id=${COMMON_GLOBAL['service_broadcast_client_ID']}`+
                `&user_account_id=${COMMON_GLOBAL['user_account_id']}` + 
                `&identity_provider_id=${COMMON_GLOBAL['user_identity_provider_id']}` +
                `&system_admin=${COMMON_GLOBAL['system_admin']}`
        token_type=2;
    }
    else{
        url =   `${COMMON_GLOBAL['rest_resource_service']}/broadcast/connection`+ 
                `?client_id=${COMMON_GLOBAL['service_broadcast_client_ID']}`+
                `&user_account_id=${COMMON_GLOBAL['user_account_id']}` + 
                `&identity_provider_id=${COMMON_GLOBAL['user_identity_provider_id']}` +
                `&system_admin=${COMMON_GLOBAL['system_admin']}`
        token_type=0;
    }
    common_fetch(url, 'PATCH', token_type, null, null, null, (err, result) =>{
        null;
    })
}
const connectOnline = (updateOnline=false) => {
    COMMON_GLOBAL['service_broadcast_client_ID'] = Date.now();
    COMMON_GLOBAL['service_broadcast_eventsource'] = new EventSource(`${COMMON_GLOBAL['rest_resource_service']}/broadcast/connection/${COMMON_GLOBAL['service_broadcast_client_ID']}` +
                                                `?app_id=${COMMON_GLOBAL['app_id']}` +
                                                `&user_account_id=${COMMON_GLOBAL['user_account_id']}` +
                                                `&identity_provider_id=${COMMON_GLOBAL['user_identity_provider_id']}` +
                                                `&system_admin=${COMMON_GLOBAL['system_admin']}`);
    COMMON_GLOBAL['service_broadcast_eventsource'].onmessage = (event) => {
        
            show_broadcast(event.data);
    }
    COMMON_GLOBAL['service_broadcast_eventsource'].onerror = (err) => {
        COMMON_GLOBAL['service_broadcast_eventsource'].close();
        reconnect();
    }
}
const checkOnline = (div_icon_online, user_account_id) => {
    common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/broadcast/connection/check/${user_account_id}?`, 
                 'GET', 0, null, null, null, (err, result) =>{
        if (JSON.parse(result).online == 1)
            document.getElementById(div_icon_online).className = 'online';
        else
            document.getElementById(div_icon_online).className= 'offline';
    })
}
/*----------------------- */
/* SERVICE GEOLOCATION    */
/*----------------------- */
const get_place_from_gps = async (longitude, latitude) => {
    return await new Promise((resolve)=>{
        let url;
        let tokentype;
        if (COMMON_GLOBAL['system_admin']==1){
            url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/place/systemadmin?longitude=${longitude}&latitude=${latitude}`;
            tokentype = 2;
        }
        else 
            if (COMMON_GLOBAL['app_id']==COMMON_GLOBAL['common_app_id']){
                url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/place/admin?app_user_id=${COMMON_GLOBAL['user_account_id']}` + 
                      `&longitude=${longitude}&latitude=${latitude}`;
                tokentype = 1;
            }
            else{
                url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/place?app_user_id=${COMMON_GLOBAL['user_account_id']}` +
                      `&longitude=${longitude}&latitude=${latitude}`;
                tokentype = 0;
            }
        common_fetch(url, 'GET', tokentype, null, null, null, (err, result) =>{
            if (err)
                resolve('');
            else{
                let json = JSON.parse(result);
                if (json.geoplugin_place=='' && json.geoplugin_region =='' && json.geoplugin_countryCode =='')
                    resolve('');
                else
                    resolve(json.geoplugin_place + ', ' +
                            json.geoplugin_region + ', ' +
                            json.geoplugin_countryCode);
            }
        })
    })
}
const get_gps_from_ip = async () => {

    let url;
    let tokentype;
    if (COMMON_GLOBAL['system_admin']==1){
        url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/ip/systemadmin?`;
        tokentype = 2;
    }
    else
        if (COMMON_GLOBAL['app_id']==COMMON_GLOBAL['common_app_id']){
            url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/ip/admin?app_user_id=${COMMON_GLOBAL['user_account_id']}`;
            tokentype = 1;
        }
        else{
            url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/ip?app_user_id=${COMMON_GLOBAL['user_account_id']}`;
            tokentype = 0;
        }
    await common_fetch(url, 'GET', tokentype, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            let json = JSON.parse(result);
            COMMON_GLOBAL['client_latitude']  = json.geoplugin_latitude;
            COMMON_GLOBAL['client_longitude'] = json.geoplugin_longitude;
            if (json.geoplugin_city=='' && json.geoplugin_regionName =='' && json.geoplugin_countryName =='')
                COMMON_GLOBAL['client_place'] = '';
            else
                COMMON_GLOBAL['client_place'] = json.geoplugin_city + ', ' +
                                                       json.geoplugin_regionName + ', ' +
                                                       json.geoplugin_countryName;
        }
    })
}
const tzlookup = async (latitude, longitude) => {
    return new Promise((resolve, reject)=>{
        let url;
        let tokentype;
        if (COMMON_GLOBAL['system_admin']==1){
            url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/timezone/systemadmin?latitude=${latitude}&longitude=${longitude}`;
            tokentype = 2;
        }
        else
            if (COMMON_GLOBAL['app_id']==COMMON_GLOBAL['common_app_id']){
                url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/timezone/admin?latitude=${latitude}&longitude=${longitude}`;
                tokentype = 1;
            }
            else{
                url = `${COMMON_GLOBAL['rest_resource_service']}/geolocation/timezone?latitude=${latitude}&longitude=${longitude}`;
                tokentype = 0;
            }
        common_fetch(url, 'GET', tokentype, null, null, null, (err, text_timezone) =>{
            resolve (text_timezone);
        })
    })
}
/*----------------------- */
/* SERVICE WORLDCITIES    */
/*----------------------- */
const get_cities = async (countrycode, callBack) => {
    await common_fetch(`${COMMON_GLOBAL['rest_resource_service']}/worldcities/${countrycode}?app_user_id=${COMMON_GLOBAL['user_account_id']}`, 
                       'GET', 0, null, null, null, (err, result) =>{
        if (err)
            callBack(err, null);
        else{
            let json = JSON.parse(result);
            json.sort((a, b) => {
                let x = a.admin_name.toLowerCase() + a.city.toLowerCase();
                let y = b.admin_name.toLowerCase() + b.city.toLowerCase();
                if (x < y) {
                    return -1;
                }
                if (x > y) {
                    return 1;
                }
                return 0;
            });

            let current_admin_name;
            //fill list with cities
            let cities='';
            for (let i = 0; i < json.length; i++) {
                if (i == 0) {
                    cities += `<option value='' id='' label='…' selected='selected'>…</option>
                                <optgroup label='${json[i].admin_name}'>`;
                    current_admin_name = json[i].admin_name;
                } else
                if (json[i].admin_name != current_admin_name) {
                    cities += `</optgroup>
                                <optgroup label='${json[i].admin_name}'>`;
                    current_admin_name = json[i].admin_name;
                }
                cities +=
                `<option 
                    id=${json[i].id} 
                    value=${i + 1}
                    countrycode=${json[i].iso2}
                    country='${json[i].country}'
                    admin_name='${json[i].admin_name}'
                    latitude=${json[i].lat}
                    longitude=${json[i].lng}  
                    >${json[i].city}
                </option>`;
            }
            callBack(null, `${cities} </optgroup>`);
        }
    })
}
/*----------------------- */
/* EXCEPTION              */
/*----------------------- */
const exception = (app_exception_function, error) => {
    //app_exception_function should be with namespace for example like 
    //"app.app_exception" or "report.report_exception"
    let fnparams = [error];
    let namespace = app_exception_function.substring(0,app_exception_function.indexOf('.'));
    let function_name = app_exception_function.substring(app_exception_function.indexOf('.') + 1);
    let fn = window[namespace][function_name];
    if (typeof fn === "function") 
        fn.apply(null, fnparams);
}
/*----------------------- */
/* INIT                   */
/*----------------------- */
const set_globals = (parameters) => {
    //app info
    COMMON_GLOBAL['common_app_id']= parseInt(parameters.common_app_id);
    COMMON_GLOBAL['app_id'] = parameters.app_id;
    COMMON_GLOBAL['app_name'] = parameters.app_name;
    COMMON_GLOBAL['app_url'] = parameters.app_url;
    COMMON_GLOBAL['app_logo'] = parameters.app_logo;

    //app exception function
    COMMON_GLOBAL['exception_app_function'] = parameters.exception_app_function;

    //rest 
    COMMON_GLOBAL['rest_resource_service'] = parameters.rest_resource_service;
    COMMON_GLOBAL['rest_resource_service_db_schema'] = parameters.rest_resource_service_db_schema;

    //client credentials
    COMMON_GLOBAL['app_rest_client_id'] = parameters.app_rest_client_id;
    COMMON_GLOBAL['app_rest_client_secret'] = parameters.app_rest_client_secret;
    //set users app role
    COMMON_GLOBAL['user_app_role_id'] = parameters.app_role_id;
    //system admin
    COMMON_GLOBAL['system_admin'] = parameters.system_admin;
    COMMON_GLOBAL['system_admin_only'] = parameters.system_admin_only;

    //user info
    COMMON_GLOBAL['user_identity_provider_id']='';
    COMMON_GLOBAL['user_account_id'] = '';
    COMMON_GLOBAL['client_latitude'] = parameters.gps_lat;
    COMMON_GLOBAL['client_longitude'] = parameters.gps_long;
    COMMON_GLOBAL['client_place'] = parameters.gps_place;

    
    if (parameters.system_admin==0){
        user_preferences_set_default_globals('LOCALE');
        user_preferences_set_default_globals('TIMEZONE');
        user_preferences_set_default_globals('DIRECTION');
        user_preferences_set_default_globals('ARABIC_SCRIPT');
    }
    if (parameters.ui==true){
        COMMON_GLOBAL['user_locale']         = navigator.language.toLowerCase();
        COMMON_GLOBAL['user_timezone']       = Intl.DateTimeFormat().resolvedOptions().timeZone;
        COMMON_GLOBAL['user_direction']      = '';
        COMMON_GLOBAL['user_arabic_script']  = '';
    }   
}
const assign_icons = () => {
    //dialogue user verify
    document.getElementById('common_user_verify_email_icon').innerHTML = ICONS['app_email'];
    //dialogue login
    document.getElementById('common_login_tab1').innerHTML = ICONS['app_login'];
    document.getElementById('common_login_tab2').innerHTML = ICONS['app_signup'];
    document.getElementById('common_login_tab3').innerHTML = ICONS['app_forgot'];
    document.getElementById('common_login_button').innerHTML = ICONS['app_login'];
    document.getElementById('common_login_close').innerHTML = ICONS['app_close'];
    //dialogue signup
    document.getElementById('common_signup_tab1').innerHTML = ICONS['app_login'];
    document.getElementById('common_signup_tab2').innerHTML = ICONS['app_signup'];
    document.getElementById('common_signup_tab3').innerHTML = ICONS['app_forgot'];
    document.getElementById('common_signup_button').innerHTML = ICONS['app_signup'];
    document.getElementById('common_signup_close').innerHTML = ICONS['app_close'];
    //dialogue forgot
    document.getElementById('common_forgot_tab1').innerHTML = ICONS['app_login'];
    document.getElementById('common_forgot_tab2').innerHTML = ICONS['app_signup'];
    document.getElementById('common_forgot_tab3').innerHTML = ICONS['app_forgot'];
    document.getElementById('common_forgot_button').innerHTML = ICONS['app_sendmail'];
    document.getElementById('common_forgot_close').innerHTML = ICONS['app_close'];
    //dialogue new password
    document.getElementById('common_user_new_password_icon').innerHTML = ICONS['user_password'];
    document.getElementById('common_user_new_password_cancel').innerHTML = ICONS['app_cancel'];
    document.getElementById('common_user_new_password_ok').innerHTML = ICONS['app_close'];
    //dialogue user edit
    document.getElementById('common_user_edit_btn_avatar_img').innerHTML = ICONS['user_avatar_edit'];
    document.getElementById('common_user_edit_private').innerHTML = ICONS['app_private'];
    document.getElementById('common_user_edit_btn_user_update').innerHTML = ICONS['app_update'];
    document.getElementById('common_user_edit_btn_user_delete_account').innerHTML = ICONS['user_delete_account'];
    document.getElementById('common_user_edit_close').innerHTML = ICONS['app_close'];
    document.getElementById('common_user_edit_label_provider').innerHTML = ICONS['provider'];
    document.getElementById('common_user_edit_label_provider_id').innerHTML = ICONS['provider_id'];
    document.getElementById('common_user_edit_label_provider_email').innerHTML = ICONS['app_email'];
    document.getElementById('common_user_edit_input_username_icon').innerHTML = ICONS['user'];
    document.getElementById('common_user_edit_input_bio_icon').innerHTML = ICONS['user_profile'];
    document.getElementById('common_user_edit_input_email_icon').innerHTML = ICONS['app_email'];
    document.getElementById('common_user_edit_input_new_email_icon').innerHTML = ICONS['app_email'];
    document.getElementById('common_user_edit_input_password_icon').innerHTML = ICONS['user_password'];
    document.getElementById('common_user_edit_input_password_confirm_icon').innerHTML = ICONS['user_password'];
    document.getElementById('common_user_edit_input_new_password_icon').innerHTML = ICONS['user_password'];
    document.getElementById('common_user_edit_input_new_password_confirm_icon').innerHTML = ICONS['user_password'];
    document.getElementById('common_user_edit_input_password_reminder_icon').innerHTML = ICONS['user_account_reminder'];
    document.getElementById('common_user_edit_label_last_logontime').innerHTML = ICONS['user_last_logontime'];
    document.getElementById('common_user_edit_label_account_created').innerHTML = ICONS['user_account_created'];
    document.getElementById('common_user_edit_label_account_modified').innerHTML = ICONS['user_account_modified'];
    //dialogue message
    document.getElementById('common_message_cancel').innerHTML = ICONS['app_cancel'];
    document.getElementById('common_message_close').innerHTML = ICONS['app_close'];
    //dialog lov
    document.getElementById('common_lov_search_icon').innerHTML = ICONS['app_search'];
    //profile detail
    document.getElementById('common_profile_detail_header_following').innerHTML = ICONS['user_follows'];
    document.getElementById('common_profile_detail_header_followed').innerHTML = ICONS['user_followed'];
    document.getElementById('common_profile_detail_header_like').innerHTML = ICONS['user_like'];
    document.getElementById('common_profile_detail_header_liked_heart').innerHTML = ICONS['user_like'];
    document.getElementById('common_profile_detail_header_liked_users').innerHTML =  ICONS['user_followed'];
    //profile info search
    document.getElementById('common_profile_search_icon').innerHTML = ICONS['app_search'];
    //profile info
    document.getElementById('common_profile_joined_date_icon').innerHTML = ICONS['user_account_created'];
    document.getElementById('common_profile_follow_follow').innerHTML = ICONS['user_follow_user'];
    document.getElementById('common_profile_follow_followed').innerHTML = ICONS['user_followed_user'];
    document.getElementById('common_profile_like_like').innerHTML = ICONS['user_like'];
    document.getElementById('common_profile_like_unlike').innerHTML = ICONS['user_unlike'];
    document.getElementById('common_profile_info_view_count_icon').innerHTML = ICONS['user_views'];
    document.getElementById('common_profile_main_btn_following').innerHTML = ICONS['user_follows'];
    document.getElementById('common_profile_main_btn_followed').innerHTML = ICONS['user_followed'];
    document.getElementById('common_profile_main_btn_likes').innerHTML = ICONS['user_like'];
    document.getElementById('common_profile_main_btn_liked_heart').innerHTML = ICONS['user_like'];
    document.getElementById('common_profile_main_btn_liked_users').innerHTML = ICONS['user_followed'];
    
    document.getElementById('common_profile_private_title').innerHTML = ICONS['app_private'];
    document.getElementById('common_profile_avatar_online_status').innerHTML = ICONS['app_online'];
    //profile top
    document.getElementById('common_profile_top_row1_1').innerHTML = ICONS['user_views'];
    document.getElementById('common_profile_top_row1_2').innerHTML = ICONS['user_follows'];
    document.getElementById('common_profile_top_row1_3').innerHTML = ICONS['user_like'] + ICONS['user_follows'];
    document.getElementById('common_profile_home').innerHTML = ICONS['user_profile_top'];
    document.getElementById('common_profile_close').innerHTML = ICONS['app_close'];

    //profile button top
    if (document.getElementById('common_profile_btn_top'))
        document.getElementById('common_profile_btn_top').innerHTML = ICONS['user_profile_top'];

    //window info
    document.getElementById('common_window_info_toolbar_btn_close').innerHTML = ICONS['app_close'];
    document.getElementById('common_window_info_toolbar_btn_zoomout').innerHTML = ICONS['app_zoomout'];
    document.getElementById('common_window_info_toolbar_btn_zoomin').innerHTML = ICONS['app_zoomin'];
    document.getElementById('common_window_info_toolbar_btn_left').innerHTML =  ICONS['app_left'];
    document.getElementById('common_window_info_toolbar_btn_right').innerHTML = ICONS['app_right'];
    document.getElementById('common_window_info_toolbar_btn_up').innerHTML =  ICONS['app_up'];
    document.getElementById('common_window_info_toolbar_btn_down').innerHTML = ICONS['app_down'];
    document.getElementById('common_window_info_toolbar_btn_fullscreen').innerHTML = ICONS['presentation'];
    
    //user menu
    //document.getElementById('common_user_menu_dropdown_profile').innerHTML = ICONS['button_default_icon_profile'];
    document.getElementById('common_user_menu_dropdown_edit').innerHTML = ICONS['app_edit'];
    document.getElementById('common_user_menu_dropdown_log_out').innerHTML = ICONS['app_logoff'];
    document.getElementById('common_user_menu_dropdown_signup').innerHTML = ICONS['app_signup'];
    document.getElementById('common_user_menu_dropdown_log_in').innerHTML = ICONS['app_login'];
    document.getElementById('common_user_menu_default_avatar').innerHTML = ICONS['user_avatar'];
    document.getElementById('common_user_preference_locale').innerHTML = ICONS['regional_locale'];
    document.getElementById('common_user_preference_timezone').innerHTML = ICONS['regional_timezone'];
    document.getElementById('common_user_preference_direction').innerHTML = ICONS['regional_direction'];        
    document.getElementById('common_user_preference_arabic_script').innerHTML = ICONS['regional_script'];
}
const set_events = () => {
    //login/signup/forgot
    document.getElementById('common_login_tab2').addEventListener('click', () => { show_common_dialogue('SIGNUP') }, false);
    document.getElementById('common_login_tab3').addEventListener('click', () => { show_common_dialogue('FORGOT') }, false);
    document.getElementById('common_login_close').addEventListener('click', () => { document.getElementById('common_dialogue_login').style.visibility = 'hidden' }, false);
    document.getElementById('common_signup_tab1').addEventListener('click', () => { show_common_dialogue('LOGIN') }, false);
    document.getElementById('common_signup_tab3').addEventListener('click', () => { show_common_dialogue('FORGOT') }, false);
    document.getElementById('common_signup_close').addEventListener('click', () => { document.getElementById('common_dialogue_signup').style.visibility = 'hidden' }, false);
    document.getElementById('common_forgot_tab1').addEventListener('click', () => { show_common_dialogue('LOGIN') }, false);
    document.getElementById('common_forgot_tab2').addEventListener('click', () => { show_common_dialogue('SIGNUP') }, false);
    document.getElementById('common_forgot_email').addEventListener('keyup', (event) =>{
        if (event.code === 'Enter') {
            event.preventDefault();
            user_forgot().then(()=>{
                //unfocus
                document.getElementById('common_forgot_email').blur();
            });
        }
    });
    document.getElementById('common_forgot_button').addEventListener('click', () => { user_forgot()}, false);
    document.getElementById('common_forgot_close').addEventListener('click', () => { document.getElementById('common_dialogue_forgot').style.visibility = 'hidden' }, false);
    //set app info
    document.getElementById('common_login_app_name').innerHTML = COMMON_GLOBAL['app_name'];
    document.getElementById('common_signup_app_name').innerHTML = COMMON_GLOBAL['app_name'];
    document.getElementById('common_forgot_app_name').innerHTML = COMMON_GLOBAL['app_name'];

    //dialogue message
    document.getElementById('common_message_cancel').addEventListener('click', () => { document.getElementById('common_dialogue_message').style.visibility = 'hidden'; }, false);
    //dialogue new password
    document.getElementById('common_user_new_password_cancel').addEventListener('click', () => { dialogue_new_password_clear(); }, false);
    document.getElementById('common_user_new_password_ok').addEventListener('click', () => { updatePassword(); }, false);
    //dialogue lov
    document.getElementById('common_lov_search_input').addEventListener('keyup', (event) => {lov_keys(event)});
    document.getElementById('common_lov_search_icon').addEventListener('click', () => {lov_filter(document.getElementById('common_lov_search_input').value);});
    document.getElementById('common_lov_close').addEventListener('click', () => { lov_close()}, false); 
    //profile search
    if (document.getElementById('common_profile_input_row'))
        document.getElementById('common_profile_search_icon').addEventListener('click', () => { document.getElementById('common_profile_search_input').focus();document.getElementById('common_profile_search_input').dispatchEvent(new KeyboardEvent('keyup')); }, false);
    //window info
    document.getElementById('common_window_info_toolbar').addEventListener('click', (event)=>{
        let event_target_id;
        if  (event.target.parentNode.id == 'common_window_info_toolbar'){
            //button
            event_target_id = event.target.id;
        }
        else
            if  (event.target.parentNode.parentNode.id == 'common_window_info_toolbar'){
                //svg or icon
                event_target_id = event.target.parentNode.id;
            }
            else{
                //path in svg
                event_target_id = event.target.parentNode.parentNode.id;
            }
                
        switch (event_target_id){
            case 'common_window_info_toolbar_btn_close':{
                document.getElementById('common_window_info').style.visibility = 'hidden'; 
                document.getElementById('common_window_info_info').innerHTML='';
                document.getElementById('common_window_info_content').src='';
                document.getElementById('common_window_info_content').classList='';
                document.getElementById('common_window_info_toolbar').classList='';
                break;
            }
            case 'common_window_info_toolbar_btn_zoomout':{
                zoom_info(-1);
                break;
            }
            case 'common_window_info_toolbar_btn_zoomin':{
                zoom_info(1);
                break;
            }
            case 'common_window_info_toolbar_btn_left':{
                move_info(-1,0);
                break;
            }
            case 'common_window_info_toolbar_btn_right':{
                move_info(1,0);
                break;
            }
            case 'common_window_info_toolbar_btn_up':{
                move_info(0,-1);
                break;
            }
            case 'common_window_info_toolbar_btn_down':{
                move_info(0,1);
                break;
            }
            case 'common_window_info_toolbar_btn_fullscreen':{
                if (document.fullscreenElement)
                    document.exitFullscreen();
                else
                    document.body.requestFullscreen();
                break;
            }
        }
    }, false);
    //user menu
    document.getElementById('common_user_menu').addEventListener('click', () => { let menu = document.getElementById('common_user_menu_dropdown');
                                                                                if (menu.style.visibility == 'visible') 
                                                                                        menu.style.visibility = 'hidden'; 
                                                                                else 
                                                                                        menu.style.visibility = 'visible' }, false);
    
    document.addEventListener('keydown', (event) =>{ 

        if (event.key === 'Escape') {
            event.preventDefault();
            //hide use menu dropdown
            if (document.getElementById('common_user_menu_dropdown').style.visibility=='visible')
                document.getElementById('common_user_menu_dropdown').style.visibility = 'hidden';
            //hide search
            let x = document.getElementById('common_profile_input_row'); 
            if (x.style.visibility == 'visible') {
                x.style.visibility = 'hidden';
                document.getElementById('common_profile_search_list_wrap').style.visibility = 'hidden'
            } 
        }
    }, false);
    document.getElementById('common_user_menu_dropdown_log_in').addEventListener('click', () => { show_common_dialogue('LOGIN'); document.getElementById('common_user_menu_dropdown').style.visibility = 'hidden';}, false);
    document.getElementById('common_user_menu_dropdown_edit').addEventListener('click', () => { user_edit();document.getElementById('common_user_menu_dropdown').style.visibility = 'hidden'; }, false);
    document.getElementById('common_user_menu_dropdown_signup').addEventListener('click', () => { show_common_dialogue('SIGNUP'); document.getElementById('common_user_menu_dropdown').style.visibility = 'hidden'; }, false);
    //user preferences
    //define globals and save settings here, in apps define what should happen when changing
    if (document.getElementById('common_user_locale_select'))
        document.getElementById('common_user_locale_select').addEventListener('change', (event) => { 
                                                                                    COMMON_GLOBAL['user_locale'] = event.target.value;
                                                                                    //change navigator.language, however when logging out default navigator.language will be set
                                                                                    //commented at the moment
                                                                                    //Object.defineProperties(navigator, {'language': {'value':COMMON_GLOBAL['user_locale'], writable: true}});
                                                                                    user_preference_save();
                                                                                }, false);
    if (document.getElementById('common_user_timezone_select'))
        document.getElementById('common_user_timezone_select').addEventListener('change', (event) => { COMMON_GLOBAL['user_timezone'] = event.target.value;
                                                                                                user_preference_save().then(()=>{
                                                                                                    if (document.getElementById('common_dialogue_user_edit').style.visibility == 'visible') {
                                                                                                        dialogue_user_edit_clear();
                                                                                                        user_edit();
                                                                                                    }
                                                                                                });
                                                                                                }, false);
    //define also in app if needed to adjust ui
    if (document.getElementById('common_user_direction_select'))
        document.getElementById('common_user_direction_select').addEventListener('change', (event) => { document.body.style.direction = event.target.value;
                                                                                                COMMON_GLOBAL['user_direction'] = event.target.value;  
                                                                                                user_preference_save();
                                                                                                }, false);
    if (document.getElementById('common_user_arabic_script_select'))
        document.getElementById('common_user_arabic_script_select').addEventListener('change', (event) => { COMMON_GLOBAL['user_arabic_script'] = event.target.value;
                                                                                                    user_preference_save();
                                                                                                    }, false);
    SearchAndSetSelectedIndex(COMMON_GLOBAL['user_locale'], document.getElementById('common_user_locale_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL['user_timezone'], document.getElementById('common_user_timezone_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL['user_direction'], document.getElementById('common_user_direction_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL['user_arabic_script'], document.getElementById('common_user_arabic_script_select'), 1);
    //dialogue user edit
    document.getElementById('common_user_edit_close').addEventListener('click', () => { dialogue_user_edit_clear() }, false);
    document.getElementById('common_user_edit_btn_avatar_img').addEventListener('click', () => { document.getElementById('common_user_edit_input_avatar_img').click() }, false);
    document.getElementById('common_user_edit_input_avatar_img').addEventListener('change', (event) => { show_image(document.getElementById('common_user_edit_avatar_img'), event.target.id, COMMON_GLOBAL['image_avatar_width'], COMMON_GLOBAL['image_avatar_height']) }, false);
    document.getElementById('common_user_edit_btn_user_update').addEventListener('click', () => { user_update(); }, false);
}
const set_common_parameters = (app_id, parameter_name, parameter_value) => {
    if (app_id == COMMON_GLOBAL['common_app_id']){
        switch (parameter_name){
            case 'IMAGE_FILE_ALLOWED_TYPE1'             :{COMMON_GLOBAL['image_file_allowed_type1'] = parameter_value;break;}
            case 'IMAGE_FILE_ALLOWED_TYPE2'             :{COMMON_GLOBAL['image_file_allowed_type2'] = parameter_value;break;}
            case 'IMAGE_FILE_ALLOWED_TYPE3'             :{COMMON_GLOBAL['image_file_allowed_type3'] = parameter_value;break;}
            case 'IMAGE_FILE_ALLOWED_TYPE4'             :{COMMON_GLOBAL['image_file_allowed_type4'] = parameter_value;break;}
            case 'IMAGE_FILE_ALLOWED_TYPE5'             :{COMMON_GLOBAL['image_file_allowed_type5'] = parameter_value;break;}
            case 'IMAGE_FILE_MIME_TYPE'                 :{COMMON_GLOBAL['image_file_mime_type'] = parameter_value;break;}
            case 'IMAGE_FILE_MAX_SIZE'                  :{COMMON_GLOBAL['image_file_max_size'] = parameter_value;break;}
            case 'IMAGE_AVATAR_WIDTH'                   :{COMMON_GLOBAL['image_avatar_width'] = parameter_value;break;}
            case 'IMAGE_AVATAR_HEIGHT'                  :{COMMON_GLOBAL['image_avatar_height'] = parameter_value;break;}
            case 'MODULE_LEAFLET_FLYTO'                 :{COMMON_GLOBAL['module_leaflet_flyto'] = parseInt(parameter_value);break;}
            case 'MODULE_LEAFLET_JUMPTO'                :{COMMON_GLOBAL['module_leaflet_jumpto'] = parseInt(parameter_value);break;}
            case 'MODULE_LEAFLET_POPUP_OFFSET'          :{COMMON_GLOBAL['module_leaflet_popup_offset'] = parseInt(parameter_value);break;}
            case 'MODULE_LEAFLET_STYLE'                 :{COMMON_GLOBAL['module_leaflet_style'] = parameter_value;break;}
        }
    }
}
const normal_start = async (ui) => {
    return new Promise((resolve)=>{
        document.title = COMMON_GLOBAL['app_name'];
        let url= '';
        if (COMMON_GLOBAL['app_id'] == COMMON_GLOBAL['common_app_id']){
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/app_parameter/admin/${COMMON_GLOBAL['app_id']}?`;
        }
        else{
            url = `${COMMON_GLOBAL['rest_resource_service']}/db${COMMON_GLOBAL['rest_resource_service_db_schema']}/app_parameter/${COMMON_GLOBAL['app_id']}?`;
        }
        //get data token
        common_fetch_basic(0, null,  null, null, (err, result)=>{
            //get parameters
            common_fetch(url, 'GET', 0, null, null, null, (err, result) =>{
                if (err)
                    null;
                else{
                    let global_app_parameters = [];
                    let json = JSON.parse(result);
                    for (let i = 0; i < json.data.length; i++) {
                        //set common parameters
                        if (json.data[i].app_id == COMMON_GLOBAL['common_app_id'])
                            set_common_parameters(json.data[i].app_id, json.data[i].parameter_name, json.data[i].parameter_value);
                        //return all parameters for admin app and for other apps all except admin app id parameters
                        if (COMMON_GLOBAL['app_id'] == COMMON_GLOBAL['common_app_id'] ||
                            json.data[i].app_id != COMMON_GLOBAL['common_app_id'])
                            global_app_parameters.push(JSON.parse(`{"app_id":${json.data[i].app_id}, 
                                                                    "parameter_name":"${json.data[i].parameter_name}",
                                                                    "parameter_value":${json.data[i].parameter_value==null?null:'"' + json.data[i].parameter_value + '"'}}`));
                    }
                    if (ui == true){
                        assign_icons();
                        set_events();
                    }            
                    resolve(global_app_parameters);
                }
            })
        })
    })    
}
const init_common = async (parameters, callBack) => {
    /*
    parameters:
    {app_id: 
     app_name:
     app_url:
     app_logo:
     exception_app_function:
     close_eventsource:
     ui:
     gps_lat: 
     gps_long: 
     gps_place:
     system_admin:
     system_admin_only:
     app_role_id:
     global_rest_client_id: 
     global_rest_client_secret:
     rest_resource_service:
	 rest_resource_service_db:
    }
    */  
    if (COMMON_GLOBAL['app_id'] ==null)
        set_globals(parameters);
    if (parameters.app_id == COMMON_GLOBAL['common_app_id']){
        //admin use different exception before and fter login
    	COMMON_GLOBAL['exception_app_function'] = parameters.exception_app_function;
	    COMMON_GLOBAL['user_app_role_id'] = parameters.app_role_id;
        broadcast_init(parameters.close_eventsource);
        if (parameters.system_admin==1){
            document.title = parameters.app_name;
            callBack(null, null);
        }
        else
            normal_start(parameters.ui).then((global_app_parameters)=>{
                callBack(null, global_app_parameters);
            })
    }
    else{
        broadcast_init(parameters.close_eventsource);
        normal_start(parameters.ui).then((global_app_parameters)=>{
            callBack(null, global_app_parameters);
        })
    }
};
export{/* GLOBALS*/
       COMMON_GLOBAL, ICONS, APP_SPINNER,
       /* MISC */
       getGregorian, checkconnected, typewatch, common_fetch_basic, common_fetch, toBase64, fromBase64, common_translate_ui,
       get_null_or_value, format_json_date, mobile, parseJwt, checkbox_value, checkbox_checked,image_format,
       list_image_format_src, recreate_img, convert_image, set_avatar, boolean_to_number, number_to_boolean,
       inIframe, show_image, getHostname, check_input, get_uservariables, SearchAndSetSelectedIndex,
       /* MESSAGE & DIALOGUE */
       dialogue_close, show_common_dialogue, show_message, dialogue_verify_clear, dialogue_new_password_clear,
       dialogue_user_edit_clear, dialogue_login_clear, dialogue_signup_clear, dialogue_forgot_clear, dialogue_profile_clear,
       dialogue_user_edit_remove_error, lov_close, lov_show, lov_keys, lov_filter,
       /* WINDOW INFO */
       zoom_info, move_info, show_window_info,
       /* BROADCAST */
       broadcast_init, maintenance_countdown, show_broadcast, show_broadcast_info, show_maintenance, reconnect,
       updateOnlineStatus, connectOnline, checkOnline,
       /* GPS */
       get_place_from_gps, get_gps_from_ip, tzlookup,
       /* MAP  */
       map_init, map_resize, map_line_removeall, map_line_create,
       map_setevent, map_setstyle, map_update_popup, map_update,
       /* COUNTRY & CITIES */
       get_cities,
       /* QR */
       create_qr,
       /* PROFILE */
       profile_follow_like, show_profile_click_events, profile_top, profile_detail, search_profile, profile_show,
       profile_close, profile_update_stat, search_input,
       /* USER  */
       user_login, user_logoff, user_edit, user_update, user_signup, user_verify_check_input, user_delete, user_function,
       user_account_app_delete, user_forgot, updatePassword, user_preference_save, user_preference_get,
       user_preferences_set_default_globals, user_preferences_update_select,
       /* USER PROVIDER */
       Providers_init, ProviderUser_update, ProviderSignIn,
       /* EXCEPTION */
       exception,
       /* INIT */
       set_globals, assign_icons, set_events, set_common_parameters, normal_start, init_common}