/*------------ */
/* Global code */
/*------------ */

//delay API calls when typing to avoid too many calls 
var typewatch = function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}();
/*---------------------------------------*/
/*    Translate variables and functions  */
/*---------------------------------------*/
//first_language and second_language variables
//saved temporary to improve performance
var first_language = 
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
					"coltitle_notes": "Notes"
				};
//second language objects that are displayed are column titles
//transliterated column titles are used by first language

var second_language =
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

function gettimetabletitle(locale) {
	if (locale == document.getElementById('setting_select_locale').value)
		return first_language.timetable_title;
	else
		return second_language.timetable_title;
}
function getweekday(locale) {
	if (locale == document.getElementById('setting_select_locale').value)
		return first_language.coltitle_weekday;
	else
		return second_language.coltitle_weekday;
}
function getColumnTitles(transliteration = 0, calendartype, locale, second_locale, check_second = 'Y') {
	var coltitle = {day: '',
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
		coltitle['imsak'] = first_language.coltitle_transliteration_imsak;
		coltitle['fajr'] = first_language.coltitle_transliteration_fajr;
		coltitle['fajr_iqamat'] = first_language.coltitle_transliteration_fajr_iqamat;
		coltitle['sunrise'] = first_language.coltitle_transliteration_sunrise;
		coltitle['dhuhr'] = first_language.coltitle_transliteration_dhuhr;
		coltitle['dhuhr_iqamat'] = first_language.coltitle_transliteration_dhuhr_iqamat;
		coltitle['asr'] = first_language.coltitle_transliteration_asr;
		coltitle['asr_iqamat'] = first_language.coltitle_transliteration_asr_iqamat;
		coltitle['sunset'] = first_language.coltitle_transliteration_sunset;
		coltitle['maghrib'] = first_language.coltitle_transliteration_maghrib;
		coltitle['maghrib_iqamat'] = first_language.coltitle_transliteration_maghrib_iqamat;
		coltitle['isha'] = first_language.coltitle_transliteration_isha;
		coltitle['isha_iqamat'] = first_language.coltitle_transliteration_isha_iqamat;
		coltitle['midnight'] = first_language.coltitle_transliteration_midnight;
		}
	else {
		if (locale==document.getElementById('setting_select_locale').value){
			coltitle['day'] =first_language.coltitle_day;
			coltitle['weekday'] =first_language.coltitle_weekday;
			if (second_locale != '0' & check_second == 'Y') {
				coltitle['weekday_tr'] = getweekday(second_locale);
			} else
				coltitle['weekday_tr'] = '';
			if (calendartype == 'GREGORIAN') {
				coltitle['caltype'] = first_language.coltitle_caltype_hijri;
			} else {
				coltitle['caltype'] = first_language.coltitle_caltype_gregorian;
			}
			coltitle['imsak'] =first_language.coltitle_imsak;
			coltitle['fajr'] =first_language.coltitle_fajr;
			coltitle['fajr_iqamat'] =first_language.coltitle_fajr_iqamat;
			coltitle['sunrise'] =first_language.coltitle_sunrise;
			coltitle['dhuhr'] =first_language.coltitle_dhuhr;
			coltitle['dhuhr_iqamat'] =first_language.coltitle_dhuhr_iqamat;
			coltitle['asr'] =first_language.coltitle_asr;
			coltitle['asr_iqamat'] =first_language.coltitle_asr_iqamat;
			coltitle['sunset'] =first_language.coltitle_sunset;
			coltitle['maghrib'] =first_language.coltitle_maghrib;
			coltitle['maghrib_iqamat'] =first_language.coltitle_maghrib_iqamat;
			coltitle['isha'] =first_language.coltitle_isha;
			coltitle['isha_iqamat'] =first_language.coltitle_isha_iqamat;
			coltitle['midnight'] =first_language.coltitle_midnight;
			coltitle['notes'] =first_language.coltitle_notes;
		}
		else{
			coltitle['day'] =second_language.coltitle_day;
			coltitle['weekday'] =second_language.coltitle_weekday;
			if (second_locale != '0' & check_second == 'Y') {
				coltitle['weekday_tr'] = getweekday(second_locale);
			} else
				coltitle['weekday_tr'] = '';
			if (calendartype == 'GREGORIAN') {
				coltitle['caltype'] = second_language.coltitle_caltype_hijri;
			} else {
				coltitle['caltype'] = second_language.coltitle_caltype_gregorian;
			}
			coltitle['imsak'] =second_language.coltitle_imsak;
			coltitle['fajr'] =second_language.coltitle_fajr;
			coltitle['fajr_iqamat'] =second_language.coltitle_fajr_iqamat;
			coltitle['sunrise'] =second_language.coltitle_sunrise;
			coltitle['dhuhr'] =second_language.coltitle_dhuhr;
			coltitle['dhuhr_iqamat'] =second_language.coltitle_dhuhr_iqamat;
			coltitle['asr'] =second_language.coltitle_asr;
			coltitle['asr_iqamat'] =second_language.coltitle_asr_iqamat;
			coltitle['sunset'] =second_language.coltitle_sunset;
			coltitle['maghrib'] =second_language.coltitle_maghrib;
			coltitle['maghrib_iqamat'] =second_language.coltitle_maghrib_iqamat;
			coltitle['isha'] =second_language.coltitle_isha;
			coltitle['isha_iqamat'] =second_language.coltitle_isha_iqamat;
			coltitle['midnight'] =second_language.coltitle_midnight;
			coltitle['notes'] =second_language.coltitle_notes;
		}
		};
	return coltitle;
}


async function settings_translate_report(first=true) {
    var json;
    var status;
    let locale='';
    if (first==true)
        locale = document.getElementById('setting_select_locale').value;
    else
        locale = document.getElementById('setting_select_report_locale_second').value;
    if (locale != 0){
        //fetch any message with first language always
        //show translation using first or second language
        await fetch(global_rest_url_base + global_rest_app_object + locale +
                '?app_id=' + global_app_id + 
                '&lang_code=' + document.getElementById('setting_select_locale').value, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + global_rest_dt,
        }
        })
        .then(function(response) {
        status = response.status;
        return response.text();
        })
        .then(function(result) {
        if (status === 200) {
            json = JSON.parse(result);	
            for (var i = 0; i < json.data.length; i++){
                if (first == true){
                    if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='REPORT')
                        first_language[json.data[i].object_item_name.toLowerCase()] = json.data[i].text;

                    //Used by service report
                    //Regional
                    if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='SETTING_NAV_REGIONAL' && 
                        json.data[i].object_item_name=='SETTING_LABEL_REPORT_TIMEZONE')
                        document.getElementById('setting_label_report_timezone').innerHTML = json.data[i].text;
                    //GPS
                    if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='SETTING_NAV_GPS' && 
                        json.data[i].object_item_name=='SETTING_LABEL_LAT')
                        document.getElementById('setting_label_lat').innerHTML = json.data[i].text;
                    if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='SETTING_NAV_GPS' && 
                        json.data[i].object_item_name=='SETTING_LABEL_LONG')
                        document.getElementById('setting_label_long').innerHTML = json.data[i].text;
                }
                else{
                    for (var i = 0; i < json.data.length; i++){	
                        if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='REPORT')
                            second_language[json.data[i].object_item_name.toLowerCase()] = json.data[i].text;						
                    }
                }
            }          
            //if translating first language and second language is not used
            if (first == true &&
                document.getElementById('setting_select_report_locale_second').value ==0){
                second_language.timetable_title = '';
                second_language.coltitle_day = '';
                second_language.coltitle_weekday = '';
                second_language.coltitle_weekday_tr = '';
                second_language.coltitle_caltype_hijri = '';
                second_language.coltitle_caltype_gregorian = '';
                second_language.coltitle_imsak = '';
                second_language.coltitle_fajr = '';
                second_language.coltitle_fajr_iqamat = '';
                second_language.coltitle_sunrise = '';
                second_language.coltitle_dhuhr = '';
                second_language.coltitle_dhuhr_iqamat = '';
                second_language.coltitle_asr = '';
                second_language.coltitle_asr_iqamat = '';
                second_language.coltitle_sunset = '';
                second_language.coltitle_maghrib = '';
                second_language.coltitle_maghrib_iqamat = '';
                second_language.coltitle_isha = '';
                second_language.coltitle_isha_iqamat = '';
                second_language.coltitle_midnight = '';
                second_language.coltitle_notes = '';
            }
        } else {
            if (status == 401)
                user_logoff();
        }
        });

    }
	return null;
}

async function settings_translate(first=true) {
	var json;
    var status;
    let locale;
    if (first ==true)
        locale = document.getElementById('setting_select_locale').value
    else
        locale = document.getElementById('setting_select_report_locale_second').value
    if (locale != 0){
        //fetch any message with first language always
        //show translation using first or second language
        let url = `${global_rest_url_base}${global_rest_app_object}${locale}` +
                  `?app_id=${global_app_id}` + 
                  `&lang_code=${document.getElementById('setting_select_locale').value}`;
        await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + global_rest_dt,
            }
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status === 200) {
                json = JSON.parse(result);
                for (var i = 0; i < json.data.length; i++){
                    if (first==true){
                        if (json.data[i].object=='APP_OBJECT'){
                            if (json.data[i].object_name=='APP_DESCRIPTION')
                                document.getElementById(json.data[i].object_name.toLowerCase()).innerHTML = json.data[i].text;
                            if (json.data[i].object_name=='SETTING_NAV_REGIONAL')
                                document.getElementById('tab_1_nav_label_regional').innerHTML = json.data[i].text;
                            if (json.data[i].object_name=='SETTING_NAV_GPS')
                                document.getElementById('tab_2_nav_label_gps').innerHTML = json.data[i].text;
                            if (json.data[i].object_name=='SETTING_NAV_DESIGN')
                                document.getElementById('tab_3_nav_label_design').innerHTML = json.data[i].text;
                            if (json.data[i].object_name=='SETTING_NAV_IMAGE')
                                document.getElementById('tab_4_nav_label_image').innerHTML = json.data[i].text;
                            if (json.data[i].object_name=='SETTING_NAV_TEXT')
                                document.getElementById('tab_5_nav_label_text').innerHTML = json.data[i].text;
                            if (json.data[i].object_name=='SETTING_NAV_PRAYER')
                                document.getElementById('tab_6_nav_label_prayer').innerHTML = json.data[i].text;
                            if (json.data[i].object_name=='SETTING_NAV_USER')
                                document.getElementById('tab_7_nav_label_user').innerHTML = json.data[i].text;
                        }
                        if (json.data[i].object=='APP_OBJECT_ITEM'){
            
                            //alt text
                            if (json.data[i].object_name=='SETTING_NAV_IMAGE' &&
                                (json.data[i].object_item_name=='SETTING_REPORTHEADER_IMG' ||
                                json.data[i].object_item_name=='SETTING_REPORTFOOTER_IMG'))
                                document.getElementById(json.data[i].object_item_name.toLowerCase()).alt = json.data[i].text;
                            else 
                                //placeholder text
                                if (json.data[i].object_name=='DIALOGUE' &&
                                    (json.data[i].object_item_name=='LOGIN_USERNAME' ||
                                    json.data[i].object_item_name=='LOGIN_PASSWORD' ||
                                    json.data[i].object_item_name=='SIGNUP_USERNAME' ||
                                    json.data[i].object_item_name=='SIGNUP_EMAIL'||
                                    json.data[i].object_item_name=='SIGNUP_PASSWORD'||
                                    json.data[i].object_item_name=='SIGNUP_PASSWORD_CONFIRM'||
                                    json.data[i].object_item_name=='SIGNUP_PASSWORD_REMINDER'))
                                    document.getElementById(json.data[i].object_item_name.toLowerCase()).placeholder = json.data[i].text;
                                else
                                    if (json.data[i].object_item_name=='LOGIN_CONTINUE_WITH')
                                        document.getElementById('login_btn_facebook').innerHTML = json.data[i].text + ' ' + global_app_user_provider2_name;
                                    else{
                                        if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='REPORT')
                                            first_language[json.data[i].object_item_name.toLowerCase()] = json.data[i].text;
                                        else{									
                                            //set text on the rest objects in innerHTML
                                            try{
                                                document.getElementById(json.data[i].object_item_name.toLowerCase()).innerHTML = json.data[i].text;
                                            }
                                            catch (err){
                                                console.log(json.data[i].object_item_name.toLowerCase());
                                            }
                                        }
                                    }
                        }
                        if (json.data[i].object=='APP_OBJECT_ITEM_SUBITEM'){
                            if (json.data[i].object_name=='TOOLBAR')
                                //popup menu items
                                document.getElementById(json.data[i].subitem_name.toLowerCase()).innerHTML = json.data[i].text;
                            else{
                                //update select objects
                                var select_element = json.data[i].object_item_name;
                                //option number not saved in column but end with the option number
                                var select_option = json.data[i].subitem_name.substr(json.data[i].subitem_name.lastIndexOf('_')+1);
                                try{
                                    document.getElementById(select_element.toLowerCase()).options[select_option].text = json.data[i].text;
                                }
                                catch(err){
                                    console.log(json.data[i].object_item_name.toLowerCase());
                                }
                            }
                        }
                    }
                    else{
                        for (var i = 0; i < json.data.length; i++){
                            if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='REPORT')
                                second_language[json.data[i].object_item_name.toLowerCase()] = json.data[i].text;						
                        }
                    }
                    
                }
                if (first==true){
                    //country
                    fetch(global_rest_url_base + global_rest_country + document.getElementById('setting_select_locale').value, 
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + global_rest_at
                            }
                        })
                    .then(function(response) {
                        status = response.status;
                        return response.text();
                    })
                    .then(function(result) {
                        if (status === 200) {
                            json = JSON.parse(result);
                            let select_country = document.getElementById('setting_select_country');
                            let html=`<option value='' id='' label='…' selected='selected'>…</option>`;
                            for (var i = 0; i < json.countries.length; i++){
                                if (i === 0){
                                    html += `<optgroup label=${json.countries[i].group_name} />`;
                                    current_group_name = json.countries[i].group_name;
                                  }
                                  else{
                                    if (json.countries[i].group_name !== current_group_name){
                                        html += `<optgroup label=${json.countries[i].group_name} />`;
                                        current_group_name = json.countries[i].group_name;
                                    }
                                    html +=
                                    `<option value=${i}
                                            id=${json.countries[i].id} 
                                            country_code=${json.countries[i].country_code} 
                                            flag_emoji=${json.countries[i].flag_emoji} 
                                            group_name=${json.countries[i].group_name}>${json.countries[i].flag_emoji} ${json.countries[i].text}
                                    </option>`
                                  }
                            }
                            select_country.innerHTML = html;
                            //locale
                            fetch(global_rest_url_base + global_rest_language_locale + document.getElementById('setting_select_locale').value, 
                            {
                                method: 'GET',
                                headers: {
                                    'Authorization': 'Bearer ' + global_rest_at
                                }
                            })
                            .then(function(response) {
                                status = response.status;
                                return response.text();
                            })
                            .then(function(result) {
                                if (status === 200) {
                                    json = JSON.parse(result);
                                    let html='';
                                    let select_locale = document.getElementById('setting_select_locale');
                                    let select_second_locale = document.getElementById('setting_select_report_locale_second');        
                                    let current_locale = select_locale.value;
                                    let current_second_locale = select_second_locale.value;
                                    for (var i = 0; i < json.locales.length; i++){
                                        html += `<option id="${i}" value="${json.locales[i].locale}">${json.locales[i].text}</option>`;
                                    }
                                    select_locale.innerHTML = html;
                                    select_locale.value = current_locale;
                                    select_second_locale.innerHTML = select_second_locale.options[0].outerHTML + html;
                                    select_second_locale.value = current_second_locale;
                                }
                            }).catch(function(error) {
                                alert(responseText_get_error('settings_translate locale', error));
                            })
                        }
                    }).catch(function(error) {
                        alert(responseText_get_error('settings_translate country', error));
                    })
                }
                //if translating first language and second language is not used
                if (first == true &&
                    document.getElementById('setting_select_report_locale_second').value ==0){
                    second_language.timetable_title = '';
                    second_language.coltitle_day = '';
                    second_language.coltitle_weekday = '';
                    second_language.coltitle_weekday_tr = '';
                    second_language.coltitle_caltype_hijri = '';
                    second_language.coltitle_caltype_gregorian = '';
                    second_language.coltitle_imsak = '';
                    second_language.coltitle_fajr = '';
                    second_language.coltitle_fajr_iqamat = '';
                    second_language.coltitle_sunrise = '';
                    second_language.coltitle_dhuhr = '';
                    second_language.coltitle_dhuhr_iqamat = '';
                    second_language.coltitle_asr = '';
                    second_language.coltitle_asr_iqamat = '';
                    second_language.coltitle_sunset = '';
                    second_language.coltitle_maghrib = '';
                    second_language.coltitle_maghrib_iqamat = '';
                    second_language.coltitle_isha = '';
                    second_language.coltitle_isha_iqamat = '';
                    second_language.coltitle_midnight = '';
                    second_language.coltitle_notes = '';
                }
                //fix fontsizes for toolbar button translated text
                fix_toolbar_button_sizes();
                //map popup contains translated text
                update_map_popup();
                //Update timezone language setting
                update_ui(1);
            } 
            else {
                if (status == 401)
                    user_logoff();
            }   
        })
    }
	return null;
}
/*----------------------- */
/* Global app functions */
/*----------------------- */
async function get_app_globals() {
    var status;
    var json;
    //app parameter variables
    //returns parameters for given app_id and app_id=0
    await fetch(global_rest_url_base + global_rest_app_parameter + global_app_id +
                '?lang_code=' + document.getElementById('setting_select_locale').value, {
                method: 'GET'
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            json = JSON.parse(result);
            for (var i = 0; i < json.data.length; i++) {
                //variables for app_id=0
                if (json.data[i].parameter_name=='APP_REST_CLIENT_ID')
                    global_app_rest_client_id = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='APP_REST_CLIENT_SECRET')
                    global_app_rest_client_secret = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SERVICE_AUTH_TOKEN_URL')
                    global_service_auth_token_url = json.data[i].parameter_value;                            
                if (json.data[i].parameter_name=='COPYRIGHT')
                    global_app_copyright = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER1_ID')
                    global_app_user_provider1_id = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER1_NAME')
                    global_app_user_provider1_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER1_API_SRC')
                    global_app_user_provider1_api_src = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_ID')
                    global_app_user_provider2_id = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_NAME')
                    global_app_user_provider2_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_API_VERSION')
                    global_app_user_provider2_api_version = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_API_SRC')
                    global_app_user_provider2_api_src = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='USER_PROVIDER2_API_SRC2')
                    global_app_user_provider2_api_src2 = json.data[i].parameter_value;
                //REST
                if (json.data[i].parameter_name=='REST_APP')
                    global_rest_app = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP_LOG')
                    global_rest_app_log = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP_OBJECT')
                    global_rest_app_object = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP_TIMETABLES_USER_SETTING')
                    global_rest_app_timetables_user_setting = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP_TIMETABLES_USER_SETTING_USER_ACCOUNT_ID')
                    global_rest_app_timetables_user_setting_user_account_id = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP_TIMETABLES_USER_SETTING_PROFILE')
                    global_rest_app_timetables_user_setting_profile = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP_TIMETABLES_USER_SETTING_LIKE')
                    global_rest_app_timetables_user_setting_like = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_APP_TIMETABLES_USER_SETTING_VIEW')
                    global_rest_app_timetables_user_setting_view = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_COUNTRY')
                    global_rest_country = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_LANGUAGE_LOCALE')
                    global_rest_language_locale = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_MESSAGE_TRANSLATION')
                    global_rest_message_translation = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT')
                    global_rest_user_account = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_COMMON')
                    global_rest_user_account_common = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_USERNAME')
                    global_rest_user_account_profile_username = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_USERID')
                    global_rest_user_account_profile_userid = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_SEARCH')
                    global_rest_user_account_profile_search = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_TOP')
                    global_rest_user_account_profile_top = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_DETAIL')
                    global_rest_user_account_profile_detail = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_ACTIVATE')
                    global_rest_user_account_activate = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_LOGIN')
                    global_rest_user_account_login = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_SIGNUP')
                    global_rest_user_account_signup = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROVIDER')
                    global_rest_user_account_provider = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_LIKE')
                    global_rest_user_account_like = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REST_USER_ACCOUNT_FOLLOW')
                    global_rest_user_account_follow = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SERVICE_GEOLOCATION')
                    global_service_geolocation = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SERVICE_GPS_PLACE')
                    global_service_gps_place = global_service_geolocation + json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SERVICE_GPS_IP')
                    global_service_gps_ip = global_service_geolocation + json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SERVICE_REPORT')
                    global_service_report = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SERVICE_WORLDCITIES')
                    global_service_worldcities = json.data[i].parameter_value;
                //App variables registered for this apps app_id
                if (json.data[i].parameter_name=='EMAIL_POLICY')
                    global_app_email_policy = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='EMAIL_DISCLAIMER')
                    global_app_email_disclaimer = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='EMAIL_TERMS')
                    global_app_email_terms = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SOCIAL_LINK1_URL')
                    global_app_social_link1_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SOCIAL_LINK2_URL')
                    global_app_social_link2_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SOCIAL_LINK3_URL')
                    global_app_social_link3_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SOCIAL_LINK4_URL')
                    global_app_social_link4_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SOCIAL_LINK1_NAME')
                    global_app_social_link1_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SOCIAL_LINK2_NAME')
                    global_app_social_link2_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SOCIAL_LINK3_NAME')
                    global_app_social_link3_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='SOCIAL_LINK4_NAME')
                    global_app_social_link4_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK1_URL')
                    global_info_link1_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK2_URL')
                    global_info_link2_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK3_URL')
                    global_info_link3_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK4_URL')
                    global_info_link4_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK5_URL')
                    global_info_link5_url = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK1_NAME')
                    global_info_link1_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK2_NAME')
                    global_info_link2_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK3_NAME')
                    global_info_link3_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK4_NAME')
                    global_info_link4_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='INFO_LINK5_NAME')
                    global_info_link5_name = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_HEADER_FOOTER_WIDTH')
                    global_file_image_header_footer_width = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_HEADER_FOOTER_HEIGHT')
                    global_file_image_header_footer_height = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_AVATAR_WIDTH')
                    global_file_image_avatar_width = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_AVATAR_HEIGHT')
                    global_file_image_avatar_height = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_ALLOWED_TYPE1')
                    global_file_image_allowed_type1 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_ALLOWED_TYPE2')
                    global_file_image_allowed_type2 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_ALLOWED_TYPE3')
                    global_file_image_allowed_type3 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_MIME_TYPE')
                    global_file_image_mime_type = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='FILE_IMAGE_MAX_SIZE')
                    global_file_image_max_size = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_LANG')
                    global_def_calendar_lang = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_PREFIX')
                    global_def_locale_ext_prefix = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM')
                    global_def_locale_ext_number_system = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR')
                    global_def_locale_ext_calendar = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_TYPE_GREG')
                    global_def_calendar_type_greg = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM')
                    global_def_calendar_number_system = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_DIRECTION')
                    global_default_direction = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_SECOND')
                    global_default_locale_second = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_COLTITLE')
                    global_default_coltitle = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_ARABIC_SCRIPT')
                    global_default_arabic_script = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDARTYPE')
                    global_default_calendartype = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE')
                    global_default_calendar_hijri_type = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAPTYPE')
                    global_default_maptype = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_DEFAULT_COUNTRY')
                    global_default_country = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_DEFAULT_CITY')
                    global_default_city = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_DEFAULT_PLACE_ID')
                    global_default_place_id = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_CONTAINER')
                    global_map_container = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_DEFAULT_ZOOM')
                    global_map_default_zoom = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_DEFAULT_ZOOM_CITY')
                    global_map_default_zoom_city = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_DEFAULT_ZOOM_PP')
                    global_map_default_zoom_pp = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_STYLE_BASEURL')
                    global_map_style_baseurl = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_DEFAULT_STYLE')
                    global_map_default_style = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_MARKER_DIV_PP')
                    global_map_marker_div_pp = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_MARKER_DIV_CITY')
                    global_map_marker_div_city = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_DEFAULT_MAP_MARKER_DIV_GPS')
                    global_map_marker_div_gps = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_MAP_ACCESS_TOKEN')
                    global_app_map_access_token = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_TITLE')
                    global_map_gps_qibbla_title = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_TEXT_SIZE')
                    global_map_gps_qibbla_text_size = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_LAT')
                    global_map_gps_qibbla_lat = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_LONG')
                    global_map_gps_qibbla_long = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_COLOR')
                    global_map_gps_qibbla_color = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_WIDTH')
                    global_map_gps_qibbla_width = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OPACITY')
                    global_map_gps_qibbla_opacity = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_TITLE')
                    global_map_gps_qibbla_old_title = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_TEXT_SIZE')
                    global_map_gps_qibbla_old_text_size = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_LAT')
                    global_map_gps_qibbla_old_lat = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_LONG')
                    global_map_gps_qibbla_old_long = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_COLOR')
                    global_map_gps_qibbla_old_color = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_WIDTH')
                    global_map_gps_qibbla_old_width = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_OPACITY')
                    global_map_gps_qibbla_old_opacity = parseFloat(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_FLYTO')
                    global_map_flyto = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_JUMPTO')
                    global_map_jumpto = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='GPS_MAP_POPUP_OFFSET')
                    global_map_popup_offset = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_THEME_DAY')
                    global_default_theme_day = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_THEME_MONTH')
                    global_default_theme_month = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_THEME_YEAR')
                    global_default_theme_year = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_PAPERSIZE')
                    global_default_papersize = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_HIGHLIGHT_ROW')
                    global_default_highlight_row = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_WEEKDAY')
                    global_default_show_weekday = (json.data[i].parameter_value=== 'true');
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_CALENDARTYPE')
                    global_default_show_calendartype = (json.data[i].parameter_value=== 'true');
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_NOTES')
                    global_default_show_notes = (json.data[i].parameter_value=== 'true');
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_GPS')
                    global_default_show_gps = (json.data[i].parameter_value=== 'true');
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_TIMEZONE')
                    global_default_show_timezone = (json.data[i].parameter_value=== 'true');
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_REPORT_HEADER_SRC'){
                    if (json.data[i].parameter_value!='')
                        global_default_report_header_src = json.data[i].parameter_value;
                }                    
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_REPORT_FOOTER_SRC'){
                    if (json.data[i].parameter_value!='')
                        global_default_report_footer_src = json.data[i].parameter_value;
                }                                    
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_REPORTTITLE1')
                    global_default_reporttitle1 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_REPORTTITLE2')
                    global_default_reporttitle2 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_REPORTTITLE3')
                    global_default_reporttitle3 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_REPORTFOOTER1')
                    global_default_reportfooter1 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_REPORTFOOTER2')
                    global_default_reportfooter2 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='DESIGN_DEFAULT_REPORTFOOTER3')
                    global_default_reportfooter3 = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_METHOD')
                    global_default_method = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_ASR')
                    global_default_asr = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_HIGHLATITUDE')
                    global_default_highlatitude = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_TIMEFORMAT')
                    global_default_timeformat = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_HIJRI_ADJUSTMENT')
                    global_default_hijri_adjustment = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_FAJR')
                    global_default_iqamat_title_fajr = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR')
                    global_default_iqamat_title_dhuhr = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_ASR')
                    global_default_iqamat_title_asr = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB')
                    global_default_iqamat_title_maghrib = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_ISHA')
                    global_default_iqamat_title_isha = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_SHOW_IMSAK')
                    global_default_show_imsak = (json.data[i].parameter_value=== 'true');
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_SHOW_SUNSET')
                    global_default_show_sunset = (json.data[i].parameter_value=== 'true');
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_SHOW_MIDNIGHT')
                    global_default_show_midnight = (json.data[i].parameter_value=== 'true');
                if (json.data[i].parameter_name=='PRAYER_DEFAULT_SHOW_FAST_START_END')
                    global_default_show_fast_start_end = parseInt(json.data[i].parameter_value);
                //startup setting
                if (json.data[i].parameter_name=='STARTUP_DEFAULT_STARTUP_PAGE')
                    global_default_startup_page = parseInt(json.data[i].parameter_value);
                //QR
                if (json.data[i].parameter_name=='QR_LOGO_FILE_PATH')
                    global_qr_logo_file_path = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='QR_WIDTH')
                    global_qr_width = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='QR_HEIGHT')
                    global_qr_height = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='QR_COLOR_DARK')
                    global_qr_color_dark = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='QR_COLOR_LIGHT')
                    global_qr_color_light = json.data[i].parameter_value;
                if (json.data[i].parameter_name=='QR_LOGO_WIDTH')
                    global_qr_logo_width = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='QR_LOGO_HEIGHT')
                    global_qr_logo_height = parseInt(json.data[i].parameter_value);
                if (json.data[i].parameter_name=='QR_BACKGROUND_COLOR')
                    global_qr_background_color = json.data[i].parameter_value;
            }
        } else {
            alert(responseText_get_error('get_app_globals parameter', result));
        }
    })
}

