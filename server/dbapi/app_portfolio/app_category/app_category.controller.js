/** @module server/dbapi/app_portfolio/app_category */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./app_category.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getAppCategoryAdmin = (req, res) => {
	service.getAppCategoryAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.id), req.query.lang_code)
	.then((result)=> {
		return res.status(200).json({
			data: result
		});
	})
	.catch((error)=> {
		return res.status(500).send({
			data: error
		});
	});
};
export{getAppCategoryAdmin};