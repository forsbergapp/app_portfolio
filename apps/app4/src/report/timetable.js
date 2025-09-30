/** @module apps/app4/src/report/timetable */

/**
 * @import {server_apps_report_create_parameters,
 * 			server_db_table_IamUserAppDataPostView,
 * 			server_db_table_AppData,
 * 			server_server_error} from './../../../../server/types.js'
 * @import {APP_REPORT_day_user_account_app_data_posts, APP_REPORT_settings, APP_user_setting_record} from '../types.js'
 */

const {server} = await import('../../../../server/server.js');

const {APP_REPORT_GLOBAL, component} = await import('../../public/component/app_lib.js');

/**
 * @name timetable_user_account_app_data_post_get
 * @description Timetable get user settings
 * @function
 * @param {number} app_id 
 * @param {number} user_account_app_data_post_id 
 * @returns {Promise.<APP_REPORT_settings>}
 */
const timetable_user_account_app_data_post_get = async (app_id, user_account_app_data_post_id) => {
	
	const result_user_account_app_data_post =  server.ORM.db.IamUserAppDataPost.get({app_id:app_id, resource_id:user_account_app_data_post_id, data:{data_app_id:null, iam_user_id:null}});
    if (result_user_account_app_data_post.result){
        /**@type{APP_user_setting_record}*/
        const user_account_app_data_post = result_user_account_app_data_post.result[0].Document;
        return  {  	locale              	: user_account_app_data_post.regional_language_locale,  
                    timezone            	: user_account_app_data_post.regional_timezone,
                    number_system       	: user_account_app_data_post.regional_number_system,
                    direction           	: user_account_app_data_post.regional_layout_direction,
                    second_locale       	: user_account_app_data_post.regional_second_language_locale,
                    arabic_script       	: user_account_app_data_post.regional_arabic_script,
                    /**@ts-ignore */
                    calendartype        	: user_account_app_data_post.regional_calendar_type,
                    calendar_hijri_type 	: user_account_app_data_post.regional_calendar_hijri_type,

                    place               	: user_account_app_data_post.description,
                    /**@ts-ignore */
                    gps_lat					: typeof user_account_app_data_post.gps_lat_text== 'string'?parseFloat(user_account_app_data_post.gps_lat_text):user_account_app_data_post.gps_lat_text,
                    /**@ts-ignore */
                    gps_long				: typeof user_account_app_data_post.gps_long_text=='string'?parseFloat(user_account_app_data_post.gps_long_text):user_account_app_data_post.gps_long_text,
                    
                    theme_day           	: 'theme_day_' + user_account_app_data_post.design_theme_day_id,
                    theme_month         	: 'theme_month_' + user_account_app_data_post.design_theme_month_id,
                    theme_year          	: 'theme_year_' + user_account_app_data_post.design_theme_year_id,
                    papersize				: user_account_app_data_post.design_paper_size,
                    highlight           	: user_account_app_data_post.design_row_highlight,
                    /**@ts-ignore */
                    show_weekday        	: server.ORM.UtilNumberValue(user_account_app_data_post.design_column_weekday_checked),
                    /**@ts-ignore */
                    show_calendartype   	: server.ORM.UtilNumberValue(user_account_app_data_post.design_column_calendartype_checked),
                    /**@ts-ignore */
                    show_notes          	: server.ORM.UtilNumberValue(user_account_app_data_post.design_column_notes_checked),
                    /**@ts-ignore */
                    show_gps   	       		: server.ORM.UtilNumberValue(user_account_app_data_post.design_column_gps_checked),
                    /**@ts-ignore */
                    show_timezone       	: server.ORM.UtilNumberValue(user_account_app_data_post.design_column_timezone_checked),
                    /**@ts-ignore */
                    header_img_src      	: (user_account_app_data_post.image_header_image_img == '' || user_account_app_data_post.image_header_image_img == null)?null:user_account_app_data_post.image_header_image_img,
                    /**@ts-ignore */
                    footer_img_src      	: (user_account_app_data_post.image_footer_image_img == '' || user_account_app_data_post.image_footer_image_img == null)?null:user_account_app_data_post.image_footer_image_img,

                    header_txt1         	: user_account_app_data_post.text_header_1_text,
                    header_txt2         	: user_account_app_data_post.text_header_2_text,
                    header_txt3         	: user_account_app_data_post.text_header_3_text,
                    /**@ts-ignore */
                    header_align      		: (user_account_app_data_post.text_header_align == '' || user_account_app_data_post.text_header_align ==null)?null:user_account_app_data_post.text_header_align,
                    footer_txt1         	: user_account_app_data_post.text_footer_1_text,
                    footer_txt2         	: user_account_app_data_post.text_footer_2_text,
                    footer_txt3    	   		: user_account_app_data_post.text_footer_3_text,
                    /**@ts-ignore */
                    footer_align			: (user_account_app_data_post.text_footer_align == '' || user_account_app_data_post.text_footer_align ==null)?null:user_account_app_data_post.text_footer_align,

                    method              	: user_account_app_data_post.prayer_method,
                    asr                 	: user_account_app_data_post.prayer_asr_method,
                    highlat             	: user_account_app_data_post.prayer_high_latitude_adjustment,
                    format              	: user_account_app_data_post.prayer_time_format,
                    /**@ts-ignore */
                    hijri_adj           	: server.ORM.UtilNumberValue(user_account_app_data_post.prayer_hijri_date_adjustment),
                    iqamat_fajr         	: user_account_app_data_post.prayer_fajr_iqamat,
                    iqamat_dhuhr        	: user_account_app_data_post.prayer_dhuhr_iqamat,
                    iqamat_asr          	: user_account_app_data_post.prayer_asr_iqamat,
                    iqamat_maghrib      	: user_account_app_data_post.prayer_maghrib_iqamat,
                    iqamat_isha         	: user_account_app_data_post.prayer_isha_iqamat,
                    /**@ts-ignore */
                    show_imsak          	: server.ORM.UtilNumberValue(user_account_app_data_post.prayer_column_imsak_checked),
                    /**@ts-ignore */
                    show_sunset         	: server.ORM.UtilNumberValue(user_account_app_data_post.prayer_column_sunset_checked),
                    /**@ts-ignore */
                    show_midnight       	: server.ORM.UtilNumberValue(user_account_app_data_post.prayer_column_midnight_checked),
                    /**@ts-ignore */
                    show_fast_start_end 	: server.ORM.UtilNumberValue(user_account_app_data_post.prayer_column_fast_start_end),
                    
                    timetable_class			: 'timetable_class',
                    timetable_month         : 'timetable_month_class',
                    timetable_year_month    : 'timetable_year_month',
                    reporttype_year_month  	: 'MONTH'
                };
    }
    else
        throw result_user_account_app_data_post;
};
/**
 * @name timetable_day_user_account_app_data_posts_get
 * @description Timetable get day user settings
 * @function
 * @param {number} app_id 
 * @param {number} iam_user_id
 * @returns {Promise.<APP_REPORT_day_user_account_app_data_posts[]>}
 */
