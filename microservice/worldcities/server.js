/** @module microservice/worldcities */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./service.js');
const { getNumberValue, MicroServiceServer, IAM} = await import(`file://${process.cwd()}/microservice/microservice.service.js`);
/**
 * Starts the server
 */
const startserver = async () =>{
	const request = await MicroServiceServer('WORLDCITIES');
	request.server.createServer(request.options, (/**@type{Types.req_microservice}*/req, /**@type{Types.res_microservice}*/res) => {
		res.setHeader('Access-Control-Allow-Methods', 'GET');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Content-Type',  'application/json; charset=utf-8');
		const params = new URLSearchParams(req.url.substring(req.url.indexOf('?')));
		req.query = {	app_id:null,
						latitude:'',
						longitude:'',
						ip:'',
						limit:0};
		req.params = {	search:'',
						country:''};
		req.query.app_id = getNumberValue(params.get('app_id'));
		switch (true){
			case req.url.startsWith('/worldcities/city/search/'):{
				req.params.search = req.url.substring('/worldcities/city/search/'.length, req.url.indexOf('?'));
				if (params.get('limit'))
					req.query.limit = Number(params.get('limit'));
				else
					req.query.limit = 0;
				IAM(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/result)=>{
					if (result)
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
				IAM(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/result)=>{
					if (result)
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
				IAM(req.query.app_id, req.headers.authorization).then((/**@type{boolean}*/result)=>{
					if (result)
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
/**
 * 
 * @param {Types.req_microservice} req 
 * @param {Types.res_microservice} res 
 */
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
/**
 * 
 * @param {Types.req_microservice} req 
 * @param {Types.res_microservice} res 
 */
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
/**
 * 
 * @param {Types.req_microservice} req 
 * @param {Types.res_microservice} res 
 */
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
export{startserver};