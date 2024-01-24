/**@ts-ignore */
const Vue = await import('Vue');
/**@ts-ignore */
const {React} = await import('React');
/**@ts-ignore */
const {ReactDOM} = await import('ReactDOM');
/**@ts-ignore */
const {QRCode} = await import('easy.qrcode');
/**@ts-ignore */
const {L:Leaflet} = await import('leaflet');
/**@ts-ignore */
const {getTimezone} = await import('regional');

/**@type{{body:{className:string, requestFullscreen:function, classList:{add:function, remove:function}},
 *        createElement:function,
 *        addEventListener:function,
 *        fullscreenElement:Element|null,
 *        exitFullscreen:function,
 *        querySelector:function,
 *        querySelectorAll:function}} */
 const AppDocument = document;
 /**
 * @typedef {object} AppEvent
 * @property {string} code
 * @property {function} preventDefault
 * @property {string} key
 * @property {boolean} altKey
 * @property {boolean} ctrlKey
 * @property {boolean} shiftKey
 * @property {{ id:                 string,
 *              innerHTML:          string,
 *              value:              string,
 *              parentNode:         {nextElementSibling:{querySelector:function}, style:{display:string}, classList: {contains:function}},
 *              nextElementSibling: {dispatchEvent:function},
 *              focus:              function,
 *              blur:               function,
 *              getAttribute:       function,
 *              setAttribute:       function,
 *              selectedIndex:      number,
 *              innerText:          string,
 *              nodeName:           string,
 *              dispatchEvent:      function,
 *              options:            HTMLOptionsCollection,
 *              'data-function':    function,
 *              classList:          {contains:function, remove:function, add:function}
 *              className:          string
 *            }}  target
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
    app_email:'',
    app_copyright:'',
    app_link_url:'',
    app_link_title:'',
    app_framework:'',
    info_link_policy_name:'',
    info_link_disclaimer_name:'',
    info_link_terms_name:'',
    info_link_about_name:'',
    info_link_policy_url:'',
    info_link_disclaimer_url:'',
    info_link_terms_url:'',
    info_link_about_url:'',
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

const ICONS = {
    'app_maintenance':          '⚒',
    'app_alert':                '🚨',
    'infinite':                 '∞',
};
Object.seal(ICONS);
/*-----------------------
  MISC                   

  local objects:
  checkconnected
  format_json_date
  convert_image
  get_uservariables
  
  ----------------------- */
/**
 * Finds recursive parent id. Use when current element can be an image or svg attached to an event element
 * @param {*} element 
 * @returns {*} 
 */
const element_id = element => element.id==''?element_id(element.parentNode):element.id;
/**
 * Finds recursive parent row with class common_row. Use when clicking in a list of records
 * @param {*} element 
 * @returns {*} 
 */
const element_row = element => element.classList.contains('common_row')?element:element_row(element.parentNode);
/**
 * Returns current target or parent with class list_title or returns empty. Use when clicking in a list title
 * @param {*} element 
 * @returns {*} 
 */
 const element_list_title = element => element.classList.contains('list_title')?element:(element.parentNode.classList.contains('list_title')?element.parentNode:null);

