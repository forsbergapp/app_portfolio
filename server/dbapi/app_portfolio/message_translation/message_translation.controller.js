const service = await import('./message_translation.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getMessage = (req, res) => {
	service.getMessage(getNumberValue(req.query.app_id), getNumberValue(req.query.data_app_id), req.params.code, req.query.lang_code, (err, result) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json(
			result
		);
	});
};
export{getMessage};