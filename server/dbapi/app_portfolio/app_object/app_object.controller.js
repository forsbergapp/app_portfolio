const service = await import("./app_object.service.js");

const getObjects = (req, res) => {
	if (typeof req.query.object =='undefined')
		req.query.object=null;
	if (typeof req.query.object_name =='undefined')
		req.query.object_name=null;
	service.getObjects(req.query.app_id, req.params.lang_code, req.query.object, req.query.object_name, (err, results) =>{
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
export{getObjects};