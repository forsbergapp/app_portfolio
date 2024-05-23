/** @module apps/app2 */

/**@type{import('../../../../apps/apps.service')} */
const {render_app_with_data} = await import(`file://${process.cwd()}/apps/apps.service.js`);
/**@type{import('../../../../server/server.service')} */
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**@type{import('../../../../server/dbapi/sql/user_account_app_data_post_view.service.js')} */
const { insertUserPostView} = await import(`file://${process.cwd()}/server/dbapi/sql/user_account_app_data_post_view.service.js`);
const {default: QRCode} = await import('easyqrcodejs-nodejs');
/**
 * App types
 * 
 * @typedef {object} 	type_settings_report
 * @property {string}	locale
 * @property {string}	timezone
 * @property {string}	number_system
 * @property {string}	direction
 * @property {string}	second_locale
 * @property {string}	coltitle
 * @property {string}	arabic_script
 * @property {string}	calendartype
 * @property {string}	calendar_hijri_type
 * @property {string}	place
 * @property {number}	gps_lat
 * @property {number}	gps_long
 * @property {string}	theme_day
 * @property {string}	theme_month
 * @property {string}	theme_year
 * @property {string}	papersize
 * @property {string}	highlight
 * @property {number}	show_weekday
 * @property {number}	show_calendartype
 * @property {number}	show_notes
 * @property {number}	show_gps
 * @property {number}	show_timezone
 * @property {string}	header_img_src
 * @property {string}	footer_img_src
 * @property {string}	header_txt1
 * @property {string}	header_txt2
 * @property {string}	header_txt3
 * @property {string}	header_align
 * @property {string}	footer_txt1
 * @property {string}	footer_txt2
 * @property {string}	footer_txt3
 * @property {string}	footer_align
 * @property {string}	method
 * @property {string}	asr
 * @property {string}	highlat
 * @property {string}	format
 * @property {number}	hijri_adj
 * @property {string}	iqamat_fajr
 * @property {string}	iqamat_dhuhr
 * @property {string}	iqamat_asr
 * @property {string}	iqamat_maghrib
 * @property {string}	iqamat_isha
 * @property {number}	show_imsak
 * @property {number}	show_sunset
 * @property {number}	show_midnight
 * @property {number}	show_fast_start_end
 * @property {string}	timetable_class
 * @property {string}	timetable_month			- class to add for month
 * @property {string}	timetable_year_month	- class to add for year
 * @property {string}	reporttype_year_month	- MONTH:default, normal month with more info, 
 *												- YEAR:	month with less info
 */
/**
 * @typedef {object}	type_column_titles
 * @property {string}	day
 * @property {string}	weekday
 * @property {string}	weekday_tr
 * @property {string}	caltype
 * @property {string}	imsak
 * @property {string}	fajr
 * @property {string}	fajr_iqamat
 * @property {string}	sunrise
 * @property {string}	dhuhr
 * @property {string}	dhuhr_iqamat
 * @property {string}	asr
 * @property {string}	asr_iqamat
 * @property {string}	sunset
 * @property {string}	maghrib
 * @property {string}	maghrib_iqamat
 * @property {string}	isha
 * @property {string}	isha_iqamat
 * @property {string}	midnight
 * @property {string}	notes
 */
/**
 * Times
 * @typedef	{{[index: string]:number}}	type_times
 * @property{number}	day
 * @property{number}	fajr
 * @property{number}	dhuhr
 * @property{number}	asr
 * @property{number}	maghrib
 * @property{number}	isha
 * @property{number}	midnight
 */
/**
 * @typedef {object}	type_day_user_account_app_data_posts
 * @property {string}	description
 * @property {string}	regional_language_locale
 * @property {string}	regional_timezone
 * @property {string}	regional_number_system
 * @property {string}	regional_calendar_hijri_type
 * @property {number}	gps_lat_text
 * @property {number}	gps_long_text
 * @property {string}	prayer_method
 * @property {string}	prayer_asr_method
 * @property {string}	prayer_high_latitude_adjustment
 * @property {string}	prayer_time_format
 * @property {string}	prayer_hijri_date_adjustment
 */
/**@type{{	app_copyright:string,
 * 			'module_easy.qrcode_width':number|null,
 * 			'module_easy.qrcode_height':number|null,
 * 			'module_easy.qrcode_color_dark':string,
 * 			'module_easy.qrcode_color_light':string,
 * 			'module_easy.qrcode_background_color':string,
 * 			session_currentDate:Date,
 * 			session_currentHijriDate:[number, number, number],
 * 			module_praytimes_methods:{[index:string]:{	name:string,
 *														params:{fajr:string, 
 *																isha:string|null, 
 *																maghrib:string|null, 
 *																midnight:string|null
 *															}
 *													}
 *									},
 * 			regional_def_calendar_lang:string,
 * 			regional_def_locale_ext_prefix:string,
 * 			regional_def_locale_ext_number_system:string,
 * 			regional_def_locale_ext_calendar:string,
 * 			regional_def_calendar_type_greg:string,
 * 			regional_def_calendar_number_system:string,
 * 			first_language:{[key: string]:string,
 * 							coltitle_transliteration_imsak: string,
 *							coltitle_transliteration_fajr: string,
 *							coltitle_transliteration_fajr_iqamat: string,
 *							coltitle_transliteration_sunrise: string,
 *							coltitle_transliteration_dhuhr: string,
 *							coltitle_transliteration_dhuhr_iqamat: string,
 *							coltitle_transliteration_asr: string,
 *							coltitle_transliteration_asr_iqamat: string,
 *							coltitle_transliteration_sunset: string,
 *							coltitle_transliteration_maghrib: string,
 *							coltitle_transliteration_maghrib_iqamat: string,
 *							coltitle_transliteration_isha: string,
 *							coltitle_transliteration_isha_iqamat: string,
 *							coltitle_transliteration_midnight: string,
 *							timetable_title: string,
 *							coltitle_day: string,
 *							coltitle_weekday: string,
 *							coltitle_weekday_tr: string,
 *							coltitle_caltype_hijri: string,
 *							coltitle_caltype_gregorian: string,
 *							coltitle_imsak: string,
 *							coltitle_fajr: string,
 *							coltitle_fajr_iqamat: string,
 *							coltitle_sunrise: string,
 *							coltitle_dhuhr: string,
 *							coltitle_dhuhr_iqamat: string,
 *							coltitle_asr: string,
 *							coltitle_asr_iqamat: string,
 *							coltitle_sunset: string,
 *							coltitle_maghrib: string,
 *							coltitle_maghrib_iqamat: string,
 *							coltitle_isha: string,
 *							coltitle_isha_iqamat: string,
 *							coltitle_midnight: string,
 *							coltitle_notes: string,
 *							timezone_text: string,
 *							gps_lat_text: string,
 *							gps_long_text: string},
 * 			second_language:{	[key: string]:string,
 *								timetable_title: string,
 *								coltitle_day: string,
 *								coltitle_weekday: string,
 *								coltitle_weekday_tr: string,
 *								coltitle_caltype_hijri: string,
 *								coltitle_caltype_gregorian: string,
 *								coltitle_imsak: string,
 *								coltitle_fajr: string,
 *								coltitle_fajr_iqamat: string,
 *								coltitle_sunrise: string,
 *								coltitle_dhuhr: string,
 *								coltitle_dhuhr_iqamat: string,
 *								coltitle_asr: string,
 *								coltitle_asr_iqamat: string,
 *								coltitle_sunset: string,
 *								coltitle_maghrib: string,
 *								coltitle_maghrib_iqamat: string,
 *								coltitle_isha: string,
 *								coltitle_isha_iqamat: string,
 *								coltitle_midnight: string,
 *								coltitle_notes: string}
 * 			}} */
const REPORT_GLOBAL = {
    app_copyright:'',
    'module_easy.qrcode_width': null,
    'module_easy.qrcode_height':null,
    'module_easy.qrcode_color_dark':'',
    'module_easy.qrcode_color_light':'',
    'module_easy.qrcode_background_color':'',

    session_currentDate:new Date(),
    session_currentHijriDate:[0,0,0],
    module_praytimes_methods:{},
	regional_def_calendar_lang:'',
	regional_def_locale_ext_prefix:'',
	regional_def_locale_ext_number_system:'',
	regional_def_locale_ext_calendar:'',
	regional_def_calendar_type_greg:'',
	regional_def_calendar_number_system:'',
	first_language:{
						coltitle_transliteration_imsak: 'Imsak',
						coltitle_transliteration_fajr: 'Fajr',
						coltitle_transliteration_fajr_iqamat: 'Iqamat',
						coltitle_transliteration_sunrise: 'Shoorok',
						coltitle_transliteration_dhuhr: 'Dhuhr',
						coltitle_transliteration_dhuhr_iqamat: 'Iqamat',
						coltitle_transliteration_asr: 'Asr',
						coltitle_transliteration_asr_iqamat: 'Iqamat',
						coltitle_transliteration_sunset: 'Sunset',
						coltitle_transliteration_maghrib: 'Maghrib',
						coltitle_transliteration_maghrib_iqamat: 'Iqamat',
						coltitle_transliteration_isha: 'Isha',
						coltitle_transliteration_isha_iqamat: 'Iqamat',
						coltitle_transliteration_midnight: 'Midnight',
						timetable_title: 'Timetable',
						coltitle_day: 'Day',
						coltitle_weekday: 'Weekday',
						coltitle_weekday_tr: '',
						coltitle_caltype_hijri: 'Hijri',
						coltitle_caltype_gregorian: 'Gregorian',
						coltitle_imsak: 'Imsak',
						coltitle_fajr: 'Dawn',
						coltitle_fajr_iqamat: 'Iqamat',
						coltitle_sunrise: 'Sunrise',
						coltitle_dhuhr: 'Noon',
						coltitle_dhuhr_iqamat: 'Iqamat',
						coltitle_asr: 'Afternoon',
						coltitle_asr_iqamat: 'Iqamat',
						coltitle_sunset: 'Sunset',
						coltitle_maghrib: 'Sunset',
						coltitle_maghrib_iqamat: 'Iqamat',
						coltitle_isha: 'Night',
						coltitle_isha_iqamat: 'Iqamat',
						coltitle_midnight: 'Midnight',
						coltitle_notes: 'Notes',
						timezone_text: '🌐',
						gps_lat_text:'📍',
						gps_long_text:''
					},
	//second language objects that are displayed are column titles
	//transliterated column titles are used by first language
	second_language:{
						timetable_title: 'Timetable',
						coltitle_day: 'Day',
						coltitle_weekday: 'Weekday',
						coltitle_weekday_tr: '',
						coltitle_caltype_hijri: 'Hijri',
						coltitle_caltype_gregorian: 'Gregorian',
						coltitle_imsak: 'Imsak',
						coltitle_fajr: 'Dawn',
						coltitle_fajr_iqamat: 'Iqamat',
						coltitle_sunrise: 'Sunrise',
						coltitle_dhuhr: 'Noon',
						coltitle_dhuhr_iqamat: 'Iqamat',
						coltitle_asr: 'Afternoon',
						coltitle_asr_iqamat: 'Iqamat',
						coltitle_sunset: 'Sunset',
						coltitle_maghrib: 'Sunset',
						coltitle_maghrib_iqamat: 'Iqamat',
						coltitle_isha: 'Night',
						coltitle_isha_iqamat: 'Iqamat',
						coltitle_midnight: 'Midnight',
						coltitle_notes: 'Notes'
					}
};
Object.seal(REPORT_GLOBAL);
/**
 * Get timezone offset in hours compared with UTC
 * @param {string} local_timezone
 * @returns {number}
 */
