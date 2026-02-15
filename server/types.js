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
 * @typedef  {object} server_apps_app_info   - app info
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
 * @typedef  {object} server_apps_globals
 * @property {object} Parameters
 * @property {string} Parameters.rest_resource_bff
 * @property {string} Parameters.app_rest_api_version
 * @property {string} Parameters.app_rest_api_basepath
 * @property {number} Parameters.app_common_app_id
 * @property {number} Parameters.app_admin_app_id
 * @property {number} Parameters.app_start_app_id
 * @property {number} Parameters.app_toolbar_button_start
 * @property {number} Parameters.app_toolbar_button_framework
 * @property {number} Parameters.app_framework
 * @property {number} Parameters.app_framework_messages
 * @property {number} Parameters.admin_only
 * @property {number} Parameters.admin_first_time
 * @property {number} Parameters.app_request_tries
 * @property {number} Parameters.app_requesttimeout_seconds
 * @property {number} Parameters.app_requesttimeout_admin_minutes
 * @property {string} Parameters.app_content_type_json
 * @property {string} Parameters.app_content_type_html
 * @property {string} Parameters.app_content_type_sse
 * @property {number} Parameters.app_font_timeout
 * @property {object} Data
 * @property {ORM['View']['AppGetInfo'][]} Data.Apps
 * @property {[ORM['Object']['AppData']['AppId'], ORM['Object']['AppData']['Value'], ORM['Object']['AppData']['DisplayData']][]} Data.AppData
 * @property {string} Data.cssCommon
 * @property {string[]} Data.cssFontsArray
 * @property {string|null} Data.token_dt
 * @property {string|null} Data.client_latitude
 * @property {string|null} Data.client_longitude
 * @property {string|null} Data.client_place
 * @property {string|null} Data.client_timezone
 */

/**
 * @description APP server_apps_report_query_parameters
 * @typedef  {object} server_apps_report_query_parameters
 * @property {string} module
 * @property {number} uid_view
 * @property {string} url
 * @property {string} [ps]
 * @property {number} [hf]
 * @property {string} format
 */

/**
 * @description APP server_apps_report_create_parameters
 * @typedef  {object}        server_apps_report_create_parameters
 * @property {number}       app_id
 * @property {object}       [queue_parameters]
 * @property {string}       reportid
 * @property {string}       ip
 * @property {string}       user_agent
 */
/**
 * @description APP server_apps_module_metadata
 * @typedef  {object} server_apps_module_metadata
 * @property {object} param
 * @property {string} param.name
 * @property {string} param.text
 * @property {string|number} param.default
 */

/**
 * @description APP server_config_apps_status
 * @typedef {'ONLINE'|'OFFLINE'} server_config_apps_status
 */

/**
 * @description APP serverComponentLifecycle
 * @typedef  {object} serverComponentLifecycle
 * @property {function|null}  [onBeforeMounted]
 * @property {function|null}  [onMounted]
 * @property {function|null}  [onUnmounted]
 */

/**
 * @description APP commonDocumentMenu
 * @typedef  {object} serverDocumentMenu
 * @property {number} id
 * @property {string} menu
 * @property {'MENU'|'APP'|'GUIDE'|'MODULE_CODE'|'MODULE_APPS'|'MODULE_SERVICEREGISTRY'|'MODULE_SERVER'|'MODULE_TEST'} type
 * @property {{id:number, menu:string,doc:string}[]|null} menu_sub
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
  * @description APP commonAppSwitch
  * @typedef {{IamUserApp:ORM['Object']['IamUserApp']}} commonAppSwitch
  */

/**
 * @description BFF server_bff_parameters
 * @typedef {{
 *          app_id:number,
 *          endpoint:'APP'|'APP_ID'|'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_EXTERNAL'|'APP_ACCESS_EXTERNAL'|'ADMIN'|'SOCKET'|'IAM'|'IAM_SIGNUP'|'SERVER'|'MICROSERVICE'|'MICROSERVICE_AUTH' & string,
 *          host:string|null,
 *          url:string,
 *          uuid:string,
 *          method: string,
 *          URI_path:string,
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
 *          res:server_server_res,
 *          XAppId:server['ORM']['Object']['App']['Id']|null,
 *          XAppIdAuth:server['ORM']['Object']['App']['Id']|null,
 *          XUrl:server['server']['req']['url']|null,
 *          XMethod:server['server']['req']['method']|null}} server_bff_parameters
 *
 */
