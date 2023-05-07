/*  Functions and globals in this order:
    GLOBALS APP & REPORT
	COMMON REPORT
	COMMON APP & REPORT
	COMMON APP & REPORT TIMETABLE MONTH & YEAR (USES MODULE REGIONAL)
	COMMON APP & REPORT TIMETABLE DAY (USES MODULE REGIONAL)
	COMMON APP & REPORT TIMETABLE YEAR
    EXCEPTION REPORT
    INIT REPORT (USES MODULE PRAYTIMES)

	APP    = USED IN APP
	REPORT = USED IN REPORT
*/
const common = await import('/common/js/common.js');
const regional = await import('/common/modules/regional/regional.js');
const app_common = await import('/app2/js/app_common.js');
/*----------------------- */
/* GLOBALS APP & REPORT   */
/*----------------------- */
const REPORT_GLOBAL = {
	"regional_def_calendar_lang":"",
	"regional_def_locale_ext_prefix":"",
	"regional_def_locale_ext_number_system":"",
	"regional_def_locale_ext_calendar":"",
	"regional_def_calendar_type_greg":"",
	"regional_def_calendar_number_system":"",
	"first_language":{
						"coltitle_transliteration_imsak": "Imsak",
						"coltitle_transliteration_fajr": "Fajr",
						"coltitle_transliteration_fajr_iqamat": "Iqamat",
						"coltitle_transliteration_sunrise": "Shoorok",
						"coltitle_transliteration_dhuhr": "Dhuhr",
						"coltitle_transliteration_dhuhr_iqamat": "Iqamat",
						"coltitle_transliteration_asr": "Asr",
						"coltitle_transliteration_asr_iqamat": "Iqamat",
						"coltitle_transliteration_sunset": "Sunset",
						"coltitle_transliteration_maghrib": "Maghrib",
						"coltitle_transliteration_maghrib_iqamat": "Iqamat",
						"coltitle_transliteration_isha": "Isha",
						"coltitle_transliteration_isha_iqamat": "Iqamat",
						"coltitle_transliteration_midnight": "Midnight",
						"timetable_title": "Timetable",
						"coltitle_day": "Day",
						"coltitle_weekday": "Weekday",
						"coltitle_weekday_tr": "",
						"coltitle_caltype_hijri": "Hijri",
						"coltitle_caltype_gregorian": "Gregorian",
						"coltitle_imsak": "Imsak",
						"coltitle_fajr": "Dawn",
						"coltitle_fajr_iqamat": "Iqamat",
						"coltitle_sunrise": "Sunrise",
						"coltitle_dhuhr": "Noon",
						"coltitle_dhuhr_iqamat": "Iqamat",
						"coltitle_asr": "Afternoon",
						"coltitle_asr_iqamat": "Iqamat",
						"coltitle_sunset": "Sunset",
						"coltitle_maghrib": "Sunset",
						"coltitle_maghrib_iqamat": "Iqamat",
						"coltitle_isha": "Night",
						"coltitle_isha_iqamat": "Iqamat",
						"coltitle_midnight": "Midnight",
						"coltitle_notes": "Notes",
						"timezone_text": "🌐",
						"gps_lat_text":"📍",
						"gps_long_text":""
					},
	//second language objects that are displayed are column titles
	//transliterated column titles are used by first language
	"second_language":{
						"timetable_title": "Timetable",
						"coltitle_day": "Day",
						"coltitle_weekday": "Weekday",
						"coltitle_weekday_tr": "",
						"coltitle_caltype_hijri": "Hijri",
						"coltitle_caltype_gregorian": "Gregorian",
						"coltitle_imsak": "Imsak",
						"coltitle_fajr": "Dawn",
						"coltitle_fajr_iqamat": "Iqamat",
						"coltitle_sunrise": "Sunrise",
						"coltitle_dhuhr": "Noon",
						"coltitle_dhuhr_iqamat": "Iqamat",
						"coltitle_asr": "Afternoon",
						"coltitle_asr_iqamat": "Iqamat",
						"coltitle_sunset": "Sunset",
						"coltitle_maghrib": "Sunset",
						"coltitle_maghrib_iqamat": "Iqamat",
						"coltitle_isha": "Night",
						"coltitle_isha_iqamat": "Iqamat",
						"coltitle_midnight": "Midnight",
						"coltitle_notes": "Notes"
					}
}
/*----------------------- */
/* COMMON REPORT		  */
/*----------------------- */
const timetable_user_setting_get = async (user_setting_id, callBack) => {
    let result_obj;
	await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account_app_setting/${user_setting_id}?`,
					   'GET', 0, null, null, null, (err, result) =>{
		if (err){
			report_exception(err);
			callBack(err, null);
		}
		else{
			result_obj = JSON.parse(result);
			let settings;
			settings = JSON.parse(result_obj.settings_json);
			//set papersize on paper div
			document.getElementById('paper').className= settings.design_paper_size;
			callBack(null,
						{  	locale              	: settings.regional_language_locale,  
							timezone            	: settings.regional_timezone,
							number_system       	: settings.regional_number_system,
							direction           	: settings.regional_layout_direction,
							second_locale       	: settings.regional_second_language_locale,
							coltitle            	: settings.regional_column_title,
							arabic_script       	: settings.regional_arabic_script,
							calendartype        	: settings.regional_calendar_type,
							calendar_hijri_type 	: settings.regional_calendar_hijri_type,

							/* app ui settings
							settings.gps_map_type
							settings.gps_country_id		
							settings.gps_city_id		
							settings.gps_popular_place_id
							*/              
							place               	: settings.description,
							gps_lat             	: parseFloat(settings.gps_lat_text),
							gps_long            	: parseFloat(settings.gps_long_text),
							
							theme_day           	: 'theme_day_' + settings.design_theme_day_id,
							theme_month         	: 'theme_month_' + settings.design_theme_month_id,
							theme_year          	: 'theme_year_' + settings.design_theme_year_id,
							//send from app and url query parameter to instruct papersize for PDF generation
							//in report service
							//papersize				: settings.design_paper_size
							highlight           	: settings.design_row_highlight,
							show_weekday        	: common.checkbox_checked(settings.design_column_weekday_checked),
							show_calendartype   	: common.checkbox_checked(settings.design_column_calendartype_checked),
							show_notes          	: common.checkbox_checked(settings.design_column_notes_checked),
							show_gps   	       		: common.checkbox_checked(settings.design_column_gps_checked),
							show_timezone       	: common.checkbox_checked(settings.design_column_timezone_checked),
										
							header_img_src      	: common.image_format(settings.image_header_image_img),
							footer_img_src      	: common.image_format(settings.image_footer_image_img),

							header_txt1         	: common.get_null_or_value(settings.text_header_1_text),
							header_txt2         	: common.get_null_or_value(settings.text_header_2_text),
							header_txt3         	: common.get_null_or_value(settings.text_header_3_text),
							header_align      		: common.get_null_or_value(settings.text_header_align),
							footer_txt1         	: common.get_null_or_value(settings.text_footer_1_text),
							footer_txt2         	: common.get_null_or_value(settings.text_footer_2_text),
							footer_txt3    	   		: common.get_null_or_value(settings.text_footer_3_text),
							footer_align			: common.get_null_or_value(settings.text_footer_align),

							method              	: settings.prayer_method,
							asr                 	: settings.prayer_asr_method,
							highlat             	: settings.prayer_high_latitude_adjustment,
							format              	: settings.prayer_time_format,
							hijri_adj           	: settings.prayer_hijri_date_adjustment,
							iqamat_fajr         	: settings.prayer_fajr_iqamat,
							iqamat_dhuhr        	: settings.prayer_dhuhr_iqamat,
							iqamat_asr          	: settings.prayer_asr_iqamat,
							iqamat_maghrib      	: settings.prayer_maghrib_iqamat,
							iqamat_isha         	: settings.prayer_isha_iqamat,
							show_imsak          	: common.checkbox_checked(settings.prayer_column_imsak_checked),
							show_sunset         	: common.checkbox_checked(settings.prayer_column_sunset_checked),
							show_midnight       	: common.checkbox_checked(settings.prayer_column_midnight_checked),
							show_fast_start_end 	: settings.prayer_column_fast_start_end,
							
							timetable_class			: 'timetable_class',
							timetable_month         : 'timetable_month_class', //class to add for month
							timetable_year_month    : 'timetable_year_month', //class to add for year
							reporttype_year_month  	: 'MONTH', //default MONTH: normal month with more info, 
															   //YEAR: month with less info

							ui_navigation_left      : 'toolbar_btn_left',
							ui_navigation_right     : 'toolbar_btn_right',
							ui_timetable_day_id     : 'timetable_day',
							ui_timetable_month_id   : 'timetable_month',
							ui_timetable_year_id    : 'timetable_year'
						}
			);
		} 
    })
}
const timetable_translate_settings = async (locale, locale_second) => {
    let json;
	const fetch_translation = async (locale, first) => {
		//show translation using first or second language
		await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/app_object/${locale}?object=APP_OBJECT_ITEM&object_name=REPORT`,
					       'GET', 0, null, null, null, (err, result) =>{
			if (err){
				report_exception(err);
			}
			else{
				json = JSON.parse(result);	
				for (let i = 0; i < json.data.length; i++){
					if (first == true)
						REPORT_GLOBAL['first_language'][json.data[i].object_item_name.toLowerCase()] = json.data[i].text;
					else
						REPORT_GLOBAL['second_language'][json.data[i].object_item_name.toLowerCase()] = json.data[i].text;
				}
			} 
		})
	}
	await fetch_translation(locale, true).then(() => {
		if (locale_second ==0){
			REPORT_GLOBAL['second_language'].timetable_title = '';
			REPORT_GLOBAL['second_language'].coltitle_day = '';
			REPORT_GLOBAL['second_language'].coltitle_weekday = '';
			REPORT_GLOBAL['second_language'].coltitle_weekday_tr = '';
			REPORT_GLOBAL['second_language'].coltitle_caltype_hijri = '';
			REPORT_GLOBAL['second_language'].coltitle_caltype_gregorian = '';
			REPORT_GLOBAL['second_language'].coltitle_imsak = '';
			REPORT_GLOBAL['second_language'].coltitle_fajr = '';
			REPORT_GLOBAL['second_language'].coltitle_fajr_iqamat = '';
			REPORT_GLOBAL['second_language'].coltitle_sunrise = '';
			REPORT_GLOBAL['second_language'].coltitle_dhuhr = '';
			REPORT_GLOBAL['second_language'].coltitle_dhuhr_iqamat = '';
			REPORT_GLOBAL['second_language'].coltitle_asr = '';
			REPORT_GLOBAL['second_language'].coltitle_asr_iqamat = '';
			REPORT_GLOBAL['second_language'].coltitle_sunset = '';
			REPORT_GLOBAL['second_language'].coltitle_maghrib = '';
			REPORT_GLOBAL['second_language'].coltitle_maghrib_iqamat = '';
			REPORT_GLOBAL['second_language'].coltitle_isha = '';
			REPORT_GLOBAL['second_language'].coltitle_isha_iqamat = '';
			REPORT_GLOBAL['second_language'].coltitle_midnight = '';
			REPORT_GLOBAL['second_language'].coltitle_notes = '';
		}
	})
	await fetch_translation(locale_second, false);
}
/*----------------------- */
/* COMMON APP & REPORT    */
/*----------------------- */
const updateReportViewStat = (user_setting_id, user_account_id) => {
    let json_data =`{
                    "user_account_id":${user_account_id==''?null:user_account_id},
                    "user_setting_id":${user_setting_id},
                    "client_longitude": "${common.COMMON_GLOBAL['client_longitude']}",
                    "client_latitude": "${common.COMMON_GLOBAL['client_latitude']}"
                    }`;
	common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account_app_setting_view?`,
				 'POST', 0, json_data, null, null, (err, result) =>{
		null;
	})
}
const getColumnTitles = (transliteration = 0, calendartype, locale, second_locale, first_locale) => {
	let coltitle = {day: '',
					weekday: '',
					weekday_tr: '',
					caltype: '',
					imsak: '',
					fajr: '',
					fajr_iqamat: '',
					sunrise: '',
					dhuhr: '',
					dhuhr_iqamat: '',
					asr: '',
					asr_iqamat: '',
					sunset: '',
					maghrib: '',
					maghrib_iqamat: '',
					isha: '',
					isha_iqamat: '',
					midnight: '',
					notes: ''};
	if (transliteration == 1){
		//set only these values for transliterad column titles
		coltitle['imsak'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_imsak;
		coltitle['fajr'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_fajr;
		coltitle['fajr_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_fajr_iqamat;
		coltitle['sunrise'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_sunrise;
		coltitle['dhuhr'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_dhuhr;
		coltitle['dhuhr_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_dhuhr_iqamat;
		coltitle['asr'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_asr;
		coltitle['asr_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_asr_iqamat;
		coltitle['sunset'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_sunset;
		coltitle['maghrib'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_maghrib;
		coltitle['maghrib_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_maghrib_iqamat;
		coltitle['isha'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_isha;
		coltitle['isha_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_isha_iqamat;
		coltitle['midnight'] = REPORT_GLOBAL['first_language'].coltitle_transliteration_midnight;
		}
	else {
		if (locale==first_locale){
			coltitle['day'] = REPORT_GLOBAL['first_language'].coltitle_day;
			coltitle['weekday'] = REPORT_GLOBAL['first_language'].coltitle_weekday;
			if (second_locale != '0') {
				coltitle['weekday_tr'] = REPORT_GLOBAL['second_language'].coltitle_weekday;
			} else
				coltitle['weekday_tr'] = '';
			if (calendartype == 'GREGORIAN') {
				coltitle['caltype'] = REPORT_GLOBAL['first_language'].coltitle_caltype_hijri;
			} else {
				coltitle['caltype'] = REPORT_GLOBAL['first_language'].coltitle_caltype_gregorian;
			}
			coltitle['imsak'] = REPORT_GLOBAL['first_language'].coltitle_imsak;
			coltitle['fajr'] = REPORT_GLOBAL['first_language'].coltitle_fajr;
			coltitle['fajr_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_fajr_iqamat;
			coltitle['sunrise'] = REPORT_GLOBAL['first_language'].coltitle_sunrise;
			coltitle['dhuhr'] = REPORT_GLOBAL['first_language'].coltitle_dhuhr;
			coltitle['dhuhr_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_dhuhr_iqamat;
			coltitle['asr'] = REPORT_GLOBAL['first_language'].coltitle_asr;
			coltitle['asr_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_asr_iqamat;
			coltitle['sunset'] = REPORT_GLOBAL['first_language'].coltitle_sunset;
			coltitle['maghrib'] = REPORT_GLOBAL['first_language'].coltitle_maghrib;
			coltitle['maghrib_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_maghrib_iqamat;
			coltitle['isha'] = REPORT_GLOBAL['first_language'].coltitle_isha;
			coltitle['isha_iqamat'] = REPORT_GLOBAL['first_language'].coltitle_isha_iqamat;
			coltitle['midnight'] = REPORT_GLOBAL['first_language'].coltitle_midnight;
			coltitle['notes'] = REPORT_GLOBAL['first_language'].coltitle_notes;
		}
		else{
			coltitle['day'] = REPORT_GLOBAL['second_language'].coltitle_day;
			coltitle['weekday'] = REPORT_GLOBAL['second_language'].coltitle_weekday;
			coltitle['weekday_tr'] = '';
			if (calendartype == 'GREGORIAN') {
				coltitle['caltype'] = REPORT_GLOBAL['second_language'].coltitle_caltype_hijri;
			} else {
				coltitle['caltype'] = REPORT_GLOBAL['second_language'].coltitle_caltype_gregorian;
			}
			coltitle['imsak'] = REPORT_GLOBAL['second_language'].coltitle_imsak;
			coltitle['fajr'] = REPORT_GLOBAL['second_language'].coltitle_fajr;
			coltitle['fajr_iqamat'] = REPORT_GLOBAL['second_language'].coltitle_fajr_iqamat;
			coltitle['sunrise'] = REPORT_GLOBAL['second_language'].coltitle_sunrise;
			coltitle['dhuhr'] = REPORT_GLOBAL['second_language'].coltitle_dhuhr;
			coltitle['dhuhr_iqamat'] = REPORT_GLOBAL['second_language'].coltitle_dhuhr_iqamat;
			coltitle['asr'] = REPORT_GLOBAL['second_language'].coltitle_asr;
			coltitle['asr_iqamat'] = REPORT_GLOBAL['second_language'].coltitle_asr_iqamat;
			coltitle['sunset'] = REPORT_GLOBAL['second_language'].coltitle_sunset;
			coltitle['maghrib'] = REPORT_GLOBAL['second_language'].coltitle_maghrib;
			coltitle['maghrib_iqamat'] = REPORT_GLOBAL['second_language'].coltitle_maghrib_iqamat;
			coltitle['isha'] = REPORT_GLOBAL['second_language'].coltitle_isha;
			coltitle['isha_iqamat'] = REPORT_GLOBAL['second_language'].coltitle_isha_iqamat;
			coltitle['midnight'] = REPORT_GLOBAL['second_language'].coltitle_midnight;
			coltitle['notes'] = REPORT_GLOBAL['second_language'].coltitle_notes;
		}
		};
	return coltitle;
}
const isToday = (checkdate) => {
    let today = new Date();
    return (checkdate.getMonth() == today.getMonth()) && 
            (checkdate.getDate() == today.getDate()) && 
            (checkdate.getFullYear() == today.getFullYear());
}
const set_prayer_method = async(ui) => {
	return new Promise( (resolve, reject) => {
		/* see more in PrayTimes module
		original
		// Calculation Methods
		methods = {
			MWL: {
				name: 'Muslim World League',
				params: { fajr: 18, isha: 17 } },
			ISNA: {
				name: 'Islamic Society of North America (ISNA)',
				params: { fajr: 15, isha: 15 } },
			Egypt: {
				name: 'Egyptian General Authority of Survey',
				params: { fajr: 19.5, isha: 17.5 } },
			Makkah: {
				name: 'Umm Al-Qura University, Makkah',
				params: { fajr: 18.5, isha: '90 min' } },  // fajr was 19 degrees before 1430 hijri
			Karachi: {
				name: 'University of Islamic Sciences, Karachi',
				params: { fajr: 18, isha: 18 } },
			Tehran: {
				name: 'Institute of Geophysics, University of Tehran',
				params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' } },  // isha is not explicitly specified in this method
			Jafari: {
				name: 'Shia Ithna-Ashari, Leva Institute, Qum',
				params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' } }
		},
		modified here with more methods that are saved in database and will look like this:
		
		app_common.APP_GLOBAL['module_praytimes_methods'] = {
			ALGERIAN: {
				name: 'Algerian Ministry of Religious Affairs and Wakfs',
				params: { fajr: 18, isha: 17 } },
			DIYANET: {
				name: 'Diyanet İşleri Başkanlığı',
				params: { fajr: 18, isha: 17 } },
			EGYPT: {
				name: 'Egyptian General Authority of Survey',
				params: { fajr: 19.5, isha: 17.5 } },
			EGYPTBIS: {
				name: 'Egyptian General Authority of Survey Bis',
				params: { fajr: 20, isha: 18 } },
			FRANCE15: {
				name: 'French15',
				params: { fajr: 15, isha: 15 } },
			FRANCE18: {
				name: 'French18',
				params: { fajr: 18, isha: 18 } },
			GULF: {
				name: 'Gulf region',
				params: { fajr: 19.5, isha: '90 min' } },
			KARACHI: {
				name: 'University of Islamic Sciences, Karachi',
				params: { fajr: 18, isha: 18 } },
			KEMENAG: {
				name: 'Kementerian Agama Republik Indonesia',
				params: { fajr: 20, isha: 18 } },
			ISNA: {
				name: 'Islamic Society of North America (ISNA)',
				params: { fajr: 15, isha: 15 } },
			JAFARI: {
				name: 'Shia Ithna-Ashari, Leva Institute, Qum',
				params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' } },
			JAKIM: {
				name: 'Jabatan Kemajuan Islam Malaysia',
				params: { fajr: 20, isha: 18} },
			MAKKAH: {
				name: 'Umm Al-Qura University, Makkah',
				params: { fajr: 18.5, isha: '90 min' } },  // fajr was 19 degrees before 1430 hijri
			MUIS: {
				name: 'Majlis Ugama Islam Singapura',
				params: { fajr: 20, isha: 18 } },	
			MWL: {
				name: 'Muslim World League',
				params: { fajr: 18, isha: 17 } },
			TUNISIA: {
				name: 'Tunisian Ministry of Religious Affairs',
				params: { fajr: 18, isha: 18 } },
			TEHRAN: {
				name: 'Institute of Geophysics, University of Tehran',
				params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' } },  // isha is not explicitly specified in this method
			UOIF: {
				name: 'Union des Organisations Islamiques de France',
				params: { fajr: 12, isha: 12 } }
		};
		*/

		let isha;
		let maghrib;
		let midnight;
		const set_prayer_value = (isha_data, maghrib_data, midnight_data) => {
			//first two parameters always have values		
			//check if integer or number with decimal 
			if (/^\d+$/.test(isha_data) ||
				/^\d+\.\d+$/.test(isha_data)){
				//do not convert
				isha = `"isha": ${isha_data}`;
			}			
			else{
				isha = `"isha": "${isha_data}"`;
			}
			//show only maghrib if there is a value
			if (common.get_null_or_value(maghrib_data) != '')
				maghrib = `,"maghrib": ${maghrib_data}`;
			else
				maghrib = '';
			//show only midnight if there is a value
			if (common.get_null_or_value(midnight_data) != '')
				midnight = `,"midnight": "${midnight_data}"`;
			else
				midnight = '';
		}
		app_common.APP_GLOBAL['module_praytimes_methods'] = '';
		let praytime_methods = '';
		if (ui==true){
			//called from app where there is a DOM select
			let methods = document.getElementById('setting_select_method');
			for (let i=0;i <methods.options.length;i++){
				set_prayer_value(methods[i].getAttribute('data3'),
								methods[i].getAttribute('data4'),
								methods[i].getAttribute('data5'));
				if (praytime_methods!='')
					praytime_methods += ',';
				praytime_methods += `"${methods[i].value.toUpperCase()}":{
										"name":  "${methods[i].text}",
										"params": { "fajr": ${methods[i].getAttribute('data2')},
												${isha}
												${maghrib}
												${midnight}
												}
									}`;
			}	
			praytime_methods = `{${praytime_methods}}`;
			app_common.APP_GLOBAL['module_praytimes_methods']=JSON.parse(praytime_methods);
			resolve();
		}
		else{
			//called from report
			common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/setting?setting_type=METHOD`,
						'GET', 0, null, null, null, (err, result) =>{
				if (err)
					reject(err);
				else{
					let json = JSON.parse(result);
					for (let i=0;i <json.settings.length;i++){
						set_prayer_value(json.settings[i].data3,
										json.settings[i].data4,
										json.settings[i].data5);
						if (praytime_methods!='')
							praytime_methods += ',';
						praytime_methods += `"${json.settings[i].data.toUpperCase()}":{
												"name":  "${json.settings[i].text}",
												"params": { "fajr": ${json.settings[i].data2},
														${isha}
														${maghrib}
														${midnight}
														}
											}`;
					}
					praytime_methods = `{${praytime_methods}}`;
					app_common.APP_GLOBAL['module_praytimes_methods']=JSON.parse(praytime_methods);
					resolve();
				}
			})
		}
	})
}