function show_error(code){
    fetch(global_rest_url_base + global_rest_message_translation + code + 
        '?app_id=' + global_app_id +
        '&lang_code=' + document.getElementById('setting_select_locale').value, 
    {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + global_rest_at
        }
    })
    .then(function(response) {
        return response.text();
    })
    .then(function(response) {
        alert(JSON.parse(response).data.text);
    }).catch(function(error) {
        alert(responseText_get_error('show_error', error));
    })
}

function set_app_globals_head() {
    //call this function from index.html i head before body is loaded
    //set meta tags in header
    document.querySelector('meta[name="google-signin-client_id"]').setAttribute("content", global_app_user_provider1_id);
    document.title = global_app_name;
    document.querySelector('meta[name="apple-mobile-web-app-title"]').setAttribute("content", global_app_name)
}

function set_app_globals_body() {
    //call this function from init() when body is loaded
    document.getElementById('app_name').innerHTML = global_app_name;
    document.getElementById('login_app_name').innerHTML = global_app_name;
    document.getElementById('signup_app_name').innerHTML = global_app_name;
}
/*----------------------------- */
/* General javascript functions */
/*----------------------------- */
//function to convert buffert to one string
function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return atob(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}
//function to check image if to read buffer or not
function image_format(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    if (arr == null || arr == '')
        return '';
    else {
        //Oracle returns buffer for BLOB
        if (arr.data) {
            //buffer
            return toBase64(arr.data);
        } else {
            //not buffer
            return atob(arr);
        }
    }
}

function select_empty(select) {
    //empty select				
    for (i = select.options.length - 1; i >= 0; i--) {
        select.options[i] = null;
    }
    return null;
}

function select_get_selectindex(select, id) {
    if (id == 0)
        return 0;
    else {
        var select = document.getElementById(select);
        for (i = 0; i < select.options.length; i++) {
            if (select.options[i].getAttribute('id') == id)
                return i;
        }
    }
    return null;
}

function select_get_id(select, selectindex) {
    if (selectindex == 0)
        return 'null';
    else {
        var select = document.getElementById(select);
        return select[selectindex].getAttribute('id');
    }
    return null;
}

function SearchAndSetSelectedIndex(search, select_item, colcheck) {
    //colcheck=0 search id
    //colcheck=1 search value
    for (var i = 0; i < select_item.options.length; i++) {
        if ((colcheck==0 && select_item.options[i].id == search) ||
            (colcheck==1 && select_item.options[i].value == search)) {
            select_item.selectedIndex = i;
            return null;
        }
    }
    return null;
}

function checkbox_value(checkbox) {
    if (checkbox.checked)
        return 'YES';
    else
        return 'NO';
}

function recreate_img(img_item) {
    //cant set img src to null, it will containt url or show corrupt image
    //recreating the img is the workaround
    var parentnode = img_item.parentNode;
    var id = img_item.id;
    var alt = img_item.alt;
    var img = document.createElement('img');

    parentnode.removeChild(img_item);
    img.id = id;
    img.alt = alt;
    parentnode.appendChild(img);
    return null;
}
function show_image(item_show, item_load) {
    var file = document.getElementById(item_load).files[0];
    var reader = new FileReader();

    const allowedExtensions = [global_file_image_allowed_type1,
                               global_file_image_allowed_type2,
                               global_file_image_allowed_type3
                              ];
    const { name: fileName, size: fileSize } = file;
    const fileExtension = fileName.split(".").pop();
    if (!allowedExtensions.includes(fileExtension)){
        //File type not allowed
        show_error(20307);
    }
    else
        if (fileSize > global_file_image_max_size){
            //File size too large
            show_error(20308);
        }
        else {
            reader.onloadend = function(event) {
                var img = new Image();
                img.src = event.target.result;
                img.onload = function(el) {
                    var elem = document.createElement('canvas');
                    if (item_show.id=='setting_avatar_logged_in'){
                        elem.width = global_file_image_avatar_width;
                        elem.height = global_file_image_avatar_height;
                    }
                    else{
                        elem.width = global_file_image_header_footer_width;
                        elem.height = global_file_image_header_footer_height;
                    }
                    var ctx = elem.getContext('2d');
                    ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
                    var srcEncoded = ctx.canvas.toDataURL(global_file_image_mime_type);
                    item_show.src = srcEncoded;
                }
            }
        }
    if (file)
        reader.readAsDataURL(file); //reads the data as a URL
    else
        item_show.src = '';
    return null;
}

function boolean_to_number(boolean_value) {
    if (boolean_value == true)
        return 1;
    else
        return 0;
}

function number_to_boolean(number_value) {
    if (number_value == 1)
        return true;
    else
        return false;
}

function get_null_or_value(value) {
    if (value == null)
        return '';
    else
        return value;
}
function set_null_or_value(value) {
    if (value == null || value == '')
        return 'null';
    else
        return value;
}

function fileisloaded(image_item_src) {
    //if (image_item_src.substr(0,4)=='data')
    if (image_item_src == '')
        return false;
    else
        return true;
}

function convertnumberlocale(numberstring, splitcharacter, locale) {
    var left = Number((numberstring).substr(0, (numberstring).indexOf(splitcharacter))).toLocaleString(locale);
    var right;
    var suffix;
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
/* check if run inside an iframe*/
function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
function isToday(checkdate){
    let today = new Date();
    return (checkdate.getMonth() == today.getMonth()) && 
            (checkdate.getDate() == today.getDate()) && 
            (checkdate.getFullYear() == today.getFullYear());
}
/*--------------------- */
/*Map and GPS functions */
/*--------------------- */

async function get_place_from_gps(latitude, longitude) {
    var error_message;
    var status;
    await fetch(global_service_gps_place + 
                '?app_id= ' + global_app_id +
                '&app_user_id=' + document.getElementById('setting_data_userid_logged_in').innerHTML +
                '&latitude=' + latitude +
                '&longitude=' + longitude +
                '&lang_code=' + document.getElementById('setting_select_locale').value, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + global_rest_dt,
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            let json = JSON.parse(result);
            //use setting_select_country to get country name using returned countrycode
            //if necessary
            document.getElementById('setting_input_place').value = json.geoplugin_place + ', ' +
                json.geoplugin_region + ', ' +
                json.geoplugin_countryCode;
        } else {
            if (status == 401)
                user_logoff();
            else
                alert(responseText_get_error('get_place_from_gps', result));
        }
    })
}

async function get_gps_from_ip() {

    var error_message;
    var status;
    await fetch(global_service_gps_ip + 
                '?app_id=' + global_app_id + 
                '&app_user_id=' + document.getElementById('setting_data_userid_logged_in').innerHTML +
                '&lang_code=' + document.getElementById('setting_select_locale').value, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + global_rest_dt,
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            let json = JSON.parse(result);
            global_user_gps_latitude = json.geoplugin_latitude;
            global_user_gps_longitude = json.geoplugin_longitude;
            global_user_gps_place = json.geoplugin_city + ', ' +
                json.geoplugin_regionName + ', ' +
                json.geoplugin_countryName;
            document.getElementById('setting_select_popular_place').selectedIndex = 0;
            document.getElementById('setting_input_lat').value = json.geoplugin_latitude;
            document.getElementById('setting_input_long').value = json.geoplugin_longitude;

        } else {
            if (status == 401)
                user_logoff();
        }
    })
}

function create_map_popup_text(place, subtitle, timezone) {
    return '<div id="settings_gps_map_popup_title">' +
        place +
        '</div>' +
        '<div id="settings_gps_map_popup_sub_title">' +
        subtitle +
        '</div>' +
        '<div id="settings_gps_map_popup_sub_title_timezone">' +
        timezone +
        '</div>';
}

function update_map_popup() {
    var popup_title_div = document.getElementById('settings_gps_map_popup_title');
    var popup_sub_title_div = document.getElementById('settings_gps_map_popup_sub_title');
    var city_current = document.getElementById('setting_select_city');
    var popular_place_current = document.getElementById('setting_select_popular_place');
    var place = document.getElementById('setting_input_place');
    var timezone = document.getElementById('setting_label_report_timezone');

    //check if popup exists
    if (popup_title_div) {
        //check what popup title to update
        if (city_current.selectedIndex != 0) {
            //city name
            popup_title_div.innerHTML = city_current.options[city_current.selectedIndex].text;
        } else {
            //Popular place name or custom title
            //popup_title_div.innerHTML = popular_place_current.options[popular_place_current.selectedIndex].text;
            //Always show from place
            popup_title_div.innerHTML = place.value;
        }
        //Timezone text:
        popup_sub_title_div.innerHTML = timezone.innerHTML;
    }
    return null;
}

function init_map() {

    mapboxgl.accessToken = global_app_map_access_token;
    global_map_mymap = new mapboxgl.Map({
        container: global_map_container,
        style: global_map_style_baseurl + global_map_default_style,
        center: [document.getElementById('setting_input_long').value,
            document.getElementById('setting_input_lat').value
        ],
        zoom: global_map_default_zoom
    });

    global_map_mymap.addControl(new mapboxgl.NavigationControl());

    global_map_mymap.on('dblclick', function(e) {
        e.preventDefault()
        document.getElementById('setting_input_lat').value = e.lngLat['lat'];
        document.getElementById('setting_input_long').value = e.lngLat['lng'];
        //Update GPS position
        update_ui(9);

    });
}

function fixmap() {
    //not rendering correct at startup
    global_map_mymap.resize();
    return null;
}

function map_show_qibbla() {
    //	
    if (global_map_mymap.getSource('qibbla')) {
        var mySource = global_map_mymap.getSource('qibbla');
        global_map_mymap.getSource('qibbla').setData({
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [global_map_gps_qibbla_long, global_map_gps_qibbla_lat],
                        [document.getElementById('setting_input_long').value,
                            document.getElementById('setting_input_lat').value
                        ]
                    ]
                }
            }]
        });
        //qibbla old
        var mySource = global_map_mymap.getSource('qibbla_old');
        global_map_mymap.getSource('qibbla_old').setData({
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [global_map_gps_qibbla_old_long, global_map_gps_qibbla_old_lat],
                        [document.getElementById('setting_input_long').value,
                            document.getElementById('setting_input_lat').value
                        ]
                    ]
                }
            }]
        });

    } else {
        global_map_mymap.on('load', function() {

            global_map_mymap.addSource('qibbla', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': { "title": global_map_gps_qibbla_title },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [global_map_gps_qibbla_long, global_map_gps_qibbla_lat],
                            [document.getElementById('setting_input_long').value,
                                document.getElementById('setting_input_lat').value
                            ]
                        ]
                    }
                }
            });
            global_map_mymap.addLayer({
                'id': 'qibblaid',
                'type': 'line',
                'source': 'qibbla',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': global_map_gps_qibbla_color,
                    'line-width': global_map_gps_qibbla_width,
                    'line-opacity': global_map_gps_qibbla_opacity
                }
            });

            global_map_mymap.addLayer({
                "id": "qibbla_symbol",
                "type": "symbol",
                "source": "qibbla",
                "layout": {
                    "symbol-placement": "line",
                    "text-field": global_map_gps_qibbla_title,
                    "text-size": global_map_gps_qibbla_text_size
                }
            });

            //qibbla old
            global_map_mymap.addSource('qibbla_old', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': { "title": global_map_gps_qibbla_old_title },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [global_map_gps_qibbla_old_long, global_map_gps_qibbla_old_lat],
                            [document.getElementById('setting_input_long').value,
                                document.getElementById('setting_input_lat').value
                            ]
                        ]
                    }
                }
            });
            global_map_mymap.addLayer({
                'id': 'qibbla_old_id',
                'type': 'line',
                'source': 'qibbla_old',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': global_map_gps_qibbla_old_color,
                    'line-width': global_map_gps_qibbla_old_width,
                    'line-opacity': global_map_gps_qibbla_old_opacity
                }
            });
            global_map_mymap.addLayer({
                "id": "qibbla_old_symbol",
                "type": "symbol",
                "source": "qibbla_old",
                "layout": {
                    "symbol-placement": "line",
                    "text-field": global_map_gps_qibbla_old_title,
                    "text-size": global_map_gps_qibbla_old_text_size
                }
            });

        });
    }
    return null;
}

function update_map(longitude, latitude, zoom, text1, text2, text3, marker_id, flyto) {

    if (flyto == 1) {
        global_map_mymap.flyTo({
            'center': [longitude, latitude],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    } else {
        if (zoom == '')
            global_map_mymap.jumpTo({ 'center': [longitude, latitude] });
        else
            global_map_mymap.jumpTo({ 'center': [longitude, latitude], 'zoom': zoom });
    }
    var popuptext = create_map_popup_text(text1,
        text2,
        text3);
    var popup = new mapboxgl.Popup({ offset: global_map_popup_offset, closeOnClick: false })
        .setLngLat([longitude, latitude])
        .setHTML(popuptext)
        .addTo(global_map_mymap);
    var el = document.createElement('div');
    el.id = marker_id;
    new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(global_map_mymap);
    map_show_qibbla();
    return null;
}

/*----------------- */
/* Themes functions */
/*----------------- */
function app_select_theme() {
    document.body.className = 'app_theme' + document.getElementById('app_select_theme').value;
    return null;
}

function get_theme_id(type) {
    var select_user_setting = document.getElementById('setting_select_user_setting');
    if (document.getElementsByClassName('slider_active_' + type)[0])
        return document.getElementsByClassName('slider_active_' + type)[0].getAttribute('data-theme_id');
    else
        return select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_' + type + '_id');

}

function set_theme_id(type, theme_id) {
    var slides = document.getElementById('setting_themes_' + type + '_slider').children[0].children[0]
    for (var i = 0; i < slides.childElementCount; i++) {
        if (slides.children[i].children[0].getAttribute('data-theme_id') == theme_id) {
            //remove active class from current theme
            document.getElementsByClassName('slider_active_' + type)[0].classList.remove('slider_active_' + type);
            //set active class on found theme
            document.getElementById(slides.children[i].children[0].id).classList.add('slider_active_' + type);
            //update preview image to correct theme
            document.getElementById('slides_' + type).style.left = (-96 * (i)).toString() + 'px';
            set_theme_title(type);
            return null;
        }
    }
    return null;
}

function set_theme_title(type) {
    document.getElementById('slider_theme_' + type + '_id').innerHTML =
        document.getElementById('theme_' + type + '_' + get_theme_id(type)).getAttribute('data-theme_id');
    return null;
}

function load_themes() {
    slide(document.getElementById('setting_themes_day_slider'),
        document.getElementById('slides_day'),
        document.getElementById('slider_prev_day'),
        document.getElementById('slider_next_day'),
        'day');
    slide(document.getElementById('setting_themes_month_slider'),
        document.getElementById('slides_month'),
        document.getElementById('slider_prev_month'),
        document.getElementById('slider_next_month'),
        'month');
    slide(document.getElementById('setting_themes_year_slider'),
        document.getElementById('slides_year'),
        document.getElementById('slider_prev_year'),
        document.getElementById('slider_next_year'),
        'year');
    return null;
}

function slide(wrapper, items, prev, next, type) {
    var posInitial,
        slides = items.getElementsByClassName('slide_' + type),
        slidesLength = slides.length,
        index_day = 0,
        index_month = 0,
        index_year = 0;
    slideSize = 96;
    document.getElementById(items.children[eval('index_' + type)].children[0].id).classList.add('slider_active_' + type);
    set_theme_title(type);
    wrapper.classList.add('loaded');

    // Click events
    prev.addEventListener('click', function() { shiftSlide(-1) });
    next.addEventListener('click', function() { shiftSlide(1) });

    function shiftSlide(dir, action) {
        var slideSize = items.getElementsByClassName('slide_' + type)[0].offsetWidth;
        var index;
        //read position and divide with image size and remove "px" characters
        //better solution would be search items and get index where active class is found
        index = Math.abs(items.style.left.substr(0, items.style.left.length - 2) / slideSize);
        if (!action) { posInitial = items.offsetLeft; }

        if (dir == 1) {
            if ((index + 1) == slidesLength) {
                items.style.left = "0px";
                index = 0;
            } else {
                items.style.left = (posInitial - slideSize) + "px";
                index++;
            }
        } else if (dir == -1) {
            if (index == 0) {
                items.style.left = -((slidesLength - 1) * slideSize) + "px";
                index = slidesLength - 1;
            } else {
                items.style.left = (posInitial + slideSize) + "px";
                index--;
            }
        }
        document.getElementsByClassName('slider_active_' + type)[0].classList.remove('slider_active_' + type);
        document.getElementById(items.children[index].children[0].id).classList.add('slider_active_' + type);
        set_theme_title(type);
    }
}

/*----------------------- */
/* QR functions */
/*----------------------- */

function create_qr(div, url) {
    var qrcode = new QRCode(document.getElementById(div), {
        text: url,
        width: global_qr_width,
        height: global_qr_height,
        colorDark: global_qr_color_dark,
        colorLight: global_qr_color_light,
        logo: global_qr_logo_file_path,
        logoWidth: global_qr_logo_width,
        logoHeight: global_qr_logo_height,
        logoBackgroundColor: global_qr_background_color,
        logoBackgroundTransparent: false
    });
}

/*----------------------- */
/* User setting functions */
/*----------------------- */
async function get_token() {
    var status;
    //get token access
    await fetch(global_service_auth_token_url + 
                '?app_id=' + global_app_id + 
                '&app_user_id=' + document.getElementById('setting_data_userid_logged_in').innerHTML +
                '&lang_code=' + document.getElementById('setting_select_locale').value, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(global_app_rest_client_id + ':' + global_app_rest_client_secret)
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            let json = JSON.parse(result);
            //access token
            global_rest_at = json.token_at;
            //data token
            global_rest_dt = json.token_dt;
        } else {
            alert(responseText_get_error('get_token', result));
        }    
    })
}

