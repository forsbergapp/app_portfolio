/** @module serviceregistry/microservice/registry */

/**
 * @import {microservice_registry_service, 
 *          server_db_table_ServiceRegistry} from '../server/types.js'
 */

/**
 * @name registryConfigServices
 * @description Reads config services
 * @function
 * @param {microservice_registry_service} servicename
 * @returns {Promise.<server_db_table_ServiceRegistry>}
 */
const registryConfigServices = async servicename =>{
    const ORM = await import('../server/db/ORM.js');

    return await new Promise(resolve=>{
        ORM.Execute({app_id:0, 
            dml:'GET',
            object:'ServiceRegistry', 
            get:{resource_id:null, partition:null}})
        .then((/**@type{{rows:server_db_table_ServiceRegistry[]}}*/service)=>
                resolve(service.rows.filter(service=>service.name == servicename)[0]));
    });
};

/**
 * @name registryMicroserviceApiVersion
 * @description Get microservice API version
 * @function
 * @param {microservice_registry_service} service 
 * @returns {Promise.<number>}
 */
const registryMicroserviceApiVersion = async service =>(await registryConfigServices(service)).rest_api_version;


export {registryConfigServices, registryMicroserviceApiVersion};