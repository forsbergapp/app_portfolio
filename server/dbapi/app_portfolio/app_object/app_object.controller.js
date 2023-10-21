const service = await import('./app_object.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getObjects = (req, res) => {
	if (typeof req.query.object =='undefined')
		req.query.object=null;
	if (typeof req.query.object_name =='undefined')
		req.query.object_name=null;
	service.getObjects(getNumberValue(req.query.app_id), req.params.lang_code, req.query.object, req.query.object_name, (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			data: result
		});
	});
};
export{getObjects};