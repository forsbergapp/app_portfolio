/** @module apps/common/src/common/service */

/**
 * @import {server_db_file_app,
 *          server_db_file_app_secret,
 *          server_db_file_app_module,
 *          server_db_file_app_parameter_common,
 *          server_config_apps_with_db_columns,
 *          server_apps_report_create_parameters,
 *          server_apps_app_service_parameters,
 *          server_apps_module_with_metadata,
 *          server_apps_module_metadata,
 *          server_server_routesparameters,
 *          server_server_res,
 *          server_bff_endpoint_type,
 *          server_bff_parameters,
 *          server_server_error,
 *          server_apps_email_return_createMail, server_apps_email_param_data} from '../../../server/types.js'
 */

/**@type{import('../../../server/db/fileModelApp.js')} */
const fileModelApp = await import(`file://${process.cwd()}/server/db/fileModelApp.js`);

/**@type{import('../../../server/db/fileModelAppModule.js')} */
const fileModelAppModule = await import(`file://${process.cwd()}/server/db/fileModelAppModule.js`);

/**@type{import('../../../server/db/fileModelAppParameter.js')} */
const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);

/**@type{import('../../../server/db/fileModelAppSecret.js')} */
const fileModelAppSecret = await import(`file://${process.cwd()}/server/db/fileModelAppSecret.js`);

/**@type{import('../../../server/db/fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('../../../server/db/fileModelIamUser.js')} */
const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);

/**@type{import('../../../server/db/fileModelLog.js')} */
const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);

