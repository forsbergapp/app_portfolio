const service = await import("./pdf.service.js");
const getPDF = async (req, res) => {
	service.getPDF(req.query.url + '&microservice=1',
				   req.query.ps, 			//papersize		A4, Letter
				   (req.query.hf==1))		//headerfooter	1/0
	.then((pdf) => {
		res.type('application/pdf');
		res.send(pdf);
	})
}		
export{getPDF};