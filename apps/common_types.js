/** 
 * Declaration of all common types used in apps
 * 
 * BOM Browser Object Model (contains what is used)
 *  CommonAppWindow
 *  CommonAppEventEventSource
 * 
 * DOM Document Object Model types (contains what is used)
 *  CommonAppDocument
 *  CommonAppEvent
 * 
 * Common app types
 *  CommonGlobal
 *  CommonIcons
 *  CommonComponentResult
 *  CommonErrorMessageISO20022
 *  CommonTranslationkey
 * 
 * Common REST API types
 *  CommonAppRecord
 *  CommonCountryType
 *  CommonProfileUser
 *  CommonProfileTopRecord
 *  CommonProvider
 *  CommonProfileSearchRecord
 *  CommonMasterObjectType
 * 
 * Common module types
 *  CommonModuleLeafletEvent
 *  CommonModuleLeafletMapData
 *  CommonModuleLeafletData
 *  CommonModuleLeafletMapLayer
 *  CommonModuleLeafletMapLayer_array
 * 
 * Common Microservice types
 *  CommonMicroserviceWorldcitiesRecordType
 * 
 * Common Module files types 
 *  CommonModuleCommon
 *  CommonModuleEasyQRCode
 *  CommonModuleLeaflet
 *  CommonModulePrayTimes
 *  CommonModuleRegional
 *  CommonModuleReact
 *  CommonModuleReactDOM
 *  CommonModuleVue
 * 
 * @module apps/types 
*/

/**
 * Type CommonAppWindow
 * @typedef {{  console:{ warn:function,
 *                      info:function,
 *                      error:function},
 *              atob:function,
 *              btoa:function,
 *              setTimeout:function,
 *              clearTimeout:function,
 *              setInterval:function,
 *              clearInterval:function,
 *              open:function,
 *              addEventListener:function,  //used to override default function with custom function to keep track of third party libraries
 *              EventSource:*,
 *              navigator:{language:string, userAgent:string, serviceWorker:{register:function}},
 *              location:{pathname:string},
 *              Intl:{DateTimeFormat()      :{resolvedOptions(): Intl.ResolvedDateTimeFormatOptions},
 *                    NumberFormat()        :{resolvedOptions(): Intl.ResolvedNumberFormatOptions},
 *                    DateTimeFormatOptions?:Intl.DateTimeFormatOptions},
 *              prompt:function,
 *              frames:{document:CommonAppDocument},
 *              Promise:function,
 *              ReactDOM?:*,
 *              React?:*,
 *              __VUE_DEVTOOLS_HOOK_REPLAY__?:*,
 *              __VUE_HMR_RUNTIME__?:*,
 *              __VUE__?:*}} CommonAppWindow
 */

/**
 * Type CommonAppDocument
 * @typedef {{  body:{className:string, requestFullscreen:function, classList:{add:function, remove:function}},
 *              createElement:function,
 *              addEventListener:function,
 *              removeEventListener:function,
 *              fullscreenElement:Element|null,
 *              exitFullscreen:function,
 *              querySelector:function,
 *              querySelectorAll:function,
 *              title:string}} CommonAppDocument
 */

/**
 * Type CommonAppEvent
 * 
 * events only used on DOM, third party libraries might use events on window in BOM
 * 
 * @typedef {object}    CommonAppEvent
 * @property {object}   clipboardData
 * @property {function} clipboardData.getData 
 * @property {string}   code
 * @property {string}   key
 * @property {boolean}  altKey
 * @property {boolean}  ctrlKey
 * @property {boolean}  shiftKey
 * @property {function} preventDefault
 * @property {function} stopPropagation
 * @property {string}   type
 * @property {number}   layerX
 * @property {[*]}       touches
 * @property {number}   clientX
 * @property {number}   clientY
 * @property {{ id:                 string,
 *              blur:               function,
 *              focus:              function,
 *              classList:          {contains:function, remove:function, add:function},
 *              className:          string,
 *              'data-function':    function,
 *              dispatchEvent:      function,
 *              getAttribute:       function,
 *              innerHTML:          string,
 *              innerText:          string,
 *              nextElementSibling: {dispatchEvent:function},
 *              nodeName:           string,
 *              options:            HTMLOptionsCollection,
 *              parentNode:         {id: string,
 *                                   classList:{contains:function},
 *                                   nextElementSibling:{querySelector:function},
 *                                   innerHTML:string,
 *                                   getAttribute:function,
 *                                   parentNode:{style:{display:string}},
 *                                   style:{display:string}},
 *              selectedIndex:      number,
 *              setAttribute:       function,
 *              value:              string
 *            }}  target
 */

/**
 * Type CommonAppEventEventSource
 * @typedef {{data:string}} CommonAppEventEventSource
 */

