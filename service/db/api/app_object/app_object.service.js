const {execute_db_sql} = require ("../../config/database");
module.exports = {
	//get objects from language code or from using this logic:
	//two levels:
	//if en-us not found then 
	//use en
	//three levels:
	//if zh-hans-cn, zh-hans-cn, zh-hant-hk, sr-cyrl-ba, sr-latn-ba not found then
	//use zh-hans, zh-hans, zh-hant, sr-cyrl, sr-latn
	//else use zh, zh, zh, sr, sr
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
							text 
					FROM (SELECT 'APP_OBJECT' object, ao.app_id,  ao.object_name, null object_item_name,null subitem_name, l.lang_code,  aot.text
							FROM  ${process.env.SERVICE_DB_DB1_NAME}.app_object ao,
								${process.env.SERVICE_DB_DB1_NAME}.app_object_translation aot,
								${process.env.SERVICE_DB_DB1_NAME}.language l
							WHERE l.id = aot.language_id
							AND   aot.app_id = ao.app_id
							AND   aot.object_name = ao.object_name
							UNION ALL
							SELECT 'APP_OBJECT_ITEM', aoi.app_id, aoi.object_name, aoi.object_item_name,null subitem_name, l.lang_code, aoit.text
							FROM  ${process.env.SERVICE_DB_DB1_NAME}.app_object_item aoi,
								${process.env.SERVICE_DB_DB1_NAME}.app_object_item_translation aoit,
								${process.env.SERVICE_DB_DB1_NAME}.language l
							WHERE l.id = aoit.language_id
							AND   aoit.app_id = aoi.app_id
							AND   aoit.object_name = aoi.object_name
							AND   aoit.object_item_name = aoi.object_item_name
							UNION ALL
							SELECT 'APP_OBJECT_ITEM_SUBITEM', aois.app_id, aois.object_name, aois.object_item_name, aois.subitem_name, l.lang_code, aost.text
							FROM  ${process.env.SERVICE_DB_DB1_NAME}.app_object_item_subitem aois,
								${process.env.SERVICE_DB_DB1_NAME}.app_object_subitem_translation aost,
								${process.env.SERVICE_DB_DB1_NAME}.language l
							WHERE l.id = aost.language_id
							AND   aost.app_id = aois.app_id
							AND   aost.object_name = aois.object_name
							AND   aost.object_item_name = aois.object_item_name
							AND   aost.subitem_name = aois.subitem_name) t
					WHERE   t.app_id = ?
					AND   (t.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
							OR (t.lang_code = 'en'
								AND NOT EXISTS(SELECT NULL
												FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object_translation t1,
													${process.env.SERVICE_DB_DB1_NAME}.language l1
												WHERE t1.object_name = t.object_name
												AND l1.id = t1.language_id
												AND l1.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
												UNION ALL
											SELECT NULL
												FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object_item_translation t2,
													${process.env.SERVICE_DB_DB1_NAME}.language l2
												WHERE t2.object_name = t.object_name
												AND t2.object_item_name = t.object_item_name
												AND l2.id = t2.language_id
												AND l2.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
												UNION ALL
											SELECT NULL
												FROM ${process.env.SERVICE_DB_DB1_NAME}.app_object_subitem_translation t3,
													${process.env.SERVICE_DB_DB1_NAME}.language l3
												WHERE t3.object_name = t.object_name
												AND t3.object_item_name = t.object_item_name
												AND t3.subitem_name = t.subitem_name
												AND l3.id = t3.language_id
												AND l3.lang_code IN (?, SUBSTRING_INDEX(?,'-',2), SUBSTRING_INDEX(?,'-',1))
												)
								)
							)
				ORDER BY 1,2,3,4, 5, 6`;
			parameters = [	app_id,
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
							lang_code
							];
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = ` SELECT 	object "object", 
							app_id "app_id", 
							object_name "object_name", 
							object_item_name "object_item_name", 
							subitem_name "subitem_name", 
							lang_code "lang_code", 
							text "text"
					FROM (SELECT 'APP_OBJECT' object, ao.app_id,  ao.object_name, null object_item_name,null subitem_name, l.lang_code,  aot.text
							FROM  ${process.env.SERVICE_DB_DB2_NAME}.app_object ao,
									${process.env.SERVICE_DB_DB2_NAME}.app_object_translation aot,
									${process.env.SERVICE_DB_DB2_NAME}.language l
							WHERE l.id = aot.language_id
							AND   aot.app_id = ao.app_id
							AND   aot.object_name = ao.object_name
							UNION ALL
							SELECT 'APP_OBJECT_ITEM', aoi.app_id, aoi.object_name, aoi.object_item_name,null subitem_name, l.lang_code, aoit.text
							FROM  ${process.env.SERVICE_DB_DB2_NAME}.app_object_item aoi,
									${process.env.SERVICE_DB_DB2_NAME}.app_object_item_translation aoit,
									${process.env.SERVICE_DB_DB2_NAME}.language l
							WHERE l.id = aoit.language_id
							AND   aoit.app_id = aoi.app_id
							AND   aoit.object_name = aoi.object_name
							AND   aoit.object_item_name = aoi.object_item_name
							UNION ALL
							SELECT 'APP_OBJECT_ITEM_SUBITEM', aois.app_id, aois.object_name, aois.object_item_name, aois.subitem_name, l.lang_code, aost.text
							FROM  ${process.env.SERVICE_DB_DB2_NAME}.app_object_item_subitem aois,
									${process.env.SERVICE_DB_DB2_NAME}.app_object_subitem_translation aost,
									${process.env.SERVICE_DB_DB2_NAME}.language l
							WHERE l.id = aost.language_id
							AND   aost.app_id = aois.app_id
							AND   aost.object_name = aois.object_name
							AND   aost.object_item_name = aois.object_item_name
							AND   aost.subitem_name = aois.subitem_name) t
					WHERE   t.app_id = :app_id
					AND   (t.lang_code IN (:lang_code, 
											SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), 
											SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
							OR (t.lang_code = 'en'
								AND NOT EXISTS(SELECT NULL
												FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object_translation t1,
														${process.env.SERVICE_DB_DB2_NAME}.language l1
												WHERE t1.object_name = t.object_name
												AND l1.id = t1.language_id
												AND l1.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
												UNION ALL
												SELECT NULL
												FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object_item_translation t2,
														${process.env.SERVICE_DB_DB2_NAME}.language l2
													WHERE t2.object_name = t.object_name
												AND t2.object_item_name = t.object_item_name
												AND l2.id = t2.language_id
												AND l2.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
												UNION ALL
												SELECT NULL
												FROM ${process.env.SERVICE_DB_DB2_NAME}.app_object_subitem_translation t3,
														${process.env.SERVICE_DB_DB2_NAME}.language l3
												WHERE t3.object_name = t.object_name
												AND t3.object_item_name = t.object_item_name
												AND t3.subitem_name = t.subitem_name
												AND l3.id = t3.language_id
												AND l3.lang_code IN (:lang_code, SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,2)-1), SUBSTR(:lang_code, 0,INSTR(:lang_code,'-',1,1)-1))
												)
								)
							)
				ORDER BY 1,2,3,4, 5, 6`;
			parameters = {
							app_id: app_id,
							lang_code: lang_code
						 };
		}
		execute_db_sql(app_id, app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};