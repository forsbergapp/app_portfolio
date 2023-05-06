const service = await import("./service.service.js");
const {ConfigGet, COMMON} = await import(`file://${process.cwd()}/server/server.service.js`);
const circuitbreak = new service.CircuitBreaker();
const { check_internet } = await import(`file://${process.cwd()}/server/auth/auth.controller.js`);
const callService = async (req, res) => {
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
        //usage /service?parameters=[base64]
        //parameters content: 'app_id=[app_id]&service=[SERVICENAME]&lang_code=[LANG_CODE]&parameters=[BASE64]
        let stack = new Error().stack;
        let decodedparameters = Buffer.from(req.query.parameters, 'base64').toString('utf-8');
        let url = req.protocol + '://' + req.get('host');
        let log_result=false;
        const rest_resource_service = ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE');
        const service_called = req.query.service.toUpperCase();
        let result_internet = await check_internet(req);
        // called from app req.originalUrl: '/service?parameters=[base64]
        const callServiceResult = async () => {
            return new Promise((resolve, reject) => {
                try {
                    switch (service_called){
                        case 'DB':{
                            const rest_resource_service_db_schema = ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA');
                            let db_url = `${url}${rest_resource_service}/db/${rest_resource_service_db_schema}${decodedparameters}`;
                            switch (req.method){
                                // parameters ex:
                                // /user_account/profile/id/[:param]?id=&app_id=[id]&lang_code=en'
                                case 'GET':
                                case 'POST':
                                case 'PUT':
                                case 'PATCH':
                                case 'DELETE':{
                                    resolve(circuitbreak.callService('https', db_url, service_called, req.method, req.headers.authorization, req.headers["accept-language"], req.body));
                                    break;
                                }
                                default:{
                                    resolve('service DB GET, POST, PUT, PATCH or DELETE only');
                                }
                            }
                            break;
                        }
                        case 'GEOLOCATION':{
                            // parameters ex:
                            // /ip?app_id=[id]&lang_code=en
                            // /place?latitude[latitude]&longitude=[longitude]
                            if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' && result_internet==1){
                                if (req.method=='GET')
                                    resolve(circuitbreak.callService('https', `${url}${rest_resource_service}/geolocation${decodedparameters}`, service_called, req.method, req.headers.authorization, req.headers["accept-language"], req.body));
                                else
                                    resolve('service GEOLOCATION GET only');
                            }
                            else
                                resolve();
                            break;

                        }
                        case 'MAIL':{
                            // parameters ex:
                            // ?&app_id=[id]&lang_code=en
                            log_result = true;
                            if (req.method=='POST')
                                resolve(circuitbreak.callService('https', `${url}${rest_resource_service}/mail${decodedparameters}`, service_called, req.method, req.headers.authorization, req.headers["accept-language"], req.body));
                            else
                                resolve('service MAIL POST only')
                            break;
                        }
                        case 'REPORT':{
                            // parameter ex
                            // app_id=[id]&service=REPORT&reportid=[base64]
                            // decode
                            // ?reportid=[base64]
                            // req.headers.authorization not used for this service
                            //check if maintenance
                            if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
                                import(`file://${process.cwd()}/apps/apps.service.js`).then(({getMaintenance}) => {
                                    const app = getMaintenance(req.query.app_id,
                                                                null,
                                                                null,
                                                                null)
                                    .then((app_result) => {
                                        resolve(app_result);
                                    });
                                })
                            }
                            else
                                if (req.method=='GET')
                                    resolve(circuitbreak.callService('https', `${url}${rest_resource_service}/report${decodedparameters}`, service_called, req.method, req.headers.authorization, req.headers["accept-language"], req.body));
                                else
                                    resolve('service REPORT GET only')
                            break;
                        }
                        case 'WORLDCITIES':{
                            //from app req.originalUrl:
                            //  '/service?parameters=[base64]
                            // parameters ex:
                            // /[countrycode]?app_user_id=[id]&app_id=[id]&lang_code=en
                            if (req.method=='GET')
                                resolve(circuitbreak.callService('https', `${url}${rest_resource_service}/worldcities${decodedparameters}`, service_called, req.method, req.headers.authorization, req.headers["accept-language"], req.body));
                            else
                                resolve('service WORLDCITIES GET only')
                            break;
                        }
                        default:{
                            resolve(`service ${req.query.service} does not exist`);
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            })
        }
        callServiceResult()
        .then(result_service => {
            //log INFO to module log and to files
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                            `SERVICE ${service_called} ${log_result==true?log_result:''}`,
                            req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                            res.statusCode, 
                            req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                    if (log_result)
                        return res.status(200).send();
                    else
                        res.send(result_service);
                })
            });
        })
        .catch(error => {
            //log ERROR to module log and to files
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                            `SERVICE ${service_called} error: ${error}`,
                            req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                            res.statusCode, 
                            req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
                    //return service unavailable and error message
                    return res.status(503).json(
                        error
                    );
                })
            });
        })
    }
}		
export{callService};