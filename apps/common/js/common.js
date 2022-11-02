/*  Functions and globals in this order:
    MISC
    MESSAGE & DIALOGUE
    WINDOW INFO
    BROADCAST
    GPS
    MAP
    COUNTRY & CITIES
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
checkconnected = async () => {
    try {
      const testconnection = await fetch("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap", {method: "head", mode : 'no-cors'});
      return true;
    } catch (err) {
      return false;
    }
  };

async function common_fetch_basic(token_type, json_data,  username, password, callBack) {
    let url;
    let status;
    if (token_type==0){
        //data token
        url = window.global_service_auth + 
              '?app_user_id=' + window.global_user_account_id +
              '&app_id=' + window.global_app_id + 
              '&lang_code=' + window.global_user_locale;
        username = window.global_app_rest_client_id;
        password = window.global_app_rest_client_secret;
    }
    else{
        //admin token
        url = '/service/forms/admin/secure' + 
              '?app_id=' + window.global_app_id + 
              '&lang_code=' + window.global_user_locale;
    }
    await fetch(url,
                {method: 'POST',
                 headers: {
                            'Authorization': 'Basic ' + window.btoa(username + ':' + password)
                          },
                 body: json_data
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        switch (status){
            case 200:{
                //OK
                switch (token_type){
                    case 0:{
                        //data token
                        window.global_rest_dt = JSON.parse(result).token_dt;
                        break;
                    }
                    case 1:{
                        //admin token
                        window.global_rest_admin_at = JSON.parse(result).token_at;
                        break;
                    }
                }
                callBack(null, result);
                break;
            }
            case 400:{
                //Bad request
                show_message('INFO', null,null, result, window.global_app_id);
                callBack(result, null);
                break;
            }
            case 401:{
                //Unauthorized, wrong credentials
                show_message('INFO', null,null, JSON.parse(result).message, window.global_app_id);
                callBack(result, null);
                break;
            }
            case 404:{
                //Not found
                show_message('INFO', null,null, result, window.global_app_id);
                callBack(result, null);
                break;
            }
            case 500:{
                //Unknown error
                show_message('EXCEPTION', null,null, result, window.global_app_id);
                callBack(result, null);
                break;
            }
        }
    })
}
async function common_fetch(url_parameters, method, token_type, json_data, app_id_override, lang_code_override, callBack) {
    let status;

    let token;
    switch (token_type){
        case 0:{
            //data token
            token = window.global_rest_dt;
            break;
        }
        case 1:{
            //access token
            token = window.global_rest_at;
            break;
        }
        case 2:{
            //admin token
            token = window.global_rest_admin_at;
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
        app_id = window.global_app_id;
    }
    
    let lang_code;
    if (lang_code_override != null && lang_code_override !='')
       lang_code = lang_code_override;
    else
       lang_code = window.global_user_locale;
    let url = url_parameters +
              '&app_id=' + app_id + 
              '&lang_code=' + lang_code;
    //for accesstoken add parameter for authorization check
    if (token_type==1)
        url = url + '&user_account_logon_user_account_id=' + window.global_user_account_id;
    await fetch(url, 
                fetch_parameters)
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
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
                eval(`(function (){${window.global_exception_app_function}()}());`);
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
function toBase64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}	
function fromBase64(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
async function common_translate_ui(lang_code, callBack){
    let json;
    //translate objects
    await common_fetch(`${window.global_rest_url_base}${window.global_rest_app_object}${lang_code}?`, 
                 'GET', 0, null, null, null, (err, result) =>{
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
                                        document.getElementById('login_username').placeholder = json.data[i].text;
                                        document.getElementById('signup_username').placeholder = json.data[i].text;
                                        document.getElementById('user_edit_input_username').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'EMAIL':{
                                        document.getElementById('signup_email').placeholder = json.data[i].text;
                                        document.getElementById('forgot_email').placeholder = json.data[i].text;
                                        break;
                                    }
                                    case 'NEW_EMAIL':{
                                        document.getElementById('user_edit_input_new_email').placeholder = json.data[i].text;
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
                                    case 'CONFIRM_QUESTION':{
                                        document.getElementById(json.data[i].object_item_name.toLowerCase()).innerHTML = json.data[i].text;
                                        break;
                                    }
                                } 
                                break;
                            }
                            case 'APP':{
                                //translate items in current app
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
            common_fetch(window.global_rest_url_base + window.global_rest_language_locale + lang_code + '?', 
                            'GET', 0, null, null, null, (err, result) =>{
                if (err)
                    null;
                else{
                    json = JSON.parse(result);
                    let html='';
                    let select_locale = document.getElementById('user_locale_select');
                    let current_locale = select_locale.value;
                    for (let i = 0; i < json.locales.length; i++){
                        html += `<option id="${i}" value="${json.locales[i].locale}">${json.locales[i].text}</option>`;
                    }
                    select_locale.innerHTML = html;
                    select_locale.value = current_locale;
                }
                //translate regional settings
                json = '';
                common_fetch(window.global_rest_url_base + window.global_rest_setting + '?' +
                             'setting_type=DIRECTION', 
                             'GET', 0, null, null, null, (err, result) =>{
                    if (err)
                        null;
                    else{
                        json = JSON.parse(result);
                        let html='';
                        let select = document.getElementById('user_direction_select');
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
function get_null_or_value(value) {
    if (value == null)
        return '';
    else
        return value;
}
function format_json_date(db_date, short) {
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
                timeZone: window.global_user_timezone,
                year: 'numeric',
                month: 'long'
            };
        else
            options = {
                timeZone: window.global_user_timezone,
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
        let format_date = utc_date.toLocaleDateString(window.global_user_locale, options);
        return format_date;
    }
}

function mobile(){
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
   }
   
//function to convert buffert to one string
function toBase64_arr(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return window.atob(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}
function parseJwt(token) {
    try {
      return JSON.parse(window.atob(token.split('.')[1]));
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
            return toBase64_arr(arr.data);
        } else {
            //not buffer
            try {
                return window.atob(arr);
            } catch(e) {        
                return arr;
            }
        }
    }
}
function list_image_format_src(image){
    if (image=='' ||image==null)
        return '';
    else
        return `src='${image_format(image)}'`;
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
async function convert_image(image_url, image_width, image_height){
    //function to convert images to specified size and mime type according to parameters
    return new Promise(function (resolve){
        if (image_url=='')
            resolve('');
        else{
            let img = new Image();
            img.src = image_url;
            //update Content Security Policy with allowed domain
            //to allow any image url source, uncomment:
            //img.crossOrigin = 'Anonymous';
            img.onload = function(el) {
                let elem = document.createElement('canvas');
                elem.width = image_width;
                elem.height = image_height;
                let ctx = elem.getContext('2d');
                ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
                resolve(ctx.canvas.toDataURL(window.global_image_file_mime_type));    
            }
        }
    })
}
function set_avatar(avatar, item){
    if (avatar == null || avatar == '')
        recreate_img(item);
    else
        item.src = image_format(avatar);
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
function show_image(item_img, item_input, image_width, image_height) {
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
        show_message('ERROR', 20307, null,null, window.global_common_app_id);
    }
    else
        if (fileSize > window.global_image_file_max_size){
            //File size too large
            show_message('ERROR', 20308, null, null, window.global_common_app_id);
        }
        else {
            reader.onloadend = function(event) {
                convert_image(event.target.result, image_width, image_height).then(function(srcEncoded){
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
function getHostname(){
    return `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}`;
}
function check_input(text, text_length=100){
    if (text==null || text=='')
        return true;
    else{
        try {
            let check_text = JSON.parse(JSON.stringify(text));
            if (text.includes('"') ||
                text.includes('\\')){
                //not valid text
                show_message('ERROR', 20309, null, null, window.global_common_app_id);
                return false;
            }
        } catch (error) {
            //not valid text
            show_message('ERROR', 20309, null, null, window.global_common_app_id);
            return false;
        }
        try {
            //check default max length 100 characters or parameter value
            if (text.length>text_length){
                //text too long
                show_message('ERROR', 20310, null, null, window.global_common_app_id);
                return false;
            }
        } catch (error) {
            return false;
        }
        return true;
    }
}
function get_uservariables(){
    return `"user_language": "${navigator.language}",
            "user_timezone": "${Intl.DateTimeFormat().resolvedOptions().timeZone}",
            "user_number_system": "${Intl.NumberFormat().resolvedOptions().numberingSystem}",
            "user_platform": "${navigator.platform}",
            "client_latitude": "${window.global_client_latitude}",
            "client_longitude": "${window.global_client_longitude}"`;
}
function SearchAndSetSelectedIndex(search, select_item, colcheck) {
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
async function dialogue_close(dialogue){
    return new Promise(function (resolve, reject){
        var animationDuration = 400;
        /*
        //add sound effect if needed
        let meepmeep = document.createElement("audio");
        meepmeep.src = '/common/audio/meepmeep.ogg';
        meepmeep.play();
        */
        //setTimeout(function(){
            document.getElementById(dialogue).classList.add('dialogue_close');
            setTimeout(function(){
                document.getElementById(dialogue).style.visibility = 'hidden';
                document.getElementById(dialogue).classList.remove('dialogue_close');
                resolve();
            }, animationDuration);
        //}, animationDuration);
    })
}
function show_common_dialogue(dialogue, user_verification_type, title=null, icon=null, click_cancel_event) {
    switch (dialogue) {
        case 'PROFILE':
            {    
                dialogue_profile_clear();
                document.getElementById('dialogue_profile').style.visibility = 'visible';
                break;
            }
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
                    case 'NEW_EMAIL':{
                        document.getElementById('user_verification_type').innerHTML = 4;
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

function show_message(message_type, code, function_event, message_text='', data_app_id=null){
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
            common_fetch(window.global_rest_url_base + window.global_rest_message_translation + code + `?data_app_id=${data_app_id}`, 
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
function dialogue_user_edit_clear(){
    document.getElementById('dialogue_user_edit').style.visibility = "hidden";
    document.getElementById('user_edit_avatar').style.display = 'none';
                
    //common
    document.getElementById('user_edit_checkbox_profile_private').checked = false;
    document.getElementById('user_edit_input_username').value = '';
    document.getElementById('user_edit_input_bio').value = '';
    //local
    document.getElementById('user_edit_input_email').innerHTML = '';
    document.getElementById('user_edit_input_new_email').value = '';
    document.getElementById('user_edit_input_password').value = '';
    document.getElementById('user_edit_input_password_confirm').value = '';
    document.getElementById('user_edit_input_new_password').value = '';
    document.getElementById('user_edit_input_new_password_confirm').value = '';
    document.getElementById('user_edit_input_password_reminder').value = '';
    //provider
    document.getElementById('user_edit_provider_id').innerHTML = '';
    document.getElementById('user_edit_label_provider_id_data').innerHTML = '';
    document.getElementById('user_edit_label_provider_name_data').innerHTML = '';
    document.getElementById('user_edit_label_provider_email_data').innerHTML = '';
    document.getElementById('user_edit_label_provider_image_url_data').innerHTML = '';
    //account info
    document.getElementById('user_edit_label_data_last_logontime').innerHTML = '';
    document.getElementById('user_edit_label_data_account_created').innerHTML = '';
    document.getElementById('user_edit_label_data_account_modified').innerHTML = '';
}
function dialogue_login_clear(){
    document.getElementById('dialogue_login').style.visibility = 'hidden';
    document.getElementById('login_username').value = '';
    document.getElementById('login_password').value = '';
}
function dialogue_signup_clear(){
    document.getElementById('dialogue_signup').style.visibility = 'hidden';
    document.getElementById('signup_username').value = '';
    document.getElementById('signup_email').value = '';
    document.getElementById('signup_password').value = '';
    document.getElementById('signup_password_confirm').value = '';
    document.getElementById('signup_password_reminder').value = '';
}
function dialogue_forgot_clear(){
    document.getElementById('forgot_email').value = '';
}
function dialogue_profile_clear(){
    document.getElementById('profile_info').style.display = 'none';
    document.getElementById('profile_top').style.display = 'none';
    document.getElementById('profile_detail').style.display = 'none';
    
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
    document.getElementById('profile_detail_list').innerHTML = '';
    document.getElementById('profile_top_list').innerHTML = '';
}
function dialogue_user_edit_remove_error(){
    document.getElementById('user_edit_input_username').classList.remove('input_error');

    document.getElementById('user_edit_input_bio').classList.remove('input_error');
    document.getElementById('user_edit_input_new_email').classList.remove('input_error');

    document.getElementById('user_edit_input_password').classList.remove('input_error');
    document.getElementById('user_edit_input_password_confirm').classList.remove('input_error');
    document.getElementById('user_edit_input_new_password').classList.remove('input_error');
    document.getElementById('user_edit_input_new_password_confirm').classList.remove('input_error');

    document.getElementById('user_edit_input_password_reminder').classList.remove('input_error');
}
function lov_close(){
    //remove all event listeners
    document.querySelectorAll('.list_lov_row').forEach(e => 
        e.replaceWith(e.cloneNode(true))
    );
    document.getElementById('dialogue_lov').style.visibility = 'hidden';
    document.getElementById('lov_title').innerHTML='';
    document.getElementById('lov_search_input').value='';
    document.getElementById('lov_list').innerHTML='';
    
}
function lov_show(lov, function_event){
    document.getElementById('lov_title').innerHTML = lov.replace('_','');
    document.getElementById('dialogue_lov').style.visibility = 'visible';
    document.getElementById('lov_list').innerHTML = window.global_app_spinner;
    let url = '';
    let token_type = '';
    let lov_column_value='';
    switch (lov){
        case 'PARAMETER_TYPE':{
            lov_column_value = 'parameter_type_name';
            if (window.global_admin){
                url = window.global_rest_url_base + window.global_rest_parameter_type + `admin?`;
                token_type = 2;
            }
            else{
                url = window.global_rest_url_base + window.global_rest_parameter_type + `?`;
                token_type = 0;
            }
            break;
        }
        case 'SERVER_LOG_FILES':{
            lov_column_value = 'filename';
            url = window.global_service_log + '/files?';
            token_type = 2;
            break;
        }
        case 'APP_CATEGORY':{
            lov_column_value = 'app_category_text';
            url = window.global_rest_url_base + window.global_rest_app_category + '/admin?'
            token_type = 2;
            break;
        }
    }
    common_fetch(url, 'GET', token_type, null, null, null, (err, result) =>{
        if (err)
            document.getElementById('lov_list').innerHTML = '';
        else{
            document.getElementById('lov_list').innerHTML = '';
            json = JSON.parse(result);
            let html = '';
            for (i = 0; i < json.data.length; i++) {
                html += 
                `<div id='list_lov_row_${i}' class='list_lov_row'>
                    <div class='list_lov_col'>
                        <div>${json.data[i].id}</div>
                    </div>
                    <div class='list_lov_col'>
                        <div>${eval('json.data[i].' + lov_column_value)}</div>
                    </div>
                </div>`;
            }
            document.getElementById('lov_list').innerHTML = html;
            document.getElementById('lov_search_input').focus();
            document.querySelectorAll('.list_lov_row').forEach(e => e.addEventListener('click', function_event));
        }
    })
}
function lov_keys(event){
    //left 37, right 39, up 38, down 40, enter 13
    switch (event.keyCode){
        case 37:
        case 39:{
            break;
        }
        case 38:
        case 40:{
            //up 38
            //down 40
            //loop rows not hidden
            var x = document.querySelectorAll('.list_lov_row:not(.list_lov_row_hide)');
            for (i = 0; i <= x.length -1; i++) {
                if (x[i].classList.contains('list_lov_row_selected')){
                    //if up and first or
                    //if down and last
                    if ((event.keyCode==38 && i == 0)||
                        (event.keyCode==40 && i == x.length -1)){
                        if(event.keyCode==38){
                            //up
                            //if the first, set the last
                            x[i].classList.remove ('list_lov_row_selected');
                            x[x.length -1].classList.add ('list_lov_row_selected');
                        }
                        else{
                            //down
                            //if the last, set the first
                            x[i].classList.remove ('list_lov_row_selected');
                            x[0].classList.add ('list_lov_row_selected');
                        }
                        return;
                    }
                    else{
                        if(event.keyCode==38){
                            //up
                            //remove highlight, highlight previous
                            x[i].classList.remove ('list_lov_row_selected');
                            x[i-1].classList.add ('list_lov_row_selected');
                        }
                        else{
                            //down
                            //remove highlight, highlight next
                            x[i].classList.remove ('list_lov_row_selected');
                            x[i+1].classList.add ('list_lov_row_selected');
                        }
                        return;
                    }
                }
            }
            //no highlight found, highlight first
            x[0].classList.add ('list_lov_row_selected');
            break
        }
        case 13:{
            //enter
            var x = document.querySelectorAll('.list_lov_row');
            for (i = 0; i <= x.length -1; i++) {
                if (x[i].classList.contains('list_lov_row_selected')){
                    //event on row is set in app when calling lov, dispatch it!
                    x[i].dispatchEvent(new Event('click'))
                    x[i].classList.remove ('list_lov_row_selected');
                }
            }
            break
        }
        default:{
            //if db call will be implemented, add delay
            //window.global_typewatch(`lov_filter('${document.getElementById('lov_search_input').value}');`, 500); 
            lov_filter(document.getElementById('lov_search_input').value); 
            break;
        }    
    }
}
function lov_filter(text_filter){
    var x = document.querySelectorAll('.list_lov_row');
    for (i = 0; i <= x.length -1; i++) {
        x[i].classList.remove ('list_lov_row_hide');
        x[i].classList.remove ('list_lov_row_selected');
    }
    for (i = 0; i <= x.length -1; i++) {
        if (x[i].children[0].children[0].innerHTML.toUpperCase().indexOf(text_filter.toUpperCase()) > -1 ||
            x[i].children[1].children[0].innerHTML.toUpperCase().indexOf(text_filter.toUpperCase()) > -1){
                x[i].classList.remove ('list_lov_row_hide');
            }
        else{
            x[i].classList.remove ('list_lov_row_hide');
            x[i].classList.add ('list_lov_row_hide');
        }
    }
}

/*----------------------- */
/* WINDOW INFO            */
/*----------------------- */
function zoom_info(zoomvalue = '') {
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
function move_info(move1, move2) {
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
function show_window_info(info, show_toolbar, content, content_type, iframe_content){
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


    function show_url(url){
        document.getElementById('common_window_info_content').src=url;
        document.getElementById('common_window_info').style.overflowY = 'hidden'
        document.getElementById('common_window_info').style.visibility = 'visible';
    }
    switch(info){
        case 0:{
            document.getElementById('common_window_info_info').style.display = 'inline-block';
            document.getElementById('common_window_info_info').innerHTML = `<img src='${content}'/>`;
            document.getElementById('common_window_info').style.visibility = 'visible';
            break;
        }
        case 1:{
            show_url(window.global_info_link_policy_url);
            break;
        }    
        case 2:{
            show_url(window.global_info_link_disclaimer_url); 
            break;
        }    
        case 3:{
            show_url(window.global_info_link_terms_url); 
            break;
        }    
        case 4:{
            show_url(window.global_info_link_about_url); 
            break;
        }
        case null:{
            document.getElementById('common_window_info').style.visibility = 'visible';
            document.getElementById('common_window_info_info').innerHTML = window.global_app_spinner;
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
                    .then(function(response) {
                        return response.blob();
                    })
                    .then(function(pdf) {      
                        let reader = new FileReader();
                        reader.readAsDataURL(pdf); 
                        reader.onloadend = function() {
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
/* BROADCAST              */
/*----------------------- */
function maintenance_countdown(remaining) {
    if(remaining <= 0)
        location.reload(true);
    document.getElementById('maintenance_countdown').innerHTML = remaining;
    setTimeout(function(){ maintenance_countdown(remaining - 1); }, 1000);
};
function show_broadcast(broadcast_message){
    broadcast_message = window.atob(broadcast_message);
    let broadcast_type = JSON.parse(broadcast_message).broadcast_type;
    let message = JSON.parse(broadcast_message).broadcast_message;
    if (broadcast_type=='MAINTENANCE'){
        if (window.global_user_account_id !='' && window.global_user_account_id !=null)
            eval(`(function (){${window.global_exception_app_function}()}());`);
        document.getElementById('maintenance_message').innerHTML = window.global_icon_app_maintenance;
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
    common_fetch(`/service/broadcast/update_connected`+ 
                 `?client_id=${window.global_clientId}`+
                 `&admin_id=${window.global_admin_id}` + 
                 `&user_account_id=${window.global_user_account_id}` + 
                 `&identity_provider_id=${window.global_user_identity_provider_id}`, 
                 'PATCH', 0, null, null, null, (err, result) =>{
        null;
    })
}
function connectOnline(updateOnline=false){
    window.global_clientId = Date.now();
    window.global_eventSource = new EventSource(`/service/broadcast/connect/${window.global_clientId}` +
                                                `?app_id=${window.global_app_id}` +
                                                `&admin_id=${window.global_admin_id}` +
                                                `&user_account_id=${window.global_user_account_id}` +
                                                `&identity_provider_id=${window.global_user_identity_provider_id}` +
                                                `&admin=${window.global_admin}`);
    window.global_eventSource.onmessage = function (event) {
        
            show_broadcast(event.data);
    }
    window.global_eventSource.onerror = function (err) {
        window.global_eventSource.close();
        reconnect();
    }
}
function checkOnline(div_icon_online, user_account_id){
    common_fetch(`/service/broadcast/checkconnected/${user_account_id}?`, 
                 'GET', 0, null, null, null, (err, result) =>{
        if (JSON.parse(result).online == 1)
            document.getElementById(div_icon_online).className = 'online';
        else
            document.getElementById(div_icon_online).className= 'offline';
    })
}
/*----------------------- */
/* GPS                    */
/*----------------------- */
async function get_place_from_gps(longitude, latitude) {
    return await new Promise(function (resolve){
        let url;
        let tokentype;
        if (window.global_admin){
            url = window.global_service_geolocation + window.global_service_geolocation_gps_place + 
                    '/admin/?app_user_id=' + window.global_user_account_id +
                    '&longitude=' + longitude +
                    '&latitude=' + latitude;
            tokentype = 2;
        }
        else{
            url = window.global_service_geolocation + window.global_service_geolocation_gps_place + 
                    '?app_user_id=' + window.global_user_account_id +
                    '&longitude=' + longitude +
                    '&latitude=' + latitude;
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
async function get_gps_from_ip() {

    let url;
    let tokentype;
    if (window.global_admin){
        url = window.global_service_geolocation + window.global_service_geolocation_gps_ip + 
              '/admin?app_user_id=' +  window.global_user_account_id;
        tokentype = 2;
    }
    else{
        url = window.global_service_geolocation + window.global_service_geolocation_gps_ip + 
              '?app_user_id=' +  window.global_user_account_id;
        tokentype = 0;
    }
    await common_fetch(url, 'GET', tokentype, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            let json = JSON.parse(result);
            window.global_client_latitude  = json.geoplugin_latitude;
            window.global_client_longitude = json.geoplugin_longitude;
            if (json.geoplugin_city=='' && json.geoplugin_regionName =='' && json.geoplugin_countryName =='')
                window.global_client_place = '';
            else
                window.global_client_place = json.geoplugin_city + ', ' +
                                                json.geoplugin_regionName + ', ' +
                                                json.geoplugin_countryName;
        }
    })
}
async function tzlookup(latitude, longitude){
    return new Promise(function (resolve, reject){
        let url;
        let tokentype;
        if (window.global_admin){
            url = window.global_service_geolocation + window.global_service_geolocation_gps_timezone +
                  `/admin?latitude=${latitude}&longitude=${longitude}`;
            tokentype = 2;
        }
        else{
            url = window.global_service_geolocation + window.global_service_geolocation_gps_timezone +
                  `?latitude=${latitude}&longitude=${longitude}`;
            tokentype = 0;
        }
        common_fetch(url, 'GET', tokentype, null, null, null, (err, text_timezone) =>{
            resolve (text_timezone);
        })
    })
}
/*----------------------- */
/* MAP                    */
/*----------------------- */
async function map_init(containervalue, stylevalue, longitude, latitude, zoomvalue) {
    return await new Promise(function (resolve){
        if (checkconnected()) {
            window.global_session_service_map = '';
            window.global_session_service_map = L.map(containervalue).setView([latitude, longitude], zoomvalue);
            map_setstyle(stylevalue);
            //disable doubleclick in event dblclick since e.preventdefault() does not work
            window.global_session_service_map.doubleClickZoom.disable(); 

            //add fullscreen button and my location button with eventlisteners
            let mapcontrol = document.querySelectorAll(`#${containervalue} .leaflet-control`)
            mapcontrol[0].innerHTML += `<a id='map_fullscreen_id' href="#" title="Full Screen" role="button" aria-label="Full Screen"></a>`;
            document.getElementById('map_fullscreen_id').innerHTML= window.global_icon_map_fullscreen;
            if (window.global_client_latitude!='' && window.global_client_longitude!=''){
                mapcontrol[0].innerHTML += `<a id='map_my_location_id' href="#" title="My location" role="button" aria-label="My location"></a>`;
                document.getElementById('map_my_location_id').innerHTML= window.global_icon_map_my_location;
            }
            //add events to the buttons
            document.getElementById('map_fullscreen_id').addEventListener('click', 
                                    function() { 
                                                if (document.fullscreenElement)
                                                    document.exitFullscreen();
                                                else
                                                    document.getElementById(containervalue).requestFullscreen();
                                                }, 
                                    false);
            if (window.global_client_latitude!='' && window.global_client_longitude!='')
                document.getElementById('map_my_location_id').addEventListener('click', 
                                        function() { 
                                                    map_update(window.global_client_longitude,
                                                            window.global_client_latitude,
                                                            window.global_gps_map_zoom,
                                                            window.global_client_place,
                                                            null,
                                                            window.global_gps_map_marker_div_gps,
                                                            window.global_service_map_jumpto);
                                                    }, 
                                        false);
        }
        else
            resolve();
    })
    
}
function map_popup(popup_offset, popuptext, longitude, latitude){
    if (checkconnected()) {
        var popup = L.popup({ offset: [0, popup_offset], closeOnClick: false })
                    .setLatLng([latitude, longitude])
                    .setContent(popuptext)
                    .openOn(window.global_session_service_map);
    }
}
function map_marker(marker_id, longitude, latitude){
    if (checkconnected()) {
        var marker = L.marker([latitude, longitude]).addTo(window.global_session_service_map);
        //setting id so apps can customize if necessary
        marker._icon.id = marker_id;
    }
}
function map_update_gps(to_method, zoomvalue, longitude, latitude){
    if (checkconnected()) {
        switch (to_method){
            case 0:{
                if (zoomvalue == '')
                    window.global_session_service_map.setView(new L.LatLng(latitude, longitude));
                else
                    window.global_session_service_map.setView(new L.LatLng(latitude, longitude), zoomvalue);
                break;
            }
            case 1:{
                window.global_session_service_map.flyTo([latitude, longitude], zoomvalue)
                break;
            }
            //also have window.global_session_service_map.panTo(new L.LatLng({lng: longitude, lat: latitude}));
        }
    }
}
async function map_resize() {
    if (checkconnected()) {
        //fixes not rendering correct showing map div
        window.global_session_service_map.invalidateSize();
    }
}
function map_check_source(id){
    if (checkconnected()) {
        return false;
    }
}
function map_line_removeall(){
    if(window.global_session_service_map_layer)
        for (i=0;i<window.global_session_service_map_layer.length;i++)
            window.global_session_service_map.removeLayer(window.global_session_service_map_layer[i]);
    window.global_session_service_map_layer=[];
}
function map_line_create(id, title, text_size, from_longitude, from_latitude, to_longitude, to_latitude, color, width, opacity){
    if (checkconnected()) {
        var geojsonFeature = {
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
        var myStyle = {
            "color": color,
            "weight": width,
            "opacity": opacity
        };
        let layer = L.geoJSON(geojsonFeature, {style: myStyle}).addTo(window.global_session_service_map);
        if(!window.global_session_service_map_layer)
            window.global_session_service_map_layer=[];
        window.global_session_service_map_layer.push(layer);
    }
}
function map_setevent(event, function_event){
    if (checkconnected()) {
        //also creates event:
        //L.DomEvent.addListener(window.global_session_service_map, 'dblclick', function_event);
        window.global_session_service_map.on(event, function_event);
    }
}
function map_setstyle(mapstyle){
    if (checkconnected()) {
        if(window.global_session_service_map_OpenStreetMap_Mapnik)
            window.global_session_service_map.removeLayer(window.global_session_service_map_OpenStreetMap_Mapnik);
        if (window.global_session_service_map_Esri_WorldImagery)
            window.global_session_service_map.removeLayer(window.global_session_service_map_Esri_WorldImagery);
        switch (mapstyle){
            case 'OpenStreetMap_Mapnik':{
                window.global_session_service_map_OpenStreetMap_Mapnik = 
                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(window.global_session_service_map);
                break;
            }
            case 'Esri.WorldImagery':{
                window.global_session_service_map_Esri_WorldImagery = 
                    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    }).addTo(window.global_session_service_map);
                break;
            }
        }
    }
}
function map_update_popup(title) {
    document.getElementById('map_popup_title').innerHTML = title;
}
async function map_update(longitude, latitude, zoom, text_place, timezone_text = null, marker_id, to_method) {
    return new Promise(function (resolve){
        function map_update_text(timezone_text){
            let popuptext = `<div id="map_popup_title">${text_place}</div>
                             <div id="map_popup_sub_title">${window.global_icon_regional_timezone + window.global_icon_gps_position}</div>
                             <div id="map_popup_sub_title_timezone">${timezone_text}</div>`;
            map_popup(window.global_service_map_popup_offset, popuptext, longitude, latitude);
            map_marker(marker_id, longitude, latitude);
            resolve(timezone_text);
        }
        map_update_gps(to_method, zoom, longitude, latitude);
        if (timezone_text == null)
            tzlookup(latitude, longitude).then(function(tzlookup_text){
                map_update_text(tzlookup_text);
            })
        else{
            map_update_text(timezone_text);
        }
    })
}

/*----------------------- */
/* COUNTRY & CITIES       */
/*----------------------- */
async function get_cities(countrycode, callBack){
    await common_fetch(window.global_service_worldcities + '/' + countrycode +
                       '?app_user_id=' + window.global_user_account_id, 
                       'GET', 0, null, null, null, (err, result) =>{
        if (err)
            callBack(err, null);
        else{
            let json = JSON.parse(result);
            json.sort(function(a, b) {
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
        logoBackgroundTransparent: false,
        drawer: 'svg'
    });
}
/*----------------------- */
/* PROFILE                */
/*----------------------- */
function show_profile_click_events(item, click_function){
    document.querySelectorAll(item).forEach(e => e.addEventListener('click', function(event) {
        //execute function from inparameter or use default when not specified
        let profile_id = event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML;
        if (click_function ==null){
            profile_show(profile_id,
                        null,
                        (err, result)=>{
                            null;
                        });
        }
        else
            eval(`(function (){${click_function}(${profile_id},
                    ${null})}());`);
    }));
}
function profile_top(statschoice, app_rest_url = null, click_function=null) {
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
    common_fetch(url + statschoice + '?', 
                 'GET', 0, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            let profile_top_list = document.getElementById('profile_top_list');
            profile_top_list.innerHTML = '';
            let html ='';
            let image='';
            let name='';
            for (i = 0; i < json.count; i++) {
                image = list_image_format_src(json.items[i].avatar ?? json.items[i].provider_image)
                name = json.items[i].username;
                html +=
                `<div class='profile_top_list_row'>
                    <div class='profile_top_list_col'>
                        <div class='profile_top_list_user_account_id'>${json.items[i].id}</div>
                    </div>
                    <div class='profile_top_list_col'>
                        <img class='profile_top_list_avatar' ${image}>
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
            show_profile_click_events('.profile_top_list_username', click_function);
        }
    })
}
function profile_detail(detailchoice, rest_url_app, fetch_detail, header_app, click_function) {
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
    if (parseInt(window.global_user_account_id) || 0 !== 0) {
        switch (detailchoice) {
            case 0:
                {
                    //show only other app specific hide common
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
        if (fetch_detail){
            common_fetch(url + document.getElementById('profile_id').innerHTML +
                        '?detailchoice=' + detailchoice, 
                         'GET', 1, null, null, null, (err, result) =>{
                if (err)
                    null;
                else{
                    json = JSON.parse(result);
                    let profile_detail_list = document.getElementById('profile_detail_list');
                    profile_detail_list.innerHTML = '';

                    let html = '';
                    let image = '';
                    let delete_div ='';
                    for (i = 0; i < json.count; i++) {
                        if (window.global_app_id == window.global_main_app_id && detailchoice==5){
                            if (json.items[i].app_id !=0){
                                if (document.getElementById('profile_id').innerHTML==window.global_user_account_id)
                                    delete_div = `<div class='profile_detail_list_app_delete'>${global_icon_app_delete}</div>`;
                                    
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
                            image = list_image_format_src(json.items[i].avatar ?? json.items[i].provider_image)
                            html += 
                            `<div class='profile_detail_list_row'>
                                <div class='profile_detail_list_col'>
                                    <div class='profile_detail_list_user_account_id'>${json.items[i].id}</div>
                                </div>
                                <div class='profile_detail_list_col'>
                                    <img class='profile_detail_list_avatar' ${image}>
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
                        if (document.getElementById('profile_id').innerHTML==window.global_user_account_id){
                            document.querySelectorAll('.profile_detail_list_app_delete').forEach(e => e.addEventListener('click', function(event) {
                                user_account_app_delete(null, 
                                                        document.getElementById('profile_id').innerHTML,
                                                        event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML,
                                                        function() { 
                                                            document.getElementById('dialogue_message').style.visibility = 'hidden';
                                                            user_account_app_delete(1, 
                                                                                    document.getElementById('profile_id').innerHTML, 
                                                                                    event.target.parentNode.parentNode.parentNode.children[0].children[0].innerHTML, 
                                                                                    null);
                                                        });
                            }))
                        }
                    }
                    else
                        show_profile_click_events('.profile_detail_list_username', click_function);
                }
            })
        }
    } else
        show_common_dialogue('LOGIN');
}
function search_profile(click_function) {
    document.getElementById('profile_search_input').classList.remove('input_error');
    let profile_search_list = document.getElementById('profile_search_list');
    profile_search_list.innerHTML = '';
    document.getElementById('profile_search_list_wrap').style.display = 'none';
    profile_search_list.style.display = 'none';
    if (document.getElementById('profile_search_input').value=='')
        document.getElementById('profile_search_input').classList.add('input_error');
    else{
        let searched_username = document.getElementById('profile_search_input').value;
        let url;
        let token;
        let json_data;
        if (check_input(searched_username) == false)
            return;
        if (window.global_user_account_id!=''){
            //search using access token with logged in user_account_id
            url = window.global_rest_url_base + window.global_rest_user_account_profile_searchA;
            token = 1;
            json_data = `{
                        "user_account_id":${window.global_user_account_id},
                        "client_latitude": "${window.global_client_latitude}",
                        "client_longitude": "${window.global_client_longitude}"
                        }`;
        }
        else{
            //search using data token without logged in user_account_id
            url = window.global_rest_url_base + window.global_rest_user_account_profile_searchD;
            token = 0;
            json_data = `{
                        "client_latitude": "${window.global_client_latitude}",
                        "client_longitude": "${window.global_client_longitude}"
                        }`;
        }
        common_fetch(url + searched_username + '?', 
                     'POST', token, json_data, null, null, (err, result) =>{
            if (err)
                null;
            else{
                json = JSON.parse(result);
                if (json.count > 0){
                    profile_search_list.style.display = "inline-block";
                    document.getElementById('profile_search_list_wrap').style.display = 'flex';
                }
                let html = '';
                let image= '';
                let name = '';
                profile_search_list.style.height = (json.count * 24).toString() + 'px';
                for (i = 0; i < json.count; i++) {
                    image = list_image_format_src(json.items[i].avatar ?? json.items[i].provider_image)
                    name = json.items[i].username;
                    html +=
                    `<div class='profile_search_list_row'>
                        <div class='profile_search_list_col'>
                            <div class='profile_search_list_user_account_id'>${json.items[i].id}</div>
                        </div>
                        <div class='profile_search_list_col'>
                            <img class='profile_search_list_avatar' ${image}>
                        </div>
                        <div class='profile_search_list_col'>
                            <div class='profile_search_list_username'>
                                <a href='#'>${name}</a>
                            </div>
                        </div>
                    </div>`;
                }
                profile_search_list.innerHTML = html;
                show_profile_click_events('.profile_search_list_username', click_function);
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
async function profile_show(user_account_id_other = null, username = null, callBack) {
    let json;
    let user_account_id_search;
    let url;

    show_common_dialogue('PROFILE');
    if (user_account_id_other == null && window.global_user_account_id == '' && username == null) {
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
            user_account_id_search = window.global_user_account_id;
            url = window.global_rest_url_base + window.global_rest_user_account_profile_userid + user_account_id_search;
        }
        //PROFILE MAIN
        let json_data =
            `{
            "client_latitude": "${window.global_client_latitude}",
            "client_longitude": "${window.global_client_longitude}"
            }`;

        common_fetch(url + '?id=' + window.global_user_account_id, 
                     'POST', 0, json_data, null, null, (err, result) =>{
            if (err)
                return callBack(err,null);
            else{
                json = JSON.parse(result);
                document.getElementById('profile_info').style.display = "block";
                document.getElementById('profile_main').style.display = "block";
                document.getElementById('profile_id').innerHTML = json.id;
                set_avatar(json.avatar ?? json.provider_image, document.getElementById('profile_avatar')); 
                //show local username
                document.getElementById('profile_username').innerHTML = json.username;

                document.getElementById('profile_bio').innerHTML = get_null_or_value(json.bio);
                document.getElementById('profile_joined_date').innerHTML = format_json_date(json.date_created, true);
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
                if (window.global_user_account_id =='')
                    setTimeout(function(){show_common_dialogue('LOGIN')}, 2000);
                else
                    checkOnline('profile_avatar_online_status', json.id);
                return callBack(null,{profile_id: json.id,
                                      private: json.private});   
            }
        })
    }
}
function profile_close(){
    document.getElementById('dialogue_profile').style.visibility = 'hidden';
    dialogue_profile_clear();
}
async function profile_update_stat(callBack){
    let profile_id = document.getElementById('profile_id');
    let json_data =
    `{
        "client_latitude": "${window.global_client_latitude}",
        "client_longitude": "${window.global_client_longitude}"
    }`;
    //get updated stat for given user
    //to avoid update in stat set searched by same user
    let url = window.global_rest_url_base + window.global_rest_user_account_profile_userid + profile_id.innerHTML;
    common_fetch(url + '?id=' + profile_id.innerHTML, 
                 'POST', 0, json_data, null, null, (err, result) =>{
        if (err)
            return callBack(err,null);
        else{
            json = JSON.parse(result);
            document.getElementById('profile_info_view_count').innerHTML = json.count_views;
            document.getElementById('profile_info_following_count').innerHTML = json.count_following;
            document.getElementById('profile_info_followers_count').innerHTML = json.count_followed;
            document.getElementById('profile_info_likes_count').innerHTML = json.count_likes;
            document.getElementById('profile_info_liked_count').innerHTML = json.count_liked;
            return callBack(null, {id : json.id})
        }
    })
}
function search_input(event, event_function){
    //left 37, right 39, up 38, down 40, enter 13
    switch (event.keyCode){
        case 37:
        case 39:{
            break;
        }
        case 38:
        case 40:{
            //up 38
            //down 40
            if (document.getElementById('profile_search_list').style.display=='inline-block'){
                var x = document.querySelectorAll('.profile_search_list_row');
                for (i = 0; i <= x.length -1; i++) {
                    if (x[i].classList.contains('profile_search_list_selected'))
                        //if up and first or
                        //if down and last
                        if ((event.keyCode==38 && i == 0)||
                            (event.keyCode==40 && i == x.length -1)){
                            if(event.keyCode==38){
                                //up
                                //if the first, set the last
                                x[i].classList.remove ('profile_search_list_selected');
                                x[x.length -1].classList.add ('profile_search_list_selected');
                            }
                            else{
                                //down
                                //if the last, set the first
                                x[i].classList.remove ('profile_search_list_selected');
                                x[0].classList.add ('profile_search_list_selected');
                            }
                            return;
                        }
                        else{
                            if(event.keyCode==38){
                                //up
                                //remove highlight, highlight previous
                                x[i].classList.remove ('profile_search_list_selected');
                                x[i-1].classList.add ('profile_search_list_selected');
                            }
                            else{
                                //down
                                //remove highlight, highlight next
                                x[i].classList.remove ('profile_search_list_selected');
                                x[i+1].classList.add ('profile_search_list_selected');
                            }
                            return;
                        }
                }
                //no highlight found, highlight first
                x[0].classList.add ('profile_search_list_selected');
                return;
            }
            break
        }
        case 13:{
            //enter
            if (document.getElementById('profile_search_list').style.display=='inline-block'){
                var x = document.querySelectorAll('.profile_search_list_row');
                for (i = 0; i <= x.length -1; i++) {
                    if (x[i].classList.contains('profile_search_list_selected')){
                        /*Show profile and leave searchresult so user can go back to searchresult again*/
                        if (event_function ==null){
                            profile_show(x[i].children[0].children[0].innerHTML,
                                         null,
                                        (err, result)=>{
                                            null;
                                        });
                        }
                        else
                            eval(`(function (){${event_function}(${x[i].children[0].children[0].innerHTML},
                                    ${null})}());`);
                        x[i].classList.remove ('profile_search_list_selected');
                    }
                }
                return;
            }
            break
        }
        default:{
            window.global_typewatch(`search_profile(${event_function==null?'':'"' + event_function +'"'});`, 500); 
            break;
        }            
    }
}
/*----------------------- */
/* USER                   */
/*----------------------- */
async function user_login(username, password, callBack) {
    
    let json;
    let json_data;

    if (check_input(username) == false || check_input(password)== false)
        return callBack('ERROR', null);

    if (username == '') {
        //"Please enter username"
        show_message('ERROR', 20303, null, null, window.global_common_app_id);
        return callBack('ERROR', null);
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, window.global_common_app_id);
        return callBack('ERROR', null);
    }

    json_data = `{
                    "app_id": ${window.global_app_id},
                    "username":"${username}",
                    "password":"${password}",
                    ${get_uservariables()}
                 }`;

    //get user with username and password from REST API
    common_fetch(window.global_rest_url_base + window.global_rest_user_account_login + '?', 
                 'PUT', 0, json_data, null, null, (err, result) =>{
        if (err)
            return callBack(err, null);
        else{
            profile_close();
            json = JSON.parse(result);
            window.global_user_account_id = json.items[0].id;
            window.global_user_identity_provider_id = '';
            window.global_rest_at	= json.accessToken;
            updateOnlineStatus();
            user_preference_get((err, results) =>{
                if (json.items[0].active==0){
                    let function_cancel_event = function() { dialogue_verify_clear();eval(`(function (){${window.global_exception_app_function}()}());`);};
                    show_common_dialogue('VERIFY', 'LOGIN', json.items[0].email, window.global_icon_app_logoff, function_cancel_event);
                    return callBack('ERROR', null);
                }
                else{
                    dialogue_login_clear();
                    dialogue_signup_clear();
                    return callBack(null, {user_id: json.items[0].id,
                        username: json.items[0].username,
                        bio: json.items[0].bio,
                        avatar: json.items[0].avatar})
                }
            })
        }
    })    
}
async function user_logoff(){
    //remove access token
    window.global_rest_at ='';
    window.global_user_account_id = '';
    updateOnlineStatus();
    document.getElementById('profile_avatar_online_status').className='';
    //get new data token to avoid endless loop och invalid token
    await common_fetch_basic(0, null,  null, null,  (err, result)=>{
        dialogue_user_edit_clear();
        dialogue_verify_clear();
        dialogue_new_password_clear();
        dialogue_login_clear();
        dialogue_signup_clear();
        dialogue_forgot_clear();
        document.getElementById('dialogue_profile').style.visibility = 'hidden';
        dialogue_profile_clear();
        user_preferences_set_default_globals('LOCALE');
        user_preferences_set_default_globals('TIMEZONE');
        user_preferences_set_default_globals('DIRECTION');
        user_preferences_set_default_globals('ARABIC_SCRIPT');
        user_preferences_update_select();
    })
}
async function user_edit() {
    let json;
    //get user from REST API
    common_fetch(window.global_rest_url_base + window.global_rest_user_account + window.global_user_account_id + '?', 
                 'GET', 1, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            if (window.global_user_account_id == json.id) {
                document.getElementById('user_edit_local').style.display = 'none';
                document.getElementById('user_edit_provider').style.display = 'none';
                document.getElementById('dialogue_user_edit').style.visibility = "visible";

                document.getElementById('user_edit_checkbox_profile_private').checked = number_to_boolean(json.private);
                document.getElementById('user_edit_input_username').value = json.username;
                document.getElementById('user_edit_input_bio').value = get_null_or_value(json.bio);

                if (json.provider_id == null) {
                    document.getElementById('user_edit_local').style.display = 'block';
                    document.getElementById('user_edit_provider').style.display = 'none';

                    //display fetched avatar editable
                    document.getElementById('user_edit_avatar').style.display = 'block';
                    set_avatar(json.avatar, document.getElementById('user_edit_avatar_img')); 
                    document.getElementById('user_edit_input_email').innerHTML = json.email;
                    document.getElementById('user_edit_input_new_email').value = json.email_unverified;
                    document.getElementById('user_edit_input_password').value = '',
                        document.getElementById('user_edit_input_password_confirm').value = '',
                        document.getElementById('user_edit_input_new_password').value = '';
                    document.getElementById('user_edit_input_new_password_confirm').value = '';

                    document.getElementById('user_edit_input_password_reminder').value = json.password_reminder;
                } else{
                        document.getElementById('user_edit_local').style.display = 'none';
                        document.getElementById('user_edit_provider').style.display = 'block';
                        document.getElementById('user_edit_provider_id').innerHTML = json.identity_provider_id;
                        document.getElementById('user_edit_label_provider_id_data').innerHTML = json.provider_id;
                        document.getElementById('user_edit_label_provider_name_data').innerHTML = json.provider_first_name + ' ' + json.provider_last_name;
                        document.getElementById('user_edit_label_provider_email_data').innerHTML = json.provider_email;
                        document.getElementById('user_edit_label_provider_image_url_data').innerHTML = json.provider_image_url;
                        document.getElementById('user_edit_avatar').style.display = 'none';
                        set_avatar(json.provider_image, document.getElementById('user_edit_avatar_img')); 
                    } 
                document.getElementById('user_edit_label_data_last_logontime').innerHTML = format_json_date(json.last_logontime, null);
                document.getElementById('user_edit_label_data_account_created').innerHTML = format_json_date(json.date_created, null);
                document.getElementById('user_edit_label_data_account_modified').innerHTML = format_json_date(json.date_modified, null);
                set_avatar(json.avatar ?? json.provider_image, document.getElementById('user_menu_avatar_img'));
            } else {
                //User not found
                show_message('ERROR', 20305, null, null, window.global_common_app_id);
            }
        }
    })
}
async function user_update(callBack) {
    let username = document.getElementById('user_edit_input_username').value;
    let bio = document.getElementById('user_edit_input_bio').value;
    let avatar = window.btoa(document.getElementById('user_edit_avatar_img').src);
    let new_email = document.getElementById('user_edit_input_new_email').value;

    let url;
    let json_data;

    if (check_input(bio, 150) == false)
        return callBack('ERROR', null);
        
    if (document.getElementById('user_edit_local').style.display == 'block') {
        let email = document.getElementById('user_edit_input_email').innerHTML;    
        let password = document.getElementById('user_edit_input_password').value;
        let password_confirm = document.getElementById('user_edit_input_password_confirm').value;
        let new_password = document.getElementById('user_edit_input_new_password').value;
        let new_password_confirm = document.getElementById('user_edit_input_new_password_confirm').value;
        let password_reminder = document.getElementById('user_edit_input_password_reminder').value;
        if (check_input(username) == false ||
            check_input(new_email) == false ||
            check_input(password) == false ||
            check_input(password_confirm) == false ||
            check_input(new_password) == false ||
            check_input(new_password_confirm) == false ||
            check_input(password_reminder) == false)
            return callBack('ERROR', null);

        dialogue_user_edit_remove_error();
    
        //validate input
        if (username == '') {
            //"Please enter username"
            document.getElementById('user_edit_input_username').classList.add('input_error');
            show_message('ERROR', 20303, null, null);
            return callBack('ERROR', null);
        }
        if (password == '') {
            //"Please enter password"
            document.getElementById('user_edit_input_password').classList.add('input_error');
            show_message('ERROR', 20304, null, null, window.global_common_app_id);
            return callBack('ERROR', null);
        }
        if (password != password_confirm) {
            //Password not the same
            document.getElementById('user_edit_input_password_confirm').classList.add('input_error');
            show_message('ERROR', 20301, null, null, window.global_common_app_id);
            return callBack('ERROR', null);
        }
        //check new passwords
        if (new_password != new_password_confirm) {
            //New Password are entered but they are not the same
            document.getElementById('user_edit_input_new_password').classList.add('input_error');
            document.getElementById('user_edit_input_new_password_confirm').classList.add('input_error');
            show_message('ERROR', 20301, null, null);
            return callBack('ERROR', null);
        }
        json_data = `{ 
                        "username":"${username}",
                        "bio":"${bio}",
                        "private": ${boolean_to_number(document.getElementById('user_edit_checkbox_profile_private').checked)},
                        "password":"${password}",
                        "new_password":"${new_password}",
                        "password_reminder":"${password_reminder}",
                        "email":"${email}",
                        "new_email":${new_email==''?null:'"' + new_email + '"'},
                        "avatar":"${avatar}",
                        ${get_uservariables()}
                    }`;
        url = window.global_rest_url_base + window.global_rest_user_account + window.global_user_account_id;
    } else {
        json_data = `{"username":"${username}",
                      "bio":"${bio}",
                      "private":${boolean_to_number(document.getElementById('user_edit_checkbox_profile_private').checked)}
                     }`;
        url = window.global_rest_url_base + window.global_rest_user_account_common + window.global_user_account_id;
    }
    let old_button = document.getElementById('user_edit_btn_user_update').innerHTML;
    let json;
    document.getElementById('user_edit_btn_user_update').innerHTML = window.global_app_spinner;
    //update user using REST API
    common_fetch(url + '?', 
                 'PUT', 1, json_data, null, null, (err, result) =>{
        document.getElementById('user_edit_btn_user_update').innerHTML = old_button;
        if (err){    
            return callBack(err, null);
        }
        else{
            json = JSON.parse(result);
            if (json.sent_change_email == 1){
                let function_cancel_event = function() { document.getElementById('dialogue_user_verify').style.visibility='hidden';};
                show_common_dialogue('VERIFY', 'NEW_EMAIL', new_email, window.global_icon_app_cancel, function_cancel_event);
            }
            else
                dialogue_user_edit_clear();
            return callBack(null, {username: username, 
                                    avatar: avatar,
                                    bio: bio});
        }
    })
}
function user_signup() {
    let username = document.getElementById('signup_username').value;
    let email = document.getElementById('signup_email').value;
    let password = document.getElementById('signup_password').value;
    let password_confirm = document.getElementById('signup_password_confirm').value;
    let password_reminder = document.getElementById('signup_password_reminder').value;

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
        show_message('ERROR', 20303, null, null, window.global_common_app_id);
        return null;
    }
    if (password == '') {
        //"Please enter password"
        show_message('ERROR', 20304, null, null, window.global_common_app_id);
        return null;
    }
    if (password != password_confirm) {
        //Password not the same
        show_message('ERROR', 20301, null, null, window.global_common_app_id);
        return null;
    }

    let old_button = document.getElementById('signup_button').innerHTML;
    document.getElementById('signup_button').innerHTML = window.global_app_spinner;
    common_fetch(window.global_rest_url_base + window.global_rest_user_account_signup + '?', 
                 'POST', 0, json_data, null, null, (err, result) =>{    
        document.getElementById('signup_button').innerHTML = old_button;
        if (err){    
            null;
        }
        else{
            json = JSON.parse(result);
            window.global_rest_at = json.accessToken;
            window.global_user_account_id = json.id;
            let function_cancel_event = function() { dialogue_verify_clear();eval(`(function (){${window.global_exception_app_function}()}());`);};
            show_common_dialogue('VERIFY', 'SIGNUP', email, window.global_icon_app_logoff, function_cancel_event);
        }
    })
}
async function user_verify_check_input(item, nextField, callBack) {

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
            document.getElementById('user_verify_email').innerHTML = window.global_app_spinner;
            document.getElementById('user_verify_verification_char1').classList.remove('input_error');
            document.getElementById('user_verify_verification_char2').classList.remove('input_error');
            document.getElementById('user_verify_verification_char3').classList.remove('input_error');
            document.getElementById('user_verify_verification_char4').classList.remove('input_error');
            document.getElementById('user_verify_verification_char5').classList.remove('input_error');
            document.getElementById('user_verify_verification_char6').classList.remove('input_error');

            //activate user
            json_data = `{"verification_code":${verification_code},
                          "verification_type": ${verification_type},
                          ${get_uservariables()}
                         }`;
            common_fetch(window.global_rest_url_base + window.global_rest_user_account_activate + window.global_user_account_id + '?', 
                         'PUT', 0, json_data, null, null, (err, result) =>{    
                document.getElementById('user_verify_email').innerHTML = old_button;
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
                            case 4:{
                                //NEW EMAIL
                                break;
                            }
                        }
                        
                        document.getElementById('dialogue_login').style.visibility = "hidden";
                        
                        dialogue_signup_clear();
                        dialogue_forgot_clear();
                        dialogue_verify_clear();
                        dialogue_user_edit_clear();
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
                            show_message('ERROR', 20306, null, null, window.global_common_app_id);
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
async function user_delete(choice=null, user_local, function_delete_event, callBack ) {
    let password = document.getElementById('user_edit_input_password').value;
    switch (choice){
        case null:{
            if (user_local==true && password == '') {
                //"Please enter password"
                document.getElementById('user_edit_input_password').classList.add('input_error');
                show_message('ERROR', 20304, null, null, window.global_common_app_id);
                return null;
            }
            show_message('CONFIRM',null,function_delete_event, null, null, window.global_app_id);
            return callBack('CONFIRM',null);
            break;
        }
        case 1:{
            document.getElementById("dialogue_message").style.visibility = "hidden";
            dialogue_user_edit_remove_error();
    
            let old_button = document.getElementById('user_edit_btn_user_delete_account').innerHTML;
            document.getElementById('user_edit_btn_user_delete_account').innerHTML = window.global_app_spinner;
            let json_data = `{"password":"${password}"}`;

            common_fetch(window.global_rest_url_base + window.global_rest_user_account + window.global_user_account_id + '?', 
                         'DELETE', 1, json_data, null, null, (err, result) =>{    
                document.getElementById('user_edit_btn_user_delete_account').innerHTML = old_button;
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
function user_function(user_function, callBack) {
    let user_id_profile = document.getElementById('profile_id').innerHTML;
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

    if (window.global_user_account_id == '')
        show_common_dialogue('LOGIN');
    else {
        if (check_div.children[0].style.display == 'block') {
            method = 'POST';
        } else {
            method = 'DELETE';
        }
        common_fetch(window.global_rest_url_base + rest_path + window.global_user_account_id + '?', 
                         method, 1, json_data, null, null, (err, result) =>{    
            if (err)
                return callBack(err, null);
            else{
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
            }
        })
    }
}
function user_account_app_delete(choice=null, user_account_id, app_id, function_delete_event){    
    switch (choice){
        case null:{
            show_message('CONFIRM',null,function_delete_event, null, null, window.global_app_id);
            break;
        }
        case 1:{
            document.getElementById("dialogue_message").style.visibility = "hidden";
            common_fetch(window.global_rest_url_base + window.global_rest_user_account_app + user_account_id + '/' + app_id + '?', 
                         'DELETE', 1, null, null, null, (err, result) =>{    
                if (err)
                    null;
                else{
                    //execute event and refresh app list
                    document.getElementById('profile_main_btn_cloud').click()
                }
            })
            break;
        }
        default:
            break;
    }
}
async function user_forgot(){
    let email = document.getElementById('forgot_email').value;
    let json_data = `{
                        "email": "${email}",
                        ${get_uservariables()}
                     }`;
    if (check_input(email) == false || email =='')
        return;
    else{
        let old_button = document.getElementById('forgot_button').innerHTML;
        document.getElementById('forgot_button').innerHTML = window.global_app_spinner;
        common_fetch(window.global_rest_url_base + window.global_rest_user_account_forgot + '?', 
                     'PUT', 0, json_data, null, null, (err, result) =>{
            document.getElementById('forgot_button').innerHTML = old_button;
            if (err)
                null;
            else{
                json = JSON.parse(result);
                if (json.sent == 1){
                    window.global_user_account_id = json.id;
                    let function_cancel_event = function() { document.getElementById('dialogue_user_verify').style.visibility='hidden';};
                    show_common_dialogue('VERIFY', 'FORGOT', email, window.global_icon_app_cancel, function_cancel_event);
                }
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
                        ${get_uservariables()}
                     }`;
    if (check_input(new_password) == false ||
        check_input(new_password_confirm) == false)
        return;
    else{
        if (new_password == '') {
            //"Please enter password"
            document.getElementById('user_new_password').classList.add('input_error');
            show_message('ERROR', 20304, null, null, window.global_common_app_id);
            return callBack('ERROR', null);
        }
        if (new_password != new_password_confirm) {
            //Password not the same
            show_message('ERROR', 20301, null, null, window.global_common_app_id);
            return null;
        }
        let old_button = document.getElementById('user_new_password_icon').innerHTML;
        document.getElementById('user_new_password_icon').innerHTML = window.global_app_spinner;

        common_fetch(window.global_rest_url_base + window.global_rest_user_account_password + window.global_user_account_id + '?', 
                     'PUT', 1, json_data, null, null, (err, result) =>{
            document.getElementById('user_new_password_icon').innerHTML = old_button;
            if (err)
                null;
            else{
                dialogue_new_password_clear();
                show_common_dialogue('LOGIN');
            }
        })
    }
}
async function user_preference_save(){
    if (typeof window.global_user_preference_save=='undefined' && window.global_user_account_id != ''){
        let json_data =
        `{
        "preference_locale": "${document.getElementById('user_locale_select').value}",
        "setting_preference_timezone_id": "${document.getElementById('user_timezone_select').options[document.getElementById('user_timezone_select').selectedIndex].id}",
        "setting_preference_direction_id": "${document.getElementById('user_direction_select').options[document.getElementById('user_direction_select').selectedIndex].id}",
        "setting_preference_arabic_script_id": "${document.getElementById('user_arabic_script_select').options[document.getElementById('user_arabic_script_select').selectedIndex].id}"
        }`;

        await common_fetch(window.global_rest_url_base + window.global_rest_user_account_app + window.global_user_account_id + '?', 
                    'PATCH', 1, json_data, null, null, (err, result) =>{
            if (err)
                null;
            else{
                null;
            }
        })
    }
    
}
async function user_preference_get(callBack){
    await common_fetch(window.global_rest_url_base + window.global_rest_user_account_app + window.global_user_account_id + '?', 
                 'GET', 1, null, null, null, (err, result) =>{
        if (err)
            null;
        else{
            json = JSON.parse(result);
            //locale
            if (json.items[0].preference_locale==null){
                user_preferences_set_default_globals('LOCALE');
            }
            else{
                window.global_user_locale = json.items[0].preference_locale
            }
            //timezone
            if (json.items[0].setting_preference_timezone_id==null){
                user_preferences_set_default_globals('TIMEZONE');
            }
            else{
                SearchAndSetSelectedIndex(json.items[0].setting_preference_timezone_id, document.getElementById('user_timezone_select'), 0);
                window.global_user_timezone = document.getElementById('user_timezone_select').value;
            }
            //direction
            SearchAndSetSelectedIndex(json.items[0].setting_preference_direction_id, document.getElementById('user_direction_select'), 0);
            window.global_user_direction = document.getElementById('user_direction_select').value;
            //arabic script
            SearchAndSetSelectedIndex(json.items[0].setting_preference_arabic_script_id, document.getElementById('user_arabic_script_select'), 0);
            window.global_user_arabic_script = document.getElementById('user_arabic_script_select').value;
            user_preferences_update_select();
            return callBack(null, null)
        }
    })
}
function user_preferences_set_default_globals(preference){
    switch (preference){
        case 'LOCALE':{
            window.global_user_locale           = navigator.language.toLowerCase();
            break;
        }
        case 'TIMEZONE':{
            window.global_user_timezone         = Intl.DateTimeFormat().resolvedOptions().timeZone;
            break;
        }
        case 'DIRECTION':{
            window.global_user_direction        = ''; // ltr, rtl, initial, inherit
            break;
        }
        case 'ARABIC_SCRIPT':{
            window.global_user_arabic_script    = ''; /*classes 
                                                    font_arabic_sans (default)
                                                    font_arabic_kufi
                                                    font_arabic_nashk
                                                    font_arabic_nastaliq
                                                  */
            break;
        }
    }
}
function user_preferences_update_select(){
    SearchAndSetSelectedIndex(window.global_user_locale, document.getElementById('user_locale_select'), 1);
    SearchAndSetSelectedIndex(window.global_user_timezone, document.getElementById('user_timezone_select'), 1);
    SearchAndSetSelectedIndex(window.global_user_direction, document.getElementById('user_direction_select'), 1);
    SearchAndSetSelectedIndex(window.global_user_arabic_script, document.getElementById('user_arabic_script_select'), 1);

    //don't save changes now, just execute other code
    //or it would save preferences 4 times
    window.global_user_preference_save = false;
    document.getElementById('user_locale_select').dispatchEvent(new Event('change'))
	document.getElementById('user_timezone_select').dispatchEvent(new Event('change'))
	document.getElementById('user_direction_select').dispatchEvent(new Event('change'))
	document.getElementById('user_arabic_script_select').dispatchEvent(new Event('change'))
    delete window.global_user_preference_save;
}
/*----------------------- */
/* USER PROVIDER          */
/*----------------------- */
async function Providers_init(function_event){
    let div = document.getElementById('identity_provider_login');
    let json;
    div.innerHTML = window.global_app_spinner;
    common_fetch(window.global_rest_url_base + window.global_rest_identity_provider + '?', 
                 'GET', 0, null, null, null, (err, result) =>{
        if (err)
            div.innerHTML = '';
        else{
            div.innerHTML = '';
            json = JSON.parse(result);
            //load the buttons
            //user provider should use REST API on server if used
            let html = '';
            for (i=0;i <=json.items.length-1;i++){
                html += `<button id='login_provider_${i}' class='login_button login_provider_button' >
                            <div class='login_provider_id'>${json.items[i].id}</div>
                            <div class='login_provider_name'>${json.items[i].provider_name}</div>
                         </button>`;
                
            }
            div.innerHTML = html;
            document.querySelectorAll('.login_provider_button').forEach(e => e.addEventListener('click', function_event));
        }
    })
}
async function ProviderUser_update(identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, callBack) {    
    convert_image(profile_image_url, 
                  window.global_image_avatar_width,
                  window.global_image_avatar_height).then(function(profile_image){
        let json;
        let json_data =
        `{
        "app_id": ${window.global_app_id},
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
        common_fetch(window.global_rest_url_base + window.global_rest_user_account_provider + profile_id + '?', 
                    'PUT', 0, json_data, null, null, (err, result) =>{
            if (err)
                return callBack(err, null);
            else{
                json = JSON.parse(result);
                window.global_rest_at = json.accessToken;
                window.global_user_account_id = json.items[0].id;
                window.global_user_identity_provider_id = json.items[0].identity_provider_id;
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
async function ProviderSignIn(provider_button, callBack) {
    //add REST API to get user provider data
    return callBack(null, { identity_provider_id: provider_button.children[0].innerHTML,
                            profile_id: provider_button.children[0].innerHTML,
                            profile_first_name: `PROVIDER_USERNAME${provider_button.children[0].innerHTML}`,
                            profile_last_name: `PROVIDER LAST_NAME${provider_button.children[0].innerHTML}`,
                            profile_image_url: '',
                            profile_email: `PROVIDER_EMAIL${provider_button.children[0].innerHTML}@${location.hostname}`});
    
}
/*----------------------- */
/* EXCEPTION              */
/*----------------------- */
function exception(status, message){
    if (status == 401)
        eval(`(function (){${window.global_exception_app_function}()}());`);
    else
        show_message('EXCEPTION',  null, null, message, window.global_app_id);
}
/*----------------------- */
/* INIT                   */
/*----------------------- */
function set_globals(parameters){
    //app info
    window.global_common_app_id= 0;
    window.global_main_app_id= 1;
    window.global_app_id = parameters.app_id;
    window.global_app_name = parameters.app_name;
    window.global_app_url = parameters.app_url;
    window.global_app_logo = parameters.app_logo;

    window.global_app_copyright;

    //app exception function
    window.global_exception_app_function = parameters.exception_app_function;
    //admin true/false
    window.global_admin = parameters.admin;
    if(parameters.admin_id)
        window.global_admin_id = parameters.admin_id;
    else
        window.global_admin_id = '';
    //service auth path
    window.global_service_auth = parameters.service_auth;
    //client credentials
    window.global_app_rest_client_id = parameters.app_rest_client_id;
    window.global_app_rest_client_secret = parameters.app_rest_client_secret;
    //rest app parameters
    window.global_rest_app_parameter = parameters.rest_app_parameter;

    //user info
    window.global_user_account_id = '';
    window.global_user_identity_provider_id='';
    user_preferences_set_default_globals('LOCALE');
    user_preferences_set_default_globals('TIMEZONE');
    user_preferences_set_default_globals('DIRECTION');
    user_preferences_set_default_globals('ARABIC_SCRIPT');
    
    //user info set or used by services
    window.global_clientId;
    window.global_client_latitude = parameters.gps_lat;
    window.global_client_longitude = parameters.gps_long;
    window.global_client_place = parameters.gps_place;
    
    //broadcast connection
    window.global_eventSource;
    //rest api base
    window.global_rest_url_base 				= '/service/db/app_portfolio/';

    //rest api endpoints
    window.global_rest_at;
    window.global_rest_dt;
    window.global_rest_app;
    window.global_rest_app_category;
    window.global_rest_app_object;
    window.global_rest_country;
    window.global_rest_identity_provider;
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
    
    //image rules
    window.global_image_file_allowed_type1;
    window.global_image_file_allowed_type2;
    window.global_image_file_allowed_type3;
    window.global_image_file_mime_type;
    window.global_image_file_max_size;
    //avatar size
    window.global_image_avatar_width;
    window.global_image_avatar_height;

    //services
    window.global_service_geolocation;
    window.global_service_geolocation_gps_timezone;
    window.global_service_geolocation_gps_place;
    window.global_service_geolocation_gps_ip;
    window.global_service_report;
    window.global_service_worldcities;
        
    if (parameters.ui==true){
        seticons();

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
async function init_common(parameters, callBack){
    /*
    parameters:
    {app_id: 
     app_name:
     app_url:
     app_logo:
     exception_app_function:
     close_eventsource:
     ui:
     admin:
     admin_id:
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
    //set header info
    document.title = window.global_app_name;
    
    if (parameters.close_eventsource==true){
        window.global_eventSource.close();
        connectOnline();
    }
    else{
        connectOnline();
    }
   
    if (parameters.ui==true){
        //icons
        //dialogue user verify
        document.getElementById('user_verify_email_icon').innerHTML = window.global_icon_app_email;
        //dialogue login
        document.getElementById('login_tab1').innerHTML = window.global_icon_app_login;
        document.getElementById('login_tab2').innerHTML = window.global_icon_app_signup;
        document.getElementById('login_tab3').innerHTML = window.global_icon_app_forgot;
        document.getElementById('login_button').innerHTML = window.global_icon_app_login;
        document.getElementById('login_close').innerHTML = window.global_icon_app_close;
        //dialogue signup
        document.getElementById('signup_tab1').innerHTML = window.global_icon_app_login;
        document.getElementById('signup_tab2').innerHTML = window.global_icon_app_signup;
        document.getElementById('signup_tab3').innerHTML = window.global_icon_app_forgot;
        document.getElementById('signup_button').innerHTML = window.global_icon_app_signup;
        document.getElementById('signup_close').innerHTML = window.global_icon_app_close;
        //dialogue forgot
        document.getElementById('forgot_tab1').innerHTML = window.global_icon_app_login;
        document.getElementById('forgot_tab2').innerHTML = window.global_icon_app_signup;
        document.getElementById('forgot_tab3').innerHTML = window.global_icon_app_forgot;
        document.getElementById('forgot_button').innerHTML = window.global_icon_app_sendmail;
        document.getElementById('forgot_close').innerHTML = window.global_icon_app_close;
        //dialogue new password
        document.getElementById('user_new_password_icon').innerHTML = window.global_icon_user_password;
        document.getElementById('user_new_password_cancel').innerHTML = window.global_icon_app_cancel;
        document.getElementById('user_new_password_ok').innerHTML = window.global_icon_app_close;
        //dialogue user edit
        document.getElementById('user_edit_btn_avatar_img').innerHTML = window.global_icon_user_avatar_edit;
        document.getElementById('user_edit_private').innerHTML = window.global_icon_app_private;
        document.getElementById('user_edit_btn_user_update').innerHTML = window.global_icon_app_update;
        document.getElementById('user_edit_btn_user_delete_account').innerHTML = window.global_icon_user_delete_account;
        document.getElementById('user_edit_close').innerHTML = window.global_icon_app_close;
        document.getElementById('user_edit_label_provider').innerHTML = window.global_icon_provider;
        document.getElementById('user_edit_label_provider_id').innerHTML = window.global_icon_provider_id;
        document.getElementById('user_edit_label_provider_email').innerHTML = window.global_icon_app_email;
        document.getElementById('user_edit_input_username_icon').innerHTML = window.global_icon_user;
        document.getElementById('user_edit_input_bio_icon').innerHTML = window.global_icon_user_profile;
        document.getElementById('user_edit_input_email_icon').innerHTML = window.global_icon_app_email;
        document.getElementById('user_edit_input_new_email_icon').innerHTML = window.global_icon_app_email;
        document.getElementById('user_edit_input_password_icon').innerHTML = window.global_icon_user_password;
        document.getElementById('user_edit_input_password_confirm_icon').innerHTML = window.global_icon_user_password;
        document.getElementById('user_edit_input_new_password_icon').innerHTML = window.global_icon_user_password;
        document.getElementById('user_edit_input_new_password_confirm_icon').innerHTML = window.global_icon_user_password;
        document.getElementById('user_edit_input_password_reminder_icon').innerHTML = window.global_icon_user_account_reminder;
        document.getElementById('user_edit_label_last_logontime').innerHTML = window.global_icon_user_last_logontime;
        document.getElementById('user_edit_label_account_created').innerHTML = window.global_icon_user_account_created;
        document.getElementById('user_edit_label_account_modified').innerHTML = window.global_icon_user_account_modified;
        //dialogue message
        document.getElementById('message_cancel').innerHTML = window.global_icon_app_cancel;
        document.getElementById('message_close').innerHTML = window.global_icon_app_close;
        //dialog lov
        document.getElementById('lov_search_icon').innerHTML = window.global_icon_app_search;
        //broadcast
        document.getElementById('broadcast_close').innerHTML = window.global_icon_app_broadcast_close;
        //profile detail
        document.getElementById('profile_detail_header_following').innerHTML = window.global_icon_user_follows;
        document.getElementById('profile_detail_header_followed').innerHTML = window.global_icon_user_followed;
        document.getElementById('profile_detail_header_like').innerHTML = window.global_icon_user_like;
        document.getElementById('profile_detail_header_liked_heart').innerHTML = window.global_icon_user_like;
        document.getElementById('profile_detail_header_liked_users').innerHTML =  window.global_icon_user_followed;
        //profile info search
        document.getElementById('profile_search_icon').innerHTML = window.global_icon_app_search;
        //profile info
        document.getElementById('profile_joined_date_icon').innerHTML = window.global_icon_user_account_created;
        document.getElementById('profile_follow_follow').innerHTML = window.global_icon_user_follow_user;
        document.getElementById('profile_follow_followed').innerHTML = window.global_icon_user_followed_user;
        document.getElementById('profile_like_like').innerHTML = window.global_icon_user_like;
        document.getElementById('profile_like_unlike').innerHTML = window.global_icon_user_unlike;
        document.getElementById('profile_info_view_count_icon').innerHTML = window.global_icon_user_views;
        document.getElementById('profile_main_btn_following').innerHTML = window.global_icon_user_follows;
        document.getElementById('profile_main_btn_followed').innerHTML = window.global_icon_user_followed;
        document.getElementById('profile_main_btn_likes').innerHTML = window.global_icon_user_like;
        document.getElementById('profile_main_btn_liked_heart').innerHTML = window.global_icon_user_like;
        document.getElementById('profile_main_btn_liked_users').innerHTML = window.global_icon_user_followed;
        
        document.getElementById('profile_private_title').innerHTML = window.global_icon_app_private;
        document.getElementById('profile_avatar_online_status').innerHTML = window.global_icon_app_online;
        //profile top
        document.getElementById('profile_top_header').innerHTML = window.global_icon_user_profile_top;
        document.getElementById('profile_top_row1_1').innerHTML = window.global_icon_user_follows;
        document.getElementById('profile_top_row1_2').innerHTML = window.global_icon_user_like + window.global_icon_user_follows;
        document.getElementById('profile_top_row1_3').innerHTML = window.global_icon_user_views;
        document.getElementById('profile_home').innerHTML = window.global_icon_user_profile_top;
        document.getElementById('profile_close').innerHTML = window.global_icon_app_close;

        //profile button top
        document.getElementById('profile_btn_top').innerHTML = window.global_icon_user_profile_top;

        //window info
        document.getElementById('common_window_info_toolbar_btn_close').innerHTML = window.global_icon_app_close;
        document.getElementById('common_window_info_toolbar_btn_zoomout').innerHTML = window.global_icon_app_zoomout;
        document.getElementById('common_window_info_toolbar_btn_zoomin').innerHTML = window.global_icon_app_zoomin;
        document.getElementById('common_window_info_toolbar_btn_left').innerHTML =  window.global_icon_app_left;
        document.getElementById('common_window_info_toolbar_btn_right').innerHTML = window.global_icon_app_right;
        document.getElementById('common_window_info_toolbar_btn_up').innerHTML =  window.global_icon_app_up;
        document.getElementById('common_window_info_toolbar_btn_down').innerHTML = window.global_icon_app_down;
        document.getElementById('common_window_info_toolbar_btn_fullscreen').innerHTML = window.global_icon_presentation;
        
        //user menu
        //document.getElementById('user_menu_dropdown_profile').innerHTML = window.global_button_default_icon_profile;
        document.getElementById('user_menu_dropdown_edit').innerHTML = window.global_icon_app_edit;
        document.getElementById('user_menu_dropdown_log_out').innerHTML = window.global_icon_app_logoff;
        document.getElementById('user_menu_dropdown_signup').innerHTML = window.global_icon_app_signup;
        document.getElementById('user_menu_dropdown_log_in').innerHTML = window.global_icon_app_login;
        document.getElementById('user_menu_default_avatar').innerHTML = window.global_icon_user_avatar;
        document.getElementById('user_preference_locale').innerHTML = window.global_icon_regional_locale;
        document.getElementById('user_preference_timezone').innerHTML = window.global_icon_regional_timezone;
        document.getElementById('user_preference_direction').innerHTML = window.global_icon_regional_direction;        
        document.getElementById('user_preference_arabic_script').innerHTML = window.global_icon_regional_script;
        
        //events
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
        //set app info
        document.getElementById('login_app_name').innerHTML = window.global_app_name;
        document.getElementById('signup_app_name').innerHTML = window.global_app_name;
        document.getElementById('forgot_app_name').innerHTML = window.global_app_name;

        //dialogue message
        document.getElementById('message_cancel').addEventListener('click', function() { document.getElementById("dialogue_message").style.visibility = "hidden"; }, false);
        //dialogue new password
        document.getElementById('user_new_password_cancel').addEventListener('click', function() { dialogue_new_password_clear(); }, false);
        document.getElementById('user_new_password_ok').addEventListener('click', function() { updatePassword(); }, false);
        //dialogue lov
        document.getElementById('lov_search_input').addEventListener('keyup', function(event) {lov_keys(event)});
        document.getElementById('lov_search_icon').addEventListener('click', function() {lov_filter(document.getElementById('lov_search_input').value);});
        document.getElementById('lov_close').addEventListener('click', function() { lov_close()}, false); 
        //profile search
        if (document.getElementById('profile_info_search'))
            document.getElementById('profile_search_icon').addEventListener('click', function() { document.getElementById('profile_search_input').dispatchEvent(new KeyboardEvent('keyup')); }, false);
        //window info
        document.getElementById('common_window_info_toolbar_btn_close').addEventListener('click', function() { document.getElementById('common_window_info').style.visibility = "hidden"; 
                                                                                                               document.getElementById('common_window_info_info').innerHTML='';
                                                                                                               document.getElementById('common_window_info_content').src='';
                                                                                                               document.getElementById('common_window_info_content').classList=''
                                                                                                               document.getElementById('common_window_info_toolbar').classList=''}, false);
        document.getElementById('common_window_info_toolbar_btn_zoomout').addEventListener('click', function() {zoom_info(-1);}, false);
        document.getElementById('common_window_info_toolbar_btn_zoomin').addEventListener('click', function() {zoom_info(1);}, false);
        document.getElementById('common_window_info_toolbar_btn_left').addEventListener('click', function() {move_info(-1,0);}, false);
        document.getElementById('common_window_info_toolbar_btn_right').addEventListener('click', function() {move_info(1,0);}, false);
        document.getElementById('common_window_info_toolbar_btn_up').addEventListener('click', function() {move_info(0,-1);}, false);
        document.getElementById('common_window_info_toolbar_btn_down').addEventListener('click', function() {move_info(0,1);}, false);        
        document.getElementById('common_window_info_toolbar_btn_fullscreen').addEventListener('click', function() { if (document.fullscreenElement)
                                                                                                                        document.exitFullscreen();
                                                                                                                    else
                                                                                                                        document.body.requestFullscreen();
                                                                                                                  }, false);
        
        //user menu
        document.getElementById('user_menu').addEventListener('click', function() { let menu = document.getElementById('user_menu_dropdown');
                                                                                       if (menu.style.visibility == 'visible') 
                                                                                            menu.style.visibility = 'hidden'; 
                                                                                       else 
                                                                                            menu.style.visibility = 'visible' }, false);
        document.getElementById('user_menu_dropdown_log_in').addEventListener('click', function() { show_common_dialogue('LOGIN'); document.getElementById('user_menu_dropdown').style.visibility = 'hidden';}, false);
        document.getElementById('user_menu_dropdown_edit').addEventListener('click', function() { user_edit();document.getElementById('user_menu_dropdown').style.visibility = 'hidden'; }, false);
        document.getElementById('user_menu_dropdown_signup').addEventListener('click', function() { show_common_dialogue('SIGNUP'); document.getElementById('user_menu_dropdown').style.visibility = 'hidden'; }, false);
    
        if (document.getElementById('user_locale_select'))
            document.getElementById('user_locale_select').addEventListener('change', function() { window.global_user_locale = this.value; 
                                                                                                  user_preference_save(); }, false);
        if (document.getElementById('user_timezone_select'))
            document.getElementById('user_timezone_select').addEventListener('change', function() { window.global_user_timezone = this.value;
                                                                                                    user_preference_save().then(function(){
                                                                                                        if (document.getElementById('dialogue_user_edit').style.visibility == 'visible') {
                                                                                                            dialogue_user_edit_clear();
                                                                                                            user_edit();
                                                                                                        }
                                                                                                    });
                                                                                                    }, false);
        //define also in app if needed to adjust ui
        if (document.getElementById('user_direction_select'))
            document.getElementById('user_direction_select').addEventListener('change', function() { document.body.style.direction = this.value;
                                                                                                     window.global_user_direction = this.value;  
                                                                                                     user_preference_save();
                                                                                                     }, false);
        if (document.getElementById('user_arabic_script_select'))
            document.getElementById('user_arabic_script_select').addEventListener('change', function() { window.global_user_arabic_script = this.value;
                                                                                                         user_preference_save();
                                                                                                         }, false);
        SearchAndSetSelectedIndex(window.global_user_locale, document.getElementById('user_locale_select'), 1);
        SearchAndSetSelectedIndex(window.global_user_timezone, document.getElementById('user_timezone_select'), 1);
        SearchAndSetSelectedIndex(window.global_user_direction, document.getElementById('user_direction_select'), 1);
        SearchAndSetSelectedIndex(window.global_user_arabic_script, document.getElementById('user_arabic_script_select'), 1);
        
    }
    function set_common_parameters(app_id, parameter_name, parameter_value){
        if (app_id == 0){
            switch (parameter_name){
                case 'IMAGE_FILE_ALLOWED_TYPE1'             :{window.global_image_file_allowed_type1 = parameter_value;break;}
                case 'IMAGE_FILE_ALLOWED_TYPE2'             :{window.global_image_file_allowed_type2 = parameter_value;break;}
                case 'IMAGE_FILE_ALLOWED_TYPE3'             :{window.global_image_file_allowed_type3 = parameter_value;break;}
                case 'IMAGE_FILE_MIME_TYPE'                 :{window.global_image_file_mime_type = parameter_value;break;}
                case 'IMAGE_FILE_MAX_SIZE'                  :{window.global_image_file_max_size = parameter_value;break;}
                case 'IMAGE_AVATAR_WIDTH'                   :{window.global_image_avatar_width = parameter_value;break;}
                case 'IMAGE_AVATAR_HEIGHT'                  :{window.global_image_avatar_height = parameter_value;break;}
                case 'REST_APP'                             :{window.global_rest_app = parameter_value;break;}
                case 'REST_APP_CATEGORY'                    :{window.global_rest_app_category = parameter_value;break;}
                case 'REST_APP_OBJECT'                      :{window.global_rest_app_object = parameter_value;break;}
                case 'REST_COUNTRY'                         :{window.global_rest_country = parameter_value;break;}
                case 'REST_IDENTITY_PROVIDER'               :{window.global_rest_identity_provider = parameter_value;break;}
                case 'REST_LANGUAGE_LOCALE'                 :{window.global_rest_language_locale = parameter_value;break;}
                case 'REST_MESSAGE_TRANSLATION'             :{window.global_rest_message_translation = parameter_value;break;}
                case 'REST_PARAMETER_TYPE'                  :{window.global_rest_parameter_type = parameter_value;break;}
                case 'REST_SETTING'                         :{window.global_rest_setting = parameter_value;break;}
                case 'REST_USER_ACCOUNT'                    :{window.global_rest_user_account = parameter_value;break;}
                case 'REST_USER_ACCOUNT_ACTIVATE'           :{window.global_rest_user_account_activate = parameter_value;break;}
                case 'REST_USER_ACCOUNT_APP'                :{window.global_rest_user_account_app = parameter_value;break;}
                case 'REST_USER_ACCOUNT_COMMON'             :{window.global_rest_user_account_common = parameter_value;break;}
                case 'REST_USER_ACCOUNT_FOLLOW'             :{window.global_rest_user_account_follow = parameter_value;break;}
                case 'REST_USER_ACCOUNT_FORGOT'             :{window.global_rest_user_account_forgot = parameter_value;break;}
                case 'REST_USER_ACCOUNT_LIKE'               :{window.global_rest_user_account_like = parameter_value;break;}
                case 'REST_USER_ACCOUNT_LOGIN'              :{window.global_rest_user_account_login = parameter_value;break;}
                case 'REST_USER_ACCOUNT_PROFILE_DETAIL'     :{window.global_rest_user_account_profile_detail = parameter_value;break;}
                case 'REST_USER_ACCOUNT_PROFILE_SEARCHA'    :{window.global_rest_user_account_profile_searchA = parameter_value;break;}
                case 'REST_USER_ACCOUNT_PROFILE_SEARCHD'    :{window.global_rest_user_account_profile_searchD = parameter_value;break;}
                case 'REST_USER_ACCOUNT_PROFILE_TOP'        :{window.global_rest_user_account_profile_top = parameter_value;break;}
                case 'REST_USER_ACCOUNT_PROFILE_USERID'     :{window.global_rest_user_account_profile_userid = parameter_value;break;}
                case 'REST_USER_ACCOUNT_PROFILE_USERNAME'   :{window.global_rest_user_account_profile_username = parameter_value;break;}
                case 'REST_USER_ACCOUNT_PROVIDER'           :{window.global_rest_user_account_provider = parameter_value;break;}
                case 'REST_USER_ACCOUNT_SIGNUP'             :{window.global_rest_user_account_signup = parameter_value;break;}
                case 'REST_USER_ACCOUNT_PASSWORD'           :{window.global_rest_user_account_password = parameter_value;break;}
                case 'SERVICE_GEOLOCATION'                  :{window.global_service_geolocation = parameter_value;break;}
                case 'SERVICE_GEOLOCATION_GPS_IP'           :{window.global_service_geolocation_gps_ip = parameter_value;break;}
                case 'SERVICE_GEOLOCATION_GPS_PLACE'        :{window.global_service_geolocation_gps_place = parameter_value;break;}
                case 'SERVICE_GEOLOCATION_GPS_TIMEZONE'     :{window.global_service_geolocation_gps_timezone = parameter_value;break;}
                case 'SERVICE_MAP_FLYTO'                    :{window.global_service_map_flyto = parseInt(parameter_value);break;}
                case 'SERVICE_MAP_JUMPTO'                   :{window.global_service_map_jumpto = parseInt(parameter_value);break;}
                case 'SERVICE_MAP_POPUP_OFFSET'             :{window.global_service_map_popup_offset = parseInt(parameter_value);break;}
                case 'SERVICE_MAP_STYLE'                    :{window.global_service_map_style = parameter_value;break;}
                case 'SERVICE_REPORT'                       :{window.global_service_report = parameter_value;break;}
                case 'SERVICE_WORLDCITIES'                  :{window.global_service_worldcities = parameter_value;break;}
            }
        }
    }
    //get parameters
    let json;
    if (window.global_admin){
        await common_fetch(`${window.global_rest_url_base}${window.global_rest_app_parameter}admin/all/${window.global_app_id}?`,
                            'GET', 2, null, null, null, (err, result) =>{
            if (err)
                null;
            else{
                json = JSON.parse(result);
                for (let i = 0; i < json.data.length; i++) {
                    if (json.data[i].app_id == 0)
                        set_common_parameters(json.data[i].app_id, json.data[i].parameter_name, json.data[i].parameter_value);                            
                }
                callBack(null, null);
            }
        })
    }
    else{
        await common_fetch_basic(0, null,  null, null, (err, result)=>{
            null;
        })
        await common_fetch(window.global_rest_url_base + window.global_rest_app_parameter + window.global_app_id + '?',
                            'GET', 0, null, null, null, (err, result) =>{
            if (err)
                null;
            else{
                let global_app_parameters = [];
                json = JSON.parse(result);
                for (let i = 0; i < json.data.length; i++) {
                    if (json.data[i].app_id == 0)
                        set_common_parameters(json.data[i].app_id, json.data[i].parameter_name, json.data[i].parameter_value);
                    else{
                        global_app_parameters.push(JSON.parse(`{"app_id":${json.data[i].app_id}, 
                                                                "parameter_name":"${json.data[i].parameter_name}",
                                                                "parameter_value":${json.data[i].parameter_value==null?null:'"' + json.data[i].parameter_value + '"'}}`));
                    }
                }
                callBack(null, global_app_parameters)
            }
        })
    }
};