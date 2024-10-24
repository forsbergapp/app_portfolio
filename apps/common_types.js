/** 
 * Declaration of all common types used in apps
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
 * 
 * Common REST API types
 *  CommonRESTAPIMethod
 *  CommonRESTAPIAuthorizationType
 *  CommonAppRecord
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
 *  CommonModulePrayTimes
 *  CommonModuleRegional
 *  CommonModuleReact
 *  CommonModuleReactDOM
 *  CommonModuleVue
 * 
 * @module apps/common/types 
*/

/**
 * Type COMMON_WINDOW
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
 * Type COMMON_DOCUMENT
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
 *                                      style:{display:string}
 *                                  },
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
 * Type CommonIcons
 *  @typedef {{ app_maintenance:          string,
 *              app_alert:                string,
 *              infinite:                 string}} CommonIcons
 */

/**
 * Type CommonComponentLifecycle
 * @typedef  {{ onBeforeMounted?:function|null,
 *              onMounted?:function|null, 
 *              onUnmounted?:function|null}|null} CommonComponentLifecycle
*/

/**
 * Type CommonComponentResult
 * @typedef  {{ lifecycle:CommonComponentLifecycle,
 *              data:*,
 *              methods:*,
 *              template:string|null}} CommonComponentResult
 */

/**
 * Type CommonErrorMessageISO20022
 * @typedef {{error:{
 *               http:number, 
 *               code:number|null,
 *               text:string, 
 *               developer_text:string|null,
 *               more_info:string|null}}} CommonErrorMessageISO20022
 */

/**
 * Type CommonAppRecord
 * @typedef {{
 *              ID: number,
 *              NAME: string,
 *              SUBDOMAIN: string,
 *              PATH: string,
 *              LOGO:string,
 *              SHOWPARAM:number,
 *              MANIFEST: string,
 *              JS:string,
 *              CSS: string,
 *              CSS_REPORT: string,
 *              FAVICON_32x32:string,
 *              FAVICON_192x192:string,
 *              STATUS:'ONLINE'|'OFFLINE'}} CommonAppRecord
 */