/**
 * Type CommonGlobal
 * @typedef {{  common_app_id:number,
 *              app_id:number|null,
 *              app_logo:string|null,
 *              app_email:string|null,
 *              app_copyright:string|null,
 *              app_link_url:string|null,
 *              app_link_title:string|null,
 *              app_text_edit:string|null,
 *              app_framework:number|null,
 *              app_framework_messages:number|null,
 *              app_rest_api_version:number|null,
 *              app_root:string,
 *              app_div:string,
 *              app_console:{warn:function, info:function, error:function},
 *              app_eventListeners:{original:function, LEAFLET:[*]|[], REACT:[*]|[], VUE:[*]|[], OTHER:[*]|[]},
 *              app_function_exception:function|null,
 *              app_function_session_expired:function|null,
 *              app_function_sse:function|null,
 *              info_link_policy_name:string|null,
 *              info_link_disclaimer_name:string|null,
 *              info_link_terms_name:string|null,
 *              info_link_about_name:string|null,
 *              info_link_policy_url:string|null,
 *              info_link_disclaimer_url:string|null,
 *              info_link_terms_url:string|null,
 *              info_link_about_url:string|null,
 *              user_app_role_id:number|null,
 *              system_admin:string|null,
 *              system_admin_first_time:number|null,
 *              system_admin_only:number|null,
 *              user_identity_provider_id:number|null,
 *              user_account_id:number|null,
 *              user_account_username:string|null,
 *              client_latitude:string,
 *              client_longitude:string,
 *              client_place:string,
 *              client_timezone:string,
 *              token_at:string|null,
 *              token_dt:string|null,
 *              token_admin_at:string|null,
 *              token_exp:number|null,
 *              token_iat:number|null,
 *              token_timestamp:number|null,
 *              rest_resource_bff:string|null,
 *              image_file_allowed_type1:string|null,
 *              image_file_allowed_type2:string|null,
 *              image_file_allowed_type3:string|null,
 *              image_file_allowed_type4:string|null,
 *              image_file_allowed_type5:string|null,
 *              image_file_mime_type:string|null,
 *              image_file_max_size:number,
 *              image_avatar_width:number,
 *              image_avatar_height:number,
 *              user_locale:string,
 *              user_timezone:string,
 *              user_direction:string,
 *              user_arabic_script:string,
 *              translate_items: {	USERNAME:string,
 *									EMAIL:string,
 *									NEW_EMAIL:string,
 *									BIO:string,
 *									PASSWORD:string,
 *									PASSWORD_CONFIRM:string,
 *									PASSWORD_REMINDER:string,
 *									NEW_PASSWORD_CONFIRM:string,
 *									NEW_PASSWORD:string,
 *									CONFIRM_QUESTION:string},
 *              module_leaflet:*,
 *              module_leaflet_flyto:number,
 *              module_leaflet_jumpto:number,
 *              module_leaflet_popup_offset:number,
 *              module_leaflet_style:string,
 *              module_leaflet_session_map:{doubleClickZoom:function|null,
 *                                          invalidateSize:function|null,
 *                                          removeLayer:function|null,
 *                                          setView:function|null,
 *                                          flyTo:function|null,
 *                                          setZoom:function|null,
 *                                          getZoom:function|null}|null,
 *           module_leaflet_session_map_layer:[],
 *           module_leaflet_zoom:number, 
 *           module_leaflet_zoom_city:number,
 *           module_leaflet_zoom_pp:number,
 *           module_leaflet_marker_div_gps:string,
 *           module_leaflet_marker_div_city:string,
 *           module_leaflet_marker_div_pp:string,
 *           module_leaflet_map_styles:CommonModuleLeafletMapLayer[],
 *           'module_easy.qrcode_width':number|null,
 *           'module_easy.qrcode_height':number|null,
 *           'module_easy.qrcode_color_dark':string|null,
 *           'module_easy.qrcode_color_light':string|null,
 *           service_socket_client_ID:number|null,
 *           service_socket_eventsource:{onmessage:function,
 *                                       onerror:function,
 *                                       close:function}|null}} CommonGlobal
 */
/**
 * Type CommonIcons
 *  @typedef {{ app_maintenance:          string,
 *              app_alert:                string,
 *              infinite:                 string}} CommonIcons
 */

/**
 * Type CommonComponentResult
 * @typedef  {{ props:{function_post:function|null, function_error:function|null}, 
 *              data:*,
 *              template:string|null}} CommonComponentResult
 */

/**
 * Type CommonErrorMessageISO20022
 * @typedef {{"error":{
 *               "http":number, 
 *               "code":number|null,
 *               "text":string, 
 *               "developer_text":string|null,
 *               "more_info":string|null}}} CommonErrorMessageISO20022
 */
/**
 * Type CommonTranslationKey
 * @typedef {   'USERNAME'|'EMAIL'|'NEW_EMAIL'|'BIO'|'PASSWORD'|'PASSWORD_CONFIRM'|'PASSWORD_REMINDER'|'NEW_PASSWORD_CONFIRM'|'NEW_PASSWORD'|'CONFIRM_QUESTION'} CommonTranslationkey
 */
