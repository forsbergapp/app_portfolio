/**
 * Microservice worldcities service
 * @module microservice/worldcities/service 
 */
/**
 * @import {microservice_config_service_record} from '../types.js'
 */
/**
 * @import {type_city} from './types.js'
 */
/**@type{import('../../microservice/registry.js')} */
const {registryConfigServices} = await import(`file://${process.cwd()}/microservice/registry.js`);

/**
 * Get file with cities 
 * @function
 * @returns {Promise.<type_city[]>}  
 */
const getService = async () => {
    const fs = await import('node:fs');
    /**@type{microservice_config_service_record}*/
    const config = registryConfigServices('WORLDCITIES');
    const fileBuffer = await fs.promises.readFile(`${process.cwd()}${config.PATH}worldcities.json`, 'utf8')
    .catch(error=>{throw error;});
    return JSON.parse(fileBuffer.toString());
};
/**
 * Get cities for given country
 * @function
 * @param {string|null} country 
 * @returns {Promise.<type_city[]>}
 */
const getCities = async (country) => {
    const cities = await getService();
    return cities.filter((item) => item.iso2 == country);
};
/**
 * Get random city
 * @function
 * @returns {Promise.<type_city>}
 */
const getCityRandom = async () => {
    const cities = await getService();
    return cities[Math.floor(Math.random() * cities.length - 1)];
};
/**
 * Get searched cities
 * Filters searched and limit records 
 * Searches without diacritics and uses lower case
 * Uses localcompare as collation method when sorting
 * @function
 * @param {string} search 
 * @param {number} limit 
 * @returns Promise.<type_city[]}>
 */
const getCitySearch = async (search, limit) => {
    /**@type{type_city[]} */
    let cities = await getService();
    /**
     * Filter searched and limit records 
     * Search without diacritics and use lower case
     * Uses localcompare as collation method when sorting
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
    cities = cities.filter((city)=>{if ((count_limit<limit || limit==0) && (match(city.city, search)||
                                                                            match(city.city_ascii, search)||
                                                                            match(city.country, search)||
                                                                            match(city.admin_name, search))){
                                        count_limit++;
                                        return true;
                                    }
                                    else
                                        return false;});
    //sort and return
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
export{getCities, getCityRandom, getCitySearch};