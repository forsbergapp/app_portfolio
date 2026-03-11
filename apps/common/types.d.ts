/** 
 * @description Declaration of all common types used in apps
 * @module apps/common/types 
*/

/**
 * @name COMMON_WINDOW
 * @description Type COMMON_WINDOW
 */
type COMMON_WINDOW = {
        console:{ warn:Function,
                       info:Function,
                       error:Function},
        atob:Function,
        btoa:Function,
        crypto:typeof window['crypto'],
        setTimeout:Function,
        clearTimeout:Function,
        open:Function,
        addEventListener:Function,  //used to override default function with custom function to keep track of third party libraries
        navigator:{language:string, userAgent:string, serviceWorker:{register:Function}},
        location:{pathname:string, reload:Function},
        Intl:{DateTimeFormat()      :{resolvedOptions(): Intl.ResolvedDateTimeFormatOptions},
                NumberFormat()        :{resolvedOptions(): Intl.ResolvedNumberFormatOptions},
                DateTimeFormatOptions?:Intl.DateTimeFormatOptions},
        prompt:Function,
        frames:{document:COMMON_DOCUMENT},
        Promise:Function,
        ReactDOM?:any,
        React?:any,
        __VUE_DEVTOOLS_HOOK_REPLAY__?:any,
        __VUE_HMR_RUNTIME__?:any,
        __VUE__?:any
}

/**
 * @name COMMON_DOCUMENT
 * @description Type COMMON_DOCUMENT
 */
type COMMON_DOCUMENT = {
        head:{innerHTML:string},
        body:{className:string, requestFullscreen:Function, classList:DOMTokenList},
        createElement:Function,
        addEventListener:Function,
        adoptedStyleSheets:DocumentOrShadowRoot['adoptedStyleSheets'],
        fonts:any,
        removeEventListener:Function,
        fullscreenElement:Element|null,
        exitFullscreen:Function,
        querySelector:Function,
        querySelectorAll:Function,
        title:string
}
/**
 * @name commonTarget
 * @description Type target
 */
type commonTarget = {
        id:                 string,
        blur:               Function,
        href:               string,
        focus:              Function,
        classList:          DOMTokenList,
        className:          string,
        'data-function':    Function,
        dispatchEvent:      Function,
        hasAttribute:       Function,
        getAttribute:       Function,
        innerHTML:          string,
        textContent:        string,
        nextElementSibling: {dispatchEvent:Function},
        nodeName:           string,
        options:            HTMLOptionsCollection,
        parentNode:         {
                                id: string,
                                classList:DOMTokenList,
                                className:string,
                                nextElementSibling:{querySelector:Function},
                                innerHTML:string,
                                getAttribute:Function,
                                parentNode:{style:{display:string}},
                                style:{display:string},
                                querySelector: Function
                                remove: Function
                            },
        setAttribute:       Function,
        value:              string
}
/**
 * @name CommonAppEvent
 * @description Type CommonAppEvent
 *              events only used on DOM, third party libraries might use events on window in BOM
 */
type CommonAppEvent = {
        clipboardData: {getData:Function},
        code:string,
        key:string,
        altKey:boolean,
        ctrlKey:boolean,
        shiftKey:boolean,
        preventDefault:Function,
        stopPropagation:Function,
        type:string,
        layerX:number,
        touches:[any],
        clientX:number,
        clientY:number,
        deltaY:number,
        target:commonTarget,
        currentTarget:commonTarget
}
/**
 * @name CommonFFB_parameters
 * @description  Type CommonFFB_parameters
 */
type CommonFFB_parameters = {
        app_id:number,
        uuid:string,
        secret:string,
        response_type?:'SSE'|'TEXT'|'BLOB',
        spinner_id?:string|null,
        timeout?:number|null,
        app_admin_app_id:number,
        rest_api_version: string,
        rest_bff_path   : string,
        data:{
                locale:string,
                idToken: string,
                accessToken?:string,
                path:string,
                query?:string|null,
                method:string,
                authorization_type:string,
                username?:string,
                password?:string,
                body?:any}
}
/**
 * @name CommonGlobal
 * @description Type CommonGlobal
 */
