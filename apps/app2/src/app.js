const {render_app_html} = await import(`file://${process.cwd()}/apps/apps.service.js`);

const themes = (app_id, locale, settings) =>{
    let theme_found = false;
    let span_themes_day ='', span_themes_month='', span_themes_year='';
    //get themes and save result in three theme variables
    for (const setting of settings.filter(setting=>setting.app_id == app_id && setting.setting_type_name.startsWith('REPORT_THEME'))){        
        if (theme_found==false){
            theme_found = true;
        }
        let theme_type;
        switch (setting.setting_type_name){
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
                            <div id='theme_${theme_type}_${setting.data}'
                                data-theme_id='${setting.data}'> 
                            </div>
                        </span>`;
        switch (setting.setting_type_name){
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
const places = (app_id, locale, settings) => {
    let select_places;
    let place_found = false;
    let i = 0;
    for (const setting of settings.filter(setting=>setting.app_id==app_id && setting.setting_type_name=='PLACE')){
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
                    id='${setting.data}' 
                    latitude='${setting.data2}' 
                    longitude='${setting.data3}' 
                    timezone='${setting.data4}'>${setting.data5} ${setting.text}
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

const createApp = (app_id, username, locale) => {
    return new Promise((resolve, reject) => {
        const main = async (app_id) => {
            const files = [
                ['APP', process.cwd() + '/apps/app2/src/index.html'],
                ['<AppReportsFonts/>', process.cwd() + '/apps/app2/src/fonts.html'],                
                ['<AppHead/>', process.cwd() + '/apps/app2/src/head.html'],
                ['<AppToolbarTop/>', process.cwd() + '/apps/app2/src/toolbar_top.html'],
                ['<AppPaper/>', process.cwd() + '/apps/app2/src/paper.html'],
                ['<AppSettingsTabNavigation/>', process.cwd() + '/apps/app2/src/settings_tab_navigation.html'],
                ['<AppSettingsTabNavigationTab1/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab1.html'],
                ['<AppSettingsTabNavigationTab2/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab2.html'],
                ['<AppSettingsTabNavigationTab3/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab3.html'],
                ['<AppSettingsTabNavigationTab4/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab4.html'],
                ['<AppSettingsTabNavigationTab5/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab5.html'],
                ['<AppSettingsTabNavigationTab6/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab6.html'],
                ['<AppSettingsTabNavigationTab7/>', process.cwd() + '/apps/app2/src/settings_tab_navigation_tab7.html'],
                ['<AppDialogues/>', process.cwd() + '/apps/app2/src/dialogues.html'],
                ['<AppToolbarBottom/>', process.cwd() + '/apps/app2/src/toolbar_bottom.html']
            ];
            //render after COMMON rendered
            const fs = await import('node:fs');
            //Profile tag in common body
            const profile_info = await fs.promises.readFile(`${process.cwd()}/apps/app2/src/profile_info.html`, 'utf8');
            const profile_top = await fs.promises.readFile(`${process.cwd()}/apps/app2/src/profile_top.html`, 'utf8');
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
            render_app_html(app_id, files, {locale:locale, 
                                            module_type:'FORM', 
                                            map: true, 
                                            user_account_custom_tag:'<AppUserAccount/>',
                                            app_themes:true, 
                                            render_locales:true, 
                                            render_settings:true, 
                                            render_provider_buttons:true
                                        }, (err, app)=>{
                if (err)
                    reject(err);
                else{
                    //render settings
                    let option;
                    for (let i = 0; i < app.settings.settings.length; i++) {
                        option = `<option id=${app.settings.settings[i].id} value='${app.settings.settings[i].data}'>${app.settings.settings[i].text}</option>`;
                        switch (app.settings.settings[i].setting_type_name){
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
                                const nvl = (value) => value==null?'':value;
                                option = `<option id=${app.settings.settings[i].id} value='${app.settings.settings[i].data}' ` +
                                            `data2='${nvl(app.settings.settings[i].data2)}' data3='${nvl(app.settings.settings[i].data3)}' data4='${nvl(app.settings.settings[i].data4)}' data5='${nvl(app.settings.settings[i].data5)}'>${app.settings.settings[i].text}</option>`;
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
                    app.app = app.app.replace('<AppProfileInfo/>',          profile_info);
                    app.app = app.app.replace('<AppProfileTop/>',           profile_top);
                    app.app = app.app.replace('<AppLocales/>',              app.locales);
                    //add extra option for second locale
                    app.app = app.app.replace('<AppLocalessecond/>',        `<option id='' value='0' selected='selected'>None</option>${app.locales}`);

                    app.app = app.app.replace('<AppPlaces/>',               places(app_id, locale, app.settings.settings));
                    const appthemes = themes(app_id, locale, app.settings.settings);
                    app.app = app.app.replace('<AppSettingsThemesDay/>',    appthemes[0]);
                    app.app = app.app.replace('<AppSettingsThemesMonth/>',  appthemes[1]);
                    app.app = app.app.replace('<AppSettingsThemesYear/>',   appthemes[2]);

                    //app SETTING
                    app.app = app.app.replace('<AppTimezones/>',`${USER_TIMEZONE}`);
                    app.app = app.app.replace('<AppDirection/>',`${USER_DIRECTION}`);
                    app.app = app.app.replace('<AppNumbersystem/>',`${APP_NUMBER_SYSTEM}`);
                    app.app = app.app.replace('<AppColumntitle/>',`${APP_COLUMN_TITLE}`);
                    app.app = app.app.replace('<AppArabicscript/>',`${USER_ARABIC_SCRIPT}`);
                    app.app = app.app.replace('<AppCalendartype/>',`${APP_CALENDAR_TYPE}`);
                    app.app = app.app.replace('<AppCalendarhijritype/>',`${APP_CALENDAR_HIJRI_TYPE}`);
                    app.app = app.app.replace('<AppPapersize/>',`${APP_PAPER_SIZE}`);
                    app.app = app.app.replace('<AppHighlightrow/>',`${APP_HIGHLIGHT_ROW}`);
                    app.app = app.app.replace('<AppMethod/>',`${APP_METHOD}`);
                    app.app = app.app.replace('<AppMethodAsr/>',`${APP_METHOD_ASR}`);
                    app.app = app.app.replace('<AppHighlatitudeadjustment/>',`${APP_HIGH_LATITUDE_ADJUSTMENT}`);
                    app.app = app.app.replace('<AppTimeformat/>',`${APP_TIMEFORMAT}`);
                    app.app = app.app.replace('<AppHijridateadjustment/>',`${APP_HIJRI_DATE_ADJUSTMENT}`);
                    //used several times:
                    app.app = app.app.replace(new RegExp('<AppIqamat/>', 'g'),`${APP_IQAMAT}`);
                    app.app = app.app.replace('<AppFaststartend/>',`${APP_FAST_START_END}`);
                    resolve(app.app);
                }
            });
        };
        if (username!=null){
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({getProfileUser}) => {
                getProfileUser(app_id, null, username, null, (err,result)=>{
                    if (result)
                        main(app_id);
                    else{
                        //return 0 meaning redirect to /
                        resolve (0);
                    }
                });
            });
        }
        else
            main(app_id);

    });
};
export{createApp};