const getTimezoneOffset = (local_timezone) =>{
    const utc = new Date(	Number(new Date().toLocaleString('en', {timeZone: 'UTC', year:'numeric'})),
							Number(new Date().toLocaleString('en', {timeZone: 'UTC', month:'numeric'}))-1,
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', day:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', hour:'numeric', hour12:false})),
                            Number(new Date().toLocaleString('en', {timeZone: 'UTC', minute:'numeric'}))).valueOf();

    const local = new Date(	Number(new Date().toLocaleString('en', {timeZone: local_timezone, year:'numeric'})),
							Number(new Date().toLocaleString('en', {timeZone: local_timezone, month:'numeric'}))-1,
                            Number(new Date().toLocaleString('en', {timeZone: local_timezone, day:'numeric'})),
                            Number(new Date().toLocaleString('en', {timeZone: local_timezone, hour:'numeric', hour12:false})),
                            Number(new Date().toLocaleString('en', {timeZone: local_timezone, minute:'numeric'}))).valueOf();
    return (local-utc) / 1000 / 60 / 60;
};
/**
 * Get gregorian date from Hijri with adjustment
 * @param {[number, number, number]} HijriDate 
 * @param {number} adjustment 
 * @returns {[number, number, number]}
 */
const getGregorian = (HijriDate, adjustment) =>{
    const DAY = 86400000; // a day in milliseconds
    const UNIX_EPOCH_JULIAN_DATE = 2440587.5; // January 1, 1970 GMT

    //The epoch of Hijri calendar for 1 Muharram, AH 1
    //The civil and the Friday epoch will be used here
    //const hijri_epoch_julian_astronomical 	= 1948439;	//Gregorian: Thursday 15 July 622
	const hijri_epoch_julian_civil 		    = 1948440;	//Gregorian: Friday 16 July 622	

    const year =  HijriDate[0];
    const month = HijriDate[1];
    const day =   HijriDate[2];
    //calculate julian date
    let julian_day = Math.floor(((11*year+3)/30)+(354*year)+(30*month)-((month-1)/2)+day+hijri_epoch_julian_civil-385);
    //adjust day with +- given number of days
    julian_day = julian_day + adjustment;
    return [new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getFullYear(),
            new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getMonth() + 1,
            new Date((julian_day - UNIX_EPOCH_JULIAN_DATE) * DAY).getDate()];
};
/**
 * Get Hanidec number string or return same number
 * @param {string} numbersystem 
 * @param {number} number 
 * @returns {string|number}
 */
const getNumberString = (numbersystem, number) => {
	const hanidec_numbers = 	[
								[0,'〇','líng'],
								[1,'一','yī'],
								[2,'二','èr'],
								[3,'三','sān'],
								[4,'四','sì'],
								[5,'五','wǔ'],
								[6,'六','liù'],
								[7,'七','qī'],
								[8,'八','bā'],
								[9,'九','jiǔ'],
								[10,'十','shí'],
								[0,'零','líng'],
								[10,'十','shí'],
								[11,'十一','shí yī'],
								[12,'十二','shí èr'],
								[13,'十三','shí sān'],
								[14,'十四','shí sì'],
								[15,'十五','shí wǔ'],
								[16,'十六','shí liù'],
								[17,'十七','shí qī'],
								[18,'十八','shí bā'],
								[19,'十九','shí jiǔ'],
								[20,'二十','èr shí'],
								[21,'二十一','èr shí yī'],
								[22,'二十二','èr shí èr'],
								[23,'二十三','èr shí sān'],
								[24,'二十四','èr shí sì'],
								[25,'二十五','èr shí wǔ'],
								[26,'二十六','èr shí liù'],
								[27,'二十七','èr shí qī'],
								[28,'二十八','èr shí bā '],
								[29,'二十九','èr shí jiǔ'],
								[30,'三十','sān shí'],
								[31,'三十一','sān shí yī'],
								[32,'三十二','sān shí èr'],
								[33,'三十三','sān shí sān'],
								[34,'三十四','sān shí sì'],
								[35,'三十五','sān shí wǔ'],
								[36,'三十六','sān shí liù'],
								[37,'三十七','sān shí qī'],
								[38,'三十八','sān shí bā '],
								[39,'三十九','sān shí jiǔ'],
								[40,'四十','sì shí'],
								[41,'四十一','sì shí yī'],
								[42,'四十二','sì shí èr'],
								[43,'四十三','sì shí sān'],
								[44,'四十四','sì shí sì'],
								[45,'四十五','sì shí wǔ'],
								[46,'四十六','sì shí liù'],
								[47,'四十七','sì shí qī'],
								[48,'四十八','sì shí bā'],
								[49,'四十九','sì shí jiǔ'],
								[50,'五十','wǔ shí'],
								[51,'五十一','wǔ shí yī'],
								[52,'五十二','wǔ shí èr'],
								[53,'五十三','wǔ shí sān'],
								[54,'五十四','wǔ shí sì'],
								[55,'五十五','wǔ shí wǔ'],
								[56,'五十六','wǔ shí liù'],
								[57,'五十七','wǔ shí qī'],
								[58,'五十八','wǔ shí bā'],
								[59,'五十九','wǔ shí jiǔ'],
								[60,'六十','liù shí'],
								[61,'六十一','liù shí yī'],
								[62,'六十二','liù shí èr'],
								[63,'六十三','liù shí sān'],
								[64,'六十四','liù shí sì'],
								[65,'六十五','liù shí wǔ'],
								[66,'六十六','liù shí liù'],
								[67,'六十七','liù shí qī'],
								[68,'六十八','liù shí bā'],
								[69,'六十九','liù shí jiǔ'],
								[70,'七十','qī shí'],
								[71,'七十一','qī shí yī'],
								[72,'七十二','qī shí èr'],
								[73,'七十三','qī shí sān'],
								[74,'七十四','qī shí sì'],
								[75,'七十五','qī shí wǔ'],
								[76,'七十六','qī shí liù'],
								[77,'七十七','qī shí qī'],
								[78,'七十八','qī shí bā'],
								[79,'七十九','qī shí jiǔ'],
								[80,'八十','bā shí'],
								[81,'八十一','bā shí yī'],
								[82,'八十二','bā shí èr'],
								[83,'八十三','bā shí sān'],
								[84,'八十四','bā shí sì'],
								[85,'八十五','bā shí wǔ'],
								[86,'八十六','bā shí liù'],
								[87,'八十七','bā shí qī'],
								[88,'八十八','bā shí bā'],
								[89,'八十九','bā shí jiǔ'],
								[90,'九十','jiǔ shí'],
								[91,'九十一','jiǔ shí yī'],
								[92,'九十二','jiǔ shí èr'],
								[93,'九十三','jiǔ shí sān'],
								[94,'九十四','jiǔ shí sì'],
								[95,'九十五','jiǔ shí wǔ'],
								[96,'九十六','jiǔ shí liù'],
								[97,'九十七','jiǔ shí qī'],
								[98,'九十八','jiǔ shí bā'],
								[99,'九十九','jiǔ shí jiǔ'],
								[100,'一百','yì bǎi']
							];
	switch (numbersystem){
		case 'hanidec':{
			return hanidec_numbers.filter(hanidec_number=>hanidec_number[0] == number)[0][1]; 
		}
		default:
			return number;
	}
};
/**
 * Get column titles
 * @param {number} 		transliteration 
 * @param {string} 		calendartype 
 * @param {string} 		locale 
 * @param {string|null} second_locale 
 * @param {string} 		first_locale 
 * @returns {type_column_titles}
 */
