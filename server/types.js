/** 
 * @description Declaration of all types used in server
 *              Type groups
 *              APP             App types
 *              BFF             Backend for frontend (BFF) types
 *              DB              Objects in data model 
 *              IAM             IAM types
 *              INFO            Info types
 *              SERVER          Server types
 *              SECURITY        Security types
 *              SOCKET          Socket types
 *              TEST            Test types
 *              SERVICEREGISTRY Service registry types
 * @module server/types 
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
 * @description APP server_apps_globals
 * @typedef {object}        server_apps_globals
 * @property {string}       rest_resource_bff
 * @property {string}       app_rest_api_version
 * @property {number|null}  app_common_app_id
 * @property {number|null}  app_admin_app_id
 * @property {number|null}  app_start_app_id
 * @property {number}       app_toolbar_button_start
 * @property {number}       app_toolbar_button_framework
 * @property {number}       app_framework
 * @property {number}       app_framework_messages
 * @property {number}       admin_only
 * @property {number}       admin_first_time
 * @property {number}       app_requesttimeout_seconds
 * @property {number}       app_requesttimeout_admin_minutes
 * @property {string}       app_fonts
 * @property {string|null}  info_link_policy_name
 * @property {string|null}  info_link_policy_url
 * @property {string|null}  info_link_disclaimer_name
 * @property {string|null}  info_link_disclaimer_url
 * @property {string|null}  info_link_terms_name
 * @property {string|null}  info_link_terms_url
 * @property {string|null}  token_dt
 * @property {string|null}  client_latitude
 * @property {string|null}  client_longitude
 * @property {string|null}  client_place
 * @property {string|null}  client_timezone
 * @property {{app_id?:number, uuid:string, secret:string}} x
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
 * @description APP server_config_apps_status
 * @typedef  {'ONLINE'|'OFFLINE'} server_config_apps_status
 */

/**
 * @description APP CommonCssFonts
 * @typedef {{  css: string;
 *              db_records: {
 *                  id: number;
 *                  app_id: number;
 *                  iam_app_id_token_id: null;
 *                  uuid: string;
 *                  secret: string;
 *                  url: string;
 *                  type: "FONT";
 *                  created: string}[]}}
 *                  server_app_CommonCSSFonts
 */
/**
 * @description APP serverComponentLifecycle
 * @typedef  {{ onBeforeMounted?:function|null,
 *              onMounted?:function|null, 
 *              onUnmounted?:function|null}|null} serverComponentLifecycle
 */

/**
 * @description APP commonDocumentMenu
 * @typedef {{   id:number, 
 *              menu:string,
 *              type:'MENU'|'APP'|'GUIDE'|'ROUTE'|'MODULE_CODE'|'MODULE_APPS'|'MODULE_SERVICEREGISTRY'|'MODULE_SERVER'|'MODULE_TEST',
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
 *              lat:        string,
 *              lng:        string,
 *              country:    string,
 *              iso2:       string,
 *              admin_name: string}} commonWorldCitiesCity
 */


/**
 * @description BFF server_bff_parameters
 * @typedef {{
 *          app_id:number,
 *          endpoint:'APP'|'APP_ID'|'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_EXTERNAL'|'APP_ACCESS_EXTERNAL'|'ADMIN'|'SOCKET'|'IAM'|'IAM_SIGNUP'|'SERVER'|'MICROSERVICE'|'MICROSERVICE_AUTH' & string,
 *          host:string|null,
 *          url:string,
 *          method: string,
 *          query: string,
 *          body:server_server_req['body'] & {type?:string, IAM_data_app_id?:number|null, data?:string}|null,
 *          security_app:{
 *              AppId:  server_server_req['headers']['app-id'], 
 *              AppSignature:  server_server_req['headers']['app-signature'], 
 *              AppIdToken:  server_server_req['headers']['app-id-token']
 *          }|null,
 *          authorization:string|null,
 *          ip: string,
 *          user_agent:string,
 *          accept_language:string,
 *          jwk:JsonWebKey|null,
 *          iv:string|null,
 *          res: server_server_res}} server_bff_parameters
 *
 */
/**
 * @description BFF server_bff_RestApi_parameters
 * @typedef {{  app_id:number,
 *              endpoint: server_bff_parameters['endpoint'],
 *              host:string,
 *              url:string,
 *              method: server_server_req['method'],
 *              parameters: string,
 *              body:*,
 *              idToken:string
 *              authorization:string,
 *              ip: string,
 *              user_agent:string,
 *              accept_language:string,
 *              res:server_server_res}} server_bff_RestApi_parameters
 */

/**
 * @description DB TABLE App
 * @memberof dbObjects
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
 *              status:'ONLINE'|'OFFLINE'}} server_db_table_App
 */
/**
 * @description DB TABLE AppDataEntity
 * @memberof dbObjects
 * @typedef {{  id:number, 
 *              app_id:number, 
 *              Document:{[key:string]:string}|null,
 *              created:string,
 *              modified:string|null}} server_db_table_AppDataEntity
 */

/**
 * @description DB TABLE AppDataEtntityResource
 * @memberof dbObjects
 * @typedef {{  id:number, 
 *              Document:{[key:string]:*}|null, 
 *              app_data_entity_id:number, 
 *              app_data_id:number, 
 *              created:string,
 *              modified:string|null}} server_db_table_AppDataEntityResource
 */

/**
 * @description DB TABLE AppDataResourceMaster
 * @memberof dbObjects
 * @typedef {{  id?:number, 
 *              Document:{[key:string]:*}|null, 
 *              iam_user_app_id:number|null,
 *              app_data_entity_resource_id:number,
 *              created?:string,
 *              modified?:string|null}} server_db_table_AppDataResourceMaster
 */

