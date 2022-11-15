const {execute_db_sql, get_schema_name} = require ("../../common/common.service");
module.exports = {
	createUserSetting: (app_id, initial, data, callBack) => {
		let sql;
		let parameters;
		sql = `INSERT INTO ${get_schema_name()}.app2_user_setting(
					description,
					regional_language_locale,
					regional_timezone,
					regional_number_system,
					regional_layout_direction,
					regional_second_language_locale,
					regional_column_title,
					regional_arabic_script,
					regional_calendar_type,
					regional_calendar_hijri_type,
					gps_map_type,
					gps_country_id,
					gps_city_id,
					gps_popular_place_id,
					gps_lat_text,
					gps_long_text,
					design_theme_day_id,
					design_theme_month_id,
					design_theme_year_id,
					design_paper_size,
					design_row_highlight,
					design_column_weekday_checked,
					design_column_calendartype_checked,
					design_column_notes_checked,
					design_column_gps_checked,
					design_column_timezone_checked,
					image_header_image_img,
					image_footer_image_img,
					text_header_1_text,
					text_header_2_text,
					text_header_3_text,
					text_header_align,
					text_footer_1_text,
					text_footer_2_text,
					text_footer_3_text,
					text_footer_align,
					prayer_method,
					prayer_asr_method,
					prayer_high_latitude_adjustment,
					prayer_time_format,
					prayer_hijri_date_adjustment,
					prayer_fajr_iqamat,
					prayer_dhuhr_iqamat,
					prayer_asr_iqamat,
					prayer_maghrib_iqamat,
					prayer_isha_iqamat,
					prayer_column_imsak_checked,
					prayer_column_sunset_checked,
					prayer_column_midnight_checked,
					prayer_column_fast_start_end,
					date_created,
					date_modified,
					user_account_app_user_account_id,
					user_account_app_app_id)
				SELECT	:description,
						:regional_language_locale,
						:regional_timezone,
						:regional_number_system,
						:regional_layout_direction,
						:regional_second_language_locale,
						:regional_column_title,
						:regional_arabic_script,
						:regional_calendar_type,
						:regional_calendar_hijri_type,
						:gps_map_type,
						:gps_country_id,
						:gps_city_id,
						:gps_popular_place_id,
						:gps_lat_text,
						:gps_long_text,
						:design_theme_day_id,
						:design_theme_month_id,
						:design_theme_year_id,
						:design_paper_size,
						:design_row_highlight,
						:design_column_weekday_checked,
						:design_column_calendartype_checked,
						:design_column_notes_checked,
						:design_column_gps_checked,
						:design_column_timezone_checked,
						:image_header_image_img,
						:image_footer_image_img,
						:text_header_1_text,
						:text_header_2_text,
						:text_header_3_text,
						:text_header_align,
						:text_footer_1_text,
						:text_footer_2_text,
						:text_footer_3_text,
						:text_footer_align,
						:prayer_method,
						:prayer_asr_method,
						:prayer_high_latitude_adjustment,
						:prayer_time_format,
						:prayer_hijri_date_adjustment,
						:prayer_fajr_iqamat,
						:prayer_dhuhr_iqamat,
						:prayer_asr_iqamat,
						:prayer_maghrib_iqamat,
						:prayer_isha_iqamat,
						:prayer_column_imsak_checked,
						:prayer_column_sunset_checked,
						:prayer_column_midnight_checked,
						:prayer_column_fast_start_end,
						CURRENT_TIMESTAMP,
						CURRENT_TIMESTAMP,
						:user_account_id,
						:app_id
				FROM DUAL 
				WHERE NOT EXISTS (SELECT null
									FROM ${get_schema_name()}.app2_user_setting aus
									WHERE :initial_setting = 1
										AND aus.user_account_app_user_account_id = :user_account_id
										AND aus.user_account_app_app_id = :app_id)`;
		if (process.env.SERVICE_DB_USE==2){
			data.image_header_image_img = Buffer.from(data.image_header_image_img, 'utf8');
			data.image_footer_image_img = Buffer.from(data.image_footer_image_img, 'utf8');
		}
		parameters = {
						description: data.description,
						regional_language_locale: data.regional_language_locale,
						regional_timezone: data.regional_timezone,
						regional_number_system: data.regional_number_system,
						regional_layout_direction: data.regional_layout_direction,
						regional_second_language_locale: data.regional_second_language_locale,
						regional_column_title: data.regional_column_title,
						regional_arabic_script: data.regional_arabic_script,
						regional_calendar_type: data.regional_calendar_type,
						regional_calendar_hijri_type: data.regional_calendar_hijri_type,
						gps_map_type: data.gps_map_type,
						gps_country_id: data.gps_country_id,
						gps_city_id: data.gps_city_id,
						gps_popular_place_id: data.gps_popular_place_id,
						gps_lat_text: data.gps_lat_text,
						gps_long_text: data.gps_long_text,
						design_theme_day_id: data.design_theme_day_id,
						design_theme_month_id: data.design_theme_month_id,
						design_theme_year_id: data.design_theme_year_id,
						design_paper_size: data.design_paper_size,
						design_row_highlight: data.design_row_highlight,
						design_column_weekday_checked: data.design_column_weekday_checked,
						design_column_calendartype_checked: data.design_column_calendartype_checked,
						design_column_notes_checked: data.design_column_notes_checked,
						design_column_gps_checked: data.design_column_gps_checked,
						design_column_timezone_checked: data.design_column_timezone_checked,
						image_header_image_img: data.image_header_image_img,
						image_footer_image_img: data.image_footer_image_img,
						text_header_1_text: data.text_header_1_text,
						text_header_2_text: data.text_header_2_text,
						text_header_3_text: data.text_header_3_text,
						text_header_align: data.text_header_align,
						text_footer_1_text: data.text_footer_1_text,
						text_footer_2_text: data.text_footer_2_text,
						text_footer_3_text: data.text_footer_3_text,
						text_footer_align: data.text_footer_align,
						prayer_method: data.prayer_method,
						prayer_asr_method: data.prayer_asr_method,
						prayer_high_latitude_adjustment: data.prayer_high_latitude_adjustment,
						prayer_time_format: data.prayer_time_format,
						prayer_hijri_date_adjustment: data.prayer_hijri_date_adjustment,
						prayer_fajr_iqamat: data.prayer_fajr_iqamat,
						prayer_dhuhr_iqamat: data.prayer_dhuhr_iqamat,
						prayer_asr_iqamat: data.prayer_asr_iqamat,
						prayer_maghrib_iqamat: data.prayer_maghrib_iqamat,
						prayer_isha_iqamat: data.prayer_isha_iqamat,
						prayer_column_imsak_checked: data.prayer_column_imsak_checked,
						prayer_column_sunset_checked: data.prayer_column_sunset_checked,
						prayer_column_midnight_checked: data.prayer_column_midnight_checked,
						prayer_column_fast_start_end: data.prayer_column_fast_start_end,
						user_account_id: data.user_account_id,
						app_id: app_id,
						initial_setting: initial
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				if (process.env.SERVICE_DB_USE==1)
					return callBack(null, result);
				else
					if (process.env.SERVICE_DB_USE==2){
						if (initial==1){
							//user logged in and if user setting is created or not
							//not used here
							return callBack(null, result);
						}									
						else{
							//Fetch id from rowid returned from Oracle
							//sample output:
							//{"lastRowid":"AAAWwdAAAAAAAdHAAC","rowsAffected":1}
							//remove "" before and after
							var lastRowid = JSON.stringify(result.lastRowid).replace(/"/g,'');
							sql = `SELECT id "insertId"
									FROM ${get_schema_name()}.app2_user_setting
									WHERE rowid = :lastRowid`;
							parameters = {
											lastRowid: lastRowid
										};
							execute_db_sql(app_id, sql, parameters, null, 
										   __appfilename, __appfunction, __appline, (err, result_id2)=>{
								if (err)
									return callBack(err, null);
								else
									return callBack(null, result_id2.rows[0]);
							});
						}
					}
		});
	},
	getUserSetting:  (app_id, id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT	id,
							description,
							regional_language_locale,
							regional_timezone,
							regional_number_system,
							regional_layout_direction,
							regional_second_language_locale,
							regional_column_title,
							regional_arabic_script,
							regional_calendar_type,
							regional_calendar_hijri_type,
							gps_map_type,
							gps_country_id,
							gps_city_id,
							gps_popular_place_id,
							gps_lat_text,
							gps_long_text,
							design_theme_day_id,
							design_theme_month_id,
							design_theme_year_id,
							design_paper_size,
							design_row_highlight,
							design_column_weekday_checked,
							design_column_calendartype_checked,
							design_column_notes_checked,
							design_column_gps_checked,
							design_column_timezone_checked,
							CONVERT(image_header_image_img USING UTF8) image_header_image_img,
							CONVERT(image_footer_image_img USING UTF8) image_footer_image_img,
							text_header_1_text,
							text_header_2_text,
							text_header_3_text,
							text_header_align,
							text_footer_1_text,
							text_footer_2_text,
							text_footer_3_text,
							text_footer_align,
							prayer_method,
							prayer_asr_method,
							prayer_high_latitude_adjustment,
							prayer_time_format,
							prayer_hijri_date_adjustment,
							prayer_fajr_iqamat,
							prayer_dhuhr_iqamat,
							prayer_asr_iqamat,
							prayer_maghrib_iqamat,
							prayer_isha_iqamat,
							prayer_column_imsak_checked,
							prayer_column_sunset_checked,
							prayer_column_midnight_checked,
							prayer_column_fast_start_end,
							date_created,
							date_modified,
							user_account_app_user_account_id,
							user_account_app_app_id
						FROM ${get_schema_name()}.app2_user_setting 
						WHERE id = :id `;
		}else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	id "id",
							description "description",
							regional_language_locale "regional_language_locale",
							regional_timezone "regional_timezone",
							regional_number_system "regional_number_system",
							regional_layout_direction "regional_layout_direction",
							regional_second_language_locale "regional_second_language_locale",
							regional_column_title "regional_column_title",
							regional_arabic_script "regional_arabic_script",
							regional_calendar_type "regional_calendar_type",
							regional_calendar_hijri_type "regional_calendar_hijri_type",
							gps_map_type "gps_map_type",
							gps_country_id "gps_country_id",
							gps_city_id "gps_city_id",
							gps_popular_place_id "gps_popular_place_id",
							gps_lat_text "gps_lat_text",
							gps_long_text "gps_long_text",
							design_theme_day_id "design_theme_day_id",
							design_theme_month_id "design_theme_month_id",
							design_theme_year_id "design_theme_year_id",
							design_paper_size "design_paper_size",
							design_row_highlight "design_row_highlight",
							design_column_weekday_checked "design_column_weekday_checked",
							design_column_calendartype_checked "design_column_calendartype_checked",
							design_column_notes_checked "design_column_notes_checked",
							design_column_gps_checked "design_column_gps_checked",
							design_column_timezone_checked "design_column_timezone_checked",
							image_header_image_img "image_header_image_img",
							image_footer_image_img "image_footer_image_img",
							text_header_1_text "text_header_1_text",
							text_header_2_text "text_header_2_text",
							text_header_3_text "text_header_3_text",
							text_header_align "text_header_align",
							text_footer_1_text "text_footer_1_text",
							text_footer_2_text "text_footer_2_text",
							text_footer_3_text "text_footer_3_text",
							text_footer_align "text_footer_align",
							prayer_method "prayer_method",
							prayer_asr_method "prayer_asr_method",
							prayer_high_latitude_adjustment "prayer_high_latitude_adjustment",
							prayer_time_format "prayer_time_format",
							prayer_hijri_date_adjustment "prayer_hijri_date_adjustment",
							prayer_fajr_iqamat "prayer_fajr_iqamat",
							prayer_dhuhr_iqamat "prayer_dhuhr_iqamat",
							prayer_asr_iqamat "prayer_asr_iqamat",
							prayer_maghrib_iqamat "prayer_maghrib_iqamat",
							prayer_isha_iqamat "prayer_isha_iqamat",
							prayer_column_imsak_checked "prayer_column_imsak_checked",
							prayer_column_sunset_checked "prayer_column_sunset_checked",
							prayer_column_midnight_checked "prayer_column_midnight_checked",
							prayer_column_fast_start_end "prayer_column_fast_start_end",
							date_created "date_created",
							date_modified "date_modified",
							user_account_app_user_account_id "user_account_app_user_account_id",
							user_account_app_app_id "user_account_app_app_id"
						FROM ${get_schema_name()}.app2_user_setting 
						WHERE id = :id `;
		}
		parameters = {
						id: id
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getUserSettingsByUserId: (app_id, id, callBack) => {
		let sql;
		let parameters;
		if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT	us.id,
							us.description,
							us.regional_language_locale,
							us.regional_timezone,
							us.regional_number_system,
							us.regional_layout_direction,
							us.regional_second_language_locale,
							us.regional_column_title,
							us.regional_arabic_script,
							us.regional_calendar_type,
							us.regional_calendar_hijri_type,
							us.gps_map_type,
							us.gps_country_id,
							us.gps_city_id,
							us.gps_popular_place_id,
							us.gps_lat_text,
							us.gps_long_text,
							us.design_theme_day_id,
							us.design_theme_month_id,
							us.design_theme_year_id,
							us.design_paper_size,
							us.design_row_highlight,
							us.design_column_weekday_checked,
							us.design_column_calendartype_checked,
							us.design_column_notes_checked,
							us.design_column_gps_checked,
							us.design_column_timezone_checked,
							CONVERT(us.image_header_image_img USING UTF8) image_header_image_img,
							CONVERT(us.image_footer_image_img USING UTF8) image_footer_image_img,
							us.text_header_1_text,
							us.text_header_2_text,
							us.text_header_3_text,
							us.text_header_align,
							us.text_footer_1_text,
							us.text_footer_2_text,
							us.text_footer_3_text,
							us.text_footer_align,
							us.prayer_method,
							us.prayer_asr_method,
							us.prayer_high_latitude_adjustment,
							us.prayer_time_format,
							us.prayer_hijri_date_adjustment,
							us.prayer_fajr_iqamat,
							us.prayer_dhuhr_iqamat,
							us.prayer_asr_iqamat,
							us.prayer_maghrib_iqamat,
							us.prayer_isha_iqamat,
							us.prayer_column_imsak_checked,
							us.prayer_column_sunset_checked,
							us.prayer_column_midnight_checked,
							us.prayer_column_fast_start_end,
							us.date_created,
							us.date_modified,
							us.user_account_app_user_account_id,
							us.user_account_app_app_id
					 FROM ${get_schema_name()}.app2_user_setting us
					WHERE us.user_account_app_user_account_id = :user_account_id
					  AND us.user_account_app_app_id = :app_id`;
		}
		else if (process.env.SERVICE_DB_USE==2){
			sql = `SELECT	id "id",
							description "description",
							regional_language_locale "regional_language_locale",
							regional_timezone "regional_timezone",
							regional_number_system "regional_number_system",
							regional_layout_direction "regional_layout_direction",
							regional_second_language_locale "regional_second_language_locale",
							regional_column_title "regional_column_title",
							regional_arabic_script "regional_arabic_script",
							regional_calendar_type "regional_calendar_type",
							regional_calendar_hijri_type "regional_calendar_hijri_type",
							gps_map_type "gps_map_type",
							gps_country_id "gps_country_id",
							gps_city_id "gps_city_id",
							gps_popular_place_id "gps_popular_place_id",
							gps_lat_text "gps_lat_text",
							gps_long_text "gps_long_text",
							design_theme_day_id "design_theme_day_id",
							design_theme_month_id "design_theme_month_id",
							design_theme_year_id "design_theme_year_id",
							design_paper_size "design_paper_size",
							design_row_highlight "design_row_highlight",
							design_column_weekday_checked "design_column_weekday_checked",
							design_column_calendartype_checked "design_column_calendartype_checked",
							design_column_notes_checked "design_column_notes_checked",
							design_column_gps_checked "design_column_gps_checked",
							design_column_timezone_checked "design_column_timezone_checked",
							image_header_image_img "image_header_image_img",
							image_footer_image_img "image_footer_image_img",
							text_header_1_text "text_header_1_text",
							text_header_2_text "text_header_2_text",
							text_header_3_text "text_header_3_text",
							text_header_align "text_header_align",
							text_footer_1_text "text_footer_1_text",
							text_footer_2_text "text_footer_2_text",
							text_footer_3_text "text_footer_3_text",
							text_footer_align "text_footer_align",
							prayer_method "prayer_method",
							prayer_asr_method "prayer_asr_method",
							prayer_high_latitude_adjustment "prayer_high_latitude_adjustment",
							prayer_time_format "prayer_time_format",
							prayer_hijri_date_adjustment "prayer_hijri_date_adjustment",
							prayer_fajr_iqamat "prayer_fajr_iqamat",
							prayer_dhuhr_iqamat "prayer_dhuhr_iqamat",
							prayer_asr_iqamat "prayer_asr_iqamat",
							prayer_maghrib_iqamat "prayer_maghrib_iqamat",
							prayer_isha_iqamat "prayer_isha_iqamat",
							prayer_column_imsak_checked "prayer_column_imsak_checked",
							prayer_column_sunset_checked "prayer_column_sunset_checked",
							prayer_column_midnight_checked "prayer_column_midnight_checked",
							prayer_column_fast_start_end "prayer_column_fast_start_end",
							date_created "date_created",
							date_modified "date_modified",
							user_account_app_user_account_id "user_account_app_user_account_id",
							user_account_app_app_id "app_id"
					 FROM ${get_schema_name()}.app2_user_setting
					WHERE user_account_app_user_account_id = :user_account_id 
					  AND user_account_app_app_id = :app_id`;
		}
		parameters = {
						user_account_id: id,
						app_id: app_id
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getProfileUserSetting: (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT	(SELECT COUNT(DISTINCT us.user_account_app_user_account_id)
							FROM ${get_schema_name()}.app2_user_setting_like u_like,
								${get_schema_name()}.app2_user_setting us
							WHERE u_like.user_account_id = u.id
							AND us.id = u_like.app2_user_setting_id
							AND us.user_account_app_app_id = :app_id)		"count_user_setting_likes",
						(SELECT COUNT(DISTINCT u_like.user_account_id)
							FROM ${get_schema_name()}.app2_user_setting_like u_like,
								${get_schema_name()}.app2_user_setting us
							WHERE us.user_account_app_user_account_id = u.id
							AND us.user_account_app_app_id = :app_id
							AND u_like.app2_user_setting_id = us.id)		"count_user_setting_liked"
				 FROM ${get_schema_name()}.user_account u
				WHERE u.id = :id`;
		parameters ={
						id: id,
						app_id: app_id
					}; 
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result[0]);
		});
    },
	getProfileUserSettings: (app_id, id, id_current_user, callBack) => {
		let sql;
		let parameters;
		sql = `SELECT us.id "id",
						us.description "description",
						us.user_account_app_user_account_id "user_account_app_user_account_id",
						(SELECT COUNT(u_like.id)
							FROM ${get_schema_name()}.app2_user_setting_like u_like
						WHERE u_like.app2_user_setting_id = us.id)					"count_likes",
						(SELECT COUNT(u_view.app2_user_setting_id)
							FROM ${get_schema_name()}.app2_user_setting_view u_view
						WHERE u_view.app2_user_setting_id = us.id)					"count_views",
						(SELECT COUNT(u_liked_current_user.id)
							FROM ${get_schema_name()}.app2_user_setting_like u_liked_current_user
						WHERE u_liked_current_user.user_account_id = :user_account_id_current
							AND u_liked_current_user.app2_user_setting_id = us.id) 	"liked",
						us.design_paper_size "design_paper_size"
				 FROM ${get_schema_name()}.app2_user_setting us
				WHERE us.user_account_app_user_account_id = :user_account_id
				  AND us.user_account_app_app_id = :app_id `;
		parameters = {
						user_account_id_current: id_current_user,
						user_account_id: id,
						app_id: app_id
						};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	getProfileUserSettingDetail: (app_id, id, detailchoice, callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT *
					FROM (SELECT 'LIKE_SETTING' detail,
									u.id,
									u.identity_provider_id,
									u.provider_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider_image USING UTF8) provider_image,
									u.provider_image_url,
									u.username,
									u.provider_first_name
							FROM   ${get_schema_name()}.user_account u
							WHERE  u.id IN (SELECT us.user_account_app_user_account_id
											  FROM ${get_schema_name()}.app2_user_setting_like u_like,
												   ${get_schema_name()}.app2_user_setting us
											 WHERE u_like.user_account_id = :user_account_id_like_setting
											   AND us.user_account_app_app_id = :app_id
											   AND us.id = u_like.app2_user_setting_id)
							AND    u.active = 1
							AND    5 = :detailchoice_like_setting
							UNION ALL
							SELECT 'LIKED_SETTING' detail,
									u.id,
									u.identity_provider_id,
									u.provider_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider_image USING UTF8) provider_image,
									u.provider_image_url,
									u.username,
									u.provider_first_name
							FROM   ${get_schema_name()}.user_account u
							WHERE  u.id IN (SELECT u_like.user_account_id
											  FROM ${get_schema_name()}.app2_user_setting us,
											 	   ${get_schema_name()}.app2_user_setting_like u_like
											 WHERE us.user_account_app_user_account_id = :user_account_id_liked_setting
											   AND us.user_account_app_app_id = :app_id
											   AND us.id = u_like.app2_user_setting_id)
							AND    u.active = 1
							AND    6 = :detailchoice_liked_setting) t
						ORDER BY 1, COALESCE(username, 
											 provider_first_name)`;
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT *
					FROM (SELECT 'LIKE_SETTING' "detail",
								  u.id "id",
								  u.identity_provider_id "identity_provider_id",
								  u.provider_id "provider_id",
								  u.avatar "avatar",
								  u.provider_image "provider_image",
								  u.provider_image_url "provider_image_url",
								  u.username "username",
								  u.provider_first_name "provider_first_name"
							FROM  ${get_schema_name()}.user_account u
							WHERE u.id IN (SELECT us.user_account_app_user_account_id
											 FROM ${get_schema_name()}.app2_user_setting_like u_like,
											      ${get_schema_name()}.app2_user_setting us
											WHERE u_like.user_account_id = :user_account_id_like_setting
											  AND us.user_account_app_app_id = :app_id
											  AND us.id = u_like.app2_user_setting_id)
							AND    u.active = 1
							AND    5 = :detailchoice_like_setting
							UNION ALL
							SELECT 'LIKED_SETTING' "detail",
									u.id "id",
									u.identity_provider_id "identity_provider_id",
									u.provider_id "provider_id",
									u.avatar "avatar",
									u.provider_image "provider_image",
									u.provider_image_url "provider_image_url",
									u.username "username",
									u.provider_first_name "provider_first_name"
							FROM    ${get_schema_name()}.user_account u
							WHERE  u.id IN (SELECT u_like.user_account_id
										  	  FROM ${get_schema_name()}.app2_user_setting us,
												   ${get_schema_name()}.app2_user_setting_like u_like
											 WHERE us.user_account_app_user_account_id = :user_account_id_liked_setting
											   AND us.user_account_app_app_id = :app_id
											   AND us.id = u_like.app2_user_setting_id)
							AND    u.active = 1
							AND    6 = :detailchoice_liked_setting) t
						ORDER BY 1, COALESCE("username", 
											"provider_first_name") `;
        }
		parameters = {
						user_account_id_like_setting: id,
						app_id: app_id,
						detailchoice_like_setting: detailchoice,
						user_account_id_liked_setting: id,
						detailchoice_liked_setting: detailchoice
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
	getProfileTop: (app_id, statchoice, callBack) => {
		let sql;
		let parameters;
        if (process.env.SERVICE_DB_USE == 1) {
			sql = `SELECT *
					FROM (SELECT 'LIKE_SETTING' top,
									u.id,
									u.identity_provider_id,
									u.provider_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider_image USING UTF8) provider_image,
									u.provider_image_url,
									u.username,
									u.provider_first_name,
									(SELECT COUNT(us.user_account_app_user_account_id)
									   FROM ${get_schema_name()}.app2_user_setting_like u_like,
											${get_schema_name()}.app2_user_setting us
									  WHERE us.user_account_app_user_account_id = u.id
										AND us.user_account_app_app_id = :app_id
										AND u_like.app2_user_setting_id = us.id) count
							FROM  ${get_schema_name()}.user_account u
						   WHERE  u.active = 1
							 AND  u.private <> 1
							 AND  4 = :statchoice_like_setting
							UNION ALL
							SELECT 'VISITED_SETTING' top,
									u.id,
									u.identity_provider_id,
									u.provider_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider_image USING UTF8) provider_image,
									u.provider_image_url,
									u.username,
									u.provider_first_name,
									(SELECT COUNT(us.user_account_app_user_account_id)
									   FROM ${get_schema_name()}.app2_user_setting_view u_view,
											${get_schema_name()}.app2_user_setting us
									  WHERE us.user_account_app_user_account_id = u.id
										AND us.user_account_app_app_id = :app_id
										AND u_view.app2_user_setting_id = us.id) count
							FROM  ${get_schema_name()}.user_account u
						   WHERE  u.active = 1
							 AND  u.private <> 1
							 AND  5 = :statchoice_visited_setting)  t
					ORDER BY 1,10 DESC, COALESCE(username, 
												 provider_first_name)
					LIMIT 10`;
        } else if (process.env.SERVICE_DB_USE == 2) {
			sql = `SELECT *
					FROM (	SELECT 'LIKE_SETTING' "top",
									u.id "id",
									u.identity_provider_id "identity_provider_id",
									u.provider_id "provider_id",
									u.avatar "avatar",
									u.provider_image "provider_image",
									u.provider_image_url "provider_image_url",
									u.username "username",
									u.provider_first_name "provider_first_name",
									(SELECT COUNT(us.user_account_app_user_account_id)
									   FROM ${get_schema_name()}.app2_user_setting_like u_like,
											${get_schema_name()}.app2_user_setting us
									  WHERE us.user_account_app_user_account_id = u.id
										AND us.user_account_app_app_id = :app_id
										AND u_like.app2_user_setting_id = us.id) "count"
							FROM  ${get_schema_name()}.user_account u
						   WHERE  u.active = 
							 AND  u.private <> 1
							 AND  4 = :statchoice_like_setting
							UNION ALL
							SELECT 'VISITED_SETTING' "top",
									u.id "id",
									u.identity_provider_id "identity_provider_id",
									u.provider_id "provider_id",
									u.avatar "avatar",
									u.provider_image "provider_image",
									u.provider_image_url "provider_image_url",
									u.username "username",
									u.provider_first_name "provider_first_name",
									(SELECT COUNT(us.user_account_app_user_account_id)
									   FROM ${get_schema_name()}.app2_user_setting_view u_view,
											${get_schema_name()}.app2_user_setting us
									  WHERE us.user_account_app_user_account_id = u.id
										AND us.user_account_app_app_id = :app_id
										AND u_view.app2_user_setting_id = us.id) "count"
							FROM  ${get_schema_name()}.user_account u
						   WHERE  u.active = 1
							 AND  u.private <> 1
							 AND  5 = :statchoice_visited_setting) t
					WHERE    ROWNUM <=10
					ORDER BY 1,10 DESC, COALESCE("username", 
												"provider_first_name") `;
        }
		parameters = {
						app_id: app_id,
						statchoice_like_setting: statchoice,
						statchoice_visited_setting: statchoice
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
    },
	updateUserSetting: (app_id, data, id, callBack) => {
		let sql;
		let parameters;
		sql = `UPDATE ${get_schema_name()}.app2_user_setting
				SET description = :description,
					regional_language_locale = :regional_language_locale,
					regional_timezone = :regional_timezone,
					regional_number_system = :regional_number_system,
					regional_layout_direction = :regional_layout_direction,
					regional_second_language_locale = :regional_second_language_locale,
					regional_column_title = :regional_column_title,
					regional_arabic_script = :regional_arabic_script,
					regional_calendar_type = :regional_calendar_type,
					regional_calendar_hijri_type = :regional_calendar_hijri_type,
					gps_map_type = :gps_map_type,
					gps_country_id = :gps_country_id,
					gps_city_id = :gps_city_id,
					gps_popular_place_id = :gps_popular_place_id,
					gps_lat_text = :gps_lat_text,
					gps_long_text = :gps_long_text,
					design_theme_day_id = :design_theme_day_id,
					design_theme_month_id = :design_theme_month_id,
					design_theme_year_id = :design_theme_year_id,
					design_paper_size = :design_paper_size,
					design_row_highlight = :design_row_highlight,
					design_column_weekday_checked = :design_column_weekday_checked,
					design_column_calendartype_checked = :design_column_calendartype_checked,
					design_column_notes_checked = :design_column_notes_checked,
					design_column_gps_checked = :design_column_gps_checked,
					design_column_timezone_checked = :design_column_timezone_checked,
					image_header_image_img = :image_header_image_img,
					image_footer_image_img = :image_footer_image_img,
					text_header_1_text = :text_header_1_text,
					text_header_2_text = :text_header_2_text,
					text_header_3_text = :text_header_3_text,
					text_header_align = :text_header_align,
					text_footer_1_text = :text_footer_1_text,
					text_footer_2_text = :text_footer_2_text,
					text_footer_3_text = :text_footer_3_text,
					text_footer_align = :text_footer_align,
					prayer_method = :prayer_method,
					prayer_asr_method = :prayer_asr_method,
					prayer_high_latitude_adjustment = :prayer_high_latitude_adjustment,
					prayer_time_format = :prayer_time_format,
					prayer_hijri_date_adjustment = :prayer_hijri_date_adjustment,
					prayer_fajr_iqamat = :prayer_fajr_iqamat,
					prayer_dhuhr_iqamat = :prayer_dhuhr_iqamat,
					prayer_asr_iqamat = :prayer_asr_iqamat,
					prayer_maghrib_iqamat = :prayer_maghrib_iqamat,
					prayer_isha_iqamat = :prayer_isha_iqamat,
					prayer_column_imsak_checked = :prayer_column_imsak_checked,
					prayer_column_sunset_checked = :prayer_column_sunset_checked,
					prayer_column_midnight_checked = :prayer_column_midnight_checked,
					prayer_column_fast_start_end = :prayer_column_fast_start_end,
					user_account_app_user_account_id = :user_account_id,
					user_account_app_app_id = :app_id,
					date_modified = CURRENT_TIMESTAMP
				WHERE id = :id `;
		if (process.env.SERVICE_DB_USE==2){
			data.image_header_image_img = Buffer.from(data.image_header_image_img, 'utf8');
			data.image_footer_image_img = Buffer.from(data.image_footer_image_img, 'utf8');
		}
		parameters = {
						description: data.description,
						regional_language_locale: data.regional_language_locale,
						regional_timezone: data.regional_timezone,
						regional_number_system: data.regional_number_system,
						regional_layout_direction: data.regional_layout_direction,
						regional_second_language_locale: data.regional_second_language_locale,
						regional_column_title: data.regional_column_title,
						regional_arabic_script: data.regional_arabic_script,
						regional_calendar_type: data.regional_calendar_type,
						regional_calendar_hijri_type: data.regional_calendar_hijri_type,
						gps_map_type: data.gps_map_type,
						gps_country_id: data.gps_country_id,
						gps_city_id: data.gps_city_id,
						gps_popular_place_id: data.gps_popular_place_id,
						gps_lat_text: data.gps_lat_text,
						gps_long_text: data.gps_long_text,
						design_theme_day_id: data.design_theme_day_id,
						design_theme_month_id: data.design_theme_month_id,
						design_theme_year_id: data.design_theme_year_id,
						design_paper_size: data.design_paper_size,
						design_row_highlight: data.design_row_highlight,
						design_column_weekday_checked: data.design_column_weekday_checked,
						design_column_calendartype_checked: data.design_column_calendartype_checked,
						design_column_notes_checked: data.design_column_notes_checked,
						design_column_gps_checked: data.design_column_gps_checked,
						design_column_timezone_checked: data.design_column_timezone_checked,
						image_header_image_img: data.image_header_image_img,
						image_footer_image_img: data.image_footer_image_img,
						text_header_1_text: data.text_header_1_text,
						text_header_2_text: data.text_header_2_text,
						text_header_3_text: data.text_header_3_text,
						text_header_align: data.text_header_align,
						text_footer_1_text: data.text_footer_1_text,
						text_footer_2_text: data.text_footer_2_text,
						text_footer_3_text: data.text_footer_3_text,
						text_footer_align: data.text_footer_align,
						prayer_method: data.prayer_method,
						prayer_asr_method: data.prayer_asr_method,
						prayer_high_latitude_adjustment: data.prayer_high_latitude_adjustment,
						prayer_time_format: data.prayer_time_format,
						prayer_hijri_date_adjustment: data.prayer_hijri_date_adjustment,
						prayer_fajr_iqamat: data.prayer_fajr_iqamat,
						prayer_dhuhr_iqamat: data.prayer_dhuhr_iqamat,
						prayer_asr_iqamat: data.prayer_asr_iqamat,
						prayer_maghrib_iqamat: data.prayer_maghrib_iqamat,
						prayer_isha_iqamat: data.prayer_isha_iqamat,
						prayer_column_imsak_checked: data.prayer_column_imsak_checked,
						prayer_column_sunset_checked: data.prayer_column_sunset_checked,
						prayer_column_midnight_checked: data.prayer_column_midnight_checked,
						prayer_column_fast_start_end: data.prayer_column_fast_start_end,
						user_account_id: data.user_account_id,
						app_id: app_id,
						id: id
					};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	},
	deleteUserSetting: (app_id, id, callBack) => {
		let sql;
		let parameters;
		sql = `DELETE FROM ${get_schema_name()}.app2_user_setting
				WHERE id = :id `;
		parameters = {
						id: id
						};
		execute_db_sql(app_id, sql, parameters, null, 
			           __appfilename, __appfunction, __appline, (err, result)=>{
			if (err)
				return callBack(err, null);
			else
				return callBack(null, result);
		});
	}
};