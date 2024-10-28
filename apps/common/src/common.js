/** @module apps/common/src/common/service */

/**@type{import('../../../server/log.js')} */
const { logAppE } = await import(`file://${process.cwd()}/server/log.js`);

/**@type{import('../../../server/server.js')} */
const {serverUtilAppFilename, serverUtilAppLine, serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('../../../server/db/dbModelDatabase.js')} */
const {InstalledCheck} = await await import(`file://${process.cwd()}/server/db/dbModelDatabase.js`);

/**@type{import('../../../server/db/file.js')} */
const {fileCache, fileFsRead, fileFsWrite, fileFsCacheSet} = await import(`file://${process.cwd()}/server/db/file.js`);

const fs = await import('node:fs');

/**
 * Creates email
 * @async
 * @param {number} app_id                       - Application id
 * @param {import('../../../server/types.js').server_apps_email_param_data} data         - Email param data
 * @returns {Promise<import('../../../server/types.js').server_apps_email_return_createMail>}  - Email return data
 */
const commonMailCreate = async (app_id, data) =>{
    const {default:ComponentCreate} = await import('./component/common_mail.js');
    const email_html    = await ComponentCreate({data:{host:data.host ?? '', verification_code:data.verificationCode ?? ''}, methods:null});
    const common_app_id = serverUtilNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{import('../../../server/types.js').server_config_server_server}*/key)=>'APP_COMMON_APP_ID' in key)[0].APP_COMMON_APP_ID)??0;
    const secrets       = commonRegistryAppSecret(common_app_id);
    //email type 1-4 implemented are emails with verification code
    if (parseInt(data.emailtype)==1 || 
        parseInt(data.emailtype)==2 || 
        parseInt(data.emailtype)==3 ||
        parseInt(data.emailtype)==4){

        /** @type {string} */
        let email_from = '';
        switch (parseInt(data.emailtype)){
            case 1:{
                email_from = secrets.SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                break;
            }
            case 2:{
                email_from = secrets.SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
                break;
            }
            case 3:{
                email_from = secrets.SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
                break;
            }
            case 4:{
                email_from = secrets.SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
                break;
            }
        }
        return {
            'email_host':         secrets.SERVICE_MAIL_HOST,
            'email_port':         secrets.SERVICE_MAIL_PORT,
            'email_secure':       secrets.SERVICE_MAIL_SECURE,
            'email_auth_user':    secrets.SERVICE_MAIL_USERNAME,
            'email_auth_pass':    secrets.SERVICE_MAIL_PASSWORD,
            'from':               email_from,
            'to':                 data.to,
            'subject':            '❂❂❂❂❂❂',
            'html':               email_html
        };
    }
    else
        throw '';
};
/**
 * 
 * @param {number} app_id 
 * @param {string} emailtype 
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {number} userid 
 * @param {string|null} verification_code 
 * @param {string} email 
 */
const commonMailSend = async (app_id, emailtype, ip, user_agent, accept_language, userid, verification_code, email) => {
    /**@type{import('../../../server/bff.service.js')} */
    const {bffServer} = await import(`file://${process.cwd()}/server/bff.service.js`);
    /**@type{import('../../../server/config.js')} */
    const { configGet} = await import(`file://${process.cwd()}/server/config.js`);

    const email_rendered = await commonMailCreate( app_id, 
                                    {
                                        emailtype:        emailtype,
                                        host:             configGet('SERVER', 'HOST'),
                                        app_user_id:      userid,
                                        verificationCode: verification_code,
                                        to:               email,
                                    })
                                    .catch((/**@type{import('../../../server/types.js').server_server_error}*/error)=>{throw error;});
        
    /**@type{import('../../../server/types.js').server_bff_parameters}*/
    const parameters = {endpoint:'SERVER_MAIL',
                        host:null,
                        url:'/mail/sendemail',
                        route_path:'/mail/sendemail',
                        method:'POST', 
                        query:'',
                        body:email_rendered,
                        authorization:null,
                        ip:ip, 
                        user_agent:user_agent, 
                        accept_language:accept_language,
                        /**@ts-ignore */
                        res:null};
    return await bffServer(app_id, parameters);
};
/**
 * Checks if ok to start app
 * @param {number|null} app_id
 * @returns {Promise.<boolean>}
 */
const commonAppStart = async (app_id=null) =>{
    const common_app_id = serverUtilNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'APP_COMMON_APP_ID'in key)[0].APP_COMMON_APP_ID) ?? 0;
    const db_use = serverUtilNumberValue(fileCache('CONFIG_SERVER').SERVICE_DB.filter((/**@type{*}*/key)=>'USE' in key)[0].USE);
    const NO_MAINTENANCE = fileCache('CONFIG_SERVER').METADATA.MAINTENANCE==0;
    const DB_START = fileCache('CONFIG_SERVER').SERVICE_DB
                        .filter((/**@type{*}*/key)=>'START' in key  )[0].START=='1';
    const APP_START = commonRegistryAppParameter(common_app_id).COMMON_APP_START.VALUE=='1';
    /**@ts-ignore */
    const DBOTHER_USER_INSTALLED = commonRegistryAppSecret(app_id ?? common_app_id)[`SERVICE_DB_DB${db_use}_APP_USER`];
    const DB5_USE_AND_INSTALLED = db_use==5 && await InstalledCheck(app_id).then(result=>app_id?result[0].installed:true).catch(()=>false);
    if (NO_MAINTENANCE && DB_START && APP_START && (DB5_USE_AND_INSTALLED || DBOTHER_USER_INSTALLED))
        if (app_id == null)
            return true;
        else{
            if (commonRegistryApp(app_id).STATUS =='ONLINE')
                return true;
            else
                return false;
        }
    else
        return false;
};