/**
 * @description DB TABLE AppDataResourceDetail
 * @memberof dbObjects
 * @typedef {{  id?:number, 
 *              Document:{[key:string]:*}|null, 
 *              app_data_resource_master_id:number,
 *              app_data_entity_resource_id:number,
 *              app_data_resource_master_attribute_id:number|null,
 *              created?:string,
 *              modified?:string|null}} server_db_table_AppDataResourceDetail
 */

/**
 * @description DB TABLE AppDataResourceDetailData
 * @memberof dbObjects
 * @typedef {{  id?:number, 
 *              Document:{[key:string]:*}|null, 
 *              app_data_resource_detail_id:number,
 *              app_data_resource_master_attribute_id:number|null,
 *              created?:string,
 *              modified?:string|null}} server_db_table_AppDataResourceDetailData
 */

/**
 * @description DB TABLE AppModule
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              app_id: number,
 *              ModuleType: 'FUNCTION'|'ASSET'|'REPORT',
 *              ModuleName:string,
 *              ModuleRole:'APP_ID'|'APP_ACCESS'|'APP_ACCESS_EXTERNAL'|'ADMIN'|'',
 *              ModulePath:string,
 *              ModuleDescription:string}} server_db_table_AppModule
 */
/**
 * @description DB TABLE AppModuleQueue
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              iam_user_id:number,
 *              app_module_id:number, 
 *              app_id: number,         //copied from app
 *              type:'REPORT',          //copied from app_module
 *              name: string,           //copied from app_module
 *              parameters:string,
 *              user:string,            //copied from iam_user
 *              start:string|null,
 *              end:string|null,
 *              progress:number|null,
 *              status:server_db_app_module_queue_status,
 *              message:string|null}} server_db_table_AppModuleQueue
 */

/**
 * @description DB TABLE AppTranslation
 * @memberof dbObjects
 * @typedef {{id: number,
 *            app_id: number,
 *			      locale: string,
 *			      Document: {[key:string]:string}|null,       //complex text
 *			      text: string|null	            //simple text
 *          }} server_db_table_AppTranslation	
 */

/**
 * @description DB TABLE AppData
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              app_id: number,
 *              name: string,
 *              value:string,
 *              display_data:string,
 *              data2:string|number|null,
 *              data3:string|number|null,
 *              data4:string|number|null,
 *              data5:string|number|null}} server_db_table_AppData
 */

/**
 * @description DB TABLE IamControlIp
 * @memberof dbObjects
 * @typedef {{  id:number, 
 *              app_id:number|null,
 *              from:string, 
 *              to:string, 
 *              hour_from:number|null, 
 *              hour_to:number|null, 
 *              date_from:string|null, 
 *              date_to:string|null, 
 *              action:string|null}} server_db_table_IamControlIp
 */
/**
 * @description DB TABLE IamControlObserve
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              iam_user_id:number|null,
 *              app_id:number|null, 
 *              ip:string, 
 *              user_agent:string 
 *              host:string, 
 *              accept_language:string, 
 *              method:string,
 *              url:string,
 *              status:1|0,
 *              type:'APP_ID'|'HOST'|'HOST_IP'|'USER_AGENT'|'URI_DECODE'|'METHOD'|'BLOCK_IP',
 *              created?:string,
 *              modified?:string|null}} server_db_table_IamControlObserve
 */
/**
 * @description DB TABLE IamControlUserAgent
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              name:string, 
 *              user_agent:string}} server_db_table_IamControlUserAgent
 */
/**
 * @description DB TABLE IamEncryption
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              app_id:number,
 *              iam_app_id_token_id:number|null,
 *              uuid:string, 
 *              secret:string,
 *              url?:string|null,
 *              type:'BFE'|'APP'|'FONT',
 *              created?:string}} server_db_table_IamEncryption
 */

/** 
 * @description DB TABLE IamMicroserviceToken
 * @memberof dbObjects
 * @typedef {{id?:                  number,
 *            app_id:               number,
 *            service_registry_id:  number,
 *            service_registry_name:string,
 *		      res:	                0|1,
 *   	      token:                string,
 *		      ip:                   string,
 *		      ua:                   string|null,
 *            host:                 string|null,
 *		      created?:string}} server_db_table_IamMicroserviceToken
 */

/**
 * @description DB TABLE IamUser
 * @memberof dbObjects
 * @typedef {{
 *          id?:number, 
 *          username:string, 
 *          password:string, 
 *          password_new?:string|null, 
 *          password_reminder:string|null, 
 *          bio:string|null, 
 *          private:number|null,
 *          avatar:string|null,
 *          otp_key?:string|null,
 *          type?: 'ADMIN'|'USER', 
 *          user_level?:number|null, 
 *          status?:number|null, 
 *          active?:number,
 *          created?:string, 
 *          modified?:string}} server_db_table_IamUser
 */

/**
 * @description DB TABLE IamUserFollow
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              iam_user_id:number,
 *              iam_user_id_follow:number
 *              created:string}} server_db_table_IamUserFollow
 */
/**
 * @description DB TABLE IamUserLike
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              iam_user_id:number,
 *              iam_user_id_like:number
 *              created:string}} server_db_table_IamUserLike
 */
/**
 * @description DB TABLE IamUserView
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              iam_user_id:number|null,
 *              iam_user_id_view:number,
 *              client_ip:string|null,
 *              client_user_agent:string|null,
 *              created:string}} server_db_table_IamUserView
 */
    
/**
 * @description DB TABLE IamUserApp
 * @memberof dbObjects
 * @typedef {{
 *          id?:number, 
 *          Document:{[key:string]:string}|null,
 *          iam_user_id: number, 
 *          app_id:number, 
 *          created?:string, 
 *          modified?:string|null}} server_db_table_IamUserApp
 */
