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
  * @description APP commonAppMount
  * @typedef {{App:{Id:server['ORM']['Object']['App']['Id'] & {Id:number},
  *                 Name:server['ORM']['Object']['App']['Name'],
  *                 Js:server['ORM']['Object']['App']['Js'],
  *                 JsContent:string|null,
  *                 Css:server['ORM']['Object']['App']['Css'],
  *                 CssContent:string|null,
  *                 CssReport:server['ORM']['Object']['App']['CssReport'],
  *                 CssReportContent:string|null,
  *                 Favicon32x32:server['ORM']['Object']['App']['Favicon32x32'],
  *                 Favicon32x32Content:string|null,
  *                 Favicon192x192:server['ORM']['Object']['App']['Favicon192x192'],
  *                 Favicon192x192Content:string|null,
  *                 Logo:server['ORM']['Object']['App']['Logo'],
  *                 LogoContent:string|null,
  *                 Copyright:server['ORM']['Object']['App']['Copyright'],
  *                 LinkUrl:server['ORM']['Object']['App']['LinkUrl'],
  *                 LinkTitle:server['ORM']['Object']['App']['LinkTitle'],
  *                 TextEdit:server['ORM']['Object']['App']['TextEdit']},
  *           AppParameter:Object.<string,*>,
  *           IamUserApp:ORM['Object']['IamUserApp']
  *          }} commonAppMount
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
 *              Id?: number,
 *              Name: string,
 *              Path: string,
 *              Logo:string,
 *              Js:string,
 *              Css: string,
 *              CssReport: string,
 *              Favicon32x32:string,
 *              Favicon192x192:string,
 *              TextEdit:string,
 *              Copyright:string,
 *              LinkTitle:string,
 *              LinkUrl:string,
 *              Status:'ONLINE'|'OFFLINE'}} server_db_table_App
 */
/**
 * @description DB TABLE AppDataEntity
 * @memberof dbObjects
 * @typedef {{  Id?:number, 
 *              Document:{[key:string]:string}|null,
 *              Created?:string,
 *              Modified?:string|null,
 *              AppId?:number}} server_db_table_AppDataEntity
 */

/**
 * @description DB TABLE AppDataEtntityResource
 * @memberof dbObjects
 * @typedef {{  Id:number, 
 *              Document:{[key:string]:*}|null, 
 *              Created:string,
 *              Modified:string|null,
 *              AppDataEntityId:number, 
 *              AppDataId:number}} server_db_table_AppDataEntityResource
 */

/**
 * @description DB TABLE AppDataResourceMaster
 * @memberof dbObjects
 * @typedef {{  Id?:number, 
 *              Document:{[key:string]:*}|null, 
 *              Created?:string,
 *              Modified?:string|null,
 *              IamUserAppId:number|null,
 *              AppDataEntityResourceId:number}} server_db_table_AppDataResourceMaster
 */

/**
 * @description DB TABLE AppDataResourceDetail
 * @memberof dbObjects
 * @typedef {{  Id?:number, 
 *              Document:{[key:string]:*}|null, 
 *              Created?:string,
 *              Modified?:string|null,
 *              AppDataResourceMasterId:number,
 *              AppDataEntityResourceId:number,
 *              AppDataResourceMasterAttributeId:number|null}} server_db_table_AppDataResourceDetail
 */

/**
 * @description DB TABLE AppDataResourceDetailData
 * @memberof dbObjects
 * @typedef {{  Id?:number, 
 *              Document:{[key:string]:*}|null, 
 *              Created?:string,
 *              Modified?:string|null,
 *              AppDataResourceDetailId:number,
 *              AppDataResourceMasterAttributeId:number|null}} server_db_table_AppDataResourceDetailData
 */

/**
 * @description DB TABLE AppModule
 * @memberof dbObjects
 * @typedef {{  Id:number,
 *              ModuleType: 'FUNCTION'|'ASSET'|'REPORT',
 *              ModuleName:string,
 *              ModuleRole:'APP_ID'|'APP_ACCESS'|'APP_ACCESS_EXTERNAL'|'ADMIN'|'',
 *              ModulePath:string,
 *              ModuleDescription:string,
 *              AppId: number}} server_db_table_AppModule
 */
