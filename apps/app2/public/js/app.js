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
const common = await import('common');
const app_report = await import('app_report');
const APP_GLOBAL = {
    app_copyright:'',
    app_default_startup_page:'',
    app_report_timetable:'',
    info_social_link1_url:'',
    info_social_link2_url:'',
    info_social_link3_url:'',
    info_social_link4_url:'',
    info_social_link1_icon:'',
    info_social_link2_icon:'',
    info_social_link3_icon:'',
    info_social_link4_icon:'',
    info_link_policy_url:'',
    info_link_disclaimer_url:'',
    info_link_terms_url:'',
    info_link_about_url:'',
    info_link_policy_name:'',
    info_link_disclaimer_name:'',
    info_link_terms_name:'',
    info_link_about_name:'',
    info_email_policy:'',
    info_email_disclaimer:'',
    info_email_terms:'',

    regional_default_direction:'',
    regional_default_locale_second:'',
    regional_default_coltitle:'',
    regional_default_arabic_script:'',
    regional_default_calendartype:'',
    regional_default_calendar_hijri_type:'',

    gps_default_place_id:'',
    gps_module_leaflet_container:'',
    gps_module_leaflet_qibbla_title:'',
    gps_module_leaflet_qibbla_text_size:'',
    gps_module_leaflet_qibbla_lat:'',
    gps_module_leaflet_qibbla_long:'',
    gps_module_leaflet_qibbla_color:'',
    gps_module_leaflet_qibbla_width:'',
    gps_module_leaflet_qibbla_opacity:'',
    gps_module_leaflet_qibbla_old_title:'',
    gps_module_leaflet_qibbla_old_text_size:'',
    gps_module_leaflet_qibbla_old_lat:'',
    gps_module_leaflet_qibbla_old_long:'',
    gps_module_leaflet_qibbla_old_color:'',
    gps_module_leaflet_qibbla_old_width:'',
    gps_module_leaflet_qibbla_old_opacity:'',

    design_default_theme_day:'',
    design_default_theme_month:'',
    design_default_theme_year:'',
    design_default_papersize:'',
    design_default_highlight_row:'',
    design_default_show_weekday:'',
    design_default_show_calendartype:'',
    design_default_show_notes:'',
    design_default_show_gps:'',
    design_default_show_timezone:'',

    image_default_report_header_src:'',
    image_default_report_footer_src:'',
    image_header_footer_width:'',
    image_header_footer_height:'',

    text_default_reporttitle1:'',
    text_default_reporttitle2:'',
    text_default_reporttitle3:'',
    text_default_reportfooter1:'',
    text_default_reportfooter2:'',
    text_default_reportfooter3:'',

    prayer_default_method:'',
    prayer_default_asr:'',
    prayer_default_highlatitude:'',
    prayer_default_timeformat:'',
    prayer_default_hijri_adjustment:'',
    prayer_default_iqamat_title_fajr:'',
    prayer_default_iqamat_title_dhuhr:'',
    prayer_default_iqamat_title_asr:'',
    prayer_default_iqamat_title_maghrib:'',
    prayer_default_iqamat_title_isha:'',
    prayer_default_show_imsak:'',
    prayer_default_show_sunset:'',
    prayer_default_show_midnight:'',
    prayer_default_show_fast_start_end:'',

    //session variables
    timetable_type:''
};
Object.seal(APP_GLOBAL);
/*----------------------- */
/* REPORT                 */
/*----------------------- */

const printTable = () => {
    dialogue_loading(1);
    const whatToPrint = document.querySelector('#paper');
	const html = `<!DOCTYPE html>
			<html>
			<head>
				<meta charset='UTF-8'>
				<title></title>
                <link rel='stylesheet' type='text/css' href='/app${common.COMMON_GLOBAL.app_id}/css/app_report.css' />
                <link rel='stylesheet' type='text/css' href='/common/css/common.css' />
			</head>
			<body id="printbody">
				${whatToPrint.outerHTML}
			</body>
			</html>`;
	
    
    document.querySelector('#common_window_info_content').contentWindow.document.open();
    document.querySelector('#common_window_info_content').contentWindow.document.write(html);
    document.querySelector('#common_window_info_content').classList = document.querySelector('#paper').classList;
    window.frames.common_window_info_content.focus();
    setTimeout(() => {document.querySelector('#common_window_info_content').contentWindow.print();dialogue_loading(0);}, 500);
    if (common.mobile())
        null;
    else
        document.querySelector('#common_window_info_content').contentWindow.onafterprint = () => {
            document.querySelector('#common_window_info_content').src='';
            document.querySelector('#common_window_info_content').classList ='';
        };
};

const getReportSettings = () => {
    return {    locale              	: document.querySelector('#setting_select_locale').value,  
                timezone            	: document.querySelector('#setting_select_report_timezone').value,
                number_system       	: document.querySelector('#setting_select_report_numbersystem').value,
                direction           	: document.querySelector('#setting_select_report_direction').value,
                second_locale       	: document.querySelector('#setting_select_report_locale_second').value,
                arabic_script       	: document.querySelector('#setting_select_report_arabic_script').value,
                calendartype        	: document.querySelector('#setting_select_calendartype').value,
                calendar_hijri_type 	: document.querySelector('#setting_select_calendar_hijri_type').value,

                place               	: document.querySelector('#setting_input_place').value,
                gps_lat             	: parseFloat(document.querySelector('#setting_input_lat').value),
                gps_long            	: parseFloat(document.querySelector('#setting_input_long').value),

                theme_day           	: 'theme_day_' + get_theme_id('day'),
                theme_month         	: 'theme_month_' + get_theme_id('month'),
                theme_year          	: 'theme_year_' + get_theme_id('year'),
                coltitle            	: document.querySelector('#setting_select_report_coltitle').value,
                highlight           	: document.querySelector('#setting_select_report_highlight_row').value,
                show_weekday        	: Number(document.querySelector('#setting_checkbox_report_show_weekday').checked),
                show_calendartype   	: Number(document.querySelector('#setting_checkbox_report_show_calendartype').checked),
                show_notes          	: Number(document.querySelector('#setting_checkbox_report_show_notes').checked),
                show_gps   	       		: Number(document.querySelector('#setting_checkbox_report_show_gps').checked),
                show_timezone       	: Number(document.querySelector('#setting_checkbox_report_show_timezone').checked),
                
                header_img_src      	: document.querySelector('#setting_reportheader_img').src == ''?null:document.querySelector('#setting_reportheader_img').src,
				footer_img_src      	: document.querySelector('#setting_reportfooter_img').src == ''?null:document.querySelector('#setting_reportfooter_img').src,

                header_txt1         	: document.querySelector('#setting_input_reportheader1').value,
                header_txt2         	: document.querySelector('#setting_input_reportheader2').value,
                header_txt3         	: document.querySelector('#setting_input_reportheader3').value,
                //button is active set left, center or right true/false
                header_align            : get_align(document.querySelector('#setting_icon_text_header_aleft').classList.contains('setting_button_active'), 
                                                    document.querySelector('#setting_icon_text_header_acenter').classList.contains('setting_button_active'), 
                                                    document.querySelector('#setting_icon_text_header_aright').classList.contains('setting_button_active')),
                footer_txt1         	: document.querySelector('#setting_input_reportfooter1').value,
                footer_txt2         	: document.querySelector('#setting_input_reportfooter2').value,
                footer_txt3    	   		: document.querySelector('#setting_input_reportfooter3').value,
                //button is active set left, center or right true/false
                footer_align            : get_align(document.querySelector('#setting_icon_text_footer_aleft').classList.contains('setting_button_active'),
                                                    document.querySelector('#setting_icon_text_footer_acenter').classList.contains('setting_button_active'),
                                                    document.querySelector('#setting_icon_text_footer_aright').classList.contains('setting_button_active')),
                
                method              	: document.querySelector('#setting_select_method').value,
                asr                 	: document.querySelector('#setting_select_asr').value,
                highlat             	: document.querySelector('#setting_select_highlatitude').value,
                format              	: document.querySelector('#setting_select_timeformat').value,
                hijri_adj           	: Number(document.querySelector('#setting_select_hijri_adjustment').value),
                iqamat_fajr         	: document.querySelector('#setting_select_report_iqamat_title_fajr').value,
                iqamat_dhuhr        	: document.querySelector('#setting_select_report_iqamat_title_dhuhr').value,
                iqamat_asr          	: document.querySelector('#setting_select_report_iqamat_title_asr').value,
                iqamat_maghrib      	: document.querySelector('#setting_select_report_iqamat_title_maghrib').value,
                iqamat_isha         	: document.querySelector('#setting_select_report_iqamat_title_isha').value,
                show_imsak          	: Number(document.querySelector('#setting_checkbox_report_show_imsak').checked),
                show_sunset         	: Number(document.querySelector('#setting_checkbox_report_show_sunset').checked),
                show_midnight       	: Number(document.querySelector('#setting_checkbox_report_show_midnight').checked),
                show_fast_start_end 	: Number(document.querySelector('#setting_select_report_show_fast_start_end').value),
                
                timetable_class			: 'timetable_class',
                timetable_month         : 'timetable_month_class', //class to add for month
                timetable_year_month    : 'timetable_year_month', //class to add for year
                reporttype_year_month 	: 'MONTH',  //default MONTH: normal month with more info, 
                                                    //YEAR: month with less info
                
                ui_navigation_left      : 'toolbar_btn_left',
                ui_navigation_right     : 'toolbar_btn_right'};
};
// update timetable
const update_timetable_report = async (timetable_type = 0, item_id = null, settings) => {
    return await new Promise((resolve) => {
        APP_GLOBAL.timetable_type = timetable_type;
        import('PrayTimes').then(({prayTimes}) => {
            switch (timetable_type){
                //create timetable month or day or year if they are visible instead
                case 0:{
                    //update user settings to current select option 
                    set_settings_select();
                    const select_user_settings = document.querySelector('#setting_select_user_setting');
                    const current_user_settings =[];
                    for (const setting of select_user_settings.options){
                        current_user_settings.push(
                        {
                        'description' : setting.getAttribute('description'),
                        'regional_language_locale' : setting.getAttribute('regional_language_locale'),
                        'regional_timezone' : setting.getAttribute('regional_timezone'),
                        'regional_number_system' : setting.getAttribute('regional_number_system'),
                        'regional_calendar_hijri_type' : setting.getAttribute('regional_calendar_hijri_type'),
                        'gps_lat_text' : parseFloat(setting.getAttribute('gps_lat_text')),
                        'gps_long_text' : parseFloat(setting.getAttribute('gps_long_text')),
                        'prayer_method' : setting.getAttribute('prayer_method'),
                        'prayer_asr_method' : setting.getAttribute('prayer_asr_method'),
                        'prayer_high_latitude_adjustment' : setting.getAttribute('prayer_high_latitude_adjustment'),
                        'prayer_time_format' : setting.getAttribute('prayer_time_format'),
                        'prayer_hijri_date_adjustment' : setting.getAttribute('prayer_hijri_date_adjustment')
                        });
                    }
                    document.querySelector('#paper').innerHTML = common.APP_SPINNER;
                    document.querySelector('#paper').innerHTML = app_report.displayDay(prayTimes, settings, item_id, current_user_settings);
                    common.create_qr('timetable_qr_code', common.getHostname());
                    resolve();
                    break;
                }
                //1=create timetable month
                case 1:{
                    document.querySelector('#paper').innerHTML = common.APP_SPINNER;
                    document.querySelector('#paper').innerHTML = app_report.displayMonth(prayTimes, settings, item_id);
                    common.create_qr('timetable_qr_code', common.getHostname());
                    resolve();
                    break;
                }
                //2=create timetable year
                case 2:{
                    document.querySelector('#paper').innerHTML = common.APP_SPINNER;
                    document.querySelector('#paper').innerHTML = app_report.displayYear(prayTimes, settings, item_id);
                    common.create_qr('timetable_qr_code', common.getHostname());
                    resolve();
                    break;
                }
                default:{
                    break;
                }
            }
        });
    });
};
const get_report_url = (id, sid, papersize, item, format, profile_display=true) => {
    const app_parameters = `app_id=${common.COMMON_GLOBAL.app_id}`;
    const report_module = `&module=${APP_GLOBAL.app_report_timetable}`;
    let module_parameters = `&id=${id}&sid=${sid}`;
    if (item =='profile_user_settings_day' || item.substr(0,8)=='user_day')
        module_parameters += '&type=0';
    if (item =='profile_user_settings_month' || item.substr(0,10)=='user_month')
        module_parameters += '&type=1';
    if (item == 'profile_user_settings_year' || item.substr(0,9)=='user_year')
        module_parameters += '&type=2';
    if (profile_display){
        //send viewing user account id if logged in or set empty
        const uid_view = common.COMMON_GLOBAL.user_account_id==''?'':parseInt(common.COMMON_GLOBAL.user_account_id);
        module_parameters += `&uid_view=${uid_view}`;
    }
    const language_parameter = `&lang_code=${common.COMMON_GLOBAL.user_locale}`;
    const service_parameter = `&format=${format}&ps=${papersize}&hf=0`; //html/pdf, papersize, header/footer
    const encodedurl = common.toBase64(app_parameters +
                                     report_module +
                                     module_parameters + 
                                     language_parameter +
                                     service_parameter);
    //url query parameters are decoded in report module and in report service
    return common.getHostname() + `/reports?reportid=${encodedurl}`;
};
/*----------------------- */
/* THEME                  */
/*----------------------- */
const update_all_theme_thumbnails = async () => {
    await update_timetable_report(0, null, getReportSettings()).then(() => {
        document.querySelectorAll('#slides_day .slide').forEach(e => {
            update_theme_thumbnail(e, 'day', 1);
        });
    });
    
    await update_timetable_report(1, null, getReportSettings()).then(() => {
        document.querySelectorAll('#slides_month .slide').forEach(e => {
            update_theme_thumbnail(e, 'month', 2);
        });
    });
    await update_timetable_report(2, null, getReportSettings()).then(() => {
        document.querySelectorAll('#slides_year .slide').forEach(e => {
            update_theme_thumbnail(e, 'year', 1);
        });
    });
};
const update_theme_thumbnail = (e, theme_type, classlist_pos) => {
    //copy paper div with current papersize class
    e.children[0].innerHTML = document.querySelector('#paper').outerHTML;
    //remove id from paper
    e.children[0].children[0].removeAttribute('id');
    //remove styles
    e.children[0].children[0].removeAttribute('style');
    //insert class paper first
    e.children[0].children[0].className = 'paper ' + e.children[0].children[0].className;
    const new_theme_id = e.children[0].getAttribute('data-theme_id');
    //theme class in classList according to given position
    const old_theme = e.children[0].children[0].children[0].classList[classlist_pos];
    e.children[0].children[0].children[0].classList.remove(old_theme);
    e.children[0].children[0].children[0].classList.add('theme_'  + theme_type + '_' + new_theme_id);
};