/**
 * Get client locale from accept language from request
 * 
 * @param {string} accept_language  - Accept language from request
 * @returns {string}                - lowercase locale, can be default 'en' or with syntax 'en-us' or 'zh-hant-cn'
 */
const commonClientLocale = accept_language =>{
    let locale;
    if (accept_language.startsWith('text') || accept_language=='*')
        locale = 'en';
    else{
        //check first lang ex syntax 'en-US,en;'
        locale = accept_language.split(',')[0].toLowerCase();
        if (locale.length==0){
            //check first lang ex syntax 'en;'
            locale = accept_language.split(';')[0].toLowerCase();
            if (locale.length==0 && accept_language.length>0)
                //check first lang ex syntax 'en' or 'zh-cn'
                locale = accept_language.toLowerCase();
            else{
                locale = 'en';
            }
        }
    }
    return locale;
};
/**
 * @param {{app_id:number,
 *          endpoint:import('../../../server/types.js').server_bff_endpoint_type,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string}} parameters
 * @returns 
 */
const commonGeodata = async parameters =>{
    /**@type{import('../../../server/bff.service.js')} */
    const { bffServer } = await import(`file://${process.cwd()}/server/bff.service.js`);
    //get GPS from IP
    /**@type{import('../../../server/types.js').server_bff_parameters}*/
    const parametersBFF = { endpoint:parameters.endpoint,
                            host:null,
                            url:'/geolocation/ip',
                            route_path:'/geolocation/ip',
                            method:'GET', 
                            query:`ip=${parameters.ip}`,
                            body:{},
                            authorization:null,
                            ip:parameters.ip, 
                            user_agent:parameters.user_agent, 
                            accept_language:parameters.accept_language,
                            /**@ts-ignore */
                            res:null};
    //ignore error in this case and fetch random geolocation using WORLDCITIES service instead if GEOLOCATION is not available
    const result_gps = await bffServer(parameters.app_id, parametersBFF)
    .catch(()=>null);
    const result_geodata = {};
    if (result_gps){
        result_geodata.latitude =   JSON.parse(result_gps).geoplugin_latitude;
        result_geodata.longitude=   JSON.parse(result_gps).geoplugin_longitude;
        result_geodata.place    =   JSON.parse(result_gps).geoplugin_city + ', ' +
                                    JSON.parse(result_gps).geoplugin_regionName + ', ' +
                                    JSON.parse(result_gps).geoplugin_countryName;
        result_geodata.timezone =   JSON.parse(result_gps).geoplugin_timezone;
    }
    else{
        /**@type{import('../../../server/types.js').server_bff_parameters}*/
        const parametersBFF = { endpoint:parameters.endpoint,
                                host:null,
                                url:'/worldcities/city-random',
                                route_path:'/worldcities/city-random',
                                method:'GET', 
                                query:'',
                                body:{},
                                authorization:null,
                                ip:parameters.ip, 
                                user_agent:parameters.user_agent, 
                                accept_language:parameters.accept_language,
                                /**@ts-ignore */
                                res:null};
        const result_city = await bffServer(parameters.app_id, parametersBFF).catch((/**@type{import('../../../server/types.js').server_server_error}*/error)=>{throw error;});
        result_geodata.latitude =   JSON.parse(result_city).lat;
        result_geodata.longitude=   JSON.parse(result_city).lng;
        result_geodata.place    =   JSON.parse(result_city).city + ', ' + JSON.parse(result_city).admin_name + ', ' + JSON.parse(result_city).country;
        result_geodata.timezone =   null;
    }
    return result_geodata;
};

/**
 * External request
 * @param {{host:string,
 *          method:string,
 *          body:*,
 *          user_agent:string,
 *          ip:string,
 *          authorization:string|null,
 *          locale:string}} parameters
 * @returns {Promise.<*>}
 */
const commonBFE = async parameters =>{
    const https = await import('node:https');
    const timeout_message = '🗺⛔?';
    const timeout = 5000;
    return new Promise((resolve, reject)=>{
        const host_request = parameters.host.indexOf(':')>-1?parameters.host.substring(0,parameters.host.indexOf(':')):parameters.host.substring(0,parameters.host.indexOf('/'));
        const port = parameters.host.indexOf(':')>-1?parameters.host.substring(parameters.host.indexOf(':'),parameters.host.indexOf('/')):443;
        const path = parameters.host.substring(parameters.host.indexOf('/'));
        const options = {
            method: parameters.method,
            timeout: timeout,
            headers : {
                'User-Agent': parameters.user_agent,
                'Accept-Language': parameters.locale,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(parameters.body)),
                'Authorization': parameters.authorization ?? '',
                'X-Forwarded-For': parameters.ip
            },
            host: host_request,
            port: port,
            path: path,
            rejectUnauthorized: false
        };
        
        const request = https.request(options, res =>{
            let responseBody = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) =>{
                responseBody += chunk;
            });
            res.on('end', ()=>{
                resolve (responseBody);
            });
        });
        if (parameters.method !='GET')
            request.write(JSON.stringify(parameters.body));
        request.on('error', error => {
            reject('EXTERNAL URL ERROR: ' + error);
        });
        request.on('timeout', () => {
            reject(timeout_message);
        });
        request.end();
    });
};

