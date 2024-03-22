/**@type{{body:{className:string},
 *        querySelector:function,
 *        querySelectorAll:function}} */
 const AppDocument = document;

/**
 * @typedef {object}        AppEvent
 * @property {string}       code
 * @property {function}     preventDefault
 * @property {function}     stopPropagation
 * @property {{ id:                 string,
 *              innerHTML:          string,
 *              value:              string,
 *              focus:              function,
 *              dispatchEvent:      function,
 *              parentNode:         HTMLElement,
 *              options:            HTMLOptionsCollection,
 *              selectedIndex:      number,
 *              classList:          {contains:function}
 *              className:          string
 *            }}  target
 * @typedef {{  originalEvent:AppEvent,
 *              latlng:{lat:string, 
 *                      lng:string}}} AppEventLeaflet
 */
 
/**@ts-ignore */
const common = await import('common');
/**@ts-ignore */
const app_report = await import('app_report');
/**@ts-ignore */
const {default:prayTimes} = await import('PrayTimes');
/**@ts-ignore */
const {getTimezone} = await import('regional');

const APP_GLOBAL = {
    app_default_startup_page:0,
    app_report_timetable:'',

    regional_default_direction:'',
    regional_default_locale_second:0,
    regional_default_coltitle:0,
    regional_default_arabic_script:'',
    regional_default_calendartype:'',
    regional_default_calendar_hijri_type:'',

    gps_default_place_id:0,
    gps_module_leaflet_container:'',
    gps_module_leaflet_qibbla_title:'',
    gps_module_leaflet_qibbla_text_size:0,
    gps_module_leaflet_qibbla_lat:0,
    gps_module_leaflet_qibbla_long:0,
    gps_module_leaflet_qibbla_color:'',
    gps_module_leaflet_qibbla_width:0,
    gps_module_leaflet_qibbla_opacity:0,
    gps_module_leaflet_qibbla_old_title:'',
    gps_module_leaflet_qibbla_old_text_size:0,
    gps_module_leaflet_qibbla_old_lat:0,
    gps_module_leaflet_qibbla_old_long:0,
    gps_module_leaflet_qibbla_old_color:'',
    gps_module_leaflet_qibbla_old_width:0,
    gps_module_leaflet_qibbla_old_opacity:0,

    design_default_theme_day:'',
    design_default_theme_month:'',
    design_default_theme_year:'',
    design_default_papersize:'',
    design_default_highlight_row:0,
    design_default_show_weekday:false,
    design_default_show_calendartype:false,
    design_default_show_notes:false,
    design_default_show_gps:false,
    design_default_show_timezone:false,

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
    prayer_default_show_imsak:false,
    prayer_default_show_sunset:false,
    prayer_default_show_midnight:false,
    prayer_default_show_fast_start_end:'',

    //session variables
    timetable_type:0
};
Object.seal(APP_GLOBAL);
/**
 * Print timetable
 * @returns {Promise.<void>}
 */
const printTimetable = async () => {
    const whatToPrint = AppDocument.querySelector('#paper');
	const html = `<!DOCTYPE html>
			<html>
			<head>
				<meta charset='UTF-8'>
				<title></title>
                <link rel='stylesheet' type='text/css' href='/css/app_report.css' />
                <link rel='stylesheet' type='text/css' href='/common/css/common.css' />
			</head>
			<body id="printbody">
				${whatToPrint.outerHTML}
			</body>
			</html>`;
	
    await common.ComponentRender('common_window_info', {  info:3,
                                                    url:null, 
                                                    content_type:null, 
                                                    iframe_content:html,
                                                    frame:window.frames.document, 
                                                    mobile_function:common.mobile}, '/common/component/window_info.js')
    .then(()=>common.ComponentRemove('common_window_info'));
};
/**
 * Get report settings
 * @returns {object}
 */
const getReportSettings = () => {
    return {    locale              	: AppDocument.querySelector('#setting_select_locale').value,  
                timezone            	: AppDocument.querySelector('#setting_select_report_timezone').value,
                number_system       	: AppDocument.querySelector('#setting_select_report_numbersystem').value,
                direction           	: AppDocument.querySelector('#setting_select_report_direction').value,
                second_locale       	: AppDocument.querySelector('#setting_select_report_locale_second').value,
                arabic_script       	: AppDocument.querySelector('#setting_select_report_arabic_script').value,
                calendartype        	: AppDocument.querySelector('#setting_select_calendartype').value,
                calendar_hijri_type 	: AppDocument.querySelector('#setting_select_calendar_hijri_type').value,

                place               	: AppDocument.querySelector('#setting_input_place').innerHTML,
                gps_lat             	: parseFloat(AppDocument.querySelector('#setting_input_lat').innerHTML),
                gps_long            	: parseFloat(AppDocument.querySelector('#setting_input_long').innerHTML),

                theme_day           	: 'theme_day_' + get_theme_id('day'),
                theme_month         	: 'theme_month_' + get_theme_id('month'),
                theme_year          	: 'theme_year_' + get_theme_id('year'),
                coltitle            	: AppDocument.querySelector('#setting_select_report_coltitle').value,
                highlight           	: AppDocument.querySelector('#setting_select_report_highlight_row').value,
                show_weekday        	: Number(AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.contains('checked')),
                show_calendartype   	: Number(AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.contains('checked')),
                show_notes          	: Number(AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.contains('checked')),
                show_gps   	       		: Number(AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.contains('checked')),
                show_timezone       	: Number(AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.contains('checked')),
                
                header_img_src      	: AppDocument.querySelector('#setting_reportheader_img').src == ''?null:AppDocument.querySelector('#setting_reportheader_img').src,
				footer_img_src      	: AppDocument.querySelector('#setting_reportfooter_img').src == ''?null:AppDocument.querySelector('#setting_reportfooter_img').src,

                header_txt1         	: AppDocument.querySelector('#setting_input_reportheader1').innerHTML,
                header_txt2         	: AppDocument.querySelector('#setting_input_reportheader2').innerHTML,
                header_txt3         	: AppDocument.querySelector('#setting_input_reportheader3').innerHTML,
                //button is active set left, center or right true/false
                header_align            : get_align(AppDocument.querySelector('#setting_icon_text_header_aleft').classList.contains('setting_button_active'), 
                                                    AppDocument.querySelector('#setting_icon_text_header_acenter').classList.contains('setting_button_active'), 
                                                    AppDocument.querySelector('#setting_icon_text_header_aright').classList.contains('setting_button_active')),
                footer_txt1         	: AppDocument.querySelector('#setting_input_reportfooter1').innerHTML,
                footer_txt2         	: AppDocument.querySelector('#setting_input_reportfooter2').innerHTML,
                footer_txt3    	   		: AppDocument.querySelector('#setting_input_reportfooter3').innerHTML,
                //button is active set left, center or right true/false
                footer_align            : get_align(AppDocument.querySelector('#setting_icon_text_footer_aleft').classList.contains('setting_button_active'),
                                                    AppDocument.querySelector('#setting_icon_text_footer_acenter').classList.contains('setting_button_active'),
                                                    AppDocument.querySelector('#setting_icon_text_footer_aright').classList.contains('setting_button_active')),
                
                method              	: AppDocument.querySelector('#setting_select_method').value,
                asr                 	: AppDocument.querySelector('#setting_select_asr').value,
                highlat             	: AppDocument.querySelector('#setting_select_highlatitude').value,
                format              	: AppDocument.querySelector('#setting_select_timeformat').value,
                hijri_adj           	: Number(AppDocument.querySelector('#setting_select_hijri_adjustment').value),
                iqamat_fajr         	: AppDocument.querySelector('#setting_select_report_iqamat_title_fajr').value,
                iqamat_dhuhr        	: AppDocument.querySelector('#setting_select_report_iqamat_title_dhuhr').value,
                iqamat_asr          	: AppDocument.querySelector('#setting_select_report_iqamat_title_asr').value,
                iqamat_maghrib      	: AppDocument.querySelector('#setting_select_report_iqamat_title_maghrib').value,
                iqamat_isha         	: AppDocument.querySelector('#setting_select_report_iqamat_title_isha').value,
                show_imsak          	: Number(AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.contains('checked')),
                show_sunset         	: Number(AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.contains('checked')),
                show_midnight       	: Number(AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.contains('checked')),
                show_fast_start_end 	: Number(AppDocument.querySelector('#setting_select_report_show_fast_start_end').value),
                
                timetable_class			: 'timetable_class',
                timetable_month         : 'timetable_month_class', //class to add for month
                timetable_year_month    : 'timetable_year_month', //class to add for year
                reporttype_year_month 	: 'MONTH',  //default MONTH: normal month with more info, 
                                                    //YEAR: month with less info
                
                ui_navigation_left      : 'toolbar_btn_left',
                ui_navigation_right     : 'toolbar_btn_right'};
};
/**
 * Timetable update
 * @param {number} timetable_type 
 * @param {string|null} item_id 
 * @param {object} settings 
 * @returns {Promise.<void>}
 */
const update_timetable_report = async (timetable_type = 0, item_id = null, settings) => {
    APP_GLOBAL.timetable_type = timetable_type;
    switch (timetable_type){
        //create timetable month or day or year if they are visible instead
        case 0:{
            //update user settings to current select option 
            set_settings_select();
            const select_user_settings = AppDocument.querySelector('#setting_select_user_setting');
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
            AppDocument.querySelector('#paper').innerHTML = app_report.displayDay(prayTimes, settings, item_id, current_user_settings);
            await common.create_qr('timetable_qr_code', common.getHostname());
            break;
        }
        //1=create timetable month
        case 1:{
            AppDocument.querySelector('#paper').innerHTML = app_report.displayMonth(prayTimes, settings, item_id);
            await common.create_qr('timetable_qr_code', common.getHostname());
            break;
        }
        //2=create timetable year
        case 2:{
            AppDocument.querySelector('#paper').innerHTML = app_report.displayYear(prayTimes, settings, item_id);
            await common.create_qr('timetable_qr_code', common.getHostname());
            break;
        }
        default:{
            break;
        }
    }
};
/**
 * Get report url
 * @param {number} id 
 * @param {number} sid 
 * @param {string} papersize 
 * @param {string} item 
 * @param {string} format 
 * @param {boolean} profile_display 
 * @returns {string}
 */
const get_report_url = (id, sid, papersize, item, format, profile_display=true) => {
    const report_module = `module=${APP_GLOBAL.app_report_timetable}`;
    let module_parameters = `&id=${id}&sid=${sid}`;
    if (item =='profile_user_settings_day' || item.substr(0,8)=='user_day')
        module_parameters += '&type=0';
    if (item =='profile_user_settings_month' || item.substr(0,10)=='user_month')
        module_parameters += '&type=1';
    if (item == 'profile_user_settings_year' || item.substr(0,9)=='user_year')
        module_parameters += '&type=2';
    if (profile_display){
        //send viewing user account id if logged in or set empty
        const uid_view = common.COMMON_GLOBAL.user_account_id==null?'':common.COMMON_GLOBAL.user_account_id;
        module_parameters += `&uid_view=${uid_view}`;
    }
    const language_parameter = `&lang_code=${common.COMMON_GLOBAL.user_locale}`;
    const service_parameter = `&format=${format}&ps=${papersize}&hf=0`; //html/pdf, papersize, header/footer
    const encodedurl = common.toBase64( report_module +
                                        module_parameters + 
                                        language_parameter +
                                        service_parameter);
    //url query parameters are decoded in report module and in report service
    return common.getHostname() + `/reports?reportid=${encodedurl}`;
};

/**
 * Update all timetables and theme thumbnails
 * @returns {Promise.<void>}
 */
const update_all_theme_thumbnails = async () => {
    await update_timetable_report(0, null, getReportSettings());
    update_theme_thumbnail('day');
    await update_timetable_report(1, null, getReportSettings());
    update_theme_thumbnail('month');
    await update_timetable_report(2, null, getReportSettings());
    update_theme_thumbnail('year');
};
/**
 * Update theme thumbnail
 * @param {string} theme_type 
 * @returns {void}
 */
const update_theme_thumbnail = theme_type => {
    const thumbnail = AppDocument.querySelectorAll(`#slides_${theme_type} .slide .slider_active_${theme_type}`)[0];
    //copy paper div with current papersize class to a new div with paper class
    thumbnail.innerHTML =  `<div class='paper ${AppDocument.querySelector('#paper').className}'>
                    ${AppDocument.querySelector('#paper').innerHTML}
                    </div>` ;
    const new_theme_id = thumbnail.getAttribute('data-theme_id');
    const old_theme = thumbnail.querySelectorAll('.timetable_class')[0].className.split(' ').filter((/**@type{string}*/themeclass)=>themeclass.startsWith(`theme_${theme_type}`))[0];
    thumbnail.querySelectorAll('.timetable_class')[0].classList.remove(old_theme);
    thumbnail.querySelectorAll('.timetable_class')[0].classList.add('theme_'  + theme_type + '_' + new_theme_id);
};
/**
 * Get theme id
 * @param {string} type 
 * @returns {string}
 */
const get_theme_id = type => {
    const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
    if (AppDocument.querySelectorAll('.slider_active_' + type)[0])
        return AppDocument.querySelectorAll('.slider_active_' + type)[0].getAttribute('data-theme_id');
    else
        return select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_' + type + '_id');
};
/**
 * Set theme id
 * @param {string} type 
 * @param {string} theme_id 
 * @returns {void}
 */
const set_theme_id = (type, theme_id) => {
    const slides = AppDocument.querySelectorAll(`#setting_themes_${type}_slider .slide div`);
    let i=0;
    for (const slide of slides) {
        if (slide.getAttribute('data-theme_id') == theme_id) {
            //remove active class from current theme
            AppDocument.querySelectorAll('.slider_active_' + type)[0].classList.remove('slider_active_' + type);
            //set active class on found theme
            slide.classList.add('slider_active_' + type);
            //update preview image to correct theme
            AppDocument.querySelector('#slides_' + type).style.left = (-96 * (i)).toString() + 'px';
            set_theme_title(type);
            break;
        }
        i++;
    }
};
/**
 * Set theme title
 * @param {string} type 
 * @returns {void}
 */
