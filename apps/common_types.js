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
 *              app_fonts_loaded:{family:string, url:string, attributes:Object.<string,*>}[],
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
 *              token_at:string|null,
 *              token_dt:string|null,
 *              token_admin_at:string|null,
 *              token_exp:number|null,
 *              token_iat:number|null,
 *              rest_resource_bff:string|null,
 *              user_locale:string,
 *              user_timezone:string,
 *              user_direction:string,
 *              user_arabic_script:string,
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
 *              events?:commonComponentEvents,
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
 * @description Type CommonAppMenu
 * @typedef {{  id:number, 
 *              menu:string,
 *              type:'GUIDE'|'APP',
 *              menu_sub:{  id:number,
 *                          menu:string,
 *                          doc:string}[]|null}} CommonAppMenu
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
 * @description Type CommonAppRecord
 * @typedef {{
 *              id: number,
 *              name: string,
 *              path: string,
 *              logo:string,
 *              js:string,
 *              css: string,
 *              css_report: string,
 *              favicon_32x32:string,
 *              favicon_192x192:string,
 *              text_edit:string,
 *              copyright:string,
 *              link_title:string,
 *              link_url:string,
 *              status:'ONLINE'|'OFFLINE',
 *              app_name_translation:string,
 *              protocol:string,
 *              host:string,
 *              port:string}} CommonAppRecord
 */
/**
 * @description Type commonInitAppParameters
 * @typedef {{  AppParametersCommon: {
 *                      app_id?:                             number,
 *                      common_info_link_policy_name:        {value:string},
 *                      common_info_link_policy_url:         {value:string},
 *                      common_info_link_disclaimer_name:    {value:string},
 *                      common_info_link_disclaimer_url:     {value:string},
 *                      common_info_link_terms_name:         {value:string},
 *                      common_info_link_terms_url:          {value:string}
 *                      },
 *              Info:   {
 *                      app_id:                         number,
 *                      app_idtoken:                    string,
 *                      client_latitude:                string,
 *                      client_longitude:               string,
 *                      client_place:                   string,
 *                      client_timezone:                string,
 *                      app_start_app_id:               number,
 *                      app_common_app_id:              number,
 *                      app_admin_app_id:               number,
 *                      app_toolbar_button_start:       number,
 *                      app_toolbar_button_framework:   number,
 *                      app_framework:                  number,
 *                      app_framework_messages:         number,
 *                      rest_resource_bff:              string,
 *                      rest_api_version:               string,
 *                      first_time:                     1|0,
 *                      admin_only:                     1|0
 *                      }
 *          }} commonInitAppParameters
 */
/**
 * @description Type commonAppInit
 * @typedef {{App:{
 *                  id:CommonAppRecord['id'],
 *                  name:CommonAppRecord['name'],
 *                  js:CommonAppRecord['js'],
 *                  js_content:string|null,
 *                  css:CommonAppRecord['css'],
 *                  css_content:string|null,
 *                  css_report:CommonAppRecord['css_report'],
 *                  css_report_content:string|null,
 *                  favicon_32x32:CommonAppRecord['favicon_32x32'],
 *                  favicon_32x32_content:string|null,
 *                  favicon_192x192:CommonAppRecord['favicon_192x192'],
 *                  favicon_192x192_content:string|null,
 *                  logo:CommonAppRecord['logo'],
 *                  logo_content:string|null,
 *                  copyright:CommonAppRecord['copyright'],
 *                  link_url:CommonAppRecord['link_url'],
 *                  link_title:CommonAppRecord['link_title'],
 *                  text_edit:CommonAppRecord['text_edit']
 *                  },
 *          AppParameter:Object.<string,*>}} commonAppInit
 */
/**
 * @description Type CommonAppDataRecord
 * @typedef {{  id:number,
 *              app_id: number,
 *              name: string,
 *              value:string,
 *              display_data:string,
 *              data2:string|number|null,
 *              data3:string|number|null,
 *              data4:string|number|null,
 *              data5:string|number|null}} CommonAppDataRecord
 */

/**
 * @description Type CommonAppModulesRecord
 * @typedef {{  id:number,
 *              app_id: number,
 *              common_type: 'FUNCTION'|'MODULE'|'REPORT',
 *              common_name:string,
 *              common_role:'APP_ID'|'APP_ACCESS'|'APP_EXTERNAL'|'APP_ACCESS_EXTERNAL'|null,
 *              common_path:string,
 *              common_description:string}} CommonAppModulesRecord
 */
/**
 * @description Type CommonAppModuleMetadata
 * @typedef {{param:{name:string, text:string, default:string|number}}} CommonAppModuleMetadata
 */
/**
 * @description Type CommonAppModuleWithMetadata
 * @typedef {{  id:number,
 *              app_id: number,
 *              common_type: 'FUNCTION'|'MODULE'|'REPORT',
 *              common_name:string,
 *              common_path:string,
 *              common_metadata:CommonAppModuleMetadata[],
 *              common_description:string}} CommonAppModuleWithMetadata
 */