/**
 * @description DB TABLE IamUserAppDataPost
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              iam_user_app_id:number
 *              Document:{[key:string]:string}|null,
 *              created:string,
 *              modified:string|null}} server_db_table_IamUserAppDataPost
 */

/**
 * @description DB TABLE IamUserAppDataPostLike
 * @memberof dbObjects
 * @typedef {{  id:number,
 *              iam_user_app_data_post_id:number,
 *              iam_user_app_id:number,
 *              created:string}} server_db_table_IamUserAppDataPostLike
 */
/**
 * @description DB TABLE IamUserAppDataPostView
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              Document:{client_ip:string|null,
 *                        client_user_agent:string|null},
 *              created?:string,
 *              iam_user_app_id:number|null, 
 *              iam_user_app_data_post_id:number}} server_db_table_IamUserAppDataPostView
 */
    
/**
 * @description DB TABLE IamUserEvent
 * @memberof dbObjects
 * @typedef {{
 *          id?:number, 
 *          iam_user_id:number,
 *          event:'OTP_LOGIN'|'OTP_SIGNUP'|'OTP_2FA'|'USER_UPDATE', 
 *          event_status?:'INPROGRESS'|'SUCCESSFUL'|'FAIL',
 *          created?:string}} server_db_table_IamUserEvent
 */

/** 
 * @description DB TABLE IamAppIdToken
 * @memberof dbObjects
 * @typedef {{  id?:             number,
 *              app_id:         number,
 *              app_id_token:   number|null,
 *		        res:		    0|1,
 *   	        token:          string,
 *		        ip:             string,
 *		        ua:             string|null,
 *		        created?:        string}} server_db_table_IamAppIdToken
 */

 /**
 * @description DB TABLE IamAppAccess
 * @memberof dbObjects
 * @typedef {{	id?:                number,
 *              app_id:             number,
 *              app_id_token:       number|null,
 *              type:               server_db_iam_app_access_type,
 *              res:	            0|1|2,          //0=fail, 1=success, 2=invalidated
 *		        ip:                 string,
 *              iam_user_app_id:    number|null,
 *              iam_user_id:        number|null,
 *              iam_user_username:  string|null,
 *              app_custom_id:      number|string|null,
 *              token:              string|null,
 *		        ua:                 string|null,
 *		        created?:           string,
 *              modified?:          string|null}} server_db_table_IamAppAccess
 */

/**
 * @description DB TABLE_LOG LogAppInfo
 * @memberof dbObjects
 * @typedef {{   id?:number,
 *               app_id:number|null,
 *               app_filename:string,
 *               app_function_name:string,
 *               app_app_line:number,
 *               logtext:string,
 *               created?:string}} server_db_table_LogAppInfo
 */

/**
 * @description DB TABLE_LOG LogAppError
 * @memberof dbObjects
 * @typedef {server_db_table_LogAppInfo} server_db_table_LogAppError
 */
/**
 * @description DB TABLE_LOG LogDbInfo
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              app_id:number|null,
 *              object:string,
 *              dml:string,
 *              parameters:{},
 *              logtext:string,
 *              created?:string}} server_db_table_LogDbInfo
 */
/**
 * @description DB TABLE_LOG LogDbError
 * @memberof dbObjects
 * @typedef {server_db_table_LogDbInfo} server_db_table_LogDbError
 */
/**
 * @description DB TABLE_LOG LogServiceInfo
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              app_id:number|null,
 *              service:string,
 *              parameters:string,
 *              logtext:string,
 *              created?:string}} server_db_table_LogServiceInfo
 */
/**
 * @description DB TABLE_LOG LogServiceError
 * @memberof dbObjects
 * @typedef {server_db_table_LogServiceInfo} server_db_table_LogServiceError
 */
         
/**
 * @description DB TABLE_LOG LogRequestInfo
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              host:string,
 *              app_id:number|null,
 *              app_id_auth:1|0|null,
 *              ip:string,
 *              requestid:string,
 *              correlationid:string,
 *              url:string,
 *              x_url:string|null,
 *              http_info:string,
 *              method:string,
 *              x_method:string|null,
 *              statusCode:number,
 *              statusMessage:string,
 *              'user-agent':string,
 *              'accept-language':string,
 *              referer:string,
 *              size_received:number,
 *              size_sent:number,
 *               responsetime:number,
 *              logtext:string,
 *              created?:string}} server_db_table_LogRequestInfo
 */
/**
 * @description DB TABLE_LOG LogRequestError
 * @memberof dbObjects
 * @typedef {server_db_table_LogRequestInfo} server_db_table_LogRequestError
 */

/**
 * @description DB TABLE_LOG LogServerInfo
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              logtext:string,
 *              created?:string}} server_db_table_LogServerInfo
 */
/**
 * @description DB TABLE_LOG LogServerError
 * @memberof dbObjects
 * @typedef {server_db_table_LogServerInfo} server_db_table_LogServerError
 */
