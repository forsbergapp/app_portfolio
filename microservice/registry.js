/** @module microservice/registry */

/**
 * @import {server_db_file_result_fileFsRead} from '../server/types.js'
 * @import {microservice_config_service_record} from './types.js'
 */

/**@type{import('../server/db/file.js')} */
const {fileFsRead} = await import(`file://${process.cwd()}/server/db/file.js`);

const REGISTRY_CONFIG = await fileFsRead('CONFIG_MICROSERVICE').then((/**@type{server_db_file_result_fileFsRead}*/file)=>file.file_content);

const REGISTRY_CONFIG_SERVICES = await fileFsRead('CONFIG_MICROSERVICE_SERVICES').then((/**@type{server_db_file_result_fileFsRead}*/file)=>file.file_content?file.file_content.SERVICES:null);

/**
 * Reads config services
 * @function
 * @param {string} servicename
 * @returns {microservice_config_service_record}
 */
const registryConfigServices = (servicename) =>{
    return REGISTRY_CONFIG_SERVICES.filter((/**@type{microservice_config_service_record}*/service)=>service.NAME == servicename)[0];        
};

/**
 * Get microservice server port and http or https for given microservice
 * @function
 * @param {string} service 
 * @returns {Promise.<{ server:{createServer:function},
 *                      port:number,
 *                      options?:object}>}
 */
const registryMicroServiceServer = async (service) =>{
    const http = await import('node:http');
    const https = await import('node:https');
    const fs = await import('node:fs');

    const env_key_path = registryConfigServices(service).HTTPS_KEY;
    const env_cert_path = registryConfigServices(service).HTTPS_CERT;
   
    if (registryConfigServices(service).HTTPS_ENABLE==1)
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
 * Get microservice API version
 * @function
 * @param {'GEOLOCATION'|'WORLDCITIES'|'MAIL'} service 
 * @returns {number}
 */
const registryMicroserviceApiVersion = service =>{
    /**@type{microservice_config_service_record} */
    const config_service = registryConfigServices(service);
    return config_service.CONFIG.filter((/**@type{*}*/row)=>'APP_REST_API_VERSION' in row)[0].APP_REST_API_VERSION;
}; 


export {REGISTRY_CONFIG, registryConfigServices, registryMicroServiceServer, registryMicroserviceApiVersion};