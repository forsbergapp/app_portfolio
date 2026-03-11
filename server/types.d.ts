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
 * @name server_apps_app_info
 * @description APP server_apps_app_info
 */
type server_apps_app_info = {
        app_id:number,
        locale:string,
        admin_only:0|1,
        idtoken:string,
        latitude:string,
        longitude:string,
        place:string,
        timezone:string,
        module: string|null
}

/**
 * @name server_apps_globals
 * @description APP server_apps_globals
 */
type server_apps_globals = {
        Parameters:{
            rest_resource_bff:string,
            app_rest_api_version:string,
            app_rest_api_basepath:string,
            app_common_app_id:number,
            app_admin_app_id:number,
            app_start_app_id:number,
            app_toolbar_button_start:number,
            app_toolbar_button_framework:number,
            app_framework:number,
            app_framework_messages:number,
            admin_only:number,
            admin_first_time:number,
            app_request_tries:number,
            app_requesttimeout_seconds:number,
            app_requesttimeout_admin_minutes:number,
            app_content_type_json:string,
            app_content_type_html:string,
            app_content_type_sse:string,
            app_font_timeout:number
        },
        Data:{
            Apps:ORM['View']['AppGetInfo'][]
            AppData:[ORM['Object']['AppData']['AppId'], ORM['Object']['AppData']['Name'], ORM['Object']['AppData']['Value'], ORM['Object']['AppData']['DisplayData']][],
            cssCommon:string,
            cssFontsArray:string[],
            token_dt:string|null,
            client_latitude:string|null,
            client_longitude:string|null,
            client_place:string|null,
            client_timezone:string|null
        }
}
/**
 * @name server_apps_report_query_parameters
 * @description APP server_apps_report_query_parameters
 */
type server_apps_report_query_parameters = {
        module:string,
        uid_view:number,
        url:string,
        ps?:string,
        hf?:number,
        format:string
}
/**
 * @name server_apps_report_create_parameters
 * @description APP server_apps_report_create_parameters
 */
type server_apps_report_create_parameters = {
        app_id: number,
        queue_parameters?:object,
        reportid:string,
        ip:string,
        user_agent:string
}
/**
 * @name server_apps_module_metadata
 * @description APP server_apps_module_metadata
 */
type server_apps_module_metadata = {
        param:{ 
                name:string,
                text:string,
                default:string|number
        }
}
/**
 * @name server_config_apps_status
 * @description APP server_config_apps_status
 */
type server_config_apps_status = 'ONLINE'|'OFFLINE'
/**
 * @name serverComponentLifecycle
 * @description APP serverComponentLifecycle
 */
type serverComponentLifecycle = {
        onBeforeMounted?:Function|null,
        onMounted?:Function|null,
        onUnMounted?:Function|null
}
/**
 * @name serverDocumentMenu
 * @description APP serverDocumentMenu
 */
type serverDocumentMenu = {
        id:number,
        menu:string,
        type:'MENU'|'APP'|'GUIDE'|'MODULE_CODE'|'MODULE_APPS'|'MODULE_SERVICEREGISTRY'|'MODULE_SERVER'|'MODULE_TEST',
        menu_sub:{id:number, menu:string,doc:string}[]|null
}
/**
 * @name commonWorldCitiesCity
 * @description APP commonWorldCitiesCity
 *              Database content, not all used:
 *              {
 *              "city":         [city with diacritics],
 *              "city_ascii":   [city_ascii],
 *              "lat":          [latitude],
 *              "lng":          [longitude],					
 *              "country":      [country],			
 *              "iso2":         [countrycode 2 letters],
 *              "iso3":         [countrycode 3 letters],
 *              "admin_name":   [admin name],
 *              "capital":      [admin, minor, primary, ''],
 *              "population":   [count],
 *              "id":           [id]
 *		        } 
 */
type commonWorldCitiesCity = {
        city:       string,
        lat:        string,
        lng:        string,
        country:    string,
        iso2:       string,
        admin_name: string
}
/**
 * @name commonAppSwitch
 * @description APP commonAppSwitch
 */
type commonAppSwitch = {
        IamUserApp:ORM['Object']['IamUserApp']|null
}
/**
 * @name server_bff_parameters
 * @description BFF server_bff_parameters
 */
type server_bff_parameters = {
        app_id:number,
        endpoint:'APP'|'APP_ID'|'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_EXTERNAL'|'APP_ACCESS_EXTERNAL'|'ADMIN'|'SOCKET'|'IAM'|'IAM_SIGNUP'|'SERVER'|'MICROSERVICE'|'MICROSERVICE_AUTH' & string,
        host:string|null,
        url:string,
        uuid:string,
        method: string,
        URI_path:string,
        query: string,
        body:server_server_req['body'] & {type?:string, IAM_data_app_id?:number|null, data?:string}|null,
        security_app:{
            AppId:  server_server_req['headers']['app-id'], 
            AppSignature:  server_server_req['headers']['app-signature'], 
            AppIdToken:  server_server_req['headers']['app-id-token']
        }|null,
        authorization:string|null,
        ip: string,
        user_agent:string,
        accept_language:string,
        jwk:JsonWebKey|null,
        iv:string|null,
        res:server_server_res,
        XAppId:server['ORM']['Object']['App']['Id']|null,
        XAppIdAuth:server['ORM']['Object']['App']['Id']|null,
        XUrl:server['server']['req']['url']|null,
        XMethod:server['server']['req']['method']|null
}
/**
 * @name server_bff_RestApi_parameters
 * @description BFF server_bff_RestApi_parameters
 */
type server_bff_RestApi_parameters = {
        app_id:number,
        endpoint: server_bff_parameters['endpoint'],
        host:string,
        url:string,
        uuid:string,
        method: server_server_req['method'],
        URI_path:string,
        app_query:URLSearchParams|null,
        body:any,
        idToken:string
        authorization:string,
        ip: string,
        user_agent:string,
        accept_language:string,
        res:server_server_res
}
/**
 * @name server_db_object_App
 * @description DB TABLE App
 * @memberof ORM
 */
type server_db_object_App = {
        /**@property*/
        Id: number,
        /**@property*/
        Name:string,
        /**@property*/
        Path:string,
        /**@property*/
        Logo:string,
        /**@property*/
        Js:string,
        /**@property*/
        Css:string,
        /**@property*/
        CssReport:string|null,
        /**@property*/
        TextEdit:string,
        /**@property*/
        Copyright:string|null,
        /**@property*/
        LinkTitle:string|null,
        /**@property*/
        LinkUrl:string|null,
        /**@property*/
        Status:'ONLINE'|'OFFLINE'
}
/**
 * @name server_db_object_AppDataEntity
 * @description DB TABLE AppDataEntity
 * @memberof ORM
 */
type server_db_object_AppDataEntity = {
        /**@property*/
        Id:number,
        /**@property*/
        Document:{[key:string]:string}|null,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        AppId:ORM['Object']['App']['Id']
}

/**
 * @name server_db_object_AppDataEntityResource
 * @description DB TABLE AppDataEntityResource
 * @memberof ORM
 */
