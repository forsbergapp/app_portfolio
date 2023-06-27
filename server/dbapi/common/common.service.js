const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

const get_app_code = (errorNum, message, code, errno, sqlMessage) => {
	const app_error_code = parseInt((JSON.stringify(errno) ?? JSON.stringify(errorNum)));
    //check if user defined exception
    if (app_error_code >= 20000){
        return app_error_code;
    } 
    else{
		//if known SQL error, example:
		//MariaDB sqlMessage
		//'Duplicate entry '[value]' for key 'user_account_username_un''
		//MySQL sqlMessage
		//'Duplicate entry '[value]' for key 'user_account.user_account_username_un''
		//PostgreSQL message:
		//'duplicate key value violates unique constraint "user_account_username_un"'
		//Oracle message:
		//'ORA-00001: unique constraint (APP_PORTFOLIO.USER_ACCOUNT_USERNAME_UN) violated'
		const db_use = ConfigGet(1, 'SERVICE_DB', 'USE');
		if ((db_use =='1' && code == 'ER_DUP_ENTRY') || //MariaDB/MySQL
			(db_use =='2' && errorNum ==1) ||  		  //Oracle
			(db_use =='3' && code=='23505')){ 		  //PostgreSQL
			let text_check;
			if (sqlMessage)
				text_check = JSON.stringify(sqlMessage);	//MariaDB/MySQL
			else
				text_check = JSON.stringify(message);		//Oracle/PostgreSQL
			let app_message_code = '';
			//check constraints errors, must be same name in mySQL and Oracle
			if (text_check.toUpperCase().includes('USER_ACCOUNT_EMAIL_UN'))
				app_message_code = 20200;
			if (text_check.toUpperCase().includes('USER_ACCOUNT_PROVIDER_ID_UN'))
				app_message_code = 20201;
			if (text_check.toUpperCase().includes('USER_ACCOUNT_USERNAME_UN'))
				app_message_code = 20203;
			if (app_message_code != '')
				return app_message_code;
			else
				return null;	
		}
		else
			return null;
	}
};
const record_not_found = (res, app_id, lang_code) => {
	import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
		import(`file://${process.cwd()}/server/dbapi/app_portfolio/message_translation/message_translation.service.js`).then(({ getMessage }) => {
			getMessage( app_id, 
						ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'),
						20400, 
						lang_code, (err,results_message)  => {
							return res.status(404).send(
								err ?? results_message.text
							);
						});
		});
	});
};
const get_locale = (lang_code, part) => {
	if (lang_code==null)
		return null;
	else
		switch (part){
			case 1:{
				return lang_code;
				break;
			}
			case 2:{
				if (lang_code.indexOf('-',lang_code.indexOf('-')+1) >-1)
					//ex zh-hant from zh-hant-cn
					return lang_code.substring(0,lang_code.indexOf('-',lang_code.indexOf('-')+1));
				else
					return lang_code;
				break;
			}
			case 3:{
				if (lang_code.indexOf('-')>-1)
					//ex zh from zh-hant-cn
					return lang_code.substring(0,lang_code.indexOf('-'));
				else
					return lang_code;
				break;
			}
		}
};
const db_schema = () => ConfigGet(1, 'SERVICE_DB', `DB${ConfigGet(1, 'SERVICE_DB', 'USE')}_NAME`);

const db_limit_rows = (sql, limit_type = null) => {
	const db_use = ConfigGet(1, 'SERVICE_DB', 'USE');
	if (db_use == '1' || db_use == '2' || db_use == '3')
		switch (limit_type){
			case 1:{
				//use env limit
				return sql + ` LIMIT ${ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_SEARCH')} `;
			}
			case 2:{
				//use env limit
				return sql + ` LIMIT ${ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_PROFILE_TOP')} `;
			}
			case null:{
				//use app function limit
				return sql + ' LIMIT :limit OFFSET :offset';	
			}
		}
	else 
		if (db_use == '4')
			switch (limit_type){
				case 1:{
					//use env limit
					return sql + ` FETCH NEXT ${ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_SEARCH')} ROWS ONLY`;
				}
				case 2:{
					//use env limit
					return sql + ` FETCH NEXT ${ConfigGet(1, 'SERVICE_DB', 'LIMIT_LIST_PROFILE_TOP')} ROWS ONLY`;
				}
				case null:{
					//use app function limit
					return sql + ' OFFSET :offset FETCH NEXT :limit ROWS ONLY';
				}
			}
		else
			return sql;
};

const db_execute = (app_id, sql, parameters, dba, callBack) =>{
	import(`file://${process.cwd()}/server/db/db.service.js`).then(({db_query}) => {
		db_query(app_id, parseInt(ConfigGet(1, 'SERVICE_DB', 'USE')), sql, parameters, dba)
		.then((result)=> {
			import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogDBI}) => {
				LogDBI(app_id, parseInt(ConfigGet(1, 'SERVICE_DB', 'USE')), sql, parameters, result)
				.then((result_info_log)=>{
					return callBack(null, result);});
				});
			})
		.catch(error=>{
			const database_error = 'DATABASE ERROR';
			import(`file://${process.cwd()}/server/log/log.service.js`).then(({LogDBE}) => {
				LogDBE(app_id, parseInt(ConfigGet(1, 'SERVICE_DB', 'USE')), sql, parameters, error)
				.then((result_error_log)=>{
					const app_code = get_app_code(error.errorNum, 
						error.message, 
						error.code, 
						error.errno, 
						error.sqlMessage);
					if (app_code != null)
						return callBack(error, null);
					else{
						//return full error to admin
						if (app_id==ConfigGet(1, 'SERVER', 'APP_COMMON_APP_ID'))
							return callBack(error, null);
						else
							return callBack(database_error, null);
					}
				});	
			});
		});
	});
};
export{
		get_app_code, record_not_found, get_locale,
		db_schema,  db_limit_rows, db_execute
};