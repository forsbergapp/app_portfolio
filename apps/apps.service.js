const microservice = await import(`file://${process.cwd()}/service/service.service.js`);
const {CheckFirstTime, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const microservice_circuitbreak = new microservice.CircuitBreaker();
//APP EMAIL functions
const createMail = async (app_id, data) =>{
    /*data:
    {
        "emailtype":        [1-4], 1=SIGNUP, 2=UNVERIFIED, 3=PASSWORD RESET (FORGOT), 4=CHANGE EMAIL
        "host":             [host],
        "app_user_id":      [user id],
        "verificationCode": [verificationcode],
        "to":               [to email]
    }
    */
    const {getParameters_server} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_parameter/app_parameter.service.js`);
    return new Promise((resolve, reject) => {
        let files= [];
        let db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
        let db_SERVICE_MAIL_HOST;
        let db_SERVICE_MAIL_PORT;
        let db_SERVICE_MAIL_SECURE;
        let db_SERVICE_MAIL_USERNAME;
        let db_SERVICE_MAIL_PASSWORD;
        //email type 1-4 implemented are emails with verification code
        if (parseInt(data.emailtype)==1 || 
            parseInt(data.emailtype)==2 || 
            parseInt(data.emailtype)==3 ||
            parseInt(data.emailtype)==4){

            files = [
                ['MAIL', process.cwd() + '/apps/common/src/mail.html'],
                ['<MailHeader/>', process.cwd() + `/apps/common/src/mail_header_verification.html`],
                ['<MailBody/>', process.cwd() + `/apps/common/src/mail_body_verification.html`]
            ];
            read_app_files(app_id, files, (err, email)=>{
                if (err)
                    reject(err);
                else{                
                    getParameters_server(app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), (err, result)=>{
                        if (err) {                
                            reject(err);
                        }
                        else{
                            let json = JSON.parse(JSON.stringify(result));
                            for (let i = 0; i < json.length; i++){
                                if (json[i].parameter_name=='SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME')
                                    db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME')
                                    db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME')
                                    db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME')
                                    db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_HOST')
                                    db_SERVICE_MAIL_HOST = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_PORT')
                                    db_SERVICE_MAIL_PORT = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_SECURE')
                                    db_SERVICE_MAIL_SECURE = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_USERNAME')
                                    db_SERVICE_MAIL_USERNAME = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_PASSWORD')
                                    db_SERVICE_MAIL_PASSWORD = json[i].parameter_value;                                        
                            }
                            let email_from;
                            switch (parseInt(data.emailtype)){
                                case 1:{
                                    email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                                    break;
                                }
                                case 2:{
                                    email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                                    break;
                                }
                                case 3:{
                                    email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                                    break;
                                }
                                case 4:{
                                    email_from = db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
                                    break;
                                }
                            }
                            email = email.replace('<Logo/>',                `<img id='app_logo' src='/apps/common/images/logo.png'>`);
                            email = email.replace('<Verification_code/>',   data.verificationCode);
                            email = email.replace('<Footer/>',              `<a target='_blank' href='https://${data.host}'>${data.host}</a>`);
                            resolve ({
                                "email_host":         db_SERVICE_MAIL_HOST,
                                "email_port":         db_SERVICE_MAIL_PORT,
                                "email_secure":       db_SERVICE_MAIL_SECURE,
                                "email_auth_user":    db_SERVICE_MAIL_USERNAME,
                                "email_auth_pass":    db_SERVICE_MAIL_PASSWORD,
                                "from":               email_from,
                                "to":                 data.to,
                                "subject":            "❂❂❂❂❂❂",
                                "html":               email
                            });
                        }
                    })
                }
            })
        }
        else
            reject ('not implemented');
    })
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
            //app1, app1.test, test, www  or localhost
            if (host.substring(0,host.indexOf('.')) == `admin` ||
                host.startsWith(`admin.` + ConfigGet(1, 'SERVER', 'TEST_SUBDOMAIN')))
                return true;
            else
                return false;
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
            locale: locale,
            exception_app_function: exception_app_function,
            ui: ui,
            system_admin: system_admin,
            system_admin_only: system_admin_only,
            app_rest_client_id: '',
            app_rest_client_secret: '',
            app_datatoken: '',
            common_app_id: ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
            rest_resource_server: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'),
            rest_resource_bff: ConfigGet(1, 'SERVER', 'REST_RESOURCE_BFF'),
            first_time: first_time
        };
        module = module.replace(
                '<ITEM_COMMON_PARAMETERS/>',
                JSON.stringify(parameters));
        callBack(null, module);
    }
    else{
        const { getAppStartParameters } = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_parameter/app_parameter.service.js`);
        const { CreateDataToken } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
        getAppStartParameters(app_id, (err,result) =>{
            if (err)
                callBack(err, null);
            else{
                let authorization = `Basic ${btoa(result[0].app_rest_client_id + ':' + result[0].app_rest_client_secret)}`;
                CreateDataToken(app_id,  authorization, (err, jstoken_dt)=>{
                    let parameters = {   
                        app_id: app_id,
                        app_name: result[0].app_name,
                        locale:locale,
                        exception_app_function: exception_app_function,
                        ui: ui,
                        system_admin: system_admin,
                        system_admin_only: 0,
                        app_rest_client_id: result[0].app_rest_client_id,
                        app_rest_client_secret: result[0].app_rest_client_secret,
                        app_datatoken: jstoken_dt,
                        common_app_id: ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
                        rest_resource_server: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'),
                        rest_resource_bff: ConfigGet(1, 'SERVER', 'REST_RESOURCE_BFF'),
                        first_time: null
                    };
                    module = module.replace(
                            '<ITEM_COMMON_PARAMETERS/>',
                            JSON.stringify(parameters));
                    callBack(null, module);
                })
            }
        })
    }
}

