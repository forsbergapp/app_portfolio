/** @module server/dbapi/app_portfolio/user_account_app_data_post */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema, db_limit_rows} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {Types.db_parameter_user_account_app_data_post_createUserPost} data 
 * @returns {Promise.<Types.db_result_user_account_app_data_post_createUserPost>}
 */
const createUserPost = async (app_id, data) => {
		const sql = `INSERT INTO ${db_schema()}.user_account_app_data_post(
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
 * @returns {Promise.<Types.db_result_user_account_app_data_post_getUserPost[]>}
 */
const getUserPost = async (app_id, id) => {
		const sql = `SELECT	id "id",
							description "description",
							json_data "json_data",
							date_created "date_created",
							date_modified "date_modified",
							user_account_app_user_account_id "user_account_app_user_account_id",
							user_account_app_app_id "user_account_app_app_id"
					   FROM ${db_schema()}.user_account_app_data_post 
					  WHERE id = :id `;
		const parameters = {id: id};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<Types.db_result_user_account_app_data_post_getUserPostsByUserId[]>}
 */
const getUserPostsByUserId = async (app_id, id) => {
		const sql = `SELECT	id "id",
						description "description",
						json_data "json_data",
						date_created "date_created",
						date_modified "date_modified",
						user_account_app_user_account_id "user_account_app_user_account_id",
						user_account_app_app_id "app_id"
				 FROM ${db_schema()}.user_account_app_data_post
				WHERE user_account_app_user_account_id = :user_account_id 
				  AND user_account_app_app_id = :app_id`;
		const parameters = {
						user_account_id: id,
						app_id: app_id
					};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @returns {Promise.<Types.db_result_user_account_app_data_post_getProfileUserPost[]>}
 */
const getProfileUserPost = async (app_id, id) => {
		const sql = `SELECT (SELECT COUNT(DISTINCT us.user_account_app_user_account_id)
						 FROM ${db_schema()}.user_account_app_data_post_like u_like,
						   	  ${db_schema()}.user_account_app_data_post us
						WHERE u_like.user_account_app_user_account_id = u.id
						  AND u_like.user_account_app_app_id = :app_id
						  AND us.id = u_like.user_account_app_data_post_id
						  AND us.user_account_app_app_id = u_like.user_account_app_app_id)		"count_user_post_likes",
					  (SELECT COUNT(DISTINCT u_like.user_account_app_user_account_id)
					     FROM ${db_schema()}.user_account_app_data_post_like u_like,
							  ${db_schema()}.user_account_app_data_post us
						WHERE us.user_account_app_user_account_id = u.id
						  AND us.user_account_app_app_id = :app_id
						  AND u_like.user_account_app_data_post_id = us.id
						  AND u_like.user_account_app_app_id = us.user_account_app_app_id)		"count_user_post_liked"
				 FROM ${db_schema()}.user_account u
				WHERE u.id = :id`;
		const parameters ={
						id: id,
						app_id: app_id
					}; 
		return await db_execute(app_id, sql, parameters, null);
    };
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number} id_current_user 
 * @returns {Promise.<Types.db_result_user_account_app_data_post_getProfileUserPosts[]>}
 */
const getProfileUserPosts = async (app_id, id, id_current_user) => {
		const sql = `SELECT us.id "id",
					  		us.description "description",
					  		us.user_account_app_user_account_id "user_account_app_user_account_id",
							us.json_data "json_data",
					  (SELECT COUNT(0)
						 FROM ${db_schema()}.user_account_app_data_post_like u_like
						WHERE u_like.user_account_app_data_post_id = us.id
						 AND  u_like.user_account_app_app_id = us.user_account_app_app_id)					"count_likes",
					  (SELECT COUNT(0)
						 FROM ${db_schema()}.user_account_app_data_post_view u_view
						WHERE u_view.user_account_app_data_post_id = us.id
						 AND  u_view.user_account_app_app_id = us.user_account_app_app_id)					"count_views",
					  (SELECT COUNT(0)
						 FROM ${db_schema()}.user_account_app_data_post_like u_liked_current_user
						WHERE u_liked_current_user.user_account_app_user_account_id = :user_account_id_current
						  AND u_liked_current_user.user_account_app_data_post_id = us.id
						  AND u_liked_current_user.user_account_app_app_id = us.user_account_app_app_id) 	"liked"
				 FROM ${db_schema()}.user_account_app_data_post us
				WHERE us.user_account_app_user_account_id = :user_account_id
				  AND us.user_account_app_app_id = :app_id `;
		const parameters = {
						user_account_id_current: id_current_user,
						user_account_id: id,
						app_id: app_id
						};
		return await db_execute(app_id, sql, parameters, null);
	};
/**
 * 
 * @param {number} app_id 
 * @param {number} id 
 * @param {number} detailchoice 
 * @returns {Promise.<Types.db_result_user_account_app_data_post_getProfileUserPostDetail[]>}
 */
const getProfileUserPostDetail = async (app_id, id, detailchoice) => {
		let sql;
		sql = `SELECT detail "detail", 
					  id "id", 
					  identity_provider_id "identity_provider_id", 
					  provider_id "provider_id", 
					  avatar "avatar",
					  provider_image "provider_image",
					  provider_image_url "provider_image_url",
					  username "username",
					  provider_first_name "provider_first_name"
				FROM (SELECT 'LIKE_POST' detail,
							 u.id,
							 u.identity_provider_id,
							 u.provider_id,
							 u.avatar,
							 u.provider_image,
							 u.provider_image_url,
							 u.username,
							 u.provider_first_name
						FROM ${db_schema()}.user_account u
					   WHERE u.id IN (SELECT us.user_account_app_user_account_id
										FROM ${db_schema()}.user_account_app_data_post_like u_like,
											 ${db_schema()}.user_account_app_data_post us
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
						  FROM  ${db_schema()}.user_account u
						 WHERE  u.id IN (SELECT u_like.user_account_app_user_account_id
										   FROM ${db_schema()}.user_account_app_data_post us,
												${db_schema()}.user_account_app_data_post_like u_like
										  WHERE us.user_account_app_user_account_id = :user_account_id
											AND us.user_account_app_app_id = :app_id
											AND us.id = u_like.user_account_app_data_post_id
											AND u_like.user_account_app_app_id = us.user_account_app_app_id)
						   AND  u.active = 1
						   AND  7 = :detailchoice) t
					ORDER BY 1, COALESCE(username, provider_first_name) `;
		sql = db_limit_rows(sql,1);
		const parameters = {
						user_account_id: id,
						app_id: app_id,
						detailchoice: detailchoice
					};
		return await db_execute(app_id, sql, parameters, null);
    };
/**
 * 
 * @param {number} app_id 
 * @param {number} statchoice 
 * @returns {Promise.<Types.db_result_user_account_app_data_post_getProfileTopPost[]>}
 */
const getProfileTopPost = async (app_id, statchoice) => {
		let sql;
		sql = `SELECT top "top", 
					  id "id", 
					  identity_provider_id "identity_provider_id", 
					  provider_id "provider_id", 
					  avatar "avatar",
					  provider_image "provider_image",
					  provider_image_url "provider_image_url",
					  username "username",
					  provider_first_name "provider_first_name",
					  count "count"
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
								   FROM ${db_schema()}.user_account_app_data_post_like u_like,
										${db_schema()}.user_account_app_data_post us
								  WHERE us.user_account_app_user_account_id = u.id
									AND us.user_account_app_app_id = :app_id
									AND u_like.user_account_app_data_post_id = us.id
									AND u_like.user_account_app_app_id = us.user_account_app_app_id) count
						  FROM  ${db_schema()}.user_account u
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
								   FROM ${db_schema()}.user_account_app_data_post_view u_view,
										${db_schema()}.user_account_app_data_post us
								  WHERE us.user_account_app_user_account_id = u.id
									AND us.user_account_app_app_id = :app_id
									AND u_view.user_account_app_data_post_id = us.id
									AND u_view.user_account_app_app_id = us.user_account_app_app_id) count
						  FROM  ${db_schema()}.user_account u
						 WHERE  u.active = 1
						   AND  u.private <> 1
						   AND  5 = :statchoice) t
				ORDER BY 1,10 DESC, COALESCE(username, provider_first_name) `;
		sql = db_limit_rows(sql,2);
		const parameters = {
						app_id: app_id,
						statchoice: statchoice
					};
		return await db_execute(app_id, sql, parameters, null);
    };
/**
 * 
 * @param {number} app_id 
 * @param {Types.db_parameter_user_account_app_data_post_updateUserPost} data 
 * @param {number} id 
 * @returns {Promise.<Types.db_result_user_account_app_data_post_updateUserPost>}
 */
const updateUserPost = async (app_id, data, id) => {
		const sql = `UPDATE ${db_schema()}.user_account_app_data_post
						SET description = :description,
							json_data = :json_data,
							user_account_app_user_account_id = :user_account_id,
							user_account_app_app_id = :app_id,
							date_modified = CURRENT_TIMESTAMP
					  WHERE id = :id `;
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
 * @returns {Promise.<Types.db_result_user_account_app_data_post_deleteUserPost>}
 */
const deleteUserPost = async (app_id, id) => {
		const sql = `DELETE FROM ${db_schema()}.user_account_app_data_post
					WHERE id = :id `;
		const parameters = {id: id};
		return await db_execute(app_id, sql, parameters, null);
	};
export{	createUserPost, getUserPost, getUserPostsByUserId, getProfileUserPost, getProfileUserPosts, 
		getProfileUserPostDetail, getProfileTopPost, updateUserPost, deleteUserPost};