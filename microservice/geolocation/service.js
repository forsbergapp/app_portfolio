/** 
 * Microservice geolocation service
 * @module microservice/geolocation/service 
 */

/**
 * @import {microservice_config_service_record} from '../types.js'
 */

/**@type{import('../../microservice/registry.js')} */
const {REGISTRY_CONFIG, registryConfigServices} = await import(`file://${process.cwd()}/microservice/registry.js`);

const fs = await import('node:fs');
const http = await import('node:http');

/**
 * @name getGeodataEmpty
 * @description Returns empty geodata
 * @function
 * @param {'IP'|'PLACE'} geotype 
 * @returns {*}
 */
const getGeodataEmpty = (geotype) => {
	switch (geotype){
		case 'IP':{
			//http://www.geoplugin.net/json.gp?ip=
			//used geoplugin_city, geoplugin_regionName, geoplugin_countryName,geoplugin_latitude, geoplugin_longitude
			return `{
				"geoplugin_request":"::1",
				"geoplugin_status":null,
				"geoplugin_delay":"",
				"geoplugin_credit":"",
				"geoplugin_city":"",
				"geoplugin_region":"",
				"geoplugin_regionCode":"",
				"geoplugin_regionName":"",
				"geoplugin_areaCode":"",
				"geoplugin_dmaCode":"",
				"geoplugin_countryCode":"",
				"geoplugin_countryName":"",
				"geoplugin_inEU":null,
				"geoplugin_euVATrate":null,
				"geoplugin_continentCode":"",
				"geoplugin_continentName":"",
				"geoplugin_latitude":"",
				"geoplugin_longitude":"",
				"geoplugin_locationAccuracyRadius":"",
				"geoplugin_timezone":"",
				"geoplugin_currencyCode":"",
				"geoplugin_currencySymbol":"",
				"geoplugin_currencySymbol_UTF8":"",
				"geoplugin_currencyConverter":null
			  }`;
		}
		case 'PLACE':{
			//http://www.geoplugin.net/extras/location.gp?format=json&lat=[latitude]&lon=[longitude]
			//used geoplugin_place. geoplugin_countryCode, geoplugin_region
			return `{
				"geoplugin_place":"",
				"geoplugin_countryCode":"",
				"geoplugin_region":"",
				"geoplugin_regionAbbreviated":"",
				"geoplugin_county":"",
				"geoplugin_latitude":"",
				"geoplugin_longitude":"",
				"geoplugin_distanceMiles":null,
				"geoplugin_distanceKilometers":null
			}`;
		}
		default: return null;
	}
};
/**
 * @name getCacheGeodata
 * @description Returns cached geodata
 * @function
 * @param {'IP'|'PLACE'} cachetype 
 * @param {string|null} ip 
 * @param {string} latitude 
 * @param {string} longitude 
 * @returns {Promise.<*>}
 */
