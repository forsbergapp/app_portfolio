/** @module server/log */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const service = await import('./log.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * Get log parameters
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getLogParameters = (req, res) => {
	service.getLogParameters(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, result) =>{
		if (err)
			res.status(500).send({
				data: err
			});
		else
			res.status(200).json({
				data: result
			});
	});
};
/**
 * Get logs
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getLogs = (req, res) => {
	/**@type{Types.admin_log_data_parameters} */
	const data = {	app_id:			getNumberValue(req.query.app_id),
					select_app_id:	getNumberValue(req.query.select_app_id),
					logscope:		req.query.logscope,
					loglevel:		req.query.loglevel,
					search:			req.query.search,
					sort:			req.query.sort,
					order_by:		req.query.order_by,
					year: 			req.query.year.toString(),
					month:			req.query.month.toString(),
					day:			req.query.day,
					};
	service.getLogs(getNumberValue(req.query.app_id), data, (/**@type{Types.error}*/err, result) =>{
		if (err)
			res.status(500).send(
				err
			);
		else{
			if (result.length>0)
				res.status(200).json({
					data: result
				});
			else{
				res.status(404).send(
					'Record not found'
				);
			}
		}
	});
};
/**
 * Get status codes
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getStatusCodes = async (req, res) =>{
	const status_codes = await service.getStatusCodes();
	service.getStatusCodes().then(()=>{
		res.status(200).json({
			status_codes: status_codes
		});
	});

};
/**
 * Get log stat
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getLogsStats = async (req, res) => {
	/**@type{Types.log_parameter_getLogStats} */
	const data = {	app_id:			getNumberValue(req.query.select_app_id),
					code:			getNumberValue(req.query.code),
					year: 			getNumberValue(req.query.year),
					month:			getNumberValue(req.query.month)
					};
	service.getLogsStats(getNumberValue(req.query.app_id), data, (/**@type{Types.error}*/err, result) =>{
		if (err)
			res.status(500).send(
				err
			);
		else{
			if (result.length>0)
				res.status(200).json({
					data: result
				});
			else{
				res.status(404).send(
					'Record not found'
				);
			}
		}
	});
};
/**
 * Get log files
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getFiles = (req, res) => {
	service.getFiles(getNumberValue(req.query.app_id), (/**@type{Types.error}*/err, result) =>{
		if (err)
			res.status(500).send(
				err
			);
		else{
			if (result.length>0)
				res.status(200).json({
					data: result
				});
			else{
				res.status(404).send(
					'Record not found'
				);
			}
		}
	});
};
export {getLogParameters,getLogs, getStatusCodes, getLogsStats, getFiles};