/**
 * Router function - get asset file
 *  Supported
 *  .css files
 *  .js files       
 *                  modifies at request:
 *                  /modules/react/react-dom.development.js
 *                      makes ECMAScript module adding export
 *                  /modules/react/react.development.js
 *                      makes ECMAScript module adding export
 *                  /modules/leaflet/leaflet-src.esm.js
 *                      removes sourceMappingURL
 *                  /modules/easy.qrcode/easy.qrcode.js
 *                      makes ECMAScript module adding variables, canvas2svg, minimal modifications and export
 *                  /modules/easy.qrcode/canvas2svg.js
 *                      makes ECMAScript module adding minimal modifications and export
 *                  /apps/common_types.js
 *                      used to display common_types.js since developer path is different
 *  .html files
 *  .webp files
 *  .png files
 *  .woff2 files
 *  .ttf files
 *  .json
 * @param {{app_id:Number,
 *          url:String,
 *          basepath:string,
 *          res:import('../../../server/types.js').server_server_res}} parameters
 */
const commonAssetfile = parameters =>{
    return new Promise((resolve, reject)=>{
        const common_app_id = serverUtilNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'APP_COMMON_APP_ID'in key)[0].APP_COMMON_APP_ID) ?? 0;
        const app_cache_control = commonRegistryAppParameter(common_app_id).COMMON_APP_CACHE_CONTROL.VALUE;
        const app_cache_control_font = commonRegistryAppParameter(common_app_id).COMMON_APP_CACHE_CONTROL_FONT.VALUE;
        switch (parameters.url.toLowerCase().substring(parameters.url.lastIndexOf('.'))){
            case '.css':{
                parameters.res.type('text/css');
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                break;
            }
            case '.js':{
                parameters.res.type('text/javascript');
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                switch (parameters.url){
                    case '/modules/react/react-dom.development.js':
                    case '/modules/react/react.development.js':{
                        fs.promises.readFile(`${process.cwd()}${parameters.basepath}${parameters.url}`, 'utf8').then((modulefile)=>{
                            if (parameters.url == '/modules/react/react-dom.development.js'){
                                modulefile = 'let ReactDOM;\r\n' + modulefile;                                
                                modulefile = modulefile.replace(  'exports.version = ReactVersion;',
                                                                'exports.version = ReactVersion;\r\n  ReactDOM=exports;');
                                modulefile = modulefile + 'export {ReactDOM}';
                            }
                            else{
                                modulefile = 'let React;\r\n' + modulefile;
                                modulefile = modulefile.replace(  'exports.version = ReactVersion;',
                                                                'exports.version = ReactVersion;\r\n  React=exports;');
                                modulefile = modulefile + 'export {React}';
                            }
                            
                            resolve({STATIC:true, SENDFILE:null, SENDCONTENT:modulefile});
                        });
                        break;
                    }
                    case '/modules/leaflet/leaflet-src.esm.js':{
                        fs.promises.readFile(`${process.cwd()}${parameters.basepath}${parameters.url}`, 'utf8').then((modulefile)=>{
                            modulefile = modulefile.replace(  '//# sourceMappingURL=','//');
                            resolve({STATIC:true, SENDFILE:null, SENDCONTENT:modulefile});
                        });
                        break;
                    }
                    case '/modules/easy.qrcode/easy.qrcode.js':{
                        fs.promises.readFile(`${process.cwd()}${parameters.basepath}${parameters.url}`, 'utf8').then((modulefile)=>{
                            modulefile = modulefile.replace(  'var QRCode;','');

                            modulefile =    'let {ctx} = await import("./canvas2svg.js");\r\n' +
                                            'let C2S = ctx;\r\n' + 
                                            'var QRCode;\r\n' +
                                            modulefile;
                            modulefile = modulefile.replace(  'if (typeof define == \'function\' && (define.amd || define.cmd))','if (1==2)');
                            modulefile = modulefile.replace(  'else if (freeModule)','else if (1==2)');
                            modulefile = modulefile.replace(  'root.QRCode = QRCode;','null;');
                            

                            modulefile = modulefile + 'export{QRCode}';
                            resolve({STATIC:true, SENDFILE:null, SENDCONTENT:modulefile});
                        });
                        break;
                    }
                    case '/modules/easy.qrcode/canvas2svg.js':{
                        fs.promises.readFile(`${process.cwd()}${parameters.basepath}${parameters.url}`, 'utf8').then((modulefile)=>{
                            modulefile =  'let ctx;\r\n' + modulefile;
                            modulefile = modulefile.replace('var STYLES, ctx, CanvasGradient, CanvasPattern, namedEntities;',
                                                            'var STYLES, CanvasGradient, CanvasPattern, namedEntities;');
                            modulefile = modulefile.replace(  'if (typeof window === "object")','if (1==2)');
                            modulefile = modulefile.replace(  'if (typeof module === "object" && typeof module.exports === "object")','if (1==2)');
                            modulefile = modulefile + 'export{ctx}';
                            resolve({STATIC:true, SENDFILE:null, SENDCONTENT:modulefile});
                        });
                        break;
                    }
                    case '/apps/common_types.js':{
                        //in development another path is used, return correct path in app
                        resolve({STATIC:true, SENDFILE:`${process.cwd()}/apps/common_types.js`});
                        break;
                    }
                    default:
                        resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                }
                break;
            }
            case '.html':{
                parameters.res.type('text/html');
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                break;
            }
            case '.webp':{
                parameters.res.type('image/webp');
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                break;
            }
            case '.png':{
                parameters.res.type('image/png');
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                break;
            }
            case '.woff2':{
                parameters.res.type('font/woff');
                if (app_cache_control_font !='')
                    parameters.res.set('Cache-Control', app_cache_control_font);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                break;
            }
            case '.ttf':{
                parameters.res.type('font/ttf');
                if (app_cache_control_font !='')
                    parameters.res.set('Cache-Control', app_cache_control_font);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                break;
            }
            case '.json':{
                parameters.res.type('application/json');
                if (app_cache_control !='')
                    parameters.res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                break;
            }
            default:{
                logAppE(parameters.app_id, serverUtilAppFilename(import.meta.url), 'commonAssetfile()', serverUtilAppLine(), `Invalid file type ${parameters.url}`)
                .then(()=>{
                    parameters.res.statusCode = 403;
                    parameters.res.statusMessage = null;
                    reject(null);
                });
            }
        }
    });
};

