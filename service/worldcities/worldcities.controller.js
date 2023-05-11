const service = await import('./worldcities.service.js')
const getCities = (req, res) => {
	service.getService(req.params.country,(err, cities) => {
		if (err)
			return res.status(500).json(
				err
			);
		else{
			return res.status(200).json(
				cities
			);
		}
	})
}
export{getCities};