/**
 * @description BFF server_bff_RestApi_parameters
 * @typedef {{  app_id:number,
 *              endpoint: server_bff_parameters['endpoint'],
 *              host:string,
 *              url:string,
 *              uuid:string,
 *              method: server_server_req['method'],
 *              URI_path:string,
 *              app_query:URLSearchParams|null,
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
 * @memberof ORM
 * @typedef {object} server_db_table_App
 * @property {number} Id
 * @property {string} Name
 * @property {string} Path
 * @property {string} Logo
 * @property {string} Js
 * @property {string} Css
 * @property {string|null} CssReport
 * @property {string} TextEdit
 * @property {string|null} Copyright
 * @property {string|null} LinkTitle
 * @property {string|null} LinkUrl
 * @property {'ONLINE'|'OFFLINE'} Status
 */
/**
 * @description DB TABLE AppDataEntity
 * @memberof ORM
 * @typedef  {object} server_db_table_AppDataEntity
 * @property {number} Id
 * @property {{[key:string]:string}|null} Document
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['App']['Id']} AppId
 */

/**
 * @description DB TABLE AppDataEntityResource
 * @memberof ORM
 * @typedef  {object} server_db_table_AppDataEntityResource
 * @property {number} Id
 * @property {{[key:string]:*}|null} Document
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['AppDataEntity']['Id']} AppDataEntityId
 * @property {ORM['Object']['AppData']['Id']} AppDataId
 */

/**
 * @description DB TABLE AppDataResourceMaster
 * @memberof ORM
 * @typedef  {object} server_db_table_AppDataResourceMaster
 * @property {number} Id
 * @property {{[key:string]:*}|null} Document
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['IamUserApp']['Id']|null} IamUserAppId
 * @property {ORM['Object']['AppDataEntityResource']['Id']} AppDataEntityResourceId
 */

/**
 * @description DB TABLE AppDataResourceDetail
 * @memberof ORM
 * @typedef  {object} server_db_table_AppDataResourceDetail
 * @property {number} Id
 * @property {{[key:string]:*}|null} Document
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['AppDataResourceMaster']['Id']} AppDataResourceMasterId
 * @property {ORM['Object']['AppDataEntityResource']['Id']} AppDataEntityResourceId
 * @property {ORM['Object']['AppDataResourceMaster']['Id']|null} AppDataResourceMasterAttributeId
 */

/**
 * @description DB TABLE AppDataResourceDetailData
 * @memberof ORM
 * @typedef  {object} server_db_table_AppDataResourceDetailData
 * @property {number} Id
 * @property {{[key:string]:*}|null} Document
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['AppDataResourceDetail']['Id']} AppDataResourceDetailId
 * @property {ORM['Object']['AppDataResourceMaster']['Id']|null} AppDataResourceMasterAttributeId
 */

/**
 * @description DB TABLE AppModule
 * @memberof ORM
 * @typedef  {object} server_db_table_AppModule
 * @property {number} Id
 * @property {'FUNCTION'|'ASSET'|'REPORT'} ModuleType
 * @property {string} ModuleName
 * @property {'APP_ID'|'APP_ACCESS'|'APP_ACCESS_EXTERNAL'|'ADMIN'|''} ModuleRole
 * @property {string} ModulePath
 * @property {string} ModuleDescription
 * @property {ORM['Object']['App']['Id']} AppId
 */
/**
 * @description DB TABLE AppModuleQueue
 * @memberof ORM
 * @typedef  {object} server_db_table_AppModuleQueue
 * @property {number} Id
 * @property {Extract<ORM['Object']['AppModule']['ModuleType'],'REPORT'>} Type
 * @property {ORM['Object']['AppModule']['ModuleName']} Name
 * @property {string} Parameters
 * @property {ORM['Object']['IamUser']['Username']} User
 * @property {string|null} Start
 * @property {string|null} End
 * @property {number|null} Progress
 * @property {'PENDING'|'RUNNING'|'COMPLETED'|'SUCCESS'|'FAIL'} Status
 * @property {string|null} Message
 * @property {ORM['Object']['IamUser']['Id']} IamUserId
 * @property {ORM['Object']['AppModule']['Id']} AppModuleId
 * @property {ORM['Object']['App']['Id']} AppId
 */

/**
 * @description DB TABLE AppTranslation
 * @memberof ORM
 * @typedef  {object} server_db_table_AppTranslation
 * @property {number} Id
 * @property {string} Locale
 * @property {{ScreenshotStart:string,Description:string,Pattern:string,Technology:string,Reference:string,Security:string,Comparison:[string,string][][],ScreenshotEnd:string[]}|null} Document
 * @property {string|null} Text
 * @property {ORM['Object']['App']['Id']} AppId
 */

