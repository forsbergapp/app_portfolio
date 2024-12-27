/**
 * @module apps/common/src/functions/common_worldcities
*/

/**
 * @import {commonWorldCitiesCity} from '../../../../server/types.js'
 */

/**
 * @name appFunction
 * @description Get cities for given country from worldcities db
 * @function
 * @param {number} app_id
 * @param {{country:string}} data
 * @param {string} user_agent
 * @param {string} ip
 * @param {string} locale
 * @param {import('../../../../server/types.js').server_server_res} res
 * @returns {Promise.<commonWorldCitiesCity[]>}
 */
const appFunction = async (app_id, data, user_agent, ip, locale, res) =>{
    const fs = await import('node:fs');
    res;
    /**
     *  Get file
     * @returns {Promise.<commonWorldCitiesCity[]>}
     */
    const getFile = async () =>{
        /**@ts-ignore */
        const PATH = `${import.meta.dirname.replaceAll('\\', '/')}/worldcities`;
        const FILE = 'worldcities.json';
        return fs.promises.readFile(`${PATH}/${FILE}`, 'utf8').then(file=>JSON.parse(file.toString()));
    };
    return await getFile().then(cities=>cities.filter((item) => item.iso2 == data.country));
    
};
export default appFunction;