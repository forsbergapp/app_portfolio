/** @module server/dbapi/common */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';

const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_query} = await import(`file://${process.cwd()}/server/db/db.service.js`);
const {LogDBI, LogDBE} = await import(`file://${process.cwd()}/server/log/log.service.js`);

/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {Types.error} err 
 */
 const checked_error = async (app_id, lang_code, err) =>{
	const { getMessage } = await import(`file://${process.cwd()}/server/dbapi/app_portfolio/message_translation/message_translation.service.js`);
    return new Promise((resolve)=>{
		const app_code = get_app_code(  err.errorNum, 
										err.message, 
										err.code, 
										err.errno, 
										err.sqlMessage);
		if (app_code != null){
			getMessage( app_id,
						getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
						app_code, 
						lang_code)
			.then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
				resolve(
					result_message[0].text
				);
			})
			.catch((/**@type{Types.error}*/error)=>{
				resolve(
					error
				);
			});
		}
		else
			resolve(
				err
			);
	});
};
/**
 * Get app code derived from database error
 * 
 *	if known SQL error, example:
 *	MariaDB sqlMessage
 *	'Duplicate entry '[value]' for key 'user_account_username_un''
 *	MySQL sqlMessage
 *	'Duplicate entry '[value]' for key 'user_account.user_account_username_un''
 *	PostgreSQL message:
 *	'duplicate key value violates unique constraint "user_account_username_un"'
 *	Oracle message:
 *	'ORA-00001: unique constraint (APP_PORTFOLIO.USER_ACCOUNT_USERNAME_UN) violated'
 *
 * @param {number} errorNum 
 * @param {object} message 
 * @param {string} code 
 * @param {string} errno 
 * @param {object} sqlMessage 
 * @returns (string|null)
 * 
 */
const get_app_code = (errorNum, message, code, errno, sqlMessage) => {
	const app_error_code = getNumberValue(JSON.stringify(errno) ?? JSON.stringify(errorNum));
    //check if user defined exception
    if (app_error_code >= 20000){
        return app_error_code.toString();
    } 
    else{
		const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
		if ((db_use ==1 && code == 'ER_DUP_ENTRY') || //MariaDB/MySQL
			(db_use ==2 && errorNum ==1) ||  		  //Oracle
			(db_use ==3 && code=='23505')){ 		  //PostgreSQL
			let text_check;
			if (sqlMessage)
				text_check = JSON.stringify(sqlMessage);	//MariaDB/MySQL
			else
				text_check = JSON.stringify(message);		//Oracle/PostgreSQL
			let app_message_code = null;
			//check constraints errors, must be same name in mySQL and Oracle
			if (text_check.toUpperCase().includes('USER_ACCOUNT_EMAIL_UN'))
				app_message_code = '20200';
			if (text_check.toUpperCase().includes('USER_ACCOUNT_PROVIDER_ID_UN'))
				app_message_code = '20201';
			if (text_check.toUpperCase().includes('USER_ACCOUNT_USERNAME_UN'))
				app_message_code = '20203';
			if (app_message_code != null)
				return app_message_code;
			else
				return null;	
		}
		else
			return null;
	}
};
/**
 * Get message for record not found
 * @param {number} app_id 
 * @param {string} lang_code 
 */
 const record_not_found_promise = async (app_id, lang_code) => {
	return new Promise((resolve)=>{
		import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
			import(`file://${process.cwd()}/server/dbapi/app_portfolio/message_translation/message_translation.service.js`).then(({ getMessage }) => {
				getMessage( app_id,
							getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
							'20400',
							lang_code)
				.then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
					resolve(
						result_message[0].text
					);
				});
			});
		});
	});
};

/**
 * Get message for record not found
 * @param {Types.res} res 
 * @param {number} app_id 
 * @param {string} lang_code 
 */
