const { getService} = require ("./worldcities.service");
const { createLog} = require ("../../service/db/api/app_log/app_log.service");

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
		
				data.body.app_id 					  = data.query.app_id;
				data.body.app_module				  = 'WORLDCITIES';
				data.body.app_module_type			  = 'WORLDCITIES_CITIES';
				data.body.app_module_request		  = data.params.country;
				data.body.app_module_result			  = '';
				data.body.app_user_id				  = data.query.app_user_id;
				data.body.server_remote_addr 		  = data.ip;
				data.body.server_user_agent 		  = data.headers["user-agent"];
				data.body.server_http_host 			  = data.headers["host"];
				data.body.server_http_accept_language = data.headers["accept-language"];
				createLog(data.body, (err2,results2)  => {
					null;
				}); 
				return res.status(200).json(
						cities
				);
			}
		})
	}
};