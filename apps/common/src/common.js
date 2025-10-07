/** @module apps/common/src/common */

/**
 * @import {server} from '../../../server/types.js'
 * 
 */

const {server} = await import('../../../server/server.js');
const {default:ComponentCreate} = await import('./component/common_app.js');
const {default:ComponentMaintenance} = await import('./component/common_maintenance.js');
const {default:ComponentReport} = await import('./component/common_report.js');
const {default:ComponentInfo} = await import('./component/common_info.js');
const {default:serverError} = await import('./component/common_server_error.js');
const {getIP} = await import('./functions/common_geolocation.js');
const {default:worldcities} = await import('./functions/common_worldcities.js');

const fs = await import('node:fs');

/**
 * @name commonConvertBinary
 * @description  converts binary file to base64 url string
 * @param {string} content_type
 * @param {string} path
 * @returns {Promise.<server['server']['response']>}
 */
const commonConvertBinary = async (content_type, path) =>
    fs.promises.readFile(`${server.ORM.serverProcess.cwd()}${path}`)
            .then(file=> {
                return {type:'JSON', 
                        result:{resource:
                                content_type.startsWith('font/woff')? 
                                    /**@ts-ignore */
                                    `data:font/woff2;charset=utf8;base64,${Buffer.from(file, 'binary').toString('base64')}`:
                                        /**@ts-ignore */
                                        `data:${content_type};base64,${Buffer.from(file, 'binary').toString('base64')}`
                                }
                        };
            });

/**
 * @name commonGetFile
 * @description Returns file from cache in FILES variable or reads from disk, saves in variable and returns file content.
 *              Modify function parameter can be used to modify original content.
 *              Comment rows are removed from all css and javascript except common third party modules before modify function.
 * @function
 * @param{{ app_id:number,
 *          path:string,
 *          content_type:string,
 *          modify?:(arg0:string)=>string }} parameters
 * @returns {Promise.<*>}
 */
const commonGetFile = async parameters =>{
    /**
     * @param {{path:string,
     *          file:string
     *          content_type:string,
     *          }} parameters
     */
    const adjustResult = parameters =>{
        // remove comment rows for text/css and text/javascript and except third party modules
        return  (parameters.path.startsWith('/apps/') && 
                !parameters.path.startsWith('/apps/common/public/modules/') &&
                ['text/css','text/javascript'].includes(parameters.content_type))?
                parameters.file
                .replaceAll('\r','\n')
                .split('\n')
                .filter(row=>
                            !row.trimStart().toLowerCase().startsWith('/*') &&
                            !row.trimStart().toLowerCase().startsWith('*') &&
                            !row.trimStart().toLowerCase().startsWith('//') &&
                            row!='')
                .join('\n'):
                    parameters.file;
    };
    
    return (['font/woff2','image/png', 'image/webp'].includes(parameters.content_type)?
                fs.promises.readFile(`${server.ORM.serverProcess.cwd()}${parameters.path}`):
                    fs.promises.readFile(`${server.ORM.serverProcess.cwd()}${parameters.path}`, 'utf8'))
            .then(result=>{
                const file = ['font/woff2','image/png', 'image/webp'].includes(parameters.content_type)?
                                parameters.content_type == 'font/woff2'? 
                                            /**@ts-ignore */
                                            `data:font/woff2;charset=utf8;base64,${Buffer.from(result, 'binary').toString('base64')}`:
                                                /**@ts-ignore */
                                                `data:${parameters.content_type};base64,${Buffer.from(result, 'binary').toString('base64')}`
                                        :
                                    (parameters.modify?
                                        parameters.modify(adjustResult({  
                                                                path:parameters.path,
                                                                content_type:parameters.content_type,
                                                                file:result.toString()})):
                                            adjustResult({  
                                                path:parameters.path,
                                                content_type:parameters.content_type,
                                                file:result.toString()}));
                return file;
            })
            .catch(error=>{
                server.ORM.db.Log.post({app_id:parameters.app_id, 
                                        data:{  object:'LogAppError', 
                                                app:{   AppFilename:server.UtilAppFilename(import.meta.url),
                                                        AppFunctionName:'commonGetFile()',
                                                        AppLine:server.UtilAppLine()
                                                },
                                                log:`Resource ${parameters.path}, error:${error}`
                                            }
                                        })
                                        /**@ts-ignore */
                                        .then(result=>{
                                            return result.http?
                                                    result:
                                                        {   http:400,
                                                            code:'APP',
                                                            text:server.iam.iamUtilMessageNotAuthorized(),
                                                            developerText:'commonGetFile',
                                                            moreInfo:null,
                                                            type:'JSON'
                                                        };
                                                    
                                        });
            });
};

/**
 * @name commonCssFonts
 * @description Returns resource /common/css/font/fonts.css used with updated url and db records to create at start
 *              and saved on serverClass in server.js
 *              can return base64 url or secure url:
 *              secure url logic:
 *              replaces url with secure font url /bff/x/[uuid]
 *              returns array with data to create records in IamEncryption with old url for all font url
 *              returns {css:string, db_records:server['ORM']['Object']['IamEncryption'][]}
 * @param {boolean} base64
 * @returns {Promise.<{css:string, db_records:server['ORM']['Object']['IamEncryption'][]}>}
 * @function
 */