/**
 * @description DB TABLE AppModuleQueue
 * @memberof dbObjects
 * @typedef {{  Id:number,
 *              Type:'REPORT',          //copied from app_module
 *              Name: string,           //copied from app_module
 *              Parameters:string,
 *              User:string,            //copied from iam_user
 *              Start:string|null,
 *              End:string|null,
 *              Progress:number|null,
 *              Status:'PENDING'|'RUNNING'|'COMPLETED'|'SUCCESS'|'FAIL',
 *              Message:string|null,
 *              IamUserId:number,
 *              AppModuleId:number, 
 *              AppId: number         //copied from app
 *              }} server_db_table_AppModuleQueue
 */

/**
 * @description DB TABLE AppTranslation
 * @memberof dbObjects
 * @typedef {{Id: number,
 *			  Locale: string,
 *			  Document: {   ScreenshotStart:string,
 *                          Description:string,
 *                          Pattern:string,
 *                          Technology:string,
 *                          Reference:string,
 *                          Security:string,
 *                          Comparison:[string,string][][],
 *                          ScreenshotEnd:string[]
 *                      }|null,       //complex text
 *			  Text: string|null,	            //simple text
 *            AppId: number
 *          }} server_db_table_AppTranslation	
 */

/**
 * @description DB TABLE AppData
 * @memberof dbObjects
 * @typedef {{  Id:number,
 *              Name: string,
 *              Value:string,
 *              DisplayData:string,
 *              Data2:string|number|null,
 *              Data3:string|number|null,
 *              Data4:string|number|null,
 *              Data5:string|number|null,
 *              AppId: number}} server_db_table_AppData
 */

/**
 * @description DB TABLE IamControlIp
 * @memberof dbObjects
 * @typedef {{  Id:number,
 *              From:string, 
 *              To:string, 
 *              HourFrom:number|null, 
 *              HourTo:number|null, 
 *              DateFrom:string|null, 
 *              DateTo:string|null, 
 *              Action:string|null,
 *              AppId:number|null}} server_db_table_IamControlIp
 */
/**
 * @description DB TABLE IamControlObserve
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Ip:string, 
 *              UserAgent:string 
 *              Host:string, 
 *              AcceptLanguage:string, 
 *              Method:string,
 *              Url:string,
 *              Status?:1|0,
 *              Type?:'APP_ID'|'HOST'|'HOST_IP'|'USER_AGENT'|'URI_DECODE'|'METHOD'|'BLOCK_IP',
 *              Created?:string,
 *              Modified?:string|null,
 *              IamUserId:number|null,
 *              AppId:number|null}} server_db_table_IamControlObserve
 */
/**
 * @description DB TABLE IamControlUserAgent
 * @memberof dbObjects
 * @typedef {{  Id:number,
 *              Name:string, 
 *              UserAgent:string}} server_db_table_IamControlUserAgent
 */
/**
 * @description DB TABLE IamEncryption
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Uuid:string, 
 *              Secret:string,
 *              Url?:string|null,
 *              Type:'BFE'|'APP'|'FONT',
 *              Created?:string,
 *              AppId:number,
 *              IamAppIdTokenId:number|null}} server_db_table_IamEncryption
 */

/** 
 * @description DB TABLE IamMicroserviceToken
 * @memberof dbObjects
 * @typedef {{Id?:                  number,
 *            ServiceRegistryName:  string,
 *		        Res:	                0|1,
 *   	        Token:                string,
 *		        Ip:                   string,
 *		        Ua:                   string|null,
 *            Host:                 string|null,
 *		        Created?:             string,
 *            AppId:                number,
 *            ServiceRegistryId:    number}} server_db_table_IamMicroserviceToken
 */

/**
 * @description DB TABLE IamUser
 * @memberof dbObjects
 * @typedef {{  Id?:number, 
 *              Username:string, 
 *              Password:string, 
 *              PasswordNew?:string|null, 
 *              PasswordReminder:string|null, 
 *              Bio:string|null, 
 *              Private:number|null,
 *              Avatar:string|null,
 *              OtpKey?:string|null,
 *              Type?: 'ADMIN'|'USER', 
 *              UserLevel?:number|null, 
 *              Status?:number|null, 
 *              Active?:number,
 *              Created?:string, 
 *              Modified?:string}} server_db_table_IamUser
 */

