const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const { read_app_files} = await import(`file://${process.cwd()}/apps/apps.service.js`);

const themes = async (app_id, locale) =>{
    return new Promise((resolve) => {
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/setting/setting.service.js`).then(({getSettings}) => {
            getSettings(app_id, locale, 'REPORT_THEME%', (err, settings) => {
                let html_themes='';
                if (err){
                    resolve ([null, null, null])
                }
                else{
                    let span_themes_day ='', span_themes_month='', span_themes_year='';
                    //get themes and save result in three theme variables
                    for (let theme of settings){
                        let theme_type;
                        switch (theme.setting_type_name){
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
                        let new_span = `<span class="slide slide_${theme_type}">
                                            <div id='theme_${theme_type}_${theme.data}'
                                                data-theme_id='${theme.data}'> 
                                            </div>
                                        </span>`;
                        switch (theme.setting_type_name){
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
                    resolve ([span_themes_day, span_themes_month, span_themes_year]);
                }
            });
        })
    })
}
const places = async (app_id, locale) => {
    return new Promise((resolve, reject) => {
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/setting/setting.service.js`).then(({getSettings}) => {
            getSettings(app_id, locale, 'PLACE', (err, settings) => {
                let select_places;
                if (err){
                    resolve (
                                `<select id='setting_select_popular_place'>
                                <option value="" id="" latitude="0" longitude="0" timezone="" selected="selected">...</option>`
                            )
                }
                else{
                    select_places  =`<select id='setting_select_popular_place'>
                                    <option value="" id="" latitude="0" longitude="0" timezone="" selected="selected">...</option>`
                    let i = 0;
                    for (let place of settings){
                        //data 2 = latitude
                        //data 3 = longitude
                        //data 4 = timezone
                        //data 5 = icon
                        i++;
                        select_places +=
                        `<option  value='${i}' 
                                    id='${place.data}' 
                                    latitude='${place.data2}' 
                                    longitude='${place.data3}' 
                                    timezone='${place.data4}'>${place.data5} ${place.text}
                            </option>`;
                    }
                    select_places += '</select>';
                    resolve (select_places);
                }
            });
        })
    })
}
const countries = (app_id, locale) => {
    return new Promise((resolve, reject) => {
        import(`file://${process.cwd()}/server/dbapi/app_portfolio/country/country.service.js`).then(({getCountries})=>{
            getCountries(app_id, locale, (err, results)  => {
                let select_countries;
                if (err){
                    resolve (
                                `<select name='country' id='setting_select_country'>
                                <option value='' id='' label='…' selected='selected'>…</option>
                                </select>`
                            )
                }     
                else{
                    let current_group_name;
                    select_countries  =`<select name='country' id='setting_select_country'>
                                        <option value='' id='' label='…' selected='selected'>…</option>`;
            
                    results.map( (countries_map,i) => {
                        if (i === 0){
                        select_countries += `<optgroup label=${countries_map.group_name} />`;
                        current_group_name = countries_map.group_name;
                        }
                        else{
                        if (countries_map.group_name !== current_group_name){
                            select_countries += `<optgroup label=${countries_map.group_name} />`;
                            current_group_name = countries_map.group_name;
                        }
                        select_countries +=
                        `<option value=${i}
                                id=${countries_map.id} 
                                country_code=${countries_map.country_code} 
                                flag_emoji=${countries_map.flag_emoji} 
                                group_name=${countries_map.group_name}>${countries_map.flag_emoji} ${countries_map.text}
                        </option>`
                        }
                    })
                    select_countries += '</select>';
                    resolve (select_countries);
                }
            });
        });
    })
}

