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
    app_root:'app_root',
    app_div:'app',
    app_console:{warn:COMMON_WINDOW.console.warn, info:COMMON_WINDOW.console.info, error:COMMON_WINDOW.console.error},
    app_eventListeners:{original: HTMLElement.prototype.addEventListener, REACT:[], VUE:[], OTHER:[]},
    app_function_exception:null,
    app_function_session_expired:null,
    app_function_sse:null,
    app_fonts:[],
    app_fonts_loaded:[],
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
    token_at:null,
    token_dt:null,
    token_admin_at:null,
    token_exp:null,
    token_iat:null,
    rest_resource_bff:null,
    user_locale:'',
    user_timezone:'',
    user_direction:'',
    user_arabic_script:'',
    resource_import:[],
    component_import:[],
<<<<<<< HEAD
    component:{
        common_dialogue_iam_verify:{
            methods:{
                commonUserVerifyCheckInput:()=>null
            }
        },
        common_dialogue_info:{
            methods:{
                eventClickSend:()=>null
            }
        },
        common_dialogue_user_menu:{
            methods:{
                eventClickPagination:()=>null,
                eventClickMessage:()=>null,
                eventClickMessageDelete:()=>null,
                eventClickNavMessages:()=>null,
                eventClickNavIamUser:()=>null,
                eventClickNavIamUserApp:()=>null
            }
        }
    },
    moduleLeaflet:{methods:{eventClickCountry:          ()=>null, 
                            eventClickCity:             ()=>null,
                            eventClickMapLayer:         ()=>null,
                            eventClickControlZoomIn:    ()=>null,
                            eventClickControlZoomOut:   ()=>null,
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
=======
    component:{}
>>>>>>> 84a71f77 (AP-110 replaces Leaflet in app 4 with new common_map and removes Leaflet files and references and updates AppTranslation.json and documentation, removes popular place functionality and elements below map in settings in app 4 including demo.json and AppParameter.json, removes addLineString() so GeoJSON is used with drawVectors() and adds updateVectors() in common_map.js, refactors getPlace() to return more results and checks if partition not found in common_geolocation.js, adds data-gps so vector can be updated in common_map_line.js and updates types and css)
};
Object.seal(COMMON_GLOBAL);

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
 * @param {string} html
 * @returns {Promise.<void>}
 */
const commonMiscPrint = async html => {
    const id = 'PRINT_' + Date.now();
    COMMON_DOCUMENT.querySelector('#common_app').innerHTML += `<iframe id='${id}'></iframe>>`;
    const printelement = COMMON_DOCUMENT.querySelector(`#${id}`);
    printelement.contentWindow.document.open();
    printelement.contentWindow.document.write(html);

    for (const font of COMMON_GLOBAL.app_fonts_loaded) {         
        const fontNew = new FontFace(
            font.family,
            'url(' + font.url + ')',
            font.attributes
        );  
        fontNew.load().then(()=>{
            printelement.contentWindow.document.fonts.add(fontNew);
        });
    }  
    printelement.focus();

    //await delay to avoid browser render error
    await new Promise (resolve=>commonWindowSetTimeout(()=> {printelement.contentWindow.print();resolve(null);}, 100));
    COMMON_DOCUMENT.querySelector(`#common_app #${printelement.id}`).remove();
};
/**
 * @name commonMiscResourceFetch
 * @description fetches resources and updates attributes on element or return result if no element found
 *              'text/javascript' is used here for a link, not import()
 * @param {string} url
 * @param {HTMLElement|null} element
 * @param { 'image/png'|'image/webp'|
 *          'application/json'|
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
 * @param {string} cssText
*/
const commonMiscCssApply = cssText =>{
    const css = new CSSStyleSheet();
    css.replace(cssText);
    
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];
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
 * @aram {boolean} btoa_only
 * @returns {string}
 */
const commonWindowToBase64 = (str,btoa=false) => COMMON_WINDOW.btoa(btoa?str:COMMON_WINDOW.encodeURIComponent(str));

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
 * @returns {COMMON_DOCUMENT}
 */
const commonWindowDocumentFrame = () => COMMON_WINDOW.frames.document;

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
                            //check if removed
                            if (!COMMON_DOCUMENT.querySelector(`#${div_id}`)) {
                                //remove shared component including methods and events
                                if (COMMON_GLOBAL.component[tracked[div_id].componentName])
                                    delete COMMON_GLOBAL.component[tracked[div_id].componentName];
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
 * @returns {Promise.<{data:*, methods:*, template:string|null}>}
 */
const commonComponentRender = async parameters => {
    const {default:ComponentCreate} = await commonMiscImport(parameters.path);
    if (parameters.mountDiv)
        COMMON_DOCUMENT.querySelector(`#${parameters.mountDiv}`).innerHTML = '<div class=\'css_spinner\'></div>';

    /**@type{common['CommonComponentResult']}*/
    const component = await ComponentCreate({   data:       {...parameters.data,       ...{commonMountdiv:parameters.mountDiv}},
                                                methods:    {...parameters.methods,    ...{ COMMON:commonGet()}}})
                                                .catch((/**@type{Error}*/error)=>{
                                                    parameters.mountDiv?commonComponentRemove(parameters.mountDiv, true):null;
                                                    commonException(COMMON_GLOBAL.app_function_exception, error);
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
        
        //set component name from filename without .js
        const componentName = parameters.path.split('/').reverse()[0].split('.')[0];
        //use Vue.createApp and data() return pattern and React.createRef() + current key pattern to share methods
        //share methods
        if (parameters.path.startsWith('/common/component/') && component.methods){
            if (!COMMON_GLOBAL.component[componentName])
                COMMON_GLOBAL.component[componentName]={};
            COMMON_GLOBAL.component[componentName].methods = component.methods;
        }
        //share events to event delegation in commonEvent()
        if (parameters.path.startsWith('/common/component/') && component.events){
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
        
    }
    //return data and methods from component to be used in apps
    return {data:component?component.data:null, methods:component?component.methods:null, template:component?.template??null};
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
    if (APPDIV){
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
                    mountDiv:   'common_dialogue_iam_verify',
                    data:       {
                                    common_app_id:              COMMON_GLOBAL.app_common_app_id,
                                    iam_user_id:                COMMON_GLOBAL.iam_user_id,
                                    user_verification_type:     user_verification_type
                                },
                    methods:    {   commonFFB:                  commonFFB,
                                    commonMessageShow:          commonMessageShow,
                                    commonComponentRemove:      commonComponentRemove,
                                    commonComponentRender:      commonComponentRender,
                                    commonDialogueShow:         commonDialogueShow,
                                    commonUserLogout:           commonUserLogout,
                                    commonMesssageNotAuthorized:commonMesssageNotAuthorized,
                                    commonUserUpdate:           commonUserUpdate,
                                    commonUserAuthenticateCode: commonUserAuthenticateCode,
                                    commonUserSessionCountdown: commonUserSessionCountdown
                                },
                    path:       '/common/component/common_dialogue_iam_verify.js'})
                    .then((/**@type{{   data:null,
                                        methods:{   commonUserVerifyCheckInput:     function}}}*/component)=>{
                            COMMON_GLOBAL.component.common_dialogue_iam_verify.methods.commonUserVerifyCheckInput =  component.methods.commonUserVerifyCheckInput;
                    });
                commonComponentRemove('common_dialogue_iam_start');
                break;
            }
        case 'LOGIN_ADMIN':
        case 'LOGIN':
        case 'SIGNUP':{
            await commonComponentRender({
                mountDiv:       'common_dialogue_iam_start',
                data:           {
                                type:               dialogue=='LOGIN_ADMIN'?null:dialogue,
                                app_id:             COMMON_GLOBAL.app_id,
                                admin_app_id:       COMMON_GLOBAL.app_admin_app_id,
                                admin_only: 		COMMON_GLOBAL.admin_only,
                                admin_first_time:   COMMON_GLOBAL.admin_first_time
                                },
                methods:        {
                                commonMiscElementId:commonMiscElementId,
                                commonDialogueShow:commonDialogueShow,
                                commonComponentRemove:commonComponentRemove,
                                commonUserSignup:commonUserSignup,
                                commonFFB:commonFFB
                                },
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
 * @param {function|null} function_event 
 * @param {string|null} text_class
 * @param {*} message 
 * @returns {Promise.<void>}
 */
const commonMessageShow = async (message_type, function_event, text_class=null, message=null) => {
    commonComponentRender({
        mountDiv:       'common_dialogue_message',
        data:           {
                        message_type:message_type,
                        text_class:text_class,
                        message:message
                        },
        methods:        {
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
 * @name commonLovEvent
 * @description LOV event
 * @function
 * @param {common['CommonAppEvent']} event
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
     * @param {common['CommonAppEvent']} event_lov 
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
 * @param {common['CommonAppEvent']} event 
 * @param {string} lov 
 * @param {string|null} old_value
 * @param {string} path 
 * @param {string} query 
 * @param {common['CommonRESTAPIMethod']} method 
 * @param {common['CommonRESTAPIAuthorizationType']} authorization_type 
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
                    common_app_id:COMMON_GLOBAL.app_common_app_id,  
                    app_id:COMMON_GLOBAL.app_id,  
                    user_locale:COMMON_GLOBAL.user_locale,
                    lov:parameters.lov,
                    lov_custom_list:parameters.lov_custom_list,
                    lov_custom_value:parameters.lov_custom_value
                    },
        methods:    {
                    function_event:parameters.function_event,
                    commonWindowFromBase64:commonWindowFromBase64,
                    commonFFB:commonFFB
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
        row.classList.remove ('common_row_hide');
        row.classList.remove ('common_row_selected');
    }
    for (const row of rows) {
        if (row.children[0].children[0].textContent.toUpperCase().indexOf(text_filter.toUpperCase()) > -1 ||
            row.children[1].children[0].textContent.toUpperCase().indexOf(text_filter.toUpperCase()) > -1){
                row.classList.remove ('common_row_hide');
            }
        else{
            row.classList.remove ('common_row_hide');
            row.classList.add ('common_row_hide');
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
                        iam_user_id:COMMON_GLOBAL.iam_user_id,
                        iam_user_id_profile:COMMON_DOCUMENT.querySelector('#common_profile_id').textContent,
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
                    iam_user_id:COMMON_GLOBAL.iam_user_id
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
 * @param {number|null} iam_user_id_other 
 * @param {string|null} username 
 * @returns {Promise.<void>}
 */
const commonProfileShow = async (iam_user_id_other = null, username = null) => {
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
                    iam_user_id:COMMON_GLOBAL.iam_user_id,
                    iam_user_id_other:iam_user_id_other,
                    username:username
                    },
        methods:    {
                    commonWindowSetTimeout:commonWindowSetTimeout,
                    commonFFB:commonFFB,
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
       commonFFB({path:`/server-db/iamuser-profile/${profile_id.textContent}`, 
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
 * @returns {Promise. <{    avatar: string|null}>}
 */
const commonUserLogin = async () => {
    let spinner_item = '';
    let current_dialogue = '';
    if (COMMON_GLOBAL.app_admin_app_id == COMMON_GLOBAL.app_id) {
        spinner_item = 'common_dialogue_iam_start_login_admin_button';
        current_dialogue = 'common_dialogue_iam_start';
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
        spinner_item = 'common_dialogue_iam_start_login_button';
        current_dialogue = 'common_dialogue_iam_start';
        if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start'),
                        {
                        username: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_username'),
                        password: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_password')
                        })==false)
            throw 'ERROR';
    }
    const result_iam = await commonFFB({path:'/server-iam-login', 
                                        method:'POST', 
                                        authorization_type:'IAM', 
                                        username:encodeURI(COMMON_GLOBAL.app_admin_app_id == COMMON_GLOBAL.app_id?
                                                            COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_admin_username').textContent:
                                                                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_username').textContent),
                                        password:encodeURI(COMMON_GLOBAL.app_admin_app_id == COMMON_GLOBAL.app_id?
                                                            COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_admin_password').textContent:
                                                                COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_login_password').textContent),
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
            commonComponentRemove(current_dialogue, true);
        }
        else{
            COMMON_GLOBAL.token_admin_at= null;
            COMMON_GLOBAL.token_at	    = JSON.parse(result_iam).token_at;
            commonUserUpdateAvatar(true, COMMON_GLOBAL.iam_user_avatar);
            commonComponentRemove(current_dialogue, true);
            commonComponentRemove('common_dialogue_profile', true);
        }
        commonUserMessageShowStat();
        await commonUserLoginApp(spinner_item);
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
 * @param {string|null} spinner_item
 * @returns {Promise.<void>}
 */
const commonUserLoginApp = async spinner_item =>{
    const IamUserApp = await commonFFB({path:'/server-iam/iamuserapp', 
                                        body:{  IAM_data_app_id: COMMON_GLOBAL.app_id, 
                                                IAM_iam_user_id: COMMON_GLOBAL.iam_user_id},
                                        method:'POST', authorization_type:'APP_ACCESS', spinner_id:spinner_item})
                                .then(result=>JSON.parse(result)[0])
                                .catch(()=>null);
    COMMON_GLOBAL.iam_user_app_id = IamUserApp.id;
    //get preferences saved in json_data column
    //locale
    if (IamUserApp.json_data?.preference_locale==null)
        commonUserPreferencesGlobalSetDefault('LOCALE');
    else
        COMMON_GLOBAL.user_locale = IamUserApp.json_data.preference_locale;
    //timezone
    if (IamUserApp.json_data?.preference_timezone==null)
        commonUserPreferencesGlobalSetDefault('TIMEZONE');
    else
        COMMON_GLOBAL.user_timezone = IamUserApp.json_data.preference_timezone;
    //direction
    COMMON_GLOBAL.user_direction = IamUserApp.json_data?.preference_direction;
    //arabic script
    COMMON_GLOBAL.user_arabic_script = IamUserApp.json_data?.preference_arabic_script;
    //update body class with app theme, direction and arabic script usage classes
    commonMiscPreferencesUpdateBodyClassFromPreferences();
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
    commonComponentRemove('common_dialogue_user_menu');
    commonWindoInfoClose();
    commonComponentRemove('common_dialogue_iam_verify');
    if (COMMON_GLOBAL.app_id != COMMON_GLOBAL.app_admin_app_id){
        commonUserUpdateAvatar(false,null );
        commonComponentRemove('common_dialogue_iam_verify');
        commonComponentRemove('common_dialogue_iam_start');
        commonComponentRemove('common_dialogue_profile', true);
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
 * @name commonUserUpdate
 * @description User update
 * @function
 * @param {string|null} totp
 * @returns {Promise.<boolean>}
 */
const commonUserUpdate = async (totp=null) => {
    if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user'),
                            {
                            username: COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_username'),
                            password: COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password'),
                            password_confirm: COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password_confirm'),
                            password_confirm_reminder: COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password_reminder'),
                            password_new: COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password_new'),
                            password_new_confirm: COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password_new_confirm'),
                            bio: COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_bio')
                            })==false)
                return false;
    if (totp==null){
        commonDialogueShow('VERIFY', '3');
        return false;
    }
    else
        return new Promise(resolve=>{
            const username =            COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_username').textContent;
            const bio =                 COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_bio').textContent;
            const avatar =              COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_avatar').getAttribute('data-image').replace('null','')==''?
                                            null:
                                                COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_avatar').getAttribute('data-image').replace('null','');
            const password =            COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password').textContent;
            const password_new =        COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password_new').textContent;
            const password_reminder =   COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password_reminder').textContent;

            commonFFB({ path:`/server-iam/iamuser/${COMMON_GLOBAL.iam_user_id ?? ''}`, 
                        method:'PATCH', 
                        authorization_type:COMMON_GLOBAL.app_id==COMMON_GLOBAL.app_admin_app_id?'ADMIN':'APP_ACCESS', 
                        body:{  username:           username,
                                password:           password,
                                password_new:       password_new==''?null:password_new,
                                bio:                bio,
                                private:            Number(COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_checkbox_profile_private').classList.contains('checked')),
                                password_reminder:  password_reminder,
                                avatar:             avatar,
                                totp:               totp
                            }, 
                        spinner_id:'common_dialogue_user_menu_iam_user_btn_user_update'})
            .then((result)=>{
                if (JSON.parse(result).updated==1){
                    commonUserSessionClear();
                    resolve(true);
                }
                else
                    resolve(false);
            })
            .catch(()=>false);
        });
};
/**
 * @name commonUserSignup
 * @description User signup
 * @function
 * @returns {void}
 */
const commonUserSignup = () => {
    if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start'),
                            {
                            username: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_username'),
                            password: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password'),
                            password_confirm: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_confirm'),
                            password_confirm_reminder: COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_reminder')
                            })==true){
        const json_data = { username:           COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_username').textContent,
                            password:           COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password').textContent,
                            password_reminder:  COMMON_DOCUMENT.querySelector('#common_dialogue_iam_start_signup_password_reminder').textContent,
                            active:             0
                            };
           
       commonFFB({path:'/server-iam/iamuser', method:'POST', authorization_type:'IAM_SIGNUP', body:json_data, spinner_id:'common_dialogue_iam_start_signup_button'})
        .then(result=>{
            COMMON_GLOBAL.iam_user_app_id = JSON.parse(result).iam_user_app_id;
            COMMON_GLOBAL.iam_user_id =     JSON.parse(result).iam_user_id;
            COMMON_GLOBAL.token_at =        JSON.parse(result).token_at;
            COMMON_GLOBAL.token_exp =       JSON.parse(result).exp;
            COMMON_GLOBAL.token_iat =       JSON.parse(result).iat;
            commonMessageShow('INFO', null, null,JSON.parse(result).otp_key);
            
            commonDialogueShow('VERIFY', 'SIGNUP');
        });
    }
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
        const user_id_profile = Number(COMMON_DOCUMENT.querySelector('#common_profile_id').textContent);
        /**@type{common['CommonRESTAPIMethod']} */
        let method;
        let path;
        let json_data;
        const check_div = COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`);
        if (check_div.children[0].style.display == 'block') {
            path = `/server-db/iamuser${function_name.toLowerCase()}`;
            method = 'POST';
            json_data = {   IAM_iam_user_id: COMMON_GLOBAL.iam_user_id,
                            [`iam_user_id_${function_name.toLowerCase()}`]: user_id_profile

};
        } else {
            path = `/server-db/iamuser${function_name.toLowerCase()}/${COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).getAttribute('data-record_id')}`;
            method = 'DELETE';
            json_data = { IAM_iam_user_id: COMMON_GLOBAL.iam_user_id};
        }
        if (COMMON_GLOBAL.iam_user_id == null)
            commonDialogueShow('LOGIN');
        else {
           commonFFB({path:path, method:method, authorization_type:'APP_ACCESS', body:json_data})
            .then(result=> {
                if (COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display == 'block'){
                    //follow/like
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display = 'none';
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[1].style.display = 'block';
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).setAttribute('data-record_id',JSON.parse(result).insertId);
                }
                else{
                    //unfollow/unlike
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[0].style.display = 'block';
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).children[1].style.display = 'none';
                    COMMON_DOCUMENT.querySelector(`#common_profile_${function_name.toLowerCase()}`).setAttribute('data-record_id',null);
                }
                resolve(null);
            })
            .catch(err=>reject(err));
        }
    });
};
/**
 * @name commonIamUserAppDelete
 * @description IamUserApp delete
 * @function
 * @param {number|null} choice 
 * @param {function|null} function_delete_event 
 * @returns {Promise.<null>}
 */
const commonIamUserAppDelete = (choice=null, function_delete_event=null) => {
    return new Promise((resolve, reject)=>{
        const password = COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password').textContent;
        switch (choice){
            case null:{
                if (commonMiscInputControl(COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user'),
                                    {
                                        password: COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_input_password')
                                    })==false)
                    resolve(null);
                else{
                    commonMessageShow('CONFIRM',function_delete_event, null, null);
                    resolve(null);
                }
                break;
            }
            case 1:{
                commonComponentRemove('common_dialogue_message');
    
                commonFFB({ path:`/server-iam/iamuserapp/${COMMON_GLOBAL.iam_user_app_id}`, 
                            body:{  password: password,
                                    IAM_data_app_id:COMMON_GLOBAL.app_id, 
                                    IAM_iam_user_id:COMMON_GLOBAL.iam_user_id}, 
                            method:'DELETE', 
                            authorization_type:'APP_ACCESS',
                            spinner_id:'common_dialogue_user_menu_iam_user_btn_user_delete_account'})
                .then(()=>  resolve((()=>{
                                        commonComponentRemove('common_dialogue_user_menu',true);
                                        commonMountApp(COMMON_GLOBAL.app_start_app_id);return null;
                                        })()))
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
    if (COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_nav_messages_count') ||
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_message_count_text')){
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
        if (COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_nav_messages_count'))
            COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_nav_messages_count').textContent = `${messageStat.unread}(${messageStat.unread+messageStat.read})`;
        if (COMMON_DOCUMENT.querySelector('#common_iam_avatar_message_count_text'))
            COMMON_DOCUMENT.querySelector('#common_iam_avatar_message_count_text').textContent = `${messageStat.unread}(${messageStat.unread+messageStat.read})`;
        
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
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').style.backgroundImage= avatar?
                                                                                                `url('${avatar}')`:
                                                                                                    'url()';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').setAttribute('data-image',avatar);
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_in').style.display = 'inline-block';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_out').style.display = 'none';
    }
    else{
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').style.backgroundImage= 'url()';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_avatar_img').setAttribute('data-image',null);
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_in').style.display = 'none';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_logged_out').style.display = 'inline-block';
        COMMON_DOCUMENT.querySelector('#common_iam_avatar_message_count_text').textContent = '';
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
 * @name commonUserPreferenceSave
 * @description User preference save
 * @function
 * @returns {Promise.<void>}
 */
const commonUserPreferenceSave = async () => {
    if (COMMON_GLOBAL.iam_user_app_id != null){
        const body = {
                        IAM_data_app_id: COMMON_GLOBAL.app_id,
                        IAM_iam_user_id: COMMON_GLOBAL.iam_user_id,
                        json_data: 
                        {  
                            preference_locale:       COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_app_locale_select .common_select_dropdown_value')
                                                                        .getAttribute('data-value'),
                            preference_timezone:     COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_app_timezone_select .common_select_dropdown_value')
                                                                        .getAttribute('data-value'),
                            preference_direction:    COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_app_direction_select .common_select_dropdown_value')
                                                                        .getAttribute('data-value'),
                            preference_arabic_script:COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_app_arabic_script_select .common_select_dropdown_value')
                                                                        .getAttribute('data-value'),
                        }
                    };
        await commonFFB({path:`/server-db/iamuserapp/${COMMON_GLOBAL.iam_user_app_id}`, method:'PATCH', authorization_type:'APP_ACCESS', body:body});
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
 * @description Receives server side event from BFF, decrypts message using start uuid and delegates message
 * @param {{socket:*, 
 *          uuid:string|null, 
 *          secret:string|null}} parameters
 */
const common_FFBSSE = async parameters =>{
    /**
     * @param {string|null} BFFmessage
     * @returns {{sse_type:string,
     *           sse_message:string}}
     */
    const getMessage = BFFmessage =>{
        if (BFFmessage){
            const messageDecoded = commonWindowFromBase64(BFFmessage);
            return {sse_type:JSON.parse(messageDecoded).sse_type,
                    sse_message:JSON.parse(messageDecoded).sse_message};
        }
        else
            return {sse_type:'',
                    sse_message:''};
    };
    const BFFStream = new WritableStream({
        async write(data){
            const BFFmessage = COMMON_GLOBAL.x.decrypt({  
                                    iv:         JSON.parse(atob(parameters.secret??'')).iv,
                                    key:        JSON.parse(atob(parameters.secret??'')).jwk.k, 
                                    ciphertext: new TextDecoder('utf-8').decode(data).split('\\n\\n')[0].split('data: ')[1]});
            const SSEmessage = getMessage(BFFmessage);
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
    parameters.socket.pipeTo(BFFStream).catch(()=>commonWindowSetTimeout(()=>{commonSocketConnectOnline();}, 5000));
};
/**
 * @name commonFFB
 * @description Frontend for Backend (FFB)
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
     * @param {{app_id:number,
     *          uuid:string,
     *          secret:string,
     *          response_type?:'SSE'|'TEXT'|'BLOB',
     *          spinner_id?:string|null,
     *          timeout?:number|null,
     *          app_admin_app_id:number,
     *          rest_api_version: string,
     *          rest_bff_path   : string,
     *          data:{
     *              locale:string,
     *              idToken: string,
     *              accessToken?:string,
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
        const ROLE = (parameters.app_id == parameters.app_admin_app_id && parameters.data.authorization_type =='APP_ACCESS')?
                        'ADMIN':parameters.data.authorization_type;
        switch (ROLE){
            case 'APP_ACCESS':
            case 'APP_ACCESS_VERIFICATION':
            case 'APP_ACCESS_EXTERNAL':
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
        parameters.data.query += '&locale=' + (parameters.data.locale??'');

        //encode query parameters
        const encodedparameters = parameters.data.query?commonWindowToBase64(parameters.data.query):'';
        const bff_path = parameters.rest_bff_path + '/' + 
                            ROLE.toLowerCase() + 
                            '/v' + (parameters.rest_api_version ??1);
        const url = ('/bff/x/' + parameters.uuid);

        if (parameters.spinner_id && COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
            COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.add('css_spinner');
        const resultFetch = {finished:false};
        const options =     {
                            cache:  'no-store',
                            method: 'POST',
                            headers:{
                                        ...(parameters.response_type =='SSE' && {'Cache-control': 'no-cache'}),
                                        'Content-Type': 'application/json',
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
                                                        'app-id':       parameters.app_id,
                                                        'app-signature':COMMON_GLOBAL.x.encrypt({ 
                                                                            iv:     JSON.parse(commonWindowFromBase64(parameters.secret)).iv,
                                                                            key:    JSON.parse(commonWindowFromBase64(parameters.secret)).jwk.k, 
                                                                            data:   JSON.stringify({app_id: parameters.app_id })}),
                                                        'app-id-token': 'Bearer ' + parameters.data.idToken,
                                                        ...(authorization && {Authorization: authorization}),
                                                        'Content-Type': parameters.response_type =='SSE'?
                                                                            'text/event-stream':
                                                                                'application/json',
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
         * @param {*} message
         */
        const showError      = message   => commonMessageShow('ERROR_BFF', null, null, message);
        return parameters.response_type=='SSE'?
            /**@ts-ignore */
            fetch(url, options).then(result=>common_FFBSSE({socket:result.body, uuid:parameters.uuid, secret:parameters.secret})):
                await Promise.race([ new Promise((resolve)=>
                    setTimeout(()=>{
                        if (resultFetch.finished==false){
                            showError('🗺⛔?');
                            resolve('🗺⛔?');
                            throw ('TIMEOUT');
                        }
                        }, parameters.app_id == parameters.app_admin_app_id?
                                (1000 * 60 * COMMON_GLOBAL.app_requesttimeout_admin_minutes):
                                parameters.timeout || (1000 * COMMON_GLOBAL.app_requesttimeout_seconds))),
                    /**@ts-ignore */
                    await fetch(url, options)
                        .then(response =>{
                            status = response.status;
                            return response.text();
                        })
                        .then(result => {
                            const result_decrypted = 
                                        COMMON_GLOBAL.x.decrypt({
                                                iv:         JSON.parse(commonWindowFromBase64(parameters.secret)).iv,
                                                key:        JSON.parse(commonWindowFromBase64(parameters.secret)).jwk.k,
                                                ciphertext: result});
                            switch (status){
                                case 200:
                                case 201:{
                                    /**@ts-ignore */
                                    return result_decrypted;
                                }
                                case 400:{
                                    //Bad request
                                    commonMessageShow('ERROR_BFF', null, 'message_text', '!');
                                    throw result_decrypted;
                                }
                                case 404:   //Not found
                                case 401:   //Unauthorized, token expired
                                case 403:   //Forbidden, not allowed to login or register new user
                                case 503:   //Service unavailable or other error in microservice
                                {   
                                    showError(result_decrypted);
                                    throw result_decrypted;
                                }
                                case 500:{
                                    //Unknown error
                                    commonException(COMMON_GLOBAL.app_function_exception, result_decrypted);
                                    throw result_decrypted;
                                }
                            }
                        })
                        .catch(error=>{
                            throw error;
                        })
                        .finally(()=>{
                            resultFetch.finished=true;
                            if (parameters.spinner_id && COMMON_DOCUMENT?.querySelector('#' + parameters.spinner_id))
                                COMMON_DOCUMENT.querySelector('#' + parameters.spinner_id).classList.remove('css_spinner');
                        })
        ]);
    };
    return await FFB({
            app_id: COMMON_GLOBAL.app_id,
            uuid: COMMON_GLOBAL.x.uuid??'',
            secret: COMMON_GLOBAL.x.secret??'',
            response_type: parameter.response_type??'TEXT',
            spinner_id: parameter.spinner_id,
            timeout: parameter.timeout,
            app_admin_app_id:COMMON_GLOBAL.app_admin_app_id,
            rest_api_version: COMMON_GLOBAL.app_rest_api_version??'',
            rest_bff_path   : COMMON_GLOBAL.rest_resource_bff??'',
            data: {
                locale: COMMON_GLOBAL.user_locale,
                idToken: COMMON_GLOBAL.token_dt??'',
                accessToken: (COMMON_GLOBAL.app_id == COMMON_GLOBAL.app_admin_app_id)?
                                COMMON_GLOBAL.token_admin_at??'':
                                    COMMON_GLOBAL.token_at??'',
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
 * @param {{sse_type:string,
 *           sse_message:string}} sse_message 
 * @returns {Promise.<void>}
 */
const commonSocketSSEShow = async (sse_message) => {
    switch (sse_message.sse_type){
        case 'MAINTENANCE':{
            window.location.href = '/';
            break;
        }
        case 'SESSION_EXPIRED':{
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
                mountDiv:   'common_broadcast',
                data:       {message:sse_message.sse_message},
                methods:    {commonMiscResourceFetch:commonMiscResourceFetch},
                path:       '/common/component/common_broadcast.js'});
            break;
        }
		case 'PROGRESS':{
			commonMessageShow('PROGRESS', null, null, JSON.parse(sse_message.sse_message));
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
 * @name commonSocketConnectOnline
 * @description Socket connect online, can use id-token or access token
 * @function
 * @returns {Promise.<void>}
 */
const commonSocketConnectOnline = async () => {
    const  authorization_type= (COMMON_GLOBAL.token_at && COMMON_GLOBAL.app_admin_app_id == COMMON_GLOBAL.app_id)?
                                    'ADMIN':
                                        COMMON_GLOBAL.token_at?'APP_ACCESS':'APP_ID';
    commonFFB({path:'/server-socket/socket/' + COMMON_GLOBAL.x.uuid ?? '', response_type: 'SSE', method:'POST', authorization_type:authorization_type});
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
 * @name commonEventSelectAction
 * @description Performs action for select event
 * @function
 * @param {string} event_target_id
 * @param { common['CommonAppEvent']['target']|
 *          common['CommonAppEvent']['target']['parentNode']|null} target
 * @returns {Promise.<void>}
 */
const commonEventSelectAction = async (event_target_id, target) =>{
   //dialogue user menu events
   if (event_target_id == 'common_dialogue_user_menu_app_theme'){
       COMMON_DOCUMENT.body.className = 'app_theme' + COMMON_DOCUMENT.querySelector(`#${event_target_id} .common_select_dropdown_value`).getAttribute('data-value');
       commonMiscPreferencesUpdateBodyClassFromPreferences();
   }
   if (event_target_id == 'common_dialogue_user_menu_iam_user_app_locale_select'){
       COMMON_GLOBAL.user_locale = target?.getAttribute('data-value') ?? '';
       /**
        * @todo change COMMON_WINDOW.navigator.language, however when logging out default COMMON_WINDOW.navigator.language will be set
        *       commented at the moment
        *       Object.defineProperties(COMMON_WINDOW.navigator, {'language': {'value':COMMON_GLOBAL.user_locale, writable: true}});
        */
       await commonUserPreferenceSave();
       await commonComponentRender({
        mountDiv:   'common_dialogue_user_menu_iam_user_app_locale_select', 
        data:       {
                    default_data_value:COMMON_GLOBAL.user_locale,
                    default_value:'',
                    options: await commonFFB({
                                                path:'/app-common-module/COMMON_LOCALE', 
                                                method:'POST', authorization_type:'APP_ID',
                                                body:{type:'FUNCTION',IAM_data_app_id : COMMON_GLOBAL.app_common_app_id}
                                            })
                                            .then((/**@type{string}*/result)=>JSON.parse(commonWindowFromBase64(JSON.parse(result).rows[0].data))),
                    path:null,
                    query:null,
                    method:null,
                    authorization_type:null,
                    column_value:'locale',
                    column_text:'text'
                    },
        methods:    {commonFFB:commonFFB},
        path:       '/common/component/common_select.js'});
        commonMiscSelectCurrentValueSet('common_dialogue_user_menu_iam_user_app_locale_select', COMMON_GLOBAL.user_locale);
   }
   if (event_target_id == 'common_dialogue_user_menu_iam_user_app_timezone_select'){
       COMMON_GLOBAL.user_timezone = target?.getAttribute('data-value') ?? '';
       await commonUserPreferenceSave();
   }
   if(event_target_id =='common_dialogue_user_menu_iam_user_app_direction_select'){
       if(target?.getAttribute('data-value')=='rtl')
           COMMON_DOCUMENT.body.classList.add('rtl');
       else
           COMMON_DOCUMENT.body.classList.remove('rtl');
       COMMON_GLOBAL.user_direction = target?.getAttribute('data-value') ?? '';
       await commonUserPreferenceSave();
   }
   if(event_target_id == 'common_dialogue_user_menu_iam_user_app_arabic_script_select'){
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

<<<<<<< HEAD
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
                        // dialogue login/signup
                        case 'common_dialogue_iam_start_login':
                        case 'common_dialogue_iam_start_signup':{
                            commonDialogueShow(event_target_id.substring('common_dialogue_iam_start_'.length).toUpperCase());
                            break;
                        }
                        case 'common_dialogue_iam_start_close':{
                            commonComponentRemove('common_dialogue_iam_start', true);
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
                        
                        case 'common_profile_search_icon':{
                            COMMON_DOCUMENT.querySelector('#common_profile_search_input').focus();
                            COMMON_DOCUMENT.querySelector('#common_profile_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                            break;
                        }
                        //Dialogue apps
                        case 'common_dialogue_apps_list_title_col_info':{
                            commonComponentRender({
                            mountDiv:   'common_dialogue_info',
                            data:       {
                                        common_app_id:COMMON_GLOBAL.app_common_app_id,
                                        app_copyright:COMMON_GLOBAL.app_copyright,
                                        app_link_url:COMMON_GLOBAL.app_link_url,
                                        app_link_title:COMMON_GLOBAL.app_link_title,
                                        info_link_policy_name:COMMON_GLOBAL.info_link_policy_name,
                                        info_link_disclaimer_name:COMMON_GLOBAL.info_link_disclaimer_name,
                                        info_link_terms_name:COMMON_GLOBAL.info_link_terms_name
                                        },
                            methods:    {
                                        commonFFB:commonFFB,
                                        commonMessageShow:commonMessageShow
                                        },
                            path:       '/common/component/common_dialogue_info.js'})
                            .then(component=>COMMON_GLOBAL.component.common_dialogue_info.methods = component.methods);
                            break;
                        }            
                        case 'common_dialogue_apps_list':
                            if (event.target.classList.contains('common_dialogue_apps_app_logo')){
                                commonMountApp(event.target.getAttribute('data-app_id'));
                            }
                            break;
                        //Dialogue info
                        case 'common_dialogue_info_contact_message_send':{
                            COMMON_GLOBAL.component.common_dialogue_info.methods.eventClickSend();
                            break;
                        }
                        case 'common_dialogue_info_app_link':{
                            if (COMMON_GLOBAL.app_link_url)
                                COMMON_WINDOW.open(COMMON_GLOBAL.app_link_url,'_blank','');
                            break;
                        }
                        case 'common_dialogue_info_info_link1':{
                            commonComponentRender({
                                mountDiv:   'common_window_info',
=======
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
                            case 'common_profile_search_icon':{
                                COMMON_DOCUMENT.querySelector('#common_profile_search_input').focus();
                                COMMON_DOCUMENT.querySelector('#common_profile_search_input').dispatchEvent(new KeyboardEvent('keyup'));
                                break;
                            }
                            //Dialogue apps
                            case 'common_dialogue_apps_list_title_col_info':{
                                commonComponentRender({
                                mountDiv:   'common_dialogue_info',
>>>>>>> 1054f6ff (AP-110 adds await for common, component and app events in commonEvent() and dblclick in commonMountApp() in common.js, implements city search in common_map_control_expand.js and adds common_map_control_expand_search_city.js component)
                                data:       {
                                            common_app_id:COMMON_GLOBAL.app_common_app_id,
                                            app_copyright:COMMON_GLOBAL.app_copyright,
                                            app_link_url:COMMON_GLOBAL.app_link_url,
                                            app_link_title:COMMON_GLOBAL.app_link_title,
                                            info_link_policy_name:COMMON_GLOBAL.info_link_policy_name,
                                            info_link_disclaimer_name:COMMON_GLOBAL.info_link_disclaimer_name,
                                            info_link_terms_name:COMMON_GLOBAL.info_link_terms_name
                                            },
                                methods:    {
                                            commonFFB:commonFFB,
                                            commonMessageShow:commonMessageShow
                                            },
<<<<<<< HEAD
                                path:       '/common/component/common_dialogue_user_menu.js'})
                                .then(component=>COMMON_GLOBAL.component.common_dialogue_user_menu.methods = component.methods);
                            break;
                        }
                        case 'common_dialogue_user_menu_username':{
                            commonComponentRemove('common_dialogue_user_menu');
                            await commonProfileShow();
                            break;
                        }
                        case 'common_dialogue_user_menu_messages_pagination_first':
                        case 'common_dialogue_user_menu_messages_pagination_previous':
                        case 'common_dialogue_user_menu_messages_pagination_next':
                        case 'common_dialogue_user_menu_messages_pagination_last':{
                            COMMON_GLOBAL.component.common_dialogue_user_menu.methods.eventClickPagination(event_target_id);
                            break;
                        }
                        case 'common_dialogue_user_menu_nav_messages_count':
                        case 'common_dialogue_user_menu_nav_messages':{
                            COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                            await COMMON_GLOBAL.component.common_dialogue_user_menu.methods.eventClickNavMessages();
                            break;
                        }
                        case (event.target.classList.contains('common_dialogue_user_menu_messages_col_delete') && event_target_id != 'common_dialogue_user_menu_messages_col_delete')?
                                event_target_id:
                                    '':{
                            //clicked on delete on row, not the title
                            COMMON_GLOBAL.component.common_dialogue_user_menu.methods.eventClickMessageDelete( commonMiscElementRow(event.target));
                            break;
                        }
                        case 'common_dialogue_user_menu_nav_iam_user_app':{
                            COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                            await COMMON_GLOBAL.component.common_dialogue_user_menu.methods.eventClickNavIamUserApp(COMMON_GLOBAL.user_locale,
                                                                                                                    COMMON_GLOBAL.user_timezone,
                                                                                                                    COMMON_GLOBAL.user_direction,
                                                                                                                    COMMON_GLOBAL.user_arabic_script);
                            break;
                        }
                        case 'common_dialogue_user_menu_nav_iam_user':{
                            COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                            COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                            await COMMON_GLOBAL.component.common_dialogue_user_menu.methods.eventClickNavIamUser();
                            break;
                        }
                        case 'common_dialogue_user_menu_messages_list':{
                            COMMON_GLOBAL.component.common_dialogue_user_menu.methods.eventClickMessage( commonMiscElementRow(event.target));
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
                        case 'common_dialogue_user_menu_signup':{
                            commonComponentRemove('common_dialogue_user_menu');
                            commonDialogueShow('SIGNUP');
                            break;
                        }
                        //dialogue user edit
                        case 'common_dialogue_user_menu_iam_user_btn_user_update':{
                            await commonUserUpdate();
                            break;
                        }
                        case 'common_dialogue_user_menu_iam_user_btn_user_delete_account':{
                            const function_delete_user_account = () => { 
                                commonIamUserAppDelete(1, null);
                            };
                            await commonIamUserAppDelete(null, function_delete_user_account);
                            
                            break;
                        }        
                        //dialogue verify
                        case 'common_dialogue_iam_verify_cancel':{
                            if (COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_btn_user_update')==null)
                                commonUserSessionClear();
                            commonComponentRemove('common_dialogue_iam_verify', true);
                            break;
                        }
                        //search list
                        case 'common_profile_detail_list':
                        case 'common_profile_search_list':
                        case 'common_profile_stat_list':{
                            await commonProfileShow(Number(commonMiscElementRow(event.target).getAttribute('data-iam_user_id')),null);
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
                        // common app toolbar
                        case 'common_app_toolbar_start':{
                            commonMountApp(COMMON_GLOBAL.app_start_app_id);
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
                            if (event.target.getAttribute('data-url_link'))
=======
                                path:       '/common/component/common_dialogue_info.js'});
                                break;
                            }            
                            case 'common_dialogue_apps_list':
                                if (event.target.classList.contains('common_dialogue_apps_app_logo')){
                                    commonMountApp(event.target.getAttribute('data-app_id'));
                                }
                                break;
                            //Dialogue info
                            case 'common_dialogue_info_contact_message_send':{
                                COMMON_GLOBAL.component.common_dialogue_info?.methods?.eventClickSend();
                                break;
                            }
                            case 'common_dialogue_info_app_link':{
                                if (COMMON_GLOBAL.app_link_url)
                                    COMMON_WINDOW.open(COMMON_GLOBAL.app_link_url,'_blank','');
                                break;
                            }
                            case 'common_dialogue_info_info_link1':{
>>>>>>> 1054f6ff (AP-110 adds await for common, component and app events in commonEvent() and dblclick in commonMountApp() in common.js, implements city search in common_map_control_expand.js and adds common_map_control_expand_search_city.js component)
                                commonComponentRender({
                                    mountDiv:   'common_window_info',
                                    data:       {
                                                info:'URL',
                                                path:'/app-resource/' + COMMON_GLOBAL.info_link_policy_url,
                                                query:`type=INFO&IAM_data_app_id=${COMMON_GLOBAL.app_common_app_id}`,
                                                method:'GET',
                                                authorization:'APP_ID'
                                                },
                                    methods:    {commonFFB:commonFFB},
                                    path:       '/common/component/common_window_info.js'});
                                break;
                            }
                            case 'common_dialogue_info_info_link2':{
                                commonComponentRender({
                                    mountDiv:   'common_window_info',
                                    data:       {
                                                info:'URL',
                                                path:'/app-resource/' + COMMON_GLOBAL.info_link_disclaimer_url,
                                                query:`type=INFO&IAM_data_app_id=${COMMON_GLOBAL.app_common_app_id}`,
                                                method:'GET',
                                                authorization:'APP_ID'
                                                },
                                    methods:    {commonFFB:commonFFB},
                                    path:       '/common/component/common_window_info.js'});
                                break;
                            }
                            case 'common_dialogue_info_info_link3':{
                                commonComponentRender({
                                    mountDiv:   'common_window_info',
                                    data:       {
                                                info:'URL',
                                                path:'/app-resource/' + COMMON_GLOBAL.info_link_terms_url,
                                                query:`type=INFO&IAM_data_app_id=${COMMON_GLOBAL.app_common_app_id}`,
                                                method:'GET',
                                                authorization:'APP_ID'
                                                },
                                    methods:    {commonFFB:commonFFB},
                                    path:       '/common/component/common_window_info.js'});
                                break;
                            }
                            case 'common_dialogue_info_close':{
                                commonComponentRemove('common_dialogue_info', true);
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
                                    methods:    {
                                                commonMiscFormatJsonDate:commonMiscFormatJsonDate,
                                                commonMiscSelectCurrentValueSet:commonMiscSelectCurrentValueSet,
                                                commonWindowFromBase64:commonWindowFromBase64,
                                                commonFFB:commonFFB,
                                                commonComponentRender:commonComponentRender,
                                                commonUserSessionCountdown:commonUserSessionCountdown,
                                                commonMessageShow:commonMessageShow,
                                                commonMesssageNotAuthorized:commonMesssageNotAuthorized,
                                                commonUserMessageShowStat:commonUserMessageShowStat
                                                },
                                    path:       '/common/component/common_dialogue_user_menu.js'});
                                break;
                            }
                            case 'common_dialogue_user_menu_username':{
                                commonComponentRemove('common_dialogue_user_menu');
                                await commonProfileShow();
                                break;
                            }
                            case 'common_dialogue_user_menu_messages_pagination_first':
                            case 'common_dialogue_user_menu_messages_pagination_previous':
                            case 'common_dialogue_user_menu_messages_pagination_next':
                            case 'common_dialogue_user_menu_messages_pagination_last':{
                                COMMON_GLOBAL.component.common_dialogue_user_menu?.methods?.eventClickPagination(event_target_id);
                                break;
                            }
                            case 'common_dialogue_user_menu_nav_messages_count':
                            case 'common_dialogue_user_menu_nav_messages':{
                                COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                                COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                                await COMMON_GLOBAL.component.common_dialogue_user_menu?.methods?.eventClickNavMessages();
                                break;
                            }
                            case (event.target.classList.contains('common_dialogue_user_menu_messages_col_delete') && event_target_id != 'common_dialogue_user_menu_messages_col_delete')?
                                    event_target_id:
                                        '':{
                                //clicked on delete on row, not the title
                                COMMON_GLOBAL.component.common_dialogue_user_menu?.methods?.eventClickMessageDelete( commonMiscElementRow(event.target));
                                break;
                            }
                            case 'common_dialogue_user_menu_nav_iam_user_app':{
                                COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                                COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                                await COMMON_GLOBAL.component.common_dialogue_user_menu?.methods?.eventClickNavIamUserApp(COMMON_GLOBAL.user_locale,
                                                                                                                        COMMON_GLOBAL.user_timezone,
                                                                                                                        COMMON_GLOBAL.user_direction,
                                                                                                                        COMMON_GLOBAL.user_arabic_script);
                                break;
                            }
                            case 'common_dialogue_user_menu_nav_iam_user':{
                                COMMON_DOCUMENT.querySelectorAll('.common_nav_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_nav_selected'));
                                COMMON_DOCUMENT.querySelector(`#${event_target_id}`).classList.add('common_nav_selected');
                                await COMMON_GLOBAL.component.common_dialogue_user_menu?.methods?.eventClickNavIamUser();
                                break;
                            }
                            case 'common_dialogue_user_menu_messages_list':{
                                COMMON_GLOBAL.component.common_dialogue_user_menu?.methods?.eventClickMessage( commonMiscElementRow(event.target));
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
                            case 'common_dialogue_user_menu_signup':{
                                commonComponentRemove('common_dialogue_user_menu');
                                commonDialogueShow('SIGNUP');
                                break;
                            }
                            //dialogue user edit
                            case 'common_dialogue_user_menu_iam_user_btn_user_update':{
                                await commonUserUpdate();
                                break;
                            }
                            case 'common_dialogue_user_menu_iam_user_btn_user_delete_account':{
                                const function_delete_user_account = () => { 
                                    commonIamUserAppDelete(1, null);
                                };
                                await commonIamUserAppDelete(null, function_delete_user_account);
                                
                                break;
                            }        
                            //dialogue verify
                            case 'common_dialogue_iam_verify_cancel':{
                                if (COMMON_DOCUMENT.querySelector('#common_dialogue_user_menu_iam_user_btn_user_update')==null)
                                    commonUserSessionClear();
                                commonComponentRemove('common_dialogue_iam_verify', true);
                                break;
                            }
                            //search list
                            case 'common_profile_detail_list':
                            case 'common_profile_search_list':
                            case 'common_profile_stat_list':{
                                await commonProfileShow(Number(commonMiscElementRow(event.target).getAttribute('data-iam_user_id')),null);
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
                            // common app toolbar
                            case 'common_app_toolbar_start':{
                                commonMountApp(COMMON_GLOBAL.app_start_app_id);
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
                                if (event.target.getAttribute('data-url_link'))
                                    commonComponentRender({
                                        mountDiv:   'common_window_info',
                                        data:       {
                                                    info:'IMAGE',
                                                    url:event.target.getAttribute('data-url_link'),
                                                    },
                                        methods:    {commonFFB:commonFFB},
                                        path:       '/common/component/common_window_info.js'});
                                break;
                            }
                        }
                    }
                    break;
                }
                case 'keydown':{
                    if (event.code=='Enter')
                        event.preventDefault();
<<<<<<< HEAD
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
                        case 'common_profile_search_input':{
                            commonMiscListKeyEvent({event:event,
                                                    event_function:commonProfileSearch,
                                                    event_parameters:commonProfileShow,
                                                    rows_element:'common_profile_search_list',
                                                    search_input:'common_profile_search_input'});
                            break;
                        }        
                        case 'common_lov_search_input':{
                            commonMiscListKeyEvent({event:event,
                                                    event_function:commonLovFilter,
                                                    event_parameters:COMMON_DOCUMENT.querySelector('#common_lov_search_input').textContent,
                                                    rows_element:'common_lov_list',
                                                    search_input:'common_lov_search_input'});
                            break;
                        }
                        //dialogue verify
                        case 'common_dialogue_iam_verify_verification_char1':
                        case 'common_dialogue_iam_verify_verification_char2':
                        case 'common_dialogue_iam_verify_verification_char3':
                        case 'common_dialogue_iam_verify_verification_char4':
                        case 'common_dialogue_iam_verify_verification_char5':{
                            COMMON_GLOBAL.component.common_dialogue_iam_verify.methods.commonUserVerifyCheckInput( COMMON_DOCUMENT.querySelector(`#${event.target.id}`), 
                                                            'common_dialogue_iam_verify_verification_char' + (Number(event.target.id.substring(event.target.id.length-1))+1));
                            break;
                        }
                        case 'common_dialogue_iam_verify_verification_char6':{
                            COMMON_GLOBAL.component.common_dialogue_iam_verify.methods.commonUserVerifyCheckInput(COMMON_DOCUMENT.querySelector(`#${event.target.id}`), '');
                            break;
                        }
                        //module leaflet
                        case 'common_module_leaflet_search_input':{
                            commonMiscListKeyEvent({event:event,
                                                    event_function:commonMicroserviceWorldcitiesSearch,
                                                    event_parameters:event.target['data-function'],
                                                    rows_element:'common_module_leaflet_search_list',
                                                    search_input:'common_module_leaflet_search_input'});
                            break;
                        }
                        default:{
                            break;
                        }
=======
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
>>>>>>> 1054f6ff (AP-110 adds await for common, component and app events in commonEvent() and dblclick in commonMountApp() in common.js, implements city search in common_map_control_expand.js and adds common_map_control_expand_search_city.js component)
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
                            case 'common_profile_search_input':{
                                commonMiscListKeyEvent({event:event,
                                                        event_function:commonProfileSearch,
                                                        event_parameters:commonProfileShow,
                                                        rows_element:'common_profile_search_list',
                                                        search_input:'common_profile_search_input'});
                                break;
                            }        
                            case 'common_lov_search_input':{
                                commonMiscListKeyEvent({event:event,
                                                        event_function:commonLovFilter,
                                                        event_parameters:COMMON_DOCUMENT.querySelector('#common_lov_search_input').textContent,
                                                        rows_element:'common_lov_list',
                                                        search_input:'common_lov_search_input'});
                                break;
                            }
                            //dialogue verify
                            case 'common_dialogue_iam_verify_verification_char1':
                            case 'common_dialogue_iam_verify_verification_char2':
                            case 'common_dialogue_iam_verify_verification_char3':
                            case 'common_dialogue_iam_verify_verification_char4':
                            case 'common_dialogue_iam_verify_verification_char5':{
                                COMMON_GLOBAL.component.common_dialogue_iam_verify?.methods?.commonUserVerifyCheckInput( COMMON_DOCUMENT.querySelector(`#${event.target.id}`), 
                                                                'common_dialogue_iam_verify_verification_char' + (Number(event.target.id.substring(event.target.id.length-1))+1));
                                break;
                            }
                            case 'common_dialogue_iam_verify_verification_char6':{
                                COMMON_GLOBAL.component.common_dialogue_iam_verify?.methods?.commonUserVerifyCheckInput(COMMON_DOCUMENT.querySelector(`#${event.target.id}`), '');
                                break;
                            }
                            default:{
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
 * @name commonMountApp
 * @description Mount app
 * @function
 * @param {number} app_id
 * @returns {Promise.<void>}
 */
const commonMountApp = async (app_id) =>{   
    
    COMMON_GLOBAL.app_id =          app_id;
    /**@type{common['commonAppInit']} */
    const CommonAppInit = await commonFFB({ path:`/app-mount/${app_id}`, 
                                            method:'GET', 
                                            authorization_type:'APP_ID'})
                            .then(app=>JSON.parse(app));
    COMMON_GLOBAL.iam_user_app_id = null;
    if (COMMON_GLOBAL.iam_user_id != null)
        await commonUserLoginApp(COMMON_DOCUMENT.querySelector('#common_app_toolbar_start')?'common_app_toolbar_start':null);
    COMMON_DOCUMENT.querySelector(`#${COMMON_GLOBAL.app_div}`).innerHTML='';
    if (COMMON_GLOBAL.app_id!=COMMON_GLOBAL.app_start_app_id)
        commonComponentRemove('common_dialogue_apps');

    COMMON_GLOBAL.app_id =          CommonAppInit.App.id;
    COMMON_GLOBAL.app_logo =        CommonAppInit.App.logo_content;
    COMMON_GLOBAL.app_copyright =   CommonAppInit.App.copyright;
    COMMON_GLOBAL.app_link_url =    CommonAppInit.App.link_url;
    COMMON_GLOBAL.app_link_title =  CommonAppInit.App.link_title;
    COMMON_GLOBAL.app_text_edit =   CommonAppInit.App.text_edit;
    
    CommonAppInit.App.css==''?
        null:
            COMMON_DOCUMENT.querySelector('#app_link_app_css').href = await commonMiscResourceFetch(CommonAppInit.App.css, null, 'text/css', CommonAppInit.App.css_content);

    const {appMetadata, default:AppInit} = await commonMiscImport(CommonAppInit.App.js, CommonAppInit.App.js_content);
    
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

    CommonAppInit.App.css_report==''?
        null:
            COMMON_DOCUMENT.querySelector('#app_link_app_report_css').href = await commonMiscResourceFetch(CommonAppInit.App.css_report, null, 'text/css', CommonAppInit.App.css_report_content);
    CommonAppInit.App.favicon_32x32==''?
        null:
            COMMON_DOCUMENT.querySelector('#app_link_favicon_32x32').href = await commonMiscResourceFetch(CommonAppInit.App.favicon_32x32, null, 'image/png', CommonAppInit.App.favicon_32x32_content);
    CommonAppInit.App.favicon_192x192==''?
        null:
            COMMON_DOCUMENT.querySelector('#app_link_favicon_192x192').href = await commonMiscResourceFetch(CommonAppInit.App.favicon_192x192, null, 'image/png',CommonAppInit.App.favicon_192x192_content);
};
/**
 * @name commonGet
 * @description Returns all functions and globals
 * @function
 * @returns {common['CommonModuleCommon']}
 */
const commonGet = () =>{
    return {
        COMMON_GLOBAL:COMMON_GLOBAL, 
        COMMON_DOCUMENT:COMMON_DOCUMENT,
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
        commonMiscPreferencesPostMount:commonMiscPreferencesPostMount,
        commonMiscPrint:commonMiscPrint,
        commonMiscResourceFetch:commonMiscResourceFetch,
        commonMiscRoundOff:commonMiscRoundOff,
        commonMiscSelectCurrentValueSet:commonMiscSelectCurrentValueSet,
        commonMiscThemeDefaultList:commonMiscThemeDefaultList,
        commonMiscThemeUpdateFromBody:commonMiscThemeUpdateFromBody,
        commonMiscTimezoneDate:commonMiscTimezoneDate,
        commonMiscTypewatch:commonMiscTypewatch,
        commonMiscShowDateUpdate:commonMiscShowDateUpdate,
        commonMiscSecondsToTime:commonMiscSecondsToTime,
        commonMiscLoadFont:commonMiscLoadFont,
        commonMiscCssApply:commonMiscCssApply,
        /**WINDOW OBJECT */
        commonWindowDocumentFrame:commonWindowDocumentFrame,
        commonWindowFromBase64:commonWindowFromBase64, 
        commonWindowLocationReload:commonWindowLocationReload,
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
        /* LOV */
        commonLovAction:commonLovAction,
        commonLovEvent:commonLovEvent, 
        commonLovClose:commonLovClose, 
        commonLovShow:commonLovShow,
        /* MESSAGE*/
        commonMessageShow:commonMessageShow,
        commonMesssageNotAuthorized:commonMesssageNotAuthorized,
        /* PROFILE */
        commonProfileDetail:commonProfileDetail, 
        commonProfileFollowLike:commonProfileFollowLike,
        commonProfileShow:commonProfileShow,
        commonProfileStat:commonProfileStat, 
        commonProfileUpdateStat:commonProfileUpdateStat, 
        /* USER  */
        commonUserFunction:commonUserFunction,
        commonIamUserAppDelete:commonIamUserAppDelete,
        commonUserLogin:commonUserLogin, 
        commonUserLogout:commonUserLogout,
        commonUserSessionCountdown:commonUserSessionCountdown, 
        commonUserSignup:commonUserSignup, 
        commonUserUpdate:commonUserUpdate, 
        commonUserAuthenticateCode:commonUserAuthenticateCode,
        commonUserMessageShowStat:commonUserMessageShowStat,
        commonUserUpdateAvatar:commonUserUpdateAvatar,
        commonUserLocale:commonUserLocale,
        /* FFB */
        common_FFBSSE,
        commonFFB:commonFFB,
        /* SERVICE SOCKET */
        commonSocketSSEShow:commonSocketSSEShow, 
        commonSocketConnectOnline:commonSocketConnectOnline,
        commonSocketConnectOnlineCheck:commonSocketConnectOnlineCheck,
        /* GEOLOCATION */
        commonGeolocationPlace:commonGeolocationPlace,
        /* EVENT */
        commonEvent:commonEvent,
        /* INIT */
        commonMountApp:commonMountApp,
        commonException:commonException,
        commonGlobals:commonGlobals,
        commonInit:commonInit,
        default:{commonInit}};
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
 * 
 * @name commonGlobals
 * @description Sets start globals
 * @function
 * @param {string} globals
 * @returns {void}
 */
const commonGlobals = globals => {  
    const globalsObj = JSON.parse(atob(globals));
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
    const {encrypt, decrypt} = await import(URL.createObjectURL(  new Blob ([atob(parameters.jsCrypto)],{type: 'text/javascript'})))
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
        path:           '/common/component/common_dialogue_message.js'});
    //connect to BFF
    await commonFFB({path:               '/server-bff/' + COMMON_GLOBAL.x.uuid, 
        method:             'POST',
        body:               null,
        response_type:      'SSE',
        authorization_type: 'APP_ID'});

    //mount start app
    commonMountApp(COMMON_GLOBAL.app_start_app_id);

    //apply font css
    COMMON_GLOBAL.app_fonts?commonMiscCssApply(COMMON_GLOBAL.app_fonts.join('@')):null;
    
};
export{/* GLOBALS*/
       COMMON_GLOBAL, 
       COMMON_DOCUMENT,
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
       commonMiscPreferencesPostMount,
       commonMiscPrint,
       commonMiscResourceFetch,
       commonMiscRoundOff, 
       commonMiscSelectCurrentValueSet,
       commonMiscThemeDefaultList, 
       commonMiscThemeUpdateFromBody,
       commonMiscTimezoneDate, 
       commonMiscTypewatch,      
       commonMiscShowDateUpdate,
       commonMiscSecondsToTime,
       commonMiscLoadFont,
       commonMiscCssApply,
       /**WINDOW OBJECT */
       commonWindowDocumentFrame,
       commonWindowFromBase64, 
       commonWindowLocationReload,
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
       commonUserFunction,
       commonIamUserAppDelete,
       commonUserLogin, 
       commonUserLogout,
       commonUserSessionCountdown, 
       commonUserSignup, 
       commonUserUpdate, 
       commonUserAuthenticateCode,
       commonUserMessageShowStat,
       commonUserUpdateAvatar,
       commonUserLocale,
       /* FFB */
       common_FFBSSE,
       commonFFB,
       /* SERVICE SOCKET */
       commonSocketSSEShow, 
       commonSocketConnectOnline,
       commonSocketConnectOnlineCheck,
       /* GEOLOCATION */
       commonGeolocationPlace,
       /* EVENT */
       commonEvent,
       /* INIT */
       commonMountApp,
       commonException,
       commonGlobals,
       commonInit};
export default {commonInit};