/**
 * @description DB TABLE IamUserFollow
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Created?:string,
 *              IamUserId:number,
 *              IamUserIdFollow:number}} server_db_table_IamUserFollow
 */
/**
 * @description DB TABLE IamUserLike
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Created?:string,
 *              IamUserId:number,
 *              IamUserIdLike:number}} server_db_table_IamUserLike
 */
/**
 * @description DB TABLE IamUserView
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              ClientIp:string|null,
 *              ClientUserAgent:string|null,
 *              Created?:string,
 *              IamUserId:number|null,
 *              IamUserIdView:number}} server_db_table_IamUserView
 */

/**
 * @description DB TABLE IamUserApp
 * @memberof dbObjects
 * @typedef {{  Id?:number, 
 *              Document:{[key:string]:string}|null,
 *              Created?:string, 
 *              Modified?:string|null,
 *              IamUserId: number, 
 *              AppId:number}} server_db_table_IamUserApp
 */
/**
 * @description DB TABLE IamUserAppDataPost
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Document:{[key:string]:string}|null,
 *              Created?:string,
 *              Modified?:string|null,
 *              IamUserAppId:number}} server_db_table_IamUserAppDataPost
 */

/**
 * @description DB TABLE IamUserAppDataPostLike
 * @memberof dbObjects
 * @typedef {{  Id:number,
 *              Created:string,
 *              IamUserAppDataPostId:number,
 *              IamUserAppId:number}} server_db_table_IamUserAppDataPostLike
 */
/**
 * @description DB TABLE IamUserAppDataPostView
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Document:{client_ip:string|null,
 *                        client_user_agent:string|null},
 *              Created?:string,
 *              IamUserAppId:number|null, 
 *              IamUserAppDataPostId:number}} server_db_table_IamUserAppDataPostView
 */
    
/**
 * @description DB TABLE IamUserEvent
 * @memberof dbObjects
 * @typedef {{  Id?:number, 
 *              Event:'OTP_LOGIN'|'OTP_SIGNUP'|'OTP_2FA'|'USER_UPDATE', 
 *              EventStatus?:'INPROGRESS'|'SUCCESSFUL'|'FAIL',
 *              Created?:string,
 *              IamUserId:number}} server_db_table_IamUserEvent
 */

/** 
 * @description DB TABLE IamAppIdToken
 * @memberof dbObjects
 * @typedef {{  Id?:          number,
 *		          Res:		      0|1,
 *   	          Token:        string,
 *		          Ip:           string,
 *		          Ua:           string|null,
 *		          Created?:     string,
 *              AppId:        number,
 *              AppIdToken:   number|null}} server_db_table_IamAppIdToken
 */

 /**
 * @description DB TABLE IamAppAccess
 * @memberof dbObjects
 * @typedef {{	Id?:              number,
 *              Type:             'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_ACCESS_EXTERNAL'|'ADMIN',
 *              Res:	            0|1|2,          //0=fail, 1=success, 2=invalidated
 *		          Ip:               string,
 *              IamUserUsername:  string|null,    
 *              AppCustomId:      number|string|null,
 *              Token:            string|null,
 *		          Ua:               string|null,
 *		          Created?:         string,
 *              Modified?:        string|null,
 *              AppId:            number,
 *              AppIdToken:       number|null,
 *              IamUserAppId:     number|null,
 *              IamUserId:        number|null}} server_db_table_IamAppAccess
 */

/**
 * @description DB TABLE_LOG LogAppInfo
 * @memberof dbObjects
 * @typedef {{   Id?:number,
 *               AppId:number|null,
 *               AppFilename:string,
 *               AppFunction_name:string,
 *               AppAppLine:number,
 *               Logtext:string,
 *               Created?:string}} server_db_table_LogAppInfo
 */

/**
 * @description DB TABLE_LOG LogDbInfo
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              AppId:number|null,
 *              Object:string,
 *              Dml:string,
 *              Parameters:{},
 *              Logtext:string,
 *              Created?:string}} server_db_table_LogDbInfo
 */

/**
 * @description DB TABLE_LOG LogServiceInfo
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              AppId:number|null,
 *              Service:string,
 *              Parameters:string,
 *              Logtext:string,
 *              Created?:string}} server_db_table_LogServiceInfo
 */
         
