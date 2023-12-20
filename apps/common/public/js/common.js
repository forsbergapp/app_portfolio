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
    FFB
    SERVICE BROADCAST
    SERVICE GEOLOCATION
    SERVICE WORLDCITIES
    EXCEPTION
    INIT
 */
/*-----------------------
  GLOBALS               

  local objects:
  icon_string
  icon_string_svg
  
  ----------------------- */

//CONTINUE
const COMMON_GLOBAL = {
    common_app_id:'',
    app_id:null,
    app_logo:'',
    app_sound:'',
    ui:'',
    exception_app_function:'',
    user_app_role_id:'',
    system_admin:'',
    system_admin_only:'',
    user_identity_provider_id:'',
    user_account_id:'',
    client_latitude:'',
    client_longitude:'',
    client_place:'',
    client_timezone:'',
    rest_at:'',
    rest_dt:'',
    rest_admin_at:'',
    rest_resource_bff:'',
    image_file_allowed_type1:'',
    image_file_allowed_type2:'',
    image_file_allowed_type3:'',
    image_file_allowed_type4:'',
    image_file_allowed_type5:'',
    image_file_mime_type:'',
    image_file_max_size:'',
    image_avatar_width:'',
    image_avatar_height:'',
    user_locale:'',
    user_timezone:'',
    user_direction:'',
    user_arabic_script:'',
    user_preference_save:'',
    module_leaflet_library: '',
    module_leaflet_flyto:'',
    module_leaflet_jumpto:'',
    module_leaflet_popup_offset:'',
    module_leaflet_style:'',
    module_leaflet_session_map:'',
    module_leaflet_session_map_layer:'',
    module_leaflet_countries:'',
    module_leaflet_zoom:'', 
    module_leaflet_zoom_city:'',
    module_leaflet_zoom_pp:'',
    module_leaflet_marker_div_gps:'',
    module_leaflet_marker_div_city:'',
    module_leaflet_marker_div_pp:'',
    module_leaflet_map_styles:'',
    'module_easy.qrcode_width':'',
    'module_easy.qrcode_height':'',
    'module_easy.qrcode_color_dark':'',
    'module_easy.qrcode_color_light':'',
    'module_easy.qrcode_background_color':'',
    service_socket_client_ID:'',
    service_socket_eventsource:''
};
Object.seal(COMMON_GLOBAL);
const icon_string = (hexvalue) => `<div class='common_icon'>${String.fromCharCode(parseInt(hexvalue, 16))}</div>`;
const icon_string_svg = (svg) => `<div class='common_icon'>${svg}</div>`;
const ICONS = {
    'app_system_admin':         icon_string('f4fe'),
    'app_apps':                 icon_string_svg(`<svg viewBox='0 0 24 24' enable-background='new 0 0 24 24'>
                                                    <path d='M10,2H3C2.4,2,2,2.4,2,3v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1V3C11,2.4,10.6,2,10,2z M10,13H3c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1v-7C11,13.4,10.6,13,10,13z M21,2h-7c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1V3C22,2.4,21.6,2,21,2z M21,13h-7c-0.6,0-1,0.4-1,1v7c0,0.6,0.4,1,1,1h7c0.6,0,1-0.4,1-1v-7C22,13.4,21.6,13,21,13z'/>
                                                </svg>`),
    'app_maintenance':          '⚒',
    'app_alert':                '🚨',
    'app_mobile':               icon_string('f3cf'),
    'app_save':                 icon_string('f0c7'),
    'app_add':                  icon_string('2b'),
    'app_delete':               icon_string('f2ed'),
    'app_update':               icon_string('f0c7'),
    'app_edit':                 icon_string('f044'),
    'app_lov':                  icon_string('f139'),
    'app_send':                 icon_string('f1d8'),
    'app_sendmail':             icon_string('f0e0'),
    'app_email':                icon_string('f0e0'),
    'app_settings':             icon_string('f013'),
    'app_chat':                 icon_string('f075'),
    'app_log':                  icon_string('f03a'),
    'app_chart':                icon_string('f200'),
    'app_server':               icon_string('f233'),
    'app_route':                icon_string('f0e8'),
    'app_database':             icon_string('f1c0'),
    'app_database_schema':      icon_string('f0e8'),
    'app_users':                icon_string('f0c0'),
    'app_user_connections':     icon_string('e595'),
    'app_database_started':     icon_string('f205'),
    'app_database_notstarted':  icon_string('f204'),
    'app_database_calc':        icon_string('f1ec'),
    'app_backup':               icon_string('f0ed'),
    'app_install':              icon_string('f019'),
    'app_file_path':            icon_string('f802'),
    'app_broadcast':            icon_string('f519'),
    'app_restore':              icon_string('f0ee'),
    'app_checkbox_checked':     icon_string('f14a'),
    'app_checkbox_empty':       icon_string('f0c8'),
    'app_info':                 icon_string('f05a'),
    'app_close':                icon_string('f058'),
    'app_online':               icon_string('f111'),
    'app_search':               icon_string('f002'),
    'app_menu_open':            '☰',
    'app_menu_close':           icon_string('f410'),
    'app_broadcast_close':      icon_string('f410'),
    'app_first':                icon_string('f048'),
    'app_previous':             icon_string('f0d9'),
    'app_next':                 icon_string('f0da'),
    'app_last':                 icon_string('f051'),
    'app_slider_left':          icon_string('f137'),
    'app_slider_right':         icon_string('f138'),
    'app_align_left':           icon_string('f036'),
    'app_align_center':         icon_string('f037'),
    'app_align_right':          icon_string('f038'),
    'app_cancel':               icon_string('f057'),
    'app_zoomout':              icon_string('f010'),
    'app_zoomin':               icon_string('f00e'),
    'app_left':                 icon_string('f359'),
    'app_right':                icon_string('f35a'),
    'app_up':                   icon_string('f35b'),
    'app_down':                 icon_string('f358'),
    'app_remove':               icon_string('f00d'),
    'app_html':                 icon_string('f1c9'),
    'app_copy':                 icon_string('f0c5'),
    'app_pdf':                  icon_string('f1c1'),
    'app_link':                 icon_string('f0c1'),
    'app_print':                icon_string('f02f'),
    'app_private':              icon_string('f023'),
    'app_papersize':            icon_string('f15b'),
    'app_highlight':            '🔦',
    'app_show':                 icon_string('f06e'),
    'app_notes':                icon_string('f249'),
    'app_login':                icon_string('f2f6'),
    'app_logoff':               icon_string('f2f5'),
    'app_signup':               icon_string('f4ff'),
    'app_forgot':               icon_string('f059'),
    'app_question':             icon_string('f059'),
    'app_timetable':            icon_string('f073'),
    'app_role':                 icon_string('f630'),
    'app_active':               icon_string('f205'),
    'app_inactive':             icon_string('f204'),
    'app_verification_code':    '❂❂❂❂❂❂',
    'app_sum':                  '∑',
    'app_home':                 icon_string('f015'),
    'app_type':                 icon_string('f059'),
    'app_internet':             icon_string('f0ac'),
    'app_shield':               icon_string('f132'),
    'app_browser':              icon_string('f2d2'),
    'app_fullscreen':           '⛶',
    'app_init':                 '⭐',
    'app_vue':                  icon_string('f41f'),
    'app_react':                icon_string('f41b'),
    'app_javascript':           icon_string('f3b9'),
    //user
    'user':                     icon_string('f007'),
    'username':                 icon_string('41') + icon_string('42') + icon_string('43'),
    'user_last_logontime':      icon_string('f2f6'),
    'user_account_created':     icon_string('f4c6'),
    'user_account_modified':    icon_string('f044'),
    'user_password':            icon_string('f084'),
    'user_delete_account':      icon_string('f2ed'),
    'user_account_reminder':    icon_string('f059'),
    'user_avatar_edit':         icon_string('f030'),
    'user_avatar':              icon_string('f2bd'),
    'user_follow_user':         icon_string('f234'),
    'user_followed_user':       icon_string('f4fc'),
    'user_like':                icon_string('f004'),
    'user_unlike':              icon_string('f7a9'),
    'user_views':               icon_string('f06e'),
    'user_follows':             icon_string('f500'),
    'user_followed':            icon_string('f0c0'),
    'user_bio':                 icon_string('f2c2') + icon_string('41') + icon_string('42') + icon_string('43'),
    'user_profile':             icon_string('f2c2'),
    'user_profile_top':         icon_string('f5a2'),
    //provider
    'provider':                 icon_string('f5ab'),
    'provider_id':              icon_string('f2c1'),
    //gps
    'gps':                      icon_string('f3c5'),
    'gps_country':              icon_string('f57c'),
    'gps_city':                 icon_string('f64f'),
    'gps_popular_place':        icon_string('f005'),
    'gps_position':             icon_string('f276'),
    'gps_high_latitude':        icon_string('f0ac') + icon_string('f2dc'),
    'map_my_location':          icon_string('f601'),
    'map_layer':                icon_string('f5fd'),
    //regional
    'regional':                 icon_string('f0ac'),
    'regional_day':             icon_string('f185'),
    'regional_month':           icon_string('f186'),
    'regional_year':            icon_string('f073'),
    'regional_weekday':         icon_string('f784'),
    'regional_locale':          icon_string('f1ab'),
    'regional_timezone':        icon_string('f0ac'),
    'regional_calendar':        icon_string('f073'),
    'regional_numbersystem':    icon_string('31') + icon_string('32') + icon_string('33'),
    'regional_direction':       icon_string('f362'),
    'regional_script':          icon_string('f70e'),
    'regional_calendartype':    icon_string('f073'),
    'regional_calendar_hijri_type':icon_string('f073'),
    'regional_timeformat':      icon_string('31') + icon_string('32') + '/' + icon_string('32') + icon_string('34'),
    //sky
    'sky_cloud':                icon_string('f0c2'),
    'sky_sunrise':              icon_string('f185') + icon_string('f30c'),
    'sky_midday':               icon_string('f185'),
    'sky_afternoon':            icon_string('f6c4'),
    'sky_sunset':               icon_string('f185') + icon_string('f309'),
    'sky_night':                icon_string('f6c3'),
    'sky_midnight':             icon_string('f6c3'),
    //misc
    'misc_model':               icon_string_svg(`<svg viewBox="-2.5 -2.5 65 65">
                                                    <path d="M53,41V29H31V19h7V3H22v16h7v10H7v12H0v16h16V41H9V31h20v10h-7v16h16V41h-7V31h20v10h-7v16h16V41H53z M24,5h12v12H24V5z M14,55H2V43h12V55z M36,55H24V43h12V55z M58,55H46V43h12V55z"/>
                                                </svg>`),
    'misc_design':              icon_string('f53f'),
    'misc_image':               icon_string('f03e'),
    'misc_text':                icon_string('f034'),
    'misc_text_prayer':         icon_string('f683'),
    'misc_second':              icon_string('32'),
    'misc_title':               icon_string('f1ea'),
    'misc_book':                icon_string('f02d'),
    'misc_food':                icon_string('f2e7'),
    'misc_prayer':              icon_string('f683'),
    'misc_calling':             '🗣',
    'misc_ban':                 icon_string('f05e'),
    'infinite':                 '∞',
    //message
    'message_fail':             icon_string('f057'),
    'message_success':          icon_string('f058'),
    'message_error':            icon_string('f00d'),
    'message_text':             icon_string('41') + icon_string('42') + icon_string('43')
};
Object.seal(ICONS);
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
/*-----------------------
  MISC                   

  local objects:
  checkconnected
  format_json_date
  convert_image
  get_uservariables
  
  ----------------------- */

const getTimezoneOffset = (local_timezone) =>{
    const utc = new Date(	new Date().toLocaleString('en', {timeZone: 'UTC', year:'numeric'}),
                            new Date().toLocaleString('en', {timeZone: 'UTC', month:'numeric'})-1,
                            new Date().toLocaleString('en', {timeZone: 'UTC', day:'numeric'}),
                            new Date().toLocaleString('en', {timeZone: 'UTC', hour:'numeric', hour12:false}),
                            new Date().toLocaleString('en', {timeZone: 'UTC', minute:'numeric'})).valueOf();

    const local = new Date(	new Date().toLocaleString('en', {timeZone: local_timezone, year:'numeric'}),
                            new Date().toLocaleString('en', {timeZone: local_timezone, month:'numeric'})-1,
                            new Date().toLocaleString('en', {timeZone: local_timezone, day:'numeric'}),
                            new Date().toLocaleString('en', {timeZone: local_timezone, hour:'numeric', hour12:false}),
                            new Date().toLocaleString('en', {timeZone: local_timezone, minute:'numeric'})).valueOf();
    return (local-utc) / 1000 / 60 / 60;
};
const getTimezoneDate = timezone =>{
    const utc = new Date(	Number(new Date().toLocaleString('en', {timeZone: 'UTC', year:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', month:'numeric'}))-1,
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', day:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', hour:'numeric', hour12:false})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', minute:'numeric'})));
    return new Date(utc.setHours(  utc.getHours() + getTimezoneOffset(timezone)));
};
const getGregorian = (HijriDate, adjustment) =>{
    const DAY = 86400000; // a day in milliseconds
    const UNIX_EPOCH_JULIAN_DATE = 2440587.5; // January 1, 1970 GMT

    //The epoch of Hijri calendar for 1 Muharram, AH 1
    //The civil and the Friday epoch will be used here
    //const hijri_epoch_julian_astronomical 	= 1948439;	//Gregorian: Thursday 15 July 622
	const hijri_epoch_julian_civil 		    = 1948440;	//Gregorian: Friday 16 July 622	

    const year =  parseInt(HijriDate[0]);
    const month = parseInt(HijriDate[1]);
    const day =   parseInt(HijriDate[2]);
    //calculate julian date
    let julian_day = Math.floor(((11*year+3)/30)+(354*year)+(30*month)-((month-1)/2)+day+hijri_epoch_julian_civil-385);
    //adjust day with +- given number of days
    julian_day = julian_day + parseInt(adjustment);
    return [new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getFullYear(),
            new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getMonth() + 1,
            new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getDate()];
};
const checkconnected = async () => {
    try {
      await fetch('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap', {method: 'head', mode : 'no-cors'});
      return true;
    } catch (err) {
      return false;
    }
  };
let timer = 0;
//delay API calls when typing to avoid too many calls 
// ES6 spread operator, arrow function without function keyword
const typewatch = (callBack, ...parameter) =>{
    let type_delay=250;
    if (parameter.length>0 && parameter[0] !=null)
        switch (parameter[0].code){
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':{
                //immediate response when navigating
                type_delay = 0;
                break;
            }
        }
    clearTimeout(timer);
    timer = setTimeout(() => {
        callBack(...parameter);
    }, type_delay);
};
const toBase64 = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
};	
const fromBase64 = (str) => {
    return decodeURIComponent(escape(window.atob(str)));
};
const common_translate_ui = async (lang_code, callBack) => {
    let path='';
    if (COMMON_GLOBAL.app_id == COMMON_GLOBAL.common_app_id){
        path = `/app_object/admin?data_lang_code=${lang_code}&object_name=APP`;
    }
    else{
        path = `/app_object?data_lang_code=${lang_code}&object_name=APP`;
    }
    //translate objects
    await FFB ('DB_API', path, 'GET', 'DATA', null, (err, result) => {
        if (err)
            null;
        else{
            const app_objects = JSON.parse(result);
            for (const app_object of app_objects){
                switch (app_object.object_name){
                    case 'APP':{
                        //translate common items
                        switch  (app_object.object_item_name){
                            case 'USERNAME':{
                                document.querySelector('#common_login_username').placeholder = app_object.text;
                                document.querySelector('#common_signup_username').placeholder = app_object.text;
                                document.querySelector('#common_user_edit_input_username').placeholder = app_object.text;
                                break;
                            }
                            case 'EMAIL':{
                                document.querySelector('#common_signup_email').placeholder = app_object.text;
                                document.querySelector('#common_forgot_email').placeholder = app_object.text;
                                break;
                            }
                            case 'NEW_EMAIL':{
                                document.querySelector('#common_user_edit_input_new_email').placeholder = app_object.text;
                                break;
                            }
                            case 'BIO':{
                                document.querySelector('#common_user_edit_input_bio').placeholder = app_object.text;
                                break;
                            }
                            case 'PASSWORD':{
                                document.querySelector('#common_login_password').placeholder = app_object.text;
                                document.querySelector('#common_signup_password').placeholder = app_object.text;
                                document.querySelector('#common_user_edit_input_password').placeholder = app_object.text;
                                break;
                            }
                            case 'PASSWORD_CONFIRM':{
                                document.querySelector('#common_signup_password_confirm').placeholder = app_object.text;
                                document.querySelector('#common_user_edit_input_password_confirm').placeholder = app_object.text;
                                break;
                            }
                            case 'PASSWORD_REMINDER':{
                                document.querySelector('#common_signup_password_reminder').placeholder = app_object.text;
                                document.querySelector('#common_user_edit_input_password_reminder').placeholder = app_object.text;
                                break;
                            }
                            case 'NEW_PASSWORD_CONFIRM':{
                                document.querySelector('#common_user_edit_input_password_new_confirm').placeholder = app_object.text;
                                document.querySelector('#common_user_password_new_confirm').placeholder = app_object.text;    
                                break;
                            }
                            case 'NEW_PASSWORD':{
                                document.querySelector('#common_user_edit_input_password_new').placeholder = app_object.text;
                                document.querySelector('#common_user_password_new').placeholder = app_object.text;    
                                break;
                            }
                            case 'CONFIRM_QUESTION':{
                                document.querySelector('#common_confirm_question').innerHTML = app_object.text;
                                break;
                            }
                        } 
                        break;
                    }
                    case 'APP_LOV':{
                        //translate items in select lists in current app
                        const select_element = document.querySelector('#' + app_object.object_item_name.toLowerCase());
                        for (let option_element = 0; option_element < select_element.options.length; option_element++){
                            if (select_element.options[option_element].id == app_object.id)
                                select_element.options[option_element].text = app_object.text;
                        }
                        break;
                    }   
                }
            }
            //translate locales
            if (COMMON_GLOBAL.app_id == COMMON_GLOBAL.common_app_id){
                path = `/locale/admin?lang_code=${lang_code}`;
            }
            else{
                path = `/locale?lang_code=${lang_code}`;
            }
            FFB ('DB_API', path, 'GET', 'DATA', null, (err, result) => {
                if (err)
                    null;
                else{
                    const locales = JSON.parse(result);
                    let html='';
                    const select_locale = document.querySelector('#common_user_locale_select');
                    let i=0;
                    for (const locale of locales){
                        html += `<option id="${i}" value="${locale.locale}">${locale.text}</option>`;
                        i++;
                    }
                    select_locale.innerHTML = html;
                    select_locale.value = lang_code;
                }
                map_country(lang_code).then(()=>{
                    callBack(null,null);
                });
            });
        }
    });                            
};
const get_null_or_value = (value) => {
    if (value == null)
        return '';
    else
        return value;
};
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
                timeZone: COMMON_GLOBAL.user_timezone,
                year: 'numeric',
                month: 'long'
            };
        else
            options = {
                timeZone: COMMON_GLOBAL.user_timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'long'
            };
        const utc_date = new Date(Date.UTC(
            db_date.substr(0, 4), //year
            db_date.substr(5, 2) - 1, //month
            db_date.substr(8, 2), //day
            db_date.substr(11, 2), //hour
            db_date.substr(14, 2), //min
            db_date.substr(17, 2) //sec
        ));
        const format_date = utc_date.toLocaleDateString(COMMON_GLOBAL.user_locale, options);
        return format_date;
    }
};