const getColumnTitles = (transliteration = 0, calendartype, locale, second_locale, first_locale) => {
	const coltitle = {day: '',
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
		coltitle.imsak = REPORT_GLOBAL.first_language.coltitle_transliteration_imsak;
		coltitle.fajr = REPORT_GLOBAL.first_language.coltitle_transliteration_fajr;
		coltitle.fajr_iqamat = REPORT_GLOBAL.first_language.coltitle_transliteration_fajr_iqamat;
		coltitle.sunrise = REPORT_GLOBAL.first_language.coltitle_transliteration_sunrise;
		coltitle.dhuhr = REPORT_GLOBAL.first_language.coltitle_transliteration_dhuhr;
		coltitle.dhuhr_iqamat = REPORT_GLOBAL.first_language.coltitle_transliteration_dhuhr_iqamat;
		coltitle.asr = REPORT_GLOBAL.first_language.coltitle_transliteration_asr;
		coltitle.asr_iqamat = REPORT_GLOBAL.first_language.coltitle_transliteration_asr_iqamat;
		coltitle.sunset = REPORT_GLOBAL.first_language.coltitle_transliteration_sunset;
		coltitle.maghrib = REPORT_GLOBAL.first_language.coltitle_transliteration_maghrib;
		coltitle.maghrib_iqamat = REPORT_GLOBAL.first_language.coltitle_transliteration_maghrib_iqamat;
		coltitle.isha = REPORT_GLOBAL.first_language.coltitle_transliteration_isha;
		coltitle.isha_iqamat = REPORT_GLOBAL.first_language.coltitle_transliteration_isha_iqamat;
		coltitle.midnight = REPORT_GLOBAL.first_language.coltitle_transliteration_midnight;
		}
	else {
		if (locale==first_locale){
			coltitle.day = REPORT_GLOBAL.first_language.coltitle_day;
			coltitle.weekday = REPORT_GLOBAL.first_language.coltitle_weekday;
			if (second_locale == '0' || second_locale == null)
				coltitle.weekday_tr = '';	
			else
				coltitle.weekday_tr = REPORT_GLOBAL.second_language.coltitle_weekday;
			if (calendartype == 'GREGORIAN') {
				coltitle.caltype = REPORT_GLOBAL.first_language.coltitle_caltype_hijri;
			} else {
				coltitle.caltype = REPORT_GLOBAL.first_language.coltitle_caltype_gregorian;
			}
			coltitle.imsak = REPORT_GLOBAL.first_language.coltitle_imsak;
			coltitle.fajr = REPORT_GLOBAL.first_language.coltitle_fajr;
			coltitle.fajr_iqamat = REPORT_GLOBAL.first_language.coltitle_fajr_iqamat;
			coltitle.sunrise = REPORT_GLOBAL.first_language.coltitle_sunrise;
			coltitle.dhuhr = REPORT_GLOBAL.first_language.coltitle_dhuhr;
			coltitle.dhuhr_iqamat = REPORT_GLOBAL.first_language.coltitle_dhuhr_iqamat;
			coltitle.asr = REPORT_GLOBAL.first_language.coltitle_asr;
			coltitle.asr_iqamat = REPORT_GLOBAL.first_language.coltitle_asr_iqamat;
			coltitle.sunset = REPORT_GLOBAL.first_language.coltitle_sunset;
			coltitle.maghrib = REPORT_GLOBAL.first_language.coltitle_maghrib;
			coltitle.maghrib_iqamat = REPORT_GLOBAL.first_language.coltitle_maghrib_iqamat;
			coltitle.isha = REPORT_GLOBAL.first_language.coltitle_isha;
			coltitle.isha_iqamat = REPORT_GLOBAL.first_language.coltitle_isha_iqamat;
			coltitle.midnight = REPORT_GLOBAL.first_language.coltitle_midnight;
			coltitle.notes = REPORT_GLOBAL.first_language.coltitle_notes;
		}
		else{
			coltitle.day = REPORT_GLOBAL.second_language.coltitle_day;
			coltitle.weekday = REPORT_GLOBAL.second_language.coltitle_weekday;
			coltitle.weekday_tr = '';
			if (calendartype == 'GREGORIAN') {
				coltitle.caltype = REPORT_GLOBAL.second_language.coltitle_caltype_hijri;
			} else {
				coltitle.caltype = REPORT_GLOBAL.second_language.coltitle_caltype_gregorian;
			}
			coltitle.imsak = REPORT_GLOBAL.second_language.coltitle_imsak;
			coltitle.fajr = REPORT_GLOBAL.second_language.coltitle_fajr;
			coltitle.fajr_iqamat = REPORT_GLOBAL.second_language.coltitle_fajr_iqamat;
			coltitle.sunrise = REPORT_GLOBAL.second_language.coltitle_sunrise;
			coltitle.dhuhr = REPORT_GLOBAL.second_language.coltitle_dhuhr;
			coltitle.dhuhr_iqamat = REPORT_GLOBAL.second_language.coltitle_dhuhr_iqamat;
			coltitle.asr = REPORT_GLOBAL.second_language.coltitle_asr;
			coltitle.asr_iqamat = REPORT_GLOBAL.second_language.coltitle_asr_iqamat;
			coltitle.sunset = REPORT_GLOBAL.second_language.coltitle_sunset;
			coltitle.maghrib = REPORT_GLOBAL.second_language.coltitle_maghrib;
			coltitle.maghrib_iqamat = REPORT_GLOBAL.second_language.coltitle_maghrib_iqamat;
			coltitle.isha = REPORT_GLOBAL.second_language.coltitle_isha;
			coltitle.isha_iqamat = REPORT_GLOBAL.second_language.coltitle_isha_iqamat;
			coltitle.midnight = REPORT_GLOBAL.second_language.coltitle_midnight;
			coltitle.notes = REPORT_GLOBAL.second_language.coltitle_notes;
		}
		}
	return coltitle;
};
/**
 * Checks if today
 * @param {Date} checkdate 
 * @returns {boolean}
 */
const isToday = checkdate => {
    return (checkdate.getMonth() == REPORT_GLOBAL.session_currentDate.getMonth()) && 
            (checkdate.getDate() == REPORT_GLOBAL.session_currentDate.getDate()) && 
            (checkdate.getFullYear() == REPORT_GLOBAL.session_currentDate.getFullYear());
};
/**
 * Sets prayer method
 * @param {number} app_id 
 * @returns {Promise.<null>}
 */
const set_prayer_method = async(app_id) => {
    const { getSettingDisplayData } = await import(`file://${process.cwd()}/server/dbapi/sql/app_setting.service.js`);
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
		
		REPORT_GLOBAL.module_praytimes_methods = {
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
		/**
		 * Set prayer value for fajr, isha, maghrib and midnight
		 * @param {string|null} fajr_data 
		 * @param {string|null} isha_data 
		 * @param {string|null} maghrib_data 
		 * @param {string|null} midnight_data 
		 * @returns {{fajr:object, isha:object,maghrib:object,midnight:object}}}
		 */
		const set_prayer_value = (fajr_data, isha_data, maghrib_data, midnight_data) => {
			let isha;
			//first two parameters always have values		
			//check if integer or number with decimal 
			if (/^\d+$/.test(isha_data??'') ||
				/^\d+\.\d+$/.test(isha_data??'')){
				isha = {isha:getNumberValue(isha_data)};
			}			
			else
				isha = {isha:isha_data};
			return {fajr: {fajr: getNumberValue(fajr_data)},
					isha: isha,
					maghrib: (maghrib_data==null || maghrib_data=='')?{}:{maghrib: getNumberValue(maghrib_data)},
					midnight: (midnight_data==null || midnight_data=='')?{}:{midnight: midnight_data}};
		};
        getSettingDisplayData(app_id, app_id, 'METHOD')
		.then((/**@type{import('../../../../types.js').db_result_app_setting_getSettingDisplayData[]}*/result_settings)=>{
			for (const setting of result_settings){
				const prayer_value = set_prayer_value(setting.data2, setting.data3,setting.data4,setting.data5);
				//ES6 object spread 
				Object.assign(REPORT_GLOBAL.module_praytimes_methods, {[setting.value.toUpperCase()]:{
																				name:  setting.display_data,
																				params: { 	...prayer_value.fajr,
																							...prayer_value.isha,
																							...prayer_value.maghrib,
																							...prayer_value.midnight
																						}
																				}
																			});
			}
			resolve(null);
		})
		.catch((/**@type{import('../../../../types.js').error}*/error)=>{
			reject(error);
		});
	});
};

/**
 * Checks if day is ramaday day
 * @param {number} year 
 * @param {number} month 
 * @param {number} day 
 * @param {string} timezone 
 * @param {string} calendartype 
 * @param {string} calendar_hijri_type 
 * @param {number} hijri_adj 
 * @returns {boolean}
 */
const is_ramadan_day = (year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adj) => {
	const options_calendartype = {	timeZone: timezone,
									month: 'numeric'};
	if (calendartype=='GREGORIAN'){
		const date_temp = new Date(year,month,day);
		date_temp.setDate(date_temp.getDate() + hijri_adj);
		const ramadan_day = date_temp.toLocaleString(	
				REPORT_GLOBAL.regional_def_calendar_lang + 
				REPORT_GLOBAL.regional_def_locale_ext_prefix + 
				REPORT_GLOBAL.regional_def_locale_ext_calendar + 
				calendar_hijri_type + 
				REPORT_GLOBAL.regional_def_locale_ext_number_system +
				REPORT_GLOBAL.regional_def_calendar_number_system, 
				/**@ts-ignore */
				options_calendartype);
		return Number(ramadan_day) == 9;
	}
	else
		return month==9;
	
};
/**
 * Set method praytimes
 * @param {*} prayTimes 
 * @param {string} settings_method
 * @param {string} settings_asr 
 * @param {string} settings_highlat 
 */
const setMethod_praytimes = (prayTimes, settings_method, settings_asr, settings_highlat) => {
	/*client version uses this:
    prayTimes.setMethod(settings_method);
    */
    prayTimes.prototype.init(settings_method);
	//use methods without modifying original code
	if (REPORT_GLOBAL.module_praytimes_methods[settings_method].params.maghrib && 
		REPORT_GLOBAL.module_praytimes_methods[settings_method].params.midnight)
		prayTimes.prototype.adjust({asr:      settings_asr,
									highLats: settings_highlat,
									fajr:     REPORT_GLOBAL.module_praytimes_methods[settings_method].params.fajr,
									isha:     REPORT_GLOBAL.module_praytimes_methods[settings_method].params.isha,
									maghrib:  REPORT_GLOBAL.module_praytimes_methods[settings_method].params.maghrib,
									midnight: REPORT_GLOBAL.module_praytimes_methods[settings_method].params.midnight} );
	else
		if (REPORT_GLOBAL.module_praytimes_methods[settings_method].params.maghrib)
			prayTimes.prototype.adjust({asr:      settings_asr,
										highLats: settings_highlat,
										fajr:     REPORT_GLOBAL.module_praytimes_methods[settings_method].params.fajr,
										isha:     REPORT_GLOBAL.module_praytimes_methods[settings_method].params.isha,
										maghrib:  REPORT_GLOBAL.module_praytimes_methods[settings_method].params.maghrib} );
		else
			if (REPORT_GLOBAL.module_praytimes_methods[settings_method].params.midnight)
				prayTimes.prototype.adjust({asr:      settings_asr,
											highLats: settings_highlat,
											fajr:     REPORT_GLOBAL.module_praytimes_methods[settings_method].params.fajr,
											isha:     REPORT_GLOBAL.module_praytimes_methods[settings_method].params.isha,
											midnight: REPORT_GLOBAL.module_praytimes_methods[settings_method].params.midnight} );
			else
				prayTimes.prototype.adjust({asr:      settings_asr,
											highLats: settings_highlat,
											fajr:     REPORT_GLOBAL.module_praytimes_methods[settings_method].params.fajr,
											isha:     REPORT_GLOBAL.module_praytimes_methods[settings_method].params.isha} );
};
/**
 * Get style for header and footer
 * @param {string} img_src 
 * @param {string} align 
 * @returns {string}
 */
const getstyle = (img_src, align) => {
	const img_style = img_src==null?'':`background-image:url(${img_src});`;
	const align_style = `${align==null?'':'text-align:' + align}`;
	return img_style + align_style;
};
/**
 * Show column with correct class and correct format 
 * for both day and month timetable
 * @param {number} timetable 
 * @param {string} col 
 * @param {string|number} value 
 * @param {{year: 					number,
			month: 					number,
			day:					number,
			calendartype:			string,
			show_fast_start_end:	number,
			timezone:				string,
			calendar_hijri_type:	string,
			hijri_adjustment:		number,
			locale:					string,
			number_system:			string,
			format:					string}} col_data
 * @returns 
 */
