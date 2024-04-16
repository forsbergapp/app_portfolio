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
/**
 * @typedef {{
 *          id:number,
 *          description: string,
 *          regional_language_locale: string,
 *          regional_timezone: string,
 *          regional_number_system: string,
 *          regional_layout_direction: string,
 *          regional_second_language_locale: string,
 *          regional_column_title: string,
 *          regional_arabic_script: string,
 *          regional_calendar_type: string,
 *          regional_calendar_hijri_type: string,
 *          gps_popular_place_id: number|null,
 *          gps_lat_text: number|null,
 *          gps_long_text: number|null,
 *          design_theme_day_id: string,
 *          design_theme_month_id: string,
 *          design_theme_year_id: string,
 *          design_paper_size: string,
 *          design_row_highlight: string,
 *          design_column_weekday_checked: number,
 *          design_column_calendartype_checked: number,
 *          design_column_notes_checked: number,
 *          design_column_gps_checked: number,
 *          design_column_timezone_checked: number,
 *          image_header_image_img: string,
 *          image_footer_image_img: string,
 *          text_header_1_text: string,
 *          text_header_2_text: string,
 *          text_header_3_text: string,
 *          text_header_align: string|null,
 *          text_footer_1_text: string,
 *          text_footer_2_text: string,
 *          text_footer_3_text: string,
 *          text_footer_align: string|null,
 *          prayer_method: string,
 *          prayer_asr_method: string,
 *          prayer_high_latitude_adjustment: string,
 *          prayer_time_format: string,
 *          prayer_hijri_date_adjustment: number,
 *          prayer_fajr_iqamat: string,
 *          prayer_dhuhr_iqamat: string,
 *          prayer_asr_iqamat: string,
 *          prayer_maghrib_iqamat: string,
 *          prayer_isha_iqamat: string,
 *          prayer_column_imsak_checked: number,
 *          prayer_column_sunset_checked: number,
 *          prayer_column_midnight_checked: number,
 *          prayer_column_fast_start_end: number
 *      }} json_data_user_setting
 */
/**@type{json_data_user_setting} */
const user_settings_empty = {   id:0,
                                description: '',
                                regional_language_locale: '',
                                regional_timezone: '',
                                regional_number_system: '',
                                regional_layout_direction: '',
                                regional_second_language_locale: '',
                                regional_column_title: '0',
                                regional_arabic_script: '',
                                regional_calendar_type: '',
                                regional_calendar_hijri_type: '',
                                gps_popular_place_id: null,
                                gps_lat_text: null,
                                gps_long_text: null,

                                design_theme_day_id: '',
                                design_theme_month_id: '',
                                design_theme_year_id: '',
                                design_paper_size: '',
                                design_row_highlight: '0',
                                design_column_weekday_checked: 0,
                                design_column_calendartype_checked: 0,
                                design_column_notes_checked: 0,
                                design_column_gps_checked: 0,
                                design_column_timezone_checked: 0,

                                image_header_image_img: '',
                                image_footer_image_img: '',

                                text_header_1_text: '',
                                text_header_2_text: '',
                                text_header_3_text: '',
                                text_header_align: null,
                                text_footer_1_text: '',
                                text_footer_2_text: '',
                                text_footer_3_text: '',
                                text_footer_align: null,

                                prayer_method: '',
                                prayer_asr_method: '',
                                prayer_high_latitude_adjustment: '',
                                prayer_time_format: '',
                                prayer_hijri_date_adjustment: 0,
                                prayer_fajr_iqamat: '',
                                prayer_dhuhr_iqamat: '',
                                prayer_asr_iqamat: '',
                                prayer_maghrib_iqamat: '',
                                prayer_isha_iqamat: '',
                                prayer_column_imsak_checked: 0,
                                prayer_column_sunset_checked: 0,
                                prayer_column_midnight_checked: 0,
                                prayer_column_fast_start_end: 0};
const APP_GLOBAL = {
    app_default_startup_page:0,
    app_report_timetable:'',

    regional_default_direction:'',
    regional_default_locale_second:'0',
    regional_default_coltitle:'0',
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
    design_default_highlight_row:'0',
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
    prayer_default_hijri_adjustment:0,
    prayer_default_iqamat_title_fajr:'',
    prayer_default_iqamat_title_dhuhr:'',
    prayer_default_iqamat_title_asr:'',
    prayer_default_iqamat_title_maghrib:'',
    prayer_default_iqamat_title_isha:'',
    prayer_default_show_imsak:false,
    prayer_default_show_sunset:false,
    prayer_default_show_midnight:false,
    prayer_default_show_fast_start_end:0,

    //session variables
    timetable_type:0,
    places:[{id:null, app_id:null, app_setting_type_name:'', value:'', data2:'', data3:'', data4:'', data5:'', text:''}],
    user_settings:[user_settings_empty]
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
                <link rel='stylesheet' type='text/css' href=${AppDocument.querySelector('#app_link_app_report_css').attributes['href'].nodeValue} />
                <link rel='stylesheet' type='text/css' href=${AppDocument.querySelector('#common_link_common_css').attributes['href'].nodeValue} />
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
                                                    mobile_function:common.mobile}, '/common/component/window_info.js');
};
/**
 * Get report settings
 * @returns {object}
 */
