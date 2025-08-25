/** @module serviceregistry/microservice/registry */

/**
 * @import {microservice_registry_service, 
 *          server_db_table_ServiceRegistry} from '../server/types.js'
 */
const {ORM} = await import('../server/server.js');
/**
 * @name registryConfigServices
 * @description Reads config services
 * @function
 * @param {microservice_registry_service} servicename
 * @returns {Promise.<server_db_table_ServiceRegistry>}
 */
const registryConfigServices = async servicename =>
        ORM.db.ServiceRegistry.get(0,null).result.rows
            .filter((/**@type{server_db_table_ServiceRegistry}*/service)=>service.name == servicename)[0];


export {registryConfigServices};