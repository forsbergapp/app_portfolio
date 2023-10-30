/** @module server/dbapi/app_portfolio/app */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./app.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getApp = (req, res) => {
	service.getApp(getNumberValue(req.query.app_id), getNumberValue(req.query.id), req.query.lang_code)
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
const getAppsAdmin = (req, res) => {
	service.getAppsAdmin(getNumberValue(req.query.app_id), req.query.lang_code)
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
const updateAppAdmin = (req, res) => {
	/**@type{Types.db_parameter_app_updateAppAdmin} */
	const data = {	app_name:		req.body.app_name,
					url: 			req.body.url,
					logo: 			req.body.logo,
					enabled: 		getNumberValue(req.body.enabled),
					app_category_id:getNumberValue(req.body.app_category_id)};
	service.updateAppAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.id), data)
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
export{getApp, getAppsAdmin, updateAppAdmin};