/** 
 * Declaration of all types used in server
 * @module server/types 
 */
/** BFF
 * @typedef {'APP'|'APP_DATA'|'APP_SIGNUP'|'APP_ACCESS'|'APP_EXTERNAL'|'ADMIN'|'SUPERADMIN'|'SYSTEMADMIN'|'SOCKET'|'IAM_SYSTEMADMIN'|'IAM_ADMIN'|'IAM_USER'|'IAM_PROVIDER'|
 *           'SERVER_APP'|'SERVER_REPORT'|'SERVER_SOCKET'|'SERVER_MAIL'} endpoint_type
 * @typedef {{
 *          endpoint: endpoint_type,
 *          host:string|null,
 *          url:string|null,
 *          route_path:string,
 *          method: string,
 *          query: string,
 *          body:object,
 *          authorization:string|null,
 *          ip: string,
 *          user_agent:string,
 *          accept_language:string,
 *          res: res}} bff_parameters
 * 
 * Routes paramaters
 * @typedef {{  app_id: number,
*               endpoint: string,
*               host:string,
*               url:string,
*               route_path:string,
*               method: string,
*               parameters: string,
*               body:*,
*               authorization:string,
*               ip: string,
*               user_agent:string,
*               accept_language:string,
*               res: res}} routesparameters
 */
/**
 * Server/Apps - Request verbose
 * @typedef {*} req_verbose
 * 
 * Server/apps - Request
 * @typedef {Object} req
 * @property {string} baseUrl
 * @property {string} hostname
 * @property {string} host                                          - Admin log parameter
 * @property {string} path
 * @property {string} originalUrl
 * @property {string} ip
 * @property {string} method
 * @property {function} get
 * @property {string} protocol
 * @property {string} httpVersion
 * @property {[string]} rawHeaders
 * @property {object} client
 * @property {number} client.localPort
 * params
 * @property {object} params
 * @property {number} params.user_account_id                        - Admin parameter
 * @property {string} params.info                                   - Info parameter
 * @property {string} params.sub                                    - App showparam parameter
 * @property {string} params.id                                     - app portfolio parameter
 * @property {string} params.lang_code                              - app portfolio parameter
 * @property {string} params.app_id                                 - app portfolio parameter
 * @property {string} params.code                                   - app portfolio parameter
 * @property {string} params.statchoice                             - app portfolio parameter
 * route
 * @property {object} route
 * @property {string} route.path
 * body
 * @property {object} body
 * @property {string} body.value                                    - Server parameter
 * @property {string} body.config_no                                - Server parameter
 * @property {db_file_config_files} body.config_json                - Server parameter
 * @property {number} body.app_id
 * @property {number} body.client_id                                - Socket parameter
 * @property {number} body.client_id_current                        - Socket parameter
 * @property {socket_broadcast_type_all} body.broadcast_type        - Socket parameter
 * @property {string} body.broadcast_message                        - Socket parameter
 * @property {string} body.demo_password                            - Admin parameter
 * @property {string} body.app_name                                 - app portfolio parameter
 * @property {string} body.url                                      - app portfolio parameter
 * @property {string} body.logo                                     - app portfolio parameter
 * @property {string} body.enabled                                  - app portfolio parameter
 * @property {number} body.app_category_id                          - app portfolio parameter
 * @property {string} body.parameter_value                          - app portfolio parameter
 * @property {string} body.parameter_comment                        - app portfolio parameter
 * @property {string} body.parameter_name                           - app portfolio parameter
 * @property {number} body.app_role_id                              - app portfolio parameter
 * @property {number} body.active                                   - app portfolio parameter
 * @property {number} body.user_level                               - app portfolio parameter
 * @property {number} body.private                                  - app portfolio parameter
 * @property {string} body.username                                 - app portfolio parameter
 * @property {string} body.bio                                      - app portfolio parameter
 * @property {string} body.email                                    - app portfolio parameter
 * @property {string} body.email_unverified                         - app portfolio parameter
 * @property {string} body.password
 * @property {string|null} body.password_new
 * @property {string} body.password_reminder                        - app portfolio parameter
 * @property {string} body.new_email                                - app portfolio parameter
 * @property {string} body.avatar                                   - app portfolio parameter
 * @property {string} body.user_language                            - app portfolio parameter
 * @property {string} body.user_timezone                            - app portfolio parameter
 * @property {string} body.user_number_system                       - app portfolio parameter
 * @property {string} body.user_platform                            - app portfolio parameter
 * @property {string} body.client_latitude                          - app portfolio parameter
 * @property {string} body.client_longitude                         - app portfolio parameter
 * @property {number} body.user_account_id                          - app portfolio parameter
 * @property {number} body.identity_provider_id                     - app portfolio parameter
 * @property {string} body.provider_first_name                      - app portfolio parameter
 * @property {string} body.provider_last_name                       - app portfolio parameter
 * @property {string} body.provider_image                           - app portfolio parameter
 * @property {string} body.provider_image_url                       - app portfolio parameter
 * @property {string} body.provider_email                           - app portfolio parameter
 * @property {string|null} body.provider_id                         - app portfolio parameter
 * @property {string} body.verification_code                        - app portfolio parameter
 * @property {string} body.verification_type                        - app portfolio parameter
 * @property {string} body.auth                                     - app portfolio parameter
 * @property {number} body.app_setting_preference_direction_id      - app portfolio parameter
 * @property {number} body.app_setting_preference_arabic_script_id  - app portfolio parameter
 * @property {number} body.app_setting_preference_timezone_id       - app portfolio parameter
 * @property {string} body.preference_locale                        - app portfolio parameter
 * @property {string} body.description                              - app portfolio parameter
 * @property {object} body.json_data                                - app portfolio parameter
 * @property {number} body.user_account_app_data_post_id                          - app portfolio parameter
 * query
 * @property {object} query
 * @property {(string|number|*)} query.id
 * @property {(string|number|*)} query.app_id
 * @property {number} query.select_app_id                           - Admin parameter
 * @property {number} query.year                                    - Admin parameter
 * @property {number} query.month                                   - Admin parameter
 * @property {string} query.day                                     - Admin parameter
 * @property {number} query.limit                                   - Admin parameter
 * @property {string} query.order_by                                - Admin parameter
 * @property {sort_socket} query.sort                               - Admin parameter
 * @property {string} query.count_logged_in                         - Admin parameter
 * @property {number} query.optional                                - Admin parameter
 * @property {string} query.logscope                                - Admin log parameter
 * @property {string} query.loglevel                                - Admin log parameter
 * @property {string} query.offset                                  - Admin log parameter
 * @property {string} query.search                                  - Admin log parameter
 * @property {string} query.code                                    - Admin log parameter
 * @property {(string|number|*)} query.app_user_id
 * @property {(string|number|*)} query.client_id
 * @property {(string|number|*)} query.user_account_id
 * @property {string} query.lang_code
 * @property {string} query.authorization                           - EventSource parameter
 * @property {string} query.latitude                                - Socket and geolocation parameter
 * @property {string} query.longitude                               - Socket and geolocation parameter
 * @property {string} query.reportid                                - Report parameter
 * @property {string} query.service                                 - Report parameter
 * @property {string} query.messagequeue                            - Report parameter
 * @property {string} query.ps                                      - Report parameter
 * @property {boolean} query.hf                                     - Report parameter
 * @property {number|null} query.uid_view                           - Report parameter
 * @property {string|*} query.parameters
 * @property {string} query.iam                                     - encoded string
 *                                                                  - content:authorization_bearer=[string]&user_id=[number]&system_admin=[string]&service=[string]&app_id=[number]
 * @property {number} query.PATCH_ID                                - app portfolio parameter
 * @property {number} query.data_app_id                             - app portfolio parameter
 * @property {string} query.object                                  - app portfolio parameter
 * @property {string} query.object_name                             - app portfolio parameter
 * @property {string} query.setting_type                            - app portfolio parameter
 * @property {string} query.detailchoice                            - app portfolio parameter
 * @property {number} query.initial                                 - app portfolio parameter
 * @property {string} query.parameter                               - Server parameter
 * @property {string} query.system_admin                            - app portfolio parameter
 * @property {number} query.identity_provider_id
 * @property {0|1|2|3|4|5|6} query.config_type_no                   - Server parameter
 * @property {config_group} query.config_group                      - Server parameter
 * 
 * @property {{ authorization: string, 
 *              'user-agent': string, 
 *              'accept-language': string, 
 *              'content-type': string, 
 *              host:string, 
 *              accept:string, 
 *              referer:string,
 *              'X-Request-Id':string,
 *              'X-Correlation-Id':string}} headers
 * socket
 * @property {object} socket
 * @property {string} socket.bytesRead
 * @property {string} socket.bytesWritten
 * 
 * Server/Apps - Response
 * @typedef {Object} res
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
 * @property {function} flush           - Used for EventSource
 * @property {function} set
 * @property {object}   req
 * @property {{'sec-fetch-mode':string}}   req.headers - Used for EventSource
 * @property {string}   req.hostname
 * @property {string}   req.protocol
 * @property {object}   req.query
 * @property {string}   req.query.iam
 */

