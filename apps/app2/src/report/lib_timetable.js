/**
 * @module apps/app2/report/lib_timetable
 */

/**@type{import('../types.js').APP_REPORT_GLOBAL} */
const REPORT_GLOBAL = {
	app_copyright:'',
	session_currentDate:new Date(),
	session_currentHijriDate:[0,0],
	CommonModulePrayTimes_methods:{},
	regional_def_calendar_lang:'',
	regional_def_locale_ext_prefix:'',
	regional_def_locale_ext_number_system:'',
	regional_def_locale_ext_calendar:'',
	regional_def_calendar_type_greg:'',
	regional_def_calendar_number_system:'',
	timezone_text: '🌐',
	gps_lat_text:'📍',
	gps_long_text:''
};
Object.seal(REPORT_GLOBAL);

/**
 * @param {{}} props
 */
const template = props =>'  ';

/**
 * @param {{data:       {
 * 						commonMountdiv:null,
 * 						timetable:'DAY'|'MONTH'|'YEAR',
 * 						methods: {  id:string,
 *              					value:string, 
 *              					name:null, 
 *              					display_data: string, 
 *              					data2:string|null, 
 *              					data3:string|null, 
 *              					data4:string|null, 
 *              					data5:string|null}[],
 * 						user_account_app_data_post:import('../types.js').APP_REPORT_settings, 
 * 						button_id:'toolbar_btn_left'|'toolbar_btn_right'|null,
 * 						user_account_app_data_posts_parameters:import('../types.js').APP_REPORT_day_user_account_app_data_posts[]|null
 * 						},
 *          methods:    {
 * 						COMMON_DOCUMENT:null,
 * 						prayTimes:{adjust:function, getTimes:function, setMethod:function}
 * 						}}} props
 * @returns {{ lifecycle:import('../../../common_types.js').CommonComponentLifecycle, 
 *                      data:   	null,
 *                      methods:	{
 *									displayDay:function,
 * 									displayMonth:function,
 *									displayYear:function
 *									},
 *                      template:string}}
 */