type server_db_object_AppDataEntityResource = {
        /**@property*/
        Id:number,
        /**@property*/
        Document:{[key:string]:string}|null,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        AppDataEntityId:ORM['Object']['AppDataEntity']['Id'],
        /**@property*/
        AppDataId:ORM['Object']['AppData']['Id']
}
/**
 * @name server_db_object_AppDataResourceMaster
 * @description DB TABLE AppDataResourceMaster
 * @memberof ORM
 */
type server_db_object_AppDataResourceMaster = {
        /**@property*/
        Id:number,
        /**@property*/
        Document:{[key:string]:any}|null,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        IamUserAppId:ORM['Object']['IamUserApp']['Id']|null,
        /**@property*/
        AppDataEntityResourceId:ORM['Object']['AppDataEntityResource']['Id']
}
/**
 * @name server_db_object_AppDataResourceDetail
 * @description DB TABLE AppDataResourceDetail
 * @memberof ORM
 */
type server_db_object_AppDataResourceDetail = {
        /**@property*/
        Id:number,
        /**@property*/
        Document:{[key:string]:string}|null,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        AppDataResourceMasterId:ORM['Object']['AppDataResourceMaster']['Id'],
        /**@property*/
        AppDataEntityResourceId:ORM['Object']['AppDataEntityResource']['Id'],
        /**@property*/
        AppDataResourceMasterAttributeId:ORM['Object']['AppDataResourceMaster']['Id']|null
}
/**
 * @name server_db_object_AppDataResourceDetailData
 * @description DB TABLE AppDataResourceDetailData
 * @memberof ORM
 */
type server_db_object_AppDataResourceDetailData = {
        /**@property*/
        Id:number,
        /**@property*/
        Document:{[key:string]:string}|null,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        AppDataResourceDetailId:ORM['Object']['AppDataResourceDetail']['Id'],
        /**@property*/
        AppDataResourceMasterAttributeId:ORM['Object']['AppDataResourceMaster']['Id']|null
}
/**
 * @name server_db_object_AppModule
 * @description DB TABLE AppModule
 * @memberof ORM
 */
type server_db_object_AppModule = {
        /**@property*/
        Id:number,
        /**@property*/
        ModuleType:'FUNCTION'|'ASSET'|'REPORT',
        /**@property*/
        ModuleName:string,
        /**@property*/
        ModuleRole:'APP_ID'|'APP_ACCESS'|'APP_ACCESS_EXTERNAL'|'ADMIN'|'',
        /**@property*/
        ModulePath:string,
        /**@property*/
        ModuleDescription:string,
        /**@property*/
        AppId:ORM['Object']['App']['Id']
}
/**
 * @name server_db_object_AppModuleQueue
 * @description DB TABLE AppModuleQueue
 * @memberof ORM
 */
type server_db_object_AppModuleQueue = {
        /**@property*/
        Id:number,
        /**@property*/
        Type:Extract<ORM['Object']['AppModule']['ModuleType'],'REPORT'>,
        /**@property*/
        Name:ORM['Object']['AppModule']['ModuleName'],
        /**@property*/
        Parameters:string,
        /**@property*/
        User:ORM['Object']['IamUser']['Username'],
        /**@property*/
        Start:string|null,
        /**@property*/
        End:string|null,
        /**@property*/
        Progress:number|null,
        /**@property*/
        Status:'PENDING'|'RUNNING'|'COMPLETED'|'SUCCESS'|'FAIL',
        /**@property*/
        Message:string|null,
        /**@property*/
        IamUserId:ORM['Object']['IamUser']['Id'],
        /**@property*/
        AppModuleId:ORM['Object']['AppModule']['Id'],
        /**@property*/
        AppId:ORM['Object']['App']['Id']
}
/**
 * @name server_db_object_AppTranslation
 * @description DB TABLE AppTranslation
 * @memberof ORM
 */
type server_db_object_AppTranslation = {
        /**@property*/
        Id:number,
        /**@property*/
        Locale: string,
        /**@property*/
        Document: {ScreenshotStart:string,Description:string,Pattern:string,Technology:string,Reference:string,Security:string,Comparison:[string,string][][],ScreenshotEnd:string[]}|null,
        /**@property*/
        Text: string|null,
        /**@property*/
        AppId:ORM['Object']['App']['Id']
}

/**
 * @name server_db_object_AppData
 * @description DB TABLE AppData
 * @memberof ORM
 */
type server_db_object_AppData = {
        /**@property*/
        Id: number,
        /**@property*/
        Name: string,
        /**@property*/
        Value: string,
        /**@property*/
        DisplayData:string,
        /**@property*/
        Data2:string|number|null,
        /**@property*/
        Data3:string|number|null,
        /**@property*/
        Data4:string|number|null,
        /**@property*/
        Data5:string|number|null,
        /**@property*/
        AppId: ORM['Object']['App']['Id']
}

/**
 * @name server_db_object_IamControlIp
 * @description DB TABLE IamControlIp
 * @memberof ORM
 */
type server_db_object_IamControlIp = {
        /**@property*/
        Id:number,
        /**@property*/
        From:string,
        /**@property*/
        To:string,
        /**@property*/
        HourFrom:number|null,
        /**@property*/
        HourTo:number|null,
        /**@property*/
        DateFrom:string|null,
        /**@property*/
        DateTo:string|null,
        /**@property*/
        Action:string|null,
        /**@property*/
        AppId:ORM['Object']['App']['Id']|null
}
/**
 * @name server_db_object_IamControlObserve
 * @description DB TABLE IamControlObserve
 * @memberof ORM
 */
type server_db_object_IamControlObserve = {
        /**@property*/
        Id:number,
        /**@property*/
        Ip:string,
        /**@property*/
        UserAgent:string,
        /**@property*/
        Host:string,
        /**@property*/
        AcceptLanguage:string,
        /**@property*/
        Method:string,
        /**@property*/
        Url:string,
        /**@property*/
        Status:1|0,
        /**@property*/
        Type:'INVALID_PATH'|'HOST'|'USER_AGENT'|'URI_DECODE'|'BLOCK_IP'|'DECRYPTION_FAIL'|'REQUEST_KEY'|'TOO_MANY_FAILED_LOGIN',
        /**@property*/
        Created: string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        IamUserId:ORM['Object']['IamUser']['Id']|null,
        /**@property*/
        AppId:ORM['Object']['App']['Id']|null
}
/**
 * @name server_db_object_IamControlUserAgent
 * @description DB TABLE IamControlUserAgent
 * @memberof ORM
 */
type server_db_object_IamControlUserAgent = {
        /**@property*/
        Id:number,
        /**@property*/
        Name:string,
        /**@property*/
        UserAgent:string
}
/**
 * @name server_db_object_IamEncryption
 * @description DB TABLE IamEncryption
 * @memberof ORM
 */
type server_db_object_IamEncryption = {
        /**@property*/
        Id:number,
        /**@property*/
        Uuid:string,
        /**@property*/
        Secret:string,
        /**@property*/
        Url:string|null,
        /**@property*/
        Type:'BFE'|'APP'|'FONT',
        /**@property*/
        Created:string,
        /**@property*/
        AppId:ORM['Object']['App']['Id'],
        /**@property*/
        IamAppIdTokenId:ORM['Object']['IamAppIdToken']['Id']|null
}
/**
 * @name server_db_object_IamMicroserviceToken
 * @description DB TABLE IamMicroserviceToken
 * @memberof ORM
 */
