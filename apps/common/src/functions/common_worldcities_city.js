/**
 * @module apps/common/src/functions/common_worldcities
*/

/**
 * @import {commonWorldCitiesCity} from '../../../../server/types.js'
 */

/**
 * @name appFunction
 * @description Get searched city from worldcities db
 *              Filters searched and limit records 
 *              Searches without diacritics and uses lower case
 *              Uses localcompare as collation method when sorting
 * @function
 * @param {number} app_id
 * @param {{search:string}} data
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
    /**@type{commonWorldCitiesCity[]} */
    let cities = await getFile();
    /**
     * Filter searched and limit records 
     * Search without diacritics and use lower case
     * @param {string} col 
     * @param {string} search 
     * @returns {boolean}
     */
    const match = (col, search) =>{
        const col_check = col.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        const search_check = search.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();            
        return col_check.search(search_check)>-1;
    };
    let count_limit = 0;
    /**@type{import('../../../../server/db/fileModelAppParameter.js')} */
    const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);
    /**@type{import('../../../../server/db/fileModelConfig.js')} */
    const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);
    /**@type{import('../../../../server/server.js')} */
    const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
    const common_app_id = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER','APP_COMMON_APP_ID')) ?? 0;
    const limit = serverUtilNumberValue(fileModelAppParameter.get({app_id:common_app_id, res:res})[0].common_app_limit_records.value) ?? 0;

    cities = cities.filter((city)=>{if ((count_limit<limit || limit==0) && (match(city.city, data.search)||
                                                                            match(city.city_ascii, data.search)||
                                                                            match(city.country, data.search)||
                                                                            match(city.admin_name, data.search))){
                                        count_limit++;
                                        return true;
                                    }
                                    else
                                        return false;});
    //sort and return
    //Uses localcompare as collation method when sorting
    return cities.sort((first, second)=>{
        const first_sort = first.country.toLowerCase() +  first.city.toLowerCase() + first.admin_name.toLowerCase();
        const second_sort = second.country.toLowerCase() + second.city.toLowerCase() + second.admin_name.toLowerCase();
        //using localeCompare as collation method
        if (first_sort.localeCompare(second_sort)<0 )
            return -1;
        else if (first_sort.localeCompare(second_sort)>0 )
            return 1;
        else
            return 0;
    });
};
export default appFunction;