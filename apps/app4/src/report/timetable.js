/** @module apps/app4/src/report/timetable */

/**@type{import('../../../../server/server.js')} */
const {serverUtilNumberValue} = await import(`file://${process.cwd()}/server/server.js`);
/**@type{import('../../../../server/db/dbModelUserAccountAppDataPostView.js')} */
const dbModelUserAccountAppDataPostView = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPostView.js`);

const {APP_REPORT_GLOBAL, component} = await import('./lib_timetable.js');

/**
 * @name timetable_user_account_app_data_post_get
 * @description Timetable get user settings
 * @function
 * @param {number} app_id 
 * @param {number} user_account_app_data_post_id 
 * @returns {Promise.<import('../types.js').APP_REPORT_settings>}
 */
const timetable_user_account_app_data_post_get = async (app_id, user_account_app_data_post_id) => {
	/**@type{import('../../../../server/db/dbModelUserAccountAppDataPost.js')} */
    const { getUserPost} = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPost.js`);
	/**@ts-ignore */
	return getUserPost(app_id, user_account_app_data_post_id)
	.then(result_user_account_app_data_post=>{
		/**@type{import('../types.js').APP_user_setting_record}*/
		const user_account_app_data_post = JSON.parse(result_user_account_app_data_post.result[0].json_data);
		return  {  	locale              	: user_account_app_data_post.regional_language_locale,  
					timezone            	: user_account_app_data_post.regional_timezone,
					number_system       	: user_account_app_data_post.regional_number_system,
					direction           	: user_account_app_data_post.regional_layout_direction,
					second_locale       	: user_account_app_data_post.regional_second_language_locale,
					arabic_script       	: user_account_app_data_post.regional_arabic_script,
					calendartype        	: user_account_app_data_post.regional_calendar_type,
					calendar_hijri_type 	: user_account_app_data_post.regional_calendar_hijri_type,

					place               	: user_account_app_data_post.description,
					gps_lat					: typeof user_account_app_data_post.gps_lat_text== 'string'?parseFloat(user_account_app_data_post.gps_lat_text):user_account_app_data_post.gps_lat_text,
                    gps_long				: typeof user_account_app_data_post.gps_long_text=='string'?parseFloat(user_account_app_data_post.gps_long_text):user_account_app_data_post.gps_long_text,
					
					theme_day           	: 'theme_day_' + user_account_app_data_post.design_theme_day_id,
					theme_month         	: 'theme_month_' + user_account_app_data_post.design_theme_month_id,
					theme_year          	: 'theme_year_' + user_account_app_data_post.design_theme_year_id,
					papersize				: user_account_app_data_post.design_paper_size,
					highlight           	: user_account_app_data_post.design_row_highlight,
					show_weekday        	: serverUtilNumberValue(user_account_app_data_post.design_column_weekday_checked),
					show_calendartype   	: serverUtilNumberValue(user_account_app_data_post.design_column_calendartype_checked),
					show_notes          	: serverUtilNumberValue(user_account_app_data_post.design_column_notes_checked),
					show_gps   	       		: serverUtilNumberValue(user_account_app_data_post.design_column_gps_checked),
					show_timezone       	: serverUtilNumberValue(user_account_app_data_post.design_column_timezone_checked),
								
					header_img_src      	: (user_account_app_data_post.image_header_image_img == '' || user_account_app_data_post.image_header_image_img == null)?null:user_account_app_data_post.image_header_image_img,
					footer_img_src      	: (user_account_app_data_post.image_footer_image_img == '' || user_account_app_data_post.image_footer_image_img == null)?null:user_account_app_data_post.image_footer_image_img,

					header_txt1         	: user_account_app_data_post.text_header_1_text,
					header_txt2         	: user_account_app_data_post.text_header_2_text,
					header_txt3         	: user_account_app_data_post.text_header_3_text,
					header_align      		: (user_account_app_data_post.text_header_align == '' || user_account_app_data_post.text_header_align ==null)?null:user_account_app_data_post.text_header_align,
					footer_txt1         	: user_account_app_data_post.text_footer_1_text,
					footer_txt2         	: user_account_app_data_post.text_footer_2_text,
					footer_txt3    	   		: user_account_app_data_post.text_footer_3_text,
					footer_align			: (user_account_app_data_post.text_footer_align == '' || user_account_app_data_post.text_footer_align ==null)?null:user_account_app_data_post.text_footer_align,

					method              	: user_account_app_data_post.prayer_method,
					asr                 	: user_account_app_data_post.prayer_asr_method,
					highlat             	: user_account_app_data_post.prayer_high_latitude_adjustment,
					format              	: user_account_app_data_post.prayer_time_format,
					hijri_adj           	: serverUtilNumberValue(user_account_app_data_post.prayer_hijri_date_adjustment),
					iqamat_fajr         	: user_account_app_data_post.prayer_fajr_iqamat,
					iqamat_dhuhr        	: user_account_app_data_post.prayer_dhuhr_iqamat,
					iqamat_asr          	: user_account_app_data_post.prayer_asr_iqamat,
					iqamat_maghrib      	: user_account_app_data_post.prayer_maghrib_iqamat,
					iqamat_isha         	: user_account_app_data_post.prayer_isha_iqamat,
					show_imsak          	: serverUtilNumberValue(user_account_app_data_post.prayer_column_imsak_checked),
					show_sunset         	: serverUtilNumberValue(user_account_app_data_post.prayer_column_sunset_checked),
					show_midnight       	: serverUtilNumberValue(user_account_app_data_post.prayer_column_midnight_checked),
					show_fast_start_end 	: serverUtilNumberValue(user_account_app_data_post.prayer_column_fast_start_end),
					
					timetable_class			: 'timetable_class',
					timetable_month         : 'timetable_month_class',
					timetable_year_month    : 'timetable_year_month',
					reporttype_year_month  	: 'MONTH'
				};
	})
	.catch((/**@type{import('../../../../server/types.js').server_server_error}*/error)=>{
		throw error;
	});
};
/**
 * @name timetable_day_user_account_app_data_posts_get
 * @description Timetable get day user settings
 * @function
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @returns {Promise.<import('../types.js').APP_REPORT_day_user_account_app_data_posts[]>}
 */
