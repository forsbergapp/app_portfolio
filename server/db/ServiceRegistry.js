/** @module server/db/ServiceRegistry */

/**
 * @import {server_server_response,
 *          server_db_table_ServiceRegistry} from '../types.js'
 */

const ORM = await import('./ORM.js');

/**
 * @name get
 * @description Get record
 * @function
 * @param {{app_id:number,
 *          resource_id:number|null,
 *          data:{  name:string|null}}} parameters
 * @returns {server_server_response & {result?:server_db_table_ServiceRegistry[] }}
 */
const get = parameters =>{
    const result = ORM.getObject(parameters.app_id, 'ServiceRegistry',parameters.resource_id, null).rows
                    .filter((/**@type{server_db_table_ServiceRegistry}*/row)=>
                        row.name == (parameters.data.name ?? row.name ));
    if (result.length>0 || parameters.resource_id==null)
        return {result:result, type:'JSON'};
    else
        return ORM.getError(parameters.app_id, 404);
};

export {get};