type server_db_object_IamMicroserviceToken = {
        /**@property*/
        Id:number,
        /**@property*/
        ServiceRegistryName:string,
        /**@property*/
        Res:1|0,
        /**@property*/
        Token:string,
        /**@property*/
        Ip:string,
        /**@property*/
        Ua:string|null,
        /**@property*/
        Host:string|null,
        /**@property*/
        Created:string,
        /**@property*/
        AppId:ORM['Object']['App']['Id'],
        /**@property*/
        ServiceRegistryId:ORM['Object']['ServiceRegistry']['Id']
}
/**
 * @name server_db_object_IamUser
 * @description DB TABLE IamUser
 * @memberof ORM
 */
type server_db_object_IamUser = {
        /**@property*/
        Id:number,
        /**@property*/
        Username:string,
        /**@property*/
        Password:string,
        /**@property*/
        PasswordReminder:string|null,
        /**@property*/
        Bio:string|null,
        /**@property*/
        Private:number|null,
        /**@property*/
        Avatar:string|null,
        /**@property*/
        OtpKey:string|null,
        /**@property*/
        Type:'ADMIN'|'USER',
        /**@property*/
        UserLevel:number|null,
        /**@property*/
        Status:number|null
        /**@property*/
        Active:number,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null
}
/**
 * @name server_db_object_IamUserFollow
 * @description DB TABLE IamUserFollow
 * @memberof ORM
 */
type server_db_object_IamUserFollow = {
        /**@property*/
        Id:number,
        /**@property*/
        Created:string,
        /**@property*/
        IamUserId:ORM['Object']['IamUser']['Id'],
        /**@property*/
        IamUserIdFollow:ORM['Object']['IamUser']['Id']
}
/**
 * @name server_db_object_IamUserLike
 * @description DB TABLE IamUserLike
 * @memberof ORM
 */
type server_db_object_IamUserLike = {
        /**@property*/
        Id:number,
        /**@property*/
        Created:string,
        /**@property*/
        IamUserId:ORM['Object']['IamUser']['Id'],
        /**@property*/
        IamUserIdLike:ORM['Object']['IamUser']['Id']
}
/**
 * @name server_db_object_IamUserView
 * @description DB TABLE IamUserView
 * @memberof ORM
 */
type server_db_object_IamUserView = {
        /**@property*/
        Id:number,
        /**@property*/
        ClientIp:string|null,
        /**@property*/
        ClientUserAgent:string|null,
        /**@property*/
        Created:string,
        /**@property*/
        IamUserId:ORM['Object']['IamUser']['Id']|null,
        /**@property*/
        IamUserIdView:ORM['Object']['IamUser']['Id']
}
/**
 * @name server_db_object_IamUserApp
 * @description DB TABLE IamUserApp
 * @memberof ORM
 */
type server_db_object_IamUserApp = {
        /**@property*/
        Id:number,
        /**@property*/
        Document:{
            PreferenceTheme:string|null,
            PreferenceLocale:string|null
            PreferenceTimezone:string|null
            PreferenceDirection:string|null
            PreferenceArabicScript:string|null,
            Custom:{[key:string]:string}|null
        },
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        IamUserId:ORM['Object']['IamUser']['Id']|null,
        /**@property*/
        AppId:ORM['Object']['App']['Id']
}
/**
 * @name server_db_object_IamUserAppDataPost
 * @description DB TABLE IamUserAppDataPost
 * @memberof ORM
 */
type server_db_object_IamUserAppDataPost = {
        /**@property*/
        Id:number,
        /**@property*/
        Document:{[key:string]:string}|null,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        IamUserAppId:ORM['Object']['IamUserApp']['Id']
}

/**
 * @name server_db_object_IamUserAppDataPostLike
 * @description DB TABLE IamUserAppDataPostLike
 * @memberof ORM
 */
type server_db_object_IamUserAppDataPostLike = {
        /**@property*/
        Id:number,
        /**@property*/
        Created:string,
        /**@property*/
        IamUserAppDataPostId:ORM['Object']['IamUserAppDataPost']['Id'],
        /**@property*/
        IamUserAppId:ORM['Object']['IamUserApp']['Id']
}
/**
 * @name server_db_object_IamUserAppDataPostView
 * @description DB TABLE IamUserAppDataPostView
 * @memberof ORM
 */
type server_db_object_IamUserAppDataPostView = {
        /**@property*/
        Id:number,
        /**@property*/
        Document:{
            client_ip:string|null,
            client_user_agent:string|null
        },
        /**@property*/
        Created:string,
        /**@property*/
        IamUserAppId:ORM['Object']['IamUserApp']['Id']|null,
        /**@property*/
        IamUserAppDataPostId:ORM['Object']['IamUserAppDataPost']['Id']
}
    
/**
 * @name server_db_object_IamUserEvent
 * @description DB TABLE IamUserEvent
 * @memberof ORM
 */
type server_db_object_IamUserEvent = {
        /**@property*/
        Id:number,
        /**@property*/
        Event:'OTP_LOGIN'|'OTP_SIGNUP'|'OTP_2FA'|'USER_UPDATE',
        /**@property*/
        EventStatus:'INPROGRESS'|'SUCCESSFUL'|'FAIL',
        /**@property*/
        Created:string,
        /**@property*/
        IamUserId:ORM['Object']['IamUser']['Id']
}

/**
 * @name server_db_object_IamAppIdToken
 * @description DB TABLE IamAppIdToken
 * @memberof ORM
 */
type server_db_object_IamAppIdToken = {
        /**@property*/
        Id:number,
        /**@property*/
        Res:0|1,
        /**@property*/
        Token:string,
        /**@property*/
        Ip:string,
        /**@property*/
        Ua:string|null,
        /**@property*/
        Created:string,
        /**@property*/
        AppId:ORM['Object']['App']['Id'],
        /**@property*/
        AppIdToken:ORM['Object']['App']['Id']|null
}
/**
 * @name server_db_object_IamAppAccess
 * @description DB TABLE IamAppAccess
 *              Res:0=fail, 1=success, 2=invalidated
 * @memberof ORM
 */
type server_db_object_IamAppAccess = {
        /**@property*/
        Id:number,
        /**@property*/
        Type:'APP_ACCESS'|'APP_ACCESS_VERIFICATION'|'APP_ACCESS_EXTERNAL'|'ADMIN',
        /**@property*/
        Res:0|1|2, 
        /**@property*/
        Ip:string,
        /**@property*/
        IamUserUsername:ORM['Object']['IamUser']['Username']|null,
        /**@property*/
        AppCustomId:number|string|null,
        /**@property*/
        Token:string|null,
        /**@property*/
        Ua:string|null,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        AppId:ORM['Object']['App']['Id'],
        /**@property*/
        AppIdToken:ORM['Object']['App']['Id']|null,
        /**@property*/
        IamUserAppId:ORM['Object']['IamUserApp']['Id']|null,
        /**@property*/
        IamUserId:ORM['Object']['IamUser']['Id']|null
}
/**
 * @name server_db_object_LogAppInfo
 * @description DB TABLE_LOG LogAppInfo
 * @memberof ORM
 */