/**
 * @description DB TABLE_LOG LogRequestInfo
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Host:string,
 *              AppId:number|null,
 *              AppIdAuth:1|0|null,
 *              Ip:string,
 *              RequestId:string,
 *              CorrelationId:string,
 *              Url:string,
 *              XUrl:string|null,
 *              HttpInfo:string,
 *              Method:string,
 *              XMethod:string|null,
 *              StatusCode:number,
 *              StatusMessage:string,
 *              UserAgent:string,
 *              AcceptLanguage:string,
 *              Referer:string,
 *              SizeReceived:number,
 *              SizeSent:number,
 *              Responsetime:number,
 *              Logtext:string,
 *              Created?:string}} server_db_table_LogRequestInfo
 */

/**
 * @description DB TABLE_LOG LogServerInfo
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              LogText:string,
 *              Created?:string}} server_db_table_LogServerInfo
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
 * @typedef {{  Id?:                number,
 *              Name:               string,
 *              ServerProtocol:     'http',
 *              ServerHost:         string,
 *              ServerPort:         number,
 *              MetricsUrl:         string|null, 
 *              HealthUrl:          string|null, 
 *              RestApiVersion:     number,
 *              Uuid:               string,
 *              Secret:             string,
 *              Status:             string,
 *              Created?:           string,
 *              Modified?:          string|null}} server_db_table_ServiceRegistry
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
 * @typedef {{  Id?:number,
 *              Service:'MESSAGE'|'BATCH',
 *              Message:{ Id?:number,
 *                        Type?:'MICROSERVICE_ERROR'|'MICROSERVICE_LOG',
 *                        Sender?:string|null,
 *                        ReceiverId?:number|null,
 *                        Host?:string,
 *                        ClientIp?:string,
 *                        Subject?:string,
 *                        Message:string,
 *                        Created?:string
 *              },
 *              Created?:string}} server_db_table_MessageQueuePublish
 */

/**
 * @description DB TABLE MessageQueueConsume
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Message:*,
 *              Start:string|null,
 *              Finished:string|null,
 *              Result:*,
 *              Created?:string,
 *              Modified?:string,
 *              MessageQueuePublishId:number}} server_db_table_MessageQueueConsume
 */

/**
 * @description DB TABLE MessageQueueError
 * @memberof dbObjects
 * @typedef {{  Id?:number,
 *              Message:*,
 *              Result:*,
 *              Created:string,
 *              MessageQueuePublishId:number}} server_db_table_MessageQueueError
 */


/**
 * @description DB VIEW ViewLogGetStat
 * @typedef {{Chart:1|2|null,
 *            StatValue:string|number|null,
 *            Year:number,
 *            Month:number,
 *            Day:number|null,
 *            Amount:number|null}} ViewLogGetStat
 */
/**
 * @description DB VIEW ViewAppGetInfo
 * @memberof dbObjects
 * @typedef {{
 *              Id: server_db_table_App['Id'],
 *              Name: server_db_table_App['Name'],
 *              Logo:string}} ViewAppGetInfo
 */
/**
 * @descriptin DB VIEW ViewIamUsetGetProfile
 * @typedef {{  Id:             ORM['Object']['IamUser']['Id'],
 *              Active:         ORM['Object']['IamUser']['Active'],
 *              Username:       ORM['Object']['IamUser']['Username'],
 *              Bio:            ORM['Object']['IamUser']['Bio'],
 *              Private:        number|null,
 *              UserLevel:      ORM['Object']['IamUser']['UserLevel'],
 *              Avatar:         ORM['Object']['IamUser']['Avatar'],
 *              Friends:        number|null,
 *              Created:        string,
 *              CountFollowing: number,
 *              CountFollowed:  number,
 *              CountLikes:     number,
 *              CountLiked:     number,
 *              CountViews:     number,
 *              FollowedId:     number,
 *              LikedId:        number}} ViewIamUsetGetProfile
 */
/**
 * @description DB VIEW ViewIamUserGetProfileDetail
 * @memberof dbObjects
 * @typedef {{Detail:'FOLLOWING'|'FOLLOWED'|'LIKE_USER'|'LIKED_USER',
 *                               IamUserId:ORM['Object']['IamUserFollow']['IamUserId'],
 *                               Avatar:ORM['Object']['IamUser']['Avatar'],
 *                               Username:ORM['Object']['IamUser']['Username']}} ViewIamUserGetProfileDetail
 */