const commonCssFonts = async (base64=false)=>{
    const cssFontFace = [];
    /**@type {{uuid:string, url:string}[]}} */
    const url_record = [];
    /**@type{server['ORM']['Object']['IamEncryption'][]} */
    const db_records = [];
    const resource_directory = server.ORM.db.App.get({app_id:0, resource_id:0}).result[0].Path;
    for (const fontFace of (await fs.promises
                            .readFile(`${server.ORM.serverProcess.cwd()}${server.ORM.db.App.get({app_id:0, resource_id:0}).result[0].Path}/css/font/fonts.css`))
                            .toString('utf8')
                            .replaceAll('\r','\n')
                            .split('@')){
        //Filter font most used or set * for all
        if (['*'].filter(font=>font=='*'?true:fontFace.indexOf(`font-family: '${font}'`)>-1).length>0){
                const css = [];
                for (const row of fontFace.split('\n'))
                    if (row.trimStart().toLowerCase().startsWith('src')){
                        const startString = 'src: url(';
                        const endString = ') format';
                        const url = row.substring(
                                                    row.indexOf(startString) + startString.length,
                                                    row.indexOf(endString)
                                                );
                        if (base64)
                            //save url as base64 without link
                            css.push(   row.substring(0, row.indexOf(startString) + startString.length) +
                                        (await commonConvertBinary('font/woff2',`${resource_directory}${url.replace('/common','')}`)).result.resource + 
                                        row.substring(row.indexOf(endString)));
                        else{
                            //save url as secure url link
                            //font url can be repeated in css
                            if (url_record.filter(row=>row.url == url).length==0){
                                const uuid  = server.security.securityUUIDCreate(); 
                                url_record.push({uuid:uuid, url:url});
                                const secret= Buffer.from(JSON.stringify(await server.security.securityTransportCreateSecrets()),'utf-8')
                                                .toString('base64');
                                /**@type{server['ORM']['Object']['IamEncryption']} */
                                const data = {  Id:                Date.now(),
                                                AppId:             0, 
                                                IamAppIdTokenId:    null, 
                                                Uuid:               uuid, 
                                                Secret:             secret, 
                                                Url:                url,
                                                Type:               'FONT',
                                                Created:            new Date().toISOString()}
                                db_records.push(data);
                                css.push(row.substring(0, row.indexOf(startString) + startString.length) +
                                                `/bff/x/${uuid}` + row.substring(row.indexOf(endString)));
                            }
                            else
                                css.push(row.substring(0, row.indexOf(startString) + startString.length) +
                                                `/bff/x/${url_record.filter(row=>row.url == url)[0].uuid}` + row.substring(row.indexOf(endString)));

                        }                        
                            
                    }
                    else
                        css.push(row);
                cssFontFace.push(css.join('').substring(0, css.join('').indexOf('}')+1));
        }
    }
    return {css:cssFontFace.join('\n@'), db_records:db_records};
};

/**
 * @name commonAppStart
 * @description Checks if ok to start app
 * @function
 * @param {number} app_id
 * @returns {Promise.<boolean>}
 */
