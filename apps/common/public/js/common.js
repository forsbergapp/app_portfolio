/**
 * @module apps/common/common
 */

/** 
 * @import { common} from '../../../common_types.js' 
 */

/**@type{common['COMMON_WINDOW']} */
const COMMON_WINDOW = window;

/**@type{common['COMMON_DOCUMENT']} */
const COMMON_DOCUMENT = document;

/**@type{common['CommonGlobal']} */
const COMMON_GLOBAL = {
    app_id:0,
    app_logo:null,
    app_copyright:null,
    app_link_url:null,
    app_link_title:null,
    app_text_edit:null,
    app_common_app_id:0,
    app_admin_app_id:1,
    app_start_app_id:0,
    app_toolbar_button_start:1,
    app_toolbar_button_framework:1,
    app_framework:1,
    app_framework_messages:1,
    app_rest_api_version:null,
    app_rest_api_basepath:null,
    app_root:'app_root',
    app_div:'app',
    app_console:{warn:COMMON_WINDOW.console.warn, info:COMMON_WINDOW.console.info, error:COMMON_WINDOW.console.error},
    app_eventListeners:{original: HTMLElement.prototype.addEventListener, REACT:[], VUE:[], OTHER:[]},
    app_function_session_expired:null,
    app_function_sse:null,
    app_fonts:[],
    app_content_type_json: '',
    app_content_type_html: '',
    app_content_type_sse: '',
    app_fonts_loaded:[],
    app_request_tries: 5,
    app_requesttimeout_seconds:5,
    app_requesttimeout_admin_minutes:60,
    app_typewatch:[],
    app_metadata:{  events:{click:null,
                            change:null,
                            keydown:null,
                            keyup:null,
                            focusin:null,
                            input:null,
                            mousedown:null,
                            mouseup:null,
                            mousemove:null,
                            mouseleave:null,
                            wheel:null,
                            touchstart:null,
                            touchend:null,
                            touchcancel:null,
                            touchmove:null,
                            copy:null,
                            paste:null,
                            cut:null
    },
                    lifeCycle:{
                        onMounted:()=>null
                    }
                },
    info_link_policy_name:null,
    info_link_disclaimer_name:null,
    info_link_terms_name:null,
    info_link_policy_url:null,
    info_link_disclaimer_url:null,
    info_link_terms_url:null,
    iam_user_app_id:null,
    iam_user_id:null,
    iam_user_username:null,
    iam_user_avatar:null,
    admin_first_time:null,
    admin_only:null,
    x:{encrypt: ()=>'', decrypt: ()=>''},
    client_latitude:'',
    client_longitude:'',
    client_place:'',
    client_timezone:'',
    token_dt:null,
    token_at:null,
    token_admin_at:null,
    token_exp:null,
    token_iat:null,
    token_external:null,
    rest_resource_bff:null,
    user_locale:'',
    user_timezone:'',
    user_direction:'',
    user_arabic_script:'',
    user_custom:{},
    resource_import:[],
    component_import:[],
    component:{}
};
Object.seal(COMMON_GLOBAL);

                    
/**
 * @description Get value for given global key
 * @param {keyof common['CommonGlobal']} key
 * @returns {*}
 */
const commonGlobalGet = key =>COMMON_GLOBAL[key];
/**
 * @description Set value for given global key
 * @param {keyof common['CommonGlobal']} key
 * @param {*} value
 * @returns {*}
 */
const commonGlobalSet = (key, value) =>(key in COMMON_GLOBAL)?Object.assign(COMMON_GLOBAL, {[key]:value}):null;

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
 * @returns {HTMLElement|null} 
 */
const commonMiscElementListTitle = element => element.classList.contains('list_title')?element:(element.parentNode.classList.contains('list_title')?element.parentNode:null);
/**
 * @name commonMiscFormatJsonDate
 * @description Format JSON date with user timezone
 * @function
 * @param {string} db_date 
 * @param {'SHORT'|'NORMAL'|'LONG'|null} format 
 * @returns {string|null}
 */
