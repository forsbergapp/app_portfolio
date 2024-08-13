/**@type{import('../../../types.js').AppDocument} */
 const AppDocument = document;
/**@type{import('../../../types.js').AppWindow} */
const AppWindow = window;

 
/**@type{import('../../../types.js').type_COMMON_GLOBAL} */
const COMMON_GLOBAL = {
    common_app_id:0,
    app_id:null,
    app_logo:null,
    app_email:null,
    app_copyright:null,
    app_link_url:null,
    app_link_title:null,
    app_text_edit:null,
    app_framework:null,
    app_framework_messages:null,
    app_rest_api_version:null,
    app_root:'app_root',
    app_div:'app',
    app_console:{warn:AppWindow.console.warn, info:AppWindow.console.info, error:AppWindow.console.error},
    app_eventListeners:{original: HTMLElement.prototype.addEventListener, LEAFLET:[], REACT:[], VUE:[], OTHER:[]},
    app_function_exception:null,
    app_function_session_expired:null,
    app_function_sse:null,
    info_link_policy_name:null,
    info_link_disclaimer_name:null,
    info_link_terms_name:null,
    info_link_about_name:null,
    info_link_policy_url:null,
    info_link_disclaimer_url:null,
    info_link_terms_url:null,
    info_link_about_url:null,
    user_app_role_id:null,
    system_admin:null,
    system_admin_first_time:null,
    system_admin_only:null,
    user_identity_provider_id:null,
    user_account_id:null,
    user_account_username:null,
    client_latitude:'',
    client_longitude:'',
    client_place:'',
    client_timezone:'',
    token_at:null,
    token_dt:null,
    token_admin_at:null,
    token_exp:null,
    token_iat:null,
    token_timestamp:null,
    rest_resource_bff:null,
    image_file_allowed_type1:null,
    image_file_allowed_type2:null,
    image_file_allowed_type3:null,
    image_file_allowed_type4:null,
    image_file_allowed_type5:null,
    image_file_mime_type:null,
    image_file_max_size:0,
    image_avatar_width:0,
    image_avatar_height:0,
    user_locale:'',
    user_timezone:'',
    user_direction:'',
    user_arabic_script:'',
    translate_items:{   USERNAME:'Username',
                        EMAIL:'Email',
                        NEW_EMAIL:'New email',
                        BIO:'Bio',
                        PASSWORD:'Password',
                        PASSWORD_CONFIRM:'Password confirm',
                        PASSWORD_REMINDER:'Password reminder',
                        NEW_PASSWORD_CONFIRM:'New password confirm',
                        NEW_PASSWORD:'New password',
                        CONFIRM_QUESTION:''},
    module_leaflet:null,
    module_leaflet_flyto:0,
    module_leaflet_jumpto:0,
    module_leaflet_popup_offset:0,
    module_leaflet_style:'',
    module_leaflet_session_map:{doubleClickZoom:null,
                                invalidateSize:null,
                                removeLayer:null,
                                setView:null,
                                flyTo:null,
                                setZoom:null,
                                getZoom:null},
    module_leaflet_session_map_layer:[],
    module_leaflet_zoom:0, 
    module_leaflet_zoom_city:0,
    module_leaflet_zoom_pp:0,
    module_leaflet_marker_div_gps:'',
    module_leaflet_marker_div_city:'',
    module_leaflet_marker_div_pp:'',
    module_leaflet_map_styles:[{id:null, display_data:null, value:null, data2:null, data3:null, data4:null, session_map_layer:null}],
    'module_easy.qrcode_width':null,
    'module_easy.qrcode_height':null,
    'module_easy.qrcode_color_dark':null,
    'module_easy.qrcode_color_light':null,
    service_socket_client_ID:null,
    service_socket_eventsource:null
};
Object.seal(COMMON_GLOBAL);

/**@type{import('../../../types.js').type_ICONS} */
const ICONS = {
    app_maintenance:          '⚒',
    app_alert:                '🚨',
    infinite:                 '∞',
};
Object.seal(ICONS);

/**
 * Finds recursive parent id. Use when current element can be an image or svg attached to an event element
 * @param {*} element 
 * @returns {string} 
 */
const element_id = element => element.id==''?element_id(element.parentNode):element.id;
/**
 * Finds recursive parent row with class common_row. Use when clicking in a list of records
 * @param {*} element 
 * @returns {HTMLElement} 
 */
const element_row = element => element.classList.contains('common_row')?element:element_row(element.parentNode);
/**
 * Returns current target or parent with class list_title or returns empty. Use when clicking in a list title
 * @param {*} element 
 * @returns {HTMLElement} 
 */
const element_list_title = element => element.classList.contains('list_title')?element:(element.parentNode.classList.contains('list_title')?element.parentNode:null);
/**
 * Length without diacrites
 * @param {string} str 
 * @returns {number}
 */
const LengthWithoutDiacrites = (str) =>{
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').length;
};
/**
 * Get timezone offset
 * @param {string} local_timezone 
 * @returns {number}
 */
const getTimezoneOffset = (local_timezone) =>{
    const utc = new Date(	Number(new Date().toLocaleString('en', {timeZone: 'UTC', year:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', month:'numeric'}))-1,
                            Number(Number(new Date().toLocaleString('en', {timeZone: 'UTC', day:'numeric'}))),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', hour:'numeric', hour12:false})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', minute:'numeric'}))).valueOf();
    const local = new Date(	Number(new Date().toLocaleString('en', {timeZone: local_timezone, year:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: local_timezone, month:'numeric'}))-1,
                            Number(new Date().toLocaleString('en', {timeZone: local_timezone, day:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: local_timezone, hour:'numeric', hour12:false})),
                            Number(new Date().toLocaleString('en', {timeZone: local_timezone, minute:'numeric'}))).valueOf();
    return (local-utc) / 1000 / 60 / 60;
};
/**
 * Get timezone date
 * @param {string} timezone 
 * @returns {Date}
 */
const getTimezoneDate = timezone =>{
    const utc = new Date(	Number(new Date().toLocaleString('en', {timeZone: 'UTC', year:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', month:'numeric'}))-1,
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', day:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', hour:'numeric', hour12:false})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', minute:'numeric'})));
    return new Date(utc.setHours(  utc.getHours() + getTimezoneOffset(timezone)));
};
/**
 * Get Gregorian date from Hijri date
 * The epoch of Hijri calendar for 1 Muharram, AH 1
 * The civil and the Friday epoch will be used here
 * @param {*} HijriDate 
 * @param {*} adjustment 
 * @returns {[number, number, number]}      [year, month, day]
 */
const getGregorian = (HijriDate, adjustment) =>{
    const DAY = 86400000; // a day in milliseconds
    const UNIX_EPOCH_JULIAN_DATE = 2440587.5; // January 1, 1970 GMT

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

let timer = 0;
/**
 * Delay API calls when typing to avoid too many calls 
 * ES6 spread operator, arrow function without function keyword 
 * @param {*} function_name 
 * @param  {...any} parameter 
 */
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
    timer = AppWindow.setTimeout(() => {
        function_name(...parameter);
    }, type_delay);
};
/**
 * Convert string to Base64
 * @param {string} str 
 * @returns {string}
 */
const toBase64 = str => {
    return AppWindow.btoa(unescape(encodeURIComponent(str)));
};	
/**
 * Convert base64 to string
 * @param {string} str 
 * @returns {string}
 */
const fromBase64 = (str) => {
    return decodeURIComponent(escape(AppWindow.atob(str)));
};
/**
 * Translate ui
 * @param {string} lang_code 
 * @returns {Promise.<void>}
 */
const common_translate_ui = async lang_code => {
    //translate objects
    const app_objects_json = await FFB('/server-db/app_object', `data_lang_code=${lang_code}&object_name=APP`, 'GET', 'APP_DATA', null);
    /**
     * @typedef {   'USERNAME'|'EMAIL'|'NEW_EMAIL'|'BIO'|'PASSWORD'|'PASSWORD_CONFIRM'|'PASSWORD_REMINDER'|'NEW_PASSWORD_CONFIRM'|'NEW_PASSWORD'|'CONFIRM_QUESTION'} translation_key
     */
    /**@type{{object_name:string,object_item_name:translation_key, id:string, text:string}[]} */
    const app_objects = JSON.parse(app_objects_json).rows;
    for (const app_object of app_objects){
        switch (app_object.object_name){
            case 'APP':{
                //save current translations to be used in components
                if (COMMON_GLOBAL.translate_items[app_object.object_item_name])
					COMMON_GLOBAL.translate_items[app_object.object_item_name] = app_object.text;
                break;
            }
            case 'APP_LOV':{
                //translate items in select lists in current app
                const select_element = AppDocument.querySelector('#' + app_object.object_item_name.toLowerCase());
                if (select_element)
                    for (let option_element = 0; option_element < select_element.options.length; option_element++){
                        if (select_element.options[option_element].id == app_object.id)
                            select_element.options[option_element].text = app_object.text;
                    }
                break;
            }   
        }
    }
};
/**
 * Renders locales options
 * @returns {Promise<string>}
 */
const get_locales_options = async () =>{
    const locales = await FFB('/server-db/locale', `lang_code=${COMMON_GLOBAL.user_locale}`, 'GET', 'APP_DATA', null)
                            .then((/**@type{string}*/result)=>JSON.parse(result).rows)
                            .catch((/**@type{Error}*/error)=>{throw error;});
    return locales.map((/**@type{*}*/row, /**@type{number}*/index)=>
        `<option id="${index}" value="${row.locale}">${row.text}</option>`
        ).join('');
};
/**
 * Format JSON date with user timezone
 * @param {string} db_date 
 * @param {boolean|null} short 
 * @returns {string|null}
 */
const format_json_date = (db_date, short) => {
    if (db_date == null)
        return null;
    else {
        //Json returns UTC time
        //in ISO 8601 format
        //JSON returns format 2020-08-08T05:15:28Z
        //"yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        /**@type{Intl.DateTimeFormatOptions} */
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
            Number(db_date.substring(0, 4)), //year
            Number(db_date.substring(5, 7)) - 1, //month
            Number(db_date.substring(8, 10)), //day
            Number(db_date.substring(11, 13)), //hour
            Number(db_date.substring(14, 16)), //min
            Number(db_date.substring(17, 19)) //sec
        ));
        const format_date = utc_date.toLocaleDateString(COMMON_GLOBAL.user_locale, options);
        return format_date;
    }
};
/**
 * 
 * Check if mobile
 * @returns {boolean}
 */
const mobile = () =>{
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};
/**
 * Image format
 * @param {string|null} image 
 * @returns {string}
 */
const image_format = image => {
    if (image == '' || image == null )
        return '';
    else
        return image;
};
/**
 * List image format src
 * @param {string|null} image 
 * @returns {string}
 */
const list_image_format_src = image => {
    if (image == '' || image == null)
        return '';
    else
        return `src='${image_format(image)}'`;
};
/**
 * Recreate image
 * @param {HTMLImageElement} img_item 
 * @returns {void}
 */
const recreate_img = img_item => {
    //cant set img src to null, it will containt url or show corrupt image
    //recreating the img is the workaround
    const parentnode = img_item.parentNode;
    const id = img_item.id;
    const alt = img_item.alt;
    const img = AppDocument.createElement('img');

    parentnode?parentnode.removeChild(img_item):null;
    img.id = id;
    img.alt = alt;
    parentnode?parentnode.appendChild(img):null;
};
/**
 * Converts image
 * @param {string} image_url 
 * @param {number} image_width 
 * @param {number} image_height 
 * @returns {Promise.<string>}
 */
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
/**
 * Set avatar
 * @param {string|null} avatar 
 * @param {HTMLImageElement} item 
 */
const set_avatar = (avatar, item) => {
    if (avatar == null || avatar == '')
        recreate_img(item);
    else
        item.src = image_format(avatar);
};
/**
 * Show image
 * @param {HTMLImageElement} item_img 
 * @param {string|null} item_input 
 * @param {number} image_width 
 * @param {number} image_height 
 * @returns {Promise.<null>}
 */
const show_image = async (item_img, item_input, image_width, image_height) => {
    return new Promise((resolve)=>{
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
            show_message('ERROR', '20307', null,null, null, COMMON_GLOBAL.common_app_id);
            resolve(null);
        }
        else
            if (fileSize > COMMON_GLOBAL.image_file_max_size){
                //File size too large
                show_message('ERROR', '20308', null, null, null, COMMON_GLOBAL.common_app_id);
                resolve(null);
            }
            else {
                reader.onloadend = /**@type{import('../../../types.js').AppEvent}*/event => {
                    if (event.target)
                        convert_image(event.target.result?event.target.result.toString():'', image_width, image_height).then((srcEncoded)=>{
                            item_img.src = srcEncoded;
                            resolve(null);
                        });
                };
            }
        if (file)
            reader.readAsDataURL(file); //reads the data as a URL
        else
            item_img.src = '';
    });
    
};
/**
 * Get hostname with protocol and port
 * @returns {string}
 */
const getHostname = () =>{
    return `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}`;
};
/**
 * Input control
 * @param {HTMLElement|null} dialogue 
 * @param {{
 *			check_valid_list_elements?:[HTMLElement,number|null][],
 *			check_valid_list_values?:[string,number|null][],
 *			username?:HTMLElement,
 *			password?:*,
 *          password_confirm?:HTMLElement,
 *          password_confirm_reminder?:HTMLElement,
 *			password_reminder?:HTMLElement,
 *			password_new?:HTMLElement,
 *			password_new_confirm?:*,
 *			email?:HTMLElement,
 *			bio?:HTMLElement
 *		}} validate_items 
 * @returns {boolean}
 */
const input_control = (dialogue, validate_items) =>{
    let result = true;
    /**
     * Valid text element or value
     * @param {HTMLElement|string} validate
     * @returns {boolean}
     */
    const valid_text = validate =>{
        let div;
        if (typeof validate=='object')
            div = validate;
        else{
            div = AppDocument.createElement('div');
            div.innerHTML = validate;
        }
        //remove any html
        div.innerHTML = div.innerText;
        if (div.innerText.indexOf(':') > -1 || div.innerText.includes('"') || div.innerText.includes('\\') )
            return false;
        else
            try {
                JSON.parse(JSON.stringify(div.innerText));
                return true;
                
            } catch (error) {
                return false;
            }
    };
    /**
     * Set error
     * @param {HTMLElement} element 
     * @param {HTMLElement|null} element2 
     */
    const set_error = (element, element2=null) => {
        element.classList.add('common_input_error');
        element2?element.classList.add('common_input_error'):null;
        result = false;
    };
    if (dialogue)
        dialogue.querySelectorAll('.common_input_error').forEach(element=>element.classList.remove('common_input_error'));

    if (validate_items.check_valid_list_elements)
        for (const element of validate_items.check_valid_list_elements){
            element[0].classList.remove('common_input_error');
        }
        
    //validate text content
    if (validate_items.username && valid_text(validate_items.username) == false){
        set_error(validate_items.username);
    }
    if (validate_items.password && valid_text(validate_items.password)== false){
        set_error(validate_items.password);
    }
    if (validate_items.password_reminder && valid_text(validate_items.password_reminder)== false){
        set_error(validate_items.password);
    }
    if (validate_items.password_new && valid_text(validate_items.password_new)== false){
        set_error(validate_items.password);
    }
    if (validate_items.password_new_confirm && valid_text(validate_items.password_new_confirm)== false){
        set_error(validate_items.password);
    }
    if (validate_items.email && valid_text(validate_items.email)== false){
        set_error(validate_items.email);
    }
    if (validate_items.bio && valid_text(validate_items.bio)== false){
        set_error(validate_items.bio);
    }
    if (validate_items.check_valid_list_elements){
        for (const element of validate_items.check_valid_list_elements){
            if (valid_text(element[0])==false)
                set_error(element[0]);
        }
    }
    if (validate_items.check_valid_list_values){
        for (const element of validate_items.check_valid_list_values){
            if (valid_text(element[0])==false){
                result = false;
                break;
            }
        }
    }
    //validate text length
    if (validate_items.username && validate_items.username.innerText.length > 100){
        set_error(validate_items.username);
    }
    if (validate_items.password && validate_items.password.innerText.length > 100){
        set_error(validate_items.password);
    }
    if (validate_items.password_reminder && validate_items.password_reminder.innerText.length > 100){
        set_error(validate_items.password_reminder);
    }
    if (validate_items.password_new && validate_items.password_new.innerText.length > 100){
        set_error(validate_items.password_new);
    }
    if (validate_items.bio && validate_items.bio.innerText.length > 150){
        set_error(validate_items.bio);
    }
    if (validate_items.check_valid_list_elements){
        for (const element of validate_items.check_valid_list_elements){
            if (element[0] && element[1] && element[0].innerText.length > element[1])
                set_error(element[0]);
        }
    }
    if (validate_items.check_valid_list_values){
        for (const element of validate_items.check_valid_list_values){
            if (element[0] && element[1] && element[0].length > element[1]){
                result = false;
                break;
            }
        }
    }
    //validate not empty
    if (validate_items.username && validate_items.username.innerText == '') {
        set_error(validate_items.username);
    }
    if (validate_items.password && validate_items.password.innerText == '') {
        set_error(validate_items.password);
    }
    if (validate_items.email && validate_items.email.innerText == '') {
        set_error(validate_items.email);
    }
    if (validate_items.password && validate_items.password_confirm && validate_items.password_confirm.innerText ==''){
        set_error(validate_items.password_confirm);
    }
    //validate same password
    if (validate_items.password && validate_items.password_confirm && (validate_items.password.innerText != validate_items.password_confirm.innerText)){
        set_error(validate_items.password, validate_items.password_confirm);
    }
    if (validate_items.password_new && validate_items.password_new.innerText.length > 0 && (validate_items.password_new.innerText != validate_items.password_new_confirm.innerText)){
        set_error(validate_items.password_new, validate_items.password_new_confirm);
    }
    if (result==false){
        show_message('INFO', null, null, 'message_text','!', COMMON_GLOBAL.common_app_id);
        return false;
    }
    else
        return true;
};
/**
 * 
 * @param {string} useragent 
 */
