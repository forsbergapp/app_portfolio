/** @module server/db/common */

/**
 * @import {server_server_response, server_db_common_result, server_server_error, server_db_common_result_error} from '../types.js'
*/

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

/**
 * @name dbCommonAppCodeGet
 * @description	Get app code derived from database error
 *				if known SQL error, example:
 *				MariaDB sqlMessage
 *					'Duplicate entry '[value]' for key 'user_account_username_un''
 *				MySQL sqlMessage
 *					'Duplicate entry '[value]' for key 'user_account.user_account_username_un''
 *				PostgreSQL message:
 *					'duplicate key value violates unique constraint "user_account_username_un"'
 *				Oracle message:
 *					'ORA-00001: unique constraint (APP_PORTFOLIO.USER_ACCOUNT_USERNAME_UN) violated'
 * @function
 * @param {number|null} db_use
 * @param {server_db_common_result_error} error
 * @returns (string|null)
 * 
 */
const dbCommonAppCodeGet = (db_use, error) => {
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
 * Returns database error message in ISO20022 format
 * Checks database if known app code found
 * Use error when unknown error occurs for both fileModel and dbModel
 * If error then returns known error using app setting message or full error
 * else returns either not found message (404) or not authorized message (400, 401)
 * @param {number|null} app_id
 * @param {number} statusCode
 * @param {*} error
 * @returns {Promise.<server_server_response>}
 */
const dbCommonRecordErrorAsync = async (app_id, statusCode, error=null) =>{
	/**@type{import('./fileModelConfig.js')} */
	const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

	const COMMON_APP_ID = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0;
	if (error){
		/**@type{import('./dbModelAppSetting.js')} */
		const { getDisplayData } = await import(`file://${process.cwd()}/server/db/dbModelAppSetting.js`);
		const DB_USE = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
		//search known error in db error or if not found use errorNum key used by data validation in case used
		//or return full error
		const app_code = dbCommonAppCodeGet(DB_USE, error) ?? error.errorNum;
		return {http:statusCode,
				code:null,
				text:app_code?await getDisplayData({app_id:app_id ?? COMMON_APP_ID,
													data:{	data_app_id:COMMON_APP_ID,
															setting_type:'MESSAGE',
															value:app_code}
													})
									.then(result=>result.result[0].display_data)
									.catch(()=>error):error,
				developerText:null,
				moreInfo:null,
				type:'JSON'};
	}
	else{
		return {http:statusCode,
				code:null,
				text:error?error:statusCode==404?'?!':'⛔',
				developerText:null,
				moreInfo:null,
				type:'JSON'};
	}
};

/**
 * Returns database error message in ISO20022 format
 * Does not check database for known errors
 * Use error when unknown error occurs for both fileModel and dbModel
 * @param {number|null} app_id
 * @param {number} statusCode
 * @param {*} error
 * @returns {server_server_response}
 */
const dbCommonRecordError = (app_id, statusCode, error=null) =>{
	if (error){
		return {http:statusCode,
				code:'DB',
				text:error,
				developerText:null,
				moreInfo:null,
				type:'JSON'};
	}
	else{
		return {http:statusCode,
				code:'DB',
				text:error?error:statusCode==404?'?!':'⛔',
				developerText:null,
				moreInfo:null,
				type:'JSON'};
	}
};

/**
 * @name dbCommonLocaleGet
 * @description	Get locale part
 * 				1 = complete lang code
 * 				2 = ex zh-hant from zh-hant-cn
 * 				3 = ex zh from zh-hant-cn
 * @function
 * @param {string} locale 
 * @param {number} part 
 * @returns {string|null}
 */
const dbCommonLocaleGet = (locale, part) => {
	if (locale==null)
		return null;
	else
		switch (part){
			case 1:{
				return locale;
			}
			case 2:{
				if (locale.indexOf('-',locale.indexOf('-')+1) >-1)
					return locale.substring(0,locale.indexOf('-',locale.indexOf('-')+1));
				else
					return locale;
			}
			case 3:{
				if (locale.indexOf('-')>-1)
					return locale.substring(0,locale.indexOf('-'));
				else
					return locale;
			}
			default:
				return null;
		}
};

/**
 * @name dbCommonRowsLimit
 * @description	Sets pagination using limit and offset or limit records on SQL rows
 * @function
 * @param {number|null} db_use
 * @param {boolean} pagination
 * @returns {string}
 */
const dbCommonRowsLimit = (db_use, pagination = true) => {
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
 * @name dbCommonDatePeriod
 * @description	Get SQL date string using EXTRACT or STRFTIME depending database
 * 				examples in WHERE clause:
 * 				Database 1,2,3,4:
 * 					EXTRACT(year from date_created) 	= :year
 * 					EXTRACT(month from date_created)	= :month
 *  				EXTRACT(day from date_created) 		= :day
 * 				Database 5:
 *  				CAST(STRFTIME('%Y', date_created) AS INT) = :year
 *  				CAST(STRFTIME('%m', date_created) AS INT) = :month
 *  				CAST(STRFTIME('%d', date_created) AS INT) = :day
 * @function
 * @param {number|null} db_use
 * @param {'YEAR'|'MONTH'|'DAY'} period
 * @returns {string}
 */
const dbCommonDatePeriod = (db_use,period)=>db_use==5?
								` CAST(STRFTIME('%${period=='YEAR'?'Y':period=='MONTH'?'m':period=='DAY'?'d':''}', date_created) AS INT) `:
								` EXTRACT(${period} from date_created)`;
														
/**
 * @name dbCommonExecute
 * @description	Common execute SQL
 * 				Updates SQL before execution:
 * 				sets DB schema
 * 				sets date period syntax depending database used
 * 				sets locale search string
 * 				sets pagination info
 * 				sets limit record
 * 				Modifies SQL result:
 * 				parses json_data column so json_data columns are returned also if any
 * 				returns pagination in ISO20022 format if used
 * @function
 * @param {number|null} app_id 
 * @param {string} sql 
 * @param {*} parameters 
 * @param {number|null} dba 
 * @param {string|null} locale 
 * @returns {Promise.<server_server_response>}
 */
 const dbCommonExecute = async (app_id, sql, parameters, dba = null, locale=null) =>{
	/**@type{import('./db.js')} */
	const {dbSQL} = await import(`file://${process.cwd()}/server/db/db.js`);
	/**@type{import('./fileModelLog.js')} */
	const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
	/**@type{import('./fileModelAppParameter.js')} */
	const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);
	/**@type{import('./fileModelConfig.js')} */
	const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

	const DB_USE = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));
	const COMMON_APP_ID = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_COMMON_APP_ID'))??0;
	return new Promise ((resolve)=>{
		//manage schema
		//syntax in SQL: FROM '<DB_SCHEMA/>'.[table] 
		sql = sql.replaceAll('<DB_SCHEMA/>', fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${DB_USE}_NAME`) ?? '');
		//manage different syntax
		//syntax in SQL: WHERE '<DATE_PERIOD_YEAR/>' = [bind variable] etc
		sql = sql.replaceAll('<DATE_PERIOD_YEAR/>', dbCommonDatePeriod(DB_USE, 'YEAR'));
		sql = sql.replaceAll('<DATE_PERIOD_MONTH/>', dbCommonDatePeriod(DB_USE, 'MONTH'));
		sql = sql.replaceAll('<DATE_PERIOD_DAY/>', dbCommonDatePeriod(DB_USE, 'DAY'));
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
			sql = sql.replaceAll('<APP_PAGINATION_LIMIT_OFFSET/>', 	dbCommonRowsLimit(DB_USE, true));
			if (!parameters.limit)
				parameters.limit = 	serverUtilNumberValue(fileModelAppParameter.get( {	app_id:app_id ?? COMMON_APP_ID,
																						resource_id:COMMON_APP_ID}).result[0].common_app_limit_records.value);
		}
		//manage limit records
		if (sql.indexOf('<APP_LIMIT_RECORDS/>')>0){
			//parameters should not contain any limit or offset keys
			sql = sql.replaceAll('<APP_LIMIT_RECORDS/>', 		dbCommonRowsLimit(DB_USE, false));
			parameters = {...parameters, ...{limit:serverUtilNumberValue(fileModelAppParameter.get( {	app_id:app_id ?? COMMON_APP_ID,
																										resource_id:COMMON_APP_ID}).result[0].common_app_limit_records.value)}};
		}

		dbSQL(app_id, DB_USE, sql, parameters, dba)
		.then((/**@type{server_db_common_result}*/result)=> {
			fileModelLog.postDBI(app_id, DB_USE, sql, parameters, result)
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
												count:			Math.min(	parameters.limit, 
																			/**@ts-ignore */
																			result.length)};
						/**@ts-ignore */
						resolve({result:{page_header:result.page_header, rows:rows}, type:'JSON'});
					}
					else
						resolve({result:rows ?? result, type:'JSON'});
				} catch (error) {
					return resolve(dbCommonRecordErrorAsync(app_id, 500, error));
				}
						
			});
		})
		.catch((/**@type{server_server_error}*/error)=>{
			//add db_message key since message is not saved for SQLite
			if (error.message)
				error.db_message = error.message;
			//SQLite does not display sql in error
			if (!error.sql)
				error.sql = sql;
			fileModelLog.postDBE(app_id, DB_USE, sql, parameters, error)
			.then(()=>resolve(dbCommonRecordErrorAsync(app_id, 500, error)));
		});
	});
};

export{
		dbCommonRecordErrorAsync, dbCommonRecordError, dbCommonLocaleGet, dbCommonExecute
};