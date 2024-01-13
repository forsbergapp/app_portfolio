/** @module apps/app2 */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../../types.js';


const {render_app_with_data, render_app_html} = await import(`file://${process.cwd()}/apps/apps.service.js`);

/**
 * Get themes
 * @param {number} app_id
 * @param {string} locale
 * @param {Types.db_result_app_setting_getSettings[]} app_settings
 * @returns {[string|null,string|null,string|null]}
 */
const themes = (app_id, locale, app_settings) =>{
    let theme_found = false;
    let span_themes_day ='', span_themes_month='', span_themes_year='';
    //get themes and save result in three theme variables
    for (const app_setting of app_settings.filter(setting=>setting.app_id == app_id && setting.app_setting_type_name.startsWith('REPORT_THEME'))){        
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
        const new_span = `<span class="slide slide_${theme_type}">
                            <div id='theme_${theme_type}_${app_setting.value}'
                                data-theme_id='${app_setting.value}'> 
                            </div>
                        </span>`;
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
        return [span_themes_day, span_themes_month, span_themes_year];
    else
        return [null, null, null];
};
/**
 * Get places
 * @param {number} app_id
 * @param {string} locale
 * @param {Types.db_result_app_setting_getSettings[]} app_settings
 * @returns {string}
 */
const places = (app_id, locale, app_settings) => {
    let select_places = '';
    let place_found = false;
    let i = 0;
    for (const app_setting of app_settings.filter(setting=>setting.app_id==app_id && setting.app_setting_type_name=='PLACE')){
        if (place_found==false){
            place_found = true;
            select_places  =`<select id='setting_select_popular_place'>
                            <option value="" id="" latitude="0" longitude="0" timezone="" selected="selected">...</option>`;
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
    if (place_found){
        select_places += '</select>';
        return select_places;
    }
    else{
        return `<select id='setting_select_popular_place'>
                <option value="" id="" latitude="0" longitude="0" timezone="" selected="selected">...</option>`;
    }
};
/**
 * Nvl returns '' if null else the value
 * @param {string|null} value
 * @returns {string|null}
 * 
 */
const nvl = value => value==null?'':value;
/**
 * Creates app
 * @param {number} app_id
 * @param {Types.app_parameter} username
 * @param {string} locale
 * @returns {Promise.<Types.app_create|Types.app_create_empty>}
 */
const createApp = async (app_id, username, locale) => {
    return new Promise((resolve, reject) => {
        const main = async (/**@type{number}*/app_id) => {
            let USER_TIMEZONE ='';
            let USER_DIRECTION='';
            let USER_ARABIC_SCRIPT='';
            let APP_NUMBER_SYSTEM='';
            let APP_COLUMN_TITLE='';
            let APP_CALENDAR_TYPE='';
            let APP_CALENDAR_HIJRI_TYPE='';
            let APP_PAPER_SIZE='';
            let APP_HIGHLIGHT_ROW='';
            let APP_METHOD='';
            let APP_METHOD_ASR='';
            let APP_HIGH_LATITUDE_ADJUSTMENT='';
            let APP_TIMEFORMAT='';
            let APP_HIJRI_DATE_ADJUSTMENT='';
            let APP_IQAMAT='';
            let APP_FAST_START_END='';
            render_app_html(app_id, locale)
            .then((/**@type{Types.render_common}*/app)=>{
                //render settings
                let option;
                for (const setting of app.settings.settings) {
                    option = `<option id=${setting.id} value='${setting.value}'>${setting.text}</option>`;
                    switch (setting.app_setting_type_name){
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
                            option = `<option id=${setting.id} value='${setting.value}' ` +
                                        `data2='${nvl(setting.data2)}' data3='${nvl(setting.data3)}' data4='${nvl(setting.data4)}' data5='${nvl(setting.data5)}'>${setting.text}</option>`;
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
                //render profile_info after COMMON:
                const render_variables = [];
                render_variables.push(['AppLocales',app.locales]);
                //add extra option for second locale
                render_variables.push(['AppLocalessecond',`<option id='' value='0' selected='selected'>None</option>${app.locales}`]);

                render_variables.push(['AppPlaces',places(app_id, locale, app.settings.settings)]);
                const appthemes = themes(app_id, locale, app.settings.settings);
                render_variables.push(['AppSettingsThemesDay',appthemes[0]]);
                render_variables.push(['AppSettingsThemesMonth',appthemes[1]]);
                render_variables.push(['AppSettingsThemesYear',appthemes[2]]);

                //app SETTING
                render_variables.push(['AppTimezones',USER_TIMEZONE]);
                render_variables.push(['AppDirection',USER_DIRECTION]);
                render_variables.push(['AppNumbersystem',APP_NUMBER_SYSTEM]);
                render_variables.push(['AppColumntitle',APP_COLUMN_TITLE]);
                render_variables.push(['AppArabicscript',USER_ARABIC_SCRIPT]);
                render_variables.push(['AppCalendartype',APP_CALENDAR_TYPE]);
                render_variables.push(['AppCalendarhijritype',APP_CALENDAR_HIJRI_TYPE]);
                render_variables.push(['AppPapersize',APP_PAPER_SIZE]);
                render_variables.push(['AppHighlightrow',APP_HIGHLIGHT_ROW]);
                render_variables.push(['AppMethod',APP_METHOD]);
                render_variables.push(['AppMethodAsr',APP_METHOD_ASR]);
                render_variables.push(['AppHighlatitudeadjustment',APP_HIGH_LATITUDE_ADJUSTMENT]);
                render_variables.push(['AppTimeformat',APP_TIMEFORMAT]);
                render_variables.push(['AppHijridateadjustment',APP_HIJRI_DATE_ADJUSTMENT]);
                //used several times:
                render_variables.push(['AppIqamat',APP_IQAMAT]);
                render_variables.push(['AppFaststartend',APP_FAST_START_END]);
                
                resolve({   app:render_app_with_data(app.app, render_variables),
                            map:app.map,
                            map_styles: app.settings.map_styles});
                
            })
            .catch((/**@type{Types.error}*/err)=>reject(err));
        };
        if (username!=null){
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account.service.js`).then(({getProfileUser}) => {
                getProfileUser(app_id, null, username, null)
                .then((/**@type{Types.db_result_user_account_getProfileUser[]}*/result)=>{
                    if (result[0])
                        main(app_id);
                    else{
                        //redirect to /
                        resolve ({app: null, map: null, map_styles:null});
                    }
                })
                .catch((/**@type{Types.error}*/error)=>{
                    reject(error);
                });
            });
        }
        else
            main(app_id);

    });
};
export{createApp};