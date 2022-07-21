const { getService, getTimezone} = require ("./geolocation.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getMessage } = require("../db/api/message_translation/message_translation.service");
const { getParameter } = require ("../db/api/app_parameter/app_parameter.service");
const { createLogAppSE } = require("../../service/log/log.controller");
function app_log(app_id, app_module_type, request, result, app_user_id,
				 user_language, user_timezone,user_number_system,user_platform,
				 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
				 client_latitude,client_longitude){
    const logData ={
        app_id : app_id,
        app_module : 'GEOLOCATION',
        app_module_type : app_module_type,
        app_module_request : request,
        app_module_result : result,
        app_user_id : app_user_id,
        user_language : user_language,
        user_timezone : user_timezone,
        user_number_system : user_number_system,
        user_platform : user_platform,
        server_remote_addr : server_remote_addr,
        server_user_agent : server_user_agent,
        server_http_host : server_http_host,
        server_http_accept_language : server_http_accept_language,
        client_latitude : client_latitude,
        client_longitude : client_longitude
    }
    createLog(logData, (err,results)  => {
        null;
    }); 
}
module.exports = {
	getPlace: (data, res) => {
		var geodata;
		var result;
		if (typeof data.query.latitude=='undefined' ||
			typeof data.query.longitude=='undefined' ||
			data.query.latitude=='undefined' ||
			data.query.longitude=='undefined'){
			 //Missing latitude or longitude
			 getMessage(20500, 
				process.env.MAIN_APP_ID, 
				data.query.lang_code, (err,results)  => {
					return res.status(500).send(
						results.text
						);
				});
			}
		else{	
			getParameter(process.env.MAIN_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_PLACE', (err, db_SERVICE_GEOLOCATION_URL_GPS_PLACE)=>{
				if (err) {
					createLogAppSE(data.query.app_id, __appfilename, __appfunction, __appline, err);
                }
                else{
					//service can return other formats, set json
					const url = `${db_SERVICE_GEOLOCATION_URL_GPS_PLACE}?format=json&lat=${data.query.latitude}&lon=${data.query.longitude}`;
					async function getasync(){
						geodata = await getService(url);
						app_log(data.query.app_id, 
								'PLACE',
								url,
								JSON.stringify(geodata),
								data.query.app_user_id,
								null,
								null,
								null,
								null,
								data.ip,
								data.headers["user-agent"],
								data.headers["host"],
								data.headers["accept-language"],
								geodata.geoplugin_latitude,
								geodata.geoplugin_longitude);
						return res.status(200).json(
							geodata
						)
					};
					getasync();
				}
			});
		}
	},
	getIp: (data, res, callBack) => {
		var geodata;
		var result;
		var url;
		getParameter(process.env.MAIN_APP_ID,'SERVICE_GEOLOCATION_URL_GPS_IP', (err, db_SERVICE_GEOLOCATION_URL_GPS_IP)=>{
			if (err) {
				createLogAppSE(data.query.app_id, __appfilename, __appfunction, __appline, err);
			}
			else{
				if (typeof data.query.ip == 'undefined')
					if (data.ip == '::1' || data.ip == '::ffff:127.0.0.1')
						url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=';
					else
						url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=' + data.ip;
				else
					url = db_SERVICE_GEOLOCATION_URL_GPS_IP + '?ip=' + data.query.ip;
				async function getasync(){
					geodata = await getService(url);
					app_log(data.query.app_id, 
							'IP',
							url,
							JSON.stringify(geodata),
							data.query.app_user_id,
							null,
							null,
							null,
							null,
							data.ip,
							data.headers["user-agent"],
							data.headers["host"],
							data.headers["accept-language"],
							geodata.geoplugin_latitude,
							geodata.geoplugin_longitude);
					if (data.query.callback==1)
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
			return res.status(200).json(
				result
			)
		})
	}
};