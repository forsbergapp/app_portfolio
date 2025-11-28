/** 
 * @description Declaration of all common types used in apps
 * @module apps/common/types 
*/

/**
 * @description Type COMMON_WINDOW
 * @typedef {{  console:{ warn:function,
 *                      info:function,
 *                      error:function},
 *              atob:function,
 *              btoa:function,
 *              crypto:window['crypto'],
 *              encodeURIComponent:function,
 *              decodeURIComponent:function,
 *              setTimeout:function,
 *              clearTimeout:function,
 *              open:function,
 *              addEventListener:function,  //used to override default function with custom function to keep track of third party libraries
 *              navigator:{language:string, userAgent:string, serviceWorker:{register:function}},
 *              location:{pathname:string, reload:function},
 *              Intl:{DateTimeFormat()      :{resolvedOptions(): Intl.ResolvedDateTimeFormatOptions},
 *                    NumberFormat()        :{resolvedOptions(): Intl.ResolvedNumberFormatOptions},
 *                    DateTimeFormatOptions?:Intl.DateTimeFormatOptions},
 *              prompt:function,
 *              frames:{document:COMMON_DOCUMENT},
 *              Promise:function,
 *              ReactDOM?:*,
 *              React?:*,
 *              __VUE_DEVTOOLS_HOOK_REPLAY__?:*,
 *              __VUE_HMR_RUNTIME__?:*,
 *              __VUE__?:*}} COMMON_WINDOW
 */

/**
 * @description Type COMMON_DOCUMENT
 * @typedef {{  body:{className:string, requestFullscreen:function, classList:DOMTokenList},
 *              createElement:function,
 *              addEventListener:function,
 *              adoptedStyleSheets:DocumentOrShadowRoot['adoptedStyleSheets'],
 *              fonts:*,
 *              removeEventListener:function,
 *              fullscreenElement:Element|null,
 *              exitFullscreen:function,
 *              querySelector:function,
 *              querySelectorAll:function,
 *              title:string}} COMMON_DOCUMENT
 */
/**
 * @description Type target
 * @typedef {{  id:                 string,
 *              blur:               function,
 *              href:               string,
 *              focus:              function,
 *              classList:          DOMTokenList,
 *              className:          string,
 *              'data-function':    function,
 *              'data-functionData':Promise.<(arg0:CommonAppEvent['target'])=>{id:*, value:*}>|null|undefined,
 *              'data-functionRow': Promise.<(arg0:CommonAppEvent['target'])=>{id:*, value:*}>|null|undefined,
 *              dispatchEvent:      function,
 *              getAttribute:       function,
 *              innerHTML:          string,
 *              textContent:        string,
 *              nextElementSibling: {dispatchEvent:function},
 *              nodeName:           string,
 *              options:            HTMLOptionsCollection,
 *              parentNode:         {
 *                                      id: string,
 *                                      classList:DOMTokenList,
 *                                      nextElementSibling:{querySelector:function},
 *                                      innerHTML:string,
 *                                      getAttribute:function,
 *                                      parentNode:{style:{display:string}},
 *                                      style:{display:string},
 *                                      querySelector: function
 *                                      remove: function
 *                                  },
 *              setAttribute:       function,
 *              value:              string
 *            }} commonTarget
 */
/**
 * @description Type CommonAppEvent
 * 
 * events only used on DOM, third party libraries might use events on window in BOM
 * 
 * @typedef {object}        CommonAppEvent
 * @property {object}       clipboardData
 * @property {function}     clipboardData.getData 
 * @property {string}       code
 * @property {string}       key
 * @property {boolean}      altKey
 * @property {boolean}      ctrlKey
 * @property {boolean}      shiftKey
 * @property {function}     preventDefault
 * @property {function}     stopPropagation
 * @property {string}       type
 * @property {number}       layerX
 * @property {[*]}          touches
 * @property {number}       clientX
 * @property {number}       clientY
 * @property {number}       deltaY
 * @property {commonTarget} target
 * @property {commonTarget} currentTarget
 */