const commonAppStart = async (app_id) =>{
    /**@type{server['ORM']['Object']['ConfigServer']} */
    const configServer = server.ORM.db.ConfigServer.get({app_id:app_id}).result;
    if (server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)!=null &&
        configServer.METADATA.MAINTENANCE==0 &&
        server.ORM.db.App.get({ app_id:app_id, 
                                resource_id:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_START_APP_ID' in parameter)[0].APP_START_APP_ID)??0}).result[0].Status =='ONLINE')
            return true;
    else
        return false;
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
    if (!accept_language || accept_language.startsWith('text') || accept_language=='*')
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
 * @name commonResourceFile
 * @memberof ROUTE_APP
 * @description Get resource from file or from cached file in FILES variable to avoid disk read
 *              Supported
 *              .css files
 *              .js files       
 *                  modifies at request:
 *                  /modules/react/react-dom.development.js
 *                      makes ECMAScript module adding export
 *                  /modules/react/react.development.js
 *                      makes ECMAScript module adding export
 *              .html files
 *              .webp files
 *              .png files
 *              .woff2 files
 *              .json
 * @function
 * @param {{app_id:number,
 *          resource_id:string, 
 *          content_type:   string,
 *          data_app_id:number}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{resource:*}}>}
 */
const commonResourceFile = async parameters =>{
    const resource_directory = server.ORM.db.App.get({app_id:parameters.app_id, resource_id:parameters.data_app_id}).result[0].Path;
    const resource_path = parameters.data_app_id==server.ORM.UtilNumberValue(server.ORM.db.ConfigServer.get({app_id:parameters.app_id,data:{config_group:'SERVICE_APP', parameter:'APP_COMMON_APP_ID'}}).result)?
                            parameters.resource_id.replace('/common', ''):
                                parameters.resource_id;
    switch (true){
        case parameters.content_type == 'text/css' && parameters.resource_id=='/common/css/font/fonts.css':{
            //loaded at server start with font url replaced with secure url and about 1700 IamEncryption records
            return {result:{resource:server.commonCssFonts.css}, type:'JSON'};
        }
        case parameters.content_type == 'text/css':
        case parameters.content_type == 'application/json':
        case parameters.content_type == 'image/webp':
        case parameters.content_type == 'image/png':
        case parameters.content_type == 'font/woff2':{        
            return {type:'JSON', 
                    result:{
                            resource: await commonGetFile({ app_id:parameters.app_id, 
                                                            path:`${resource_directory}${resource_path}`,
                                                            content_type:parameters.content_type})
                            }
                    };
        }
        case parameters.content_type == 'text/javascript':{
            switch (resource_path){
                case '/modules/react/react-dom.development.js':
                case '/modules/react/react.development.js':{
                    /**
                     * @description Make ESM module
                     * @param {string} file
                     */
                    const modify = file =>{
                        if (resource_path == '/modules/react/react-dom.development.js'){
                            file = 'let ReactDOM;\r\n' + file;
                            file = file.replace(  'exports.version = ReactVersion;',
                                                            'exports.version = ReactVersion;\r\n  ReactDOM=exports;');
                            file = file + 'export {ReactDOM}';
                        }
                        else{
                            file = 'let React;\r\n' + file;
                            file = file.replace(  'exports.version = ReactVersion;',
                                                            'exports.version = ReactVersion;\r\n  React=exports;');
                            file = file + 'export {React}';
                        }  
                        return file;
                    };
                    return {type:'JSON', 
                            result:{
                                    resource:await commonGetFile({  app_id:parameters.app_id, 
                                                                    path:`${resource_directory}${resource_path}`, 
                                                                    content_type:parameters.content_type,
                                                                    modify:modify})
                                    }
                            };
                }
                default:
                    return {type:'JSON', 
                            result:{resource:await commonGetFile({  app_id:parameters.app_id, 
                                                                    path:`${resource_directory}${resource_path}`,
                                                                    content_type:parameters.content_type})
                                    }
                            };
            }
        }
        default:{
            return server.ORM.db.Log.post({ app_id:parameters.app_id, 
                                            data:{  object:'LogAppError', 
                                                    app:{   AppFilename:server.UtilAppFilename(import.meta.url),
                                                            AppFunctionName:'commonResourceFile()',
                                                            AppLine:server.UtilAppLine()
                                                    },
                                                    log:`Invalid resource ${parameters.resource_id}`
                                                }
                                            })
            .then(()=>{
                return {http:404, code:'APP', text:null, developerText:null, moreInfo:null, type:'JSON'};
            });
        }
    }
};
/**
 * @name commonModuleRun
 * @description Run function for given app and role
 *              Parameters in data should be requried data_app_id plus additional keys
 *              Can return anything specified by the function and supported by the server
 *              JSON, HTML, CSS, JS, WEBP, PNG, WOFF
 *              Response JSON format can be single resource format, list format or pagination format
 *              that the app should be responisble of
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:string,
 *          data: { type?:server['ORM']['Object']['AppModule']['ModuleType'],
 *                  module_app_id?:number|null,
 *                  data_app_id?:number|null},   //can accept more parameters if defined
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          locale:string,
 *          idToken:string,
 *          authorization:string,
 *          endpoint:server['bff']['parameters']['endpoint']}} parameters
 * @returns {Promise.<server['server']['response']>}
 */
const commonModuleRun = async parameters => {
    //Module can be defined in module_app_id and can run data in data_app_id or be defined and run in same data_app_id
    const modules = server.ORM.db.AppModule.get({app_id:parameters.app_id, 
                                            resource_id:null, 
                                            data:{data_app_id:parameters.data.module_app_id ?? parameters.data.data_app_id}});
    if (modules.result){
        if (parameters.data?.type =='ASSET'|| parameters.data?.type =='FUNCTION'||parameters.endpoint=='APP_EXTERNAL'||parameters.endpoint=='APP_ACCESS_EXTERNAL'){
            /**@type{server['ORM']['Object']['AppModule']}*/
            const module = modules.result.filter((/**@type{server['ORM']['Object']['AppModule']}*/app)=>
                                                                                                //APP EXTERNAL only uses id and message keys, add function type
                                                                                                app.ModuleType==((parameters.endpoint=='APP_EXTERNAL' ||parameters.endpoint=='APP_ACCESS_EXTERNAL')?'FUNCTION':parameters.data.type) && 
                                                                                                app.ModuleName==parameters.resource_id && 
                                                                                                app.ModuleRole == parameters.endpoint)[0];
            if (module){
                const {default:RunFunction} = await import('../../..' + module.ModulePath);
                return await RunFunction({  app_id:parameters.app_id, 
                                            resource_id: parameters.resource_id,
                                            data:parameters.data, 
                                            ip:parameters.ip, 
                                            host:parameters.host, 
                                            idToken:parameters.idToken, 
                                            authorization:parameters.authorization, 
                                            user_agent:parameters.user_agent, 
                                            locale:parameters.locale});
            }
            else{
                return server.ORM.db.Log.post({ app_id:parameters.app_id, 
                                                data:{  object:'LogAppError', 
                                                        app:{   AppFilename:server.UtilAppFilename(import.meta.url),
                                                                AppFunctionName:'commonModuleRun()',
                                                                AppLine:server.UtilAppLine()
                                                        },
                                                        log:`Module ${parameters.resource_id} not found`
                                                    }
                                                })
                .then((/**@type{server['server']['response']}*/result)=>{          
                    return result.http?result:{http:404,
                        code:'APP',
                        text:server.iam.iamUtilMessageNotAuthorized(),
                        developerText:'commonModuleRun',
                        moreInfo:null,
                        type:'JSON'
                    };
                });
            }
        }
        else
            return {http:400,
                code:'APP',
                text:server.iam.iamUtilMessageNotAuthorized(),
                developerText:'commonModuleRun',
                moreInfo:null,
                type:'JSON'
            };
    }
    else
        return modules;
};

/**
 * @name commonAppReport
 * @description Get module of type REPORT for given role
 *              REPORT returns component template with specified report using with parameters from app or report queue
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
*          resource_id:string,
*          data:{
*                  ps?:'A4'|'Letter', 
*                  type:'REPORT', 
*                  reportid?:string,
*                  queue_parameters?:{appModuleQueueId:number}},
*          user_agent:string, 
*          ip:string,
*          locale:string,
*          endpoint:server['bff']['parameters']['endpoint']|''}} parameters
* @returns {Promise.<server['server']['response']>}
*/
const commonAppReport = async parameters => {
    if (parameters.data?.type =='REPORT'){
        const modules = server.ORM.db.AppModule.get({app_id:parameters.app_id, resource_id:null, data:{data_app_id:parameters.app_id}});
        if (modules.result){
            /**@type{server['ORM']['Object']['AppModule']}*/
            const module = modules.result.filter((/**@type{server['ORM']['Object']['AppModule']}*/app)=>
                                                                                            app.ModuleType==parameters.data.type && 
                                                                                            app.ModuleName==parameters.resource_id && 
                                                                                            app.ModuleRole == parameters.endpoint)[0];
            if (module){
                //report
                //ID token is created but not used in report
                await server.iam.iamAuthorizeIdToken(parameters.app_id, parameters.ip, 'REPORT');
                
                const {default:RunReport} = await import('../../..' + module.ModulePath);
    
                const pagesize = parameters.data.ps ?? new URLSearchParams(Buffer.from(parameters.data.reportid ?? '', 'base64').toString('utf-8')).get('ps');
                /**@type{server['app']['commonReportCreateParameters']} */
                const data = {  app_id:         parameters.app_id,
                                queue_parameters:parameters.data.queue_parameters,
                                reportid:       parameters.data.reportid ?? '',
                                ip:             parameters.ip,
                                user_agent:     parameters.user_agent ?? '',
                                accept_language:parameters.locale ?? ''
                                };
                if (parameters.data.queue_parameters){
                    //do not wait for the report result when using report queue and the result is saved and not returned here
                    ComponentReport({   data:  {
                                                data:       data,
                                                /**@ts-ignore */
                                                papersize:  (pagesize=='' ||pagesize==null)?'A4':pagesize
                                                },
                                        methods:{function_report:RunReport}})
                                        .then(result_queue=>{
                                            //update report result
                                            server.ORM.db.AppModuleQueue.postResult( parameters.app_id, 
                                                                                parameters.data.queue_parameters?.appModuleQueueId??0, 
                                                                                result_queue)
                                            .then((/**@type{server['server']['response']}*/result_AppModuleQueue)=>
                                                result_AppModuleQueue.http?
                                                    result_AppModuleQueue:
                                                        server.ORM.db.AppModuleQueue.update( parameters.app_id, 
                                                                                        parameters.data.queue_parameters?.appModuleQueueId??0, 
                                                                                        {   end:new Date().toISOString(), 
                                                                                            progress:1, 
                                                                                            status:'SUCCESS'}));
                                                
                                        })
                                        .catch(error=>{
                                            //update report fail
                                            server.ORM.db.AppModuleQueue.update( parameters.app_id, 
                                                                            parameters.data.queue_parameters?.appModuleQueueId??0, 
                                                                            {   end:new Date().toISOString(), 
                                                                                progress:1, 
                                                                                status:'FAIL',
                                                                                message:typeof error == 'string'?
                                                                                            error:JSON.stringify(error.message ?? error)});
                                        });
                    return {result:'', type:'HTML'};
                }
                else
                    return {result:{resource:await ComponentReport({data:   {
                                                    CONFIG_APP: {...server.ORM.db.App.get({app_id:parameters.app_id, resource_id:parameters.app_id}).result[0]},
                                                    data:       data,
                                                    /**@ts-ignore */
                                                    papersize:  (pagesize=='' ||pagesize==null)?'A4':pagesize
                                                    },
                                            methods:{function_report:RunReport}})}, type:'JSON'};
            }
            else{
                return server.ORM.db.Log.post({   app_id:parameters.app_id, 
                    data:{  object:'LogAppError', 
                            app:{   AppFilename:server.UtilAppFilename(import.meta.url),
                                    AppFunctionName:'commonAppReport()',
                                    AppLine:server.UtilAppLine()
                            },
                            log:`Module ${parameters.resource_id} not found`
                        }
                    })
                .then((/**@type{server['server']['response']}*/result)=>{
                    return result.http?result:{http:404,
                        code:'APP',
                        text:server.iam.iamUtilMessageNotAuthorized(),
                        developerText:null,
                        moreInfo:null,
                        type:'JSON'
                    };
                });
            }
        }
        else
            return modules;
    }
    else
        return {http:400,
            code:'APP',
            text:server.iam.iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
};
/**
 * @name commonAppReportQueue
 * @description Runs report in queue
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          resource_id:number,
 *          authorization:string,
 *          data:{  ps:'A4', 
 *                  report_parameters:string},
 *          user_agent:string,
 *          ip:string,
 *          locale:string,
 *          endpoint:server['bff']['parameters']['endpoint']|'',
 *          res:server['server']['res']}} parameters
 * @returns {Promise.<server['server']['response']|void>}
 */
const commonAppReportQueue = async parameters =>{

    const report = server.ORM.db.AppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id, data:{data_app_id:null}});
    if (report.result){
        /**@type{server['ORM']['Object']['IamUser']} */
        const user = server.ORM.db.IamUser.get(  parameters.app_id, 
                                            server.ORM.UtilNumberValue(server.iam.iamUtilTokenGet(  parameters.app_id, 
                                                                                        parameters.authorization, 
                                                                                        parameters.app_id==server.ORM.UtilNumberValue(server.ORM.db.ConfigServer.get({app_id:parameters.app_id, data:{config_group:'SERVICE_APP',parameter:'APP_ADMIN_APP_ID'}}).result)?
                                                                                                                                                        'ADMIN':
                                                                                                                                                            /**@ts-ignore */
                                                                                                                                                            'APP_ACCESS').iam_user_id)).result[0];
        const result_post = await server.ORM.db.AppModuleQueue.post(parameters.app_id, 
                                                            {
                                                            type:'REPORT',
                                                            /**@ts-ignore */
                                                            iam_user_id:user.Id,
                                                            app_module_id:parameters.resource_id,
                                                            name:report.result[0].ModuleName,
                                                            parameters:`ps:${parameters.data.ps}, report:${parameters.data.report_parameters}`,
                                                            status:'PENDING',
                                                            user:user.Username
                                                            });
        if (result_post.result){
            server.ORM.db.AppModuleQueue.update(parameters.app_id, result_post.result.InsertId, { start:new Date().toISOString(),
                                                                    progress:0, 
                                                                    status:'RUNNING'})
            .then(()=>{
                //report can update progress and only progress if necessary
                //add queue id and parameters from parameter from origin
                //do not wait for submitted report
                commonAppReport({   app_id:             parameters.app_id,
                                    resource_id:        report.result[0].ModuleName,
                                    data:               {type:'REPORT', 
                                                            ...{ps:parameters.data.ps}, 
                                                            ...{queue_parameters:{appModuleQueueId:result_post.result.InsertId,
                                                                                    ...Object.fromEntries(Array.from(new URLSearchParams(parameters.data.report_parameters)).map(param=>[param[0],param[1]]))}
                                                                }
                                                        },
                                    user_agent:         parameters.user_agent,
                                    ip:                 parameters.ip,
                                    locale:             parameters.locale,
                                    endpoint:           parameters.endpoint});
            });
            return {result:null, type:'JSON'};
        }
        else
            return result_post;
    }
    else
        return server.ORM.db.Log.post({ app_id:parameters.app_id, 
                                        data:{  object:'LogAppError', 
                                                app:{   AppFilename:server.UtilAppFilename(import.meta.url),
                                                        AppFunctionName:'commonAppReportQueue()',
                                                        AppLine:server.UtilAppLine()
                                                },
                                                log:`Module ${parameters.resource_id} not found`
                                            }
                                        })
                .then((/**@type{server['server']['response']}*/result)=>{
                    return result.http?result:{http:404,
                        code:'APP',
                        text:server.iam.iamUtilMessageNotAuthorized(),
                        developerText:'commonAppReportQueue',
                        moreInfo:null,
                        type:'JSON'
                    };
                });
};

/**
 * @name commonModuleMetaDataGet
 * @description Returns all modules with metadata
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:Number,
 *          data:{type:'REPORT'|'MODULE'|'FUNCTION'},
 *          resource_id:number}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:(server['ORM']['Object']['AppModule'] & {ModuleMetadata:server['app']['commonModuleMetadata']})[] }>}
 */
const commonModuleMetaDataGet = async parameters =>{
    if (parameters.data.type=='REPORT'||parameters.data.type=='MODULE'||parameters.data.type=='FUNCTION'){
        const modules = server.ORM.db.AppModule.get({app_id:parameters.app_id, resource_id:parameters.resource_id,data:{data_app_id:parameters.app_id}});
        if (modules.result){
            /**@type{(server['ORM']['Object']['AppModule'] & {ModuleMetadata:server['app']['commonModuleMetadata']})[]}*/
            const module_reports = modules.result.filter((/**@type{server['ORM']['Object']['AppModule']}*/row)=>row.ModuleType==parameters.data.type);
            if (module_reports){
                for (const row of module_reports){
                    /**@type{server['ORM']['Object']['AppModule'] & {ModuleMetadata:server['app']['commonModuleMetadata']}}*/
                    row.ModuleMetadata = (await import('../../..' + row.ModulePath)).metadata;
                }
                return {result:module_reports, type:'JSON'};
            }
            else
                return server.ORM.db.Log.post({ app_id:parameters.app_id, 
                                                data:{  object:'LogAppError', 
                                                        app:{   AppFilename:server.UtilAppFilename(import.meta.url),
                                                                AppFunctionName:'commonModuleMetaDataGet()',
                                                                AppLine:server.UtilAppLine()
                                                        },
                                                        log:`Module ${parameters.resource_id} not found`
                                                    }
                                                })
                    .then((/**@type{server['server']['response']}*/result)=>{
                        return result.http?result:{http:404,
                            code:'APP',
                            text:server.iam.iamUtilMessageNotAuthorized(),
                            developerText:'commonModuleMetaDataGet',
                            moreInfo:null,
                            type:'JSON'
                        };
                    });
        }
        else
            return modules;
    }
    else{
        return {http:400,
            code:'APP',
            text:server.iam.iamUtilMessageNotAuthorized(),
            developerText:null,
            moreInfo:null,
            type:'JSON'
        };
    }
}; 

/**
 * @name commonAppIam
 * @description Returns authenticated app id 
 * @param {string} host 
 * @param {server['bff']['parameters']['endpoint']|null} endpoint
 * @param {{
 *          IamEncryption:  server['ORM']['Object']['IamEncryption']|null,
 *          idToken:        string|null,
 *          AppId:          number, 
 *          AppSignature:   string|null
 *          }|null} security
 * @returns {Promise.<{ admin:boolean,
 *                      app_id:number|null,
 *                      app_id_token:number|null,
 *                      apps:server['ORM']['Object']['App']['Id'][]}>}
 */
const commonAppIam = async (host, endpoint=null, security=null) =>{
    //authenticate:
    //encryption data exists
    //MICROSERVICE, APP_EXTERNAL, APP_ACESS_EXTERNAL or token exists
    //decrypted Appsignature contains app_id = AppId
    if (security?.IamEncryption && 
        (
        //external can use encryption without idToken
        (endpoint?.startsWith('MICROSERVICE') ||endpoint == 'APP_EXTERNAL' || endpoint=='APP_ACCESS_EXTERNAL' ||
        security?.idToken?.replace('Bearer ','') == server.ORM.db.IamAppIdToken.get({  app_id:0, 
                                                                        resource_id:security?.IamEncryption.IamAppIdTokenId??null, 
                                                                        data:{data_app_id:null}}).result[0].Token) &&
        await server.security.securityTransportDecrypt({ 
            app_id:0,
            encrypted:  security.AppSignature??'',
            jwk:        JSON.parse(Buffer.from(security.IamEncryption.Secret, 'base64').toString('utf-8')).jwk,
            iv:         JSON.parse(Buffer.from(security.IamEncryption.Secret, 'base64').toString('utf-8')).iv})
            .then(result=>
                (JSON.parse(result).app_id == security?.AppId)?1:0)
            .catch(()=>
                0
            )==1)==false){
            return {admin:false, 
                    app_id:null,
                    app_id_token:null,
                    apps:[]};
    }
    else{
        /**@type{server['ORM']['Object']['ConfigServer']} */
        const configServer = server.ORM.db.ConfigServer.get({app_id:0}).result;
        /**@type{server['ORM']['Object']['App']['Id'][]} */
        const apps = server.ORM.db.App.get({app_id:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0, resource_id:null})
                    .result.map((/**@type{server['ORM']['Object']['App']}*/app)=>{return app.Id;});
        if (endpoint !=null && ['MICROSERVICE', 'MICROSERVICE_AUTH'].includes(endpoint))
            return {admin:false, 
                    app_id:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                    app_id_token:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                    //all apps
                    apps:apps};
        else
            if ([configServer.SERVER.filter(parameter=>'HTTP_PORT_ADMIN' in parameter)[0].HTTP_PORT_ADMIN]
                                    .includes(host.split(':')[host.split(':').length-1]))
                return {
                        admin:true,
                        app_id:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID),
                        app_id_token:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID),
                        //all apps
                        apps:apps
                };
            else        
                if (endpoint==null)
                    return {
                        admin:false,
                        app_id:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                        app_id_token:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                        //no apps
                        apps:[]
                    };
                else        
                    return {
                            admin:false,
                            app_id:server.ORM.UtilNumberValue(security?.AppId)??0,
                            app_id_token:server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID),
                            //all apps except admin
                            apps:apps.filter(id=>id != server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID))
                    };
    }
    
 };
 /**
  * @name commonAppMount
  * @memberof ROUTE_REST_API
  * @description Get app 
  * @function
  * @param {{app_id:number,
  *          resource_id:number,
  *          ip:string,
  *          host:string,
  *          user_agent:string,
  *          accept_language:string,
  *          idToken:string, 
  *          data:{ iam_user_id:server['ORM']['Object']['IamUser']['Id'],
  *                 locale:string } } } parameters
  * @returns {Promise.<server['server']['response'] & {result?:server['app']['commonAppMount']}>}
  */
