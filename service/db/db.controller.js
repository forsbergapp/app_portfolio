const service = await import('./db.service.js');

const DBInit = (req, res) => {
	service.DBInit(req.body.db)
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
const DBShutdown = (req, res) => {
	service.DBShutdown(req.body.db)
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
const pool_start = (req, res) => {
	service.DBShutdown(req.body)
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
const pool_close = (req, res) => {
	service.pool_close(req.body.pool_id, req.body.db_use, req.body.dba)
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
const pool_get = (req, res) => {
	service.pool_get(req.body.pool_id, req.body.db_use, req.body.dba)
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
const pool_check_started = (req, res) => {
	service.pool_check_started(req.body.pool_id, req.body.db_use, req.body.dba)
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

export{DBInit, DBShutdown, pool_start, pool_close, pool_get, pool_check_started, db_query}