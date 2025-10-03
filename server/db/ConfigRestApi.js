/** @module server/db/ConfigRestApi */

/**
 * @import {server} from '../types.js'
 */

const {server} = await import ('../server.js');

/**
 * @name get
 * @description ConfigRestApi get
 * @function
 * @param {{app_id:number}} parameters
 * @returns {server['server']['response'] & {result?:server['ORM']['Object']['ConfigRestApi'] }}
 */
const get = parameters => {
    return {result:server.ORM.getObject(parameters.app_id, 'ConfigRestApi',null, null), 
            type:'JSON'};
};

export{ get};