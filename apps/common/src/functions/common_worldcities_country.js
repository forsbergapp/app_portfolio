/**
 * @module apps/common/src/functions/common_worldcities
*/

/**
 * @import {server_server_response,commonWorldCitiesCity} from '../../../../server/types.js'
 */

/**
 * @name appFunction
 * @description Get cities for given country from worldcities db
 *              Returns records in base64 format to avoid records limit
 *              Data key contains:
 *              commonWorldCitiesCity[]
 * @function
 * @param {{app_id:number,
 *          data:{country:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:{data:string}[]}>}
 */
const appFunction = async parameters =>{
    const fs = await import('node:fs');
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
    return {result:[{data:Buffer.from (JSON.stringify(await getFile().then(cities=>cities.filter((item) => item.iso2 == parameters.data.country)))).toString('base64')}], type:'JSON'};
    
};
export default appFunction;