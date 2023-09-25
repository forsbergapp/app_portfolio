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
    const {getParameters_server} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.service.js`);
    return new Promise((resolve, reject) => {
        let files= [];
        let db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
        let db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
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
                ['<MailHeader/>', process.cwd() + '/apps/common/src/mail_header_verification.html'],
                ['<MailBody/>', process.cwd() + '/apps/common/src/mail_body_verification.html']
            ];
            render_app_html(app_id, files, null, (err, email)=>{
                if (err)
                    reject(err);
                else{                
                    getParameters_server(app_id, ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), (err, result)=>{
                        if (err) {                
                            reject(err);
                        }
                        else{
                            const json = JSON.parse(JSON.stringify(result));
                            for (let i = 0; i < json.length; i++){
                                if (json[i].parameter_name=='SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME')
                                    db_SERVICE_MAIL_TYPE_SIGNUP_FROM_NAME = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME')
                                    db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME')
                                    db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME = json[i].parameter_value;
                                if (json[i].parameter_name=='SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME')
                                    db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME = json[i].parameter_value;

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
                                    email_from = db_SERVICE_MAIL_TYPE_UNVERIFIED_FROM_NAME;
                                    break;
                                }
                                case 3:{
                                    email_from = db_SERVICE_MAIL_TYPE_PASSWORD_RESET_FROM_NAME;
                                    break;
                                }
                                case 4:{
                                    email_from = db_SERVICE_MAIL_TYPE_CHANGE_EMAIL_FROM_NAME;
                                    break;
                                }
                            }
                            const render_variables = [];
                            render_variables.push(['Logo','<img id=\'app_logo\' src=\'/apps/common/images/logo.png\'>']);
                            render_variables.push(['Verification_code',data.verificationCode]);
                            render_variables.push(['Footer',`<a target='_blank' href='https://${data.host}'>${data.host}</a>`]);

                            resolve ({
                                'email_host':         db_SERVICE_MAIL_HOST,
                                'email_port':         db_SERVICE_MAIL_PORT,
                                'email_secure':       db_SERVICE_MAIL_SECURE,
                                'email_auth_user':    db_SERVICE_MAIL_USERNAME,
                                'email_auth_pass':    db_SERVICE_MAIL_PASSWORD,
                                'from':               email_from,
                                'to':                 data.to,
                                'subject':            '❂❂❂❂❂❂',
                                'html':               render_app_with_data(email, render_variables)
                            });
                        }
                    });
                }
            });
        }
        else
            reject ('not implemented');
    });
};
//APP ROUTER functions
const getInfo = async (app_id, info, lang_code, callBack) => {
    const get_parameters = async (callBack) => {
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/app/app.service.js`).then(({getApp}) => {
            getApp(app_id, app_id, lang_code, (err, result_app)=>{
                import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.service.js`).then(({getParameters_server}) =>{
                    getParameters_server(app_id, app_id, (err, result)=>{
                        //app_parameter table
                        let db_info_email_policy;
                        let db_info_email_disclaimer;
                        let db_info_email_terms;
                        let db_info_link_policy_url;
                        let db_info_link_disclaimer_url;
                        let db_info_link_terms_url;
                        let db_info_link_about_url;            
                        if (err)
                            callBack(err, null);
                        else{
                            const json = JSON.parse(JSON.stringify(result));
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
                                            });
                        }
                    });
                });
            });
        });
    };
    const info_html1 = `<!DOCTYPE html>
                      <html>
                        <head>
                            <meta charset='UTF-8'>
                            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
                            <link rel='stylesheet' type='text/css' href='/common/css/common_info.css' />
                        </head>	
                        <body >`;
    const info_html2 = `  </body>
                      </html>`;
    const render_variables = [];                      
    switch (info){
    case 'privacy_policy':{
        get_parameters((err, result)=>{
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_policy_url}.html`, 'utf8', (error, fileBuffer) => {
                    const infopage = fileBuffer.toString();
                    render_variables.push(['APPNAME1', result.app_name ]);
                    render_variables.push(['APPNAME2', result.app_name ]);
                    render_variables.push(['APPURL_HREF', result.app_url ]);
                    render_variables.push(['APPURL_INNERTEXT', result.app_url ]);
                    render_variables.push(['APPEMAIL_HREF', 'mailto:' + result.info_email_policy ]);
                    render_variables.push(['APPEMAIL_INNERTEXT', result.info_email_policy ]);
                    callBack(null, info_html1 + render_app_with_data(infopage, render_variables) + info_html2);
                });
            });
        });
        break;
    }
    case 'disclaimer':{
        get_parameters((err, result)=>{
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_disclaimer_url}.html`, 'utf8', (error, fileBuffer) => {
                    const infopage = fileBuffer.toString();
                    render_variables.push(['APPNAME1', result.app_name ]);
                    render_variables.push(['APPNAME2', result.app_name ]);
                    render_variables.push(['APPNAME3', result.app_name ]);
                    render_variables.push(['APPEMAIL_HREF', 'mailto:' + result.info_email_disclaimer ]);
                    render_variables.push(['APPEMAIL_INNERTEXT', result.info_email_disclaimer ]);
                    callBack(null, info_html1 + render_app_with_data(infopage, render_variables) + info_html2);
                });
            });
        });
        break;
    }
    case 'terms':{
        get_parameters((err, result)=>{
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_terms_url}.html`, 'utf8', (error, fileBuffer) => {
                    const infopage = fileBuffer.toString();
                    render_variables.push(['APPNAME', result.app_name ]);
                    render_variables.push(['APPURL_HREF', result.app_url ]);
                    render_variables.push(['APPURL_INNERTEXT', result.app_url ]);
                    render_variables.push(['APPEMAIL_HREF', 'mailto:' + result.info_email_terms ]);
                    render_variables.push(['APPEMAIL_INNERTEXT', result.info_email_terms ]);
                    callBack(null, info_html1 + render_app_with_data(infopage, render_variables) + info_html2);
                });
            });
        });
        break;
    }
    case 'about':{
        get_parameters((err, result)=>{
            import('node:fs').then((fs) =>{
                fs.readFile(process.cwd() + `/apps/app${app_id}/src${result.info_link_about_url}.html`, 'utf8', (error, fileBuffer) => {
                    callBack(null, info_html1 + fileBuffer.toString() + info_html2);
                });
            });
        });
        break;
    }
    default:
        callBack(null, null);
        break;
    }
};
//APP functions
const callCreateApp = async (app_id, module_config, callBack) =>{
    //Data token
    const { CreateDataToken } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
    const datatoken = CreateDataToken(app_id);
    //get GPS from IP
    const parameters = `/ip?ip=${module_config.ip}`;
    let result_geodata = await BFF(app_id, 'GEOLOCATION', parameters, module_config.ip, module_config.method, `Bearer ${datatoken}`, module_config.user_agent, module_config.accept_language, module_config.body)
    .catch(error=>
        callBack(error, null)
    );
    if (result_geodata){
        result_geodata = JSON.parse(result_geodata);
        result_geodata.latitude = result_geodata.geoplugin_latitude;
        result_geodata.longitude = result_geodata.geoplugin_longitude;
        result_geodata.place = result_geodata.geoplugin_city + ', ' +
                                result_geodata.geoplugin_regionName + ', ' +
                                result_geodata.geoplugin_countryName;
    }
    else{
        result_geodata = {};
        result_geodata.latitude = null;
        result_geodata.longitude = null;
        result_geodata.place = null;
    }
    let system_admin_only;
    let app_module_type;
    let app;
    let config_map;
    let config_map_styles;
    let config_ui;

    if (app_id == 0 && module_config.module_type=='APP'){
        //get app admin
        const{createAdmin } = await import(`file://${process.cwd()}/apps/admin/src/app.js`);
        app = await createAdmin(app_id, client_locale(module_config.accept_language));
        if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && apps_start_ok()==true){
            system_admin_only = 0;
        }
        else{
            system_admin_only = 1;
        }
        app_module_type = 'ADMIN';
        config_map = app.map;
        config_map_styles = app.map_styles;
        config_ui = true;
    }
    else{
        system_admin_only = 0;
        if (module_config.module_type=='APP'){
            const {createApp} = await import(`file://${process.cwd()}/apps/app${app_id}/src/app.js`);
            app = await createApp(app_id, module_config.params, client_locale(module_config.accept_language));
            if (app == 0)
                return callBack(null, app);
            app_module_type = 'APP';
            config_map = app.map;
            config_map_styles = app.map_styles;
            config_ui = true;
            //get translation data
            const {getObjects} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_object/app_object.service.js`);

            const callGetObjects = async () =>{
                return new Promise((resolve)=>{
                    getObjects(app_id, client_locale(module_config.accept_language), 'APP_OBJECT_ITEM', 'COMMON', (err, result_objects) => {
                        const render_variables = [];
                        for (const row of result_objects){
                            render_variables.push([`CommonTranslation${row.object_item_name.toUpperCase()}`, row.text]);
                        }
                        app.app = render_app_with_data(app.app, render_variables);
                        resolve(app.app);
                    });
                });
            };
            await callGetObjects();
        }
        else{
            const {createReport} = await import(`file://${process.cwd()}/apps/app${app_id}/src/report/index.js`);
            app = await createReport(app_id, module_config.params, client_locale(module_config.accept_language));
            app_module_type = 'REPORT';
            config_map = false;
            config_map_styles = null;
            config_ui = false;
        }
    }
    get_module_with_init({  app_id: app_id, 
                            locale: client_locale(module_config.accept_language),
                            system_admin_only:system_admin_only,
                            map:config_map, 
                            map_styles: config_map_styles,
                            ui:config_ui,
                            datatoken:datatoken,
                            latitude:result_geodata.latitude,
                            longitude:result_geodata.longitude,
                            place:result_geodata.place,
                            module:app.app}, (err, app_with_init) =>{
        //if app admin then log, system does not log in database
        if (ConfigGet(1, 'SERVICE_DB', `DB${ConfigGet(1, 'SERVICE_DB', 'USE')}_APP_ADMIN_USER`))
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.service.js`).then(({createLog}) => {
                createLog(app_id,
                        { app_id : app_id,
                            app_module : 'APPS',
                            app_module_type : app_module_type,
                            app_module_request : null,
                            app_module_result : result_geodata.place,
                            app_user_id : null,
                            user_language : null,
                            user_timezone : null,
                            user_number_system : null,
                            user_platform : null,
                            server_remote_addr : module_config.ip,
                            server_user_agent : module_config.user_agent,
                            server_http_host : module_config.host,
                            server_http_accept_language : module_config.accept_language,
                            client_latitude : result_geodata.latitude,
                            client_longitude : result_geodata.longitude
                        }, ()  => {
                            return callBack(null, app_with_init);
                });
            });
        else
            return callBack(null, app_with_init);
    });
};
const getApp = async (req, res, app_id, params, callBack) => {
    if (apps_start_ok() ==true || app_id == ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')){  
        callCreateApp(app_id, {	module_type:'APP', 
                                params:params, 
                                ip:req.ip,
                                method:req.method,
                                user_agent: req.headers['user-agent'],
                                accept_language: req.headers['accept-language'],
                                host: req.headers['host'],
                                body: req.body
                                }, (err, app) =>{
            if (err)
                return callBack(null, null);
            else
                return callBack(null, app);
        });
    }
    else
        getMaintenance(app_id).then((result_maintenance) => {
            return callBack(null, result_maintenance);
        });
};
const getReport = async (req, res, app_id, callBack) => {

    if (apps_start_ok() ==true){
        const decodedparameters = Buffer.from(req.query.reportid, 'base64').toString('utf-8');
        //example string:
        //'app_id=2&module=timetable.html&id=1&sid=1&type=0&lang_code=en-us&format=PDF&ps=A4&hf=0'
        let query_parameters = '{';
        decodedparameters.split('&').forEach((parameter, index)=>{
            query_parameters += `"${parameter.split('=')[0]}": "${parameter.split('=')[1]}"`;
            if (index < decodedparameters.split('&').length - 1)
                query_parameters += ',';
        });
        query_parameters += '}';
        query_parameters = JSON.parse(query_parameters);
    
        req.query.ps = query_parameters.ps; //papersize     A4/Letter
        req.query.hf = query_parameters.hf; //header/footer 1/0
    
        if (query_parameters.format.toUpperCase() == 'PDF' && typeof req.query.messagequeque == 'undefined' ){
            //PDF
            req.query.service ='PDF';
            const url = `${req.protocol}://${req.get('host')}/reports?ps=${req.query.ps}&hf=${req.query.hf}&reportid=${req.query.reportid}&messagequeque=1`;
            //call message queue
            const { MessageQueue } = await import(`file://${process.cwd()}/service/service.service.js`);
            MessageQueue('PDF', 'PUBLISH', {'url':url, 'ps':req.query.ps, 'hf':(req.query.hf==1)}, null)
                .then((pdf)=>{
                    callBack(null, pdf);
                })
                .catch((error)=>{
                    callBack(error, null);
                });
        }
        else{
            callCreateApp(app_id, {	module_type:'REPORT', 
                                    params:query_parameters.module, 
                                    ip:req.ip,
                                    method:req.method,
                                    user_agent: req.headers['user-agent'],
                                    accept_language: req.headers['accept-language'],
                                    host: req.headers['host'],
                                    body: req.body
                                    }, (err, report)=>{
                if (err)
                    return callBack(null, null);
                else
                    return callBack(null, report);
            });
        }
    }
    else
        getMaintenance(app_id).then((result_maintenance) => {
            callBack(null, result_maintenance);
        });
};
const apps_start_ok = ()=>{
    if (ConfigGet(0, null, 'MAINTENANCE')=='0' && ConfigGet(1, 'SERVICE_DB', 'START')=='1' && ConfigGet(1, 'SERVER', 'APP_START')=='1' &&
        ConfigGet(1, 'SERVICE_DB', `DB${ConfigGet(1, 'SERVICE_DB', 'USE')}_APP_ADMIN_USER`))
        return true;
    else
    return false;
};

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
const render_app_html = async (app_id, files, app_config, callBack) => {
    let i = 0;
    //ES2020 import() with ES6 promises, object destructuring
    import('node:fs').then(({promises: {readFile}}) => {
        Promise.all(files.map(file => {
            return readFile(file[1], 'utf8');
        })).then(fileBuffers => {
            let app_files ='';
            fileBuffers.forEach(fileBuffer => {
                if (app_files=='')
                    app_files = fileBuffer.toString();
                else
                    app_files = app_files.replace(
                                    files[i][0],
                                    `${fileBuffer.toString()}`);
                i++;
            });
            if (app_config)
                render_common_html(app_id, app_files, app_config).then((app)=>{
                    callBack(null, app);
                });
            else{
                //app that does not need common like maintenance and email
                callBack(null, app_files);
            }
        })
        .catch(err => {
            callBack(err, null);
        });
    });
};
const read_common_files = async (module, files, callBack) => {
    const fs = await import('node:fs');
    for (const file of files){
        const filecontent = await fs.promises.readFile(file[1]);
        module = module.replace(
            file[0],
            `${filecontent.toString()}`);
    }
    callBack(null, module);
};
const render_app_with_data = (app, data)=>{
    for (const variable of data){
        //add < and /> around tag variablename
        //replace all tags found with given searched tag with given value
        //ES2021 replaceAll
        app = app.replaceAll(`<${variable[0]}/>`,variable[1]);
    }
    return app;
};
const render_common_html = async (app_id, module, app_config) =>{
    /*
    inparameter app_config object
        {
        locale:                     locale, 
        module_type:                'FORM'/'REPORTS', 
        map:                        true/false, 
        custom_tag_search_profile:  [custom tag]/null,      optional custom app placement of component
        custom_tag_user_account:    [custom tag]/null,      optional custom app placement of component
        custom_tag_profile_top:     [custom tag]/null,      optional custom app placement of component
        app_themes:                 true/false, 
        render_locales:             true/false, 
        render_settings:            true/false, 
        render_provider_buttons:    true/false
        }

    returns object
        {
        app:app,                                                //HTML format
        locales: user_locales,                                  //HTML option format
        settings: { settings: settings,                         //result from database
                    user_timezones: user_timezones,             //HTML option format
                    user_directions: user_directions,           //HTML option format
                    user_arabic_scripts: user_arabic_scripts},  //HTML option format
                    map_styles: map_styles}                     //HTML option format
        }
    */
    let user_locales;
    let settings;
    let user_timezones = '';
    let user_directions = '';
    let user_arabic_scripts = '';
    const map_styles = [];
    const render_variables = [];
    if (app_config.render_locales){
        const promisegetLocales = async () =>{
            const {getLocales}  = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/language/locale/locale.service.js`);
            return new Promise((resolve)=>{
                let user_locales;
                getLocales(app_id, app_config.locale, (err, result_user_locales) => {
                    result_user_locales.forEach( (locale,i) => {
                        user_locales += `<option id=${i} value=${locale.locale}>${locale.text}</option>`;
                    });
                resolve(user_locales);
                });
            });
        };
        user_locales = await promisegetLocales();
    }
    if (app_config.render_settings){
        const promisegetSettings = async () =>{
            const {getSettings} = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/setting/setting.service.js`);
            return new Promise((resolve)=>{
                getSettings(app_id, app_config.locale, null, (err, settings) => {
                    let option;
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
                            //map styles
                            case 'MAP_STYLE':{
                                map_styles.push({  id:settings[i].id, 
                                                    description:settings[i].text, 
                                                    data:settings[i].data, 
                                                    data2:settings[i].data2, 
                                                    data3:settings[i].data3, 
                                                    data4:settings[i].data4, 
                                                    session_map_layer:null});
                                break;
                            }
                        }
                    }
                    resolve ({  settings: settings, 
                                user_timezones: user_timezones, 
                                user_directions: user_directions, 
                                user_arabic_scripts: user_arabic_scripts,
                                map_styles: app_config.map==true?map_styles:null});
                });
            });
        };
        settings = await promisegetSettings();
    }               
    return new Promise((resolve, reject)=>{
        let common_files;
        if (app_config.module_type == 'FORM'){
            common_files = [
				//HEAD
				['<CommonHead/>', process.cwd() + '/apps/common/src/head.html'],
				['<CommonHeadFonts/>', process.cwd() + '/apps/common/src/fonts.html'],
				//BODY
				['<CommonBody/>', process.cwd() + '/apps/common/src/body.html'],
                ['<CommonBodyDialogues/>', process.cwd() + '/apps/common/src/body_dialogues.html'],
                ['<CommonBodyWindowInfo/>', process.cwd() + '/apps/common/src/body_window_info.html'],
				['<CommonBodyMaintenance/>', process.cwd() + '/apps/common/src/body_maintenance.html'],
				['<CommonBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html'],    
				//Profile tag CommonBodyProfileDetail in common body
				['<CommonBodyProfileDetail/>', process.cwd() + '/apps/common/src/profile_detail.html'], 
				['<CommonBodyProfileBtnTop/>', process.cwd() + '/apps/common/src/profile_btn_top.html'],
                [app_config.custom_tag_profile_search==null?'<CommonBodyProfileSearch/>':app_config.custom_tag_profile_search, process.cwd() + '/apps/common/src/profile_search.html'],
				[app_config.custom_tag_user_account==null?'<CommonBodyUserAccount/>':app_config.custom_tag_user_account, process.cwd() + '/apps/common/src/user_account.html'],
                [app_config.custom_tag_profile_top==null?'<CommonBodyProfileBtnTop/>':app_config.custom_tag_profile_top, process.cwd() + '/apps/common/src/profile_btn_top.html']
            ];
            if (app_config.map==true)
                common_files.push(['<CommonHeadMap/>', process.cwd() + '/apps/common/src/head_map.html']);
            if (app_config.app_themes==true){
                //CommonBodyThemes inside common User account div
                common_files.push(['<CommonBodyThemes/>', process.cwd() + '/apps/common/src/app_themes.html']);
            }
        }
        else
            common_files = [
                //HEAD
                ['<CommonReportHead/>', process.cwd() + '/apps/common/src/report/head.html'],
                ['<CommonReportHeadFonts/>', process.cwd() + '/apps/common/src/fonts.html'],
                //BODY
                ['<CommonReportBody/>', process.cwd() + '/apps/common/src/report/body.html'],
                ['<CommonReportBodyMaintenance/>', process.cwd() + '/apps/common/src/body_maintenance.html'],
                ['<CommonReportBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html']
            ];
        read_common_files(module, common_files, (err, app)=>{
            if (err)
                reject(err);
            else{
                if (app_config.map==false){
                    render_variables.push(['CommonHeadMap','']);
                }
                //remove common tags already used in optional app custom tags
                if(app_config.custom_tag_profile_search!='')
                    render_variables.push(['CommonBodyProfileSearch','']);
                if(app_config.custom_tag_user_account!='')
                    render_variables.push(['CommonBodyUserAccount','']);
                if(app_config.custom_tag_profile_top!='')
                    render_variables.push(['CommonBodyProfileBtnTop','']);

                //render locales
                if (app_config.render_locales){
                    render_variables.push(['COMMON_USER_LOCALE',user_locales]);
                }
                else{
                    render_variables.push(['COMMON_USER_LOCALE','']);
                }
                //render settings
                if (app_config.render_settings){
                    render_variables.push(['COMMON_USER_TIMEZONE',user_timezones]);
                    render_variables.push(['COMMON_USER_DIRECTION',`<option id='' value=''></option>${user_directions}`]);
                    render_variables.push(['COMMON_USER_ARABIC_SCRIPT',`<option id='' value=''></option>${user_arabic_scripts}`]);
                }
                else{
                    render_variables.push(['COMMON_USER_TIMEZONE','']);
                    render_variables.push(['COMMON_USER_DIRECTION','']);
                    render_variables.push(['COMMON_USER_ARABIC_SCRIPT','']);
                }
                if (app_config.render_provider_buttons){
                    providers_buttons(app_id).then((buttons)=>{
                        render_variables.push(['COMMON_PROVIDER_BUTTONS',buttons]);                        
                        resolve({   app:render_app_with_data(app, render_variables), 
                                    locales: user_locales, 
                                    settings: settings});
                    });
                }
                else{
                    render_variables.push(['COMMON_PROVIDER_BUTTONS','']);
                    resolve({   app:render_app_with_data(app, render_variables),
                                locales: user_locales, 
                                settings: settings});
                }
            }
        });
    });
};
const countries = (app_id, locale) => {
    return new Promise((resolve) => {
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/country/country.service.js`).then(({getCountries})=>{
            getCountries(app_id, locale, (err, results)  => {
                let select_countries;
                if (err){
                    resolve (
                                `<option value='' id='' label='…' selected='selected'>…
                                </option>`
                            );
                }     
                else{
                    let current_group_name;
                    select_countries  =`<option value='' id='' label='…' selected='selected'>…
                                        </option>`;
            
                    results.map( (countries_map,i) => {
                        if (i === 0){
                        select_countries += `<optgroup label=${countries_map.group_name} />`;
                        current_group_name = countries_map.group_name;
                        }
                        else{
                        if (countries_map.group_name !== current_group_name){
                            select_countries += `<optgroup label=${countries_map.group_name} />`;
                            current_group_name = countries_map.group_name;
                        }
                        select_countries +=
                        `<option value=${i}
                                id=${countries_map.id} 
                                country_code=${countries_map.country_code} 
                                flag_emoji=${countries_map.flag_emoji} 
                                group_name=${countries_map.group_name}>${countries_map.flag_emoji} ${countries_map.text}
                        </option>`;
                        }
                    });
                    resolve (select_countries);
                }
            });
        });
    });
};
const get_module_with_init = async (app_info, callBack) => {
    const render_variables = [];
    const return_with_parameters = (module, countries, app_parameters, first_time)=>{
        const app_service_parameters = {   
            app_id: app_info.app_id,
            app_datatoken: app_info.datatoken,
            countries:countries,
            map_styles: app_info.map_styles,
            locale: app_info.locale,
            ui: app_info.ui,
            system_admin_only: app_info.system_admin_only,
            client_latitude: app_info.latitude,
            client_longitude: app_info.longitude,
            client_place: app_info.place,
            app_sound: ConfigGet(1, 'SERVER', 'APP_SOUND'),
            common_app_id: ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
            rest_resource_server: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'),
            rest_resource_bff: ConfigGet(1, 'SERVER', 'REST_RESOURCE_BFF'),
            first_time: first_time
        };
        render_variables.push(['ITEM_COMMON_PARAMETERS',JSON.stringify({
                                                            app_service: app_service_parameters,
                                                            app: app_parameters
                                                        })]);
        return render_app_with_data(app_info.module, render_variables);
    };
    
    if (app_info.system_admin_only==1){
        render_variables.push(['APP_NAME','SYSTEM ADMIN']);
        callBack(null, return_with_parameters(app_info.module, null, null, CheckFirstTime()==true?1:0));
    }
    else{
        const { getAppName } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app/app.service.js`);
        const { getAppStartParameters } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_parameter/app_parameter.service.js`);
        getAppName(app_info.app_id, (err,result_app_name) =>{
            if (err)
                callBack(err, null);
            else{
                //fetch parameters for common_app_id and current app_id
                getAppStartParameters(app_info.app_id, (err,app_parameters) =>{
                    if (err)
                        callBack(err, null);
                    else{
                        render_variables.push(['APP_NAME',result_app_name[0].app_name]);
                        if (app_info.map == true)
                            //fetch countries and return map styles
                            countries(app_info.app_id, app_info.locale).then((countries)=>{
                                callBack(null, return_with_parameters(app_info.module, countries, app_parameters, 0));    
                            });
                        else{
                            //no countries or map styles
                            callBack(null, return_with_parameters(app_info.module, null, app_parameters, 0));
                        }
                    }
                });
                
            }
        });
    }        
};

const AppsStart = async (app) => {
    const {default:express} = await import('express');

    app.use('/common',express.static(process.cwd() + '/apps/common/public'));

    for (const app_config of ConfigGet(7, null, 'APPS'))
        app.use(app_config.ENDPOINT,express.static(process.cwd() + app_config.PATH));
    
    //routes
    app.get('/sw.js',(req, res, next) => {
        const app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        import('node:fs').then((fs) =>{
            fs.readFile(process.cwd() + `${ConfigGet(7, app_id, 'PATH')}/sw.js`, 'utf8', (error, fileBuffer) => {
                //show empty if any error for this file
                if (error){
                    res.statusCode = 500;
                    res.statusMessage = error;
                    next();
                }
                else{
                    res.type('text/javascript');
                    res.send(fileBuffer.toString());
                }
            });
        });
    });
    app.get('/info/:info',(req, res, next) => {
        const app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        if (apps_start_ok()==true)
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
                            //show empty if any error
                            if (err){
                                res.statusCode = 500;
                                res.statusMessage = err;
                                next();
                            }
                            else
                                res.send(info_result);
                        });
                        break;
                    }
                    default:{
                        res.send(null);
                        break;
                    }
                }
            else
                next();
        else
            getMaintenance(app_id)
            .then((app_result) => {
                res.send(app_result);
            });
    });
    app.get('/reports',(req, res) => {
        const app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        //no app_id in reports url
        req.query.app_id = app_id;
        if (app_id == 0)
            res.redirect('/');
        else
            getReport(req, res, app_id, (err, report_result)=>{
                //redirect if any error
                if (err){
                    res.statusCode = 500;
                    res.statusMessage = err;
                    res.redirect('/');
                }
                else{
                    if (req.query.service==='PDF'){
                        res.type('application/pdf');
                        res.send(report_result);
                        //res.end(report_result, 'binary');
                    }
                    else    
                        res.send(report_result);
                }
                    
            });
    });
    app.get('/',(req, res) => {
        const app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        getApp(req, res, app_id, null,(err, app_result)=>{
            //show empty if any error
            if (err){
                res.statusCode = 500;
                res.statusMessage = err;
                res.end();
            }
            else
                return res.send(app_result);
        });
    });
    app.get('/:sub',(req, res, next) => {
        const app_id = ConfigGet(7, req.headers.host, 'SUBDOMAIN');
        if (ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID') == app_id)
            return res.redirect('/');
        else
            if (ConfigGet(7, app_id, 'SHOWPARAM') == 1 && req.params.sub !== '' && !req.params.sub.startsWith('/apps'))
                getApp(req, res, app_id, req.params.sub, (err, app_result)=>{
                    //show empty if any error
                    if (err){
                        res.statusCode = 500;
                        res.statusMessage = err;
                        res.end();
                    }
                    else{
                        //if app_result=0 means here redirect to /
                        if (app_result==0)
                            return res.redirect('/');
                        else
                            return res.send(app_result);
                    }
                });
            else
                next();
    });
};
    
const getMaintenance = (app_id) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['APP', process.cwd() + '/apps/common/src/index_maintenance.html'],
            ['<AppCommonHeadMaintenance/>', process.cwd() + '/apps/common/src/head_maintenance.html'],
            ['<AppCommonBodyMaintenance/>', process.cwd() + '/apps/common/src/body_maintenance.html'],
            ['<AppCommonBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html'] 
            ];
        const render_variables = [];
        render_app_html(app_id, files, null, (err, app)=>{
            if (err)
                reject(err);
            else{
                //maintenance can be used from all app_id
                const parameters = {   
                    app_id: app_id,
                    rest_resource_server: ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER'),
                    rest_resource_bff: ConfigGet(1, 'SERVER', 'REST_RESOURCE_BFF')
                };
                render_variables.push(['ITEM_COMMON_PARAMETERS',JSON.stringify(parameters)]);
                resolve(render_app_with_data(app, render_variables));
            }
        });
    });
};

const providers_buttons = async (app_id) =>{
    const { getIdentityProviders } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/identity_provider/identity_provider.service.js`);
    return new Promise((resolve, reject)=>{
        getIdentityProviders(app_id, (err, result)=>{
            if (err)
                reject(err);
            else{
                let html = '';
                for (const provider of result){
                    html += `<button class='common_login_button common_login_provider_button' >
                                <div class='common_login_provider_id'>${provider.id}</div>
                                <div class='common_login_provider_name'>${provider.provider_name}</div>
                            </button>`;
                }
                if (html)
                    resolve(`<div id='identity_provider_login'>${html}</div>`);
                else
                    resolve('');
            }
        });
    });	
};
//APP BFF functions
const BFF = async (app_id, service, parameters, ip, method, authorization, headers_user_agent, headers_accept_language, data) => {
    const { check_internet } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
    const result_internet = await check_internet();
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
                        path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}${parameters}&app_id=${app_id}`;
                        break;
                    }
                    case 'BROADCAST':{
                        // parameters ex:
                        // /broadcast...
                        path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}${parameters}&app_id=${app_id}`;
                        break;
                    }
                    case 'LOG':{
                        // parameters ex:
                        // /log...
                        path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}${parameters}&app_id=${app_id}`;
                        break;
                    }
                    case 'SERVER':{
                        // parameters ex:
                        // /config...  /info
                        path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}${parameters}&app_id=${app_id}`;
                        break;
                    }
                    case 'DB_API':{
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
                                    path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}/dbapi${parameters}&app_id=${app_id}`;
                                else
                                    path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVER')}/dbapi${rest_resource_service_db_schema}${parameters}&app_id=${app_id}`;
                                break;
                            }
                            default:{
                                return reject('service DB GET, POST, PUT, PATCH or DELETE only');
                            }
                        }
                        break;
                    }
                    case 'GEOLOCATION':{
                        // parameters ex:
                        // /ip?app_id=[id]&lang_code=en
                        // /place?latitude[latitude]&longitude=[longitude]
                        //ENABLE_GEOLOCATION control is for ip to geodata service /place and /timezone should be allowed
                        if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' || parameters.startsWith('/ip')==false){
                            if (method=='GET'){
                                //set ip from client in case ip query parameter is missing
                                const basepath = parameters.split('?')[0];
                                if (parameters.startsWith('/ip')){    
                                    const params = parameters.split('?')[1].split('&');
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
                                //use app, id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                                authorization = `Basic ${Buffer.from(ConfigGet(7, app_id, 'CLIENT_ID') + ':' + ConfigGet(7, app_id, 'CLIENT_SECRET'),'utf-8').toString('base64')}`;
                                path = `/geolocation${parameters}&app_id=${app_id}`;
                            }
                            else
                                return reject('service GEOLOCATION GET only');
                        }
                        else
                            return resolve('');
                        break;
                    }
                    case 'WORLDCITIES':{
                        // parameters ex:
                        // /[countrycode]?app_user_id=[id]&app_id=[id]&lang_code=en
                        if (method=='GET'){
                            //use app, id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                            authorization = `Basic ${Buffer.from(ConfigGet(7, app_id, 'CLIENT_ID') + ':' + ConfigGet(7, app_id, 'CLIENT_SECRET'),'utf-8').toString('base64')}`;
                            path = `/worldcities${parameters}&app_id=${app_id}`;
                        }
                            
                        else
                            return reject('service WORLDCITIES GET only');
                        break;
                    }
                    default:{
                        return reject(`service ${service} does not exist`);
                    }
                }
                microservice_circuitbreak.callService(app_id,path,service, method,ip,authorization, headers_user_agent, headers_accept_language,data)
                .then(result=>resolve(result))
                .catch(error=>reject(error));
            } catch (error) {
                return reject(error);
            }
        }
        else
            return reject('no internet');
    });
};
export {/*APP EMAIL functions*/
        createMail,
        /*APP ROUTER functiontions */
        getInfo,
        /*APP functions */
        apps_start_ok, render_app_html,render_app_with_data,
        AppsStart,
        /*APP BFF functions*/
        BFF};