/**
 * @module apps/app2/src/modules/module_timetable_lib
 */

/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<string>}
 */
const module_timetable_lib = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@ts-ignore */
    const path = import.meta.dirname.replaceAll('\\', '/');
    
    return `${path.replace('/modules','/report')}/lib_timetable.js`;
};

export default module_timetable_lib;