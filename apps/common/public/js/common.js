/**
 * @module apps/common/common
 */

/**@type{import('../../../common_types.js').COMMON_WINDOW} */
const COMMON_WINDOW = window;

/**@type{import('../../../common_types.js').COMMON_DOCUMENT} */
const COMMON_DOCUMENT = document;

/**@type{import('../../../common_types.js').CommonGlobal} */
const COMMON_GLOBAL = {
    common_app_id:0,
    admin_app_id:1,
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
    app_console:{warn:COMMON_WINDOW.console.warn, info:COMMON_WINDOW.console.info, error:COMMON_WINDOW.console.error},
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
    iam_user_id:null,
    iam_user_name:null,
    admin_first_time:null,
    admin_only:null,
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
    moduleLeaflet:{methods:{eventClickCountry:          ()=>null, 
                            eventClickCity:             ()=>null,
                            eventClickMapLayer:         ()=>null,
                            eventClickControlZoomIn:    ()=>null,
                            eventClickControlZoomOut:    ()=>null,
                            eventClickControlSearch:    ()=>null,
                            eventClickControlFullscreen:()=>null,
                            eventClickControlLocation:  ()=>null,
                            eventClickControlLayer:     ()=>null,
                            eventClickSearchList:       ()=>null,
                            eventKeyUpSearch:           ()=>null,
                            map_toolbar_reset:          ()=>null,
                            map_line_removeall:         ()=>null,
                            map_line_create:            ()=>null,
                            map_update:                 ()=>null
                        }
                    }
};
Object.seal(COMMON_GLOBAL);

/**@type{import('../../../common_types.js').CommonIcons} */
const COMMON_ICONS = {
    app_maintenance:          '⚒',
    app_alert:                '🚨',
    infinite:                 '∞',
};
Object.seal(COMMON_ICONS);

/**
 * @name commonMiscDbAppSettingsGet
 * @description Get db app settings
 * @function
 * @returns {Promise<{  id:number,
 *                      app_id:number,
 *                      value:string,
 *                      text:string,
 *                      app_setting_type_name:string,
 *                      data2:string,
 *                      data3:string,
 *                      data4:string,
 *                      data5:string}[]>}
 */
const commonMiscDbAppSettingsGet = async () =>await commonFFB({path:'/server-db/app_settings', method:'GET', authorization_type:'APP_ID'}).then((/**@type{string}*/result)=>JSON.parse(result).rows);
/**
 * @name commonMiscElementId
 * @description Finds recursive parent id. Use when current element can be an image or svg attached to an event element
 * @function
 * @param {*} element 
 * @returns {string} 
 */
const commonMiscElementId = element => element.id==''?commonMiscElementId(element.parentNode):element.id;
/**
 * @name commonMiscElementRow
 * @description Finds recursive parent row with given class or default common_row. Use when clicking in a list of records
 * @function
 * @param {*} element 
 * @param {string|null} [className]
 * @returns {HTMLElement} 
 */
const commonMiscElementRow = (element, className) => element?.classList?.contains(className ?? 'common_row')?element:commonMiscElementRow(element.parentNode, className);
/**
 * @name commonMiscElementListTitle
 * @description Returns current target or parent with class list_title or returns empty. Use when clicking in a list title
 * @function
 * @param {*} element 
 * @returns {HTMLElement} 
 */
const commonMiscElementListTitle = element => element.classList.contains('list_title')?element:(element.parentNode.classList.contains('list_title')?element.parentNode:null);
/**
 * @name commonMiscFormatJsonDate
 * @description Format JSON date with user timezone
 * @function
 * @param {string} db_date 
 * @param {boolean|null} short 
 * @returns {string|null}
 */