const component = props => {
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
									[0,'零','líng'],	//alternative less formal: [0,'〇','líng'],
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
	 * @returns {import('../types.js').APP_REPORT_column_titles}
	 */
	const getColumnTitles = () => {
		return {day: '',
						weekday: '',
						weekday_tr: '',
						caltype: '',
						imsak: '',
						fajr: '',
						iqamat_fajr: '',
						sunrise: '',
						dhuhr: '',
						iqamat_dhuhr: '',
						asr: '',
						iqamat_asr: '',
						sunset: '',
						maghrib: '',
						iqamat_maghrib: '',
						isha: '',
						iqamat_isha: '',
						midnight: '',
						notes: ''};
	};
	/**
	 * Checks if today
	 * compares the current date in the timetable with current date of the client using the timetable timezone
	 * @param {Date} checkdate 
	 * @param {string|null} timezone
	 * @returns {boolean}
	 */
	const isToday = (checkdate, timezone=null) => {
		const date_user_timetable_timezone = 	new Date(new Date().setHours(new Date().getHours()+getTimezoneOffset(timezone ?? 'UTC')))
												.toLocaleDateString('en', {timeZone: 'UTC', year:'numeric',month:'numeric',day:'numeric'});
		return (checkdate.getMonth()+1 	== Number(date_user_timetable_timezone.split('/')[0])) && 
				(checkdate.getDate() 	== Number(date_user_timetable_timezone.split('/')[1])) && 
				(checkdate.getFullYear()== Number(date_user_timetable_timezone.split('/')[2]));
	};
	/**
	 * Sets prayer method
	 * 
	 * Calculation Methods
	 *		methods = {
	*			MWL: {
	*				name: 'Muslim World League',
	*				params: { fajr: 18, isha: 17 } },
	*			ISNA: {
	*				name: 'Islamic Society of North America (ISNA)',
	*				params: { fajr: 15, isha: 15 } },
	*			Egypt: {
	*				name: 'Egyptian General Authority of Survey',
	*				params: { fajr: 19.5, isha: 17.5 } },
	*			Makkah: {
	*				name: 'Umm Al-Qura University, Makkah',
	*				params: { fajr: 18.5, isha: '90 min' } },  // fajr was 19 degrees before 1430 hijri
	*			Karachi: {
	*				name: 'University of Islamic Sciences, Karachi',
	*				params: { fajr: 18, isha: 18 } },
	*			Tehran: {
	*				name: 'Institute of Geophysics, University of Tehran',
	*				params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' } },  // isha is not explicitly specified in this method
	*			Jafari: {
	*				name: 'Shia Ithna-Ashari, Leva Institute, Qum',
	*				params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' } }
	*		},
	*		modified here with more methods that are saved in database and will look like this:
	*		
	*		REPORT_GLOBAL.CommonModulePrayTimes_methods = {
	*			ALGERIAN: {
	*				name: 'Algerian Ministry of Religious Affairs and Wakfs',
	*				params: { fajr: 18, isha: 17 } },
	*			DIYANET: {
	*				name: 'Diyanet İşleri Başkanlığı',
	*				params: { fajr: 18, isha: 17 } },
	*			EGYPT: {
	*				name: 'Egyptian General Authority of Survey',
	*				params: { fajr: 19.5, isha: 17.5 } },
	*			EGYPTBIS: {
	*				name: 'Egyptian General Authority of Survey Bis',
	*				params: { fajr: 20, isha: 18 } },
	*			FRANCE15: {
	*				name: 'French15',
	*				params: { fajr: 15, isha: 15 } },
	*			FRANCE18: {
	*				name: 'French18',
	*				params: { fajr: 18, isha: 18 } },
	*			GULF: {
	*				name: 'Gulf region',
	*				params: { fajr: 19.5, isha: '90 min' } },
	*			KARACHI: {
	*				name: 'University of Islamic Sciences, Karachi',
	*				params: { fajr: 18, isha: 18 } },
	*			KEMENAG: {
	*				name: 'Kementerian Agama Republik Indonesia',
	*				params: { fajr: 20, isha: 18 } },
	*			ISNA: {
	*				name: 'Islamic Society of North America (ISNA)',
	*				params: { fajr: 15, isha: 15 } },
	*			JAFARI: {
	*				name: 'Shia Ithna-Ashari, Leva Institute, Qum',
	*				params: { fajr: 16, isha: 14, maghrib: 4, midnight: 'Jafari' } },
	*			JAKIM: {
	*				name: 'Jabatan Kemajuan Islam Malaysia',
	*				params: { fajr: 20, isha: 18} },
	*			MAKKAH: {
	*				name: 'Umm Al-Qura University, Makkah',
	*				params: { fajr: 18.5, isha: '90 min' } },  // fajr was 19 degrees before 1430 hijri
	*			MUIS: {
	*				name: 'Majlis Ugama Islam Singapura',
	*				params: { fajr: 20, isha: 18 } },	
	*			MWL: {
	*				name: 'Muslim World League',
	*				params: { fajr: 18, isha: 17 } },
	*			TUNISIA: {
	*				name: 'Tunisian Ministry of Religious Affairs',
	*				params: { fajr: 18, isha: 18 } },
	*			TEHRAN: {
	*				name: 'Institute of Geophysics, University of Tehran',
	*				params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: 'Jafari' } },  // isha is not explicitly specified in this method
	*			UOIF: {
	*				name: 'Union des Organisations Islamiques de France',
	*				params: { fajr: 12, isha: 12 } }
	*		};
	* @param {*} methods
	* @returns {void}
	*/
	const set_prayer_method = methods => {
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
					isha = {isha:Number(isha_data)};
				}			
				else
					isha = {isha:isha_data};
				return {fajr: {fajr: Number(fajr_data)},
						isha: isha,
						maghrib: (maghrib_data==null || maghrib_data=='')?{}:{maghrib: maghrib_data},
						midnight: (midnight_data==null || midnight_data=='')?{}:{midnight: midnight_data}};
			};
			for (const method of methods){
				const prayer_value = set_prayer_value(method.data2, method.data3,method.data4,method.data5);			
				//ES6 object spread 
				Object.assign(REPORT_GLOBAL.CommonModulePrayTimes_methods, 
					{[method.value.toUpperCase()]:{
						name:  method.display_data,
						params: { 	...prayer_value.fajr,
									...prayer_value.isha,
									...prayer_value.maghrib,
									...prayer_value.midnight
								}
						}
					});
			}
	};

	/**
	 * Checks if day is ramaday day
	 * @param {number} year 
	 * @param {number} month 
	 * @param {number} day 
	 * @param {string} timezone 
	 * @param {string} calendartype 
	 * @param {string|null} calendar_hijri_type 
	 * @param {number|null} hijri_adj 
	 * @returns {boolean}
	 */
	const is_ramadan_day = (year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adj) => {
		/**@type{Intl.DateTimeFormatOptions} */
		const options_calendartype = {timeZone: timezone,
									month: 'numeric'};
		if (calendartype=='GREGORIAN'){
			const date_temp = new Date(year,month,day);
			date_temp.setDate(date_temp.getDate() + (hijri_adj ?? 0));
			const ramadan_day = date_temp.toLocaleString(	REPORT_GLOBAL.regional_def_calendar_lang + 
															REPORT_GLOBAL.regional_def_locale_ext_prefix + 
															REPORT_GLOBAL.regional_def_locale_ext_calendar + 
															calendar_hijri_type + 
															REPORT_GLOBAL.regional_def_locale_ext_number_system + 
															REPORT_GLOBAL.regional_def_calendar_number_system, 
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
		prayTimes.setMethod(settings_method);
		//use methods without modifying original code
		if (REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.maghrib && 
			REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.midnight)
			prayTimes.adjust( { asr:      settings_asr,
								highLats: settings_highlat,
								fajr:     REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.fajr,
								isha:     REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.isha,
								maghrib:  REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.maghrib,
								midnight: REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.midnight} );
		else
			if (REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.maghrib)
				prayTimes.adjust( { asr:      settings_asr,
									highLats: settings_highlat,
									fajr:     REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.fajr,
									isha:     REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.isha,
									maghrib:  REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.maghrib} );
			else
				if (REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.midnight)
					prayTimes.adjust( { asr:      settings_asr,
										highLats: settings_highlat,
										fajr:     REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.fajr,
										isha:     REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.isha,
										midnight: REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.midnight} );
				else
					prayTimes.adjust( { asr:      settings_asr,
										highLats: settings_highlat,
										fajr:     REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.fajr,
										isha:     REPORT_GLOBAL.CommonModulePrayTimes_methods[settings_method].params.isha} );
	};
	/**
	 * Get style for header and footer
	 * @param {string} img_src 
	 * @param {string|null} align 
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
	 *			month: 					number,
	*			day:					number,
	*			calendartype:			string,
	*			show_fast_start_end:	number,
	*			timezone:				string,
	*			calendar_hijri_type:	string,
	*			hijri_adjustment:		number|null,
	*			locale:					string,
	*			number_system:			string,
	*			format:					string}} col_data
	* @returns 
	*/
	const show_col = (timetable, col, value, col_data) => {
		let display_value ='';
		if (value=='-----')
			display_value = value;
		else
			display_value = localTime(Number(value), 	col_data.locale + 
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
	 * Converts float to hour and minutes
	 * @param {number} float_time 
	 * @returns {{hours:number, minutes:number}}}
	 */
	const float_to_hourminutes = (float_time) =>{
		/**
		 * @param {number} a 
		 * @returns {number}
		*/
		const fixHour = (a) => fix(a, 24 );
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
		//const suffix = (data.format == '12h') ? suffixes[hours < 12 ? 0 : 1] : '';
		//const hour = (format == '24h') ? this.twoDigitsFormat(hours) : ((hours+ 12 -1)% 12+ 1);
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

			times from prayTimes.getTimes are returned with 24 hours format and minutes in decimals using Float format

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
						return getNumberString('hanidec', hour12) + ':' + 
										(0).toLocaleString(locale) + getNumberString('hanidec', minutes ?? calc.minutes);
					}
					else
						return getNumberString('hanidec', hour12) + ':' + 
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
	 * @param {import('../types.js').APP_REPORT_times} data 
	 * @param {import('../types.js').APP_REPORT_column_titles} columns 
	 * @param {number} year 
	 * @param {number} month 
	 * @param {import('../types.js').APP_REPORT_settings} settings 
	 * @param {[number, number, number]|null} date 
	 * @returns {string}
	 */
	const makeTableRow = (data, columns, year, month, settings, date = null) => {

		/**@type{Intl.DateTimeFormatOptions} */
		const options_weekday = {weekday:'long'};
		/**@type{Intl.DateTimeFormatOptions} */
		const options_calendartype = {timeZone: settings.timezone, 
									dateStyle: 'short'};
		let iqamat;
		let html='';

		/**
		 * @param {string} column
		 */
		const get_class = column =>{
			switch (column){
				case 'caltype':{
					return 'timetable_month_data_calendartype';
				}
				case 'weekday':
				case 'weekday_tr':{
					return 'timetable_month_data_date;';
				}
				case 'notes':{
					return 'timetable_month_data_notes';
				}
				default:{
					return '';
				}
			}
		};
		/**
		 * @param {string} column
		 * @param {string} calendartype
		 * @param {string} number_system
		 */
		const get_data = (column, calendartype, number_system) =>{
			switch (column){
				case 'day':{
					return number_system=='hanidec'?
						getNumberString(settings.number_system, data[column]):
							data[column].toLocaleString(settings.locale + 
														REPORT_GLOBAL.regional_def_locale_ext_prefix + 
														REPORT_GLOBAL.regional_def_locale_ext_number_system + 
														settings.number_system);
				}
				case 'caltype':{
					const date_temp = new Date(year,month,data.day);
					date_temp.setDate(date_temp.getDate() + settings.hijri_adj);
					return calendartype=='GREGORIAN'?
						date_temp.toLocaleDateString(settings.locale + 
							REPORT_GLOBAL.regional_def_locale_ext_prefix + 
							REPORT_GLOBAL.regional_def_locale_ext_calendar + 
							settings.calendar_hijri_type + 
							REPORT_GLOBAL.regional_def_locale_ext_number_system + 
							(settings.number_system=='hanidec'?'latn':settings.number_system), options_calendartype):
						new Date(date?date[0]:0,(date?date[1]:0)-1,date?date[2]:0).toLocaleDateString(settings.locale + 
							REPORT_GLOBAL.regional_def_locale_ext_prefix + 
							REPORT_GLOBAL.regional_def_locale_ext_calendar + 
							REPORT_GLOBAL.regional_def_calendar_type_greg + 
							REPORT_GLOBAL.regional_def_locale_ext_number_system + 
							(settings.number_system=='hanidec'?'latn':settings.number_system), options_calendartype);
				}
				case 'weekday':
				case 'weekday_tr':{
					const date_temp = new Date(year,month,data.day);
					date_temp.setDate(date_temp.getDate() + settings.hijri_adj);
					return calendartype=='GREGORIAN'?
						date_temp.toLocaleDateString(column=='weekday'?settings.locale:settings.second_locale + 
							REPORT_GLOBAL.regional_def_locale_ext_prefix + 
							REPORT_GLOBAL.regional_def_locale_ext_calendar + 
							settings.calendar_hijri_type, options_weekday):
						new Date(date?date[0]:0,(date?date[1]:0)-1,date?date[2]:0).toLocaleDateString(column=='weekday'?settings.locale:settings.second_locale + 
							REPORT_GLOBAL.regional_def_locale_ext_prefix + 
							REPORT_GLOBAL.regional_def_locale_ext_calendar + 
							REPORT_GLOBAL.regional_def_calendar_type_greg, 
							options_weekday);
				}
				case 'iqamat_fajr':
				case 'iqamat_dhuhr':
				case 'iqamat_asr':
				case 'iqamat_maghrib':
				case 'iqamat_isha':{
					iqamat = calculateIqamat(settings[column], data[column.split('_')[1]]);
					return localTime(null, settings.locale + 		REPORT_GLOBAL.regional_def_locale_ext_prefix + 
									REPORT_GLOBAL.regional_def_locale_ext_number_system + 
									settings.number_system, 
									settings.format, 
									iqamat.hours, 
									iqamat.minutes);	
				}
				case 'notes':{
					return `${''}<div contentEditable='true' class='common_input'/>`;
				}
				default:{
					return '';
				}
			}
		};
		for (const column in columns) {
			iqamat = '';
			//Check if column should be displayed
			if ( (column=='weekday' && (settings.show_weekday ==0 || settings.reporttype_year_month =='YEAR'))||
					(column=='weekday_tr' && ((settings.second_locale =='' ||
										settings.show_weekday ==0) || settings.reporttype_year_month =='YEAR'))||
					(column=='caltype' && (settings.show_calendartype ==0 || settings.reporttype_year_month =='YEAR'))||
					(column=='imsak' && (settings.show_imsak ==0 || settings.reporttype_year_month =='YEAR'))||
					(column=='sunrise' && settings.reporttype_year_month =='YEAR')||
					(column=='iqamat_fajr' && (settings.iqamat_fajr =='0' || settings.reporttype_year_month =='YEAR'))||
					(column=='iqamat_dhuhr' && (settings.iqamat_dhuhr=='0' || settings.reporttype_year_month =='YEAR'))||
					(column=='iqamat_asr' && (settings.iqamat_asr=='0' || settings.reporttype_year_month =='YEAR'))||
					(column=='iqamat_maghrib' && (settings.iqamat_maghrib=='0' || settings.reporttype_year_month =='YEAR'))||
					(column=='iqamat_isha' && (settings.iqamat_isha=='0' || settings.reporttype_year_month =='YEAR'))||
					(column=='sunset' && (settings.show_sunset ==0 || settings.reporttype_year_month =='YEAR'))||
					(column=='midnight' && (settings.show_midnight ==0 || settings.reporttype_year_month =='YEAR'))||
					(column=='notes' && (settings.show_notes ==0 || settings.reporttype_year_month =='YEAR')))
				null;
			else{

				switch(column){
					case 'day':
					case 'caltype':
					case 'weekday':
					case 'weekday_tr':
					case 'iqamat_fajr':
					case 'iqamat_dhuhr':
					case 'iqamat_asr':
					case 'iqamat_maghrib':
					case 'iqamat_isha':
					case 'notes':{
						html += `<div class='timetable_month_data_col ${get_class(column)}'>${get_data(column, settings.calendartype, settings.number_system)}</div>`;
						break;
						}
					default:{
						//time columns imsak, fajr, dhuhr, asr, maghrib, isha, midnight
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
	 * Set current date and current Hijri Date after navigating in app
	 * @param {'DAY'|'MONTH'|'YEAR'} timetable
	 * @param {import('../types.js').APP_REPORT_settings['ui_navigation_left']} ui_navigation_left
	 * @param {import('../types.js').APP_REPORT_settings['ui_navigation_right']} ui_navigation_right
	 * @param {'GREGORIAN'|'HIJRI'} calendartype
	 * @param {import('../types.js').APP_REPORT_settings['ui_navigation_left']|import('../types.js').APP_REPORT_settings['ui_navigation_right']} button_id
	 * @returns {void}
	 */
	const setCurrent = (timetable, ui_navigation_left, ui_navigation_right, calendartype, button_id) =>{
		switch (timetable){
			case 'DAY':{
				if (button_id == ui_navigation_left){
					REPORT_GLOBAL.session_currentDate.setDate(REPORT_GLOBAL.session_currentDate.getDate() -1);
				}
				else 
					if (button_id == ui_navigation_right){
						REPORT_GLOBAL.session_currentDate.setDate(REPORT_GLOBAL.session_currentDate.getDate() +1);
						}
				break;
			}
			case 'MONTH':{
				if (calendartype=='GREGORIAN'){
					//get previous or next Gregorian month using current Gregorian month
					if (button_id == ui_navigation_left)
						REPORT_GLOBAL.session_currentDate.setMonth(REPORT_GLOBAL.session_currentDate.getMonth() -1);
					else 
						if (button_id == ui_navigation_right)
							REPORT_GLOBAL.session_currentDate.setMonth(REPORT_GLOBAL.session_currentDate.getMonth() +1);
				}
				else{
					//get previous or next Hijri month using current Hijri month  
					if (button_id == ui_navigation_left){
						if (REPORT_GLOBAL.session_currentHijriDate[0] ==1){
							REPORT_GLOBAL.session_currentHijriDate[0] = 12;
							REPORT_GLOBAL.session_currentHijriDate[1] = REPORT_GLOBAL.session_currentHijriDate[1] - 1;
						}
						else
							REPORT_GLOBAL.session_currentHijriDate[0] = REPORT_GLOBAL.session_currentHijriDate[0] - 1;
					}
					else 
						if (button_id == ui_navigation_right){
							if (REPORT_GLOBAL.session_currentHijriDate[0] ==12){
								REPORT_GLOBAL.session_currentHijriDate[0] = 1;
								REPORT_GLOBAL.session_currentHijriDate[1] = REPORT_GLOBAL.session_currentHijriDate[1] + 1;
							}
							else
								REPORT_GLOBAL.session_currentHijriDate[0] = REPORT_GLOBAL.session_currentHijriDate[0] + 1;
						}
				}
				break;
			}
			case 'YEAR':{
				//if item_id is set then navigate previous/next month/year
				if (button_id == ui_navigation_left){
					if (calendartype=='GREGORIAN')
						REPORT_GLOBAL.session_currentDate.setFullYear(REPORT_GLOBAL.session_currentDate.getFullYear() - 1);
					else
						REPORT_GLOBAL.session_currentHijriDate[1] = REPORT_GLOBAL.session_currentHijriDate[1] - 1;
				}
				else 
					if (button_id == ui_navigation_right){
						if (calendartype=='GREGORIAN')
							REPORT_GLOBAL.session_currentDate.setFullYear(REPORT_GLOBAL.session_currentDate.getFullYear() + 1);
						else
							REPORT_GLOBAL.session_currentHijriDate[1] = REPORT_GLOBAL.session_currentHijriDate[1] + 1;
						}
					}
		}
	};

	/**
	 * Timetable day
	 * @param {*} prayTimes
	 * @param {import('../types.js').APP_REPORT_settings} settings 
	 * @param {import('../types.js').APP_REPORT_settings['ui_navigation_left']|import('../types.js').APP_REPORT_settings['ui_navigation_right']} button_id
	 * @param {import('../types.js').APP_REPORT_day_user_account_app_data_posts[]} user_settings 
	 * @returns {string}
	 */
	const displayDay = (prayTimes, settings, button_id, user_settings) => {
		let times; 
		/**@type{Intl.DateTimeFormatOptions} */
		const options = { timeZone: settings.timezone, 
						weekday: 'long', 
						year: 'numeric', 
						month: 'long', 
						day: 'numeric'};
		/**@type{Intl.DateTimeFormatOptions} */
		const options_hijri = { timeZone: settings.timezone, 
						year: 'numeric', 
						month: 'long', 
						day: 'numeric'};
		if (button_id)
			setCurrent('DAY', settings.ui_navigation_left, settings.ui_navigation_right, settings.calendartype, button_id);

		/**@type{*}*/
		const date_current = new Date(	REPORT_GLOBAL.session_currentDate.getFullYear(),
										REPORT_GLOBAL.session_currentDate.getMonth(),
										REPORT_GLOBAL.session_currentDate.getDate());
		const title_gregorian = date_current.toLocaleDateString(settings.locale + 
										REPORT_GLOBAL.regional_def_locale_ext_prefix + 
										REPORT_GLOBAL.regional_def_locale_ext_number_system + 
										(settings.number_system=='hanidec'?'latn':settings.number_system), options).toLocaleUpperCase();
		date_current.setDate(date_current.getDate() + settings.hijri_adj);
		const title_hijri = date_current.toLocaleDateString(settings.locale + 
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
			 * @param {number|null} user_gps_latitude 
			 * @param {number|null} user_gps_longitude 
			 * @param {string} user_format 
			 * @param {number|null} user_hijri_adjustment 
			 * @param {string} user_place 
			 * @returns {string}
			 */
			const day_timetable = (	user_locale, user_timezone, user_number_system, user_calendar_hijri_type,
									user_gps_latitude, user_gps_longitude, user_format, user_hijri_adjustment, user_place) =>{
				let day_html = '';
				const timezone_offset = getTimezoneOffset(user_timezone);
				times = prayTimes.getTimes(REPORT_GLOBAL.session_currentDate, [user_gps_latitude, user_gps_longitude], 
											/**@ts-ignore */
											parseInt(timezone_offset), 
											0, 'Float');

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
					`<div class='timetable_day_timetable_row_data ${isToday(date_current, settings.timezone)==true?'timetable_day_today_row':''}'>
						${col_imsak}${col_fajr}${col_sunrise}${col_dhuhr}${col_asr}${col_sunset}${col_maghrib}${col_isha}${col_midnight}
					</div>
					<div class='timetable_day_timetable_footer'>
						<div class='timetable_day_timetable_footer_row'>
							<div>${user_place}</div>
							<div>${settings.show_gps == 1 ? REPORT_GLOBAL.gps_lat_text:''}</div>
							<div>${settings.show_gps == 1 ? user_gps_latitude?.toLocaleString(user_locale + REPORT_GLOBAL.regional_def_locale_ext_prefix + REPORT_GLOBAL.regional_def_locale_ext_number_system + user_number_system):''}</div>
							<div>${settings.show_gps == 1 ? REPORT_GLOBAL.gps_long_text:''}</div>
							<div>${settings.show_gps == 1 ? user_gps_longitude?.toLocaleString(user_locale + REPORT_GLOBAL.regional_def_locale_ext_prefix + REPORT_GLOBAL.regional_def_locale_ext_number_system + user_number_system):''}</div>
						</div>
						${settings.show_timezone == 1?`<div class='timetable_day_timetable_footer_row'>
															<div class='timetable_day_timezone'>${REPORT_GLOBAL.timezone_text + ' ' + user_timezone}</div>
														</div>`:''}
					</div>`;
				return day_html;
			};

			let html = '';
			for (const user_setting of user_settings){	
				setMethod_praytimes(prayTimes, 
									user_setting.prayer_method, 
									user_setting.prayer_asr_method, 
									user_setting.prayer_high_latitude_adjustment);
				
				html += day_timetable(	user_setting.regional_language_locale, 
										user_setting.regional_timezone, 
										user_setting.regional_number_system, 
										user_setting.regional_calendar_hijri_type,
										user_setting.gps_lat_text, 
										user_setting.gps_long_text,
										user_setting.prayer_time_format, 
										Number(user_setting.prayer_hijri_date_adjustment), 
										user_setting.description);
			}	
			return html;
		};
		/**
		 * Set css variable to calculate grid columns and font size depending how many columns used        
		 * @returns {string}
		 */
		const style_day_column = () =>{
			//set css variable to calculate grid columns and font size depending how many columns used        
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
					</div>
					<div id='timetable_header_date' class='display_font'>
						<div>${title_gregorian}</div>
						<div>${title_hijri}</div>
					</div>
					<div id='timetable_day_timetable' class='default_font'>
						<div class='timetable_day_timetable_header_row'>
							${settings.show_imsak==1?'<div class=\'timetable_icon timetable_header_col_imsak\'></div>':''}
							<div class='timetable_icon timetable_header_col_fajr'></div>
							<div class='timetable_icon timetable_header_col_sunrise'></div>
							<div class='timetable_icon timetable_header_col_dhuhr'></div>
							<div class='timetable_icon timetable_header_col_asr'></div>
							${settings.show_sunset==1?'<div class=\'timetable_icon timetable_header_col_sunset\'></div>':''}
							<div class='timetable_icon timetable_header_col_maghrib'></div>
							<div class='timetable_icon timetable_header_col_isha'></div>
							${settings.show_midnight==1?'<div class=\'timetable_icon timetable_header_col_midnight\'></div>':''}
						</div>
						${timetable_data()}
					</div>
					<div class='copyright'>${REPORT_GLOBAL.app_copyright}</div>
					<div id='timetable_footer' class='display_font' style='${getstyle(settings.footer_img_src, settings.footer_align)}'>
						<div>${settings.footer_txt1}</div>
						<div>${settings.footer_txt2}</div>
						<div>${settings.footer_txt3}</div>
						<div></div>
					</div>
				</div>`;
	};

	/**
	 * Timetable month
	 * @param {*} prayTimes
	 * @param {import('../types.js').APP_REPORT_settings} settings 
	 * @param {import('../types.js').APP_REPORT_settings['ui_navigation_left']|import('../types.js').APP_REPORT_settings['ui_navigation_right']} button_id
	 * @param {string} year_class 
	 * @returns {string}
	 */
	const displayMonth = (prayTimes, settings, button_id, year_class='') => {
		const timezone_offset = getTimezoneOffset(settings.timezone);
		if (button_id)
			setCurrent('MONTH', settings.ui_navigation_left, settings.ui_navigation_right, settings.calendartype, button_id);
		const items = getColumnTitles();
		let month_data_class='';
		if (settings.number_system=='hanidec')
			month_data_class = 'default_font bignumbers';
		else
			month_data_class = 'default_font';
		/**
		 * Gets dates and titles
		 * Only one title of gregorian and hijri date can be displayed
		 * @returns {{	month:			number,
		 *				year:			number,
		*				title_gregorian:string,
		*				title_hijri:	string,
		*				date:			Date,
		*				endDate:		Date,
		*				date_hijri : 	[number, number,number],
		*				endDate_hijri: 	[number, number,number]}} 
		*/
		const getDatesAndTitle = () =>{
			/**@type{Intl.DateTimeFormatOptions} */
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
				default:{
					options = {timeZone: settings.timezone, month:'long'};
					break;
				}
			}
			if (settings.calendartype=='GREGORIAN'){
				const month_gregorian 		= REPORT_GLOBAL.session_currentDate.getMonth();
				const year_gregorian 		= REPORT_GLOBAL.session_currentDate.getFullYear();

				//use format new Date('[year]-[month]-01T12:00:00.000Z')
				//format new Date(	year,month,1) will not produce same month for all timezones
				const gregorian_date_start 	= new Date(`${year_gregorian}-${(month_gregorian+1).toString().padStart(2,'0')}-01T12:00:00.000Z`);
				let gregorian_date_end = new Date(gregorian_date_start);
				gregorian_date_end 	= new Date(gregorian_date_end.setMonth(gregorian_date_end.getMonth()+1));

				return {month:			month_gregorian,
						year:			year_gregorian,

						title_gregorian:gregorian_date_start.toLocaleDateString(settings.locale + 
													REPORT_GLOBAL.regional_def_locale_ext_prefix + 
													REPORT_GLOBAL.regional_def_locale_ext_number_system + 
													(settings.number_system=='hanidec'?'latn':settings.number_system), 
													options).toLocaleUpperCase(),
						title_hijri:	'',
										
						date:			gregorian_date_start,
						endDate: 		gregorian_date_end,
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
						title_gregorian:'',
						title_hijri:	new Date(title_date[0],title_date[1]-1,title_date[2]).toLocaleDateString(settings.locale + 
											REPORT_GLOBAL.regional_def_locale_ext_prefix + 
											REPORT_GLOBAL.regional_def_locale_ext_calendar + 
											settings.calendar_hijri_type + 
											REPORT_GLOBAL.regional_def_locale_ext_number_system + 
											(settings.number_system=='hanidec'?'latn':settings.number_system),
											options).toLocaleUpperCase(),
						date:			new Date(dateGregorian[0], dateGregorian[1]-1, dateGregorian[2]),
						endDate:		new Date(endDateGregorian[0], endDateGregorian[1]-1, endDateGregorian[2]),
						date_hijri : 	date_hijri,
						endDate_hijri: 	endDate_hijri
				};
			}
		};
		const data = getDatesAndTitle();

		/**
		 * Returns class for highlight
		 * @param {string} highlight 
		 * @param {number} day_week
		 * @param {number} day_timetable
		 */
		const highlight_row = (highlight, day_week, day_timetable) =>{
			switch (highlight){
				case '1':{
					//check if friday
					if (day_week == 5)
						return 'timetable_month_data_highlight_row';
					break;
				}
				case '2':{
					//check if saturday
					if (day_week == 6)
						return 'timetable_month_data_highlight_row';
					break;
				}
				case '3':{
					//check if sunday
					if (day_week == 0)
						return 'timetable_month_data_highlight_row';
					break;
					}
				case '4':{
					//check if day 1-10
					if (day_timetable < 11)
						return 'timetable_month_data_day_01-10_row';
					//check if day 11-20
					if (day_timetable > 10 && day_timetable < 21)
						return 'timetable_month_data_day_11-20_row';
					//check if day 21 - 
					if (day_timetable > 20)
						return 'timetable_month_data_day_21-30_row';
					break;
				}
			}
			return '';
		};

		// get start date and end date for both gregorian and hijri
		const timetable_data = ()=>{
			setMethod_praytimes(prayTimes, settings.method, settings.asr, settings.highlat);

			let month_html='';
			//DATA
			while (data.date < data.endDate) {
				const times = prayTimes.getTimes(data.date, [settings.gps_lat, settings.gps_long], timezone_offset, 0, 'Float');
				if (settings.calendartype=='GREGORIAN')
					times.day = data.date.getDate();
				else
					times.day = ++data.date_hijri[2] - 1;

				month_html += `<div class='${'timetable_month_data_row'} ${isToday(data.date, settings.timezone)?'timetable_month_data_today_row':''} ${highlight_row(settings.highlight, data.date.getDay(), times.day)}'>
									${makeTableRow(times, items, data.year, data.month, settings, settings.calendartype=='HIJRI'?getGregorian([data.year,data.month,times.day], settings.hijri_adj):null)}
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
					${settings.reporttype_year_month =='MONTH'?'style=direction:' + settings.direction + ';':''}>
					${settings.reporttype_year_month =='MONTH'?
					`<div id='timetable_header' class='display_font' style='${getstyle(settings.header_img_src, settings.header_align)}'>
						<div >${settings.header_txt1}</div>
						<div >${settings.header_txt2}</div>
						<div >${settings.header_txt3}</div>
					</div>`:''}
					<div id='timetable_header_date' class='display_font'>
						<div>${data.title_gregorian}</div>
						<div>${data.title_hijri}</div>
					</div>
					<div id='timetable_month_data' class='${month_data_class}'>
						<div class='timetable_month_data_row timetable_month_data_header_row'>
							<div class='timetable_month_data_col timetable_icon timetable_header_col_day'></div>
							${settings.reporttype_year_month=='MONTH' 	&& settings.show_weekday==1?		'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_weekday\'></div>':''}
							${settings.reporttype_year_month=='MONTH' 	&& settings.second_locale !='' 
																		&& settings.show_weekday==1?		'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_weekday\'></div>':''}
							${settings.reporttype_year_month=='MONTH' 	&& settings.show_calendartype==1?	'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_caltype\'></div>':''}
							${settings.reporttype_year_month=='MONTH' 	&& settings.show_imsak==1?			'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_imsak\'></div>':''}
							<div class='timetable_month_data_col timetable_icon timetable_header_col_fajr'></div>
							${settings.reporttype_year_month=='MONTH' 	&& settings.iqamat_fajr!='0'?		'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_iqamat\'></div>':''}
							${settings.reporttype_year_month=='MONTH'?										'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_sunrise\'></div>':''}
							<div class='timetable_month_data_col timetable_icon timetable_header_col_dhuhr'></div>
							${settings.reporttype_year_month=='MONTH' 	&& settings.iqamat_dhuhr!='0'?		'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_iqamat\'></div>':''}
							<div class='timetable_month_data_col timetable_icon timetable_header_col_asr'></div>
							${settings.reporttype_year_month=='MONTH' 	&& settings.iqamat_asr!='0'?		'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_iqamat\'></div>':''}
							${settings.reporttype_year_month=='MONTH' 	&& settings.show_sunset==1?			'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_sunset\'></div>':''}
							<div class='timetable_month_data_col timetable_icon timetable_header_col_maghrib'></div>
							${settings.reporttype_year_month=='MONTH' 	&& settings.iqamat_maghrib!='0'?	'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_iqamat\'></div>':''}
							<div class='timetable_month_data_col timetable_icon timetable_header_col_isha'></div>
							${settings.reporttype_year_month=='MONTH' 	&& settings.iqamat_isha!='0'?		'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_iqamat\'></div>':''}
							${settings.reporttype_year_month=='MONTH' 	&& settings.show_midnight==1?		'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_midnight\'></div>':''}
							${settings.reporttype_year_month=='MONTH' 	&& settings.show_notes==1 ?			'<div class=\'timetable_month_data_col timetable_icon timetable_header_col_notes\'></div>':''}
						</div>
						${timetable_data()}
					</div>
					${settings.reporttype_year_month =='MONTH'?
					`<div id='timetable_month_data_footer' class='default_font'>
						<div id='timetable_month_data_footer_row'>
							<div id='timetable_footer_col'>
								<div >${settings.place}</div>
								${settings.show_gps == 1?
									`
									<div >${REPORT_GLOBAL.gps_lat_text}</div>
									<div >${Number(settings.gps_lat).toLocaleString(
																			settings.locale + 
																			REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																			REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																			settings.number_system)}</div>
									<div >${REPORT_GLOBAL.gps_long_text}</div>
									<div >${Number(settings.gps_long).toLocaleString(
																			settings.locale + 
																			REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																			REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																			settings.number_system)}</div>`
									:''}
								${settings.show_timezone == 1?
									`<div >${REPORT_GLOBAL.timezone_text}</div>
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
	 * Timetable year
	 * @param {*} prayTimes
	 * @param {import('../types.js').APP_REPORT_settings} settings 
	 * @param {import('../types.js').APP_REPORT_settings['ui_navigation_left']|import('../types.js').APP_REPORT_settings['ui_navigation_right']} button_id
	 * @returns {string}
	 */
	const displayYear = (prayTimes, settings, button_id) => {
		const startmonth            = REPORT_GLOBAL.session_currentDate.getMonth();
		const starthijrimonth       = REPORT_GLOBAL.session_currentHijriDate[0];
		
		settings.reporttype_year_month        = 'YEAR';
		
		//if both second language and both transliteration and translation columntitles will be shown
		//add class to fix size
		let timetable_class ='';
		let timetable_footer_class ='';
		if (settings.second_locale!='') {
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
		if (button_id)
			setCurrent('YEAR', settings.ui_navigation_left, settings.ui_navigation_right, settings.calendartype, button_id);
		

		//show year with selected locale and number system for both Hijri and Gregorian
		const options_year = { 	timeZone: settings.timezone, 
								year: 'numeric',
								useGrouping:false};
		let timetable_title = '';
		if (settings.calendartype=='GREGORIAN'){
			timetable_title = REPORT_GLOBAL.session_currentDate.getFullYear().toLocaleString(settings.locale + 
																								REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																								REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																								(settings.number_system=='hanidec'?'latn':settings.number_system), 
																								options_year);
		}
		else{
			//HIJRI
			timetable_title = REPORT_GLOBAL.session_currentHijriDate[1].toLocaleString(settings.locale + 
																								REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																								REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																								(settings.number_system=='hanidec'?'latn':settings.number_system), 
																								options_year);
		}
		const months = new Array(12);
		
		//TIMETABLE
		const year_timetable = ()=>{
			return `<div id='timetable_year'
						class='${settings.timetable_class} ${settings.theme_year} ${settings.arabic_script}'
						style='direction: ${settings.direction}'>
						<div id='timetable_header' class='display_font' style='${getstyle(settings.header_img_src, settings.header_align)}'>
							<div >${settings.header_txt1}</div>
							<div >${settings.header_txt2}</div>
							<div >${settings.header_txt3}</div>
						</div>
						<div id='timetable_year_timetables_header' class='display_font'>
							<div>${timetable_title}</div>
							<div></div>
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
									<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.show_gps == 1?REPORT_GLOBAL.gps_lat_text:''}</div>
									<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.show_gps == 1?Number(settings.gps_lat).toLocaleString(settings.locale + 
																														REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																														REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																														settings.number_system):''}</div>
									<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.show_gps == 1?REPORT_GLOBAL.gps_long_text:''}</div>
									<div ${settings.show_gps == 1?'class=""':'class="hidden"'}>${settings.show_gps == 1?Number(settings.gps_long).toLocaleString(settings.locale + 
																														REPORT_GLOBAL.regional_def_locale_ext_prefix + 
																														REPORT_GLOBAL.regional_def_locale_ext_number_system + 
																														settings.number_system):''}</div>
									<div ${settings.show_timezone == 1?'class=""':'class="hidden"'}>${settings.show_timezone == 1?REPORT_GLOBAL.timezone_text:''}</div>
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
			months[monthindex-1] = displayMonth(prayTimes, settings, null, settings.timetable_year_month);		
		}
		REPORT_GLOBAL.session_currentDate.setMonth(startmonth);
		REPORT_GLOBAL.session_currentHijriDate[0] = starthijrimonth;
		return year_timetable();
	};
	let html = '';
	set_prayer_method(props.data.methods);
	switch (props.data.timetable){
		case 'DAY':{
			html = displayDay(props.methods.prayTimes, props.data.user_account_app_data_post, props.data.button_id, props.data.user_account_app_data_posts_parameters ?? []);
			break;
		}
		case 'MONTH':{
			html = displayMonth(props.methods.prayTimes, props.data.user_account_app_data_post, props.data.button_id);
			break;
		}
		case 'YEAR':{
			html = displayYear(props.methods.prayTimes, props.data.user_account_app_data_post, props.data.button_id);
			break;
		}
		default:{
			html = '';
		}
	}
	return {
        lifecycle:  null,
        data:       null,
        methods:    {
					displayDay,
					displayMonth,
					displayYear
					},
        template:   html
    };
};
export {REPORT_GLOBAL, component};