/**
 * @description DB TABLE AppData
 * @memberof ORM
 * @typedef  {object} server_db_table_AppData
 * @property {number} Id
 * @property {string} Name
 * @property {string} Value
 * @property {string} DisplayData
 * @property {string|number|null} Data2
 * @property {string|number|null} Data3
 * @property {string|number|null} Data4
 * @property {string|number|null} Data5
 * @property {ORM['Object']['App']['Id']} AppId
 */

/**
 * @description DB TABLE IamControlIp
 * @memberof ORM
 * @typedef  {object} server_db_table_IamControlIp
 * @property {number} Id
 * @property {string} From
 * @property {string} To
 * @property {number|null} HourFrom
 * @property {number|null} HourTo
 * @property {string|null} DateFrom
 * @property {string|null} DateTo
 * @property {string|null} Action
 * @property {ORM['Object']['App']['Id']|null} AppId 
 */
/**
 * @description DB TABLE IamControlObserve
 * @memberof ORM
 * @typedef  {object} server_db_table_IamControlObserve
 * @property {number} Id
 * @property {string} Ip
 * @property {string} UserAgent
 * @property {string} Host
 * @property {string} AcceptLanguage
 * @property {string} Method
 * @property {string} Url
 * @property {1|0} Status
 * @property {'INVALID_PATH'|'HOST'|'USER_AGENT'|'URI_DECODE'|'BLOCK_IP'|'DECRYPTION_FAIL'|'REQUEST_KEY'|'TOO_MANY_FAILED_LOGIN'} Type
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['IamUser']['Id']|null} IamUserId
 * @property {ORM['Object']['App']['Id']|null} AppId
 */
/**
 * @description DB TABLE IamControlUserAgent
 * @memberof ORM
 * @typedef  {object} server_db_table_IamControlUserAgent
 * @property {number} Id
 * @property {string} Name
 * @property {string} UserAgent
 */
/**
 * @description DB TABLE IamEncryption
 * @memberof ORM
 * @typedef  {object} server_db_table_IamEncryption
 * @property {number} Id
 * @property {string} Uuid
 * @property {string} Secret
 * @property {string|null} Url
 * @property {'BFE'|'APP'|'FONT'} Type
 * @property {string} Created
 * @property {ORM['Object']['App']['Id']} AppId
 * @property {ORM['Object']['IamAppIdToken']['Id']|null} IamAppIdTokenId
 */

/**
 * @description DB TABLE IamMicroserviceToken
 * @memberof ORM
 * @typedef  {object} server_db_table_IamMicroserviceToken
 * @property {number} Id
 * @property {string} ServiceRegistryName
 * @property {0|1} Res
 * @property {string} Token
 * @property {string} Ip
 * @property {string|null} Ua
 * @property {string|null} Host
 * @property {string} Created
 * @property {ORM['Object']['App']['Id']} AppId
 * @property {ORM['Object']['ServiceRegistry']['Id']} ServiceRegistryId
 */

/**
 * @description DB TABLE IamUser
 * @memberof ORM
 * @typedef  {object} server_db_table_IamUser
 * @property {number} Id
 * @property {string} Username
 * @property {string} Password
 * @property {string|null} PasswordReminder
 * @property {string|null} Bio
 * @property {number|null} Private
 * @property {string|null} Avatar
 * @property {string|null} OtpKey
 * @property {'ADMIN'|'USER'} Type
 * @property {number|null} UserLevel
 * @property {number|null} Status
 * @property {number} Active
 * @property {string} Created
 * @property {string|null} Modified
 */

/**
 * @description DB TABLE IamUserFollow
 * @memberof ORM
 * @typedef  {object} server_db_table_IamUserFollow
 * @property {number} Id
 * @property {string} Created
 * @property {ORM['Object']['IamUser']['Id']} IamUserId
 * @property {ORM['Object']['IamUser']['Id']} IamUserIdFollow
 */

/**
 * @description DB TABLE IamUserLike
 * @memberof ORM
 * @typedef  {object} server_db_table_IamUserLike
 * @property {number} Id
 * @property {string} Created
 * @property {ORM['Object']['IamUser']['Id']} IamUserId
 * @property {ORM['Object']['IamUserLike']['Id']} IamUserIdLike
 */