/**
 * Server/MicroService/apps - Request id
 * @typedef {string|number|null|undefined} req_id_number
 */
/**
 * Apps - Request app params
 * @typedef {Object} req_app_parameters
 * @property {string} ip
 * @property {string} method
 * @property {string} headers_user_agent
 * @property {string} headers_accept_language
 * @property {string} headers_host
 * @property {object} body
 */
/**
 * Server - Request log params
 * @typedef {Object} req_log_parameters
 * @property {string} host
 * @property {string} ip
 * @property {string} protocol
 * @property {string} httpVersion
 * @property {string} originalUrl
 * @property {string} method
 * @property {{ 'X-Request-Id':string,
 *              'X-Correlation-Id':string,
 *              'user-agent':string,
 *              'accept-language':string,
 *              referer:string }} headers
 * @property {object} socket
 * @property {string} socket.bytesRead
 * @property {string} socket.bytesWritten
 * 
 * Server - Express
 * @typedef {object} express
 * @property {function} use
 * @property {function} get
 * @property {function} set
 * @property {function} route
 * @property {function} listen
 * 
 * Server - Error stack
 * @typedef {string} error_stack
 * 
 * Server/Apps/Service - Error 
 * @typedef {Object.<Error | null , undefined>} error
 */

/**
 * JWT token
 * @typedef {{  app_id:         number,
 *              id:             number|string|null,
 *              name:           string,
 *              ip:             string,
 *              scope:          'USER'|'APP'|'APP_CUSTOM',
 *              tokentimestamp: number}} access_token_claim_type
 * Apps - Email param data
 * @typedef {object} email_param_data
 * @property {string} emailtype         - [1-4], 1=SIGNUP, 2=UNVERIFIED, 3=PASSWORD RESET (FORGOT), 4=CHANGE EMAIL
 * @property {string|null} host              
 * @property {number} app_user_id       
 * @property {string|null} verificationCode  
 * @property {string} to                - to email
 * 
 * Apps - Email return data
 * @typedef {object} email_return_data
 * @property {string} email_host
 * @property {string} email_port
 * @property {string} email_secure
 * @property {string} email_auth_user
 * @property {string} email_auth_pass
 * @property {string} from
 * @property {string} to
 * @property {string} subject
 * @property {string} html
 * 
 * @typedef {{  USERNAME:string,
 *              EMAIL:string,
 *              NEW_EMAIL:string,
 *              BIO:string,
 *              PASSWORD:string,
 *              PASSWORD_CONFIRM:string,
 *              PASSWORD_REMINDER:string,
 *              NEW_PASSWORD_CONFIRM:string,
 *              NEW_PASSWORD:string,
 *              CONFIRM_QUESTION:string}} translate_items
 * Apps - App info
 * @typedef {object} app_info               - app info
 * @property {number} app_id                - app id
 * @property {string} locale                - locale
 * @property {number} system_admin_only     - 0/1
 * @property {string} idtoken             - JW token
 * @property {string} latitude              - geodata latitude
 * @property {string} longitude             - geodata longitude
 * @property {string} place                 - geodata place
 * @property {string} timezone              - geodata timezone
 * @property {translate_items} translate_items - items to be translated
 * @property {string|null} module                - HTML
 * 
 * Apps - App module config info
 * 
 * @typedef {object} module_config
 * @property {string} module_type       - APP or REPORT
 * @property {string|null} params       - parameter in url used by SHOW_PROFILE parameter in apps.json
 * @property {string|null} reportid     - REPORT
 * @property {number|null} uid_view     - REPORT
 * @property {string|null} reportname   - REPORT
 * @property {string|null} url          - REPORT
 * @property {string} ip                - ip address
 * @property {string} method            - request method
 * @property {string} user_agent        - request user agent
 * @property {string} accept_language   - request accept language
 * @property {string} host              - request host
 * 
 * Apps - App render common info settings
 * @typedef {object} render_common_settings
 * @property {db_result_app_setting_getSettings[]} settings - db result
 * @property {string} user_timezones        - HTML option format
 * @property {string} user_directions       - HTML option format
 * @property {string} user_arabic_scripts   - HTML option format
 * 
 * Apps - App common parameters
 * @typedef {object}        app_service_parameters
 * @property {number}       app_id
 * @property {string}       app_logo
 * @property {string|null}  app_email
 * @property {string|null}  app_copyright
 * @property {string|null}  app_link_url
 * @property {string|null}  app_link_title
 * @property {string|null}  app_text_edit
 * @property {number}       app_framework
 * @property {number}       app_framework_messages
 * @property {number}       app_rest_api_version
 * @property {string}       app_idtoken
 * @property {string}       locale
 * @property {translate_items}  translate_items
 * @property {number}       system_admin_only
 * @property {string|null}  client_latitude
 * @property {string|null}  client_longitude
 * @property {string|null}  client_place
 * @property {string|null}  client_timezone
 * @property {number|null}  common_app_id
 * @property {string}       rest_resource_bff
 * @property {number}       first_time
 * 
 * Apps - Report query parameters
 * @typedef {object} report_query_parameters
 * @property {string} module
 * @property {number} uid_view
 * @property {string} url
 * @property {string} [ps]
 * @property {number} [hf]
 * @property {string} format
 * 
 * Apps - Report create parameters
 * @typedef {object}        report_create_parameters
 * @property {number}       app_id
 * @property {string}       reportid
 * @property {string}       ip
 * @property {string}       user_agent
 * @property {string}       accept_language
 * @property {string}       latitude
 * @property {string}       longitude
 */

