const service = await import('./geolocation.service.js')

const getPlace = async (req, res) => {
	let geodata;
	geodata = await service.getCacheGeodata('PLACE', null, req.query.latitude, req.query.longitude);
	if (geodata != null)
		return res.status(200).send(geodata);
	else{
		//service can return other formats, set json
		const url = `http://www.geoplugin.net/extras/location.gp?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
		geodata = await service.getGeodata(url, req.headers["accept-language"]);
		if (geodata != '[[]]')
			service.writeCacheGeodata('PLACE', geodata);
		return res.status(200).send(
			geodata
		)
	}
}
const getIp = async (req, res) => {
	let geodata;
	let url;
	geodata = await service.getCacheGeodata('IP', req.query.ip, null, null);
	if (geodata != null)
		return res.status(200).send(geodata);
	else{
		if (req.query.ip == '::1' || req.query.ip == '::ffff:127.0.0.1'){
			//create empty record with ip ::1 first time
			service.writeCacheGeodata('IP', service.getGeodataEmpty('IP'));
			url = `http://www.geoplugin.net/json.gp?ip=`;
		}
		else
			url = `http://www.geoplugin.net/json.gp?ip=${req.query.ip}`;
		geodata = await service.getGeodata(url, req.headers["accept-language"]);
		service.writeCacheGeodata('IP', geodata);
		return res.status(200).send(geodata);
	}
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