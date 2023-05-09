const microservice = await import(`file://${process.cwd()}/service/service.service.js`);
const {CheckFirstTime, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const microservice_circuitbreak = new microservice.CircuitBreaker();
//APP EMAIL functions
const getMail = (app_id, data, baseUrl) => {
    return new Promise((resolve, reject) => {
        let files= [];
        //email type 1-4 implented are emails with verification code
        if (parseInt(data.emailType)==1 || 
            parseInt(data.emailType)==2 || 
            parseInt(data.emailType)==3 ||
            parseInt(data.emailType)==4){
            files = [
                ['MAIL', process.cwd() + '/apps/common/mail/mail.html'],
                ['<MailHeader/>', process.cwd() + `/apps/app${app_id}/mail/mail_header_verification.html`],
                ['<MailBody/>', process.cwd() + `/apps/app${app_id}/mail/mail_body_verification.html`]
            ];
        }
        read_app_files(app_id, files, (err, email)=>{
            if (err)
                reject(err);
            else{
                //email type 1-4 are emails with verification code
                get_email_verification(app_id, data, email, baseUrl, data.lang_code, (err,email_verification)=>{
                    if (err)
                        reject(err);
                    else
                        resolve({"subject":         email_verification.subject, 
                                    "html":            email_verification.email});    
                })
            }
        })
    })
}
const get_email_verification = async (app_id, data, email, baseUrl, lang_code, callBack) => {
    email = email.replace('<Logo/>', 
                        `<img id='app_logo' src='${data.protocol}://${data.host}${baseUrl}/logo?id=${app_id}&uid=${data.app_user_id}&et=${data.emailType}'>`);
    email = email.replace('<Verification_code/>', 
                        `${data.verificationCode}`);
    email = email.replace('<Footer/>', 
                        `<a target='_blank' href='${data.protocol}://${data.host}'>${data.protocol}://${data.host}</a>`);
    callBack(null, {"subject": '❂❂❂❂❂❂',
                    "email": email});
}
//APP ROUTER functions
const getInfo = async (app_id, info, lang_code, callBack) => {
    const get_parameters = async (callBack) => {
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app/app.service.js`).then(({getApp}) => {
            getApp(app_id, app_id, lang_code, (err, result_app)=>{
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_parameter/app_parameter.service.js`).then(({getParameters_server}) =>{
                    getParameters_server(app_id, app_id, (err, result)=>{
                        //app_parameter table
                        let db_info_email_policy;
                        let db_info_email_disclaimer;
                        let db_info_email_terms;
                        let db_info_link_policy_url;
                        let db_info_link_disclaimer_url;
                        let db_info_link_terms_url;
                        let db_info_link_about_url;            
                        if (err) {
                            let stack = new Error().stack;
                            import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
                                    createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(() => {
                                        callBack(err, null);
                                    })
                                });
                            })
                        }
                        else{
                            let json = JSON.parse(JSON.stringify(result));
                            for (let i = 0; i < json.length; i++){
                                if (json[i].parameter_name=='INFO_EMAIL_POLICY')
                                    db_info_email_policy = json[i].parameter_value;
                                if (json[i].parameter_name=='INFO_EMAIL_DISCLAIMER')
                                    db_info_email_disclaimer = json[i].parameter_value;
                                if (json[i].parameter_name=='INFO_EMAIL_TERMS')
                                    db_info_email_terms = json[i].parameter_value;
                                if (json[i].parameter_name=='INFO_LINK_POLICY_URL')
                                    db_info_link_policy_url = json[i].parameter_value;
                                if (json[i].parameter_name=='INFO_LINK_DISCLAIMER_URL')
                                    db_info_link_disclaimer_url = json[i].parameter_value;
                                if (json[i].parameter_name=='INFO_LINK_TERMS_URL')
                                    db_info_link_terms_url = json[i].parameter_value;
                                if (json[i].parameter_name=='INFO_LINK_ABOUT_URL')
                                    db_info_link_about_url = json[i].parameter_value;
                            }
                            callBack(null, {app_name: result_app[0].app_name,
                                            app_url: result_app[0].url,
                                            info_email_policy: db_info_email_policy,
                                            info_email_disclaimer: db_info_email_disclaimer,
                                            info_email_terms: db_info_email_terms,
                                            info_link_policy_url: db_info_link_policy_url,
                                            info_link_disclaimer_url: db_info_link_disclaimer_url,
                                            info_link_terms_url: db_info_link_terms_url,
                                            info_link_about_url: db_info_link_about_url
                                            })
                        }
                    })
                });
            })
        });
    }
    let info_html1 = `<!DOCTYPE html>
                      <html>
                        <head>
                            <meta charset='UTF-8'>
                            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
                            <link rel='stylesheet' type='text/css' href='/common/css/common_info.css' />
                        </head>	
                        <body >`;
    let info_html2 = `  </body>
                      </html>`;
    switch (info){
    case 'privacy_policy':{
        get_parameters((err, result)=>{
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_policy_url}.html`, 'utf8', (error, fileBuffer) => {
                    let infopage = fileBuffer.toString();
                    infopage = infopage.replace('<APPNAME1/>', result.app_name );
                    infopage = infopage.replace('<APPNAME2/>', result.app_name );
                    infopage = infopage.replace('<APPURL_HREF/>', result.app_url );
                    infopage = infopage.replace('<APPURL_INNERTEXT/>', result.app_url );
                    infopage = infopage.replace('<APPEMAIL_HREF/>', 'mailto:' + result.info_email_policy );
                    infopage = infopage.replace('<APPEMAIL_INNERTEXT/>', result.info_email_policy );
                    callBack(null, info_html1 + infopage + info_html2);
                })
            });
        })
        break;
    }
    case 'disclaimer':{
        get_parameters((err, result)=>{
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_disclaimer_url}.html`, 'utf8', (error, fileBuffer) => {
                    let infopage = fileBuffer.toString();
                    infopage = infopage.replace('<APPNAME1/>', result.app_name );
                    infopage = infopage.replace('<APPNAME2/>', result.app_name );
                    infopage = infopage.replace('<APPNAME3/>', result.app_name );
                    infopage = infopage.replace('<APPEMAIL_HREF/>', 'mailto:' + result.info_email_disclaimer );
                    infopage = infopage.replace('<APPEMAIL_INNERTEXT/>', result.info_email_disclaimer );
                    callBack(null, info_html1 + infopage + info_html2);
                })
            })
        })
        break;
    }
    case 'terms':{
        get_parameters((err, result)=>{
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_terms_url}.html`, 'utf8', (error, fileBuffer) => {
                    let infopage = fileBuffer.toString();
                    infopage = infopage.replace('<APPNAME/>', result.app_name );
                    infopage = infopage.replace('<APPURL_HREF/>', result.app_url );
                    infopage = infopage.replace('<APPURL_INNERTEXT/>', result.app_url );
                    infopage = infopage.replace('<APPEMAIL_HREF/>', 'mailto:' + result.info_email_terms );
                    infopage = infopage.replace('<APPEMAIL_INNERTEXT/>', result.info_email_terms );
                    callBack(null, info_html1 + infopage + info_html2);
                })
            })
        })
        break;
    }
    case 'about':{
        get_parameters((err, result)=>{
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_about_url}.html`, 'utf8', (error, fileBuffer) => {
                    callBack(null, info_html1 + fileBuffer.toString() + info_html2);
                })
            })
        });
        break;
    }
    default:
        callBack(null, null);
        break;
    }
}
const check_app_subdomain = (app_id, host) => {
    //if using test subdomains, dns will point to correct server
    switch (app_id){
        case parseInt(ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')):{
            //show admin app for all subdomains
            return true;
        }
        case 1:{
            //app1, app1.test, test, www  or localhost
            if (host.substring(0,host.indexOf('.')) == `app${app_id}` ||
                host.indexOf(`app${app_id}.` + ConfigGet(1, 'SERVER', 'TEST_SUBDOMAIN')) == 0 ||
                host.substring(0,host.indexOf('.')) == ConfigGet(1, 'SERVER', 'TEST_SUBDOMAIN') ||
                host.substring(0,host.indexOf('.')) == 'www' ||
                host.substring(0,host.indexOf('.')) == '')
                return true;
            else
                return false;
        }
        default:{
            //app[app_id].test or app[app_id]
            if (host.indexOf(`app${app_id}.` + ConfigGet(1, 'SERVER', 'TEST_SUBDOMAIN')) == 0 ||
                host.substring(0,host.indexOf('.')) == `app${app_id}`)
                return true;
            else
                return false;
        }
    }
}
//APP functions
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
}
const read_app_files = async (app_id, files, callBack) => {
    let i = 0;
    let stack = new Error().stack;
    //ES2020 import() with ES6 promises, object destructuring
    import('node:fs').then(({promises: {readFile}}) => {
        Promise.all(files.map(file => {
            return readFile(file[1], 'utf8');
        })).then(fileBuffers => {
            let app ='';
            fileBuffers.forEach(fileBuffer => {
                if (app=='')
                    app = fileBuffer.toString();
                else
                    app = app.replace(
                            files[i][0],
                            `${fileBuffer.toString()}`);
                i++;
            });
            callBack(null, app);
        })
        .catch(err => {
            import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
                    createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), app_id, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), err).then(() => {
                        callBack(err, null);
                    })
                });
            })
        });
    })
}
const get_module_with_init = async (app_id,
                                    locale,
                                    system_admin,
                                    user_account_id,
                                    exception_app_function,
                                    ui,
                                    module, callBack) => {

    if (system_admin==1){
        let system_admin_only = '';
        const { admin_pool_started } = await import(`file://${process.cwd()}/service/db/admin/admin.service.js`);
        if (ConfigGet(1, 'SERVICE_DB', 'START')=='0' || admin_pool_started() == 0)
            system_admin_only = 1;
        else
            system_admin_only = 0;
        let first_time = null;
        if (CheckFirstTime()){
            //no system admin created yet, user will be prompt first time
            first_time = 1;
        }
        let parameters = {   
            app_id: app_id,
            app_name: 'SYSTEM ADMIN',
            app_url: '',
            app_logo: '',
            locale: locale,
            exception_app_function: exception_app_function,
            ui: ui,
            system_admin: system_admin,
            system_admin_only: system_admin_only,
            app_role_id: '',
            app_rest_client_id: '',
            app_rest_client_secret: '',
            common_app_id: ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
            rest_resource_server: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'),
            rest_resource_bff: ConfigGet(1, 'SERVER', 'REST_RESOURCE_BFF'),
            rest_resource_service: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE'),
		    rest_resource_service_db_schema: ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA'),
            first_time: first_time
        };
        module = module.replace(
                '<ITEM_COMMON_PARAMETERS/>',
                JSON.stringify(parameters));
        callBack(null, module);
    }
    else{
        const { getAppStartParameters } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_parameter/app_parameter.service.js`);
        const { getAppRole } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`);
        getAppStartParameters(app_id, (err,result) =>{
            if (err)
                callBack(err, null);
            else{
                let parameters = {   
                    app_id: app_id,
                    app_name: result[0].app_name,
                    app_url: result[0].app_url,
                    app_logo: result[0].app_logo,
                    locale:locale,
                    exception_app_function: exception_app_function,
                    ui: ui,
                    system_admin: system_admin,
                    system_admin_only: 0,
                    app_role_id: '',
                    app_rest_client_id: result[0].app_rest_client_id,
                    app_rest_client_secret: result[0].app_rest_client_secret,
                    common_app_id: ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
                    rest_resource_server: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'),
                    rest_resource_bff: ConfigGet(1, 'SERVER', 'REST_RESOURCE_BFF'),
                    rest_resource_service: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE'),
		            rest_resource_service_db_schema: ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA'),
                    first_time: null
                };
                if (system_admin==1){  
                    module = module.replace(
                            '<ITEM_COMMON_PARAMETERS/>',
                            JSON.stringify(parameters));
                    callBack(null, module);
                }
                else{
                    getAppRole(app_id, user_account_id, (err, result_app_role)=>{
                        if (err)
                            callBack(err, null);
                        else{
                            parameters.app_role_id = result_app_role.app_role_id;
                            module = module.replace(
                                    '<ITEM_COMMON_PARAMETERS/>',
                                    JSON.stringify(parameters));
                            callBack(null, module);
                        }
                    })
                }
            }
        })
    }
}

