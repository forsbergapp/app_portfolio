/** 
 * @description Declaration of all types used in server
 * @module server/types 
 */

/**
 * @description APP server_apps_email_param_data
 * @typedef {object} server_apps_email_param_data
 * @property {string} emailtype         - [1-4], 1=SIGNUP, 2=UNVERIFIED, 3=PASSWORD RESET (FORGOT), 4=CHANGE EMAIL
 * @property {string|null} host              
 * @property {number} app_user_id       
 * @property {string|null} verificationCode  
 * @property {string} to                - to email
 */

/**
 * @description APP server_apps_email_return_createMail
 * @typedef {object} server_apps_email_return_createMail
 * @property {string} host
 * @property {string} port
 * @property {string} secure
 * @property {string} auth_user
 * @property {string} auth_pass
 * @property {string} from
 * @property {string} to
 * @property {string} subject
 * @property {string} html
 */

/**
 * @description APP server_apps_app_info
 * @typedef {object} server_apps_app_info   - app info
 * @property {number} app_id                - app id
 * @property {string} locale                - locale
 * @property {number} admin_only            - 0/1
 * @property {string} idtoken               - JW token
 * @property {string} latitude              - geodata latitude
 * @property {string} longitude             - geodata longitude
 * @property {string} place                 - geodata place
 * @property {string} timezone              - geodata timezone
 * @property {string|null} module           - HTML
 */


/**
 * @description APP server_apps_app_service_parameters
 * @typedef {object}        server_apps_app_service_parameters
 * @property {number}       app_id
 * @property {string}       app_logo
 * @property {string}       app_idtoken
 * @property {string}       locale
 * @property {number}       admin_only
 * @property {string|null}  client_latitude
 * @property {string|null}  client_longitude
 * @property {string|null}  client_place
 * @property {string|null}  client_timezone
 * @property {number|null}  common_app_id
 * @property {string}       rest_resource_bff
 * @property {number}       first_time
 */

/**
 * @description APP server_apps_report_query_parameters
 * @typedef {object} server_apps_report_query_parameters
 * @property {string} module
 * @property {number} uid_view
 * @property {string} url
 * @property {string} [ps]
 * @property {number} [hf]
 * @property {string} format
 */

/**
 * @description APP server_apps_report_create_parameters
 * @typedef {object}        server_apps_report_create_parameters
 * @property {number}       app_id
 * @property {Object}       [queue_parameters]
 * @property {string}       reportid
 * @property {string}       ip
 * @property {string}       user_agent
 * @property {string}       accept_language
 */
/**
 * @description APP server_apps_module_metadata
 * @typedef {{param:{name:string, text:string, default:string|number}}} server_apps_module_metadata
 */
/**
 * @description APP server_apps_module_with_metadata
 * @typedef {{  id:number,
 *              app_id: number,
 *              common_type: 'FUNCTION'|'MODULE'|'REPORT',
 *              common_name:string,
 *              common_path:string,
 *              common_metadata:server_apps_module_metadata[],
 *              common_description:string}} server_apps_module_with_metadata
 */
/**
 * @description APP server_config_apps_status
 * @typedef  {'ONLINE'|'OFFLINE'} server_config_apps_status
 */

/**
 * @description APP server_config_apps_with_db_columns
 * @typedef  {object} server_config_apps_with_db_columns
 * @property {number} app_id
 * @property {string} name
 * @property {string} app_name_translation
 * @property {string} subdomain
 * @property {string} logo
 * @property {string} protocol
 * @property {string|null} host
 * @property {number|null} port
 */

/**
 * @description APP serverComponentLifecycle
 * @typedef  {{ onBeforeMounted?:function|null,
 *              onMounted?:function|null, 
 *              onUnmounted?:function|null}|null} serverComponentLifecycle
 */

/**
 * @description APP commonDocumentType
 * @typedef {'MENU'|'APP'|'GUIDE'|'ROUTE'|'JSDOC'|'MODULE_CODE'|'MODULE_APPS'|'MODULE_MICROSERVICE'|'MODULE_SERVER'|'MODULE_TEST'} serverDocumentType
 */

/**
 * @description APP commonDocumentMenu
 * @typedef{{   id:number, 
 *              menu:string,
 *              type:serverDocumentType,
 *              menu_sub:{  id:number,
 *                          menu:string,
 *                          doc:string}[]|null}} serverDocumentMenu
 */

/**
 * @description APP commonWorldCitiesCity
 * Database content:
 *        {
 *           "city":         [city with diacritics],
 *           "city_ascii":   [city_ascii],
 *           "lat":          [latitude],
 *           "lng":          [longitude],					
 *           "country":      [country],			
 *           "iso2":         [countrycode 2 letters],
 *           "iso3":         [countrycode 3 letters],
 *           "admin_name":   [admin name],
 *           "capital":      [admin, minor, primary, ''],
 *           "population":   [count],
 *           "id":           [id]
 *		} 
 * @typedef {{  city:       string,
*              city_ascii: string,
*              lat:        string,
*              lng:        string,
*              country:    string,
*              iso2:       string,
*              iso3:       string,
*              admin_name: string,
*              capital:    string
*              population: number,
*              id:         number}} commonWorldCitiesCity
*/

/** 
 * @description BFF server_bff_endpoint_type
 * @typedef {'APP'|'APP_ID'|'APP_ID_SIGNUP'|'APP_ACCESS'|'APP_EXTERNAL'|'ADMIN'|'SOCKET'|'IAM_ADMIN'|'IAM_USER'|'IAM_PROVIDER'|
 *           'SERVER'} server_bff_endpoint_type
 */

/**
 * @description BFF server_bff_parameters
 * @typedef {{
 *          endpoint: server_bff_endpoint_type,
 *          host:string|null,
 *          url:string|null,
 *          route_path:string,
 *          method: string,
 *          query: string,
 *          body:server_server_req['body']|{},
 *          idToken:  server_server_req['headers']['id-token'], 
 *          authorization:string|null,
 *          ip: string,
 *          user_agent:string,
 *          accept_language:string,
 *          res: server_server_res}} server_bff_parameters
 *
 */

/**
 * @description DB FILE server_db_file_config_server_group
 * @typedef {'SERVER'|'SERVICE_IAM'|'SERVICE_SOCKET'|'SERVICE_DB'|'SERVICE_LOG'|'METADATA'} server_db_file_config_server_group
 */

/**
 * @description DB FILE server_db_file_config_server_server
 * @typedef {{   HTTPS_KEY:string,
 *               HTTPS_CERT:string,
 *               PORT:string,
 *               HTTPS_ENABLE:string,
 *               HTTPS_PORT:string,
 *               HTTPS_SSL_VERIFICATION:string,
 *               HTTPS_SSL_VERIFICATION_PATH:string,
 *               JSON_LIMIT:string,
 *               TEST_subdomain:string,
 *               APP_LOG:string,
 *               APP_START:string,
 *               APP_COMMON_APP_ID:string,
 *               REST_RESOURCE_BFF:string}} server_db_file_config_server_server
 */

/**
 * @description DB FILE server_db_file_config_server_service_iam
 * @typedef {{ AUTHENTICATE_REQUEST_ENABLE:string,
 *             AUTHENTICATE_REQUEST_OBSERVE_LIMIT:string,
 *             AUTHENTICATE_REQUEST_IP:string,
 *             ADMIN_TOKEN_EXPIRE_ACCESS:string,
 *             ADMIN_TOKEN_SECRET:string,
 *             ADMIN_PASSWORD_ENCRYPTION_KEY:string,
 *             ADMIN_PASSWORD_INIT_VECTOR:string,
 *             ENABLE_CONTENT_SECURITY_POLICY:string,
 *             ENABLE_GEOLOCATION:string,
 *             ENABLE_USER_REGISTRATION:string,
 *             ENABLE_USER_LOGIN:string}} server_db_file_config_server_service_iam
 */

/**
 * @description DB FILE server_db_file_config_server_service_socket
 * @typedef {{CHECK_INTERVAL:string}} server_db_file_config_server_service_socket
 */

