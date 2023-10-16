const service = await import('./service.js');
const { no_internet_message, check_internet, MicroserviceServer, IAM } = await import(`file://${process.cwd()}/service/service.service.js`);

const startserver = async () =>{
	const request = await MicroserviceServer('GEOLOCATION');
	
	request.server.createServer(request.options, (req, res) => {
		req.query = {};
		req.params = {};
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type',  'application/json; charset=utf-8');
		const params = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
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
						res.write('⛔', 'utf-8');
						res.end();
					}
				});
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
						res.write('⛔', 'utf-8');
						res.end();
					}
				});
				break;
			}
			default:{
				res.end();
			}
		}
		
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE GEOLOCATION PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};

const getPlace = async (req, res) => {
	let geodata;
	geodata = await service.getCacheGeodata('PLACE', null, req.query.latitude, req.query.longitude);
	if (geodata != null){
		res.statusCode = 200;
		res.write(geodata, 'utf8');
	}
	else{
		if (check_internet==1){
			//service can return other formats, set json
			const url = `http://www.geoplugin.net/extras/location.gp?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
			geodata = await service.getGeodata(url, req.headers['accept-language']);
			if (geodata != '[[]]')
				service.writeCacheGeodata('PLACE', geodata);
			res.statusCode = 200;
			res.write(geodata, 'utf8');
		}
		else{
			res.statusCode = 503;
			res.write(no_internet_message, 'utf-8');
		}
	}
	res.end();
};
const getIp = async (req, res) => {
	let geodata;
	let url;
	geodata = await service.getCacheGeodata('IP', req.query.ip, null, null);
	if (geodata != null){
		res.statusCode = 200;
		res.write(geodata, 'utf8');
	}
	else{
		if (check_internet==1){
			if (req.query.ip == '::1' || req.query.ip == '::ffff:127.0.0.1' || req.query.ip == '127.0.0.1'){
				//create empty record with ip ::1 first time
				service.writeCacheGeodata('IP', service.getGeodataEmpty('IP'));
				url = 'http://www.geoplugin.net/json.gp?ip=';
			}
			else
				url = `http://www.geoplugin.net/json.gp?ip=${req.query.ip}`;
			geodata = await service.getGeodata(url, req.headers['accept-language']);
			service.writeCacheGeodata('IP', geodata);
			res.statusCode = 200;
			res.write(geodata, 'utf8');
		}
		else{
			res.statusCode = 503;
			res.write(no_internet_message, 'utf-8');
		}
	}
	res.end();
};
startserver();
export {startserver, getPlace, getIp};