function showcurrenttime() {
    var settings = {
        timezone_current: document.getElementById('setting_select_timezone_current').value,
        locale: document.getElementById('setting_select_locale').value,
        timedisplay_item: document.getElementById('setting_label_current_date_time_display')
    }
    var options = {
        timeZone: settings.timezone_current,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    settings.timedisplay_item.innerHTML = new Date().toLocaleTimeString(settings.locale, options);
    return null;
}

function showreporttime() {

    var settings = {
        timezone_report: document.getElementById('setting_select_report_timezone').value,
        locale: document.getElementById('setting_select_locale').value,
        timedisplay_item: document.getElementById('setting_label_report_date_time_display')
    }
    var options = {
        timeZone: settings.timezone_report,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    settings.timedisplay_item.innerHTML = new Date().toLocaleTimeString(settings.locale, options);
    //If day report created with time, display time there also
    if (document.getElementById('prayertable_day_time')) {
        document.getElementById('prayertable_day_time').innerHTML = settings.timedisplay_item.innerHTML;
    }
    //if day report created with div class prayertable_day_current_time
    if (document.getElementsByClassName('prayertable_day_current_time').length > 0) {
        var user_current_time = document.getElementsByClassName('prayertable_day_current_time');
        var select_user_settings = document.getElementById('setting_select_user_setting');
        var select_timezone_report = document.getElementById('setting_select_report_timezone');
        var select_locale = document.getElementById('setting_select_locale');
        var user_locale;
        var user_options;
        //loop user settings
        for (i = 0; i <= select_user_settings.options.length - 1; i++) {
            user_options = {
                timeZone: select_timezone_report[select_user_settings[i].getAttribute('regional_timezone_select_id')].value,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'long'
            };

            user_locale = select_user_settings[i].getAttribute('regional_language_locale');
            //set user setting time, select index and order should be the same as div prayertable_day_current_time indexes
            user_current_time[i].innerHTML = new Date().toLocaleTimeString(user_locale, user_options);
        }
    }
    return null;
}

function fix_toolbar_button_sizes() {
    //if any label has more than 10 characters decrease size for all
    document.getElementById('toolbar_btn_print_label').classList = 'toolbar_button';
    document.getElementById('toolbar_btn_day_label').classList = 'toolbar_button';
    document.getElementById('toolbar_btn_month_label').classList = 'toolbar_button';
    document.getElementById('toolbar_btn_year_label').classList = 'toolbar_button';
    document.getElementById('toolbar_btn_settings_label').classList = 'toolbar_button';

    if (document.getElementById('toolbar_btn_print_label').innerHTML.length > 9 ||
        document.getElementById('toolbar_btn_day_label').innerHTML.length > 9 ||
        document.getElementById('toolbar_btn_month_label').innerHTML.length > 9 ||
        document.getElementById('toolbar_btn_year_label').innerHTML.length > 9 ||
        document.getElementById('toolbar_btn_settings_label').innerHTML.length > 9) {
        document.getElementById('toolbar_btn_print_label').classList.add('toolbar_smallsize');
        document.getElementById('toolbar_btn_day_label').classList.add('toolbar_smallsize');
        document.getElementById('toolbar_btn_month_label').classList.add('toolbar_smallsize');
        document.getElementById('toolbar_btn_year_label').classList.add('toolbar_smallsize');
        document.getElementById('toolbar_btn_settings_label').classList.add('toolbar_smallsize');
    }
    //if all labels are shorter than 5 characters
    if (document.getElementById('toolbar_btn_print_label').innerHTML.length < 5 &&
        document.getElementById('toolbar_btn_day_label').innerHTML.length < 5 &&
        document.getElementById('toolbar_btn_month_label').innerHTML.length < 5 &&
        document.getElementById('toolbar_btn_year_label').innerHTML.length < 5 &&
        document.getElementById('toolbar_btn_settings_label').innerHTML.length < 5) {
        document.getElementById('toolbar_btn_print_label').classList.add('toolbar_bigsize');
        document.getElementById('toolbar_btn_day_label').classList.add('toolbar_bigsize');
        document.getElementById('toolbar_btn_month_label').classList.add('toolbar_bigsize');
        document.getElementById('toolbar_btn_year_label').classList.add('toolbar_bigsize');
        document.getElementById('toolbar_btn_settings_label').classList.add('toolbar_bigsize');
    }
    //if non of above then show default font size
    if (!(document.getElementById('toolbar_btn_print_label').innerHTML.length > 9 ||
            document.getElementById('toolbar_btn_day_label').innerHTML.length > 9 ||
            document.getElementById('toolbar_btn_month_label').innerHTML.length > 9 ||
            document.getElementById('toolbar_btn_year_label').innerHTML.length > 9 ||
            document.getElementById('toolbar_btn_settings_label').innerHTML.length > 9) &&
        !(document.getElementById('toolbar_btn_print_label').innerHTML.length < 5 &&
            document.getElementById('toolbar_btn_day_label').innerHTML.length < 5 &&
            document.getElementById('toolbar_btn_month_label').innerHTML.length < 5 &&
            document.getElementById('toolbar_btn_year_label').innerHTML.length < 5 &&
            document.getElementById('toolbar_btn_settings_label').innerHTML.length < 5)) {

        document.getElementById('toolbar_btn_print_label').classList.add('toolbar_defaultsize');
        document.getElementById('toolbar_btn_day_label').classList.add('toolbar_defaultsize');
        document.getElementById('toolbar_btn_month_label').classList.add('toolbar_defaultsize');
        document.getElementById('toolbar_btn_year_label').classList.add('toolbar_defaultsize');
        document.getElementById('toolbar_btn_settings_label').classList.add('toolbar_defaultsize');
    }
}

function iframe_resize(){
    var paper_size_select = document.getElementById('setting_select_report_papersize');
    document.getElementById('window_preview_content').className = paper_size_select.options[paper_size_select.selectedIndex].value;
}

function keyfunctions() {
    var input_username_login = document.getElementById("login_username");
    input_username_login.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            user_login();
            //unfocus
            document.getElementById("login_username").blur();
        }
    });
    var input_password_login = document.getElementById("login_password");
    input_password_login.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            user_login();
            //unfocus
            document.getElementById("login_password").blur();
        }
    });
    //onClick
    document.getElementById('toolbar_btn_zoomout').addEventListener('click', function() { zoom_paper(-1) }, false);
	document.getElementById('toolbar_btn_zoomin').addEventListener('click', function() { zoom_paper(1) }, false);
	document.getElementById('toolbar_btn_left').addEventListener('click', function() { update_timetable_report(0, 'toolbar_navigation_btn_left') }, false);
	document.getElementById('toolbar_btn_right').addEventListener('click', function() { update_timetable_report(0, 'toolbar_navigation_btn_right') }, false);
	document.getElementById('toolbar_btn_about').addEventListener('click', function() { show_dialogue('INFO') }, false);

    document.getElementById('tab_1_nav_btn_regional').addEventListener('click', function() { openTab('tab1') }, false);
    document.getElementById('tab_2_nav_btn_gps').addEventListener('click', function() { openTab('tab2') }, false);
    document.getElementById('tab_3_nav_btn_btn_design').addEventListener('click', function() { openTab('tab3') }, false);
    document.getElementById('tab_4_nav_btn_btn_image').addEventListener('click', function() { openTab('tab4') }, false);
    document.getElementById('tab_5_nav_btn_btn_text').addEventListener('click', function() { openTab('tab5') }, false);
    document.getElementById('tab_6_nav_btn_btn_prayer').addEventListener('click', function() { openTab('tab6') }, false);
    document.getElementById('tab_7_nav_btn_btn_user').addEventListener('click', function() { openTab('tab7') }, false);
    
    document.getElementById('setting_btn_reportheader_img').addEventListener('click', function() { document.getElementById('setting_input_reportheader_img').click() }, false);
    document.getElementById('setting_input_reportheader_clear').addEventListener('click', function() { update_ui(12) }, false);
    
    document.getElementById('setting_btn_reportfooter_img').addEventListener('click', function() { document.getElementById('setting_input_reportfooter_img').click() }, false);
    document.getElementById('setting_input_reportfooter_clear').addEventListener('click', function() { update_ui(14) }, false);
    
    document.getElementById('setting_input_reporttitle_aleft').addEventListener('click', function() { update_ui(15, this.id) }, false);
    document.getElementById('setting_input_reporttitle_acenter').addEventListener('click', function() { update_ui(15, this.id) }, false);
    document.getElementById('setting_input_reporttitle_aright').addEventListener('click', function() { update_ui(15, this.id) }, false);
    document.getElementById('setting_input_reportfooter_aleft').addEventListener('click', function() { update_ui(16, this.id) }, false);
    document.getElementById('setting_input_reportfooter_acenter').addEventListener('click', function() { update_ui(16, this.id) }, false);
    document.getElementById('setting_input_reportfooter_aright').addEventListener('click', function() { update_ui(16, this.id) }, false);

    document.getElementById('setting_btn_avatar_img').addEventListener('click', function() { document.getElementById('setting_input_avatar_img').click() }, false);
    document.getElementById('setting_btn_user_edit').addEventListener('click', function() { user_edit() }, false);

    document.getElementById('setting_btn_user_update').addEventListener('click', function() { user_update() }, false);
    document.getElementById('setting_btn_user_delete_account').addEventListener('click', function() { user_delete(); }, false);
     
    document.getElementById('setting_btn_user_save').addEventListener('click', function() { user_settings_save() }, false);
    document.getElementById('setting_btn_user_add').addEventListener('click', function() { user_settings_add() }, false);
    document.getElementById('setting_btn_user_delete').addEventListener('click', function() { user_settings_delete() }, false);
     
    document.getElementById('profile_main_btn_following').addEventListener('click', function() { profile_detail(1) }, false);
    document.getElementById('profile_main_btn_followed').addEventListener('click', function() { profile_detail(2) }, false);
    document.getElementById('profile_main_btn_likes').addEventListener('click', function() { profile_detail(3) }, false);
    document.getElementById('profile_main_btn_liked').addEventListener('click', function() { profile_detail(4) }, false);
    document.getElementById('profile_main_btn_user_setting_likes').addEventListener('click', function() { profile_detail(5) }, false);
    document.getElementById('profile_main_btn_user_setting_liked').addEventListener('click', function() { profile_detail(6) }, false);

    document.getElementById('profile_follow').addEventListener('click', function() { user_function('FOLLOW') }, false);
    document.getElementById('profile_like').addEventListener('click', function() { user_function('LIKE') }, false);

    document.getElementById('profile_top_row1_1').addEventListener('click', function() { profile_top(1) }, false);
    document.getElementById('profile_top_row1_2').addEventListener('click', function() { profile_top(2) }, false);
    document.getElementById('profile_top_row1_3').addEventListener('click', function() { profile_top(3) }, false);
    document.getElementById('profile_top_row2_1').addEventListener('click', function() { profile_top(4) }, false);
    document.getElementById('profile_top_row2_2').addEventListener('click', function() { profile_top(5) }, false);

    document.getElementById('info_close').addEventListener('click', function() { document.getElementById('dialogue_info').style.visibility = 'hidden' }, false);
    
    document.getElementById('scan_open_mobile_close').addEventListener('click', function() { document.getElementById('dialogue_scan_open_mobile').style.visibility = 'hidden' }, false);
    document.getElementById('login_signup').addEventListener('click', function() { show_dialogue('SIGNUP') }, false);
    document.getElementById('login_button').addEventListener('click', function() { user_login() }, false);
    document.getElementById('login_facebook').addEventListener('click', function() { onProviderSignIn() }, false);
    document.getElementById('login_close').addEventListener('click', function() { document.getElementById('dialogue_login').style.visibility = 'hidden' }, false);
    document.getElementById('signup_login').addEventListener('click', function() { show_dialogue('LOGIN') }, false);

    document.getElementById('signup_button').addEventListener('click', function() { user_signup() }, false);
    document.getElementById('signup_close').addEventListener('click', function() { document.getElementById('dialogue_signup').style.visibility = 'hidden' }, false);
    
    document.getElementById('confirm_close').addEventListener('click', function() { user_delete(1) }, false);
    document.getElementById('confirm_cancel').addEventListener('click', function() { user_delete(0) }, false);
    document.getElementById('window_preview_close').addEventListener('click', function() { document.getElementById('window_preview_content').onload='';document.getElementById('window_preview_content').src='';document.getElementById('window_preview_toolbar_qr').innerHTML='';document.getElementById('window_preview_report').style.visibility = 'hidden' }, false);
       
    document.getElementById('toolbar_btn_print').addEventListener('click', function() { toolbar_bottom(1) }, false);
    document.getElementById('toolbar_btn_day').addEventListener('click', function() { toolbar_bottom(2) }, false);
    document.getElementById('toolbar_btn_month').addEventListener('click', function() { toolbar_bottom(3) }, false);
    document.getElementById('toolbar_btn_year').addEventListener('click', function() { toolbar_bottom(4) }, false);
    
    document.getElementById('popup_menu_login').addEventListener('click', function() { show_dialogue('LOGIN') }, false);
    document.getElementById('popup_menu_signup').addEventListener('click', function() { show_dialogue('SIGNUP') }, false);
    document.getElementById('popup_menu_logoff').addEventListener('click', function() { user_logoff() }, false);
    document.getElementById('popup_menu_profile').addEventListener('click', function() { toolbar_bottom(6) }, false);
    document.getElementById('popup_menu_profile_top').addEventListener('click', function() { toolbar_bottom(7) }, false);
    document.getElementById('popup_menu_settings').addEventListener('click', function() { toolbar_bottom(5) }, false);
    
    //onchange
    document.getElementById('setting_select_locale').addEventListener('change', function() { settings_translate(true) }, false);
    document.getElementById('setting_select_timezone_current').addEventListener('change', function() { update_ui(1) }, false);
    document.getElementById('setting_select_report_timezone').addEventListener('change', function() { update_ui(2); }, false);
    document.getElementById('setting_select_report_locale_second').addEventListener('change', function() { settings_translate(false) }, false);
    document.getElementById('setting_select_report_arabic_script').addEventListener('change', function() { update_ui(3);}, false);
    
    document.getElementById('setting_select_maptype').addEventListener('change', function() { update_ui(4); }, false);
    document.getElementById('setting_select_country').addEventListener('change', function() { update_ui(5); }, false);         
    document.getElementById('setting_select_city').addEventListener('change', function() { update_ui(6);}, false);
    document.getElementById('setting_select_popular_place').addEventListener('change', function() { update_ui(7);}, false);
    document.getElementById('setting_select_report_papersize').addEventListener('change', function() { update_ui(10); }, false);
    
    document.getElementById('setting_input_reportheader_img').addEventListener('change', function() { update_ui(11, this.id) }, false);
    document.getElementById('setting_input_reportfooter_img').addEventListener('change', function() { update_ui(13, this.id) }, false);
                     
    document.getElementById('setting_select_method').addEventListener('change', function() { update_ui(17);}, false);
                       
    document.getElementById('setting_input_avatar_img').addEventListener('change', function() { show_image(document.getElementById('setting_avatar_logged_in'), this.id); }, false);
    document.getElementById('setting_select_user_setting').addEventListener('change', function() {user_settings_load().then(function(){settings_translate(true).then(function(){settings_translate(false);})}) }, false);
    document.getElementById('app_select_theme').addEventListener('change', function() { app_select_theme() }, false);
          
    //on-keyup
    document.getElementById('setting_input_place').addEventListener('keyup', function() { typewatch("update_ui(8);", 1000); }, false);
    document.getElementById('setting_input_lat').addEventListener('keyup', function() { typewatch("update_ui(9);", 1000); }, false);
    document.getElementById('setting_input_long').addEventListener('keyup', function() { typewatch("update_ui(9);", 1000); }, false);
                                   
    document.getElementById('profile_search_input').addEventListener('keyup', function() { typewatch("search_profile();", 500); }, false);
    
    document.getElementById('user_verify_verification_char1').addEventListener('keyup', function() { user_verify_check_input(this, "user_verify_verification_char2") }, false);
    document.getElementById('user_verify_verification_char2').addEventListener('keyup', function() { user_verify_check_input(this, "user_verify_verification_char3") }, false);
    document.getElementById('user_verify_verification_char3').addEventListener('keyup', function() { user_verify_check_input(this, "user_verify_verification_char4") }, false);
    document.getElementById('user_verify_verification_char4').addEventListener('keyup', function() { user_verify_check_input(this, "user_verify_verification_char5") }, false);
    document.getElementById('user_verify_verification_char5').addEventListener('keyup', function() { user_verify_check_input(this, "user_verify_verification_char6") }, false);
    document.getElementById('user_verify_verification_char6').addEventListener('keyup', function() { user_verify_check_input(this, "") }, false);

    if(document.getElementById('window_preview_content').addEventListener)
        document.getElementById('window_preview_content').addEventListener('load',function() { iframe_resize(); }, false);
    else if(document.getElementById('window_preview_content').attachEvent)
        document.getElementById('window_preview_content').attachEvent('onload',function() { iframe_resize(); });
};

function toolbar_bottom(choice) {
    var paper = document.getElementById('paper');
    var prayertable_day = document.getElementById('prayertable_day');
    var prayertable_month = document.getElementById('prayertable_month');
    var prayertable_year = document.getElementById('prayertable_year');
    var settings = document.getElementById('settings');
    var profile = document.getElementById('profile');
    var profile_info_div = document.getElementById('profile_info');
    var profile_top_div = document.getElementById('profile_top');

    switch (choice) {
        //print
        case 1:
            {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    paper.style.display = "block";
                settings.style.visibility = 'hidden';
                printTable();
                break;
            }
            //day
        case 2:
            {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    paper.style.display = "block";
                prayertable_day.style.visibility = 'visible';
                prayertable_month.style.visibility = 'hidden';
                prayertable_year.style.visibility = 'hidden';
                settings.style.visibility = 'hidden';
                profile.style.visibility = 'hidden';
                //profile_top_div.style.visibility = 'hidden';
                update_timetable_report(2);
                break;
            }
            //month
        case 3:
            {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    paper.style.display = "block";
                prayertable_day.style.visibility = 'hidden';
                prayertable_month.style.visibility = 'visible';
                prayertable_year.style.visibility = 'hidden';
                settings.style.visibility = 'hidden';
                profile.style.visibility = 'hidden';
                //profile_top_div.style.visibility = 'hidden';
                update_timetable_report(0);
                break;
            }
            //year
        case 4:
            {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    paper.style.display = "block";
                prayertable_day.style.visibility = 'hidden';
                prayertable_month.style.visibility = 'hidden';
                prayertable_year.style.visibility = 'visible';
                settings.style.visibility = 'hidden';
                profile.style.visibility = 'hidden';
                //profile_top_div.style.visibility = 'hidden';
                update_timetable_report(1);
                break;
            }
            //settings
        case 5:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    paper.style.display = "none";
                settings.style.visibility = 'visible';
                profile.style.visibility = 'hidden';
                //profile_top_div.style.visibility = 'hidden';
                break;
            }
            //profile
        case 6:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    paper.style.display = "none";
                settings.style.visibility = 'hidden';
                document.getElementById('profile_detail').classList = '';
                document.getElementById('profile_info').classList = '';
                if (document.getElementById('setting_data_username_logged_in').innerHTML == '') {
                    document.getElementById('profile_detail').classList.add("profile_detail_logged_off");
                    document.getElementById('profile_info').classList.add("profile_info_logged_off");
                }
                profile.style.visibility = 'visible';
                profile_info_div.style.display = 'block';
                profile_top_div.style.display = 'none';
                profile_show();
                break;
            }
            //profile top
        case 7:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    paper.style.display = "none";
                settings.style.visibility = 'hidden';
                document.getElementById('profile_detail').classList = '';
                document.getElementById('profile_info').classList = '';
                profile.style.visibility = 'visible';
                //profile_top_div.style.visibility = 'visible';
                profile_info_div.style.display = 'none';
                profile_top_div.style.display = 'block';
                profile_top(1);
                break;
            }
    }
}


function openTab(tab_selected) {
    var i;
    for (i = 1; i < 8; i++) {
        //hide all tab content
        document.getElementById("tab" + i).style.display = "none";
        //remove mark for all tabs
        document.getElementById("tab" + i + "_nav").className = document.getElementById("tab" + i + "_nav").className.replace("tab_nav_selected", "");
    }
    //show active tab content
    document.getElementById(tab_selected).style.display = "block";
    //mark active tab
    document.getElementById(tab_selected + "_nav").classList.add("tab_nav_selected");
}


function align_button_value(report_align_where) {

    if (document.getElementById('setting_input_' + report_align_where + '_aleft').classList.contains('setting_button_active'))
        return 'left';
    if (document.getElementById('setting_input_' + report_align_where + '_acenter').classList.contains('setting_button_active'))
        return 'center';
    if (document.getElementById('setting_input_' + report_align_where + '_aright').classList.contains('setting_button_active'))
        return 'right';
    return '';
}

function responseText_get_error(calling_function, responseText) {
    //calling_function for future use to log internally
    try {
        // dont show code or errno returned from json
        if (typeof JSON.parse(responseText).message !== "undefined")
        // message from Node controller.js and service.js files
            return JSON.parse(responseText).message;
        else
        //message from Mysql, code + sqlMessage
        if (typeof JSON.parse(responseText).sqlMessage !== "undefined")
            return JSON.parse(responseText).sqlMessage;
        //message from Oracle, errorNum, offset
        if (typeof JSON.parse(responseText).errorNum !== "undefined")
            return JSON.parse(responseText).errorNum;
        return responseText;
    } catch (e) {
        //other error and json not returned, return the whole text
        return responseText;
    }
}

function format_json_date(db_date, short) {
    if (db_date == null)
        return null;
    else {
        //Json returns UTC time
        //in ISO 8601 format
        //JSON returns format 2020-08-08T05:15:28Z
        //"yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"

        /*
        var dateTimeRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
        var reviver = function(key, value) {
          if (typeof value === 'string' && dateTimeRegExp.test(value)) {
            return new Date(value);
          } else {
            return value;
          }
        };
        var todo = JSON.parse('{"name":"Get milk","due":"2016-01-01T05:00:00.123Z"}', reviver);
        */
        var settings = {
            timezone_current: document.getElementById('setting_select_timezone_current').value,
            locale: document.getElementById('setting_select_locale').value
        }
        if (short)
            var options = {
                timeZone: settings.timezone_current,
                year: 'numeric',
                month: 'long'
            };
        else
            var options = {
                timeZone: settings.timezone_current,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'long'
            };
        var utc_date = new Date(Date.UTC(
            db_date.substr(0, 4), //year
            db_date.substr(5, 2) - 1, //month
            db_date.substr(8, 2), //day
            db_date.substr(11, 2), //hour
            db_date.substr(14, 2), //min
            db_date.substr(17, 2) //sec
        ));

        var format_date = utc_date.toLocaleDateString(settings.locale, options);

        return format_date;
    }
}

function spinner(button, visibility) {
    var button_spinner = '<div id="button_spinner" class="load-spinner">' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                            '<div></div>' +
                         '</div>';
    var button_default_icon_login = '<i class="fas fa-arrow-alt-circle-right"></i>';
    var button_default_icon_signup = '<i class="fas fa-arrow-alt-circle-right"></i>';
    var button_default_icon_save = '<i class="fas fa-save"></i>';
    var button_default_icon_add = '<i class="fas fa-plus-square"></i>';
    var button_default_icon_delete = '<i class="fas fa-trash-alt"></i>';

    var button_update_text = document.getElementById('setting_btn_label_user_update').outerHTML;
    var button_delete_account_text = document.getElementById('setting_btn_label_user_delete_account').outerHTML;
    var button_save_text = document.getElementById('setting_btn_label_user_save').outerHTML;
    var button_add_text = document.getElementById('setting_btn_label_user_add').outerHTML;
    var button_delete_text = document.getElementById('setting_btn_label_user_delete').outerHTML;

    switch (button) {
        case 'LOGIN':
            {
                if (visibility == 'visible')
                    document.getElementById('login_button').innerHTML = button_spinner;
                else
                    document.getElementById('login_button').innerHTML = button_default_icon_login;
                break;
            }
        case 'SIGNUP':
            {
                if (visibility == 'visible')
                    document.getElementById('signup_button').innerHTML = button_spinner;
                else
                    document.getElementById('signup_button').innerHTML = button_default_icon_signup;
                break;
            }
        case 'SAVE':
            {
                if (visibility == 'visible')
                    document.getElementById('setting_btn_user_save').innerHTML = button_spinner + button_save_text;
                else
                    document.getElementById('setting_btn_user_save').innerHTML = button_default_icon_save + button_save_text;
                break;
            }
        case 'ADD':
            {
                if (visibility == 'visible')
                    document.getElementById('setting_btn_user_add').innerHTML = button_spinner + button_add_text;
                else
                    document.getElementById('setting_btn_user_add').innerHTML = button_default_icon_add + button_add_text;
                break;
            }
        case 'DELETE':
            {
                if (visibility == 'visible')
                    document.getElementById('setting_btn_user_delete').innerHTML = button_spinner + button_delete_text;
                else
                    document.getElementById('setting_btn_user_delete').innerHTML = button_default_icon_delete + button_delete_text;
                break;
            }
        case 'UPDATE':
            {
                if (visibility == 'visible')
                    document.getElementById('setting_btn_user_update').innerHTML = button_spinner + button_update_text;
                else
                    document.getElementById('setting_btn_user_update').innerHTML = button_default_icon_save + button_update_text;
                break;
            }
        case 'DELETE_ACCOUNT':
            {
                if (visibility == 'visible')
                    document.getElementById('setting_btn_user_delete_account').innerHTML = button_spinner + button_delete_account_text;
                else
                    document.getElementById('setting_btn_user_delete_account').innerHTML = button_default_icon_delete + button_delete_account_text;
                break;
            }
        default:
            {
                null;
            }
    }
    return null;
}
function dialogue_loading(visible){
    if (visible==1){
        document.getElementById('dialogue_loading').style.visibility='visible';
        document.getElementById('dialogue_spinner').style.visibility='visible';
    }
    else{
        document.getElementById('dialogue_loading').style.visibility='hidden';
        document.getElementById('dialogue_spinner').style.visibility='hidden';
    }
}
/*
zoom paper, call att start without zoomvalue so papersize can be set
and then with zoom value when zooming from toolbar top
*/
function zoom_paper(zoomvalue = '') {
    var old;
    var old_scale;
    //even if css set, this property is not set at startup
    //if (document.getElementById('paper').style.transform==''){
    if (zoomvalue == '') {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
            document.getElementById('paper').style.transform = 'scale(0.5)';
        else
            document.getElementById('paper').style.transform = 'scale(0.7)';
    } else {
        old = document.getElementById('paper').style.transform;
        old_scale = parseFloat(old.substr(old.indexOf("(") + 1, old.indexOf(")") - 1));
        if (zoomvalue == 1) {
            //zoom in, increase value
            //USE transform scale(), NOT zoom who messes up layout
            document.getElementById('paper').style.transform = 'scale(' + (old_scale + (1 / 10)) + ')';
        } else {
            //zoom out, decrease value
            document.getElementById('paper').style.transform = 'scale(' + (old_scale - (1 / 10)) + ')';
        }
    }
    return null;
}

function user_verify_check_input(item, nextField) {

    var status;
    var user_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    var json;
    var json_data;
    //only accept 0-9
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(document.getElementById(item.id).value) > -1)
        if (nextField == '' || (document.getElementById('user_verify_verification_char1').value != '' &
                document.getElementById('user_verify_verification_char2').value != '' &
                document.getElementById('user_verify_verification_char3').value != '' &
                document.getElementById('user_verify_verification_char4').value != '' &
                document.getElementById('user_verify_verification_char5').value != '' &
                document.getElementById('user_verify_verification_char6').value != '')) {
            //last field, validate entered code
            var validation_code = parseInt(document.getElementById('user_verify_verification_char1').value +
                document.getElementById('user_verify_verification_char2').value +
                document.getElementById('user_verify_verification_char3').value +
                document.getElementById('user_verify_verification_char4').value +
                document.getElementById('user_verify_verification_char5').value +
                document.getElementById('user_verify_verification_char6').value);
            spinner('SIGNUP', 'visible');
            document.getElementById('user_verify_verification_char1').classList.remove('input_error');
            document.getElementById('user_verify_verification_char2').classList.remove('input_error');
            document.getElementById('user_verify_verification_char3').classList.remove('input_error');
            document.getElementById('user_verify_verification_char4').classList.remove('input_error');
            document.getElementById('user_verify_verification_char5').classList.remove('input_error');
            document.getElementById('user_verify_verification_char6').classList.remove('input_error');

            //activate user
            json_data = '{"validation_code":"' + validation_code + '"}';
            fetch(global_rest_url_base + global_rest_user_account_activate + user_id +
                    '?lang_code=' + document.getElementById('setting_select_locale').value, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + global_rest_at
                    },
                    body: json_data
                })
                .then(function(response) {
                    status = response.status;
                    return response.text();
                })
                .then(function(response) {
                    if (status == 200) {
                        json = JSON.parse(response);
                        spinner('SIGNUP', 'hidden');
                        if (json.items[0].affectedRows == 1) {
                            //if not logged in, means here user is signing up
                            //check username instead of userid in setting_data_userid_logged_in
                            if (document.getElementById('setting_data_username_logged_in').innerHTML == '') {
                                //login with username and password from signup fields
                                document.getElementById('dialogue_login').style.visibility = "hidden";
                                document.getElementById('login_username').value =
                                    document.getElementById('signup_username').value;
                                document.getElementById('login_password').value =
                                    document.getElementById('signup_password').value;

                                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                                document.getElementById('signup_username').value = '';
                                document.getElementById('signup_email').value = '';
                                document.getElementById('signup_password').value = '';
                                document.getElementById('signup_password_confirm').value = '';
                                document.getElementById('signup_password_reminder').value = '';
                                user_login();
                            }
                            document.getElementById('dialogue_user_verify').style.visibility = 'hidden';
                            document.getElementById('user_verify_verification_char1').value = '';
                            document.getElementById('user_verify_verification_char2').value = '';
                            document.getElementById('user_verify_verification_char3').value = '';
                            document.getElementById('user_verify_verification_char4').value = '';
                            document.getElementById('user_verify_verification_char5').value = '';
                            document.getElementById('user_verify_verification_char6').value = '';
                        } else {
                            document.getElementById('user_verify_verification_char1').classList.add('input_error');
                            document.getElementById('user_verify_verification_char2').classList.add('input_error');
                            document.getElementById('user_verify_verification_char3').classList.add('input_error');
                            document.getElementById('user_verify_verification_char4').classList.add('input_error');
                            document.getElementById('user_verify_verification_char5').classList.add('input_error');
                            document.getElementById('user_verify_verification_char6').classList.add('input_error');
                            //code not valid
                            show_error(20306);
                        }
                    } else {
                        spinner('SIGNUP', 'hidden');
                        if (status == 401)
                            user_logoff();
                        else
                            alert(responseText_get_error('user_verify_check_input', response));
                    }
                })
                .catch(function(error) {
                    spinner('SIGNUP', 'hidden');
                    alert(responseText_get_error('user_verify_check_input', error));
                });
        } else
        //not last, next!
            document.getElementById(nextField).focus();
    else
    //remove anything else than 0-9
        document.getElementById(item.id).value = '';
    return null;
}

