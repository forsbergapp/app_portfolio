const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const service = await import('./apps.service.js');

const getApp = async (req, res, app_id, params, callBack) => {
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    if (service.apps_start_ok() ==true || app_id == ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID')){  
        //Data token
        const { CreateDataToken } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
        const datatoken = CreateDataToken(app_id);
        //get GPS from IP
        const parameters = `/ip?ip=${req.ip}`;
        service.BFF(app_id, 'GEOLOCATION', parameters, 
                    req.ip, req.method, `Bearer ${datatoken}`, req.headers['user-agent'], req.headers['accept-language'], req.body).then((result_geodata)=>{
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
                
            //get app
            if (app_id == 0){
                //get app admin
                import(`file://${process.cwd()}/apps/admin/src/app.js`).then(({ createAdmin }) => {
                    createAdmin(app_id,service.client_locale(req.headers['accept-language'])).then((app) => {
                        //get app with parameters
                        let system_admin_only;
                        if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && service.apps_start_ok()==true){
                            system_admin_only = 0;
                        }
                        else{
                            system_admin_only = 1;
                        }
                        service.get_module_with_init(app_id, 
                                                    service.client_locale(req.headers['accept-language']),
                                                    system_admin_only,
                                                    true,  //ui
                                                    datatoken,
                                                    result_geodata.latitude,
                                                    result_geodata.longitude,
                                                    result_geodata.place,
                                                    app, (err, app_with_init) =>{
                            //if app admin then log, system does not log in database
                            if (ConfigGet(1, 'SERVICE_DB', `DB${ConfigGet(1, 'SERVICE_DB', 'USE')}_APP_ADMIN_USER`))
                                import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.service.js`).then(({createLog}) => {
                                    createLog(req.query.app_id,
                                            { app_id : app_id,
                                                app_module : 'APPS',
                                                app_module_type : 'ADMIN',
                                                app_module_request : null,
                                                app_module_result : result_geodata.place,
                                                app_user_id : null,
                                                user_language : null,
                                                user_timezone : null,
                                                user_number_system : null,
                                                user_platform : null,
                                                server_remote_addr : req.ip,
                                                server_user_agent : req.headers['user-agent'],
                                                server_http_host : req.headers['host'],
                                                server_http_accept_language : req.headers['accept-language'],
                                                client_latitude : result_geodata.latitude,
                                                client_longitude : result_geodata.longitude
                                            }, ()  => {
                                                return callBack(null, app_with_init);
                                    });
                                });
                        });
                    });
                });
            }
            else{
                import(`file://${process.cwd()}/apps/app${app_id}/src/app.js`).then(({ createApp }) => {
                    createApp(app_id, params,service.client_locale(req.headers['accept-language'])).then((app) => {
                        //get translation data
                        import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_object/app_object.service.js`).then(({getObjects}) => {
                            getObjects(app_id, service.client_locale(req.headers['accept-language']), 'APP_OBJECT_ITEM', 'COMMON', (err, result_objects) => {
                                for (const row of result_objects){
                                    app = app.replaceAll(
                                        `<CommonTranslation${row.object_item_name.toUpperCase()}/>`,
                                        `${row.text}`);
                                }
                                //get app with parameters
                                service.get_module_with_init(app_id, 
                                    service.client_locale(req.headers['accept-language']),
                                    0,  //system_admin_only
                                    true,  //ui
                                    datatoken,
                                    result_geodata.latitude,
                                    result_geodata.longitude,
                                    result_geodata.place,
                                    app, (err, app_with_init) =>{
                                    import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.service.js`).then(({createLog}) => {
                                        createLog(req.query.app_id,
                                                    { app_id : app_id,
                                                    app_module : 'APPS',
                                                    app_module_type : 'APP',
                                                    app_module_request : params,
                                                    app_module_result : result_geodata.place,
                                                    app_user_id : null,
                                                    user_language : null,
                                                    user_timezone : null,
                                                    user_number_system : null,
                                                    user_platform : null,
                                                    server_remote_addr : req.ip,
                                                    server_user_agent : req.headers['user-agent'],
                                                    server_http_host : req.headers['host'],
                                                    server_http_accept_language : req.headers['accept-language'],
                                                    client_latitude : result_geodata.latitude,
                                                    client_longitude : result_geodata.longitude
                                                    }, ()  => {
                                                        return callBack(null, app_with_init);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
        })
        .catch(error=>
            callBack(error, null)
        );
    }
    else
        service.getMaintenance(app_id).then((result_maintenance) => {
            return callBack(null, result_maintenance);
        });
};
const getReport = async (req, res, app_id, callBack) => {

    if (service.apps_start_ok() ==true){
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
            //data token
            const { CreateDataToken } = await import(`file://${process.cwd()}/server/auth/auth.service.js`);
            const datatoken = CreateDataToken(app_id);
            const parameters = `/ip?ip=${req.ip}`;
            service.BFF(app_id, 'GEOLOCATION', parameters, 
                        req.ip, req.method, `Bearer ${datatoken}`, req.headers['user-agent'], req.headers['accept-language'], req.body).then((result_geodata)=>{
                result_geodata = JSON.parse(result_geodata);
                result_geodata.latitude = result_geodata.geoplugin_latitude;
                result_geodata.longitude = result_geodata.geoplugin_longitude;
                result_geodata.place = result_geodata.geoplugin_city + ', ' +
                                        result_geodata.geoplugin_regionName + ', ' +
                                        result_geodata.geoplugin_countryName;
                import(`file://${process.cwd()}/apps/app${app_id}/src/report/index.js`).then(({createReport}) => {
                    createReport(app_id, query_parameters.module, service.client_locale(req.headers['accept-language'])).then((report) => {
                        service.get_module_with_init(   app_id, 
                                                        service.client_locale(req.headers['accept-language']),
                                                        0,  //system_admin_only
                                                        false,
                                                        datatoken,
                                                        result_geodata.latitude,
                                                        result_geodata.longitude,
                                                        result_geodata.place,
                                                        report, (err, report_with_init) =>{
                                                            if (err)
                                                                callBack(err, null);
                                                            else{
                                                                import(`file://${process.cwd()}/server/dbapi/app_portfolio/app_log/app_log.service.js`).then(({createLog}) => {
                                                                    createLog(req.query.app_id,
                                                                                { app_id : app_id,
                                                                                app_module : 'APPS',
                                                                                app_module_type : 'REPORT',
                                                                                app_module_request : query_parameters.format,
                                                                                app_module_result : result_geodata.place,
                                                                                app_user_id : null,
                                                                                user_language : null,
                                                                                user_timezone : null,
                                                                                user_number_system : null,
                                                                                user_platform : null,
                                                                                server_remote_addr : req.ip,
                                                                                server_user_agent : req.headers['user-agent'],
                                                                                server_http_host : req.headers['host'],
                                                                                server_http_accept_language : req.headers['accept-language'],
                                                                                client_latitude : result_geodata.latitude,
                                                                                client_longitude : result_geodata.longitude
                                                                                }, ()  => {
                                                                        callBack(null,report_with_init);
                                                                    });
                                                                });
                                                                
                                                        }
                        });
                    });
                });
                
            })
            .catch(error=>{
                callBack(error,null);
            });
        }
    }
    else
        service.getMaintenance(app_id).then((result_maintenance) => {
            callBack(null, result_maintenance);
        });
};		
//backend for frontend
//returns status 401 (parameter errors), 503(ANY error in called service) or 200 if ok
//together with error or result
const BFF = async (req, res) =>{
    //check inparameters
    if (!req.query.app_id &&
        !req.query.service &&
        !req.query.parameters)
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    else{
        const decodedparameters = Buffer.from(req.query.parameters, 'base64').toString('utf-8');
        let message_queue=false;
        const service_called = req.query.service.toUpperCase();
        if (service_called=='MAIL')
            message_queue=true;
        let parameters;
        if (req.query.user_account_logon_user_account_id)
            parameters = decodedparameters + `&user_account_logon_user_account_id=${req.query.user_account_logon_user_account_id}`;
        else
            parameters = decodedparameters;
        if (service_called=='BROADCAST' && decodedparameters.startsWith('/broadcast/connection/connect')){
            // return broadcast stream
            // ex path and query parameters: /broadcast/connection/connect?identity_provider_id=&system_admin=null&lang_code=en
            const query_parameters = parameters.toLowerCase().split('?')[1].split('&');
            req.query.system_admin = query_parameters.filter(query=>{ 
                                                                return query.startsWith('system_admin');}
                                                            )[0].split('=')[1];
            req.query.identity_provider_id = query_parameters.filter(query=>{ 
                                                                     return query.startsWith('identity_provider_id');}
                                                                     )[0].split('=')[1];
            delete req.query.parameters;
            delete req.query.service;
            const {BroadcastConnect} = await import(`file://${process.cwd()}/server/broadcast/broadcast.controller.js`);
            BroadcastConnect(req,res);
        }
        else
            service.BFF(req.query.app_id, service_called, parameters, req.ip, req.method, req.headers.authorization, req.headers['user-agent'], req.headers['accept-language'], req.body)
            .then(result_service => {
                import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServiceI})=>{
                    const log_text = message_queue==true?null:result_service;
                    LogServiceI(req.query.app_id, service_called, parameters, log_text).then(()=>{
                        //message queue saves result there
                        if (message_queue)
                            return res.status(200).send('✅');
                        else
                            return res.status(200).send(result_service);
                    });
                });
            })
            .catch(error => {
                import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogServiceE})=>{
                    //log ERROR to module log and to files
                    LogServiceE(req.query.app_id, service_called, parameters, error).then(() => {
                        //return service unavailable and error message
                        return res.status(503).json({
                            message: error
                        });
                    });
                });
            });
    }
};
//backend for frontend without authorization
const BFF_noauth = async (req, res) =>{
    //check inparameters
    if (req.query.service.toUpperCase()=='BROADCAST' && 
        Buffer.from(req.query.parameters, 'base64').toString('utf-8').startsWith('/broadcast/connection/connect')){
            BFF(req,res);
        }
    else{
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    }
};
//backend for frontend auth with basic authorization and no middleware
const BFF_auth = async (req, res) =>{
    //check inparameters
    if (req.query.service.toUpperCase()=='AUTH' && req.headers.authorization.toUpperCase().startsWith('BASIC'))
        return BFF(req,res);
    else{
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    }
};
export{getApp, getReport, BFF, BFF_noauth, BFF_auth};