/**
 * Server - authenticate request
 * @typedef {{statusCode:number,
 *            statusMessage:string}|null} authenticate_request
 * Server - Info
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
 *              process:{   memoryusage_rss : number,
 *                          memoryusage_heaptotal : number,
 *                          memoryusage_heapused : number,
 *                          memoryusage_external : number,
 *                          memoryusage_arraybuffers : number,
 *                          uptime : number,
 *                          version : string,
 *                          path : string,
 *                          start_arg_0 : string,
 *                          start_arg_1 : string
 *                  }}} server_info
 * 
 * 
 * Server - Config group
 * @typedef {'SERVER'|'SERVICE_IAM'|'SERVICE_SOCKET'|'SERVICE_DB'|'SERVICE_LOG'|'METADATA'} config_group
 * 
 * Server - Config
 * @typedef {{   HTTPS_KEY:string,
 *               HTTPS_CERT:string,
 *               PORT:string,
 *               HTTPS_ENABLE:string,
 *               HTTPS_PORT:string,
 *               HTTPS_SSL_VERIFICATION:string,
 *               HTTPS_SSL_VERIFICATION_PATH:string,
 *               JSON_LIMIT:string,
 *               TEST_SUBDOMAIN:string,
 *               APP_LOG:string,
 *               APP_START:string,
 *               APP_COMMON_APP_ID:string,
 *               REST_RESOURCE_BFF:string}} config_server_server
 * @typedef {{ AUTHENTICATE_REQUEST_ENABLE:string,
 *             AUTHENTICATE_REQUEST_IP:string,
 *             AUTHENTICATE_REQUEST_HOST_EXIST:string,
 *             AUTHENTICATE_REQUEST_ACCESS_FROM:string,
 *             AUTHENTICATE_REQUEST_USER_AGENT:string,
 *             AUTHENTICATE_REQUEST_USER_AGENT_EXIST:string,
 *             AUTHENTICATE_REQUEST_ACCEPT_LANGUAGE:string,
 *             ADMIN_TOKEN_EXPIRE_ACCESS:string,
 *             ADMIN_TOKEN_SECRET:string,
 *             ADMIN_PASSWORD_ENCRYPTION_KEY:string,
 *             ADMIN_PASSWORD_INIT_VECTOR:string,
 *             ENABLE_CONTENT_SECURITY_POLICY:string,
 *             ENABLE_GEOLOCATION:string,
 *             ENABLE_USER_REGISTRATION:string,
 *             ENABLE_USER_LOGIN:string}} config_server_service_iam
 * @typedef {{CHECK_INTERVAL:string}} config_server_socket
 * @typedef {{   START:string,
 *               USE:string,
 *               DB1_SYSTEM_ADMIN_USER:string,
 *               DB1_SYSTEM_ADMIN_PASS:string,
 *               DB1_APP_ADMIN_USER:string,
 *               DB1_APP_ADMIN_PASS:string,
 *               DB1_PORT:string,
 *               DB1_HOST:string,
 *               DB1_NAME:string,
 *               DB1_CHARACTERSET:string,
 *               DB1_CONNECTION_LIMIT:string,
 *               DB2_SYSTEM_ADMIN_USER:string,
 *               DB2_SYSTEM_ADMIN_PASS:string,
 *               DB2_APP_ADMIN_USER:string,
 *               DB2_APP_ADMIN_PASS:string,
 *               DB2_PORT:string,
 *               DB2_HOST:string,
 *               DB2_NAME:string,
 *               DB2_CHARACTERSET:string,
 *               DB2_CONNECTION_LIMIT:string,
 *               DB3_SYSTEM_ADMIN_USER:string,
 *               DB3_SYSTEM_ADMIN_PASS:string,
 *               DB3_APP_ADMIN_USER:string,
 *               DB3_APP_ADMIN_PASS:string,
 *               DB3_PORT:string,
 *               DB3_HOST:string,
 *               DB3_NAME:string,
 *               DB3_TIMEOUT_CONNECTION:string,
 *               DB3_TIMEOUT_IDLE:string,
 *               DB3_MAX:string,
 *               DB4_SYSTEM_ADMIN_USER:string,
 *               DB4_SYSTEM_ADMIN_PASS:string,
 *               DB4_APP_ADMIN_USER:string,
 *               DB4_APP_ADMIN_PASS:string,
 *               DB4_HOST:string,
 *               DB4_NAME:string,
 *               DB4_CONNECT_STRING:string,
 *               DB4_POOL_MIN:string,
 *               DB4_POOL_MAX:string,
 *               DB4_POOL_INCREMENT:string}} config_server_service_db
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
 *              FILE_INTERVAL:string}} config_server_service_log
 * @typedef  {{ MAINTENANCE:number,
 *              CONFIGURATION:string,
 *              COMMENT:string,
 *              CREATED:string,
 *              MODIFIED:string}} config_server_metadata
 * @typedef  {{ ['SERVER']:[config_server_server], 
 *              ['SERVICE_IAM']:[config_server_service_iam],
 *              ['SERVICE_SOCKET']:[config_server_socket],
 *              ['SERVICE_DB']:[config_server_service_db],
 *              ['SERVICE_LOG']:[config_server_service_log],
 *              ['METADATA']:config_server_metadata}} config_server
 * 
 * @typedef {   config_apps|
 *              config_server|
 *              config_iam_blockip|config_iam_policy|config_iam_user|config_iam_useragent|microservice_config|microservice_config_service} db_file_config_files
 */