/**
 * Router function - run fcuntion
 * @param {{app_id:number,
 *          resource_id:string,
 *          data: *,
 *          user_agent:string,
 *          ip:string,
 *          locale:string,
 *          endpoint:import('../../../server/types.js').server_server_routesparameters['endpoint'],
 *          res:import('../../../server/types.js').server_server_res|null}} parameters
 * @returns {Promise.<void>}
 */
const commonFunctionRun = async parameters => {
    const module = commonRegistryAppModule(parameters.app_id, {type:'FUNCTION', name:parameters.resource_id,role:parameters.endpoint});
    if (module){
        const {default:RunFunction} = await import(`file://${process.cwd()}${module.COMMON_PATH}`);
        return await RunFunction(parameters.app_id, parameters.data, parameters.user_agent, parameters.ip, parameters.locale, parameters.res);
    }
    else{
        logAppE(parameters.app_id, serverUtilAppFilename(import.meta.url), 'commonFunctionRun()', serverUtilAppLine(), `Function ${parameters.resource_id} not found`)
        .then(()=>{
            if (parameters.res)
                parameters.res.statusCode = 404;
        });
    }    
};
/**
 * Router function - get module
 * @param {{app_id:Number,
 *          resource_id:string,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          locale:string,
 *          res:import('../../../server/types.js').server_server_res|null}} parameters
 * @returns {Promise.<*>}
 */
const commonModuleGet = async parameters => {
    const module = commonRegistryAppModule(parameters.app_id, {type:'MODULE', name:parameters.resource_id,role:''});
    if (module){
        const {default:RunFunction} = await import(`file://${process.cwd()}${module.COMMON_PATH}`);
        return await RunFunction(parameters.app_id, parameters.data, parameters.user_agent, parameters.ip, parameters.locale, parameters.res).then((/**@type{*} */module)=>{return {STATIC:true, SENDFILE:module, SENDCONTENT:null};});
    }
    else{
        logAppE(parameters.app_id, serverUtilAppFilename(import.meta.url), 'commonModuleGet()', serverUtilAppLine(), `Module ${parameters.resource_id} not found`)
        .then(()=>{
            if (parameters.res)
                parameters.res.statusCode = 404;
            return {STATIC:true, SENDFILE:null, SENDCONTENT:''};
        });
    }
};

/**
 * Creates server component and returns to client
 * app
 * reports
 * maintenance
 * mail
 * info disclaimer
 * info privacy policy
 * info terms
 * server error
 * 
 * @param {{app_id:number, 
 *          componentParameters:{   param?:             string|null,
 *                                  ip:                 string, 
 *                                  user_agent?:        string,
 *                                  locale?:            string,
 *                                  reportid?:          string,
 *                                  host?:              string},
 *          type:'APP'|'REPORT'|'MAINTENANCE'|'INFO_DISCLAIMER'|'INFO_PRIVACY_POLICY'|'INFO_TERMS'}} parameters
 * @returns {Promise.<string>}
 */
