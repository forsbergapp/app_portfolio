const service = await import('./service.js');
const { MicroserviceServer, IAM} = await import(`file://${process.cwd()}/service/service.service.js`);

const startserver = async () =>{
	const request = await MicroserviceServer('WORLDCITIES');
	request.server.createServer(request.options, (req, res) => {
		req.query = {};
		req.params = {};
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type',  'application/json; charset=utf-8');
		const params = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
		req.query.app_id = params.get('app_id');
		switch (true){
			case req.url.startsWith('/worldcities/city/search/'):{
				req.params.search = req.url.substring('/worldcities/city/search/'.length, req.url.indexOf('?'));
				if (params.get('limit'))
					req.query.limit = Number(params.get('limit'));
				else
					req.query.limit = 0;
				IAM(req.query.app_id, req.headers.authorization).then(result=>{
					if (result == 1)
						getCitySearch(req, res);
					else
					{
						res.statusCode = 401;
						res.write('⛔', 'utf-8');
						res.end();
					}
				});
				break;
			}
			case req.url.startsWith('/worldcities/city/random'):{
				IAM(req.query.app_id, req.headers.authorization).then(result=>{
					if (result == 1)
						getCityRandom(req, res);
					else
					{
						res.statusCode = 401;
						res.write('⛔', 'utf-8');
						res.end();
					}
				});
				break;
			}
			case req.url.startsWith('/worldcities/country/'):{
				req.params.country = req.url.substring('/worldcities/country/'.length, req.url.indexOf('?'));
				IAM(req.query.app_id, req.headers.authorization).then(result=>{
					if (result == 1)
						getCities(req, res);
					else
					{
						res.statusCode = 401;
						res.write('⛔', 'utf-8');
						res.end();
					}
				});
				break;
			}
			default:
				res.end();
				break;
		}
	}).listen(request.port, ()=>{
		console.log(`MICROSERVICE WORLDCITIES PORT ${request.port} `);
	});

	process.on('uncaughtException', (err) =>{
		console.log(err);
	});
};
const getCities = async (req, res) => {
	try {
		const cities = await service.getCities(req.params.country);
		res.statusCode = 200;
		res.write(JSON.stringify(cities), 'utf8');	
	} catch (error) {
		res.statusCode = 500;
		res.write(error, 'utf8');
	}
	res.end();
};
const getCityRandom = async (req, res) => {
	try {
		const city = await service.getCityRandom();
		res.statusCode = 200;
		res.write(JSON.stringify(city), 'utf8');	
	} catch (error) {
		res.statusCode = 500;
		res.write(error, 'utf8');
	}
	res.end();
};
const getCitySearch = async (req, res) => {
	try {
		const city = await service.getCitySearch(decodeURI(req.params.search), req.query.limit);
		res.statusCode = 200;
		res.write(JSON.stringify(city), 'utf8');	
	} catch (error) {
		res.statusCode = 500;
		res.write(error, 'utf8');
	}
	res.end();
};
startserver();