const mobile = () =>{
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};
const image_format = (image) => {
    if (image == '' || image == null )
        return '';
    else
        return image;
            
};
const list_image_format_src = (image) => {
    if (image == '' || image == null)
        return '';
    else
        return `src='${image_format(image)}'`;
};
const recreate_img = (img_item) => {
    //cant set img src to null, it will containt url or show corrupt image
    //recreating the img is the workaround
    const parentnode = img_item.parentNode;
    const id = img_item.id;
    const alt = img_item.alt;
    const img = document.createElement('img');

    parentnode.removeChild(img_item);
    img.id = id;
    img.alt = alt;
    parentnode.appendChild(img);
    return null;
};
const convert_image = async (image_url, image_width, image_height) => {
    //function to convert images to specified size and mime type according to parameters
    return new Promise((resolve) => {
        if (image_url=='')
            resolve('');
        else{
            const img = new Image();
            img.src = image_url;
            //update Content Security Policy with allowed domain
            //to allow any image url source, uncomment:
            //img.crossOrigin = 'Anonymous';
            img.onload = (el) => {
                const elem = document.createElement('canvas');
                elem.width = image_width;
                elem.height = image_height;
                const ctx = elem.getContext('2d');
                ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
                resolve(ctx.canvas.toDataURL(COMMON_GLOBAL.image_file_mime_type));
            };
        }
    });
};
const set_avatar = (avatar, item) => {
    if (avatar == null || avatar == '')
        recreate_img(item);
    else
        item.src = image_format(avatar);
};
/* check if run inside an iframe*/
const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
};
const show_image = (item_img, item_input, image_width, image_height) => {
    const file = document.querySelector('#' + item_input).files[0];
    const reader = new FileReader();

    const allowedExtensions = [COMMON_GLOBAL.image_file_allowed_type1,
                               COMMON_GLOBAL.image_file_allowed_type2,
                               COMMON_GLOBAL.image_file_allowed_type3,
                               COMMON_GLOBAL.image_file_allowed_type4,
                               COMMON_GLOBAL.image_file_allowed_type5
                              ];
    const { name: fileName, size: fileSize } = file;
    const fileExtension = fileName.split('.').pop();
    if (!allowedExtensions.includes(fileExtension)){
        //File type not allowed
        show_message('ERROR', 20307, null,null, COMMON_GLOBAL.common_app_id);
    }
    else
        if (fileSize > COMMON_GLOBAL.image_file_max_size){
            //File size too large
            show_message('ERROR', 20308, null, null, COMMON_GLOBAL.common_app_id);
        }
        else {
            reader.onloadend = (event) => {
                convert_image(event.target.result, image_width, image_height).then((srcEncoded)=>{
                    item_img.src = srcEncoded;
                });
            };
        }
    if (file)
        reader.readAsDataURL(file); //reads the data as a URL
    else
        item_img.src = '';
    return null;
};
const getHostname = () =>{
    return `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}`;
};
const check_input = (text, text_length=100, nodb_message=false) => {
    if (text==null || text=='')
        return true;
    else{
        try {
            if (JSON.parse(JSON.stringify(text))){
                if (text.includes('"') || text.includes('\\')){
                    //not valid text
                    if (nodb_message==true)
                        show_message('INFO', null, null, COMMON_GLOBAL.icon_message_error, COMMON_GLOBAL.app_id);
                    else
                        show_message('ERROR', 20309, null, null, COMMON_GLOBAL.common_app_id);
                    return false;
                }
            }
            
        } catch (error) {
            //not valid text
            if (nodb_message==true)
                show_message('INFO', null, null, COMMON_GLOBAL.icon_message_error, COMMON_GLOBAL.app_id);
            else
                show_message('ERROR', 20309, null, null, COMMON_GLOBAL.common_app_id);
            return false;
        }
        try {
            //check default max length 100 characters or parameter value
            if (text.length>text_length){
                //text too long
                if (nodb_message==true)
                    show_message('INFO', null, null, COMMON_GLOBAL.icon_message_error, COMMON_GLOBAL.app_id);
                else
                    show_message('ERROR', 20310, null, null, COMMON_GLOBAL.common_app_id);
                return false;
            }
        } catch (error) {
            return false;
        }
        return true;
    }
};
const get_uservariables = () => {
    return {    user_language:      navigator.language,
                user_timezone:      Intl.DateTimeFormat().resolvedOptions().timeZone,
                user_number_system: Intl.NumberFormat().resolvedOptions().numberingSystem,
                user_platform:      navigator.platform,
                client_latitude:    COMMON_GLOBAL.client_latitude,
                client_longitude:   COMMON_GLOBAL.client_longitude,
                client_place:       COMMON_GLOBAL.client_place
            };
};
const SearchAndSetSelectedIndex = (search, select_item, colcheck) => {
    //colcheck=0 search id
    //colcheck=1 search value
    try {
        for (let i = 0; i < select_item.options.length; i++) {
            if ((colcheck==0 && select_item.options[i].id == search) ||
                (colcheck==1 && select_item.options[i].value == search)) {
                select_item.selectedIndex = i;
                return null;
            }
        }    
    } catch (error) {
        exception(COMMON_GLOBAL.exception_app_function, error);
    }
    
    return null;
};
/*----------------------- 
  MESSAGE & DIALOGUE     

  local objects: 
  dialogue_verify_clear
  dialogue_password_new_clear
  dialogue_user_edit_clear
  dialogue_forgot_clear
  dialogue_profile_clear
  dialogue_user_edit_remove_error
  lov_keys
  lov_filter

 ----------------------- */
 
const show_message_info_list = (list_obj) =>{
    let html = '';
    for (const item of list_obj){
        html += `<div id='common_message_info_list'>
                    <div class='common_message_info_list_row'>
                        <div class='common_message_info_list_col'>
                            <div>${Object.keys(item)}</div>
                        </div>
                        <div class='common_message_info_list_col'>
                            <div>${Object.values(item)}</div>
                        </div>
                    </div>
                </div>`;
    }
    return html;
};
const dialogue_close = async (dialogue) => {
    return new Promise(resolve=>{
        const animationDuration = 400;
        let soundDuration;
        if (COMMON_GLOBAL.app_sound==1){
            //add sound effect if needed
            const meepmeep = document.createElement('audio');
            meepmeep.src = '/common/audio/meepmeep.ogg';
            meepmeep.play();
            soundDuration = 400;
        }
        else
            soundDuration = 0;

        setTimeout(()=>{
            document.querySelector('#' + dialogue).classList.add('common_dialogue_close');
            setTimeout(()=>{
                document.querySelector('#' + dialogue).style.visibility = 'hidden';
                document.querySelector('#' + dialogue).classList.remove('common_dialogue_close');
                resolve();
            }, animationDuration);
        }, soundDuration);
    });
    
};
const show_common_dialogue = (dialogue, user_verification_type, title=null, icon=null, click_cancel_event) => {
    switch (dialogue) {
        case 'PROFILE':
            {    
                dialogue_profile_clear();
                document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
                break;
            }
        case 'PASSWORD_NEW':
            {    
                document.querySelector('#common_user_password_new_auth').innerHTML=title;
                document.querySelector('#common_user_password_new').value='';
                document.querySelector('#common_user_password_new_confirm').value='';
                document.querySelector('#common_dialogue_user_password_new').style.visibility = 'visible';
                break;
            }
        case 'VERIFY':
            {    
                dialogue_verify_clear();
                switch (user_verification_type){
                    case 'LOGIN':{
                        document.querySelector('#common_user_verification_type').innerHTML = 1;
                        break;
                    }
                    case 'SIGNUP':{
                        document.querySelector('#common_user_verification_type').innerHTML = 2;
                        break;
                    }
                    case 'FORGOT':{
                        document.querySelector('#common_user_verification_type').innerHTML = 3;
                        break;
                    }
                    case 'NEW_EMAIL':{
                        document.querySelector('#common_user_verification_type').innerHTML = 4;
                        break;
                    }
                }
                document.querySelector('#common_user_verify_cancel').addEventListener('click', click_cancel_event);

                document.querySelector('#common_user_verify_email').innerHTML = title;
                document.querySelector('#common_user_verify_cancel').innerHTML = icon;
                
                document.querySelector('#common_dialogue_login').style.visibility = 'hidden';
                document.querySelector('#common_dialogue_signup').style.visibility = 'hidden';
                document.querySelector('#common_dialogue_forgot').style.visibility = 'hidden';
                document.querySelector('#common_dialogue_user_verify').style.visibility = 'visible';
                break;
            }
        case 'LOGIN':
            {
                document.querySelector('#common_dialogue_login').style.visibility = 'visible';
                document.querySelector('#common_dialogue_signup').style.visibility = 'hidden';
                document.querySelector('#common_dialogue_forgot').style.visibility = 'hidden';
                document.querySelector('#common_login_username').focus();
                break;
            }
        case 'SIGNUP':
            {
                document.querySelector('#common_dialogue_login').style.visibility = 'hidden';
                document.querySelector('#common_dialogue_signup').style.visibility = 'visible';
                document.querySelector('#common_dialogue_forgot').style.visibility = 'hidden';
                document.querySelector('#common_signup_username').focus();
                break;
            }
        case 'FORGOT':
            {
                document.querySelector('#common_dialogue_login').style.visibility = 'hidden';
                document.querySelector('#common_dialogue_signup').style.visibility = 'hidden';
                document.querySelector('#common_dialogue_forgot').style.visibility = 'visible';
                document.querySelector('#common_forgot_email').focus();
                break;
            }
    }
    return null;   
};
/**
 * 
 * @param {'ERROR'|'INFO'|'EXCEPTION'|'CONFIRM'|'PROGRESS'} message_type 
 * @param {string} code 
 * @param {function} function_event 
 * @param {string|{part: number, total:number, text:string}} message 
 * @param {*} data_app_id 
 */
const show_message = (message_type, code, function_event, message=null, data_app_id=null) => {
    const confirm_question = document.querySelector('#common_confirm_question');
    const progressbar = document.querySelector('#common_message_progressbar');
    const progressbar_wrap = document.querySelector('#common_message_progressbar_wrap');
    const message_title = document.querySelector('#common_message_title');
    const dialogue = document.querySelector('#common_dialogue_message');
    const old_close = document.querySelector('#common_message_close');
    const button_cancel = document.querySelector('#common_message_cancel');
    const function_close = () => { document.querySelector('#common_dialogue_message').style.visibility = 'hidden';};
    const fontsize_normal = '1em';
    const fontsize_log = '0.5em';
    const show = 'inline-block';
    const hide = 'none';
    //this removes old eventlistener
    const button_close = old_close.cloneNode(true);
    
    old_close.parentNode.replaceChild(button_close, old_close);
    //INFO, ERROR, CONFIRM, EXCEPTION
    switch (message_type){
        case 'ERROR':{
            FFB ('DB_API', `/message?code=${code}&data_app_id=${data_app_id}`, 'GET', 'DATA', null, (err, result) => {
                confirm_question.style.display = hide;
                message_title.style.display = show;
                message_title.style.fontSize = fontsize_normal;
                progressbar.style.display = hide;
                progressbar_wrap.style.display = hide;
                button_cancel.style.display = hide;
                button_close.style.display = show;
                if(err)
                    message_title.innerHTML = err;
                else
                    message_title.innerHTML = JSON.parse(result)[0].text;
                button_close.addEventListener('click', function_close, false);
                dialogue.style.visibility = 'visible';
                button_close.focus();
            });
            break;
        }
        case 'INFO':{
            confirm_question.style.display = hide;
            message_title.style.display = show;
            message_title.style.fontSize = fontsize_normal;
            message_title.innerHTML = message;
            progressbar.style.display = hide;
            progressbar_wrap.style.display = hide;
            button_cancel.style.display = hide;
            button_close.style.display = show;
            button_close.addEventListener('click', function_close, false);
            dialogue.style.visibility = 'visible';
            button_close.focus();
            break;
        }
        case 'EXCEPTION':{
            confirm_question.style.display = hide;
            message_title.style.display = show;
            message_title.style.fontSize = fontsize_normal;
            progressbar.style.display = hide;
            progressbar_wrap.style.display = hide;
            button_cancel.style.display = hide;
            button_close.style.display = show;
            try {
                // dont show code or errno returned from json
                if (typeof JSON.parse(message).message !== 'undefined'){
                    // message from Node controller.js and service.js files
                    message_title.innerHTML= JSON.parse(message).message;
                }
                else{
                    //message from Mysql, code + sqlMessage
                    if (typeof JSON.parse(message).sqlMessage !== 'undefined')
                        message_title.innerHTML= 'DB Error: ' + JSON.parse(message).sqlMessage;
                    else{
                        //message from Oracle, errorNum, offset
                        if (typeof JSON.parse(message).errorNum !== 'undefined')
                            message_title.innerHTML= 'DB Error: ' + message;
                        else{
                            message = message.replace('<pre>','');
                            message = message.replace('</pre>','');
                            message_title.innerHTML= message;
                        }
                    }    
                }
            } catch (e) {
                //other error and json not returned, return the whole text
                message_title.innerHTML = message;
            }
            button_close.addEventListener('click', function_close, false);
            dialogue.style.visibility = 'visible';
            button_close.focus();
            break;
        }
        case 'CONFIRM':{
            confirm_question.style.display = show;
            message_title.style.display = hide;
            message_title.style.fontSize = fontsize_normal;
            message_title.innerHTML = '';
            progressbar.style.display = hide;
            progressbar_wrap.style.display = hide;
            button_cancel.style.display = show;
            button_close.style.display = show;
            button_close.addEventListener('click', function_event, false);
            dialogue.style.visibility = 'visible';
            button_close.focus();
            break;
        }
        case 'LOG':{
            confirm_question.style.display = hide;
            message_title.style.display = show;
            message_title.style.fontSize = fontsize_log;
            message_title.innerHTML = message;
            progressbar.style.display = hide;
            progressbar_wrap.style.display = hide;
            button_cancel.style.display = hide;
            button_close.style.display = show;
            button_close.addEventListener('click', function_close, false);
            dialogue.style.visibility = 'visible';
            button_close.focus();
            break;
        }
        case 'PROGRESS':{
            confirm_question.style.display = hide;
            message_title.style.display = show;
            message_title.style.fontSize = fontsize_log;
            message_title.innerHTML = message.text;
            progressbar.style.display = show;
            progressbar_wrap.style.display = show;
            progressbar.style.width = `${(message.part/message.total)*100}%`;
            button_cancel.style.display = hide;
            button_close.style.display = hide;
            dialogue.style.visibility = 'visible';
            break;
        }
    }
};
const dialogue_verify_clear = () => {
    document.querySelector('#common_dialogue_user_verify').style.visibility = 'hidden';
    //this removes old eventlistener
    const old_cancel = document.querySelector('#common_user_verify_cancel');
    const button_cancel = old_cancel.cloneNode(true);
    old_cancel.parentNode.replaceChild(button_cancel, old_cancel);
    document.querySelector('#common_user_verification_type').innerHTML='';
    document.querySelector('#common_user_verify_email').innerHTML='';
    document.querySelector('#common_user_verify_cancel').innerHTML='';
    document.querySelector('#common_user_verify_verification_char1').value = '';
    document.querySelector('#common_user_verify_verification_char2').value = '';
    document.querySelector('#common_user_verify_verification_char3').value = '';
    document.querySelector('#common_user_verify_verification_char4').value = '';
    document.querySelector('#common_user_verify_verification_char5').value = '';
    document.querySelector('#common_user_verify_verification_char6').value = '';
};
const dialogue_password_new_clear = () => {
    document.querySelector('#common_dialogue_user_password_new').style.visibility = 'hidden';
    document.querySelector('#common_user_password_new_auth').innerHTML='';
    document.querySelector('#common_user_password_new').value='';
    document.querySelector('#common_user_password_new_confirm').value='';
    COMMON_GLOBAL.user_account_id = '';
    COMMON_GLOBAL.rest_at = '';
};
const dialogue_user_edit_clear = () => {
    document.querySelector('#common_dialogue_user_edit').style.visibility = 'hidden';
    document.querySelector('#common_user_edit_avatar').style.display = 'none';
                
    //common
    document.querySelector('#common_user_edit_checkbox_profile_private').checked = false;
    document.querySelector('#common_user_edit_input_username').value = '';
    document.querySelector('#common_user_edit_input_bio').value = '';
    //local
    document.querySelector('#common_user_edit_input_email').innerHTML = '';
    document.querySelector('#common_user_edit_input_new_email').value = '';
    document.querySelector('#common_user_edit_input_password').value = '';
    document.querySelector('#common_user_edit_input_password_confirm').value = '';
    document.querySelector('#common_user_edit_input_password_new').value = '';
    document.querySelector('#common_user_edit_input_password_new_confirm').value = '';
    document.querySelector('#common_user_edit_input_password_reminder').value = '';
    //provider
    document.querySelector('#common_user_edit_provider_id').innerHTML = '';
    document.querySelector('#common_user_edit_label_provider_id_data').innerHTML = '';
    document.querySelector('#common_user_edit_label_provider_name_data').innerHTML = '';
    document.querySelector('#common_user_edit_label_provider_email_data').innerHTML = '';
    document.querySelector('#common_user_edit_label_provider_image_url_data').innerHTML = '';
    //account info
    document.querySelector('#common_user_edit_label_data_last_logontime').innerHTML = '';
    document.querySelector('#common_user_edit_label_data_account_created').innerHTML = '';
    document.querySelector('#common_user_edit_label_data_account_modified').innerHTML = '';
};
const dialogue_login_clear = () => {
    document.querySelector('#common_dialogue_login').style.visibility = 'hidden';
    document.querySelector('#common_login_username').value = '';
    document.querySelector('#common_login_password').value = '';
};
const dialogue_signup_clear = () => {
    document.querySelector('#common_dialogue_signup').style.visibility = 'hidden';
    document.querySelector('#common_signup_username').value = '';
    document.querySelector('#common_signup_email').value = '';
    document.querySelector('#common_signup_password').value = '';
    document.querySelector('#common_signup_password_confirm').value = '';
    document.querySelector('#common_signup_password_reminder').value = '';
};
const dialogue_forgot_clear = () => {
    document.querySelector('#common_forgot_email').value = '';
};
const dialogue_profile_clear = () => {
    document.querySelector('#common_profile_info').style.display = 'none';
    document.querySelector('#common_profile_top').style.display = 'none';
    document.querySelector('#common_profile_detail').style.display = 'none';
    
    document.querySelector('#common_profile_follow').children[0].style.display = 'block';
    document.querySelector('#common_profile_follow').children[1].style.display = 'none';
    document.querySelector('#common_profile_like').children[0].style.display = 'block';
    document.querySelector('#common_profile_like').children[1].style.display = 'none';

    document.querySelector('#common_profile_avatar').src = '';
    document.querySelector('#common_profile_username').innerHTML = '';
    document.querySelector('#common_profile_bio').innerHTML = '';
    document.querySelector('#common_profile_joined_date').innerHTML = '';

    document.querySelector('#common_profile_info_view_count').innerHTML = '';
    document.querySelector('#common_profile_info_following_count').innerHTML = '';
    document.querySelector('#common_profile_info_followers_count').innerHTML = '';
    document.querySelector('#common_profile_info_likes_count').innerHTML = '';
    document.querySelector('#common_profile_info_liked_count').innerHTML = '';
    
    document.querySelector('#common_profile_qr').innerHTML = '';
    document.querySelector('#common_profile_detail_list').innerHTML = '';
    document.querySelector('#common_profile_top_list').innerHTML = '';
};
const dialogue_user_edit_remove_error = () => {
    document.querySelector('#common_user_edit_input_username').classList.remove('common_input_error');

    document.querySelector('#common_user_edit_input_bio').classList.remove('common_input_error');
    document.querySelector('#common_user_edit_input_new_email').classList.remove('common_input_error');

    document.querySelector('#common_user_edit_input_password').classList.remove('common_input_error');
    document.querySelector('#common_user_edit_input_password_confirm').classList.remove('common_input_error');
    document.querySelector('#common_user_edit_input_password_new').classList.remove('common_input_error');
    document.querySelector('#common_user_edit_input_password_new_confirm').classList.remove('common_input_error');

    document.querySelector('#common_user_edit_input_password_reminder').classList.remove('common_input_error');
};
const lov_close = () => {
    //remove all event listeners
    document.querySelectorAll('.common_list_lov_row').forEach(e => 
        e.replaceWith(e.cloneNode(true))
    );
    document.querySelector('#common_dialogue_lov').style.visibility = 'hidden';
    document.querySelector('#common_lov_title').innerHTML='';
    document.querySelector('#common_lov_search_input').value='';
    document.querySelector('#common_lov_list').innerHTML='';
    
};
const lov_show = (lov, function_event) => {
    
    document.querySelector('#common_dialogue_lov').style.visibility = 'visible';
    document.querySelector('#common_lov_list').innerHTML = APP_SPINNER;
    let path = '';
    let token_type = '';
    let lov_column_value='';
    let service;
    switch (lov){
        case 'PARAMETER_TYPE':{
            document.querySelector('#common_lov_title').innerHTML = ICONS.app_apps + ' ' + ICONS.app_settings  + ' ' + ICONS.app_type;
            lov_column_value = 'parameter_type_text';            
            path = '/parameter_type/admin?';
            service = 'DB_API';
            token_type = 'ACCESS';
            break;
        }
        case 'SERVER_LOG_FILES':{
            document.querySelector('#common_lov_title').innerHTML = ICONS.app_server + ' ' + ICONS.app_file_path;
            lov_column_value = 'filename';
            path = '/log/files?';
            service = 'LOG';
            token_type = 'SYSTEMADMIN';
            break;
        }
        case 'APP_CATEGORY':{
            document.querySelector('#common_lov_title').innerHTML = ICONS.app_apps + ' ' + ICONS.app_type;
            lov_column_value = 'app_category_text';
            path = '/app_category/admin?';
            service = 'DB_API';
            token_type = 'ACCESS';
            break;
        }
        case 'APP_ROLE':{
            document.querySelector('#common_lov_title').innerHTML = ICONS.app_role;
            lov_column_value = 'icon';
            path = '/app_role/admin?';
            service = 'DB_API';
            token_type = 'ACCESS';
            break;
        }
    }
    FFB (service, path, 'GET', token_type, null, (err, result) => {
        if (err)
            document.querySelector('#common_lov_list').innerHTML = '';
        else{
            document.querySelector('#common_lov_list').innerHTML = '';
            const list_result = JSON.parse(result);
            let html = '';
            let i=0;
            for (const list_row of list_result) {
                html += 
                `<div id='common_list_lov_row_${i}' tabindex=-1 class='common_list_lov_row'>
                    <div class='common_list_lov_col'>
                        <div>${list_row.id}</div>
                    </div>
                    <div class='common_list_lov_col'>
                        <div>${list_row[lov_column_value]}</div>
                    </div>
                </div>`;
                i++;
            }
            document.querySelector('#common_lov_list').innerHTML = html;
            document.querySelector('#common_lov_search_input').focus();
            document.querySelectorAll('.common_list_lov_row').forEach(e => e.addEventListener('click', function_event));
        }
    });
};
const lov_keys = (event) => {
    switch (event.code){
        case 'ArrowLeft':
        case 'ArrowRight':{
            break;
        }
        case 'ArrowUp':
        case 'ArrowDown':{
            //loop rows not hidden
            const rows = document.querySelectorAll('.common_list_lov_row:not(.list_lov_row_hide)');
            const focus_item = (element) =>{
                element.focus();
                document.querySelector('#common_lov_search_input').focus();
            };
            let i = 0;
            for (const row of rows) {
                if (row.classList.contains('common_list_lov_row_selected')){
                    //if up and first or
                    //if down and last
                    if ((event.code=='ArrowUp' && i == 0)||
                        (event.code=='ArrowDown' && i == rows.length -1)){
                        if(event.code=='ArrowUp'){
                            //if the first, set the last
                            row.classList.remove ('common_list_lov_row_selected');
                            rows[rows.length -1].classList.add ('common_list_lov_row_selected');
                            focus_item(rows[rows.length -1]);
                        }
                        else{
                            //if the last, set the first
                            row.classList.remove ('common_list_lov_row_selected');
                            rows[0].classList.add ('common_list_lov_row_selected');
                            focus_item(rows[0]);
                        }
                        return;
                    }
                    else{
                        if(event.code=='ArrowUp'){
                            //remove highlight, highlight previous
                            row.classList.remove ('common_list_lov_row_selected');
                            rows[i-1].classList.add ('common_list_lov_row_selected');
                            focus_item(rows[i-1]);
                        }
                        else{
                            //down
                            //remove highlight, highlight next
                            row.classList.remove ('common_list_lov_row_selected');
                            rows[i+1].classList.add ('common_list_lov_row_selected');
                            focus_item(rows[i+1]);
                        }
                        return;
                    }
                }
                i++;
            }
            //no highlight found, highlight first
            rows[0].classList.add ('common_list_lov_row_selected');
            focus_item(rows[0]);
            break;
        }
        case 'Enter':{
            //enter
            const rows = document.querySelectorAll('.common_list_lov_row');
            for (const row of rows) {
                if (row.classList.contains('common_list_lov_row_selected')){
                    //event on row is set in app when calling lov, dispatch it!
                    row.dispatchEvent(new Event('click'));
                    row.classList.remove ('common_list_lov_row_selected');
                }
            }
            break;
        }
        default:{
            //if db call will be implemented, add delay
            //typewatch(lov_filter, document.querySelector('#common_lov_search_input').value); 
            lov_filter(document.querySelector('#common_lov_search_input').value); 
            break;
        }    
    }
};
const lov_filter = (text_filter) => {
    const rows = document.querySelectorAll('.common_list_lov_row');
    for (const row of rows) {
        row.classList.remove ('common_list_lov_row_hide');
        row.classList.remove ('common_list_lov_row_selected');
    }
    for (const row of rows) {
        if (row.children[0].children[0].innerHTML.toUpperCase().indexOf(text_filter.toUpperCase()) > -1 ||
            row.children[1].children[0].innerHTML.toUpperCase().indexOf(text_filter.toUpperCase()) > -1){
                row.classList.remove ('common_list_lov_row_hide');
            }
        else{
            row.classList.remove ('common_list_lov_row_hide');
            row.classList.add ('common_list_lov_row_hide');
        }
    }
};