const timetable_day_user_account_app_data_posts_get = async (app_id, user_account_id) => {
	/**@type{import('../types.js').APP_REPORT_day_user_account_app_data_posts[]} */
	const user_account_app_data_posts = [];
	/**@type{import('../../../../server/db/dbModelUserAccountAppDataPost.js')} */
    const { getUserPostsByUserId} = await import(`file://${process.cwd()}/server/db/dbModelUserAccountAppDataPost.js`);
    return getUserPostsByUserId({app_id:app_id, 
								resource_id:user_account_id})
	.then(result_user_account_app_data_posts=>{
		for (const user_account_app_data_post of result_user_account_app_data_posts.result) {
			//use settings that can be used on a day timetable showing different user settings
			//would be difficult to consider all settings on same page using
			//different texts, images, second languages, directions, column titles, 
			//arabic script, themes or what columns to display, for these use current users setting
			const settings = JSON.parse(user_account_app_data_post.json_data);
			user_account_app_data_posts.push(
				{
				'description' : settings.description,
				'regional_language_locale' : settings.regional_language_locale,
				'regional_timezone' : settings.regional_timezone,
				'regional_number_system' : settings.regional_number_system,
				'regional_calendar_hijri_type' : settings.regional_calendar_hijri_type,
				'gps_lat_text' : parseFloat(settings.gps_lat_text),
				'gps_long_text' : parseFloat(settings.gps_long_text),
				'prayer_method' : settings.prayer_method,
				'prayer_asr_method' : settings.prayer_asr_method,
				'prayer_high_latitude_adjustment' : settings.prayer_high_latitude_adjustment,
				'prayer_time_format' : settings.prayer_time_format,
				'prayer_hijri_date_adjustment' : settings.prayer_hijri_date_adjustment
				}
			);
		}
		return user_account_app_data_posts;
	})
	.catch((/**@type{import('../../../../server/types.js').server_server_error}*/error)=>{
		throw error;
	});
};
/**
 * @name timetable
 * @description Create timetable day, month or year
 * @function
 * @param {import('../../../../server/types.js').server_apps_report_create_parameters} timetable_parameters
 * @returns {Promise.<string>}
 */
