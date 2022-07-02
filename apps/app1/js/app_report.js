/*----------------------- */
/* Timetable common functions */
/*----------------------- */
function getColumnTitles(transliteration = 0, calendartype, locale, second_locale, check_second = 'Y', locale2) {
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
		coltitle['imsak'] = window.global_first_language.coltitle_transliteration_imsak;
		coltitle['fajr'] = window.global_first_language.coltitle_transliteration_fajr;
		coltitle['fajr_iqamat'] = window.global_first_language.coltitle_transliteration_fajr_iqamat;
		coltitle['sunrise'] = window.global_first_language.coltitle_transliteration_sunrise;
		coltitle['dhuhr'] = window.global_first_language.coltitle_transliteration_dhuhr;
		coltitle['dhuhr_iqamat'] = window.global_first_language.coltitle_transliteration_dhuhr_iqamat;
		coltitle['asr'] = window.global_first_language.coltitle_transliteration_asr;
		coltitle['asr_iqamat'] = window.global_first_language.coltitle_transliteration_asr_iqamat;
		coltitle['sunset'] = window.global_first_language.coltitle_transliteration_sunset;
		coltitle['maghrib'] = window.global_first_language.coltitle_transliteration_maghrib;
		coltitle['maghrib_iqamat'] = window.global_first_language.coltitle_transliteration_maghrib_iqamat;
		coltitle['isha'] = window.global_first_language.coltitle_transliteration_isha;
		coltitle['isha_iqamat'] = window.global_first_language.coltitle_transliteration_isha_iqamat;
		coltitle['midnight'] = window.global_first_language.coltitle_transliteration_midnight;
		}
	else {
		if (locale==locale2){
			coltitle['day'] = window.global_first_language.coltitle_day;
			coltitle['weekday'] = window.global_first_language.coltitle_weekday;
			if (second_locale != '0' & check_second == 'Y') {
				coltitle['weekday_tr'] = getweekday(second_locale, locale2);
			} else
				coltitle['weekday_tr'] = '';
			if (calendartype == 'GREGORIAN') {
				coltitle['caltype'] = window.global_first_language.coltitle_caltype_hijri;
			} else {
				coltitle['caltype'] = window.global_first_language.coltitle_caltype_gregorian;
			}
			coltitle['imsak'] = window.global_first_language.coltitle_imsak;
			coltitle['fajr'] = window.global_first_language.coltitle_fajr;
			coltitle['fajr_iqamat'] = window.global_first_language.coltitle_fajr_iqamat;
			coltitle['sunrise'] = window.global_first_language.coltitle_sunrise;
			coltitle['dhuhr'] = window.global_first_language.coltitle_dhuhr;
			coltitle['dhuhr_iqamat'] = window.global_first_language.coltitle_dhuhr_iqamat;
			coltitle['asr'] = window.global_first_language.coltitle_asr;
			coltitle['asr_iqamat'] = window.global_first_language.coltitle_asr_iqamat;
			coltitle['sunset'] = window.global_first_language.coltitle_sunset;
			coltitle['maghrib'] = window.global_first_language.coltitle_maghrib;
			coltitle['maghrib_iqamat'] = window.global_first_language.coltitle_maghrib_iqamat;
			coltitle['isha'] = window.global_first_language.coltitle_isha;
			coltitle['isha_iqamat'] = window.global_first_language.coltitle_isha_iqamat;
			coltitle['midnight'] = window.global_first_language.coltitle_midnight;
			coltitle['notes'] = window.global_first_language.coltitle_notes;
		}
		else{
			coltitle['day'] = window.global_second_language.coltitle_day;
			coltitle['weekday'] = window.global_second_language.coltitle_weekday;
			if (second_locale != '0' & check_second == 'Y') {
				coltitle['weekday_tr'] = getweekday(second_locale, locale2);
			} else
				coltitle['weekday_tr'] = '';
			if (calendartype == 'GREGORIAN') {
				coltitle['caltype'] = window.global_second_language.coltitle_caltype_hijri;
			} else {
				coltitle['caltype'] = window.global_second_language.coltitle_caltype_gregorian;
			}
			coltitle['imsak'] = window.global_second_language.coltitle_imsak;
			coltitle['fajr'] = window.global_second_language.coltitle_fajr;
			coltitle['fajr_iqamat'] = window.global_second_language.coltitle_fajr_iqamat;
			coltitle['sunrise'] = window.global_second_language.coltitle_sunrise;
			coltitle['dhuhr'] = window.global_second_language.coltitle_dhuhr;
			coltitle['dhuhr_iqamat'] = window.global_second_language.coltitle_dhuhr_iqamat;
			coltitle['asr'] = window.global_second_language.coltitle_asr;
			coltitle['asr_iqamat'] = window.global_second_language.coltitle_asr_iqamat;
			coltitle['sunset'] = window.global_second_language.coltitle_sunset;
			coltitle['maghrib'] = window.global_second_language.coltitle_maghrib;
			coltitle['maghrib_iqamat'] = window.global_second_language.coltitle_maghrib_iqamat;
			coltitle['isha'] = window.global_second_language.coltitle_isha;
			coltitle['isha_iqamat'] = window.global_second_language.coltitle_isha_iqamat;
			coltitle['midnight'] = window.global_second_language.coltitle_midnight;
			coltitle['notes'] = window.global_second_language.coltitle_notes;
		}
		};
	return coltitle;
}
window.global_first_language = 
				{
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
					"timezone_text": "Timezone",
					"gps_lat_text":"GPS Latitude",
					"gps_long_text":"GPS Longitude"
				};

//second language objects that are displayed are column titles
//transliterated column titles are used by first language

window.global_second_language =
				{
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
				};

function gettimetabletitle(locale, locale2) {
	if (locale == locale2)
		return window.global_first_language.timetable_title;
	else
		return window.global_second_language.timetable_title;
}
function getweekday(locale, locale2) {
	if (locale == locale2)
		return window.global_first_language.coltitle_weekday;
	else
		return window.global_second_language.coltitle_weekday;
}

