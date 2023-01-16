const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const { read_app_files, get_module_with_init, countries } = await import(`file://${process.cwd()}/apps/index.js`);

async function themes(app_id){
    return new Promise(function (resolve, reject){
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app2_theme/app2_theme.service.js`).then(function({getThemes}){
            getThemes(app_id, (err, results)  => {
                let html_themes='';
                if (err){
                    resolve (
                            `<div class='setting_horizontal_col'>
                                <div id='setting_icon_theme_day'></div>
                                <div id='setting_themes_day_slider' class='slider'>
                                    <div class='slider_wrapper'>
                                    <div id='slides_day' class='slides'></div>
                                    </div>
                                </div>
                                <div id='slider_prev_day' class='slider_control slider_prev'></i></div>
                                <div id='slider_next_day' class='slider_control slider_next'></div>
                                <div id='slider_theme_day_id'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_theme_month'></div>
                                <div id='setting_themes_month_slider' class='slider'>
                                    <div class='slider_wrapper'>
                                    <div id='slides_month' class='slides'></div>
                                    </div>
                                </div>
                                <div id='slider_prev_month' class='dialogue_button slider_prev'></div>
                                <div id='slider_next_month' class='dialogue_button slider_next'></div>
                                <div id='slider_theme_month_id'></div>
                            </div>
                            <div class='setting_horizontal_col'>
                                <div id='setting_icon_report_theme_year'></div>
                                <div id='setting_themes_year_slider' class='slider'>
                                    <div class='slider_wrapper'>
                                    <div id='slides_year' class='slides'></div>
                                    </div>
                                </div>
                                <div id='slider_prev_year' class='dialogue_button slider_prev'></div>
                                <div id='slider_next_year' class='dialogue_button slider_next'></div>
                                <div id='slider_theme_year_id'></div>
                            </div>`
                        )
                }
                else{
                    let span_themes_day ='', span_themes_month='', span_themes_year='';
                    //get themes and save result in three theme variables
                    results.map( (themes_map,i) => {
                        //Node does not like eval('span_themes_' + themes_map.type.toLowerCase()) +=
                        //src='${themes_map.image_preview_url}'
                        let new_span = `<span class="slide slide_${themes_map.type.toLowerCase()}">
                                            <div id='theme_${themes_map.type.toLowerCase()}_${themes_map.id}'                       
                                                data-theme_id='${themes_map.id}'
                                                data-header_image=${themes_map.image_header}
                                                data-footer_image=${themes_map.image_footer}
                                                data-background_image=${themes_map.image_background}
                                                data-category='${themes_map.category}'> 
                                            </div>
                                        </span>`;
                        switch (themes_map.type.toLowerCase()){
                            case 'day':{
                                span_themes_day += new_span;
                                break;
                            }
                            case 'month':{
                                span_themes_month += new_span;
                                break;
                            }
                            case 'year':{
                                span_themes_year += new_span;
                                break;
                            }
                        }  
                    })
                    //add each theme dynamic variable span_themes_day, span_themes_month and span_themes_year to wrapping html
                    const theme_type_arr = ['day','month','year'];
                    theme_type_arr.forEach(themes_type => {
                        html_themes += 
                        `<div class='setting_horizontal_col'>
                            <div id='setting_icon_design_theme_${themes_type}'></div>
                            <div id='setting_themes_${themes_type}_slider' class='slider'>
                            <div class='slider_wrapper'>
                                <div id='slides_${themes_type}' class='slides'>
                                    ${eval('span_themes_' + themes_type)}
                                </div>
                            </div>
                            </div>
                            <div id='slider_prev_${themes_type}' class='dialogue_button slider_prev'></div>
                            <div id='slider_next_${themes_type}' class='dialogue_button slider_next'></div>
                            <div id='slider_theme_${themes_type}_id'></div>
                        </div>`;
                    })
                    resolve (html_themes);
                }
            });
        })
    })
}
async function places(app_id){
    return new Promise(function (resolve, reject){
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app2_place/app2_place.service.js`).then(function({getPlace}){
            getPlace(app_id, (err, results)  => {
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
                    results.map( (places_map,i) => {
                        if (places_map.country2_flag==null)
                            select_places +=
                            `<option  value='${i}' 
                                        id='${places_map.id}' 
                                        latitude='${places_map.latitude}' 
                                        longitude='${places_map.longitude}' 
                                        timezone='${places_map.timezone}'>${places_map.group1_icon} ${places_map.group2_icon} ${places_map.country_flag} ${places_map.title}
                                </option>`;
                        else
                            select_places +=
                            `<option  value='${i}' 
                                        id='${places_map.id}' 
                                        latitude='${places_map.latitude}' 
                                        longitude='${places_map.longitude}' 
                                        timezone='${places_map.timezone}'>${places_map.group1_icon} ${places_map.group2_icon} ${places_map.country_flag} ${places_map.country2_flag} ${places_map.title}
                                </option>`;
                    })
                    select_places += '</select>';
                    resolve (select_places);
                }
            });
        })
    })
}
function getApp(app_id, username, gps_lat, gps_long, gps_place){
    return new Promise(function (resolve, reject){
        function main(app_id){
            const files = [
                ['APP', process.cwd() + '/apps/app2/src/index.html'],
                ['<AppCommonHeadPrayTimes/>', process.cwd() + '/apps/common/src/head_praytimes.html'],
                ['<AppCommonHeadRegional/>', process.cwd() + '/apps/common/src/head_regional.html'],
                ['<AppCommonHead/>', process.cwd() + '/apps/common/src/head.html'],
                ['<AppCommonHeadMap/>', process.cwd() + '/apps/common/src/head_map.html'],
                ['<AppCommonHeadQRCode/>', process.cwd() + '/apps/common/src/head_qrcode.html'],
                ['<AppCommonHeadFontawesome/>', process.cwd() + '/apps/common/src/head_fontawesome.html'],
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
            async function getAppComponents(app_id) {
                return new Promise(function (resolve, reject){
                    try {
                        let default_lang = 'en';
                        import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/language/locale/locale.service.js`).then(function({getLocales}){
                            getLocales(app_id, default_lang, (err, locales) => {
                                if (err)
                                    resolve(err)
                                else{
                                    let AppLocales ='';
                                    locales.forEach( (locale,i) => {
                                        AppLocales += `<option id=${i} value=${locale.locale}>${locale.text}</option>`;
                                    })
                                    countries(app_id).then(function(AppCountries){
                                        places(app_id).then(function(AppPlaces){
                                            themes(app_id).then(function(AppSettingsThemes){
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
            getAppComponents(app_id).then(function(app_components){
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
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/setting/setting.service.js`).then(function({getSettings}){
                    getSettings(app_id, 'en', null, (err, settings) => {
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
                                    function nvl(value){return value==null?'':value}
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
                                        '<AppSettingsThemes/>',
                                        `${app_components.AppSettingsThemes}`);
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
                                get_module_with_init(app_id, 
                                                        null,
                                                        null,
                                                        'app_exception',
                                                        null,
                                                        true,
                                                        gps_lat,
                                                        gps_long,
                                                        gps_place,
                                                        app, (err, app_init) =>{
                                    if (err)
                                        reject(err);
                                    else{
                                        resolve(app_init);
                                    }
                                })
                            } 
                        }) 
                    })  
                })                    
            });
        }
        if (username!=null){
            import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/user_account/user_account.service.js`).then(function({getProfileUser}){
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

export{themes, places, getApp}