/**
 * @description DB FILE server_db_file_config_server_service_db
 * @typedef {{   START:string,
 *               USE:string,
 *               DB1_DBA_USER:string,
 *               DB1_DBA_PASS:string,
 *               DB1_PORT:string,
 *               DB1_HOST:string,
 *               DB1_NAME:string,
 *               DB1_CHARACTERSET:string,
 *               DB1_CONNECTION_LIMIT:string,
 *               DB2_DBA_USER:string,
 *               DB2_DBA_PASS:string,
 *               DB2_PORT:string,
 *               DB2_HOST:string,
 *               DB2_NAME:string,
 *               DB2_CHARACTERSET:string,
 *               DB2_CONNECTION_LIMIT:string,
 *               DB3_DBA_USER:string,
 *               DB3_DBA_PASS:string,
 *               DB3_PORT:string,
 *               DB3_HOST:string,
 *               DB3_NAME:string,
 *               DB3_TIMEOUT_CONNECTION:string,
 *               DB3_TIMEOUT_IDLE:string,
 *               DB3_MAX:string,
 *               DB4_DBA_USER:string,
 *               DB4_DBA_PASS:string,
 *               DB4_HOST:string,
 *               DB4_NAME:string,
 *               DB4_CONNECT_STRING:string,
 *               DB4_POOL_MIN:string,
 *               DB4_POOL_MAX:string,
 *               DB4_POOL_INCREMENT:string}} server_db_file_config_server_service_db
 */

/**
 * @description DB FILE server_db_file_config_server_service_log
 * @typedef {{  SCOPE_REQUEST:string,
 *              SCOPE_SERVER:string,
 *              SCOPE_APP:string,
 *              SCOPE_SERVICE:string,
 *              SCOPE_DB:string,
 *              ENABLE_REQUEST_INFO:string,
 *              ENABLE_REQUEST_VERBOSE:string,
 *              ENABLE_DB:string,
 *              ENABLE_SERVICE:string,
 *              LEVEL_VERBOSE:string,
 *              LEVEL_ERROR:string,
 *              LEVEL_INFO:string,
 *              FILE_INTERVAL:string}} server_db_file_config_server_service_log
 */

/**
 * @description DB FILE server_db_file_config_server_metadata
 * @typedef  {{ MAINTENANCE:number,
 *              CONFIGURATION:string,
 *              COMMENT:string,
 *              CREATED:string,
 *              MODIFIED:string}} server_db_file_config_server_metadata
 */

/**
 * @description DB FILE server_db_file_config_server
 * @typedef  {{ ['SERVER']:[server_db_file_config_server_server], 
 *              ['SERVICE_IAM']:[server_db_file_config_server_service_iam],
 *              ['SERVICE_SOCKET']:[server_db_file_config_server_service_socket],
 *              ['SERVICE_DB']:[server_db_file_config_server_service_db],
 *              ['SERVICE_LOG']:[server_db_file_config_server_service_log],
 *              ['METADATA']:server_db_file_config_server_metadata}} server_db_file_config_server
 */
/**
 * @description DB FILE server_db_file_config_rest_api_methods
 * @typedef {'get'|'post'|'delete'|'patch'|'put'} server_db_file_config_rest_api_methods
 */
/**
 * @description DB FILE server_db_file_config_rest_api_content
 * @typedef {'application/json'} server_db_file_config_rest_api_content
 */

/**
 * @description DB FILE server_db_file_config_rest_api following Open API syntax
 * @typedef  {{ info: {
 *                      title: string,
 *                      version: string,
 *                      description: string
 *                  },
 *              servers: {url: string}[],
 *              paths: {[key:string]: 
 *                          {server_db_file_config_rest_api_methods:
 *                              {
 *                                  summary: string,
 *                                  operationId: string,
 *                                  parameters: [
 *                                      {[key:string]:boolean|string|{}}
 *                                  ],
 *                                  requestBody: {
 *                                      "description":"",
 *                                      "required":true,
 *                                      "content":{
 *                                          [key:string]: {
 *                                              [key:string]: string|boolean
 *                                          }
 *                                      }
 *                                  },
 *                                  responses: {
 *                                      [key:string]: {
 *                                          [key:string]: string
 *                                      }
 *                                  }
 *                              }
 *                          }
 *                  },
 *              components:{
 *                  "securitySchemes":{
 *                      [key:string]: {}
 *                  },
 *                  "parameters":{
 *                      [key:string]: {}
 *                  },
 *                  "responses":{
 *                      [key:string]: {
 *                          description: string,
 *                          content: {
 *                              server_db_file_config_rest_api_content: {
 *                                  schema: {
 *                                      "$ref": string
 *                                  }
 *                              }
 *                          }
 *                      }
 *                  },
 *              }
 *          }} server_db_file_config_rest_api
 */

/**
 * @description DB FILE server_db_file_config_files
 * @typedef {   server_db_file_config_server|
 *              server_db_file_config_rest_api|
 *              server_db_file_config_iam_policy|
 *              import('../microservice/types.js').microservice_config|
 *              import('../microservice/types.js').microservice_config_service|
 *              server_db_file_iam_user[]|
 *              server_db_file_app[]|
 *              server_db_file_app_module[]|
 *              server_db_file_app_parameter[]|
 *              server_db_file_app_secret[]|
 *              server_db_file_app_translation[]} server_db_file_config_files
 */


/**
 * @description DB FILE server_db_file_config_iam_policy
 * @typedef {{'content-security-policy':string}} server_db_file_config_iam_policy
 */

/**
 * @description DB FILE server_db_file_iam_control_user_agent
 * @typedef {{  id:number,
 *              name:string, 
 *              user_agent:string}} server_db_file_iam_control_user_agent
 */
/**
 * @description DB FILE server_db_file_iam_control_ip
 * * @typedef {{id:number, 
 *              app_id:number|null,
 *              from:string, 
 *              to:string, 
 *              hour_from:number, 
 *              hour_to:number, 
 *              date_from:string, 
 *              date_to:string, 
 *              action:string}} server_db_file_iam_control_ip
 */
/**
 * @description DB FILE server_db_file_iam_control_observe_type
 * @typedef {'SUBDOMAIN'|'ROUTE'|'HOST'|'HOST_IP'|'USER_AGENT'|'URI_DECODE'|'METHOD'|'BLOCK_IP'} server_db_file_iam_control_observe_type
 */
/**
 * @description DB FILE server_db_file_iam_control_observe
 * * @typedef {{id?:number,
 *              app_id:number|null, 
 *              ip:string, 
 *              user_agent:string 
 *              host:string, 
 *              accept_language:string, 
 *              method:string,
 *              url:string,
 *              status:1|0,
 *              type:server_db_file_iam_control_observe_type}} server_db_file_iam_control_observe
 */

/**
 * @description DB FILE server_db_file_iam_user
 * @typedef {{
 *          id:number, 
 *          username:string, 
 *          password:string, 
 *          type: 'ADMIN'|'USER', 
 *          bio:string|null, 
 *          private:number|null, 
 *          email:string|null, 
 *          email_unverified:string|null, 
 *          avatar:string|null,
 *          user_level:number|null, 
 *          verification_code?: number|null, 
 *          status:number|null, 
 *          created:string, 
 *          modified:string}} server_db_file_iam_user
 */
/**
 * @description DB FILE server_db_file_iam_user_new
 * @typedef {{
*          id?:number, 
*          username:string, 
*          password:string, 
*          type: 'ADMIN'|'USER', 
*          bio:string|null, 
*          private:number|null, 
*          email:string|null, 
*          email_unverified:string|null, 
*          avatar:string|null,
*          user_level?:number|null, 
*          verification_code?: number|null, 
*          status?:number|null, 
*          created?:string, 
*          modified?:string}} server_db_file_iam_user_new
*/
/**
 * @description DB FILE server_db_file_iam_user_get
 * @typedef {{
*          id:number, 
*          username:string, 
*          password:string, 
*          type: 'ADMIN'|'USER', 
*          bio:string|null, 
*          private:number|null, 
*          email:string|null, 
*          email_unverified:string|null, 
*          avatar:string|null,
*          user_level:number|null, 
*          status:number|null, 
*          created:string, 
*          modified:string}} server_db_file_iam_user_get
*/
/**
 * @description DB FILE server_db_file_iam_user_update
 * @typedef {{
 *          username:string, 
 *          password:string,
 *          password_new:string|null,
 *          bio:string|null, 
 *          private:number|null, 
 *          email:string|null, 
 *          email_unverified:string|null, 
 *          avatar:string|null}} server_db_file_iam_user_update
 */
/**
 * @description DB FILE server_db_file_db_name
 * 
 * @typedef {   server_db_file_db_name_config| 
 *              'DB_FILE'| 
 *              'APP'|
 *              'APP_MODULE'|
 *              'APP_MODULE_QUEUE'|
 *              'APP_PARAMETER'|
 *              'APP_SECRET'|
 *              'APP_TRANSLATION'|
 *              'IAM_APP_TOKEN'|
 *              'IAM_CONTROL_IP'|
 *              'IAM_CONTROL_USER_AGENT'|
 *              'IAM_CONTROL_OBSERVE'|
 *              'IAM_USER'|
 *              'IAM_USER_LOGIN'|
 *              server_db_file_db_name_log|
 *              server_db_file_db_name_message_queue} server_db_file_db_name
 */

