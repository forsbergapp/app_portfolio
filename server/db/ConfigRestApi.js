/** @module server/db/ConfigRestApi */

/**
 * @import {server_server_response,server_db_document_ConfigRestApi} from '../types.js'
 */

const {ORM} = await import ('../server.js');

/**
 * @name get
 * @description ConfigRestApi get
 * @function
 * @param {{app_id:number}} parameters
 * @returns {server_server_response & {result?:server_db_document_ConfigRestApi }}
 */
const get = parameters => {
    return {result:ORM.getObject(parameters.app_id, 'ConfigRestApi',null, null), 
            type:'JSON'};
};

export{ get};