//check if day is ramadan day
const is_ramadan_day = (year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adj) => {
	let options_calendartype = {timeZone: timezone,
								month: 'numeric'};
	if (calendartype=='GREGORIAN'){
		let date_temp = new Date(year,month,day);
		date_temp.setDate(date_temp.getDate() + parseInt(hijri_adj));
		date_temp = date_temp.toLocaleDateString(REPORT_GLOBAL['regional_def_calendar_lang'] + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_calendar'] + calendar_hijri_type + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + REPORT_GLOBAL['regional_def_calendar_number_system'], options_calendartype);
		if (date_temp==9)
			return true;
	}
	else{
		if (month==9)
			return true;
	}
	return false;
}

const setMethod_praytimes = (prayTimes, settings_method, settings_asr, settings_highlat) => {
	prayTimes.setMethod(settings_method);
	//use methods without modifying original code
	if (app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.maghrib && 
		app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.midnight)
		prayTimes.adjust( { asr:      settings_asr,
							highLats: settings_highlat,
							fajr:     app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.fajr,
							isha:     app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.isha,
							maghrib:  app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.maghrib,
							midnight: app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.midnight} );
	else
		if (app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.maghrib)
			prayTimes.adjust( { asr:      settings_asr,
								highLats: settings_highlat,
								fajr:     app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.fajr,
								isha:     app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.isha,
								maghrib:  app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.maghrib} );
		else
			if (app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.midnight)
				prayTimes.adjust( { asr:      settings_asr,
									highLats: settings_highlat,
									fajr:     app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.fajr,
									isha:     app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.isha,
									midnight: app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.midnight} );
			else
				prayTimes.adjust( { asr:      settings_asr,
									highLats: settings_highlat,
									fajr:     app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.fajr,
									isha:     app_common.APP_GLOBAL['module_praytimes_methods'][settings_method].params.isha} );
}
//header and footer style
const getstyle = (img_src, align) => {
	let style='';
		if (fileisloaded(img_src))
		 	style = 'background-image:url("' + img_src +'");';
		style +=  'text-align:' + align;
		return style;
}
const fileisloaded = (image_item_src) => {
    if (image_item_src == '')
        return false;
    else
        return true;
}
const convertnumberlocale = (numberstring, splitcharacter, locale) => {
    let left = Number((numberstring).substr(0, (numberstring).indexOf(splitcharacter))).toLocaleString(locale);
    let right;
    let suffix;
    //check if suffix is added
    if (numberstring.substr(numberstring.length - 2) == 'am' ||
        numberstring.substr(numberstring.length - 2) == 'pm') {
        suffix = numberstring.substr(numberstring.length - 3);
        //convert except the last suffix part
        right = Number(numberstring.substr(numberstring.indexOf(splitcharacter) + 1, 2)).toLocaleString(locale);
    } else {
        right = Number(numberstring.substr(numberstring.indexOf(splitcharacter) + 1)).toLocaleString(locale);
        suffix = '';
    }
    //cant compare arab number with latin numbers, check length instead
    if (right.length == 1)
        return left + splitcharacter + (0).toLocaleString(locale) + right + suffix;
    else
        return left + splitcharacter + right + suffix;
}
//show column with correct class and correct format
//for both day and month timetable
const show_col = (timetable, col, year, month, day, calendartype, show_fast_start_end, timezone, calendar_hijri_type, hijri_adjustment, locale, number_system, value) => {

	let display_value = convertnumberlocale(value.toString(), ':', locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + number_system);
	if (((show_fast_start_end=='1' && col=='fajr') ||
		(show_fast_start_end=='2' && col=='imsak') ||
		(show_fast_start_end=='3' && col=='fajr') ||
		(show_fast_start_end=='4' && col=='imsak')) &&
		is_ramadan_day(year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adjustment)){
		if (timetable==0)
			return `<div class='timetable_month_data_col timetable_data_fast_start'>${display_value}</div>`;
		if (timetable==1)
			return `<div class="timetable_data_fast_start">${display_value}</div>`;
		}
	else
		if (((show_fast_start_end=='1' && col=='maghrib') ||
			(show_fast_start_end=='2' && col=='maghrib') ||
			(show_fast_start_end=='3' && col=='isha') ||
			(show_fast_start_end=='4' && col=='isha')) && 
			is_ramadan_day(year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adjustment)){
			if (timetable==0)
				return `<div class='timetable_month_data_col timetable_data_fast_end'>${display_value}</div>`;
			if (timetable==1)
				return `<div class="timetable_data_fast_end">${display_value}</div>`;
			}
		else{
			if (col=='sunrise'){
				if (timetable==0)
					return `<div class='timetable_month_data_col timetable_month_data_sunrise'>${display_value}</div>`;
				if (timetable==1)
					return `<div>${display_value}</div>`;
				}
			else{
				if (timetable==0)
					return `<div class='timetable_month_data_col'>${display_value}</div>`;
				if (timetable==1)
					return `<div>${display_value}</div>`;
				}
			}
}
const timetable_headers = (reporttype, items, settings) => {
	let html ='';
	if (settings.coltitle=='0' || settings.coltitle=='1'){
		//add transliterated column titles	
		if (reporttype==0)
			html += create_day_title_row(getColumnTitles(1, settings.calendartype, settings.locale, null, settings.locale), 
										 settings.show_imsak, settings.show_sunset, settings.show_midnight);
		else
			if (reporttype==1)
				html += `<div class='timetable_month_data_row timetable_month_data_header_row'>
							${makeTableRow(getColumnTitles(1, settings.calendartype, settings.locale, null, settings.locale), 
										   items, 0, null,null, settings)}
						</div>`;
		if (settings.coltitle=='1'){
			//add translated column titles
			if (reporttype==0)
				html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, settings.locale), 
											 settings.show_imsak, settings.show_sunset, settings.show_midnight);
			else
				if (reporttype==1)
				html += `<div class='timetable_month_data_row timetable_month_data_header_row'>
							${makeTableRow(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, settings.locale), 
										   items, 0, null,null, settings)}
						</div>`;
		}
	}
	else
		if (settings.coltitle=='2' || settings.coltitle=='3'){
			//add translated column titles
			if (reporttype==0)
				html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, settings.locale), 
											 settings.show_imsak, settings.show_sunset, settings.show_midnight);
			else
				if (reporttype==1)
					html += `<div class='timetable_month_data_row timetable_month_data_header_row'>
								${makeTableRow(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, settings.locale), 
											   items, 0, null,null, settings)}
							</div>`;

			if (settings.coltitle=='2'){
				//add transliterated column titles
				if (reporttype==0)
					html += create_day_title_row(getColumnTitles(1, settings.calendartype, settings.locale, null, settings.locale), 
											     settings.show_imsak, settings.show_sunset, settings.show_midnight);
				else
					if (reporttype==1)
						html += `<div class='timetable_month_data_row timetable_month_data_header_row'>
									${makeTableRow(getColumnTitles(1, settings.calendartype, settings.locale, null, settings.locale), 
												   items, 0, null,null, settings)}
								</div>`;
			}
		}
	if (settings.second_locale!='0'){
		//show second locale except weekdays, they are already displayed on first header row
		if (reporttype==0)
			html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.second_locale, '', settings.locale), 
										 settings.show_imsak, settings.show_sunset, settings.show_midnight);
		else
			if (reporttype==1){
				let second_locale_titles = getColumnTitles(0, settings.calendartype, settings.second_locale, '', settings.locale);
				second_locale_titles['weekday']='';
				second_locale_titles['weekday_tr']='';
				html += `<div class='timetable_month_data_row timetable_month_data_header_row'>
								${makeTableRow(second_locale_titles, items, 0, null,null, settings)}
						</div>`;
			}
	}
	return html;
}
/*----------------------- */
/* COMMON APP & REPORT    */
/* TIMETABLE MONTH & YEAR */
/*----------------------- */
//calculate Iqamat
const calculateIqamat = (option, calculated_time) => {
	let add_minutes;
	let return_value;
	let timeString;
	let suffix;
	//ex calculated_time argument = '5:59'
	if (calculated_time.substr(calculated_time.length-2)=='am' || 
		calculated_time.substr(calculated_time.length-2)=='pm'){
		suffix = calculated_time.substr(calculated_time.length-3);
		timeString = calculated_time.substr(0,calculated_time.length-3).split(':');
	}
	else{
		suffix = '';
		timeString = calculated_time.split(':');
	}
	switch (option){
		//0 = do not display iqamat column
		case '0': {return_value = null; break;}
		//1-5 add minutes
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':{
			switch (option){
				case '1': {add_minutes = 10;break;}
				case '2': {add_minutes = 15;break;}
				case '3': {add_minutes = 20;break;}
				case '4': {add_minutes = 25;break;}
				case '5': {add_minutes = 30;break;}
			}
			let datetime = new Date(1970, 1, 1, timeString[0], timeString[1]);
			let newDateObj = new Date(datetime.getTime() + add_minutes*60000);
			return_value = newDateObj.getHours() + ':' + (newDateObj.getMinutes()<10?'0':'') + newDateObj.getMinutes();
			break;
		}
		//calculate next hour, hour + 15 or hour + 30 
		case '6':
		case '7':
		case '8':{
			switch (option){
				//calculate next hour
				case '6':{add_minutes = 0;break;}
				//calculate next hour + 15 min
				case '7':{add_minutes = 15;break;}
				//calculate next hour + 30 min
				case '8':{add_minutes = 30;break;}
			}
			let datetime = new Date(1970, 1, 1, parseInt(timeString[0]) + 1, add_minutes);
			return_value = datetime.getHours() + ':' + (datetime.getMinutes()<10?'0':'') + datetime.getMinutes();
			break;
		}
	}
	return return_value + suffix;
}
// make a timetable month row
const makeTableRow = (data, items, timerow, year, month, settings, date) => {

	let options_weekday = {weekday:'long'};
	let options_calendartype = {timeZone: settings.timezone, 
								dateStyle: 'short'};
	let iqamat;
	let html='';
	for (let i in items) {
		iqamat = '';
		//Check if column should be displayed
		if ( (i=='weekday' && (settings.show_weekday =='NO' || settings.reporttype_year_month =='YEAR'))||
				(i=='weekday_tr' && ((settings.second_locale =='0' ||
									settings.show_weekday =='NO') || settings.reporttype_year_month =='YEAR'))||
				(i=='caltype' && (settings.show_calendartype =='NO' || settings.reporttype_year_month =='YEAR'))||
				(i=='imsak' && (settings.show_imsak =='NO' || settings.reporttype_year_month =='YEAR'))||
				(i=='fajr_iqamat' && (settings.iqamat_fajr =='0' || settings.reporttype_year_month =='YEAR'))||
				(i=='dhuhr_iqamat' && (settings.iqamat_dhuhr=='0' || settings.reporttype_year_month =='YEAR'))||
				(i=='asr_iqamat' && (settings.iqamat_asr=='0' || settings.reporttype_year_month =='YEAR'))||
				(i=='maghrib_iqamat' && (settings.iqamat_maghrib=='0' || settings.reporttype_year_month =='YEAR'))||
				(i=='isha_iqamat' && (settings.iqamat_isha=='0' || settings.reporttype_year_month =='YEAR'))||
				(i=='sunset' && (settings.show_sunset =='NO' || settings.reporttype_year_month =='YEAR'))||
				(i=='midnight' && (settings.show_midnight =='NO' || settings.reporttype_year_month =='YEAR'))||
				(i=='notes' && (settings.show_notes =='NO' || settings.reporttype_year_month =='YEAR')))
			null;
		else{
			if (parseInt(timerow)==0){
				//header column
				html += `<div class='timetable_month_data_header_col'>${data[i]}</div>`;
			}
			else{
				switch(i){
				case 'caltype':{
					if (settings.calendartype=='GREGORIAN'){
						let date_temp = new Date(year,month,data['day']);
						date_temp.setDate(date_temp.getDate() + parseInt(settings.hijri_adj));
						html += `<div class='timetable_month_data_col timetable_month_data_calendartype'>${date_temp.toLocaleDateString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_calendar'] + settings.calendar_hijri_type + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system, options_calendartype)}</div>`;
					}
					else{							
						html += `<div class='timetable_month_data_col timetable_month_data_calendartype	'>${new Date(date[0],date[1]-1,date[2]).toLocaleDateString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_calendar'] + REPORT_GLOBAL['regional_def_calendar_type_greg'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system, options_calendartype)}</div>`;							
					}
					break;
					}
				case 'day':
					html += `<div class='timetable_month_data_col'>${data[i].toLocaleString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system)}</div>`;
					break;
				case 'weekday':
				case 'weekday_tr':{
					if (settings.calendartype=='GREGORIAN'){
						let date_temp = new Date(year,month,data['day']);
						date_temp.setDate(date_temp.getDate() + parseInt(settings.hijri_adj));
						html += `<div class='timetable_month_data_col timetable_month_data_date'>${date_temp.toLocaleDateString(i=='weekday'?settings.locale:settings.second_locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_calendar'] + settings.calendar_hijri_type, options_weekday)}</div>`;
						}
					else{							
						html += `<div class='timetable_month_data_col timetable_month_data_date'>${new Date(date[0],date[1]-1,date[2]).toLocaleDateString(i=='weekday'?settings.locale:settings.second_locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_calendar'] + REPORT_GLOBAL['regional_def_calendar_type_greg'], options_weekday)}</div>`;
					}
					break;
					}
				case 'fajr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_fajr, data['fajr']);
					html += `<div class='timetable_month_data_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system)}</div>`;
					break;
					}
				case 'dhuhr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_dhuhr, data['dhuhr']);
					html += `<div class='timetable_month_data_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system)}</div>`;
					break;
					}
				case 'asr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_asr, data['asr']);
					html += `<div class='timetable_month_data_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system)}</div>`;
					break;
					}
				case 'maghrib_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_maghrib, data['maghrib']);
					html += `<div class='timetable_month_data_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system)}</div>`;
					break;                    
					}
				case 'isha_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_isha, data['isha']);
					html += `<div class='timetable_month_data_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system)}</div>`;
					break;
					}
				case 'notes':{
					html += `<div class='timetable_month_data_col timetable_month_data_notes'>${'<input type="text">'}</div>`;
					break;
					}
				default:{
					html += show_col(0, i, year, month, data['day'], settings.calendartype, settings.show_fast_start_end, settings.timezone, settings.calendar_hijri_type, settings.hijri_adj, settings.locale, settings.number_system, data[i]);
					break;
					}
				}
			}
		}
	}
	return html;
}
// display timetable month
const displayMonth = async (prayTimes, settings, item_id) => {
	return new Promise((resolve, reject) => {
		let timetable = document.createElement('div');
		let month;
		let year;
		let title;
		let month_html='';
		let header_style ='';
		let footer_style ='';
			
		const set_month_year_title = () => {
			let options;
			switch (settings.reporttype_year_month){
				case 'MONTH':{
					options = {month:'long', year: 'numeric'};
					break;
					}
				case 'YEAR':{
					options = {month:'long'};
					break;
					}
			}	
			if (settings.calendartype=='GREGORIAN'){
				//get previous or next Gregorian month using current Gregorian month
				if (item_id == settings.ui_navigation_left){
					app_common.APP_GLOBAL['session_currentDate'].setMonth(app_common.APP_GLOBAL['session_currentDate'].getMonth() -1);
				}
				else 
					if (item_id == settings.ui_navigation_right){
						app_common.APP_GLOBAL['session_currentDate'].setMonth(app_common.APP_GLOBAL['session_currentDate'].getMonth() +1);
						}
				month = app_common.APP_GLOBAL['session_currentDate'].getMonth();
				year = app_common.APP_GLOBAL['session_currentDate'].getFullYear();
				title = new Date(year,month,1).toLocaleDateString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system, options).toLocaleUpperCase();
			}
			else
				if (settings.calendartype=='HIJRI'){
					//get previous or next Hijri month using current Hijri month  
					if (item_id == settings.ui_navigation_left){
						if (app_common.APP_GLOBAL['session_CurrentHijriDate'][0] ==1){
							app_common.APP_GLOBAL['session_CurrentHijriDate'][0] = 12;
							app_common.APP_GLOBAL['session_CurrentHijriDate'][1] = app_common.APP_GLOBAL['session_CurrentHijriDate'][1] - 1;
						}
						else
							app_common.APP_GLOBAL['session_CurrentHijriDate'][0] = app_common.APP_GLOBAL['session_CurrentHijriDate'][0] - 1;
					}
					else 
						if (item_id == settings.ui_navigation_right){
							if (app_common.APP_GLOBAL['session_CurrentHijriDate'][0] ==12){
								app_common.APP_GLOBAL['session_CurrentHijriDate'][0] = 1;
								app_common.APP_GLOBAL['session_CurrentHijriDate'][1] = app_common.APP_GLOBAL['session_CurrentHijriDate'][1] + 1;
							}
							else
								app_common.APP_GLOBAL['session_CurrentHijriDate'][0] = app_common.APP_GLOBAL['session_CurrentHijriDate'][0] + 1;
						}	
					month = app_common.APP_GLOBAL['session_CurrentHijriDate'][0];
					year  = app_common.APP_GLOBAL['session_CurrentHijriDate'][1];
					let title_date = common.getGregorian(new Array(year,month,1), 0)
					title = new Date(title_date[0],title_date[1]-1,title_date[2]).toLocaleDateString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_calendar'] + settings.calendar_hijri_type + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system, options).toLocaleUpperCase();
				}
		}
		let items = getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, settings.locale);
		let month_data_class='';
		if (settings.number_system=='hanidec')
			month_data_class = 'default_font bignumbers';
		else
			month_data_class = 'default_font';
		set_month_year_title();

		//TIMETABLE
		//add default class, theme class and font class		
		timetable.classList = settings.timetable_class + ' ' + 
							  settings.timetable_month + ' ' + 
							  settings.theme_month + ' ' +
							  settings.arabic_script;
		//HEADER
		if (settings.reporttype_year_month =='MONTH'){
			//set only id for month timetable, not year
			timetable.id = settings.ui_timetable_month_id;
			//Set direction
			//set LTR or RTL on table layout if MONTH, on YEAR direction is set on the whole year layout
			timetable.style.direction = settings.direction;
	
			header_style = getstyle(settings.header_img_src, settings.header_align);
			footer_style = getstyle(settings.footer_img_src, settings.footer_align);
	
			month_html +=
				`<div id='timetable_header' class='display_font' style='${header_style}'>
					<div >${settings.header_txt1}</div>
					<div >${settings.header_txt2}</div>
					<div >${settings.header_txt3}</div>
					<div id='timetable_qr_code'></div>
				</div>`;
		}

		//HEADER DATA
		month_html+=
		`<div id='timetable_month_data_header' class='display_font'>
			<div id='timetable_month_data_header_title1'>${title}</div>
			<div id='timetable_month_data_header_title2'>${REPORT_GLOBAL['first_language'].timetable_title} ${settings.second_locale!=0?REPORT_GLOBAL['second_language'].timetable_title:''}</div>
		</div>
		<div id='timetable_month_data' class='${month_data_class}'>
			${timetable_headers(1, items, settings)}`;
		
		// get start date and end date for both gregorian and hijri
		let date;
		let endDate;
		let date_hijri = null;
		let endDate_hijri = null;
		if (settings.calendartype=='GREGORIAN'){
			date = new Date(year, month, 1);
			endDate = new Date(year, month+ 1, 1);
			}
		else
			if (settings.calendartype=='HIJRI'){
				date_hijri = new Array(year,month,1);
				if (month == 12)
					endDate_hijri = new Array((year + 1), 1,1);
				else
					endDate_hijri = new Array(year,(month + 1),1);
				date = common.getGregorian(date_hijri, settings.hijri_adj);
				date = new Date(date[0], date[1]-1, date[2]);
				endDate = common.getGregorian(endDate_hijri, settings.hijri_adj);
				endDate = new Date(endDate[0], endDate[1]-1, endDate[2]);
			}
		setMethod_praytimes(prayTimes, settings.method, settings.asr, settings.highlat);
		regional.getTimezoneOffset(settings.timezone).then((timezone_offset) => {
			//DATA
			while (date < endDate) {
				let times = prayTimes.getTimes(date, [settings.gps_lat, settings.gps_long], parseInt(timezone_offset), 0, settings.format);
				if (settings.calendartype=='GREGORIAN')
					times.day = date.getDate();
				else
					times.day = ++date_hijri[2] - 1;
				let row_class='';
				//check if today
				if (isToday(date))
					row_class = 'timetable_month_data_today_row ';
				//check if row should be highlighted
				switch (settings.highlight){
				case '1':{
					//check if friday
					if (date.getDay() == 5)
						row_class += 'timetable_month_data_highlight_row ';
					break;
					}
				case '2':{
					//check if saturday
					if (date.getDay() == 6)
						row_class += 'timetable_month_data_highlight_row ';
					break;
					}
				case '3':{
					//check if sunday
					if (date.getDay() == 0)
						row_class += 'timetable_month_data_highlight_row ';
					break;
					}
				case '4':{
					//check if day 1-10
					if (times.day < 11)
						row_class += 'timetable_month_data_day_01-10_row ';
					//check if day 11-20
					if (times.day > 10 && times.day < 21)
						row_class += 'timetable_month_data_day_11-20_row ';
					//check if day 21 - 
					if (times.day > 20)
						row_class += 'timetable_month_data_day_21-30_row ';
					break;
					}
				} 
				if (settings.calendartype=='HIJRI'){
					let display_date = common.getGregorian(new Array(year,month,times['day']), settings.hijri_adj);
					month_html += `<div class='${'timetable_month_data_row ' + row_class}'>
										${makeTableRow(times, items, 1, year, month, settings, display_date)}
								   </div>`;
				}
				else
					month_html += `<div class='${'timetable_month_data_row ' + row_class}'>
										${makeTableRow(times, items, 1, year, month, settings)}
								   </div>`;
				date.setDate(date.getDate()+ 1);
			}
			//FOOTER
			month_html += '</div>';
			if (settings.reporttype_year_month =='MONTH'){
				month_html +=
				`<div id='timetable_month_data_footer' class='default_font'>
					<div id='timetable_month_data_footer_row'>
						<div id='timetable_footer_col'>
							<div >${settings.place}</div>
							${settings.show_gps == 'YES'?
								`
								<div >${REPORT_GLOBAL['first_language'].gps_lat_text}</div>
								<div >${settings.gps_lat.toLocaleString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system)}</div>
								<div >${REPORT_GLOBAL['first_language'].gps_long_text}</div>
								<div >${settings.gps_long.toLocaleString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system)}</div>`
								:''}
							${settings.show_timezone == 'YES'?
								`<div >${REPORT_GLOBAL['first_language'].timezone_text}</div>
								<div >${settings.timezone}</div>`
								:''}
							<div class='copyright'>${app_common.APP_GLOBAL['app_copyright']}</div>
						</div>
					</div>
				</div>
				<div id='timetable_footer' class='display_font' style='${footer_style}'>
					<div>${settings.footer_txt1}</div>
					<div>${settings.footer_txt2}</div>
					<div>${settings.footer_txt3}</div>
				</div>`;
			}	
			timetable.innerHTML = month_html;
			resolve(timetable);
		});
	})
}
/*----------------------- */
/* COMMON APP & REPORT    */
/* TIMETABLE DAY          */
/*----------------------- */

