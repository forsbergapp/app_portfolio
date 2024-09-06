/** @module server/db/sql/user_account_app_data_post */

/**@type{import('../../db/common.service.js')} */
const {db_execute} = await import(`file://${process.cwd()}/server/db/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {import('../../../types.js').db_parameter_user_account_app_data_post_createUserPost} data 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_app_data_post_createUserPost>}
 */
const createUserPost = async (app_id, data) => {
		const sql = `INSERT INTO <DB_SCHEMA/>.user_account_app_data_post(
						description, 
						json_data,
						date_created,
						date_modified,
						user_account_app_user_account_id,
						user_account_app_app_id
						)
					VALUES(:description,:json_data,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,:user_account_id,:app_id)`;
			const parameters = {
							description: data.description,
							json_data: JSON.stringify(data.json_data),
							user_account_id: data.user_account_id,
							app_id: app_id,
							DB_RETURN_ID:'id',
							DB_CLOB: ['json_data']
						};
			return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_app_data_post_getUserPost[]>}
 */
const getUserPost = async (app_id, id) => {
		const sql = `SELECT	id "id",
							description "description",
							json_data "json_data",
							date_created "date_created",
							date_modified "date_modified",
							user_account_app_user_account_id "user_account_app_user_account_id",
							user_account_app_app_id "user_account_app_app_id"
					   FROM <DB_SCHEMA/>.user_account_app_data_post 
					  WHERE id = :id `;
		const parameters = {id: id};
		return await db_execute(app_id, sql, parameters, null, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number|null} id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_app_data_post_getUserPostsByUserId[]>}
 */
const getUserPostsByUserId = async (app_id, id) => {
		const sql = `SELECT	id "id",
							description "description",
							json_data "json_data",
							date_created "date_created",
							date_modified "date_modified",
							user_account_app_user_account_id "user_account_app_user_account_id",
							user_account_app_app_id "app_id"
					   FROM <DB_SCHEMA/>.user_account_app_data_post
					  WHERE user_account_app_user_account_id = :user_account_id 
					    AND user_account_app_app_id = :app_id`;
		const parameters = {
						user_account_id: id,
						app_id: app_id
					};
		return await db_execute(app_id, sql, parameters, null, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number|null} id_current_user 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_app_data_post_getProfileUserPosts[]>}
 */
const getProfileUserPosts = async (app_id, id, id_current_user) => {
		const sql = `SELECT us.id "id",
					  		us.description "description",
					  		us.user_account_app_user_account_id "user_account_app_user_account_id",
							us.json_data "json_data",
							(SELECT COUNT(0)
								FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like
								WHERE u_like.user_account_app_data_post_id = us.id
								AND  u_like.user_account_app_app_id = us.user_account_app_app_id)					"count_likes",
							(SELECT COUNT(0)
								FROM <DB_SCHEMA/>.user_account_app_data_post_view u_view
								WHERE u_view.user_account_app_data_post_id = us.id
								AND  u_view.user_account_app_app_id = us.user_account_app_app_id)					"count_views",
							(SELECT COUNT(0)
								FROM <DB_SCHEMA/>.user_account_app_data_post_like u_liked_current_user
								WHERE u_liked_current_user.user_account_app_user_account_id = :user_account_id_current
								AND u_liked_current_user.user_account_app_data_post_id = us.id
								AND u_liked_current_user.user_account_app_app_id = us.user_account_app_app_id) 		"liked"
					   FROM <DB_SCHEMA/>.user_account_app_data_post us
					  WHERE us.user_account_app_user_account_id = :user_account_id
						AND us.user_account_app_app_id = :app_id `;
		const parameters = {
						user_account_id_current: id_current_user,
						user_account_id: id,
						app_id: app_id
						};
		return await db_execute(app_id, sql, parameters, null, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number|null} detailchoice 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_app_data_post_getProfileUserPostDetail[]>}
 */
const getProfileUserPostDetail = async (app_id, id, detailchoice) => {
		const sql = `SELECT detail "detail", 
							id "id", 
							identity_provider_id "identity_provider_id", 
							provider_id "provider_id", 
							avatar "avatar",
							provider_image "provider_image",
							provider_image_url "provider_image_url",
							username "username",
							provider_first_name "provider_first_name",
							count(*) over() "total_rows"
						FROM (SELECT 'LIKE_POST' detail,
									u.id,
									u.identity_provider_id,
									u.provider_id,
									u.avatar,
									u.provider_image,
									u.provider_image_url,
									u.username,
									u.provider_first_name
								FROM <DB_SCHEMA/>.user_account u
							WHERE u.id IN (SELECT us.user_account_app_user_account_id
												FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
													<DB_SCHEMA/>.user_account_app_data_post us
											WHERE u_like.user_account_app_user_account_id = :user_account_id
												AND u_like.user_account_app_app_id = :app_id
												AND us.user_account_app_app_id = u_like.user_account_app_app_id
												AND us.id = u_like.user_account_app_data_post_id)
								AND    u.active = 1
								AND    6 = :detailchoice
								UNION ALL
								SELECT 'LIKED_POST' detail,
										u.id,
										u.identity_provider_id,
										u.provider_id,
										u.avatar,
										u.provider_image,
										u.provider_image_url,
										u.username,
										u.provider_first_name
								FROM  <DB_SCHEMA/>.user_account u
								WHERE  u.id IN (SELECT u_like.user_account_app_user_account_id
												FROM <DB_SCHEMA/>.user_account_app_data_post us,
														<DB_SCHEMA/>.user_account_app_data_post_like u_like
												WHERE us.user_account_app_user_account_id = :user_account_id
													AND us.user_account_app_app_id = :app_id
													AND us.id = u_like.user_account_app_data_post_id
													AND u_like.user_account_app_app_id = us.user_account_app_app_id)
								AND  u.active = 1
								AND  7 = :detailchoice) t
							ORDER BY 1, COALESCE(username, provider_first_name) 
							<APP_LIMIT_RECORDS/>`;
		const parameters = {
						user_account_id: id,
						app_id: app_id,
						detailchoice: detailchoice
					};
		return await db_execute(app_id, sql, parameters, null, null);
    };
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_data_post_getProfileStatLike[]>}
 */
 const getProfileStatLike = async (app_id, id) => {
	const sql = ` SELECT (SELECT COUNT(DISTINCT us.user_account_app_user_account_id)
					FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
						 <DB_SCHEMA/>.user_account_app_data_post us
				   WHERE u_like.user_account_app_user_account_id = u.id
					 AND u_like.user_account_app_app_id = :app_id
					 AND us.id = u_like.user_account_app_data_post_id
					 AND us.user_account_app_app_id = u_like.user_account_app_app_id)		"count_user_post_likes",
				 (SELECT COUNT(DISTINCT u_like.user_account_app_user_account_id)
					FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
						 <DB_SCHEMA/>.user_account_app_data_post us
				   WHERE us.user_account_app_user_account_id = u.id
 					 AND us.user_account_app_app_id = :app_id
					 AND u_like.user_account_app_data_post_id = us.id
					 AND u_like.user_account_app_app_id = us.user_account_app_app_id)		"count_user_post_liked"
			 		FROM <DB_SCHEMA/>.user_account u
				   WHERE u.id = :id`;
	const parameters ={
					id: id,
					app_id: app_id
				}; 
	return await db_execute(app_id, sql, parameters, null, null);
};

/**
 * 
 * @param {number} app_id 
 * @param {number|null} statchoice 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_app_data_post_getProfileStatPost[]>}
 */
const getProfileStatPost = async (app_id, statchoice) => {
		const sql = `SELECT top "top", 
							id "id", 
							identity_provider_id "identity_provider_id", 
							provider_id "provider_id", 
							avatar "avatar",
							provider_image "provider_image",
							provider_image_url "provider_image_url",
							username "username",
							provider_first_name "provider_first_name",
							count "count",
							count(*) over() "total_rows"
						FROM (	SELECT 'LIKE_POST' top,
										u.id,
										u.identity_provider_id,
										u.provider_id,
										u.avatar,
										u.provider_image,
										u.provider_image_url,
										u.username,
										u.provider_first_name,
										(SELECT COUNT(us.user_account_app_user_account_id)
										FROM <DB_SCHEMA/>.user_account_app_data_post_like u_like,
												<DB_SCHEMA/>.user_account_app_data_post us
										WHERE us.user_account_app_user_account_id = u.id
											AND us.user_account_app_app_id = :app_id
											AND u_like.user_account_app_data_post_id = us.id
											AND u_like.user_account_app_app_id = us.user_account_app_app_id) count
								FROM  <DB_SCHEMA/>.user_account u
								WHERE  u.active = 1
								AND  u.private <> 1
								AND  4 = :statchoice
								UNION ALL
								SELECT 'VISITED_POST' top,
										u.id,
										u.identity_provider_id,
										u.provider_id,
										u.avatar,
										u.provider_image,
										u.provider_image_url,
										u.username,
										u.provider_first_name,
										(SELECT COUNT(us.user_account_app_user_account_id)
										FROM <DB_SCHEMA/>.user_account_app_data_post_view u_view,
												<DB_SCHEMA/>.user_account_app_data_post us
										WHERE us.user_account_app_user_account_id = u.id
											AND us.user_account_app_app_id = :app_id
											AND u_view.user_account_app_data_post_id = us.id
											AND u_view.user_account_app_app_id = us.user_account_app_app_id) count
								FROM  <DB_SCHEMA/>.user_account u
								WHERE  u.active = 1
								AND  u.private <> 1
								AND  5 = :statchoice) t
						ORDER BY 1,10 DESC, COALESCE(username, provider_first_name) 
						<APP_LIMIT_RECORDS/>`;
		const parameters = {
						app_id: app_id,
						statchoice: statchoice
					};
		return await db_execute(app_id, sql, parameters, null, null);
    };
/**
 * 
 * @param {number} app_id 
 * @param {import('../../../types.js').db_parameter_user_account_app_data_post_updateUserPost} data 
 * @param {number} id 
 * @returns {Promise.<import('../../../types.js').db_result_user_account_app_data_post_updateUserPost>}
 */
const updateUserPost = async (app_id, data, id) => {
		const sql = `UPDATE <DB_SCHEMA/>.user_account_app_data_post
						SET description = :description,
							json_data = :json_data,
							date_modified = CURRENT_TIMESTAMP
					  WHERE id = :id 
					    AND user_account_app_user_account_id = :user_account_id
						AND user_account_app_app_id = :app_id`;
		const parameters = {
						description: data.description,
						json_data: JSON.stringify(data.json_data),
						user_account_id: data.user_account_id,
						app_id: app_id,
						id: id,
						DB_CLOB: ['json_data']
					};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number} user_account_id
 * @returns {Promise.<import('../../../types.js').db_result_user_account_app_data_post_deleteUserPost>}
 */
const deleteUserPost = async (app_id, id, user_account_id) => {
		const sql = `DELETE FROM <DB_SCHEMA/>.user_account_app_data_post
					  WHERE id = :id 
					    AND user_account_app_user_account_id = :user_account_id
						AND user_account_app_app_id = :app_id`;
		const parameters = {id: id,
							user_account_id: user_account_id,
							app_id:app_id};
		return await db_execute(app_id, sql, parameters, null);
	};
export{	createUserPost, getUserPost, getUserPostsByUserId, getProfileUserPosts, 
		getProfileUserPostDetail, getProfileStatLike, getProfileStatPost, updateUserPost, deleteUserPost};