type server_db_object_LogAppInfo = {
        /**@property*/
        Id:number,
        /**@property*/
        AppId:ORM['Object']['App']['Id']|null,
        /**@property*/
        AppFilename:string,
        /**@property*/
        AppFunctionName:string,
        /**@property*/
        AppAppLine:number,
        /**@property*/
        Logtext:string,
        /**@property*/
        Created:string
}
/**
 * @name server_db_object_LogDbInfo
 * @description DB TABLE_LOG LogDbInfo
 * @memberof ORM
 */
type server_db_object_LogDbInfo = {
        /**@property*/
        Id:number,
        /**@property*/
        AppId:ORM['Object']['App']['Id']|null,
        /**@property*/
        Object:string,
        /**@property*/
        Dml:string,
        /**@property*/
        Parameters:{},
        /**@property*/
        Logtext:string,
        /**@property*/
        Created:string
}
/**
 * @name server_db_object_LogBffInfo
 * @description DB TABLE_LOG LogBffInfo
 * @memberof ORM
 */
type server_db_object_LogBffInfo = {
        /**@property*/
        Id:number,
        /**@property*/
        AppId:ORM['Object']['App']['Id']|null,
        /**@property*/
        Service:string,
        /**@property*/
        Method:string,
        /**@property*/
        Url:string,
        /**@property*/
        Operation:string|null,
        /**@property*/
        Parameters:string,
        /**@property*/
        Logtext:string,
        /**@property*/
        Created:string
}
/**
 * @name server_db_object_LogRequestInfo
 * @description DB TABLE_LOG LogRequestInfo
 * @memberof ORM
 */
type server_db_object_LogRequestInfo = {
        /**@property*/
        Id:number,
        /**@property*/
        Host:string,
        /**@property*/
        AppId:ORM['Object']['App']['Id']|null,
        /**@property*/
        AppIdAuth:1|0|null,
        /**@property*/
        Ip:string,
        /**@property*/
        RequestId:string,
        /**@property*/
        CorrelationId:string,
        /**@property*/
        Url:string,
        /**@property*/
        XUrl:string|null,
        /**@property*/
        HttpInfo:string,
        /**@property*/
        Method:string,
        /**@property*/
        XMethod:string|null,
        /**@property*/
        StatusCode:number,
        /**@property*/
        StatusMessage:string,
        /**@property*/
        UserAgent:string,
        /**@property*/
        AcceptLanguage:string,
        /**@property*/
        Referer:string,
        /**@property*/
        SizeReceived:number,
        /**@property*/
        SizeSent:number,
        /**@property*/
        ResponseTime:number,
        /**@property*/
        Logtext:string,
        /**@property*/
        Created:string
}
/**
 * @name server_db_object_LogServerInfo
 * @description DB TABLE_LOG LogServerInfo
 * @memberof ORM
 */
type server_db_object_LogServerInfo = {
        /**@property*/
        Id:number,
        /**@property*/
        LogText:string,
        /**@property*/
        Created:string   
}
/**
 * @name server_db_object_ServiceRegistry
 * @description DB DOCUMENT ServiceRegistry
 * @memberof ORM
 */
type server_db_object_ServiceRegistry = {
        /**@property*/
        Id:number,
        /**@property*/
        Name:string,
        /**@property*/
        ServerProtocol:'http',
        /**@property*/
        ServerHost:string,
        /**@property*/
        ServerPort:number,
        /**@property*/
        MetricsUrl:string|null,
        /**@property*/
        HealthUrl:string|null,
        /**@property*/
        RestApiVersion:number,
        /**@property*/
        Uuid:string,
        /**@property*/
        Secret:string,
        /**@property*/
        Status:string,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null
}
/**
 * @name server_db_object_OpenApi
 * @description DB DOCUMENT OpenApi
 *              Follows Open API syntax
 * @memberof ORM
 */
type server_db_object_OpenApi = {
        /**@property*/
        info: {title: string,version: string,description: string,'x-created':string,'x-modified':string},
        /**@property*/
        servers:{url: string,description: string,variables: {protocol: {default: string},host: {default: string},port: {default: number},basePath: {default: string},config?:[key:{default:any, description:string}]},"x-type": {"$ref": string,default: "APP"|"ADMIN"|"NOHANGING_HTTPS"|"REST_API"},}[],
        /**@property*/
        paths:{[key:string]: {[key in 'get'|'post'|'delete'|'patch'|'put']:{summary: string,operationId: string,parameters: [{[key:string]:boolean|string|{}}],requestBody: {description:string,required:boolean,content:{[key:string]: {[key:string]: string|boolean}}},responses: {[key:string]: {[key:string]: string}}}}},
        /**@property*/
        components:{
            securitySchemes:{[key:string]: {}},
            parameters:{
                config:{[key:string]:{default:any, description:string}},
                paths:[key:any]
            },
            responses:{[key:string]: {description: string,content: {'application/json': {schema: {"$ref": string}}}}}
        }
}
/**
 * @name server_db_object_MessageQueuePublish
 * @description DB TABLE MessageQueuePublish
 * @memberof ORM
 */
type server_db_object_MessageQueuePublish = {
        /**@property*/
        Id:number,
        /**@property*/
        Service:'MESSAGE'|'BATCH',
        /**@property*/
        Message:{
                Id?:number,
                Type?:'MICROSERVICE_ERROR'|'MICROSERVICE_LOG',
                Sender?:string|null,
                ReceiverId?:number|null,
                Host?:string,
                ClientIp?:string,
                Subject?:string,
                Message:string,
                Created?:string
        },
        /**@property*/
        Created:string
}
/**
 * @name server_db_object_MessageQueueConsume
 * @description DB TABLE MessageQueueConsume
 * @memberof ORM
 */
type server_db_object_MessageQueueConsume = {
        /**@property*/
        Id:number,
        /**@property*/
        Message:any,
        /**@property*/
        Start:string|null,
        /**@property*/
        Finished:string|null,
        /**@property*/
        Result:any,
        /**@property*/
        Created:string,
        /**@property*/
        Modified:string|null,
        /**@property*/
        MessageQueuePublishId:number
}
/**
 * @name server_db_object_MessageQueueError
 * @description DB TABLE MessageQueueError
 * @memberof ORM
 */
type server_db_object_MessageQueueError = {
        /**@property*/
        Id:number,
        /**@property*/
        Message:any,
        /**@property*/
        Result:any,
        /**@property*/
        Created:string,
        /**@property*/
        MessageQueuePublishId:number
}
/**
 * @name server_db_object_ViewLogGetStat
 * @description DB VIEW server_db_object_ViewLogGetStat
 * @memberof ORM
 */
type server_db_object_ViewLogGetStat = {
        /**@property*/
        Chart:1|2|null,
        /**@property*/
        StatValue:string|number|null,
        /**@property*/
        Year:number,
        /**@property*/
        Month:number,
        /**@property*/
        Day:number|null,
        /**@property*/
        Amount:number|null
}
/**
 * @name server_db_object_ViewAppGetInfo
 * @description DB VIEW server_db_object_ViewAppGetInfo
 * @memberof ORM
 */
