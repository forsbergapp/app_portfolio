/*  Functions and globals in this order:
    REPORT (USES MODULE PRAYTIMES)
    THEME
    UI
    USER
    USER SETTING
    EVENTS
    SERVICE WORKER
    MODULE LEAFLET
    EXCEPTION
    INIT
*/
const common = await import('/common/js/common.js');
const app2_report = await import('/app2/js/app_report.js');
const app_common = await import('/app2/js/app_common.js');
/*----------------------- */
/* REPORT                 */
/*----------------------- */

const printTable = () => {
    dialogue_loading(1);
    let whatToPrint = document.getElementById('paper');
    
	let html;
	
	html = `<!DOCTYPE html>
			<html>
			<head>
				<meta charset='UTF-8'>
				<title></title>
                <link rel='stylesheet' type='text/css' href='/app${common.COMMON_GLOBAL['app_id']}/css/app_report.css' />
                <link rel='stylesheet' type='text/css' href='/common/css/common.css' />
			</head>
			<body id="printbody">
				${whatToPrint.outerHTML}
			</body>
			</html>`;
	
    
    document.getElementById('common_window_info_content').contentWindow.document.open();
    document.getElementById('common_window_info_content').contentWindow.document.write(html);
    document.getElementById('common_window_info_content').classList = document.getElementById('paper').classList;
    window.frames['common_window_info_content'].focus()
    setTimeout(() => {document.getElementById('common_window_info_content').contentWindow.print();dialogue_loading(0);}, 500);
    if (common.mobile())
        null;
    else
        document.getElementById('common_window_info_content').contentWindow.onafterprint = () => {
            document.getElementById('common_window_info_content').src='';
            document.getElementById('common_window_info_content').classList ='';
        }
}

