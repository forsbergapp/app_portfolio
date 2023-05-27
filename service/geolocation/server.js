const service = await import('./service.js');
const fs = await import('node:fs');
const https = await import('node:https');
const {MICROSERVICE, IAM} = await import(`file://${process.cwd()}/service/service.service.js`);

const startserver = () =>{
	let options;
	fs.readFile(process.cwd() + MICROSERVICE.filter(row=>row.SERVICE=='GEOLOCATION')[0].HTTPS_KEY, 'utf8', (error, fileBuffer) => {
		let env_key = fileBuffer.toString();
		fs.readFile(process.cwd() + MICROSERVICE.filter(row=>row.SERVICE=='GEOLOCATION')[0].HTTPS_CERT, 'utf8', (error, fileBuffer) => {
			let env_cert = fileBuffer.toString();
			options = {
				key: env_key,
				cert: env_cert
			};
			https.createServer(options, (req, res) => {
				req.query = {};
				req.params = {};
            	res.setHeader('Access-Control-Allow-Methods', 'GET');
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader('Content-Type',  'application/json; charset=utf-8');
				let params = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
				req.query.app_id = params.get('app_id');
				req.query.ip = params.get('ip');
				switch (req.url.substring(0, req.url.indexOf('?'))){
					case '/geolocation/place':{
						req.query.latitude = params.get('latitude');
						req.query.longitude = params.get('longitude');
						IAM(req.query.app_id, req.headers.authorization).then(result=>{
							if (result == 1)
								getPlace(req, res);
							else
							{
								res.statusCode = 401;
								res.write('⛔', "utf-8");
								res.end();
							}
						})
						break;
					}
					case '/geolocation/ip':{
						req.query.ip = params.get('ip');
						IAM(req.query.app_id, req.headers.authorization).then(result=>{
							if (result == 1)
								getIp(req, res);
							else
							{
								res.statusCode = 401;
								res.write('⛔', "utf-8");
								res.end();
							}
						})
						break;
					}
					case '/geolocation/timezone':{
						req.query.latitude = params.get('latitude');
						req.query.longitude = params.get('longitude');
						IAM(req.query.app_id, req.headers.authorization).then(result=>{
							if (result == 1)
								getTimezone(req, res);
							else
							{
								res.statusCode = 401;
								res.write('⛔', "utf-8");
								res.end();
							}
						})
						break;
					}
					default:{
						res.end();
					}
				}
				
			}).listen(MICROSERVICE.filter(row=>row.SERVICE=='GEOLOCATION')[0].PORT, ()=>{
				console.log(`MICROSERVICE GEOLOCATION PORT ${MICROSERVICE.filter(row=>row.SERVICE=='GEOLOCATION')[0].PORT} `);
			});

			process.on('uncaughtException', (err) =>{
				console.log(err);
			})
		})
	})
}

const getPlace = async (req, res) => {
	let geodata;
	geodata = await service.getCacheGeodata('PLACE', null, req.query.latitude, req.query.longitude);
	if (geodata != null){
		res.statusCode = 200;
		res.write(geodata, "utf8");
	}
	else{
		//service can return other formats, set json
		const url = `http://www.geoplugin.net/extras/location.gp?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
		geodata = await service.getGeodata(url, req.headers["accept-language"]);
		if (geodata != '[[]]')
			service.writeCacheGeodata('PLACE', geodata);
		res.statusCode = 200;
		res.write(geodata, "utf8");
	}
	res.end();
}
const getIp = async (req, res) => {
	let geodata;
	let url;
	geodata = await service.getCacheGeodata('IP', req.query.ip, null, null);
	if (geodata != null){
		res.statusCode = 200;
		res.write(geodata, "utf8");
	}
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
		res.statusCode = 200;
		res.write(geodata, "utf8");
	}
	res.end();
}
const getTimezone = (req, res) => {
	service.getTimezone(req.query.latitude, req.query.longitude, (err, result)=>{
		res.statusCode = 200;
		res.write(result, "utf8");
		res.end();
	})
}
startserver();
export {startserver, getPlace, getIp, getTimezone}