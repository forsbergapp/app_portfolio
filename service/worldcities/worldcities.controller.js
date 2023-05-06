const service = await import('./worldcities.service.js')
const getCities = (req, res) => {
	service.getService((err, cities) => {
		if (err)
			return res.status(500).json(
				err
			);
		else{
			cities = JSON.parse(cities).filter((item) => item.iso2 == req.params.country);	
			return res.status(200).json(
				cities
			);
		}
	})
}
export{getCities};