/** @module server/dbapi/app_portfolio/user_account_follow */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_follow.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const followUser = (req, res) => {
	service.followUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id),getNumberValue(req.body.user_account_id))
	.then((/**@type{Types.db_result_user_account_follow_followUser}*/result)=>{
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
const unfollowUser = (req, res) => {
	service.unfollowUser(getNumberValue(req.query.app_id), getNumberValue(req.params.id),getNumberValue(req.body.user_account_id))
	.then((/**@type{Types.db_result_user_account_follow_unfollowUser}*/result)=>{
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
export{followUser, unfollowUser};