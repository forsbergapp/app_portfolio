/** 
 * Microservice geolocation service
 * @module serviceregistry/microservice/geolocation/service 
 */


/**
 * @import {common, config} from './types.js'
 */

const fs = await import('node:fs');

/**
 * @name getGeodataEmpty
 * @description Returns empty geodata with removeed key prefix
 * @function
 * @param {'IP'|'PLACE'} geotype 
 * @returns {*}
 */
const getGeodataEmpty = (geotype) => {
	switch (geotype){
		case 'IP':{
			return `{
				"request":"::1",
				"status":null,
				"delay":"",
				"credit":"",
				"city":"",
				"region":"",
				"regionCode":"",
				"regionName":"",
				"areaCode":"",
				"dmaCode":"",
				"countryCode":"",
				"countryName":"",
				"inEU":null,
				"euVATrate":null,
				"continentCode":"",
				"continentName":"",
				"latitude":"",
				"longitude":"",
				"locationAccuracyRadius":"",
				"timezone":"",
				"currencyCode":"",
				"currencySymbol":"",
				"currencySymbol_UTF8":"",
				"currencyConverter":null
			  }`;
		}
		case 'PLACE':{
			return `{
				"place":"",
				"countryCode":"",
				"region":"",
				"regionAbbreviated":"",
				"county":"",
				"latitude":"",
				"longitude":"",
				"distanceMiles":null,
				"distanceKilometers":null
			}`;
		}
		default: return null;
	}
};
/**
 * @name getCacheGeodata
 * @description Returns cached geodata
 * @function
 * @param {config} config
 * @param {'IP'|'PLACE'} cachetype 
 * @param {string|null} ip 
 * @param {string} latitude 
 * @param {string} longitude 
 * @returns {Promise.<*>}
 */
const getCacheGeodata = async (config, cachetype, ip, latitude, longitude) =>{
    const {serverProcess} = await import('./server.js');
    let geodata_cache;
    try {
        switch (cachetype){
            case 'IP':{
                geodata_cache = await fs.promises.readFile(`${serverProcess.cwd()}${config.path_data}/${config.name}_geodata_cache_ip.log`, 'utf8');
                geodata_cache = geodata_cache.split('\r\n');
                for (const row of geodata_cache){
                    const row_obj = JSON.parse(row);
                    if (row_obj.request==ip)
                        return row;
                }
                return null;
            }
            case 'PLACE':{
                geodata_cache = await fs.promises.readFile(`${serverProcess.cwd()}${config.path_data}/${config.name}_geodata_cache_place.log`, 'utf8');
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
                for (const row of geodata_cache.filter(geodata=>geodata!='')){
                    const row_obj = JSON.parse(row);
                    //check 1 decimal for current service provider without round
                    const lat_row = getFixed(row_obj.latitude,2);
                    const lat_search = getFixed(latitude,2);
                    const long_row = getFixed(row_obj.longitude,2);
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
 * @param {config} config
 * @param {'IP'|'PLACE'} cachetype 
 * @param {*} geodata 
 */
const writeCacheGeodata = async (config, cachetype, geodata) =>{
    const {serverProcess} = await import('./server.js');
    
    switch (cachetype){
        case 'IP':{
            await fs.promises.appendFile(`${serverProcess.cwd()}${config.path_data}/${config.name}_geodata_cache_ip.log`, 
                                                          JSON.stringify(JSON.parse(geodata)) +'\r\n', 'utf8');
            break;
        }
        case 'PLACE':{
            await fs.promises.appendFile(`${serverProcess.cwd()}${config.path_data}/${config.name}_geodata_cache_place.log`, 
                                                             JSON.stringify(JSON.parse(geodata)) +'\r\n', 'utf8');
            break;
        }
        default:{
            break;
        }
    }
};
/**
 * @name getPlace
 * @description Get place
 * @function
 * @param {common} common
 * @param {config['config']} config
 * @param {string} latitude
 * @param {string} longitude
 * @param {string} accept_language
 * @returns {Promise<string>}
 */
 const getPlace = async (common, config, latitude, longitude, accept_language) => {
	let geodata;
	geodata = await getCacheGeodata(config, 'PLACE', null, latitude, longitude);
	if (geodata != null)
        return geodata;
	else{
        const url = config.config.filter(parameter=>'url_place' in parameter)[0].url_place
                    .replace('<LATITUDE/>', latitude)
                    .replace('<LONGITUDE/>', longitude);
        //return result without prefix

		geodata = await await common.commonRequestUrl({ url:url, 
                                                        external: true,
                                                        encrypt: false,
                                                        uuid:null,
                                                        secret:null,
                                                        body:null,
                                                        method:'GET', 
                                                        language:accept_language})
                            .then(result=>JSON.stringify(result).replaceAll('geoplugin_',''));
		if (geodata != '[[]]')
			writeCacheGeodata(config, 'PLACE', geodata);
		return geodata;
	}
};
/**
 * @name getIp
 * @description Get geodata for ip
 * @function
 * @param {common} common
 * @param {config} config
 * @param {string} ip
 * @param {string} accept_language
 * @returns {Promise.<string>}
 */
const getIp = async (common, config, ip, accept_language) => {
	let geodata;
	let url;
	geodata = await getCacheGeodata(config, 'IP', ip, '', '');
	if (geodata != null)
		return geodata;
	else{
		if (ip == '::1' || ip == '::ffff:127.0.0.1' || ip == '127.0.0.1'){
			//create empty record with ip ::1 first time
			writeCacheGeodata(config, 'IP', getGeodataEmpty('IP'));
            url =   config.config.filter(parameter=>'url_ip' in parameter)[0].url_ip.replace('<IP/>', '');
		}
		else
            url =   config.config.filter(parameter=>'url_ip' in parameter)[0].url_ip.replace('<IP/>', ip);
        //return result without prefix
		geodata = await common.commonRequestUrl({   url:url, 
                                                    external: true,
                                                    encrypt: false,
                                                    uuid:null,
                                                    secret:null,
                                                    body:null,
                                                    method:'GET', 
                                                    language:accept_language})
                        .then(result=>JSON.stringify(result).replaceAll('geoplugin_',''));
		writeCacheGeodata(config, 'IP', geodata);
        return geodata;
	}
};
export {getGeodataEmpty, getCacheGeodata, writeCacheGeodata, getIp, getPlace};