const commonMiscFormatJsonDate = (db_date, format=null) => {
    if (db_date == null)
        return null;
    else {
        //Json returns UTC time
        //in ISO 8601 format
        //JSON returns format 2020-08-08T05:15:28Z
        //"yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
        /**@type{COMMON_WINDOW['Intl']['DateTimeFormatOptions']} */ 
        let options;
        switch (format){
            case 'SHORT':{
                options = {
                    timeZone: COMMON_GLOBAL.user_timezone,
                    year: 'numeric',
                    month: 'long'
                };
                break;
            }
            case 'LONG':{
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
                break;
            }
            default:
            case 'NORMAL':{
                options = {
                    timeZone: COMMON_GLOBAL.user_timezone,
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                };
                break;
            }
        }
            
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
 * @name commonMiscImport
 * @description fetches javascript module to use in import statement
 * @function
 * @param {string} url
 * @param {string|null} content
 * @returns {Promise.<*>}
 */
const commonMiscImport = async (url, content=null) =>{
    const app_id = url.startsWith('/common')?COMMON_GLOBAL.app_common_app_id:COMMON_GLOBAL.app_id;
    const module = COMMON_GLOBAL.component_import.filter(module=>module.url==url && module.app_id == app_id)[0]?.component;
    if (module)
        return import(module);    
    else{
        COMMON_GLOBAL.component_import.push(
                /*@ts-ignore*/
                {
                    app_id:app_id,
                    url:url,
                    component:content?
                                URL.createObjectURL(new Blob ([content], {type: 'text/javascript'})):
                                    await commonFFB({   path: '/app-resource/' + url.replaceAll('/','~'), 
                                                        query:`content_type=${'text/javascript'}&IAM_data_app_id=${app_id}`, 
                                                        method:'GET', 
                                                        response_type:'TEXT',
                                                        authorization_type:'APP_ID'})
                                            .then(module=>URL.createObjectURL(  new Blob ([JSON.parse(module).resource], {type: 'text/javascript'})))
                }); 
        return import(COMMON_GLOBAL.component_import[COMMON_GLOBAL.component_import.length-1].component);
    }
};
/**
 * @name commonMiscImportmap
 * @description Importmap that return file path for given file
 *              to solve importmap not working for some browsers
 * @function
 * @param {'React'|'ReactDOM'|'regional'|'Vue'} file
 * @returns {string}
 */
const commonMiscImportmap = file =>{
    return {
        React 		    : '/common/modules/react/react.development.js',
        ReactDOM 	    : '/common/modules/react/react-dom.development.js',
        regional  	    : '/common/modules/regional/regional.js',
        Vue 	        : '/common/modules/vue/vue.esm-browser.js'
    }[file] ??'';
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
       commonMessageShow('INFO', null, 'message_text','!');
       return false;
   }
   else
       return true;
};
/**
 * @name commonMiscListKeyEvent
 * @description List key event
 * @function
 * @param {{event:common['CommonAppEvent'],
 *          event_function:function,
 *          event_parameters:*,
 *          rows_element:string,
 *          search_input:string}} parameters
 * @returns {void}
 */
const commonMiscListKeyEvent = parameters => {
    switch (parameters.event.code){
        case 'ArrowLeft':
        case 'ArrowRight':{
            break;
        }
        case 'ArrowUp':
        case 'ArrowDown':{
            const rows = COMMON_DOCUMENT.querySelectorAll(`#${parameters.rows_element} .common_row:not(.common_row_hide)`);
            /**
             * Focus item
             * @param {HTMLElement} element 
             */
            const focus_item = (element) =>{
                element.focus();
                COMMON_DOCUMENT.querySelector(`#${parameters.search_input}`).focus();
            };
            if (Object.entries(rows).filter(row=>row[1].classList.contains('common_row_selected')).length>0){
                let i=0;
                for (const row of rows) {
                    if (row.classList.contains('common_row_selected'))
                        //if up and first or
                        //if down and last
                        if ((parameters.event.code=='ArrowUp' && i == 0)||
                            (parameters.event.code=='ArrowDown' && i == rows.length -1)){
                            if(parameters.event.code=='ArrowUp'){
                                //if the first, set the last
                                row.classList.remove ('common_row_selected');
                                rows[rows.length -1].classList.add ('common_row_selected');
                                focus_item(rows[rows.length -1]);
                            }
                            else{
                                //down
                                //if the last, set the first
                                row.classList.remove ('common_row_selected');
                                rows[0].classList.add ('common_row_selected');
                                focus_item(rows[0]);
                            }
                            break;
                        }
                        else{
                            if(parameters.event.code=='ArrowUp'){
                                //remove highlight, highlight previous
                                row.classList.remove ('common_row_selected');
                                rows[i-1].classList.add ('common_row_selected');
                                focus_item(rows[i-1]);
                            }
                            else{
                                //down
                                //remove highlight, highlight next
                                row.classList.remove ('common_row_selected');
                                rows[i+1].classList.add ('common_row_selected');
                                focus_item(rows[i+1]);
                            }
                            break;
                        }
                    i++;
                }
            }
            else{
                //no highlight found, highlight first
                rows[0].classList.add ('common_row_selected');
                focus_item(rows[0]);
            }
            break;
        }
        case 'Enter':{
            const rows = COMMON_DOCUMENT.querySelectorAll(`#${parameters.rows_element} .common_row`);
            for (const row of rows) {
                if (row.classList.contains('common_row_selected')){
                    //dispatch click event on row
                    row.click();
                    row.classList.remove ('common_row_selected');
                }
            }
            break;
        }
        default:{
            commonMiscTypewatch(parameters.event_function, parameters.event_parameters); 
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
 * @name commonMiscPrint
 * @description Prints html loading fonts using FontFace() and calls browser print() 
 * @param {string} html
 * @function 
 * @returns {Promise.<void>}
 */
const commonMiscPrint = async html => {
    COMMON_DOCUMENT.querySelector('#common_app_print').innerHTML = '<iframe/>';
    const print = COMMON_DOCUMENT.querySelector('#common_app_print iframe').contentWindow
    await print.document.open();
    await print.document.write(html);

    for (const font of COMMON_GLOBAL.app_fonts_loaded) {         
        const fontNew = new FontFace(
            font.family,
            'url(' + font.url + ')',
            font.attributes
        );  
        fontNew.load().then(()=>{
            print.document.fonts.add(fontNew);
        });
    }  
    await print.focus();

    //await delay to avoid browser render error
    await new Promise (resolve=>commonWindowSetTimeout(()=> {print.print();resolve(null);}, 100));    
    COMMON_DOCUMENT.querySelector('#common_app_print').textContent='';
};
/**
 * @name commonMiscResourceFetch
 * @description fetches resources and updates attributes on element or return result if no element found
 *              'text/javascript' is used here for a link, not import()
 * @function
 * @param {string} url
 * @param {HTMLElement|null} element
 * @param { 'image/png'|'image/webp'|
 *          'text/javascript'|
 *          'text/css'} content_type,
 * @param {string|null} content
 * @returns {Promise.<string|void>}
 */
const commonMiscResourceFetch = async (url,element, content_type, content=null )=>{
    const app_id = url.startsWith('/common')?COMMON_GLOBAL.app_common_app_id:COMMON_GLOBAL.app_id;
    if (element && content_type.startsWith('image')){
        /**@ts-ignore */
        element.alt=' '; 
        element.removeAttribute('src');
    }   
    /**
    * @returns{Promise.<*>}
    */
    const getUrl = async ()=>{        
        const resource = COMMON_GLOBAL.resource_import.filter(resource=>resource.url==url && resource.app_id == app_id)[0]?.content;
        if (resource) 
            return resource;
        else{
            content?
                /**@ts-ignore */
                COMMON_GLOBAL.resource_import.push({
                                app_id:app_id,
                                url:url,
                                content:URL.createObjectURL(new Blob ([content], {type: content_type})),
                                content_type:content_type
                            }):
                    await commonFFB({   path:'/app-resource/' + url.replaceAll('/','~'), 
                                        query:`content_type=${content_type}&IAM_data_app_id=${app_id}`, 
                                        method:'GET', 
                                        //uses TEXT for images that use base64 strings and font css
                                        response_type:'TEXT',
                                        authorization_type:'APP_ID'})
                            .then(module=>
                                content_type.startsWith('image')?
                                    /**@ts-ignore */
                                    COMMON_GLOBAL.resource_import.push({
                                        app_id:app_id,
                                        url:url,
                                        content:JSON.parse(module).resource,
                                        content_type:content_type
                                    }):
                                        /**@ts-ignore */
                                        COMMON_GLOBAL.resource_import.push({
                                            app_id:app_id,
                                            url:url,
                                            content:URL.createObjectURL(  new Blob ([JSON.parse(module).resource], {type: content_type})),
                                            content_type:content_type
                                        })
                            );
            return COMMON_GLOBAL.resource_import[COMMON_GLOBAL.resource_import.length-1].content;
        }
    }; 

    if (element && content_type.startsWith('image')){
        element.style.backgroundImage = `url('${await getUrl()}')`;
        element.style.backgroundSize = 'cover';
    }
    else
        if (element && content_type.startsWith('text'))
            /**@ts-ignore */
            element.href=await getUrl();
        else{
            if (element)
                //font
                /**@ts-ignore */
                element.style.src = `url('${await getUrl()}')`;
            else
                return await getUrl();
        }

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
    if (COMMON_GLOBAL.app_typewatch.filter(row=>row==function_name.name).length==0){
        /**@ts-ignore */
        COMMON_GLOBAL.app_typewatch.push(function_name.name);
        let type_delay=400;
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
            /**@ts-ignore */
            COMMON_GLOBAL.app_typewatch = COMMON_GLOBAL.app_typewatch.filter(row=>row!=function_name.name);
        }, type_delay);
    }
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
 * 
 * @name commonMiscSecondsToTime
 * @description Seconds to time string
 * @function
 * @param {number} seconds 
 * @returns {string}
 */
const commonMiscSecondsToTime = (seconds) => {
    let ut_sec = seconds;
    let ut_min = ut_sec/60;
    let ut_hour = ut_min/60;
    
    ut_sec = Math.floor(ut_sec);
    ut_min = Math.floor(ut_min);
    ut_hour = Math.floor(ut_hour);
    
    ut_hour = ut_hour%60;
    ut_min = ut_min%60;
    ut_sec = ut_sec%60;
    return `${ut_hour} Hour(s) ${ut_min} minute(s) ${ut_sec} second(s)`;
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
 * @name commonMiscLoadFont
 * @description loads a font using app resource fetch and FontFace
 * @function
 * @param {{uuid:string,
 *          secret:string,
 *          message:string}} parameters
 */
const commonMiscLoadFont = parameters => {
    const fontData = JSON.parse(parameters.message);
    commonFFB({ path:               '/app-resource/' + fontData.url.replaceAll('/','~'),
                query:              'content_type=font/woff2&IAM_data_app_id=0', 
                method:             'GET',
                authorization_type: 'APP_ID'})
    .then((/**@type{string}*/result)=> {
        const fontResult = JSON.parse(result).resource;
        /**
         * @param {string} css
         */
        const cssJSON = css =>'{' + css
                                .replace('font-face','')
                                .replace('url(','')
                                .replaceAll(')','')
                                .replace('format(',';format:')
                                .split(';')
                                .filter(row=>row.indexOf('}')==-1)
                                .map(row=>row.replace('{','').split(':')
                                            .map(col=>col.indexOf('"')==-1?
                                                        '"' + col.trimStart() + '"':
                                                            col.trimStart()).join(':'))
                                .join(',') + '}';
        //load font url where uuid is used
        for (const fontFaceCSS of (COMMON_GLOBAL.app_fonts ??[])
                                    .filter((row, index)=>index>0)
                                    /**@ts-ignore */
                                    .filter(row=>row.indexOf(fontData.uuid)>-1)
                                    /**@ts-ignore */
                                    .map(row=>row.substring(0, row.indexOf('}')+1))){
            const attributes =  {
                                style:          JSON.parse(cssJSON(fontFaceCSS))['font-style'],
                                weight:         JSON.parse(cssJSON(fontFaceCSS))['font-weight'],
                                ...(JSON.parse(cssJSON(fontFaceCSS))['font-stretch'] && {'stretch': JSON.parse(cssJSON(fontFaceCSS))['font-stretch']}),
                                display:        JSON.parse(cssJSON(fontFaceCSS))['font-display'],
                                ...(JSON.parse(cssJSON(fontFaceCSS))['unicode-range'] && {'unicodeRange': JSON.parse(cssJSON(fontFaceCSS))['unicode-range']})
                                };
            const fontLoad = {family:JSON.parse(cssJSON(fontFaceCSS))['font-family'],
                                url:   fontResult,
                                attributes:attributes
                                };
            COMMON_GLOBAL.app_fonts_loaded.push(fontLoad);
            const fontNew = new FontFace(
                    fontLoad.family,
                    'url(' + fontLoad.url + ')',
                    fontLoad.attributes
                );  
            fontNew.load().then(()=>{
                /**@ts-ignore */
                document.fonts.add(fontNew);
            });
        }
    });
};
/**
 * @name commonMisCssApply
 * @description apply css
 * @function
 * @param {string} cssText
*/
const commonMiscCssApply = cssText =>{
    const css = new CSSStyleSheet();
    css.replace(cssText);
    
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];
};

/**
 * @name commonWindoGet
 * @description get window object
 * @function
 * @returns {common['COMMON_WINDOW']}
 */
const commonWindowGet = () =>COMMON_WINDOW;

/**
 * @name commonWindowFromBase64
 * @description Convert base64 containing unicode to string
 * @function
 * @param {string} str 
 * @returns {string}
 */
const commonWindowFromBase64 = str => {
    const binary_string = COMMON_WINDOW.atob(str);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
};

/**
 * @name commonWindowDocumentFrame
 * @description Returns frames document element
 * @function
 * @returns {COMMON_DOCUMENT}
 */
const commonWindowDocumentFrame = () => COMMON_WINDOW.frames.document;

/**
 * @name commonWindowNavigatorLocale
 * @description Read Navigator language
 * @function
 * @returns {string}
 */
const commonWindowNavigatorLocale = () => COMMON_WINDOW.navigator.language.toLowerCase();

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
 * @name commonWindowSetTimeout
 * @description Use SetTimout for given function and millseconds
 * @function
 * @param {function}    function_timeout
 * @param {number}      milliseconds
 * @returns {void}
 */
const commonWindowSetTimeout = (function_timeout, milliseconds) => COMMON_WINDOW.setTimeout(function_timeout, milliseconds);


/**
 * @name commonWindowToBase64
 * @description Convert string to Base64
 * @function
 * @param {string} str 
 * @aram {boolean} btoa_only
 * @returns {string}
 */
const commonWindowToBase64 = (str,btoa=false) => COMMON_WINDOW.btoa(btoa?str:COMMON_WINDOW.encodeURIComponent(str));

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
 * @name commonWindowWait
 * @description Waits given amount of milliseconds
 * @function
 * @param {number} milliseconds
 * @returns {Promise<null>}
 */
const commonWindowWait = async milliseconds => new Promise ((resolve)=>{commonWindowSetTimeout(()=> resolve(null),milliseconds);});

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
                                    //Map SVG:
                                    ['stroke-width',    'strokeWidth'],
                                    //other used SVG attributes:
                                    ['xmlns:xlink',     'xmlnsXlink'],
                                    //other attributes
                                    ['charset',         'charSet'],
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
                    //rename used css properties
                    style_object[style
                                .replace('background-image', 'backgroundImage')
                                .replace('background-color', 'backgroundColor')
                                .replace('background-size', 'backgroundSize')
                                .replace('z-index', 'zIndex')
                                .replace('margin-left', 'marginLeft')
                                .replace('margin-right', 'marginRight')
                                .replace('margin-top', 'marginTop')
                                .replace('margin-bottom', 'marginBottom')] = subelement.style[style];
                }
                props.style = {...style_object};
            }
            //replace '' with null
            props.style = props.style==''?null:props.style;
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
 * @name commonComponentMutationObserver
 * @description Tracks removed elements using MutationObserver on app root
 *              and uses Immediately Invoked Function Expression (IIFE)
 *              so only one MutationObserver is running and always on app root
 *              contains track() and untrack() methods
 * @function
 * @returns {void}
 */
const commonComponentMutationObserver = (() =>{
    /**@type{Object.<string,*>} */
    const tracked= {};
    const observer = new MutationObserver(() => {
                        Object.keys(tracked).forEach(div_id => {
                            //check if removed or empty
                            if (!COMMON_DOCUMENT.querySelector(`#${div_id}`)||COMMON_DOCUMENT.querySelector(`#${div_id}`).textContent=='') {
                                //a component can be used on different mounted divs
                                //and a component can share events to event delegation and methods
                                //remove if last shared component including methods and events
                                if (Object.keys(tracked).filter(all_div_id=>COMMON_GLOBAL.component[tracked[all_div_id].componentName]==COMMON_GLOBAL.component[tracked[div_id].componentName]).length==1)
                                    delete COMMON_GLOBAL.component[tracked[div_id].componentName];
                                //run the onUnMounted for the unmounted component
                                if (tracked[div_id].onUnmounted){
                                    tracked[div_id].onUnmounted();
                                }
                                //remove from tracked
                                delete tracked[div_id];
                            }
                        });
                    });

    observer.observe(document.body, {
        childList:true,
        subtree: true
    });

    return {
        /**
         * @name track
         * @description used by commonComponentRender to track components
         * @method
         * @param {{div:HTMLElement, componentName:string, onUnmounted:function|null|undefined}} component
         */
        track (component){
            if (component.div instanceof HTMLElement)
                tracked[component.div.id] = { componentName:component.componentName, 
                                              onUnmounted:component.onUnmounted};
            
        },
        /**
         * @name untrack
         * @description used by commonComponentRender to untrack components 
         *              when component is empty
         * @method
         * @param {{div:HTMLElement, componentName:string, onUnmounted:function|null|undefined}} component
         */
        untrack (component){
            delete tracked[component.div.id];
        }
        
    };
})();

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
 *          path:string}} parameters
 * @returns {Promise.<{data:*, methods:*, events?:common['commonComponentEvents']|null, template:string|null}>}
 */