/**
 * @description DB DOCUMENT ConfigServer
 * @memberof dbObjects
 * @typedef  {{ SERVER:[
 *                {HOST:string,                                       COMMENT:string},
 *                {PATH_DATA:string,                                  COMMENT:string},
 *                {HTTP_PORT:string,                                  COMMENT:string},
 *                {HTTP_PORT_ADMIN:string,                            COMMENT:string},
 *                {JSON_LIMIT:string,                                 COMMENT:string},
 *                {REST_RESOURCE_BFF:string,                          COMMENT:string},
 *                {REST_API_VERSION:string,                           COMMENT:string},
 *                {GIT_REPOSITORY_URL:string,                         COMMENT:string},
 *                {NETWORK_INTERFACE:string,                          COMMENT:string},
 *                {PATH_JOBS:string,                                  COMMENT:string},
 *                {CIRCUITBREAKER_FAILURETHRESHOLD_SECONDS:number,    COMMENT:string},
 *                {CIRCUITBREAKER_COOLDOWNPERIOD_SECONDS:number,      COMMENT:string},
 *                {CIRCUITBREAKER_REQUESTTIMEOUT_SECONDS:number,      COMMENT:string},
 *                {CIRCUITBREAKER_REQUESTTIMEOUT_ADMIN_MINUTES:number,COMMENT:string}
 *              ], 
 *              SERVICE_APP:[
 *                {APP_START_APP_ID                  :string,COMMENT:string},
 *                {APP_COMMON_APP_ID                 :string,COMMENT:string},
 *                {APP_ADMIN_APP_ID                  :string,COMMENT:string},
 *                {APP_TOOLBAR_BUTTON_START          :string,COMMENT:string},
 *                {APP_TOOLBAR_BUTTON_FRAMEWORK      :string,COMMENT:string},
 *                {APP_CACHE_CONTROL                 :string,COMMENT:string},
 *                {APP_FRAMEWORK                     :number,COMMENT:string},
 *                {APP_FRAMEWORK_MESSAGES            :number,COMMENT:string},
 *                {APP_LIMIT_RECORDS                 :number,COMMENT:string},
 *                {APP_DEFAULT_RANDOM_COUNTRY        :string,COMMENT:string},
 *                {APP_REQUESTTIMEOUT_SECONDS        :string,COMMENT:string},
 *                {APP_REQUESTTIMEOUT_ADMIN_MINUTES  :string,COMMENT:string}
 *              ],
 *              SERVICE_DB:[
 *                {JOURNAL:string}
 *              ],
 *              SERVICE_IAM:[
 *                {AUTHENTICATE_REQUEST_ENABLE:string,COMMENT:string},
 *                {AUTHENTICATE_REQUEST_OBSERVE_LIMIT:string,COMMENT:string},
 *                {AUTHENTICATE_REQUEST_IP:string,COMMENT:string},
 *                {MICROSERVICE_TOKEN_EXPIRE_ACCESS:string,COMMENT:string},
 *                {MICROSERVICE_TOKEN_SECRET:string,COMMENT:string},
 *                {ADMIN_TOKEN_EXPIRE_ACCESS:string,COMMENT:string},
 *                {ADMIN_TOKEN_SECRET:string,COMMENT:string},
 *                {USER_TOKEN_APP_ACCESS_EXPIRE:string,COMMENT:string},
 *                {USER_TOKEN_APP_ACCESS_SECRET:string,COMMENT:string},
 *                {USER_TOKEN_APP_ACCESS_VERIFICATION_EXPIRE:string,COMMENT:string},
 *                {USER_TOKEN_APP_ACCESS_VERIFICATION_SECRET:string,COMMENT:string},
 *                {USER_TOKEN_APP_ID_EXPIRE:string,COMMENT:string},
 *                {USER_TOKEN_APP_ID_SECRET:string,COMMENT:string},
 *                {USER_PASSWORD_ENCRYPTION_KEY:string,COMMENT:string},
 *                {USER_PASSWORD_INIT_VECTOR:string,COMMENT:string},
 *                {USER_ENABLE_REGISTRATION:string,COMMENT:string},
 *                {USER_ENABLE_LOGIN:string,COMMENT:string},
 *                {CONTENT_SECURITY_POLICY_ENABLE:string,COMMENT:string},
 *                {CONTENT_SECURITY_POLICY:string,COMMENT:string},
 *                {ENABLE_GEOLOCATION:string,COMMENT:string},
 *                {RATE_LIMIT_WINDOW_MS:number,COMMENT:string},
 *                {RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ANONYMOUS:number,COMMENT:string},
 *                {RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_USER:number,COMMENT:string},
 *                {RATE_LIMIT_MAX_REQUESTS_PER_WINDOW_ADMIN:number,COMMENT:string}
 *              ],
 *              SERVICE_SOCKET:[
 *                {CHECK_INTERVAL:string, COMMENT:string}
 *              ],
 *              SERVICE_LOG:[
 *                {REQUEST_LEVEL:string,  COMMENT:string},
 *                {APP_LEVEL:string,      COMMENT:string},
 *                {DB_LEVEL:string,       COMMENT:string},
 *                {SERVICE_LEVEL:string,  COMMENT:string},
 *                {FILE_INTERVAL:string,  COMMENT:string}
 *              ],
 *              SERVICE_TEST:[
 *                {FAIL_SPEC_WITH_NO_EXPECTATIONS:string,   COMMENT:string},
 *                {STOP_SPEC_ON_EXPECTATION_FAILURE:string, COMMENT:string},
 *                {STOP_ON_SPEC_FAILURE:string,             COMMENT:string},
 *                {RANDOM:string,                           COMMENT:string},
 *              ],
 *              METADATA:{
 *                MAINTENANCE:number,
 *                CONFIGURATION:string,
 *                COMMENT:string,
 *                CREATED:string,
 *                MODIFIED:string
 *              }}} server_db_document_ConfigServer
 */

/** 
 * @description DB DOCUMENT ServiceRegistry
 * @memberof dbObjects
 * @typedef {{  id?:                number,
 *              name:               string,
 *              server_protocol:    'http',
 *              server_host:        string,
 *              server_port:        number,
 *              metrics_url:        string|null, 
 *              health_url:         string|null, 
 *              rest_api_version:   number,
 *              uuid:               string,
 *              secret:             string,
 *              status:             string,
 *              created?:           string,
 *              modified?:          string|null}} server_db_table_ServiceRegistry
 */

