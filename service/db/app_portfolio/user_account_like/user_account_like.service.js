const { ConfigGet } = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db/common/common.service.js`);

const likeUser = (app_id, id, id_like, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${db_schema()}.user_account_like(
							user_account_id, user_account_id_like, date_created)
				VALUES(:user_account_id,:user_account_id_like, CURRENT_TIMESTAMP) `;
		parameters = {
						user_account_id: id,
						user_account_id_like: id_like
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
const unlikeUser = (app_id, id, id_unlike, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${db_schema()}.user_account_like
				WHERE user_account_id = :user_account_id
				  AND user_account_id_like = :user_account_id_like `;
		parameters = {
						user_account_id: id,
						user_account_id_like: id_unlike
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
export{likeUser, unlikeUser};