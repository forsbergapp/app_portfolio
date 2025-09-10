/**
 * @module apps/common/src/functions/common_geolocation
 */

/**
 * @import {server_db_document_ConfigServer, server_server_response,
 *          server_geolocation_place} from '../../../../server/types.js'
 */
const {formatLocale} = await import('./common_locale.js');
const {getData} = await import('./common_data.js');
const {server} = await import('../../../../server/server.js');
const { getTimezone } = await import ('../../public/modules/regional/regional.js');

/**
 * @description Returns place in common format
 * @param {{locale:string,
 *          place:string}} parameters
 * @returns {server_server_response & {result?:server_geolocation_place}}
 */
const returnPlace = parameters =>{
    if (parameters.place)
        return {result:{place:parameters.place.split(';')[2],
                countryCode:parameters.place.split(';')[0],
                country:getData('COUNTRY')
                            .filter((/**@type {{locale:string,
                                                countries:[key:string]}}*/row)=>
                                    row.locale == formatLocale(parameters.locale))[0].countries[parameters.place.split(';')[0]],
                region:     parameters.place.split(';')[1],
                latitude:   parameters.place.split(';')[3],
                longitude:  parameters.place.split(';')[4],
                timezone:   getTimezone(parameters.place.split(';')[3], 
                                        parameters.place.split(';')[4])},
                type: 'JSON'}; 
    else
        return {result:{place:'?',
                        countryCode:'?',
                        country:'?',
                        region:'?',
                        latitude:'?',
                        longitude:'?',
                        timezone:   '?'}, 
                type:'JSON'};
};
/**
 * @name getIP
 * @description Server function for geolocation IP
 * @function
 * @param {{app_id:number,
 *          data:{  ip:string},
 *          ip:string,
 *          locale:string}} parameters
 * @returns {server_server_response & {result?:server_geolocation_place|null}}
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
    const geolocation_ip = server.ORM.UtilNumberValue(server.ORM.db.ConfigServer.get({app_id:0,data:{ config_group:'SERVICE_IAM'}}).result
                            .filter((/**@type{server_db_document_ConfigServer['SERVICE_IAM']}*/parameter)=>
                                    'ENABLE_GEOLOCATION' in parameter)[0].ENABLE_GEOLOCATION)==1?
                            getData('GEOLOCATION_IP')[('000'+parameters.data.ip?.split(',')[0].split('.')[0]).substr(-3)].filter((/**@type{string}*/row)=> 
                                           IPtoNum(row.split(';')[0]) <= ipNumber &&
                                           IPtoNum(row.split(';')[1]) >= ipNumber)[0]:
                                           null;
    if (geolocation_ip && geolocation_ip.split(';')[0] !='127.0.0.0'){
        const lat = geolocation_ip.split(';')[2];
        const long = geolocation_ip.split(';')[3];
        const place = getData('GEOLOCATION_PLACE')[lat.split('.')[0]].filter((/**@type{string}*/row)=>
                            row.split(';')[3] == lat &&
                            row.split(';')[4] == long
                        )[0];
                        

        return returnPlace({locale:parameters.locale,
                                    place:place});
    }
    else
        return {result:null, type:'JSON'};
};
/**
 * @name getPlace
 * @description Server function for geolocation
 *              IP      
 *              PLACE   
 * @function
 * @param {{app_id:number,
 *          data:{  latitude:string,
 *                  longitude:string},
 *          ip:string,
 *          locale:string}} parameters
 * @returns {server_server_response & {result?:server_geolocation_place}}
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
    //Find place in ordered aproximity 0.02, 0.05, 0.1, 0.5  and 0.9 in partioned key using first part of latitude
    const geolocation_place = getData('GEOLOCATION_PLACE')[parameters.data.latitude.split('.')[0]].filter((/**@type{string}*/row)=>
        check_aprox(row.split(';')[3], parameters.data.latitude, 0.02) && 
        check_aprox(row.split(';')[4], parameters.data.longitude, 0.02))[0]
        ??
        getData('GEOLOCATION_PLACE')[parameters.data.latitude.split('.')[0]].filter((/**@type{string}*/row)=>
        check_aprox(row.split(';')[3], parameters.data.latitude, 0.05) && 
        check_aprox(row.split(';')[4], parameters.data.longitude, 0.05))[0]
        ??
        getData('GEOLOCATION_PLACE')[parameters.data.latitude.split('.')[0]].filter((/**@type{string}*/row)=>
            check_aprox(row.split(';')[3], parameters.data.latitude, 0.1) && 
            check_aprox(row.split(';')[4], parameters.data.longitude, 0.1))[0]
        ??
        getData('GEOLOCATION_PLACE')[parameters.data.latitude.split('.')[0]].filter((/**@type{string}*/row)=>
            check_aprox(row.split(';')[3], parameters.data.latitude, 0.5) && 
            check_aprox(row.split(';')[4], parameters.data.longitude, 0.5))[0]
        ??
        getData('GEOLOCATION_PLACE')[parameters.data.latitude.split('.')[0]].filter((/**@type{string}*/row)=>
            check_aprox(row.split(';')[3], parameters.data.latitude, 0.9) && 
            check_aprox(row.split(';')[4], parameters.data.longitude, 0.9))[0];
    return returnPlace({locale:parameters.locale,
                                place:geolocation_place});
        
};
export {getIP, getPlace};