const getUserAgentPlatform = useragent =>{
    if (useragent.toLowerCase().indexOf('windows'))
        return 'Windows';
    else
        if (useragent.toLowerCase().indexOf('mobile'))
            return 'Mobile';
        else
            if (useragent.toLowerCase().indexOf('linux'))
                return 'Linux';
            else
                return 'Other';
};
/**
 * Get user variables
 * @returns {{  user_language:string,
 *              user_timezone:string,
 *              user_number_system:string,
 *              user_platform:string,
 *              client_latitude:string,
 *              client_longitude:string,
 *              client_place:string}}
 */
const get_uservariables = () => {
    return {    user_language:      navigator.language,
                user_timezone:      Intl.DateTimeFormat().resolvedOptions().timeZone,
                user_number_system: Intl.NumberFormat().resolvedOptions().numberingSystem,
                user_platform:      getUserAgentPlatform(navigator.userAgent),
                client_latitude:    COMMON_GLOBAL.client_latitude,
                client_longitude:   COMMON_GLOBAL.client_longitude,
                client_place:       COMMON_GLOBAL.client_place
            };
};
/**
 * Search and set selected index
 * colcheck=0 search id
 * colcheck=1 search value
 * @param {string} search 
 * @param {HTMLSelectElement} select_item 
 * @param {number} colcheck 
 * @returns {void}
 */
const SearchAndSetSelectedIndex = (search, select_item, colcheck) => {
    
    try {
        for (let i = 0; i < select_item.options.length; i++) {
            if ((colcheck==0 && select_item.options[i].id == search) ||
                (colcheck==1 && select_item.options[i].value == search)) {
                select_item.selectedIndex = i;
                break;
            }
        }    
    } catch (/**@type{*}*/error) {
        exception(COMMON_GLOBAL.app_function_exception, error);
    }
};
/**
 * Common theme get
 * @returns {void}
 */
 const common_theme_update_from_body = () => {
    AppDocument.querySelector('#common_dialogue_user_menu_app_select_theme').value = AppDocument.body.className[9];
};
/**
 * Common theme update body class from preferences
 * @returns {void}
 */
 const common_preferences_update_body_class_from_preferences = () => {
    const class_app_theme = AppDocument.body.className.split(' ')[0] ?? '';
    const class_direction = COMMON_GLOBAL.user_direction;
    const class_arabic_script = COMMON_GLOBAL.user_arabic_script;
    AppDocument.body.className = '';
    AppDocument.body.classList.add(class_app_theme);
    if (class_direction)
        AppDocument.body.classList.add(class_direction);
    if (class_arabic_script)
        AppDocument.body.classList.add(class_arabic_script);
};

/**
 * Common preference post mount
 * @returns {void}
 */
 const common_preferences_post_mount = () => {
    common_preferences_update_body_class_from_preferences();
    common_theme_update_from_body();
};
/**
 * Convert HTML to React component
 * @param {*} React_create_element
 * @param {*} element 
 * @returns {*}
 */
 const html2reactcomponent = (React_create_element, element) =>{
    const result_component_current = [];
    if(element.length>0 ){
        for (const subelement of element){
            let props;
            /**@type{*} */
            const element_object = {};
            Object.entries(subelement.attributes).forEach((/**@type{*}*/attribute)=>element_object[attribute[1].name] = attribute[1].value);
            //always rename class to className, React will not create class if className is empty
            //but no error/warning will be displayed using this syntax
            element_object.className = element_object.class;
            delete element_object.class;

            //rename attributes used
            const rename_attributes =  [
                                    //Leaflet SVG:
                                    ['stroke-opacity',  'strokeOpacity'],
                                    ['stroke-width',    'strokeWidth'],
                                    ['stroke-linecap',  'strokeLinecap'],
                                    ['stroke-linejoin', 'strokeLinejoin'],
                                    ['pointer-events',  'pointerEvents'],
                                    //other used SVG attributes:
                                    ['shape-rendering', 'shapeRendering'],
                                    ['xmlns:xlink',     'xmlnsXlink'],
                                    //other attributes
                                    ['tabindex',        'tabIndex'],
                                    ['contenteditable', 'contentEditable'],
                                    ];
            for (const element_attribute of Object.keys(element_object)){
                for (const element_svg of rename_attributes)
                    if (element_attribute== element_svg[0]){
                        element_object[element_svg[1]] = element_object[element_svg[0]];
                        delete element_object[element_svg[0]];
                    }
                        
            }
            //add required unique key
            const id = element_object.id?
                            element_object.id:
                                `React_key_${Date.now().toString()}_${Math.random().toString(36).substring(2)}`;
            element_object.key = `{${id}}`;
            //convert attributes to props
            if (subelement.nodeName=='OPTION'){
                props = {   ...element_object,
                            label: subelement.text};
            }
            else
                props = {   ...element_object};
            
            if (props.style){
                //props.style contains string, convert to object
                /**@type{Object.<string, {}>} */
                const style_object = {};
                for (const style of subelement.style){
                    style_object[style] = subelement.style[style];
                }
                props.style = {style:{...style_object}};
            }
            const reactobj = subelement.childElementCount>0?React_create_element(subelement.nodeName.toLowerCase(), 
                                                props,
                                                html2reactcomponent(React_create_element, subelement.children)):
                                                React_create_element(subelement.nodeName.toLowerCase(), 
                                                props);
            result_component_current.push(reactobj);
        }
        return result_component_current;
    }
    else
        return null;
};
/**
 * Component render
 * @param {string|null} div 
 * @param {{}} props 
 * @param {string} component_path
 * @returns {Promise.<*>}
 */
const ComponentRender = async (div,props, component_path) => {
    /**
     * @typedef  {{ props:{function_post:function|null, function_error:function|null}, 
     *              data:*,
     *              template:string|null}} component_type
     */
    const {default:component_function} = await import(component_path);
    //add document (less type errors), framework and mountdiv to props
    /**@type{component_type}*/
    const component = await component_function({...props, ...{ common_document:AppDocument,
                                                common_mountdiv:div}})
                                                .catch((/**@type{Error}*/error)=>{
                                                    div?ComponentRemove(div, true):null;
                                                    exception(COMMON_GLOBAL.app_function_exception, error);
                                                    return null;
                                                });
    if (component){
        // a third party component can already be rendered and can output an empty template
        if (component.template)
        switch (COMMON_GLOBAL.app_framework){
            case 2:{
                //Vue
                const path_vue = 'Vue';
                /**@type {import('../../../types.js').module_vue} */
                const Vue = await import(path_vue);
                //Use tempmount div to be able to return pure HTML
                AppDocument.querySelector(`#${div}`).innerHTML ='<div id=\'tempmount\'></div>'; 
                Vue.createApp({
                    data(){return {};},
                    template: component.template,
                    methods:{}
                }).mount('#tempmount');
                AppDocument.querySelector(`#${div}`).innerHTML = AppDocument.querySelector('#tempmount').innerHTML;
                break;
            }
            case 3:{
                //React
                const path_react = 'React';
                /**@type {import('../../../types.js').module_react} */
                const React = await import(path_react).then(module=>module.React);
                const path_reactDOM = 'ReactDOM';
                /**@type {import('../../../types.js').module_reactDOM} */
                const ReactDOM = await import(path_reactDOM).then(module=>module.ReactDOM);
                
                //convert HTML template to React component
                const div_template = AppDocument.createElement('div');
                div_template.innerHTML = component.template;
                const result_component = React.createElement(div_template.nodeName.toLowerCase(), 
                                                        { id: div_template.id, className: div_template.className}, 
                                                        html2reactcomponent(React.createElement, div_template.children));

                AppDocument.querySelector(`#${div}`).innerHTML ='<div id=\'tempmount\'></div>'; 
                //use inner tempmount div to remove React events
                const application = ReactDOM.createRoot(AppDocument.querySelector(`#${div} #tempmount`));
                application.render( result_component);
                await new Promise ((resolve)=>{setTimeout(()=> resolve(null), 200);});
                //React shows warning Invalid DOM property `class`. Did you mean `className`?
                //because a div with empty class is created inside tempmount, ignore
                //Return the inner first div.innerHTML created by React to return pure HTML
                AppDocument.querySelector(`#${div}`).innerHTML = AppDocument.querySelector(`#${div} #tempmount >div`).innerHTML;
                break;
            }
            case 1:
            default:{
                //Default Javascript
                AppDocument.querySelector(`#${div}`).innerHTML = component.template;
            }
        }
        //post function
        if (component.props.function_post){
            if (component_path == '/common/component/module_leaflet.js'){
                COMMON_GLOBAL.module_leaflet =              component.data.library_Leaflet;
                COMMON_GLOBAL.module_leaflet_session_map =  component.data.module_map;
                COMMON_GLOBAL.module_leaflet_map_styles =   component.data.map_layer_array;
            }
            await component.props.function_post();
        }
        return component.data;
    }
};
/**
 * Component remove
 * @param {string} div 
 * @param {boolean} remove_modal
 */
const ComponentRemove = (div, remove_modal=false) => {
    const APPDIV = AppDocument.querySelector(`#${div}`);
    APPDIV.innerHTML = '';
    if (div.indexOf('dialogue')>-1){
        APPDIV.classList.remove('common_dialogue_show0');
        APPDIV.classList.remove('common_dialogue_show1');
        APPDIV.classList.remove('common_dialogue_show2');
        APPDIV.classList.remove('common_dialogue_show3');
        if (remove_modal){
            if (AppDocument.querySelector('#app .common_dialogues_modal'))
                AppDocument.querySelector('#app .common_dialogues_modal').classList.remove('common_dialogues_modal');
            AppDocument.querySelector('#common_app #common_dialogues').classList.remove('common_dialogues_modal');
        }
    }
};

/**
 * Show common dialogue
 * @param {string} dialogue 
 * @param {string|null} user_verification_type 
 * @param {string|null} title 
 * @param {function|null} click_cancel_event 
 * @returns {Promise.<void>}
 */
const show_common_dialogue = async (dialogue, user_verification_type=null, title=null, click_cancel_event=null) => {
    switch (dialogue) {
        case 'PASSWORD_NEW':
            {    
                ComponentRender('common_dialogue_user_password_new', 
                                {   auth:title,
                                    translation_new_password:COMMON_GLOBAL.translate_items.NEW_PASSWORD,
                                    translation_new_password_confirm:COMMON_GLOBAL.translate_items.NEW_PASSWORD_CONFIRM}, 
                                '/common/component/dialogue_user_password_new.js');
                break;
            }
        case 'VERIFY':
            {    
                ComponentRender('common_dialogue_user_verify', {user_verification_type:user_verification_type,
                                                                username_login:AppDocument.querySelector('#common_user_start_login_username').innerHTML,
                                                                password_login:AppDocument.querySelector('#common_user_start_login_password').innerHTML,
                                                                username_signup:AppDocument.querySelector('#common_user_start_signup_username').innerHTML,
                                                                password_signup:AppDocument.querySelector('#common_user_start_signup_password').innerHTML,
                                                                title: title,
                                                                function_data_function:click_cancel_event}, '/common/component/dialogue_user_verify.js');
                ComponentRemove('common_dialogue_user_start');
                break;
            }
        case 'LOGIN':{
            await ComponentRender('common_dialogue_user_start', 
                            {   user_click:                     'common_user_start_login',
                                app_id:                         COMMON_GLOBAL.app_id,
                                common_app_id:                  COMMON_GLOBAL.common_app_id,
                                system_admin_only: 		        COMMON_GLOBAL.system_admin_only,
                                system_admin_first_time:        COMMON_GLOBAL.system_admin_first_time,
                                translation_username:           COMMON_GLOBAL.translate_items.USERNAME,
                                translation_password:           COMMON_GLOBAL.translate_items.PASSWORD,
                                translation_password_confirm:   COMMON_GLOBAL.translate_items.PASSWORD_CONFIRM, 
                                translation_email:              COMMON_GLOBAL.translate_items.EMAIL,
                                translation_password_reminder:  COMMON_GLOBAL.translate_items.PASSWORD_REMINDER,
                                function_FFB:                   FFB},
                            '/common/component/dialogue_user_start.js');
            break;
        }
        case 'LOGIN_ADMIN':{
            //show admin login as default
            await ComponentRender('common_dialogue_user_start', 
                            {   user_click:                     COMMON_GLOBAL.system_admin_only==1?'common_user_start_login_system_admin':'common_user_start_login',
                                app_id:                         COMMON_GLOBAL.app_id,
                                common_app_id:                  COMMON_GLOBAL.common_app_id,
                                system_admin_only: 		        COMMON_GLOBAL.system_admin_only,
                                system_admin_first_time:        COMMON_GLOBAL.system_admin_first_time,
                                translation_username:           COMMON_GLOBAL.translate_items.USERNAME,
                                translation_password:           COMMON_GLOBAL.translate_items.PASSWORD,
                                translation_password_confirm:   COMMON_GLOBAL.translate_items.PASSWORD_CONFIRM, 
                                translation_email:              COMMON_GLOBAL.translate_items.EMAIL,
                                translation_password_reminder:  COMMON_GLOBAL.translate_items.PASSWORD_REMINDER,
                                function_FFB:                   FFB},
                            '/common/component/dialogue_user_start.js');
            break;
        }
        case 'SIGNUP':{
            await ComponentRender('common_dialogue_user_start', 
                            {   user_click:                     'common_user_start_signup',
                                app_id:                         COMMON_GLOBAL.app_id,
                                common_app_id:                  COMMON_GLOBAL.common_app_id,
                                system_admin_only: 		        COMMON_GLOBAL.system_admin_only,
                                system_admin_first_time:        COMMON_GLOBAL.system_admin_first_time,
                                translation_username:           COMMON_GLOBAL.translate_items.USERNAME,
                                translation_password:           COMMON_GLOBAL.translate_items.PASSWORD,
                                translation_password_confirm:   COMMON_GLOBAL.translate_items.PASSWORD_CONFIRM, 
                                translation_email:              COMMON_GLOBAL.translate_items.EMAIL,
                                translation_password_reminder:  COMMON_GLOBAL.translate_items.PASSWORD_REMINDER,
                                function_FFB:                   FFB},
                            '/common/component/dialogue_user_start.js');
            break;
        }
        case 'FORGOT':{
            await ComponentRender('common_dialogue_user_start', 
                            {   user_click:                     'common_user_start_forgot',
                                app_id:                         COMMON_GLOBAL.app_id,
                                common_app_id:                  COMMON_GLOBAL.common_app_id,
                                system_admin_only: 		        COMMON_GLOBAL.system_admin_only,
                                system_admin_first_time:        COMMON_GLOBAL.system_admin_first_time,
                                translation_username:           COMMON_GLOBAL.translate_items.USERNAME,
                                translation_password:           COMMON_GLOBAL.translate_items.PASSWORD,
                                translation_password_confirm:   COMMON_GLOBAL.translate_items.PASSWORD_CONFIRM, 
                                translation_email:              COMMON_GLOBAL.translate_items.EMAIL,
                                translation_password_reminder:  COMMON_GLOBAL.translate_items.PASSWORD_REMINDER,
                                function_FFB:                   FFB},
                            '/common/component/dialogue_user_start.js');
            break;
        }
    }
};
/**
 * 
 * @param {'ERROR'|'ERROR_BFF'|'INFO'|'EXCEPTION'|'CONFIRM'|'LOG'|'PROGRESS'} message_type 
 * @param {string|null} code
 * @param {function|null} function_event 
 * @param {string|null} text_class
 * @param {*} message 
 * @param {number|null} data_app_id 
 */
const show_message = async (message_type, code, function_event, text_class=null, message=null, data_app_id=null) => {
    ComponentRender('common_dialogue_message', {message_type:message_type,
                                                data_app_id:data_app_id,
                                                code:code,
                                                text_class:text_class,
                                                message:message,
                                                translation_confirm_question:COMMON_GLOBAL.translate_items.CONFIRM_QUESTION,
                                                function_componentremove:ComponentRemove,
                                                function_FFB:FFB, 
                                                function_event:function_event}, '/common/component/dialogue_message.js');
};
/**
 * Dialogue password new clear
 * @returns {void}
 */
const dialogue_password_new_clear = () => {
    ComponentRemove('common_dialogue_user_password_new');
    COMMON_GLOBAL.user_account_id = null;
    COMMON_GLOBAL.token_at = '';
};
/**
 * LOV event
 * @param {import('../../../types.js').AppEvent} event
 * @param {'APP_CATEGORY'|'APP_ROLE'} lov
 */
const lov_event = (event, lov) => {
    /**
     * LOV event function
     * calling row event decides to have common_input_lov and common_input_value
     * admin row should show technical details
     *  common_input_lov   = data-id
     *  common_input_value = data-value
     * app data row for users should not show technical details
     *  common_input_value = data-value
     * @param {import('../../../types.js').AppEvent} event_lov 
     */
    const lov_event_function = event_lov => {
        //setting values from LOV
        const row = element_row(event.target);
        const row_lov = element_row(event_lov.target);
        /**@type{HTMLElement|null} */
        const common_input_lov = row.querySelector('.common_input_lov');
        /**@type{HTMLElement|null} */
        const common_lov_value = row.querySelector('.common_lov_value');
        if (common_input_lov){
            common_input_lov.innerText = row_lov.getAttribute('data-id') ?? '';
            common_input_lov.focus();
        }
        if (common_lov_value){
            /**@ts-ignore */
            if (common_lov_value.parentNode?.classList.contains('common_app_data_display_master_row')){
                common_lov_value.setAttribute('data-lov_value', row_lov.getAttribute('data-id') ?? '');
            }
            common_lov_value.innerText = row_lov.getAttribute('data-value') ?? '';
        }
        //dispatch event for either common_input lov if used or common_lov_value
        (common_input_lov ?? common_lov_value)?.dispatchEvent(new Event('input'));
        AppDocument.querySelector('#common_lov_close').click();
    };
    lov_show(lov, lov_event_function);
};
/**
 * Lov action fetches id and value, updates values and manages data-defaultValue
 * @param {import('../../../types.js').AppEvent} event 
 * @param {string} lov 
 * @param {string|null} old_value
 * @param {string} path 
 * @param {string} query 
 * @param {string} method 
 * @param {string} token_type 
 * @param {{}|null} json_data 
 */
