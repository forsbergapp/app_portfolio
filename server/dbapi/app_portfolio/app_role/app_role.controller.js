/** @module server/dbapi/app_portfolio/app_role */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./app_role.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getAppRoleAdmin = (req, res) => {
	service.getAppRoleAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.id))
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
export{getAppRoleAdmin};