const show_col = (timetable, col, value, col_data) => {
	let display_value ='';
	if (value=='-----')
		display_value = value;
	else
		display_value = localTime(getNumberValue(value), 	col_data.locale + 
															REPORT_GLOBAL.regional_def_locale_ext_prefix + 
															REPORT_GLOBAL.regional_def_locale_ext_number_system + 
															col_data.number_system, 
															col_data.format);
	if (((col_data.show_fast_start_end==1 && col=='fajr') ||
		(col_data.show_fast_start_end==2 && col=='imsak') ||
		(col_data.show_fast_start_end==3 && col=='fajr') ||
		(col_data.show_fast_start_end==4 && col=='imsak')) &&
		is_ramadan_day(	col_data.year, 
						col_data.month, 
						col_data.day, 
						col_data.timezone, 
						col_data.calendartype, 
						col_data.calendar_hijri_type, 
						col_data.hijri_adjustment)){
		if (timetable==0)
			return `<div class='timetable_month_data_col timetable_data_fast_start'>${display_value}</div>`;
		if (timetable==1)
			return `<div class="timetable_data_fast_start">${display_value}</div>`;
		}
	else
		if (((col_data.show_fast_start_end==1 && col=='maghrib') ||
			(col_data.show_fast_start_end==2 && col=='maghrib') ||
			(col_data.show_fast_start_end==3 && col=='isha') ||
			(col_data.show_fast_start_end==4 && col=='isha')) && 
			is_ramadan_day(	col_data.year, 
							col_data.month, 
							col_data.day, 
							col_data.timezone, 
							col_data.calendartype, 
							col_data.calendar_hijri_type, 
							col_data.hijri_adjustment)){
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
};
/**
 * Timetable headers
 * @param {number} reporttype
 * @param {type_settings_report} settings 
 * @returns {string}
 */
const timetable_headers = (reporttype, settings) => {
	let html ='';
	if (settings.coltitle=='0' || settings.coltitle=='1'){
		//add transliterated column titles	
		html +=  create_header_row(reporttype, getColumnTitles(1, settings.calendartype, settings.locale, null, settings.locale), settings);
		if (settings.coltitle=='1'){
			//add translated column titles
			html += create_header_row(reporttype, getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, settings.locale), settings);
		}
	}
	else
		if (settings.coltitle=='2' || settings.coltitle=='3'){
			//add translated column titles
			html +=  create_header_row(reporttype, getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, settings.locale), settings);
			if (settings.coltitle=='2'){
				//add transliterated column titles
				html +=  create_header_row(reporttype, getColumnTitles(1, settings.calendartype, settings.locale, null, settings.locale), settings);
			}
		}
	if (settings.second_locale!='0'){
		//show second locale except weekdays, they are already displayed on first header row
		const second_locale_titles = getColumnTitles(0, settings.calendartype, settings.second_locale, null, settings.locale);
		second_locale_titles.weekday='';
		second_locale_titles.weekday_tr='';
		html +=  create_header_row(reporttype, second_locale_titles, settings);
	}
	return html;
};
/**
 * Converts float to hour and minutes
 * @param {number} float_time 
 * @returns {{hours:number, minutes:number}}}
 */
const float_to_hourminutes = float_time =>{
	/**
	 * @param {number} a 
	 * @returns {number}
	*/
	const fixHour = a => fix(a, 24 );
	/**
	 * @param {number} a 
	 * @param {number} b 
	 * @returns {number}
	 */
	const fix =  (a, b) => { 
		a = a- b* (Math.floor(a/ b));
		return (a < 0) ? a+ b : a;
	};
	const time = fixHour(float_time + 0.5/ 60);
	const hours = Math.floor(time); 
	const minutes = Math.floor((time- hours)* 60);
	return {hours:hours, minutes:minutes};
};
/**
 * Local time in 24, 12h with suffix or 12hNS without suffix
 * returned with dayperiod locale
 * @param {number|null} value 
 * @param {string} locale 
 * @param {string} format 
 * @param {number|null} hours 
 * @param {number|null} minutes 
 * @returns {string}
 */
const localTime = (value, locale, format, hours=null, minutes=null) =>{
	const calc = value==null?{hours:0, minutes:0}:float_to_hourminutes(value);
	
	/* 	Intl.DateTimeFormat is about same speed than localtime.toLocaleTimeString
		although result can vary within about halv second testing speed on year timetable

		times from prayTimes.prototype.getTime are returned with 24 hours format and minutes in decimals using Float format

		using toLocaleString that is about 7 times faster than Intl.DateTimeFormat and toLocaleTimeString
		however toLocaleTimeString is needed for format 12h since dayPeriod should be locale adjusted
	*/
	switch (format){
		//24h
		case '24h':{
			if (locale.toLowerCase().endsWith('hanidec'))
				if ((minutes ?? calc.minutes)<10 ){
					//padStart does not work for Hanidec numbers
					return 	getNumberString('hanidec', hours ?? calc.hours) + ':' + 
							(0).toLocaleString(locale) + getNumberString('hanidec', minutes ?? calc.minutes);
				}
				else
					return 	getNumberString('hanidec', hours ?? calc.hours) + ':' + 
							getNumberString('hanidec', minutes ?? calc.minutes);
			else
				return 	(hours ?? calc.hours).toLocaleString(locale) + ':' + 
						(minutes ?? calc.minutes).toLocaleString(locale).padStart(2,(0).toLocaleString(locale));
		}
		//12h with suffix
		case '12h':{
			const localtime = new Date(1970,1,1, hours==null?calc.hours:hours, minutes==null?calc.minutes:minutes);
			if (locale.toLowerCase().endsWith('hanidec')){
				const time_latn_no_dayperiod	= localtime.toLocaleString(locale.replace('hanidec','latn'), {hour: 'numeric',minute: '2-digit', hour12:false}).split(':');
				//adjust 24 to 12 format
				time_latn_no_dayperiod[0] = ((Number(time_latn_no_dayperiod[0]) + 12 -1)% 12+ 1).toString();
				//to find dayperiod using localtime.toLocaleString('es-pe-u-nu-latin', {dayPeriod:'short'}) returns too long text
				let dayperiod 					= localtime.toLocaleString(locale.replace('hanidec','latn'), {hour: '2-digit',minute: '2-digit', hour12:true});
				dayperiod						= dayperiod.indexOf(':')==2?dayperiod.substring(5):dayperiod.substring(0,dayperiod.length-5);
				const time_latn_with_dayperiod	= localtime.toLocaleString(locale.replace('hanidec','latn'), {hour: 'numeric',minute: '2-digit', hour12:true, dayPeriod:'short'});
				const dayperiod_first			= (time_latn_with_dayperiod.indexOf(time_latn_no_dayperiod[0]+':'+time_latn_no_dayperiod[1])>0);
				if (dayperiod_first)
					return 	dayperiod + 
							getNumberString('hanidec', Number(time_latn_no_dayperiod[0])) + ':' + 
							getNumberString('hanidec', Number(time_latn_no_dayperiod[1]));
				else
					return 	getNumberString('hanidec', Number(time_latn_no_dayperiod[0])) + ':' + 
							getNumberString('hanidec', Number(time_latn_no_dayperiod[1])) +
							dayperiod;
			}
			else
				return localtime.toLocaleTimeString(locale, {hour: 'numeric',minute: '2-digit', hour12:true});
		}
		//12h without suffix
		case '12hNS':
		default:{
			//adjust 24 to 12 format
			const hour12 = ((hours==null?calc.hours:hours) + 12 -1)% 12+ 1;
			if (locale.toLowerCase().endsWith('hanidec')){
				if ((minutes ?? calc.minutes)<10 ){
					//padStart does not work for Hanidec numbers
					return 	getNumberString('hanidec', hour12) + ':' + 
							(0).toLocaleString(locale) + getNumberString('hanidec', minutes ?? calc.minutes);
				}
				else
					return 	getNumberString('hanidec', hour12) + ':' + 
							getNumberString('hanidec', minutes ?? calc.minutes);
			}
			else
				return 	(hour12).toLocaleString(locale) + ':' + 
						(minutes ?? calc.minutes).toLocaleString(locale).padStart(2,(0).toLocaleString(locale));
		}
	}
};
/**
 * Calculate Iqamat 
 * @param {string} option 
 * @param {number} calculated_time 
 * @returns {{hours: number, minutes:number}}
 */
const calculateIqamat = (option, calculated_time) => {
	let add_minutes;
	const calc = float_to_hourminutes(calculated_time);
	switch (option){
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
			const datetime = new Date(1970, 1, 1, calc.hours, calc.minutes);
			const newDateObj = new Date(datetime.getTime() + add_minutes*60000);
			return {hours: newDateObj.getHours(), minutes:newDateObj.getMinutes()};
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

			const datetime = new Date(1970, 1, 1, calc.hours + 1, add_minutes);
			return {hours: datetime.getHours(), minutes:datetime.getMinutes()};
		}
		//0 = do not display iqamat column
		case '0':
		default: 
			return  {hours: 0, minutes:0};
		
	}
};
/**
 * Make a timetable month row
 * @param {type_times} data 
 * @param {type_column_titles} columns 
 * @param {number} year 
 * @param {number} month 
 * @param {type_settings_report} settings 
 * @param {[number, number, number]|null} date 
 * @returns {string}
 */