/**
 * @description  Type CommonFFB_parameters
 * @typedef {{  app_id:number,
 *              uuid:string,
*               secret:string,
*               response_type?:'SSE'|'TEXT'|'BLOB',
*               spinner_id?:string|null,
*               timeout?:number|null,
*               app_admin_app_id:number,
*               rest_api_version: string,
*               rest_bff_path   : string,
*               data:{
*                       locale:string,
*                       idToken: string,
*                       accessToken?:string,
*                       path:string,
*                       query?:string|null,
*                       method:string,
*                       authorization_type:string,
*                       username?:string,
*                       password?:string,
*                       body?:*}}} CommonFFB_parameters
 */
/**
 * @description Type CommonGlobal
 * @typedef {{  app_id:number,
 *              app_logo:string|null,
 *              app_copyright:string|null,
 *              app_link_url:string|null,
 *              app_link_title:string|null,
 *              app_text_edit:string|null,
 *              app_common_app_id:number,
 *              app_admin_app_id:number,
 *              app_start_app_id:number,
 *              app_toolbar_button_start:number,
 *              app_toolbar_button_framework:number,
 *              app_framework:number,
 *              app_framework_messages:number,
 *              app_rest_api_version:string|null,
 *              app_rest_api_basepath:string|null,
 *              app_root:string,
 *              app_div:string,
 *              app_console:{warn:function, info:function, error:function},
 *              app_eventListeners:{original:function, REACT:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',*,*,*,*]|[], 
 *                                                     VUE:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',*,*,*,*]|[], 
 *                                                     OTHER:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',*,*,*,*]|[]},
 *              app_function_exception:function|null,
 *              app_function_session_expired:function|null,
 *              app_function_sse:function|null,
 *              app_fonts:[],
 *              app_content_type_json: string,
 *              app_content_type_html: string,
 *              app_content_type_sse:  string,
 *              app_fonts_loaded:{family:string, url:string, attributes:Object.<string,*>}[],
 *              app_request_tries:number,
 *              app_requesttimeout_seconds:number,
 *              app_requesttimeout_admin_minutes:number,
 *              app_metadata:commonMetadata,
 *              app_typewatch:[],
 *              info_link_policy_name:string|null,
 *              info_link_disclaimer_name:string|null,
 *              info_link_terms_name:string|null,
 *              info_link_policy_url:string|null,
 *              info_link_disclaimer_url:string|null,
 *              info_link_terms_url:string|null,
 *              iam_user_app_id:number|null,
 *              iam_user_id:number|null,
 *              iam_user_username:string|null,
 *              iam_user_avatar:string|null,
 *              admin_first_time:number|null,
 *              admin_only:number|null,
 *              x:{ 
 *                  encrypt:(arg0:{iv:string, key:string, data:string})=> string,
 *                  decrypt:(arg0:{iv:string, key:string, ciphertext:string})=> string 
 *                  uuid?:   string,
 *                  secret?: string},
 *              client_latitude:string|null,
 *              client_longitude:string|null,
 *              client_place:string|null,
 *              client_timezone:string|null,
 *              token_dt:string|null, 
 *              token_at:string|null,
 *              token_admin_at:string|null,
 *              token_exp:number|null,
 *              token_iat:number|null,
 *              token_external:string|null,
 *              rest_resource_bff:string|null,
 *              user_locale:string,
 *              user_timezone:string,
 *              user_direction:string,
 *              user_arabic_script:string,
 *              user_custom:{ [key: string]: string}|null,
 *              resource_import:{   app_id:number, 
 *                                  url:string, 
 *                                  content:*, 
 *                                  content_type:string}[]|[],
 *              component_import:{app_id:number, url:string,component:*}[]|[],
 *              component:Object.<string,   {
 *                                          methods?:Object.<string,function>|null, 
 *                                          events?:commonComponentEvents}>
 *      }} CommonGlobal
 */
/**
 * @description Type commonComponentEvents
 * @typedef{(arg0:commonEventType, arg1:CommonAppEvent)=>Promise.<void>} commonComponentEvents
 */
