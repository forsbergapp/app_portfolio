const { read_app_files, get_module_with_init } = require('../');
const { options } = require('../../service/auth/auth.router');
module.exports = {
    getApp:(app_id, username, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            function main(app_id){
                const { locales } = require(__dirname + '/../common/src/locales');
                //const { setting } = require(__dirname + '/../common/src/setting');
                const { getSettings } = require("../../service/db/app_portfolio/setting/setting.service");
                const { countries } = require('./src/countries');                
                const { places } = require('./src/places');
                const { themes } = require('./src/themes');
                const files = [
                  ['APP', __dirname + '/src/index.html'],
                  ['<AppCommonHeadPrayTimes/>', __dirname + '/../common/src/head_praytimes.html'],
                  ['<AppCommonHeadRegional/>', __dirname + '/../common/src/head_regional.html'],
                  ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                  ['<AppCommonHeadMap/>', __dirname + '/../common/src/head_map.html'],
                  ['<AppCommonHeadQRCode/>', __dirname + '/../common/src/head_qrcode.html'],
                  ['<AppCommonHeadFontawesome/>', __dirname + '/../common/src/head_fontawesome.html'],
                  ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
                  ['<AppCommonBodyMaintenance/>', __dirname + '/../common/src/body_maintenance.html'],
                  ['<AppCommonBodyBroadcast/>', __dirname + '/../common/src/body_broadcast.html'],  
                  ['<AppCommonProfileDetail/>', __dirname + '/../common/src/profile_detail.html'], //Profile tag in common body
                  
                  ['<AppHead/>', __dirname + '/src/head.html'],
                  ['<AppToolbarTop/>', __dirname + '/src/toolbar_top.html'],

                  ['<AppCommonUserAccount/>', __dirname + '/../common/src/user_account.html'],
                  ['<AppThemes/>', __dirname + '/src/app_themes.html'],
                  ['<AppCommonProfileSearch/>', __dirname + '/../common/src/profile_search.html'],

                  ['<AppPaper/>', __dirname + '/src/paper.html'],
                  ['<AppSettingsTabNavigation/>', __dirname + '/src/settings_tab_navigation.html'],
                  ['<AppSettingsTabNavigationTab1/>', __dirname + '/src/settings_tab_navigation_tab1.html'],
                  ['<AppSettingsTabNavigationTab2/>', __dirname + '/src/settings_tab_navigation_tab2.html'],
                  ['<AppSettingsTabNavigationTab3/>', __dirname + '/src/settings_tab_navigation_tab3.html'],
                  ['<AppSettingsTabNavigationTab4/>', __dirname + '/src/settings_tab_navigation_tab4.html'],
                  ['<AppSettingsTabNavigationTab5/>', __dirname + '/src/settings_tab_navigation_tab5.html'],
                  ['<AppSettingsTabNavigationTab6/>', __dirname + '/src/settings_tab_navigation_tab6.html'],
                  ['<AppSettingsTabNavigationTab7/>', __dirname + '/src/settings_tab_navigation_tab7.html'],

                  ['<AppProfileInfo/>', __dirname + '/src/profile_info.html'], /*Profile tag in common body*/
                  ['<AppProfileTop/>', __dirname + '/src/profile_top.html'],   //Profile tag in common body
                  ['<AppDialogues/>', __dirname + '/src/dialogues.html'],
                  ['<AppToolbarBottom/>', __dirname + '/src/toolbar_bottom.html'],
                  ['<AppCommonProfileBtnTop/>', __dirname + '/../common/src/profile_btn_top.html']
                ];
                let AppCountries;
                let AppLocales;
                let AppPlaces;
                let AppSettingsThemes;
                async function getAppComponents() {
                    //modules with fetch from database
                    AppCountries = await countries(app_id);
                    AppLocales = await locales(app_id);
                    AppPlaces = await places(app_id);
                    AppSettingsThemes = await themes(app_id);
                    
                }
                getAppComponents().then(function(){
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
                    getSettings(app_id, 'en', null, (err, settings) => {
                        let option;
                        for (i = 0; i < settings.length; i++) {
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
                                        `${AppLocales}`);
                                //add extra option for second locale
                                app = app.replace(
                                        '<AppLocalessecond/>',
                                        `<option id='' value='0' selected='selected'>None</option>${AppLocales}`);
                                app = app.replace(
                                        '<AppCountries/>',
                                        `${AppCountries}`);
                                app = app.replace(
                                        '<AppPlaces/>',
                                        `${AppPlaces}`);
                                app = app.replace(
                                        '<AppSettingsThemes/>',
                                        `${AppSettingsThemes}`);
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
                                //common SETTING
                                app = app.replace(
                                        '<USER_LOCALE/>',
                                        `${AppLocales}`);
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
                });
            }
            if (username!=null){
                const {getProfileUser} = require('../../service/db/app_portfolio/user_account/user_account.service');
                getProfileUser(app_id, null, username, null, (err,result)=>{
                    if (result)
                        main(app_id);
                    else{
                        //return 0 meaning redirect to /
                        resolve (0);
                    }
                })
            }
            else
                main(app_id);

        })
    }
}