/** 
 * @description Declaration of all common types used in apps
 * 
 * BOM Browser Object Model (contains what is used)
 *  COMMON_WINDOW
 *  CommonAppEventEventSource
 * 
 * DOM Document Object Model types (contains what is used)
 *  COMMON_DOCUMENT
 *  CommonAppEvent
 * 
 * Common app types
 *  CommonGlobal
 *  CommonIcons
 *  CommonComponentLifecycle
 *  CommonComponentResult
 *  CommonErrorMessageISO20022
 *  CommonAppMenu
 *  CommonDocumentType
 * 
 * Common REST API types
 *  CommonRESTAPIMethod
 *  CommonRESTAPIAuthorizationType
 *  CommonAppRecord
 *  commonInitAppParameters
 *  CommonAppParametersRecord
 *  CommonAppSecretsRecord
 *  CommonAppModulesRecord
 *  CommonAppModuleMetadata
 *  CommonAppModuleWithMetadata
 *  CommonAppModuleQueueStatus
 *  CommonAppModuleQueue
 *  CommonCountryType
 *  CommonProfileUser
 *  CommonProfileStatRecord
 *  CommonProvider
 *  CommonProfileSearchRecord
 *  CommonMasterObjectType
 * 
 * Common module types
 *  CommonModuleLeafletEvent
 *  CommonModuleLeafletMapData
 *  CommonModuleLeafletMethods
 *  CommonModuleLeafletMapLayer
 * 
 * Common Microservice types
 *  CommonMicroserviceWorldcitiesRecordType
 * 
 * Common Module files types 
 *  CommonModuleCommon
 *  CommonModuleEasyQRCode
 *  CommonModuleLeaflet
 *  CommonModuleRegional
 *  CommonModuleReact
 *  CommonModuleReactDOM
 *  CommonModuleVue
 * 
 * @module apps/common/types 
*/

/**
 * @description Type COMMON_WINDOW
 * @typedef {{  console:{ warn:function,
 *                      info:function,
 *                      error:function},
 *              atob:function,
 *              btoa:function,
 *              setTimeout:function,
 *              clearTimeout:function,
 *              open:function,
 *              addEventListener:function,  //used to override default function with custom function to keep track of third party libraries
 *              EventSource:*,
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
 * @description Type CommonAppEventEventSource
 * @typedef {{data:string}} CommonAppEventEventSource
 */

/**
 * @description Type COMMON_DOCUMENT
 * @typedef {{  body:{className:string, requestFullscreen:function, classList:{add:function, remove:function}},
 *              createElement:function,
 *              addEventListener:function,
 *              removeEventListener:function,
 *              fullscreenElement:Element|null,
 *              exitFullscreen:function,
 *              querySelector:function,
 *              querySelectorAll:function,
 *              title:string}} COMMON_DOCUMENT
 */

/**
 * @description Type CommonAppEvent
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
 *              href:               string,
 *              focus:              function,
 *              classList:          {contains:function, remove:function, add:function},
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
 *                                      classList:{contains:function},
 *                                      nextElementSibling:{querySelector:function},
 *                                      innerHTML:string,
 *                                      getAttribute:function,
 *                                      parentNode:{style:{display:string}},
 *                                      style:{display:string},
 *                                      querySelector: function
 *                                  },
 *              setAttribute:       function,
 *              value:              string,
 *            }}  target
 */


/**
 * @description Type CommonGlobal
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
 *              app_eventListeners:{original:function, LEAFLET:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',*,*,*,*]|[], 
 *                                                     REACT:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',*,*,*,*]|[], 
 *                                                     VUE:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',*,*,*,*]|[], 
 *                                                     OTHER:['WINDOW'|'DOCUMENT'|'HTMLELEMENT',*,*,*,*]|[]},
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
 *              iam_user_id:number|null,
 *              iam_user_name:string|null,
 *              admin_first_time:number|null,
 *              admin_only:number|null,
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
 *              moduleLeaflet: {methods:{
 *                                          eventClickCountry:          function, 
 *                                          eventClickCity:             function,
 *                                          eventClickMapLayer:         function,
 *                                          eventClickControlZoomIn:    function,
 *                                          eventClickControlZoomOut:    function,
 *                                          eventClickControlSearch:    function,
 *                                          eventClickControlFullscreen:function,
 *                                          eventClickControlLocation:  function,
 *                                          eventClickControlLayer:     function,
 *                                          eventClickSearchList:       function,
 *                                          eventKeyUpSearch:           function,
 *                                          map_toolbar_reset:          function,
 *                                          map_line_removeall:         function,
 *                                          map_line_create:            function,
 *                                          map_update:                 function
 *                                      }
 *                              }
 *              service_socket_client_ID:number|null,
 *              service_socket_eventsource:{onmessage:function,
 *                                       onerror:function,
 *                                       close:function}|null}} CommonGlobal
 */

 /**
 * @description Type CommonIcons
 *  @typedef {{ app_maintenance:          string,
 *              app_alert:                string,
 *              infinite:                 string}} CommonIcons
 */

