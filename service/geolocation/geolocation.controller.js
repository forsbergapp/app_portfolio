const { getService, getTimezone} = require ("./geolocation.service");
const { createLogAdmin, createLog} = require ("../../service/db/app_portfolio/app_log/app_log.service");
const { getMessage, getMessage_admin } = require("../db/app_portfolio/message_translation/message_translation.service");
const { getParameter_admin, getParameter } = require ("../db/app_portfolio/app_parameter/app_parameter.service");
const { createLogAppSE } = require("../../service/log/log.controller");
const { check_internet } = require("../auth/auth.controller");
function geodata_empty(geotype){
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
module.exports = {
	getPlace: async (req, res) => {
		if (process.env.SERVICE_AUTH_ENABLE_GEOLOCATION==1 && await check_internet(req)==1){
			var geodata;
			if (typeof req.query.latitude=='undefined' ||
				typeof req.query.longitude=='undefined' ||
				req.query.latitude=='undefined' ||
				req.query.longitude=='undefined'){
				//Missing latitude or longitude
				getMessage(req.query.app_id,
							process.env.COMMON_APP_ID, 
							20500, 
							req.query.lang_code, (err,results)  => {
								return res.status(400).send(
									err ?? results.text
									);
							});
				}
			else{	
				getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_PLACE',  (err, db_SERVICE_GEOLOCATION_URL_GPS_PLACE)=>{
					if (err) {
						createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
							return callBack(err, null);
						})
					}
					else{
						//service can return other formats, set json
						const url = `${db_SERVICE_GEOLOCATION_URL_GPS_PLACE}?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
						async function getasync(){
							geodata = await getService(url);
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
						};
						getasync();
					}
				});
			}
		}
		else
			return res.status(200).json(
				geodata_empty('place')
			)
	},
	getPlaceAdmin: async (req, res) => {
		var geodata;
		if (process.env.SERVICE_AUTH_ENABLE_GEOLOCATION==1 && await check_internet(req)==1){
			if (typeof req.query.latitude=='undefined' ||
				typeof req.query.longitude=='undefined' ||
				req.query.latitude=='undefined' ||
				req.query.longitude=='undefined'){
				//Missing latitude or longitude
				getMessage_admin(req.query.app_id,
								process.env.COMMON_APP_ID, 
								20500, 
								req.query.lang_code, (err,results)  => {
									return res.status(400).send(
										err ?? results.text
										);
								});
				}
			else{	
				getParameter_admin(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_PLACE', (err, db_SERVICE_GEOLOCATION_URL_GPS_PLACE)=>{
					if (err) {
						createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
							return callBack(err, null);
						})
					}
					else{
						//service can return other formats, set json
						const url = `${db_SERVICE_GEOLOCATION_URL_GPS_PLACE}?format=json&lat=${req.query.latitude}&lon=${req.query.longitude}`;
						async function getasync(){
							geodata = await getService(url);
							createLogAdmin(req.query.app_id,
											{ app_id : process.env.COMMON_APP_ID,
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
						getasync();
					}
				});
			}
		}
		else
			return res.status(200).json(
				geodata_empty('place')
			)
	},
	getIp: async (req, res, callBack) => {
		var geodata;
		var url;
		if (process.env.SERVICE_AUTH_ENABLE_GEOLOCATION==1 && await check_internet(req)==1){
			getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_IP',  (err, db_SERVICE_GEOLOCATION_URL_GPS_IP)=>{
				if (err) {
					createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
						return callBack(err, null);
					})
				}
				else{
					if (typeof req.query.ip == 'undefined')
						if (req.ip == '::1' || req.ip == '::ffff:127.0.0.1')
							url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=';
						else
							url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=' + req.ip;
					else
						url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=' + req.query.ip;
					async function getasync(){
						geodata = await getService(url);
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
					};
					getasync();
				}
			});
		}
		else
			if (req.query.callback==1)
				return callBack(null, geodata_empty('ip'));
			else
				return res.status(200).json(
					geodata_empty('ip')
				)
	},
	getIpAdmin: async (req, res, callBack) => {
		var geodata;
		var url;
		if (process.env.SERVICE_AUTH_ENABLE_GEOLOCATION==1 && await check_internet(req)==1){
			getParameter_admin(req.query.app_id, process.env.COMMON_APP_ID, 'SERVICE_GEOLOCATION_URL_GPS_IP', (err, db_SERVICE_GEOLOCATION_URL_GPS_IP)=>{
				if (err) {
					createLogAppSE(req.query.app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
						return callBack(err, null);
					})
				}
				else{
					if (typeof req.query.ip == 'undefined')
						if (req.ip == '::1' || req.ip == '::ffff:127.0.0.1')
							url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=';
						else
							url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=' + req.ip;
					else
						url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=' + req.query.ip;
					async function getasync(){
						geodata = await getService(url);
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
					};
					getasync();
				}
			});
		}
		else
			if (req.query.callback==1)
				return callBack(null, geodata_empty('ip'));
			else
				return res.status(200).json(
					geodata_empty('ip')
				)
	},
	getTimezone: (req, res) =>{
		getTimezone(req.query.latitude, req.query.longitude, (err, result)=>{
			return res.status(200).send(
				result
			)
		})
	},
	getTimezoneAdmin: (req, res) =>{
		getTimezone(req.query.latitude, req.query.longitude, (err, result)=>{
			return res.status(200).send(
				result
			)
		})
	}
};