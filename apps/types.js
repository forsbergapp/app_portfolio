/**
 * @typedef {{  body:{className:string, requestFullscreen:function, classList:{add:function, remove:function}},
 *              createElement:function,
 *              addEventListener:function,
 *              removeEventListener:function,
 *              fullscreenElement:Element|null,
 *              exitFullscreen:function,
 *              querySelector:function,
 *              querySelectorAll:function,
 *              title:string}} AppDocument
 * 
 * @typedef {{  console:{ warn:function,
 *                      info:function,
 *                      error:function},
 *              atob:function,
 *              btoa:function,
 *              setTimeout:function,
 *              open:function,
 *              addEventListener:function,
 *              ReactDOM?:*,
 *              React?:*,
 *              __VUE_DEVTOOLS_HOOK_REPLAY__?:*,
 *              __VUE_HMR_RUNTIME__?:*,
 *              __VUE__?:*}} AppWindow
 * @typedef {object}    AppEvent
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
 *                                  style:{display:string}},
 *              selectedIndex:      number,
 *              setAttribute:       function,
 *              value:              string
 *            }}  target
 * 
 * @typedef {{  originalEvent:AppEvent,
 *              latlng:{lat:string, 
 *                      lng:string}}} AppEventLeaflet
 * 
 * @typedef {{data:string}} AppEventEventSource
 * 
 * @typedef {{  id:number|null,
 *              display_data: string|null, 
 *              value?:string|null, 
 *              data2:string|null, 
 *              data3:string|null, 
 *              data4:string|null,
 *              session_map_layer:string|null}}  type_map_layer
 *
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
 *           module_leaflet_map_styles:type_map_layer[],
 *           'module_easy.qrcode_width':number|null,
 *           'module_easy.qrcode_height':number|null,
 *           'module_easy.qrcode_color_dark':string|null,
 *           'module_easy.qrcode_color_light':string|null,
 *           service_socket_client_ID:number|null,
 *           service_socket_eventsource:{onmessage:function,
 *                                       onerror:function,
 *                                       close:function}|null}} type_COMMON_GLOBAL
 *
 *  @typedef {{ app_maintenance:          string,
 *              app_alert:                string,
 *              infinite:                 string}} type_ICONS
 *
 * @typedef {import('./common/public/js/common.js')} module_common
 * @typedef {{default:{adjust:function, getTimes:function, setMethod:function}}} module_prayTimes
 * @typedef {import('./common/public/modules/regional/regional.js')} module_regional
 * @typedef {{QRCode:*}} module_easy_qrcode
 * @typedef {import('./common/public/modules/leaflet/leaflet-src.esm.js')} module_leaflet
 * @typedef {import('./common/public/modules/react/react.development.js')} module_react
 * @typedef {import('./common/public/modules/react/react-dom.development.js')} module_reactDOM
 * @typedef {import('./common/public/modules/vue/vue.esm-browser.js')} module_vue
 */

 export {};