/**
 * Server/MicroService - Config apps
 * @typedef  {  'APP_ID'|
 *              'NAME'|
 *              'SUBDOMAIN'|
 *              'PATH'|
 *              'LOGO'|
 *              'SHOWPARAM'|
 *              'SECRETS'|
 *              'PARAMETERS'|
 *              'RENDER_CONFIG'|
 *              'MODULES'|
 *              'STATUS'} config_apps_keys
 * @typedef {{  SERVICE_DB_DB1_APP_USER: string,
 *              SERVICE_DB_DB1_APP_PASSWORD: string,
 *              SERVICE_DB_DB2_APP_USER: string,
 *              SERVICE_DB_DB2_APP_PASSWORD: string,
 *              SERVICE_DB_DB3_APP_USER: string,
 *              SERVICE_DB_DB3_APP_PASSWORD: string,
 *              SERVICE_DB_DB4_APP_USER: string,
 *              SERVICE_DB_DB4_APP_PASSWORD: string,
 *              SERVICE_MAIL_HOST: string,
 *              SERVICE_MAIL_PORT: string,
 *              SERVICE_MAIL_SECURE: string,
 *              SERVICE_MAIL_USERNAME: string,
 *              SERVICE_MAIL_PASSWORD: string,
 *              SERVICE_MAIL_TYPE_SIGNUP: string,
 *              SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME: string,
 *              SERVICE_MAIL_TYPE_UNVERIFIED: string,
 *              SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME: string,
 *              SERVICE_MAIL_TYPE_PASSWORD_RESET: string,
 *              SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME: string,
 *              SERVICE_MAIL_TYPE_CHANGE_EMAIL: string,
 *              SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME: string,
 *              CLIENT_ID: string, 
 *              CLIENT_SECRET:string, 
 *              APP_ID_SECRET:string, 
 *              APP_ID_EXPIRE:string, 
 *              APP_ACCESS_SECRET:string, 
 *              APP_ACCESS_EXPIRE:string
 *          }} config_apps_secrets
 * @typedef {[{}]} config_apps_parameters
 * @typedef {{  MANIFEST:boolean,
 *              JS:string,
 *              JS_SECURE:string,
 *              JS_REPORT:string,
 *              CSS:string,
 *              CSS_REPORT:string,
 *              FAVICON_32x32:string,
 *              FAVICON_192x192:string,
 *              RENDER_FILES:config_apps_render_files[]}} config_apps_render_config
 * @typedef  {[string, string, string, string]} config_apps_modules
 * @typedef  {'ONLINE'|'OFFLINE'} config_apps_status
 * @typedef  {[string,string|null,string|null,string, string|null]} config_apps_render_files
 * @typedef  {object} config_apps_record
 * @property {function} filter
 * @property {function} reduce
 * @property {function} concat
 * @property {number} APP_ID
 * @property {string} NAME
 * @property {string} SUBDOMAIN
 * @property {string} PATH
 * @property {string} LOGO
 * @property {string} SHOWPARAM
 * @property {config_apps_secrets} SECRETS
 * @property {config_apps_parameters} [PARAMETERS]
 * @property {config_apps_render_config} [RENDER_CONFIG]
 * @property {config_apps_modules[]} MODULES
 * @property {config_apps_status} STATUS
 * @typedef  {object} config_apps_with_db_columns
 * @property {number} APP_ID
 * @property {string} NAME
 * @property {string} SUBDOMAIN
 * @property {string} PATH
 * @property {string} LOGO
 * @property {string} SHOWPARAM
 * @property {string} CLIENT_ID
 * @property {config_apps_status} STATUS
 * @property {string} APP_NAME_TRANSLATION
 * @property {string} APP_CATEGORY
 * @property {string} PROTOCOL
 * @property {string|null} HOST
 * @property {number|null} PORT
 * 
 * @typedef  {object} config_apps_admin_with_db_columns
 * @property {number} ID
 * @property {string} NAME
 * @property {string} SUBDOMAIN
 * @property {string} PATH
 * @property {string} LOGO
 * @property {string} SHOWPARAM
 * @property {string} CLIENT_ID
 * @property {config_apps_status} STATUS
 * @property {number} APP_CATEGORY_ID
 * @property {string} APP_CATEGORY_TEXT
 * @property {string} PROTOCOL
 * @property {string|null} HOST
 * @property {number|null} PORT
 *
 * @typedef {{['APPS']:config_apps_record[]}} config_apps
 * Server - Config IAM blockip
 * @typedef {[string,string][]} config_iam_blockip
 * Server - Config IAM policy
 * @typedef {{'content-security-policy':string}} config_iam_policy
 * Server - Config IAM user agent
 * @typedef {{ user_agent:[{Name:string, 
 *                          user_agent:string}]}} config_iam_useragent
 * Server - Config IAM user
 * @typedef {{  ['username']:string, 
 *              ['password']:string, 
 *              ['created']:string,
 *              ['modified']:string}} config_iam_user
 *
 *  Server - Config user parameter
 * @typedef {'username'|'password'|'created'|'modified'} config_user_parameter
 */

/**
 * Server - Socket client
 * @typedef {object} socket_connect_list
 * @property {number} id
 * @property {string} connection_date
 * @property {number} app_id
 * @property {string|null} authorization_bearer
 * @property {number|null} user_account_id
 * @property {string|null} token_access
 * @property {number|null} identity_provider_id
 * @property {string|null} system_admin
 * @property {string|null} token_systemadmin
 * @property {string} gps_latitude
 * @property {string} gps_longitude
 * @property {string} place
 * @property {string} timezone
 * @property {string} ip
 * @property {string} user_agent
 * @property {res}    response
 * 
 * Server - Socket client no res
 * @typedef {{  id:number,
 *              app_id:number,
 *              authorization_bearer:string|null,
 *              app_role_icon:number|string,
 *              app_role_id:number|string,
 *              user_account_id:number|null,
 *              identity_provider_id:number|null,
 *              system_admin:string|null,
 *              connection_date:string,
 *              gps_latitude:string,
 *              gps_longitude:string,
 *              place:string,
 *              timezone:string,
 *              ip:string,
 *              user_agent:string}} socket_connect_list_no_res
 * 
 * @typedef {'ALERT'|'MAINTENANCE'|'CHAT'|'PROGRESS'|'SESSION_EXPIRED'|'CONNECTINFO'|'APP_FUNCTION'} socket_broadcast_type_all
 * @typedef {'ALERT'|'CHAT'|'PROGRESS'} socket_broadcast_type_admin
 * Server Socket sort
 * @typedef {   'id'|
 *              'app_id'|
 *              'app_role_icon'|
 *              'app_role_id'|
 *              'user_account_id'|
 *              'identity_provider_id'|
 *              'system_admin'|
 *              'connection_date'|
 *              'gps_latitude'|
 *              'gps_longitude'|
 *              'ip'|
 *              'user_agent'|
 *              null} sort_socket
 */