const get_theme_id = (type) => {
    const select_user_setting = document.querySelector('#setting_select_user_setting');
    if (document.querySelectorAll('.slider_active_' + type)[0])
        return document.querySelectorAll('.slider_active_' + type)[0].getAttribute('data-theme_id');
    else
        return select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_' + type + '_id');
};
const set_theme_id = (type, theme_id) => {
    const slides = document.querySelector('#setting_themes_' + type + '_slider').children[0].children[0];
    let i=0;
    for (const slide of slides.children) {
        if (slide.children[0].getAttribute('data-theme_id') == theme_id) {
            //remove active class from current theme
            document.querySelectorAll('.slider_active_' + type)[0].classList.remove('slider_active_' + type);
            //set active class on found theme
            document.querySelector('#' + slide.children[0].id).classList.add('slider_active_' + type);
            //update preview image to correct theme
            document.querySelector('#slides_' + type).style.left = (-96 * (i)).toString() + 'px';
            set_theme_title(type);
            return null;
        }
        i++;
    }
    return null;
};
const set_theme_title = (type) => {
    document.querySelector(`#slider_theme_${type}_id`).innerHTML =
        document.querySelector(`#theme_${type}_${get_theme_id(type)}`).getAttribute('data-theme_id');
    return null;
};
const load_themes = () => {
    slide(document.querySelector('#slides_day'),
        document.querySelector('#slider_prev_day'),
        document.querySelector('#slider_next_day'),
        'day');
    slide(document.querySelector('#slides_month'),
        document.querySelector('#slider_prev_month'),
        document.querySelector('#slider_next_month'),
        'month');
    slide(document.querySelector('#slides_year'),
        document.querySelector('#slider_prev_year'),
        document.querySelector('#slider_next_year'),
        'year');
    return null;
};
const slide = (items, prev, next, type) => {
    document.querySelector('#' + items.children[0].children[0].id).classList.add(`slider_active_${type}`);
    set_theme_title(type);

    // Click events
    prev.addEventListener('click', () => { theme_nav(-1); });
    next.addEventListener('click', () => { theme_nav(1); });

    const theme_nav = async (dir) => {
        let theme_index;
        //get current index
        document.querySelectorAll(`#slides_${type} .slide_${type}`).forEach((e, index) => {
            if (e.children[0].classList.contains(`slider_active_${type}`))
                theme_index = index;
        });
        //set next index
        if (dir == 1)
            if ((theme_index + 1) == items.querySelectorAll(`.slide_${type}`).length)
                theme_index = 0;
            else
                theme_index++;
        else 
            if (dir == -1)
                if (theme_index == 0)
                    theme_index = items.querySelectorAll(`.slide_${type}`).length -1;
                else
                    theme_index--;
        //remove old active theme class
        document.querySelectorAll(`.slider_active_${type}`)[0].classList.remove(`slider_active_${type}`);
        //add new active theme class
        document.querySelector('#' + items.children[theme_index].children[0].id).classList.add(`slider_active_${type}`);
        //set theme title
        set_theme_title(type);

        if (type=='month'){
            //if changing month update year
            await update_timetable_report(2, null, getReportSettings()).then(() => {
                document.querySelectorAll('#slides_year .slide').forEach(e => {
                    update_theme_thumbnail(e, 'year', 1);
                });
            });
        }

    };
};
/*----------------------- */
/* UI                     */
/*----------------------- */
const common_translate_ui_app = async (lang_code, callBack) => {
    await common.common_translate_ui(lang_code, (err) => {
        if (err)
            callBack(err,null);
        else{
            //translate locale in this app
            const select_locale = document.querySelector('#setting_select_locale');
            const select_second_locale = document.querySelector('#setting_select_report_locale_second'); 
            const current_locale = select_locale.value;
            const current_second_locale = select_second_locale.value;
            select_locale.innerHTML = document.querySelector('#common_user_locale_select').innerHTML;
            select_locale.value = current_locale;
            select_second_locale.innerHTML = select_second_locale.options[0].outerHTML + document.querySelector('#common_user_locale_select').innerHTML;
            select_second_locale.value = current_second_locale;   
            
            callBack(null,null);
        }
    });
};
const settings_translate = async (first=true) => {
    let locale;
    if (first ==true){
        locale = document.querySelector('#setting_select_locale').value;
        common.COMMON_GLOBAL.user_locale = locale;
    }
    else
        locale = document.querySelector('#setting_select_report_locale_second').value;
    if (locale != 0){
        //fetch any message with first language always
        //show translation using first or second language
        await common.FFB ('DB_API', `/app_object?data_lang_code=${locale}&object_name=REPORT`, 'GET', 'APP_DATA', null, (err, result) => {
            if (err)
                null;
            else{
                for (const app_object_item of JSON.parse(result).data){
                    if (first==true)
                        app_report.REPORT_GLOBAL.first_language[app_object_item.object_item_name.toLowerCase()] = app_object_item.text;
                    else
                        app_report.REPORT_GLOBAL.second_language[app_object_item.object_item_name.toLowerCase()] = app_object_item.text;
                }
                //if translating first language and second language is not used
                if (first == true &&
                    document.querySelector('#setting_select_report_locale_second').value ==0){
                    app_report.REPORT_GLOBAL.second_language.timetable_title= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_day= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_weekday= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_weekday_tr= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_caltype_hijri= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_caltype_gregorian= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_imsak= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_fajr= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_fajr_iqamat= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_sunrise= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_dhuhr= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_dhuhr_iqamat= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_asr= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_asr_iqamat= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_sunset= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_maghrib= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_maghrib_iqamat= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_isha= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_isha_iqamat= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_midnight= '';
                    app_report.REPORT_GLOBAL.second_language.coltitle_notes= '';
                }
            }
        });
    }
	return null;
};
const get_align = (al,ac,ar) => {
	if (al==true)
		return 'left';
	if (ac==true)
		return 'center';
	if (ar==true)
		return 'right';
	return null;
};
const showcurrenttime = () => {
    const options = {
        timeZone: common.COMMON_GLOBAL.user_timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    document.querySelector('#setting_current_date_time_display').innerHTML = new Date().toLocaleTimeString(common.COMMON_GLOBAL.user_locale, options);
    return null;
};

const showreporttime = () => {

    const options = {
        timeZone: document.querySelector('#setting_select_report_timezone')[document.querySelector('#setting_select_report_timezone').selectedIndex].value,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    document.querySelector('#setting_report_date_time_display').innerHTML = new Date().toLocaleTimeString(document.querySelector('#setting_select_locale').value, options);
    //If day report created with time, display time there also
    if (document.querySelector('#timetable_day_time')) {
        document.querySelector('#timetable_day_time').innerHTML = document.querySelector('#setting_report_date_time_display').innerHTML;
    }
    if (document.querySelectorAll('.timetable_day_current_time').length > 0) {
        const user_current_time = document.querySelectorAll('.timetable_day_current_time');
        const select_user_settings = document.querySelector('#setting_select_user_setting');
        let user_locale;
        let user_options;
        //loop user settings
        for (const setting of select_user_settings.options) {
            user_options = {
                timeZone: setting.getAttribute('regional_timezone'),
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'long'
            };

            user_locale = setting.getAttribute('regional_language_locale');
            //set user setting time, select index and order should be the same as div timetable_day_current_time indexes
            user_current_time[setting.index].innerHTML = new Date().toLocaleTimeString(user_locale, user_options);
        }
    }
    return null;
};
const toolbar_button = async (choice) => {
    const paper = document.querySelector('#paper');
    const settings = document.querySelector('#settings');

    switch (choice) {
        //print
        case 1:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                document.querySelector('#common_profile_btn_top').style.visibility='visible';
                printTable();
                break;
            }
        //day
        case 2:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                document.querySelector('#common_profile_btn_top').style.visibility='visible';
                update_timetable_report(0, null, getReportSettings());
                break;
            }
        //month
        case 3:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                document.querySelector('#common_profile_btn_top').style.visibility='visible';
                update_timetable_report(1, null, getReportSettings());
                break;
            }
        //year
        case 4:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                document.querySelector('#common_profile_btn_top').style.visibility='visible';
                update_timetable_report(2, null, getReportSettings());
                break;
            }
        //settings
        case 5:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (common.mobile())
                    paper.style.display = 'none';
                document.querySelector('#common_profile_btn_top').style.visibility='hidden';
                settings.style.visibility = 'visible';
                if (document.querySelector('#tab_nav_3').classList.contains('tab_nav_selected'))
                    update_all_theme_thumbnails();
                break;
            }
        //profile
        case 6:
            {
                settings.style.visibility = 'hidden';
                document.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden';
                profile_show_app(null,null);
                break;
            }
        //profile top
        case 7:
            {
                settings.style.visibility = 'hidden';
                document.querySelector('#common_user_menu_dropdown').style.visibility = 'hidden';
                common.profile_top(1, null, show_profile_function);
                break;
            }
    }
};


const openTab = async (tab_selected) => {
    for (let i = 1; i < 8; i++) {
        //hide all tab content
        document.querySelector('#tab' + i).style.display = 'none';
        //remove mark for all tabs
        document.querySelector('#tab_nav_' + i).className = '';
    }
    //show active tab content
    document.querySelector('#tab' + tab_selected).style.display = 'block';
    //mark active tab
    document.querySelector('#tab_nav_' + tab_selected).classList.add('tab_nav_selected');
    
    if (tab_selected==2){
        document.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).outerHTML = `<div id='${APP_GLOBAL.gps_module_leaflet_container}'></div>`;
        //init map thirdparty module
        init_map().then(()=>{
            update_ui(4);
            common.map_resize();
        });
    }
    
    if (tab_selected==3){
        update_all_theme_thumbnails();
    }
    if (tab_selected==5){
        document.querySelector('#setting_icon_text_theme_row').dispatchEvent(new Event('click'));
    }
};


const align_button_value = (report_align_where) => {

    if (document.querySelector('#setting_icon_text_' + report_align_where + '_aleft').classList.contains('setting_button_active'))
        return 'left';
    if (document.querySelector('#setting_icon_text_' + report_align_where + '_acenter').classList.contains('setting_button_active'))
        return 'center';
    if (document.querySelector('#setting_icon_text_' + report_align_where + '_aright').classList.contains('setting_button_active'))
        return 'right';
    return '';
};

const dialogue_loading = (visible) => {
    if (visible==1){
        document.querySelector('#dialogue_loading').innerHTML = common.APP_SPINNER;
        document.querySelector('#dialogue_loading').style.visibility='visible';
    }
    else{
        document.querySelector('#dialogue_loading').innerHTML = '';
        document.querySelector('#dialogue_loading').style.visibility='hidden';
    }
};

const zoom_paper = (zoomvalue = '') => {
    let old;
    let old_scale;
    const div = document.querySelector('#paper');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == '') {
        if (common.mobile())
            div.style.transform = 'scale(0.5)';
        else
            div.style.transform = 'scale(0.7)';
    } else {
        old = document.querySelector('#paper').style.transform;
        old_scale = parseFloat(old.substr(old.indexOf('(') + 1, old.indexOf(')') - 1));
        div.style.transform = 'scale(' + (old_scale + (zoomvalue / 10)) + ')';
    }
    return null;
};
const select_get_selectindex = (select, id) => {
    if (id == 0)
        return 0;
    else {
        const select_options = document.querySelector('#' + select).options;
        for (const select of select_options) {
            if (select.getAttribute('id') == id)
                return select.index;
        }
    }
    return null;
};
const select_get_id = (select, selectindex) => {
    if (selectindex == 0)
        return 'null';
    else {
        return document.querySelector('#' + select)[selectindex].getAttribute('id');
    }
};
const set_null_or_value = (value) => {
    if (value == null || value == '')
        return 'null';
    else
        return value;
};

const show_dialogue = (dialogue) => {
    switch (dialogue) {
        case 'SCAN':
            {
                if (common.mobile())
                    return null;
                else{
                    document.querySelector('#dialogue_scan_open_mobile').style.visibility = 'visible';
                    common.create_qr('scan_open_mobile_qrcode', common.getHostname());
                }
                break;
            }
    }
    return null;
};

const update_ui = async (option, item_id=null) => {
    const settings = {
        paper                   : document.querySelector('#paper'),
        timezone_report         : document.querySelector('#setting_select_report_timezone'),
        country                 : document.querySelector('#common_module_leaflet_select_country'),
        city                    : document.querySelector('#common_module_leaflet_select_city'),
        select_place            : document.querySelector('#setting_select_popular_place'),
        gps_lat_input           : document.querySelector('#setting_input_lat'),
        gps_long_input          : document.querySelector('#setting_input_long'),
        paper_size              : document.querySelector('#setting_select_report_papersize').value,
        reportheader_input      : document.querySelector('#setting_input_reportheader_img'),
        reportfooter_input      : document.querySelector('#setting_input_reportfooter_img'),
        header_preview_img_item : document.querySelector('#setting_reportheader_img'),
        footer_preview_img_item : document.querySelector('#setting_reportfooter_img'),
        button_active_class     : 'setting_button_active',
        reportheader_aleft      : document.querySelector('#setting_icon_text_header_aleft'),
        reportheader_acenter    : document.querySelector('#setting_icon_text_header_acenter'),
        reportheader_aright     : document.querySelector('#setting_icon_text_header_aright'),
        reportfooter_aleft      : document.querySelector('#setting_icon_text_footer_aleft'),
        reportfooter_acenter    : document.querySelector('#setting_icon_text_footer_acenter'),
        reportfooter_aright     : document.querySelector('#setting_icon_text_footer_aright'),
        select_user_setting     : document.querySelector('#setting_select_user_setting')
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
                map_update_app( settings.gps_long_input.value,
                                settings.gps_lat_input.value,
                                common.COMMON_GLOBAL.module_leaflet_zoom,
                                document.querySelector('#setting_input_place').value,
                                null,
                                common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                common.COMMON_GLOBAL.module_leaflet_jumpto);
                break;
            }
        //GPS, update cities from country
        case 5:
            {
                //set default option
                settings.city.innerHTML='<option value=\'\' id=\'\' label=\'…\' selected=\'selected\'>…</option>';
                //common.SearchAndSetSelectedIndex('', settings.select_place,0);
                if (settings.country[settings.country.selectedIndex].getAttribute('country_code')!=null){
                    await common.get_cities(settings.country[settings.country.selectedIndex].getAttribute('country_code').toUpperCase(), (err, cities)=>{
                        if (err)
                            null;
                        else{
                            //fetch list including default option
                            settings.city.innerHTML = cities;
                        }
                    });
                }
                break;
            }
        //GPS, city
        case 6:
            {                    
                //set GPS and timezone
                const longitude_selected = settings.city[settings.city.selectedIndex].getAttribute('longitude');
                const latitude_selected = settings.city[settings.city.selectedIndex].getAttribute('latitude');
                
                settings.gps_long_input.value = longitude_selected;
                settings.gps_lat_input.value = latitude_selected;

                //Use city + country from list
                document.querySelector('#setting_input_place').value =
                    settings.city.options[settings.city.selectedIndex].text + ', ' +
                    settings.country.options[settings.country.selectedIndex].text;
                //display empty popular place select
                common.SearchAndSetSelectedIndex('', settings.select_place,0);
                if (document.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).classList.contains('leaflet-container')){
                    //Update map
                    map_update_app(settings.gps_long_input.value,
                                    settings.gps_lat_input.value,
                                    common.COMMON_GLOBAL.module_leaflet_zoom_city,
                                    document.querySelector('#setting_input_place').value,
                                    null,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_city,
                                    common.COMMON_GLOBAL.module_leaflet_flyto).then((timezone_selected) => {
                                        settings.timezone_report.value = timezone_selected;
                                    });
                }
                //update country and city in settings
                const option = document.querySelector('#setting_select_user_setting').options[document.querySelector('#setting_select_user_setting').selectedIndex];
                option.setAttribute('gps_country_id', document.querySelector('#common_module_leaflet_select_country')[document.querySelector('#common_module_leaflet_select_country').selectedIndex].getAttribute('id'));
                option.setAttribute('gps_city_id', document.querySelector('#common_module_leaflet_select_city')[document.querySelector('#common_module_leaflet_select_city').selectedIndex].getAttribute('id'));
                
                break;
            }
        //GPS, popular places
        case 7:
            {
                //set GPS and timezone
                const longitude_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('longitude');
                const latitude_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('latitude');
                const timezone_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('timezone');
                settings.gps_long_input.value = longitude_selected;
                settings.gps_lat_input.value = latitude_selected;
                if (document.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).classList.contains('leaflet-container')){
                    //Update map
                    map_update_app( settings.gps_long_input.value,
                                    settings.gps_lat_input.value,
                                    common.COMMON_GLOBAL.module_leaflet_zoom_pp, //zoom for popular places
                                    settings.select_place.options[settings.select_place.selectedIndex].text,
                                    timezone_selected,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_pp, //marker for popular places
                                    common.COMMON_GLOBAL.module_leaflet_flyto);
                    //display empty country
                    common.SearchAndSetSelectedIndex('', settings.country,0);
                    //remove old city list:            
                    const old_groups = settings.city.querySelectorAll('optgroup');
                    for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
                        settings.city.removeChild(old_groups[old_index]);
                    //display first empty city
                    common.SearchAndSetSelectedIndex('', settings.city,0);
                }
                //empty country and city in settings
                const option = document.querySelector('#setting_select_user_setting').options[document.querySelector('#setting_select_user_setting').selectedIndex];
                option.setAttribute('gps_country_id', '');
                option.setAttribute('gps_city_id', '');
                
                settings.timezone_report.value = timezone_selected;
                const title = settings.select_place.options[settings.select_place.selectedIndex].text;
                document.querySelector('#setting_input_place').value = title;
                break;
            }
        //GPS, updating place
        case 8:
            {
                common.map_update_popup(document.querySelector('#setting_input_place').value);
                break;
            }
        //GPS, position
        case 9:
            {
                common.SearchAndSetSelectedIndex('', settings.select_place,0);
                common.get_place_from_gps(settings.gps_long_input.value, settings.gps_lat_input.value).then((gps_place) => {
                    //Update map
                    document.querySelector('#setting_input_place').value = gps_place;
                    if (document.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).classList.contains('leaflet-container')){
                        map_update_app( settings.gps_long_input.value,
                                        settings.gps_lat_input.value,
                                        '', //do not change zoom 
                                        gps_place,
                                        null,
                                        common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                        common.COMMON_GLOBAL.module_leaflet_jumpto).then((timezone_text) => {
                                                settings.timezone_report.value = timezone_text;
                                        });
                        //display empty country
                        common.SearchAndSetSelectedIndex('', settings.country,0);
                    }
                });
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
                common.show_image(settings.header_preview_img_item, item_id, APP_GLOBAL.image_header_footer_width, APP_GLOBAL.image_header_footer_height);
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
                common.show_image(settings.footer_preview_img_item, item_id, APP_GLOBAL.image_header_footer_width, APP_GLOBAL.image_header_footer_height);
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
                if (document.querySelector('#' + item_id).classList.contains(settings.button_active_class)){
                    document.querySelector('#' + item_id).classList.remove(settings.button_active_class);
                }
                else{	
                    settings.reportheader_aleft.classList.remove(settings.button_active_class);
                    settings.reportheader_acenter.classList.remove(settings.button_active_class);
                    settings.reportheader_aright.classList.remove(settings.button_active_class);
                    document.querySelector('#' + item_id).classList.add(settings.button_active_class);
                }
                const header_align = get_align(document.querySelector('#setting_icon_text_header_aleft').classList.contains('setting_button_active'),
                                             document.querySelector('#setting_icon_text_header_acenter').classList.contains('setting_button_active'),
                                             document.querySelector('#setting_icon_text_header_aright').classList.contains('setting_button_active'));
                document.querySelector('#setting_input_reportheader1').style.textAlign= header_align;
                document.querySelector('#setting_input_reportheader2').style.textAlign= header_align;
                document.querySelector('#setting_input_reportheader3').style.textAlign= header_align;
                break;
            }
        //16=Texts, Report footer align
        case 16:
            {
                //check if clicking on button that is already active then deactivate so no alignment
                if (document.querySelector('#' + item_id).classList.contains(settings.button_active_class)){
                    document.querySelector('#' + item_id).classList.remove(settings.button_active_class);
                }
                else{
                    settings.reportfooter_aleft.classList.remove(settings.button_active_class);
                    settings.reportfooter_acenter.classList.remove(settings.button_active_class);
                    settings.reportfooter_aright.classList.remove(settings.button_active_class);
                    document.querySelector('#' + item_id).classList.add(settings.button_active_class);
                }
                const footer_align = get_align(document.querySelector('#setting_icon_text_footer_aleft').classList.contains('setting_button_active'),
                                                 document.querySelector('#setting_icon_text_footer_acenter').classList.contains('setting_button_active'),
                                                 document.querySelector('#setting_icon_text_footer_aright').classList.contains('setting_button_active'));
                document.querySelector('#setting_input_reportfooter1').style.textAlign= footer_align;
                document.querySelector('#setting_input_reportfooter2').style.textAlign= footer_align;
                document.querySelector('#setting_input_reportfooter3').style.textAlign= footer_align;
                break;
            }
        //Prayer, method
        case 17:
            {
                const method = document.querySelector('#setting_select_method').value;
                let suffix;

                document.querySelector('#setting_method_param_fajr').innerHTML = '';
                document.querySelector('#setting_method_param_isha').innerHTML = '';
                if (typeof app_report.REPORT_GLOBAL.module_praytimes_methods[method].params.fajr == 'string')
                    suffix = '';
                else
                    suffix = '°';
                document.querySelector('#setting_method_param_fajr').innerHTML = 'Fajr:' + app_report.REPORT_GLOBAL.module_praytimes_methods[method].params.fajr + suffix;
                if (typeof app_report.REPORT_GLOBAL.module_praytimes_methods[method].params.isha == 'string')
                    suffix = '';
                else
                    suffix = '°';
                document.querySelector('#setting_method_param_isha').innerHTML = 'Isha:' + app_report.REPORT_GLOBAL.module_praytimes_methods[method].params.isha + suffix;
                break;
            }
    }
};
/*----------------------- */
/* USER                   */
/*----------------------- */
//function sent as parameter, set the argument passed and convert result to integer with unary plus syntax
//and ES6 arrow function and without function keyword
const show_profile_function = (profile_id) => {
                                profile_show_app(+profile_id);
                            };