const set_theme_title = type => {
    AppDocument.querySelector(`#slider_theme_${type}_id`).innerHTML =
        AppDocument.querySelector(`#theme_${type}_${get_theme_id(type)}`).getAttribute('data-theme_id');
};
/**
 * Load themes
 * @returns {void}
 */
const load_themes = () => {
    AppDocument.querySelector('#slides_day .slide div').classList.add('slider_active_day');
    set_theme_title('day');
    AppDocument.querySelector('#slides_month .slide div').classList.add('slider_active_month');
    set_theme_title('month');
    AppDocument.querySelector('#slides_year .slide div').classList.add('slider_active_year');
    set_theme_title('year');
};
/**
 * 
 * @param {number} nav 
 * @param {string} type 
 * @returns {Promise.<void>}
 */
const theme_nav = async (nav, type) => {
    let theme_index = 0;
    //get current index
    AppDocument.querySelectorAll(`#slides_${type} .slide_${type} > div`).forEach((/**@type{HTMLElement}*/e, /**@type{number}*/index) => {
        if (e.classList.contains(`slider_active_${type}`))
            theme_index = index;
    });
    //set next index
    if (nav == 1)
        if ((theme_index + 1) == AppDocument.querySelectorAll(`#slides_${type} .slide_${type}`).length)
            theme_index = 0;
        else
            theme_index++;
    else 
        if (nav == -1)
            if (theme_index == 0)
                theme_index = AppDocument.querySelectorAll(`#slides_${type} .slide_${type}`).length -1;
            else
                theme_index--;
    //remove old active theme class
    AppDocument.querySelectorAll(`.slider_active_${type}`)[0].classList.remove(`slider_active_${type}`);
    //add new active theme class
    AppDocument.querySelectorAll(`#slides_${type} .slide`)[theme_index].children[0].classList.add(`slider_active_${type}`);
    //set theme title
    set_theme_title(type);
    update_all_theme_thumbnails();
};

/**
 * Setting translate
 * @param {boolean} first 
 * @returns {Promise.<void>}
 */
const settings_translate = async (first=true) => {
    let locale;
    if (first ==true){
        locale = AppDocument.querySelector('#setting_select_locale').value;
        common.COMMON_GLOBAL.user_locale = locale;
    }
    else
        locale = AppDocument.querySelector('#setting_select_report_locale_second').value;
    if (locale != 0){
        //fetch any message with first language always
        //show translation using first or second language
        await common.FFB('DB_API', `/app_object?data_lang_code=${locale}&object_name=REPORT`, 'GET', 'APP_DATA', null)
        .then((/**@type{string}*/result)=>{
            for (const app_object_item of JSON.parse(result)){
                if (first==true)
                    app_report.REPORT_GLOBAL.first_language[app_object_item.object_item_name.toLowerCase()] = app_object_item.text;
                else
                    app_report.REPORT_GLOBAL.second_language[app_object_item.object_item_name.toLowerCase()] = app_object_item.text;
            }
            //if translating first language and second language is not used
            if (first == true &&
                AppDocument.querySelector('#setting_select_report_locale_second').value ==0){
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
        })
        .catch(()=>null);
    }
};
/**
 * Get horizontal alignment
 * @param {boolean} al 
 * @param {boolean} ac 
 * @param {boolean} ar 
 * @returns {string|null }
 */
const get_align = (al,ac,ar) => {
	if (al==true)
		return 'left';
	if (ac==true)
		return 'center';
	if (ar==true)
		return 'right';
	return null;
};
/**
 * Show current time for users timezone
 * @returns {void}
 */
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
    /**@ts-ignore */
    AppDocument.querySelector('#setting_current_date_time_display').innerHTML = new Date().toLocaleTimeString(common.COMMON_GLOBAL.user_locale, options);
};
/**
 * Show timetable time
 * @returns {void}
 */
const showreporttime = () => {

    const options = {
        timeZone: AppDocument.querySelector('#setting_select_report_timezone')[AppDocument.querySelector('#setting_select_report_timezone').selectedIndex].value,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };
    /**@ts-ignore */
    AppDocument.querySelector('#setting_report_date_time_display').innerHTML = new Date().toLocaleTimeString(AppDocument.querySelector('#setting_select_locale').value, options);
    //If day report created with time, display time there also
    if (AppDocument.querySelector('#timetable_day_time')) {
        AppDocument.querySelector('#timetable_day_time').innerHTML = AppDocument.querySelector('#setting_report_date_time_display').innerHTML;
    }
    if (AppDocument.querySelectorAll('.timetable_day_current_time').length > 0) {
        const user_current_time = AppDocument.querySelectorAll('.timetable_day_current_time');
        const select_user_settings = AppDocument.querySelector('#setting_select_user_setting');
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
            /**@ts-ignore */
            user_current_time[setting.index].innerHTML = new Date().toLocaleTimeString(user_locale, user_options);
        }
    }
};
/**
 * Toolbar button
 * @param {number} choice 
 * @returns {Promise.<void>}
 */
const toolbar_button = async (choice) => {
    const paper = AppDocument.querySelector('#paper');
    const settings = AppDocument.querySelector('#settings');

    switch (choice) {
        //print
        case 1:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                AppDocument.querySelector('#common_profile_btn_top').style.visibility='visible';
                printTimetable();
                break;
            }
        //day
        case 2:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                AppDocument.querySelector('#common_profile_btn_top').style.visibility='visible';
                await update_timetable_report(0, null, getReportSettings());
                break;
            }
        //month
        case 3:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                AppDocument.querySelector('#common_profile_btn_top').style.visibility='visible';
                await update_timetable_report(1, null, getReportSettings());
                break;
            }
        //year
        case 4:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                AppDocument.querySelector('#common_profile_btn_top').style.visibility='visible';
                await update_timetable_report(2, null, getReportSettings());
                break;
            }
        //settings
        case 5:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (common.mobile())
                    paper.style.display = 'none';
                AppDocument.querySelector('#common_profile_btn_top').style.visibility='hidden';
                settings.style.visibility = 'visible';

                if (AppDocument.querySelector('#tab_nav_1').classList.contains('tab_nav_selected'))
                    await update_settings_locale();
                if (AppDocument.querySelector('#tab_nav_3').classList.contains('tab_nav_selected'))
                    update_all_theme_thumbnails();
                break;
            }
        //profile
        case 6:
            {
                settings.style.visibility = 'hidden';
                common.ComponentRemove('common_dialogue_user_menu');
                profile_show_app(null,null);
                break;
            }
        //profile top
        case 7:
            {
                settings.style.visibility = 'hidden';
                common.ComponentRemove('common_dialogue_user_menu');
                profile_top_app(1, null, profile_show_app);
                break;
            }
    }
};
const update_settings_locale = async () =>{
    //get locales
    const select_locale = AppDocument.querySelector('#setting_select_locale');
    const select_second_locale = AppDocument.querySelector('#setting_select_report_locale_second'); 
    const current_locale = select_locale.value;
    const current_second_locale = select_second_locale.value;
    select_locale.innerHTML = await common.get_locales_options();
    select_locale.value = current_locale;
    select_second_locale.innerHTML = select_second_locale.options[0].outerHTML + select_locale.innerHTML;
    select_second_locale.value = current_second_locale;   
}
/**
 * Open navigation tab
 * @param {number} tab_selected 
 */
const openTab = async (tab_selected) => {
    //hide all tab content
    AppDocument.querySelectorAll('.tab_content').forEach((/**@type{HTMLElement}*/tab_content)=>tab_content.style.display = 'none');
    //remove mark for all tabs
    AppDocument.querySelectorAll('.tab_nav').forEach((/**@type{HTMLElement}*/tab)=>tab.classList.remove('tab_nav_selected'));
    //show active tab content
    AppDocument.querySelector('#tab' + tab_selected).style.display = 'block';
    //mark active tab
    AppDocument.querySelector('#tab_nav_' + tab_selected).classList.add('tab_nav_selected');
    
    switch (Number(tab_selected)){
        case 1:{
            await update_settings_locale();
            break;
        }
        case 2:{
            AppDocument.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).outerHTML = `<div id='${APP_GLOBAL.gps_module_leaflet_container}'></div>`;
            //init map thirdparty module
            init_map().then(()=>{
                update_ui(4);
                common.map_resize();
            });
            break;
        }
        case 3:{
            update_all_theme_thumbnails();
            break;
        }
        case 5:{
            AppDocument.querySelector('#setting_icon_text_theme_day').dispatchEvent(new Event('click'));
            break;
        }
    }
};
/**
 * Get alignment for button
 * @param {string} report_align_where 
 * @returns {string}
 */
const align_button_value = (report_align_where) => {

    if (AppDocument.querySelector('#setting_icon_text_' + report_align_where + '_aleft').classList.contains('setting_button_active'))
        return 'left';
    if (AppDocument.querySelector('#setting_icon_text_' + report_align_where + '_acenter').classList.contains('setting_button_active'))
        return 'center';
    if (AppDocument.querySelector('#setting_icon_text_' + report_align_where + '_aright').classList.contains('setting_button_active'))
        return 'right';
    return '';
};
/**
 * Dialogue loading
 * @param {number} visible 
 * @returns {void}
 */
const dialogue_loading = (visible) => {
    if (visible==1){
        AppDocument.querySelector('#dialogue_loading_content').classList.add('css_spinner');
        AppDocument.querySelector('#dialogue_loading').style.visibility='visible';
    }
    else{
        AppDocument.querySelector('#dialogue_loading_content').classList.remove('css_spinner');
        AppDocument.querySelector('#dialogue_loading').style.visibility='hidden';
    }
};
/**
 * Zoom paper
 * @param {number|null} zoomvalue 
 * @returns {void}
 */
const zoom_paper = (zoomvalue = null) => {
    let old;
    let old_scale;
    const div = AppDocument.querySelector('#paper');
    //called with null as argument at init() then used for zooming
    //even if css set, this property is not set at startup
    if (zoomvalue == null) {
        if (common.mobile())
            div.style.transform = 'scale(0.5)';
        else
            div.style.transform = 'scale(0.7)';
    } else {
        old = AppDocument.querySelector('#paper').style.transform;
        old_scale = parseFloat(old.substr(old.indexOf('(') + 1, old.indexOf(')') - 1));
        div.style.transform = 'scale(' + (old_scale + (zoomvalue / 10)) + ')';
    }
};
/**
 * Select get selectindex
 * @param {string} select 
 * @param {number} id 
 * @returns {number|null}
 */
const select_get_selectindex = (select, id) => {
    if (id == 0)
        return 0;
    else {
        const select_options = AppDocument.querySelector('#' + select).options;
        for (const select of select_options) {
            if (parseInt(select.getAttribute('id')) == id)
                return select.index;
        }
    }
    return null;
};
/**
 * Show dialogue
 * @param {*} dialogue 
 * @returns {void}
 */
const show_dialogue = (dialogue) => {
    if (dialogue == 'SCAN' && common.mobile()==false){
        AppDocument.querySelector('#dialogue_scan_open_mobile').style.visibility = 'visible';
                    common.create_qr('scan_open_mobile_qrcode', common.getHostname());
    }
};
/**
 * Update ui
 * @param {number} option 
 * @param {string|null} item_id 
 * @returns {Promise.<void>}
 */