const LengthWithoutDiacrites = (str) =>{
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').length;
};
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
const checkconnected = async () => navigator.onLine;
let timer = 0;
//delay API calls when typing to avoid too many calls 
// ES6 spread operator, arrow function without function keyword
const typewatch = (function_name, ...parameter) =>{
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
        function_name(...parameter);
    }, type_delay);
};
const toBase64 = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
};	
const fromBase64 = (str) => {
    return decodeURIComponent(escape(window.atob(str)));
};
const common_translate_ui = async (lang_code) => {
    let path='';
    if (COMMON_GLOBAL.app_id == COMMON_GLOBAL.common_app_id){
        path = `/app_object/admin?data_lang_code=${lang_code}&object_name=APP`;
    }
    else{
        path = `/app_object?data_lang_code=${lang_code}&object_name=APP`;
    }
    //translate objects
    const app_objects_json = await FFB('DB_API', path, 'GET', 'APP_DATA', null);
    for (const app_object of JSON.parse(app_objects_json)){
        switch (app_object.object_name){
            case 'APP':{
                //translate common items
                switch  (app_object.object_item_name){
                    case 'USERNAME':{
                        AppDocument.querySelector('#common_user_start_login_username').setAttribute('placeholder', app_object.text);
                        AppDocument.querySelector('#common_user_start_signup_username').setAttribute('placeholder', app_object.text);
                        AppDocument.querySelector('#common_user_edit_input_username').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'EMAIL':{
                        AppDocument.querySelector('#common_user_start_signup_email').setAttribute('placeholder',app_object.text);
                        AppDocument.querySelector('#common_user_start_forgot_email').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'NEW_EMAIL':{
                        AppDocument.querySelector('#common_user_edit_input_new_email').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'BIO':{
                        AppDocument.querySelector('#common_user_edit_input_bio').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'PASSWORD':{
                        AppDocument.querySelector('#common_user_start_login_password').setAttribute('placeholder',app_object.text);
                        AppDocument.querySelector('#common_user_start_signup_password').setAttribute('placeholder',app_object.text);
                        AppDocument.querySelector('#common_user_edit_input_password').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'PASSWORD_CONFIRM':{
                        AppDocument.querySelector('#common_user_start_signup_password_confirm').setAttribute('placeholder',app_object.text);
                        AppDocument.querySelector('#common_user_edit_input_password_confirm').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'PASSWORD_REMINDER':{
                        AppDocument.querySelector('#common_user_start_signup_password_reminder').setAttribute('placeholder',app_object.text);
                        AppDocument.querySelector('#common_user_edit_input_password_reminder').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'NEW_PASSWORD_CONFIRM':{
                        AppDocument.querySelector('#common_user_edit_input_password_new_confirm').setAttribute('placeholder',app_object.text);
                        AppDocument.querySelector('#common_user_password_new_confirm').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'NEW_PASSWORD':{
                        AppDocument.querySelector('#common_user_edit_input_password_new').setAttribute('placeholder',app_object.text);
                        AppDocument.querySelector('#common_user_password_new').setAttribute('placeholder',app_object.text);
                        break;
                    }
                    case 'CONFIRM_QUESTION':{
                        AppDocument.querySelector('#common_confirm_question').innerHTML = app_object.text;
                        break;
                    }
                } 
                break;
            }
            case 'APP_LOV':{
                //translate items in select lists in current app
                const select_element = AppDocument.querySelector('#' + app_object.object_item_name.toLowerCase());
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
    const locales_json = await FFB('DB_API', path, 'GET', 'APP_DATA', null);
    let html='';
    const select_locale = AppDocument.querySelector('#common_user_locale_select');
    let i=0;
    for (const locale of JSON.parse(locales_json)){
        html += `<option id="${i}" value="${locale.locale}">${locale.text}</option>`;
        i++;
    }
    select_locale.innerHTML = html;
    select_locale.value = lang_code;
    await map_country(lang_code);
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
        /**@ts-ignore */
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
    const img = AppDocument.createElement('img');

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
                const elem = AppDocument.createElement('canvas');
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
    const file = AppDocument.querySelector('#' + item_input).files[0];
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
        show_message('ERROR', 20307, null,null, null, COMMON_GLOBAL.common_app_id);
    }
    else
        if (fileSize > COMMON_GLOBAL.image_file_max_size){
            //File size too large
            show_message('ERROR', 20308, null, null, null, COMMON_GLOBAL.common_app_id);
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
const input_control = (dialogue, elements) =>{
    let result = true;
    const valid_text = (element) =>{
        //remove any html
        element.innerHTML = element.innerText;
        if (element.innerText.indexOf(':') > -1 || element.innerText.includes('"') || element.innerText.includes('\\') )
            return false;
        else
            try {
                if (JSON.parse(JSON.stringify(element.innerText)))
                    return true;
                
            } catch (error) {
                return false;
            }
    };
    const set_error = (element, element2) => {
        element.classList.add('common_input_error');
        element2?element.classList.add('common_input_error'):null;
        result = false;
    };
    if (dialogue)
        dialogue.querySelectorAll('.common_input_error').forEach(element=>element.classList.remove('common_input_error'));
    
    if (elements.check_valid_list)
        for (const element of elements.check_valid_list){
            element[0].classList.remove('common_input_error');
        }

    //validate text content
    if (elements.username && valid_text(elements.username) == false){
        set_error(elements.username);
    }
    if (elements.password && valid_text(elements.password)== false){
        set_error(elements.password);
    }
    if (elements.password_reminder && valid_text(elements.password_reminder)== false){
        set_error(elements.password);
    }
    if (elements.password_new && valid_text(elements.password_new)){
        set_error(elements.password);
    }
    if (elements.password_new_confirm && valid_text(elements.password_new_confirm)){
        set_error(elements.password);
    }
    if (elements.email && valid_text(elements.email)== false){
        set_error(elements.email);
    }
    if (elements.bio && valid_text(elements.bio)== false){
        set_error(elements.bio);
    }
    if (elements.check_valid_list){
        for (const element of elements.check_valid_list){
            if (valid_text(element[0])==false)
                set_error(element[0]);
        }
    }
    //validate text length
    if (elements.username && elements.username.innerText.length > 100){
        set_error(elements.username);
    }
    if (elements.password && elements.password.innerText.length > 100){
        set_error(elements.password);
    }
    if (elements.password_reminder && elements.password_reminder.innerText.length > 100){
        set_error(elements.password_reminder);
    }
    if (elements.password_new && elements.password_new.innerText.length > 100){
        set_error(elements.password_new);
    }
    if (elements.bio && elements.bio.innerText.length > 150){
        set_error(elements.bio);
    }
    if (elements.check_valid_list){
        for (const element of elements.check_valid_list){
            if (element[0] && element[0].innerText > element[1])
                set_error(element);
        }
    }
    //validate not empty
    if (elements.username && elements.username.innerText == '') {
        set_error(elements.username);
    }
    if (elements.password && elements.password.innerText == '') {
        set_error(elements.password);
    }
    if (elements.email && elements.email.innerText == '') {
        set_error(elements.email);
    }
    if (elements.password && elements.password_confirm && elements.password_confirm.innerText ==''){
        set_error(elements.password_confirm);
    }
    //validate same password
    if (elements.password && elements.password_confirm && (elements.password.innerText != elements.password_confirm.innerText)){
        set_error(elements.password, elements.password_confirm);
    }
    if (elements.password_new && elements.password_new.innerText.length > 0 && (elements.password_new.innerText != elements.password_new_confirm.innerText)){
        set_error(elements.password_new, elements.password_new_confirm);
    }
    if (result==false){
        show_message('INFO', null, null, 'message_text','!', COMMON_GLOBAL.common_app_id);
        return false;
    }
    else
        return true;
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
            const meepmeep = AppDocument.createElement('audio');
            meepmeep.src = '/common/audio/meepmeep.ogg';
            meepmeep.play();
            soundDuration = 400;
        }
        else
            soundDuration = 0;

        setTimeout(()=>{
            AppDocument.querySelector('#' + dialogue).classList.add('common_dialogue_close');
            setTimeout(()=>{
                AppDocument.querySelector('#' + dialogue).style.visibility = 'hidden';
                AppDocument.querySelector('#' + dialogue).classList.remove('common_dialogue_close');
                resolve();
            }, animationDuration);
        }, soundDuration);
    });
    
};
const show_common_dialogue = (dialogue, user_verification_type, title=null, click_cancel_event) => {
    switch (dialogue) {
        case 'PROFILE':
            {    
                dialogue_profile_clear();
                AppDocument.querySelector('#common_dialogue_profile').style.visibility = 'visible';
                break;
            }
        case 'PASSWORD_NEW':
            {    
                AppDocument.querySelector('#common_user_password_new_auth').innerHTML=title;
                AppDocument.querySelector('#common_user_password_new').innerHTML='';
                AppDocument.querySelector('#common_user_password_new_confirm').innerHTML='';
                AppDocument.querySelector('#common_dialogue_user_password_new').style.visibility = 'visible';
                break;
            }
        case 'VERIFY':
            {    
                dialogue_verify_clear();
                switch (user_verification_type){
                    case 'LOGIN':{
                        AppDocument.querySelector('#common_user_verification_type').innerHTML = 1;
                        break;
                    }
                    case 'SIGNUP':{
                        AppDocument.querySelector('#common_user_verification_type').innerHTML = 2;
                        break;
                    }
                    case 'FORGOT':{
                        AppDocument.querySelector('#common_user_verification_type').innerHTML = 3;
                        break;
                    }
                    case 'NEW_EMAIL':{
                        AppDocument.querySelector('#common_user_verification_type').innerHTML = 4;
                        break;
                    }
                }
                AppDocument.querySelector('#common_user_verify_cancel')['data-function'] = click_cancel_event;

                AppDocument.querySelector('#common_user_verify_email').innerHTML = title;
                
                AppDocument.querySelector('#common_dialogue_user_start').style.visibility = 'hidden';
                AppDocument.querySelector('#common_dialogue_user_verify').style.visibility = 'visible';
                break;
            }
        case 'LOGIN':{
            AppDocument.querySelector('#common_dialogue_user_start').style.visibility='visible';
            AppDocument.querySelector('#common_user_start_login').click();
            break;
        }
        case 'LOGIN_SYSTEM_ADMIN':{
            AppDocument.querySelector('#common_dialogue_user_start').style.visibility='visible';
            AppDocument.querySelector('#common_user_start_login_system_admin').click();
            break;
        }
        case 'SIGNUP':{
            AppDocument.querySelector('#common_dialogue_user_start').style.visibility='visible';
            AppDocument.querySelector('#common_user_start_signup').click();
            break;
        }
        case 'FORGOT':{
            AppDocument.querySelector('#common_dialogue_user_start').style.visibility='visible';
            AppDocument.querySelector('#common_user_start_forgot').click();
            break;
        }
    }
    return null;   
};
/**
 * 
 * @param {'ERROR'|'INFO'|'EXCEPTION'|'CONFIRM'|'LOG'|'PROGRESS'} message_type 
 * @param {string} code 
 * @param {function} function_event 
 * @param {string|{part: number, total:number, text:string}} message 
 * @param {*} data_app_id 
 */
const show_message = async (message_type, code, function_event, text_class=null, message=null, data_app_id=null) => {
    const confirm_question = AppDocument.querySelector('#common_confirm_question');
    const progressbar = AppDocument.querySelector('#common_message_progressbar');
    const progressbar_wrap = AppDocument.querySelector('#common_message_progressbar_wrap');
    const message_title = AppDocument.querySelector('#common_message_title');
    const dialogue = AppDocument.querySelector('#common_dialogue_message');
    const button_close = AppDocument.querySelector('#common_message_close');
    const button_cancel = AppDocument.querySelector('#common_message_cancel');
    const function_close = () => { AppDocument.querySelector('#common_dialogue_message').style.visibility = 'hidden';};
    const fontsize_normal = '1em';
    const fontsize_log = '0.5em';
    const show = 'inline-block';
    const hide = 'none';
    AppDocument.querySelector('#common_message_title_icon').setAttribute('data-text_class',text_class);

    switch (message_type){
        case 'ERROR':{
            const text = await FFB('DB_API', `/message?code=${code}&data_app_id=${data_app_id}`, 'GET', 'APP_DATA')
                        .then(result=>JSON.parse(result)[0].text)
                        .catch(error=>error);
            confirm_question.style.display = hide;
            message_title.style.display = show;
            message_title.style.fontSize = fontsize_normal;
            progressbar.style.display = hide;
            progressbar_wrap.style.display = hide;
            button_cancel.style.display = hide;
            button_close.style.display = show;
            
            message_title.innerHTML = text;
            
            button_close['data-function'] = function_close;
            dialogue.style.visibility = 'visible';
            button_close.focus();
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
            button_close['data-function'] = function_close;
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
                        else
                            message_title.innerHTML= message;
                    }    
                }
            } catch (e) {
                //other error and json not returned, return the whole text
                message_title.innerHTML = message;
            }
            button_close['data-function'] = function_close;
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
            button_close['data-function'] = function_event;
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
            button_close['data-function'] = function_close;
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
    AppDocument.querySelector('#common_dialogue_user_verify').style.visibility = 'hidden';
    AppDocument.querySelector('#common_user_verification_type').innerHTML='';
    AppDocument.querySelector('#common_user_verify_email').innerHTML='';
    AppDocument.querySelector('#common_user_verify_verification_char1').innerHTML = '';
    AppDocument.querySelector('#common_user_verify_verification_char2').innerHTML = '';
    AppDocument.querySelector('#common_user_verify_verification_char3').innerHTML = '';
    AppDocument.querySelector('#common_user_verify_verification_char4').innerHTML = '';
    AppDocument.querySelector('#common_user_verify_verification_char5').innerHTML = '';
    AppDocument.querySelector('#common_user_verify_verification_char6').innerHTML = '';
    AppDocument.querySelector('#common_user_verify_cancel')['data-function'] = null;
};
const dialogue_password_new_clear = () => {
    AppDocument.querySelector('#common_dialogue_user_password_new').style.visibility = 'hidden';
    AppDocument.querySelector('#common_user_password_new_auth').innerHTML='';
    AppDocument.querySelector('#common_user_password_new').innerHTML='';
    AppDocument.querySelector('#common_user_password_new_confirm').innerHTML='';
    COMMON_GLOBAL.user_account_id = '';
    COMMON_GLOBAL.rest_at = '';
};
const dialogue_user_edit_clear = () => {
    AppDocument.querySelector('#common_dialogue_user_edit').style.visibility = 'hidden';
    AppDocument.querySelector('#common_user_edit_avatar').style.display = 'none';
                
    //common
    AppDocument.querySelector('#common_user_edit_checkbox_profile_private').classList.remove('checked');
    AppDocument.querySelector('#common_user_edit_input_username').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_bio').innerHTML = '';
    //local
    AppDocument.querySelector('#common_user_edit_input_email').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_new_email').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password_mask').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password_confirm').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password_confirm_mask').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password_new').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password_new_mask').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password_new_confirm').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password_new_confirm_mask').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_input_password_reminder').innerHTML = '';
    //provider
    AppDocument.querySelector('#common_user_edit_provider_id').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_label_provider_id_data').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_label_provider_name_data').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_label_provider_email_data').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_label_provider_image_url_data').innerHTML = '';
    //account info
    AppDocument.querySelector('#common_user_edit_label_data_last_logontime').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_label_data_account_created').innerHTML = '';
    AppDocument.querySelector('#common_user_edit_label_data_account_modified').innerHTML = '';
};
const dialogue_user_start_clear = () => {
    AppDocument.querySelector('#common_dialogue_user_start').style.visibility = 'hidden';
    AppDocument.querySelector('#common_user_start_login_username').innerHTML = '';
    AppDocument.querySelector('#common_user_start_login_password').innerHTML = '';
    AppDocument.querySelector('#common_user_start_login_password_mask').innerHTML = '';

    AppDocument.querySelector('#common_user_start_signup_username').innerHTML = '';
    AppDocument.querySelector('#common_user_start_signup_email').innerHTML = '';
    AppDocument.querySelector('#common_user_start_signup_password').innerHTML = '';
    AppDocument.querySelector('#common_user_start_signup_password_mask').innerHTML = '';
    AppDocument.querySelector('#common_user_start_signup_password_confirm').innerHTML = '';
    AppDocument.querySelector('#common_user_start_signup_password_confirm_mask').innerHTML = '';
    AppDocument.querySelector('#common_user_start_signup_password_reminder').innerHTML = '';

    AppDocument.querySelector('#common_user_start_forgot_email').innerHTML = '';
};
const dialogue_profile_clear = () => {
    AppDocument.querySelector('#common_profile_info').style.display = 'none';
    AppDocument.querySelector('#common_profile_top').style.display = 'none';
    AppDocument.querySelector('#common_profile_detail').style.display = 'none';
    
    AppDocument.querySelector('#common_profile_follow').children[0].style.display = 'block';
    AppDocument.querySelector('#common_profile_follow').children[1].style.display = 'none';
    AppDocument.querySelector('#common_profile_like').children[0].style.display = 'block';
    AppDocument.querySelector('#common_profile_like').children[1].style.display = 'none';

    AppDocument.querySelector('#common_profile_avatar').src = '';
    AppDocument.querySelector('#common_profile_username').innerHTML = '';
    AppDocument.querySelector('#common_profile_bio').innerHTML = '';
    AppDocument.querySelector('#common_profile_joined_date').innerHTML = '';

    AppDocument.querySelector('#common_profile_info_view_count').innerHTML = '';
    AppDocument.querySelector('#common_profile_info_following_count').innerHTML = '';
    AppDocument.querySelector('#common_profile_info_followers_count').innerHTML = '';
    AppDocument.querySelector('#common_profile_info_likes_count').innerHTML = '';
    AppDocument.querySelector('#common_profile_info_liked_count').innerHTML = '';
    
    AppDocument.querySelector('#common_profile_qr').innerHTML = '';
    AppDocument.querySelector('#common_profile_detail_list').innerHTML = '';
    AppDocument.querySelector('#common_profile_top_list').innerHTML = '';
};
const lov_close = () => {
    AppDocument.querySelector('#common_dialogue_lov').style.visibility = 'hidden';
    AppDocument.querySelector('#common_lov_title').innerHTML='';
    AppDocument.querySelector('#common_lov_search_input').innerHTML='';
    AppDocument.querySelector('#common_lov_list').innerHTML='';
    AppDocument.querySelector('#common_lov_list')['data-function'] = null;
};
const lov_show = (lov, function_event) => {
    
    AppDocument.querySelector('#common_dialogue_lov').style.visibility = 'visible';
    AppDocument.querySelector('#common_lov_list').classList.add('css_spinner');
    AppDocument.querySelector('#common_lov_list').innerHTML = '';
    AppDocument.querySelector('#common_lov_title').className = 'common_icon';
    let path = '';
    let token_type = '';
    let lov_column_value='';
    let service;
    switch (lov){
        case 'PARAMETER_TYPE':{
            AppDocument.querySelector('#common_lov_title').classList.add('parameter_type');
            lov_column_value = 'parameter_type_text';            
            path = '/parameter_type/admin?';
            service = 'DB_API';
            token_type = 'APP_ACCESS';
            break;
        }
        case 'SERVER_LOG_FILES':{
            AppDocument.querySelector('#common_lov_title').classList.add('server_log_file');
            lov_column_value = 'filename';
            path = '/log/files?';
            service = 'LOG';
            token_type = 'SYSTEMADMIN';
            break;
        }
        case 'APP_CATEGORY':{
            AppDocument.querySelector('#common_lov_title').classList.add('app_category');
            lov_column_value = 'app_category_text';
            path = '/app_category/admin?';
            service = 'DB_API';
            token_type = 'APP_ACCESS';
            break;
        }
        case 'APP_ROLE':{
            AppDocument.querySelector('#common_lov_title').classList.add('app_role');
            lov_column_value = 'icon';
            path = '/app_role/admin?';
            service = 'DB_API';
            token_type = 'APP_ACCESS';
            break;
        }
    }
    FFB(service, path, 'GET', token_type, null)
    .then(result=>{
            AppDocument.querySelector('#common_lov_list')['data-function'] = function_event;
            let html = '';
            for (const list_row of JSON.parse(result)) {
                html += 
                `<div data-id='${list_row.id}' data-value='${list_row[lov_column_value]}' tabindex=-1 class='common_list_lov_row common_row'>
                    <div class='common_list_lov_col'>
                        <div>${list_row.id}</div>
                    </div>
                    <div class='common_list_lov_col'>
                        <div>${list_row[lov_column_value]}</div>
                    </div>
                </div>`;
            }
            AppDocument.querySelector('#common_lov_list').classList.remove('css_spinner');
            AppDocument.querySelector('#common_lov_list').innerHTML = html;
            AppDocument.querySelector('#common_lov_search_input').focus();
    })
    .catch(()=>AppDocument.querySelector('#common_lov_list').classList.remove('css_spinner'));
        
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
            const rows = AppDocument.querySelectorAll('.common_list_lov_row:not(.list_lov_row_hide)');
            const focus_item = (element) =>{
                element.focus();
                AppDocument.querySelector('#common_lov_search_input').focus();
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
            const rows = AppDocument.querySelectorAll('.common_list_lov_row');
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
            //typewatch(lov_filter, AppDocument.querySelector('#common_lov_search_input').innerHTML); 
            lov_filter(AppDocument.querySelector('#common_lov_search_input').innerHTML); 
            break;
        }    
    }
};
const lov_filter = (text_filter) => {
    const rows = AppDocument.querySelectorAll('.common_list_lov_row');
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
    const div = AppDocument.querySelector('#common_window_info_info');
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
    const div = AppDocument.querySelector('#common_window_info_info');
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
            AppDocument.querySelector('#common_window_info_content').src='';
            AppDocument.querySelector('#common_window_info_toolbar').style.display = 'flex';
            AppDocument.querySelector('#common_window_info_content').style.display = 'none';
            AppDocument.querySelector('#common_window_info').style.overflowY = 'auto';
            AppDocument.querySelector('#common_window_info').style.visibility = 'visible';
            AppDocument.querySelector('#common_window_info_info').innerHTML = `<img src='${url}'/>`;
            AppDocument.querySelector('#common_window_info_info').style.display = 'inline-block';
            break;
        }
        case 1:{
            //show url in iframe, use overflowY=hidden
            AppDocument.querySelector('#common_window_info_content').src=url;
            AppDocument.querySelector('#common_window_info_toolbar').style.display = 'none';
            AppDocument.querySelector('#common_window_info_content').style.display = 'block';
            AppDocument.querySelector('#common_window_info').style.overflowY = 'hidden';
            AppDocument.querySelector('#common_window_info').style.visibility = 'visible';
            AppDocument.querySelector('#common_window_info_info').innerHTML = '';
            AppDocument.querySelector('#common_window_info_info').style.display = 'none';
            break;
        }    
        case 2:{
            //show spinner first and then url in iframe, HTML or PDF
            AppDocument.querySelector('#common_window_info_content').src='';
            AppDocument.querySelector('#common_window_info_toolbar').style.display = 'none';
            AppDocument.querySelector('#common_window_info_content').style.display = 'block';
            AppDocument.querySelector('#common_window_info').style.overflowY = 'auto';
            AppDocument.querySelector('#common_window_info').style.visibility = 'visible';
            AppDocument.querySelector('#common_window_info_content').classList.add('css_spinner');
            AppDocument.querySelector('#common_window_info_info').innerHTML = '';
            AppDocument.querySelector('#common_window_info_info').style.display = 'none';
            if (content_type == 'HTML'){
                AppDocument.querySelector('#common_window_info_content').src=iframe_content;
                AppDocument.querySelector('#common_window_info_content').classList.remove('css_spinner');
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
                            AppDocument.querySelector('#common_window_info_content').classList.remove('css_spinner');
                            AppDocument.querySelector('#common_window_info_content').src = base64PDF;
                        };
                    });
                }
        }
    }
};
const show_hide_window_info_toolbar = () => {
    if (AppDocument.querySelector('#common_window_info_toolbar').style.display=='flex' ||
        AppDocument.querySelector('#common_window_info_toolbar').style.display=='')
        AppDocument.querySelector('#common_window_info_toolbar').style.display='none';
    else
        AppDocument.querySelector('#common_window_info_toolbar').style.display='flex';
};
/*-----------------------
  PROFILE               

  local objects:
  search_profile
  ----------------------- */