/**
 * @description DB TABLE IamUserView
 * @memberof ORM
 * @typedef  {object} server_db_table_IamUserView
 * @property {number} Id
 * @property {string|null} ClientIp
 * @property {string|null} ClientUserAgent
 * @property {string} Created
 * @property {ORM['Object']['IamUser']['Id']|null} IamUserId
 * @property {ORM['Object']['IamUser']['Id']} IamUserIdView
 */

/**
 * @description DB TABLE IamUserApp
 * @memberof ORM
 * @typedef  {object} server_db_table_IamUserApp
 * @property {number} Id
 * @property {object} Document
 * @property {string|null} Document.PreferenceTheme
 * @property {string|null} Document.PreferenceLocale
 * @property {string|null} Document.PreferenceTimezone
 * @property {string|null} Document.PreferenceDirection
 * @property {string|null} Document.PreferenceArabicScript
 * @property {{[key:string]:string}|null} Document.Custom
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['IamUser']['Id']} IamUserId
 * @property {ORM['Object']['App']['Id']} AppId
 */
/**
 * @description DB TABLE IamUserAppDataPost
 * @memberof ORM
 * @typedef  {object} server_db_table_IamUserAppDataPost
 * @property {number} Id
 * @property {{[key:string]:string}|null} Document
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['IamUserApp']['Id']} IamUserAppId
 */

/**
 * @description DB TABLE IamUserAppDataPostLike
 * @memberof ORM
 * @typedef  {object} server_db_table_IamUserAppDataPostLike
 * @property {number} Id
 * @property {string} Created
 * @property {ORM['Object']['IamUserAppDataPost']['Id']} IamUserAppDataPostId
 * @property {ORM['Object']['IamUserApp']['Id']} IamUserAppId
 */
/**
 * @description DB TABLE IamUserAppDataPostView
 * @memberof ORM
 * @typedef {object} server_db_table_IamUserAppDataPostView
 * @property {number} Id
 * @property {object} Document
 * @property {string|null} Document.client_ip
 * @property {string|null} Document.client_user_agent
 * @property {string} Created
 * @property {ORM['Object']['IamUserApp']['Id']|null} IamUserAppId
 * @property {ORM['Object']['IamUserAppDataPost']['Id']} IamUserAppDataPostId
 */
    
/**
 * @description DB TABLE IamUserEvent
 * @memberof ORM
 * @typedef  {object} server_db_table_IamUserEvent
 * @property {number} Id
 * @property {'OTP_LOGIN'|'OTP_SIGNUP'|'OTP_2FA'|'USER_UPDATE'} Event
 * @property {'INPROGRESS'|'SUCCESSFUL'|'FAIL'} EventStatus
 * @property {string} Created
 * @property {ORM['Object']['IamUser']['Id']} IamUserId
 */

/**
 * @description DB TABLE IamAppIdToken
 * @memberof ORM
 * @typedef  {object} server_db_table_IamAppIdToken
 * @property {number} Id
 * @property {0|1} Res
 * @property {string} Token
 * @property {string} Ip
 * @property {string|null} Ua
 * @property {string} Created
 * @property {ORM['Object']['App']['Id']} AppId
 * @property {ORM['Object']['App']['Id']|null} AppIdToken
 */

 /**
 * @description DB TABLE IamAppAccess
 *              Res: 0=fail, 1=success, 2=invalidated
 * @memberof ORM
 * @typedef  {object} server_db_table_IamAppAccess
 * @property {number} Id
 * @property {'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_ACCESS_EXTERNAL'|'ADMIN'} Type
 * @property {0|1|2} Res
 * @property {string} Ip
 * @property {ORM['Object']['IamUser']['Username']|null} IamUserUsername
 * @property {number|string|null} AppCustomId
 * @property {string|null} Token
 * @property {string|null} Ua
 * @property {string} Created
 * @property {string|null} Modified
 * @property {ORM['Object']['App']['Id']} AppId
 * @property {ORM['Object']['App']['Id']|null} AppIdToken
 * @property {ORM['Object']['IamUserApp']['Id']|null} IamUserAppId
 * @property {ORM['Object']['IamUser']['Id']|null} IamUserId
 */

/**
 * @description DB TABLE_LOG LogAppInfo
 * @memberof ORM
 * @typedef  {object} server_db_table_LogAppInfo
 * @property {number} Id
 * @property {ORM['Object']['App']['Id']|null} AppId
 * @property {string} AppFilename
 * @property {string} AppFunctionName
 * @property {number} AppAppLine
 * @property {string} Logtext
 * @property {string} Created
 */

