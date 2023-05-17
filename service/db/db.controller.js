const service = await import('./db.service.js');

const start_pool_admin = (req, res) => {
	service.start_pool_admin(req.body)
	.then((result)=>{
		return res.status(200).json({
			data: result
		});
	})
	.catch(error=>{
		return res.status(500).send({
			data: error
		});
	})
}
const start_pool_apps = (req, res) => {
	service.start_pool_apps(req.body)
	.then((result)=>{
		return res.status(200).json({
			data: result
		});
	})
	.catch(error=>{
		return res.status(500).send({
			data: error
		});
	})
}
const close_pools = (req, res) => {
	service.stop(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}
const db_query = (req, res) => {
	service.sql(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
}

export{start_pool_admin, start_pool_apps, close_pools, db_query}