const profile_follow_like = async (function_name) => {
    await user_function(function_name)
    .then(()=>profile_update_stat())
    .catch(()=>null);
};
const profile_top = (statchoice, app_rest_url = null, click_function=null) => {
    let path;
    const profile_top_list = AppDocument.querySelector('#common_profile_top_list');
    profile_top_list.innerHTML = '';
    profile_top_list.classList.add('css_spinner');
    AppDocument.querySelector('#common_dialogue_profile').style.visibility = 'visible';
    AppDocument.querySelector('#common_profile_info').style.display = 'none';
    AppDocument.querySelector('#common_profile_top').style.display = 'block';
                
    if (statchoice ==1 || statchoice ==2 || statchoice ==3){
        /*statschoice 1,2,3: user_account*/
        path = `/user_account/profile/top?statchoice=${statchoice}`;
    }
    else{
        /*other statschoice, apps can use >3 and return same columns*/
        path = `${app_rest_url}?statchoice=${statchoice}`;
    }
    //TOP
    FFB('DB_API', path, 'GET', 'APP_DATA', null)
    .then(result=> {
        let html ='';
        let image='';
        for (const profile_top of JSON.parse(result)) {
            image = list_image_format_src(profile_top.avatar ?? profile_top.provider_image);
            html +=
            `<div data-user_account_id='${profile_top.id}' class='common_profile_top_list_row common_row'>
                <div class='common_profile_top_list_col'>
                    <div class='common_profile_top_list_user_account_id'>${profile_top.id}</div>
                </div>
                <div class='common_profile_top_list_col'>
                    <img class='common_profile_top_list_avatar' ${image}>
                </div>
                <div class='common_profile_top_list_col'>
                    <div class='common_profile_top_list_username common_wide_list_column common_link'>
                        ${profile_top.username}
                    </div>
                </div>
                <div class='common_profile_top_list_col'>
                    <div class='common_profile_top_list_count'>${profile_top.count}</div>
                </div>
            </div>`;
        }
        profile_top_list.classList.remove('css_spinner');
        profile_top_list.innerHTML = html;
        AppDocument.querySelector('#common_profile_top_list')['data-function'] = click_function;
    })
    .catch(()=> profile_top_list.classList.remove('css_spinner'));
        
};
const profile_detail = (detailchoice, rest_url_app, fetch_detail, click_function) => {
    let path;
    const profile_detail_list = AppDocument.querySelector('#common_profile_detail_list');
    profile_detail_list.innerHTML = '';
    profile_detail_list.classList.add('css_spinner');
    if (detailchoice == 1 || detailchoice == 2 || detailchoice == 3 || detailchoice == 4){
        /*detailchoice 1,2,3, 4: user_account*/
        path = '/user_account/profile/detail';
    }
    else{
        /* detailchoice 5, apps, returns same columns*/
        path = `${rest_url_app}`;
    }
    path += `?user_account_id=${AppDocument.querySelector('#common_profile_id').innerHTML}&detailchoice=${detailchoice}`;
    //DETAIL
    //show only if user logged in
    if (parseInt(COMMON_GLOBAL.user_account_id) || 0 !== 0) {
        if (detailchoice==0){
            //show only other app specific hide common
            AppDocument.querySelector('#common_profile_detail').style.display = 'none';
        }
        else
            AppDocument.querySelector('#common_profile_detail').style.display = 'block';
        if (fetch_detail){
            FFB('DB_API', path, 'GET', 'APP_ACCESS', null)
            .then(result=>{
                let html = '';
                let image = '';
                let delete_div ='';
                for (const list_item of JSON.parse(result)) {
                    if (detailchoice==5 && typeof list_item.id =='undefined'){
                        if (AppDocument.querySelector('#common_profile_id').innerHTML==COMMON_GLOBAL.user_account_id)
                            delete_div = `<div class='common_profile_detail_list_app_delete common_icon'>${''}</div>`;
                        html += 
                        //Apps list
                        `<div data-app_id='${list_item.APP_ID}' data-url='${list_item.PROTOCOL}${list_item.SUBDOMAIN}.${list_item.HOST}:${list_item.PORT}' class='common_profile_detail_list_row common_row'>
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
                                <div class='common_profile_detail_list_date_created'>${list_item.date_created}</div>
                            </div>
                        </div>`;
                    }
                    else{
                        //Username list
                        image = list_image_format_src(list_item.avatar ?? list_item.provider_image);
                        html += 
                        `<div data-user_account_id='${list_item.id}' class='common_profile_detail_list_row common_row'>
                            <div class='common_profile_detail_list_col'>
                                <div class='common_profile_detail_list_user_account_id'>${list_item.id}</div>
                            </div>
                            <div class='common_profile_detail_list_col'>
                                <img class='common_profile_detail_list_avatar' ${image}>
                            </div>
                            <div class='common_profile_detail_list_col'>
                                <div class='common_profile_detail_list_username common_wide_list_column common_link'>
                                    ${list_item.username}
                                </div>
                            </div>
                        </div>`;
                    }
                }
                profile_detail_list.classList.remove('css_spinner');
                profile_detail_list.innerHTML = html;
                AppDocument.querySelector('#common_profile_detail_list')['data-function'] = click_function;
            })
            .catch(()=>profile_detail_list.classList.remove('css_spinner'));
        }
    } else
        show_common_dialogue('LOGIN');
};
const search_profile = (click_function) => {
    AppDocument.querySelector('#common_profile_search_input').classList.remove('common_input_error');
    const profile_search_list = AppDocument.querySelector('#common_profile_search_list');
    AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'flex';
    profile_search_list.innerHTML ='';
    if (AppDocument.querySelector('#common_profile_search_input').innerText==''){
        AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'none';
        AppDocument.querySelector('#common_profile_search_input').classList.add('common_input_error');
    }
    else{
        profile_search_list.classList.add('css_spinner');
        const searched_username = AppDocument.querySelector('#common_profile_search_input').innerText;
        let path;
        let token;
        let json_data;
        if (input_control(null,{check_valid_list:[[AppDocument.querySelector('#common_profile_search_input'),null]]})==false)
            return;
        if (COMMON_GLOBAL.user_account_id!=''){
            //search using access token with logged in user_account_id
            path = `/user_account/profile/username/searchA?search=${encodeURI(searched_username)}`;
            token = 'APP_ACCESS';
            json_data = {   user_account_id:    COMMON_GLOBAL.user_account_id,
                            client_latitude:    COMMON_GLOBAL.client_latitude,
                            client_longitude:   COMMON_GLOBAL.client_longitude
                        };
        }
        else{
            //search using data token without logged in user_account_id
            path = `/user_account/profile/username/searchD?search=${encodeURI(searched_username)}`;
            token = 'APP_DATA';
            json_data = {   client_latitude:    COMMON_GLOBAL.client_latitude,
                            client_longitude:   COMMON_GLOBAL.client_longitude
                        };
        }
        FFB('DB_API', path, 'POST', token, json_data)
        .then(result=>{
            if (JSON.parse(result).length == 0){
                AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'none';
            }
            let html = '';
            let image= '';
            for (const search_profile of JSON.parse(result)) {
                image = list_image_format_src(search_profile.avatar ?? search_profile.provider_image);
                html +=
                `<div data-user_account_id='${search_profile.id}' class='common_profile_search_list_row common_row' tabindex=-1>
                    <div class='common_profile_search_list_col'>
                        <div class='common_profile_search_list_user_account_id'>${search_profile.id}</div>
                    </div>
                    <div class='common_profile_search_list_col'>
                        <img class='common_profile_search_list_avatar' ${image}>
                    </div>
                    <div class='common_profile_search_list_col'>
                        <div class='common_profile_search_list_username common_wide_list_column common_link'>
                            ${search_profile.username}
                        </div>
                    </div>
                </div>`;
            }
            profile_search_list.classList.remove('css_spinner');
            profile_search_list.innerHTML = html;
            AppDocument.querySelector('#common_profile_search_list')['data-function'] = click_function;
        })
        .catch(()=>{
            profile_search_list.classList.remove('css_spinner');
            AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'none';
        });
    }
};
/**
 * profile_show(null, null)     from dropdown menu in apps or choosing logged in users profile
 * profile_show(userid, null) 	 from choosing profile in profile_top, profile_detail and search_profile
 * profile_show(null, username) from init startup when user enters url
 * 
 * @param {number} user_account_id_other 
 * @param {string} username 
 * @returns {{  profile_id:number,
 *              private:number}}
 */
