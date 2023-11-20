/** @module server/dbapi/app_portfolio/message_translation */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {number} data_app_id 
 * @param {string} code 
 * @param {string} lang_code 
 * @returns {Promise.<Types.db_result_message_translation_getMessage[]>}
 */
const getMessage = async (app_id, data_app_id, code, lang_code) => {
		const sql = `SELECT m.code "code",
					  m.message_level_id "message_level_id",
					  m.message_type_id "message_type_id",
					  mt.language_id "language_id",
					  l.lang_code "lang_code",
					  mt.text "text",
					  am.app_id "app_id"
				 FROM ${db_schema()}.message m,
					  ${db_schema()}.message_translation mt,
					  ${db_schema()}.app_message am,
					  ${db_schema()}.language l
				WHERE mt.language_id = l.id
				  AND mt.message_code = m.code
				  AND am.message_code = m.code
				  AND am.app_id = :app_id
				  AND m.code = :code
				  AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
									   FROM ${db_schema()}.message_translation mt1,
											${db_schema()}.language l1
									  WHERE mt1.message_code = mt.message_code
										AND l1.id = mt1.language_id
										AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
									)`;
		const parameters = {
						app_id: data_app_id,
						code: code,
						lang_code1: get_locale(lang_code, 1),
						lang_code2: get_locale(lang_code, 2),
						lang_code3: get_locale(lang_code, 3)
					};
		return await db_execute(app_id, sql, parameters, null);
	};

export{getMessage};