/** @module server/db/OpenApi */

/**
 * @import {server} from '../types.js'
 */

const {server} = await import ('../server.js');

/**
 * @name get
 * @description OpenApi get
 * @function
 * @param {{app_id:number}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['OpenApi'] }}
 */
const get = parameters => {
    return {result:server.ORM.getObject(parameters.app_id, 'OpenApi',null, null), 
            type:'JSON'};
};
/**
 * @name getViewWithoutConfig
 * @description OpenApi get without #/components/parameters/config
 * @function
 * @param {{app_id:number}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['OpenApi'] }}
 */
const getViewWithoutConfig = parameters => {
    const openApi = server.ORM.getObject(parameters.app_id, 'OpenApi',null, null);
    openApi.components.parameters.config = '[AVAILABLE TO ADMIN]';
    return {result:openApi, 
            type:'JSON'};
};

export{ get,getViewWithoutConfig};