const AppsStart = async (app) => {
    const { admin_pool_started} = await import(`file://${process.cwd()}/service/db/admin/admin.service.js`);
    return await new Promise((resolve) => {
        const load_dynamic_code = async (app_id) => {
            return await new Promise((resolve) => {
                /*each app must have server.js with minimum:
                  const server = (app) =>{
                        app.use(...);
                        app.get(...);
                  }
                  export {server}
                */
                let filename;
                if (app_id == parseInt(ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')))
                    filename = `/apps/admin/server.js`;
                else
                    filename = `/apps/app${app_id}/server.js`
                import (`file://${process.cwd()}${filename}`).then(({ server }) => {
                    server(app);
                    resolve();
                });
            })
        }
        //start always admin app first
        load_dynamic_code(ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), app).then(() => {
            //load apps if database started and admin pool is started, database can be started with system admin pool only
            if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && admin_pool_started()==1){
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app/app.service.js`).then(({ getAppsAdmin }) => {
                    getAppsAdmin(ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), null, (err, results) =>{
                        if (err) {
                            let stack = new Error().stack;
                            import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
                                import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppS}) => {
                                    createLogAppS(ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), `getAppsAdmin, err:${err}`).then(() => {
                                        resolve();
                                    })
                                });
                            })
                        }
                        else {
                            let json;
                            let loaded = 0;
                            json = JSON.parse(JSON.stringify(results));
                            //start apps if enabled else only admin app will be started
                            if (ConfigGet(1, 'SERVER', 'APP_START')=='1'){
                                for (let i = 0; i < json.length; i++) {
                                    //skip admin app
                                    if (json[i].id != ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'))
                                        load_dynamic_code(json[i].id, app).then(() => {
                                            if (loaded == json.length - 2) //dont count admin app
                                                resolve();
                                            else
                                                loaded++;
                                        });
                                }
                            }
                            else{
                                load_dynamic_code(ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'));
                                resolve();
                            }
                        }
                    })
                });
            }
            else{
                resolve();
            }
        });
    })
}
const getMaintenance = (app_id) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['APP', process.cwd() + '/apps/common/src/index_maintenance.html'],
            ['<AppCommonHeadMaintenance/>', process.cwd() + '/apps/common/src/head_maintenance.html'],
            ['<AppCommonBodyMaintenance/>', process.cwd() + '/apps/common/src/body_maintenance.html'],
            ['<AppCommonBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html'] 
            ];
        read_app_files(app_id, files, (err, app)=>{
            if (err)
                reject(err);
            else{
                //maintenance can be used from all app_id
                let parameters = {   
                    app_id: app_id,
                    rest_resource_server: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'),
                    rest_resource_bff: ConfigGet(1, 'SERVER', 'REST_RESOURCE_BFF'),
                    rest_resource_service: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE'),
		            rest_resource_service_db_schema: ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')
                };
                app = app.replace('<ITEM_COMMON_PARAMETERS/>',
                                    JSON.stringify(parameters));
                resolve(app);
            }
        })
    })
}

const getUserPreferences = (app_id, locale) => {
    return new Promise((resolve, reject) => {
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/setting/setting.service.js`).then(({getSettings}) => {
            //let user_locales =`<option value='en'>English</option>`;
            let user_locales ='';
            import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/language/locale/locale.service.js`).then(({getLocales}) => {
                getLocales(app_id, locale, (err, result_user_locales) => {
                    for (let user_locale of result_user_locales) {
                        user_locales +=`<option value='${user_locale.locale}'>${user_locale.text}</option>`;
                    }
                    getSettings(app_id, locale, null, (err, settings) => {
                        let option;
                        let user_timezones;
                        let user_directions;
                        let user_arabic_scripts;
                        for (let i = 0; i < settings.length; i++) {
                            option = `<option id=${settings[i].id} value='${settings[i].data}'>${settings[i].text}</option>`;
                            switch (settings[i].setting_type_name){
                                //static content
                                case 'TIMEZONE':{
                                    user_timezones += option;
                                    break;
                                }
                                //will be translated in app
                                case 'DIRECTION':{
                                    user_directions += option;
                                    break;
                                }
                                //static content
                                case 'ARABIC_SCRIPT':{
                                    user_arabic_scripts += option;
                                    break;
                                }
                            }
                        }
                        resolve({user_locales: user_locales,
                                 user_timezones: user_timezones,
                                 user_directions: user_directions,
                                 user_arabic_scripts: user_arabic_scripts
                                })
                    })  
                })
            })        
        })
    })
}
//APP BFF functions
const BFF = async (app_id, service, parameters, ip, hostname, method, authorization, headers_user_agent, headers_accept_language, data) => {
    const { check_internet } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
    const rest_resource_service = ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE');
    let result_internet = await check_internet();
    if (data)
      data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
        if (result_internet==1){
            try {
                let path;
                switch (service){
                    case 'DB':{
                        const rest_resource_service_db_schema = ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA');
                        switch (method){
                            // parameters ex:
                            // /user_account/profile/id/[:param]?id=&app_id=[id]&lang_code=en'
                            // /db/admin and /db/common have no db schema
                            case 'GET':
                            case 'POST':
                            case 'PUT':
                            case 'PATCH':
                            case 'DELETE':{
                                if (parameters.startsWith('/admin'))
                                    path = `${rest_resource_service}/db${parameters}&app_id=${app_id}`;
                                else
                                    path = `${rest_resource_service}/db${rest_resource_service_db_schema}${parameters}&app_id=${app_id}`;
                                break;
                            }
                            default:{
                                reject('service DB GET, POST, PUT, PATCH or DELETE only');
                            }
                        }
                        break;
                    }
                    case 'GEOLOCATION':{
                        // parameters ex:
                        // /ip?app_id=[id]&lang_code=en
                        // /place?latitude[latitude]&longitude=[longitude]
                        if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1'){
                            if (method=='GET'){
                                //set ip from client in case ip query parameter is missing
                                let basepath = parameters.split('?')[0];
                                // /ip, /ip/admin or /systemadmin
                                if (parameters.startsWith('/ip')){    
                                    let params = parameters.split('?')[1].split('&');
                                    //if ip parameter does not exist
                                    if (params.filter(parm=>parm.includes('ip=')).length==0 )
                                        params.push(`ip=${ip}`);
                                    else{
                                        //if empty ip parameter
                                        if (params.filter(parm=>parm == 'ip=').length==1)
                                            params.map(parm=>parm = parm.replace('ip=', `ip=${ip}`));
                                    }
                                    parameters = `${basepath}?${params.reduce((param_sum,param)=>param_sum += '&' + param)}`;
                                }
                                path = `${rest_resource_service}/geolocation${parameters}&app_id=${app_id}`
                            }
                            else
                                reject('service GEOLOCATION GET only');
                        }
                        break;
                    }
                    case 'MAIL':{
                        // parameters ex:
                        // ?&app_id=[id]&lang_code=en
                        log_result = true;
                        if (method=='POST')
                            path = `${rest_resource_service}/mail${parameters}&app_id=${app_id}`
                        else
                            reject('service MAIL POST only')
                        break;
                    }
                    case 'REPORT':{
                        // parameter ex
                        // app_id=[id]&service=REPORT&reportid=[base64]
                        // decode
                        // ?reportid=[base64]
                        // authorization not used for this service
                        //check if maintenance
                        if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
                            getMaintenance(app_id)
                            .then((app_result) => {
                                resolve(app_result);
                            });
                        }
                        else
                            if (method=='GET'){
                                authorization = null;
                                path = `${rest_resource_service}/reports${parameters}&app_id=${app_id}`
                            }
                            else
                                reject('service REPORT GET only')
                        break;
                    }
                    case 'WORLDCITIES':{
                        // parameters ex:
                        // /[countrycode]?app_user_id=[id]&app_id=[id]&lang_code=en
                        if (method=='GET')
                            path = `${rest_resource_service}/worldcities${parameters}&app_id=${app_id}`
                        else
                            reject('service WORLDCITIES GET only')
                        break;
                    }
                    default:{
                        reject(`service ${service} does not exist`);
                    }
                }
                resolve(microservice_circuitbreak.callService(hostname,path,service, method,ip,authorization, headers_user_agent, headers_accept_language,data));
            } catch (error) {
                reject(error);
            }
        }
        else
            reject('no internet');
    })
}
export {/*APP EMAIL functions*/
        getMail, get_email_verification,
        /*APP ROUTER functiontions */
        getInfo, check_app_subdomain,
        /*APP functions */
        client_locale, read_app_files, get_module_with_init,
        getMaintenance, getUserPreferences,
        AppsStart,
        /*APP BFF functions*/
        BFF}