type server_db_object_ViewAppGetInfo = {
        /**@property*/
        Id:ORM['Object']['App']['Id'],
        /**@property*/
        Name:ORM['Object']['App']['Name'],
        /**@property*/
        Logo:ORM['Object']['App']['Logo'],
        /**@property*/
        Js:ORM['Object']['App']['Js'],
        /**@property*/
        Css:ORM['Object']['App']['Css'],
        /**@property*/
        CssReport:ORM['Object']['App']['CssReport'],
        /**@property*/
        TextEdit:ORM['Object']['App']['TextEdit'],
        /**@property*/
        Copyright:ORM['Object']['App']['Copyright'],
        /**@property*/
        LinkTitle:ORM['Object']['App']['LinkTitle'],
        /**@property*/
        LinkUrl:ORM['Object']['App']['LinkUrl']
}
/**
 * @name server_db_object_ViewIamUserGetProfile
 * @description DB VIEW server_db_object_ViewIamUserGetProfile
 * @memberof ORM
 */
type server_db_object_ViewIamUserGetProfile = {
        /**@property*/
        Id:ORM['Object']['IamUser']['Id'],
        /**@property*/
        Active:ORM['Object']['IamUser']['Active'],
        /**@property*/
        Username:ORM['Object']['IamUser']['Username'],
        /**@property*/
        Bio:ORM['Object']['IamUser']['Bio'],
        /**@property*/
        Private:ORM['Object']['IamUser']['Private'],
        /**@property*/
        UserLevel:ORM['Object']['IamUser']['UserLevel'],
        /**@property*/
        Avatar:ORM['Object']['IamUser']['Avatar'],
        /**@property*/
        Friends:number|null,
        /**@property*/
        Created:string,
        /**@property*/
        CountFollowing:number|null,
        /**@property*/
        CountFollowed:number|null,
        /**@property*/
        CountLikes:number|null,
        /**@property*/
        CountLiked:number|null,
        /**@property*/
        CountViews:number|null,
        /**@property*/
        FollowedId:ORM['Object']['IamUserFollow']['Id']|null,
        /**@property*/
        LikedId:ORM['Object']['IamUserLike']['Id']|null
}
/**
 * @name server_db_object_ViewIamUserGetProfileDetail
 * @description DB VIEW server_db_object_ViewIamUserGetProfileDetail
 * @memberof ORM
 */
type server_db_object_ViewIamUserGetProfileDetail = {
        /**@property*/
        Detail: 'FOLLOWING'|'FOLLOWED'|'LIKE_USER'|'LIKED_USER',
        /**@property*/
        IamUserId:ORM['Object']['IamUserFollow']['IamUserId']|ORM['Object']['IamUserLike']['IamUserId'],
        /**@property*/
        Avatar:ORM['Object']['IamUser']['Avatar'],
        /**@property*/
        Username:ORM['Object']['IamUser']['Username']
}
/**
 * @name server_db_object_ViewIamUserGetProfileStat
 * @description DB VIEW server_db_object_ViewIamUserGetProfileStat
 * @memberof ORM
 */
type server_db_object_ViewIamUserGetProfileStat = {
        /**@property*/
        Top:'VISITED|FOLLOWING|LIKE_USER'|string|null,
        /**@property*/
        Id:ORM['Object']['IamUser']['Id'],
        /**@property*/
        Avatar:ORM['Object']['IamUser']['Avatar'],
        /**@property*/
        Username:ORM['Object']['IamUser']['Username'],
        /**@property*/
        Count:number
}
/**
 * @name server_db_object_ViewIamUserGetStatCountAdmin
 * @description DB VIEW server_db_object_ViewIamUserGetStatCountAdmin
 * @memberof ORM
 */
type server_db_object_ViewIamUserGetStatCountAdmin = {
        /**@property*/
        CountUsers:number
}
/**
 * @name server_db_object_ViewIamUserAppDataPostgetProfileUserPosts
 * @description DB VIEW server_db_object_ViewIamUserAppDataPostgetProfileUserPosts
 * @memberof ORM
 */
type server_db_object_ViewIamUserAppDataPostgetProfileUserPosts = {
        /**@property*/
        Id:ORM['Object']['IamUserAppDataPost']['Id'],
        /**@property*/
        Description:string,
        /**@property*/
        IamUserId:ORM['Object']['IamUserApp']['IamUserId'],
        /**@property*/
        CountLikes:number,
        /**@property*/
        CountViews:number,
        /**@property*/
        Liked:number
}
/**
 * @name server_db_object_ViewIamUserAppDataPostGetProfileStatLike
 * @description DB VIEW server_db_object_ViewIamUserAppDataPostGetProfileStatLike
 * @memberof ORM
 */
type server_db_object_ViewIamUserAppDataPostGetProfileStatLike = {
        /**@property*/
        CountUserPostLikes:number,
        /**@property*/
        CountUserPostLiked:number
}
/**
 * @name server_db_object_ViewIamUserAppDataPostGetProfileStatPost
 * @description DB VIEW server_db_object_ViewIamUserAppDataPostGetProfileStatPost
 * @memberof ORM
 */
type server_db_object_ViewIamUserAppDataPostGetProfileStatPost = {
        /**@property*/
        Top: 'LIKED_POST'|'VIEWED_POST',
        /**@property*/
        Id:ORM['View']['IamUserGetProfileStat']['Id'],
        /**@property*/
        Avatar:ORM['View']['IamUserGetProfileStat']['Avatar'],
        /**@property*/
        Username:ORM['View']['IamUserGetProfileStat']['Username'],
        /**@property*/
        Count:ORM['View']['IamUserGetProfileStat']['Count']
}
/**
 * @name server_db_object_ViewIamUserAppdataPostGetProfileUserPostDetail
 * @description DB VIEW server_db_object_ViewIamUserAppdataPostGetProfileUserPostDetail
 * @memberof ORM
 */
type server_db_object_ViewIamUserAppdataPostGetProfileUserPostDetail = {
        /**@property*/
        Detail:'LIKE_POST'|'LIKED_POST',
        /**@property*/
        IamUserId:ORM['Object']['IamUserApp']['IamUserId'],
        /**@property*/
        Avatar:ORM['Object']['IamUser']['Avatar'],
        /**@property*/
        Username:ORM['Object']['IamUser']['Username']
}
/**
 * @name server_db_object_ViewORMGetInfo
 * @description DB VIEW server_db_object_ViewORMGetInfo
 * @memberof ORM
 */
type server_db_object_ViewORMGetInfo = {
        /**@property*/
        DatabaseName:string,
        /**@property*/
        Version:number,
        /**@property*/
        Hostname:string,
        /**@property*/
        Connections:number,
        /**@property*/
        Started:number
}
/**
 * @name server_db_object_ViewORMGetObjects
 * @description DB VIEW server_db_object_ViewORMGetObjects
 * @memberof ORM
 */
type server_db_object_ViewORMGetObjects = {
        /**@property*/
        Name:ORM['MetaData']['Object']['Name'],
        /**@property*/
        Type:ORM['MetaData']['Object']['Type'],
        /**@property*/
        InMemory:ORM['MetaData']['Object']['InMemory'],
        /**@property*/
        Lock:ORM['MetaData']['Object']['Lock'],
        /**@property*/
        TransactionId:ORM['MetaData']['Object']['TransactionId'],
        /**@property*/
        Rows:number|null,
        /**@property*/
        Size:number|null
        /**@property*/
        Pk:ORM['MetaData']['Object']['Pk'],
        /**@property*/
        Uk:ORM['MetaData']['Object']['Uk'],
        /**@property*/
        Fk:ORM['MetaData']['Object']['Fk'],
        /**@property*/
        Description:ORM['MetaData']['Object']['Description']
}
/** 
 * @name server_db_ORM
 * @description DB object record
 * @namespace ORM
 */
