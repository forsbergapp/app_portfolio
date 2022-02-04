const { getService} = require ("./geolocation.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getMessage } = require("../db/api/message_translation/message_translation.service");
module.exports = {
	getPlace: async (data, res) => {
		var geodata;
		var result;
		if (typeof data.query.latitude=='undefined' ||
			typeof data.query.longitude=='undefined' ||
			data.query.latitude=='undefined' ||
			data.query.longitude=='undefined'){
			 //Missing latitude or longitude
			 getMessage(20500, 
				data.query.app_id, 
				'en', (err,results)  => {
					return res.status(500).send(
						results.text
						);
				});
			}
		else{	
			//service can return other formats, set json
			const url = process.env.APP_SERVICE_URL_GPS_PLACE + 
						'?format=json' +
						'&lat=' + data.query.latitude +
						'&lon=' + data.query.longitude;
			geodata = await getService(url);

			data.body.app_id 					  = data.query.app_id;
			data.body.app_module				  = 'GEOLOCATION';
			data.body.app_module_type			  = 'GEOLOCATION_PLACE';
			data.body.app_module_request		  = url;
			data.body.app_module_result			  = JSON.stringify(geodata);
			data.body.app_user_id				  = data.query.app_user_id;
			data.body.server_remote_addr 		  = data.ip;
			data.body.server_user_agent 		  = data.headers["user-agent"];
			data.body.server_http_host 			  = data.headers["host"];
			data.body.server_http_accept_language = data.headers["accept-language"];
			data.body.user_gps_latitude			  = geodata.geoplugin_latitude;
			data.body.user_gps_longitude		  = geodata.geoplugin_longitude;
			createLog(data.body, (err2,results2)  => {
				null;
			}); 
			return res.status(200).json(
				geodata
		);
	};
	
	},
	getIp: async (data, res) => {
		var geodata;
		var result;
		var url;
		if (typeof data.query.ip == 'undefined')
			if (data.ip == '::1' || data.ip == '::ffff:127.0.0.1')
				url = process.env.APP_SERVICE_URL_GPS_IP + '?ip=';
			else
				url = process.env.APP_SERVICE_URL_GPS_IP + '?ip=' + data.ip;
		else
			url = process.env.APP_SERVICE_URL_GPS_IP + '?ip=' + data.query.ip;
		geodata = await getService(url);
		data.body.app_id 					  = data.query.app_id;
		data.body.app_module				  = 'GEOLOCATION';
		data.body.app_module_type			  = 'GEOLOCATION_IP';
		data.body.app_module_request		  = url;
		data.body.app_module_result			  = JSON.stringify(geodata);
		data.body.app_user_id				  = data.query.app_user_id;
		data.body.server_remote_addr 		  = data.ip;
		data.body.server_user_agent 		  = data.headers["user-agent"];
		data.body.server_http_host 			  = data.headers["host"];
		data.body.server_http_accept_language = data.headers["accept-language"];
		data.body.user_gps_latitude			  = geodata.geoplugin_latitude;
		data.body.user_gps_longitude		  = geodata.geoplugin_longitude;

		createLog(data.body, (err2,results2)  => {
			null;
		}); 

		return res.status(200).json(
				geodata
		);
	}
};