/**
 * @description DB FILE server_db_file_db_name_config
 * 
 * @typedef {   'CONFIG_SERVER'|
 *              'CONFIG_REST_API'|
 *              'CONFIG_IAM_POLICY'|
 *              'CONFIG_MICROSERVICE'|
 *              'CONFIG_MICROSERVICE_SERVICES'} server_db_file_db_name_config
 */
/**
 * @description DB FILE server_db_file_db_name_log
 * 
 * @typedef {  'LOG_APP_INFO'|
 *             'LOG_APP_ERROR'|
 *             'LOG_DB_INFO'|
 *             'LOG_DB_ERROR'|
 *             'LOG_REQUEST_INFO'|
 *             'LOG_REQUEST_VERBOSE'|
 *             'LOG_REQUEST_ERROR'|
 *             'LOG_SERVER_INFO'|
 *             'LOG_SERVER_ERROR'|
 *             'LOG_SERVICE_INFO'|
 *             'LOG_SERVICE_ERROR'} server_db_file_db_name_log
 */

/**
 * @description DB FILE server_db_file_db_name_message_queue
 * 
 * @typedef {  'MESSAGE_QUEUE_PUBLISH'|
 *             'MESSAGE_QUEUE_CONSUME'|
 *             'MESSAGE_QUEUE_ERROR'} server_db_file_db_name_message_queue
 */

/** 
 * @description DB FILE server_db_file_db_record
 * @typedef {{  NAME:server_db_file_db_name, 
 *              TYPE:'JSON'|'JSON_TABLE'|'JSON_LOG'|'JSON_LOG_DATE'|'BINARY',
 *              LOCK:number, 
 *              TRANSACTION_ID:number|null, 
 *              TRANSACTION_CONTENT: object|string|[]|null, 
 *              PATH:string, 
 *              FILENAME:string,
 *              CACHE_CONTENT?:* }} server_db_file_db_record
 */

/** 
 * @description DB FILE server_db_file_result_fileFsRead
 * @typedef {{  file_content:   *, 
 *              lock:           boolean, 
 *              transaction_id: number|null}} server_db_file_result_fileFsRead
 */
/**
 * @description DB FILE server_db_file_app
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
 *              status:'ONLINE'|'OFFLINE'}} server_db_file_app
 */
/**
 * @description DB FILE server_db_file_app_module
 * @typedef {{  id:number,
 *              app_id: number,
 *              common_type: 'FUNCTION'|'MODULE'|'REPORT',
 *              common_name:string,
 *              common_role:'APP_ID'|'APP_ACCESS'|'APP_EXTERNAL'|'ADMIN'|'',
 *              common_path:string,
 *              common_description:string}} server_db_file_app_module
 */
 
/**
 * @description DB FILE server_db_file_app_module_queue_status
 * @typedef{'PENDING'|'RUNNING'|'COMPLETED'|'SUCCESS'|'FAIL'} server_db_file_app_module_queue_status
 */
/**
 * @description DB FILE server_db_file_app_module_queue
 * @typedef {{  id:number,
 *              app_id: number,         //copied from app
 *              iam_user_id:number,
 *              app_module_id:number,
 *              type:'REPORT',          //copied from app_module
 *              name: string,           //copied from app_module
 *              parameters:string,
 *              user:string,            //copied from iam_user
 *              start:string|null,
 *              end:string|null,
 *              progress:number|null,
 *              status:server_db_file_app_module_queue_status,
 *              message:string|null}} server_db_file_app_module_queue
 */

/**
 * @description DB FILE server_db_file_app_parameter
 * apps should use their own types if adding new parameters
 * @typedef {{  app_id:                             number,
 *              app_text_edit:                      {value:string, comment:string},
 *              app_copyright:                      {value:string, comment:string},
 *              app_email:                          {value:string, comment:string},
 *              app_link_title:                     {value:string, comment:string},
 *              app_link_url:                       {value:string, comment:string},
 *              common_app_start:                   {value:string, comment:string},
 *              common_app_id:                      {value:string, comment:string},
 *              common_app_cache_control:           {value:string, comment:string},
 *              common_app_cache_control_font:      {value:string, comment:string},
 *              common_app_framework:               {value:string, comment:string},
 *              common_app_framework_messages:      {value:string, comment:string},
 *              common_app_rest_api_version:        {value:string, comment:string},
 *              common_app_limit_records:           {value:string, comment:string},
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
 *              common_image_file_mime_type:        {value:string, comment:string},
 *              common_image_avatar_height:         {value:string, comment:string},
 *              common_image_avatar_width:          {value:string, comment:string}}} server_db_file_app_parameter
 */
/**
 * @description DB FILE server_db_file_app_translation
 * @typedef {{  id: number,
 *              app_id: number,
 *			    locale: string,
 *			    text: string,			            //simple text
 *			    json_data: string                   //complex text
 *}} server_db_file_app_translation		
*/

/**
 * @description DB FILE server_db_file_app_parameter
 * apps should use their own types if adding new parameters
 * @typedef {{ app_id?:                             number,
 *             app_text_edit?:                      {value:string, comment:string},
 *             app_copyright?:                      {value:string, comment:string},
 *             app_email?:                          {value:string, comment:string},
 *             app_link_title?:                     {value:string, comment:string},
 *             app_link_url?:                       {value:string, comment:string},
 *             common_app_start?:                   {value:string, comment:string},
 *             common_app_log?:                     {value:string, comment:string},
 *             common_app_cache_control:            {value:string, comment:string},
 *             common_app_cache_control_font:       {value:string, comment:string},
 *             common_app_framework:                {value:string, comment:string},
 *             common_app_framework_messages:       {value:string, comment:string},
 *             common_app_rest_api_version:         {value:string, comment:string},
 *             common_app_limit_records:            {value:string, comment:string},
 *             common_info_link_policy_name:        {value:string},
 *             common_info_link_policy_url:         {value:string},
 *             common_info_link_disclaimer_name:    {value:string},
 *             common_info_link_disclaimer_url:     {value:string},
 *             common_info_link_terms_name:         {value:string},
 *             common_info_link_terms_url:          {value:string},
 *             common_info_link_about_name:         {value:string},
 *             common_info_link_about_url:          {value:string},
 *             common_image_file_allowed_type1:     {value:string},
 *             common_image_file_allowed_type2:     {value:string},
 *             common_image_file_allowed_type3:     {value:string},
 *             common_image_file_allowed_type4:     {value:string},
 *             common_image_file_allowed_type5:     {value:string},
 *             common_image_file_max_size:          {value:string},
 *             common_image_file_mime_type:         {value:string, comment:string},
 *             common_image_avatar_height:          {value:string, comment:string},
 *             common_image_avatar_width:           {value:string, comment:string}}} server_db_file_app_parameter_common
 */

/**
 * @description DB FILE server_db_file_app_secret
 * apps should use their own types if adding new secrets
 * SERVICE_DB* not used by admin app
 * SERVICE_MAIL* only used by admin app
 * @typedef {{  app_id:number,
 *              service_db_db1_app_user: string,
 *              service_db_db1_app_password: string,
 *              service_db_db2_app_user: string,
 *              service_db_db2_app_password: string,
 *              service_db_db3_app_user: string,
 *              service_db_db3_app_password: string,
 *              service_db_db4_app_user: string,
 *              service_db_db4_app_password: string,
 *              service_mail_host: string,
 *              service_mail_port: string,
 *              service_mail_secure: string,
 *              service_mail_username: string,
 *              service_mail_password: string,
 *              service_mail_type_signup: string,
 *              service_mail_type_signup_from_name: string,
 *              service_mail_type_unverified: string,
 *              service_mail_type_unverified_from_name: string,
 *              service_mail_type_password_reset: string,
 *              service_mail_type_password_reset_from_name: string,
 *              service_mail_type_change_email: string,
 *              service_mail_type_change_email_from_name: string,
 *              common_client_id: string, 
 *              common_client_secret:string, 
 *              common_app_id_secret:string, 
 *              common_app_id_expire:string, 
 *              common_app_access_secret:string, 
 *              common_app_access_expire:string}} server_db_file_app_secret
 */
/** 
 * @description DB FILE server_db_file_iam_app_token
 * @typedef {{	app_id: 	number,
 *		        res:		0|1,
 *   	        token:   	string,
 *		        ip:         string,
 *		        ua:         string|null,
 *		        created:    string}} server_db_file_iam_app_token
 */
/** 
 * @description DB FILE server_db_file_iam_app_token_insert
 * @typedef {{	app_id: 	number,
 *		        res:		0|1,
 *   	        token:   	string,
 *		        ip:         string,
 *		        ua:         string|null,}} server_db_file_iam_app_token_insert
 */