const getCacheGeodata = async (cachetype, ip, latitude, longitude) =>{
    /**@type{microservice_config_service_record}*/
    const config_service = registryConfigServices('GEOLOCATION');
    let geodata_cache;
    try {
        switch (cachetype){
            case 'IP':{
                geodata_cache = await fs.promises.readFile(`${process.cwd()}${REGISTRY_CONFIG.PATH_DATA}${config_service.NAME}_geodata_cache_ip.log`, 'utf8');
                geodata_cache = geodata_cache.split('\r\n');
                for (const row of geodata_cache){
                    const row_obj = JSON.parse(row);
                    if (row_obj.geoplugin_request==ip || 
                        ((row_obj.geoplugin_request == '::1' || row_obj.geoplugin_request == '::ffff:127.0.0.1' ) &&
                         (ip == '::1' || ip == '::ffff:127.0.0.1' )))
                        return row;
                }
                return null;
            }
            case 'PLACE':{
                geodata_cache = await fs.promises.readFile(`${process.cwd()}${REGISTRY_CONFIG.PATH_DATA}${config_service.NAME}_geodata_cache_place.log`, 'utf8');
                geodata_cache =  geodata_cache.split('\r\n');
                /**
                 * 
                 * @param {string} v 
                 * @param {number} d 
                 * @returns {string}
                 */
                const getFixed = (v, d) => {
                    return (Math.floor(Number(v) * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
                };
                /**
                 * 
                 * @param {string} number_row 
                 * @param {string} number_search 
                 * @returns {boolean}
                 */
                const check_aprox = (number_row, number_search) =>{
                    //check aproximate value range -+ 0.07
                    if ((Number(number_row) >= Number(number_search) - 0.07) &&
                        (Number(number_row) <= Number(number_search) + 0.07))
                         return true;
                    else
                        return false;
                };
                for (const row of geodata_cache){
                    const row_obj = JSON.parse(row);
                    //check 1 decimal for current service provider without round
                    const lat_row = getFixed(row_obj.geoplugin_latitude,2);
                    const lat_search = getFixed(latitude,2);
                    const long_row = getFixed(row_obj.geoplugin_longitude,2);
                    const long_search = getFixed(longitude,2);
                    if (check_aprox(lat_row, lat_search) && check_aprox(long_row, long_search))
                        return row;
                }
                return null;
            }
            default:{
                return null;
            }
        }
    } catch (error) {
        return null;
    }
    
};
/**
 * @name writeCacheGeodata
 * @description Writes geodata cache
 * @function
 * @param {'IP'|'PLACE'} cachetype 
 * @param {*} geodata 
 */
const writeCacheGeodata = async (cachetype, geodata) =>{
    /**@type{microservice_config_service_record}*/
    const config_service = registryConfigServices('GEOLOCATION');
    switch (cachetype){
        case 'IP':{
            await fs.promises.appendFile(`${process.cwd()}${REGISTRY_CONFIG.PATH_DATA}${config_service.NAME}_geodata_cache_ip.log`, 
                                                          JSON.stringify(JSON.parse(geodata)) +'\r\n', 'utf8');
            break;
        }
        case 'PLACE':{
            await fs.promises.appendFile(`${process.cwd()}${REGISTRY_CONFIG.PATH_DATA}${config_service.NAME}_geodata_cache_place.log`, 
                                                             JSON.stringify(JSON.parse(geodata)) +'\r\n', 'utf8');
            break;
        }
        default:{
            break;
        }
    }
};
/**
 * @name getGeodata
 * @description Returns geodata from http.request
 * @function
 * @param {string} url 
 * @param {string} language 
 * @returns {Promise.<string>}
 */
const getGeodata = async (url, language) => {
    return new Promise((resolve) =>{
        //geolocation service using http 

        const options = {
            method: 'GET',
            headers : {
                'User-Agent': 'Server',
                'Accept-Language': language
            }
        };
        
        const request = http.request(url, options, res =>{
            let responseBody = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) =>{
                responseBody += chunk;
            });
            res.on('end', ()=>{
                resolve (responseBody);
            });
        });
        request.end();        
    });
};
/**
 * @name getPlace
 * @description Get place
 * @function
 * @param {string} latitude
 * @param {string} longitude
 * @param {string} accept_language
 * @returns {Promise<string>}
 */
 const getPlace = async (latitude, longitude, accept_language) => {
	let geodata;
	geodata = await getCacheGeodata('PLACE', null, latitude, longitude);
	if (geodata != null)
        return geodata;
	else{
        const url = registryConfigServices('GEOLOCATION').CONFIG.filter((/**@type{*}*/row)=>Object.keys(row)[0]=='URL_PLACE')[0].URL_PLACE
                    .replace('<LATITUDE/>', latitude)
                    .replace('<LONGITUDE/>', longitude);
		geodata = await getGeodata(url, accept_language);
		if (geodata != '[[]]')
			writeCacheGeodata('PLACE', geodata);
		return geodata;
	}
};
/**
 * @name getIp
 * @description Get geodata for ip
 * @function
 * @param {string} ip
 * @param {string} accept_language
 * @returns {Promise.<string>}
 */
const getIp = async (ip, accept_language) => {
	let geodata;
	let url;
	geodata = await getCacheGeodata('IP', ip, '', '');
	if (geodata != null)
		return geodata;
	else{
		if (ip == '::1' || ip == '::ffff:127.0.0.1' || ip == '127.0.0.1'){
			//create empty record with ip ::1 first time
			writeCacheGeodata('IP', getGeodataEmpty('IP'));
            url =   registryConfigServices('GEOLOCATION').CONFIG.filter((/**@type{*}*/row)=>Object.keys(row)[0]=='URL_IP')[0].URL_IP
                    .replace('<IP/>', '');
		}
		else
            url =   registryConfigServices('GEOLOCATION').CONFIG.filter((/**@type{*}*/row)=>Object.keys(row)[0]=='URL_IP')[0].URL_IP
                    .replace('<IP/>', ip);
		geodata = await getGeodata(url, accept_language);
		writeCacheGeodata('IP', geodata);
        return geodata;
	}
};
export {getGeodataEmpty, getCacheGeodata, writeCacheGeodata, getGeodata, getIp, getPlace};