const commonMiscFormatJsonDate = (db_date, short) => {
    if (db_date == null)
        return null;
    else {
        //Json returns UTC time
        //in ISO 8601 format
        //JSON returns format 2020-08-08T05:15:28Z
        //"yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        /**@type{import('../../../common_types.js').COMMON_WINDOW['Intl']['DateTimeFormatOptions']} */ 
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
 * @name commonMiscImageConvert
 * @description Converts image
 * @function
 * @param {string} image_url 
 * @param {number} image_width 
 * @param {number} image_height 
 * @returns {Promise.<string>}
 */
const commonMiscImageConvert = async (image_url, image_width, image_height) => {
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
                const elem = COMMON_DOCUMENT.createElement('canvas');
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
 * @name commonMiscImageShow
 * @description Show image
 * @function
 * @param {HTMLImageElement} item_img 
 * @param {string|null} item_input 
 * @param {number} image_width 
 * @param {number} image_height 
 * @returns {Promise.<null>}
 */
const commonMiscImageShow = async (item_img, item_input, image_width, image_height) => {
    return new Promise((resolve)=>{
        const file = COMMON_DOCUMENT.querySelector('#' + item_input).files[0];
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
            commonMessageShow('INFO', null, null, null,commonMesssageNotAuthorized(), COMMON_GLOBAL.common_app_id);
            resolve(null);
        }
        else
            if (fileSize > COMMON_GLOBAL.image_file_max_size){
                //File size too large
                commonMessageShow('INFO', null, null, null,commonMesssageNotAuthorized(), COMMON_GLOBAL.common_app_id);
                resolve(null);
            }
            else {
                reader.onloadend = /**@type{import('../../../common_types.js').CommonAppEvent}*/event => {
                    if (event.target)
                        commonMiscImageConvert(event.target.result?event.target.result.toString():'', image_width, image_height).then((srcEncoded)=>{
                            item_img.style.backgroundImage= srcEncoded?`url('${srcEncoded}')`:'url()';
                            item_img.setAttribute('data-image', srcEncoded);
                            resolve(null);
                        });
                };
            }
        if (file)
            reader.readAsDataURL(file); //reads the data as a URL
        else{
            item_img.style.backgroundImage= 'url()';
            item_img.setAttribute('data-image', '');
        }
            
    });
    
};
/**
 * @name commonMiscInputControl
 * @description Controls input
 * @function
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
const commonMiscInputControl = (dialogue, validate_items) =>{
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
            div = COMMON_DOCUMENT.createElement('div');
            div.textContent = validate;
        }
        if (div.textContent.indexOf(':') > -1 || div.textContent.includes('"') || div.textContent.includes('\\') )
            return false;
        else
            try {
                JSON.parse(JSON.stringify(div.textContent));
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
        dialogue.querySelectorAll('.common_input_error')
            .forEach(element=>element.classList.remove('common_input_error'));

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
    if (validate_items.username && validate_items.username.textContent && validate_items.username.textContent.length > 100){
        set_error(validate_items.username);
    }
    if (validate_items.password && validate_items.password.textContent.length > 100){
        set_error(validate_items.password);
    }
    if (validate_items.password_reminder && validate_items.password_reminder.textContent && validate_items.password_reminder.textContent.length > 100){
        set_error(validate_items.password_reminder);
    }
    if (validate_items.password_new && validate_items.password_new.textContent && validate_items.password_new.textContent.length > 100){
        set_error(validate_items.password_new);
    }
    if (validate_items.bio && validate_items.bio.textContent && validate_items.bio.textContent.length > 150){
        set_error(validate_items.bio);
    }
    if (validate_items.check_valid_list_elements){
        for (const element of validate_items.check_valid_list_elements){
            if (element[0] && element[1] && element[0].textContent && element[0].textContent.length > element[1])
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
    if (validate_items.username && validate_items.username.textContent == '') {
        set_error(validate_items.username);
    }
    if (validate_items.password && validate_items.password.textContent == '') {
        set_error(validate_items.password);
    }
    if (validate_items.email && validate_items.email.textContent == '') {
        set_error(validate_items.email);
    }
    if (validate_items.password && validate_items.password_confirm && validate_items.password_confirm.textContent ==''){
        set_error(validate_items.password_confirm);
    }
    //validate same password
    if (validate_items.password && validate_items.password_confirm && (validate_items.password.textContent != validate_items.password_confirm.textContent)){
        set_error(validate_items.password, validate_items.password_confirm);
    }
    if (validate_items.password_new && validate_items.password_new.textContent && validate_items.password_new.textContent.length > 0 && (validate_items.password_new.textContent != validate_items.password_new_confirm.textContent)){
        set_error(validate_items.password_new, validate_items.password_new_confirm);
    }
    if (result==false){
        commonMessageShow('INFO', null, null, 'message_text','!', COMMON_GLOBAL.common_app_id);
        return false;
    }
    else
        return true;
};
/**
 * @name commonMiscImportmap
 * @description Importmap that return file path for given file
 *              to solve importmap not working for some browsers
 * @function
 * @param {'easy.qrcode'|'leaflet'|'React'|'ReactDOM'|'regional'|'Vue'} file
 * @returns {string}
 */
const commonMiscImportmap = file =>{
    return {
        'easy.qrcode'   : '/common/modules/easy.qrcode/easy.qrcode.js',
        leaflet	        : '/common/modules/leaflet/leaflet-src.esm.js',
        React 		    : '/common/modules/react/react.development.js',
        ReactDOM 	    : '/common/modules/react/react-dom.development.js',
        regional  	    : '/common/modules/regional/regional.js',
        Vue 	        : '/common/modules/vue/vue.esm-browser.js'
    }[file] ??'';
};
/**
 * @name commonMiscListKeyEvent
 * @description List key event
 * @function
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @param {string} module 
 * @param {function|null} event_function 
 * @returns {void}
 */
const commonMiscListKeyEvent = (event, module, event_function=null) => {
    const list_name = module=='lov'?'list_' + 'lov':module + '_search';
    const search_input = module + '_search';
    switch (event.code){
        case 'ArrowLeft':
        case 'ArrowRight':{
            break;
        }
        case 'ArrowUp':
        case 'ArrowDown':{
            const rows = module=='lov'? COMMON_DOCUMENT.querySelectorAll(`.common_${list_name}_row:not(.common_${list_name}_row_hide)`):
                                        COMMON_DOCUMENT.querySelectorAll(`.common_${list_name}_list_row`);
            /**
             * Focus item
             * @param {HTMLElement} element 
             */
            const focus_item = (element) =>{
                element.focus();
                COMMON_DOCUMENT.querySelector(`#common_${search_input}_input`).focus();
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
                const rows = COMMON_DOCUMENT.querySelectorAll(`.common_${list_name}_row`);
                for (const row of rows) {
                    if (row.classList.contains('common_list_row_selected')){
                        //event on row is set in app when calling lov, dispatch it!
                        row.click();
                        row.classList.remove ('common_list_row_selected');
                    }
                }   
            }
            else{
                const rows = COMMON_DOCUMENT.querySelectorAll(`.common_${list_name}_list_row`);
                for (let i = 0; i <= rows.length -1; i++) {
                    if (rows[i].classList.contains('common_list_row_selected')){
                        if (module=='profile'){
                            //dispatch same event as clicked
                            rows[i].querySelectorAll('.common_profile_search_list_username')[0].click();
                        }
                        else{
                            rows[i].querySelectorAll('.common_module_leaflet_search_list_city')[0].click();
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
                //commonMiscTypewatch(commonLovFilter, COMMON_DOCUMENT.querySelector(`#common_${search_input}_input`).textContent); 
                commonLovFilter(COMMON_DOCUMENT.querySelector(`#common_${search_input}_input`).textContent); 
            }
            else
                if (module=='profile')
                    commonMiscTypewatch(commonProfileSearch, event_function==null?null:event_function); 
                else{
                    commonMiscTypewatch(commonMicroserviceWorldcitiesSearch, event_function==null?null:event_function); 
                }
            break;
        }            
    }
};

/**
 * @name commonMiscMobile
 * @description Check if mobile
 * @function
 * @returns {boolean}
 */
const commonMiscMobile = () =>{
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(COMMON_WINDOW.navigator.userAgent));
};
/**
 * @name commonMiscPreferencesUpdateBodyClassFromPreferences
 * @description Common theme update body class from preferences
 * @function
 * @returns {void}
 */
const commonMiscPreferencesUpdateBodyClassFromPreferences = () => {
    const class_app_theme = COMMON_DOCUMENT.body.className.split(' ')[0] ?? '';
    const class_direction = COMMON_GLOBAL.user_direction;
    const class_arabic_script = COMMON_GLOBAL.user_arabic_script;
    COMMON_DOCUMENT.body.className = '';
    COMMON_DOCUMENT.body.classList.add(class_app_theme);
    if (class_direction)
        COMMON_DOCUMENT.body.classList.add(class_direction);
    if (class_arabic_script)
        COMMON_DOCUMENT.body.classList.add(class_arabic_script);
};
/**
 * @name commonMiscPreferencesPostMount
 * @description Common preference post mount
 * @function
 * @returns {void}
 */
const commonMiscPreferencesPostMount = () => {
    commonMiscPreferencesUpdateBodyClassFromPreferences();
    commonMiscThemeUpdateFromBody();
};
/**
 * @name commonMiscRoundOff
 * @description Rounds a number with 2 decimals
 * @function
 * @param {number} num 
 * @returns number
 */
const commonMiscRoundOff = num => {
    const x = Math.pow(10,2);
    return Math.round(num * x) / x;
};
/**
 * @name commonMiscSelectCurrentValueSet
 * @description Sets current value for select div
 *              Get json data for given key and value is found or matches value if not json
 * @function
 * @param {string} div
 * @param {string|number|null} value
 * @param {string|null} json_key
 * @param {string|number|null} json_value
 */
const commonMiscSelectCurrentValueSet = (div, value, json_key=null, json_value=null) =>{
    COMMON_DOCUMENT.querySelector(`#${div} .common_select_dropdown_value`).textContent = Array.from(COMMON_DOCUMENT.querySelectorAll(`#${div} .common_select_option`))
                                                                                            .filter(option=>(json_key?JSON.parse(option.getAttribute('data-value'))[json_key]:
                                                                                                                option.getAttribute('data-value'))==(json_value ?? value))[0].textContent;
    if (json_key)
        Array.from(COMMON_DOCUMENT.querySelectorAll(`#${div} .common_select_option`))
            .filter(option=>JSON.parse(option.getAttribute('data-value'))[json_key])[0].getAttribute('data-value');
    else
        COMMON_DOCUMENT.querySelector(`#${div} .common_select_dropdown_value`).setAttribute('data-value', value);
      
};
/**
 * @name commonMiscThemeDefaultList
 * @description Default app themes 
 * @function
 * @returns {{VALUE:number, TEXT:string}[]}
 */
const commonMiscThemeDefaultList = () =>[{VALUE:1, TEXT:'Light'}, {VALUE:2, TEXT:'Dark'}, {VALUE:3, TEXT:'Caffè Latte'}];
/**
 * @name commonMiscThemeUpdateFromBody
 * @description Common theme get
 * @function
 * @returns {void}
 */
 const commonMiscThemeUpdateFromBody = () => {    
    COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_app_theme .common_select_dropdown_value').textContent = 
        commonMiscThemeDefaultList().filter(theme=>theme.VALUE.toString()==COMMON_DOCUMENT.body.className[9])[0].TEXT;
    COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_app_theme .common_select_dropdown_value').setAttribute('data-value', COMMON_DOCUMENT.body.className[9]);
};
/**
 * @name commonMiscTimezoneDate
 * @description Get timezone date
 * @function
 * @param {string} timezone 
 * @returns {Date}
 */
const commonMiscTimezoneDate = timezone =>{
    const utc = new Date(	Number(new Date().toLocaleString('en', {timeZone: 'UTC', year:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', month:'numeric'}))-1,
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', day:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', hour:'numeric', hour12:false})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', minute:'numeric'})));
    return new Date(utc.setHours(  utc.getHours() + commonMiscTimezoneOffset(timezone)));
};
/**
 * @name commonMiscTypewatch
 * @description Delay API calls when typing to avoid too many calls 
 *              ES6 spread operator, arrow function without function keyword 
 * @function
 * @param {*} function_name 
 * @param  {...any} parameter 
 */
const commonMiscTypewatch = (function_name, ...parameter) =>{
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
    commonWindowSetTimeout(() => {
        function_name(...parameter);
    }, type_delay);
};
/**
 * @name commonMiscShowDateUpdate
 * @description Show date and time on local format in given element
 * @function
 * @param {string} element_id
 * @returns {Promise<void>}
 */
const commonMiscShowDateUpdate = async element_id => {
    
    if (COMMON_DOCUMENT.querySelector(`#${element_id}`)){
        COMMON_DOCUMENT.querySelector(`#${element_id}`).textContent = 
            new Date().toLocaleString(COMMON_GLOBAL.user_locale, {timeZone: COMMON_GLOBAL.user_timezone});
        await commonWindowWait(1000);
        commonMiscShowDateUpdate(element_id);
    }
};
/**
 * @name commonMiscLengthWithoutDiacrites
 * @description Length without diacrites
 * @function
 * @param {string} str 
 * @returns {number}
 */
const commonMiscLengthWithoutDiacrites = (str) =>{
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '').length;
};
/**
 * @name commonMiscTimezoneOffset
 * @description Get timezone offset
 * @function
 * @param {string} local_timezone 
 * @returns {number}
 */
const commonMiscTimezoneOffset = (local_timezone) =>{
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
 * @name commonWindowHostname
 * @description Get hostname with protocol and port
 * @function
 * @returns {string}
 */
const commonWindowHostname = () =>{
    return `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}`;
};
/**
 * @name commonWindowServiceWorker
 * @description Serviceworker
 * @function
 * @returns {void}
 */
const commonWindowServiceWorker = () => {
    if (!COMMON_WINDOW.Promise) {
        COMMON_WINDOW.Promise = Promise;
    }
    if('serviceWorker' in COMMON_WINDOW.navigator) {
        COMMON_WINDOW.navigator.serviceWorker.register('/sw.js', {scope: '/'});
    }
};
/**
 * @name commonWindowUserAgentPlatform
 * @description Get user agent platform
 * @function
 * @param {string} useragent 
 */
const commonWindowUserAgentPlatform = useragent =>{
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
 * @name commonWindowSetTimeout
 * @description Use SetTimout for given function and millseconds
 * @function
 * @param {function}    function_timeout
 * @param {number}      milliseconds
 * @returns {void}
 */
const commonWindowSetTimeout = (function_timeout, milliseconds) => COMMON_WINDOW.setTimeout(function_timeout, milliseconds);

/**
 * @name commonWindowWait
 * @description Waits given amount of milliseconds
 * @function
 * @param {number} milliseconds
 * @returns {Promise<null>}
 */
const commonWindowWait = async milliseconds => new Promise ((resolve)=>{commonWindowSetTimeout(()=> resolve(null),milliseconds);});

/**
 * @name commonWindowToBase64
 * @description Convert string to Base64
 * @function
 * @param {string} str 
 * @returns {string}
 */
const commonWindowToBase64 = str => {
    return COMMON_WINDOW.btoa(unescape(encodeURIComponent(str)));
};	
/**
 * @name commonWindowFromBase64
 * @description Convert base64 to string
 * @function
 * @param {string} str 
 * @returns {string}
 */
const commonWindowFromBase64 = (str) => {
    return decodeURIComponent(escape(COMMON_WINDOW.atob(str)));
};

/**
 * @name commonWindowNavigatorLocale
 * @description Read Navigator language
 * @function
 * @returns {string}
 */
const commonWindowNavigatorLocale = () => COMMON_WINDOW.navigator.language.toLowerCase();

/**
 * @name commonWindowDocumentFrame
 * @description Returns frames document element
 * @function
 * @returns {import('../../../common_types.js').COMMON_DOCUMENT}
 */
const commonWindowDocumentFrame = () => COMMON_WINDOW.frames.document;

/**
 * @name commonWindowLocationPathname
 * @description Returns info about location pathname for given argument number
 * @function
 * @param {number} argumentNumber
 * @returns {string}
 */
const commonWindowLocationPathname = argumentNumber => COMMON_WINDOW.location.pathname.substring(argumentNumber);

/**
 * @name commonWindowLocationReload
 * @description Reloads window
 * @function
 * @returns {void}
 */
const commonWindowLocationReload = () => COMMON_WINDOW.location.reload();

/**
 * @name commonWindowOpen
 * @description Opens an url in a new window
 * @function
 * @param {string} url
 * @returns {void}
 */
const commonWindowOpen = url => COMMON_WINDOW.open(url, '_blank');

/**
 * @name commonWindowPrompt
 * @description Opens an window prompt with given text
 * @function
 * @param {string} text
 * @returns {string}
 */
const commonWindowPrompt = text => COMMON_WINDOW.prompt(text);

/**
 * @name commonFrameworkHtml2ReactComponent
 * @description Convert HTML to React component
 * @function
 * @param {*} React_create_element
 * @param {*} element 
 * @returns {*}
 */
 const commonFrameworkHtml2ReactComponent = (React_create_element, element) =>{
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
                                                commonFrameworkHtml2ReactComponent(React_create_element, subelement.children)):
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
 * @name commonComponentRender
 * @description Renders component
 *              Components use analogic Vue SFC structure
 *              Components are mounted using given framework
 *              Components return:
 *                  data        
 *                  methods
 *                  lifecycle   implemented onMounted, onBeforeMounted, onUnmounted
 *                  template    rendered HTML to mount
 * @function
 * @param {{mountDiv:string|null,
 *          data:{}|null,
 *          methods:{}|null,
 *          path:string}} commonComponentRender
 * @returns {Promise.<{data:*, methods:*}>}
 */
const commonComponentRender = async commonComponentRender => {
    const {default:ComponentCreate} = await import(commonComponentRender.path);
    if (commonComponentRender.mountDiv)
        COMMON_DOCUMENT.querySelector(`#${commonComponentRender.mountDiv}`).innerHTML = '<div class=\'css_spinner\'></div>';

    /**@type{import('../../../common_types.js').CommonComponentResult}*/
    const component = await ComponentCreate({   data:       {...commonComponentRender.data,       ...{commonMountdiv:commonComponentRender.mountDiv}},
                                                methods:    {...commonComponentRender.methods,    ...{COMMON_DOCUMENT:COMMON_DOCUMENT}}})
                                                .catch((/**@type{Error}*/error)=>{
                                                    commonComponentRender.mountDiv?commonComponentRemove(commonComponentRender.mountDiv, true):null;
                                                    commonException(COMMON_GLOBAL.app_function_exception, error);
                                                    return null;
                                                });
    if (component){
        if (component.lifecycle?.onBeforeMounted){
            await component.lifecycle.onBeforeMounted();
        }
        
        //component can be mounted inside a third party component
        //and div and template can be empty in this case    
        if (commonComponentRender.mountDiv && component.template)
            switch (COMMON_GLOBAL.app_framework){
                case 2:{
                    //Vue
                    await commonFrameworkMount(2, component.template, {}, commonComponentRender.mountDiv, true);
                    break;
                }
                case 3:{
                    await commonFrameworkMount(3, component.template, {}, commonComponentRender.mountDiv, true);
                    break;
                }
                case 1:
                default:{
                    //Default Javascript
                    COMMON_DOCUMENT.querySelector(`#${commonComponentRender.mountDiv}`).innerHTML = component.template;
                }
            }
        if (component.lifecycle?.onUnmounted){
            const Unmounted = () =>{
                                    if (!COMMON_DOCUMENT.querySelector(`#${commonComponentRender.mountDiv}`) || 
                                        COMMON_DOCUMENT.querySelector(`#${commonComponentRender.mountDiv}`).textContent==''){
                                            if (component.lifecycle?.onUnmounted){
                                                ComponentHook.disconnect();
                                                component.lifecycle.onUnmounted();
                                            }
                                        }
                                    };
            const ComponentHook = new MutationObserver(Unmounted);
            ComponentHook.observe(COMMON_DOCUMENT.querySelector(`#${commonComponentRender.mountDiv}`).parentNode, {attributes:true, subtree:true});
        }

        //run onMounted function after component is mounted
        if (component.lifecycle?.onMounted){
            await component.lifecycle.onMounted();
        }
    }
    //return data and methods from component to be used in apps
    return {data:component?component.data:null, methods:component?component.methods:null};
};
/**
 * @name commonComponentRemove
 * @description Component remove
 * @function
 * @param {string} div 
 * @param {boolean} remove_modal
 * @returns {void}
 */
const commonComponentRemove = (div, remove_modal=false) => {
    const APPDIV = COMMON_DOCUMENT.querySelector(`#${div}`);
    APPDIV.textContent = '';
    if (div.indexOf('dialogue')>-1){
        APPDIV.classList.remove('common_dialogue_show0');
        APPDIV.classList.remove('common_dialogue_show1');
        APPDIV.classList.remove('common_dialogue_show2');
        APPDIV.classList.remove('common_dialogue_show3');
        if (remove_modal){
            if (COMMON_DOCUMENT.querySelector('#app .common_dialogues_modal'))
                COMMON_DOCUMENT.querySelector('#app .common_dialogues_modal').classList.remove('common_dialogues_modal');
            COMMON_DOCUMENT.querySelector('#common_app #common_dialogues').classList.remove('common_dialogues_modal');
        }
    }
};

/**
 * @name commonDialogueShow
 * @description Show common dialogue
 * @function
 * @param {string} dialogue 
 * @param {string|null} user_verification_type 
 * @param {string|null} title 
 * @param {function|null} click_cancel_event 
 * @returns {Promise.<void>}
 */
const commonDialogueShow = async (dialogue, user_verification_type=null, title=null, click_cancel_event=null) => {
    switch (dialogue) {
        case 'PASSWORD_NEW':
            {    
                commonComponentRender({
                    mountDiv:   'common_dialogue_iam_password_new',
                    data:       {
                                auth:title
                                },
                    methods:    null,
                    path:'/common/component/common_dialogue_iam_password_new.js'});
                break;
            }
        case 'VERIFY':
            {    
                commonComponentRender({
                    mountDiv:   'common_dialogue_iam_verify',
                    data:       {
                                user_verification_type:user_verification_type,
                                username_login:COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_username')?.textContent,
                                password_login:COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_password')?.textContent,
                                username_signup:COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_username')?.textContent,
                                password_signup:COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password')?.textContent,
                                title: title
                                },
                    methods:    {data_function:click_cancel_event},
                    path:       '/common/component/common_dialogue_iam_verify.js'});
                commonComponentRemove('common_dialogue_iam_start');
                break;
            }
        case 'LOGIN_ADMIN':{
            await commonComponentRender({
                mountDiv:       'common_dialogue_iam_start',
                data:           {
                                type:               null,
                                app_id:             COMMON_GLOBAL.app_id,
                                admin_app_id:       COMMON_GLOBAL.admin_app_id,
                                admin_only: 		COMMON_GLOBAL.admin_only,
                                admin_first_time:   COMMON_GLOBAL.admin_first_time
                                },
                methods:        {commonFFB:commonFFB},
                path:           '/common/component/common_dialogue_iam_start.js'});
            break;
        }
        case 'LOGIN':
        case 'SIGNUP':
        case 'FORGOT':{
            await commonComponentRender({
                mountDiv:       'common_dialogue_iam_start',
                data:           {
                                type:               dialogue,
                                app_id:             COMMON_GLOBAL.app_id,
                                admin_app_id:       COMMON_GLOBAL.admin_app_id,
                                admin_only: 		COMMON_GLOBAL.admin_only,
                                admin_first_time:   COMMON_GLOBAL.admin_first_time
                                },
                methods:        {commonFFB:commonFFB},
                path:           '/common/component/common_dialogue_iam_start.js'});
            break;
        }
    }
};
/**
 * @name commonMessageShow
 * @description Show message dialogue
 * @function
 * @param {'ERROR'|'ERROR_BFF'|'INFO'|'EXCEPTION'|'CONFIRM'|'LOG'|'PROGRESS'} message_type 
 * @param {string|null} code
 * @param {function|null} function_event 
 * @param {string|null} text_class
 * @param {*} message 
 * @param {number|null} data_app_id 
 * @returns {Promise.<void>}
 */
const commonMessageShow = async (message_type, code, function_event, text_class=null, message=null, data_app_id=null) => {
    commonComponentRender({
        mountDiv:       'common_dialogue_message',
        data:           {
                        message_type:message_type,
                        data_app_id:data_app_id,
                        code:code,
                        text_class:text_class,
                        message:message
                        },
        methods:        {
                        commonComponentRemove:commonComponentRemove,
                       commonFFB:commonFFB, 
                        function_event:function_event
                        },
        path:           '/common/component/common_dialogue_message.js'});
};
/**
 * @name commonMesssageNotAuthorized
 * @description Returns not authorized message
 * @function
 * @returns {string}
 */
const commonMesssageNotAuthorized = () => '⛔';
/**
 * @name commonDialoguePasswordNewClear
 * @description Dialogue password new clear
 * @function
 * @returns {void}
 */
const commonDialoguePasswordNewClear = () => {
    commonComponentRemove('common_dialogue_iam_password_new');
    COMMON_GLOBAL.user_account_id = null;
    COMMON_GLOBAL.token_at = '';
};
/**
 * @name commonLovEvent
 * @description LOV event
 * @function
 * @param {import('../../../common_types.js').CommonAppEvent} event
 * @param {string} lov
 * @returns {void}
 */
const commonLovEvent = (event, lov) => {
    /**
     * LOV event function
     * calling row event decides to have common_input_lov and common_input_value
     * admin row should show technical details
     *  common_input_lov   = data-id
     *  common_input_value = data-value
     * app data row for users should not show technical details
     *  common_input_value = data-value
     * @param {import('../../../common_types.js').CommonAppEvent} event_lov 
     */
    const commonLovEvent_function = event_lov => {
        //setting values from LOV
        const row = commonMiscElementRow(event.target);
        const row_lov = commonMiscElementRow(event_lov.target);
        /**@type{HTMLElement|null} */
        const common_input_lov = row.querySelector('.common_input_lov');
        /**@type{HTMLElement|null} */
        const common_lov_value = row.querySelector('.common_lov_value');
        if (common_input_lov){
            common_input_lov.textContent = row_lov.getAttribute('data-id') ?? '';
            common_input_lov.focus();
        }
        if (common_lov_value){
            /**@ts-ignore */
            if (common_lov_value.parentNode?.classList.contains('common_app_data_display_master_row')){
                common_lov_value.setAttribute('data-lov_value', row_lov.getAttribute('data-id') ?? '');
            }
            common_lov_value.textContent = row_lov.getAttribute('data-value') ?? '';
        }
        //dispatch event for either common_input lov if used or common_lov_value
        (common_input_lov ?? common_lov_value)?.dispatchEvent(new Event('input'));
        COMMON_DOCUMENT.querySelector('#common_lov_close').click();
    };
    commonLovShow({lov:lov, function_event:commonLovEvent_function});
};
/**
 * @name commonLovAction
 * @description Lov action fetches id and value, updates values and manages data-defaultValue
 * @function
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @param {string} lov 
 * @param {string|null} old_value
 * @param {string} path 
 * @param {string} query 
 * @param {import('../../../common_types.js').CommonRESTAPIMethod} method 
 * @param {import('../../../common_types.js').CommonRESTAPIAuthorizationType} authorization_type 
 * @param {{}|null} json_data 
 * @returns {void}
 */
const commonLovAction = (event, lov, old_value, path, query, method, authorization_type, json_data) => {
   commonFFB({path:path, query:query, method:method, authorization_type:authorization_type, body:json_data})
    .then((/**@type{string}*/result)=>{
        const list_result = result?JSON.parse(result).rows:{};
        if (list_result.length == 1){
            //set lov text
            if (event.target.parentNode && event.target.parentNode.nextElementSibling)
                event.target.parentNode.nextElementSibling.querySelector('.common_lov_value').textContent = Object.values(list_result[0])[2];
            //set new value in data-defaultValue used to save old value when editing next time
            event.target.setAttribute('data-defaultValue', Object.values(list_result[0])[0]);
        }
        else{
            event.stopPropagation();
            event.preventDefault();
            //set old value
            event.target.textContent = event.target.getAttribute('data-defaultValue') ?? '';
            event.target.focus();    
            //dispatch click on lov button
            event.target.nextElementSibling.dispatchEvent(new Event('click'));
        }
    })
    .catch(()=>{
        event.stopPropagation();
        event.preventDefault();
        //set old value
        event.target.textContent = event.target.getAttribute('data-defaultValue') ?? '';
        event.target.focus();
        event.target.nextElementSibling?event.target.nextElementSibling.dispatchEvent(new Event('click')):null;
    });
};

/**
 * @name commonLovClose
 * @description Lov close
 * @function
 * @returns {void}
 */
const commonLovClose = () => {
    commonComponentRemove('common_dialogue_lov', true);
};
/**
 * @name commonLovShow
 * @description Lov show
 * @function
 * @param {{lov:string, 
 *          lov_custom_list?:{}[],
 *          lov_custom_value?:string, 
 *          function_event:function|null}} parameters
 * @returns {void} 
 */
const commonLovShow = parameters => {
    commonComponentRender({
        mountDiv:   'common_dialogue_lov',
        data:       {
                    common_app_id:COMMON_GLOBAL.common_app_id,  
                    user_locale:COMMON_GLOBAL.user_locale,
                    lov:parameters.lov,
                    lov_custom_list:parameters.lov_custom_list,
                    lov_custom_value:parameters.lov_custom_value
                    },
        methods:    {
                   commonFFB:commonFFB, 
                    function_event:parameters.function_event
                    },
        path:       '/common/component/common_dialogue_lov.js'});        
};
/**
 * @name commonLovFilter
 * @description Lov filter
 * @function
 * @param {string} text_filter 
 * @returns {void}
 */
const commonLovFilter = text_filter => {
    const rows = COMMON_DOCUMENT.querySelectorAll('.common_list_lov_row');
    for (const row of rows) {
        row.classList.remove ('common_list_lov_row_hide');
        row.classList.remove ('common_list_row_selected');
    }
    for (const row of rows) {
        if (row.children[0].children[0].textContent.toUpperCase().indexOf(text_filter.toUpperCase()) > -1 ||
            row.children[1].children[0].textContent.toUpperCase().indexOf(text_filter.toUpperCase()) > -1){
                row.classList.remove ('common_list_lov_row_hide');
            }
        else{
            row.classList.remove ('common_list_lov_row_hide');
            row.classList.add ('common_list_lov_row_hide');
        }
    }
};

/**
 * @name commonZoomInfo
 * @description Window zoom info
 * @function
 * @param {number|null} zoomvalue 
 * @returns {void}
 */
const commonZoomInfo = (zoomvalue = null) => {
    let old;
    let old_scale;
    const div = COMMON_DOCUMENT.querySelector('#common_window_info_info_img');
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
 * @name commonMoveInfo
 * @description Window move info
 * @function
 * @param {number|null} move1 
 * @param {number|null} move2 
 * @returns {void}
 */
const commonMoveInfo = (move1=null, move2=null) => {
    let old;
    const div = COMMON_DOCUMENT.querySelector('#common_window_info_info_img');
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
 * @name commonWindoInfoToolbarShowHide
 * @description Show or hide window info toolbar
 * @function
 * @returns {void}
 */
const commonWindoInfoToolbarShowHide = () => {
    if (COMMON_DOCUMENT.querySelector('#common_window_info_toolbar').style.display=='inline-block' ||
        COMMON_DOCUMENT.querySelector('#common_window_info_toolbar').style.display=='')
        COMMON_DOCUMENT.querySelector('#common_window_info_toolbar').style.display='none';
    else
        COMMON_DOCUMENT.querySelector('#common_window_info_toolbar').style.display='inline-block';
};
/**
 * @name commonWindoInfoClose
 * @description Close window info
 * @function
 * @returns {void}
 */
const commonWindoInfoClose = () =>{
    commonComponentRemove('common_window_info');
    COMMON_DOCUMENT.querySelector('#common_window_info').style.visibility = 'hidden'; 
    if (COMMON_DOCUMENT.fullscreenElement)
        COMMON_DOCUMENT.exitFullscreen();
};

/**
 * @name commonProfileFollowLike
 * @description Profile follow or like and then update stat
 * @function
 * @param {'FOLLOW'|'LIKE'} function_name 
 * @returns {Promise.<void>}
 */
const commonProfileFollowLike = async (function_name) => {
    await commonUserFunction(function_name)
    .then(()=>commonProfileUpdateStat())
    .catch(()=>null);
};
/**
 * @name commonProfileStat
 * @description Profile stat
 * @function
 * @param {number} statchoice 
 * @param {string|null} app_rest_url
 * @returns {Promise.<void>}
 */
const commonProfileStat = async (statchoice, app_rest_url = null) => {
    await commonComponentRender({
        mountDiv:   'common_dialogue_profile',
        data:       {   
                    stat_list_app_rest_url:app_rest_url,
                    statchoice:statchoice ?? 1
                    },
        methods:    {
                    commonComponentRender:commonComponentRender,
                   commonFFB:commonFFB
                    },
        path:       '/common/component/common_dialogue_profile.js'});
};
/**
 * @name commonProfileDetail
 * @description Profile detail
 * @function
 * @param {number} detailchoice  
 * @returns {void}
 */
const commonProfileDetail = (detailchoice) => {
    if (detailchoice==0){
        //show only other app specific hide common
        COMMON_DOCUMENT.querySelector('#common_profile_detail_list').textContent = '';
    }
    else{
        commonComponentRender({
            mountDiv:   'common_profile_detail_list',
            data:       {
                        user_account_id:COMMON_GLOBAL.user_account_id,
                        user_account_id_profile:COMMON_DOCUMENT.querySelector('#common_profile_id').textContent,
                        detailchoice:detailchoice
                        },
            methods:    {
                        commonDialogueShow:commonDialogueShow,
                       commonFFB:commonFFB
                        },
            path:       '/common/component/common_dialogue_profile_info_detail.js'});
    }
};
/**
 * @name commonProfileSearch
 * @description Profile search
 * @function
 * @param {function} click_function 
 * @returns {void}
 */
const commonProfileSearch = click_function => {
    commonComponentRender({
        mountDiv:   'common_profile_search_list_wrap',
        data:       {
                    user_account_id:COMMON_GLOBAL.user_account_id
                    },
        methods:    {
                    commonMiscInputControl:commonMiscInputControl,
                    function_click_function:click_function,
                   commonFFB:commonFFB
                    },
        path:       '/common/component/common_profile_search_list.js'})
    .catch(()=>{
        COMMON_DOCUMENT.querySelector('#common_profile_search_list_wrap').style.display = 'none';
        COMMON_DOCUMENT.querySelector('#common_profile_search_list_wrap').textContent = '';
    });
};
/**
 * @name commonProfileShow
 * @description Profile show
 *              commonProfileShow(null, null)       from dropdown menu in apps or choosing logged in users profile
 *              commonProfileShow(userid, null)     from choosing profile in commonProfileStat, profile_detail and commonProfileSearch
 *              commonProfileShow(null, username)   from init startup when user enters url
 * @function
 * @param {number|null} user_account_id_other 
 * @param {string|null} username 
 * @returns {Promise.<void>}
 */
const commonProfileShow = async (user_account_id_other = null, username = null) => {
    await commonComponentRender({
        mountDiv:   'common_dialogue_profile',
        data:       {   
                    stat_list_app_rest_url:null,
                    statchoice:null
                    },
        methods:    {
                    commonWindowSetTimeout:null,
                   commonFFB:null,
                    },
        path:       '/common/component/common_dialogue_profile.js'});
    await commonComponentRender({
        mountDiv:   'common_dialogue_profile_content',
        data:       {   
                    user_account_id:COMMON_GLOBAL.user_account_id,
                    user_account_id_other:user_account_id_other,
                    username:username
                    },
        methods:    {
                    commonWindowSetTimeout:commonWindowSetTimeout,
                   commonFFB:commonFFB,
                    commonModuleEasyQRCODECreate:commonModuleEasyQRCODECreate,
                    commonWindowHostname:commonWindowHostname,
                    commonMiscFormatJsonDate:commonMiscFormatJsonDate,
                    commonDialogueShow:commonDialogueShow,
                    commonSocketConnectOnlineCheck:commonSocketConnectOnlineCheck
                    },
        path:       '/common/component/common_dialogue_profile_info.js'});
};
/**
 * @name commonProfileUpdateStat
 * @description Profile update stat
 * @function
 * @returns {Promise.<{id:number}>}
 */
const commonProfileUpdateStat = async () => {
    return new Promise((resolve, reject) => {
        const profile_id = COMMON_DOCUMENT.querySelector('#common_profile_id');
        //get updated stat for given user
       commonFFB({path:`/server-db/user_account-profile/${profile_id.textContent}`, 
            query:`id=${profile_id.textContent}`, 
            method:'GET', 
            authorization_type:'APP_ID'})
        .then(result=>{
            const user_stat = JSON.parse(result)[0];
            COMMON_DOCUMENT.querySelector('#common_profile_info_view_count').textContent = user_stat.count_views;
            COMMON_DOCUMENT.querySelector('#common_profile_info_following_count').textContent = user_stat.count_following;
            COMMON_DOCUMENT.querySelector('#common_profile_info_followers_count').textContent = user_stat.count_followed;
            COMMON_DOCUMENT.querySelector('#common_profile_info_likes_count').textContent = user_stat.count_likes;
            COMMON_DOCUMENT.querySelector('#common_profile_info_liked_count').textContent = user_stat.count_liked;
            resolve({id : user_stat.id});
        })
        .catch(err=>reject(err));
    });
};

/**
 * @name commonUserLogin
 * @description User login
 * @function
 * @param {boolean|null} admin 
 * @param {string|null} username_verify
 * @param {string|null} password_verify
 * @param {number|null} provider_id 
 * @returns {Promise. <{    avatar: string|null}>}
 */
const commonUserLogin = async (admin=false, username_verify=null, password_verify=null, provider_id=null) => {
    /**@type{import('../../../common_types.js').CommonRESTAPIAuthorizationType}*/
    let authorization_type;
    let path = '';
    let json_data = {};
    let spinner_item = '';
    let current_dialogue = '';
    if (admin) {
        spinner_item = 'common_dialogue_iam_start_login_admin_button';
        current_dialogue = 'common_dialogue_iam_start';
        // ES6 object spread operator for user variables
        json_data = {   username:  encodeURI(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_admin_username').textContent),
                        password:  encodeURI(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_admin_password').textContent)
        };
        path = '/server-iam-login';
        authorization_type = 'IAM_ADMIN';
        if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start'),
                        {
                        username: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_admin_username'),
                        password: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_admin_password'),
                        password_confirm: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_admin_password_confirm')?
                                            COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_admin_password_confirm'):
                                                null
                        })==false)
            throw 'ERROR';
        
    }
    else{
        if (username_verify){
            spinner_item = 'common_dialogue_iam_verify_email_icon';
            current_dialogue = 'common_dialogue_iam_verify';
        }
        else{
            spinner_item = 'common_dialogue_iam_start_login_button';
            current_dialogue = 'common_dialogue_iam_start';
        }
        if (provider_id){
            const provider_data = { identity_provider_id:   provider_id,
                                    profile_id:             provider_id,
                                    profile_first_name:     `PROVIDER_USERNAME${provider_id}`,
                                    profile_last_name:      `PROVIDER LAST_NAME${provider_id}`,
                                    profile_image_url:      '',
                                    profile_email:          `PROVIDER_EMAIL${provider_id}@${location.hostname}`};
            const profile_image = provider_data.profile_image_url==''?null:await commonMiscImageConvert(  provider_data.profile_image_url, 
                                                        COMMON_GLOBAL.image_avatar_width,
                                                        COMMON_GLOBAL.image_avatar_height);
            json_data ={    username:               null,
                            password:               null,
                            active:                 1,
                            identity_provider_id:   provider_data.identity_provider_id,
                            provider_id:            provider_data.profile_id,
                            provider_first_name:    provider_data.profile_first_name,
                            provider_last_name:     provider_data.profile_last_name,
                            provider_image:         profile_image?COMMON_WINDOW.btoa(profile_image):null,
                            provider_image_url:     provider_data.profile_image_url,
                            provider_email:         provider_data.profile_email
                        };
            path = `/server-iam-login/${provider_data.profile_id}`;
            authorization_type = 'IAM_PROVIDER';
        }
        else{
            // ES6 object spread operator for user variables
            json_data = {   username:  encodeURI(username_verify?
                                            COMMON_DOCUMENT.querySelector(`#${username_verify}`).textContent:
                                                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_username').textContent),
                            password:  encodeURI(password_verify?
                                            COMMON_DOCUMENT.querySelector(`#${password_verify}`).textContent:
                                                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_password').textContent)
            };
            path = '/server-iam-login';
            authorization_type = 'IAM_USER';
            if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start'),
                            {
                            username: username_verify?
                                            COMMON_DOCUMENT.querySelector(`#${username_verify}`):
                                                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_username'),
                            password: password_verify?
                                            COMMON_DOCUMENT.querySelector(`#${password_verify}`):
                                                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_password')
                            })==false)
                throw 'ERROR';
            
        }            
    }
    const result_iam = await commonFFB({path:path, method:'POST', authorization_type:authorization_type, body:json_data, spinner_id:spinner_item});
    if (admin){
        COMMON_GLOBAL.iam_user_id = JSON.parse(result_iam).iam_user_id;
        COMMON_GLOBAL.iam_user_name = JSON.parse(result_iam).iam_user_name;
        COMMON_GLOBAL.token_admin_at = JSON.parse(result_iam).token_at;
        COMMON_GLOBAL.token_exp = JSON.parse(result_iam).exp;
        COMMON_GLOBAL.token_iat = JSON.parse(result_iam).iat;
        COMMON_GLOBAL.token_timestamp = JSON.parse(result_iam).tokentimestamp;

        commonComponentRemove(current_dialogue, true);
        
        return {avatar: JSON.parse(result_iam).avatar};
    }
    else{
        COMMON_GLOBAL.iam_user_id = null;
        COMMON_GLOBAL.iam_user_name = null;
        const login_data = provider_id?JSON.parse(result_iam).items[0]:JSON.parse(result_iam).login[0];
        COMMON_GLOBAL.user_account_id = parseInt(login_data.id);
        COMMON_GLOBAL.token_at	= JSON.parse(result_iam).accessToken;
        COMMON_GLOBAL.token_exp = JSON.parse(result_iam).exp;
        COMMON_GLOBAL.token_iat = JSON.parse(result_iam).iat;
        COMMON_GLOBAL.token_timestamp = JSON.parse(result_iam).tokentimestamp;

        COMMON_GLOBAL.user_account_username = login_data.username;
        COMMON_GLOBAL.user_identity_provider_id = provider_id?login_data.identity_provider_id:null;

        //set avatar or empty
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').style.backgroundImage= (provider_id?login_data.provider_image:login_data.avatar ?? null)?
                                                                                                    `url('${provider_id?login_data.provider_image:login_data.avatar ?? null}')`:
                                                                                                    'url()';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_in').style.display = 'inline-block';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_out').style.display = 'none';

        const result = await commonFFB({path:`/server-db/user_account_app/${COMMON_GLOBAL.user_account_id ?? ''}`, method:'GET', authorization_type:'APP_ACCESS', spinner_id:spinner_item});
        const user_account_app = JSON.parse(result)[0];

        //locale
        if (user_account_app.preference_locale==null)
            commonUserPreferencesGlobalSetDefault('LOCALE');
        else
            COMMON_GLOBAL.user_locale = user_account_app.preference_locale;
        //timezone
        if (user_account_app.app_setting_preference_timezone_id==null)
            commonUserPreferencesGlobalSetDefault('TIMEZONE');
        else
            COMMON_GLOBAL.user_timezone = user_account_app.app_setting_preference_timezone_value;

        //direction
        COMMON_GLOBAL.user_direction = user_account_app.app_setting_preference_direction_value;
        //arabic script
        COMMON_GLOBAL.user_arabic_script = user_account_app.app_setting_preference_arabic_script_value;
        //update body class with app theme, direction and arabic script usage classes
        commonMiscPreferencesUpdateBodyClassFromPreferences();
        if (login_data.active==0){
            commonDialogueShow('VERIFY', 'LOGIN', login_data.email, null);
            throw 'ERROR';
        }
        else{
            commonComponentRemove(current_dialogue, true);
            commonComponentRemove('common_dialogue_profile', true);
            return {avatar: provider_id?login_data.provider_image:login_data.avatar};
        }
    }
};
/**
 * @name commonUserSessionCountdown
 * @description Countdown function to monitor token expire time
 *              Uses event listener on element instead of setTimeout since element can removed 
 *              and then event listener will automatically be removed
 * @function
 * @param {HTMLElement} element
 * @param {number} token_exp
 * @param {function|null} app_function
 * @returns {Promise.<void>}
 */
 const commonUserSessionCountdown = async (element, token_exp, app_function=null) => {

    if (element.id)
        element = COMMON_DOCUMENT.querySelector(`#${element.id}`);
    else
        element = COMMON_DOCUMENT.querySelector(`.${element.className.replaceAll(' ','.')}`);
    if (element){
        const time_left = ((token_exp ?? 0) * 1000) - (Date.now());
        if (time_left < 0){
            element.textContent ='';
            element.classList.add('common_user_session_expired');
        }
        else{
            const days = Math.floor(time_left / (1000 * 60 * 60 * 24));
            const hours = Math.floor((time_left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((time_left % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((time_left % (1000 * 60)) / 1000);
            element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            //run app function if any
            app_function?app_function():null;
            //wait 1 second
            await commonWindowWait(1000);            
            commonUserSessionCountdown(element, token_exp, app_function);
        }
    }
};
/**
 * @name commonUserLogout
 * @description User logout
 * @function
 * @param {boolean} activated
 * @returns {Promise.<void>}
 */
const commonUserLogout = async (activated=false) => {
    commonComponentRemove('common_dialogue_user_menu');
    if (activated==false)
        await commonFFB({path:'/server-iam-logout', method:'DELETE', authorization_type:(COMMON_GLOBAL.app_id == COMMON_GLOBAL.admin_app_id)?'ADMIN':'APP_ACCESS'})
                .catch((error)=>{
                    throw error;
                });
    if (COMMON_GLOBAL.app_id != COMMON_GLOBAL.admin_app_id){
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_in').style.display = 'none';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_out').style.display = 'inline-block';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').style.backgroundImage= 'url()';
        commonWindoInfoClose();
        commonComponentRemove('common_dialogue_iam_verify');
        commonComponentRemove('common_dialogue_iam_edit');
        commonDialoguePasswordNewClear();
        commonComponentRemove('common_dialogue_iam_start');
        commonComponentRemove('common_dialogue_profile', true);
    }
    commonUserPreferencesGlobalSetDefault('LOCALE');
    commonUserPreferencesGlobalSetDefault('TIMEZONE');
    commonUserPreferencesGlobalSetDefault('DIRECTION');
    commonUserPreferencesGlobalSetDefault('ARABIC_SCRIPT');
    //update body class with app theme, direction and arabic script usage classes
    commonMiscPreferencesUpdateBodyClassFromPreferences();
    
    COMMON_GLOBAL.token_admin_at = '';
    COMMON_GLOBAL.iam_user_id = null;
    COMMON_GLOBAL.iam_user_name = null;

    COMMON_GLOBAL.token_at ='';
    COMMON_GLOBAL.user_account_id = null;
    COMMON_GLOBAL.user_account_username = null;

    COMMON_GLOBAL.token_exp = null;
    COMMON_GLOBAL.token_iat = null;
    COMMON_GLOBAL.token_timestamp = null;
};

/**
 * @name commonUserUpdate
 * @description User update
 * @function
 * @returns {Promise.<null>}
 */
const commonUserUpdate = async () => {
    return new Promise(resolve=>{
        const username = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_username').textContent;
        const bio = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_bio').textContent;
        const avatar = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar_img').getAttribute('data-image').replace('null','')==''?
                            null:
                                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar_img').getAttribute('data-image').replace('null','');
        const new_email = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_new_email').textContent;
    
        let path;
        let json_data;
        /**@type{import('../../../common_types.js').CommonRESTAPIAuthorizationType}*/
        let authorization_type = 'APP_ACCESS';
        if (COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_local').style.display == 'block') {
            if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit'),
                            {
                            username: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_username'),
                            password: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password'),
                            password_confirm: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_confirm'),
                            password_confirm_reminder: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_reminder'),
                            password_new: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_new'),
                            password_new_confirm: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_new_confirm'),
                            bio: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_bio'),
                            email: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_email')
                            })==false)
                return null;

            const email = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_email').textContent;    
            const password = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password').textContent;
            const password_new = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_new').textContent;
            const password_reminder = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password_reminder').textContent;
        
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.admin_app_id){
                /**@type{{
                *          username:string, 
                *          password:string,
                *          password_new:string,
                *          bio:string|null, 
                *          private:number|null, 
                *          email:string|null, 
                *          email_unverified:string|null, 
                *          avatar:string|null}} */
                json_data = {   username:           username,
                                password:           password,
                                password_new:       password_new==''?null:password_new,
                                bio:                bio,
                                private:            Number(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_checkbox_profile_private').classList.contains('checked')),
                                password_reminder:  password_reminder,
                                email:              new_email==''?email:new_email,
                                avatar:             avatar
                            };
                path = `/server-iam/user/${COMMON_GLOBAL.iam_user_id ?? ''}`;
                authorization_type = 'ADMIN';
            }
            else{
                json_data = {   username:           username,
                                bio:                bio,
                                private:            Number(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_checkbox_profile_private').classList.contains('checked')),
                                password:           password,
                                password_new:       password_new,
                                password_reminder:  password_reminder,
                                email:              email,
                                new_email:          new_email==''?null:new_email,
                                avatar:             avatar
                            };
                path = `/server-db/user_account/${COMMON_GLOBAL.user_account_id ?? ''}`;
            }
                
        } else {
            if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit'),
                            {
                            bio: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_bio')
                            })==false)
                return null;
            json_data = {   provider_id:    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_provider_id').textContent,
                            username:       username,
                            bio:            bio,
                            private:        Number(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_checkbox_profile_private').classList.contains('checked'))
                        };
            path = `/server-db/user_account-common/${COMMON_GLOBAL.user_account_id ?? ''}`;
        }
        //update user using REST API
       commonFFB({path:path, method:'PATCH', authorization_type:authorization_type, body:json_data, spinner_id:'common_dialogue_iam_edit_btn_user_update'})
        .then(result=>{
            COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').style.backgroundImage= avatar?`url('${avatar}')`:'url()';
            COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').setAttribute('data-image',avatar);
            if (COMMON_GLOBAL.app_id != COMMON_GLOBAL.admin_app_id && JSON.parse(result).sent_change_email == 1){
                commonDialogueShow('VERIFY', 'NEW_EMAIL', new_email, null);
            }
            else
                commonComponentRemove('common_dialogue_iam_edit', true);
            resolve(null);
        });
    });
};
/**
 * @name commonUserSignup
 * @description User signup
 * @function
 * @returns {void}
 */
const commonUserSignup = () => {
    const email = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_email').textContent;
    if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start'),
                            {
                            username: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_username'),
                            password: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password'),
                            password_confirm: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_confirm'),
                            password_confirm_reminder: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_reminder'),
                            email: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_email')
                            })==true){
        const json_data = { username:           COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_username').textContent,
                            password:           COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password').textContent,
                            password_reminder:  COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_reminder').textContent,
                            email:              email,
                            active:             0
                            };
           
       commonFFB({path:'/server-db/user_account-signup', method:'POST', authorization_type:'APP_ID_SIGNUP', body:json_data, spinner_id:'common_dialogue_iam_start_signup_button'})
        .then(result=>{
            const signup = JSON.parse(result);
            COMMON_GLOBAL.token_at = signup.accessToken;
            COMMON_GLOBAL.token_exp = JSON.parse(result).exp;
            COMMON_GLOBAL.token_iat = JSON.parse(result).iat;
            COMMON_GLOBAL.token_timestamp = JSON.parse(result).tokentimestamp;
            COMMON_GLOBAL.user_account_id = parseInt(signup.id);
            commonDialogueShow('VERIFY', 'SIGNUP', email, null);
        });
    }
};
/**
 * @name commonUserVerifyCheckInput
 * @description User verify check input
 * @function
 * @param {HTMLElement} item 
 * @param {string} nextField
 * @returns {Promise.<{ actived: number, 
 *                      verification_type : number}|null>}
 */
const commonUserVerifyCheckInput = async (item, nextField) => {
    return new Promise((resolve, reject)=>{
        let json_data;
        /**
         * Verification type
         * 1 LOGIN
         * 2 SIGNUP
         * 3 FORGOT/ PASSWORD RESET
         * 4 NEW EMAIL
         * @type{number} 
         */
        const verification_type = parseInt(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_data_verification_type').textContent);
        //only accept 0-9
        if (item.textContent && item.textContent.length==1 && ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(item.textContent) > -1)
            if (nextField == '' || (COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char1').textContent != '' &&
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char2').textContent != '' &&
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char3').textContent != '' &&
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char4').textContent != '' &&
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char5').textContent != '' &&
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char6').textContent != '')) {
                //last field, validate entered code
                const verification_code = parseInt(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char1').textContent +
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char2').textContent +
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char3').textContent +
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char4').textContent +
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char5').textContent +
                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char6').textContent);
                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char1').classList.remove('common_input_error');
                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char2').classList.remove('common_input_error');
                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char3').classList.remove('common_input_error');
                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char4').classList.remove('common_input_error');
                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char5').classList.remove('common_input_error');
                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char6').classList.remove('common_input_error');
    
                //activate user
                json_data = {   verification_code:  verification_code,
                                verification_type:  verification_type
                            };
               commonFFB({  path:`/server-db/user_account-activate/${COMMON_GLOBAL.user_account_id ?? ''}`, 
                            method:'PUT', 
                            //2 SIGNUP and 3 FORGOT/ PASSWORD RESET not logged in
                            //1 LOGIN and 4 NEW EMAIL, logged in
                            authorization_type:(verification_type==2||verification_type==3)?'APP_ID':'APP_ACCESS', 
                            body:json_data, 
                            spinner_id:'common_dialogue_iam_verify_email_icon'})
                .then(result=>{
                    const user_activate = JSON.parse(result).items[0];
                    if (user_activate.affectedRows == 1) {       
                        if (verification_type==3){
                            //FORGOT
                            COMMON_GLOBAL.token_at	= JSON.parse(result).accessToken;
                            COMMON_GLOBAL.token_exp = JSON.parse(result).exp;
                            COMMON_GLOBAL.token_iat = JSON.parse(result).iat;
                            COMMON_GLOBAL.token_timestamp = JSON.parse(result).tokentimestamp;
                            //show dialogue new password
                            commonDialogueShow('PASSWORD_NEW', null, JSON.parse(result).auth);
                            commonComponentRemove('common_dialogue_iam_verify', true);
                        }
                        else{
                            if (verification_type==1 || verification_type==4)
                                commonUserLogout(true);
                            else{
                                commonComponentRemove('common_dialogue_iam_verify');
                                commonComponentRemove('common_dialogue_iam_edit', true);
                            }
                            commonDialogueShow('LOGIN');
                        }
                        resolve({   actived: 1, 
                                    verification_type : verification_type});
                    } 
                    else{
                        COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char1').classList.add('common_input_error');
                        COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char2').classList.add('common_input_error');
                        COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char3').classList.add('common_input_error');
                        COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char4').classList.add('common_input_error');
                        COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char5').classList.add('common_input_error');
                        COMMON_DOCUMENT.querySelector('#common_dialogue_iam_verify_verification_char6').classList.add('common_input_error');
                        //code not valid
                        commonMessageShow('INFO', null, null, 'message_text',commonMesssageNotAuthorized(), COMMON_GLOBAL.common_app_id);
                        reject('ERROR');
                    }
                })
                .catch(err=>reject(err));
            } else{
                //not last, next!
                COMMON_DOCUMENT.querySelector('#' + nextField).focus();
                resolve(null);
            }
        else{
            //remove anything else than 0-9
            COMMON_DOCUMENT.querySelector('#' + item.id).textContent = '';
            resolve(null);
        }
    });
    
};
/**
 * @name commonUserDelete
 * @description User delete
 * @function
 * @param {number|null} choice 
 * @param {function|null} function_delete_event 
 * @returns {Promise.<{deleted:number}|null>}
 */
const commonUserDelete = async (choice=null, function_delete_event ) => {
    return new Promise((resolve, reject)=>{
        const password = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password').textContent;
        switch (choice){
            case null:{
                if (COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_local').style.display == 'block' &&
                    commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit'),
                                    {
                                        password: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_password')
                                    })==false)
                    resolve(null);
                else{
                    commonMessageShow('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL.app_id);
                    resolve(null);
                }
                break;
            }
            case 1:{
                commonComponentRemove('common_dialogue_message');
                
                const json_data = { password: password};
    
               commonFFB({path:`/server-db/user_account/${COMMON_GLOBAL.user_account_id ?? ''}`, method:'DELETE', authorization_type:'APP_ACCESS', body:json_data, spinner_id:'common_dialogue_iam_edit_btn_user_delete_account'})
                .then(()=>  resolve({deleted: 1}))
                .catch(err=>reject(err));
                break;
            }
            default:
                resolve(null);
                break;
        }
    });
};
/**
 * @name commonUserFunction
 * @description User function FOLLOW and LIKE with delete and post for both
 * @function
 * @param {'FOLLOW'|'LIKE'} function_name 
 * @returns {Promise.<null>}
 */
const commonUserFunction = function_name => {
    return new Promise((resolve, reject)=>{
        const user_id_profile = COMMON_DOCUMENT.querySelector('#common_profile_id').textContent;
        /**@type{import('../../../common_types.js').CommonRESTAPIMethod} */
        let method;
        let path;
        const json_data = { user_account_id: user_id_profile};
        const check_div = COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`);
        if (check_div.children[0].style.display == 'block') {
            path = `/server-db/user_account_${function_name.toLowerCase()}/${COMMON_GLOBAL.user_account_id ?? ''}`;
            method = 'POST';
        } else {
            path = `/server-db/user_account_${function_name.toLowerCase()}/${COMMON_GLOBAL.user_account_id ?? ''}`;
            method = 'DELETE';
        }
        if (COMMON_GLOBAL.user_account_id == null)
            commonDialogueShow('LOGIN');
        else {
           commonFFB({path:path, method:method, authorization_type:'APP_ACCESS', body:json_data})
            .then(()=> {
                if (COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display == 'block'){
                    //follow/like
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display = 'none';
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[1].style.display = 'block';
                }
                else{
                    //unfollow/unlike
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display = 'block';
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[1].style.display = 'none';
                }
                resolve(null);
            })
            .catch(err=>reject(err));
        }
    });
};
/**
 * @name commonUserAccountAppDelete
 * @description User account app delete
 * @function
 * @param {number|null} choice 
 * @param {number} user_account_id 
 * @param {number} app_id 
 * @param {function|null} function_delete_event 
 * @returns {void}
 */
const commonUserAccountAppDelete = (choice=null, user_account_id, app_id, function_delete_event=null) => {
    switch (choice){
        case null:{
            commonMessageShow('CONFIRM',null,function_delete_event, null, null, COMMON_GLOBAL.app_id);
            break;
        }
        case 1:{
            commonComponentRemove('common_dialogue_message');
            commonFFB({path:`/server-db/user_account_app/${user_account_id}`, body:{delete_app_id:app_id}, method:'DELETE', authorization_type:'APP_ACCESS'})
            .then(()=>{
                //execute event and refresh app list
                COMMON_DOCUMENT.querySelector('#common_profile_info_main_btn_cloud').click();
            })
            .catch(()=>null);
            break;
        }
        default:
            break;
    }
};
/**
 * @name commonUserForgot
 * @description User forgot
 * @function
 * @returns {Promise.<void>}
 */
const commonUserForgot = async () => {
    const email = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_forgot_email').textContent;
    const json_data = { email: email};
    if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit'),
                    {
                    email: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_forgot_email')
                    })==true){
        
       commonFFB({path:'/server-db/user_account-forgot', method:'POST', authorization_type:'APP_ID', body:json_data, spinner_id:'common_dialogue_iam_start_forgot_button'})
        .then(result=>{
            const forgot = JSON.parse(result);
            if (forgot.sent == 1){
                COMMON_GLOBAL.user_account_id = parseInt(forgot.id);
                commonDialogueShow('VERIFY', 'FORGOT', email, null);
            }
        });
    }
};
/**
 * @name commonUserUpdatePassword
 * @description Update password
 * @function
 * @returns {void}
 */
const commonUserUpdatePassword = () => {
    const password_new = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_password_new_password').textContent;
    const user_password_new_auth = COMMON_DOCUMENT.querySelector('#common_dialogue_iam_password_new_auth').textContent;
    const json_data = { password_new:   password_new,
                        auth:           user_password_new_auth
                     };
    if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit'),
                     {
                     password: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_password_new_password'),
                     password_confirm: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_password_new_confirm'),
                     
                     })==true){
       commonFFB({path:`/server-db/user_account-password/${COMMON_GLOBAL.user_account_id ?? ''}`, method:'PATCH', authorization_type:'APP_ACCESS', body:json_data, spinner_id:'common_dialogue_iam_password_new_icon'})
        .then(()=>{
            commonComponentRemove('common_dialogue_iam_password_new', true);
            commonDialogueShow('LOGIN');
        });
    }    
};
/**
 * @name commonUserPreferenceSave
 * @description User preference save
 * @function
 * @returns {Promise.<void>}
 */
const commonUserPreferenceSave = async () => {
    if (COMMON_GLOBAL.user_account_id != null){
        const json_data =
            {  
                preference_locale:                      COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_user_locale_select .common_select_dropdown_value')
                                                            .getAttribute('data-value'),
                app_setting_preference_timezone_id:     COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_user_timezone_select .common_select_dropdown_value')
                                                            .getAttribute('data-value'),
                app_setting_preference_direction_id:    COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_user_direction_select .common_select_dropdown_value')
                                                            .getAttribute('data-value'),
                app_setting_preference_arabic_script_id:COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_user_arabic_script_select .common_select_dropdown_value')
                                                            .getAttribute('data-value'),
            };
        await commonFFB({path:`/server-db/user_account_app/${COMMON_GLOBAL.user_account_id ?? ''}`, method:'PATCH', authorization_type:'APP_ACCESS', body:json_data});
    }
};
/**
 * @name commonUserPreferencesGlobalSetDefault
 * @description User prefernce set default globals
 * @function
 * @param {*} preference 
 * @returns {void}
 */
const commonUserPreferencesGlobalSetDefault = (preference) => {
    switch (preference){
        case 'LOCALE':{
            COMMON_GLOBAL.user_locale         = commonWindowNavigatorLocale();
            break;
        }
        case 'TIMEZONE':{
            COMMON_GLOBAL.user_timezone       = COMMON_GLOBAL.client_timezone ?? COMMON_WINDOW.Intl.DateTimeFormat().resolvedOptions().timeZone;
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
 * @name commonModuleEasyQRCODECreate
 * @description Create QR code
 * @function
 * @param {string} div 
 * @param {string} url 
 * @returns {Promise.<void>}
 */
const commonModuleEasyQRCODECreate = async (div, url) => {
    /**@type {import('../../../common_types.js').CommonModuleEasyQRCode} */
    const {QRCode} = await import(commonMiscImportmap('easy.qrcode'));
    COMMON_DOCUMENT.querySelector('#' + div).textContent='';
    new QRCode(COMMON_DOCUMENT.querySelector('#' + div), {
        text: url,
        width: 128,
        height: 128,
        colorDark: 'DARK',
        colorLight: 'LIGHT',
        drawer: 'svg'
    });
    //executing await promise 1 ms results in QRCode rendered
    commonWindowWait(1);
};
/**
 * @name commonModuleLeafletInit
 * @description Module Leaflet init
 * @function
 * @param {{mount_div:string,
 *          longitude:string,
 *          latitude:string,
 *          place:String,
 *          doubleclick_event:function|null,
 *          update_map?:boolean|null
 *          }} parameters
 * @returns {Promise.<void>}
 */
const commonModuleLeafletInit = async parameters => {  
    /**
     * 
     * @type {{ data:null,
     *          methods:import('../../../common_types.js').CommonModuleLeafletMethods}}
     */
    const module_leaflet = await commonComponentRender({
                            mountDiv:   parameters.mount_div,
                            data:       {   
                                        longitude:parameters.longitude,
                                        latitude:parameters.latitude,
                                        app_eventListeners:COMMON_GLOBAL.app_eventListeners
                                        },
                            methods:    {
                                        commonMiscImportmap:commonMiscImportmap
                                        },
                            path:       '/common/component/common_module_leaflet.js'})
    .catch(error=>{throw error;});

    const module_leaflet_control = await commonComponentRender({
        mountDiv:   null, 
        data:       {   
                    data_app_id:COMMON_GLOBAL.common_app_id,
                    user_locale:COMMON_GLOBAL.user_locale,
                    locale:COMMON_GLOBAL.user_locale,
                    longitude:parameters.longitude,
                    latitude:parameters.latitude
                    },
        methods:    {
                    function_event_doubleclick: parameters.doubleclick_event,
                    commonMiscImportmap:commonMiscImportmap,
                    commonComponentRender:commonComponentRender,
                    commonMicroserviceGeolocationPlace:commonMicroserviceGeolocationPlace,
                    commonMiscElementRow:commonMiscElementRow,
                    commonFFB:commonFFB,
                    moduleLeafletContainer:module_leaflet.methods.leafletContainer,
                    moduleLeafletLibrary:module_leaflet.methods.leafletLibrary
                    },
        path:       '/common/component/common_module_leaflet_control.js'});
        
        COMMON_GLOBAL.moduleLeaflet.methods = module_leaflet_control.methods;
        if (parameters.update_map)
            COMMON_GLOBAL.moduleLeaflet.methods.map_update({ longitude:parameters.longitude,
                latitude:parameters.latitude,
                text_place:parameters.place,
                country:'',
                city:'',
                timezone_text :null
            });
};

/**
 * @name commonFFB
 * @description Frontend for Backend (FFB)
 * @function
 * @param {{path:string,
 *          query?:string|null,
 *          method:import('../../../common_types.js').CommonRESTAPIMethod,
 *          authorization_type:import('../../../common_types.js').CommonRESTAPIAuthorizationType,
 *          body?:*,
 *          spinner_id?:string|null}} parameter
 * @returns {Promise.<*>} 
 */
const commonFFB = async parameter => {
    /**@type{number} */
    let status;
    let authorization = null;
    let service_path;
    parameter.query = parameter.query==null?'':parameter.query;
    parameter.body = parameter.body?parameter.body:null;
    switch (parameter.authorization_type){
        case 'APP_ID':
        case 'APP_ID_SIGNUP':{
            service_path = `${COMMON_GLOBAL.rest_resource_bff}/${parameter.authorization_type.toLowerCase()}`;
            break;
        }
        case 'APP_ACCESS':{
            authorization = `Bearer ${COMMON_GLOBAL.token_at}`;
            service_path = `${COMMON_GLOBAL.rest_resource_bff}/${parameter.authorization_type.toLowerCase()}`;
            break;
        }
        case 'ADMIN':{
            authorization = `Bearer ${COMMON_GLOBAL.token_admin_at}`;
            service_path = `${COMMON_GLOBAL.rest_resource_bff}/${parameter.authorization_type.toLowerCase()}`;
            break;
        }
        case 'IAM_ADMIN':
        case 'IAM_PROVIDER':
        case 'IAM_USER':{
            authorization = `Basic ${COMMON_WINDOW.btoa(parameter.body.username + ':' + parameter.body.password)}`;
            if (COMMON_GLOBAL.app_id==COMMON_GLOBAL.admin_app_id && parameter.authorization_type == 'IAM_USER')
                service_path = `${COMMON_GLOBAL.rest_resource_bff}/iam_admin`;
            else
                service_path = `${COMMON_GLOBAL.rest_resource_bff}/${parameter.authorization_type.toLowerCase()}`;
            break;
        }
    }
    //add common query parameter
    parameter.query += `&locale=${COMMON_GLOBAL.user_locale}`;

    //encode query parameters
    const encodedparameters = parameter.query?commonWindowToBase64(parameter.query):'';
    const url = `${service_path}/v${(COMMON_GLOBAL.app_rest_api_version ?? 1)}${parameter.path}?parameters=${encodedparameters}`;

    if (parameter.path=='/server-socket/socket' && parameter.method=='POST'){
        const options = {
            method: parameter.method,
            headers: {  'Content-Type': 'text/event-stream', 
                        'Cache-control': 'no-cache', 
                        'Connection': 'keep-alive',
                        'id-token': `Bearer ${COMMON_GLOBAL.token_dt}`,
                        ...(authorization && {Authorization: authorization})}
        };
        return fetch(url, options);
    }
    else{
        //add options to fetch
        let options = {};
        if (parameter.body ==null)
            options = {
                        cache: 'no-store',  //browser should never cache result from REST API
                        method: parameter.method,
                        headers: {
                                    
                                    'id-token': `Bearer ${COMMON_GLOBAL.token_dt}`,
                                    ...(authorization && {Authorization: authorization})
                                },
                        body: null
                    };
        else
            options = {
                    cache: 'no-store',      //browser should never cache result from from REST API
                    method: parameter.method,
                    headers: {
                                'Content-Type': 'application/json',
                                'id-token': `Bearer ${COMMON_GLOBAL.token_dt}`,
                                ...(authorization && {Authorization: authorization})
                            },
                    body: JSON.stringify(parameter.body)
                };
        if (parameter.spinner_id && COMMON_DOCUMENT.querySelector(`#${parameter.spinner_id}`))
            COMMON_DOCUMENT.querySelector(`#${parameter.spinner_id}`).classList.add('css_spinner');
        return await fetch(url, options)
                .then((response) => {
                    status = response.status;
                    return response.text();
                })
                .then((result) => {
                    if (parameter.spinner_id && COMMON_DOCUMENT.querySelector(`#${parameter.spinner_id}`))
                        COMMON_DOCUMENT.querySelector(`#${parameter.spinner_id}`).classList.remove('css_spinner');
                    switch (status){
                        case 200:
                        case 201:{
                            //OK
                            return result;
                        }
                        case 400:{
                            //Bad request
                            commonMessageShow('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                        case 404:{
                            //Not found
                            commonMessageShow('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                        case 401:{
                            //Unauthorized, token expired
                            commonMessageShow('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                        case 403:{
                            //Forbidden, not allowed to login or register new user
                            commonMessageShow('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                        case 500:{
                            //Unknown error
                            commonException(COMMON_GLOBAL.app_function_exception, result);
                            throw result;
                        }
                        case 503:{
                            //Service unavailable or other error in microservice
                            commonMessageShow('ERROR_BFF', null, null, null, result, COMMON_GLOBAL.app_id);
                            throw result;
                        }
                    }
                })
                .catch(error=>{
                    if (parameter.spinner_id && COMMON_DOCUMENT.querySelector(`#${parameter.spinner_id}`))
                        COMMON_DOCUMENT.querySelector(`#${parameter.spinner_id}`).classList.remove('css_spinner');
                    throw error;
                });
    }        
};
/**
 * @name commonSocketBroadcastShow
 * @description Show broadcast message
 * @function
 * @param {string} broadcast_message 
 * @returns {void}
 */
const commonSocketBroadcastShow = (broadcast_message) => {
    broadcast_message = commonWindowFromBase64(broadcast_message);
    const broadcast_type = JSON.parse(broadcast_message).broadcast_type;
    const message = JSON.parse(broadcast_message).broadcast_message;
    switch (broadcast_type){
        case 'MAINTENANCE':{
            if (COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`))
                location.href = '/';
            else
                if (message)
                    commonSocketMaintenanceShow(commonWindowFromBase64(message));
            break;
        }
        case 'SESSION_EXPIRED':{
            COMMON_GLOBAL.app_function_session_expired?COMMON_GLOBAL.app_function_session_expired():null;
            break;
        }
        case 'CONNECTINFO':{
            COMMON_GLOBAL.client_latitude =             JSON.parse(commonWindowFromBase64(message)).latitude==''?
                                                            COMMON_GLOBAL.client_latitude:
                                                                JSON.parse(commonWindowFromBase64(message)).latitude;
            COMMON_GLOBAL.client_longitude =            JSON.parse(commonWindowFromBase64(message)).longitude==''?
                                                            COMMON_GLOBAL.client_longitude:
                                                                JSON.parse(commonWindowFromBase64(message)).longitude;
            COMMON_GLOBAL.client_place =                JSON.parse(commonWindowFromBase64(message)).place==''?
                                                            COMMON_GLOBAL.client_place:
                                                                JSON.parse(commonWindowFromBase64(message)).place;
            COMMON_GLOBAL.client_timezone =             JSON.parse(commonWindowFromBase64(message)).timezone==''?
                                                            COMMON_GLOBAL.client_timezone:
                                                                JSON.parse(commonWindowFromBase64(message)).timezone;
            break;
        }
        case 'CHAT':
        case 'ALERT':{
            commonComponentRender({
                mountDiv:   'common_broadcast',
                data:       {message:commonWindowFromBase64(message)},
                methods:    null,
                path:       COMMON_DOCUMENT.querySelector('#common_dialogue_maintenance')?'/maintenance/component/broadcast.js':'/common/component/common_broadcast.js'});
            break;
        }
		case 'PROGRESS':{
			commonMessageShow('PROGRESS', null, null, null, JSON.parse(commonWindowFromBase64(message)));
            break;
        }
        case 'APP_FUNCTION':{
            if (COMMON_GLOBAL.app_function_sse)
                COMMON_GLOBAL.app_function_sse(commonWindowFromBase64(message));
        }
    }
};
/**
 * @name commonSocketMaintenanceShow
 * @description Show maintenance
 * @function
 * @param {string|null} message 
 * @param {number|null} init 
 * @returns {void}
 */
const commonSocketMaintenanceShow = (message, init=null) => {
    
    if (init==1){
        commonComponentRender({
            mountDiv:   'common_dialogue_maintenance',
            data:       null,
            methods:    {commonWindowSetTimeout:commonWindowSetTimeout, commonWindowLocationReload:commonWindowLocationReload},
            path:       '/maintenance/component/common_dialogue_maintenance.js'});
    }
    else
        COMMON_DOCUMENT.querySelector('#common_maintenance_footer').textContent = message ?? '';
};
/**
 * @name socketReconnect
 * @description Socket reconnect
 * @function
 * @returns {void}
 */
const socketReconnect = () => {
    commonWindowSetTimeout(()=>{commonSocketConnectOnline();}, 5000);
};
/**
 * @name commonSocketConnectOnline
 * @description Socket connect online, can use id-token or access token
 * @function
 * @returns {Promise.<void>}
 */
const commonSocketConnectOnline = async () => {
    const  authorization_type= (COMMON_GLOBAL.token_at && COMMON_GLOBAL.admin_app_id == COMMON_GLOBAL.app_id)?
                                    'ADMIN':
                                        COMMON_GLOBAL.token_at?'APP_ACCESS':'APP_ID';
   commonFFB({path:'/server-socket/socket', method:'POST', authorization_type:authorization_type})
    .then((result_SSE)=>{
        const SSEStream = new WritableStream({
            write(data){
                try {
                    const message = new TextDecoder().decode(new Uint8Array(data),{stream:true}).split('\n\n')[0];
                    if (message.split('data: ')[1])
                        commonSocketBroadcastShow(message.split('data: ')[1]);
                } catch (error) {
                    null;
                }
            }
        });
        const SSE = result_SSE.body.pipeTo(SSEStream).catch(()=>socketReconnect());
        SSE;
    })
    .catch(()=>socketReconnect());
};
/**
 * @name commonSocketConnectOnlineCheck
 * @description Socket check online
 * @function
 * @param {string} div_icon_online 
 * @param {number} user_account_id 
 * @returns {void}
 */
const commonSocketConnectOnlineCheck = (div_icon_online, user_account_id) => {
   commonFFB({path:`/server-socket/socket-status/${user_account_id}`, method:'GET', authorization_type:'APP_ID'})
    .then(result=>COMMON_DOCUMENT.querySelector('#' + div_icon_online).className = 'common_icon ' + (JSON.parse(result).online==1?'online':'offline'));
};
/**
 * @name commonMicroserviceGeolocationPlace
 * @description Microservice Geolocation: Get place from GPS
 * @function
 * @param {string} longitude 
 * @param {string} latitude 
 * @returns {Promise.<string>}
 */
const commonMicroserviceGeolocationPlace = async (longitude, latitude) => {
    return await new Promise((resolve)=>{
       commonFFB({path:'/geolocation/place', query:`longitude=${longitude}&latitude=${latitude}`, method:'GET', authorization_type:'APP_ID'})
        .then(result=>{
            const json = JSON.parse(result);
            if (json.place=='' && json.region =='' && json.countryCode =='')
                resolve('');
            else
                resolve(json.place + ', ' +
                        json.region + ', ' +
                        json.countryCode);
        })
        .catch(()=>resolve(''));
    });
};
/**
 * @name commonMicroserviceGeolocationIp
 * @description Microservice Geolocation: Get GPS from given ip or current user
 * @function
 * @param {string|null} ip
 * @returns {Promise.<{latitude:String, longitude:string, place:string}>}
 */
const commonMicroserviceGeolocationIp = async ip => {
    return commonFFB({path:'/geolocation/ip', query:`ip=${ip}`, method:'GET', authorization_type:'APP_ID'})
        .then(result=>{
            return {
                latitude:JSON.parse(result).latitude,
                longitude: JSON.parse(result).longitude,
                place: `${JSON.parse(result).city ?? ''}, ${JSON.parse(result).regionName}, ${JSON.parse(result).countryName}`
            };
        })
        .catch(()=>{return {
            latitude:'',
            longitude: '',
            place: ''
        };});

};
/**
 * @name commonMicroserviceWorldcitiesSearch
 * @description Microservice Geolocation: Worldcities - Search
 * @function
 * @param {function} event_function 
 * @returns {Promise.<void>}
 */
const commonMicroserviceWorldcitiesSearch = async (event_function) =>{
    commonComponentRender({
        mountDiv:   'common_module_leaflet_search_list_wrap',
        data:       {
                    data_app_id:COMMON_GLOBAL.common_app_id,
                    search:COMMON_DOCUMENT.querySelector('#common_module_leaflet_search_input').textContent
                    },
        methods:    {
                    click_function:event_function,
                   commonFFB:commonFFB
                    },
        path:       '/common/component/common_module_leaflet_search_city.js'});
};
/**
 * @name commonException
 * @description Exception function
 * @function
 * @param {function|null} appException_function 
 * @param {Error|string} error 
 * @returns {void}
 */
const commonException = (appException_function, error) => {
    if (appException_function)
        appException_function(error);
};
/**
 * @name commonTextEditingDisabled
 * @description Check if textediting is disabled
 * @function
 * @returns {boolean}
 */
const commonTextEditingDisabled = () =>COMMON_GLOBAL.app_text_edit=='0';

/**
 * @name commonEventSelectAction
 * @description Performs action for select event
 * @function
 * @param {string} event_target_id
 * @param { import('../../../common_types.js').CommonAppEvent['target']|
 *          import('../../../common_types.js').CommonAppEvent['target']['parentNode']|null} target
 * @returns {Promise.<void>}
 */
const commonEventSelectAction = async (event_target_id, target) =>{
   //module leaflet events
   if(event_target_id== 'common_module_leaflet_select_country')
       COMMON_GLOBAL.moduleLeaflet.methods.eventClickCountry(event_target_id);
   if (event_target_id== 'common_module_leaflet_select_city')
       await COMMON_GLOBAL.moduleLeaflet.methods.eventClickCity(event_target_id);
   if(event_target_id == 'common_module_leaflet_select_mapstyle')
       COMMON_GLOBAL.moduleLeaflet.methods.eventClickMapLayer(target);

   //dialogue user menu events
   if (event_target_id == 'common_dialogue_user_menu_app_theme'){
       COMMON_DOCUMENT.body.className = 'app_theme' + COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).getAttribute('data-value');
       commonMiscPreferencesUpdateBodyClassFromPreferences();
   }
   if (event_target_id == 'common_dialogue_user_menu_user_locale_select'){
       COMMON_GLOBAL.user_locale = target?.getAttribute('data-value') ?? '';
       /**
        * @todo change COMMON_WINDOW.navigator.language, however when logging out default COMMON_WINDOW.navigator.language will be set
        *       commented at the moment
        *       Object.defineProperties(COMMON_WINDOW.navigator, {'language': {'value':COMMON_GLOBAL.user_locale, writable: true}});
        */
       await commonUserPreferenceSave();
       await commonComponentRender({
        mountDiv:   'common_dialogue_user_menu_user_locale_select', 
        data:       {
                    default_data_value:COMMON_GLOBAL.user_locale,
                    default_value:'',
                    options: await commonFFB({
                                                path:'/app-module/COMMON_LOCALE', 
                                                query:`locale=${COMMON_GLOBAL.user_locale}`, 
                                                method:'POST', authorization_type:'APP_ID',
                                                body:{type:'FUNCTION',IAM_data_app_id : COMMON_GLOBAL.common_app_id}
                                            })
                                            .then((/**@type{string}*/result)=>JSON.parse(result).rows),
                    path:null,
                    query:null,
                    method:null,
                    authorization_type:null,
                    column_value:'locale',
                    column_text:'text'
                    },
        methods:    {commonFFB:commonFFB},
        path:       '/common/component/common_select.js'});
        commonMiscSelectCurrentValueSet('common_dialogue_user_menu_user_locale_select', COMMON_GLOBAL.user_locale);
   }
   if (event_target_id == 'common_dialogue_user_menu_user_timezone_select'){
       COMMON_GLOBAL.user_timezone = target?.getAttribute('data-value') ?? '';
       await commonUserPreferenceSave().then(()=>{
           if (COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit').textContent !='') {
               commonComponentRender({
                   mountDiv:   'common_dialogue_iam_edit',
                   data:       {
                                app_id:COMMON_GLOBAL.app_id,
                                iam_user_id:COMMON_GLOBAL.iam_user_id,
                                user_account_id:COMMON_GLOBAL.user_account_id,
                                common_app_id:COMMON_GLOBAL.common_app_id,
                                admin_app_id:COMMON_GLOBAL.admin_app_id
                               },
                   methods:    {
                              commonFFB:commonFFB,
                               commonMessageShow:commonMessageShow,
                               commonMesssageNotAuthorized:commonMesssageNotAuthorized,
                               commonMiscFormatJsonDate:commonMiscFormatJsonDate
                               },
                   path:       '/common/component/common_dialogue_iam_edit.js'})
               .then(()=>{
                   commonComponentRemove('common_dialogue_user_menu');
               });
           }
       });
   }
   if(event_target_id =='common_dialogue_user_menu_user_direction_select'){
       if(target?.getAttribute('data-value')=='rtl')
           COMMON_DOCUMENT.body.classList.add('rtl');
       else
           COMMON_DOCUMENT.body.classList.remove('rtl');
       COMMON_GLOBAL.user_direction = target?.getAttribute('data-value') ?? '';
       await commonUserPreferenceSave();
   }
   if(event_target_id == 'common_dialogue_user_menu_user_arabic_script_select'){
       COMMON_GLOBAL.user_arabic_script = target?.getAttribute('data-value') ?? '';
       //check if app theme div is using default theme with common select div
       if (COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_app_theme').className?
           COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_app_theme').className.toLowerCase().indexOf('common_select')>-1:false){
           COMMON_DOCUMENT.body.className = 'app_theme' + COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_app_theme .common_select_dropdown_value').getAttribute('data-value');
           commonMiscPreferencesUpdateBodyClassFromPreferences();
       }
       await commonUserPreferenceSave();
   }
};
/**
 * @name commonEvent
 * @description Common events
 * @function
 * @param {string} event_type 
 * @param {import('../../../common_types.js').CommonAppEvent|null} event 
 * @returns {Promise.<void>}
 */
const commonEvent = async (event_type,event=null) =>{
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener(event_type, (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
            commonEvent(event_type, event);
        });
    }
    else{
        switch (event_type){
            case 'click':{
                //close all open div selects except current target
                if (typeof event.target.className=='string' && event.target.className.indexOf('common_select')>-1){
                    Array.from(COMMON_DOCUMENT.querySelectorAll(`#${COMMON_GLOBAL.app_root} .common_select_options`))
                        .filter((/**@type{HTMLElement}*/element)=>commonMiscElementId(element) != commonMiscElementId(event.target))
                        .forEach((/**@type{HTMLElement}*/element)=>element.style.display='none');
                }

                if (event.target.classList.contains('common_switch')){
                    if (event.target.classList.contains('checked'))
                        event.target.classList.remove('checked');
                    else
                        event.target.classList.add('checked');
                }
                else{
                    const event_target_id = commonMiscElementId(event.target);
                    switch(event_target_id){
                        case event.target.parentNode.classList.contains('common_select_dropdown_value')?event_target_id:'':
                        case event.target.parentNode.classList.contains('common_select_dropdown_icon')?event_target_id:'':
                        case event.target.classList.contains('common_select_dropdown_value')?event_target_id:'':
                        case event.target.classList.contains('common_select_dropdown_icon')?event_target_id:'':{
                            COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_options`).style.display = 
                                COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_options`).style.display=='block'?'none':'block';
                            break;
                        }
                        case event.target.parentNode.classList.contains('common_select_option')?event_target_id:'':{
                            //select can show HTML, use innerHTML
                            COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).innerHTML = event.target.parentNode.innerHTML;
                            COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).setAttribute('data-value', event.target.parentNode.getAttribute('data-value'));
                            event.target.parentNode.parentNode.style.display = 'none';
                            await commonEventSelectAction(event_target_id, event.target.parentNode);
                            break;
                        }
                        case event.target.classList.contains('common_select_option')?event_target_id:'':{
                            //select can show HTML, use innerHTML
                            COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).innerHTML = event.target.innerHTML;
                            COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).setAttribute('data-value', event.target.getAttribute('data-value'));
                            event.target.parentNode.style.display = 'none';
                            await commonEventSelectAction(event_target_id, event.target);
                            break;
                        }
                        // dialogue login/signup/forgot
                        case 'common_dialogue_iam_start_login':
                        case 'common_dialogue_iam_start_signup':
                        case 'common_dialogue_iam_start_forgot':{
                            commonDialogueShow(event_target_id.substring('common_dialogue_iam_start_'.length).toUpperCase());
                            break;
                        }
                        case 'common_dialogue_iam_start_close':{
                            commonComponentRemove('common_dialogue_iam_start', true);
                            break;
                        }
                        case 'common_dialogue_iam_start_forgot_button':{
                            await commonUserForgot();
                            break;
                        }
                        case 'common_dialogue_iam_start_signup_button':{
                            commonUserSignup();
                            break;
                        }
                        //dialogue message
                        case 'common_message_close':{
                            if (COMMON_DOCUMENT.querySelector('#common_message_close')['data-function'])
                                COMMON_DOCUMENT.querySelector('#common_message_close')['data-function']();
                            commonComponentRemove('common_dialogue_message',true);
                            break;
                        }
                        case 'common_message_cancel':{
                            commonComponentRemove('common_dialogue_message',true);
                            break;
                        }
                        //dialogue password
                        case 'common_dialogue_iam_password_new_cancel':{
                            commonDialoguePasswordNewClear();
                            break;
                        }
                        case 'common_dialogue_iam_password_new_ok':{
                            commonUserUpdatePassword();
                            break;
                        }
                        case 'common_profile_search_icon':{
                            COMMON_DOCUMENT.querySelector('#common_profile_search_input').focus();
                            COMMON_DOCUMENT.querySelector('#common_profile_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                            break;
                        }
                        //Dialogue apps
                        case 'common_dialogue_apps_list':
                            if (event.target.classList.contains('common_dialogue_apps_app_logo')){
                                const app_url = event.target.getAttribute('data-url');
                                if (app_url)
                                    COMMON_WINDOW.open(app_url);
                            }
                            break;
                        case 'common_dialogue_info_app_link':{
                            if (COMMON_GLOBAL.app_link_url)
                                COMMON_WINDOW.open(COMMON_GLOBAL.app_link_url,'_blank','');
                            break;
                        }
                        case 'common_dialogue_info_app_email':{
                            COMMON_WINDOW.open(`mailto:${COMMON_GLOBAL.app_email}`,'_blank','');
                            break;
                        }
                        case 'common_dialogue_info_info_link1':{
                            commonComponentRender({
                                mountDiv:   'common_window_info',
                                data:       {
                                            info:1,
                                            url:COMMON_GLOBAL.info_link_policy_url,
                                            content_type:null, 
                                            iframe_content:null
                                            },
                                methods:    {commonWindowSetTimeout:commonWindowSetTimeout},
                                path:       '/common/component/common_window_info.js'});
                            break;
                        }
                        case 'common_dialogue_info_info_link2':{
                            commonComponentRender({
                                mountDiv:   'common_window_info',
                                data:       {
                                            info:1,
                                            url:COMMON_GLOBAL.info_link_disclaimer_url,
                                            content_type:null, 
                                            iframe_content:null
                                            },
                                methods:    {commonWindowSetTimeout:commonWindowSetTimeout},
                                path:       '/common/component/common_window_info.js'});
                            break;
                        }
                        case 'common_dialogue_info_info_link3':{
                            commonComponentRender({
                                mountDiv:   'common_window_info',
                                data:       {
                                            info:1,
                                            url:COMMON_GLOBAL.info_link_terms_url,
                                            content_type:null, 
                                            iframe_content:null
                                            },
                                methods:    {commonWindowSetTimeout:commonWindowSetTimeout},
                                path:       '/common/component/common_window_info.js'});
                            break;
                        }
                        //dialogue app_data_display
                        case event.target.classList.contains('common_app_data_display_button_print')?event_target_id:'':
                        case event.target.classList.contains('common_app_data_display_button_update')?event_target_id:'':
                        case event.target.classList.contains('common_app_data_display_button_post')?event_target_id:'':
                        case event.target.classList.contains('common_app_data_display_button_delete')?event_target_id:'':{
                            if (COMMON_DOCUMENT.querySelector(`#${event_target_id}`)['data-function'])
                                    COMMON_DOCUMENT.querySelector(`#${event_target_id}`)['data-function']();
                            break;
                        }
                        //window info
                        case 'common_window_info_btn_close':{
                            commonWindoInfoClose();
                            break;
                        }
                        case 'common_window_info_info_img':{
                            commonWindoInfoToolbarShowHide();
                            break;
                        }
                        case 'common_window_info_toolbar_btn_zoomout':{
                            commonZoomInfo(-1);
                            break;
                        }
                        case 'common_window_info_toolbar_btn_zoomin':{
                            commonZoomInfo(1);
                            break;
                        }
                        case 'common_window_info_toolbar_btn_left':{
                            commonMoveInfo(-1,0);
                            break;
                        }
                        case 'common_window_info_toolbar_btn_right':{
                            commonMoveInfo(1,0);
                            break;
                        }
                        case 'common_window_info_toolbar_btn_up':{
                            commonMoveInfo(0,-1);
                            break;
                        }
                        case 'common_window_info_toolbar_btn_down':{
                            commonMoveInfo(0,1);
                            break;
                        }
                        case 'common_window_info_toolbar_btn_fullscreen':{
                            if (COMMON_DOCUMENT.fullscreenElement)
                                COMMON_DOCUMENT.exitFullscreen();
                            else
                                COMMON_DOCUMENT.body.requestFullscreen();
                            break;
                        }
                        /* Dialogue user menu*/
                        case 'common_iam_avatar':
                        case 'common_iam_avatar_logged_in':
                        case 'common_iam_avatar_avatar':
                        case 'common_iam_avatar_avatar_img':
                        case 'common_iam_avatar_logged_out':
                        case 'common_iam_avatar_default_avatar':{
                            await commonComponentRender({
                                mountDiv:   'common_dialogue_user_menu',
                                data:       {
                                            app_id:COMMON_GLOBAL.app_id,
                                            user_account_id:COMMON_GLOBAL.user_account_id,
                                            common_app_id:COMMON_GLOBAL.common_app_id,
                                            admin_app_id:COMMON_GLOBAL.admin_app_id,
                                            data_app_id:COMMON_GLOBAL.common_app_id,
                                            username:COMMON_GLOBAL.user_account_username,
                                            token_exp:COMMON_GLOBAL.token_exp,
                                            token_iat:COMMON_GLOBAL.token_iat,
                                            token_timestamp: COMMON_GLOBAL.token_timestamp,
                                            admin:COMMON_GLOBAL.iam_user_name,
                                            user_locale:COMMON_GLOBAL.user_locale,
                                            user_timezone:COMMON_GLOBAL.user_timezone,
                                            user_direction:COMMON_GLOBAL.user_direction,
                                            user_arabic_script:COMMON_GLOBAL.user_arabic_script
                                            },
                                methods:    {
                                            commonMiscSelectCurrentValueSet:commonMiscSelectCurrentValueSet,
                                            commonFFB:commonFFB,
                                            commonComponentRender:commonComponentRender,
                                            commonUserSessionCountdown:commonUserSessionCountdown,
                                            commonMessageShow:commonMessageShow,
                                            commonMesssageNotAuthorized:commonMesssageNotAuthorized
                                            },
                                path:       '/common/component/common_dialogue_user_menu.js'});
                            break;
                        }
                        case 'common_dialogue_user_menu_username':{
                            commonComponentRemove('common_dialogue_user_menu');
                            await commonProfileShow();
                            break;
                        }        
                        case 'common_dialogue_user_menu_close':{
                            commonComponentRemove('common_dialogue_user_menu', true);
                            break;
                        }
                        case 'common_dialogue_user_menu_log_in':{
                            commonComponentRemove('common_dialogue_user_menu');
                            commonDialogueShow('LOGIN');
                            break;
                        }
                        case 'common_dialogue_user_menu_edit':{
                            commonComponentRender({
                                mountDiv:   'common_dialogue_iam_edit',
                                data:       {
                                            app_id:COMMON_GLOBAL.app_id,
                                            iam_user_id:COMMON_GLOBAL.iam_user_id,
                                            user_account_id:COMMON_GLOBAL.user_account_id,
                                            common_app_id:COMMON_GLOBAL.common_app_id,
                                            admin_app_id:COMMON_GLOBAL.admin_app_id
                                            },
                                methods:    {
                                           commonFFB:commonFFB,
                                            commonMessageShow:commonMessageShow,
                                            commonMesssageNotAuthorized:commonMesssageNotAuthorized,
                                            commonMiscFormatJsonDate:commonMiscFormatJsonDate
                                            },
                                path:       '/common/component/common_dialogue_iam_edit.js'})
                            .then(()=>{
                                commonComponentRemove('common_dialogue_user_menu');
                            });
                            break;
                        }
      
                        case 'common_dialogue_user_menu_signup':{
                            commonComponentRemove('common_dialogue_user_menu');
                            commonDialogueShow('SIGNUP');
                            break;
                        }
                        //dialogue user edit
                        case 'common_dialogue_iam_edit_close':{
                            commonComponentRemove('common_dialogue_iam_edit', true);
                            break;
                        }
                        case 'common_dialogue_iam_edit_btn_avatar_img':{
                            COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_input_avatar_img').click();
                            break;
                        }
                        case 'common_dialogue_iam_edit_input_avatar_img':{
                            commonMiscImageShow(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_edit_avatar_img'), event.target.id, COMMON_GLOBAL.image_avatar_width, COMMON_GLOBAL.image_avatar_height);
                            break;
                        }
                        case 'common_dialogue_iam_edit_btn_user_update':{
                            await commonUserUpdate();
                            break;
                        }
                        case 'common_dialogue_iam_edit_btn_user_delete_account':{
                            const function_delete_user_account = () => { 
                                commonUserDelete(1, null)
                                .then(()=>COMMON_GLOBAL.app_function_session_expired?COMMON_GLOBAL.app_function_session_expired():null)
                                .catch(()=>null);
                            };
                            await commonUserDelete(null, function_delete_user_account);
                            
                            break;
                        }        
                        //dialogue verify
                        case 'common_dialogue_iam_verify_cancel':{
                            commonComponentRemove('common_dialogue_iam_verify');
                            break;
                        }
                        //search list
                        case 'common_profile_search_list':{
                            if (event.target.classList.contains('common_profile_search_list_username')){
                                if (COMMON_DOCUMENT.querySelector('#common_profile_search_list')['data-function']){
                                    await COMMON_DOCUMENT.querySelector('#common_profile_search_list')['data-function'](commonMiscElementRow(event.target).getAttribute('data-user_account_id'));
                                }
                                else
                                    await commonProfileShow(Number(commonMiscElementRow(event.target).getAttribute('data-user_account_id')),null);
                            }
                            break;
                        }
                        //dialogue button stat
                        case 'common_profile_btn_top':{
                            await commonProfileStat(1, null);
                            break;
                        }
                        //dialogue profile
                        case 'common_dialogue_profile_home':{
                            commonComponentRemove('common_dialogue_user_menu');
                            await commonProfileStat(1, null);
                            break;
                        }
                        case 'common_dialogue_profile_close':{
                            commonComponentRemove('common_dialogue_profile', true);
                            break;
                        }
                        //dialogue profile stat
                        case 'common_profile_stat_row1_1':{
                            await commonProfileStat(1, null);
                            break;
                        }
                        case 'common_profile_stat_row1_2':{
                            await commonProfileStat(2, null);
                            break;
                        }
                        case 'common_profile_stat_row1_3':{
                            await commonProfileStat(3, null);
                            break;
                        }
                        //dialogue profile info
                        case 'common_profile_main_btn_following':{
                            COMMON_DOCUMENT.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                            commonProfileDetail(1);
                            break;
                        }
                        case 'common_profile_main_btn_followed':{
                            COMMON_DOCUMENT.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                            commonProfileDetail(2);
                            break;
                        }
                        case 'common_profile_main_btn_likes':{
                            COMMON_DOCUMENT.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                            commonProfileDetail(3);
                            break;
                        }
                        case 'common_profile_main_btn_liked':
                        case 'common_profile_main_btn_liked_heart':
                        case 'common_profile_main_btn_liked_users':{
                            commonProfileDetail(4);
                            COMMON_DOCUMENT.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                            break;
                        }
                        case 'common_profile_info_main_btn_cloud':{
                            COMMON_DOCUMENT.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                            commonProfileDetail(5);
                            break;
                        }
                        case 'common_profile_stat_list':{
                            await commonProfileShow(Number(commonMiscElementRow(event.target).getAttribute('data-user_account_id')),null);
                            break;
                        }
                        case 'common_profile_detail_list':{
                            if (event.target.classList.contains('common_profile_detail_list_username'))
                                await commonProfileShow(Number(commonMiscElementRow(event.target).getAttribute('data-user_account_id')),null);
                            else{
                                //app list
                                if (event.target.classList.contains('common_profile_detail_list_app_name'))
                                    COMMON_WINDOW.open(commonMiscElementRow(event.target).getAttribute('data-url') ?? '', '_blank');
                                else
                                    if (COMMON_DOCUMENT.querySelector('#common_profile_id').textContent==COMMON_GLOBAL.user_account_id &&
                                        event.target.parentNode.classList.contains('common_profile_detail_list_app_delete')){
                                            await commonUserAccountAppDelete(null, 
                                                                    COMMON_DOCUMENT.querySelector('#common_profile_id').textContent,
                                                                    Number(commonMiscElementRow(event.target).getAttribute('data-app_id')),
                                                                    () => { 
                                                                        commonComponentRemove('common_dialogue_message');
                                                                        commonUserAccountAppDelete(1, 
                                                                                                COMMON_DOCUMENT.querySelector('#common_profile_id').textContent, 
                                                                                                Number(commonMiscElementRow(event.target).getAttribute('data-app_id')), 
                                                                                                null);
                                                                    });
                                    }
                            }
                            break;
                        }
                        //broadcast
                        case 'common_broadcast_close':{
                            commonComponentRemove('common_broadcast');
                            break;
                        }
                        //markdown show/hide details
                        case (event.target.classList.contains('common_markdown_table_row_master_method')||event.target.classList.contains('common_markdown_table_row_master_path'))?event_target_id:null:{
                            if (commonMiscElementRow(event.target, 'common_markdown_table_row').querySelector('.common_markdown_table_row_detail_master')?.classList?.contains('show'))
                                commonMiscElementRow(event.target, 'common_markdown_table_row').querySelector('.common_markdown_table_row_detail_master')?.classList?.remove('show');
                            else
                                commonMiscElementRow(event.target, 'common_markdown_table_row').querySelector('.common_markdown_table_row_detail_master')?.classList?.add('show');
                            break;
                        }
                        //module leaflet
                        case 'common_module_leaflet_search_icon':{
                            COMMON_DOCUMENT.querySelector('#common_module_leaflet_search_input').focus();
                            COMMON_DOCUMENT.querySelector('#common_module_leaflet_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                            break;
                        }
                        case 'common_module_leaflet_control_search_button':{
                            COMMON_GLOBAL.moduleLeaflet.methods.eventClickControlSearch(COMMON_GLOBAL.user_locale);
                            break;
                        }
                        case 'common_module_leaflet_control_fullscreen_id':{
                            COMMON_GLOBAL.moduleLeaflet.methods.eventClickControlFullscreen();
                            break;
                        }
                        case 'common_module_leaflet_control_my_location_id':{
                            COMMON_GLOBAL.moduleLeaflet.methods.eventClickControlLocation(COMMON_GLOBAL.client_latitude, COMMON_GLOBAL.client_longitude, COMMON_GLOBAL.client_place);
                            
                            break;
                        }
                        case 'common_module_leaflet_control_layer_button':{
                            COMMON_GLOBAL.moduleLeaflet.methods.eventClickControlLayer();
                            break;
                        }
                        case 'common_module_leaflet_search_list':{
                            await COMMON_GLOBAL.moduleLeaflet.methods.eventClickSearchList(event.target);
                            break;
                        }
                        case 'common_toolbar_framework_js':
                        case 'common_toolbar_framework_vue':
                        case 'common_toolbar_framework_react':{
                            COMMON_DOCUMENT.querySelectorAll('#common_toolbar_framework .common_toolbar_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_toolbar_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_toolbar_selected');
                            break;
                        }    
                        //dialogue lov
                        case event.target.classList.contains('common_list_lov_click') && event.target.getAttribute('data-lov')?event_target_id:'':{
                            commonLovEvent(event, event.target.getAttribute('data-lov'));
                            break;
                        }
                        case 'common_lov_search_icon':{
                            commonLovFilter(COMMON_DOCUMENT.querySelector('#common_lov_search_input').textContent);
                            break;
                        }
                        case 'common_lov_close':{
                            commonLovClose();
                            break;
                        }
                        case 'common_lov_list':{
                            COMMON_DOCUMENT.querySelector('#common_lov_list')['data-function'](event);
                            break;
                        }
                        //markdown document tags
                        case event.target.classList.contains('common_markdown_image')?event_target_id:'':{
                            if (event.target.getAttribute('data-url'))
                                commonComponentRender({
                                    mountDiv:   'common_window_info',
                                    data:       {
                                                //show IMAGE type 0 
                                                info:0,
                                                url:event.target.getAttribute('data-url'),
                                                content_type:null, 
                                                iframe_content:null
                                                },
                                    methods:    {commonWindowSetTimeout:commonWindowSetTimeout},
                                    path:       '/common/component/common_window_info.js'});
                            break;
                        }        
                        default:{
                            if (event.target.classList.contains('leaflet-control-zoom-in') || event.target.parentNode.classList.contains('leaflet-control-zoom-in')){
                                COMMON_GLOBAL.moduleLeaflet.methods.eventClickControlZoomIn();
                            }
                            if (event.target.classList.contains('leaflet-control-zoom-out') || event.target.parentNode.classList.contains('leaflet-control-zoom-out')){
                                COMMON_GLOBAL.moduleLeaflet.methods.eventClickControlZoomOut();
                            }
                            break;
                        }
                    }
                }   
                break;
            }
            case 'keyup':{
                if (event.target.classList.contains('common_password')){   
                    COMMON_DOCUMENT.querySelector(`#${event.target.id}_mask`).textContent = 
                        event.target.textContent.replace(event.target.textContent, '*'.repeat(commonMiscLengthWithoutDiacrites(event.target.textContent)));
                }
                else
                    switch (event.target.id){
                        case 'common_dialogue_iam_start_forgot_email':{
                            if (event.code === 'Enter') {
                                event.preventDefault();
                                await commonUserForgot().then(()=>{
                                    //unfocus
                                    COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_forgot_email').blur();
                                });
                            }
                            break;
                        }
                        case 'common_profile_search_input':{
                            commonMiscListKeyEvent(event, 'profile', commonProfileShow);
                            break;
                        }        
                        case 'common_lov_search_input':{
                            commonMiscListKeyEvent(event, 'lov');
                            break;
                        }
                        //dialogue verify
                        case 'common_dialogue_iam_verify_verification_char1':
                        case 'common_dialogue_iam_verify_verification_char2':
                        case 'common_dialogue_iam_verify_verification_char3':
                        case 'common_dialogue_iam_verify_verification_char4':
                        case 'common_dialogue_iam_verify_verification_char5':{
                            commonUserVerifyCheckInput( COMMON_DOCUMENT.querySelector(`#${event.target.id}`), 
                                                            'common_dialogue_iam_verify_verification_char' + (Number(event.target.id.substring(event.target.id.length-1))+1));
                            break;
                        }
                        case 'common_dialogue_iam_verify_verification_char6':{
                            commonUserVerifyCheckInput(COMMON_DOCUMENT.querySelector(`#${event.target.id}`), '');
                            break;
                        }
                        //module leaflet
                        case 'common_module_leaflet_search_input':{
                            commonMiscTypewatch(commonMiscListKeyEvent, event, 'module_leaflet', event.target['data-function']); 
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
                if (commonTextEditingDisabled() &&
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
 * @name commonEventCopyPasteCutDisable
 * @description Disable copy cut paste
 * @function
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
 const commonEventCopyPasteCutDisable = event => {
    if (commonTextEditingDisabled()){
        if(event.target.nodeName !='SELECT'){
            event.preventDefault();
            event.target.focus();
        }
    }
    else{
        if (event.type=='paste'){
            event.preventDefault();
            event.target.textContent = event.clipboardData.getData('Text');
        }
    }
};
/**
 * @name commonEventInputDisable
 * @description Disable common input textediting
 * @function
 * @param {import('../../../common_types.js').CommonAppEvent} event 
 * @returns {void}
 */
const commonEventInputDisable = event => {
    if (commonTextEditingDisabled())
        if (event.target.classList.contains('common_input')){
            event.preventDefault();
            event.target.focus();
        }
};
/**
 * @name commonEventCommonAdd
 * @description Adds common events for all apps
 * @function
 * @returns {void}
 */
const commonEventCommonAdd = () => {

    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('copy', commonEventCopyPasteCutDisable, false);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('paste', commonEventCopyPasteCutDisable, false);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('cut', commonEventCopyPasteCutDisable, false);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('mousedown', commonEventCopyPasteCutDisable, false);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener('touchstart', commonEventInputDisable, false);

};
/**
 * @name commonEventCommonRemove
 * @description Remove common events for all apps
 * @function
 * @returns {void}
 */
const commonEventCommonRemove = () => {

    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('copy', commonEventCopyPasteCutDisable);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('paste', commonEventCopyPasteCutDisable);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('cut', commonEventCopyPasteCutDisable);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('mousedown', commonEventCopyPasteCutDisable);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).removeEventListener('touchstart', commonEventInputDisable);

};
/**
 * @name 
 * 
 * @description Set app service parameters
 * @function
 * @param {*} parameters 
 * @returns {void}
 */
const commonInitParametersInfoSet = parameters => {
    //app info
    COMMON_GLOBAL.common_app_id= parseInt(parameters.common_app_id);
    COMMON_GLOBAL.admin_app_id= parseInt(parameters.admin_app_id);
    COMMON_GLOBAL.app_id = parameters.app_id;
    COMMON_GLOBAL.app_logo = parameters.app_logo;
   
    //rest 
    COMMON_GLOBAL.rest_resource_bff = parameters.rest_resource_bff;

    //client credentials
    COMMON_GLOBAL.token_dt = parameters.app_idtoken;

    //admin
    COMMON_GLOBAL.iam_user_id = null;
    COMMON_GLOBAL.iam_user_name = null;
    COMMON_GLOBAL.admin_only = parameters.admin_only;
    COMMON_GLOBAL.admin_first_time = parameters.first_time;

    //user info
    COMMON_GLOBAL.user_identity_provider_id=null;
    COMMON_GLOBAL.user_account_id = null;
    
    //client info
    COMMON_GLOBAL.client_latitude  = parameters.client_latitude;
    COMMON_GLOBAL.client_longitude = parameters.client_longitude;
    COMMON_GLOBAL.client_place     = parameters.client_place;
    COMMON_GLOBAL.client_timezone  = parameters.client_timezone==''?null:parameters.client_timezone;
    
    if (COMMON_GLOBAL.admin_only==0){
        commonUserPreferencesGlobalSetDefault('LOCALE');
        commonUserPreferencesGlobalSetDefault('TIMEZONE');
        commonUserPreferencesGlobalSetDefault('DIRECTION');
        commonUserPreferencesGlobalSetDefault('ARABIC_SCRIPT');
    }

    COMMON_GLOBAL.user_locale                = parameters.locale;
    COMMON_GLOBAL.user_timezone              = parameters.client_timezone ?? COMMON_WINDOW.Intl.DateTimeFormat().resolvedOptions().timeZone;
    COMMON_GLOBAL.user_direction             = '';
    COMMON_GLOBAL.user_arabic_script         = '';  
};
/**
 * @name commonInitParametersAppSet
 * @description Set app parameters
 *              Set common parameters and common app parameters 
 * @function
 * @param {import('../../../common_types.js').commonInitAppParameters['APP']} app_parameters 
 * @param {import('../../../common_types.js').commonInitAppParameters['COMMON']} common_parameters 
 * @returns {void}
 */
const commonInitParametersAppSet = (app_parameters, common_parameters) => {
    COMMON_GLOBAL.app_framework = parseInt(common_parameters.common_app_framework.value);
    COMMON_GLOBAL.app_framework_messages = parseInt(common_parameters.common_app_framework_messages.value);
    COMMON_GLOBAL.app_rest_api_version = parseInt(common_parameters.common_app_rest_api_version.value);

    COMMON_GLOBAL.info_link_policy_name = common_parameters.common_info_link_policy_name.value;
    COMMON_GLOBAL.info_link_policy_url = common_parameters.common_info_link_policy_url.value;
    COMMON_GLOBAL.info_link_disclaimer_name = common_parameters.common_info_link_disclaimer_name.value;
    COMMON_GLOBAL.info_link_disclaimer_url = common_parameters.common_info_link_disclaimer_url.value;
    COMMON_GLOBAL.info_link_terms_name = common_parameters.common_info_link_terms_name.value;
    COMMON_GLOBAL.info_link_terms_url = common_parameters.common_info_link_terms_url.value;
    COMMON_GLOBAL.info_link_about_name = common_parameters.common_info_link_about_name.value;
    COMMON_GLOBAL.info_link_about_url = common_parameters.common_info_link_about_url.value;

    COMMON_GLOBAL.image_file_allowed_type1 = common_parameters.common_image_file_allowed_type1.value;
    COMMON_GLOBAL.image_file_allowed_type2 = common_parameters.common_image_file_allowed_type2.value;
    COMMON_GLOBAL.image_file_allowed_type3 = common_parameters.common_image_file_allowed_type3.value;
    COMMON_GLOBAL.image_file_allowed_type4 = common_parameters.common_image_file_allowed_type4.value;
    COMMON_GLOBAL.image_file_allowed_type5 = common_parameters.common_image_file_allowed_type5.value;
    COMMON_GLOBAL.image_file_mime_type = common_parameters.common_image_file_mime_type.value;
    COMMON_GLOBAL.image_file_max_size = parseInt(common_parameters.common_image_file_max_size.value);
    COMMON_GLOBAL.image_avatar_width = parseInt(common_parameters.common_image_avatar_width.value);
    COMMON_GLOBAL.image_avatar_height = parseInt(common_parameters.common_image_avatar_height.value);
    
    COMMON_GLOBAL.app_email = app_parameters.app_email.value;
    COMMON_GLOBAL.app_copyright = app_parameters.app_copyright.value;
    COMMON_GLOBAL.app_link_url = app_parameters.app_link_url.value;
    COMMON_GLOBAL.app_link_title = app_parameters.app_link_title.value;
    COMMON_GLOBAL.app_text_edit = app_parameters.app_text_edit.value;
};
/**
 * @name commonFrameworkMount
 * @description Mount app using Vue or React framework
 *              Component is mounted as pure HTML without events
 *              App component is mounted with supported events on app root for Vue
 *              App component is mounted without events on app root for React
 *              Template is already rendered HTML
 *              Mounting the rendered template means parsing HTML according to Vue or React standards
 *              that validate that the component renders valid HTML
 * @function
 * @param {2|3} framework
 * @param {string} template
 * @param {{}} methods
 * @param {string} mount_div
 * @param {boolean} component
 * @returns {Promise.<void>}
 */
const commonFrameworkMount = async (framework, template, methods,mount_div, component) =>{
    switch (framework){
        case 2:{
            //Vue
            /**@type {import('../../../common_types.js').CommonModuleVue} */
            const Vue = await import(commonMiscImportmap('Vue'));

            //Use tempmount div to be able to return pure HTML without extra events
            //since event delegation is used
            COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML ='<div id=\'tempmount\'></div>'; 

            //mount the app or component
            Vue.createApp({
                data(){return {};},
                template: template,
                methods:methods
            }).mount('#tempmount');

            if (component){
                //replace mount div with tempmount div without events
                COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML = COMMON_DOCUMENT.querySelector('#tempmount').innerHTML;
            }
            else{
                //replace mount div with tempmount element with events
                COMMON_DOCUMENT.querySelector(`#${mount_div}`).replaceWith(COMMON_DOCUMENT.querySelector('#tempmount >div'));
            }
            break;
        }
        case 3:{
            //React
            /**@type {import('../../../common_types.js').CommonModuleReact} */
            const React = await import(commonMiscImportmap('React')).then(module=>module.React);
            /**@type {import('../../../common_types.js').CommonModuleReactDOM} */
            const ReactDOM = await import(commonMiscImportmap('ReactDOM')).then(module=>module.ReactDOM);

            //convert HTML template to React component
            const div_template = COMMON_DOCUMENT.createElement('div');
            div_template.innerHTML = template;
            const component = React.createElement(div_template.nodeName.toLowerCase(), 
                                                { id: div_template.id, className: div_template.className}, 
                                                commonFrameworkHtml2ReactComponent(React.createElement, div_template.children));

            COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML ='<div id=\'tempmount\'></div>'; 
            const application = ReactDOM.createRoot(COMMON_DOCUMENT.querySelector(`#${mount_div} #tempmount`));
            application.render( component);
            await new Promise ((resolve)=>{commonWindowSetTimeout(()=> resolve(null), 200);});
            //React is only used as a parser of HTML and all Reacts events are removed by removing tempmount div
            //Mount template HTML
            COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML = template;

            break;
        }
    }
};
/**
 * @name commonFrameworkClean
 * @description Removes objects created by frameworks
 * @function
 * @returns {void}
 */
const commonFrameworkClean = () =>{
    //remove Reacts objects
    delete COMMON_WINDOW.ReactDOM;
    delete COMMON_WINDOW.React;

    //remove react key
    for (const key of Object.keys(COMMON_DOCUMENT)){
        if (key.startsWith('_react')){
            /**@ts-ignore */
            delete COMMON_DOCUMENT[key];
        }
    }
    //React events are not created, just reset variable when switching framework
    COMMON_GLOBAL.app_eventListeners.REACT = [];
    //remove Vue objects
    COMMON_GLOBAL.app_eventListeners.VUE = [];
    delete COMMON_WINDOW.__VUE_DEVTOOLS_HOOK_REPLAY__;
    delete COMMON_WINDOW.__VUE_HMR_RUNTIME__;
    delete COMMON_WINDOW.__VUE__;
    const app_root_element = COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`);
    if (COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}_vue`))
        app_root_element.textContent = COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}_vue`).textContent;
    app_root_element.removeAttribute('data-v-app');
    delete app_root_element.__vue_app_;
    delete app_root_element.__vue_node;

    //remove all attributes except id
    Object.entries(app_root_element.attributes).forEach((/**@type{*}*/attribute)=>attribute[1].name=='id'?null:app_root_element.removeAttribute(attribute[1].name));
};
/**
 * @name commonFrameworkSet
 * @description Sets framework and uses given list of event functions
 * @function
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
const commonFrameworkSet = async (framework, events) => {
    const app_root_element = COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`);
    const app_element = COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_div}`);
    const common_app_element = COMMON_DOCUMENT.querySelector('#common_app');

    //get all ellements with data-function
    /**@type{{id:string,element_function:function}[]} */
    const data_function = [];
    COMMON_DOCUMENT.querySelectorAll(`#${COMMON_GLOBAL.app_root} div`).forEach((/**@type{HTMLElement}*/element) =>{
        /**@ts-ignore */
        if (element['data-function']){
            /**@ts-ignore */
            data_function.push({id:element.id, element_function:element['data-function']});
        }
    });
    //save Leaflet containers with special event management and saved objects on elements if any Leaflet container used
    const leaflet_containers = COMMON_DOCUMENT.querySelectorAll('.leaflet-container');

    //remove common listeners
    commonEventCommonRemove();
    COMMON_GLOBAL.app_eventListeners.OTHER = [];

    //remove all listeners in app and app root divs including all objects saved on elements
    app_element.replaceWith(app_element.cloneNode(true));
    app_root_element.replaceWith(app_root_element.cloneNode(true));
    
    commonFrameworkClean();

    //set default function if anyone missing
    events.Change?null:events.Change = ((/**@type{import('../../../common_types.js').CommonAppEvent}*/event)=>commonEvent('change', event));
    events.Click?null:events.Click = ((/**@type{import('../../../common_types.js').CommonAppEvent}*/event)=>commonEvent('click', event));
    events.Focus?null:events.Focus = ((/**@type{import('../../../common_types.js').CommonAppEvent}*/event)=>commonEvent('focus', event));
    events.Input?null:events.Input = ((/**@type{import('../../../common_types.js').CommonAppEvent}*/event)=>commonEvent('input', event));
    events.KeyDown?null:events.KeyDown = ((/**@type{import('../../../common_types.js').CommonAppEvent}*/event)=>commonEvent('keydown', event));
    events.KeyUp?null:events.KeyUp = ((/**@type{import('../../../common_types.js').CommonAppEvent}*/event)=>commonEvent('keyup', event));

    events.Other?null:null;

    //app can override framework or use default javascript if Vue or React is not set
    if (framework ?? COMMON_GLOBAL.app_framework !=COMMON_GLOBAL.app_framework)
        COMMON_GLOBAL.app_framework = framework;
    switch (framework ?? COMMON_GLOBAL.app_framework){
        case 2:{
            //Vue
            const template = `  <div id='${COMMON_GLOBAL.app_root}'
                                    @change ='CommonAppEventChange($event)'
                                    @click  ='CommonAppEventClick($event)'
                                    @input  ='CommonAppEventInput($event)' 
                                    @keydown='CommonAppEventKeyDown($event)' 
                                    @keyup  ='CommonAppEventKeyUp($event)'>
                                    ${app_element.outerHTML}
                                    ${common_app_element.outerHTML}
                                </div>`;
            const methods = {
                                CommonAppEventChange: (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
                                    events.Change?events.Change(event):null;
                                },
                                CommonAppEventClick: (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
                                    events.Click?events.Click(event):null;
                                },
                                CommonAppEventInput: (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
                                    events.Input?events.Input(event):null;
                                },
                                CommonAppEventKeyDown: (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
                                    events.KeyDown?events.KeyDown(event):null;
                                },
                                CommonAppEventKeyUp: (/**@type{import('../../../common_types.js').CommonAppEvent}*/event) => {
                                    events.KeyUp?events.KeyUp(event):null;
                                }
                            };
            //App events are used on Vue events using event delegation on app root
            await commonFrameworkMount(2, template, methods, COMMON_GLOBAL.app_root, false);
            //Does not work in Vue
            events.Focus();
            break;
        }
        case 3:{
            //React
            const template = `  ${app_element.outerHTML}
                                ${common_app_element.outerHTML}`;
            const methods = {};
            //App events are not supported and not used on app root and are managed in event delegation
            await commonFrameworkMount(3, template, methods, COMMON_GLOBAL.app_root, false);
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
        COMMON_DOCUMENT.querySelectorAll('.leaflet-container')[index].replaceWith(leaflet_container);
        index++;
    }
    //update all elements with data-function since copying outerHTML does not include data-function
    data_function.forEach(element =>COMMON_DOCUMENT.querySelector(`#${element.id}`)['data-function'] = element.element_function);
    //add common events for all apps
    commonEventCommonAdd();
};
/**
 * @name setUserAgentAttributes
 * @description Set useragent attributes
 * @function
 * @returns {void}
 */
 const setUserAgentAttributes = () => {
    if (COMMON_WINDOW.navigator.userAgent.toLowerCase().indexOf('firefox')>-1)
        COMMON_DOCUMENT.querySelector(':root').style.setProperty('--common_app_css_useragent_fix_margin_top', '-5px');
 };
/**
 * @name custom_framework
 * @description Set custom framework functionality overriding console messages and save info about events created
 * @function
 * @returns {void}
 */
const custom_framework = () => {
    COMMON_GLOBAL.app_eventListeners.original = COMMON_DOCUMENT.addEventListener;
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
     * Custom common event to keep track of framework events so they can be removed when necessary
     * No event is created for React
     * Disables test of passive listener that tries to create test event on windows objects that
     * affects touch events on mobile and on scroll divs inside third party divs
     * Leaflet tries to create 'testPassiveEventSupport' on window object
     * React tries to create 'test' on windows object
     * @param {string} scope
     * @param {*} object
     * @param {*[]} eventParameters
     */
    const customEventCommon = (scope, object, eventParameters) => {
        if (eventParameters[0].indexOf('test')>-1)
            throw 'test of passive listeners not allowed';
        const eventmodule = module(Error().stack);
        COMMON_GLOBAL.app_eventListeners[eventmodule]
            /**@ts-ignore */
            .push([scope, object, eventParameters[0], eventParameters[1], eventParameters[2]]);
        if (eventmodule!='REACT')
            COMMON_GLOBAL.app_eventListeners.original.apply(object, eventParameters);
    };
    /**
     * Custom function used to replace default addEventListener function for Window
     * Window events are created on COMMON_DOCUMENT
     * Using funtion declaration here to support arguments
     * @param  {...any} eventParameters 
     */
    function customEventWindow (...eventParameters){
        customEventCommon('WINDOW', COMMON_DOCUMENT, eventParameters);
    }
    /**
     * Custom function used to replace default addEventListener function for Document
     * Document events are created on COMMON_DOCUMENT
     * Using funtion declaration here to support arguments
     * @param  {...any} eventParameters 
     */
    function customEventDocument (...eventParameters) {
        customEventCommon('DOCUMENT', COMMON_DOCUMENT, eventParameters);
    }
    /**
     * Custom function used to replace default addEventListener function for HTMLElement
     * Using funtion declaration here to support arguments
     * @param  {...any} eventParameters 
     */
    function customEventHTMLElement (...eventParameters) {
        customEventCommon('HTMLELEMENT', 
                            /**@ts-ignore */
                            this, 
                            eventParameters);
    }

    //set custom functions on both window, document and HTMLElement level
    COMMON_WINDOW.addEventListener = customEventWindow;
    COMMON_DOCUMENT.addEventListener = customEventDocument;
    HTMLElement.prototype.addEventListener = customEventHTMLElement;

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
    COMMON_WINDOW.console.warn = console_warn;
    //React uses console.info and error, show or hide from any framework
    COMMON_WINDOW.console.info = console_info;
    COMMON_WINDOW.console.error = console_error;
};
/**
 * @name commonInit
 * @description Init common
 * @function
 * @param {string} parameters 
 * @returns {Promise.<import('../../../common_types.js').commonInitAppParameters>}
 */
const commonInit = async (parameters) => {
    /**
     * Encoded parameters
     * @type {import('../../../common_types.js').commonInitAppParameters}
     */
    const decoded_parameters = JSON.parse(commonWindowFromBase64(parameters));
    setUserAgentAttributes();
    custom_framework();
    if (COMMON_GLOBAL.app_id ==null){
        commonInitParametersInfoSet(decoded_parameters.INFO);
        commonInitParametersAppSet(decoded_parameters.APP, decoded_parameters.COMMON);
        commonEventCommonAdd();
    }
    await commonSocketConnectOnline();
    commonWindowServiceWorker();
    return decoded_parameters;
};
export{/* GLOBALS*/
       COMMON_GLOBAL, 
       COMMON_ICONS,
       /* MISC */
       commonMiscDbAppSettingsGet,
       commonMiscElementId, 
       commonMiscElementRow, 
       commonMiscElementListTitle, 
       commonMiscFormatJsonDate,
       commonMiscImageConvert,
       commonMiscImageShow, 
       commonMiscInputControl,
       commonMiscImportmap,
       commonMiscListKeyEvent,
       commonMiscMobile,
       commonMiscPreferencesUpdateBodyClassFromPreferences,
       commonMiscPreferencesPostMount,
       commonMiscRoundOff, 
       commonMiscSelectCurrentValueSet,
       commonMiscThemeDefaultList, 
       commonMiscThemeUpdateFromBody,
       commonMiscTimezoneDate, 
       commonMiscTypewatch,      
       commonMiscShowDateUpdate,
       /**WINDOW OBJECT */
       commonWindowDocumentFrame,
       commonWindowFromBase64, 
       commonWindowHostname,
       commonWindowLocationPathname,
       commonWindowLocationReload,
       commonWindowNavigatorLocale,
       commonWindowOpen,
       commonWindowPrompt,
       commonWindowServiceWorker,
       commonWindowSetTimeout,
       commonWindowToBase64, 
       commonWindowUserAgentPlatform,
       commonWindowWait,
       /* COMPONENTS */
       commonComponentRemove,
       commonComponentRender,
       /* FRAMEWORK */
       commonFrameworkSet,
       /* DIALOGUE */
       commonDialogueShow, 
       /* LOV */
       commonLovAction,
       commonLovEvent, 
       commonLovClose, 
       commonLovShow,
       /* MESSAGE*/
       commonMessageShow,
       commonMesssageNotAuthorized,
       /* PROFILE */
       commonProfileDetail, 
       commonProfileFollowLike,
       commonProfileShow,
       commonProfileStat, 
       commonProfileUpdateStat, 
       /* USER  */
       commonUserDelete, 
       commonUserFunction,
       commonUserLogin, 
       commonUserLogout,
       commonUserSessionCountdown, 
       commonUserSignup, 
       commonUserUpdate, 
       commonUserUpdatePassword,
       commonUserVerifyCheckInput, 
       /* MODULE LEAFLET  */
       commonModuleLeafletInit, 
       /* MODULE EASY.QRCODE */
       commonModuleEasyQRCODECreate,
       /*FFB */
       commonFFB,
       /* SERVICE SOCKET */
       commonSocketBroadcastShow, 
       commonSocketConnectOnline,
       commonSocketConnectOnlineCheck,
       commonSocketMaintenanceShow, 
       /* MICROSERVICE GEOLOCATION */
       commonMicroserviceGeolocationIp,
       commonMicroserviceGeolocationPlace,
       /* EVENT */
       commonEvent,
       /* INIT */
       commonInit};