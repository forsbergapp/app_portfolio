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

export{ get};