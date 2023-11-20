/** @module server/dbapi/app_portfolio/user_account_app_setting_view */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const service = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account_app_setting_view.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

/**
 * 
 * @param {Types.req} req 
 * @param {Types.res} res 
 */
const insertUserSettingView = (req, res) => {
    /**@type{Types.db_parameter_user_account_app_setting_view_insertUserSettingView} */
    const data = {  client_ip:          req.ip,
                    client_user_agent:  req.headers['user-agent'],
                    client_longitude:   req.body.client_longitude,
                    client_latitude:    req.body.client_latitude,
                    user_account_id:    getNumberValue(req.body.user_account_id),
                    user_setting_id:    getNumberValue(req.body.user_setting_id)};
    service.insertUserSettingView(getNumberValue(req.query.app_id), data)
    .then((/**@type{Types.db_result_user_account_app_setting_view_insertUserSettingView}*/result)=>{
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
export{insertUserSettingView};