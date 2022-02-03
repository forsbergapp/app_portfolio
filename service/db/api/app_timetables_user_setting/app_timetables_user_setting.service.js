const {pool, oracledb, oracle_options} = require ("../../config/database");

module.exports = {
	createUserSetting: (data, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
				`INSERT INTO app_timetables_user_setting(
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
					user_account_id)
				VALUES(?,?,?,?,?,?,?,?,?,?,
					?,?,?,?,?,?,?,?,?,?,
					?,?,?,?,?,?,?,?,?,?,
					?,?,?,?,?,?,?,?,?,?,
					?,?,?,?,?,?,?,?,?,?,
					?,SYSDATE(),SYSDATE(),?)`,
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
				data.user_account_id
				],
				(error, results, fields) => {
					if (error){
						return callBack(error);
					}
					return callBack(null, results);
				}	
			);
		}else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`INSERT INTO app_timetables_user_setting(
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
						user_account_id)
					VALUES(	:description,
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
							:user_account_id)`,
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
						user_account_id: data.user_account_id
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							//Fetch id from rowid returned from Oracle
							//sample output:
							//{"lastRowid":"AAAWwdAAAAAAAdHAAC","rowsAffected":1}
							async function execute_sql2(err_id, result_id){
								//remove "" before and after
								var lastRowid = JSON.stringify(result.lastRowid).replace(/"/g,'');
								const pool3 = await oracledb.getConnection();
								const result_rowid = await pool3.execute(
									`SELECT id "insertId"
									   FROM app_timetables_user_setting
									  WHERE rowid = :lastRowid`,
									{
										lastRowid: lastRowid
									},
									oracle_options, (err_id2,result_id2) => {
										if (err_id2) {
											return callBack(err_id2);
										}
										else{
											return callBack(null, result_id2.rows[0]);
										}
									});
								await pool3.close();
							}
							execute_sql2();
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	},
	getUserSetting:  (id, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
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
					user_account_id
				FROM app_timetables_user_setting 
				WHERE id = ? `,
				[id],
				(error, results, fields) => {
					if (error){
						return callBack(error);
					}
					return callBack(null, results);
				}
			);
		}else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
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
						user_account_id "user_account_id"
					FROM app_timetables_user_setting 
					WHERE id = :id `,
					{
						id: id
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	},
	getUserSettingsByUserId: (id, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
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
					us.user_account_id
				FROM app_timetables_user_setting us
				WHERE us.user_account_id = ? `,
				[id],
				(error, results, fields) => {
					if (error) {
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}
		else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
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
						user_account_id "user_account_id"
					FROM app_timetables_user_setting
					WHERE user_account_id = :user_account_id `,
					{
						user_account_id: id
					},
					oracle_options,
				 	(err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	},
	getProfileUserSettings: (id, id_current_user, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
				`SELECT
					us.id,
					us.description,
					us.user_account_id,
					(SELECT COUNT(u_like.id)
					   FROM app_timetables_user_setting_like u_like
					  WHERE u_like.user_setting_id = us.id)				count_likes,
					(SELECT COUNT(u_view.user_setting_id)
					   FROM app_timetables_user_setting_view u_view
					  WHERE u_view.user_setting_id = us.id)				count_views,
					(SELECT COUNT(u_liked_current_user.id)
					   FROM app_timetables_user_setting_like u_liked_current_user
					  WHERE u_liked_current_user.user_account_id = ?
						AND u_liked_current_user.user_setting_id = us.id) 	liked
				FROM app_timetables_user_setting us
				WHERE us.user_account_id = ? `,
				[id_current_user,
				id],
				(error, results, fields) => {
					if (error) {
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`SELECT
						us.id "id",
						us.description "description",
						us.user_account_id "user_account_id",
						(SELECT COUNT(u_like.id)
						   FROM app_timetables_user_setting_like u_like
						  WHERE u_like.user_setting_id = us.id)				"count_likes",
						(SELECT COUNT(u_view.user_setting_id)
						   FROM app_timetables_user_setting_view u_view
						  WHERE u_view.user_setting_id = us.id)				"count_views",
						(SELECT COUNT(u_liked_current_user.id)
						   FROM app_timetables_user_setting_like u_liked_current_user
						  WHERE u_liked_current_user.user_account_id = :user_account_id_current
						    AND u_liked_current_user.user_setting_id = us.id) 	"liked"
					FROM app_timetables_user_setting us
					WHERE us.user_account_id = :user_account_id `,
					{
						user_account_id_current: id_current_user,
						user_account_id: id
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result.rows);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	},
	updateUserSetting: (data, id, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
				`UPDATE app_timetables_user_setting
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
				id
				],
				(error, results, fields) => {
					if (error) {
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`UPDATE app_timetables_user_setting
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
						id: id
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	},
	deleteUserSetting: (id, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
				`DELETE FROM app_timetables_user_setting
				WHERE id = ? `,
				[id],
				(error, results, fields) => {
					if (error) {
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`DELETE FROM app_timetables_user_setting
					WHERE id = :id `,
					{
						id: id
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	},
	deleteUserSettingsByUserId: (id, callBack) => {
		if (process.env.SERVER_DB_USE == 1) {
			pool.query(
				`DELETE FROM app_timetables_user_setting
				WHERE user_account_id = ? `,
				[id],
				(error, results, fields) => {
					if (error) {
						return callBack(error);
					}
					return callBack(null, results); 
				}
			)
		}else if (process.env.SERVER_DB_USE==2){
			async function execute_sql(err, result){
				try{
				const pool2 = await oracledb.getConnection();
				const result = await pool2.execute(
					`DELETE FROM app_timetables_user_setting
					WHERE user_account_id = :user_account_id `,
					{
						user_account_id: id
					},
					oracle_options, (err,result) => {
						if (err) {
							return callBack(err);
						}
						else{
							return callBack(null, result);
						}
					});
					await pool2.close();
				}catch (err) {
					return callBack(err.message);
				} finally {
					null;
				}
			}
			execute_sql();
		}
	}
};