/**
 * @description DB DOCUMENT ConfigRestApi
 *              Follows Open API syntax
 * @memberof dbObjects
 * @typedef  {{ info: {
 *                      title: string,
 *                      version: string,
 *                      description: string
 *                  },
 *              servers: {url: string}[],
 *              paths: {[key:string]: 
 *                          {[key in 'get'|'post'|'delete'|'patch'|'put']:
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
 *                                       [key:string]: {
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
 *                              'application/json': {
 *                                  schema: {
 *                                      "$ref": string
 *                                  }
 *                              }
 *                          }
 *                      }
 *                  },
 *              }
 *          }} server_db_document_ConfigRestApi
 */

/**
 * @description DB TABLE MessageQueuePublish
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              service:'MESSAGE'|'BATCH',
 *              message:server_db_MessageQueuePublishMessage,
 *              created?:string}} server_db_table_MessageQueuePublish
 */

/**
 * @description DB TABLE MessageQueueConsume
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              message_queue_publish_id:number,
 *              message:*,
 *              start:string|null,
 *              finished:string|null,
 *              result:*,
 *              created?:string,
 *              modified?:string}} server_db_table_MessageQueueConsume
 */

/**
 * @description DB TABLE MessageQueueError
 * @memberof dbObjects
 * @typedef {{  id?:number,
 *              message_queue_publish_id:number,
 *              message:*,
 *              result:*,
 *              created:string}} server_db_table_MessageQueueError
 */

/**
 * @description DB common result
 * @typedef {server_db_common_result_select|server_db_common_result_insert|server_db_common_result_delete|server_db_common_result_update}  server_db_common_result
 */

/**
 * @description DB common result SELECT
 * @typedef {{  rows:*[]}}  server_db_common_result_select
 */

/**
 * @description DB common result INSERT
 *              Choosing keys from patterns
 *              DB              Id                      Row info
 *              MariaDB, Mysql: insertId                affectedRows
 *              PostgreSQL:     rows[0].id              rowCount
 *              Oracle:         outBinds.insertId[0]    rowsAffected
 *              sqLite:         lastID                  changes
 * @typedef {{  insertId?:number, 
 *              affectedRows:number,
 *              length?:number}}  server_db_common_result_insert
 */

/**
 * @description DB common result DELETE
 *              Choosing keys from patterns
 *              DB              Row info
 *              MariaDB, Mysql: affectedRows
 *              PostgreSQL:     rowCount
 *              Oracle:         rowsAffected
 *              sqLite:         changes
 * @typedef {{  affectedRows:number, 
 *              length?:number}}  server_db_common_result_delete
 */

/**
 * @description DB common result UPDATE
 *              Choosing keys from patterns
 *              DB              Row info
 *              MariaDB, Mysql: affectedRows
 *              PostgreSQL:     rowCount
 *              Oracle:         rowsAffected
 *              sqLite:         changes
 * @typedef {{  affectedRows:number, 
 *              length?:number}}  server_db_common_result_update
 */

/**
 * @description DB server_db_iam_user_admin
 * @typedef {{
 *          id?:number, 
 *          username?:string, 
 *          password?:string, 
 *          password_new?:string|null, 
 *          password_reminder?:string|null, 
 *          bio?:string|null, 
 *          private?:number|null, 
 *          otp_key?:string|null, 
 *          avatar?:string|null,
 *          type?: 'ADMIN'|'USER', 
 *          user_level?:number|null, 
 *          status?:number|null, 
 *          active?:number,
 *          created?:string, 
 *          modified?:string}} server_db_iam_user_admin
 */

/**
 * @description DB server_db_iam_user_update
 * @typedef {{
 *          username:string, 
 *          password:string,
 *          password_new:string|null,
 *          bio:string|null, 
 *          private:number|null, 
 *          otp_key:string|null, 
 *          avatar:string|null}} server_db_iam_user_update
 */

/**
 * @description DB tables log
 * @typedef {  'LogAppInfo'|
 *             'LogAppError'|
 *             'LogDbInfo'|
 *             'LogDbVerbose'|
 *             'LogDbError'|
 *             'LogRequestInfo'|
 *             'LogRequestVerbose'|
 *             'LogRequestError'|
 *             'LogServerInfo'|
 *             'LogServerError'|
 *             'LogServiceInfo'|
 *             'LogServiceError'} server_db_tables_log
 */

/**
 * @description DB server_db_MessageQueuePublishMessage
 * 
 * @typedef {{  id?:number,
 *              type?:'MICROSERVICE_ERROR'|'MICROSERVICE_LOG',
 *              sender?:string|null,
 *              receiver_id?:number|null,
 *              host?:string,
 *              client_ip?:string,
 *              subject?:string,
 *              message:string,
 *              created?:string
 *          }} server_db_MessageQueuePublishMessage
 */

/** 
 * @description DB object record
 * @namespace dbObjects
 * @typedef {{  name:ORM[keyof ORM] |string, 
 *              type:'DOCUMENT'|'TABLE'|'TABLE_KEY_VALUE'|'TABLE_LOG'|'TABLE_LOG_DATE',
 *              in_memory:boolean,
 *              content:*,
 *              lock:number, 
 *              transaction_id:number|null, 
 *              transaction_content: object|[]|null, 
 *              cache_content?:* ,
 *              pk:string|null,
 *              uk:string[]|null,
 *              fk:[string,string, ORM[keyof ORM]][]|null}} server_db_DbObject
 */

/** 
 * @description DB server_db_result_fileFsRead
 * @typedef {{  file_content:   *, 
 *              lock:           boolean, 
 *              transaction_id: number|null}} server_db_result_fileFsRead
 */

/**
 * @description token_type
 * @typedef {'APP_ID'|server_db_iam_app_access_type|'MICROSERVICE'} token_type

 
/**
 * @description DB server_db_app_module_queue_status
 * @typedef{'PENDING'|'RUNNING'|'COMPLETED'|'SUCCESS'|'FAIL'} server_db_app_module_queue_status
 */