async function timetable_translate_settings(locale, locale_second, lang_code) {
    let json;
    let status;
	async function fetch_translation(locale, first){
		//fetch any message with first language always
		//show translation using first or second language
		await fetch(window.global_rest_url_base + window.global_rest_app_object + locale +
			'?app_id=' + window.global_app_id + 
			'&lang_code=' + lang_code, 
			{
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + window.global_rest_dt,
			}
		})
		.then(function(response) {
			status = response.status;
			return response.text();
		})
		.then(function(result) {
			if (status === 200) {
				json = JSON.parse(result);	
				for (let i = 0; i < json.data.length; i++){
					if (first == true){
						if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='REPORT')
							window.global_first_language[json.data[i].object_item_name.toLowerCase()] = json.data[i].text;
						//Used by service report onle first language implemented:
						//Regional
						if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='SETTING_NAV_REGIONAL' && 
							json.data[i].object_item_name=='SETTING_LABEL_REPORT_TIMEZONE')
							window.global_first_language.timezone_text = json.data[i].text;
						//GPS
						if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='SETTING_NAV_GPS' && 
							json.data[i].object_item_name=='SETTING_LABEL_LAT')
							window.global_first_language.gps_lat_text = json.data[i].text;
						if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='SETTING_NAV_GPS' && 
							json.data[i].object_item_name=='SETTING_LABEL_LONG')
							window.global_first_language.gps_long_text = json.data[i].text;
					}
					else{
						for (let i = 0; i < json.data.length; i++){	
							if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='REPORT')
								window.global_second_language[json.data[i].object_item_name.toLowerCase()] = json.data[i].text;						
						}
					}
				}
			} 
		})
	}
	await fetch_translation(locale, true).then(function(){
		if (locale_second ==0){
			window.global_second_language.timetable_title = '';
			window.global_second_language.coltitle_day = '';
			window.global_second_language.coltitle_weekday = '';
			window.global_second_language.coltitle_weekday_tr = '';
			window.global_second_language.coltitle_caltype_hijri = '';
			window.global_second_language.coltitle_caltype_gregorian = '';
			window.global_second_language.coltitle_imsak = '';
			window.global_second_language.coltitle_fajr = '';
			window.global_second_language.coltitle_fajr_iqamat = '';
			window.global_second_language.coltitle_sunrise = '';
			window.global_second_language.coltitle_dhuhr = '';
			window.global_second_language.coltitle_dhuhr_iqamat = '';
			window.global_second_language.coltitle_asr = '';
			window.global_second_language.coltitle_asr_iqamat = '';
			window.global_second_language.coltitle_sunset = '';
			window.global_second_language.coltitle_maghrib = '';
			window.global_second_language.coltitle_maghrib_iqamat = '';
			window.global_second_language.coltitle_isha = '';
			window.global_second_language.coltitle_isha_iqamat = '';
			window.global_second_language.coltitle_midnight = '';
			window.global_second_language.coltitle_notes = '';
		}
		else
			fetch_translation(locale.second, false);
	})
	return null;
}

function isToday(checkdate){
    let today = new Date();
    return (checkdate.getMonth() == today.getMonth()) && 
            (checkdate.getDate() == today.getDate()) && 
            (checkdate.getFullYear() == today.getFullYear());
}

//check if day is ramadan day
function is_ramadan_day(year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adj){
	let options_calendartype = {timeZone: timezone,
								month: 'numeric'};
	if (calendartype=='GREGORIAN'){
		let date_temp = new Date(year,month,day);
		date_temp.setDate(date_temp.getDate() + parseInt(hijri_adj));
		date_temp = date_temp.toLocaleDateString(window.global_regional_def_calendar_lang + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_calendar + calendar_hijri_type + window.global_regional_def_locale_ext_number_system + window.global_regional_def_calendar_number_system, options_calendartype);
		if (date_temp==9)
			return true;
	}
	else{
		if (month==9)
			return true;
	}
	return false;
}

