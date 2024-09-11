/** @module server/apps */

/**@type{import('../server/config.service.js')} */
const {CheckFirstTime, ConfigGet, ConfigGetAppHost, ConfigGetApp, ConfigGetApps} = await import(`file://${process.cwd()}/server/config.service.js`);
/**@type{import('../server/log.service.js')} */
const { LogAppI, LogAppE } = await import(`file://${process.cwd()}/server/log.service.js`);
/**@type{import('../server/server.service.js')} */
const {COMMON, getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('../server/db/sql/database.service.js')} */
const {InstalledCheck} = await await import(`file://${process.cwd()}/server/db/sql/database.service.js`);
/**@type{import('../server/db/file.service.js')} */
const {file_get_cached} = await import(`file://${process.cwd()}/server/db/file.service.js`);

const fs = await import('node:fs');
/**
 * Checks if ok to start app
 * @param {number|null} app_id
 * @returns {Promise.<boolean>}
 */
 const app_start = async (app_id=null)=>{
    const common_app_id = getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID'));
    const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
    if (file_get_cached('SERVER').METADATA.MAINTENANCE==0 && ConfigGet('SERVICE_DB', 'START')=='1' && 
        ConfigGetApp(app_id, common_app_id, 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_START' in parameter)[0].APP_START=='1' &&
        ((db_use==5 && await InstalledCheck(app_id, 1)
                                .then((/**@type{{installed:boolean}[]}*/result)=>app_id?result[0].installed:true)
                                .catch(()=>false)) || 
         ConfigGetApp(app_id, common_app_id, 'SECRETS')[`SERVICE_DB_DB${db_use}_APP_USER`] ))
        if (app_id == null)
            return true;
        else{
            if (ConfigGetApp(app_id, app_id, 'STATUS')=='ONLINE')
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
const client_locale = (accept_language) =>{
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
 * @param {number|null} app_id
 * @param { 'APP'|'APP_COMMON'|
 *          'REPORT'|'REPORT_COMMON'|
 *          'MAINTENANCE'|'MAIL'} type
 * @param {string|null} component
 */ 
const render_files = (app_id, type, component=null) => {
    /**@type{import('../types.js').server_config_apps_render_files[]} */
    const files = ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').RENDER_FILES.filter((/**@type{import('../types.js').server_config_apps_render_files}*/filetype)=>filetype[0]==type && (filetype[1] == component || component == null));
    let app ='';
    files.forEach(file => {
        if (app=='')
            app = file[4] ?? '';
        else
            app = app.replace(`<${file[2]}/>`, file[4] ?? '');
    });
    return app;
};

/**
 * Render html for REPORT
 * 
 * @param {number} app_id
 */
const render_report_html = (app_id) => {
    /** @type {[string, string][]} */
    const render_variables = [];
    if (ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').CSS_REPORT != '')
        render_variables.push(['APP_CSS_REPORT',`<link rel='stylesheet' type='text/css' href='${ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').CSS_REPORT}'/>`]);
    else
        render_variables.push(['APP_CSS_REPORT','']);
    return render_app_with_data( render_files(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'REPORT_COMMON'), render_variables);
};

/**
 * Renders app html with data
 * 
 * @param {string} app              - html
 * @param {[string, string][]} data - array with tags and data
 * @returns {string}                - app html with data
 */
const render_app_with_data = (app, data)=>{
    for (const variable of data){
        //add < and /> around tag variablename
        //replace all tags found with given searched tag with given value
        //ES2021 replaceAll
        app = app.replaceAll(`<${variable[0]}/>`,variable[1]);
    }
    return app;
};

/**
 * Render html for APP
 * 
 * @async
 * @param {number} app_id
 * @returns {Promise<string>}
 */
const render_app_html = async (app_id) =>{
    /**@type{import('../types.js').server_config_apps_render_config} */
    const app_config = ConfigGetApp(app_id, app_id, 'RENDER_CONFIG');
    /** @type {[string, string][]} */
    const render_variables = [];
    
    return new Promise((resolve)=>{
        //list config files and return only tag and file content
        /**@type {[string, string][]} */
        const common_files = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'RENDER_CONFIG').RENDER_FILES.filter((/**@type{import('../types.js').server_config_apps_render_files}*/filetype)=>filetype[0]=='APP_COMMON').map((/**@type{import('../types.js').server_config_apps_render_files}*/row)=> {return [row[2],row[4]];} );        
        
        const app = render_app_with_data(render_files(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'APP_COMMON'), common_files);
        
        //render app parameters from apps.json
        if (ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').JS != '')
            render_variables.push(['APP_JS',`"app" 			: "${ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').JS}",`]);
        else
            render_variables.push(['APP_JS','']);
        if (ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').JS_SECURE != '')
            render_variables.push(['APP_JS_SECURE',`"app_secure" 			: "${ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').JS_SECURE}",`]);
        else
            render_variables.push(['APP_JS_SECURE','']);
        if (ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').JS_REPORT != '')
            render_variables.push(['APP_JS_REPORT',`"app_report" 			: "${ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').JS_REPORT}",`]);
        else
            render_variables.push(['APP_JS_REPORT','']);
        if (ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').CSS != '')
            render_variables.push(['APP_CSS',`<link id='app_link_app_css' rel='stylesheet' type='text/css' href='${ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').CSS}'/>`]);
        else
            render_variables.push(['APP_CSS','']);
        if (ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').CSS_REPORT != '')
            render_variables.push(['APP_CSS_REPORT',`<link id='app_link_app_report_css' rel='stylesheet' type='text/css' href='${ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').CSS_REPORT}'/>`]);
        else
            render_variables.push(['APP_CSS_REPORT','']);
        if (app_config.MANIFEST == true)
            render_variables.push(['APP_MANIFEST','<link rel=\'manifest\' href=\'/manifest.json\'/>']);
        else
            render_variables.push(['APP_MANIFEST','']);
        if (ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').FAVICON_32x32 != '')
            render_variables.push(['APP_FAVICON_32x32',`<link rel='icon' type='image/png' href='${ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').FAVICON_32x32}' sizes='32x32'/>`]);
        else
            render_variables.push(['APP_FAVICON_32x32','']);
        if (ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').FAVICON_192x192 != '')
            render_variables.push(['APP_FAVICON_192x192',`<link rel='icon' type='image/png' href='${ConfigGetApp(app_id, app_id, 'RENDER_CONFIG').FAVICON_192x192}' sizes='192x192'/>`]);
        else
            render_variables.push(['APP_FAVICON_192x192','']);

        resolve(render_app_with_data(app, render_variables));
    });
};
/**
 * Gets module with application name, app service parameters
 * 
 * @async
 * @param {import('../types.js').server_apps_app_info} app_info - app info configuration
 * @returns {Promise.<string|null>}
 */
const get_module_with_initBFF = async (app_info) => {
    /**@type {[string, string][]} */
    const render_variables = [];
    /**
     * 
     * @param {string|null} module 
     * @param {{}[]|null} app_parameters 
     * @param {number} first_time 
     * @returns {string|null}
     */
    const return_with_parameters = (module, app_parameters, first_time)=>{
        if (module){
            /**@type{import('../types.js').server_apps_app_service_parameters} */
            const app_service_parameters = {   
                app_id: app_info.app_id,
                app_logo:ConfigGetApp(app_info.app_id, app_info.app_id, 'LOGO'),
                app_email: ConfigGetApp(app_info.app_id, app_info.app_id, 'PARAMETERS').filter((/**@type{*}*/parameter)=>'EMAIL' in parameter)[0].EMAIL,
                app_copyright: ConfigGetApp(app_info.app_id, app_info.app_id, 'PARAMETERS').filter((/**@type{*}*/parameter)=>'COPYRIGHT' in parameter)[0].COPYRIGHT,
                app_link_url: ConfigGetApp(app_info.app_id, app_info.app_id, 'PARAMETERS').filter((/**@type{*}*/parameter)=>'LINK_URL' in parameter)[0].LINK_URL,
                app_link_title: ConfigGetApp(app_info.app_id, app_info.app_id, 'PARAMETERS').filter((/**@type{*}*/parameter)=>'LINK_TITLE' in parameter)[0].LINK_TITLE,
                app_text_edit: ConfigGetApp(app_info.app_id, app_info.app_id, 'PARAMETERS').filter((/**@type{*}*/parameter)=>'TEXT_EDIT' in parameter)[0].TEXT_EDIT,
                app_framework : getNumberValue(ConfigGetApp(app_info.app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_FRAMEWORK' in parameter)[0].APP_FRAMEWORK) ?? 0,
                app_framework_messages:getNumberValue(ConfigGetApp(app_info.app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_FRAMEWORK_MESSAGES' in parameter)[0].APP_FRAMEWORK_MESSAGES) ?? 1,
                app_rest_api_version:getNumberValue(ConfigGetApp(app_info.app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_REST_API_VERSION' in parameter)[0].APP_REST_API_VERSION) ?? 1,
                app_idtoken: app_info.idtoken,
                locale: app_info.locale,
                translate_items:app_info.translate_items,
                system_admin_only: app_info.system_admin_only,
                client_latitude: app_info.latitude,
                client_longitude: app_info.longitude,
                client_place: app_info.place,
                client_timezone: app_info.timezone,
                common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
                rest_resource_bff: ConfigGet('SERVER', 'REST_RESOURCE_BFF') ?? '/bff',
                first_time: first_time
            };
            const json_parameters = JSON.stringify({
                app_service: app_service_parameters,
                app: app_parameters
            });
            const encoded = Buffer.from(json_parameters).toString('base64');
            render_variables.push(['ITEM_COMMON_PARAMETERS',`'${encoded}'`]);
            return render_app_with_data(module, render_variables);
        }
        else
            return null;
    };
    
    if (app_info.system_admin_only==1){
        render_variables.push(['APP_NAME','SYSTEM ADMIN']);
        return return_with_parameters(app_info.module, null, CheckFirstTime()==true?1:0);
    }
    else{
        //get parameters for common_app_id and current app_id and add app_id key
        const app_parameters_common = ConfigGetApp(app_info.app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS');
        for (const app of app_parameters_common){
            app.app_id = getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID'));
        }
        const app_parameters = ConfigGetApp(app_info.app_id, app_info.app_id, 'PARAMETERS');
        for (const app of app_parameters){
            app.app_id = app_info.app_id;
        }
        render_variables.push(['APP_NAME',ConfigGetApp(app_info.app_id, app_info.app_id, 'NAME')]);
        return return_with_parameters(app_info.module, app_parameters.concat(app_parameters_common), 0);
    }        
};

/**
 * Creates email
 * @async
 * @param {number} app_id                       - Application id
 * @param {import('../types.js').server_apps_email_param_data} data         - Email param data
 * @returns {Promise<import('../types.js').server_apps_email_return_createMail>}  - Email return data
 */
const createMail = async (app_id, data) =>{
    return new Promise((resolve, reject) => {
        //email type 1-4 implemented are emails with verification code
        if (parseInt(data.emailtype)==1 || 
            parseInt(data.emailtype)==2 || 
            parseInt(data.emailtype)==3 ||
            parseInt(data.emailtype)==4){

            /** @type {string} */
            let email_from = '';
            switch (parseInt(data.emailtype)){
                case 1:{
                    email_from = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                    break;
                }
                case 2:{
                    email_from = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
                    break;
                }
                case 3:{
                    email_from = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
                    break;
                }
                case 4:{
                    email_from = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
                    break;
                }
            }
            /** @type {[string, string][]} */
            const render_variables = [];
            render_variables.push(['Logo','<img id=\'app_logo\' src=\'/apps/common/images/logo.png\'>']);
            render_variables.push(['Verification_code',data.verificationCode ?? '']);
            render_variables.push(['Footer',`<a target='_blank' href='https://${data.host}'>${data.host}</a>`]);

            resolve ({
                'email_host':         ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_HOST,
                'email_port':         ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_PORT,
                'email_secure':       ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_SECURE,
                'email_auth_user':    ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_USERNAME,
                'email_auth_pass':    ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'SECRETS').SERVICE_MAIL_PASSWORD,
                'from':               email_from,
                'to':                 data.to,
                'subject':            '❂❂❂❂❂❂',
                'html':               render_app_with_data( render_files(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'MAIL'), render_variables)
            });
        }
        else
            reject ('not implemented');
    });
};

/**
 * Gets info page with rendered data
 * @async
 * @param {number} app_id
 * @param {'privacy_policy'|'disclaimer'|'terms'|'about'|null} info
 */
const getInfo = async (app_id, info) => {
    const info_html1 = `<!DOCTYPE html>
                      <html>
                        <head>
                            <meta charset='UTF-8'>
                            <link href="/common/css/font/font1.css" rel="stylesheet">
                            <link rel='stylesheet' type='text/css' href='/common/css/common_info.css' />
                        </head>	
                        <body >`;
    const info_html2 = `  </body>
                      </html>`;
    /** @type {[string, string][]} */
    const render_variables = [];
    if (info=='privacy_policy'||info=='disclaimer'||info=='terms'||info=='about' )
        if (info=='about'){
            //returns about page or empty if the app has none
            return await fs.promises.readFile(process.cwd() + `/apps/app${app_id}/src/info/about.html`, 'utf8')
                        .then((fileBuffer)=>info_html1 + fileBuffer.toString() + info_html2)
                        .catch(()=>'');
        }
        else{
            //privacy_policy, disclaimer or terms
            return await fs.promises.readFile(process.cwd() + `/apps/common/src/info/${info}.html`, 'utf8')
                        .then((fileBuffer)=>{
                            render_variables.push(['APPNAME', ConfigGetApp(app_id, app_id, 'NAME') ]);
                            return  info_html1 + render_app_with_data(fileBuffer.toString(), render_variables) + info_html2;
                        })
                        .catch(()=>'');
        }
    else
        return null;
};
/**
 * Creates app
 * @param {number} app_id
 * @param {string|null} param
 * @returns {Promise.<string|null>}
 */
 const createApp = async (app_id, param) => {
    return new Promise((resolve, reject) => {
        const main = async (/**@type{number}*/app_id) => {
            render_app_html(app_id)
            .then((/**@type{string}*/app)=>{
                resolve(app);
            })
            .catch((/**@type{import('../types.js').server_server_error}*/err)=>reject(err));
        };
        if (param!=null && ConfigGetApp(app_id, app_id, 'SHOWPARAM') == 1){
            import(`file://${process.cwd()}/server/db/sql/user_account.service.js`).then(({getProfileUser}) => {
                getProfileUser(app_id, null, param, null, null)
                .then((/**@type{import('../types.js').server_db_sql_result_user_account_getProfileUser[]}*/result)=>{
                    if (result[0])
                        main(app_id);
                    else{
                        //redirect to /
                        resolve (null);
                    }
                })
                .catch((/**@type{import('../types.js').server_server_error}*/error)=>{
                    reject(error);
                });
            });
        }
        else
            main(app_id);          
    });
};
/**
 * Get app
 * @param {number} app_id 
 * @param {{param:string|null,
 *          ip:string,
 *          user_agent:string,
 *          accept_language:string,
 *          host:string}} app_parameters
 * @returns {Promise.<string|null>}
 */
const getAppBFF = async (app_id, app_parameters) =>{
    //id token
    /**@type{import('../server/iam.service.js')} */
    const { AuthorizeTokenApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
    const idtoken = await AuthorizeTokenApp(app_id, app_parameters.ip);
    const result_geodata = await getAppGeodata(app_id, 'SERVER_APP', app_parameters.ip, app_parameters.user_agent, app_parameters.accept_language);
    /** @type {number} */
    let system_admin_only;
    /** @type {string} */
    let app_module_type;
    /** @type {string|null} */
    let app;
    /**@type{*} */
    let translate_items = {};

    if (app_id == 0){
        //get app admin
        app = await createApp(app_id, null);
        if (await app_start()==true){
            system_admin_only = 0;
        }
        else{
            system_admin_only = 1;
        }
        app_module_type = 'ADMIN';

        translate_items =  {USERNAME:'Username',
                            EMAIL:'Email',
                            NEW_EMAIL:'New email',
                            BIO:'Bio',
                            PASSWORD:'Password',
                            PASSWORD_CONFIRM:'Password confirm',
                            PASSWORD_REMINDER:'Password reminder',
                            NEW_PASSWORD_CONFIRM:'New password confirm',
                            NEW_PASSWORD:'New password',
                            CONFIRM_QUESTION:'Are you sure?'};
    }
    else{
        system_admin_only = 0;
        app = await createApp(app_id, app_parameters.param);
        if (app == null)
            return null;
        app_module_type = 'APP';
        //get translation data
        /**@type{import('../server/db/sql/app_object.service.js')} */
        const {getObjects} = await import(`file://${process.cwd()}/server/db/sql/app_object.service.js`);
        const result_objects = await getObjects(app_id, client_locale(app_parameters.accept_language), 'APP', null);
        for (const row of result_objects){
            translate_items[row.object_item_name.toUpperCase()] = row.text;
        }        
    }
    const app_with_init = await get_module_with_initBFF({   app_id:             app_id, 
                                                            locale:             client_locale(app_parameters.accept_language),
                                                            system_admin_only:  system_admin_only,
                                                            idtoken:          idtoken,
                                                            latitude:           result_geodata.latitude,
                                                            longitude:          result_geodata.longitude,
                                                            place:              result_geodata.place,
                                                            timezone:           result_geodata.timezone,
                                                            translate_items:    translate_items,
                                                            module:             app});
    //if app admin then log, system does not log in database
    if (await app_start() && getNumberValue(ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_LOG' in parameter)[0].APP_LOG) == 1){
        /**@type{import('../server/db/sql/app_data_stat.service.js')} */
        const {post} = await import(`file://${process.cwd()}/server/db/sql/app_data_stat.service.js`);
        const data_insert = {
                        json_data:                                          {   
                                                                                app_module : 'APPS',
                                                                                app_module_type : app_module_type,
                                                                                app_module_request : app_parameters.param,
                                                                                app_module_result : result_geodata.place,
                                                                                app_user_id : null,
                                                                                user_language : client_locale(app_parameters.accept_language),
                                                                                user_timezone : result_geodata.timezone,
                                                                                user_number_system : null,
                                                                                user_platform : null,
                                                                                server_remote_addr : app_parameters.ip,
                                                                                server_user_agent : app_parameters.user_agent,
                                                                                server_http_host : app_parameters.host,
                                                                                server_http_accept_language : app_parameters.accept_language,
                                                                                client_latitude : result_geodata.latitude,
                                                                                client_longitude : result_geodata.longitude
                                                                            },
                        app_id:                                             app_id,
                        user_account_id:                                    null,
                        user_account_app_user_account_id:                   null,
                        user_account_app_app_id:                            null,
                        app_data_resource_master_id:                        null,
                        app_data_entity_resource_id:                        0,  //LOG
                        app_data_entity_resource_app_data_entity_app_id:    getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) ?? 0,
                        app_data_entity_resource_app_data_entity_id:        0   //COMMON
        };
        await post(app_id, data_insert);
    }
    return app_with_init;
};
/**
 * 
 * @param {number} app_id 
 * @param {string} ip
 * @param {string} user_agent 
 * @param {string} accept_language 
 * @param {string} reportid
 * @returns {Promise.<{type: string, report:string}>}
 */
const getReport = async (app_id, ip, user_agent, accept_language, reportid) => {
    /**@type{import('../server/iam.service.js')} */
    const { AuthorizeTokenApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
    await AuthorizeTokenApp(app_id, ip);
    const result_geodata = await getAppGeodata(app_id, 'SERVER_REPORT', ip, user_agent, accept_language);
    const decodedparameters = Buffer.from(reportid, 'base64').toString('utf-8');
    
    let query_parameters = '{';
    decodedparameters.split('&').forEach((parameter, index)=>{
        query_parameters += `"${parameter.split('=')[0]}": "${parameter.split('=')[1]}"`;
        if (index < decodedparameters.split('&').length - 1)
            query_parameters += ',';
    });
    query_parameters += '}';
    /** @type {import('../types.js').server_apps_report_query_parameters}*/
    const query_parameters_obj = JSON.parse(query_parameters);

    const report_common_html = render_report_html(app_id);
    /**@type{import('../types.js').server_apps_report_create_parameters} */
    const data = {  app_id:         app_id,
                    reportid:       reportid,
                    ip:             ip,
                    user_agent:     user_agent,
                    accept_language:accept_language,
                    latitude:       result_geodata.latitude,
                    longitude:      result_geodata.longitude};
    const report_path = ConfigGetApps(app_id, 'MODULES')[0].MODULES.filter((/**@type{*}*/file)=>file[0]=='REPORT' && file[1]==query_parameters_obj.module)[0][3];
    const {default:RunReport} = await import(`file://${process.cwd()}${report_path}`);
    /**@type{{report:string,
     *        papersize:string}} */
    const report_data = await RunReport(data);

    /** @type {[string, string][]} */
    const render_variables = [];
    render_variables.push(['REPORT_PAPERSIZE_CLASSNAME',report_data.papersize]);
    return {    type:'HTML',
                report:render_app_with_data(report_common_html, render_variables).replace('<REPORT/>', report_data.report)
            };
};
/**
 * 
 * @param {number} app_id 
 * @param {import('../types.js').server_bff_endpoint_type} endpoint
 * @param {string} ip 
 * @param {string} user_agent 
 * @param {string} accept_language
 * @returns 
 */
const getAppGeodata = async (app_id, endpoint, ip, user_agent, accept_language) =>{
    /**@type{import('../server/bff.service.js')} */
    const { BFF_server } = await import(`file://${process.cwd()}/server/bff.service.js`);
    //get GPS from IP
    /**@type{import('../types.js').server_bff_parameters}*/
    const parameters = {endpoint:endpoint,
                        host:null,
                        url:'/geolocation/ip',
                        route_path:'/geolocation/ip',
                        method:'GET', 
                        query:`ip=${ip}`,
                        body:{},
                        authorization:null,
                        ip:ip, 
                        user_agent:user_agent, 
                        accept_language:accept_language,
                        /**@ts-ignore */
                        res:null};
    //ignore error in this case and fetch randcom geolocation using WORLDCITIES service instead if GEOLOCATION is not available
    const result_gps = await BFF_server(app_id, parameters)
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
        /**@type{import('../types.js').server_bff_parameters}*/
        const parameters = {endpoint:endpoint,
                            host:null,
                            url:'/worldcities/city-random',
                            route_path:'/worldcities/city-random',
                            method:'GET', 
                            query:'',
                            body:{},
                            authorization:null,
                            ip:ip, 
                            user_agent:user_agent, 
                            accept_language:accept_language,
                            /**@ts-ignore */
                            res:null};
        const result_city = await BFF_server(app_id, parameters).catch((/**@type{import('../types.js').server_server_error}*/error)=>{throw error;});
        result_geodata.latitude =   JSON.parse(result_city).lat;
        result_geodata.longitude=   JSON.parse(result_city).lng;
        result_geodata.place    =   JSON.parse(result_city).city + ', ' + JSON.parse(result_city).admin_name + ', ' + JSON.parse(result_city).country;
        result_geodata.timezone =   null;
    }
    return result_geodata;
};

/**
 * Gets module maintenance
 * 
 * @param {number} app_id
 * @param {string} ip
 * @returns {Promise.<string>}
 */
const getMaintenance = async (app_id, ip) => {
    /**@type{import('../server/iam.service.js')} */
    const { AuthorizeTokenApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
    const idtoken = await AuthorizeTokenApp(app_id, ip);
    //maintenance can be used from all app_id
    const json_parameters = JSON.stringify({   
        app_id: app_id,
        common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
        app_idtoken: idtoken,
        rest_resource_bff: ConfigGet('SERVER', 'REST_RESOURCE_BFF')
    });
    /** @type {[string, string][]} */
    const render_variables = [];
    const encoded = Buffer.from(json_parameters).toString('base64');
    render_variables.push(['ITEM_COMMON_PARAMETERS',`'${encoded}'`]);
    return render_app_with_data(render_files(getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'MAINTENANCE'), render_variables);
};

/**
 * 
 * @param {number} app_id 
 * @param {number|null} resource_id 
 * @param {string} lang_code 
 */
const getApps = async (app_id, resource_id, lang_code) =>{
    /**@type{import('../server/db/sql/app.service.js')} */
    const {getApp} = await import(`file://${process.cwd()}/server/db/sql/app.service.js`);
    /**@type{import('../server/config.service.js')} */
    const {ConfigGetApps} = await import(`file://${process.cwd()}/server/config.service.js`);

    const apps_db =  await getApp(app_id, resource_id, lang_code);
    const apps_registry = ConfigGetApps().filter((/**@type{import('../types.js').server_config_apps_record}*/app)=>app.APP_ID==resource_id || resource_id == null);
    /**@type{import('../types.js').server_config_apps_with_db_columns[]}*/
    const apps = apps_registry.reduce(( /**@type{import('../types.js').server_config_apps_record} */app, /**@type {import('../types.js').server_config_apps_record}*/current)=>
                                        app.concat({APP_ID:current.APP_ID,
                                                    NAME:current.NAME,
                                                    SUBDOMAIN:current.SUBDOMAIN,
                                                    LOGO:current.PATH + current.LOGO,
                                                    STATUS:current.STATUS
                                                    }) , []);
    
    for (const app of apps){
        app.PROTOCOL = ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?'https://':'http://';
        app.HOST = ConfigGet('SERVER', 'HOST');
        app.PORT = getNumberValue(ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?ConfigGet('SERVER', 'HTTPS_PORT'):ConfigGet('SERVER', 'HTTP_PORT'));
        app.APP_CATEGORY = apps_db.filter(app_db=>app_db.id==app.APP_ID)[0].app_category;
        app.APP_NAME_TRANSLATION = JSON.parse(apps_db.filter(app_db=>app_db.id==app.APP_ID)[0].app_translation.toString()).name;
        const image = await fs.promises.readFile(`${process.cwd()}${app.LOGO}`);
        /**@ts-ignore */
        app.LOGO = 'data:image/webp;base64,' + Buffer.from(image, 'binary').toString('base64');
    }
    return apps;
};

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 */
 const getAppsAdmin = async (app_id, lang_code) =>{
    /**@type{import('../server/db/sql/app.service.js')} */
    const {getAppsAdmin} = await import(`file://${process.cwd()}/server/db/sql/app.service.js`);
    /**@type{import('../server/config.service.js')} */
    const {ConfigGetApps} = await import(`file://${process.cwd()}/server/config.service.js`);

    const apps_db =  await getAppsAdmin(app_id, lang_code);
    const apps_registry = ConfigGetApps();
    /**@type{import('../types.js').server_config_apps_admin_with_db_columns[]}*/
    const apps = apps_registry.reduce(( /**@type{import('../types.js').server_config_apps_record} */app, /**@type {import('../types.js').server_config_apps_record}*/current)=> 
                                        app.concat({ID:current.APP_ID,
                                                    NAME:current.NAME,
                                                    SUBDOMAIN:current.SUBDOMAIN,
                                                    LOGO:current.LOGO,
                                                    STATUS:current.STATUS,
                                                    }) , []);    
    
    apps.map(app=>{
        app.PROTOCOL = ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?'https://':'http://';
        app.HOST = ConfigGet('SERVER', 'HOST');
        app.PORT = getNumberValue(ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'?ConfigGet('SERVER', 'HTTPS_PORT'):ConfigGet('SERVER', 'HTTP_PORT'));
        app.APP_CATEGORY_ID = apps_db.filter(app_db=>app_db.id==app.ID)[0].app_category_id;
        app.APP_CATEGORY_TEXT = apps_db.filter(app_db=>app_db.id==app.ID)[0].app_category_text;
    });
    return apps;
};
/**
 * Gets asset file
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
 * 
 * @param {number} app_id
 * @param {string} url 
 * @param {string} basepath 
 * @param {import('../types.js').server_server_res} res 
 */
const getAssetFile = (app_id, url, basepath, res) =>{
    return new Promise((resolve, reject)=>{
        const app_cache_control = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_CACHE_CONTROL' in parameter)[0].APP_CACHE_CONTROL;
        const app_cache_control_font = ConfigGetApp(app_id, getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_CACHE_CONTROL_FONT' in parameter)[0].APP_CACHE_CONTROL_FONT;
        switch (url.toLowerCase().substring(url.lastIndexOf('.'))){
            case '.css':{
                res.type('text/css');
                if (app_cache_control !='')
                    res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${basepath}${url}`});
                break;
            }
            case '.js':{
                res.type('text/javascript');
                if (app_cache_control !='')
                    res.set('Cache-Control', app_cache_control);
                switch (url){
                    case '/modules/react/react-dom.development.js':
                    case '/modules/react/react.development.js':{
                        fs.promises.readFile(`${process.cwd()}${basepath}${url}`, 'utf8').then((modulefile)=>{
                            if (url == '/modules/react/react-dom.development.js'){
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
                        fs.promises.readFile(`${process.cwd()}${basepath}${url}`, 'utf8').then((modulefile)=>{
                            modulefile = modulefile.replace(  '//# sourceMappingURL=','//');
                            resolve({STATIC:true, SENDFILE:null, SENDCONTENT:modulefile});
                        });
                        break;
                    }
                    case '/modules/easy.qrcode/easy.qrcode.js':{
                        fs.promises.readFile(`${process.cwd()}${basepath}${url}`, 'utf8').then((modulefile)=>{
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
                        fs.promises.readFile(`${process.cwd()}${basepath}${url}`, 'utf8').then((modulefile)=>{
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
                        resolve({STATIC:true, SENDFILE:`${process.cwd()}${basepath}${url}`});
                }
                break;
            }
            case '.html':{
                res.type('text/html');
                if (app_cache_control !='')
                    res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${basepath}${url}`});
                break;
            }
            case '.webp':{
                res.type('image/webp');
                if (app_cache_control !='')
                    res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${basepath}${url}`});
                break;
            }
            case '.png':{
                res.type('image/png');
                if (app_cache_control !='')
                    res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${basepath}${url}`});
                break;
            }
            case '.woff2':{
                res.type('font/woff');
                if (app_cache_control_font !='')
                    res.set('Cache-Control', app_cache_control_font);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${basepath}${url}`});
                break;
            }
            case '.ttf':{
                res.type('font/ttf');
                if (app_cache_control_font !='')
                    res.set('Cache-Control', app_cache_control_font);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${basepath}${url}`});
                break;
            }
            case '.json':{
                res.type('application/json');
                if (app_cache_control !='')
                    res.set('Cache-Control', app_cache_control);
                resolve({STATIC:true, SENDFILE:`${process.cwd()}${basepath}${url}`});
                break;
            }
            default:{
                LogAppE(app_id, COMMON.app_filename(import.meta.url), 'app.get("/")', COMMON.app_line(), `Invalid file type ${url}`)
                .then(()=>{
                    res.statusCode = 403;
                    res.statusMessage = null;
                    reject(null);
                });
            }
        }
    });
};
/**
 * Get app asset, common asset, app info page, app report or app
 * @param {string} ip
 * @param {string} host
 * @param {string} user_agent
 * @param {string} accept_language
 * @param {string} url
 * @param {string} reportid
 * @param {import('../types.js').server_server_res|null} res
 */
const getAppMain = async (ip, host, user_agent, accept_language, url, reportid, res) =>{
    const host_no_port = host.substring(0,host.indexOf(':')==-1?host.length:host.indexOf(':'));
    const app_id = ConfigGetAppHost(host_no_port);
    if (app_id==null || res==null ){
        //function not called from client or host not found
        if (res)
            res.statusCode = 404;
        return null;
    }
    else
        switch (true){
            case (url.toLowerCase().startsWith('/maintenance')):{
                return await getAssetFile(app_id, url.substring('/maintenance'.length), '/apps/common/public', res)
                        .catch(()=>null);
            }
            case (app_id != getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) && await app_start(app_id) ==false):{
                return await getMaintenance(app_id, ip);
            }
            case (url.toLowerCase().startsWith('/common')):{
                return await getAssetFile(app_id, url.substring('/common'.length), '/apps/common/public', res).catch(()=>null);
            }
            case (url.toLowerCase().startsWith('/css')):
            case (url.toLowerCase().startsWith('/component')):
            case (url.toLowerCase().startsWith('/images')):
            case (url.toLowerCase().startsWith('/js')):
            case (url == '/apps/common_types.js'): //
            case (url == '/manifest.json'):
            case (url == '/sw.js'):{
                return await getAssetFile(app_id, url, ConfigGetApp(app_id, app_id,'PATH'), res).catch(()=>null);
            }
            case (url.toLowerCase().startsWith('/info/about')):
            case (url.toLowerCase().startsWith('/info/disclaimer')):
            case (url.toLowerCase().startsWith('/info/privacy_policy')):
            case (url.toLowerCase().startsWith('/info/terms')):{
                /**@ts-ignore */
                return await getInfo(app_id, url.toLowerCase().substring('/info/'.length))
                                .catch((error)=>{
                                                    res.statusCode = 500;
                                                    res.statusMessage = error;
                                                    throw error;
                                                });
            }
            case (url.toLowerCase().startsWith('/app-reports')):{
                return await getReport(app_id, ip, user_agent, accept_language, reportid)
                                .then((report_result)=>{
                                    return report_result.report;
                                });
            }
            case (url.toLowerCase().startsWith('/app-module/')):{
                return await getModule( app_id, 
                                        url.substring(url.lastIndexOf('/') + 1), 
                                        null, 
                                        user_agent, 
                                        ip, 
                                        accept_language, 
                                        res);
            }
            case (url == '/'):
            case ((ConfigGetApp(app_id, app_id, 'SHOWPARAM') == 1 && url.substring(1) !== '')):{
                return new Promise((resolve, reject)=>{
                    LogAppI(app_id, COMMON.app_filename(import.meta.url), url, COMMON.app_line(), '1 ' + new Date().toISOString())
                    .then(()=>{
                        getAppBFF(app_id, 
                                    {   param:          url.substring(1)==''?null:url.substring(1),
                                        ip:             ip, 
                                        user_agent:     user_agent,
                                        accept_language:accept_language,
                                        host:           host})
                        .then(app_result=>{
                            LogAppI(app_id, COMMON.app_filename(import.meta.url), url, COMMON.app_line(), '2 ' + new Date().toISOString())
                            .then(()=>{
                                if (app_result == null)
                                    res.statusCode = 301;
                                resolve(app_result);
                            })
                            .catch((/**@type{import('../types.js').server_server_error}*/err)=>{
                                LogAppE(app_id, COMMON.app_filename(import.meta.url), 'getAppBFF() and LogAppI()', COMMON.app_line(), err)
                                .then(()=>{
                                    res.statusCode = 500;
                                    res.statusMessage = 'SERVER ERROR';
                                    reject(err);
                                });
                            });
                        })
                        .catch((/**@type{import('../types.js').server_server_error}*/err)=>{
                            LogAppE(app_id, COMMON.app_filename(import.meta.url), 'getAppBFF()', COMMON.app_line(), err)
                            .then(()=>{
                                res.statusCode = 500;
                                res.statusMessage = 'SERVER ERROR';
                                reject('SERVER ERROR');
                            });
                        });
                    });
                });
            }
            default:{
                res.statusCode = 301;
                return null;
            }
        }
};
/**
 * 
 * @param {number} app_id 
 * @param {string} resource_id 
 * @param {*} data 
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../types.js').server_server_res|null} res
 * @returns 
 */
const getFunction = async (app_id, resource_id, data, user_agent, ip, locale, res) => {
    const module_path = ConfigGetApps(app_id, 'MODULES')[0].MODULES.filter((/**@type{*}*/file)=>file[0]=='FUNCTION' && file[1]==resource_id);
    if (module_path[0]){
        const {default:RunFunction} = await import(`file://${process.cwd()}${module_path[0][4]}`);
        return await RunFunction(app_id, data, user_agent, ip, locale, res);
    }
    else{
        LogAppE(app_id, COMMON.app_filename(import.meta.url), 'getFunction()', COMMON.app_line(), `Function ${resource_id} not found`)
        .then(()=>{
            if (res)
                res.statusCode = 404;
            return null;
        });
    }    
};
/**
 * 
 * @param {number} app_id 
 * @param {string} resource_id 
 * @param {*} data 
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../types.js').server_server_res|null} res
 * @returns 
 */
const getModule = async (app_id, resource_id, data, user_agent, ip, locale, res) => {
    const module_path = ConfigGetApps(app_id, 'MODULES')[0].MODULES.filter((/**@type{*}*/file)=>file[0]=='MODULE' && file[1]==resource_id);
    if (module_path[0]){
        const {default:RunFunction} = await import(`file://${process.cwd()}${module_path[0][4]}`);
        return await RunFunction(app_id, data, user_agent, ip, locale, res).then((/**@type{*} */module)=>{return {STATIC:true, SENDFILE:module, SENDCONTENT:null};});
    }
    else{
        LogAppE(app_id, COMMON.app_filename(import.meta.url), 'getModule()', COMMON.app_line(), `Module ${resource_id} not found`)
        .then(()=>{
            if (res)
                res.statusCode = 404;
            return {STATIC:true, SENDFILE:null, SENDCONTENT:''};
        });
    }
};

/**
 * 
 * @param {string} host 
 * @param {string} method 
 * @param {*} body 
 * @param {string} user_agent 
 * @param {string} ip 
 * @param {string|null} authorization 
 * @param {string} locale 
 * @returns {Promise.<*>}
 */

const request_external = async (host, method, body, user_agent, ip, authorization, locale ) =>{
    const https = await import('node:https');
    const timeout_message = '🗺⛔?';
    const timeout = 5000;
    return new Promise((resolve, reject)=>{
        const host_request = host.indexOf(':')>-1?host.substring(0,host.indexOf(':')):host.substring(0,host.indexOf('/'));
        const port = host.indexOf(':')>-1?host.substring(host.indexOf(':'),host.indexOf('/')):443;
        const path = host.substring(host.indexOf('/'));
        const options = {
            method: method,
            timeout: timeout,
            headers : {
                'User-Agent': user_agent,
                'Accept-Language': locale,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(body)),
                'Authorization': authorization ?? '',
                'X-Forwarded-For': ip
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
        if (method !='GET')
            request.write(JSON.stringify(body));
        request.on('error', error => {
            reject('EXTERNAL URL ERROR: ' + error);
        });
        request.on('timeout', () => {
            reject(timeout_message);
        });
        request.end();
    });
};

export {/*APP functions */
        app_start, render_app_html,render_report_html ,render_app_with_data,
        /*APP EMAIL functions*/
        createMail,
        /*APP ROUTER functiontions */
        getReport, getInfo,getMaintenance,
        getApps, getAppsAdmin,
        getAppMain,
        getFunction,
        request_external
};