const commonAppMount = async parameters =>{
    /**@type{server['ORM']['Object']['ConfigServer']} */
    const configServer = server.ORM.db.ConfigServer.get({app_id:parameters.app_id}).result;
    if (parameters.resource_id == server.ORM.UtilNumberValue(configServer.SERVICE_APP
                                                        .filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID))
        return {http:400,
            code:null,
            text:null,
            developerText:'commonAppInit',
            moreInfo:null,
            type:'JSON'};
    else{
        /**@type{server['ORM']['Object']['App']} */
        const app = server.ORM.db.App.get({app_id:parameters.app_id, resource_id:parameters.resource_id}).result[0];
        if (app)
            return {result:{App:{   Id:                     app.Id,
                                    Name:                   app.Name,
                                    Js:                     app.Js,
                                    JsContent:              (app.Js && app.Js!='')?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.Js,
                                                                                            content_type:'text/javascript', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    Css:                    app.Css,
                                    CssContent:             (app.Css && app.Css!='')?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.Css,
                                                                                            content_type:'text/css', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    CssReport:              app.CssReport,
                                    CssReportContent:       (app.CssReport && app.CssReport!='')?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.CssReport,
                                                                                            content_type:'text/css', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    Favicon32x32:           app.Favicon32x32,
                                    Favicon32x32Content:    app.Favicon32x32?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.Favicon32x32,
                                                                                            content_type:'image/png', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    Favicon192x192:         app.Favicon192x192,
                                    Favicon192x192Content:  app.Favicon192x192?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.Favicon192x192,
                                                                                            content_type:'image/png', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    Logo:                   app.Logo,
                                    LogoContent:            app.Logo?
                                                                (await commonResourceFile({ app_id:parameters.app_id, 
                                                                                            resource_id:app.Logo,
                                                                                            content_type:'image/png', 
                                                                                            data_app_id:parameters.app_id})).result.resource:
                                                                    null,
                                    Copyright:              app.Copyright,
                                    LinkUrl:                app.LinkUrl,
                                    LinkTitle:              app.LinkTitle,
                                    TextEdit:               app.TextEdit
                                },
                            //fetch parameters and convert records to one object with parameter keys
                            AppParameter:server.ORM.db.AppData.getServer({app_id:parameters.app_id, resource_id:null, data:{name:'APP_PARAMETER', data_app_id:parameters.app_id}}).result
                                         .reduce((/**@type{Object.<string,*>}*/key, /**@type{server['ORM']['Object']['AppData']}*/row)=>{key[row.Value] = row.DisplayData; return key},{}) ,
                            ...(await server.socket.socketConnectedUpdate(parameters.app_id, 
                                                            {idToken:parameters.idToken, 
                                                             app_only:true,
                                                             iam_user_id:null,
                                                             iam_user_username:null,
                                                             iam_user_type:null,
                                                             token_access:null,
                                                             token_admin:null,
                                                             ip:parameters.ip,
                                                             headers_user_agent:parameters.user_agent,
                                                             headers_accept_language:parameters.accept_language})).result,
                            IamUserApp: parameters.data.iam_user_id !=null?
                                            (await server.iam.iamUserLoginApp({ app_id:parameters.app_id, 
                                                                                data:{  iam_user_id:parameters.data.iam_user_id,
                                                                                        data_app_id:parameters.resource_id
                                                                                }})).result[0]:
                                                null
                            }, 
                    type:'JSON'};
        else
            return {http:404,
                code:null,
                text:null,
                developerText:'commonAppInit',
                moreInfo:null,
                type:'JSON'};
    }
};