/**
 * @description DB FILE server_db_file_iam_user_login
 * @typedef {{	id:             number,
 *              iam_user_id:    number,
 *              app_id:         number,
 *              user:           string,
 *              db:             number|null,
 *              res:	        0|1|2,          //0=fail, 1=success, 2=invalidated
 *   	        token:          string|null,
 *		        ip:             string,
 *		        ua:             string|null,
 *		        created:        string,
 *              modified?:      string}} server_db_file_iam_user_login
 */

 /**
  * @description DB FILE server_db_file_iam_user_login_insert
  * @typedef {{	iam_user_id:    number,
  *             app_id:         number,
  *             user:           string,
  *             db:             number|null,
  *             res:	        0|1|2,          //0=fail, 1=success, 2=invalidated
  *   	        token:          string|null,
  *		        ip:             string,
  *		        ua:             string|null}} server_db_file_iam_user_login_insert
  */

 /** 
 * @description DB FILE server_log_data_parameter_logGet
 * @typedef{object}             server_log_data_parameter_logGet
 * @property {number}           app_id
 * @property {number|null}      select_app_id
 * @property {server_log_scope} logscope
 * @property {server_log_level} loglevel
 * @property {string}           search
 * @property {string|null}      sort
 * @property {string}           order_by
 * @property {string}           year
 * @property {string}           month
 * @property {string}           day
 * @property {number}           limit
 * @property {number}           offset
 */

/**
 * @description DB FILE server_log_request_record_keys
 * @typedef {   'logdate'|
*              'host'|
*              'ip'|
*              'requestid'|
*              'correlationid'|
*              'url'|
*              'http_info'|
*              'method'|
*              'statusCode'|
*              'statusMessage'|
*              'user-agent'|
*              'accept-language'|
*              'referer'|
*              'size_received'|
*              'size_sent'|
*              'responsetime'|
*              'logtext'} server_log_request_record_keys
*/

/**
* @description DB FILE server_db_file_log_request
* @typedef {{  logdate:string,
*              host:string,
*              ip:string,
*              requestid:string,
*              correlationid:string,
*              url:string,
*              http_info:string,
*              method:string,
*              statusCode:number,
*              statusMessage:string,
*              'user-agent':string,
*              'accept-language':string,
*              referer:string,
*              size_received:number,
*              size_sent:number,
*              responsetime:number,
*              logtext:string}} server_db_file_log_request
*/

/**
* @description DB FILE server_db_file_log_server
* @typedef {{  logdate:string,
*              logtext:string}} server_db_file_log_server
*/

/**
* @description DB FILE server_db_file_log_db
* @typedef {{   logdate:string,
*               app_id:number|null,
*               db:number|null,
*               sql:string,
*               parameters:string,
*               logtext:string}} server_db_file_log_db
*/
    
/**
 * @description DB FILE server_db_file_log_service
 * @typedef {{   logdate:string,
 *               app_id:number|null,
 *               service:string,
 *               parameters:string,
 *               logtext:string}} server_db_file_log_service
 */

/**
 * @description DB FILE server_db_file_log_app
 * @typedef {{   logdate:string,
 *               app_id:number|null,
 *               app_filename:string,
 *               app_function_name:string,
 *               app_app_line:number,
 *               logtext:string}} server_db_file_log_app
 */

/**
 * @description DB FILE server_log_scope
 * @typedef {'APP'|'DB'|'REQUEST'|'SERVER'|'SERVICE'} server_log_scope
 */

/**
 * @description DB FILE server_db_file_message_queue_publish
 * @typedef {{  message_id:number,
 *              created:string,
 *              service:string,
 *              message:object|null}} server_db_file_message_queue_publish
 */
/**
 * @description DB FILE server_db_file_message_queue_consume
 * @typedef {{  message_id:number|null,
 *              service:string|null,
 *              message:*,
 *              start:string|null,
 *              finished:string|null,
 *              result:*}} server_db_file_message_queue_consume
 */
/**
 * @description DB FILE server_db_file_message_queue_error
 * @typedef {{  message_id:number,
 *              message:*,
 *              result:*}} server_db_file_message_queue_error
 */

/**
 * @description DB FILE server_log_level
 * @typedef {'INFO'|'ERROR'} server_log_level
*/

/** 
* @description DB FILE server_log_data_parameter_getLogStats
* @typedef {object}                server_log_data_parameter_getLogStats
* @property {number|null}          app_id
* @property {server_log_request_record_keys} statGroup
* @property {number|null}          unique
* @property {string|number|null}   statValue
* @property {number}               year
* @property {number}               month
*/

/** 
* @description DB FILE server_log_result_logStatGet
* @typedef {object}                server_log_result_logStatGet
* @property {number|null}          chart
* @property {string|number|null}   statValue
* @property {number}               year
* @property {number}               month
* @property {number|null}          day
* @property {number|null}          amount
*/

/** 
* @description DB FILE server_log_result_logFilesGet
* @typedef {{id:number, filename:string}} server_log_result_logFilesGet
*/


/**
 * @description DB POOL server_db_db_pool
 * @typedef {[1|2|3|4|5, object|null, [object|server_db_db_pool_4|null]|null]} server_db_db_pool
 */

/** 
 * @description DB POOL server_db_db_pool_parameters
 * @typedef {object}        server_db_db_pool_parameters
 * @property {number|null}  use
 * @property {number|null}  pool_id
 * @property {number|null}  port
 * @property {string|null}  host
 * @property {number|null}  dba
 * @property {string|null}  user
 * @property {string|null}  password
 * @property {string|null}  database
 * @property {string|null}  charset                 - DB 1+2 MariaDB/MySQL
 * @property {number|null}  connectionLimit         - DB 1+2 MariaDB/MySQL
 * @property {number|null}  connectionTimeoutMillis - DB 3 PostgreSQL
 * @property {number|null}  idleTimeoutMillis       - DB 3 PostgreSQL
 * @property {number|null}  max                     - DB 3 PostgreSQL
 * @property {string|null}  connectString           - DB 4 Oracle
 * @property {number|null}  poolMin                 - DB 4 Oracle
 * @property {number|null}  poolMax                 - DB 4 Oracle
 * @property {number|null}  poolIncrement           - DB 4 Oracle
 */

/**
 * @description DB POOL server_db_db_pool_connection_1_2
 * @typedef {object}    server_db_db_pool_connection_1_2
 * @property {function} release
 * @property {function} query
 * @property {object}   config
 * @property {function} config.queryFormat
 * @property {function} escape
 */

/**
 * @description DB POOL server_db_db_pool_connection_1_2_result
 * @typedef {*}         server_db_db_pool_connection_1_2_result
 */

/**
 * @description DB POOL server_db_db_pool_connection_3
 * @typedef {object}    server_db_db_pool_connection_3
 * @property {function} release
 * @property {function} query
 */

/**
 * @description DB POOL server_db_db_pool_connection_3_result
 * @typedef {object}    server_db_db_pool_connection_3_result
 * @property {string}   command
 * @property {number}   insertId
 * @property {number}   affectedRows
 * @property {number}   rowCount
 * @property {[{dataTypeID:number, name:string}]}      fields
 * @property {[*]}      rows
 */

/** 
 * @description DB POOL server_db_db_pool_connection_3_fields
 * @typedef {[{ type:number, 
 *              name:string}]}    server_db_db_pool_connection_3_fields
 */

/** 
 * @description DB POOL server_db_db_pool_connection_4_result
 * @typedef {object}    server_db_db_pool_connection_4_result
 * @property {object}   outBinds
 * @property {[number]} outBinds.insertId
 * @property {string}   lastRowid
 * @property {number}   insertId
 * @property {number}   affectedRows
 * @property {number}   rowsAffected
 * @property {[*]}      rows
 */

/** 
 * @description DB POOL server_db_db_pool_4
 * @typedef {object|null}   server_db_db_pool_4
 * @property {string}       pool_id_app
 */

/**
 * @description DB SQL server_db_database_install_result
 * @typedef {object[]}  server_db_database_install_result - Log variable with object with any key
 * 
 */

/**
 * @description DB SQL server_db_database_install_db_check
 * @typedef {[{installed:1|0}]}  server_db_database_install_db_check
 */

/**
 * @description DB SQL server_db_database_install_uninstall_result
 * @typedef {object}  server_db_database_install_uninstall_result
 * @property {[{count:number}, {count_fail:number}]}    info
 */