/**@type{import('../../../server/server.js')} */
const {serverUtilAppFilename, serverUtilAppLine, serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**@type{import('../../../server/db/dbModelDatabase.js')} */
const dbModelDatabase = await await import(`file://${process.cwd()}/server/db/dbModelDatabase.js`);

const fs = await import('node:fs');

/**
 * @name commonMailCreate
 * @description Creates email
 * @function
 * @param {number} app_id                       - Application id
 * @param {server_apps_email_param_data} data         - Email param data
 * @returns {Promise<server_apps_email_return_createMail>}  - Email return data
 */
const commonMailCreate = async (app_id, data) =>{
    const {default:ComponentCreate} = await import('./component/common_mail.js');
    const email_html    = await ComponentCreate({data:{host:data.host ?? '', verification_code:data.verificationCode ?? ''}, methods:null});
    const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'));
    const secrets       = fileModelAppSecret.get({app_id:app_id, resource_id:common_app_id, res:null})[0];
    //email type 1-4 implemented are emails with verification code
    if (parseInt(data.emailtype)==1 || 
        parseInt(data.emailtype)==2 || 
        parseInt(data.emailtype)==3 ||
        parseInt(data.emailtype)==4){

        /** @type {string} */
        let email_from = '';
        switch (parseInt(data.emailtype)){
            case 1:{
                email_from = secrets.service_mail_type_signup_from_name;
                break;
            }
            case 2:{
                email_from = secrets.service_mail_type_unverified_from_name;
                break;
            }
            case 3:{
                email_from = secrets.service_mail_type_password_reset_from_name;
                break;
            }
            case 4:{
                email_from = secrets.service_mail_type_change_email_from_name;
                break;
            }
        }
        return {
            host:         secrets.service_mail_host,
            port:         secrets.service_mail_port,
            secure:       secrets.service_mail_secure,
            auth_user:    secrets.service_mail_username,
            auth_pass:    secrets.service_mail_password,
            from:               email_from,
            to:                 data.to,
            subject:            '❂❂❂❂❂❂',
            html:               email_html
        };
    }
    else
        throw '';
};
/**
 * @name commonMailSend
 * @description Creates and sends email
 * @function
 * @param {number} app_id 
 * @param {string} emailtype 
 * @param {string} ip
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {number} userid 
 * @param {string|null} verification_code 
 * @param {string} email 
 * @returns {Promise.<*>}
 */
const commonMailSend = async (app_id, emailtype, ip, user_agent, accept_language, userid, verification_code, email) => {
    /**@type{import('../../../server/bff.js')} */
    const {bffServer} = await import(`file://${process.cwd()}/server/bff.js`);
    /**@type{import('../../../server/db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

    const email_rendered = await commonMailCreate( app_id, 
                                    {
                                        emailtype:        emailtype,
                                        host:             fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST'),
                                        app_user_id:      userid,
                                        verificationCode: verification_code,
                                        to:               email,
                                    })
                                    .catch((/**@type{server_server_error}*/error)=>{throw error;});
        
    /**@type{server_bff_parameters}*/
    const parameters = {endpoint:'SERVER',
                        host:null,
                        url:'/bff/admin/v1/mail/sendemail',
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
 * @name commonAppStart
 * @description Checks if ok to start app
 * @function
 * @param {number|null} app_id
 * @returns {Promise.<boolean>}
 */
const commonAppStart = async (app_id=null) =>{
    const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'));
    if (common_app_id!=null){
        const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
        const NO_MAINTENANCE = fileModelConfig.get('CONFIG_SERVER','METADATA','MAINTENANCE')==0;
        const DB_START = fileModelConfig.get('CONFIG_SERVER', 'SERVICE_DB','START')=='1';
        const APP_START = fileModelAppParameter.get({app_id:app_id ?? common_app_id, resource_id:common_app_id, res:null})[0].common_app_start.value=='1';
        /**@ts-ignore */
        const DBOTHER_USER_INSTALLED = fileModelAppSecret.get({app_id:app_id ?? common_app_id, res:null})[0][`service_db_db${db_use}_app_user`];
        const DB5_USE_AND_INSTALLED = db_use==5 && await dbModelDatabase.dbInstalledCheck({app_id:app_id}).then(result=>app_id?result[0].installed:true).catch(()=>false);
        if (NO_MAINTENANCE && DB_START && APP_START && (DB5_USE_AND_INSTALLED || DBOTHER_USER_INSTALLED))
            if (app_id == null)
                return true;
            else{
                if (fileModelApp.get({app_id:app_id, resource_id:app_id, res:null})[0].status =='ONLINE')
                    return true;
                else
                    return false;
            }
        else
            return false;
    }
    else{
        //no required APP_COMMON_APP_ID set
        return false;
    }
        
};

/**
 * @name commonClientLocale
 * @description Get client locale from accept language from request
 * @function
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
 * @name commonGeodata
 * @description Returns geodata
 * @function
 * @param {{app_id:number,
 *          endpoint:server_bff_endpoint_type,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<*>}
 */
const commonGeodata = async parameters =>{
    /**@type{import('../../../server/bff.js')} */
    const { bffServer } = await import(`file://${process.cwd()}/server/bff.js`);
    //get GPS from IP
    /**@type{server_bff_parameters}*/
    const parametersBFF = { endpoint:parameters.endpoint,
                            host:null,
                            url:'/bff/app_id/v1/geolocation/ip',
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
        result_geodata.latitude =   result_gps.geoplugin_latitude;
        result_geodata.longitude=   result_gps.geoplugin_longitude;
        result_geodata.place    =   result_gps.geoplugin_city + ', ' +
                                    result_gps.geoplugin_regionName + ', ' +
                                    result_gps.geoplugin_countryName;
        result_geodata.timezone =   result_gps.geoplugin_timezone;
    }
    else{
        /**@type{server_bff_parameters}*/
        const parametersBFF = { endpoint:'APP_ID',
                                host:null,
                                url:'/bff/app_id/v1/app-module-function/COMMON_WORLDCITIES_CITY_RANDOM',
                                route_path:'/app-module-function/COMMON_WORLDCITIES_CITY_RANDOM',
                                method:'POST', 
                                query:'',
                                body:{data_app_id:serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID'))},
                                authorization:null,
                                ip:parameters.ip, 
                                user_agent:parameters.user_agent, 
                                accept_language:parameters.accept_language,
                                /**@ts-ignore */
                                res:{}};
        const result_city = await bffServer(parameters.app_id, parametersBFF)
                                    .then(result=>result.rows)
                                    .catch((/**@type{server_server_error}*/error)=>{throw error;});
        result_geodata.latitude =   result_city.lat;
        result_geodata.longitude=   result_city.lng;
        result_geodata.place    =   result_city.city + ', ' + result_city.admin_name + ', ' + result_city.country;
        result_geodata.timezone =   null;
    }
    return result_geodata;
};

/**
 * @name commonBFE
 * @description External request
 * @function
 * @param {{url:string,
 *          method:string,
 *          body:*,
 *          user_agent:string,
 *          ip:string,
 *          authorization:string|null,
 *          locale:string}} parameters
 * @returns {Promise.<*>}
 */
const commonBFE = async parameters =>{
    if (parameters.url.toLowerCase().startsWith('https://') || parameters.url.toLowerCase().startsWith('http://')){
        const zlib = await import('node:zlib');
        const request_protocol = parameters.url.toLowerCase().startsWith('https')?await import('node:https'):await import('node:http');
        const timeout_message = '🗺⛔?';
        const timeout = 5000;
        return new Promise((resolve, reject)=>{           
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
                rejectUnauthorized: false
            };
            const request = request_protocol.request(new URL(parameters.url),options, res =>{
                let responseBody = '';
                if (res.headers['content-encoding'] == 'gzip'){
                    const gunzip = zlib.createGunzip();
                    res.pipe(gunzip);
                    gunzip.on('data', (chunk) =>responseBody += chunk);
                    gunzip.on('end', () => resolve (responseBody));
                }
                else{
                    res.setEncoding('utf8');
                    res.on('data', (chunk) =>{
                        responseBody += chunk;
                    });
                    res.on('end', ()=>{
                        resolve (responseBody);
                    });
                }
                
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
    }
    else{
        /**@type{import('../../../server/iam.js')} */
        const { iamUtilMesssageNotAuthorized } = await import(`file://${process.cwd()}/server/iam.js`);
        throw iamUtilMesssageNotAuthorized();
    }
};

/**
 * @name commonAssetfile
 * @memberof ROUTE_APP
 * @description Get asset file
 *              Supported
 *              .css files
 *              .js files       
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
 *              .html files
 *              .webp files
 *              .png files
 *              .woff2 files
 *              .ttf files
 *              .json
 * @function
 * @param {{app_id:Number,
 *          url:String,
 *          basepath:string,
 *          res:server_server_res}} parameters
 * @returns {Promise.<{STATIC:Boolean, SENDFILE:string|null, SENDCONTENT?:string}>}
 */
const commonAssetfile = parameters =>{
    return new Promise((resolve, reject)=>{
        const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID'));
        if (common_app_id!=null){
            const app_cache_control = fileModelAppParameter.get({app_id:parameters.app_id, resource_id:common_app_id, res:null})[0].common_app_cache_control.value;
            const app_cache_control_font = fileModelAppParameter.get({app_id:parameters.app_id, resource_id:common_app_id, res:null})[0].common_app_cache_control_font.value;
            switch (parameters.url.toLowerCase().substring(parameters.url.lastIndexOf('.'))){
                case '.css':{
                    parameters.res.type('text/css; charset=utf-8');
                    if (app_cache_control !='')
                        parameters.res.set('Cache-Control', app_cache_control);
                    resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                case '.js':{
                    parameters.res.type('text/javascript; charset=utf-8');
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
                    parameters.res.type('text/html; charset=utf-8');
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
                    parameters.res.type('application/json; charset=utf-8');
                    if (app_cache_control !='')
                        parameters.res.set('Cache-Control', app_cache_control);
                    resolve({STATIC:true, SENDFILE:`${process.cwd()}${parameters.basepath}${parameters.url}`});
                    break;
                }
                default:{
                    fileModelLog.postAppE(parameters.app_id, serverUtilAppFilename(import.meta.url), 'commonAssetfile()', serverUtilAppLine(), `Invalid file type ${parameters.url}`)
                    .then(()=>{
                        parameters.res.statusCode = 403;
                        parameters.res.statusMessage = null;
                        reject(null);
                    });
                }
            }
        }
        else{
            parameters.res.statusCode = 500;
            parameters.res.statusMessage = null;
            reject(null);
        }
    });
};

/**
 * @name commonModuleRun
 * @description Run function for given app and role
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:string,
 *          data: {data_app_id:number},
 *          user_agent:string,
 *          ip:string,
 *          locale:string,
 *          endpoint:server_server_routesparameters['endpoint'],
 *          res:server_server_res|null}} parameters
 * @returns {Promise.<void>}
 */
const commonModuleRun = async parameters => {
    const module = commonRegistryAppModule(parameters.data.data_app_id, {type:'FUNCTION', name:parameters.resource_id,role:parameters.endpoint});
    if (module){
        const {default:RunFunction} = await import(`file://${process.cwd()}${module.common_path}`);
        return await RunFunction(parameters.app_id, parameters.data, parameters.user_agent, parameters.ip, parameters.locale, parameters.res);
    }
    else{
        fileModelLog.postAppE(parameters.app_id, serverUtilAppFilename(import.meta.url), 'commonModuleRun()', serverUtilAppLine(), `Function ${parameters.resource_id} not found`)
        .then(()=>{
            if (parameters.res)
                parameters.res.statusCode = 404;
        });
    }
};
/**
 * @name commonModuleGet
 * @description Get module of type REPORT or MODULE for given role
 *              REPORT returns component template with specified report using with parameters from app or report queue
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          resource_id:string,
 *          data:{
 *                  ps?:'A4'|'Letter', 
 *                  type:'REPORT'|'MODULE', 
 *                  reportid?:string,
 *                  report_parameters?:string,
 *                  queue_parameters?:{}},
 *          user_agent:string,
 *          ip:string,
 *          locale:string,
 *          endpoint:server_bff_endpoint_type|'',
 *          res:server_server_res|null}} parameters
 * @returns {Promise.<*>}
 */
const commonModuleGet = async parameters => {
    if (parameters.data?.type =='REPORT' || parameters.data?.type =='MODULE'){
        const module = commonRegistryAppModule(parameters.app_id, {type:parameters.data.type, name:parameters.resource_id,role:parameters.endpoint});
        if (module && (parameters.data.type=='MODULE' ||parameters.data.type=='REPORT')){
            if (parameters.data.type=='MODULE'){
                const {default:RunFunction} = await import(`file://${process.cwd()}${module.common_path}`);
                parameters.res?.type('text/javascript; charset=utf-8');
                return await RunFunction(parameters.app_id, parameters.data, parameters.user_agent, parameters.ip, parameters.locale, parameters.res).then((/**@type{*} */module)=>{return {STATIC:true, SENDFILE:module, SENDCONTENT:null};});
            }
            else{
                //report
                /**@type{import('../../../server/iam.js')} */
                const { iamAuthorizeIdToken } = await import(`file://${process.cwd()}/server/iam.js`);
                //ID token is created but not used in report
                await iamAuthorizeIdToken(parameters.app_id, parameters.ip, 'REPORT');
                const result_geodata =  await commonGeodata({   app_id:parameters.app_id, 
                                                                endpoint:'SERVER', 
                                                                ip:parameters.ip, 
                                                                user_agent:parameters.user_agent ??'', 
                                                                accept_language:parameters.locale??''});
                const {default:ComponentCreate} = await import('./component/common_report.js');
                
                const {default:RunReport} = await import(`file://${process.cwd()}${module.common_path}`);
    
                const pagesize = parameters.data.ps ?? new URLSearchParams(Buffer.from(parameters.data.reportid ?? '', 'base64').toString('utf-8')).get('ps');
                /**@type{server_apps_report_create_parameters} */
                const data = {  app_id:         parameters.app_id,
                                queue_parameters:parameters.data.queue_parameters,
                                reportid:       parameters.data.reportid ?? '',
                                ip:             parameters.ip,
                                user_agent:     parameters.user_agent ?? '',
                                accept_language:parameters.locale ?? '',
                                latitude:       result_geodata?.latitude,
                                longitude:      result_geodata?.longitude
                                };
                return ComponentCreate({data:   {
                                                CONFIG_APP: {...fileModelApp.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0]},
                                                data:       data,
                                                /**@ts-ignore */
                                                papersize:  (pagesize=='' ||pagesize==null)?'A4':pagesize
                                                },
                                        methods:{function_report:RunReport}});
            }
            
        }
        else{
            fileModelLog.postAppE(parameters.app_id, serverUtilAppFilename(import.meta.url), 'commonModuleGet()', serverUtilAppLine(), `Module ${parameters.resource_id} not found`)
            .then(()=>{
                if (parameters.res)
                    parameters.res.statusCode = 404;
                return {STATIC:true, SENDFILE:null, SENDCONTENT:''};
            });
        }
    }
    else{
        /**@type{import('../../../server/iam.js')} */
        const {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
        if (parameters.res)
            parameters.res.statusCode = 400;
        throw iamUtilMesssageNotAuthorized();
    }
};
/**
 * @name commonAppReportQueue
 * @description Runs report in queue
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          resource_id:string,
 *          iam:string,
 *          data:{  ps:'A4', 
 *                  report_parameters:string},
 *          user_agent:string,
 *          ip:string,
 *          locale:string,
 *          endpoint:server_bff_endpoint_type|'',
 *          res:server_server_res}} parameters
 * @returns {Promise.<void>}
 */
const commonAppReportQueue = async parameters =>{
    /**@type{import('../../../server/db/fileModelAppModuleQueue.js')} */
    const fileModelAppModuleQueue = await import(`file://${process.cwd()}/server/db/fileModelAppModuleQueue.js`);

    /**@type{import('../../../server/db/fileModelIamUser.js')} */
    const fileModelIamUser = await import(`file://${process.cwd()}/server/db/fileModelIamUser.js`);

    /**@type{import('../../../server/iam.js')} */
    const { iamUtilDecode } = await import(`file://${process.cwd()}/server/iam.js`);
                   
    const {id} = await fileModelAppModuleQueue.post(parameters.app_id, 
                                                    {
                                                    type:'REPORT',
                                                    name:parameters.resource_id,
                                                    parameters:parameters.data.report_parameters,
                                                    user:fileModelIamUser.get(  parameters.app_id, 
                                                                                serverUtilNumberValue(iamUtilDecode(parameters.iam).get('iam_user_id')), 
                                                                                parameters.res)[0].username
                                                    }, 
                                                    parameters.res);
    await fileModelAppModuleQueue.update(parameters.app_id, id, { start:new Date().toISOString(),
                                                            progress:0, 
                                                            status:'RUNNING'}, null);
    //report can update progress and only progress if necessary
    //add queue id and parameters from parameter from origin
    commonModuleGet({   app_id:             parameters.app_id,
                        resource_id:        parameters.resource_id,
                        data:               {type:'REPORT', 
                                                ...{ps:parameters.data.ps}, 
                                                ...{queue_parameters:{appModuleQueueId:id,
                                                                        ...Object.fromEntries(Array.from(new URLSearchParams(parameters.data.report_parameters)).map(param=>[param[0],param[1]]))}
                                                    }
                                            },
                        user_agent:         parameters.user_agent,
                        ip:                 parameters.ip,
                        locale:             parameters.locale,
                        endpoint:           parameters.endpoint,
                        res:                parameters.res})
    .then(result=>{
        if (result){
            fileModelAppModuleQueue.postResult(parameters.app_id, id, result)
            .then(()=>fileModelAppModuleQueue.update(parameters.app_id, id, {end:new Date().toISOString(), progress:1, status:'SUCCESS'}, null));
        }
    })
    .catch(error=>{
        fileModelAppModuleQueue.update(parameters.app_id, id, { end:new Date().toISOString(), 
                                                                progress:1, 
                                                                status:'FAIL',
                                                                message:error.message ?? error}, null);
    });
};

/**
 * @name commonModuleMetaDataGet
 * @description Returns all modules with metadata
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          data:{type:'REPORT'|'MODULE'|'FUNCTION'},
 *          resource_id:number,
 *          res:server_server_res|null}} parameters
 * @returns {Promise.<server_apps_module_with_metadata[]>}
 */
const commonModuleMetaDataGet = async parameters =>{
    if (parameters.data.type=='REPORT'||parameters.data.type=='MODULE'||parameters.data.type=='FUNCTION'){
        /**@type{*[]} */
        const modules = fileModelAppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id,data:{data_app_id:parameters.app_id}, res:parameters.res})
        .filter(row=>row.common_type==parameters.data.type);
        
        for (const row of modules){
            const module = await import(`file://${process.cwd()}${row.common_path}`);
            /**@type{server_apps_module_metadata[]}*/
            const metadata = module.metadata;
            row.common_metadata = metadata;
        }
        return modules;
    }
    else{
        /**@type{import('../../../server/iam.js')} */
        const {iamUtilMesssageNotAuthorized} = await import(`file://${process.cwd()}/server/iam.js`);
        if (parameters.res)
            parameters.res?.statusCode==400;
        throw iamUtilMesssageNotAuthorized();
    }
}; 
/**
 * @name commonComponentCreate
 * @memberof ROUTE_APP
 * @description Creates server component and returns to client
 *              app
 *              reports
 *              maintenance
 *              mail
 *              info disclaimer
 *              info privacy policy
 *              info terms
 *              server error
 * @function
 * @param {{app_id:number, 
 *          componentParameters:{   param?:             string|null,
 *                                  ip:                 string, 
 *                                  user_agent?:        string,
 *                                  locale?:            string,
 *                                  reportid?:          string,
 *                                  host?:              string},
 *          type:'APP'|'MAINTENANCE'|'INFO_DISCLAIMER'|'INFO_PRIVACY_POLICY'|'INFO_TERMS'}} parameters
 * @returns {Promise.<string>}
 */
const commonComponentCreate = async parameters =>{
    /**@type{import('../../../server/iam.js')} */
    const { iamAuthorizeIdToken } = await import(`file://${process.cwd()}/server/iam.js`);

    const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID'));
    //id token for APP and MAINTENANCE
    const idtoken = (parameters.type=='APP' ||parameters.type=='MAINTENANCE')?
                        await iamAuthorizeIdToken(parameters.app_id, parameters.componentParameters.ip, parameters.type):
                            null;
    //geodata for APP
    const result_geodata = parameters.type=='APP'?
                                await commonGeodata({   app_id:parameters.app_id, 
                                                        endpoint:'SERVER', 
                                                        ip:parameters.componentParameters.ip, 
                                                        user_agent:parameters.componentParameters.user_agent ??'', 
                                                        accept_language:parameters.componentParameters.locale??''}):
                                    null;
    const admin_only = await commonAppStart()==true?0:1;
    
    switch (parameters.type){
        case 'APP':{
            /**@type{server_apps_app_service_parameters} */
            const app_service_parameters = {   
                app_id:                 parameters.app_id,
                app_logo:               fileModelApp.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0].logo,
                app_idtoken:            idtoken ?? '',
                locale:                 parameters.componentParameters.locale ?? '',
                admin_only:             admin_only,
                client_latitude:        result_geodata?.latitude,
                client_longitude:       result_geodata?.longitude,
                client_place:           result_geodata?.place ?? '',
                client_timezone:        result_geodata?.timezone,
                common_app_id:          common_app_id,
                rest_resource_bff:      fileModelConfig.get('CONFIG_SERVER','SERVER', 'REST_RESOURCE_BFF'),
                first_time:             admin_only==1?(fileModelIamUser.get(parameters.app_id, null, null).length==0?1:0):0
            };
            /**@type{server_db_file_app_parameter_common} */
            const common_parameter = fileModelAppParameter.get({app_id:parameters.app_id, resource_id:common_app_id, res:null})[0];
            //return only used parameters
            delete common_parameter.app_copyright;
            delete common_parameter.app_email;
            delete common_parameter.app_id;
            delete common_parameter.app_link_title;
            delete common_parameter.app_link_url;
            delete common_parameter.app_text_edit;
            delete common_parameter.common_app_log;
            delete common_parameter.common_app_start;

            const APP_PARAMETERS  = {   APP:        fileModelAppParameter.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0], 
                                        COMMON:     common_parameter,
                                        INFO:       app_service_parameters};
            const componentParameter = {data:   {
                                                    APP:            fileModelApp.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0],
                                                    APP_PARAMETERS: Buffer.from(JSON.stringify(APP_PARAMETERS)).toString('base64')
                                                },
                                        methods:null};

            const {default:ComponentCreate} = await import('./component/common_app.js');
            return ComponentCreate(componentParameter);
        }
        case 'MAINTENANCE':{
            //maintenance can be used from all app_id
            const data = JSON.stringify({   
                app_id: parameters.app_id,
                common_app_id: common_app_id,
                app_idtoken: idtoken,
                rest_resource_bff: fileModelConfig.get('CONFIG_SERVER','SERVER', 'REST_RESOURCE_BFF')
            });

            const {default:ComponentCreate} = await import('./component/common_maintenance.js');
            return ComponentCreate({data:   {
                                            CONFIG_APP:             {...fileModelApp.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0]},
                                            ITEM_COMMON_PARAMETERS: Buffer.from(data).toString('base64')},
                                    methods:null
                                    });
        }
        case 'INFO_DISCLAIMER':{
            const {default:ComponentCreate} = await import('./component/common_info_disclaimer.js');
            return ComponentCreate({data: {app_name:fileModelApp.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0].name},
                                    methods:null});
        }
        case 'INFO_PRIVACY_POLICY':{
            const {default:ComponentCreate} = await import('./component/common_info_privacy_policy.js');
            return ComponentCreate({data: {app_name:fileModelApp.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0].name},
                                    methods:null});
        }
        case 'INFO_TERMS':{
            const {default:ComponentCreate} = await import('./component/common_info_terms.js');
            return ComponentCreate({data: {app_name:fileModelApp.get({app_id:parameters.app_id, resource_id:parameters.app_id, res:null})[0].name},
                                    methods:null});
        }
        default:{
            return '';
        }
    }
};

