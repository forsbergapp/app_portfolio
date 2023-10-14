const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const {db_execute, db_schema, get_locale} = await import(`file://${process.cwd()}/server/dbapi/common/common.service.js`);
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);

const getObjects = (app_id, lang_code, object, object_name, callBack) => {
		const sql = ` SELECT 	object "object", 
						app_id "app_id", 
						object_name "object_name", 
						object_item_name "object_item_name", 
						subitem_name "subitem_name", 
						lang_code "lang_code", 
						id "id",
						text "text"
				  FROM (SELECT 'APP_OBJECT' object, ao.app_id,  ao.object_name, null object_item_name,null subitem_name, l.lang_code, null id, aot.text
						  FROM ${db_schema()}.app_object ao,
							   ${db_schema()}.app_object_translation aot,
							   ${db_schema()}.language l
						 WHERE l.id = aot.language_id
						   AND aot.app_object_app_id = ao.app_id
						   AND aot.app_object_object_name = ao.object_name
						   AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM ${db_schema()}.language l1,
													 ${db_schema()}.app_object_translation aot1
											   WHERE aot1.language_id = l1.id
												 AND aot1.app_object_app_id = ao.app_id
												 AND aot1.app_object_object_name = ao.object_name
												 AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
											 )
						UNION ALL
						SELECT 'APP_OBJECT_ITEM', aoi.app_object_app_id app_id, aoi.app_object_object_name object_name, aoi.object_item_name, null subitem_name, l.lang_code, s.id, str.text
						  FROM ${db_schema()}.app_object_item aoi,
							   ${db_schema()}.setting_type st,
							   ${db_schema()}.setting s,
							   ${db_schema()}.setting_translation str,
							   ${db_schema()}.language l
						 WHERE st.id = aoi.setting_type_id
						   AND s.setting_type_id = st.id  
						   AND str.setting_id = s.id
						   AND l.id = str.language_id
						   AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM ${db_schema()}.language l1,
													 ${db_schema()}.setting_translation str1
											   WHERE str1.language_id = l1.id
												 AND str1.setting_id = s.id
												 AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
											 )
						UNION ALL
						SELECT 'APP_OBJECT_ITEM', aoi.app_object_app_id app_id, aoi.app_object_object_name object_name, aoi.object_item_name,null subitem_name, l.lang_code, null id, aoit.text
						  FROM ${db_schema()}.app_object_item aoi,
							   ${db_schema()}.app_object_item_translation aoit,
							   ${db_schema()}.language l
						 WHERE l.id = aoit.language_id
						   AND aoit.app_object_item_app_object_app_id = aoi.app_object_app_id
						   AND aoit.app_object_item_app_object_object_name = aoi.app_object_object_name
						   AND aoit.app_object_item_object_item_name = aoi.object_item_name
						   AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM ${db_schema()}.language l1,
													 ${db_schema()}.app_object_item_translation aoit1
											   WHERE aoit1.language_id = l1.id
												 AND aoit1.app_object_item_app_object_app_id = aoi.app_object_app_id
												 AND aoit1.app_object_item_app_object_object_name = aoi.app_object_object_name
												 AND aoit1.app_object_item_object_item_name = aoi.object_item_name
												 AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
											 )
						UNION ALL
						SELECT 'APP_OBJECT_ITEM_SUBITEM', aois.app_object_item_app_object_app_id app_id, aois.app_object_item_app_object_object_name object_name, aois.app_object_item_object_item_name object_item_name, aois.subitem_name, l.lang_code, null id, aost.text
						  FROM ${db_schema()}.app_object_item_subitem aois,
							   ${db_schema()}.app_object_subitem_translation aost,
							   ${db_schema()}.language l
						 WHERE l.id = aost.language_id
						   AND aost.app_object_item_subitem_app_object_item_app_object_app_id = aois.app_object_item_app_object_app_id
						   AND aost.app_object_item_subitem_app_object_item_app_object_object_name = aois.app_object_item_app_object_object_name
						   AND aost.app_object_item_subitem_app_object_item_object_item_name = aois.app_object_item_object_item_name
						   AND aost.app_object_item_subitem_subitem_name = aois.subitem_name
						   AND l.lang_code = (SELECT COALESCE(MAX(l1.lang_code),'en')
												FROM ${db_schema()}.language l1,
													 ${db_schema()}.app_object_subitem_translation aost1
											   WHERE aost1.language_id = l1.id
												 AND aost1.app_object_item_subitem_app_object_item_app_object_app_id = aois.app_object_item_app_object_app_id
												 AND aost1.app_object_item_subitem_app_object_item_app_object_object_name = aois.app_object_item_app_object_object_name
												 AND aost1.app_object_item_subitem_app_object_item_object_item_name = aois.app_object_item_object_item_name
												 AND aost1.app_object_item_subitem_subitem_name = aois.subitem_name
												 AND l1.lang_code IN (:lang_code1, :lang_code2, :lang_code3)
											 )) t
				WHERE   (t.app_id IN(:app_id, :common_app_id) OR t.object_name = 'APP_DESCRIPTION')
					AND   t.object = COALESCE(:object, t.object)
					AND   t.object_name = COALESCE(:Xobject_Xname, t.object_name)
			ORDER BY 1, 2, 3, 4, 5, 6`;
		const parameters = {
						common_app_id: getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')),
						app_id: app_id,
						lang_code1: get_locale(lang_code, 1),
						lang_code2: get_locale(lang_code, 2),
						lang_code3: get_locale(lang_code, 3),
						object : object,
						Xobject_Xname: object_name
						};
		db_execute(app_id, sql, parameters, null, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	};
export{getObjects};