/**
 * @description Type CommonAppModuleQueueStatus
 * @typedef{'PENDING'|'RUNNING'|'COMPLETED'|'SUCCESS'|'FAIL'} CommonAppModuleQueueStatus
 */
/**
 * CommonAppModuleQueue
 * @typedef {{  id:number,
 *              app_id: number,
 *              type:'REPORT',
 *              name: string,
 *              parameters:string,
 *              user:string,
 *              start:string|null,
 *              end:string|null,
 *              progress:number|null,
 *              status:CommonAppModuleQueueStatus,
 *              message:string|null}} CommonAppModuleQueue
 */

/**
 * @description Type CommonCountryType
 * @typedef {{id:number, value:string, display_data:string}} CommonCountryType
 */

/**
 * @description Type CommonProfileUser
 * @typedef {{  id:number,
 *              bio:string|null,
 *              private:number|null,
 *              friends:number|null,
 *              user_level:string|null,
 *              created:string|null,
 *              username:string|null, 
 *              avatar:string|null,
 *              count_following:number|null,
 *              count_followed:number|null,
 *              count_likes:number|null,
 *              count_liked:number|null,
 *              count_views:number|null,
 *              followed_id:number|null,
 *              liked_id:number|null}} CommonProfileUser
 */

/**
 * @description Type CommonProfileStatRecord
 * @typedef {{id:number, username:string, avatar:string|null, count:number}}   CommonProfileStatRecord
 */

/**
 * @description Type CommonProfileSearchRecord
 * @typedef {{id:number, avatar:string, username:string}} CommonProfileSearchRecord
 */
 
/** 
 * @description Type 
 * @typedef {*} CommonMasterObjectType
 */

/**
 * @description Type
 * @typedef {{  sender:string|null,
 *              receiver_id:number|null,
 *              host:string,
 *              client_ip:string,
 *              subject:string,
 *              message:string
 *          }} CommonMessageType
 */
/**
 * @description Type
 * @typedef {{  id?:number,
 *              service:'MESSAGE'|'BATCH',
 *              message:CommonMessageType,
 *              created?:string,
 *              read?:boolean}} MessageQueuePublishMessage
 */
/**
 * @description Type
 * @typedef{{   page_header:{	total_count:number,
 *                              offset: 	number,
 *                              count:		number}
 *              rows:       MessageQueuePublishMessage[]}} MessagesPagination
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
 * @description Type CommonIAMUser
 * @typedef {{  id:number, 
 *              username:string, 
 *              password:string, 
 *              password_reminder:string|null, 
 *              type: 'ADMIN'|'USER', 
 *              bio:string|null, 
 *              private:number|null, 
 *              otp_key:string|null,
 *              avatar:string|null,
 *              user_level:number|null, 
 *              status:number|null, 
 *              active:number,
 *              created:string, 
 *              modified:string,
 *              last_logintime?:string}} CommonIAMUser
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
 *              CommonAppMenu:CommonAppMenu,
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
 *              CommonAppRecord:CommonAppRecord,
 *              commonInitAppParameters:commonInitAppParameters,
 *              commonAppInit:commonAppInit,
 *              CommonAppDataRecord:CommonAppDataRecord,
 *              CommonAppModulesRecord:CommonAppModulesRecord,
 *              CommonAppModuleMetadata:CommonAppModuleMetadata,
 *              CommonAppModuleWithMetadata:CommonAppModuleWithMetadata,
 *              CommonAppModuleQueueStatus:CommonAppModuleQueueStatus,
 *              CommonAppModuleQueue:CommonAppModuleQueue,
 *              CommonCountryType:CommonCountryType,
 *              CommonProfileUser:CommonProfileUser,
 *              CommonProfileStatRecord:CommonProfileStatRecord,
 *              CommonProfileSearchRecord:CommonProfileSearchRecord,
 *              CommonMasterObjectType:CommonMasterObjectType,
 *              CommonMessageType:CommonMessageType,
 *              MessageQueuePublishMessage:MessageQueuePublishMessage,
 *              MessagesPagination:MessagesPagination,
 *              MessageQueuePublishMicroserviceLog:MessageQueuePublishMicroserviceLog,
 *              CommonWorldcitiesRecordType:CommonWorldcitiesRecordType,
 *              CommonIAMUser:CommonIAMUser,
 *              CommonModuleCommon:CommonModuleCommon,          //Module file types
 *              CommonModuleRegional:CommonModuleRegional,      //Module file types
 *              CommonModuleReact:CommonModuleReact,            //Module file types
 *              CommonModuleReactDOM:CommonModuleReactDOM,      //Module file types
 *              CommonModuleVue:CommonModuleVue}                //Module file types
 *          } common
 */

 export {};