/**
 * @name commonApp
 * @memberof ROUTE_APP
 * @description Get app 
 * @function
 * @param {{app_id:number,
 *          ip:string,
 *          host:string,
 *          user_agent:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response']>}
 */
const commonApp = async parameters =>{

    if (parameters.app_id==null)
        return {http:404,
                code:null,
                text:null,
                developerText:'commonApp',
                moreInfo:null,
                type:'JSON'};
    else
        if  ((await commonAppIam(parameters.host, 'APP')).admin == false && 
                await commonAppStart(parameters.app_id) ==false){
            return {result:await ComponentMaintenance({  data:   null,
                                                    methods:{commonResourceFile:commonResourceFile}
                                                }), type:'HTML'};
        }
        else{
            /**@type{server['ORM']['Object']['ConfigServer']} */
            const configServer = server.ORM.db.ConfigServer.get({app_id:parameters.app_id}).result;
            
            const admin_app_id = server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_ADMIN_APP_ID' in parameter)[0].APP_ADMIN_APP_ID)??1;
            const common_app_id = server.ORM.UtilNumberValue(configServer.SERVICE_APP.filter(parameter=>'APP_COMMON_APP_ID' in parameter)[0].APP_COMMON_APP_ID)??0;
            
            const app_id = (await commonAppIam(parameters.host, 'APP')).admin?
                                admin_app_id:
                                    common_app_id;
            
            return {result:await ComponentCreate({data:     {
                                                            app_id:                             app_id,
                                                            app_admin_app_id:                   admin_app_id,
                                                            ip:                                 parameters.ip, 
                                                            user_agent:                         parameters.user_agent ??'', 
                                                            accept_language:                    parameters.accept_language??'',
                                                            configServer:                       configServer
                                                            },
                                                methods:    {
                                                            commonAppStart:commonAppStart,
                                                            commonGeodata:commonGeodata,
                                                            AppData:server.ORM.db.AppData,
                                                            IamEncryption:server.ORM.db.IamEncryption,
                                                            IamUser:server.ORM.db.IamUser,
                                                            iamAuthorizeIdToken:server.iam.iamAuthorizeIdToken,
                                                            serverProcess:server.ORM.serverProcess,
                                                            UtilNumberValue:server.ORM.UtilNumberValue,
                                                            Security:server.security,
                                                            commonResourceFile:commonResourceFile,
                                                            commonGetFile:commonGetFile
                                                            }})
                                .catch(error=>{
                                    return server.ORM.db.Log.post({ app_id:parameters.app_id, 
                                                                    data:{  object:'LogAppError', 
                                                                            app:{   AppFilename:server.UtilAppFilename(import.meta.url),
                                                                                    AppFunctionName:'commonApp()',
                                                                                    AppLine:server.UtilAppLine()
                                                                            },
                                                                            log:error
                                                                        }
                                                                    })
                                    .then(()=>{
                                        return commonAppError();
                                    });
                            }),
                    type:'HTML'};
        }
};
/**
 * @name commonAppError
 * @description Get server error
 * @function
* @returns {Promise.<string>}
*/
const commonAppError = async () =>serverError({data:null, methods:null});