const profile_show = async (user_account_id_other = null, username = null) => {
    return new Promise((resolve, reject)=>{
        let user_account_id_search;
        let path;
    
        show_common_dialogue('PROFILE');
        if (user_account_id_other == null && COMMON_GLOBAL.user_account_id == '' && username == null) {
            resolve(null);
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
            FFB('DB_API', path, 'POST', 'APP_DATA', json_data)
            .then(result=>{
                const profile = JSON.parse(result);
                AppDocument.querySelector('#common_profile_info').style.display = 'block';
                AppDocument.querySelector('#common_profile_main').style.display = 'block';
                AppDocument.querySelector('#common_profile_id').innerHTML = profile.id;
                set_avatar(profile.avatar ?? profile.provider_image, AppDocument.querySelector('#common_profile_avatar')); 
                //show local username
                AppDocument.querySelector('#common_profile_username').innerHTML = profile.username;
    
                AppDocument.querySelector('#common_profile_bio').innerHTML = get_null_or_value(profile.bio);
                AppDocument.querySelector('#common_profile_joined_date').innerHTML = format_json_date(profile.date_created, true);
                AppDocument.querySelector('#common_profile_qr').innerHTML = '';
                create_qr('common_profile_qr', getHostname() + '/' + profile.username);
                //User account followed and liked
                if (profile.followed == 1) {
                    //followed
                    AppDocument.querySelector('#common_profile_follow').children[0].style.display = 'none';
                    AppDocument.querySelector('#common_profile_follow').children[1].style.display = 'block';
                } else {
                    //not followed
                    AppDocument.querySelector('#common_profile_follow').children[0].style.display = 'block';
                    AppDocument.querySelector('#common_profile_follow').children[1].style.display = 'none';
                }
                if (profile.liked == 1) {
                    //liked
                    AppDocument.querySelector('#common_profile_like').children[0].style.display = 'none';
                    AppDocument.querySelector('#common_profile_like').children[1].style.display = 'block';
                } else {
                    //not liked
                    AppDocument.querySelector('#common_profile_like').children[0].style.display = 'block';
                    AppDocument.querySelector('#common_profile_like').children[1].style.display = 'none';
                } 
                //if private then hide info, sql decides if private, no need to check here if same user
                if (profile.private==1) {
                    //private
                    AppDocument.querySelector('#common_profile_public').style.display = 'none';
                    AppDocument.querySelector('#common_profile_private').style.display = 'block';
                } else {
                    //public
                    AppDocument.querySelector('#common_profile_public').style.display = 'block';
                    AppDocument.querySelector('#common_profile_private').style.display = 'none';
                    AppDocument.querySelector('#common_profile_info_view_count').innerHTML = profile.count_views;
                    AppDocument.querySelector('#common_profile_info_following_count').innerHTML = profile.count_following;
                    AppDocument.querySelector('#common_profile_info_followers_count').innerHTML = profile.count_followed;
                    AppDocument.querySelector('#common_profile_info_likes_count').innerHTML = profile.count_likes;
                    AppDocument.querySelector('#common_profile_info_liked_count').innerHTML = profile.count_liked;
                }    
                if (COMMON_GLOBAL.user_account_id =='')
                    setTimeout(()=> {show_common_dialogue('LOGIN');}, 2000);
                else
                    checkOnline('common_profile_avatar_online_status', profile.id);
                resolve({   profile_id: profile.id,
                            private: profile.private});
            })  
            .catch(err=>{reject(err);});
        }
    });
    
};
const profile_close = () => {
    AppDocument.querySelector('#common_dialogue_profile').style.visibility = 'hidden';
    dialogue_profile_clear();
};
const profile_update_stat = async () => {
    return new Promise((resolve, reject) => {
        const profile_id = AppDocument.querySelector('#common_profile_id');
        const json_data ={  
                            client_latitude:    COMMON_GLOBAL.client_latitude,
                            client_longitude:   COMMON_GLOBAL.client_longitude
                        };
        //get updated stat for given user
        //to avoid update in stat set searched by same user
        FFB('DB_API', `/user_account/profile/id?POST_ID=${profile_id.innerHTML}&id=${profile_id.innerHTML}`, 'POST', 'APP_DATA', json_data)
        .then(result=>{
            const user_stat = JSON.parse(result);
            AppDocument.querySelector('#common_profile_info_view_count').innerHTML = user_stat.count_views;
            AppDocument.querySelector('#common_profile_info_following_count').innerHTML = user_stat.count_following;
            AppDocument.querySelector('#common_profile_info_followers_count').innerHTML = user_stat.count_followed;
            AppDocument.querySelector('#common_profile_info_likes_count').innerHTML = user_stat.count_likes;
            AppDocument.querySelector('#common_profile_info_liked_count').innerHTML = user_stat.count_liked;
            resolve({id : user_stat.id});
        })
        .catch(err=>reject(err));
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
            if (AppDocument.querySelector(`#common_${module}_search_list`)){
                const rows = AppDocument.querySelectorAll(`.common_${module}_search_list_row`);
                const focus_item = (element) =>{
                    element.focus();
                    AppDocument.querySelector(`#common_${module}_search_input`).focus();
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
            const x = AppDocument.querySelectorAll(`.common_${module}_search_list_row`);
            for (let i = 0; i <= x.length -1; i++) {
                if (x[i].classList.contains(`common_${module}_search_list_selected`)){
                    /*Show profile and leave searchresult so user can go back to searchresult again*/
                    if (event_function ==null){
                        if (module=='profile')
                            profile_show(x[i].children[0].children[0].innerHTML,null);
                        else{
                            map_show_search_on_map({city:x[i].getAttribute('data-city'),
                                                    country:x[i].getAttribute('data-country'),
                                                    latitude:x[i].getAttribute('data-latitude'),
                                                    longitude:x[i].getAttribute('data-longitude')
                                                });
                        }
                    }
                    else{
                        if (module=='profile')
                            event_function(x[i].children[0].children[0].innerHTML);
                        else
                            event_function({city:x[i].getAttribute('data-city'),
                                            country:x[i].getAttribute('data-country'),
                                            latitude:x[i].getAttribute('data-latitude'),
                                            longitude:x[i].getAttribute('data-longitude')
                                        });
                    }
                        
                    x[i].classList.remove (`common_${module}_search_list_selected`);
                }
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
const user_login = async (system_admin=false) => {
    return new Promise((resolve,reject)=>{
        let path = '';
        let username = '';
        let password = '';
        if (system_admin) {
            path = '/systemadmin?';
            if (input_control(AppDocument.querySelector('#common_dialogue_user_start_content'),
                            {
                            username: AppDocument.querySelector('#common_user_start_login_system_admin_username'),
                            password: AppDocument.querySelector('#common_user_start_login_system_admin_password'),
                            password_confirm: AppDocument.querySelector('#common_user_start_login_system_admin_password_confirm').style.display == 'block'?
                                                AppDocument.querySelector('#common_user_start_login_system_admin_password_confirm'):null
                            })==false)
            return reject('ERROR');   
            username = AppDocument.querySelector('#common_user_start_login_system_admin_username').innerHTML;
            password = AppDocument.querySelector('#common_user_start_login_system_admin_password').innerHTML;
        }
        else{
            path = '/user?';
            if (input_control(AppDocument.querySelector('#common_dialogue_user_start_content'),
                            {
                            username: AppDocument.querySelector('#common_user_start_login_username'),
                            password: AppDocument.querySelector('#common_user_start_login_password')
                            })==false)
                return reject('ERROR');
            username = AppDocument.querySelector('#common_user_start_login_username').innerHTML;
            password = AppDocument.querySelector('#common_user_start_login_password').innerHTML;
        }
            
        // ES6 object spread operator for user variables
        const json_data = { username:  encodeURI(username),
                            password:  encodeURI(password),
                            ...get_uservariables()
                        };
        if (system_admin)
            AppDocument.querySelector('#common_user_start_login_system_admin_button').classList.add('css_spinner');
        else
            AppDocument.querySelector('#common_user_start_login_button').classList.add('css_spinner');
        FFB('IAM', path, 'POST', 'IAM', json_data)
        .then(result=>{
            AppDocument.querySelector('#common_user_start_login_button').classList.remove('css_spinner');
            if (system_admin){
                COMMON_GLOBAL.system_admin = JSON.parse(result).username;
                COMMON_GLOBAL.rest_admin_at = JSON.parse(result).token_at;
                updateOnlineStatus();
                AppDocument.querySelector('#common_user_menu_default_avatar').classList.add('app_role_system_admin');
                AppDocument.querySelector('#common_user_menu_username').innerHTML = JSON.parse(result).username;
                AppDocument.querySelector('#common_user_preferences').style.display = 'none';
                AppDocument.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'none';
                AppDocument.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';
                dialogue_user_start_clear();
                AppDocument.querySelector('#common_user_start_login_system_admin_button').classList.remove('css_spinner');
                resolve({   user_id: null,
                            username: JSON.parse(result).username,
                            bio: null,
                            avatar: null});
            }
            else{
                const user = JSON.parse(result).items[0];
                COMMON_GLOBAL.user_account_id = user.id;
                if (user.active==0){
                    show_common_dialogue('VERIFY', 'LOGIN', user.email, null);
                    reject('ERROR');
                }
                else{
                    profile_close();
                    
                    COMMON_GLOBAL.user_account_id = user.id;
                    COMMON_GLOBAL.user_identity_provider_id = '';
                    COMMON_GLOBAL.user_app_role_id = user.app_role_id;
                    COMMON_GLOBAL.rest_at	= JSON.parse(result).accessToken;
                    
                    //set avatar or empty
                    set_avatar(user.avatar, AppDocument.querySelector('#common_user_menu_avatar_img'));
                    AppDocument.querySelector('#common_user_menu_username').innerHTML = user.username;
                    AppDocument.querySelector('#common_user_menu_username').style.display = 'block';
        
                    AppDocument.querySelector('#common_user_menu_logged_in').style.display = 'inline-block';
                    AppDocument.querySelector('#common_user_menu_logged_out').style.display = 'none';
        
                    
                    AppDocument.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'inline-block';
                    AppDocument.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';
        
                    updateOnlineStatus();
                    user_preference_get()
                    .then(()=>{
                        dialogue_user_start_clear();
                        AppDocument.querySelector('#common_user_start_login_button').classList.remove('css_spinner');
                        resolve({   user_id: user.id,
                                    username: user.username,
                                    bio: user.bio,
                                    avatar: user.avatar});
                    });
                }
            }
        })
        .catch(err=>{
            if (system_admin)
                AppDocument.querySelector('#common_user_start_login_system_admin_button').classList.remove('css_spinner');
            else
                AppDocument.querySelector('#common_user_start_login_button').classList.remove('css_spinner');
            reject(err);});
    });
};
const user_logoff = async (system_admin) => {
    if (system_admin){
        COMMON_GLOBAL.rest_admin_at = '';
        COMMON_GLOBAL.system_admin = '';
        AppDocument.querySelector('#common_user_menu_default_avatar').classList.remove('app_role_system_admin');
        AppDocument.querySelector('#common_user_menu_username').innerHTML = '';
        AppDocument.querySelector('#common_user_menu_username').style.display = 'none';
    }
    else{
        //remove access token
        COMMON_GLOBAL.rest_at ='';
        COMMON_GLOBAL.user_account_id = '';

        set_avatar(null, AppDocument.querySelector('#common_user_menu_avatar_img')); 
        //clear logged in info
        AppDocument.querySelector('#common_user_menu_username').innerHTML = '';
        AppDocument.querySelector('#common_user_menu_username').style.display = 'none';
        AppDocument.querySelector('#common_user_menu_logged_in').style.display = 'none';
        AppDocument.querySelector('#common_user_menu_logged_out').style.display = 'inline-block';
        AppDocument.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'none';
        AppDocument.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'inline-block';

        updateOnlineStatus();
        AppDocument.querySelector('#common_profile_avatar_online_status').className='';
        dialogue_user_edit_clear();
        dialogue_verify_clear();
        dialogue_password_new_clear();
        dialogue_user_start_clear();
        AppDocument.querySelector('#common_dialogue_profile').style.visibility = 'hidden';
        dialogue_profile_clear();
        user_preferences_set_default_globals('LOCALE');
        user_preferences_set_default_globals('TIMEZONE');
        user_preferences_set_default_globals('DIRECTION');
        user_preferences_set_default_globals('ARABIC_SCRIPT');
        user_preferences_update_select();
    }
};
const user_edit = async () => {
    //get user from REST API
    FFB('DB_API', `/user_account?user_account_id=${COMMON_GLOBAL.user_account_id}`, 'GET', 'APP_ACCESS', null)
    .then(result=>{
        const user = JSON.parse(result);
        if (COMMON_GLOBAL.user_account_id == user.id) {
            AppDocument.querySelector('#common_user_edit_local').style.display = 'none';
            AppDocument.querySelector('#common_user_edit_provider').style.display = 'none';
            AppDocument.querySelector('#common_dialogue_user_edit').style.visibility = 'visible';

            if (Number(user.private))
                AppDocument.querySelector('#common_user_edit_checkbox_profile_private').classList.add('checked');
            else
                AppDocument.querySelector('#common_user_edit_checkbox_profile_private').classList.remove('checked');

            AppDocument.querySelector('#common_user_edit_input_username').innerHTML = user.username;
            AppDocument.querySelector('#common_user_edit_input_bio').innerHTML = get_null_or_value(user.bio);

            if (user.provider_id == null) {
                AppDocument.querySelector('#common_user_edit_local').style.display = 'block';
                AppDocument.querySelector('#common_user_edit_provider').style.display = 'none';

                //display fetched avatar editable
                AppDocument.querySelector('#common_user_edit_avatar').style.display = 'block';
                set_avatar(user.avatar, AppDocument.querySelector('#common_user_edit_avatar_img')); 
                AppDocument.querySelector('#common_user_edit_input_email').innerHTML = user.email;
                AppDocument.querySelector('#common_user_edit_input_new_email').innerHTML = user.email_unverified;
                AppDocument.querySelector('#common_user_edit_input_password').innerHTML = '',
                    AppDocument.querySelector('#common_user_edit_input_password_confirm').innerHTML = '',
                    AppDocument.querySelector('#common_user_edit_input_password_new').innerHTML = '';
                AppDocument.querySelector('#common_user_edit_input_password_new_confirm').innerHTML = '';

                AppDocument.querySelector('#common_user_edit_input_password_reminder').innerHTML = user.password_reminder;
            } else{
                    AppDocument.querySelector('#common_user_edit_local').style.display = 'none';
                    AppDocument.querySelector('#common_user_edit_provider').style.display = 'block';
                    AppDocument.querySelector('#common_user_edit_provider_id').innerHTML = user.identity_provider_id;
                    AppDocument.querySelector('#common_user_edit_label_provider_id_data').innerHTML = user.provider_id;
                    AppDocument.querySelector('#common_user_edit_label_provider_name_data').innerHTML = user.provider_first_name + ' ' + user.provider_last_name;
                    AppDocument.querySelector('#common_user_edit_label_provider_email_data').innerHTML = user.provider_email;
                    AppDocument.querySelector('#common_user_edit_label_provider_image_url_data').innerHTML = user.provider_image_url;
                    AppDocument.querySelector('#common_user_edit_avatar').style.display = 'none';
                    set_avatar(user.provider_image, AppDocument.querySelector('#common_user_edit_avatar_img')); 
                } 
            AppDocument.querySelector('#common_user_edit_label_data_last_logontime').innerHTML = format_json_date(user.last_logontime, null);
            AppDocument.querySelector('#common_user_edit_label_data_account_created').innerHTML = format_json_date(user.date_created, null);
            AppDocument.querySelector('#common_user_edit_label_data_account_modified').innerHTML = format_json_date(user.date_modified, null);
            set_avatar(user.avatar ?? user.provider_image, AppDocument.querySelector('#common_user_menu_avatar_img'));
        } else {
            //User not found
            show_message('ERROR', 20305, null, null, null, COMMON_GLOBAL.common_app_id);
        }
    })
    .catch(()=>null);
};
const user_update = async () => {
    return new Promise(resolve=>{
        const username = AppDocument.querySelector('#common_user_edit_input_username').innerHTML;
        const bio = AppDocument.querySelector('#common_user_edit_input_bio').innerHTML;
        const avatar = AppDocument.querySelector('#common_user_edit_avatar_img').src;
        const new_email = AppDocument.querySelector('#common_user_edit_input_new_email').innerHTML;
    
        let path;
        let json_data;
            
        
        if (AppDocument.querySelector('#common_user_edit_local').style.display == 'block') {
            if (input_control(AppDocument.querySelector('#common_dialogue_user_edit_content'),
                            {
                            username: AppDocument.querySelector('#common_user_edit_input_username'),
                            password: AppDocument.querySelector('#common_user_edit_input_password'),
                            password_confirm: AppDocument.querySelector('#common_user_edit_input_password_confirm'),
                            password_confirm_reminder: AppDocument.querySelector('#common_user_edit_input_password_reminder'),
                            password_new: AppDocument.querySelector('#common_user_edit_input_password_new'),
                            password_new_confirm: AppDocument.querySelector('#common_user_edit_input_password_new_confirm'),
                            bio: AppDocument.querySelector('#common_user_edit_input_bio'),
                            email: AppDocument.querySelector('#common_user_edit_input_email')
                            })==false)
                return null;

            const email = AppDocument.querySelector('#common_user_edit_input_email').innerHTML;    
            const password = AppDocument.querySelector('#common_user_edit_input_password').innerHTML;
            const password_new = AppDocument.querySelector('#common_user_edit_input_password_new').innerHTML;
            const password_reminder = AppDocument.querySelector('#common_user_edit_input_password_reminder').innerHTML;
        
            json_data = {   username:           username,
                            bio:                bio,
                            private:            Number(AppDocument.querySelector('#common_user_edit_checkbox_profile_private').classList.contains('checked')),
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
            if (input_control(AppDocument.querySelector('#common_dialogue_user_edit_content'),
                            {
                            bio: AppDocument.querySelector('#common_user_edit_input_bio')
                            })==false)
                return null;
            json_data = {   provider_id:    AppDocument.querySelector('#common_user_edit_provider_id').innerHTML,
                            username:       username,
                            bio:            bio,
                            private:        Number(AppDocument.querySelector('#common_user_edit_checkbox_profile_private').classList.contains('checked'))
                        };
            path = `/user_account/common?PUT_ID=${COMMON_GLOBAL.user_account_id}`;
        }
        AppDocument.querySelector('#common_user_edit_btn_user_update').classList.add('css_spinner');
        //update user using REST API
        FFB('DB_API', path, 'PUT', 'APP_ACCESS', json_data)
        .then(result=>{
            AppDocument.querySelector('#common_user_edit_btn_user_update').classList.remove('css_spinner');
            const user_update = JSON.parse(result);
            set_avatar(avatar, AppDocument.querySelector('#common_user_menu_avatar_img'));
            AppDocument.querySelector('#common_user_menu_username').innerHTML = username;
            if (user_update.sent_change_email == 1){
                show_common_dialogue('VERIFY', 'NEW_EMAIL', new_email, null);
            }
            else
                dialogue_user_edit_clear();
        })
        .catch(()=>AppDocument.querySelector('#common_user_edit_btn_user_update').classList.remove('css_spinner'))
        .finally(()=>resolve(null));
    });
};
const user_signup = () => {
    const email = AppDocument.querySelector('#common_user_start_signup_email').innerHTML;
    if (input_control(AppDocument.querySelector('#common_dialogue_user_start_content'),
                            {
                            username: AppDocument.querySelector('#common_user_start_signup_username'),
                            password: AppDocument.querySelector('#common_user_start_signup_password'),
                            password_confirm: AppDocument.querySelector('#common_user_start_signup_password_confirm'),
                            password_confirm_reminder: AppDocument.querySelector('#common_user_start_signup_password_reminder'),
                            email: AppDocument.querySelector('#common_user_start_signup_email')
                            })==false)
            return null;

    const json_data = { username:           AppDocument.querySelector('#common_user_start_signup_username').innerHTML,
                        password:           AppDocument.querySelector('#common_user_start_signup_password').innerHTML,
                        password_reminder:  AppDocument.querySelector('#common_user_start_signup_password_reminder').innerHTML,
                        email:              email,
                        active:             0,
                        ...get_uservariables()
                     };
    
    AppDocument.querySelector('#common_user_start_signup_button').classList.add('css_spinner');

    FFB('DB_API', '/user_account/signup?', 'POST', 'APP_SIGNUP', json_data)
    .then(result=>{
        AppDocument.querySelector('#common_user_start_signup_button').classList.remove('css_spinner');
        const signup = JSON.parse(result);
        COMMON_GLOBAL.rest_at = signup.accessToken;
        COMMON_GLOBAL.user_account_id = signup.id;
        show_common_dialogue('VERIFY', 'SIGNUP', email, null);
    })
    .catch(()=>AppDocument.querySelector('#common_user_start_signup_button').classList.remove('css_spinner'));
};
const user_verify_check_input = async (item, nextField) => {
    return new Promise((resolve, reject)=>{
        let json_data;
        const verification_type = parseInt(AppDocument.querySelector('#common_user_verification_type').innerHTML);
        //only accept 0-9
        if (item.innerHTML.length==1 && ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(item.innerHTML) > -1)
            if (nextField == '' || (AppDocument.querySelector('#common_user_verify_verification_char1').innerHTML != '' &
                    AppDocument.querySelector('#common_user_verify_verification_char2').innerHTML != '' &
                    AppDocument.querySelector('#common_user_verify_verification_char3').innerHTML != '' &
                    AppDocument.querySelector('#common_user_verify_verification_char4').innerHTML != '' &
                    AppDocument.querySelector('#common_user_verify_verification_char5').innerHTML != '' &
                    AppDocument.querySelector('#common_user_verify_verification_char6').innerHTML != '')) {
                //last field, validate entered code
                const verification_code = parseInt(AppDocument.querySelector('#common_user_verify_verification_char1').innerHTML +
                    AppDocument.querySelector('#common_user_verify_verification_char2').innerHTML +
                    AppDocument.querySelector('#common_user_verify_verification_char3').innerHTML +
                    AppDocument.querySelector('#common_user_verify_verification_char4').innerHTML +
                    AppDocument.querySelector('#common_user_verify_verification_char5').innerHTML +
                    AppDocument.querySelector('#common_user_verify_verification_char6').innerHTML);
                AppDocument.querySelector('#common_user_verify_email_icon').classList.add('css_spinner');
                AppDocument.querySelector('#common_user_verify_verification_char1').classList.remove('common_input_error');
                AppDocument.querySelector('#common_user_verify_verification_char2').classList.remove('common_input_error');
                AppDocument.querySelector('#common_user_verify_verification_char3').classList.remove('common_input_error');
                AppDocument.querySelector('#common_user_verify_verification_char4').classList.remove('common_input_error');
                AppDocument.querySelector('#common_user_verify_verification_char5').classList.remove('common_input_error');
                AppDocument.querySelector('#common_user_verify_verification_char6').classList.remove('common_input_error');
    
                //activate user
                json_data = {   verification_code:  verification_code,
                                verification_type:  verification_type,
                                ...get_uservariables()
                            };
                FFB('DB_API', `/user_account/activate?PUT_ID=${COMMON_GLOBAL.user_account_id}`, 'PUT', 'APP_DATA', json_data)
                .then(result=>{
                    AppDocument.querySelector('#common_user_verify_email_icon').classList.remove('css_spinner');
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
                                AppDocument.querySelector('#common_user_start_login_username').innerHTML =
                                    AppDocument.querySelector('#common_user_start_signup_username').innerHTML;
                                AppDocument.querySelector('#common_user_start_login_password').innerHTML =
                                    AppDocument.querySelector('#common_user_start_signup_password').innerHTML;
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
                        dialogue_verify_clear();
                        dialogue_user_edit_clear();
                        resolve({   actived: 1, 
                                    verification_type : verification_type});
                    } 
                    else{
                        AppDocument.querySelector('#common_user_verify_verification_char1').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char2').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char3').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char4').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char5').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char6').classList.add('common_input_error');
                        //code not valid
                        show_message('ERROR', 20306, null, null, null, COMMON_GLOBAL.common_app_id);
                        reject('ERROR');
                    }
                })
                .catch(err=>{
                    AppDocument.querySelector('#common_user_verify_email_icon').classList.remove('css_spinner');
                    reject(err);
                });
            } else{
                //not last, next!
                AppDocument.querySelector('#' + nextField).focus();
                resolve(null);
            }
        else{
            //remove anything else than 0-9
            AppDocument.querySelector('#' + item.id).innerHTML = '';
            resolve(null);
        }
    });
    
};
const user_delete = async (choice=null, function_delete_event ) => {
    return new Promise((resolve, reject)=>{
        const password = AppDocument.querySelector('#common_user_edit_input_password').innerHTML;
        switch (choice){
            case null:{
                if (AppDocument.querySelector('#common_user_edit_local').style.display == 'block' &&
                    input_control(AppDocument.querySelector('#common_dialogue_user_edit_content'),
                                    {
                                        password: AppDocument.querySelector('#common_user_edit_input_password')
                                    })==false)
                    resolve(null);
                else{
                    show_message('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL.app_id);
                    resolve(null);
                }
                break;
            }
            case 1:{
                AppDocument.querySelector('#common_dialogue_message').style.visibility = 'hidden';
        
                AppDocument.querySelector('#common_user_edit_btn_user_delete_account').classList.add('css_spinner');
                const json_data = { password: password};
    
                FFB('DB_API', `/user_account/common?DELETE_ID=${COMMON_GLOBAL.user_account_id}`, 'DELETE', 'APP_ACCESS', json_data)
                .then(()=>{
                    AppDocument.querySelector('#common_user_edit_btn_user_delete_account').classList.remove('css_spinner');resolve({deleted: 1});
                })
                .catch(err=>{
                    AppDocument.querySelector('#common_user_edit_btn_user_delete_account').classList.remove('css_spinner');
                    reject(err);});
                break;
            }
            default:
                resolve(null);
                break;
        }
    });
};
const user_function = function_name => {
    return new Promise((resolve, reject)=>{
        const user_id_profile = AppDocument.querySelector('#common_profile_id').innerHTML;
        let method;
        let path;
        const json_data = { user_account_id: user_id_profile};
        const check_div = AppDocument.querySelector(`#common_profile_${function_name.toLowerCase()}`);
        if (check_div.children[0].style.display == 'block') {
            path = `/user_account_${function_name.toLowerCase()}?POST_ID=${COMMON_GLOBAL.user_account_id}`;
            method = 'POST';
        } else {
            path = `/user_account_${function_name.toLowerCase()}?DELETE_ID=${COMMON_GLOBAL.user_account_id}`;
            method = 'DELETE';
        }
        if (COMMON_GLOBAL.user_account_id == '')
            show_common_dialogue('LOGIN');
        else {
            FFB('DB_API', path, method, 'APP_ACCESS', json_data)
            .then(()=> {
                if (AppDocument.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display == 'block'){
                    //follow/like
                    AppDocument.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display = 'none';
                    AppDocument.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[1].style.display = 'block';
                }
                else{
                    //unfollow/unlike
                    AppDocument.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display = 'block';
                    AppDocument.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[1].style.display = 'none';
                }
                resolve(null);
            })
            .catch(err=>reject(err));
        }
    });
};
const user_account_app_delete = (choice=null, user_account_id, app_id, function_delete_event) => {
    switch (choice){
        case null:{
            show_message('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL.app_id);
            break;
        }
        case 1:{
            AppDocument.querySelector('#common_dialogue_message').style.visibility = 'hidden';
            FFB('DB_API', `/user_account_app?DELETE_USER_ACCOUNT_ID=${user_account_id}&DELETE_APP_ID=${app_id}`, 'DELETE', 'APP_ACCESS', null)
            .then(()=>{
                //execute event and refresh app list
                AppDocument.querySelector('#common_profile_main_btn_cloud').click();
            })
            .catch(()=>null);
            break;
        }
        default:
            break;
    }
};
const user_forgot = async () => {
    const email = AppDocument.querySelector('#common_user_start_forgot_email').innerHTML;
    const json_data = { email: email,
                        ...get_uservariables()
                    };

    if (input_control(AppDocument.querySelector('#common_dialogue_user_edit_content'),
                    {
                    email: AppDocument.querySelector('#common_user_start_forgot_email')
                    })==false)
        return null;
        
    AppDocument.querySelector('#common_user_start_forgot_button').classList.add('css_spinner');
    FFB('DB_API', '/user_account/forgot?', 'PUT', 'APP_DATA', json_data)
    .then(result=>{
        AppDocument.querySelector('#common_user_start_forgot_button').classList.remove('css_spinner');
        const forgot = JSON.parse(result);
        if (forgot.sent == 1){
            COMMON_GLOBAL.user_account_id = forgot.id;
            show_common_dialogue('VERIFY', 'FORGOT', email, null);
        }
    })
    .catch(()=>AppDocument.querySelector('#common_user_start_forgot_button').classList.remove('css_spinner'));
};
const updatePassword = () => {
    const password_new = AppDocument.querySelector('#common_user_password_new').innerHTML;
    const user_password_new_auth = AppDocument.querySelector('#common_user_password_new_auth').innerHTML;
    const json_data = { password_new:   password_new,
                        auth:           user_password_new_auth,
                        ...get_uservariables()
                     };


    if (input_control(AppDocument.querySelector('#common_dialogue_user_edit_content'),
                     {
                     password: AppDocument.querySelector('#common_user_password_new'),
                     password_confirm: AppDocument.querySelector('#common_user_password_new_confirm'),
                     
                     })==false)
         return null;

    AppDocument.querySelector('#common_user_password_new_icon').classList.add('css_spinner');
    FFB('DB_API', `/user_account/password?PUT_ID=${COMMON_GLOBAL.user_account_id}`, 'PUT', 'APP_ACCESS', json_data)
    .then(()=>{
        AppDocument.querySelector('#common_user_password_new_icon').classList.remove('css_spinner');
        dialogue_password_new_clear();
        show_common_dialogue('LOGIN');
    })
    .catch(()=>AppDocument.querySelector('#common_user_password_new_icon').classList.remoev('css_spinner'));
};
const user_preference_save = async () => {
    if (COMMON_GLOBAL.user_preference_save==true && COMMON_GLOBAL.user_account_id != ''){
        const json_data =
            {  
                preference_locale: AppDocument.querySelector('#common_user_locale_select').value,
                app_setting_preference_timezone_id: AppDocument.querySelector('#common_user_timezone_select').options[AppDocument.querySelector('#common_user_timezone_select').selectedIndex].id,
                app_setting_preference_direction_id: AppDocument.querySelector('#common_user_direction_select').options[AppDocument.querySelector('#common_user_direction_select').selectedIndex].id,
                app_setting_preference_arabic_script_id: AppDocument.querySelector('#common_user_arabic_script_select').options[AppDocument.querySelector('#common_user_arabic_script_select').selectedIndex].id
            };
        await FFB('DB_API', `/user_account_app?PATCH_ID=${COMMON_GLOBAL.user_account_id}`, 'PATCH', 'APP_ACCESS', json_data);
    }
};
const user_preference_get = async () => {
    return new Promise((resolve,reject)=>{
        FFB('DB_API', `/user_account_app?user_account_id=${COMMON_GLOBAL.user_account_id}`, 'GET', 'APP_ACCESS', null)
        .then(result=>{
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
                SearchAndSetSelectedIndex(user_account_app.app_setting_preference_timezone_id, AppDocument.querySelector('#common_user_timezone_select'), 0);
                COMMON_GLOBAL.user_timezone = AppDocument.querySelector('#common_user_timezone_select').value;
            }
            //direction
            SearchAndSetSelectedIndex(user_account_app.app_setting_preference_direction_id, AppDocument.querySelector('#common_user_direction_select'), 0);
            COMMON_GLOBAL.user_direction = AppDocument.querySelector('#common_user_direction_select').value;
            //arabic script
            SearchAndSetSelectedIndex(user_account_app.app_setting_preference_arabic_script_id, AppDocument.querySelector('#common_user_arabic_script_select'), 0);
            COMMON_GLOBAL.user_arabic_script = AppDocument.querySelector('#common_user_arabic_script_select').value;
            user_preferences_update_select();
            resolve(null);
        })
        .catch(err=>reject(err));
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
    AppDocument.querySelector('#common_user_locale_select').dispatchEvent(new Event('change'));
	AppDocument.querySelector('#common_user_timezone_select').dispatchEvent(new Event('change'));
	AppDocument.querySelector('#common_user_direction_select').dispatchEvent(new Event('change'));
	AppDocument.querySelector('#common_user_arabic_script_select').dispatchEvent(new Event('change'));
    COMMON_GLOBAL.user_preference_save = true;
};
/*----------------------- */
/* USER PROVIDER          */
/*----------------------- */
const ProviderSignIn = (provider_id) => {
    return new Promise((resolve, reject)=>{
        //add REST API to get user provider data
        const provider_data = { identity_provider_id:   provider_id,
                                profile_id:             provider_id,
                                profile_first_name:     `PROVIDER_USERNAME${provider_id}`,
                                profile_last_name:      `PROVIDER LAST_NAME${provider_id}`,
                                profile_image_url:      '',
                                profile_email:          `PROVIDER_EMAIL${provider_id}@${location.hostname}`};

        AppDocument.querySelector('#common_user_start_login_button').classList.add('css_spinner');
        convert_image(provider_data.profile_image_url, 
            COMMON_GLOBAL.image_avatar_width,
            COMMON_GLOBAL.image_avatar_height).then((profile_image)=>{
            const json_data ={  username:               null,
                                password:               null,
                                active:                 1,
                                identity_provider_id:   provider_data.identity_provider_id,
                                provider_id:            provider_data.profile_id,
                                provider_first_name:    provider_data.profile_first_name,
                                provider_last_name:     provider_data.profile_last_name,
                                provider_image:         window.btoa(profile_image),
                                provider_image_url:     provider_data.profile_image_url,
                                provider_email:         provider_data.profile_email,
                                ...get_uservariables()
                            };
            FFB('IAM', `/provider?PUT_ID=${provider_data.profile_id}`, 'POST', 'IAM', json_data)
            .then(result=>{
                const user_login = JSON.parse(result).items[0];
                COMMON_GLOBAL.rest_at = JSON.parse(result).accessToken;
                COMMON_GLOBAL.user_account_id = user_login.id;
                COMMON_GLOBAL.user_identity_provider_id = user_login.identity_provider_id;
                updateOnlineStatus();
                user_preference_get()
                .then(()=>{
                    //set avatar or empty
                    set_avatar(result.avatar, AppDocument.querySelector('#common_user_menu_avatar_img'));
                    AppDocument.querySelector('#common_user_menu_username').innerHTML = user_login.username;

                    AppDocument.querySelector('#common_user_menu_logged_in').style.display = 'inline-block';
                    AppDocument.querySelector('#common_user_menu_logged_out').style.display = 'none';

                    AppDocument.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'inline-block'; //block app2?
                    AppDocument.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';
                    AppDocument.querySelector('#common_user_start_login_button').classList.remove('css_spinner');
                    dialogue_user_start_clear();
                    resolve({   user_account_id: user_login.id,
                                username: user_login.username,
                                bio: user_login.bio,
                                avatar: profile_image,
                                first_name: provider_data.profile_first_name,
                                last_name: provider_data.profile_last_name,
                                userCreated: JSON.parse(result).userCreated});
                });
            })
            .catch(err=>{
                AppDocument.querySelector('#common_user_start_login_button').classList.remove('css_spinner');
                reject(err);
            });
        });
    });
};
/*----------------------- */
/* MODULE EASY.QRCODE     */
/*----------------------- */
const create_qr = (div, url) => {
    new QRCode(AppDocument.querySelector('#' + div), {
        text: url,
        width: COMMON_GLOBAL['module_easy.qrcode_width'],
        height: COMMON_GLOBAL['module_easy.qrcode_height'],
        colorDark: COMMON_GLOBAL['module_easy.qrcode_color_dark'],
        colorLight: COMMON_GLOBAL['module_easy.qrcode_color_light'],
        drawer: 'svg'
    });
};
/*----------------------- */
/* MODULE LEAFLET         */
/*----------------------- */
const map_init = async (containervalue, stylevalue, longitude, latitude, doubleclick_event, search_event_function) => {
    return await new Promise((resolve)=>{
        if (checkconnected()) {
            
            COMMON_GLOBAL.module_leaflet_session_map = '';
            COMMON_GLOBAL.module_leaflet_session_map = Leaflet.map(containervalue).setView([latitude, longitude], COMMON_GLOBAL.module_leaflet_zoom);
            map_setstyle(stylevalue).then(()=>{
                //disable doubleclick in event dblclick since e.preventdefault() does not work
                COMMON_GLOBAL.module_leaflet_session_map.doubleClickZoom.disable(); 
    
                //add scale
                //position values: 'topleft', 'topright', 'bottomleft' or 'bottomright'
                Leaflet.control.scale({position: 'topright'}).addTo(COMMON_GLOBAL.module_leaflet_session_map);

                //add custom HTML inside div with class .leaflet-control
                const mapcontrol = AppDocument.querySelectorAll(`#${containervalue} .leaflet-control`);
                //add search button with expand content country select, city select and search input
                mapcontrol[0].innerHTML +=  `<div id='common_module_leaflet_control_search' class='common_module_leaflet_control_button' title='Search' role='button'>
                                                <div id='common_module_leaflet_control_search_button' class='common_icon'></div>
                                                <div id='common_module_leaflet_control_expand_search' class='common_module_leaflet_control_expand'>
                                                    <select id='common_module_leaflet_select_country'>
                                                        ${COMMON_GLOBAL.module_leaflet_countries}
                                                    </select>
                                                    <select id='common_module_leaflet_select_city'  >
                                                        <option value='' id='' label='…' selected='selected'>…</option>
                                                    </select>
                                                    <div id='common_module_leaflet_search_input_row'>
                                                        <div id='common_module_leaflet_search_input' contenteditable=true class='common_input'/></div>
                                                        <div id='common_module_leaflet_search_icon' class='common_icon'></div>
                                                    </div>
                                                    <div id='common_module_leaflet_search_list_wrap'>
                                                        <div id='common_module_leaflet_search_list'></div>
                                                    </div>
                                                </div>
                                                </div>`;
                //add fullscreen button
                mapcontrol[0].innerHTML +=  `<div id='common_module_leaflet_control_fullscreen_id' class='common_module_leaflet_control_button common_icon' title='Fullscreen' role='button'>
                                                </div>`;
                if (COMMON_GLOBAL.client_latitude!='' && COMMON_GLOBAL.client_longitude!=''){
                    //add my location button
                    mapcontrol[0].innerHTML += `<div id='common_module_leaflet_control_my_location_id' class='common_module_leaflet_control_button common_icon' title='My location' role='button'>
                                                </div>`;
                }
                //add layers button with pop out div
                let map_styles_options ='';
                for (const map_style_option of COMMON_GLOBAL.module_leaflet_map_styles){
                    map_styles_options +=`<option id=${map_style_option.id} value='${map_style_option.data}'>${map_style_option.description}</option>`;
                }
                mapcontrol[0].innerHTML += `<div id='common_module_leaflet_control_layer' class='common_module_leaflet_control_button' title='Layer' role='button'>
                                                <div id='common_module_leaflet_control_layer_button' class='common_icon'></div>
                                                <div id='common_module_leaflet_control_expand_layer' class='common_module_leaflet_control_expand'>
                                                    <select id='common_module_leaflet_select_mapstyle' >
                                                        ${map_styles_options}
                                                    </select>
                                                </div>
                                            </div>`;
                SearchAndSetSelectedIndex(COMMON_GLOBAL.module_leaflet_style, AppDocument.querySelector('#common_module_leaflet_select_mapstyle'),1);                
                
                //add search function in data-function that event delegation will use
                AppDocument.querySelector('#common_module_leaflet_search_input')['data-function'] = search_event_function;
                
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
        }
        else
            resolve();
    });
    
};
const map_country = (lang_code) =>{
    return new Promise ((resolve, reject)=>{
        //country
        FFB('DB_API', `/country?lang_code=${lang_code}`, 'GET', 'APP_DATA', null)
        .then(result=>{
            let html='<option value=\'\' id=\'\' label=\'…\' selected=\'selected\'>…</option>';
            let current_group_name;
            let i=0;
            for (const country of JSON.parse(result)){
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
            if (AppDocument.querySelector('#common_module_leaflet_select_country')){
                const select_country = AppDocument.querySelector('#common_module_leaflet_select_country');
                const current_country = AppDocument.querySelector('#common_module_leaflet_select_country')[AppDocument.querySelector('#common_module_leaflet_select_country').selectedIndex].id;
                select_country.innerHTML = html;
                SearchAndSetSelectedIndex(current_country, AppDocument.querySelector('#common_module_leaflet_select_country'),0);    
            }
            resolve();
        })
        .catch(err=>{
            reject(err,null);
        });
    });
    
};
const map_city = (country_code) =>{
    const select_cities = AppDocument.querySelector('#common_module_leaflet_select_city');
    //set default option
    select_cities.innerHTML='<option value=\'\' id=\'\' label=\'…\' selected=\'selected\'>…</option>';
    if (country_code!=null){
        get_cities(country_code)
        .then(cities=>{
            //fetch list including default option
            select_cities.innerHTML = cities;
        });
    }
};
const map_city_empty = () =>{
    //remove old city list:      
    const select_city = AppDocument.querySelector('#common_module_leaflet_select_city');
    const old_groups = select_city.querySelectorAll('optgroup');
    for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
        select_city.removeChild(old_groups[old_index]);
    //display first empty city
    select_city.selectedIndex = 0;
};
const map_toolbar_reset = ()=>{
    const select_country = AppDocument.querySelector('#common_module_leaflet_select_country');
    select_country.selectedIndex = 0;
    map_city_empty();
    AppDocument.querySelector('#common_module_leaflet_search_input').innerHTML ='';
    AppDocument.querySelector('#common_module_leaflet_search_list').innerHTML ='';
    if (AppDocument.querySelector('#common_module_leaflet_control_expand_search').style.display=='block')
        map_control_toggle_expand('search');
    if (AppDocument.querySelector('#common_module_leaflet_control_expand_layer').style.display=='block')
        map_control_toggle_expand('layer');
};
const map_show_search_on_map = (data)=>{
    
    const place =  data.city + ', ' + data.country;
    map_update( data.longitude,
                data.latitude,
                COMMON_GLOBAL.module_leaflet_zoom_city,
                place,
                null,
                COMMON_GLOBAL.module_leaflet_marker_div_city,
                COMMON_GLOBAL.module_leaflet_jumpto);
    map_toolbar_reset();
};
const map_control_toggle_expand = (item) =>{
    let style_display;
    if (AppDocument.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display=='none' ||
        AppDocument.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display =='')
        style_display = 'block';
    else
        style_display = 'none';
    AppDocument.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display = style_display;
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
        const layer = Leaflet.geoJSON(geojsonFeature, {style: myStyle}).addTo(COMMON_GLOBAL.module_leaflet_session_map);
        if(!COMMON_GLOBAL.module_leaflet_session_map_layer)
            COMMON_GLOBAL.module_leaflet_session_map_layer=[];
            COMMON_GLOBAL.module_leaflet_session_map_layer.push(layer);
    }
};
const map_setevent = (event, function_event) => {
    if (checkconnected()) {
        //also creates event:
        //Leaflet.DomEvent.addListener(COMMON_GLOBAL.module_leaflet_session_map, 'dblclick', function_event);
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
                mapstyle_record.session_map_layer = Leaflet.tileLayer(mapstyle_record.data2, {
                    maxZoom: mapstyle_record.data3,
                    attribution: mapstyle_record.data4
                }).addTo(COMMON_GLOBAL.module_leaflet_session_map);
            else
                mapstyle_record.session_map_layer = Leaflet.tileLayer(mapstyle_record.data2, {
                    attribution: mapstyle_record.data4
                }).addTo(COMMON_GLOBAL.module_leaflet_session_map);
            resolve();
        }  
        else
            resolve();
    });
};
const map_update_popup = (title) => {
    AppDocument.querySelector('#common_module_leaflet_popup_title').innerHTML = title;
};
const map_update = async (longitude, latitude, zoomvalue, text_place, timezone_text = null, marker_id, to_method) => {
    return new Promise((resolve)=> {
        if (checkconnected()) {
            const map_update_gps = (to_method, zoomvalue, longitude, latitude) => {
                switch (Number(to_method)){
                    case 0:{
                        if (zoomvalue == '')
                            COMMON_GLOBAL.module_leaflet_session_map.setView(new Leaflet.LatLng(latitude, longitude));
                        else
                            COMMON_GLOBAL.module_leaflet_session_map.setView(new Leaflet.LatLng(latitude, longitude), zoomvalue);
                        break;
                    }
                    case 1:{
                        COMMON_GLOBAL.module_leaflet_session_map.flyTo([latitude, longitude], COMMON_GLOBAL.module_leaflet_zoom);
                        break;
                    }
                    //also have COMMON_GLOBAL.module_leaflet_session_map.panTo(new Leaflet.LatLng({lng: longitude, lat: latitude}));
                }
            };
            const map_update_text = (timezone_text) => {
                const popuptext = `<div id="common_module_leaflet_popup_title">${text_place}</div>
                                   <div id="common_module_leaflet_popup_sub_title" class='common_icon'></div>
                                   <div id="common_module_leaflet_popup_sub_title_timezone">${timezone_text}</div>
                                   <div id="common_module_leaflet_popup_sub_title_gps">${latitude + ', ' + longitude}</div>`;
                Leaflet.popup({ offset: [0, COMMON_GLOBAL.module_leaflet_popup_offset], closeOnClick: false })
                            .setLatLng([latitude, longitude])
                            .setContent(popuptext)
                            .openOn(COMMON_GLOBAL.module_leaflet_session_map);
                const marker = Leaflet.marker([latitude, longitude]).addTo(COMMON_GLOBAL.module_leaflet_session_map);
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
/**
 * 
 * @param {string} service 
 * @param {string} path 
 * @param {string} method 
 * @param {string} authorization_type 
 * @param {*} json_data 
 * @returns {Promise.<*>} 
 */
const FFB = async (service, path, method, authorization_type, json_data) => {
    let status;
    let authorization;
    let bff_path;
    switch (authorization_type){
        case 'APP_DATA':{
            //data token authorization check
            authorization = `Bearer ${COMMON_GLOBAL.rest_dt}`;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/app_data`;
            break;
        }
        case 'APP_SIGNUP':{
            //data token signup authorization check
            authorization = `Bearer ${COMMON_GLOBAL.rest_dt}`;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/app_signup`;
            break;
        }
        case 'APP_ACCESS':{
            //user or admins authorization
            authorization = `Bearer ${COMMON_GLOBAL.rest_at}`;
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.common_app_id)
                bff_path = `${COMMON_GLOBAL.rest_resource_bff}/admin`;
            else
                bff_path = `${COMMON_GLOBAL.rest_resource_bff}/app_access`;
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
        case 'IAM':{
            //user,admin or system admin login
            authorization = `Basic ${window.btoa(json_data.username + ':' + json_data.password)}`;
            bff_path = `${COMMON_GLOBAL.rest_resource_bff}/iam`;
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
    url += `&user_account_logon_user_account_id=${COMMON_GLOBAL.user_account_id}&system_admin=${COMMON_GLOBAL.system_admin}`;
    if (service=='SOCKET' && authorization_type=='SOCKET'){
        return new EventSource(url);
    }
    else
        return await fetch(url, options)
        .then((response) => {
            status = response.status;
            return response.text();
        })
        .then((result) => {
            switch (status){
                case 200:{
                    //OK
                    return result;
                }
                case 400:{
                    //Bad request
                    show_message('INFO', null,null, null, result, COMMON_GLOBAL.app_id);
                    throw result;
                }
                case 404:{
                    //Not found
                    show_message('INFO', null,null, null, result, COMMON_GLOBAL.app_id);
                    throw result;
                }
                case 401:{
                    //Unauthorized, token expired
                    exception(COMMON_GLOBAL.exception_app_function, result);
                    throw result;
                }
                case 403:{
                    //Forbidden, not allowed to login or register new user
                    show_message('INFO', null,null, null, result, COMMON_GLOBAL.app_id);
                    throw result;
                }
                case 500:{
                    //Unknown error
                    exception(COMMON_GLOBAL.exception_app_function, result);
                    throw result;
                }
                case 503:{
                    //Service unavailable or other error in microservice
                    exception(COMMON_GLOBAL.exception_app_function, result);
                    throw result;
                }
            }
        })
        .catch(error=>{throw error;});
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
    connectOnline();
};
const maintenance_countdown = (remaining) => {
    if(remaining <= 0)
        location.reload(true);
    AppDocument.querySelector('#common_maintenance_countdown').innerHTML = remaining;
    setTimeout(()=>{ maintenance_countdown(remaining - 1); }, 1000);
};
const show_broadcast = (broadcast_message) => {
    broadcast_message = window.atob(broadcast_message);
    const broadcast_type = JSON.parse(broadcast_message).broadcast_type;
    const message = JSON.parse(broadcast_message).broadcast_message;
    switch (broadcast_type){
        case 'MAINTENANCE':{
            if (AppDocument.querySelector('#app'))
                location.href = '/';
            else
                if (message)
                    show_maintenance(message);
            break;
        }
        case 'CONNECTINFO':{
            COMMON_GLOBAL.service_socket_client_ID = JSON.parse(message).client_id;
            break;
        }
        case 'CHAT':
        case 'ALERT':{
            show_broadcast_info(message);
            break;
        }
		case 'PROGRESS':{
			show_message('PROGRESS', null, null, null, JSON.parse(window.atob(message)));
            break;
        }
    }
};
const show_broadcast_info = (message) => {
    AppDocument.querySelector('#common_broadcast_info_message').style.animationName='common_ticker';
    AppDocument.querySelector('#common_broadcast_info_message_item').innerHTML = message;
    AppDocument.querySelector('#common_broadcast_info').style.visibility='visible';
};
const show_maintenance = (message, init) => {
    const countdown_timer = 60;

    if (init==1){
        AppDocument.querySelector('#common_dialogue_maintenance').style.visibility='visible';
        maintenance_countdown(countdown_timer);
    }
    else
        AppDocument.querySelector('#common_maintenance_footer').innerHTML = message;
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
    if (COMMON_GLOBAL.system_admin!=''){
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
        token_type='APP_DATA';
    }
    FFB('SOCKET', path, 'PATCH', token_type, null);
};
const connectOnline = async () => {
    FFB('SOCKET',   '/socket/connection/connect' +
                    `?identity_provider_id=${COMMON_GLOBAL.user_identity_provider_id}` +
                    `&system_admin=${COMMON_GLOBAL.system_admin}&latitude=${COMMON_GLOBAL.client_latitude}&longitude=${COMMON_GLOBAL.client_longitude}`, 
         'GET', 'SOCKET', null)
    .then((result_eventsource)=>{
        COMMON_GLOBAL.service_socket_eventsource = result_eventsource;
        COMMON_GLOBAL.service_socket_eventsource.onmessage = event => {
            show_broadcast(event.data);
        };
        COMMON_GLOBAL.service_socket_eventsource.onerror = () => {
            COMMON_GLOBAL.service_socket_eventsource.close();
            reconnect();
        };
    })
    .catch(()=>reconnect());
};
const checkOnline = (div_icon_online, user_account_id) => {
    FFB('SOCKET', `/socket/connection/check?user_account_id=${user_account_id}`, 'GET', 'APP_DATA', null)
    .then(result=>AppDocument.querySelector('#' + div_icon_online).className = JSON.parse(result).online == 1?'online':'offline');
};
/*-----------------------
  SERVICE GEOLOCATION   
  ----------------------- */
const get_place_from_gps = async (longitude, latitude) => {
    return await new Promise((resolve)=>{
        let tokentype;
        const path = `/place?longitude=${longitude}&latitude=${latitude}`;

        if (COMMON_GLOBAL.system_admin!='')
            tokentype = 'SYSTEMADMIN';
        else 
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.common_app_id){
                //admin
                tokentype = 'APP_ACCESS';
            }
            else{
                //not logged in or a user
                tokentype = 'APP_DATA';
            }
        FFB('GEOLOCATION', path, 'GET', tokentype, null)
        .then(result=>{
            const json = JSON.parse(result);
            if (json.geoplugin_place=='' && json.geoplugin_region =='' && json.geoplugin_countryCode =='')
                resolve('');
            else
                resolve(json.geoplugin_place + ', ' +
                        json.geoplugin_region + ', ' +
                        json.geoplugin_countryCode);
        })
        .catch(()=>resolve(''));
    });
};
const get_gps_from_ip = async () => {

    return new Promise((resolve)=>{
        let tokentype;
        const path = '/ip?';
        
        if (COMMON_GLOBAL.system_admin!='' && COMMON_GLOBAL.rest_admin_at)
            tokentype = 'SYSTEMADMIN';
        else
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.common_app_id && COMMON_GLOBAL.rest_at){
                //admin
                tokentype = 'APP_ACCESS';
            }
            else{
                //not logged in or a user
                tokentype = 'APP_DATA';
            }
        FFB('GEOLOCATION', path, 'GET', tokentype, null)
        .then(result=>{
            const geodata = JSON.parse(result);
            COMMON_GLOBAL.client_latitude  = geodata.geoplugin_latitude;
            COMMON_GLOBAL.client_longitude = geodata.geoplugin_longitude;
            if (geodata.geoplugin_city=='' && geodata.geoplugin_regionName =='' && geodata.geoplugin_countryName =='')
                COMMON_GLOBAL.client_place = '';
            else
                COMMON_GLOBAL.client_place =    geodata.geoplugin_city + ', ' +
                                                geodata.geoplugin_regionName + ', ' +
                                                geodata.geoplugin_countryName;
            resolve();
        })
        .catch(()=>resolve(null));
    });

};
/*----------------------- */
/* SERVICE WORLDCITIES    */
/*----------------------- */
const get_cities = async countrycode => {
    return new Promise((resolve, reject)=>{
        FFB('WORLDCITIES', `/country?country=${countrycode}`, 'GET', 'APP_DATA', null)
        .then(result=>{
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
            resolve(`${cities_options} </optgroup>`);
        })
        .then((err)=>reject(err));
    });
};
const worldcities_search = async (event_function) =>{
    const search = AppDocument.querySelector('#common_module_leaflet_search_input').innerText;
    AppDocument.querySelector('#common_module_leaflet_search_list').innerHTML = '';
    if (search !=''){
        const get_cities = async (search) =>{
            return new Promise ((resolve)=>{
                FFB('WORLDCITIES', `/city/search?search=${encodeURI(search)}`, 'GET', 'APP_DATA', null)
                .then(result=>resolve(JSON.parse(result)))
                .catch(()=>resolve(null));
            });
        };
        AppDocument.querySelector('#common_module_leaflet_search_list').classList.add('css_spinner');
        const cities = await get_cities(search);
        AppDocument.querySelector('#common_module_leaflet_search_list').classList.remove('css_spinner');
        let html = '';
        if (cities.length > 0){
            for (const city of cities){
                html += `<div data-city='${city.city}' data-country='${city.admin_name + ',' + city.country}' data-latitude='${city.lat}' data-longitude='${city.lng}' class='common_module_leaflet_search_list_row common_row' tabindex=-1>
                            <div class='common_module_leaflet_search_list_col'>
                                <div class='common_module_leaflet_search_list_city_id'>${city.id}</div>
                            </div>
                            <div class='common_module_leaflet_search_list_col'>
                                <div class='common_module_leaflet_search_list_city common_link common_module_leaflet_click_city'>${city.city}</div>
                            </div>
                            <div class='common_module_leaflet_search_list_col'>
                                <div class='common_module_leaflet_search_list_country common_link common_module_leaflet_click_city'>${city.admin_name + ',' + city.country}</div>
                            </div>
                            <div class='common_module_leaflet_search_list_col'>
                                <div class='common_module_leaflet_search_list_latitude'>${city.lat}</div>
                            </div>
                            <div class='common_module_leaflet_search_list_col'>
                                <div class='common_module_leaflet_search_list_longitude'>${city.lng}</div>
                            </div>
                        </div>`;
            }
            AppDocument.querySelector('#common_module_leaflet_search_list').innerHTML = html;
            AppDocument.querySelector('#common_module_leaflet_search_list')['data-function'] = event_function;
        }
    }
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

    COMMON_GLOBAL.app_email= parameters.app_email;
    COMMON_GLOBAL.app_copyright= parameters.app_copyright;
    COMMON_GLOBAL.app_link_url= parameters.app_link_url;
    COMMON_GLOBAL.app_link_title= parameters.app_link_title;
    COMMON_GLOBAL.app_framework = parseInt(parameters.app_framework);

    //rest 
    COMMON_GLOBAL.rest_resource_bff = parameters.rest_resource_bff;

    //client credentials
    COMMON_GLOBAL.rest_dt = parameters.app_datatoken;

    //system admin
    COMMON_GLOBAL.system_admin = '';
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

    COMMON_GLOBAL.module_leaflet_countries   = parameters.countries;
    COMMON_GLOBAL.module_leaflet_map_styles  = parameters.map_styles;
    COMMON_GLOBAL.user_locale                = parameters.locale;
    COMMON_GLOBAL.user_timezone              = parameters.client_timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    COMMON_GLOBAL.user_direction             = '';
    COMMON_GLOBAL.user_arabic_script         = '';  
};

const disable_textediting = () =>(COMMON_GLOBAL.app_id == COMMON_GLOBAL.common_app_id && 
                                COMMON_GLOBAL.rest_at =='' && COMMON_GLOBAL.rest_admin_at =='') ||
                                COMMON_GLOBAL.app_id != COMMON_GLOBAL.common_app_id;
/**
 * Common events
 * @param {string} event_type 
 * @param {AppEvent} event 
 */
const common_event = async (event_type,event) =>{
    if (event==null){
        //javascript framework
        AppDocument.querySelector('#app').addEventListener(event_type, (/**@type{AppEvent}*/event) => {
            common_event(event_type, event);
        });
    }
    else{
        switch (event_type){
            case 'click':{
                if (event.target.classList.contains('common_switch')){
                    if (event.target.classList.contains('checked'))
                        event.target.classList.remove('checked');
                    else
                        event.target.classList.add('checked');
                }
                else{
                    const event_target_id = element_id(event.target);
                    switch(event_target_id){
                        case event.target.classList.contains('common_select_dropdown_value')?event_target_id:'':
                        case event.target.classList.contains('common_select_dropdown_icon')?event_target_id:'':{
                            AppDocument.querySelector(`#${event_target_id} .common_select_options`).style.display = 
                                AppDocument.querySelector(`#${event_target_id} .common_select_options`).style.display=='block'?'none':'block';
                            break;
                        }
                        case event.target.classList.contains('common_select_option')?event_target_id:'':{
                            AppDocument.querySelector(`#${event_target_id} .common_select_dropdown_value`).innerHTML = event.target.innerHTML;
                            AppDocument.querySelector(`#${event_target_id} .common_select_dropdown_value`).setAttribute('data-value', event.target.getAttribute('data-value'));
                            event.target.parentNode.style.display = 'none';
                            break;
                        }
                        // dialogue login/signup/forgot
                        case 'common_user_start_login':
                        case 'common_user_start_login_system_admin':
                        case 'common_user_start_signup':
                        case 'common_user_start_forgot':{
                            AppDocument.querySelectorAll('#common_user_start_nav > div').forEach(tab=>tab.classList.remove('common_user_start_selected'));
                            AppDocument.querySelector(`#${event_target_id}`).classList.add('common_user_start_selected');
                            
                            AppDocument.querySelectorAll('#common_dialogue_user_start_content .common_user_start_form').forEach(form=>form.style.display='none');
                            AppDocument.querySelector(`#${event_target_id}_form`).style.display='inline-block';
    
                            break;
                        }
                        case 'common_user_start_close':{
                            dialogue_user_start_clear();
                            break;
                        }
                        case 'common_user_start_forgot_button':{
                            await user_forgot();
                            break;
                        }
                        //dialogue message
                        case 'common_message_close':{
                            if (AppDocument.querySelector('#common_message_close')['data-function'])
                                AppDocument.querySelector('#common_message_close')['data-function']();
                            AppDocument.querySelector('#common_message_close')['data-function'] = null;
                            AppDocument.querySelector('#common_dialogue_message').style.visibility = 'hidden';
                            AppDocument.querySelector('#common_message_title').innerHTML ='';
                            break;
                        }
                        case 'common_message_cancel':{
                            AppDocument.querySelector('#common_dialogue_message').style.visibility = 'hidden';
                            break;
                        }
                        //dialouge password
                        case 'common_user_password_new_cancel':{
                            dialogue_password_new_clear();
                            break;
                        }
                        case 'common_user_password_new_ok':{
                            await updatePassword();
                            break;
                        }
                        //dialogue lov
                        case 'common_lov_search_icon':{
                            lov_filter(AppDocument.querySelector('#common_lov_search_input').innerHTML);
                            break;
                        }
                        case 'common_lov_close':{
                            lov_close();
                            break;
                        }
                        case 'common_profile_search_icon':{
                            AppDocument.querySelector('#common_profile_search_input').focus();
                            AppDocument.querySelector('#common_profile_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                            break;
                        }
                        //window info
                        case 'common_window_info_btn_close':{
                            AppDocument.querySelector('#common_window_info').style.visibility = 'hidden'; 
                            AppDocument.querySelector('#common_window_info_info').innerHTML='';
                            AppDocument.querySelector('#common_window_info_content').src='';
                            AppDocument.querySelector('#common_window_info_content').classList='';
                            AppDocument.querySelector('#common_window_info_toolbar').classList='';
                            break;
                        }
                        case 'common_window_info_info':{
                            show_hide_window_info_toolbar();
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
                            if (AppDocument.fullscreenElement)
                                AppDocument.exitFullscreen();
                            else
                                AppDocument.body.requestFullscreen();
                            break;
                        }
                        //user menu
                        case 'common_user_menu':
                        case 'common_user_menu_logged_in':
                        case 'common_user_menu_avatar':
                        case 'common_user_menu_avatar_img':
                        case 'common_user_menu_logged_out':
                        case 'common_user_menu_default_avatar':{
                            const menu = AppDocument.querySelector('#common_user_menu_dropdown');
                            if (menu.style.visibility == 'visible') 
                                menu.style.visibility = 'hidden'; 
                            else 
                                menu.style.visibility = 'visible'; 
                            break;
                        }
                        case 'common_user_menu_dropdown_log_in':{
                            AppDocument.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden';
                            show_common_dialogue('LOGIN');
                            break;
                        }
                        case 'common_user_menu_dropdown_edit':{
                            await user_edit()
                            .then(()=>{
                                AppDocument.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden';
                            });
                            break;
                        }
                        case 'common_user_menu_dropdown_signup':{
                            AppDocument.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden';
                            show_common_dialogue('SIGNUP');
                            break;
                        }
                        //dialogue user edit
                        case 'common_user_edit_close':{
                            dialogue_user_edit_clear();
                            break;
                        }
                        case 'common_user_edit_btn_avatar_img':{
                            AppDocument.querySelector('#common_user_edit_input_avatar_img').click();
                            break;
                        }
                        case 'common_user_edit_input_avatar_img':{
                            show_image(AppDocument.querySelector('#common_user_edit_avatar_img'), event.target.id, COMMON_GLOBAL.image_avatar_width, COMMON_GLOBAL.image_avatar_height);
                            break;
                        }
                        case 'common_user_edit_btn_user_update':{
                            await user_update();
                            break;
                        }
                        //dialogue verify
                        case 'common_user_verify_cancel':{
                            if (AppDocument.querySelector('#common_user_verify_cancel')['data-function'])
                                AppDocument.querySelector('#common_user_verify_cancel')['data-function']();
                            dialogue_verify_clear();
                            break;
                        }
                        //search list
                        case 'common_profile_search_list':{
                            if (event.target.classList.contains('common_profile_search_list_username')){
                                if (AppDocument.querySelector('#common_profile_search_list')['data-function']){
                                    AppDocument.querySelector('#common_profile_search_list')['data-function'](element_row(event.target).getAttribute('data-user_account_id'));
                                }
                                else
                                    await profile_show(element_row(event.target).getAttribute('data-user_account_id'),null);
                            }
                            break;
                        }
                        //dialogue profile and profile top
                        case 'common_profile_top_list':
                        case 'common_profile_detail_list':{
                            if (event.target.classList.contains('common_profile_top_list_username')||
                                event.target.classList.contains('common_profile_detail_list_username')){
                                //execute function from inparameter or use default when not specified
                                if (AppDocument.querySelector(`#${element_id(event.target)}`)['data-function'])
                                    AppDocument.querySelector(`#${element_id(event.target)}`)['data-function'](element_row(event.target).getAttribute('data-user_account_id'));
                                else
                                    await profile_show(element_row(event.target).getAttribute('data-user_account_id'),null);
                            }
                            else{
                                //app list
                                if (event.target.classList.contains('common_profile_detail_list_app_name')){
                                    window.open(element_row(event.target).getAttribute('data-url'), '_blank');
                                }
                                else
                                    if (AppDocument.querySelector('#common_profile_id').innerHTML==COMMON_GLOBAL.user_account_id &&
                                        event.target.parentNode.classList.contains('common_profile_detail_list_app_delete')){
                                            await user_account_app_delete(null, 
                                                                    AppDocument.querySelector('#common_profile_id').innerHTML,
                                                                    element_row(event.target).getAttribute('data-app_id'),
                                                                    () => { 
                                                                        AppDocument.querySelector('#common_dialogue_message').style.visibility = 'hidden';
                                                                        user_account_app_delete(1, 
                                                                                                AppDocument.querySelector('#common_profile_id').innerHTML, 
                                                                                                element_row(event.target).getAttribute('data-app_id'), 
                                                                                                null);
                                                                    });
                                    }
                            }
                            break;
                        }
                        //broadcast
                        case 'common_broadcast_close':{
                            AppDocument.querySelector('#common_broadcast_info').style.visibility='hidden';
                            AppDocument.querySelector('#common_broadcast_info_message_item').innerHTML='';
                            AppDocument.querySelector('#common_broadcast_info_message').style.animationName='unset';
                            break;
                        }
                        //module leaflet
                        case 'common_module_leaflet_search_icon':{
                            AppDocument.querySelector('#common_module_leaflet_search_input').focus();
                            AppDocument.querySelector('#common_module_leaflet_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                            break;
                        }
                        case 'common_module_leaflet_control_search_button':{
                            if (AppDocument.querySelector('#common_module_leaflet_control_expand_layer').style.display=='block')
                                map_control_toggle_expand('layer');
                            map_control_toggle_expand('search');
                            break;
                        }
                        case 'common_module_leaflet_control_fullscreen_id':{
                            if (AppDocument.fullscreenElement)
                                AppDocument.exitFullscreen();
                            else
                                AppDocument.querySelector('.leaflet-container').requestFullscreen();
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
                                const select_country = AppDocument.querySelector('#common_module_leaflet_select_country');
                                select_country.selectedIndex = 0;
                                map_toolbar_reset();
                            }
                            break;
                        }
                        case 'common_module_leaflet_control_layer_button':{
                            if (AppDocument.querySelector('#common_module_leaflet_control_expand_search').style.display=='block')
                                map_toolbar_reset();
                            map_control_toggle_expand('layer');
                            break;
                        }
                        case 'common_module_leaflet_search_list':{
                            //execute function from inparameter or use default when not specified
                            if (event.target.classList.contains('common_module_leaflet_click_city')){
                                const data = {  city: element_row(event.target).getAttribute('data-city'),
                                                country: element_row(event.target).getAttribute('data-country'),
                                                latitude: element_row(event.target).getAttribute('data-latitude'),
                                                longitude: element_row(event.target).getAttribute('data-longitude')
                                            };
                                if (AppDocument.querySelector('#common_module_leaflet_search_list')['data-function']){
                                    AppDocument.querySelector('#common_module_leaflet_search_list')['data-function'](data);
                                    map_toolbar_reset();
                                }
                                else
                                    map_show_search_on_map(data,null,()=>{map_toolbar_reset('search');});
                            }
                            break;
                        }
                        case 'common_profile_main_btn_following':
                        case 'common_profile_main_btn_followed':
                        case 'common_profile_main_btn_likes':
                        case 'common_profile_main_btn_liked':
                        case 'common_profile_main_btn_liked_heart':
                        case 'common_profile_main_btn_liked_users':
                        case 'common_profile_main_btn_cloud':{    
                            AppDocument.querySelectorAll('.common_profile_btn_selected').forEach(btn=>btn.classList.remove('common_profile_btn_selected'));
                            AppDocument.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                            break;
                        }
                        case 'common_toolbar_framework_js':
                        case 'common_toolbar_framework_vue':
                        case 'common_toolbar_framework_react':{
                            AppDocument.querySelectorAll('#common_toolbar_framework .common_toolbar_selected').forEach(btn=>btn.classList.remove('common_toolbar_selected'));
                            AppDocument.querySelector(`#${event_target_id}`).classList.add('common_toolbar_selected');
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
                }   
                break;
            }
            case 'change':{
                switch (event.target.id){
                    //define globals and save settings here, in apps define what should happen when changing
                    case 'common_user_locale_select':{
                        COMMON_GLOBAL.user_locale = event.target.value;
                        //change navigator.language, however when logging out default navigator.language will be set
                        //commented at the moment
                        //Object.defineProperties(navigator, {'language': {'value':COMMON_GLOBAL.user_locale, writable: true}});
                        await user_preference_save();
                        break;
                    }
                    case 'common_user_timezone_select':{
                        COMMON_GLOBAL.user_timezone = event.target.value;
                        await user_preference_save().then(()=>{
                            if (AppDocument.querySelector('#common_dialogue_user_edit').style.visibility == 'visible') {
                                dialogue_user_edit_clear();
                                user_edit();
                            }
                        });
                        break;
                    }
                    case 'common_user_direction_select':{
                        if(event.target.value=='rtl')
                            AppDocument.body.classList.add('rtl');
                        else
                            AppDocument.body.classList.remove('rtl');
                        COMMON_GLOBAL.user_direction = event.target.value;  
                        await user_preference_save();
                        break;
                    }
                    case 'common_user_arabic_script_select':{
                        COMMON_GLOBAL.user_arabic_script = event.target.value;
                        await user_preference_save();
                        break;
                    }
                    //module leaflet events
                    case 'common_module_leaflet_select_country':{
                        if (event.target.options[event.target.selectedIndex].getAttribute('country_code'))
                            map_city(event.target.options[event.target.selectedIndex].getAttribute('country_code').toUpperCase());
                        else{
                            map_toolbar_reset();
                        }
                        break;
                    }
                    case 'common_module_leaflet_select_city':{
                        const longitude_selected = event.target.options[event.target.selectedIndex].getAttribute('longitude');
                        const latitude_selected = event.target.options[event.target.selectedIndex].getAttribute('latitude');
                        map_update( longitude_selected, 
                                    latitude_selected, 
                                    COMMON_GLOBAL.module_leaflet_zoom_city,
                                    event.target.options[event.target.selectedIndex].text, 
                                    null, 
                                    COMMON_GLOBAL.module_leaflet_marker_div_city,
                                    COMMON_GLOBAL.module_leaflet_flyto).then(()=> {
                            map_toolbar_reset();
                        });
                        break;
                    }
                    case 'common_module_leaflet_select_mapstyle':{
                        map_setstyle(event.target.value).then(()=>{null;});
                        break;
                    }
                    default:{
                        break;
                    }
                }
                break;
            }
            case 'keyup':{
                if (event.target.classList.contains('common_password')){
                    if (event.target.innerText.indexOf('\n')>-1)
                        event.target.innerText = event.target.innerText.replace('\n','');
                    AppDocument.querySelector(`#${event.target.id}_mask`).innerText = 
                        event.target.innerText.replace(event.target.innerText, '*'.repeat(LengthWithoutDiacrites(event.target.innerText)));
                }
                else
                    switch (event.target.id){
                        case 'common_user_start_forgot_email':{
                            if (event.code === 'Enter') {
                                event.preventDefault();
                                await user_forgot().then(()=>{
                                    //unfocus
                                    AppDocument.querySelector('#common_user_start_forgot_email').blur();
                                });
                            }
                            break;
                        }
                        case 'common_lov_search_input':{
                            lov_keys(event);
                            break;
                        }
                        //module leaflet
                        case 'common_module_leaflet_search_input':{
                            typewatch(search_input, event, 'module_leaflet', event.target['data-function']); 
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                break;
            }
            case 'keydown':{
                if (disable_textediting() &&
                    event.target.classList.contains('common_input') && 
                        (event.code=='' || event.code=='Enter' || event.altKey == true || event.ctrlKey == true || 
                        (event.shiftKey ==true && (event.code=='ArrowLeft' || 
                                                    event.code=='ArrowRight' || 
                                                    event.code=='ArrowUp' || 
                                                    event.code=='ArrowDown'|| 
                                                    event.code=='Home'|| 
                                                    event.code=='End'|| 
                                                    event.code=='PageUp'|| 
                                                    event.code=='PageDown') ) )
                    ){
                        event.preventDefault();
                }
                break;
            } 
            default:{
                break;
            }
        }    
    }
    
};
/**
 * Sets common events for all apps
 * @returns {void}
 */
const set_events = () => {
    //only works on document level:
    AppDocument.addEventListener('keydown', (/**@type{AppEvent}*/event) =>{ 
        if (event.key === 'Escape') {
            event.preventDefault();
            //hide use menu dropdown
            if (AppDocument.querySelector('#common_user_menu_dropdown').style.visibility=='visible')
                AppDocument.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden';
            if (AppDocument.querySelector('#common_profile_input_row')){
                //hide search
                const x = AppDocument.querySelector('#common_profile_input_row'); 
                if (x.style.visibility == 'visible') {
                    x.style.visibility = 'hidden';
                    AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'none';
                } 
            }
        }
    }, false);

    /**
     * Disable copy cut paste
     * @param {AppEvent} event 
     */
    const disable_copy_paste_cut = event => {
        if (disable_textediting())
            if(event.target.nodeName !='SELECT'){
                event.preventDefault();
                event.target.focus();
            }
    };
    /**
     * Disable common input textediting
     * @param {AppEvent} event 
     */
    const disable_common_input = event => {
        if (disable_textediting())
            if (event.target.classList.contains('common_input')){
                event.preventDefault();
                event.target.focus();
            }
    };
    AppDocument.querySelector('#app').addEventListener('copy', disable_copy_paste_cut, false);
    AppDocument.querySelector('#app').addEventListener('paste', disable_copy_paste_cut, false);
    AppDocument.querySelector('#app').addEventListener('cut', disable_copy_paste_cut, false);
    AppDocument.querySelector('#app').addEventListener('mousedown', disable_copy_paste_cut, false);
    AppDocument.querySelector('#app').addEventListener('touchstart', disable_common_input, false);

};
const set_user_account_app_settings = () =>{
    if (AppDocument.querySelector('#common_user_menu')){
        SearchAndSetSelectedIndex(COMMON_GLOBAL.user_locale, AppDocument.querySelector('#common_user_locale_select'), 1);
        SearchAndSetSelectedIndex(COMMON_GLOBAL.user_timezone, AppDocument.querySelector('#common_user_timezone_select'), 1);
        SearchAndSetSelectedIndex(COMMON_GLOBAL.user_direction, AppDocument.querySelector('#common_user_direction_select'), 1);
        SearchAndSetSelectedIndex(COMMON_GLOBAL.user_arabic_script, AppDocument.querySelector('#common_user_arabic_script_select'), 1);
    }
};
const set_app_parameters = (common_parameters) => {
    //set parameters for common_app_id, each app set its own parameters in the app
    for (const parameter of common_parameters.filter(parameter=>parameter.app_id == COMMON_GLOBAL.common_app_id)){
        switch (parameter.parameter_name){
            case 'INFO_LINK_POLICY_NAME'                :{COMMON_GLOBAL.info_link_policy_name = parameter.parameter_value;break;}
            case 'INFO_LINK_DISCLAIMER_NAME'            :{COMMON_GLOBAL.info_link_disclaimer_name = parameter.parameter_value;break;}
            case 'INFO_LINK_TERMS_NAME'                 :{COMMON_GLOBAL.info_link_terms_name = parameter.parameter_value;break;}
            case 'INFO_LINK_ABOUT_NAME'                 :{COMMON_GLOBAL.info_link_about_name = parameter.parameter_value;break;}
            case 'INFO_LINK_POLICY_URL'                 :{COMMON_GLOBAL.info_link_policy_url = parameter.parameter_value;break;}
            case 'INFO_LINK_DISCLAIMER_URL'             :{COMMON_GLOBAL.info_link_disclaimer_url = parameter.parameter_value;break;}
            case 'INFO_LINK_TERMS_URL'                  :{COMMON_GLOBAL.info_link_terms_url = parameter.parameter_value;break;}
            case 'INFO_LINK_ABOUT_URL'                  :{COMMON_GLOBAL.info_link_about_url = parameter.parameter_value;break;}
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
/**
 * Mounts app using given framework or pure javascript and using given list of event functions
 * @param {{Click:function,
 *          Change:function,
 *          KeyDown:function,
 *          KeyUp:function,
 *          Focus:function,
 *          Input:function}} events 
 */
const mount_app = async (framework, events) => {
    const app_root_div  = 'app_root';
    const app_div       = 'app';
    //remove listeners
    AppDocument.querySelector(`#${app_root_div}`).replaceWith(AppDocument.querySelector(`#${app_root_div}`).cloneNode(true));
    AppDocument.querySelector(`#${app_root_div}`).removeAttribute('data-v-app');

    //set default function if anyone missing
    events.Change?null:events.Change = ((event)=>common_event('change', event));
    events.Click?null:events.Click = ((event)=>common_event('click', event));
    events.Focus?null:events.Focus = ((event)=>common_event('focus', event));
    events.Input?null:events.Input = ((event)=>common_event('input', event));
    events.KeyDown?null:events.KeyDown = ((event)=>common_event('keydown', event));
    events.KeyUp?null:events.KeyUp = ((event)=>common_event('keyup', event));
    //app can override framework or use default javascript if Vue or React is not set
    switch (framework ?? COMMON_GLOBAL.framework){
        case '2':{
            //Vue
            Vue.createApp({
                data() {
                        return {};
                        },
                        template: `<div id=${app_div}
                                        @change ='AppEventChange($event)'
                                        @click  ='AppEventClick($event)'
                                        @input  ='AppEventInput($event)' 
                                        @focus  ='AppEventFocus($event)' 
                                        @keydown='AppEventKeyDown($event)' 
                                        @keyup  ='AppEventKeyUp($event)'>
                                        ${AppDocument.querySelector('#' + app_div).innerHTML}
                                    </div>`, 
                        methods:{
                            AppEventChange: (event) => {
                                events.Change(event);
                            },
                            AppEventClick: (event) => {
                                events.Click(event);
                            },
                            AppEventInput: (event) => {
                                events.Input(event);
                            },
                            AppEventFocus: (event) => {
                                events.Focus(event);
                            },
                            AppEventKeyDown: (event) => {
                                events.KeyDown(event);
                            },
                            AppEventKeyUp: (event) => {
                                events.KeyUp(event);
                            }
                        }
                    }).mount('#' + app_root_div);
            break;
        }
        case '3':{
            //React
            const App = () => {
                //onClick handles single and doubleclick in this React component since onClick and onDoubleClick does not work in React
                //without tricks
                //using dblClick on leaflet on() function to get coordinates
                //JSX syntax
                //return (<div id='mapid' onClick={(e) => {app.map_click_event(event)}}></div>);
                //Using pure Javascript
                return React.createElement('div', { id: app_div,
                                                    onClick:   ()=> {events.Click(event);}
                                                    });
            };
            const app_old = AppDocument.querySelector('#' + app_div).innerHTML;
            const application = ReactDOM.createRoot(AppDocument.querySelector('#' + app_root_div));
            //JSX syntax
            //application.render( <App/>);
            //Using pure Javascript
            application.render( App());
            //set delay so some browsers render ok.
            await new Promise ((resolve)=>{setTimeout(()=> resolve(), 200);});
            AppDocument.querySelector('#' + app_div).innerHTML = app_old;
            events.Change();
            events.Focus();
            events.Input();
            events.KeyDown();
            events.KeyUp();
            
            break;
        }
        case '1':
        default:{
            //Javascript
            events.Click();
            events.Change();
            events.Focus();
            events.Input();
            events.KeyDown();
            events.KeyUp();            
            break;
        }
    }
};
const init_common = async (parameters) => {
    return new Promise((resolve) =>{
        if (COMMON_GLOBAL.app_id ==null)
            set_app_service_parameters(parameters.app_service);
        if (COMMON_GLOBAL.app_framework==0){
            AppDocument.querySelector('#common_toolbar_framework').classList.add('show');
            AppDocument.querySelector('#common_toolbar_framework_js').classList.add('common_toolbar_selected');
        }
            
        broadcast_init();
        if (COMMON_GLOBAL.app_id == COMMON_GLOBAL.common_app_id && COMMON_GLOBAL.system_admin_only==1){
            resolve();
        }
        else{
            set_app_parameters(parameters.app);
            set_events();
            set_user_account_app_settings();
            resolve();
        }
    });
};
export{/* GLOBALS*/
       COMMON_GLOBAL, ICONS,
       /* MISC */
       element_id, element_row, element_list_title, getTimezoneOffset, getTimezoneDate, getGregorian, typewatch, toBase64, fromBase64, common_translate_ui,
       get_null_or_value, mobile, image_format,
       list_image_format_src, recreate_img, convert_image, set_avatar,
       inIframe, show_image, getHostname, input_control, SearchAndSetSelectedIndex,
       /* MESSAGE & DIALOGUE */
       show_message_info_list, dialogue_close, show_common_dialogue, show_message,
       dialogue_user_start_clear,
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
       ProviderSignIn,
       /* MODULE LEAFLET  */
       map_init, map_country, map_show_search_on_map, map_resize, map_line_removeall, map_line_create,
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
       common_event,
       mount_app,
       init_common};