/**
 * @description DB TABLE_LOG LogDbInfo
 * @memberof ORM
 * @typedef  {object} server_db_table_LogDbInfo
 * @property {number} Id
 * @property {ORM['Object']['App']['Id']|null} AppId
 * @property {string} Object
 * @property {string} Dml
 * @property {{}} Parameters
 * @property {string} Logtext
 * @property {string} Created
 */

/**
 * @description DB TABLE_LOG LogBffInfo
 * @memberof ORM
 * @typedef  {object} server_db_table_LogBffInfo
 * @property {number} Id
 * @property {ORM['Object']['App']['Id']|null} AppId
 * @property {string} Service
 * @property {string} Method
 * @property {string} Url
 * @property {string|null} Operation
 * @property {string} Parameters
 * @property {string} Logtext
 * @property {string} Created
 */
         
/**
 * @description DB TABLE_LOG LogRequestInfo
 * @memberof ORM
 * @typedef  {object} server_db_table_LogRequestInfo
 * @property {number} Id
 * @property {string} Host
 * @property {ORM['Object']['App']['Id']|null} AppId
 * @property {1|0|null} AppIdAuth
 * @property {string} Ip
 * @property {string} RequestId
 * @property {string} CorrelationId
 * @property {string} Url
 * @property {string|null} XUrl
 * @property {string} HttpInfo
 * @property {string} Method
 * @property {string|null} XMethod
 * @property {number} StatusCode
 * @property {string} StatusMessage
 * @property {string} UserAgent
 * @property {string} AcceptLanguage
 * @property {string} Referer
 * @property {number} SizeReceived
 * @property {number} SizeSent
 * @property {number} ResponseTime
 * @property {string} Logtext
 * @property {string} Created
 */

/**
 * @description DB TABLE_LOG LogServerInfo
 * @memberof ORM
 * @typedef  {object} server_db_table_LogServerInfo
 * @property {number} Id
 * @property {string} LogText
 * @property {string} Created
 */

/**
 * @description DB DOCUMENT ServiceRegistry
 * @memberof ORM
 * @typedef  {object} server_db_table_ServiceRegistry
 * @property {number} Id
 * @property {string} Name
 * @property {'http'} ServerProtocol
 * @property {string} ServerHost
 * @property {number} ServerPort
 * @property {string|null} MetricsUrl
 * @property {string|null} HealthUrl
 * @property {number} RestApiVersion
 * @property {string} Uuid
 * @property {string} Secret
 * @property {string} Status
 * @property {string} Created
 * @property {string|null} Modified
 */

/**
 * @description DB DOCUMENT OpenApi
 *              Follows Open API syntax
 * @memberof ORM
 * @typedef  {object} server_db_document_OpenApi
 * @property {{title: string,version: string,description: string,'x-created':string,'x-modified':string}} info
 * @property {{url: string,description: string,variables: {protocol: {default: string},host: {default: string},port: {default: number},basePath: {default: string},config?:[key:{default:*, description:string}]},"x-type": {"$ref": string,default: "APP"|"ADMIN"|"NOHANGING_HTTPS"|"REST_API"},}[]} servers
 * @property {{[key:string]: {[key in 'get'|'post'|'delete'|'patch'|'put']:{summary: string,operationId: string,parameters: [{[key:string]:boolean|string|{}}],requestBody: {description:string,required:boolean,content:{[key:string]: {[key:string]: string|boolean}}},responses: {[key:string]: {[key:string]: string}}}}}} paths
 * @property {object}               components
 * @property {{[key:string]: {}}}   components.securitySchemes
 * @property {object}               components.parameters
 * @property {Object<string,{default:*, description:string}>} components.parameters.config
 * @property {[key:*]}              components.parameters.paths
 * @property {{[key:string]: {description: string,content: {'application/json': {schema: {"$ref": string}}}}}}  components.responses
 */

/**
 * @description DB TABLE MessageQueuePublish
 * @memberof ORM
 * @typedef  {object} server_db_table_MessageQueuePublish
 * @property {number} [Id]
 * @property {'MESSAGE'|'BATCH'} Service
 * @property {object}       Message
 * @property {number}       [Message.Id]
 * @property {'MICROSERVICE_ERROR'|'MICROSERVICE_LOG'} [Message.Type]
 * @property {string|null}  [Message.Sender]
 * @property {number|null}  [Message.ReceiverId]
 * @property {string}       [Message.Host]
 * @property {string}       [Message.ClientIp]
 * @property {string}       [Message.Subject]
 * @property {string}       Message.Message
 * @property {string}       [Message.Created]
 * @property {string}       [Created]
 */

