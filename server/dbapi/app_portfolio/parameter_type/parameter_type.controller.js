/** @module server/dbapi/app_portfolio/parameter_type */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./parameter_type.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getParameterTypeAdmin = (req, res) => {
	service.getParameterTypeAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.id), req.query.lang_code)
	.then((/**@type{Types.db_result_parameter_type_getParameterTypeAdmin[]}*/result)=>{
		res.status(200).json(
			result[0]
		);
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send({
			data: error
		});
	});
};
export{getParameterTypeAdmin};