function user_edit() {
    var json;
    if (document.getElementById('user_edit').style.display == 'block') {
        document.getElementById('user_edit').style.display = "none";
        document.getElementById('setting_checkbox_report_private').checked = false;
        //common
        document.getElementById('setting_input_bio_edit').value = '';
        //local
        document.getElementById('setting_input_username_edit').value = '';
        document.getElementById('setting_input_email_edit').value = '';
        document.getElementById('setting_input_password_edit').value = '';
        document.getElementById('setting_input_password_confirm_edit').value = '';
        document.getElementById('setting_input_new_password_edit').value = '';
        document.getElementById('setting_input_new_password_confirm_edit').value = '';
        document.getElementById('setting_input_password_reminder_edit').value = '';
        document.getElementById('setting_avatar_edit').style.display = "none";
        //provider
        document.getElementById('setting_user_edit_provider_logo').innerHTML = '';
        document.getElementById('setting_label_provider_id_edit_data').innerHTML = '';
        document.getElementById('setting_label_provider_name_edit_data').innerHTML = '';
        document.getElementById('setting_label_provider_email_edit_data').innerHTML = '';
        document.getElementById('setting_label_provider_image_url_edit_data').innerHTML = '';

        //account info
        document.getElementById('setting_label_data_last_logontime_edit').value = '';
        document.getElementById('setting_label_data_account_created_edit').value = '';
        document.getElementById('setting_label_data_account_modified_edit').value = '';

        document.getElementById('user_settings').style.display = "block";
    } else {
        var user_id = document.getElementById('setting_data_userid_logged_in');
        var status;
        //get user from REST API
        spinner('EDIT', 'visible');
        fetch(global_rest_url_base + global_rest_user_account + user_id.innerHTML +
                '?lang_code=' + document.getElementById('setting_select_locale').value, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_at
                }
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(response) {
                if (status == 200) {
                    json = JSON.parse(response);
                    spinner('EDIT', 'hidden');
                    if (user_id.innerHTML == json.id) {
                        document.getElementById('user_edit_local').style.display = 'none';
                        document.getElementById('user_edit_provider').style.display = 'none';
                        document.getElementById('user_edit').style.display = "block";

                        document.getElementById('user_settings').style.display = "none";

                        document.getElementById('setting_checkbox_report_private').checked = number_to_boolean(json.private);
                        document.getElementById('setting_input_bio_edit').value = get_null_or_value(json.bio);

                        if (json.provider1_id == null && json.provider2_id == null) {
                            document.getElementById('user_edit_local').style.display = 'block';
                            document.getElementById('user_edit_provider').style.display = 'none';
                            document.getElementById('setting_avatar_edit').style.display = "block";

                            if (json.avatar == null || json.avatar == '')
                                recreate_img(document.getElementById('setting_avatar_logged_in'));
                            else
                                document.getElementById('setting_avatar_logged_in').src = image_format(json.avatar);
                            update_settings_icon(image_format(json.avatar));


                            document.getElementById('setting_input_username_edit').value = json.username;

                            document.getElementById('setting_input_email_edit').value = json.email;

                            document.getElementById('setting_input_password_edit').value = '',
                                document.getElementById('setting_input_password_confirm_edit').value = '',
                                document.getElementById('setting_input_new_password_edit').value = '';
                            document.getElementById('setting_input_new_password_confirm_edit').value = '';

                            document.getElementById('setting_input_password_reminder_edit').value = json.password_reminder;
                        } else
                        if (json.provider1_id !== null) {
                            document.getElementById('user_edit_provider').style.display = 'block';
                            document.getElementById('setting_user_edit_provider_logo').innerHTML = '<i class="fab fa-google"></i>';
                            document.getElementById('user_edit_local').style.display = 'none';
                            document.getElementById('setting_label_provider_id_edit_data').innerHTML = json.provider1_id;
                            document.getElementById('setting_label_provider_name_edit_data').innerHTML = json.provider1_first_name + ' ' + json.provider1_last_name;
                            document.getElementById('setting_label_provider_email_edit_data').innerHTML = json.provider1_email;
                            document.getElementById('setting_label_provider_image_url_edit_data').innerHTML = json.provider1_image_url;
                        } else
                        if (json.provider2_id !== null) {
                            document.getElementById('user_edit_provider').style.display = 'block';
                            document.getElementById('setting_user_edit_provider_logo').innerHTML = '<i class="fab fa-facebook"></i>';
                            document.getElementById('user_edit_local').style.display = 'none';
                            document.getElementById('setting_label_provider_id_edit_data').innerHTML = json.provider2_id;
                            document.getElementById('setting_label_provider_name_edit_data').innerHTML = json.provider2_first_name + ' ' + json.provider2_last_name;
                            document.getElementById('setting_label_provider_email_edit_data').innerHTML = json.provider2_email;
                            document.getElementById('setting_label_provider_image_url_edit_data').innerHTML = json.provider2_image_url;
                        }
                        document.getElementById('setting_label_data_last_logontime_edit').innerHTML = format_json_date(json.last_logontime);
                        document.getElementById('setting_label_data_account_created_edit').innerHTML = format_json_date(json.date_created);
                        document.getElementById('setting_label_data_account_modified_edit').innerHTML = format_json_date(json.date_modified);
                    } else {
                        //User not found
                        show_error(20305);
                    }
                } else {
                    spinner('EDIT', 'hidden');
                    if (status == 401)
                        user_logoff();
                    else
                        alert(responseText_get_error('user_edit', response));
                }
            })
            .catch(function(error) {
                spinner('EDIT', 'hidden');
                alert(responseText_get_error('user_login', error));
            });
    }
    return null;
}

function user_update() {
    var avatar = btoa(document.getElementById('setting_avatar_logged_in').src);
    var username = document.getElementById('setting_input_username_edit').value;
    var bio = document.getElementById('setting_input_bio_edit').value;
    var email = document.getElementById('setting_input_email_edit').value;
    var password = document.getElementById('setting_input_password_edit').value;
    var password_confirm = document.getElementById('setting_input_password_confirm_edit').value;
    var new_password = document.getElementById('setting_input_new_password_edit').value;
    var new_password_confirm = document.getElementById('setting_input_new_password_confirm_edit').value;
    var password_reminder = document.getElementById('setting_input_password_reminder_edit').value;
    var user_id = document.getElementById('setting_data_userid_logged_in');
    var url;
    var json;
    var json_data;
    var status;

    if (document.getElementById('user_edit_local').style.display == 'block') {
        json_data = '{' + 
            '"app_id":' + global_app_id + ',' +
            '"bio":"' + bio + '",' +
            '"private":' + boolean_to_number(document.getElementById('setting_checkbox_report_private').checked) + ',' +
            '"username":"' + username + '",' +
            '"password":"' + password + '",' +
            '"new_password":"' + new_password + '",' +
            '"password_reminder":"' + password_reminder + '",' +
            '"email":"' + email + '",' +
            '"avatar":"' + avatar + '"' +
            '}';
        url = global_rest_url_base + global_rest_user_account + user_id.innerHTML;
        document.getElementById('setting_input_username_edit').classList.remove('input_error');

        document.getElementById('setting_input_bio_edit').classList.remove('input_error');
        document.getElementById('setting_input_email_edit').classList.remove('input_error');

        document.getElementById('setting_input_password_edit').classList.remove('input_error');
        document.getElementById('setting_input_password_confirm_edit').classList.remove('input_error');
        document.getElementById('setting_input_new_password_edit').classList.remove('input_error');
        document.getElementById('setting_input_new_password_confirm_edit').classList.remove('input_error');

        document.getElementById('setting_input_password_reminder_edit').classList.remove('input_error');

        //validate input
        if (username == '') {
            //"Please enter username"
            document.getElementById('setting_input_username_edit').classList.add('input_error');
            show_error(20303);
            return null;
        }
        if (password == '') {
            //"Please enter password"
            document.getElementById('setting_input_password_edit').classList.add('input_error');
            show_error(20304);
            return null;
        }
        if (password != password_confirm) {
            //Password not the same
            document.getElementById('setting_input_password_confirm_edit').classList.add('input_error');
            show_error(20301);
            return null;
        }
        //check new passwords
        if (new_password != new_password_confirm) {
            //New Password are entered but they are not the same
            document.getElementById('setting_input_new_password_edit').classList.add('input_error');
            document.getElementById('setting_input_new_password_confirm_edit').classList.add('input_error');
            show_error(20301);
            return null;
        }
    } else {
        json_data = '{"bio":"' + bio + '",' +
            '"private":' + boolean_to_number(document.getElementById('setting_checkbox_report_private').checked) +
            '}';
        url = global_rest_url_base + global_rest_user_account_common + user_id.innerHTML
    }
    spinner('UPDATE', 'visible');
    //update user using REST API
    fetch(url + '?lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                json = JSON.parse(response);
                //user_id.innerHTML = json.id;
                document.getElementById('user_edit').style.display = "none";
                document.getElementById('user_settings').style.display = "block";

                document.getElementById('setting_avatar_edit').style.display = 'none';

                update_settings_icon(atob(avatar));
                //update_settings_icon(imaage_format(json.avatar));

                document.getElementById('setting_data_username_logged_in').innerHTML = username;
                document.getElementById('setting_bio_logged_in').innerHTML = bio;

                document.getElementById('setting_checkbox_report_private').checked = false;
                document.getElementById('setting_input_username_edit').value = '';
                document.getElementById('setting_input_bio_edit').value = '';
                document.getElementById('setting_input_email_edit').value = '';
                document.getElementById('setting_input_password_edit').value = '';
                document.getElementById('setting_input_password_confirm_edit').value = '';
                document.getElementById('setting_input_new_password_edit').value = '';
                document.getElementById('setting_input_new_password_confirm_edit').value = '';
                document.getElementById('setting_input_password_reminder_edit').value = '';
                //provider
                document.getElementById('setting_user_edit_provider_logo').innerHTML = '';
                document.getElementById('setting_label_provider_id_edit_data').innerHTML = '';
                document.getElementById('setting_label_provider_name_edit_data').innerHTML = '';
                document.getElementById('setting_label_provider_email_edit_data').innerHTML = '';
                document.getElementById('setting_label_provider_image_url_edit_data').innerHTML = '';

                document.getElementById('setting_label_data_last_logontime_edit').innerHTML = '';
                document.getElementById('setting_label_data_account_created_edit').innerHTML = '';
                document.getElementById('setting_label_data_account_modified_edit').innerHTML = '';
                spinner('UPDATE', 'hidden');
            } else {
                spinner('UPDATE', 'hidden');
                if (status == 401)
                    user_logoff();
                else
                    alert(responseText_get_error('user_update', response));
            }
        })
        .catch(function(error) {
            spinner('UPDATE', 'hidden');
            alert(responseText_get_error('user_update', error));
        });
    return null;
}

function user_delete(choice=null) {
    var user_account_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    var password = document.getElementById('setting_input_password_edit').value;
    
    var status;
    switch (choice){
        case null:{
            if (password == '') {
                //"Please enter password"
                document.getElementById('setting_input_password_edit').classList.add('input_error');
                show_error(20304);
                return null;
            }
            show_dialogue('CONFIRM_DELETE');
            break;
        }
        case 0:{
            document.getElementById("dialogue_confirm_delete").style.visibility = "hidden";
            break;
        }
        case 1:{
            document.getElementById("dialogue_confirm_delete").style.visibility = "hidden";
            document.getElementById('setting_input_username_edit').classList.remove('input_error');
            document.getElementById('setting_input_bio_edit').classList.remove('input_error');
            document.getElementById('setting_input_email_edit').classList.remove('input_error');
            document.getElementById('setting_input_password_edit').classList.remove('input_error');
            document.getElementById('setting_input_password_confirm_edit').classList.remove('input_error');
            document.getElementById('setting_input_new_password_edit').classList.remove('input_error');
            document.getElementById('setting_input_new_password_confirm_edit').classList.remove('input_error');
            document.getElementById('setting_input_password_reminder_edit').classList.remove('input_error');
    
            spinner('DELETE_ACCOUNT', 'visible');
            let json_data = `{"password":"${password}"}`;
            fetch(global_rest_url_base + global_rest_user_account + user_account_id + 
                    '?app_id=' + global_app_id +
                    '&lang_code=' + document.getElementById('setting_select_locale').value, 
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + global_rest_at
                    },
                    body: json_data
                })
                .then(function(response) {
                    status = response.status;
                    return response.text();
                })
                .then(function(response) {
                    spinner('DELETE_ACCOUNT', 'hidden');
                    if (status == 200)
                        user_logoff();
                    else {
                        if (status == 401)
                            user_logoff();
                        else
                            alert(responseText_get_error('user_delete', response));
                    }
                })
                .catch(function(error) {
                    spinner('DELETE_ACCOUNT', 'hidden');
                    alert(responseText_get_error('user_delete', error));
                });
            break;
        }
        default:
            break;
    }
    return null;
}

function user_login() {
    var username;
    var password;
    var json;
    var json_data;
    var status;

    username = document.getElementById('login_username');
    password = document.getElementById('login_password');

    var user_id = document.getElementById('setting_data_userid_logged_in');

    json_data = '{' +
        '"app_id": ' + global_app_id + ',' +
        '"username":"' + username.value + '",' +
        '"password":"' + password.value + '",' +
        '"active":1,' +
        '"client_longitude":"' + global_user_gps_longitude + '",' +
        '"client_latitude":"' + global_user_gps_latitude + '"}';
    if (username.value == '') {
        //"Please enter username"
        show_error(20303);
        return null;
    }
    if (password.value == '') {
        //"Please enter password"
        show_error(20304);
        return null;
    }
    spinner('LOGIN', 'visible');
    get_token().then(function(){
        //get user with username and password from REST API
        fetch(global_rest_url_base + global_rest_user_account_login + 
                '?lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(json) {
            if (status == 200) {
                json = JSON.parse(json);
                var result_id = json.items[0].id;
                var result_username = json.items[0].username;
                var result_password = password.value;
                var result_avatar = json.items[0].avatar;
                var result_bio = get_null_or_value(json.items[0].bio);
                user_id.innerHTML = result_id;

                document.getElementById('user_logged_in').style.display = "block";

                //set avatar or empty
                if (result_avatar == null || result_avatar == '') {
                    recreate_img(document.getElementById('setting_avatar_logged_in'));
                    result_avatar = '';
                } else
                    document.getElementById('setting_avatar_logged_in').src = image_format(result_avatar);
                update_settings_icon(image_format(result_avatar));

                document.getElementById('setting_bio_logged_in').innerHTML = result_bio;
                document.getElementById('setting_data_username_logged_in').innerHTML = result_username;

                document.getElementById(username.id).value = '';
                document.getElementById(password.id).value = '';
                document.getElementById('popup_menu_login').style.display = 'none';
                document.getElementById('popup_menu_signup').style.display = 'none';
                document.getElementById('popup_menu_logoff').style.display = 'block';
                document.getElementById('dialogue_login').style.visibility = 'hidden';
                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                //Show user tab
                document.getElementById('tab7_nav').style.display = 'block';
                //Hide settings
                document.getElementById('settings').style.visibility = 'hidden';
                //Hide profile
                document.getElementById('profile').style.visibility = 'hidden';
                spinner('LOGIN', 'hidden');
                user_settings_get(user_id.innerHTML).then(function(){
                    user_settings_load().then(function(){
                        settings_translate(true).then(function(){
                            settings_translate(false).then(function(){
                                //show default startup
                                toolbar_bottom(global_default_startup_page);
                            })
                        })
                    })
                });
            } else {
                spinner('LOGIN', 'hidden');
                if (status == 401)
                    user_logoff();
                else
                    alert(responseText_get_error('user_login', json));
            }
        })
        .catch(function(error) {
            spinner('LOGIN', 'hidden');
            alert(responseText_get_error('user_login', error));
        });
    })
    
}

async function user_setting_get(user_setting_id) {
    var select = document.getElementById("setting_select_user_setting");
    var json;
    var status;

    await fetch(global_rest_url_base + global_rest_app_timetables_user_setting + user_setting_id +
                '?app_id=' + global_app_id + 
                '&lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + global_rest_at
            }
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                json = JSON.parse(response);
                select_empty(select);
                //fill select with this one record
                let option_html='';
                option_html += `<option value=${0} id=${json.id} 
                                    description='${json.description}' 
                                    regional_language_locale=${json.regional_language_locale}
                                    regional_current_timezone_select_id=${json.regional_current_timezone_select_id}
                                    regional_timezone_select_id=${json.regional_timezone_select_id}
                                    regional_number_system_select_id=${json.regional_number_system_select_id}
                                    regional_layout_direction_select_id=${json.regional_layout_direction_select_id}
                                    regional_second_language_locale=${json.regional_second_language_locale}
                                    regional_column_title_select_id=${json.regional_column_title_select_id}
                                    regional_arabic_script_select_id=${json.regional_arabic_script_select_id}
                                    regional_calendar_type_select_id=${json.regional_calendar_type_select_id}
                                    regional_calendar_hijri_type_select_id=${json.regional_calendar_hijri_type_select_id}
                                    gps_map_type_select_id=${json.gps_map_type_select_id}
                                    ${json.gps_country_id==null?'gps_country_id=""':'gps_country_id=' + json.gps_country_id}
                                    ${json.gps_city_id==null?'gps_city_id=""':'gps_city_id=' + json.gps_city_id}
                                    ${json.gps_popular_place_id==null?'gps_popular_place_id=""':'gps_popular_place_id=' + json.gps_popular_place_id}
                                    gps_lat_text=${json.gps_lat_text}
                                    gps_long_text=${json.gps_long_text}
                                    design_theme_day_id=${json.design_theme_day_id}
                                    design_theme_month_id=${json.design_theme_month_id}
                                    design_theme_year_id=${json.design_theme_year_id}
                                    design_paper_size_select_id=${json.design_paper_size_select_id}
                                    design_row_highlight_select_id=${json.design_row_highlight_select_id}
                                    design_column_weekday_checked=${json.design_column_weekday_checked}
                                    design_column_calendartype_checked=${json.design_column_calendartype_checked}
                                    design_column_notes_checked=${json.design_column_notes_checked}
                                    design_column_gps_checked=${json.design_column_gps_checked}
                                    design_column_timezone_checked=${json.design_column_timezone_checked}
                                    image_header_image_img='${image_format(json.image_header_image_img)}'
                                    image_footer_image_img='${image_format(json.image_footer_image_img)}'
                                    text_header_1_text='${json.text_header_1_text==null?'':json.text_header_1_text}'
                                    text_header_2_text='${json.text_header_2_text==null?'':json.text_header_2_text}'
                                    text_header_3_text='${json.text_header_3_text==null?'':json.text_header_3_text}'
                                    text_header_align='${json.text_header_align==null?'':json.text_header_align}'
                                    text_footer_1_text='${json.text_footer_1_text==null?'':json.text_footer_1_text}'
                                    text_footer_2_text='${json.text_footer_2_text==null?'':json.text_footer_2_text}'
                                    text_footer_3_text='${json.text_footer_3_text==null?'':json.text_footer_3_text}'
                                    text_footer_align='${json.text_footer_align==null?'':json.text_footer_align}'
                                    prayer_method_select_id=${json.prayer_method_select_id}
                                    prayer_asr_method_select_id=${json.prayer_asr_method_select_id}
                                    prayer_high_latitude_adjustment_select_id=${json.prayer_high_latitude_adjustment_select_id}
                                    prayer_time_format_select_id=${json.prayer_time_format_select_id}
                                    prayer_hijri_date_adjustment_select_id=${json.prayer_hijri_date_adjustment_select_id}
                                    prayer_fajr_iqamat_select_id=${json.prayer_fajr_iqamat_select_id}
                                    prayer_dhuhr_iqamat_select_id=${json.prayer_dhuhr_iqamat_select_id}
                                    prayer_asr_iqamat_select_id=${json.prayer_asr_iqamat_select_id}
                                    prayer_maghrib_iqamat_select_id=${json.prayer_maghrib_iqamat_select_id}
                                    prayer_isha_iqamat_select_id=${json.prayer_isha_iqamat_select_id}
                                    prayer_column_imsak_checked=${json.prayer_column_imsak_checked}
                                    prayer_column_sunset_checked=${json.prayer_column_sunset_checked}
                                    prayer_column_midnight_checked=${json.prayer_column_midnight_checked}
                                    prayer_column_fast_start_end_select_id=${json.prayer_column_fast_start_end_select_id}
                                    user_account_id=${json.user_account_id}
                                    >${json.description}
                                </option>`
                select.innerHTML += option_html;
                //add only option from user settings because of performance for report only 
                //for locale and second locale, locales are not loaded, only load the used ones
                document.getElementById('setting_select_locale').innerHTML += 
                `<option value=${json.regional_language_locale}>${json.regional_language_locale}</option`;
                if (json.regional_second_language_locale !='0'){
                    document.getElementById('setting_select_report_locale_second').innerHTML += 
                    `<option value=${json.regional_second_language_locale}>${json.regional_second_language_locale}</option`;
                }
            } else {
                if (status == 401)
                    user_logoff();
                else
                    alert(responseText_get_error('user_setting_get', response));
            }
        })
        .catch(function(error) {
            alert(responseText_get_error('user_setting_get', error));
        });
}

async function user_settings_get(userid, show_ui = 1, user_setting_id = '') {
    var select = document.getElementById("setting_select_user_setting");
    var json;
    var i;
    var status;
    
    await fetch(global_rest_url_base + global_rest_app_timetables_user_setting_user_account_id + userid +
                '?app_id=' + global_app_id + 
                '&lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + global_rest_at
            }
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                json = JSON.parse(response);
                select_empty(select);
                //fill select
                let option_html = '';
                for (i = 0; i < json.count; i++) {
                    option_html += `<option value=${i} id=${json.items[i].id} description='${json.items[i].description}'
                                        regional_language_locale=${json.items[i].regional_language_locale}
                                        regional_current_timezone_select_id=${json.items[i].regional_current_timezone_select_id}
                                        regional_timezone_select_id=${json.items[i].regional_timezone_select_id}
                                        regional_number_system_select_id=${json.items[i].regional_number_system_select_id}
                                        regional_layout_direction_select_id=${json.items[i].regional_layout_direction_select_id}
                                        regional_second_language_locale=${json.items[i].regional_second_language_locale}
                                        regional_column_title_select_id=${json.items[i].regional_column_title_select_id}
                                        regional_arabic_script_select_id=${json.items[i].regional_arabic_script_select_id}
                                        regional_calendar_type_select_id=${json.items[i].regional_calendar_type_select_id}
                                        regional_calendar_hijri_type_select_id=${json.items[i].regional_calendar_hijri_type_select_id}
                                        gps_map_type_select_id=${json.items[i].gps_map_type_select_id}
                                        ${json.items[i].gps_country_id==null?'gps_country_id=""':'gps_country_id=' + json.items[i].gps_country_id}
                                        ${json.items[i].gps_city_id==null?'gps_city_id=""':'gps_city_id=' + json.items[i].gps_city_id}
                                        ${json.items[i].gps_popular_place_id==null?'gps_popular_place_id=""':'gps_popular_place_id=' + json.items[i].gps_popular_place_id}
                                        gps_lat_text=${json.items[i].gps_lat_text}
                                        gps_long_text=${json.items[i].gps_long_text}
                                        design_theme_day_id=${json.items[i].design_theme_day_id}
                                        design_theme_month_id=${json.items[i].design_theme_month_id}
                                        design_theme_year_id=${json.items[i].design_theme_year_id}
                                        design_paper_size_select_id=${json.items[i].design_paper_size_select_id}
                                        design_row_highlight_select_id=${json.items[i].design_row_highlight_select_id}
                                        design_column_weekday_checked=${json.items[i].design_column_weekday_checked}
                                        design_column_calendartype_checked=${json.items[i].design_column_calendartype_checked}
                                        design_column_notes_checked=${json.items[i].design_column_notes_checked}
                                        design_column_gps_checked=${json.items[i].design_column_gps_checked}
                                        design_column_timezone_checked=${json.items[i].design_column_timezone_checked}
                                        image_header_image_img='${image_format(json.items[i].image_header_image_img)}'
                                        image_footer_image_img='${image_format(json.items[i].image_footer_image_img)}'
                                        text_header_1_text='${json.items[i].text_header_1_text==null?'':json.items[i].text_header_1_text}'
                                        text_header_2_text='${json.items[i].text_header_2_text==null?'':json.items[i].text_header_2_text}'
                                        text_header_3_text='${json.items[i].text_header_3_text==null?'':json.items[i].text_header_3_text}'
                                        text_header_align='${json.items[i].text_header_align==null?'':json.items[i].text_header_align}'
                                        text_footer_1_text='${json.items[i].text_footer_1_text==null?'':json.items[i].text_footer_1_text}'
                                        text_footer_2_text='${json.items[i].text_footer_2_text==null?'':json.items[i].text_footer_2_text}'
                                        text_footer_3_text='${json.items[i].text_footer_3_text==null?'':json.items[i].text_footer_3_text}'
                                        text_footer_align='${json.items[i].text_footer_align==null?'':json.items[i].text_footer_align}'    
                                        prayer_method_select_id=${json.items[i].prayer_method_select_id}
                                        prayer_asr_method_select_id=${json.items[i].prayer_asr_method_select_id}
                                        prayer_high_latitude_adjustment_select_id=${json.items[i].prayer_high_latitude_adjustment_select_id}
                                        prayer_time_format_select_id=${json.items[i].prayer_time_format_select_id}
                                        prayer_hijri_date_adjustment_select_id=${json.items[i].prayer_hijri_date_adjustment_select_id}
                                        prayer_fajr_iqamat_select_id=${json.items[i].prayer_fajr_iqamat_select_id}
                                        prayer_dhuhr_iqamat_select_id=${json.items[i].prayer_dhuhr_iqamat_select_id}
                                        prayer_asr_iqamat_select_id=${json.items[i].prayer_asr_iqamat_select_id}
                                        prayer_maghrib_iqamat_select_id=${json.items[i].prayer_maghrib_iqamat_select_id}
                                        prayer_isha_iqamat_select_id=${json.items[i].prayer_isha_iqamat_select_id}
                                        prayer_column_imsak_checked=${json.items[i].prayer_column_imsak_checked}
                                        prayer_column_sunset_checked=${json.items[i].prayer_column_sunset_checked}
                                        prayer_column_midnight_checked=${json.items[i].prayer_column_midnight_checked}
                                        prayer_column_fast_start_end_select_id=${json.items[i].prayer_column_fast_start_end_select_id}
                                        user_account_id=${json.items[i].user_account_id}
                                        >${json.items[i].description}
                                    </option>`
                    if (show_ui == 0) {
                        //add only one option because of performance for report only 
                        //for locale and second locale, locales are not loaded, only load the used ones
                        document.getElementById('setting_select_locale').innerHTML += 
                        `<option value=${json.items[i].regional_language_locale}>${json.items[i].regional_language_locale}</option`;
                        if (json.items[i].regional_second_language_locale !='0'){
                            document.getElementById('setting_select_report_locale_second').innerHTML += 
                            `<option value=${json.items[i].regional_second_language_locale}>${json.items[i].regional_second_language_locale}</option`;                        
                        }
                    }
                }
                select.innerHTML += option_html;
                if (show_ui == 1) {
                    //show user setting select
                    document.getElementById('user_settings').style.display = "block";
                }
            } else {
                if (status == 401)
                    user_logoff();
                else
                    alert(responseText_get_error('user_settings_get', response));
            }
        })
        .catch(function(error) {
            alert(responseText_get_error('user_settings_get', error));
        });
}