//row for day timetable
const create_day_title_row = (col_titles, show_imsak, show_sunset, show_midnight) => {
	return `<div class='timetable_day_timetable_header_row'>
				${show_imsak=='YES'?`<div>${col_titles['imsak']}</div>`:''}
				${`<div>${col_titles['fajr']}</div>`}
				${`<div>${col_titles['sunrise']}</div>`}
				${`<div>${col_titles['dhuhr']}</div>`}
				${`<div>${col_titles['asr']}</div>`}
				${show_sunset=='YES'?`<div>${col_titles['sunset']}</div>`:''}
				${`<div>${col_titles['maghrib']}</div>`}
				${`<div>${col_titles['isha']}</div>`}
				${show_midnight=='YES'?`<div>${col_titles['midnight']}</div>`:''}
			</div>`;
}

const displayDay = async (prayTimes, settings, item_id, user_settings) => {
	return new Promise((resolve, reject) => {
		let timetable = document.createElement('div');
		timetable.id = settings.ui_timetable_day_id;
		let day_html='';
		let times; 
		let options = { timeZone: settings.timezone, 
						weekday: 'long', 
						year: 'numeric', 
						month: 'long', 
						day: 'numeric'};
		let options_hijri = { timeZone: settings.timezone, 
						year: 'numeric', 
						month: 'long', 
						day: 'numeric'};
						
		
		if (item_id == settings.ui_navigation_left){
			app_common.APP_GLOBAL['session_currentDate'].setDate(app_common.APP_GLOBAL['session_currentDate'].getDate() -1);
		}
		else 
			if (item_id == settings.ui_navigation_right){
				app_common.APP_GLOBAL['session_currentDate'].setDate(app_common.APP_GLOBAL['session_currentDate'].getDate() +1);
				}

		let date_current = new Date(app_common.APP_GLOBAL['session_currentDate'].getFullYear(),app_common.APP_GLOBAL['session_currentDate'].getMonth(),app_common.APP_GLOBAL['session_currentDate'].getDate());
		let date_title4 = date_current.toLocaleDateString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system, options).toLocaleUpperCase();
		date_current.setDate(date_current.getDate() + parseInt(settings.hijri_adj));
		let date_title5 = date_current.toLocaleDateString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_calendar'] + settings.calendar_hijri_type + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system, options_hijri).toLocaleUpperCase();
		
		//Set theme and font classes on main div
		timetable.classList = settings.timetable_class + ' ' + settings.theme_day + ' ' + settings.arabic_script;
		//set LTR or RTL on table layout
		timetable.style.direction = settings.direction;

		let header_style = getstyle(settings.header_img_src, settings.header_align);
		let footer_style = getstyle(settings.footer_img_src, settings.footer_align);

		day_html += `<div id='timetable_header' class='display_font' style='${header_style}'>
						<div >${settings.header_txt1}</div>
						<div >${settings.header_txt2}</div>
						<div >${settings.header_txt3}</div>
						<div id='timetable_qr_code'></div>
					</div>`
		
		day_html +=`<div id='timetable_day_timetable_header' class='display_font'>
						<div>${date_title4}</div>
						<div>${date_title5}</div>
					</div>
					<div id='timetable_day_timetable' class='default_font'>
			${timetable_headers(0, null, settings)}`;
		
		const day_timetable = (user_locale, user_timezone, user_number_system, user_calendar_hijri_type,
			user_gps_latitude, user_gps_longitude, user_format, user_hijri_adjustment, user_place) => {
				regional.getTimezoneOffset(user_timezone).then((timezone_offset) => {
					tot_day_async_html++;
					times = prayTimes.getTimes(app_common.APP_GLOBAL['session_currentDate'], [user_gps_latitude, user_gps_longitude], parseInt(timezone_offset), 0, user_format);				
					let col_imsak = settings.show_imsak == 'YES'?show_col(1, 'imsak', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment,user_locale, user_number_system, times['imsak']):''; 
					let col_fajr = show_col(1, 'fajr', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['fajr']);
					let col_sunrise = show_col(1, 'sunrise', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['sunrise']);
					let col_dhuhr = show_col(1, 'dhuhr', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['dhuhr']);
					let col_asr = show_col(1, 'asr', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['asr']);
					let col_sunset = settings.show_sunset == 'YES'?show_col(1, 'sunset', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment,user_locale, user_number_system, times['sunset']):'';
					let col_maghrib = show_col(1, 'maghrib', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['maghrib']);
					let col_isha = show_col(1, 'isha', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['isha']);
					let col_midnight = settings.show_midnight == 'YES'? show_col(1, 'midnight', app_common.APP_GLOBAL['session_currentDate'].getFullYear(), app_common.APP_GLOBAL['session_currentDate'].getMonth(), app_common.APP_GLOBAL['session_currentDate'].getDate(), 'GREGORIAN', settings.show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['midnight']):'';
					//set css variable to calculate grid columns and font size depending how many columns used
					let day_columns = 6;
					if (settings.show_imsak == 'YES')
						day_columns++;
					if (settings.show_sunset == 'YES')
						day_columns++;
					if (settings.show_midnight == 'YES')
						day_columns++;
					document.querySelector(':root').style.setProperty('--app_day_columns', day_columns);

					day_html +=
						`<div class='timetable_day_timetable_row_data ${isToday(date_current)==true?'timetable_day_today_row':''}'>
							${col_imsak}${col_fajr}${col_sunrise}${col_dhuhr}${col_asr}${col_sunset}${col_maghrib}${col_isha}${col_midnight}
						</div>
						<div class='timetable_day_timetable_footer'>
							<div class='timetable_day_timetable_footer_row'>
								<div>${user_place}</div>
								<div>${settings.show_gps == 'YES' ? REPORT_GLOBAL['first_language'].gps_lat_text:''}</div>
								<div>${settings.show_gps == 'YES' ? user_gps_latitude.toLocaleString(user_locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + user_number_system):''}</div>
								<div>${settings.show_gps == 'YES' ? REPORT_GLOBAL['first_language'].gps_long_text:''}</div>
								<div>${settings.show_gps == 'YES' ? user_gps_longitude.toLocaleString(user_locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + user_number_system):''}</div>
							</div>
							${settings.show_timezone == 'YES'?`<div class='timetable_day_timetable_footer_row'>
																<div class='timetable_day_current_time'></div>
																<div class='timetable_day_timezone'>${REPORT_GLOBAL['first_language'].timezone_text + ' ' + user_timezone}</div>
															</div>`:''}
						</div>`;
					if (tot_day_async_html==user_settings.length){
						//Footer
						day_html += 
						`</div>
						<div class='copyright'>${app_common.APP_GLOBAL['app_copyright']}</div>
						<div id='timetable_footer' class='display_font' style='${footer_style}'>
							<div>${settings.footer_txt1}</div>
							<div>${settings.footer_txt2}</div>
							<div>${settings.footer_txt3}</div>
							<div></div>
						</div>
						<div id='timetable_day_time' class='default_font'>
						</div>`;
						timetable.innerHTML = day_html;
						resolve(timetable);
					}
				})
		}
		let tot_day_async_html = 0;
		for (let i=0;i<=user_settings.length-1;i++){	
			setMethod_praytimes(prayTimes, 
								user_settings[i].prayer_method, 
								user_settings[i].prayer_asr_method, 
								user_settings[i].prayer_high_latitude_adjustment);
			
			day_timetable(user_settings[i].regional_language_locale, 
						user_settings[i].regional_timezone, 
						user_settings[i].regional_number_system, 
						user_settings[i].regional_calendar_hijri_type,
						parseFloat(user_settings[i].gps_lat_text), 
						parseFloat(user_settings[i].gps_long_text), 
						user_settings[i].prayer_time_format, 
						user_settings[i].prayer_hijri_date_adjustment, 
						user_settings[i].description);
		}
	})
}
const timetable_day_user_settings_get = async (user_account_id, callBack) => {
	let json;
	let user_settings = [];

	await common.common_fetch(`${common.COMMON_GLOBAL['rest_resource_service']}/db${common.COMMON_GLOBAL['rest_resource_service_db_schema']}/user_account_app_setting/user_account_id/${user_account_id}?`,
					   'GET', 0, null, null, null, (err, result) =>{
		if (err)
			callBack(err, null);
		else{
			json = JSON.parse(result);
			for (let i = 0; i < json.count; i++) {
				//use settings that can be used on a day timetable showing different user settings
				//would be difficult to consider all settings on same page using
				//different texts, images, second languages, directions, column titles, 
				//arabic script, themes or what columns to display, for these use current users setting
				let settings;
                settings = JSON.parse(json.items[i].settings_json);
				user_settings.push(
					{
					"description" : settings.description,
					"regional_language_locale" : settings.regional_language_locale,
					"regional_timezone" : settings.regional_timezone,
					"regional_number_system" : settings.regional_number_system,
					"regional_calendar_hijri_type" : settings.regional_calendar_hijri_type,
					"gps_lat_text" : parseFloat(settings.gps_lat_text),
					"gps_long_text" : parseFloat(settings.gps_long_text),
					"prayer_method" : settings.prayer_method,
					"prayer_asr_method" : settings.prayer_asr_method,
					"prayer_high_latitude_adjustment" : settings.prayer_high_latitude_adjustment,
					"prayer_time_format" : settings.prayer_time_format,
					"prayer_hijri_date_adjustment" : settings.prayer_hijri_date_adjustment
					}
				)
			}
			callBack(null, user_settings)
		}
	})
}
/*----------------------- */
/* COMMON APP & REPORT    */
/* TIMETABLE YEAR         */
/*----------------------- */
const displayYear = async (prayTimes, settings, item_id) => {
	return new Promise((resolve, reject) => {
		let timetable = document.createElement('div');
		timetable.id = settings.ui_timetable_year_id;
		let startmonth            = app_common.APP_GLOBAL['session_currentDate'].getMonth();
		let starthijrimonth       = app_common.APP_GLOBAL['session_CurrentHijriDate'][0];
		let year_html='';
		
		settings.reporttype_year_month        = 'YEAR';
		
		//Set theme and font class
		timetable.classList = settings.timetable_class + ' ' + settings.theme_year + ' ' + settings.arabic_script;
		//set LTR or RTL on year layout
		timetable.style.direction = settings.direction;

		//if both second language and both transliteration and translation columntitles will be shown
		//add class to fix size
		let timetable_class ='';
		let timetable_footer_class ='';
		if (settings.second_locale!='0') {
			//transliteration OR translation
			if (settings.coltitle=='0' || settings.coltitle=='3'){
				timetable_class = 'class="two_columntitles"';
				timetable_footer_class = 'class="default_font two_columntitles"';
			}
			else{
				timetable_class = 'class="three_columntitles"';
				timetable_footer_class = 'class="default_font three_columntitles"';
			}
		}
		else{
			//transliteration and translation are in the column titles
			if (settings.coltitle=='1' || settings.coltitle=='2'){
				timetable_class = 'class="two_columntitles"';
				timetable_footer_class = 'class="default_font two_columntitles"';
			}
		}

		//if item_id is set then navigate previous/next month/year
		if (item_id == settings.ui_navigation_left){
			if (settings.calendartype=='GREGORIAN')
				app_common.APP_GLOBAL['session_currentDate'].setYear(app_common.APP_GLOBAL['session_currentDate'].getFullYear() - 1);
			else
				app_common.APP_GLOBAL['session_CurrentHijriDate'][1] = app_common.APP_GLOBAL['session_CurrentHijriDate'][1] - 1;
		}
		else 
			if (item_id == settings.ui_navigation_right){
				if (settings.calendartype=='GREGORIAN')
					app_common.APP_GLOBAL['session_currentDate'].setYear(app_common.APP_GLOBAL['session_currentDate'].getFullYear() + 1);
				else
					app_common.APP_GLOBAL['session_CurrentHijriDate'][1] = app_common.APP_GLOBAL['session_CurrentHijriDate'][1] + 1;
				}

		let header_style = getstyle(settings.header_img_src, settings.header_align);
		let footer_style = getstyle(settings.footer_img_src, settings.footer_align);

		//timetable header
		//show year with selected locale and number system for both Hijri and Gregorian
		let options_year = { timeZone: settings.timezone, 
							year: 'numeric',
							useGrouping:false};
		let year_title4;
		if (settings.calendartype=='GREGORIAN'){
			year_title4 = app_common.APP_GLOBAL['session_currentDate'].getFullYear();
			year_title4 = year_title4.toLocaleString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system, options_year);
		}
		else{
			//HIJRI
			year_title4 = app_common.APP_GLOBAL['session_CurrentHijriDate'][1];
			year_title4 = year_title4.toLocaleString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system, options_year);
		}
		//timetables
		let months = new Array(12);
		const year_timetable = () => {
			year_html += `<div id='timetable_header' class='display_font' style='${header_style}'>
							<div >${settings.header_txt1}</div>
							<div >${settings.header_txt2}</div>
							<div >${settings.header_txt3}</div>
							<div id='timetable_qr_code'></div>
						</div>`;
			year_html += `	<div id='timetable_year_timetables_header' class='display_font'>
								<div>${year_title4}</div>
								<div>${REPORT_GLOBAL['first_language'].timetable_title} ${settings.second_locale!=0?REPORT_GLOBAL['second_language'].timetable_title:''}</div>
							</div>
							<div id='timetable_year_timetables' ${timetable_class}'>
								<div class='timetable_year_timetables_row'>
									${months[0]}
									${months[1]}
									${months[2]}
									${months[3]}
								</div>
								<div class='timetable_year_timetables_row'>
									${months[4]}
									${months[5]}
									${months[6]}
									${months[7]}
								</div>
								<div class='timetable_year_timetables_row'>
									${months[8]}
									${months[9]}
									${months[10]}
									${months[11]}
								</div>
							</div>
							<div id='timetable_year_timetables_footer' ${timetable_footer_class}'>
								<div id='timetable_year_timetables_footer_row'>
									<div id='timetable_year_timetables_footer_col'>
										<div ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.place}</div>
										<div ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?REPORT_GLOBAL['first_language'].gps_lat_text:''}</div>
										<div ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?settings.gps_lat.toLocaleString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system):''}</div>
										<div ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?REPORT_GLOBAL['first_language'].gps_long_text:''}</div>
										<div ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?settings.gps_long.toLocaleString(settings.locale + REPORT_GLOBAL['regional_def_locale_ext_prefix'] + REPORT_GLOBAL['regional_def_locale_ext_number_system'] + settings.number_system):''}</div>
										<div ${settings.show_timezone == 'YES'?'class=""':'class="hidden"'}>${settings.show_timezone == 'YES'?REPORT_GLOBAL['first_language'].timezone_text:''}</div>
										<div ${settings.show_timezone == 'YES'?'class=""':'class="hidden"'}>${settings.show_timezone == 'YES'?settings.timezone:''}</div>
										<div class='copyright'>${app_common.APP_GLOBAL['app_copyright']}</div>
									</div>
								</div>
							</div>
							<div id='timetable_footer' display_font' style='${footer_style}'>
								<div >${settings.footer_txt1}</div>
								<div >${settings.footer_txt2}</div>
								<div >${settings.footer_txt3}</div>
								<div></div>
							</div>`;
			timetable.innerHTML = year_html;
		
			app_common.APP_GLOBAL['session_currentDate'].setMonth(startmonth);
			app_common.APP_GLOBAL['session_CurrentHijriDate'][0] = starthijrimonth;
			resolve(timetable);
		}
		let month_processed=0;
		for (let monthindex = 1; monthindex <= 12; monthindex++) { 
			if (settings.calendartype=='GREGORIAN')
				app_common.APP_GLOBAL['session_currentDate'].setMonth(monthindex -1);
			else
				app_common.APP_GLOBAL['session_CurrentHijriDate'][0] = monthindex;
			displayMonth(prayTimes, settings, null).then((timetable_result) => {
				month_processed++;
				timetable_result.classList.add(settings.timetable_year_month);
				months[monthindex-1] = timetable_result.outerHTML;
				if (month_processed ==12)
					year_timetable();
			});
		}
	})
}
/*----------------------- */
/* EXCEPTION REPORT       */
/*----------------------- */
const report_exception = (error) => {
	if (typeof error !='undefined' && error !=''){
		//report error
		// hide everything except dialogue message
		let divs = document.body.getElementsByTagName('div');
		for (let i = 0; i < divs.length; i += 1) {
			divs[i].style.visibility ='hidden';
		}
		let message_divs = document.getElementById('common_dialogue_message').getElementsByTagName('div');
		for (let i = 0; i < message_divs.length; i += 1) {
			message_divs[i].style.visibility ='visible';
		}
		document.getElementById('common_dialogue_message').style.visibility='visible';
		common.show_message('EXCEPTION', null,null, error, common.COMMON_GLOBAL['app_id']);
	}	
	else{
		//app error
		//remove everything
		document.write('');
	}
}
/*----------------------- */
/* INIT REPORT            */
/*----------------------- */
const init = async (parameters) => {
	let encodedParams = new URLSearchParams(window.location.search);
	let decodedparameters = common.fromBase64(encodedParams.get('parameters'));
	let encodedReportParams = new URLSearchParams(decodedparameters);
	let decodedReportparameters = common.fromBase64(encodedReportParams.get('reportid'));
	let urlParams = new URLSearchParams(decodedReportparameters);
	let user_account_id = urlParams.get('id');
	let user_setting_id = urlParams.get('sid');
	let lang_code = urlParams.get('lang_code');
	let reporttype = urlParams.get('type');
	return await new Promise((resolve) => {
		common.init_common(parameters, (err, global_app_parameters)=>{
			if (err){
				report_exception(err);
				resolve();
			}
			else{
				for (let i = 0; i < global_app_parameters.length; i++) {
					if (global_app_parameters[i].parameter_name=='APP_COPYRIGHT')
						app_common.APP_GLOBAL['app_copyright'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_LANG')
						REPORT_GLOBAL['regional_def_calendar_lang'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_PREFIX')
						REPORT_GLOBAL['regional_def_locale_ext_prefix'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM')
						REPORT_GLOBAL['regional_def_locale_ext_number_system'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR')
						REPORT_GLOBAL['regional_def_locale_ext_calendar'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_TYPE_GREG')
						REPORT_GLOBAL['regional_def_calendar_type_greg'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM')
						REPORT_GLOBAL['regional_def_calendar_number_system'] = global_app_parameters[i].parameter_value;
					//QR
					if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_WIDTH')
						common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(global_app_parameters[i].parameter_value);
					if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_HEIGHT')
						common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(global_app_parameters[i].parameter_value);
					if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_COLOR_DARK')
						common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_COLOR_LIGHT')
						common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_FILE_PATH')
						common.COMMON_GLOBAL['module_easy.qrcode_logo_file_path'] = global_app_parameters[i].parameter_value;
					if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_WIDTH')
						common.COMMON_GLOBAL['module_easy.qrcode_logo_width'] = parseInt(global_app_parameters[i].parameter_value);
					if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_LOGO_HEIGHT')
						common.COMMON_GLOBAL['module_easy.qrcode_logo_height'] = parseInt(global_app_parameters[i].parameter_value);
					if (global_app_parameters[i].parameter_name=='MODULE_EASY.QRCODE_BACKGROUND_COLOR')
						common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = global_app_parameters[i].parameter_value;
				
				}
				//report start
				if (common.inIframe() == false) {
					updateReportViewStat(user_setting_id, user_account_id);
				}
				timetable_user_setting_get(user_setting_id, (err, report_parameters) =>{
					if (err)
						resolve();
					else{
						document.body.classList = report_parameters.arabic_script;
						timetable_translate_settings(report_parameters.locale, report_parameters.second_locale).then(() => {
							if (err)
								resolve();
							else
								import('/common/modules/PrayTimes/PrayTimes.module.js').then(({prayTimes}) => {
									//set current date for report month
									app_common.APP_GLOBAL['session_currentDate'] = new Date();
									app_common.APP_GLOBAL['session_CurrentHijriDate'] = new Array();
									//get Hijri date from initial Gregorian date
									app_common.APP_GLOBAL['session_CurrentHijriDate'][0] = parseInt(new Date(app_common.APP_GLOBAL['session_currentDate'].getFullYear(),
									app_common.APP_GLOBAL['session_currentDate'].getMonth(),
									app_common.APP_GLOBAL['session_currentDate'].getDate()).toLocaleDateString("en-us-u-ca-islamic", { month: "numeric" }));
									app_common.APP_GLOBAL['session_CurrentHijriDate'][1] = parseInt(new Date(app_common.APP_GLOBAL['session_currentDate'].getFullYear(),
									app_common.APP_GLOBAL['session_currentDate'].getMonth(),
									app_common.APP_GLOBAL['session_currentDate'].getDate()).toLocaleDateString("en-us-u-ca-islamic", { year: "numeric" }));
									set_prayer_method().then(() => {
										if (reporttype==0){
											timetable_day_user_settings_get(user_account_id, (err, user_settings_parameters) =>{
												if (err)
													resolve();
												else{
													displayDay(prayTimes, report_parameters, null, user_settings_parameters).then((timetable) => {
														timetable.style.display = 'block';
														document.getElementById('paper').innerHTML = timetable.outerHTML;
														common.create_qr('timetable_qr_code', window.location.href);
														resolve();
													})
												}
													
											})
										}
										else
											if (reporttype==1)
												displayMonth(prayTimes, report_parameters, null).then((timetable) => {
													timetable.style.display = 'block';
													document.getElementById('paper').innerHTML = timetable.outerHTML;
													common.create_qr('timetable_qr_code', window.location.href);
													resolve();
												})
											else 
												if (reporttype==2)
													displayYear(prayTimes, report_parameters, null).then((timetable) => {
														timetable.style.display = 'block';
														document.getElementById('paper').innerHTML = timetable.outerHTML;
														common.create_qr('timetable_qr_code', window.location.href);
														resolve();
													})
									});
								})
								
						});
					}
				});
			}
		})
	})
}
export{REPORT_GLOBAL,
	   updateReportViewStat,
	   set_prayer_method, 
	   displayMonth, 
	   displayDay,
	   displayYear,
	   report_exception,
	   init}