/**
 * @name commonAppHost
 * @description Returns app id for given host
 *              Checks if host matches configured host or starts with www or is a valid subdomain
 * @param {string} host 
 * @returns {number|null}
 */
const commonAppHost = host =>{
    switch (host.toString().split('.')[0]){
        case fileModelConfig.get('CONFIG_SERVER','SERVER', 'HOST'):
        case 'www':{
            //localhost
            return fileModelApp.get({app_id:null, resource_id:null, res:null}).filter((/**@type{server_db_file_app}*/app)=>app.subdomain == 'www')[0].id;
        }
        default:{
            try {
                return fileModelApp.get({app_id:null, resource_id:null, res:null}).filter((/**@type{server_db_file_app}*/app)=>host.toString().split('.')[0] == app.subdomain)[0].id;
            } catch (error) {
                return null;
            }
        }
    }
 };
/**
 * @name commonApp
 * @namespace ROUTE_APP
 * @description Get app asset, common asset, app info page, app report, app module or app
 * @function
 * @param {{ip:string,
 *          host:string,
 *          user_agent:string,
 *          accept_language:string,
 *          url:string,
 *          query:*,
 *          res:server_server_res|null}} parameters
 * @returns {Promise.<*>}
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
            case (app_id != serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID')) && await commonAppStart(app_id) ==false):{
                parameters.res?.type('text/html; charset=utf-8');
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
                return await commonAssetfile({app_id:app_id, url:parameters.url, basepath:fileModelApp.get({app_id:app_id, resource_id:app_id, res:null})[0].path, res:parameters.res}).catch(()=>null);
            }
            case (parameters.url.toLowerCase().startsWith('/info/about')):{
                return '';
            }
            case (parameters.url.toLowerCase().startsWith('/info/disclaimer')):{
                parameters.res?.type('text/html; charset=utf-8');
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:parameters.ip},type:'INFO_DISCLAIMER'});
            }
            case (parameters.url.toLowerCase().startsWith('/info/privacy_policy')):{
                parameters.res?.type('text/html; charset=utf-8');
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:parameters.ip},type:'INFO_PRIVACY_POLICY'});
            }
            case (parameters.url.toLowerCase().startsWith('/info/terms')):{
                parameters.res?.type('text/html; charset=utf-8');
                return await commonComponentCreate({app_id:app_id, componentParameters:{ip:parameters.ip},type:'INFO_TERMS'});
            }
            case (parameters.url == '/'):
            case ((fileModelApp.get({app_id:app_id, resource_id:app_id, res:null})[0].showparam == 1 && parameters.url.split('/profile/')[1]?.length>1)):{
                parameters.res?.type('text/html; charset=utf-8');
                return await commonComponentCreate({app_id:app_id, componentParameters:{param:          parameters.url.split('/profile/')[1]?.length>1?parameters.url.split('/profile/')[1]:null,
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
                                .catch((/**@type{server_server_error}*/err)=>{
                                    fileModelLog.postAppE(app_id, serverUtilAppFilename(import.meta.url), 'commonApp()', serverUtilAppLine(), err)
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
 * @name commonAppsGet
 * @description Get all aps from app registry and translated names and add info to create url links
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          locale:string}} parameters
 * @returns {Promise.<server_config_apps_with_db_columns[]>}
 */
