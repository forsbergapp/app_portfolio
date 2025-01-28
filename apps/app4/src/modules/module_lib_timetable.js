/**
 * @module apps/app4/src/modules/module_timetable_lib
 */

/**
 * @import {server_server_response} from '../../../../server/types.js'
 */

/**
 * @name moduleTimetableLib
 * @description Module timetable
 * @function
 * @param {{app_id:number,
 *          data:*,
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response>}
 */
const moduleTimetableLib = async parameters =>{
    /**@ts-ignore */
    const path = import.meta.dirname.replaceAll('\\', '/');
    
    return {sendfile:`${path.replace('/modules','/report')}/lib_timetable.js`,type:'JS'};
};

export default moduleTimetableLib;