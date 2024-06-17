/** @module server */

/**
 * Sends ISO 20022 error format
 * @param {import('../types.js').res} res 
 * @param {number} http 
 * @param {string|null} code 
 * @param {string|number|object|null} text 
 * @param {string|null} developer_text 
 * @param {string|null} more_info 
 * @returns {void}
 */
 const response_send_error = (res, http, code, text, developer_text, more_info) => {
    //ISO20022 error format
    const message = {error:{
                        http:http, 
                        code:code, 
                        text:text, 
                        developer_text:developer_text, 
                        more_info:more_info}};
    //remove statusMessage or [ERR_INVALID_CHAR] might occur and is moved to inside message
    res.statusMessage = '';
    res.status(http).send(message);
};
/**
 * Get number value from request key
 * returns number or null for numbers
 * so undefined and '' are avoided sending argument to service functions
 * @param {import('../types.js').req_id_number} param
 * @returns {number|null}
 */
 const getNumberValue = param => (param==null||param===undefined||param==='')?null:Number(param);


/**
 * Calculate responsetime
 * @param {import('../types.js').res} res
 * @returns {number}
 */
const responsetime = (res) => {
    const diff = process.hrtime(res.getHeader('X-Response-Time'));
    return diff[0] * 1e3 + diff[1] * 1e-6;
};    

/**
 * ES6 object with properties using concise method syntax
 */
const COMMON = {
    app_filename(/**@type{string}*/module){
        const from_app_root = ('file:///' + process.cwd().replace(/\\/g, '/')).length;
        return module.substring(from_app_root);
    },
    app_function(/**@type{import('../types.js').error_stack}*/stack){
        const e = stack.split('at ');
        let functionName;
        //loop from last to first
        //ES6 rest parameter to avoid mutating array
        for (const line of [...e].reverse()) {
            //ES6 startsWith and includes
            if ((line.startsWith('file')==false && 
                line.includes('node_modules')==false &&
                line.includes('node:internal')==false &&
                line.startsWith('Query')==false)||
                line.startsWith('router')){
                    functionName = line.split(' ')[0];
                    break;
            }
        }
        return functionName;
    },
    app_line(){
        /**@type {import('../types.js').error} */
        const e = new Error() || '';
        const frame = e.stack.split('\n')[2];
        const lineNumber = frame.split(':').reverse()[1];
        return lineNumber;
    }
};