/** 
 * @description DB SQL server_db_database_demo_user
 * @typedef {object}    server_db_database_demo_user
 * @property {number}   id
 * @property {string}   username
 * @property {string}   bio
 * @property {string}   avatar
 * @property {{
 *              app_id:                             number,
 *              description:                        string,
 *              regional_language_locale:           string,
 *              regional_timezone:                  string,
 *              regional_number_system:             string,
 *              regional_layout_direction:          string,
 *              regional_second_language_locale:    string,
 *              regional_arabic_script:             string,
 *              regional_calendar_type:             string,
 *              regional_calendar_hijri_type:       string,
 *              gps_map_type:                       string,
 *              gps_popular_place_id:               number|null,
 *              gps_lat_text:                       string,
 *              gps_long_text:                      string,
 *              design_theme_day_id:                number,
 *              design_theme_month_id:              number,
 *              design_theme_year_id:               number,
 *              design_paper_size:                  string,
 *              design_row_highlight:               string,
 *              design_column_weekday_checked:      string,
 *              design_column_calendartype_checked: string,
 *              design_column_notes_checked:        string,
 *              design_column_gps_checked:          string,
 *              design_column_timezone_checked:     string,
 *              image_header_image_img:             string,
 *              image_footer_image_img:             string,
 *              text_header_1_text:                 string,
 *              text_header_2_text:                 string,
 *              text_header_3_text:                 string,
 *              text_header_align:                  string,
 *              text_footer_1_text:                 string,
 *              text_footer_2_text:                 string,
 *              text_footer_3_text:                 string,
 *              text_footer_align:                  string,
 *              prayer_method:                      string,
 *              prayer_asr_method:                  string,
 *              prayer_high_latitude_adjustment:    string,
 *              prayer_time_format:                 string,
 *              prayer_hijri_date_adjustment:       string,
 *              prayer_fajr_iqamat:                 string,
 *              prayer_dhuhr_iqamat:                string,
 *              prayer_asr_iqamat:                  string,
 *              prayer_maghrib_iqamat:              string,
 *              prayer_isha_iqamat:                 string,
 *              prayer_column_imsak_checked:        string,
 *              prayer_column_sunset_checked:       string,
 *              prayer_column_midnight_checked:     string,
 *              prayer_column_fast_start_end:       string
 *              }[]}   settings
 * @property {{ user_account_app_user_account_id:               string,
 *              user_account_app_app_id:                        number, 
 *              app_data_entity_resource_app_data_entity_app_id:number, 
 *              app_data_entity_resource_app_data_entity_id:    number, 
 *              app_data_entity_resource_id:                    number, 
 *              json_data:string,
 *              resource_detail:[{  app_data_resource_master_id:number,
 *                                  app_data_entity_resource_id: number,
 *                                  user_account_id:number|null,
 *                                  user_account_app_id:number|null,
 *                                  data_app_id:number,
 *                                  app_data_entity_resource_app_data_entity_id:number,
 *                                  app_data_resource_master_attribute_id:number|null,
 *                                  json_data:string,
 *                                  resource_detail_data:[{ app_data_resource_detail_id: number,
 *                                                          user_account_id:number|null,
 *                                                          user_account_app_id:number|null,
 *                                                          data_app_id:number,
 *                                                          app_data_resource_master_attribute_id:number,
 *                                                          json_data: string}
 *                                                       ]}
 *                              ]}[]} resource_master
 */

/** 
 * @description DB SQL server_db_database_script_files
 * @typedef {   [number|null,
 *              string, 
 *              number|null][]} server_db_database_script_files
 */

/** 
 * @description DB SQL server_db_database_install_database_script
 * @typedef {object}        server_db_database_install_database_script
 * @property {number|null}  db                  -if null then execute in all databases
 * @property {string}       script
 */

/**
 * @description DB SQL server_db_database_uninstall_database_script
 * @typedef {object}        server_db_database_uninstall_database_script
 * @property {number|null}  db
 * @property {string}       sql
 */

/**
 * @description DB SQL server_db_database_install_database_app_script
 * @typedef {object}        server_db_database_install_database_app_script
 * @property {number|null}  db
 * @property {string}       sql
 */

/** 
 * @description DB SQL server_db_database_install_database_app_user_script
 * @typedef {object}        server_db_database_install_database_app_user_script
 * @property {number}       db
 * @property {string}       sql
 */

/** 
 * @description DB SQL server_db_database_uninstall_database_app_script
 * @typedef {object}        server_db_database_uninstall_database_app_script
 * @property {number|null}  db
 * @property {string}       sql
 */


/**
 * @description DB SQL query result
 * @typedef {   server_db_common_result_insert|server_db_common_result_delete|server_db_common_result_update|server_db_common_result_select}                server_db_common_result
 */

/**
 * @description DB SQL result error
 * @typedef {   {code:  string, errorNum:number, errno:number, message:string, db_message:string, stack:string, sqlMessage:string}}     server_db_common_result_error
 */

/**
 * @description DB SQL result INSERT
 * @typedef {{  insertId?:number, 
 *              affectedRows:number, 
 *              rowsAffected?:number,
 *              length?:number}}  server_db_common_result_insert
 */

/**
 * @description DB SQL result DELETE
 * @typedef {{  affectedRows:number, 
 *              rowsAffected?:number,
 *              length?:number}}  server_db_common_result_delete
 */

/**
 * @description DB SQL result UPDATE
 * @typedef {{  affectedRows:number, 
 *              rowsAffected?:number,
 *              length?:number}}  server_db_common_result_update
 */

/**
 * @description DB SQL result SELECT
 * @typedef {{  rows:*[], 
 *              list_header? : {	total_count:	number,
 *                              offset: 		number,
 *                              count:			number},
 *              page_header? : {	total_count:	number,
 *                              offset: 		number,
 *                              count:			number},
 *              length?:number}}  server_db_common_result_select
 */

/**
 * @description DB SQL result DB Info
 * @typedef {{  database_use:   number,
 *              database_name:  string,
 *              version:        string,
 *              database_schema:string,
 *              hostname:       string,
 *              connections:    number,
 *              started:        string}} server_db_sql_result_admin_DBInfo
 */

/**
 * @description DB SQL result DB Info space
 * @typedef {{  table_name:     string,
 *              total_size:     number,
 *              data_used:      number,
 *              data_free:      number,
 *              pct_used:       number}} server_db_sql_result_admin_DBInfoSpace
 */

/**
 * @description DB SQL result DB Info space sum
 * @typedef {{  total_size:     number,
 *              data_used:      number,
 *              data_free:      number,
 *              pct_used:       number}} server_db_sql_result_admin_DBInfoSpaceSum
 */

/**
 * @description DB SQL APP_DATA_ENTITY server_db_sql_result_app_data_entity_get
 * @typedef {{id:number, app_id:number, json_data:string}} server_db_sql_result_app_data_entity_get
 */

/**
 * @description DB SQL APP_DATA_ENTITY_RESOURCE server_db_sql_result_app_data_entity_resource_get
 * @typedef {{  id:number, 
 *              json_data:string, 
 *              app_setting_id:number, 
 *              app_data_entity_app_id:number, 
 *              app_data_entity_id:number, 
 *              app_setting_type_app_setting_type_name:string, 
 *              app_setting_value:string, 
 *              app_setting_display_data:string}} server_db_sql_result_app_data_entity_resource_get
 */

/**
 * @description DB SQL APP_DATA_RESOURCE_MASTER server_db_sql_result_app_data_resource_master_get
 * @typedef {{  id:number, 
 *              json_data:string, 
 *              user_account_app_user_account_id:number|null,
 *              user_account_app_app_id:number|null,
 *              app_data_entity_resource_app_data_entity_app_id:number,
 *              app_data_entity_resource_app_data_entity_id:number,
 *              app_data_entity_resource_id:number,
 *              app_data_entity_resource_json_data:string,
 *              app_setting_id:number,
 *              app_setting_type_app_setting_type_name:string,
 *              app_setting_value:string,
 *              app_setting_display_data:string,
 *              resource_metadata:string}} server_db_sql_result_app_data_resource_master_get
 */


/**
 * @description DB SQL APP_DATA_RESOURCE_DETAIL server_db_sql_result_app_data_resource_detail_get
 * @typedef {{  id:number, 
 *              json_data:string, 
 *              app_data_resource_master_id:number,
 *              app_data_entity_resource_id:number,
 *              app_data_entity_resource_app_data_entity_app_id:number,
 *              app_data_entity_resource_app_data_entity_id:number,
 *              app_data_resource_master_attribute_id:number,
 *              app_data_resource_master_app_data_entity_resource_app_data_entity_app_id:number,
 *              app_data_resource_master_app_data_entity_resource_app_data_entity_id:number,
 *              app_data_resource_master_app_data_entity_resource_id:number,
 *              user_account_app_user_account_id:number,
 *              user_account_app_app_id:number,
 *              app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_app_id:number,
 *              app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_id:number,
 *              app_data_resource_master_attribute_app_data_entity_resource_id:number,
 *              app_data_resource_master_attribute_user_account_app_user_account_id:number,
 *              app_data_resource_master_attribute_user_account_app_app_id:number,
 *              app_data_resource_master_app_setting_id:number,
 *              app_data_resource_master_app_setting_type_app_setting_type_name:string,
 *              app_data_resource_master_app_setting_value:string,
 *              app_setting_attribute_display_data:string,
 *              app_setting_id:number,
 *              app_setting_type_app_setting_type_name:string,
 *              app_setting_value:string,
 *              app_setting_display_data:string,
 *              resource_metadata:string}} server_db_sql_result_app_data_resource_detail_get
 */