/**
 * @description Type CommonComponentLifecycle
 * @typedef  {{ onBeforeMounted?:function|null,
 *              onMounted?:function|null, 
 *              onUnmounted?:function|null}|null} CommonComponentLifecycle
*/

/**
 * @description Type CommonComponentResult
 * @typedef  {{ lifecycle:CommonComponentLifecycle,
 *              data:*,
 *              methods:*,
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
 * @typedef {'APP'|'GUIDE'|'JSDOC'|'MODULE_CODE'|'MODULE_APPS'|'MODULE_MICROSERVICE'|'MODULE_SERVER'} commonDocumentType
 */
/**
 * @description Type CommonRESTAPIMethod
 * @typedef{'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} CommonRESTAPIMethod
 */

/**
 * @description Type CommonRESTAPIMethod
 * @typedef{'APP_ID'|'APP_ID_SIGNUP'|'APP_ACCESS'|'ADMIN'|'SOCKET'|'IAM_ADMIN'|'IAM_PROVIDER'|'IAM_USER'} CommonRESTAPIAuthorizationType
 */


/**
 * @description Type CommonAppRecord
 * @typedef {{
 *              id: number,
 *              name: string,
 *              subdomain: string,
 *              path: string,
 *              logo:string,
 *              showparam:number,
 *              manifest: string,
 *              js:string,
 *              css: string,
 *              css_report: string,
 *              favicon_32x32:string,
 *              favicon_192x192:string,
 *              app_name_translation:string,
 *              protocol:string,
 *              host:string,
 *              port:string,
 *              status:'ONLINE'|'OFFLINE'}} CommonAppRecord
 */
/**
 * @description Type commonInitAppParameters
 * @typedef {{  APP:    {
 *                      app_id:                             number,
 *                      app_text_edit:                      {value:string, comment:string},
 *                      app_copyright:                      {value:string, comment:string},
 *                      app_email:                          {value:string, comment:string},
 *                      app_link_title:                     {value:string, comment:string},
 *                      app_link_url:                       {value:string, comment:string}
 *                      },
 *              COMMON: {
 *                      app_id?:                             number,
 *                      common_app_cache_control:            {value:string, comment: string},
 *                      common_app_cache_control_font:       {value:string, comment: string},
 *                      common_app_framework:                {value:string, comment: string},
 *                      common_app_framework_messages:       {value:string, comment: string},
 *                      common_app_rest_api_version:         {value:string, comment: string},
 *                      common_app_limit_records:            {value:string, comment: string},
 *                      common_info_link_policy_name:        {value:string},
 *                      common_info_link_policy_url:         {value:string},
 *                      common_info_link_disclaimer_name:    {value:string},
 *                      common_info_link_disclaimer_url:     {value:string},
 *                      common_info_link_terms_name:         {value:string},
 *                      common_info_link_terms_url:          {value:string},
 *                      common_info_link_about_name:         {value:string},
 *                      common_info_link_about_url:          {value:string},
 *                      common_image_file_allowed_type1:     {value:string},
 *                      common_image_file_allowed_type2:     {value:string},
 *                      common_image_file_allowed_type3:     {value:string},
 *                      common_image_file_allowed_type4:     {value:string},
 *                      common_image_file_allowed_type5:     {value:string},
 *                      common_image_file_max_size:          {value:string},
 *                      common_image_file_mime_type:         {value:string, comment: string},
 *                      common_image_avatar_height:          {value:string, comment: string},
 *                      common_image_avatar_width:           {value:string, comment: string}
 *                      },
 *              INFO:   {
 *                      app_id:                 number,
 *                      app_logo:               string,
 *                      app_idtoken:            string,
 *                      locale:                 string,
 *                      admin_only:             1|0,
 *                      client_latitude:        string,
 *                      client_longitude:       string,
 *                      client_place:           string,
 *                      client_timezone:        string,
 *                      common_app_id:          number,
 *                      rest_resource_bff:      string,
 *                      first_time:             1|0
 *                      }
 *          }} commonInitAppParameters
 */