/**
 * @description Type CommonComponentLifecycle
 * @typedef  {{ onBeforeMounted?:function|null,
 *              onMounted?:function|null, 
 *              onUnmounted?:function|null}|null} CommonComponentLifecycle
*/

/**
 * @description Type CommonComponentResult
 * @typedef  {{ lifecycle?:CommonComponentLifecycle,
 *              data?:*,
 *              methods?:Object.<string,function>|null,
 *              events?:commonComponentEvents|undefined|null,
 *              template:string|null}} CommonComponentResult
 */

/**
 * @description Type CommonErrorMessageISO20022
 * @typedef {{error:{
 *               http:number, 
 *               code:number|null,
 *               text:string, 
 *               developer_text:string|null,
 *               more_info:string|null}}} CommonErrorMessageISO20022
 */

/**
 * @description Type commonDocumentType
 * @typedef {'APP'|'GUIDE'|'JSDOC'|'MODULE_CODE'|'MODULE_APPS'|'MODULE_SERVICEREGISTRY'|'MODULE_SERVER'} commonDocumentType
 */
/**
 * @description commonMetadata
 * @typedef {{  events:{[Key in commonEventType]?:function|null|undefined},
 *              lifeCycle:{onMounted:function|null}}} commonMetadata
 */
/**
 * @description commonEventType
 * @typedef {   'click'|
 *              'change'|
 *              'keydown'|
 *              'keyup'|
 *              'focusin'|
 *              'input'|
 *              'mousedown'|
 *              'mouseup'|
 *              'mousemove'|
 *              'mouseleave'|
 *              'wheel'|
 *              'touchstart'|
 *              'touchend'|
 *              'touchcancel'|
 *              'touchmove'|
 *              'copy'|
 *              'paste'|
 *              'cut'} commonEventType
 */
/**
 * @description geoJSON Popup
 * @typedef {{   
 *            id?: string,
 *            type:'Feature',
 *            properties:{  x:number,
 *                          y:number,
 *                          countrycode:string,
 *                          country:string,
 *                          region:string,
 *                          city:string,
 *                          timezone_text:string},
 *                          geometry:{
 *                                      type:'Point',
 *                                      coordinates:[number, number][]
 *                          }
 *          }} commonGeoJSONPopup
 */
/**
 * @description geoJSON tile
 * @typedef {{   
 *            id?: string,
 *            type:'Feature',
 *            properties:{  left:number,
 *                          top:number,                        
 *                          tileSize:number,
 *                          url:string},
 *                          geometry:{
 *                                      type:'Point',
 *                                      coordinates:null
 *                          }
 *          }} commonGeoJSONTile
 */
/**
 * @description geoJSON Polyline
 * @typedef {{   
 *            id?: string,
 *            type:'Feature',
 *            properties:{offsetX?:number,
 *                        offsetY?:number,
 *                        title:string,
 *                        color:string,
 *                        width:number,
 *                        opacity?:number
 *                      },
 *            geometry:{
 *                       type:'MultiLineString'|'LineString',
 *                       coordinates:[number, number][]
 *            }
 *          }} commonGeoJSONPolyline
 */

/**
 * @description commonMapPlace
 * @typedef {{  place:       string,
 *              countryCode: string,
 *              region:      string,
 *              country:     string,
 *              latitude:    string,
 *              longitude:   string,
 *              timezone:    string}} commonMapPlace
 */

/**
 * @description commonMapLayers
 * @typedef {{  title:string,
 *              value:string,
 *              url:string,
 *              max_zoom:number|null
 *              attribution:string}} commonMapLayers
 */
/**
 * @description Type CommonRESTAPIMethod
 * @typedef{'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} CommonRESTAPIMethod
 */

/**
 * @description Type CommonRESTAPIMethod
 * @typedef{'APP_ID'|'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_ACCESS_EXTERNAL'|'ADMIN'|'IAM'|'IAM_SIGNUP'} CommonRESTAPIAuthorizationType
 */

/**
 * @description Type CommonAppModuleMetadata
 * @typedef {{param:{name:string, text:string, default:string|number}}} CommonAppModuleMetadata
 */

/**
 * @description Type CommonCountryType
 * @typedef {{Id:number, Value:string, DisplayData:string}} CommonCountryType
 */

