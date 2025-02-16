/** @module server/db/common */

/**
 * @import {server_server_response, server_db_common_result, server_server_error, server_db_common_result_error} from '../types.js'
*/

/**@type{import('../server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);

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
 * 				Modifies SQL result:
 * 				parses json_data column so json_data columns are returned also if any
 * @function
 * @param {number|null} app_id 
 * @param {string} sql 
 * @param {*} parameters 
 * @returns {Promise.<server_server_response>}
 */
 const dbCommonExecute = async (app_id, sql, parameters) =>{
	/**@type{import('./db.js')} */
	const {dbSQL} = await import(`file://${process.cwd()}/server/db/db.js`);
	/**@type{import('./fileModelLog.js')} */
	const fileModelLog = await import(`file://${process.cwd()}/server/db/fileModelLog.js`);
	/**@type{import('./fileModelConfig.js')} */
	const fileModelConfig = await import(`file://${process.cwd()}/server/db/fileModelConfig.js`);

	const DB_USE = serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', 'USE'));

	return new Promise ((resolve)=>{
		//manage schema
		//syntax in SQL: FROM '<DB_SCHEMA/>'.[table] 
		sql = sql.replaceAll('<DB_SCHEMA/>', fileModelConfig.get('CONFIG_SERVER','SERVICE_DB', `DB${DB_USE}_NAME`) ?? '');
		//manage different syntax
		//syntax in SQL: WHERE '<DATE_PERIOD_YEAR/>' = [bind variable] etc
		sql = sql.replaceAll('<DATE_PERIOD_YEAR/>', dbCommonDatePeriod(DB_USE, 'YEAR'));
		sql = sql.replaceAll('<DATE_PERIOD_MONTH/>', dbCommonDatePeriod(DB_USE, 'MONTH'));
		sql = sql.replaceAll('<DATE_PERIOD_DAY/>', dbCommonDatePeriod(DB_USE, 'DAY'));
		
		dbSQL(app_id, DB_USE, sql, parameters, app_id == serverUtilNumberValue(fileModelConfig.get('CONFIG_SERVER','SERVER', 'APP_ADMIN_APP_ID')))
		.then((/**@type{server_db_common_result}*/result)=> {
			fileModelLog.postDBI(app_id, DB_USE, sql, parameters, result)
			.then(()=>{
				//parse json_data in SELECT rows, return also the json_data column as reference
				try {
					/**@ts-ignore */
					const rows = sql.trimStart().toUpperCase().startsWith('SELECT')?result.map(row=>{
						return {...row, ...row.json_data?JSON.parse(row.json_data.replaceAll(process.platform == 'win32'?'\r\n':'\n','')):null};
						}) ?? []:null;	
					resolve({result:rows ?? result, type:'JSON'});
				} catch (error) {
					return resolve(dbCommonRecordError(app_id, 500, error));
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
			.then(()=>resolve(dbCommonRecordError(app_id, 500, error)));
		});
	});
};

export{
		dbCommonRecordError, dbCommonExecute
};