const commonAppsGet = async parameters =>{
    /**@type{import('../../../server/db/fileModelAppTranslation.js')} */
    const fileModelAppTranslation = await import(`file://${process.cwd()}/server/db/fileModelAppTranslation.js`);
    
    /**@type{server_db_file_app[]}*/
    const apps = fileModelApp.get({app_id:parameters.app_id, resource_id:null, res:null});
    for (const app of apps){
        const image = await fs.promises.readFile(`${process.cwd()}${app.path + app.logo}`);
        /**@ts-ignore */
        app.logo        = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
    }
    const HTTPS_ENABLE = fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_ENABLE');
    return apps
    .filter(app=>app.id == (parameters.resource_id ?? app.id))
    .map(app=>{
        return {
                    app_id:app.id,
                    name:app.name,
                    subdomain:app.subdomain,
                    protocol : HTTPS_ENABLE =='1'?'https://':'http://',
                    host : fileModelConfig.get('CONFIG_SERVER','SERVER','HOST'),
                    port : serverUtilNumberValue(HTTPS_ENABLE=='1'?
                                        fileModelConfig.get('CONFIG_SERVER','SERVER','HTTPS_PORT'):
                                            fileModelConfig.get('CONFIG_SERVER','SERVER','HTTP_PORT')),
                    app_name_translation : fileModelAppTranslation.get(parameters.app_id,null,parameters.locale, app.id,null).filter(appTranslation=>appTranslation.app_id==app.id)[0].json_data.name,
                    logo:app.logo
                };
    });
};