const commonComponentRender = async parameters => {
    const {default:ComponentCreate} = await commonMiscImport(parameters.path);
    if (parameters.mountDiv)
        COMMON_DOCUMENT.querySelector(`#${parameters.mountDiv}`).innerHTML = 
            await commonMiscImport('/common/component/common_loading.js')
            .then((({default:module})=>module()
                                        .then((/**@type{common['CommonComponentResult']}*/component)=>component.template)))
            .catch(()=>'');

    /**@type{common['CommonComponentResult']}*/
    const component = await ComponentCreate({   data:       {...parameters.data,       ...{commonMountdiv:parameters.mountDiv}},
                                                methods:    {...parameters.methods,    ...{ COMMON:commonGet()}}})
                                                .catch((/**@type{Error}*/error)=>{
                                                    parameters.mountDiv?commonComponentRemove(parameters.mountDiv):null;
                                                    commonMessageShow('EXCEPTION', null, null, error);
                                                    return null;
                                                });
    if (component){
        if (component.lifecycle?.onBeforeMounted){
            await component.lifecycle.onBeforeMounted();
        }
        
        //component can be mounted inside a third party component
        //and div and template can be empty in this case    
        if (parameters.mountDiv && component.template)
            switch (COMMON_GLOBAL.app_framework){
                case 2:{
                    //Vue
                    await commonFrameworkMount(2, component.template, {}, parameters.mountDiv, true);
                    break;
                }
                case 3:{
                    await commonFrameworkMount(3, component.template, {}, parameters.mountDiv, true);
                    break;
                }
                case 1:
                default:{
                    //Default Javascript
                    COMMON_DOCUMENT.querySelector(`#${parameters.mountDiv}`).innerHTML = component.template;
                }
            }
        //fetch resources using secure REST API if any
        COMMON_DOCUMENT.querySelectorAll(`#${parameters.mountDiv} link`).forEach((/**@type{HTMLElement}*/link) =>
            (link.getAttribute('data-href')==''||link.getAttribute('data-href')==null)?
                null:
                    commonMiscResourceFetch(link.getAttribute('data-href')??'', link,'text/css'));
        //set component with appid and name from filename without .js
        const componentName = (parameters.path.startsWith('/common/component/')?COMMON_GLOBAL.app_common_app_id:COMMON_GLOBAL.app_id).toString() + '_' +
                                parameters.path.split('/').reverse()[0].split('.')[0];
        //use Vue.createApp and data() return pattern and React.createRef() + current key pattern to share methods
        //share methods
        if (component.methods){
            if (!COMMON_GLOBAL.component[componentName])
                COMMON_GLOBAL.component[componentName]={};
            COMMON_GLOBAL.component[componentName].methods = component.methods;
        }
        //share events to event delegation in commonEvent()
        if (component.events){
            
            if (!COMMON_GLOBAL.component[componentName])
                COMMON_GLOBAL.component[componentName]={};
            COMMON_GLOBAL.component[componentName].events = component.events;
        }
        /**@type{{div:HTMLElement, componentName:string, onUnmounted:function|null|undefined}} */
        const trackObject = {
            div:COMMON_DOCUMENT.querySelector(`#${parameters.mountDiv}`),
            componentName:componentName,
            onUnmounted:component.lifecycle?.onUnmounted};
        if (parameters.path.startsWith('/common/component/'))
            //track mounted div if removed
            commonComponentMutationObserver.track(trackObject);
        //A component must be mounted to a div to use onUnMounted or can only be tracked on app root
        if (parameters.mountDiv!=null && parameters.mountDiv!='' && component.lifecycle?.onUnmounted){
            //manage onUnMounted
            const Unmounted = () =>{
                if (COMMON_DOCUMENT.querySelector(`#${parameters.mountDiv}`).textContent==''){
                    //remove shared component including methods and events
                    if (COMMON_GLOBAL.component[componentName])
                        delete COMMON_GLOBAL.component[componentName];
                    if (component.lifecycle?.onUnmounted){
                        ComponentHook.disconnect();
                        component.lifecycle.onUnmounted();
                    }
                    if (parameters.path.startsWith('/common/component/'))
                        //component is empty, remove tracking of removed element
                        commonComponentMutationObserver.untrack(trackObject);
                }
            };
            
            //Observe mounted div if empty
            const ComponentHook = new MutationObserver(Unmounted);
            ComponentHook.observe(COMMON_DOCUMENT.querySelector(`#${parameters.mountDiv}`), {characterData: true});
        }
        //manage onMounted
        if (component.lifecycle?.onMounted){
            await component.lifecycle.onMounted();
        }
        if ((parameters.mountDiv??'').indexOf('dialogue')>-1)
            COMMON_DOCUMENT.querySelector('#common_app #common_app_dialogues').classList.add('common_app_dialogues_modal');
    }
    //return data and methods from component to be used in apps
    return {data:component?component.data:null, 
            methods:component?component.methods:null, 
            events:component?component.events:null,
            template:component?.template??null};
};
/**
 * @name commonComponentRemove
 * @description Component remove
 * @function
 * @param {string} div
 * @returns {void}
 */
const commonComponentRemove = div => {
    const APPDIV = COMMON_DOCUMENT.querySelector(`#${div}`);
    if (APPDIV){
        APPDIV.textContent = '';
        if (div.indexOf('dialogue')>-1){
            APPDIV.classList.remove('common_app_dialogues_show0');
            APPDIV.classList.remove('common_app_dialogues_show1');
            APPDIV.classList.remove('common_app_dialogues_show2');
            APPDIV.classList.remove('common_app_dialogues_show3');
            COMMON_DOCUMENT.querySelector('#common_app #common_app_dialogues').classList.remove('common_app_dialogues_modal');
        }
    }    
};
/**
 * @name commonDialogueShow
 * @description Show common dialogue
 * @function
 * @param {string} dialogue 
 * @param {string|null} user_verification_type
 * @returns {Promise.<void>}
 */
const commonDialogueShow = async (dialogue, user_verification_type=null) => {
    switch (dialogue) {
        case 'VERIFY':
            {    
                commonComponentRender({
                    mountDiv:   'common_app_dialogues_iam_verify',
                    data:       {
                                    common_app_id:              COMMON_GLOBAL.app_common_app_id,
                                    iam_user_id:                COMMON_GLOBAL.iam_user_id,
                                    user_verification_type:     user_verification_type
                                },
                    methods:    null,
                    path:       '/common/component/common_app_dialogues_iam_verify.js'});
                commonComponentRemove('common_app_dialogues_iam_start');
                break;
            }
        case 'LOGIN_ADMIN':
        case 'LOGIN':
        case 'SIGNUP':{
            await commonComponentRender({
                mountDiv:       'common_app_dialogues_iam_start',
                data:           {
                                type:               dialogue=='LOGIN_ADMIN'?null:dialogue,
                                app_id:             COMMON_GLOBAL.app_id,
                                admin_app_id:       COMMON_GLOBAL.app_admin_app_id,
                                admin_only: 		COMMON_GLOBAL.admin_only,
                                admin_first_time:   COMMON_GLOBAL.admin_first_time
                                },
                methods:        null,
                path:           '/common/component/common_app_dialogues_iam_start.js'});
            break;
        }
    }
};
/**
 * @name commonMessageShow
 * @description Show message dialogue
 * @function
 * @param {'ERROR'|'ERROR_BFF'|'INFO'|'EXCEPTION'|'CONFIRM'|'LOG'|'PROGRESS'} message_type 
 * @param {function|null} function_event 
 * @param {string|null} text_class
 * @param {*} message 
 * @returns {Promise.<void>}
 */
const commonMessageShow = async (message_type, function_event, text_class=null, message=null) => {
    commonComponentRender({
        mountDiv:       'common_app_dialogues_message',
        data:           {
                        message_type:message_type,
                        text_class:text_class,
                        message:message
                        },
        methods:        {
                        function_event:function_event
                        },
        path:           '/common/component/common_app_dialogues_message.js'});
};
/**
 * @name commonMesssageNotAuthorized
 * @description Returns not authorized message
 * @function
 * @returns {string}
 */
const commonMesssageNotAuthorized = () => '⛔';

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
        mountDiv:   'common_app_dialogues_profile',
        data:       {   
                    stat_list_app_rest_url:app_rest_url,
                    statchoice:statchoice ?? 1
                    },
        methods:    null,
        path:       '/common/component/common_app_dialogues_profile.js'});
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
        COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_list').textContent = '';
    }
    else{
        commonComponentRender({
            mountDiv:   'common_app_dialogues_profile_info_list',
            data:       {
                        iam_user_id:COMMON_GLOBAL.iam_user_id,
                        iam_user_id_profile:COMMON_DOCUMENT.querySelector('#common_app_dialogues_profile_info_id').textContent,
                        detailchoice:detailchoice
                        },
            methods:    null,
            path:       '/common/component/common_app_dialogues_profile_info_list.js'});
    }
};
/**
 * @name commonProfileSearch
 * @description Profile search
 * @function
 * @returns {void}
 */
const commonProfileSearch = () => {
    commonComponentRender({
        mountDiv:   'common_app_profile_search_list_wrap',
        data:       {
                    iam_user_id:COMMON_GLOBAL.iam_user_id
                    },
        methods:    null,
        path:       '/common/component/common_app_profile_search_list.js'})
    .catch(()=>{
        COMMON_DOCUMENT.querySelector('#common_app_profile_search_list_wrap').style.display = 'none';
        COMMON_DOCUMENT.querySelector('#common_app_profile_search_list_wrap').textContent = '';
    });
};

/**
 * @name commonProfileShow
 * @description Profile show
 *              commonProfileShow(null, null)       from dropdown menu in apps or choosing logged in users profile
 *              commonProfileShow(userid, null)     from choosing profile in commonProfileStat, profile_detail and commonProfileSearch
 *              commonProfileShow(null, username)   from init startup when user enters url
 * @function
 * @param {number|null} iam_user_id_other 
 * @param {string|null} username 
 * @returns {Promise.<void>}
 */
