const service = await import('./geolocation.service.js')

const geodata_empty = (geotype) => {
	let geodata='';
	switch (geotype){
		case 'ip':{
			//http://www.geoplugin.net/json.gp?ip=
			//used geoplugin_city, geoplugin_regionName, geoplugin_countryName,geoplugin_latitude, geoplugin_longitude
			return geodata = {
				"geoplugin_request":"",
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
			  };
			break;
		}
		case 'place':{
			//http://www.geoplugin.net/extras/location.gp?format=json&lat=[latitude]&lon=[longitude]
			//used geoplugin_place. geoplugin_countryCode, geoplugin_region
			return geodata = {
				"geoplugin_place":"",
				"geoplugin_countryCode":"",
				"geoplugin_region":"",
				"geoplugin_regionAbbreviated":"",
				"geoplugin_county":"",
				"geoplugin_latitude":"",
				"geoplugin_longitude":"",
				"geoplugin_distanceMiles":null,
				"geoplugin_distanceKilometers":null
			};
			break;
		}
		default: return null;
	}
}

const getPlace = async (req, res) => {
	let geodata;
	//service can return other formats, set json
	const url = `http://www.geoplugin.net/extras/location.gp?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
	geodata = await service.getService(url, req.headers["accept-language"]);
	return res.status(200).send(
		geodata
	)
}
const getIp = async (req, res, callBack) => {
	let geodata;
	let url;
	if (typeof req.query.ip == 'undefined')
		if (req.ip == '::1' || req.ip == '::ffff:127.0.0.1')
			url = `http://www.geoplugin.net/json.gp?ip=`;
		else
			url = `http://www.geoplugin.net/json.gp?ip=${req.ip}`;
	else
		url = `http://www.geoplugin.net/json.gp?ip=${req.query.ip}`;

	geodata = await service.getService(url, req.headers["accept-language"]);
	if (req.query.callback==1)
		return callBack(null, geodata);
	else
		return res.status(200).send(geodata);
}
const getTimezone = (req, res) => {
	service.getTimezone(req.query.latitude, req.query.longitude, (err, result)=>{
		return res.status(200).send(
			result
		)
	})
}
const getTimezoneAdmin = (req, res) => {
	service.getTimezone(req.query.latitude, req.query.longitude, (err, result)=>{
		return res.status(200).send(
			result
		)
	})
}
const getTimezoneSystemAdmin = (req, res) => {
	service.getTimezone(req.query.latitude, req.query.longitude, (err, result)=>{
		return res.status(200).send(
			result
		)
	})
}

export {getPlace, getIp, getTimezone, getTimezoneAdmin, getTimezoneSystemAdmin}