/**
 * @name commonAppResource
 * @memberof ROUTE_REST_API
 * @description Get app resources
 *              resource id:            
 *                  privacy_policy
 *                  disclaimer
 *                  terms
 *                  about
 *		            filename in /apps/app[app_id]|common/public/component
 *		            filename in /apps/app[app_id]|common/public/css
 *		            filename in /apps/app[app_id]|common/public/images
 *		            filename in /apps/app[app_id]|common/public/js
 *                  filename in /apps/app[app_id]|common/public/modules/react
 *                  filename in /apps/app[app_id]|common/public/modules/vue
 * @function
 * @param {{app_id:number|null,
 *          resource_id:string,
 *          ip:string,
 *          host:string,
 *          user_agent:string,
 *          accept_language:string,
 *          data:{data_app_id:number,
 *                type: 'INFO'|'RESOURCE',
 *                content_type: string}
 *          }} parameters
 * @returns {Promise.<server['server']['response'] & {result?:{resource:string}}>}
 */
const commonAppResource = async parameters =>{
    
    if (parameters.app_id==null)
        return {http:404,
                code:null,
                text:null,
                developerText:'commonApp',
                moreInfo:null,
                type:'JSON'};
    else
        switch (true){
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'disclaimer'):
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'privacy_policy'):
            case (parameters.data.type == 'INFO' && parameters.resource_id.toLowerCase() == 'terms'):{
                return {result:{resource:await ComponentInfo({  data: { app_name:   server.ORM.db.App.get({   
                                                                                        app_id:parameters.app_id, 
                                                                                        resource_id:parameters.app_id}).result[0].Name,
                                                                                        /**@ts-ignore */
                                                                type:       'INFO_' + parameters.resource_id.toUpperCase()},
                                                        methods:null})
                                }, 
                        type:'JSON'};
            }
            case parameters.data.content_type == 'text/css':
            case parameters.data.content_type == 'font/woff2':
            case parameters.data.content_type == 'text/javascript':
            case parameters.data.content_type == 'image/webp':
            case parameters.data.content_type == 'image/png':
            case parameters.data.content_type == 'application/json':{
                return await commonResourceFile({   app_id:parameters.app_id, 
                                                    resource_id:parameters.resource_id.replaceAll('~','/'), 
                                                    content_type:parameters.data.content_type,
                                                    data_app_id: parameters.data.data_app_id});
            }
            default:{
                return {http:401, code:null, text:null, developerText:'commonAppResource', moreInfo:null, type:'JSON'};
            }
        }
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
 * @returns {server['ORM']['Object']['AppModule']}
 */