const createApp = (app_id, username, locale) => {
    return new Promise((resolve, reject) => {
        const main = (app_id) => {
            const files = [
                ['APP', process.cwd() + '/apps/app2/src/index.html'],
                ['<AppCommonHead/>', process.cwd() + '/apps/common/src/head.html'],
                ['<AppCommonHeadMap/>', process.cwd() + '/apps/common/src/head_map.html'],
                ['<AppCommonFonts/>', process.cwd() + '/apps/common/src/fonts.html'],
                ['<AppReportsFonts/>', process.cwd() + '/apps/app2/src/fonts.html'],
                ['<AppCommonBody/>', process.cwd() + '/apps/common/src/body.html'],
                ['<AppCommonBodyMaintenance/>', process.cwd() + '/apps/common/src/body_maintenance.html'],
                ['<AppCommonBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html'],  
                ['<AppCommonProfileDetail/>', process.cwd() + '/apps/common/src/profile_detail.html'], //Profile tag in common body
                
                ['<AppHead/>', process.cwd() + '/apps/app2/src/head.html'],
                ['<AppToolbarTop/>', process.cwd() + '/apps/app2/src/toolbar_top.html'],

                ['<AppCommonUserAccount/>', process.cwd() + '/apps/common/src/user_account.html'],
                ['<AppThemes/>', process.cwd() + '/apps/common/src/app_themes.html'],
                ['<AppCommonProfileSearch/>', process.cwd() + '/apps/common/src/profile_search.html'],

                ['<AppPaper/>', process.cwd() + '/apps/app2/src/paper.html'],
                ['<AppSettingsTabNavigation/>', process.cwd() + '/apps/app2/src/settings_tab_navigation.html'],
                ['<AppSettingsTabNavigationTab1/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab1.html'],
                ['<AppSettingsTabNavigationTab2/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab2.html'],
                ['<AppSettingsTabNavigationTab3/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab3.html'],
                ['<AppSettingsTabNavigationTab4/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab4.html'],
                ['<AppSettingsTabNavigationTab5/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab5.html'],
                ['<AppSettingsTabNavigationTab6/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab6.html'],
                ['<AppSettingsTabNavigationTab7/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab7.html'],

                ['<AppProfileInfo/>', process.cwd() + '/apps/app2/src/profile_info.html'], /*Profile tag in common body*/
                ['<AppProfileTop/>', process.cwd() + '/apps/app2/src/profile_top.html'],   //Profile tag in common body
                ['<AppDialogues/>', process.cwd() + '/apps/app2/src/dialogues.html'],
                ['<AppToolbarBottom/>', process.cwd() + '/apps/app2/src/toolbar_bottom.html'],
                ['<AppCommonProfileBtnTop/>', process.cwd() + '/apps/common/src/profile_btn_top.html']
            ];
            const getAppComponents = async (app_id) => {
                return new Promise((resolve, reject) => {
                    try {
                        import(`file://${process.cwd()}/server/dbapi/app_portfolio/language/locale/locale.service.js`).then(({getLocales}) => {
                            getLocales(app_id, locale, (err, locales) => {
                                if (err)
                                    resolve(err)
                                else{
                                    let AppLocales ='';
                                    locales.forEach( (locale,i) => {
                                        AppLocales += `<option id=${i} value=${locale.locale}>${locale.text}</option>`;
                                    })
                                    countries(app_id, locale).then((AppCountries) => {
                                        places(app_id, locale).then((AppPlaces) => {
                                            themes(app_id, locale).then((AppSettingsThemes) => {
                                                resolve({AppLocales: AppLocales,
                                                            AppCountries: AppCountries,
                                                            AppPlaces: AppPlaces,
                                                            AppSettingsThemes: AppSettingsThemes
                                                        })
                                            });
                                        });
                                    });
                                }
                            });    
                        });
                    } catch (error) {
                        reject(error);
                    }
                })                    
            }
            getAppComponents(app_id).then((app_components) => {
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
                let APP_MAP_TYPE='';
                
                import(`file://${process.cwd()}/server/dbapi/app_portfolio/setting/setting.service.js`).then(({getSettings}) => {
                    getSettings(app_id, locale, '', (err, settings) => {
                        let option;
                        for (let i = 0; i < settings.length; i++) {
                            option = `<option id=${settings[i].id} value='${settings[i].data}'>${settings[i].text}</option>`;
                            switch (settings[i].setting_type_name){
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
                                case 'MAP_TYPE':{
                                    APP_MAP_TYPE += option;
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
                                    const nvl = (value) => value==null?'':value;
                                    option = `<option id=${settings[i].id} value='${settings[i].data}' ` +
                                                `data2='${nvl(settings[i].data2)}' data3='${nvl(settings[i].data3)}' data4='${nvl(settings[i].data4)}' data5='${nvl(settings[i].data5)}'>${settings[i].text}</option>`;
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
                        read_app_files(app_id, files, (err, app)=>{
                            if (err)
                                reject(err);
                            else{
                                app = app.replace(
                                        '<AppLocales/>',
                                        `${app_components.AppLocales}`);
                                //add extra option for second locale
                                app = app.replace(
                                        '<AppLocalessecond/>',
                                        `<option id='' value='0' selected='selected'>None</option>${app_components.AppLocales}`);
                                app = app.replace(
                                        '<AppCountries/>',
                                        `${app_components.AppCountries}`);
                                app = app.replace(
                                        '<AppPlaces/>',
                                        `${app_components.AppPlaces}`);
                                app = app.replace(
                                        '<AppSettingsThemesDay/>',
                                        `${app_components.AppSettingsThemes[0]}`);
                                app = app.replace(
                                        '<AppSettingsThemesMonth/>',
                                        `${app_components.AppSettingsThemes[1]}`);
                                app = app.replace(
                                        '<AppSettingsThemesYear/>',
                                        `${app_components.AppSettingsThemes[2]}`);
                                //app SETTING
                                app = app.replace(
                                        '<AppTimezones/>',
                                        `${USER_TIMEZONE}`);
                                app = app.replace(
                                        '<AppDirection/>',
                                        `${USER_DIRECTION}`);
                                app = app.replace(
                                        '<AppNumbersystem/>',
                                        `${APP_NUMBER_SYSTEM}`);
                                app = app.replace(
                                        '<AppColumntitle/>',
                                        `${APP_COLUMN_TITLE}`);
                                app = app.replace(
                                        '<AppArabicscript/>',
                                        `${USER_ARABIC_SCRIPT}`);
                                app = app.replace(
                                        '<AppCalendartype/>',
                                        `${APP_CALENDAR_TYPE}`);
                                app = app.replace(
                                        '<AppCalendarhijritype/>',
                                        `${APP_CALENDAR_HIJRI_TYPE}`);
                                app = app.replace(
                                        '<AppMaptype/>',
                                        `${APP_MAP_TYPE}`);
                                app = app.replace(
                                        '<AppPapersize/>',
                                        `${APP_PAPER_SIZE}`);
                                app = app.replace(
                                        '<AppHighlightrow/>',
                                        `${APP_HIGHLIGHT_ROW}`);
                                app = app.replace(
                                        '<AppMethod/>',
                                        `${APP_METHOD}`);
                                app = app.replace(
                                        '<AppMethodAsr/>',
                                        `${APP_METHOD_ASR}`);
                                app = app.replace(
                                        '<AppHighlatitudeadjustment/>',
                                        `${APP_HIGH_LATITUDE_ADJUSTMENT}`);
                                app = app.replace(
                                        '<AppTimeformat/>',
                                        `${APP_TIMEFORMAT}`);
                                app = app.replace(
                                        '<AppHijridateadjustment/>',
                                        `${APP_HIJRI_DATE_ADJUSTMENT}`);
                                //used several times:
                                app = app.replace(
                                        new RegExp('<AppIqamat/>', 'g'),
                                        `${APP_IQAMAT}`);
                                app = app.replace(
                                        '<AppFaststartend/>',
                                        `${APP_FAST_START_END}`);
                                //COMMON, set user preferences content
                                app = app.replace(
                                        '<USER_LOCALE/>',
                                        `${app_components.AppLocales}`);
                                app = app.replace(
                                        '<USER_TIMEZONE/>',
                                        `${USER_TIMEZONE}`);
                                app = app.replace(
                                        '<USER_DIRECTION/>',
                                        `<option id='' value=''></option>${USER_DIRECTION}`);
                                app = app.replace(
                                        '<USER_ARABIC_SCRIPT/>',
                                        `<option id='' value=''></option>${USER_ARABIC_SCRIPT}`);
                                resolve(app);
                            } 
                        }) 
                    })  
                })                    
            });
        }
        if (username!=null){
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({getProfileUser}) => {
                getProfileUser(app_id, null, username, null, (err,result)=>{
                    if (result)
                        main(app_id);
                    else{
                        //return 0 meaning redirect to /
                        resolve (0);
                    }
                })
            })
        }
        else
            main(app_id);

    })
}
export{createApp}