/**
 * Server - db pool
 * @typedef {[1|2|3|4|5, object|null, [object|db_pool_4|null]|null]} db_pool
 * 
 * Server - db pool parameters
 * @typedef {object}        db_pool_parameters
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
 * @property {string|null}  fileName                - DB 5 SQLite
 * 
 * Server - db pool connection 1 + 2
 * @typedef {object}    db_pool_connection_1_2
 * @property {function} release
 * @property {function} query
 * @property {object}   config
 * @property {function} config.queryFormat
 * @property {function} escape
 * 
 * Server - db pool connection 1 + 2 result
 * @typedef {*}         db_pool_connection_1_2_result
 * 
 * Server - db pool connection 3
 * @typedef {object}    db_pool_connection_3
 * @property {function} release
 * @property {function} query
 * 
 * Server - db pool connection 3 result
 * @typedef {object}    db_pool_connection_3_result
 * @property {string}   command
 * @property {number}   insertId
 * @property {number}   affectedRows
 * @property {number}   rowCount
 * @property {[{dataTypeID:number, name:string}]}      fields
 * @property {[*]}      rows
 * 
 * Server - db pool connection 3 fields
 * @typedef {[{ type:number, 
 *              name:string}]}    db_pool_connection_3_fields
 * 
 * Server - db pool connection 4 result
 * @typedef {object}    db_pool_connection_4_result
 * @property {object}   outBinds
 * @property {[number]} outBinds.insertId
 * @property {string}   lastRowid
 * @property {number}   insertId
 * @property {number}   affectedRows
 * @property {number}   rowsAffected
 * @property {[*]}      rows
 * 
 * Server - db pool 4
 * @typedef {object|null}   db_pool_4
 * @property {string}       pool_id_app
 * 
 * Server - db file
 * 
 * @typedef {   'APPS'|
 *              'SERVER'|
 *              'IAM_BLOCKIP'|
 *              'IAM_POLICY'|
 *              'IAM_USER'|
 *              'IAM_USERAGENT'|
 *              'IAM_APP_TOKEN'|
 *              'IAM_SYSTEMADMIN_LOGIN'|
 *              'LOG_APP_INFO'|
 *              'LOG_APP_ERROR'|
 *              'LOG_DB_INFO'|
 *              'LOG_DB_ERROR'|
 *              'LOG_REQUEST_INFO'|
 *              'LOG_REQUEST_VERBOSE'|
 *              'LOG_REQUEST_ERROR'|
 *              'LOG_SERVER_INFO'|
 *              'LOG_SERVER_ERROR'|
 *              'LOG_SERVICE_INFO'|
 *              'LOG_SERVICE_ERROR'|
 *              'MICROSERVICE_CONFIG'|
 *              'MICROSERVICE_SERVICES'|
 *              'MESSAGE_QUEUE_PUBLISH'|
 *              'MESSAGE_QUEUE_CONSUME'|
 *              'MESSAGE_QUEUE_ERROR'} db_file_db_name
 * 
 * @typedef {{  NAME:db_file_db_name, 
 *              LOCK:number, 
 *              TRANSACTION_ID:number|null, 
 *              TRANSACTION_CONTENT: object|string|null, 
 *              PATH:string|null, 
 *              CACHE_CONTENT?:object|null }} db_file_db_record
 * 
 * @typedef {{  file_content:   *, 
 *              lock:           boolean, 
 *              transaction_id: number|null}} db_file_result_file_get
 * 
 * @typedef {{	app_id:				number,
 *		        result:				0|1,
 *   	        app_token:   	    string,
 *		        client_ip:          string,
 *		        client_user_agent:  string|null,
 *		        client_longitude:   string|null,
 *		        client_latitude:    string|null,
 *		        date_created:       string}} iam_app_token_record
 * @typedef {{	app_id:				number,
 *              username:           string,
 *              result:				0|1,
 *   	        systemadmin_token:  string,
 *		        client_ip:          string,
 *		        client_user_agent:  string|null,
 *		        client_longitude:   string|null,
 *		        client_latitude:    string|null,
 *		        date_created:       string}} iam_systemadmin_login_record
 */

/**
 * Server - admin install result
 * @typedef {[object]}  admin_db_install_result - Log variable with object with any key
 * 
 * Server - admin install db check
 * @typedef {object}  admin_db_install_db_check
 * @property {1|0}    installed
 * 
 * Server - admin install delete result
 * @typedef {object}  admin_db_install_delete_result
 * @property {[{count:number}, {count_fail:number}]}    info
 * 
 * Server - admin demo user
 * @typedef {object}    demo_user
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
 *              regional_column_title:              string,
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
 *              json_data:{},
 *              resource_detail:[{  app_data_resource_master_id:number,
 *                                  app_data_entity_resource_id: number,
 *                                  user_account_id:number|null,
 *                                  user_account_app_id:number|null,
 *                                  data_app_id:number,
 *                                  app_data_entity_resource_app_data_entity_id:number,
 *                                  app_data_resource_master_attribute_id:number|null,
 *                                  json_data:{},
 *                                  resource_detail_data:[{ app_data_resource_detail_id: number,
 *                                                          user_account_id:number|null,
 *                                                          user_account_app_id:number|null,
 *                                                          data_app_id:number,
 *                                                          app_data_resource_master_attribute_id:number,
 *                                                          json_data: {}}
 *                                                       ]}
 *                              ]}[]} resource_master
 * 
 * Server - admin install script files
 * @typedef {   [number|null,
 *              string, 
 *              number|null][]} database_script_files
 * 
 * Server - admin Install JSON
 * @typedef {object}        install_database_script
 * @property {number|null}  db                  -if null then execute in all databases
 * @property {string}       script
 * @property {number}       [optional]          -installs if optional=1
 * 
 * Server - admin Uninstall JSON
 * @typedef {object}        uninstall_database_script
 * @property {number|null}  db
 * @property {string}       sql
 * 
 * Server - admin Install JSON app
 * @typedef {object}        install_database_app_script
 * @property {number|null}  db
 * @property {string}       sql
 * 
 * Server - admin Install JSON app user
 * @typedef {object}        install_database_app_user_script
 * @property {number}       db
 * @property {string}       sql
 * 
 * Server - admin Uninstall JSON app
 * @typedef {object}        uninstall_database_app_script
 * @property {number|null}  db
 * @property {string}       sql
 * 
 * Server - Log parameters
 * @typedef{object}         admin_log_parameters
 * @property{string}        SERVICE_LOG_SCOPE_REQUEST
 * @property{string}        SERVICE_LOG_SCOPE_SERVER
 * @property{string}        SERVICE_LOG_SCOPE_SERVICE
 * @property{string}        SERVICE_LOG_SCOPE_APP
 * @property{string}        SERVICE_LOG_SCOPE_DB
 * @property{string}        SERVICE_LOG_REQUEST_LEVEL
 * @property{string}        SERVICE_LOG_SERVICE_LEVEL
 * @property{string}        SERVICE_LOG_DB_LEVEL
 * @property{string}        SERVICE_LOG_LEVEL_VERBOSE
 * @property{string}        SERVICE_LOG_LEVEL_ERROR
 * @property{string}        SERVICE_LOG_LEVEL_INFO
 * @property{string}        SERVICE_LOG_FILE_INTERVAL
 * 
 * Server - Log data parameter 
 * @typedef{object}         admin_log_data_parameters
 * @property {number}       app_id
 * @property {number|null}  select_app_id
 * @property {string}       logscope
 * @property {string}       loglevel
 * @property {string}       search
 * @property {string|null}  sort
 * @property {string}       order_by
 * @property {string}       year
 * @property {string}       month
 * @property {string}       day
 *
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
 *              logtext:string}} server_log_request_record
 * 
 * Server - log parameters get log stats
 * @typedef {object}                log_parameter_getLogStats
 * @property {number|null}          app_id
 * @property {server_log_request_record_keys} statGroup
 * @property {number|null}          unique
 * @property {string|number|null}   statValue
 * @property {number}               year
 * @property {number}               month
 * 
 * Server - Log stats data
 * @typedef {object}                admin_log_stats_data
 * @property {number|null}          chart
 * @property {string|number|null}   statValue
 * @property {number}               year
 * @property {number}               month
 * @property {number|null}          day
 * @property {number|null}          amount
 * 
 * Server - Log files
 * @typedef {{id:number, filename:string}} admin_log_files
 */

