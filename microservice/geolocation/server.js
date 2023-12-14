/** @module microservice/geolocation */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { getNumberValue, MicroServiceServer } = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
const { AuthenticateApp } = await import(`file://${process.cwd()}/server/iam.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('GEOLOCATION');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type',  'application/json; charset=utf-8');
		/**
		 * @typedef{{	app_id:number,
		 * 				ip:string,
		 * 				latitude:string,
		 * 				longitude:string}}
		 * @property {function} get
		 */
		const params = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
		req.query = {	app_id:null,
						latitude:'',
						longitude:'',
						ip:'',
						limit:0,
						search:'',
						country:''};
		req.query.app_id = getNumberValue(params.get('app_id'));
		switch (req.url.substring(0, req.url.indexOf('?'))){
			case '/geolocation/place':{
				req.query.latitude = params.get('latitude') ?? '';
				req.query.longitude = params.get('longitude') ?? '';
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/result)=>{
					if (result)
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
				AuthenticateApp(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/result)=>{
					if (result)
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
/**
 * 
 * @param {Types.req_microservice} req 
 * @param {Types.res_microservice} res 
 */
const getPlace = async (req, res) => {
	let geodata;
	geodata = await service.getCacheGeodata('PLACE', null, req.query.latitude, req.query.longitude);
	if (geodata != null){
		res.statusCode = 200;
		res.write(geodata, 'utf8');
	}
	else{
		//service can return other formats, set json
		const url = `http://www.geoplugin.net/extras/location.gp?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
		geodata = await service.getGeodata(url, req.headers['accept-language']);
		if (geodata != '[[]]')
			service.writeCacheGeodata('PLACE', geodata);
		res.statusCode = 200;
		res.write(geodata, 'utf8');
	}
	res.end();
};
/**
 * 
 * @param {Types.req_microservice} req 
 * @param {Types.res_microservice} res 
 */
const getIp = async (req, res) => {
	let geodata;
	let url;
	geodata = await service.getCacheGeodata('IP', req.query.ip, '', '');
	if (geodata != null){
		res.statusCode = 200;
		res.write(geodata, 'utf8');
	}
	else{
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
	res.end();
};
startserver();
export {startserver};