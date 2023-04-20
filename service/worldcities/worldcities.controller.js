const service = await import('./worldcities.service.js')

const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);

const getCities = (req, res) => {
	service.getService((err, cities) => {
		if (err)
			return res.status(500).json(
				err
			);
		else{
			cities = JSON.parse(cities).filter((item) => {
				return (item.iso2 == req.params.country);
			});	
			import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_log/app_log.service.js`).then(({createLog}) => {
				createLog(req.query.app_id,
							{ app_id : req.query.app_id, 
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
								return res.status(200).json(
										cities
								);
				});
			})
		}
	})
}
export{getCities};