/**
 * @description DB VIEW ViewIamUserGetProfileStat
 * @memberof dbObjects
 * @typedef {{Top:'VISITED|FOLLOWING|LIKE_USER', 
 *            Id:ORM['Object']['IamUser']['Id'], 
 *            Avatar:ORM['Object']['IamUser']['Avatar'],
 *            Username:ORM['Object']['IamUser']['Username'],
 *            Count:number}} ViewIamUserGetProfileStat
 */
/**
 * @description DB VIEW ViewIamUserGetStatCountAdmin
 * @typedef {{CountUsers:number}} ViewIamUserGetStatCountAdmin
 */
/**
 * @description DB VIEW ViewIamUserAppDataPostgetProfileUserPosts
 * @typedef { {Id:ORM['Object']['IamUserAppDataPost']['Id'],
 *             Description:string,
 *             IamUserId:ORM['Object']['IamUserApp']['IamUserId'],
 *             Document:ORM['Object']['IamUserAppDataPost']['Document'],
 *             CountLikes:number,
 *             CountViews:number,
 *             Liked:number}} ViewIamUserAppDataPostgetProfileUserPosts
 */

/**
 * @description DB VIEW ViewIamUserAppDataPostGetProfileStatLike
 * @typedef {{CountUserPostLikes:number, CountUserPostLiked:number}} ViewIamUserAppDataPostGetProfileStatLike
 */
/**
 * @description DB VIEW ViewIamUserAppDataPostGetProfileStatPost
 * @typedef {{Top:'LIKED_POST'|'VIEWED_POST',
  *           Id:ORM['View']['IamUserGetProfileStat']['Id'],
  *           Avatar:ORM['View']['IamUserGetProfileStat']['Avatar'],
  *           Username:ORM['View']['IamUserGetProfileStat']['Username'],
  *           Count:ORM['View']['IamUserGetProfileStat']['Count']}}  ViewIamUserAppDataPostGetProfileStatPost
 */
/**
 * @description DB VIEW ViewIamUserAppdataPostGetProfileUserPostDetail
 * @typedef {{Detail:'LIKE_POST'|'LIKED_POST',
 *            IamUserId:ORM['Object']['IamUserApp']['IamUserId'],
 *            Avatar:ORM['Object']['IamUser']['Avatar'],
 *            Username:ORM['Object']['IamUser']['Username']}} ViewIamUserAppdataPostGetProfileUserPostDetail
 */
/**
 * @description DB VIEW ViewORMGetInfo
 * @typedef {{DatabaseName:string, 
 *            Version:number,
 *            Hostname:string,
 *            Connections:Number,
 *            Started:number}} ViewORMGetInfo
 */
/**
 * @description DB VIEW ViewORMGetObjects
 * @typedef {{Name:ORM['MetaData']['DbObject']['Name'],
 *            Type:ORM['MetaData']['DbObject']['Type'],
 *            Lock:ORM['MetaData']['DbObject']['Lock'],
 *            TransactionId:ORM['MetaData']['DbObject']['TransactionId'],
 *            Rows:number|null,
 *            Size:number|null,
 *            Pk:ORM['MetaData']['DbObject']['Pk'],
 *            Uk:ORM['MetaData']['DbObject']['Uk'],
 *            Fk:ORM['MetaData']['DbObject']['Fk']}} ViewORMGetObjects
 */
/**
 * @description DB VIEW ViewSocketGetConnected
 * @typedef {{Id:number,
 *            ConnectionDate:string,
 *            AppId:number,
 *            IamUserid:number|null,
 *            IamUserUsername:string|null,
 *            IamUserType:'ADMIN'|'USER'|null,
 *            Ip:string,
 *            GpsLatitude:string,
 *            GpsLongitude:string,
 *            Place:string,
 *            Timezone:string,
 *            UserAgent:string}} ViewSocketGetConnected
 */
/** 
 * @description DB object record
 * @namespace dbObjects
 * @typedef {{  Name:keyof ORM['Object'], 
 *              Type:'DOCUMENT'|'TABLE'|'TABLE_KEY_VALUE'|'TABLE_LOG'|'TABLE_LOG_DATE',
 *              InMemory:boolean,
 *              Content:*,
 *              Lock:number, 
 *              TransactionId:number|null, 
 *              TransactionContent: object|[]|null, 
 *              CacheContent?:* ,
 *              Pk:string|null,
 *              Uk:string[]|null,
 *              Fk:[string,string, keyof ORM['Object']][]|null}} server_db_DbObject
 */