/**
 * Server - DATABASE
 * DB query result
 * @typedef {   db_result_insert|db_result_delete|db_result_update|db_result_select}                db_query_result
 * @typedef {   {code:  string, errorNum:number, errno:number, message:string, db_message:string, stack:string, sqlMessage:string}}     db_query_result_error
 * DB result INSERT
 * @typedef {{  insertId:number, 
 *              rows:[], 
 *              affectedRows:number, 
 *              rowsAffected:number,
 *              length:number}}  db_result_insert
 * DB result DELETE
 * @typedef {{  rows:[], 
 *              affectedRows:number, 
 *              rowsAffected:number,
 *              length:number}}  db_result_delete
 * DB result UPDATE
 * @typedef {{  rows:[], 
 *              affectedRows:number, 
 *              rowsAffected:number,
 *              length:number}}  db_result_update
 * DB result SELECT
 * @typedef {{  rows:[], 
 *              affectedRows:number,
 *              rowsAffected:number,
 *              page_header : {	total_count:	number,
 *                              offset: 		number,
 *                              count:			number},
 *              length:number}}  db_result_select
 * ADMIN
 * DB result DB Info
 * @typedef {{  database_use:   number,
 *              database_name:  string,
 *              version:        string,
 *              database_schema:string,
 *              hostname:       string,
 *              connections:    number,
 *              started:        string}} db_result_admin_DBInfo
 * DB result DB Info space
 * @typedef {{  table_name:     string,
 *              total_size:     number,
 *              data_used:      number,
 *              data_free:      number,
 *              pct_used:       number}} db_result_admin_DBInfoSpace
 * DB result DB Info space sum
 * @typedef {{  total_size:     number,
 *              data_used:      number,
 *              data_free:      number,
 *              pct_used:       number}} db_result_admin_DBInfoSpaceSum
 * 
 * Syntax typedef parameters and result
 * parameter:
 *  db_parameter_[TABLE]_[function name]
 * result:
 *  db_result_[TABLE]_[function name]
 * APP
 * @typedef {{  app_category_id:number|null}} db_parameter_app_updateAppAdmin
 * @typedef {{  id:number, 
 *              app_translation:string, 
 *              app_category:string}} db_result_app_getApp
 * @typedef {{  id:number, 
 *              app_category_id:number, 
 *              app_category_text:string}} db_result_app_getAppsAdmin
 * @typedef {{  id:number}} db_result_app_getAppsAdminId
 * @typedef {   db_result_update} db_result_app_updateAppAdmin
 * APP CATEGORY
 * @typedef {{id:number, category_name:string, app_category_text:string}} db_result_app_category_getAppCategoryAdmin
 * 
 * APP_DATA_ENTITY
 * @typedef {{id:number, app_id:number, json_data:string}} db_result_app_data_entity_get
 * APP_DATA_ENTITY_RESOURCE
 * @typedef {{  id:number, 
 *              json_data:string, 
 *              app_setting_id:number, 
 *              app_data_entity_app_id:number, 
 *              app_data_entity_id:number, 
 *              app_setting_type_app_setting_type_name:string, 
 *              app_setting_value:string, 
 *              app_setting_display_data:string}} db_result_app_data_entity_resource_get
 * APP_DATA_RESOURCE_MASTER
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
 *              resource_metadata:string}} db_result_app_data_resource_master_get
 * @typedef {db_result_insert} db_result_app_data_resource_master_post
 * @typedef {db_result_update} db_result_app_data_resource_master_update
 * @typedef {db_result_delete} db_result_app_data_resource_master_delete
 * APP_DATA_RESOURCE_DETAIL
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
 *              resource_metadata:string}} db_result_app_data_resource_detail_get
 * @typedef {db_result_insert} db_result_app_data_resource_detail_post
 * @typedef {db_result_update} db_result_app_data_resource_detail_update
 * @typedef {db_result_delete} db_result_app_data_resource_detail_delete
 * APP_DATA_RESOURCE_DETAIL_DATA
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
 *              app_setting_display_data:string}} db_result_app_data_resource_detail_data_get
 * @typedef {db_result_insert} db_result_app_data_resource_detail_data_post
 * @typedef {db_result_update} db_result_app_data_resource_detail_data_update
 * @typedef {db_result_delete} db_result_app_data_resource_detail_data_delete
 * APP_DATA_STAT
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
 *              app_data_entity_resource_app_data_entity_id:                                number}} db_result_app_data_stat_get
 * @typedef {{  json_data:                                          object,
 *              app_id:                                             number|null,
 *              user_account_id:                                    number|null,
 *              user_account_app_user_account_id:                   number|null,
 *              user_account_app_app_id:                            number|null,
 *              app_data_resource_master_id:                        number|null,
 *              app_data_entity_resource_id:                        number,
 *              app_data_entity_resource_app_data_entity_app_id:    number,
 *              app_data_entity_resource_app_data_entity_id:        number}} db_parameter_app_data_stat_post
 * @typedef {db_result_insert} db_result_app_data_stat_post
 * @typedef {{  app_module:string,
 *              app_module_type : string,
 *              app_module_request : string|null,
 *              app_module_result : string,
 *              app_user_id : null,
 *              user_language : string,
 *              user_timezone : string,
 *              user_number_system : null,
 *              user_platform : null,
 *              server_remote_addr : string,
 *              server_user_agent : string,
 *              server_http_host : string,
 *              server_http_accept_language : string,
 *              client_latitude : string,
 *              client_longitude : string}} db_parameter_app_data_stat_createLog
 * @typedef {{  id:number,
 *              app_id:number,
 *              json_data:string,
 *              date_created:string,
 *              total_rows:number}} db_result_app_data_stat_getLogs
 * @typedef {{  chart:number, 
 *              app_id:number, 
 *              year:number, 
 *              month:number, 
 *              day:number, 
 *              json_data:string}} db_result_app_data_stat_getStatUniqueVisitor
 * APP OBJECTS
 * @typedef {{  object:string, 
 *              app_id:number, 
 *              object_name:string, 
 *              object_item_name:string, 
 *              subitem_name:string,
 *              lang_code:string,
 *              id:number,
 *              text:string}} db_result_app_object_getObjects
 * APP ROLE
 * @typedef {{  id:number, 
 *              role_nae:string, 
 *              icon:string}} db_result_app_role_getAppRoleAdmin
 * APP SETTING
 * @typedef {{  id:string,
 *              app_id:number, 
 *              app_setting_type_name:string,
 *              value:string, 
 *              data2:string|null, 
 *              data3:string|null, 
 *              data4:string|null, 
 *              data5:string|null,
 *              text:string}} db_result_app_setting_getSettings
 * 
 * @typedef {{  id:string,
 *              value:string, 
 *              name:null, 
 *              display_data: string, 
 *              data2:string|null, 
 *              data3:string|null, 
 *              data4:string|null, 
 *              data5:string|null}} db_result_app_setting_getSettingDisplayData
 * 
 * COUNTRY
 * @typedef {{  id:string, 
 *              group_name:string, 
 *              country_code:string, 
 *              flag_emoji:string, 
 *              text:string}} db_result_country_getCountries
 * IDENTITY PROVIDER
 * @typedef {{  id:string, 
 *              provider_name:string}} db_result_identity_provider_getIdentityProviders
 * LOCALE
 * @typedef {{  locale: string, text:string}} db_result_locale_getLocales
 * 
 * USER ACCOUNT
 * @typedef {{  id:number,
 *              avatar:string,
 *              app_role_id:number,
 *              app_role_icon:string,
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
 *              total_rows:number}}  db_result_user_account_getUsersAdmin
 * @typedef {{  app_role_id:number}} db_result_user_account_getUserAppRoleAdmin
 * @typedef {{  identity_provider_id:number,
 *              provider_name:string,
 *              count_user:number}} db_result_user_account_getStatCountAdmin
 * @typedef {{  app_role_id:number|null,
 *              active:number|null,
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
 *              admin:number}} db_parameter_user_account_updateUserSuperAdmin
 * @typedef {   db_result_update} db_result_user_account_updateUserSuperAdmin
 * @typedef {{  bio:string|null,
 *              private: number|null,
 *              user_level:number|null,
 *              username:string|null,
 *              password:null,
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
 *              admin:number}} db_parameter_user_account_create
 * @typedef {   db_result_insert} db_result_user_account_create
 * @typedef {   db_result_update} db_result_user_account_activateUser
 * @typedef {   db_result_update} db_result_user_account_updateUserVerificationCode
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
 *              date_modified:string}} db_result_user_account_getUserByUserId
 * @typedef {{  id:number,
 *              bio:string|null,
 *              private:number|null,
 *              friends:number|null,
 *              user_level:string,
 *              date_created:string,
 *              username:string, 
 *              avatar:string,
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
 *              liked:number}} db_result_user_account_getProfileUser
 * @typedef {{  detail:string,
 *              id:number,
 *              provider_id:string,
 *              avatar:string,
 *              provider_image:string,
 *              provider_image_url:string,
 *              username:string,
 *              provider_first_name:string,
 *              total_rows:number}} db_result_user_account_getProfileDetail
 * @typedef {{  top:string,
 *              id:number,
 *              identity_provider_id:number|null,
 *              provider_id:string|null,
 *              avatar:string,
 *              provider_image:string|null,
 *              provider_image_url:string|null,
 *              username:string,
 *              provider_first_name:string|null,
 *              total_rows:number}} db_result_user_account_getProfileStat
 * @typedef {{  password:string}} db_result_user_account_checkPassword
 * @typedef {{  password_new:string|null,
 *              auth:string|null}} db_parameter_user_account_updatePassword
 * @typedef {   db_result_update} db_result_user_account_updatePassword
 * @typedef {{  bio:string,
 *              private:number,
 *              username:string,
 *              password:string|null, 
 *              password_new:string|null,
 *              password_reminder:string|null,
 *              email:string,
 *              email_unverified:string|null,
 *              avatar:string,
 *              verification_code:string|null,
 *              provider_id:string|null,
 *              admin:number}} db_parameter_user_account_updateUserLocal
 * @typedef {   db_result_update} db_result_user_account_updateUserLocal
 * @typedef {{  bio:string|null,
 *              private: number|null,
 *              username:string|null}} db_parameter_user_account_updateUserCommon
 * @typedef {   db_result_update} db_result_user_account_updateUserCommon
 * @typedef {   db_result_delete} db_result_user_account_deleteUser
 * @typedef {{  username:string}} db_parameter_user_account_userLogin
 * @typedef {{  id:number,
 *              bio:string|null,
 *              username:string,
 *              password:string,
 *              email:string,
 *              active:number,
 *              avatar:string,
 *              app_role_id:number}} db_result_user_account_userLogin
 * @typedef {   db_result_update} db_result_user_account_updateSigninProvider
 * @typedef {{  id:number,
 *              bio:string|null,
 *              username:string, 
 *              password:string, 
 *              password_reminder:string, 
 *              email:string, 
 *              avatar:string,
 *              verification_code:string, 
 *              active:number, 
 *              identity_provider_id:number|null,
 *              provider_id:string|null,
 *              provider_first_name:string|null,
 *              provider_last_name:string|null,
 *              provider_image:string|null,
 *              provider_image_url:string|null,
 *              provider_image_email:string|null,
 *              app_role_id:number,
 *              date_created:string
 *              date_modified:string}} db_result_user_account_providerSignIn
 * @typedef {{  id:number,
 *              email:string}} db_result_user_account_getEmailUser
 * @typedef {{  app_role_id:number,
 *              icon:string}} db_result_user_account_getUserRoleAdmin
 * @typedef {{  id:number, username:string}} db_result_user_account_getDemousers 
 * USER ACCOUNT APP
 * @typedef {   db_result_insert} db_result_user_account_app_createUserAccountApp
 * @typedef {{  app_id:number,
 *              date_created:string}} db_result_user_account_app_getUserAccountApps
 * @typedef {{  app_id:number,
 *              APP_ID:number,
 *              NAME:string,
 *              PROTOCOL:string,
 *              SUBDOMAIN:string,
 *              HOST:string|null,
 *              PORT:number|null,
 *              LOGO:string,
 *              date_created:string}} db_result_user_account_app_getUserAccountApps_with_app_registry
 * @typedef {{  preference_locale:string,
 *              app_setting_preference_timezone_id:number,
 *              app_setting_preference_direction_id:number,
 *              app_setting_preference_arabic_script_id:number,
 *              date_created:string}} db_result_user_account_app_getUserAccountApp
 * @typedef {{  preference_locale:string,
 *              app_setting_preference_timezone_id:number|null,
 *              app_setting_preference_direction_id:number|null,
 *              app_setting_preference_arabic_script_id:number|null}} db_parameter_user_account_app_updateUserAccountApp
 * @typedef {   db_result_update} db_result_user_account_app_updateUserAccountApp
 * @typedef {   db_result_delete} db_result_user_account_app_deleteUserAccountApp
 * USER ACCOUNT APP DATA POST
 * @typedef {{  description:string,
 *              json_data:object,
 *              user_account_id:number|null}} db_parameter_user_account_app_data_post_createUserPost
 * @typedef {   db_result_insert} db_result_user_account_app_data_post_createUserPost
 * @typedef {{  id:number,
 *              description:string,
 *              json_data:string,
 *              date_created:string,
 *              date_modified:string,
 *              user_account_app_user_account_id:number,
 *              user_account_app_id: number}} db_result_user_account_app_data_post_getUserPost
 * @typedef {{  id:number, 
 *              description:string, 
 *              json_data:string, 
 *              date_created:string, 
 *              date_modified:string, 
 *              user_account_app_user_account_id:number, 
 *              user_account_app_app_id:number}} db_result_user_account_app_data_post_getUserPostsByUserId
 * @typedef {{  count_user_account_app_data_post_likes:number,
 *              count_user_account_app_data_post_liked:number}} db_result_user_account_data_post_getProfileStatLike
 * @typedef {{  id:number,
 *              description:string,
 *              user_account_app_user_account_id:number,
 *              json_data:string,
 *              count_likes:number,
 *              count_views:number,
 *              liked:number}} db_result_user_account_app_data_post_getProfileUserPosts
 * @typedef {{  detail:string,
 *              id:number,
 *              identity_provider_id:number,
 *              provider_id:string,
 *              avatar:string,
 *              provider_image:string,
 *              provider_image_url:string,
 *              username:string,
 *              provider_first_name:string,
 *              total_rows:number}} db_result_user_account_app_data_post_getProfileUserPostDetail
 * @typedef {{  top:string,
 *              id:number,
 *              iidentity_provider_id:number,
 *              provider_id:string,
 *              avatar:string,
 *              provider_image:string,
 *              provider_image_url:string,
 *              username:string,
 *              provider_first_name:string,
 *              count:number,
 *              total_rows:number}} db_result_user_account_app_data_post_getProfileStatPost
 * @typedef {{  description:string,
 *              json_data:object,
 *              user_account_id:number|null}} db_parameter_user_account_app_data_post_updateUserPost
 * @typedef {   db_result_update} db_result_user_account_app_data_post_updateUserPost
 * @typedef {   db_result_delete} db_result_user_account_app_data_post_deleteUserPost
 * USER ACCOUNT APP DATA POST LIKE
 * @typedef {   db_result_insert} db_result_user_account_app_data_post_like_like
 * @typedef {   db_result_delete} db_result_user_account_app_data_post_like_unlike
 * USER ACCOUNT APP DATA POST VIEW
 * @typedef {{  client_ip:string|null,
 *              client_user_agent:string|null,
 *              client_longitude:string|null,
 *              client_latitude:string|null,
 *              user_account_id:number|null,
 *              user_account_app_data_post_id:number|null}} db_parameter_user_account_app_data_post_view_insertUserPostView
 * @typedef {   db_result_insert} db_result_user_account_app_data_post_view_insertUserPostView
 * USER ACCOUNT EVENT
 * @typedef {{  user_account_id:number,
 *              user_language:string,
 *              user_timezone:string,
 *              user_number_system:string,
 *              user_platform:string,
 *              client_latitude:string,
 *              client_longitude:string,
 *              server_remote_addr:string,
 *              server_user_agent:string,
 *              server_http_host:string,
 *              server_http_accept_language:string,
 *              event:string,
 *              event_status:string}} db_parameter_user_account_event_insertUserEvent
 * @typedef {   db_result_insert} db_result_user_account_event_insertUserEvent
 * @typedef {{  user_account_id:number,
 *              event_id:number,
 *              event_name:string,
 *              event_status_id:number,
 *              status_name:string,
 *              date_created:string,
 *              date_modified:string,
 *              current_timestamp:string}} db_result_user_account_event_getLastUserEvent
 * USER ACCOUNT FOLLOW
 * @typedef {   db_result_insert} db_result_user_account_follow_follow
 * @typedef {   db_result_delete} db_result_user_account_follow_unfollow
 * USER ACCOUNT LIKE
 * @typedef {   db_result_insert} db_result_user_account_like_like
 * @typedef {   db_result_delete} db_result_user_account_like_unlike
 * USER ACCOUNT LOGON
 * @typedef {{  user_account_id:number,
 *              app_id:number,
 *              json_data:string,
 *              date_created:string}} db_result_user_account_logon_getUserAccountLogon
 * @typedef {{  json_data:string}} db_result_user_account_logon_Checklogin
 * @typedef {{  access_token:string|null,
 *              result:number,
 *              client_ip:string,
 *              client_user_agent:string,
 *              client_longitude:string,
 *              client_latitude:string}} db_parameter_user_account_logon_insertUserAccountLogon
 * @typedef {   db_result_insert} db_result_user_account_logon_insertUserAccountLogon
 * USER ACCOUNT VIEW
 * @typedef {{  user_account_id:number|null,
 *              user_account_id_view:number,
 *              client_ip:string|null,
 *              client_user_agent:string|null,
 *              client_longitude:string|null,
 *              client_latitude:string|null}} db_parameter_user_account_view_insertUserAccountView
 * @typedef {   db_result_insert} db_result_user_account_view_insertUserAccountView
 */

