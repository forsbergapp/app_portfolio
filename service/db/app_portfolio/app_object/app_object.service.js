const {execute_db_sql} = require ("../../common/database");
module.exports = {
	//get objects from language code or from using this logic:
	//two levels:
	//if en-us not found then 
	//use en
	//three levels:
	//if zh-hans-cn, zh-hans-cn, zh-hant-hk, sr-cyrl-ba, sr-latn-ba not found then
	//use zh-hans, zh-hans, zh-hant, sr-cyrl, sr-latn
	//else use zh, zh, zh, sr, sr
	//get objects for common app id and current app id plus all APP_DESCRIPTION

	/*fetch APP_OBJECT
			APP_OBJECT_ITEM with APP_LOV with setting list to update translation
			APP_OBJECT_ITEM with APP items to update translation
			APP_OBJECT_ITEM_SUBITEM with APP items in an app
	*/
	getObjects: (app_id, lang_code, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE==1){
			sql = ` SELECT 	object, 
							app_id, 
							object_name, 
							object_item_name, 
							subitem_name, 
							lang_code, 
							id,
							text 
					FROM (SELECT 'APP_OBJECT' object, ao.app_id,  ao.object_name, null object_item_name,null subitem_name, l.lang_code, null id, aot.text
							FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object ao,
								 ${process.env.SERVICE_DB_DB1_NAME}.app_object_translation aot,
								 ${process.env.SERVICE_DB_DB1_NAME}.language l
						   WHERE l.id = aot.language_id
							 AND aot.app_object_app_id = ao.app_id
							 AND aot.app_object_object_name = ao.object_name
							 AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												  FROM ${process.env.SERVICE_DB_DB1_NAME}.language l1,
												       ${process.env.SERVICE_DB_DB1_NAME}.app_object_translation aot1
												 WHERE aot1.language_id = l1.id
												   AND aot1.app_object_app_id = ao.app_id
												   AND aot1.app_object_object_name = ao.object_name
												   AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
											   )
						  UNION ALL
						  SELECT 'APP_OBJECT_ITEM', aoi.app_object_app_id app_id, aoi.app_object_object_name object_name, aoi.object_item_name, null subitem_name, l.lang_code, s.id, str.text
							FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object_item aoi,
								 ${process.env.SERVICE_DB_DB1_NAME}.setting_type st,
								 ${process.env.SERVICE_DB_DB1_NAME}.setting s,
								 ${process.env.SERVICE_DB_DB1_NAME}.setting_translation str,
								 ${process.env.SERVICE_DB_DB1_NAME}.language l
						   WHERE st.id = aoi.setting_type_id
							 AND s.setting_type_id = st.id  
							 AND str.setting_id = s.id
							 AND l.id = str.language_id
							 AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												  FROM ${process.env.SERVICE_DB_DB1_NAME}.language l1,
												       ${process.env.SERVICE_DB_DB1_NAME}.setting_translation str1
												 WHERE str1.language_id = l1.id
												   AND str1.setting_id = s.id
												   AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
											   )
						  UNION ALL
						  SELECT 'APP_OBJECT_ITEM', aoi.app_object_app_id app_id, aoi.app_object_object_name object_name, aoi.object_item_name,null subitem_name, l.lang_code, null id, aoit.text
							FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object_item aoi,
								 ${process.env.SERVICE_DB_DB1_NAME}.app_object_item_translation aoit,
								 ${process.env.SERVICE_DB_DB1_NAME}.language l
						   WHERE l.id = aoit.language_id
							 AND aoit.app_object_item_app_object_app_id = aoi.app_object_app_id
							 AND aoit.app_object_item_app_object_object_name = aoi.app_object_object_name
							 AND aoit.app_object_item_object_item_name = aoi.object_item_name
							 AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												  FROM ${process.env.SERVICE_DB_DB1_NAME}.language l1,
												       ${process.env.SERVICE_DB_DB1_NAME}.app_object_item_translation aoit1
												 WHERE aoit1.language_id = l1.id
												   AND aoit1.app_object_item_app_object_app_id = aoi.app_object_app_id
												   AND aoit1.app_object_item_app_object_object_name = aoi.app_object_object_name
												   AND aoit1.app_object_item_object_item_name = aoi.object_item_name
												   AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
											   )
						  UNION ALL
						  SELECT 'APP_OBJECT_ITEM_SUBITEM', aois.app_object_item_app_object_app_id app_id, aois.app_object_item_app_object_object_name object_name, aois.app_object_item_object_item_name object_item_name, aois.subitem_name, l.lang_code, null id, aost.text
							FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object_item_subitem aois,
								 ${process.env.SERVICE_DB_DB1_NAME}.app_object_subitem_translation aost,
								 ${process.env.SERVICE_DB_DB1_NAME}.language l
						   WHERE l.id = aost.language_id
							 AND aost.app_object_item_subitem_app_object_item_app_id = aois.app_object_item_app_object_app_id
							 AND aost.app_object_item_subitem_app_object_item_object_name = aois.app_object_item_app_object_object_name
							 AND aost.app_object_item_subitem_app_object_item_object_item_name = aois.app_object_item_object_item_name
							 AND aost.app_object_item_subitem_subitem_name = aois.subitem_name
							 AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												  FROM ${process.env.SERVICE_DB_DB1_NAME}.language l1,
												       ${process.env.SERVICE_DB_DB1_NAME}.app_object_subitem_translation aost1
												 WHERE aost1.language_id = l1.id
												   AND aost1.app_object_item_subitem_app_object_item_app_id = aois.app_object_item_app_object_app_id
												   AND aost1.app_object_item_subitem_app_object_item_object_name = aois.app_object_item_app_object_object_name
												   AND aost1.app_object_item_subitem_app_object_item_object_item_name = aois.app_object_item_object_item_name
												   AND aost1.app_object_item_subitem_subitem_name = aois.subitem_name
												   AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
											   )) t
					WHERE   (t.app_id IN(?,?) OR t.object_name = 'APP_DESCRIPTION')
				ORDER BY 1, 2, 3, 4, 5, 6`;
			parameters = [	lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							lang_code,
							app_id,
							process.env.COMMON_APP_ID
							];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = ` SELECT 	object "object", 
							app_id "app_id", 
							object_name "object_name", 
							object_item_name "object_item_name", 
							subitem_name "subitem_name", 
							lang_code "lang_code", 
							id "id",
							text "text"
							FROM (SELECT 'APP_OBJECT' object, ao.app_id,  ao.object_name, null object_item_name,null subitem_name, l.lang_code, null id, aot.text
							FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object ao,
								 ${process.env.SERVICE_DB_DB2_NAME}.app_object_translation aot,
								 ${process.env.SERVICE_DB_DB2_NAME}.language l
						   WHERE l.id = aot.language_id
							 AND aot.app_object_app_id = ao.app_id
							 AND aot.app_object_object_name = ao.object_name
							 AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												  FROM ${process.env.SERVICE_DB_DB2_NAME}.language l1,
												       ${process.env.SERVICE_DB_DB2_NAME}.app_object_translation aot1
												 WHERE aot1.language_id = l1.id
												   AND aot1.app_object_app_id = ao.app_id
												   AND aot1.app_object_object_name = ao.object_name
												   AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
											   )
						  UNION ALL
						  SELECT 'APP_OBJECT_ITEM', aoi.app_object_app_id app_id, aoi.app_object_object_name object_name, aoi.object_item_name, null subitem_name, l.lang_code, s.id, str.text
							FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object_item aoi,
								 ${process.env.SERVICE_DB_DB2_NAME}.setting_type st,
								 ${process.env.SERVICE_DB_DB2_NAME}.setting s,
								 ${process.env.SERVICE_DB_DB2_NAME}.setting_translation str,
								 ${process.env.SERVICE_DB_DB2_NAME}.language l
						   WHERE st.id = aoi.setting_type_id
							 AND s.setting_type_id = st.id  
							 AND str.setting_id = s.id
							 AND l.id = str.language_id
							 AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												  FROM ${process.env.SERVICE_DB_DB2_NAME}.language l1,
												       ${process.env.SERVICE_DB_DB2_NAME}.setting_translation str1
												 WHERE str1.language_id = l1.id
												   AND str1.setting_id = s.id
												   AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
											   )
						  UNION ALL
						  SELECT 'APP_OBJECT_ITEM', aoi.app_object_app_id app_id, aoi.app_object_object_name object_name, aoi.object_item_name,null subitem_name, l.lang_code, null id, aoit.text
							FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object_item aoi,
								 ${process.env.SERVICE_DB_DB2_NAME}.app_object_item_translation aoit,
								 ${process.env.SERVICE_DB_DB2_NAME}.language l
						   WHERE l.id = aoit.language_id
							 AND aoit.app_object_item_app_object_app_id = aoi.app_object_app_id
							 AND aoit.app_object_item_app_object_object_name = aoi.app_object_object_name
							 AND aoit.app_object_item_object_item_name = aoi.object_item_name
							 AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												  FROM ${process.env.SERVICE_DB_DB2_NAME}.language l1,
												       ${process.env.SERVICE_DB_DB2_NAME}.app_object_item_translation aoit1
												 WHERE aoit1.language_id = l1.id
												   AND aoit1.app_object_item_app_object_app_id = aoi.app_object_app_id
												   AND aoit1.app_object_item_app_object_object_name = aoi.app_object_object_name
												   AND aoit1.app_object_item_object_item_name = aoi.object_item_name
												   AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
											   )
						  UNION ALL
						  SELECT 'APP_OBJECT_ITEM_SUBITEM', aois.app_object_item_app_object_app_id app_id, aois.app_object_item_app_object_object_name object_name, aois.app_object_item_object_item_name object_item_name, aois.subitem_name, l.lang_code, null id, aost.text
							FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object_item_subitem aois,
								 ${process.env.SERVICE_DB_DB2_NAME}.app_object_subitem_translation aost,
								 ${process.env.SERVICE_DB_DB2_NAME}.language l
						   WHERE l.id = aost.language_id
							 AND aost.app_object_item_subitem_app_object_item_app_id = aois.app_object_item_app_object_app_id
							 AND aost.app_object_item_subitem_app_object_item_object_name = aois.app_object_item_app_object_object_name
							 AND aost.app_object_item_subitem_app_object_item_object_item_name = aois.app_object_item_object_item_name
							 AND aost.app_object_item_subitem_subitem_name = aois.subitem_name
							 AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												  FROM ${process.env.SERVICE_DB_DB2_NAME}.language l1,
												       ${process.env.SERVICE_DB_DB2_NAME}.app_object_subitem_translation aost1
												 WHERE aost1.language_id = l1.id
												   AND aost1.app_object_item_subitem_app_object_item_app_id = aois.app_object_item_app_object_app_id
												   AND aost1.app_object_item_subitem_app_object_item_object_name = aois.app_object_item_app_object_object_name
												   AND aost1.app_object_item_subitem_app_object_item_object_item_name = aois.app_object_item_object_item_name
												   AND aost1.app_object_item_subitem_subitem_name = aois.subitem_name
												   AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
											   )) t
					WHERE   (t.app_id IN(:app_id, :common_app_id) OR t.object_name = 'APP_DESCRIPTION')
				ORDER BY 1, 2, 3, 4, 5, 6`;
			parameters = {
							common_app_id: process.env.COMMON_APP_ID,
							app_id: app_id,
							lang_code: lang_code
						 };
		}
		execute_db_sql(app_id, app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};