/**
 * @description DB TABLE MessageQueueConsume
 * @memberof ORM
 * @typedef  {object} server_db_table_MessageQueueConsume
 * @property {number} Id
 * @property {*} Message
 * @property {string|null} Start
 * @property {string|null} Finished
 * @property {*} Result
 * @property {string} Created
 * @property {string|null} Modified
 * @property {number} MessageQueuePublishId
 */

/**
 * @description DB TABLE MessageQueueError
 * @memberof ORM
 * @typedef  {object} server_db_table_MessageQueueError
 * @property {number} Id
 * @property {*} Message
 * @property {*} Result
 * @property {string} Created
 * @property {number} MessageQueuePublishId
 */

/**
 * @description DB VIEW ViewLogGetStat
 * @memberof ORM
 * @typedef  {object} ViewLogGetStat
 * @property {1|2|null} Chart
 * @property {string|number|null} StatValue
 * @property {number} Year
 * @property {number} Month
 * @property {number|null} Day
 * @property {number|null} Amount
 */
/**
 * @description DB VIEW ViewAppGetInfo
 * @memberof ORM
 * @typedef  {object} ViewAppGetInfo
 * @property {ORM['Object']['App']['Id']} Id
 * @property {ORM['Object']['App']['Name']} Name
 * @property {ORM['Object']['App']['Logo']} Logo
 * @property {ORM['Object']['App']['Js']} Js
 * @property {ORM['Object']['App']['Css']} Css
 * @property {ORM['Object']['App']['CssReport']} CssReport
 * @property {ORM['Object']['App']['TextEdit']} TextEdit
 * @property {ORM['Object']['App']['Copyright']} Copyright
 * @property {ORM['Object']['App']['LinkTitle']} LinkTitle
 * @property {ORM['Object']['App']['LinkUrl']} LinkUrl
 */
/**
 * @description DB VIEW ViewIamUsetGetProfile
 * @memberof ORM
 * @typedef  {object} ViewIamUsetGetProfile
 * @property {ORM['Object']['IamUser']['Id']} Id
 * @property {ORM['Object']['IamUser']['Active']} Active
 * @property {ORM['Object']['IamUser']['Username']} Username
 * @property {ORM['Object']['IamUser']['Bio']} Bio
 * @property {ORM['Object']['IamUser']['Private']} Private
 * @property {ORM['Object']['IamUser']['UserLevel']} UserLevel
 * @property {ORM['Object']['IamUser']['Avatar']} Avatar
 * @property {number|null} Friends
 * @property {string} Created
 * @property {number} CountFollowing
 * @property {number} CountFollowed
 * @property {number} CountLikes
 * @property {number} CountLiked
 * @property {number} CountViews
 * @property {ORM['Object']['IamUserFollow']['Id']|null} FollowedId
 * @property {ORM['Object']['IamUserLike']['Id']|null} LikedId
 */
/**
 * @description DB VIEW ViewIamUserGetProfileDetail
 * @memberof ORM
 * @typedef  {object} ViewIamUserGetProfileDetail
 * @property {'FOLLOWING'|'FOLLOWED'|'LIKE_USER'|'LIKED_USER'} Detail
 * @property {ORM['Object']['IamUserFollow']['IamUserId']|ORM['Object']['IamUserLike']['IamUserId']} IamUserId
 * @property {ORM['Object']['IamUser']['Avatar']} Avatar
 * @property {ORM['Object']['IamUser']['Username']} Username
 */
/**
 * @description DB VIEW ViewIamUserGetProfileStat
 * @memberof ORM
 * @typedef  {object} ViewIamUserGetProfileStat
 * @property {'VISITED|FOLLOWING|LIKE_USER'} Top
 * @property {ORM['Object']['IamUser']['Id']} Id
 * @property {ORM['Object']['IamUser']['Avatar']} Avatar
 * @property {ORM['Object']['IamUser']['Username']} Username
 * @property {number} Count
 */
/**
 * @description DB VIEW ViewIamUserGetStatCountAdmin
 * @memberof ORM
 * @typedef  {object} ViewIamUserGetStatCountAdmin
 * @property {number} CountUsers
 */
/**
 * @description DB VIEW ViewIamUserAppDataPostgetProfileUserPosts
 * @memberof ORM
 * @typedef  {object} ViewIamUserAppDataPostgetProfileUserPosts
 * @property {ORM['Object']['IamUserAppDataPost']['Id']} Id
 * @property {string} Description
 * @property {ORM['Object']['IamUserApp']['IamUserId']} IamUserId
 * @property {ORM['Object']['IamUserAppDataPost']['Document']} Document
 * @property {number} CountLikes
 * @property {number} CountViews
 * @property {number} Liked
 */

