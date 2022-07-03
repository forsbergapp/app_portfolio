/*  Functions and globals in this order:
    GLOBALS
    REPORT
    MAP
    THEME
    UI
    USER
    USER SETTING
    EVENTS
    SERVICE WORKER
    EXCEPTION
    INIT
 */
/*----------------------- */
/* GLOBALS                */
/*----------------------- */
window.global_rest_app1_user_setting_profile;
window.global_rest_app1_user_setting_profile_all;
window.global_rest_app1_user_setting_profile_top;
window.global_rest_app1_user_setting_profile_detail;
window.global_rest_app1_user_setting_like;

window.global_app_default_startup_page;
window.global_app_report_timetable;

window.global_pwa_scope;
window.global_info_social_link1_url;
window.global_info_social_link2_url;
window.global_info_social_link3_url;
window.global_info_social_link4_url;
window.global_info_social_link1_name;
window.global_info_social_link2_name;
window.global_info_social_link3_name;
window.global_info_social_link4_name;
window.global_info_link_1_url;
window.global_info_link_2_url;
window.global_info_link_3_url;
window.global_info_link_4_url;
window.global_info_link_1_name;
window.global_info_link_2_name;
window.global_info_link_3_name;
window.global_info_link_4_name;

window.global_info_email_policy;
window.global_info_email_disclaimer;
window.global_info_email_terms;

window.global_regional_default_direction;
window.global_regional_default_locale_second;
window.global_regional_default_coltitle;
window.global_regional_default_arabic_script;
window.global_regional_default_calendartype;
window.global_regional_default_calendar_hijri_type;

window.global_gps_default_country;
window.global_gps_default_city;
window.global_gps_default_place_id;
window.global_gps_map_container;
window.global_gps_map_zoom;
window.global_gps_map_zoom_city;
window.global_gps_map_zoom_pp;
window.global_gps_map_flyto;
window.global_gps_map_jumpto;
window.global_gps_map_popup_offset;
window.global_gps_map_style_baseurl;
window.global_gps_map_default_style;
window.global_gps_map_marker_div_pp;
window.global_gps_map_marker_div_city;
window.global_gps_map_marker_div_gps;
window.global_gps_map_maptype;
window.global_gps_map_access_token;
window.global_gps_map_qibbla_title;
window.global_gps_map_qibbla_text_size;
window.global_gps_map_qibbla_lat;
window.global_gps_map_qibbla_long;
window.global_gps_map_qibbla_color;
window.global_gps_map_qibbla_width;
window.global_gps_map_qibbla_opacity;
window.global_gps_map_qibbla_old_title;
window.global_gps_map_qibbla_old_text_size;
window.global_gps_map_qibbla_old_lat;
window.global_gps_map_qibbla_old_long;
window.global_gps_map_qibbla_old_color;
window.global_gps_map_qibbla_old_width;
window.global_gps_map_qibbla_old_opacity;

window.global_design_default_theme_day;
window.global_design_default_theme_month;
window.global_design_default_theme_year;
window.global_design_default_papersize;
window.global_design_default_highlight_row;
window.global_design_default_show_weekday;
window.global_design_default_show_calendartype;
window.global_design_default_show_notes;
window.global_design_default_show_gps;
window.global_design_default_show_timezone;

window.global_image_default_report_header_src;
window.global_image_default_report_footer_src;
window.global_image_header_footer_width;
window.global_image_header_footer_height;

window.global_text_default_reporttitle1;
window.global_text_default_reporttitle2;
window.global_text_default_reporttitle3;
window.global_text_default_reportfooter1;
window.global_text_default_reportfooter2;
window.global_text_default_reportfooter3;

window.global_prayer_default_method;
window.global_prayer_default_asr;
window.global_prayer_default_highlatitude;
window.global_prayer_default_timeformat;
window.global_prayer_default_hijri_adjustment;
window.global_prayer_default_iqamat_title_fajr;
window.global_prayer_default_iqamat_title_dhuhr;
window.global_prayer_default_iqamat_title_asr;
window.global_prayer_default_iqamat_title_maghrib;
window.global_prayer_default_iqamat_title_isha;
window.global_prayer_default_show_imsak;
window.global_prayer_default_show_sunset;
window.global_prayer_default_show_midnight;
window.global_prayer_default_show_fast_start_end;

window.global_qr_logo_file_path;
window.global_qr_width;
window.global_qr_height;
window.global_qr_color_dark;
window.global_qr_color_light;
window.global_qr_logo_width;
window.global_qr_logo_height;
window.global_qr_background_color;

/*----------------------- */
/* REPORT                 */
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
				<link rel="stylesheet" type="text/css" href="/app${window.global_app_id}/css/app_fonts.css" />
				<link rel="stylesheet" type="text/css" href="/app${window.global_app_id}/css/app.css" />
				<link rel="stylesheet" type="text/css" href="/app${window.global_app_id}/css/app_report.css" />
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
function getTimetable_type(){
    if (document.getElementById('prayertable_day').style.visibility == 'visible')
        return 0;
    if (document.getElementById('prayertable_month').style.visibility == 'visible')
        return 1;
    if (document.getElementById('prayertable_year').style.visibility == 'visible')
        return 2;
}

function getReportSettings(){
    return {    prayertable_month       : 'prayertable_month', //class to add for month
                prayertable_year_month  : 'prayertable_year_month', //class to add for year
                reporttype          	: 'MONTH', //MONTH: normal month with more info, YEAR: month with less info
                locale              	: document.getElementById('setting_select_locale').value,  
                timezone            	: document.getElementById('setting_select_report_timezone').value,
                number_system       	: document.getElementById('setting_select_report_numbersystem').value,
                direction           	: document.getElementById('setting_select_report_direction').value,
                second_locale       	: document.getElementById('setting_select_report_locale_second').value,
                arabic_script       	: document.getElementById('setting_select_report_arabic_script').value,
                calendartype        	: document.getElementById('setting_select_calendartype').value,
                calendar_hijri_type 	: document.getElementById('setting_select_calendar_hijri_type').value,

                place               	: document.getElementById('setting_input_place').value,
                gps_lat             	: parseFloat(document.getElementById('setting_input_lat').value),
                gps_long            	: parseFloat(document.getElementById('setting_input_long').value),

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
                header_align            : get_align(document.getElementById('setting_input_reporttitle_aleft').classList.contains('setting_button_active'), 
                                                    document.getElementById('setting_input_reporttitle_acenter').classList.contains('setting_button_active'), 
                                                    document.getElementById('setting_input_reporttitle_aright').classList.contains('setting_button_active')),
                footer_txt1         	: document.getElementById('setting_input_reportfooter1').value,
                footer_txt2         	: document.getElementById('setting_input_reportfooter2').value,
                footer_txt3    	   		: document.getElementById('setting_input_reportfooter3').value,
                //button is active set left, center or right true/false
                footer_align            : get_align(document.getElementById('setting_input_reportfooter_aleft').classList.contains('setting_button_active'),
                                                    document.getElementById('setting_input_reportfooter_acenter').classList.contains('setting_button_active'),
                                                    document.getElementById('setting_input_reportfooter_aright').classList.contains('setting_button_active')),
                
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
                show_fast_start_end 	: document.getElementById('setting_select_report_show_fast_start_end').value,
                ui_navigation_left      : 'toolbar_navigation_btn_left',
                ui_navigation_right     : 'toolbar_navigation_btn_right',
                ui_prayertable_day      : document.getElementById('prayertable_day'),
                ui_prayertable_month    : document.getElementById('prayertable_month'),
                ui_prayertable_year     : document.getElementById('prayertable_year')};
}
// update timetable
function update_timetable_report(timetable_type = 0, item_id = null, settings, lang_code) {

	switch (timetable_type){
	//create timetable month or day or year if they are visible instead
	case 0:{
        //update user settings to current select option 
	    set_settings_select();
        let select_user_settings = document.getElementById('setting_select_user_setting');
        let current_user_settings =[];
        for (i=0;i<=select_user_settings.options.length-1;i++){
            current_user_settings.push(
            {
            "description" : select_user_settings[i].getAttribute('description'),
            "regional_language_locale" : select_user_settings[i].getAttribute('regional_language_locale'),
            "regional_timezone" : select_user_settings[i].getAttribute('regional_timezone'),
            "regional_number_system" : select_user_settings[i].getAttribute('regional_number_system'),
            "regional_calendar_hijri_type" : select_user_settings[i].getAttribute('regional_calendar_hijri_type'),
            "gps_lat_text" : parseFloat(select_user_settings[i].getAttribute('gps_lat_text')),
            "gps_long_text" : parseFloat(select_user_settings[i].getAttribute('gps_long_text')),
            "prayer_method" : select_user_settings[i].getAttribute('prayer_method'),
            "prayer_asr_method" : select_user_settings[i].getAttribute('prayer_asr_method'),
            "prayer_high_latitude_adjustment" : select_user_settings[i].getAttribute('prayer_high_latitude_adjustment'),
            "prayer_time_format" : select_user_settings[i].getAttribute('prayer_time_format'),
            "prayer_hijri_date_adjustment" : select_user_settings[i].getAttribute('prayer_hijri_date_adjustment')
            });
        }
		displayDay(settings, item_id, lang_code, current_user_settings);
		break;
	}
	//1=create timetable month
	case 1:{
		if (item_id==null)
			displayMonth(0, settings.ui_prayertable_month, settings, lang_code);
		else
			if (item_id == settings.ui_navigation_left)
				displayMonth(-1, settings.ui_prayertable_month, settings, lang_code);
			else 
				if (item_id == settings.ui_navigation_right)
					displayMonth(+1, settings.ui_prayertable_month, settings, lang_code);
		break;
	}
	//2=create timetable year
	case 2:{
		displayYear(settings, item_id, lang_code);
		break;
	}
	default:{
		break;
		}
	}
	return null;
}
function get_report_url(id, sid, papersize){
    
    return getHostname() + `${window.global_service_report}` +
         `?app_id=${window.global_app_id}&lang_code=${get_lang_code()}` +
         `&id=${id}` +
         `&sid=${sid}` +
         `&ps=${papersize}` +
         `&hf=0` + 
         `&module=${window.global_app_report_timetable}`;
}
function updateViewStat_app(user_setting_id, user_setting_user_account_id = null) {
    let user_account_id;
    if (user_setting_user_account_id !== parseInt(document.getElementById('setting_data_userid_logged_in').innerHTML) ||
        document.getElementById('setting_data_userid_logged_in').innerHTML == '') {
        if (document.getElementById('setting_data_userid_logged_in').innerHTML == '')
            user_account_id = 'null';
        else
            user_account_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
        updateReportViewStat(user_account_id, user_setting_id, get_lang_code());
    }
}
function preview_report(url, type){
    if (type=='html'){
        document.getElementById("window_preview_report").style.visibility = "visible";
        create_qr("window_preview_toolbar_qr", url);
        dialogue_loading(1);
        document.getElementById("window_preview_content").src=url;
        dialogue_loading(0);
    }
    else
        if (type=='pdf'){
            document.getElementById("window_preview_report").style.visibility = "visible";
            create_qr("window_preview_toolbar_qr", url);
            dialogue_loading(1);
            fetch (url,
                    {
                        headers: {
                            'Content-Type': 'application/pdf;charset=UTF-8'
                        }
                    }
            )
            .then(function(response) {
                return response.blob();
            })
            .then(function(pdf) {      
                let reader = new FileReader();
                reader.readAsDataURL(pdf); 
                reader.onloadend = function() {
                    let base64PDF = reader.result;   
                    document.getElementById("window_preview_content").src= base64PDF;
                    dialogue_loading(0);
                }
            })
        }
}
function get_report_url_type(item, format){
    if (item =='profile_user_settings_day' || item.substr(0,8)=='user_day')
        return url_type = '&type=0&type_desc=REPORT_TIMETABLE_DAY_' + format;
    if (item =='profile_user_settings_month' || item.substr(0,10)=='user_month')
        return url_type = '&type=1&type_desc=REPORT_TIMETABLE_MONTH_' + format;
    if (item == 'profile_user_settings_year' || item.substr(0,9)=='user_year')
        return url_type = '&type=2&type_desc=REPORT_TIMETABLE_YEAR_' + format;
}
/*----------------------- */
/* MAP                    */
/*----------------------- */
async function get_place_from_gps(latitude, longitude) {
    let error_message;
    let status;
    await fetch(window.global_service_geolocation + window.global_service_geolocation_gps_place + 
                '?app_id= ' + window.global_app_id +
                '&app_user_id=' + document.getElementById('setting_data_userid_logged_in').innerHTML +
                '&latitude=' + latitude +
                '&longitude=' + longitude +
                '&lang_code=' + get_lang_code(), {
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
            let json = JSON.parse(result);
            //use setting_select_country to get country name using returned countrycode
            //if necessary
            document.getElementById('setting_input_place').value = json.geoplugin_place + ', ' +
                json.geoplugin_region + ', ' +
                json.geoplugin_countryCode;
        } else {
            exception(status, result, get_lang_code());
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
    let popup_title_div = document.getElementById('settings_gps_map_popup_title');
    let popup_sub_title_div = document.getElementById('settings_gps_map_popup_sub_title');
    let city_current = document.getElementById('setting_select_city');
    let place = document.getElementById('setting_input_place');
    let timezone = document.getElementById('setting_label_report_timezone');

    //check if popup exists
    if (popup_title_div) {
        //check what popup title to update
        if (city_current.selectedIndex != 0) {
            //city name
            popup_title_div.innerHTML = city_current.options[city_current.selectedIndex].text;
        } else {
            //Popular place name or custom title
            popup_title_div.innerHTML = place.value;
        }
        //Timezone text:
        popup_sub_title_div.innerHTML = timezone.innerHTML;
    }
    return null;
}

function init_map() {

    mapboxgl.accessToken = window.global_gps_map_access_token;
    window.global_session_gps_map_mymap = new mapboxgl.Map({
        container: window.global_gps_map_container,
        style: window.global_gps_map_style_baseurl + window.global_gps_map_style,
        center: [document.getElementById('setting_input_long').value,
            document.getElementById('setting_input_lat').value
        ],
        zoom: window.global_gps_map_zoom
    });

    window.global_session_gps_map_mymap.addControl(new mapboxgl.NavigationControl());
    window.global_session_gps_map_mymap.addControl(new mapboxgl.FullscreenControl());

    window.global_session_gps_map_mymap.on('dblclick', function(e) {
        e.preventDefault()
        document.getElementById('setting_input_lat').value = e.lngLat['lat'];
        document.getElementById('setting_input_long').value = e.lngLat['lng'];
        //Update GPS position
        update_ui(9);

    });
}

function fixmap() {
    //not rendering correct at startup
    window.global_session_gps_map_mymap.resize();
    return null;
}

function map_show_qibbla() {
    if (window.global_session_gps_map_mymap.getSource('qibbla')) {
        window.global_session_gps_map_mymap.getSource('qibbla').setData({
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [window.global_gps_map_qibbla_long, window.global_gps_map_qibbla_lat],
                        [document.getElementById('setting_input_long').value,
                            document.getElementById('setting_input_lat').value
                        ]
                    ]
                }
            }]
        });
        //qibbla old
        window.global_session_gps_map_mymap.getSource('qibbla_old').setData({
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [window.global_gps_map_qibbla_old_long, window.global_gps_map_qibbla_old_lat],
                        [document.getElementById('setting_input_long').value,
                            document.getElementById('setting_input_lat').value
                        ]
                    ]
                }
            }]
        });

    } else {
        window.global_session_gps_map_mymap.on('load', function() {
            window.global_session_gps_map_mymap.addSource('qibbla', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': { "title": window.global_gps_map_qibbla_title },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [window.global_gps_map_qibbla_long, window.global_gps_map_qibbla_lat],
                            [document.getElementById('setting_input_long').value,
                                document.getElementById('setting_input_lat').value
                            ]
                        ]
                    }
                }
            });
            window.global_session_gps_map_mymap.addLayer({
                'id': 'qibblaid',
                'type': 'line',
                'source': 'qibbla',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': window.global_gps_map_qibbla_color,
                    'line-width': window.global_gps_map_qibbla_width,
                    'line-opacity': window.global_gps_map_qibbla_opacity
                }
            });
            window.global_session_gps_map_mymap.addLayer({
                "id": "qibbla_symbol",
                "type": "symbol",
                "source": "qibbla",
                "layout": {
                    "symbol-placement": "line",
                    "text-field": window.global_gps_map_qibbla_title,
                    "text-size": window.global_gps_map_qibbla_text_size
                }
            });
            //qibbla old
            window.global_session_gps_map_mymap.addSource('qibbla_old', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': { "title": window.global_gps_map_qibbla_old_title },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': [
                            [window.global_gps_map_qibbla_old_long, window.global_gps_map_qibbla_old_lat],
                            [document.getElementById('setting_input_long').value,
                                document.getElementById('setting_input_lat').value
                            ]
                        ]
                    }
                }
            });
            window.global_session_gps_map_mymap.addLayer({
                'id': 'qibbla_old_id',
                'type': 'line',
                'source': 'qibbla_old',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': window.global_gps_map_qibbla_old_color,
                    'line-width': window.global_gps_map_qibbla_old_width,
                    'line-opacity': window.global_gps_map_qibbla_old_opacity
                }
            });
            window.global_session_gps_map_mymap.addLayer({
                "id": "qibbla_old_symbol",
                "type": "symbol",
                "source": "qibbla_old",
                "layout": {
                    "symbol-placement": "line",
                    "text-field": window.global_gps_map_qibbla_old_title,
                    "text-size": window.global_gps_map_qibbla_old_text_size
                }
            });

        });
    }
    return null;
}

