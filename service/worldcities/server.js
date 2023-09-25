const service = await import('./service.js');
const fs = await import('node:fs');
const https = await import('node:https');
const {MICROSERVICE, IAM} = await import(`file://${process.cwd()}/service/service.service.js`);

const startserver = () =>{
	let options;
	fs.readFile(process.cwd() + MICROSERVICE.filter(row=>row.SERVICE=='WORLDCITIES')[0].HTTPS_KEY, 'utf8', (error, fileBuffer) => {
		const env_key = fileBuffer.toString();
		fs.readFile(process.cwd() + MICROSERVICE.filter(row=>row.SERVICE=='WORLDCITIES')[0].HTTPS_CERT, 'utf8', (error, fileBuffer) => {
			const env_cert = fileBuffer.toString();
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
				const params = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
				req.query.app_id = params.get('app_id');
				if (req.url.startsWith('/worldcities/city/random'))
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
				else{
					if (req.url.startsWith('/worldcities/country/')){
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
					}
					else
						res.end();
				}
			}).listen(MICROSERVICE.filter(row=>row.SERVICE=='WORLDCITIES')[0].PORT, ()=>{
				console.log(`MICROSERVICE WORLDCITIES PORT ${MICROSERVICE.filter(row=>row.SERVICE=='WORLDCITIES')[0].PORT} `);
			});

			process.on('uncaughtException', (err) =>{
				console.log(err);
			});
		});
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
startserver();
export{startserver, getCities, getCityRandom};