/** 
 * @description DB server_db_result_fileFsRead
 * @typedef {{  FileContent:   *, 
 *              Lock:          boolean, 
 *              TransactionId: number|null}} server_db_result_fileFsRead
 */

/**
 * @description DB common result
 * @typedef {server_db_common_result_select|server_db_common_result_insert|server_db_common_result_delete|server_db_common_result_update}  server_db_common_result
 */

/**
 * @description DB common result SELECT
 * @typedef {{  Rows:*[]}}  server_db_common_result_select
 */

/**
 * @description DB common result INSERT
 *              Choosing keys from patterns
 *              DB              Id                      Row info
 *              MariaDB, Mysql: insertId                affectedRows
 *              PostgreSQL:     rows[0].id              rowCount
 *              Oracle:         outBinds.insertId[0]    rowsAffected
 *              sqLite:         lastID                  changes
 * @typedef {{  InsertId?:number, 
 *              AffectedRows:number,
 *              Length?:number}}  server_db_common_result_insert
 */

/**
 * @description DB common result DELETE
 *              Choosing keys from patterns
 *              DB              Row info
 *              MariaDB, Mysql: affectedRows
 *              PostgreSQL:     rowCount
 *              Oracle:         rowsAffected
 *              sqLite:         changes
 * @typedef {{  AffectedRows:number, 
 *              Length?:number}}  server_db_common_result_delete
 */

/**
 * @description DB common result UPDATE
 *              Choosing keys from patterns
 *              DB              Row info
 *              MariaDB, Mysql: affectedRows
 *              PostgreSQL:     rowCount
 *              Oracle:         rowsAffected
 *              sqLite:         changes
 * @typedef {{  AffectedRows:number, 
 *              Length?:number}}  server_db_common_result_update
 */