/**
 * Type CommonProfileUser
 * @typedef {{  id:number|null,
 *              bio:string|null,
 *              private:number|null,
 *              friends:number|null,
 *              user_level:string|null,
 *              date_created:string|null,
 *              username:string|null, 
 *              avatar:string|null,
 *              identity_provider_id:number|null,
 *              provider_id:string|null,
 *              provider_first_name:string|null,
 *              provider_last_name:string|null,
 *              provider_image:string|null,
 *              provider_image_url:string|null,
 *              count_following:number|null,
 *              count_followed:number|null,
 *              count_likes:number|null,
 *              count_liked:number|null,
 *              count_views:number|null,
 *              followed:number|null,
 *              liked:number|null}} CommonProfileUser
 */

/**
 * Type CommonProfileTopRecord
 * @typedef {{id:number, username:string, avatar:string|null, provider_image: string|null, count:number}}   CommonProfileTopRecord
 */
/**
 * Type CommonProvider
 * @typedef {{id:number, provider_name:string}} CommonProvider
 */

/**
 * Type CommonProfileSearchRecord
 * @typedef {{id:number, avatar:string, provider_image:string, username:string}} CommonProfileSearchRecord
 */

/**
 * Type CommonAppRecord
 * @typedef {{  APP_ID:number,
 *              SUBDOMAIN:string,
 *              PROTOCOL:string,
 *              HOST:string,
 *              PORT:string,
 *              LOGO:string,
 *              NAME:string,
 *              APP_CATEGORY:string
 *              APP_NAME_TRANSLATION:string}} CommonAppRecord
 */

 /**
 * Type CommonCountryType
* @typedef {{id:number, value:string, display_data:string}} CommonCountryType
*/

/** 
 * Type 
 * @typedef {*} CommonMasterObjectType
 */

/**
 * Type CommonModuleLeafletEvent
 * @typedef {{  originalEvent:CommonAppEvent,
 *              latlng:{lat:string, 
 *                      lng:string}}} CommonModuleLeafletEvent
 */

/**
 * Type CommonModuleLeafletMapData
 * @typedef {{  doubleClickZoom:function,
 *              invalidateSize:function,
 *              removeLayer:function,
 *              setView:function,
 *              flyTo:function,
 *              setZoom:function,
 *              getZoom:function}} CommonModuleLeafletMapData
 *
 */
/**
 * Type CommonModuleLeafletData
 * @typedef {{  library_Leaflet:*,
 *              module_map: CommonModuleLeafletMapData,
 *              leaflet_container:string}} CommonModuleLeafletData
 */

/**
 * Type CommonModuleLeafletMapLayer
 * @typedef {{  id:number|null,
 *              display_data: string|null, 
 *              value?:string|null, 
 *              data2:string|null, 
 *              data3:string|null, 
 *              data4:string|null,
 *              session_map_layer:string|null}}  CommonModuleLeafletMapLayer
 */

/**
 * Type CommonModuleLeafletMapLayer_array
 * @typedef {{  id:number,
 *              display_data:string,
 *              value:string,
 *              data:string,
 *              data2:string,
 *              data3:string,
 *              data4:string,
 *              session_map_layer:*}} CommonModuleLeafletMapLayer_array
 */

/**
 * Type CommonMicroserviceWorldcitiesRecordType
 * @typedef {{id:number, city:string, admin_name:string, country:string, lat:string, lng:string}} CommonMicroserviceWorldcitiesRecordType
 */
    
/**
 * Type CommonModuleCommon
 * @typedef {import('./common/public/js/common.js')} CommonModuleCommon
 */
/**
 * Type CommonModuleEasyQRCode
 * @typedef {{QRCode:*}} CommonModuleEasyQRCode
 */
/**
 * Type CommonModuleLeaflet
 * @typedef {import('./common/public/modules/leaflet/leaflet-src.esm.js')} CommonModuleLeaflet
 */
/**
 * Type CommonModulePrayTimes
 * @typedef {{default:{adjust:function, getTimes:function, setMethod:function}}} CommonModulePrayTimes
 */
/**
 * Type CommonModuleRegional
 * @typedef {import('./common/public/modules/regional/regional.js')} CommonModuleRegional
 */
/**
 * Type CommonModuleReact
 * @typedef {import('./common/public/modules/react/react.development.js')} CommonModuleReact
 */
/**
 * Type CommonModuleReactDOM
 * @typedef {import('./common/public/modules/react/react-dom.development.js')} CommonModuleReactDOM
 */
/**
 * Type CommonModuleVue
 * @typedef {import('./common/public/modules/vue/vue.esm-browser.js')} CommonModuleVue
 */

 export {};