/**
 * Type commonInitAppParameters
 * @typedef {{  APP:    {
 *                      APP_ID:                             number,
 *                      APP_TEXT_EDIT:                      {VALUE:string, COMMENT:string},
 *                      APP_COPYRIGHT:                      {VALUE:string, COMMENT:string},
 *                      APP_EMAIL:                          {VALUE:string, COMMENT:string},
 *                      APP_LINK_TITLE:                     {VALUE:string, COMMENT:string},
 *                      APP_LINK_URL:                       {VALUE:string, COMMENT:string}
 *                      },
 *              COMMON: {
 *                      APP_ID?:                             number,
 *                      COMMON_APP_CACHE_CONTROL:            {VALUE:string, COMMENT: string},
 *                      COMMON_APP_CACHE_CONTROL_FONT:       {VALUE:string, COMMENT: string},
 *                      COMMON_APP_FRAMEWORK:                {VALUE:string, COMMENT: string},
 *                      COMMON_APP_FRAMEWORK_MESSAGES:       {VALUE:string, COMMENT: string},
 *                      COMMON_APP_REST_API_VERSION:         {VALUE:string, COMMENT: string},
 *                      COMMON_APP_LIMIT_RECORDS:            {VALUE:string, COMMENT: string},
 *                      COMMON_INFO_LINK_POLICY_NAME:        {VALUE:string},
 *                      COMMON_INFO_LINK_POLICY_URL:         {VALUE:string},
 *                      COMMON_INFO_LINK_DISCLAIMER_NAME:    {VALUE:string},
 *                      COMMON_INFO_LINK_DISCLAIMER_URL:     {VALUE:string},
 *                      COMMON_INFO_LINK_TERMS_NAME:         {VALUE:string},
 *                      COMMON_INFO_LINK_TERMS_URL:          {VALUE:string},
 *                      COMMON_INFO_LINK_ABOUT_NAME:         {VALUE:string},
 *                      COMMON_INFO_LINK_ABOUT_URL:          {VALUE:string},
 *                      COMMON_IMAGE_FILE_ALLOWED_TYPE1:     {VALUE:string},
 *                      COMMON_IMAGE_FILE_ALLOWED_TYPE2:     {VALUE:string},
 *                      COMMON_IMAGE_FILE_ALLOWED_TYPE3:     {VALUE:string},
 *                      COMMON_IMAGE_FILE_ALLOWED_TYPE4:     {VALUE:string},
 *                      COMMON_IMAGE_FILE_ALLOWED_TYPE5:     {VALUE:string},
 *                      COMMON_IMAGE_FILE_MAX_SIZE:          {VALUE:string},
 *                      COMMON_IMAGE_FILE_MIME_TYPE:         {VALUE:string, COMMENT: string},
 *                      COMMON_IMAGE_AVATAR_HEIGHT:          {VALUE:string, COMMENT: string},
 *                      COMMON_IMAGE_AVATAR_WIDTH:           {VALUE:string, COMMENT: string}
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
* Type CommonAppParametersRecord
* @typedef {{  APP_ID:                             number,
*              APP_TEXT_EDIT:                      {VALUE:string, COMMENT:string},
*              APP_COPYRIGHT:                      {VALUE:string, COMMENT:string},
*              APP_EMAIL:                          {VALUE:string, COMMENT:string},
*              APP_LINK_TITLE:                     {VALUE:string, COMMENT:string},
*              APP_LINK_URL:                       {VALUE:string, COMMENT:string},
*              COMMON_APP_START:                   {VALUE:string, COMMENT: string},
*              COMMON_APP_LOG:                     {VALUE:string, COMMENT: string},
*              COMMON_APP_CACHE_CONTROL:           {VALUE:string, COMMENT: string},
*              COMMON_APP_CACHE_CONTROL_FONT:      {VALUE:string, COMMENT: string},
*              COMMON_APP_FRAMEWORK:               {VALUE:string, COMMENT: string},
*              COMMON_APP_FRAMEWORK_MESSAGES:      {VALUE:string, COMMENT: string},
*              COMMON_APP_REST_API_VERSION:        {VALUE:string, COMMENT: string},
*              COMMON_APP_LIMIT_RECORDS:           {VALUE:string, COMMENT: string},
*              COMMON_INFO_LINK_POLICY_NAME:       {VALUE:string},
*              COMMON_INFO_LINK_POLICY_URL:        {VALUE:string},
*              COMMON_INFO_LINK_DISCLAIMER_NAME:   {VALUE:string},
*              COMMON_INFO_LINK_DISCLAIMER_URL:    {VALUE:string},
*              COMMON_INFO_LINK_TERMS_NAME:        {VALUE:string},
*              COMMON_INFO_LINK_TERMS_URL:         {VALUE:string},
*              COMMON_INFO_LINK_ABOUT_NAME:        {VALUE:string},
*              COMMON_INFO_LINK_ABOUT_URL:         {VALUE:string},
*              COMMON_IMAGE_FILE_ALLOWED_TYPE1:    {VALUE:string},
*              COMMON_IMAGE_FILE_ALLOWED_TYPE2:    {VALUE:string},
*              COMMON_IMAGE_FILE_ALLOWED_TYPE3:    {VALUE:string},
*              COMMON_IMAGE_FILE_ALLOWED_TYPE4:    {VALUE:string},
*              COMMON_IMAGE_FILE_ALLOWED_TYPE5:    {VALUE:string},
*              COMMON_IMAGE_FILE_MAX_SIZE:         {VALUE:string},
*              COMMON_IMAGE_FILE_MIME_TYPE:        {VALUE:string, COMMENT: string},
*              COMMON_IMAGE_AVATAR_HEIGHT:         {VALUE:string, COMMENT: string},
*              COMMON_IMAGE_AVATAR_WIDTH:          {VALUE:string, COMMENT: string}}} CommonAppParametersRecord
*/
/**
* Type CommonAppSecretsRecord
* @typedef {{   APP_ID:                             number,
*               SERVICE_DB_DB1_APP_USER:            string,
*               SERVICE_DB_DB1_APP_PASSWORD:        string,
*               SERVICE_DB_DB2_APP_USER:            string,
*               SERVICE_DB_DB2_APP_PASSWORD:        string,
*               SERVICE_DB_DB3_APP_USER:            string,
*               SERVICE_DB_DB3_APP_PASSWORD:        string,
*               SERVICE_DB_DB4_APP_USER:            string,
*               SERVICE_DB_DB4_APP_PASSWORD:        string,
*               COMMON_CLIENT_ID:                   string,
*               COMMON_CLIENT_SECRET:               string,
*               COMMON_APP_ID_SECRET:               string,
*               COMMON_APP_ID_EXPIRE:               string,
*               COMMON_APP_ACCESS_SECRET:           string,
*               COMMON_APP_ACCESS_EXPIRE:           string}} CommonAppSecretsRecord
*/
/**
 * Type CommonAppModulesRecord
 * @typedef {{  APP_ID: number,
 *              COMMON_TYPE: 'FUNCTION'|'MODULE'|'REPORT',
 *              COMMON_NAME:string,
 *              COMMON_ROLE:'APP_DATA'|'APP_ACCESS'|'APP_EXTERNAL'|null,
 *              COMMON_PATH:string,
 *              COMMON_DESCRIPTION:string}}CommonAppModulesRecord
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
 * Type CommonProfileStatRecord
 * @typedef {{id:number, username:string, avatar:string|null, provider_image: string|null, count:number}}   CommonProfileStatRecord
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
 * Type CommonRESTAPIMethod
 * @typedef{'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} CommonRESTAPIMethod
 */
/**
 * Type CommonRESTAPIMethod
 * @typedef{'APP_DATA'|'APP_SIGNUP'|'APP_ACCESS'|'ADMIN'|'SOCKET'|'IAM_ADMIN'|'IAM_PROVIDER'|'IAM_USER'} CommonRESTAPIAuthorizationType
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
 * Type CommonModuleLeafletMethods
 * @typedef {{  leafletLibrary:*,
 *              leafletContainer: function}} CommonModuleLeafletMethods
 */

/**
 * Type CommonModuleLeafletMapLayer
 * @typedef {{  display_data: string, 
 *              value:string, 
 *              data2:string|null, 
 *              data3:string|number|null, 
 *              data4:string|null,
 *              session_map_layer:string|null}}  CommonModuleLeafletMapLayer
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