const user_login_app = async () => {
    const username = document.querySelector('#common_login_username');
    const password = document.querySelector('#common_login_password');
    const old_button = document.querySelector('#common_login_button').innerHTML;
    document.querySelector('#common_login_button').innerHTML = common.APP_SPINNER;
    await common.user_login(username.value, password.value, (err, result)=>{
        document.querySelector('#common_login_button').innerHTML = old_button;
        if (err==null){
            //create intitial user setting if not exist, send initial=true
            user_settings_function('ADD_LOGIN', true, (err) =>{
                if (err)
                    null;
                else{
                    common.set_avatar(result.avatar, document.querySelector('#common_user_menu_avatar_img')); 
                    document.querySelector('#tab_nav_btn_7').innerHTML = '<img id=\'user_setting_avatar_img\' >';
                    common.set_avatar(result.avatar, document.querySelector('#user_setting_avatar_img')); 

                    document.querySelector('#common_user_menu_username').innerHTML = result.username;
                    document.querySelector('#common_user_menu_username').style.display = 'block';
                    
                    document.querySelector('#common_user_menu_logged_in').style.display = 'inline-block';
                    document.querySelector('#common_user_menu_logged_out').style.display = 'none';
                    
                    document.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'block';
                    document.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';

                    //Show user tab
                    document.querySelector('#tab_nav_7').style.display = 'inline-block';
                    //Hide settings
                    document.querySelector('#settings').style.visibility = 'hidden';
                    //Hide profile
                    document.querySelector('#common_dialogue_profile').style.visibility = 'hidden';
                    
                    document.querySelector('#paper').innerHTML='';
                    dialogue_loading(1);
                    user_settings_get().then(() => {
                        user_settings_load().then(() => {
                            settings_translate(true).then(() => {
                                settings_translate(false).then(() => {
                                    //show default startup
                                    toolbar_button(APP_GLOBAL.app_default_startup_page);
                                    dialogue_loading(0);
                                });
                            });
                        });
                    }); 
                }         
            });
        }
        
    });
};
const user_verify_check_input_app = async (item, nextField) => {
    await common.user_verify_check_input(item, nextField, (err, result) => {
        if ((err==null && result==null)==false)
            if(err==null){
                //login if LOGIN  or SIGNUP were verified successfully
                if (result.verification_type==1 ||
                    result.verification_type==2)
                    user_login_app();
            }
    });
};
const user_function_app = async (function_name) => {
    await common.user_function(function_name, (err) => {
        if (err==null){
            profile_update_stat_app();
        }
    });
};
const profile_close_app = () => {
    common.profile_close();
    profile_clear_app;
};
const profile_clear_app = () => {

    document.querySelector('#common_profile_public').style.display = 'none';
    document.querySelector('#common_profile_private').style.display = 'none';
    
    document.querySelector('#profile_info_user_setting_likes_count').innerHTML='';
    document.querySelector('#profile_info_user_setting_liked_count').innerHTML='';
    document.querySelector('#profile_select_user_settings').innerHTML='';

    document.querySelector('#profile_user_settings_info_like_count').innerHTML='';
    document.querySelector('#profile_user_settings_info_view_count').innerHTML='';
};
const user_logoff_app = () => {
    const select = document.querySelector('#setting_select_user_setting');
    let option;
    //get new data token to avoid endless loop and invalid token
    common.user_logoff().then(() => {
        document.querySelector('#tab_nav_btn_7').innerHTML = common.ICONS.user;
        document.querySelector('#user_settings').style.display = 'none';
        
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
                    toolbar_button(APP_GLOBAL.app_default_startup_page);
                });
            });
        });
    });    
};
const ProviderUser_update_app = async (identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email) => {
    await common.ProviderUser_update(identity_provider_id, profile_id, profile_first_name, profile_last_name, profile_image_url, profile_email, (err, result)=>{
        if(err==null){
            //create intitial user setting if not exist, send initial=true
            user_settings_function('ADD_LOGIN', true, (err) =>{
                if (err)
                    null;
                else{       
                    common.set_avatar(result.avatar, document.querySelector('#common_user_menu_avatar_img')); 
                    document.querySelector('#tab_nav_btn_7').innerHTML = '<img id=\'user_setting_avatar_img\' >';
                    common.set_avatar(result.avatar, document.querySelector('#user_setting_avatar_img')); 
                    document.querySelector('#common_user_menu_username').innerHTML = result.first_name + ' ' + result.last_name;
        
                    document.querySelector('#common_user_menu_logged_in').style.display = 'inline-block';
                    document.querySelector('#common_user_menu_logged_out').style.display = 'none';
                    document.querySelector('#common_user_menu_dropdown_logged_in').style.display = 'block';
                    document.querySelector('#common_user_menu_dropdown_logged_out').style.display = 'none';

                    //Show user tab
                    document.querySelector('#tab_nav_7').style.display = 'inline-block';
                    document.querySelector('#paper').innerHTML='';
                    dialogue_loading(1);
                    user_settings_get().then(() => {
                        user_settings_load().then(() => {
                            settings_translate(true).then(() => {
                                settings_translate(false).then(() => {
                                    //show default startup
                                    toolbar_button(APP_GLOBAL.app_default_startup_page);
                                    dialogue_loading(0);
                                });
                            });
                        });
                    });
                }
            });
        }
    });
};
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
    });
};
const profile_update_stat_app = async () => {
    await common.profile_update_stat((err, result) =>{
        if (err==null){
            profile_user_setting_stat(result.id);
        }
    });
};
const profile_show_app = async (user_account_id_other = null, username = null) => {
    document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
    document.querySelector('#common_profile_top').style.display = 'none';
    document.querySelector('#profile_main_stat_row2').style.display = 'none';
    document.querySelector('#profile_user_settings_row').style.display = 'none';
    
    profile_clear_app();

    if (user_account_id_other == null && common.COMMON_GLOBAL.user_account_id == '' && username == null) {
        document.querySelector('#common_profile_info').style.display = 'none';
    }
    else
        await common.profile_show(user_account_id_other, username, (err, result)=>{
            if (err==null){
                if (result.profile_id != null){
                    if (result.private==1 && parseInt(common.COMMON_GLOBAL.user_account_id) !== result.profile_id) {
                        //private
                        null;
                    } else {
                        //public
                        profile_show_user_setting();
                        document.querySelector('#profile_main_stat_row2').style.display = 'block';
                        profile_user_setting_stat(result.profile_id);
                    }    
                }
            }
        });
};
const profile_detail_app = (detailchoice, rest_url_app, fetch_detail, header_app, click_function) => {
    if (parseInt(common.COMMON_GLOBAL.user_account_id) || 0 !== 0) {
        if (detailchoice == 0){
            //user settings
            document.querySelector('#profile_user_settings_row').style.display = 'block';
        }
        else{
            //common 1 -4
            //app
            //7 Like user setting
            //8 Liked user setting
            document.querySelector('#profile_user_settings_row').style.display = 'none';
        }
        common.profile_detail(detailchoice, rest_url_app, fetch_detail, header_app, click_function);
    } 
    else
        common.show_common_dialogue('LOGIN');
                
};

