/**
 * Request
 * @typedef {Object} req
 * @property {object} params
 * @property {number} params.user_account_id                        - Admin parameter
 * @property {string} params.info                                   - Info parameter
 * @property {string} params.sub                                    - App showparam parameter
 * @property {object} body
 * @property {string} body.value                                    - Server parameter
 * @property {string} body.config_no                                - Server parameter
 * @property {config} body.config_json                              - Server parameter
 * @property {number} body.app_id
 * @property {number} body.client_id                                - Broadcast parameter
 * @property {number} body.client_id_current                        - Broadcast parameter
 * @property {string} body.broadcast_type                           - Broadcast parameter
 * @property {string} body.broadcast_message                        - Broadcast parameter
 * @property {string} body.demo_password                            - Admin parameter
 * @property {string} baseUrl
 * @property {string} hostname
 * @property {string} path
 * @property {string} originalUrl
 * @property {string} ip
 * @property {string} method
 * @property {function} get
 * @property {string} protocol
 * @property {string} httpVersion
 * @property {object} params
 * @property {string} params.sub
 * @property {string} params.info
 * 
 * @property {object} query
 * @property {(string|number|*)} query.id
 * @property {(string|number|*)} query.app_id
 * @property {number} query.select_app_id                           - Admin parameter
 * @property {number} query.year                                    - Admin parameter
 * @property {number} query.month                                   - Admin parameter
 * @property {number} query.limit                                   - Admin parameter
 * @property {string} query.order_by                                - Admin parameter
 * @property {sort_broadcast} query.sort                            - Admin parameter
 * @property {string} query.count_logged_in                         - Admin parameter
 * @property {number} query.optional                                - Admin parameter
 * @property {(string|number|*)} query.app_user_id
 * @property {(string|number|*)} query.client_id
 * @property {(string|number|*)} query.user_account_id
 * @property {(string|number|*)} query.user_account_logon_user_account_id
 * @property {string} query.lang_code
 * @property {string} query.authorization                           - EventSource parameter
 * @property {string} query.latitude                                - Broadcast and geolocation parameter
 * @property {string} query.longitude                               - Broadcast and geolocation parameter
 * @property {string} query.reportid                                - Report parameter
 * @property {string} query.service                                 - Report parameter
 * @property {string} query.messagequeue                            - Report parameter
 * @property {string} query.ps                                      - Report parameter
 * @property {boolean} query.hf                                     - Report parameter
 * @property {number|null} query.uid_view                           - Report parameter
 * @property {string|*} query.service
 * @property {string|*} query.parameters
 * @property {string} query.parameter                               - Server parameter
 * @property {number|null} query.system_admin
 * @property {string} query.identity_provider_id
 * @property {0|1|2|3|4|5|6|7} query.config_type_no - Server parameter
 * @property {  'SERVER'|
 *              'SERVICE_AUTH'|
 *              'SERVICE_BROADCAST'|
 *              'SERVICE_DB'|
 *              'SERVICE_LOG'} query.config_group                   - Server parameter
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
 * @property {object} socket
 * @property {string} socket.bytesRead
 * @property {string} socket.bytesWritten
 */
/**
 * Request id
 * @typedef {string|number|null|undefined} req_id_number
 */
/**
 * Request app params
 * @typedef {Object} req_app_parameters
 * @property {string} ip
 * @property {string} method
 * @property {string} headers_user_agent
 * @property {string} headers_accept_language
 * @property {string} headers_host
 * @property {object} body
 */
/**
 * Request report params
 * @typedef {Object}        req_report_parameters
 * @property {string}       reportid
 * @property {string}       messagequeue
 * @property {string}       ps
 * @property {boolean}      hf
 * @property {number|null}  uid_view
 * @property {string}       protocol
 * @property {string}       ip
 * @property {string}       method
 * @property {string}       headers_user_agent
 * @property {string}       headers_accept_language
 * @property {string}       headers_host
 * @property {string}       url
 * @property {object}       body
 */
/**
 * Request log params
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
 */

/**
 * Response
 * @typedef {Object} res
 * @property {function} status
 * @property {number} statusCode
 * @property {(Error|string|number|null|object)} statusMessage
 * @property {function} type
 * @property {function} end
 * @property {function} send
 * @property {function} redirect 
 * @property {function} getHeader
 * @property {function} setHeader
 * @property {function} removeHeader
 * @property {function} on
 * @property {function} write
 * @property {function} flush           - Used for EventSource
 */
