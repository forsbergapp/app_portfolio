/**
 * Request
 * @typedef {Object} req
 * @property {object} body
 * @property {string} body.value                        - Server parameter
 * @property {string} body.config_no                    - Server parameter
 * @property {string} body.config_json                  - Server parameter
 * @property {string} baseUrl
 * @property {string} hostname
 * @property {string} path
 * @property {string} originalUrl
 * @property {string} ip
 * @property {string} method
 * @property {function} get
 * @property {string} protocol
 * @property {{sub:string, info:string}} params
 * @property {object} query
 * @property {(string|number|*)} query.id
 * @property {(string|number|*)} query.app_id
 * @property {(string|number|*)} query.app_user_id
 * @property {(string|number|*)} query.client_id
 * @property {(string|number|*)} query.user_account_id
 * @property {(string|number|*)} query.user_account_logon_user_account_id
 * @property {string} query.lang_code
 * @property {string} query.reportid                    - Report parameter
 * @property {string} query.messagequeque               - Report parameter
 * @property {string} query.ps                          - Report parameter
 * @property {number} query.hf                          - Report parameter
 * @property {string|*} query.service
 * @property {string|*} query.parameters
 * @property {string} query.parameter                   - Server parameter
 * @property {string} query.system_admin
 * @property {string} query.identity_provider_id
 * @property {string} query.config_type_no              - Server parameter
 * @property {string} query.config_group                - Server parameter
 * 
 * @property {{ authorization: string, 
 *              'user-agent': string, 
 *              'accept-language': string, 
 *              host:string, 
 *              accept:string, 
 *              referer:string,
 *              'X-Request-Id':string,
 *              'X-Correlation-Id':string}} headers
 */
/**
 * Response
 * @typedef {Object} res
 * @property {function} status
 * @property {number} statusCode
 * @property {(Error|string|number|null)} statusMessage
 * @property {function} type
 * @property {function} end
 * @property {function} send
 * @property {function} redirect 
 * @property {function} getHeader
 * @property {function} setHeader
 * @property {function} removeHeader
 * @property {function} on
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
 * @param {(Error|string|number|null)} error
 * @param {(string|object|null|*)} result
 */

/**
 * Error stack
 * @typedef {string} stack
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
 * @typedef {object} app_info              - app info
 * @property {number} app_id               - app id
 * @property {string} locale               - locale
 * @property {number} system_admin_only    - 0/1
 * @property {boolean} map                 - map
 * @property {string|null} map_styles      - map styles
 * @property {boolean} ui                  - ui true/false app=true, report=false
 * @property {string} datatoken            - JW token
 * @property {string} latitude             - geodata latitude
 * @property {string} longitude            - geodata longitude
 * @property {string} place                - geodata place
 * @property {string} module               - HTML
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
 * Module config info
 * 
 * @typedef {object} module_config
 * @property {string} module_type        - APP or REPORT
 * @property {string|null} params        - parameter in url used by SHOW_PROFILE parameter in apps.json
 * @property {string} ip                 - ip address
 * @property {string} method             - request method
 * @property {string} user_agent         - request user agent
 * @property {string} accept_language    - request accept language
 * @property {string} host               - request host
 * @property {object} body               - request body
 */
/**
 * Render common info settings
 * @typedef {object} render_common_settings
 * @property {db_setting} settings        - db result
 * @property {string} user_timezones      - HTML option format
 * @property {string} user_directions     - HTML option format
 * @property {string} user_arabic_scripts - HTML option format
 * @property {string} map_styles          - HTML option format                   - HTML option format
 */
/**
 * Render common info
 * @typedef {object} render_common
 * @property {string} app                         - HTML
 * @property {string} locales                     - HTML option format
 * @property {render_common_settings} settings    - HTML option format
 */
/**
 * Map styles
 * @typedef {object} map_styles
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
/*
 * Config init, choose type of declaration and fix ts-ignore
 * @typedef {object} config_init
 * @property {string} CONFIGURATION
 * @property {string} CREATED
 * @property {string} MODIFIED
 * @property {string} MAINTENANCE
 * @property {string} FILE_CONFIG_SERVER
 * @property {string} FILE_CONFIG_AUTH_BLOCKIP
 * @property {string} FILE_CONFIG_AUTH_USERAGENT
 * @property {string} FILE_CONFIG_AUTH_POLICY
 * @property {string} PATH_LOG
 * @property {string} FILE_CONFIG_AUTH_USER
 * @property {string} FILE_CONFIG_APPS
*/
/**
 * Config init
 * 
 * @typedef {{  CONFIGURATION:string,
 *              CREATED:string,
 *              MODIFIED:string,
 *              MAINTENANCE:string,
 *              FILE_CONFIG_SERVER:string,
 *              FILE_CONFIG_AUTH_BLOCKIP:string,
 *              FILE_CONFIG_AUTH_USERAGENT:string,
 *              FILE_CONFIG_AUTH_POLICY:string,
 *              PATH_LOG:string,
 *              FILE_CONFIG_AUTH_USER:string,
 *              FILE_CONFIG_APPS:string}} config_init
 */
/**
 * Config apps
 * @typedef  {object} config_apps
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
 * DB result app
 * @typedef {{app_name:string, url:string}} db_app
 * DB app_name 
 * @typedef {{app_name:string}} db_app_name
 * DB result app_objects
 * @typedef {{object_item_name:string, text:string}} db_app_object_item
 * DB result app_parameter
 * @typedef {{app_id: number, parameter_type_id:number, parameter_name:string, parameter_value :string, parameter_comment:string}} db_app_parameter
 * DB result country
 * @typedef {{id:string, group_name:string, country_code:string, flag_emoji:string, text:string}} db_country
 * DB result identity provider
 * @typedef {{id:string, provider_name:string}} db_identity_provider
 * DB result locale
 * @typedef {{locale: String, text:string}} db_locale
 * DB result parameter
 * @typedef {{parameter_name:string, parameter_value:string}} db_parameter
 * DB result setting
 * @typedef {{id:string, setting_type_name:string, text:string, data:string, data2:string, data3:string, data4:string}} db_setting
 */
export {};