const commonProfileShow = async (iam_user_id_other = null, username = null) => {
    await commonComponentRender({
        mountDiv:   'common_app_dialogues_profile',
        data:       {   
                    stat_list_app_rest_url:null,
                    statchoice:null
                    },
        methods:    null,
        path:       '/common/component/common_app_dialogues_profile.js'});
    await commonComponentRender({
        mountDiv:   'common_app_dialogues_profile_content',
        data:       {   
                    iam_user_id:COMMON_GLOBAL.iam_user_id,
                    iam_user_id_other:iam_user_id_other,
                    username:username
                    },
        methods:    null,
        path:       '/common/component/common_app_dialogues_profile_info.js'});
};
/**
 * @name commonUserLogin
 * @description User login
 * @function
 * @returns {Promise. <{    avatar: string|null}>}
 */
const commonUserLogin = async () => {
    let spinner_item = '';
    let current_dialogue = '';
    if (COMMON_GLOBAL.app_admin_app_id == COMMON_GLOBAL.app_id) {
        spinner_item = 'common_app_dialogues_iam_start_login_admin_button';
        current_dialogue = 'common_app_dialogues_iam_start';
        if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start'),
                        {
                        username: COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_admin_username'),
                        password: COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_admin_password'),
                        password_confirm: COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_admin_password_confirm')?
                                            COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_admin_password_confirm'):
                                                null
                        })==false)
            throw 'ERROR';        
    }
    else{
        spinner_item = 'common_app_dialogues_iam_start_login_button';
        current_dialogue = 'common_app_dialogues_iam_start';
        if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start'),
                        {
                        username: COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_username'),
                        password: COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_password')
                        })==false)
            throw 'ERROR';
    }
    const result_iam = await commonFFB({path:'/server-iam-login', 
                                        method:'POST', 
                                        authorization_type:'IAM', 
                                        username:encodeURI(COMMON_GLOBAL.app_admin_app_id == COMMON_GLOBAL.app_id?
                                                            COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_admin_username').textContent:
                                                                COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_username').textContent),
                                        password:encodeURI(COMMON_GLOBAL.app_admin_app_id == COMMON_GLOBAL.app_id?
                                                            COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_admin_password').textContent:
                                                                COMMON_DOCUMENT.querySelector('#common_app_dialogues_iam_start_login_password').textContent),
                                        spinner_id:spinner_item});
    if (JSON.parse(result_iam).active==1){
        COMMON_GLOBAL.iam_user_app_id =         JSON.parse(result_iam).iam_user_app_id;
        COMMON_GLOBAL.iam_user_id =             JSON.parse(result_iam).iam_user_id;
        COMMON_GLOBAL.iam_user_username =       JSON.parse(result_iam).iam_user_username;
        COMMON_GLOBAL.iam_user_avatar =         JSON.parse(result_iam).avatar;
        COMMON_GLOBAL.token_exp =               JSON.parse(result_iam).exp;
        COMMON_GLOBAL.token_iat =               JSON.parse(result_iam).iat;

        if (COMMON_GLOBAL.app_admin_app_id == COMMON_GLOBAL.app_id){
            COMMON_GLOBAL.token_admin_at= JSON.parse(result_iam).token_at;
            COMMON_GLOBAL.token_at	    = null;
            commonComponentRemove(current_dialogue);
        }
        else{
            COMMON_GLOBAL.token_admin_at= null;
            COMMON_GLOBAL.token_at	    = JSON.parse(result_iam).token_at;
            commonUserUpdateAvatar(true, COMMON_GLOBAL.iam_user_avatar);
            commonComponentRemove(current_dialogue);
            commonComponentRemove('common_app_dialogues_profile');
        }
        commonUserMessageShowStat();
        commonUserLoginApp(JSON.parse(result_iam).IamUserApp);
        return {avatar: JSON.parse(result_iam).avatar};
    }
    else{
        COMMON_GLOBAL.iam_user_app_id =         JSON.parse(result_iam).iam_user_app_id;
        COMMON_GLOBAL.iam_user_id =             JSON.parse(result_iam).iam_user_id;
        COMMON_GLOBAL.iam_user_username =       JSON.parse(result_iam).iam_user_username;
        COMMON_GLOBAL.token_at	=               JSON.parse(result_iam).token_at;
        COMMON_GLOBAL.token_exp =               JSON.parse(result_iam).exp;
        COMMON_GLOBAL.token_iat =               JSON.parse(result_iam).iat;
        commonDialogueShow('VERIFY', 'LOGIN');
        throw 'ERROR';
    }
};
/**
 * @name commonUserLoginApp
 * @description
 * @function
 * @param {common['server']['ORM']['Object']['IamUserApp']} IamUserApp
 * @returns {void}
 */
const commonUserLoginApp = IamUserApp =>{
    COMMON_GLOBAL.iam_user_app_id = IamUserApp.Id ?? null;
    //get preferences saved in Document column
    //locale
    if (IamUserApp.Document?.PreferenceLocale==null)
        commonUserPreferencesGlobalSetDefault('LOCALE');
    else
        COMMON_GLOBAL.user_locale = IamUserApp.Document.PreferenceLocale;
    //timezone
    if (IamUserApp.Document?.PreferenceTimezone==null)
        commonUserPreferencesGlobalSetDefault('TIMEZONE');
    else
        COMMON_GLOBAL.user_timezone = IamUserApp.Document.PreferenceTimezone;
    //direction
    COMMON_GLOBAL.user_direction = IamUserApp.Document?.PreferenceDirection??'';
    //arabic script
    COMMON_GLOBAL.user_arabic_script = IamUserApp.Document?.PreferenceArabicScript??'';
    //custom data for individual app functionality
    COMMON_GLOBAL.user_custom = IamUserApp.Document?.Custom??null;
    //update body class with app theme, direction and arabic script usage classes
    commonMiscPreferencesUpdateBodyClassFromPreferences();
};
/**
 * @name commonUserSessionClear
 * @description Clears users ssesion variables
 * @function
 * @returns {void}
 */
const commonUserSessionClear = () => {
    //iam user
    COMMON_GLOBAL.iam_user_app_id =         null;
    COMMON_GLOBAL.iam_user_id =             null;
    COMMON_GLOBAL.iam_user_username =       null;

    //admin access token
    COMMON_GLOBAL.token_admin_at =          null;
    //user access token
    COMMON_GLOBAL.token_at	=               null;
    COMMON_GLOBAL.token_exp =               null;
    COMMON_GLOBAL.token_iat =               null;
};

/**
 * @name commonUserSessionCountdown
 * @description Countdown function to monitor token expire time
 *              Uses event listener on element instead of setTimeout since element can removed 
 *              and then event listener will automatically be removed
 *              if token_exp is null then users COMMON_GLOBAL.token_exp will be used
 * @function
 * @param {HTMLElement} element
 * @param {number|null} token_exp
 * @param {function|null} app_function
 * @returns {Promise.<void>}
 */
 const commonUserSessionCountdown = async (element, token_exp, app_function=null) => {

    if (element.id)
        element = COMMON_DOCUMENT.querySelector(`#${element.id}`);
    else
        element = COMMON_DOCUMENT.querySelector(`.${element.className.replaceAll(' ','.')}`);
    if (element){
        const time_left = ((token_exp ?? COMMON_GLOBAL?.token_exp ??0) * 1000) - (Date.now());
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
            commonUserSessionCountdown(element, token_exp ?? COMMON_GLOBAL?.token_exp ?? 0, app_function);
        }
    }
};
/**
 * @name commonUserLogout
 * @description User logout
 * @function
 * @returns {Promise.<void>}
 */
const commonUserLogout = async () => {
    await commonFFB({path:'/server-iam-logout', 
                    method:'DELETE', 
                    authorization_type:(COMMON_GLOBAL.app_id == COMMON_GLOBAL.app_admin_app_id)?'ADMIN':'APP_ACCESS'})
            .catch(()=>{
                //ignore error since token can be expired
                null;
            });
    commonLogout();
};

/**
 * @name commonLogout
 * @description User logout
 * @function
 * @returns {Promise.<void>}
 */
const commonLogout = async () => {
    commonComponentRemove('common_app_dialogues_user_menu');
    COMMON_GLOBAL.component[COMMON_GLOBAL.app_common_app_id + '_' + 'common_app_window_info']?.methods?.commonWindoInfoClose?
        COMMON_GLOBAL.component[COMMON_GLOBAL.app_common_app_id + '_' + 'common_app_window_info']?.methods?.commonWindoInfoClose():
            null;
    commonComponentRemove('common_app_dialogues_iam_verify');
    if (COMMON_GLOBAL.app_id != COMMON_GLOBAL.app_admin_app_id){
        commonUserUpdateAvatar(false,null );
        commonComponentRemove('common_app_dialogues_iam_verify');
        commonComponentRemove('common_app_dialogues_iam_start');
        commonComponentRemove('common_app_dialogues_profile');
    }
    commonUserPreferencesGlobalSetDefault('LOCALE');
    commonUserPreferencesGlobalSetDefault('TIMEZONE');
    commonUserPreferencesGlobalSetDefault('DIRECTION');
    commonUserPreferencesGlobalSetDefault('ARABIC_SCRIPT');
    //update body class with app theme, direction and arabic script usage classes
    commonMiscPreferencesUpdateBodyClassFromPreferences();
    commonUserSessionClear();
};


/**
 * @name commonUserAuthenticateCode
 * @description Activate user
 * @function
 * @param {string} verification_code
 * @param {string}verification_type
 * @returns {Promise.<boolean>}
 */