function update_map(longitude, latitude, zoom, text1, text2, text3, marker_id, flyto) {

    if (flyto == 1) {
        window.global_session_gps_map_mymap.flyTo({
            'center': [longitude, latitude],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    } else {
        if (zoom == '')
            window.global_session_gps_map_mymap.jumpTo({ 'center': [longitude, latitude] });
        else
            window.global_session_gps_map_mymap.jumpTo({ 'center': [longitude, latitude], 'zoom': zoom });
    }
    let popuptext = create_map_popup_text(text1,
        text2,
        text3);
    let popup = new mapboxgl.Popup({ offset: window.global_gps_map_popup_offset, closeOnClick: false })
        .setLngLat([longitude, latitude])
        .setHTML(popuptext)
        .addTo(window.global_session_gps_map_mymap);
    let el = document.createElement('div');
    el.id = marker_id;
    new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(window.global_session_gps_map_mymap);
    map_show_qibbla();
    return null;
}
/*----------------------- */
/* THEME                  */
/*----------------------- */
function app_select_theme() {
    document.body.className = 'app_theme' + document.getElementById('app_select_theme').value;
    return null;
}
function get_theme_id(type) {
    let select_user_setting = document.getElementById('setting_select_user_setting');
    if (document.getElementsByClassName('slider_active_' + type)[0])
        return document.getElementsByClassName('slider_active_' + type)[0].getAttribute('data-theme_id');
    else
        return select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_' + type + '_id');
}
function set_theme_id(type, theme_id) {
    let slides = document.getElementById('setting_themes_' + type + '_slider').children[0].children[0]
    for (let i = 0; i < slides.childElementCount; i++) {
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
    let posInitial,
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
        let slideSize = items.getElementsByClassName('slide_' + type)[0].offsetWidth;
        let index;
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
/* UI                     */
/*----------------------- */
async function settings_translate(first=true) {
	let json;
    let status;
    let locale;
    if (first ==true)
        locale = get_lang_code()
    else
        locale = document.getElementById('setting_select_report_locale_second').value
    if (locale != 0){
        //fetch any message with first language always
        //show translation using first or second language
        let url = `${window.global_rest_url_base}${window.global_rest_app_object}${locale}` +
                  `?app_id=${window.global_app_id}` + 
                  `&lang_code=${get_lang_code()}`;
        await fetch(url, {
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
                                        document.getElementById('login_btn_facebook').innerHTML = json.data[i].text + ' ' + window.global_app_user_provider2_name;
                                    else{
                                        if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='REPORT')
                                            window.global_first_language[json.data[i].object_item_name.toLowerCase()] = json.data[i].text;
                                        else{
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
                        }
                        if (json.data[i].object=='APP_OBJECT_ITEM_SUBITEM'){
                            if (json.data[i].object_name=='TOOLBAR')
                                //popup menu items
                                document.getElementById(json.data[i].subitem_name.toLowerCase()).innerHTML = json.data[i].text;
                            else{
                                //update select objects
                                let select_element = json.data[i].object_item_name;
                                //option number not saved in column but end with the option number
                                let select_option = json.data[i].subitem_name.substr(json.data[i].subitem_name.lastIndexOf('_')+1);
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
                        for (let i = 0; i < json.data.length; i++){
                            if (json.data[i].object=='APP_OBJECT_ITEM' && json.data[i].object_name=='REPORT')
                                window.global_second_language[json.data[i].object_item_name.toLowerCase()] = json.data[i].text;						
                        }
                    }
                    
                }
                if (first==true){
                    //country
                    fetch(window.global_rest_url_base + window.global_rest_country + get_lang_code() + `?app_id=${window.global_app_id}`, 
                        {
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
                        if (status === 200) {
                            json = JSON.parse(result);
                            let select_country = document.getElementById('setting_select_country');
                            let html=`<option value='' id='' label='…' selected='selected'>…</option>`;
                            let current_country = document.getElementById('setting_select_country')[document.getElementById('setting_select_country').selectedIndex].id;
                            for (let i = 0; i < json.countries.length; i++){
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
                            SearchAndSetSelectedIndex(current_country,
                                                      document.getElementById('setting_select_country'),0);
                            //locale
                            fetch(window.global_rest_url_base + window.global_rest_language_locale + get_lang_code() + `?app_id=${window.global_app_id}`, 
                            {
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
                                if (status === 200) {
                                    json = JSON.parse(result);
                                    let html='';
                                    let select_locale = document.getElementById('setting_select_locale');
                                    let select_second_locale = document.getElementById('setting_select_report_locale_second');        
                                    let current_locale = select_locale.value;
                                    let current_second_locale = select_second_locale.value;
                                    for (let i = 0; i < json.locales.length; i++){
                                        html += `<option id="${i}" value="${json.locales[i].locale}">${json.locales[i].text}</option>`;
                                    }
                                    select_locale.innerHTML = html;
                                    select_locale.value = current_locale;
                                    select_second_locale.innerHTML = select_second_locale.options[0].outerHTML + html;
                                    select_second_locale.value = current_second_locale;
                                }
                                else
                                    exception(status, result, get_lang_code());
                            }).catch(function(error) {
                                show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
                            })
                        }
                        else
                            exception(status, result, get_lang_code());
                    }).catch(function(error) {
                        show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
                    })
                }
                //if translating first language and second language is not used
                if (first == true &&
                    document.getElementById('setting_select_report_locale_second').value ==0){
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
                //fix fontsizes for toolbar button translated text
                fix_toolbar_button_sizes();
                //map popup contains translated text
                update_map_popup();
                //Update timezone language setting
                update_ui(1);
            } 
            else {
                exception(status, result, get_lang_code());
            }   
        })
    }
	return null;
}
function get_align(al,ac,ar){
	if (al==true)
		return 'left';
	if (ac==true)
		return 'center';
	if (ar==true)
		return 'right';
	return '';
}
function showcurrenttime() {
    let settings = {
        timezone_current: document.getElementById('setting_select_timezone_current').value,
        locale: get_lang_code(),
        timedisplay_item: document.getElementById('setting_label_current_date_time_display')
    }
    let options = {
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

    let settings = {
        timezone_report: document.getElementById('setting_select_report_timezone')[document.getElementById('setting_select_report_timezone').selectedIndex].value,
        locale: get_lang_code(),
        timedisplay_item: document.getElementById('setting_label_report_date_time_display')
    }
    let options = {
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
        let user_current_time = document.getElementsByClassName('prayertable_day_current_time');
        let select_user_settings = document.getElementById('setting_select_user_setting');
        let user_locale;
        let user_options;
        //loop user settings
        for (i = 0; i <= select_user_settings.options.length - 1; i++) {
            user_options = {
                timeZone: select_user_settings[i].getAttribute('regional_timezone'),
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
    let paper_size_select = document.getElementById('setting_select_report_papersize');
    document.getElementById('window_preview_content').className = paper_size_select.options[paper_size_select.selectedIndex].value;
}
async function toolbar_bottom(choice) {
    let paper = document.getElementById('paper');
    let prayertable_day = document.getElementById('prayertable_day');
    let prayertable_month = document.getElementById('prayertable_month');
    let prayertable_year = document.getElementById('prayertable_year');
    let settings = document.getElementById('settings');

    switch (choice) {
        //print
        case 1:
            {
                if (mobile())
                    paper.style.display = "block";
                settings.style.visibility = 'hidden';
                printTable();
                break;
            }
            //day
        case 2:
            {
                if (mobile())
                    paper.style.display = "block";
                prayertable_day.style.visibility = 'visible';
                prayertable_month.style.visibility = 'hidden';
                prayertable_year.style.visibility = 'hidden';
                settings.style.visibility = 'hidden';
                update_timetable_report(0, null, getReportSettings(), get_lang_code());
                break;
            }
            //month
        case 3:
            {
                if (mobile())
                    paper.style.display = "block";
                prayertable_day.style.visibility = 'hidden';
                prayertable_month.style.visibility = 'visible';
                prayertable_year.style.visibility = 'hidden';
                settings.style.visibility = 'hidden';
                update_timetable_report(1, null, getReportSettings(), get_lang_code());
                break;
            }
            //year
        case 4:
            {
                if (mobile())
                    paper.style.display = "block";
                prayertable_day.style.visibility = 'hidden';
                prayertable_month.style.visibility = 'hidden';
                prayertable_year.style.visibility = 'visible';
                settings.style.visibility = 'hidden';
                update_timetable_report(2, null, getReportSettings(), get_lang_code());
                break;
            }
            //settings
        case 5:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (mobile())
                    paper.style.display = "none";
                settings.style.visibility = 'visible';
                break;
            }
            //profile
        case 6:
            {
                settings.style.visibility = 'hidden';
                profile_show_app(null,null, document.getElementById('setting_data_userid_logged_in').innerHTML , document.getElementById('setting_select_timezone_current').value,get_lang_code());
                break;
            }
            //profile top
        case 7:
            {
                settings.style.visibility = 'hidden';
                profile_top(1, document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code(), null, 'profile_show_app');
                break;
            }
    }
}


function openTab(tab_selected) {
    let i;
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

function dialogue_loading(visible){
    if (visible==1){
        document.getElementById('dialogue_loading').innerHTML = window.global_button_spinner;
        document.getElementById('dialogue_loading').style.visibility='visible';
    }
    else{
        document.getElementById('dialogue_loading').innerHTML = '';
        document.getElementById('dialogue_loading').style.visibility='hidden';
    }
}

function zoom_paper(zoomvalue = '') {
    let old;
    let old_scale;
    let div = document.getElementById('paper');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == '') {
        if (mobile())
            div.style.transform = 'scale(0.5)';
        else
            div.style.transform = 'scale(0.7)';
    } else {
        old = document.getElementById('paper').style.transform;
        old_scale = parseFloat(old.substr(old.indexOf("(") + 1, old.indexOf(")") - 1));
        div.style.transform = 'scale(' + (old_scale + (zoomvalue / 10)) + ')';
    }
    return null;
}
function select_get_selectindex(select, id) {
    if (id == 0)
        return 0;
    else {
        let select = document.getElementById(select);
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
        let select = document.getElementById(select);
        return select[selectindex].getAttribute('id');
    }
    return null;
}
function SearchAndSetSelectedIndex(search, select_item, colcheck) {
    //colcheck=0 search id
    //colcheck=1 search value
    for (let i = 0; i < select_item.options.length; i++) {
        if ((colcheck==0 && select_item.options[i].id == search) ||
            (colcheck==1 && select_item.options[i].value == search)) {
            select_item.selectedIndex = i;
            return null;
        }
    }
    return null;
}
function set_null_or_value(value) {
    if (value == null || value == '')
        return 'null';
    else
        return value;
}
function update_info(info) {
    let button_close_about = `<button class='info_close toolbar_button' 
                                onclick="document.getElementById('window_info').style.display = 'none';
                                window.location='#info_empty';
                                document.getElementById('window_preview_toolbar_qr').style.display = 'block';">
                                ${window.global_button_default_icon_close}
                            </button>`
    let button_close_info = `<button class='info_close toolbar_button' 
                                onclick="document.getElementById('window_info').style.display = 'none';
                                window.location='#info_empty';">
                                ${window.global_button_default_icon_close}
                            </button>`;    
    fetch(eval('window.global_info_link' + info + '_url'))
        .then(function(response) {
            return response.text();
        })
        .then(function(result) {
            switch (info) {
                //info/privacy_policy.html
                case 1:
                    {
                        document.getElementById('info' + info).innerHTML = result + button_close_info;
                        document.getElementById('policy_app_name1').innerHTML = window.global_app_name;
                        document.getElementById('policy_app_name2').innerHTML = window.global_app_name;
                        document.getElementById('policy_app_hostname').href = window.global_app_hostname;
                        document.getElementById('policy_app_hostname').innerText = window.global_app_hostname;
                        document.getElementById('policy_app_email').href = 'mailto:' + window.global_info_email_policy;
                        document.getElementById('policy_app_email').innerText = window.global_info_email_policy;
                        break;
                    }
                //info/disclaimer.html
                case 2:
                    {
                        document.getElementById('info' + info).innerHTML = result + button_close_info;
                        document.getElementById('disclaimer_app_name1').innerHTML = window.global_app_name;
                        document.getElementById('disclaimer_app_name2').innerHTML = window.global_app_name;
                        document.getElementById('disclaimer_app_name3').innerHTML = window.global_app_name;
                        document.getElementById('disclaimer_app_email').href = 'mailto:' + window.global_info_email_disclaimer;
                        document.getElementById('disclaimer_app_email').innerText = window.global_info_email_disclaimer;
                        break;
                    }
                //info/terms.html
                case 3:
                    {
                        document.getElementById('info' + info).innerHTML = result + button_close_info;
                        document.getElementById('terms_app_name').innerHTML = window.global_app_name;
                        document.getElementById('terms_app_hostname').href = window.global_app_hostname;
                        document.getElementById('terms_app_hostname').innerText = window.global_app_hostname;
                        document.getElementById('terms_app_email').href = 'mailto:' + window.global_info_email_terms;
                        document.getElementById('terms_app_email').innerText = window.global_info_email_terms;
                        break;
                    }
                //info/about.html
                case 4:
                    {
                        document.getElementById('info' + info).innerHTML = result + button_close_about;
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
    switch (dialogue) {
        case 'INFO':
            {
                document.getElementById('settings').style.visibility = 'hidden';
                document.getElementById('dialogue_info').style.visibility = 'visible';
                document.getElementById('app_copyright').innerHTML = window.global_app_copyright;
                if (window.global_info_social_link1_url!=null)
                    document.getElementById('social_link1').innerHTML = `<a href=${window.global_info_social_link1_url} target='_blank'>${window.global_info_social_link1_name}</a>`;
                if (window.global_info_social_link2_url!=null)
                    document.getElementById('social_link2').innerHTML = `<a href=${window.global_info_social_link2_url} target='_blank'>${window.global_info_social_link2_name}</a>`;
                if (window.global_info_social_link3_url!=null)
                    document.getElementById('social_link3').innerHTML = `<a href=${window.global_info_social_link3_url} target='_blank'>${window.global_info_social_link3_name}</a>`;
                if (window.global_info_social_link4_url!=null)
                    document.getElementById('social_link4').innerHTML = `<a href=${window.global_info_social_link4_url} target='_blank'>${window.global_info_social_link4_name}</a>`;
                document.getElementById('info_link1').innerHTML = window.global_info_link1_name;
                document.getElementById('info_link2').innerHTML = window.global_info_link2_name;
                document.getElementById('info_link3').innerHTML = window.global_info_link3_name;
                document.getElementById('info_link4').innerHTML = window.global_info_link4_name;
                break;
            }
        case 'SCAN':
            {
                if (mobile())
                    return null;
                //show once and store variable in localstorage
                if (!localStorage.scan_open_mobile) {
                    localStorage.setItem('scan_open_mobile', true);
                    document.getElementById('dialogue_scan_open_mobile').style.visibility = 'visible';
                    create_qr('scan_open_mobile_qrcode', getHostname());
                };
                break;
            }
    }
    return null;
};

async function update_ui(option, item_id=null) {
    let settings = {
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
                //Update user edit info in case user is changing timezone while editing user
                if (document.getElementById('dialogue_user_edit').style.visibility == 'visible') {
                    //call twice, 
                    //first will hide and reset values
                    user_edit_app();
                    //second will fetch info again
                    user_edit_app();
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
                let select = document.getElementById('setting_select_report_arabic_script');
                let prefix = 'font_';
                document.getElementById('toolbar_top').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('settings').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('dialogues').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('common_dialogues').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('window_info').classList = prefix + select[select.selectedIndex].value;
                document.getElementById('toolbar_bottom').classList = prefix + select[select.selectedIndex].value;
                break;
            }
        //GPS, update map
        case 4:
            {
                window.global_session_gps_map_mymap.setStyle(window.global_gps_map_style_baseurl + settings.maptype.value);
                update_map(settings.gps_long_input.value,
                    settings.gps_lat_input.value,
                    window.global_gps_map_zoom,
                    document.getElementById('setting_input_place').value, //text1
                    document.getElementById('setting_label_report_timezone').innerHTML, //text2
                    tzlookup(settings.gps_lat_input.value, settings.gps_long_input.value), //text3
                    window.global_gps_map_marker_div_gps,
                    window.global_gps_map_jumpto);
                break;
            }
        //GPS, update cities from country
        case 5:
            {
                settings.city.innerHTML=`<option value='' id='' label='…' selected='selected'>…</option>`;
                SearchAndSetSelectedIndex('', settings.select_place,0);
                if (settings.country[settings.country.selectedIndex].getAttribute('country_code')!=null){
                    let status;
                    await fetch(window.global_service_worldcities + '/' + settings.country[settings.country.selectedIndex].getAttribute('country_code').toUpperCase() +
                            '?app_id=' + window.global_app_id +
                            '&app_user_id=' + document.getElementById('setting_data_userid_logged_in').innerHTML +
                            '&lang_code=' + get_lang_code(), {
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
                            let json = JSON.parse(result);
                            json.sort(function(a, b) {
                                let x = a.admin_name.toLowerCase() + a.city.toLowerCase();
                                let y = b.admin_name.toLowerCase() + b.city.toLowerCase();
                                if (x < y) {
                                    return -1;
                                }
                                if (x > y) {
                                    return 1;
                                }
                                return 0;
                            });
    
                            let current_admin_name;
                            //fill list with cities
                            let cities='';
                            for (let i = 0; i < json.length; i++) {
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
                            exception(status, result, get_lang_code());
                        }
                    })
                } 
                break;
            }
        //GPS, city
        case 6:
            {                    
                //set GPS and timezone
                let longitude_selected = settings.city[settings.city.selectedIndex].getAttribute('longitude');
                let latitude_selected = settings.city[settings.city.selectedIndex].getAttribute('latitude');
                let timezone_selected = tzlookup(latitude_selected, longitude_selected);
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
                    window.global_gps_map_zoom_city,
                    document.getElementById('setting_input_place').value, //text1
                    document.getElementById('setting_label_report_timezone').innerHTML, //text2
                    timezone_selected, //text3
                    window.global_gps_map_marker_div_city,
                    window.global_gps_map_flyto);
                settings.timezone_report.value = timezone_selected;
                break;
            }
        //GPS, popular places
        case 7:
            {
                //set GPS and timezone
                let longitude_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('longitude');
                let latitude_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('latitude');
                let timezone_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('timezone');
                settings.gps_long_input.value = longitude_selected;
                settings.gps_lat_input.value = latitude_selected;
                //Update map
                update_map(settings.gps_long_input.value,
                    settings.gps_lat_input.value,
                    window.global_gps_map_zoom_pp, //zoom for popular places
                    settings.select_place.options[settings.select_place.selectedIndex].text, //text1
                    document.getElementById('setting_label_report_timezone').innerHTML, //text2
                    timezone_selected, //text3
                    window.global_gps_map_marker_div_pp, //marker for popular places
                    window.global_gps_map_flyto);
                settings.timezone_report.value = timezone_selected;

                //display empty country
                SearchAndSetSelectedIndex('', settings.country,0);
                //remove old city list:            
                let old_groups = settings.city.getElementsByTagName('optgroup');
                for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
                    settings.city.removeChild(old_groups[old_index])
                //display first empty city
                SearchAndSetSelectedIndex('', settings.city,0);
                let title = settings.select_place.options[settings.select_place.selectedIndex].text;
                document.getElementById('setting_input_place').value = title;
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
                        window.global_gps_map_marker_div_gps,
                        window.global_gps_map_jumpto);
                    settings.timezone_report.value = tzlookup(settings.gps_lat_input.value, settings.gps_long_input.value);

                    //display empty country
                    SearchAndSetSelectedIndex('', settings.country,0);
                    //remove old city list:            
                    let old_groups = settings.city.getElementsByTagName('optgroup');
                    for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
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
                break;
            }
        //11=Image, Report header image load
	    case 11:
            {
                let resheader = show_image(settings.header_preview_img_item, item_id, window.global_image_header_footer_width, window.global_image_header_footer_height, get_lang_code());
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
                let resfooter = show_image(settings.footer_preview_img_item, item_id, window.global_image_header_footer_width, window.global_image_header_footer_height, get_lang_code());
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
                let method = document.getElementById('setting_select_method').value;
                let suffix;

                document.getElementById('setting_method_param_fajr').innerHTML = '';
                document.getElementById('setting_method_param_isha').innerHTML = '';
                if (typeof window.global_prayer_praytimes_methods[method].params.fajr == 'string')
                    suffix = '';
                else
                    suffix = '°';
                document.getElementById('setting_method_param_fajr').innerHTML = 'Fajr:' + window.global_prayer_praytimes_methods[method].params.fajr + suffix;
                if (typeof window.global_prayer_praytimes_methods[method].params.isha == 'string')
                    suffix = '';
                else
                    suffix = '°';
                document.getElementById('setting_method_param_isha').innerHTML = 'Isha:' + window.global_prayer_praytimes_methods[method].params.isha + suffix;
                break;
            }
    }

}
/*----------------------- */
/* USER                   */
/*----------------------- */
async function user_edit_app() {
    let old_button = document.getElementById('setting_btn_user_edit').innerHTML;
    document.getElementById('setting_btn_user_edit').innerHTML = window.global_button_spinner;
    await user_edit(document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code(),(err, result) => {
        document.getElementById('setting_btn_user_edit').innerHTML = old_button;
        if ((err==null && result==null) == false){
            if (err==null){
                update_settings_icon(image_format(result.avatar ?? result.provider1_image ?? result.provider2_image));
            }
        }
    });
}
async function user_update_app(){
    await user_update(document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(),(err, result) => {
        if (err==null){
            //update_settings_icon(image_format(result.avatar));
            update_settings_icon(atob(result.avatar));
            document.getElementById('setting_data_username_logged_in').innerHTML = result.username;
            document.getElementById('setting_bio_logged_in').innerHTML = result.bio;
        }
    });
}
async function user_login_app(){
    let username = document.getElementById('login_username');
    let password = document.getElementById('login_password');
    let lang_code = get_lang_code();
    let user_id = document.getElementById('setting_data_userid_logged_in');
    let old_button = document.getElementById('login_button').innerHTML;
    document.getElementById('login_button').innerHTML = window.global_button_spinner;
    await user_login(username.value, password.value, lang_code, (err, result)=>{
        document.getElementById('login_button').innerHTML = old_button;
        if (err==null){
            user_id.innerHTML = result.user_id;
            window.global_user_account_id = result.user_id;
            updateOnlineStatus();
            //create intitial user setting if not exist, send initial=true
            user_settings_function('ADD_LOGIN', true, (err, result_settings) =>{
                if (err)
                    null;
                else{
                    username.value = '';
                    password.value = '';
                    document.getElementById('user_logged_in').style.display = "block";
                    //set avatar or empty
                    if (result.avatar == null || result.avatar == '') {
                        recreate_img(document.getElementById('setting_avatar_logged_in'));
                        result.avatar = '';
                    } else
                        document.getElementById('setting_avatar_logged_in').src = image_format(result.avatar);
                    update_settings_icon(image_format(result.avatar));
                    document.getElementById('setting_bio_logged_in').innerHTML = get_null_or_value(result.bio);
                    document.getElementById('setting_data_username_logged_in').innerHTML = result.username;
                    
                    document.getElementById('popup_menu_login').style.display = 'none';
                    document.getElementById('popup_menu_signup').style.display = 'none';
                    document.getElementById('popup_menu_logoff').style.display = 'block';
                    document.getElementById('dialogue_login').style.visibility = 'hidden';
                    document.getElementById('dialogue_signup').style.visibility = 'hidden';
                    //Show user tab
                    document.getElementById('tab7_nav').style.display = 'inline-block';
                    //Hide settings
                    document.getElementById('settings').style.visibility = 'hidden';
                    //Hide profile
                    document.getElementById('dialogue_profile').style.visibility = 'hidden';
                    
                    document.getElementById('prayertable_day').innerHTML='';
                    document.getElementById('prayertable_month').innerHTML='';
                    document.getElementById('prayertable_year').innerHTML='';
                    dialogue_loading(1);
                    user_settings_get(user_id.innerHTML).then(function(){
                        user_settings_load().then(function(){
                            settings_translate(true).then(function(){
                                settings_translate(false).then(function(){
                                    //show default startup
                                    toolbar_bottom(window.global_app_default_startup_page);
                                    dialogue_loading(0);
                                })
                            })
                        })
                    }); 
                }         
            })
        }
        
    })
}
async function user_verify_check_input_app(item, nextField){
    await user_verify_check_input(item, document.getElementById('setting_data_userid_logged_in').innerHTML, nextField, get_lang_code(), (err, result) => {
        if ((err==null && result==null)==false)
            if(err==null){
                user_login_app();
            }
    })
}
async function user_function_app(function_name){
    await user_function(function_name, document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(), (err, result) => {
        if (err==null){
            profile_update_stat_app();
        }
    })
}
function profile_close_app(){
    profile_close();
    profile_clear_app;
}
function profile_clear_app(){

    document.getElementById('profile_public').style.display = "none";
    document.getElementById('profile_private').style.display = "none";
    
    document.getElementById('profile_info_user_setting_likes_count').innerHTML='';
    document.getElementById('profile_info_user_setting_liked_count').innerHTML='';
    document.getElementById('profile_select_user_settings').innerHTML='';

    document.getElementById('profile_user_settings_info_like_count').innerHTML='';
    document.getElementById('profile_user_settings_info_view_count').innerHTML='';
}
function user_logoff_app() {
    let select = document.getElementById("setting_select_user_setting");
    let option;
    //get new data token to avoid endless loop and invalid token
    user_logoff(document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code()).then(function(){
        //remove user setting icon
        update_settings_icon('', true);

        //hide logged in, user_edit and user settings
        document.getElementById('user_logged_in').style.display = "none";
        
        document.getElementById('user_settings').style.display = "none";
        //clear logged in info
        document.getElementById('setting_data_username_logged_in').innerHTML = '';
        window.global_user_account_id = '';
        updateOnlineStatus();
        recreate_img(document.getElementById('setting_avatar_logged_in'));
        document.getElementById('setting_bio_logged_in').innerHTML = '';
        document.getElementById('setting_data_userid_logged_in').innerHTML = '';
        profile_clear_app();
        //empty user settings
        select.innerHTML = '';
        //add one empty option
        option = document.createElement('option');
        select.appendChild(option);
        //set default settings
        set_default_settings().then(function(){
            settings_translate(true).then(function(){
                settings_translate(false).then(function(){
                    //show default startup
                    toolbar_bottom(window.global_app_default_startup_page);
                })
            })
        });
    })    
}
async function updateProviderUser_app(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email){
    let user_id = document.getElementById('setting_data_userid_logged_in');
    await updateProviderUser(provider_no, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, get_lang_code(), (err, result)=>{
        if(err==null){
            user_id.innerHTML = result.user_account_id;
            //create intitial user setting if not exist, send initial=true
            user_settings_function('ADD_LOGIN', true, (err, result_settings) =>{
                if (err)
                    null;
                else{
                    document.getElementById('user_logged_in').style.display = "block";
                    document.getElementById('setting_avatar_logged_in').src = result.avatar;
        
                    update_settings_icon(result.avatar);
        
                    document.getElementById('setting_bio_logged_in').innerHTML = get_null_or_value(result.bio);
                    document.getElementById('setting_data_username_logged_in').innerHTML = result.first_name + ' ' + result.last_name;
        
                    document.getElementById('popup_menu_login').style.display = 'none';
                    document.getElementById('popup_menu_signup').style.display = 'none';
                    document.getElementById('popup_menu_logoff').style.display = 'block';
                    //Show user tab
                    document.getElementById('tab7_nav').style.display = 'inline-block';
                    document.getElementById('prayertable_day').innerHTML='';
                    document.getElementById('prayertable_month').innerHTML='';
                    document.getElementById('prayertable_year').innerHTML='';
                    dialogue_loading(1);
                    user_settings_get(user_id.innerHTML).then(function(){
                        user_settings_load().then(function(){
                            settings_translate(true).then(function(){
                                settings_translate(false).then(function(){
                                    app_show();
                                    dialogue_loading(0);
                                })
                            })
                        })
                    });
                }
            });
        }
    })
}
async function onProviderSignIn_app(googleUser){
    await onProviderSignIn(googleUser, (err, result)=>{
        if (err==null){
            updateProviderUser_app(result.provider_no, 
                               result.profile_id, 
                               result.profile_first_name, 
                               result.profile_last_name, 
                               result.profile_image_url, 
                               result.profile_email);
        }
    })
}
async function profile_update_stat_app(){
    await profile_update_stat(get_lang_code(), (err, result) =>{
        if (err==null){
            profile_user_setting_stat(result.id);
        }
    })
}
async function profile_show_app(user_account_id_other = null, username = null, user_id, timezone, lang_code) {
    document.getElementById('dialogue_profile').style.visibility = "visible";
    document.getElementById('profile_top').style.display = "none";
    document.getElementById('profile_main_stat_row2').style.display = "none";
    document.getElementById('profile_user_settings_row').style.display = "none";
    
    profile_clear_app();
    if (user_account_id_other == null && user_id == '' && username == null) {
        document.getElementById('profile_info').style.display = "none";
    }
    else
        await profile_show(user_account_id_other, username, user_id, timezone, lang_code, (err, result)=>{
            if (err==null){
                if (result.profile_id != null){
                    if (result.private==1 && parseInt(user_id) !== result.profile_id) {
                        //private
                        null;
                    } else {
                        //public
                        if (user_id != ''){
                            document.getElementById('profile_main_stat_row2').style.display = "block";
                            document.getElementById('profile_user_settings_row').style.display = "block";
                            //user settings
                            profile_user_setting_stat(result.profile_id);
                            profile_show_user_setting();
                        }
                    }    
                }
            }
            else{
                if (err == 500 && username !== null) {
                    document.getElementById('dialogue_profile').style.visibility = 'hidden';
                    //refresh webpage without not found username
                    //this does not occur in webapp
                    document.location.href = "/";
                }
            }
        });
}
function profile_detail_app(detailchoice, user_id, lang_code, rest_url_app, fetch_detail, header_app, click_function) {
    if (parseInt(user_id) || 0 !== 0) {
        if (detailchoice == 0){
            //user settings
            document.getElementById('profile_user_settings_row').style.display = 'block';
        }
        else{
            //Following
            //Followed
            //Like user
            //Liked user
            //Like user setting
            //Liked user setting
            document.getElementById('profile_user_settings_row').style.display = 'none';
        }
        profile_detail(detailchoice, user_id, document.getElementById('setting_select_timezone_current').value, lang_code, rest_url_app, fetch_detail, header_app, click_function);
    } 
    else
        show_common_dialogue('LOGIN');
                
}
/*----------------------- */
/* USER SETTINGS          */
/*----------------------- */
function get_lang_code(){
    return document.getElementById('setting_select_locale').value;
}
async function user_settings_get(userid, show_ui = 1, user_setting_id = '') {
    let select = document.getElementById("setting_select_user_setting");
    let json;
    let i;
    let status;
    
    await fetch(window.global_rest_url_base + window.global_rest_app1_user_setting_user_account_id + userid +
                '?app_id=' + window.global_app_id + 
                '&lang_code=' + get_lang_code(), {
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
                select.innerHTML = '';
                //fill select
                let option_html = '';
                for (i = 0; i < json.count; i++) {
                    option_html += `<option value=${i} id=${json.items[i].id} description='${json.items[i].description}'
                                        regional_language_locale=${json.items[i].regional_language_locale}
                                        regional_current_timezone=${json.items[i].regional_current_timezone}
                                        regional_timezone=${json.items[i].regional_timezone}
                                        regional_number_system=${json.items[i].regional_number_system}
                                        regional_layout_direction=${json.items[i].regional_layout_direction}
                                        regional_second_language_locale=${json.items[i].regional_second_language_locale}
                                        regional_column_title=${json.items[i].regional_column_title}
                                        regional_arabic_script=${json.items[i].regional_arabic_script}
                                        regional_calendar_type=${json.items[i].regional_calendar_type}
                                        regional_calendar_hijri_type=${json.items[i].regional_calendar_hijri_type}
                                        gps_map_type=${json.items[i].gps_map_type}
                                        ${json.items[i].gps_country_id==null?`gps_country_id `:'gps_country_id=' + json.items[i].gps_country_id}
                                        ${json.items[i].gps_city_id==null?`gps_city_id `:'gps_city_id=' + json.items[i].gps_city_id}
                                        ${json.items[i].gps_popular_place_id==null?`gps_popular_place_id `:'gps_popular_place_id=' + json.items[i].gps_popular_place_id}
                                        gps_lat_text=${json.items[i].gps_lat_text}
                                        gps_long_text=${json.items[i].gps_long_text}
                                        design_theme_day_id=${json.items[i].design_theme_day_id}
                                        design_theme_month_id=${json.items[i].design_theme_month_id}
                                        design_theme_year_id=${json.items[i].design_theme_year_id}
                                        design_paper_size=${json.items[i].design_paper_size}
                                        design_row_highlight=${json.items[i].design_row_highlight}
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
                                        prayer_method=${json.items[i].prayer_method}
                                        prayer_asr_method=${json.items[i].prayer_asr_method}
                                        prayer_high_latitude_adjustment=${json.items[i].prayer_high_latitude_adjustment}
                                        prayer_time_format=${json.items[i].prayer_time_format}
                                        prayer_hijri_date_adjustment=${json.items[i].prayer_hijri_date_adjustment}
                                        prayer_fajr_iqamat=${json.items[i].prayer_fajr_iqamat}
                                        prayer_dhuhr_iqamat=${json.items[i].prayer_dhuhr_iqamat}
                                        prayer_asr_iqamat=${json.items[i].prayer_asr_iqamat}
                                        prayer_maghrib_iqamat=${json.items[i].prayer_maghrib_iqamat}
                                        prayer_isha_iqamat=${json.items[i].prayer_isha_iqamat}
                                        prayer_column_imsak_checked=${json.items[i].prayer_column_imsak_checked}
                                        prayer_column_sunset_checked=${json.items[i].prayer_column_sunset_checked}
                                        prayer_column_midnight_checked=${json.items[i].prayer_column_midnight_checked}
                                        prayer_column_fast_start_end=${json.items[i].prayer_column_fast_start_end}
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
                exception(status, result, get_lang_code());
            }
        })
        .catch(function(error) {
            show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
        });
}


function user_setting_link(item){
    let paper_size_select = document.getElementById('setting_select_report_papersize');
    let common_url;
    let url_type='';
    let select_user_setting = document.getElementById('setting_select_user_setting');
    let user_account_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id');
    let sid = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    common_url = get_report_url(user_account_id, sid, paper_size_select.options[paper_size_select.selectedIndex].value);
    switch (item.id){
        case 'user_day_html':
        case 'user_month_html':
        case 'user_year_html':{
            url_type = get_report_url_type(item.id, 'HTML');
            preview_report(`${common_url}&format=html${url_type}`, 'html');
            break;
        }
        case 'user_day_html_copy':
        case 'user_month_html_copy':
        case 'user_year_html_copy':{
            url_type = get_report_url_type(item.id, 'HTML');
            let text_copy = `${common_url}&format=html${url_type}`;
            navigator.clipboard.writeText(text_copy) .then(() => {
                show_message('INFO', null, null, window.global_button_default_icon_link, window.global_main_app_id, window.global_lang_code);
            });
            break;
        }
        case 'user_day_pdf':
        case 'user_month_pdf':
        case 'user_year_pdf':{
            url_type = get_report_url_type(item.id, 'PDF');
            preview_report(`${common_url}&format=pdf${url_type}`, 'pdf');
            break;
        }
        case 'user_day_pdf_copy':
        case 'user_month_pdf_copy':
        case 'user_year_pdf_copy':{
            url_type = get_report_url_type(item.id, 'PDF');
            let text_copy = `${common_url}&format=pdf${url_type}`;
            navigator.clipboard.writeText(text_copy) .then(() => {
                show_message('INFO', null, null, window.global_button_default_icon_link, window.global_main_app_id, window.global_lang_code);
            });
            break;
        }
    }
}
async function user_settings_load(show_ui = 1) {

    let select_user_setting = document.getElementById('setting_select_user_setting');
    //Regional
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_language_locale'),
        document.getElementById('setting_select_locale'), 1);

    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_current_timezone'),
        document.getElementById('setting_select_timezone_current'), 1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_timezone'),
        document.getElementById('setting_select_report_timezone'), 1)

    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_number_system'),
        document.getElementById('setting_select_report_numbersystem'), 1)
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_layout_direction'),
        document.getElementById('setting_select_report_direction'), 1)
    
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_second_language_locale'),
        document.getElementById('setting_select_report_locale_second'),1);
    
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_column_title'),
        document.getElementById('setting_select_report_coltitle'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_arabic_script'),
        document.getElementById('setting_select_report_arabic_script'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_type'),
        document.getElementById('setting_select_calendartype'),1);
    
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_hijri_type'),
        document.getElementById('setting_select_calendar_hijri_type'),1);

    if (show_ui == 1) {
        //GPS

        SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_map_type'),
            document.getElementById('setting_select_maptype'),1);

        SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id'),
            document.getElementById('setting_select_country'),0);
        if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id')||null !=null) {
            //fill cities for chosen country
            await update_ui(5).then(function(){
                SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id'),
                    document.getElementById('setting_select_city'),0);
                if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id')||null !=null) {
                    //set GPS for chosen city
                    update_ui(6);
                }
            })
        }        
        SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id'),
            document.getElementById('setting_select_popular_place'),0);
        if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id')||null !=null) {
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
    if (show_ui == 1)
        if (
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id')||null == null &&
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id')||null == null &&
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id')||null == null) {
            update_map(document.getElementById('setting_input_long').value,
                document.getElementById('setting_input_lat').value,
                window.global_gps_map_zoom, //default zoom
                document.getElementById('setting_input_place').value, //text1
                document.getElementById('setting_label_report_timezone').innerHTML, //text2
                document.getElementById('setting_select_report_timezone').value, //text3
                window.global_gps_map_marker_div_gps, //marker for GPS
                window.global_gps_map_jumpto);
        }
    //Design
    if (show_ui == 1){
        set_theme_id('day', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_day_id'));
        set_theme_id('month', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_month_id'));
        set_theme_id('year', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_year_id'));
    }

    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_paper_size'),
        document.getElementById('setting_select_report_papersize'),1);
    
    document.getElementById('paper').className=document.getElementById('setting_select_report_papersize').value;
    
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_row_highlight'),
        document.getElementById('setting_select_report_highlight_row'),1);

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
        update_ui(15, 'setting_input_reporttitle_a' +
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
        update_ui(16, 'setting_input_reportfooter_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align'));
    }
    //Prayer
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_method'),
        document.getElementById('setting_select_method'),1);

    if (show_ui == 1){
        //show method parameters used
        update_ui(17);
    }
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_method'),
        document.getElementById('setting_select_asr'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_high_latitude_adjustment'),
        document.getElementById('setting_select_highlatitude'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_time_format'),
        document.getElementById('setting_select_timeformat'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_hijri_date_adjustment'),
        document.getElementById('setting_select_hijri_adjustment'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_fajr'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_dhuhr'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_asr'),1);
    
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_maghrib_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_maghrib'),1);
    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_isha_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_isha'),1);

    document.getElementById('setting_checkbox_report_show_imsak').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_imsak_checked'));
    document.getElementById('setting_checkbox_report_show_sunset').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_sunset_checked'));
    document.getElementById('setting_checkbox_report_show_midnight').checked =
        number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_midnight_checked'));

    SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_fast_start_end'),
        document.getElementById('setting_select_report_show_fast_start_end'),1);

    return null;
}

async function user_settings_function(function_name, initial_user_setting, callBack) {
    let user_account_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    let description = document.getElementById('setting_input_place').value;
    let status;
    let select_setting_country = document.getElementById('setting_select_country');
    let select_setting_city = document.getElementById('setting_select_city');
    let select_setting_popular_place = document.getElementById('setting_select_popular_place');
    if (check_input(description, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_lat').value, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_long').value, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_reporttitle1').value, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_reporttitle2').value, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_reporttitle3').value, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_reportfooter1').value, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_reportfooter2').value, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_reportfooter3').value, get_lang_code()) == false ||
        check_input(document.getElementById('setting_input_long').value, get_lang_code()) == false)
        return;
    //boolean use boolean_to_number()
    //store 0/1 for checked value for checkboxes
    //use btoa() for images to encode with BASE64 to BLOB column.
    let json_data =
        `{"description": "${description}",
          "regional_language_locale": "${get_lang_code()}",
          "regional_current_timezone": "${document.getElementById('setting_select_timezone_current').value}",
          "regional_timezone": "${document.getElementById('setting_select_report_timezone').value}",
          "regional_number_system": "${document.getElementById('setting_select_report_numbersystem').value}",
          "regional_layout_direction": "${document.getElementById('setting_select_report_direction').value}",
          "regional_second_language_locale": "${document.getElementById('setting_select_report_locale_second').value}",
          "regional_column_title": "${document.getElementById('setting_select_report_coltitle').value}",
          "regional_arabic_script": "${document.getElementById('setting_select_report_arabic_script').value}",
          "regional_calendar_type": "${document.getElementById('setting_select_calendartype').value}",
          "regional_calendar_hijri_type": "${document.getElementById('setting_select_calendar_hijri_type').value}",

          "gps_map_type": "${document.getElementById('setting_select_maptype').value}",
          "gps_country_id": ${select_setting_country[select_setting_country.selectedIndex].getAttribute('id')||null},
          "gps_city_id": ${select_setting_city[select_setting_city.selectedIndex].getAttribute('id')||null},
          "gps_popular_place_id": ${select_setting_popular_place[select_setting_popular_place.selectedIndex].getAttribute('id')||null},
          "gps_lat_text": "${document.getElementById('setting_input_lat').value}",
          "gps_long_text": "${document.getElementById('setting_input_long').value}",

          "design_theme_day_id": ${get_theme_id('day')},
          "design_theme_month_id": ${get_theme_id('month')},
          "design_theme_year_id": ${get_theme_id('year')},
          "design_paper_size": "${document.getElementById('setting_select_report_papersize').value}",
          "design_row_highlight": "${document.getElementById('setting_select_report_highlight_row').value}",
          "design_column_weekday_checked": ${boolean_to_number(document.getElementById('setting_checkbox_report_show_weekday').checked)},
          "design_column_calendartype_checked": ${boolean_to_number(document.getElementById('setting_checkbox_report_show_calendartype').checked)},
          "design_column_notes_checked": ${boolean_to_number(document.getElementById('setting_checkbox_report_show_notes').checked)},
          "design_column_gps_checked": ${boolean_to_number(document.getElementById('setting_checkbox_report_show_gps').checked)},
          "design_column_timezone_checked": ${boolean_to_number(document.getElementById('setting_checkbox_report_show_timezone').checked)},

          "image_header_image_img": "${btoa(document.getElementById('setting_reportheader_img').src)}",
          "image_footer_image_img": "${btoa(document.getElementById('setting_reportfooter_img').src)}",

          "text_header_1_text": "${document.getElementById('setting_input_reporttitle1').value}",
          "text_header_2_text": "${document.getElementById('setting_input_reporttitle2').value}",
          "text_header_3_text": "${document.getElementById('setting_input_reporttitle3').value}",
          "text_header_align": "${align_button_value('reporttitle')}",
          "text_footer_1_text": "${document.getElementById('setting_input_reportfooter1').value}",
          "text_footer_2_text": "${document.getElementById('setting_input_reportfooter2').value}",
          "text_footer_3_text": "${document.getElementById('setting_input_reportfooter3').value}",
          "text_footer_align": "${align_button_value('reportfooter')}",

          "prayer_method": "${document.getElementById('setting_select_method').value}",
          "prayer_asr_method": "${document.getElementById('setting_select_asr').value}",
          "prayer_high_latitude_adjustment": "${document.getElementById('setting_select_highlatitude').value}",
          "prayer_time_format": "${document.getElementById('setting_select_timeformat').value}",
          "prayer_hijri_date_adjustment": "${document.getElementById('setting_select_hijri_adjustment').value}",
          "prayer_fajr_iqamat": "${document.getElementById('setting_select_report_iqamat_title_fajr').value}",
          "prayer_dhuhr_iqamat": "${document.getElementById('setting_select_report_iqamat_title_dhuhr').value}",
          "prayer_asr_iqamat": "${document.getElementById('setting_select_report_iqamat_title_asr').value}",
          "prayer_maghrib_iqamat": "${document.getElementById('setting_select_report_iqamat_title_maghrib').value}",
          "prayer_isha_iqamat": "${document.getElementById('setting_select_report_iqamat_title_isha').value}",
          "prayer_column_imsak_checked": ${boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked)},
          "prayer_column_sunset_checked": ${boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked)},
          "prayer_column_midnight_checked": ${boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked)},
          "prayer_column_fast_start_end": "${document.getElementById('setting_select_report_show_fast_start_end').value}",
          "user_account_id": ${user_account_id}
         }`;
    let method;
    let url;
    let old_button;
    let spinner_item;
    
    switch (function_name){
        case 'ADD_LOGIN':
        case 'ADD':{
            if (function_name=='ADD'){
                spinner_item = document.getElementById('setting_btn_user_add')
                old_button = spinner_item.innerHTML;
                spinner_item.innerHTML = window.global_button_spinner;    
            }
            method = 'POST';
            url = window.global_rest_url_base + window.global_rest_app1_user_setting + 
                  `?app_id=${window.global_app_id}&lang_code=${get_lang_code()}` + 
                  `&initial=${initial_user_setting==true?1:0}`;
            break;
        }
        case 'SAVE':{
            spinner_item = document.getElementById('setting_btn_user_save')
            old_button = spinner_item.innerHTML;
            spinner_item.innerHTML = window.global_button_spinner;
            method = 'PUT';
            let select_user_setting = document.getElementById('setting_select_user_setting');
            let user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
            url = window.global_rest_url_base + window.global_rest_app1_user_setting + user_setting_id + 
                  `?app_id=${window.global_app_id}&lang_code=${get_lang_code()}`;
            break;
        }
        default:{
            break;
        }
    }
    await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.global_rest_at
            },
            body: json_data
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(result) {
            if (status === 200) {
                if (function_name !='ADD_LOGIN')
                    spinner_item.innerHTML = old_button;
                let json = JSON.parse(result);
                switch (function_name){
                    case 'ADD':{
                        //update user settings select with saved data
                        //save current settings to new option with 
                        //returned user_setting_id + user_account_id (then call set_settings_select)
                        let select = document.getElementById("setting_select_user_setting");
                        select.innerHTML += `<option id=${json.id} user_account_id=${user_account_id} >${description}</option>`;
                        select.selectedIndex = select.options[select.options.length - 1].index;
                        select.options[select.options.length - 1].value = select.selectedIndex;
                        set_settings_select();
                        break;
                    }
                    case 'SAVE':{
                        //update user settings select with saved data
                        set_settings_select(); 
                        break;
                    }
                    default:{
                        break;
                    }
                }
                callBack(null, null);
            } else {
                if (function_name !='ADD_LOGIN')
                    spinner_item.innerHTML = old_button;
                exception(status, result, get_lang_code());
                callBack(result, null);
            }
        })
        .catch(function(error) {
            if (function_name !='ADD_LOGIN')
                spinner_item.innerHTML = old_button;
            show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
            callBack(error, null);
        });
}

function user_settings_delete(choice=null) {
    let select_user_setting = document.getElementById('setting_select_user_setting');
    let user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    let status;
    let function_delete_user_setting = function() { document.getElementById('dialogue_message').style.visibility = 'hidden';user_settings_delete(1) };
    
    switch (choice){
        case null:{
            show_message('CONFIRM',null,function_delete_user_setting, null, window.global_app_id, get_lang_code());
            break;
        }
        case 1:{
            if (select_user_setting.length > 1) {
                let old_button = document.getElementById('setting_btn_user_delete').innerHTML;
                document.getElementById('setting_btn_user_delete').innerHTML = window.global_button_spinner;
                fetch(window.global_rest_url_base + window.global_rest_app1_user_setting + user_setting_id + 
                        '?app_id=' + window.global_app_id +
                        '&lang_code=' + get_lang_code(), 
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + window.global_rest_at
                        }
                    })
                    .then(function(response) {
                        status = response.status;
                        return response.text();
                    })
                    .then(function(result) {
                        if (status == 200) {
                            let select = document.getElementById("setting_select_user_setting");
                            //delete current option
                            select.remove(select.selectedIndex);
                            //load next available
                            user_settings_load().then(function(){
                                settings_translate(true).then(function(){
                                    settings_translate(false).then(function(){
                                        document.getElementById('setting_btn_user_delete').innerHTML = old_button;
                                    })
                                })
                            })
                            
                        } else {
                            document.getElementById('setting_btn_user_delete').innerHTML = old_button;
                            exception(status, result, get_lang_code());
                        }
                    })
                    .catch(function(error) {
                        document.getElementById('setting_btn_user_delete').innerHTML = old_button;
                        show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
                    });
            } else {
                //You can't delete last user setting
                show_message('ERROR', 20302, null, null, window.global_app_id, get_lang_code());
            }
        }
    }
    return null;
}

async function set_default_settings() {
    let current_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let current_number_system = Intl.NumberFormat().resolvedOptions().numberingSystem;

    //Regional
    //set according to users browser settings
    //set default language
    //navigator.userLanguage is for IE only, Edge reads navigator.language
    //reads lowercase since Chromium/Chrome returns en-US, safari returns en
    //and select options are saved with lowercase
    SearchAndSetSelectedIndex(navigator.language.toLowerCase(), document.getElementById('setting_select_locale'),1);
    //default timezone current timezone
    SearchAndSetSelectedIndex(current_timezone, document.getElementById('setting_select_timezone_current'),1);
    //default report timezone current timezone, 
    //will be changed user timezone to place timezone if no GPS can be set and default place will be used
    SearchAndSetSelectedIndex(current_timezone, document.getElementById('setting_select_report_timezone'),1);
    //set default numberformat numbersystem
    SearchAndSetSelectedIndex(current_number_system, document.getElementById('setting_select_report_numbersystem'),1);
    //set default for others in Regional

    SearchAndSetSelectedIndex(window.global_regional_default_direction, document.getElementById('setting_select_report_direction'),1);
    SearchAndSetSelectedIndex(window.global_regional_default_locale_second, document.getElementById('setting_select_report_locale_second'),1);
    SearchAndSetSelectedIndex(window.window.global_regional_default_coltitle, document.getElementById('setting_select_report_coltitle'),1);
    SearchAndSetSelectedIndex(window.global_regional_default_arabic_script, document.getElementById('setting_select_report_arabic_script'),1);
    SearchAndSetSelectedIndex(window.global_regional_default_calendartype, document.getElementById('setting_select_calendartype'),1);
    SearchAndSetSelectedIndex(window.global_regional_default_calendar_hijri_type, document.getElementById('setting_select_calendar_hijri_type'),1);

    //GPS
    SearchAndSetSelectedIndex(window.global_gps_map_maptype, document.getElementById('setting_select_maptype'),1);
    SearchAndSetSelectedIndex(window.global_gps_default_country, document.getElementById('setting_select_country'),0);
    SearchAndSetSelectedIndex(window.global_gps_default_city, document.getElementById('setting_select_city'),0);
    
    //set according to users GPS/IP settings
    if (window.global_session_user_gps_latitude != '' && window.global_session_user_gps_longitude != '') {
        document.getElementById('setting_input_lat').value = window.global_session_user_gps_latitude;
        document.getElementById('setting_input_long').value = window.global_session_user_gps_longitude;
        //Update GPS position
        update_ui(9);
        document.getElementById('setting_input_place').value = window.global_session_user_gps_place;
    } else {
        //Set Makkah as default
        let select_place = document.getElementById('setting_select_popular_place');
        select_place.selectedIndex = select_get_selectindex(select_place.id, window.global_gps_default_place_id);
        //Update popular places
        update_ui(7);
    }
    //Design
    set_theme_id('day', window.global_design_default_theme_day);
    set_theme_id('month', window.global_design_default_theme_month);
    set_theme_id('year', window.global_design_default_theme_year);

    SearchAndSetSelectedIndex(window.global_design_default_papersize, document.getElementById('setting_select_report_papersize'),1);
    document.getElementById('paper').className=document.getElementById('setting_select_report_papersize').value;
    SearchAndSetSelectedIndex(window.global_design_default_highlight_row, document.getElementById('setting_select_report_highlight_row'),1);
    
    document.getElementById('setting_checkbox_report_show_weekday').checked = window.global_design_default_show_weekday;
    document.getElementById('setting_checkbox_report_show_calendartype').checked = window.global_design_default_show_calendartype;
    document.getElementById('setting_checkbox_report_show_notes').checked = window.global_design_default_show_notes;
    document.getElementById('setting_checkbox_report_show_gps').checked = window.global_design_default_show_gps;
    document.getElementById('setting_checkbox_report_show_timezone').checked = window.global_design_default_show_timezone;

    //Image
    document.getElementById('setting_input_reportheader_img').value = '';
    if (window.global_image_default_report_header_src == null || window.global_image_default_report_header_src == '')
        recreate_img(document.getElementById('setting_reportheader_img'));
    else {
        document.getElementById('setting_reportheader_img').src = window.global_image_default_report_header_src;
    }
    document.getElementById('setting_input_reportfooter_img').value = '';
    if (window.global_image_default_report_footer_src == null || window.global_image_default_report_footer_src == '')
        recreate_img(document.getElementById('setting_reportfooter_img'));
    else {
        document.getElementById('setting_reportfooter_img').src = window.global_image_default_report_footer_src;
    }
    //Text
    document.getElementById('setting_input_reporttitle1').value = window.global_text_default_reporttitle1;
    document.getElementById('setting_input_reporttitle2').value = window.global_text_default_reporttitle2;
    document.getElementById('setting_input_reporttitle3').value = window.global_text_default_reporttitle3;
    document.getElementById('setting_input_reporttitle_aleft').classList = 'setting_button'; //Align left not active
    document.getElementById('setting_input_reporttitle_acenter').classList = 'setting_button'; //Align center not active
    document.getElementById('setting_input_reporttitle_aright').classList = 'setting_button'; //Align right not active
    document.getElementById('setting_input_reportfooter1').value = window.global_text_default_reportfooter1;
    document.getElementById('setting_input_reportfooter2').value = window.global_text_default_reportfooter2;
    document.getElementById('setting_input_reportfooter3').value = window.global_text_default_reportfooter3;
    document.getElementById('setting_input_reportfooter_aleft').classList = 'setting_button'; //Align left not active
    document.getElementById('setting_input_reportfooter_acenter').classList = 'setting_button'; //Align center not active
    document.getElementById('setting_input_reportfooter_aright').classList = 'setting_button'; //Align right not active

    //Prayer
    SearchAndSetSelectedIndex(window.global_prayer_default_method, document.getElementById('setting_select_method'),1);
    //show method parameters used
    update_ui(17);

    SearchAndSetSelectedIndex(window.global_prayer_default_asr, document.getElementById('setting_select_asr'),1);
    SearchAndSetSelectedIndex(window.global_prayer_default_highlatitude, document.getElementById('setting_select_highlatitude'),1);
    SearchAndSetSelectedIndex(window.global_prayer_default_timeformat, document.getElementById('setting_select_timeformat'),1);
    SearchAndSetSelectedIndex(window.global_prayer_default_hijri_adjustment, document.getElementById('setting_select_method'),1);
    
    SearchAndSetSelectedIndex(window.global_prayer_default_iqamat_title_fajr, document.getElementById('setting_select_report_iqamat_title_fajr'),1);
    SearchAndSetSelectedIndex(window.global_prayer_default_iqamat_title_dhuhr, document.getElementById('setting_select_report_iqamat_title_dhuhr'),1);
    SearchAndSetSelectedIndex(window.global_prayer_default_iqamat_title_asr, document.getElementById('setting_select_report_iqamat_title_asr'),1);
    SearchAndSetSelectedIndex(window.global_prayer_default_iqamat_title_maghrib, document.getElementById('setting_select_report_iqamat_title_maghrib'),1);
    SearchAndSetSelectedIndex(window.global_prayer_default_iqamat_title_isha, document.getElementById('setting_select_report_iqamat_title_isha'),1);

    document.getElementById('setting_checkbox_report_show_imsak').checked = window.global_prayer_default_show_imsak;
    document.getElementById('setting_checkbox_report_show_sunset').checked = window.global_prayer_default_show_sunset;
    document.getElementById('setting_checkbox_report_show_midnight').checked = window.global_prayer_default_show_midnight;
    SearchAndSetSelectedIndex(window.global_prayer_default_show_fast_start_end, document.getElementById('setting_select_report_show_fast_start_end'),1);
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
    let option = document.getElementById("setting_select_user_setting").options[document.getElementById("setting_select_user_setting").selectedIndex];
    option.text = document.getElementById('setting_input_place').value;
    
    option.setAttribute('description', document.getElementById('setting_input_place').value);
    option.setAttribute('regional_language_locale', get_lang_code());
    option.setAttribute('regional_current_timezone', document.getElementById('setting_select_timezone_current').value);
    option.setAttribute('regional_timezone', document.getElementById('setting_select_report_timezone').value);
    option.setAttribute('regional_number_system', document.getElementById('setting_select_report_numbersystem').value);
    option.setAttribute('regional_layout_direction', document.getElementById('setting_select_report_direction').value);
    option.setAttribute('regional_second_language_locale', document.getElementById('setting_select_report_locale_second').value);
    option.setAttribute('regional_column_title', document.getElementById('setting_select_report_coltitle').value);
    option.setAttribute('regional_arabic_script', document.getElementById('setting_select_report_arabic_script').value);
    option.setAttribute('regional_calendar_type', document.getElementById('setting_select_calendartype').value);
    option.setAttribute('regional_calendar_hijri_type', document.getElementById('setting_select_calendar_hijri_type').value);

    option.setAttribute('gps_map_type', document.getElementById('setting_select_maptype').value);
    option.setAttribute('gps_country_id', document.getElementById('setting_select_country')[document.getElementById('setting_select_country').selectedIndex].getAttribute('id'));
    option.setAttribute('gps_city_id', document.getElementById('setting_select_city')[document.getElementById('setting_select_city').selectedIndex].getAttribute('id'));
    option.setAttribute('gps_popular_place_id', document.getElementById('setting_select_popular_place')[document.getElementById('setting_select_popular_place').selectedIndex].getAttribute('id'));
    option.setAttribute('gps_lat_text', document.getElementById('setting_input_lat').value);
    option.setAttribute('gps_long_text', document.getElementById('setting_input_long').value);

    option.setAttribute('design_theme_day_id', get_theme_id('day'));
    option.setAttribute('design_theme_month_id', get_theme_id('month'));
    option.setAttribute('design_theme_year_id', get_theme_id('year'));
    option.setAttribute('design_paper_size', document.getElementById('setting_select_report_papersize').value);
    option.setAttribute('design_row_highlight', document.getElementById('setting_select_report_highlight_row').value);
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

    option.setAttribute('prayer_method', document.getElementById('setting_select_method').value);
    option.setAttribute('prayer_asr_method', document.getElementById('setting_select_asr').value);
    option.setAttribute('prayer_high_latitude_adjustment', document.getElementById('setting_select_highlatitude').value);
    option.setAttribute('prayer_time_format', document.getElementById('setting_select_timeformat').value);
    option.setAttribute('prayer_hijri_date_adjustment', document.getElementById('setting_select_hijri_adjustment').value);
    option.setAttribute('prayer_fajr_iqamat', document.getElementById('setting_select_report_iqamat_title_fajr').value);
    option.setAttribute('prayer_dhuhr_iqamat', document.getElementById('setting_select_report_iqamat_title_dhuhr').value);
    option.setAttribute('prayer_asr_iqamat', document.getElementById('setting_select_report_iqamat_title_asr').value);
    option.setAttribute('prayer_maghrib_iqamat', document.getElementById('setting_select_report_iqamat_title_maghrib').value);
    option.setAttribute('prayer_isha_iqamat', document.getElementById('setting_select_report_iqamat_title_isha').value);
    option.setAttribute('prayer_column_imsak_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked));
    option.setAttribute('prayer_column_sunset_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked));
    option.setAttribute('prayer_column_midnight_checked', boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked));
    option.setAttribute('prayer_column_fast_start_end', document.getElementById('setting_select_report_show_fast_start_end').value);
}

function update_settings_icon(url = '', logoff = false) {
    let img_account_image_url = document.getElementById('user_account_image_url');
    let img_account_image_url2  = document.getElementById('setting_avatar_logged_in');
    let default_avatar = document.getElementById('user_account_default_avatar');
    if (logoff == true) {
        //hide image url and show the icon
        img_account_image_url.style.display = 'none';
        img_account_image_url.src = '';
        img_account_image_url2.style.display = 'none';
        img_account_image_url2.src = '';
        default_avatar.style.display = 'inline-block';
    } else {
        //show image url in user setting and hide the icon
        img_account_image_url.style.display = 'inline-block';
        img_account_image_url.src = url;
        img_account_image_url2.style.display = 'inline-block';
        img_account_image_url2.src = url;
        default_avatar.style.display = 'none';
    }
    return null;
}
function profile_user_setting_stat(id){
    let status;
    fetch(window.global_rest_url_base + window.global_rest_app1_user_setting_profile + id + 
        '?app_id=' + window.global_app_id + 
        '&lang_code=' + get_lang_code(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.global_rest_dt
        }
    })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(response) {
        if (status == 200) {
            json = JSON.parse(response);
            document.getElementById('profile_info_user_setting_likes_count').innerHTML = json.items.count_user_setting_likes;
            document.getElementById('profile_info_user_setting_liked_count').innerHTML = json.items.count_user_setting_liked;
        }
    })
    .catch(function(error) {
        show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
    });
}

function profile_user_setting_link(item){
    let paper_size_select = document.getElementById('setting_select_report_papersize');
    let common_url;
    let url_type='';
    let select_user_setting = document.getElementById('profile_select_user_settings');
    let user_account_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id');
    let sid = select_user_setting[select_user_setting.selectedIndex].getAttribute('sid');
    common_url = get_report_url(user_account_id, sid, paper_size_select.options[paper_size_select.selectedIndex].value);
    url_type = get_report_url_type(item.id, 'HTML');
    switch (item.id){
        case 'profile_user_settings_day':
        case 'profile_user_settings_month':
        case 'profile_user_settings_year':{
            updateViewStat_app(sid,user_account_id);
            preview_report(`${common_url}&format=html${url_type}`, 'html');
            break;
        }
        case 'profile_user_settings_like':{
            user_settings_like(sid);
            break;
        }
    }
}
function profile_show_user_setting_detail(liked, count_likes, count_views){
    
    document.getElementById('profile_user_settings_like').children[0].style.display = `${liked == 1?'none':'block'}`;
    document.getElementById('profile_user_settings_like').children[1].style.display = `${liked == 1?'block':'none'}`;

    document.getElementById('profile_user_settings_info_like_count').innerHTML = count_likes;
    document.getElementById('profile_user_settings_info_view_count').innerHTML = count_views;
}
function profile_show_user_setting() {
    let user_id = document.getElementById('setting_data_userid_logged_in');
    let status;
    document.getElementById('profile_user_settings_row').style.display = 'block';

    fetch(window.global_rest_url_base + window.global_rest_app1_user_setting_profile_all + document.getElementById('profile_id').innerHTML + 
            '?app_id=' + window.global_app_id +
            '&lang_code=' + get_lang_code() + 
            '&id=' + user_id.innerHTML,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.global_rest_dt
            }
        })
        .then(function(response) {
            status = response.status;
            return response.text();
        })
        .then(function(response) {
            if (status == 200) {
                json = JSON.parse(response);
                let profile_select_user_settings = document.getElementById('profile_select_user_settings');
                profile_select_user_settings.innerHTML='';
                let html = '';
                for (i = 0; i < json.count; i++) {
                    html += `<option id="${i}" 
                            value=""
                            sid=${json.items[i].id} 
                            user_account_id=${json.items[i].user_account_id}
                            liked=${json.items[i].liked}
                            count_likes=${json.items[i].count_likes}
                            count_views=${json.items[i].count_views}
                            >${json.items[i].description}
                            </option>`;
                }
                profile_select_user_settings.innerHTML = html;
                profile_show_user_setting_detail(profile_select_user_settings.options[profile_select_user_settings.selectedIndex].getAttribute('liked'), 
                                                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].getAttribute('count_likes'), 
                                                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].getAttribute('count_views'));
            }
        })
        .catch(function(error) {
            show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
        });
}
function profile_user_setting_update_stat(){
    let profile_id = document.getElementById('profile_id').innerHTML;
    let user_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    let status;
    fetch(window.global_rest_url_base + window.global_rest_app1_user_setting_profile_all + profile_id + 
            '?app_id=' + window.global_app_id +
            '&lang_code=' + get_lang_code() + 
            '&id=' + user_id,
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + window.global_rest_dt
            }
        })
    .then(function(response) {
        status = response.status;
        return response.text();
    })
    .then(function(response) {
        if (status == 200) {
            json = JSON.parse(response);
            let profile_select_user_settings = document.getElementById('profile_select_user_settings');
            for (i = 0; i < json.count; i++) {
                if (profile_select_user_settings.options[profile_select_user_settings.selectedIndex].getAttribute('sid')==json.items[i].id){
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].setAttribute('user_account_id', json.items[i].user_account_id);
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].setAttribute('liked', json.items[i].liked);
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].setAttribute('count_likes', json.items[i].count_likes);
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].setAttribute('count_views', json.items[i].count_views);
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].text = json.items[i].description;
                    profile_show_user_setting_detail(json.items[i].liked, 
                                                     json.items[i].count_likes, 
                                                     json.items[i].count_views);
                }
            }
            profile_user_setting_stat(profile_id);
        }
    })
    .catch(function(error) {
        show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
    });
}
function user_settings_like(user_setting_id) {
    let status;
    let user_id = document.getElementById('setting_data_userid_logged_in').innerHTML;
    let json_data;
    let method;

    json_data = '{"app1_user_setting_id":' + user_setting_id + '}';

    if (user_id == '')
        show_common_dialogue('LOGIN');
    else {
        if (document.getElementById('profile_user_settings_like').children[0].style.display == 'block') {
            method = 'POST';
        } else {
            method = 'DELETE';
        }
        fetch(window.global_rest_url_base + window.global_rest_app1_user_setting_like + user_id +
                '?app_id=' + window.global_app_id + 
                '&lang_code=' + get_lang_code(), {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + window.global_rest_at
                },
                body: json_data
            })
            .then(function(response) {
                status = response.status;
                return response.text();
            })
            .then(function(result) {
                if (status == 200) {
                    json = JSON.parse(result);
                    profile_user_setting_update_stat();
                } else {
                    exception(status, result, get_lang_code());
                }
            })
            .catch(function(error) {
                show_message('EXCEPTION', null,null, error, window.global_app_id, get_lang_code());
            });
    }
}
/*----------------------- */
/* EVENTS                 */
/*----------------------- */
function setEvents() {
    let input_username_login = document.getElementById("login_username");
    input_username_login.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            user_login_app().then(function(){
                //unfocus
                document.getElementById("login_username").blur();
            });
        }
    });
    let input_password_login = document.getElementById("login_password");
    input_password_login.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            user_login_app().then(function(){
                //unfocus
                document.getElementById("login_password").blur();
            });
        }
    });
    //onClick
    document.getElementById('toolbar_btn_zoomout').addEventListener('click', function() { zoom_paper(-1) }, false);
	document.getElementById('toolbar_btn_zoomin').addEventListener('click', function() { zoom_paper(1) }, false);
	document.getElementById('toolbar_btn_left').addEventListener('click', function() { update_timetable_report(getTimetable_type(), 'toolbar_navigation_btn_left', getReportSettings(), get_lang_code()) }, false);
	document.getElementById('toolbar_btn_right').addEventListener('click', function() { update_timetable_report(getTimetable_type(), 'toolbar_navigation_btn_right', getReportSettings(), get_lang_code()) }, false);
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

    document.getElementById('user_edit_btn_avatar_img').addEventListener('click', function() { document.getElementById('user_edit_input_avatar_img').click() }, false);
    document.getElementById('user_edit_input_avatar_img').addEventListener('change', function() { show_image(document.getElementById('user_edit_avatar_img'), this.id, window.global_user_image_avatar_width, window.global_user_image_avatar_height, get_lang_code()) }, false);
    
    document.getElementById('setting_btn_user_edit').addEventListener('click', function() { user_edit_app() }, false);

    document.getElementById('setting_btn_user_update').addEventListener('click', function() { user_update_app(); }, false);
     
    document.getElementById('setting_btn_user_save').addEventListener('click', function() { user_settings_function('SAVE', false, (err, result)=>{null;}) }, false);
    document.getElementById('setting_btn_user_add').addEventListener('click', function() { user_settings_function('ADD', false, (err, result)=>{null;}) }, false);
    document.getElementById('setting_btn_user_delete').addEventListener('click', function() { user_settings_delete() }, false);

    document.getElementById('profile_main_btn_user_settings').addEventListener('click', function() { profile_detail_app(0, document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(), window.global_rest_app1_user_setting_profile_detail, false) }, false);
    document.getElementById('profile_main_btn_following').addEventListener('click', function() { profile_detail_app(1,document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(), null, true, null, 'profile_show_app') }, false);
    document.getElementById('profile_main_btn_followed').addEventListener('click', function() { profile_detail_app(2, document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(), null, true, null, 'profile_show_app') }, false);
    document.getElementById('profile_main_btn_likes').addEventListener('click', function() { profile_detail_app(3, document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(), null, true, null, 'profile_show_app') }, false);
    document.getElementById('profile_main_btn_liked').addEventListener('click', function() { profile_detail_app(4, document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(), null, true, null, 'profile_show_app') }, false);
    document.getElementById('profile_main_btn_user_setting_likes').addEventListener('click', function() { profile_detail_app(5, document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(), window.global_rest_app1_user_setting_profile_detail, true, 
        window.global_button_default_icon_like +
        window.global_button_default_icon_day +
        window.global_button_default_icon_month +
        window.global_button_default_icon_year +
        window.global_button_default_icon_follows, 'profile_show_app') }, false);
    document.getElementById('profile_main_btn_user_setting_liked').addEventListener('click', function() { profile_detail_app(6, document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code(), window.global_rest_app1_user_setting_profile_detail, true, window.global_button_default_icon_like +
        window.global_button_default_icon_day +
        window.global_button_default_icon_month +
        window.global_button_default_icon_year +
        window.global_button_default_icon_followed, 'profile_show_app') }, false);
    document.getElementById('profile_follow').addEventListener('click', function() { user_function_app('FOLLOW') }, false);
    document.getElementById('profile_like').addEventListener('click', function() { user_function_app('LIKE') }, false);

    document.getElementById('profile_top_row1_1').addEventListener('click', function() { profile_top(1, document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code(), null, 'profile_show_app') }, false);
    document.getElementById('profile_top_row1_2').addEventListener('click', function() { profile_top(2, document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code(), null, 'profile_show_app') }, false);
    document.getElementById('profile_top_row1_3').addEventListener('click', function() { profile_top(3, document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code(), null, 'profile_show_app') }, false);
    document.getElementById('profile_top_row2_1').addEventListener('click', function() { profile_top(4, document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code(), window.global_rest_app1_user_setting_profile_top, 'profile_show_app') }, false);
    document.getElementById('profile_top_row2_2').addEventListener('click', function() { profile_top(5, document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code(), window.global_rest_app1_user_setting_profile_top, 'profile_show_app') }, false);

    document.getElementById('profile_user_settings_day').addEventListener('click', function() { profile_user_setting_link(this) }, false);
    document.getElementById('profile_user_settings_month').addEventListener('click', function() { profile_user_setting_link(this) }, false);
    document.getElementById('profile_user_settings_year').addEventListener('click', function() { profile_user_setting_link(this) }, false);
    document.getElementById('profile_user_settings_like').addEventListener('click', function() { profile_user_setting_link(this) }, false);
    document.getElementById('profile_home').addEventListener('click', function() {toolbar_bottom(7)}, false);
    document.getElementById('profile_close').addEventListener('click', function() {profile_close_app()}, false);


    document.getElementById('info_close').addEventListener('click', function() { document.getElementById('dialogue_info').style.visibility = 'hidden' }, false);

    document.getElementById('scan_open_mobile_close').addEventListener('click', function() { document.getElementById('dialogue_scan_open_mobile').style.visibility = 'hidden' }, false);
    document.getElementById('login_signup').addEventListener('click', function() { show_common_dialogue('SIGNUP') }, false);
    document.getElementById('login_button').addEventListener('click', function() { user_login_app() }, false);
    
    document.getElementById('login_close').addEventListener('click', function() { document.getElementById('dialogue_login').style.visibility = 'hidden' }, false);
    document.getElementById('user_edit_close').addEventListener('click', function() { user_edit_app() }, false);
    document.getElementById('signup_login').addEventListener('click', function() { show_common_dialogue('LOGIN') }, false);

    document.getElementById('signup_button').addEventListener('click', function() { user_signup(document.getElementById('setting_data_userid_logged_in'), get_lang_code()) }, false);
    document.getElementById('signup_close').addEventListener('click', function() { document.getElementById('dialogue_signup').style.visibility = 'hidden' }, false);
    
    document.getElementById('message_cancel').addEventListener('click', function() { document.getElementById("dialogue_message").style.visibility = "hidden" }, false);

    document.getElementById('window_preview_close').addEventListener('click', function() { document.getElementById('window_preview_content').onload='';document.getElementById('window_preview_content').src='';document.getElementById('window_preview_toolbar_qr').innerHTML='';document.getElementById('window_preview_report').style.visibility = 'hidden' }, false);
       
    document.getElementById('toolbar_btn_print').addEventListener('click', function() { toolbar_bottom(1) }, false);
    document.getElementById('toolbar_btn_day').addEventListener('click', function() { toolbar_bottom(2) }, false);
    document.getElementById('toolbar_btn_month').addEventListener('click', function() { toolbar_bottom(3) }, false);
    document.getElementById('toolbar_btn_year').addEventListener('click', function() { toolbar_bottom(4) }, false);
    
    document.getElementById('popup_menu_login').addEventListener('click', function() { show_common_dialogue('LOGIN') }, false);
    document.getElementById('popup_menu_signup').addEventListener('click', function() { show_common_dialogue('SIGNUP') }, false);
    document.getElementById('popup_menu_logoff').addEventListener('click', function() { user_logoff_app() }, false);
    document.getElementById('popup_menu_profile').addEventListener('click', function() { toolbar_bottom(6) }, false);
    document.getElementById('popup_menu_profile_top').addEventListener('click', function() { toolbar_bottom(7) }, false);
    document.getElementById('popup_menu_settings').addEventListener('click', function() { toolbar_bottom(5) }, false);

    document.getElementById('user_day_html').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_day_html_copy').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_day_pdf').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_day_pdf_copy').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_month_html').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_month_html_copy').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_month_pdf').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_month_pdf_copy').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_year_html').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_year_html_copy').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_year_pdf').addEventListener('click', function() { user_setting_link(this) }, false);
    document.getElementById('user_year_pdf_copy').addEventListener('click', function() { user_setting_link(this) }, false);

    document.getElementById('info_link1').addEventListener('click', function() {document.getElementById("window_info").style.display = "block"}, false);
    document.getElementById('info_link2').addEventListener('click', function() {document.getElementById("window_info").style.display = "block"}, false);
    document.getElementById('info_link3').addEventListener('click', function() {document.getElementById("window_info").style.display = "block"}, false);
    document.getElementById('info_link4').addEventListener('click', function() {document.getElementById("window_info").style.display = "block"}, false);
    document.getElementById('info_link5').addEventListener('click', function() {document.getElementById("window_info").style.display = "block"}, false);
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
                       
    
    document.getElementById('setting_select_user_setting').addEventListener('change', function() {user_settings_load().then(function(){settings_translate(true).then(function(){settings_translate(false);})}) }, false);

    document.getElementById('app_select_theme').addEventListener('change', function() { app_select_theme() }, false);
          
    document.getElementById('profile_select_user_settings').addEventListener('change', 
        function() { profile_show_user_setting_detail(this.options[this.selectedIndex].getAttribute('liked'), 
                                                      this.options[this.selectedIndex].getAttribute('count_likes'), 
                                                      this.options[this.selectedIndex].getAttribute('count_views')) }, false);
    //on-keyup
    document.getElementById('setting_input_place').addEventListener('keyup', function() { window.global_typewatch("update_ui(8);", 1000); }, false);
    document.getElementById('setting_input_lat').addEventListener('keyup', function() { window.global_typewatch("update_ui(9);", 1000); }, false);
    document.getElementById('setting_input_long').addEventListener('keyup', function() { window.global_typewatch("update_ui(9);", 1000); }, false);
                                   
    document.getElementById('profile_search_input').addEventListener('keyup', function() { window.global_typewatch("search_profile(document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code(), 'profile_show_app');", 500); }, false);
    
    document.getElementById('user_verify_verification_char1').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char2") }, false);
    document.getElementById('user_verify_verification_char2').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char3") }, false);
    document.getElementById('user_verify_verification_char3').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char4") }, false);
    document.getElementById('user_verify_verification_char4').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char5") }, false);
    document.getElementById('user_verify_verification_char5').addEventListener('keyup', function() { user_verify_check_input_app(this, "user_verify_verification_char6") }, false);
    document.getElementById('user_verify_verification_char6').addEventListener('keyup', function() { user_verify_check_input_app(this, "") }, false);

    if(document.getElementById('window_preview_content').addEventListener)
        document.getElementById('window_preview_content').addEventListener('load',function() { iframe_resize(); }, false);
    else if(document.getElementById('window_preview_content').attachEvent)
        document.getElementById('window_preview_content').attachEvent('onload',function() { iframe_resize(); });
};
/*----------------------- */
/* SERCICE WORKER         */
/*----------------------- */
function serviceworker(){
    if (!window.Promise) {
        window.Promise = Promise;
    }
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: window.global_pwa_scope});
    }
}
/*----------------------- */
/* EXCEPTION              */
/*----------------------- */
function app_exception(){
    user_logoff_app();
}
/*----------------------- */
/* INIT                   */
/*----------------------- */
async function get_app_globals() {
    let status;
    let json;
    //app parameter variables
    //returns parameters for given app_id and app_id=0
    await fetch(window.global_rest_url_base + window.global_rest_app_parameter + window.global_app_id +
                '?lang_code=' + get_lang_code(), 
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
                    if (json.data[i].parameter_name=='IMAGE_FILE_ALLOWED_TYPE1')
                        window.global_image_file_allowed_type1 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='IMAGE_FILE_ALLOWED_TYPE2')
                        window.global_image_file_allowed_type2 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='IMAGE_FILE_ALLOWED_TYPE3')
                        window.global_image_file_allowed_type3 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='IMAGE_FILE_MIME_TYPE')
                        window.global_image_file_mime_type = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='IMAGE_FILE_MAX_SIZE')
                        window.global_image_file_max_size = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_IMAGE_AVATAR_WIDTH')
                        window.global_user_image_avatar_width = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_IMAGE_AVATAR_HEIGHT')
                        window.global_user_image_avatar_height = json.data[i].parameter_value;                          
                    if (json.data[i].parameter_name=='USER_PROVIDER1_USE')
                        window.global_app_user_provider1_use = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER1_ID')
                        window.global_app_user_provider1_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER1_NAME')
                        window.global_app_user_provider1_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER1_API_SRC')
                        window.global_app_user_provider1_api_src = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_USE')
                        window.global_app_user_provider2_use = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_ID')
                        window.global_app_user_provider2_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_NAME')
                        window.global_app_user_provider2_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_API_VERSION')
                        window.global_app_user_provider2_api_version = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_API_SRC')
                        window.global_app_user_provider2_api_src = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='USER_PROVIDER2_API_SRC2')
                        window.global_app_user_provider2_api_src2 = json.data[i].parameter_value;
                    //REST
                    if (json.data[i].parameter_name=='REST_APP')
                        window.global_rest_app = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP_OBJECT')
                        window.global_rest_app_object = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_COUNTRY')
                        window.global_rest_country = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_LANGUAGE_LOCALE')
                        window.global_rest_language_locale = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_MESSAGE_TRANSLATION')
                        window.global_rest_message_translation = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT')
                        window.global_rest_user_account = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_ACTIVATE')
                        window.global_rest_user_account_activate = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_APP')
                        window.global_rest_user_account_app = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_COMMON')
                        window.global_rest_user_account_common = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_LIKE')
                        window.global_rest_user_account_like = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_LOGIN')
                        window.global_rest_user_account_login = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_FOLLOW')
                        window.global_rest_user_account_follow = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_DETAIL')
                        window.global_rest_user_account_profile_detail = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_SEARCHA')
                        window.global_rest_user_account_profile_searchA = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_SEARCHD')
                        window.global_rest_user_account_profile_searchD = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_TOP')
                        window.global_rest_user_account_profile_top = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_USERID')
                        window.global_rest_user_account_profile_userid = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROFILE_USERNAME')
                        window.global_rest_user_account_profile_username = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_PROVIDER')
                        window.global_rest_user_account_provider = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_USER_ACCOUNT_SIGNUP')
                        window.global_rest_user_account_signup = json.data[i].parameter_value;
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
                    //App variables registered for this apps app_id
                    if (json.data[i].parameter_name=='APP_DEFAULT_STARTUP_PAGE')
                        window.global_app_default_startup_page = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING')
                        window.global_rest_app1_user_setting = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_USER_ACCOUNT_ID')
                        window.global_rest_app1_user_setting_user_account_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_PROFILE')
                        window.global_rest_app1_user_setting_profile = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_PROFILE_ALL')
                        window.global_rest_app1_user_setting_profile_all = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_PROFILE_DETAIL')
                        window.global_rest_app1_user_setting_profile_detail = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_PROFILE_TOP')
                        window.global_rest_app1_user_setting_profile_top = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_LIKE')
                        window.global_rest_app1_user_setting_like = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='REST_APP1_USER_SETTING_VIEW')
                        window.global_rest_app1_user_setting_view = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='APP_REPORT_TIMETABLE')
                        window.global_app_report_timetable = json.data[i].parameter_value; 
                    if (json.data[i].parameter_name=='PWA_SCOPE')
                        window.global_pwa_scope = json.data[i].parameter_value; 
                    if (json.data[i].parameter_name=='INFO_EMAIL_POLICY')
                        window.global_info_email_policy = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_EMAIL_DISCLAIMER')
                        window.global_info_email_disclaimer = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_EMAIL_TERMS')
                        window.global_info_email_terms = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_SOCIAL_LINK1_URL')
                        window.global_info_social_link1_url = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_SOCIAL_LINK2_URL')
                        window.global_info_social_link2_url = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_SOCIAL_LINK3_URL')
                        window.global_info_social_link3_url = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_SOCIAL_LINK4_URL')
                        window.global_info_social_link4_url = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_SOCIAL_LINK1_NAME')
                        window.global_info_social_link1_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_SOCIAL_LINK2_NAME')
                        window.global_info_social_link2_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_SOCIAL_LINK3_NAME')
                        window.global_info_social_link3_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_SOCIAL_LINK4_NAME')
                        window.global_info_social_link4_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_LINK1_URL')
                        window.global_info_link1_url = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_LINK2_URL')
                        window.global_info_link2_url = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_LINK3_URL')
                        window.global_info_link3_url = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_LINK4_URL')
                        window.global_info_link4_url = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_LINK1_NAME')
                        window.global_info_link1_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_LINK2_NAME')
                        window.global_info_link2_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_LINK3_NAME')
                        window.global_info_link3_name = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='INFO_LINK4_NAME')
                        window.global_info_link4_name = json.data[i].parameter_value;
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
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_DIRECTION')
                        window.global_regional_default_direction = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_SECOND')
                        window.global_regional_default_locale_second = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_COLTITLE')
                        window.global_regional_default_coltitle = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_ARABIC_SCRIPT')
                        window.global_regional_default_arabic_script = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDARTYPE')
                        window.global_regional_default_calendartype = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE')
                        window.global_regional_default_calendar_hijri_type = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_MAPTYPE')
                        window.global_gps_maptype = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_DEFAULT_COUNTRY')
                        window.global_gps_default_country = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_DEFAULT_CITY')
                        window.global_gps_default_city = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_DEFAULT_PLACE_ID')
                        window.global_gps_default_place_id = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_CONTAINER')
                        window.global_gps_map_container = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_ZOOM')
                        window.global_gps_map_zoom = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_ZOOM_CITY')
                        window.global_gps_map_zoom_city = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_ZOOM_PP')
                        window.global_gps_map_zoom_pp = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_STYLE_BASEURL')
                        window.global_gps_map_style_baseurl = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_STYLE')
                        window.global_gps_map_style = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_MARKER_DIV_PP')
                        window.global_gps_map_marker_div_pp = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_MARKER_DIV_CITY')
                        window.global_gps_map_marker_div_city = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_MARKER_DIV_GPS')
                        window.global_gps_map_marker_div_gps = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_TITLE')
                        window.global_gps_map_qibbla_title = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_TEXT_SIZE')
                        window.global_gps_map_qibbla_text_size = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_LAT')
                        window.global_gps_map_qibbla_lat = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_LONG')
                        window.global_gps_map_qibbla_long = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_COLOR')
                        window.global_gps_map_qibbla_color = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_WIDTH')
                        window.global_gps_map_qibbla_width = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OPACITY')
                        window.global_gps_map_qibbla_opacity = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_TITLE')
                        window.global_gps_map_qibbla_old_title = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_TEXT_SIZE')
                        window.global_gps_map_qibbla_old_text_size = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_LAT')
                        window.global_gps_map_qibbla_old_lat = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_LONG')
                        window.global_gps_map_qibbla_old_long = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_COLOR')
                        window.global_gps_map_qibbla_old_color = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_WIDTH')
                        window.global_gps_map_qibbla_old_width = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_QIBBLA_OLD_OPACITY')
                        window.global_gps_map_qibbla_old_opacity = parseFloat(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_FLYTO')
                        window.global_gps_map_flyto = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_JUMPTO')
                        window.global_gps_map_jumpto = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='GPS_MAP_POPUP_OFFSET')
                        window.global_gps_map_popup_offset = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_THEME_DAY')
                        window.global_design_default_theme_day = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_THEME_MONTH')
                        window.global_design_default_theme_month = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_THEME_YEAR')
                        window.global_design_default_theme_year = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_PAPERSIZE')
                        window.global_design_default_papersize = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_HIGHLIGHT_ROW')
                        window.global_design_default_highlight_row = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_WEEKDAY')
                        window.global_design_default_show_weekday = (json.data[i].parameter_value=== 'true');
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_CALENDARTYPE')
                        window.global_design_default_show_calendartype = (json.data[i].parameter_value=== 'true');
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_NOTES')
                        window.global_design_default_show_notes = (json.data[i].parameter_value=== 'true');
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_GPS')
                        window.global_design_default_show_gps = (json.data[i].parameter_value=== 'true');
                    if (json.data[i].parameter_name=='DESIGN_DEFAULT_SHOW_TIMEZONE')
                        window.global_design_default_show_timezone = (json.data[i].parameter_value=== 'true');
                    if (json.data[i].parameter_name=='TEXT_DEFAULT_REPORTTITLE1')
                        window.global_text_default_reporttitle1 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='TEXT_DEFAULT_REPORTTITLE2')
                        window.global_text_default_reporttitle2 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='TEXT_DEFAULT_REPORTTITLE3')
                        window.global_text_default_reporttitle3 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='TEXT_DEFAULT_REPORTFOOTER1')
                        window.global_text_default_reportfooter1 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='TEXT_DEFAULT_REPORTFOOTER2')
                        window.global_text_default_reportfooter2 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='TEXT_DEFAULT_REPORTFOOTER3')
                        window.global_text_default_reportfooter3 = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='IMAGE_HEADER_FOOTER_WIDTH')
                        window.global_image_header_footer_width = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='IMAGE_HEADER_FOOTER_HEIGHT')
                        window.global_image_header_footer_height = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='IMAGE_DEFAULT_REPORT_HEADER_SRC'){
                        if (json.data[i].parameter_value!='')
                            window.global_image_default_report_header_src = json.data[i].parameter_value;
                    }                    
                    if (json.data[i].parameter_name=='IMAGE_DEFAULT_REPORT_FOOTER_SRC'){
                        if (json.data[i].parameter_value!='')
                            window.global_image_default_report_footer_src = json.data[i].parameter_value;
                    }                             
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_METHOD')
                        window.global_prayer_default_method = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_ASR')
                        window.global_prayer_default_asr = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_HIGHLATITUDE')
                        window.global_prayer_default_highlatitude = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_TIMEFORMAT')
                        window.global_prayer_default_timeformat = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_HIJRI_ADJUSTMENT')
                        window.global_prayer_default_hijri_adjustment = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_FAJR')
                        window.global_prayer_default_iqamat_title_fajr = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR')
                        window.global_prayer_default_iqamat_title_dhuhr = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_ASR')
                        window.global_prayer_default_iqamat_title_asr = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB')
                        window.global_prayer_default_iqamat_title_maghrib = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_ISHA')
                        window.global_prayer_default_iqamat_title_isha = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_SHOW_IMSAK')
                        window.global_prayer_default_show_imsak = (json.data[i].parameter_value=== 'true');
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_SHOW_SUNSET')
                        window.global_prayer_default_show_sunset = (json.data[i].parameter_value=== 'true');
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_SHOW_MIDNIGHT')
                        window.global_prayer_default_show_midnight = (json.data[i].parameter_value=== 'true');
                    if (json.data[i].parameter_name=='PRAYER_DEFAULT_SHOW_FAST_START_END')
                        window.global_prayer_default_show_fast_start_end = parseInt(json.data[i].parameter_value);
                    //QR
                    if (json.data[i].parameter_name=='QR_LOGO_FILE_PATH')
                        window.global_qr_logo_file_path = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='QR_WIDTH')
                        window.global_qr_width = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='QR_HEIGHT')
                        window.global_qr_height = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='QR_COLOR_DARK')
                        window.global_qr_color_dark = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='QR_COLOR_LIGHT')
                        window.global_qr_color_light = json.data[i].parameter_value;
                    if (json.data[i].parameter_name=='QR_LOGO_WIDTH')
                        window.global_qr_logo_width = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='QR_LOGO_HEIGHT')
                        window.global_qr_logo_height = parseInt(json.data[i].parameter_value);
                    if (json.data[i].parameter_name=='QR_BACKGROUND_COLOR')
                        window.global_qr_background_color = json.data[i].parameter_value;
                }
                
            }
        } else {
            show_message('EXCEPTION', null,null, result, window.global_app_id, get_lang_code());
        }
    })
}
async function init_app() {
    dialogue_loading(1);
    //set initial default language from clients settings
    SearchAndSetSelectedIndex(navigator.language.toLowerCase(), document.getElementById('setting_select_locale'),1);
    //dialogues
    document.getElementById('info_close').innerHTML = window.global_button_default_icon_close;
    document.getElementById('scan_open_mobile_close').innerHTML = window.global_button_default_icon_close;
    //profile info
    document.getElementById('profile_main_btn_user_settings').innerHTML = window.global_button_default_icon_day  + window.global_button_default_icon_month + window.global_button_default_icon_year;
    document.getElementById('profile_main_btn_user_setting_likes').innerHTML = window.global_button_default_icon_like + window.global_button_default_icon_day + window.global_button_default_icon_month + window.global_button_default_icon_year + window.global_button_default_icon_follows;
    document.getElementById('profile_main_btn_user_setting_liked').innerHTML = window.global_button_default_icon_like + window.global_button_default_icon_day + window.global_button_default_icon_month + window.global_button_default_icon_year + window.global_button_default_icon_followed;
    document.getElementById('profile_user_settings_day').innerHTML = window.global_button_default_icon_day;
    document.getElementById('profile_user_settings_month').innerHTML = window.global_button_default_icon_month;
    document.getElementById('profile_user_settings_year').innerHTML = window.global_button_default_icon_year;
    document.getElementById('profile_user_settings_like').innerHTML = window.global_button_default_icon_unlike + window.global_button_default_icon_like;

    document.getElementById('profile_user_settings_info_likes').innerHTML = window.global_button_default_icon_like + '<div id="profile_user_settings_info_like_count"></div>';
    document.getElementById('profile_user_settings_info_views').innerHTML = window.global_button_default_icon_views + '<div id="profile_user_settings_info_view_count"></div>';
    //profile top
    document.getElementById('profile_top_row2_1').innerHTML = window.global_button_default_icon_like + window.global_button_default_icon_day  + window.global_button_default_icon_month + window.global_button_default_icon_year;
    document.getElementById('profile_top_row2_2').innerHTML = window.global_button_default_icon_views + window.global_button_default_icon_day  + window.global_button_default_icon_month + window.global_button_default_icon_year;
    //settings tab 4
    document.getElementById('setting_input_reportheader_clear').innerHTML = window.global_button_default_icon_remove;
    document.getElementById('setting_input_reportfooter_clear').innerHTML = window.global_button_default_icon_remove;
    //settings tab 5
    document.getElementById('setting_input_reporttitle_aleft').innerHTML =  window.global_button_default_icon_align_left;
    document.getElementById('setting_input_reporttitle_acenter').innerHTML = window.global_button_default_icon_align_center
    document.getElementById('setting_input_reporttitle_aright').innerHTML = window.global_button_default_icon_align_right;
    document.getElementById('setting_input_reportfooter_aleft').innerHTML = window.global_button_default_icon_align_left;
    document.getElementById('setting_input_reportfooter_acenter').innerHTML = window.global_button_default_icon_align_center;
    document.getElementById('setting_input_reportfooter_aright').innerHTML = window.global_button_default_icon_align_right;
    //settings tab 7 user logged in
    document.getElementById('setting_btn_user_edit').innerHTML = window.global_button_default_icon_edit;
    //settings tab 7 user settings
    document.getElementById('user_day_html').innerHTML = window.global_button_default_icon_html + '<div id="user_day_label_html">HTML</div>';
    document.getElementById('user_day_html_copy').innerHTML = window.global_button_default_icon_copy;
    document.getElementById('user_day_pdf').innerHTML = window.global_button_default_icon_pdf + '<div id="user_day_label_pdf">PDF</div>';
    document.getElementById('user_day_pdf_copy').innerHTML = window.global_button_default_icon_copy;
    document.getElementById('user_month_html').innerHTML = window.global_button_default_icon_html + '<div id="user_month_label_html">HTML</div>';
    document.getElementById('user_month_html_copy').innerHTML = window.global_button_default_icon_copy;
    document.getElementById('user_month_pdf').innerHTML = window.global_button_default_icon_pdf + '<div id="user_month_label_pdf">PDF</div>';
    document.getElementById('user_month_pdf_copy').innerHTML = window.global_button_default_icon_copy;
    document.getElementById('user_year_html').innerHTML = window.global_button_default_icon_html + '<div id="user_year_label_html">HTML</div>';
    document.getElementById('user_year_html_copy').innerHTML = window.global_button_default_icon_copy;
    document.getElementById('user_year_pdf').innerHTML = window.global_button_default_icon_pdf + '<div id="user_year_label_pdf">PDF</div>';
    document.getElementById('user_year_pdf_copy').innerHTML = window.global_button_default_icon_copy;

    document.getElementById('setting_btn_user_save').innerHTML = window.global_button_default_icon_save;
    document.getElementById('setting_btn_user_add').innerHTML = window.global_button_default_icon_add;
    document.getElementById('setting_btn_user_delete').innerHTML = window.global_button_default_icon_delete;
    //tab navigation
    document.getElementById('tab_1_nav_btn_regional').innerHTML = window.global_button_default_icon_tab_regional + '<div id="tab_1_nav_label_regional">Regional</div>';
    document.getElementById('tab_2_nav_btn_gps').innerHTML = window.global_button_default_icon_tab_gps + '<div id="tab_2_nav_label_gps">GPS</div>';
    document.getElementById('tab_3_nav_btn_btn_design').innerHTML = window.global_button_default_icon_tab_design + '<div id="tab_3_nav_label_design">Design</div>';
    document.getElementById('tab_4_nav_btn_btn_image').innerHTML = window.global_button_default_icon_tab_image + '<div id="tab_4_nav_label_image">Image</div>';
    document.getElementById('tab_5_nav_btn_btn_text').innerHTML = window.global_button_default_icon_tab_text + '<div id="tab_5_nav_label_text">Text</div>';
    document.getElementById('tab_6_nav_btn_btn_prayer').innerHTML = window.global_button_default_icon_tab_prayer + '<div id="tab_6_nav_label_prayer">Prayer</div>';
    document.getElementById('tab_7_nav_btn_btn_user').innerHTML = window.global_button_default_icon_tab_user + '<div id="tab_7_nav_label_user">User</div>';
    //toolbar bottom
    document.getElementById('toolbar_btn_print').innerHTML = window.global_button_default_icon_print + '<div id="toolbar_btn_print_label">Print</div>';
    document.getElementById('toolbar_btn_day').innerHTML = window.global_button_default_icon_day + '<div id="toolbar_btn_day_label">Day</div>';
    document.getElementById('toolbar_btn_month').innerHTML = window.global_button_default_icon_month + '<div id="toolbar_btn_month_label">Month</div>';
    document.getElementById('toolbar_btn_year').innerHTML = window.global_button_default_icon_year + '<div id="toolbar_btn_year_label">Year</div>';    
    document.getElementById('user_account_default_avatar').innerHTML = window.global_button_default_icon_user;
    //toolbar top
    document.getElementById('toolbar_btn_zoomout').innerHTML = window.global_button_default_icon_zoomout;
    document.getElementById('toolbar_btn_zoomin').innerHTML = window.global_button_default_icon_zoomin;
    document.getElementById('toolbar_btn_left').innerHTML = window.global_button_default_icon_left;
    document.getElementById('toolbar_btn_right').innerHTML = window.global_button_default_icon_right;
    document.getElementById('toolbar_btn_about').innerHTML = window.global_button_default_icon_info;
    //window preview report
    document.getElementById('window_preview_close').innerHTML = window.global_button_default_icon_close;
    //themes from client server generation
    document.getElementById('slider_prev_day').innerHTML = window.global_button_default_icon_slider_left;
    document.getElementById('slider_next_day').innerHTML =  window.global_button_default_icon_slider_right;
    document.getElementById('slider_prev_month').innerHTML = window.global_button_default_icon_slider_left;
    document.getElementById('slider_next_month').innerHTML = window.global_button_default_icon_slider_right;
    document.getElementById('slider_prev_year').innerHTML = window.global_button_default_icon_slider_left;
    document.getElementById('slider_next_year').innerHTML = window.global_button_default_icon_slider_right;
    
    await get_data_token(document.getElementById('setting_data_userid_logged_in').innerHTML, get_lang_code()).then(function(){
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
        get_app_globals().then(function(){
            let status;
            //app variables
            fetch(window.global_rest_url_base + window.global_rest_app +
                '?id=' + window.global_app_id + 
                '&lang_code=' + get_lang_code(), 
                {
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
                if (status === 200) {
                    json = JSON.parse(result);
                    window.global_app_hostname = json.data[0].url;
                    window.global_app_name = json.data[0].app_name;
                    //set common head info
                    set_app_globals_head();
                    //set app globals in body
                    document.getElementById('app_name').innerHTML = window.global_app_name;
                    document.getElementById('login_app_name').innerHTML = window.global_app_name;
                    document.getElementById('signup_app_name').innerHTML = window.global_app_name;
                    //set info pages
                    update_info(1);
                    update_info(2);
                    update_info(3);
                    update_info(4);
                    //set default geolocation
                    document.getElementById('setting_select_popular_place').selectedIndex = 0;
                    document.getElementById('setting_input_lat').value = window.global_session_user_gps_latitude;
                    document.getElementById('setting_input_long').value = window.global_session_user_gps_longitude;
                    //init map thirdparty module
                    init_map();
                    //load themes in Design tab
                    load_themes();
                    //set papersize
                    zoom_paper();
                    //user interface font depending selected arabic script
                    update_ui(3);
                    //set events
                    setEvents();
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
                    setTimeout(function(){show_dialogue('SCAN')}, 5000);
                    //Start of app:
                    //1.set default settings
                    //2.translate ui
                    //3.display default timetable settings
                    //4.show profile if user in url
                    //5.user provider login
                    //5.service worker
                    set_default_settings().then(function(){
                        settings_translate(true).then(function(){
                            settings_translate(false).then(function(){
                                async function show_start(){
                                    //show default startup
                                    toolbar_bottom(window.global_app_default_startup_page);
                                    let user = window.location.pathname.substring(1);
                                    if (user !='') {
                                        //show profile for user entered in url
                                        document.getElementById('dialogue_profile').style.visibility = "visible";
                                        profile_show_app(null, user, document.getElementById('setting_data_userid_logged_in').innerHTML, document.getElementById('setting_select_timezone_current').value, get_lang_code());
                                    }
                                }
                                show_start().then(function(){
                                    init_providers('onProviderSignIn_app', function() { onProviderSignIn_app() }).then(function(){
                                        serviceworker();
                                        dialogue_loading(0);
                                    });
                                })
                            });
                        });
                    });
                }
                else {
                    dialogue_loading(0);
                    show_message('EXCEPTION', null,null, result, window.global_app_id, get_lang_code());
                }
            })
        })
    })
}
function init(parameters) {
    init_common(parameters);
    init_app();
}