type server_db_ORM = {
        Name:keyof ORM['Object'],
        Type:'DOCUMENT'|'TABLE'|'TABLE_KEY_VALUE'|'TABLE_LOG'|'TABLE_LOG_DATE',
        InMemory:boolean,
        Content:any,
        Lock:number,
        TransactionId:number|null,
        TransactionContent:object|[]|null,
        CacheContent:any,
        Pk:string|null,
        Uk:string|null,
        Fk:[string,string, keyof ORM['Object']][]|null,
        Description:string
}
/** 
 * @name server_db_result_fileFsRead
 * @description DB server_db_result_fileFsRead
 */
type server_db_result_fileFsRead = {
        FileContent:   any, 
        Lock:          boolean, 
        TransactionId: number|null
}
/**
 * @name server_db_common_result
 * @description DB common result
 */
type server_db_common_result = server_db_common_result_select|server_db_common_result_insert|server_db_common_result_delete|server_db_common_result_update

/**
 * @name server_db_common_result_select
 * @description DB common result SELECT
 */
type server_db_common_result_select = {
        Rows:any[]
}
/**
 * @name server_db_common_result_insert
 * @description DB common result INSERT
 *              Choosing keys from patterns
 *              DB              Id                      Row info
 *              MariaDB, Mysql: insertId                affectedRows
 *              PostgreSQL:     rows[0].id              rowCount
 *              Oracle:         outBinds.insertId[0]    rowsAffected
 *              sqLite:         lastID                  changes
 */
type server_db_common_result_insert = {
        InsertId?:number, 
        AffectedRows:number,
        Length?:number
}
/**
 * @name server_db_common_result_delete
 * @description DB common result DELETE
 *              Choosing keys from patterns
 *              DB              Row info
 *              MariaDB, Mysql: affectedRows
 *              PostgreSQL:     rowCount
 *              Oracle:         rowsAffected
 *              sqLite:         changes
 */
type server_db_common_result_delete = {
        AffectedRows:number, 
        Length?:number
}
/**
 * @name server_db_common_result_update
 * @description DB common result UPDATE
 *              Choosing keys from patterns
 *              DB              Row info
 *              MariaDB, Mysql: affectedRows
 *              PostgreSQL:     rowCount
 *              Oracle:         rowsAffected
 *              sqLite:         changes
 */
type server_db_common_result_update = {
        AffectedRows:number, 
        Length?:number
}
/** 
 * @name server_db_database_demo_data
 * @description DB server_db_database_demo_data
 */
type server_db_database_demo_data = {
        Id?:number,
        Username:string,
        Bio:string,
        Avatar:string,
        IamUserApp:{
            AppId:number
        },
        IamUserAppDataPost:{
                AppId:                             number,
                Document:{
                            Description:                        string,
                            RegionalLanguageLocale:             string,
                            RegionalTimezone:                   string,
                            RegionalNumberSystem:               string,
                            RegionalLayoutDirection:            string,
                            RegionalSecondLanguageLocale:       string,
                            RegionalArabicScript:               string,
                            RegionalCalendarType:               string,
                            RegionalCalendarHijriType:          string,
                            GpsMapType:                         string,
                            GpsLatText:                         string,
                            GpsLongText:                        string,
                            DesignThemeDayId:                   number,
                            DesignThemeMonthId:                 number,
                            DesignThemeYearId:                  number,
                            DesignPaperSize:                    string,
                            DesignRowHighlight:                 string,
                            DesignColumnWeekdayChecked:         string,
                            DesignColumnCalendarTypeChecked:    string,
                            DesignColumnNotesChecked:           string,
                            DesignColumnGpschecked:             string,
                            DesignColumnTimezoneChecked:        string,
                            ImageHeaderImageImg:                string,
                            ImageFooterImageImg:                string,
                            TextHeader1Text:                    string,
                            TextHeader2Text:                    string,
                            TextHeader3Text:                    string,
                            TextHeaderAlign:                    string,
                            TextFooter1Text:                    string,
                            TextFooter2Text:                    string,
                            TextFooter3Text:                    string,
                            TextFooterAlign:                    string,
                            PrayerMethod:                       string,
                            PrayerAsrMethod:                    string,
                            PrayerHighLatitudeAdjustment:       string,
                            PrayerTimeFormat:                   string,
                            PrayerHijriDateAdjustment:          string,
                            PrayerFajrQqamat:                   string,
                            PrayerDhuhrIqamat:                  string,
                            PrayerAsrIqamat:                    string,
                            PrayerMaghribIqamat:                string,
                            PrayerIshaIqamat:                   string,
                            PrayerColumnImsakChecked:           string,
                            PrayerColumnSunsetChecked:          string,
                            PrayerColumnMidnightChecked:        string,
                            PrayerColumnFastStartEnd:           string},
        }[]|[],
        AppDataResourceMaster:{ 
                    IamUserAppIamUserId:                            string,
                    IamUserAppAppId:                                number, 
                    AppDataEntityResourceId:                        number, 
                    Document:                                       {[key:string]:string}|null,
                    AppDataEntity?:{  Id:number,
                                        Document:{[key:string]:string|number}},
                    AppDataResourceDetail?:[{   AppDataResourceMasterId:number,
                                                AppDataEntityResourceId: number,
                                                IamUserAppIamUserId:number|null,
                                                IamUserAppAppId:number|null,
                                                AppDataResourceMasterAttributeId:number|null,
                                                Document:{[key:string]:string}|null,
                                                AppDataResourceDetailData?:[{ AppDataResourceDetailId: number,
                                                                                IamUserAppIamUserId:number|null,
                                                                                    IamUserAppIamUserAppId:number|null,
                                                                                    data_app_id:number,
                                                                                    AppDataResourceMasterAttributeId:number,
                                                                                    Document: {[key:string]:string}|null}
                                                                                ]}
                                            ]
        }[]|[]
}

/**
 * @name server_iam_access_token_claim
 * @description IAM server_iam_access_token_claim
 */
type server_iam_access_token_claim = {
        app_id:                 number,
        app_id_token:           number|null,
        app_custom_id:          number|string|null,
        iam_user_app_id:        number|null,
        iam_user_id:            number|null,
        iam_user_username:      string|null,
        ip:                     string,
        scope:                  'USER'|'APP'|'MICROSERVICE'|'REPORT'|'MAINTENANCE'|'APP_EXTERNAL'
}
/**
 * @name server_iam_microservice_token_claim
 * @description IAM server_iam_microservice_token_claim
 */
type server_iam_microservice_token_claim = {
        app_id:                 number,
        service_registry_id:    number,
        service_registry_name:  string,
        ip:                     string,
        host:                   string,
        scope:                  'MICROSERVICE'
}
/**
 * @name server_iam_user
 * @description IAM server_iam_user
 */
