const service = await import('./admin.service.js');

const DBInfo = (req, res) => {
	service.DBInfo(req.query.app_id, (err, results) =>{
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
const DBInfoSpace = (req, res) => {
	service.DBInfoSpace(req.query.app_id, (err, results) =>{
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
const DBInfoSpaceSum = (req, res) => {
	service.DBInfoSpaceSum(req.query.app_id, (err, results) =>{
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
const DBStart = async (req, res, callBack) => {
	service.DBStart(req.query.app_id, (err, results) =>{
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
const DBStop = (req, res) => {
	service.DBStop(req.query.app_id, (err, results) =>{
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
const demo_add = async (req, res)=> {
	service.demo_add(req.query.app_id, req.body.demo_password, req.query.lang_code, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json(results);
	});
}
const demo_delete = async (req, res)=> {
	service.demo_delete(req.query.app_id, (err, result_demo_users_length) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			count_deleted: result_demo_users_length
		});
	});
}
const demo_get = async (req, res)=> {
	service.demo_get(req.query.app_id, (err, results) =>{
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
const install_db = (req, res) =>{
	service.install_db(req.query.app_id,req.query.optional, (err, results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
}
const install_db_check = (req, res) =>{
	service.install_db_check(req.query.app_id, (err, results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
}
const install_db_delete = (req, res) =>{
	service.install_db_delete(req.query.app_id, (err, results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
}


export{DBInfo, DBInfoSpace, DBInfoSpaceSum, DBStart, DBStop, 
	   demo_add, demo_delete, demo_get, 
	   install_db, install_db_check, install_db_delete}