const timetable = async (timetable_parameters) => {
	/**@type{import('../../../../server/db/fileModelAppParameter.js')} */
	const fileModelAppParameter = await import(`file://${process.cwd()}/server/db/fileModelAppParameter.js`);

	/**@ts-ignore */
	const decodedReportparameters = Buffer.from(timetable_parameters.reportid, 'base64').toString('utf-8');
	const urlParams = new URLSearchParams(decodedReportparameters);
	const user_account_id = Number(urlParams.get('id'));
	const user_account_app_data_post_id = Number(urlParams.get('sid'));
	const reporttype = Number(urlParams.get('type'));
	const uid_view = urlParams.get('uid_view')?Number(urlParams.get('uid_view')):null;
	/**
	 * 
	 * @param {string} decodedReportparameters 
	 * @returns 
	 */
	
	const parametersApp = fileModelAppParameter.get({app_id:timetable_parameters.app_id, resource_id:timetable_parameters.app_id}).result[0]; 
	return await new Promise((resolve) => {
		APP_REPORT_GLOBAL.app_copyright = parametersApp.app_copyright.value;
		/**@ts-ignore */
		APP_REPORT_GLOBAL.regional_def_calendar_lang = parametersApp.app_regional_default_calendar_lang.value;
		/**@ts-ignore */
		APP_REPORT_GLOBAL.regional_def_locale_ext_prefix = parametersApp.app_regional_default_locale_ext_prefix.value;
		/**@ts-ignore */
		APP_REPORT_GLOBAL.regional_def_locale_ext_number_system = parametersApp.app_regional_default_locale_ext_number_system.value;
		/**@ts-ignore */
		APP_REPORT_GLOBAL.regional_def_locale_ext_calendar = parametersApp.app_regional_default_locale_ext_calendar.value;
		/**@ts-ignore */
		APP_REPORT_GLOBAL.regional_def_calendar_type_greg = parametersApp.app_regional_default_calendar_type_greg.value;
		/**@ts-ignore */
		APP_REPORT_GLOBAL.regional_def_calendar_number_system = parametersApp.app_regional_default_calendar_number_system.value;
		
		/**@type{import('../../../../server/types.js').server_db_sql_parameter_user_account_app_data_post_view_insertUserPostView} */
		const data_ViewStat = { client_ip:          			timetable_parameters.ip,
								client_user_agent:  			timetable_parameters.user_agent,
								user_account_id:    			uid_view,
								user_account_app_data_post_id:  serverUtilNumberValue(user_account_app_data_post_id)};
		
		dbModelUserAccountAppDataPostView.post(timetable_parameters.app_id, data_ViewStat)
		.then(()=>{
			timetable_user_account_app_data_post_get(timetable_parameters.app_id, user_account_app_data_post_id)
			.then((user_account_app_data_post)=>{
				//set current date for report month
				APP_REPORT_GLOBAL.session_currentDate = new Date();
				APP_REPORT_GLOBAL.session_currentHijriDate = [0,0];
				//get Hijri date from initial Gregorian date
				APP_REPORT_GLOBAL.session_currentHijriDate[0] = 
					parseInt(new Date(	APP_REPORT_GLOBAL.session_currentDate.getFullYear(),
										APP_REPORT_GLOBAL.session_currentDate.getMonth(),
										APP_REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { month: 'numeric' }));
				APP_REPORT_GLOBAL.session_currentHijriDate[1] = 
					//Number() does not work for hijri year that return characters after year, use parseInt() that only returns year
					parseInt(new Date(	APP_REPORT_GLOBAL.session_currentDate.getFullYear(),
										APP_REPORT_GLOBAL.session_currentDate.getMonth(),
										APP_REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { year: 'numeric' }));
					if (reporttype==0){
						timetable_day_user_account_app_data_posts_get(timetable_parameters.app_id, user_account_id)
						.then(user_account_app_data_posts_parameters=>{
							const result = component({	data:		{
																	commonMountdiv:null,
																	button_id:null,
																	timetable:'DAY',
																	user_account_app_data_post:user_account_app_data_post,
																	user_account_app_data_posts_parameters:user_account_app_data_posts_parameters
																	},
														methods:	{
																	COMMON_DOCUMENT:null
																	}
														});
							resolve(result.template);
						})
						.catch(()=>resolve(''));
					}
					else
						if (reporttype==1){
							const result = component({	data:		{
																	commonMountdiv:null,
																	button_id:null,
																	timetable:'MONTH',
																	user_account_app_data_post:user_account_app_data_post,
																	user_account_app_data_posts_parameters:null
																	},
														methods:	{
																	COMMON_DOCUMENT:null
																	}
														});
							resolve(result.template);
						}
						else 
							if (reporttype==2){
								const result = component({	data:		{
																		commonMountdiv:null,
																		button_id:null,
																		timetable:'YEAR',
																		user_account_app_data_post:user_account_app_data_post,
																		user_account_app_data_posts_parameters:null
																		},
															methods:	{
																		COMMON_DOCUMENT:null
																		}
															});
								resolve(result.template);
							}
			}) 
			.catch(()=>resolve(''));
		})
		.catch((/**@type{import('../../../../server/types.js').server_server_error}*/error)=>{
			resolve(error);
		});
	});
};
export default timetable;