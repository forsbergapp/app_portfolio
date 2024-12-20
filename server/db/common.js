/** @module server/db/common */

/**
 * @import {server_db_common_result, server_db_sql_result_app_setting_getDisplayData, server_server_res, server_server_error, server_db_common_result_error} from '../types.js'
*/

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('./fileModelLog.js')} */
const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);

/**@type{import('./fileModelAppParameter.js')} */
const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);

/**@type{import('./fileModelConfig.js')} */
const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

/**@type{import('./db.js')} */
const {dbSQL} = await import(`file://${process.cwd()}/server/db/db.js`);

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
 * @function
 * @param {server_db_common_result_error} error
 * @returns (string|null)
 * 
 */
const dbCommonAppCodeGet = error => {
	const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
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
 * Displays message for error
 * @function
 * @param {number} app_id 
 * @param {string} lang_code 
 * @param {server_server_error} err 
 * @param {server_server_res} res
 */
 const dbCommonCheckedError = async (app_id, lang_code, err, res) =>{
	/**@type{import('./dbModelAppSetting.js')} */
	const { getDisplayData } = await import(`file://${process.cwd()}/server/db/dbModelAppSetting.js`);

	
    return new Promise((resolve)=>{
		const app_code = dbCommonAppCodeGet(err);
		if (app_code != null){
			getDisplayData( 	app_id,
				new URLSearchParams(`data_app_id=${serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))}&setting_type=MESSAGE&value=${app_code}`))
			.then(result_message=>{
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
 * Displays DB message for record not found for single resource DB
 * @function
 * @param {number} app_id 
 * @param {string} lang_code
 * @param {server_server_res} res
 * @returns {Promise.<string>}
 */
const dbCommonRecordNotFound = async (app_id, lang_code, res) => {
	return new Promise((resolve)=>{
		import(`file://${process.cwd()}/server/db/dbModelAppSetting.js`).then(({ getDisplayData }) => {
			getDisplayData( 	app_id,
				new URLSearchParams(`data_app_id=${serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))}&setting_type=MESSAGE&value=${20400}`))
			.then((/**@type{server_db_sql_result_app_setting_getDisplayData[]}*/result_message)=>{
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
 * @function
 * @param {string} lang_code 
 * @param {number} part 
 * @returns {string|null}
 */
const dbCommonLocaleGet = (lang_code, part) => {
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
 * Sets pagination using limit and offset or limit records on SQL rows
 * @function
 * @param {boolean} pagination
 * @returns {string}
 */
const dbCommonRowsLimit = (pagination = true) => {
	const db_use = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
	if (db_use == 4)
		if (pagination)
			return ' 	OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY';
		else
			return '	FETCH NEXT :limit ROWS ONLY';
	else
		if (pagination)
			return ' 	LIMIT :limit OFFSET :offset';
		else
			return 	' 	LIMIT :limit ';			
};

/**
 * Get SQL date string using EXTRACT or STRFTIME depending database
 * examples in WHERE clause:
 * Database 1,2,3,4:
 * 	EXTRACT(year from date_created) 	= :year
 * 	EXTRACT(month from date_created)	= :month
 *  EXTRACT(day from date_created) 		= :day
 * Database 5:
 *  CAST(STRFTIME('%Y', date_created) AS INT) = :year
 *  CAST(STRFTIME('%m', date_created) AS INT) = :month
 *  CAST(STRFTIME('%d', date_created) AS INT) = :day
 * @function
 * @param {'YEAR'|'MONTH'|'DAY'} period
 * @returns {string}
 */
const dbCommonDatePeriod = period=>serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'))==5?
								` CAST(STRFTIME('%${period=='YEAR'?'Y':period=='MONTH'?'m':period=='DAY'?'d':''}', date_created) AS INT) `:
								` EXTRACT(${period} from date_created)`;
														
/**
 * Common execute SQL
 * Updates SQL before execution:
 * sets DB schema
 * sets date period syntax depending database used
 * sets locale search string
 * sets pagination info
 * sets limit record
 * Modifies SQL result:
 * parses json_data column so json_data columns are returned also if any
 * returns pagination in ISO20022 format if used
 * @function
 * @param {number|null} app_id 
 * @param {string} sql 
 * @param {*} parameters 
 * @param {number|null} dba 
 * @param {string|null} locale 
 * @returns {Promise.<*>}
 */
 const dbCommonExecute = async (app_id, sql, parameters, dba = null, locale=null) =>{
	return new Promise ((resolve, reject)=>{
		//manage schema
		//syntax in SQL: FROM '<DB_SCHEMA/>'.[table] 
		sql = sql.replaceAll('<DB_SCHEMA/>', fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')}_NAME`) ?? '');
		//manage different syntax
		//syntax in SQL: WHERE '<DATE_PERIOD_YEAR/>' = [bind variable] etc
		sql = sql.replaceAll('<DATE_PERIOD_YEAR/>', dbCommonDatePeriod('YEAR'));
		sql = sql.replaceAll('<DATE_PERIOD_MONTH/>', dbCommonDatePeriod('MONTH'));
		sql = sql.replaceAll('<DATE_PERIOD_DAY/>', dbCommonDatePeriod('DAY'));
		//manage locale search
		//syntax in SQL: WHERE [column ] IN ('<LOCALE/>')
		if (locale && sql.indexOf('<LOCALE/>')>0){
			sql = sql.replaceAll('<LOCALE/>', ':locale1, :locale2, :locale3');
			parameters = {...parameters, ...{	locale1: dbCommonLocaleGet(locale, 1),
												locale2: dbCommonLocaleGet(locale, 2),
												locale3: dbCommonLocaleGet(locale, 3)}};
		}
		//manage pagination
		let pagination = false;
		if (sql.indexOf('<APP_PAGINATION_LIMIT_OFFSET/>')>0){
			//parameters must contain limit and offset keys
			pagination = true;
			sql = sql.replaceAll('<APP_PAGINATION_LIMIT_OFFSET/>', 	dbCommonRowsLimit(true));
			if (!parameters.limit)
				parameters.limit = 	serverUtilNumberValue(fileModelAppParameter.get(serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, null)[0].common_app_limit_records.value);
		}
		//manage limit records
		if (sql.indexOf('<APP_LIMIT_RECORDS/>')>0){
			//parameters should not contain any limit or offset keys
			sql = sql.replaceAll('<APP_LIMIT_RECORDS/>', 		dbCommonRowsLimit(false));
			parameters = {...parameters, ...{limit:serverUtilNumberValue(fileModelAppParameter.get(serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0, null)[0].common_app_limit_records.value)}};
		}

		dbSQL(app_id, serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')), sql, parameters, dba)
		.then((/**@type{server_db_common_result}*/result)=> {
			fileModelLog.postDBI(app_id, serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')), sql, parameters, result)
			.then(()=>{
				//parse json_data in SELECT rows, return also the json_data column as reference
				try {
					/**@ts-ignore */
					const rows = sql.trimStart().toUpperCase().startsWith('SELECT')?result.map(row=>{
						return {...row, ...row.json_data?JSON.parse(row.json_data.replaceAll(process.platform == 'win32'?'\r\n':'\n','')):null};
						}) ?? []:null;	
					if (pagination){
						//return pagination ISO20022 format
						//use pagination OR multiple resource 
						/**@ts-ignore */
						result.page_header = {	total_count:	result.length>0?result[0].total_rows:0,
												offset: 		parameters.offset?parameters.offset:0,
												count:			Math.min(parameters.limit, result.length)};
						resolve(
							/**@ts-ignore */
							{page_header:result.page_header, rows:rows}
						);
					}
					else
						resolve(rows ?? result);
				} catch (error) {
					return reject(error);
				}
						
			});
		})
		.catch((/**@type{server_server_error}*/error)=>{
			const database_error = 'DATABASE ERROR';
			//add db_message key since message is not saved for SQLite
			if (error.message)
				error.db_message = error.message;
			fileModelLog.postDBE(app_id, serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE')), sql, parameters, error)
			.then(()=>{
				const app_code = dbCommonAppCodeGet(error);
				if (app_code != null)
					return reject(error);
				else{
					//return full error to admin
					if (app_id==serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))){
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
		dbCommonCheckedError, dbCommonAppCodeGet, dbCommonRecordNotFound, dbCommonLocaleGet, dbCommonRowsLimit, dbCommonExecute
};