function user_logoff() {
    var select = document.getElementById("setting_select_user_setting");
    var option;
    //get new token to avoid endless loop och invalid token
    get_token().then(function(){
        //sign out from Google if Google loaded
        if (gapi.auth2.getAuthInstance()) {
            gapi.auth2.getAuthInstance().signOut().then(function() {
                null;
            });
        };
        //Sign out from Facebook if signed in
        FB.getLoginStatus(function(response) {
            //statusChangeCallback(response);
            if (response.authResponse) {
                FB.logout(function(response) {
                    // user is now logged out
                    null;
                });
            }
        });
        //remove user setting icon
        update_settings_icon('', true);
        //remove user settings url links
        document.getElementById('setting_data_user_url_day').innerHTML = '';
        document.getElementById('setting_data_user_url_month').innerHTML = '';
        document.getElementById('setting_data_user_url_year').innerHTML = '';

        //hide logged in, user_edit and user settings
        document.getElementById('user_logged_in').style.display = "none";
        document.getElementById('user_edit').style.display = "none";
        document.getElementById('user_settings').style.display = "none";
        //clear logged in info
        document.getElementById('setting_data_username_logged_in').innerHTML = '';
        recreate_img(document.getElementById('setting_avatar_logged_in'));
        document.getElementById('setting_bio_logged_in').innerHTML = '';
        document.getElementById('setting_data_userid_logged_in').innerHTML = '';

        //clear user edit
        document.getElementById('setting_checkbox_report_private').checked = false;
        document.getElementById('setting_input_username_edit').value = '';
        document.getElementById('setting_input_bio_edit').value = '';
        document.getElementById('setting_input_email_edit').value = '';
        document.getElementById('setting_input_password_edit').value = '';
        document.getElementById('setting_input_password_confirm_edit').value = '';
        document.getElementById('setting_input_new_password_edit').value = '';
        document.getElementById('setting_input_new_password_confirm_edit').value = '';
        document.getElementById('setting_input_password_reminder_edit').value = '';
        document.getElementById('setting_avatar_edit').style.display = "none";

        //clear signup
        document.getElementById('signup_username').value = '';
        document.getElementById('signup_email').value = '';
        document.getElementById('signup_password').value = '';
        document.getElementById('signup_password_confirm').value = '';
        document.getElementById('signup_password_reminder').value = '';

        //clear profile
        document.getElementById('profile_main').style.display = "none";
        document.getElementById('profile_avatar').src = '';
        document.getElementById('profile_username').innerHTML = '';
        document.getElementById('profile_bio').innerHTML = '';
        document.getElementById('profile_joined_date').innerHTML = '';
        document.getElementById('profile_follow').children[0].style.display = 'block';
        document.getElementById('profile_follow').children[1].style.display = 'none';
        document.getElementById('profile_like').children[0].style.display = 'block';
        document.getElementById('profile_like').children[1].style.display = 'none';
        document.getElementById('profile_info_following_count').innerHTML = '';
        document.getElementById('profile_info_followers_count').innerHTML = '';
        document.getElementById('profile_info_likes_count').innerHTML = '';
        document.getElementById('profile_qr').innerHTML = '';
        document.getElementById('profile_detail').style.display = "none";
        document.getElementById('profile_detail_list').innerHTML = '';
        document.getElementById('profile_user_settings_public').style.display = "none";
        document.getElementById('profile_user_settings_rows').innerHTML = '';
        document.getElementById('profile_user_settings_private').style.display = "none";

        //empty user settings
        select_empty(select);
        //add one empty option
        option = document.createElement('option');
        select.appendChild(option);
        //set default settings
        set_default_settings().then(function(){
            settings_translate(true).then(function(){
                settings_translate(false).then(function(){
                    //show default startup
                    toolbar_bottom(global_default_startup_page);
                })
            })
        });
    })
    
}

function user_signup() {
    var username = document.getElementById('signup_username').value;
    var email = document.getElementById('signup_email').value;
    var password = document.getElementById('signup_password').value;
    var password_confirm = document.getElementById('signup_password_confirm').value;
    var password_reminder = document.getElementById('signup_password_reminder').value;
    var select_setting_country = document.getElementById('setting_select_country');
    var select_setting_city = document.getElementById('setting_select_city');
    var select_setting_popular_place = document.getElementById('setting_select_popular_place');

    var json_data = '{"app_id":' + global_app_id + ',' +
        '"user_language": "' + navigator.language + '",' +
        '"user_timezone": "' + Intl.DateTimeFormat().resolvedOptions().timeZone + '",' +
        '"user_number_system": "' + Intl.NumberFormat().resolvedOptions().numberingSystem + '",' +
        '"user_platform": "' + navigator.platform + '",' +
        '"username":"' + username + '",' +
        '"password":"' + password + '",' +
        '"password_reminder":"' + password_reminder + '",' +
        '"email":"' + email + '",' +
        '"active":' + 0 + ',' +
        '"description": "' + document.getElementById('setting_input_place').value + '",' +
        '"regional_language_locale": "' + document.getElementById('setting_select_locale').value + '",' +
        '"regional_current_timezone_select_id": ' + document.getElementById('setting_select_timezone_current').selectedIndex + ',' +
        '"regional_timezone_select_id": ' + document.getElementById('setting_select_report_timezone').selectedIndex + ',' +
        '"regional_number_system_select_id": ' + document.getElementById('setting_select_report_numbersystem').selectedIndex + ',' +
        '"regional_layout_direction_select_id": ' + document.getElementById('setting_select_report_direction').selectedIndex + ',' +
        '"regional_second_language_locale": "' + document.getElementById('setting_select_report_locale_second').value + '",' +
        '"regional_column_title_select_id": ' + document.getElementById('setting_select_report_coltitle').selectedIndex + ',' +
        '"regional_arabic_script_select_id": ' + document.getElementById('setting_select_report_arabic_script').selectedIndex + ',' +
        '"regional_calendar_type_select_id": ' + document.getElementById('setting_select_calendartype').selectedIndex + ',' +
        '"regional_calendar_hijri_type_select_id": ' + document.getElementById('setting_select_calendar_hijri_type').selectedIndex + ',' +

        '"gps_map_type_select_id": ' + document.getElementById('setting_select_maptype').selectedIndex + ',' +
        '"gps_country_id": ' + set_null_or_value(select_setting_country[select_setting_country.selectedIndex].getAttribute('id')) + ',' +
        '"gps_city_id": ' + set_null_or_value(select_setting_city[select_setting_city.selectedIndex].getAttribute('id')) + ',' +
        '"gps_popular_place_id": ' + set_null_or_value(select_setting_popular_place[select_setting_popular_place.selectedIndex].getAttribute('id')) + ',' +
        '"gps_lat_text": "' + document.getElementById('setting_input_lat').value + '",' +
        '"gps_long_text": "' + document.getElementById('setting_input_long').value + '",' +

        '"design_theme_day_id": "' + get_theme_id('day') + '",' +
        '"design_theme_month_id": "' + get_theme_id('month') + '",' +
        '"design_theme_year_id": "' + get_theme_id('year') + '",' +
        '"design_paper_size_select_id": ' + document.getElementById('setting_select_report_papersize').selectedIndex + ',' +
        '"design_row_highlight_select_id": ' + document.getElementById('setting_select_report_highlight_row').selectedIndex + ',' +
        '"design_column_weekday_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_weekday').checked) + ',' +
        '"design_column_calendartype_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_calendartype').checked) + ',' +
        '"design_column_notes_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_notes').checked) + ',' +
        '"design_column_gps_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_gps').checked) + ',' +
        '"design_column_timezone_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_timezone').checked) + ',' +

        '"image_header_image_img": "' + btoa(document.getElementById('setting_reportheader_img').src) + '",' +
        '"image_footer_image_img": "' + btoa(document.getElementById('setting_reportfooter_img').src) + '",' +

        '"text_header_1_text": "' + document.getElementById('setting_input_reporttitle1').value + '",' +
        '"text_header_2_text": "' + document.getElementById('setting_input_reporttitle2').value + '",' +
        '"text_header_3_text": "' + document.getElementById('setting_input_reporttitle3').value + '",' +
        '"text_header_align": "' + align_button_value('reporttitle') + '",' +
        '"text_footer_1_text": "' + document.getElementById('setting_input_reportfooter1').value + '",' +
        '"text_footer_2_text": "' + document.getElementById('setting_input_reportfooter2').value + '",' +
        '"text_footer_3_text": "' + document.getElementById('setting_input_reportfooter3').value + '",' +
        '"text_footer_align": "' + align_button_value('reportfooter') + '",' +

        '"prayer_method_select_id": ' + document.getElementById('setting_select_method').selectedIndex + ',' +
        '"prayer_asr_method_select_id": ' + document.getElementById('setting_select_asr').selectedIndex + ',' +
        '"prayer_high_latitude_adjustment_select_id": ' + document.getElementById('setting_select_highlatitude').selectedIndex + ',' +
        '"prayer_time_format_select_id": ' + document.getElementById('setting_select_timeformat').selectedIndex + ',' +
        '"prayer_hijri_date_adjustment_select_id": ' + document.getElementById('setting_select_hijri_adjustment').selectedIndex + ',' +
        '"prayer_fajr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_fajr').selectedIndex + ',' +
        '"prayer_dhuhr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_dhuhr').selectedIndex + ',' +
        '"prayer_asr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_asr').selectedIndex + ',' +
        '"prayer_maghrib_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_maghrib').selectedIndex + ',' +
        '"prayer_isha_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_isha').selectedIndex + ',' +
        '"prayer_column_imsak_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked) + ',' +
        '"prayer_column_sunset_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked) + ',' +
        '"prayer_column_midnight_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked) + ',' +
        '"prayer_column_fast_start_end_select_id": ' + document.getElementById('setting_select_report_show_fast_start_end').selectedIndex +
        '}';
    var status;
    if (username == '') {
        //"Please enter username"
        show_error(20303);
        return null;
    }
    if (password == '') {
        //"Please enter password"
        show_error(20304);
        return null;
    }
    if (password != password_confirm) {
        //Password not the same
        show_error(20301);
        return null;
    }

    spinner('SIGNUP', 'visible');
    fetch(global_rest_url_base + global_rest_user_account_signup +
            '?lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(json) {
            if (status == 200) {
                json = JSON.parse(json);
                document.getElementById('setting_data_userid_logged_in').innerHTML = json.id;
                spinner('SIGNUP', 'hidden');
                show_dialogue('VERIFY');
            } else {
                spinner('SIGNUP', 'hidden');
                if (status == 401)
                    user_logoff();
                else {
                    alert(responseText_get_error('user_signup', json));
                }
            }
        })
        .catch(function(error) {
            spinner('SIGNUP', 'hidden');
            alert(responseText_get_error('user_signup', error));
        });
}
function create_user_settings_links(user_account_id, sid){
    //show generated url for current setting
    var paper_size_select = document.getElementById('setting_select_report_papersize');
    var common_url = get_report_url(user_account_id, sid, paper_size_select.options[paper_size_select.selectedIndex].value);
    var period;
    let url_type='';
    const period_arr = ['day','month','year'];
    period_arr.forEach(period => {
        if (period =='day')
            url_type = '&type=0';
        if (period =='month')
            url_type = '&type=1';
        if (period =='year')
            url_type = '&type=2';

        document.getElementById('setting_data_user_url_' + period).innerHTML =
            `<button id=${'user_' + period + '_html'}
                class='toolbar_button'
                onclick='document.getElementById("window_preview_report").style.visibility = "visible";
                        create_qr("window_preview_toolbar_qr", "${common_url + '&format=html' + url_type}");
                        document.getElementById("window_preview_content").src="${common_url + '&format=html' + url_type}"'> 
                <i class='fas fa-file-code'></i>
                <div id=${'user_' + period + '_label_html'}>HTML</div>
            </button>
            <button id=${'user_' + period + '_html_copy'}
                class='toolbar_button'
                onclick='var promise = navigator.clipboard.writeText("${common_url + '&format=html' + url_type}") .then(() => {null;});'>
                <i class='fas fa-copy'></i>
            </button>
            <button id=${'user_' + period + '_pdf'}
                class='toolbar_button'
                onclick='document.getElementById("window_preview_report").style.visibility = "visible";
                        create_qr("window_preview_toolbar_qr", "${common_url + '&format=pdf' + url_type}");
                        document.getElementById("window_preview_content").src="${common_url + '&format=pdf' + url_type}"'> 
                <i class='fas fa-file-pdf'></i>
                <div id=${'user_' + period + '_label_pdf'}>PDF</div>
            </button>
            <button id=${'user_' + period + '_pdf_copy'}
                class='toolbar_button'
                onclick='var promise = navigator.clipboard.writeText("${common_url + '&format=pdf' + url_type}") .then(() => {null;});'>
                <i class='fas fa-copy'></i>
            </button>`;
    })
}
async function user_settings_load(show_ui = 1) {

    var select_user_setting = document.getElementById('setting_select_user_setting');
    //Regional
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_language_locale'),
        document.getElementById('setting_select_locale'), 1);
    document.getElementById('setting_select_timezone_current').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_current_timezone_select_id');
    document.getElementById('setting_select_report_timezone').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_timezone_select_id');
    document.getElementById('setting_select_report_numbersystem').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_number_system_select_id');
    document.getElementById('setting_select_report_direction').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_layout_direction_select_id');
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_second_language_locale'),
        document.getElementById('setting_select_report_locale_second'),1);
    document.getElementById('setting_select_report_coltitle').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_column_title_select_id');
    document.getElementById('setting_select_report_arabic_script').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_arabic_script_select_id');
    document.getElementById('setting_select_calendartype').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_type_select_id');
    document.getElementById('setting_select_calendar_hijri_type').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_hijri_type_select_id');

    if (show_ui == 1) {
        //GPS
        document.getElementById('setting_select_maptype').selectedIndex =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_map_type_select_id');

        SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id'),
                                    document.getElementById('setting_select_country'),0);
        if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id') !='') {
            //fill cities for chosen country
            update_ui(5);
        }
        SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id'),
                                    document.getElementById('setting_select_city'),0);
        if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id') !='') {
            //set GPS for chosen city
            update_ui(6);
        }

        SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id'),
                                    document.getElementById('setting_select_popular_place'),0);
        if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id') !='') {
            //set GPS for chosen popular place
            update_ui(7);
        }
    }
    document.getElementById('setting_input_place').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('description');
    document.getElementById('setting_input_lat').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_lat_text');
    document.getElementById('setting_input_long').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_long_text');
    //if user interface shall be shown and if country, city and popular place are not set
    if (show_ui == 1 &&
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id') == '' &&
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id') == '' &&
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id') == '') {
        update_map(document.getElementById('setting_input_long').value,
            document.getElementById('setting_input_lat').value,
            global_map_default_zoom, //default zoom
            document.getElementById('setting_input_place').value, //text1
            document.getElementById('setting_label_report_timezone').innerHTML, //text2
            document.getElementById('setting_select_report_timezone').value, //text3
            global_map_marker_div_gps, //marker for GPS
            global_map_jumpto);
    }
    //Design
    if (show_ui == 1){
        set_theme_id('day', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_day_id'));
        set_theme_id('month', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_month_id'));
        set_theme_id('year', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_year_id'));
    }
    document.getElementById('setting_select_report_papersize').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('design_paper_size_select_id');
    document.getElementById('paper').className=document.getElementById('setting_select_report_papersize').value;
    
    document.getElementById('setting_select_report_highlight_row').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('design_row_highlight_select_id');

    document.getElementById('setting_checkbox_report_show_weekday').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_weekday_checked'));
    document.getElementById('setting_checkbox_report_show_calendartype').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_calendartype_checked'));
    document.getElementById('setting_checkbox_report_show_notes').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_notes_checked'));
    document.getElementById('setting_checkbox_report_show_gps').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_gps_checked'));
    document.getElementById('setting_checkbox_report_show_timezone').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_timezone_checked'));

    //Image
    //dont set null value, it will corrupt IMG tag
    document.getElementById('setting_input_reportheader_img').value = '';
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img') == null ||
        select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img') == '') {
        recreate_img(document.getElementById('setting_reportheader_img'));
    } else {
        document.getElementById('setting_reportheader_img').src =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img');
    }

    document.getElementById('setting_input_reportfooter_img').value = '';
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img') == null ||
        select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img') == '') {
        document.getElementById('setting_reportfooter_img').src = '';
        recreate_img(document.getElementById('setting_reportfooter_img'));
    } else {
        document.getElementById('setting_reportfooter_img').src =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img');
    }
    //Text
    document.getElementById('setting_input_reporttitle1').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_1_text');
    document.getElementById('setting_input_reporttitle2').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_2_text');
    document.getElementById('setting_input_reporttitle3').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_3_text');
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align') == '') {
        document.getElementById('setting_input_reporttitle_aleft').classList.remove('setting_button_active');
        document.getElementById('setting_input_reporttitle_acenter').classList.remove('setting_button_active');
        document.getElementById('setting_input_reporttitle_aright').classList.remove('setting_button_active');
    } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
        //remove active class if it is active
        document.getElementById('setting_input_reporttitle_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align')).classList.remove('setting_button_active');
        update_timetable_report(4, 'setting_input_reporttitle_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align'));
    }
    document.getElementById('setting_input_reportfooter1').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_1_text');
    document.getElementById('setting_input_reportfooter2').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_2_text');
    document.getElementById('setting_input_reportfooter3').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_3_text');
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align') == '') {
        document.getElementById('setting_input_reportfooter_aleft').classList.remove('setting_button_active');
        document.getElementById('setting_input_reportfooter_acenter').classList.remove('setting_button_active');
        document.getElementById('setting_input_reportfooter_aright').classList.remove('setting_button_active');
    } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
        //remove active class if it is active
        document.getElementById('setting_input_reportfooter_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align')).classList.remove('setting_button_active');
        update_timetable_report(6, 'setting_input_reportfooter_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align'));
    }
    //Prayer
    document.getElementById('setting_select_method').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_method_select_id');
    if (show_ui == 1)
    //show method parameters used
        update_ui(17);

    document.getElementById('setting_select_asr').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_method_select_id');
    document.getElementById('setting_select_highlatitude').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_high_latitude_adjustment_select_id');
    document.getElementById('setting_select_timeformat').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_time_format_select_id');
    document.getElementById('setting_select_hijri_adjustment').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_hijri_date_adjustment_select_id');
    document.getElementById('setting_select_report_iqamat_title_fajr').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat_select_id');
    document.getElementById('setting_select_report_iqamat_title_dhuhr').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_dhuhr_iqamat_select_id');
    document.getElementById('setting_select_report_iqamat_title_asr').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_iqamat_select_id');
    document.getElementById('setting_select_report_iqamat_title_maghrib').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_maghrib_iqamat_select_id');
    document.getElementById('setting_select_report_iqamat_title_isha').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_isha_iqamat_select_id');


    document.getElementById('setting_checkbox_report_show_imsak').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_imsak_checked'));
    document.getElementById('setting_checkbox_report_show_sunset').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_sunset_checked'));
    document.getElementById('setting_checkbox_report_show_midnight').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_midnight_checked'));

    document.getElementById('setting_select_report_show_fast_start_end').selectedIndex =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_fast_start_end_select_id');

    if (show_ui == 1) {
        create_user_settings_links(select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id'),
                                   select_user_setting[select_user_setting.selectedIndex].getAttribute('id'));
    }
    return null;
}

function user_settings_save() {
    var select_user_setting = document.getElementById('setting_select_user_setting');
    var user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    var user_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    var status;
    var select_setting_country = document.getElementById('setting_select_country');
    var select_setting_city = document.getElementById('setting_select_city');
    var select_setting_popular_place = document.getElementById('setting_select_popular_place');

    //boolean use boolean_to_number()
    //store 0/1 for checked value for checkboxes
    //use btoa() for images to encode with BASE64 to BLOB column.

    var json_data =
        '{' +
        '"app_id":' + global_app_id + ',' +
        '"description": "' + document.getElementById('setting_input_place').value + '",' +
        '"regional_language_locale": "' + document.getElementById('setting_select_locale').value + '",' +
        '"regional_current_timezone_select_id": ' + document.getElementById('setting_select_timezone_current').selectedIndex + ',' +
        '"regional_timezone_select_id": ' + document.getElementById('setting_select_report_timezone').selectedIndex + ',' +
        '"regional_number_system_select_id": ' + document.getElementById('setting_select_report_numbersystem').selectedIndex + ',' +
        '"regional_layout_direction_select_id": ' + document.getElementById('setting_select_report_direction').selectedIndex + ',' +
        '"regional_second_language_locale": "' + document.getElementById('setting_select_report_locale_second').value + '",' +
        '"regional_column_title_select_id": ' + document.getElementById('setting_select_report_coltitle').selectedIndex + ',' +
        '"regional_arabic_script_select_id": ' + document.getElementById('setting_select_report_arabic_script').selectedIndex + ',' +
        '"regional_calendar_type_select_id": ' + document.getElementById('setting_select_calendartype').selectedIndex + ',' +
        '"regional_calendar_hijri_type_select_id": ' + document.getElementById('setting_select_calendar_hijri_type').selectedIndex + ',' +

        '"gps_map_type_select_id": ' + document.getElementById('setting_select_maptype').selectedIndex + ',' +
        '"gps_country_id": ' + set_null_or_value(select_setting_country[select_setting_country.selectedIndex].getAttribute('id')) + ',' +
        '"gps_city_id": ' + set_null_or_value(select_setting_city[select_setting_city.selectedIndex].getAttribute('id')) + ',' +
        '"gps_popular_place_id": ' + set_null_or_value(select_setting_popular_place[select_setting_popular_place.selectedIndex].getAttribute('id')) + ',' +
        '"gps_lat_text": "' + document.getElementById('setting_input_lat').value + '",' +
        '"gps_long_text": "' + document.getElementById('setting_input_long').value + '",' +

        '"design_theme_day_id": "' + get_theme_id('day') + '",' +
        '"design_theme_month_id": "' + get_theme_id('month') + '",' +
        '"design_theme_year_id": "' + get_theme_id('year') + '",' +
        '"design_paper_size_select_id": ' + document.getElementById('setting_select_report_papersize').selectedIndex + ',' +
        '"design_row_highlight_select_id": ' + document.getElementById('setting_select_report_highlight_row').selectedIndex + ',' +
        '"design_column_weekday_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_weekday').checked) + ',' +
        '"design_column_calendartype_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_calendartype').checked) + ',' +
        '"design_column_notes_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_notes').checked) + ',' +
        '"design_column_gps_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_gps').checked) + ',' +
        '"design_column_timezone_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_timezone').checked) + ',' +

        '"image_header_image_img": "' + btoa(document.getElementById('setting_reportheader_img').src) + '",' +
        '"image_footer_image_img": "' + btoa(document.getElementById('setting_reportfooter_img').src) + '",' +

        '"text_header_1_text": "' + document.getElementById('setting_input_reporttitle1').value + '",' +
        '"text_header_2_text": "' + document.getElementById('setting_input_reporttitle2').value + '",' +
        '"text_header_3_text": "' + document.getElementById('setting_input_reporttitle3').value + '",' +
        '"text_header_align": "' + align_button_value('reporttitle') + '",' +
        '"text_footer_1_text": "' + document.getElementById('setting_input_reportfooter1').value + '",' +
        '"text_footer_2_text": "' + document.getElementById('setting_input_reportfooter2').value + '",' +
        '"text_footer_3_text": "' + document.getElementById('setting_input_reportfooter3').value + '",' +
        '"text_footer_align": "' + align_button_value('reportfooter') + '",' +

        '"prayer_method_select_id": ' + document.getElementById('setting_select_method').selectedIndex + ',' +
        '"prayer_asr_method_select_id": ' + document.getElementById('setting_select_asr').selectedIndex + ',' +
        '"prayer_high_latitude_adjustment_select_id": ' + document.getElementById('setting_select_highlatitude').selectedIndex + ',' +
        '"prayer_time_format_select_id": ' + document.getElementById('setting_select_timeformat').selectedIndex + ',' +
        '"prayer_hijri_date_adjustment_select_id": ' + document.getElementById('setting_select_hijri_adjustment').selectedIndex + ',' +
        '"prayer_fajr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_fajr').selectedIndex + ',' +
        '"prayer_dhuhr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_dhuhr').selectedIndex + ',' +
        '"prayer_asr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_asr').selectedIndex + ',' +
        '"prayer_maghrib_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_maghrib').selectedIndex + ',' +
        '"prayer_isha_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_isha').selectedIndex + ',' +
        '"prayer_column_imsak_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked) + ',' +
        '"prayer_column_sunset_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked) + ',' +
        '"prayer_column_midnight_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked) + ',' +
        '"prayer_column_fast_start_end_select_id": ' + document.getElementById('setting_select_report_show_fast_start_end').selectedIndex + ',' +
        '"user_account_id": ' + user_id +
        '}';
    spinner('SAVE', 'visible');

    fetch(global_rest_url_base + global_rest_app_timetables_user_setting + user_setting_id +
            '?lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                //update user settings select with saved data
                set_settings_select();
                spinner('SAVE', 'hidden');
            } else {
                spinner('SAVE', 'hidden');
                if (status == 401)
                    user_logoff();
                else
                    alert(responseText_get_error('user_settings_save', response));
            }
        })
        .catch(function(error) {
            spinner('SAVE', 'hidden');
            alert(responseText_get_error('user_settings_save', error));
        });
}