/*----------------------- */
/* WINDOW INFO            */
/*----------------------- */
const zoom_info = (zoomvalue = '') => {
    let old;
    let old_scale;
    const div = document.querySelector('#common_window_info_info');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == '') {
        div.style.transform = 'scale(1)';
    } else {
        old = div.style.transform;
        old_scale = parseFloat(old.substr(old.indexOf('(') + 1, old.indexOf(')') - 1));
        div.style.transform = 'scale(' + (old_scale + ((zoomvalue*5) / 10)) + ')';
    }
    return null;
};
const move_info = (move1, move2) => {
    let old;
    const div = document.querySelector('#common_window_info_info');
    if (move1==null && move2==null) {
        div.style.transformOrigin = '50% 50%';
    } else {
        old = div.style.transformOrigin;
        const old_move1 = parseFloat(old.substr(0, old.indexOf('%')));
        const old_move2 = parseFloat(old.substr(old.indexOf('%') +1, old.length -1));
        div.style.transformOrigin =  `${old_move1 + (move1*5)}% ${old_move2 + (move2*5)}%`;
    }
    return null;
};
const show_window_info = (info, url, content_type, iframe_content) => {
    //reset zoom and move
    zoom_info('');
    move_info(null,null);
    switch(info){
        case 0:{
            //show image
            document.querySelector('#common_window_info_content').src='';
            document.querySelector('#common_window_info_toolbar').style.display = 'flex';
            document.querySelector('#common_window_info_content').style.display = 'none';
            document.querySelector('#common_window_info').style.overflowY = 'auto';
            document.querySelector('#common_window_info').style.visibility = 'visible';
            document.querySelector('#common_window_info_info').innerHTML = `<img src='${url}'/>`;
            document.querySelector('#common_window_info_info').style.display = 'inline-block';
            break;
        }
        case 1:{
            //show url in iframe, use overflowY=hidden
            document.querySelector('#common_window_info_content').src=url;
            document.querySelector('#common_window_info_toolbar').style.display = 'none';
            document.querySelector('#common_window_info_content').style.display = 'block';
            document.querySelector('#common_window_info').style.overflowY = 'hidden';
            document.querySelector('#common_window_info').style.visibility = 'visible';
            document.querySelector('#common_window_info_info').innerHTML = '';
            document.querySelector('#common_window_info_info').style.display = 'none';
            break;
        }    
        case 2:{
            //show spinner first and then url in iframe, HTML or PDF
            document.querySelector('#common_window_info_content').src='';
            document.querySelector('#common_window_info_toolbar').style.display = 'none';
            document.querySelector('#common_window_info_content').style.display = 'block';
            document.querySelector('#common_window_info').style.overflowY = 'auto';
            document.querySelector('#common_window_info').style.visibility = 'visible';
            document.querySelector('#common_window_info_info').innerHTML = APP_SPINNER;
            document.querySelector('#common_window_info_info').style.display = 'inline-block';
            if (content_type == 'HTML'){
                document.querySelector('#common_window_info_info').innerHTML = '';
                document.querySelector('#common_window_info_content').src=iframe_content;
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
                        const reader = new FileReader();
                        reader.readAsDataURL(pdf); 
                        reader.onloadend = () => {
                            const base64PDF = reader.result;
                            document.querySelector('#common_window_info_info').innerHTML = '';
                            document.querySelector('#common_window_info_info').style.display = 'none';
                            document.querySelector('#common_window_info_content').src = base64PDF;
                        };
                    });
                }
        }
    }
};
const show_hide_window_info_toolbar = () => {
    if (document.querySelector('#common_window_info_toolbar').style.display=='flex' ||
        document.querySelector('#common_window_info_toolbar').style.display=='')
        document.querySelector('#common_window_info_toolbar').style.display='none';
    else
        document.querySelector('#common_window_info_toolbar').style.display='flex';
};
/*-----------------------
  PROFILE               

  local objects:
  show_profile_click_events
  search_profile
  ----------------------- */