const lov_action = (event, lov, old_value, path, query, method, token_type, json_data) => {
    FFB(path, query, method, token_type, json_data)
    .then((/**@type{string}*/result)=>{
        const list_result = result?JSON.parse(result).rows:{};
        if (list_result.length == 1){
            //set lov text
            if (event.target.parentNode && event.target.parentNode.nextElementSibling)
                event.target.parentNode.nextElementSibling.querySelector('.common_lov_value').innerText = Object.values(list_result[0])[2];
            //set new value in data-defaultValue used to save old value when editing next time
            event.target.setAttribute('data-defaultValue', Object.values(list_result[0])[0]);
        }
        else{
            event.stopPropagation();
            event.preventDefault();
            //set old value
            event.target.innerText = event.target.getAttribute('data-defaultValue') ?? '';
            event.target.focus();    
            //dispatch click on lov button
            event.target.nextElementSibling.dispatchEvent(new Event('click'));
        }
        if (lov=='APP_ROLE'){
            //if wrong value then field is empty again, fetch default value for empty app_role
            if (old_value!='' && event.target.innerText=='')
                event.target.dispatchEvent(new Event('input'));
        }
    })
    .catch(()=>{
        event.stopPropagation();
        event.preventDefault();
        //set old value
        event.target.innerText = event.target.getAttribute('data-defaultValue') ?? '';
        event.target.focus();
        event.target.nextElementSibling?event.target.nextElementSibling.dispatchEvent(new Event('click')):null;
    });
};

/**
 * Lov close
 * @returns {void}
 */
const lov_close = () => {
    ComponentRemove('common_dialogue_lov', true);
};
/**
 * Lov show
 * @param {string} lov 
 * @param {function} function_event
 * @returns {void} 
 */
const lov_show = (lov, function_event) => {
    ComponentRender('common_dialogue_lov', {lov:lov,
                                            function_FFB:FFB, 
                                            function_event:function_event}, '/common/component/dialogue_lov.js');
        
};
/**
 * Lov filter
 * @param {string} text_filter 
 */
const lov_filter = text_filter => {
    const rows = AppDocument.querySelectorAll('.common_list_lov_row');
    for (const row of rows) {
        row.classList.remove ('common_list_lov_row_hide');
        row.classList.remove ('common_list_row_selected');
    }
    for (const row of rows) {
        if (row.children[0].children[0].innerText.toUpperCase().indexOf(text_filter.toUpperCase()) > -1 ||
            row.children[1].children[0].innerText.toUpperCase().indexOf(text_filter.toUpperCase()) > -1){
                row.classList.remove ('common_list_lov_row_hide');
            }
        else{
            row.classList.remove ('common_list_lov_row_hide');
            row.classList.add ('common_list_lov_row_hide');
        }
    }
};

/**
 * Window zoom info
 * @param {number|null} zoomvalue 
 * @returns {void}
 */
const zoom_info = (zoomvalue = null) => {
    let old;
    let old_scale;
    const div = AppDocument.querySelector('#common_window_info_info');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == null) {
        div.style.transform = 'scale(1)';
    } else {
        old = div.style.transform==''? 'scale(1)':div.style.transform;
        old_scale = parseFloat(old.substr(old.indexOf('(') + 1, old.indexOf(')') - 1));
        div.style.transform = 'scale(' + (old_scale + ((zoomvalue*5) / 10)) + ')';
    }
};
/**
 * Window move info
 * @param {number|null} move1 
 * @param {number|null} move2 
 * @returns {void}
 */
const move_info = (move1=null, move2=null) => {
    let old;
    const div = AppDocument.querySelector('#common_window_info_info');
    if (move1==null || move2==null) {
        div.style.transformOrigin = '50% 50%';
    } else {
        old = div.style.transformOrigin==''? '50% 50%':div.style.transformOrigin;
        const old_move1 = parseFloat(old.substr(0, old.indexOf('%')));
        const old_move2 = parseFloat(old.substr(old.indexOf('%') +1, old.length -1));
        div.style.transformOrigin =  `${old_move1 + (move1*5)}% ${old_move2 + (move2*5)}%`;
    }
};
/**
 * Show or hide window info toolbar
 * @returns {void}
 */
const show_hide_window_info_toolbar = () => {
    if (AppDocument.querySelector('#common_window_info_toolbar').style.display=='flex' ||
        AppDocument.querySelector('#common_window_info_toolbar').style.display=='')
        AppDocument.querySelector('#common_window_info_toolbar').style.display='none';
    else
        AppDocument.querySelector('#common_window_info_toolbar').style.display='flex';
};
/**
 * Close window info
 */
const close_window = () =>{
    ComponentRemove('common_window_info');
    AppDocument.querySelector('#common_window_info').style.visibility = 'hidden'; 
    if (AppDocument.fullscreenElement)
        AppDocument.exitFullscreen();
};

/**
 * Profile follow or like and then update stat
 * @param {string} function_name 
 */
const profile_follow_like = async (function_name) => {
    await user_function(function_name)
    .then(()=>profile_update_stat())
    .catch(()=>null);
};
/**
 * Profile top
 * @param {number} statchoice 
 * @param {string|null} app_rest_url
 * @param {function|null} function_user_click
 * @returns {Promise.<void>}
 */
const profile_stat = async (statchoice, app_rest_url = null, function_user_click=null) => {
    await ComponentRender('common_dialogue_profile', 
                    {   
                        tab:'TOP',
                        top_app_rest_url:app_rest_url,
                        top_statchoice:statchoice,
                        function_FFB:FFB,
                        top_function_list_image_format_src:list_image_format_src,
                        top_function_user_click:function_user_click
                    },
                    '/common/component/dialogue_profile.js');
};
/**
 * Profile detail
 * @param {number} detailchoice 
 * @param {boolean} fetch_detail 
 * @param {function|null} click_function 
 * @returns {void}
 */