const getReportSettings = () => {
    return {    locale              	: document.getElementById('setting_select_locale').value,  
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
                show_weekday        	: common.checkbox_value(document.getElementById('setting_checkbox_report_show_weekday')),
                show_calendartype   	: common.checkbox_value(document.getElementById('setting_checkbox_report_show_calendartype')),
                show_notes          	: common.checkbox_value(document.getElementById('setting_checkbox_report_show_notes')),
                show_gps   	       		: common.checkbox_value(document.getElementById('setting_checkbox_report_show_gps')),
                show_timezone       	: common.checkbox_value(document.getElementById('setting_checkbox_report_show_timezone')),
                            
                header_img_src      	: document.getElementById('setting_reportheader_img').src,
                footer_img_src      	: document.getElementById('setting_reportfooter_img').src,

                header_txt1         	: document.getElementById('setting_input_reportheader1').value,
                header_txt2         	: document.getElementById('setting_input_reportheader2').value,
                header_txt3         	: document.getElementById('setting_input_reportheader3').value,
                //button is active set left, center or right true/false
                header_align            : get_align(document.getElementById('setting_icon_text_header_aleft').classList.contains('setting_button_active'), 
                                                    document.getElementById('setting_icon_text_header_acenter').classList.contains('setting_button_active'), 
                                                    document.getElementById('setting_icon_text_header_aright').classList.contains('setting_button_active')),
                footer_txt1         	: document.getElementById('setting_input_reportfooter1').value,
                footer_txt2         	: document.getElementById('setting_input_reportfooter2').value,
                footer_txt3    	   		: document.getElementById('setting_input_reportfooter3').value,
                //button is active set left, center or right true/false
                footer_align            : get_align(document.getElementById('setting_icon_text_footer_aleft').classList.contains('setting_button_active'),
                                                    document.getElementById('setting_icon_text_footer_acenter').classList.contains('setting_button_active'),
                                                    document.getElementById('setting_icon_text_footer_aright').classList.contains('setting_button_active')),
                
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
                show_imsak          	: common.checkbox_value(document.getElementById('setting_checkbox_report_show_imsak')),
                show_sunset         	: common.checkbox_value(document.getElementById('setting_checkbox_report_show_sunset')),
                show_midnight       	: common.checkbox_value(document.getElementById('setting_checkbox_report_show_midnight')),
                show_fast_start_end 	: document.getElementById('setting_select_report_show_fast_start_end').value,
                
                timetable_class			: 'timetable_class',
                timetable_month         : 'timetable_month_class', //class to add for month
                timetable_year_month    : 'timetable_year_month', //class to add for year
                reporttype_year_month 	: 'MONTH',  //default MONTH: normal month with more info, 
                                                    //YEAR: month with less info
                
                ui_navigation_left      : 'toolbar_btn_left',
                ui_navigation_right     : 'toolbar_btn_right',
                ui_timetable_day_id     : 'timetable_day',
                ui_timetable_month_id   : 'timetable_month',
                ui_timetable_year_id    : 'timetable_year'};
}
// update timetable
const update_timetable_report = async (timetable_type = 0, item_id = null, settings) => {
    return await new Promise((resolve) => {
        app_common.APP_GLOBAL['timetable_type'] = timetable_type;
        import('/common/modules/PrayTimes/PrayTimes.module.js').then(({prayTimes}) => {
            switch (timetable_type){
                //create timetable month or day or year if they are visible instead
                case 0:{
                    //update user settings to current select option 
                    set_settings_select();
                    let select_user_settings = document.getElementById('setting_select_user_setting');
                    let current_user_settings =[];
                    for (let i=0;i<=select_user_settings.options.length-1;i++){
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
                    document.getElementById('paper').innerHTML = common.APP_SPINNER;
                    app2_report.displayDay(prayTimes, settings, item_id, current_user_settings).then((timetable) => {
                        timetable.style.display = 'block';
                        document.getElementById('paper').innerHTML = timetable.outerHTML;
                        common.create_qr('timetable_qr_code', common.getHostname());
                        resolve();
                    })
                    break;
                }
                //1=create timetable month
                case 1:{
                    document.getElementById('paper').innerHTML = common.APP_SPINNER;
                    app2_report.displayMonth(prayTimes, settings, item_id).then((timetable) => {
                        timetable.style.display = 'block';
                        document.getElementById('paper').innerHTML = timetable.outerHTML;
                        common.create_qr('timetable_qr_code', common.getHostname());
                        resolve();
                    })
                    break;
                }
                //2=create timetable year
                case 2:{
                    document.getElementById('paper').innerHTML = common.APP_SPINNER;
                    app2_report.displayYear(prayTimes, settings, item_id).then((timetable) => {
                        timetable.style.display = 'block';
                        document.getElementById('paper').innerHTML = timetable.outerHTML;
                        common.create_qr('timetable_qr_code', common.getHostname());
                        resolve();
                    })
                    break;
                }
                default:{
                    break;
                }
            }
        })
    })
}
const get_report_url = (id, sid, papersize, item, format) => {
    let app_parameters = `app_id=${common.COMMON_GLOBAL['app_id']}`;
    let report_module = `&module=${app_common.APP_GLOBAL['app_report_timetable']}`;
    let module_parameters = `&id=${id}&sid=${sid}`
    if (item =='profile_user_settings_day' || item.substr(0,8)=='user_day')
        module_parameters += '&type=0';
    if (item =='profile_user_settings_month' || item.substr(0,10)=='user_month')
        module_parameters += '&type=1';
    if (item == 'profile_user_settings_year' || item.substr(0,9)=='user_year')
        module_parameters += '&type=2';
    let language_parameter = `&lang_code=${common.COMMON_GLOBAL['user_locale']}`;
    let service_parameter = `&format=${format}&ps=${papersize}&hf=0`; //html/pdf, papersize, header/footer
    let encodedurl = common.toBase64(app_parameters +
                                     report_module +
                                     module_parameters + 
                                     language_parameter +
                                     service_parameter);
    //url query parameters are decoded in report module and in report service
    return common.getHostname() + `${common.COMMON_GLOBAL['rest_resource_bff']}/noauth?service=report&parameters=${common.toBase64('?reportid=' + encodedurl)}`;
}
const updateViewStat_app = (user_setting_id, user_setting_user_account_id) => {
    if (parseInt(user_setting_user_account_id) == parseInt(common.COMMON_GLOBAL['user_account_id']))
        //do not update viewed stat if logged in user is the same as the user account in user setting
        null;
    else{
        //update always viewed stat with or without user account logged in
        if (common.COMMON_GLOBAL['user_account_id']=='')
            app2_report.updateReportViewStat(user_setting_id, common.COMMON_GLOBAL['user_account_id']);
        else
            app2_report.updateReportViewStat(user_setting_id, parseInt(common.COMMON_GLOBAL['user_account_id']));
    }
        
}
/*----------------------- */
/* THEME                  */
/*----------------------- */
const update_all_theme_thumbnails = async () => {
    await update_timetable_report(0, null, getReportSettings()).then(() => {
        document.querySelectorAll('#slides_day .slide').forEach(e => {
            update_theme_thumbnail(e, 'day', 1);
        })
    });
    
    await update_timetable_report(1, null, getReportSettings()).then(() => {
        document.querySelectorAll('#slides_month .slide').forEach(e => {
            update_theme_thumbnail(e, 'month', 2);
        })
    });
    await update_timetable_report(2, null, getReportSettings()).then(() => {
        document.querySelectorAll('#slides_year .slide').forEach(e => {
            update_theme_thumbnail(e, 'year', 1);
        })
    });
}
const update_theme_thumbnail = (e, theme_type, classlist_pos) => {
    e.children[0].innerHTML = document.getElementById('timetable_' + theme_type).outerHTML;
    let new_theme_id = e.children[0].getAttribute('data-theme_id');
    //theme always second class in classList
    let old_theme = e.children[0].children[0].classList[classlist_pos];
    e.children[0].children[0].classList.remove(old_theme);
    e.children[0].children[0].classList.add('theme_'  + theme_type + '_' + new_theme_id);
}

const get_theme_id = (type) => {
    let select_user_setting = document.getElementById('setting_select_user_setting');
    if (document.getElementsByClassName('slider_active_' + type)[0])
        return document.getElementsByClassName('slider_active_' + type)[0].getAttribute('data-theme_id');
    else
        return select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_' + type + '_id');
}
const set_theme_id = (type, theme_id) => {
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
const set_theme_title = (type) => {
    document.getElementById(`slider_theme_${type}_id`).innerHTML =
        document.getElementById(`theme_${type}_${get_theme_id(type)}`).getAttribute('data-theme_id');
    return null;
}
const load_themes = () => {
    slide(document.getElementById('slides_day'),
        document.getElementById('slider_prev_day'),
        document.getElementById('slider_next_day'),
        'day');
    slide(document.getElementById('slides_month'),
        document.getElementById('slider_prev_month'),
        document.getElementById('slider_next_month'),
        'month');
    slide(document.getElementById('slides_year'),
        document.getElementById('slider_prev_year'),
        document.getElementById('slider_next_year'),
        'year');
    return null;
}
const slide = (items, prev, next, type) => {
    document.getElementById(items.children[0].children[0].id).classList.add(`slider_active_${type}`);
    set_theme_title(type);

    // Click events
    prev.addEventListener('click', () => { theme_nav(-1) });
    next.addEventListener('click', () => { theme_nav(1) });

    const theme_nav = async (dir) => {
        let theme_index;
        //get current index
        document.querySelectorAll(`#slides_${type} .slide_${type}`).forEach((e, index) => {
            if (e.children[0].classList.contains(`slider_active_${type}`))
                theme_index = index;
        })
        //set next index
        if (dir == 1)
            if ((theme_index + 1) == items.getElementsByClassName(`slide_${type}`).length)
                theme_index = 0;
            else
                theme_index++;
        else 
            if (dir == -1)
                if (theme_index == 0)
                    theme_index = items.getElementsByClassName(`slide_${type}`).length -1;
                else
                    theme_index--;
        //remove old active theme class
        document.getElementsByClassName(`slider_active_${type}`)[0].classList.remove(`slider_active_${type}`);
        //add new active theme class
        document.getElementById(items.children[theme_index].children[0].id).classList.add(`slider_active_${type}`);
        //set theme title
        set_theme_title(type);

        if (type=='month'){
            //if changing month update year
            await update_timetable_report(2, null, getReportSettings()).then(() => {
                document.querySelectorAll('#slides_year .slide').forEach(e => {
                    update_theme_thumbnail(e, 'year', 1);
                })
            });
        }

    }
}
/*----------------------- */
/* UI                     */
/*----------------------- */
const common_translate_ui_app = async (lang_code, callBack) => {
    await common.common_translate_ui(lang_code, null, (err, result) => {
        if (err)
            callBack(err,null);
        else{
            //translate locale in this app
            let select_locale = document.getElementById('setting_select_locale');
            let select_second_locale = document.getElementById('setting_select_report_locale_second'); 
            let current_locale = select_locale.value;
            let current_second_locale = select_second_locale.value;
            select_locale.innerHTML = document.getElementById('common_user_locale_select').innerHTML;
            select_locale.value = current_locale;
            select_second_locale.innerHTML = select_second_locale.options[0].outerHTML + document.getElementById('common_user_locale_select').innerHTML;
            select_second_locale.value = current_second_locale;   
            
            //country
            common.FFB ('DB', `/country/${lang_code}?`, 'GET', 0, null, (err, result) => {
                if (err)
                    callBack(err,null);
                else{
                    let json = JSON.parse(result);
                    let select_country = document.getElementById('setting_select_country');
                    let html=`<option value='' id='' label='…' selected='selected'>…</option>`;
                    let current_country = document.getElementById('setting_select_country')[document.getElementById('setting_select_country').selectedIndex].id;
                    let current_group_name;
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
                    common.SearchAndSetSelectedIndex(current_country, document.getElementById('setting_select_country'),0);
                    callBack(null,null);
                }
            })
        }
    });
}
const settings_translate = async (first=true) => {
	let json;
    let locale;
    if (first ==true){
        locale = document.getElementById('setting_select_locale').value
        common.COMMON_GLOBAL['user_locale'] = locale;
    }
    else
        locale = document.getElementById('setting_select_report_locale_second').value
    if (locale != 0){
        //fetch any message with first language always
        //show translation using first or second language
        await common.FFB ('DB', `/app_object/${locale}?object=APP_OBJECT_ITEM&object_name=REPORT`, 'GET', 0, null, (err, result) => {
            if (err)
                null;
            else{
                json = JSON.parse(result);
                for (let i = 0; i < json.data.length; i++){
                    if (first==true)
                        app2_report.REPORT_GLOBAL['first_language'][json.data[i].object_item_name.toLowerCase()] = json.data[i].text;
                    else
                        app2_report.REPORT_GLOBAL['second_language'][json.data[i].object_item_name.toLowerCase()] = json.data[i].text;
                }
                //if translating first language and second language is not used
                if (first == true &&
                    document.getElementById('setting_select_report_locale_second').value ==0){
                    app2_report.REPORT_GLOBAL['second_language']['timetable_title']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_day']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_weekday']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_weekday_tr']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_caltype_hijri']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_caltype_gregorian']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_imsak']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_fajr']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_fajr_iqamat']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_sunrise']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_dhuhr']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_dhuhr_iqamat']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_asr']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_asr_iqamat']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_sunset']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_maghrib']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_maghrib_iqamat']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_isha']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_isha_iqamat']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_midnight']= '';
                    app2_report.REPORT_GLOBAL['second_language']['coltitle_notes']= '';
                }
            }
        })
    }
	return null;
}
const get_align = (al,ac,ar) => {
	if (al==true)
		return 'left';
	if (ac==true)
		return 'center';
	if (ar==true)
		return 'right';
	return '';
}
const showcurrenttime = () => {
    let options = {
        timeZone: common.COMMON_GLOBAL['user_timezone'],
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    document.getElementById('setting_current_date_time_display').innerHTML = new Date().toLocaleTimeString(common.COMMON_GLOBAL['user_locale'], options);
    return null;
}

const showreporttime = () => {

    let options = {
        timeZone: document.getElementById('setting_select_report_timezone')[document.getElementById('setting_select_report_timezone').selectedIndex].value,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    document.getElementById('setting_report_date_time_display').innerHTML = new Date().toLocaleTimeString(document.getElementById('setting_select_locale').value, options);
    //If day report created with time, display time there also
    if (document.getElementById('tiemtable_day_time')) {
        document.getElementById('timetable_day_time').innerHTML = document.getElementById('setting_report_date_time_display').innerHTML;
    }
    if (document.getElementsByClassName('timetable_day_current_time').length > 0) {
        let user_current_time = document.getElementsByClassName('timetable_day_current_time');
        let select_user_settings = document.getElementById('setting_select_user_setting');
        let user_locale;
        let user_options;
        //loop user settings
        for (let i = 0; i <= select_user_settings.options.length - 1; i++) {
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
            //set user setting time, select index and order should be the same as div timetable_day_current_time indexes
            user_current_time[i].innerHTML = new Date().toLocaleTimeString(user_locale, user_options);
        }
    }
    return null;
}
const toolbar_button = async (choice) => {
    let paper = document.getElementById('paper');
    let settings = document.getElementById('settings');

    switch (choice) {
        //print
        case 1:
            {
                if (common.mobile())
                    paper.style.display = "block";
                settings.style.visibility = 'hidden';
                document.getElementById('common_profile_btn_top').style.visibility='visible';
                printTable();
                break;
            }
        //day
        case 2:
            {
                if (common.mobile())
                    paper.style.display = "block";
                settings.style.visibility = 'hidden';
                document.getElementById('common_profile_btn_top').style.visibility='visible';
                update_timetable_report(0, null, getReportSettings());
                break;
            }
        //month
        case 3:
            {
                if (common.mobile())
                    paper.style.display = "block";
                settings.style.visibility = 'hidden';
                document.getElementById('common_profile_btn_top').style.visibility='visible';
                update_timetable_report(1, null, getReportSettings());
                break;
            }
        //year
        case 4:
            {
                if (common.mobile())
                    paper.style.display = "block";
                settings.style.visibility = 'hidden';
                document.getElementById('common_profile_btn_top').style.visibility='visible';
                update_timetable_report(2, null, getReportSettings());
                break;
            }
        //settings
        case 5:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (common.mobile())
                    paper.style.display = "none";
                document.getElementById('common_profile_btn_top').style.visibility='hidden';
                settings.style.visibility = 'visible';
                if (document.getElementById('tab_nav_3').classList.contains('tab_nav_selected'))
                    update_all_theme_thumbnails();
                break;
            }
        //profile
        case 6:
            {
                settings.style.visibility = 'hidden';
                document.getElementById('common_user_menu_dropdown').style.visibility = 'hidden';
                profile_show_app(null,null);
                break;
            }
        //profile top
        case 7:
            {
                settings.style.visibility = 'hidden';
                document.getElementById('common_user_menu_dropdown').style.visibility = 'hidden';
                common.profile_top(1, null, show_profile_function);
                break;
            }
    }
}


const openTab = async (tab_selected) => {
    for (let i = 1; i < 8; i++) {
        //hide all tab content
        document.getElementById("tab" + i).style.display = 'none';
        //remove mark for all tabs
        document.getElementById("tab_nav_" + i).className = '';
    }
    //show active tab content
    document.getElementById('tab' + tab_selected).style.display = 'block';
    //mark active tab
    document.getElementById("tab_nav_" + tab_selected).classList.add("tab_nav_selected");
    
    if (tab_selected==3){
        update_all_theme_thumbnails();
    }
    if (tab_selected==5){
        document.getElementById('setting_icon_text_theme_row').dispatchEvent(new Event('click'));
    }
}


const align_button_value = (report_align_where) => {

    if (document.getElementById('setting_icon_text_' + report_align_where + '_aleft').classList.contains('setting_button_active'))
        return 'left';
    if (document.getElementById('setting_icon_text_' + report_align_where + '_acenter').classList.contains('setting_button_active'))
        return 'center';
    if (document.getElementById('setting_icon_text_' + report_align_where + '_aright').classList.contains('setting_button_active'))
        return 'right';
    return '';
}

const dialogue_loading = (visible) => {
    if (visible==1){
        document.getElementById('dialogue_loading').innerHTML = common.APP_SPINNER;
        document.getElementById('dialogue_loading').style.visibility='visible';
    }
    else{
        document.getElementById('dialogue_loading').innerHTML = '';
        document.getElementById('dialogue_loading').style.visibility='hidden';
    }
}

const zoom_paper = (zoomvalue = '') => {
    let old;
    let old_scale;
    let div = document.getElementById('paper');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == '') {
        if (common.mobile())
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
const select_get_selectindex = (select, id) => {
    if (id == 0)
        return 0;
    else {
        for (let i = 0; i < document.getElementById(select).options.length; i++) {
            if (document.getElementById(select).options[i].getAttribute('id') == id)
                return i;
        }
    }
    return null;
}
const select_get_id = (select, selectindex) => {
    if (selectindex == 0)
        return 'null';
    else {
        return document.getElementById(select)[selectindex].getAttribute('id');
    }
}
const set_null_or_value = (value) => {
    if (value == null || value == '')
        return 'null';
    else
        return value;
}

const show_dialogue = (dialogue, file = '') => {
    switch (dialogue) {
        case 'SCAN':
            {
                if (common.mobile())
                    return null;
                else{
                    document.getElementById('dialogue_scan_open_mobile').style.visibility = 'visible';
                    common.create_qr('scan_open_mobile_qrcode', common.getHostname());
                }
                break;
            }
    }
    return null;
};

const update_ui = async (option, item_id=null) => {
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
        reportheader_aleft      : document.getElementById('setting_icon_text_header_aleft'),
        reportheader_acenter    : document.getElementById('setting_icon_text_header_acenter'),
        reportheader_aright     : document.getElementById('setting_icon_text_header_aright'),
        reportfooter_aleft      : document.getElementById('setting_icon_text_footer_aleft'),
        reportfooter_acenter    : document.getElementById('setting_icon_text_footer_acenter'),
        reportfooter_aright     : document.getElementById('setting_icon_text_footer_aright'),
        select_user_setting     : document.getElementById('setting_select_user_setting')
    };

    switch (option) {
        //Regional, timezone report
        case 2:
            {
                //Update report date and time for current locale, report timezone format
                clearInterval(showreporttime);
                setInterval(showreporttime, 1000);
                break;
            }
        //GPS, update map
        case 4:
            {
                common.map_setstyle(settings.maptype.value).then(() => {
                    map_update_app(settings.gps_long_input.value,
                        settings.gps_lat_input.value,
                        app_common.APP_GLOBAL['gps_module_leaflet_zoom'],
                        document.getElementById('setting_input_place').value,
                        null,
                        app_common.APP_GLOBAL['gps_module_leaflet_marker_div_gps'],
                        common.COMMON_GLOBAL['module_leaflet_jumpto']);
                })
                break;
            }
        //GPS, update cities from country
        case 5:
            {
                //set default option
                settings.city.innerHTML=`<option value='' id='' label='…' selected='selected'>…</option>`;
                common.SearchAndSetSelectedIndex('', settings.select_place,0);
                if (settings.country[settings.country.selectedIndex].getAttribute('country_code')!=null){
                    await common.get_cities(settings.country[settings.country.selectedIndex].getAttribute('country_code').toUpperCase(), (err, cities)=>{
                        if (err)
                            null;
                        else{
                            //fetch list including default option
                            settings.city.innerHTML = cities;
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
                
                settings.gps_long_input.value = longitude_selected;
                settings.gps_lat_input.value = latitude_selected;

                //Use city + country from list
                document.getElementById('setting_input_place').value =
                    settings.city.options[settings.city.selectedIndex].text + ', ' +
                    settings.country.options[settings.country.selectedIndex].text;
                //display empty popular place select
                common.SearchAndSetSelectedIndex('', settings.select_place,0);
                //Update map
                map_update_app(settings.gps_long_input.value,
                               settings.gps_lat_input.value,
                               app_common.APP_GLOBAL['gps_module_leaflet_zoom_city'],
                               document.getElementById('setting_input_place').value,
                               null,
                               app_common.APP_GLOBAL['gps_module_leaflet_marker_div_city'],
                               common.COMMON_GLOBAL['module_leaflet_flyto']).then((timezone_selected) => {
                                   settings.timezone_report.value = timezone_selected;
                               });
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
                map_update_app(settings.gps_long_input.value,
                               settings.gps_lat_input.value,
                               app_common.APP_GLOBAL['gps_module_leaflet_zoom_pp'], //zoom for popular places
                               settings.select_place.options[settings.select_place.selectedIndex].text,
                               timezone_selected,
                               app_common.APP_GLOBAL['gps_module_leaflet_marker_div_pp'], //marker for popular places
                               common.COMMON_GLOBAL['module_leaflet_flyto']);
                settings.timezone_report.value = timezone_selected;

                //display empty country
                common.SearchAndSetSelectedIndex('', settings.country,0);
                //remove old city list:            
                let old_groups = settings.city.getElementsByTagName('optgroup');
                for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
                    settings.city.removeChild(old_groups[old_index])
                //display first empty city
                common.SearchAndSetSelectedIndex('', settings.city,0);
                let title = settings.select_place.options[settings.select_place.selectedIndex].text;
                document.getElementById('setting_input_place').value = title;
                break;
            }
        //GPS, updating place
        case 8:
            {
                map_update_popup(document.getElementById('setting_input_place').value)
                break;
            }
        //GPS, position
        case 9:
            {
                common.SearchAndSetSelectedIndex('', settings.select_place,0);
                common.get_place_from_gps(settings.gps_long_input.value, settings.gps_lat_input.value).then((gps_place) => {
                    //Update map
                    document.getElementById('setting_input_place').value = gps_place;
                    map_update_app(settings.gps_long_input.value,
                                   settings.gps_lat_input.value,
                                   '', //do not change zoom 
                                   gps_place,
                                   null,
                                   app_common.APP_GLOBAL['gps_module_leaflet_marker_div_gps'],
                                   common.COMMON_GLOBAL['module_leaflet_jumpto']).then((timezone_text) => {
                                           settings.timezone_report.value = timezone_text;
                                   });
                    //display empty country
                    common.SearchAndSetSelectedIndex('', settings.country,0);
                    //remove old city list:            
                    let old_groups = settings.city.getElementsByTagName('optgroup');
                    for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
                        settings.city.removeChild(old_groups[old_index])
                        //display first empty city
                    common.SearchAndSetSelectedIndex('', settings.city,0);
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
                let resheader = common.show_image(settings.header_preview_img_item, item_id, app_common.APP_GLOBAL['image_header_footer_width'], app_common.APP_GLOBAL['image_header_footer_height']);
                break;
            }
        //12=Image, Report header image clear
	    case 12:
            {
                common.recreate_img(settings.header_preview_img_item);
                //doesnt work:
                //settings.header_preview_img_item.src = '';
                settings.reportheader_input.value = '';
                break;
            }
        //13=Image, Report footer image load
	    case 13:
            {
                let resfooter = common.show_image(settings.footer_preview_img_item, item_id, app_common.APP_GLOBAL['image_header_footer_width'], app_common.APP_GLOBAL['image_header_footer_height']);
                break;
            }
        //14=Image, Report footer image clear
        case 14:
            {
                common.recreate_img(settings.footer_preview_img_item);
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
                let header_align = get_align(document.getElementById('setting_icon_text_header_aleft').classList.contains('setting_button_active'),
                                             document.getElementById('setting_icon_text_header_acenter').classList.contains('setting_button_active'),
                                             document.getElementById('setting_icon_text_header_aright').classList.contains('setting_button_active'));
                document.getElementById('setting_input_reportheader1').style.textAlign= header_align;
                document.getElementById('setting_input_reportheader2').style.textAlign= header_align;
                document.getElementById('setting_input_reportheader3').style.textAlign= header_align;
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
                let footer_align = get_align(document.getElementById('setting_icon_text_footer_aleft').classList.contains('setting_button_active'),
                                                 document.getElementById('setting_icon_text_footer_acenter').classList.contains('setting_button_active'),
                                                 document.getElementById('setting_icon_text_footer_aright').classList.contains('setting_button_active'));
                document.getElementById('setting_input_reportfooter1').style.textAlign= footer_align;
                document.getElementById('setting_input_reportfooter2').style.textAlign= footer_align;
                document.getElementById('setting_input_reportfooter3').style.textAlign= footer_align;
                break;
            }
        //Prayer, method
        case 17:
            {
                let method = document.getElementById('setting_select_method').value;
                let suffix;

                document.getElementById('setting_method_param_fajr').innerHTML = '';
                document.getElementById('setting_method_param_isha').innerHTML = '';
                if (typeof app_common.APP_GLOBAL['module_praytimes_methods'][method].params.fajr == 'string')
                    suffix = '';
                else
                    suffix = '°';
                document.getElementById('setting_method_param_fajr').innerHTML = 'Fajr:' + app_common.APP_GLOBAL['module_praytimes_methods'][method].params.fajr + suffix;
                if (typeof app_common.APP_GLOBAL['module_praytimes_methods'][method].params.isha == 'string')
                    suffix = '';
                else
                    suffix = '°';
                document.getElementById('setting_method_param_isha').innerHTML = 'Isha:' + app_common.APP_GLOBAL['module_praytimes_methods'][method].params.isha + suffix;
                break;
            }
    }
}
/*----------------------- */
/* USER                   */
/*----------------------- */
//function sent as parameter, set the argument passed and convert result to integer with unary plus syntax
//and ES6 arrow function and without function keyword
let show_profile_function = (profile_id) => {
                                profile_show_app(+profile_id);
                            };

const user_login_app = async () => {
    let username = document.getElementById('common_login_username');
    let password = document.getElementById('common_login_password');
    let old_button = document.getElementById('common_login_button').innerHTML;
    document.getElementById('common_login_button').innerHTML = common.APP_SPINNER;
    await common.user_login(username.value, password.value, (err, result)=>{
        document.getElementById('common_login_button').innerHTML = old_button;
        if (err==null){
            //create intitial user setting if not exist, send initial=true
            user_settings_function('ADD_LOGIN', true, (err, result_settings) =>{
                if (err)
                    null;
                else{
                    common.set_avatar(result.avatar, document.getElementById('common_user_menu_avatar_img')); 
                    document.getElementById('tab_nav_btn_7').innerHTML = `<img id='user_setting_avatar_img' >`
                    common.set_avatar(result.avatar, document.getElementById('user_setting_avatar_img')); 

                    document.getElementById('common_user_menu_username').innerHTML = result.username;
                    document.getElementById('common_user_menu_username').style.display = 'block';
                    
                    document.getElementById('common_user_menu_logged_in').style.display = 'inline-block';
                    document.getElementById('common_user_menu_logged_out').style.display = 'none';
                    
                    document.getElementById('common_user_menu_dropdown_logged_in').style.display = 'block';
                    document.getElementById('common_user_menu_dropdown_logged_out').style.display = 'none';

                    //Show user tab
                    document.getElementById('tab_nav_7').style.display = 'inline-block';
                    //Hide settings
                    document.getElementById('settings').style.visibility = 'hidden';
                    //Hide profile
                    document.getElementById('common_dialogue_profile').style.visibility = 'hidden';
                    
                    document.getElementById('paper').innerHTML='';
                    dialogue_loading(1);
                    user_settings_get().then(() => {
                        user_settings_load().then(() => {
                            settings_translate(true).then(() => {
                                settings_translate(false).then(() => {
                                    //show default startup
                                    toolbar_button(app_common.APP_GLOBAL['app_default_startup_page']);
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
const user_verify_check_input_app = async (item, nextField) => {
    await common.user_verify_check_input(item, nextField, (err, result) => {
        if ((err==null && result==null)==false)
            if(err==null){
                //login if LOGIN  or SIGNUP were verified successfully
                if (result.verification_type==1 ||
                    result.verification_type==2)
                    user_login_app();
            }
    })
}
const user_function_app = async (function_name) => {
    await common.user_function(function_name, (err, result) => {
        if (err==null){
            profile_update_stat_app();
        }
    })
}
const profile_close_app = () => {
    common.profile_close();
    profile_clear_app;
}
const profile_clear_app = () => {

    document.getElementById('common_profile_public').style.display = "none";
    document.getElementById('common_profile_private').style.display = "none";
    
    document.getElementById('profile_info_user_setting_likes_count').innerHTML='';
    document.getElementById('profile_info_user_setting_liked_count').innerHTML='';
    document.getElementById('profile_select_user_settings').innerHTML='';

    document.getElementById('profile_user_settings_info_like_count').innerHTML='';
    document.getElementById('profile_user_settings_info_view_count').innerHTML='';
}
const user_logoff_app = () => {
    let select = document.getElementById("setting_select_user_setting");
    let option;
    //get new data token to avoid endless loop and invalid token
    common.user_logoff().then(() => {
        document.getElementById('tab_nav_btn_7').innerHTML = common.ICONS['user'];
        document.getElementById('user_settings').style.display = "none";
        
        profile_clear_app();
        //empty user settings
        select.innerHTML = '';
        //add one empty option
        option = document.createElement('option');
        select.appendChild(option);
        //set default settings
        set_default_settings().then(() => {
            settings_translate(true).then(() => {
                settings_translate(false).then(() => {
                    //show default startup
                    toolbar_button(app_common.APP_GLOBAL['app_default_startup_page']);
                })
            })
        });
    })    
}
const ProviderUser_update_app = async (identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email) => {
    await common.ProviderUser_update(identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, (err, result)=>{
        if(err==null){
            //create intitial user setting if not exist, send initial=true
            user_settings_function('ADD_LOGIN', true, (err, result_settings) =>{
                if (err)
                    null;
                else{       
                    common.set_avatar(result.avatar, document.getElementById('common_user_menu_avatar_img')); 
                    document.getElementById('tab_nav_btn_7').innerHTML = `<img id='user_setting_avatar_img' >`
                    common.set_avatar(result.avatar, document.getElementById('user_setting_avatar_img')); 
                    document.getElementById('common_user_menu_username').innerHTML = result.first_name + ' ' + result.last_name;
        
                    document.getElementById('common_user_menu_logged_in').style.display = 'inline-block';
                    document.getElementById('common_user_menu_logged_out').style.display = 'none';
                    document.getElementById('common_user_menu_dropdown_logged_in').style.display = 'block';
                    document.getElementById('common_user_menu_dropdown_logged_out').style.display = 'none';

                    //Show user tab
                    document.getElementById('tab_nav_7').style.display = 'inline-block';
                    document.getElementById('paper').innerHTML='';
                    dialogue_loading(1);
                    user_settings_get().then(() => {
                        user_settings_load().then(() => {
                            settings_translate(true).then(() => {
                                settings_translate(false).then(() => {
                                    //show default startup
                                    toolbar_button(app_common.APP_GLOBAL['app_default_startup_page']);
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
const ProviderSignIn_app = async (provider_button) => {
    await common.ProviderSignIn(provider_button, (err, result)=>{
        if (err==null){
            ProviderUser_update_app(result.identity_provider_id, 
                                    result.profile_id, 
                                    result.profile_first_name, 
                                    result.profile_last_name, 
                                    result.profile_image_url, 
                                    result.profile_email);
        }
    })
}
const profile_update_stat_app = async () => {
    await common.profile_update_stat((err, result) =>{
        if (err==null){
            profile_user_setting_stat(result.id);
        }
    })
}
const profile_show_app = async (user_account_id_other = null, username = null) => {
    document.getElementById('common_dialogue_profile').style.visibility = "visible";
    document.getElementById('common_profile_top').style.display = "none";
    document.getElementById('profile_main_stat_row2').style.display = "none";
    document.getElementById('profile_user_settings_row').style.display = "none";
    
    profile_clear_app();

    if (user_account_id_other == null && common.COMMON_GLOBAL['user_account_id'] == '' && username == null) {
        document.getElementById('common_profile_info').style.display = "none";
    }
    else
        await common.profile_show(user_account_id_other, username, (err, result)=>{
            if (err==null){
                if (result.profile_id != null){
                    if (result.private==1 && parseInt(common.COMMON_GLOBAL['user_account_id']) !== result.profile_id) {
                        //private
                        null;
                    } else {
                        //public
                        profile_show_user_setting();
                        document.getElementById('profile_main_stat_row2').style.display = "block";
                        profile_user_setting_stat(result.profile_id);
                    }    
                }
            }
        });
}
const profile_detail_app = (detailchoice, rest_url_app, fetch_detail, header_app, click_function) => {
    if (parseInt(common.COMMON_GLOBAL['user_account_id']) || 0 !== 0) {
        if (detailchoice == 0){
            //user settings
            document.getElementById('profile_user_settings_row').style.display = 'block';
        }
        else{
            //common 1 -4
            //app
            //7 Like user setting
            //8 Liked user setting
            document.getElementById('profile_user_settings_row').style.display = 'none';
        }
        common.profile_detail(detailchoice, rest_url_app, fetch_detail, header_app, click_function);
    } 
    else
        common.show_common_dialogue('LOGIN');
                
}

/*----------------------- */
/* USER SETTINGS          */
/*----------------------- */
const user_settings_get = async (user_setting_id = '') => {
    let select = document.getElementById("setting_select_user_setting");
    let result_obj;
    await common.FFB ('DB', `/user_account_app_setting/user_account_id/${common.COMMON_GLOBAL['user_account_id']}?`, 'GET', 0, null, (err, result) => {
        if (err)
            null;
        else{
            result_obj = JSON.parse(result);
            select.innerHTML = '';
            //fill select
            let option_html = '';
            for (let i = 0; i < result_obj.count; i++) {
                let settings;
                settings = JSON.parse(result_obj.items[i].settings_json);
                
                option_html += `<option value=${i} id=${result_obj.items[i].id} description='${settings.description}'
                                    regional_language_locale=${settings.regional_language_locale}
                                    regional_timezone=${settings.regional_timezone}
                                    regional_number_system=${settings.regional_number_system}
                                    regional_layout_direction=${settings.regional_layout_direction}
                                    regional_second_language_locale=${settings.regional_second_language_locale}
                                    regional_column_title=${settings.regional_column_title}
                                    regional_arabic_script=${settings.regional_arabic_script}
                                    regional_calendar_type=${settings.regional_calendar_type}
                                    regional_calendar_hijri_type=${settings.regional_calendar_hijri_type}
                                    gps_map_type=${settings.gps_map_type}
                                    ${settings.gps_country_id==null?`gps_country_id `:'gps_country_id=' + settings.gps_country_id}
                                    ${settings.gps_city_id==null?`gps_city_id `:'gps_city_id=' + settings.gps_city_id}
                                    ${settings.gps_popular_place_id==null?`gps_popular_place_id `:'gps_popular_place_id=' + settings.gps_popular_place_id}
                                    gps_lat_text=${settings.gps_lat_text}
                                    gps_long_text=${settings.gps_long_text}
                                    design_theme_day_id=${settings.design_theme_day_id}
                                    design_theme_month_id=${settings.design_theme_month_id}
                                    design_theme_year_id=${settings.design_theme_year_id}
                                    design_paper_size=${settings.design_paper_size}
                                    design_row_highlight=${settings.design_row_highlight}
                                    design_column_weekday_checked=${settings.design_column_weekday_checked}
                                    design_column_calendartype_checked=${settings.design_column_calendartype_checked}
                                    design_column_notes_checked=${settings.design_column_notes_checked}
                                    design_column_gps_checked=${settings.design_column_gps_checked}
                                    design_column_timezone_checked=${settings.design_column_timezone_checked}
                                    image_header_image_img='${common.image_format(settings.image_header_image_img)}'
                                    image_footer_image_img='${common.image_format(settings.image_footer_image_img)}'
                                    text_header_1_text='${settings.text_header_1_text==null?'':settings.text_header_1_text}'
                                    text_header_2_text='${settings.text_header_2_text==null?'':settings.text_header_2_text}'
                                    text_header_3_text='${settings.text_header_3_text==null?'':settings.text_header_3_text}'
                                    text_header_align='${settings.text_header_align==null?'':settings.text_header_align}'
                                    text_footer_1_text='${settings.text_footer_1_text==null?'':settings.text_footer_1_text}'
                                    text_footer_2_text='${settings.text_footer_2_text==null?'':settings.text_footer_2_text}'
                                    text_footer_3_text='${settings.text_footer_3_text==null?'':settings.text_footer_3_text}'
                                    text_footer_align='${settings.text_footer_align==null?'':settings.text_footer_align}'    
                                    prayer_method=${settings.prayer_method}
                                    prayer_asr_method=${settings.prayer_asr_method}
                                    prayer_high_latitude_adjustment=${settings.prayer_high_latitude_adjustment}
                                    prayer_time_format=${settings.prayer_time_format}
                                    prayer_hijri_date_adjustment=${settings.prayer_hijri_date_adjustment}
                                    prayer_fajr_iqamat=${settings.prayer_fajr_iqamat}
                                    prayer_dhuhr_iqamat=${settings.prayer_dhuhr_iqamat}
                                    prayer_asr_iqamat=${settings.prayer_asr_iqamat}
                                    prayer_maghrib_iqamat=${settings.prayer_maghrib_iqamat}
                                    prayer_isha_iqamat=${settings.prayer_isha_iqamat}
                                    prayer_column_imsak_checked=${settings.prayer_column_imsak_checked}
                                    prayer_column_sunset_checked=${settings.prayer_column_sunset_checked}
                                    prayer_column_midnight_checked=${settings.prayer_column_midnight_checked}
                                    prayer_column_fast_start_end=${settings.prayer_column_fast_start_end}
                                    user_account_id=${result_obj.items[i].user_account_app_user_account_id}
                                    >${settings.description}
                                </option>`
            }
            select.innerHTML += option_html;
            //show user setting select
            document.getElementById('user_settings').style.display = "block";
        }
    })
}
const user_setting_link = (item) => {
    let paper_size_select = document.getElementById('setting_select_report_papersize');
    let select_user_setting = document.getElementById('setting_select_user_setting');
    let user_account_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id');
    let sid = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    document.getElementById('common_window_info_content').className = paper_size_select.options[paper_size_select.selectedIndex].value;
    switch (item.id){
        case 'user_day_html':
        case 'user_month_html':
        case 'user_year_html':{
            let url = get_report_url(user_account_id, 
                                     sid, 
                                     paper_size_select.options[paper_size_select.selectedIndex].value,
                                     item.id,
                                     'HTML');
            common.show_window_info(2, null, 'HTML', url);
            break;
        }
        case 'user_day_html_copy':
        case 'user_month_html_copy':
        case 'user_year_html_copy':{
            let text_copy = get_report_url(user_account_id, 
                                           sid, 
                                           paper_size_select.options[paper_size_select.selectedIndex].value,
                                           item.id,
                                           'HTML');
            navigator.clipboard.writeText(text_copy) .then(() => {
                common.show_message('INFO', null, null, common.ICONS['app_link'], common.COMMON_GLOBAL['common_app_id']);
            });
            break;
        }
        case 'user_day_pdf':
        case 'user_month_pdf':
        case 'user_year_pdf':{
            let url = get_report_url(user_account_id, 
                                     sid, 
                                     paper_size_select.options[paper_size_select.selectedIndex].value,
                                     item.id,
                                     'PDF');
            common.show_window_info(2, null, 'PDF', url);
            break;
        }
        case 'user_day_pdf_copy':
        case 'user_month_pdf_copy':
        case 'user_year_pdf_copy':{
            let text_copy = get_report_url(user_account_id, 
                                           sid, 
                                           paper_size_select.options[paper_size_select.selectedIndex].value,
                                           item.id,
                                           'PDF');
            navigator.clipboard.writeText(text_copy) .then(() => {
                common.show_message('INFO', null, null, common.ICONS['app_link'], common.COMMON_GLOBAL['common_app_id']);
            });
            break;
        }
    }
}
const user_settings_load = async () => {

    let select_user_setting = document.getElementById('setting_select_user_setting');
    //Regional
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_language_locale'),
        document.getElementById('setting_select_locale'), 1);

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_timezone'),
        document.getElementById('setting_select_report_timezone'), 1)

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_number_system'),
        document.getElementById('setting_select_report_numbersystem'), 1)
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_layout_direction'),
        document.getElementById('setting_select_report_direction'), 1)
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_second_language_locale'),
        document.getElementById('setting_select_report_locale_second'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_column_title'),
        document.getElementById('setting_select_report_coltitle'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_arabic_script'),
        document.getElementById('setting_select_report_arabic_script'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_type'),
        document.getElementById('setting_select_calendartype'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_hijri_type'),
        document.getElementById('setting_select_calendar_hijri_type'),1);
    //GPS
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_map_type'),
        document.getElementById('setting_select_maptype'),1);
    common.map_setstyle(document.getElementById('setting_select_maptype').value);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id'),
        document.getElementById('setting_select_country'),0);
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id')||null !=null) {
        //fill cities for chosen country
        await update_ui(5).then(() => {
            common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id'),
                document.getElementById('setting_select_city'),0);
            if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id')||null !=null) {
                //set GPS for chosen city
                update_ui(6);
            }
        })
    }        
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id'),
        document.getElementById('setting_select_popular_place'),0);
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id')||null !=null) {
        //set GPS for chosen popular place
        update_ui(7);
    }
    document.getElementById('setting_input_place').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('description');
    document.getElementById('setting_input_lat').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_lat_text');
    document.getElementById('setting_input_long').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_long_text');
    if (
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id')||null == null &&
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id')||null == null &&
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id')||null == null) {
        map_update_app(document.getElementById('setting_input_long').value,
                       document.getElementById('setting_input_lat').value,
                       app_common.APP_GLOBAL['gps_module_leaflet_zoom'], //default zoom
                       document.getElementById('setting_input_place').value,
                       document.getElementById('setting_select_report_timezone').value,
                       app_common.APP_GLOBAL['gps_module_leaflet_marker_div_gps'],
                       common.COMMON_GLOBAL['module_leaflet_jumpto']);
    }
    //Design
    set_theme_id('day', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_day_id'));
    set_theme_id('month', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_month_id'));
    set_theme_id('year', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_year_id'));

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_paper_size'),
        document.getElementById('setting_select_report_papersize'),1);
    
    document.getElementById('paper').className=document.getElementById('setting_select_report_papersize').value;
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_row_highlight'),
        document.getElementById('setting_select_report_highlight_row'),1);

    document.getElementById('setting_checkbox_report_show_weekday').checked =
        common.number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_weekday_checked'));
    document.getElementById('setting_checkbox_report_show_calendartype').checked =
        common.number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_calendartype_checked'));
    document.getElementById('setting_checkbox_report_show_notes').checked =
        common.number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_notes_checked'));
    document.getElementById('setting_checkbox_report_show_gps').checked =
        common.number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_gps_checked'));
    document.getElementById('setting_checkbox_report_show_timezone').checked =
        common.number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_timezone_checked'));

    //Image
    //dont set null value, it will corrupt IMG tag
    document.getElementById('setting_input_reportheader_img').value = '';
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img') == null ||
        select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img') == '') {
        common.recreate_img(document.getElementById('setting_reportheader_img'));
    } else {
        document.getElementById('setting_reportheader_img').src =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img');
    }

    document.getElementById('setting_input_reportfooter_img').value = '';
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img') == null ||
        select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img') == '') {
        document.getElementById('setting_reportfooter_img').src = '';
        common.recreate_img(document.getElementById('setting_reportfooter_img'));
    } else {
        document.getElementById('setting_reportfooter_img').src =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img');
    }
    //Text
    document.getElementById('setting_input_reportheader1').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_1_text');
    document.getElementById('setting_input_reportheader2').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_2_text');
    document.getElementById('setting_input_reportheader3').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_3_text');
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align') == '') {
        document.getElementById('setting_icon_text_header_aleft').classList.remove('setting_button_active');
        document.getElementById('setting_icon_text_header_acenter').classList.remove('setting_button_active');
        document.getElementById('setting_icon_text_header_aright').classList.remove('setting_button_active');
    } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
        //remove active class if it is active
        document.getElementById('setting_icon_text_header_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align')).classList.remove('setting_button_active');
        update_ui(15, 'setting_icon_text_header_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align'));
    }
    document.getElementById('setting_input_reportfooter1').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_1_text');
    document.getElementById('setting_input_reportfooter2').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_2_text');
    document.getElementById('setting_input_reportfooter3').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_3_text');
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align') == '') {
        document.getElementById('setting_icon_text_footer_aleft').classList.remove('setting_button_active');
        document.getElementById('setting_icon_text_footer_acenter').classList.remove('setting_button_active');
        document.getElementById('setting_icon_text_footer_aright').classList.remove('setting_button_active');
    } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
        //remove active class if it is active
        document.getElementById('setting_icon_text_footer_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align')).classList.remove('setting_button_active');
        update_ui(16, 'setting_icon_text_footer_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align'));
    }
    //Prayer
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_method'),
        document.getElementById('setting_select_method'),1);
    //show method parameters used
    update_ui(17);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_method'),
        document.getElementById('setting_select_asr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_high_latitude_adjustment'),
        document.getElementById('setting_select_highlatitude'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_time_format'),
        document.getElementById('setting_select_timeformat'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_hijri_date_adjustment'),
        document.getElementById('setting_select_hijri_adjustment'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_fajr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_dhuhr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_asr'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_maghrib_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_maghrib'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_isha_iqamat'),
        document.getElementById('setting_select_report_iqamat_title_isha'),1);

    document.getElementById('setting_checkbox_report_show_imsak').checked =
        common.number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_imsak_checked'));
    document.getElementById('setting_checkbox_report_show_sunset').checked =
        common.number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_sunset_checked'));
    document.getElementById('setting_checkbox_report_show_midnight').checked =
        common.number_to_boolean(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_midnight_checked'));

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_fast_start_end'),
        document.getElementById('setting_select_report_show_fast_start_end'),1);

    return null;
}

const user_settings_function = async (function_name, initial_user_setting, callBack) => {
    let description = document.getElementById('setting_input_place').value;
    let select_setting_country = document.getElementById('setting_select_country');
    let select_setting_city = document.getElementById('setting_select_city');
    let select_setting_popular_place = document.getElementById('setting_select_popular_place');
    if (common.check_input(description) == false ||
        common.check_input(document.getElementById('setting_input_lat').value) == false ||
        common.check_input(document.getElementById('setting_input_long').value) == false ||
        common.check_input(document.getElementById('setting_input_reportheader1').value) == false ||
        common.check_input(document.getElementById('setting_input_reportheader2').value) == false ||
        common.check_input(document.getElementById('setting_input_reportheader3').value) == false ||
        common.check_input(document.getElementById('setting_input_reportfooter1').value) == false ||
        common.check_input(document.getElementById('setting_input_reportfooter2').value) == false ||
        common.check_input(document.getElementById('setting_input_reportfooter3').value) == false ||
        common.check_input(document.getElementById('setting_input_long').value) == false)
        return;
    //boolean use common.boolean_to_number()
    //store 0/1 for checked value for checkboxes
    let json_settings =
        `{"description": "${description}",
          "regional_language_locale": "${document.getElementById('setting_select_locale').value}",
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
          "design_column_weekday_checked": ${common.boolean_to_number(document.getElementById('setting_checkbox_report_show_weekday').checked)},
          "design_column_calendartype_checked": ${common.boolean_to_number(document.getElementById('setting_checkbox_report_show_calendartype').checked)},
          "design_column_notes_checked": ${common.boolean_to_number(document.getElementById('setting_checkbox_report_show_notes').checked)},
          "design_column_gps_checked": ${common.boolean_to_number(document.getElementById('setting_checkbox_report_show_gps').checked)},
          "design_column_timezone_checked": ${common.boolean_to_number(document.getElementById('setting_checkbox_report_show_timezone').checked)},

          "image_header_image_img": "${document.getElementById('setting_reportheader_img').src}",
          "image_footer_image_img": "${document.getElementById('setting_reportfooter_img').src}",

          "text_header_1_text": "${document.getElementById('setting_input_reportheader1').value}",
          "text_header_2_text": "${document.getElementById('setting_input_reportheader2').value}",
          "text_header_3_text": "${document.getElementById('setting_input_reportheader3').value}",
          "text_header_align": "${align_button_value('header')}",
          "text_footer_1_text": "${document.getElementById('setting_input_reportfooter1').value}",
          "text_footer_2_text": "${document.getElementById('setting_input_reportfooter2').value}",
          "text_footer_3_text": "${document.getElementById('setting_input_reportfooter3').value}",
          "text_footer_align": "${align_button_value('footer')}",

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
          "prayer_column_imsak_checked": ${common.boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked)},
          "prayer_column_sunset_checked": ${common.boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked)},
          "prayer_column_midnight_checked": ${common.boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked)},
          "prayer_column_fast_start_end": "${document.getElementById('setting_select_report_show_fast_start_end').value}"
         }`;
    let json_data = `{
                        "description": "${description}",
                        "settings_json": ${json_settings},
                        "user_account_id": ${common.COMMON_GLOBAL['user_account_id']}
                    }`;	
    let method;
    let path;
    let old_button;
    let spinner_item;
    
    switch (function_name){
        case 'ADD_LOGIN':
        case 'ADD':{
            if (function_name=='ADD'){
                spinner_item = document.getElementById('setting_btn_user_add')
                old_button = spinner_item.innerHTML;
                spinner_item.innerHTML = common.APP_SPINNER;    
            }
            method = 'POST';
            path = `/user_account_app_setting?initial=${initial_user_setting==true?1:0}`;
            break;
        }
        case 'SAVE':{
            spinner_item = document.getElementById('setting_btn_user_save')
            old_button = spinner_item.innerHTML;
            spinner_item.innerHTML = common.APP_SPINNER;
            method = 'PUT';
            let select_user_setting = document.getElementById('setting_select_user_setting');
            let user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
            path = `/user_account_app_setting/${user_setting_id}?`;
            break;
        }
        default:{
            break;
        }
    }
    await common.FFB ('DB', path, method, 1, json_data, (err, result) => {
        if (err){
            if (function_name !='ADD_LOGIN')
                spinner_item.innerHTML = old_button;
            callBack(err, null);
        }
        else{
            if (function_name !='ADD_LOGIN')
                spinner_item.innerHTML = old_button;
            let json = JSON.parse(result);
            switch (function_name){
                case 'ADD':{
                    //update user settings select with saved data
                    //save current settings to new option with 
                    //returned user_setting_id + common.COMMON_GLOBAL['user_account_id'] (then call set_settings_select)
                    let select = document.getElementById("setting_select_user_setting");
                    select.innerHTML += `<option id=${json.id} user_account_id=${common.COMMON_GLOBAL['user_account_id']} >${description}</option>`;
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
        }
    })
}

const user_settings_delete = (choice=null) => {
    let select_user_setting = document.getElementById('setting_select_user_setting');
    let user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    const function_delete_user_setting = () => { document.getElementById('common_dialogue_message').style.visibility = 'hidden';user_settings_delete(1) };
    
    switch (choice){
        case null:{
            common.show_message('CONFIRM',null,function_delete_user_setting, null, common.COMMON_GLOBAL['app_id']);
            break;
        }
        case 1:{
            if (select_user_setting.length > 1) {
                let old_button = document.getElementById('setting_btn_user_delete').innerHTML;
                document.getElementById('setting_btn_user_delete').innerHTML = common.APP_SPINNER;
                common.FFB ('DB', `/user_account_app_setting/${user_setting_id}?`, 'DELETE', 1, null, (err, result) => {
                    if (err){
                        document.getElementById('setting_btn_user_delete').innerHTML = old_button;
                    }
                    else{
                        let select = document.getElementById("setting_select_user_setting");
                        //delete current option
                        select.remove(select.selectedIndex);
                        //load next available
                        user_settings_load().then(() => {
                            settings_translate(true).then(() => {
                                settings_translate(false).then(() => {
                                    document.getElementById('setting_btn_user_delete').innerHTML = old_button;
                                })
                            })
                        })
                    }
                })       
            } else {
                //You can't delete last user setting
                common.show_message('ERROR', 20302, null, null, common.COMMON_GLOBAL['app_id']);
            }
        }
    }
    return null;
}

const set_default_settings = async () => {
    let current_number_system = Intl.NumberFormat().resolvedOptions().numberingSystem;

    //Regional
    //set default language
    common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL['user_locale'], document.getElementById('setting_select_locale'),1);
    //default timezone current timezone
    document.getElementById('setting_timezone_current').innerHTML = common.COMMON_GLOBAL['user_timezone'];
    //default report timezone current timezone, 
    //will be changed user timezone to place timezone if no GPS can be set and default place will be used
    common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL['user_timezone'], document.getElementById('setting_select_report_timezone'),1);
    //set default numberformat numbersystem
    common.SearchAndSetSelectedIndex(current_number_system, document.getElementById('setting_select_report_numbersystem'),1);
    //set default for others in Regional

    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['regional_default_direction'], document.getElementById('setting_select_report_direction'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['regional_default_locale_second'], document.getElementById('setting_select_report_locale_second'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['regional_default_coltitle'], document.getElementById('setting_select_report_coltitle'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['regional_default_arabic_script'], document.getElementById('setting_select_report_arabic_script'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['regional_default_calendartype'], document.getElementById('setting_select_calendartype'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['regional_default_calendar_hijri_type'], document.getElementById('setting_select_calendar_hijri_type'),1);

    //GPS 
    common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL['module_leaflet_style'], document.getElementById('setting_select_maptype'),1);
    common.map_setstyle(document.getElementById('setting_select_maptype').value);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['gps_default_country'], document.getElementById('setting_select_country'),0);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['gps_default_city'], document.getElementById('setting_select_city'),0);
    
    //set according to users GPS/IP settings
    if (common.COMMON_GLOBAL['client_latitude'] != '' && common.COMMON_GLOBAL['client_longitude'] != '') {
        document.getElementById('setting_input_lat').value = common.COMMON_GLOBAL['client_latitude'];
        document.getElementById('setting_input_long').value = common.COMMON_GLOBAL['client_longitude'];
        //Update GPS position
        update_ui(9);
        document.getElementById('setting_input_place').value = common.COMMON_GLOBAL['client_place'];
    } else {
        //Set Makkah as default
        let select_place = document.getElementById('setting_select_popular_place');
        select_place.selectedIndex = select_get_selectindex(select_place.id, app_common.APP_GLOBAL['gps_default_place_id']);
        //Update popular places
        update_ui(7);
    }
    //Design
    set_theme_id('day', app_common.APP_GLOBAL['design_default_theme_day']);
    set_theme_id('month', app_common.APP_GLOBAL['design_default_theme_month']);
    set_theme_id('year', app_common.APP_GLOBAL['design_default_theme_year']);

    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['design_default_papersize'], document.getElementById('setting_select_report_papersize'),1);
    document.getElementById('paper').className=document.getElementById('setting_select_report_papersize').value;
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['design_default_highlight_row'], document.getElementById('setting_select_report_highlight_row'),1);
    
    document.getElementById('setting_checkbox_report_show_weekday').checked = app_common.APP_GLOBAL['design_default_show_weekday'];
    document.getElementById('setting_checkbox_report_show_calendartype').checked = app_common.APP_GLOBAL['design_default_show_calendartype'];
    document.getElementById('setting_checkbox_report_show_notes').checked = app_common.APP_GLOBAL['design_default_show_notes'];
    document.getElementById('setting_checkbox_report_show_gps').checked = app_common.APP_GLOBAL['design_default_show_gps'];
    document.getElementById('setting_checkbox_report_show_timezone').checked = app_common.APP_GLOBAL['design_default_show_timezone'];

    //Image
    document.getElementById('setting_input_reportheader_img').value = '';
    if (app_common.APP_GLOBAL['image_default_report_header_src'] == null || app_common.APP_GLOBAL['image_default_report_header_src'] == '')
        common.recreate_img(document.getElementById('setting_reportheader_img'));
    else {
        document.getElementById('setting_reportheader_img').src = app_common.APP_GLOBAL['image_default_report_header_src'];
    }
    document.getElementById('setting_input_reportfooter_img').value = '';
    if (app_common.APP_GLOBAL['image_default_report_footer_src'] == null || app_common.APP_GLOBAL['image_default_report_footer_src'] == '')
        common.recreate_img(document.getElementById('setting_reportfooter_img'));
    else {
        document.getElementById('setting_reportfooter_img').src = app_common.APP_GLOBAL['image_default_report_footer_src'];
    }
    //Text
    document.getElementById('setting_input_reportheader1').value = app_common.APP_GLOBAL['text_default_reporttitle1'];
    document.getElementById('setting_input_reportheader2').value = app_common.APP_GLOBAL['text_default_reporttitle2'];
    document.getElementById('setting_input_reportheader3').value = app_common.APP_GLOBAL['text_default_reporttitle3'];
    document.getElementById('setting_icon_text_header_aleft').classList = 'setting_button'; //Align left not active
    document.getElementById('setting_icon_text_header_acenter').classList = 'setting_button'; //Align center not active
    document.getElementById('setting_icon_text_header_aright').classList = 'setting_button'; //Align right not active
    document.getElementById('setting_input_reportfooter1').value = app_common.APP_GLOBAL['text_default_reportfooter1'];
    document.getElementById('setting_input_reportfooter2').value = app_common.APP_GLOBAL['text_default_reportfooter2'];
    document.getElementById('setting_input_reportfooter3').value = app_common.APP_GLOBAL['text_default_reportfooter3'];
    document.getElementById('setting_icon_text_footer_aleft').classList = 'setting_button'; //Align left not active
    document.getElementById('setting_icon_text_footer_acenter').classList = 'setting_button'; //Align center not active
    document.getElementById('setting_icon_text_footer_aright').classList = 'setting_button'; //Align right not active

    //Prayer
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_method'], document.getElementById('setting_select_method'),1);
    //show method parameters used
    update_ui(17);

    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_asr'], document.getElementById('setting_select_asr'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_highlatitude'], document.getElementById('setting_select_highlatitude'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_timeformat'], document.getElementById('setting_select_timeformat'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_hijri_adjustment'], document.getElementById('setting_select_hijri_adjustment'),1);
    
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_iqamat_title_fajr'], document.getElementById('setting_select_report_iqamat_title_fajr'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_iqamat_title_dhuhr'], document.getElementById('setting_select_report_iqamat_title_dhuhr'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_iqamat_title_asr'], document.getElementById('setting_select_report_iqamat_title_asr'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_iqamat_title_maghrib'], document.getElementById('setting_select_report_iqamat_title_maghrib'),1);
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_iqamat_title_isha'], document.getElementById('setting_select_report_iqamat_title_isha'),1);

    document.getElementById('setting_checkbox_report_show_imsak').checked = app_common.APP_GLOBAL['prayer_default_show_imsak'];
    document.getElementById('setting_checkbox_report_show_sunset').checked = app_common.APP_GLOBAL['prayer_default_show_sunset'];
    document.getElementById('setting_checkbox_report_show_midnight').checked = app_common.APP_GLOBAL['prayer_default_show_midnight'];
    common.SearchAndSetSelectedIndex(app_common.APP_GLOBAL['prayer_default_show_fast_start_end'], document.getElementById('setting_select_report_show_fast_start_end'),1);
    //update select
    set_settings_select();
    //Hide user tab
    document.getElementById('tab_nav_7').style.display = 'none';
    //open regional tab in settings
    openTab('1');
}

const set_settings_select = () => {
    let option = document.getElementById("setting_select_user_setting").options[document.getElementById("setting_select_user_setting").selectedIndex];
    option.text = document.getElementById('setting_input_place').value;
    
    option.setAttribute('description', document.getElementById('setting_input_place').value);
    option.setAttribute('regional_language_locale', document.getElementById('setting_select_locale').value);
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
    option.setAttribute('design_column_weekday_checked', common.boolean_to_number(document.getElementById('setting_checkbox_report_show_weekday').checked));
    option.setAttribute('design_column_calendartype_checked', common.boolean_to_number(document.getElementById('setting_checkbox_report_show_calendartype').checked));
    option.setAttribute('design_column_notes_checked', common.boolean_to_number(document.getElementById('setting_checkbox_report_show_notes').checked));
    option.setAttribute('design_column_gps_checked', common.boolean_to_number(document.getElementById('setting_checkbox_report_show_gps').checked));
    option.setAttribute('design_column_timezone_checked', common.boolean_to_number(document.getElementById('setting_checkbox_report_show_timezone').checked));

    option.setAttribute('image_header_image_img', document.getElementById('setting_reportheader_img').src);
    option.setAttribute('image_footer_image_img', document.getElementById('setting_reportfooter_img').src);

    //fix null value that returns the word "null" without quotes
    option.setAttribute('text_header_1_text', document.getElementById('setting_input_reportheader1').value);
    option.setAttribute('text_header_2_text', document.getElementById('setting_input_reportheader2').value);
    option.setAttribute('text_header_3_text', document.getElementById('setting_input_reportheader3').value);
    option.setAttribute('text_header_align', align_button_value('header'));
    option.setAttribute('text_footer_1_text', document.getElementById('setting_input_reportfooter1').value);
    option.setAttribute('text_footer_2_text', document.getElementById('setting_input_reportfooter2').value);
    option.setAttribute('text_footer_3_text', document.getElementById('setting_input_reportfooter3').value);
    option.setAttribute('text_footer_align', align_button_value('footer'));

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
    option.setAttribute('prayer_column_imsak_checked', common.boolean_to_number(document.getElementById('setting_checkbox_report_show_imsak').checked));
    option.setAttribute('prayer_column_sunset_checked', common.boolean_to_number(document.getElementById('setting_checkbox_report_show_sunset').checked));
    option.setAttribute('prayer_column_midnight_checked', common.boolean_to_number(document.getElementById('setting_checkbox_report_show_midnight').checked));
    option.setAttribute('prayer_column_fast_start_end', document.getElementById('setting_select_report_show_fast_start_end').value);
}

const profile_user_setting_stat = (id) => {
    let json;
    common.FFB ('DB', `/user_account_app_setting/profile/${id}?`, 'GET', 0, null, (err, result) => {
        if (err)
            null;
        else{
            json = JSON.parse(result);
            document.getElementById('profile_info_user_setting_likes_count').innerHTML = json.items.count_user_setting_likes;
            document.getElementById('profile_info_user_setting_liked_count').innerHTML = json.items.count_user_setting_liked;
        }
    })
}

const profile_user_setting_link = (item) => {
    let paper_size_select = document.getElementById('setting_select_report_papersize');
    
    let select_user_setting = document.getElementById('profile_select_user_settings');
    let user_account_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id');
    let sid = select_user_setting[select_user_setting.selectedIndex].getAttribute('sid');
    document.getElementById('common_window_info_content').className = paper_size_select.options[paper_size_select.selectedIndex].value;
    switch (item.id){
        case 'profile_user_settings_day':
        case 'profile_user_settings_month':
        case 'profile_user_settings_year':{
            updateViewStat_app(sid,user_account_id);
            let url = get_report_url(user_account_id, 
                                     sid, 
                                     paper_size_select.options[paper_size_select.selectedIndex].value,
                                     item.id,
                                     'HTML');
            common.show_window_info(2, null, 'HTML', url);
            break;
        }
        case 'profile_user_settings_like':{
            user_settings_like(sid);
            break;
        }
    }
}
const profile_show_user_setting_detail = (liked, count_likes, count_views) => {
    
    document.getElementById('profile_user_settings_like').children[0].style.display = `${liked == 1?'none':'block'}`;
    document.getElementById('profile_user_settings_like').children[1].style.display = `${liked == 1?'block':'none'}`;

    document.getElementById('profile_user_settings_info_like_count').innerHTML = count_likes;
    document.getElementById('profile_user_settings_info_view_count').innerHTML = count_views;
}
const profile_show_user_setting = () => {
    let json;
    document.getElementById('profile_user_settings_row').style.display = 'block';

    common.FFB ('DB', `/user_account_app_setting/profile/all/${document.getElementById('common_profile_id').innerHTML}` + 
                      '?id=' + common.COMMON_GLOBAL['user_account_id'], 'GET', 0, null, (err, result) => {
        if (err)
            null;
        else{
            json = JSON.parse(result);
            let profile_select_user_settings = document.getElementById('profile_select_user_settings');
            profile_select_user_settings.innerHTML='';
            let html = '';
            for (let i = 0; i < json.count; i++) {
                html += `<option id="${i}" 
                        value=""
                        sid=${json.items[i].id} 
                        user_account_id=${json.items[i].user_account_app_user_account_id}
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
}
const profile_user_setting_update_stat = () => {
    let profile_id = document.getElementById('common_profile_id').innerHTML;
    let json;
    common.FFB ('DB', `/user_account_app_setting/profile/all/${profile_id}` +
                      '?id=' + common.COMMON_GLOBAL['user_account_id'], 'GET', 0, null, (err, result) => {
        if (err)
            null;
        else{
            json = JSON.parse(result);
            let profile_select_user_settings = document.getElementById('profile_select_user_settings');
            for (let i = 0; i < json.count; i++) {
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
}
const user_settings_like = (user_setting_id) => {
    let json;
    let json_data;
    let method;

    json_data = '{"user_setting_id":' + user_setting_id + '}';

    if (common.COMMON_GLOBAL['user_account_id'] == '')
        common.show_common_dialogue('LOGIN');
    else {
        if (document.getElementById('profile_user_settings_like').children[0].style.display == 'block') {
            method = 'POST';
        }
        else {
            method = 'DELETE';
        }
        common.FFB ('DB', `/user_account_app_setting_like/${common.COMMON_GLOBAL['user_account_id']}?`, method, 1, json_data, (err, result) => {
            if (err)
                null;
            else{
                    json = JSON.parse(result);
                    profile_user_setting_update_stat();
                } 
        })
    }
}
/*----------------------- */
/* EVENTS                 */
/*----------------------- */
const setEvents = () => {
    //app
    //toolbar top
    document.getElementById('toolbar_top').addEventListener('click', (event) => {
        let event_target_id;
        if  (event.target.classList.contains('common_toolbar_button')){
            //button
            event_target_id = event.target.id;
        }
        else
            if  (event.target.parentNode.classList.contains('common_toolbar_button')){
                //svg or icon
                event_target_id = event.target.parentNode.id;
            }
            else{
                //path in svg
                event_target_id = event.target.parentNode.parentNode.id;
            }
        switch (event_target_id){
            case 'toolbar_btn_zoomout':{
                zoom_paper(-1)
                break;
            }
            case 'toolbar_btn_zoomin':{
                zoom_paper(1)
                break;
            }
            case 'toolbar_btn_left':{
                update_timetable_report(app_common.APP_GLOBAL['timetable_type'], event_target_id, getReportSettings());
                break;
            }
            case 'toolbar_btn_right':{
                update_timetable_report(app_common.APP_GLOBAL['timetable_type'], event_target_id, getReportSettings())
                break;
            }
            case 'toolbar_btn_search':{
                let x = document.getElementById('common_profile_input_row'); 
                if (x.style.visibility == 'visible') {
                    x.style.visibility = 'hidden';
                    document.getElementById('common_profile_search_list_wrap').style.visibility = 'hidden';
                } 
                else{
                    x.style.visibility = 'visible'; 
                    document.getElementById('common_profile_search_list_wrap').style.visibility = 'visible';
                    document.getElementById('common_profile_search_input').focus();
                }
                break;
            }
        }
    }, false);
    //tab navigation
    document.getElementById('tab_navigation').addEventListener('click', (event) => {
        let event_target_id;
        if  (event.target.id.startsWith('tab_nav_btn')){
            //button
            event_target_id = event.target.id;
        }
        else
            if  (event.target.parentNode.id.startsWith('tab_nav_btn')){
                //svg or icon
                event_target_id = event.target.parentNode.id;
            }
            else{
                //path in svg
                event_target_id = event.target.parentNode.parentNode.id;
            }
        switch (event_target_id){
            case 'tab_nav_btn_1':{
                openTab('1');
                break;
            }
            case 'tab_nav_btn_2':{
                openTab('2');
                common.map_resize();
                break;
            }
            case 'tab_nav_btn_3':{
                openTab('3');
                break;
            }
            case 'tab_nav_btn_4':{
                openTab('4');
                break;
            }
            case 'tab_nav_btn_5':{
                openTab('5');
                break;
            }
            case 'tab_nav_btn_6':{
                openTab('6');
                break;
            }
            case 'tab_nav_btn_7':{
                openTab('7');
                break;
            }
        }
    }, false);
    //settings regional    
    document.getElementById('setting_select_locale').addEventListener('change', () => { settings_translate(true) }, false);
    document.getElementById('setting_select_report_timezone').addEventListener('change', () => { update_ui(2); }, false);
    document.getElementById('setting_select_report_locale_second').addEventListener('change', () => { settings_translate(false) }, false);                                                        

    //settings gps    
    document.getElementById('setting_select_maptype').addEventListener('change', () => { update_ui(4); }, false);
    document.getElementById('setting_select_country').addEventListener('change', () => { update_ui(5); }, false);         
    document.getElementById('setting_select_city').addEventListener('change', () => { update_ui(6);}, false);
    document.getElementById('setting_select_popular_place').addEventListener('change', () => { update_ui(7);}, false);
    document.getElementById('setting_input_place').addEventListener('keyup', () => { common.typewatch(update_ui, 8); }, false);
    document.getElementById('setting_input_lat').addEventListener('keyup', () => { common.typewatch(update_ui, 9); }, false);
    document.getElementById('setting_input_long').addEventListener('keyup', () => { common.typewatch(update_ui, 9); }, false);    
    //settings design
    document.getElementById('setting_select_report_papersize').addEventListener('change', () => { update_ui(10); }, false);
    //settings image
    document.getElementById('setting_icon_image_header_img').addEventListener('click', () => { document.getElementById('setting_input_reportheader_img').click() }, false);
    document.getElementById('setting_icon_image_header_clear').addEventListener('click', () => { update_ui(12) }, false);
    document.getElementById('setting_input_reportheader_img').addEventListener('change', (event) => { update_ui(11, event.target.id) }, false);
    document.getElementById('setting_icon_image_footer_img').addEventListener('click', () => { document.getElementById('setting_input_reportfooter_img').click() }, false);
    document.getElementById('setting_icon_image_footer_clear').addEventListener('click', () => { update_ui(14) }, false);
    document.getElementById('setting_input_reportfooter_img').addEventListener('change', (event) => { update_ui(13, event.target.id) }, false);
    //settings text
    document.getElementById('setting_icon_text_theme_row').addEventListener('click', (event) => {  
                                                                                                document.getElementById('setting_icon_text_theme_day').classList.remove('common_dialogue_button');
                                                                                                document.getElementById('setting_icon_text_theme_month').classList.remove('common_dialogue_button');
                                                                                                document.getElementById('setting_icon_text_theme_year').classList.remove('common_dialogue_button');
                                                                                                let theme_type;
                                                                                                if (event.target.id == 'setting_icon_text_theme_row'){
                                                                                                    //default when clicking on tab
                                                                                                    theme_type = 'day';
                                                                                                }
                                                                                                else
                                                                                                    if (event.target.id.substring(24) == 'day' ||
                                                                                                        event.target.id.substring(24) == 'month'||
                                                                                                        event.target.id.substring(24) == 'year')
                                                                                                        theme_type = event.target.id.substring(24);
                                                                                                    else
                                                                                                        theme_type = event.target.parentElement.id.substring(24);
                                                                                                    
                                                                                                //mark active icon
                                                                                                document.getElementById('setting_icon_text_theme_' + theme_type).classList.add('common_dialogue_button');
                                                                                                if (theme_type=='day' || theme_type=='month' || theme_type=='year'){
                                                                                                    document.querySelector('#setting_paper_preview_text').className =  'setting_paper_preview' + ' ' +
                                                                                                                                                                        `theme_${theme_type}_${get_theme_id(theme_type)} ` + 
                                                                                                                                                                        document.getElementById('setting_select_report_arabic_script').value;
                                                                                                }}, false);
    document.getElementById('setting_icon_text_header_aleft').addEventListener('click', (event) => { update_ui(15, event.target.id ==''?event.target.parentElement.id:event.target.id) }, false);
    document.getElementById('setting_icon_text_header_acenter').addEventListener('click', (event) => { update_ui(15, event.target.id==''?event.target.parentElement.id:event.target.id) }, false);
    document.getElementById('setting_icon_text_header_aright').addEventListener('click', (event) => { update_ui(15, event.target.id==''?event.target.parentElement.id:event.target.id) }, false);
    document.getElementById('setting_icon_text_footer_aleft').addEventListener('click', (event) => { update_ui(16, event.target.id==''?event.target.parentElement.id:event.target.id) }, false);
    document.getElementById('setting_icon_text_footer_acenter').addEventListener('click', (event) => { update_ui(16, event.target.id==''?event.target.parentElement.id:event.target.id) }, false);
    document.getElementById('setting_icon_text_footer_aright').addEventListener('click', (event) => { update_ui(16, event.target.id==''?event.target.parentElement.id:event.target.id) }, false);
    //settings prayer                 
    document.getElementById('setting_select_method').addEventListener('change', () => { update_ui(17);}, false);
    //settings user
    document.getElementById('setting_select_user_setting').addEventListener('change', () => {user_settings_load().then(() => {settings_translate(true).then(() => {settings_translate(false);})}) }, false);

    document.getElementById('user_settings').addEventListener('click', (event) => { 
        let event_target_id;
        if  (event.target.classList.contains('common_dialogue_button')){
            //button
            event_target_id = event.target.id;
        }
        else
            if  (event.target.parentNode.classList.contains('common_dialogue_button')){
                //svg or icon
                event_target_id = event.target.parentNode.id;
            }
            else{
                if (event.target.parentNode.parentNode.classList.contains('common_dialogue_button')){
                    //path in svg
                    event_target_id = event.target.parentNode.parentNode.id;
                }
            }
        if (event_target_id)
            switch (event_target_id){
                case 'setting_btn_user_save':{
                    user_settings_function('SAVE', false, (err, result)=>{null;});
                    break;
                }
                case 'setting_btn_user_add':{
                    user_settings_function('ADD', false, (err, result)=>{null;});
                    break;
                }
                case 'setting_btn_user_delete':{
                    user_settings_delete();
                    break;
                }
                default:{
                    //'user_day_html', 'user_day_html_copy', 'user_day_pdf', 'user_day_pdf_copy'
                    //'user_month_html', 'user_month_html_copy', 'user_month_pdf', 'user_month_pdf_copy'
                    //'user_year_html', 'user_year_html_copy', 'user_year_pdf', 'user_year_pdf_copy'
                    user_setting_link(document.getElementById(event_target_id))
                    break;
                }
            }
        
    }, false);
    
    //profile
    document.getElementById('profile_main_btn_user_settings').addEventListener('click', () => { profile_detail_app(0, '/user_account_app_setting/profile/detail', false) }, false);
    document.getElementById('profile_main_btn_user_setting_likes').addEventListener('click', () => { profile_detail_app(6, '/user_account_app_setting/profile/detail', true, 
        `<div class='common_like_unlike'> ${common.ICONS['user_like']}</div>
         <div > ${common.ICONS['regional_day'] +
                  common.ICONS['regional_month'] +
                  common.ICONS['regional_year'] +
                  common.ICONS['user_follows']}</div>`, show_profile_function) }, false);
    document.getElementById('profile_main_btn_user_setting_liked').addEventListener('click', () => { profile_detail_app(7, '/user_account_app_setting/profile/detail', true, 
        `<div class='common_like_unlike'> ${common.ICONS['user_like']}</div>
         <div > ${common.ICONS['regional_day'] +
                  common.ICONS['regional_month'] +
                  common.ICONS['regional_year'] +
                  common.ICONS['user_followed']}</div>`, show_profile_function) }, false);
    document.getElementById('profile_top_row2_1').addEventListener('click', () => { common.profile_top(4, '/user_account_app_setting/profile/top', show_profile_function) }, false);
    document.getElementById('profile_top_row2_2').addEventListener('click', () => { common.profile_top(5, '/user_account_app_setting/profile/top', show_profile_function) }, false);
    document.getElementById('profile_user_settings_day').addEventListener('click', (event) => { profile_user_setting_link(event.target.id ==''?event.target.parentElement:event.target) }, false);
    document.getElementById('profile_user_settings_month').addEventListener('click', (event) => { profile_user_setting_link(event.target.id ==''?event.target.parentElement:event.target) }, false);
    document.getElementById('profile_user_settings_year').addEventListener('click', (event) => { profile_user_setting_link(event.target.id ==''?event.target.parentElement:event.target) }, false);
    document.getElementById('profile_user_settings_like').addEventListener('click', (event) => { profile_user_setting_link(event.target.id ==''?event.target.parentElement:event.target) }, false);
    document.getElementById('common_profile_search_input').addEventListener('keyup', (event) => { common.search_input(event, show_profile_function);}, false);
    document.getElementById('profile_select_user_settings').addEventListener('change', 
        (event) => { profile_show_user_setting_detail(event.target.options[event.target.selectedIndex].getAttribute('liked'), 
                                                      event.target.options[event.target.selectedIndex].getAttribute('count_likes'), 
                                                      event.target.options[event.target.selectedIndex].getAttribute('count_views')) }, false);
    //dialogue info
    document.getElementById('info_link1').addEventListener('click', () => { common.show_window_info(1, app_common.APP_GLOBAL['info_link_policy_url']);}, false);
    document.getElementById('info_link2').addEventListener('click', () => { common.show_window_info(1, app_common.APP_GLOBAL['info_link_disclaimer_url']);}, false);
    document.getElementById('info_link3').addEventListener('click', () => { common.show_window_info(1, app_common.APP_GLOBAL['info_link_terms_url']);}, false);
    document.getElementById('info_link4').addEventListener('click', () => { common.show_window_info(1, app_common.APP_GLOBAL['info_link_about_url']);}, false);
    document.getElementById('info_close').addEventListener('click', () => { document.getElementById('dialogue_info').style.visibility = 'hidden'}, false);
    
    //dialogue scan mobile
    document.getElementById('scan_open_mobile_close').addEventListener('click', () => { document.getElementById('dialogue_scan_open_mobile').style.visibility = 'hidden' }, false);
    //toolbar bottom
    document.getElementById('toolbar_bottom').addEventListener('click', (event) => {
        let event_target_id;
        if  (event.target.classList.contains('common_toolbar_button')){
            //button
            event_target_id = event.target.id;
        }
        else
            if  (event.target.parentNode.classList.contains('common_toolbar_button')){
                //svg or icon
                event_target_id = event.target.parentNode.id;
            }
            else{
                //path in svg
                event_target_id = event.target.parentNode.parentNode.id;
            }
        switch (event_target_id){
            case 'toolbar_btn_about':{
                document.getElementById('dialogue_info').style.visibility = 'visible';
                break;
            }
            case 'toolbar_btn_print':{
                toolbar_button(1);
                break;
            }
            case 'toolbar_btn_day':{
                toolbar_button(2);
                break;
            }
            case 'toolbar_btn_month':{
                toolbar_button(3);
                break;
            }
            case 'toolbar_btn_year':{
                toolbar_button(4);
                break;
            }
            case 'toolbar_btn_settings':{
                toolbar_button(5);
                break;
            }
        }
    }, false);
    //common

    //user menu dropdown
    document.getElementById('common_user_menu_dropdown_log_out').addEventListener('click', () => { user_logoff_app() }, false);
    document.getElementById('common_user_menu_username').addEventListener('click', () => { toolbar_button(6) }, false);
    
    //user preferences    
    document.getElementById('common_app_select_theme').addEventListener('change', () => { document.body.className = 'app_theme' + 
                                                                                                                         document.getElementById('common_app_select_theme').value + ' ' + 
                                                                                                                         document.getElementById('common_user_arabic_script_select').value;}, false);
    document.getElementById('common_user_locale_select').addEventListener('change', (event) => { common_translate_ui_app(event.target.value, (err, result)=>{null});}, false);    
    document.getElementById('common_user_timezone_select').addEventListener('change', (event) => { document.getElementById('setting_timezone_current').innerHTML = event.target.value;}, false);
    document.getElementById('common_user_arabic_script_select').addEventListener('change', () => { document.getElementById('common_app_select_theme').dispatchEvent(new Event('change'));}, false);
    
    //profile button top
    document.getElementById('common_profile_btn_top').addEventListener('click', () => { toolbar_button(7) }, false);

    //dialogue login/signup/forgot
    let input_username_login = document.getElementById("common_login_username");
    input_username_login.addEventListener("keyup", (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            user_login_app().then(() => {
                //unfocus
                document.getElementById("common_login_username").blur();
            });
        }
    });
    let input_password_login = document.getElementById("common_login_password");
    input_password_login.addEventListener("keyup", (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            user_login_app().then(() => {
                //unfocus
                document.getElementById("common_login_password").blur();
            });
        }
    });
    document.getElementById('common_login_button').addEventListener('click', () => { user_login_app() }, false);
    document.getElementById('common_signup_button').addEventListener('click', () => { common.user_signup() }, false);
    
    
    //dialogue profile
    document.getElementById('common_profile_main_btn_following').addEventListener('click', () => { profile_detail_app(1, null, true, null, show_profile_function) }, false);
    document.getElementById('common_profile_main_btn_followed').addEventListener('click', () => { profile_detail_app(2, null, true, null, show_profile_function) }, false);
    document.getElementById('common_profile_main_btn_likes').addEventListener('click', () => { profile_detail_app(3, null, true, null, show_profile_function) }, false);
    document.getElementById('common_profile_main_btn_liked').addEventListener('click', () => { profile_detail_app(4, null, true, null, show_profile_function) }, false);
    document.getElementById('common_profile_follow').addEventListener('click', () => { user_function_app('FOLLOW') }, false);
    document.getElementById('common_profile_like').addEventListener('click', () => { user_function_app('LIKE') }, false);
    document.getElementById('common_profile_top_row1_1').addEventListener('click', () => { common.profile_top(1, null, show_profile_function) }, false);
    document.getElementById('common_profile_top_row1_2').addEventListener('click', () => { common.profile_top(2, null, show_profile_function) }, false);
    document.getElementById('common_profile_top_row1_3').addEventListener('click', () => { common.profile_top(3, null, show_profile_function) }, false);
    document.getElementById('common_profile_home').addEventListener('click', () => {toolbar_button(7)}, false);
    document.getElementById('common_profile_close').addEventListener('click', () => {profile_close_app()}, false);
    //dialogue verify
    document.getElementById('common_user_verify_verification_container').addEventListener('keyup', (event) => {
        switch (event.target.id){
            case 'common_user_verify_verification_char1':{
                user_verify_check_input_app(event.target, "common_user_verify_verification_char2")
                break;
            }
            case 'common_user_verify_verification_char2':{
                user_verify_check_input_app(event.target, "common_user_verify_verification_char3")
                break;
            }
            case 'common_user_verify_verification_char3':{
                user_verify_check_input_app(event.target, "common_user_verify_verification_char4")
                break;
            }
            case 'common_user_verify_verification_char4':{
                user_verify_check_input_app(event.target, "common_user_verify_verification_char5")
                break;
            }
            case 'common_user_verify_verification_char5':{
                user_verify_check_input_app(event.target, "common_user_verify_verification_char6")
                break;
            }
            case 'common_user_verify_verification_char6':{
                user_verify_check_input_app(event.target, "")
                break;
            }
        }
    }, false);
};
/*----------------------- */
/* SERVICE WORKER         */
/*----------------------- */
const serviceworker = () => {
    if (!window.Promise) {
        window.Promise = Promise;
    }
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'});
    }
}
/*----------------------- */
/* MODULE LEAFLET         */
/*----------------------- */
const init_map = async () => {
    return await new Promise((resolve) => {
        common.map_init(app_common.APP_GLOBAL['gps_module_leaflet_container'],
        common.COMMON_GLOBAL['module_leaflet_style'], 
        document.getElementById('setting_input_long').value, 
        document.getElementById('setting_input_lat').value, 
        app_common.APP_GLOBAL['gps_module_leaflet_marker_div_gps'],
        app_common.APP_GLOBAL['gps_module_leaflet_zoom']).then(() => {
            common.map_setevent('dblclick', (e) => {
                document.getElementById('setting_input_lat').value = e.latlng['lat'];
                document.getElementById('setting_input_long').value = e.latlng['lng'];
                //Update GPS position
                update_ui(9);
            })
            resolve();
        })
    })
}

const map_show_qibbla = () => {
    common.map_line_removeall();
    common.map_line_create('qibbla', 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_title'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_text_size'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_long'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_lat'], 
                    document.getElementById('setting_input_long').value, 
                    document.getElementById('setting_input_lat').value, 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_color'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_width'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_opacity']);
    common.map_line_create('qibbla_old', 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_title'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_text_size'],
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_long'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_lat'],
                    document.getElementById('setting_input_long').value, 
                    document.getElementById('setting_input_lat').value, 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_color'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_width'], 
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_opacity']);
    return null;
}

const map_update_app = async (longitude, latitude, zoom, text1, text2, marker_id, to_method) => {
    return new Promise((resolve) => {
        map_show_qibbla();
        common.map_update(longitude, latitude, zoom, text1, text2, marker_id, to_method).then((timezonetext)=> {
            resolve(timezonetext);
        });
    })
}
/*----------------------- */
/* EXCEPTION              */
/*----------------------- */
const app_exception = (error) => {
    user_logoff_app();
}
/*----------------------- */
/* INIT                   */
/*----------------------- */
const init_app = () => {
    return new Promise((resolve) => {
        dialogue_loading(1);
        //set app globals
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
            app_common.APP_GLOBAL['timetable_type'] = '';
    
        //set initial default language from clients settings
        common.SearchAndSetSelectedIndex(navigator.language.toLowerCase(), document.getElementById('setting_select_locale'),1);
        //dialogues
        document.getElementById('info_close').innerHTML = common.ICONS['app_close'];
        document.getElementById('scan_open_mobile_close').innerHTML = common.ICONS['app_close'];
        document.getElementById('scan_open_mobile_title1').innerHTML = common.ICONS['app_mobile'];
        //profile info
        document.getElementById('profile_main_btn_user_settings').innerHTML = common.ICONS['regional_day']  + common.ICONS['regional_month'] + common.ICONS['regional_year'];
        document.getElementById('profile_main_btn_user_setting_likes_heart').innerHTML = common.ICONS['user_like'];
        document.getElementById('profile_main_btn_user_setting_likes_user_setting').innerHTML = common.ICONS['regional_day'] + common.ICONS['regional_month'] + common.ICONS['regional_year'] + common.ICONS['user_follows'];
        document.getElementById('profile_main_btn_user_setting_liked_heart').innerHTML = common.ICONS['user_like'];
        document.getElementById('profile_main_btn_user_setting_liked_user_setting').innerHTML = common.ICONS['regional_day'] + common.ICONS['regional_month'] + common.ICONS['regional_year'] + common.ICONS['user_followed'];
    
        document.getElementById('profile_user_settings_day').innerHTML = common.ICONS['regional_day'];
        document.getElementById('profile_user_settings_month').innerHTML = common.ICONS['regional_month'];
        document.getElementById('profile_user_settings_year').innerHTML = common.ICONS['regional_year'];
        document.getElementById('profile_user_settings_like').innerHTML = common.ICONS['user_unlike'] + common.ICONS['user_like'];
    
        document.getElementById('profile_user_settings_info_likes').innerHTML = common.ICONS['user_like'] + '<div id="profile_user_settings_info_like_count"></div>';
        document.getElementById('profile_user_settings_info_views').innerHTML = common.ICONS['user_views'] + '<div id="profile_user_settings_info_view_count"></div>';
        //profile top
        document.getElementById('profile_top_row2_1').innerHTML = common.ICONS['user_like'] + common.ICONS['regional_day']  + common.ICONS['regional_month'] + common.ICONS['regional_year'];
        document.getElementById('profile_top_row2_2').innerHTML = common.ICONS['user_views'] + common.ICONS['regional_day']  + common.ICONS['regional_month'] + common.ICONS['regional_year'];
        //tab navigation
        document.getElementById('tab_nav_btn_1').innerHTML = common.ICONS['regional'];
        document.getElementById('tab_nav_btn_2').innerHTML = common.ICONS['gps'];
        document.getElementById('tab_nav_btn_3').innerHTML = common.ICONS['misc_design'];
        document.getElementById('tab_nav_btn_4').innerHTML = common.ICONS['misc_image'];
        document.getElementById('tab_nav_btn_5').innerHTML = common.ICONS['misc_text'];
        document.getElementById('tab_nav_btn_6').innerHTML = common.ICONS['misc_prayer'];
        //settings tab 1 Regional
        document.getElementById('setting_icon_regional_locale').innerHTML = common.ICONS['regional_locale'];
        document.getElementById('setting_icon_regional_timezone_current').innerHTML = common.ICONS['regional_timezone'] + common.ICONS['gps_position'];
        document.getElementById('setting_icon_regional_timezone').innerHTML = common.ICONS['regional_timezone'] + common.ICONS['regional_calendar'];
        document.getElementById('setting_icon_regional_numbersystem').innerHTML = common.ICONS['regional_numbersystem'];
        document.getElementById('setting_icon_regional_direction').innerHTML = common.ICONS['regional_direction'];
        document.getElementById('setting_icon_regional_locale_second').innerHTML = common.ICONS['regional_locale'] + common.ICONS['misc_second'];
        document.getElementById('setting_icon_regional_coltitle').innerHTML = common.ICONS['misc_title'];
        document.getElementById('setting_icon_regional_arabic_script').innerHTML = common.ICONS['regional_script'];
        document.getElementById('setting_icon_regional_calendartype').innerHTML = common.ICONS['regional_calendar'];
        document.getElementById('setting_icon_regional_calendar_hijri_type').innerHTML = common.ICONS['regional_calendar_hijri_type'];
        //settings tab 2 GPS
        document.getElementById('setting_icon_gps_maptype').innerHTML = common.ICONS['gps_map'];
        document.getElementById('setting_icon_gps_country').innerHTML = common.ICONS['gps_country'];
        document.getElementById('setting_icon_gps_city').innerHTML = common.ICONS['gps_city'];
        document.getElementById('setting_icon_gps_popular_place').innerHTML = common.ICONS['gps_popular_place'];
        document.getElementById('setting_icon_gps_place').innerHTML = common.ICONS['gps_position'];
        //settings tab 3 Design
        document.getElementById('setting_icon_design_theme_day').innerHTML = common.ICONS['regional_day'];
        document.getElementById('setting_icon_design_theme_month').innerHTML = common.ICONS['regional_month'];
        document.getElementById('setting_icon_design_theme_year').innerHTML = common.ICONS['regional_year'];
        document.getElementById('setting_icon_design_papersize').innerHTML = common.ICONS['app_papersize'];
        document.getElementById('setting_icon_design_highlight_row').innerHTML = common.ICONS['app_highlight'];
        document.getElementById('setting_icon_design_show_weekday').innerHTML = common.ICONS['app_show'] + common.ICONS['regional_weekday'];
        document.getElementById('setting_icon_design_show_calendartype').innerHTML = common.ICONS['app_show'] + common.ICONS['regional_calendartype'];
        document.getElementById('setting_icon_design_show_notes').innerHTML = common.ICONS['app_show'] + common.ICONS['app_notes'];
        document.getElementById('setting_icon_design_show_gps').innerHTML = common.ICONS['app_show'] + common.ICONS['gps_position'];
        document.getElementById('setting_icon_design_show_timezone').innerHTML = common.ICONS['app_show'] + common.ICONS['regional_timezone'];
        //settings tab 4 Image
        document.getElementById('setting_icon_image_header_clear').innerHTML = common.ICONS['app_remove'];
        document.getElementById('setting_icon_image_footer_clear').innerHTML = common.ICONS['app_remove'];
        document.getElementById('setting_icon_image_header_img').innerHTML = common.ICONS['app_search'];
        document.getElementById('setting_icon_image_footer_img').innerHTML = common.ICONS['app_search'];    
        //settings tab 5 Text
        document.getElementById('setting_icon_text_theme_day').innerHTML = common.ICONS['regional_day'];
        document.getElementById('setting_icon_text_theme_month').innerHTML = common.ICONS['regional_month'];
        document.getElementById('setting_icon_text_theme_year').innerHTML = common.ICONS['regional_year'];
        document.getElementById('setting_icon_text_header_aleft').innerHTML =  common.ICONS['app_align_left'];
        document.getElementById('setting_icon_text_header_acenter').innerHTML = common.ICONS['app_align_center'];
        document.getElementById('setting_icon_text_header_aright').innerHTML = common.ICONS['app_align_right'];
        document.getElementById('setting_icon_text_footer_aleft').innerHTML = common.ICONS['app_align_left'];
        document.getElementById('setting_icon_text_footer_acenter').innerHTML = common.ICONS['app_align_center'];
        document.getElementById('setting_icon_text_footer_aright').innerHTML = common.ICONS['app_align_right'];
        //settings tab 6 Prayer
        document.getElementById('setting_icon_prayer_method').innerHTML = common.ICONS['misc_book'];
        document.getElementById('setting_icon_prayer_asr').innerHTML = common.ICONS['misc_book'] + common.ICONS['sky_afternoon'];
        document.getElementById('setting_icon_prayer_highlatitude').innerHTML = common.ICONS['gps_high_latitude'];
        document.getElementById('setting_icon_prayer_timeformat').innerHTML = common.ICONS['regional_timeformat'];
        document.getElementById('setting_icon_prayer_hijri_adjustment').innerHTML = common.ICONS['app_settings'] + common.ICONS['regional_calendar'];
        document.getElementById('setting_icon_prayer_report_iqamat_title_fajr').innerHTML = common.ICONS['app_show'] + 
                                                                                            common.ICONS['misc_calling'] + 
                                                                                            common.ICONS['misc_prayer'] + 
                                                                                            common.ICONS['sky_sunrise'];
        document.getElementById('setting_icon_prayer_report_iqamat_title_dhuhr').innerHTML = common.ICONS['app_show'] + 
                                                                                             common.ICONS['misc_calling'] + 
                                                                                             common.ICONS['misc_prayer'] +
                                                                                             common.ICONS['sky_midday'];
        document.getElementById('setting_icon_prayer_report_iqamat_title_asr').innerHTML = common.ICONS['app_show'] + 
                                                                                           common.ICONS['misc_calling'] + 
                                                                                           common.ICONS['misc_prayer'] + 
                                                                                           common.ICONS['sky_afternoon'];
        document.getElementById('setting_icon_prayer_report_iqamat_title_maghrib').innerHTML = common.ICONS['app_show'] + 
                                                                                               common.ICONS['misc_calling'] + 
                                                                                               common.ICONS['misc_prayer'] + 
                                                                                               common.ICONS['sky_sunset'];
        document.getElementById('setting_icon_prayer_report_iqamat_title_isha').innerHTML = common.ICONS['app_show'] + 
                                                                                            common.ICONS['misc_calling'] + 
                                                                                            common.ICONS['misc_prayer'] + 
                                                                                            common.ICONS['sky_night'];
        document.getElementById('setting_icon_prayer_report_show_imsak').innerHTML = common.ICONS['app_show'] + 
                                                                                     common.ICONS['sky_sunrise'] + 
                                                                                     common.ICONS['misc_food'];
        document.getElementById('setting_icon_prayer_report_show_sunset').innerHTML = common.ICONS['app_show'] + 
                                                                                      common.ICONS['sky_sunset'];
        document.getElementById('setting_icon_prayer_report_show_midnight').innerHTML = common.ICONS['app_show'] +
                                                                                        common.ICONS['sky_midnight'] +
                                                                                        common.ICONS['misc_prayer'];
        document.getElementById('setting_icon_prayer_report_show_fast_start_end').innerHTML = common.ICONS['app_show'] + 
                                                                                              common.ICONS['misc_food'] +
                                                                                              common.ICONS['misc_ban'];
        //settings tab 7 User settings
        document.getElementById('setting_icon_user_settings').innerHTML = common.ICONS['app_settings'] + 
                                                                          common.ICONS['gps_position'];
        document.getElementById('setting_icon_user_url_day').innerHTML = common.ICONS['regional_day'];
        document.getElementById('setting_icon_user_url_month').innerHTML = common.ICONS['regional_month'];
        document.getElementById('setting_icon_user_url_year').innerHTML = common.ICONS['regional_year'];
    
        document.getElementById('user_day_html').innerHTML = common.ICONS['app_html'];
        document.getElementById('user_day_html_copy').innerHTML = common.ICONS['app_copy'];
        document.getElementById('user_day_pdf').innerHTML = common.ICONS['app_pdf'];
        document.getElementById('user_day_pdf_copy').innerHTML = common.ICONS['app_copy'];
        document.getElementById('user_month_html').innerHTML = common.ICONS['app_html'];
        document.getElementById('user_month_html_copy').innerHTML = common.ICONS['app_copy'];
        document.getElementById('user_month_pdf').innerHTML = common.ICONS['app_pdf'];
        document.getElementById('user_month_pdf_copy').innerHTML = common.ICONS['app_copy'];
        document.getElementById('user_year_html').innerHTML = common.ICONS['app_html'];
        document.getElementById('user_year_html_copy').innerHTML = common.ICONS['app_copy'];
        document.getElementById('user_year_pdf').innerHTML = common.ICONS['app_pdf'];
        document.getElementById('user_year_pdf_copy').innerHTML = common.ICONS['app_copy'];
    
        document.getElementById('setting_btn_user_save').innerHTML = common.ICONS['app_save'];
        document.getElementById('setting_btn_user_add').innerHTML = common.ICONS['app_add'];
        document.getElementById('setting_btn_user_delete').innerHTML = common.ICONS['app_delete'];
        
        //toolbar bottom
        document.getElementById('toolbar_btn_about').innerHTML = common.ICONS['app_info'];
        document.getElementById('toolbar_btn_print').innerHTML = common.ICONS['app_print'];
        document.getElementById('toolbar_btn_day').innerHTML = common.ICONS['regional_day'];
        document.getElementById('toolbar_btn_month').innerHTML = common.ICONS['regional_month'];
        document.getElementById('toolbar_btn_year').innerHTML = common.ICONS['regional_year'];
        document.getElementById('toolbar_btn_settings').innerHTML = common.ICONS['app_settings'];
        //toolbar top
        document.getElementById('common_user_menu_default_avatar').innerHTML = common.ICONS['user_avatar'];
        document.getElementById('toolbar_btn_zoomout').innerHTML = common.ICONS['app_zoomout'];
        document.getElementById('toolbar_btn_zoomin').innerHTML = common.ICONS['app_zoomin'];
        document.getElementById('toolbar_btn_left').innerHTML = common.ICONS['app_left'];
        document.getElementById('toolbar_btn_right').innerHTML = common.ICONS['app_right'];
        document.getElementById('toolbar_btn_search').innerHTML = common.ICONS['app_search'];
        //user menu dropdown
        document.getElementById('common_user_menu_dropdown_log_in').innerHTML = common.ICONS['app_login'];
        document.getElementById('common_user_menu_dropdown_log_out').innerHTML =common.ICONS['app_logoff'];
        document.getElementById('common_user_menu_dropdown_signup').innerHTML = common.ICONS['app_signup'];
        document.getElementById('common_user_menu_dropdown_edit').innerHTML = common.ICONS['app_edit'];
        
        //themes from client server generation
        document.getElementById('slider_prev_day').innerHTML = common.ICONS['app_slider_left'];
        document.getElementById('slider_next_day').innerHTML =  common.ICONS['app_slider_right'];
        document.getElementById('slider_prev_month').innerHTML = common.ICONS['app_slider_left'];
        document.getElementById('slider_next_month').innerHTML = common.ICONS['app_slider_right'];
        document.getElementById('slider_prev_year').innerHTML = common.ICONS['app_slider_left'];
        document.getElementById('slider_next_year').innerHTML = common.ICONS['app_slider_right'];
        
        document.getElementById('app_name').innerHTML = common.COMMON_GLOBAL['app_name'];
        //set about info
        document.getElementById('app_copyright').innerHTML = app_common.APP_GLOBAL['app_copyright'];
        if (app_common.APP_GLOBAL['info_social_link1_url']!=null)
            document.getElementById('social_link1').innerHTML = `<a href=${app_common.APP_GLOBAL['info_social_link1_url']} target='_blank'>${app_common.APP_GLOBAL['info_social_link1_icon']}</a>`;
        if (app_common.APP_GLOBAL['info_social_link2_url']!=null)
            document.getElementById('social_link2').innerHTML = `<a href=${app_common.APP_GLOBAL['info_social_link2_url']} target='_blank'>${app_common.APP_GLOBAL['info_social_link2_icon']}</a>`;
        if (app_common.APP_GLOBAL['info_social_link3_url']!=null)
            document.getElementById('social_link3').innerHTML = `<a href=${app_common.APP_GLOBAL['info_social_link3_url']} target='_blank'>${app_common.APP_GLOBAL['info_social_link3_icon']}</a>`;
        if (app_common.APP_GLOBAL['info_social_link4_url']!=null)
            document.getElementById('social_link4').innerHTML = `<a href=${app_common.APP_GLOBAL['info_social_link4_url']} target='_blank'>${app_common.APP_GLOBAL['info_social_link4_icon']}</a>`;
        document.getElementById('info_link1').innerHTML = app_common.APP_GLOBAL['info_link_policy_name'];
        document.getElementById('info_link2').innerHTML = app_common.APP_GLOBAL['info_link_disclaimer_name'];
        document.getElementById('info_link3').innerHTML = app_common.APP_GLOBAL['info_link_terms_name'];
        document.getElementById('info_link4').innerHTML = app_common.APP_GLOBAL['info_link_about_name'];
    
        //set default geolocation
        document.getElementById('setting_select_popular_place').selectedIndex = 0;
        document.getElementById('setting_input_lat').value = common.COMMON_GLOBAL['client_latitude'];
        document.getElementById('setting_input_long').value = common.COMMON_GLOBAL['client_longitude'];
        //load themes in Design tab
        load_themes();
        //set papersize
        zoom_paper();
        //set events
        setEvents();
        //user interface font depending selected arabic script in user preference, not in settings
        //dispatch event in common after events har defined above
        document.getElementById('common_user_arabic_script_select').dispatchEvent(new Event('change'));
        //set timers
        //set current date and time for current locale and timezone
        clearInterval(showcurrenttime);
        setInterval(showcurrenttime, 1000);
        //set report date and time for current locale, report timezone
        clearInterval(showreporttime);
        setInterval(showreporttime, 1000);
        //show dialogue about using mobile and scan QR code after 5 seconds
        setTimeout(() => {show_dialogue('SCAN')}, 5000);
        //init map thirdparty module
        init_map().then(() => {
            //Start of app:
            //1.set_prayer_method
            //2.set default settings
            //3.translate ui
            //4.display default timetable settings
            //5.show profile if user in url
            //6.user provider login
            //7.service worker
            app2_report.set_prayer_method(true).then(() => {
                set_default_settings().then(() => {
                    settings_translate(true).then(() => {
                        settings_translate(false).then(() => {
                            const show_start = async () => {
                                //show default startup
                                toolbar_button(app_common.APP_GLOBAL['app_default_startup_page']);
                                let user = window.location.pathname.substring(1);
                                if (user !='') {
                                    //show profile for user entered in url
                                    document.getElementById('common_dialogue_profile').style.visibility = "visible";
                                    profile_show_app(null, user);
                                }
                            }
                            show_start().then(() => {
                                dialogue_loading(0);
                                common.Providers_init((event) => { ProviderSignIn_app(event.target.id==''?event.target.parentElement:event.target); }).then(() => {
                                    serviceworker();
                                    if (common.COMMON_GLOBAL['user_locale'] != navigator.language.toLowerCase())
                                        common_translate_ui_app(common.COMMON_GLOBAL['user_locale'], (err, result)=>{
                                            resolve();
                                        });
                                    else
                                        resolve();
                                });
                            })
                        });
                    });
                });
            })
        });
    })    
}
const init = (parameters) => {
    common.init_common(parameters, (err, global_app_parameters)=>{
        if (err)
            null;
        else{
            for (let i = 0; i < global_app_parameters.length; i++) {
                if (global_app_parameters[i].parameter_name=='APP_COPYRIGHT')
                    app_common.APP_GLOBAL['app_copyright'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='APP_DEFAULT_STARTUP_PAGE')
                    app_common.APP_GLOBAL['app_default_startup_page'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='APP_REPORT_TIMETABLE')
                    app_common.APP_GLOBAL['app_report_timetable'] = global_app_parameters[i].parameter_value; 
                if (global_app_parameters[i].parameter_name=='INFO_EMAIL_POLICY')
                    app_common.APP_GLOBAL['info_email_policy'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_EMAIL_DISCLAIMER')
                    app_common.APP_GLOBAL['info_email_disclaimer'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_EMAIL_TERMS')
                    app_common.APP_GLOBAL['info_email_terms'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK1_URL')
                    app_common.APP_GLOBAL['info_social_link1_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK2_URL')
                    app_common.APP_GLOBAL['info_social_link2_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK3_URL')
                    app_common.APP_GLOBAL['info_social_link3_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK4_URL')
                    app_common.APP_GLOBAL['info_social_link4_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK1_ICON')
                    app_common.APP_GLOBAL['info_social_link1_icon'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK2_ICON')
                    app_common.APP_GLOBAL['info_social_link2_icon'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK3_ICON')
                    app_common.APP_GLOBAL['info_social_link3_icon'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_SOCIAL_LINK4_ICON')
                    app_common.APP_GLOBAL['info_social_link4_icon'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_POLICY_URL')
                    app_common.APP_GLOBAL['info_link_policy_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_DISCLAIMER_URL')
                    app_common.APP_GLOBAL['info_link_disclaimer_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_TERMS_URL')
                    app_common.APP_GLOBAL['info_link_terms_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_ABOUT_URL')
                    app_common.APP_GLOBAL['info_link_about_url'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_POLICY_NAME')
                    app_common.APP_GLOBAL['info_link_policy_name'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_DISCLAIMER_NAME')
                    app_common.APP_GLOBAL['info_link_disclaimer_name'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_TERMS_NAME')
                    app_common.APP_GLOBAL['info_link_terms_name'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='INFO_LINK_ABOUT_NAME')
                    app_common.APP_GLOBAL['info_link_about_name'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_LANG')
                    app2_report.REPORT_GLOBAL['regional_def_calendar_lang'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_PREFIX')
                    app2_report.REPORT_GLOBAL['regional_def_locale_ext_prefix'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM')
                    app2_report.REPORT_GLOBAL['regional_def_locale_ext_number_system'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR')
                    app2_report.REPORT_GLOBAL['regional_def_locale_ext_calendar'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_TYPE_GREG')
                    app2_report.REPORT_GLOBAL['regional_def_calendar_type_greg'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM')
                    app2_report.REPORT_GLOBAL['regional_def_calendar_number_system'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_DIRECTION')
                    app_common.APP_GLOBAL['regional_default_direction'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_LOCALE_SECOND')
                    app_common.APP_GLOBAL['regional_default_locale_second'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_COLTITLE')
                    app_common.APP_GLOBAL['regional_default_coltitle'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_ARABIC_SCRIPT')
                    app_common.APP_GLOBAL['regional_default_arabic_script'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_CALENDARTYPE')
                    app_common.APP_GLOBAL['regional_default_calendartype'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE')
                    app_common.APP_GLOBAL['regional_default_calendar_hijri_type'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_DEFAULT_COUNTRY')
                    app_common.APP_GLOBAL['gps_default_country'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_DEFAULT_CITY')
                    app_common.APP_GLOBAL['gps_default_city'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_DEFAULT_PLACE_ID')
                    app_common.APP_GLOBAL['gps_default_place_id'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_CONTAINER')
                    app_common.APP_GLOBAL['gps_module_leaflet_container'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_ZOOM')
                    app_common.APP_GLOBAL['gps_module_leaflet_zoom'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_ZOOM_CITY')
                    app_common.APP_GLOBAL['gps_module_leaflet_zoom_city'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_ZOOM_PP')
                    app_common.APP_GLOBAL['gps_module_leaflet_zoom_pp'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_MARKER_DIV_PP')
                    app_common.APP_GLOBAL['gps_module_leaflet_marker_div_pp'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_MARKER_DIV_CITY')
                    app_common.APP_GLOBAL['gps_module_leaflet_marker_div_city'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_MARKER_DIV_GPS')
                    app_common.APP_GLOBAL['gps_module_leaflet_marker_div_gps'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_TITLE')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_title'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_TEXT_SIZE')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_text_size'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_LAT')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_lat'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_LONG')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_long'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_COLOR')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_color'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_WIDTH')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_width'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OPACITY')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_opacity'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_TITLE')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_title'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_TEXT_SIZE')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_text_size'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_LAT')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_lat'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_LONG')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_long'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_COLOR')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_color'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_WIDTH')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_width'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_OPACITY')
                    app_common.APP_GLOBAL['gps_module_leaflet_qibbla_old_opacity'] = parseFloat(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_THEME_DAY')
                    app_common.APP_GLOBAL['design_default_theme_day'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_THEME_MONTH')
                    app_common.APP_GLOBAL['design_default_theme_month'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_THEME_YEAR')
                    app_common.APP_GLOBAL['design_default_theme_year'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_PAPERSIZE')
                    app_common.APP_GLOBAL['design_default_papersize'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_HIGHLIGHT_ROW')
                    app_common.APP_GLOBAL['design_default_highlight_row'] = parseInt(global_app_parameters[i].parameter_value);
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_SHOW_WEEKDAY')
                    app_common.APP_GLOBAL['design_default_show_weekday'] = (global_app_parameters[i].parameter_value=== 'true');
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_SHOW_CALENDARTYPE')
                    app_common.APP_GLOBAL['design_default_show_calendartype'] = (global_app_parameters[i].parameter_value=== 'true');
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_SHOW_NOTES')
                    app_common.APP_GLOBAL['design_default_show_notes'] = (global_app_parameters[i].parameter_value=== 'true');
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_SHOW_GPS')
                    app_common.APP_GLOBAL['design_default_show_gps'] = (global_app_parameters[i].parameter_value=== 'true');
                if (global_app_parameters[i].parameter_name=='DESIGN_DEFAULT_SHOW_TIMEZONE')
                    app_common.APP_GLOBAL['design_default_show_timezone'] = (global_app_parameters[i].parameter_value=== 'true');
                if (global_app_parameters[i].parameter_name=='TEXT_DEFAULT_REPORTTITLE1')
                    app_common.APP_GLOBAL['text_default_reporttitle1'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='TEXT_DEFAULT_REPORTTITLE2')
                    app_common.APP_GLOBAL['text_default_reporttitle2'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='TEXT_DEFAULT_REPORTTITLE3')
                    app_common.APP_GLOBAL['text_default_reporttitle3'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='TEXT_DEFAULT_REPORTFOOTER1')
                    app_common.APP_GLOBAL['text_default_reportfooter1'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='TEXT_DEFAULT_REPORTFOOTER2')
                    app_common.APP_GLOBAL['text_default_reportfooter2'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='TEXT_DEFAULT_REPORTFOOTER3')
                    app_common.APP_GLOBAL['text_default_reportfooter3'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='IMAGE_HEADER_FOOTER_WIDTH')
                    app_common.APP_GLOBAL['image_header_footer_width'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='IMAGE_HEADER_FOOTER_HEIGHT')
                    app_common.APP_GLOBAL['image_header_footer_height'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='IMAGE_DEFAULT_REPORT_HEADER_SRC'){
                    if (global_app_parameters[i].parameter_value!='')
                        app_common.APP_GLOBAL['image_default_report_header_src'] = global_app_parameters[i].parameter_value;
                }                    
                if (global_app_parameters[i].parameter_name=='IMAGE_DEFAULT_REPORT_FOOTER_SRC'){
                    if (global_app_parameters[i].parameter_value!='')
                        app_common.APP_GLOBAL['image_default_report_footer_src'] = global_app_parameters[i].parameter_value;
                }                             
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_METHOD')
                    app_common.APP_GLOBAL['prayer_default_method'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_ASR')
                    app_common.APP_GLOBAL['prayer_default_asr'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_HIGHLATITUDE')
                    app_common.APP_GLOBAL['prayer_default_highlatitude'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_TIMEFORMAT')
                    app_common.APP_GLOBAL['prayer_default_timeformat'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_HIJRI_ADJUSTMENT')
                    app_common.APP_GLOBAL['prayer_default_hijri_adjustment'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_FAJR')
                    app_common.APP_GLOBAL['prayer_default_iqamat_title_fajr'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR')
                    app_common.APP_GLOBAL['prayer_default_iqamat_title_dhuhr'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_ASR')
                    app_common.APP_GLOBAL['prayer_default_iqamat_title_asr'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB')
                    app_common.APP_GLOBAL['prayer_default_iqamat_title_maghrib'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_ISHA')
                    app_common.APP_GLOBAL['prayer_default_iqamat_title_isha'] = global_app_parameters[i].parameter_value;
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_SHOW_IMSAK')
                    app_common.APP_GLOBAL['prayer_default_show_imsak'] = (global_app_parameters[i].parameter_value=== 'true');
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_SHOW_SUNSET')
                    app_common.APP_GLOBAL['prayer_default_show_sunset'] = (global_app_parameters[i].parameter_value=== 'true');
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_SHOW_MIDNIGHT')
                    app_common.APP_GLOBAL['prayer_default_show_midnight'] = (global_app_parameters[i].parameter_value=== 'true');
                if (global_app_parameters[i].parameter_name=='PRAYER_DEFAULT_SHOW_FAST_START_END')
                    app_common.APP_GLOBAL['prayer_default_show_fast_start_end'] = global_app_parameters[i].parameter_value;
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
            init_app();   
        }
    })
}
export{/*REPORT*/
       printTable, getReportSettings, update_timetable_report, get_report_url, updateViewStat_app,
       /*MAP*/
       init_map, map_show_qibbla, map_update_app,
       /*THEME*/
       update_all_theme_thumbnails,update_theme_thumbnail, get_theme_id, set_theme_id, set_theme_title,
       load_themes, slide,
       /*UI*/
       common_translate_ui_app, settings_translate, get_align, showcurrenttime, showreporttime,
       toolbar_button, openTab, align_button_value, dialogue_loading, zoom_paper, select_get_selectindex,
       select_get_id, set_null_or_value, show_dialogue, update_ui,
       /*USER*/
       user_login_app, user_verify_check_input_app, user_function_app, profile_close_app, profile_clear_app,
       user_logoff_app, ProviderUser_update_app, ProviderSignIn_app, profile_update_stat_app, profile_show_app,
       profile_detail_app,
       /*USER SETTINGS*/
       user_settings_get, user_setting_link, user_settings_load, user_settings_function, user_settings_delete,
       set_default_settings, set_settings_select, profile_user_setting_stat, profile_user_setting_link,
       profile_show_user_setting_detail, profile_show_user_setting, profile_user_setting_update_stat,
       user_settings_like,
       /*EVENTS*/
       setEvents,
       /*SERVICE WORKER*/
       serviceworker,
       /*EXCEPTION*/
       app_exception,
       /*INIT*/
       init_app, init}