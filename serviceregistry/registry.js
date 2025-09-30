/** @module serviceregistry/microservice/registry */

/**
 * @import {server} from '../server/types.js'
 */
const {server} = await import('../server/server.js');
/**
 * @name registryConfigServices
 * @description Reads config services
 * @function
 * @param {server['serviceregistry']['microservice_local_config']['name']} servicename
 * @returns {Promise.<server['ORM']['ServiceRegistry']>}
 */
const registryConfigServices = async servicename =>
        server.ORM.db.ServiceRegistry.get({app_id:0,resource_id:null, data:{name:servicename}}).result[0];

export {registryConfigServices};