const timetable_day_user_account_app_data_posts_get = async (app_id, iam_user_id) => {
	/**@type{APP_REPORT_day_user_account_app_data_posts[]} */
	const user_account_app_data_posts = [];
	const result_user_account_app_data_posts = server.ORM.db.IamUserAppDataPost.get({	app_id:app_id, 
												resource_id:null,
												data:{data_app_id:app_id, iam_user_id:iam_user_id}
												});
	if (result_user_account_app_data_posts.result){
		for (const user_account_app_data_post of result_user_account_app_data_posts.result) {
			//use settings that can be used on a day timetable showing different user settings
			//would be difficult to consider all settings on same page using
			//different texts, images, second languages, directions, column titles, 
			//arabic script, themes or what columns to display, for these use current users setting
			const settings = user_account_app_data_post.Document;
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
	}
	else
		throw result_user_account_app_data_posts;
};
/**
 * @name timetable
 * @description Create timetable day, month or year
 * @function
 * @param {server_apps_report_create_parameters} timetable_parameters
 * @returns {Promise.<string>}
 */
const timetable = async (timetable_parameters) => {

	const decodedReportparameters = Buffer.from(timetable_parameters.reportid, 'base64').toString('utf-8');
	const urlParams = new URLSearchParams(decodeURIComponent(decodedReportparameters));
	const iam_user_id = Number(urlParams.get('id'));
	const user_account_app_data_post_id = Number(urlParams.get('sid'));
	const reporttype = Number(urlParams.get('type'));
	const iam_user_app_id_view = urlParams.get('uid_view')?Number(urlParams.get('uid_view')):null;
	
	/**@type{Object.<string,*>} */
	const parametersApp = server.ORM.db.AppData.getServer({app_id:timetable_parameters.app_id, resource_id:null, data:{name:'APP_PARAMETER', data_app_id:timetable_parameters.app_id}}).result
							.reduce((/**@type{Object.<string,*>}*/key, /**@type{server_db_table_AppData}*/row)=>{key[row.value] = row.display_data; return key},{});
    const result_app = server.ORM.db.App.get({app_id:timetable_parameters.app_id, resource_id:timetable_parameters.app_id}).result[0]; 
	return await new Promise((resolve) => {
		APP_REPORT_GLOBAL.app_copyright = result_app.copyright;
		APP_REPORT_GLOBAL.regional_def_calendar_lang = parametersApp.app_regional_default_calendar_lang;
		APP_REPORT_GLOBAL.regional_def_locale_ext_prefix = parametersApp.app_regional_default_locale_ext_prefix;
		APP_REPORT_GLOBAL.regional_def_locale_ext_number_system = parametersApp.app_regional_default_locale_ext_number_system;
		APP_REPORT_GLOBAL.regional_def_locale_ext_calendar = parametersApp.app_regional_default_locale_ext_calendar;
		APP_REPORT_GLOBAL.regional_def_calendar_type_greg = parametersApp.app_regional_default_calendar_type_greg;
		APP_REPORT_GLOBAL.regional_def_calendar_number_system = parametersApp.app_regional_default_calendar_number_system;
		
		/**@type{server_db_table_IamUserAppDataPostView} */
		const data_ViewStat = { Document:{	client_ip:          		timetable_parameters.ip,
											client_user_agent:  		timetable_parameters.user_agent},
								iam_user_app_id:    		iam_user_app_id_view,
								/**@ts-ignore */
								iam_user_app_data_post_id: 	server.ORM.UtilNumberValue(user_account_app_data_post_id)};
		
        server.ORM.db.IamUserAppDataPostView.post(timetable_parameters.app_id, data_ViewStat)
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
						timetable_day_user_account_app_data_posts_get(timetable_parameters.app_id, iam_user_id)
						.then(user_account_app_data_posts_parameters=>{
							const result = component({	data:		{
																	commonMountdiv:null,
																	button_id:null,
																	timetable:'DAY',
																	user_account_app_data_post:user_account_app_data_post,
                                                                    /**@ts-ignore */
																	user_account_app_data_posts_parameters:user_account_app_data_posts_parameters
																	},
														methods:	{
																	COMMON:null
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
																	COMMON:null
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
																		COMMON:null
																		}
															});
								resolve(result.template);
							}
			}) 
			.catch(()=>resolve(''));
		})
		.catch((/**@type{server_server_error}*/error)=>{
			resolve(error);
		});
	});
};
export default timetable;