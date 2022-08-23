const { getService, getTimezone} = require ("./geolocation.service");
const { createLogAdmin, createLog} = require ("../../service/db/app_portfolio/app_log/app_log.service");
const { getMessage } = require("../db/app_portfolio/message_translation/message_translation.service");
const { getParameter_admin, getParameter } = require ("../db/app_portfolio/app_parameter/app_parameter.service");
const { createLogAppSE } = require("../../service/log/log.controller");
module.exports = {
	getPlace: (req, res) => {
		var geodata;
		if (typeof req.query.latitude=='undefined' ||
			typeof req.query.longitude=='undefined' ||
			req.query.latitude=='undefined' ||
			req.query.longitude=='undefined'){
			 //Missing latitude or longitude
			 getMessage(20500, 
				process.env.COMMON_APP_ID, 
				req.query.lang_code, (err,results)  => {
					return res.status(400).send(
						results.text
						);
				});
			}
		else{	
			getParameter(process.env.COMMON_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_PLACE', req.query.app_id, (err, db_SERVICE_GEOLOCATION_URL_GPS_PLACE)=>{
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
						createLog({ app_id : req.query.app_id,
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
									}, req.query.app_id, (err,results)  => {
										null;
						});
						return res.status(200).json(
							geodata
						)
					};
					getasync();
				}
			});
		}
	},
	getPlaceAdmin: (req, res) => {
		var geodata;
		if (typeof req.query.latitude=='undefined' ||
			typeof req.query.longitude=='undefined' ||
			req.query.latitude=='undefined' ||
			req.query.longitude=='undefined'){
			 //Missing latitude or longitude
			 getMessage(20500, 
				process.env.COMMON_APP_ID, 
				req.query.lang_code, (err,results)  => {
					return res.status(400).send(
						results.text
						);
				});
			}
		else{	
			getParameter_admin(process.env.COMMON_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_PLACE', (err, db_SERVICE_GEOLOCATION_URL_GPS_PLACE)=>{
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
						createLogAdmin({ app_id : process.env.COMMON_APP_ID,
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
									}, req.query.app_id, (err,results)  => {
										null;
						});
						return res.status(200).json(
							geodata
						)
					};
					getasync();
				}
			});
		}
	},
	getIp: (req, res, callBack) => {
		var geodata;
		var url;
		getParameter(process.env.COMMON_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_IP', req.query.app_id, (err, db_SERVICE_GEOLOCATION_URL_GPS_IP)=>{
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
					createLog({ app_id : req.query.app_id,
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
								}, req.query.app_id, (err,results)  => {
									null;
					});
					if (req.query.callback==1)
						return callBack(null, geodata);
					else
						return res.status(200).json(
								geodata
						);
				};
				getasync();
			}
		});
	},
	getIpAdmin: (req, res, callBack) => {
		var geodata;
		var url;
		getParameter_admin(process.env.COMMON_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_IP', (err, db_SERVICE_GEOLOCATION_URL_GPS_IP)=>{
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
					createLogAdmin({ app_id : process.env.COMMON_APP_ID,
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
								}, req.query.app_id, (err,results)  => {
									null;
					});
					if (req.query.callback==1)
						return callBack(null, geodata);
					else
						return res.status(200).json(
								geodata
						);
				};
				getasync();
			}
		});
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