/**
 * Express
 * @typedef {object} express
 * @property {function} use
 * @property {function} get
 * @property {function} set
 * @property {function} route
 * @property {function} listen
 */
/**
 * Callback with error and result
 * @callback callBack
 * @param {(Error|string|number|null|unknown)} error
 * @param {(boolean|string|object|null|*)} result
 */
/**
 * Error stack
 * @typedef {string} error_stack
 */
/**
 * Error 
 * @typedef {Object.<Error | null , undefined>} error
 */

/**
 * Email param data
 * @typedef {object} email_param_data
 * @property {string} emailtype         - [1-4], 1=SIGNUP, 2=UNVERIFIED, 3=PASSWORD RESET (FORGOT), 4=CHANGE EMAIL
 * @property {string} host              
 * @property {string} app_user_id       
 * @property {string} verificationCode  
 * @property {string} to                - to email
 */

/**
 * Email return data
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
 */
/**
 * App config
 *
 * @typedef {object} app_config                  - app configuration
 * @property {string} locale                     - locale
 * @property {string} module_type                - module_type APP or REPORT
 * @property {boolean} map                       - return map styles and map header, true/false
 * @property {string} custom_tag_profile_search  - [custom tag]/null, optional custom app placement of component
 * @property {string} custom_tag_user_account    - [custom tag]/null, optional custom app placement of component
 * @property {string} custom_tag_profile_top     - [custom tag]/null, optional custom app placement of component
 * @property {boolean} app_themes                - render app themes, true/false
 * @property {boolean} render_locales            - render locales, true/false
 * @property {boolean} render_settings           - render settings, true/false
 * @property {boolean} render_provider_buttons   - render provider buttons, true/false
 */
/**
 * App info
 * @typedef {object} app_info               - app info
 * @property {number} app_id                - app id
 * @property {string} locale                - locale
 * @property {number} system_admin_only     - 0/1
 * @property {boolean|null} map             - map
 * @property {map_styles} map_styles        - map styles
 * @property {boolean|null} ui              - ui true/false app=true, report=false
 * @property {string} datatoken             - JW token
 * @property {string} latitude              - geodata latitude
 * @property {string} longitude             - geodata longitude
 * @property {string} place                 - geodata place
 * @property {string} module                - HTML
 */
/**
 * App module config info
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
 * @property {object} body              - request body
 */
/**
 * App render common info settings
 * @typedef {object} render_common_settings
 * @property {db_result_setting[]} settings - db result
 * @property {string} user_timezones        - HTML option format
 * @property {string} user_directions       - HTML option format
 * @property {string} user_arabic_scripts   - HTML option format
 * @property {map_styles} map_styles        - HTML option format                   - HTML option format
 */
/**
 * App render common items for apps with locales and settings
 * @typedef {object} render_common
 * @property {string} app                         - HTML
 * @property {string} locales                     - HTML option format
 * @property {render_common_settings} settings    
 */
/**
 * App common parameters
 * @typedef {object}        app_service_parameters
 * @property {number}       app_id
 * @property {string}       app_datatoken
 * @property {string|null}  countries
 * @property {map_styles}   map_styles
 * @property {string}       locale
 * @property {boolean|null} ui
 * @property {number}       system_admin_only
 * @property {string|null}  client_latitude
 * @property {string|null}  client_longitude
 * @property {string|null}  client_place
 * @property {number|null}  app_sound
 * @property {number|null}  common_app_id
 * @property {string}       rest_resource_server
 * @property {string}       rest_resource_bff
 * @property {number}       first_time
 */
/**
 * App create
 * @typedef {object} app_create
 * @property {string} app                         - HTML
 * @property {boolean} map     
 * @property {map_styles} map_styles
 */
/**
 * App create empty
 * @typedef {object} app_create_empty
 * @property {null} app                         - HTML
 * @property {null} map     
 * @property {null} map_styles
 */

/**
 * App request parameter
 * @typedef {string} app_parameter
 */
/**
 * App map styles
 * @typedef {object|null} map_styles
 * @property {string} id
 * @property {string} description
 * @property {string} data
 * @property {string} data2
 * @property {string} data3
 * @property {string} data4
 * @property {string|null} session_map_layer
 */