const commonComponentCreate = async parameters =>{
    /**@type{import('../../../server/iam.service.js')} */
    const { iamAuthorizeIdToken } = await import(`file://${process.cwd()}/server/iam.service.js`);

    const common_app_id = serverUtilNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'APP_COMMON_APP_ID'in key)[0].APP_COMMON_APP_ID) ?? 0;
    //id token for APP, REPORT and MAINTENANCE
    const idtoken = (parameters.type=='APP' || parameters.type=='REPORT' || parameters.type=='MAINTENANCE')?
                        await iamAuthorizeIdToken(parameters.app_id, parameters.componentParameters.ip):
                            null;
    //geodata for APP and REPORT
    const result_geodata = (parameters.type=='APP' || parameters.type=='REPORT')?
                                await commonGeodata({   app_id:parameters.app_id, 
                                                        endpoint:'SERVER_APP', 
                                                        ip:parameters.componentParameters.ip, 
                                                        user_agent:parameters.componentParameters.user_agent ??'', 
                                                        accept_language:parameters.componentParameters.locale??''}):
                                    null;
    const admin_only = await commonAppStart()==true?0:1;
    
    switch (parameters.type){
        case 'APP':{
            /**@type{import('../../../server/types.js').server_apps_app_service_parameters} */
            const app_service_parameters = {   
                app_id:                 parameters.app_id,
                app_logo:               commonRegistryApp(parameters.app_id).LOGO,
                app_idtoken:            idtoken ?? '',
                locale:                 parameters.componentParameters.locale ?? '',
                admin_only:             admin_only,
                client_latitude:        result_geodata?.latitude,
                client_longitude:       result_geodata?.longitude,
                client_place:           result_geodata?.place ?? '',
                client_timezone:        result_geodata?.timezone,
                common_app_id:          common_app_id,
                rest_resource_bff:      fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'REST_RESOURCE_BFF' in key)[0].REST_RESOURCE_BFF ?? '/bff',
                first_time:             admin_only==1?(fileCache('IAM_USER').length==0?1:0):0
            };
            /**@type{import('../../../server/types.js').server_db_file_app_parameter_common} */
            const common_parameter = commonRegistryAppParameter(common_app_id);
            //return only used parameters
            delete common_parameter.APP_COPYRIGHT;
            delete common_parameter.APP_EMAIL;
            delete common_parameter.APP_ID;
            delete common_parameter.APP_LINK_TITLE;
            delete common_parameter.APP_LINK_URL;
            delete common_parameter.APP_TEXT_EDIT;
            delete common_parameter.COMMON_APP_LOG;
            delete common_parameter.COMMON_APP_START;

            const APP_PARAMETERS  = {   APP:        commonRegistryAppParameter(parameters.app_id), 
                                        COMMON:     common_parameter,
                                        INFO:       app_service_parameters};
            const componentParameter = {data:   {
                                                    APP:            commonRegistryApp(parameters.app_id),
                                                    APP_PARAMETERS: Buffer.from(JSON.stringify(APP_PARAMETERS)).toString('base64')
                                                },
                                        methods:null};

            const {default:ComponentCreate} = await import('./component/common_app.js');
            return ComponentCreate(componentParameter);
        }
        case 'REPORT':{
            const {default:ComponentCreate} = await import('./component/common_report.js');
            
            const decodedReportparameters = Buffer.from(parameters.componentParameters.reportid ?? '', 'base64').toString('utf-8');
            const module = new URLSearchParams(decodedReportparameters).get('module') ??'';
            const papersize = new URLSearchParams(decodedReportparameters).get('ps');
            const report = commonRegistryAppModule(parameters.app_id, {type:'REPORT', name:module, role:''});
            const {default:RunReport} = await import(`file://${process.cwd()}${report.COMMON_PATH}`);

            /**@type{import('../../../server/types.js').server_apps_report_create_parameters} */
            const data = {  app_id:         parameters.app_id,
                            reportid:       parameters.componentParameters.reportid ?? '',
                            ip:             parameters.componentParameters.ip,
                            user_agent:     parameters.componentParameters.user_agent ?? '',
                            accept_language:parameters.componentParameters.locale ?? '',
                            latitude:       result_geodata?.latitude,
                            longitude:      result_geodata?.longitude
                            };
            return ComponentCreate({data:   {
                                            CONFIG_APP:{...commonRegistryApp(parameters.app_id)},
                                            data:data,
                                            /**@ts-ignore */
                                            papersize:papersize
                                            },
                                    methods:{function_report:RunReport}});
        }
        case 'MAINTENANCE':{
            //maintenance can be used from all app_id
            const data = JSON.stringify({   
                app_id: parameters.app_id,
                common_app_id: common_app_id,
                app_idtoken: idtoken,
                rest_resource_bff: fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'REST_RESOURCE_BFF' in key)[0].REST_RESOURCE_BFF ?? '/bff'
            });

            const {default:ComponentCreate} = await import('./component/common_maintenance.js');
            return ComponentCreate({data:   {
                                            CONFIG_APP:             {...commonRegistryApp(parameters.app_id)},
                                            ITEM_COMMON_PARAMETERS: Buffer.from(data).toString('base64')},
                                    methods:null
                                    });
        }
        case 'INFO_DISCLAIMER':{
            const {default:ComponentCreate} = await import('./component/common_info_disclaimer.js');
            return ComponentCreate({data: {app_name:commonRegistryApp(parameters.app_id).NAME},
                                    methods:null});
        }
        case 'INFO_PRIVACY_POLICY':{
            const {default:ComponentCreate} = await import('./component/common_info_privacy_policy.js');
            return ComponentCreate({data: {app_name:commonRegistryApp(parameters.app_id).NAME},
                                    methods:null});
        }
        case 'INFO_TERMS':{
            const {default:ComponentCreate} = await import('./component/common_info_terms.js');
            return ComponentCreate({data: {app_name:commonRegistryApp(parameters.app_id).NAME},
                                    methods:null});
        }
        default:{
            return '';
        }
    }
};

