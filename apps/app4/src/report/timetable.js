/** @module apps/app4/src/report/timetable */

/**
 * @import {server} from './../../../../server/types.js'
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
        return  {  	locale              	: user_account_app_data_post.RegionalLanguageLocale,  
                    timezone            	: user_account_app_data_post.RegionalTimezone,
                    number_system       	: user_account_app_data_post.RegionalNumberSystem,
                    direction           	: user_account_app_data_post.RegionalLayoutDirection,
                    second_locale       	: user_account_app_data_post.RegionalSecondLanguageLocale,
                    arabic_script       	: user_account_app_data_post.RegionalArabicScript,
                    /**@ts-ignore */
                    calendartype        	: user_account_app_data_post.RegionalCalendarType,
                    calendar_hijri_type 	: user_account_app_data_post.RegionalCalendarHijriType,

                    place               	: user_account_app_data_post.Description,
                    /**@ts-ignore */
                    gps_lat					: typeof user_account_app_data_post.GpsLatText== 'string'?parseFloat(user_account_app_data_post.GpsLatText):user_account_app_data_post.GpsLatText,
                    /**@ts-ignore */
                    gps_long				: typeof user_account_app_data_post.GpsLongText=='string'?parseFloat(user_account_app_data_post.GpsLongText):user_account_app_data_post.GpsLongText,
                    
                    theme_day           	: 'theme_day_' + user_account_app_data_post.DesignThemeDayId,
                    theme_month         	: 'theme_month_' + user_account_app_data_post.DesignThemeMonthId,
                    theme_year          	: 'theme_year_' + user_account_app_data_post.DesignThemeYearId,
                    papersize				: user_account_app_data_post.DesignPaperSize,
                    highlight           	: user_account_app_data_post.DesignRowHighlight,
                    /**@ts-ignore */
                    show_weekday        	: server.ORM.UtilNumberValue(user_account_app_data_post.DesignColumnWeekdayChecked),
                    /**@ts-ignore */
                    show_calendartype   	: server.ORM.UtilNumberValue(user_account_app_data_post.DesignColumnCalendartypeChecked),
                    /**@ts-ignore */
                    show_notes          	: server.ORM.UtilNumberValue(user_account_app_data_post.DesignColumnNotesChecked),
                    /**@ts-ignore */
                    show_gps   	       		: server.ORM.UtilNumberValue(user_account_app_data_post.DesignColumnGpsChecked),
                    /**@ts-ignore */
                    show_timezone       	: server.ORM.UtilNumberValue(user_account_app_data_post.DesignColumnTimezoneChecked),
                    /**@ts-ignore */
                    header_img_src      	: (user_account_app_data_post.ImageHeaderImageImg == '' || user_account_app_data_post.ImageHeaderImageImg == null)?null:user_account_app_data_post.ImageHeaderImageImg,
                    /**@ts-ignore */
                    footer_img_src      	: (user_account_app_data_post.ImageFooterImageImg == '' || user_account_app_data_post.ImageFooterImageImg == null)?null:user_account_app_data_post.ImageFooterImageImg,

                    header_txt1         	: user_account_app_data_post.TextHeader1Text,
                    header_txt2         	: user_account_app_data_post.TextHeader2Text,
                    header_txt3         	: user_account_app_data_post.TextHeader3Text,
                    /**@ts-ignore */
                    header_align      		: (user_account_app_data_post.TextHeaderAlign == '' || user_account_app_data_post.TextHeaderAlign ==null)?null:user_account_app_data_post.TextHeaderAlign,
                    footer_txt1         	: user_account_app_data_post.TextFooter1Text,
                    footer_txt2         	: user_account_app_data_post.TextFooter2Text,
                    footer_txt3    	   		: user_account_app_data_post.TextFooter3Text,
                    /**@ts-ignore */
                    footer_align			: (user_account_app_data_post.TextFooterAlign == '' || user_account_app_data_post.TextFooterAlign ==null)?null:user_account_app_data_post.TextFooterAlign,

                    method              	: user_account_app_data_post.PrayerMethod,
                    asr                 	: user_account_app_data_post.PrayerAsrMethod,
                    highlat             	: user_account_app_data_post.PrayerHighLatitudeAdjustment,
                    format              	: user_account_app_data_post.PrayerTimeFormat,
                    /**@ts-ignore */
                    hijri_adj           	: server.ORM.UtilNumberValue(user_account_app_data_post.PrayerHijriDateAdjustment),
                    iqamat_fajr         	: user_account_app_data_post.PrayerFajrIqamat,
                    iqamat_dhuhr        	: user_account_app_data_post.PrayerDhuhrIqamat,
                    iqamat_asr          	: user_account_app_data_post.PrayerAsrIqamat,
                    iqamat_maghrib      	: user_account_app_data_post.PrayerMaghribIqamat,
                    iqamat_isha         	: user_account_app_data_post.PrayerIshaIqamat,
                    /**@ts-ignore */
                    show_imsak          	: server.ORM.UtilNumberValue(user_account_app_data_post.PrayerColumnImsakChecked),
                    /**@ts-ignore */
                    show_sunset         	: server.ORM.UtilNumberValue(user_account_app_data_post.PrayerColumnSunsetChecked),
                    /**@ts-ignore */
                    show_midnight       	: server.ORM.UtilNumberValue(user_account_app_data_post.PrayerColumnMidnightChecked),
                    /**@ts-ignore */
                    show_fast_start_end 	: server.ORM.UtilNumberValue(user_account_app_data_post.PrayerColumnFastStartEnd),
                    
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
			/**@type{APP_user_setting_record}*/
			const settings = user_account_app_data_post.Document;
			user_account_app_data_posts.push(
				{
				Description : settings.Description,
				RegionalLanguageLocale : settings.RegionalLanguageLocale,
				RegionalTimezone : settings.RegionalTimezone,
				RegionalNumberSystem : settings.RegionalNumberSystem,
				RegionalCalendarHijri_type : settings.RegionalCalendarHijriType,
				/**@ts-ignore */
				GpsLatText : parseFloat(settings.GpsLatText),
				/**@ts-ignore */
				GpsLongText : parseFloat(settings.GpsLongText),
				PrayerMethod : settings.PrayerMethod,
				PrayerAsrMethod : settings.PrayerAsrMethod,
				PrayerHighLatitudeAdjustment : settings.PrayerHighLatitudeAdjustment,
				PrayerTimeFormat : settings.PrayerTimeFormat,
				/**@ts-ignore */
				PrayerHijriDateAdjustment : settings.PrayerHijriDateAdjustment
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
 * @param {server['app']['commonReportCreateParameters']} timetable_parameters
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
							.reduce((/**@type{Object.<string,*>}*/key, /**@type{server['ORM']['Object']['AppData']}*/row)=>{key[row.Value] = row.DisplayData; return key},{});
	/**@type{server['ORM']['Object']['App']} */
    const result_app = server.ORM.db.App.get({app_id:timetable_parameters.app_id, resource_id:timetable_parameters.app_id}).result[0]; 
	return await new Promise((resolve) => {
		APP_REPORT_GLOBAL.app_copyright = result_app.Copyright;
		APP_REPORT_GLOBAL.regional_def_calendar_lang = parametersApp.app_regional_default_calendar_lang;
		APP_REPORT_GLOBAL.regional_def_locale_ext_prefix = parametersApp.app_regional_default_locale_ext_prefix;
		APP_REPORT_GLOBAL.regional_def_locale_ext_number_system = parametersApp.app_regional_default_locale_ext_number_system;
		APP_REPORT_GLOBAL.regional_def_locale_ext_calendar = parametersApp.app_regional_default_locale_ext_calendar;
		APP_REPORT_GLOBAL.regional_def_calendar_type_greg = parametersApp.app_regional_default_calendar_type_greg;
		APP_REPORT_GLOBAL.regional_def_calendar_number_system = parametersApp.app_regional_default_calendar_number_system;
		
		/**@type{server['ORM']['Object']['IamUserAppDataPostView']} */
		const data_ViewStat = { Document:{	client_ip:          		timetable_parameters.ip,
											client_user_agent:  		timetable_parameters.user_agent},
								IamUserAppId:    		iam_user_app_id_view,
								/**@ts-ignore */
								IamUserAppDataPostId: 	server.ORM.UtilNumberValue(user_account_app_data_post_id)};
		
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
		.catch((/**@type{server['server']['error']}*/error)=>{
			resolve(error);
		});
	});
};
export default timetable;