/**
 * Report query parameters
 * @typedef {object} report_query_parameters
 * @property {string} module
 * @property {string} ps
 * @property {number} hf
 * @property {string} format
 */

/**
 * Report create parameters
 * @typedef {object}        report_create_parameters
 * @property {string|null}  reportid
 * @property {number|null}  uid_view
 * @property {string|null}  reportname
 * @property {string}       ip
 * @property {string}       user_agent
 * @property {string}       accept_language
 * @property {string}       latitude
 * @property {string}       longitude
 * @property {string|null}  url
 */
/**
 * Info page data
 * @typedef {object} info_page_data
 * @property {string} app_name
 * @property {string} app_url
 * @property {string} info_email_policy
 * @property {string} info_email_disclaimer
 * @property {string} info_email_terms
 * @property {string} info_link_policy_url
 * @property {string} info_link_disclaimer_url
 * @property {string} info_link_terms_url
 * @property {string} info_link_about_url
 */
/**
 * Access control
 * @typedef {object} access_control
 * @property {number} statusCode
 * @property {string} statusMessage
 */
/**
 * Config init
 * @typedef {{  ['CONFIGURATION']:string, 
 *              ['CREATED']:string, 
 *              ['MODIFIED']:string,
 *              ['MAINTENANCE']:string,
 *              ['FILE_CONFIG_SERVER']:string,
 *              ['FILE_CONFIG_AUTH_BLOCKIP']:string,
 *              ['FILE_CONFIG_AUTH_USERAGENT']:string,
 *              ['FILE_CONFIG_AUTH_POLICY']:string,
 *              ['PATH_LOG']:string,
 *              ['FILE_CONFIG_AUTH_USER']:string,
 *              ['FILE_CONFIG_APPS']:string}} config_init
*/
/**
 * Config files
 * @typedef {[number, string]} config_files
 */
/**
 * Config init parameter
 * @typedef {   'CONFIGURATION'|
 *              'CREATED'|
 *              'MODIFIED'|
 *              'MAINTENANCE'|
 *              'FILE_CONFIG_SERVER'|
 *              'FILE_CONFIG_AUTH_BLOCKIP'|
 *              'FILE_CONFIG_AUTH_USERAGENT'|
 *              'FILE_CONFIG_AUTH_POLICY'|
 *              'PATH_LOG'|
 *              'FILE_CONFIG_AUTH_USER'|
 *              'FILE_CONFIG_APPS'} config_init_parameter
 */

/**
 * Config type no
 * @typedef {0|1|2|3|4|5|6|7} config_type_no
 */
/**
 * Config group
 * @typedef {'SERVER'|'SERVICE_AUTH'|'SERVICE_BROADCAST'|'SERVICE_DB'|'SERVICE_LOG'} config_group
 */

