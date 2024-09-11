/**
 * @module apps/app2/src/modules/module_praytimes
 */

/**
 * @param {number} app_id
 * @param {*} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../types.js').server_server_res} res
 * @returns {Promise.<string>}
 */
const module_praytimes = async (app_id, data, user_agent, ip, locale, res) =>{
    /**@ts-ignore */
    const path = import.meta.dirname.replaceAll('\\', '/');   
    return `${path.replace('/modules','/report')}/lib_PrayTimes.js`;
};

export default module_praytimes;