/*----------------------- */
/* USER SETTINGS          */
/*----------------------- */
const user_settings_get = async () => {
    const select = document.querySelector('#setting_select_user_setting');
    await common.FFB ('DB_API', `/user_account_app_data_post/all?user_account_id=${common.COMMON_GLOBAL.user_account_id}`, 'GET', 'APP_DATA', null, (err, result) => {
        if (err)
            null;
        else{
            select.innerHTML = '';
            //fill select
            let option_html = '';
            let i=0;
            for (const user_account_app_setting of JSON.parse(result)) {
                const settings = JSON.parse(user_account_app_setting.json_data);
                option_html += `<option value=${i} id=${user_account_app_setting.id} description='${settings.description}'
                                    regional_language_locale=${settings.regional_language_locale}
                                    regional_timezone=${settings.regional_timezone}
                                    regional_number_system=${settings.regional_number_system}
                                    regional_layout_direction=${settings.regional_layout_direction}
                                    regional_second_language_locale=${settings.regional_second_language_locale}
                                    regional_column_title=${settings.regional_column_title}
                                    regional_arabic_script=${settings.regional_arabic_script}
                                    regional_calendar_type=${settings.regional_calendar_type}
                                    regional_calendar_hijri_type=${settings.regional_calendar_hijri_type}
                                    ${settings.gps_country_id==null?'gps_country_id ':'gps_country_id=' + settings.gps_country_id}
                                    ${settings.gps_city_id==null?'gps_city_id ':'gps_city_id=' + settings.gps_city_id}
                                    ${settings.gps_popular_place_id==null?'gps_popular_place_id ':'gps_popular_place_id=' + settings.gps_popular_place_id}
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
                                    user_account_id=${user_account_app_setting.user_account_app_user_account_id}
                                    >${settings.description}
                                </option>`;
                i++;
            }
            select.innerHTML += option_html;
            //show user setting select
            document.querySelector('#user_settings').style.display = 'block';
        }
    });
};
const user_setting_link = (item) => {
    const paper_size_select = document.querySelector('#setting_select_report_papersize');
    const select_user_setting = document.querySelector('#setting_select_user_setting');
    const user_account_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id');
    const sid = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    document.querySelector('#common_window_info_content').className = paper_size_select.options[paper_size_select.selectedIndex].value;
    switch (item.id){
        case 'user_day_html':
        case 'user_month_html':
        case 'user_year_html':{
            const url = get_report_url(user_account_id, 
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
            const text_copy = get_report_url(user_account_id, 
                                           sid, 
                                           paper_size_select.options[paper_size_select.selectedIndex].value,
                                           item.id,
                                           'HTML');
            navigator.clipboard.writeText(text_copy) .then(() => {
                common.show_message('INFO', null, null, common.ICONS.app_link, common.COMMON_GLOBAL.common_app_id);
            });
            break;
        }
        case 'user_day_pdf':
        case 'user_month_pdf':
        case 'user_year_pdf':{
            const url = get_report_url(user_account_id, 
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
            const text_copy = get_report_url(user_account_id, 
                                           sid, 
                                           paper_size_select.options[paper_size_select.selectedIndex].value,
                                           item.id,
                                           'PDF');
            navigator.clipboard.writeText(text_copy) .then(() => {
                common.show_message('INFO', null, null, common.ICONS.app_link, common.COMMON_GLOBAL.common_app_id);
            });
            break;
        }
    }
};
const user_settings_load = async () => {

    const select_user_setting = document.querySelector('#setting_select_user_setting');
    //Regional
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_language_locale'),
        document.querySelector('#setting_select_locale'), 1);

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_timezone'),
        document.querySelector('#setting_select_report_timezone'), 1);

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_number_system'),
        document.querySelector('#setting_select_report_numbersystem'), 1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_layout_direction'),
        document.querySelector('#setting_select_report_direction'), 1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_second_language_locale'),
        document.querySelector('#setting_select_report_locale_second'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_column_title'),
        document.querySelector('#setting_select_report_coltitle'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_arabic_script'),
        document.querySelector('#setting_select_report_arabic_script'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_type'),
        document.querySelector('#setting_select_calendartype'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_hijri_type'),
        document.querySelector('#setting_select_calendar_hijri_type'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id'),
        document.querySelector('#setting_select_popular_place'),0);
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id')||null !=null) {
        //set GPS for chosen popular place
        update_ui(7);
    }
    document.querySelector('#setting_input_place').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('description');
    document.querySelector('#setting_input_lat').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_lat_text');
    document.querySelector('#setting_input_long').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_long_text');    
    //Design
    set_theme_id('day', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_day_id'));
    set_theme_id('month', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_month_id'));
    set_theme_id('year', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_year_id'));

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_paper_size'),
        document.querySelector('#setting_select_report_papersize'),1);
    
    document.querySelector('#paper').className=document.querySelector('#setting_select_report_papersize').value;
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_row_highlight'),
        document.querySelector('#setting_select_report_highlight_row'),1);

    document.querySelector('#setting_checkbox_report_show_weekday').checked =
        Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_weekday_checked'));
    document.querySelector('#setting_checkbox_report_show_calendartype').checked =
        Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_calendartype_checked'));
    document.querySelector('#setting_checkbox_report_show_notes').checked =
        Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_notes_checked'));
    document.querySelector('#setting_checkbox_report_show_gps').checked =
        Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_gps_checked'));
    document.querySelector('#setting_checkbox_report_show_timezone').checked =
        Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_timezone_checked'));

    //Image
    //dont set null value, it will corrupt IMG tag
    document.querySelector('#setting_input_reportheader_img').value = '';
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img') == null ||
        select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img') == '') {
        common.recreate_img(document.querySelector('#setting_reportheader_img'));
    } else {
        document.querySelector('#setting_reportheader_img').src =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img');
    }

    document.querySelector('#setting_input_reportfooter_img').value = '';
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img') == null ||
        select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img') == '') {
        document.querySelector('#setting_reportfooter_img').src = '';
        common.recreate_img(document.querySelector('#setting_reportfooter_img'));
    } else {
        document.querySelector('#setting_reportfooter_img').src =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img');
    }
    //Text
    document.querySelector('#setting_input_reportheader1').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_1_text');
    document.querySelector('#setting_input_reportheader2').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_2_text');
    document.querySelector('#setting_input_reportheader3').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_3_text');
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align') == '') {
        document.querySelector('#setting_icon_text_header_aleft').classList.remove('setting_button_active');
        document.querySelector('#setting_icon_text_header_acenter').classList.remove('setting_button_active');
        document.querySelector('#setting_icon_text_header_aright').classList.remove('setting_button_active');
    } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
        //remove active class if it is active
        document.querySelector('#setting_icon_text_header_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align')).classList.remove('setting_button_active');
        update_ui(15, 'setting_icon_text_header_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align'));
    }
    document.querySelector('#setting_input_reportfooter1').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_1_text');
    document.querySelector('#setting_input_reportfooter2').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_2_text');
    document.querySelector('#setting_input_reportfooter3').value =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_3_text');
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align') == '') {
        document.querySelector('#setting_icon_text_footer_aleft').classList.remove('setting_button_active');
        document.querySelector('#setting_icon_text_footer_acenter').classList.remove('setting_button_active');
        document.querySelector('#setting_icon_text_footer_aright').classList.remove('setting_button_active');
    } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
        //remove active class if it is active
        document.querySelector('#setting_icon_text_footer_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align')).classList.remove('setting_button_active');
        update_ui(16, 'setting_icon_text_footer_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align'));
    }
    //Prayer
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_method'),
        document.querySelector('#setting_select_method'),1);
    //show method parameters used
    update_ui(17);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_method'),
        document.querySelector('#setting_select_asr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_high_latitude_adjustment'),
        document.querySelector('#setting_select_highlatitude'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_time_format'),
        document.querySelector('#setting_select_timeformat'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_hijri_date_adjustment'),
        document.querySelector('#setting_select_hijri_adjustment'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat'),
        document.querySelector('#setting_select_report_iqamat_title_fajr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat'),
        document.querySelector('#setting_select_report_iqamat_title_dhuhr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_iqamat'),
        document.querySelector('#setting_select_report_iqamat_title_asr'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_maghrib_iqamat'),
        document.querySelector('#setting_select_report_iqamat_title_maghrib'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_isha_iqamat'),
        document.querySelector('#setting_select_report_iqamat_title_isha'),1);

    document.querySelector('#setting_checkbox_report_show_imsak').checked =
        Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_imsak_checked'));
    document.querySelector('#setting_checkbox_report_show_sunset').checked =
        Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_sunset_checked'));
    document.querySelector('#setting_checkbox_report_show_midnight').checked =
        Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_midnight_checked'));

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_fast_start_end'),
        document.querySelector('#setting_select_report_show_fast_start_end'),1);

    return null;
};

const user_settings_function = async (function_name, initial_user_setting, callBack) => {
    const description = document.querySelector('#setting_input_place').value;
    
    const select_setting_popular_place = document.querySelector('#setting_select_popular_place');
    if (common.check_input(description) == false ||
        common.check_input(document.querySelector('#setting_input_lat').value) == false ||
        common.check_input(document.querySelector('#setting_input_long').value) == false ||
        common.check_input(document.querySelector('#setting_input_reportheader1').value) == false ||
        common.check_input(document.querySelector('#setting_input_reportheader2').value) == false ||
        common.check_input(document.querySelector('#setting_input_reportheader3').value) == false ||
        common.check_input(document.querySelector('#setting_input_reportfooter1').value) == false ||
        common.check_input(document.querySelector('#setting_input_reportfooter2').value) == false ||
        common.check_input(document.querySelector('#setting_input_reportfooter3').value) == false ||
        common.check_input(document.querySelector('#setting_input_long').value) == false)
        return;
    let country_id, city_id;
    if (document.querySelector('#common_module_leaflet_select_country')){
        const select_setting_country = document.querySelector('#common_module_leaflet_select_country');
        const select_setting_city = document.querySelector('#common_module_leaflet_select_city');
        country_id = select_setting_country[select_setting_country.selectedIndex].getAttribute('id');
        city_id = select_setting_city[select_setting_city.selectedIndex].getAttribute('id');
    }
    else{
        //choose user settings first if exists or else null
        const select_user_setting = document.querySelector('#setting_select_user_setting');
        if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id'))
            country_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id');
        else  
            country_id =  null;
        if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id'))
            city_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id');
        else
            city_id = null;
    }

    
    //store 0/1 for checked value for checkboxes
    const json_settings =
        {   description: description,
            regional_language_locale: document.querySelector('#setting_select_locale').value,
            regional_timezone: document.querySelector('#setting_select_report_timezone').value,
            regional_number_system: document.querySelector('#setting_select_report_numbersystem').value,
            regional_layout_direction: document.querySelector('#setting_select_report_direction').value,
            regional_second_language_locale: document.querySelector('#setting_select_report_locale_second').value,
            regional_column_title: document.querySelector('#setting_select_report_coltitle').value,
            regional_arabic_script: document.querySelector('#setting_select_report_arabic_script').value,
            regional_calendar_type: document.querySelector('#setting_select_calendartype').value,
            regional_calendar_hijri_type: document.querySelector('#setting_select_calendar_hijri_type').value,

            gps_country_id: country_id,
            gps_city_id: city_id,
            gps_popular_place_id: select_setting_popular_place[select_setting_popular_place.selectedIndex].getAttribute('id')||null,
            gps_lat_text: document.querySelector('#setting_input_lat').value,
            gps_long_text: document.querySelector('#setting_input_long').value,

            design_theme_day_id: get_theme_id('day'),
            design_theme_month_id: get_theme_id('month'),
            design_theme_year_id: get_theme_id('year'),
            design_paper_size: document.querySelector('#setting_select_report_papersize').value,
            design_row_highlight: document.querySelector('#setting_select_report_highlight_row').value,
            design_column_weekday_checked: Number(document.querySelector('#setting_checkbox_report_show_weekday').checked),
            design_column_calendartype_checked: Number(document.querySelector('#setting_checkbox_report_show_calendartype').checked),
            design_column_notes_checked: Number(document.querySelector('#setting_checkbox_report_show_notes').checked),
            design_column_gps_checked: Number(document.querySelector('#setting_checkbox_report_show_gps').checked),
            design_column_timezone_checked: Number(document.querySelector('#setting_checkbox_report_show_timezone').checked),

            image_header_image_img: document.querySelector('#setting_reportheader_img').src,
            image_footer_image_img: document.querySelector('#setting_reportfooter_img').src,

            text_header_1_text: document.querySelector('#setting_input_reportheader1').value,
            text_header_2_text: document.querySelector('#setting_input_reportheader2').value,
            text_header_3_text: document.querySelector('#setting_input_reportheader3').value,
            text_header_align: align_button_value('header'),
            text_footer_1_text: document.querySelector('#setting_input_reportfooter1').value,
            text_footer_2_text: document.querySelector('#setting_input_reportfooter2').value,
            text_footer_3_text: document.querySelector('#setting_input_reportfooter3').value,
            text_footer_align: align_button_value('footer'),

            prayer_method: document.querySelector('#setting_select_method').value,
            prayer_asr_method: document.querySelector('#setting_select_asr').value,
            prayer_high_latitude_adjustment: document.querySelector('#setting_select_highlatitude').value,
            prayer_time_format: document.querySelector('#setting_select_timeformat').value,
            prayer_hijri_date_adjustment: document.querySelector('#setting_select_hijri_adjustment').value,
            prayer_fajr_iqamat: document.querySelector('#setting_select_report_iqamat_title_fajr').value,
            prayer_dhuhr_iqamat: document.querySelector('#setting_select_report_iqamat_title_dhuhr').value,
            prayer_asr_iqamat: document.querySelector('#setting_select_report_iqamat_title_asr').value,
            prayer_maghrib_iqamat: document.querySelector('#setting_select_report_iqamat_title_maghrib').value,
            prayer_isha_iqamat: document.querySelector('#setting_select_report_iqamat_title_isha').value,
            prayer_column_imsak_checked: Number(document.querySelector('#setting_checkbox_report_show_imsak').checked),
            prayer_column_sunset_checked: Number(document.querySelector('#setting_checkbox_report_show_sunset').checked),
            prayer_column_midnight_checked: Number(document.querySelector('#setting_checkbox_report_show_midnight').checked),
            prayer_column_fast_start_end: document.querySelector('#setting_select_report_show_fast_start_end').value
         };
    const json_data = { description:        description,
                        json_data:          json_settings,
                        user_account_id:    common.COMMON_GLOBAL.user_account_id
                    };
    let method;
    let path;
    let old_button;
    let spinner_item;
    
    switch (function_name){
        case 'ADD_LOGIN':
        case 'ADD':{
            if (function_name=='ADD'){
                spinner_item = document.querySelector('#setting_btn_user_add');
                old_button = spinner_item.innerHTML;
                spinner_item.innerHTML = common.APP_SPINNER;    
            }
            method = 'POST';
            path = `/user_account_app_data_post?initial=${initial_user_setting==true?1:0}`;
            break;
        }
        case 'SAVE':{
            spinner_item = document.querySelector('#setting_btn_user_save');
            old_button = spinner_item.innerHTML;
            spinner_item.innerHTML = common.APP_SPINNER;
            method = 'PUT';
            const select_user_setting = document.querySelector('#setting_select_user_setting');
            const user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
            path = `/user_account_app_data_post?PUT_ID=${user_setting_id}`;
            break;
        }
        default:{
            break;
        }
    }
    await common.FFB ('DB_API', path, method, 'APP_ACCESS', json_data, (err, result) => {
        if (err){
            if (function_name !='ADD_LOGIN')
                spinner_item.innerHTML = old_button;
            callBack(err, null);
        }
        else{
            if (function_name !='ADD_LOGIN')
                spinner_item.innerHTML = old_button;
            switch (function_name){
                case 'ADD':{
                    //update user settings select with saved data
                    //save current settings to new option with 
                    //returned user_setting_id + common.COMMON_GLOBAL.user_account_id (then call set_settings_select)
                    const select = document.querySelector('#setting_select_user_setting');
                    select.innerHTML += `<option id=${JSON.parse(result).id} user_account_id=${common.COMMON_GLOBAL.user_account_id} >${description}</option>`;
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
    });
};

const user_settings_delete = (choice=null) => {
    const select_user_setting = document.querySelector('#setting_select_user_setting');
    const user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    const function_delete_user_setting = () => { document.querySelector('#common_dialogue_message').style.visibility = 'hidden';user_settings_delete(1); };
    
    switch (choice){
        case null:{
            common.show_message('CONFIRM',null,function_delete_user_setting, null, common.COMMON_GLOBAL.app_id);
            break;
        }
        case 1:{
            if (select_user_setting.length > 1) {
                const old_button = document.querySelector('#setting_btn_user_delete').innerHTML;
                document.querySelector('#setting_btn_user_delete').innerHTML = common.APP_SPINNER;
                common.FFB ('DB_API', `/user_account_app_data_post?DELETE_ID=${user_setting_id}`, 'DELETE', 'APP_ACCESS', null, (err) => {
                    if (err){
                        document.querySelector('#setting_btn_user_delete').innerHTML = old_button;
                    }
                    else{
                        const select = document.querySelector('#setting_select_user_setting');
                        //delete current option
                        select.remove(select.selectedIndex);
                        //load next available
                        user_settings_load().then(() => {
                            settings_translate(true).then(() => {
                                settings_translate(false).then(() => {
                                    document.querySelector('#setting_btn_user_delete').innerHTML = old_button;
                                });
                            });
                        });
                    }
                });       
            } else {
                //You can't delete last user setting
                common.show_message('ERROR', 20302, null, null, common.COMMON_GLOBAL.common_app_id);
            }
        }
    }
    return null;
};

const set_default_settings = async () => {
    const current_number_system = Intl.NumberFormat().resolvedOptions().numberingSystem;

    //Regional
    //set default language
    common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL.user_locale, document.querySelector('#setting_select_locale'),1);
    //default timezone current timezone
    document.querySelector('#setting_timezone_current').innerHTML = common.COMMON_GLOBAL.user_timezone;
    //default report timezone current timezone, 
    //will be changed user timezone to place timezone if no GPS can be set and default place will be used
    common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL.user_timezone, document.querySelector('#setting_select_report_timezone'),1);
    //set default numberformat numbersystem
    common.SearchAndSetSelectedIndex(current_number_system, document.querySelector('#setting_select_report_numbersystem'),1);
    //set default for others in Regional

    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_direction, document.querySelector('#setting_select_report_direction'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_locale_second, document.querySelector('#setting_select_report_locale_second'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_coltitle, document.querySelector('#setting_select_report_coltitle'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_arabic_script, document.querySelector('#setting_select_report_arabic_script'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_calendartype, document.querySelector('#setting_select_calendartype'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_calendar_hijri_type, document.querySelector('#setting_select_calendar_hijri_type'),1);
    
    //set according to users GPS/IP settings
    if (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude) {
        document.querySelector('#setting_input_lat').value = common.COMMON_GLOBAL.client_latitude;
        document.querySelector('#setting_input_long').value = common.COMMON_GLOBAL.client_longitude;
        document.querySelector('#setting_input_place').value = common.COMMON_GLOBAL.client_place;
        const {getTimezone} = await import('regional');
        document.querySelector('#setting_select_report_timezone').value = getTimezone(common.COMMON_GLOBAL.client_latitude, common.COMMON_GLOBAL.client_longitude);
    } else {
        //Set Makkah as default
        const select_place = document.querySelector('#setting_select_popular_place');
        select_place.selectedIndex = select_get_selectindex(select_place.id, APP_GLOBAL.gps_default_place_id);
        //update with default geodata in variables since geolocation is disabled
        common.COMMON_GLOBAL.client_longitude = select_place[select_place.selectedIndex].getAttribute('longitude');
        common.COMMON_GLOBAL.client_latitude = select_place[select_place.selectedIndex].getAttribute('latitude');
        common.COMMON_GLOBAL.client_place = select_place.options[select_place.selectedIndex].text;
        //Update popular places
        update_ui(7);
    }
    //Design
    set_theme_id('day', APP_GLOBAL.design_default_theme_day);
    set_theme_id('month', APP_GLOBAL.design_default_theme_month);
    set_theme_id('year', APP_GLOBAL.design_default_theme_year);

    common.SearchAndSetSelectedIndex(APP_GLOBAL.design_default_papersize, document.querySelector('#setting_select_report_papersize'),1);
    document.querySelector('#paper').className=document.querySelector('#setting_select_report_papersize').value;
    common.SearchAndSetSelectedIndex(APP_GLOBAL.design_default_highlight_row, document.querySelector('#setting_select_report_highlight_row'),1);
    
    document.querySelector('#setting_checkbox_report_show_weekday').checked = APP_GLOBAL.design_default_show_weekday;
    document.querySelector('#setting_checkbox_report_show_calendartype').checked = APP_GLOBAL.design_default_show_calendartype;
    document.querySelector('#setting_checkbox_report_show_notes').checked = APP_GLOBAL.design_default_show_notes;
    document.querySelector('#setting_checkbox_report_show_gps').checked = APP_GLOBAL.design_default_show_gps;
    document.querySelector('#setting_checkbox_report_show_timezone').checked = APP_GLOBAL.design_default_show_timezone;

    //Image
    document.querySelector('#setting_input_reportheader_img').value = '';
    if (APP_GLOBAL.image_default_report_header_src == null || APP_GLOBAL.image_default_report_header_src == '')
        common.recreate_img(document.querySelector('#setting_reportheader_img'));
    else {
        document.querySelector('#setting_reportheader_img').src = await common.convert_image(   APP_GLOBAL.image_default_report_header_src, 
                                                                                                APP_GLOBAL.image_header_footer_width, 
                                                                                                APP_GLOBAL.image_header_footer_height);
    }
    document.querySelector('#setting_input_reportfooter_img').value = '';
    if (APP_GLOBAL.image_default_report_footer_src == null || APP_GLOBAL.image_default_report_footer_src == '')
        common.recreate_img(document.querySelector('#setting_reportfooter_img'));
    else {
        document.querySelector('#setting_reportfooter_img').src = await common.convert_image(   APP_GLOBAL.image_default_report_footer_src, 
                                                                                                APP_GLOBAL.image_header_footer_width, 
                                                                                                APP_GLOBAL.image_header_footer_height);
    }
    //Text
    document.querySelector('#setting_input_reportheader1').value = APP_GLOBAL.text_default_reporttitle1;
    document.querySelector('#setting_input_reportheader2').value = APP_GLOBAL.text_default_reporttitle2;
    document.querySelector('#setting_input_reportheader3').value = APP_GLOBAL.text_default_reporttitle3;
    document.querySelector('#setting_icon_text_header_aleft').classList = 'setting_button'; //Align left not active
    document.querySelector('#setting_icon_text_header_acenter').classList = 'setting_button'; //Align center not active
    document.querySelector('#setting_icon_text_header_aright').classList = 'setting_button'; //Align right not active
    document.querySelector('#setting_input_reportfooter1').value = APP_GLOBAL.text_default_reportfooter1;
    document.querySelector('#setting_input_reportfooter2').value = APP_GLOBAL.text_default_reportfooter2;
    document.querySelector('#setting_input_reportfooter3').value = APP_GLOBAL.text_default_reportfooter3;
    document.querySelector('#setting_icon_text_footer_aleft').classList = 'setting_button'; //Align left not active
    document.querySelector('#setting_icon_text_footer_acenter').classList = 'setting_button'; //Align center not active
    document.querySelector('#setting_icon_text_footer_aright').classList = 'setting_button'; //Align right not active

    //Prayer
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_method, document.querySelector('#setting_select_method'),1);
    //show method parameters used
    update_ui(17);

    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_asr, document.querySelector('#setting_select_asr'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_highlatitude, document.querySelector('#setting_select_highlatitude'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_timeformat, document.querySelector('#setting_select_timeformat'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_hijri_adjustment, document.querySelector('#setting_select_hijri_adjustment'),1);
    
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_fajr, document.querySelector('#setting_select_report_iqamat_title_fajr'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_dhuhr, document.querySelector('#setting_select_report_iqamat_title_dhuhr'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_asr, document.querySelector('#setting_select_report_iqamat_title_asr'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_maghrib, document.querySelector('#setting_select_report_iqamat_title_maghrib'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_isha, document.querySelector('#setting_select_report_iqamat_title_isha'),1);

    document.querySelector('#setting_checkbox_report_show_imsak').checked = APP_GLOBAL.prayer_default_show_imsak;
    document.querySelector('#setting_checkbox_report_show_sunset').checked = APP_GLOBAL.prayer_default_show_sunset;
    document.querySelector('#setting_checkbox_report_show_midnight').checked = APP_GLOBAL.prayer_default_show_midnight;
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_show_fast_start_end, document.querySelector('#setting_select_report_show_fast_start_end'),1);
    //update select
    set_settings_select();
    //Hide user tab
    document.querySelector('#tab_nav_7').style.display = 'none';
    //open regional tab in settings
    openTab('1');
};

const set_settings_select = () => {
    const option = document.querySelector('#setting_select_user_setting').options[document.querySelector('#setting_select_user_setting').selectedIndex];
    option.text = document.querySelector('#setting_input_place').value;
    
    option.setAttribute('description', document.querySelector('#setting_input_place').value);
    option.setAttribute('regional_language_locale', document.querySelector('#setting_select_locale').value);
    option.setAttribute('regional_timezone', document.querySelector('#setting_select_report_timezone').value);
    option.setAttribute('regional_number_system', document.querySelector('#setting_select_report_numbersystem').value);
    option.setAttribute('regional_layout_direction', document.querySelector('#setting_select_report_direction').value);
    option.setAttribute('regional_second_language_locale', document.querySelector('#setting_select_report_locale_second').value);
    option.setAttribute('regional_column_title', document.querySelector('#setting_select_report_coltitle').value);
    option.setAttribute('regional_arabic_script', document.querySelector('#setting_select_report_arabic_script').value);
    option.setAttribute('regional_calendar_type', document.querySelector('#setting_select_calendartype').value);
    option.setAttribute('regional_calendar_hijri_type', document.querySelector('#setting_select_calendar_hijri_type').value);

    if (document.querySelector('#common_module_leaflet_select_country'))
        option.setAttribute('gps_country_id', document.querySelector('#common_module_leaflet_select_country')[document.querySelector('#common_module_leaflet_select_country').selectedIndex].getAttribute('id'));
    else
        option.setAttribute('gps_country_id','');
    if (document.querySelector('#common_module_leaflet_select_city'))
        option.setAttribute('gps_city_id', document.querySelector('#common_module_leaflet_select_city')[document.querySelector('#common_module_leaflet_select_city').selectedIndex].getAttribute('id'));
    else
        option.setAttribute('gps_city_id','');

    option.setAttribute('gps_popular_place_id', document.querySelector('#setting_select_popular_place')[document.querySelector('#setting_select_popular_place').selectedIndex].getAttribute('id'));
    option.setAttribute('gps_lat_text', document.querySelector('#setting_input_lat').value);
    option.setAttribute('gps_long_text', document.querySelector('#setting_input_long').value);

    option.setAttribute('design_theme_day_id', get_theme_id('day'));
    option.setAttribute('design_theme_month_id', get_theme_id('month'));
    option.setAttribute('design_theme_year_id', get_theme_id('year'));
    option.setAttribute('design_paper_size', document.querySelector('#setting_select_report_papersize').value);
    option.setAttribute('design_row_highlight', document.querySelector('#setting_select_report_highlight_row').value);
    option.setAttribute('design_column_weekday_checked', Number(document.querySelector('#setting_checkbox_report_show_weekday').checked));
    option.setAttribute('design_column_calendartype_checked', Number(document.querySelector('#setting_checkbox_report_show_calendartype').checked));
    option.setAttribute('design_column_notes_checked', Number(document.querySelector('#setting_checkbox_report_show_notes').checked));
    option.setAttribute('design_column_gps_checked', Number(document.querySelector('#setting_checkbox_report_show_gps').checked));
    option.setAttribute('design_column_timezone_checked', Number(document.querySelector('#setting_checkbox_report_show_timezone').checked));

    option.setAttribute('image_header_image_img', document.querySelector('#setting_reportheader_img').src);
    option.setAttribute('image_footer_image_img', document.querySelector('#setting_reportfooter_img').src);

    //fix null value that returns the word "null" without quotes
    option.setAttribute('text_header_1_text', document.querySelector('#setting_input_reportheader1').value);
    option.setAttribute('text_header_2_text', document.querySelector('#setting_input_reportheader2').value);
    option.setAttribute('text_header_3_text', document.querySelector('#setting_input_reportheader3').value);
    option.setAttribute('text_header_align', align_button_value('header'));
    option.setAttribute('text_footer_1_text', document.querySelector('#setting_input_reportfooter1').value);
    option.setAttribute('text_footer_2_text', document.querySelector('#setting_input_reportfooter2').value);
    option.setAttribute('text_footer_3_text', document.querySelector('#setting_input_reportfooter3').value);
    option.setAttribute('text_footer_align', align_button_value('footer'));

    option.setAttribute('prayer_method', document.querySelector('#setting_select_method').value);
    option.setAttribute('prayer_asr_method', document.querySelector('#setting_select_asr').value);
    option.setAttribute('prayer_high_latitude_adjustment', document.querySelector('#setting_select_highlatitude').value);
    option.setAttribute('prayer_time_format', document.querySelector('#setting_select_timeformat').value);
    option.setAttribute('prayer_hijri_date_adjustment', document.querySelector('#setting_select_hijri_adjustment').value);
    option.setAttribute('prayer_fajr_iqamat', document.querySelector('#setting_select_report_iqamat_title_fajr').value);
    option.setAttribute('prayer_dhuhr_iqamat', document.querySelector('#setting_select_report_iqamat_title_dhuhr').value);
    option.setAttribute('prayer_asr_iqamat', document.querySelector('#setting_select_report_iqamat_title_asr').value);
    option.setAttribute('prayer_maghrib_iqamat', document.querySelector('#setting_select_report_iqamat_title_maghrib').value);
    option.setAttribute('prayer_isha_iqamat', document.querySelector('#setting_select_report_iqamat_title_isha').value);
    option.setAttribute('prayer_column_imsak_checked', Number(document.querySelector('#setting_checkbox_report_show_imsak').checked));
    option.setAttribute('prayer_column_sunset_checked', Number(document.querySelector('#setting_checkbox_report_show_sunset').checked));
    option.setAttribute('prayer_column_midnight_checked', Number(document.querySelector('#setting_checkbox_report_show_midnight').checked));
    option.setAttribute('prayer_column_fast_start_end', document.querySelector('#setting_select_report_show_fast_start_end').value);
};

const profile_user_setting_stat = (id) => {
    common.FFB ('DB_API', `/user_account_app_data_post/profile?id=${id}`, 'GET', 'APP_DATA', null, (err, result) => {
        if (err)
            null;
        else{
            document.querySelector('#profile_info_user_setting_likes_count').innerHTML = JSON.parse(result)[0].count_user_post_likes;
            document.querySelector('#profile_info_user_setting_liked_count').innerHTML = JSON.parse(result)[0].items.count_user_post_liked;
        }
    });
};

const profile_user_setting_link = (item) => {
    const select_user_setting = document.querySelector('#profile_select_user_settings');
    const user_account_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id');
    const sid = select_user_setting[select_user_setting.selectedIndex].getAttribute('sid');
    const paper_size = select_user_setting[select_user_setting.selectedIndex].getAttribute('paper_size');
    document.querySelector('#common_window_info_content').className = paper_size;
    switch (item.id){
        case 'profile_user_settings_day':
        case 'profile_user_settings_month':
        case 'profile_user_settings_year':{
            const url = get_report_url(user_account_id, 
                                     sid, 
                                     paper_size,
                                     item.id,
                                     'HTML',
                                     false);
            common.show_window_info(2, null, 'HTML', `${url}`);
            break;
        }
        case 'profile_user_settings_like':{
            user_settings_like(sid);
            break;
        }
    }
};
const profile_show_user_setting_detail = (liked, count_likes, count_views) => {
    
    document.querySelector('#profile_user_settings_like').children[0].style.display = `${liked == 1?'none':'block'}`;
    document.querySelector('#profile_user_settings_like').children[1].style.display = `${liked == 1?'block':'none'}`;

    document.querySelector('#profile_user_settings_info_like_count').innerHTML = count_likes;
    document.querySelector('#profile_user_settings_info_view_count').innerHTML = count_views;
};
const profile_show_user_setting = () => {
    document.querySelector('#profile_user_settings_row').style.display = 'block';

    common.FFB ('DB_API', `/user_account_app_data_post/profile/all?id=${document.querySelector('#common_profile_id').innerHTML}` + 
                      '&id_current_user=' + common.COMMON_GLOBAL.user_account_id, 'GET', 'APP_DATA', null, (err, result) => {
        if (err)
            null;
        else{
            const profile_select_user_settings = document.querySelector('#profile_select_user_settings');
            profile_select_user_settings.innerHTML='';
            let html = '';
            let i = 0;
            for (const profile_setting of JSON.parse(result)) {
                html += `<option id="${i}" 
                        value=""
                        sid=${profile_setting.id} 
                        user_account_id=${profile_setting.user_account_app_user_account_id}
                        liked=${profile_setting.liked}
                        count_likes=${profile_setting.count_likes}
                        count_views=${profile_setting.count_views}
                        paper_size=${JSON.parse(profile_setting.json_data).design_paper_size}
                        >${profile_setting.description}
                        </option>`;
                i++;
            }
            profile_select_user_settings.innerHTML = html;
            profile_show_user_setting_detail(profile_select_user_settings.options[profile_select_user_settings.selectedIndex].getAttribute('liked'), 
                                             profile_select_user_settings.options[profile_select_user_settings.selectedIndex].getAttribute('count_likes'), 
                                             profile_select_user_settings.options[profile_select_user_settings.selectedIndex].getAttribute('count_views'));
        }
    });
};
const profile_user_setting_update_stat = () => {
    const profile_id = document.querySelector('#common_profile_id').innerHTML;
    common.FFB ('DB_API', `/user_account_app_data_post/profile/all?id=${profile_id}` +
                      '&id_current_user=' + common.COMMON_GLOBAL.user_account_id, 'GET', 'APP_DATA', null, (err, result) => {
        if (err)
            null;
        else{
            const profile_select_user_settings = document.querySelector('#profile_select_user_settings');
            for (const profile_setting of JSON.parse(result)) {
                if (profile_select_user_settings.options[profile_select_user_settings.selectedIndex].getAttribute('sid')==profile_setting.id){
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].setAttribute('user_account_id', profile_setting.user_account_id);
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].setAttribute('liked', profile_setting.liked);
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].setAttribute('count_likes', profile_setting.count_likes);
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].setAttribute('count_views', profile_setting.count_views);
                    profile_select_user_settings.options[profile_select_user_settings.selectedIndex].text = profile_setting.description;
                    profile_show_user_setting_detail(profile_setting.liked, 
                                                     profile_setting.count_likes, 
                                                     profile_setting.count_views);
                }
            }
            profile_user_setting_stat(profile_id);
        }
    });
};
const user_settings_like = (user_account_app_data_post_id) => {
    let method;

    const json_data = {user_account_app_data_post_id: user_account_app_data_post_id};

    if (common.COMMON_GLOBAL.user_account_id == '')
        common.show_common_dialogue('LOGIN');
    else {
        if (document.querySelector('#profile_user_settings_like').children[0].style.display == 'block') {
            method = 'POST';
        }
        else {
            method = 'DELETE';
        }
        common.FFB ('DB_API', `/user_account_app_data_post_like?user_account_id=${common.COMMON_GLOBAL.user_account_id}`, method, 'APP_ACCESS', json_data, (err) => {
            if (err)
                null;
            else{
                    profile_user_setting_update_stat();
                } 
        });
    }
};
/*----------------------- */
/* EVENTS                 */
/*----------------------- */
const setEvents = () => {
    //app
    //toolbar top
    document.querySelector('#toolbar_top').addEventListener('click', (event) => {
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
                zoom_paper(-1);
                break;
            }
            case 'toolbar_btn_zoomin':{
                zoom_paper(1);
                break;
            }
            case 'toolbar_btn_left':{
                update_timetable_report(APP_GLOBAL.timetable_type, event_target_id, getReportSettings());
                break;
            }
            case 'toolbar_btn_right':{
                update_timetable_report(APP_GLOBAL.timetable_type, event_target_id, getReportSettings());
                break;
            }
            case 'toolbar_btn_search':{
                const x = document.querySelector('#common_profile_input_row'); 
                if (x.style.visibility == 'visible') {
                    x.style.visibility = 'hidden';
                    document.querySelector('#common_profile_search_list_wrap').style.visibility = 'hidden';
                } 
                else{
                    x.style.visibility = 'visible'; 
                    document.querySelector('#common_profile_search_list_wrap').style.visibility = 'visible';
                    document.querySelector('#common_profile_search_input').focus();
                }
                break;
            }
        }
    }, false);
    //tab navigation
    document.querySelector('#tab_navigation').addEventListener('click', (event) => {
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
    document.querySelector('#setting_select_locale').addEventListener('change', () => { settings_translate(true); }, false);
    document.querySelector('#setting_select_report_timezone').addEventListener('change', () => { update_ui(2); }, false);
    document.querySelector('#setting_select_report_locale_second').addEventListener('change', () => { settings_translate(false); }, false);                                                        

    //settings gps    
    
    document.querySelector('#setting_select_popular_place').addEventListener('change', () => { update_ui(7);}, false);
    document.querySelector('#setting_input_place').addEventListener('keyup', () => { common.typewatch(update_ui, 8); }, false);
    document.querySelector('#setting_input_lat').addEventListener('keyup', () => { common.typewatch(update_ui, 9); }, false);
    document.querySelector('#setting_input_long').addEventListener('keyup', () => { common.typewatch(update_ui, 9); }, false);    
    //settings design
    document.querySelector('#setting_select_report_papersize').addEventListener('change', () => { update_ui(10); }, false);
    //settings image
    document.querySelector('#setting_icon_image_header_img').addEventListener('click', () => { document.querySelector('#setting_input_reportheader_img').click(); }, false);
    document.querySelector('#setting_icon_image_header_clear').addEventListener('click', () => { update_ui(12); }, false);
    document.querySelector('#setting_input_reportheader_img').addEventListener('change', (event) => { update_ui(11, event.target.id); }, false);
    document.querySelector('#setting_icon_image_footer_img').addEventListener('click', () => { document.querySelector('#setting_input_reportfooter_img').click(); }, false);
    document.querySelector('#setting_icon_image_footer_clear').addEventListener('click', () => { update_ui(14); }, false);
    document.querySelector('#setting_input_reportfooter_img').addEventListener('change', (event) => { update_ui(13, event.target.id); }, false);
    //settings text
    document.querySelector('#setting_icon_text_theme_row').addEventListener('click', (event) => {  
                                                                                                document.querySelector('#setting_icon_text_theme_day').classList.remove('common_dialogue_button');
                                                                                                document.querySelector('#setting_icon_text_theme_month').classList.remove('common_dialogue_button');
                                                                                                document.querySelector('#setting_icon_text_theme_year').classList.remove('common_dialogue_button');
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
                                                                                                document.querySelector('#setting_icon_text_theme_' + theme_type).classList.add('common_dialogue_button');
                                                                                                if (theme_type=='day' || theme_type=='month' || theme_type=='year'){
                                                                                                    document.querySelector('#setting_paper_preview_text').className =  'setting_paper_preview' + ' ' +
                                                                                                                                                                        `theme_${theme_type}_${get_theme_id(theme_type)} ` + 
                                                                                                                                                                        document.querySelector('#setting_select_report_arabic_script').value;
                                                                                                }}, false);
    document.querySelector('#setting_icon_text_header_aleft').addEventListener('click', (event) => { update_ui(15, event.target.id ==''?event.target.parentElement.id:event.target.id); }, false);
    document.querySelector('#setting_icon_text_header_acenter').addEventListener('click', (event) => { update_ui(15, event.target.id==''?event.target.parentElement.id:event.target.id); }, false);
    document.querySelector('#setting_icon_text_header_aright').addEventListener('click', (event) => { update_ui(15, event.target.id==''?event.target.parentElement.id:event.target.id); }, false);
    document.querySelector('#setting_icon_text_footer_aleft').addEventListener('click', (event) => { update_ui(16, event.target.id==''?event.target.parentElement.id:event.target.id); }, false);
    document.querySelector('#setting_icon_text_footer_acenter').addEventListener('click', (event) => { update_ui(16, event.target.id==''?event.target.parentElement.id:event.target.id); }, false);
    document.querySelector('#setting_icon_text_footer_aright').addEventListener('click', (event) => { update_ui(16, event.target.id==''?event.target.parentElement.id:event.target.id); }, false);
    //settings prayer                 
    document.querySelector('#setting_select_method').addEventListener('change', () => { update_ui(17);}, false);
    //settings user
    document.querySelector('#setting_select_user_setting').addEventListener('change', () => {user_settings_load().then(() => {settings_translate(true).then(() => {settings_translate(false);});}); }, false);

    document.querySelector('#user_settings').addEventListener('click', (event) => { 
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
                    user_settings_function('SAVE', false, ()=>{});
                    break;
                }
                case 'setting_btn_user_add':{
                    user_settings_function('ADD', false, ()=>{});
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
                    user_setting_link(document.querySelector('#' + event_target_id));
                    break;
                }
            }
        
    }, false);
    
    //profile
    document.querySelector('#profile_main_btn_user_settings').addEventListener('click', () => { profile_detail_app(0, '/user_account_app_data_post/profile/detail', false); }, false);
    document.querySelector('#profile_main_btn_user_setting_likes').addEventListener('click', () => { profile_detail_app(6, '/user_account_app_data_post/profile/detail', true, 
        `<div class='common_like_unlike'> ${common.ICONS.user_like}</div>
         <div > ${common.ICONS.regional_day +
                  common.ICONS.regional_month +
                  common.ICONS.regional_year +
                  common.ICONS.user_follows}</div>`, show_profile_function); }, false);
    document.querySelector('#profile_main_btn_user_setting_liked').addEventListener('click', () => { profile_detail_app(7, '/user_account_app_data_post/profile/detail', true, 
        `<div class='common_like_unlike'> ${common.ICONS.user_like}</div>
         <div > ${common.ICONS.regional_day +
                  common.ICONS.regional_month +
                  common.ICONS.regional_year +
                  common.ICONS.user_followed}</div>`, show_profile_function); }, false);
    document.querySelector('#profile_top_row2_1').addEventListener('click', () => { common.profile_top(4, '/user_account_app_data_post/profile/top', show_profile_function); }, false);
    document.querySelector('#profile_top_row2_2').addEventListener('click', () => { common.profile_top(5, '/user_account_app_data_post/profile/top', show_profile_function); }, false);
    document.querySelector('#profile_user_settings_day').addEventListener('click', (event) => { profile_user_setting_link(event.target.id ==''?event.target.parentElement:event.target); }, false);
    document.querySelector('#profile_user_settings_month').addEventListener('click', (event) => { profile_user_setting_link(event.target.id ==''?event.target.parentElement:event.target); }, false);
    document.querySelector('#profile_user_settings_year').addEventListener('click', (event) => { profile_user_setting_link(event.target.id ==''?event.target.parentElement:event.target); }, false);
    document.querySelector('#profile_user_settings_like').addEventListener('click', (event) => { profile_user_setting_link(event.target.id ==''?event.target.parentElement:event.target); }, false);
    document.querySelector('#common_profile_search_input').addEventListener('keyup', (event) => { common.search_input(event, 'profile', show_profile_function);}, false);
    document.querySelector('#profile_select_user_settings').addEventListener('change', 
        (event) => { profile_show_user_setting_detail(event.target.options[event.target.selectedIndex].getAttribute('liked'), 
                                                      event.target.options[event.target.selectedIndex].getAttribute('count_likes'), 
                                                      event.target.options[event.target.selectedIndex].getAttribute('count_views')); }, false);
    //dialogue info
    document.querySelector('#info_link1').addEventListener('click', () => { common.show_window_info(1, APP_GLOBAL.info_link_policy_url);}, false);
    document.querySelector('#info_link2').addEventListener('click', () => { common.show_window_info(1, APP_GLOBAL.info_link_disclaimer_url);}, false);
    document.querySelector('#info_link3').addEventListener('click', () => { common.show_window_info(1, APP_GLOBAL.info_link_terms_url);}, false);
    document.querySelector('#info_link4').addEventListener('click', () => { common.show_window_info(1, APP_GLOBAL.info_link_about_url);}, false);
    document.querySelector('#info_close').addEventListener('click', () => { document.querySelector('#dialogue_info').style.visibility = 'hidden';}, false);
    
    //dialogue scan mobile
    document.querySelector('#scan_open_mobile_close').addEventListener('click', () => { document.querySelector('#dialogue_scan_open_mobile').style.visibility = 'hidden'; }, false);
    //toolbar bottom
    document.querySelector('#toolbar_bottom').addEventListener('click', (event) => {
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
                document.querySelector('#dialogue_info').style.visibility = 'visible';
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
    document.querySelector('#common_user_menu_dropdown_log_out').addEventListener('click', () => { user_logoff_app(); }, false);
    document.querySelector('#common_user_menu_username').addEventListener('click', () => { toolbar_button(6); }, false);
    
    //user preferences    
    document.querySelector('#common_app_select_theme').addEventListener('change', () => { document.body.className = 'app_theme' + 
                                                                                                                         document.querySelector('#common_app_select_theme').value + ' ' + 
                                                                                                                         document.querySelector('#common_user_arabic_script_select').value;}, false);
    document.querySelector('#common_user_locale_select').addEventListener('change', (event) => { common_translate_ui_app(event.target.value, ()=>{});}, false);    
    document.querySelector('#common_user_timezone_select').addEventListener('change', (event) => { document.querySelector('#setting_timezone_current').innerHTML = event.target.value;}, false);
    document.querySelector('#common_user_arabic_script_select').addEventListener('change', () => { document.querySelector('#common_app_select_theme').dispatchEvent(new Event('change'));}, false);
    
    //profile button top
    document.querySelector('#common_profile_btn_top').addEventListener('click', () => { toolbar_button(7); }, false);

    //dialogue login/signup/forgot
    const input_username_login = document.querySelector('#common_login_username');
    input_username_login.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            user_login_app().then(() => {
                //unfocus
                document.querySelector('#common_login_username').blur();
            });
        }
    });
    const input_password_login = document.querySelector('#common_login_password');
    input_password_login.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            user_login_app().then(() => {
                //unfocus
                document.querySelector('#common_login_password').blur();
            });
        }
    });
    document.querySelector('#common_login_button').addEventListener('click', () => { user_login_app(); }, false);
    document.querySelector('#common_signup_button').addEventListener('click', () => { common.user_signup(); }, false);
    
    if (document.querySelector('#identity_provider_login'))
        document.querySelector('#identity_provider_login').addEventListener('click', (event) => {
            if (!event.target.id)
                ProviderSignIn_app(
                    event.target.parentElement.classList.contains('common_login_button')==true?event.target.parentElement:event.target);
                });
    
    //dialogue profile
    document.querySelector('#common_profile_main_btn_following').addEventListener('click', () => { profile_detail_app(1, null, true, null, show_profile_function); }, false);
    document.querySelector('#common_profile_main_btn_followed').addEventListener('click', () => { profile_detail_app(2, null, true, null, show_profile_function); }, false);
    document.querySelector('#common_profile_main_btn_likes').addEventListener('click', () => { profile_detail_app(3, null, true, null, show_profile_function); }, false);
    document.querySelector('#common_profile_main_btn_liked').addEventListener('click', () => { profile_detail_app(4, null, true, null, show_profile_function); }, false);
    document.querySelector('#common_profile_follow').addEventListener('click', () => { user_function_app('FOLLOW'); }, false);
    document.querySelector('#common_profile_like').addEventListener('click', () => { user_function_app('LIKE'); }, false);
    document.querySelector('#common_profile_top_row1_1').addEventListener('click', () => { common.profile_top(1, null, show_profile_function); }, false);
    document.querySelector('#common_profile_top_row1_2').addEventListener('click', () => { common.profile_top(2, null, show_profile_function); }, false);
    document.querySelector('#common_profile_top_row1_3').addEventListener('click', () => { common.profile_top(3, null, show_profile_function); }, false);
    document.querySelector('#common_profile_home').addEventListener('click', () => {toolbar_button(7);}, false);
    document.querySelector('#common_profile_close').addEventListener('click', () => {profile_close_app();}, false);
    //dialogue verify
    document.querySelector('#common_user_verify_verification_container').addEventListener('keyup', (event) => {
        switch (event.target.id){
            case 'common_user_verify_verification_char1':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char2');
                break;
            }
            case 'common_user_verify_verification_char2':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char3');
                break;
            }
            case 'common_user_verify_verification_char3':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char4');
                break;
            }
            case 'common_user_verify_verification_char4':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char5');
                break;
            }
            case 'common_user_verify_verification_char5':{
                user_verify_check_input_app(event.target, 'common_user_verify_verification_char6');
                break;
            }
            case 'common_user_verify_verification_char6':{
                user_verify_check_input_app(event.target, '');
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
};
/*----------------------- */
/* MODULE LEAFLET         */
/*----------------------- */
const init_map = async () => {
    return await new Promise((resolve) => {
        common.map_init(APP_GLOBAL.gps_module_leaflet_container,
                        common.COMMON_GLOBAL.module_leaflet_style, 
                        document.querySelector('#setting_input_long').value, 
                        document.querySelector('#setting_input_lat').value, 
                        true,
                        false,
                        map_show_search_on_map_app).then(() => {
            //GPS
            const select_user_setting = document.querySelector('#setting_select_user_setting');
            common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id'),
                                             document.querySelector('#common_module_leaflet_select_country'),0);
            if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id')||null !=null) {
                //fill cities for chosen country
                update_ui(5).then(() => {
                    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id'),
                                                     document.querySelector('#common_module_leaflet_select_city'),0);
                    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id')||null !=null) {
                        //set GPS for chosen city
                        update_ui(6);
                    }
                });
            }        
            //add extra event on comment items on map
            document.querySelector('#common_module_leaflet_select_country').addEventListener('change', () => { 
                update_ui(5); 
            }, false);
            document.querySelector('#common_module_leaflet_select_city').addEventListener('change', () => { 
                const select_country = document.querySelector('#common_module_leaflet_select_country');
                const select_city = document.querySelector('#common_module_leaflet_select_city');
                const select_setting = document.querySelector('#setting_select_user_setting');
                const option = select_setting.options[select_setting.selectedIndex];
                option.setAttribute('gps_country_id', select_country[select_country.selectedIndex].getAttribute('id'));
                option.setAttribute('gps_city_id', select_city[select_city.selectedIndex].getAttribute('id'));
                //popular place not on map is read when saving
                update_ui(6);
                import('regional').then(({getTimezone})=>{
                    const timezone = getTimezone(   document.querySelector('#setting_input_lat').value,
                                                    document.querySelector('#setting_input_long').value);
                    app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(timezone);
                });
            }, false);
            document.querySelector('#common_module_leaflet_select_mapstyle').addEventListener('change', () => { update_ui(4); }, false);

            //add extra app events on map
            document.querySelector('#' + APP_GLOBAL.gps_module_leaflet_container).addEventListener('click', (event) => {
                const event_target_id = event.target.id==''?event.target.parentNode.id:event.target.id;
                if ( event_target_id == 'common_module_leaflet_control_my_location_id'){
                    document.querySelector('#setting_select_popular_place').selectedIndex = 0;
                    document.querySelector('#setting_input_place').value = common.COMMON_GLOBAL.client_place;
                    document.querySelector('#setting_input_long').value = common.COMMON_GLOBAL.client_longitude;
                    document.querySelector('#setting_input_lat').value = common.COMMON_GLOBAL.client_latitude;
                    //remove country and city in settings
                    const option = document.querySelector('#setting_select_user_setting').options[document.querySelector('#setting_select_user_setting').selectedIndex];
                    option.setAttribute('gps_country_id', '');
                    option.setAttribute('gps_city_id', '');
                    import('regional').then(({getTimezone})=>{
                        //update timezone
                        document.querySelector('#setting_select_report_timezone').value = getTimezone(common.COMMON_GLOBAL.client_latitude, common.COMMON_GLOBAL.client_longitude);
                        //set qibbla
                        map_show_qibbla();
                        app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(document.querySelector('#setting_select_report_timezone').value);
                    });
                }
            }, false);
            common.map_setevent('dblclick', (e) => {
                if (e.originalEvent.target.id == APP_GLOBAL.gps_module_leaflet_container){
                    document.querySelector('#setting_input_lat').value = e.latlng.lat;
                    document.querySelector('#setting_input_long').value = e.latlng.lng;
                    //Update GPS position
                    update_ui(9);
                    import('regional').then(({getTimezone})=>{
                        const timezone = getTimezone(   e.latlng.lat, e.latlng.lng);
                        app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(timezone);
                    });
                }   
            });
            resolve();
        });
    });
};