/**
 * @description DB SQL APP_DATA_RESOURCE_DETAIL_DATA server_db_sql_result_app_data_resource_detail_data_get
 * @typedef {{  id:number, 
 *              json_data:string, 
 *              date_created:string,
 *              date_modified:string|null,
 *              app_data_resource_detail_id:number,
 *              app_data_resource_master_attribute_id:number,
 *              app_data_detail_app_data_resource_master_id:number,
 *              app_data_detail_app_data_entity_resource_id:number,
 *              app_data_detail_app_data_entity_resource_app_data_entity_app_id:number,
 *              app_data_detail_app_data_entity_resource_app_data_entity_id:number,
 *              app_data_detail_app_data_resource_master_attribute_id:number,
 *              app_data_resource_master_app_data_entity_resource_app_data_entity_app_id:number,
 *              app_data_resource_master_app_data_entity_resource_app_data_entity_id:number,
 *              app_data_resource_master_app_data_entity_resource_id:number,
 *              user_account_app_user_account_id:number|null,
 *              user_account_app_app_id:number|null,
 *              app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_app_id:number,
 *              app_data_resource_master_attribute_app_data_entity_resource_app_data_entity_id:number,
 *              app_data_resource_master_attribute_app_data_entity_resource_id:number,
 *              app_data_resource_master_attribute_user_account_app_user_account_id:number|null,
 *              app_data_resource_master_attribute_user_account_app_app_id:number|null,
 *              app_data_resource_master_app_setting_id:number,
 *              app_data_resource_master_app_setting_type_app_setting_type_name:string,
 *              app_data_resource_master_app_setting_value:string,
 *              app_setting_attribute_display_data:string,
 *              app_setting_id:number,
 *              app_setting_type_app_setting_type_name:string,
 *              app_setting_value:string,
 *              app_setting_display_data:string}} server_db_sql_result_app_data_resource_detail_data_get
 */

/**
 * @description DB SQL APP_DATA_STAT server_db_sql_result_app_data_stat_get
 * @typedef {{  app_id:                                                                     number|null,
 *				json_data:                                                                  string,
 *              date_created:                                                               string,            
 *              user_account_id:                                                            number|null,
 *              user_account_app_user_account_id:                                           number|null,
 *              user_account_app_app_id:                                                    number|null,
 *              app_data_resource_master_id:                                                number|null,
 *              app_data_resource_master_app_data_entity_resource_app_data_entity_app_id:   number|null,
 *              app_data_resource_master_app_data_entity_resource_app_data_entity_id:       number|null,
 *              app_data_resource_master_app_data_entity_resource_id:                       number|null,
 *              app_data_resource_master_user_account_app_user_account_id:                  number|null,
 *              app_data_resource_master_user_account_app_app_id:                           number|null,
 *              app_data_entity_resource_id:                                                number,
 *              app_setting_id:                                                             number,
 *              app_setting_type_app_setting_type_name:                                     string,
 *              app_setting_value:                                                          string,
 *              app_setting_display_data:                                                   string,
 *              app_data_entity_resource_app_data_entity_app_id:                            number,
 *              app_data_entity_resource_app_data_entity_id:                                number}} server_db_sql_result_app_data_stat_get
 */

/**
 * @description DB SQL APP_DATA_STAT server_db_sql_parameter_app_data_stat_post
 * @typedef {{  json_data:                                          {},
 *              app_id:                                             number|null,
 *              user_account_id:                                    number|null,
 *              user_account_app_user_account_id:                   number|null,
 *              user_account_app_app_id:                            number|null,
 *              app_data_resource_master_id:                        number|null,
 *              app_data_entity_resource_id:                        number,
 *              app_data_entity_resource_app_data_entity_app_id:    number,
 *              app_data_entity_resource_app_data_entity_id:        number}} server_db_sql_parameter_app_data_stat_post
 */

/**
 * @description DB SQL APP_DATA_STAT server_db_sql_parameter_app_data_stat_createLog
 * @typedef {{  app_module:string,
 *              app_module_type : string,
 *              app_module_request : string|null,
 *              app_module_result : string,
 *              app_user_id : null}} server_db_sql_parameter_app_data_stat_createLog
 */

/**
 * @description DB SQL APP_DATA_STAT server_db_sql_result_app_data_stat_logGet
 * @typedef {{  id:number,
 *              app_id:number,
 *              json_data:string,
 *              date_created:string,
 *              total_rows:number}} server_db_sql_result_app_data_stat_logGet
 */

/**
 * @description DB SQL APP_DATA_STAT server_db_sql_result_app_data_stat_getStatUniqueVisitor
 * @typedef {{  chart:number, 
 *              app_id:number, 
 *              year:number, 
 *              month:number, 
 *              day:number, 
 *              json_data:string}} server_db_sql_result_app_data_stat_getStatUniqueVisitor
 */

/**
 * @description DB SQL APP SETTING server_db_sql_result_app_setting_getSettings
 * @typedef {{  id:string,
 *              app_id:number, 
 *              app_setting_type_name:string,
 *              value:string, 
 *              data2:string|null, 
 *              data3:string|null, 
 *              data4:string|null, 
 *              data5:string|null,
 *              text:string}} server_db_sql_result_app_setting_getSettings
 */

/**
 * @description DB SQL APP SETTING server_db_sql_result_app_setting_getDisplayData
 * @typedef {{  id:string,
 *              value:string, 
 *              name:null, 
 *              display_data: string, 
 *              data2:string|null, 
 *              data3:string|null, 
 *              data4:string|null, 
 *              data5:string|null}} server_db_sql_result_app_setting_getDisplayData
 */

/**
 * @description DB SQL IDENTITY PROVIDER server_db_sql_result_identity_provider_getIdentityProviders
 * @typedef {{  id:string, 
 *              provider_name:string}} server_db_sql_result_identity_provider_getIdentityProviders
 */

/** 
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_getUsersAdmin
 * @typedef {{  id:number,
 *              avatar:string|null,
 *              active:number,
 *              user_level:number,
 *              private:number,
 *              username:string,
 *              bio:string,
 *              email:string,
 *              email_unverified:string,
 *              password:string,
 *              password_reminder:string,
 *              verification_code:string,
 *              identity_provider_id:number,
 *              provider_name:string,
 *              provider_id:string,
 *              provider_first_name:string,
 *              provider_last_name:string,
 *              provider_image:string,
 *              provider_image_url:string,
 *              provider_email:string,
 *              date_created:string,
 *              date_modified:string,
 *              total_rows:number}}  server_db_sql_result_user_account_getUsersAdmin
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_getStatCountAdmin
 * @typedef {{  identity_provider_id:number,
 *              provider_name:string,
 *              count_user:number}} server_db_sql_result_user_account_getStatCountAdmin
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_parameter_user_account_updateAdmin
 * @typedef {{  active:number|null,
 *              user_level:number|null,
 *              private:number|null,
 *              username:string,
 *              bio:string|null,
 *              email:string,
 *              email_unverified:string|null,
 *              password:string|null,
 *              password_new:string|null,
 *              password_reminder:string|null,
 *              verification_code:string|null,
 *              provider_id: string|null,
 *              avatar:string|null,
 *              admin:number}} server_db_sql_parameter_user_account_updateAdmin
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_parameter_user_account_create
 * @typedef {{  username:string|null,
 *              password:null,
 *              password_new:string|null,
 *              password_reminder:string|null,
 *              bio:string|null,
 *              private: number|null,
 *              user_level:number|null,
 *              email:string|null,
 *              email_unverified:string|null,
 *              avatar:string|null,
 *              verification_code:string|null,
 *              active:number,
 *              identity_provider_id:number|null,
 *              provider_id:string|null,
 *              provider_first_name:string|null,
 *              provider_last_name:string|null,
 *              provider_image:string|null,
 *              provider_image_url:string|null,
 *              provider_email:string|null,
 *              admin:number}} server_db_sql_parameter_user_account_create
 */