const getReportSettings = () => {
    const setting_global = APP_GLOBAL.user_settings[AppDocument.querySelector('#setting_select_user_setting').selectedIndex];
    const place = APP_GLOBAL.places.filter((/**@type{*}*/place)=>place.value==setting_global.gps_popular_place_id)[0];
    return {    locale              	: setting_global.regional_language_locale,
                timezone            	: setting_global.regional_timezone,
                number_system       	: setting_global.regional_number_system,
                direction           	: setting_global.regional_layout_direction,
                second_locale       	: setting_global.regional_second_language_locale,
                coltitle            	: setting_global.regional_column_title,
                arabic_script       	: setting_global.regional_arabic_script,
                calendartype        	: setting_global.regional_calendar_type,
                calendar_hijri_type 	: setting_global.regional_calendar_hijri_type,

                place               	: place?place.text:setting_global.description,
                gps_lat             	: setting_global.gps_lat_text,
                gps_long            	: setting_global.gps_long_text,

                theme_day           	: 'theme_day_' + setting_global.design_theme_day_id,
                theme_month         	: 'theme_month_' + setting_global.design_theme_month_id,
                theme_year          	: 'theme_year_' + setting_global.design_theme_year_id,    
                //papersize missing
                highlight           	: setting_global.design_row_highlight,
                show_weekday        	: setting_global.design_column_weekday_checked,
                show_calendartype   	: setting_global.design_column_calendartype_checked,
                show_notes          	: setting_global.design_column_notes_checked,
                show_gps   	       		: setting_global.design_column_gps_checked,
                show_timezone       	: setting_global.design_column_timezone_checked,
                
                header_img_src      	: setting_global.image_header_image_img,
				footer_img_src      	: setting_global.image_footer_image_img,

                header_txt1         	: setting_global.text_header_1_text,
                header_txt2         	: setting_global.text_header_2_text,
                header_txt3         	: setting_global.text_header_3_text,
                header_align            : setting_global.text_header_align,
                footer_txt1         	: setting_global.text_footer_1_text,
                footer_txt2         	: setting_global.text_footer_2_text,
                footer_txt3    	   		: setting_global.text_footer_3_text,
                footer_align            : setting_global.text_footer_align,
                
                method              	: setting_global.prayer_method,
                asr                 	: setting_global.prayer_asr_method,
                highlat             	: setting_global.prayer_high_latitude_adjustment,
                format              	: setting_global.prayer_time_format,
                hijri_adj           	: setting_global.prayer_hijri_date_adjustment,
                iqamat_fajr         	: setting_global.prayer_fajr_iqamat,
                iqamat_dhuhr        	: setting_global.prayer_dhuhr_iqamat,
                iqamat_asr          	: setting_global.prayer_asr_iqamat,
                iqamat_maghrib      	: setting_global.prayer_maghrib_iqamat,
                iqamat_isha         	: setting_global.prayer_isha_iqamat,
                show_imsak          	: setting_global.prayer_column_imsak_checked,
                show_sunset         	: setting_global.prayer_column_sunset_checked,
                show_midnight       	: setting_global.prayer_column_midnight_checked,
                show_fast_start_end 	: setting_global.prayer_column_fast_start_end,
                
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
            const current_user_settings =[];
            for (const setting of APP_GLOBAL.user_settings){
                current_user_settings.push(
                {
                description : setting.description,
                regional_language_locale : setting.regional_language_locale,
                regional_timezone : setting.regional_timezone,
                regional_number_system : setting.regional_number_system,
                regional_calendar_hijri_type : setting.regional_calendar_hijri_type,
                gps_lat_text : setting.gps_lat_text,
                gps_long_text : setting.gps_long_text,
                prayer_method : setting.prayer_method,
                prayer_asr_method : setting.prayer_asr_method,
                prayer_high_latitude_adjustment : setting.prayer_high_latitude_adjustment,
                prayer_time_format : setting.prayer_time_format,
                prayer_hijri_date_adjustment : setting.prayer_hijri_date_adjustment
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
    else{
        /**@ts-ignore */
        return APP_GLOBAL.user_settings[select_user_setting.selectedIndex]['design_theme_' + type + '_id'];
    }
        
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
        locale = APP_GLOBAL.user_settings[AppDocument.querySelector('#setting_select_user_setting').selectedIndex].regional_language_locale;
    }
    else
        locale = APP_GLOBAL.user_settings[AppDocument.querySelector('#setting_select_user_setting').selectedIndex].regional_second_language_locale;
    if (locale != '0'){
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
                APP_GLOBAL.user_settings[AppDocument.querySelector('#setting_select_user_setting').selectedIndex].regional_second_language_locale =='0'){
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
    if (AppDocument.querySelector('#setting_current_date_time_display')){
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
    }
};
/**
 * Show timetable time
 * @returns {void}
 */
const showreporttime = () => {
    const select = AppDocument.querySelector('#setting_select_report_timezone');
    if (select && select.selectedIndex>0){
        const options = {
            timeZone: select[select.selectedIndex].value,
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
            let user_locale;
            let user_options;
            //loop user settings
            for (const setting of APP_GLOBAL.user_settings) {
                user_options = {
                    timeZone: setting.regional_timezone,
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'long'
                };
    
                user_locale = setting.regional_language_locale;
                //set user setting time, select index and order should be the same as div timetable_day_current_time indexes
                /**@ts-ignore */
                user_current_time[setting.index].innerHTML = new Date().toLocaleTimeString(user_locale, user_options);
            }
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
                printTimetable();
                break;
            }
        case 2:
        case 3:
        case 4:
            {
                if (common.mobile())
                    paper.style.display = 'block';
                settings.style.visibility = 'hidden';
                AppDocument.querySelector(`#toolbar_btn_day`).classList.remove('toolbar_bottom_selected');
                AppDocument.querySelector(`#toolbar_btn_month`).classList.remove('toolbar_bottom_selected');
                AppDocument.querySelector(`#toolbar_btn_year`).classList.remove('toolbar_bottom_selected');
                AppDocument.querySelector(`#toolbar_btn_${choice==2?'day':choice==3?'month':'year'}`).classList.add('toolbar_bottom_selected');

                //choice day=0, month=1, year=2
                await update_timetable_report(choice==2?0:choice==3?1:2, null, getReportSettings());
                break;
            }
        //settings
        case 5:
            {
                //Hide paper on mobile device when showing settings, scrollbug in background
                if (common.mobile())
                    paper.style.display = 'none';
                settings.style.visibility = 'visible';
                openTab(1);
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

/**
 * Open navigation tab
 * @param {number} tab_selected 
 */
const openTab = async (tab_selected) => {
    //remove interval in tab 1 regional
    /**@ts-ignore */
    clearInterval(showcurrenttime);
    /**@ts-ignore */
    clearInterval(showreporttime);

    //remove Leaflet listeners if any one used
    if (common.COMMON_GLOBAL.app_eventListeners.LEAFLET.length>0){
        for (const listener of common.COMMON_GLOBAL.app_eventListeners.LEAFLET){
            listener[0].removeEventListener(listener[1], listener[2]);
        }
    }
    common.COMMON_GLOBAL.app_eventListeners.LEAFLET = [];

    //empty all tab content
    common.ComponentRemove('settings_tab1');
    common.ComponentRemove('settings_tab2');
    common.ComponentRemove('settings_tab3');
    common.ComponentRemove('settings_tab4');
    common.ComponentRemove('settings_tab5');
    common.ComponentRemove('settings_tab6');
    if (common.COMMON_GLOBAL.user_account_id == null)
        AppDocument.querySelector(`#settings_tab_nav_7`).style.display = 'none';
    else
        AppDocument.querySelector(`#settings_tab_nav_7`).style.display = 'inline-block';
    if (tab_selected==7)
        AppDocument.querySelector('#user_settings').style.display = 'block';
    else
        AppDocument.querySelector('#user_settings').style.display = 'none';
            
    //remove mark for all tabs
    AppDocument.querySelectorAll('.settings_tab_nav').forEach((/**@type{HTMLElement}*/tab)=>tab.classList.remove('settings_tab_nav_selected'));
    //mark active tab
    AppDocument.querySelector('#settings_tab_nav_' + tab_selected).classList.add('settings_tab_nav_selected');
    if (tab_selected!=7)
        common.ComponentRender(`settings_tab${tab_selected}`, {}, `/component/settings_tab${tab_selected}.js`)
        .then(()=>settings_load(tab_selected));
    
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
        common.ComponentRender('dialogue_loading', {}, '/component/dialogue_loading.js')
    }
    else{
        common.ComponentRemove('dialogue_loading', true);
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
 * Show dialogue
 * @param {*} dialogue 
 * @returns {void}
 */
const show_dialogue = (dialogue) => {
    if (dialogue == 'SCAN' && common.mobile()==false){
        common.ComponentRender('dialogue_scan_open_mobile', {
                                                                function_create_qr:common.create_qr,
                                                                function_getHostname:common.getHostname 
                                                            }, '/component/dialogue_scan_open_mobile.js');
    }
};
/**
 * Update ui
 * @param {'REGIONAL'|'GPS'|'DESIGN'|'IMAGE'|'TEXT'|'PRAYER'|'USER'} setting_tab
 * @param {string} setting_type
 * @param {string|null} item_id 
 * @returns {Promise.<void>}
 */
const component_setting_update = async (setting_tab, setting_type, item_id=null) => {
    const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');

    switch (setting_tab + '_' + setting_type) {
        case 'REGIONAL_TIMEZONE':
            {
                //Update report date and time for current locale, report timezone format
                /**@ts-ignore */
                clearInterval(showreporttime);
                setInterval(showreporttime, 1000);
                break;
            }
        case 'GPS_MAP':
            {
                const gps_lat_input = AppDocument.querySelector('#setting_input_lat');
                const gps_long_input = AppDocument.querySelector('#setting_input_long');
                map_update_app({longitude:gps_long_input.innerHTML,
                                latitude:gps_lat_input.innerHTML,
                                zoomvalue:common.COMMON_GLOBAL.module_leaflet_zoom,
                                text_place:AppDocument.querySelector('#setting_input_place').innerHTML,
                                country:'',
                                city:'',
                                timezone_text :null,
                                marker_id:common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                to_method:common.COMMON_GLOBAL.module_leaflet_jumpto
                            });
                break;
            }
        case 'GPS_CITIES':
            {
                const country = AppDocument.querySelector('#common_module_leaflet_select_country');
                const city = AppDocument.querySelector('#common_module_leaflet_select_city');
                //set default option
                city.innerHTML='<option value=\'\' id=\'\' label=\'…\' selected=\'selected\'>…</option>';
                //common.SearchAndSetSelectedIndex('', settings.select_place,0);
                if (country[country.selectedIndex].getAttribute('country_code')!=null){
                    //fetch list including default option
                    city.innerHTML = await common.get_cities(country[country.selectedIndex].getAttribute('country_code').toUpperCase());
                }
                break;
            }
        case 'GPS_CITY':
            {                    
                //read from Leaflet module and custom code
                //read from latest popup
                const popup = AppDocument.querySelectorAll('.common_module_leaflet_popup_sub_title_gps')[AppDocument.querySelectorAll('.common_module_leaflet_popup_sub_title_gps').length - 1 ];
                const country = popup.getAttribute('data-country');
                const city = popup.getAttribute('data-city');
                const timezone = popup.getAttribute('data-timezone');
                const latitude = popup.getAttribute('data-latitude');
                const longitude = popup.getAttribute('data-longitude');
                
                //update value in app
                const select_place = AppDocument.querySelector('#setting_select_popular_place');
                const gps_lat_input = AppDocument.querySelector('#setting_input_lat');
                const gps_long_input = AppDocument.querySelector('#setting_input_long');
                gps_long_input.innerHTML = longitude;
                gps_lat_input.innerHTML = latitude;

                if (city=='' && country==''){
                    //Set place from city + country from popup title
                    AppDocument.querySelector('#setting_input_place').innerHTML = 
                        AppDocument.querySelectorAll('.common_module_leaflet_popup_title')[AppDocument.querySelectorAll('.common_module_leaflet_popup_title').length - 1 ].innerHTML;
                }
                else{
                    //Set place from city + country from data attributes
                    AppDocument.querySelector('#setting_input_place').innerHTML = city + ', ' + country;
                }
                //display empty popular place select
                common.SearchAndSetSelectedIndex('', select_place,0);

                map_show_qibbla();
                APP_GLOBAL.user_settings[select_user_setting.selectedIndex].regional_timezone = timezone;
                app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(timezone);
                settings_update('GPS');    
                break;
            }
        case 'GPS_POPULAR_PLACES':
            {
                const country = AppDocument.querySelector('#common_module_leaflet_select_country');
                const city = AppDocument.querySelector('#common_module_leaflet_select_city');
                const select_place = AppDocument.querySelector('#setting_select_popular_place');
                const gps_lat_input = AppDocument.querySelector('#setting_input_lat');
                const gps_long_input = AppDocument.querySelector('#setting_input_long');
                //set GPS and timezone
                const longitude_selected = select_place[select_place.selectedIndex].getAttribute('longitude');
                const latitude_selected = select_place[select_place.selectedIndex].getAttribute('latitude');
                const timezone_selected = select_place[select_place.selectedIndex].getAttribute('timezone');
                gps_long_input.innerHTML = longitude_selected;
                gps_lat_input.innerHTML = latitude_selected;
                    //Update map
                    map_update_app({longitude:gps_long_input.innerHTML,
                                    latitude:gps_lat_input.innerHTML,
                                    zoomvalue:common.COMMON_GLOBAL.module_leaflet_zoom_pp, //zoom for popular places
                                    text_place:select_place.options[select_place.selectedIndex].text,
                                    country:'',
                                    city:'',
                                    timezone_text :timezone_selected,
                                    marker_id:common.COMMON_GLOBAL.module_leaflet_marker_div_pp, //marker for popular places
                                    to_method:common.COMMON_GLOBAL.module_leaflet_flyto
                                });
                    //display empty country
                    common.SearchAndSetSelectedIndex('', country,0);
                    //remove old city list:            
                    const old_groups = city.querySelectorAll('optgroup');
                    for (let old_index = old_groups.length - 1; old_index >= 0; old_index--)
                        city.removeChild(old_groups[old_index]);
                    //display first empty city
                    common.SearchAndSetSelectedIndex('', city,0);
                APP_GLOBAL.user_settings[select_user_setting.selectedIndex].regional_timezone = timezone_selected;
                const title = select_place.options[select_place.selectedIndex].text;
                AppDocument.querySelector('#setting_input_place').innerHTML = title;
                settings_update('GPS');
                break;
            }
        case 'GPS_POSITION':
            {
                const country = AppDocument.querySelector('#common_module_leaflet_select_country');
                const city = AppDocument.querySelector('#common_module_leaflet_select_city');
                const select_place = AppDocument.querySelector('#setting_select_popular_place');
                const gps_lat_input = AppDocument.querySelector('#setting_input_lat');
                const gps_long_input = AppDocument.querySelector('#setting_input_long');
                common.SearchAndSetSelectedIndex('', select_place,0);
                common.get_place_from_gps(gps_long_input.innerHTML, gps_lat_input.innerHTML).then((/**@type{string}*/gps_place) => {
                    //Update map
                    AppDocument.querySelector('#setting_input_place').innerHTML = gps_place;
                    map_update_app({longitude:gps_long_input.innerHTML,
                                    latitude:gps_lat_input.innerHTML,
                                    zoomvalue:null, //do not change zoom 
                                    text_place:gps_place,
                                    country:'',
                                    city:'',
                                    timezone_text :null,
                                    marker_id:common.COMMON_GLOBAL.module_leaflet_marker_div_gps,
                                    to_method:common.COMMON_GLOBAL.module_leaflet_jumpto})
                    .then((timezone_text) => {
                        APP_GLOBAL.user_settings[select_user_setting.selectedIndex].regional_timezone = timezone_text;
                    });
                    //display empty country and city
                    common.SearchAndSetSelectedIndex('', country,0);
                    common.SearchAndSetSelectedIndex('', city,0);
                    settings_update('GPS');
                });
                break;
            }
        case 'DESIGN_PAPER':
            {
                const paper = AppDocument.querySelector('#paper');
                const paper_size = AppDocument.querySelector('#setting_select_report_papersize').value;
                switch (paper_size) {
                    case 'A4':
                        {
                            paper.className='A4';
                            break;
                        }
                    case 'Letter':
                        {
                            paper.className='Letter';
                            break;
                        }
                    default:
                        break;
                }
                break;
            }
        case 'IMAGE_HEADER_LOAD':
        case 'IMAGE_FOOTER_LOAD':
            {
                await common.show_image( AppDocument.querySelector(`#setting_report${setting_type=='HEADER_LOAD'?'header':'footer'}_img`), 
                                        item_id, 
                                        APP_GLOBAL.image_header_footer_width, 
                                        APP_GLOBAL.image_header_footer_height);
                break;
            }
        case 'IMAGE_HEADER_CLEAR':
        case 'IMAGE_FOOTER_CLEAR':
            {
                const preview_item  = AppDocument.querySelector(`#setting_report${setting_type=='HEADER_CLEAR'?'header':'footer'}_img`);
                const preview_input = AppDocument.querySelector(`#setting_input_report${setting_type=='HEADER_CLEAR'?'header':'footer'}_img`);
                common.recreate_img(preview_item);
                preview_input.value = '';
                break;
            }
        case 'TEXT_HEADER_ALIGN':
        case 'TEXT_FOOTER_ALIGN':
            {
                const button_active_class  = 'setting_button_active';
                const header_footer = setting_type=='HEADER_ALIGN'?'header':'footer';
                //check if clicking on button that is already active then deactivate so no alignment
                if (AppDocument.querySelector('#' + item_id).classList.contains(button_active_class)){
                    AppDocument.querySelector('#' + item_id).classList.remove(button_active_class);
                }
                else{
                    AppDocument.querySelector(`#setting_icon_text_${header_footer}_aleft`).classList.remove(button_active_class);
                    AppDocument.querySelector(`#setting_icon_text_${header_footer}_acenter`).classList.remove(button_active_class);
                    AppDocument.querySelector(`#setting_icon_text_${header_footer}_aright`).classList.remove(button_active_class);
                    
                    AppDocument.querySelector('#' + item_id).classList.add(button_active_class);
                }
                const align = get_align(AppDocument.querySelector(`#setting_icon_text_${header_footer}_aleft`).classList.contains('setting_button_active'),
                                        AppDocument.querySelector(`#setting_icon_text_${header_footer}_acenter`).classList.contains('setting_button_active'),
                                        AppDocument.querySelector(`#setting_icon_text_${header_footer}_aright`).classList.contains('setting_button_active'));
                AppDocument.querySelector(`#setting_input_report${header_footer}1`).style.textAlign= align;
                AppDocument.querySelector(`#setting_input_report${header_footer}2`).style.textAlign= align;
                AppDocument.querySelector(`#setting_input_report${header_footer}3`).style.textAlign= align;
                break;
            }
        case 'PRAYER_METHOD':
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
    .then((/**@type{{   user_id: number,
                        username: string,
                        bio: string, 
                        avatar: string}}*/result)=>{
        //create intitial user setting if not exist, send initial=true
        login_common(result.avatar);
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
    
    common.user_logoff().then(() => {
        AppDocument.querySelector('#settings_tab_nav_7').innerHTML = '';
        common.ComponentRemove('common_dialogue_profile', true);
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
 * Login common
 * @param {string} avatar 
 */
const login_common = (avatar) => {
    //create intitial user setting if not exist, send initial=true
    user_settings_function('ADD_LOGIN', true)
    .then(()=>{
        AppDocument.querySelector('#settings_tab_nav_7').innerHTML = '<img id=\'user_setting_avatar_img\' >';
        common.set_avatar(avatar, AppDocument.querySelector('#user_setting_avatar_img')); 

        //Hide settings
        AppDocument.querySelector('#settings').style.visibility = 'hidden';
        common.ComponentRemove('common_dialogue_profile');
        
        AppDocument.querySelector('#paper').innerHTML='';
        dialogue_loading(1);
        user_settings_get().then(() => {
            settings_translate(true).then(() => {
                settings_translate(false).then(() => {
                    //show default startup
                    toolbar_button(APP_GLOBAL.app_default_startup_page);
                    dialogue_loading(0);
                });
            });
        });
    })
}
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
        login_common(result.avatar);
    })
    .catch(()=>null);
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
        APP_GLOBAL.user_settings = [];
        //fill select
        let option_html = '';
        let i=0;
        for (const user_account_app_setting of JSON.parse(result)) {
            const settings = JSON.parse(user_account_app_setting.json_data);
            APP_GLOBAL.user_settings.push({
                    id:user_account_app_setting.id,
                    description:settings.description,
                    regional_language_locale:settings.regional_language_locale,
                    regional_timezone:settings.regional_timezone,
                    regional_number_system:settings.regional_number_system,
                    regional_layout_direction:settings.regional_layout_direction,
                    regional_second_language_locale:settings.regional_second_language_locale,
                    regional_column_title:settings.regional_column_title,
                    regional_arabic_script:settings.regional_arabic_script,
                    regional_calendar_type:settings.regional_calendar_type,
                    regional_calendar_hijri_type:settings.regional_calendar_hijri_type,
                    gps_popular_place_id: settings.gps_popular_place_id,
                    gps_lat_text:fixFloat(settings.gps_lat_text),
                    gps_long_text:fixFloat(settings.gps_long_text),
                    design_theme_day_id:settings.design_theme_day_id,
                    design_theme_month_id:settings.design_theme_month_id,
                    design_theme_year_id:settings.design_theme_year_id,
                    design_paper_size:settings.design_paper_size,
                    design_row_highlight:settings.design_row_highlight,
                    design_column_weekday_checked:Number(settings.design_column_weekday_checked),
                    design_column_calendartype_checked:Number(settings.design_column_calendartype_checked),
                    design_column_notes_checked:Number(settings.design_column_notes_checked),
                    design_column_gps_checked:Number(settings.design_column_gps_checked),
                    design_column_timezone_checked:Number(settings.design_column_timezone_checked),
                    image_header_image_img:common.image_format(settings.image_header_image_img),
                    image_footer_image_img:common.image_format(settings.image_footer_image_img),
                    text_header_1_text:settings.text_header_1_text,
                    text_header_2_text:settings.text_header_2_text,
                    text_header_3_text:settings.text_header_3_text,
                    text_header_align:settings.text_header_align==''?null:settings.text_header_align,
                    text_footer_1_text:settings.text_footer_1_text,
                    text_footer_2_text:settings.text_footer_2_text,
                    text_footer_3_text:settings.text_footer_3_text,
                    text_footer_align:settings.text_footer_align==''?null:settings.text_footer_align,
                    prayer_method:settings.prayer_method,
                    prayer_asr_method:settings.prayer_asr_method,
                    prayer_high_latitude_adjustment:settings.prayer_high_latitude_adjustment,
                    prayer_time_format:settings.prayer_time_format,
                    prayer_hijri_date_adjustment:Number(settings.prayer_hijri_date_adjustment),
                    prayer_fajr_iqamat:settings.prayer_fajr_iqamat,
                    prayer_dhuhr_iqamat:settings.prayer_dhuhr_iqamat,
                    prayer_asr_iqamat:settings.prayer_asr_iqamat,
                    prayer_maghrib_iqamat:settings.prayer_maghrib_iqamat,
                    prayer_isha_iqamat:settings.prayer_isha_iqamat,
                    prayer_column_imsak_checked:Number(settings.prayer_column_imsak_checked),
                    prayer_column_sunset_checked:Number(settings.prayer_column_sunset_checked),
                    prayer_column_midnight_checked:Number(settings.prayer_column_midnight_checked),
                    prayer_column_fast_start_end:Number(settings.prayer_column_fast_start_end)
            });
            option_html += `<option value=${i} id=${user_account_app_setting.id} >${settings.description}</option>`;
            i++;
        }
        select.innerHTML += option_html;
    })
    .catch(()=>null);
};
/**
 * User setting show link
 * @param {HTMLElement} item 
 * @returns {void}
 */
const user_setting_link = (item) => {
    const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
    const user_account_id = common.COMMON_GLOBAL.user_account_id;    
    const sid = APP_GLOBAL.user_settings[select_user_setting.selectedIndex].id;
    switch (item.id){
        case 'user_day_html':
        case 'user_month_html':
        case 'user_year_html':{
            const url = get_report_url(user_account_id, 
                                     sid, 
                                     APP_GLOBAL.user_settings[select_user_setting.selectedIndex].design_paper_size,
                                     item.id,
                                     'HTML');
            common.ComponentRender('common_window_info',
                    {   info:2,
                        url:null,
                        content_type:'HTML', 
                        iframe_content:url,
                        iframe_class:APP_GLOBAL.user_settings[select_user_setting.selectedIndex].design_paper_size}, '/common/component/window_info.js');
            break;
        }
        case 'user_day_pdf':
        case 'user_month_pdf':
        case 'user_year_pdf':{
            const url = get_report_url(user_account_id, 
                                     sid, 
                                     APP_GLOBAL.user_settings[select_user_setting.selectedIndex].design_paper_size,
                                     item.id,
                                     'PDF');
            common.ComponentRender('common_window_info',
                    {   info:2,
                        url:null,
                        content_type:'PDF', 
                        iframe_content:url,
                        iframe_class:APP_GLOBAL.user_settings[select_user_setting.selectedIndex].design_paper_size}, '/common/component/window_info.js');
            break;
        }
    }
};
/**
 * User settings load
 * @param {number} tab_selected
 * @returns {Promise.<void>}
 */
const user_settings_load = async (tab_selected) => {

    const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
    const settings_index = select_user_setting.selectedIndex;
    switch (tab_selected){
        case 1:{
            //Regional
            AppDocument.querySelector('#setting_select_locale').value = APP_GLOBAL.user_settings[settings_index].regional_language_locale;
            AppDocument.querySelector('#setting_timezone_current').innerHTML = common.COMMON_GLOBAL.user_timezone;
            AppDocument.querySelector('#setting_select_report_timezone').value = APP_GLOBAL.user_settings[settings_index].regional_timezone;
            AppDocument.querySelector('#setting_select_report_numbersystem').value = APP_GLOBAL.user_settings[settings_index].regional_number_system;
            AppDocument.querySelector('#setting_select_report_direction').value = APP_GLOBAL.user_settings[settings_index].regional_layout_direction;
            AppDocument.querySelector('#setting_select_report_locale_second').value = APP_GLOBAL.user_settings[settings_index].regional_second_language_locale;
            AppDocument.querySelector('#setting_select_report_coltitle').value = APP_GLOBAL.user_settings[settings_index].regional_column_title;
            AppDocument.querySelector('#setting_select_report_arabic_script').value = APP_GLOBAL.user_settings[settings_index].regional_arabic_script;
            AppDocument.querySelector('#setting_select_calendartype').value = APP_GLOBAL.user_settings[settings_index].regional_calendar_type;
            AppDocument.querySelector('#setting_select_calendar_hijri_type').value = APP_GLOBAL.user_settings[settings_index].regional_calendar_hijri_type;
            break;
        }
        case 2:{
            //GPS
            common.SearchAndSetSelectedIndex(   APP_GLOBAL.user_settings[settings_index].gps_popular_place_id,
                                                AppDocument.querySelector('#setting_select_popular_place'),0);
            if (APP_GLOBAL.user_settings[settings_index].gps_popular_place_id||null !=null) {
                //set GPS for chosen popular place
                component_setting_update('GPS', 'POPULAR_PLACES');
            }
            AppDocument.querySelector('#setting_input_place').innerHTML = APP_GLOBAL.user_settings[settings_index].description;
            AppDocument.querySelector('#setting_input_lat').innerHTML = APP_GLOBAL.user_settings[settings_index].gps_lat_text;
            AppDocument.querySelector('#setting_input_long').innerHTML = APP_GLOBAL.user_settings[settings_index].gps_long_text;
            break;
        }
        case 3:{
            //Design
            set_theme_id('day', APP_GLOBAL.user_settings[settings_index].design_theme_day_id);
            set_theme_id('month', APP_GLOBAL.user_settings[settings_index].design_theme_month_id);
            set_theme_id('year', APP_GLOBAL.user_settings[settings_index].design_theme_year_id);
            AppDocument.querySelector('#setting_select_report_papersize').value = APP_GLOBAL.user_settings[settings_index].design_paper_size;
            
            AppDocument.querySelector('#paper').className=APP_GLOBAL.user_settings[settings_index].design_paper_size;

            AppDocument.querySelector('#setting_select_report_highlight_row').value = APP_GLOBAL.user_settings[settings_index].design_row_highlight;
            if (Number(APP_GLOBAL.user_settings[settings_index].design_column_weekday_checked))
                AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.add('checked');
            else
                AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.remove('checked');
            if (Number(APP_GLOBAL.user_settings[settings_index].design_column_calendartype_checked))
                AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.add('checked');
            else
                AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.remove('checked');
            if (Number(APP_GLOBAL.user_settings[settings_index].design_column_notes_checked))
                AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.add('checked');
            else
                AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.remove('checked');
            if (Number(APP_GLOBAL.user_settings[settings_index].design_column_gps_checked))
                AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.add('checked');
            else
                AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.remove('checked');
            if (Number(APP_GLOBAL.user_settings[settings_index].design_column_timezone_checked))
                AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.add('checked');
            else
                AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.remove('checked');
            break;
        }
        case 4:{
            //Image
            //dont set null value, it will corrupt IMG tag
            AppDocument.querySelector('#setting_input_reportheader_img').value = '';
            if (APP_GLOBAL.user_settings[settings_index].image_header_image_img == null ||
                APP_GLOBAL.user_settings[settings_index].image_header_image_img == '') {
                common.recreate_img(AppDocument.querySelector('#setting_reportheader_img'));
            } else
                AppDocument.querySelector('#setting_reportheader_img').src = APP_GLOBAL.user_settings[settings_index].image_header_image_img;

            AppDocument.querySelector('#setting_input_reportfooter_img').value = '';
            if (APP_GLOBAL.user_settings[settings_index].image_footer_image_img == null ||
                APP_GLOBAL.user_settings[settings_index].image_footer_image_img == '') {
                AppDocument.querySelector('#setting_reportfooter_img').src = '';
                common.recreate_img(AppDocument.querySelector('#setting_reportfooter_img'));
            } else
                AppDocument.querySelector('#setting_reportfooter_img').src = APP_GLOBAL.user_settings[settings_index].image_footer_image_img;
            break;
        }
        case 5:{
            //Text
            AppDocument.querySelector('#setting_input_reportheader1').innerHTML = APP_GLOBAL.user_settings[settings_index].text_header_1_text;
            AppDocument.querySelector('#setting_input_reportheader2').innerHTML = APP_GLOBAL.user_settings[settings_index].text_header_2_text;
            AppDocument.querySelector('#setting_input_reportheader3').innerHTML = APP_GLOBAL.user_settings[settings_index].text_header_3_text;
            if (APP_GLOBAL.user_settings[settings_index].text_header_align == null) {
                AppDocument.querySelector('#setting_icon_text_header_aleft').classList.remove('setting_button_active');
                AppDocument.querySelector('#setting_icon_text_header_acenter').classList.remove('setting_button_active');
                AppDocument.querySelector('#setting_icon_text_header_aright').classList.remove('setting_button_active');
            } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
                //remove active class if it is active
                AppDocument.querySelector(  '#setting_icon_text_header_a' + 
                                            APP_GLOBAL.user_settings[settings_index].text_header_align).classList.remove('setting_button_active');
                component_setting_update('TEXT', 'HEADER_ALIGN', 'setting_icon_text_header_a' + APP_GLOBAL.user_settings[settings_index].text_header_align);
            }
            AppDocument.querySelector('#setting_input_reportfooter1').innerHTML = APP_GLOBAL.user_settings[settings_index].text_footer_1_text;
            AppDocument.querySelector('#setting_input_reportfooter2').innerHTML = APP_GLOBAL.user_settings[settings_index].text_footer_2_text;
            AppDocument.querySelector('#setting_input_reportfooter3').innerHTML = APP_GLOBAL.user_settings[settings_index].text_footer_3_text;
            if (APP_GLOBAL.user_settings[settings_index].text_footer_align == null) {
                AppDocument.querySelector('#setting_icon_text_footer_aleft').classList.remove('setting_button_active');
                AppDocument.querySelector('#setting_icon_text_footer_acenter').classList.remove('setting_button_active');
                AppDocument.querySelector('#setting_icon_text_footer_aright').classList.remove('setting_button_active');
            } else { //update with 'left', 'center' or 'right' adding to bject name and add active class to this object
                //remove active class if it is active
                AppDocument.querySelector('#setting_icon_text_footer_a' +
                    APP_GLOBAL.user_settings[settings_index].text_footer_align).classList.remove('setting_button_active');
                component_setting_update('TEXT', 'FOOTER_ALIGN', 'setting_icon_text_footer_a' + APP_GLOBAL.user_settings[settings_index].text_footer_align);
            }
            break;
        }
        case 6:{
            //Prayer
            AppDocument.querySelector('#setting_select_method').value = APP_GLOBAL.user_settings[settings_index].prayer_method;
            //show method parameters used
            component_setting_update('PRAYER', 'METHOD');
            AppDocument.querySelector('#setting_select_asr').value = APP_GLOBAL.user_settings[settings_index].prayer_asr_method;
            AppDocument.querySelector('#setting_select_highlatitude').value = APP_GLOBAL.user_settings[settings_index].prayer_high_latitude_adjustment;
            AppDocument.querySelector('#setting_select_timeformat').value = APP_GLOBAL.user_settings[settings_index].prayer_time_format;
            AppDocument.querySelector('#setting_select_hijri_adjustment').value = APP_GLOBAL.user_settings[settings_index].prayer_hijri_date_adjustment;
            AppDocument.querySelector('#setting_select_report_iqamat_title_fajr').value = APP_GLOBAL.user_settings[settings_index].prayer_fajr_iqamat;
            AppDocument.querySelector('#setting_select_report_iqamat_title_dhuhr').value = APP_GLOBAL.user_settings[settings_index].prayer_dhuhr_iqamat;
            AppDocument.querySelector('#setting_select_report_iqamat_title_asr').value = APP_GLOBAL.user_settings[settings_index].prayer_asr_iqamat;
            AppDocument.querySelector('#setting_select_report_iqamat_title_maghrib').value = APP_GLOBAL.user_settings[settings_index].prayer_maghrib_iqamat;
            AppDocument.querySelector('#setting_select_report_iqamat_title_isha').value = APP_GLOBAL.user_settings[settings_index].prayer_isha_iqamat;
            if (Number(APP_GLOBAL.user_settings[settings_index].prayer_column_imsak_checked))
                AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.add('checked');
            else
                AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.remove('checked');
            if (Number(APP_GLOBAL.user_settings[settings_index].prayer_column_sunset_checked))
                AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.add('checked');
            else
                AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.remove('checked');
            if (Number(APP_GLOBAL.user_settings[settings_index].prayer_column_midnight_checked))
                AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.add('checked');
            else
                AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.remove('checked');
            AppDocument.querySelector('#setting_select_report_show_fast_start_end').value = APP_GLOBAL.user_settings[settings_index].prayer_column_fast_start_end;
            break;
        }
        case 7:{
            break;
        }
    }
};
/**
 * User settings function
 * @param {string} function_name 
 * @param {boolean} initial_user_setting 
 * @returns {Promise.<void>}
 */
const user_settings_function = async (function_name, initial_user_setting) => {
    const select_user_setting = AppDocument.querySelector('#setting_select_user_setting');
    
    if (common.input_control(null,{
                                    check_valid_list_values:[
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].description,null],
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].gps_lat_text,null],
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].gps_long_text,null],
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].text_header_1_text,null],
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].text_header_2_text,null],
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].text_header_3_text,null],
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].text_footer_1_text,null],
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].text_footer_2_text,null],
                                                [APP_GLOBAL.user_settings[select_user_setting.selectedIndex].text_footer_3_text,null]
                                                ]})==true){
        
        const json_data = { description:        APP_GLOBAL.user_settings[0].description,
                            json_data:          APP_GLOBAL.user_settings[0],
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
                    select_user_setting.innerHTML += `<option id=${JSON.parse(result).id}>${APP_GLOBAL.user_settings[select_user_setting.selectedIndex].description}</option>`;
                    select_user_setting.selectedIndex = select_user_setting.options[select_user_setting.options.length - 1].index;
                    select_user_setting.options[select_user_setting.options.length - 1].value = select_user_setting.selectedIndex;
                    settings_update('USER');
                    AppDocument.querySelector('#setting_btn_user_add').classList.remove('css_spinner');
                    break;
                }
                case 'SAVE':{
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
                common.ComponentRemove('common_dialogue_message', true);
                const select = AppDocument.querySelector('#setting_select_user_setting');
                //delete current option
                select.remove(select.selectedIndex);
                if (select_user_setting.length == 0) {
                    user_settings_function('ADD', false)
                    .then(()=>AppDocument.querySelector('#setting_btn_user_delete').classList.remove('css_spinner'));
                }
                else{
                    //load next available
                    user_settings_load(7)
                    .then(()=>settings_translate(true))
                    .then(()=>settings_translate(false))
                    .then(()=>AppDocument.querySelector('#setting_btn_user_delete').classList.remove('css_spinner'));
                }
                
            })
            .catch(()=>{common.ComponentRemove('common_dialogue_message', true);
                        AppDocument.querySelector('#setting_btn_user_delete').classList.remove('css_spinner')});
        }
    }
};
/**
 * Set default settings
 * @returns {Promise.<void>}
 */