/**
 * @name commonRegistryAppModule
 * @description App registry APP MODULE
 *              Modules that are shared by apps and server
 * @function
 * @param {number} app_id
 * @param {{type:string,
 *          name:string,
 *          role:string|null}} parameters
 * @returns {server_db_file_app_module}
 */
const commonRegistryAppModule = (app_id, parameters) => fileModelAppModule.get({app_id:app_id, resource_id:null, data:{data_app_id:app_id}, res:null})
                                                           .filter((/**@type{server_db_file_app_module}*/app)=>
                                                               app.common_type==parameters.type && 
                                                               app.common_name==parameters.name && 
                                                               app.common_role == parameters.role)[0];

/**
 * @name commonRegistryAppSecretDBReset
 * @description App Registry APP SECRET reset db username and passwords for database in use
 * @function
 * @param {number}  app_id
 * @returns {Promise.<void>}
 */
const commonRegistryAppSecretDBReset = async app_id => {
    /**@type{import('../../../server/db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    /**@type{import('../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

    /**@type{server_db_file_app_secret[]}*/
    const APP_SECRETS = fileModelAppSecret.get({app_id:app_id, resource_id:app_id, res:null});
    
    const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
    for (const app_secret of APP_SECRETS){
        /**@ts-ignore */
        if (app_secret[`service_db_db${db_use}_app_user`]){
            fileModelAppSecret.update({app_id:app_id, resource_id:app_secret.app_id, data:{  parameter_name:`service_db_db${db_use}_app_user`,
                                                                        parameter_value:''}, res:null});
            
        }
        /**@ts-ignore */
        if (app_secret[`service_db_db${db_use}_app_password`]){
            fileModelAppSecret.update({app_id:app_id, resource_id:app_secret.app_id, data:{  parameter_name:`service_db_db${db_use}_app_password`,
                                                                        parameter_value:''}, res:null});
        }   
    }
};
export {commonMailCreate, commonMailSend,
        commonAppStart, commonAppHost, commonAssetfile,commonModuleRun,commonModuleGet,commonAppReportQueue, commonModuleMetaDataGet, commonApp, commonBFE, commonAppsGet, 
        commonRegistryAppModule,
        commonRegistryAppSecretDBReset};