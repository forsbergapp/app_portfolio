const {oracledb, get_pool} = require ("../../config/database");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
	createUserSetting: (app_id, initial, data, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
				`INSERT INTO ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting(
					description,
					regional_language_locale,
					regional_current_timezone_select_id,
					regional_timezone_select_id,
					regional_number_system_select_id,
					regional_layout_direction_select_id,
					regional_second_language_locale,
					regional_column_title_select_id,
					regional_arabic_script_select_id,
					regional_calendar_type_select_id,
					regional_calendar_hijri_type_select_id,
					gps_map_type_select_id,
					gps_country_id,
					gps_city_id,
					gps_popular_place_id,
					gps_lat_text,
					gps_long_text,
					design_theme_day_id,
					design_theme_month_id,
					design_theme_year_id,
					design_paper_size_select_id,
					design_row_highlight_select_id,
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
					prayer_method_select_id,
					prayer_asr_method_select_id,
					prayer_high_latitude_adjustment_select_id,
					prayer_time_format_select_id,
					prayer_hijri_date_adjustment_select_id,
					prayer_fajr_iqamat_select_id,
					prayer_dhuhr_iqamat_select_id,
					prayer_asr_iqamat_select_id,
					prayer_maghrib_iqamat_select_id,
					prayer_isha_iqamat_select_id,
					prayer_column_imsak_checked,
					prayer_column_sunset_checked,
					prayer_column_midnight_checked,
					prayer_column_fast_start_end_select_id,
					date_created,
					date_modified,
					user_account_id,
					app_id)
				SELECT ?,?,?,?,?,?,?,?,?,?,
					?,?,?,?,?,?,?,?,?,?,
					?,?,?,?,?,?,?,?,?,?,
					?,?,?,?,?,?,?,?,?,?,
					?,?,?,?,?,?,?,?,?,?,
					?,SYSDATE(),SYSDATE(),?,?
				FROM DUAL
				WHERE NOT EXISTS (SELECT null
						            FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting aus
								   WHERE ? = 1
								     AND aus.user_account_id = ?
									 AND aus.app_id = ?)`,
				[
				data.description,
				data.regional_language_locale,
				data.regional_current_timezone_select_id,
				data.regional_timezone_select_id,
				data.regional_number_system_select_id,
				data.regional_layout_direction_select_id,
				data.regional_second_language_locale,
				data.regional_column_title_select_id,
				data.regional_arabic_script_select_id,
				data.regional_calendar_type_select_id,
				data.regional_calendar_hijri_type_select_id,
				data.gps_map_type_select_id,
				data.gps_country_id,
				data.gps_city_id,
				data.gps_popular_place_id,
				data.gps_lat_text,
				data.gps_long_text,
				data.design_theme_day_id,
				data.design_theme_month_id,
				data.design_theme_year_id,
				data.design_paper_size_select_id,
				data.design_row_highlight_select_id,
				data.design_column_weekday_checked,
				data.design_column_calendartype_checked,
				data.design_column_notes_checked,
				data.design_column_gps_checked,
				data.design_column_timezone_checked,
				data.image_header_image_img,
				data.image_footer_image_img,
				data.text_header_1_text,
				data.text_header_2_text,
				data.text_header_3_text,
				data.text_header_align,
				data.text_footer_1_text,
				data.text_footer_2_text,
				data.text_footer_3_text,
				data.text_footer_align,
				data.prayer_method_select_id,
				data.prayer_asr_method_select_id,
				data.prayer_high_latitude_adjustment_select_id,
				data.prayer_time_format_select_id,
				data.prayer_hijri_date_adjustment_select_id,
				data.prayer_fajr_iqamat_select_id,
				data.prayer_dhuhr_iqamat_select_id,
				data.prayer_asr_iqamat_select_id,
				data.prayer_maghrib_iqamat_select_id,
				data.prayer_isha_iqamat_select_id,
				data.prayer_column_imsak_checked,
				data.prayer_column_sunset_checked,
				data.prayer_column_midnight_checked,
				data.prayer_column_fast_start_end_select_id,
				data.user_account_id,
				app_id,
				initial,
				data.user_account_id,
				app_id
				],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}	
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
					pool2 = await oracledb.getConnection(get_pool(app_id));
					const result = await pool2.execute(
						`INSERT INTO ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting(
							description,
							regional_language_locale,
							regional_current_timezone_select_id,
							regional_timezone_select_id,
							regional_number_system_select_id,
							regional_layout_direction_select_id,
							regional_second_language_locale,
							regional_column_title_select_id,
							regional_arabic_script_select_id,
							regional_calendar_type_select_id,
							regional_calendar_hijri_type_select_id,
							gps_map_type_select_id,
							gps_country_id,
							gps_city_id,
							gps_popular_place_id,
							gps_lat_text,
							gps_long_text,
							design_theme_day_id,
							design_theme_month_id,
							design_theme_year_id,
							design_paper_size_select_id,
							design_row_highlight_select_id,
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
							prayer_method_select_id,
							prayer_asr_method_select_id,
							prayer_high_latitude_adjustment_select_id,
							prayer_time_format_select_id,
							prayer_hijri_date_adjustment_select_id,
							prayer_fajr_iqamat_select_id,
							prayer_dhuhr_iqamat_select_id,
							prayer_asr_iqamat_select_id,
							prayer_maghrib_iqamat_select_id,
							prayer_isha_iqamat_select_id,
							prayer_column_imsak_checked,
							prayer_column_sunset_checked,
							prayer_column_midnight_checked,
							prayer_column_fast_start_end_select_id,
							date_created,
							date_modified,
							user_account_id,
							app_id)
						SELECT	:description,
								:regional_language_locale,
								:regional_current_timezone_select_id,
								:regional_timezone_select_id,
								:regional_number_system_select_id,
								:regional_layout_direction_select_id,
								:regional_second_language_locale,
								:regional_column_title_select_id,
								:regional_arabic_script_select_id,
								:regional_calendar_type_select_id,
								:regional_calendar_hijri_type_select_id,
								:gps_map_type_select_id,
								:gps_country_id,
								:gps_city_id,
								:gps_popular_place_id,
								:gps_lat_text,
								:gps_long_text,
								:design_theme_day_id,
								:design_theme_month_id,
								:design_theme_year_id,
								:design_paper_size_select_id,
								:design_row_highlight_select_id,
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
								:prayer_method_select_id,
								:prayer_asr_method_select_id,
								:prayer_high_latitude_adjustment_select_id,
								:prayer_time_format_select_id,
								:prayer_hijri_date_adjustment_select_id,
								:prayer_fajr_iqamat_select_id,
								:prayer_dhuhr_iqamat_select_id,
								:prayer_asr_iqamat_select_id,
								:prayer_maghrib_iqamat_select_id,
								:prayer_isha_iqamat_select_id,
								:prayer_column_imsak_checked,
								:prayer_column_sunset_checked,
								:prayer_column_midnight_checked,
								:prayer_column_fast_start_end_select_id,
								SYSDATE,
								SYSDATE,
								:user_account_id,
								:app_id
						FROM DUAL
						WHERE NOT EXISTS (SELECT null
										    FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting aus
										   WHERE :initial = 1
										 	 AND aus.user_account_id = :user_account_id
											 AND aus.app_id = :app_id)`,
					{
						description: data.description,
						regional_language_locale: data.regional_language_locale,
						regional_current_timezone_select_id: data.regional_current_timezone_select_id,
						regional_timezone_select_id: data.regional_timezone_select_id,
						regional_number_system_select_id: data.regional_number_system_select_id,
						regional_layout_direction_select_id: data.regional_layout_direction_select_id,
						regional_second_language_locale: data.regional_second_language_locale,
						regional_column_title_select_id: data.regional_column_title_select_id,
						regional_arabic_script_select_id: data.regional_arabic_script_select_id,
						regional_calendar_type_select_id: data.regional_calendar_type_select_id,
						regional_calendar_hijri_type_select_id: data.regional_calendar_hijri_type_select_id,
						gps_map_type_select_id: data.gps_map_type_select_id,
						gps_country_id: data.gps_country_id,
						gps_city_id: data.gps_city_id,
						gps_popular_place_id: data.gps_popular_place_id,
						gps_lat_text: data.gps_lat_text,
						gps_long_text: data.gps_long_text,
						design_theme_day_id: data.design_theme_day_id,
						design_theme_month_id: data.design_theme_month_id,
						design_theme_year_id: data.design_theme_year_id,
						design_paper_size_select_id: data.design_paper_size_select_id,
						design_row_highlight_select_id: data.design_row_highlight_select_id,
						design_column_weekday_checked: data.design_column_weekday_checked,
						design_column_calendartype_checked: data.design_column_calendartype_checked,
						design_column_notes_checked: data.design_column_notes_checked,
						design_column_gps_checked: data.design_column_gps_checked,
						design_column_timezone_checked: data.design_column_timezone_checked,
						image_header_image_img: Buffer.from(data.image_header_image_img, 'utf8'),
						image_footer_image_img: Buffer.from(data.image_footer_image_img, 'utf8'),
						text_header_1_text: data.text_header_1_text,
						text_header_2_text: data.text_header_2_text,
						text_header_3_text: data.text_header_3_text,
						text_header_align: data.text_header_align,
						text_footer_1_text: data.text_footer_1_text,
						text_footer_2_text: data.text_footer_2_text,
						text_footer_3_text: data.text_footer_3_text,
						text_footer_align: data.text_footer_align,
						prayer_method_select_id: data.prayer_method_select_id,
						prayer_asr_method_select_id: data.prayer_asr_method_select_id,
						prayer_high_latitude_adjustment_select_id: data.prayer_high_latitude_adjustment_select_id,
						prayer_time_format_select_id: data.prayer_time_format_select_id,
						prayer_hijri_date_adjustment_select_id: data.prayer_hijri_date_adjustment_select_id,
						prayer_fajr_iqamat_select_id: data.prayer_fajr_iqamat_select_id,
						prayer_dhuhr_iqamat_select_id: data.prayer_dhuhr_iqamat_select_id,
						prayer_asr_iqamat_select_id: data.prayer_asr_iqamat_select_id,
						prayer_maghrib_iqamat_select_id: data.prayer_maghrib_iqamat_select_id,
						prayer_isha_iqamat_select_id: data.prayer_isha_iqamat_select_id,
						prayer_column_imsak_checked: data.prayer_column_imsak_checked,
						prayer_column_sunset_checked: data.prayer_column_sunset_checked,
						prayer_column_midnight_checked: data.prayer_column_midnight_checked,
						prayer_column_fast_start_end_select_id: data.prayer_column_fast_start_end_select_id,
						user_account_id: data.user_account_id,
						app_id: app_id,
						initial: initial
					},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							//Fetch id from rowid returned from Oracle
							//sample output:
							//{"lastRowid":"AAAWwdAAAAAAAdHAAC","rowsAffected":1}
							async function execute_sql2(err_id, result_id){
								//remove "" before and after
								var lastRowid = JSON.stringify(result.lastRowid).replace(/"/g,'');
								let pool3;
								try{
								pool3 = await oracledb.getConnection(get_pool(app_id));
								const result_rowid = await pool3.execute(
									`SELECT id "insertId"
										FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting
										WHERE rowid = :lastRowid`,
									{
										lastRowid: lastRowid
									},
									(err_id2,result_id2) => {
										if (err_id2) {
											createLogAppSE(app_id, __appfilename, __appfunction, __appline, err_id2);
											return callBack(err_id2);
										}
										else{
											return callBack(null, result_id2.rows[0]);
										}
									});
								}
								catch(err){
									createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
									return callBack(err.message);				
								}
								finally{
									if (pool3) {
										try {
											await pool3.close(); 
										} catch (err) {
											createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
										}
									}
								}
							}
							execute_sql2();
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	getUserSetting:  (app_id, id, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
				`SELECT
					id,
					description,
					regional_language_locale,
					regional_current_timezone_select_id,
					regional_timezone_select_id,
					regional_number_system_select_id,
					regional_layout_direction_select_id,
					regional_second_language_locale,
					regional_column_title_select_id,
					regional_arabic_script_select_id,
					regional_calendar_type_select_id,
					regional_calendar_hijri_type_select_id,
					gps_map_type_select_id,
					gps_country_id,
					gps_city_id,
					gps_popular_place_id,
					gps_lat_text,
					gps_long_text,
					design_theme_day_id,
					design_theme_month_id,
					design_theme_year_id,
					design_paper_size_select_id,
					design_row_highlight_select_id,
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
					prayer_method_select_id,
					prayer_asr_method_select_id,
					prayer_high_latitude_adjustment_select_id,
					prayer_time_format_select_id,
					prayer_hijri_date_adjustment_select_id,
					prayer_fajr_iqamat_select_id,
					prayer_dhuhr_iqamat_select_id,
					prayer_asr_iqamat_select_id,
					prayer_maghrib_iqamat_select_id,
					prayer_isha_iqamat_select_id,
					prayer_column_imsak_checked,
					prayer_column_sunset_checked,
					prayer_column_midnight_checked,
					prayer_column_fast_start_end_select_id,
					date_created,
					date_modified,
					user_account_id,
					app_id
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting 
				WHERE id = ? `,
				[id],
				(error, results, fields) => {
					if (error){
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`SELECT
						id "id",
						description "description",
						regional_language_locale "regional_language_locale",
						regional_current_timezone_select_id "regional_current_timezone_select_id",
						regional_timezone_select_id "regional_timezone_select_id",
						regional_number_system_select_id "regional_number_system_select_id",
						regional_layout_direction_select_id "regional_layout_direction_select_id",
						regional_second_language_locale "regional_second_language_locale",
						regional_column_title_select_id "regional_column_title_select_id",
						regional_arabic_script_select_id "regional_arabic_script_select_id",
						regional_calendar_type_select_id "regional_calendar_type_select_id",
						regional_calendar_hijri_type_select_id "regional_calendar_hijri_type_select_id",
						gps_map_type_select_id "gps_map_type_select_id",
						gps_country_id "gps_country_id",
						gps_city_id "gps_city_id",
						gps_popular_place_id "gps_popular_place_id",
						gps_lat_text "gps_lat_text",
						gps_long_text "gps_long_text",
						design_theme_day_id "design_theme_day_id",
						design_theme_month_id "design_theme_month_id",
						design_theme_year_id "design_theme_year_id",
						design_paper_size_select_id "design_paper_size_select_id",
						design_row_highlight_select_id "design_row_highlight_select_id",
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
						prayer_method_select_id "prayer_method_select_id",
						prayer_asr_method_select_id "prayer_asr_method_select_id",
						prayer_high_latitude_adjustment_select_id "prayer_high_latitude_adjustment_select_id",
						prayer_time_format_select_id "prayer_time_format_select_id",
						prayer_hijri_date_adjustment_select_id "prayer_hijri_date_adjustment_select_id",
						prayer_fajr_iqamat_select_id "prayer_fajr_iqamat_select_id",
						prayer_dhuhr_iqamat_select_id "prayer_dhuhr_iqamat_select_id",
						prayer_asr_iqamat_select_id "prayer_asr_iqamat_select_id",
						prayer_maghrib_iqamat_select_id "prayer_maghrib_iqamat_select_id",
						prayer_isha_iqamat_select_id "prayer_isha_iqamat_select_id",
						prayer_column_imsak_checked "prayer_column_imsak_checked",
						prayer_column_sunset_checked "prayer_column_sunset_checked",
						prayer_column_midnight_checked "prayer_column_midnight_checked",
						prayer_column_fast_start_end_select_id "prayer_column_fast_start_end_select_id",
						date_created "date_created",
						date_modified "date_modified",
						user_account_id "user_account_id",
						app_id "app_id"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting 
					WHERE id = :id `,
					{
						id: id
					},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	getUserSettingsByUserId: (app_id, id, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
				`SELECT
					us.id,
					us.description,
					us.regional_language_locale,
					us.regional_current_timezone_select_id,
					us.regional_timezone_select_id,
					us.regional_number_system_select_id,
					us.regional_layout_direction_select_id,
					us.regional_second_language_locale,
					us.regional_column_title_select_id,
					us.regional_arabic_script_select_id,
					us.regional_calendar_type_select_id,
					us.regional_calendar_hijri_type_select_id,
					us.gps_map_type_select_id,
					us.gps_country_id,
					us.gps_city_id,
					us.gps_popular_place_id,
					us.gps_lat_text,
					us.gps_long_text,
					us.design_theme_day_id,
					us.design_theme_month_id,
					us.design_theme_year_id,
					us.design_paper_size_select_id,
					us.design_row_highlight_select_id,
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
					us.prayer_method_select_id,
					us.prayer_asr_method_select_id,
					us.prayer_high_latitude_adjustment_select_id,
					us.prayer_time_format_select_id,
					us.prayer_hijri_date_adjustment_select_id,
					us.prayer_fajr_iqamat_select_id,
					us.prayer_dhuhr_iqamat_select_id,
					us.prayer_asr_iqamat_select_id,
					us.prayer_maghrib_iqamat_select_id,
					us.prayer_isha_iqamat_select_id,
					us.prayer_column_imsak_checked,
					us.prayer_column_sunset_checked,
					us.prayer_column_midnight_checked,
					us.prayer_column_fast_start_end_select_id,
					us.date_created,
					us.date_modified,
					us.user_account_id,
					us.app_id
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting us
				WHERE us.user_account_id = ?
				  AND us.app_id = ?`,
				[id,
				 app_id],
				(error, results, fields) => {
					if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}
		else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`SELECT
						id "id",
						description "description",
						regional_language_locale "regional_language_locale",
						regional_current_timezone_select_id "regional_current_timezone_select_id",
						regional_timezone_select_id "regional_timezone_select_id",
						regional_number_system_select_id "regional_number_system_select_id",
						regional_layout_direction_select_id "regional_layout_direction_select_id",
						regional_second_language_locale "regional_second_language_locale",
						regional_column_title_select_id "regional_column_title_select_id",
						regional_arabic_script_select_id "regional_arabic_script_select_id",
						regional_calendar_type_select_id "regional_calendar_type_select_id",
						regional_calendar_hijri_type_select_id "regional_calendar_hijri_type_select_id",
						gps_map_type_select_id "gps_map_type_select_id",
						gps_country_id "gps_country_id",
						gps_city_id "gps_city_id",
						gps_popular_place_id "gps_popular_place_id",
						gps_lat_text "gps_lat_text",
						gps_long_text "gps_long_text",
						design_theme_day_id "design_theme_day_id",
						design_theme_month_id "design_theme_month_id",
						design_theme_year_id "design_theme_year_id",
						design_paper_size_select_id "design_paper_size_select_id",
						design_row_highlight_select_id "design_row_highlight_select_id",
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
						prayer_method_select_id "prayer_method_select_id",
						prayer_asr_method_select_id "prayer_asr_method_select_id",
						prayer_high_latitude_adjustment_select_id "prayer_high_latitude_adjustment_select_id",
						prayer_time_format_select_id "prayer_time_format_select_id",
						prayer_hijri_date_adjustment_select_id "prayer_hijri_date_adjustment_select_id",
						prayer_fajr_iqamat_select_id "prayer_fajr_iqamat_select_id",
						prayer_dhuhr_iqamat_select_id "prayer_dhuhr_iqamat_select_id",
						prayer_asr_iqamat_select_id "prayer_asr_iqamat_select_id",
						prayer_maghrib_iqamat_select_id "prayer_maghrib_iqamat_select_id",
						prayer_isha_iqamat_select_id "prayer_isha_iqamat_select_id",
						prayer_column_imsak_checked "prayer_column_imsak_checked",
						prayer_column_sunset_checked "prayer_column_sunset_checked",
						prayer_column_midnight_checked "prayer_column_midnight_checked",
						prayer_column_fast_start_end_select_id "prayer_column_fast_start_end_select_id",
						date_created "date_created",
						date_modified "date_modified",
						user_account_id "user_account_id",
						app_id "app_id"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting
					WHERE user_account_id = :user_account_id 
					  AND app_id = :app_id`,
					{
						user_account_id: id
					},
				 	(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	getProfileUserSetting: (app_id, id, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT
					(SELECT COUNT(DISTINCT us.user_account_id)
					   FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like u_like,
					   		${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting us
					  WHERE u_like.user_account_id = u.id
					    AND us.id = u_like.app1_user_setting_id
						AND us.app_id = ?)													count_user_setting_likes,
					(SELECT COUNT(DISTINCT u_like.user_account_id)
					   FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like u_like,
					   		${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting us
					  WHERE us.user_account_id = u.id
					    AND us.app_id = ?
						AND u_like.app1_user_setting_id = us.id)							count_user_setting_liked
				FROM ${process.env.SERVICE_DB_DB1_NAME}.user_account u
				WHERE u.id = ? `, 
				[app_id,
			     app_id,
				 id],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results[0]);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT
							(SELECT COUNT(DISTINCT us.user_account_id)
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like u_like,
									${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting us
							  WHERE u_like.user_account_id = u.id
								AND us.id = u_like.app1_user_setting_id
								AND us.app_id = :app_id)													"count_user_setting_likes",
							(SELECT COUNT(DISTINCT u_like.user_account_id)
							   FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like u_like,
									${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting us
							  WHERE us.user_account_id = u.id
							    AND us.app_id = :app_id
								AND u_like.app1_user_setting_id = us.id)							"count_user_setting_liked"
						FROM ${process.env.SERVICE_DB_DB2_NAME}.user_account u
						WHERE u.id = :id`, 
						{
                            id: id,
							app_id: app_id
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows[0]);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
	getProfileUserSettings: (app_id, id, id_current_user, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
				`SELECT
					us.id,
					us.description,
					us.user_account_id,
					(SELECT COUNT(u_like.id)
					   FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like u_like
					  WHERE u_like.app1_user_setting_id = us.id)				count_likes,
					(SELECT COUNT(u_view.app1_user_setting_id)
					   FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_view u_view
					  WHERE u_view.app1_user_setting_id = us.id)				count_views,
					(SELECT COUNT(u_liked_current_user.id)
					   FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like u_liked_current_user
					  WHERE u_liked_current_user.user_account_id = ?
						AND u_liked_current_user.app1_user_setting_id = us.id) 	liked,
					us.design_paper_size_select_id
				FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting us
				WHERE us.user_account_id = ? 
				  AND us.app_id = ?`,
				[id_current_user,
				 id,
			     app_id],
				(error, results, fields) => {
					if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`SELECT
						us.id "id",
						us.description "description",
						us.user_account_id "user_account_id",
						(SELECT COUNT(u_like.id)
						   FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like u_like
						  WHERE u_like.app1_user_setting_id = us.id)				"count_likes",
						(SELECT COUNT(u_view.app1_user_setting_id)
						   FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_view u_view
						  WHERE u_view.app1_user_setting_id = us.id)				"count_views",
						(SELECT COUNT(u_liked_current_user.id)
						   FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like u_liked_current_user
						  WHERE u_liked_current_user.user_account_id = :user_account_id_current
						    AND u_liked_current_user.app1_user_setting_id = us.id) 	"liked",
						us.design_paper_size_select_id "design_paper_size_select_id"
					FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting us
					WHERE us.user_account_id = :user_account_id
					  AND us.app_id = :app_id `,
					{
						user_account_id_current: id_current_user,
						user_account_id: id,
						app_id: app_id
					},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	getProfileUserSettingDetail: (app_id, id, detailchoice, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT *
					FROM (SELECT 'LIKE_SETTING' detail,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name
							FROM   ${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u.id IN (SELECT us.user_account_id
											  FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like u_like,
											 	   ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting us
											 WHERE u_like.user_account_id = ?
											   AND us.app_id = ?
											   AND us.id = u_like.app1_user_setting_id)
							AND    u.active = 1
							AND    5 = ?
							UNION ALL
							SELECT 'LIKED_SETTING' detail,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name
							FROM   ${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u.id IN (SELECT u_like.user_account_id
											  FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting us,
												   ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like u_like
											 WHERE us.user_account_id = ?
											   AND us.app_id = ?
											   AND us.id = u_like.app1_user_setting_id)
							AND    u.active = 1
							AND    6 = ?) t
						ORDER BY 1, COALESCE(username, 
											provider1_first_name,
											provider2_first_name)`, 
				[id,
				 app_id,
				 detailchoice,
			 	 id,
				 app_id,
				 detailchoice
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT *
						FROM (SELECT 'LIKE_SETTING' "detail",
										u.id "id",
										u.provider1_id "provider1_id",
										u.provider2_id "provider2_id",
										u.avatar "avatar",
										u.provider1_image "provider1_image",
										u.provider1_image_url "provider1_image_url",
										u.provider2_image "provider2_image",
										u.provider2_image_url "provider2_image_url",
										u.username "username",
										u.provider1_first_name "provider1_first_name",
										u.provider2_first_name "provider2_first_name"
								FROM    ${process.env.SERVICE_DB_DB2_NAME}.user_account u
								WHERE  u.id IN (SELECT us.user_account_id
												  FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like u_like,
													   ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting us
												 WHERE u_like.user_account_id = :user_account_id_like_setting
												   AND us.app_id = :app_id
												   AND us.id = u_like.app1_user_setting_id)
								AND    u.active = 1
								AND    5 = :detailchoice_like_setting
								UNION ALL
								SELECT 'LIKED_SETTING' "detail",
										u.id "id",
										u.provider1_id "provider1_id",
										u.provider2_id "provider2_id",
										u.avatar "avatar",
										u.provider1_image "provider1_image",
										u.provider1_image_url "provider1_image_url",
										u.provider2_image "provider2_image",
										u.provider2_image_url "provider2_image_url",
										u.username "username",
										u.provider1_first_name "provider1_first_name",
										u.provider2_first_name "provider2_first_name"
								FROM    ${process.env.SERVICE_DB_DB2_NAME}.user_account u
								WHERE  u.id IN (SELECT u_like.user_account_id
												  FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting us,
													   ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like u_like
												 WHERE us.user_account_id = :user_account_id_liked_setting
												   AND us.app_id = :app_id
												   AND us.id = u_like.app1_user_setting_id)
								AND    u.active = 1
								AND    6 = :detailchoice_liked_setting) t
							ORDER BY 1, COALESCE("username", 
												"provider1_first_name",
												"provider2_first_name") `, 
						{
                            user_account_id_like_setting: id,
							app_id: app_id,
                            detailchoice_like_setting: detailchoice,
                            user_account_id_liked_setting: id,
                            detailchoice_liked_setting: detailchoice
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }
    },
	getProfileTop: (app_id, statchoice, callBack) => {
        if (process.env.SERVICE_DB_USE == 1) {
            get_pool(app_id).query(
                `SELECT *
					FROM (SELECT 'LIKE_SETTING' top,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name,
									(SELECT COUNT(us.user_account_id)
									   FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_like u_like,
									   		${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting us
									  WHERE us.user_account_id = u.id
									    AND us.app_id = ?
										AND u_like.app1_user_setting_id = us.id) count
							FROM   ${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u.active = 1
							AND    4 = ?
							UNION ALL
							SELECT 'VISITED_SETTING' top,
									u.id,
									u.provider1_id,
									u.provider2_id,
									CONVERT(u.avatar USING UTF8) avatar,
									CONVERT(u.provider1_image USING UTF8) provider1_image,
									u.provider1_image_url,
									CONVERT(u.provider2_image USING UTF8) provider2_image,
									u.provider2_image_url,
									u.username,
									u.provider1_first_name,
									u.provider2_first_name,
									(SELECT COUNT(us.user_account_id)
									   FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting_view u_view,
									        ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting us
									  WHERE us.user_account_id = u.id
									    AND us.app_id = ?
										AND u_view.app1_user_setting_id = us.id) count
							FROM   ${process.env.SERVICE_DB_DB1_NAME}.user_account u
							WHERE  u.active = 1
							AND    5 = ?)  t
					ORDER BY 1,13 DESC, COALESCE(username, 
												provider1_first_name,
												provider2_first_name)
					LIMIT 10`, 
				[app_id,
				 statchoice,
				 app_id,
				 statchoice
                ],
                (error, results, fields) => {
                    if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
                        return callBack(error);
                    }
                    return callBack(null, results);
                }
            )
        } else if (process.env.SERVICE_DB_USE == 2) {
            async function execute_sql(err, result) {
				let pool2;
                try {
                    pool2 = await oracledb.getConnection(get_pool(app_id));
                    const result = await pool2.execute(
                        `SELECT *
							FROM (	SELECT 'LIKE_SETTING' "top",
											u.id "id",
											u.provider1_id "provider1_id",
											u.provider2_id "provider2_id",
											u.avatar "avatar",
											u.provider1_image "provider1_image",
											u.provider1_image_url "provider1_image_url",
											u.provider2_image "provider2_image",
											u.provider2_image_url "provider2_image_url",
											u.username "username",
											u.provider1_first_name "provider1_first_name",
											u.provider2_first_name "provider2_first_name",
											(SELECT COUNT(us.user_account_id)
											   FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_like u_like,
											   		${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting us
											  WHERE us.user_account_id = u.id
											    AND us.app_id = :app_id
												AND u_like.app1_user_setting_id = us.id) "count"
									FROM   ${process.env.SERVICE_DB_DB2_NAME}.user_account u
									WHERE  u.active = 1
									AND    4 = :statchoice_like_setting
									UNION ALL
									SELECT 'VISITED_SETTING' "top",
											u.id "id",
											u.provider1_id "provider1_id",
											u.provider2_id "provider2_id",
											u.avatar "avatar",
											u.provider1_image "provider1_image",
											u.provider1_image_url "provider1_image_url",
											u.provider2_image "provider2_image",
											u.provider2_image_url "provider2_image_url",
											u.username "username",
											u.provider1_first_name "provider1_first_name",
											u.provider2_first_name "provider2_first_name",
											(SELECT COUNT(us.user_account_id)
											   FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting_view u_view,
											   		${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting us
											  WHERE us.user_account_id = u.id
											    AND us.app_id = :app_id
												AND u_view.app1_user_setting_id = us.id) "count"
									FROM   ${process.env.SERVICE_DB_DB2_NAME}.user_account u
									WHERE  u.active = 1
									AND    5 = :statchoice_visited_setting) t
							WHERE    ROWNUM <=10
							ORDER BY 1,13 DESC, COALESCE("username", 
														"provider1_first_name",
														"provider2_first_name") `, 
						{
                            app_id: app_id,
							statchoice_like_setting: statchoice,
                            statchoice_visited_setting: statchoice
                        },
                        (err, result) => {
                            if (err) {
								createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                                return callBack(err);
                            } else {
                                return callBack(null, result.rows);
                            }
                        });
                } catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    return callBack(err.message);
                } finally {
                    if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
                }
            }
            execute_sql();
        }

    },
	updateUserSetting: (app_id, data, id, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
				`UPDATE ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting
					SET description = ?,
					regional_language_locale = ?,
					regional_current_timezone_select_id = ?,
					regional_timezone_select_id = ?,
					regional_number_system_select_id = ?,
					regional_layout_direction_select_id = ?,
					regional_second_language_locale = ?,
					regional_column_title_select_id = ?,
					regional_arabic_script_select_id = ?,
					regional_calendar_type_select_id = ?,
					regional_calendar_hijri_type_select_id = ?,
					gps_map_type_select_id = ?,
					gps_country_id = ?,
					gps_city_id = ?,
					gps_popular_place_id = ?,
					gps_lat_text = ?,
					gps_long_text = ?,
					design_theme_day_id = ?,
					design_theme_month_id = ?,
					design_theme_year_id = ?,
					design_paper_size_select_id = ?,
					design_row_highlight_select_id = ?,
					design_column_weekday_checked = ?,
					design_column_calendartype_checked = ?,
					design_column_notes_checked = ?,
					design_column_gps_checked = ?,
					design_column_timezone_checked = ?,
					image_header_image_img = ?,
					image_footer_image_img = ?,
					text_header_1_text = ?,
					text_header_2_text = ?,
					text_header_3_text = ?,
					text_header_align = ?,
					text_footer_1_text = ?,
					text_footer_2_text = ?,
					text_footer_3_text = ?,
					text_footer_align = ?,
					prayer_method_select_id = ?,
					prayer_asr_method_select_id = ?,
					prayer_high_latitude_adjustment_select_id = ?,
					prayer_time_format_select_id = ?,
					prayer_hijri_date_adjustment_select_id = ?,
					prayer_fajr_iqamat_select_id = ?,
					prayer_dhuhr_iqamat_select_id = ?,
					prayer_asr_iqamat_select_id = ?,
					prayer_maghrib_iqamat_select_id = ?,
					prayer_isha_iqamat_select_id = ?,
					prayer_column_imsak_checked = ?,
					prayer_column_sunset_checked = ?,
					prayer_column_midnight_checked = ?,
					prayer_column_fast_start_end_select_id = ?,
					user_account_id = ?,
					app_id,
					date_modified = SYSDATE()
				WHERE id = ? `,
				[
				data.description,
				data.regional_language_locale,
				data.regional_current_timezone_select_id,
				data.regional_timezone_select_id,
				data.regional_number_system_select_id,
				data.regional_layout_direction_select_id,
				data.regional_second_language_locale,
				data.regional_column_title_select_id,
				data.regional_arabic_script_select_id,
				data.regional_calendar_type_select_id,
				data.regional_calendar_hijri_type_select_id,
				data.gps_map_type_select_id,
				data.gps_country_id,
				data.gps_city_id,
				data.gps_popular_place_id,
				data.gps_lat_text,
				data.gps_long_text,
				data.design_theme_day_id,
				data.design_theme_month_id,
				data.design_theme_year_id,
				data.design_paper_size_select_id,
				data.design_row_highlight_select_id,
				data.design_column_weekday_checked,
				data.design_column_calendartype_checked,
				data.design_column_notes_checked,
				data.design_column_gps_checked,
				data.design_column_timezone_checked,
				data.image_header_image_img,
				data.image_footer_image_img,
				data.text_header_1_text,
				data.text_header_2_text,
				data.text_header_3_text,
				data.text_header_align,
				data.text_footer_1_text,
				data.text_footer_2_text,
				data.text_footer_3_text,
				data.text_footer_align,
				data.prayer_method_select_id,
				data.prayer_asr_method_select_id,
				data.prayer_high_latitude_adjustment_select_id,
				data.prayer_time_format_select_id,
				data.prayer_hijri_date_adjustment_select_id,
				data.prayer_fajr_iqamat_select_id,
				data.prayer_dhuhr_iqamat_select_id,
				data.prayer_asr_iqamat_select_id,
				data.prayer_maghrib_iqamat_select_id,
				data.prayer_isha_iqamat_select_id,
				data.prayer_column_imsak_checked,
				data.prayer_column_sunset_checked,
				data.prayer_column_midnight_checked,
				data.prayer_column_fast_start_end_select_id,
				data.user_account_id,
				app_id,
				id
				],
				(error, results, fields) => {
					if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`UPDATE ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting
						SET description = :description,
						regional_language_locale = :regional_language_locale,
						regional_current_timezone_select_id = :regional_current_timezone_select_id,
						regional_timezone_select_id = :regional_timezone_select_id,
						regional_number_system_select_id = :regional_number_system_select_id,
						regional_layout_direction_select_id = :regional_layout_direction_select_id,
						regional_second_language_locale = :regional_second_language_locale,
						regional_column_title_select_id = :regional_column_title_select_id,
						regional_arabic_script_select_id = :regional_arabic_script_select_id,
						regional_calendar_type_select_id = :regional_calendar_type_select_id,
						regional_calendar_hijri_type_select_id = :regional_calendar_hijri_type_select_id,
						gps_map_type_select_id = :gps_map_type_select_id,
						gps_country_id = :gps_country_id,
						gps_city_id = :gps_city_id,
						gps_popular_place_id = :gps_popular_place_id,
						gps_lat_text = :gps_lat_text,
						gps_long_text = :gps_long_text,
						design_theme_day_id = :design_theme_day_id,
						design_theme_month_id = :design_theme_month_id,
						design_theme_year_id = :design_theme_year_id,
						design_paper_size_select_id = :design_paper_size_select_id,
						design_row_highlight_select_id = :design_row_highlight_select_id,
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
						prayer_method_select_id = :prayer_method_select_id,
						prayer_asr_method_select_id = :prayer_asr_method_select_id,
						prayer_high_latitude_adjustment_select_id = :prayer_high_latitude_adjustment_select_id,
						prayer_time_format_select_id = :prayer_time_format_select_id,
						prayer_hijri_date_adjustment_select_id = :prayer_hijri_date_adjustment_select_id,
						prayer_fajr_iqamat_select_id = :prayer_fajr_iqamat_select_id,
						prayer_dhuhr_iqamat_select_id = :prayer_dhuhr_iqamat_select_id,
						prayer_asr_iqamat_select_id = :prayer_asr_iqamat_select_id,
						prayer_maghrib_iqamat_select_id = :prayer_maghrib_iqamat_select_id,
						prayer_isha_iqamat_select_id = :prayer_isha_iqamat_select_id,
						prayer_column_imsak_checked = :prayer_column_imsak_checked,
						prayer_column_sunset_checked = :prayer_column_sunset_checked,
						prayer_column_midnight_checked = :prayer_column_midnight_checked,
						prayer_column_fast_start_end_select_id = :prayer_column_fast_start_end_select_id,
						user_account_id = :user_account_id,
						app_id = :app_id
						date_modified = SYSDATE
					WHERE id = :id `,
					{
						description: data.description,
						regional_language_locale: data.regional_language_locale,
						regional_current_timezone_select_id: data.regional_current_timezone_select_id,
						regional_timezone_select_id: data.regional_timezone_select_id,
						regional_number_system_select_id: data.regional_number_system_select_id,
						regional_layout_direction_select_id: data.regional_layout_direction_select_id,
						regional_second_language_locale: data.regional_second_language_locale,
						regional_column_title_select_id: data.regional_column_title_select_id,
						regional_arabic_script_select_id: data.regional_arabic_script_select_id,
						regional_calendar_type_select_id: data.regional_calendar_type_select_id,
						regional_calendar_hijri_type_select_id: data.regional_calendar_hijri_type_select_id,
						gps_map_type_select_id: data.gps_map_type_select_id,
						gps_country_id: data.gps_country_id,
						gps_city_id: data.gps_city_id,
						gps_popular_place_id: data.gps_popular_place_id,
						gps_lat_text: data.gps_lat_text,
						gps_long_text: data.gps_long_text,
						design_theme_day_id: data.design_theme_day_id,
						design_theme_month_id: data.design_theme_month_id,
						design_theme_year_id: data.design_theme_year_id,
						design_paper_size_select_id: data.design_paper_size_select_id,
						design_row_highlight_select_id: data.design_row_highlight_select_id,
						design_column_weekday_checked: data.design_column_weekday_checked,
						design_column_calendartype_checked: data.design_column_calendartype_checked,
						design_column_notes_checked: data.design_column_notes_checked,
						design_column_gps_checked: data.design_column_gps_checked,
						design_column_timezone_checked: data.design_column_timezone_checked,
						image_header_image_img: Buffer.from(data.image_header_image_img, 'utf8'),
						image_footer_image_img: Buffer.from(data.image_footer_image_img, 'utf8'),
						text_header_1_text: data.text_header_1_text,
						text_header_2_text: data.text_header_2_text,
						text_header_3_text: data.text_header_3_text,
						text_header_align: data.text_header_align,
						text_footer_1_text: data.text_footer_1_text,
						text_footer_2_text: data.text_footer_2_text,
						text_footer_3_text: data.text_footer_3_text,
						text_footer_align: data.text_footer_align,
						prayer_method_select_id: data.prayer_method_select_id,
						prayer_asr_method_select_id: data.prayer_asr_method_select_id,
						prayer_high_latitude_adjustment_select_id: data.prayer_high_latitude_adjustment_select_id,
						prayer_time_format_select_id: data.prayer_time_format_select_id,
						prayer_hijri_date_adjustment_select_id: data.prayer_hijri_date_adjustment_select_id,
						prayer_fajr_iqamat_select_id: data.prayer_fajr_iqamat_select_id,
						prayer_dhuhr_iqamat_select_id: data.prayer_dhuhr_iqamat_select_id,
						prayer_asr_iqamat_select_id: data.prayer_asr_iqamat_select_id,
						prayer_maghrib_iqamat_select_id: data.prayer_maghrib_iqamat_select_id,
						prayer_isha_iqamat_select_id: data.prayer_isha_iqamat_select_id,
						prayer_column_imsak_checked: data.prayer_column_imsak_checked,
						prayer_column_sunset_checked: data.prayer_column_sunset_checked,
						prayer_column_midnight_checked: data.prayer_column_midnight_checked,
						prayer_column_fast_start_end_select_id: data.prayer_column_fast_start_end_select_id,
						user_account_id: data.user_account_id,
						app_id: app_id,
						id: id
					},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	},
	deleteUserSetting: (app_id, id, callBack) => {
		if (process.env.SERVICE_DB_USE == 1) {
			get_pool(app_id).query(
				`DELETE FROM ${process.env.SERVICE_DB_DB1_NAME}.app1_user_setting
				WHERE id = ? `,
				[id],
				(error, results, fields) => {
					if (error) {
						createLogAppSE(app_id, __appfilename, __appfunction, __appline, error);
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}else if (process.env.SERVICE_DB_USE==2){
			async function execute_sql(err, result){
				let pool2;
				try{
				pool2 = await oracledb.getConnection(get_pool(app_id));
				const result = await pool2.execute(
					`DELETE FROM ${process.env.SERVICE_DB_DB2_NAME}.app1_user_setting
					  WHERE id = :id `,
					{
						id: id
					},
					(err,result) => {
						if (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
				}catch (err) {
					createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
					return callBack(err.message);
				} finally {
					if (pool2) {
						try {
							await pool2.close(); 
						} catch (err) {
							createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
						}
					}
				}
			}
			execute_sql();
		}
	}
};