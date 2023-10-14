const service = await import('./admin.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const DBInfo = (req, res) => {
	service.DBInfo(getNumberValue(req.query.app_id), (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});	
};
const DBInfoSpace = (req, res) => {
	service.DBInfoSpace(getNumberValue(req.query.app_id), (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
const DBInfoSpaceSum = (req, res) => {
	service.DBInfoSpaceSum(getNumberValue(req.query.app_id), (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
const demo_add = async (req, res)=> {
	service.demo_add(getNumberValue(req.query.app_id), req.body.demo_password, req.query.lang_code, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json(results);
	});
};
const demo_delete = async (req, res)=> {
	service.demo_delete(getNumberValue(req.query.app_id), (err, result_demo_users_length) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			count_deleted: result_demo_users_length
		});
	});
};
const demo_get = async (req, res)=> {
	service.demo_get(getNumberValue(req.query.app_id), (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: results
		});
	});
};
const install_db = (req, res) =>{
	service.install_db(getNumberValue(req.query.app_id),getNumberValue(req.query.optional), (err, results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
};
const install_db_check = (req, res) =>{
	service.install_db_check(getNumberValue(req.query.app_id), (err, results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
};
const install_db_delete = (req, res) =>{
	service.install_db_delete(getNumberValue(req.query.app_id), (err, results) =>{
		if (err)
			return res.status(500).send({
				data: err
			});
		else
			return res.status(200).json(results);
	});
};


export{
	DBInfo, DBInfoSpace, DBInfoSpaceSum, 
	demo_add, demo_delete, demo_get, 
	install_db, install_db_check, install_db_delete
};