const update_ui = async (option, item_id=null) => {
    const settings = {
        paper                   : AppDocument.querySelector('#paper'),
        timezone_report         : AppDocument.querySelector('#setting_select_report_timezone'),
        country                 : AppDocument.querySelector('#common_module_leaflet_select_country'),
        city                    : AppDocument.querySelector('#common_module_leaflet_select_city'),
        select_place            : AppDocument.querySelector('#setting_select_popular_place'),
        gps_lat_input           : AppDocument.querySelector('#setting_input_lat'),
        gps_long_input          : AppDocument.querySelector('#setting_input_long'),
        paper_size              : AppDocument.querySelector('#setting_select_report_papersize').value,
        reportheader_input      : AppDocument.querySelector('#setting_input_reportheader_img'),
        reportfooter_input      : AppDocument.querySelector('#setting_input_reportfooter_img'),
        header_preview_img_item : AppDocument.querySelector('#setting_reportheader_img'),
        footer_preview_img_item : AppDocument.querySelector('#setting_reportfooter_img'),
        button_active_class     : 'setting_button_active',
        reportheader_aleft      : AppDocument.querySelector('#setting_icon_text_header_aleft'),
        reportheader_acenter    : AppDocument.querySelector('#setting_icon_text_header_acenter'),
        reportheader_aright     : AppDocument.querySelector('#setting_icon_text_header_aright'),
        reportfooter_aleft      : AppDocument.querySelector('#setting_icon_text_footer_aleft'),
        reportfooter_acenter    : AppDocument.querySelector('#setting_icon_text_footer_acenter'),
        reportfooter_aright     : AppDocument.querySelector('#setting_icon_text_footer_aright'),
        select_user_setting     : AppDocument.querySelector('#setting_select_user_setting')
    };

    switch (option) {
        //Regional, timezone report
        case 2:
            {
                //Update report date and time for current locale, report timezone format
                /**@ts-ignore */
                clearInterval(showreporttime);
                setInterval(showreporttime, 1000);
                break;
            }
        //GPS, update map
        case 4:
            {
                map_update_app( settings.gps_long_input.innerHTML,
                                settings.gps_lat_input.innerHTML,
                                common.COMMON_GLOBAL.module_leaflet_zoom,
                                AppDocument.querySelector('#setting_input_place').innerHTML,
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
                    //fetch list including default option
                    settings.city.innerHTML = await common.get_cities(settings.country[settings.country.selectedIndex]
                                                    .getAttribute('country_code').toUpperCase());
                }
                break;
            }
        //GPS, city
        case 6:
            {                    
                //set GPS and timezone
                const longitude_selected = settings.city[settings.city.selectedIndex].getAttribute('longitude');
                const latitude_selected = settings.city[settings.city.selectedIndex].getAttribute('latitude');
                
                settings.gps_long_input.innerHTML = longitude_selected;
                settings.gps_lat_input.innerHTML = latitude_selected;

                //Use city + country from list
                AppDocument.querySelector('#setting_input_place').innerHTML =
                    settings.city.options[settings.city.selectedIndex].text + ', ' +
                    settings.country.options[settings.country.selectedIndex].text;
                //display empty popular place select
                common.SearchAndSetSelectedIndex('', settings.select_place,0);
                if (AppDocument.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).classList.contains('leaflet-container')){
                    //Update map
                    map_update_app(settings.gps_long_input.innerHTML,
                                    settings.gps_lat_input.innerHTML,
                                    common.COMMON_GLOBAL.module_leaflet_zoom_city,
                                    AppDocument.querySelector('#setting_input_place').innerHTML,
                                    null,
                                    common.COMMON_GLOBAL.module_leaflet_marker_div_city,
                                    common.COMMON_GLOBAL.module_leaflet_flyto)
                    .then((timezone_selected) => {
                        settings.timezone_report.value = timezone_selected;
                        //update country, city and timezone in settings
                        const option = AppDocument.querySelector('#setting_select_user_setting').options[AppDocument.querySelector('#setting_select_user_setting').selectedIndex];
                        option.setAttribute('gps_country_id', AppDocument.querySelector('#common_module_leaflet_select_country')[AppDocument.querySelector('#common_module_leaflet_select_country').selectedIndex].getAttribute('id'));
                        option.setAttribute('gps_city_id', AppDocument.querySelector('#common_module_leaflet_select_city')[AppDocument.querySelector('#common_module_leaflet_select_city').selectedIndex].getAttribute('id'));
                        option.setAttribute('regional_timezone', settings.timezone_report.value);
                    })
                }
                break;
            }
        //GPS, popular places
        case 7:
            {
                //set GPS and timezone
                const longitude_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('longitude');
                const latitude_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('latitude');
                const timezone_selected = settings.select_place[settings.select_place.selectedIndex].getAttribute('timezone');
                settings.gps_long_input.innerHTML = longitude_selected;
                settings.gps_lat_input.innerHTML = latitude_selected;
                if (AppDocument.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).classList.contains('leaflet-container')){
                    //Update map
                    map_update_app( settings.gps_long_input.innerHTML,
                                    settings.gps_lat_input.innerHTML,
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
                const option = AppDocument.querySelector('#setting_select_user_setting').options[AppDocument.querySelector('#setting_select_user_setting').selectedIndex];
                option.setAttribute('gps_country_id', '');
                option.setAttribute('gps_city_id', '');
                
                settings.timezone_report.value = timezone_selected;
                const title = settings.select_place.options[settings.select_place.selectedIndex].text;
                AppDocument.querySelector('#setting_input_place').innerHTML = title;
                break;
            }
        //GPS, updating place
        case 8:
            {
                common.map_update_popup(AppDocument.querySelector('#setting_input_place').innerHTML);
                break;
            }
        //GPS, position
        case 9:
            {
                common.SearchAndSetSelectedIndex('', settings.select_place,0);
                common.get_place_from_gps(settings.gps_long_input.innerHTML, settings.gps_lat_input.innerHTML).then((/**@type{string}*/gps_place) => {
                    //Update map
                    AppDocument.querySelector('#setting_input_place').innerHTML = gps_place;
                    if (AppDocument.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).classList.contains('leaflet-container')){
                        map_update_app( settings.gps_long_input.innerHTML,
                                        settings.gps_lat_input.innerHTML,
                                        null, //do not change zoom 
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
                if (AppDocument.querySelector('#' + item_id).classList.contains(settings.button_active_class)){
                    AppDocument.querySelector('#' + item_id).classList.remove(settings.button_active_class);
                }
                else{	
                    settings.reportheader_aleft.classList.remove(settings.button_active_class);
                    settings.reportheader_acenter.classList.remove(settings.button_active_class);
                    settings.reportheader_aright.classList.remove(settings.button_active_class);
                    AppDocument.querySelector('#' + item_id).classList.add(settings.button_active_class);
                }
                const header_align = get_align(AppDocument.querySelector('#setting_icon_text_header_aleft').classList.contains('setting_button_active'),
                                             AppDocument.querySelector('#setting_icon_text_header_acenter').classList.contains('setting_button_active'),
                                             AppDocument.querySelector('#setting_icon_text_header_aright').classList.contains('setting_button_active'));
                AppDocument.querySelector('#setting_input_reportheader1').style.textAlign= header_align;
                AppDocument.querySelector('#setting_input_reportheader2').style.textAlign= header_align;
                AppDocument.querySelector('#setting_input_reportheader3').style.textAlign= header_align;
                break;
            }
        //16=Texts, Report footer align
        case 16:
            {
                //check if clicking on button that is already active then deactivate so no alignment
                if (AppDocument.querySelector('#' + item_id).classList.contains(settings.button_active_class)){
                    AppDocument.querySelector('#' + item_id).classList.remove(settings.button_active_class);
                }
                else{
                    settings.reportfooter_aleft.classList.remove(settings.button_active_class);
                    settings.reportfooter_acenter.classList.remove(settings.button_active_class);
                    settings.reportfooter_aright.classList.remove(settings.button_active_class);
                    AppDocument.querySelector('#' + item_id).classList.add(settings.button_active_class);
                }
                const footer_align = get_align(AppDocument.querySelector('#setting_icon_text_footer_aleft').classList.contains('setting_button_active'),
                                                 AppDocument.querySelector('#setting_icon_text_footer_acenter').classList.contains('setting_button_active'),
                                                 AppDocument.querySelector('#setting_icon_text_footer_aright').classList.contains('setting_button_active'));
                AppDocument.querySelector('#setting_input_reportfooter1').style.textAlign= footer_align;
                AppDocument.querySelector('#setting_input_reportfooter2').style.textAlign= footer_align;
                AppDocument.querySelector('#setting_input_reportfooter3').style.textAlign= footer_align;
                break;
            }
        //Prayer, method
        case 17:
            {
                const method = AppDocument.querySelector('#setting_select_method').value;
                let suffix;

                AppDocument.querySelector('#setting_method_param_fajr').innerHTML = '';
                AppDocument.querySelector('#setting_method_param_isha').innerHTML = '';
                if (typeof app_report.REPORT_GLOBAL.module_praytimes_methods[method].params.fajr == 'string')
                    suffix = '';
                else
                    suffix = '°';
                AppDocument.querySelector('#setting_method_param_fajr').innerHTML = 'Fajr:' + app_report.REPORT_GLOBAL.module_praytimes_methods[method].params.fajr + suffix;
                if (typeof app_report.REPORT_GLOBAL.module_praytimes_methods[method].params.isha == 'string')
                    suffix = '';
                else
                    suffix = '°';
                AppDocument.querySelector('#setting_method_param_isha').innerHTML = 'Isha:' + app_report.REPORT_GLOBAL.module_praytimes_methods[method].params.isha + suffix;
                break;
            }
    }
};

/**
 * User login
 * @param {boolean} system_admin
 * @param {string|null} username_verify
 * @param {string|null} password_verify
 * @returns {Promise.<void>}
 */
const user_login_app = async (system_admin=false, username_verify=null, password_verify=null) => {
    await common.user_login(system_admin, username_verify, password_verify)
    .then((/**@type{{user_id: number,username: string,bio: string, avatar: string}}*/result)=>{
        //create intitial user setting if not exist, send initial=true
        user_settings_function('ADD_LOGIN', true)
        .then(()=>{
            AppDocument.querySelector('#tab_nav_7').innerHTML = '<img id=\'user_setting_avatar_img\' >';
            common.set_avatar(result.avatar, AppDocument.querySelector('#user_setting_avatar_img')); 

            //Show user tab
            AppDocument.querySelector('#tab_nav_7').style.display = 'inline-block';
            //Hide settings
            AppDocument.querySelector('#settings').style.visibility = 'hidden';
            common.ComponentRemove('common_user_profile');
            
            AppDocument.querySelector('#paper').innerHTML='';
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
        });
    })
    .catch(()=>null);
};

/**
 * User function
 * @param {string} function_name 
 * @returns {Promise.<void>}
 */
const user_function_app = async (function_name) => {
    await common.user_function(function_name)
    .then(()=>profile_update_stat_app())
    .catch(()=>null);
};

/**
 * User logoff
 * @returns {void}
 */
const user_logoff_app = () => {
    const select = AppDocument.querySelector('#setting_select_user_setting');
    common.user_logoff().then(() => {
        AppDocument.querySelector('#tab_nav_7').innerHTML = '';
        AppDocument.querySelector('#user_settings').style.display = 'none';
        
        common.ComponentRemove('common_dialogue_profile', true);
        //empty user settings
        select.innerHTML = '<option></option>';
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
/**
 * Provider signin
 * @param {*} provider_id 
 * @returns {Promise.<void>}
 */
const ProviderSignIn_app = async (provider_id) => {
    common.ProviderSignIn(provider_id)
    .then((/**@type{{   user_account_id: number,
                        username: string,
                        bio: string,
                        avatar: string,
                        first_name: string,
                        last_name: string,
                        userCreated:string}}*/result)=>{
        //create intitial user setting if not exist, send initial=true
        user_settings_function('ADD_LOGIN', true)
        .then(()=>{
            AppDocument.querySelector('#tab_nav_7').innerHTML = '<img id=\'user_setting_avatar_img\' >';
            common.set_avatar(result.avatar, AppDocument.querySelector('#user_setting_avatar_img')); 

            //Show user tab
            AppDocument.querySelector('#tab_nav_7').style.display = 'inline-block';
            AppDocument.querySelector('#paper').innerHTML='';
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
        });   
    });
};
/**
 * Profile update stat
 * @returns {Promise.<void>}
 */
const profile_update_stat_app = async () => {
    const result = await common.profile_update_stat();
    profile_user_setting_stat(result.id);
};
/**
 * Profile top
 * @param {number} statchoice 
 * @param {string|null} app_rest_url
 * @param {function|null} function_user_click
 * @returns {Promise.<void>}
 */
 const profile_top_app = async (statchoice, app_rest_url, function_user_click) => {
    await common.profile_top(statchoice, app_rest_url, function_user_click)
    .then(()=>{
        common.ComponentRender('common_profile_top_row2', 
                                {},
                                '/component/profile_top.js');
    })
 }
/**
 * Profile show
 * @param {number|null} user_account_id_other 
 * @param {string|null} username 
 * @returns {Promise.<void>}
 */
const profile_show_app = async (user_account_id_other = null, username = null) => {
    //using unary plus syntax if user account id has a value
    await common.profile_show(user_account_id_other?+user_account_id_other:null, username)
    .then((/**@type{{profile_id:number, private:number}}*/result)=>{
        if (result.profile_id != null){
            if (result.private==1 && (common.COMMON_GLOBAL.user_account_id == result.profile_id)==false) {
                //private
                null;
            } else {
                common.ComponentRender('common_profile_main_stat_row2', 
                                        {},
                                        '/component/profile_info.js')
                .then(()=>{
                    //public
                    profile_show_user_setting();
                    AppDocument.querySelector('#common_profile_main_stat_row2').style.display = 'block';
                    profile_user_setting_stat(result.profile_id);
                })
            }    
        }
    });
};
/**
 * 
 * @param {number} detailchoice 
 * @param {string|null} rest_url_app 
 * @param {boolean} fetch_detail 
 * @param {function|null} click_function 
 * @returns {void}
 */
const profile_detail_app = (detailchoice, rest_url_app, fetch_detail, click_function) => {
    if (common.COMMON_GLOBAL.user_account_id || 0 !== 0) {
        if (detailchoice == 0){
            //user settings
            AppDocument.querySelector('#profile_user_settings_row').style.display = 'block';
        }
        else{
            //common 1 -4
            //app
            //7 Like user setting
            //8 Liked user setting
            AppDocument.querySelector('#profile_user_settings_row').style.display = 'none';
        }
        common.profile_detail(detailchoice, rest_url_app, fetch_detail, click_function);
    } 
    else
        common.show_common_dialogue('LOGIN');
};
/**
 * User settings get
 * @returns {Promise.<void>}
 */
const user_settings_get = async () => {
    const select = AppDocument.querySelector('#setting_select_user_setting');
    await common.FFB('DB_API', `/user_account_app_data_post/all?user_account_id=${common.COMMON_GLOBAL.user_account_id??''}`, 'GET', 'APP_DATA', null)
    .then((/**@type{string}*/result)=>{
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
        AppDocument.querySelector('#user_settings').style.display = 'block';
    })
    .catch(()=>null);
};
/**
 * User setting show link
 * @param {HTMLElement} item 
 * @returns {void}
 */
const user_setting_link = (item) => {
    const paper_size_select = AppDocument.querySelector('#setting_select_report_papersize');
    const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
    const user_account_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id');
    const sid = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    switch (item.id){
        case 'user_day_html':
        case 'user_month_html':
        case 'user_year_html':{
            const url = get_report_url(user_account_id, 
                                     sid, 
                                     paper_size_select.options[paper_size_select.selectedIndex].value,
                                     item.id,
                                     'HTML');
            common.ComponentRender('common_window_info',
                    {   info:2,
                        url:null,
                        content_type:'HTML', 
                        iframe_content:url,
                        iframe_class:paper_size_select.options[paper_size_select.selectedIndex].value}, '/common/component/window_info.js');
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
            common.ComponentRender('common_window_info',
                    {   info:2,
                        url:null,
                        content_type:'PDF', 
                        iframe_content:url,
                        iframe_class:paper_size_select.options[paper_size_select.selectedIndex].value}, '/common/component/window_info.js');
            break;
        }
    }
};
/**
 * User settings load
 * @returns {Promise.<void>}
 */
const user_settings_load = async () => {

    const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
    //Regional
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_language_locale'),
        AppDocument.querySelector('#setting_select_locale'), 1);

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_timezone'),
        AppDocument.querySelector('#setting_select_report_timezone'), 1);

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_number_system'),
        AppDocument.querySelector('#setting_select_report_numbersystem'), 1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_layout_direction'),
        AppDocument.querySelector('#setting_select_report_direction'), 1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_second_language_locale'),
        AppDocument.querySelector('#setting_select_report_locale_second'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_column_title'),
        AppDocument.querySelector('#setting_select_report_coltitle'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_arabic_script'),
        AppDocument.querySelector('#setting_select_report_arabic_script'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_type'),
        AppDocument.querySelector('#setting_select_calendartype'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('regional_calendar_hijri_type'),
        AppDocument.querySelector('#setting_select_calendar_hijri_type'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id'),
        AppDocument.querySelector('#setting_select_popular_place'),0);
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_popular_place_id')||null !=null) {
        //set GPS for chosen popular place
        update_ui(7);
    }
    AppDocument.querySelector('#setting_input_place').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('description');
    AppDocument.querySelector('#setting_input_lat').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_lat_text');
    AppDocument.querySelector('#setting_input_long').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_long_text');    
    //Design
    set_theme_id('day', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_day_id'));
    set_theme_id('month', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_month_id'));
    set_theme_id('year', select_user_setting[select_user_setting.selectedIndex].getAttribute('design_theme_year_id'));

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_paper_size'),
        AppDocument.querySelector('#setting_select_report_papersize'),1);
    
    AppDocument.querySelector('#paper').className=AppDocument.querySelector('#setting_select_report_papersize').value;
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_row_highlight'),
        AppDocument.querySelector('#setting_select_report_highlight_row'),1);

    
    if (Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_weekday_checked')))
        AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.remove('checked');
    if (Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_calendartype_checked')))
        AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.remove('checked');
    if (Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_notes_checked')))
        AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.remove('checked');
        
    if (Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_gps_checked')))
        AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.remove('checked');
    if (Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('design_column_timezone_checked')))
        AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.remove('checked');
    //Image
    //dont set null value, it will corrupt IMG tag
    AppDocument.querySelector('#setting_input_reportheader_img').value = '';
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img') == null ||
        select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img') == '') {
        common.recreate_img(AppDocument.querySelector('#setting_reportheader_img'));
    } else {
        AppDocument.querySelector('#setting_reportheader_img').src =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('image_header_image_img');
    }

    AppDocument.querySelector('#setting_input_reportfooter_img').value = '';
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img') == null ||
        select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img') == '') {
        AppDocument.querySelector('#setting_reportfooter_img').src = '';
        common.recreate_img(AppDocument.querySelector('#setting_reportfooter_img'));
    } else {
        AppDocument.querySelector('#setting_reportfooter_img').src =
            select_user_setting[select_user_setting.selectedIndex].getAttribute('image_footer_image_img');
    }
    //Text
    AppDocument.querySelector('#setting_input_reportheader1').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_1_text');
    AppDocument.querySelector('#setting_input_reportheader2').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_2_text');
    AppDocument.querySelector('#setting_input_reportheader3').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_3_text');
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align') == '') {
        AppDocument.querySelector('#setting_icon_text_header_aleft').classList.remove('setting_button_active');
        AppDocument.querySelector('#setting_icon_text_header_acenter').classList.remove('setting_button_active');
        AppDocument.querySelector('#setting_icon_text_header_aright').classList.remove('setting_button_active');
    } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
        //remove active class if it is active
        AppDocument.querySelector('#setting_icon_text_header_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align')).classList.remove('setting_button_active');
        update_ui(15, 'setting_icon_text_header_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_header_align'));
    }
    AppDocument.querySelector('#setting_input_reportfooter1').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_1_text');
    AppDocument.querySelector('#setting_input_reportfooter2').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_2_text');
    AppDocument.querySelector('#setting_input_reportfooter3').innerHTML =
        select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_3_text');
    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align') == '') {
        AppDocument.querySelector('#setting_icon_text_footer_aleft').classList.remove('setting_button_active');
        AppDocument.querySelector('#setting_icon_text_footer_acenter').classList.remove('setting_button_active');
        AppDocument.querySelector('#setting_icon_text_footer_aright').classList.remove('setting_button_active');
    } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
        //remove active class if it is active
        AppDocument.querySelector('#setting_icon_text_footer_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align')).classList.remove('setting_button_active');
        update_ui(16, 'setting_icon_text_footer_a' +
            select_user_setting[select_user_setting.selectedIndex].getAttribute('text_footer_align'));
    }
    //Prayer
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_method'),
        AppDocument.querySelector('#setting_select_method'),1);
    //show method parameters used
    update_ui(17);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_method'),
        AppDocument.querySelector('#setting_select_asr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_high_latitude_adjustment'),
        AppDocument.querySelector('#setting_select_highlatitude'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_time_format'),
        AppDocument.querySelector('#setting_select_timeformat'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_hijri_date_adjustment'),
        AppDocument.querySelector('#setting_select_hijri_adjustment'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat'),
        AppDocument.querySelector('#setting_select_report_iqamat_title_fajr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_fajr_iqamat'),
        AppDocument.querySelector('#setting_select_report_iqamat_title_dhuhr'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_asr_iqamat'),
        AppDocument.querySelector('#setting_select_report_iqamat_title_asr'),1);
    
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_maghrib_iqamat'),
        AppDocument.querySelector('#setting_select_report_iqamat_title_maghrib'),1);
    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_isha_iqamat'),
        AppDocument.querySelector('#setting_select_report_iqamat_title_isha'),1);

    if (Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_imsak_checked')))
        AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.remove('checked');
    if (Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_sunset_checked')))
        AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.remove('checked');
    if (Number(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_midnight_checked')))
        AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.remove('checked');

    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('prayer_column_fast_start_end'),
        AppDocument.querySelector('#setting_select_report_show_fast_start_end'),1);

};
/**
 * User settings function
 * @param {string} function_name 
 * @param {boolean} initial_user_setting 
 * @returns {Promise.<void>}
 */
const user_settings_function = async (function_name, initial_user_setting) => {
    const description = AppDocument.querySelector('#setting_input_place').innerHTML;
    
    const select_setting_popular_place = AppDocument.querySelector('#setting_select_popular_place');
    if (common.input_control(null,{
                                    check_valid_list:[
                                                [AppDocument.querySelector('#setting_input_place'),null],
                                                [AppDocument.querySelector('#setting_input_lat'),null],
                                                [AppDocument.querySelector('#setting_input_long'),null],
                                                [AppDocument.querySelector('#setting_input_reportheader1'),null],
                                                [AppDocument.querySelector('#setting_input_reportheader2'),null],
                                                [AppDocument.querySelector('#setting_input_reportheader3'),null],
                                                [AppDocument.querySelector('#setting_input_reportfooter1'),null],
                                                [AppDocument.querySelector('#setting_input_reportfooter2'),null],
                                                [AppDocument.querySelector('#setting_input_reportfooter3'),null],
                                                [AppDocument.querySelector('#setting_input_long'),null]
                                                ]})==true){
        let country_id, city_id;
        if (AppDocument.querySelector('#common_module_leaflet_select_country')){
            const select_setting_country = AppDocument.querySelector('#common_module_leaflet_select_country');
            const select_setting_city = AppDocument.querySelector('#common_module_leaflet_select_city');
            country_id = select_setting_country[select_setting_country.selectedIndex].getAttribute('id');
            city_id = select_setting_city[select_setting_city.selectedIndex].getAttribute('id');
        }
        else{
            //choose user settings first if exists or else null
            const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
            if (select_user_setting[select_user_setting.selectedIndex] && select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id'))
                country_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id');
            else  
                country_id =  null;
            if (select_user_setting[select_user_setting.selectedIndex] && select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id'))
                city_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id');
            else
                city_id = null;
        }
        //store 0/1 for checked value for checkboxes
        const json_settings =
            {   description: description,
                regional_language_locale: AppDocument.querySelector('#setting_select_locale').value,
                regional_timezone: AppDocument.querySelector('#setting_select_report_timezone').value,
                regional_number_system: AppDocument.querySelector('#setting_select_report_numbersystem').value,
                regional_layout_direction: AppDocument.querySelector('#setting_select_report_direction').value,
                regional_second_language_locale: AppDocument.querySelector('#setting_select_report_locale_second').value,
                regional_column_title: AppDocument.querySelector('#setting_select_report_coltitle').value,
                regional_arabic_script: AppDocument.querySelector('#setting_select_report_arabic_script').value,
                regional_calendar_type: AppDocument.querySelector('#setting_select_calendartype').value,
                regional_calendar_hijri_type: AppDocument.querySelector('#setting_select_calendar_hijri_type').value,
    
                gps_country_id: country_id,
                gps_city_id: city_id,
                gps_popular_place_id: select_setting_popular_place[select_setting_popular_place.selectedIndex].getAttribute('id')||null,
                gps_lat_text: AppDocument.querySelector('#setting_input_lat').innerHTML,
                gps_long_text: AppDocument.querySelector('#setting_input_long').innerHTML,
    
                design_theme_day_id: get_theme_id('day'),
                design_theme_month_id: get_theme_id('month'),
                design_theme_year_id: get_theme_id('year'),
                design_paper_size: AppDocument.querySelector('#setting_select_report_papersize').value,
                design_row_highlight: AppDocument.querySelector('#setting_select_report_highlight_row').value,
                design_column_weekday_checked: Number(AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.contains('checked')),
                design_column_calendartype_checked: Number(AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.contains('checked')),
                design_column_notes_checked: Number(AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.contains('checked')),
                design_column_gps_checked: Number(AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.contains('checked')),
                design_column_timezone_checked: Number(AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.contains('checked')),
    
                image_header_image_img: AppDocument.querySelector('#setting_reportheader_img').src,
                image_footer_image_img: AppDocument.querySelector('#setting_reportfooter_img').src,
    
                text_header_1_text: AppDocument.querySelector('#setting_input_reportheader1').innerHTML,
                text_header_2_text: AppDocument.querySelector('#setting_input_reportheader2').innerHTML,
                text_header_3_text: AppDocument.querySelector('#setting_input_reportheader3').innerHTML,
                text_header_align: align_button_value('header'),
                text_footer_1_text: AppDocument.querySelector('#setting_input_reportfooter1').innerHTML,
                text_footer_2_text: AppDocument.querySelector('#setting_input_reportfooter2').innerHTML,
                text_footer_3_text: AppDocument.querySelector('#setting_input_reportfooter3').innerHTML,
                text_footer_align: align_button_value('footer'),
    
                prayer_method: AppDocument.querySelector('#setting_select_method').value,
                prayer_asr_method: AppDocument.querySelector('#setting_select_asr').value,
                prayer_high_latitude_adjustment: AppDocument.querySelector('#setting_select_highlatitude').value,
                prayer_time_format: AppDocument.querySelector('#setting_select_timeformat').value,
                prayer_hijri_date_adjustment: AppDocument.querySelector('#setting_select_hijri_adjustment').value,
                prayer_fajr_iqamat: AppDocument.querySelector('#setting_select_report_iqamat_title_fajr').value,
                prayer_dhuhr_iqamat: AppDocument.querySelector('#setting_select_report_iqamat_title_dhuhr').value,
                prayer_asr_iqamat: AppDocument.querySelector('#setting_select_report_iqamat_title_asr').value,
                prayer_maghrib_iqamat: AppDocument.querySelector('#setting_select_report_iqamat_title_maghrib').value,
                prayer_isha_iqamat: AppDocument.querySelector('#setting_select_report_iqamat_title_isha').value,
                prayer_column_imsak_checked: Number(AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.contains('checked')),
                prayer_column_sunset_checked: Number(AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.contains('checked')),
                prayer_column_midnight_checked: Number(AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.contains('checked')),
                prayer_column_fast_start_end: AppDocument.querySelector('#setting_select_report_show_fast_start_end').value
                };
        const json_data = { description:        description,
                            json_data:          json_settings,
                            user_account_id:    common.COMMON_GLOBAL.user_account_id
                        };
        let method;
        let path;
        switch (function_name){
            case 'ADD_LOGIN':
            case 'ADD':{
                if (function_name=='ADD')
                    AppDocument.querySelector('#setting_btn_user_add').classList.add('css_spinner');
                method = 'POST';
                path = `/user_account_app_data_post?initial=${initial_user_setting==true?1:0}`;
                break;
            }
            case 'SAVE':{
                AppDocument.querySelector('#setting_btn_user_save').classList.add('css_spinner');
                method = 'PUT';
                const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
                const user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
                path = `/user_account_app_data_post?PUT_ID=${user_setting_id}`;
                break;
            }
            default:{
                break;
            }
        }
        await common.FFB('DB_API', path, method, 'APP_ACCESS', json_data)
        .then((/**@type{string}*/result)=>{
            switch (function_name){
                case 'ADD':{
                    //update user settings select with saved data
                    //save current settings to new option with 
                    //returned user_setting_id + common.COMMON_GLOBAL.user_account_id (then call set_settings_select)
                    const select = AppDocument.querySelector('#setting_select_user_setting');
                    select.innerHTML += `<option id=${JSON.parse(result).id} user_account_id=${common.COMMON_GLOBAL.user_account_id??''} >${description}</option>`;
                    select.selectedIndex = select.options[select.options.length - 1].index;
                    select.options[select.options.length - 1].value = select.selectedIndex;
                    set_settings_select();
                    AppDocument.querySelector('#setting_btn_user_add').classList.remove('css_spinner');
                    break;
                }
                case 'SAVE':{
                    //update user settings select with saved data
                    set_settings_select();
                    AppDocument.querySelector('#setting_btn_user_save').classList.remove('css_spinner');
                    break;
                }
                default:{
                    break;
                }
            }
        })
        .catch((/**@type{Error}*/err)=>{
            if (function_name=='ADD')
                AppDocument.querySelector('#setting_btn_user_add').classList.remove('css_spinner');
            if (function_name=='SAVE')
                AppDocument.querySelector('#setting_btn_user_save').classList.remove('css_spinner');
            throw err;
        });
    }
};
/**
 * User settings delete
 * @param {number|null} choice 
 * @returns {void}
 */
const user_settings_delete = (choice=null) => {
    const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
    const user_setting_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('id');
    const function_delete_user_setting = () => { user_settings_delete(1); };
    
    switch (choice){
        case null:{
            common.show_message('CONFIRM',null,function_delete_user_setting, null, null, common.COMMON_GLOBAL.app_id);
            break;
        }
        case 1:{
            AppDocument.querySelector('#setting_btn_user_delete').classList.add('css_spinner');
            common.FFB('DB_API', `/user_account_app_data_post?DELETE_ID=${user_setting_id}`, 'DELETE', 'APP_ACCESS', null)
            .then(()=>{
                const select = AppDocument.querySelector('#setting_select_user_setting');
                //delete current option
                select.remove(select.selectedIndex);
                if (select_user_setting.length == 0) {
                    user_settings_function('ADD', false)
                    .then(()=>AppDocument.querySelector('#setting_btn_user_delete').classList.remove('css_spinner'));
                }
                else{
                    //load next available
                    user_settings_load()
                    .then(()=>settings_translate(true))
                    .then(()=>settings_translate(false))
                    .then(()=>AppDocument.querySelector('#setting_btn_user_delete').classList.remove('css_spinner'));
                }
                
            })
            .catch(()=>AppDocument.querySelector('#setting_btn_user_delete').classList.remove('css_spinner'));
        }
    }
};
/**
 * Set default settings
 * @returns {Promise.<void>}
 */
const set_default_settings = async () => {
    const current_number_system = Intl.NumberFormat().resolvedOptions().numberingSystem;

    //Regional
    //set default language
    common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL.user_locale, AppDocument.querySelector('#setting_select_locale'),1);
    //default timezone current timezone
    AppDocument.querySelector('#setting_timezone_current').innerHTML = common.COMMON_GLOBAL.user_timezone;
    //default report timezone current timezone, 
    //will be changed user timezone to place timezone if no GPS can be set and default place will be used
    common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL.user_timezone, AppDocument.querySelector('#setting_select_report_timezone'),1);
    //set default numberformat numbersystem
    common.SearchAndSetSelectedIndex(current_number_system, AppDocument.querySelector('#setting_select_report_numbersystem'),1);
    //set default for others in Regional

    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_direction, AppDocument.querySelector('#setting_select_report_direction'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_locale_second, AppDocument.querySelector('#setting_select_report_locale_second'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_coltitle, AppDocument.querySelector('#setting_select_report_coltitle'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_arabic_script, AppDocument.querySelector('#setting_select_report_arabic_script'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_calendartype, AppDocument.querySelector('#setting_select_calendartype'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.regional_default_calendar_hijri_type, AppDocument.querySelector('#setting_select_calendar_hijri_type'),1);
    
    //set according to users GPS/IP settings
    if (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude) {
        AppDocument.querySelector('#setting_input_lat').innerHTML = common.COMMON_GLOBAL.client_latitude;
        AppDocument.querySelector('#setting_input_long').innerHTML = common.COMMON_GLOBAL.client_longitude;
        AppDocument.querySelector('#setting_input_place').innerHTML = common.COMMON_GLOBAL.client_place;
        AppDocument.querySelector('#setting_select_report_timezone').value = getTimezone(common.COMMON_GLOBAL.client_latitude, common.COMMON_GLOBAL.client_longitude);
    } else {
        //Set Makkah as default
        const select_place = AppDocument.querySelector('#setting_select_popular_place');
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

    common.SearchAndSetSelectedIndex(APP_GLOBAL.design_default_papersize, AppDocument.querySelector('#setting_select_report_papersize'),1);
    AppDocument.querySelector('#paper').className=AppDocument.querySelector('#setting_select_report_papersize').value;
    common.SearchAndSetSelectedIndex(APP_GLOBAL.design_default_highlight_row, AppDocument.querySelector('#setting_select_report_highlight_row'),1);
    
    if (APP_GLOBAL.design_default_show_weekday)
        AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.remove('checked');
    if (APP_GLOBAL.design_default_show_calendartype)
        AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.remove('checked');
    if (APP_GLOBAL.design_default_show_notes)
        AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.remove('checked');
    if (APP_GLOBAL.design_default_show_gps)
        AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.remove('checked');
    if (APP_GLOBAL.design_default_show_timezone)
        AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.remove('checked');

    //Image
    AppDocument.querySelector('#setting_input_reportheader_img').value = '';
    if (APP_GLOBAL.image_default_report_header_src == null || APP_GLOBAL.image_default_report_header_src == '')
        common.recreate_img(AppDocument.querySelector('#setting_reportheader_img'));
    else {
        AppDocument.querySelector('#setting_reportheader_img').src = await common.convert_image(   APP_GLOBAL.image_default_report_header_src, 
                                                                                                APP_GLOBAL.image_header_footer_width, 
                                                                                                APP_GLOBAL.image_header_footer_height);
    }
    AppDocument.querySelector('#setting_input_reportfooter_img').value = '';
    if (APP_GLOBAL.image_default_report_footer_src == null || APP_GLOBAL.image_default_report_footer_src == '')
        common.recreate_img(AppDocument.querySelector('#setting_reportfooter_img'));
    else {
        AppDocument.querySelector('#setting_reportfooter_img').src = await common.convert_image(   APP_GLOBAL.image_default_report_footer_src, 
                                                                                                APP_GLOBAL.image_header_footer_width, 
                                                                                                APP_GLOBAL.image_header_footer_height);
    }
    //Text
    AppDocument.querySelector('#setting_input_reportheader1').innerHTML = APP_GLOBAL.text_default_reporttitle1;
    AppDocument.querySelector('#setting_input_reportheader2').innerHTML = APP_GLOBAL.text_default_reporttitle2;
    AppDocument.querySelector('#setting_input_reportheader3').innerHTML = APP_GLOBAL.text_default_reporttitle3;
    
    AppDocument.querySelector('#setting_icon_text_header_aleft').classList.remove('setting_button_active');
    AppDocument.querySelector('#setting_icon_text_header_acenter').classList.remove('setting_button_active');
    AppDocument.querySelector('#setting_icon_text_header_aright').classList.remove('setting_button_active');
    
    AppDocument.querySelector('#setting_input_reportfooter1').innerHTML = APP_GLOBAL.text_default_reportfooter1;
    AppDocument.querySelector('#setting_input_reportfooter2').innerHTML = APP_GLOBAL.text_default_reportfooter2;
    AppDocument.querySelector('#setting_input_reportfooter3').innerHTML = APP_GLOBAL.text_default_reportfooter3;
    
    AppDocument.querySelector('#setting_icon_text_footer_aleft').classList.remove('setting_button_active');
    AppDocument.querySelector('#setting_icon_text_footer_acenter').classList.remove('setting_button_active');
    AppDocument.querySelector('#setting_icon_text_footer_aright').classList.remove('setting_button_active');

    //Prayer
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_method, AppDocument.querySelector('#setting_select_method'),1);
    //show method parameters used
    update_ui(17);

    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_asr, AppDocument.querySelector('#setting_select_asr'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_highlatitude, AppDocument.querySelector('#setting_select_highlatitude'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_timeformat, AppDocument.querySelector('#setting_select_timeformat'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_hijri_adjustment, AppDocument.querySelector('#setting_select_hijri_adjustment'),1);
    
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_fajr, AppDocument.querySelector('#setting_select_report_iqamat_title_fajr'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_dhuhr, AppDocument.querySelector('#setting_select_report_iqamat_title_dhuhr'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_asr, AppDocument.querySelector('#setting_select_report_iqamat_title_asr'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_maghrib, AppDocument.querySelector('#setting_select_report_iqamat_title_maghrib'),1);
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_iqamat_title_isha, AppDocument.querySelector('#setting_select_report_iqamat_title_isha'),1);

    if (APP_GLOBAL.prayer_default_show_imsak)
        AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.remove('checked');
    if (APP_GLOBAL.prayer_default_show_sunset)
        AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.remove('checked');
    if (APP_GLOBAL.prayer_default_show_midnight)
        AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.add('checked');
    else
        AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.remove('checked');
        
    common.SearchAndSetSelectedIndex(APP_GLOBAL.prayer_default_show_fast_start_end, AppDocument.querySelector('#setting_select_report_show_fast_start_end'),1);
    //update select
    set_settings_select();
    //Hide user tab
    AppDocument.querySelector('#tab_nav_7').style.display = 'none';
    //open regional tab in settings
    openTab(1);
};

/**
 * Set setting select
 * @returns {void}
 */
const set_settings_select = () => {
    const option = AppDocument.querySelector('#setting_select_user_setting').options[AppDocument.querySelector('#setting_select_user_setting').selectedIndex];
    option.text = AppDocument.querySelector('#setting_input_place').innerHTML;
    
    option.setAttribute('description', AppDocument.querySelector('#setting_input_place').innerHTML);
    option.setAttribute('regional_language_locale', AppDocument.querySelector('#setting_select_locale').value);
    option.setAttribute('regional_timezone', AppDocument.querySelector('#setting_select_report_timezone').value);
    option.setAttribute('regional_number_system', AppDocument.querySelector('#setting_select_report_numbersystem').value);
    option.setAttribute('regional_layout_direction', AppDocument.querySelector('#setting_select_report_direction').value);
    option.setAttribute('regional_second_language_locale', AppDocument.querySelector('#setting_select_report_locale_second').value);
    option.setAttribute('regional_column_title', AppDocument.querySelector('#setting_select_report_coltitle').value);
    option.setAttribute('regional_arabic_script', AppDocument.querySelector('#setting_select_report_arabic_script').value);
    option.setAttribute('regional_calendar_type', AppDocument.querySelector('#setting_select_calendartype').value);
    option.setAttribute('regional_calendar_hijri_type', AppDocument.querySelector('#setting_select_calendar_hijri_type').value);

    if (AppDocument.querySelector('#common_module_leaflet_select_country'))
        option.setAttribute('gps_country_id', AppDocument.querySelector('#common_module_leaflet_select_country')[AppDocument.querySelector('#common_module_leaflet_select_country').selectedIndex].getAttribute('id'));
    else
        option.setAttribute('gps_country_id','');
    if (AppDocument.querySelector('#common_module_leaflet_select_city'))
        option.setAttribute('gps_city_id', AppDocument.querySelector('#common_module_leaflet_select_city')[AppDocument.querySelector('#common_module_leaflet_select_city').selectedIndex].getAttribute('id'));
    else
        option.setAttribute('gps_city_id','');

    option.setAttribute('gps_popular_place_id', AppDocument.querySelector('#setting_select_popular_place')[AppDocument.querySelector('#setting_select_popular_place').selectedIndex].getAttribute('id'));
    option.setAttribute('gps_lat_text', AppDocument.querySelector('#setting_input_lat').innerHTML);
    option.setAttribute('gps_long_text', AppDocument.querySelector('#setting_input_long').innerHTML);

    option.setAttribute('design_theme_day_id', get_theme_id('day'));
    option.setAttribute('design_theme_month_id', get_theme_id('month'));
    option.setAttribute('design_theme_year_id', get_theme_id('year'));
    option.setAttribute('design_paper_size', AppDocument.querySelector('#setting_select_report_papersize').value);
    option.setAttribute('design_row_highlight', AppDocument.querySelector('#setting_select_report_highlight_row').value);
    option.setAttribute('design_column_weekday_checked', Number(AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.contains('checked')));
    option.setAttribute('design_column_calendartype_checked', Number(AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.contains('checked')));
    option.setAttribute('design_column_notes_checked', Number(AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.contains('checked')));
    option.setAttribute('design_column_gps_checked', Number(AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.contains('checked')));
    option.setAttribute('design_column_timezone_checked', Number(AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.contains('checked')));

    option.setAttribute('image_header_image_img', AppDocument.querySelector('#setting_reportheader_img').src);
    option.setAttribute('image_footer_image_img', AppDocument.querySelector('#setting_reportfooter_img').src);

    //fix null value that returns the word "null" without quotes
    option.setAttribute('text_header_1_text', AppDocument.querySelector('#setting_input_reportheader1').innerHTML);
    option.setAttribute('text_header_2_text', AppDocument.querySelector('#setting_input_reportheader2').innerHTML);
    option.setAttribute('text_header_3_text', AppDocument.querySelector('#setting_input_reportheader3').innerHTML);
    option.setAttribute('text_header_align', align_button_value('header'));
    option.setAttribute('text_footer_1_text', AppDocument.querySelector('#setting_input_reportfooter1').innerHTML);
    option.setAttribute('text_footer_2_text', AppDocument.querySelector('#setting_input_reportfooter2').innerHTML);
    option.setAttribute('text_footer_3_text', AppDocument.querySelector('#setting_input_reportfooter3').innerHTML);
    option.setAttribute('text_footer_align', align_button_value('footer'));

    option.setAttribute('prayer_method', AppDocument.querySelector('#setting_select_method').value);
    option.setAttribute('prayer_asr_method', AppDocument.querySelector('#setting_select_asr').value);
    option.setAttribute('prayer_high_latitude_adjustment', AppDocument.querySelector('#setting_select_highlatitude').value);
    option.setAttribute('prayer_time_format', AppDocument.querySelector('#setting_select_timeformat').value);
    option.setAttribute('prayer_hijri_date_adjustment', AppDocument.querySelector('#setting_select_hijri_adjustment').value);
    option.setAttribute('prayer_fajr_iqamat', AppDocument.querySelector('#setting_select_report_iqamat_title_fajr').value);
    option.setAttribute('prayer_dhuhr_iqamat', AppDocument.querySelector('#setting_select_report_iqamat_title_dhuhr').value);
    option.setAttribute('prayer_asr_iqamat', AppDocument.querySelector('#setting_select_report_iqamat_title_asr').value);
    option.setAttribute('prayer_maghrib_iqamat', AppDocument.querySelector('#setting_select_report_iqamat_title_maghrib').value);
    option.setAttribute('prayer_isha_iqamat', AppDocument.querySelector('#setting_select_report_iqamat_title_isha').value);
    option.setAttribute('prayer_column_imsak_checked', Number(AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.contains('checked')));
    option.setAttribute('prayer_column_sunset_checked', Number(AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.contains('checked')));
    option.setAttribute('prayer_column_midnight_checked', Number(AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.contains('checked')));
    option.setAttribute('prayer_column_fast_start_end', AppDocument.querySelector('#setting_select_report_show_fast_start_end').value);
};
/**
 * Profile user setting stat
 * @param {number} id
 * @returns {void}
 */
const profile_user_setting_stat = id => {
    common.FFB('DB_API', `/user_account_app_data_post/profile?id=${id}`, 'GET', 'APP_DATA', null)
    .then((/**@type{string}*/result)=>{
        AppDocument.querySelector('#profile_info_user_setting_likes_count').innerHTML = JSON.parse(result)[0].count_user_post_likes;
        AppDocument.querySelector('#profile_info_user_setting_liked_count').innerHTML = JSON.parse(result)[0].count_user_post_liked;
    })
    .catch(()=>null);
};
/**
 * Profile user setting show link
 * @param {HTMLElement} item 
 * @returns {void}
 */
const profile_user_setting_link = item => {
    const select_user_setting = AppDocument.querySelector('#profile_select_user_settings');
    const user_account_id = select_user_setting[select_user_setting.selectedIndex].getAttribute('user_account_id');
    const sid = select_user_setting[select_user_setting.selectedIndex].getAttribute('sid');
    const paper_size = select_user_setting[select_user_setting.selectedIndex].getAttribute('paper_size');
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
            common.ComponentRender('common_window_info',
                    {   info:2,
                        url:null,
                        content_type:'HTML', 
                        iframe_content:url,
                        iframe_class:paper_size}, '/common/component/window_info.js');
            break;
        }
        case 'profile_user_settings_like':{
            user_settings_like(sid);
            break;
        }
    }
};
/**
 * Profile show user setting detail
 * @param {number} liked 
 * @param {number} count_likes 
 * @param {number} count_views 
 * @returns {void}
 */
const profile_show_user_setting_detail = (liked, count_likes, count_views) => {
    
    AppDocument.querySelector('#profile_user_settings_like').children[0].style.display = `${liked == 1?'none':'block'}`;
    AppDocument.querySelector('#profile_user_settings_like').children[1].style.display = `${liked == 1?'block':'none'}`;

    AppDocument.querySelector('#profile_user_settings_info_likes_count').innerHTML = count_likes;
    AppDocument.querySelector('#profile_user_settings_info_views_count').innerHTML = count_views;
};
/**
 * Profile show user setting
 * @returns {void}
 */
const profile_show_user_setting = () => {
    AppDocument.querySelector('#profile_user_settings_row').style.display = 'block';

    common.FFB('DB_API', `/user_account_app_data_post/profile/all?id=${AppDocument.querySelector('#common_profile_id').innerHTML}` + 
                        `&id_current_user=${common.COMMON_GLOBAL.user_account_id??''}`, 'GET', 'APP_DATA', null)
    .then((/**@type{string}*/result)=>{
        const profile_select_user_settings = AppDocument.querySelector('#profile_select_user_settings');
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
    })
    .catch(()=>null);
};
/**
 * Profile user setting update stat
 * @returns {void}
 */
const profile_user_setting_update_stat = () => {
    const profile_id = AppDocument.querySelector('#common_profile_id').innerHTML;
    common.FFB('DB_API', `/user_account_app_data_post/profile/all?id=${profile_id}` +
                        `&id_current_user=${common.COMMON_GLOBAL.user_account_id??''}`, 'GET', 'APP_DATA', null)
    .then((/**@type{string}*/result)=>{
        const profile_select_user_settings = AppDocument.querySelector('#profile_select_user_settings');
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
    })
    .catch(()=>null);
};
/**
 * User settings like
 * @param {number} user_account_app_data_post_id 
 * @returns {void}
 */
const user_settings_like = user_account_app_data_post_id => {
    let method;
    const json_data = {user_account_app_data_post_id: user_account_app_data_post_id};
    if (common.COMMON_GLOBAL.user_account_id == null)
        common.show_common_dialogue('LOGIN');
    else {
        if (AppDocument.querySelector('#profile_user_settings_like').children[0].style.display == 'block')
            method = 'POST';
        else
            method = 'DELETE';
        common.FFB('DB_API', `/user_account_app_data_post_like?user_account_id=${common.COMMON_GLOBAL.user_account_id??''}`, method, 'APP_ACCESS', json_data)
        .then(()=>profile_user_setting_update_stat())
        .catch(()=>null);
    }
};
/**
 * App event click
 * @param {AppEvent} event 
 */
const app_event_click = event => {
    if (event==null){
        AppDocument.querySelector('#app').addEventListener('click',(/**@type{AppEvent}*/event) => {
            app_event_click(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('click',event)
        .then(()=>{
            switch (event_target_id){
                //info dialogue
                case 'app_link':{
                    if (common.COMMON_GLOBAL.app_link_url)
                        window.open(common.COMMON_GLOBAL.app_link_url,'_blank','');
                    break;
                }
                case 'info_link1':{
                    common.ComponentRender('common_window_info',
                                            {   info:1,
                                                url:common.COMMON_GLOBAL.info_link_policy_url,
                                                content_type:null, 
                                                iframe_content:null}, '/common/component/window_info.js');
                    break;
                }
                case 'info_link2':{
                    common.ComponentRender('common_window_info',
                                            {   info:1,
                                                url:common.COMMON_GLOBAL.info_link_disclaimer_url,
                                                content_type:null, 
                                                iframe_content:null}, '/common/component/window_info.js');
                    break;
                }
                case 'info_link3':{
                    common.ComponentRender('common_window_info',
                                            {   info:1,
                                                url:common.COMMON_GLOBAL.info_link_terms_url,
                                                content_type:null, 
                                                iframe_content:null}, '/common/component/window_info.js');
                    break;
                }
                case 'info_link4':{
                    common.ComponentRender('common_window_info',
                                            {   info:1,
                                                url:common.COMMON_GLOBAL.info_link_about_url,
                                                content_type:null, 
                                                iframe_content:null}, '/common/component/window_info.js');
                    break;
                }
                case 'info_close':{
                    AppDocument.querySelector('#dialogue_info').style.visibility = 'hidden';
                    break;
                }
                //toolbar top
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
                
                    const input_row = AppDocument.querySelector('#common_profile_search_input');
                    const searchlist = AppDocument.querySelector('#common_profile_search_list_wrap');
                    input_row.style.visibility=input_row.style.visibility=='visible'?'hidden':'visible';
                    //show list if list input is visible and is not empty
                    searchlist.style.display=(input_row.style.visibility=='visible' && input_row.innerHTML !='')?'flex':'none';
                    
                    AppDocument.querySelector('#common_profile_search_input').focus();
                    break;
                }
                //toolbar bottom
                case 'toolbar_btn_about':{
                    AppDocument.querySelector('#dialogue_info').style.visibility = 'visible';
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
                //tab navigation
                case 'tab_nav_1':
                case 'tab_nav_2':
                case 'tab_nav_3':
                case 'tab_nav_4':
                case 'tab_nav_5':
                case 'tab_nav_6':{
                    openTab(event_target_id.substring(event_target_id.length-1));
                    break;
                }
                case 'tab_nav_7':
                case 'user_setting_avatar_img':{
                    openTab(7);
                    break;
                }
                case 'scan_open_mobile_close':{
                    AppDocument.querySelector('#dialogue_scan_open_mobile').style.visibility = 'hidden';
                    break;
                }
                //setting design
                case 'slider_prev_day':{
                    theme_nav(-1, 'day');
                    break;
                }
                case 'slider_prev_month':{
                    theme_nav(-1, 'month');
                    break;
                }
                case 'slider_prev_year':{
                    theme_nav(-1, 'year');
                    break;
                }
                case 'slider_next_day':{
                    theme_nav(1, 'day');
                    break;
                }            
                case 'slider_next_month':{
                    theme_nav(1, 'month');
                    break;
                }            
                case 'slider_next_year':{
                    theme_nav(1, 'year');
                    break;
                }            
                //settings image
                case 'setting_icon_image_header_img':{
                    AppDocument.querySelector('#setting_input_reportheader_img').click();
                    break;
                }
                case 'setting_icon_image_header_clear':{
                    update_ui(12);
                    break;
                }
                case 'setting_icon_image_footer_img':{
                    AppDocument.querySelector('#setting_input_reportfooter_img').click();
                    break;
                }
                case 'setting_icon_image_footer_clear':{
                    update_ui(14);
                    break;
                }
                //settings text
                case 'setting_icon_text_theme_day':
                case 'setting_icon_text_theme_month':
                case 'setting_icon_text_theme_year':{
                    AppDocument.querySelector('#setting_icon_text_theme_day').classList.remove('common_dialogue_button');
                    AppDocument.querySelector('#setting_icon_text_theme_month').classList.remove('common_dialogue_button');
                    AppDocument.querySelector('#setting_icon_text_theme_year').classList.remove('common_dialogue_button');
                    const  theme_type = event_target_id.substring(24);
                    //mark active icon
                    AppDocument.querySelector('#' + event_target_id).classList.add('common_dialogue_button');
                    AppDocument.querySelector('#setting_paper_preview_text').className =  'setting_paper_preview' + ' ' +
                                                                                        `theme_${theme_type}_${get_theme_id(theme_type)} ` + 
                                                                                        AppDocument.querySelector('#setting_select_report_arabic_script').value;
                    break;
                }
                case 'setting_icon_text_header_aleft':
                case 'setting_icon_text_header_acenter':
                case 'setting_icon_text_header_aright':{
                    update_ui(15, event_target_id);
                    break;
                }
                case 'setting_icon_text_footer_aleft':
                case 'setting_icon_text_footer_acenter':
                case 'setting_icon_text_footer_aright':{
                    update_ui(16, event_target_id);
                    break;
                }
                //settings user
                case 'setting_btn_user_save':{
                    user_settings_function('SAVE', false);
                    break;
                }
                case 'setting_btn_user_add':{
                    user_settings_function('ADD', false);
                    break;
                }
                case 'setting_btn_user_delete':{
                    user_settings_delete();
                    break;
                }
                case 'user_day_html':        
                case 'user_day_pdf':
                case 'user_month_html':
                case 'user_month_pdf':
                case 'user_year_html':
                case 'user_year_pdf':{
                    user_setting_link(AppDocument.querySelector('#' + event_target_id));
                    break;
                }
                //profile
                case 'profile_main_btn_user_settings':{
                    AppDocument.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                    AppDocument.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                    profile_detail_app(0, '/user_account_app_data_post/profile/detail', false, null);
                    break;
                }
                case 'profile_main_btn_user_setting_likes':
                case 'profile_main_btn_user_setting_likes_heart':
                case 'profile_main_btn_user_setting_likes_user_setting':{
                    AppDocument.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                    AppDocument.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                    profile_detail_app(6, '/user_account_app_data_post/profile/detail', true, profile_show_app);
                    break;
                }
                case 'profile_main_btn_user_setting_liked':
                case 'profile_main_btn_user_setting_liked_heart':
                case 'profile_main_btn_user_setting_liked_user_setting':{
                    AppDocument.querySelectorAll('.common_profile_btn_selected').forEach((/**@type{HTMLElement}*/btn)=>btn.classList.remove('common_profile_btn_selected'));
                    AppDocument.querySelector(`#${event_target_id}`).classList.add('common_profile_btn_selected');
                    profile_detail_app(7, '/user_account_app_data_post/profile/detail', true, profile_show_app);
                    break;
                }
                case 'profile_top_row2_1':{
                    profile_top_app(4, '/user_account_app_data_post/profile/top', profile_show_app);
                    break;
                }
                case 'profile_top_row2_2':{
                    profile_top_app(5, '/user_account_app_data_post/profile/top', profile_show_app);
                    break;
                }
                case 'profile_user_settings_day':
                case 'profile_user_settings_month':
                case 'profile_user_settings_year':
                case 'profile_user_settings_like':{
                    profile_user_setting_link(AppDocument.querySelector(`#${event_target_id}`));
                    break;
                }
                //common
                case 'common_toolbar_framework_js':{
                    mount_app_app(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                    mount_app_app(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                    mount_app_app(3);
                    break;
                }
                //dialogue user menu
                case 'common_user_menu':
                    case 'common_user_menu_logged_in':
                    case 'common_user_menu_avatar':
                    case 'common_user_menu_avatar_img':
                    case 'common_user_menu_logged_out':
                    case 'common_user_menu_default_avatar':{
                        common.ComponentRender('common_dialogue_user_menu', 
                        {   app_id:common.COMMON_GLOBAL.app_id,
                            common_app_id:common.COMMON_GLOBAL.common_app_id,
                            data_app_id:common.COMMON_GLOBAL.common_app_id,
                            username:common.COMMON_GLOBAL.user_account_username,
                            system_admin:common.COMMON_GLOBAL.system_admin,
                            current_locale:common.COMMON_GLOBAL.user_locale,
                            current_timezone:common.COMMON_GLOBAL.user_timezone,
                            current_direction:common.COMMON_GLOBAL.user_direction,
                            current_arabic_script:common.COMMON_GLOBAL.user_arabic_script,
                            //functions
                            function_FFB:common.FFB,
                            function_get_locales_options:common.get_locales_options},
                                                '/common/component/dialogue_user_menu.js')
                        .then(()=>common.ComponentRender(   'common_dialogue_user_menu_app_theme', 
                                                            {},
                                                            '/common/component/app_theme.js'));
                        break;
                    }
                case 'common_dialogue_user_menu_log_out':{
                    user_logoff_app();
                    break;
                }
                case 'common_dialogue_user_menu_username':{
                    toolbar_button(6);
                    break;
                }
                //profile button
                case 'common_profile_btn_top':{
                    toolbar_button(7);
                    break;
                }
                //dialogue user start
                case 'common_user_start_login_button':{
                    user_login_app();
                    break;
                }
                case 'common_user_start_signup_button':{
                    common.user_signup();
                    break;
                }
                case 'common_identity_provider_login':{
                    const target_row = common.element_row(event.target);
                    ProviderSignIn_app(target_row.querySelector('.common_login_provider_id').innerHTML);
                    break;
                }
                //dialogue profile
                case 'common_profile_main_btn_following':{
                    profile_detail_app(1, null, true, profile_show_app);
                    break;
                }
                case 'common_profile_main_btn_followed':{
                    profile_detail_app(2, null, true, profile_show_app);
                    break;
                }
                case 'common_profile_main_btn_likes':{
                    profile_detail_app(3, null, true, profile_show_app);
                    break;
                }
                case 'common_profile_main_btn_liked':
                case 'common_profile_main_btn_liked_heart':
                case 'common_profile_main_btn_liked_users':{
                    profile_detail_app(4, null, true, profile_show_app);
                    break;
                }
                case 'common_profile_follow':{
                    user_function_app('FOLLOW');
                    break;
                }
                case 'common_profile_like':{
                    user_function_app('LIKE');
                    break;
                }
                case 'common_profile_top_row1_1':{
                    profile_top_app(1, null, profile_show_app);
                    break;
                }
                case 'common_profile_top_row1_2':{
                    profile_top_app(2, null, profile_show_app);
                    break;
                }
                case 'common_profile_top_row1_3':{
                    profile_top_app(3, null, profile_show_app);
                    break;
                }
                case 'common_profile_home':{
                    toolbar_button(7);
                    break;
                }
                case 'common_profile_close':{
                    common.ComponentRemove('common_dialogue_profile', true);
                    break;
                }    
                //module leaflet
                case 'common_module_leaflet_control_my_location_id':{
                    AppDocument.querySelector('#setting_select_popular_place').selectedIndex = 0;
                    AppDocument.querySelector('#setting_input_place').innerHTML = common.COMMON_GLOBAL.client_place;
                    AppDocument.querySelector('#setting_input_long').innerHTML = common.COMMON_GLOBAL.client_longitude;
                    AppDocument.querySelector('#setting_input_lat').innerHTML = common.COMMON_GLOBAL.client_latitude;
                    //remove country and city in settings
                    const option = AppDocument.querySelector('#setting_select_user_setting').options[AppDocument.querySelector('#setting_select_user_setting').selectedIndex];
                    option.setAttribute('gps_country_id', '');
                    option.setAttribute('gps_city_id', '');
                    //update timezone
                    AppDocument.querySelector('#setting_select_report_timezone').value = getTimezone(common.COMMON_GLOBAL.client_latitude, common.COMMON_GLOBAL.client_longitude);
                    //set qibbla
                    map_show_qibbla();
                    app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(AppDocument.querySelector('#setting_select_report_timezone').value);
                    break;
                }       
            }
        });
    }
};
/**
 * App event change
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_change = event => {
    if (event==null){
        AppDocument.querySelector('#app').addEventListener('change',(/**@type{AppEvent}*/event) => {
            app_event_change(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('change',event)
        .then(()=>{
            switch (event_target_id){
                //settings regional
                case 'setting_select_locale':{
                    settings_translate(true);
                    break;
                }
                case 'setting_select_report_timezone':{
                    update_ui(2);
                    break;
                }
                case 'setting_select_report_locale_second':{
                    settings_translate(false);
                    break;
                }
                //settings gps
                case 'setting_select_popular_place':{
                    update_ui(7);
                    break;
                }
                //settings design
                case 'setting_select_report_papersize':{
                    update_ui(10);
                    break;
                }
                //settings image
                case 'setting_input_reportheader_img':{
                    update_ui(11, event_target_id);
                    break;
                }
                case 'setting_input_reportfooter_img':{
                    update_ui(13, event_target_id);
                    break;
                }
                //settings prayer
                case 'setting_select_method':{
                    update_ui(17);
                    break;
                }
                //settings user
                case 'setting_select_user_setting':{
                    user_settings_load().then(() => settings_translate(true).then(() => settings_translate(false)));
                    break;
                }
                //profile
                case 'profile_select_user_settings':{
                    profile_show_user_setting_detail(   Number(event.target.options[event.target.selectedIndex].getAttribute('liked')), 
                                                        Number(event.target.options[event.target.selectedIndex].getAttribute('count_likes')), 
                                                        Number(event.target.options[event.target.selectedIndex].getAttribute('count_views')));
                    break;
                }
                //common
                case 'common_dialogue_user_menu_app_select_theme':{
                    AppDocument.body.className = 'app_theme' + 
                                                AppDocument.querySelector('#common_dialogue_user_menu_app_select_theme').value + ' ' + 
                                                AppDocument.querySelector('#common_dialogue_user_menu_user_arabic_script_select').value;
                    break;
                }
                case 'common_dialogue_user_menu_user_locale_select':{
                    common.common_translate_ui(event.target.value);
                    break;
                }
                case 'common_dialogue_user_menu_user_timezone_select':{
                    AppDocument.querySelector('#setting_timezone_current').innerHTML = event.target.value;
                    break;
                }
                case 'common_dialogue_user_menu_user_arabic_script_select':{
                    AppDocument.querySelector('#common_dialogue_user_menu_app_select_theme').dispatchEvent(new Event('change'));
                    break;
                }
                //module leaflet
                case 'common_module_leaflet_select_country':{
                    update_ui(5); 
                    break;
                }
                case 'common_module_leaflet_select_city':{
                    const select_country = AppDocument.querySelector('#common_module_leaflet_select_country');
                    const select_city = AppDocument.querySelector('#common_module_leaflet_select_city');
                    const select_setting = AppDocument.querySelector('#setting_select_user_setting');
                    const option = select_setting.options[select_setting.selectedIndex];
                    option.setAttribute('gps_country_id', select_country[select_country.selectedIndex].getAttribute('id'));
                    option.setAttribute('gps_city_id', select_city[select_city.selectedIndex].getAttribute('id'));
                    //popular place not on map is read when saving
                    update_ui(6);
                    const timezone = getTimezone(   AppDocument.querySelector('#setting_input_lat').innerHTML,
                                                    AppDocument.querySelector('#setting_input_long').innerHTML);
                    app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(timezone);
                    break;
                }
                case 'common_module_leaflet_select_mapstyle':{
                    update_ui(4);
                    break;
                }
            }
        });
    }
};
/**
 * App event keyup
 * @param {AppEvent} event 
 * @returns {void}
 */
const app_event_keyup = event => {
    if (event==null){
        AppDocument.querySelector('#app').addEventListener('keyup',(/**@type{AppEvent}*/event) => {
            app_event_keyup(event);
        }, true);
    }
    else{
        const event_target_id = common.element_id(event.target);
        common.common_event('keyup',event)
        .then(()=>{
            switch(event_target_id){
                //settings gps
                case 'setting_input_place':{
                    common.typewatch(update_ui, 8);
                    break;
                }
                case 'setting_input_long':
                case 'setting_input_lat':{
                    common.typewatch(update_ui, 9);
                    break;
                }
                //common
                case 'common_profile_search_input':{
                    common.search_input(event, 'profile', profile_show_app);
                    break;
                }
                case 'common_user_start_login_username':
                case 'common_user_start_login_password':{
                    if (event.code === 'Enter') {
                        event.preventDefault();
                        user_login_app().catch(()=>null);;
                    }
                    break;
                }
                //dialogue verify
                case 'common_user_verify_verification_char1':
                case 'common_user_verify_verification_char2':
                case 'common_user_verify_verification_char3':
                case 'common_user_verify_verification_char4':
                case 'common_user_verify_verification_char5':{
                    common.user_verify_check_input( AppDocument.querySelector(`#${event_target_id}`), 
                                                    'common_user_verify_verification_char' + (Number(event_target_id.substring(event_target_id.length-1))+1), user_login_app);
                    break;
                }
                case 'common_user_verify_verification_char6':{
                    common.user_verify_check_input(AppDocument.querySelector(`#${event_target_id}`), '', user_login_app);
                    break;
                }
            }
        });
    }
};
/**
 * Serviceworker
 * @returns {void}
 */
const serviceworker = () => {
    if (!window.Promise) {
        window.Promise = Promise;
    }
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'});
    }
};
/**
 * Map init
 * @returns {Promise.<void>}
 */
const init_map = async () => {
    return await new Promise((resolve) => {
        /**
         * @param{AppEventLeaflet} event
         */
        const dbl_click_event = event => {
            if (event.originalEvent.target.id == APP_GLOBAL.gps_module_leaflet_container){
                AppDocument.querySelector('#setting_input_lat').innerHTML = event.latlng.lat;
                AppDocument.querySelector('#setting_input_long').innerHTML = event.latlng.lng;
                //Update GPS position
                update_ui(9);
                const timezone = getTimezone(   event.latlng.lat, event.latlng.lng);
                app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(timezone);
            }   
        };
        common.map_init(APP_GLOBAL.gps_module_leaflet_container,
                        AppDocument.querySelector('#setting_input_long').innerHTML, 
                        AppDocument.querySelector('#setting_input_lat').innerHTML,
                        dbl_click_event,
                        map_show_search_on_map_app).then(() => {
            //GPS
            const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
            common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id'),
                                             AppDocument.querySelector('#common_module_leaflet_select_country'),0);
            if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_country_id')||null !=null) {
                //fill cities for chosen country
                update_ui(5).then(() => {
                    common.SearchAndSetSelectedIndex(select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id'),
                                                     AppDocument.querySelector('#common_module_leaflet_select_city'),0);
                    if (select_user_setting[select_user_setting.selectedIndex].getAttribute('gps_city_id')||null !=null) {
                        //set GPS for chosen city
                        update_ui(6);
                    }
                });
            }
            resolve();
        });
    });
};
/**
 * Map show qibbla
 * @returns {void}
 */
const map_show_qibbla = () => {
    common.map_line_removeall();
    common.map_line_create('qibbla', 
                    APP_GLOBAL.gps_module_leaflet_qibbla_title,
                    APP_GLOBAL.gps_module_leaflet_qibbla_text_size,
                    APP_GLOBAL.gps_module_leaflet_qibbla_long,
                    APP_GLOBAL.gps_module_leaflet_qibbla_lat,
                    AppDocument.querySelector('#setting_input_long').innerHTML,
                    AppDocument.querySelector('#setting_input_lat').innerHTML,
                    APP_GLOBAL.gps_module_leaflet_qibbla_color,
                    APP_GLOBAL.gps_module_leaflet_qibbla_width,
                    APP_GLOBAL.gps_module_leaflet_qibbla_opacity);
    common.map_line_create('qibbla_old', 
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_title,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_text_size,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_long,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_lat,
                    AppDocument.querySelector('#setting_input_long').innerHTML,
                    AppDocument.querySelector('#setting_input_lat').innerHTML,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_color,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_width,
                    APP_GLOBAL.gps_module_leaflet_qibbla_old_opacity);
};
/**
 * Map update
 * @param {string} longitude 
 * @param {string} latitude 
 * @param {number|null} zoom 
 * @param {string} text1 
 * @param {string|null} text2 
 * @param {string} marker_id 
 * @param {number} to_method 
 * @returns {Promise.<string>}
 */
const map_update_app = async (longitude, latitude, zoom, text1, text2, marker_id, to_method) => {
    return new Promise((resolve) => {
        map_show_qibbla();
        common.map_update(longitude, latitude, zoom, text1, text2, marker_id, to_method).then((/**@type{string}*/timezonetext)=> {
            resolve(timezonetext);
        });
    });
};
/**
 * Map show search on map
 * @param {*} data 
 * @returns {Promise.<void>}
 */
const map_show_search_on_map_app = async (data) =>{
    common.map_show_search_on_map(data);
    map_show_qibbla();
    common.SearchAndSetSelectedIndex('', AppDocument.querySelector('#setting_select_popular_place'),0);
    AppDocument.querySelector('#setting_input_place').innerHTML =  data.city + ', ' + data.country;
    AppDocument.querySelector('#setting_input_long').innerHTML = data.longitude;
    AppDocument.querySelector('#setting_input_lat').innerHTML = data.latitude;
    AppDocument.querySelector('#setting_select_report_timezone').value = getTimezone(  AppDocument.querySelector('#setting_input_lat').innerHTML, 
                                                                                    AppDocument.querySelector('#setting_input_long').innerHTML);
    app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(AppDocument.querySelector('#setting_select_report_timezone').value);
};
/**
 * App exception function
 * @param {Error} error
 * @returns {void}
 */
const app_exception = (error) => {
    common.show_message('EXCEPTION', null, null, null, error);
};
/**
 * Mount app
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const mount_app_app = async (framework=null) => {
    await common.mount_app(framework,
        {   Click: app_event_click,
            Change: app_event_change,
            KeyDown: null,
            KeyUp: app_event_keyup,
            Focus: null,
            Input:null});
};
/**
 * 
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {void}
 */
const init_app = parameters => {
    app_report.REPORT_GLOBAL.app_copyright = common.COMMON_GLOBAL.app_copyright;
    for (const parameter of parameters.app) {
        if (parameter['APP_DEFAULT_STARTUP_PAGE'])
            APP_GLOBAL.app_default_startup_page = parseInt(parameter['APP_DEFAULT_STARTUP_PAGE']);
        if (parameter['APP_REPORT_TIMETABLE'])
            APP_GLOBAL.app_report_timetable = parameter['APP_REPORT_TIMETABLE']; 
        if (parameter['REGIONAL_DEFAULT_CALENDAR_LANG'])
            app_report.REPORT_GLOBAL.regional_def_calendar_lang = parameter['REGIONAL_DEFAULT_CALENDAR_LANG'];
        if (parameter['REGIONAL_DEFAULT_LOCALE_EXT_PREFIX'])
            app_report.REPORT_GLOBAL.regional_def_locale_ext_prefix = parameter['REGIONAL_DEFAULT_LOCALE_EXT_PREFIX'];
        if (parameter['REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM'])
            app_report.REPORT_GLOBAL.regional_def_locale_ext_number_system = parameter['REGIONAL_DEFAULT_LOCALE_EXT_NUMBER_SYSTEM'];
        if (parameter['REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR'])
            app_report.REPORT_GLOBAL.regional_def_locale_ext_calendar = parameter['REGIONAL_DEFAULT_LOCALE_EXT_CALENDAR'];
        if (parameter['REGIONAL_DEFAULT_CALENDAR_TYPE_GREG'])
            app_report.REPORT_GLOBAL.regional_def_calendar_type_greg = parameter['REGIONAL_DEFAULT_CALENDAR_TYPE_GREG'];
        if (parameter['REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM'])
            app_report.REPORT_GLOBAL.regional_def_calendar_number_system = parameter['REGIONAL_DEFAULT_CALENDAR_NUMBER_SYSTEM'];
        if (parameter['REGIONAL_DEFAULT_DIRECTION'])
            APP_GLOBAL.regional_default_direction = parameter['REGIONAL_DEFAULT_DIRECTION'];
        if (parameter['REGIONAL_DEFAULT_LOCALE_SECOND'])
            APP_GLOBAL.regional_default_locale_second = parseInt(parameter['REGIONAL_DEFAULT_LOCALE_SECOND']);
        if (parameter['REGIONAL_DEFAULT_COLTITLE'])
            APP_GLOBAL.regional_default_coltitle = parseInt(parameter['REGIONAL_DEFAULT_COLTITLE']);
        if (parameter['REGIONAL_DEFAULT_ARABIC_SCRIPT'])
            APP_GLOBAL.regional_default_arabic_script = parameter['REGIONAL_DEFAULT_ARABIC_SCRIPT'];
        if (parameter['REGIONAL_DEFAULT_CALENDARTYPE'])
            APP_GLOBAL.regional_default_calendartype = parameter['REGIONAL_DEFAULT_CALENDARTYPE'];
        if (parameter['REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE'])
            APP_GLOBAL.regional_default_calendar_hijri_type = parameter['REGIONAL_DEFAULT_CALENDAR_HIJRI_TYPE'];
        if (parameter['GPS_DEFAULT_PLACE_ID'])
            APP_GLOBAL.gps_default_place_id = parseInt(parameter['GPS_DEFAULT_PLACE_ID']);
        if (parameter['GPS_MODULE_LEAFLET_CONTAINER'])
            APP_GLOBAL.gps_module_leaflet_container = parameter['GPS_MODULE_LEAFLET_CONTAINER'];
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_TITLE'])
            APP_GLOBAL.gps_module_leaflet_qibbla_title = parameter['GPS_MODULE_LEAFLET_QIBBLA_TITLE'];
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_TEXT_SIZE'])
            APP_GLOBAL.gps_module_leaflet_qibbla_text_size = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_TEXT_SIZE']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_LAT'])
            APP_GLOBAL.gps_module_leaflet_qibbla_lat = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_LAT']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_LONG'])
            APP_GLOBAL.gps_module_leaflet_qibbla_long = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_LONG']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_COLOR'])
            APP_GLOBAL.gps_module_leaflet_qibbla_color = parameter['GPS_MODULE_LEAFLET_QIBBLA_COLOR'];
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_WIDTH'])
            APP_GLOBAL.gps_module_leaflet_qibbla_width = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_WIDTH']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_OPACITY'])
            APP_GLOBAL.gps_module_leaflet_qibbla_opacity = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_OPACITY']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_TITLE'])
            APP_GLOBAL.gps_module_leaflet_qibbla_old_title = parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_TITLE'];
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_TEXT_SIZE'])
            APP_GLOBAL.gps_module_leaflet_qibbla_old_text_size = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_TEXT_SIZE']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_LAT'])
            APP_GLOBAL.gps_module_leaflet_qibbla_old_lat = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_LAT']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_LONG'])
            APP_GLOBAL.gps_module_leaflet_qibbla_old_long = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_LONG']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_COLOR'])
            APP_GLOBAL.gps_module_leaflet_qibbla_old_color = parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_COLOR'];
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_WIDTH'])
            APP_GLOBAL.gps_module_leaflet_qibbla_old_width = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_WIDTH']);
        if (parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_OPACITY'])
            APP_GLOBAL.gps_module_leaflet_qibbla_old_opacity = parseFloat(parameter['GPS_MODULE_LEAFLET_QIBBLA_OLD_OPACITY']);
        if (parameter['DESIGN_DEFAULT_THEME_DAY'])
            APP_GLOBAL.design_default_theme_day = parameter['DESIGN_DEFAULT_THEME_DAY'];
        if (parameter['DESIGN_DEFAULT_THEME_MONTH'])
            APP_GLOBAL.design_default_theme_month = parameter['DESIGN_DEFAULT_THEME_MONTH'];
        if (parameter['DESIGN_DEFAULT_THEME_YEAR'])
            APP_GLOBAL.design_default_theme_year = parameter['DESIGN_DEFAULT_THEME_YEAR'];
        if (parameter['DESIGN_DEFAULT_PAPERSIZE'])
            APP_GLOBAL.design_default_papersize = parameter['DESIGN_DEFAULT_PAPERSIZE'];
        if (parameter['DESIGN_DEFAULT_HIGHLIGHT_ROW'])
            APP_GLOBAL.design_default_highlight_row = parseInt(parameter['DESIGN_DEFAULT_HIGHLIGHT_ROW']);
        if (parameter['DESIGN_DEFAULT_SHOW_WEEKDAY'])
            APP_GLOBAL.design_default_show_weekday = (parameter['DESIGN_DEFAULT_SHOW_WEEKDAY']=== 'true');
        if (parameter['DESIGN_DEFAULT_SHOW_CALENDARTYPE'])
            APP_GLOBAL.design_default_show_calendartype = (parameter['DESIGN_DEFAULT_SHOW_CALENDARTYPE']=== 'true');
        if (parameter['DESIGN_DEFAULT_SHOW_NOTES'])
            APP_GLOBAL.design_default_show_notes = (parameter['DESIGN_DEFAULT_SHOW_NOTES']=== 'true');
        if (parameter['DESIGN_DEFAULT_SHOW_GPS'])
            APP_GLOBAL.design_default_show_gps = (parameter['DESIGN_DEFAULT_SHOW_GPS']=== 'true');
        if (parameter['DESIGN_DEFAULT_SHOW_TIMEZONE'])
            APP_GLOBAL.design_default_show_timezone = (parameter['DESIGN_DEFAULT_SHOW_TIMEZONE']=== 'true');
        if (parameter['TEXT_DEFAULT_REPORTTITLE1'])
            APP_GLOBAL.text_default_reporttitle1 = parameter['TEXT_DEFAULT_REPORTTITLE1'];
        if (parameter['TEXT_DEFAULT_REPORTTITLE2'])
            APP_GLOBAL.text_default_reporttitle2 = parameter['TEXT_DEFAULT_REPORTTITLE2'];
        if (parameter['TEXT_DEFAULT_REPORTTITLE3'])
            APP_GLOBAL.text_default_reporttitle3 = parameter['TEXT_DEFAULT_REPORTTITLE3'];
        if (parameter['TEXT_DEFAULT_REPORTFOOTER1'])
            APP_GLOBAL.text_default_reportfooter1 = parameter['TEXT_DEFAULT_REPORTFOOTER1'];
        if (parameter['TEXT_DEFAULT_REPORTFOOTER2'])
            APP_GLOBAL.text_default_reportfooter2 = parameter['TEXT_DEFAULT_REPORTFOOTER2'];
        if (parameter['TEXT_DEFAULT_REPORTFOOTER3'])
            APP_GLOBAL.text_default_reportfooter3 = parameter['TEXT_DEFAULT_REPORTFOOTER3'];
        if (parameter['IMAGE_HEADER_FOOTER_WIDTH'])
            APP_GLOBAL.image_header_footer_width = parameter['IMAGE_HEADER_FOOTER_WIDTH'];
        if (parameter['IMAGE_HEADER_FOOTER_HEIGHT'])
            APP_GLOBAL.image_header_footer_height = parameter['IMAGE_HEADER_FOOTER_HEIGHT'];
        if (parameter['IMAGE_DEFAULT_REPORT_HEADER_SRC']){
            if (parameter['IMAGE_DEFAULT_REPORT_HEADER_SRC']!='')
                APP_GLOBAL.image_default_report_header_src = parameter['IMAGE_DEFAULT_REPORT_HEADER_SRC'];
        }                    
        if (parameter['IMAGE_DEFAULT_REPORT_FOOTER_SRC']){
            if (parameter['IMAGE_DEFAULT_REPORT_FOOTER_SRC']!='')
                APP_GLOBAL.image_default_report_footer_src = parameter['IMAGE_DEFAULT_REPORT_FOOTER_SRC'];
        }                             
        if (parameter['PRAYER_DEFAULT_METHOD'])
            APP_GLOBAL.prayer_default_method = parameter['PRAYER_DEFAULT_METHOD'];
        if (parameter['PRAYER_DEFAULT_ASR'])
            APP_GLOBAL.prayer_default_asr = parameter['PRAYER_DEFAULT_ASR'];
        if (parameter['PRAYER_DEFAULT_HIGHLATITUDE'])
            APP_GLOBAL.prayer_default_highlatitude = parameter['PRAYER_DEFAULT_HIGHLATITUDE'];
        if (parameter['PRAYER_DEFAULT_TIMEFORMAT'])
            APP_GLOBAL.prayer_default_timeformat = parameter['PRAYER_DEFAULT_TIMEFORMAT'];
        if (parameter['PRAYER_DEFAULT_HIJRI_ADJUSTMENT'])
            APP_GLOBAL.prayer_default_hijri_adjustment = parameter['PRAYER_DEFAULT_HIJRI_ADJUSTMENT'];
        if (parameter['PRAYER_DEFAULT_IQAMAT_TITLE_FAJR'])
            APP_GLOBAL.prayer_default_iqamat_title_fajr = parameter['PRAYER_DEFAULT_IQAMAT_TITLE_FAJR'];
        if (parameter['PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR'])
            APP_GLOBAL.prayer_default_iqamat_title_dhuhr = parameter['PRAYER_DEFAULT_IQAMAT_TITLE_DHUHR'];
        if (parameter['PRAYER_DEFAULT_IQAMAT_TITLE_ASR'])
            APP_GLOBAL.prayer_default_iqamat_title_asr = parameter['PRAYER_DEFAULT_IQAMAT_TITLE_ASR'];
        if (parameter['PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB'])
            APP_GLOBAL.prayer_default_iqamat_title_maghrib = parameter['PRAYER_DEFAULT_IQAMAT_TITLE_MAGHRIB'];
        if (parameter['PRAYER_DEFAULT_IQAMAT_TITLE_ISHA'])
            APP_GLOBAL.prayer_default_iqamat_title_isha = parameter['PRAYER_DEFAULT_IQAMAT_TITLE_ISHA'];
        if (parameter['PRAYER_DEFAULT_SHOW_IMSAK'])
            APP_GLOBAL.prayer_default_show_imsak = (parameter['PRAYER_DEFAULT_SHOW_IMSAK']=== 'true');
        if (parameter['PRAYER_DEFAULT_SHOW_SUNSET'])
            APP_GLOBAL.prayer_default_show_sunset = (parameter['PRAYER_DEFAULT_SHOW_SUNSET']=== 'true');
        if (parameter['PRAYER_DEFAULT_SHOW_MIDNIGHT'])
            APP_GLOBAL.prayer_default_show_midnight = (parameter['PRAYER_DEFAULT_SHOW_MIDNIGHT']=== 'true');
        if (parameter['PRAYER_DEFAULT_SHOW_FAST_START_END'])
            APP_GLOBAL.prayer_default_show_fast_start_end = parameter['PRAYER_DEFAULT_SHOW_FAST_START_END'];
        if (parameter['MODULE_EASY.QRCODE_WIDTH'])
            common.COMMON_GLOBAL['module_easy.qrcode_width'] = parseInt(parameter['MODULE_EASY.QRCODE_WIDTH']);
        if (parameter['MODULE_EASY.QRCODE_HEIGHT'])
            common.COMMON_GLOBAL['module_easy.qrcode_height'] = parseInt(parameter['MODULE_EASY.QRCODE_HEIGHT']);
        if (parameter['MODULE_EASY.QRCODE_COLOR_DARK'])
            common.COMMON_GLOBAL['module_easy.qrcode_color_dark'] = parameter['MODULE_EASY.QRCODE_COLOR_DARK'];
        if (parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'])
            common.COMMON_GLOBAL['module_easy.qrcode_color_light'] = parameter['MODULE_EASY.QRCODE_COLOR_LIGHT'];
        if (parameter['MODULE_EASY.QRCODE_BACKGROUND_COLOR'])
            common.COMMON_GLOBAL['module_easy.qrcode_background_color'] = parameter['MODULE_EASY.QRCODE_BACKGROUND_COLOR'];
    }
    dialogue_loading(1);
    common.ComponentRender('app_profile_search',
                            {}, 
                            '/common/component/profile_search.js');
    common.ComponentRender('app_profile_toolbar',
                            {}, 
                            '/common/component/profile_toolbar.js');
    common.ComponentRender('app_user_account', 
                            {},
                            '/common/component/user_account.js');
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

    //set initial default language from clients locale
    common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL.user_local, AppDocument.querySelector('#setting_select_locale'),1);
    AppDocument.querySelector('#about_logo').style.backgroundImage=`url(${common.COMMON_GLOBAL.app_logo})`;
    
    
    //set about info
    AppDocument.querySelector('#app_copyright').innerHTML = common.COMMON_GLOBAL.app_copyright;
    if (common.COMMON_GLOBAL.app_link_url==null)
        AppDocument.querySelector('#app_link').style.display = 'none';
    else
        AppDocument.querySelector('#app_link').innerHTML = common.COMMON_GLOBAL.app_link_title;
    AppDocument.querySelector('#info_link1').innerHTML = common.COMMON_GLOBAL.info_link_policy_name;
    AppDocument.querySelector('#info_link2').innerHTML = common.COMMON_GLOBAL.info_link_disclaimer_name;
    AppDocument.querySelector('#info_link3').innerHTML = common.COMMON_GLOBAL.info_link_terms_name;
    AppDocument.querySelector('#info_link4').innerHTML = common.COMMON_GLOBAL.info_link_about_name;

    //set default geolocation
    AppDocument.querySelector('#setting_select_popular_place').selectedIndex = 0;
    AppDocument.querySelector('#setting_input_lat').innerHTML = common.COMMON_GLOBAL.client_latitude;
    AppDocument.querySelector('#setting_input_long').innerHTML = common.COMMON_GLOBAL.client_longitude;
    //load themes in Design tab
    load_themes();
    //set papersize
    zoom_paper();
    
    app_report.set_prayer_method().then(() => {
        //set timers
        //set current date and time for current locale and timezone
        /**@ts-ignore */
        clearInterval(showcurrenttime);
        setInterval(showcurrenttime, 1000);
        //set report date and time for current locale, report timezone
        /**@ts-ignore */
        clearInterval(showreporttime);
        setInterval(showreporttime, 1000);
        //show dialogue about using mobile and scan QR code after 5 seconds
        setTimeout(() => {show_dialogue('SCAN');}, 5000);
        set_default_settings().then(() => {
            settings_translate(true).then(() => {
                settings_translate(false).then(() => {
                    const show_start = async () => {
                        //show default startup
                        await toolbar_button(APP_GLOBAL.app_default_startup_page);
                        const user = window.location.pathname.substring(1);
                        if (user !='') {
                            //show profile for user entered in url
                            profile_show_app(null, user);
                        }
                    };
                    show_start().then(() => {
                        dialogue_loading(0);
                        serviceworker();
                        if (common.COMMON_GLOBAL.user_locale != navigator.language.toLowerCase())
                            common.common_translate_ui(common.COMMON_GLOBAL.user_locale)
                            .then(()=> mount_app_app());
                        else
                            mount_app_app();
                    });
                });
            });
        });
    });
};
/**
 * 
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {void}
 */
const init = parameters => {
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app(parameters);   
    });
};
export{ init};