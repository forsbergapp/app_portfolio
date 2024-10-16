/** @module microservice/registry */


/**@type{import('../server/db/file.service.js')} */
const {fileFsRead} = await import(`file://${process.cwd()}/server/db/file.service.js`);

const CONFIG = await fileFsRead('CONFIG_MICROSERVICE').then((/**@type{import('../server/types.js').server_db_file_result_fileFsRead}*/file)=>file.file_content);

const CONFIG_SERVICES = await fileFsRead('CONFIG_MICROSERVICE_SERVICES').then((/**@type{import('../server/types.js').server_db_file_result_fileFsRead}*/file)=>file.file_content?file.file_content.SERVICES:null);

/**
 * Reads config services
 * @param {string} servicename
 * @returns {import('./types.js').microservice_config_service_record}
 */
const ConfigServices = (servicename) =>{
    return CONFIG_SERVICES.filter((/**@type{import('./types.js').microservice_config_service_record}*/service)=>service.NAME == servicename)[0];        
};

/**
 * 
 * @param {string} service 
 * @returns {Promise.<{ server:{createServer:function},
 *                      port:number,
 *                      options?:object}>}
 */
const MicroServiceServer = async (service) =>{
    const http = await import('node:http');
    const https = await import('node:https');
    const fs = await import('node:fs');

    const env_key_path = ConfigServices(service).HTTPS_KEY;
    const env_cert_path = ConfigServices(service).HTTPS_CERT;
   
    if (ConfigServices(service).HTTPS_ENABLE==1)
        return {
            server  : https,
            port	: ConfigServices(service).HTTPS_PORT,
            options : {
                key: env_key_path?await fs.promises.readFile(process.cwd() + env_key_path, 'utf8'):null,
                cert: env_key_path?await fs.promises.readFile(process.cwd() + env_cert_path, 'utf8'):null
            }
        };
    else
        return {
            server  : http,
            port 	: ConfigServices(service).PORT
        };
};

/**
 * 
 * @param {'GEOLOCATION'|'WORLDCITIES'|'MAIL'} service 
 * @returns {number}
 */
const microservice_api_version = service =>{
    /**@type{import('./types.js').microservice_config_service_record} */
    const config_service = ConfigServices(service);
    return config_service.CONFIG.filter((/**@type{*}*/row)=>'APP_REST_API_VERSION' in row)[0].APP_REST_API_VERSION;
}; 


export {CONFIG, ConfigServices, MicroServiceServer, microservice_api_version};