/** 
 * @description DB server_db_database_demo_data
 * @typedef {object}    server_db_database_demo_data
 * @property {number}   [Id]
 * @property {string}   Username
 * @property {string}   Bio
 * @property {string}   Avatar
 * @property {{AppId:number}}IamUserApp
 * @property {{
 *              AppId:                             number,
 *              Document:{
 *                          Description:                        string,
 *                          RegionalLanguageLocale:             string,
 *                          RegionalTimezone:                   string,
 *                          RegionalNumberSystem:               string,
 *                          RegionalLayoutDirection:            string,
 *                          RegionalSecondLanguageLocale:       string,
 *                          RegionalArabicScript:               string,
 *                          RegionalCalendarType:               string,
 *                          RegionalCalendarHijriType:          string,
 *                          GpsMapType:                         string,
 *                          GpsLatText:                         string,
 *                          GpsLongText:                        string,
 *                          DesignThemeDayId:                   number,
 *                          DesignThemeMonthId:                 number,
 *                          DesignThemeYearId:                  number,
 *                          DesignPaperSize:                    string,
 *                          DesignRowHighlight:                 string,
 *                          DesignColumnWeekdayChecked:         string,
 *                          DesignColumnCalendarTypeChecked:    string,
 *                          DesignColumnNotesChecked:           string,
 *                          DesignColumnGpschecked:             string,
 *                          DesignColumnTimezoneChecked:        string,
 *                          ImageHeaderImageImg:                string,
 *                          ImageFooterImageImg:                string,
 *                          TextHeader1Text:                    string,
 *                          TextHeader2Text:                    string,
 *                          TextHeader3Text:                    string,
 *                          TextHeaderAlign:                    string,
 *                          TextFooter1Text:                    string,
 *                          TextFooter2Text:                    string,
 *                          TextFooter3Text:                    string,
 *                          TextFooterAlign:                    string,
 *                          PrayerMethod:                       string,
 *                          PrayerAsrMethod:                    string,
 *                          PrayerHighLatitudeAdjustment:       string,
 *                          PrayerTimeFormat:                   string,
 *                          PrayerHijriDateAdjustment:          string,
 *                          PrayerFajrQqamat:                   string,
 *                          PrayerDhuhrIqamat:                  string,
 *                          PrayerAsrIqamat:                    string,
 *                          PrayerMaghribIqamat:                string,
 *                          PrayerIshaIqamat:                   string,
 *                          PrayerColumnImsakChecked:           string,
 *                          PrayerColumnSunsetChecked:          string,
 *                          PrayerColumnMidnightChecked:        string,
 *                          PrayerColumnFastStartEnd:           string},
 *              }[]|[]}  IamUserAppDataPost
 * @property {{ IamUserAppIamUserId:                            string,
 *              IamUserAppAppId:                                number, 
 *              AppDataEntityResourceId:                        number, 
 *              Document:                                       {[key:string]:string}|null,
 *              AppDataEntity?:{  Id:number,
 *                                Document:{[key:string]:string|number}},
 *              AppDataResourceDetail?:[{   AppDataResourceMasterId:number,
 *                                          AppDataEntityResourceId: number,
 *                                          IamUserAppIamUserId:number|null,
 *                                          IamUserAppAppId:number|null,
 *                                          AppDataResourceMasterAttributeId:number|null,
 *                                          Document:{[key:string]:string}|null,
 *                                          AppDataResourceDetailData?:[{ AppDataResourceDetailId: number,
 *                                                                        IamUserAppIamUserId:number|null,
 *                                                                            IamUserAppIamUserAppId:number|null,
 *                                                                            data_app_id:number,
 *                                                                            AppDataResourceMasterAttributeId:number,
 *                                                                            Document: {[key:string]:string}|null}
 *                                                                          ]}
 *                                      ]}[]|[]} AppDataResourceMaster
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
 *              scope:                  'USER'|'APP'|'MICROSERVICE'|'REPORT'|'MAINTENANCE'|'APP_EXTERNAL'}} server_iam_access_token_claim
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
 *            statusMessage: string}}server_iam_authenticate_request
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
 * @description SERVER server_server_response
 * @typedef {{  http?:number|null,
 *              code?:number|string|null,
 *              text?:string|null,
 *              developerText?:string|null,
 *              moreInfo?:string|null,
 *              result?:*,
 *              sendcontent?:string,
 *              type:'JSON'|'HTML'}} server_server_response
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
 * @typedef {{Object:{
 *                    App:server_db_table_App,
 *                    AppData:server_db_table_AppData,
 *                    AppDataEntity:server_db_table_AppDataEntity,
 *                    AppDataEntityResource:server_db_table_AppDataEntityResource,
 *                    AppDataResourceMaster:server_db_table_AppDataResourceMaster,
 *                    AppDataResourceDetail:server_db_table_AppDataResourceDetail,
 *                    AppDataResourceDetailData:server_db_table_AppDataResourceDetailData,
 *                    AppModule:server_db_table_AppModule,
 *                    AppModuleQueue:server_db_table_AppModuleQueue,
 *                    AppTranslation:server_db_table_AppTranslation,
 *                    IamControlIp:server_db_table_IamControlIp,
 *                    IamControlObserve:server_db_table_IamControlObserve,
 *                    IamControlUserAgent:server_db_table_IamControlUserAgent,
 *                    IamEncryption:server_db_table_IamEncryption,
 *                    IamMicroserviceToken:server_db_table_IamMicroserviceToken,
 *                    IamUser:server_db_table_IamUser,
 *                    IamUserFollow:server_db_table_IamUserFollow,
 *                    IamUserLike:server_db_table_IamUserLike,
 *                    IamUserView:server_db_table_IamUserView,
 *                    IamUserApp:server_db_table_IamUserApp,
 *                    IamUserAppDataPost:server_db_table_IamUserAppDataPost,
 *                    IamUserAppDataPostLike:server_db_table_IamUserAppDataPostLike,
 *                    IamUserAppDataPostView:server_db_table_IamUserAppDataPostView,
 *                    IamUserEvent:server_db_table_IamUserEvent,
 *                    IamAppIdToken:server_db_table_IamAppIdToken,
 *                    IamAppAccess:server_db_table_IamAppAccess,
 *                    LogAppInfo:server_db_table_LogAppInfo,
 *                    LogAppVerbose:server_db_table_LogAppInfo,
 *                    LogAppError:server_db_table_LogAppInfo,
 *                    LogDbInfo:server_db_table_LogDbInfo,
 *                    LogDbVerbose:server_db_table_LogDbInfo,
 *                    LogDbError:server_db_table_LogDbInfo,
 *                    LogServiceInfo:server_db_table_LogServiceInfo,
 *                    LogServiceVerbose:server_db_table_LogServiceInfo,
 *                    LogServiceError:server_db_table_LogServiceInfo,
 *                    LogRequestInfo:server_db_table_LogRequestInfo,
 *                    LogRequestVerbose:server_db_table_LogRequestInfo,
 *                    LogRequestError:server_db_table_LogRequestInfo,
 *                    LogServerInfo:server_db_table_LogServerInfo,
 *                    LogServerError:server_db_table_LogServerInfo,
 *                    ConfigServer:server_db_document_ConfigServer,
 *                    ConfigRestApi:server_db_document_ConfigRestApi,
 *                    ServiceRegistry:server_db_table_ServiceRegistry,
 *                    MessageQueuePublish:server_db_table_MessageQueuePublish,
 *                    MessageQueueConsume:server_db_table_MessageQueueConsume,
 *                    MessageQueueError:server_db_table_MessageQueueError},
 *            View:{
 *                LogGetStat:ViewLogGetStat,
 *                AppGetInfo:ViewAppGetInfo,
 *                IamUserGetProfileDetail:ViewIamUserGetProfileDetail,
 *                IamUserGetProfileStat:ViewIamUserGetProfileStat,
 *                IamUserGetStatCountAdmin:ViewIamUserGetStatCountAdmin,
 *                IamUsetGetProfile:ViewIamUsetGetProfile,
 *                IamUserAppDataPostgetProfileUserPosts:ViewIamUserAppDataPostgetProfileUserPosts,
 *                IamUserAppDataPostgetProfileStatLike:ViewIamUserAppDataPostGetProfileStatLike,
 *                IamUserAppDataPostGetProfileStatPost:ViewIamUserAppDataPostGetProfileStatPost,
 *                IamUserAppdataPostGetProfileUserPostDetail:ViewIamUserAppdataPostGetProfileUserPostDetail,
 *                ORMGetInfo:ViewORMGetInfo,
 *                ORMGetObjects:ViewORMGetObjects,
 *                SocketGetConnected:ViewSocketGetConnected
 *              },
 *            Type:{
 *              TokenType:'APP_ID'|server_db_table_IamAppAccess['Type']|'MICROSERVICE',
 *              DemoData:server_db_database_demo_data
 *              },
 *            MetaData:{
 *                DbObject:server_db_DbObject,
 *                AllObjects: server_db_DbObject['Name']|'DbObjects'
 *                result_fileFsRead:server_db_result_fileFsRead,
 *                common_result:server_db_common_result,
 *                common_result_select:server_db_common_result_select,
 *                common_result_insert:server_db_common_result_insert,
 *                common_result_delete:server_db_common_result_delete,
 *                common_result_update:server_db_common_result_update
 *              }
 * }} ORM
 */