/**
  * Returns app id for given host
  * @param {string} host 
  * @returns 
  */
const commonAppHost = host =>{
    switch (host.toString().split('.')[0]){
        case 'localhost':
        case 'www':{
            //localhost
            return fileCache('APP').filter((/**@type{import('../../../server/types.js').server_db_file_app}*/app)=>app.SUBDOMAIN == 'www')[0].ID;
        }
        default:{
            try {
                return fileCache('APP').filter((/**@type{import('../../../server//types.js').server_db_file_app}*/app)=>host.toString().split('.')[0] == app.SUBDOMAIN)[0].ID;    
            } catch (error) {
                //request can be called from unkown hosts
                return null;
            }
        }
    }
 };
/**
 * Router function - App: get app asset, common asset, app info page, app report, app module or app
 * @param {{ip:string,
 *          host:string,
 *          user_agent:string,
 *          accept_language:string,
 *          url:string,
 *          query:*,
 *          res:import('../../../server/types.js').server_server_res|null}} parameters
 */
const commonApp = async parameters =>{
    const reportid = parameters.query?parameters.query.get('reportid'):null;
    const host_no_port = parameters.host.substring(0,parameters.host.indexOf(':')==-1?parameters.host.length:parameters.host.indexOf(':'));
    const app_id = commonAppHost(host_no_port);
    const common_app_id = serverUtilNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=> 'APP_COMMON_APP_ID' in key)[0].APP_COMMON_APP_ID);
    if (app_id==null || parameters.res==null ){
        //function not called from client or host not found
        if (parameters.res)
            parameters.res.statusCode = 404;
        return null;
    }
    else
        switch (true){
            case (parameters.url.toLowerCase().startsWith('/maintenance')):{
                return await commonAssetfile({app_id:app_id, url: parameters.url.substring('/maintenance'.length), basepath:'/apps/common/public', res:parameters.res})
                        .catch(()=>null);
            }
            case (app_id != common_app_id && await commonAppStart(app_id) ==false):{
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:parameters.ip},type:'MAINTENANCE'});
            }
            case (parameters.url.toLowerCase().startsWith('/common')):{
                return await commonAssetfile({app_id:app_id, url:parameters.url.substring('/common'.length), basepath:'/apps/common/public', res:parameters.res}).catch(()=>null);
            }
            case (parameters.url == '/sw.js'):{
                return await commonAssetfile({app_id:app_id, url:parameters.url, basepath:'/apps/common/public', res:parameters.res}).catch(()=>null);
            }
            case (parameters.url.toLowerCase().startsWith('/css')):
            case (parameters.url.toLowerCase().startsWith('/component')):
            case (parameters.url.toLowerCase().startsWith('/images')):
            case (parameters.url.toLowerCase().startsWith('/js')):
            case (parameters.url == '/apps/common_types.js'): {
                return await commonAssetfile({app_id:app_id, url:parameters.url, basepath:commonRegistryApp(app_id).PATH, res:parameters.res}).catch(()=>null);
            }
            case (parameters.url == '/info/doc'):{
                return await commonAssetfile({app_id:app_id, url:'/info/doc/index.html'.substring('/info/doc'.length), basepath:'/apps/common/src/jsdoc', res:parameters.res}).catch(()=>null);
            }
            case (parameters.url.toLowerCase().startsWith('/info/doc')):{
                return await commonAssetfile({app_id:app_id, url:parameters.url.substring('/info/doc'.length), basepath:'/apps/common/src/jsdoc', res:parameters.res}).catch(()=>null);
            }
            case (parameters.url.toLowerCase().startsWith('/info/about')):{
                //Use JSDoc for about app
                return '';
            }
            case (parameters.url.toLowerCase().startsWith('/info/disclaimer')):{
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:parameters.ip},type:'INFO_DISCLAIMER'});
            }
            case (parameters.url.toLowerCase().startsWith('/info/privacy_policy')):{
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:parameters.ip},type:'INFO_PRIVACY_POLICY'});
            }
            case (parameters.url.toLowerCase().startsWith('/info/terms')):{
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:parameters.ip},type:'INFO_TERMS'});
            }
            case (parameters.url.toLowerCase().startsWith('/app-reports')):{
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:         parameters.ip,
                                                                                        user_agent: parameters.user_agent,
                                                                                        locale:     commonClientLocale(parameters.accept_language),
                                                                                        reportid:   reportid},type:'REPORT'});
            }
            case (parameters.url.toLowerCase().startsWith('/app-module/')):{
                return await commonModuleGet({  app_id: app_id, 
                                                resource_id:parameters.url.substring(parameters.url.lastIndexOf('/') + 1), 
                                                data:null, 
                                                user_agent:parameters.user_agent, 
                                                ip:parameters.ip, 
                                                locale:parameters.accept_language,
                                                res:parameters.res});
            }
            case (parameters.url == '/'):
            case ((commonRegistryApp(app_id).SHOWPARAM == 1 && parameters.url.substring(1) !== '')):{
                return await commonComponentCreate({app_id:app_id, componentParameters:{param:          parameters.url.substring(1)==''?null:parameters.url.substring(1),
                                                                                        ip:             parameters.ip, 
                                                                                        user_agent:     parameters.user_agent,
                                                                                        locale:         commonClientLocale(parameters.accept_language),
                                                                                        host:           parameters.host},type:'APP'})
                                .then((app)=>{
                                    if (app == null)
                                        if (parameters.res)
                                            parameters.res.statusCode = 301;
                                    return app;
                                })
                                .catch((/**@type{import('../../../server/types.js').server_server_error}*/err)=>{
                                    logAppE(app_id, serverUtilAppFilename(import.meta.url), 'commonApp()', serverUtilAppLine(), err)
                                    .then(()=>{
                                        if (parameters.res){
                                            parameters.res.statusCode = 500;
                                            parameters.res.statusMessage = 'SERVER ERROR';
                                        }
                                        return 'SERVER ERROR';
                                    });
                                });
            }
            default:{
                parameters.res.statusCode = 301;
                return null;
            }
        }
};
/**
 * Get all aps from app registry and translated names and add info to create url links
 * @param {number} app_id 
 * @param {number|null} resource_id 
 * @param {string} locale
 * @returns {Promise.<import('../../../server/types.js').server_config_apps_with_db_columns[]>}
 */
