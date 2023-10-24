/** @module server/dbapi/app_portfolio/message_translation */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./message_translation.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getMessage = (req, res) => {
	service.getMessage(getNumberValue(req.query.app_id), getNumberValue(req.query.data_app_id), req.params.code, req.query.lang_code)
	.then((/**@type{Types.db_result_message_translation_getMessage[]}*/result)=>{
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
export{getMessage};