/**
 * MicroService - Request
 * @typedef {object}        req_microservice
 * @property {string}       url
 * @property {string}       method
 * 
 * @property {{ authorization:string,
 *              'accept-language':string}}       headers
 * 
 * @property {object}       query
 * @property {number|null}  query.app_id
 * @property {*}    query.data
 * 
 * @typedef  {object}       microservice_data_geolocation
 * @property {string}       latitude
 * @property {string}       longitude
 * @property {string|null}  ip
 * 
 * @typedef  {object}       microservice_data_worldcities
 * @property {number}       limit
 * @property {string}       search
 * @property {string}       country
 * 
 * @typedef  {{
 *              email_host:         string,
 *              email_port:         number,
 *              email_secure:       boolean,
 *              email_auth_user:    string,
 *              email_auth_pass:    string,
 *              from:               string,
 *              to:                 string,
 *              subject:            string,
 *              html:               string
 *              }}       microservice_data_mail
 * 
 * MicroService Config
 * @typedef {{  PATH_DATA                                   : string,
 *              PATH_TEMP                                   : string,
 *              MESSAGE_QUEUE_ERROR                         : string,
 *              MESSAGE_QUEUE_PUBLISH                       : string,
 *              MESSAGE_QUEUE_CONSUME                       : string,
 *              CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS     : number,
 *              CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS       : number
 *              CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS       : number
 *              CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES : number}|null} microservice_config
 * Microservice Config services
 * @typedef {'NAME'|'HOST'|'PORT'|'HTTPS_ENABLE'|'HTTPS_KEYS'|'HTTPS_CERT'|'HTTPS_SSL_VERIFICATION'|
 *           'HTTPS_SSL_VERIFICATION_PATH'|'HTTPS_PORT'|'STATUS'|'PATH'|'CONFIG'} microservice_config_service_keys
 * 
 * @typedef {{NAME:string, 
 *            HOST:number, 
 *            PORT:number,
 *            HTTPS_ENABLE:number,
 *            HTTPS_KEY:string,
 *            HTTPS_CERT:string,
 *            HTTPS_SSL_VERIFICATION:number,
 *            HTTPS_SSL_VERIFICATION_PATH:string,
 *            HTTPS_PORT:number,
 *            STATUS: string,
 *            PATH:string,
 *            CONFIG:[*]}} microservice_config_service_record
 * 
 * @typedef {{['SERVICES']:microservice_config_service_record[]}} microservice_config_service
 * 
 * MicroService - Response
 * @typedef {object}    res_microservice
 * @property {function} setHeader
 * @property {function} setEncoding
 * @property {number}   statusCode
 * @property {function} write
 * @property {function} end
 * @property {function} send
 * 
 * @property {object}   headers
 * @property {string}   headers.location
 * 
 * MicroService - message queue
 * @typedef {{  message_id:string,
 *              service:string,
 *              message:object|null}}  microservice_message_queue_publish
 * @typedef {{  message_id:string|null,
 *              service:string|null,
 *              message:*|null,
 *              start:string|null,
 *              finished:string|null,
 *              result:*}}  microservice_message_queue_consume
 * @typedef {{  message_id:string,
 *              service:string,
 *              message:object,
 *              start:string,
 *              result:*}}  microservice_message_queue_error
 */
export {};