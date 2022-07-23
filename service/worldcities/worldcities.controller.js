const { getService} = require ("./worldcities.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");
module.exports = {
	getCities: (req, res) => {
		getService((err, cities) => {
			if (err)
				return res.status(500).json(
					err
				);
			else{
				cities = JSON.parse(cities).filter(function(item) {
					return (item.iso2 == req.params.country);
				});	
				createLog({ app_id : req.query.app_id, 
							app_module : 'WORLDCITIES',
							app_module_type : 'CITIES', 
							app_module_request : req.params.country,
							app_module_result : null,
							app_user_id : req.query.app_user_id,
							user_language : null,
							user_timezone : null,
							user_number_system : null,
							user_platform : null,
							server_remote_addr : req.ip,
							server_user_agent : req.headers["user-agent"],
							server_http_host : req.headers["host"],
							server_http_accept_language : req.headers["accept-language"],
							client_latitude : null,
							client_longitude : null
							}, (err,results)  => {
								null;
				});
				return res.status(200).json(
						cities
				);
			}
		})
	}
};