/**
 * Config
 * @typedef  {{ ['SERVER']:[{   HTTPS_KEY:string,
 *                              HTTPS_CERT:string,
 *                              PORT:string,
 *                              HTTPS_ENABLE:string,
 *                              HTTPS_PORT:string,
 *                              HTTPS_SSL_VERIFICATION:string,
 *                              HTTPS_SSL_VERIFICATION_PATH:string,
 *                              JSON_LIMIT:string,
 *                              TEST_SUBDOMAIN:string,
 *                              APP_START:string,
 *                              APP_SOUND:string,
 *                              APP_COMMON_APP_ID:string,
 *                              REST_RESOURCE_SERVER:string,
 *                              REST_RESOURCE_BFF:string,
 *                              REST_RESOURCE_SERVICE:string,
 *                              SERVICE_CIRCUITBREAKER_FAILURETHRESHOLD:string,
 *                              SERVICE_CIRCUITBREAKER_COOLDOWNPERIOD:string,
 *                              SERVICE_CIRCUITBREAKER_REQUESTTIMEOUT:string,
 *                              SERVICE_CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN:string}], 
 *              ['SERVICE_AUTH']:[{ ACCESS_CONTROL_ENABLE:string,
 *                                  ACCESS_CONTROL_IP:string,
 *                                  ACCESS_CONTROL_HOST_EXIST:string,
 *                                  ACCESS_CONTROL_ACCESS_FROM:string,
 *                                  ACCESS_CONTROL_USER_AGENT:string,
 *                                  ACCESS_CONTROL_USER_AGENT_EXIST:string,
 *                                  ACCESS_CONTROL_ACCEPT_LANGUAGE:string,
 *                                  ADMIN_TOKEN_EXPIRE_ACCESS:string,
 *                                  ADMIN_TOKEN_SECRET:string,
 *                                  ENABLE_CONTENT_SECURITY_POLICY:string,
 *                                  ENABLE_GEOLOCATION:string,
 *                                  ENABLE_USER_REGISTRATION:string,
 *                                  ENABLE_USER_LOGIN:string,
 *                                  ENABLE_DBLOG:string}],
 *              ['SERVICE_BROADCAST']:[{CHECK_INTERVAL:string}],
 *              ['SERVICE_DB']:[{   START:string,
 *                                  REST_RESOURCE_SCHEMA:string,
 *                                  USE:string,
 *                                  LIMIT_LIST_SEARCH:string,
 *                                  LIMIT_PROFILE_TOP:string,
 *                                  DB1_SYSTEM_ADMIN_USER:string,
 *                                  DB1_SYSTEM_ADMIN_PASS:string,
 *                                  DB1_APP_ADMIN_USER:string,
 *                                  DB1_APP_ADMIN_PASS:string,
 *                                  DB1_PORT:string,
 *                                  DB1_HOST:string,
 *                                  DB1_NAME:string,
 *                                  DB1_CHARACTERSET:string,
 *                                  DB1_CONNECTION_LIMIT:string,
 *                                  DB2_SYSTEM_ADMIN_USER:string,
 *                                  DB2_SYSTEM_ADMIN_PASS:string,
 *                                  DB2_APP_ADMIN_USER:string,
 *                                  DB2_APP_ADMIN_PASS:string,
 *                                  DB2_PORT:string,
 *                                  DB2_HOST:string,
 *                                  DB2_NAME:string,
 *                                  DB2_CHARACTERSET:string,
 *                                  DB2_CONNECTION_LIMIT:string,
 *                                  DB3_SYSTEM_ADMIN_USER:string,
 *                                  DB3_SYSTEM_ADMIN_PASS:string,
 *                                  DB3_APP_ADMIN_USER:string,
 *                                  DB3_APP_ADMIN_PASS:string,
 *                                  DB3_PORT:string,
 *                                  DB3_HOST:string,
 *                                  DB3_NAME:string,
 *                                  DB3_TIMEOUT_CONNECTION:string,
 *                                  DB3_TIMEOUT_IDLE:string,
 *                                  DB3_MAX:string,
 *                                  DB4_SYSTEM_ADMIN_USER:string,
 *                                  DB4_SYSTEM_ADMIN_PASS:string,
 *                                  DB4_APP_ADMIN_USER:string,
 *                                  DB4_APP_ADMIN_PASS:string,
 *                                  DB4_HOST:string,
 *                                  DB4_NAME:string,
 *                                  DB4_CONNECT_STRING:string,
 *                                  DB4_POOL_MIN:string,
 *                                  DB4_POOL_MAX:string,
 *                                  DB4_POOL_INCREMENT:string,
 *                                  DB4_LIBDIR:string,
 *                                  DB4_CONFIGDIR:string}],
 *              ['SERVICE_LOG']:[{  SCOPE_REQUEST:string,
 *                                  SCOPE_SERVER:string,
 *                                  SCOPE_APP:string,
 *                                  SCOPE_SERVICE:string,
 *                                  SCOPE_DB:string,
 *                                  ENABLE_REQUEST_INFO:string,
 *                                  ENABLE_REQUEST_VERBOSE:string,
 *                                  ENABLE_DB:string,
 *                                  ENABLE_SERVICE:string,
 *                                  LEVEL_VERBOSE:string,
 *                                  LEVEL_ERROR:string,
 *                                  LEVEL_INFO:string,
 *                                  FILE_INTERVAL:string,
 *                                  DATE_FORMAT:string}],
 *              ['APPS']:[{ CLIENT_ID:string, 
 *                          CLIENT_SECRET:string, 
 *                          DATA_SECRET:string, 
 *                          ACCESS_SECRET:string}],
 *              ['configuration']:string,
 *              ['comment']:string,
 *              ['created']:string,
 *              ['modified']:string,
 *              ['content-security-policy']:string}} config
 */
