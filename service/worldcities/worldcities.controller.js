const { getService} = require ("./worldcities.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
function app_log(app_id, app_module_type, request, result, app_user_id,
				 user_language, user_timezone,user_number_system,user_platform,
				 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
				 client_latitude,client_longitude){
	const logData ={
		app_id : app_id,
		app_module : 'WORLDCITIES',
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
	getCities: (data, res) => {
		getService((err, cities) => {
			if (err)
				return res.status(500).json(
					err
				);
			else{
				cities = JSON.parse(cities).filter(function(item) {
					return (item.iso2 == data.params.country);
				});	
				app_log(data.query.app_id, 
						'CITIES', 
						data.params.country,
						null,
						data.query.app_user_id,
						null,
						null,
						null,
						null,
						data.ip,
						data.headers["user-agent"],
						data.headers["host"],
						data.headers["accept-language"],
						null, 
						null);
				return res.status(200).json(
						cities
				);
			}
		})
	}
};