const commonRegistryAppModule = (app_id, parameters) => server.ORM.db.AppModule.get({app_id:app_id, resource_id:null, data:{data_app_id:app_id}}).result
                                                           .filter((/**@type{server['ORM']['Object']['AppModule']}*/app)=>
                                                               app.ModuleType==parameters.type && 
                                                               app.ModuleName==parameters.name && 
                                                               app.ModuleRole == parameters.role)[0];

                                                               /**
 * @name commonGeodata
 * @description Returns geodata
 * @function
 * @param {{app_id:number,
*          endpoint:server['bff']['parameters']['endpoint'],
*          ip:string,
*          user_agent:string,
*          accept_language:string}} parameters
* @returns {Promise.<*>}
*/
const commonGeodata = async parameters =>{
    const result_gps = getIP({ app_id:parameters.app_id,
                                        data:{ip:parameters.ip},
                                        ip:parameters.ip,
                                        locale:'en'
                                    }).result;
    const result_geodata = {};
    if (result_gps){
        result_geodata.latitude =   result_gps.latitude;
        result_geodata.longitude=   result_gps.longitude;
        result_geodata.place    =   result_gps.place;
        result_geodata.timezone =   result_gps.timezone;
    }
    else{
        const result_city = await worldcities({ app_id:parameters.app_id,
                                                data:{searchType:'RANDOM'},
                                                user_agent:parameters.user_agent,
                                                ip:parameters.ip,
                                                host:'',
                                                idToken:'', 
                                                authorization:'',
                                                locale:parameters.accept_language})
                                    .then(result=>{if (result.http) throw result; else return result.result;})
                                    .catch((/**@type{server['server']['error']}*/error)=>{throw error;});
        result_geodata.latitude =   result_city.lat;
        result_geodata.longitude=   result_city.lng;
        result_geodata.place    =   result_city.city + ', ' + result_city.admin_name + ', ' + result_city.country;
        result_geodata.timezone =   null;
    }
    return result_geodata;
};
/**
 * @name commonGeodataUser
 * @description Get geodata and user account data
 * @function
 * @param {number} app_id 
 * @param {string} ip
 * @returns {Promise.<{  latitude:string,
*              longitude:string,
*               place:string,
*               timezone:string}>}
*/
const commonGeodataUser = async (app_id, ip) =>{
   const result_geodata = getIP({ app_id:app_id,
                                    data:{ip:ip},
                                    ip:ip,
                                    locale:'en'
                                }).result;   
   const place = result_geodata?result_geodata.place:'';
   return {latitude:result_geodata?result_geodata.latitude ?? '':'',
           longitude:result_geodata?result_geodata.longitude ?? '':'',
           place:place,
           timezone:result_geodata?result_geodata.timezone ?? '':''};
};

export {commonGetFile,
        commonCssFonts,
        commonAppStart, commonClientLocale,
        commonAppIam, commonResourceFile,
        commonModuleRun,commonAppReport, commonAppReportQueue, commonModuleMetaDataGet, 
        commonAppMount,
        commonApp,
        commonAppError,
        commonAppResource,
        commonRegistryAppModule,
        commonGeodata,
        commonGeodataUser};