/**
 * Config apps
 * @typedef  {object} config_apps
 * @property {function} filter
 * @property {function} reduce
 * @property {function} concat
 * @property {number} APP_ID
 * @property {string} SUBDOMAIN
 * @property {string} PATH
 * @property {string} ENDPOINT
 * @property {string} SHOWINFO
 * @property {string} SHOWPARAM
 * @property {string} [CLIENT_ID]
 * @property {string} [CLIENT_SECRET]
 * @property {string} [DATA_SECRET]
 * @property {string} [DATA_EXPIRE]
 * @property {string} [ACCESS_SECRET]
 * @property {string} [ACCESS_EXPIRE]
 */
/**
 * Config user
 * @typedef {{  ['username']:string, 
 *              ['password']:string, 
 *              ['created']:string,
 *              ['modified']:string}} config_user
 */
/**
 * Config user parameter
 * @typedef {'username'|'password'|'created'|'modified'} config_user_parameter
 */

/**
 * Broadcast client
 * @typedef {object} broadcast_connect_list
 * @property {number} id
 * @property {number} app_id
 * @property {number} user_account_id
 * @property {string} identity_provider_id
 * @property {number} system_admin
 * @property {string} connection_date
 * @property {string} gps_latitude
 * @property {string} gps_longitude
 * @property {string} ip
 * @property {string} user_agent
 * @property {res}    response
 */
/**
 * Broadcast client
 * @typedef {{  'id':number,
 *              'app_id':number,
 *              'app_role_icon':number|string,
 *              'app_role_id':number|string,
 *              'user_account_id':number,
 *              'identity_provider_id':string,
 *              'system_admin':number,
 *              'connection_date':string,
 *              'gps_latitude':string,
 *              'gps_longitude':string,
 *              'ip':string,
 *              'user_agent':string}} broadcast_connect_list_no_res
 */

/**
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
 *              null} sort_broadcast
 */

/**
 * @typedef {[number, object|null, [object|pool_4|null]|null]} pool_db
 */

/**
 * @typedef {object}        pool_parameters
 * @property {number}       use
 * @property {number|null}  pool_id
 * @property {number}       port
 * @property {string}       host
 * @property {number}       dba
 * @property {string}       user
 * @property {string}       password
 * @property {string}       database
 * @property {string}       charset                 - DB 1+2 MariaDB/MySQL
 * @property {number}       connectionLimit         - DB 1+2 MariaDB/MySQL
 * @property {number}       connectionTimeoutMillis - DB 3 PostgreSQL
 * @property {number}       idleTimeoutMillis       - DB 3 PostgreSQL
 * @property {number}       max                     - DB 3 PostgreSQL
 * @property {string}       connectString           - DB 4 Oracle
 * @property {number}       poolMin                 - DB 4 Oracle
 * @property {number}       poolMax                 - DB 4 Oracle
 * @property {number}       poolIncrement           - DB 4 Oracle
 */
/**
 * @typedef {object}    pool_connection_1_2
 * @property {function} release
 * @property {function} query
 * @property {object}   config
 * @property {function} config.queryFormat
 * @property {function} escape
 */
/**
 * @typedef {*}         pool_connection_1_2_result
 */

/**
 * @typedef {object}    pool_connection_3
 * @property {function} release
 * @property {function} query
 */
/**
 * @typedef {object}    pool_connection_3_result
 * @property {string}   command
 * @property {number}   insertId
 * @property {number}   affectedRows
 * @property {number}   rowCount
 * @property {[{dataTypeID:number, name:string}]}      fields
 * @property {[*]}      rows
 */
/**
 * @typedef {[{ type:number, 
 *              name:string}]}    pool_connection_3_fields
 */

/**
 * @typedef {object|null}   pool_4
 * @property {string}       pool_id_app
 */

/**
 * @typedef {[object]}  admin_db_install_result - Log variable with object with any key
 */
/**
 * @typedef {object}  admin_db_install_db_check
 * @property {1|0}    installed
 */
/**
 * @typedef {object}  admin_db_install_delete_result
 * @property {[{count:number}, {count_fail:number}]}    info
 */
/**
 * @typedef {object}    demo_user
 * @property {number}   [id]
 * @property {string}   username
 * @property {string}   bio
 * @property {string}   avatar
 * @property {[{
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
 *              gps_country_id:                     number|null,
 *              gps_city_id:                        number|null,
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
 *              }]}   settings
 * 
 */