const commonAppsGet = async (app_id, resource_id, locale) =>{
    /**@type{import('../../../server/db/dbModelApp.js')} */
    const {getApp} = await import(`file://${process.cwd()}/server/db/dbModelApp.js`);
    const apps_db =  await getApp(app_id, resource_id, locale);
    
    /**@type{import('../../../server/types.js').server_db_file_app[]}*/
    const apps = fileCache('APP');
    for (const app of apps){
        const image = await fs.promises.readFile(`${process.cwd()}${app.PATH + app.LOGO}`);
        /**@ts-ignore */
        app.LOGO        = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
    }
    const HTTPS_ENABLE = fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTPS_ENABLE' in row)[0].HTTPS_ENABLE;
    return apps
    .filter(app=>apps_db.filter(app_db=>app_db.id == app.ID)[0])
    .map(app=>{
        return {
                    APP_ID:app.ID,
                    NAME:app.NAME,
                    SUBDOMAIN:app.SUBDOMAIN,
                    PROTOCOL : HTTPS_ENABLE =='1'?'https://':'http://',
                    HOST : fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HOST' in row)[0].HOST,
                    PORT : serverUtilNumberValue(HTTPS_ENABLE=='1'?
                                        fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTPS_PORT' in row)[0].HTTPS_PORT:
                                            fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/row)=>'HTTP_PORT' in row)[0].HTTP_PORT),
                    APP_NAME_TRANSLATION : JSON.parse(apps_db.filter(app_db=>app_db.id==app.ID)[0].app_translation.toString()).name,
                    LOGO:app.LOGO
                };
    });
};

/**
 * Get all apps from app registry
 * @returns {Promise.<import('../../../server/types.js').server_apps_result_getAppsAdmin[]>}
 */
 const commonAppsAdminGet = async () =>fileCache('APP');

/**
 * App registry APP MODULE addmin
 * returns all modules for given app id
 * @param {number} app_id
* @returns {import('../../../server/types.js').server_db_file_app_module}
*/
const commonRegistryAppModuleAll = app_id => fileCache('APP_MODULE').filter((/**@type{*}*/app)=>app.APP_ID == app_id );


/**
 * App registry APP
 * @param {number} app_id
 * @returns {import('../../../server/types.js').server_db_file_app}
 */
const commonRegistryApp = app_id => fileCache('APP').filter((/**@type{import('../../../server/types.js').server_db_file_app}*/app)=>app.ID == app_id)[0];

/**
 * App registry get apps
 * @param {number|null} app_id
 * @returns {import('../../../server/types.js').server_db_file_app[]}
 */
const commonRegistryAppsGet = app_id => fileCache('APP').filter((/**@type{import('../../../server/types.js').server_db_file_app}*/app)=>app.ID == (app_id ?? app.ID));

/**
 * App registry APP MODULE
 * Modules that are shared by apps and server
 * @param {number} app_id
 * @param {{type:string,
 *          name:string,
 *          role:string|null}} parameters
 * @returns {import('../../../server/types.js').server_db_file_app_module}
 */
const commonRegistryAppModule = (app_id, parameters) => fileCache('APP_MODULE')
                                                            .filter((/**@type{*}*/app)=>
                                                                app.APP_ID == app_id && app.COMMON_TYPE==parameters.type && app.COMMON_NAME==parameters.name && app.COMMON_ROLE == parameters.role)[0];

/**
 * App registry APP PARAMETER
 * @param {number} app_id
 * @returns {import('../../../server/types.js').server_db_file_app_parameter}
 */
const commonRegistryAppParameter = app_id => fileCache('APP_PARAMETER')
                                                .filter((/**@type{import('../../../server/types.js').server_db_file_app_parameter}*/row)=> row.APP_ID == app_id )[0];

/**
 * App registry APP SECRET
 * @param {number} app_id
 * @returns {import('../../../server/types.js').server_db_file_app_secret}
 */
const commonRegistryAppSecret= app_id => fileCache('APP_SECRET')
                                            .filter((/**@type{import('../../../server/types.js').server_db_file_app_secret}*/row)=> row.APP_ID == app_id)[0];

