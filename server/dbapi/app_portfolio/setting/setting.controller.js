/** @module server/dbapi/app_portfolio/setting */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./setting.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getSettings = (req, res) => {
	service.getSettings(getNumberValue(req.query.app_id), req.query.lang_code, req.query.setting_type ?? req.query.setting_type==''?null:req.query.setting_type)
	.then((/**@type{Types.db_result_setting_getSettings[]}*/result)=>{
		res.status(200).json({
			settings: result
		});
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send({
			data: error
		});
	});
};
export{getSettings};