/** @module server/db */

/**@type{import('../server.service.js')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('../log.service.js')} */
const {LogDBI, LogDBE} = await import(`file://${process.cwd()}/server/log.service.js`);
/**@type{import('../config.service.js')} */
const {ConfigGet, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);

/**@type{import('./db.service.js')} */
const {db_query} = await import(`file://${process.cwd()}/server/db/db.service.js`);

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
 * @param {import('../../types.js').db_query_result_error} error
 * @returns (string|null)
 * 
 */
const get_app_code = error => {
	const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
	if (
		((db_use ==1 ||db_use ==2)&& error.code == 'ER_DUP_ENTRY') || //MariaDB/MySQL
		(db_use ==3 && error.code=='23505')|| //PostgreSQL
		(db_use ==4 && error.errorNum ==1)||  //Oracle
		(db_use ==5 && error.code == 'ER_DUP_ENTRY')   	//SQLite
		){ 		  
		let text_check;
		if (error.sqlMessage)
			text_check = JSON.stringify(error.sqlMessage);	//MariaDB/MySQL
		else
			text_check = JSON.stringify(error.message);		//Oracle/PostgreSQL/SQLite
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
};
/**
 * 
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {import('../../types.js').error} err 
 * @param {import('../../types.js').res} res
 */
 const checked_error = async (app_id, lang_code, err, res) =>{
	/**@type{import('./sql/app_setting.service.js')} */
	const { getSettingDisplayData } = await import(`file://${process.cwd()}/server/db/sql/app_setting.service.js`);

	
    return new Promise((resolve)=>{
		const app_code = get_app_code(err);
		if (app_code != null){
			getSettingDisplayData( 	app_id,
									getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
									'MESSAGE',
									app_code)
			.then((/**@type{import('../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_message)=>{
				res.statusCode = 400;
				res.statusMessage = result_message[0].display_data;
				resolve(result_message[0].display_data);
			});
		}
		else{
			res.statusCode = 500;
			res.statusMessage = err;
			resolve(err);
		}
	});
};

/**
 * Get message for record not found
 * @param {number} app_id 
 * @param {string} lang_code
 * @param {import('../../types.js').res} res
 */
const record_not_found = async (app_id, lang_code, res) => {
	return new Promise((resolve)=>{
		import(`file://${process.cwd()}/server/db/sql/app_setting.service.js`).then(({ getSettingDisplayData }) => {
			getSettingDisplayData( 	app_id,
									getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 
									'MESSAGE',
									'20400')
			.then((/**@type{import('../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_message)=>{
				res.statusCode = 404;
				res.statusMessage = result_message[0].display_data;
				resolve(result_message[0].display_data);
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
 * Sets pagination limits on SQL rows
 * 
 * @param {number|null} app_id
 * @param {string} sql 
 * @param {boolean} parameter_limit 
 * @returns {string}
 */
const db_limit_rows = (app_id, parameter_limit = true) => {
	const db_use = getNumberValue(ConfigGet('SERVICE_DB', 'USE'));
	if (db_use == 4)
		if (parameter_limit){
			//use parameter limit
			return `	FETCH NEXT ${getNumberValue(ConfigGetApp(app_id, 
														getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_PAGINATION_LIMIT' in parameter)[0].APP_PAGINATION_LIMIT)} 
						ROWS ONLY`;
		}
		else{
			//use app function limit
			return ' 	OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY';
		}
	else
		if (parameter_limit)
			return 	` 	LIMIT ${getNumberValue(	ConfigGetApp(app_id, 
													getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')), 'PARAMETERS').filter((/**@type{*}*/parameter)=>'APP_PAGINATION_LIMIT' in parameter)[0].APP_PAGINATION_LIMIT)} `;
		else
			return ' 	LIMIT :limit OFFSET :offset';
};

/**
 * Compare date using EXTRACT or STRFTIME depending database
 * Database 1,2,3,4:
 * 	EXTRACT(year from date_created)
 * 	EXTRACT(month from date_created)
 * Database 5:
 * 	STRFTIME('%Y', date_created)
 * 	STRFTIME('%m', date_created)
 *  STRFTIME('%d', date_created)
 * 
 * @param {'YEAR'|'MONTH'|'DAY'} period
 */
const db_date_period = period=>getNumberValue(ConfigGet('SERVICE_DB', 'USE'))==5?
								` CAST(STRFTIME('%${period=='YEAR'?'Y':period=='MONTH'?'m':period=='DAY'?'d':''}', date_created) AS INT) `:
								` EXTRACT(${period} from date_created)`;
														
/**
 * 
 * @param {number|null} app_id 
 * @param {string} sql 
 * @param {object} parameters 
 * @param {number|null} dba 
 * @param {string|null} locale 
 * @returns {Promise.<import('../../types.js').error|{}>}
 */
 const db_execute = async (app_id, sql, parameters, dba = null, locale=null) =>{
	return new Promise ((resolve, reject)=>{
		//manage schema
		//syntax in SQL: FROM '<DB_SCHEMA/>'.[table] 
		sql = sql.replaceAll('<DB_SCHEMA/>', ConfigGet('SERVICE_DB', `DB${ConfigGet('SERVICE_DB', 'USE')}_NAME`) ?? '');
		//manage different syntax
		//syntax in SQL: WHERE '<DATE_PERIOD_YEAR/>' = [bind variable] etc
		sql = sql.replaceAll('<DATE_PERIOD_YEAR/>', db_date_period('YEAR'));
		sql = sql.replaceAll('<DATE_PERIOD_MONTH/>', db_date_period('MONTH'));
		sql = sql.replaceAll('<DATE_PERIOD_DAY/>', db_date_period('DAY'));
		//manage locale search
		//syntax in SQL: WHERE [column ] IN ('<LOCALE/>')
		if (locale && sql.indexOf('<LOCALE/>')>0){
			sql = sql.replaceAll('<LOCALE/>', ':locale1, :locale2, :locale3');
			parameters = {...parameters, ...{	locale1: get_locale(locale, 1),
												locale2: get_locale(locale, 2),
												locale3: get_locale(locale, 3)}};
		}
		//manage pagination
		sql = sql.replaceAll('<APP_PAGINATION_LIMIT_PARAMETER/>', db_limit_rows(app_id, true));
		sql = sql.replaceAll('<APP_PAGINATION_LIMIT_APP/>', 		db_limit_rows(app_id, false));

		db_query(app_id, getNumberValue(ConfigGet('SERVICE_DB', 'USE')), sql, parameters, dba)
		.then((/**@type{import('../../types.js').db_query_result}*/result)=> {
			LogDBI(app_id, getNumberValue(ConfigGet('SERVICE_DB', 'USE')), sql, parameters, result)
			.then(()=>{
				resolve(result);
			});
		})
		.catch((/**@type{import('../../types.js').error}*/error)=>{
			const database_error = 'DATABASE ERROR';
			//add db_message key since message is not saved for SQLite
			if (error.message)
            	error.db_message = error.message;
			LogDBE(app_id, getNumberValue(ConfigGet('SERVICE_DB', 'USE')), sql, parameters, error)
			.then(()=>{
				const app_code = get_app_code(error);
				if (app_code != null)
					return reject(error);
				else{
					//return full error to admin
					if (app_id==getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID'))){
						//SQLite does not display sql in error
						if (!error.sql)
							error.sql = sql;
						reject(error);
					}
					else
						reject(database_error);
				}
			});
		});
	});
};

export{
		checked_error, get_app_code, record_not_found, db_limit_rows, db_execute
};