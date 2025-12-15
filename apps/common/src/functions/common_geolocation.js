/**
 * @module apps/common/src/functions/common_geolocation
 */

/**
 * @import {server} from '../../../../server/types.js'
 */
const {formatLocale} = await import('./common_locale.js');
const {server} = await import('../../../../server/server.js');
const { getTimezone } = await import ('../../public/modules/regional/regional.js');

/**
 * @description Returns place in common format
 * @param {{locale:string,
 *          longitude?:string,
 *          latitude?:string,
 *          place:string|null}} parameters
 * @returns {server['server']['response'] & {result?:server['server']['geolocation_place']}}
 */
const returnPlace = parameters =>{
    if (parameters.place)
        return {result:{place:parameters.place.split(';')[2],
                countryCode:parameters.place.split(';')[0],
                country:server.ORM.getExternal('COUNTRY', formatLocale(parameters.locale))[0].countries[parameters.place.split(';')[0]]??' ',
                region:     parameters.place.split(';')[1],
                latitude:   parameters.place.split(';')[3],
                longitude:  parameters.place.split(';')[4],
                timezone:   getTimezone(parameters.place.split(';')[3], 
                                        parameters.place.split(';')[4])},
                type: 'JSON'}; 
    else{
        let latitude = null;
        let longitude = null;
        let timezone = null;
        try {
            //test convert to numbers
            latitude = parameters.latitude?+parameters.latitude:null;
            longitude = parameters.longitude?+parameters.longitude:null;
            //test find timezone
            timezone = getTimezone(latitude?.toString()??'0',longitude?.toString()??'0');
        } catch (error) {
            latitude = null;
            longitude = null;
            timezone = null;
        }
        
        return {result:{place:'?',
                countryCode:'?',
                country:'?',
                region:'?',
                latitude:latitude?.toString()??'',
                longitude:longitude?.toString()??'',
                timezone:   timezone?? ''
                }, 
    type:'JSON'};
    }
        
};
/**
 * @name getIP
 * @description Server function for GEOLOCATION_IP, also reads GEOLOCATION_PLACE if not local IP address
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  ip:string, locale:string}}} parameters
 * @returns {server['server']['response'] & {result?:server['server']['geolocation_place']|null}}
 */
const getIP = parameters =>{
    /**
     * IP to number
     * @function
     * @param {string} ip
     * @returns {number}
     */
    const IPtoNum = (ip) => {
        return Number(
            ip.split('.')
            .map(d => ('000'+d).substr(-3) )
            .join('')
        );
    };
    /**
     *  Fields  
     *  0 ip_start
     *      First IP v4 address in the block	
     *  1 ip_end
     *      Last IP v4 address in the block	
     *  2 latitude
     *      Decimal latitude	
     *  3 longitude
     *      Decimal longitude
     */
    const ipNumber = IPtoNum(parameters.data.ip??'');
    //if geolocation is enabled then search in partitioned key
    //ignore all local IP addresses
    const geolocation_ip = parameters.data.ip.startsWith('127.0.0.')?
                                null:
                                server.ORM.UtilNumberValue(server.ORM.OpenApiConfig.IAM_ENABLE_GEOLOCATION.default)==1?
                                    server.ORM.getExternal('GEOLOCATION_IP')[('000'+parameters.data.ip?.split(',')[0].split('.')[0]).substr(-3)].filter((/**@type{string}*/row)=> 
                                                IPtoNum(row.split(';')[0]) <= ipNumber &&
                                                IPtoNum(row.split(';')[1]) >= ipNumber)[0]:
                                                null;
    if (geolocation_ip){
        const lat = geolocation_ip.split(';')[2];
        const long = geolocation_ip.split(';')[3];
        const place = server.ORM.getExternal('GEOLOCATION_PLACE')[lat.split('.')[0]].filter((/**@type{string}*/row)=>
                            row.split(';')[3] == lat &&
                            row.split(';')[4] == long
                        )[0];
                        

        return returnPlace({locale:parameters.data.locale,
                                    place:place});
    }
    else
        return {result:null, type:'JSON'};
};
/**
 * @name getPlace
 * @description Server function for GEOLOCATION_PLACE   
 * @function
 * @memberof ROUTE_REST_API
 * @param {{app_id:number,
 *          data:{  latitude:string,
 *                  longitude:string},
 *          ip:string,
 *          locale:string}} parameters
 * @returns {server['server']['response'] & {result?:server['server']['geolocation_place']}}
 */
const getPlace = parameters =>{
   /**
    *  Fields
    *  0 country
    *      ISO 3166-1 alpha-2 country code	
    *  1 stateprov
    *      State or Province name	
    *  2 city
    *      City name	
    *  3 latitude
    *      Decimal latitude	
    *  4 longitude
    *      Decimal longitude	
    */
    /**
     * 
     * @param {string} number_row 
     * @param {string} number_search 
     * @param {number} precision
     * @returns {boolean}
     */
    const check_aprox = (number_row, number_search, precision) =>
        (+number_row >= +number_search - precision) && (+number_row <= +number_search + precision);
    //Find place in ordered aproximity in partioned key using first part of latitude
    for (const aproximity of [0.02, 0.05, 0.1, 0.5, 1, 5, 10]){
        const result = (server.ORM.getExternal('GEOLOCATION_PLACE')[parameters.data.latitude.split('.')[0]]??[])
                        .filter((/**@type{string}*/row)=>
                        check_aprox(row.split(';')[3], parameters.data.latitude, aproximity) && 
                        check_aprox(row.split(';')[4], parameters.data.longitude, aproximity))
                        //Sort using Euclidean distance calculation
                        //and return closest
                        .sort((/**@type{string}*/a, /**@type{string}*/b) => {
                            const distA = Math.hypot(   +(a.split(';')[3]) - +parameters.data.latitude, 
                                                        +(a.split(';')[4]) - +parameters.data.longitude);
                            const distB = Math.hypot(   +(b.split(';')[3]) - +parameters.data.latitude, 
                                                        +(b.split(';')[4]) - +parameters.data.longitude);

                            return distA - distB;
                            })
        if (result[0])
            return returnPlace({locale:parameters.locale,
                                place:result[0]});
    }    
    return returnPlace({locale:parameters.locale,
                        longitude:parameters.data.longitude,
                        latitude:parameters.data.latitude,
                        place:null});        
};
export {getIP, getPlace};