function setMethod_praytimes(settings_method, settings_asr, settings_highlat){
	prayTimes.setMethod(settings_method);
	//use methods without modifying original code
	if (window.global_prayer_praytimes_methods[settings_method].params.maghrib && 
		window.global_prayer_praytimes_methods[settings_method].params.midnight)
		prayTimes.adjust( { asr:      settings_asr,
							highLats: settings_highlat,
							fajr:     window.global_prayer_praytimes_methods[settings_method].params.fajr,
							isha:     window.global_prayer_praytimes_methods[settings_method].params.isha,
							maghrib:  window.global_prayer_praytimes_methods[settings_method].params.maghrib,
							midnight: window.global_prayer_praytimes_methods[settings_method].params.midnight} );
	else
		if (window.global_prayer_praytimes_methods[settings_method].params.maghrib)
			prayTimes.adjust( { asr:      settings_asr,
								highLats: settings_highlat,
								fajr:     window.global_prayer_praytimes_methods[settings_method].params.fajr,
								isha:     window.global_prayer_praytimes_methods[settings_method].params.isha,
								maghrib:  window.global_prayer_praytimes_methods[settings_method].params.maghrib} );
		else
			if (window.global_prayer_praytimes_methods[settings_method].params.midnight)
				prayTimes.adjust( { asr:      settings_asr,
									highLats: settings_highlat,
									fajr:     window.global_prayer_praytimes_methods[settings_method].params.fajr,
									isha:     window.global_prayer_praytimes_methods[settings_method].params.isha,
									midnight: window.global_prayer_praytimes_methods[settings_method].params.midnight} );
			else
				prayTimes.adjust( { asr:      settings_asr,
									highLats: settings_highlat,
									fajr:     window.global_prayer_praytimes_methods[settings_method].params.fajr,
									isha:     window.global_prayer_praytimes_methods[settings_method].params.isha} );
}
//header and footer style
function getstyle(img_src, align){
	let style='';
		if (fileisloaded(img_src))
		 	style = 'background-image:url("' + img_src +'");';
		style +=  'text-align:' + align;
		return style;
}
function fileisloaded(image_item_src) {
    //if (image_item_src.substr(0,4)=='data')
    if (image_item_src == '')
        return false;
    else
        return true;
}
function convertnumberlocale(numberstring, splitcharacter, locale) {
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
//for boh day and month timetable
function show_col(timetable, col, year, month, day, calendartype, show_fast_start_end, timezone, calendar_hijri_type, hijri_adjustment, locale, number_system, value){

	let display_value = convertnumberlocale(value.toString(), ':', locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + number_system);
	if (((show_fast_start_end=='1' && col=='fajr') ||
		(show_fast_start_end=='2' && col=='imsak') ||
		(show_fast_start_end=='3' && col=='fajr') ||
		(show_fast_start_end=='4' && col=='imsak')) &&
		is_ramadan_day(year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adjustment)){
		if (timetable==0)
			return `<div class='timetable_col prayertable_fast_start'>${display_value}</div>`;
		if (timetable==1)
			return `<div class="prayertable_fast_start">${display_value}</div>`;
		}
	else
		if (((show_fast_start_end=='1' && col=='maghrib') ||
			(show_fast_start_end=='2' && col=='maghrib') ||
			(show_fast_start_end=='3' && col=='isha') ||
			(show_fast_start_end=='4' && col=='isha')) && 
			is_ramadan_day(year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adjustment)){
			if (timetable==0)
				return `<div class='timetable_col prayertable_fast_end'>${display_value}</div>`;
			if (timetable==1)
				return `<div class="prayertable_fast_end">${display_value}</div>`;
			}
		else{
			if (col=='sunrise'){
				if (timetable==0)
					return `<div class='timetable_col prayertable_month_sunrise'>${display_value}</div>`;
				if (timetable==1)
					return `<div>${display_value}</div>`;
				}
			else{
				if (timetable==0)
					return `<div class='timetable_col'>${display_value}</div>`;
				if (timetable==1)
					return `<div>${display_value}</div>`;
				}
			}
}
/*----------------------- */
/* Timetable month and year functions */
/*----------------------- */
function timetable_headers_month(items, settings, locale){

	let header_row_index = 1;
	let html ='';
	if (settings.coltitle=='0' || settings.coltitle=='1'){
		//header row 1
		//add transliterated column titles	
		html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
					${makeTableRow(getColumnTitles(1, settings.calendartype, settings.locale, null, null, locale), items, 0, null,null, settings)}
				</div>`;
		if (settings.coltitle=='1'){
			//header row 2
			header_row_index += 1;
			//add translated column titles
			html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
						${makeTableRow(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, null, locale), items, 0, null,null, settings)}
					</div>`;
		}
	}
	else
		if (settings.coltitle=='2' || settings.coltitle=='3'){
			//header row 1
			//add translated column titles
			html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
						${makeTableRow(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, null, locale), items, 0, null,null, settings)}
					</div>`;
			if (settings.coltitle=='2'){
				//header row 2
				header_row_index += 1;
				//add transliterated column titles
				html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
							${makeTableRow(getColumnTitles(1, settings.calendartype, settings.locale, null, null, locale), items, 0, null,null, settings)}
						</div>`;
			}
		}
	//header row 3
	if (settings.second_locale!='0'){
		//show second locale except weekdays, they are already displayed on first header row
		let second_locale_titles = getColumnTitles(0, settings.calendartype, settings.second_locale, '', 'N', locale);
		header_row_index += 1;
		second_locale_titles['weekday']='';
		second_locale_titles['weekday_tr']='';
		html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
						${makeTableRow(second_locale_titles, items, 0, null,null, settings)}
				</div>`;
	}
	return html;
}
//calculate Iqamat
function calculateIqamat(option, calculated_time){
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
function makeTableRow(data, items, timerow, year, month, settings) {

	let options_weekday = {weekday:'long'};
	let options_calendartype = {timeZone: settings.timezone, 
								dateStyle: 'short'};
	let date;
	let iqamat;
	let html='';
	for (let i in items) {
		date = '';
		iqamat = '';
		//Check if column should be displayed
		if ( (i=='weekday' && (settings.show_weekday =='NO' || settings.reporttype =='YEAR'))||
				(i=='weekday_tr' && ((settings.second_locale =='0' ||
									settings.show_weekday =='NO') || settings.reporttype =='YEAR'))||
				(i=='caltype' && (settings.show_calendartype =='NO' || settings.reporttype =='YEAR'))||
				(i=='imsak' && (settings.show_imsak =='NO' || settings.reporttype =='YEAR'))||
				(i=='fajr_iqamat' && (settings.iqamat_fajr =='0' || settings.reporttype =='YEAR'))||
				(i=='dhuhr_iqamat' && (settings.iqamat_dhuhr=='0' || settings.reporttype =='YEAR'))||
				(i=='asr_iqamat' && (settings.iqamat_asr=='0' || settings.reporttype =='YEAR'))||
				(i=='maghrib_iqamat' && (settings.iqamat_maghrib=='0' || settings.reporttype =='YEAR'))||
				(i=='isha_iqamat' && (settings.iqamat_isha=='0' || settings.reporttype =='YEAR'))||
				(i=='sunset' && (settings.show_sunset =='NO' || settings.reporttype =='YEAR'))||
				(i=='midnight' && (settings.show_midnight =='NO' || settings.reporttype =='YEAR'))||
				(i=='notes' && (settings.show_notes =='NO' || settings.reporttype =='YEAR')))
			null;
		else{
			if (parseInt(timerow)==0){
				//header column
				html += `<div class='timetable_col_header'>${data[i]}</div>`;
			}
			else{
				switch(i){
				case 'caltype':{
					if (settings.calendartype=='GREGORIAN'){
						let date_temp = new Date(year,month,data['day']);
						date_temp.setDate(date_temp.getDate() + parseInt(settings.hijri_adj));
						html += `<div class='timetable_col prayertable_month_calendartype'>${date_temp.toLocaleDateString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_calendar + settings.calendar_hijri_type + window.global_regional_def_locale_ext_number_system + settings.number_system, options_calendartype)}</div>`;
					}
					else{
						date  = HijriToGreg(settings.hijri_adj, new Array(year,month,data['day']));
						html += `<div class='timetable_col prayertable_month_calendartype'>${new Date(date[0],date[1]-1,date[2]).toLocaleDateString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_calendar + window.global_regional_def_calendar_type_greg + window.global_regional_def_locale_ext_number_system + settings.number_system, options_calendartype)}</div>`;
					}
					break;
					}
				case 'day':
					html += `<div class='timetable_col'>${data[i].toLocaleString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
				case 'weekday':
				case 'weekday_tr':{
					if (settings.calendartype=='GREGORIAN'){
						let date_temp = new Date(year,month,data['day']);
						date_temp.setDate(date_temp.getDate() + parseInt(settings.hijri_adj));
						html += `<div class='timetable_col prayertable_month_date'>${date_temp.toLocaleDateString(i=='weekday'?settings.locale:settings.second_locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_calendar + settings.calendar_hijri_type, options_weekday)}</div>`;
						}
					else{
						date    = HijriToGreg(settings.hijri_adj, new Array(year,month,data['day']));
						html += `<div class='timetable_col prayertable_month_date'>${new Date(date[0],date[1]-1,date[2]).toLocaleDateString(i=='weekday'?settings.locale:settings.second_locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_calendar + window.global_regional_def_calendar_type_greg, options_weekday)}</div>`;
						}
					break;
					}
				case 'fajr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_fajr, data['fajr']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
					}
				case 'dhuhr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_dhuhr, data['dhuhr']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
					}
				case 'asr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_asr, data['asr']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
					}
				case 'maghrib_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_maghrib, data['maghrib']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;                    
					}
				case 'isha_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_isha, data['isha']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
					}
				case 'notes':{
					html += `<div class='timetable_col prayertable_month_notes'>${'<input type="text">'}</div>`;
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
function displayMonth(offset, prayertable, settings, locale) {

	let month;
	let year;
	let month_html='';
	let header_style ='';
	let footer_style ='';
	prayertable.innerHTML ='';
	//add default class, theme class and font class		
	prayertable.classList = settings.prayertable_month + ' ' + 
							settings.theme_month + ' ' +
							'prayertable_font_' + settings.arabic_script;
	
	if (settings.reporttype =='MONTH'){
		//Set direction
		//set LTR or RTL on table layout if MONTH, on YEAR direction is set on the whole year layout
		prayertable.style.direction = settings.direction;

		header_style = getstyle(settings.header_img_src, settings.header_align);
		footer_style = getstyle(settings.footer_img_src, settings.footer_align);

		month_html +=
			`<div id='prayertable_month_header' style='${header_style}'>
				<div id='prayertable_month_header_title1'>${settings.header_txt1}</div>
				<div id='prayertable_month_header_title2'>${settings.header_txt2}</div>
				<div id='prayertable_month_header_title3'>${settings.header_txt3}</div>
			</div>`;
	}

	let title_date;	
	let options;
	switch (settings.reporttype){
		case 'MONTH':{
			options = {month:'long', year: 'numeric'};
			break;
			}
		case 'YEAR':{
			options = {month:'long'};
			break;
			}
	}
	
	//get current date Gregorian or Hijri and set next
	let title4;
	if (settings.calendartype=='GREGORIAN'){
		window.global_session_currentDate.setMonth(window.global_session_currentDate.getMonth()+ 1* offset);
		month = window.global_session_currentDate.getMonth();
		year = window.global_session_currentDate.getFullYear();
		title4 = new Date(year,month,1).toLocaleDateString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system, options).toUpperCase();
		}
	else
		if (settings.calendartype=='HIJRI'){
			//get previous or next Hijri month using current Hijri month  
			if (offset == -1){
				if (window.global_session_CurrentHijriDate[0] ==1){
					window.global_session_CurrentHijriDate[0] = 12;
					window.global_session_CurrentHijriDate[1] = window.global_session_CurrentHijriDate[1] - 1;
				}
				else
					window.global_session_CurrentHijriDate[0] = window.global_session_CurrentHijriDate[0] - 1;
			}
			else
				if (offset == 1){
					if (window.global_session_CurrentHijriDate[0] ==12){
						window.global_session_CurrentHijriDate[0] = 1;
						window.global_session_CurrentHijriDate[1] = window.global_session_CurrentHijriDate[1] + 1;
					}
					else
						window.global_session_CurrentHijriDate[0] = window.global_session_CurrentHijriDate[0] + 1;
				}
			month = window.global_session_CurrentHijriDate[0];
			year  = window.global_session_CurrentHijriDate[1];
			title_date    = HijriToGreg(0, new Array(year,month,1));
			title4 = new Date(title_date[0],title_date[1]-1,title_date[2]).toLocaleDateString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_calendar + settings.calendar_hijri_type + window.global_regional_def_locale_ext_number_system + settings.number_system, options).toUpperCase();
		}

	let items = getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, null, locale);
	month_html+=
	`<div id='timetable_header'>
		<div id='prayertable_month_header_title4'>${title4}</div>
		<div id='prayertable_month_header_title5'>${settings.second_locale!=0?gettimetabletitle(settings.locale, locale) + ' ' + gettimetabletitle(settings.second_locale, locale):gettimetabletitle(settings.locale, locale)}</div>
	</div>
	<div id='timetable'>
		${timetable_headers_month(items, settings, locale)}`;

	let date;
	let endDate;
	let date_hijri;
	let endDate_hijri;
	let timezone_offset = getTimezoneOffset(settings.timezone);
	
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
			date    = HijriToGreg(settings.hijri_adj,date_hijri);
			date    = new Date(date[0], date[1]-1, date[2]);
			endDate = HijriToGreg(settings.hijri_adj,endDate_hijri);
			endDate = new Date(endDate[0], endDate[1]-1, endDate[2]);
		}
	setMethod_praytimes(settings.method, settings.asr, settings.highlat);
	while (date < endDate) {
		let times = prayTimes.getTimes(date, [settings.gps_lat, settings.gps_long], timezone_offset, 0, settings.format);
		if (settings.calendartype=='GREGORIAN')
			times.day = date.getDate();
		else
			times.day = ++date_hijri[2] - 1;
		let row_class='';
		//check if today
		if (isToday(date))
			row_class = 'prayertable_month_today-row ';
		//check if row should be highlighted
		switch (settings.highlight){
		case '1':{
			//check if friday
			if (date.getDay() == 5)
				row_class += 'prayertable_month_highlight_row ';
			break;
			}
		case '2':{
			//check if saturday
			if (date.getDay() == 6)
				row_class += 'prayertable_month_highlight_row ';
			break;
			}
		case '3':{
			//check if sunday
			if (date.getDay() == 0)
				row_class += 'prayertable_month_highlight_row ';
			break;
			}
		case '4':{
			//check if day 1-10
			if (times.day < 11)
				row_class += 'prayertable_month_day_01-10-row ';
			//check if day 11-20
			if (times.day > 10 && times.day < 21)
				row_class += 'prayertable_month_day_11-20-row ';
			//check if day 21 - 
			if (times.day > 20)
				row_class += 'prayertable_month_day_21-30-row ';
			break;
			}
		} 
		month_html += `<div class='${'timetable_row ' + row_class}'>
							${makeTableRow(times, items, 1, year, month, settings)}
					  </div>`;
		date.setDate(date.getDate()+ 1);  // next day
	}
	month_html += '</div>';
	//footer
	if (settings.reporttype =='MONTH'){
		month_html +=
		`<div id='timetable_footer'>
			<div id='timetable_footer_row'>
				<div id='timetable_footer_col'>
					<div id='prayertable_month_footer_r1c1'>${settings.place}</div>
					${settings.show_gps == 'YES'?
						`
						<div id='prayertable_month_footer_r1c2'>${window.global_first_language.gps_lat_text}</div>
						<div id='prayertable_month_footer_r1c3'>${settings.gps_lat.toLocaleString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system)}</div>
						<div id='prayertable_month_footer_r1c4'>${window.global_first_language.gps_long_text}</div>
						<div id='prayertable_month_footer_r1c5'>${settings.gps_long.toLocaleString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system)}</div>`
						:''}
					${settings.show_timezone == 'YES'?
						`<div id='prayertable_month_footer_r1c6'>${window.global_first_language.timezone_text}</div>
						<div id='prayertable_month_footer_r1c7'>${settings.timezone}</div>`
						:''}
				</div>
			</div>
		</div>
		<div id='copyright'>${window.global_app_copyright}</div>
		<div id='prayertable_month_footer' style='${footer_style}'>
			<div id='prayertable_month_footer_title1'>${settings.footer_txt1}</div>
			<div id='prayertable_month_footer_title2'>${settings.footer_txt2}</div>
			<div id='prayertable_month_footer_title3'>${settings.footer_txt3}</div>
		</div>`;
	}	
	prayertable.innerHTML = month_html;
}
/*----------------------- */
/* Timetable day functions */
/*----------------------- */