const profile_detail = (detailchoice, fetch_detail, click_function=null) => {
    let path;
    const profile_detail_list = AppDocument.querySelector('#common_profile_detail_list');
    profile_detail_list.innerHTML = '';
    profile_detail_list.classList.add('css_spinner');
    switch (detailchoice){
        case 0:
        case 6:
        case 7:{
            /*detailchoice 0, 6, 7: app specific */
            path = '/server-db/user_account_app_data_post-profile-detail';
            break;
        }
        case 1:
        case 2:
        case 3:
        case 4:{
            /*detailchoice 1,2,3, 4: user_account*/
            path = '/server-db/user_account-profile-detail';
            break;
        }
        case 5:{
            /* detailchoice 5, apps, returns same columns*/
            path = '/server-db/user_account_app-apps';
            break;
        }
    }
    //DETAIL
    //show only if user logged in
    if (COMMON_GLOBAL.user_account_id || 0 !== 0) {
        if (detailchoice==0){
            //show only other app specific hide common
            AppDocument.querySelector('#common_profile_detail').style.display = 'none';
        }
        else
            AppDocument.querySelector('#common_profile_detail').style.display = 'block';
        if (fetch_detail){
            FFB(`${path}/${AppDocument.querySelector('#common_profile_id').innerHTML}`, `detailchoice=${detailchoice}`, 
                'GET', 'APP_ACCESS', null)
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
/**
 * Profile search
 * @param {function} click_function 
 * @returns {void}
 */
const search_profile = click_function => {
    AppDocument.querySelector('#common_profile_search_input').classList.remove('common_input_error');
    AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'flex';
    if (AppDocument.querySelector('#common_profile_search_input').innerText==''){
        AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'none';
        AppDocument.querySelector('#common_profile_search_input').classList.add('common_input_error');
    }
    else{
        const searched_username = AppDocument.querySelector('#common_profile_search_input').innerText;
        if (input_control(null,{check_valid_list_elements:[[AppDocument.querySelector('#common_profile_search_input'),null]]})==false)
            return;
        ComponentRender('common_profile_search_list_wrap',
                        {
                            user_account_id:COMMON_GLOBAL.user_account_id,
                            searched_username:searched_username,
                            client_latitude:COMMON_GLOBAL.client_latitude,
                            client_longitude:COMMON_GLOBAL.client_longitude,
                            function_list_image_format_src:list_image_format_src,
                            function_click_function:click_function,
                            function_FFB:FFB
                        },
                        '/common/component/profile_search_list.js')
        .then(()=>AppDocument.querySelector('#common_profile_search_list').innerHTML==''?
                        AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'none':null)
        .catch(()=>{
            AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'none';
        });
    }
};
/**
 * Profile show
 * profile_show(null, null)     from dropdown menu in apps or choosing logged in users profile
 * profile_show(userid, null) 	from choosing profile in profile_stat, profile_detail and search_profile
 * profile_show(null, username) from init startup when user enters url
 * 
 * @param {number|null} user_account_id_other 
 * @param {string|null} username 
 * @returns {Promise.<{ profile_id:number,
 *                      private:number}|null>}
 */
const profile_show = async (user_account_id_other = null, username = null) => {
    return ComponentRender('common_dialogue_profile', 
                    {   
                        tab:'INFO',
                        info_user_account_id:COMMON_GLOBAL.user_account_id,
                        info_client_latitude:COMMON_GLOBAL.client_latitude,
                        info_client_longitude:COMMON_GLOBAL.client_longitude,
                        info_user_account_id_other:user_account_id_other,
                        info_username:username,
                        function_FFB:FFB,
                        info_function_set_avatar:set_avatar,
                        info_function_create_qr:create_qr,
                        info_function_getHostname:getHostname,
                        info_function_format_json_date:format_json_date,
                        info_function_show_common_dialogue:show_common_dialogue,
                        info_function_checkOnline:checkOnline
                    },
                    '/common/component/dialogue_profile.js');
    
};
/**
 * Profile update stat
 * @returns {Promise.<{id:number}>}
 */
const profile_update_stat = async () => {
    return new Promise((resolve, reject) => {
        const profile_id = AppDocument.querySelector('#common_profile_id');
        //get updated stat for given user
        FFB(`/server-db/user_account-profile/${profile_id.innerHTML}`, 
            `id=${profile_id.innerHTML}&client_latitude=${COMMON_GLOBAL.client_latitude}&client_longitude=${COMMON_GLOBAL.client_longitude}`, 
            'GET', 
            'APP_DATA', null)
        .then(result=>{
            const user_stat = JSON.parse(result)[0];
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
/**
 * List key event
 * @param {import('../../../types.js').AppEvent} event 
 * @param {string} module 
 * @param {function|null} event_function 
 * @returns {void}
 */
const list_key_event = (event, module, event_function=null) => {
    const list_name = module=='lov'?'list_' + 'lov':module + '_search';
    const search_input = module + '_search';
    switch (event.code){
        case 'ArrowLeft':
        case 'ArrowRight':{
            break;
        }
        case 'ArrowUp':
        case 'ArrowDown':{
            const rows = module=='lov'? AppDocument.querySelectorAll(`.common_${list_name}_row:not(.common_${list_name}_row_hide)`):
                                        AppDocument.querySelectorAll(`.common_${list_name}_list_row`);
            /**
             * Focus item
             * @param {HTMLElement} element 
             */
            const focus_item = (element) =>{
                element.focus();
                AppDocument.querySelector(`#common_${search_input}_input`).focus();
            };
            if (Object.entries(rows).filter(row=>row[1].classList.contains('common_list_row_selected')).length>0){
                let i=0;
                for (const row of rows) {
                    if (row.classList.contains('common_list_row_selected'))
                        //if up and first or
                        //if down and last
                        if ((event.code=='ArrowUp' && i == 0)||
                            (event.code=='ArrowDown' && i == rows.length -1)){
                            if(event.code=='ArrowUp'){
                                //if the first, set the last
                                row.classList.remove ('common_list_row_selected');
                                rows[rows.length -1].classList.add ('common_list_row_selected');
                                focus_item(rows[rows.length -1]);
                            }
                            else{
                                //down
                                //if the last, set the first
                                row.classList.remove ('common_list_row_selected');
                                rows[0].classList.add ('common_list_row_selected');
                                focus_item(rows[0]);
                            }
                            break;
                        }
                        else{
                            if(event.code=='ArrowUp'){
                                //remove highlight, highlight previous
                                row.classList.remove ('common_list_row_selected');
                                rows[i-1].classList.add ('common_list_row_selected');
                                focus_item(rows[i-1]);
                            }
                            else{
                                //down
                                //remove highlight, highlight next
                                row.classList.remove ('common_list_row_selected');
                                rows[i+1].classList.add ('common_list_row_selected');
                                focus_item(rows[i+1]);
                            }
                            break;
                        }
                    i++;
                }
            }
            else{
                //no highlight found, highlight first
                rows[0].classList.add ('common_list_row_selected');
                focus_item(rows[0]);
            }
            break;
        }
        case 'Enter':{
            //enter
            if (module == 'lov'){
                const rows = AppDocument.querySelectorAll(`.common_${list_name}_row`);
                for (const row of rows) {
                    if (row.classList.contains('common_list_row_selected')){
                        //event on row is set in app when calling lov, dispatch it!
                        row.click();
                        row.classList.remove ('common_list_row_selected');
                    }
                }   
            }
            else{
                const rows = AppDocument.querySelectorAll(`.common_${list_name}_list_row`);
                for (let i = 0; i <= rows.length -1; i++) {
                    if (rows[i].classList.contains('common_list_row_selected')){
                        /*Show profile and leave searchresult so user can go back to searchresult again*/
                        if (event_function ==null){
                            if (module=='profile')
                                profile_show(rows[i].children[0].children[0].innerHTML,null);
                            else{
                                map_show_search_on_map({city:rows[i].getAttribute('data-city'),
                                                        country:rows[i].getAttribute('data-country'),
                                                        latitude:rows[i].getAttribute('data-latitude'),
                                                        longitude:rows[i].getAttribute('data-longitude')
                                                    });
                            }
                        }
                        else{
                            if (module=='profile')
                                event_function(rows[i].children[0].children[0].innerHTML);
                            else
                                event_function({city:rows[i].getAttribute('data-city'),
                                                country:rows[i].getAttribute('data-country'),
                                                latitude:rows[i].getAttribute('data-latitude'),
                                                longitude:rows[i].getAttribute('data-longitude')
                                            });
                        }
                            
                        rows[i].classList.remove ('common_list_row_selected');
                    }
                }
            }
            break;
        }
        default:{
            if (module=='lov'){
                //if db call will be implemented, add delay
                //typewatch(lov_filter, AppDocument.querySelector(`#common_${search_input}_input`).innerText); 
                lov_filter(AppDocument.querySelector(`#common_${search_input}_input`).innerText); 
            }
            else
                if (module=='profile')
                    typewatch(search_profile, event_function==null?null:event_function); 
                else{
                    typewatch(worldcities_search, event_function==null?null:event_function); 
                }
            break;
        }            
    }
};
/**
 * User login
 * @param {boolean|null} system_admin 
 * @param {string|null} username_verify
 * @param {string|null} password_verify
 * @param {number|null} provider_id 
 * @returns {Promise. <{    avatar: string|null}>}
 */
const user_login = async (system_admin=false, username_verify=null, password_verify=null, provider_id=null) => {
    let tokentype = '';
    let path = '';
    let json_data = {};
    let spinner_item = '';
    let current_dialogue = '';
    if (system_admin) {
        spinner_item = 'common_user_start_login_system_admin_button';
        current_dialogue = 'common_dialogue_user_start';
        // ES6 object spread operator for user variables
        json_data = {   username:  encodeURI(AppDocument.querySelector('#common_user_start_login_system_admin_username').innerHTML),
                        password:  encodeURI(AppDocument.querySelector('#common_user_start_login_system_admin_password').innerHTML),
                        ...get_uservariables()
        };
        path = '/server-iam/login';
        tokentype = 'IAM_SYSTEMADMIN';
        if (input_control(AppDocument.querySelector('#common_dialogue_user_start'),
                        {
                        username: AppDocument.querySelector('#common_user_start_login_system_admin_username'),
                        password: AppDocument.querySelector('#common_user_start_login_system_admin_password'),
                        password_confirm: AppDocument.querySelector('#common_user_start_login_system_admin_password_confirm')?
                                            AppDocument.querySelector('#common_user_start_login_system_admin_password_confirm'):
                                                null
                        })==false)
            throw 'ERROR';
        
    }
    else{
        if (username_verify){
            spinner_item = 'common_user_verify_email_icon';
            current_dialogue = 'common_dialogue_user_verify';
        }
        else{
            spinner_item = 'common_user_start_login_button';
            current_dialogue = 'common_dialogue_user_start';
        }
        if (provider_id){
            const provider_data = { identity_provider_id:   provider_id,
                                    profile_id:             provider_id,
                                    profile_first_name:     `PROVIDER_USERNAME${provider_id}`,
                                    profile_last_name:      `PROVIDER LAST_NAME${provider_id}`,
                                    profile_image_url:      '',
                                    profile_email:          `PROVIDER_EMAIL${provider_id}@${location.hostname}`};
            const profile_image = provider_data.profile_image_url==''?null:await convert_image(  provider_data.profile_image_url, 
                                                        COMMON_GLOBAL.image_avatar_width,
                                                        COMMON_GLOBAL.image_avatar_height);
            json_data ={    username:               null,
                            password:               null,
                            active:                 1,
                            identity_provider_id:   provider_data.identity_provider_id,
                            provider_id:            provider_data.profile_id,
                            provider_first_name:    provider_data.profile_first_name,
                            provider_last_name:     provider_data.profile_last_name,
                            provider_image:         profile_image?AppWindow.btoa(profile_image):null,
                            provider_image_url:     provider_data.profile_image_url,
                            provider_email:         provider_data.profile_email,
                            ...get_uservariables()
                        };
            path = `/server-iam/login/${provider_data.profile_id}`;
            tokentype = 'IAM_PROVIDER';
        }
        else{
            // ES6 object spread operator for user variables
            json_data = {   username:  encodeURI(username_verify?
                                            AppDocument.querySelector(`#${username_verify}`).innerHTML:
                                                AppDocument.querySelector('#common_user_start_login_username').innerHTML),
                            password:  encodeURI(password_verify?
                                            AppDocument.querySelector(`#${password_verify}`).innerHTML:
                                                AppDocument.querySelector('#common_user_start_login_password').innerHTML),
                            ...get_uservariables()
            };
            path = '/server-iam/login';
            tokentype = 'IAM_USER';
            if (input_control(AppDocument.querySelector('#common_dialogue_user_start'),
                            {
                            username: username_verify?
                                            AppDocument.querySelector(`#${username_verify}`):
                                                AppDocument.querySelector('#common_user_start_login_username'),
                            password: password_verify?
                                            AppDocument.querySelector(`#${password_verify}`):
                                                AppDocument.querySelector('#common_user_start_login_password')
                            })==false)
                throw 'ERROR';
            
        }            
    }
    AppDocument.querySelector(`#${spinner_item}`).classList.add('css_spinner');
    const result_iam = await FFB(path, null, 'POST', tokentype, json_data).catch(err=>{
                        AppDocument.querySelector(`#${spinner_item}`).classList.remove('css_spinner');
                        throw err;
                    });
    if (system_admin){
        COMMON_GLOBAL.system_admin = JSON.parse(result_iam).username==''?null:JSON.parse(result_iam).username;
        COMMON_GLOBAL.token_admin_at = JSON.parse(result_iam).token_at;
        COMMON_GLOBAL.token_exp = JSON.parse(result_iam).exp;
        COMMON_GLOBAL.token_iat = JSON.parse(result_iam).iat;
        COMMON_GLOBAL.token_timestamp = JSON.parse(result_iam).tokentimestamp;
        AppDocument.querySelector(`#${spinner_item}`).classList.remove('css_spinner');
        ComponentRemove(current_dialogue, true);
        
        return {avatar: null};
    }
    else{
        const login_data = provider_id?JSON.parse(result_iam).items[0]:JSON.parse(result_iam).login[0];
        COMMON_GLOBAL.user_account_id = parseInt(login_data.id);
        COMMON_GLOBAL.token_at	= JSON.parse(result_iam).accessToken;
        COMMON_GLOBAL.token_exp = JSON.parse(result_iam).exp;
        COMMON_GLOBAL.token_iat = JSON.parse(result_iam).iat;
        COMMON_GLOBAL.token_timestamp = JSON.parse(result_iam).tokentimestamp;

        COMMON_GLOBAL.user_account_username = login_data.username;
        COMMON_GLOBAL.user_identity_provider_id = provider_id?login_data.identity_provider_id:null;
        COMMON_GLOBAL.user_app_role_id = login_data.app_role_id;

        if (COMMON_GLOBAL.app_id != COMMON_GLOBAL.common_app_id){
            //set avatar or emptyif not in admin app
            set_avatar(provider_id?login_data.provider_image:login_data.avatar ?? null, AppDocument.querySelector('#common_user_menu_avatar_img'));
            AppDocument.querySelector('#common_user_menu_logged_in').style.display = 'inline-block';
            AppDocument.querySelector('#common_user_menu_logged_out').style.display = 'none';
        }

        const result = await FFB(`/server-db/user_account_app/${COMMON_GLOBAL.user_account_id ?? ''}`, null, 'GET', 'APP_ACCESS', null)
                        .catch(err=>{
                            AppDocument.querySelector(`#${spinner_item}`).classList.remove('css_spinner');
                            throw err;
                        });
        const user_account_app = JSON.parse(result)[0];

        //locale
        if (user_account_app.preference_locale==null)
            user_preferences_set_default_globals('LOCALE');
        else
            COMMON_GLOBAL.user_locale = user_account_app.preference_locale;
        //timezone
        if (user_account_app.app_setting_preference_timezone_id==null)
            user_preferences_set_default_globals('TIMEZONE');
        else
            COMMON_GLOBAL.user_timezone = user_account_app.app_setting_preference_timezone_value;

        //direction
        COMMON_GLOBAL.user_direction = user_account_app.app_setting_preference_direction_value;
        //arabic script
        COMMON_GLOBAL.user_arabic_script = user_account_app.app_setting_preference_arabic_script_value;
        //update body class with app theme, direction and arabic script usage classes
        common_preferences_update_body_class_from_preferences();
        //
        await common_translate_ui(COMMON_GLOBAL.user_locale);
        if (login_data.active==0){
            show_common_dialogue('VERIFY', 'LOGIN', login_data.email, null);
            throw 'ERROR';
        }
        else{
            AppDocument.querySelector(`#${spinner_item}`).classList.remove('css_spinner');
            ComponentRemove(current_dialogue, true);
            ComponentRemove('common_dialogue_profile', true);
            return {avatar: provider_id?login_data.provider_image:login_data.avatar};
        }
    }
};
/**
 * Countdown function to monitor token expire time
 * Uses event listener on element instead of setInterval since element can removed 
 * and then event listener will automatically be removed
 * @param {HTMLElement} element
 * @param {number} token_exp
 * @param {boolean} add_event
 * @returns {Promise.<void>}
 */
 const user_session_countdown = async (element, token_exp, add_event=false) => {
    /**
     * 
     * @returns {void}
     */
    const event_function = () => {user_session_countdown(element, token_exp);};
    if (add_event){
        element.addEventListener('change', event_function, false);
    }
    const time_left = ((token_exp ?? 0) * 1000) - (Date.now());
    if (time_left < 0){
        element.innerHTML ='';
        element.classList.add('common_user_session_expired');
        element.removeEventListener('change', event_function);
    }
    else{
        const days = Math.floor(time_left / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time_left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time_left % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time_left % (1000 * 60)) / 1000);
        element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        //wait 1 second
        await new Promise ((resolve)=>{setTimeout(()=> resolve(null), 1000);});
        if (element.id)
            element = AppDocument.querySelector(`#${element.id}`);
        else
            element = AppDocument.querySelector(`.${element.className.replaceAll(' ','.')}`);
        if (element)
            element.dispatchEvent(new Event('change'));
    }
};
/**
 * User logoff
 * @returns {Promise.<void>}
 */
const user_logoff = async () => {
    ComponentRemove('common_dialogue_user_menu');
    FFB('/server-iam/user/logoff', null, 'POST', 'APP_DATA', null)
    .then(()=>{
        if (COMMON_GLOBAL.app_id != COMMON_GLOBAL.common_app_id){
            AppDocument.querySelector('#common_user_menu_logged_in').style.display = 'none';
            AppDocument.querySelector('#common_user_menu_logged_out').style.display = 'inline-block';
            set_avatar(null, AppDocument.querySelector('#common_user_menu_avatar_img')); 
            close_window();
            ComponentRemove('common_dialogue_user_edit');
            dialogue_password_new_clear();
            ComponentRemove('common_dialogue_user_start');
            ComponentRemove('common_dialogue_profile', true);
        }
        user_preferences_set_default_globals('LOCALE');
        user_preferences_set_default_globals('TIMEZONE');
        user_preferences_set_default_globals('DIRECTION');
        user_preferences_set_default_globals('ARABIC_SCRIPT');
        //update body class with app theme, direction and arabic script usage classes
        common_preferences_update_body_class_from_preferences();
        if (COMMON_GLOBAL.system_admin == null)
            common_translate_ui(COMMON_GLOBAL.user_locale);
    })
    .catch((error)=>{
        COMMON_GLOBAL.service_socket_eventsource?COMMON_GLOBAL.service_socket_eventsource.close():null;
        reconnect();
        throw error;
    })
    .finally(()=>{
        COMMON_GLOBAL.token_admin_at = '';
        COMMON_GLOBAL.system_admin = null;

        COMMON_GLOBAL.token_at ='';
        COMMON_GLOBAL.user_account_id = null;
        COMMON_GLOBAL.user_account_username = null;

        COMMON_GLOBAL.token_exp = null;
        COMMON_GLOBAL.token_iat = null;
        COMMON_GLOBAL.token_timestamp = null;
    });
};

/**
 * User update
 * @returns {Promise.<null>}
 */
const user_update = async () => {
    return new Promise(resolve=>{
        const username = AppDocument.querySelector('#common_user_edit_input_username').innerHTML;
        const bio = AppDocument.querySelector('#common_user_edit_input_bio').innerHTML;
        const avatar = AppDocument.querySelector('#common_user_edit_avatar_img').src;
        const new_email = AppDocument.querySelector('#common_user_edit_input_new_email').innerHTML;
    
        let path;
        let json_data;
            
        
        if (AppDocument.querySelector('#common_user_edit_local').style.display == 'block') {
            if (input_control(AppDocument.querySelector('#common_dialogue_user_edit'),
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
            path = `/server-db/user_account/${COMMON_GLOBAL.user_account_id ?? ''}`;
        } else {
            if (input_control(AppDocument.querySelector('#common_dialogue_user_edit'),
                            {
                            bio: AppDocument.querySelector('#common_user_edit_input_bio')
                            })==false)
                return null;
            json_data = {   provider_id:    AppDocument.querySelector('#common_user_edit_provider_id').innerHTML,
                            username:       username,
                            bio:            bio,
                            private:        Number(AppDocument.querySelector('#common_user_edit_checkbox_profile_private').classList.contains('checked'))
                        };
            path = `/server-db/user_account-common/${COMMON_GLOBAL.user_account_id ?? ''}`;
        }
        AppDocument.querySelector('#common_user_edit_btn_user_update').classList.add('css_spinner');
        //update user using REST API
        FFB(path, null, 'PATCH', 'APP_ACCESS', json_data)
        .then(result=>{
            AppDocument.querySelector('#common_user_edit_btn_user_update').classList.remove('css_spinner');
            const user_update = JSON.parse(result);
            set_avatar(avatar, AppDocument.querySelector('#common_user_menu_avatar_img'));
            if (user_update.sent_change_email == 1){
                show_common_dialogue('VERIFY', 'NEW_EMAIL', new_email, null);
            }
            else
                ComponentRemove('common_dialogue_user_edit', true);
        })
        .catch(()=>AppDocument.querySelector('#common_user_edit_btn_user_update').classList.remove('css_spinner'))
        .finally(()=>resolve(null));
    });
};
/**
 * User signup
 * @returns {void}
 */
const user_signup = () => {
    const email = AppDocument.querySelector('#common_user_start_signup_email').innerHTML;
    if (input_control(AppDocument.querySelector('#common_dialogue_user_start'),
                            {
                            username: AppDocument.querySelector('#common_user_start_signup_username'),
                            password: AppDocument.querySelector('#common_user_start_signup_password'),
                            password_confirm: AppDocument.querySelector('#common_user_start_signup_password_confirm'),
                            password_confirm_reminder: AppDocument.querySelector('#common_user_start_signup_password_reminder'),
                            email: AppDocument.querySelector('#common_user_start_signup_email')
                            })==true){
        const json_data = { username:           AppDocument.querySelector('#common_user_start_signup_username').innerHTML,
                            password:           AppDocument.querySelector('#common_user_start_signup_password').innerHTML,
                            password_reminder:  AppDocument.querySelector('#common_user_start_signup_password_reminder').innerHTML,
                            email:              email,
                            active:             0,
                            ...get_uservariables()
                            };
        
        AppDocument.querySelector('#common_user_start_signup_button').classList.add('css_spinner');
    
        FFB('/server-db/user_account-signup', null, 'POST', 'APP_SIGNUP', json_data)
        .then(result=>{
            AppDocument.querySelector('#common_user_start_signup_button').classList.remove('css_spinner');
            const signup = JSON.parse(result);
            COMMON_GLOBAL.token_at = signup.accessToken;
            COMMON_GLOBAL.token_exp = JSON.parse(result).exp;
            COMMON_GLOBAL.token_iat = JSON.parse(result).iat;
            COMMON_GLOBAL.token_timestamp = JSON.parse(result).tokentimestamp;
            COMMON_GLOBAL.user_account_id = parseInt(signup.id);
            show_common_dialogue('VERIFY', 'SIGNUP', email, null);
        })
        .catch(()=>AppDocument.querySelector('#common_user_start_signup_button').classList.remove('css_spinner'));
    }
};
/**
 * User verify check input
 * @param {HTMLElement} item 
 * @param {string} nextField 
 * @param {function} login_function
 * @returns {Promise.<{ actived: number, 
 *                      verification_type : number}|null>}
 */
const user_verify_check_input = async (item, nextField, login_function) => {
    return new Promise((resolve, reject)=>{
        let json_data;
        const verification_type = parseInt(AppDocument.querySelector('#common_user_verify_data_verification_type').innerHTML);
        //only accept 0-9
        if (item.innerHTML.length==1 && ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(item.innerHTML) > -1)
            if (nextField == '' || (AppDocument.querySelector('#common_user_verify_verification_char1').innerHTML != '' &&
                    AppDocument.querySelector('#common_user_verify_verification_char2').innerHTML != '' &&
                    AppDocument.querySelector('#common_user_verify_verification_char3').innerHTML != '' &&
                    AppDocument.querySelector('#common_user_verify_verification_char4').innerHTML != '' &&
                    AppDocument.querySelector('#common_user_verify_verification_char5').innerHTML != '' &&
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
                FFB(`/server-db/user_account-activate/${COMMON_GLOBAL.user_account_id ?? ''}`, null, 'PUT', 'APP_DATA', json_data)
                .then(result=>{
                    AppDocument.querySelector('#common_user_verify_email_icon').classList.remove('css_spinner');
                    const user_activate = JSON.parse(result).items[0];
                    if (user_activate.affectedRows == 1) {
                        const resolve_function = () => {
                            ComponentRemove('common_dialogue_user_verify');
                            ComponentRemove('common_dialogue_user_edit', true);
                            resolve({   actived: 1, 
                                        verification_type : verification_type});
                        };
                        switch (verification_type){
                            //LOGIN
                            //SIGNUP
                            case 1:
                            case 2:{
                                login_function( false, 
                                                'common_user_verify_data_username',
                                                'common_user_verify_data_password')
                                                .then(()=> resolve_function());
                                break;
                            }
                            case 3:{
                                //FORGOT
                                COMMON_GLOBAL.token_at	= JSON.parse(result).accessToken;
                                COMMON_GLOBAL.token_exp = JSON.parse(result).exp;
                                COMMON_GLOBAL.token_iat = JSON.parse(result).iat;
                                COMMON_GLOBAL.token_timestamp = JSON.parse(result).tokentimestamp;
                                //show dialogue new password
                                show_common_dialogue('PASSWORD_NEW', null, JSON.parse(result).auth);
                                resolve_function();
                                break;
                            }
                            case 4:{
                                //NEW EMAIL
                                resolve_function();
                                break;
                            }
                        }
                        
                    } 
                    else{
                        AppDocument.querySelector('#common_user_verify_verification_char1').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char2').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char3').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char4').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char5').classList.add('common_input_error');
                        AppDocument.querySelector('#common_user_verify_verification_char6').classList.add('common_input_error');
                        //code not valid
                        show_message('ERROR', '20306', null, null, null, COMMON_GLOBAL.common_app_id);
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
/**
 * User delete
 * @param {number|null} choice 
 * @param {function|null} function_delete_event 
 * @returns {Promise.<{deleted:number}|null>}
 */
const user_delete = async (choice=null, function_delete_event ) => {
    return new Promise((resolve, reject)=>{
        const password = AppDocument.querySelector('#common_user_edit_input_password').innerHTML;
        switch (choice){
            case null:{
                if (AppDocument.querySelector('#common_user_edit_local').style.display == 'block' &&
                    input_control(AppDocument.querySelector('#common_dialogue_user_edit'),
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
                ComponentRemove('common_dialogue_message');
                AppDocument.querySelector('#common_user_edit_btn_user_delete_account').classList.add('css_spinner');
                const json_data = { password: password};
    
                FFB(`/server-db/user_account/${COMMON_GLOBAL.user_account_id ?? ''}`, null, 'DELETE', 'APP_ACCESS', json_data)
                .then(()=>{
                    AppDocument.querySelector('#common_user_edit_btn_user_delete_account').classList.remove('css_spinner');
                    resolve({deleted: 1});
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
/**
 * User function
 * @param {string} function_name 
 * @returns {Promise.<null>}
 */
const user_function = function_name => {
    return new Promise((resolve, reject)=>{
        const user_id_profile = AppDocument.querySelector('#common_profile_id').innerHTML;
        let method;
        let path;
        const json_data = { user_account_id: user_id_profile};
        const check_div = AppDocument.querySelector(`#common_profile_${function_name.toLowerCase()}`);
        if (check_div.children[0].style.display == 'block') {
            path = `/server-db/user_account_${function_name.toLowerCase()}/${COMMON_GLOBAL.user_account_id ?? ''}`;
            method = 'POST';
        } else {
            path = `/server-db/user_account_${function_name.toLowerCase()}/${COMMON_GLOBAL.user_account_id ?? ''}`;
            method = 'DELETE';
        }
        if (COMMON_GLOBAL.user_account_id == null)
            show_common_dialogue('LOGIN');
        else {
            FFB(path, null, method, 'APP_ACCESS', json_data)
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
/**
 * User account app delete
 * @param {number|null} choice 
 * @param {number} user_account_id 
 * @param {number} app_id 
 * @param {function|null} function_delete_event 
 */
const user_account_app_delete = (choice=null, user_account_id, app_id, function_delete_event=null) => {
    switch (choice){
        case null:{
            show_message('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL.app_id);
            break;
        }
        case 1:{
            ComponentRemove('common_dialogue_message');
            FFB(`/server-db/user_account_app/${user_account_id}`, `delete_app_id=${app_id}`, 'DELETE', 'APP_ACCESS', null)
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
/**
 * User forgot
 * @returns {Promise.<void>}
 */
const user_forgot = async () => {
    const email = AppDocument.querySelector('#common_user_start_forgot_email').innerHTML;
    const json_data = { email: email,
                        ...get_uservariables()
                    };
    if (input_control(AppDocument.querySelector('#common_dialogue_user_edit'),
                    {
                    email: AppDocument.querySelector('#common_user_start_forgot_email')
                    })==true){
        AppDocument.querySelector('#common_user_start_forgot_button').classList.add('css_spinner');
        FFB('/server-db/user_account-forgot', null, 'POST', 'APP_DATA', json_data)
        .then(result=>{
            AppDocument.querySelector('#common_user_start_forgot_button').classList.remove('css_spinner');
            const forgot = JSON.parse(result);
            if (forgot.sent == 1){
                COMMON_GLOBAL.user_account_id = parseInt(forgot.id);
                show_common_dialogue('VERIFY', 'FORGOT', email, null);
            }
        })
        .catch(()=>AppDocument.querySelector('#common_user_start_forgot_button').classList.remove('css_spinner'));
    }
};
/**
 * Update password
 * @returns {void}
 */
const updatePassword = () => {
    const password_new = AppDocument.querySelector('#common_user_password_new').innerHTML;
    const user_password_new_auth = AppDocument.querySelector('#common_user_password_new_auth').innerHTML;
    const json_data = { password_new:   password_new,
                        auth:           user_password_new_auth,
                        ...get_uservariables()
                     };
    if (input_control(AppDocument.querySelector('#common_dialogue_user_edit'),
                     {
                     password: AppDocument.querySelector('#common_user_password_new'),
                     password_confirm: AppDocument.querySelector('#common_user_password_new_confirm'),
                     
                     })==true){
        AppDocument.querySelector('#common_user_password_new_icon').classList.add('css_spinner');
        FFB(`/server-db/user_account-password/${COMMON_GLOBAL.user_account_id ?? ''}`, null, 'PATCH', 'APP_ACCESS', json_data)
        .then(()=>{
            AppDocument.querySelector('#common_user_password_new_icon').classList.remove('css_spinner');
            dialogue_password_new_clear();
            show_common_dialogue('LOGIN');
        })
        .catch(()=>AppDocument.querySelector('#common_user_password_new_icon').classList.remove('css_spinner'));
    }    
};
/**
 * User preference save
 * @returns {Promise.<void>}
 */
const user_preference_save = async () => {
    if (COMMON_GLOBAL.user_account_id != null){
        const select_locale =           AppDocument.querySelector('#common_dialogue_user_menu_user_locale_select');
        const select_timezone =         AppDocument.querySelector('#common_dialogue_user_menu_user_timezone_select');
        const select_direction =        AppDocument.querySelector('#common_dialogue_user_menu_user_direction_select');
        const select_arabic_script =    AppDocument.querySelector('#common_dialogue_user_menu_user_arabic_script_select');
        const json_data =
            {  
                preference_locale: select_locale.value,
                app_setting_preference_timezone_id:     select_timezone.options[select_timezone.selectedIndex].id,
                app_setting_preference_direction_id:    select_direction.selectedIndex==-1?null:select_direction.options[select_direction.selectedIndex].id,
                app_setting_preference_arabic_script_id:select_arabic_script.selectedIndex==-1?null:select_arabic_script.options[select_arabic_script.selectedIndex].id
            };
        await FFB(`/server-db/user_account_app/${COMMON_GLOBAL.user_account_id ?? ''}`, null, 'PATCH', 'APP_ACCESS', json_data);
    }
};
/**
 * User prefernce set default globals
 * @param {*} preference 
 * @returns {void}
 */
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

/**
 * Create QR code
 * @param {string} div 
 * @param {string} url 
 * @returns {Promise.<void>}
 */
const create_qr = async (div, url) => {
    const path_easy_qrcode = 'easy.qrcode';
    /**@type {import('../../../types.js').module_easy_qrcode} */
    const {QRCode} = await import(path_easy_qrcode);
    AppDocument.querySelector('#' + div).innerHTML='';
    new QRCode(AppDocument.querySelector('#' + div), {
        text: url,
        width: COMMON_GLOBAL['module_easy.qrcode_width'],
        height: COMMON_GLOBAL['module_easy.qrcode_height'],
        colorDark: COMMON_GLOBAL['module_easy.qrcode_color_dark'],
        colorLight: COMMON_GLOBAL['module_easy.qrcode_color_light'],
        drawer: 'svg'
    });
    //executing await promise 1 ms results in QRCode rendered
    await new Promise ((resolve)=>{setTimeout(()=> resolve(null),1);});
};
/**
 * Map init
 * @param {string} mount_div
 * @param {string} longitude 
 * @param {string} latitude 
 * @param {function|null} doubleclick_event 
 * @param {function|null} search_event_function 
 * @returns {Promise.<void>}
 */
const map_init = async (mount_div, longitude, latitude, doubleclick_event, search_event_function) => {
    COMMON_GLOBAL.module_leaflet_session_map = null;
    
    /** @type {import('../../../types.js').type_map_layer[]}*/
    const map_layers = await FFB('/server-db/app_settings_display', `data_app_id=${COMMON_GLOBAL.common_app_id}&setting_type=MAP_STYLE`, 'GET', 'APP_DATA')
    .then((/**@type{string}*/result)=>JSON.parse(result).rows)
    .catch((/**@type{Error}*/error)=>error);
    
    const map_layer_array = [];
    for (const map_layer_option of map_layers){
        map_layer_array.push({  id:map_layer_option.id, 
                                display_data:map_layer_option.display_data, 
                                value:map_layer_option.value, 
                                data2:map_layer_option.data2, 
                                data3:map_layer_option.data3, 
                                data4:map_layer_option.data4,
                                session_map_layer:null});
    }
    COMMON_GLOBAL.module_leaflet_map_styles =   map_layer_array;
    /**
     * 
     * @typedef {{  doubleClickZoom:function,
     *              invalidateSize:function,
     *              removeLayer:function,
     *              setView:function,
     *              flyTo:function,
     *              setZoom:function,
     *              getZoom:function}} type_map_data
     * @type {{ library_Leaflet:*,
     *          module_map: type_map_data,
     *          leaflet_container:string}}
     */
    const leaflet_data = await ComponentRender(mount_div, 
                        {   
                            longitude:longitude,
                            latitude:latitude,
                            //module parameters
                            module_leaflet_zoom:COMMON_GLOBAL.module_leaflet_zoom,
                            module_leaflet_jumpto:COMMON_GLOBAL.module_leaflet_jumpto,
                            module_leaflet_map_style:COMMON_GLOBAL.module_leaflet_style,
                            module_leaflet_marker_div_gps:COMMON_GLOBAL.module_leaflet_marker_div_gps,
                            //functions
                            function_FFB:FFB,
                            function_event_doubleclick: doubleclick_event,
                            function_get_place_from_gps:get_place_from_gps,
                            function_map_update:map_update
                            },
                        '/common/component/module_leaflet.js')
    .catch(error=>{throw error;});
    COMMON_GLOBAL.module_leaflet =              leaflet_data.library_Leaflet;
    COMMON_GLOBAL.module_leaflet_session_map =  leaflet_data.module_map;
    await ComponentRender(mount_div, //outer app div
                        {   
                            data_app_id:COMMON_GLOBAL.common_app_id,
                            locale:COMMON_GLOBAL.user_locale,
                            longitude:longitude,
                            latitude:latitude,
                            map_layer:COMMON_GLOBAL.module_leaflet_style,
                            map_layers:COMMON_GLOBAL.module_leaflet_map_styles,
                            module_leaflet_container:leaflet_data.leaflet_container,    //inner Leaflet div returned from Leaflet
                            function_FFB:FFB,
                            function_search_event:search_event_function,
                            function_SearchAndSetSelectedIndex:SearchAndSetSelectedIndex,
                            function_map_setstyle:map_setstyle
                            },
                        '/common/component/module_leaflet_control.js');
};
/**
 * Map country
 * @param {string} lang_code 
 * @returns {Promise.<string>}
 */
const map_country = lang_code =>{
    return new Promise ((resolve, reject)=>{
        let current_group_name = '';
        //country
        FFB('/server-db/country', `lang_code=${lang_code}`, 'GET', 'APP_DATA', null)
        .then(result=>{resolve(
            '<option value=\'\' id=\'\' label=\'…\'>…</option>'
            +
            JSON.parse(result).rows.map((/**@type{*}*/country, /**@type{number}*/index)=>{
                const row = (current_group_name !== country.group_name?`<optgroup label=${country.group_name}/>`:'')
                            +
                            `<option value=${index}
                                    id=${country.id} 
                                    country_code=${country.country_code} 
                                    flag_emoji=${country.flag_emoji} 
                                    group_name=${country.group_name}>${country.flag_emoji} ${country.text}
                            </option>`;
                current_group_name = country.group_name;
                return row;
            }).join(''));
        })
        .catch(err=>reject(err));
    });
    
};
/**
 * Map city
 * @param {*} country_code 
 * @returns {void}
 */
const map_city = country_code =>{
    const select_cities = AppDocument.querySelector('#common_module_leaflet_select_city');
    //set default option
    select_cities.innerHTML='<option value=\'\' id=\'\' label=\'…\' selected=\'selected\'>…</option>';
    if (country_code!=null){
        get_cities(country_code.toUpperCase())
        .then(cities=>{
            //fetch list including default option
            select_cities.innerHTML = cities;
        });
    }
};
/**
 * Map city empty
 * @returns {void}
 */
const map_city_empty = () =>{
    //remove old city list:      
    const select_city = AppDocument.querySelector('#common_module_leaflet_select_city');
    const old_groups = select_city.querySelectorAll('optgroup');
    for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
        select_city.removeChild(old_groups[old_index]);
    //display first empty city
    select_city.selectedIndex = 0;
};
/**
 * Map toolbar reset
 * @returns {void}
 */
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
/**
 * Map show search on map
 * @param {{city:string, country:string, longitude:string, latitude:string}} data 
 * @returns {Promise<void>}
 */
const map_show_search_on_map = async data =>{
    const place =  data.city + ', ' + data.country;
    await map_update({  longitude:data.longitude,
                        latitude:data.latitude,
                        zoomvalue:COMMON_GLOBAL.module_leaflet_zoom_city,
                        text_place:place,
                        country:'',
                        city:'',
                        timezone_text :null,
                        marker_id:COMMON_GLOBAL.module_leaflet_marker_div_city,
                        to_method:COMMON_GLOBAL.module_leaflet_jumpto
                    });
    map_toolbar_reset();
};
/**
 * Map control toogle expand
 * @param {string} item 
 * @returns {Promise.<void>}
 */
const map_control_toggle_expand = async item =>{
    let style_display;
    if (AppDocument.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display=='none' ||
        AppDocument.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display ==''){
            style_display = 'block';
            if (item == 'search')
                AppDocument.querySelector('#common_module_leaflet_select_country').innerHTML = await map_country(COMMON_GLOBAL.user_locale);
        }
    else
        style_display = 'none';
    AppDocument.querySelector(`#common_module_leaflet_control_expand_${item}`).style.display = style_display;
};
/**
 * Map resize
 * @returns {Promise.<void>}
 */
const map_resize = async () => {
    //fixes not rendering correct showing map div
    COMMON_GLOBAL.module_leaflet_session_map?.invalidateSize?.();
};
/**
 * Map line remove all
 * @returns {void}
 */
const map_line_removeall = () => {
    if(COMMON_GLOBAL.module_leaflet_session_map_layer)
        for (let i=0;i<COMMON_GLOBAL.module_leaflet_session_map_layer.length;i++){
            COMMON_GLOBAL.module_leaflet_session_map?.removeLayer?.(COMMON_GLOBAL.module_leaflet_session_map_layer[i]);
        }
    COMMON_GLOBAL.module_leaflet_session_map_layer=[];
};
/**
 * Map line create 
 * @param {string} id 
 * @param {string} title 
 * @param {number} text_size 
 * @param {number} from_longitude 
 * @param {number} from_latitude 
 * @param {number} to_longitude 
 * @param {number} to_latitude 
 * @param {string} color 
 * @param {number} width 
 * @param {number} opacity 
 * @returns {void}
 */
const map_line_create = (id, title, text_size, from_longitude, from_latitude, to_longitude, to_latitude, color, width, opacity) => {
    /**Text size to be implemented */
    const geojsonFeature = {
        id: `"${id}"`,
        type: 'Feature',
        properties: { title: title },
        geometry: {
            type: 'LineString',
                coordinates: [
                    [from_longitude, from_latitude],
                    [to_longitude, to_latitude]
                ]
        }
    };
    //use GeoJSON to draw a line
    const myStyle = {
        color: color,
        weight: width,
        opacity: opacity
    };
    
    const layer = COMMON_GLOBAL.module_leaflet.geoJSON(geojsonFeature, {style: myStyle}).addTo(COMMON_GLOBAL.module_leaflet_session_map);
    /**@ts-ignore*/
    COMMON_GLOBAL.module_leaflet_session_map_layer.push(layer);
};
/**
 * Map set style
 * @param {string} mapstyle 
 * @returns {void}
 */
const map_setstyle = mapstyle => {
    for (const module_leaflet_map_style of COMMON_GLOBAL.module_leaflet_map_styles){
        if (COMMON_GLOBAL.module_leaflet_session_map && module_leaflet_map_style.session_map_layer){
            COMMON_GLOBAL.module_leaflet_session_map?.removeLayer?.(module_leaflet_map_style.session_map_layer);
        }
    }
    const mapstyle_record = COMMON_GLOBAL.module_leaflet_map_styles.filter(map_style=>map_style.value==mapstyle)[0];
    if (mapstyle_record.data3)
        mapstyle_record.session_map_layer = COMMON_GLOBAL.module_leaflet.tileLayer(mapstyle_record.data2, {
            maxZoom: mapstyle_record.data3,
            attribution: mapstyle_record.data4
        }).addTo(COMMON_GLOBAL.module_leaflet_session_map);
    else
        mapstyle_record.session_map_layer = COMMON_GLOBAL.module_leaflet.tileLayer(mapstyle_record.data2, {
            attribution: mapstyle_record.data4
        }).addTo(COMMON_GLOBAL.module_leaflet_session_map);
};
/**
 * Map update
 * @param {{longitude:string,
 *          latitude:string,
 *          zoomvalue:number|null,
 *          text_place:string,
 *          country:string,
 *          city:string,
 *          timezone_text :string|null,
 *          marker_id:string,
 *          to_method:number
 *          }} parameters
 * @returns {Promise.<string|null>}
 */
const map_update = async (parameters) => {
    const path_regional ='regional';
    /**@type {import('../../../types.js').module_regional} */
    const {getTimezone} = await import(path_regional);
    return new Promise((resolve)=> {
        /**
         * Map update GPS
         * @param {number} to_method 
         * @param {number|null} zoomvalue 
         * @param {string} longitude 
         * @param {string} latitude 
         */
        const map_update_gps = (to_method, zoomvalue, longitude, latitude) => {
            switch (to_method){
                case 0:{
                    if (zoomvalue == null){
                        COMMON_GLOBAL.module_leaflet_session_map?.setView?.(new COMMON_GLOBAL.module_leaflet.LatLng(latitude, longitude));
                    }
                    else{
                        COMMON_GLOBAL.module_leaflet_session_map?.setView?.(new COMMON_GLOBAL.module_leaflet.LatLng(latitude, longitude), zoomvalue);
                    }
                    break;
                }
                case 1:{
                    COMMON_GLOBAL.module_leaflet_session_map?.flyTo?.([latitude, longitude], COMMON_GLOBAL.module_leaflet_zoom);
                    break;
                }
                //also have COMMON_GLOBAL.module_leaflet_session_map.panTo(new COMMON_GLOBAL.module_leaflet.LatLng({lng: longitude, lat: latitude}));
            }
        };
        map_update_gps(parameters.to_method, parameters.zoomvalue, parameters.longitude, parameters.latitude);
        if (parameters.timezone_text == null)
            parameters.timezone_text = getTimezone(parameters.latitude, parameters.longitude);

        ComponentRender(null,{  
                                timezone_text:parameters.timezone_text,
                                latitude:parameters.latitude,
                                longitude:parameters.longitude,
                                marker_id:parameters.marker_id,
                                text_place:parameters.text_place,
                                country:parameters.country,
                                city:parameters.city,
                                module_leaflet:COMMON_GLOBAL.module_leaflet,
                                module_leaflet_popup_offset: COMMON_GLOBAL.module_leaflet_popup_offset,
                                module_leaflet_session_map:COMMON_GLOBAL.module_leaflet_session_map
                            },'/common/component/module_leaflet_popup.js')
        .then(()=>resolve(parameters.timezone_text));
    });
};
/**
 * Frontend for Backend (FFB)
 * @param {string} path 
 * @param {string|null} query
 * @param {string} method 
 * @param {string} authorization_type 
 * @param {*} json_data 
 * @returns {Promise.<*>} 
 */
const FFB = async (path, query, method, authorization_type, json_data=null) => {
    /**@type{number} */
    let status;
    let authorization_bearer = null;
    let authorization_basic = null;
    let service_path;
    query = query==null?'':query;
    switch (authorization_type){
        case 'APP_DATA':{
            //id token authorization check
            authorization_bearer = `Bearer ${COMMON_GLOBAL.token_dt}`;
            service_path = `${COMMON_GLOBAL.rest_resource_bff}/app_data`;
            break;
        }
        case 'APP_SIGNUP':{
            //id token signup authorization check
            authorization_bearer = `Bearer ${COMMON_GLOBAL.token_dt}`;
            service_path = `${COMMON_GLOBAL.rest_resource_bff}/app_signup`;
            break;
        }
        case 'APP_ACCESS':{
            //user or admins authorization
            authorization_bearer = `Bearer ${COMMON_GLOBAL.token_at}`;
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.common_app_id)
                service_path = `${COMMON_GLOBAL.rest_resource_bff}/admin`;
            else
                service_path = `${COMMON_GLOBAL.rest_resource_bff}/app_access`;
            break;
        }
        case 'SUPERADMIN':{
            // super admin authorization
            authorization_bearer = `Bearer ${COMMON_GLOBAL.token_at}`;
            service_path = `${COMMON_GLOBAL.rest_resource_bff}/superadmin`;
            break;
        }
        case 'SYSTEMADMIN':{
            //systemadmin authorization
            authorization_bearer = `Bearer ${COMMON_GLOBAL.token_admin_at}`;
            service_path = `${COMMON_GLOBAL.rest_resource_bff}/systemadmin`;
            break;
        }
        case 'SOCKET':{
            //broadcast connect authorization
            authorization_bearer = `Bearer ${COMMON_GLOBAL.token_dt}`;
            //use query to send authorization since EventSource does not support headers
            json_data = null;
            service_path = `${COMMON_GLOBAL.rest_resource_bff}/socket`;
            break;
        }
        case 'IAM_SYSTEMADMIN':
        case 'IAM_PROVIDER':
        case 'IAM_USER':{
            //user,admin or system admin login
            authorization_bearer = `Bearer ${COMMON_GLOBAL.token_dt}`;
            authorization_basic = `Basic ${AppWindow.btoa(json_data.username + ':' + json_data.password)}`;
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.common_app_id && authorization_type == 'IAM_USER')
                service_path = `${COMMON_GLOBAL.rest_resource_bff}/iam_admin`;
            else
                service_path = `${COMMON_GLOBAL.rest_resource_bff}/${authorization_type.toLowerCase()}`;
            break;
        }
    }
    
    //add common query parameter
    query += `&lang_code=${COMMON_GLOBAL.user_locale}`;
    //encode query parameters
    const encodedparameters = query?toBase64(query):'';
    //add and encode IAM parameters, always use Bearer id token in iam to validate EventSource connections
    const authorization_iam = `Bearer ${COMMON_GLOBAL.token_dt}`;
    const iam =  toBase64(  `&authorization_bearer=${authorization_iam}&user_id=${COMMON_GLOBAL.user_account_id ?? ''}&system_admin=${COMMON_GLOBAL.system_admin ?? ''}` + 
                            `&client_id=${COMMON_GLOBAL.service_socket_client_ID}`+
                            `&app_id=${COMMON_GLOBAL.app_id??''}`);

    const url = `${service_path}/v${(COMMON_GLOBAL.app_rest_api_version ?? 1)}${path}?parameters=${encodedparameters}&iam=${iam}`;

    if (authorization_type=='SOCKET'){
        return new EventSource(url);
    }
    else{
        //add options to fetch
        let options = {};
        if (json_data ==null)
            options = {
                        method: method,
                        headers: {
                                    Authorization: authorization_basic ?? authorization_bearer
                                },
                        body: null
                    };
        else
            options = {
                    method: method,
                    headers: {
                                'Content-Type': 'application/json',
                                Authorization: authorization_basic ?? authorization_bearer
                            },
                    body: JSON.stringify(json_data)
                };
        return await fetch(url, options)
                .then((response) => {
                    status = response.status;
                    return response.text();
                })
                .then((result) => {
                    switch (status){
                        case 200:
                        case 201:{
                            //OK
                            return result;
                        }
                        case 400:{
                            //Bad request
                            show_message('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                        case 404:{
                            //Not found
                            show_message('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                        case 401:{
                            //Unauthorized, token expired
                            show_message('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                        case 403:{
                            //Forbidden, not allowed to login or register new user
                            show_message('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                        case 500:{
                            //Unknown error
                            exception(COMMON_GLOBAL.app_function_exception, result);
                            throw result;
                        }
                        case 503:{
                            //Service unavailable or other error in microservice
                            show_message('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                    }
                })
                .catch(error=>{throw error;});
    }        
};
/**
 * Show broadcast message
 * @param {string} broadcast_message 
 * @returns {void}
 */
const show_broadcast = (broadcast_message) => {
    broadcast_message = AppWindow.atob(broadcast_message);
    const broadcast_type = JSON.parse(broadcast_message).broadcast_type;
    const message = JSON.parse(broadcast_message).broadcast_message;
    switch (broadcast_type){
        case 'MAINTENANCE':{
            if (AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`))
                location.href = '/';
            else
                if (message)
                    show_maintenance(AppWindow.atob(message));
            break;
        }
        case 'SESSION_EXPIRED':{
            COMMON_GLOBAL.app_function_session_expired?COMMON_GLOBAL.app_function_session_expired():null;
            break;
        }
        case 'CONNECTINFO':{
            COMMON_GLOBAL.service_socket_client_ID =    JSON.parse(AppWindow.atob(message)).client_id;
            COMMON_GLOBAL.client_latitude =             JSON.parse(AppWindow.atob(message)).latitude==''?COMMON_GLOBAL.client_latitude:JSON.parse(AppWindow.atob(message)).latitude;
            COMMON_GLOBAL.client_longitude =            JSON.parse(AppWindow.atob(message)).longitude==''?COMMON_GLOBAL.client_longitude:JSON.parse(AppWindow.atob(message)).longitude;
            COMMON_GLOBAL.client_place =                JSON.parse(AppWindow.atob(message)).place==''?COMMON_GLOBAL.client_place:JSON.parse(AppWindow.atob(message)).place;
            COMMON_GLOBAL.client_timezone =             JSON.parse(AppWindow.atob(message)).timezone==''?COMMON_GLOBAL.client_timezone:JSON.parse(AppWindow.atob(message)).timezone;
            break;
        }
        case 'CHAT':
        case 'ALERT':{
            if (AppDocument.querySelector('#common_dialogue_maintenance'))
                ComponentRender('common_broadcast', {message:AppWindow.atob(message)}, '/maintenance/component/broadcast.js');
            else
                ComponentRender('common_broadcast', {message:AppWindow.atob(message)}, '/common/component/broadcast.js');
            break;
        }
		case 'PROGRESS':{
			show_message('PROGRESS', null, null, null, JSON.parse(AppWindow.atob(message)));
            break;
        }
        case 'APP_FUNCTION':{
            if (COMMON_GLOBAL.app_function_sse)
                COMMON_GLOBAL.app_function_sse(AppWindow.atob(message));
        }
    }
};
/**
 * Show maintenance
 * @param {string|null} message 
 * @param {number|null} init 
 * @returns {void}
 */
const show_maintenance = (message, init=null) => {
    
    if (init==1){
        ComponentRender('common_dialogue_maintenance', 
                        {},
                        '/maintenance/component/dialogue_maintenance.js');
    }
    else
        AppDocument.querySelector('#common_maintenance_footer').innerHTML = message ?? '';
};
/**
 * Socket reconnect
 * @returns {void}
 */
const reconnect = () => {
    setTimeout(()=>{connectOnline();}, 5000);
};
/**
 * Socket connect online
 * @returns {Promise.<void>}
 */
const connectOnline = async () => {
    FFB('/server-socket/socket', null, 'GET', 'SOCKET', null)
    .then((result_eventsource)=>{
        COMMON_GLOBAL.service_socket_eventsource = result_eventsource;
        if (COMMON_GLOBAL.service_socket_eventsource){
            COMMON_GLOBAL.service_socket_eventsource.onmessage = (/**@type{import('../../../types.js').AppEventEventSource}*/event) => {
                show_broadcast(event.data);
            };
            COMMON_GLOBAL.service_socket_eventsource.onerror = () => {
                if (COMMON_GLOBAL.service_socket_eventsource)
                    COMMON_GLOBAL.service_socket_eventsource.close();
                reconnect();
            };
        }
    })
    .catch(()=>reconnect());
};
/**
 * Socket check online
 * @param {string} div_icon_online 
 * @param {number} user_account_id 
 * @returns {void}
 */
const checkOnline = (div_icon_online, user_account_id) => {
    FFB(`/server-socket/socket-status/${user_account_id}`, null, 'GET', 'APP_DATA', null)
    .then(result=>AppDocument.querySelector('#' + div_icon_online).className = 'common_icon ' + (JSON.parse(result).online==1?'online':'offline'));
};
/**
 * Get place from GPS
 * @param {string} longitude 
 * @param {string} latitude 
 * @returns {Promise.<string>}
 */
const get_place_from_gps = async (longitude, latitude) => {
    return await new Promise((resolve)=>{
        FFB('/geolocation/place', `longitude=${longitude}&latitude=${latitude}`, 'GET', 'APP_DATA', null)
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
/**
 * Get GPS from IP
 * @returns {Promise.<null>}
 */
const get_gps_from_ip = async () => {
    return new Promise((resolve)=>{
        FFB('/geolocation/ip', null, 'GET', 'APP_DATA', null)
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
            resolve(null);
        })
        .catch(()=>resolve(null));
    });

};
/**
 * Worldcities - Get cities
 * @param {string} countrycode 
 * @returns {Promise.<string>}
 */
const get_cities = async countrycode => {
    return new Promise((resolve, reject)=>{
        FFB(`/worldcities/country/${countrycode}`, null, 'GET', 'APP_DATA', null)
        .then(result=>{
            /**@type{{id:number, country:string, iso2:string, lat:string, lng:string, admin_name:string, city:string}[]} */
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
                    cities_options += `<option value='' id='' label='…'>…</option>
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
/**
 * Worldcities - Search
 * @param {function} event_function 
 * @returns {Promise.<void>}
 */
const worldcities_search = async (event_function) =>{
    ComponentRender('common_module_leaflet_search_list_wrap',
                        {
                            search:AppDocument.querySelector('#common_module_leaflet_search_input').innerText,
                            function_click_function:event_function,
                            function_FFB:FFB
                        },
                        '/common/component/module_leaflet_search_city.js');
};
/**
 * Exception function
 * @param {function|null} app_exception_function 
 * @param {Error|string} error 
 * @returns {void}
 */
const exception = (app_exception_function, error) => {
    if (app_exception_function)
        app_exception_function(error);
};
/**
 * Set app service parameters
 * @param {*} parameters 
 * @returns {Promise.<void>}
 */
const set_app_service_parameters = async parameters => {
    //app info
    COMMON_GLOBAL.common_app_id= parseInt(parameters.common_app_id);
    COMMON_GLOBAL.app_id = parameters.app_id;
    COMMON_GLOBAL.app_logo = parameters.app_logo;

    COMMON_GLOBAL.app_email= parameters.app_email;
    COMMON_GLOBAL.app_copyright= parameters.app_copyright;
    COMMON_GLOBAL.app_link_url= parameters.app_link_url;
    COMMON_GLOBAL.app_link_title= parameters.app_link_title;
    COMMON_GLOBAL.app_text_edit= parameters.app_text_edit;
    
    COMMON_GLOBAL.app_framework = parameters.app_framework;
    COMMON_GLOBAL.app_framework_messages = parameters.app_framework_messages;
    COMMON_GLOBAL.app_rest_api_version = parameters.app_rest_api_version;
    
    //rest 
    COMMON_GLOBAL.rest_resource_bff = parameters.rest_resource_bff;

    //client credentials
    COMMON_GLOBAL.token_dt = parameters.app_idtoken;

    //system admin
    COMMON_GLOBAL.system_admin = null;
    COMMON_GLOBAL.system_admin_only = parameters.system_admin_only;
    COMMON_GLOBAL.system_admin_first_time = parameters.first_time;

    //user info
    COMMON_GLOBAL.user_identity_provider_id=null;
    COMMON_GLOBAL.user_account_id = null;
    
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

    COMMON_GLOBAL.translate_items = parameters.translate_items;

    COMMON_GLOBAL.user_locale                = parameters.locale;
    COMMON_GLOBAL.user_timezone              = parameters.client_timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    COMMON_GLOBAL.user_direction             = '';
    COMMON_GLOBAL.user_arabic_script         = '';  
};
/**
 * Disable textediting
 * @returns {boolean}
 */
const disable_textediting = () =>COMMON_GLOBAL.app_text_edit=='0';
/**
 * Common events
 * @param {string} event_type 
 * @param {import('../../../types.js').AppEvent|null} event 
 * @returns {Promise.<void>}
 */
const common_event = async (event_type,event=null) =>{
    if (event==null){
        AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener(event_type, (/**@type{import('../../../types.js').AppEvent}*/event) => {
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
                        case event.target.parentNode.classList.contains('common_select_dropdown_value')?event_target_id:'':
                        case event.target.parentNode.classList.contains('common_select_dropdown_icon')?event_target_id:'':
                        case event.target.classList.contains('common_select_dropdown_value')?event_target_id:'':
                        case event.target.classList.contains('common_select_dropdown_icon')?event_target_id:'':{
                            AppDocument.querySelector(`#${event_target_id} .common_select_options`).style.display = 
                                AppDocument.querySelector(`#${event_target_id} .common_select_options`).style.display=='block'?'none':'block';
                            break;
                        }
                        case event.target.parentNode.classList.contains('common_select_option')?event_target_id:'':{
                            AppDocument.querySelector(`#${event_target_id} .common_select_dropdown_value`).innerHTML = event.target.parentNode.innerHTML;
                            AppDocument.querySelector(`#${event_target_id} .common_select_dropdown_value`).setAttribute('data-value', event.target.parentNode.getAttribute('data-value'));
                            event.target.parentNode.parentNode.style.display = 'none';
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
                            AppDocument.querySelectorAll('#common_user_start_nav > div').forEach((/**@type{HTMLElement}*/tab)=>tab.classList.remove('common_user_start_selected'));
                            AppDocument.querySelector(`#${event_target_id}`).classList.add('common_user_start_selected');
                            
                            AppDocument.querySelectorAll('#common_dialogue_user_start .common_user_start_form').forEach((/**@type{HTMLElement}*/form)=>form.style.display='none');
                            AppDocument.querySelector(`#${event_target_id}_form`).style.display='inline-block';
    
                            break;
                        }
                        case 'common_user_start_close':{
                            ComponentRemove('common_dialogue_user_start', true);
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
                            ComponentRemove('common_dialogue_message',true);
                            break;
                        }
                        case 'common_message_cancel':{
                            ComponentRemove('common_dialogue_message',true);
                            break;
                        }
                        //dialogue password
                        case 'common_user_password_new_cancel':{
                            dialogue_password_new_clear();
                            break;
                        }
                        case 'common_user_password_new_ok':{
                            await updatePassword();
                            break;
                        }
                        case 'common_profile_search_icon':{
                            AppDocument.querySelector('#common_profile_search_input').focus();
                            AppDocument.querySelector('#common_profile_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                            break;
                        }
                        //Dialogue apps
                        case 'common_dialogue_apps_list':
                            if (event.target.className == 'common_dialogue_apps_app_logo'){
                                const app_url = element_row(event.target).querySelector('.common_dialogue_apps_app_url');
                                if (app_url)
                                    AppWindow.open(app_url.innerHTML);
                            }
                            break;
                        case 'common_dialogue_apps_info':{
                            event.preventDefault();
                            AppDocument.querySelector('#common_dialogue_info' ).style.visibility ='visible';
                            AppDocument.querySelector('#common_dialogue_apps' ).style.visibility ='hidden';
                            break;
                        }
                        case 'common_dialogue_info_app_link':{
                            if (COMMON_GLOBAL.app_link_url)
                                AppWindow.open(COMMON_GLOBAL.app_link_url,'_blank','');
                            break;
                        }
                        //Dialogue info
                        case 'common_dialogue_info_app_menu_apps':{
                            AppDocument.querySelector('#common_dialogue_info_app_menu_content_apps' ).style.display ='block';
                            AppDocument.querySelector('#common_dialogue_info_app_menu_content_info' ).style.display ='none';
                            break;
                        }
                        case 'common_dialogue_info_app_menu_info':{
                            AppDocument.querySelector('#common_dialogue_info_app_menu_content_apps' ).style.display ='none';
                            AppDocument.querySelector('#common_dialogue_info_app_menu_content_info' ).style.display ='block';
                            break;
                        }
                        case 'common_dialogue_info_info_diagram':
                        case 'common_dialogue_info_info_diagram_img':{
                            ComponentRender('common_window_info',
                                            {   info:0,
                                                url:AppDocument.querySelector('#common_dialogue_info_info_diagram_img').getAttribute('data-src'), 
                                                content_type:null, 
                                                iframe_content:null}, 
                                            '/common/component/window_info.js');
                            break;
                        }
                        case 'common_dialogue_info_info_datamodel':
                        case 'common_dialogue_info_info_datamodel_img':{
                            ComponentRender('common_window_info',
                                            {   info:0,
                                                url:AppDocument.querySelector('#common_dialogue_info_info_datamodel_img').getAttribute('data-src'),
                                                content_type:null, 
                                                iframe_content:null}, 
                                            '/common/component/window_info.js');
                            break;
                        }
                        case 'common_dialogue_info_home':{
                            event.preventDefault();
                            AppDocument.querySelector('#common_dialogue_info' ).style.visibility ='hidden';
                            AppDocument.querySelector('#common_dialogue_apps' ).style.visibility ='visible';
                            break;
                        }
                        case 'common_dialogue_info_app_email':{
                            AppWindow.open(`mailto:${COMMON_GLOBAL.app_email}`,'_blank','');
                            break;
                        }
                        case 'common_dialogue_info_info_link1':{
                            ComponentRender('common_window_info',
                                            {   info:1,
                                                url:COMMON_GLOBAL.info_link_policy_url,
                                                content_type:null, 
                                                iframe_content:null}, '/common/component/window_info.js');
                            break;
                        }
                        case 'common_dialogue_info_info_link2':{
                            ComponentRender('common_window_info',
                                            {   info:1,
                                                url:COMMON_GLOBAL.info_link_disclaimer_url,
                                                content_type:null, 
                                                iframe_content:null}, '/common/component/window_info.js');
                            break;
                        }
                        case 'common_dialogue_info_info_link3':{
                            ComponentRender('common_window_info',
                                            {   info:1,
                                                url:COMMON_GLOBAL.info_link_terms_url,
                                                content_type:null, 
                                                iframe_content:null}, '/common/component/window_info.js');
                            break;
                        }case 'common_dialogue_info_info_link4':{
                            ComponentRender('common_window_info',
                                            {   info:1,
                                                url:COMMON_GLOBAL.info_link_about_url,
                                                content_type:null, 
                                                iframe_content:null}, '/common/component/window_info.js');
                            break;
                        }
                        //dialogue app_data_display
                        case event.target.classList.contains('common_app_data_display_button_print')?event_target_id:'':
                        case event.target.classList.contains('common_app_data_display_button_update')?event_target_id:'':
                        case event.target.classList.contains('common_app_data_display_button_post')?event_target_id:'':
                        case event.target.classList.contains('common_app_data_display_button_delete')?event_target_id:'':{
                            if (AppDocument.querySelector(`#${event_target_id}`)['data-function'])
                                    AppDocument.querySelector(`#${event_target_id}`)['data-function']();
                            break;
                        }
                        //window info
                        case 'common_window_info_btn_close':{
                            close_window();
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
                        case 'common_dialogue_user_menu_log_in':{
                            ComponentRemove('common_dialogue_user_menu');
                            show_common_dialogue('LOGIN');
                            break;
                        }
                        case 'common_dialogue_user_menu_edit':{
                            ComponentRender('common_dialogue_user_edit', 
                                {   user_account_id:COMMON_GLOBAL.user_account_id,
                                    common_app_id:COMMON_GLOBAL.common_app_id,
                                    translation_username:COMMON_GLOBAL.translate_items.USERNAME,
                                    translation_bio:COMMON_GLOBAL.translate_items.BIO,
                                    translation_new_email:COMMON_GLOBAL.translate_items.NEW_EMAIL,
                                    translation_password:COMMON_GLOBAL.translate_items.PASSWORD,
                                    translation_password_confirm:COMMON_GLOBAL.translate_items.PASSWORD_CONFIRM,
                                    translation_new_password:COMMON_GLOBAL.translate_items.NEW_PASSWORD,
                                    translation_new_password_confirm:COMMON_GLOBAL.translate_items.NEW_PASSWORD_CONFIRM,
                                    translation_password_reminder:COMMON_GLOBAL.translate_items.PASSWORD_REMINDER,
                                    function_FFB:FFB,
                                    function_set_avatar:set_avatar,
                                    function_show_message:show_message,
                                    function_format_json_date:format_json_date,
                                    },
                                '/common/component/dialogue_user_edit.js')
                            .then(()=>{
                                ComponentRemove('common_dialogue_user_menu');
                            });
                            break;
                        }
                        case 'common_dialogue_user_menu_signup':{
                            ComponentRemove('common_dialogue_user_menu');
                            show_common_dialogue('SIGNUP');
                            break;
                        }
                        //dialogue user edit
                        case 'common_user_edit_close':{
                            ComponentRemove('common_dialogue_user_edit', true);
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
                            ComponentRemove('common_dialogue_user_verify');
                            break;
                        }
                        //search list
                        case 'common_profile_search_list':{
                            if (event.target.classList.contains('common_profile_search_list_username')){
                                if (AppDocument.querySelector('#common_profile_search_list')['data-function']){
                                    AppDocument.querySelector('#common_profile_search_list')['data-function'](element_row(event.target).getAttribute('data-user_account_id'));
                                }
                                else
                                    await profile_show(Number(element_row(event.target).getAttribute('data-user_account_id')),null);
                            }
                            break;
                        }
                        //dialogue profile and profile top
                        case 'common_profile_close':{
                            ComponentRemove('common_dialogue_profile', true);
                            break;
                        }
                        case 'common_profile_stat_list':
                        case 'common_profile_detail_list':{
                            if (event.target.classList.contains('common_profile_stat_list_username')||
                                event.target.classList.contains('common_profile_detail_list_username')){
                                //execute function from inparameter or use default when not specified
                                if (AppDocument.querySelector(`#${element_id(event.target)}`)['data-function'])
                                    AppDocument.querySelector(`#${element_id(event.target)}`)['data-function'](element_row(event.target).getAttribute('data-user_account_id'));
                                else
                                    await profile_show(Number(element_row(event.target).getAttribute('data-user_account_id')),null);
                            }
                            else{
                                //app list
                                if (event.target.classList.contains('common_profile_detail_list_app_name')){
                                    AppWindow.open(element_row(event.target).getAttribute('data-url') ?? '', '_blank');
                                }
                                else
                                    if (AppDocument.querySelector('#common_profile_id').innerHTML==COMMON_GLOBAL.user_account_id &&
                                        event.target.parentNode.classList.contains('common_profile_detail_list_app_delete')){
                                            await user_account_app_delete(null, 
                                                                    AppDocument.querySelector('#common_profile_id').innerHTML,
                                                                    Number(element_row(event.target).getAttribute('data-app_id')),
                                                                    () => { 
                                                                        ComponentRemove('common_dialogue_message');
                                                                        user_account_app_delete(1, 
                                                                                                AppDocument.querySelector('#common_profile_id').innerHTML, 
                                                                                                Number(element_row(event.target).getAttribute('data-app_id')), 
                                                                                                null);
                                                                    });
                                    }
                            }
                            break;
                        }
                        //broadcast
                        case 'common_broadcast_close':{
                            ComponentRemove('common_broadcast');
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
                                map_update({longitude:COMMON_GLOBAL.client_longitude,
                                            latitude:COMMON_GLOBAL.client_latitude,
                                            zoomvalue:COMMON_GLOBAL.module_leaflet_zoom,
                                            text_place:COMMON_GLOBAL.client_place,
                                            country:'',
                                            city:'',
                                            timezone_text :null,
                                            marker_id:COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                            to_method:COMMON_GLOBAL.module_leaflet_jumpto
                                        });
                                const select_country = AppDocument.querySelector('#common_module_leaflet_select_country');
                                select_country.selectedIndex = 0;
                                const select_city = AppDocument.querySelector('#common_module_leaflet_select_city');
                                select_city.selectedIndex = 0;
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
                                const data = {  city: element_row(event.target).getAttribute('data-city') ?? '',
                                                country: element_row(event.target).getAttribute('data-country') ??'',
                                                latitude: element_row(event.target).getAttribute('data-latitude') ?? '',
                                                longitude: element_row(event.target).getAttribute('data-longitude') ?? ''
                                            };
                                if (AppDocument.querySelector('#common_module_leaflet_search_list')['data-function']){
                                    AppDocument.querySelector('#common_module_leaflet_search_list')['data-function'](data);
                                    map_toolbar_reset();
                                }
                                else
                                    map_show_search_on_map(data);
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
                            AppDocument.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                            AppDocument.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                            break;
                        }
                        case 'common_toolbar_framework_js':
                        case 'common_toolbar_framework_vue':
                        case 'common_toolbar_framework_react':{
                            AppDocument.querySelectorAll('#common_toolbar_framework .common_toolbar_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_toolbar_selected'));
                            AppDocument.querySelector(`#${event_target_id}`).classList.add('common_toolbar_selected');
                            break;
                        }    
                        //dialogue lov
                        case event.target.classList.contains('common_list_lov_click') && event.target.getAttribute('data-lov')?event_target_id:'':{
                            lov_event(event, event.target.getAttribute('data-lov'));
                            break;
                        }
                        case 'common_lov_search_icon':{
                            lov_filter(AppDocument.querySelector('#common_lov_search_input').innerHTML);
                            break;
                        }
                        case 'common_lov_close':{
                            lov_close();
                            break;
                        }
                        case 'common_lov_list':{
                            AppDocument.querySelector('#common_lov_list')['data-function'](event);
                            break;
                        }        
                        default:{
                            if (event.target.classList.contains('leaflet-control-zoom-in') || event.target.parentNode.classList.contains('leaflet-control-zoom-in')){
                                COMMON_GLOBAL.module_leaflet_session_map?.setZoom?.(COMMON_GLOBAL.module_leaflet_session_map?.getZoom?.() + 1);
                            }
                            if (event.target.classList.contains('leaflet-control-zoom-out') || event.target.parentNode.classList.contains('leaflet-control-zoom-out')){
                                COMMON_GLOBAL.module_leaflet_session_map?.setZoom?.(COMMON_GLOBAL.module_leaflet_session_map?.getZoom?.() - 1);
                            }
                            break;
                        }
                    }
                }   
                break;
            }
            case 'change':{
                switch (event.target.id){
                    //define globals and save settings here, in apps define what should happen when changing
                    case 'common_dialogue_user_menu_user_locale_select':{
                        COMMON_GLOBAL.user_locale = event.target.value;
                        //change navigator.language, however when logging out default navigator.language will be set
                        //commented at the moment
                        //Object.defineProperties(navigator, {'language': {'value':COMMON_GLOBAL.user_locale, writable: true}});
                        await user_preference_save();
                        AppDocument.querySelector('#common_dialogue_user_menu_user_locale_select').innerHTML = await get_locales_options();
                        AppDocument.querySelector('#common_dialogue_user_menu_user_locale_select').value = COMMON_GLOBAL.user_locale;
                        break;
                    }
                    case 'common_dialogue_user_menu_user_timezone_select':{
                        COMMON_GLOBAL.user_timezone = event.target.value;
                        await user_preference_save().then(()=>{
                            if (AppDocument.querySelector('#common_dialogue_user_edit').innerHTML !='') {
                                ComponentRender('common_dialogue_user_edit', 
                                    {   user_account_id:COMMON_GLOBAL.user_account_id,
                                        common_app_id:COMMON_GLOBAL.common_app_id,
                                        translation_username:COMMON_GLOBAL.translate_items.USERNAME,
                                        translation_bio:COMMON_GLOBAL.translate_items.BIO,
                                        translation_new_email:COMMON_GLOBAL.translate_items.NEW_EMAIL,
                                        translation_password:COMMON_GLOBAL.translate_items.PASSWORD,
                                        translation_password_confirm:COMMON_GLOBAL.translate_items.PASSWORD_CONFIRM,
                                        translation_new_password:COMMON_GLOBAL.translate_items.NEW_PASSWORD,
                                        translation_new_password_confirm:COMMON_GLOBAL.translate_items.NEW_PASSWORD_CONFIRM,
                                        translation_password_reminder:COMMON_GLOBAL.translate_items.PASSWORD_REMINDER,
                                        function_FFB:FFB,
                                        function_set_avatar:set_avatar,
                                        function_show_message:show_message,
                                        function_format_json_date:format_json_date,
                                        },
                                    '/common/component/dialogue_user_edit.js')
                                .then(()=>{
                                    ComponentRemove('common_dialogue_user_menu');
                                });
                            }
                        });
                        break;
                    }
                    case 'common_dialogue_user_menu_user_direction_select':{
                        if(event.target.value=='rtl')
                            AppDocument.body.classList.add('rtl');
                        else
                            AppDocument.body.classList.remove('rtl');
                        COMMON_GLOBAL.user_direction = event.target.value;  
                        await user_preference_save();
                        break;
                    }
                    case 'common_dialogue_user_menu_user_arabic_script_select':{
                        COMMON_GLOBAL.user_arabic_script = event.target.value;
                        await user_preference_save();
                        break;
                    }
                    //module leaflet events
                    case 'common_module_leaflet_select_country':{
                        if (event.target.options[event.target.selectedIndex].getAttribute('country_code'))
                            map_city(event.target.options[event.target.selectedIndex].getAttribute('country_code'));
                        else{
                            map_toolbar_reset();
                        }
                        break;
                    }
                    case 'common_module_leaflet_select_city':{
                        const longitude_selected = event.target.options[event.target.selectedIndex].getAttribute('longitude') ??'';
                        const latitude_selected = event.target.options[event.target.selectedIndex].getAttribute('latitude') ??'';
                        await map_update({  longitude:longitude_selected,
                                            latitude:latitude_selected,
                                            zoomvalue:COMMON_GLOBAL.module_leaflet_zoom_city,
                                            text_place:event.target.options[event.target.selectedIndex].text,
                                            country:'',
                                            city:'',
                                            timezone_text :null,
                                            marker_id:COMMON_GLOBAL.module_leaflet_marker_div_city,
                                            to_method:COMMON_GLOBAL.module_leaflet_flyto
                                        }).then(()=> {
                            map_toolbar_reset();
                        });
                        break;
                    }
                    case 'common_module_leaflet_select_mapstyle':{
                        map_setstyle(event.target.value);
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
                            if (event.target.innerText.indexOf('\n')>-1)
                                event.target.innerText = event.target.innerText.replace('\n','');
                            list_key_event(event, 'lov');
                            break;
                        }
                        //module leaflet
                        case 'common_module_leaflet_search_input':{
                            typewatch(list_key_event, event, 'module_leaflet', event.target['data-function']); 
                            break;
                        }
                        default:{
                            break;
                        }
                    }
                break;
            }
            case 'keydown':{
                if (event.code=='Enter')
                    event.preventDefault();
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
 * Disable copy cut paste
 * @param {import('../../../types.js').AppEvent} event 
 */
 const disable_copy_paste_cut = event => {
    if (disable_textediting()){
        if(event.target.nodeName !='SELECT'){
            event.preventDefault();
            event.target.focus();
        }
    }
    else{
        if (event.type=='paste'){
            event.preventDefault();
            event.target.innerText = event.clipboardData.getData('Text');
        }
    }
};
/**
 * Disable common input textediting
 * @param {import('../../../types.js').AppEvent} event 
 */
const disable_common_input = event => {
    if (disable_textediting())
        if (event.target.classList.contains('common_input')){
            event.preventDefault();
            event.target.focus();
        }
};
/**
 * Hide user menu and search
 * @param {import('../../../types.js').AppEvent} event 
 */
 const hide_user_menu_and_search = event => {
    if (event.key === 'Escape') {
        event.preventDefault();
        //hide use menu dropdown
        if (AppDocument.querySelector('#common_dialogue_user_menu').innerHTML !='')
            ComponentRemove('common_dialogue_user_menu', true);
        if (AppDocument.querySelector('#common_profile_input_row')){
            //hide search
            const x = AppDocument.querySelector('#common_profile_input_row'); 
            if (x.style.visibility == 'visible') {
                x.style.visibility = 'hidden';
                AppDocument.querySelector('#common_profile_search_list_wrap').style.display = 'none';
            } 
        }
    }
};
/**
 * Adds common events for all apps
 * @returns {void}
 */
const common_events_add = () => {
    //only works on document level:
    AppDocument.addEventListener('keydown', hide_user_menu_and_search, false);

    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('copy', disable_copy_paste_cut, false);
    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('paste', disable_copy_paste_cut, false);
    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('cut', disable_copy_paste_cut, false);
    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('mousedown', disable_copy_paste_cut, false);
    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('touchstart', disable_common_input, false);

};
/**
 * Remove common events for all apps
 * @returns {void}
 */
const common_events_remove = () => {
    AppDocument.removeEventListener('keydown', hide_user_menu_and_search);

    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('copy', disable_copy_paste_cut);
    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('paste', disable_copy_paste_cut);
    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('cut', disable_copy_paste_cut);
    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('mousedown', disable_copy_paste_cut);
    AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('touchstart', disable_common_input);

};

/**
 * Set app parameters
 * @param {*[]} common_parameters 
 * @returns {void}
 */
const set_app_parameters = (common_parameters) => {
    //set parameters for common_app_id, each app set its own parameters in the app
    for (const parameter of common_parameters.filter(parameter=>parameter.app_id == COMMON_GLOBAL.common_app_id)){
        switch (true){
            case ('INFO_LINK_POLICY_NAME' in parameter)                :{COMMON_GLOBAL.info_link_policy_name = parameter['INFO_LINK_POLICY_NAME'];break;}
            case ('INFO_LINK_DISCLAIMER_NAME' in parameter)            :{COMMON_GLOBAL.info_link_disclaimer_name = parameter['INFO_LINK_DISCLAIMER_NAME'];break;}
            case ('INFO_LINK_TERMS_NAME' in parameter)                 :{COMMON_GLOBAL.info_link_terms_name = parameter['INFO_LINK_TERMS_NAME'];break;}
            case ('INFO_LINK_ABOUT_NAME' in parameter)                 :{COMMON_GLOBAL.info_link_about_name = parameter['INFO_LINK_ABOUT_NAME'];break;}
            case ('INFO_LINK_POLICY_URL' in parameter)                 :{COMMON_GLOBAL.info_link_policy_url = parameter['INFO_LINK_POLICY_URL'];break;}
            case ('INFO_LINK_DISCLAIMER_URL' in parameter)             :{COMMON_GLOBAL.info_link_disclaimer_url = parameter['INFO_LINK_DISCLAIMER_URL'];break;}
            case ('INFO_LINK_TERMS_URL' in parameter)                  :{COMMON_GLOBAL.info_link_terms_url = parameter['INFO_LINK_TERMS_URL'];break;}
            case ('INFO_LINK_ABOUT_URL' in parameter)                  :{COMMON_GLOBAL.info_link_about_url = parameter['INFO_LINK_ABOUT_URL'];break;}
            case ('IMAGE_FILE_ALLOWED_TYPE1' in parameter)             :{COMMON_GLOBAL.image_file_allowed_type1 = parameter['IMAGE_FILE_ALLOWED_TYPE1'];break;}
            case ('IMAGE_FILE_ALLOWED_TYPE2' in parameter)             :{COMMON_GLOBAL.image_file_allowed_type2 = parameter['IMAGE_FILE_ALLOWED_TYPE2'];break;}
            case ('IMAGE_FILE_ALLOWED_TYPE3' in parameter)             :{COMMON_GLOBAL.image_file_allowed_type3 = parameter['IMAGE_FILE_ALLOWED_TYPE3'];break;}
            case ('IMAGE_FILE_ALLOWED_TYPE4' in parameter)             :{COMMON_GLOBAL.image_file_allowed_type4 = parameter['IMAGE_FILE_ALLOWED_TYPE4'];break;}
            case ('IMAGE_FILE_ALLOWED_TYPE5' in parameter)             :{COMMON_GLOBAL.image_file_allowed_type5 = parameter['IMAGE_FILE_ALLOWED_TYPE5'];break;}
            case ('IMAGE_FILE_MIME_TYPE' in parameter)                 :{COMMON_GLOBAL.image_file_mime_type = parameter['IMAGE_FILE_MIME_TYPE'];break;}
            case ('IMAGE_FILE_MAX_SIZE' in parameter)                  :{COMMON_GLOBAL.image_file_max_size = parseInt(parameter['IMAGE_FILE_MAX_SIZE']);break;}
            case ('IMAGE_AVATAR_WIDTH' in parameter)                   :{COMMON_GLOBAL.image_avatar_width = parseInt(parameter['IMAGE_AVATAR_WIDTH']);break;}
            case ('IMAGE_AVATAR_HEIGHT' in parameter)                  :{COMMON_GLOBAL.image_avatar_height = parseInt(parameter['IMAGE_AVATAR_HEIGHT']);break;}
            case ('MODULE_LEAFLET_FLYTO' in parameter)                 :{COMMON_GLOBAL.module_leaflet_flyto = parseInt(parameter['MODULE_LEAFLET_FLYTO']);break;}
            case ('MODULE_LEAFLET_JUMPTO' in parameter)                :{COMMON_GLOBAL.module_leaflet_jumpto = parseInt(parameter['MODULE_LEAFLET_JUMPTO']);break;}
            case ('MODULE_LEAFLET_POPUP_OFFSET' in parameter)          :{COMMON_GLOBAL.module_leaflet_popup_offset = parseInt(parameter['MODULE_LEAFLET_POPUP_OFFSET']);break;}
            case ('MODULE_LEAFLET_STYLE' in parameter)                 :{COMMON_GLOBAL.module_leaflet_style = parameter['MODULE_LEAFLET_STYLE'];break;}
            case ('MODULE_LEAFLET_ZOOM' in parameter)                  :{COMMON_GLOBAL.module_leaflet_zoom = parseInt(parameter['MODULE_LEAFLET_ZOOM']);break;}
            case ('MODULE_LEAFLET_ZOOM_CITY' in parameter)             :{COMMON_GLOBAL.module_leaflet_zoom_city = parseInt(parameter['MODULE_LEAFLET_ZOOM_CITY']);break;}
            case ('MODULE_LEAFLET_ZOOM_PP' in parameter)               :{COMMON_GLOBAL.module_leaflet_zoom_pp = parseInt(parameter['MODULE_LEAFLET_ZOOM_PP']);break;}
            case ('MODULE_LEAFLET_MARKER_DIV_GPS' in parameter)        :{COMMON_GLOBAL.module_leaflet_marker_div_gps = parameter['MODULE_LEAFLET_MARKER_DIV_GPS'];break;}
            case ('MODULE_LEAFLET_MARKER_DIV_CITY' in parameter)       :{COMMON_GLOBAL.module_leaflet_marker_div_city = parameter['MODULE_LEAFLET_MARKER_DIV_CITY'];break;}
            case ('MODULE_LEAFLET_MARKER_DIV_PP' in parameter)         :{COMMON_GLOBAL.module_leaflet_marker_div_pp = parameter['MODULE_LEAFLET_MARKER_DIV_PP'];break;}
        }
    }
};
const framework_clean = () =>{
    //remove Reacts objects
    delete AppWindow.ReactDOM;
    delete AppWindow.React;

    //remove react key
    for (const key of Object.keys(AppDocument)){
        if (key.startsWith('_react')){
            /**@ts-ignore */
            delete AppDocument[key];
        }
    }
    if (COMMON_GLOBAL.app_eventListeners.REACT.length>0){
        for (const listener of COMMON_GLOBAL.app_eventListeners.REACT){
            listener[0].removeEventListener(listener[1], listener[2]);
        }
        COMMON_GLOBAL.app_eventListeners.REACT = [];
    }
    //remove Vue objects
    COMMON_GLOBAL.app_eventListeners.VUE = [];
    delete AppWindow.__VUE_DEVTOOLS_HOOK_REPLAY__;
    delete AppWindow.__VUE_HMR_RUNTIME__;
    delete AppWindow.__VUE__;
    const app_root_element = AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`);
    if (AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}_vue`))
        app_root_element.innerHTML = AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}_vue`).innerHTML;
    app_root_element.removeAttribute('data-v-app');
    delete app_root_element.__vue_app_;
    delete app_root_element.__vue_node;

    //remove all attributes except id
    Object.entries(app_root_element.attributes).forEach((/**@type{*}*/attribute)=>attribute[1].name=='id'?null:app_root_element.removeAttribute(attribute[1].name));
};
/**
 * Sets framework and uses given list of event functions
 * @param {number|null} framework
 * @param {{Click:function|null,
 *          Change:function|null,
 *          KeyDown:function|null,
 *          KeyUp:function|null,
 *          Focus:function|null,
 *          Input:function|null,
 *          Other?:function|null}} events 
 * @returns {Promise.<void>}
 */
const framework_set = async (framework, events) => {
    const app_root_element = AppDocument.querySelector(`#${COMMON_GLOBAL.app_root}`);
    const app_element = AppDocument.querySelector(`#${COMMON_GLOBAL.app_div}`);
    const common_app_element = AppDocument.querySelector('#common_app');

    //get all select and selectedIndex
    /**@type{{id:string,index:number}[]} */
    let select_selectedindex = [];
    AppDocument.querySelectorAll(`#${COMMON_GLOBAL.app_root} select`).forEach((/**@type{HTMLSelectElement}*/select) =>{
        if (select_selectedindex.length>0)
            select_selectedindex.push({id:select.id, index:select.selectedIndex});
        else
            select_selectedindex = [{id:select.id, index:select.selectedIndex}];
    });
    //get all ellements with data-function
    /**@type{{id:string,element_function:function}[]} */
    const data_function = [];
    AppDocument.querySelectorAll(`#${COMMON_GLOBAL.app_root} div`).forEach((/**@type{HTMLElement}*/element) =>{
        /**@ts-ignore */
        if (element['data-function']){
            /**@ts-ignore */
            data_function.push({id:element.id, element_function:element['data-function']});
        }
    });
    //save Leaflet containers with special event management and saved objects on elements if any Leaflet container used
    const leaflet_containers = AppDocument.querySelectorAll('.leaflet-container');

    //remove common listeners
    common_events_remove();
    COMMON_GLOBAL.app_eventListeners.OTHER = [];

    //remove all listeners in app and app root divs including all objects saved on elements
    app_element.replaceWith(app_element.cloneNode(true));
    app_root_element.replaceWith(app_root_element.cloneNode(true));
    
    framework_clean();

    //set default function if anyone missing
    events.Change?null:events.Change = ((/**@type{import('../../../types.js').AppEvent}*/event)=>common_event('change', event));
    events.Click?null:events.Click = ((/**@type{import('../../../types.js').AppEvent}*/event)=>common_event('click', event));
    events.Focus?null:events.Focus = ((/**@type{import('../../../types.js').AppEvent}*/event)=>common_event('focus', event));
    events.Input?null:events.Input = ((/**@type{import('../../../types.js').AppEvent}*/event)=>common_event('input', event));
    events.KeyDown?null:events.KeyDown = ((/**@type{import('../../../types.js').AppEvent}*/event)=>common_event('keydown', event));
    events.KeyUp?null:events.KeyUp = ((/**@type{import('../../../types.js').AppEvent}*/event)=>common_event('keyup', event));

    events.Other?null:null;

    //app can override framework or use default javascript if Vue or React is not set
    if (framework ?? COMMON_GLOBAL.app_framework !=COMMON_GLOBAL.app_framework)
        COMMON_GLOBAL.app_framework = framework;
    switch (framework ?? COMMON_GLOBAL.app_framework){
        case 2:{
            //Vue
            const path_vue = 'Vue';
            /**@type {import('../../../types.js').module_vue} */
            const Vue = await import(path_vue);
            Vue.createApp({
                data() {
                        return {};
                        },
                        template: `<div id='${COMMON_GLOBAL.app_root}_vue'
                                        @change ='AppEventChange($event)'
                                        @click  ='AppEventClick($event)'
                                        @input  ='AppEventInput($event)' 
                                        @focus  ='AppEventFocus($event)' 
                                        @keydown='AppEventKeyDown($event)' 
                                        @keyup  ='AppEventKeyUp($event)'>
                                        ${app_element.outerHTML}
                                        ${common_app_element.outerHTML}
                                    </div>`,
                        methods:{
                            AppEventChange: (/**@type{import('../../../types.js').AppEvent}*/event) => {
                                events.Change?events.Change(event):null;
                            },
                            AppEventClick: (/**@type{import('../../../types.js').AppEvent}*/event) => {
                                events.Click?events.Click(event):null;
                            },
                            AppEventInput: (/**@type{import('../../../types.js').AppEvent}*/event) => {
                                events.Input?events.Input(event):null;
                            },
                            AppEventFocus: (/**@type{import('../../../types.js').AppEvent}*/event) => {
                                events.Focus?(event):events.Focus;
                            },
                            AppEventKeyDown: (/**@type{import('../../../types.js').AppEvent}*/event) => {
                                events.KeyDown?events.KeyDown(event):null;
                            },
                            AppEventKeyUp: (/**@type{import('../../../types.js').AppEvent}*/event) => {
                                events.KeyUp?events.KeyUp(event):null;
                            }
                        }
                    }).mount(`#${COMMON_GLOBAL.app_root}`);
            break;
        }
        case 3:{
            //React
            const path_react = 'React';
            /**@type {import('../../../types.js').module_react} */
            const React = await import(path_react).then(module=>module.React);
            const path_reactDOM = 'ReactDOM';
            /**@type {import('../../../types.js').module_reactDOM} */
            const ReactDOM = await import(path_reactDOM).then(module=>module.ReactDOM);

            const App = () => {
                //JSX syntax
                //return (<div id='mapid' onClick={(e) => {app.map_click_event(event)}}></div>);
                //Using pure Javascript
                //convert HTML template to React component
                const div_template = AppDocument.createElement('div');
                div_template.id = COMMON_GLOBAL.app_root;
                div_template.innerHTML = `  ${app_element.outerHTML}
                                            ${common_app_element.outerHTML}`;
                return React.createElement( div_template.nodeName.toLowerCase(), 
                                            { id: div_template.id, className: div_template.className}, 
                                            html2reactcomponent(React.createElement, div_template.children));
            };
            const app_old = app_root_element.innerHTML;
            const application = ReactDOM.createRoot(app_root_element);
            //JSX syntax
            //application.render( <App/>);
            //Using pure Javascript
            application.render( App());
            //set delay so some browsers render ok.
            await new Promise ((resolve)=>{setTimeout(()=> resolve(null), 200);});
            app_root_element.innerHTML = app_old;
            events.Click();
            events.Change();
            events.Focus();
            events.Input();
            events.KeyDown();
            events.KeyUp();
            
            break;
        }
        case 1:
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
    //set other events not use in common
    if (events.Other)
        events.Other();

    //replace Leaflet containers with the saved ones containing Leaflet objects and events if any Leaflet container used
    let index= 0;
    for (const leaflet_container of leaflet_containers){
        AppDocument.querySelectorAll('.leaflet-container')[index].replaceWith(leaflet_container);
        index++;
    }
    //update all select with selectedIndex since copying outerHTML does not include setting correct selectedIndex
    select_selectedindex.forEach(select =>AppDocument.querySelector(`#${select.id}`).selectedIndex = select.index);
    //update all elements with data-function since copying outerHTML does not include data-function
    data_function.forEach(element =>AppDocument.querySelector(`#${element.id}`)['data-function'] = element.element_function);
    //add common events for all apps
    common_events_add();
};
/**
 * Set useragent attributes
 * @returns {void}
 */
 const setUserAgentAttibutes = () => {
    if (navigator.userAgent.toLowerCase().indexOf('firefox')>-1)
        AppDocument.querySelector(':root').style.setProperty('--common_app_useragent_fix_margin_top', '-5px');
 };
/**
 * Set custom framework functionality overriding console messages and save info about events created
 * @returns {void}
 */
const custom_framework = () => {
    COMMON_GLOBAL.app_eventListeners.original = AppDocument.addEventListener;
    /**
     * 
     * @param {*} stack 
     * @returns {'LEAFLET'|'REACT'|'VUE'|'OTHER'}
     */
    const module = (stack) => {
        if (stack.toLowerCase().indexOf('leaflet')>-1)
            return 'LEAFLET';
        else {
            if (stack.toLowerCase().indexOf('react')>-1)
                return 'REACT';
            else {
                if (stack.toLowerCase().indexOf('vue')>-1)
                    return 'VUE';
                else
                    return 'OTHER';
            }
        }
    };
    /**
     * 
     * @param  {...any} eventParameters 
     * @returns 
     */
    function custom_event (...eventParameters) {   
        COMMON_GLOBAL.app_eventListeners[module(Error().stack)]
            /**@ts-ignore */
            .push([this, eventParameters[0], eventParameters[1], eventParameters[2]]);
        return COMMON_GLOBAL.app_eventListeners.original.apply(
                /**@ts-ignore */
                this, 
                arguments);
    }

    //set custom event on both HTMLElement and document level
    AppDocument.addEventListener = custom_event;
    AppWindow.addEventListener = custom_event;
    HTMLElement.prototype.addEventListener = custom_event;

    /**
     * console warn
     * @param  {...any} parameters 
     */
    const console_warn = (...parameters) => COMMON_GLOBAL.app_framework_messages == 1?COMMON_GLOBAL.app_console.warn(...parameters):null;
    /**
     * console error
     * @param  {...any} parameters 
     */
     const console_error = (...parameters) => COMMON_GLOBAL.app_framework_messages == 1?COMMON_GLOBAL.app_console.error(...parameters):null;
    /**
     * console info
     * @param  {...any} parameters 
     */
     const console_info = (...parameters) => COMMON_GLOBAL.app_framework_messages == 1?COMMON_GLOBAL.app_console.info(...parameters):null;

    //Vue uses console.warn, show or hide from any framework 
    AppWindow.console.warn = console_warn;
    //React uses console.info and error, show or hide from any framework
    AppWindow.console.info = console_info;
    AppWindow.console.error = console_error;
};
/**
 * Init common
 * @param {string} parameters 
 * @returns {Promise.<{ app:{}[],
 *                      app_service:{system_admin_only:number, first_time:number}}>}
 */
const init_common = async (parameters) => {
    /**
     * Encoded parameters
     * @type {{ app:{}[],
     *          app_service:{system_admin_only:number, first_time:number}}}
     */
    const decoded_parameters = JSON.parse(fromBase64(parameters));
    setUserAgentAttibutes();
    custom_framework();
    await ComponentRender('common_app', 
                            {
                            font_default:   true,
                            font_arabic:    true,
                            font_asian:     true,
                            font_prio1:     true,
                            font_prio2:     true,
                            font_prio3:     true
                            },
                            '/common/component/app.js');
    return new Promise((resolve) =>{
        if (COMMON_GLOBAL.app_id ==null)
            set_app_service_parameters(decoded_parameters.app_service);
        if (COMMON_GLOBAL.app_framework==0){
            AppDocument.querySelector('#common_toolbar_framework').classList.add('show');
            AppDocument.querySelector('#common_toolbar_framework_js').classList.add('common_toolbar_selected');
        }
            
        connectOnline();
        if (COMMON_GLOBAL.app_id == COMMON_GLOBAL.common_app_id && COMMON_GLOBAL.system_admin_only==1){
            resolve(decoded_parameters);
        }
        else{
            set_app_parameters(decoded_parameters.app);
            common_events_add();
            resolve(decoded_parameters);
        }
    });
};
export{/* GLOBALS*/
       COMMON_GLOBAL, ICONS,
       /* MISC */
       element_id, element_row, element_list_title, getTimezoneOffset, getTimezoneDate, getGregorian, typewatch, toBase64, fromBase64, 
       common_translate_ui, get_locales_options, 
       mobile, image_format,
       list_image_format_src, recreate_img, convert_image, set_avatar,
       show_image, getHostname, input_control, getUserAgentPlatform, SearchAndSetSelectedIndex,
       common_theme_update_from_body,common_preferences_post_mount,
       common_preferences_update_body_class_from_preferences,
       /* COMPONENTS */
       ComponentRender,ComponentRemove,
       /* MESSAGE & DIALOGUE */
       show_common_dialogue, show_message,
       lov_event, lov_action,
       lov_close, lov_show,
       /* PROFILE */
       profile_follow_like, profile_stat, profile_detail, profile_show,
       profile_update_stat, list_key_event,
       /* USER  */
       user_login, user_session_countdown, user_logoff, user_update, user_signup, user_verify_check_input, user_delete, user_function,
       updatePassword,
       /* MODULE LEAFLET  */
       map_init, map_country, map_show_search_on_map, map_resize, map_line_removeall, map_line_create,
       map_setstyle, map_update,
       /* MODULE EASY.QRCODE */
       create_qr,
       /*FFB */
       FFB,
       /* SERVICE BROADCAST */
       show_broadcast, show_maintenance, connectOnline,
       /* SERVICE GEOLOCATION */
       get_place_from_gps, get_gps_from_ip,
       /* SERVICE WORLDCITIES */
       get_cities,
       /* INIT */
       common_event,
       framework_set,
       init_common};