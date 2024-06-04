/** @module microservice/worldcities */

/**@type{import('../../microservice/microservice.service.js')} */
const {ConfigServices} = await import(`file://${process.cwd()}/microservice/microservice.service.js`);

/**
 * @typedef {{  city:       string,
 *              city_ascii: string,
 *              lat:        string,
 *              lng:        string,
 *              country:    string,
 *              iso2:       string,
 *              iso3:       string,
 *              admin_name: string,
 *              capital:    string
 *              population: number,
 *              id:         number}} type_city
 */
/**
 * Database content:
 *        {
 *           "city":         [city with diacritics],
 *           "city_ascii":   [city_ascii],
 *           "lat":          [latitude],
 *           "lng":          [longitude],					
 *           "country":      [country],			
 *           "iso2":         [countrycode 2 letters],
 *           "iso3":         [countrycode 3 letters],
 *           "admin_name":   [admin name],
 *           "capital":      [admin, minor, primary, ''],
 *           "population":   [count],
 *           "id":           [id]
 *		} 
 * 
 * @returns {Promise.<type_city[]>}
 */
const getService = async () => {
    const fs = await import('node:fs');
    /**@type{import('../../types.js').microservice_config_service_record}*/
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
 * @returns 
 */
const getCitySearch = async (search, limit) => {
    /**@type{type_city[]} */
    let cities = await getService();
    /**
     * Filter searched and limit records 
     * @param {string} col 
     * @param {string} search 
     * @returns 
     */
    const match = (col, search) =>{
        //compare without diacritics and use lower case
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