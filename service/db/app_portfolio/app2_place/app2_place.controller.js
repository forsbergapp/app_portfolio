const service = await import("./app2_place.service.js");

const getPlace = (req, res) => {
	service.getPlace(req.query.app_id, (err, results) =>{
		if (err) {
			return res.status(500).send({
				data: err
			});
		}
		return res.status(200).json({
			places: results
		});
	});
}
export{getPlace};