/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_getUserByUserId
 * @typedef {{  id:number,
 *              bio:string|null
 *              private: number|null,
 *              user_level:number|null,
 *              username:string|null,
 *              password:string|null,
 *              password_new:string|null,
 *              password_reminder:string|null,
 *              email:string|null,
 *              email_unverified:string|null,
 *              avatar:string|null,
 *              verification_code:string|null,
 *              active:number,
 *              identity_provider_id:number|null,
 *              provider_id:string|null,
 *              provider_first_name:string|null,
 *              provider_last_name:string|null,
 *              provider_image:string|null,
 *              provider_image_url:string|null,
 *              provider_email:string|null,
 *              date_created:string,
 *              date_modified:string}} server_db_sql_result_user_account_getUserByUserId
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_getProfileUser
 * @typedef {{  id:number,
 *              bio:string|null,
 *              private:number|null,
 *              friends:number|null,
 *              user_level:string,
 *              date_created:string,
 *              username:string, 
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
 *              count_views:number,
 *              followed:number,
 *              liked:number}} server_db_sql_result_user_account_getProfileUser
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_getProfileDetail
 * @typedef {{  detail:string,
 *              id:number,
 *              provider_id:string,
 *              avatar:string|null,
 *              provider_image:string,
 *              provider_image_url:string,
 *              username:string,
 *              provider_first_name:string,
 *              total_rows:number}} server_db_sql_result_user_account_getProfileDetail
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_getProfileStat
 * @typedef {{  top:string,
 *              id:number,
 *              identity_provider_id:number|null,
 *              provider_id:string|null,
 *              avatar:string|null,
 *              provider_image:string|null,
 *              provider_image_url:string|null,
 *              username:string,
 *              provider_first_name:string|null,
 *              total_rows:number}} server_db_sql_result_user_account_getProfileStat
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_checkPassword
 * @typedef {{  password:string}} server_db_sql_result_user_account_checkPassword
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_parameter_user_account_updatePassword
 * @typedef {{  password_new:string|null,
 *              auth:string|null}} server_db_sql_parameter_user_account_updatePassword
 *
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_parameter_user_account_updateUserLocal
 * @typedef {{  bio:string,
 *              private:number,
 *              username:string,
 *              password:string|null, 
 *              password_new:string|null,
 *              password_reminder:string|null,
 *              email:string,
 *              email_unverified:string|null,
 *              avatar:string|null,
 *              verification_code:string|null,
 *              provider_id:string|null,
 *              admin:number}} server_db_sql_parameter_user_account_updateUserLocal
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_parameter_user_account_updateUserCommon
 * @typedef {{  bio:string|null,
 *              private: number|null,
 *              username:string|null}} server_db_sql_parameter_user_account_updateUserCommon
 */


/**
 * @description DB SQL USER ACCOUNT server_db_sql_parameter_user_account_userLogin
 * @typedef {{  username:string}} server_db_sql_parameter_user_account_userLogin
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_userLogin
 * @typedef {{  id:number,
 *              bio:string|null,
 *              username:string,
 *              password:string,
 *              email:string,
 *              active:number,
 *              avatar:string|null}} server_db_sql_result_user_account_userLogin
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_providerSignIn
 * @typedef {{  id:number,
 *              bio:string|null,
 *              username:string, 
 *              password:string, 
 *              password_reminder:string, 
 *              email:string, 
 *              avatar:string|null,
 *              verification_code:string, 
 *              active:number, 
 *              identity_provider_id:number|null,
 *              provider_id:string|null,
 *              provider_first_name:string|null,
 *              provider_last_name:string|null,
 *              provider_image:string|null,
 *              provider_image_url:string|null,
 *              provider_image_email:string|null,
 *              date_created:string
 *              date_modified:string}} server_db_sql_result_user_account_providerSignIn
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_getEmailUser
 * @typedef {{  id:number,
 *              email:string}} server_db_sql_result_user_account_getEmailUser
 */

/**
 * @description DB SQL USER ACCOUNT server_db_sql_result_user_account_getDemousers 
 * @typedef {{  id:number, username:string}} server_db_sql_result_user_account_getDemousers 
 */

/**
 * @description DB SQL USER ACCOUNT APP server_db_sql_result_user_account_app_getUserAccountApps
 * @typedef {{  app_id:number,
 *              date_created:string}} server_db_sql_result_user_account_app_getUserAccountApps
 */

/**
 * @description DB SQL USER ACCOUNT APP server_db_sql_result_user_account_app_getUserAccountApp
 * @typedef {{  preference_locale:string,
 *              app_setting_preference_timezone_id:number,
 *              app_setting_preference_direction_id:number,
 *              app_setting_preference_arabic_script_id:number,
 *              date_created:string}} server_db_sql_result_user_account_app_getUserAccountApp
 */

/**
 * @description DB SQL USER ACCOUNT APP server_db_sql_parameter_user_account_app_updateUserAccountApp
 * @typedef {{  preference_locale:string,
 *              app_setting_preference_timezone_id:number|null,
 *              app_setting_preference_direction_id:number|null,
 *              app_setting_preference_arabic_script_id:number|null}} server_db_sql_parameter_user_account_app_updateUserAccountApp
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST server_db_sql_parameter_user_account_app_data_post_createUserPost
 * @typedef {{  description:string,
 *              json_data:string,
 *              user_account_id:number|null}} server_db_sql_parameter_user_account_app_data_post_createUserPost
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST server_db_sql_result_user_account_app_data_post_getUserPost
 * @typedef {{  id:number,
 *              description:string,
 *              json_data:string,
 *              date_created:string,
 *              date_modified:string,
 *              user_account_app_user_account_id:number,
 *              user_account_app_id: number}} server_db_sql_result_user_account_app_data_post_getUserPost
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST server_db_sql_result_user_account_app_data_post_getUserPostsByUserId
 * @typedef {{  id:number, 
 *              description:string, 
 *              json_data:string, 
 *              date_created:string, 
 *              date_modified:string, 
 *              user_account_app_user_account_id:number, 
 *              user_account_app_app_id:number}} server_db_sql_result_user_account_app_data_post_getUserPostsByUserId
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST server_db_sql_result_user_account_data_post_getProfileStatLike
 * @typedef {{  count_user_account_app_data_post_likes:number,
 *              count_user_account_app_data_post_liked:number}} server_db_sql_result_user_account_data_post_getProfileStatLike
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST server_db_sql_result_user_account_app_data_post_getProfileUserPosts
 * @typedef {{  id:number,
 *              description:string,
 *              user_account_app_user_account_id:number,
 *              json_data:string,
 *              count_likes:number,
 *              count_views:number,
 *              liked:number}} server_db_sql_result_user_account_app_data_post_getProfileUserPosts
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST server_db_sql_result_user_account_app_data_post_getProfileUserPostDetail
 * @typedef {{  detail:string,
 *              id:number,
 *              identity_provider_id:number,
 *              provider_id:string,
 *              avatar:string|null,
 *              provider_image:string,
 *              provider_image_url:string,
 *              username:string,
 *              provider_first_name:string,
 *              total_rows:number}} server_db_sql_result_user_account_app_data_post_getProfileUserPostDetail
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST server_db_sql_result_user_account_app_data_post_getProfileStatPost
 * @typedef {{  top:string,
 *              id:number,
 *              iidentity_provider_id:number,
 *              provider_id:string,
 *              avatar:string|null,
 *              provider_image:string,
 *              provider_image_url:string,
 *              username:string,
 *              provider_first_name:string,
 *              count:number,
 *              total_rows:number}} server_db_sql_result_user_account_app_data_post_getProfileStatPost
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST server_db_sql_parameter_user_account_app_data_post_updateUserPost
 * @typedef {{  description:string,
 *              json_data:string,
 *              user_account_id:number|null}} server_db_sql_parameter_user_account_app_data_post_updateUserPost
 */

/**
 * @description DB SQL USER ACCOUNT APP DATA POST VIEW server_db_sql_parameter_user_account_app_data_post_view_insertUserPostView
 * @typedef {{  client_ip:string|null,
 *              client_user_agent:string|null
 *              user_account_id:number|null,
 *              user_account_app_data_post_id:number|null}} server_db_sql_parameter_user_account_app_data_post_view_insertUserPostView
 */

/**
 * @description DB SQL USER ACCOUNT EVENT server_db_sql_parameter_user_account_event_insertUserEvent
 * @typedef {{  user_account_id:number,
 *              event:string,
 *              event_status:string}} server_db_sql_parameter_user_account_event_insertUserEvent
 */

/**
 * @description DB SQL USER ACCOUNT EVENT server_db_sql_result_user_account_event_getLastUserEvent
 * @typedef {{  user_account_id:number,
 *              event_id:number,
 *              event_name:string,
 *              event_status_id:number,
 *              status_name:string,
 *              date_created:string,
 *              date_modified:string,
 *              current_timestamp:string}} server_db_sql_result_user_account_event_getLastUserEvent
 */


