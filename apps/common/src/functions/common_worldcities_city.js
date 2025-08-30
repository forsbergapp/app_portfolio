/**
 * @module apps/common/src/functions/common_worldcities
*/

/**
 * @import {server_server_response,commonWorldCitiesCity} from '../../../../server/types.js'
 */
const {commonSearchMatch} = await import('../common.js');
/**
 * @name appFunction
 * @description Get searched city from worldcities db
 *              Searches without diacritics and uses lower case
 *              Uses localcompare as collation method when sorting
 * @function
 * @param {{app_id:number,
 *          data:{search:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          locale:string}} parameters
 * @returns {Promise.<server_server_response & {result?:commonWorldCitiesCity[]}>}
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
    
    return {result:(await getFile()).filter(city=>( commonSearchMatch(city.city,        parameters.data.search)||
                                                    commonSearchMatch(city.city_ascii,  parameters.data.search)||
                                                    commonSearchMatch(city.country,     parameters.data.search)||
                                                    commonSearchMatch(city.admin_name,  parameters.data.search)))
                    //Uses localcompare as collation method when sorting
                    .sort((first, second)=>{
                    const first_sort =  first.country.toLowerCase() +  first.city.toLowerCase() +   first.admin_name.toLowerCase();
                    const second_sort = second.country.toLowerCase() + second.city.toLowerCase() +  second.admin_name.toLowerCase();
                    //using localeCompare as collation method
                    if (first_sort.localeCompare(second_sort)<0 )
                        return -1;
                    else if (first_sort.localeCompare(second_sort)>0 )
                        return 1;
                    else
                        return 0;}), 
            type:'JSON'};
};
export default appFunction;