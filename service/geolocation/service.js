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
const getCacheGeodata = async (cachetype, ip, latitude, longitude) =>{
    const fs = await import('node:fs');
    let geodata_cache;
    try {
        switch (cachetype){
            case 'IP':{
                geodata_cache = await fs.promises.readFile(`${process.cwd()}/service/geolocation/geodata_cache_ip.json`, 'utf8');
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
                geodata_cache = await fs.promises.readFile(`${process.cwd()}/service/geolocation/geodata_cache_place.json`, 'utf8');
                geodata_cache =  geodata_cache.split('\r\n');
                const getFixed = (v, d) => {
                    return (Math.floor(Number(v) * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
                };
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
const writeCacheGeodata = async (cachetype, geodata) =>{
    const fs = await import('node:fs');
    switch (cachetype){
        case 'IP':{
            await fs.promises.appendFile(`${process.cwd()}/service/geolocation/geodata_cache_ip.json`, 
                                                          JSON.stringify(JSON.parse(geodata)) +'\r\n', 'utf8');
            break;
        }
        case 'PLACE':{
            await fs.promises.appendFile(`${process.cwd()}/service/geolocation/geodata_cache_place.json`, 
                                                             JSON.stringify(JSON.parse(geodata)) +'\r\n', 'utf8');
            break;
        }
        default:{
            break;
        }
    }
};
const getGeodata = async (url, language) => {
    const http = await import('node:http');
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
            res.setEncoding('UTF8');
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

export {getGeodataEmpty, getCacheGeodata, writeCacheGeodata, getGeodata};