/**
 * @description DB VIEW ViewIamUserAppDataPostGetProfileStatLike
 * @memberof ORM
 * @typedef  {object} ViewIamUserAppDataPostGetProfileStatLike
 * @property {number} CountUserPostLikes
 * @property {number} CountUserPostLiked
 */
/**
 * @description DB VIEW ViewIamUserAppDataPostGetProfileStatPost
 * @memberof ORM
 * @typedef  {object} ViewIamUserAppDataPostGetProfileStatPost
 * @property {'LIKED_POST'|'VIEWED_POST'} Top
 * @property {ORM['View']['IamUserGetProfileStat']['Id']} Id
 * @property {ORM['View']['IamUserGetProfileStat']['Avatar']} Avatar
 * @property {ORM['View']['IamUserGetProfileStat']['Username']} Username
 * @property {ORM['View']['IamUserGetProfileStat']['Count']} Count
 */
/**
 * @description DB VIEW ViewIamUserAppdataPostGetProfileUserPostDetail
 * @memberof ORM
 * @typedef  {object} ViewIamUserAppdataPostGetProfileUserPostDetail
 * @property {'LIKE_POST'|'LIKED_POST'} Detail
 * @property {ORM['Object']['IamUserApp']['IamUserId']} IamUserId
 * @property {ORM['Object']['IamUser']['Avatar']} Avatar
 * @property {ORM['Object']['IamUser']['Username']} Username
 */
/**
 * @description DB VIEW ViewORMGetInfo
 * @memberof ORM
 * @typedef  {object} ViewORMGetInfo
 * @property {string} DatabaseName
 * @property {number} Version
 * @property {string} Hostname
 * @property {number} Connections
 * @property {number} Started
 */
/**
 * @description DB VIEW ViewORMGetObjects
 * @memberof ORM
 * @typedef {object} ViewORMGetObjects
 * @property {ORM['MetaData']['Object']['Name']} Name
 * @property {ORM['MetaData']['Object']['Type']} Type
 * @property {ORM['MetaData']['Object']['InMemory']} InMemory
 * @property {ORM['MetaData']['Object']['Lock']} Lock
 * @property {ORM['MetaData']['Object']['TransactionId']} TransactionId
 * @property {number|null} Rows
 * @property {number|null} Size
 * @property {ORM['MetaData']['Object']['Pk']} Pk
 * @property {ORM['MetaData']['Object']['Uk']} Uk
 * @property {ORM['MetaData']['Object']['Fk']} Fk
 * @property {ORM['MetaData']['Object']['Description']} Description
 */

/** 
 * @description DB object record
 * @namespace ORM
 * @typedef {object} server_db_ORM
 * @property {keyof ORM['Object']} Name
 * @property {'DOCUMENT'|'TABLE'|'TABLE_KEY_VALUE'|'TABLE_LOG'|'TABLE_LOG_DATE'} Type
 * @property {boolean} InMemory
 * @property {*} Content
 * @property {number} Lock
 * @property {number|null} TransactionId
 * @property {object|[]|null} TransactionContent
 * @property {*} CacheContent
 * @property {string|null} Pk
 * @property {string[]|null} Uk
 * @property {[string,string, keyof ORM['Object']][]|null} Fk
 * @property {string} Description
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
 * @description IAM server_iam_user
 * @typedef {{ Id: server['ORM']['Object']['IamUser']['Id'],
 *             Username: server['ORM']['Object']['IamUser']['Username'],
 *             Password:server['ORM']['Object']['IamUser']['Password'],
 *             PasswordReminder:server['ORM']['Object']['IamUser']['PasswordReminder'],
 *             Type:server['ORM']['Object']['IamUser']['Type'],
 *             Bio:server['ORM']['Object']['IamUser']['Bio'],
 *             Private:server['ORM']['Object']['IamUser']['Private'],
 *             Avatar:server['ORM']['Object']['IamUser']['Avatar'],
 *             UserLevel:server['ORM']['Object']['IamUser']['UserLevel'],
 *             Status:server['ORM']['Object']['IamUser']['Status'],
 *             Created:server['ORM']['Object']['IamUser']['Created'],
 *             Modified:server['ORM']['Object']['IamUser']['Modified'],
 *             LastLoginTime:string}} server_iam_user
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
 * @property {string} path
 * @property {string} url
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
 *              'sec-fetch-dest':string,
 *              'sec-fetch-mode':string,
 *              'sec-fetch-site':string,
 *              'x-forwarded-for':string}} headers
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
 * @property {function} end
 * @property {function} send
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
 * @description SOCKET ViewSocketConnectedServer
 * @typedef {{Id:number,
 *            IamUserUsername:string|null,
 *            IamUserType:'ADMIN'|'USER'|null,
 *            Ip:string,
 *            GpsLatitude:string|null,
 *            GpsLongitude:string|null,
 *            Place:string,
 *            Timezone:string,
 *            UserAgent:string,
 *            IdToken:string,
 *            TokenAccess:string|null,
 *            TokenAdmin:string|null,
 *            Uuid:string|null,
 *            Response:server_server_res|null,
 *            Created:string,
 *            AppId:number,
 *            IamUserid:number|null}} ViewSocketConnectedServer
 */