type server_iam_user = {
        Id: server['ORM']['Object']['IamUser']['Id'],
        Username: server['ORM']['Object']['IamUser']['Username'],
        Password:server['ORM']['Object']['IamUser']['Password'],
        PasswordReminder:server['ORM']['Object']['IamUser']['PasswordReminder'],
        Type:server['ORM']['Object']['IamUser']['Type'],
        Bio:server['ORM']['Object']['IamUser']['Bio'],
        Private:server['ORM']['Object']['IamUser']['Private'],
        Avatar:server['ORM']['Object']['IamUser']['Avatar'],
        UserLevel:server['ORM']['Object']['IamUser']['UserLevel'],
        Status:server['ORM']['Object']['IamUser']['Status'],
        Created:server['ORM']['Object']['IamUser']['Created'],
        Modified:server['ORM']['Object']['IamUser']['Modified'],
        LastLoginTime:string
}
/**
 * @name server_info_result_Info
 * @description INFO server_info_result_Info
 */
type server_info_result_Info = {
        os:{
            hostname:string,
            platform:NodeJS.Platform,
            type:string,
            release:string,
            cpus:{
                    model: string,
                    speed: number,
                    times: {
                            user: number,
                            nice: number,
                            sys: number,
                            idle: number,
                            irq: number
                            }
                }[],
            arch:string,
            freemem:number,
            totalmem:number,
            homedir:string,
            tmpdir:string,
            uptime:number,
            userinfo:{  
                        username: any,
                        uid: number,
                        gid: number,
                        shell: any,
                        homedir: any
            },
            version:string
        },
        process:{   
                memoryusage_rss : number,
                memoryusage_heaptotal : number,
                memoryusage_heapused : number,
                memoryusage_external : number,
                memoryusage_arraybuffers : number,
                uptime : number,
                version : string,
                path : string,
                start_arg_0 : string,
                start_arg_1 : string
        }
}

/**
 * @name server_info_process
 * @description INFO process
 */
type server_info_process = any

/**
 * @name server_server_req
 * @description SERVER server_server_req
 *
 */
type server_server_req = {
        path:string,
        url:string,
        method:'GET'|'POST'|'DELETE'|'PATCH'|'PUT',
        get:Function,
        protocol:string,
        httpVersion:string
        rawHeaders:[string],
        client: {
                localport:number
                },
        route:  {
                path:string
                },
        body:   {
                x:string
                },
        query:  {
                parameters:string
                },
        headers:{
                'app-id-token':string,
                'app-id': number,
                'app-signature':string,
                authorization: string, 
                connection:string,
                'user-agent': string, 
                'accept-language': string, 
                'content-type': string, 
                host:string, 
                accept:string, 
                'accept-encoding'?:'deflate'|'gzip',
                referer:string,
                'sec-fetch-dest':string,
                'sec-fetch-mode':string,
                'sec-fetch-site':string,
                'x-forwarded-for':string
                },
        socket: {
                bytesRead:number,
                bytesWritten:number,
                remoteAddress:string,
                encrypted:boolean
                }
}
/** 
 * @name server_server_res
 * @description SERVER server_server_res
 */
type server_server_res = {
        status:Function,
        statusCode:number,
        statusMessage:Error|string|number|null|object,
        end:Function,
        send:Function,
        getHeader:Function,
        setHeader:Function,
        removeHeader:Function,
        on:Function,
        write:Function,
        flush:Function,
        writeHead:Function
        req:server_server_req
}

/**
 * @name server_server_response
 * @description SERVER server_server_response
 */
type server_server_response = {
        http?:number|null,
        code?:number|string|null,
        text?:string|null,
        developerText?:string|null,
        moreInfo?:string|null,
        sendcontent?:string,
        type:'JSON'|'HTML'
}
/**
 * @name server_server_req_id_number
 * @description SERVER server_server_req_id_number
 */
type server_server_req_id_number = string|number|null|undefined

/**
 * @name server_server_error
 * @description SERVER server_server_error
 */
type server_server_error = any

/**
 * @name server_geolocation_place
 * @description geolocation place
 */
type server_geolocation_place = {
        place:string, 
        countryCode:string, 
        country:string, 
        region:string,
        latitude:string,
        longitude:string,
        timezone:string
}

/**
 * @name server_security_jwt_payload
 * @description SECURITY server_security_jwt_payload
 */
type server_security_jwt_payload = {  
        iss:string, 
        sub:string, 
        aud:string|[],
        jwtid: string,
        exp:number,
        nbf:number,
        iat:number
} & {[key:string]:any}

/**
 * @name server_security_jwt_complete
 * @description SECURITY server_security_jwt_complete
 */
type server_security_jwt_complete = {
        header:   {algo:string, typ:string}, 
        payload:  server_security_jwt_payload,
        signature:string
}
/**
 * @name ViewSocketConnectedServer
 * @description SOCKET ViewSocketConnectedServer
 */
type ViewSocketConnectedServer = {
        Id:number,
        IamUserUsername:string|null,
        IamUserType:'ADMIN'|'USER'|null,
        Ip:string,
        GpsLatitude:string|null,
        GpsLongitude:string|null,
        Place:string,
        Timezone:string,
        UserAgent:string,
        IdToken:string,
        TokenAccess:string|null,
        TokenAdmin:string|null,
        Uuid:string|null,
        Response:server_server_res|null,
        Created:string,
        AppId:number,
        IamUserid:number|null
}
/**
 * @name ViewSocketConnectedClient
 * @description SOCKET ViewSocketConnectedClient
 */
type ViewSocketConnectedClient = {
        Id:ViewSocketConnectedServer['Id'],
        IamUserUsername:ViewSocketConnectedServer['IamUserUsername'],
        IamUserType:ViewSocketConnectedServer['IamUserType'],
        Ip:ViewSocketConnectedServer['Ip'],
        GpsLatitude:ViewSocketConnectedServer['GpsLatitude'],
        GpsLongitude:ViewSocketConnectedServer['GpsLongitude'],
        Place:ViewSocketConnectedServer['Place'],
        Timezone:ViewSocketConnectedServer['Timezone'],
        UserAgent:ViewSocketConnectedServer['UserAgent'],
        Created:ViewSocketConnectedServer['Created'],
        AppId:ViewSocketConnectedServer['AppId'],
        IamUserid:ViewSocketConnectedServer['IamUserid']
}
/** 
 * @name server_socket_broadcast_type
 * @description SOCKET server_socket_broadcast_type
 */
type server_socket_broadcast_type = 'ALERT'|'MAINTENANCE'|'CHAT'|'PROGRESS'|'PROGRESS_LOADING'|'EXPIRED_ACCESS'|'EXPIRED_SESSION'|'CONNECTINFO'|'APP_FUNCTION'|'MESSAGE'|'FONT_URL'

/**
 * @name test_spec_result
 * @description TEST test_spec_result
 */
type test_spec_result = {
        type:'SPY'|'UNIT'|'INTEGRATION'|'PERFORMANCE', 
        path:string, 
        result:boolean,
        detail:{ describe:string,
                it:{should:string,
                    expect:test_expect_result[]}}[]
}
/**
 * @name test_expect_result
 * @description TEST test_expect_result
 */
type test_expect_result = {
        method:string|undefined,
        desc:string,
        actual:any,
        expected:any,
        result:any
}
/**
 * @name test_specrunner
 * @description TEST test_specrunner
 */