/**
 * @description DB SQL USER ACCOUNT VIEW server_db_sql_parameter_user_account_view_insertUserAccountView
 * @typedef {{  user_account_id:number|null,
 *              user_account_id_view:number,
 *              client_ip:string|null,
 *              client_user_agent:string|null}} server_db_sql_parameter_user_account_view_insertUserAccountView
 */

/**
 * @description IAM server_iam_access_token_claim_scope_type
 * @typedef{'USER'|'APP'|'REPORT'|'MAINTENANCE'|'APP_CUSTOM'} server_iam_access_token_claim_scope_type
 */
/**
 * @description IAM server_iam_access_token_claim_type
 * @typedef {{  app_id:         number,
 *              id:             number|string,
 *              name:           string,
 *              ip:             string,
 *              scope:          server_iam_access_token_claim_scope_type,
 *              tokentimestamp: number}} server_iam_access_token_claim_type
 */

/**
 * @description IAM server_iam_authenticate_request
 * @typedef {{statusCode:number,
 *            statusMessage:string}|null} server_iam_authenticate_request
 */

/**
 * @description INFO server_info_result_Info
 * @typedef {{  os:{        hostname:string,
 *                          platform:NodeJS.Platform,
 *                          type:string,
 *                          release:string,
 *                          cpus:{
 *                                  model: string,
 *                                  speed: number,
 *                                  times: {
 *                                          user: number,
 *                                          nice: number,
 *                                          sys: number,
 *                                          idle: number,
 *                                          irq: number
 *                                          }
 *                               }[],
 *                          arch:string,
 *                          freemem:number,
 *                          totalmem:number,
 *                          homedir:string,
 *                          tmpdir:string,
 *                          uptime:number,
 *                          userinfo:{  username: *,
 *                                      uid: number,
 *                                      gid: number,
 *                                      shell: *,
 *                                      homedir: *},
 *                          version:string},
 *               process:{   memoryusage_rss : number,
 *                          memoryusage_heaptotal : number,
 *                          memoryusage_heapused : number,
 *                          memoryusage_external : number,
 *                          memoryusage_arraybuffers : number,
 *                          uptime : number,
 *                          version : string,
 *                          path : string,
 *                          start_arg_0 : string,
 *                          start_arg_1 : string
 *                  }}} server_info_result_Info
 */


/**
 * @description SERVER server_REST_API_parameters
 * @typedef {{  app_id: number,
 *              endpoint: server_bff_endpoint_type,
 *              host:string,
 *              url:string,
 *              route_path:string,
 *              method: server_req_method,
 *              parameters: string,
 *              body:*,
 *              idToken:string,
 *              authorization:string,
 *              ip: string,
 *              user_agent:string,
 *              accept_language:string,
 *              res:server_server_res}} server_REST_API_parameters
 */

/**
 * @description SERVER server_server_req_verbose
 * @typedef {*} server_server_req_verbose
 * 
 */
/**
 * @typedef {'GET'|'POST'|'DELETE'|'PATCH'|'PUT'|string} server_req_method
 */
/**
 * @description SERVER server_server_req
 * @typedef {Object} server_server_req
 * @property {string} baseUrl
 * @property {string} hostname
 * @property {string} host
 * @property {string} path
 * @property {string} url
 * @property {string} originalUrl
 * @property {string} ip
 * @property {server_req_method} method
 * @property {function} get
 * @property {string} protocol
 * @property {string} httpVersion
 * @property {[string]} rawHeaders
 * @property {object} client
 * @property {number} client.localPort
 * route
 * @property {object} route
 * @property {string} route.path
 * body
 * @property {object} body
 * query
 * @property {object} query
 * @property {string} query.parameters
 
 * @property {{ 'id-token':string,
 *              authorization: string, 
 *              'user-agent': string, 
 *              'accept-language': string, 
 *              'content-type': string, 
 *              host:string, 
 *              'sec-fetch-mode':string,
 *              accept:string, 
 *              referer:string,
 *              'X-Request-Id':string,
 *              'X-Correlation-Id':string}} headers
 * socket
 * @property {object} socket
 * @property {number} socket.bytesRead
 * @property {number} socket.bytesWritten
 * @property {string} socket.remoteAddress
 * @property {boolean} socket.encrypted
 *
 */

/** 
 * @description SERVER server_server_res
 * @typedef {Object} server_server_res
 * @property {function} status
 * @property {number} statusCode
 * @property {(Error|string|number|null|object)} statusMessage
 * @property {function} type
 * @property {function} end
 * @property {function} send
 * @property {function} sendFile
 * @property {function} redirect 
 * @property {function} getHeader
 * @property {function} setHeader
 * @property {function} removeHeader
 * @property {function} on
 * @property {function} write
 * @property {function} flush           - Used for SSE
 * @property {function} set
 * @property {function} writeHead
 * @property {string}   _header         --user for response compression
 * @property {function} _implicitHeader --used for response compression
 * @property {server_server_req}   req
 */

/**
 * @description SERVER server_server_response_type
 * @typedef {'JSON'|'HTML'|'CSS'|'JS'|'WEBP'|'PNG'|'WOFF'|'TTF'} server_server_response_type
 */

/**
 * @description SERVER server_server_response
 * @typedef {{  http?:number|null,
 *              code?:number|string|null,
 *              text?:string|null,
 *              developerText?:string|null,
 *              moreInfo?:string|null,
 *              result?:*,
 *              sendfile?:string|null,
 *              sendcontent?:string,
 *              type:server_server_response_type}} server_server_response
 */

/**
 * @description SERVER server_server_req_id_number
 * @typedef {string|number|null|undefined} server_server_req_id_number
 */


/**
 * @description SERVER server_server_express
 * @typedef {object} server_server_express
 * @property {function} use
 * @property {function} get
 * @property {function} set
 * @property {function} route
 * @property {function} listen
 * 
 */

/**
 * @description SERVER server_server_error
 * @typedef {Object.<Error | null , undefined>} server_server_error
 */
/**
 * @description SOCKET config_user_parameter
 * @typedef {'username'|'password'|'created'|'modified'} config_user_parameter
 */

/**
 * @description SOCKET server_socket_connected_list
 * @typedef {object} server_socket_connected_list
 * @property {number} id
 * @property {string} connection_date
 * @property {number} app_id
 * @property {string|null} authorization_bearer
 * @property {number|null} iam_user_id
 * @property {string|null} iam_user_username
 * @property {'ADMIN'|'USER'|null} iam_user_type
 * @property {number|null} user_account_id
 * @property {number|null} identity_provider_id
 * @property {string|null} token_access
 * @property {string|null} token_admin
 * @property {string} gps_latitude
 * @property {string} gps_longitude
 * @property {string} place
 * @property {string} timezone
 * @property {string} ip
 * @property {string} user_agent
 * @property {server_server_res}    response
 */

/**
 * @description SOCKET server_socket_connected_list_no_res
 * @typedef {{  id:number,
 *              connection_date:string,
 *              app_id:number,
 *              authorization_bearer:string|null,
 *              iam_user_id:number|null,
 *              iam_user_username:string|null,
 *              iam_user_type:'ADMIN'|'USER'|null,
 *              user_account_id:number|null,
 *              identity_provider_id:number|null,
 *              gps_latitude:string,
 *              gps_longitude:string,
 *              place:string,
 *              timezone:string,
 *              ip:string,
 *              user_agent:string}} server_socket_connected_list_no_res
 */

/** 
 * @description SOCKET server_socket_broadcast_type_all
 * @typedef {'ALERT'|'MAINTENANCE'|'CHAT'|'PROGRESS'|'SESSION_EXPIRED'|'CONNECTINFO'|'APP_FUNCTION'} server_socket_broadcast_type_all
 */

/**
 * @description SOCKET server_socket_broadcast_type_admin
 * @typedef {'ALERT'|'CHAT'|'PROGRESS'} server_socket_broadcast_type_admin
 */

/** 
 * @description SOCKET server_socket_broadcast_type_app_function
 * @typedef {'CHAT'|'PROGRESS'|'SESSION_EXPIRED'|'APP_FUNCTION'} server_socket_broadcast_type_app_function
 */

/**
 * @description SOCKET server_socket_connected_list_sort
 * @typedef {   'id'|
 *              'connection_date'| 
 *              'app_id'|
 *              'user_account_id'|
 *              'identity_provider_id'|
 *              'iam_user_id'|
 *              'iam_user_username'|
 *              'iam_user_type'|
 *              'gps_latitude'|
 *              'gps_longitude'|
 *              'ip'|
 *              'user_agent'|
 *              null} server_socket_connected_list_sort
 */

export {};