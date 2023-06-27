const service = await import('./db.service.js');

const DBInit = (req, res) => {
	service.DBInit(req.body.db)
	.then((result)=>{
		return res.status(200).send(result);
	})
	.catch(error=>{
		return res.status(500).send({
			data: error
		});
	});
};
const DBShutdown = (req, res) => {
	service.DBShutdown(req.body.db)
	.then((result)=>{
		return res.status(200).send(result);
	})
	.catch(error=>{
		return res.status(500).send({
			data: error
		});
	});
};
const pool_start = (req, res) => {
	service.pool_start(req.body)
	.then((result)=>{
		return res.status(200).send(result);
	})
	.catch(error=>{
		return res.status(500).send({
			data: error
		});
	});
};
const pool_close = (req, res) => {
	service.pool_close(req.body.pool_id, req.body.db_use, req.body.dba)
	.then((result)=>{
		return res.status(200).send(result);
	})
	.catch(error=>{
		return res.status(500).send({
			data: error
		});
	});
};
const pool_get = (req, res) => {
	let result;
	try {
		result = service.pool_get(req.body.pool_id, req.body.db_use, req.body.dba);
		return res.status(200).send(result);
	} catch (error) {
		return res.status(500).send({
			data: error
		});
	}
};
const db_query = (req, res) => {
	service.db_query(req.body.pool_id, req.body.db_use, req.body.sql, req.body.parameters, req.body.dba)
	.then(result=>{
		return res.status(200).send(result);
	})
	.catch(error=>{
		return res.status(500).send({
			data: error
		});
	});
};
export {DBInit, DBShutdown, pool_start, pool_close, pool_get, db_query};