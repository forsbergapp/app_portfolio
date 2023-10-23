/** @module server/dbapi/app_portfolio/app_log */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./app_log.service.js');
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getLogsAdmin = (req, res) => {	
	service.getLogsAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.select_app_id), getNumberValue(req.query.year), getNumberValue(req.query.month), getNumberValue(req.query.sort), req.query.order_by, getNumberValue(req.query.offset), getNumberValue(req.query.limit))
	.then((result)=> {
		if (result.length>0)
			res.status(200).json({
				data: result
			});
		else{
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
			});
		}
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
const getStatUniqueVisitorAdmin = (req, res) => {
	service.getStatUniqueVisitorAdmin(getNumberValue(req.query.app_id), getNumberValue(req.query.select_app_id), getNumberValue(req.query.year), getNumberValue(req.query.month))
	.then((result)=> {
		if (result.length>0)
			res.status(200).json({
				data: result
			});
		else{
			import(`file://${process.cwd()}/server/dbapi/common/common.service.js`).then(({record_not_found}) => {
				record_not_found(res, getNumberValue(req.query.app_id), req.query.lang_code);
			});
		}
	})
	.catch((error)=> {
		res.status(500).send({
			data: error
		});
	});
};
export{getLogsAdmin, getStatUniqueVisitorAdmin};