function user_settings_add(signup = false) {
    var user_account_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    var description = document.getElementById('setting_input_place').value;
    var status;
    var select_setting_country = document.getElementById('setting_select_country');
    var select_setting_city = document.getElementById('setting_select_city');
    var select_setting_popular_place = document.getElementById('setting_select_popular_place');
    //boolean use boolean_to_number()
    //store 0/1 for checked value for checkboxes
    //use btoa() for images to encode with BASE64 to BLOB column.
    var json_data =
        '{' +
        '"app_id":' + global_app_id + ',' +
        '"description": "' + description + '",' +
        '"regional_language_locale": "' + document.getElementById('setting_select_locale').value + '",' +
        '"regional_current_timezone_select_id": ' + document.getElementById('setting_select_timezone_current').selectedIndex + ',' +
        '"regional_timezone_select_id": ' + document.getElementById('setting_select_report_timezone').selectedIndex + ',' +
        '"regional_number_system_select_id": ' + document.getElementById('setting_select_report_numbersystem').selectedIndex + ',' +
        '"regional_layout_direction_select_id": ' + document.getElementById('setting_select_report_direction').selectedIndex + ',' +
        '"regional_second_language_locale": "' + document.getElementById('setting_select_report_locale_second').value + '",' +
        '"regional_column_title_select_id": ' + document.getElementById('setting_select_report_coltitle').selectedIndex + ',' +
        '"regional_arabic_script_select_id": ' + document.getElementById('setting_select_report_arabic_script').selectedIndex + ',' +
        '"regional_calendar_type_select_id": ' + document.getElementById('setting_select_calendartype').selectedIndex + ',' +
        '"regional_calendar_hijri_type_select_id": ' + document.getElementById('setting_select_calendar_hijri_type').selectedIndex + ',' +

        '"gps_map_type_select_id": ' + document.getElementById('setting_select_maptype').selectedIndex + ',' +
        '"gps_country_id": ' + set_null_or_value(select_setting_country[select_setting_country.selectedIndex].getAttribute('id')) + ',' +
        '"gps_city_id": ' + set_null_or_value(select_setting_city[select_setting_city.selectedIndex].getAttribute('id')) + ',' +
        '"gps_popular_place_id": ' + set_null_or_value(select_setting_popular_place[select_setting_popular_place.selectedIndex].getAttribute('id')) + ',' +
        '"gps_lat_text": "' + document.getElementById('setting_input_lat').value + '",' +
        '"gps_long_text": "' + document.getElementById('setting_input_long').value + '",' +

        '"design_theme_day_id": "' + get_theme_id('day') + '",' +
        '"design_theme_month_id": "' + get_theme_id('month') + '",' +
        '"design_theme_year_id": "' + get_theme_id('year') + '",' +
        '"design_paper_size_select_id": ' + document.getElementById('setting_select_report_papersize').selectedIndex + ',' +
        '"design_row_highlight_select_id": ' + document.getElementById('setting_select_report_highlight_row').selectedIndex + ',' +
        '"design_column_weekday_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_weekday').checked) + ',' +
        '"design_column_calendartype_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_calendartype').checked) + ',' +
        '"design_column_notes_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_notes').checked) + ',' +
        '"design_column_gps_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_gps').checked) + ',' +
        '"design_column_timezone_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_timezone').checked) + ',' +

        '"image_header_image_img": "' + btoa(document.getElementById('setting_reportheader_img').src) + '",' +
        '"image_footer_image_img": "' + btoa(document.getElementById('setting_reportfooter_img').src) + '",' +

        '"text_header_1_text": "' + document.getElementById('setting_input_reporttitle1').value + '",' +
        '"text_header_2_text": "' + document.getElementById('setting_input_reporttitle2').value + '",' +
        '"text_header_3_text": "' + document.getElementById('setting_input_reporttitle3').value + '",' +
        '"text_header_align": "' + align_button_value('reporttitle') + '",' +
        '"text_footer_1_text": "' + document.getElementById('setting_input_reportfooter1').value + '",' +
        '"text_footer_2_text": "' + document.getElementById('setting_input_reportfooter2').value + '",' +
        '"text_footer_3_text": "' + document.getElementById('setting_input_reportfooter3').value + '",' +
        '"text_footer_align": "' + align_button_value('reportfooter') + '",' +

        '"prayer_method_select_id": ' + document.getElementById('setting_select_method').selectedIndex + ',' +
        '"prayer_asr_method_select_id": ' + document.getElementById('setting_select_asr').selectedIndex + ',' +
        '"prayer_high_latitude_adjustment_select_id": ' + document.getElementById('setting_select_highlatitude').selectedIndex + ',' +
        '"prayer_time_format_select_id": ' + document.getElementById('setting_select_timeformat').selectedIndex + ',' +
        '"prayer_hijri_date_adjustment_select_id": ' + document.getElementById('setting_select_hijri_adjustment').selectedIndex + ',' +
        '"prayer_fajr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_fajr').selectedIndex + ',' +
        '"prayer_dhuhr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_dhuhr').selectedIndex + ',' +
        '"prayer_asr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_asr').selectedIndex + ',' +
        '"prayer_maghrib_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_maghrib').selectedIndex + ',' +
        '"prayer_isha_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_isha').selectedIndex + ',' +
        '"prayer_column_imsak_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked) + ',' +
        '"prayer_column_sunset_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked) + ',' +
        '"prayer_column_midnight_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked) + ',' +
        '"prayer_column_fast_start_end_select_id": ' + document.getElementById('setting_select_report_show_fast_start_end').selectedIndex + ',' +
        '"user_account_id": ' + user_account_id +
        '}';
    //adding user_id twice is bugfix, variable user_account_id seem to disappear if mentioned once
    //setting hardcoded number works but not applicable here
    spinner('ADD', 'visible');
    fetch(global_rest_url_base + global_rest_app_timetables_user_setting +
            '?lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status === 200) {
                var json = JSON.parse(response);
                //update user settings select with saved data
                //save current settings to new option with 
                //returned user_setting_id + user_account_id (then call set_settings_select)
                if (signup == false) {
                    var select = document.getElementById("setting_select_user_setting");
                    var option;
                    option = document.createElement('option');
                    option.text = description;
                    option.setAttribute('id', json.id);
                    option.setAttribute('user_account_id', user_account_id);
                    select.appendChild(option);
                    select.selectedIndex = option.index;
                    option.value = select.selectedIndex;
                    set_settings_select();
                }
                spinner('ADD', 'hidden');
            } else {
                spinner('ADD', 'hidden');
                if (status == 401)
                    user_logoff();
                else
                    alert(responseText_get_error('user_settings_add', response));
            }
        })
        .catch(function(error) {
            spinner('ADD', 'hidden');
            alert(responseText_get_error('user_settings_add', error));
        });
}

function user_settings_delete() {
    var user_account_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    var select_user_setting = document.getElementById('setting_select_user_setting');
    var user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    var status;
    if (select_user_setting.length > 1) {
        spinner('DELETE', 'visible');
        fetch(global_rest_url_base + global_rest_app_timetables_user_setting + user_setting_id + 
                '?app_id=' + global_app_id +
                '&lang_code=' + document.getElementById('setting_select_locale').value, 
            {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_at
                }
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(response) {
                if (status == 200) {
                    var select = document.getElementById("setting_select_user_setting");
                    //delete current option
                    select.remove(select.selectedIndex);
                    //load next available
                    user_settings_load().then(function(){
                        settings_translate(true).then(function(){
                            settings_translate(false).then(function(){
                                update_timetable_report();
                                spinner('DELETE', 'hidden');
                            })
                        })
                    })
                    
                } else {
                    spinner('DELETE', 'hidden');
                    if (status == 401)
                        user_logoff();
                    else
                        alert(responseText_get_error('user_settings_delete', response));
                }
            })
            .catch(function(error) {
                spinner('DELETE', 'hidden');
                alert(responseText_get_error('user_settings_delete', error));
            });
    } else {
        //You can't delete last user setting
        show_error(20302);
    }
    return null;
}

async function set_default_settings() {
    var current_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var current_number_system = Intl.NumberFormat().resolvedOptions().numberingSystem;

    //Regional
    //set according to users browser settings
    //set default language
    //navigator.userLanguage is for IE only, Edge reads navigator.language
    //reads lowercase since Chromium/Chrome returns en-US, safari returns en
    //and select options are saved with lowercase
    SearchAndSetSelectedIndex(navigator.language.toLowerCase(), document.getElementById('setting_select_locale'),1);
    //default timezone current timezone
    SearchAndSetSelectedIndex(current_timezone, document.getElementById('setting_select_timezone_current'),1);
    //def report timezone current timezone, 
    //will be changed user timezone to place timezone if no GPS can be set and default place will be used
    SearchAndSetSelectedIndex(current_timezone, document.getElementById('setting_select_report_timezone'),1);
    //set default numberformat numbersystem
    SearchAndSetSelectedIndex(current_number_system, document.getElementById('setting_select_report_numbersystem'),1);
    //set default for others in Regional
    document.getElementById('setting_select_report_direction').selectedIndex = global_default_direction;
    document.getElementById('setting_select_report_locale_second').selectedIndex = global_default_locale_second;
    document.getElementById('setting_select_report_coltitle').selectedIndex = global_default_coltitle;
    document.getElementById('setting_select_report_arabic_script').selectedIndex = global_default_arabic_script;
    document.getElementById('setting_select_calendartype').selectedIndex = global_default_calendartype;
    document.getElementById('setting_select_calendar_hijri_type').selectedIndex = global_default_calendar_hijri_type;

    //GPS
    document.getElementById('setting_select_maptype').selectedIndex = global_default_maptype;
    SearchAndSetSelectedIndex(global_default_country, document.getElementById('setting_select_country'),0);
    SearchAndSetSelectedIndex(global_default_city, document.getElementById('setting_select_city'),0);
    
    //set according to users GPS/IP settings
    if (global_user_gps_latitude != '' && global_user_gps_longitude != '') {
        document.getElementById('setting_input_lat').value = global_user_gps_latitude;
        document.getElementById('setting_input_long').value = global_user_gps_longitude;
        //Update GPS position
        update_ui(9);
        document.getElementById('setting_input_place').value = global_user_gps_place;
    } else {
        //Set Makkah as default
        var select_place = document.getElementById('setting_select_popular_place');
        select_place.selectedIndex = select_get_selectindex(select_place.id, global_default_place_id);
        //Update popular places
        update_ui(7);
    }
    //Design
    set_theme_id('day', global_default_theme_day);
    set_theme_id('month', global_default_theme_month);
    set_theme_id('year', global_default_theme_year);
    document.getElementById('setting_select_report_papersize').selectedIndex = global_default_papersize;
    document.getElementById('paper').className=document.getElementById('setting_select_report_papersize').value;
    document.getElementById('setting_select_report_highlight_row').selectedIndex = global_default_highlight_row;
    document.getElementById('setting_checkbox_report_show_weekday').checked = global_default_show_weekday;
    document.getElementById('setting_checkbox_report_show_calendartype').checked = global_default_show_calendartype;
    document.getElementById('setting_checkbox_report_show_notes').checked = global_default_show_notes;
    document.getElementById('setting_checkbox_report_show_gps').checked = global_default_show_gps;
    document.getElementById('setting_checkbox_report_show_timezone').checked = global_default_show_timezone;

    //Image
    document.getElementById('setting_input_reportheader_img').value = '';
    if (global_default_report_header_src == null || global_default_report_header_src == '')
        recreate_img(document.getElementById('setting_reportheader_img'));
    else {
        document.getElementById('setting_reportheader_img').src = global_default_report_header_src;
    }
    document.getElementById('setting_input_reportfooter_img').value = '';
    if (global_default_report_footer_src == null || global_default_report_footer_src == '')
        recreate_img(document.getElementById('setting_reportfooter_img'));
    else {
        document.getElementById('setting_reportfooter_img').src = global_default_report_footer_src;
    }
    //Text
    document.getElementById('setting_input_reporttitle1').value = global_default_reporttitle1;
    document.getElementById('setting_input_reporttitle2').value = global_default_reporttitle2;
    document.getElementById('setting_input_reporttitle3').value = global_default_reporttitle3;
    document.getElementById('setting_input_reporttitle_aleft').classList = 'setting_button'; //Align left not active
    document.getElementById('setting_input_reporttitle_acenter').classList = 'setting_button'; //Align center not active
    document.getElementById('setting_input_reporttitle_aright').classList = 'setting_button'; //Align right not active
    document.getElementById('setting_input_reportfooter1').value = global_default_reportfooter1;
    document.getElementById('setting_input_reportfooter2').value = global_default_reportfooter2;
    document.getElementById('setting_input_reportfooter3').value = global_default_reportfooter3;
    document.getElementById('setting_input_reportfooter_aleft').classList = 'setting_button'; //Align left not active
    document.getElementById('setting_input_reportfooter_acenter').classList = 'setting_button'; //Align center not active
    document.getElementById('setting_input_reportfooter_aright').classList = 'setting_button'; //Align right not active

    //Prayer
    document.getElementById('setting_select_method').selectedIndex = global_default_method;
    //show method parameters used
    update_ui(17);
    document.getElementById('setting_select_asr').selectedIndex = global_default_asr;
    document.getElementById('setting_select_highlatitude').selectedIndex = global_default_highlatitude;
    document.getElementById('setting_select_timeformat').selectedIndex = global_default_timeformat;
    document.getElementById('setting_select_hijri_adjustment').selectedIndex = global_default_hijri_adjustment;

    document.getElementById('setting_select_report_iqamat_title_fajr').selectedIndex = global_default_iqamat_title_fajr;
    document.getElementById('setting_select_report_iqamat_title_dhuhr').selectedIndex = global_default_iqamat_title_dhuhr;
    document.getElementById('setting_select_report_iqamat_title_asr').selectedIndex = global_default_iqamat_title_asr;
    document.getElementById('setting_select_report_iqamat_title_maghrib').selectedIndex = global_default_iqamat_title_maghrib;
    document.getElementById('setting_select_report_iqamat_title_isha').selectedIndex = global_default_iqamat_title_isha;

    document.getElementById('setting_checkbox_report_show_imsak').checked = global_default_show_imsak;
    document.getElementById('setting_checkbox_report_show_sunset').checked = global_default_show_sunset;
    document.getElementById('setting_checkbox_report_show_midnight').checked = global_default_show_midnight;
    document.getElementById('setting_select_report_show_fast_start_end').selectedIndex = global_default_show_fast_start_end;
    //update select
    set_settings_select();
    //set default popup menu
    document.getElementById('popup_menu_login').style.display = 'block';
    document.getElementById('popup_menu_signup').style.display = 'block';
    document.getElementById('popup_menu_logoff').style.display = 'none';
    //Hide user tab
    document.getElementById('tab7_nav').style.display = 'none';
    //open regional tab in settings
    openTab('tab1');
}

function set_settings_select() {
    var option = document.getElementById("setting_select_user_setting").options[document.getElementById("setting_select_user_setting").selectedIndex];
    option.text = document.getElementById('setting_input_place').value;
    //option.value = 1;
    //option.setAttribute('id', "");
    option.setAttribute('description', document.getElementById('setting_input_place').value);
    option.setAttribute('regional_language_locale', document.getElementById('setting_select_locale').value);
    option.setAttribute('regional_current_timezone_select_id', document.getElementById('setting_select_timezone_current').selectedIndex);
    option.setAttribute('regional_timezone_select_id', document.getElementById('setting_select_report_timezone').selectedIndex);
    option.setAttribute('regional_number_system_select_id', document.getElementById('setting_select_report_numbersystem').selectedIndex);
    option.setAttribute('regional_layout_direction_select_id', document.getElementById('setting_select_report_direction').selectedIndex);
    option.setAttribute('regional_second_language_locale', document.getElementById('setting_select_report_locale_second').value);
    option.setAttribute('regional_column_title_select_id', document.getElementById('setting_select_report_coltitle').selectedIndex);
    option.setAttribute('regional_arabic_script_select_id', document.getElementById('setting_select_report_arabic_script').selectedIndex);
    option.setAttribute('regional_calendar_type_select_id', document.getElementById('setting_select_calendartype').selectedIndex);
    option.setAttribute('regional_calendar_hijri_type_select_id', document.getElementById('setting_select_calendar_hijri_type').selectedIndex);

    option.setAttribute('gps_map_type_select_id', document.getElementById('setting_select_maptype').selectedIndex);
    option.setAttribute('gps_country_id', select_get_id('setting_select_country',document.getElementById('setting_select_country').selectedIndex));
    option.setAttribute('gps_city_id', select_get_id('setting_select_city',document.getElementById('setting_select_city').selectedIndex));
    option.setAttribute('gps_popular_place_id', select_get_id('setting_select_popular_place',document.getElementById('setting_select_popular_place').selectedIndex));
    option.setAttribute('gps_lat_text', document.getElementById('setting_input_lat').value);
    option.setAttribute('gps_long_text', document.getElementById('setting_input_long').value);

    option.setAttribute('design_theme_day_id', get_theme_id('day'));
    option.setAttribute('design_theme_month_id', get_theme_id('month'));
    option.setAttribute('design_theme_year_id', get_theme_id('year'));
    option.setAttribute('design_paper_size_select_id', document.getElementById('setting_select_report_papersize').selectedIndex);
    option.setAttribute('design_row_highlight_select_id', document.getElementById('setting_select_report_highlight_row').selectedIndex);
    option.setAttribute('design_column_weekday_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_weekday').checked));
    option.setAttribute('design_column_calendartype_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_calendartype').checked));
    option.setAttribute('design_column_notes_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_notes').checked));
    option.setAttribute('design_column_gps_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_gps').checked));
    option.setAttribute('design_column_timezone_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_timezone').checked));

    option.setAttribute('image_header_image_img', document.getElementById('setting_reportheader_img').src);
    option.setAttribute('image_footer_image_img', document.getElementById('setting_reportfooter_img').src);

    //fix null value that returns the word "null" without quotes
    option.setAttribute('text_header_1_text', document.getElementById('setting_input_reporttitle1').value);
    option.setAttribute('text_header_2_text', document.getElementById('setting_input_reporttitle2').value);
    option.setAttribute('text_header_3_text', document.getElementById('setting_input_reporttitle3').value);
    option.setAttribute('text_header_align', align_button_value('reporttitle'));
    option.setAttribute('text_footer_1_text', document.getElementById('setting_input_reportfooter1').value);
    option.setAttribute('text_footer_2_text', document.getElementById('setting_input_reportfooter2').value);
    option.setAttribute('text_footer_3_text', document.getElementById('setting_input_reportfooter3').value);
    option.setAttribute('text_footer_align', align_button_value('reportfooter'));

    option.setAttribute('prayer_method_select_id', document.getElementById('setting_select_method').selectedIndex);
    option.setAttribute('prayer_asr_method_select_id', document.getElementById('setting_select_asr').selectedIndex);
    option.setAttribute('prayer_high_latitude_adjustment_select_id', document.getElementById('setting_select_highlatitude').selectedIndex);
    option.setAttribute('prayer_time_format_select_id', document.getElementById('setting_select_timeformat').selectedIndex);
    option.setAttribute('prayer_hijri_date_adjustment_select_id', document.getElementById('setting_select_hijri_adjustment').selectedIndex);
    option.setAttribute('prayer_fajr_iqamat_select_id', document.getElementById('setting_select_report_iqamat_title_fajr').selectedIndex);
    option.setAttribute('prayer_dhuhr_iqamat_select_id', document.getElementById('setting_select_report_iqamat_title_dhuhr').selectedIndex);
    option.setAttribute('prayer_asr_iqamat_select_id', document.getElementById('setting_select_report_iqamat_title_asr').selectedIndex);
    option.setAttribute('prayer_maghrib_iqamat_select_id', document.getElementById('setting_select_report_iqamat_title_maghrib').selectedIndex);
    option.setAttribute('prayer_isha_iqamat_select_id', document.getElementById('setting_select_report_iqamat_title_isha').selectedIndex);
    option.setAttribute('prayer_column_imsak_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked));
    option.setAttribute('prayer_column_sunset_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked));
    option.setAttribute('prayer_column_midnight_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked));
    option.setAttribute('prayer_column_fast_start_end_select_id', document.getElementById('setting_select_report_show_fast_start_end').selectedIndex);
    //option.setAttribute('user_account_id', "");
}

function update_settings_icon(url = '', logoff = false) {
    var img_account_image_url = document.getElementById('user_account_image_url');
    var i_tag = document.getElementById('toolbar_btn_settings').children[1];
    if (logoff == true) {
        //hide image url and show the icon
        img_account_image_url.style.display = 'none';
        img_account_image_url.src = '';
        i_tag.style.display = 'inline-block';
    } else {
        //show image url in user setting and hide the icon
        i_tag.style.display = 'none';
        img_account_image_url.style.display = 'inline-block';
        img_account_image_url.src = url;
    }
    return null;

}

function updateProviderUser(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email) {
    var json;
    var status;
    var user_id = document.getElementById('setting_data_userid_logged_in');
    var profile_image;
    var profile_username_logged_in;
    var img = new Image();

    profile_username_logged_in = profile_first_name + ' ' + profile_last_name;

    img.src = profile_image_url;
    img.crossOrigin = 'Anonymous';
    img.onload = function(el) {
        var elem = document.createElement('canvas');
        elem.width = global_file_image_avatar_width;
        elem.height = global_file_image_avatar_height;
        var ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
        profile_image = ctx.canvas.toDataURL(global_file_image_mime_type);
        var json_data =
            '{' +
            '"app_id": ' + global_app_id + ',' +
            '"user_language": "' + navigator.language + '",' +
            '"user_timezone": "' + Intl.DateTimeFormat().resolvedOptions().timeZone + '",' +
            '"user_number_system": "' + Intl.NumberFormat().resolvedOptions().numberingSystem + '",' +
            '"user_platform": "' + navigator.platform + '",' +
            '"active": 1,' +
            '"provider_no": ' + provider_no + ',' +
            '"provider' + provider_no + '_id":"' + profile_id + '",' +
            '"provider' + provider_no + '_first_name":"' + profile_first_name + '",' +
            '"provider' + provider_no + '_last_name":"' + profile_last_name + '",' +
            '"provider' + provider_no + '_image":"' + btoa(profile_image) + '",' +
            '"provider' + provider_no + '_image_url":"' + profile_image_url + '",' +
            '"provider' + provider_no + '_email":"' + profile_email + '",' +
            '"description": "' + document.getElementById('setting_input_place').value + '",' +
            '"regional_language_locale": "' + document.getElementById('setting_select_locale').value + '",' +
            '"regional_current_timezone_select_id": ' + document.getElementById('setting_select_timezone_current').selectedIndex + ',' +
            '"regional_timezone_select_id": ' + document.getElementById('setting_select_report_timezone').selectedIndex + ',' +
            '"regional_number_system_select_id": ' + document.getElementById('setting_select_report_numbersystem').selectedIndex + ',' +
            '"regional_layout_direction_select_id": ' + document.getElementById('setting_select_report_direction').selectedIndex + ',' +
            '"regional_second_language_locale": "' + document.getElementById('setting_select_report_locale_second').value + '",' +
            '"regional_column_title_select_id": ' + document.getElementById('setting_select_report_coltitle').selectedIndex + ',' +
            '"regional_arabic_script_select_id": ' + document.getElementById('setting_select_report_arabic_script').selectedIndex + ',' +
            '"regional_calendar_type_select_id": ' + document.getElementById('setting_select_calendartype').selectedIndex + ',' +
            '"regional_calendar_hijri_type_select_id": ' + document.getElementById('setting_select_calendar_hijri_type').selectedIndex + ',' +

            '"gps_map_type_select_id": ' + document.getElementById('setting_select_maptype').selectedIndex + ',' +
            '"gps_country_id": ' + select_get_id('setting_select_country',document.getElementById('setting_select_country').selectedIndex) + ',' +
            '"gps_city_id": ' + select_get_id('setting_select_city',document.getElementById('setting_select_city').selectedIndex) + ',' +
            '"gps_popular_place_id": ' + select_get_id('setting_select_popular_place',document.getElementById('setting_select_popular_place').selectedIndex) + ',' +
            '"gps_lat_text": "' + document.getElementById('setting_input_lat').value + '",' +
            '"gps_long_text": "' + document.getElementById('setting_input_long').value + '",' +

            '"design_theme_day_id": "' + get_theme_id('day') + '",' +
            '"design_theme_month_id": "' + get_theme_id('month') + '",' +
            '"design_theme_year_id": "' + get_theme_id('year') + '",' +
            '"design_paper_size_select_id": ' + document.getElementById('setting_select_report_papersize').selectedIndex + ',' +
            '"design_row_highlight_select_id": ' + document.getElementById('setting_select_report_highlight_row').selectedIndex + ',' +
            '"design_column_weekday_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_weekday').checked) + ',' +
            '"design_column_calendartype_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_calendartype').checked) + ',' +
            '"design_column_notes_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_notes').checked) + ',' +
            '"design_column_gps_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_gps').checked) + ',' +
            '"design_column_timezone_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_timezone').checked) + ',' +

            '"image_header_image_img": "' + btoa(document.getElementById('setting_reportheader_img').src) + '",' +
            '"image_footer_image_img": "' + btoa(document.getElementById('setting_reportfooter_img').src) + '",' +

            '"text_header_1_text": "' + document.getElementById('setting_input_reporttitle1').value + '",' +
            '"text_header_2_text": "' + document.getElementById('setting_input_reporttitle2').value + '",' +
            '"text_header_3_text": "' + document.getElementById('setting_input_reporttitle3').value + '",' +
            '"text_header_align": "' + align_button_value('reporttitle') + '",' +
            '"text_footer_1_text": "' + document.getElementById('setting_input_reportfooter1').value + '",' +
            '"text_footer_2_text": "' + document.getElementById('setting_input_reportfooter2').value + '",' +
            '"text_footer_3_text": "' + document.getElementById('setting_input_reportfooter3').value + '",' +
            '"text_footer_align": "' + align_button_value('reportfooter') + '",' +

            '"prayer_method_select_id": ' + document.getElementById('setting_select_method').selectedIndex + ',' +
            '"prayer_asr_method_select_id": ' + document.getElementById('setting_select_asr').selectedIndex + ',' +
            '"prayer_high_latitude_adjustment_select_id": ' + document.getElementById('setting_select_highlatitude').selectedIndex + ',' +
            '"prayer_time_format_select_id": ' + document.getElementById('setting_select_timeformat').selectedIndex + ',' +
            '"prayer_hijri_date_adjustment_select_id": ' + document.getElementById('setting_select_hijri_adjustment').selectedIndex + ',' +
            '"prayer_fajr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_fajr').selectedIndex + ',' +
            '"prayer_dhuhr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_dhuhr').selectedIndex + ',' +
            '"prayer_asr_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_asr').selectedIndex + ',' +
            '"prayer_maghrib_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_maghrib').selectedIndex + ',' +
            '"prayer_isha_iqamat_select_id": ' + document.getElementById('setting_select_report_iqamat_title_isha').selectedIndex + ',' +
            '"prayer_column_imsak_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked) + ',' +
            '"prayer_column_sunset_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked) + ',' +
            '"prayer_column_midnight_checked": ' + boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked) + ',' +
            '"prayer_column_fast_start_end_select_id": ' + document.getElementById('setting_select_report_show_fast_start_end').selectedIndex +
            '}';

        fetch(global_rest_url_base + global_rest_user_account_provider + profile_id +
                '?lang_code=' + document.getElementById('setting_select_locale').value, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global_rest_at
                },
                body: json_data
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(json) {
                if (status == 200) {
                    json = JSON.parse(json);
                    var result_id = json.items[0].id;
                    var result_bio = get_null_or_value(json.items[0].bio);
                    user_id.innerHTML = result_id;
                    document.getElementById('user_logged_in').style.display = "block";
                    document.getElementById('setting_avatar_logged_in').src = profile_image;

                    update_settings_icon(profile_image);

                    document.getElementById('setting_bio_logged_in').innerHTML = result_bio;
                    document.getElementById('setting_data_username_logged_in').innerHTML = profile_username_logged_in;

                    document.getElementById('popup_menu_login').style.display = 'none';
                    document.getElementById('popup_menu_signup').style.display = 'none';
                    document.getElementById('popup_menu_logoff').style.display = 'block';
                    document.getElementById('dialogue_login').style.visibility = 'hidden';
                    document.getElementById('dialogue_signup').style.visibility = 'hidden';
                    //Show user tab
                    document.getElementById('tab7_nav').style.display = 'block';
                    user_settings_get(user_id.innerHTML).then(function(){
                        user_settings_load().then(function(){
                            settings_translate(true).then(function(){
                                settings_translate(false).then(function(){
                                    app_show();
                                })
                            })
                        })
                    });
                } else {
                    if (status == 401)
                        user_logoff();
                    else
                        alert(responseText_get_error('updateProviderUser', json));
                }
            })
            .catch(function(error) {
                alert(responseText_get_error('updateProviderUser', error));
            });
    }
    return null;
}