const set_default_settings = async () => {
    common.COMMON_GLOBAL.user_locale = navigator.language.toLowerCase();
    const select_user_settings = AppDocument.querySelector('#setting_select_user_setting');
    select_user_settings.innerHTML = '<option></option>';
    select_user_settings.options[0].text = common.COMMON_GLOBAL.client_place;
    //update APP_GLOBAL
    APP_GLOBAL.user_settings = [{
        id:0,
        description:                        common.COMMON_GLOBAL.client_place,
        regional_language_locale:           common.COMMON_GLOBAL.user_locale,
        regional_timezone:                  (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude)?
                                                getTimezone(common.COMMON_GLOBAL.client_latitude, common.COMMON_GLOBAL.client_longitude):
                                                    APP_GLOBAL.places.filter((/**@type{*}*/place)=>place.value==APP_GLOBAL.gps_default_place_id)[0].data4,
        regional_number_system:             Intl.NumberFormat().resolvedOptions().numberingSystem,
        regional_layout_direction:          APP_GLOBAL.regional_default_direction,
        regional_second_language_locale:    APP_GLOBAL.regional_default_locale_second,
        regional_column_title:              APP_GLOBAL.regional_default_coltitle,
        regional_arabic_script:             APP_GLOBAL.regional_default_arabic_script,
        regional_calendar_type:             APP_GLOBAL.regional_default_calendartype,
        regional_calendar_hijri_type:       APP_GLOBAL.regional_default_calendar_hijri_type,
        gps_popular_place_id:               (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude)?null:
                                                APP_GLOBAL.gps_default_place_id,
        gps_lat_text:                       (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude)?fixFloat(common.COMMON_GLOBAL.client_latitude):
                                                fixFloat(APP_GLOBAL.places.filter((/**@type{*}*/place)=>place.value==APP_GLOBAL.gps_default_place_id)[0].data2),
        gps_long_text:                      (common.COMMON_GLOBAL.client_latitude && common.COMMON_GLOBAL.client_longitude)?fixFloat(common.COMMON_GLOBAL.client_longitude):
                                                fixFloat(APP_GLOBAL.places.filter((/**@type{*}*/place)=>place.value==APP_GLOBAL.gps_default_place_id)[0].data3),
        design_theme_day_id:                APP_GLOBAL.design_default_theme_day,
        design_theme_month_id:              APP_GLOBAL.design_default_theme_month,
        design_theme_year_id:               APP_GLOBAL.design_default_theme_year,
        design_paper_size:                  APP_GLOBAL.design_default_papersize,
        design_row_highlight:               APP_GLOBAL.design_default_highlight_row,
        design_column_weekday_checked:      Number(APP_GLOBAL.design_default_show_weekday),
        design_column_calendartype_checked: Number(APP_GLOBAL.design_default_show_calendartype),
        design_column_notes_checked:        Number(APP_GLOBAL.design_default_show_notes),
        design_column_gps_checked:          Number(APP_GLOBAL.design_default_show_gps),
        design_column_timezone_checked:     Number(APP_GLOBAL.design_default_show_timezone),
        image_header_image_img:             APP_GLOBAL.image_default_report_header_src,
        image_footer_image_img:             APP_GLOBAL.image_default_report_footer_src,
        text_header_1_text:                 APP_GLOBAL.text_default_reporttitle1,
        text_header_2_text:                 APP_GLOBAL.text_default_reporttitle2,
        text_header_3_text:                 APP_GLOBAL.text_default_reporttitle3,
        text_header_align:                  null,
        text_footer_1_text:                 APP_GLOBAL.text_default_reportfooter1,
        text_footer_2_text:                 APP_GLOBAL.text_default_reportfooter2,
        text_footer_3_text:                 APP_GLOBAL.text_default_reportfooter3,
        text_footer_align:                  null,
        prayer_method:                      APP_GLOBAL.prayer_default_method,
        prayer_asr_method:                  APP_GLOBAL.prayer_default_asr,
        prayer_high_latitude_adjustment:    APP_GLOBAL.prayer_default_highlatitude,
        prayer_time_format:                 APP_GLOBAL.prayer_default_timeformat,
        prayer_hijri_date_adjustment:       Number(APP_GLOBAL.prayer_default_hijri_adjustment),
        prayer_fajr_iqamat:                 APP_GLOBAL.prayer_default_iqamat_title_fajr,
        prayer_dhuhr_iqamat:                APP_GLOBAL.prayer_default_iqamat_title_dhuhr,
        prayer_asr_iqamat:                  APP_GLOBAL.prayer_default_iqamat_title_asr,
        prayer_maghrib_iqamat:              APP_GLOBAL.prayer_default_iqamat_title_maghrib,
        prayer_isha_iqamat:                 APP_GLOBAL.prayer_default_iqamat_title_isha,
        prayer_column_imsak_checked:        Number(APP_GLOBAL.prayer_default_show_imsak),
        prayer_column_sunset_checked:       Number(APP_GLOBAL.prayer_default_show_sunset),
        prayer_column_midnight_checked:     Number(APP_GLOBAL.prayer_default_show_midnight),
        prayer_column_fast_start_end:       Number(APP_GLOBAL.prayer_default_show_fast_start_end)
    }];
    //Design
    AppDocument.querySelector('#paper').className=APP_GLOBAL.design_default_papersize;
};
 /**
  * 
  * @param {string} value 
  * @returns {number|null}
  */