const AppsStart = async (app) => {
    const {default:express} = await import('express');
    const { admin_pool_started} = await import(`file://${process.cwd()}/service/db/admin/admin.service.js`);
    
    app.use('/common',express.static(process.cwd() + '/apps/common/public'));

    for (let app_config of ConfigGet(7, null, 'APPS'))
        app.use(app_config.ENDPOINT,express.static(process.cwd() + app_config.PATH));
    
    //routes
    app.get("/sw.js",(req, res, next) => {
        let app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        import('node:fs').then((fs) =>{
            fs.readFile(process.cwd() + `${ConfigGet(7, app_id, 'PATH')}/sw.js`, 'utf8', (error, fileBuffer) => {
                if (error)
                    next();
                else{
                    res.type('text/javascript');
                    res.send(fileBuffer.toString());
                }
            })
        })
    });
    app.get("/info/:info",(req, res, next) => {
        let app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && admin_pool_started()==1){
            if (ConfigGet(7, app_id, 'SHOWINFO')==1)
                switch (req.params.info){
                    case 'about':
                    case 'disclaimer':
                    case 'privacy_policy':
                    case 'terms':{
                      if (typeof req.query.lang_code !='undefined'){
                        req.query.lang_code = 'en';
                      }
                      getInfo(app_id, req.params.info, req.query.lang_code, (err, info_result)=>{
                        res.send(info_result);
                      })
                      break;
                    }
                    default:{
                      res.send(null);
                      break;
                    }
                  }
            else
                  next();
        }
        else
            getMaintenance(app_id)
            .then((app_result) => {
                res.send(app_result);
            });
    });
    app.get("/",(req, res, next) => {
        let app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        if (app_id == 0)
            import(`file://${process.cwd()}/apps/apps.controller.js`).then(({ getAppAdmin}) => {
                    getAppAdmin(req, res, app_id, (err, app_result)=>{
                    return res.send(app_result);
                })
            })
        else
            if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && admin_pool_started()==1)
                import(`file://${process.cwd()}/apps/apps.controller.js`).then(({ getApp}) => {
                    getApp(req, res, app_id, null,(err, app_result)=>{
                        return res.send(app_result);
                    })
                })
            else
                getMaintenance(app_id)
                .then((app_result) => {
                    res.send(app_result);
                });
    });
    app.get("/:sub",(req, res, next) => {
        let app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        if (ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID') == app_id)
            return res.redirect('/');
        else
            if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && admin_pool_started()==1){
                if (ConfigGet(7, app_id, 'SHOWPARAM') == 1 && req.params.sub !== '' && !req.params.sub.startsWith('/apps'))
                    import(`file://${process.cwd()}/apps/apps.controller.js`).then(({ getApp}) => {
                        getApp(req, res, app_id, req.params.sub, (err, app_result)=>{
                            //if app_result=0 means here redirect to /
                            if (app_result==0)
                                return res.redirect('/');
                            else
                                return res.send(app_result);
                        })
                    });
                else
                    next();
            }
            else
                getMaintenance(app_id)
                .then((app_result) => {
                    res.send(app_result);
                });
    });
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
                    rest_resource_bff: ConfigGet(1, 'SERVER', 'REST_RESOURCE_BFF')
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
                    case 'AUTH':{
                        // parameters ex:
                        // /auth /auth/admin
                        path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}${parameters}&app_id=${app_id}`
                        break;
                    }
                    case 'BROADCAST':{
                        // parameters ex:
                        // /broadcast...
                        path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}${parameters}&app_id=${app_id}`
                        break;
                    }
                    case 'LOG':{
                        // parameters ex:
                        // /log...
                        path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}${parameters}&app_id=${app_id}`
                        break;
                    }
                    case 'SERVER':{
                        // parameters ex:
                        // /config...  /info
                        path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}${parameters}&app_id=${app_id}`
                        break;
                    }
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
        createMail,
        /*APP ROUTER functiontions */
        getInfo, check_app_subdomain,
        /*APP functions */
        client_locale, read_app_files, get_module_with_init,
        getMaintenance, getUserPreferences,
        AppsStart,
        /*APP BFF functions*/
        BFF}