function onProviderSignIn(googleUser) {
    var profile;
    var profile_id;
    var profile_image_url;
    var profile_first_name;
    var profile_last_name;
    var profile_email;
    var provider_no;
    if (googleUser) {
        provider_no = 1;
        profile = googleUser.getBasicProfile();
        profile_id = profile.getId();
        profile_image_url = profile.getImageUrl();
        profile_first_name = profile.getGivenName();
        profile_last_name = profile.getFamilyName();
        profile_email = profile.getEmail();
        updateProviderUser(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email);
    } else {
        provider_no = 2;
        FB.getLoginStatus(function(response) {
            //statusChangeCallback(response);
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me?fields=id,first_name,last_name,picture, email', function(response) {
                        profile_id = response.id;
                        profile_image_url = response.picture.data.url;
                        profile_first_name = response.first_name;
                        profile_last_name = response.last_name;
                        profile_email = response.email;
                        updateProviderUser(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email);
                    });
                } else
                    console.log('User cancelled login or did not fully authorize.');
            });
        });
    }
    return null;
}

function update_info(info) {
    //use dynamic variable name
    fetch(eval('global_info_link' + info + '_url'))
        .then(function(response) {
            return response.text();
        })
        .then(function(result) {
            // put file content as div content
            //file should not have html,head or body tags
            document.getElementById('info' + info).innerHTML = result;
            switch (info) {
                ///info/privacy_policy.html
                case 1:
                    {
                        document.getElementById('policy_app_name1').innerHTML = global_app_name;
                        document.getElementById('policy_app_name2').innerHTML = global_app_name;
                        document.getElementById('policy_app_hostname').href = global_app_hostname;
                        document.getElementById('policy_app_hostname').innerText = global_app_hostname;
                        document.getElementById('policy_app_email').href = 'mailto:' + global_app_email_policy;
                        document.getElementById('policy_app_email').innerText = global_app_email_policy;
                        break;
                    }
                    //info/disclaimer.html
                case 2:
                    {
                        document.getElementById('disclaimer_app_name1').innerHTML = global_app_name;
                        document.getElementById('disclaimer_app_name2').innerHTML = global_app_name;
                        document.getElementById('disclaimer_app_name3').innerHTML = global_app_name;
                        document.getElementById('disclaimer_app_email').href = 'mailto:' + global_app_email_disclaimer;
                        document.getElementById('disclaimer_app_email').innerText = global_app_email_disclaimer;
                        break;
                    }
                    //info/terms.html
                case 3:
                    {
                        document.getElementById('terms_app_name').innerHTML = global_app_name;
                        document.getElementById('terms_app_hostname').href = global_app_hostname;
                        document.getElementById('terms_app_hostname').innerText = global_app_hostname;
                        document.getElementById('terms_app_email').href = 'mailto:' + global_app_email_terms;
                        document.getElementById('terms_app_email').innerText = global_app_email_terms;
                        break;
                    }
                    //info/support.html
                case 4:
                    {
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        });
    return null;
};

function show_dialogue(dialogue, file = '') {
    //dialogue values: INFO, VERIFY, SCAN, LOGIN
    switch (dialogue) {
        case 'INFO':
            {
                //show info (not about that will be created later task) code...
                //close settings
                document.getElementById('settings').style.visibility = 'hidden';
                document.getElementById('dialogue_info').style.visibility = 'visible';
                document.getElementById('app_copyright').innerHTML = global_app_copyright;
                //show social links in window_preview_report div
                if (global_app_social_link1_url!=null)
                    document.getElementById('social_link1').innerHTML = `<a href=${global_app_social_link1_url} target='_blank'>${global_app_social_link1_name}</a>`;
                if (global_app_social_link2_url!=null)
                    document.getElementById('social_link2').innerHTML = `<a href=${global_app_social_link2_url} target='_blank'>${global_app_social_link2_name}</a>`;
                if (global_app_social_link3_url!=null)
                    document.getElementById('social_link3').innerHTML = `<a href=${global_app_social_link3_url} target='_blank'>${global_app_social_link3_name}</a>`;
                if (global_app_social_link4_url!=null)
                    document.getElementById('social_link4').innerHTML = `<a href=${global_app_social_link4_url} target='_blank'>${global_app_social_link4_name}</a>`;
                // show info in window_info div
                document.getElementById('info_link1').innerHTML = `<a href='#info1' onclick='document.getElementById("window_info").style.display = "block";'> ${global_info_link1_name} </a>`;
                document.getElementById('info_link2').innerHTML = `<a href='#info2' onclick='document.getElementById("window_info").style.display = "block";'> ${global_info_link2_name} </a>`;
                document.getElementById('info_link3').innerHTML = `<a href='#info3' onclick='document.getElementById("window_info").style.display = "block";'> ${global_info_link3_name} </a>`;
                document.getElementById('info_link4').innerHTML = `<a href='#info4' onclick='document.getElementById("window_info").style.display = "block";'> ${global_info_link4_name} </a>`;
                document.getElementById('info_link5').innerHTML = `<a href='#info5' onclick='document.getElementById("window_info").style.display = "block";'> ${global_info_link5_name} </a>`;
                break;
            }
        case 'VERIFY':
            {
                //hide dialogue_signup
                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                //show_user_verify
                document.getElementById('dialogue_user_verify').style.visibility = 'visible';
                break;
            }
        case 'SCAN':
            {
                //show_scan_open_mobile
                //do not show on mobile
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    return null;
                //show once and store variable in localstorage
                if (!localStorage.scan_open_mobile) {
                    localStorage.setItem('scan_open_mobile', true);
                    document.getElementById('dialogue_scan_open_mobile').style.visibility = 'visible';
                    create_qr('scan_open_mobile_qrcode', `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}`);
                };
                break;
            }
        case 'LOGIN':
            {
                //show_login
                document.getElementById('dialogue_login').style.visibility = 'visible';
                document.getElementById('dialogue_signup').style.visibility = 'hidden';
                document.getElementById('login_username').focus();
                break;
            }
        case 'SIGNUP':
            {
                //show_signup
                document.getElementById('dialogue_signup').style.visibility = 'visible';
                document.getElementById('dialogue_login').style.visibility = 'hidden';
                document.getElementById('signup_username').focus();
                break;
            }
        case 'CONFIRM_DELETE':
            {
                //show_user_verify
                document.getElementById('dialogue_confirm_delete').style.visibility = 'visible';
                break;
            }
    }
    return null;
};

function update_ui(option, item_id=null) {
    var settings = {
        paper                   : document.getElementById('paper'),
        timezone_report         : document.getElementById('setting_select_report_timezone'),
        maptype                 : document.getElementById('setting_select_maptype'),
        country                 : document.getElementById('setting_select_country'),
        city                    : document.getElementById('setting_select_city'),
        select_place            : document.getElementById('setting_select_popular_place'),
        gps_lat_input           : document.getElementById('setting_input_lat'),
        gps_long_input          : document.getElementById('setting_input_long'),
        paper_size              : document.getElementById('setting_select_report_papersize').value,
        reportheader_input      : document.getElementById('setting_input_reportheader_img'),
        reportfooter_input      : document.getElementById('setting_input_reportfooter_img'),
        header_preview_img_item : document.getElementById('setting_reportheader_img'),
        footer_preview_img_item : document.getElementById('setting_reportfooter_img'),
        button_active_class     : 'setting_button_active',
        reportheader_aleft      : document.getElementById('setting_input_reporttitle_aleft'),
        reportheader_acenter    : document.getElementById('setting_input_reporttitle_acenter'),
        reportheader_aright     : document.getElementById('setting_input_reporttitle_aright'),
        reportfooter_aleft      : document.getElementById('setting_input_reportfooter_aleft'),
        reportfooter_acenter    : document.getElementById('setting_input_reportfooter_acenter'),
        reportfooter_aright     : document.getElementById('setting_input_reportfooter_aright'),
        select_user_setting     : document.getElementById('setting_select_user_setting')
    };

    switch (option) {
        //Regional, timezone current
        case 1:
            {
                //showcurrenttime already in interval no need to recreate intervall
                //Update current date and time for chosen locale and timezone format;
                //clearInterval(showcurrenttime);
                //setInterval(showcurrenttime, 1000);

                //Update user edit info in case user is changing timezone while editing user
                if (document.getElementById('user_edit').style.display == 'block') {
                    //call twice, 
                    //first will hide and reset values
                    user_edit();
                    //second will fetch info again
                    user_edit();
                }
                break;
            }
        //Regional, timezone report
        case 2:
            {
                //Update report date and time for current locale, report timezone format
                clearInterval(showreporttime);
                setInterval(showreporttime, 1000);
                break;
            }
        //Regional, update font, arabic script
        case 3:
            {
                var select = document.getElementById('setting_select_report_arabic_script');
                var prefix = 'font_';
                document.getElementById('toolbar_top').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('settings').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('profile').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('profile_top').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('dialogues').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('window_info').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('toolbar_bottom').classList = prefix + select[select.selectedIndex].value;
                break;
            }
        //GPS, update map
        case 4:
            {
                global_map_mymap.setStyle(global_map_style_baseurl + settings.maptype.value);
                update_map(settings.gps_long_input.value,
                    settings.gps_lat_input.value,
                    global_map_default_zoom, //default zoom
                    document.getElementById('setting_input_place').value, //text1
                    document.getElementById('setting_label_report_timezone').innerHTML, //text2
                    tzlookup(settings.gps_lat_input.value, settings.gps_long_input.value), //text3
                    global_map_marker_div_gps, //marker for GPS
                    global_map_jumpto);
                break;
            }
        //GPS, update cities from country
        case 5:
            {
                //remove old list: 
                //var old_groups = settings.city.getElementsByTagName('optgroup');
                //for (var old_index = old_groups.length - 1; old_index >= 0; old_index--)
                //    settings.city.removeChild(old_groups[old_index])
                settings.city.innerHTML=`<option value='' id='' label='…' selected='selected'>…</option>`;
                SearchAndSetSelectedIndex('', settings.select_place,0);
                if (settings.country[settings.country.selectedIndex].getAttribute('country_code')!=''){
                    var status;
                    fetch(global_service_worldcities + '/' + settings.country[settings.country.selectedIndex].getAttribute('country_code').toUpperCase() +
                            '?app_id=' + global_app_id +
                            '&app_user_id=' + document.getElementById('setting_data_userid_logged_in').innerHTML +
                            '&lang_code=' + document.getElementById('setting_select_locale').value, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + global_rest_dt,
                        }
                    })
                    .then(function(response) {
                        status = response.status;
                        return response.text();
                    })
                    .then(function(result) {
                        if (status === 200) {
                            let json = JSON.parse(result);
                            json.sort(function(a, b) {
                                var x = a.admin_name.toLowerCase() + a.city.toLowerCase();
                                var y = b.admin_name.toLowerCase() + b.city.toLowerCase();
                                if (x < y) {
                                    return -1;
                                }
                                if (x > y) {
                                    return 1;
                                }
                                return 0;
                            });
    
                            var current_admin_name;
                            //fill list with cities
                            let cities='';
                            for (var i = 0; i < json.length; i++) {
                                if (i == 0) {
                                    cities += `<option value='' id='' label='…' selected='selected'>…</option>
                                               <optgroup label='${json[i].admin_name}'>`;
                                    current_admin_name = json[i].admin_name;
                                } else
                                if (json[i].admin_name != current_admin_name) {
                                    cities += `</optgroup>
                                               <optgroup label='${json[i].admin_name}'>`;
                                    current_admin_name = json[i].admin_name;
                                }
                                cities +=
                                `<option 
                                    id=${json[i].id} 
                                    value=${i + 1}
                                    countrycode=${json[i].iso2}
                                    country='${json[i].country}'
                                    admin_name='${json[i].admin_name}'
                                    latitude=${json[i].lat}
                                    longitude=${json[i].lng}  
                                    >${json[i].city}
                                </option>`;
                            }
                            settings.city.innerHTML = `${cities} </optgroup>`;
                            document.getElementById('setting_input_place').value = '';
                        }
                        else {
                            if (status == 401)
                                user_logoff();
                        }
                    })
                } 
                break;
            }
        //GPS, city
        case 6:
            {
                if (settings.city.id != '') {
                    
                    //set GPS and timezone
                    var longitude_selected = settings.city[settings.city.selectedIndex].getAttribute('longitude');
                    var latitude_selected = settings.city[settings.city.selectedIndex].getAttribute('latitude');
                    var timezone_selected = tzlookup(latitude_selected, longitude_selected);
                    settings.gps_long_input.value = longitude_selected;
                    settings.gps_lat_input.value = latitude_selected;

                    //Use city + country from list
                    document.getElementById('setting_input_place').value =
                        settings.city.options[settings.city.selectedIndex].text + ', ' +
                        settings.country.options[settings.country.selectedIndex].text;
                    //display empty popular place select
                    SearchAndSetSelectedIndex('', settings.select_place,0);
                    //Update map
                    update_map(settings.gps_long_input.value,
                        settings.gps_lat_input.value,
                        global_map_default_zoom_city, //zoom for cities
                        document.getElementById('setting_input_place').value, //text1
                        document.getElementById('setting_label_report_timezone').innerHTML, //text2
                        timezone_selected, //text3
                        global_map_marker_div_city, //marker for cities
                        global_map_flyto);
                    settings.timezone_report.value = timezone_selected;
                }
                break;
            }
        //GPS, popular places
        case 7:
            {
                if (settings.select_place.id != '') {
                    //set GPS and timezone
                    var longitude_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('longitude');
                    var latitude_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('latitude');
                    var timezone_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('timezone');
                    settings.gps_long_input.value = longitude_selected;
                    settings.gps_lat_input.value = latitude_selected;
                    //Update map
                    update_map(settings.gps_long_input.value,
                        settings.gps_lat_input.value,
                        global_map_default_zoom_pp, //zoom for popular places
                        settings.select_place.options[settings.select_place.selectedIndex].text, //text1
                        document.getElementById('setting_label_report_timezone').innerHTML, //text2
                        timezone_selected, //text3
                        global_map_marker_div_pp, //marker for popular places
                        global_map_flyto);
                    settings.timezone_report.value = timezone_selected;

                    //display empty country
                    SearchAndSetSelectedIndex('', settings.country,0);
                    //remove old city list:            
                    var old_groups = settings.city.getElementsByTagName('optgroup');
                    for (var old_index = old_groups.length - 1; old_index >= 0; old_index--)
                        settings.city.removeChild(old_groups[old_index])
                    //display first empty city
                    SearchAndSetSelectedIndex('', settings.city,0);
                    var title = settings.select_place.options[settings.select_place.selectedIndex].text;
                    document.getElementById('setting_input_place').value = title;
                }
                break;
            }
        //GPS, updating place
        case 8:
            {
                update_map_popup();
                map_show_qibbla();
                break;
            }
        //GPS, position
        case 9:
            {
                SearchAndSetSelectedIndex('', settings.select_place,0);
                get_place_from_gps(settings.gps_lat_input.value, settings.gps_long_input.value).then(function(){
                    //Update map
                    update_map(settings.gps_long_input.value,
                        settings.gps_lat_input.value,
                        '', //do not change zoom 
                        document.getElementById('setting_input_place').value, //text1
                        document.getElementById('setting_label_report_timezone').innerHTML, //text2
                        tzlookup(settings.gps_lat_input.value, settings.gps_long_input.value), //text3
                        global_map_marker_div_gps,
                        global_map_jumpto);
                    settings.timezone_report.value = tzlookup(settings.gps_lat_input.value, settings.gps_long_input.value);

                    //display empty country
                    SearchAndSetSelectedIndex('', settings.country,0);
                    //remove old city list:            
                    var old_groups = settings.city.getElementsByTagName('optgroup');
                    for (var old_index = old_groups.length - 1; old_index >= 0; old_index--)
                        settings.city.removeChild(old_groups[old_index])
                        //display first empty city
                    SearchAndSetSelectedIndex('', settings.city,0);
                })
                break;
            }
        //Design, paper size
        case 10:
            {
                switch (settings.paper_size) {
                    case 'A4':
                        {
                            settings.paper.className='A4';
                            break;
                        }
                    case 'Letter':
                        {
                            settings.paper.className='Letter';
                            break;
                        }
                    default:
                        break;
                }
                create_user_settings_links(settings.select_user_setting[settings.select_user_setting.selectedIndex].getAttribute('user_account_id'),
                                           settings.select_user_setting[settings.select_user_setting.selectedIndex].getAttribute('id'));
                break;
            }
        //11=Image, Report header image load
	    case 11:
            {
                var resheader = show_image(settings.header_preview_img_item, item_id);
                break;
            }
        //12=Image, Report header image clear
	    case 12:
            {
                recreate_img(settings.header_preview_img_item);
                //doesnt work:
                //settings.header_preview_img_item.src = '';
                settings.reportheader_input.value = '';
                break;
            }
        //13=Image, Report footer image load
	    case 13:
            {
                var resfooter = show_image(settings.footer_preview_img_item, item_id);
                break;
            }
        //14=Image, Report footer image clear
        case 14:
            {
                recreate_img(settings.footer_preview_img_item);
                //doesnt work:
                //settings.footer_preview_img_item.src = '';
                settings.reportfooter_input.value = '';
                break;
            }
        //15=Texts, Report header align
	    case 15:
            {
                //check if clicking on button that is already active then deactivate so no alignment
                if (document.getElementById(item_id).classList.contains(settings.button_active_class)){
                    document.getElementById(item_id).classList.remove(settings.button_active_class)
                }
                else{	
                    settings.reportheader_aleft.classList.remove(settings.button_active_class);
                    settings.reportheader_acenter.classList.remove(settings.button_active_class);
                    settings.reportheader_aright.classList.remove(settings.button_active_class);
                    document.getElementById(item_id).classList.add(settings.button_active_class);
                }
                break;
            }
        //16=Texts, Report footer align
        case 16:
            {
                //check if clicking on button that is already active then deactivate so no alignment
                if (document.getElementById(item_id).classList.contains(settings.button_active_class)){
                    document.getElementById(item_id).classList.remove(settings.button_active_class)
                }
                else{
                    settings.reportfooter_aleft.classList.remove(settings.button_active_class);
                    settings.reportfooter_acenter.classList.remove(settings.button_active_class);
                    settings.reportfooter_aright.classList.remove(settings.button_active_class);
                    document.getElementById(item_id).classList.add(settings.button_active_class);
                }
                break;
            }
        //Prayer, method
        case 17:
            {
                var method = document.getElementById('setting_select_method').value;
                var suffix;

                document.getElementById('setting_method_param_fajr').innerHTML = '';
                document.getElementById('setting_method_param_isha').innerHTML = '';
                if (typeof global_praytimes_methods[method].params.fajr == 'string')
                    suffix = '';
                else
                    suffix = '°';
                document.getElementById('setting_method_param_fajr').innerHTML = 'Fajr:' + global_praytimes_methods[method].params.fajr + suffix;
                if (typeof global_praytimes_methods[method].params.isha == 'string')
                    suffix = '';
                else
                    suffix = '°';
                document.getElementById('setting_method_param_isha').innerHTML = 'Isha:' + global_praytimes_methods[method].params.isha + suffix;
                break;
            }
    }

}

function get_report_url(id, sid, papersize){
    
    return `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}${global_service_report}` +
         `?app_id=${global_app_id}` +
         `&id=${id}` +
         `&sid=${sid}` +
         `&ps=${papersize}` +
         `&hf=0`;
}
/*------------------------------------- */
// Profile function
/*------------------------------------- */
/* call 
	profile_show() 					from popupmenu
	profile_show(userid) 			from choosing profile in profile_detail
	profile_show(null, username) 	from init startup when user enters url*/
function profile_show(user_account_id_other = null, username = null) {
    var status;
    var json;
    var row;
    var col;
    var item;
    var user_account_id_search;
    var url;

    document.getElementById('profile_info').style.display = "none";
    document.getElementById('profile_top').style.display = "none";
    document.getElementById('profile_detail').style.display = "none";
    document.getElementById('profile').style.visibility = "visible";

    //empty search
    document.getElementById('profile_search_input').value = '';
    document.getElementById('profile_search_list').style.display = "none";
    document.getElementById('profile_search_list').innerHTML = '';

    var user_id = document.getElementById('setting_data_userid_logged_in');
    if (user_account_id_other == null && user_id.innerHTML == '' && username == null) {
        //empty except profile top, always visible even not logged in
        document.getElementById('profile_main').style.display = "none";
        document.getElementById('profile_avatar').src = '';
        document.getElementById('profile_username').innerHTML = '';
        document.getElementById('profile_bio').innerHTML = '';
        document.getElementById('profile_joined_date').innerHTML = '';
        document.getElementById('profile_follow').children[0].style.display = 'block';
        document.getElementById('profile_follow').children[1].style.display = 'none';
        document.getElementById('profile_like').children[0].style.display = 'block';
        document.getElementById('profile_like').children[1].style.display = 'none';

        document.getElementById('profile_info_following_count').innerHTML = '';
        document.getElementById('profile_info_followers_count').innerHTML = '';
        document.getElementById('profile_info_likes_count').innerHTML = '';
        document.getElementById('profile_qr').innerHTML = '';

        document.getElementById('profile_detail').style.display = "none";
        document.getElementById('profile_detail_list').innerHTML = '';

        document.getElementById('profile_user_settings_public').style.display = "none";
        document.getElementById('profile_user_settings_rows').innerHTML = '';
        document.getElementById('profile_user_settings_private').style.display = "none";
    } else {
        if (user_account_id_other !== null) {
            user_account_id_search = user_account_id_other;
            url = global_rest_url_base + global_rest_user_account_profile_userid + user_account_id_search;
        } else
        if (username !== null) {
            user_account_id_search = '';
            url = global_rest_url_base + global_rest_user_account_profile_username + username;
        } else {
            user_account_id_search = user_id.innerHTML;
            url = global_rest_url_base + global_rest_user_account_profile_userid + user_account_id_search;
        }
        //PROFILE MAIN
        var json_data =
            '{' +
            '"app_id":' + global_app_id + ',' +
            '"client_longitude": "' + global_user_gps_longitude + '",' +
            '"client_latitude": "' + global_user_gps_latitude + '"' +
            '}';
        fetch(url + 
                '?id=' + user_id.innerHTML +
                '&lang_code=' + document.getElementById('setting_select_locale').value, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global_rest_dt
                },
                body: json_data
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(response) {
                if (status == 200) {
                    json = JSON.parse(response);
                    document.getElementById('profile_info').style.display = "block";
                    document.getElementById('profile_main').style.display = "block";
                    document.getElementById('profile_id').innerHTML = json.id;

                    if (json.provider1_id == null && json.provider2_id == null) {
                        //show local user image
                        document.getElementById('profile_avatar').src = image_format(json.avatar);
                    } else
                    if (json.provider1_id !== null) {
                        //show provider 1 user image
                        document.getElementById('profile_avatar').src = image_format(json.provider1_image);
                    } else {
                        //show provider 2 user image
                        document.getElementById('profile_avatar').src = image_format(json.provider2_image);
                    }
                    if (json.provider1_id == null && json.provider2_id == null)
                    //show local username
                        document.getElementById('profile_username').innerHTML = json.username;
                    else
                    if (json.provider1_id !== null) {
                        //show provider 1 username
                        document.getElementById('profile_username').innerHTML = json.provider1_first_name;
                    } else {
                        //show provider 2 username
                        document.getElementById('profile_username').innerHTML = json.provider2_first_name;
                    }
                    document.getElementById('profile_bio').innerHTML = get_null_or_value(json.bio);
                    document.getElementById('profile_joined_date').innerHTML = format_json_date(json.date_created, true);
                    document.getElementById("profile_qr").innerHTML = '';
                    create_qr('profile_qr', `${location.protocol}//${location.hostname}${location.port==''?'':':' + location.port}/` + json.username);

                    document.getElementById('profile_info_following_count').innerHTML = json.count_following;
                    document.getElementById('profile_info_followers_count').innerHTML = json.count_followed;
                    document.getElementById('profile_info_likes_count').innerHTML = json.count_likes;
                    document.getElementById('profile_info_liked_count').innerHTML = json.count_liked;
                    document.getElementById('profile_info_user_setting_likes_count').innerHTML = json.count_user_setting_likes;
                    document.getElementById('profile_info_user_setting_liked_count').innerHTML = json.count_user_setting_liked;
                    document.getElementById('profile_info_view_count').innerHTML = json.count_views;

                    if (json.followed == 1) {
                        //followed
                        document.getElementById('profile_follow').children[0].style.display = 'none';
                        document.getElementById('profile_follow').children[1].style.display = 'block';
                    } else {
                        //not followed
                        document.getElementById('profile_follow').children[0].style.display = 'block';
                        document.getElementById('profile_follow').children[1].style.display = 'none';
                    }
                    if (json.liked == 1) {
                        //liked
                        document.getElementById('profile_like').children[0].style.display = 'none';
                        document.getElementById('profile_like').children[1].style.display = 'block';
                    } else {
                        //not liked
                        document.getElementById('profile_like').children[0].style.display = 'block';
                        document.getElementById('profile_like').children[1].style.display = 'none';
                    }
                    if (json.private && parseInt(user_id.innerHTML) !== json.id) {
                        //private
                        document.getElementById('profile_user_settings_public').style.display = "none";
                        document.getElementById('profile_user_settings_private').style.display = "block";
                    } else {
                        //public
                        document.getElementById('profile_user_settings_public').style.display = "block";
                        document.getElementById('profile_user_settings_private').style.display = "none";
                    }
                    profile_show_user_setting();
                } else {
                    if (status == 500 && username !== null) {
                        document.getElementById('profile').style.visibility = 'hidden';
                        //refresh webpage without not found username
                        //this does not occur in webapp
                        document.location.href = "/";
                    }
                }
            })
            .catch(function(error) {
                alert(responseText_get_error('profile_show', error));
            });
    }

    return null;
}