const fixFloat = value =>  (value==''||value==null)?null:parseFloat(value);
/**
 * Settings update
 * @param {'REGIONAL'|'GPS'|'DESIGN'|'IMAGE'|'TEXT'|'PRAYER'|'USER'} setting_tab
 * @returns {void}
 */
const settings_update = setting_tab => {
    const select_user_settings = AppDocument.querySelector('#setting_select_user_setting');
    const option = select_user_settings.options[select_user_settings.selectedIndex];

    //save from DOM element if DOM element is mounted in settings component or keep old value
    APP_GLOBAL.user_settings[select_user_settings.selectedIndex] = {
            id:option.id,
            description:                        setting_tab=='GPS'?AppDocument.querySelector('#setting_input_place').innerHTML:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].description,
            regional_language_locale:           setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_locale').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_language_locale,
            regional_timezone:                  setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_report_timezone').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_timezone,
            regional_number_system:             setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_report_numbersystem').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_number_system,
            regional_layout_direction:          setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_report_direction').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_layout_direction,
            regional_second_language_locale:    setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_report_locale_second').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_second_language_locale,
            regional_column_title:              setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_report_coltitle').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_column_title,
            regional_arabic_script:             setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_report_arabic_script').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_arabic_script,
            regional_calendar_type:             setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_calendartype').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_calendar_type,
            regional_calendar_hijri_type:       setting_tab=='REGIONAL'?AppDocument.querySelector('#setting_select_calendar_hijri_type').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].regional_calendar_hijri_type,
            gps_popular_place_id:               setting_tab=='GPS'?
                                                    AppDocument.querySelector('#setting_select_popular_place')[AppDocument.querySelector('#setting_select_popular_place').selectedIndex].getAttribute('id'):
                                                        APP_GLOBAL.user_settings[select_user_settings.selectedIndex].gps_popular_place_id,
            gps_lat_text:                       setting_tab=='GPS'?fixFloat(AppDocument.querySelector('#setting_input_lat').innerHTML):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].gps_lat_text,
            gps_long_text:                      setting_tab=='GPS'?fixFloat(AppDocument.querySelector('#setting_input_long').innerHTML):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].gps_long_text,
            design_theme_day_id:                setting_tab=='DESIGN'?get_theme_id('day'):APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_theme_day_id,
            design_theme_month_id:              setting_tab=='DESIGN'?get_theme_id('month'):APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_theme_month_id,
            design_theme_year_id:               setting_tab=='DESIGN'?get_theme_id('year'):APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_theme_year_id,
            design_paper_size:                  setting_tab=='DESIGN'?AppDocument.querySelector('#setting_select_report_papersize').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_paper_size,
            design_row_highlight:               setting_tab=='DESIGN'?AppDocument.querySelector('#setting_select_report_highlight_row').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_row_highlight,
            design_column_weekday_checked:      setting_tab=='DESIGN'?Number(AppDocument.querySelector('#setting_checkbox_report_show_weekday').classList.contains('checked')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_column_weekday_checked,
            design_column_calendartype_checked: setting_tab=='DESIGN'?Number(AppDocument.querySelector('#setting_checkbox_report_show_calendartype').classList.contains('checked')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_column_calendartype_checked,
            design_column_notes_checked:        setting_tab=='DESIGN'?Number(AppDocument.querySelector('#setting_checkbox_report_show_notes').classList.contains('checked')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_column_notes_checked,
            design_column_gps_checked:          setting_tab=='DESIGN'?Number(AppDocument.querySelector('#setting_checkbox_report_show_gps').classList.contains('checked')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_column_gps_checked,
            design_column_timezone_checked:     setting_tab=='DESIGN'?Number(AppDocument.querySelector('#setting_checkbox_report_show_timezone').classList.contains('checked')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].design_column_timezone_checked,
            image_header_image_img:             setting_tab=='IMAGE'?AppDocument.querySelector('#setting_reportheader_img').src:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].image_header_image_img,
            image_footer_image_img:             setting_tab=='IMAGE'?AppDocument.querySelector('#setting_reportfooter_img').src:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].image_footer_image_img,
            text_header_1_text:                 setting_tab=='TEXT'?AppDocument.querySelector('#setting_input_reportheader1').innerHTML:  
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].text_header_1_text,
            text_header_2_text:                 setting_tab=='TEXT'?AppDocument.querySelector('#setting_input_reportheader2').innerHTML:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].text_header_2_text,
            text_header_3_text:                 setting_tab=='TEXT'?AppDocument.querySelector('#setting_input_reportheader3').innerHTML:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].text_header_3_text,
            text_header_align:                  setting_tab=='TEXT'? (align_button_value('header')==''?null:align_button_value('header')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].text_header_align,
            text_footer_1_text:                 setting_tab=='TEXT'?AppDocument.querySelector('#setting_input_reportfooter1').innerHTML:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].text_footer_1_text,
            text_footer_2_text:                 setting_tab=='TEXT'?AppDocument.querySelector('#setting_input_reportfooter2').innerHTML:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].text_footer_2_text,
            text_footer_3_text:                 setting_tab=='TEXT'?AppDocument.querySelector('#setting_input_reportfooter3').innerHTML:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].text_footer_3_text,
            text_footer_align:                  setting_tab=='TEXT'? (align_button_value('footer')==''?null:align_button_value('footer')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].text_footer_align,
            prayer_method:                      setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_method').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_method,
            prayer_asr_method:                  setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_asr').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_asr_method,
            prayer_high_latitude_adjustment:    setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_highlatitude').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_high_latitude_adjustment,
            prayer_time_format:                 setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_timeformat').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_time_format,
            prayer_hijri_date_adjustment:       setting_tab=='PRAYER'?Number(AppDocument.querySelector('#setting_select_hijri_adjustment').value):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_hijri_date_adjustment,
            prayer_fajr_iqamat:                 setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_report_iqamat_title_fajr').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_fajr_iqamat,
            prayer_dhuhr_iqamat:                setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_report_iqamat_title_dhuhr').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_dhuhr_iqamat,
            prayer_asr_iqamat:                  setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_report_iqamat_title_asr').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_asr_iqamat,
            prayer_maghrib_iqamat:              setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_report_iqamat_title_maghrib').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_maghrib_iqamat,
            prayer_isha_iqamat:                 setting_tab=='PRAYER'?AppDocument.querySelector('#setting_select_report_iqamat_title_isha').value:
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_isha_iqamat,
            prayer_column_imsak_checked:        setting_tab=='PRAYER'?Number(AppDocument.querySelector('#setting_checkbox_report_show_imsak').classList.contains('checked')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_column_imsak_checked,
            prayer_column_sunset_checked:       setting_tab=='PRAYER'?Number(AppDocument.querySelector('#setting_checkbox_report_show_sunset').classList.contains('checked')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_column_sunset_checked,
            prayer_column_midnight_checked:     setting_tab=='PRAYER'?Number(AppDocument.querySelector('#setting_checkbox_report_show_midnight').classList.contains('checked')):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_column_midnight_checked,
            prayer_column_fast_start_end:       setting_tab=='PRAYER'?Number(AppDocument.querySelector('#setting_select_report_show_fast_start_end').value):
                                                    APP_GLOBAL.user_settings[select_user_settings.selectedIndex].prayer_column_fast_start_end
    };

    option.text = setting_tab=='GPS'?AppDocument.querySelector('#setting_input_place').innerHTML:option.text;
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
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('click',(/**@type{AppEvent}*/event) => {
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
                    common.ComponentRemove('dialogue_info', true);
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
                    
                    common.ComponentRender('dialogue_info', {   
                                                                about_logo:common.COMMON_GLOBAL.app_logo,
                                                                app_copyright:common.COMMON_GLOBAL.app_copyright,
                                                                app_link_url:common.COMMON_GLOBAL.app_link_url,
                                                                app_link_title: common.COMMON_GLOBAL.app_link_title,
                                                                info_link_policy_name:common.COMMON_GLOBAL.info_link_policy_name,
                                                                info_link_disclaimer_name:common.COMMON_GLOBAL.info_link_disclaimer_name,
                                                                info_link_terms_name:common.COMMON_GLOBAL.info_link_terms_name,
                                                                info_link_about_name:common.COMMON_GLOBAL.info_link_about_name
                                                            }, '/component/dialogue_info.js');
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
                case 'settings_tab_nav_1':
                case 'settings_tab_nav_2':
                case 'settings_tab_nav_3':
                case 'settings_tab_nav_4':
                case 'settings_tab_nav_5':
                case 'settings_tab_nav_6':{
                    openTab(Number(event_target_id.substring(event_target_id.length-1)));
                    break;
                }
                case 'settings_tab_nav_7':
                case 'user_setting_avatar_img':{
                    openTab(7);
                    break;
                }
                case 'scan_open_mobile_close':{
                    common.ComponentRemove('dialogue_scan_open_mobile', true);
                    break;
                }
                //settings
                case 'settings_close':{
                    common.ComponentRemove('settings_tab1');
                    common.ComponentRemove('settings_tab2');
                    common.ComponentRemove('settings_tab3');
                    common.ComponentRemove('settings_tab4');
                    common.ComponentRemove('settings_tab5');
                    common.ComponentRemove('settings_tab6');
                    if (common.mobile())
                        AppDocument.querySelector('#paper').style.display = 'block';
                    AppDocument.querySelector('#settings').style.visibility = 'hidden';
                    const timetable_type = AppDocument.querySelector(`#toolbar_bottom .toolbar_bottom_selected`).id
                                                .toLowerCase()
                                                .substring('toolbar_btn_'.length);
                    update_timetable_report(timetable_type=='day'?0:timetable_type=='month'?1:2, null, getReportSettings());
                    break;
                }
                
                //setting design
                case 'slider_prev_day':{
                    theme_nav(-1, 'day');
                    settings_update('DESIGN');
                    break;
                }
                case 'slider_next_day':{
                    theme_nav(1, 'day');
                    settings_update('DESIGN');
                    break;
                }
                case 'slider_prev_month':{
                    theme_nav(-1, 'month');
                    settings_update('DESIGN');
                    break;
                }
                case 'slider_next_month':{
                    theme_nav(1, 'month');
                    settings_update('DESIGN');
                    break;
                }
                case 'slider_prev_year':{
                    theme_nav(-1, 'year');
                    settings_update('DESIGN');
                    break;
                }
                case 'slider_next_year':{
                    theme_nav(1, 'year');
                    settings_update('DESIGN');
                    break;
                }
                case 'setting_checkbox_report_show_weekday':
                case 'setting_checkbox_report_show_calendartype':
                case 'setting_checkbox_report_show_notes':
                case 'setting_checkbox_report_show_gps':
                case 'setting_checkbox_report_show_timezone':{
                    settings_update('DESIGN');
                    break;
                }    
                //settings image
                case 'setting_icon_image_header_img':{
                    AppDocument.querySelector('#setting_input_reportheader_img').click();
                    break;
                }
                case 'setting_icon_image_header_clear':{
                    component_setting_update('IMAGE', 'HEADER_CLEAR');
                    settings_update('IMAGE');
                    break;
                }
                case 'setting_icon_image_footer_img':{
                    AppDocument.querySelector('#setting_input_reportfooter_img').click();
                    break;
                }
                case 'setting_icon_image_footer_clear':{
                    component_setting_update('IMAGE', 'FOOTER_CLEAR');
                    settings_update('IMAGE');
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
                                                                                        APP_GLOBAL.user_settings[AppDocument.querySelector('#setting_select_user_setting').selectedIndex].regional_arabic_script;
                    break;
                }
                case 'setting_icon_text_header_aleft':
                case 'setting_icon_text_header_acenter':
                case 'setting_icon_text_header_aright':{
                    component_setting_update('TEXT', 'HEADER_ALIGN', event_target_id);
                    settings_update('TEXT');
                    break;
                }
                case 'setting_icon_text_footer_aleft':
                case 'setting_icon_text_footer_acenter':
                case 'setting_icon_text_footer_aright':{
                    component_setting_update('TEXT', 'FOOTER_ALIGN', event_target_id);
                    settings_update('TEXT');
                    break;
                }
                //settings prayer
                case 'setting_checkbox_report_show_imsak':
                case 'setting_checkbox_report_show_sunset':
                case 'setting_checkbox_report_show_midnight':{
                    settings_update('PRAYER');
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
                   framework_set(1);
                    break;
                }
                case 'common_toolbar_framework_vue':{
                   framework_set(2);
                    break;
                }
                case 'common_toolbar_framework_react':{
                   framework_set(3);
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
                            user_account_id:common.COMMON_GLOBAL.user_account_id,
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
                            function_show_message:common.show_message},
                                                '/common/component/dialogue_user_menu.js')
                        .then(()=>common.ComponentRender(   'common_dialogue_user_menu_app_theme', 
                                                            {function_app_theme_update:common.common_preferences_post_mount},
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
                case 'common_user_start_identity_provider_login':{
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
                    //update timezone
                    AppDocument.querySelector('#setting_select_report_timezone').value = getTimezone(common.COMMON_GLOBAL.client_latitude, common.COMMON_GLOBAL.client_longitude);
                    //set qibbla
                    map_show_qibbla();
                    app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(AppDocument.querySelector('#setting_select_report_timezone').value);
                    settings_update('GPS');
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
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('change',(/**@type{AppEvent}*/event) => {
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
                    settings_update('REGIONAL');
                    settings_translate(true);
                    break;
                }
                case 'setting_select_report_timezone':{
                    settings_update('REGIONAL');
                    component_setting_update('REGIONAL', 'TIMEZONE');
                    break;
                }
                case 'setting_select_report_numbersystem':
                case 'setting_select_report_direction':{
                    settings_update('REGIONAL');
                    break;
                }
                case 'setting_select_report_locale_second':{
                    settings_update('REGIONAL');
                    settings_translate(false);
                    break;
                }
                case 'setting_select_report_coltitle':
                case 'setting_select_report_arabic_script':
                case 'setting_select_calendartype':
                case 'setting_select_calendar_hijri_type':{
                    settings_update('REGIONAL');
                    break;
                }
                //settings gps
                case 'setting_select_popular_place':{
                    settings_update('GPS');
                    component_setting_update('GPS', 'POPULAR_PLACES');
                    break;
                }
                //settings design
                case 'setting_select_report_papersize':{
                    settings_update('DESIGN');
                    component_setting_update('DESIGN', 'PAPER');
                    break;
                }
                case 'setting_select_report_highlight_row':{
                    settings_update('DESIGN');
                    break;
                }
                //settings image
                case 'setting_input_reportheader_img':{
                    component_setting_update('IMAGE', 'HEADER_LOAD',  event_target_id)
                    .then(()=> settings_update('IMAGE'));
                    break;
                }
                case 'setting_input_reportfooter_img':{
                    component_setting_update('IMAGE', 'FOOTER_LOAD', event_target_id)
                    .then(()=> settings_update('IMAGE'));
                    break;
                }
                //settings prayer
                case 'setting_select_method':{
                    component_setting_update('PRAYER', 'METHOD');
                    settings_update('PRAYER');
                    break;
                }
                case 'setting_select_asr':
                case 'setting_select_highlatitude':
                case 'setting_select_timeformat':
                case 'setting_select_hijri_adjustment':
                case 'setting_select_report_iqamat_title_fajr':
                case 'setting_select_report_iqamat_title_dhuhr':
                case 'setting_select_report_iqamat_title_asr':
                case 'setting_select_report_iqamat_title_maghrib':
                case 'setting_select_report_iqamat_title_isha':
                case 'setting_select_report_show_fast_start_end':{
                    settings_update('PRAYER');
                    break;
                }
                //settings user
                case 'setting_select_user_setting':{
                    user_settings_load(7).then(() => settings_translate(true).then(() => settings_translate(false)));
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
                    AppDocument.body.className = 'app_theme' + AppDocument.querySelector('#common_dialogue_user_menu_app_select_theme').value;
                    common.common_preferences_update_body_class_from_preferences();
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
                    AppDocument.body.className = 'app_theme' + AppDocument.querySelector('#common_dialogue_user_menu_app_select_theme').value;
                    common.common_preferences_update_body_class_from_preferences();
                    break;
                }
                //module leaflet
                case 'common_module_leaflet_select_country':{
                    component_setting_update('GPS', 'CITIES'); 
                    settings_update('GPS');
                    break;
                }
                case 'common_module_leaflet_select_city':{
                    //popular place not on map is read when saving
                    component_setting_update('GPS', 'CITY');
                    break;
                }
                case 'common_module_leaflet_select_mapstyle':{
                    component_setting_update('GPS', 'MAP');
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
        AppDocument.querySelector(`#${common.COMMON_GLOBAL.app_root}`).addEventListener('keyup',(/**@type{AppEvent}*/event) => {
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
                    settings_update('GPS');
                    break;
                }
                case 'setting_input_long':
                case 'setting_input_lat':{
                    settings_update('GPS');
                    common.typewatch(component_setting_update, 'GPS', 'POSITION');
                    break;
                }
                //settings text
                case 'setting_input_reportheader1':
                case 'setting_input_reportheader2':
                case 'setting_input_reportheader3':
                case 'setting_input_reportfooter1':
                case 'setting_input_reportfooter2':
                case 'setting_input_reportfooter3':{
                    settings_update('TEXT');
                    break;
                }
                //common
                case 'common_profile_search_input':{
                    common.list_key_event(event, 'profile', profile_show_app);
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
 * @param {{longitude:string,
 *          latitude:string,
 *          zoomvalue:number|null,
 *          text_place:string,
 *          country:string,
 *          city:string,
 *          timezone_text :string|null,
 *          marker_id:string,
 *          to_method:number
 *          }} parameters
 * @returns {Promise.<string>}
 */
const map_update_app = async (parameters) => {
    return new Promise((resolve) => {
        map_show_qibbla();
        common.map_update({ longitude:parameters.longitude,
                            latitude:parameters.latitude,
                            zoomvalue:parameters.zoomvalue,
                            text_place:parameters.text_place,
                            country:'',
                            city:'',
                            timezone_text :parameters.timezone_text,
                            marker_id:parameters.marker_id,
                            to_method:parameters.to_method
                        }).then((/**@type{string}*/timezonetext)=> {
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
    await common.map_show_search_on_map(data);
    component_setting_update('GPS', 'CITY')
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
 * Sets framework
 * @param {number|null} framework 
 * @returns {Promise.<void>}
 */
const framework_set = async (framework=null) => {
    await common.framework_set(framework,
        {   Click: app_event_click,
            Change: app_event_change,
            KeyDown: null,
            KeyUp: app_event_keyup,
            Focus: null,
            Input:null});
};
/**
 * Nvl returns '' if null else the value
 * @param {string|null} value
 * @returns {string|null}
 * 
 */
 const nvl = value => value==null?'':value;
/**
 * @returns {Promise.<void>}
 */
 const settings_method = async () => {
    return await common.FFB('DB_API', `/app_settings_display?data_app_id=${common.COMMON_GLOBAL.app_id}&setting_type=METHOD`, 'GET', 'APP_DATA')
                            .then((/**@type{string}*/result)=>JSON.parse(result))
                            .catch((/**@type{Error}*/error)=>error);
 } 
/**
 * @param {number} tab_selected
 * @returns {Promise.<void>}
 */
const settings_load = async (tab_selected) => {    
    /**
     * Get themes
     * @param {number} app_id
     * @param {*} app_settings
     * @returns {{day:string, month:string,year:string}}
     */
    const themes = (app_id, app_settings) =>{
        let theme_found = false;
        let span_themes_day ='', span_themes_month='', span_themes_year='';
        //get themes and save result in three theme variables
        for (const app_setting of app_settings.filter((/**@type{*}*/setting)=>setting.app_id == app_id && setting.app_setting_type_name.startsWith('REPORT_THEME'))){        
            if (theme_found==false){
                theme_found = true;
            }
            let theme_type;
            switch (app_setting.app_setting_type_name){
                case 'REPORT_THEME_BASIC_DAY':
                case 'REPORT_THEME_PREMIUM_DAY':{
                    theme_type = 'day';
                    break;
                }
                case 'REPORT_THEME_BASIC_MONTH':
                case 'REPORT_THEME_PREMIUM_MONTH':{
                    theme_type = 'month';
                    break;
                }
                case 'REPORT_THEME_BASIC_YEAR':
                case 'REPORT_THEME_PREMIUM_YEAR':{
                    theme_type = 'year';
                    break;
                }
            }
            const new_span = `<div class="slide slide_${theme_type}">
                                <div id='theme_${theme_type}_${app_setting.value}'
                                    data-theme_id='${app_setting.value}'> 
                                </div>
                            </div>`;
            switch (app_setting.app_setting_type_name){
                case 'REPORT_THEME_BASIC_DAY':{
                    span_themes_day += new_span;
                    break;
                }
                case 'REPORT_THEME_PREMIUM_DAY':{
                    span_themes_day += new_span;
                    break;
                }
                case 'REPORT_THEME_BASIC_MONTH':{
                    span_themes_month += new_span;
                    break;
                }
                case 'REPORT_THEME_PREMIUM_MONTH':{
                    span_themes_month += new_span;
                    break;
                }
                case 'REPORT_THEME_BASIC_YEAR':{
                    span_themes_year += new_span;
                    break;
                }
                case 'REPORT_THEME_PREMIUM_YEAR':{
                    span_themes_year += new_span;
                    break;
                }
            }
        }
        if (theme_found)
            return {day:span_themes_day, month:span_themes_month, year:span_themes_year};
        else
            return {day:'', month:'', year:''};
    };
    /**
     * Get places
     * @param {number} app_id
     * @param {*} app_settings
     * @returns {string}
     */
    const places = (app_id, app_settings) => {
        let select_places = '';
        let place_found = false;
        let i = 0;
        APP_GLOBAL.places = app_settings.filter((/**@type{*}*/setting)=>setting.app_id==app_id && setting.app_setting_type_name=='PLACE');
        for (const app_setting of APP_GLOBAL.places){
            if (place_found==false){
                place_found = true;
                select_places  =`<option value="" id="" latitude="0" longitude="0" timezone="">...</option>`;
            }
            i++;
            //data 2 = latitude
            //data 3 = longitude
            //data 4 = timezone
            //data 5 = icon
            select_places +=
            `<option  value='${i}' 
                        id='${app_setting.value}' 
                        latitude='${app_setting.data2}' 
                        longitude='${app_setting.data3}' 
                        timezone='${app_setting.data4}'>${app_setting.data5} ${app_setting.text}
                </option>`;
        }
        if (place_found)
            return select_places;
        else{
            return `<option value="" id="" latitude="0" longitude="0" timezone="">...</option>`;
        }
    };
    let USER_TIMEZONE ='';
    let USER_DIRECTION='';
    let USER_ARABIC_SCRIPT='';
    let APP_NUMBER_SYSTEM='';
    let APP_COLUMN_TITLE='';
    let APP_CALENDAR_TYPE='';
    let APP_CALENDAR_HIJRI_TYPE='';

    let APP_THEMES={day:'',month:'',year:''};
    let APP_PLACES = '';
    let APP_PAPER_SIZE='';
    let APP_HIGHLIGHT_ROW='';

    let APP_METHOD='';
    let APP_METHOD_ASR='';
    let APP_HIGH_LATITUDE_ADJUSTMENT='';
    let APP_TIMEFORMAT='';
    let APP_HIJRI_DATE_ADJUSTMENT='';
    let APP_IQAMAT='';
    let APP_FAST_START_END='';
    
    if (tab_selected==1 || tab_selected==2 || tab_selected==3 || tab_selected==6){
        /**@type{{  id:number,
         *          value:string,
         *          text:string,
         *          app_setting_type_name:string,
         *          data2:string,
         *          data3:string,
         *          data4:string,
         *          data5:string}[]} */
        const app_settings_db = await common.FFB('DB_API', `/app_settings?`, 'GET', 'APP_DATA')
        .then((/**@type{string}*/result)=>JSON.parse(result))
        .catch((/**@type{Error}*/error)=>{throw error});
        let option;
        for (const app_setting of app_settings_db) {
            option = `<option id=${app_setting.id} value='${app_setting.value}'>${app_setting.text}</option>`;
            switch (app_setting.app_setting_type_name){
                case 'TIMEZONE':{
                    USER_TIMEZONE += option;
                    break;
                }
                case 'DIRECTION':{
                    USER_DIRECTION += option;
                    break;
                }
                case 'ARABIC_SCRIPT':{
                    USER_ARABIC_SCRIPT += option;
                    break;
                }
                case 'NUMBER_SYSTEM':{
                    APP_NUMBER_SYSTEM += option;
                    break;
                }
                case 'COLUMN_TITLE':{
                    APP_COLUMN_TITLE += option;
                    break;
                }
                case 'CALENDAR_TYPE':{
                    APP_CALENDAR_TYPE += option;
                    break;
                }
                case 'CALENDAR_HIJRI_TYPE':{
                    APP_CALENDAR_HIJRI_TYPE += option;
                    break;
                }
                case 'PAPER_SIZE':{
                    APP_PAPER_SIZE += option;
                    break;
                }
                case 'HIGHLIGHT_ROW':{
                    APP_HIGHLIGHT_ROW += option;
                    break;
                }
                case 'METHOD':{
                    option = `<option id=${app_setting.id} value='${app_setting.value}' ` +
                                `data2='${nvl(app_setting.data2)}' data3='${nvl(app_setting.data3)}' data4='${nvl(app_setting.data4)}' data5='${nvl(app_setting.data5)}'>${app_setting.text}</option>`;
                    APP_METHOD += option;
                    break;
                }
                case 'METHOD_ASR':{
                    APP_METHOD_ASR += option;
                    break;
                }
                case 'HIGH_LATITUDE_ADJUSTMENT':{
                    APP_HIGH_LATITUDE_ADJUSTMENT += option;
                    break;
                }
                case 'TIMEFORMAT':{
                    APP_TIMEFORMAT += option;
                    break;
                }
                case 'HIJRI_DATE_ADJUSTMENT':{
                    APP_HIJRI_DATE_ADJUSTMENT += option;
                    break;
                }
                case 'IQAMAT':{
                    APP_IQAMAT += option;
                    break;
                }
                case 'FAST_START_END':{
                    APP_FAST_START_END += option;
                    break;
                }
            }
        }
        APP_THEMES = themes(common.COMMON_GLOBAL.app_id, app_settings_db);
        APP_PLACES = places(common.COMMON_GLOBAL.app_id, app_settings_db);
    }
        
    switch (tab_selected){
        case 1:{
            //tab 1 - settings regional
            let LOCALES = await common.get_locales_options().catch((/**@type{Error}*/error)=>{throw error;});
            AppDocument.querySelector('#setting_select_locale').innerHTML = LOCALES;
            
            AppDocument.querySelector('#setting_timezone_current').innerHTML = common.COMMON_GLOBAL.user_timezone;

            AppDocument.querySelector('#setting_select_report_locale_second').innerHTML = `<option id='' value='0'></option>${LOCALES}`;
            AppDocument.querySelector('#setting_select_report_timezone').innerHTML = USER_TIMEZONE;
            AppDocument.querySelector('#setting_select_report_direction').innerHTML = `<option id='' value=''></option>${USER_DIRECTION}`;
            AppDocument.querySelector('#setting_select_report_numbersystem').innerHTML = APP_NUMBER_SYSTEM;
            AppDocument.querySelector('#setting_select_report_coltitle').innerHTML = APP_COLUMN_TITLE;
            AppDocument.querySelector('#setting_select_report_arabic_script').innerHTML = `<option id='' value=''></option>${USER_ARABIC_SCRIPT}`;
            AppDocument.querySelector('#setting_select_calendartype').innerHTML = APP_CALENDAR_TYPE;
            AppDocument.querySelector('#setting_select_calendar_hijri_type').innerHTML = APP_CALENDAR_HIJRI_TYPE;
            //set initial default language from clients locale
            common.SearchAndSetSelectedIndex(common.COMMON_GLOBAL.user_local, AppDocument.querySelector('#setting_select_locale'),1);            
            break;
        }
        case 2:{
            //tab 2 - settings gps
            AppDocument.querySelector('#setting_select_popular_place').innerHTML = APP_PLACES;
            //set default geolocation
            AppDocument.querySelector('#setting_select_popular_place').selectedIndex = 0;
            break;
        }
        case 3:{
            //tab 3 - settings design
            AppDocument.querySelector('#slides_day').innerHTML = APP_THEMES.day;
            AppDocument.querySelector('#slides_month').innerHTML = APP_THEMES.month;
            AppDocument.querySelector('#slides_year').innerHTML = APP_THEMES.year;
            AppDocument.querySelector('#setting_select_report_papersize').innerHTML = APP_PAPER_SIZE;
            AppDocument.querySelector('#setting_select_report_highlight_row').innerHTML = APP_HIGHLIGHT_ROW;
            //load themes in Design tab
            load_themes();
            update_all_theme_thumbnails();
            break;
        }
        case 5:{
            AppDocument.querySelector('#setting_icon_text_theme_day').dispatchEvent(new Event('click'));
            break;
        }
        case 6:{
            //tab 6 - settings prayer
            AppDocument.querySelector('#setting_select_method').innerHTML = APP_METHOD;
            AppDocument.querySelector('#setting_select_asr').innerHTML = APP_METHOD_ASR;
            AppDocument.querySelector('#setting_select_highlatitude').innerHTML = APP_HIGH_LATITUDE_ADJUSTMENT;
            AppDocument.querySelector('#setting_select_timeformat').innerHTML = APP_TIMEFORMAT;
            AppDocument.querySelector('#setting_select_hijri_adjustment').innerHTML = APP_HIJRI_DATE_ADJUSTMENT;
            AppDocument.querySelector('#setting_select_method').innerHTML = APP_METHOD;
            AppDocument.querySelector('#setting_select_method').innerHTML = APP_METHOD;
            AppDocument.querySelector('#setting_select_report_iqamat_title_fajr').innerHTML = APP_IQAMAT;
            AppDocument.querySelector('#setting_select_report_iqamat_title_dhuhr').innerHTML = APP_IQAMAT;
            AppDocument.querySelector('#setting_select_report_iqamat_title_asr').innerHTML = APP_IQAMAT;
            AppDocument.querySelector('#setting_select_report_iqamat_title_maghrib').innerHTML = APP_IQAMAT;
            AppDocument.querySelector('#setting_select_report_iqamat_title_isha').innerHTML = APP_IQAMAT;
            AppDocument.querySelector('#setting_select_report_show_fast_start_end').innerHTML = APP_FAST_START_END;
            break;
        }
    }
    await user_settings_load(tab_selected)
    switch (tab_selected){
        case 1:{
            //set timers
            //set current date and time for current locale and timezone
            setInterval(showcurrenttime, 1000);
            //set report date and time for current locale, report timezone
            setInterval(showreporttime, 1000);
            break;
        }
        case 2:{
            AppDocument.querySelector(`#${APP_GLOBAL.gps_module_leaflet_container}`).outerHTML = `<div id='${APP_GLOBAL.gps_module_leaflet_container}'></div>`;
            //init map thirdparty module
            /**
             * @param{AppEventLeaflet} event
             */
            const dbl_click_event = event => {
                if (event.originalEvent.target.parentNode.id == APP_GLOBAL.gps_module_leaflet_container){
                    AppDocument.querySelector('#setting_input_lat').innerHTML = event.latlng.lat;
                    AppDocument.querySelector('#setting_input_long').innerHTML = event.latlng.lng;
                    //Update GPS position
                    component_setting_update('GPS', 'POSITION');
                    const timezone = getTimezone(   event.latlng.lat, event.latlng.lng);
                    app_report.REPORT_GLOBAL.session_currentDate = common.getTimezoneDate(timezone);
                }   
            };
            await common.map_init(APP_GLOBAL.gps_module_leaflet_container,
                            AppDocument.querySelector('#setting_input_long').innerHTML, 
                            AppDocument.querySelector('#setting_input_lat').innerHTML,
                            dbl_click_event,
                            map_show_search_on_map_app).then(() => {
                component_setting_update('GPS', 'MAP');
                common.map_resize();
            });
            break;
        }
    }
}
/**
 * 
 * @param {{app:*[],
 *          app_service:{system_admin_only:number, first_time:number}}} parameters 
 * @returns {Promise.<void>}
 */
const init_app = async parameters => {
    await common.ComponentRender(common.COMMON_GLOBAL.app_div, {}, '/component/app.js')
    .then(()=>common.ComponentRender('app_profile_search', {}, '/common/component/profile_search.js'))
    .then(()=>common.ComponentRender('app_profile_toolbar', {}, '/common/component/profile_toolbar.js'))
    .then(()=>common.ComponentRender('app_user_account', {}, '/common/component/user_account.js'));
    dialogue_loading(1);
    //set papersize
    zoom_paper();
    //set app and report globals
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
            APP_GLOBAL.regional_default_locale_second = parameter['REGIONAL_DEFAULT_LOCALE_SECOND'];
        if (parameter['REGIONAL_DEFAULT_COLTITLE'])
            APP_GLOBAL.regional_default_coltitle = parameter['REGIONAL_DEFAULT_COLTITLE'];
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
            APP_GLOBAL.design_default_highlight_row = parameter['DESIGN_DEFAULT_HIGHLIGHT_ROW'];
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
            APP_GLOBAL.prayer_default_show_fast_start_end = parseInt(parameter['PRAYER_DEFAULT_SHOW_FAST_START_END']);
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

	const methods = await settings_method();
    app_report.set_prayer_method(methods).then(() => {
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
                            .then(()=>framework_set());
                        else
                           framework_set();
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
    AppDocument.body.className = 'app_theme1';
    common.COMMON_GLOBAL.exception_app_function = app_exception;
    common.init_common(parameters).then(()=>{
        init_app(parameters);   
    });
};
export{ init};