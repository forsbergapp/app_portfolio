const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const followUser = (app_id, id, id_follow, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${db_schema()}.user_account_follow(
							user_account_id, user_account_id_follow, date_created)
				VALUES(:user_account_id,:user_account_id_follow, CURRENT_TIMESTAMP)`;
		parameters = {
						user_account_id: id,
						user_account_id_follow: id_follow
						};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
const unfollowUser = (app_id, id, id_unfollow, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${db_schema()}.user_account_follow
				WHERE user_account_id = :user_account_id
				  AND user_account_id_follow = :user_account_id_follow`;
		parameters = {
						user_account_id: id,
						user_account_id_follow: id_unfollow
						};
		let stack = new Error().stack;
		import(`file://${process.cwd()}/server/server.service.js`).then(({COMMON}) => {
			db_execute(app_id, sql, parameters, null, COMMON.app_filename(import.meta.url), COMMON.app_function(stack), COMMON.app_line(), (err, result)=>{
				if (err)
					return callBack(err, null);
				else
					return callBack(null, result);
			});
		})
	}
export{followUser, unfollowUser};