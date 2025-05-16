/** 
 * Microservice geolocation service
 * @module serviceregistry/microservice/geolocation/service 
 */

const {registryConfigServices} = await import('../../registry.js');

const fs = await import('node:fs');
const http = await import('node:http');

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
 * @param {'IP'|'PLACE'} cachetype 
 * @param {string|null} ip 
 * @param {string} latitude 
 * @param {string} longitude 
 * @returns {Promise.<*>}
 */
const getCacheGeodata = async (cachetype, ip, latitude, longitude) =>{
    const config_service = registryConfigServices('GEOLOCATION');
    let geodata_cache;
    try {
        switch (cachetype){
            case 'IP':{
                geodata_cache = await fs.promises.readFile(`${process.cwd()}${config_service.PATH_DATA}/${config_service.NAME}_geodata_cache_ip.log`, 'utf8');
                geodata_cache = geodata_cache.split('\r\n');
                for (const row of geodata_cache){
                    const row_obj = JSON.parse(row);
                    if (row_obj.request==ip)
                        return row;
                }
                return null;
            }
            case 'PLACE':{
                geodata_cache = await fs.promises.readFile(`${process.cwd()}${config_service.PATH_DATA}/${config_service.NAME}_geodata_cache_place.log`, 'utf8');
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
 * @param {'IP'|'PLACE'} cachetype 
 * @param {*} geodata 
 */
const writeCacheGeodata = async (cachetype, geodata) =>{
    const config_service = registryConfigServices('GEOLOCATION');
    switch (cachetype){
        case 'IP':{
            await fs.promises.appendFile(`${process.cwd()}${config_service.PATH_DATA}/${config_service.NAME}_geodata_cache_ip.log`, 
                                                          JSON.stringify(JSON.parse(geodata)) +'\r\n', 'utf8');
            break;
        }
        case 'PLACE':{
            await fs.promises.appendFile(`${process.cwd()}${config_service.PATH_DATA}/${config_service.NAME}_geodata_cache_place.log`, 
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
            res.on('data', (chunk) =>responseBody += chunk);
            res.on('end', ()=>resolve (responseBody));
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
        //return result without prefix
		geodata = await getGeodata(url, accept_language).then(result=>result.replaceAll('geoplugin_',''));
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
        //return result without prefix
		geodata = await getGeodata(url, accept_language).then(result=>result.replaceAll('geoplugin_',''));
		writeCacheGeodata('IP', geodata);
        return geodata;
	}
};
export {getGeodataEmpty, getCacheGeodata, writeCacheGeodata, getGeodata, getIp, getPlace};