type CommonGlobal = {
        ICONS: {
            home:string,
            framework_js: string,
            framework_vue: string,
            framework_react: string,
            apps:string,
            maintenance:string,
            alert:string,
            save: string,
            add:string,
            remove:string,
            delete:string,
            lov: string,
            select: string,
            send:   string,
            email:  string,
            otp: string,
            settings:string,
            chat: string,
            log:  string,
            chart_pie: string,
            chart_bar: string,
            monitor: string,
            server: string,
            database: string,
            user_connections:string,
            database_started: string,
            database_stat: string,
            broadcast: string,
            checkbox_checked: string,
            checkbox_empty: string,
            info: string,
            close: string,
            online: string,
            search: string,
            menu_open: string,
            first:  string,
            previous: string,
            next: string,
            last: string,
            slider_left: string,
            slider_right: string,
            align_left: string,
            align_center: string,
            align_right: string,
            cancel: string,
            ok: string, 
            zoomout: string,
            zoomin: string,
            left: string,
            right: string,
            up: string,
            down: string,                     
            print: string,
            html:string,
            lock: string,
            papersize: string,
            highlight: string,
            show: string,
            view: string,
            preview: string,
            notes: string,
            login: string,
            logout: string,
            signup: string,
            question: string,
            active: string,
            status: string,
            level: string,
            type: string,
            reload:	string,
            reset: string,
            sum: string,
            internet: string,
            fullscreen: string,
            init: string,
            run: string,
            arrow_pointer: string,
            arrow_pointer_query: string,
            user: string,
            users: string,
            username: string,
            user_last_logintime: string,
            user_account_created: string,
            user_account_modified: string,
            user_password: string,
            user_password_confirm: string,
            user_password_reminder: string,
            user_avatar: string,
            user_follow_user: string,
            user_followed_user: string,
            user_like: string,
            user_unlike: string,
            user_views: string,
            user_follows: string,
            user_followed: string,
            id_card: string,
            user_profile: string,
            user_profile_stat: string,
            user_session_expired: string,
            verification_code: string,
            provider_id: string,
            pay:string,
            gps: string,
            gps_position: string,
            gps_position_lat:string,
            gps_position_long:string,
            gps_high_latitude: string,
            map_my_location: string,
            map_layer: string,
            regional: string,
            regional_day: string,
            regional_month: string,
            regional_year: string,
            regional_weekday: string,
            regional_locale: string,
            regional_calendar: string,
            regional_calendartype: string,
            regional_calendar_hijri_type:string,
            regional_numbersystem: string,
            regional_direction: string,
            regional_script: string,
            regional_timeformat: string,
            regional_timezone: string,
            sky_sunrise_before: string,
            sky_sunrise: string,
            sky_midday: string,
            sky_afternoon: string,
            sky_sunset: string,
            sky_night: string,
            sky_midnight: string,
            misc_design: string,
            misc_image: string,
            misc_text: string,
            misc_second: string,
            misc_book: string,
            misc_food: string,
            misc_prayer: string,
            misc_calling: string,
            misc_ban: string,
            robot:string,
            human:string,
            hourglass:string,
            misc_solve: string,
            misc_education: string,
            misc_scramble: string,
            infinite: string,
            message_fail: string,
            message_success: string,
            message_text:string},
        Parameters:{
                rest_resource_bff:string|null,
                app_rest_api_version:string|null,
                app_rest_api_basepath:string|null,
                app_common_app_id:number,
                app_admin_app_id:number,
                app_start_app_id:number,
                app_toolbar_button_start:number,
                app_toolbar_button_framework:number,
                app_framework:number,
                app_framework_messages:number,
                admin_only:number|null,
                admin_first_time:number|null,
                app_request_tries:number,
                app_requesttimeout_seconds:number,
                app_requesttimeout_admin_minutes:number,
                app_content_type_json: string,
                app_content_type_html: string,
                app_content_type_sse:  string,
                app_font_timeout:number,
                app_root:string,
                app_div:string
                },
        Data:{
            Apps:types_server.ORM['View']['AppGetInfo'][],
            AppData:[   types_server.ORM['Object']['AppData']['AppId'], 
                        types_server.ORM['Object']['AppData']['Name'],
                        types_server.ORM['Object']['AppData']['Value'],
                        types_server.ORM['Object']['AppData']['DisplayData']][],
            User:{
                    iam_user_id:number|null,
                    iam_user_username:string|null,
                    iam_user_avatar:string|null
        },
        UserApp:{
                iam_user_app_id:number|null,
                app_id:number,
                user_theme:string,
                user_locale:string,
                user_timezone:string,
                user_direction:string,
                user_arabic_script:string,
                user_custom:{ [key: string]: string}|null
        },
        cssCommon:string,
        cssFontsArray:[],
        fonts_loaded:{family:string, url:string, attributes:{[key:string]:any}}[],
        token_dt:string|null, 
        token_at:string|null,
        token_admin_at:string|null,
        token_exp:number|null,
        token_iat:number|null,
        token_external:string|null,
        client_latitude:string|null,
        client_longitude:string|null,
        client_place:string|null,
        client_timezone:string|null
        resource:{  app_id:number, 
                    url:string, 
                    content:any, 
                    content_type:string}[]|[],
        componentSource:{   app_id:number, 
                            url:string,
                            component:any}[]|[]
    },
    Functions:{
        app_console:{warn:Function, info:Function, error:Function},
        app_eventListeners:{original:Function,  REACT:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',any,any,any,any]|[], 
                                                VUE:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',any,any,any,any]|[], 
                                                OTHER:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',any,any,any,any]|[]},
        app_function_session_expired:Function|null,
        app_function_sse:Function|null,
        app_typewatch:[],
        app_metadata:commonMetadata,
        x:{ 
            encrypt:(arg0:{iv:string, key:string, data:string})=> string,
            decrypt:(arg0:{iv:string, key:string, ciphertext:string})=> string 
            uuid?:   string,
            secret?: string
        },
        component:{[key:string]:{
                                methods?:[key:Function]|null, 
                                events?:commonComponentEvents}}
        }
}
/**
 * @name commonComponentEvents
 * @description Type commonComponentEvents
 */
type commonComponentEvents = (arg0:commonEventType, arg1:CommonAppEvent)=>Promise<void>
/**
 * @name CommonComponentLifecycle
 * @description Type CommonComponentLifecycle
*/
type CommonComponentLifecycle = {
        onBeforeMounted?:Function|null,
        onMounted?:Function|null, 
        onUnmounted?:Function|null}|null

/**
 * @name CommonComponentResult
 * @description Type CommonComponentResult
 */
type CommonComponentResult = {
        lifecycle?:CommonComponentLifecycle,
        data?:any,
        methods?:[key:Function]|null,
        events?:commonComponentEvents|undefined|null,
        template:string|null
}
/**
 * @name CommonErrorMessageISO20022
 * @description Type CommonErrorMessageISO20022
 */
type CommonErrorMessageISO20022 = {
        error:{
                http:number, 
                code:number|null,
                text:string, 
                developer_text:string|null,
                more_info:string|null
            }
}
/**
 * @name commonDocumentType
 * @description Type commonDocumentType
 */
type commonDocumentType = 'APP'|'GUIDE'|'JSDOC'|'MODULE_CODE'|'MODULE_APPS'|'MODULE_SERVICEREGISTRY'|'MODULE_SERVER'
/**
 * @name commonMetadata
 * @description commonMetadata
 */
type commonMetadata = {
    events:{
            [Key in commonEventType]?:Function|null|undefined},
            lifeCycle:{onMounted:Function|null
            }
}
/**
 * @name commonEventType
 * @description commonEventType
 */
type commonEventType = 
        'click'|
        'change'|
        'keydown'|
        'keyup'|
        'focusin'|
        'input'|
        'mousedown'|
        'mouseup'|
        'mousemove'|
        'mouseleave'|
        'wheel'|
        'touchstart'|
        'touchend'|
        'touchcancel'|
        'touchmove'|
        'copy'|
        'paste'|
        'cut'
/**
 * @name commonGeoJSONPopup
 * @description geoJSON Popup
 */
type commonGeoJSONPopup = {
        id?: string,
        type:'Feature',
        properties:{  x:number,
                    y:number,
                    countrycode:string,
                    country:string,
                    region:string,
                    city:string,
                    timezone_text:string},
                    geometry:{
                                type:'Point',
                                coordinates:[number, number][]
                    }
}
/**
 * @name commonGeoJSONTile
 * @description geoJSON tile
 */
type commonGeoJSONTile = {
        id?: string,
        type:'Feature',
        properties:{left:number,
                    top:number,                        
                    tileSize:number,
                    url:string},
                    geometry:{
                                type:'Point',
                                coordinates:null
                    }
}
/**
 * @name commonGeoJSONPolyline
 * @description geoJSON Polyline
 */
type commonGeoJSONPolyline = {
        id?: string,
        type:'Feature',
        properties:{offsetX?:number,
                    offsetY?:number,
                    title:string,
                    color:string,
                    width:number,
                    opacity?:number
                },
        geometry:{
                type:'MultiLineString'|'LineString',
                coordinates:[number, number][]
        }
}
/**
 * @name commonMapPlace
 * @description commonMapPlace
 */
type commonMapPlace = {
        place:       string,
        countryCode: string,
        region:      string,
        country:     string,
        latitude:    string,
        longitude:   string,
        timezone:    string
}
/**
 * @name commonMapLayers
 * @description commonMapLayers
 */
type commonMapLayers = {
        title:string,
        value:string,
        url:string,
        subdomains:string,
        max_zoom:number|null
        attribution:string
}
/**
 * @name CommonRESTAPIMethod
 * @description Type CommonRESTAPIMethod
 */
type CommonRESTAPIMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'

/**
 * @name CommonRESTAPIAuthorizationType
 * @description Type CommonRESTAPIMethod
 */
type CommonRESTAPIAuthorizationType = 'APP_ID'|'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_ACCESS_EXTERNAL'|'ADMIN'|'IAM'|'IAM_SIGNUP'

/**
 * @name CommonAppModuleMetadata
 * @description Type CommonAppModuleMetadata
 */
type CommonAppModuleMetadata = {
    param:{name:string, text:string, default:string|number}
}

/**
 * @name CommonCountryType
 * @description Type CommonCountryType
 */
type CommonCountryType = {
    Id:number, 
    Value:string, 
    DisplayData:string
}

/** 
 * @name CommonMasterObjectType
 * @description Type 
 */
type CommonMasterObjectType = any

/**
 * @name CommonResponsePagination
 * @description Type
 */    
type CommonResponsePagination = {
        page_header:{	total_count:number,
                        offset: 	number,
                        count:		number}
        rows:       any[]
}
/**
 * @name MessageQueuePublishMicroserviceLog
 * @description Type
 */
type MessageQueuePublishMicroserviceLog = {
        id?:number,
        service:'BATCH',
        message:{
                    type:'MICROSERVICE_LOG'|'MICROSERVICE_ERROR',
                    message:any
                },
        created?:string
}
/**
 * @name CommonWorldcitiesRecordType
 * @description Type CommonWorldcitiesRecordType
 */
type CommonWorldcitiesRecordType = {
    id:number, 
    city:string, 
    admin_name:string, 
    country:string, 
    lat:string, 
    lng:string
}
    
/**
 * @name CommonModuleCommon
 * @description Type CommonModuleCommon
 */
type CommonModuleCommon = typeof import('./public/js/common.js')
/**
 * @name CommonModuleRegional
 * @description Type CommonModuleRegional
 */
type CommonModuleRegional = typeof import('./public/modules/regional/regional.js')

/**
 * @name CommonModuleReact
 * @description Type CommonModuleReact
 */
type CommonModuleReact = typeof import('./public/modules/react/react.development.js')

/**
 * @name CommonModuleReactDOM
 * @description Type CommonModuleReactDOM
 */
type CommonModuleReactDOM = typeof import('./public/modules/react/react-dom.development.js')

/**
 * @name CommonModuleVue
 * @description Type CommonModuleVue
 */
type CommonModuleVue = typeof import('./public/modules/vue/vue.esm-browser.js')

/**
 * @name types_server
 * @description Type types_server
 */
import type types_server from '../../server/types.d.ts'

/**
 * @name CommonAppModuleWithMetadata
 * @description Type CommonAppModuleWithMetadata
 */
type CommonAppModuleWithMetadata = types_server.ORM['Object']['AppModule'] & CommonAppModuleMetadata

/**
 * @name server
 * @description Type server
 */
type server = {
        app:types_server.app,
        bff:types_server.bff,
        iam:types_server.iam,
        info:types_server.info,
        server:types_server.server,
        security:types_server.security,
        socket:types_server.socket,
        test:types_server.test,
        serviceregistry:types_server.serviceregistry,
        ORM:types_server.ORM
}
type common = {
        COMMON_WINDOW:COMMON_WINDOW,            //BOM Browser Object Model (contains what is used)
        COMMON_DOCUMENT:COMMON_DOCUMENT,        //DOM Document Object Model types (contains what is used)
        commonTarget:commonTarget,              //DOM Document Object Model types (contains what is used)
        CommonAppEvent:CommonAppEvent,          //DOM Document Object Model types (contains what is used)
        CommonFFB_parameters:CommonFFB_parameters
        CommonGlobal:CommonGlobal,
        commonComponentEvents:commonComponentEvents,
        CommonComponentLifecycle:CommonComponentLifecycle,
        CommonComponentResult:CommonComponentResult,
        CommonErrorMessageISO20022:CommonErrorMessageISO20022,
        commonDocumentType:commonDocumentType,
        commonMetadata:commonMetadata,
        commonEventType:commonEventType,
        commonGeoJSONPopup:commonGeoJSONPopup,
        commonGeoJSONTile:commonGeoJSONTile,
        commonGeoJSONPolyline:commonGeoJSONPolyline,
        commonMapPlace:commonMapPlace,
        commonMapLayers:commonMapLayers,
        CommonRESTAPIMethod:CommonRESTAPIMethod,
        CommonRESTAPIAuthorizationType:CommonRESTAPIAuthorizationType,
        CommonAppModuleMetadata:CommonAppModuleMetadata,
        CommonAppModuleWithMetadata:CommonAppModuleWithMetadata,
        CommonCountryType:CommonCountryType,
        CommonMasterObjectType:CommonMasterObjectType,
        CommonResponsePagination:CommonResponsePagination,
        MessageQueuePublishMicroserviceLog:MessageQueuePublishMicroserviceLog,
        CommonWorldcitiesRecordType:CommonWorldcitiesRecordType,
        CommonModuleCommon:CommonModuleCommon,          //Module file types
        CommonModuleRegional:CommonModuleRegional,      //Module file types
        CommonModuleReact:CommonModuleReact,            //Module file types
        CommonModuleReactDOM:CommonModuleReactDOM,      //Module file types
        CommonModuleVue:CommonModuleVue,                //Module file types
        server:server 
}
export {common};