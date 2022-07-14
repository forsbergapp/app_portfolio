/*  Functions and globals in this order:
    MISC
    MESSAGE & DIALOGUE
    BROADCAST
    GPS
    QR
    PROFILE
    USER
    USER PROVIDER    
    EXCEPTION
    INIT
 */
/*----------------------- */
/* MISC                   */



/*----------------------- */
function common_translate_ui(lang_code){
    let json;
    let status;
    let url = `${window.global_rest_url_base}${window.global_rest_app_object}${lang_code}` +
                  `?app_id=${window.global_main_app_id}` + 
                  `&lang_code=${lang_code}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + window.global_rest_dt,
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status == 200) {
            json = JSON.parse(result);
            for (let i = 0; i < json.data.length; i++){
                //app 0 placeholder text
                if (json.data[i].object_name=='DIALOGUE'){
                    switch  (json.data[i].object_item_name){
                        case 'USERNAME':{
                            document.getElementById('login_username').placeholder = json.data[i].text;
                            document.getElementById('signup_username').placeholder = json.data[i].text;
                            document.getElementById('user_edit_input_username').placeholder = json.data[i].text;
                            break;
                        }
                        case 'EMAIL':{
                            document.getElementById('signup_email').placeholder = json.data[i].text;
                            document.getElementById('forgot_email').placeholder = json.data[i].text;
                            document.getElementById('user_edit_input_email').placeholder = json.data[i].text;
                            break;
                        }
                        case 'BIO':{
                            document.getElementById('signup_email').placeholder = json.data[i].text;
                            document.getElementById('forgot_email').placeholder = json.data[i].text;
                            document.getElementById('user_edit_input_bio').placeholder = json.data[i].text;
                            break;
                        }
                        case 'PASSWORD':{
                            document.getElementById('login_password').placeholder = json.data[i].text;
                            document.getElementById('signup_password').placeholder = json.data[i].text;
                            document.getElementById('user_edit_input_password').placeholder = json.data[i].text;
                            break;
                        }
                        case 'PASSWORD_CONFIRM':{
                            document.getElementById('signup_password_confirm').placeholder = json.data[i].text;
                            document.getElementById('user_edit_input_password_confirm').placeholder = json.data[i].text;
                            break;
                        }
                        case 'PASSWORD_REMINDER':{
                            document.getElementById('signup_password_reminder').placeholder = json.data[i].text;
                            document.getElementById('user_edit_input_password_reminder').placeholder = json.data[i].text;
                            break;
                        }
                        case 'NEW_PASSWORD_CONFIRM':{
                            document.getElementById('user_edit_input_new_password_confirm').placeholder = json.data[i].text;
                            document.getElementById('user_new_password_confirm').placeholder = json.data[i].text;    
                            break;
                        }
                        case 'NEW_PASSWORD':{
                            document.getElementById('user_edit_input_new_password').placeholder = json.data[i].text;
                            document.getElementById('user_new_password').placeholder = json.data[i].text;    
                            break;
                        }
                        default:{
                            document.getElementById(json.data[i].object_item_name.toLowerCase()).innerHTML = json.data[i].text;
                            break;
                        }
                    }                                        
                }   
            }
        }
    })                            
}
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

function checkbox_value(checkbox) {
    if (checkbox.checked)
        return 'YES';
    else
        return 'NO';
}
function checkbox_checked(checkbox) {
    if (checkbox == 1)
        return 'YES';
    else
        return 'NO';
}

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
/* check if run inside an iframe*/
function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
function show_image(item_img, item_input, image_width, image_height, lang_code) {
    let file = document.getElementById(item_input).files[0];
    let reader = new FileReader();

    const allowedExtensions = [window.global_image_file_allowed_type1,
                               window.global_image_file_allowed_type2,
                               window.global_image_file_allowed_type3
                              ];
    const { name: fileName, size: fileSize } = file;
    const fileExtension = fileName.split(".").pop();
    if (!allowedExtensions.includes(fileExtension)){
        //File type not allowed
        show_message('ERROR', 20307, null,null, window.global_main_app_id, lang_code);
    }
    else
        if (fileSize > window.global_image_file_max_size){
            //File size too large
            show_message('ERROR', 20308, null, null, window.global_main_app_id, lang_code);
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
                    let srcEncoded = ctx.canvas.toDataURL(window.global_image_file_mime_type);
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
function getHostname(){
    return `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}`;
}
function check_input(text, lang_code, text_length=100){
    if (text==null || text=='')
        return true;
    else{
        try {
            let check_text = JSON.parse(JSON.stringify(text));
            if (text.includes('"') ||
                text.includes('\\')){
                //not valid text
                show_message('ERROR', 20309, null, null, window.global_main_app_id,lang_code);
                return false;
            }
        } catch (error) {
            //not valid text
            show_message('ERROR', 20309, null, null, window.global_main_app_id,lang_code);
            return false;
        }
        try {
            //check default max length 100 characters or parameter value
            if (text.length>text_length){
                //text too long
                show_message('ERROR', 20310, null, null, window.global_main_app_id,lang_code);
                return false;
            }
        } catch (error) {
            return false;
        }
        return true;
    }
}
/*----------------------- */
/* MESSAGE & DIALOGUE     */
/*----------------------- */
function show_common_dialogue(dialogue, user_verification_type, title=null, icon=null, click_cancel_event) {
    switch (dialogue) {
        case 'NEW_PASSWORD':
            {    
                document.getElementById('user_new_password_auth').innerHTML=title;
                document.getElementById('user_new_password').value='';
                document.getElementById('user_new_password_confirm').value='';
                document.getElementById('dialogue_user_new_password').style.visibility = 'visible';
                break;
            }
        case 'VERIFY':
            {    
                dialogue_verify_clear();
                switch (user_verification_type){
                    case 'LOGIN':{
                        document.getElementById('user_verification_type').innerHTML = 1;
                        break;
                    }
                    case 'SIGNUP':{
                        document.getElementById('user_verification_type').innerHTML = 2;
                        break;
                    }
                    case 'FORGOT':{
                        document.getElementById('user_verification_type').innerHTML = 3;
                        break;
                    }
                }
                document.getElementById('user_verify_cancel').addEventListener('click', click_cancel_event);

                document.getElementById('user_verify_email').innerHTML = title;
                document.getElementById('user_verify_cancel').innerHTML = icon;
                
                document.getElementById('dialogue_login').style.visibility = 'hidden';
                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                document.getElementById('dialogue_forgot').style.visibility = 'hidden';
                document.getElementById('dialogue_user_verify').style.visibility = 'visible';
                break;
            }
        case 'LOGIN':
            {
                document.getElementById('dialogue_login').style.visibility = 'visible';
                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                document.getElementById('dialogue_forgot').style.visibility = 'hidden';
                document.getElementById('login_username').focus();
                break;
            }
        case 'SIGNUP':
            {
                document.getElementById('dialogue_login').style.visibility = 'hidden';
                document.getElementById('dialogue_signup').style.visibility = 'visible';
                document.getElementById('dialogue_forgot').style.visibility = 'hidden';
                document.getElementById('signup_username').focus();
                break;
            }
        case 'FORGOT':
            {
                document.getElementById('dialogue_login').style.visibility = 'hidden';
                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                document.getElementById('dialogue_forgot').style.visibility = 'visible';
                document.getElementById('forgot_email').focus();
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
            fetch(window.global_rest_url_base + window.global_rest_message_translation + code + 
                '?app_id=' + app_id +
                '&lang_code=' + lang_code, 
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + window.global_rest_dt
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
function dialogue_verify_clear(){
    document.getElementById('dialogue_user_verify').style.visibility = 'hidden';
    //this removes old eventlistener
    let old_cancel = document.getElementById('user_verify_cancel');
    let button_cancel = old_cancel.cloneNode(true);
    old_cancel.parentNode.replaceChild(button_cancel, old_cancel);
    document.getElementById('user_verification_type').innerHTML='';
    document.getElementById('user_verify_email').innerHTML='';
    document.getElementById('user_verify_cancel').innerHTML='';
    document.getElementById('user_verify_verification_char1').value = '';
    document.getElementById('user_verify_verification_char2').value = '';
    document.getElementById('user_verify_verification_char3').value = '';
    document.getElementById('user_verify_verification_char4').value = '';
    document.getElementById('user_verify_verification_char5').value = '';
    document.getElementById('user_verify_verification_char6').value = '';
}
function dialogue_new_password_clear(){
    document.getElementById("dialogue_user_new_password").style.visibility = "hidden";
    document.getElementById("user_new_password_auth").innerHTML='';
    document.getElementById("user_new_password").value='';
    document.getElementById("user_new_password_confirm").value='';
    window.global_user_account_id = '';
    window.global_rest_at = '';
}
/*----------------------- */
/* BROADCAST              */
/*----------------------- */
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
function reconnect(){
    setTimeout(connectOnline, 5000);
}
function updateOnlineStatus(){

    fetch(`/service/broadcast/update_connected?app_id=${window.global_app_id}&client_id=${window.global_clientId}&user_account_id=${window.global_user_account_id}`,
    {method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + window.global_rest_dt,
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status == 200){
            null;
        }
        else{
            exception(status, result, window.global_lang_code);
        }
    });
}
function connectOnline(updateOnline=false){
    window.global_clientId = Date.now();
    window.global_eventSource = new EventSource(`/service/broadcast/connect/${window.global_clientId}?app_id=${window.global_app_id}&user_account_id=${window.global_user_account_id}`);
    window.global_eventSource.onmessage = function (event) {
        if (window.global_admin == true)
            null;
        else
            show_broadcast(event.data);
    }
    window.global_eventSource.onerror = function (err) {
        window.global_eventSource.close();
        reconnect();
    }
}
function checkOnline(div_icon_online, user_account_id){
    fetch(`/service/broadcast/checkconnected/${user_account_id}`,
    {method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + window.global_rest_dt,
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (JSON.parse(result).online == 1)
            document.getElementById(div_icon_online).className = 'online';
        else
            document.getElementById(div_icon_online).className= 'offline';
    });
    
}
/*----------------------- */
/* GPS                    */
/*----------------------- */
async function get_gps_from_ip(user_id, lang_code) {

    let status;
    let app_id;
    if (window.global_app_id != '')
        app_id = window.global_app_id
    else
        app_id = window.global_main_app_id
    await fetch(window.global_service_geolocation + window.global_service_geolocation_gps_ip + 
                '?app_id=' + app_id + 
                '&app_user_id=' +  user_id +
                '&lang_code=' + lang_code, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + window.global_rest_dt,
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            let json = JSON.parse(result);
            window.global_client_latitude  = json.geoplugin_latitude;
            window.global_client_longitude = json.geoplugin_longitude;
            window.global_client_place     = json.geoplugin_city + ', ' +
                                                json.geoplugin_regionName + ', ' +
                                                json.geoplugin_countryName;
        } else {
            exception(status, result, lang_code);
        }
    })
}
/*----------------------- */
/* QR                     */
/*----------------------- */
function create_qr(div, url) {
    let qrcode = new QRCode(document.getElementById(div), {
        text: url,
        width: window.global_qr_width,
        height: window.global_qr_height,
        colorDark: window.global_qr_color_dark,
        colorLight: window.global_qr_color_light,
        logo: window.global_qr_logo_file_path,
        logoWidth: window.global_qr_logo_width,
        logoHeight: window.global_qr_logo_height,
        logoBackgroundColor: window.global_qr_background_color,
        logoBackgroundTransparent: false
    });
}
/*----------------------- */
/* PROFILE                */
/*----------------------- */
function show_profile_click_events(item, user_id, timezone, lang_code, click_function){
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
        else
            eval(`(function (){${click_function}(${profile_id},
                    ${null},
                    ${user_id==''?"''":user_id},
                    '${timezone}',
                    '${lang_code}')}());`);
    }));
}
function profile_top(statschoice, user_id, timezone, lang_code, app_rest_url = null, click_function=null) {
    let status;
    let url;
    document.getElementById('dialogue_profile').style.visibility = 'visible';
    document.getElementById('profile_info').style.display = 'none';
    document.getElementById('profile_top').style.display = 'block';
                
    if (statschoice ==1 || statschoice ==2 || statschoice ==3){
        /*statschoice 1,2,3: user_account*/
        url = window.global_rest_url_base + window.global_rest_user_account_profile_top;
    }
    else{
        /*other statschoice, apps can use >3 and return same columns*/
        url = window.global_rest_url_base + app_rest_url;
    }
    //TOP
    fetch(url + statschoice + 
            '?app_id=' + window.global_app_id +
            '&lang_code=' + lang_code, 
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.global_rest_dt
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
                show_profile_click_events('.profile_top_list_username', user_id, timezone, lang_code, click_function);
            }
        })
        .catch(function(error) {
            show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
        });
}
function profile_detail(detailchoice, user_id, timezone, lang_code, rest_url_app, fetch_detail, header_app, click_function) {
    let status;
    let url;
    if (detailchoice == 1 || detailchoice == 2 || detailchoice == 3 || detailchoice == 4){
        /*detailchoice 1,2,3, 4: user_account*/
        url = window.global_rest_url_base + window.global_rest_user_account_profile_detail;
    }
    else{
        /*other detailchoice, apps can use >4 and return same columns*/
        url = window.global_rest_url_base + rest_url_app;
    }
    //DETAIL
    //show only if user logged in
    if (parseInt(user_id) || 0 !== 0) {
        switch (detailchoice) {
            case 0:
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
            default:
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
        }
        if (fetch_detail)
        {
            fetch(url + document.getElementById('profile_id').innerHTML +
            '?app_id=' + window.global_app_id +
            '&lang_code=' + lang_code +
            '&detailchoice=' + detailchoice, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.global_rest_at
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
                    let delete_div ='';
                    for (i = 0; i < json.count; i++) {
                        if (window.global_app_id == window.global_main_app_id && detailchoice==5){
                            if (json.items[i].app_id !=0){
                                if (document.getElementById('profile_id').innerHTML==user_id)
                                    delete_div = `<div class='profile_detail_list_app_delete'>${global_button_default_icon_delete}</div>`;
                                    
                                //App list in app 0
                                html += 
                                `<div class='profile_detail_list_row'>
                                    <div class='profile_detail_list_col'>
                                        <div class='profile_detail_list_app_id'>${json.items[i].app_id}</div>
                                    </div>
                                    <div class='profile_detail_list_col'>
                                        <img class='profile_detail_list_app_logo' src='${json.items[i].logo}'>
                                    </div>
                                    <div class='profile_detail_list_col'>
                                        <div class='profile_detail_list_app_name'>
                                            <a href='${json.items[i].url}'>${json.items[i].app_name}</a>
                                        </div>
                                    </div>
                                    <div class='profile_detail_list_col'>
                                        ${delete_div}
                                    </div>
                                    <div class='profile_detail_list_col'>
                                        <div class='profile_detail_list_app_url'>${json.items[i].url}</div>
                                    </div>
                                    <div class='profile_detail_list_col'>
                                        <div class='profile_detail_list_date_created'>${json.items[i].date_created}</div>
                                    </div>
                                </div>`;
                            }
                        }
                        else{
                            //Username list
                            html += 
                            `<div class='profile_detail_list_row'>
                                <div class='profile_detail_list_col'>
                                    <div class='profile_detail_list_user_account_id'>${json.items[i].id}</div>
                                </div>
                                <div class='profile_detail_list_col'>
                                    <img class='profile_detail_list_avatar' src='${image_format(json.items[i].avatar ?? json.items[i].provider1_image ?? json.items[i].provider2_image)}'>
                                </div>
                                <div class='profile_detail_list_col'>
                                    <div class='profile_detail_list_username'>
                                        <a href='#'>${json.items[i].username}</a>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                    profile_detail_list.innerHTML = html;
                    if (window.global_app_id == window.global_main_app_id && detailchoice==5){
                        document.querySelectorAll('.profile_detail_list_app_name').forEach(e => e.addEventListener('click', function(event) {
                            event.preventDefault();
                            window.open(event.target.parentNode.parentNode.parentNode.children[4].children[0].innerHTML, '_blank');
                        }))
                        if (document.getElementById('profile_id').innerHTML==user_id){
                            document.querySelectorAll('.profile_detail_list_app_delete').forEach(e => e.addEventListener('click', function(event) {
                                user_account_app_delete(null, 
                                                        document.getElementById('profile_id').innerHTML,
                                                        event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML,
                                                        window.global_lang_code,
                                                        function() { 
                                                            document.getElementById('dialogue_message').style.visibility = 'hidden';
                                                            user_account_app_delete(1, 
                                                                                    document.getElementById('profile_id').innerHTML, 
                                                                                    event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML, 
                                                                                    window.global_lang_code, null);
                                                        });
                            }))
                        }
                    }
                    else
                        show_profile_click_events('.profile_detail_list_username', user_id, timezone, lang_code, click_function);
                } else {
                    exception(status, result, lang_code);
                }
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
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
    if (check_input(searched_username, lang_code) == false)
        return;
    if (user_id!=''){
        //search using access token with logged in user_account_id
        url = window.global_rest_url_base + window.global_rest_user_account_profile_searchA;
        token = window.global_rest_at;
        json_data = `{
                    "user_account_id":${user_id},
                    "client_latitude": "${window.global_client_latitude}",
                    "client_longitude": "${window.global_client_longitude}"
                    }`;
    }
    else{
        //search using data token without logged in user_account_id
        url = window.global_rest_url_base + window.global_rest_user_account_profile_searchD;
        token = window.global_rest_dt;
        json_data = `{
                    "client_latitude": "${window.global_client_latitude}",
                    "client_longitude": "${window.global_client_longitude}"
                    }`;
    }
    fetch(url + searched_username +
          '?app_id=' + window.global_app_id +
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
                show_profile_click_events('.profile_search_list_username', user_id, timezone, lang_code, click_function);
            }
        })
        .catch(function(error) {
            show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
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
    document.getElementById('profile_detail').style.display = "none";
    document.getElementById('profile_search_list').style.display = "none";

    profile_clear()
    if (user_account_id_other == null && user_id == '' && username == null) {
        
        return callBack(null,null);

    } else {
        if (user_account_id_other !== null) {
            user_account_id_search = user_account_id_other;
            url = window.global_rest_url_base + window.global_rest_user_account_profile_userid + user_account_id_search;
        } else
        if (username !== null) {
            user_account_id_search = '';
            url = window.global_rest_url_base + window.global_rest_user_account_profile_username + username;
        } else {
            user_account_id_search = user_id;
            url = window.global_rest_url_base + window.global_rest_user_account_profile_userid + user_account_id_search;
        }
        //PROFILE MAIN
        let json_data =
            `{
            "client_latitude": "${window.global_client_latitude}",
            "client_longitude": "${window.global_client_longitude}"
            }`;
        fetch(url + 
                '?app_id=' + window.global_app_id + 
                '&lang_code=' + lang_code +
                '&id=' + user_id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.global_rest_dt
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
                    create_qr('profile_qr', getHostname() + '/' + json.username);
                    //User account followed and liked
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
                    //if private then hide info, sql decides if private, no need to check here if same user
                    if (json.private==1) {
                        //private
                        document.getElementById('profile_public').style.display = "none";
                        document.getElementById('profile_private').style.display = "block";
                    } else {
                        //public
                        document.getElementById('profile_public').style.display = "block";
                        document.getElementById('profile_private').style.display = "none";
                        document.getElementById('profile_info_view_count').innerHTML = json.count_views;
                        document.getElementById('profile_info_following_count').innerHTML = json.count_following;
                        document.getElementById('profile_info_followers_count').innerHTML = json.count_followed;
                        document.getElementById('profile_info_likes_count').innerHTML = json.count_likes;
                        document.getElementById('profile_info_liked_count').innerHTML = json.count_liked;
                    }    
                    if (user_id =='')
                        setTimeout(function(){show_common_dialogue('LOGIN')}, 2000);
                    else
                        checkOnline('profile_avatar_online_status', json.id);
                    return callBack(null,{profile_id: json.id,
                                          private: json.private});                    
                } else
                    return callBack(status,null);
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, window.global_appp_id, lang_code);
                return callBack(error,null);
            });
    }
}
function profile_home(user_id, timezone, lang_code, header_app, click_event_function){
    document.getElementById('dialogue_profile').style.visibility = 'visible';;
    document.getElementById('profile_info').style.display = 'none';
    document.getElementById('profile_detail').style.display = 'none';
    document.getElementById('profile_top').style.display = 'block';
    document.getElementById('profile_top_list').style.display = 'block';
    document.getElementById('profile_detail_list').innerHTML = '';
    profile_top(1, user_id, timezone, lang_code, header_app, click_event_function);
}
function profile_clear(){

    document.getElementById('profile_follow').children[0].style.display = 'block';
    document.getElementById('profile_follow').children[1].style.display = 'none';
    document.getElementById('profile_like').children[0].style.display = 'block';
    document.getElementById('profile_like').children[1].style.display = 'none';

    document.getElementById('profile_avatar').src = '';
    document.getElementById('profile_username').innerHTML = '';
    document.getElementById('profile_bio').innerHTML = '';
    document.getElementById('profile_joined_date').innerHTML = '';

    document.getElementById('profile_info_view_count').innerHTML = '';
    document.getElementById('profile_info_following_count').innerHTML = '';
    document.getElementById('profile_info_followers_count').innerHTML = '';
    document.getElementById('profile_info_likes_count').innerHTML = '';
    document.getElementById('profile_info_liked_count').innerHTML = '';
    
    document.getElementById('profile_qr').innerHTML = '';

    document.getElementById('profile_search_input').value = '';
    document.getElementById('profile_detail_list').innerHTML = '';
    document.getElementById('profile_top_list').innerHTML = '';
}
function profile_close(){
    document.getElementById('dialogue_profile').style.visibility = 'hidden';
    document.getElementById('profile_info').style.display = 'none';
    document.getElementById('profile_detail').style.display = 'none';
    document.getElementById('profile_top').style.display = 'none';
    profile_clear();
}
async function profile_update_stat(lang_code, callBack){
    let profile_id = document.getElementById('profile_id');
    let json_data =
    `{
        "client_latitude": "${window.global_client_latitude}",
        "client_longitude": "${window.global_client_longitude}"
    }`;
    //get updated stat for given user
    //to avoid update in stat set searched by same user
    let url = window.global_rest_url_base + window.global_rest_user_account_profile_userid + profile_id.innerHTML;
    let status;
    fetch(url + 
        '?app_id=' + window.global_app_id + 
        '&lang_code=' + lang_code +
        '&id=' + profile_id.innerHTML, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.global_rest_dt
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
/*----------------------- */
/* USER                   */
/*----------------------- */
async function user_login(username, password, lang_code, callBack) {
    
    let json;
    let json_data;
    let status;

    if (check_input(username, lang_code) == false || check_input(password, lang_code)== false)
        return callBack('ERROR', null);

    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, window.global_main_app_id, lang_code);
        return callBack('ERROR', null);
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, window.global_main_app_id,lang_code);
        return callBack('ERROR', null);
    }

    json_data = `{
                    "app_id": ${window.global_app_id},
                    "username":"${username}",
                    "password":"${password}",
                    "user_language": "${navigator.language}",
                    "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
                    "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
                    "user_platform": "${navigator.platform}",
                    "client_latitude":"${window.global_client_latitude}",
                    "client_longitude":"${window.global_client_longitude}"
                 }`;

    //get user with username and password from REST API
    fetch(window.global_rest_url_base + window.global_rest_user_account_login + 
            '?lang_code=' + lang_code, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.global_rest_dt
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
            window.global_user_account_id = json.items[0].id;
            updateOnlineStatus();
            window.global_rest_at	= json.accessToken;
            if (json.items[0].active==0){
                let function_cancel_event = function() { dialogue_verify_clear();eval(`(function (){${window.global_exception_app_function}()}());`);};
                show_common_dialogue('VERIFY', 'LOGIN', json.items[0].email, window.global_button_default_icon_logoff, function_cancel_event);
                return callBack('ERROR', null);
            }
            else    
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
        show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
        return callBack(error, null);
    });
    
}
async function user_logoff(user_id, lang_code){
    //remove access token
    window.global_rest_at ='';
    window.global_user_account_id = '';
    updateOnlineStatus();
    document.getElementById('profile_avatar_online_status').className='';
    //get new data token to avoid endless loop och invalid token
    get_data_token(user_id, lang_code).then(function(){
        if (window.global_app_user_provider1_use==1){
            //nothing to do with provider1
            null;
        }
        if (window.global_app_user_provider2_use==1){
            //nothing to do with provider2
            null;
        }
        document.getElementById('dialogue_user_edit').style.visibility = "hidden";

        //clear user edit
        document.getElementById('user_edit_checkbox_profile_private').checked = false;
        document.getElementById('user_edit_input_username').value = '';
        document.getElementById('user_edit_input_bio').value = '';
        document.getElementById('user_edit_input_email').value = '';
        document.getElementById('user_edit_input_password').value = '';
        document.getElementById('user_edit_input_password_confirm').value = '';
        document.getElementById('user_edit_input_new_password').value = '';
        document.getElementById('user_edit_input_new_password_confirm').value = '';
        document.getElementById('user_edit_input_password_reminder').value = '';

        //clear login
        document.getElementById('login_username').value = '';
        document.getElementById('login_password').value = '';
        //clear signup
        document.getElementById('signup_username').value = '';
        document.getElementById('signup_email').value = '';
        document.getElementById('signup_password').value = '';
        document.getElementById('signup_password_confirm').value = '';
        document.getElementById('signup_password_reminder').value = '';

        document.getElementById('dialogue_profile').style.visibility = 'hidden';
        profile_clear();
        
    })
}
async function user_edit(user_id, timezone, lang_code,callBack) {
    let json;
    if (document.getElementById('dialogue_user_edit').style.visibility == 'visible') {
        document.getElementById('dialogue_user_edit').style.visibility = "hidden";
        document.getElementById('user_edit_checkbox_profile_private').checked = false;
        //common
        document.getElementById('user_edit_input_username').value = '';
        document.getElementById('user_edit_input_bio').value = '';
        //local
        document.getElementById('user_edit_input_email').value = '';
        document.getElementById('user_edit_input_password').value = '';
        document.getElementById('user_edit_input_password_confirm').value = '';
        document.getElementById('user_edit_input_new_password').value = '';
        document.getElementById('user_edit_input_new_password_confirm').value = '';
        document.getElementById('user_edit_input_password_reminder').value = '';
        //provider
        document.getElementById('user_edit_provider_logo').innerHTML = '';
        document.getElementById('user_edit_label_provider_id_edit_data').innerHTML = '';
        document.getElementById('user_edit_label_provider_name_edit_data').innerHTML = '';
        document.getElementById('user_edit_label_provider_email_edit_data').innerHTML = '';
        document.getElementById('user_edit_label_provider_image_url_edit_data').innerHTML = '';

        //account info
        document.getElementById('user_edit_label_data_last_logontime').value = '';
        document.getElementById('user_edit_label_data_account_created').value = '';
        document.getElementById('user_edit_label_data_account_modified').value = '';
        return callBack(null, null);
    } else {
        let status;
        //get user from REST API
        fetch(window.global_rest_url_base + window.global_rest_user_account + user_id +
                '?app_id=' + window.global_app_id +
                '&lang_code=' + lang_code, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + window.global_rest_at
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

                        document.getElementById('user_edit_checkbox_profile_private').checked = number_to_boolean(json.private);
                        document.getElementById('user_edit_input_username').value = json.username;
                        document.getElementById('user_edit_input_bio').value = get_null_or_value(json.bio);

                        if (json.provider1_id == null && json.provider2_id == null) {
                            document.getElementById('user_edit_local').style.display = 'block';
                            document.getElementById('user_edit_provider').style.display = 'none';

                            //display fetched avatar editable
                            document.getElementById('user_edit_avatar').style.display = 'block';
                            if (json.avatar == null || json.avatar == '')
                                recreate_img(document.getElementById('user_edit_avatar_img'));
                            else
                                document.getElementById('user_edit_avatar_img').src = image_format(json.avatar);
                            document.getElementById('user_edit_input_email').value = json.email;
                            document.getElementById('user_edit_input_password').value = '',
                                document.getElementById('user_edit_input_password_confirm').value = '',
                                document.getElementById('user_edit_input_new_password').value = '';
                            document.getElementById('user_edit_input_new_password_confirm').value = '';

                            document.getElementById('user_edit_input_password_reminder').value = json.password_reminder;
                        } else
                            if (json.provider1_id !== null) {
                                document.getElementById('user_edit_provider').style.display = 'block';
                                document.getElementById('user_edit_provider_logo').innerHTML = window.global_button_default_icon_provider1;
                                document.getElementById('user_edit_local').style.display = 'none';
                                document.getElementById('user_edit_label_provider_id_edit_data').innerHTML = json.provider1_id;
                                document.getElementById('user_edit_label_provider_name_edit_data').innerHTML = json.provider1_first_name + ' ' + json.provider1_last_name;
                                document.getElementById('user_edit_label_provider_email_edit_data').innerHTML = json.provider1_email;
                                document.getElementById('user_edit_label_provider_image_url_edit_data').innerHTML = json.provider1_image_url;
                                document.getElementById('user_edit_avatar').style.display = 'none';
                                if (json.provider1_image == null || json.provider1_image == '')
                                    recreate_img(document.getElementById('user_edit_avatar_img'));
                                else
                                    document.getElementById('user_edit_avatar_img').src = image_format(json.provider1_image);
                            } else
                                if (json.provider2_id !== null) {
                                    document.getElementById('user_edit_provider').style.display = 'block';
                                    document.getElementById('user_edit_provider_logo').innerHTML = window.global_button_default_icon_provider2;
                                    document.getElementById('user_edit_local').style.display = 'none';
                                    document.getElementById('user_edit_label_provider_id_edit_data').innerHTML = json.provider2_id;
                                    document.getElementById('user_edit_label_provider_name_edit_data').innerHTML = json.provider2_first_name + ' ' + json.provider2_last_name;
                                    document.getElementById('user_edit_label_provider_email_edit_data').innerHTML = json.provider2_email;
                                    document.getElementById('user_edit_label_provider_image_url_edit_data').innerHTML = json.provider2_image_url;
                                    document.getElementById('user_edit_avatar').style.display = 'none';
                                    if (json.provider2_image == null || json.provider2_image == '')
                                        recreate_img(document.getElementById('user_edit_avatar_img'));
                                    else
                                        document.getElementById('user_edit_avatar_img').src = image_format(json.provider2_image);
                                }
                        document.getElementById('user_edit_label_data_last_logontime').innerHTML = format_json_date(json.last_logontime, null, timezone, lang_code);
                        document.getElementById('user_edit_label_data_account_created').innerHTML = format_json_date(json.date_created, null, timezone, lang_code);
                        document.getElementById('user_edit_label_data_account_modified').innerHTML = format_json_date(json.date_modified, null, timezone, lang_code);
                        return callBack(null, {id: json.id,
                                               provider_1:      json.provider1_id,
                                               provider_2:      json.provider2_id,
                                               avatar:          json.avatar,
                                               provider1_image: json.provider1_image,
                                               provider2_image: json.provider2_image
                                              });
                    } else {
                        //User not found
                        show_message('ERROR', 20305, null, null, window.global_main_app_id, lang_code);
                        return callBack('ERROR', null);
                    }
                } else {
                    exception(status, result, lang_code);
                    return callBack(result, null);
                }
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
                return callBack(error, null);
            });
    }
}
async function user_update(user_id, lang_code, callBack) {
    let avatar = btoa(document.getElementById('user_edit_avatar_img').src);
    let username = document.getElementById('user_edit_input_username').value;
    let bio = document.getElementById('user_edit_input_bio').value;
    let email = document.getElementById('user_edit_input_email').value;
    let password = document.getElementById('user_edit_input_password').value;
    let password_confirm = document.getElementById('user_edit_input_password_confirm').value;
    let new_password = document.getElementById('user_edit_input_new_password').value;
    let new_password_confirm = document.getElementById('user_edit_input_new_password_confirm').value;
    let password_reminder = document.getElementById('user_edit_input_password_reminder').value;
    
    let url;
    let json;
    let json_data;
    let status;

    if (check_input(username, lang_code) == false ||
        check_input(bio, lang_code, 150) == false ||
        check_input(email, lang_code) == false ||
        check_input(password, lang_code) == false ||
        check_input(password_confirm, lang_code) == false ||
        check_input(new_password, lang_code) == false ||
        check_input(new_password_confirm, lang_code) == false ||
        check_input(password_reminder, lang_code) == false)
        return callBack('ERROR', null);
    //validate input
    if (username == '') {
        //"Please enter username"
        document.getElementById('user_edit_input_username').classList.add('input_error');
        show_message('ERROR', 20303, null, null, lang_code);
        return callBack('ERROR', null);
    }
    
    if (document.getElementById('user_edit_local').style.display == 'block') {
        json_data = `{ 
                        "username":"${username}",
                        "bio":"${bio}",
                        "private": ${boolean_to_number(document.getElementById('user_edit_checkbox_profile_private').checked)},
                        "password":"${password}",
                        "new_password":"${new_password}",
                        "password_reminder":"${password_reminder}",
                        "email":"${email}",
                        "avatar":"${avatar}"
                    }`;
        url = window.global_rest_url_base + window.global_rest_user_account + user_id;
        document.getElementById('user_edit_input_username').classList.remove('input_error');

        document.getElementById('user_edit_input_bio').classList.remove('input_error');
        document.getElementById('user_edit_input_email').classList.remove('input_error');

        document.getElementById('user_edit_input_password').classList.remove('input_error');
        document.getElementById('user_edit_input_password_confirm').classList.remove('input_error');
        document.getElementById('user_edit_input_new_password').classList.remove('input_error');
        document.getElementById('user_edit_input_new_password_confirm').classList.remove('input_error');

        document.getElementById('user_edit_input_password_reminder').classList.remove('input_error');

        if (password == '') {
            //"Please enter password"
            document.getElementById('user_edit_input_password').classList.add('input_error');
            show_message('ERROR', 20304, null, null, window.global_main_app_id, lang_code);
            return callBack('ERROR', null);
        }
        if (password != password_confirm) {
            //Password not the same
            document.getElementById('user_edit_input_password_confirm').classList.add('input_error');
            show_message('ERROR', 20301, null, null, window.global_main_app_id, lang_code);
            return callBack('ERROR', null);
        }
        //check new passwords
        if (new_password != new_password_confirm) {
            //New Password are entered but they are not the same
            document.getElementById('user_edit_input_new_password').classList.add('input_error');
            document.getElementById('user_edit_input_new_password_confirm').classList.add('input_error');
            show_message('ERROR', 20301, null, null, lang_code);
            return callBack('ERROR', null);
        }
    } else {
        json_data = `{"username":"${username}",
                      "bio":"${bio}",
                      "private":${boolean_to_number(document.getElementById('user_edit_checkbox_profile_private').checked)}
                     }`;
        url = window.global_rest_url_base + window.global_rest_user_account_common + user_id
    }
    let old_button = document.getElementById('user_edit_btn_user_update').innerHTML;
    document.getElementById('user_edit_btn_user_update').innerHTML = window.global_button_spinner;
    //update user using REST API
    fetch(url + '?app_id=' + window.global_app_id +
                '&lang_code=' + lang_code, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            document.getElementById('user_edit_btn_user_update').innerHTML = old_button;
            if (status == 200) {
                json = JSON.parse(result);
                document.getElementById('dialogue_user_edit').style.visibility = "hidden";
                document.getElementById('user_edit_avatar').style.display = 'none';

                document.getElementById('user_edit_checkbox_profile_private').checked = false;
                document.getElementById('user_edit_input_username').value = '';
                document.getElementById('user_edit_input_bio').value = '';
                document.getElementById('user_edit_input_email').value = '';
                document.getElementById('user_edit_input_password').value = '';
                document.getElementById('user_edit_input_password_confirm').value = '';
                document.getElementById('user_edit_input_new_password').value = '';
                document.getElementById('user_edit_input_new_password_confirm').value = '';
                document.getElementById('user_edit_input_password_reminder').value = '';
                //provider
                document.getElementById('user_edit_provider_logo').innerHTML = '';
                document.getElementById('user_edit_label_provider_id_edit_data').innerHTML = '';
                document.getElementById('user_edit_label_provider_name_edit_data').innerHTML = '';
                document.getElementById('user_edit_label_provider_email_edit_data').innerHTML = '';
                document.getElementById('user_edit_label_provider_image_url_edit_data').innerHTML = '';

                document.getElementById('user_edit_label_data_last_logontime').innerHTML = '';
                document.getElementById('user_edit_label_data_account_created').innerHTML = '';
                document.getElementById('user_edit_label_data_account_modified').innerHTML = '';
                return callBack(null, {username: username, 
                                       avatar: avatar,
                                       bio: bio});
            } else {
                exception(status, result, lang_code);
                return callBack(result, null);
            }
        })
        .catch(function(error) {
            document.getElementById('user_edit_btn_user_update').innerHTML = old_button;
            show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
            return callBack(error, null);
        });
}
function user_signup(item_destination_user_id, lang_code) {
    let username = document.getElementById('signup_username').value;
    let email = document.getElementById('signup_email').value;
    let password = document.getElementById('signup_password').value;
    let password_confirm = document.getElementById('signup_password_confirm').value;
    let password_reminder = document.getElementById('signup_password_reminder').value;

    if (check_input(username, lang_code) == false || 
        check_input(email, lang_code)== false ||
        check_input(password, lang_code)== false ||
        check_input(password_confirm, lang_code)== false ||
        check_input(password_reminder, lang_code)== false)
        return null;

    let json_data = `{
                    "username":"${username}",
                    "password":"${password}",
                    "password_reminder":"${password_reminder}",
                    "email":"${email}",
                    "active":0 ,
                    "user_language": "${navigator.language}",
                    "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
                    "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
                    "user_platform": "${navigator.platform}",
                    "client_latitude": "${window.global_client_latitude}",
                    "client_longitude": "${window.global_client_longitude}"
                    }`;
    let status;
    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, window.global_main_app_id, lang_code);
        return null;
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, window.global_main_app_id, lang_code);
        return null;
    }
    if (password != password_confirm) {
        //Password not the same
        show_message('ERROR', 20301, null, null, window.global_main_app_id, lang_code);
        return null;
    }

    let old_button = document.getElementById('signup_button').innerHTML;
    document.getElementById('signup_button').innerHTML = window.global_button_spinner;
    fetch(window.global_rest_url_base + window.global_rest_user_account_signup +
            '?app_id=' + window.global_app_id +
            '&lang_code=' + lang_code, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.global_rest_dt
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            document.getElementById('signup_button').innerHTML = old_button;
            if (status == 200) {
                json = JSON.parse(result);
                window.global_rest_at = json.accessToken;
                window.global_user_account_id = json.id;
                //update item with new user_account.id
                item_destination_user_id.innerHTML = json.id;
                let function_cancel_event = function() { dialogue_verify_clear();eval(`(function (){${window.global_exception_app_function}()}());`);};
                show_common_dialogue('VERIFY', 'SIGNUP', email, window.global_button_default_icon_logoff, function_cancel_event);
            } else {
                exception(status, result, lang_code);
            }
        })
        .catch(function(error) {
            document.getElementById('signup_button').innerHTML = old_button;
            show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
        });
}
async function user_verify_check_input(item, nextField, lang_code, callBack) {

    let status;
    let json;
    let json_data;
    let verification_type = parseInt(document.getElementById('user_verification_type').innerHTML);
    //only accept 0-9
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(document.getElementById(item.id).value) > -1)
        if (nextField == '' || (document.getElementById('user_verify_verification_char1').value != '' &
                document.getElementById('user_verify_verification_char2').value != '' &
                document.getElementById('user_verify_verification_char3').value != '' &
                document.getElementById('user_verify_verification_char4').value != '' &
                document.getElementById('user_verify_verification_char5').value != '' &
                document.getElementById('user_verify_verification_char6').value != '')) {
            //last field, validate entered code
            let verification_code = parseInt(document.getElementById('user_verify_verification_char1').value +
                document.getElementById('user_verify_verification_char2').value +
                document.getElementById('user_verify_verification_char3').value +
                document.getElementById('user_verify_verification_char4').value +
                document.getElementById('user_verify_verification_char5').value +
                document.getElementById('user_verify_verification_char6').value);
            let old_button = document.getElementById('user_verify_email').innerHTML;
            document.getElementById('user_verify_email').innerHTML = window.global_button_spinner;
            document.getElementById('user_verify_verification_char1').classList.remove('input_error');
            document.getElementById('user_verify_verification_char2').classList.remove('input_error');
            document.getElementById('user_verify_verification_char3').classList.remove('input_error');
            document.getElementById('user_verify_verification_char4').classList.remove('input_error');
            document.getElementById('user_verify_verification_char5').classList.remove('input_error');
            document.getElementById('user_verify_verification_char6').classList.remove('input_error');

            //activate user
            json_data = `{"verification_code":${verification_code},
                          "verification_type": ${verification_type}}`;
            fetch(window.global_rest_url_base + window.global_rest_user_account_activate + window.global_user_account_id +
                    '?app_id=' + window.global_app_id + 
                    '&lang_code=' + lang_code, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + window.global_rest_dt
                    },
                    body: json_data
                })
                .then(function(response) {
                    status = response.status;
                    return response.text();
                })
                .then(function(result) {
                    document.getElementById('user_verify_email').innerHTML = old_button;
                    if (status == 200) {
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
                                    document.getElementById('login_username').value =
                                        document.getElementById('signup_username').value;
                                    document.getElementById('login_password').value =
                                        document.getElementById('signup_password').value;
                                    break;
                                }
                                case 3:{
                                    //FORGOT
                                    window.global_rest_at	= json.accessToken;
                                    //show dialogue new password
                                    show_common_dialogue('NEW_PASSWORD', null, json.auth);
                                    break;
                                }
                            }
                            
                            document.getElementById('dialogue_login').style.visibility = "hidden";
                            
                            document.getElementById('dialogue_signup').style.visibility = 'hidden';
                            document.getElementById('signup_username').value = '';
                            document.getElementById('signup_email').value = '';
                            document.getElementById('signup_password').value = '';
                            document.getElementById('signup_password_confirm').value = '';
                            document.getElementById('signup_password_reminder').value = '';
                            dialogue_verify_clear();
                            return callBack(null, {"actived": 1, 
                                                   "verification_type" : verification_type});

                        } else {
                            document.getElementById('user_verify_verification_char1').classList.add('input_error');
                            document.getElementById('user_verify_verification_char2').classList.add('input_error');
                            document.getElementById('user_verify_verification_char3').classList.add('input_error');
                            document.getElementById('user_verify_verification_char4').classList.add('input_error');
                            document.getElementById('user_verify_verification_char5').classList.add('input_error');
                            document.getElementById('user_verify_verification_char6').classList.add('input_error');
                            //code not valid
                            show_message('ERROR', 20306, null, null, window.global_main_app_id, lang_code);
                            return callBack('ERROR', null);
                        }
                    } else {
                        exception(status, result, lang_code);
                        return callBack(result, null);
                    }
                })
                .catch(function(error) {
                    document.getElementById('user_verify_email').innerHTML = old_button;
                    show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
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
    let password = document.getElementById('user_edit_input_password').value;
    let status;
    switch (choice){
        case null:{
            if (user_local==true && password == '') {
                //"Please enter password"
                document.getElementById('user_edit_input_password').classList.add('input_error');
                show_message('ERROR', 20304, null, null, window.global_main_app_id, lang_code);
                return null;
            }
            show_message('CONFIRM',null,function_delete_event, null, null, window.global_app_id, lang_code);
            return callBack('CONFIRM',null);
            break;
        }
        case 1:{
            document.getElementById("dialogue_message").style.visibility = "hidden";
            document.getElementById('user_edit_input_username').classList.remove('input_error');
            document.getElementById('user_edit_input_bio').classList.remove('input_error');
            document.getElementById('user_edit_input_email').classList.remove('input_error');
            document.getElementById('user_edit_input_password').classList.remove('input_error');
            document.getElementById('user_edit_input_password_confirm').classList.remove('input_error');
            document.getElementById('user_edit_input_new_password').classList.remove('input_error');
            document.getElementById('user_edit_input_new_password_confirm').classList.remove('input_error');
            document.getElementById('user_edit_input_password_reminder').classList.remove('input_error');
    
            let old_button = document.getElementById('user_edit_btn_user_delete_account').innerHTML;
            document.getElementById('user_edit_btn_user_delete_account').innerHTML = window.global_button_spinner;
            let json_data = `{"password":"${password}"}`;
            fetch(window.global_rest_url_base + window.global_rest_user_account + user_account_id + 
                    '?app_id=' + window.global_app_id +
                    '&lang_code=' + lang_code, 
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + window.global_rest_at
                    },
                    body: json_data
                })
                .then(function(response) {
                    status = response.status;
                    return response.text();
                })
                .then(function(result) {
                    document.getElementById('user_edit_btn_user_delete_account').innerHTML = old_button;
                    if (status == 200)
                        return callBack(null,{deleted: 1});
                    else{
                        exception(status, result, lang_code);
                        return callBack(result,null);
                    }
                })
                .catch(function(error) {
                    document.getElementById('user_edit_btn_user_delete_account').innerHTML = old_button;
                    show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
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
                rest_path = window.global_rest_user_account_follow;
                json_data = '{"user_account_id":' + user_id_profile + '}';
                check_div = document.getElementById('profile_follow');
                break;
            }
        case 'LIKE':
            {
                rest_path = window.global_rest_user_account_like;
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
        fetch(window.global_rest_url_base + rest_path + user_id +
                '?app_id=' + window.global_app_id + 
                '&lang_code=' + lang_code, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.global_rest_at
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
                show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
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
    fetch(window.global_rest_url_base + window.global_rest_user_account_app +
            '?lang_code=' + lang_code, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.global_rest_at
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
            show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
        });
}
function user_account_app_delete(choice=null, user_account_id, app_id, lang_code, function_delete_event){
    let status;
    
    switch (choice){
        case null:{
            show_message('CONFIRM',null,function_delete_event, null, null, window.global_app_id, lang_code);
            break;
        }
        case 1:{
            document.getElementById("dialogue_message").style.visibility = "hidden";
    
            fetch(window.global_rest_url_base + window.global_rest_user_account_app + user_account_id + '/' + app_id +
                    '?app_id=' + window.global_app_id +
                    '&lang_code=' + lang_code, 
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + window.global_rest_at
                    }
                })
                .then(function(response) {
                    status = response.status;
                    return response.text();
                })
                .then(function(result) {
                    if (status == 200){
                        //execute event and refresh app list
                        document.getElementById('profile_main_btn_cloud').click()
                    }
                    else{
                        exception(status, result, lang_code);
                    }
                })
                .catch(function(error) {
                    show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
                });
        }
        default:
            break;
    }
}
async function user_forgot(){
    let email = document.getElementById('forgot_email').value;
    let json_data = `{
                    "email": "${email}",
                    "user_language": "${navigator.language}",
                    "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
                    "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
                    "user_platform": "${navigator.platform}",
                    "client_latitude": "${window.global_client_latitude}",
                    "client_longitude": "${window.global_client_longitude}"
                    }`;
    if (check_input(email, window.global_lang_code) == false || email =='')
        return;
    else{
        let old_button = document.getElementById('forgot_button').innerHTML;
        document.getElementById('forgot_button').innerHTML = window.global_button_spinner;
        fetch(window.global_rest_url_base + window.global_rest_user_account_forgot +
            '?app_id=' + window.global_app_id +
            '&lang_code=' + window.global_lang_code, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.global_rest_dt
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            document.getElementById('forgot_button').innerHTML = old_button;
            if (status == 200) {
                json = JSON.parse(result);
                if (json.sent == 1){
                    window.global_user_account_id = json.id;
                    let function_cancel_event = function() { document.getElementById('dialogue_user_verify').style.visibility='hidden';};
                    show_common_dialogue('VERIFY', 'FORGOT', email, window.global_button_default_icon_cancel, function_cancel_event);
                }            
            } else {
                exception(status, result, window.global_lang_code);
            }
        })
    }
}
function updatePassword(){
    let new_password = document.getElementById('user_new_password').value;
    let new_password_confirm = document.getElementById('user_new_password_confirm').value;
    let user_new_password_auth = document.getElementById('user_new_password_auth').innerHTML;
    let json_data = `{
                    "new_password" : "${new_password}",
                    "auth" : "${user_new_password_auth}",
                    "user_language": "${navigator.language}",
                    "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
                    "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
                    "user_platform": "${navigator.platform}",
                    "client_latitude": "${window.global_client_latitude}",
                    "client_longitude": "${window.global_client_longitude}"
                    }`;
    if (check_input(new_password, window.global_lang_code) == false ||
        check_input(new_password_confirm, window.global_lang_code) == false)
        return;
    else{
        if (new_password == '') {
            //"Please enter password"
            document.getElementById('user_new_password').classList.add('input_error');
            show_message('ERROR', 20304, null, null, window.global_main_app_id, lang_code);
            return callBack('ERROR', null);
        }
        if (new_password != new_password_confirm) {
            //Password not the same
            show_message('ERROR', 20301, null, null, window.global_main_app_id, lang_code);
            return null;
        }
        let old_button = document.getElementById('user_new_password_icon').innerHTML;
        document.getElementById('user_new_password_icon').innerHTML = window.global_button_spinner;
        fetch(window.global_rest_url_base + window.global_rest_user_account_password + window.global_user_account_id +
            '?app_id=' + window.global_app_id +
            '&lang_code=' + window.global_lang_code, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            document.getElementById('user_new_password_icon').innerHTML = old_button;
            if (status == 200) {
                json = JSON.parse(result);
                dialogue_new_password_clear();
                show_common_dialogue('LOGIN');
            } else {
                exception(status, result, window.global_lang_code);
            }
        })
    }
}
/*----------------------- */
/* USER PROVIDER          */
/*----------------------- */
async function init_providers(provider1_function, provider2_function){
    //enable provider 1 if used
    if (window.global_app_user_provider1_use==1){
        document.getElementById('g_id_onload').setAttribute('data-client_id', window.global_app_user_provider1_id);
        document.getElementById('g_id_onload').setAttribute('data-callback', provider1_function);
        document.getElementById('g_id_onload').setAttribute('data-auto_select', 'true');
        document.getElementsByClassName('g_id_signin')[0].setAttribute('data-shape', 'circle');
        document.getElementsByClassName('g_id_signin')[0].setAttribute('data-width', '268');
        document.getElementsByClassName('g_id_signin')[0].setAttribute('data-text', 'continue_with');

        /*Provider 1 SDK*/
        let tag = document.createElement('script');
        tag.src = window.global_app_user_provider1_api_src;
        tag.defer = true;
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    else
        document.getElementsByClassName('g_id_signin')[0].className += 'login_button_hidden';
    //enable provider 2 if used
    if (window.global_app_user_provider2_use==1){
        document.getElementById('login_provider2').addEventListener('click', provider2_function, false);
        /*Provider 2 SDK*/
        window.fbAsyncInit = function() {
            FB.init({
            appId      : window.global_app_user_provider2_id,
            cookie     : true,
            xfbml      : true,
            version    : window.global_app_user_provider2_api_version
            });
            
        };
        (function(d, s, id){
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = window.global_app_user_provider2_api_src + 
                    navigator.language.replace(/-/g, '_') + 
                    window.global_app_user_provider2_api_src2;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    else
        document.getElementById('login_provider2').className = 'login_button_hidden';
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
        elem.width = window.global_user_image_avatar_width;
        elem.height = window.global_user_image_avatar_height;
        let ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
        profile_image = ctx.canvas.toDataURL(window.global_image_file_mime_type);
        let json_data =
            `{
            "app_id": ${window.global_app_id},
            "active": 1,
            "provider_no": ${provider_no},
            "${'provider' + provider_no + '_id'}":"${profile_id}",
            "${'provider' + provider_no + '_first_name'}":"${profile_first_name}",
            "${'provider' + provider_no + '_last_name'}":"${profile_last_name}",
            "${'provider' + provider_no + '_image'}":"${btoa(profile_image)}",
            "${'provider' + provider_no + '_image_url'}":"${profile_image_url}",
            "${'provider' + provider_no + '_email'}":"${profile_email}",
            "user_language": "${navigator.language}",
            "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
            "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
            "user_platform": "${navigator.platform}",
            "client_latitude": "${window.global_client_latitude}",
            "client_longitude": "${window.global_client_longitude}"
            }`;
        fetch(window.global_rest_url_base + window.global_rest_user_account_provider + profile_id +
                '?lang_code=' + lang_code, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.global_rest_dt
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
                    window.global_rest_at = json.accessToken;
                    window.global_user_account_id = json.items[0].id;
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
                show_message('EXCEPTION', null,null, error, window.global_app_id, lang_code);
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
/*----------------------- */
/* EXCEPTION              */
/*----------------------- */
function exception(status, message, lang_code){
    if (status == 401)
        eval(`(function (){${window.global_exception_app_function}()}());`);
    else
        show_message('EXCEPTION',  null, null, message, window.global_app_id, lang_code);
}
/*----------------------- */
/* INIT                   */
/*----------------------- */
function set_app_globals_head() {
    //call this function from index.html i head before body is loaded
    //set meta tags in header        
    document.title = window.global_app_name;
    document.querySelector('meta[name="apple-mobile-web-app-title"]').setAttribute("content", window.global_app_name)
}
async function get_data_token(user_id, lang_code) {
    let status;
    let app_id;
    if (window.global_admin==true)
        app_id = window.global_main_app_id;
    else
        app_id = window.global_app_id;
    await fetch(window.global_service_auth + 
                '?app_id=' + app_id + 
                '&app_user_id=' + user_id +
                '&lang_code=' + lang_code, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(window.global_app_rest_client_id + ':' + window.global_app_rest_client_secret)
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            let json = JSON.parse(result);
            window.global_rest_dt = json.token_dt;
        }   
    })
}
function set_globals(parameters){
    window.global_app_id = parameters.app_id;
    window.global_exception_app_function = parameters.exception_app_function;

    window.global_admin = parameters.admin;
    window.global_service_auth = parameters.service_auth;
    window.global_app_rest_client_id = parameters.app_rest_client_id;
    window.global_app_rest_client_secret = parameters.app_rest_client_secret;
    window.global_rest_app_parameter = parameters.rest_app_parameter;

    window.global_client_latitude = parameters.gps_lat;
    window.global_client_longitude = parameters.gps_long;
    window.global_client_place = parameters.gps_place;
    
    window.global_app_name;
    window.global_app_hostname;
    window.global_main_app_id 					= 0;

    // if app not using translation then use default lang_code from navigator
    window.global_lang_code                     = navigator.language;
    window.global_rest_url_base 				= '/service/db/api/';

    window.global_app_copyright;
    
    window.global_app_user_provider1_use;
    window.global_app_user_provider1_id;
    window.global_app_user_provider1_name;
    window.global_app_user_provider1_api_src;
    window.global_app_user_provider2_use;
    window.global_app_user_provider2_id;
    window.global_app_user_provider2_name;
    window.global_app_user_provider2_api_version;
    window.global_app_user_provider2_api_src;
    window.global_app_user_provider2_api_src2;
    window.global_rest_at;
    window.global_rest_dt;
    window.global_rest_app;
    window.global_rest_app_object;
    window.global_rest_country;
    window.global_rest_language_locale;
    window.global_rest_message_translation;
    window.global_rest_user_account;
    window.global_rest_user_account_activate;
    window.global_rest_user_account_app;
    window.global_rest_user_account_common;
    window.global_rest_user_account_follow;
    window.global_rest_user_account_forgot;
    window.global_rest_user_account_like;
    window.global_rest_user_account_login;
    window.global_rest_user_account_profile_detail;
    window.global_rest_user_account_profile_searchA;
    window.global_rest_user_account_profile_searchD;
    window.global_rest_user_account_profile_top;
    window.global_rest_user_account_profile_username;
    window.global_rest_user_account_profile_userid;
    window.global_rest_user_account_provider;
    window.global_rest_user_account_signup;
    window.global_rest_user_account_update_password;
    //Images uploaded
    window.global_image_file_allowed_type1;
    window.global_image_file_allowed_type2;
    window.global_image_file_allowed_type3;
    window.global_image_file_mime_type;
    window.global_image_file_max_size;
    
    window.global_user_image_avatar_width;
    window.global_user_image_avatar_height;

    //services
    window.global_service_geolocation;
    window.global_service_geolocation_gps_place;
    window.global_service_geolocation_gps_ip;
    window.global_service_report;
    window.global_service_worldcities;
        
    window.global_user_account_id = '';
    window.global_clientId;
    window.global_eventSource;
    window.global_exception_app_function;
    if (parameters.ui==true){
        //spinner
        window.global_button_spinner = `<div id="button_spinner" class="load-spinner">
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
        //Icons
        window.global_button_default_icon_save = '<i class="fas fa-save"></i>';
        window.global_button_default_icon_add = '<i class="fas fa-plus-square"></i>';
        window.global_button_default_icon_delete = '<i class="fas fa-trash-alt"></i>';
        window.global_button_default_icon_edit = '<i class="fas fa-edit"></i>';

        window.global_button_default_icon_delete_account = '<i class="fa-solid fa-user-minus"></i>';
        window.global_button_default_icon_last_logontime = '<i class="fa-solid fa-right-to-bracket"></i>';
        window.global_button_default_icon_account_created = '<i class="fas fa-hands-helping"></i>';
        window.global_button_default_icon_account_modified = '<i class="fas fa-edit"></i>';

        window.global_button_default_icon_send = '<i class="fas fa-arrow-alt-circle-right"></i>';
        window.global_button_default_icon_login = '<i class="fa-solid fa-right-to-bracket"></i>';
        window.global_button_default_icon_logoff = '<i class="fa-solid fa-right-from-bracket"></i>';
        window.global_button_default_icon_signup = '<i class="fa-solid fa-user-pen"></i>';
        window.global_button_default_icon_forgot = '<i class="fa-solid fa-circle-question"></i>';
        window.global_button_default_icon_password = '<i class="fa-solid fa-unlock-keyhole"></i>';
        window.global_button_default_icon_sendmail = '<i class="fa-solid fa-envelope"></i>';
        window.global_button_default_icon_update = '<i class="fas fa-save"></i>';
        window.global_button_default_icon_delete_account = '<i class="fas fa-trash-alt"></i>';                                
        window.global_button_default_icon_profile = '<i class="fa-solid fa-id-card"></i>';
        window.global_button_default_icon_profile_top = '<i class="fa-solid fa-medal"></i>';
        window.global_button_default_icon_settings = '<i class="fa-solid fa-gear"></i>';
        window.global_button_default_icon_account_reminder = '<i class="fa-solid fa-circle-question"></i>';
        
        window.global_button_default_icon_chat = '<i class="fas fa-comment"></i>';
        window.global_button_default_icon_checkbox_checked = '<i class="fas fa-check-square"></i>';
        window.global_button_default_icon_checkbox_empty = '<i class="fas fa-square"></i>';
        window.global_button_default_icon_info = '<i class="fas fa-info-circle"></i>';
        window.global_button_default_icon_close = '<i class="fas fa-check-circle"></i>';
        window.global_button_default_icon_user = '<i class="fas fa-user"></i>';
        window.global_button_default_icon_avatar_edit = '<i class="fas fa-camera"></i>';
        window.global_button_default_icon_user_avatar = '<i class="fas fa-user-circle"></i>';

        window.global_button_default_icon_user_joined_date = '<i class="fas fa-hands-helping"></i>';
        window.global_button_default_icon_user_follow_user = '<i class="fas fa-user-plus"></i>';
        window.global_button_default_icon_user_followed_user = '<i class="fas fa-user-check"></i';
        window.global_button_default_icon_online = '<i class="fa-solid fa-circle"></i>';

        window.global_button_default_icon_home = '<i class="fas fa-home"></i>';
        window.global_button_default_icon_cloud = '<i class="fas fa-cloud"></i>';
        window.global_button_default_icon_provider1 = '<i class="fab fa-google"></i>';
        window.global_button_default_icon_provider2 = '<i class="fab fa-facebook"></i>';
        window.global_button_default_icon_map_my_location = '<i class="fas fa-crosshairs"></i>';

        window.global_button_default_icon_mobile = '<i class="fa-solid fa-mobile-screen-button"></i>';
        window.global_button_default_icon_search = '<i class="fas fa-search"></i>';
        window.global_button_default_icon_menu_open = '<i class="fas fa-bars"></i>';
        window.global_button_default_icon_menu_close = '<i class="fas fa-times-circle"></i>';
        window.global_button_default_icon_broadcast_close = '<i class="fas fa-times-circle"></i>';
        window.global_button_default_icon_first = '<i class="fas fa-fast-backward"></i>';
        window.global_button_default_icon_previous = '<i class="fas fa-backward"></i>';
        window.global_button_default_icon_next = '<i class="fas fa-forward"></i>';
        window.global_button_default_icon_last = '<i class="fas fa-fast-forward"></i>';

        window.global_button_default_icon_cancel =  '<i class="fas fa-times-circle"></i>';

        window.global_button_default_icon_zoomout = '<i class="fas fa-search-minus"></i>';
        window.global_button_default_icon_zoomin = '<i class="fas fa-search-plus"></i>';
        window.global_button_default_icon_left = '<i class="fas fa-arrow-alt-circle-left"></i>';
        window.global_button_default_icon_right = '<i class="fas fa-arrow-alt-circle-right"></i>';
        window.global_button_default_icon_up = '<i class="fas fa-arrow-alt-circle-up"></i>';
        window.global_button_default_icon_down = '<i class="fas fa-arrow-alt-circle-down"></i>';

        window.global_button_default_icon_day = '<i class="fas fa-calendar-day"></i>';
        window.global_button_default_icon_month = '<i class="fas fa-calendar-week"></i>';
        window.global_button_default_icon_year = '<i class="fas fa-calendar-alt"></i>';

        window.global_button_default_icon_like = '<i class="fas fa-heart"></i>';
        window.global_button_default_icon_unlike = '<i class="fas fa-heart-broken"></i>';
        window.global_button_default_icon_views = '<i class="fas fa-eye"></i>';
        window.global_button_default_icon_follows = '<i class="fas fa-user-friends"></i>';
        window.global_button_default_icon_followed = '<i class="fas fa-users"></i>';

        window.global_button_default_icon_align_left = '<i class="fa fa-align-left" tabindex="1"></i>';
        window.global_button_default_icon_align_center = '<i class="fa fa-align-center" tabindex="1"></i>';
        window.global_button_default_icon_align_right = '<i class="fa fa-align-left" tabindex="1"></i>';
        window.global_button_default_icon_remove = '<i class="fa fa-times" ></i>';
        window.global_button_default_icon_html = '<i class="fa-solid fa-file-code"></i>';
        window.global_button_default_icon_copy = '<i class="fas fa-copy"></i>';
        window.global_button_default_icon_pdf  = '<i class="fas fa-file-pdf"></i>';
        window.global_button_default_icon_link = '<i class="fa-solid fa-link"></i>';
        window.global_button_default_icon_tab_regional  = '<i class="fas fa-globe"></i>';
        window.global_button_default_icon_tab_gps  = '<i class="fas fa-map-marked-alt"></i>';
        window.global_button_default_icon_tab_design  = '<i class="fas fa-palette"></i>';
        window.global_button_default_icon_tab_image = '<i class="fas fa-images"></i>';
        window.global_button_default_icon_tab_text = '<i class="fas fa-text-height"></i>';
        window.global_button_default_icon_tab_prayer = '<i class="fas fa-pray"></i>';
        window.global_button_default_icon_tab_user = '<i class="fas fa-user"></i>';

        window.global_button_default_icon_slider_left = '<i class="fas fa-chevron-left"></i>';
        window.global_button_default_icon_slider_right = '<i class="fas fa-chevron-right"></i>';

        window.global_button_default_icon_print = '<i class="fas fa-print"></i>';
        window.global_button_default_icon_mail = '<i class="fas fa-envelope-square"></i>';
        window.global_button_default_icon_private = '<i class="fas fa-lock"></i>';
        //delay API calls when typing to avoid too many calls 
        window.global_typewatch = function() {
            let timer = 0;
            return function(callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        }();
    }   
}
function init_common(parameters){
    /*
    parameters:
    {app_id: 
     exception_app_function:
     close_eventsource:
     ui:
     admin:
     service_auth: 
     global_rest_client_id: 
     global_rest_client_secret:
     rest_app_parameter:
     gps_lat: 
     gps_long: 
     gps_place:
    }
    */
    set_globals(parameters);

    if (parameters.close_eventsource==true){
        window.global_eventSource.close();
        connectOnline();
    }
    else{
        connectOnline();
    }
   
    if (parameters.ui==true){
        //icons
        //
        document.getElementById('user_verify_email_icon').innerHTML = window.global_button_default_icon_mail;
        //dialogue login
        document.getElementById('login_tab1').innerHTML = window.global_button_default_icon_login;
        document.getElementById('login_tab2').innerHTML = window.global_button_default_icon_signup;
        document.getElementById('login_tab3').innerHTML = window.global_button_default_icon_forgot;
        document.getElementById('login_button').innerHTML = window.global_button_default_icon_login;
        document.getElementById('logo_provider2').innerHTML = window.global_button_default_icon_provider2;
        document.getElementById('login_close').innerHTML = window.global_button_default_icon_close;
        //dialogue signup
        document.getElementById('signup_tab1').innerHTML = window.global_button_default_icon_login;
        document.getElementById('signup_tab2').innerHTML = window.global_button_default_icon_signup;
        document.getElementById('signup_tab3').innerHTML = window.global_button_default_icon_forgot;
        document.getElementById('signup_button').innerHTML = window.global_button_default_icon_signup;
        document.getElementById('signup_close').innerHTML = window.global_button_default_icon_close;
        //dialogue forgot
        document.getElementById('forgot_tab1').innerHTML = window.global_button_default_icon_login;
        document.getElementById('forgot_tab2').innerHTML = window.global_button_default_icon_signup;
        document.getElementById('forgot_tab3').innerHTML = window.global_button_default_icon_forgot;
        document.getElementById('forgot_button').innerHTML = window.global_button_default_icon_sendmail;
        document.getElementById('forgot_close').innerHTML = window.global_button_default_icon_close;
        //dialogue new password
        document.getElementById('user_new_password_icon').innerHTML = window.global_button_default_icon_password;
        document.getElementById('user_new_password_cancel').innerHTML = window.global_button_default_icon_cancel;
        document.getElementById('user_new_password_ok').innerHTML = window.global_button_default_icon_close;
        
        //dialogue user edit
        document.getElementById('user_edit_btn_avatar_img').innerHTML = window.global_button_default_icon_avatar_edit;
        document.getElementById('user_edit_private').innerHTML = window.global_button_default_icon_private;
        document.getElementById('user_edit_btn_user_update').innerHTML = window.global_button_default_icon_update;
        document.getElementById('user_edit_btn_user_delete_account').innerHTML = window.global_button_default_icon_delete_account;
        document.getElementById('user_edit_close').innerHTML = window.global_button_default_icon_close;

        document.getElementById('user_edit_input_username_icon').innerHTML = window.global_button_default_icon_user;
        document.getElementById('user_edit_input_bio_icon').innerHTML = window.global_button_default_icon_profile;
        document.getElementById('user_edit_input_email_icon').innerHTML = window.global_button_default_icon_mail;
        document.getElementById('user_edit_input_password_icon').innerHTML = window.global_button_default_icon_password;
        document.getElementById('user_edit_input_password_confirm_icon').innerHTML = window.global_button_default_icon_password;
        document.getElementById('user_edit_input_new_password_icon').innerHTML = window.global_button_default_icon_password;
        document.getElementById('user_edit_input_new_password_confirm_icon').innerHTML = window.global_button_default_icon_password;
        document.getElementById('user_edit_input_password_reminder_icon').innerHTML = window.global_button_default_icon_account_reminder;

        document.getElementById('user_edit_label_last_logontime').innerHTML = window.global_button_default_icon_last_logontime;
        document.getElementById('user_edit_label_account_created').innerHTML = window.global_button_default_icon_account_created;
        document.getElementById('user_edit_label_account_modified').innerHTML = window.global_button_default_icon_account_modified;

        //dialogue message
        document.getElementById('message_cancel').innerHTML = window.global_button_default_icon_cancel;
        document.getElementById('message_close').innerHTML = window.global_button_default_icon_close;
        //broadcast
        document.getElementById('broadcast_close').innerHTML = window.global_button_default_icon_broadcast_close;
        //profile detail
        document.getElementById('profile_detail_header_following').innerHTML = window.global_button_default_icon_follows;
        document.getElementById('profile_detail_header_followed').innerHTML = window.global_button_default_icon_followed;
        document.getElementById('profile_detail_header_like').innerHTML = window.global_button_default_icon_like + window.global_button_default_icon_follows;
        document.getElementById('profile_detail_header_liked').innerHTML = window.global_button_default_icon_like + window.global_button_default_icon_followed;
        //profile info search
        document.getElementById('profile_search_icon').innerHTML = window.global_button_default_icon_search;
        //profile info
        document.getElementById('profile_joined_date_icon').innerHTML = window.global_button_default_icon_user_joined_date;
        document.getElementById('profile_follow_follow').innerHTML = window.global_button_default_icon_user_follow_user;
        document.getElementById('profile_follow_followed').innerHTML = window.global_button_default_icon_user_followed_user;
        document.getElementById('profile_like_like').innerHTML = window.global_button_default_icon_like;
        document.getElementById('profile_like_unlike').innerHTML = window.global_button_default_icon_unlike;
        document.getElementById('profile_info_view_count_icon').innerHTML = window.global_button_default_icon_views;
        document.getElementById('profile_main_btn_following').innerHTML = window.global_button_default_icon_follows;
        document.getElementById('profile_main_btn_followed').innerHTML = window.global_button_default_icon_followed;
        document.getElementById('profile_main_btn_likes').innerHTML = window.global_button_default_icon_like;
        document.getElementById('profile_main_btn_liked').innerHTML = window.global_button_default_icon_like + window.global_button_default_icon_followed;
        document.getElementById('profile_private_title').innerHTML = window.global_button_default_icon_private;
        document.getElementById('profile_avatar_online_status').innerHTML = window.global_button_default_icon_online;
        //profile top
        document.getElementById('profile_top_header').innerHTML = window.global_button_default_icon_profile_top;
        document.getElementById('profile_top_row1_1').innerHTML = window.global_button_default_icon_follows;
        document.getElementById('profile_top_row1_2').innerHTML = window.global_button_default_icon_like + window.global_button_default_icon_follows;
        document.getElementById('profile_top_row1_3').innerHTML = window.global_button_default_icon_views;
        document.getElementById('profile_home').innerHTML = window.global_button_default_icon_profile_top;
        document.getElementById('profile_close').innerHTML = window.global_button_default_icon_close;
        //login/signup/forgot
        document.getElementById('login_tab2').addEventListener('click', function() { show_common_dialogue('SIGNUP') }, false);
        document.getElementById('login_tab3').addEventListener('click', function() { show_common_dialogue('FORGOT') }, false);
        document.getElementById('login_close').addEventListener('click', function() { document.getElementById('dialogue_login').style.visibility = 'hidden' }, false);

        document.getElementById('signup_tab1').addEventListener('click', function() { show_common_dialogue('LOGIN') }, false);
        document.getElementById('signup_tab3').addEventListener('click', function() { show_common_dialogue('FORGOT') }, false);
        document.getElementById('signup_close').addEventListener('click', function() { document.getElementById('dialogue_signup').style.visibility = 'hidden' }, false);

        document.getElementById('forgot_tab1').addEventListener('click', function() { show_common_dialogue('LOGIN') }, false);
        document.getElementById('forgot_tab2').addEventListener('click', function() { show_common_dialogue('SIGNUP') }, false);

        document.getElementById("forgot_email").addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                user_forgot().then(function(){
                    //unfocus
                    document.getElementById("forgot_email").blur();
                });
            }
        });
        document.getElementById('forgot_button').addEventListener('click', function() { user_forgot()}, false);
        document.getElementById('forgot_close').addEventListener('click', function() { document.getElementById('dialogue_forgot').style.visibility = 'hidden' }, false);
        //dialogue message
        document.getElementById('message_cancel').addEventListener('click', function() { document.getElementById("dialogue_message").style.visibility = "hidden" }, false);
        //dialogue new password
        document.getElementById('user_new_password_cancel').addEventListener('click', function() { dialogue_new_password_clear(); }, false);
        document.getElementById('user_new_password_ok').addEventListener('click', function() { updatePassword(); }, false);
        
    }
};