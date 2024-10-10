/** @module apps/common/src/common/service */

/**@type{import('../../../server/log.service.js')} */
const { LogAppE } = await import(`file://${process.cwd()}/server/log.service.js`);

/**@type{import('../../../server/server.service.js')} */
const {COMMON, getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**@type{import('../../../server/db/sql/database.service.js')} */
const {InstalledCheck} = await await import(`file://${process.cwd()}/server/db/sql/database.service.js`);

/**@type{import('../../../server/db/file.service.js')} */
const {fileCache} = await import(`file://${process.cwd()}/server/db/file.service.js`);

const fs = await import('node:fs');

/**
 * Checks if ok to start app
 * @param {number|null} app_id
 * @returns {Promise.<boolean>}
 */
const commonAppStart = async (app_id=null) =>{
    const common_app_id = getNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'APP_COMMON_APP_ID'in key)[0].APP_COMMON_APP_ID) ?? 0;
    const db_use = getNumberValue(fileCache('CONFIG_SERVER').SERVICE_DB.filter((/**@type{*}*/key)=>'USE' in key)[0].USE);
    if (fileCache('CONFIG_SERVER').METADATA.MAINTENANCE==0 && fileCache('CONFIG_SERVER').SERVICE_DB.filter((/**@type{*}*/key)=>'START' in key  )[0].START=='1' && 
        fileCache('CONFIG_APPS').APPS[common_app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'APP_START' in parameter)[0].APP_START=='1' &&
        ((db_use==5 && await InstalledCheck(app_id, 1)
                                .then((/**@type{{installed:boolean}[]}*/result)=>app_id?result[0].installed:true)
                                .catch(()=>false)) || 
         fileCache('CONFIG_APPS').APPS[app_id ?? 0].SECRETS[`SERVICE_DB_DB${db_use}_APP_USER`] ))
        if (app_id == null)
            return true;
        else{
            if (fileCache('CONFIG_APPS').APPS[app_id ?? 0].STATUS =='ONLINE')
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
    const { BFF_server } = await import(`file://${process.cwd()}/server/bff.service.js`);
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
    //ignore error in this case and fetch randcom geolocation using WORLDCITIES service instead if GEOLOCATION is not available
    const result_gps = await BFF_server(parameters.app_id, parametersBFF)
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
        const result_city = await BFF_server(parameters.app_id, parametersBFF).catch((/**@type{import('../../../server/types.js').server_server_error}*/error)=>{throw error;});
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
        const common_app_id = getNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'APP_COMMON_APP_ID'in key)[0].APP_COMMON_APP_ID) ?? 0;
        const app_cache_control = fileCache('CONFIG_APPS').APPS[common_app_id].PARAMETERS
                                    .filter((/**@type{*}*/parameter)=>'APP_CACHE_CONTROL' in parameter)[0].APP_CACHE_CONTROL;
        const app_cache_control_font = fileCache('CONFIG_APPS').APPS[common_app_id].PARAMETERS
                                        .filter((/**@type{*}*/parameter)=>'APP_CACHE_CONTROL_FONT' in parameter)[0].APP_CACHE_CONTROL_FONT;
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
                LogAppE(parameters.app_id, COMMON.app_filename(import.meta.url), 'commonAssetfile()', COMMON.app_line(), `Invalid file type ${parameters.url}`)
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
 *          res:import('../../../server/types.js').server_server_res|null}} parameters
 * @returns {Promise.<void>}
 */