/** 
 * @description Type 
 * @typedef {*} CommonMasterObjectType
 */

/**
 * @description Type
 * @typedef {{   page_header:{	total_count:number,
 *                              offset: 	number,
 *                              count:		number}
 *              rows:       *[]}} CommonResponsePagination
 */    

/**
 * @description Type
 * @typedef {{  id?:number,
 *              service:'BATCH',
 *              message:{type:'MICROSERVICE_LOG'|'MICROSERVICE_ERROR',
 *                       message:*},
 *              created?:string}} MessageQueuePublishMicroserviceLog
 */

/**
 * @description Type CommonWorldcitiesRecordType
 * @typedef {{id:number, city:string, admin_name:string, country:string, lat:string, lng:string}} CommonWorldcitiesRecordType
 */
    
/**
 * @description Type CommonModuleCommon
 * @typedef {import('./common/public/js/common.js')} CommonModuleCommon
 */
/**
 * @description Type CommonModuleRegional
 * @typedef {import('./common/public/modules/regional/regional.js')} CommonModuleRegional
 */
/**
 * @description Type CommonModuleReact
 * @typedef {import('./common/public/modules/react/react.development.js')} CommonModuleReact
 */
/**
 * @description Type CommonModuleReactDOM
 * @typedef {import('./common/public/modules/react/react-dom.development.js')} CommonModuleReactDOM
 */
/**
 * @description Type CommonModuleVue
 * @typedef {import('./common/public/modules/vue/vue.esm-browser.js')} CommonModuleVue
 */

/**
 * @import {server} from '../server/types.js'}
 */

/**
 * @description Type common
 * @typedef {{	COMMON_WINDOW:COMMON_WINDOW,            //BOM Browser Object Model (contains what is used)
 *              COMMON_DOCUMENT:COMMON_DOCUMENT,        //DOM Document Object Model types (contains what is used)
 *		        commonTarget:commonTarget,              //DOM Document Object Model types (contains what is used)
 *              CommonAppEvent:CommonAppEvent,          //DOM Document Object Model types (contains what is used)
 *              CommonFFB_parameters:CommonFFB_parameters
 *              CommonGlobal:CommonGlobal,
 *              commonComponentEvents:commonComponentEvents,
 *              CommonComponentLifecycle:CommonComponentLifecycle,
 *              CommonComponentResult:CommonComponentResult,
 *              CommonErrorMessageISO20022:CommonErrorMessageISO20022,
 *              commonDocumentType:commonDocumentType,
 *              commonMetadata:commonMetadata,
 *              commonEventType:commonEventType,
 *              commonGeoJSONPopup:commonGeoJSONPopup,
 *              commonGeoJSONTile:commonGeoJSONTile,
 *              commonGeoJSONPolyline:commonGeoJSONPolyline,
 *              commonMapPlace:commonMapPlace,
 *              commonMapLayers:commonMapLayers,
 *              CommonRESTAPIMethod:CommonRESTAPIMethod,
 *              CommonRESTAPIAuthorizationType:CommonRESTAPIAuthorizationType,
 *              CommonAppModuleMetadata:CommonAppModuleMetadata,
 *              CommonAppModuleWithMetadata:server['ORM']['Object']['AppModule'] & CommonAppModuleMetadata,
 *              CommonCountryType:CommonCountryType,
 *              CommonMasterObjectType:CommonMasterObjectType,
 *              CommonResponsePagination:CommonResponsePagination,
 *              MessageQueuePublishMicroserviceLog:MessageQueuePublishMicroserviceLog,
 *              CommonWorldcitiesRecordType:CommonWorldcitiesRecordType,
 *              CommonModuleCommon:CommonModuleCommon,          //Module file types
 *              CommonModuleRegional:CommonModuleRegional,      //Module file types
 *              CommonModuleReact:CommonModuleReact,            //Module file types
 *              CommonModuleReactDOM:CommonModuleReactDOM,      //Module file types
 *              CommonModuleVue:CommonModuleVue,                //Module file types
 *              server:server}
 *          } common
 */

 export {};