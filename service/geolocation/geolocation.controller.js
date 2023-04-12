const service = await import('./geolocation.service.js')

const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const { createLogAdmin, createLog} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.service.js`);
const { check_internet } = await import(`file://${process.cwd()}/service/auth/auth.controller.js`);
const get_ip_url = (req_ip, query_ip) => {
	let url;
	if (typeof query_ip == 'undefined')
		if (req_ip == '::1' || req_ip == '::ffff:127.0.0.1')
			url = ConfigGet(1, 'SERVICE_GEOLOCATION', 'URL_GPS_IP') + '?ip=';
		else
			url = ConfigGet(1, 'SERVICE_GEOLOCATION', 'URL_GPS_IP') + '?ip=' + req_ip;
	else
		url = ConfigGet(1, 'SERVICE_GEOLOCATION', 'URL_GPS_IP') + '?ip=' + query_ip;
	return url;
}
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
	if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' && await check_internet(req)==1){
		let geodata;
		if (typeof req.query.latitude=='undefined' ||
			typeof req.query.longitude=='undefined' ||
			req.query.latitude=='undefined' ||
			req.query.longitude=='undefined'){
				//Missing latitude or longitude
				import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/message_translation/message_translation.service.js`).then(({getMessage}) => {
					getMessage(req.query.app_id,
						ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
						20500, 
						req.query.lang_code, (err,results)  => {
							return res.status(400).send(
								err ?? results.text
								);
						});	
				})
		}
		else{	
			
			//service can return other formats, set json
			const url = `${ConfigGet(1, 'SERVICE_GEOLOCATION', 'URL_GPS_PLACE')}?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
			geodata = await service.getService(url);
			createLog(req.query.app_id,
						{ app_id : req.query.app_id,
						app_module : 'GEOLOCATION',
						app_module_type : 'PLACE',
						app_module_request : url,
						app_module_result : JSON.stringify(geodata),
						app_user_id : req.query.app_user_id,
						user_language : null,
						user_timezone : null,
						user_number_system : null,
						user_platform : null,
						server_remote_addr : req.ip,
						server_user_agent : req.headers["user-agent"],
						server_http_host : req.headers["host"],
						server_http_accept_language : req.headers["accept-language"],
						client_latitude : geodata.geoplugin_latitude,
						client_longitude : geodata.geoplugin_longitude
						}, (err,results)  => {
							return res.status(200).json(
								geodata
							)
						});
		}
	}
	else
		return res.status(200).json(
			geodata_empty('place')
		)
}
const getPlaceAdmin = async (req, res) => {
	let geodata;
	if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' && await check_internet(req)==1){
		if (typeof req.query.latitude=='undefined' ||
			typeof req.query.longitude=='undefined' ||
			req.query.latitude=='undefined' ||
			req.query.longitude=='undefined'){
				import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/message_translation/message_translation.service.js`).then(({getMessage_admin}) => {
					//Missing latitude or longitude
					getMessage_admin(req.query.app_id,
						ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'), 
						20500, 
						req.query.lang_code, (err,results)  => {
							return res.status(400).send(
								err ?? results.text
								);
						});
				})
		}
		else{
			//service can return other formats, set json
			const url = `${ConfigGet(1, 'SERVICE_GEOLOCATION', 'URL_GPS_PLACE')}?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
			geodata = await service.getService(url);
			createLogAdmin(req.query.app_id,
							{ app_id : ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
								app_module : 'GEOLOCATION',
								app_module_type : 'PLACE',
								app_module_request : url,
								app_module_result : JSON.stringify(geodata),
								app_user_id : req.query.app_user_id,
								user_language : null,
								user_timezone : null,
								user_number_system : null,
								user_platform : null,
								server_remote_addr : req.ip,
								server_user_agent : req.headers["user-agent"],
								server_http_host : req.headers["host"],
								server_http_accept_language : req.headers["accept-language"],
								client_latitude : geodata.geoplugin_latitude,
								client_longitude : geodata.geoplugin_longitude
								}, (err,results)  => {
									return res.status(200).json(
										geodata
									)
							});
		};
	}
	else
		return res.status(200).json(
			geodata_empty('place')
		)
}
const getPlaceSystemAdmin = async (req, res) => {
	let geodata;
	if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' && await check_internet(req)==1){
		if (typeof req.query.latitude=='undefined' ||
			typeof req.query.longitude=='undefined' ||
			req.query.latitude=='undefined' ||
			req.query.longitude=='undefined'){
			return res.status(400).send(
				'Missing latitude or longitude'
			);
		}
		else{
			//service can return other formats, set json
			const url = `${ConfigGet(1, 'SERVICE_GEOLOCATION', 'URL_GPS_PLACE')}?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
			geodata = await service.getService(url);
			let stack = new Error().stack;
			import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
				import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppC}) => {
					createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
								  'SYSTEM ADMIN getPlaceSystemAdmin',
								  req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
								  res.statusCode, 
								  req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
						return res.status(200).json(
							geodata
						)
					})
				});
			})
		}
	}
	else
		return res.status(200).json(
			geodata_empty('place')
		)
}
const getIp = async (req, res, callBack) => {
	let geodata;
	let url = get_ip_url(req.ip, req.query.ip);
	if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' && await check_internet(req)==1){
		geodata = await service.getService(url);
		createLog(req.query.app_id,
				{ app_id : req.query.app_id,
					app_module : 'GEOLOCATION',
					app_module_type : 'IP',
					app_module_request : url,
					app_module_result : JSON.stringify(geodata),
					app_user_id : req.query.app_user_id,
					user_language : null,
					user_timezone : null,
					user_number_system : null,
					user_platform : null,
					server_remote_addr : req.ip,
					server_user_agent : req.headers["user-agent"],
					server_http_host : req.headers["host"],
					server_http_accept_language : req.headers["accept-language"],
					client_latitude : geodata.geoplugin_latitude,
					client_longitude : geodata.geoplugin_longitude
					}, (err,results)  => {
						if (req.query.callback==1)
							return callBack(null, geodata);
						else
							return res.status(200).json(
									geodata
							);
					});
	}
	else
		if (req.query.callback==1)
			return callBack(null, geodata_empty('ip'));
		else
			return res.status(200).json(
				geodata_empty('ip')
			)
}
const getIpAdmin = async (req, res, callBack) => {
	let geodata;
	let url = get_ip_url(req.ip, req.query.ip);
	if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' && await check_internet(req)==1){
		geodata = await service.getService(url);
		createLogAdmin(req.query.app_id,
						{ app_id : req.query.app_id,
							app_module : 'GEOLOCATION',
							app_module_type : 'IP',
							app_module_request : url,
							app_module_result : JSON.stringify(geodata),
							app_user_id : req.query.app_user_id,
							user_language : null,
							user_timezone : null,
							user_number_system : null,
							user_platform : null,
							server_remote_addr : req.ip,
							server_user_agent : req.headers["user-agent"],
							server_http_host : req.headers["host"],
							server_http_accept_language : req.headers["accept-language"],
							client_latitude : geodata.geoplugin_latitude,
							client_longitude : geodata.geoplugin_longitude
							}, (err,results)  => {
								if (req.query.callback==1)
									return callBack(null, geodata);
								else
									return res.status(200).json(
											geodata
									);
						});
	}
	else
		if (req.query.callback==1)
			return callBack(null, geodata_empty('ip'));
		else
			return res.status(200).json(
				geodata_empty('ip')
			)
}
const getIpSystemAdmin = async (req, res, callBack) => {
	let geodata;
	let url = get_ip_url(req.ip, req.query.ip);
	if (ConfigGet(1, 'SERVICE_AUTH', 'ENABLE_GEOLOCATION')=='1' && await check_internet(req)==1){
		geodata = await service.getService(url);
		let stack = new Error().stack;
		import(`file://${process.cwd()}/service/common/common.service.js`).then(({COMMON}) => {
			import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogAppC}) => {
				createLogAppC(req.query.app_id, ConfigGet(1, 'SERVICE_LOG', 'LEVEL_INFO'), COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), 
							  'SYSTEM ADMIN getIpSystemAdmin',
							  req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
							  res.statusCode, 
							  req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
					if (req.query.callback==1)
						return callBack(null, geodata);
					else
						return res.status(200).json(
								geodata
						);
				})
			});
		})
	}
	else
		if (req.query.callback==1)
			return callBack(null, geodata_empty('ip'));
		else
			return res.status(200).json(
				geodata_empty('ip')
			)
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

export {getPlace, getPlaceAdmin, getPlaceSystemAdmin, getIp, getIpAdmin, getIpSystemAdmin, getTimezone, getTimezoneAdmin, getTimezoneSystemAdmin}