/**
 * @description SOCKET ViewSocketConnectedClient
 * @typedef {{Id:ViewSocketConnectedServer['Id'],
 *            IamUserUsername:ViewSocketConnectedServer['IamUserUsername'],
 *            IamUserType:ViewSocketConnectedServer['IamUserType'],
 *            Ip:ViewSocketConnectedServer['Ip'],
 *            GpsLatitude:ViewSocketConnectedServer['GpsLatitude'],
 *            GpsLongitude:ViewSocketConnectedServer['GpsLongitude'],
 *            Place:ViewSocketConnectedServer['Place'],
 *            Timezone:ViewSocketConnectedServer['Timezone'],
 *            UserAgent:ViewSocketConnectedServer['UserAgent'],
 *            Created:ViewSocketConnectedServer['Created'],
 *            AppId:ViewSocketConnectedServer['AppId'],
 *            IamUserid:ViewSocketConnectedServer['IamUserid']}} ViewSocketConnectedClient
 */
/** 
 * @description SOCKET server_socket_broadcast_type
 * @typedef {'ALERT'|'MAINTENANCE'|'CHAT'|'PROGRESS'|'PROGRESS_LOADING'|'EXPIRED_ACCESS'|'EXPIRED_SESSION'|'CONNECTINFO'|'APP_FUNCTION'|'MESSAGE'|'FONT_URL'} server_socket_broadcast_type
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
 *   environment:                   string,
 *   server_host:		            string,
 *   server_port:                   number,
 *   service_registry_auth_url:		string,
 *   service_registry_auth_method:  'POST',
 *   message_queue_url:	            string,
 *   message_queue_method:	        'POST',
 *   iam_auth_app_path:	            string,
 *   iam_auth_app_method:	        'POST',
 *   uuid:                          string,
 *   secret:                        string,
 *   config:{url_ip:string, url_place:string}}} microservice_local_config
 */


/**
 * @description ORM
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
 *                    LogBffInfo:server_db_table_LogBffInfo,
 *                    LogBffVerbose:server_db_table_LogBffInfo,
 *                    LogBffError:server_db_table_LogBffInfo,
 *                    LogRequestInfo:server_db_table_LogRequestInfo,
 *                    LogRequestVerbose:server_db_table_LogRequestInfo,
 *                    LogRequestError:server_db_table_LogRequestInfo,
 *                    LogServerInfo:server_db_table_LogServerInfo,
 *                    LogServerError:server_db_table_LogServerInfo,
 *                    OpenApi:server_db_document_OpenApi,
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
 *                ORMGetObjects:ViewORMGetObjects
 *              },
 *            Type:{
 *              TokenType:'APP_ID'|server_db_table_IamAppAccess['Type']|'MICROSERVICE',
 *              DemoData:server_db_database_demo_data
 *              },
 *            MetaData:{
 *                Object:server_db_ORM,
 *                AllObjects: server_db_ORM['Name']|'ORM',
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
 *                commonAppSwitch:commonAppSwitch
 *                },
 *          bff:{
 *                parameters:server_bff_parameters,
 *                RestApi_parameters:server_bff_RestApi_parameters
 *              },
 *          iam:{
 *                iam_access_token_claim:server_iam_access_token_claim,
 *                iam_microservice_token_claim:server_iam_microservice_token_claim,
 *                iam_user: server_iam_user
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
 *                SocketConnectedClient:ViewSocketConnectedClient,
 *                SocketConnectedServer:ViewSocketConnectedServer
 *                broadcast_type:server_socket_broadcast_type
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