const makeTableRow = (data, columns, year, month, settings, date = null) => {

	const options_weekday = {weekday:'long'};
	const options_calendartype = {timeZone: settings.timezone, 
								dateStyle: 'short'};
	let iqamat;
	let html='';
	for (const column in columns) {
		iqamat = '';
		//Check if column should be displayed
		if ( (column=='weekday' && (settings.show_weekday ==0 || settings.reporttype_year_month =='YEAR'))||
				(column=='weekday_tr' && ((settings.second_locale =='0' ||
									settings.show_weekday ==0) || settings.reporttype_year_month =='YEAR'))||
				(column=='caltype' && (settings.show_calendartype ==0 || settings.reporttype_year_month =='YEAR'))||
				(column=='imsak' && (settings.show_imsak ==0 || settings.reporttype_year_month =='YEAR'))||
				(column=='fajr_iqamat' && (settings.iqamat_fajr =='0' || settings.reporttype_year_month =='YEAR'))||
				(column=='dhuhr_iqamat' && (settings.iqamat_dhuhr=='0' || settings.reporttype_year_month =='YEAR'))||
				(column=='asr_iqamat' && (settings.iqamat_asr=='0' || settings.reporttype_year_month =='YEAR'))||
				(column=='maghrib_iqamat' && (settings.iqamat_maghrib=='0' || settings.reporttype_year_month =='YEAR'))||
				(column=='isha_iqamat' && (settings.iqamat_isha=='0' || settings.reporttype_year_month =='YEAR'))||
				(column=='sunset' && (settings.show_sunset ==0 || settings.reporttype_year_month =='YEAR'))||
				(column=='midnight' && (settings.show_midnight ==0 || settings.reporttype_year_month =='YEAR'))||
				(column=='notes' && (settings.show_notes ==0 || settings.reporttype_year_month =='YEAR')))
			null;
		else{
			switch(column){
			case 'day':{
				if (settings.number_system=='hanidec')
					html += `<div class='timetable_month_data_col'>${getNumberString(settings.number_system, data[column])}</div>`;
				else
					html += `<div class='timetable_month_data_col'>${data[column].toLocaleString(	settings.locale + 
																									REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																									REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																									settings.number_system)}</div>`;
				break;
				}	
			case 'caltype':{
				if (settings.calendartype=='GREGORIAN'){
					const date_temp = new Date(year,month,data.day);
					date_temp.setDate(date_temp.getDate() + settings.hijri_adj);
					html += `<div class='timetable_month_data_col timetable_month_data_calendartype'>${date_temp.toLocaleDateString(settings.locale + 
																										REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_calendar + 
																										settings.calendar_hijri_type + 
																										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																										/**@ts-ignore */
																										(settings.number_system=='hanidec'?'latn':settings.number_system), options_calendartype)}</div>`;
				}
				else{							
					/**@ts-ignore */
					html += `<div class='timetable_month_data_col timetable_month_data_calendartype	'>${new Date(date[0],date[1]-1,date[2]).toLocaleDateString(settings.locale + 
																										REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_calendar + 
																										REPORT_GLOBAL.regional_def_calendar_type_greg + 
																										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																										/**@ts-ignore */
																										(settings.number_system=='hanidec'?'latn':settings.number_system), options_calendartype)}</div>`;							
				}
				break;
				}
			case 'weekday':
			case 'weekday_tr':{
				if (settings.calendartype=='GREGORIAN'){
					const date_temp = new Date(year,month,data.day);
					date_temp.setDate(date_temp.getDate() + settings.hijri_adj);
					html += `<div class='timetable_month_data_col timetable_month_data_date'>${date_temp.toLocaleDateString(column=='weekday'?settings.locale:settings.second_locale + 
																										REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_calendar + 
																										/**@ts-ignore */
																										settings.calendar_hijri_type, options_weekday)}</div>`;
					}
				else{
					/**@ts-ignore */
					html += `<div class='timetable_month_data_col timetable_month_data_date'>${new Date(date[0],date[1]-1,date[2]).toLocaleDateString(column=='weekday'?settings.locale:settings.second_locale + 
																										REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_calendar + 
																										REPORT_GLOBAL.regional_def_calendar_type_greg, 
																										/**@ts-ignore */
																										options_weekday)}</div>`;
				}
				break;
				}
			case 'fajr_iqamat':{
				iqamat = calculateIqamat(settings.iqamat_fajr, data.fajr);
				html += `<div class='timetable_month_data_col'>${localTime(null, settings.locale + 		REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																										settings.number_system, 
																										settings.format, 
																										iqamat.hours, 
																										iqamat.minutes)}</div>`;
				break;
				}
			case 'dhuhr_iqamat':{
				iqamat = calculateIqamat(settings.iqamat_dhuhr, data.dhuhr);
				html += `<div class='timetable_month_data_col'>${localTime(null, settings.locale + 		REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																										settings.number_system, 
																										settings.format, 
																										iqamat.hours, 
																										iqamat.minutes)}</div>`;
				break;
				}
			case 'asr_iqamat':{
				iqamat = calculateIqamat(settings.iqamat_asr, data.asr);
				html += `<div class='timetable_month_data_col'>${localTime(null, settings.locale + 		REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																										settings.number_system, 
																										settings.format, 
																										iqamat.hours, 
																										iqamat.minutes)}</div>`;
				break;
				}
			case 'maghrib_iqamat':{
				iqamat = calculateIqamat(settings.iqamat_maghrib, data.maghrib);
				html += `<div class='timetable_month_data_col'>${localTime(null, settings.locale + 		REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																										settings.number_system, 
																										settings.format, 
																										iqamat.hours, 
																										iqamat.minutes)}</div>`;
				break;                    
				}
			case 'isha_iqamat':{
				iqamat = calculateIqamat(settings.iqamat_isha, data.isha);
				html += `<div class='timetable_month_data_col'>${localTime(null, settings.locale + 		REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																										settings.number_system, 
																										settings.format, 
																										iqamat.hours, 
																										iqamat.minutes)}</div>`;
				break;
				}
			case 'notes':{
				html += `<div class='timetable_month_data_col timetable_month_data_notes'>${''}<div contentEditable='true' class='common_input'/></div></div>`;
				break;
				}
			default:{
				const show_col_data = {	year: 					year,
										month: 					month,
										day:					data.day,
										calendartype:			settings.calendartype,
										show_fast_start_end:	settings.show_fast_start_end,
										timezone:				settings.timezone,
										calendar_hijri_type:	settings.calendar_hijri_type,
										hijri_adjustment:		settings.hijri_adj,
										locale:					settings.locale,
										number_system:			settings.number_system,
										format:					settings.format};
				html += show_col(0, column, data[column], show_col_data);
				break;
				}
			}
		}
	}
	return html;
};
/**
 * Timetable get user settings
 * @param {number} app_id 
 * @param {number} user_account_app_data_post_id 
 * @returns {Promise.<type_settings_report>}
 */
const timetable_user_account_app_data_post_get = async (app_id, user_account_app_data_post_id) => {
    const { getUserPost} = await import(`file://${process.cwd()}/server/dbapi/sql/user_account_app_data_post.service.js`);
	return getUserPost(app_id, user_account_app_data_post_id)
	.then((/**@type{import('../../../../types.js').db_result_user_account_app_data_post_getUserPost[]}*/result_user_account_app_data_post)=>{
		const user_account_app_data_post = JSON.parse(result_user_account_app_data_post[0].json_data);
		return  {  	locale              	: user_account_app_data_post.regional_language_locale,  
					timezone            	: user_account_app_data_post.regional_timezone,
					number_system       	: user_account_app_data_post.regional_number_system,
					direction           	: user_account_app_data_post.regional_layout_direction,
					second_locale       	: user_account_app_data_post.regional_second_language_locale,
					coltitle            	: user_account_app_data_post.regional_column_title,
					arabic_script       	: user_account_app_data_post.regional_arabic_script,
					calendartype        	: user_account_app_data_post.regional_calendar_type,
					calendar_hijri_type 	: user_account_app_data_post.regional_calendar_hijri_type,

					place               	: user_account_app_data_post.description,
					gps_lat             	: parseFloat(user_account_app_data_post.gps_lat_text),
					gps_long            	: parseFloat(user_account_app_data_post.gps_long_text),
					
					theme_day           	: 'theme_day_' + user_account_app_data_post.design_theme_day_id,
					theme_month         	: 'theme_month_' + user_account_app_data_post.design_theme_month_id,
					theme_year          	: 'theme_year_' + user_account_app_data_post.design_theme_year_id,
					papersize				: user_account_app_data_post.design_paper_size,
					highlight           	: user_account_app_data_post.design_row_highlight,
					show_weekday        	: getNumberValue(user_account_app_data_post.design_column_weekday_checked),
					show_calendartype   	: getNumberValue(user_account_app_data_post.design_column_calendartype_checked),
					show_notes          	: getNumberValue(user_account_app_data_post.design_column_notes_checked),
					show_gps   	       		: getNumberValue(user_account_app_data_post.design_column_gps_checked),
					show_timezone       	: getNumberValue(user_account_app_data_post.design_column_timezone_checked),
								
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
					hijri_adj           	: getNumberValue(user_account_app_data_post.prayer_hijri_date_adjustment),
					iqamat_fajr         	: user_account_app_data_post.prayer_fajr_iqamat,
					iqamat_dhuhr        	: user_account_app_data_post.prayer_dhuhr_iqamat,
					iqamat_asr          	: user_account_app_data_post.prayer_asr_iqamat,
					iqamat_maghrib      	: user_account_app_data_post.prayer_maghrib_iqamat,
					iqamat_isha         	: user_account_app_data_post.prayer_isha_iqamat,
					show_imsak          	: getNumberValue(user_account_app_data_post.prayer_column_imsak_checked),
					show_sunset         	: getNumberValue(user_account_app_data_post.prayer_column_sunset_checked),
					show_midnight       	: getNumberValue(user_account_app_data_post.prayer_column_midnight_checked),
					show_fast_start_end 	: getNumberValue(user_account_app_data_post.prayer_column_fast_start_end),
					
					timetable_class			: 'timetable_class',
					timetable_month         : 'timetable_month_class',
					timetable_year_month    : 'timetable_year_month',
					reporttype_year_month  	: 'MONTH'
				};
	})
	.catch((/**@type{import('../../../../types.js').error}*/error)=>{
		throw error;
	});
};
/**
 * Timetable translate settings
 * @param {number} app_id 
 * @param {string} locale 
 * @param {string} locale_second 
 */
const timetable_translate_settings = async (app_id, locale, locale_second) => {
    const { getObjects } = await import(`file://${process.cwd()}/server/dbapi/sql/app_object.service.js`);
	/**
	 * 
	 * @param {string} locale 
	 * @param {boolean} first 
	 * @returns 
	 */
	const fetch_translation = async (locale, first) => {
		//show translation using first or second language
		/**@type{import('../../../../types.js').db_result_app_object_getObjects[]} */
		const result_app_object_items = await getObjects(app_id, locale, 'REPORT', null);	
		for (const app_object_item of result_app_object_items){
			if (first == true)
				REPORT_GLOBAL.first_language[app_object_item.object_item_name.toLowerCase()] = app_object_item.text;
			else
				REPORT_GLOBAL.second_language[app_object_item.object_item_name.toLowerCase()] = app_object_item.text;
		}
	};
	await fetch_translation(locale, true).then(() => {
		if (locale_second =='0'){
			REPORT_GLOBAL.second_language.timetable_title = '';
			REPORT_GLOBAL.second_language.coltitle_day = '';
			REPORT_GLOBAL.second_language.coltitle_weekday = '';
			REPORT_GLOBAL.second_language.coltitle_weekday_tr = '';
			REPORT_GLOBAL.second_language.coltitle_caltype_hijri = '';
			REPORT_GLOBAL.second_language.coltitle_caltype_gregorian = '';
			REPORT_GLOBAL.second_language.coltitle_imsak = '';
			REPORT_GLOBAL.second_language.coltitle_fajr = '';
			REPORT_GLOBAL.second_language.coltitle_fajr_iqamat = '';
			REPORT_GLOBAL.second_language.coltitle_sunrise = '';
			REPORT_GLOBAL.second_language.coltitle_dhuhr = '';
			REPORT_GLOBAL.second_language.coltitle_dhuhr_iqamat = '';
			REPORT_GLOBAL.second_language.coltitle_asr = '';
			REPORT_GLOBAL.second_language.coltitle_asr_iqamat = '';
			REPORT_GLOBAL.second_language.coltitle_sunset = '';
			REPORT_GLOBAL.second_language.coltitle_maghrib = '';
			REPORT_GLOBAL.second_language.coltitle_maghrib_iqamat = '';
			REPORT_GLOBAL.second_language.coltitle_isha = '';
			REPORT_GLOBAL.second_language.coltitle_isha_iqamat = '';
			REPORT_GLOBAL.second_language.coltitle_midnight = '';
			REPORT_GLOBAL.second_language.coltitle_notes = '';
		}
	});
	await fetch_translation(locale_second, false);
};
/**
 * Timetable get day user settings
 * @param {number} app_id 
 * @param {number} user_account_id 
 * @returns {Promise.<type_day_user_account_app_data_posts[]>}
 */
