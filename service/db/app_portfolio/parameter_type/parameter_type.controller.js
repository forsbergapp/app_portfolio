const { getParameterType} = require ("./parameter_type.service");

module.exports = {
	getParameterType: (req, res) => {
		if (typeof req.query.id == 'undefined')
			req.query.id = null;
		getParameterType(req.query.app_id, req.query.id,(err, results) =>{
			if (err) {
				return res.status(500).send({
					data: err
				});
			}
			else{
                if (results.length>0)
                    return res.status(200).json({
						data: results
                    });
                else{
                    const { getMessage_admin } = require("../../app_portfolio/message_translation/message_translation.service");
                    //Record not found
                    getMessage_admin(req.query.app_id,
                                     process.env.COMMON_APP_ID,
                                     20400, 
                                     req.query.lang_code, (err,results2)  => {
                                        return res.status(404).send(
                                                err ?? result_message.text
                                        );
                                     });
                }
            }
		});
	}
}