function timetable_headers_day(settings, locale){
	let header_row_index = 1;
	let day_html ='';
	if (settings.coltitle=='0' || settings.coltitle=='1'){
		//header row 1
		//add transliterated column titles	
		day_html += create_day_title_row(getColumnTitles(1, settings.calendartype, settings.locale, null, null, locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
		if (settings.coltitle=='1'){
			//header row 2
			header_row_index += 1;
			//add translated column titles
			day_html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, null, locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
		}
	}
	else
		if (settings.coltitle=='2' || settings.coltitle=='3'){
			//header row 1
			//add translated column titles
			day_html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale, null, null, locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
			if (settings.coltitle=='2'){
				//header row 2
				header_row_index += 1;
				//add transliterated column titles
				day_html += create_day_title_row(getColumnTitles(1, settings.calendartype, settings.locale, null, null, locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
			}
		}
	//header row 3
	if (settings.second_locale!='0'){
		//show second locale except weekdays, they are already displayed on first header row
		header_row_index += 1;;
		day_html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.second_locale, '', 'N', locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
	}
	return day_html;
}

//row for day timetable
function create_day_title_row (col_titles, title_index, show_imsak, show_sunset, show_midnight){
	return `<div id='prayertable_day_timetable_row_${title_index}' class='prayertable_day_timetable_header-row'>
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

function displayDay(settings, item_id, locale, user_settings){

	let day_html='';
	let times; 
	let offset;
	let options = { timeZone: settings.timezone, 
					weekday: 'long', 
					year: 'numeric', 
					month: 'long', 
					day: 'numeric'};
	let options_hijri = { timeZone: settings.timezone, 
					year: 'numeric', 
					month: 'long', 
					day: 'numeric'};
					
	if (item_id ==null)
		offset = 0;
	else
		offset = item_id == settings.ui_navigation_left ? -1:+1;
	window.global_session_currentDate.setDate(window.global_session_currentDate.getDate()+ 1* offset);
	
	let date_current = new Date(window.global_session_currentDate.getFullYear(),window.global_session_currentDate.getMonth(),window.global_session_currentDate.getDate());
	let date_title4 = date_current.toLocaleDateString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system, options).toUpperCase();
	date_current.setDate(date_current.getDate() + parseInt(settings.hijri_adj));
	let date_title5 = date_current.toLocaleDateString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_calendar + settings.calendar_hijri_type + window.global_regional_def_locale_ext_number_system + settings.number_system, options_hijri).toUpperCase();
	
	//Set theme and font classes on main div
	settings.ui_prayertable_day.classList = settings.theme_day + ' ' + 'prayertable_font_' + settings.arabic_script;		
	//set LTR or RTL on table layout
	settings.ui_prayertable_day.style.direction = settings.direction;

	let header_style = getstyle(settings.header_img_src, settings.header_align);
	let footer_style = getstyle(settings.footer_img_src, settings.footer_align);

	day_html += 
	`
	<div id='prayertable_day_header_row' style='${header_style}'>
		<div id='prayertable_day_header_title1' class='prayertable_day_header' >${settings.header_txt1}</div>
		<div id='prayertable_day_header_title2' class='prayertable_day_header' >${settings.header_txt2}</div>
		<div id='prayertable_day_header_title3' class='prayertable_day_header' >${settings.header_txt3}</div>
	</div>
	<div id='prayertable_day_timetable_header'>
		<div id='prayertable_day_header_title4' class='prayertable_day_header' >${date_title4}</div>
		<div id='prayertable_day_header_title5' class='prayertable_day_header' >${date_title5}</div>
	</div>
	<div id='prayertable_day_timetable' class='${settings.show_imsak=='YES' && 
												 settings.show_sunset=='YES' && 
												 settings.show_midnight=='YES'?'prayertable_day_wide':''}'>
		${timetable_headers_day(settings, locale)}
		<div class='prayertable_day_timetable_settings'>`;
	
	let user_locale;
	let user_timezone;
	let user_label_timezone;
	let user_number_system;
	let user_calendar_hijri_type;
	let user_gps_label_latitude;
	let user_gps_latitude;
	let user_gps_label_longitude;
	let user_gps_longitude;
	let user_show_gps;
	let user_show_timezone;
	let user_method;
	let user_asr;
	let user_highlat;
	let user_format;
	let user_hijri_adjustment;
	let user_show_imsak;
	let user_show_sunset;
	let user_show_midnight;
	let user_show_fast_start_end;
	let user_place;

	for (i=0;i<=user_settings.length-1;i++){
		//language
		user_locale = user_settings[i].regional_language_locale;
		//timezone report
		user_timezone = user_settings[i].regional_timezone;
		user_label_timezone = window.global_first_language.timezone_text;
		//number system
		user_number_system = user_settings[i].regional_number_system;
		//calendar hijri type
		user_calendar_hijri_type = user_settings[i].regional_calendar_hijri_type;
		//gps text - current translation
		user_gps_label_latitude = window.global_first_language.gps_lat_text;
		//gps latitude
		user_gps_latitude = parseFloat(user_settings[i].gps_lat_text);
		//gps text - current translation
		user_gps_label_longitude = window.global_first_language.gps_long_text;
		//gps longitude
		user_gps_longitude = parseFloat(user_settings[i].gps_long_text);
		//show gps - current setting
		user_show_gps = settings.show_gps;
		//user_show_gps = select_user_settings[i].getAttribute('design_column_gps_checked');
		//show timezone - current setting
		user_show_timezone = settings.show_timezone;
		//user_show_timezone = select_user_settings[i].getAttribute('design_column_timezone_checked');
		//method
		user_method = user_settings[i].prayer_method;
		//asr method
		user_asr = user_settings[i].prayer_asr_method;
		//highlat adjustment
		user_highlat = user_settings[i].prayer_high_latitude_adjustment;
		//format
		user_format = user_settings[i].prayer_time_format;
		//hijri adjustment
		user_hijri_adjustment = user_settings[i].prayer_hijri_date_adjustment;
		//show imsak - current setting
		user_show_imsak = settings.show_imsak;
		//show sunset - current setting
		user_show_sunset = settings.show_sunset;
		//show midnight - current setting
		user_show_midnight = settings.show_midnight;
		//show fast start and end - current setting
		user_show_fast_start_end = settings.show_fast_start_end;
		//place info
		user_place = user_settings[i].description;
	
		setMethod_praytimes(user_method, user_asr, user_highlat);
		times = prayTimes.getTimes(window.global_session_currentDate, [user_gps_latitude, user_gps_longitude], getTimezoneOffset(user_timezone), 0, user_format);				
		let col_imsak = user_show_imsak == 'YES'?show_col(1, 'imsak', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment,user_locale, user_number_system, times['imsak']):''; 
		let col_fajr = show_col(1, 'fajr', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['fajr']);
		let col_sunrise = show_col(1, 'sunrise', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['sunrise']);
		let col_dhuhr = show_col(1, 'dhuhr', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['dhuhr']);
		let col_asr = show_col(1, 'asr', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['asr']);
		let col_sunset = user_show_sunset == 'YES'?show_col(1, 'sunset', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment,user_locale, user_number_system, times['sunset']):'';
		let col_maghrib = show_col(1, 'maghrib', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['maghrib']);
		let col_isha = show_col(1, 'isha', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['isha']);
		let col_midnight = user_show_midnight == 'YES'? show_col(1, 'midnight', window.global_session_currentDate.getFullYear(), window.global_session_currentDate.getMonth(), window.global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['midnight']):'';
		day_html +=
			`<div class='prayertable_day_timetable_row_data ${isToday(date_current)==true?'prayertable_day_today-row':''}'>
				${col_imsak}${col_fajr}${col_sunrise}${col_dhuhr}${col_asr}${col_sunset}${col_maghrib}${col_isha}${col_midnight}
			</div>
			<div class='prayertable_day_timetable_footer'>
				<div class='prayertable_day_timetable_footer_row'>
					<div class='prayertable_day_timetable_footer_r1c1'>${user_place}</div>
					<div class='prayertable_day_timetable_footer_r1c2'>${user_show_gps == 'YES' ? user_gps_label_latitude:''}</div>
					<div class='prayertable_day_timetable_footer_r1c3'>${user_show_gps == 'YES' ? user_gps_latitude.toLocaleString(user_locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + user_number_system):''}</div>
					<div class='prayertable_day_timetable_footer_r1c4'>${user_show_gps == 'YES' ? user_gps_label_longitude:''}</div>
					<div class='prayertable_day_timetable_footer_r1c5'>${user_show_gps == 'YES' ? user_gps_longitude.toLocaleString(user_locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + user_number_system):''}</div>
				</div>
				${user_show_timezone == 'YES'?`<div class='prayertable_day_timetable_footer_row'>
													<div class='prayertable_day_current_time'></div>
													<div class='prayertable_day_timezone'>${user_label_timezone + ' ' + user_timezone}</div>
												</div>`:''}
			</div>`;
	}
	//Footer
	day_html += 
	`	</div>
	</div>
	<div id='copyright'>${window.global_app_copyright}</div>
	<div id='prayertable_day_footer_row' style='${footer_style}'>
		<div id='prayertable_day_footer_title1' class='prayertable_day_footer' >${settings.footer_txt1}</div>
		<div id='prayertable_day_footer_title2' class='prayertable_day_footer' >${settings.footer_txt2}</div>
		<div id='prayertable_day_footer_title3' class='prayertable_day_footer' >${settings.footer_txt3}</div>
		<div></div>
	</div>
	<div id='prayertable_day_time'>
	</div>`;
	settings.ui_prayertable_day.innerHTML = day_html;
}
/*----------------------- */
/* Timetable year functions */
/*----------------------- */
function displayYear(settings, item_id, locale){
	
	let startmonth            = window.global_session_currentDate.getMonth();
	let starthijrimonth       = window.global_session_CurrentHijriDate[0];
	let year_html='';
	
	settings.reporttype        = 'YEAR';
	
	//Set theme and font class
	settings.ui_prayertable_year.classList = settings.theme_year + ' ' + 'prayertable_font_' + settings.arabic_script;
	//set LTR or RTL on year layout
	settings.ui_prayertable_year.style.direction = settings.direction;

	//if both second language and both transliteration and translation columntitles will be shown
	//add class to fix size
	let timetable_class ='';
	let timetable_footer_class ='';
	if (settings.second_locale!='0') {
		//transliteration OR translation
		if (settings.coltitle=='0' || settings.coltitle=='3'){
			timetable_class = 'class="two_columntitles"';
			timetable_footer_class = 'class="two_columntitles"';
		}
		else{
			timetable_class = 'class="three_columntitles"';
			timetable_footer_class = 'class="three_columntitles"';
		}
	}
	else{
		//transliteration and translation are in the column titles
		if (settings.coltitle=='1' || settings.coltitle=='2'){
			timetable_class = 'class="two_columntitles"';
			timetable_footer_class = 'class="two_columntitles"';
		}
	}

	//if item_id is set then navigate previous/next month/year
	if (item_id == settings.ui_navigation_left){
		if (settings.calendartype=='GREGORIAN')
			window.global_session_currentDate.setYear(window.global_session_currentDate.getFullYear() - 1);
		else
			window.global_session_CurrentHijriDate[1] = window.global_session_CurrentHijriDate[1] - 1;
	}
	else 
		if (item_id == settings.ui_navigation_right){
			if (settings.calendartype=='GREGORIAN')
				window.global_session_currentDate.setYear(window.global_session_currentDate.getFullYear() + 1);
			else
				window.global_session_CurrentHijriDate[1] = window.global_session_CurrentHijriDate[1] + 1;
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
		year_title4 = window.global_session_currentDate.getFullYear();
		year_title4 = year_title4.toLocaleString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system, options_year);
	}
	else{
		//HIJRI
		year_title4 = window.global_session_CurrentHijriDate[1];
		year_title4 = year_title4.toLocaleString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system, options_year);
	}
	//timetables
	let months = new Array(12);
	let timetable_month = document.createElement('div');
	for (let monthindex = 1; monthindex <= 12; monthindex++) { 
		if (settings.calendartype=='GREGORIAN')
			window.global_session_currentDate.setMonth(monthindex -1);
		else
			window.global_session_CurrentHijriDate[0] = monthindex;
		displayMonth(0, timetable_month, settings, locale);
		timetable_month.classList.add(settings.prayertable_year_month);
		months[monthindex-1] = timetable_month.outerHTML;
	}
	year_html +=
	`<div class='prayertable_year_row' id='prayertable_year_header_row' style='${header_style}'>
		<div id='prayertable_year_header_title1' class='prayertable_year_header' >${settings.header_txt1}</div>
		<div id='prayertable_year_header_title2' class='prayertable_year_header' >${settings.header_txt2}</div>
		<div id='prayertable_year_header_title3' class='prayertable_year_header' >${settings.header_txt3}</div>
	</div>
	<div class='prayertable_year_row' id='prayertable_year_timetable_header'>
		<div id='prayertable_year_header_title4' class='prayertable_year_header' >${year_title4}</div>
		<div id='prayertable_year_header_title5' class='prayertable_year_header' >${settings.second_locale!=0?gettimetabletitle(settings.locale, locale) + ' ' + gettimetabletitle(settings.second_locale, locale):gettimetabletitle(settings.locale, locale)}</div>
	</div>
	<div id='prayertable_year_timetables' ${timetable_class}'>
		<div class='prayertable_year_row'>
			${months[0]}
			${months[1]}
			${months[2]}
			${months[3]}
		</div>
		<div class='prayertable_year_row'>
			${months[4]}
			${months[5]}
			${months[6]}
			${months[7]}
		</div>
		<div class='prayertable_year_row'>
			${months[8]}
			${months[9]}
			${months[10]}
			${months[11]}
		</div>
    </div>
	<div id='prayertable_year_timetable_footer' ${timetable_footer_class}'>
		<div id='prayertable_year_timetable_footer_row'>
			<div id='prayertable_year_timetable_footer_col'>
				<div id='prayertable_year_timetable_footer_r1c1' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.place}</div>
				<div id='prayertable_year_timetable_footer_r1c2' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?window.global_first_language.gps_lat_text:''}</div>
				<div id='prayertable_year_timetable_footer_r1c3' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?settings.gps_lat.toLocaleString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system):''}</div>
				<div id='prayertable_year_timetable_footer_r1c4' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?window.global_first_language.gps_long_text:''}</div>
				<div id='prayertable_year_timetable_footer_r1c5' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?settings.gps_long.toLocaleString(settings.locale + window.global_regional_def_locale_ext_prefix + window.global_regional_def_locale_ext_number_system + settings.number_system):''}</div>
				<div id='prayertable_year_timetable_footer_r1c6' ${settings.show_timezone == 'YES'?'class=""':'class="hidden"'}>${settings.show_timezone == 'YES'?window.global_first_language.timezone_text:''}</div>
				<div id='prayertable_year_timetable_footer_r1c7' ${settings.show_timezone == 'YES'?'class=""':'class="hidden"'}>${settings.show_timezone == 'YES'?settings.timezone:''}</div>
			</div>
		</div>
	</div>
	<div id='copyright'>${window.global_app_copyright}</div>
	<div class='prayertable_year_row' id='prayertable_year_footer_row' style='${footer_style}'>
		<div id='prayertable_year_footer_title1' class='prayertable_year_footer' >${settings.footer_txt1}</div>
		<div id='prayertable_year_footer_title2' class='prayertable_year_footer' >${settings.footer_txt2}</div>
		<div id='prayertable_year_footer_title3' class='prayertable_year_footer' >${settings.footer_txt3}</div>
		<div></div>
	</div>`;
	settings.ui_prayertable_year.innerHTML = year_html;

	window.global_session_currentDate.setMonth(startmonth);
	window.global_session_CurrentHijriDate[0] = starthijrimonth;
}
async function get_report_globals(lang_code) {
    let status;
    let json;
    await fetch(window.global_rest_url_base + window.global_rest_app_parameter + window.global_app_id +
                '?lang_code=' + lang_code, 
                {method: 'GET',
                 headers: {
                   'Authorization': 'Bearer ' + window.global_rest_dt
                }})
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            json = JSON.parse(result);
            for (let i = 0; i < json.data.length; i++) {
                //variables for app_id=0
                if (json.data[i].app_id == 0){
                    if (json.data[i].parameter_name=='APP_COPYRIGHT')
                        window.global_app_copyright = json.data[i].parameter_value;
                    //REST
                    if (json.data[i].parameter_name=='REST_APP_OBJECT')
                        window.global_rest_app_object = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                        window.global_service_geolocation = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_GEOLOCATION_GPS_PLACE')
                        window.global_service_geolocation_gps_place = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_REPORT')
                        window.global_service_report = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='SERVICE_WORLDCITIES')
                        window.global_service_worldcities = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_ACCESS_TOKEN')
                        window.global_gps_map_access_token = json.data[i].parameter_value;
                }
                if (json.data[i].app_id == window.global_app_id){
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING')
                        window.global_rest_app1_user_setting = json.data[i].parameter_value;
					if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_USER_ACCOUNT_ID')
                        window.global_rest_app1_user_setting_user_account_id = json.data[i].parameter_value;
					if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_VIEW')
                        window.global_rest_app1_user_setting_view = json.data[i].parameter_value;
					if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_LANG')
                        window.global_regional_def_calendar_lang = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_PREFIX')
                        window.global_regional_def_locale_ext_prefix = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM')
                        window.global_regional_def_locale_ext_number_system = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR')
                        window.global_regional_def_locale_ext_calendar = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_TYPE_GREG')
                        window.global_regional_def_calendar_type_greg = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM')
                        window.global_regional_def_calendar_number_system = json.data[i].parameter_value;
                }
            }
        }
    })
}

//lang_code is display message language who is running the report
//use saved locale and second_locale user settings
async function timetable_user_setting_get(user_setting_id, lang_code, callBack) {
    let json;
    let status;

    await fetch(window.global_rest_url_base + window.global_rest_app1_user_setting + user_setting_id +
                '?app_id=' + window.global_app_id + 
                '&lang_code=' + lang_code, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.global_rest_dt
            }
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status == 200) {
                json = JSON.parse(result);
				//set papersize on paper div
				document.getElementById('paper').className= json.design_paper_size;
				callBack(null,
							//id
						 {  prayertable_month       : 'prayertable_month', //class to add for month
							prayertable_year_month  : 'prayertable_year_month', //class to add for year
							reporttype          	: 'MONTH', //MONTH: normal month with more info, YEAR: month with less info
							locale              	: json.regional_language_locale,  
							timezone            	: json.regional_timezone,
							number_system       	: json.regional_number_system,
							direction           	: json.regional_layout_direction,
							second_locale       	: json.regional_second_language_locale,
							coltitle            	: json.regional_column_title,
							arabic_script       	: json.regional_arabic_script,
							calendartype        	: json.regional_calendar_type,
							calendar_hijri_type 	: json.regional_calendar_hijri_type,

							/* app ui settings
							json.gps_map_type
							json.gps_country_id		
							json.gps_city_id		
							json.gps_popular_place_id
							*/              
							place               	: json.description,
							gps_lat             	: parseFloat(json.gps_lat_text),
							gps_long            	: parseFloat(json.gps_long_text),
							
							theme_day           	: 'theme_day_' + json.design_theme_day_id,
							theme_month         	: 'theme_month_' + json.design_theme_month_id,
							theme_year          	: 'theme_year_' + json.design_theme_year_id,
							//send from app and url query parameter to instruct papersize for PDF generation
							//in report service
							//papersize				: json.design_paper_size
							highlight           	: json.design_row_highlight,
							show_weekday        	: checkbox_checked(json.design_column_weekday_checked),
							show_calendartype   	: checkbox_checked(json.design_column_calendartype_checked),
							show_notes          	: checkbox_checked(json.design_column_notes_checked),
							show_gps   	       		: checkbox_checked(json.design_column_gps_checked),
							show_timezone       	: checkbox_checked(json.design_column_timezone_checked),
										
							header_img_src      	: image_format(json.image_header_image_img),
							footer_img_src      	: image_format(json.image_footer_image_img),

							header_txt1         	: json.text_header_1_text,
							header_txt2         	: json.text_header_2_text,
							header_txt3         	: json.text_header_3_text,
							header_align      		: json.text_header_align,
							footer_txt1         	: json.text_footer_1_text,
							footer_txt2         	: json.text_footer_2_text,
							footer_txt3    	   		: json.text_footer_3_text,
							footer_align			: json.text_footer_align,

							method              	: json.prayer_method,
							asr                 	: json.prayer_asr_method,
							highlat             	: json.prayer_high_latitude_adjustment,
							format              	: json.prayer_time_format,
							hijri_adj           	: json.prayer_hijri_date_adjustment,
							iqamat_fajr         	: json.prayer_fajr_iqamat,
							iqamat_dhuhr        	: json.prayer_dhuhr_iqamat,
							iqamat_asr          	: json.prayer_asr_iqamat,
							iqamat_maghrib      	: json.prayer_maghrib_iqamat,
							iqamat_isha         	: json.prayer_isha_iqamat,
							show_imsak          	: checkbox_checked(json.prayer_column_imsak_checked),
							show_sunset         	: checkbox_checked(json.prayer_column_sunset_checked),
							show_midnight       	: checkbox_checked(json.prayer_column_midnight_checked),
							show_fast_start_end 	: json.prayer_column_fast_start_end,
							ui_navigation_left      : 'toolbar_navigation_btn_left',
							ui_navigation_right     : 'toolbar_navigation_btn_right',
							ui_prayertable_day      : document.getElementById('prayertable_day'),
							ui_prayertable_month    : document.getElementById('prayertable_month'),
							ui_prayertable_year     : document.getElementById('prayertable_year')
						}
				);
			} 
			else
				callBack(result, null);
        })
}
async function timetable_day_user_settings_get(user_account_id, lang_code, callBack){
	let json;
    let i;
    let status;
	let user_settings = [];

    await fetch(window.global_rest_url_base + window.global_rest_app1_user_setting_user_account_id + user_account_id +
		'?app_id=' + window.global_app_id + 
		'&lang_code=' + lang_code, {
	method: 'GET',
	headers: {
		'Authorization': 'Bearer ' + window.global_rest_dt
	}
	})
	.then(function(response) {
		status = response.status;
		return response.text();
	})
	.then(function(result) {
		if (status == 200) {
			json = JSON.parse(result);
			for (i = 0; i < json.count; i++) {
				//use settings that can be used on a day timetable showing different user settings
				//would be difficult to consider all settings on same page using
				//different texts, images, second languages, directions, column titles, 
				//arabic script, themes or what columns to display, for these use current users setting
				user_settings.push(
					{
					"description" : json.items[i].description,
					"regional_language_locale" : json.items[i].regional_language_locale,
					"regional_timezone" : json.items[i].regional_current_timezone,
					"regional_number_system" : json.items[i].regional_number_system,
					"regional_calendar_hijri_type" : json.items[i].regional_calendar_hijri_type,
					"gps_lat_text" : parseFloat(json.items[i].gps_lat_text),
					"gps_long_text" : parseFloat(json.items[i].gps_long_text),
					"prayer_method" : json.items[i].prayer_method,
					"prayer_asr_method" : json.items[i].prayer_asr_method,
					"prayer_high_latitude_adjustment" : json.items[i].prayer_high_latitude_adjustment,
					"prayer_time_format" : json.items[i].prayer_time_format,
					"prayer_hijri_date_adjustment" : json.items[i].prayer_hijri_date_adjustment
					}
				)
			}
			callBack(null, user_settings)
		} else {
			callBack(result, null);
		}
	})
}
async function init_app_report(user_account_id, lang_code) {
	await get_data_token(user_account_id, lang_code).then(function(){
		//set current date for report month
		window.global_session_currentDate = new Date();
		window.global_session_CurrentHijriDate = new Array();
		//get Hijri date from initial Gregorian date
		window.global_session_CurrentHijriDate[0] = parseInt(new Date(window.global_session_currentDate.getFullYear(),
			window.global_session_currentDate.getMonth(),
			window.global_session_currentDate.getDate()).toLocaleDateString("en-us-u-ca-islamic", { month: "numeric" }));
		window.global_session_CurrentHijriDate[1] = parseInt(new Date(window.global_session_currentDate.getFullYear(),
			window.global_session_currentDate.getMonth(),
			window.global_session_currentDate.getDate()).toLocaleDateString("en-us-u-ca-islamic", { year: "numeric" }));
	})
	
}
function updateReportViewStat(user_account_id, user_setting_id, lang_code) {
    let status;
    let json_data =`{
                    "user_account_id":${user_account_id},
                    "app1_user_setting_id":${user_setting_id},
                    "client_longitude": "${window.global_session_user_gps_longitude}",
                    "client_latitude": "${window.global_session_user_gps_latitude}"
                    }`;
    fetch(window.global_rest_url_base + window.global_rest_app1_user_setting_view +
            '?app_id=' + window.global_app_id + 
            '&lang_code=' + lang_code, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.global_rest_dt
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            null;
        })
}

function init_report(parameters) {
    let urlParams = new URLSearchParams(window.location.search);
	let user_account_id = urlParams.get('id');
	let user_setting_id = urlParams.get('sid');
	let lang_code = urlParams.get('lang_code');
	let reporttype = urlParams.get('type');
	init_common(parameters);
    init_app_report(user_account_id, lang_code).then(function(){
        get_report_globals().then(function(){
            //report start
            if (inIframe() == false) {
                updateReportViewStat(user_account_id, user_setting_id, lang_code);
            }
			switch (reporttype) {
                //day
                case '0':{document.getElementById('prayertable_day').style.visibility = 'visible';break;}
				case '1':{document.getElementById('prayertable_month').style.visibility = 'visible';break;}
				case '2':{document.getElementById('prayertable_year').style.visibility = 'visible';break;}
			}
			timetable_user_setting_get(user_setting_id, lang_code, (err, report_parameters) =>{
				if (err)
					null;
				else{
					timetable_translate_settings(report_parameters.locale, report_parameters.second_locale).then(function(){
						if (err)
							null;
						else
							if (reporttype==0){
								timetable_day_user_settings_get(user_account_id, lang_code, (err, user_settings_parameters) =>{
									if (err)
										null;
									else
										displayDay(report_parameters, null, report_parameters.locale, user_settings_parameters);
								})
							}
							else
								if (reporttype==1)
									displayMonth(0, report_parameters.ui_prayertable_month, report_parameters, report_parameters.locale);
								else 
									if (reporttype==2)
										displayYear(report_parameters, null, report_parameters.locale);
					});
				}
			});
        })
    }) 
}
