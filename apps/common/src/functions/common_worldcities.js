/**
 * @module apps/common/src/functions/common_worldcities
*/

/**
 * @import {server} from '../../../../server/types.js'
 */
const {formatLocale} = await import('./common_locale.js');
const {server} = await import('../../../../server/server.js');
/**
 * @name appFunction
 * @description Get searched city from worldcities db
 *              Searches without diacritics and uses lower case
 *              Uses localcompare as collation method when sorting
 * @function
 * @param {{app_id:number,
 *          data:{searchType:'RANDOM'|'SEARCH'|'COUNTRY',searchString?:string},
 *          user_agent:string,
 *          ip:string,
 *          host:string,
 *          idToken:string,
 *          authorization:string,
 *          accept_language:string}} parameters
 * @returns {Promise.<server['server']['response'] & {result?:server['app']['commonWorldCitiesCity'][]|{data:string}[]}>}
 */
const appFunction = async parameters =>{
    /**@type {[key:string]}*/
    const countries =   server.ORM.getExternal('COUNTRY', formatLocale(parameters.accept_language))[0]?.countries
                        ??
                        server.ORM.getExternal('COUNTRY', 'en')[0].countries;

    /**
     * 
     * @description format result
     * @param {string|null} row
     * @returns {server['server']['response'] & {result?:server['app']['commonWorldCitiesCity'],type:'JSON'}}
     */
    const formatReturn = row =>{
        return row?
            {
            result:{
                city: row.split(';')[2].replaceAll('"',''),
                lat: row.split(';')[3],
                lng: row.split(';')[4],
                /**@ts-ignore */
                country: countries[row.substring(0,2)] ??' ',
                iso2: row.substring(0,2),
                admin_name: row.split(';')[1].replaceAll('"','')
            },
                type:'JSON'}:
                    {result:{
                        city: '',
                        lat: '',
                        lng: '',
                        country: '',
                        iso2: '',
                        admin_name: ''
                    },
                    type:'JSON'};
    };

    switch (parameters.data.searchType?.toUpperCase()){
        case 'RANDOM':{
            const APP_DEFAULT_RANDOM_COUNTRY = server.ORM.OpenApiConfig.APP_DEFAULT_RANDOM_COUNTRY.default;
            const objKeys = server.ORM.getExternalKeys('GEOLOCATION_PLACE');
            if (APP_DEFAULT_RANDOM_COUNTRY!=''){
                //sort random partitioned key and return random record when found
                for (const key of objKeys.sort((() => Math.random() - 0.5))){
                        const records = server.ORM.getExternalKey('GEOLOCATION_PLACE',key)
                                        .filter((/**@type{string}*/row)=>row.startsWith(APP_DEFAULT_RANDOM_COUNTRY) );
                        if (records.length>0)
                            return formatReturn(records[Math.floor(Math.random() * (records.length - 1))]);
                }
                return formatReturn(null);
            }
            else{
                const places = server.ORM.getExternalKey('GEOLOCATION_PLACE',objKeys[Math.floor(Math.random() * (objKeys.length - 1))]);
                return formatReturn(places[Math.floor(Math.random() * (places.length - 1))]);
            }
        }
        case 'SEARCH':{
            if ((parameters.data.searchString??'').length>2){
                const searchFormat = (parameters.data.searchString??'').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
                return {result: [...new Map(Object.values(server.ORM.getExternal('GEOLOCATION_PLACE'))
                                .map(arr=>[...arr.filter((/**@type{string}*/place)=>
                                                    /**@ts-ignore */
                                                    (place+(place.substring(0,2) in countries?countries[place.substring(0,2)]:'')).normalize('NFD')
                                                        .replace(/\p{Diacritic}/gu, '')
                                                        .toLowerCase()
                                                        .indexOf(searchFormat)>-1
                                                )]
                                )
                                .flat()
                                //return unique values for city and district
                                .map(item => [item.split(';')[1]+item.split(';')[2], item])).values()
                                ]
                                //Uses localcompare as collation method when sorting
                                .sort((/**@type{string}*/first, /**@type{string}*/second)=>{
                                                            /**@ts-ignore */
                                    const first_sort =  (countries[first.split(';')[0]]?.toLowerCase()??' ') +  first.split(';')[1].toLowerCase() +   first.split(';')[2].toLowerCase();
                                                            /**@ts-ignore */
                                    const second_sort =  (countries[second.split(';')[0]]?.toLowerCase()??' ') +  second.split(';')[1].toLowerCase() +   second.split(';')[2].toLowerCase();
                                    //using localeCompare as collation method
                                    if (first_sort.localeCompare(second_sort)<0 )
                                        return -1;
                                    else if (first_sort.localeCompare(second_sort)>0 )
                                        return 1;
                                    else
                                        return 0;}
                                ).map((/**@type{string}*/row)=>{
                                    return formatReturn(row).result;
                                }), 
                        type:'JSON'};
            }
            else
                return formatReturn(null);
        }
        case 'COUNTRY':{
                                                    
            const result = [...new Map(Object.values(server.ORM.getExternal('GEOLOCATION_PLACE'))
                .map(arr=>[...arr.filter((/**@type{string}*/place)=>
                                    place.split(';')[0].startsWith(parameters.data.searchString??'')
                                )]
                )
                .flat()
                //return unique values for city and district
                .map(item => [item.split(';')[1]+item.split(';')[2], item])).values()
                ]
                //Uses localcompare as collation method when sorting
                .sort((/**@type{string}*/first, /**@type{string}*/second)=>{
                    const first_sort =  first.split(';')[1].toLowerCase() +   first.split(';')[2].toLowerCase();
                    const second_sort =  second.split(';')[1].toLowerCase() +   second.split(';')[2].toLowerCase();
                    //using localeCompare as collation method
                    if (first_sort.localeCompare(second_sort)<0 )
                        return -1;
                    else if (first_sort.localeCompare(second_sort)>0 )
                        return 1;
                    else
                        return 0;}
                ).map((/**@type{string}*/row)=>{
                    return formatReturn(row).result;
                });
            return {result: [{data:  Buffer.from (JSON.stringify(result)).toString('base64')}],
                    type:'JSON'};
        }
        default:{
            return formatReturn(null);
        }
    }
    
};
export default appFunction;