/**
 * @description DB server_db_iam_app_access_type
 * @typedef {'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_ACCESS_EXTERNAL'|'ADMIN'} server_db_iam_app_access_type
 */

 /** 
  * @description DB server_log_data_parameter_logGet
  * @typedef{object}             server_log_data_parameter_logGet
  * @property {number}           app_id
  * @property {number|null}      data_app_id
  * @property {server_db_tables_log} logobject
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
 * @description DB server_log_request_record_keys
 * @typedef {   'created'|
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
 * @description DB server_log_scope
 * @typedef {'App'|'Db'|'Request'|'Server'|'Service'} server_log_scope
 */


/**
 * @description DB server_log_level
 * @typedef {'Info'|'Error'} server_log_level
 */

/** 
 * @description DB server_log_data_parameter_getLogStats
 * @typedef {object}                server_log_data_parameter_getLogStats
 * @property {number|null}          app_id
 * @property {server_log_request_record_keys} statGroup
 * @property {number|null}          unique
 * @property {string|number|null}   statValue
 * @property {number}               year
 * @property {number}               month
 */

/** 
 * @description DB server_log_result_logStatGet
 * @typedef {object}                server_log_result_logStatGet
 * @property {number|null}          chart
 * @property {string|number|null}   statValue
 * @property {number}               year
 * @property {number}               month
 * @property {number|null}          day
 * @property {number|null}          amount
 */

/** 
 * @description DB server_db_database_demo_data
 * @typedef {object}    server_db_database_demo_data
 * @property {number}   id
 * @property {string}   username
 * @property {string}   bio
 * @property {string}   avatar
 * @property {{app_id:number}}iam_user_app
 * @property {{
 *              app_id:                             number,
 *              Document:{
 *                          description:                        string,
 *                          regional_language_locale:           string,
 *                          regional_timezone:                  string,
 *                          regional_number_system:             string,
 *                          regional_layout_direction:          string,
 *                          regional_second_language_locale:    string,
 *                          regional_arabic_script:             string,
 *                          regional_calendar_type:             string,
 *                          regional_calendar_hijri_type:       string,
 *                          gps_map_type:                       string,
 *                          gps_popular_place_id:               number|null,
 *                          gps_lat_text:                       string,
 *                          gps_long_text:                      string,
 *                          design_theme_day_id:                number,
 *                          design_theme_month_id:              number,
 *                          design_theme_year_id:               number,
 *                          design_paper_size:                  string,
 *                          design_row_highlight:               string,
 *                          design_column_weekday_checked:      string,
 *                          design_column_calendartype_checked: string,
 *                          design_column_notes_checked:        string,
 *                          design_column_gps_checked:          string,
 *                          design_column_timezone_checked:     string,
 *                          image_header_image_img:             string,
 *                          image_footer_image_img:             string,
 *                          text_header_1_text:                 string,
 *                          text_header_2_text:                 string,
 *                          text_header_3_text:                 string,
 *                          text_header_align:                  string,
 *                          text_footer_1_text:                 string,
 *                          text_footer_2_text:                 string,
 *                          text_footer_3_text:                 string,
 *                          text_footer_align:                  string,
 *                          prayer_method:                      string,
 *                          prayer_asr_method:                  string,
 *                          prayer_high_latitude_adjustment:    string,
 *                          prayer_time_format:                 string,
 *                          prayer_hijri_date_adjustment:       string,
 *                          prayer_fajr_iqamat:                 string,
 *                          prayer_dhuhr_iqamat:                string,
 *                          prayer_asr_iqamat:                  string,
 *                          prayer_maghrib_iqamat:              string,
 *                          prayer_isha_iqamat:                 string,
 *                          prayer_column_imsak_checked:        string,
 *                          prayer_column_sunset_checked:       string,
 *                          prayer_column_midnight_checked:     string,
 *                          prayer_column_fast_start_end:       string},
 *              }[]|[]}  iam_user_app_data_post
 * @property {{ iam_user_app_iam_user_id:                        string,
 *              iam_user_app_app_id:                             number, 
 *              app_data_entity_resource_id:                     number, 
 *              Document:                                       {[key:string]:string}|null,
 *              app_data_entity?:{id:number,
 *                                [key:string]:string|number},
 *              app_data_resource_detail?:[{app_data_resource_master_id:number,
 *                                          app_data_entity_resource_id: number,
 *                                          iam_user_app_iam_user_id:number|null,
 *                                          iam_user_app_app_id:number|null,
 *                                          app_data_resource_master_attribute_id:number|null,
 *                                          Document:{[key:string]:string}|null,
 *                                          app_data_resource_detail_data?:[{ app_data_resource_detail_id: number,
 *                                                                            iam_user_app_iam_user_id:number|null,
 *                                                                            iam_user_app_iam_user_app_id:number|null,
 *                                                                            data_app_id:number,
 *                                                                            app_data_resource_master_attribute_id:number,
 *                                                                            Document: {[key:string]:string}|null}
 *                                                                          ]}
 *                                      ]}[]|[]} app_data_resource_master
 */

/**
 * @description IAM server_iam_access_token_claim_scope_type
 * @typedef{'USER'|'APP'|'MICROSERVICE'|'REPORT'|'MAINTENANCE'|'APP_EXTERNAL'} server_iam_access_token_claim_scope_type
 */
/**
 * @description IAM server_iam_access_token_claim
 * @typedef {{  
 *              app_id:                 number,
 *              app_id_token:           number|null,
 *              app_custom_id:          number|string|null,
 *              iam_user_app_id:        number|null,
 *              iam_user_id:            number|null,
 *              iam_user_username:      string|null,
 *              ip:                     string,
 *              scope:                  server_iam_access_token_claim_scope_type}} server_iam_access_token_claim
 */