const commonUserAuthenticateCode = async (verification_code, verification_type) => {
    return await commonFFB({ path:`/server-db/iamuser-activate/${COMMON_GLOBAL.iam_user_id ?? ''}`, 
                method:'PUT', 
                authorization_type:'APP_ACCESS_VERIFICATION', 
                body:{   verification_code:  verification_code,
                        /**
                        * Verification type
                        * 1 LOGIN
                        * 2 SIGNUP      
                        */
                        verification_type:  verification_type=='LOGIN'?1:verification_type=='SIGNUP'?2:3}, 
                spinner_id:'common_app_icon_verification_code'})
    .then(result=>{
            if (JSON.parse(result).activated == 1){
                commonUserSessionClear();
                return true;
            }
            else
                return false;
    })
    .catch(()=>{
        return false;
    });
};
const commonUserMessageShowStat = async () =>{
    if (COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_nav_messages_count') ||
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_message_count_text')){
        /**@type{{unread:number, 
             *           read:number}}
             */    
        const messageStat = await commonFFB({path:'/app-common-module/COMMON_MESSAGE_COUNT', 
            method:'POST', 
            body:{  type:'FUNCTION', 
                    IAM_iam_user_id:COMMON_GLOBAL.iam_user_id,
                    IAM_data_app_id:COMMON_GLOBAL.app_common_app_id},
            authorization_type:COMMON_GLOBAL.app_id == COMMON_GLOBAL.app_admin_app_id?'ADMIN':'APP_ACCESS'})
            .then((/**@type{*}*/result)=>JSON.parse(result).rows[0]);
        if (COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_nav_messages_count'))
            COMMON_DOCUMENT.querySelector('#common_app_dialogues_user_menu_nav_messages_count').textContent = `${messageStat.unread}(${messageStat.unread+messageStat.read})`;
        if (COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_message_count_text'))
            COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_message_count_text').textContent = `${messageStat.unread}(${messageStat.unread+messageStat.read})`;
        
    }    
};

/**
 * @name commonUserUpdateAvatar
 * @description Update avatar login/logout
 * @function
 * @param {boolean} login
 * @param {string|null} avatar
 * @returns {void}
 */
const commonUserUpdateAvatar = (login, avatar) =>{
    if (login){
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_avatar_img').style.backgroundImage= avatar?
                                                                                                `url('${avatar}')`:
                                                                                                    'url()';
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_avatar_img').setAttribute('data-image',avatar);
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_logged_in').style.display = 'inline-block';
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_logged_out').style.display = 'none';
    }
    else{
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_avatar_img').style.backgroundImage= 'url()';
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_avatar_img').setAttribute('data-image',null);
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_logged_in').style.display = 'none';
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_logged_out').style.display = 'inline-block';
        COMMON_DOCUMENT.querySelector('#common_app_iam_user_menu_message_count_text').textContent = '';
    }
};
/**
 * @name commonUserLocale
 * @description get user locale
 * @function
 * @returns {string}
 */
const commonUserLocale =() =>COMMON_GLOBAL.user_locale;

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
 * @name commonFFB
 * @description Frontend for Backend (FFB)
 *              All requests are encrypted
 *              Can use request for roles 
 *              APP_ACCESS_EXTERNAL
 *              APP_ACCESS
 *              APP_ACCESS_VERIFICATION
 *              ADMIN
 *              IAM
 *              Uses backoff algorithm to requests
 *              Adds increasing milliseconds to request timeout or error 429 Too many requests: Math.pow(2, increased retry) * 1000
 *              Timeout error will be returned until server parameter APP_REQUEST_TRIES reached
 *              Pipes encrypted result to readable stream if SSE where events are delegated or returns result from REST API
 * @function
 * @param {{path:string,
 *          query?:string|null,
 *          method:common['CommonRESTAPIMethod'],
 *          authorization_type:common['CommonRESTAPIAuthorizationType'],
 *          username?:string,
 *          password?:string,
 *          body?:*,
 *          response_type?:'SSE'|'TEXT'
 *          spinner_id?:string|null,
 *          timeout?:number|null}} parameter
 * @returns {Promise.<*>} 
 */
const commonFFB = async parameter =>{
    /**
     * @description Front end for backend (FFB) that receives responses 
     *              from backend for frontend (BFF)
     * @param {{uuid:string,
     *          secret:string,
     *          response_type?:'SSE'|'TEXT'|'BLOB',
     *          spinner_id?:string|null,
     *          timeout?:number|null,
     *          rest_api_version: string,
     *          rest_bff_path   : string,
     *          data:{
     *              idToken: string,
     *              accessToken?:string,
     *              externalToken:string|null,
     *              path?:string|null,
     *              query?:string|null,
     *              method:string,
     *              authorization_type:string,
     *              username?:string,
     *              password?:string,
     *              body?:*,
     *          }}} parameters
     */
    const FFB = async parameters =>{
        /**@type{number} */
        let status;
        let authorization = null;
        
        parameters.data.query = parameters.data.query==null?'':parameters.data.query;
        parameters.data.body = parameters.data.body?parameters.data.body:null;
        //admin uses ADMIN instead of APP_ACCESS so all ADMIN requests use separate admin token
        const ROLE = (COMMON_GLOBAL.app_id == COMMON_GLOBAL.app_admin_app_id && parameters.data.authorization_type =='APP_ACCESS')?
                        'ADMIN':parameters.data.authorization_type;
        switch (ROLE){
            case 'APP_ACCESS_EXTERNAL':{
                authorization = 'Bearer ' + parameters.data.externalToken;
                break;
            }
            case 'APP_ACCESS':
            case 'APP_ACCESS_VERIFICATION':
            case 'ADMIN':{
                authorization = 'Bearer ' + parameters.data.accessToken;
                break;
            }
            case 'IAM':{
                authorization = 'Basic ' + commonWindowToBase64(parameters.data.username + ':' + parameters.data.password);
                break;
            }
        }
        //add common query parameter
        parameters.data.query += '&locale=' + (COMMON_GLOBAL.user_locale??'');

        //encode query parameters
        const encodedparameters = parameters.data.query?commonWindowToBase64(parameters.data.query):'';
        const bff_path = parameters.rest_bff_path + '/' + 
                            ROLE.toLowerCase() + 
                            '/v' + (parameters.rest_api_version ??1);
        //public url
        const url = (COMMON_GLOBAL.app_rest_api_basepath + parameters.uuid);

        if (parameters.spinner_id && COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
            COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.add('common_loading_spinner');
        const resultFetch = {finished:false};
        const options =     {
                            cache:  'no-store',
                            method: 'POST',
                            headers:{
                                        ...(parameters.response_type =='SSE' && {'Cache-control': 'no-cache'}),
                                        'Content-Type': COMMON_GLOBAL.app_content_type_json,
                                        'Connection':   parameters.response_type =='SSE'?
                                                            'keep-alive':
                                                                'close',
                                    },
                            body: JSON.stringify({
                                    x: COMMON_GLOBAL.x.encrypt({
                                        iv:     JSON.parse(commonWindowFromBase64(parameters.secret)).iv,
                                        key:    JSON.parse(commonWindowFromBase64(parameters.secret)).jwk.k, 
                                        data:JSON.stringify({  
                                                headers:{
                                                        'app-id':       COMMON_GLOBAL.app_id,
                                                        'app-signature':COMMON_GLOBAL.x.encrypt({ 
                                                                            iv:     JSON.parse(commonWindowFromBase64(parameters.secret)).iv,
                                                                            key:    JSON.parse(commonWindowFromBase64(parameters.secret)).jwk.k, 
                                                                            data:   JSON.stringify({app_id: COMMON_GLOBAL.app_id })}),
                                                        'app-id-token': 'Bearer ' + parameters.data.idToken,
                                                        ...(authorization && {Authorization: authorization}),
                                                        'Content-Type': parameters.response_type =='SSE'?
                                                                            COMMON_GLOBAL.app_content_type_sse:
                                                                                COMMON_GLOBAL.app_content_type_json,
                                                        },
                                                method: parameters.data.method,
                                                url:    bff_path + parameters.data.path + '?parameters=' + encodedparameters,
                                                body:   parameters.data.body?
                                                            JSON.stringify({data:commonWindowToBase64(JSON.stringify(parameters.data.body))}):
                                                                null
                                            })
                                        })
                                })
                            };
        /**
         * 
         * @param {*} data 
         * @returns {string}
         */
        const getDecrypted   = data =>
                COMMON_GLOBAL.x.decrypt({
                            iv:         JSON.parse(commonWindowFromBase64(parameters.secret)).iv,
                            key:        JSON.parse(commonWindowFromBase64(parameters.secret)).jwk.k,
                            ciphertext: parameters.response_type=='SSE'?
                                            new TextDecoder('utf-8').decode(data).split('\\n\\n')[0].split('data: ')[1]:
                                            data});
        let retries = 0;
        //loop max retries according to parameter until result is fetched in case of too many request or timeout errors
        do{
            //add backoff algorithm to requests
            //add increasing milliseconds to user or admin request timeout values
            const waitBackoffInMilliseconds = Math.pow(2, retries) * 1000;
            //0:0 sec, 1:2 sec, 2:4 sec, 3:8 sec, 4:16 sec, 5:32...
            const result = await Promise.race(
                [   new Promise((resolve)=>
                        setTimeout(()=>{
                            if (resultFetch.finished==false){
                                commonMessageShow('ERROR_BFF', null, null, '🗺⛔?');
                                resolve('🗺⛔?');
                                throw ('TIMEOUT');
                            }
                            }, (COMMON_GLOBAL.app_id == COMMON_GLOBAL.app_admin_app_id?
                                    (1000 * 60 * COMMON_GLOBAL.app_requesttimeout_admin_minutes):
                                    parameters.timeout || (1000 * COMMON_GLOBAL.app_requesttimeout_seconds)) + waitBackoffInMilliseconds
                        )),
                    /**@ts-ignore */
                    fetch(url, options)
                        .then((/**@type{*}*/response) =>{
                            status = response.status;
                            if (parameters.response_type=='SSE')
                                return response;
                            else
                                return response.text();
                        })
                        .then(result => {                                    
                            switch (status){
                                case 200:
                                case 201:{
                                    if (parameters.response_type=='SSE'){
                                        /**
                                         * @param {string} BFFmessage
                                         * @returns {{sse_type:common['server']['socket']['broadcast_type'],
                                         *           sse_message:string}}
                                         */
                                        const getSSEMessage = BFFmessage =>{
                                            const messageDecoded = commonWindowFromBase64(BFFmessage);
                                            return {sse_type:JSON.parse(messageDecoded).sse_type,
                                                    sse_message:JSON.parse(messageDecoded).sse_message};
                                        };
                                        const BFFStream = new WritableStream({
                                            async write(BFFmessage){
                                                const SSEmessage = getSSEMessage(getDecrypted(BFFmessage));
                                                switch (SSEmessage.sse_type){
                                                    case 'FONT_URL':{
                                                        commonMiscLoadFont({uuid:               parameters.uuid??'',
                                                                            secret:             parameters.secret??'',
                                                                            message:            SSEmessage.sse_message});
                                                        break;
                                                    }
                                                    default:{
                                                        commonSocketSSEShow(SSEmessage);
                                                        break;
                                                    }
                                                }
                                            }
                                        //The total number of chunks that can be contained in the internal queue before backpressure is applied
                                        }, new CountQueuingStrategy({ highWaterMark: 1 }));
                                        //pipe to Writeable Stream and restart if connection is lost
                                        result.body.pipeTo(BFFStream).catch(()=>window.location.href='/');
                                        return {status:status, result:null};
                                    }
                                    else
                                        /**@ts-ignore */
                                        return {status:status, result:getDecrypted(result)};
                                }
                                case 400:{
                                    //Bad request
                                    commonMessageShow('ERROR_BFF', null, 'message_text', '!');
                                    throw getDecrypted(result);
                                }
                                case 429:{
                                    //Too many requests
                                    return {status:status, result:null};
                                }
                                case 404:   //Not found
                                case 401:   //Unauthorized, token expired
                                case 403:   //Forbidden, not allowed to login or register new user
                                case 503:   //Service unavailable or other error in microservice
                                {   
                                    const error = getDecrypted(result);
                                    commonMessageShow('ERROR_BFF', null, null, error);
                                    throw error;
                                }
                                case 500:{
                                    //Unknown error
                                    const error = getDecrypted(result);
                                    commonMessageShow('EXCEPTION', null, null, error);
                                    throw error;
                                }
                            }
                        })
                        .catch(error=>{
                            throw error;
                        })
                        .finally(()=>{
                            resultFetch.finished=true;
                            if (parameters.spinner_id && COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
                                COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.remove('common_loading_spinner');
                        })
                ]);
            if ([200,201].includes(result.status))
                return result.result;
            else
                retries++;
            }
        while (retries < COMMON_GLOBAL.app_request_tries);
        commonMessageShow('ERROR_BFF', null, null, '🗺⛔?');
        throw ('TIMEOUT');
    };
    return await FFB({
            uuid: COMMON_GLOBAL.x.uuid??'',
            secret: COMMON_GLOBAL.x.secret??'',
            response_type: parameter.response_type??'TEXT',
            spinner_id: parameter.spinner_id,
            timeout: parameter.timeout,
            rest_api_version: COMMON_GLOBAL.app_rest_api_version??'',
            rest_bff_path   : COMMON_GLOBAL.rest_resource_bff??'',
            data: {
                idToken: COMMON_GLOBAL.token_dt??'',
                accessToken: (COMMON_GLOBAL.app_id == COMMON_GLOBAL.app_admin_app_id)?
                                COMMON_GLOBAL.token_admin_at??'':
                                    COMMON_GLOBAL.token_at??'',
                externalToken:COMMON_GLOBAL.token_external??null,
                path:parameter.path,
                query: parameter.query,
                method: parameter.method,
                authorization_type: parameter.authorization_type,
                username: parameter.username??'',
                password: parameter.password??'',
                body: parameter.body ?? null
            }});
};

/**
 * @name commonSocketSSEShow
 * @description Show sse message
 * @function
 * @param {{sse_type:common['server']['socket']['broadcast_type'],
 *           sse_message:string}} sse_message 
 * @returns {Promise.<void>}
 */
const commonSocketSSEShow = async (sse_message) => {
    switch (sse_message.sse_type){
        case 'EXPIRED_ACCESS':
        case 'MAINTENANCE':{
            window.location.href = '/';
            break;
        }
        case 'EXPIRED_SESSION':{
            commonLogout();
            COMMON_GLOBAL.app_function_session_expired?COMMON_GLOBAL.app_function_session_expired():null;
            break;
        }
        case 'CONNECTINFO':{
            COMMON_GLOBAL.client_latitude =             JSON.parse(sse_message.sse_message).latitude==''?
                                                            COMMON_GLOBAL.client_latitude:
                                                                JSON.parse(sse_message.sse_message).latitude;
            COMMON_GLOBAL.client_longitude =            JSON.parse(sse_message.sse_message).longitude==''?
                                                            COMMON_GLOBAL.client_longitude:
                                                                JSON.parse(sse_message.sse_message).longitude;
            COMMON_GLOBAL.client_place =                JSON.parse(sse_message.sse_message).place==''?
                                                            COMMON_GLOBAL.client_place:
                                                                JSON.parse(sse_message.sse_message).place;
            COMMON_GLOBAL.client_timezone =             JSON.parse(sse_message.sse_message).timezone==''?
                                                            COMMON_GLOBAL.client_timezone:
                                                                JSON.parse(sse_message.sse_message).timezone;
            break;
        }
        case 'CHAT':
        case 'ALERT':{
            commonComponentRender({
                mountDiv:   'common_app_broadcast',
                data:       {message:sse_message.sse_message},
                methods:    null,
                path:       '/common/component/common_app_broadcast.js'});
            break;
        }
		case 'PROGRESS':{
			commonMessageShow('PROGRESS', null, null, JSON.parse(sse_message.sse_message));
            break;
        }
        case 'PROGRESS_LOADING':{
            //set progress info and illustration about progress
            if (COMMON_DOCUMENT.querySelector('#common_loading_progressbar_info'))
                COMMON_DOCUMENT.querySelector('#common_loading_progressbar_info').style.width = 
                    JSON.parse(sse_message.sse_message).info ??'';
            if (COMMON_DOCUMENT.querySelector('#common_loading_progressbar'))
                COMMON_DOCUMENT.querySelector('#common_loading_progressbar').style.width = 
                    `${(JSON.parse(sse_message.sse_message).part/JSON.parse(sse_message.sse_message).total)*100}%`;
            break;
        }
        case 'APP_FUNCTION':{
            if (COMMON_GLOBAL.app_function_sse)
                COMMON_GLOBAL.app_function_sse(sse_message.sse_message);
            break;
        }
        case 'MESSAGE':{
            commonUserMessageShowStat();
            break;
        }   
    }
};
/**
 * @name commonSocketConnectOnlineCheck
 * @description Socket check online
 * @function
 * @param {string} div_icon_online 
 * @param {number} iam_user_id 
 * @returns {void}
 */
const commonSocketConnectOnlineCheck = (div_icon_online, iam_user_id) => {
   commonFFB({path:`/server-socket/socket-status/${iam_user_id}`, method:'GET', authorization_type:'APP_ID'})
    .then(result=>COMMON_DOCUMENT.querySelector('#' + div_icon_online).className = 'common_icon ' + (JSON.parse(result).online==1?'online':'offline'));
};
/**
 * @name commonGeolocationPlace
 * @description Microservice Geolocation: Get place from GPS
 * @function
 * @param {string} longitude 
 * @param {string} latitude 
 * @returns {Promise.<string>}
 */
const commonGeolocationPlace = async (longitude, latitude) => {
    return await new Promise((resolve)=>{
       commonFFB({path:'/geolocation/place', query:`longitude=${longitude}&latitude=${latitude}`, method:'GET', authorization_type:'APP_ID'})
        .then(result=>{
            const json = JSON.parse(result).rows;
            if (json.place=='' && json.region =='' && json.countryCode =='')
                resolve('');
            else
                resolve(json.place + ', ' +
                        json.region + ', ' +
                        json.country + ' (' + json.countryCode + ')');
        })
        .catch(()=>resolve(''));
    });
};
/**
 * @name commonTextEditingDisabled
 * @description Check if textediting is disabled
 * @function
 * @returns {boolean}
 */
const commonTextEditingDisabled = () =>COMMON_GLOBAL.app_text_edit=='0';

/**
 * @name commonEvent
 * @description Central event delegation on app root
 *              order of events: 1 common, 2 module, 3 app 
 * @function
 * @param {common['commonEventType']} event_type 
 * @param {common['CommonAppEvent']|null} event 
 * @returns {Promise.<void>}
 */
const commonEvent = async (event_type,event=null) =>{
    if (event==null){
        COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_root}`).addEventListener(event_type, (/**@type{common['CommonAppEvent']}*/event) => {
            commonEvent(event_type, event);
        });
    }
    else{
        //1 common events
        //uses IIFE and waits until finished
        await (async ()=>{
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
                                break;
                            }
                            case event.target.classList.contains('common_select_option')?event_target_id:'':{
                                //select can show HTML, use innerHTML
                                COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).innerHTML = event.target.innerHTML;
                                COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).setAttribute('data-value', event.target.getAttribute('data-value'));
                                event.target.parentNode.style.display = 'none';
                                break;
                            }                            
                            case 'common_app_profile_search_icon':{
                                COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').focus();
                                COMMON_DOCUMENT.querySelector('#common_app_profile_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                                break;
                            }
                            /* Dialogue user menu*/
                            case 'common_app_iam_user_menu':
                            case 'common_app_iam_user_menu_logged_in':
                            case 'common_app_iam_user_menu_avatar':
                            case 'common_app_iam_user_menu_avatar_img':
                            case 'common_app_iam_user_menu_logged_out':
                            case 'common_app_iam_user_menu_default_avatar':{
                                await commonComponentRender({
                                    mountDiv:   'common_app_dialogues_user_menu',
                                    data:       {
                                                app_id:COMMON_GLOBAL.app_id,
                                                iam_user_id:COMMON_GLOBAL.iam_user_id,
                                                iam_user_username:COMMON_GLOBAL.iam_user_username,
                                                common_app_id:COMMON_GLOBAL.app_common_app_id,
                                                admin_app_id:COMMON_GLOBAL.app_admin_app_id,
                                                token_exp:COMMON_GLOBAL.token_exp,
                                                token_iat:COMMON_GLOBAL.token_iat,
                                                user_locale:COMMON_GLOBAL.user_locale,
                                                user_timezone:COMMON_GLOBAL.user_timezone,
                                                user_direction:COMMON_GLOBAL.user_direction,
                                                user_arabic_script:COMMON_GLOBAL.user_arabic_script
                                                },
                                    methods:    null,
                                    path:       '/common/component/common_app_dialogues_user_menu.js'});
                                break;
                            }

                            //dialogue button stat
                            case 'common_app_profile_toolbar_stat':{
                                await commonProfileStat(1, null);
                                break;
                            }
                            //markdown show/hide details
                            case ((typeof event.target.className=='string'?event.target.className.indexOf('common_md_tab_col')>-1:false) && commonMiscElementRow(event.target, 'common_md_tab_row').classList?.contains('common_md_tab_row_title')?event_target_id:null):{
                                if (commonMiscElementRow(event.target, 'common_md_tab').classList?.contains('hide'))
                                    commonMiscElementRow(event.target, 'common_md_tab').classList?.remove('hide');
                                else
                                    commonMiscElementRow(event.target, 'common_md_tab').classList?.add('hide');
                                break;
                            }
                            // common app toolbar
                            case 'common_app_toolbar_start':{
                                commonAppMount(COMMON_GLOBAL.app_start_app_id);
                                break;
                            }
                            case 'common_app_toolbar_framework_js':
                            case 'common_app_toolbar_framework_vue':
                            case 'common_app_toolbar_framework_react':{
                                COMMON_DOCUMENT.querySelectorAll('#common_app_toolbar .common_toolbar_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_toolbar_selected'));
                                COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_toolbar_selected');
                                if (event_target_id=='common_app_toolbar_framework_js')
                                    await commonFrameworkSet(1);
                                if (event_target_id=='common_app_toolbar_framework_vue')
                                    await commonFrameworkSet(2);
                                if (event_target_id=='common_app_toolbar_framework_react')
                                    await commonFrameworkSet(3);
                                break;
                            }
                            //markdown document tags
                            case event.target.classList.contains('common_md_image')?event_target_id:'':{
                                if (event.target.getAttribute('data-url_link'))
                                    commonComponentRender({
                                        mountDiv:   'common_app_window_info',
                                        data:       {
                                                    info:'IMAGE',
                                                    url:event.target.getAttribute('data-url_link'),
                                                    },
                                        methods:    null,
                                        path:       '/common/component/common_app_window_info.js'});
                                break;
                            }
                            case COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.contains('common_document')?event_target_id:'':{
                                //display document except common_link that uses its own event
                                if (!event.target.classList.contains('common_link'))
                                    commonComponentRender({
                                        mountDiv:   'common_app_window_info',
                                        data:       {
                                                    info:'HTML',
                                                    content:COMMON_DOCUMENT.querySelector(`#${event_target_id}`).outerHTML,
                                                    },
                                        methods:    null,
                                        path:       '/common/component/common_app_window_info.js'});
                                break;
                            }
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
                case 'keyup':{
                    if (event.target.classList.contains('common_password')){   
                        COMMON_DOCUMENT.querySelector(`#${event.target.id}_mask`).textContent = 
                            event.target.textContent.replace(event.target.textContent, '*'.repeat(commonMiscLengthWithoutDiacrites(event.target.textContent)));
                    }
                    else
                        switch (event.target.id){
                            case 'common_app_profile_search_input':{
                                commonMiscListKeyEvent({event:event,
                                                        event_function:commonProfileSearch,
                                                        event_parameters:null,
                                                        rows_element:'common_app_profile_search_list',
                                                        search_input:'common_app_profile_search_input'});
                                break;
                            }
                        }
                    break;
                }
                case 'mousedown':{
                    //common event only
                    commonEventCopyPasteCutDisable(event);
                    break;
                }
                case 'touchstart':{
                    //common event only
                    commonEventInputDisable(event);
                    break;
                }
                case 'copy':{
                    //common event only
                    commonEventCopyPasteCutDisable(event);
                    break;
                }
                case 'paste':{
                    //common event only
                    commonEventCopyPasteCutDisable(event);
                    break;
                }
                case 'cut':{
                    //common event only
                    commonEventCopyPasteCutDisable(event);
                    break;
                }
                default:{
                    break;
                }
            }
        })();
        //2 component events
        //fire component events defined in each component in COMMON_GLOBAL.component[component].events key
        //component events should be for component elements, use app events to add addional functionality after common event and component events
        for (const component of Object.values(COMMON_GLOBAL.component))
            component.events?
                await component.events(event_type, event):
                    null;
        //3 app events
        COMMON_GLOBAL.app_metadata.events[event_type]?await COMMON_GLOBAL.app_metadata.events[event_type](event):null;
    }
};
/**
 * @name commonEventCopyPasteCutDisable
 * @description Disable copy cut paste
 * @function
 * @param {common['CommonAppEvent']} event 
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
 * @param {common['CommonAppEvent']} event 
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
            /**@type {common['CommonModuleVue']} */
            const Vue = await commonMiscImport(commonMiscImportmap('Vue'));

            //Use tempmount div to be able to return pure HTML without extra events
            //since event delegation is used
            COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML ='<div id=\'tempmount\'></div>'; 
            try {
                //mount the app or component
                Vue.createApp({
                    data(){return {};},
                    template: template,
                    methods:methods,
                    compilerOptions: {
                        whitespace: 'preserve'
                    }
                }).mount('#tempmount');

                if (component){
                    //replace mount div with tempmount div without events
                    COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML = COMMON_DOCUMENT.querySelector('#tempmount').innerHTML;
                }
                else{
                    //replace mount div with tempmount element with events
                    COMMON_DOCUMENT.querySelector(`#${mount_div}`).replaceWith(COMMON_DOCUMENT.querySelector('#tempmount >div'));
                }    
            } catch (error) {
                COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML = template;
            }
            
            break;
        }
        case 3:{
            //React
            /**@type {common['CommonModuleReact']} */
            const React = await commonMiscImport(commonMiscImportmap('React')).then(module=>module.React);
            /**@type {common['CommonModuleReactDOM']} */
            const ReactDOM = await commonMiscImport(commonMiscImportmap('ReactDOM')).then(module=>module.ReactDOM);

            try {
                //convert HTML template to React component
                const div_template = COMMON_DOCUMENT.createElement('div');
                div_template.innerHTML = template;
                const component = React.createElement(div_template.nodeName.toLowerCase(), 
                                                    { id: div_template.id, className: div_template.className}, 
                                                    commonFrameworkHtml2ReactComponent(React.createElement, div_template.children));

                COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML ='<div id=\'tempmount\'></div>'; 
                const application = ReactDOM.createRoot(COMMON_DOCUMENT.querySelector(`#${mount_div} #tempmount`));
                application.render( component);
                const mount = async () =>{
                    //React is only used as a parser of HTML and all Reacts events are removed by removing tempmount div
                    //Mount template HTML
                    if (COMMON_DOCUMENT.querySelector(`#${mount_div}`)){
                        COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML = template;
                    }
                    else
                        await new Promise ((resolve)=>{commonWindowSetTimeout(()=> resolve(mount()), 200);});
                };
                //wait until react is finished
                await mount();
            } catch (error) {
                COMMON_DOCUMENT.querySelector(`#${mount_div}`).innerHTML = template;
            }            
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
 * @returns {Promise.<void>}
 */
const commonFrameworkSet = async (framework) => {
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
    
    COMMON_GLOBAL.app_eventListeners.OTHER = [];

    //remove all listeners in app and app root divs including all objects saved on elements
    app_element.replaceWith(app_element.cloneNode(true));
    app_root_element.replaceWith(app_root_element.cloneNode(true));
    
    commonFrameworkClean();
    
    //app can override framework or use default javascript if Vue or React is not set
    if (framework ?? COMMON_GLOBAL.app_framework !=COMMON_GLOBAL.app_framework)
        COMMON_GLOBAL.app_framework = framework ??1;
    switch (framework ?? COMMON_GLOBAL.app_framework){
        case 2:{
            //Vue
            const template = `  <div id='${COMMON_GLOBAL.app_root}'>
                                    ${app_element.outerHTML}
                                    ${common_app_element.outerHTML}
                                </div>`;
            const methods = {};
            await commonFrameworkMount(2, template, methods, COMMON_GLOBAL.app_root, false);
            break;
        }
        case 3:{
            //React
            const template = `  ${app_element.outerHTML}
                                ${common_app_element.outerHTML}`;
            const methods = {};
            await commonFrameworkMount(3, template, methods, COMMON_GLOBAL.app_root, false);
            break;
        }
        case 1:
        default:{
            //Javascript
            break;
        }
    }
    //App events are not supported on other frameworks
    //All events are managed in event delegation
    //call event function to add listeners using null parameter
    commonEvent('click', null);
    commonEvent('change', null);
    commonEvent('focusin', null);
    commonEvent('input', null);
    commonEvent('keydown', null);
    commonEvent('keyup', null);
    commonEvent('mousedown', null);
    commonEvent('mouseup', null);
    commonEvent('mousemove', null);
    commonEvent('mouseleave', null);
    commonEvent('wheel', null);

    commonEvent('touchstart', null);
    commonEvent('touchend', null);
    commonEvent('touchcancel', null);
    commonEvent('touchmove', null);

    //common only security events
    commonEvent('copy', null);
    commonEvent('paste', null);
    commonEvent('cut', null);

    //update all elements with data-function since copying outerHTML does not include data-function
    data_function.forEach(element =>COMMON_DOCUMENT.querySelector(`#${element.id}`)['data-function'] = element.element_function);
    
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
 * @description Set custom framework functionality:
 *              show only console messages if app_framework_messages == 1
 *              save info about events created
 * @function
 * @returns {void}
 */
const custom_framework = () => {

    COMMON_GLOBAL.app_eventListeners.original = COMMON_DOCUMENT.addEventListener;
    /**
     * 
     * @param {*} stack 
     * @returns {'REACT'|'VUE'|'OTHER'}
     */
    const module = (stack) => {
        if (stack.toLowerCase().indexOf('react')>-1)
            return 'REACT';
        else {
            if (stack.toLowerCase().indexOf('vue')>-1)
                return 'VUE';
            else
                return 'OTHER';
        }
    };
    /**
     * Custom common event to keep track of framework events so they can be removed when necessary
     * No event is created for React and Vue
     * Disables test of passive listener that tries to create test event on windows objects that
     * affects touch events on mobile and on scroll divs inside third party divs
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
        if (eventmodule!='REACT' && eventmodule!='VUE')
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
 * @name commonAppMount
 * @description Mount app
 * @function
 * @param {number} app_id
 * @returns {Promise.<void>}
 */
const commonAppMount = async (app_id) =>{   
    
    COMMON_GLOBAL.app_id =          app_id;
    /**@type{common['server']['app']['commonAppMount']} */
    const CommonAppInit = await commonFFB({ path:`/app-mount/${app_id}`, 
                                            method:'GET', 
                                            query:COMMON_GLOBAL.iam_user_id!=null?`IAM_iam_user_id=${COMMON_GLOBAL.iam_user_id}`:'',
                                            authorization_type:COMMON_GLOBAL.iam_user_id!=null?'APP_ACCESS':'APP_ID'})
                            .then(app=>JSON.parse(app));
    //remove all dialogues when switching app
    Array.from(COMMON_DOCUMENT.querySelectorAll('#common_app_dialogues > div')).forEach(dialogue=>commonComponentRemove(dialogue.id));
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_div}`).innerHTML='';
    if (COMMON_GLOBAL.app_id!=COMMON_GLOBAL.app_start_app_id)
        commonComponentRemove('common_apps');

    COMMON_GLOBAL.app_id =          CommonAppInit.App.Id;
    COMMON_GLOBAL.app_logo =        CommonAppInit.App.LogoContent;
    COMMON_GLOBAL.app_copyright =   CommonAppInit.App.Copyright;
    COMMON_GLOBAL.app_link_url =    CommonAppInit.App.LinkUrl;
    COMMON_GLOBAL.app_link_title =  CommonAppInit.App.LinkTitle;
    COMMON_GLOBAL.app_text_edit =   CommonAppInit.App.TextEdit;
    
    if (COMMON_GLOBAL.iam_user_id != null)
        commonUserLoginApp(CommonAppInit.IamUserApp);
    
    CommonAppInit.App.Css==''?
        null:
            COMMON_DOCUMENT.querySelector('#app_link_app_css').href = await commonMiscResourceFetch(CommonAppInit.App.Css, null, 'text/css', CommonAppInit.App.CssContent);

    const {appMetadata, default:AppInit} = await commonMiscImport(CommonAppInit.App.Js, CommonAppInit.App.JsContent);
    
    /**@type{common['commonMetadata']} */
    const appdata = appMetadata();
    //add metadata using tree shaking pattern
    COMMON_GLOBAL.app_metadata.events.change = appdata.events.change;
    COMMON_GLOBAL.app_metadata.events.click = appdata.events.click;
    COMMON_GLOBAL.app_metadata.events.focusin = appdata.events.focusin;
    COMMON_GLOBAL.app_metadata.events.input = appdata.events.input;
    COMMON_GLOBAL.app_metadata.events.keydown = appdata.events.keydown;
    COMMON_GLOBAL.app_metadata.events.keyup = appdata.events.keyup;
    COMMON_GLOBAL.app_metadata.events.mousedown = appdata.events.mousedown;
    COMMON_GLOBAL.app_metadata.events.mouseup = appdata.events.mouseup;
    COMMON_GLOBAL.app_metadata.events.mousemove = appdata.events.mousemove;
    COMMON_GLOBAL.app_metadata.events.mouseleave = appdata.events.mouseleave;
    COMMON_GLOBAL.app_metadata.events.wheel = appdata.events.wheel;
    COMMON_GLOBAL.app_metadata.events.touchstart = appdata.events.touchstart;
    COMMON_GLOBAL.app_metadata.events.touchend = appdata.events.touchend;
    COMMON_GLOBAL.app_metadata.events.touchcancel = appdata.events.touchcancel;
    COMMON_GLOBAL.app_metadata.events.touchmove = appdata.events.touchmove;
    COMMON_GLOBAL.app_metadata.lifeCycle.onMounted = appdata.lifeCycle?.onMounted;
    
    await AppInit(commonGet(), CommonAppInit.AppParameter);
    COMMON_GLOBAL.app_metadata.lifeCycle.onMounted?
        await COMMON_GLOBAL.app_metadata.lifeCycle.onMounted():
            null;
    commonFrameworkSet(null);
    if (COMMON_GLOBAL.iam_user_id){
        commonUserUpdateAvatar(true, COMMON_GLOBAL.iam_user_avatar);
        commonUserMessageShowStat();
    }
    else
        commonUserUpdateAvatar(false, null);

    CommonAppInit.App.CssReport==''?
        null:
            COMMON_DOCUMENT.querySelector('#app_link_app_report_css').href = await commonMiscResourceFetch(CommonAppInit.App.CssReport, null, 'text/css', CommonAppInit.App.CssReportContent);
    CommonAppInit.App.Favicon32x32==''?
        null:
            COMMON_DOCUMENT.querySelector('#app_link_favicon_32x32').href = await commonMiscResourceFetch(CommonAppInit.App.Favicon32x32, null, 'image/png', CommonAppInit.App.Favicon32x32Content);
    CommonAppInit.App.Favicon192x192==''?
        null:
            COMMON_DOCUMENT.querySelector('#app_link_favicon_192x192').href = await commonMiscResourceFetch(CommonAppInit.App.Favicon192x192, null, 'image/png',CommonAppInit.App.Favicon192x192Content);
};
/**
 * @name commonGet
 * @description Returns all functions and globals
 * @function
 * @returns {common['CommonModuleCommon']}
 */
const commonGet = () =>{
    return {
        COMMON_DOCUMENT:COMMON_DOCUMENT,
        commonGlobalGet,
        commonGlobalSet,
        /* MISC */
        commonMiscElementId:commonMiscElementId, 
        commonMiscElementRow:commonMiscElementRow, 
        commonMiscElementListTitle:commonMiscElementListTitle, 
        commonMiscFormatJsonDate:commonMiscFormatJsonDate,
        commonMiscImport:commonMiscImport,
        commonMiscImportmap:commonMiscImportmap,
        commonMiscInputControl:commonMiscInputControl,
        commonMiscListKeyEvent:commonMiscListKeyEvent,
        commonMiscMobile:commonMiscMobile,
        commonMiscPreferencesUpdateBodyClassFromPreferences:commonMiscPreferencesUpdateBodyClassFromPreferences,
        commonMiscPrint:commonMiscPrint,
        commonMiscResourceFetch:commonMiscResourceFetch,
        commonMiscRoundOff:commonMiscRoundOff,
        commonMiscSelectCurrentValueSet:commonMiscSelectCurrentValueSet,
        commonMiscTimezoneDate:commonMiscTimezoneDate,
        commonMiscTypewatch:commonMiscTypewatch,
        commonMiscShowDateUpdate:commonMiscShowDateUpdate,
        commonMiscSecondsToTime:commonMiscSecondsToTime,
        commonMiscLoadFont:commonMiscLoadFont,
        commonMiscCssApply:commonMiscCssApply,
        /**WINDOW OBJECT */
        commonWindowGet:commonWindowGet,
        commonWindowDocumentFrame:commonWindowDocumentFrame,
        commonWindowFromBase64:commonWindowFromBase64, 
        commonWindowNavigatorLocale:commonWindowNavigatorLocale,
        commonWindowOpen:commonWindowOpen,
        commonWindowPrompt:commonWindowPrompt,
        commonWindowSetTimeout:commonWindowSetTimeout,
        commonWindowToBase64:commonWindowToBase64, 
        commonWindowUserAgentPlatform:commonWindowUserAgentPlatform,
        commonWindowWait:commonWindowWait,
        /* COMPONENTS */
        commonComponentRemove:commonComponentRemove,
        commonComponentRender:commonComponentRender,
        /* FRAMEWORK */
        commonFrameworkSet:commonFrameworkSet,
        /* DIALOGUE */
        commonDialogueShow:commonDialogueShow, 
        /* MESSAGE*/
        commonMessageShow:commonMessageShow,
        commonMesssageNotAuthorized:commonMesssageNotAuthorized,
        /* PROFILE */
        commonProfileDetail:commonProfileDetail, 
        commonProfileShow:commonProfileShow,
        commonProfileStat:commonProfileStat, 
        /* USER  */
        commonUserLogin:commonUserLogin, 
        commonUserLogout:commonUserLogout,
        commonLogout:commonLogout,
        commonUserSessionClear:commonUserSessionClear,
        commonUserSessionCountdown:commonUserSessionCountdown, 
        commonUserAuthenticateCode:commonUserAuthenticateCode,
        commonUserMessageShowStat:commonUserMessageShowStat,
        commonUserUpdateAvatar:commonUserUpdateAvatar,
        commonUserLocale:commonUserLocale,
        /* FFB */
        commonFFB:commonFFB,
        /* SERVICE SOCKET */
        commonSocketSSEShow:commonSocketSSEShow, 
        commonSocketConnectOnlineCheck:commonSocketConnectOnlineCheck,
        /* GEOLOCATION */
        commonGeolocationPlace:commonGeolocationPlace,
        /* EVENT */
        commonEvent:commonEvent,
        /* INIT */
        commonAppMount:commonAppMount,
        commonGlobals:commonGlobals,
        commonInit:commonInit,
        default:{commonInit}};
};

/**
 * 
 * @name commonGlobals
 * @description Sets start globals
 * @function
 * @param {string} globals
 * @returns {void}
 */
const commonGlobals = globals => {  
    const globalsObj = JSON.parse(commonWindowFromBase64(globals));
    Object.entries(globalsObj).forEach(key=>{
        /**@ts-ignore */
        COMMON_GLOBAL[key[0]] = key[1];
    });
};
/**
 * @name commonInit
 * @description Init common
 * @function
 * @param {{globals:string,
 *          cssFontsStart:string,
 *          cssCommon:string,
 *          jsCrypto:string}} parameters
 * @returns {Promise.<void>}
 */
const commonInit = async parameters => {  

    //apply start fonts + common css
    commonMiscCssApply(commonWindowFromBase64(parameters.cssFontsStart) + commonWindowFromBase64(parameters.cssCommon));

    //set globals
    commonGlobals(parameters.globals);
    //import crypto functions
    const {encrypt, decrypt} = await import(URL.createObjectURL(  new Blob ([commonWindowFromBase64(parameters.jsCrypto)],{type: 'text/javascript'})))
                                    .then(crypto=>{
                                        return {encrypt:crypto.subtle.encrypt, decrypt:crypto.subtle.decrypt};
                                    });
    COMMON_GLOBAL.x.encrypt = encrypt;
    COMMON_GLOBAL.x.decrypt = decrypt;

    commonUserPreferencesGlobalSetDefault('LOCALE');
    commonUserPreferencesGlobalSetDefault('TIMEZONE');
    commonUserPreferencesGlobalSetDefault('DIRECTION');
    commonUserPreferencesGlobalSetDefault('ARABIC_SCRIPT');

    setUserAgentAttributes();
    custom_framework();
    //set common app id
    COMMON_GLOBAL.app_id =                          COMMON_GLOBAL.app_common_app_id;
    //load message component
    await commonComponentRender({
        mountDiv:       null,
        data:           null,
        methods:        null,
        path:           '/common/component/common_app_dialogues_message.js'});
    //connect to BFF
    await commonFFB({path:               '/server-bff/' + COMMON_GLOBAL.x.uuid, 
        method:             'POST',
        body:               null,
        response_type:      'SSE',
        authorization_type: 'APP_ID'});

    //mount start app
    commonAppMount(COMMON_GLOBAL.app_start_app_id);

    //apply font css
    COMMON_GLOBAL.app_fonts?commonMiscCssApply(COMMON_GLOBAL.app_fonts.join('@')):null;
    
};
export{/* GLOBALS*/
       COMMON_DOCUMENT,
       commonGlobalGet,
       commonGlobalSet,
       /* MISC */
       commonMiscElementId, 
       commonMiscElementRow, 
       commonMiscElementListTitle, 
       commonMiscFormatJsonDate,
       commonMiscImport,
       commonMiscImportmap,
       commonMiscInputControl,
       commonMiscListKeyEvent,
       commonMiscMobile,
       commonMiscPreferencesUpdateBodyClassFromPreferences,
       commonMiscPrint,
       commonMiscResourceFetch,
       commonMiscRoundOff, 
       commonMiscSelectCurrentValueSet,
       commonMiscTimezoneDate, 
       commonMiscTypewatch,      
       commonMiscShowDateUpdate,
       commonMiscSecondsToTime,
       commonMiscLoadFont,
       commonMiscCssApply,
       /**WINDOW OBJECT */
       commonWindowGet,
       commonWindowDocumentFrame,
       commonWindowFromBase64, 
       commonWindowNavigatorLocale,
       commonWindowOpen,
       commonWindowPrompt,
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
       /* MESSAGE*/
       commonMessageShow,
       commonMesssageNotAuthorized,
       /* PROFILE */
       commonProfileDetail, 
       commonProfileShow,
       commonProfileStat, 
       /* USER  */
       commonUserLogin, 
       commonUserLogout,
       commonLogout,
       commonUserSessionClear,
       commonUserSessionCountdown, 
       commonUserAuthenticateCode,
       commonUserMessageShowStat,
       commonUserUpdateAvatar,
       commonUserLocale,
       /* FFB */
       commonFFB,
       /* SERVICE SOCKET */
       commonSocketSSEShow, 
       commonSocketConnectOnlineCheck,
       /* GEOLOCATION */
       commonGeolocationPlace,
       /* EVENT */
       commonEvent,
       /* INIT */
       commonAppMount,
       commonGlobals,
       commonInit};
export default {commonInit};