/*----------------------- */
/* Global timetable functions */
/*----------------------- */
function printTable(){
	let win = window.open('','printwindow','');
	let whatToPrint = document.getElementById('paper');
	let html;
	
	html = `<!DOCTYPE html>
			<html>
			<head>
				<meta charset='UTF-8'>
				<title></title>
				<link rel="stylesheet" type="text/css" href="/app${global_app_id}/css/app.css" />
				<link rel="stylesheet" type="text/css" href="/app${global_app_id}/css/app_themes.css" />
			</head>
			<body id="printbody">
				${whatToPrint.outerHTML}
			</body>
			</html>`;
	win.document.write(html);
	win.print();
	win.onafterprint = function(){
		win.close();
	}
	return null;

	}
/*----------------------- */
/* Timetable common functions */
/*----------------------- */
//check if day is ramadan day
function is_ramadan_day(year, month, day, timezone, calendartype, calendar_hijri_type, hijri_adj){
	let options_calendartype = {timeZone: timezone,
								month: 'numeric'};
	if (calendartype=='GREGORIAN'){
		let date_temp = new Date(year,month,day);
		date_temp.setDate(date_temp.getDate() + parseInt(hijri_adj));
		date_temp = date_temp.toLocaleDateString(global_regional_def_calendar_lang + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_calendar + calendar_hijri_type + global_regional_def_locale_ext_number_system + global_regional_def_calendar_number_system, options_calendartype);
		if (date_temp==9)
			return true;
	}
	else{
		if (month==9)
			return true;
	}
	return false;
}
//convert boolean to style alignment syntax
function get_align(al,ac,ar){
	if (al==true)
		return 'left';
	if (ac==true)
		return 'center';
	if (ar==true)
		return 'right';
	return '';
}
function setMethod_praytimes(settings_method, settings_asr, settings_highlat){
	prayTimes.setMethod(settings_method);
	//use methods without modifying original code
	if (global_prayer_praytimes_methods[settings_method].params.maghrib && 
		global_prayer_praytimes_methods[settings_method].params.midnight)
		prayTimes.adjust( { asr:      settings_asr,
							highLats: settings_highlat,
							fajr:     global_prayer_praytimes_methods[settings_method].params.fajr,
							isha:     global_prayer_praytimes_methods[settings_method].params.isha,
							maghrib:  global_prayer_praytimes_methods[settings_method].params.maghrib,
							midnight: global_prayer_praytimes_methods[settings_method].params.midnight} );
	else
		if (global_prayer_praytimes_methods[settings_method].params.maghrib)
			prayTimes.adjust( { asr:      settings_asr,
								highLats: settings_highlat,
								fajr:     global_prayer_praytimes_methods[settings_method].params.fajr,
								isha:     global_prayer_praytimes_methods[settings_method].params.isha,
								maghrib:  global_prayer_praytimes_methods[settings_method].params.maghrib} );
		else
			if (global_prayer_praytimes_methods[settings_method].params.midnight)
				prayTimes.adjust( { asr:      settings_asr,
									highLats: settings_highlat,
									fajr:     global_prayer_praytimes_methods[settings_method].params.fajr,
									isha:     global_prayer_praytimes_methods[settings_method].params.isha,
									midnight: global_prayer_praytimes_methods[settings_method].params.midnight} );
			else
				prayTimes.adjust( { asr:      settings_asr,
									highLats: settings_highlat,
									fajr:     global_prayer_praytimes_methods[settings_method].params.fajr,
									isha:     global_prayer_praytimes_methods[settings_method].params.isha} );
}
//header and footer style
function getstyle(img_src, al, ac, ar){
	let style='';
		if (fileisloaded(img_src))
		 	style = 'background-image:url("' + img_src +'");';
		style +=  'text-align:' + get_align(al,ac,ar);
		return style;
}
//show column with correct class and correct format
//for boh day and month timetable
function show_col(timetable, col, year, month, day, calendartype, show_fast_start_end, timezone, calendar_hijri_type, hijri_adjustment, locale, number_system, value){

	let display_value = convertnumberlocale(value.toString(), ':', locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + number_system);
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
function timetable_headers_month(items, settings){

	let header_row_index = 1;
	let html ='';
	if (settings.coltitle=='0' || settings.coltitle=='1'){
		//header row 1
		//add transliterated column titles	
		html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
					${makeTableRow(getColumnTitles(1, settings.calendartype, settings.locale), items, 0, null,null, settings)}
				</div>`;
		if (settings.coltitle=='1'){
			//header row 2
			header_row_index += 1;
			//add translated column titles
			html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
						${makeTableRow(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale), items, 0, null,null, settings)}
					</div>`;
		}
	}
	else
		if (settings.coltitle=='2' || settings.coltitle=='3'){
			//header row 1
			//add translated column titles
			html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
						${makeTableRow(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale), items, 0, null,null, settings)}
					</div>`;
			if (settings.coltitle=='2'){
				//header row 2
				header_row_index += 1;
				//add transliterated column titles
				html += `<div id='prayertable_month_header-row${header_row_index}' class='timetable_row prayertable_month_header-row'>
							${makeTableRow(getColumnTitles(1, settings.calendartype, settings.locale), items, 0, null,null, settings)}
						</div>`;
			}
		}
	//header row 3
	if (settings.second_locale!='0'){
		//show second locale except weekdays, they are already displayed on first header row
		let second_locale_titles = getColumnTitles(0, settings.calendartype, settings.second_locale, '', 'N');
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
						html += `<div class='timetable_col prayertable_month_calendartype'>${date_temp.toLocaleDateString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_calendar + settings.calendar_hijri_type + global_regional_def_locale_ext_number_system + settings.number_system, options_calendartype)}</div>`;
					}
					else{
						date  = HijriToGreg(settings.hijri_adj, new Array(year,month,data['day']));
						html += `<div class='timetable_col prayertable_month_calendartype'>${new Date(date[0],date[1]-1,date[2]).toLocaleDateString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_calendar + global_regional_def_calendar_type_greg + global_regional_def_locale_ext_number_system + settings.number_system, options_calendartype)}</div>`;
					}
					break;
					}
				case 'day':
					html += `<div class='timetable_col'>${data[i].toLocaleString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
				case 'weekday':
				case 'weekday_tr':{
					if (settings.calendartype=='GREGORIAN'){
						let date_temp = new Date(year,month,data['day']);
						date_temp.setDate(date_temp.getDate() + parseInt(settings.hijri_adj));
						html += `<div class='timetable_col prayertable_month_date'>${date_temp.toLocaleDateString(i=='weekday'?settings.locale:settings.second_locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_calendar + settings.calendar_hijri_type, options_weekday)}</div>`;
						}
					else{
						date    = HijriToGreg(settings.hijri_adj, new Array(year,month,data['day']));
						html += `<div class='timetable_col prayertable_month_date'>${new Date(date[0],date[1]-1,date[2]).toLocaleDateString(i=='weekday'?settings.locale:settings.second_locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_calendar + global_regional_def_calendar_type_greg, options_weekday)}</div>`;
						}
					break;
					}
				case 'fajr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_fajr, data['fajr']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
					}
				case 'dhuhr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_dhuhr, data['dhuhr']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
					}
				case 'asr_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_asr, data['asr']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;
					}
				case 'maghrib_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_maghrib, data['maghrib']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
					break;                    
					}
				case 'isha_iqamat':{
					iqamat = calculateIqamat(settings.iqamat_isha, data['isha']);
					html += `<div class='timetable_col'>${convertnumberlocale(iqamat.toString(), ':', settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system)}</div>`;
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
function displayMonth(offset, prayertable, settings) {

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

		header_style = getstyle(settings.header_img_src, settings.header_text_al, settings.header_text_ac, settings.header_text_ar);
		footer_style = getstyle(settings.footer_img_src, settings.footer_text_al, settings.footer_text_ac, settings.footer_text_ar);

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
		global_session_currentDate.setMonth(global_session_currentDate.getMonth()+ 1* offset);
		month = global_session_currentDate.getMonth();
		year = global_session_currentDate.getFullYear();
		title4 = new Date(year,month,1).toLocaleDateString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system, options).toUpperCase();
		}
	else
		if (settings.calendartype=='HIJRI'){
			//get previous or next Hijri month using current Hijri month  
			if (offset == -1){
				if (global_session_CurrentHijriDate[0] ==1){
					global_session_CurrentHijriDate[0] = 12;
					global_session_CurrentHijriDate[1] = global_session_CurrentHijriDate[1] - 1;
				}
				else
					global_session_CurrentHijriDate[0] = global_session_CurrentHijriDate[0] - 1;
			}
			else
				if (offset == 1){
					if (global_session_CurrentHijriDate[0] ==12){
						global_session_CurrentHijriDate[0] = 1;
						global_session_CurrentHijriDate[1] = global_session_CurrentHijriDate[1] + 1;
					}
					else
						global_session_CurrentHijriDate[0] = global_session_CurrentHijriDate[0] + 1;
				}
			month = global_session_CurrentHijriDate[0];
			year  = global_session_CurrentHijriDate[1];
			title_date    = HijriToGreg(0, new Array(year,month,1));
			title4 = new Date(title_date[0],title_date[1]-1,title_date[2]).toLocaleDateString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_calendar + settings.calendar_hijri_type + global_regional_def_locale_ext_number_system + settings.number_system, options).toUpperCase();
		}

	let items = getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale);
	month_html+=
	`<div id='timetable_header'>
		<div id='prayertable_month_header_title4'>${title4}</div>
		<div id='prayertable_month_header_title5'>${settings.second_locale!=0?gettimetabletitle(settings.locale) + ' ' + gettimetabletitle(settings.second_locale):gettimetabletitle(settings.locale)}</div>
	</div>
	<div id='timetable'>
		${timetable_headers_month(items, settings)}`;

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
						<div id='prayertable_month_footer_r1c2'>${settings.gps_label_lat}</div>
						<div id='prayertable_month_footer_r1c3'>${settings.gps_lat.toLocaleString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system)}</div>
						<div id='prayertable_month_footer_r1c4'>${settings.gps_label_long}</div>
						<div id='prayertable_month_footer_r1c5'>${settings.gps_long.toLocaleString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system)}</div>`
						:''}
					${settings.show_timezone == 'YES'?
						`<div id='prayertable_month_footer_r1c6'>${settings.timezone_label}</div>
						<div id='prayertable_month_footer_r1c7'>${settings.timezone}</div>`
						:''}
				</div>
			</div>
		</div>
		<div id='copyright'>${global_app_copyright}</div>
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

function timetable_headers_day(settings){
	let header_row_index = 1;
	let day_html ='';
	if (settings.coltitle=='0' || settings.coltitle=='1'){
		//header row 1
		//add transliterated column titles	
		day_html += create_day_title_row(getColumnTitles(1, settings.calendartype, settings.locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
		if (settings.coltitle=='1'){
			//header row 2
			header_row_index += 1;
			//add translated column titles
			day_html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
		}
	}
	else
		if (settings.coltitle=='2' || settings.coltitle=='3'){
			//header row 1
			//add translated column titles
			day_html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.locale, settings.second_locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
			if (settings.coltitle=='2'){
				//header row 2
				header_row_index += 1;
				//add transliterated column titles
				day_html += create_day_title_row(getColumnTitles(1, settings.calendartype, settings.locale), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
			}
		}
	//header row 3
	if (settings.second_locale!='0'){
		//show second locale except weekdays, they are already displayed on first header row
		header_row_index += 1;;
		day_html += create_day_title_row(getColumnTitles(0, settings.calendartype, settings.second_locale, '', 'N'), header_row_index, settings.show_imsak, settings.show_sunset, settings.show_midnight);
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

function displayDay(settings, settings_ui, item_id){

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
					
	if (item_id ==0)
		offset = 0;
	else
		offset = item_id == settings_ui.navigation_left ? -1:+1;
	global_session_currentDate.setDate(global_session_currentDate.getDate()+ 1* offset);
	
	let date_current = new Date(global_session_currentDate.getFullYear(),global_session_currentDate.getMonth(),global_session_currentDate.getDate());
	let date_title4 = date_current.toLocaleDateString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system, options).toUpperCase();
	date_current.setDate(date_current.getDate() + parseInt(settings.hijri_adj));
	let date_title5 = date_current.toLocaleDateString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_calendar + settings.calendar_hijri_type + global_regional_def_locale_ext_number_system + settings.number_system, options_hijri).toUpperCase();
	
	//Set theme and font classes on main div
	settings_ui.prayertable_day.classList = settings.theme_day + ' ' + 'prayertable_font_' + settings.arabic_script;		
	//set LTR or RTL on table layout
	settings_ui.prayertable_day.style.direction = settings.direction;

	let header_style = getstyle(settings.header_img_src, settings.header_text_al, settings.header_text_ac, settings.header_text_ar);
	let footer_style = getstyle(settings.footer_img_src, settings.footer_text_al, settings.footer_text_ac, settings.footer_text_ar);

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
		${timetable_headers_day(settings)}
		<div class='prayertable_day_timetable_settings'>`;
	
	let select_user_settings = document.getElementById('setting_select_user_setting');
	let user_locale;
	let select_user_timezone_report = document.getElementById('setting_select_report_timezone');
	let user_timezone;
	let user_label_timezone;
	let select_number_system = document.getElementById('setting_select_report_numbersystem');
	let user_number_system;
	let select_calendar_hijri_type = document.getElementById('setting_select_calendar_hijri_type');
	let user_calendar_hijri_type;
	let user_gps_label_latitude;
	let user_gps_latitude;
	let user_gps_label_longitude;
	let user_gps_longitude;
	let user_show_gps;
	let user_show_timezone;
	let select_method = document.getElementById('setting_select_method');
	let user_method;
	let select_asr = document.getElementById('setting_select_asr');
	let user_asr;
	let select_highlat = document.getElementById('setting_select_highlatitude');
	let user_highlat;
	let select_format = document.getElementById('setting_select_timeformat');
	let user_format;
	let select_hijri_adjustment = document.getElementById('setting_select_hijri_adjustment');
	let user_hijri_adjustment;
	let user_show_imsak;
	let user_show_sunset;
	let user_show_midnight;
	let user_show_fast_start_end;
	let user_place;
	//update user settings to current select option 
	set_settings_select();
	for (i=0;i<=select_user_settings.options.length-1;i++){
		//language
		user_locale = select_user_settings[i].getAttribute('regional_language_locale');
		//timezone report
		user_timezone = select_user_timezone_report[select_user_settings[i].getAttribute('regional_timezone_select_id')].value
		user_label_timezone = settings.timezone_label;
		//number system
		user_number_system = select_number_system[select_user_settings[i].getAttribute('regional_number_system_select_id')].value;
		//calendar hijri type
		user_calendar_hijri_type = select_calendar_hijri_type[select_user_settings[i].getAttribute('regional_calendar_hijri_type_select_id')].value;
		//gps text - current translation
		user_gps_label_latitude = settings.gps_label_lat;
		//gps latitude
		user_gps_latitude = parseFloat(select_user_settings[i].getAttribute('gps_lat_text'));
		//gps text - current translation
		user_gps_label_longitude = settings.gps_label_long;
		//gps longitude
		user_gps_longitude = parseFloat(select_user_settings[i].getAttribute('gps_long_text'));
		//show gps - current setting
		user_show_gps = settings.show_gps;
		//user_show_gps = select_user_settings[i].getAttribute('design_column_gps_checked');
		//show timezone - current setting
		user_show_timezone = settings.show_timezone;
		//user_show_timezone = select_user_settings[i].getAttribute('design_column_timezone_checked');
		//method
		user_method = select_method[select_user_settings[i].getAttribute('prayer_method_select_id')].value;
		//asr method
		user_asr = select_asr[select_user_settings[i].getAttribute('prayer_asr_method_select_id')].value;
		//highlat adjustment
		user_highlat = select_highlat[select_user_settings[i].getAttribute('prayer_high_latitude_adjustment_select_id')].value;
		//format
		user_format = select_format[select_user_settings[i].getAttribute('prayer_time_format_select_id')].value;
		//hijri adjustment
		user_hijri_adjustment = select_hijri_adjustment[select_user_settings[i].getAttribute('prayer_hijri_date_adjustment_select_id')].value;
		//show imsak - current setting
		user_show_imsak = settings.show_imsak;
		//show sunset - current setting
		user_show_sunset = settings.show_sunset;
		//show midnight - current setting
		user_show_midnight = settings.show_midnight;
		//show fast start and end - current setting
		user_show_fast_start_end = settings.show_fast_start_end;
		//place info
		user_place = select_user_settings[i].getAttribute('description');
	
		setMethod_praytimes(user_method, user_asr, user_highlat);
		times = prayTimes.getTimes(global_session_currentDate, [user_gps_latitude, user_gps_longitude], getTimezoneOffset(user_timezone), 0, user_format);				
		let col_imsak = user_show_imsak == 'YES'?show_col(1, 'imsak', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment,user_locale, user_number_system, times['imsak']):''; 
		let col_fajr = show_col(1, 'fajr', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['fajr']);
		let col_sunrise = show_col(1, 'sunrise', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['sunrise']);
		let col_dhuhr = show_col(1, 'dhuhr', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['dhuhr']);
		let col_asr = show_col(1, 'asr', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['asr']);
		let col_sunset = user_show_sunset == 'YES'?show_col(1, 'sunset', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment,user_locale, user_number_system, times['sunset']):'';
		let col_maghrib = show_col(1, 'maghrib', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['maghrib']);
		let col_isha = show_col(1, 'isha', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['isha']);
		let col_midnight = user_show_midnight == 'YES'? show_col(1, 'midnight', global_session_currentDate.getFullYear(), global_session_currentDate.getMonth(), global_session_currentDate.getDate(), 'GREGORIAN', user_show_fast_start_end, user_timezone, user_calendar_hijri_type, user_hijri_adjustment, user_locale, user_number_system, times['midnight']):'';
		day_html +=
			`<div class='prayertable_day_timetable_row_data ${isToday(date_current)==true?'prayertable_day_today-row':''}'>
				${col_imsak}${col_fajr}${col_sunrise}${col_dhuhr}${col_asr}${col_sunset}${col_maghrib}${col_isha}${col_midnight}
			</div>
			<div class='prayertable_day_timetable_footer'>
				<div class='prayertable_day_timetable_footer_row'>
					<div class='prayertable_day_timetable_footer_r1c1'>${user_place}</div>
					<div class='prayertable_day_timetable_footer_r1c2'>${user_show_gps == 'YES' ? user_gps_label_latitude:''}</div>
					<div class='prayertable_day_timetable_footer_r1c3'>${user_show_gps == 'YES' ? user_gps_latitude.toLocaleString(user_locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + user_number_system):''}</div>
					<div class='prayertable_day_timetable_footer_r1c4'>${user_show_gps == 'YES' ? user_gps_label_longitude:''}</div>
					<div class='prayertable_day_timetable_footer_r1c5'>${user_show_gps == 'YES' ? user_gps_longitude.toLocaleString(user_locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + user_number_system):''}</div>
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
	<div id='copyright'>${global_app_copyright}</div>
	<div id='prayertable_day_footer_row' style='${footer_style}'>
		<div id='prayertable_day_footer_title1' class='prayertable_day_footer' >${settings.footer_txt1}</div>
		<div id='prayertable_day_footer_title2' class='prayertable_day_footer' >${settings.footer_txt2}</div>
		<div id='prayertable_day_footer_title3' class='prayertable_day_footer' >${settings.footer_txt3}</div>
		<div></div>
	</div>
	<div id='prayertable_day_time'>
	</div>`;
	settings_ui.prayertable_day.innerHTML = day_html;
}
/*----------------------- */
/* Timetable year functions */
/*----------------------- */
function displayYear(settings, settings_ui, item_id){
	
	let startmonth            = global_session_currentDate.getMonth();
	let starthijrimonth       = global_session_CurrentHijriDate[0];
	let year_html='';
	
	settings.reporttype        = 'YEAR';
	
	//Set theme and font class
	settings_ui.prayertable_year.classList = settings.theme_year + ' ' + 'prayertable_font_' + settings.arabic_script;
	//set LTR or RTL on year layout
	settings_ui.prayertable_year.style.direction = settings.direction;

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
	if (item_id == settings_ui.navigation_left){
		if (settings.calendartype=='GREGORIAN')
			global_session_currentDate.setYear(global_session_currentDate.getFullYear() - 1);
		else
			global_session_CurrentHijriDate[1] = global_session_CurrentHijriDate[1] - 1;
	}
	else 
		if (item_id == settings_ui.navigation_right){
			if (settings.calendartype=='GREGORIAN')
				global_session_currentDate.setYear(global_session_currentDate.getFullYear() + 1);
			else
				global_session_CurrentHijriDate[1] = global_session_CurrentHijriDate[1] + 1;
			}

	let header_style = getstyle(settings.header_img_src, settings.header_text_al, settings.header_text_ac, settings.header_text_ar);
	let footer_style = getstyle(settings.footer_img_src, settings.footer_text_al, settings.footer_text_ac, settings.footer_text_ar);

	//timetable header
	//show year with selected locale and number system for both Hijri and Gregorian
	let options_year = { timeZone: settings.timezone, 
						 year: 'numeric',
						 useGrouping:false};
	let year_title4;
	if (settings.calendartype=='GREGORIAN'){
		year_title4 = global_session_currentDate.getFullYear();
		year_title4 = year_title4.toLocaleString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system, options_year);
	}
	else{
		//HIJRI
		year_title4 = global_session_CurrentHijriDate[1];
		year_title4 = year_title4.toLocaleString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system, options_year);
	}
	//timetables
	let months = new Array(12);
	let timetable_month = document.createElement('div');
	for (let monthindex = 1; monthindex <= 12; monthindex++) { 
		if (settings.calendartype=='GREGORIAN')
			global_session_currentDate.setMonth(monthindex -1);
		else
			global_session_CurrentHijriDate[0] = monthindex;
		displayMonth(0, timetable_month, settings);
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
		<div id='prayertable_year_header_title5' class='prayertable_year_header' >${settings.second_locale!=0?gettimetabletitle(settings.locale) + ' ' + gettimetabletitle(settings.second_locale):gettimetabletitle(settings.locale)}</div>
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
				<div id='prayertable_year_timetable_footer_r1c2' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?settings.gps_label_lat:''}</div>
				<div id='prayertable_year_timetable_footer_r1c3' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?settings.gps_lat.toLocaleString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system):''}</div>
				<div id='prayertable_year_timetable_footer_r1c4' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?settings.gps_label_long:''}</div>
				<div id='prayertable_year_timetable_footer_r1c5' ${settings.show_gps == 'YES'?'class=""':'class="hidden"'}>${settings.show_gps == 'YES'?settings.gps_long.toLocaleString(settings.locale + global_regional_def_locale_ext_prefix + global_regional_def_locale_ext_number_system + settings.number_system):''}</div>
				<div id='prayertable_year_timetable_footer_r1c6' ${settings.show_timezone == 'YES'?'class=""':'class="hidden"'}>${settings.show_timezone == 'YES'?settings.timezone_label:''}</div>
				<div id='prayertable_year_timetable_footer_r1c7' ${settings.show_timezone == 'YES'?'class=""':'class="hidden"'}>${settings.show_timezone == 'YES'?settings.timezone:''}</div>
			</div>
		</div>
	</div>
	<div id='copyright'>${global_app_copyright}</div>
	<div class='prayertable_year_row' id='prayertable_year_footer_row' style='${footer_style}'>
		<div id='prayertable_year_footer_title1' class='prayertable_year_footer' >${settings.footer_txt1}</div>
		<div id='prayertable_year_footer_title2' class='prayertable_year_footer' >${settings.footer_txt2}</div>
		<div id='prayertable_year_footer_title3' class='prayertable_year_footer' >${settings.footer_txt3}</div>
		<div></div>
	</div>`;
	settings_ui.prayertable_year.innerHTML = year_html;

	global_session_currentDate.setMonth(startmonth);
	global_session_CurrentHijriDate[0] = starthijrimonth;
}
// update timetable
function update_timetable_report(option = 0, item_id = 0) {

	let settings ={ prayertable_month       : 'prayertable_month', //class to add for month
					prayertable_year_month  : 'prayertable_year_month', //class to add for year
					reporttype          	: 'MONTH', //MONTH: normal month with more info, YEAR: month with less info
					locale              	: document.getElementById('setting_select_locale').value,  
					timezone            	: document.getElementById('setting_select_report_timezone').value,
					timezone_label	   		: document.getElementById('setting_label_report_timezone').innerHTML,
					number_system       	: document.getElementById('setting_select_report_numbersystem').value,
					direction           	: document.getElementById('setting_select_report_direction').value,
					second_locale       	: document.getElementById('setting_select_report_locale_second').value,
					arabic_script       	: document.getElementById('setting_select_report_arabic_script').value,
					calendartype        	: document.getElementById('setting_select_calendartype').value,
					calendar_hijri_type 	: document.getElementById('setting_select_calendar_hijri_type').value,

					place               	: document.getElementById('setting_input_place').value,
					gps_lat             	: parseFloat(document.getElementById('setting_input_lat').value),
					gps_long            	: parseFloat(document.getElementById('setting_input_long').value),
					gps_label_lat       	: document.getElementById('setting_label_lat').innerHTML,
					gps_label_long      	: document.getElementById('setting_label_long').innerHTML,

					theme_day           	: 'theme_day_' + get_theme_id('day'),
					theme_month         	: 'theme_month_' + get_theme_id('month'),
					theme_year          	: 'theme_year_' + get_theme_id('year'),
					coltitle            	: document.getElementById('setting_select_report_coltitle').value,
					highlight           	: document.getElementById('setting_select_report_highlight_row').value,
					show_weekday        	: checkbox_value(document.getElementById('setting_checkbox_report_show_weekday')),
					show_calendartype   	: checkbox_value(document.getElementById('setting_checkbox_report_show_calendartype')),
					show_notes          	: checkbox_value(document.getElementById('setting_checkbox_report_show_notes')),
					show_gps   	       		: checkbox_value(document.getElementById('setting_checkbox_report_show_gps')),
					show_timezone       	: checkbox_value(document.getElementById('setting_checkbox_report_show_timezone')),
								
					header_img_src      	: document.getElementById('setting_reportheader_img').src,
					footer_img_src      	: document.getElementById('setting_reportfooter_img').src,
	
					header_txt1         	: document.getElementById('setting_input_reporttitle1').value,
					header_txt2         	: document.getElementById('setting_input_reporttitle2').value,
					header_txt3         	: document.getElementById('setting_input_reporttitle3').value,
					//button is active set left, center or right true/false
					header_text_al      	: document.getElementById('setting_input_reporttitle_aleft').classList.contains('setting_button_active'),
					header_text_ac      	: document.getElementById('setting_input_reporttitle_acenter').classList.contains('setting_button_active'),
					header_text_ar      	: document.getElementById('setting_input_reporttitle_aright').classList.contains('setting_button_active'),
					footer_txt1         	: document.getElementById('setting_input_reportfooter1').value,
					footer_txt2         	: document.getElementById('setting_input_reportfooter2').value,
					footer_txt3    	   		: document.getElementById('setting_input_reportfooter3').value,
					//button is active set left, center or right true/false
					footer_text_al      	: document.getElementById('setting_input_reportfooter_aleft').classList.contains('setting_button_active'),
					footer_text_ac      	: document.getElementById('setting_input_reportfooter_acenter').classList.contains('setting_button_active'),
					footer_text_ar      	: document.getElementById('setting_input_reportfooter_aright').classList.contains('setting_button_active'),
					
					method              	: document.getElementById('setting_select_method').value,
					asr                 	: document.getElementById('setting_select_asr').value,
					highlat             	: document.getElementById('setting_select_highlatitude').value,
					format              	: document.getElementById('setting_select_timeformat').value,
					hijri_adj           	: document.getElementById('setting_select_hijri_adjustment').value,
					iqamat_fajr         	: document.getElementById('setting_select_report_iqamat_title_fajr').value,
					iqamat_dhuhr        	: document.getElementById('setting_select_report_iqamat_title_dhuhr').value,
					iqamat_asr          	: document.getElementById('setting_select_report_iqamat_title_asr').value,
					iqamat_maghrib      	: document.getElementById('setting_select_report_iqamat_title_maghrib').value,
					iqamat_isha         	: document.getElementById('setting_select_report_iqamat_title_isha').value,
					show_imsak          	: checkbox_value(document.getElementById('setting_checkbox_report_show_imsak')),
					show_sunset         	: checkbox_value(document.getElementById('setting_checkbox_report_show_sunset')),
					show_midnight       	: checkbox_value(document.getElementById('setting_checkbox_report_show_midnight')),
					show_fast_start_end 	: document.getElementById('setting_select_report_show_fast_start_end').value};
					
	let settings_ui = {	navigation_left     : 'toolbar_navigation_btn_left',
						navigation_right    : 'toolbar_navigation_btn_right',
						prayertable_day     : document.getElementById('prayertable_day'),
						prayertable_month   : document.getElementById('prayertable_month'),
						prayertable_year    : document.getElementById('prayertable_year')
					  };
	dialogue_loading(1);
	switch (option){
	//create timetable month or day or year if they are visible instead
	case 0:{
		if (settings_ui.prayertable_month.style.visibility == 'visible'){
			if (item_id==0){
			//run same period again
			displayMonth(0, settings_ui.prayertable_month, settings);
			}
			else{
			//if item_id is set then navigate previous/next month
			if (item_id == settings_ui.navigation_left)
				displayMonth(-1, settings_ui.prayertable_month, settings);
			else 
				if (item_id == settings_ui.navigation_right)
				displayMonth(+1, settings_ui.prayertable_month, settings);
			}
		}
		else
			if (settings_ui.prayertable_day.style.visibility == 'visible')
				update_timetable_report(2, item_id);
			else
				if (settings_ui.prayertable_year.style.visibility == 'visible')
					update_timetable_report(1, item_id);
		break;
	}
	//1=create timetable year
	case 1:{
		displayYear(settings, settings_ui, item_id);
		break;
	}
	//2=create timetable day
	case 2:{
		displayDay(settings, settings_ui, item_id);
		break;
	}
	default:{
		break;
		}
	}
	dialogue_loading(0);
	return null;
}