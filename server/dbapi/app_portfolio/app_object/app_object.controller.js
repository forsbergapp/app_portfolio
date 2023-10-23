/** @module server/dbapi/app_portfolio/app_object */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./app_object.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getObjects = (req, res) => {
	service.getObjects(getNumberValue(req.query.app_id), req.params.lang_code, req.query.object ?? null, req.query.object_name ?? null)
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
export{getObjects};