/**
 * Install JSON
 * @typedef {object}        install_database_script
 * @property {number|null}  db
 * @property {string}       script
 * @property {number}       [optional]
 */
/**
 * Uninstall JSON
 * @typedef {object}        uninstall_database_script
 * @property {number|null}  db
 * @property {string}       sql
 */
/**
 * Install JSON app
 * @typedef {object}        install_database_app_script
 * @property {number|null}  db
 * @property {string}       sql
 */
/**
 * Install JSON app user
 * @typedef {object}        install_database_app_user_script
 * @property {number}       db
 * @property {string}       sql
 */
/**
 * Uninstall JSON app
 * @typedef {object}        uninstall_database_app_script
 * @property {number|null}  db
 * @property {string}       sql
 */


/**
 * INSERT:
 * DB result INSERT
 * @typedef {{insertId:number, rows:[], affectedRows:number, rowsAffected:number}}  db_result_insert
 * DELETE:
 * @typedef {{rows:[], affectedRows:number, rowsAffected:number}}                   db_result_delete
 * UPDATE:
 * @typedef {{rows:[], affectedRows:number, rowsAffected:number}}                   db_result_update
 * SELECT:
 * @typedef {{rows:[], affectedRows:number, rowsAffected:number}}                   db_result_select
 * DB result DB Info
 * @typedef {{  database_use:   number,
 *              database_name:  string,
 *              version:        string,
 *              database_schema:string,
 *              hostname:       string,
 *              connections:    number,
 *              started:        string}} db_result_DBInfo
 * DB result DB Info space
 * @typedef {{  table_name:     string,
 *              total_size:     number,
 *              data_used:      number,
 *              data_free:      number,
 *              pct_used:       number}} db_result_DBInfoSpace
 * DB result DB Info space sum
 * @typedef {{  total_size:     number,
 *              data_used:      number,
 *              data_free:      number,
 *              pct_used:       number}} db_result_DBInfoSpaceSum
 * DB result app
 * @typedef {{app_name:string, url:string}} db_result_app
 * DB result app_name 
 * @typedef {{app_name:string}} db_result_app_name
 * DB result app_objects
 * @typedef {{object_item_name:string, text:string}} db_result_app_object_item
 * DB result app_parameter
 * @typedef {{app_id: number, parameter_type_id:number, parameter_name:string, parameter_value :string, parameter_comment:string}} db_result_app_parameter
 * DB result getAppDBParametersAdmin
 * @typedef {{id: number, db_user:string, db_password:string}} db_result_getAppDBParametersAdmin
 * DB result country
 * @typedef {{id:string, group_name:string, country_code:string, flag_emoji:string, text:string}} db_result_country
 * DB result identity provider
 * @typedef {{id:string, provider_name:string}} db_result_identity_provider
 * DB result locale
 * @typedef {{locale: String, text:string}} db_result_locale
 * DB result parameter
 * @typedef {{parameter_name:string, parameter_value:string}} db_result_parameter
 * DB result setting
 * @typedef {{app_id:number, id:string, setting_type_name:string, text:string, data:string, data2:string|null, data3:string|null, data4:string|null, data5:string|null}} db_result_setting
 * DB result getUserSettingsByUserId
 * @typedef {{id:number, description:string, settings_json:string, date_created:string, date_modified:string, user_account_app_user_account_id:number, user_account_app_app_id:number}} db_result_getUserSettingsByUserId
 * USER:
 * DB result getDemousers
 * @typedef {{id:number}} db_result_getDemousers
 * DB result Checklogin
 * @typedef {{login:number}} db_result_Checklogin
 * DB result UserAppRoleAdmin
 * @typedef {{app_role_id:number}} db_result_UserAppRoleAdmin
 * DB result UserRoleAdmin
 * @typedef {{app_role_id:number, icon:string}} db_result_UserRoleAdmin
 * DB result ProfileUser
 * @typedef {{  id:string, bio:string, private:number|null, user_level:string, date_created:string, username:string, avatar:string, 
 *              identity_provider_id:string, provider_id:string, provider_first_name:string, provider_last_name:string, provider_image:string, provider_image_url:string,
 *              count_following:number, count_followed:number, count_likes:number, count_liked:number, count_views:number, followed:number, liked:number}} db_result_ProfileUser
 */
export {};