type test_specrunner = {
        description:string,
        specFiles:{ type:test_spec_result['type'], 
                    path:string}[]
}
/**
 * @name microservice_local_config
 * @description SERVICE_REGISTRY microservice_local_config
 */
type microservice_local_config = {
        name:                          'BATCH' & string,
        environment:                   string,
        server_host:		            string,
        server_port:                   number,
        service_registry_auth_url:		string,
        service_registry_auth_method:  'POST',
        message_queue_url:	            string,
        message_queue_method:	        'POST',
        iam_auth_app_path:	            string,
        iam_auth_app_method:	        'POST',
        uuid:                          string,
        secret:                        string,
        config:{url_ip:string, url_place:string}
}

/**
 * @name ORM
 * @description ORM
 */
type ORM = {
        Object:{
                App:server_db_object_App,
                AppData:server_db_object_AppData,
                AppDataEntity:server_db_object_AppDataEntity,
                AppDataEntityResource:server_db_object_AppDataEntityResource,
                AppDataResourceMaster:server_db_object_AppDataResourceMaster,
                AppDataResourceDetail:server_db_object_AppDataResourceDetail,
                AppDataResourceDetailData:server_db_object_AppDataResourceDetailData,
                AppModule:server_db_object_AppModule,
                AppModuleQueue:server_db_object_AppModuleQueue,
                AppTranslation:server_db_object_AppTranslation,
                IamControlIp:server_db_object_IamControlIp,
                IamControlObserve:server_db_object_IamControlObserve,
                IamControlUserAgent:server_db_object_IamControlUserAgent,
                IamEncryption:server_db_object_IamEncryption,
                IamMicroserviceToken:server_db_object_IamMicroserviceToken,
                IamUser:server_db_object_IamUser,
                IamUserFollow:server_db_object_IamUserFollow,
                IamUserLike:server_db_object_IamUserLike,
                IamUserView:server_db_object_IamUserView,
                IamUserApp:server_db_object_IamUserApp,
                IamUserAppDataPost:server_db_object_IamUserAppDataPost,
                IamUserAppDataPostLike:server_db_object_IamUserAppDataPostLike,
                IamUserAppDataPostView:server_db_object_IamUserAppDataPostView,
                IamUserEvent:server_db_object_IamUserEvent,
                IamAppIdToken:server_db_object_IamAppIdToken,
                IamAppAccess:server_db_object_IamAppAccess,
                LogAppInfo:server_db_object_LogAppInfo,
                LogAppVerbose:server_db_object_LogAppInfo,
                LogAppError:server_db_object_LogAppInfo,
                LogDbInfo:server_db_object_LogDbInfo,
                LogDbVerbose:server_db_object_LogDbInfo,
                LogDbError:server_db_object_LogDbInfo,
                LogBffInfo:server_db_object_LogBffInfo,
                LogBffVerbose:server_db_object_LogBffInfo,
                LogBffError:server_db_object_LogBffInfo,
                LogRequestInfo:server_db_object_LogRequestInfo,
                LogRequestVerbose:server_db_object_LogRequestInfo,
                LogRequestError:server_db_object_LogRequestInfo,
                LogServerInfo:server_db_object_LogServerInfo,
                LogServerError:server_db_object_LogServerInfo,
                OpenApi:server_db_object_OpenApi,
                ServiceRegistry:server_db_object_ServiceRegistry,
                MessageQueuePublish:server_db_object_MessageQueuePublish,
                MessageQueueConsume:server_db_object_MessageQueueConsume,
                MessageQueueError:server_db_object_MessageQueueError},
        View:{
            LogGetStat:server_db_object_ViewLogGetStat,
            AppGetInfo:server_db_object_ViewAppGetInfo,
            IamUserGetProfileDetail:server_db_object_ViewIamUserGetProfileDetail,
            IamUserGetProfileStat:server_db_object_ViewIamUserGetProfileStat,
            IamUserGetStatCountAdmin:server_db_object_ViewIamUserGetStatCountAdmin,
            IamUserGetProfile:server_db_object_ViewIamUserGetProfile,
            IamUserAppDataPostgetProfileUserPosts:server_db_object_ViewIamUserAppDataPostgetProfileUserPosts,
            IamUserAppDataPostgetProfileStatLike:server_db_object_ViewIamUserAppDataPostGetProfileStatLike,
            IamUserAppDataPostGetProfileStatPost:server_db_object_ViewIamUserAppDataPostGetProfileStatPost,
            IamUserAppdataPostGetProfileUserPostDetail:server_db_object_ViewIamUserAppdataPostGetProfileUserPostDetail,
            ORMGetInfo:server_db_object_ViewORMGetInfo,
            ORMGetObjects:server_db_object_ViewORMGetObjects
        },
        Type:{
            TokenType:'APP_ID'|server_db_object_IamAppAccess['Type']|'MICROSERVICE',
            DemoData:server_db_database_demo_data
        },
        MetaData:{
            Object:server_db_ORM,
            AllObjects: server_db_ORM['Name']|'ORM',
            result_fileFsRead:server_db_result_fileFsRead,
            common_result:server_db_common_result,
            common_result_select:server_db_common_result_select,
            common_result_insert:server_db_common_result_insert,
            common_result_delete:server_db_common_result_delete,
            common_result_update:server_db_common_result_update
        }
}
/**
 * @name server
 * @description Server types
 */
type server = {
        app:{
                commonInfo:server_apps_app_info,
                commonGlobals:server_apps_globals,
                commonReportQueryParameters:server_apps_report_query_parameters,
                commonReportCreateParameters:server_apps_report_create_parameters,
                commonModuleMetadata:server_apps_module_metadata,
                commonModuleWithMetadata:(ORM['Object']['AppModule'] & {ModuleMetadata:server_apps_module_metadata}),
                commonstatus:server_config_apps_status,
                commonComponentLifecycle:serverComponentLifecycle,
                commonDocumentMenu:serverDocumentMenu,
                commonWorldCitiesCity:commonWorldCitiesCity
                commonAppSwitch:commonAppSwitch
                },
        bff:{
                parameters:server_bff_parameters,
                RestApi_parameters:server_bff_RestApi_parameters
            },
        iam:{
                iam_access_token_claim:server_iam_access_token_claim,
                iam_microservice_token_claim:server_iam_microservice_token_claim,
                iam_user: server_iam_user
            },
        info:{
                result_Info:server_info_result_Info,
                process:server_info_process,
            },
        server:{
                req:server_server_req,
                res:server_server_res,
                response:server_server_response,
                req_id_number:server_server_req_id_number,
                error:server_server_error,
                geolocation_place:server_geolocation_place
            },
        security:{
                jwt_payload:server_security_jwt_payload,
                jwt_complete:server_security_jwt_complete
            },
        socket:{
                SocketConnectedClient:ViewSocketConnectedClient,
                SocketConnectedServer:ViewSocketConnectedServer
                broadcast_type:server_socket_broadcast_type
            },
        test:{
                spec_result:test_spec_result,
                expect_result:test_expect_result,
                specrunner:test_specrunner
            }
        serviceregistry:{
                microservice_local_config:microservice_local_config
            }
        ORM:ORM
}
export {server};