const map_show_qibbla = () => {
    common.map_line_removeall();
    common.map_line_create('qibbla', 
                    APP_GLOBAL.gps_module_leaflet_qibbla_title,
                    APP_GLOBAL.gps_module_leaflet_qibbla_text_size,
                    APP_GLOBAL.gps_module_leaflet_qibbla_long,
                    APP_GLOBAL.gps_module_leaflet_qibbla_lat,
                    document.querySelector('#setting_input_long').value,
                    document.querySelector('#setting_input_lat').value,
                    APP_GLOBAL.gps_module_leaflet_qibbla_color,
                    APP_GLOBAL.gps_module_leaflet_qibbla_width,
                    APP_GLOBAL.gps_module_leaflet_qibbla_opacity);
    common.map_line_create('qibbla_old', 
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_title,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_text_size,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_long,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_lat,
                    document.querySelector('#setting_input_long').value,
                    document.querySelector('#setting_input_lat').value,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_color,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_width,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_opacity);
    return null;
};

const map_update_app = async (longitude, latitude, zoom, text1, text2, marker_id, to_method) => {
    return new Promise((resolve) => {
        map_show_qibbla();
        common.map_update(longitude, latitude, zoom, text1, text2, marker_id, to_method).then((timezonetext)=> {
            resolve(timezonetext);
        });
    });
};
const map_show_search_on_map_app = async (city) =>{
    common.map_show_search_on_map(city);
    map_show_qibbla();
    common.SearchAndSetSelectedIndex('', document.querySelector('#setting_select_popular_place'),0);
    document.querySelector('#setting_input_place').value =  city.querySelector('.common_module_leaflet_search_list_city a').innerHTML + ', ' +
                                                            city.querySelector('.common_module_leaflet_search_list_country a').innerHTML;
    document.querySelector('#setting_input_long').value = city.querySelector('.common_module_leaflet_search_list_longitude').innerHTML;
    document.querySelector('#setting_input_lat').value = city.querySelector('.common_module_leaflet_search_list_latitude').innerHTML;
    const {getTimezone} = await import('regional');
    document.querySelector('#setting_select_report_timezone').value = getTimezone(  document.querySelector('#setting_input_lat').value, 
                                                                                    document.querySelector('#setting_input_long').value);
    app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(document.querySelector('#setting_select_report_timezone').value);
};
/*----------------------- */
/* EXCEPTION              */
/*----------------------- */
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, error);
};
/*----------------------- */
/* INIT                   */
/*----------------------- */
const init_app = () => {
    return new Promise((resolve) => {
        dialogue_loading(1);
        //set app globals
        //set current date for report month
        //if client_timezone is set, set Date with client_timezone
        if (common.COMMON_GLOBAL.client_timezone)
            app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(common.COMMON_GLOBAL.client_timezone);
        else
            app_report.REPORT_GLOBAL.session_currentDate = new Date();
        app_report.REPORT_GLOBAL.session_currentHijriDate = new Array();
        //get Hijri date from initial Gregorian date
        app_report.REPORT_GLOBAL.session_currentHijriDate[0] = parseInt(new Date(app_report.REPORT_GLOBAL.session_currentDate.getFullYear(),
            app_report.REPORT_GLOBAL.session_currentDate.getMonth(),
            app_report.REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { month: 'numeric' }));
        app_report.REPORT_GLOBAL.session_currentHijriDate[1] = parseInt(new Date(app_report.REPORT_GLOBAL.session_currentDate.getFullYear(),
            app_report.REPORT_GLOBAL.session_currentDate.getMonth(),
            app_report.REPORT_GLOBAL.session_currentDate.getDate()).toLocaleDateString('en-us-u-ca-islamic', { year: 'numeric' }));
            APP_GLOBAL.timetable_type = '';
    
        //set initial default language from clients settings
        common.SearchAndSetSelectedIndex(navigator.language.toLowerCase(), document.querySelector('#setting_select_locale'),1);
        document.querySelector('#about_logo').style.backgroundImage=`url(${common.COMMON_GLOBAL.app_logo})`;
        //dialogues
        document.querySelector('#info_close').innerHTML = common.ICONS.app_close;
        document.querySelector('#scan_open_mobile_close').innerHTML = common.ICONS.app_close;
        document.querySelector('#scan_open_mobile_title1').innerHTML = common.ICONS.app_mobile;
        //profile info
        document.querySelector('#profile_main_btn_user_settings').innerHTML = common.ICONS.regional_day  + common.ICONS.regional_month + common.ICONS.regional_year;
        document.querySelector('#profile_main_btn_user_setting_likes_heart').innerHTML = common.ICONS.user_like;
        document.querySelector('#profile_main_btn_user_setting_likes_user_setting').innerHTML = common.ICONS.regional_day + common.ICONS.regional_month + common.ICONS.regional_year + common.ICONS.user_follows;
        document.querySelector('#profile_main_btn_user_setting_liked_heart').innerHTML = common.ICONS.user_like;
        document.querySelector('#profile_main_btn_user_setting_liked_user_setting').innerHTML = common.ICONS.regional_day + common.ICONS.regional_month + common.ICONS.regional_year + common.ICONS.user_followed;
    
        document.querySelector('#profile_user_settings_day').innerHTML = common.ICONS.regional_day;
        document.querySelector('#profile_user_settings_month').innerHTML = common.ICONS.regional_month;
        document.querySelector('#profile_user_settings_year').innerHTML = common.ICONS.regional_year;
        document.querySelector('#profile_user_settings_like').innerHTML = common.ICONS.user_unlike + common.ICONS.user_like;
    
        document.querySelector('#profile_user_settings_info_likes').innerHTML = common.ICONS.user_like + '<div id="profile_user_settings_info_like_count"></div>';
        document.querySelector('#profile_user_settings_info_views').innerHTML = common.ICONS.user_views + '<div id="profile_user_settings_info_view_count"></div>';
        //profile top
        document.querySelector('#profile_top_row2_1').innerHTML = common.ICONS.user_like + common.ICONS.regional_day  + common.ICONS.regional_month + common.ICONS.regional_year;
        document.querySelector('#profile_top_row2_2').innerHTML = common.ICONS.user_views + common.ICONS.regional_day  + common.ICONS.regional_month + common.ICONS.regional_year;
        //tab navigation
        document.querySelector('#tab_nav_btn_1').innerHTML = common.ICONS.regional;
        document.querySelector('#tab_nav_btn_2').innerHTML = common.ICONS.gps;
        document.querySelector('#tab_nav_btn_3').innerHTML = common.ICONS.misc_design;
        document.querySelector('#tab_nav_btn_4').innerHTML = common.ICONS.misc_image;
        document.querySelector('#tab_nav_btn_5').innerHTML = common.ICONS.misc_text;
        document.querySelector('#tab_nav_btn_6').innerHTML = common.ICONS.misc_prayer;
        //settings tab 1 Regional
        document.querySelector('#setting_icon_regional_locale').innerHTML = common.ICONS.regional_locale;
        document.querySelector('#setting_icon_regional_timezone_current').innerHTML = common.ICONS.regional_timezone + common.ICONS.gps_position;
        document.querySelector('#setting_icon_regional_timezone').innerHTML = common.ICONS.regional_timezone + common.ICONS.regional_calendar;
        document.querySelector('#setting_icon_regional_numbersystem').innerHTML = common.ICONS.regional_numbersystem;
        document.querySelector('#setting_icon_regional_direction').innerHTML = common.ICONS.regional_direction;
        document.querySelector('#setting_icon_regional_locale_second').innerHTML = common.ICONS.regional_locale + common.ICONS.misc_second;
        document.querySelector('#setting_icon_regional_coltitle').innerHTML = common.ICONS.misc_title;
        document.querySelector('#setting_icon_regional_arabic_script').innerHTML = common.ICONS.regional_script;
        document.querySelector('#setting_icon_regional_calendartype').innerHTML = common.ICONS.regional_calendar;
        document.querySelector('#setting_icon_regional_calendar_hijri_type').innerHTML = common.ICONS.regional_calendar_hijri_type;
        //settings tab 2 GPS
        document.querySelector('#setting_icon_gps_popular_place').innerHTML = common.ICONS.gps_popular_place;
        document.querySelector('#setting_icon_gps_place').innerHTML = common.ICONS.gps_position;
        //settings tab 3 Design
        document.querySelector('#setting_icon_design_theme_day').innerHTML = common.ICONS.regional_day;
        document.querySelector('#setting_icon_design_theme_month').innerHTML = common.ICONS.regional_month;
        document.querySelector('#setting_icon_design_theme_year').innerHTML = common.ICONS.regional_year;
        document.querySelector('#setting_icon_design_papersize').innerHTML = common.ICONS.app_papersize;
        document.querySelector('#setting_icon_design_highlight_row').innerHTML = common.ICONS.app_highlight;
        document.querySelector('#setting_icon_design_show_weekday').innerHTML = common.ICONS.app_show + common.ICONS.regional_weekday;
        document.querySelector('#setting_icon_design_show_calendartype').innerHTML = common.ICONS.app_show + common.ICONS.regional_calendartype;
        document.querySelector('#setting_icon_design_show_notes').innerHTML = common.ICONS.app_show + common.ICONS.app_notes;
        document.querySelector('#setting_icon_design_show_gps').innerHTML = common.ICONS.app_show + common.ICONS.gps_position;
        document.querySelector('#setting_icon_design_show_timezone').innerHTML = common.ICONS.app_show + common.ICONS.regional_timezone;
        //settings tab 4 Image
        document.querySelector('#setting_icon_image_header_clear').innerHTML = common.ICONS.app_remove;
        document.querySelector('#setting_icon_image_footer_clear').innerHTML = common.ICONS.app_remove;
        document.querySelector('#setting_icon_image_header_img').innerHTML = common.ICONS.app_search;
        document.querySelector('#setting_icon_image_footer_img').innerHTML = common.ICONS.app_search;    
        //settings tab 5 Text
        document.querySelector('#setting_icon_text_theme_day').innerHTML = common.ICONS.regional_day;
        document.querySelector('#setting_icon_text_theme_month').innerHTML = common.ICONS.regional_month;
        document.querySelector('#setting_icon_text_theme_year').innerHTML = common.ICONS.regional_year;
        document.querySelector('#setting_icon_text_header_aleft').innerHTML =  common.ICONS.app_align_left;
        document.querySelector('#setting_icon_text_header_acenter').innerHTML = common.ICONS.app_align_center;
        document.querySelector('#setting_icon_text_header_aright').innerHTML = common.ICONS.app_align_right;
        document.querySelector('#setting_icon_text_footer_aleft').innerHTML = common.ICONS.app_align_left;
        document.querySelector('#setting_icon_text_footer_acenter').innerHTML = common.ICONS.app_align_center;
        document.querySelector('#setting_icon_text_footer_aright').innerHTML = common.ICONS.app_align_right;
        //settings tab 6 Prayer
        document.querySelector('#setting_icon_prayer_method').innerHTML = common.ICONS.misc_book;
        document.querySelector('#setting_icon_prayer_asr').innerHTML = common.ICONS.misc_book + common.ICONS.sky_afternoon;
        document.querySelector('#setting_icon_prayer_highlatitude').innerHTML = common.ICONS.gps_high_latitude;
        document.querySelector('#setting_icon_prayer_timeformat').innerHTML = common.ICONS.regional_timeformat;
        document.querySelector('#setting_icon_prayer_hijri_adjustment').innerHTML = common.ICONS.app_settings + common.ICONS.regional_calendar;
        document.querySelector('#setting_icon_prayer_report_iqamat_title_fajr').innerHTML = common.ICONS.app_show + 
                                                                                            common.ICONS.misc_calling + 
                                                                                            common.ICONS.misc_prayer + 
                                                                                            common.ICONS.sky_sunrise;
        document.querySelector('#setting_icon_prayer_report_iqamat_title_dhuhr').innerHTML = common.ICONS.app_show + 
                                                                                             common.ICONS.misc_calling + 
                                                                                             common.ICONS.misc_prayer +
                                                                                             common.ICONS.sky_midday;
        document.querySelector('#setting_icon_prayer_report_iqamat_title_asr').innerHTML = common.ICONS.app_show + 
                                                                                           common.ICONS.misc_calling + 
                                                                                           common.ICONS.misc_prayer + 
                                                                                           common.ICONS.sky_afternoon;
        document.querySelector('#setting_icon_prayer_report_iqamat_title_maghrib').innerHTML = common.ICONS.app_show + 
                                                                                               common.ICONS.misc_calling + 
                                                                                               common.ICONS.misc_prayer + 
                                                                                               common.ICONS.sky_sunset;
        document.querySelector('#setting_icon_prayer_report_iqamat_title_isha').innerHTML = common.ICONS.app_show + 
                                                                                            common.ICONS.misc_calling + 
                                                                                            common.ICONS.misc_prayer + 
                                                                                            common.ICONS.sky_night;
        document.querySelector('#setting_icon_prayer_report_show_imsak').innerHTML = common.ICONS.app_show + 
                                                                                     common.ICONS.sky_sunrise + 
                                                                                     common.ICONS.misc_food;
        document.querySelector('#setting_icon_prayer_report_show_sunset').innerHTML = common.ICONS.app_show + 
                                                                                      common.ICONS.sky_sunset;
        document.querySelector('#setting_icon_prayer_report_show_midnight').innerHTML = common.ICONS.app_show +
                                                                                        common.ICONS.sky_midnight +
                                                                                        common.ICONS.misc_prayer;
        document.querySelector('#setting_icon_prayer_report_show_fast_start_end').innerHTML = common.ICONS.app_show + 
                                                                                              common.ICONS.misc_food +
                                                                                              common.ICONS.misc_ban;
        //settings tab 7 User settings
        document.querySelector('#setting_icon_user_settings').innerHTML = common.ICONS.app_settings + 
                                                                          common.ICONS.gps_position;
        document.querySelector('#setting_icon_user_url_day').innerHTML = common.ICONS.regional_day;
        document.querySelector('#setting_icon_user_url_month').innerHTML = common.ICONS.regional_month;
        document.querySelector('#setting_icon_user_url_year').innerHTML = common.ICONS.regional_year;
    
        document.querySelector('#user_day_html').innerHTML = common.ICONS.app_html;
        document.querySelector('#user_day_html_copy').innerHTML = common.ICONS.app_copy;
        document.querySelector('#user_day_pdf').innerHTML = common.ICONS.app_pdf;
        document.querySelector('#user_day_pdf_copy').innerHTML = common.ICONS.app_copy;
        document.querySelector('#user_month_html').innerHTML = common.ICONS.app_html;
        document.querySelector('#user_month_html_copy').innerHTML = common.ICONS.app_copy;
        document.querySelector('#user_month_pdf').innerHTML = common.ICONS.app_pdf;
        document.querySelector('#user_month_pdf_copy').innerHTML = common.ICONS.app_copy;
        document.querySelector('#user_year_html').innerHTML = common.ICONS.app_html;
        document.querySelector('#user_year_html_copy').innerHTML = common.ICONS.app_copy;
        document.querySelector('#user_year_pdf').innerHTML = common.ICONS.app_pdf;
        document.querySelector('#user_year_pdf_copy').innerHTML = common.ICONS.app_copy;
    
        document.querySelector('#setting_btn_user_save').innerHTML = common.ICONS.app_save;
        document.querySelector('#setting_btn_user_add').innerHTML = common.ICONS.app_add;
        document.querySelector('#setting_btn_user_delete').innerHTML = common.ICONS.app_delete;
        
        //toolbar bottom
        document.querySelector('#toolbar_btn_about').innerHTML = common.ICONS.app_info;
        document.querySelector('#toolbar_btn_print').innerHTML = common.ICONS.app_print;
        document.querySelector('#toolbar_btn_day').innerHTML = common.ICONS.regional_day;
        document.querySelector('#toolbar_btn_month').innerHTML = common.ICONS.regional_month;
        document.querySelector('#toolbar_btn_year').innerHTML = common.ICONS.regional_year;
        document.querySelector('#toolbar_btn_settings').innerHTML = common.ICONS.app_settings;
        //toolbar top
        document.querySelector('#common_user_menu_default_avatar').innerHTML = common.ICONS.user_avatar;
        document.querySelector('#toolbar_btn_zoomout').innerHTML = common.ICONS.app_zoomout;
        document.querySelector('#toolbar_btn_zoomin').innerHTML = common.ICONS.app_zoomin;
        document.querySelector('#toolbar_btn_left').innerHTML = common.ICONS.app_left;
        document.querySelector('#toolbar_btn_right').innerHTML = common.ICONS.app_right;
        document.querySelector('#toolbar_btn_search').innerHTML = common.ICONS.app_search;
        //user menu dropdown
        document.querySelector('#common_user_menu_dropdown_log_in').innerHTML = common.ICONS.app_login;
        document.querySelector('#common_user_menu_dropdown_log_out').innerHTML =common.ICONS.app_logoff;
        document.querySelector('#common_user_menu_dropdown_signup').innerHTML = common.ICONS.app_signup;
        document.querySelector('#common_user_menu_dropdown_edit').innerHTML = common.ICONS.app_edit;
        
        //themes from client server generation
        document.querySelector('#slider_prev_day').innerHTML = common.ICONS.app_slider_left;
        document.querySelector('#slider_next_day').innerHTML =  common.ICONS.app_slider_right;
        document.querySelector('#slider_prev_month').innerHTML = common.ICONS.app_slider_left;
        document.querySelector('#slider_next_month').innerHTML = common.ICONS.app_slider_right;
        document.querySelector('#slider_prev_year').innerHTML = common.ICONS.app_slider_left;
        document.querySelector('#slider_next_year').innerHTML = common.ICONS.app_slider_right;
        
        //set about info
        document.querySelector('#app_copyright').innerHTML = APP_GLOBAL.app_copyright;
        if (APP_GLOBAL.info_social_link1_url!=null)
            document.querySelector('#social_link1').innerHTML = `<a href=${APP_GLOBAL.info_social_link1_url} target='_blank'>${APP_GLOBAL.info_social_link1_icon}</a>`;
        if (APP_GLOBAL.info_social_link2_url!=null)
            document.querySelector('#social_link2').innerHTML = `<a href=${APP_GLOBAL.info_social_link2_url} target='_blank'>${APP_GLOBAL.info_social_link2_icon}</a>`;
        if (APP_GLOBAL.info_social_link3_url!=null)
            document.querySelector('#social_link3').innerHTML = `<a href=${APP_GLOBAL.info_social_link3_url} target='_blank'>${APP_GLOBAL.info_social_link3_icon}</a>`;
        if (APP_GLOBAL.info_social_link4_url!=null)
            document.querySelector('#social_link4').innerHTML = `<a href=${APP_GLOBAL.info_social_link4_url} target='_blank'>${APP_GLOBAL.info_social_link4_icon}</a>`;
        document.querySelector('#info_link1').innerHTML = APP_GLOBAL.info_link_policy_name;
        document.querySelector('#info_link2').innerHTML = APP_GLOBAL.info_link_disclaimer_name;
        document.querySelector('#info_link3').innerHTML = APP_GLOBAL.info_link_terms_name;
        document.querySelector('#info_link4').innerHTML = APP_GLOBAL.info_link_about_name;
    
        //set default geolocation
        document.querySelector('#setting_select_popular_place').selectedIndex = 0;
        document.querySelector('#setting_input_lat').value = common.COMMON_GLOBAL.client_latitude;
        document.querySelector('#setting_input_long').value = common.COMMON_GLOBAL.client_longitude;
        //load themes in Design tab
        load_themes();
        //set papersize
        zoom_paper();
        //set events
        setEvents();
        //user interface font depending selected arabic script in user preference, not in settings
        //dispatch event in common after events har defined above
        document.querySelector('#common_user_arabic_script_select').dispatchEvent(new Event('change'));
        //set timers
        //set current date and time for current locale and timezone
        clearInterval(showcurrenttime);
        setInterval(showcurrenttime, 1000);
        //set report date and time for current locale, report timezone
        clearInterval(showreporttime);
        setInterval(showreporttime, 1000);
        //show dialogue about using mobile and scan QR code after 5 seconds
        setTimeout(() => {show_dialogue('SCAN');}, 5000);
        
        //Start of app:
        //1.set_prayer_method
        //2.set default settings
        //3.translate ui
        //4.display default timetable settings
        //5.show profile if user in url
        //6.user provider login
        //7.service worker
        app_report.set_prayer_method().then(() => {
            set_default_settings().then(() => {
                settings_translate(true).then(() => {
                    settings_translate(false).then(() => {
                        const show_start = async () => {
                            //show default startup
                            toolbar_button(APP_GLOBAL.app_default_startup_page);
                            const user = window.location.pathname.substring(1);
                            if (user !='') {
                                //show profile for user entered in url
                                document.querySelector('#common_dialogue_profile').style.visibility = 'visible';
                                profile_show_app(null, user);
                            }
                        };
                        show_start().then(() => {
                            dialogue_loading(0);
                            serviceworker();
                            if (common.COMMON_GLOBAL.user_locale != navigator.language.toLowerCase())
                                common_translate_ui_app(common.COMMON_GLOBAL.user_locale, ()=>{
                                    resolve();
                                });
                            else
                                resolve();
                        });
                    });
                });
            });
        });
    });    
};
const init = (parameters) => {
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        for (const parameter of parameters.app) {
            if (parameter.parameter_name=='APP_COPYRIGHT'){
                APP_GLOBAL.app_copyright = parameter.parameter_value;
                app_report.REPORT_GLOBAL.app_copyright = parameter.parameter_value;
            }
            if (parameter.parameter_name=='APP_DEFAULT_STARTUP_PAGE')
                APP_GLOBAL.app_default_startup_page = parseInt(parameter.parameter_value);
            if (parameter.parameter_name=='APP_REPORT_TIMETABLE')
                APP_GLOBAL.app_report_timetable = parameter.parameter_value; 
            if (parameter.parameter_name=='INFO_EMAIL_POLICY')
                APP_GLOBAL.info_email_policy = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_EMAIL_DISCLAIMER')
                APP_GLOBAL.info_email_disclaimer = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_EMAIL_TERMS')
                APP_GLOBAL.info_email_terms = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_SOCIAL_LINK1_URL')
                APP_GLOBAL.info_social_link1_url = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_SOCIAL_LINK2_URL')
                APP_GLOBAL.info_social_link2_url = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_SOCIAL_LINK3_URL')
                APP_GLOBAL.info_social_link3_url = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_SOCIAL_LINK4_URL')
                APP_GLOBAL.info_social_link4_url = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_SOCIAL_LINK1_ICON')
                APP_GLOBAL.info_social_link1_icon = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_SOCIAL_LINK2_ICON')
                APP_GLOBAL.info_social_link2_icon = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_SOCIAL_LINK3_ICON')
                APP_GLOBAL.info_social_link3_icon = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_SOCIAL_LINK4_ICON')
                APP_GLOBAL.info_social_link4_icon = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_LINK_POLICY_URL')
                APP_GLOBAL.info_link_policy_url = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_LINK_DISCLAIMER_URL')
                APP_GLOBAL.info_link_disclaimer_url = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_LINK_TERMS_URL')
                APP_GLOBAL.info_link_terms_url = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_LINK_ABOUT_URL')
                APP_GLOBAL.info_link_about_url = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_LINK_POLICY_NAME')
                APP_GLOBAL.info_link_policy_name = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_LINK_DISCLAIMER_NAME')
                APP_GLOBAL.info_link_disclaimer_name = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_LINK_TERMS_NAME')
                APP_GLOBAL.info_link_terms_name = parameter.parameter_value;
            if (parameter.parameter_name=='INFO_LINK_ABOUT_NAME')
                APP_GLOBAL.info_link_about_name = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_CALENDAR_LANG')
                app_report.REPORT_GLOBAL.regional_def_calendar_lang = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_PREFIX')
                app_report.REPORT_GLOBAL.regional_def_locale_ext_prefix = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM')
                app_report.REPORT_GLOBAL.regional_def_locale_ext_number_system = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR')
                app_report.REPORT_GLOBAL.regional_def_locale_ext_calendar = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_CALENDAR_TYPE_GREG')
                app_report.REPORT_GLOBAL.regional_def_calendar_type_greg = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM')
                app_report.REPORT_GLOBAL.regional_def_calendar_number_system = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_DIRECTION')
                APP_GLOBAL.regional_default_direction = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_LOCALE_SECOND')
                APP_GLOBAL.regional_default_locale_second = parseInt(parameter.parameter_value);
            if (parameter.parameter_name=='REGIONAL_DEFAULT_COLTITLE')
                APP_GLOBAL.regional_default_coltitle = parseInt(parameter.parameter_value);
            if (parameter.parameter_name=='REGIONAL_DEFAULT_ARABIC_SCRIPT')
                APP_GLOBAL.regional_default_arabic_script = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_CALENDARTYPE')
                APP_GLOBAL.regional_default_calendartype = parameter.parameter_value;
            if (parameter.parameter_name=='REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE')
                APP_GLOBAL.regional_default_calendar_hijri_type = parameter.parameter_value;
            if (parameter.parameter_name=='GPS_DEFAULT_PLACE_ID')
                APP_GLOBAL.gps_default_place_id = parameter.parameter_value;
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_CONTAINER')
                APP_GLOBAL.gps_module_leaflet_container = parameter.parameter_value;
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_TITLE')
                APP_GLOBAL.gps_module_leaflet_qibbla_title = parameter.parameter_value;
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_TEXT_SIZE')
                APP_GLOBAL.gps_module_leaflet_qibbla_text_size = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_LAT')
                APP_GLOBAL.gps_module_leaflet_qibbla_lat = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_LONG')
                APP_GLOBAL.gps_module_leaflet_qibbla_long = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_COLOR')
                APP_GLOBAL.gps_module_leaflet_qibbla_color = parameter.parameter_value;
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_WIDTH')
                APP_GLOBAL.gps_module_leaflet_qibbla_width = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OPACITY')
                APP_GLOBAL.gps_module_leaflet_qibbla_opacity = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_TITLE')
                APP_GLOBAL.gps_module_leaflet_qibbla_old_title = parameter.parameter_value;
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_TEXT_SIZE')
                APP_GLOBAL.gps_module_leaflet_qibbla_old_text_size = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_LAT')
                APP_GLOBAL.gps_module_leaflet_qibbla_old_lat = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_LONG')
                APP_GLOBAL.gps_module_leaflet_qibbla_old_long = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_COLOR')
                APP_GLOBAL.gps_module_leaflet_qibbla_old_color = parameter.parameter_value;
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_WIDTH')
                APP_GLOBAL.gps_module_leaflet_qibbla_old_width = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='GPS_MODULE_LEAFLET_QIBBLA_OLD_OPACITY')
                APP_GLOBAL.gps_module_leaflet_qibbla_old_opacity = parseFloat(parameter.parameter_value);
            if (parameter.parameter_name=='DESIGN_DEFAULT_THEME_DAY')
                APP_GLOBAL.design_default_theme_day = parameter.parameter_value;
            if (parameter.parameter_name=='DESIGN_DEFAULT_THEME_MONTH')
                APP_GLOBAL.design_default_theme_month = parameter.parameter_value;
            if (parameter.parameter_name=='DESIGN_DEFAULT_THEME_YEAR')
                APP_GLOBAL.design_default_theme_year = parameter.parameter_value;
            if (parameter.parameter_name=='DESIGN_DEFAULT_PAPERSIZE')
                APP_GLOBAL.design_default_papersize = parameter.parameter_value;
            if (parameter.parameter_name=='DESIGN_DEFAULT_HIGHLIGHT_ROW')
                APP_GLOBAL.design_default_highlight_row = parseInt(parameter.parameter_value);
            if (parameter.parameter_name=='DESIGN_DEFAULT_SHOW_WEEKDAY')
                APP_GLOBAL.design_default_show_weekday = (parameter.parameter_value=== 'true');
            if (parameter.parameter_name=='DESIGN_DEFAULT_SHOW_CALENDARTYPE')
                APP_GLOBAL.design_default_show_calendartype = (parameter.parameter_value=== 'true');
            if (parameter.parameter_name=='DESIGN_DEFAULT_SHOW_NOTES')
                APP_GLOBAL.design_default_show_notes = (parameter.parameter_value=== 'true');
            if (parameter.parameter_name=='DESIGN_DEFAULT_SHOW_GPS')
                APP_GLOBAL.design_default_show_gps = (parameter.parameter_value=== 'true');
            if (parameter.parameter_name=='DESIGN_DEFAULT_SHOW_TIMEZONE')
                APP_GLOBAL.design_default_show_timezone = (parameter.parameter_value=== 'true');
            if (parameter.parameter_name=='TEXT_DEFAULT_REPORTTITLE1')
                APP_GLOBAL.text_default_reporttitle1 = parameter.parameter_value;
            if (parameter.parameter_name=='TEXT_DEFAULT_REPORTTITLE2')
                APP_GLOBAL.text_default_reporttitle2 = parameter.parameter_value;
            if (parameter.parameter_name=='TEXT_DEFAULT_REPORTTITLE3')
                APP_GLOBAL.text_default_reporttitle3 = parameter.parameter_value;
            if (parameter.parameter_name=='TEXT_DEFAULT_REPORTFOOTER1')
                APP_GLOBAL.text_default_reportfooter1 = parameter.parameter_value;
            if (parameter.parameter_name=='TEXT_DEFAULT_REPORTFOOTER2')
                APP_GLOBAL.text_default_reportfooter2 = parameter.parameter_value;
            if (parameter.parameter_name=='TEXT_DEFAULT_REPORTFOOTER3')
                APP_GLOBAL.text_default_reportfooter3 = parameter.parameter_value;
            if (parameter.parameter_name=='IMAGE_HEADER_FOOTER_WIDTH')
                APP_GLOBAL.image_header_footer_width = parameter.parameter_value;
            if (parameter.parameter_name=='IMAGE_HEADER_FOOTER_HEIGHT')
                APP_GLOBAL.image_header_footer_height = parameter.parameter_value;
            if (parameter.parameter_name=='IMAGE_DEFAULT_REPORT_HEADER_SRC'){
                if (parameter.parameter_value!='')
                    APP_GLOBAL.image_default_report_header_src = parameter.parameter_value;
            }                    
            if (parameter.parameter_name=='IMAGE_DEFAULT_REPORT_FOOTER_SRC'){
                if (parameter.parameter_value!='')
                    APP_GLOBAL.image_default_report_footer_src = parameter.parameter_value;
            }                             
            if (parameter.parameter_name=='PRAYER_DEFAULT_METHOD')
                APP_GLOBAL.prayer_default_method = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_ASR')
                APP_GLOBAL.prayer_default_asr = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_HIGHLATITUDE')
                APP_GLOBAL.prayer_default_highlatitude = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_TIMEFORMAT')
                APP_GLOBAL.prayer_default_timeformat = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_HIJRI_ADJUSTMENT')
                APP_GLOBAL.prayer_default_hijri_adjustment = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_FAJR')
                APP_GLOBAL.prayer_default_iqamat_title_fajr = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR')
                APP_GLOBAL.prayer_default_iqamat_title_dhuhr = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_ASR')
                APP_GLOBAL.prayer_default_iqamat_title_asr = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB')
                APP_GLOBAL.prayer_default_iqamat_title_maghrib = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_IQAMAT_TITLE_ISHA')
                APP_GLOBAL.prayer_default_iqamat_title_isha = parameter.parameter_value;
            if (parameter.parameter_name=='PRAYER_DEFAULT_SHOW_IMSAK')
                APP_GLOBAL.prayer_default_show_imsak = (parameter.parameter_value=== 'true');
            if (parameter.parameter_name=='PRAYER_DEFAULT_SHOW_SUNSET')
                APP_GLOBAL.prayer_default_show_sunset = (parameter.parameter_value=== 'true');
            if (parameter.parameter_name=='PRAYER_DEFAULT_SHOW_MIDNIGHT')
                APP_GLOBAL.prayer_default_show_midnight = (parameter.parameter_value=== 'true');
            if (parameter.parameter_name=='PRAYER_DEFAULT_SHOW_FAST_START_END')
                APP_GLOBAL.prayer_default_show_fast_start_end = parameter.parameter_value;
            if (parameter.parameter_name=='MODULE_EASY.QRCODE_WIDTH')
                common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(parameter.parameter_value);
            if (parameter.parameter_name=='MODULE_EASY.QRCODE_HEIGHT')
                common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(parameter.parameter_value);
            if (parameter.parameter_name=='MODULE_EASY.QRCODE_COLOR_DARK')
                common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = parameter.parameter_value;
            if (parameter.parameter_name=='MODULE_EASY.QRCODE_COLOR_LIGHT')
                common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = parameter.parameter_value;
            if (parameter.parameter_name=='MODULE_EASY.QRCODE_BACKGROUND_COLOR')
                common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = parameter.parameter_value;
        }
        init_app();   
    });
};
export{ /**GLOBAL */
        APP_GLOBAL,
        /*REPORT*/
        printTable, getReportSettings, update_timetable_report, get_report_url,
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
        /*INIT*/
        init_app, init};