/**
 * @description IAM server_iam_microservice_token_claim
 * @typedef {{  
 *              app_id:                 number,
 *              service_registry_id:    number,
 *              service_registry_name:  string,
 *              ip:                     string,
 *              host:                   string,
 *              scope:                  'MICROSERVICE'}} server_iam_microservice_token_claim
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
 * @description INFO process
 * @typedef {*} server_info_process
 */

/**
 * @description SERVER server_server_req_verbose
 * @typedef {*} server_server_req_verbose
 * 
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
 * @property {'GET'|'POST'|'DELETE'|'PATCH'|'PUT'} method
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
 * @property {string} body.x
 * query
 * @property {object} query
 * @property {string} query.parameters
 
 * @property {{ 'app-id-token':string,
 *              'app-id': number,
 *              'app-signature':string,
 *              authorization: string, 
 *              connection:string,
 *              'user-agent': string, 
 *              'accept-language': string, 
 *              'content-type': string, 
 *              host:string, 
 *              accept:string, 
 *              'accept-encoding'?:'deflate'|'gzip',
 *              referer:string,
 *              'x-request-id':string,
 *              'x-forwarded-for':string,
 *              'x-correlation-id':string,
 *              x?:{app_id:     number|null, 
 *                  app_id_auth:number|null, 
 *                  method:     string|null, 
 *                  url:        string|null}}} headers
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
 * @property {function} redirect 
 * @property {function} getHeader
 * @property {function} setHeader
 * @property {function} removeHeader
 * @property {function} on
 * @property {function} write
 * @property {function} flush           - Used for SSE
 * @property {function} writeHead
 * @property {server_server_req}   req
 */

/**
 * @description SERVER server_server_response_type
 * @typedef {'JSON'|'HTML'} server_server_response_type
 */

/**
 * @description SERVER server_server_response
 * @typedef {{  http?:number|null,
 *              code?:number|string|null,
 *              text?:string|null,
 *              developerText?:string|null,
 *              moreInfo?:string|null,
 *              result?:*,
 *              sendcontent?:string,
 *              type:server_server_response_type}} server_server_response
 */

/**
 * @description SERVER server_server_req_id_number
 * @typedef {string|number|null|undefined} server_server_req_id_number
 */

/**
 * @description SERVER server_server_error
 * @typedef {Object.<Error | null , undefined>} server_server_error
 */

/**
 * @description geolocation place
 * @typedef {{  place:string, 
 *              countryCode:string, 
 *              country:string, 
 *              region:string,
 *              latitude:string,
 *              longitude:string,
 *              timezone:string}} server_geolocation_place
 */

/**
 * @description SECURITY server_security_jwt_payload
 * @typedef {{  
 *              iss:string, 
 *              sub:string, 
 *              aud:string|[],
 *              jwtid: string,
 *              exp:number,
 *              nbf:number,
 *              iat:number
 *          } & Object.<string,*>} server_security_jwt_payload
 */
/**
 * @description SECURITY server_security_jwt_complete
 * @typedef {{  header:   {algo:string, typ:string}, 
 *              payload:  server_security_jwt_payload,
 *              signature:string}} server_security_jwt_complete
 */

/**
 * @description SOCKET server_socket_connected_list
 * @typedef {object} server_socket_connected_list
 * @property {number} id
 * @property {string} connection_date
 * @property {number} app_id
 * @property {string|null} idToken
 * @property {string|null} uuid
 * @property {number|null} iam_user_id
 * @property {string|null} iam_user_username
 * @property {'ADMIN'|'USER'|null} iam_user_type
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
 *              gps_latitude:string,
 *              gps_longitude:string,
 *              place:string,
 *              timezone:string,
 *              ip:string,
 *              user_agent:string}} server_socket_connected_list_no_res
 */

/** 
 * @description SOCKET server_socket_broadcast_type
 * @typedef {'ALERT'|'MAINTENANCE'|'CHAT'|'PROGRESS'|'PROGRESS_LOADING'|'SESSION_EXPIRED'|'CONNECTINFO'|'APP_FUNCTION'|'MESSAGE'|'FONT_URL'} server_socket_broadcast_type
 */

/**
 * @description SOCKET server_socket_connected_list_sort
 * @typedef {   'id'|
 *              'connection_date'| 
 *              'app_id'|
 *              'iam_user_id'|
 *              'iam_user_username'|
 *              'iam_user_type'|
 *              'gps_latitude'|
 *              'gps_longitude'|
 *              'ip'|
 *              'user_agent'|
 *              null} server_socket_connected_list_sort
 */
/**
 * @description TEST test_spec_result
 * @typedef {{ type:'SPY'|'UNIT'|'INTEGRATION'|'PERFORMANCE', 
 *             path:string, 
 *             result:boolean,
 *             detail:{ describe:string,
 *                      it:{should:string,
 *                          expect:test_expect_result[]}}[]}} test_spec_result
 */

/**
 * @description TEST test_expect_result
 * @typedef {{  method:string|undefined,
 *              desc:string,
 *              actual:*,
 *              expected:*,
 *              result:*}} test_expect_result
 */

/**
 * @description TEST test_specrunner
 * @typedef {{  description:string,
 *              specFiles:{ type:test_spec_result['type'], 
 *                          path:string}[]}} test_specrunner
 */

/**
 * @description SERVICE_REGISTRY microservice_local_config
 * @typedef {{
 *   name:                          'BATCH' & string,
 *   server_host:		                string,
 *   server_port:                   number,
 *   service_registry_auth_path:		string,
 *   service_registry_auth_method:  'POST',
 *   message_queue_path:	          string,
 *   message_queue_method:	        'POST',
 *   iam_auth_app_path:	            string,
 *   iam_auth_app_method:	          'POST',
 *   uuid:                          string,
 *   secret:                        string,
 *   config:{url_ip:string, url_place:string}}} microservice_local_config
 */