const profile_follow_like = async (function_name) => {
    await user_function(function_name, (err) => {
        if (err==null){
            profile_update_stat(()=>{});
        }
    });
};
const show_profile_click_events = (item, click_function) => {
    document.querySelectorAll(item).forEach(e => e.addEventListener('click', (event) => {
        //execute function from inparameter or use default when not specified
        const profile_id = event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML;
        if (click_function ==null){
            profile_show(profile_id,null,()=>{});
        }
        else{
            click_function(profile_id);
        }
    }));
};
const profile_top = (statchoice, app_rest_url = null, click_function=null) => {
    let path;
    document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
    document.querySelector('#common_profile_info').style.display = 'none';
    document.querySelector('#common_profile_top').style.display = 'block';
                
    if (statchoice ==1 || statchoice ==2 || statchoice ==3){
        /*statschoice 1,2,3: user_account*/
        path = `/user_account/profile/top?statchoice=${statchoice}`;
    }
    else{
        /*other statschoice, apps can use >3 and return same columns*/
        path = `${app_rest_url}?statchoice=${statchoice}`;
    }
    //TOP
    FFB ('DB_API', path, 'GET', 'DATA', null, (err, result) => {
        if (err)
            null;
        else{
            const profile_top_list = document.querySelector('#common_profile_top_list');
            profile_top_list.innerHTML = '';
            let html ='';
            let image='';
            for (const profile_top of JSON.parse(result)) {
                image = list_image_format_src(profile_top.avatar ?? profile_top.provider_image);
                html +=
                `<div class='common_profile_top_list_row'>
                    <div class='common_profile_top_list_col'>
                        <div class='common_profile_top_list_user_account_id'>${profile_top.id}</div>
                    </div>
                    <div class='common_profile_top_list_col'>
                        <img class='common_profile_top_list_avatar' ${image}>
                    </div>
                    <div class='common_profile_top_list_col'>
                        <div class='common_profile_top_list_username common_wide_list_column'>
                            <a href='#'>${profile_top.username}</a>
                        </div>
                    </div>
                    <div class='common_profile_top_list_col'>
                        <div class='common_profile_top_list_count'>${profile_top.count}</div>
                    </div>
                </div>`;
            }
            profile_top_list.innerHTML = html;
            show_profile_click_events('.common_profile_top_list_username', click_function);
        }
    });
};
const profile_detail = (detailchoice, rest_url_app, fetch_detail, header_app, click_function) => {
    let path;
    if (detailchoice == 1 || detailchoice == 2 || detailchoice == 3 || detailchoice == 4){
        /*detailchoice 1,2,3, 4: user_account*/
        path = '/user_account/profile/detail';
    }
    else{
        /* detailchoice 5, apps, returns same columns*/
        path = `${rest_url_app}`;
    }
    path += `?user_account_id=${document.querySelector('#common_profile_id').innerHTML}&detailchoice=${detailchoice}`;
    //DETAIL
    //show only if user logged in
    if (parseInt(COMMON_GLOBAL.user_account_id) || 0 !== 0) {
        switch (detailchoice) {
            case 0:
                {
                    //show only other app specific hide common
                    document.querySelector('#common_profile_detail').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_following').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_followed').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_like').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_liked').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 1:
                {
                    //Following
                    document.querySelector('#common_profile_detail').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_following').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_followed').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_like').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_liked').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 2:
                {
                    //Followed
                    document.querySelector('#common_profile_detail').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_following').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_followed').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_like').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_liked').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 3:
                {
                    //Like user
                    document.querySelector('#common_profile_detail').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_following').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_followed').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_like').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_liked').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            case 4:
                {
                    //Liked user
                    document.querySelector('#common_profile_detail').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_following').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_followed').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_like').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_liked').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_app').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').innerHTML = '';
                    break;
                }
            default:
                {
                    //show app specific
                    document.querySelector('#common_profile_detail').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_following').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_followed').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_like').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_liked').style.display = 'none';
                    document.querySelector('#common_profile_detail_header_app').style.display = 'block';
                    document.querySelector('#common_profile_detail_header_app').innerHTML = header_app;
                    break;
                }
        }
        if (fetch_detail){
            FFB ('DB_API', path, 'GET', 'ACCESS', null, (err, result) => {
                if (err)
                    null;
                else{
                    const list_items = JSON.parse(result);
                    const profile_detail_list = document.querySelector('#common_profile_detail_list');
                    profile_detail_list.innerHTML = '';

                    let html = '';
                    let image = '';
                    let delete_div ='';
                    for (const list_item of list_items) {
                        //id for username list, app_id for app list
                        if (detailchoice==5 && typeof list_item.id =='undefined'){
                            if (document.querySelector('#common_profile_id').innerHTML==COMMON_GLOBAL.user_account_id)
                                delete_div = `<div class='common_profile_detail_list_app_delete'>${ICONS.app_delete}</div>`;
                                
                            //App list in app 0
                            html += 
                            `<div class='common_profile_detail_list_row'>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_app_id'>${list_item.APP_ID}</div>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <img class='common_profile_detail_list_app_logo' src='${list_item.LOGO}'>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_app_name common_wide_list_column common_link'>
                                        ${list_item.NAME}
                                    </div>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    ${delete_div}
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_app_url'>${list_item.PROTOCOL}${list_item.SUBDOMAIN}.${list_item.HOST}:${list_item.PORT}</div>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_date_created'>${list_item.date_created}</div>
                                </div>
                            </div>`;
                        }
                        else{
                            //Username list
                            image = list_image_format_src(list_item.avatar ?? list_item.provider_image);
                            html += 
                            `<div class='common_profile_detail_list_row'>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_user_account_id'>${list_item.id}</div>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <img class='common_profile_detail_list_avatar' ${image}>
                                </div>
                                <div class='common_profile_detail_list_col'>
                                    <div class='common_profile_detail_list_username common_wide_list_column'>
                                        <a href='#'>${list_item.username}</a>
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
                                if (document.querySelector('#common_profile_id').innerHTML==COMMON_GLOBAL.user_account_id){
                                    if (event.target.parentNode.classList.contains('common_profile_detail_list_app_delete'))
                                        user_account_app_delete(null, 
                                                                document.querySelector('#common_profile_id').innerHTML,
                                                                event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML,
                                                                () => { 
                                                                    document.querySelector('#common_dialogue_message').style.visibility = 'hidden';
                                                                    user_account_app_delete(1, 
                                                                                            document.querySelector('#common_profile_id').innerHTML, 
                                                                                            event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML, 
                                                                                            null);
                                                                });
                            }
                        }, false);
                    }
                    else
                        show_profile_click_events('.common_profile_detail_list_username', click_function);
                }
            });
        }
    } else
        show_common_dialogue('LOGIN');
};
const search_profile = (click_function) => {
    document.querySelector('#common_profile_search_input').classList.remove('common_input_error');
    const profile_search_list = document.querySelector('#common_profile_search_list');
    profile_search_list.innerHTML = '';
    document.querySelector('#common_profile_search_list_wrap').style.display = 'none';
    profile_search_list.style.display = 'none';
    if (document.querySelector('#common_profile_search_input').value=='')
        document.querySelector('#common_profile_search_input').classList.add('common_input_error');
    else{
        const searched_username = document.querySelector('#common_profile_search_input').value;
        let path;
        let token;
        let json_data;
        if (check_input(searched_username) == false)
            return;
        if (COMMON_GLOBAL.user_account_id!=''){
            //search using access token with logged in user_account_id
            path = `/user_account/profile/username/searchA?search=${encodeURI(searched_username)}`;
            token = 'ACCESS';
            json_data = {   user_account_id:    COMMON_GLOBAL.user_account_id,
                            client_latitude:    COMMON_GLOBAL.client_latitude,
                            client_longitude:   COMMON_GLOBAL.client_longitude
                        };
        }
        else{
            //search using data token without logged in user_account_id
            path = `/user_account/profile/username/searchD?search=${encodeURI(searched_username)}`;
            token = 'DATA';
            json_data = {   client_latitude:    COMMON_GLOBAL.client_latitude,
                            client_longitude:   COMMON_GLOBAL.client_longitude
                        };
        }
        FFB ('DB_API', path, 'POST', token, json_data, (err, result) => {
            if (err)
                null;
            else{
                if (JSON.parse(result).length > 0){
                    profile_search_list.style.display = 'inline-block';
                    document.querySelector('#common_profile_search_list_wrap').style.display = 'flex';
                }
                let html = '';
                let image= '';
                for (const search_profile of JSON.parse(result)) {
                    image = list_image_format_src(search_profile.avatar ?? search_profile.provider_image);
                    html +=
                    `<div class='common_profile_search_list_row' tabindex=-1>
                        <div class='common_profile_search_list_col'>
                            <div class='common_profile_search_list_user_account_id'>${search_profile.id}</div>
                        </div>
                        <div class='common_profile_search_list_col'>
                            <img class='common_profile_search_list_avatar' ${image}>
                        </div>
                        <div class='common_profile_search_list_col'>
                            <div class='common_profile_search_list_username common_wide_list_column'>
                                <a href='#'>${search_profile.username}</a>
                            </div>
                        </div>
                    </div>`;
                }
                profile_search_list.innerHTML = html;
                show_profile_click_events('.common_profile_search_list_username', click_function);
            }
        });
    }
};
/*
profile_show(null, null)     from dropdown menu in apps or choosing logged in users profile
profile_show(userid, null) 	 from choosing profile in profile_top
profile_show(userid, null) 	 from choosing profile in profile_detail
profile_show(userid, null) 	 from choosing profile in search_profile
profile_show(null, username) from init startup when user enters url
*/
const profile_show = async (user_account_id_other = null, username = null, callBack) => {
    let user_account_id_search;
    let path;

    show_common_dialogue('PROFILE');
    if (user_account_id_other == null && COMMON_GLOBAL.user_account_id == '' && username == null) {
        return callBack(null,null);
    } else {
        if (user_account_id_other !== null) {
            user_account_id_search = user_account_id_other;
            path = `/user_account/profile/id?POST_ID=${user_account_id_search}&id=${COMMON_GLOBAL.user_account_id}`;
        } else
        if (username !== null) {
            user_account_id_search = '';
            path = `/user_account/profile/username?search=${username}&id=${COMMON_GLOBAL.user_account_id}`;
        } else {
            user_account_id_search = COMMON_GLOBAL.user_account_id;
            path = `/user_account/profile/id?POST_ID=${user_account_id_search}&id=${COMMON_GLOBAL.user_account_id}`;
        }
        //PROFILE MAIN
        const json_data ={  
                            client_latitude:    COMMON_GLOBAL.client_latitude,
                            client_longitude:   COMMON_GLOBAL.client_longitude
                        };
        FFB ('DB_API', path, 'POST', 'DATA', json_data, (err, result) => {
            if (err)
                return callBack(err,null);
            else{
                const profile = JSON.parse(result);
                document.querySelector('#common_profile_info').style.display = 'block';
                document.querySelector('#common_profile_main').style.display = 'block';
                document.querySelector('#common_profile_id').innerHTML = profile.id;
                set_avatar(profile.avatar ?? profile.provider_image, document.querySelector('#common_profile_avatar')); 
                //show local username
                document.querySelector('#common_profile_username').innerHTML = profile.username;

                document.querySelector('#common_profile_bio').innerHTML = get_null_or_value(profile.bio);
                document.querySelector('#common_profile_joined_date').innerHTML = format_json_date(profile.date_created, true);
                document.querySelector('#common_profile_qr').innerHTML = '';
                create_qr('common_profile_qr', getHostname() + '/' + profile.username);
                //User account followed and liked
                if (profile.followed == 1) {
                    //followed
                    document.querySelector('#common_profile_follow').children[0].style.display = 'none';
                    document.querySelector('#common_profile_follow').children[1].style.display = 'block';
                } else {
                    //not followed
                    document.querySelector('#common_profile_follow').children[0].style.display = 'block';
                    document.querySelector('#common_profile_follow').children[1].style.display = 'none';
                }
                if (profile.liked == 1) {
                    //liked
                    document.querySelector('#common_profile_like').children[0].style.display = 'none';
                    document.querySelector('#common_profile_like').children[1].style.display = 'block';
                } else {
                    //not liked
                    document.querySelector('#common_profile_like').children[0].style.display = 'block';
                    document.querySelector('#common_profile_like').children[1].style.display = 'none';
                } 
                //if private then hide info, sql decides if private, no need to check here if same user
                if (profile.private==1) {
                    //private
                    document.querySelector('#common_profile_public').style.display = 'none';
                    document.querySelector('#common_profile_private').style.display = 'block';
                } else {
                    //public
                    document.querySelector('#common_profile_public').style.display = 'block';
                    document.querySelector('#common_profile_private').style.display = 'none';
                    document.querySelector('#common_profile_info_view_count').innerHTML = profile.count_views;
                    document.querySelector('#common_profile_info_following_count').innerHTML = profile.count_following;
                    document.querySelector('#common_profile_info_followers_count').innerHTML = profile.count_followed;
                    document.querySelector('#common_profile_info_likes_count').innerHTML = profile.count_likes;
                    document.querySelector('#common_profile_info_liked_count').innerHTML = profile.count_liked;
                }    
                if (COMMON_GLOBAL.user_account_id =='')
                    setTimeout(()=> {show_common_dialogue('LOGIN');}, 2000);
                else
                    checkOnline('common_profile_avatar_online_status', profile.id);
                return callBack(null,{profile_id: profile.id,
                                      private: profile.private});   
            }
        });
    }
};
const profile_close = () => {
    document.querySelector('#common_dialogue_profile').style.visibility = 'hidden';
    dialogue_profile_clear();
};
const profile_update_stat = async (callBack) => {
    const profile_id = document.querySelector('#common_profile_id');
    const json_data ={  
                        client_latitude:    COMMON_GLOBAL.client_latitude,
                        client_longitude:   COMMON_GLOBAL.client_longitude
                    };
    //get updated stat for given user
    //to avoid update in stat set searched by same user
    FFB ('DB_API', `/user_account/profile/id?POST_ID=${profile_id.innerHTML}&id=${profile_id.innerHTML}`, 'POST', 'DATA', json_data, (err, result) => {
        if (err)
            return callBack(err,null);
        else{
            const json = JSON.parse(result);
            document.querySelector('#common_profile_info_view_count').innerHTML = json.count_views;
            document.querySelector('#common_profile_info_following_count').innerHTML = json.count_following;
            document.querySelector('#common_profile_info_followers_count').innerHTML = json.count_followed;
            document.querySelector('#common_profile_info_likes_count').innerHTML = json.count_likes;
            document.querySelector('#common_profile_info_liked_count').innerHTML = json.count_liked;
            return callBack(null, {id : json.id});
        }
    });
};
const search_input = (event, module, event_function) => {
    switch (event.code){
        case 'ArrowLeft':
        case 'ArrowRight':{
            break;
        }
        case 'ArrowUp':
        case 'ArrowDown':{
            if (document.querySelector(`#common_${module}_search_list`).style.display=='inline-block'){
                const rows = document.querySelectorAll(`.common_${module}_search_list_row`);
                const focus_item = (element) =>{
                    element.focus();
                    document.querySelector(`#common_${module}_search_input`).focus();
                };
                let i=0;
                for (const row of rows) {
                    if (row.classList.contains(`common_${module}_search_list_selected`))
                        //if up and first or
                        //if down and last
                        if ((event.code=='ArrowUp' && i == 0)||
                            (event.code=='ArrowDown' && i == rows.length -1)){
                            if(event.code=='ArrowUp'){
                                //if the first, set the last
                                row.classList.remove (`common_${module}_search_list_selected`);
                                rows[rows.length -1].classList.add (`common_${module}_search_list_selected`);
                                focus_item(rows[rows.length -1]);
                            }
                            else{
                                //down
                                //if the last, set the first
                                row.classList.remove (`common_${module}_search_list_selected`);
                                rows[0].classList.add (`common_${module}_search_list_selected`);
                                focus_item(rows[0]);
                            }
                            return;
                        }
                        else{
                            if(event.code=='ArrowUp'){
                                //remove highlight, highlight previous
                                row.classList.remove (`common_${module}_search_list_selected`);
                                rows[i-1].classList.add (`common_${module}_search_list_selected`);
                                focus_item(rows[i-1]);
                            }
                            else{
                                //down
                                //remove highlight, highlight next
                                row.classList.remove (`common_${module}_search_list_selected`);
                                rows[i+1].classList.add (`common_${module}_search_list_selected`);
                                focus_item(rows[i+1]);
                            }
                            return;
                        }
                    i++;
                }
                //no highlight found, highlight first
                rows[0].classList.add (`common_${module}_search_list_selected`);
                focus_item(rows[0]);
                return;
            }
            break;
        }
        case 'Enter':{
            //enter
            if (document.querySelector(`#common_${module}_search_list`).style.display=='inline-block'){
                const x = document.querySelectorAll(`.common_${module}_search_list_row`);
                for (let i = 0; i <= x.length -1; i++) {
                    if (x[i].classList.contains(`common_${module}_search_list_selected`)){
                        /*Show profile and leave searchresult so user can go back to searchresult again*/
                        if (event_function ==null){
                            if (module=='profile')
                                profile_show(x[i].children[0].children[0].innerHTML,null,()=>{});
                            else{
                                map_show_search_on_map(x[i]);
                            }
                        }
                        else{
                            if (module=='profile')
                                event_function(x[i].children[0].children[0].innerHTML);
                            else
                                event_function(x[i]);
                        }
                            
                        x[i].classList.remove (`common_${module}_search_list_selected`);
                    }
                }
                return;
            }
            break;
        }
        default:{
            if (module=='profile')
                typewatch(search_profile, event_function==null?null:event_function); 
            else{
                typewatch(worldcities_search, event_function==null?null:event_function); 
            }
            break;
        }            
    }
};
/*-----------------------
  USER                   
  
  local objects:
  user_account_app_delete
  user_forgot
  user_preference_save
  user_preference_get
  user_preferences_set_default_globals
  user_preferences_update_select

  ----------------------- */
const user_login = async (username, password, callBack) => {
    if (check_input(username) == false || check_input(password)== false)
        return callBack('ERROR', null);

    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, COMMON_GLOBAL.common_app_id);
        return callBack('ERROR', null);
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, COMMON_GLOBAL.common_app_id);
        return callBack('ERROR', null);
    }
    // ES6 object spread operator for user variables
    const json_data = { username:  encodeURI(username),
                        password:  encodeURI(password),
                        ...get_uservariables()
                    };

    FFB ('IAM', '/user?', 'POST', 'IAM', json_data, (err, result) => {
        if (err)
            return callBack(err, null);
        else{
            profile_close();
            const user = JSON.parse(result).items[0];
            COMMON_GLOBAL.user_account_id = user.id;
            COMMON_GLOBAL.user_identity_provider_id = '';
            COMMON_GLOBAL.user_app_role_id = user.app_role_id;
            COMMON_GLOBAL.rest_at	= JSON.parse(result).accessToken;
            updateOnlineStatus();
            user_preference_get(() =>{
                if (user.active==0){
                    const function_cancel_event = () => { dialogue_verify_clear();
                                                          exception(COMMON_GLOBAL.exception_app_function, null);
                                                        };
                    show_common_dialogue('VERIFY', 'LOGIN', user.email, ICONS.app_logoff, function_cancel_event);
                    return callBack('ERROR', null);
                }
                else{
                    dialogue_login_clear();
                    dialogue_signup_clear();
                    return callBack(null, { user_id: user.id,
                                            username: user.username,
                                            bio: user.bio,
                                            avatar: user.avatar,
                                            app: JSON.parse(result).app});
                }
            });
        }
    });    
};
const user_logoff = async () => {
    //remove access token
    COMMON_GLOBAL.rest_at ='';
    COMMON_GLOBAL.user_account_id = '';
    
    set_avatar(null, document.querySelector('#common_user_menu_avatar_img')); 
    //clear logged in info
    document.querySelector('#common_user_menu_username').innerHTML = '';
    document.querySelector('#common_user_menu_username').style.display = 'none';
    document.querySelector('#common_user_menu_logged_in').style.display = 'none';
    document.querySelector('#common_user_menu_logged_out').style.display = 'inline-block';
    document.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'none';
    document.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'inline-block';

    updateOnlineStatus();
    document.querySelector('#common_profile_avatar_online_status').className='';
    dialogue_user_edit_clear();
    dialogue_verify_clear();
    dialogue_password_new_clear();
    dialogue_login_clear();
    dialogue_signup_clear();
    dialogue_forgot_clear();
    document.querySelector('#common_dialogue_profile').style.visibility = 'hidden';
    dialogue_profile_clear();
    user_preferences_set_default_globals('LOCALE');
    user_preferences_set_default_globals('TIMEZONE');
    user_preferences_set_default_globals('DIRECTION');
    user_preferences_set_default_globals('ARABIC_SCRIPT');
    user_preferences_update_select();
};
const user_edit = async () => {
    //get user from REST API
    FFB ('DB_API', `/user_account?user_account_id=${COMMON_GLOBAL.user_account_id}`, 'GET', 'ACCESS', null, (err, result) => {
        if (err)
            null;
        else{
            const user = JSON.parse(result);
            if (COMMON_GLOBAL.user_account_id == user.id) {
                document.querySelector('#common_user_edit_local').style.display = 'none';
                document.querySelector('#common_user_edit_provider').style.display = 'none';
                document.querySelector('#common_dialogue_user_edit').style.visibility = 'visible';

                document.querySelector('#common_user_edit_checkbox_profile_private').checked = Number(user.private);
                document.querySelector('#common_user_edit_input_username').value = user.username;
                document.querySelector('#common_user_edit_input_bio').value = get_null_or_value(user.bio);

                if (user.provider_id == null) {
                    document.querySelector('#common_user_edit_local').style.display = 'block';
                    document.querySelector('#common_user_edit_provider').style.display = 'none';

                    //display fetched avatar editable
                    document.querySelector('#common_user_edit_avatar').style.display = 'block';
                    set_avatar(user.avatar, document.querySelector('#common_user_edit_avatar_img')); 
                    document.querySelector('#common_user_edit_input_email').innerHTML = user.email;
                    document.querySelector('#common_user_edit_input_new_email').value = user.email_unverified;
                    document.querySelector('#common_user_edit_input_password').value = '',
                        document.querySelector('#common_user_edit_input_password_confirm').value = '',
                        document.querySelector('#common_user_edit_input_password_new').value = '';
                    document.querySelector('#common_user_edit_input_password_new_confirm').value = '';

                    document.querySelector('#common_user_edit_input_password_reminder').value = user.password_reminder;
                } else{
                        document.querySelector('#common_user_edit_local').style.display = 'none';
                        document.querySelector('#common_user_edit_provider').style.display = 'block';
                        document.querySelector('#common_user_edit_provider_id').innerHTML = user.identity_provider_id;
                        document.querySelector('#common_user_edit_label_provider_id_data').innerHTML = user.provider_id;
                        document.querySelector('#common_user_edit_label_provider_name_data').innerHTML = user.provider_first_name + ' ' + user.provider_last_name;
                        document.querySelector('#common_user_edit_label_provider_email_data').innerHTML = user.provider_email;
                        document.querySelector('#common_user_edit_label_provider_image_url_data').innerHTML = user.provider_image_url;
                        document.querySelector('#common_user_edit_avatar').style.display = 'none';
                        set_avatar(user.provider_image, document.querySelector('#common_user_edit_avatar_img')); 
                    } 
                document.querySelector('#common_user_edit_label_data_last_logontime').innerHTML = format_json_date(user.last_logontime, null);
                document.querySelector('#common_user_edit_label_data_account_created').innerHTML = format_json_date(user.date_created, null);
                document.querySelector('#common_user_edit_label_data_account_modified').innerHTML = format_json_date(user.date_modified, null);
                set_avatar(user.avatar ?? user.provider_image, document.querySelector('#common_user_menu_avatar_img'));
            } else {
                //User not found
                show_message('ERROR', 20305, null, null, COMMON_GLOBAL.common_app_id);
            }
        }
    });
};
const user_update = async () => {
    const username = document.querySelector('#common_user_edit_input_username').value;
    const bio = document.querySelector('#common_user_edit_input_bio').value;
    const avatar = document.querySelector('#common_user_edit_avatar_img').src;
    const new_email = document.querySelector('#common_user_edit_input_new_email').value;

    let path;
    let json_data;

    if (check_input(bio, 150) == false)
        return null;
        
    if (document.querySelector('#common_user_edit_local').style.display == 'block') {
        const email = document.querySelector('#common_user_edit_input_email').innerHTML;    
        const password = document.querySelector('#common_user_edit_input_password').value;
        const password_confirm = document.querySelector('#common_user_edit_input_password_confirm').value;
        const password_new = document.querySelector('#common_user_edit_input_password_new').value;
        const password_new_confirm = document.querySelector('#common_user_edit_input_password_new_confirm').value;
        const password_reminder = document.querySelector('#common_user_edit_input_password_reminder').value;
        if (check_input(username) == false ||
            check_input(new_email) == false ||
            check_input(password) == false ||
            check_input(password_confirm) == false ||
            check_input(password_new) == false ||
            check_input(password_new_confirm) == false ||
            check_input(password_reminder) == false)
            return null;

        dialogue_user_edit_remove_error();
    
        //validate input
        if (username == '') {
            //"Please enter username"
            document.querySelector('#common_user_edit_input_username').classList.add('common_input_error');
            show_message('ERROR', 20303, null, null);
            return null;
        }
        if (password == '') {
            //"Please enter password"
            document.querySelector('#common_user_edit_input_password').classList.add('common_input_error');
            show_message('ERROR', 20304, null, null, COMMON_GLOBAL.common_app_id);
            return null;
        }
        if (password != password_confirm) {
            //Password not the same
            document.querySelector('#common_user_edit_input_password_confirm').classList.add('common_input_error');
            show_message('ERROR', 20301, null, null, COMMON_GLOBAL.common_app_id);
            return null;
        }
        //check new passwords
        if (password_new != password_new_confirm) {
            //New Password are entered but they are not the same
            document.querySelector('#common_user_edit_input_password_new').classList.add('common_input_error');
            document.querySelector('#common_user_edit_input_password_new_confirm').classList.add('common_input_error');
            show_message('ERROR', 20301, null, null);
            return null;
        }
        json_data = {   username:           username,
                        bio:                bio,
                        private:            Number(document.querySelector('#common_user_edit_checkbox_profile_private').checked),
                        password:           password,
                        password_new:       password_new,
                        password_reminder:  password_reminder,
                        email:              email,
                        new_email:          new_email==''?null:new_email,
                        avatar:             avatar,
                        ...get_uservariables()
                    };
        path = `/user_account?PUT_ID=${COMMON_GLOBAL.user_account_id}`;
    } else {
        json_data = {   provider_id:    document.querySelector('#common_user_edit_provider_id').innerHTML,
                        username:       username,
                        bio:            bio,
                        private:        Number(document.querySelector('#common_user_edit_checkbox_profile_private').checked)
                    };
        path = `/user_account/common?PUT_ID=${COMMON_GLOBAL.user_account_id}`;
    }
    const old_button = document.querySelector('#common_user_edit_btn_user_update').innerHTML;
    document.querySelector('#common_user_edit_btn_user_update').innerHTML = APP_SPINNER;
    //update user using REST API
    FFB ('DB_API', path, 'PUT', 'ACCESS', json_data, (err, result) => {
        document.querySelector('#common_user_edit_btn_user_update').innerHTML = old_button;
        if (err){    
            return null;
        }
        else{
            const user_update = JSON.parse(result);
            set_avatar(avatar, document.querySelector('#common_user_menu_avatar_img'));
            document.querySelector('#common_user_menu_username').innerHTML = username;
            if (user_update.sent_change_email == 1){
                const function_cancel_event = () => { document.querySelector('#common_dialogue_user_verify').style.visibility='hidden';};
                show_common_dialogue('VERIFY', 'NEW_EMAIL', new_email, ICONS.app_cancel, function_cancel_event);
            }
            else
                dialogue_user_edit_clear();
            return null;
        }
    });
};
const user_signup = () => {
    const username = document.querySelector('#common_signup_username').value;
    const email = document.querySelector('#common_signup_email').value;
    const password = document.querySelector('#common_signup_password').value;
    const password_confirm = document.querySelector('#common_signup_password_confirm').value;
    const password_reminder = document.querySelector('#common_signup_password_reminder').value;

    if (check_input(username) == false || 
        check_input(email)== false ||
        check_input(password)== false ||
        check_input(password_confirm)== false ||
        check_input(password_reminder)== false)
        return null;

    const json_data = { username:           username,
                        password:           password,
                        password_reminder:  password_reminder,
                        email:              email,
                        active:             0,
                        ...get_uservariables()
                     };
    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, COMMON_GLOBAL.common_app_id);
        return null;
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, COMMON_GLOBAL.common_app_id);
        return null;
    }
    if (password != password_confirm) {
        //Password not the same
        show_message('ERROR', 20301, null, null, COMMON_GLOBAL.common_app_id);
        return null;
    }

    const old_button = document.querySelector('#common_signup_button').innerHTML;
    document.querySelector('#common_signup_button').innerHTML = APP_SPINNER;
    FFB ('DB_API', '/user_account/signup?', 'POST', 'DATA_SIGNUP', json_data, (err, result) => {
        document.querySelector('#common_signup_button').innerHTML = old_button;
        if (err){    
            null;
        }
        else{
            const json = JSON.parse(result);
            COMMON_GLOBAL.rest_at = json.accessToken;
            COMMON_GLOBAL.user_account_id = json.id;
            const function_cancel_event = () => { dialogue_verify_clear();
                                                  exception(COMMON_GLOBAL.exception_app_function, null);
                                                };
            show_common_dialogue('VERIFY', 'SIGNUP', email, ICONS.app_logoff, function_cancel_event);
        }
    });
};
const user_verify_check_input = async (item, nextField, callBack) => {

    let json_data;
    const verification_type = parseInt(document.querySelector('#common_user_verification_type').innerHTML);
    //only accept 0-9
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(document.querySelector('#' + item.id).value) > -1)
        if (nextField == '' || (document.querySelector('#common_user_verify_verification_char1').value != '' &
                document.querySelector('#common_user_verify_verification_char2').value != '' &
                document.querySelector('#common_user_verify_verification_char3').value != '' &
                document.querySelector('#common_user_verify_verification_char4').value != '' &
                document.querySelector('#common_user_verify_verification_char5').value != '' &
                document.querySelector('#common_user_verify_verification_char6').value != '')) {
            //last field, validate entered code
            const verification_code = parseInt(document.querySelector('#common_user_verify_verification_char1').value +
                document.querySelector('#common_user_verify_verification_char2').value +
                document.querySelector('#common_user_verify_verification_char3').value +
                document.querySelector('#common_user_verify_verification_char4').value +
                document.querySelector('#common_user_verify_verification_char5').value +
                document.querySelector('#common_user_verify_verification_char6').value);
            const old_button = document.querySelector('#common_user_verify_email').innerHTML;
            document.querySelector('#common_user_verify_email').innerHTML = APP_SPINNER;
            document.querySelector('#common_user_verify_verification_char1').classList.remove('common_input_error');
            document.querySelector('#common_user_verify_verification_char2').classList.remove('common_input_error');
            document.querySelector('#common_user_verify_verification_char3').classList.remove('common_input_error');
            document.querySelector('#common_user_verify_verification_char4').classList.remove('common_input_error');
            document.querySelector('#common_user_verify_verification_char5').classList.remove('common_input_error');
            document.querySelector('#common_user_verify_verification_char6').classList.remove('common_input_error');

            //activate user
            json_data = {   verification_code:  verification_code,
                            verification_type:  verification_type,
                            ...get_uservariables()
                        };
            FFB ('DB_API', `/user_account/activate?PUT_ID=${COMMON_GLOBAL.user_account_id}`, 'PUT', 'DATA', json_data, (err, result) => {
                document.querySelector('#common_user_verify_email').innerHTML = old_button;
                if (err){    
                    return callBack(err, null);
                }
                else{
                    const user_activate = JSON.parse(result).items[0];
                    if (user_activate.affectedRows == 1) {
                        switch (verification_type){
                            case 1:{
                                //LOGIN
                                break;
                            }
                            case 2:{
                                //SIGNUP
                                //login with username and password from signup fields
                                document.querySelector('#common_login_username').value =
                                    document.querySelector('#common_signup_username').value;
                                document.querySelector('#common_login_password').value =
                                    document.querySelector('#common_signup_password').value;
                                break;
                            }
                            case 3:{
                                //FORGOT
                                COMMON_GLOBAL.rest_at	= JSON.parse(result).accessToken;
                                //show dialogue new password
                                show_common_dialogue('PASSWORD_NEW', null, JSON.parse(result).auth);
                                break;
                            }
                            case 4:{
                                //NEW EMAIL
                                break;
                            }
                        }
                        
                        document.querySelector('#common_dialogue_login').style.visibility = 'hidden';
                        
                        dialogue_signup_clear();
                        dialogue_forgot_clear();
                        dialogue_verify_clear();
                        dialogue_user_edit_clear();
                        return callBack(null, {'actived': 1, 
                                                'verification_type' : verification_type});

                        } else {
                            document.querySelector('#common_user_verify_verification_char1').classList.add('common_input_error');
                            document.querySelector('#common_user_verify_verification_char2').classList.add('common_input_error');
                            document.querySelector('#common_user_verify_verification_char3').classList.add('common_input_error');
                            document.querySelector('#common_user_verify_verification_char4').classList.add('common_input_error');
                            document.querySelector('#common_user_verify_verification_char5').classList.add('common_input_error');
                            document.querySelector('#common_user_verify_verification_char6').classList.add('common_input_error');
                            //code not valid
                            show_message('ERROR', 20306, null, null, COMMON_GLOBAL.common_app_id);
                            return callBack('ERROR', null);
                        }
                }
            });
        } else{
            //not last, next!
            document.querySelector('#' + nextField).focus();
            return callBack(null, null);
        }
    else{
        //remove anything else than 0-9
        document.querySelector('#' + item.id).value = '';
        return callBack(null, null);
    }
};
const user_delete = async (choice=null, user_local, function_delete_event, callBack ) => {
    const password = document.querySelector('#common_user_edit_input_password').value;
    switch (choice){
        case null:{
            if (user_local==true && password == '') {
                //"Please enter password"
                document.querySelector('#common_user_edit_input_password').classList.add('common_input_error');
                show_message('ERROR', 20304, null, null, COMMON_GLOBAL.common_app_id);
                return null;
            }
            show_message('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL.app_id);
            return callBack('CONFIRM',null);
        }
        case 1:{
            document.querySelector('#common_dialogue_message').style.visibility = 'hidden';
            dialogue_user_edit_remove_error();
    
            const old_button = document.querySelector('#common_user_edit_btn_user_delete_account').innerHTML;
            document.querySelector('#common_user_edit_btn_user_delete_account').innerHTML = APP_SPINNER;
            const json_data = { password: password};

            FFB ('DB_API', `/user_account/${COMMON_GLOBAL.user_account_id}?`, 'DELETE', 'ACCESS', json_data, (err) => {
                document.querySelector('#common_user_edit_btn_user_delete_account').innerHTML = old_button;
                if (err){
                    return callBack(err,null);
                }
                else{
                    return callBack(null,{deleted: 1});
                }
            });
            break;
        }
        default:
            break;
    }
};
const user_function = (user_function, callBack) => {
    const user_id_profile = document.querySelector('#common_profile_id').innerHTML;
    let method;
    let path;
    const json_data = { user_account_id: user_id_profile};
    const check_div = document.querySelector(`#common_profile_${user_function.toLowerCase()}`);
    if (check_div.children[0].style.display == 'block') {
        path = `/user_account_${user_function.toLowerCase()}?POST_ID=${COMMON_GLOBAL.user_account_id}`;
        method = 'POST';
    } else {
        path = `/user_account_${user_function.toLowerCase()}?DELETE_ID=${COMMON_GLOBAL.user_account_id}`;
        method = 'DELETE';
    }
    if (COMMON_GLOBAL.user_account_id == '')
        show_common_dialogue('LOGIN');
    else {
        FFB ('DB_API', path, method, 'ACCESS', json_data, (err) => {
            if (err)
                return callBack(err, null);
            else{
                if (document.querySelector(`#common_profile_${user_function.toLowerCase()}`).children[0].style.display == 'block'){
                    //follow/like
                    document.querySelector(`#common_profile_${user_function.toLowerCase()}`).children[0].style.display = 'none';
                    document.querySelector(`#common_profile_${user_function.toLowerCase()}`).children[1].style.display = 'block';
                }
                else{
                    //unfollow/unlike
                    document.querySelector(`#common_profile_${user_function.toLowerCase()}`).children[0].style.display = 'block';
                    document.querySelector(`#common_profile_${user_function.toLowerCase()}`).children[1].style.display = 'none';
                }
                return callBack(null, {});
            }
        });
    }
};
const user_account_app_delete = (choice=null, user_account_id, app_id, function_delete_event) => {
    switch (choice){
        case null:{
            show_message('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL.app_id);
            break;
        }
        case 1:{
            document.querySelector('#common_dialogue_message').style.visibility = 'hidden';
            FFB ('DB_API', `/user_account_app/${user_account_id}/${app_id}?`, 'DELETE', 'ACCESS', null, (err) => {
                if (err)
                    null;
                else{
                    //execute event and refresh app list
                    document.querySelector('#common_profile_main_btn_cloud').click();
                }
            });
            break;
        }
        default:
            break;
    }
};
const user_forgot = async () => {
    const email = document.querySelector('#common_forgot_email').value;
    const json_data = { email: email,
                        ...get_uservariables()
                    };
    if (check_input(email) == false || email =='')
        return;
    else{
        const old_button = document.querySelector('#common_forgot_button').innerHTML;
        document.querySelector('#common_forgot_button').innerHTML = APP_SPINNER;
        FFB ('DB_API', '/user_account/forgot?', 'PUT', 'DATA', json_data, (err, result) => {
            document.querySelector('#common_forgot_button').innerHTML = old_button;
            if (err)
                null;
            else{
                const json = JSON.parse(result);
                if (json.sent == 1){
                    COMMON_GLOBAL.user_account_id = json.id;
                    const function_cancel_event = () => { document.querySelector('#common_dialogue_user_verify').style.visibility='hidden';};
                    show_common_dialogue('VERIFY', 'FORGOT', email, ICONS.app_cancel, function_cancel_event);
                }
            }
        });
    }
};
const updatePassword = () => {
    const password_new = document.querySelector('#common_user_password_new').value;
    const password_new_confirm = document.querySelector('#common_user_password_new_confirm').value;
    const user_password_new_auth = document.querySelector('#common_user_password_new_auth').innerHTML;
    const json_data = { password_new:   password_new,
                        auth:           user_password_new_auth,
                        ...get_uservariables()
                     };
    if (check_input(password_new) == false ||
        check_input(password_new_confirm) == false)
        return;
    else{
        if (password_new == '') {
            //"Please enter password"
            document.querySelector('#common_user_password_new').classList.add('common_input_error');
            show_message('ERROR', 20304, null, null, COMMON_GLOBAL.common_app_id);
            return null;
        }
        if (password_new != password_new_confirm) {
            //Password not the same
            show_message('ERROR', 20301, null, null, COMMON_GLOBAL.common_app_id);
            return null;
        }
        const old_button = document.querySelector('#common_user_password_new_icon').innerHTML;
        document.querySelector('#common_user_password_new_icon').innerHTML = APP_SPINNER;
        FFB ('DB_API', `/user_account/password?PUT_ID=${COMMON_GLOBAL.user_account_id}`, 'PUT', 'ACCESS', json_data, (err) => {
            document.querySelector('#common_user_password_new_icon').innerHTML = old_button;
            if (err)
                null;
            else{
                dialogue_password_new_clear();
                show_common_dialogue('LOGIN');
            }
        });
    }
};
const user_preference_save = async () => {
    if (COMMON_GLOBAL.user_preference_save==true && COMMON_GLOBAL.user_account_id != ''){
        const json_data =
            {  
                preference_locale: document.querySelector('#common_user_locale_select').value,
                app_setting_preference_timezone_id: document.querySelector('#common_user_timezone_select').options[document.querySelector('#common_user_timezone_select').selectedIndex].id,
                app_setting_preference_direction_id: document.querySelector('#common_user_direction_select').options[document.querySelector('#common_user_direction_select').selectedIndex].id,
                app_setting_preference_arabic_script_id: document.querySelector('#common_user_arabic_script_select').options[document.querySelector('#common_user_arabic_script_select').selectedIndex].id
            };
        await FFB ('DB_API', `/user_account_app?PATCH_ID=${COMMON_GLOBAL.user_account_id}`, 'PATCH', 'ACCESS', json_data, (err) => {
            if (err)
                null;
            else{
                null;
            }
        });
    }
        
};
const user_preference_get = async (callBack) => {
    await FFB ('DB_API', `/user_account_app?user_account_id=${COMMON_GLOBAL.user_account_id}`, 'GET', 'ACCESS', null, (err, result) => {
        if (err)
            null;
        else{
            const user_account_app = JSON.parse(result)[0];
            //locale
            if (user_account_app.preference_locale==null){
                user_preferences_set_default_globals('LOCALE');
            }
            else{
                COMMON_GLOBAL.user_locale = user_account_app.preference_locale;
            }
            //timezone
            if (user_account_app.app_setting_preference_timezone_id==null){
                user_preferences_set_default_globals('TIMEZONE');
            }
            else{
                SearchAndSetSelectedIndex(user_account_app.app_setting_preference_timezone_id, document.querySelector('#common_user_timezone_select'), 0);
                COMMON_GLOBAL.user_timezone = document.querySelector('#common_user_timezone_select').value;
            }
            //direction
            SearchAndSetSelectedIndex(user_account_app.app_setting_preference_direction_id, document.querySelector('#common_user_direction_select'), 0);
            COMMON_GLOBAL.user_direction = document.querySelector('#common_user_direction_select').value;
            //arabic script
            SearchAndSetSelectedIndex(user_account_app.app_setting_preference_arabic_script_id, document.querySelector('#common_user_arabic_script_select'), 0);
            COMMON_GLOBAL.user_arabic_script = document.querySelector('#common_user_arabic_script_select').value;
            user_preferences_update_select();
            return callBack(null, null);
        }
    });
};
const user_preferences_set_default_globals = (preference) => {
    switch (preference){
        case 'LOCALE':{
            COMMON_GLOBAL.user_locale         = navigator.language.toLowerCase();
            break;
        }
        case 'TIMEZONE':{
            COMMON_GLOBAL.user_timezone       = COMMON_GLOBAL.client_timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
            break;
        }
        case 'DIRECTION':{
            COMMON_GLOBAL.user_direction      = '';
            break;
        }
        case 'ARABIC_SCRIPT':{
            COMMON_GLOBAL.user_arabic_script  = '';
            break;
        }
    }
};
const user_preferences_update_select = () => {
    set_user_account_app_settings();
    //don't save changes now, just execute other code
    //or it would save preferences 4 times
    COMMON_GLOBAL.user_preference_save = false;
    document.querySelector('#common_user_locale_select').dispatchEvent(new Event('change'));
	document.querySelector('#common_user_timezone_select').dispatchEvent(new Event('change'));
	document.querySelector('#common_user_direction_select').dispatchEvent(new Event('change'));
	document.querySelector('#common_user_arabic_script_select').dispatchEvent(new Event('change'));
    COMMON_GLOBAL.user_preference_save = true;
};
/*----------------------- */
/* USER PROVIDER          */
/*----------------------- */
const ProviderUser_update = async (identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, callBack) => {
    convert_image(profile_image_url, 
                  COMMON_GLOBAL.image_avatar_width,
                  COMMON_GLOBAL.image_avatar_height).then((profile_image)=>{
        const json_data ={  username:               null,
                            password:               null,
                            active:                 1,
                            identity_provider_id:   identity_provider_id,
                            provider_id:            profile_id,
                            provider_first_name:    profile_first_name,
                            provider_last_name:     profile_last_name,
                            provider_image:         window.btoa(profile_image),
                            provider_image_url:     profile_image_url,
                            provider_email:         profile_email,
                            ...get_uservariables()
                        };
        FFB ('IAM', `/provider?PUT_ID=${profile_id}`, 'POST', 'IAM', json_data, (err, result) => {
            if (err)
                return callBack(err, null);
            else{
                const user_login = JSON.parse(result).items[0];
                COMMON_GLOBAL.rest_at = JSON.parse(result).accessToken;
                COMMON_GLOBAL.user_account_id = user_login.id;
                COMMON_GLOBAL.user_identity_provider_id = user_login.identity_provider_id;
                updateOnlineStatus();
                user_preference_get(() =>{
                    dialogue_login_clear();
                    dialogue_signup_clear();
                    return callBack(null, {user_account_id: user_login.id,
                                            username: user_login.username,
                                            bio: user_login.bio,
                                            avatar: profile_image,
                                            first_name: profile_first_name,
                                            last_name: profile_last_name,
                                            userCreated: JSON.parse(result).userCreated});
                });
            }
        });
    });
};
const ProviderSignIn = async (provider_button, callBack) => {
    //add REST API to get user provider data
    return callBack(null, { identity_provider_id: provider_button.children[0].innerHTML,
                            profile_id: provider_button.children[0].innerHTML,
                            profile_first_name: `PROVIDER_USERNAME${provider_button.children[0].innerHTML}`,
                            profile_last_name: `PROVIDER LAST_NAME${provider_button.children[0].innerHTML}`,
                            profile_image_url: '',
                            profile_email: `PROVIDER_EMAIL${provider_button.children[0].innerHTML}@${location.hostname}`});
    
};
/*----------------------- */
/* MODULE EASY.QRCODE     */
/*----------------------- */
const create_qr = (div, url) => {
    import('easy.qrcode').then(({QRCode})=>{
        new QRCode(document.querySelector('#' + div), {
            text: url,
            width: COMMON_GLOBAL['module_easy.qrcode_width'],
            height: COMMON_GLOBAL['module_easy.qrcode_height'],
            colorDark: COMMON_GLOBAL['module_easy.qrcode_color_dark'],
            colorLight: COMMON_GLOBAL['module_easy.qrcode_color_light'],
            drawer: 'svg'
        });
    });
    
};
/*----------------------- */
/* MODULE LEAFLET         */
/*----------------------- */
const map_init = async (containervalue, stylevalue, longitude, latitude, click_event, doubleclick_event, search_event_function) => {
    return await new Promise((resolve)=>{
        if (checkconnected()) {
            import('leaflet').then(({L})=>{
                //save library in variable for optimization
                COMMON_GLOBAL.module_leaflet_library = L;
                COMMON_GLOBAL.module_leaflet_session_map = '';
                COMMON_GLOBAL.module_leaflet_session_map = COMMON_GLOBAL.module_leaflet_library.map(containervalue).setView([latitude, longitude], COMMON_GLOBAL.module_leaflet_zoom);
                map_setstyle(stylevalue).then(()=>{
                    //disable doubleclick in event dblclick since e.preventdefault() does not work
                    COMMON_GLOBAL.module_leaflet_session_map.doubleClickZoom.disable(); 
        
                    //add scale
                    //position values: 'topleft', 'topright', 'bottomleft' or 'bottomright'
                    COMMON_GLOBAL.module_leaflet_library.control.scale({position: 'topright'}).addTo(COMMON_GLOBAL.module_leaflet_session_map);

                    //add custom HTML inside div with class .leaflet-control
                    const mapcontrol = document.querySelectorAll(`#${containervalue} .leaflet-control`);
                    //add search button with expand content country select, city select and search input
                    mapcontrol[0].innerHTML +=  `<div id='common_module_leaflet_control_search' class='common_module_leaflet_control_button' href='#' title='Search' role='button'>${ICONS.app_search}
                                                    <div id='common_module_leaflet_control_expand_search' class='common_module_leaflet_control_expand'>
                                                        <select id='common_module_leaflet_select_country'>
                                                            ${COMMON_GLOBAL.module_leaflet_countries}
                                                        </select>
                                                        <select id='common_module_leaflet_select_city'  >
                                                            <option value='' id='' label='…' selected='selected'>…</option>
                                                        </select>
                                                        <div id='common_module_leaflet_search_input_row'>
                                                            <input id='common_module_leaflet_search_input' type='text' />
                                                            <div id='common_module_leaflet_search_icon'>${ICONS.app_search}</div>
                                                        </div>
                                                        <div id='common_module_leaflet_search_list_wrap'>
                                                        </div>
                                                    </div>
                                                 </div>`;
                    //add fullscreen button
                    mapcontrol[0].innerHTML +=  `<div id='common_module_leaflet_control_fullscreen_id' class='common_module_leaflet_control_button' href='#' title='Fullscreen' role='button'>${ICONS.app_fullscreen}
                                                 </div>`;
                    if (COMMON_GLOBAL.client_latitude!='' && COMMON_GLOBAL.client_longitude!=''){
                        //add my location button
                        mapcontrol[0].innerHTML += `<div id='common_module_leaflet_control_my_location_id' class='common_module_leaflet_control_button' href='#' title='My location' role='button'>${ICONS.map_my_location}
                                                    </div>`;
                    }
                    //add layers button with pop out div
                    let map_styles_options ='';
                    for (const map_style_option of COMMON_GLOBAL.module_leaflet_map_styles){
                        map_styles_options +=`<option id=${map_style_option.id} value='${map_style_option.data}'>${map_style_option.description}</option>`;
                    }
                    mapcontrol[0].innerHTML += `<div id='common_module_leaflet_control_layer' class='common_module_leaflet_control_button' href='#' title='Layer' role='button'>${ICONS.map_layer}
                                                    <div id='common_module_leaflet_control_expand_layer' class='common_module_leaflet_control_expand'>
                                                        <select id='common_module_leaflet_select_mapstyle' >
                                                            ${map_styles_options}
                                                        </select>
                                                    </div>
                                                </div>`;
                    SearchAndSetSelectedIndex(COMMON_GLOBAL.module_leaflet_style, document.querySelector('#common_module_leaflet_select_mapstyle'),1);

                    //add event on map countries
                    const select_country = document.querySelector('#common_module_leaflet_select_country');
                    select_country.addEventListener('change', () => { 
                        if (select_country[select_country.selectedIndex].getAttribute('country_code'))
                            map_city(select_country[select_country.selectedIndex].getAttribute('country_code').toUpperCase());
                        else{
                            map_toolbar_reset();
                        }
                            
                    }, false);
                    //add event on map cities
                    document.querySelector('#common_module_leaflet_select_city').addEventListener('change', () => {
                        const select_city = document.querySelector('#common_module_leaflet_select_city');
                        const longitude_selected = select_city[select_city.selectedIndex].getAttribute('longitude');
                        const latitude_selected = select_city[select_city.selectedIndex].getAttribute('latitude');
                        map_update( longitude_selected, 
                                    latitude_selected, 
                                    COMMON_GLOBAL.module_leaflet_zoom_city,
                                    select_city.options[select_city.selectedIndex].text, 
                                    null, 
                                    COMMON_GLOBAL.module_leaflet_marker_div_city,
                                    COMMON_GLOBAL.module_leaflet_flyto).then(()=> {
                            map_toolbar_reset();
                        });
                    }, false);
                    //add event on map layer select
                    document.querySelector('#common_module_leaflet_select_mapstyle').addEventListener('change', () => { map_setstyle(document.querySelector('#common_module_leaflet_select_mapstyle').value).then(()=>{null;}); }, false);
                    //add event on search
                    document.querySelector('#common_module_leaflet_search_input').addEventListener('keyup', (event) => { typewatch(search_input, event, 'module_leaflet', search_event_function); }, false);
                    document.querySelector('#common_module_leaflet_search_icon').addEventListener('click', () => { 
                        document.querySelector('#common_module_leaflet_search_input').focus();
                        document.querySelector('#common_module_leaflet_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                    }, false);
                    

                    if (click_event){
                        //add event delegation on map
                        document.querySelector(`#${containervalue}`).addEventListener('click', (event) =>{
                            map_click_event(event, containervalue);
                        });
                    }
                    if (doubleclick_event){
                        map_setevent('dblclick', (e) => {
                            if (e.originalEvent.target.id == 'mapid'){
                                const lng = e.latlng.lng;
                                const lat = e.latlng.lat;
                                //Update GPS position
                                get_place_from_gps(lng, lat).then((gps_place) => {
                                    map_update(lng,
                                                lat,
                                                '', //do not change zoom 
                                                gps_place,
                                                null,
                                                COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                                COMMON_GLOBAL.module_leaflet_jumpto);
                                });
                            }
                        });
                    }
                    resolve();
                });
            });
        }
        else
            resolve();
    });
    
};
const map_country = (lang_code) =>{
    return new Promise ((resolve, reject)=>{
        //country
        FFB ('DB_API', `/country?lang_code=${lang_code}`, 'GET', 'DATA', null, (err, result) => {
            if (err)
                reject(err,null);
            else{
                const countries = JSON.parse(result);
                let html='<option value=\'\' id=\'\' label=\'…\' selected=\'selected\'>…</option>';
                let current_group_name;
                let i=0;
                for (const country of countries){
                    if (i === 0){
                        html += `<optgroup label=${country.group_name} />`;
                        current_group_name = country.group_name;
                    }
                    else{
                        if (country.group_name !== current_group_name){
                            html += `<optgroup label=${country.group_name} />`;
                            current_group_name = country.group_name;
                        }
                        html +=
                        `<option value=${i}
                                id=${country.id} 
                                country_code=${country.country_code} 
                                flag_emoji=${country.flag_emoji} 
                                group_name=${country.group_name}>${country.flag_emoji} ${country.text}
                        </option>`;
                    }
                    i++;
                }
                COMMON_GLOBAL.module_leaflet_countries = html;
                if (document.querySelector('#common_module_leaflet_select_country')){
                    const select_country = document.querySelector('#common_module_leaflet_select_country');
                    const current_country = document.querySelector('#common_module_leaflet_select_country')[document.querySelector('#common_module_leaflet_select_country').selectedIndex].id;
                    select_country.innerHTML = html;
                    SearchAndSetSelectedIndex(current_country, document.querySelector('#common_module_leaflet_select_country'),0);    
                }
                resolve();
            }
        });
    });
    
};
const map_city = (country_code) =>{
    const select_cities = document.querySelector('#common_module_leaflet_select_city');
    //set default option
    select_cities.innerHTML='<option value=\'\' id=\'\' label=\'…\' selected=\'selected\'>…</option>';
    if (country_code!=null){
        get_cities(country_code, (err, cities)=>{
            if (err)
                null;
            else{
                //fetch list including default option
                select_cities.innerHTML = cities;
            }
        });
    }
};
const map_city_empty = () =>{
    //remove old city list:      
    const select_city = document.querySelector('#common_module_leaflet_select_city');
    const old_groups = select_city.querySelectorAll('optgroup');
    for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
        select_city.removeChild(old_groups[old_index]);
    //display first empty city
    select_city.selectedIndex = 0;
};
const map_toolbar_reset = ()=>{
    const select_country = document.querySelector('#common_module_leaflet_select_country');
    select_country.selectedIndex = 0;
    map_city_empty();
    document.querySelector('#common_module_leaflet_search_input').value ='';
    document.querySelector('#common_module_leaflet_search_list_wrap').innerHTML ='';
    if (document.querySelector('#common_module_leaflet_control_expand_search').style.display=='block')
        map_control_toggle_expand('search');
    if (document.querySelector('#common_module_leaflet_control_expand_layer').style.display=='block')
        map_control_toggle_expand('layer');
};
const map_show_search_on_map = (city)=>{
    
    const latitude =    city.querySelector('.common_module_leaflet_search_list_latitude').innerHTML;
    const longitude =   city.querySelector('.common_module_leaflet_search_list_longitude').innerHTML;
    const place =       city.querySelector('.common_module_leaflet_search_list_city a').innerHTML + ', ' +
                        city.querySelector('.common_module_leaflet_search_list_country a').innerHTML;
    map_update( longitude,
                latitude,
                COMMON_GLOBAL.module_leaflet_zoom_city,
                place,
                null,
                COMMON_GLOBAL.module_leaflet_marker_div_city,
                COMMON_GLOBAL.module_leaflet_jumpto);
    map_toolbar_reset();
};
const map_control_toggle_expand = (item) =>{
    let style_display;
    if (document.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display=='none' ||
        document.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display =='')
        style_display = 'block';
    else
        style_display = 'none';
    document.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display = style_display;
};
const map_click_event = (event, containervalue) =>{
    
    switch (event.target.id==''?event.target.parentNode.id:event.target.id){
        case 'common_module_leaflet_control_search':{
            if (document.querySelector('#common_module_leaflet_control_expand_layer').style.display=='block')
                map_control_toggle_expand('layer');
            map_control_toggle_expand('search');
            break;
        }
        case 'common_module_leaflet_control_fullscreen_id':{
            if (document.fullscreenElement)
                document.exitFullscreen();
            else
                document.querySelector('#' + containervalue).requestFullscreen();
            break;
        }
        case 'common_module_leaflet_control_my_location_id':{
            if (COMMON_GLOBAL.client_latitude!='' && COMMON_GLOBAL.client_longitude!=''){
                map_update( COMMON_GLOBAL.client_longitude,
                            COMMON_GLOBAL.client_latitude,
                            COMMON_GLOBAL.module_leaflet_zoom,
                            COMMON_GLOBAL.client_place,
                            null,
                            COMMON_GLOBAL.module_leaflet_marker_div_gps,
                            COMMON_GLOBAL.module_leaflet_jumpto);
                const select_country = document.querySelector('#common_module_leaflet_select_country');
                select_country.selectedIndex = 0;
                map_toolbar_reset();
            }
            break;
        }
        case 'common_module_leaflet_control_layer':{
            if (document.querySelector('#common_module_leaflet_control_expand_search').style.display=='block')
                map_toolbar_reset();
            map_control_toggle_expand('layer');
            break;
        }
        default:{
            if (event.target.classList.contains('leaflet-control-zoom-in') || event.target.parentNode.classList.contains('leaflet-control-zoom-in'))
                COMMON_GLOBAL.module_leaflet_session_map.setZoom(COMMON_GLOBAL.module_leaflet_session_map.getZoom() + 1);
            if (event.target.classList.contains('leaflet-control-zoom-out') || event.target.parentNode.classList.contains('leaflet-control-zoom-out'))
                COMMON_GLOBAL.module_leaflet_session_map.setZoom(COMMON_GLOBAL.module_leaflet_session_map.getZoom() - 1);
            break;
        }
    }
};
const map_resize = async () => {
    if (checkconnected()) {
        //fixes not rendering correct showing map div
        COMMON_GLOBAL.module_leaflet_session_map.invalidateSize();
    }
};
const map_line_removeall = () => {
    if(COMMON_GLOBAL.module_leaflet_session_map_layer)
        for (let i=0;i<COMMON_GLOBAL.module_leaflet_session_map_layer.length;i++)
            COMMON_GLOBAL.module_leaflet_session_map.removeLayer(COMMON_GLOBAL.module_leaflet_session_map_layer[i]);
            COMMON_GLOBAL.module_leaflet_session_map_layer=[];
};
const map_line_create = (id, title, text_size, from_longitude, from_latitude, to_longitude, to_latitude, color, width, opacity) => {
    if (checkconnected()) {
        const geojsonFeature = {
            'id': `"${id}"`,
            'type': 'Feature',
            'properties': { 'title': title },
            'geometry': {
                'type': 'LineString',
                    'coordinates': [
                        [from_longitude, from_latitude],
                        [to_longitude, to_latitude]
                    ]
            }
        };
        //use GeoJSON to draw a line
        const myStyle = {
            'color': color,
            'weight': width,
            'opacity': opacity
        };
        const layer = COMMON_GLOBAL.module_leaflet_library.geoJSON(geojsonFeature, {style: myStyle}).addTo(COMMON_GLOBAL.module_leaflet_session_map);
        if(!COMMON_GLOBAL.module_leaflet_session_map_layer)
            COMMON_GLOBAL.module_leaflet_session_map_layer=[];
            COMMON_GLOBAL.module_leaflet_session_map_layer.push(layer);
    }
};
const map_setevent = (event, function_event) => {
    if (checkconnected()) {
        //also creates event:
        //COMMON_GLOBAL.module_leaflet_library.DomEvent.addListener(COMMON_GLOBAL.module_leaflet_session_map, 'dblclick', function_event);
        COMMON_GLOBAL.module_leaflet_session_map.on(event, function_event);
    }
};
const map_setstyle = async (mapstyle) => {
    return await new Promise ((resolve) => {
        if (checkconnected()) {
            for (const map_style of COMMON_GLOBAL.module_leaflet_map_styles){
                if (map_style.session_map_layer)
                    COMMON_GLOBAL.module_leaflet_session_map.removeLayer(map_style.session_map_layer);
            }
            //mapstyle_record [{id, description, data, data2, data3, data4, data5, session_map_layer});
            const mapstyle_record = COMMON_GLOBAL.module_leaflet_map_styles.filter(map_style=>map_style.data==mapstyle)[0];
            if (mapstyle_record.data3)
                mapstyle_record.session_map_layer = COMMON_GLOBAL.module_leaflet_library.tileLayer(mapstyle_record.data2, {
                    maxZoom: mapstyle_record.data3,
                    attribution: mapstyle_record.data4
                }).addTo(COMMON_GLOBAL.module_leaflet_session_map);
            else
                mapstyle_record.session_map_layer = COMMON_GLOBAL.module_leaflet_library.tileLayer(mapstyle_record.data2, {
                    attribution: mapstyle_record.data4
                }).addTo(COMMON_GLOBAL.module_leaflet_session_map);
            resolve();
        }  
        else
            resolve();
    });
};
const map_update_popup = (title) => {
    document.querySelector('#common_module_leaflet_popup_title').innerHTML = title;
};
const map_update = async (longitude, latitude, zoomvalue, text_place, timezone_text = null, marker_id, to_method) => {
    const {getTimezone} = await import('regional');
    return new Promise((resolve)=> {
        if (checkconnected()) {
            const map_update_gps = (to_method, zoomvalue, longitude, latitude) => {
                switch (Number(to_method)){
                    case 0:{
                        if (zoomvalue == '')
                            COMMON_GLOBAL.module_leaflet_session_map.setView(new COMMON_GLOBAL.module_leaflet_library.LatLng(latitude, longitude));
                        else
                            COMMON_GLOBAL.module_leaflet_session_map.setView(new COMMON_GLOBAL.module_leaflet_library.LatLng(latitude, longitude), zoomvalue);
                        break;
                    }
                    case 1:{
                        COMMON_GLOBAL.module_leaflet_session_map.flyTo([latitude, longitude], COMMON_GLOBAL.module_leaflet_zoom);
                        break;
                    }
                    //also have COMMON_GLOBAL.module_leaflet_session_map.panTo(new COMMON_GLOBAL.module_leaflet_library.LatLng({lng: longitude, lat: latitude}));
                }
            };
            const map_update_text = (timezone_text) => {
                const popuptext = `<div id="common_module_leaflet_popup_title">${text_place}</div>
                                   <div id="common_module_leaflet_popup_sub_title">${ICONS.regional_timezone + ICONS.gps_position}</div>
                                   <div id="common_module_leaflet_popup_sub_title_timezone">${timezone_text}</div>
                                   <div id="common_module_leaflet_popup_sub_title_gps">${latitude + ', ' + longitude}</div>`;
                COMMON_GLOBAL.module_leaflet_library.popup({ offset: [0, COMMON_GLOBAL.module_leaflet_popup_offset], closeOnClick: false })
                            .setLatLng([latitude, longitude])
                            .setContent(popuptext)
                            .openOn(COMMON_GLOBAL.module_leaflet_session_map);
                const marker = COMMON_GLOBAL.module_leaflet_library.marker([latitude, longitude]).addTo(COMMON_GLOBAL.module_leaflet_session_map);
                //setting id so apps can customize if necessary
                marker._icon.id = marker_id;
                resolve(timezone_text);
            };
            map_update_gps(to_method, zoomvalue, longitude, latitude);
            if (timezone_text == null)
                map_update_text(getTimezone(latitude, longitude));
            else{
                map_update_text(timezone_text);
            }
        }
    });
};
/*----------------------- */
/* FFB                    */
/*----------------------- */
const FFB = async (service, path, method, authorization_type, json_data, callBack) => {
    let status;
    let authorization;
    let bff_path;
    switch (authorization_type){
        case 'DATA':{
            //data token authorization check
            authorization = `Bearer ${COMMON_GLOBAL.rest_dt}`;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/data`;
            break;
        }
        case 'IAM':{
            //user,admin or system admin login
            authorization = `Basic ${window.btoa(json_data.username + ':' + json_data.password)}`;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/iam`;
            break;
        }
        case 'DATA_SIGNUP':{
            //data token signup authorization check
            authorization = `Bearer ${COMMON_GLOBAL.rest_dt}`;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/data_signup`;
            break;
        }
        case 'ACCESS':{
            //user or admins authorization
            authorization = `Bearer ${COMMON_GLOBAL.rest_at}`;
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.common_app_id)
                bff_path = `${COMMON_GLOBAL.rest_resource_bff}/admin`;
            else
                bff_path = `${COMMON_GLOBAL.rest_resource_bff}/access`;
            break;
        }
        case 'SUPERADMIN':{
            // super admin authorization
            authorization = `Bearer ${COMMON_GLOBAL.rest_at}`;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/superadmin`;
            break;
        }
        case 'SYSTEMADMIN':{
            //systemadmin authorization
            authorization = `Bearer ${COMMON_GLOBAL.rest_admin_at}`;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/systemadmin`;
            break;
        }
        case 'SOCKET':{
            //broadcast connect authorization
            authorization = `Bearer ${COMMON_GLOBAL.rest_dt}`;
            //use query to send authorization since EventSource does not support headers
            path += `&authorization=${authorization}`;
            json_data = null;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/socket`;
            break;
        }
    }
    let options = {};
    if (json_data ==null)
        options = {
                    method: method,
                    headers: {
                                Authorization: authorization
                            },
                    body: null
                };
    else
        options = {
                method: method,
                headers: {
                            'Content-Type': 'application/json',
                            Authorization: authorization
                        },
                body: JSON.stringify(json_data)
            };
    path += `&lang_code=${COMMON_GLOBAL.user_locale}`;
    const encodedparameters = toBase64(path);
    let url = `${bff_path}?service=${service}&app_id=${COMMON_GLOBAL.app_id}&parameters=${encodedparameters}`;
    url += `&user_account_logon_user_account_id=${COMMON_GLOBAL.user_account_id}`;
    if (service=='SOCKET' && authorization_type=='SOCKET'){
        callBack(null, new EventSource(url));
    }
    else
        await fetch(url, options)
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
                    show_message('INFO', null,null, result, COMMON_GLOBAL.app_id);
                    callBack(result, null);
                    break;
                }
                case 404:{
                    //Not found
                    show_message('INFO', null,null, result, COMMON_GLOBAL.app_id);
                    callBack(result, null);
                    break;
                }
                case 401:{
                    //Unauthorized, token expired
                    exception(COMMON_GLOBAL.exception_app_function, result);
                    callBack(result, null);
                    break;
                }
                case 403:{
                    //Forbidden, not allowed to login or register new user
                    show_message('INFO', null,null, JSON.parse(result).message, COMMON_GLOBAL.app_id);
                    callBack(result, null);
                    break;
                }
                case 500:{
                    //Unknown error
                    exception(COMMON_GLOBAL.exception_app_function, result);
                    callBack(result, null);
                    break;
                }
                case 503:{
                    //Service unavailable or other error in microservice
                    exception(COMMON_GLOBAL.exception_app_function, result);
                    callBack(result, null);
                    break;
                }
            }
        })
        .catch(error=>{
            callBack(error, null);
        });
};
/*----------------------- 
  SERVICE SOCKET      

  local objects:
  broadcast_init
  maintenance_countdown
  show_broadcast_info
  reconnect
  checkOnline
  ----------------------- */
const broadcast_init = () => {
    //broadcast
    document.querySelector('#common_broadcast_close').innerHTML = ICONS.app_broadcast_close;
    document.querySelector('#common_broadcast_info_title').innerHTML = ICONS.app_alert;
    connectOnline();
};
const maintenance_countdown = (remaining) => {
    if(remaining <= 0)
        location.reload(true);
    document.querySelector('#common_maintenance_countdown').innerHTML = remaining;
    setTimeout(()=>{ maintenance_countdown(remaining - 1); }, 1000);
};
const show_broadcast = (broadcast_message) => {
    broadcast_message = window.atob(broadcast_message);
    const broadcast_type = JSON.parse(broadcast_message).broadcast_type;
    const message = JSON.parse(broadcast_message).broadcast_message;
    switch (broadcast_type){
        case 'MAINTENANCE':{
            if (COMMON_GLOBAL.user_account_id !='' && COMMON_GLOBAL.user_account_id !=null)
                exception(COMMON_GLOBAL.exception_app_function, null);
            document.querySelector('#common_maintenance_message').innerHTML = ICONS.app_maintenance;
            show_maintenance(message);
            break;
        
        }
        case 'CONNECTINFO':{
            COMMON_GLOBAL.service_socket_client_ID = JSON.parse(message).client_id;
            break;
        }
        case 'CHAT':
        case 'INFO':{
            show_broadcast_info(message);
            break;
        }
		case 'PROGRESS':{
			show_message('PROGRESS', null, null, JSON.parse(window.atob(message)));
            break;
        }
    }
};
const show_broadcast_info = (message) => {
    const hide_function = () => { document.querySelector('#common_broadcast_info').style.visibility='hidden';
                                document.querySelector('#common_broadcast_close').removeEventListener('click', hide_function);
                                document.querySelector('#common_broadcast_info_message_item').innerHTML='';
                                document.querySelector('#common_broadcast_info_message').style.animationName='unset';};
    document.querySelector('#common_broadcast_info_message').style.animationName='common_ticker';
    document.querySelector('#common_broadcast_close').addEventListener('click', hide_function);
    document.querySelector('#common_broadcast_info_message_item').innerHTML = message;
    document.querySelector('#common_broadcast_info').style.visibility='visible';
};
const show_maintenance = (message, init) => {
    const countdown_timer = 60;

    if (init==1){
        document.querySelector('#common_dialogue_maintenance').style.visibility='visible';
        maintenance_countdown(countdown_timer);
    }
    else
        if (document.querySelector('#common_maintenance_countdown').innerHTML=='') {
            //hide all divs except broadcast and maintenance
            const divs = document.body.querySelectorAll('div');
            for (let i = 0; i < divs.length; i += 1) {
                if (divs[i].id.indexOf('common_broadcast') !=0 &&
                    divs[i].id.indexOf('common_dialogue_maintenance') !=0 &&
                    divs[i].id.indexOf('common_maintenance') !=0)
                    divs[i].style.visibility ='hidden';
            }
            const maintenance_divs = document.querySelector('#common_dialogue_maintenance').querySelectorAll('div');
            for (let i = 0; i < maintenance_divs.length; i += 1) {
                maintenance_divs[i].style.visibility ='visible';
            }
            document.querySelector('#common_dialogue_maintenance').style.visibility='visible';
            maintenance_countdown(countdown_timer);
            document.querySelector('#common_maintenance_footer').innerHTML = message;
        }
        else
            if (message!='')
                document.querySelector('#common_maintenance_footer').innerHTML = message;
};
const reconnect = () => {
    setTimeout(()=>{
                    if (checkconnected())
                        get_gps_from_ip().then(()=>{
                            connectOnline();});
                    else
                        connectOnline();
                   }, 5000);
};
const updateOnlineStatus = () => {
    let token_type='';
    let path='';
    if (COMMON_GLOBAL.system_admin==1){
        path =   '/socket/connection/SystemAdmin'+ 
                `?client_id=${COMMON_GLOBAL.service_socket_client_ID}`+
                `&identity_provider_id=${COMMON_GLOBAL.user_identity_provider_id}` +
                `&system_admin=${COMMON_GLOBAL.system_admin}&latitude=${COMMON_GLOBAL.client_latitude}&longitude=${COMMON_GLOBAL.client_longitude}`;
        token_type='SYSTEMADMIN';
    }
    else{
        path =   '/socket/connection'+ 
                `?client_id=${COMMON_GLOBAL.service_socket_client_ID}`+
                `&identity_provider_id=${COMMON_GLOBAL.user_identity_provider_id}` +
                `&system_admin=${COMMON_GLOBAL.system_admin}&latitude=${COMMON_GLOBAL.client_latitude}&longitude=${COMMON_GLOBAL.client_longitude}`;
        token_type='DATA';
    }
    FFB ('SOCKET', path, 'PATCH', token_type, null, () => {});
};
const connectOnline = async () => {
    FFB ('SOCKET', '/socket/connection/connect' +
                      `?identity_provider_id=${COMMON_GLOBAL.user_identity_provider_id}` +
                      `&system_admin=${COMMON_GLOBAL.system_admin}&latitude=${COMMON_GLOBAL.client_latitude}&longitude=${COMMON_GLOBAL.client_longitude}`, 
         'GET', 'SOCKET', null, (err, result_eventsource) => {
        if (err)
            reconnect();
        else{
            COMMON_GLOBAL.service_socket_eventsource = result_eventsource;
            COMMON_GLOBAL.service_socket_eventsource.onmessage = (event) => {
                show_broadcast(event.data);
            };
            COMMON_GLOBAL.service_socket_eventsource.onerror = () => {
                COMMON_GLOBAL.service_socket_eventsource.close();
                reconnect();
            };
        }
    });
};
const checkOnline = (div_icon_online, user_account_id) => {
    FFB ('SOCKET', `/socket/connection/check?user_account_id=${user_account_id}`, 'GET', 'DATA', null, (err, result) => {
        if (JSON.parse(result).online == 1)
            document.querySelector('#' + div_icon_online).className = 'online';
        else
            document.querySelector('#' + div_icon_online).className= 'offline';
    });
};
/*-----------------------
  SERVICE GEOLOCATION   
  ----------------------- */
const get_place_from_gps = async (longitude, latitude) => {
    return await new Promise((resolve)=>{
        let tokentype;
        const path = `/place?longitude=${longitude}&latitude=${latitude}`;

        if (COMMON_GLOBAL.system_admin==1)
            tokentype = 'SYSTEMADMIN';
        else 
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.common_app_id){
                //admin
                tokentype = 'ACCESS';
            }
            else{
                //not logged in or a user
                tokentype = 'DATA';
            }
        FFB ('GEOLOCATION', path, 'GET', tokentype, null, (err, result) => {
            if (err)
                resolve('');
            else{
                const json = JSON.parse(result);
                if (json.geoplugin_place=='' && json.geoplugin_region =='' && json.geoplugin_countryCode =='')
                    resolve('');
                else
                    resolve(json.geoplugin_place + ', ' +
                            json.geoplugin_region + ', ' +
                            json.geoplugin_countryCode);
            }
        });
    });
};
const get_gps_from_ip = async () => {

    return new Promise((resolve)=>{
        let tokentype;
        const path = '/ip?';
        
        if (COMMON_GLOBAL.system_admin==1 && COMMON_GLOBAL.rest_admin_at)
            tokentype = 'SYSTEMADMIN';
        else
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.common_app_id && COMMON_GLOBAL.rest_at){
                //admin
                tokentype = 'ACCESS';
            }
            else{
                //not logged in or a user
                tokentype = 'DATA';
            }
        FFB ('GEOLOCATION', path, 'GET', tokentype, null, (err, result) => {
            if (err)
                resolve(null);
            else{
                const json = JSON.parse(result);
                COMMON_GLOBAL.client_latitude  = json.geoplugin_latitude;
                COMMON_GLOBAL.client_longitude = json.geoplugin_longitude;
                if (json.geoplugin_city=='' && json.geoplugin_regionName =='' && json.geoplugin_countryName =='')
                    COMMON_GLOBAL.client_place = '';
                else
                    COMMON_GLOBAL.client_place = json.geoplugin_city + ', ' +
                                                           json.geoplugin_regionName + ', ' +
                                                           json.geoplugin_countryName;
                resolve();
            }
        });
    });

};
/*----------------------- */
/* SERVICE WORLDCITIES    */
/*----------------------- */
const get_cities = async (countrycode, callBack) => {
    await FFB ('WORLDCITIES', `/country?country=${countrycode}`, 'GET', 'DATA', null, (err, result) => {
        if (err)
            callBack(err, null);
        else{
            const cities = JSON.parse(result);
            cities.sort((a, b) => {
                const x = a.admin_name.toLowerCase() + a.city.toLowerCase();
                const y = b.admin_name.toLowerCase() + b.city.toLowerCase();
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
            let cities_options='';
            let i =0;
            for (const city of cities) {
                if (i == 0) {
                    cities_options += `<option value='' id='' label='…' selected='selected'>…</option>
                                <optgroup label='${city.admin_name}'>`;
                    current_admin_name = city.admin_name;
                } else
                if (city.admin_name != current_admin_name) {
                    cities_options += `</optgroup>
                                <optgroup label='${city.admin_name}'>`;
                    current_admin_name = city.admin_name;
                }
                cities_options +=
                `<option 
                    id=${city.id} 
                    value=${i + 1}
                    countrycode=${city.iso2}
                    country='${city.country}'
                    admin_name='${city.admin_name}'
                    latitude=${city.lat}
                    longitude=${city.lng}  
                    >${city.city}
                </option>`;
                i++;
            }
            callBack(null, `${cities_options} </optgroup>`);
        }
    });
};
const worldcities_search = async (event_function) =>{
    const search = document.querySelector('#common_module_leaflet_search_input').value;
    const get_cities = async (search) =>{
        return new Promise ((resolve)=>{
            FFB ('WORLDCITIES', `/city/search?search=${encodeURI(search)}`, 'GET', 'DATA', null, (err, result) => {
                if (err)
                    resolve(null);
                else
                    resolve(JSON.parse(result));
            });
        });
    };
    const cities = await get_cities(search);
    const search_list = document.querySelector('#common_module_leaflet_search_list_wrap');
    //remove innerHTML with eventlistener
    document.querySelector('#common_module_leaflet_search_list_wrap').innerHTML = '';
    let html = '';
    if (cities.length > 0){
        for (const city of cities){
            html += `<div class='common_module_leaflet_search_list_row' tabindex=-1>
                        <div class='common_module_leaflet_search_list_col'>
                            <div class='common_module_leaflet_search_list_city_id'>${city.id}</div>
                        </div>
                        <div class='common_module_leaflet_search_list_col'>
                            <div class='common_module_leaflet_search_list_city'><a class='common_module_leaflet_click_city' href='#'>${city.city}</a></div>
                        </div>
                        <div class='common_module_leaflet_search_list_col'>
                            <div class='common_module_leaflet_search_list_country'><a class='common_module_leaflet_click_city' href='#'>${city.admin_name + ',' + city.country}</a></div>
                        </div>
                        <div class='common_module_leaflet_search_list_col'>
                            <div class='common_module_leaflet_search_list_latitude'>${city.lat}</div>
                        </div>
                        <div class='common_module_leaflet_search_list_col'>
                            <div class='common_module_leaflet_search_list_longitude'>${city.lng}</div>
                        </div>
                    </div>`;
        }
        search_list.innerHTML = `<div id='common_module_leaflet_search_list' style='display:inline-block'>${html}</div>`;
    }
    else
        search_list.innerHTML = `<div id='common_module_leaflet_search_list' style='display:none'>${''}</div>`;
    document.querySelector('#common_module_leaflet_search_list').addEventListener('click', (event) => {
        //execute function from inparameter or use default when not specified
        if (event.target.classList.contains('common_module_leaflet_click_city'))
            if (event_function ==null){
                map_show_search_on_map(event.target.parentNode.parentNode.parentNode,null,()=>{map_toolbar_reset('search');});
            }
            else{
                event_function(event.target.parentNode.parentNode.parentNode);
                map_toolbar_reset();
            }
    });
};
/*-----------------------
  EXCEPTION              
  
  local objects:
  exception
  ----------------------- */
const exception = (app_exception_function, error) => {
    app_exception_function(error);
};
/*-----------------------
  INIT                  

  local objects:
  set_app_service_parameters
  assign_icons
  set_events
  set_user_account_app_settings
  set_app_parameters
  ----------------------- */
const set_app_service_parameters = async (parameters) => {
    //app info
    COMMON_GLOBAL.common_app_id= parseInt(parameters.common_app_id);
    COMMON_GLOBAL.app_id = parameters.app_id;
    COMMON_GLOBAL.app_logo = parameters.app_logo;
    // app sound
    COMMON_GLOBAL.app_sound= parseInt(parameters.app_sound);

    //rest 
    COMMON_GLOBAL.rest_resource_bff = parameters.rest_resource_bff;

    //client credentials
    COMMON_GLOBAL.rest_dt = parameters.app_datatoken;

    //system admin
    COMMON_GLOBAL.system_admin = 0;
    COMMON_GLOBAL.system_admin_only = parameters.system_admin_only;

    //user info
    COMMON_GLOBAL.user_identity_provider_id='';
    COMMON_GLOBAL.user_account_id = '';
    
    //client info
    COMMON_GLOBAL.client_latitude  = parameters.client_latitude;
    COMMON_GLOBAL.client_longitude = parameters.client_longitude;
    COMMON_GLOBAL.client_place     = parameters.client_place;
    COMMON_GLOBAL.client_timezone  = parameters.client_timezone==''?null:parameters.client_timezone;
    
    if (COMMON_GLOBAL.system_admin_only==0){
        user_preferences_set_default_globals('LOCALE');
        user_preferences_set_default_globals('TIMEZONE');
        user_preferences_set_default_globals('DIRECTION');
        user_preferences_set_default_globals('ARABIC_SCRIPT');
    }
    COMMON_GLOBAL.ui = parameters.ui;
    if (COMMON_GLOBAL.ui==true){
        COMMON_GLOBAL.module_leaflet_countries   = parameters.countries;
        COMMON_GLOBAL.module_leaflet_map_styles  = parameters.map_styles;
        COMMON_GLOBAL.user_locale                = parameters.locale;
        COMMON_GLOBAL.user_timezone              = parameters.client_timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
        COMMON_GLOBAL.user_direction             = '';
        COMMON_GLOBAL.user_arabic_script         = '';
    }  
};
const assign_icons = () => {
    //dialogue user verify
    document.querySelector('#common_user_verify_email_icon').innerHTML = ICONS.app_email;
    //dialogue login
    document.querySelector('#common_login_tab1').innerHTML = ICONS.app_login;
    document.querySelector('#common_login_tab2').innerHTML = ICONS.app_signup;
    document.querySelector('#common_login_tab3').innerHTML = ICONS.app_forgot;
    document.querySelector('#common_login_button').innerHTML = ICONS.app_login;
    document.querySelector('#common_login_close').innerHTML = ICONS.app_close;
    //dialogue signup
    document.querySelector('#common_signup_tab1').innerHTML = ICONS.app_login;
    document.querySelector('#common_signup_tab2').innerHTML = ICONS.app_signup;
    document.querySelector('#common_signup_tab3').innerHTML = ICONS.app_forgot;
    document.querySelector('#common_signup_button').innerHTML = ICONS.app_signup;
    document.querySelector('#common_signup_close').innerHTML = ICONS.app_close;
    //dialogue forgot
    document.querySelector('#common_forgot_tab1').innerHTML = ICONS.app_login;
    document.querySelector('#common_forgot_tab2').innerHTML = ICONS.app_signup;
    document.querySelector('#common_forgot_tab3').innerHTML = ICONS.app_forgot;
    document.querySelector('#common_forgot_button').innerHTML = ICONS.app_sendmail;
    document.querySelector('#common_forgot_close').innerHTML = ICONS.app_close;
    //dialogue new password
    document.querySelector('#common_user_password_new_icon').innerHTML = ICONS.user_password;
    document.querySelector('#common_user_password_new_cancel').innerHTML = ICONS.app_cancel;
    document.querySelector('#common_user_password_new_ok').innerHTML = ICONS.app_close;
    //dialogue user edit
    document.querySelector('#common_user_edit_btn_avatar_img').innerHTML = ICONS.user_avatar_edit;
    document.querySelector('#common_user_edit_private').innerHTML = ICONS.app_private;
    document.querySelector('#common_user_edit_btn_user_update').innerHTML = ICONS.app_update;
    document.querySelector('#common_user_edit_btn_user_delete_account').innerHTML = ICONS.user_delete_account;
    document.querySelector('#common_user_edit_close').innerHTML = ICONS.app_close;
    document.querySelector('#common_user_edit_label_provider').innerHTML = ICONS.provider;
    document.querySelector('#common_user_edit_label_provider_id').innerHTML = ICONS.provider_id;
    document.querySelector('#common_user_edit_label_provider_email').innerHTML = ICONS.app_email;
    document.querySelector('#common_user_edit_input_username_icon').innerHTML = ICONS.user;
    document.querySelector('#common_user_edit_input_bio_icon').innerHTML = ICONS.user_profile;
    document.querySelector('#common_user_edit_input_email_icon').innerHTML = ICONS.app_email;
    document.querySelector('#common_user_edit_input_new_email_icon').innerHTML = ICONS.app_email;
    document.querySelector('#common_user_edit_input_password_icon').innerHTML = ICONS.user_password;
    document.querySelector('#common_user_edit_input_password_confirm_icon').innerHTML = ICONS.user_password;
    document.querySelector('#common_user_edit_input_password_new_icon').innerHTML = ICONS.user_password;
    document.querySelector('#common_user_edit_input_password_new_confirm_icon').innerHTML = ICONS.user_password;
    document.querySelector('#common_user_edit_input_password_reminder_icon').innerHTML = ICONS.user_account_reminder;
    document.querySelector('#common_user_edit_label_last_logontime').innerHTML = ICONS.user_last_logontime;
    document.querySelector('#common_user_edit_label_account_created').innerHTML = ICONS.user_account_created;
    document.querySelector('#common_user_edit_label_account_modified').innerHTML = ICONS.user_account_modified;
    //dialogue message
    document.querySelector('#common_message_cancel').innerHTML = ICONS.app_cancel;
    document.querySelector('#common_message_close').innerHTML = ICONS.app_close;
    //dialog lov
    document.querySelector('#common_lov_search_icon').innerHTML = ICONS.app_search;
    //profile detail
    document.querySelector('#common_profile_detail_header_following').innerHTML = ICONS.user_follows;
    document.querySelector('#common_profile_detail_header_followed').innerHTML = ICONS.user_followed;
    document.querySelector('#common_profile_detail_header_like').innerHTML = ICONS.user_like;
    document.querySelector('#common_profile_detail_header_liked_heart').innerHTML = ICONS.user_like;
    document.querySelector('#common_profile_detail_header_liked_users').innerHTML =  ICONS.user_followed;
    //profile info search
    if (document.querySelector('#common_profile_search_icon'))
        document.querySelector('#common_profile_search_icon').innerHTML = ICONS.app_search;
    //profile info
    document.querySelector('#common_profile_joined_date_icon').innerHTML = ICONS.user_account_created;
    document.querySelector('#common_profile_follow_follow').innerHTML = ICONS.user_follow_user;
    document.querySelector('#common_profile_follow_followed').innerHTML = ICONS.user_followed_user;
    document.querySelector('#common_profile_like_like').innerHTML = ICONS.user_like;
    document.querySelector('#common_profile_like_unlike').innerHTML = ICONS.user_unlike;
    document.querySelector('#common_profile_info_view_count_icon').innerHTML = ICONS.user_views;
    document.querySelector('#common_profile_main_btn_following').innerHTML = ICONS.user_follows;
    document.querySelector('#common_profile_main_btn_followed').innerHTML = ICONS.user_followed;
    document.querySelector('#common_profile_main_btn_likes').innerHTML = ICONS.user_like;
    document.querySelector('#common_profile_main_btn_liked_heart').innerHTML = ICONS.user_like;
    document.querySelector('#common_profile_main_btn_liked_users').innerHTML = ICONS.user_followed;
    
    document.querySelector('#common_profile_private_title').innerHTML = ICONS.app_private;
    document.querySelector('#common_profile_avatar_online_status').innerHTML = ICONS.app_online;
    //profile top
    document.querySelector('#common_profile_top_row1_1').innerHTML = ICONS.user_views;
    document.querySelector('#common_profile_top_row1_2').innerHTML = ICONS.user_follows;
    document.querySelector('#common_profile_top_row1_3').innerHTML = ICONS.user_like + ICONS.user_follows;
    document.querySelector('#common_profile_home').innerHTML = ICONS.user_profile_top;
    document.querySelector('#common_profile_close').innerHTML = ICONS.app_close;

    //profile button top
    if (document.querySelector('#common_profile_btn_top'))
        document.querySelector('#common_profile_btn_top').innerHTML = ICONS.user_profile_top;

    //window info
    document.querySelector('#common_window_info_btn_close').innerHTML = ICONS.app_close;
    document.querySelector('#common_window_info_toolbar_btn_zoomout').innerHTML = ICONS.app_zoomout;
    document.querySelector('#common_window_info_toolbar_btn_zoomin').innerHTML = ICONS.app_zoomin;
    document.querySelector('#common_window_info_toolbar_btn_left').innerHTML =  ICONS.app_left;
    document.querySelector('#common_window_info_toolbar_btn_right').innerHTML = ICONS.app_right;
    document.querySelector('#common_window_info_toolbar_btn_up').innerHTML =  ICONS.app_up;
    document.querySelector('#common_window_info_toolbar_btn_down').innerHTML = ICONS.app_down;
    document.querySelector('#common_window_info_toolbar_btn_fullscreen').innerHTML = ICONS.app_fullscreen;
    
    //user menu
    if (document.querySelector('#common_user_menu_dropdown_edit')){
        document.querySelector('#common_user_menu_dropdown_edit').innerHTML = ICONS.app_edit;
        document.querySelector('#common_user_menu_dropdown_log_out').innerHTML = ICONS.app_logoff;
        document.querySelector('#common_user_menu_dropdown_signup').innerHTML = ICONS.app_signup;
        document.querySelector('#common_user_menu_dropdown_log_in').innerHTML = ICONS.app_login;
        document.querySelector('#common_user_menu_default_avatar').innerHTML = ICONS.user_avatar;
        document.querySelector('#common_user_preference_locale').innerHTML = ICONS.regional_locale;
        document.querySelector('#common_user_preference_timezone').innerHTML = ICONS.regional_timezone;
        document.querySelector('#common_user_preference_direction').innerHTML = ICONS.regional_direction;
        document.querySelector('#common_user_preference_arabic_script').innerHTML = ICONS.regional_script;
    }

};
const set_event_user_menu = () =>{
    //user menu also for system admin
    document.querySelector('#common_user_menu').addEventListener('click', () => { const menu = document.querySelector('#common_user_menu_dropdown');
    if (menu.style.visibility == 'visible') 
        menu.style.visibility = 'hidden'; 
    else 
        menu.style.visibility = 'visible'; }, false);
    document.addEventListener('keydown', (event) =>{ 
    if (event.key === 'Escape') {
        event.preventDefault();
        //hide use menu dropdown
        if (document.querySelector('#common_user_menu_dropdown').style.visibility=='visible')
            document.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden';
        //hide search
        const x = document.querySelector('#common_profile_input_row'); 
        if (x.style.visibility == 'visible') {
            x.style.visibility = 'hidden';
            document.querySelector('#common_profile_search_list_wrap').style.visibility = 'hidden';
        } 
    }
    }, false);
};

const set_events = () => {
    //login/signup/forgot
    document.querySelector('#common_login_tab2').addEventListener('click', () => { show_common_dialogue('SIGNUP'); }, false);
    document.querySelector('#common_login_tab3').addEventListener('click', () => { show_common_dialogue('FORGOT'); }, false);
    document.querySelector('#common_login_close').addEventListener('click', () => { document.querySelector('#common_dialogue_login').style.visibility = 'hidden'; }, false);
    document.querySelector('#common_signup_tab1').addEventListener('click', () => { show_common_dialogue('LOGIN'); }, false);
    document.querySelector('#common_signup_tab3').addEventListener('click', () => { show_common_dialogue('FORGOT'); }, false);
    document.querySelector('#common_signup_close').addEventListener('click', () => { document.querySelector('#common_dialogue_signup').style.visibility = 'hidden'; }, false);
    document.querySelector('#common_forgot_tab1').addEventListener('click', () => { show_common_dialogue('LOGIN'); }, false);
    document.querySelector('#common_forgot_tab2').addEventListener('click', () => { show_common_dialogue('SIGNUP'); }, false);
    document.querySelector('#common_forgot_email').addEventListener('keyup', (event) =>{
        if (event.code === 'Enter') {
            event.preventDefault();
            user_forgot().then(()=>{
                //unfocus
                document.querySelector('#common_forgot_email').blur();
            });
        }
    });
    document.querySelector('#common_forgot_button').addEventListener('click', () => { user_forgot();}, false);
    document.querySelector('#common_forgot_close').addEventListener('click', () => { document.querySelector('#common_dialogue_forgot').style.visibility = 'hidden'; }, false);

    //dialogue message
    document.querySelector('#common_message_cancel').addEventListener('click', () => { document.querySelector('#common_dialogue_message').style.visibility = 'hidden'; }, false);
    //dialogue new password
    document.querySelector('#common_user_password_new_cancel').addEventListener('click', () => { dialogue_password_new_clear(); }, false);
    document.querySelector('#common_user_password_new_ok').addEventListener('click', () => { updatePassword(); }, false);
    //dialogue lov
    document.querySelector('#common_lov_search_input').addEventListener('keyup', (event) => {lov_keys(event);});
    document.querySelector('#common_lov_search_icon').addEventListener('click', () => {lov_filter(document.querySelector('#common_lov_search_input').value);});
    document.querySelector('#common_lov_close').addEventListener('click', () => { lov_close();}, false); 
    //profile search
    if (document.querySelector('#common_profile_input_row'))
        document.querySelector('#common_profile_search_icon').addEventListener('click', () => { 
            document.querySelector('#common_profile_search_input').focus();
            document.querySelector('#common_profile_search_input').dispatchEvent(new KeyboardEvent('keyup'));
        }, false);
    //window info
    document.querySelector('#common_window_info_btn_close').addEventListener('click', () =>{
            document.querySelector('#common_window_info').style.visibility = 'hidden'; 
            document.querySelector('#common_window_info_info').innerHTML='';
            document.querySelector('#common_window_info_content').src='';
            document.querySelector('#common_window_info_content').classList='';
            document.querySelector('#common_window_info_toolbar').classList='';
    });
    document.querySelector('#common_window_info_info').addEventListener('click', () => { show_hide_window_info_toolbar();  }, false);
    document.querySelector('#common_window_info_toolbar').addEventListener('click', (event)=>{
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
    //usermenu
    if (document.querySelector('#common_user_menu')){
        set_event_user_menu();
        document.querySelector('#common_user_menu_dropdown_log_in').addEventListener('click', () => { show_common_dialogue('LOGIN'); document.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden';}, false);
        document.querySelector('#common_user_menu_dropdown_edit').addEventListener('click', () => { user_edit();document.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden'; }, false);
        document.querySelector('#common_user_menu_dropdown_signup').addEventListener('click', () => { show_common_dialogue('SIGNUP'); document.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden'; }, false);
        //user preferences
        //define globals and save settings here, in apps define what should happen when changing
        if (document.querySelector('#common_user_locale_select'))
            document.querySelector('#common_user_locale_select').addEventListener('change', (event) => { 
                                                                                        COMMON_GLOBAL.user_locale = event.target.value;
                                                                                        //change navigator.language, however when logging out default navigator.language will be set
                                                                                        //commented at the moment
                                                                                        //Object.defineProperties(navigator, {'language': {'value':COMMON_GLOBAL.user_locale, writable: true}});
                                                                                        user_preference_save();
                                                                                    }, false);
        if (document.querySelector('#common_user_timezone_select'))
            document.querySelector('#common_user_timezone_select').addEventListener('change', (event) => { COMMON_GLOBAL.user_timezone = event.target.value;
                                                                                                    user_preference_save().then(()=>{
                                                                                                        if (document.querySelector('#common_dialogue_user_edit').style.visibility == 'visible') {
                                                                                                            dialogue_user_edit_clear();
                                                                                                            user_edit();
                                                                                                        }
                                                                                                    });
                                                                                                    }, false);
        //define also in app if needed to adjust ui
        if (document.querySelector('#common_user_direction_select'))
            document.querySelector('#common_user_direction_select').addEventListener('change', (event) => { document.body.style.direction = event.target.value;
                                                                                                    COMMON_GLOBAL.user_direction = event.target.value;  
                                                                                                    user_preference_save();
                                                                                                    }, false);
        if (document.querySelector('#common_user_arabic_script_select'))
            document.querySelector('#common_user_arabic_script_select').addEventListener('change', (event) => { COMMON_GLOBAL.user_arabic_script = event.target.value;
                                                                                                        user_preference_save();
                                                                                                        }, false);
        
        
        set_user_account_app_settings();
        
        //dialogue user edit
        document.querySelector('#common_user_edit_close').addEventListener('click', () => { dialogue_user_edit_clear(); }, false);
        document.querySelector('#common_user_edit_btn_avatar_img').addEventListener('click', () => { document.querySelector('#common_user_edit_input_avatar_img').click(); }, false);
        document.querySelector('#common_user_edit_input_avatar_img').addEventListener('change', (event) => { show_image(document.querySelector('#common_user_edit_avatar_img'), event.target.id, COMMON_GLOBAL.image_avatar_width, COMMON_GLOBAL.image_avatar_height); }, false);
        document.querySelector('#common_user_edit_btn_user_update').addEventListener('click', () => { user_update(); }, false);
    }  
};
const set_user_account_app_settings = () =>{
    if (document.querySelector('#common_user_menu')){
    SearchAndSetSelectedIndex(COMMON_GLOBAL.user_locale, document.querySelector('#common_user_locale_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL.user_timezone, document.querySelector('#common_user_timezone_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL.user_direction, document.querySelector('#common_user_direction_select'), 1);
    SearchAndSetSelectedIndex(COMMON_GLOBAL.user_arabic_script, document.querySelector('#common_user_arabic_script_select'), 1);
    }
};
const set_app_parameters = (common_parameters) => {
    //set parameters for common_app_id, each app set its own parameters in the app
    for (const parameter of common_parameters.filter(parameter=>parameter.app_id == COMMON_GLOBAL.common_app_id)){
        switch (parameter.parameter_name){
            case 'IMAGE_FILE_ALLOWED_TYPE1'             :{COMMON_GLOBAL.image_file_allowed_type1 = parameter.parameter_value;break;}
            case 'IMAGE_FILE_ALLOWED_TYPE2'             :{COMMON_GLOBAL.image_file_allowed_type2 = parameter.parameter_value;break;}
            case 'IMAGE_FILE_ALLOWED_TYPE3'             :{COMMON_GLOBAL.image_file_allowed_type3 = parameter.parameter_value;break;}
            case 'IMAGE_FILE_ALLOWED_TYPE4'             :{COMMON_GLOBAL.image_file_allowed_type4 = parameter.parameter_value;break;}
            case 'IMAGE_FILE_ALLOWED_TYPE5'             :{COMMON_GLOBAL.image_file_allowed_type5 = parameter.parameter_value;break;}
            case 'IMAGE_FILE_MIME_TYPE'                 :{COMMON_GLOBAL.image_file_mime_type = parameter.parameter_value;break;}
            case 'IMAGE_FILE_MAX_SIZE'                  :{COMMON_GLOBAL.image_file_max_size = parameter.parameter_value;break;}
            case 'IMAGE_AVATAR_WIDTH'                   :{COMMON_GLOBAL.image_avatar_width = parameter.parameter_value;break;}
            case 'IMAGE_AVATAR_HEIGHT'                  :{COMMON_GLOBAL.image_avatar_height = parameter.parameter_value;break;}
            case 'MODULE_LEAFLET_FLYTO'                 :{COMMON_GLOBAL.module_leaflet_flyto = parseInt(parameter.parameter_value);break;}
            case 'MODULE_LEAFLET_JUMPTO'                :{COMMON_GLOBAL.module_leaflet_jumpto = parseInt(parameter.parameter_value);break;}
            case 'MODULE_LEAFLET_POPUP_OFFSET'          :{COMMON_GLOBAL.module_leaflet_popup_offset = parseInt(parameter.parameter_value);break;}
            case 'MODULE_LEAFLET_STYLE'                 :{COMMON_GLOBAL.module_leaflet_style = parameter.parameter_value;break;}
            case 'MODULE_LEAFLET_ZOOM'                  :{COMMON_GLOBAL.module_leaflet_zoom = parseInt(parameter.parameter_value);break;}
            case 'MODULE_LEAFLET_ZOOM_CITY'             :{COMMON_GLOBAL.module_leaflet_zoom_city = parseInt(parameter.parameter_value);break;}
            case 'MODULE_LEAFLET_ZOOM_PP'               :{COMMON_GLOBAL.module_leaflet_zoom_pp = parseInt(parameter.parameter_value);break;}
            case 'MODULE_LEAFLET_MARKER_DIV_GPS'        :{COMMON_GLOBAL.module_leaflet_marker_div_gps = parameter.parameter_value;break;}
            case 'MODULE_LEAFLET_MARKER_DIV_CITY'       :{COMMON_GLOBAL.module_leaflet_marker_div_city = parameter.parameter_value;break;}
            case 'MODULE_LEAFLET_MARKER_DIV_PP'         :{COMMON_GLOBAL.module_leaflet_marker_div_pp = parameter.parameter_value;break;}
        }
    }
};

const init_common = async (parameters) => {
    return new Promise((resolve) =>{
        if (COMMON_GLOBAL.app_id ==null)
            set_app_service_parameters(parameters.app_service);
        if (COMMON_GLOBAL.app_id == COMMON_GLOBAL.common_app_id){
            //admin app
            broadcast_init();
            if (COMMON_GLOBAL.system_admin_only==1){
                resolve();
            }
            else{
                set_app_parameters(parameters.app);
                if (COMMON_GLOBAL.ui){
                    assign_icons();
                    set_events();
                    set_user_account_app_settings();
                    resolve();
                }
                else
                resolve();
            }
        }
        else{
            //other apps
            broadcast_init();
            set_app_parameters(parameters.app);
            if (COMMON_GLOBAL.ui){
                assign_icons();
                set_events();
                set_user_account_app_settings();
                resolve();
            }
            else
                resolve();
        }
    });
};
export{/* GLOBALS*/
       COMMON_GLOBAL, ICONS, APP_SPINNER,
       /* MISC */
       getTimezoneOffset, getTimezoneDate, getGregorian, typewatch, toBase64, fromBase64, common_translate_ui,
       get_null_or_value, mobile, image_format,
       list_image_format_src, recreate_img, convert_image, set_avatar,
       inIframe, show_image, getHostname, check_input, SearchAndSetSelectedIndex,
       /* MESSAGE & DIALOGUE */
       show_message_info_list, dialogue_close, show_common_dialogue, show_message,
       dialogue_login_clear, dialogue_signup_clear,
       lov_close, lov_show,
       /* WINDOW INFO */
       zoom_info, move_info, show_window_info,
       /* PROFILE */
       profile_follow_like, profile_top, profile_detail, profile_show,
       profile_close, profile_update_stat, search_input,
       /* USER  */
       user_login, user_logoff, user_edit, user_update, user_signup, user_verify_check_input, user_delete, user_function,
       updatePassword,
       /* USER PROVIDER */
       ProviderUser_update, ProviderSignIn,
       /* MODULE LEAFLET  */
       map_init, map_country, map_show_search_on_map, map_click_event, map_resize, map_line_removeall, map_line_create,
       map_setevent, map_setstyle, map_update_popup, map_update,
       /* MODULE EASY.QRCODE */
       create_qr,
       /*FFB */
       FFB,
       /* SERVICE BROADCAST */
       show_broadcast, show_maintenance,
       updateOnlineStatus, connectOnline,
       /* SERVICE GEOLOCATION */
       get_place_from_gps, get_gps_from_ip,
       /* SERVICE WORLDCITIES */
       get_cities,
       /* INIT */
       set_event_user_menu, init_common};