/**
* @description Type CommonAppParametersRecord
* @typedef {{  app_id:                             number,
*              app_text_edit:                      {value:string, comment:string},
*              app_copyright:                      {value:string, comment:string},
*              app_email:                          {value:string, comment:string},
*              app_link_title:                     {value:string, comment:string},
*              app_link_url:                       {value:string, comment:string},
*              common_app_start:                   {value:string, comment: string},
*              common_app_log:                     {value:string, comment: string},
*              common_app_cache_control:           {value:string, comment: string},
*              common_app_cache_control_font:      {value:string, comment: string},
*              common_app_framework:               {value:string, comment: string},
*              common_app_framework_messages:      {value:string, comment: string},
*              common_app_rest_api_version:        {value:string, comment: string},
*              common_app_limit_records:           {value:string, comment: string},
*              common_info_link_policy_name:       {value:string},
*              common_info_link_policy_url:        {value:string},
*              common_info_link_disclaimer_name:   {value:string},
*              common_info_link_disclaimer_url:    {value:string},
*              common_info_link_terms_name:        {value:string},
*              common_info_link_terms_url:         {value:string},
*              common_info_link_about_name:        {value:string},
*              common_info_link_about_url:         {value:string},
*              common_image_file_allowed_type1:    {value:string},
*              common_image_file_allowed_type2:    {value:string},
*              common_image_file_allowed_type3:    {value:string},
*              common_image_file_allowed_type4:    {value:string},
*              common_image_file_allowed_type5:    {value:string},
*              common_image_file_max_size:         {value:string},
*              common_image_file_mime_type:        {value:string, comment: string},
*              common_image_avatar_height:         {value:string, comment: string},
*              common_image_avatar_width:          {value:string, comment: string}}} CommonAppParametersRecord
*/
/**
* @description Type CommonAppSecretsRecord
* @typedef {{   app_id:                             number,
*               service_db_db1_app_user:            string,
*               service_db_db1_app_password:        string,
*               service_db_db2_app_user:            string,
*               service_db_db2_app_password:        string,
*               service_db_db3_app_user:            string,
*               service_db_db3_app_password:        string,
*               service_db_db4_app_user:            string,
*               service_db_db4_app_password:        string,
*               common_client_id:                   string,
*               common_client_secret:               string,
*               common_app_id_secret:               string,
*               common_app_id_expire:               string,
*               common_app_access_secret:           string,
*               common_app_access_expire:           string}} CommonAppSecretsRecord
*/
/**
 * @description Type CommonAppModulesRecord
 * @typedef {{  id:number,
 *              app_id: number,
 *              common_type: 'FUNCTION'|'MODULE'|'REPORT',
 *              common_name:string,
 *              common_role:'APP_ID'|'APP_ACCESS'|'APP_EXTERNAL'|null,
 *              common_path:string,
 *              common_description:string}}CommonAppModulesRecord
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
 * @description Type CommonProfileStatRecord
 * @typedef {{id:number, username:string, avatar:string|null, provider_image: string|null, count:number}}   CommonProfileStatRecord
 */
/**
 * @description Type CommonProvider
 * @typedef {{id:number, provider_name:string}} CommonProvider
 */

/**
 * @description Type CommonProfileSearchRecord
 * @typedef {{id:number, avatar:string, provider_image:string, username:string}} CommonProfileSearchRecord
 */
 
/** 
 * @description Type 
 * @typedef {*} CommonMasterObjectType
 */

/**
 * @description Type CommonModuleLeafletEvent
 * @typedef {{  originalEvent:CommonAppEvent,
 *              latlng:{lat:string, 
 *                      lng:string}}} CommonModuleLeafletEvent
 */

/**
 * @description Type CommonModuleLeafletMapData
 * @typedef {{  _container:{id:string},
 *              doubleClickZoom:{disable:function},
 *              invalidateSize:function,
 *              removeLayer:function,
 *              setView:function,
 *              flyTo:function,
 *              setZoom:function,
 *              getZoom:function,
 *              on:function}} CommonModuleLeafletMapData
 *
 */
/**
 * @description Type CommonModuleLeafletMethods
 * @typedef {{  leafletLibrary:*,
 *              leafletContainer: function}} CommonModuleLeafletMethods
 */

/**
 * @description Type CommonModuleLeafletMapLayer
 * @typedef {{  display_data: string, 
 *              value:string, 
 *              data2:string|null, 
 *              data3:string|number|null, 
 *              data4:string|null,
 *              session_map_layer:string|null}}  CommonModuleLeafletMapLayer
 */

/**
 * @description Type CommonMicroserviceWorldcitiesRecordType
 * @typedef {{id:number, city:string, admin_name:string, country:string, lat:string, lng:string}} CommonMicroserviceWorldcitiesRecordType
 */
    
/**
 * @description Type CommonModuleCommon
 * @typedef {import('./common/public/js/common.js')} CommonModuleCommon
 */
/**
 * @description Type CommonModuleEasyQRCode
 * @typedef {{QRCode:*}} CommonModuleEasyQRCode
 */
/**
 * @description Type CommonModuleLeaflet
 * @typedef {import('./common/public/modules/leaflet/leaflet-src.esm.js')} CommonModuleLeaflet
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

 export {};