function profile_show_user_setting() {
    var user_id = document.getElementById('setting_data_userid_logged_in');
    var status;
    if (document.getElementById('profile_user_settings_public').style.display == "block") {
        document.getElementById('profile_user_settings_title_row').style.display = 'block';
        document.getElementById('profile_user_settings_rows').style.display = 'block';

        fetch(global_rest_url_base + global_rest_app_timetables_user_setting_profile + document.getElementById('profile_id').innerHTML + 
                '?id=' + user_id.innerHTML + 
                '&app_id=' + global_app_id +
                '&lang_code=' + document.getElementById('setting_select_locale').value,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_dt
                }
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(response) {
                if (status == 200) {
                    json = JSON.parse(response);
                    var user_settings = document.getElementById('profile_user_settings_rows');
                    user_settings.innerHTML = '';
                    let html ='';
                    for (i = 0; i < json.count; i++) {
                        var paper_size_select = document.getElementById('setting_select_report_papersize');
                        var common_url = get_report_url(json.items[i].user_account_id, 
                                                        json.items[i].id, 
                                                        paper_size_select.options[json.items[i].design_paper_size_select_id].value) + 
                                                        '&format=html';
                        html += 
                        `<div class='profile_user_settings_row'>
                            <div class='profile_user_settings_place'>${json.items[i].description}
                            </div>
                            <div class='profile_user_settings_day'>
                                <a href='#' onclick="document.getElementById('window_preview_report').style.visibility = 'visible';create_qr('window_preview_toolbar_qr', '${common_url}&type=0');updateViewStat(${json.items[i].id},${json.items[i].user_account_id});document.getElementById('window_preview_content').src='${common_url}&type=0' ">
                                    <i class='fas fa-calendar-day'></i>
                                </a>
                            </div>
                            <div class='profile_user_settings_month'>
                                <a href='#' onclick="document.getElementById('window_preview_report').style.visibility = 'visible';create_qr('window_preview_toolbar_qr', '${common_url}&type=1');updateViewStat(${json.items[i].id},${json.items[i].user_account_id});document.getElementById('window_preview_content').src='${common_url}&type=1' ">
                                    <i class='fas fa-calendar-week'></i>
                                </a>
                            </div>
                            <div class='profile_user_settings_year'>
                                <a href='#' onclick="document.getElementById('window_preview_report').style.visibility = 'visible';create_qr('window_preview_toolbar_qr', '${common_url}&type=2');updateViewStat(${json.items[i].id},${json.items[i].user_account_id});document.getElementById('window_preview_content').src='${common_url}&type=2' ">
                                    <i class='fas fa-calendar-alt'></i>
                                </a>
                            </div>
                            <div class='profile_user_settings_like' onclick='user_function("LIKE_USER_SETTING",${json.items[i].id},this)'>
                                <i class='fas fa-heart-broken' style='display:${json.items[i].liked == 1?'none':'block'}'></i>
                                <i class='fas fa-heart' style='display:${json.items[i].liked == 1?'block':'none'}'></i>
                            </div>
                            <div class='profile_user_settings_info_likes'>
                                <i class='fas fa-heart'></i>
                                <div class='profile_user_settings_info_like_count'>${json.items[i].count_likes}</div>
                            </div>
                            <div class='profile_user_settings_info_views'>
                                <i class='fas fa-eye'></i>
                                <div class='profile_user_settings_info_view_count'>${json.items[i].count_views}</div>
                            </div>
                        </div>`;

                    }
                    user_settings.innerHTML = html;
                }
            })
            .catch(function(error) {
                alert(responseText_get_error('profile_show', error));
            });
    }
}

function profile_detail(detailchoice) {
    var status;
    var user_id = document.getElementById('setting_data_userid_logged_in');
    //DETAIL
    //show only if user logged in
    if (parseInt(user_id.innerHTML) || 0 !== 0) {
        //document.getElementById('profile_detail').style.display = "block";
        switch (detailchoice) {
            case 1:
                {
                    //Following
                    document.getElementById('profile_user_settings_title_row').style.display = 'none';
                    document.getElementById('profile_user_settings_rows').style.display = 'none';
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'block';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_like').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_liked').style.display = 'none';
                    break;
                }
            case 2:
                {
                    //Followed
                    document.getElementById('profile_user_settings_title_row').style.display = 'none';
                    document.getElementById('profile_user_settings_rows').style.display = 'none';
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'block';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_like').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_liked').style.display = 'none';
                    break;
                }
            case 3:
                {
                    //Like user
                    document.getElementById('profile_user_settings_title_row').style.display = 'none';
                    document.getElementById('profile_user_settings_rows').style.display = 'none';
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'block';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_like').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_liked').style.display = 'none';

                    break;
                }
            case 4:
                {
                    //Liked user
                    document.getElementById('profile_user_settings_title_row').style.display = 'none';
                    document.getElementById('profile_user_settings_rows').style.display = 'none';
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'block';
                    document.getElementById('profile_detail_header_user_setting_like').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_liked').style.display = 'none';
                    break;
                }
            case 5:
                {
                    //Like user setting
                    document.getElementById('profile_user_settings_title_row').style.display = 'none';
                    document.getElementById('profile_user_settings_rows').style.display = 'none';
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_like').style.display = 'block';
                    document.getElementById('profile_detail_header_user_setting_liked').style.display = 'none';
                    break;
                }
            case 6:
                {
                    //Liked user setting
                    document.getElementById('profile_user_settings_title_row').style.display = 'none';
                    document.getElementById('profile_user_settings_rows').style.display = 'none';
                    document.getElementById('profile_detail').style.display = 'block';
                    document.getElementById('profile_detail_header_following').style.display = 'none';
                    document.getElementById('profile_detail_header_followed').style.display = 'none';
                    document.getElementById('profile_detail_header_like').style.display = 'none';
                    document.getElementById('profile_detail_header_liked').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_like').style.display = 'none';
                    document.getElementById('profile_detail_header_user_setting_liked').style.display = 'block';
                    break;
                }
            default:
                break;
        }
        fetch(global_rest_url_base + global_rest_user_account_profile_detail + document.getElementById('profile_id').innerHTML +
                '?detailchoice=' + detailchoice + 
                '&app_id=' + global_app_id +
                '&lang_code=' + document.getElementById('setting_select_locale').value, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + global_rest_at
                }
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(response) {
                if (status == 200) {
                    json = JSON.parse(response);
                    var profile_detail_list = document.getElementById('profile_detail_list');
                    profile_detail_list.innerHTML = '';

                    let html = '';
                    let image = '';
                    let name='';
                    for (i = 0; i < json.count; i++) {
                        //select image
                        if (json.items[i].provider1_id == null && json.items[i].provider2_id == null) {
                            //show local user image
                            image = image_format(json.items[i].avatar);
                        } 
                        else
                            if (json.items[i].provider1_id !== null) {
                                //show provider 1 user image
                                image = image_format(json.items[i].provider1_image);
                            } 
                            else {
                                //show provider 2 user image
                                image = image_format(json.items[i].provider2_image);
                            }
                        //select name
                        if (json.items[i].provider1_id == null && json.items[i].provider2_id == null){
                            //show local username
                            name = json.items[i].username;
                        }   
                        else
                            if (json.items[i].provider1_id !== null) {
                                //show provider 1 username
                                name = json.items[i].provider1_first_name;
                            } 
                            else {
                                //show provider 2 username
                                name = json.items[i].provider2_first_name;
                            }

                        html += 
                        `<div class='profile_detail_list_row'>
                            <div class='profile_detail_list_col'>
                                <div class='profile_detail_list_user_account_id'>${json.items[i].id}</div>
                            </div>
                            <div class='profile_detail_list_col'>
                                <img class='profile_detail_list_avatar' src='${image}'>
                            </div>
                            <div class='profile_detail_list_col'>
                                <div class='profile_detail_list_username'>
                                    <a href='#' onclick='profile_show(${json.items[i].id})'>${name}</a>
                                </div>
                            </div>
                        </div>`;

                    }
                    profile_detail_list.innerHTML = html;
                } else {
                    if (status == 401)
                        user_logoff();
                    else
                        alert(responseText_get_error('profile_detail', response));
                }
            })
            .catch(function(error) {
                alert(responseText_get_error('profile_detail', error));
            });
    } else
        show_dialogue('LOGIN');
}

function profile_top(statschoice) {
    var status;
    //TOP
    //document.getElementById('profile_top').style.display = "block";
    fetch(global_rest_url_base + global_rest_user_account_profile_top + statschoice + 
            '?app_id=' + global_app_id +
            '&lang_code=' + document.getElementById('setting_select_locale').value, 
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + global_rest_dt
            }
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                json = JSON.parse(response);
                var profile_top_list = document.getElementById('profile_top_list');
                profile_top_list.innerHTML = '';
                let html ='';
                let image='';
                let name='';
                for (i = 0; i < json.count; i++) {
                    //select image
                    if (json.items[i].provider1_id == null && json.items[i].provider2_id == null) {
                        //show local user image
                        image = image_format(json.items[i].avatar);
                    } else
                    if (json.items[i].provider1_id !== null) {
                        //show provider 1 user image
                        image = image_format(json.items[i].provider1_image);
                    } else {
                        //show provider 2 user image
                        image = image_format(json.items[i].provider2_image);
                    }
                    //select username
                    if (json.items[i].provider1_id == null && json.items[i].provider2_id == null) {
                        //show local username
                        name = json.items[i].username;
                    } else
                    if (json.items[i].provider1_id !== null) {
                        //show provider 1 username
                        name = json.items[i].provider1_first_name;
                    } else {
                        //show provider 2 username
                        name = json.items[i].provider2_first_name;
                    }
                    html +=
                    `<div class='profile_top_list_row'>
                        <div class='profile_top_list_col'>
                            <div class='profile_top_list_user_account_id'>${json.items[i].id}</div>
                        </div>
                        <div class='profile_top_list_col'>
                            <img class='profile_top_list_avatar' src='${image}'>
                        </div>
                        <div class='profile_top_list_col'>
                            <div class='profile_top_list_username'>
                                <a href='#' onclick='profile_show(${json.items[i].id})'>${name}</a>
                            </div>
                        </div>
                        <div class='profile_top_list_col'>
                            <div class='profile_top_list_count'>${json.items[i].count}</div>
                        </div>
                    </div>`;
                }
                profile_top_list.innerHTML = html;
            }
        })
        .catch(function(error) {
            alert(responseText_get_error('profile_top', error));
        });
}

function user_function(user_function, user_setting_id, row_div) {
    var status;
    var user_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    var user_id_profile = document.getElementById('profile_id').innerHTML;
    var json_data;
    var method;
    var item0;
    var item1;
    var div_id;
    var rest_path;
    var check_div;
    switch (user_function) {
        case 'FOLLOW':
            {
                div_id = 'profile_follow';
                rest_path = global_rest_user_account_follow;
                json_data = '{"user_account_id":' + user_id_profile + '}';
                check_div = document.getElementById(div_id);
                break;
            }
        case 'LIKE':
            {
                div_id = 'profile_like';
                rest_path = global_rest_user_account_like;
                json_data = '{"user_account_id":' + user_id_profile + '}';
                check_div = document.getElementById(div_id);
                break;
            }
        case 'LIKE_USER_SETTING':
            {
                div_id = 'profile_user_settings_like';
                rest_path = global_rest_app_timetables_user_setting_like;
                json_data = '{"user_setting_id":' + user_setting_id + '}';
                check_div = row_div;
                break;
            }
    }

    if (user_id == '')
        show_dialogue('LOGIN');
    else {
        if (check_div.children[0].style.display == 'block') {
            method = 'POST';
            item0 = 'none';
            item1 = 'block';
        } else {
            method = 'DELETE';
            item0 = 'block';
            item1 = 'none';
        }
        fetch(global_rest_url_base + rest_path + user_id +
                '?lang_code=' + document.getElementById('setting_select_locale').value, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global_rest_at
                },
                body: json_data
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(response) {
                if (status == 200) {
                    json = JSON.parse(response);
                    if (user_function == 'LIKE_USER_SETTING') {
                        //update only user setting
                        profile_show_user_setting();
                    } else
                        profile_show(user_id_profile);
                } else {
                    if (status == 401)
                        user_logoff();
                    else
                        alert(responseText_get_error('user_function', response));
                }
            })
            .catch(function(error) {
                alert(responseText_get_error('profile_top', error));
            });
    }
}

function search_profile() {
    var status;
    var searched_username = document.getElementById('profile_search_input').value;
    var profile_search_list = document.getElementById('profile_search_list');
    profile_search_list.innerHTML = '';
    document.getElementById('profile_search_list').style.display = "none";
    var json_data = '{' +
        '"app_id":' + global_app_id + ',' +
        '"client_longitude": "' + global_user_gps_longitude + '",' +
        '"client_latitude": "' + global_user_gps_latitude + '"' +
        '}';
    fetch(global_rest_url_base + global_rest_user_account_profile_search + searched_username +
            '?lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                json = JSON.parse(response);
                if (json.count > 0)
                    document.getElementById('profile_search_list').style.display = "block";
                let html = '';
                let image= '';
                let name = '';
                profile_search_list.style.height = (json.count * 24).toString() + 'px';
                for (i = 0; i < json.count; i++) {
                    if (json.items[i].provider1_id == null && json.items[i].provider2_id == null) {
                        //show local user image
                        image = image_format(json.items[i].avatar);
                    }
                    else
                        if (json.items[i].provider1_id !== null) {
                            //show provider 1 user image
                            image = image_format(json.items[i].provider1_image);
                        } else {
                            //show provider 2 user image
                            image = image_format(json.items[i].provider2_image);
                        }
                    if (json.items[i].provider1_id == null && json.items[i].provider2_id == null){
                        //show local username
                        name  = json.items[i].username;
                    }
                    else
                        if (json.items[i].provider1_id !== null) {
                            //show provider 1 username
                            name = json.items[i].provider1_first_name;
                        } 
                        else {
                            //show provider 2 username
                            name = json.items[i].provider2_first_name;
                        }    
                    html +=
                    `<div class='profile_search_list_row'>
                        <div class='profile_search_list_col'>
                            <div class='profile_search_list_user_account_id'>${json.items[i].id}</div>
                        </div>
                        <div class='profile_search_list_col'>
                            <img class='profile_search_list_avatar' src='${image}'>
                        </div>
                        <div class='profile_search_list_col'>
                            <div class='profile_search_list_username'>
                                <a href='#' onclick='profile_show(${json.items[i].id})'>${name}</a>
                            </div>
                        </div>
                    </div>`;
                }
                profile_search_list.innerHTML = html;
            }
        })
        .catch(function(error) {
            alert(responseText_get_error('search_profile', error));
        });
}

function updateViewStat(user_setting_id, user_setting_user_account_id = null) {
    var status;
    var json_user_account_id;
    if (user_setting_user_account_id !== parseInt(document.getElementById('setting_data_userid_logged_in').innerHTML) ||
        document.getElementById('setting_data_userid_logged_in').innerHTML == '') {
        if (document.getElementById('setting_data_userid_logged_in').innerHTML == '')
            json_user_account_id = 'null';
        else
            json_user_account_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
        var json_data =
            '{' +
            '"user_account_id":' + json_user_account_id + ',' +
            '"user_setting_id":' + user_setting_id + ',' +
            '"client_longitude": "' + global_user_gps_longitude + '",' +
            '"client_latitude": "' + global_user_gps_latitude + '"' +
            '}';
        fetch(global_rest_url_base + global_rest_app_timetables_user_setting_view +
                '?lang_code=' + document.getElementById('setting_select_locale').value, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + global_rest_dt
                },
                body: json_data
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(response) {
                if (status == 200)
                    return null;
                else {
                    if (status == 401)
                        user_logoff();
                    else
                        alert(responseText_get_error('updateViewStat', response));
                }
            })
            .catch(function(error) {
                alert(responseText_get_error('search_profile', error));
            });
    }
}
/*------------------------------------- */
// init app function in index.html
/*------------------------------------- */
function app_log(app_module, app_module_type, app_module_request, app_user_id) {
    var status;
    var json_data =
        '{' +
        '"app_id":"' + global_app_id + '",' +
        '"app_module":"' + app_module + '",' +
        '"app_module_type":"' + '' + app_module_type + '",' +
        '"app_module_request":"' + app_module_request + '",' +
        '"app_module_result":"' + '",' +
        '"app_user_id":"' + '' + app_user_id + '",' +
        '"user_language": "' + navigator.language + '",' +
        '"user_timezone": "' + Intl.DateTimeFormat().resolvedOptions().timeZone + '",' +
        '"user_number_system": "' + Intl.NumberFormat().resolvedOptions().numberingSystem + '",' +
        '"user_platform": "' + navigator.platform + '",' +
        '"user_gps_latitude": "' + global_user_gps_latitude + '",' +
        '"user_gps_longitude": "' + global_user_gps_longitude + '"' +
        '}';

    fetch(global_rest_url_base + global_rest_app_log +
            '?lang_code=' + document.getElementById('setting_select_locale').value, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + global_rest_dt
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status === 200)
                return null;
            else
                return null;
        })
        .catch(function(error) {
            alert(responseText_get_error('app_log', error));
        });
}

async function init_common() {
    await get_token().then(function(){
        //set current date for report month
        global_currentDate = new Date();
        global_CurrentHijriDate = new Array();
        //get Hijri date from initial Gregorian date
        global_CurrentHijriDate[0] = parseInt(new Date(global_currentDate.getFullYear(),
            global_currentDate.getMonth(),
            global_currentDate.getDate()).toLocaleDateString("en-us-u-ca-islamic", { month: "numeric" }));
        global_CurrentHijriDate[1] = parseInt(new Date(global_currentDate.getFullYear(),
            global_currentDate.getMonth(),
            global_currentDate.getDate()).toLocaleDateString("en-us-u-ca-islamic", { year: "numeric" }));
    })
    
}

function init_report_timetable() {
    var urlParams = new URLSearchParams(window.location.search);
    var user_account_id = urlParams.get('id');
    var user_setting_id = urlParams.get('sid');
    var reporttype = urlParams.get('type');
    dialogue_loading(1);
    get_app_globals().then(function(){
        init_common().then(function(){
            //report start
            if (inIframe() == false) {
                //when report only is run outside webapp
                //get gps and update view stat
                //if run in iframe then these values are already known
                //and update view stat handled in onclick
                get_gps_from_ip().then(function(){
                    updateViewStat(user_setting_id);
                });
                
            }
            //check report type
            switch (reporttype) {
                //day
                case '0':
                    {
                        document.getElementById('prayertable_day').style.visibility = 'visible';
                        //load settings from user_account_id, ignore ui stuff, override default 1 value
                        user_settings_get(user_account_id, 0, user_setting_id).then(function(){
                            //change to chosen user setting id
                            let select = document.getElementById("setting_select_user_setting");
                            for (i = select.options.length - 1; i >= 0; i--) {
                                if (select[i].getAttribute('id') == user_setting_id) {
                                    select.selectedIndex = i;
                                }
                            }
                            user_settings_load(0).then(function(){
                                settings_translate_report(true).then(function(){
                                    settings_translate_report(false).then(function(){
                                        update_timetable_report();
                                        dialogue_loading(0);
                                    });
                                });
                            });
                        });
                        break;
                    }
                    //month
                case '1':
                    {
                        document.getElementById('prayertable_month').style.visibility = 'visible';
                        //load setting from user_setting_id
                        user_setting_get(user_setting_id).then(function(){
                            user_settings_load(0).then(function(){
                                settings_translate_report(true).then(function(){
                                    settings_translate_report(false).then(function(){
                                        update_timetable_report();
                                        dialogue_loading(0);
                                    });
                                });
                            })
                        });
                        break;
                    }
                    //year
                case '2':
                    {
                        document.getElementById('prayertable_year').style.visibility = 'visible';
                        //load setting from user_setting_id
                        user_setting_get(user_setting_id).then(function(){
                            user_settings_load(0).then(function(){
                                settings_translate_report(true).then(function(){
                                    settings_translate_report(false).then(function(){
                                        update_timetable_report();
                                        dialogue_loading(0);
                                    });
                                });
                            });
                        });
                        break;
                    }
                default:
                    {
                        document.getElementById('prayertable_day').style.visibility = 'visible';
                        break;
                    }
            }
        })
    })
}
async function app_load(){
    var status;
    //app variables
    fetch(global_rest_url_base + global_rest_app +
        '?id=' + global_app_id + 
        '&lang_code=' + document.getElementById('setting_select_locale').value, 
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + global_rest_at
            }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(result) {
        if (status === 200) {
            json = JSON.parse(result);
            global_app_hostname = json.data[0].url;
            global_app_name = json.data[0].app_name;
            set_app_globals_head();
            set_app_globals_body();
            update_info(1);
            update_info(2);
            update_info(3);
            update_info(4);
            update_info(5);
        }
        else {
            alert(responseText_get_error('get_app_globals app', result));
        }
    })
    await get_gps_from_ip().then(function(){
        //init map thirdparty module
        init_map();
        //load themes in Design tab
        load_themes();
        app_log('INIT', 'INIT', location.hostname, '');
        //set papersize
        zoom_paper();
        //user interface font depending selected arabic script
        update_ui(3);
        //use enter key at login
        keyfunctions();
        //set timers
        //map doesnt update correct so set refresh
        setInterval(fixmap, 1000);
        //set current date and time for current locale and timezone
        clearInterval(showcurrenttime);
        setInterval(showcurrenttime, 1000);
        //set report date and time for current locale, report timezone
        clearInterval(showreporttime);
        setInterval(showreporttime, 1000);
        //show dialogue about using mobile and scan QR code after 5 seconds
        setTimeout(show_dialogue('SCAN'), 5000);
    })
}
async function app_show(){
    var user = window.location.pathname.substring(1);
    //show default report or profile
    if (user == '') {
        //show default startup
        toolbar_bottom(global_default_startup_page);
    } 
    else {
        //show profile for user entered in url
        //check if logged in
        if (document.getElementById('setting_data_username_logged_in').innerHTML == '') {
            document.getElementById('profile_detail').classList.add("profile_detail_logged_off");
            document.getElementById('profile_info').classList.add("profile_info_logged_off");
        }
        document.getElementById('profile').style.visibility = "visible";
        profile_show(null, user);
    }
}
async function init_head(){

        /*Google*/
        var tag = document.createElement('script');
        tag.src = global_app_user_provider1_api_src + navigator.language;
        tag.defer = true;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        /*Facebook*/
        window.fbAsyncInit = function() {
            FB.init({
            appId      : global_app_user_provider2_id,
            cookie     : true,
            xfbml      : true,
            version    : global_app_user_provider2_api_version
            });
            
            FB.AppEvents.logPageView();   
            
        };
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = global_app_user_provider2_api_src + 
                    navigator.language.replace(/-/g, '_') + 
                    global_app_user_provider2_api_src2;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
}
function init() {
    dialogue_loading(1);
    get_app_globals().then(function(){
        init_common().then(function(){
            app_load().then(function (){
                set_default_settings().then(function(){
                    settings_translate(true).then(function(){
                        settings_translate(false).then(function(){
                            app_show().then(function(){
                                init_head().then(function(){
                                    dialogue_loading(0);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}