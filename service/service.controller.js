const service = await import("./service.service.js");
const {ConfigGet, COMMON} = await import(`file://${process.cwd()}/server/server.service.js`);
const callService = async (req, res) => {
    //usage /service?parameters=[base64]
    //parameters content: 'app_id=[app_id]&service=[SERVICENAME]&lang_code=[LANG_CODE]&parameters=[BASE64]
    let decodedparameters = Buffer.from(req.query.parameters, 'base64').toString('utf-8');
    let query_parameters = '{';
    decodedparameters.split('&').forEach((parameter, index)=>{
        query_parameters += `"${parameter.split('=')[0]}": "${parameter.split('=')[1]}"`;
        if (index < decodedparameters.split('&').length - 1)
            query_parameters += ',';
    });
    query_parameters += '}';
    query_parameters = JSON.parse(query_parameters);
    ;
    /*
    required parameters
        req.query.app_id
        req.query.service        DB, GEOLOCATION, MAIL, REPORT, WORLDCITIES
        req.query.parameters
    optional parameters:
        req.query.lang_code
        req.query.user_account_id
        req.body.user_language
        req.body.user_timezone
        req.body.user_number_system
        req.body.user_platform
    */
    
    //check inparameters
    if (!query_parameters.app_id &&
        !query_parameters.service &&
        !req.parameters &&
        !req.headers.authorization)
        //required parameters not provided
        //use common app id to get message and use first lang_code form app or if missing use language in headers
        return res.status(401).send({
            message: '⛔'
        });
    else{
        let result_service;
        let url = req.protocol + ':/' + req.get('host');
        let log_result=false;
        
        //db, geolocation, mail, report, worldcities
        const rest_resource_service = ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE');
        const promise1 = new Promise((resolve, reject) => {
            try {
                switch (req.query.service.toLowerCase()){
                    case 'db':{
                        const rest_resource_service_db_schema = ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA');
                        let db_url = `${url}/${rest_resource_service}/db/${rest_resource_service_db_schema}${req.query.parameters}`;
                        switch (req.method){
                            //from app req.originalUrl:
                            //  '/service?parameters=[base64]
                            // parameters ex:
                            // /user_account/profile/id/[:param]?id=&app_id=[id]&lang_code=en'
                            case 'GET':{
                                resolve(service.url_request_get('https', db_url, req.headers.authorization));
                                break;
                            }
                            case 'POST':{
                                resolve(service.url_request_method('https', db_url, 'POST', req.headers.authorization, req.body));
                                break;
                            }
                            case 'PUT':{
                                resolve(service.url_request_method('https', db_url, 'PUT', req.headers.authorization, req.body));
                                break;
                            }
                            case 'PATCH':{
                                resolve(service.url_request_method('https', db_url, 'PATCH', req.headers.authorization, req.body));
                                break;
                            }
                            case 'DELETE':{
                                resolve(service.url_request_method('https', db_url, 'DELETE', req.headers.authorization, req.body));
                                break;
                            }
                            default:{
                                resolve('service DB GET, POST, PUT, PATCH or DELETE only');
                            }
                        }
                        break;
                    }
                    case 'geolocation':{
                        //from app req.originalUrl:
                        //  '/service?parameters=[base64]
                        // parameters ex:
                        // /ip/systemadmin?&app_id=[id]&lang_code=en
                        if (req.method=='GET')
                            resolve(service.url_request_get('https', `${url}/${rest_resource_service}/geolocation${req.query.parameters}`, req.headers.authorization));
                        else
                            resolve('service GEOLOCATION GET only');
                        break;
                    }
                    case 'mail':{
                        //from app req.originalUrl:
                        //  '/service?parameters=[base64]
                        // parameters ex:
                        // ?&app_id=[id]&lang_code=en
                        log_result = true;
                        if (req.method=='POST')
                            resolve(service.url_request_method('https', `${url}/${rest_resource_service}/mail${req.query.parameters}`, 'POST', req.headers.authorization, req.body));
                        else
                            resolve('service GEOLOCATION POST only')
                        break;
                    }
                    case 'report':{
                        //from app req.originalUrl:
                        //  '/service?parameters=[base64]
                        //from server
                        //decodes parameters app_id=[id]&service=REPORT&format=PDF and reportid=[base64]
                        //  ?reportid=YXBwX2lkPTImbW9kdWxlPXRpbWV0YWJsZS5odG1sJmlkPTE0JnNpZD0xOCZ0eXBlPTEmbGFuZ19jb2RlPWVzLXBlJmZvcm1hdD1IVE1MJnBzPUE0JmhmPTA='
                        if (req.method=='GET')
                            resolve(service.url_request_get('https', `${url}/${rest_resource_service}/report${req.query.parameters}`, req.headers.authorization));
                        else
                            resolve('service REPORT GET only')
                        break;
                    }
                    case 'worldcities':{
                        //from app req.originalUrl:
                        //  '/service?parameters=[base64]
                        // parameters ex:
                        // /[countrycode]?app_user_id=[id]&app_id=[id]&lang_code=en
                        if (req.method=='GET')
                            resolve(service.url_request_get('https', `${url}/${rest_resource_service}/worldcities${req.query.parameters}`, req.headers.authorization));
                        else
                            resolve('service WORLDCITIES GET only')
                        break;
                    }
                    default:{
                        resolve(`service ${req.query.service} does not exist`);
                    }
                }
            } catch (error) {
                reject(`service ${req.query.service} error: ${error}`);
            }
        });
            
        const promise2 = new Promise((resolve) => {
            setTimeout(resolve, 5000, 'timeout');
        });
        Promise.race([promise1, promise2])
        .then((result_service) => {
            //log INFO to module log and to files
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                createLogAppC(query_parameters.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                            `SERVICE ${query_parameters.service} ${log_result=true?log_result:''}`,
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
        .catch(error=>{
            //log ERROR to module log and to files
            import(`file://${process.cwd()}/server/log/log.service.js`).then(({createLogAppC}) => {
                createLogAppC(query_parameters.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_ERROR'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
                            `SERVICE ${query_parameters.service} error: ${error}`,
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