/**
 * server Express
 * @async
 * @returns {Promise<import('../types.js').express>} app
 */
 const serverExpress = async () => {
    /**@type{import('./config.service.js')} */
    const {ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    /**@type{import('./log.service.js')} */
    const {LogRequestE} = await import(`file://${process.cwd()}/server/log.service.js`);

    const {default:express} = await import('express');
    const {default:compression} = await import('compression');
    
    /**@type{import('../types.js').express} */
    const app = express();
    //
    //MIDDLEWARES
    //
    //use compression for better performance
    const shouldCompress = (/**@type{import('../types.js').req}*/req) => {
        //exclude broadcast messages using socket
        if (req.headers.accept == 'text/event-stream')
            return false;
        else
            return true;
        };
    app.set('trust proxy', true);
    /**@ts-ignore */
    app.use(compression({ filter: shouldCompress }));
    // set JSON maximum size
    app.use(express.json({ limit: ConfigGet('SERVER', 'JSON_LIMIT') ?? ''}));
    
    //ROUTES MIDDLEWARE
    //apps
    /**@type{import('./bff.js')} */
    const { BFF_init, BFF_start, BFF_app, BFF_app_data, BFF_app_signup, BFF_app_access, BFF_admin, BFF_superadmin, BFF_systemadmin, BFF_socket, 
            BFF_iam_systemadmin, BFF_iam_admin, BFF_iam_user, BFF_iam_provider} = await import(`file://${process.cwd()}/server/bff.js`);
    //auth
    /**@type{import('./iam.js')} */
    const iam = await import(`file://${process.cwd()}/server/iam.js`);
    
    //ROUTES 
    //logs EventSource and response when closed, authenticates request and will end request if not passing controls, 
    //sets headers, returns disallow for robots.txt and empty favicon.ico
    app.route('*').all                          (BFF_init);
    
    //redirects naked domain, http to https if enabled and to admin subdomain if first time, responds to SSL verification if enabled
    app.route('*').get                          (BFF_start);
    
    //REST API 
    //URI syntax implemented:
    //https://[subdomain].[domain]/[backend for frontend (bff)]/[role authorization]/version/[resource collection/service]/[resource]/[optional resource id]?URI query
	//URI query: iam=[iam parameters base64 encoded]&parameters=[app parameters base64 encoded]
    app.route('/bff/app_data/v1*').all          (iam.AuthenticateIdToken,                   BFF_app_data);
    app.route('/bff/app_signup/v1*').post       (iam.AuthenticateIdTokenRegistration,       BFF_app_signup);
    app.route('/bff/app_access/v1*').all        (iam.AuthenticateAccessToken,               BFF_app_access);
    app.route('/bff/admin/v1*').all             (iam.AuthenticateAccessTokenAdmin,          BFF_admin);    
    app.route('/bff/superadmin/v1*').all        (iam.AuthenticateAccessTokenSuperAdmin,     BFF_superadmin);
    app.route('/bff/systemadmin/v1*').all       (iam.AuthenticateAccessTokenSystemAdmin,    BFF_systemadmin);
    app.route('/bff/socket/v1*').get            (iam.AuthenticateSocket,                    BFF_socket);
    app.route('/bff/iam_systemadmin/v1*').post  (iam.AuthenticateIAMSystemAdmin,            BFF_iam_systemadmin);
    app.route('/bff/iam_admin/v1*').post        (iam.AuthenticateIAMAdmin,                  BFF_iam_admin);
    app.route('/bff/iam_user/v1*').post         (iam.AuthenticateIAMUser,                   BFF_iam_user);
    app.route('/bff/iam_provider/v1*').post     (iam.AuthenticateIAMProvider,               BFF_iam_provider);
    
    //app asset, common asset, info page, report and app
    app.route('*').get                          (BFF_app);
    
    //ERROR LOGGING
    app.use((/**@type{import('../types.js').error}*/err,/**@type{import('../types.js').req}*/req,/**@type{import('../types.js').res}*/res, /**@type{function}*/next) => {
        LogRequestE(req, res.statusCode, res.statusMessage, responsetime(res), err).then(() => {
            next();
        });
    });
    return app;
};
/**
 * server routes
 * @param {import('../types.js').routesparameters} routesparameters
 * @async
 */
 const serverRoutes = async (routesparameters) =>{
    /**@type{import('../microservice/microservice.service.js')} */
    const {microservice_api_version, microserviceRequest}= await import(`file://${process.cwd()}/microservice/microservice.service.js`);

    //server app object
    /**@type{import('../apps/apps.js')} */
    const app = await import(`file://${process.cwd()}/apps/apps.js`);

    //server iam object
    /**@type{import('./iam.js')} */
    const iam = await import(`file://${process.cwd()}/server/iam.js`);

    //server iam service
    /**@type{import('./iam.service.js')} */
    const iam_service = await import(`file://${process.cwd()}/server/iam.service.js`);

    //server config object
    /**@type{import('./config.js')} */
    const config = await import(`file://${process.cwd()}/server/config.js`);
    //server config service
    /**@type{import('./config.service.js')} */
    const config_service = await import(`file://${process.cwd()}/server/config.service.js`);

    //server info object
    /**@type{import('./info.js')} */
    const info = await import(`file://${process.cwd()}/server/info.js`);
    
    //server log object
    /**@type{import('./log.js')} */
    const log = await import(`file://${process.cwd()}/server/log.js`);

    //server socket object
    /**@type{import('./socket.js')} */
    const socket = await import(`file://${process.cwd()}/server/socket.js`);

    /**@type{import('./db/components/database.js')} */
    const db_database = await import(`file://${process.cwd()}/server/db/components/database.js`);

    /**@type{import('./db/components/app.js')} */
    const db_app = await import(`file://${process.cwd()}/server/db/components/app.js`);

    /**@type{import('./db/components/app_category.js')} */
    const db_app_category = await import(`file://${process.cwd()}/server/db/components/app_category.js`);

    /**@type{import('./db/components/app_data_entity.js')} */
    const db_app_data_entity = await import(`file://${process.cwd()}/server/db/components/app_data_entity.js`);

    /**@type{import('./db/components/app_data_resource.js')} */
    const db_app_resource = await import(`file://${process.cwd()}/server/db/components/app_data_resource.js`);

    /**@type{import('./db/components/app_data_stat.js')} */
    const db_app_stat = await import(`file://${process.cwd()}/server/db/components/app_data_stat.js`);

    /**@type{import('./db/components/app_log.js')} */
    const db_app_log = await import(`file://${process.cwd()}/server/db/components/app_log.js`);

    /**@type{import('./db/components/app_object.js')} */
    const db_app_object = await import(`file://${process.cwd()}/server/db/components/app_object.js`);

    /**@type{import('./db/components/app_role.js')} */
    const db_app_role = await import(`file://${process.cwd()}/server/db/components/app_role.js`);

    /**@type{import('./db/components/app_setting.js')} */
    const db_app_setting = await import(`file://${process.cwd()}/server/db/components/app_setting.js`);

    /**@type{import('./db/components/country.js')} */
    const db_country = await import(`file://${process.cwd()}/server/db/components/country.js`);

    /**@type{import('./db/components/identity_provider.js')} */
    const db_identity_provider = await import(`file://${process.cwd()}/server/db/components/identity_provider.js`);

    /**@type{import('./db/components/locale.js')} */
    const db_locale = await import(`file://${process.cwd()}/server/db/components/locale.js`);
    
    /**@type{import('./db/components/user_account.js')} */
    const db_user_account = await import(`file://${process.cwd()}/server/db/components/user_account.js`);

    /**@type{import('./db/components/user_account_app.js')} */
    const db_user_account_app = await import(`file://${process.cwd()}/server/db/components/user_account_app.js`);

    /**@type{import('./db/components/user_account_app_data_post.js')} */
    const db_user_account_app_data_post = await import(`file://${process.cwd()}/server/db/components/user_account_app_data_post.js`);
    
    return new Promise((resolve, reject)=>{
        try {
            if (routesparameters.endpoint == 'APP' && routesparameters.method == 'GET'){
                //App route for app asset, common asset, app info page, app report (using query) and app
                const URI_query = routesparameters.route_path.startsWith('/app-reports')?routesparameters.url.substring(routesparameters.url.indexOf('?')):null;
                const app_query = URI_query?new URLSearchParams(URI_query):null;
                resolve(app.getAppMain(routesparameters.ip, routesparameters.host, routesparameters.user_agent, routesparameters.accept_language, routesparameters.url, app_query, routesparameters.res)
                        .catch(()=>{
                            //send minimal HTML with server error
                            routesparameters.res?.sendFile(`${process.cwd()}/server/servererror.html`);
                        }));
            }
            else{
                const resource_id_string = ':RESOURCE_ID';
                const URI_query = routesparameters.parameters;
                const URI_path = routesparameters.url.indexOf('?')>-1?routesparameters.url.substring(0, routesparameters.url.indexOf('?')):routesparameters.url;
                const app_query = URI_query?new URLSearchParams(URI_query):null;
                let resource_id_not_authorized = false;
                /**
                 * Returns resource id number from URI path
                 * @returns {number|null}
                 */
                const resource_id_get_number = () => getNumberValue(URI_path.substring(URI_path.lastIndexOf('/') + 1));
                /**
                 * Returns resource id string from URI path
                 * @returns {string|null}
                 */
                 const resource_id_get_string = () => URI_path.substring(URI_path.lastIndexOf('/') + 1);
                 /**
                  * Return message in ISO20022 format if result contains multi resources
                  * @param {*} result 
                  * @param {boolean} singleresource
                  */
                 const iso_return_message = (result, singleresource) =>{
                    //if singles resource or pagination then return result
                    if (singleresource || result.page_header)
                        return result;
                    else{
						result.list_header = {	total_count:	result.length,
                                                offset: 		getNumberValue(app_query?.get('offset'))?getNumberValue(app_query?.get('offset')):0,
                                                count:			getNumberValue(app_query?.get('limit')) ?? result.length
                                            };
                        return {list_header:result.list_header, rows:result};
                    }
                };
                /**
                 * 
                 * @param {string} url 
                 * @param {string} method 
                 * @param {'id'|'app_id'|null} resource_validate_type
                 * @param {string|number|null} resource_validate_value
                 * @param {boolean} required
                 * @param {number|null} resource_validate_app_data_app_id
                 * @param {boolean}  block_user_app_data_search
                 * @returns 
                 */
                const route = (url, method, resource_validate_type = null, resource_validate_value= null, required=false, resource_validate_app_data_app_id=null, block_user_app_data_search=false) =>{
                    //check matching route with or without parameter and if parameter is used and is required and requested resource id is missing then return false
                    if ((url.endsWith('/' + resource_id_string)?url.replace('/' + resource_id_string, URI_path.substring(URI_path.lastIndexOf('/'))):url) == URI_path && 
                        method == routesparameters.method && 
                        (required && URI_path.substring(URI_path.lastIndexOf('/') + 1) == '')==false &&
                        ((resource_validate_app_data_app_id && routesparameters.app_id ==resource_validate_app_data_app_id) ||resource_validate_app_data_app_id==null) &&
                        ((block_user_app_data_search && getNumberValue(app_query?.get('user_account_id'))==null && getNumberValue(app_query?.get('app_id'))==null) ||block_user_app_data_search==false))
                        if (resource_validate_type)
                            if (iam_service.AuthenticateResource({  app_id:routesparameters.app_id, 
                                                                    ip:routesparameters.ip, 
                                                                    authorization:routesparameters.authorization, 
                                                                    resource_id:resource_validate_value, 
                                                                    scope: 'USER',
                                                                    claim_key:resource_validate_type}))
                                return true;
                            else{
                                resource_id_not_authorized = true;
                                return false;
                            }
                        else
                            return true;
                    else
                        return false;
                };
                                
                /**
                 * @param {number} app_id
                 * @param {string} microservice_path 
                 * @param {string} microservice_query 
                 */
                const call_microservice = async (app_id, microservice_path, microservice_query) => {
                    //use app id, CLIENT_ID and CLIENT_SECRET for microservice IAM
                    const authorization = `Basic ${Buffer.from(     config_service.ConfigGetApp(app_id, app_id, 'SECRETS').CLIENT_ID + ':' + 
                                                                    config_service.ConfigGetApp(app_id, app_id, 'SECRETS').CLIENT_SECRET,'utf-8').toString('base64')}`;
                    return microserviceRequest(app_id == getNumberValue(config_service.ConfigGet('SERVER', 'APP_COMMON_APP_ID')), //if appid = APP_COMMON_APP_ID then admin
                                                microservice_path, 
                                                Buffer.from(microservice_query + `&app_id=${app_id}`).toString('base64'), 
                                                routesparameters.method,
                                                routesparameters.ip, 
                                                authorization, 
                                                routesparameters.user_agent, 
                                                routesparameters.accept_language, 
                                                routesparameters.body?routesparameters.body:null,
                                                routesparameters.endpoint == 'SERVER_APP')
                            .catch((/**@type{import('../types.js').error}*/error)=>{throw error;});
                };

                
                //using switch (true) pattern
                switch (true){
                    //server routes
                    case route(`/bff/app_data/v1/app/apps/${resource_id_string}`, 'GET'):{
                        resolve(app.getApps(routesparameters.app_id, resource_id_get_number(), app_query)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-socket/socket-status/${resource_id_string}`, 'GET', null, null, true):{
                        resolve(iso_return_message(socket.CheckOnline(
                                                    /**@ts-ignore */
                                                    resource_id_get_number()), 
                                                    true));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/app_object', 'GET'):{
                        resolve(db_app_object.getObjects(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/country', 'GET'):{
                        resolve(db_country.getCountries(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/identity_provider', 'GET'):{
                        resolve(db_identity_provider.getIdentityProviders(routesparameters.app_id)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/locale', 'GET'):{
                        resolve(db_locale.getLocales(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/app_settings', 'GET'):{
                        resolve(db_app_setting.getSettings(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/app_settings_display', 'GET'):{
                        resolve(db_app_setting.getSettingDisplayData(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, (app_query?.get('setting_type')!='' && app_query?.get('setting_type')!=null && app_query?.get('value')!='' && app_query?.get('value')!=null)) ));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account-activate/${resource_id_string}`, 'PUT', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.activate(routesparameters.app_id, 
                                /**@ts-ignore */
                                resource_id_get_number(), 
                                routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/user_account-forgot', 'POST'):{
                        resolve(db_user_account.forgot(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.host, routesparameters.body));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/user_account-profile-stat', 'GET'):{
                        resolve(db_user_account.getProfileStat(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account-profile-name/${resource_id_string}`, 'GET'):{
                        resolve(db_user_account.getProfile(routesparameters.app_id, null, resource_id_get_string(), routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body, routesparameters.res)
                                    .then(result=>iso_return_message(result, resource_id_get_string()!=null)));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account-profile/${resource_id_string}`, 'GET', null, null, false):{
                        resolve(db_user_account.getProfile(routesparameters.app_id, resource_id_get_number(), null, routesparameters.ip, routesparameters.user_agent, app_query, routesparameters.body, routesparameters.res)
                                    .then(result=>iso_return_message(result, (app_query?.get('search')=='' ||app_query?.get('search') == null))));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account_app_data_post/${resource_id_string}`, 'GET', null, null, true):{
                        resolve(db_user_account_app_data_post.getUserPostsByUserId(routesparameters.app_id, 
                                                                                    /**@ts-ignore */
                                                                                    resource_id_get_number(), 
                                                                                    app_query, routesparameters.res)
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account_app_data_post-profile-stat-like/${resource_id_string}`, 'GET', null, null, true):{
                        resolve(db_user_account_app_data_post.getProfileStatLike(routesparameters.app_id, 
                                                                                    /**@ts-ignore */
                                                                                    resource_id_get_number(), 
                                                                                    app_query, routesparameters.res)
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/user_account_app_data_post-profile/${resource_id_string}`, 'GET', null, null, true):{
                        resolve(db_user_account_app_data_post.getProfileUserPosts(routesparameters.app_id, 
                                                                                    /**@ts-ignore */
                                                                                    resource_id_get_number(), 
                                                                                    app_query, routesparameters.res)
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route('/bff/app_data/v1/server-db/user_account_app_data_post-profile-stat', 'GET'):{
                        resolve(db_user_account_app_data_post.getProfileStatPost(routesparameters.app_id, app_query, routesparameters.res)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }

                    case route(`/bff/app_data/v1/server-db/app_data_entity/${resource_id_string}`, 'GET', null, null, false, getNumberValue(app_query?.get('data_app_id'))):
                    case route(`/bff/admin/v1/server-db/app_data_entity/${resource_id_string}`, 'GET', null, null, false):{
                        resolve(db_app_data_entity.getEntity(routesparameters.app_id, resource_id_get_number(), app_query)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/app_data_entity_resource/${resource_id_string}`, 'GET', null, null, false, getNumberValue(app_query?.get('data_app_id'))):
                    case route(`/bff/admin/v1/server-db/server-db/app_data_entity_resource/${resource_id_string}`, 'GET', null, null, false):{
                        resolve(db_app_data_entity.getEntityResource(routesparameters.app_id, resource_id_get_number(), app_query)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/app_data_resource_master/${resource_id_string}`, 'GET', null, null, false, getNumberValue(app_query?.get('data_app_id')), true):{
                        resolve(db_app_resource.MasterGet(routesparameters.app_id, resource_id_get_number(), app_query, true)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/app_access/v1/app-function/${resource_id_string}`, 'POST', 'id', routesparameters.body.user_account_id, true):{
                        resolve(app.getFunction(routesparameters.app_id, 
                                                /**@ts-ignore */
                                                resource_id_get_string(), 
                                                routesparameters.body, 
                                                null,
                                                routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/app-function/${resource_id_string}`, 'GET', 'id', getNumberValue(app_query?.get('user_account_id')), true):{
                        resolve(app.getFunction(routesparameters.app_id, 
                                                /**@ts-ignore */
                                                resource_id_get_string(), 
                                                {user_account_id: getNumberValue(app_query?.get('user_account_id')),
                                                 data_app_id:     getNumberValue(app_query?.get('data_app_id')),
                                                 fields:          app_query?.get('fields'),
                                                }, 
                                                app_query?.get('lang_code'),
                                                routesparameters.res)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, 'GET', null, null, false):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_master/${resource_id_string}`, 'GET', 'id', getNumberValue(app_query?.get('user_account_id')), false, getNumberValue(app_query?.get('data_app_id'))):{
                        resolve(db_app_resource.MasterGet(routesparameters.app_id, resource_id_get_number(), app_query)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db/app_data_resource_master', 'POST', null, null, false):
                    case route('/bff/app_access/v1/server-db/app_data_resource_master', 'POST', 'id', routesparameters.body.user_account_id, false, routesparameters.body.data_app_id):{
                        resolve(db_app_resource.MasterPost(routesparameters.app_id, routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, 'PUT', null, null, routesparameters.body.data_app_id):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_master/${resource_id_string}`, 'PUT', 'id', routesparameters.body.user_account_id, true, routesparameters.body.data_app_id):{
                        resolve(db_app_resource.MasterUpdate(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_master/${resource_id_string}`, 'DELETE', null, null, true):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_master/${resource_id_string}`, 'DELETE', 'id', routesparameters.body.user_account_id, true, routesparameters.body.data_app_id):{
                        resolve(db_app_resource.MasterDelete(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(),
                                                            routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/app_data_resource_detail/${resource_id_string}`, 'GET', null, null, false, getNumberValue(app_query?.get('data_app_id')), true):{
                        resolve(db_app_resource.DetailGet(routesparameters.app_id, resource_id_get_number(), app_query, true)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, 'GET', null, null, false):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_detail/${resource_id_string}`, 'GET', 'id', getNumberValue(app_query?.get('user_account_id')), false, getNumberValue(app_query?.get('data_app_id'))):{
                        resolve(db_app_resource.DetailGet(routesparameters.app_id, resource_id_get_number(), app_query)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db/app_data_resource_detail', 'POST', null, null):
                    case route('/bff/app_access/v1/server-db/app_data_resource_detail', 'POST', 'id',  routesparameters.body.user_account_id, false, routesparameters.body.data_app_id):{
                            resolve(db_app_resource.DetailPost(routesparameters.app_id, routesparameters.body));
                            break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, 'PUT', null, null, true):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_detail/${resource_id_string}`, 'PUT', 'id', routesparameters.body.user_account_id, true, routesparameters.body.data_app_id):{
                        resolve(db_app_resource.DetailUpdate(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_detail/${resource_id_string}`, 'DELETE', null, null, true):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_detail/${resource_id_string}`, 'DELETE', 'id', routesparameters.body.user_account_id, true, routesparameters.body.data_app_id):{
                        resolve(db_app_resource.DetailDelete(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(),
                                                            routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_data/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, 'GET', null, null, false, getNumberValue(app_query?.get('data_app_id')), true):{
                        resolve(db_app_resource.DataGet(routesparameters.app_id, resource_id_get_number(), app_query, true)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, 'GET', null, null, false):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, 'GET', 'id', getNumberValue(app_query?.get('user_account_id')), true, getNumberValue(app_query?.get('data_app_id'))):{
                        resolve(db_app_resource.DataGet(routesparameters.app_id, resource_id_get_number(), app_query)
                                .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db/app_data_resource_detail_data', 'POST', null, null):
                    case route('/bff/app_access/v1/server-db/app_data_resource_detail_data', 'POST', 'id',  routesparameters.body.user_account_id, false, routesparameters.body.data_app_id):{
                            resolve(db_app_resource.DataPost(routesparameters.app_id, routesparameters.body));
                            break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, 'PUT', null, null, true):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, 'PUT', 'id', routesparameters.body.user_account_id, true, routesparameters.body.data_app_id):{
                        resolve(db_app_resource.DataUpdate(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, 'DELETE', null, null, true):
                    case route(`/bff/app_access/v1/server-db/app_data_resource_detail_data/${resource_id_string}`, 'DELETE', 'id', routesparameters.body.user_account_id, true, routesparameters.body.data_app_id):{
                        resolve(db_app_resource.DataDelete(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(),
                                                            routesparameters.body));
                        break;
                    }
                    case route('/bff/admin/v1/server-db/app_data_stat', 'GET', null, null, false):{
                        resolve(db_app_stat.get(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account-password/${resource_id_string}`, 'PATCH', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.updatePassword(routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id_get_number(), 
                                                                routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account/${resource_id_string}`, 'PATCH', 'id', resource_id_get_number(), true):
                    case route(`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, 'PATCH', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.updateUserLocal(routesparameters.app_id, 
                                                                /**@ts-ignore */ 
                                                                resource_id_get_number(), 
                                                                routesparameters.ip, routesparameters.user_agent, routesparameters.host, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account/${resource_id_string}`, 'GET', 'id', resource_id_get_number(), true):
                    case route(`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, 'GET', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.getUserByUserId(routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id_get_number(), 
                                                                app_query, routesparameters.res)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account-common/${resource_id_string}`, 'PATCH', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.updateUserCommon(routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id_get_number(), 
                                                                    app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account/${resource_id_string}`, 'DELETE', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.deleteUser(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account-profile-detail/${resource_id_string}`, 'GET', null, null, true):
                    case route(`/bff/app_access/v1/server-db/user_account-profile-detail/${resource_id_string}`, 'GET', null, null, true):{
                        resolve(db_user_account.getProfileDetail(routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id_get_number(), 
                                                                    app_query, routesparameters.res)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_follow/${resource_id_string}`, 'POST', 'id', resource_id_get_number(), true):
                    case route(`/bff/app_access/v1/server-db/user_account_follow/${resource_id_string}`, 'POST', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.follow(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_follow/${resource_id_string}`, 'DELETE', 'id', resource_id_get_number(), true):
                    case route(`/bff/app_access/v1/server-db/user_account_follow/${resource_id_string}`, 'DELETE', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.unfollow(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_like/${resource_id_string}`, 'POST', 'id', resource_id_get_number(), true):
                    case route(`/bff/app_access/v1/server-db/user_account_like/${resource_id_string}`, 'POST', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.like(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_like/${resource_id_string}`, 'DELETE', 'id', resource_id_get_number(), true):
                    case route(`/bff/app_access/v1/server-db/user_account_like/${resource_id_string}`, 'DELETE', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account.unlike(routesparameters.app_id, 
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        routesparameters.body));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_app/${resource_id_string}`, 'GET', 'id', resource_id_get_number(), true):
                    case route(`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, 'GET', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account_app.getUserAccountApp(routesparameters.app_id, 
                                                                        /**@ts-ignore */
                                                                        resource_id_get_number())
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app-apps/${resource_id_string}`, 'GET', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account_app.getUserAccountApps(routesparameters.app_id, 
                                                                        /**@ts-ignore */
                                                                        resource_id_get_number())
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db/user_account_app/${resource_id_string}`, 'PATCH', 'id', resource_id_get_number(), true):
                    case route(`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, 'PATCH', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account_app.update(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            app_query, routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app/${resource_id_string}`, 'DELETE', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account_app.deleteUserAccountApp(routesparameters.app_id, 
                                                                            /**@ts-ignore */
                                                                            resource_id_get_number(), 
                                                                            app_query));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post-profile-detail/${resource_id_string}`, 'GET', null, null, true):{
                        resolve(db_user_account_app_data_post.getProfileUserPostDetail(routesparameters.app_id, 
                                                                                        /**@ts-ignore */
                                                                                        resource_id_get_number(), 
                                                                                        app_query, routesparameters.res)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route('/bff/app_access/v1/server-db/user_account_app_data_post', 'POST', 'id', routesparameters.body.user_account_id):{
                        resolve(db_user_account_app_data_post.createUserPost(routesparameters.app_id, app_query, routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post/${resource_id_string}`, 'PUT', 'id', routesparameters.body.user_account_id, true):{
                        resolve(db_user_account_app_data_post.updateUserPost(routesparameters.app_id, resource_id_get_number(), app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post/${resource_id_string}`, 'DELETE', 'id', routesparameters.body.user_account_id, true):{
                        resolve(db_user_account_app_data_post.deleteUserPost(routesparameters.app_id, 
                                                                                /**@ts-ignore */
                                                                                resource_id_get_number(), 
                                                                                app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post_like/${resource_id_string}`, 'POST', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account_app_data_post.like(routesparameters.app_id, 
                                                                    /**@ts-ignore */
                                                                    resource_id_get_number(), 
                                                                    routesparameters.body));
                        break;
                    }
                    case route(`/bff/app_access/v1/server-db/user_account_app_data_post_like/${resource_id_string}`, 'DELETE', 'id', resource_id_get_number(), true):{
                        resolve(db_user_account_app_data_post.unlike(routesparameters.app_id, 
                                                                        /**@ts-ignore */
                                                                        resource_id_get_number(), 
                                                                        routesparameters.body));
                        break;
                    }
                    case route('/bff/admin/v1/server-socket/message', 'POST'):{
                        resolve(socket.SocketSendAdmin(routesparameters.body));
                        break;
                    }
                    case route('/bff/admin/v1/server-socket/socket-stat', 'GET'):{
                        resolve(iso_return_message(socket.ConnectedCount(app_query), true));
                        break;
                    }
                    case route('/bff/admin/v1/server-socket/socket', 'GET'):{
                        resolve(socket.ConnectedListAdmin(routesparameters.app_id, app_query)
                                .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/database-demo', 'POST'):{
                        resolve(db_database.DemoInstall(routesparameters.app_id, app_query, routesparameters.body));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/database-demo', 'DELETE'):{
                        resolve(db_database.DemoUninstall(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('/bff/admin/v1/app_admin/apps', 'GET'):{
                        resolve(app.getAppsAdmin(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route(`/bff/admin/v1/server-db_admin/apps/${resource_id_string}`, 'PUT', null, null, true):{
                        resolve(db_app.updateAdmin( routesparameters.app_id, 
                                                    /**@ts-ignore */
                                                    resource_id_get_number(), 
                                                    routesparameters.body)
                                    .then(result=>iso_return_message(result, resource_id_get_number()!=null)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/app_category', 'GET'):{
                        resolve(db_app_category.getAppCategoryAdmin(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/app_log', 'GET'):{
                        resolve(db_app_log.getLogsAdmin(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/app_log-stat', 'GET'):{
                        resolve(db_app_log.getStatUniqueVisitorAdmin(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/app_role', 'GET'):{
                        resolve(db_app_role.getAppRoleAdmin(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/user_account-stat', 'GET'):{
                        resolve(db_user_account.getStatCountAdmin(routesparameters.app_id)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/user_account', 'GET'):{
                        resolve(db_user_account.getUsersAdmin(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/admin/v1/server-db_admin/user_account_logon', 'GET'):{
                        resolve(db_user_account.getLogonAdmin(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route(`/bff/superadmin/v1/server-db_admin/user_account/${resource_id_string}`, 'PATCH', null, null, true):{
                        resolve(db_user_account.updateAdmin(routesparameters.app_id, 
                                                            /**@ts-ignore */
                                                            resource_id_get_number(), 
                                                            app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-socket/message', 'POST'):{
                        resolve(socket.SocketSendSystemAdmin(routesparameters.body));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-socket/socket', 'GET'):{
                        resolve(socket.ConnectedListSystemadmin(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route(`/bff/admin/v1/server-config/config-apps-parameter/${resource_id_string}`, 'PATCH', null, null, true):{
                        resolve(config.ConfigAppParameterUpdate(routesparameters.app_id, 
                                                                /**@ts-ignore */
                                                                resource_id_get_number(), 
                                                                routesparameters.body));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-config/config-apps/${resource_id_string}`, 'GET'):
                    case route(`/bff/admin/v1/server-config/config-apps/${resource_id_string}`, 'GET'):{
                        resolve(iso_return_message(config.ConfigGetApps(
                                                        /**@ts-ignore */
                                                        resource_id_get_number(), 
                                                        app_query), 
                                                        resource_id_get_number()!=null));
                        break;
                    }
                    case route(`/bff/admin/v1/server-config/config/${resource_id_string}`, 'GET', null, null, true):
                    case route(`/bff/systemadmin/v1/server-config/config/${resource_id_string}`, 'GET', null, null, true):{
                        resolve(config.ConfigFileGet(
                                                        /**@ts-ignore */
                                                        resource_id_get_string(), 
                                                        app_query)
                                    .then(result=>iso_return_message(result, resource_id_get_string()!=null)));
                        break;
                    }
                    case route(`/bff/systemadmin/v1/server-config/config/${resource_id_string}`, 'PUT', null,null, true):{
                        resolve(config.ConfigFileSave(
                                                        /**@ts-ignore */
                                                        resource_id_get_string(), 
                                                        routesparameters.body));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server/info', 'GET'):{
                        resolve(info.Info()
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-db_admin/database-installation', 'GET'):{
                        resolve(db_database.InstalledCheck(routesparameters.app_id)
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-db_admin/database-space', 'GET'):{
                        resolve(db_database.InfoSpace(routesparameters.app_id)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-db_admin/database-spacesum', 'GET'):{
                        resolve(db_database.InfoSpaceSum(routesparameters.app_id)
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-db_admin/database', 'GET'):{
                        resolve(db_database.Info(routesparameters.app_id)
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-db_admin/database', 'POST'):{
                        resolve(db_database.Install(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-db_admin/database', 'DELETE'):{
                        resolve(db_database.Uninstall(routesparameters.app_id, app_query));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-log/log', 'GET'):{
                        resolve(log.getLogs(routesparameters.app_id, app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server/info-statuscode', 'GET'):{
                        resolve(log.getStatusCodes()
                                    .then(result=>iso_return_message(result, true)));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-log/log-stat', 'GET'):{
                        resolve(log.getLogStats(app_query)
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/systemadmin/v1/server-log/log-files', 'GET'):{
                        resolve(log.getFiles()
                                    .then(result=>iso_return_message(result, false)));
                        break;
                    }
                    case route('/bff/socket/v1/server-socket/socket', 'GET'):{
                        //EventSource uses GET method, should otherwise be POST
                        resolve(socket.SocketConnect(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.res));
                        break;
                    }
                    case route('/bff/app_signup/v1/server-db/user_account-signup', 'POST'):{
                        resolve(db_user_account.signup(routesparameters.app_id, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('/bff/iam_systemadmin/v1/server-iam/login', 'POST'):{
                        resolve(iam.AuthenticateSystemadmin(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.authorization, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.res));
                        break;
                    }
                    case route('/bff/iam_admin/v1/server-iam/login', 'POST'):
                    case route('/bff/iam_user/v1/server-iam/login', 'POST'):{
                        resolve(db_user_account.login(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route(`/bff/iam_provider/v1/server-iam/login/${resource_id_string}`, 'POST', null, null, true):{
                        resolve(db_user_account.login_provider( routesparameters.app_id, routesparameters.res.req.query.iam, 
                                                                /**@ts-ignore */
                                                                resource_id_get_number(), 
                                                                routesparameters.ip, routesparameters.user_agent, routesparameters.accept_language, app_query, routesparameters.body, routesparameters.res));
                        break;
                    }
                    case route('/bff/app_data/v1/server-iam/user/logoff', 'POST'):{
                        resolve(socket.ConnectedUpdate(routesparameters.app_id, routesparameters.res.req.query.iam, routesparameters.ip,routesparameters.user_agent, routesparameters.accept_language, routesparameters.res));
                        break;
                    }
                    //microservice routes
                    //changes URI to call microservices, syntax:
                    //[microservice protocol]://[microservice host]:[microservice port]/[service]/v[microservice API version configured for each service][resource]/[optional resource id]?[base64 encoded URI query];
                    case route('/bff/app_data/v1/geolocation/ip', 'GET') ||
                        (routesparameters.endpoint.startsWith('SERVER') && routesparameters.route_path=='/geolocation/ip'):{
                        if (getNumberValue(config_service.ConfigGet('SERVICE_IAM', 'ENABLE_GEOLOCATION'))==1){
                            const params = URI_query.split('&');
                            //set ip from client in case ip query parameter is missing
                            //if ip parameter does not exist
                            if (params.filter(parm=>parm.includes('ip=')).length==0 )
                                params.push(`ip=${routesparameters.ip}`);
                            else{
                                //if empty ip parameter
                                if (params.filter(parm=>parm == 'ip=').length==1)
                                    params.map(parm=>parm = parm.replace('ip=', `ip=${routesparameters.ip}`));
                            }
                            resolve(call_microservice(  routesparameters.app_id,
                                                `/geolocation/v${microservice_api_version('GEOLOCATION')}${routesparameters.route_path}`, 
                                                `${params.reduce((param_sum,param)=>param_sum += '&' + param)}`));
                        }   
                        else
                            return resolve('');
                        break;
                    }
                    case route('/bff/app_data/v1/geolocation/place', 'GET'):{
                        resolve(call_microservice(  routesparameters.app_id,`/geolocation/v${microservice_api_version('GEOLOCATION')}${routesparameters.route_path}`, URI_query));
                        break;
                    }
                    case route('/bff/app_data/v1/worldcities/city', 'GET'):{
                        resolve(call_microservice(  routesparameters.app_id,
                                                    `/worldcities/v${microservice_api_version('WORLDCITIES')}${routesparameters.route_path}`, 
                                                    URI_query + `&limit=${getNumberValue(config_service.ConfigGetApp(routesparameters.app_id, 
                                                    getNumberValue(config_service.ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_LIMIT_RECORDS' in parameter)[0].APP_LIMIT_RECORDS)}`));
                        break;
                    }
                    case route('/bff/app_data/v1/worldcities/city-random', 'GET')||
                        (routesparameters.endpoint.startsWith('SERVER') && routesparameters.route_path=='/worldcities/city-random'):{
                        resolve(call_microservice(  routesparameters.app_id, `/worldcities/v${microservice_api_version('WORLDCITIES')}${routesparameters.route_path}`, URI_query));
                        break;
                    }
                    case route(`/bff/app_data/v1/worldcities/country/${resource_id_string}`, 'GET'):{
                        resolve(call_microservice(  routesparameters.app_id, `/worldcities/v${microservice_api_version('WORLDCITIES')}${routesparameters.route_path}`, URI_query));
                        break;
                    }
                    case routesparameters.route_path=='/mail/sendemail' && routesparameters.endpoint.startsWith('SERVER'):{
                        //mail can only be sent from server
                        resolve(call_microservice(  routesparameters.app_id, `/mail/v${microservice_api_version('MAIL')}${routesparameters.route_path}`, URI_query));
                        break;
                    }
                    default:{
                        
                        if (resource_id_not_authorized){
                            routesparameters.res.statusMessage = 'resource id not authorized';
                            routesparameters.res.statusCode =401;
                        }
                        else{
                            routesparameters.res.statusMessage = `route not found: ${routesparameters.endpoint} ${URI_path} ${routesparameters.method}`;
                            routesparameters.res.statusCode =404;
                        }
                        reject('⛔');
                        break;
                    }
                }
            }
        } catch (error) {
            reject(error);
        }
    });
 };

/**
 * server start
 * @async
 */
const serverStart = async () =>{
    /**@type{import('./db/components/database.js')} */
    const database = await import(`file://${process.cwd()}/server/db/components/database.js`);
    /**@type{import('./config.service.js')} */
    const {InitConfig, ConfigGet} = await import(`file://${process.cwd()}/server/config.service.js`);
    /**@type{import('./socket.service.js')} */
    const {SocketCheckInterval} = await import(`file://${process.cwd()}/server/socket.service.js`);
    /**@type{import('./log.service.js')} */
    const {LogServerI, LogServerE} = await import(`file://${process.cwd()}/server/log.service.js`);

    const fs = await import('node:fs');
    const http = await import('node:http');
    const https = await import('node:https');

    process.env.TZ = 'UTC';
    process.on('uncaughtException', (err) =>{
        console.log(err);
        LogServerE('Process uncaughtException: ' + err.stack);
    });
    process.on('unhandledRejection', (reason) =>{
        console.log(reason);
        LogServerE('Process unhandledRejection: ' + reason);
    });
    try {
        await InitConfig();
        await database.Start();
        //Get express app with all configurations
        /**@type{import('../types.js').express}*/
        const app = await serverExpress();
        SocketCheckInterval();
        //START HTTP SERVER
        /**@ts-ignore*/
        http.createServer(app).listen(ConfigGet('SERVER', 'HTTP_PORT'), () => {
            LogServerI('HTTP Server up and running on PORT: ' + ConfigGet('SERVER', 'HTTP_PORT')).then(() => {
                null;
            });
        });
        if (ConfigGet('SERVER', 'HTTPS_ENABLE')=='1'){
            //START HTTPS SERVER
            //SSL files for HTTPS
            const HTTPS_KEY = await fs.promises.readFile(process.cwd() + ConfigGet('SERVER', 'HTTPS_KEY'), 'utf8');
            const HTTPS_CERT = await fs.promises.readFile(process.cwd() + ConfigGet('SERVER', 'HTTPS_CERT'), 'utf8');
            const options = {
                key: HTTPS_KEY.toString(),
                cert: HTTPS_CERT.toString()
            };
            /**@ts-ignore*/
            https.createServer(options,  app).listen(ConfigGet('SERVER', 'HTTPS_PORT'), () => {
                LogServerI('HTTPS Server up and running on PORT: ' + ConfigGet('SERVER', 'HTTPS_PORT')).then(() => {
                    null;
                });
            });            
        }
    } catch (/**@type{import('../types.js').error}*/error) {
        LogServerE('serverStart: ' + error.stack);
    }
    
};

export {COMMON, response_send_error, getNumberValue, responsetime, serverRoutes, serverStart };