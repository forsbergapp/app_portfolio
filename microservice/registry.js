/** @module microservice/registry */

/**
 * @import {microservice_registry_service, server_db_document_config_microservice_services} from './types.js'
 */

/**@type{import('../server/db/ORM.js')} */
const ORM = await import(`file://${process.cwd()}/server/db/ORM.js`);

/**@type{server_db_document_config_microservice_services['SERVICES']} */
const REGISTRY_CONFIG_SERVICES = await ORM.Execute({app_id:0, 
                                                    dml:'GET',
                                                    object:'ConfigMicroserviceServices', 
                                                    get:{resource_id:null, partition:null}})
                                        .then((/**@type{server_db_document_config_microservice_services}*/file)=>file.SERVICES);

/**
 * @name registryConfigServices
 * @description Reads config services
 * @function
 * @param {microservice_registry_service} servicename
 * @returns {server_db_document_config_microservice_services['SERVICES'][0]}
 */
const registryConfigServices = servicename =>{
    return REGISTRY_CONFIG_SERVICES?.filter(service=>service.NAME == servicename)[0];        
};

/**
 * @name registryMicroServiceServer
 * @description Get microservice server port and http or https for given microservice
 * @function
 * @param {microservice_registry_service} service 
 * @returns {Promise.<{ server:{createServer:function},
 *                      port:number,
 *                      options?:object}>}
 */
const registryMicroServiceServer = async (service) =>{
    const http = await import('node:http');
    const https = await import('node:https');
    const fs = await import('node:fs');

    const env_key_path = registryConfigServices(service)?.HTTPS_KEY;
    const env_cert_path = registryConfigServices(service)?.HTTPS_CERT;
   
    if (registryConfigServices(service)?.HTTPS_ENABLE==1)
        return {
            server  : https,
            port	: registryConfigServices(service).HTTPS_PORT,
            options : {
                key: env_key_path?await fs.promises.readFile(process.cwd() + env_key_path, 'utf8'):null,
                cert: env_key_path?await fs.promises.readFile(process.cwd() + env_cert_path, 'utf8'):null
            }
        };
    else
        return {
            server  : http,
            port 	: registryConfigServices(service).PORT
        };
};

/**
 * @name registryMicroserviceApiVersion
 * @description Get microservice API version
 * @function
 * @param {microservice_registry_service} service 
 * @returns {number}
 */
const registryMicroserviceApiVersion = service =>registryConfigServices(service).CONFIG.filter((/**@type{*}*/row)=>'APP_REST_API_VERSION' in row)[0].APP_REST_API_VERSION;


export {registryConfigServices, registryMicroServiceServer, registryMicroserviceApiVersion};