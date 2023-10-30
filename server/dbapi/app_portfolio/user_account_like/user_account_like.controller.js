/** @module server/dbapi/app_portfolio/user_account_like */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../../types.js';

const service = await import('./user_account_like.service.js');

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const likeUser = (req, res) => {
	service.likeUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id),getNumberValue(req.body.user_account_id))
	.then((/**@type{Types.db_result_user_account_like_likeUser}*/result)=>{
		res.status(200).json({
			count: result.affectedRows,
			items: Array(result)
		});
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send(
			error
		);
	});
};
/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const unlikeUser = (req, res) => {
	service.unlikeUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id),getNumberValue(req.body.user_account_id))
	.then((/**@type{Types.db_result_user_account_like_unlikeUser}*/result)=>{
		res.status(200).json({
			count: result.affectedRows,
			items: Array(result)
		});
	})
	.catch((/**@type{Types.error}*/error)=>{
		res.status(500).send(
			error
		);
	});
};
export{likeUser, unlikeUser};