/**
 * @description ORM Objects
 * @typedef {{App:server_db_table_App,
 *            AppData:server_db_table_AppData,
 *            AppDataEntity:server_db_table_AppDataEntity,
 *            AppDataEntityResource:server_db_table_AppDataEntityResource,
 *            AppDataResourceMaster:server_db_table_AppDataResourceMaster,
 *            AppDataResourceDetail:server_db_table_AppDataResourceDetail,
 *            AppDataResourceDetailData:server_db_table_AppDataResourceDetailData,
 *            AppModule:server_db_table_AppModule,
 *            AppModuleQueue:server_db_table_AppModuleQueue,
 *            AppTranslation:server_db_table_AppTranslation,
 *            IamControlIp:server_db_table_IamControlIp,
 *            IamControlObserve:server_db_table_IamControlObserve,
 *            IamControlUserAgent:server_db_table_IamControlUserAgent,
 *            IamEncryption:server_db_table_IamEncryption,
 *            IamMicroserviceToken:server_db_table_IamMicroserviceToken,
 *            IamUser:server_db_table_IamUser,
 *            IamUserFollow:server_db_table_IamUserFollow,
 *            IamUserLike:server_db_table_IamUserLike,
 *            IamUserView:server_db_table_IamUserView,
 *            IamUserApp:server_db_table_IamUserApp,
 *            IamUserAppDataPost:server_db_table_IamUserAppDataPost,
 *            IamUserAppDataPostLike:server_db_table_IamUserAppDataPostLike,
 *            IamUserAppDataPostView:server_db_table_IamUserAppDataPostView,
 *            IamUserEvent:server_db_table_IamUserEvent,
 *            IamAppIdToken:server_db_table_IamAppIdToken,
 *            IamAppAccess:server_db_table_IamAppAccess,
 *            LogAppInfo:server_db_table_LogAppInfo,
 *            LogAppError:server_db_table_LogAppError,
 *            LogDbInfo:server_db_table_LogDbInfo,
 *            LogDbError:server_db_table_LogDbError,
 *            LogServiceInfo:server_db_table_LogServiceInfo,
 *            LogServiceError:server_db_table_LogServiceError,
 *            LogRequestInfo:server_db_table_LogRequestInfo,
 *            LogRequestError:server_db_table_LogRequestError,
 *            LogServerInfo:server_db_table_LogServerInfo,
 *            LogServerError:server_db_table_LogServerError,
 *            ConfigServer:server_db_document_ConfigServer,
 *            ConfigRestApi:server_db_document_ConfigRestApi,
 *            ServiceRegistry:server_db_table_ServiceRegistry,
 *            MessageQueuePublish:server_db_table_MessageQueuePublish,
 *            MessageQueueConsume:server_db_table_MessageQueueConsume,
 *            MessageQueueError:server_db_table_MessageQueueError}} ORM
 */
/**
 * @description Server types
 * @typedef {{app:{
 *                commonInfo:server_apps_app_info,
 *                commonGlobals:server_apps_globals,
 *                commonReportQueryParameters:server_apps_report_query_parameters,
 *                commonReportCreateParameters:server_apps_report_create_parameters,
 *                commonModuleMetadata:server_apps_module_metadata,
 *                commonModuleWithMetadata:(ORM['AppModule'] & {ModuleMetadata:server_apps_module_metadata}),
 *                commonstatus:server_config_apps_status,
 *                commonCSSFonts:server_app_CommonCSSFonts,
 *                commonComponentLifecycle:serverComponentLifecycle,
 *                commonDocumentMenu:serverDocumentMenu,
 *                commonWorldCitiesCity:commonWorldCitiesCity
 *                },
 *          bff:{
 *                parameters:server_bff_parameters,
 *                RestApi_parameters:server_bff_RestApi_parameters
 *              },
 *          iam:{
 *                iam_access_token_claim_scope_type:server_iam_access_token_claim_scope_type,
 *                iam_access_token_claim:server_iam_access_token_claim,
 *                iam_microservice_token_claim:server_iam_microservice_token_claim,
 *                iam_authenticate_request:server_iam_authenticate_request
 *              },
 *          info:{
 *                result_Info:server_info_result_Info,
 *                process:server_info_process,
 *              },
 *          server:{
 *                req_verbose:server_server_req_verbose,
 *                req:server_server_req,
 *                res:server_server_res,
 *                response_type:server_server_response_type,
 *                response:server_server_response,
 *                req_id_number:server_server_req_id_number,
 *                error:server_server_error,
 *                geolocation_place:server_geolocation_place
 *              },
 *          security:{
 *                jwt_payload:server_security_jwt_payload,
 *                jwt_complete:server_security_jwt_complete
 *              },
 *          socket:{
 *                connected_list:server_socket_connected_list,
 *                connected_list_no_res:server_socket_connected_list_no_res,
 *                broadcast_type:server_socket_broadcast_type,
 *                connected_list_sort:server_socket_connected_list_sort
 *              },
 *          test:{
 *                spec_result:test_spec_result,
 *                expect_result:test_expect_result,
 *                specrunner:test_specrunner
 *              }
 *          serviceregistry:{
 *                microservice_local_config:microservice_local_config
 *              }
 *          ORMMetaData:{
 *                DbObject:server_db_DbObject,
 *                result_fileFsRead:server_db_result_fileFsRead,
 *                common_result:server_db_common_result,
 *                common_result_select:server_db_common_result_select,
 *                common_result_insert:server_db_common_result_insert,
 *                common_result_delete:server_db_common_result_delete,
 *                common_result_update:server_db_common_result_update
 *              }
 *          ORM:ORM}} server
 */
export {};