const record_not_found = (res, app_id, lang_code) => {
	import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
		import(`file://${process.cwd()}/server/dbapi/app_portfolio/message_translation/message_translation.service.js`).then(({ getMessage }) => {
			getMessage( app_id,
						getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
						'20400',
						lang_code)
			.then((/**@type{Types.db_result_message_translation_getMessage[]}*/result_message)=>{
				res.status(404).send(
					result_message[0].text
				);
			})
			.catch((/**@type{Types.error}*/error)=>{
				res.status(500).send(
					error
				);
			});
		});
	});
};
/**
 * Get locale part
 * 1 = complete lang code
 * 2 = ex zh-hant from zh-hant-cn
 * 3 = ex zh from zh-hant-cn
 * @param {string} lang_code 
 * @param {number} part 
 * @returns {string|null}
 */
const get_locale = (lang_code, part) => {
	if (lang_code==null)
		return null;
	else
		switch (part){
			case 1:{
				return lang_code;
			}
			case 2:{
				if (lang_code.indexOf('-',lang_code.indexOf('-')+1) >-1)
					return lang_code.substring(0,lang_code.indexOf('-',lang_code.indexOf('-')+1));
				else
					return lang_code;
			}
			case 3:{
				if (lang_code.indexOf('-')>-1)
					return lang_code.substring(0,lang_code.indexOf('-'));
				else
					return lang_code;
			}
			default:
				return null;
		}
};
/**
 * Returns current database schema used by SQL
 * @returns {string}
 */
const db_schema = () => ConfigGet('SERVICE_DB', `DB${ConfigGet('SERVICE_DB', 'USE')}_NAME`);

/**
 * Limit SQL rows
 * limit_type 1		Env limit LIMIT_LIST_SEARCH
 * limit_type 2 	Env limit LIMIT_LIST_PROFILE_TOP
 * limit_type null 	App function limit
 * @param {string} sql 
 * @param {1|2|null} limit_type 
 * @returns {string}
 */
const db_limit_rows = (sql, limit_type = null) => {
	const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
	if (db_use == 1 || db_use == 2 || db_use == 3)
		switch (limit_type){
			case 1:{
				return sql + ` LIMIT ${getNumberValue(ConfigGet('SERVICE_DB', 'LIMIT_LIST_SEARCH'))} `;
			}
			case 2:{
				return sql + ` LIMIT ${getNumberValue(ConfigGet('SERVICE_DB', 'LIMIT_LIST_PROFILE_TOP'))} `;
			}
			default:{
				return sql + ' LIMIT :limit OFFSET :offset';	
			}
		}
	else 
		if (db_use == 4)
			switch (limit_type){
				case 1:{
					//use env limit
					return sql + ` FETCH NEXT ${getNumberValue(ConfigGet('SERVICE_DB', 'LIMIT_LIST_SEARCH'))} ROWS ONLY`;
				}
				case 2:{
					//use env limit
					return sql + ` FETCH NEXT ${getNumberValue(ConfigGet('SERVICE_DB', 'LIMIT_LIST_PROFILE_TOP'))} ROWS ONLY`;
				}
				default:{
					//use app function limit
					return sql + ' OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY';
				}
			}
		else
			return sql;
};

/**
 * 
 * @param {number} app_id 
 * @param {string} sql 
 * @param {object} parameters 
 * @param {number} dba 
 * @returns {Promise.<Types.error|{}>}
 */
 const db_execute = async (app_id, sql, parameters, dba) =>{
	return new Promise ((resolve, reject)=>{
		db_query(app_id, getNumberValue(ConfigGet('SERVICE_DB', 'USE')), sql, parameters, dba)
		.then((/**@type{Types.db_query_result}*/result)=> {
			LogDBI(app_id, getNumberValue(ConfigGet('SERVICE_DB', 'USE')), sql, parameters, result)
			.then(()=>{
				resolve(result);
			});
		})
		.catch((/**@type{Types.error}*/error)=>{
			const database_error = 'DATABASE ERROR';
			LogDBE(app_id, getNumberValue(ConfigGet('SERVICE_DB', 'USE')), sql, parameters, error)
			.then(()=>{
				const app_code = get_app_code(error.errorNum, 
					error.message, 
					error.code, 
					error.errno, 
					error.sqlMessage);
				if (app_code != null)
					reject(error);
				else{
					//return full error to admin
					if (app_id==getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')))
						reject(error);
					else
						reject(database_error);
				}
			});
		});
	});
};

export{
		checked_error, get_app_code, record_not_found_promise, record_not_found, get_locale,
		db_schema,  db_limit_rows, db_execute
};