const commonFunctionRun = async parameters => {
    const module_path = fileCache('CONFIG_APPS').APPS[parameters.app_id].MODULES.filter((/**@type{*}*/file)=>file[0]=='FUNCTION' && file[1]==parameters.resource_id);
    if (module_path[0]){
        const {default:RunFunction} = await import(`file://${process.cwd()}${module_path[0][4]}`);
        return await RunFunction(parameters.app_id, parameters.data, parameters.user_agent, parameters.ip, parameters.locale, parameters.res);
    }
    else{
        LogAppE(parameters.app_id, COMMON.app_filename(import.meta.url), 'commonFunctionRun()', COMMON.app_line(), `Function ${parameters.resource_id} not found`)
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
    const module_path = fileCache('CONFIG_APPS').APPS[parameters.app_id].MODULES.filter((/**@type{*}*/file)=>file[0]=='MODULE' && file[1]==parameters.resource_id);
    if (module_path[0]){
        const {default:RunFunction} = await import(`file://${process.cwd()}${module_path[0][4]}`);
        return await RunFunction(parameters.app_id, parameters.data, parameters.user_agent, parameters.ip, parameters.locale, parameters.res).then((/**@type{*} */module)=>{return {STATIC:true, SENDFILE:module, SENDCONTENT:null};});
    }
    else{
        LogAppE(parameters.app_id, COMMON.app_filename(import.meta.url), 'commonModuleGet()', COMMON.app_line(), `Module ${parameters.resource_id} not found`)
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
 */
const commonComponentCreate = async parameters =>{
    /**@type{import('../../../server/iam.service.js')} */
    const { AuthorizeTokenApp } = await import(`file://${process.cwd()}/server/iam.service.js`);

    const common_app_id = getNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'APP_COMMON_APP_ID'in key)[0].APP_COMMON_APP_ID) ?? 0;
    //id token for APP, REPORT and MAINTENANCE
    const idtoken = (parameters.type=='APP' || parameters.type=='REPORT' || parameters.type=='MAINTENANCE')?
                        await AuthorizeTokenApp(parameters.app_id, parameters.componentParameters.ip):
                            null;
    //geodata for APP and REPORT
    const result_geodata = (parameters.type=='APP' || parameters.type=='REPORT')?
                                await commonGeodata({   app_id:parameters.app_id, 
                                                        endpoint:'SERVER_APP', 
                                                        ip:parameters.componentParameters.ip, 
                                                        user_agent:parameters.componentParameters.user_agent ??'', 
                                                        accept_language:parameters.componentParameters.locale??''}):
                                    null;
    const system_admin_only = await commonAppStart()==true?0:1;
    
    switch (parameters.type){
        case 'APP':{
            /**@type{import('../../../server/config.service.js')} */
            const {CheckFirstTime} = await import(`file://${process.cwd()}/server/config.service.js`);

            /**@type{import('../../../server/types.js').server_apps_app_service_parameters} */
            const app_service_parameters = {   
                app_id:                 parameters.app_id,
                app_logo:               fileCache('CONFIG_APPS').APPS[parameters.app_id].LOGO,
                app_email:              fileCache('CONFIG_APPS').APPS[parameters.app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'EMAIL' in parameter)[0].EMAIL,
                app_copyright:          fileCache('CONFIG_APPS').APPS[parameters.app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'COPYRIGHT' in parameter)[0].COPYRIGHT,
                app_link_url:           fileCache('CONFIG_APPS').APPS[parameters.app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'LINK_URL' in parameter)[0].LINK_URL,
                app_link_title:         fileCache('CONFIG_APPS').APPS[parameters.app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'LINK_TITLE' in parameter)[0].LINK_TITLE,
                app_text_edit:          fileCache('CONFIG_APPS').APPS[parameters.app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'TEXT_EDIT' in parameter)[0].TEXT_EDIT,
                app_framework :         getNumberValue(fileCache('CONFIG_APPS').APPS[common_app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'APP_FRAMEWORK' in parameter)[0].APP_FRAMEWORK) ?? 0,
                app_framework_messages: getNumberValue(fileCache('CONFIG_APPS').APPS[common_app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'APP_FRAMEWORK_MESSAGES' in parameter)[0].APP_FRAMEWORK_MESSAGES) ?? 1,
                app_rest_api_version:   getNumberValue(fileCache('CONFIG_APPS').APPS[common_app_id].PARAMETERS.filter((/**@type{*}*/parameter)=>'APP_REST_API_VERSION' in parameter)[0].APP_REST_API_VERSION) ?? 1,
                app_idtoken:            idtoken ?? '',
                locale:                 parameters.componentParameters.locale ?? '',
                system_admin_only:      system_admin_only,
                client_latitude:        result_geodata?.latitude,
                client_longitude:       result_geodata?.longitude,
                client_place:           result_geodata?.place ?? '',
                client_timezone:        result_geodata?.timezone,
                common_app_id:          common_app_id,
                rest_resource_bff:      fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=>'REST_RESOURCE_BFF' in key)[0].REST_RESOURCE_BFF ?? '/bff',
                first_time:             system_admin_only==1?(CheckFirstTime()==true?1:0):0
            };
            const ITEM_COMMON_PARAMETERS  = {app:   fileCache('CONFIG_APPS').APPS[parameters.app_id].PARAMETERS
                                                                        .map((/**@type{*}*/parameter)=>{
                                                                                                        //add current app id for each parameter
                                                                                                        return {app_id: parameters.app_id, ...parameter};
                                                                                                        }).concat(fileCache('CONFIG_APPS').APPS[common_app_id].PARAMETERS
                                                                                                        .map((/**@type{*}*/parameter)=>{
                                                                                                                                        //add common app id for each parameter
                                                                                                                                        return {app_id: common_app_id, ...parameter};
                                                                                                                                        })),
                                            app_service:app_service_parameters};
            const componentParameter = {data:   {
                                                    CONFIG_APP:             {...fileCache('CONFIG_APPS').APPS[parameters.app_id]},
                                                    ITEM_COMMON_PARAMETERS: Buffer.from(JSON.stringify(ITEM_COMMON_PARAMETERS)).toString('base64')
                                                },
                                        methods:null};

            const {default:ComponentCreate} = await import('./component/common_app.js');
            return ComponentCreate(componentParameter);
        }
        case 'REPORT':{
            const {default:ComponentCreate} = await import('./component/common_report.js');
            
            const decodedReportparameters = Buffer.from(parameters.componentParameters.reportid ?? '', 'base64').toString('utf-8');
            const module = new URLSearchParams(decodedReportparameters).get('module');
            const papersize = new URLSearchParams(decodedReportparameters).get('ps');
            const report_path = fileCache('CONFIG_APPS').APPS[parameters.app_id].MODULES.filter((/**@type{*}*/file)=>file[0]=='REPORT' && file[1]==module)[0][3];
            const {default:RunReport} = await import(`file://${process.cwd()}${report_path}`);

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
                                            CONFIG_APP:{...fileCache('CONFIG_APPS').APPS[parameters.app_id]},
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
                                            CONFIG_APP:             {...fileCache('CONFIG_APPS').APPS[parameters.app_id]},
                                            ITEM_COMMON_PARAMETERS: Buffer.from(data).toString('base64')},
                                    methods:null
                                    });
        }
        case 'INFO_DISCLAIMER':{
            const {default:ComponentCreate} = await import('./component/common_info_disclaimer.js');
            return ComponentCreate({data: {app_name:fileCache('CONFIG_APPS').APPS[parameters.app_id].NAME},
                                    methods:null});
        }
        case 'INFO_PRIVACY_POLICY':{
            const {default:ComponentCreate} = await import('./component/common_info_privacy_policy.js');
            return ComponentCreate({data: {app_name:fileCache('CONFIG_APPS').APPS[parameters.app_id].NAME},
                                    methods:null});
        }
        case 'INFO_TERMS':{
            const {default:ComponentCreate} = await import('./component/common_info_terms.js');
            return ComponentCreate({data: {app_name:fileCache('CONFIG_APPS').APPS[parameters.app_id].NAME},
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
            return Object.entries(fileCache('CONFIG_APPS'))[0][1].filter(
                (/**@type{import('../../../server/types.js').server_config_apps_record}*/app)=>{return app.SUBDOMAIN == 'www';})[0].APP_ID;
        }
        default:{
            try {
                return Object.entries(fileCache('CONFIG_APPS'))[0][1].filter(
                    (/**@type{import('../../../server//types.js').server_config_apps_record}*/app)=>{return host.toString().split('.')[0] == app.SUBDOMAIN;})[0].APP_ID;    
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
 *          reportid:string,
 *          res:import('../../../server/types.js').server_server_res|null}} parameters
 */
const commonApp = async parameters =>{
    const host_no_port = parameters.host.substring(0,parameters.host.indexOf(':')==-1?parameters.host.length:parameters.host.indexOf(':'));
    const app_id = commonAppHost(host_no_port);
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
            case (app_id != getNumberValue(fileCache('CONFIG_SERVER').SERVER.filter((/**@type{*}*/key)=> 'APP_COMMON_APP_ID' in key)[0].APP_COMMON_APP_ID) && await commonAppStart(app_id) ==false):{
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:parameters.ip},type:'MAINTENANCE'});
            }
            case (parameters.url.toLowerCase().startsWith('/common')):{
                return await commonAssetfile({app_id:app_id, url:parameters.url.substring('/common'.length), basepath:'/apps/common/public', res:parameters.res}).catch(()=>null);
            }
            case (parameters.url.toLowerCase().startsWith('/css')):
            case (parameters.url.toLowerCase().startsWith('/component')):
            case (parameters.url.toLowerCase().startsWith('/images')):
            case (parameters.url.toLowerCase().startsWith('/js')):
            case (parameters.url == '/apps/common_types.js'): //
            case (parameters.url == '/manifest.json'):
            case (parameters.url == '/sw.js'):{
                return await commonAssetfile({app_id:app_id, url:parameters.url, basepath:fileCache('CONFIG_APPS').APPS[app_id].PATH, res:parameters.res}).catch(()=>null);
            }
            case (parameters.url == '/info/jsdoc'):{
                return await commonAssetfile({app_id:app_id, url:'/info/jsdoc/index.html'.substring('/info/jsdoc'.length), basepath:'/apps/common/src/jsdoc', res:parameters.res}).catch(()=>null);
            }
            case (parameters.url.toLowerCase().startsWith('/info/jsdoc')):{
                return await commonAssetfile({app_id:app_id, url:parameters.url.substring('/info/jsdoc'.length), basepath:'/apps/common/src/jsdoc', res:parameters.res}).catch(()=>null);
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
                                                                                        reportid:   parameters.reportid},type:'REPORT'});
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
            case ((fileCache('CONFIG_APPS').APPS[app_id].SHOWPARAM == 1 && parameters.url.substring(1) !== '')):{
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
                                    LogAppE(app_id, COMMON.app_filename(import.meta.url), 'commonApp()', COMMON.app_line(), err)
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
export {commonAppStart, commonAppHost, commonAssetfile,commonFunctionRun,commonModuleGet,commonApp, commonBFE};