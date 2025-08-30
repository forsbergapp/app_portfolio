/** @module serviceregistry/microservice/registry */

/**
 * @import {microservice_registry_service, 
 *          server_db_table_ServiceRegistry} from '../server/types.js'
 */
const {server} = await import('../server/server.js');
/**
 * @name registryConfigServices
 * @description Reads config services
 * @function
 * @param {microservice_registry_service} servicename
 * @returns {Promise.<server_db_table_ServiceRegistry>}
 */
const registryConfigServices = async servicename =>
        server.ORM.db.ServiceRegistry.get({app_id:0,resource_id:null, data:{name:servicename}}).result[0];

export {registryConfigServices};