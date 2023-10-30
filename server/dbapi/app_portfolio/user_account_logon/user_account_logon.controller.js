/** @module server/dbapi/app_portfolio/user_account_logon */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./user_account_logon.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const getUserAccountLogonAdmin = (req, res) => {
	service.getUserAccountLogonAdmin(getNumberValue(req.query.app_id), getNumberValue(req.params.user_account_id), getNumberValue(req.params.app_id=='\'\''?'':req.params.app_id))
	.then((/**@type{Types.db_result_user_account_logon_getUserAccountLogonAdmin[]}*/result)=>{
		res.status(200).json({
			data: result
		});
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send({
			data: error
		});
	});
};
export{getUserAccountLogonAdmin};