const {db_execute, db_schema} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

const likeUserSetting = (app_id, id, id_like, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${db_schema()}.user_account_app_setting_like(
					user_account_app_user_account_id, user_account_app_setting_id, user_account_app_app_id, date_created)
				VALUES(:user_account_id,:user_setting_id, :app_id, CURRENT_TIMESTAMP) `;
		parameters = {
						user_account_id: id,
						user_setting_id: id_like,
						app_id: app_id
					};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
const unlikeUserSetting = (app_id, id, id_unlike, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${db_schema()}.user_account_app_setting_like
				WHERE user_account_app_user_account_id = :user_account_id
				AND user_account_app_setting_id = :user_setting_id 
				AND user_account_app_app_id = :app_id`;
		parameters = {
						user_account_id: id,
						user_setting_id: id_unlike,
						app_id: app_id
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
export{likeUserSetting, unlikeUserSetting};