/**
 * App registry APP SECRET from file
 * @param {number} app_id
 * @returns {Promise.<import('../../../server/types.js').server_db_file_app_secret>}
 */
const commonRegistryAppSecretFile= async app_id => fileFsRead('APP_SECRET').then(result=>
                                                            result.file_content
                                                            .filter((/**@type{import('../../../server/types.js').server_db_file_app_secret}*/row)=> row.APP_ID == app_id)[0]);


/**
 * App Registry APP SECRET reset db username and passwords for database in use
 * @returns {Promise.<void>}
 */
const commonRegistryAppSecretDBReset = async () => {
    /**@type{import('../../../server/config.js')} */
    const {configGet} = await import(`file://${process.cwd()}/server/config.js`);
    /**@type{import('../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    const file = await fileFsRead('APP_SECRET', true);
    /**@type{import('../../../server/types.js').server_db_file_app[]}*/
    const APPS = file.file_content;
    const db_use = serverUtilNumberValue(configGet('SERVICE_DB', 'USE'));
    for (const app of APPS){
        /**@ts-ignore */
        if (app[`SERVICE_DB_DB${db_use}_APP_USER`]){
            /**@ts-ignore */
            app[`SERVICE_DB_DB${db_use}_APP_USER`] = '';
        }
        /**@ts-ignore */
        if (app[`SERVICE_DB_DB${db_use}_APP_PASSWORD`]){
            /**@ts-ignore */
            app[`SERVICE_DB_DB${db_use}_APP_PASSWORD`] = '';
        }   
    }
    file.file_content = APPS;
    await fileFsWrite('APP_SECRET', file.transaction_id, file.file_content);
    await fileFsCacheSet();
};
/**
 * App Registry APP update an app
 * @param {number} app_id
 * @param {number} resource_id
 * @param {import('../../../server/types.js').server_db_file_app} data
* @returns {Promise.<void>}
*/
const commonRegistryAppUpdate = async (app_id, resource_id, data) => {
    const file = await fileFsRead('APP', true);
    for (const index in file.file_content)
        if (file.file_content[index].ID==resource_id){
            data.ID = Number(data.ID),
            file.file_content[index] = data;
        }
            
   
   await fileFsWrite('APP', file.transaction_id, file.file_content);
   await fileFsCacheSet();
};
/**
 * App Registry APP MODULE update a module
 * @param {number} app_id
 * @param {number} resource_id
 * @param {import('../../../server/types.js').server_db_file_app_module} data
* @returns {Promise.<void>}
*/
const commonRegistryAppModuleUpdate = async (app_id, resource_id, data) => {
    const file = await fileFsRead('APP_MODULE', true);
    for (const index in file.file_content)
        if (file.file_content[index].APP_ID     ==resource_id && 
            file.file_content[index].COMMON_TYPE== data.COMMON_TYPE &&
            file.file_content[index].COMMON_NAME== data.COMMON_NAME &&
            file.file_content[index].COMMON_ROLE== data.COMMON_ROLE){
                data.APP_ID = Number(data.APP_ID);
                file.file_content[index] = data;
            }
    await fileFsWrite('APP_MODULE', file.transaction_id, file.file_content);
    await fileFsCacheSet();
 };
/**
 * App Registry APP PARAMETER update a parameter
 * @param {number} app_id
 * @param {number} resource_id
 * @param {{parameter_name:     string,
 *          parameter_value:    string,
 *          parameter_comment:  string|null}} data
 * @returns {Promise.<void>}
 */
const commonRegistryAppParameterUpdate = async (app_id, resource_id, data) => {
    const file = await fileFsRead('APP_PARAMETER', true);
    file.file_content.filter((/**@type{*}*/row)=> row.APP_ID==resource_id)[0][data.parameter_name] = data.parameter_value;
    file.file_content.filter((/**@type{*}*/row)=> row.APP_ID==resource_id)[0].COMMENT = data.parameter_comment;
    
    await fileFsWrite('APP_PARAMETER', file.transaction_id, file.file_content);
    await fileFsCacheSet();
};
/**
 * App registry APP SECRET update a secret
 * @param {number|null} app_id
 * @param {number|null} resource_id
 * @param {{parameter_name:     string,
*          parameter_value:    string}} data
* @returns {Promise.<void>}
*/
const commonRegistryAppSecretUpdate = async (app_id, resource_id, data) => {
   const file = await fileFsRead('APP_SECRET', true);
   file.file_content.filter((/**@type{*}*/row)=> row.APP_ID==resource_id)[0][data.parameter_name] = data.parameter_value;
   await fileFsWrite('APP_SECRET', file.transaction_id, file.file_content);
   await fileFsCacheSet();
};

export {commonMailCreate, commonMailSend,
        commonAppStart, commonAppHost, commonAssetfile,commonFunctionRun,commonModuleGet,commonApp, commonBFE, commonAppsGet, 
        commonAppsAdminGet,commonRegistryAppModuleAll,
        commonRegistryApp, commonRegistryAppModule,commonRegistryAppParameter,commonRegistryAppSecret,commonRegistryAppSecretFile,
        commonRegistryAppsGet,
        commonRegistryAppSecretDBReset,
        commonRegistryAppUpdate,
        commonRegistryAppModuleUpdate,
        commonRegistryAppParameterUpdate,
        commonRegistryAppSecretUpdate,};