const timetable_day_user_account_app_data_posts_get = async (app_id, user_account_id) => {
	/**@type{type_day_user_account_app_data_posts[]} */
	const user_account_app_data_posts = [];

    const { getUserPostsByUserId} = await import(`file://${process.cwd()}/server/dbapi/sql/user_account_app_data_post.service.js`);
    return getUserPostsByUserId(app_id, user_account_id)
	.then((/**@type{import('../../../../types.js').db_result_user_account_app_data_post_getUserPostsByUserId[]}*/result_user_account_app_data_posts)=>{
		for (const user_account_app_data_post of result_user_account_app_data_posts) {
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
	.catch((/**@type{import('../../../../types.js').error}*/error)=>{
		throw error;
	});
};
/**
 * Timetable header row
 * @param {number} 				report_type 
 * @param {type_column_titles} 	col_titles 
 * @param {type_settings_report}settings
 * @returns {string}
 */
const create_header_row = (report_type, col_titles, settings) => {
	switch (report_type){
		case 0:{
			return `<div class='timetable_day_timetable_header_row'>
						${settings.show_imsak==1?`<div>${col_titles.imsak}</div>`:''}
						${`<div>${col_titles.fajr}</div>`}
						${`<div>${col_titles.sunrise}</div>`}
						${`<div>${col_titles.dhuhr}</div>`}
						${`<div>${col_titles.asr}</div>`}
						${settings.show_sunset==1?`<div>${col_titles.sunset}</div>`:''}
						${`<div>${col_titles.maghrib}</div>`}
						${`<div>${col_titles.isha}</div>`}
						${settings.show_midnight==1?`<div>${col_titles.midnight}</div>`:''}
					</div>`;
		}
		case 1:{
			/**
			 * 
			 * @param {string} data 
			 * @returns {string}
			 */
			const get_div_col = data => `<div class='timetable_month_data_header_col'>${data}</div>`;
			return `<div class='timetable_month_data_row timetable_month_data_header_row'>
						${get_div_col(col_titles.day)}
						${settings.show_weekday==1 && settings.reporttype_year_month=='MONTH'?get_div_col(col_titles.weekday):''}
						${settings.second_locale !='0' && settings.show_weekday==1 && settings.reporttype_year_month=='MONTH'?get_div_col(col_titles.weekday_tr):''}
						${settings.show_calendartype==1 && settings.reporttype_year_month=='MONTH'?get_div_col(col_titles.caltype):''}
						${settings.show_imsak==1?get_div_col(col_titles.imsak):''}
						${get_div_col(col_titles.fajr)}
						${settings.iqamat_fajr!='0'?get_div_col(col_titles.fajr_iqamat):''}
						${get_div_col(col_titles.sunrise)}
						${get_div_col(col_titles.dhuhr)}
						${settings.iqamat_dhuhr!='0'?get_div_col(col_titles.dhuhr_iqamat):''}
						${get_div_col(col_titles.asr)}
						${settings.iqamat_asr!='0'?get_div_col(col_titles.asr_iqamat):''}
						${settings.show_sunset==1?get_div_col(col_titles.sunset):''}
						${get_div_col(col_titles.maghrib)}
						${settings.iqamat_maghrib!='0'?get_div_col(col_titles.maghrib_iqamat):''}
						${get_div_col(col_titles.isha)}
						${settings.iqamat_isha!='0'?get_div_col(col_titles.isha_iqamat):''}
						${settings.show_midnight==1?get_div_col(col_titles.midnight):''}
						${settings.show_notes==1 && settings.reporttype_year_month=='MONTH'?get_div_col(col_titles.notes):''}
					</div>`;
		}
		default:
			return '';
	}
};
/**
 * Timetable day
 * @param {*} prayTimes 
 * @param {type_settings_report} settings 
 * @param {type_day_user_account_app_data_posts[]} user_account_app_data_posts 
 * @returns {string}
 */
const displayDay = (prayTimes, settings, user_account_app_data_posts) => {
	let times; 
	const options = { 	timeZone: settings.timezone, 
						weekday: 'long', 
						year: 'numeric', 
						month: 'long', 
						day: 'numeric'};
	const options_hijri = { timeZone: settings.timezone, 
							year: 'numeric', 
							month: 'long', 
							day: 'numeric'};
					
	/**@type{*}*/
	const date_current = new Date(	REPORT_GLOBAL.session_currentDate.getFullYear(),
									REPORT_GLOBAL.session_currentDate.getMonth(),
									REPORT_GLOBAL.session_currentDate.getDate());
	const date_title4 = date_current.toLocaleDateString(settings.locale + 
														REPORT_GLOBAL.regional_def_locale_ext_prefix + 
														REPORT_GLOBAL.regional_def_locale_ext_number_system + 				
														(settings.number_system=='hanidec'?'latn':settings.number_system), options).toLocaleUpperCase();
	date_current.setDate(date_current.getDate() + settings.hijri_adj);
	const date_title5 = date_current.toLocaleDateString(settings.locale + 
														REPORT_GLOBAL.regional_def_locale_ext_prefix + 
														REPORT_GLOBAL.regional_def_locale_ext_calendar + 
														settings.calendar_hijri_type + 
														REPORT_GLOBAL.regional_def_locale_ext_number_system + 
														(settings.number_system=='hanidec'?'latn':settings.number_system), options_hijri).toLocaleUpperCase();	
	const timetable_data = () => {
		/**
		 * 
		 * @param {string} user_locale s
		 * @param {string} user_timezone 
		 * @param {string} user_number_system 
		 * @param {string} user_calendar_hijri_type 
		 * @param {number} user_gps_latitude 
		 * @param {number} user_gps_longitude 
		 * @param {string} user_format 
		 * @param {number} user_hijri_adjustment 
		 * @param {string} user_place 
		 * @returns {string}
		 */
		const day_timetable = (	user_locale, user_timezone, user_number_system, user_calendar_hijri_type,
								user_gps_latitude, user_gps_longitude, user_format, user_hijri_adjustment, user_place) =>{
			let day_html = '';
			const timezone_offset = getTimezoneOffset(user_timezone);
			times = prayTimes.prototype.getTimes(REPORT_GLOBAL.session_currentDate, [user_gps_latitude, user_gps_longitude], timezone_offset, 0, 'Float');

			const show_col_data = {	year: 					REPORT_GLOBAL.session_currentDate.getFullYear(),
									month: 					REPORT_GLOBAL.session_currentDate.getMonth(),
									day:					REPORT_GLOBAL.session_currentDate.getDate(),
									calendartype:			'GREGORIAN',
									show_fast_start_end:	settings.show_fast_start_end, 
									timezone:				user_timezone, 
									calendar_hijri_type:	user_calendar_hijri_type, 
									hijri_adjustment:		user_hijri_adjustment,
									locale:					user_locale, 
									number_system:			user_number_system, 
									format:					user_format};
			const col_imsak = settings.show_imsak == 1?show_col(1, 'imsak', times.imsak, show_col_data ):''; 
			const col_fajr = show_col(1, 'fajr', times.fajr, show_col_data);
			const col_sunrise = show_col(1, 'sunrise', times.sunrise, show_col_data);
			const col_dhuhr = show_col(1, 'dhuhr', times.dhuhr, show_col_data);
			const col_asr = show_col(1, 'asr', times.asr, show_col_data);
			const col_sunset = settings.show_sunset == 1?show_col(1, 'sunset', times.sunset, show_col_data):'';
			const col_maghrib = show_col(1, 'maghrib', times.maghrib, show_col_data);
			const col_isha = show_col(1, 'isha', times.isha, show_col_data);
			const col_midnight = settings.show_midnight == 1? show_col(1, 'midnight', times.midnight, show_col_data):'';

			day_html +=
				`<div class='timetable_day_timetable_row_data ${isToday(date_current)==true?'timetable_day_today_row':''}'>
					${col_imsak}${col_fajr}${col_sunrise}${col_dhuhr}${col_asr}${col_sunset}${col_maghrib}${col_isha}${col_midnight}
				</div>
				<div class='timetable_day_timetable_footer'>
					<div class='timetable_day_timetable_footer_row'>
						<div>${user_place}</div>
						<div>${settings.show_gps == 1? REPORT_GLOBAL.first_language.gps_lat_text:''}</div>
						<div>${settings.show_gps == 1? user_gps_latitude.toLocaleString(user_locale + REPORT_GLOBAL.regional_def_locale_ext_prefix + REPORT_GLOBAL.regional_def_locale_ext_number_system + user_number_system):''}</div>
						<div>${settings.show_gps == 1? REPORT_GLOBAL.first_language.gps_long_text:''}</div>
						<div>${settings.show_gps == 1? user_gps_longitude.toLocaleString(user_locale + REPORT_GLOBAL.regional_def_locale_ext_prefix + REPORT_GLOBAL.regional_def_locale_ext_number_system + user_number_system):''}</div>
					</div>
					${settings.show_timezone == 1?`<div class='timetable_day_timetable_footer_row'>
														<div class='timetable_day_timezone'>${REPORT_GLOBAL.first_language.timezone_text + ' ' + user_timezone}</div>
													</div>`:''}
				</div>`;
			return day_html;
		};

		let html = '';
		for (const user_account_app_data_post of user_account_app_data_posts){	
			setMethod_praytimes(prayTimes, 
								user_account_app_data_post.prayer_method, 
								user_account_app_data_post.prayer_asr_method, 
								user_account_app_data_post.prayer_high_latitude_adjustment);
			
			html += day_timetable(	user_account_app_data_post.regional_language_locale, 
									user_account_app_data_post.regional_timezone, 
									user_account_app_data_post.regional_number_system, 
									user_account_app_data_post.regional_calendar_hijri_type,
									user_account_app_data_post.gps_lat_text,
									user_account_app_data_post.gps_long_text,
									user_account_app_data_post.prayer_time_format, 
									getNumberValue(user_account_app_data_post.prayer_hijri_date_adjustment), 
									user_account_app_data_post.description);
		}	
		return html;
	};
	/**
	 * Set css variable to calculate grid columns and font size depending how many columns used        
	 * @returns {string}
	 */
    const style_day_column = () =>{
        let day_columns = 6;
        if (settings.show_imsak == 1)
            day_columns++;
        if (settings.show_sunset == 1)
            day_columns++;
        if (settings.show_midnight == 1)
            day_columns++;
        return `--app_day_columns: ${day_columns} !important;`;
    };
	//TIMETABLE
	return `<div id='timetable_day' class='${settings.timetable_class} ${settings.theme_day} ${settings.arabic_script}' style='direction: ${settings.direction};${style_day_column()}'>
				<div id='timetable_header' class='display_font' style='${getstyle(settings.header_img_src, settings.header_align)}'>
					<div >${settings.header_txt1}</div>
					<div >${settings.header_txt2}</div>
					<div >${settings.header_txt3}</div>
					<div id='timetable_qr_code'><REPORT_QRCODE/></div>
				</div>
				<div id='timetable_day_timetable_header' class='display_font'>
					<div>${date_title4}</div>
					<div>${date_title5}</div>
				</div>
				<div id='timetable_day_timetable' class='default_font'>
					${timetable_headers(0, settings)}
					${timetable_data()}
				</div>
				<div class='copyright'>${REPORT_GLOBAL.app_copyright}</div>
				<div id='timetable_footer' class='display_font' style='${getstyle(settings.footer_img_src, settings.footer_align)}'>
					<div>${settings.footer_txt1}</div>
					<div>${settings.footer_txt2}</div>
					<div>${settings.footer_txt3}</div>
					<div></div>
				</div>
				<div id='timetable_day_time' class='default_font'></div>
			</div>`;
};

/**
 * Timetable month
 * @param {*} prayTimes 
 * @param {type_settings_report} settings 
 * @param {string} year_class 
 * @returns {string}
 */
const displayMonth = (prayTimes, settings, year_class='') => {
	const timezone_offset = getTimezoneOffset(settings.timezone);
	const items = getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, settings.locale);
	let month_data_class='';
	if (settings.number_system=='hanidec')
		month_data_class = 'default_font bignumbers';
	else
		month_data_class = 'default_font';
	/**
	 * 
	 * @returns {{	month:			number,
	 * 				year:			number,
	 * 				title:			string,
	 * 				date:			Date,
     *				endDate: 		Date,
	 *				date_hijri : 	[number, number, number],
	 *				endDate_hijri: 	[number, number, number]}}
	 */
	const getDatesAndTitle = () =>{
		let options;
		switch (settings.reporttype_year_month){
			case 'MONTH':{
				options = {timeZone: settings.timezone, month:'long', year: 'numeric'};
				break;
				}
			case 'YEAR':{
				options = {timeZone: settings.timezone, month:'long'};
				break;
				}
		}
		if (settings.calendartype=='GREGORIAN'){
			const month_gregorian = REPORT_GLOBAL.session_currentDate.getMonth();
			const year_greogrian = REPORT_GLOBAL.session_currentDate.getFullYear();
			return {month:			month_gregorian,
					year:			year_greogrian,
					title:			new Date(year_greogrian,month_gregorian,1).toLocaleDateString(settings.locale + 
										REPORT_GLOBAL.regional_def_locale_ext_prefix + 
										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
										(settings.number_system=='hanidec'?'latn':settings.number_system),
										/**@ts-ignore */
										options).toLocaleUpperCase(),
					date:			new Date(year_greogrian, month_gregorian, 1),
					endDate: 		new Date(year_greogrian, month_gregorian+ 1, 1),
					date_hijri : 	[0,0,0],
					endDate_hijri: 	[0,0,0]};
		}	
		else{
			const month_hijri = REPORT_GLOBAL.session_currentHijriDate[0];
			const year_hijri = REPORT_GLOBAL.session_currentHijriDate[1];
			/**@type{[number, number, number]} */
			const date_hijri 	= [year_hijri,month_hijri,1];
			/**@type{[number, number, number]} */
			const endDate_hijri = month_hijri == 12?[(year_hijri + 1), 1,1]:[year_hijri,(month_hijri + 1),1];
			/**@type{[number, number, number]} */
			const dateGregorian = getGregorian(date_hijri, settings.hijri_adj);
			/**@type{[number, number, number]} */
			const endDateGregorian = getGregorian(endDate_hijri, settings.hijri_adj);

			const title_date = getGregorian([year_hijri,month_hijri,1], 0);
			return {
					month:			month_hijri,
					year:			year_hijri,
					title:			new Date(title_date[0],title_date[1]-1,title_date[2]).toLocaleDateString(settings.locale + 
										REPORT_GLOBAL.regional_def_locale_ext_prefix + 
										REPORT_GLOBAL.regional_def_locale_ext_calendar + 
										settings.calendar_hijri_type + 
										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
										(settings.number_system=='hanidec'?'latn':settings.number_system), 
										/**@ts-ignore */
										options).toLocaleUpperCase(),
					date:			new Date(dateGregorian[0], dateGregorian[1]-1, dateGregorian[2]),
					endDate:		new Date(endDateGregorian[0], endDateGregorian[1]-1, endDateGregorian[2]),
					date_hijri : 	date_hijri,
					endDate_hijri: 	endDate_hijri
			};
		}
	};
	const data = getDatesAndTitle();
	// get start date and end date for both gregorian and hijri
	const timetable_data = ()=>{
		setMethod_praytimes(prayTimes, settings.method, settings.asr, settings.highlat);

		let month_html='';
		//DATA
		while (data.date < data.endDate) {
			const times = prayTimes.prototype.getTimes(data.date, [settings.gps_lat, settings.gps_long], timezone_offset, 0, 'Float');
			if (settings.calendartype=='GREGORIAN')
				times.day = data.date.getDate();
			else
				times.day = ++data.date_hijri[2] - 1;
			let row_class='';
			//check if today
			if (isToday(data.date))
				row_class = 'timetable_month_data_today_row ';
			//check if row should be highlighted
			switch (settings.highlight){
			case '1':{
				//check if friday
				if (data.date.getDay() == 5)
					row_class += 'timetable_month_data_highlight_row ';
				break;
				}
			case '2':{
				//check if saturday
				if (data.date.getDay() == 6)
					row_class += 'timetable_month_data_highlight_row ';
				break;
				}
			case '3':{
				//check if sunday
				if (data.date.getDay() == 0)
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
				/**@type{[number, number, number]} */
				const display_date = getGregorian([data.year,data.month,times.day], settings.hijri_adj);
				month_html += `<div class='${'timetable_month_data_row ' + row_class}'>
									${makeTableRow(times, items, data.year, data.month, settings, display_date)}
								</div>`;
			}
			else
				month_html += `<div class='${'timetable_month_data_row ' + row_class}'>
									${makeTableRow(times, items, data.year, data.month, settings)}
								</div>`;
			data.date.setDate(data.date.getDate()+ 1);
		}
		return month_html;
	};
	//TIMETABLE
	//add default class, theme class and font class		
	//set only id for month timetable, not year
	//set LTR or RTL on table layout if MONTH, on YEAR direction is set on the whole year layout
	return  `<div id='${settings.reporttype_year_month =='MONTH'?'timetable_month':''}'
				class='${settings.timetable_class} ${settings.timetable_month} ${settings.theme_month} ${settings.arabic_script} ${year_class}'
				style='${settings.reporttype_year_month =='MONTH'?'direction:' + settings.direction + ';':''}'>
				${settings.reporttype_year_month =='MONTH'?
				`<div id='timetable_header' class='display_font' style='${getstyle(settings.header_img_src, settings.header_align)}'>
					<div >${settings.header_txt1}</div>
					<div >${settings.header_txt2}</div>
					<div >${settings.header_txt3}</div>
					<div id='timetable_qr_code'><REPORT_QRCODE/></div>
				</div>`:''}
				<div id='timetable_month_data_header' class='display_font'>
					<div id='timetable_month_data_header_title1'>${data.title}</div>
					<div id='timetable_month_data_header_title2'>${REPORT_GLOBAL.first_language.timetable_title} ${settings.second_locale!='0'?REPORT_GLOBAL.second_language.timetable_title:''}</div>
				</div>
				<div id='timetable_month_data' class='${month_data_class}'>
					${timetable_headers(1, settings)}
					${timetable_data()}
				</div>
				${settings.reporttype_year_month =='MONTH'?
				`<div id='timetable_month_data_footer' class='default_font'>
					<div id='timetable_month_data_footer_row'>
						<div id='timetable_footer_col'>
							<div >${settings.place}</div>
							${settings.show_gps == 1?
								`
								<div >${REPORT_GLOBAL.first_language.gps_lat_text}</div>
								<div >${settings.gps_lat.toLocaleString(settings.locale + REPORT_GLOBAL.regional_def_locale_ext_prefix + REPORT_GLOBAL.regional_def_locale_ext_number_system + settings.number_system)}</div>
								<div >${REPORT_GLOBAL.first_language.gps_long_text}</div>
								<div >${settings.gps_long.toLocaleString(settings.locale + REPORT_GLOBAL.regional_def_locale_ext_prefix + REPORT_GLOBAL.regional_def_locale_ext_number_system + settings.number_system)}</div>`
								:''}
							${settings.show_timezone == 1?
								`<div >${REPORT_GLOBAL.first_language.timezone_text}</div>
								<div >${settings.timezone}</div>`
								:''}
							<div class='copyright'>${REPORT_GLOBAL.app_copyright}</div>
						</div>
					</div>
				</div>
				<div id='timetable_footer' class='display_font' style='${getstyle(settings.footer_img_src, settings.footer_align)}'>
					<div>${settings.footer_txt1}</div>
					<div>${settings.footer_txt2}</div>
					<div>${settings.footer_txt3}</div>
				</div>`:''}
			</div>`;
};
/**
 * Timetable month
 * @param {*} prayTimes 
 * @param {type_settings_report} settings 
 * @returns {string}
 */
const displayYear = (prayTimes, settings) => {
	const startmonth            = REPORT_GLOBAL.session_currentDate.getMonth();
	const starthijrimonth       = REPORT_GLOBAL.session_currentHijriDate[0];
	
	settings.reporttype_year_month        = 'YEAR';
	
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

	//show year with selected locale and number system for both Hijri and Gregorian
	const options_year = { timeZone: settings.timezone, 
						year: 'numeric',
						useGrouping:false};
	let timetable_title = '';
	if (settings.calendartype=='GREGORIAN'){
		timetable_title = REPORT_GLOBAL.session_currentDate.getFullYear().toLocaleString(	settings.locale + 
																							REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																							REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																							(settings.number_system=='hanidec'?'latn':settings.number_system), 
																							options_year);
	}
	else{
		//HIJRI
		timetable_title = REPORT_GLOBAL.session_currentHijriDate[1].toLocaleString(	settings.locale + 
																					REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																					REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																					(settings.number_system=='hanidec'?'latn':settings.number_system), 
																					options_year);
	}
	const months = new Array(12);
	REPORT_GLOBAL.session_currentDate.setMonth(startmonth);
	REPORT_GLOBAL.session_currentHijriDate[0] = starthijrimonth;

	//TIMETABLE
	const year_timetable = ()=>{
		return `<div id='timetable_year'
					class='${settings.timetable_class} ${settings.theme_year} ${settings.arabic_script}'
					style='direction: ${settings.direction}'>
					<div id='timetable_header' class='display_font' style='${getstyle(settings.header_img_src, settings.header_align)}'>
						<div >${settings.header_txt1}</div>
						<div >${settings.header_txt2}</div>
						<div >${settings.header_txt3}</div>
						<div id='timetable_qr_code'><REPORT_QRCODE/></div>
					</div>
					<div id='timetable_year_timetables_header' class='display_font'>
						<div>${timetable_title}</div>
						<div>${REPORT_GLOBAL.first_language.timetable_title} ${settings.second_locale!='0'?REPORT_GLOBAL.second_language.timetable_title:''}</div>
					</div>
					<div id='timetable_year_timetables' ${timetable_class}>
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
					<div id='timetable_year_timetables_footer' ${timetable_footer_class}>
						<div id='timetable_year_timetables_footer_row'>
							<div id='timetable_year_timetables_footer_col'>
								<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.place}</div>
								<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.show_gps == 1?REPORT_GLOBAL.first_language.gps_lat_text:''}</div>
								<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.show_gps == 1?settings.gps_lat.toLocaleString(settings.locale + 
																													REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																													REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																													settings.number_system):''}</div>
								<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.show_gps == 1?REPORT_GLOBAL.first_language.gps_long_text:''}</div>
								<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.show_gps == 1?settings.gps_long.toLocaleString(settings.locale + 
																													REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																													REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																													settings.number_system):''}</div>
								<div ${settings.show_timezone == 1?'class=""':'class="hidden"'}>${settings.show_timezone == 1?REPORT_GLOBAL.first_language.timezone_text:''}</div>
								<div ${settings.show_timezone == 1?'class=""':'class="hidden"'}>${settings.show_timezone == 1?settings.timezone:''}</div>
								<div class='copyright'>${REPORT_GLOBAL.app_copyright}</div>
							</div>
						</div>
					</div>
					<div id='timetable_footer' class='display_font' style='${getstyle(settings.footer_img_src, settings.footer_align)}'>
						<div >${settings.footer_txt1}</div>
						<div >${settings.footer_txt2}</div>
						<div >${settings.footer_txt3}</div>
						<div></div>
					</div>
				</div>`;
	};
	for (let monthindex = 1; monthindex <= 12; monthindex++) { 
		if (settings.calendartype=='GREGORIAN')
			REPORT_GLOBAL.session_currentDate.setMonth(monthindex -1);
		else
			REPORT_GLOBAL.session_currentHijriDate[0] = monthindex;
		months[monthindex-1] = displayMonth(prayTimes, settings, settings.timetable_year_month);
	}
	return year_timetable();
};
/**
 * Get QR Code in SVG format
 * @param {string|null} url 
 * @returns {Promise.<string>}
 */
const getQRCode = async (url) =>{
    
    return new Promise((resolve)=>{
        const options = {
                        text: url,
                        width: REPORT_GLOBAL['module_easy.qrcode_width'],
                        height: REPORT_GLOBAL['module_easy.qrcode_height'],
                        colorDark: REPORT_GLOBAL['module_easy.qrcode_color_dark'],
                        colorLight: REPORT_GLOBAL['module_easy.qrcode_color_light']
                    };
        const qrcode = new QRCode(options);
        qrcode.toSVGText().then((/**@type{string}*/data)=>{
            resolve(data);
        });
    });
	
};
/**
 * Create timetable day, month or year
 * @param {import('../../../../types.js').report_create_parameters} timetable_parameters
 * @returns {Promise.<string>}
 */
const timetable = async (timetable_parameters) => {
	const {ConfigGet, ConfigGetApp} = await import(`file://${process.cwd()}/server/config.service.js`);
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
	const getQRUrl = (decodedReportparameters) =>{
		const protocol = getNumberValue(ConfigGet('SERVER', 'HTTPS_ENABLE'))==1?'https':'http';
		const port_http = getNumberValue(ConfigGet('SERVER', 'HTTP_PORT'));
		const port_https = getNumberValue(ConfigGet('SERVER', 'HTTPS_PORT'));
		const port = getNumberValue(ConfigGet('SERVER', 'HTTPS_ENABLE'))==1?(port_https==443?'':`:${port_https}`):(port_https==80?'':`:${port_http}`);
		if (uid_view){
			const param_modified = decodedReportparameters.replace(`&uid_view=${uid_view}`, '');
			const report_id_no_uid_view = Buffer.from(param_modified).toString('base64');
			return `${protocol}://${ConfigGetApp(timetable_parameters.app_id,timetable_parameters.app_id, 'SUBDOMAIN')}.${ConfigGet('SERVER', 'HOST')}${port}/app-reports?reportid=${report_id_no_uid_view}`;
		}
		else
			return `${protocol}://${ConfigGetApp(timetable_parameters.app_id,timetable_parameters.app_id, 'SUBDOMAIN')}.${ConfigGet('SERVER', 'HOST')}${port}/app-reports?reportid=${timetable_parameters.reportid}`;
	};
	const result_parameters = ConfigGetApp(timetable_parameters.app_id, timetable_parameters.app_id, 'PARAMETERS');
	return await new Promise((resolve) => {
		for (const parameter of result_parameters) {
			if (parameter['COPYRIGHT'])
				REPORT_GLOBAL.app_copyright = parameter['COPYRIGHT'];
			if (parameter['REGIONAL_DEFAULT_CALENDAR_LANG'])
				REPORT_GLOBAL.regional_def_calendar_lang = parameter['REGIONAL_DEFAULT_CALENDAR_LANG'];
			if (parameter['REGIONAL_DEFAULT_LOCALE_EXT_PREFIX'])
				REPORT_GLOBAL.regional_def_locale_ext_prefix = parameter['REGIONAL_DEFAULT_LOCALE_EXT_PREFIX'];
			if (parameter['REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM'])
				REPORT_GLOBAL.regional_def_locale_ext_number_system = parameter['REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM'];
			if (parameter['REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR'])
				REPORT_GLOBAL.regional_def_locale_ext_calendar = parameter['REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR'];
			if (parameter['REGIONAL_DEFAULT_CALENDAR_TYPE_GREG'])
				REPORT_GLOBAL.regional_def_calendar_type_greg = parameter['REGIONAL_DEFAULT_CALENDAR_TYPE_GREG'];
			if (parameter['REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM'])
				REPORT_GLOBAL.regional_def_calendar_number_system = parameter['REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM'];
			//QR
			if (parameter['MODULE_EASY.QRCODE_WIDTH'])
				REPORT_GLOBAL['module_easy.qrcode_width'] = parseInt(parameter['MODULE_EASY.QRCODE_WIDTH']);
			if (parameter['MODULE_EASY.QRCODE_HEIGHT'])
				REPORT_GLOBAL['module_easy.qrcode_height'] = parseInt(parameter['MODULE_EASY.QRCODE_HEIGHT']);
			if (parameter['MODULE_EASY.QRCODE_COLOR_DARK'])
				REPORT_GLOBAL['module_easy.qrcode_color_dark'] = parameter['MODULE_EASY.QRCODE_COLOR_DARK'];
			if (parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'])
				REPORT_GLOBAL['module_easy.qrcode_color_light'] = parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'];
			if (parameter['MODULE_EASY.QRCODE_BACKGROUND_COLOR'])
				REPORT_GLOBAL['module_easy.qrcode_background_color'] = parameter['MODULE_EASY.QRCODE_BACKGROUND_COLOR'];
		}
		/**@type {[string, string][]} */
		const render_variables = [];
		const data_ViewStat = { client_ip:          			timetable_parameters.ip,
								client_user_agent:  			timetable_parameters.user_agent,
								client_longitude:  				timetable_parameters.longitude,
								client_latitude:    			timetable_parameters.latitude,
								user_account_id:    			uid_view,
								user_account_app_data_post_id:  getNumberValue(user_account_app_data_post_id)};
		insertUserPostView(timetable_parameters.app_id, data_ViewStat)
		.then(()=>{
			timetable_user_account_app_data_post_get(timetable_parameters.app_id, user_account_app_data_post_id)
			.then((user_account_app_data_post)=>{
				render_variables.push(['BODY_CLASSNAME',user_account_app_data_post.arabic_script]);
				render_variables.push(['REPORT_PAPER_CLASSNAME',user_account_app_data_post.papersize]);
				timetable_translate_settings(timetable_parameters.app_id, user_account_app_data_post.locale, user_account_app_data_post.second_locale).then(() => {
					/**@ts-ignore */
					import('praytimes').then(({default: prayTimes}) => {
						//set current date for report month
						REPORT_GLOBAL.session_currentDate = new Date();
						REPORT_GLOBAL.session_currentHijriDate = [0,0,0];
						//get Hijri date from initial Gregorian date
						REPORT_GLOBAL.session_currentHijriDate[0] = 
							parseInt(new Date(	REPORT_GLOBAL.session_currentDate.getFullYear(),
												REPORT_GLOBAL.session_currentDate.getMonth(),
												REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { month: 'numeric' }));
						REPORT_GLOBAL.session_currentHijriDate[1] = 
							//Number() does not work for hijri year that return characters after year, use parseInt() that only returns year
							parseInt(new Date(	REPORT_GLOBAL.session_currentDate.getFullYear(),
												REPORT_GLOBAL.session_currentDate.getMonth(),
												REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { year: 'numeric' }));
						set_prayer_method(timetable_parameters.app_id).then(() => {
							if (reporttype==0){
								timetable_day_user_account_app_data_posts_get(timetable_parameters.app_id, user_account_id)
								.then((user_account_app_data_posts_parameters)=>{
									render_variables.push(['REPORT_TIMETABLE',displayDay(prayTimes, user_account_app_data_post, user_account_app_data_posts_parameters)]);
									getQRCode(getQRUrl(decodedReportparameters)).then((qrcode)=>{
										render_variables.push(['REPORT_QRCODE',qrcode]);
										resolve(render_app_with_data(timetable_parameters.report, render_variables));
									});
								})
								.catch(()=>resolve(''));
							}
							else
								if (reporttype==1){
									render_variables.push(['REPORT_TIMETABLE',displayMonth(prayTimes, user_account_app_data_post)]);
									getQRCode(getQRUrl(decodedReportparameters)).then((qrcode)=>{
										render_variables.push(['REPORT_QRCODE',qrcode]);
										resolve(render_app_with_data(timetable_parameters.report, render_variables));
									});
								}
								else 
									if (reporttype==2){
										render_variables.push(['REPORT_TIMETABLE',displayYear(prayTimes, user_account_app_data_post)]);
										getQRCode(getQRUrl(decodedReportparameters)).then((qrcode)=>{
											render_variables.push(['REPORT_QRCODE',qrcode]);
											resolve(render_app_with_data(timetable_parameters.report, render_variables));
										});
									}
						});
					});
				});
			}) 
			.catch(()=>resolve(''));
		})
		.catch((/**@type{import('../../../../types.js').error}*/error)=>{
			resolve(error);
		});
	});
};
export {timetable};