/**
 * @description Server types
 * @typedef {{app:{
 *                commonInfo:server_apps_app_info,
 *                commonGlobals:server_apps_globals,
 *                commonReportQueryParameters:server_apps_report_query_parameters,
 *                commonReportCreateParameters:server_apps_report_create_parameters,
 *                commonModuleMetadata:server_apps_module_metadata,
 *                commonModuleWithMetadata:(ORM['Object']['AppModule'] & {ModuleMetadata:server_apps_module_metadata}),
 *                commonstatus:server_config_apps_status,
 *                commonComponentLifecycle:serverComponentLifecycle,
 *                commonDocumentMenu:serverDocumentMenu,
 *                commonWorldCitiesCity:commonWorldCitiesCity
 *                commonAppMount:commonAppMount
 *                },
 *          bff:{
 *                parameters:server_bff_parameters,
 *                RestApi_parameters:server_bff_RestApi_parameters
 *              },
 *          iam:{
 *                iam_access_token_claim:server_iam_access_token_claim,
 *                iam_microservice_token_claim:server_iam_microservice_token_claim,
 *                iam_authenticate_request:server_iam_authenticate_request
 *              },
 *          info:{
 *                result_Info:server_info_result_Info,
 *                process:server_info_process,
 *              },
 *          server:{
 *                req:server_server_req,
 *                res:server_server_res,
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
 *          ORM:ORM}} server
 */
export {};