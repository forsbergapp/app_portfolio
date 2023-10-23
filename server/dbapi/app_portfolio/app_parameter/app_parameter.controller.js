/** @module server/dbapi/app_portfolio/app_parameter */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./app_parameter.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getParameters_server = (req, res) => {
	service.getParameters_server(getNumberValue(req.query.app_id), getNumberValue(req.params.app_id))
	.then((result)=> {
		res.status(200).json({
			data: result
		});
	})
	.catch((error)=> {
		res.status(500).send({
			data: error
		});
	});
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getParametersAllAdmin = (req, res) => {
	service.getParametersAllAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.app_id), req.query.lang_code)
	.then((result)=> {
		res.status(200).json({
			data: result
		});
	})
	.catch((error)=> {
		res.status(500).send({
			data: error
		});
	});
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const setParameter_admin = (req, res) => {
	/**@type{Types.db_parameter_app_parameter_setParameter_admin} */
	const data = {	app_id: 			getNumberValue(req.body.app_id),
					parameter_type_id: 	req.body.parameter_type_id,
					parameter_name: 	req.body.parameter_name,
					parameter_value: 	req.body.parameter_value, 
					parameter_comment: 	req.body.parameter_comment
				};
	service.setParameter_admin(getNumberValue(req.query.app_id), data)
	.then((result)=> {
		res.status(200).json({
			data: result
		});
	})
	.catch((error)=> {
		res.status(500).send({
			data: error
		});
	});
};
export{getParameters_server, getParametersAllAdmin, setParameter_admin};