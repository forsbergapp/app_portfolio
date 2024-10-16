/** @module microservice/worldcities/service */

/**@type{import('../../microservice/registry.js')} */
const {ConfigServices} = await import(`file://${process.cwd()}/microservice/registry.js`);

/**
 * Get file with cities 
 * @returns {Promise.<import('./types.js').type_city[]>}  
 */
const getService = async () => {
    const fs = await import('node:fs');
    /**@type{import('../types.js').microservice_config_service_record}*/
    const config = ConfigServices('WORLDCITIES');
    const fileBuffer = await fs.promises.readFile(`${process.cwd()}${config.PATH}worldcities.json`, 'utf8')
    .catch(error=>{throw error;});
    return JSON.parse(fileBuffer.toString());
};
/**
 * 
 * @param {string|null} country 
 * @returns {Promise.<*>}
 */
const getCities = async (country) => {
    const cities = await getService();
    return cities.filter((item) => item.iso2 == country);
};
/**
 * 
 * @returns {Promise.<*>}
 */
const getCityRandom = async () => {
    const cities = await getService();
    return cities[Math.floor(Math.random() * cities.length - 1)];
};
/**
 * 
 * @param {string} search 
 * @param {number} limit 
 * @returns Promise.<{list_header:{total_count:number, offset:number, count:number}, rows:type_city[]}>
 */
const getCitySearch = async (search, limit) => {
    /**@type{import('./types.js').type_city[]} */
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
    //sort
    cities = cities.sort((first, second)=>{
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
    const list_header = {   total_count:	cities.length,
                            offset: 		0,
                            count:			cities.length};
    return {list_header:list_header, rows:cities};
};
export{getCities, getCityRandom, getCitySearch};