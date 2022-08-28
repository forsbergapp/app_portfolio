const { read_app_files, get_module_with_init } = require('../');
module.exports = {
    getApp:(app_id, username, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            function main(app_id){
                const { locales } = require(__dirname + '/../common/src/locales');
                const { setting } = require(__dirname + '/../common/src/setting');
                const { countries } = require('./src/countries');                
                const { places } = require('./src/places');
                const { themes } = require('./src/themes');
                const files = [
                  ['APP', __dirname + '/src/index.html'],
                  ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                  ['<AppCommonHeadMap/>', __dirname + '/../common/src/head_map.html'],
                  ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
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
                  ['<AppToolbarBottom/>', __dirname + '/src/toolbar_bottom.html']
                ];
                let AppCountries;
                let AppLocales;
                let AppPlaces;
                let AppSettingsThemes;
                let USER_TIMEZONE;
                let USER_DIRECTION;
                let USER_ARABIC_SCRIPT;
                async function getAppComponents() {
                    //modules with fetch from database
                    AppCountries = await countries(app_id);
                    AppLocales = await locales(app_id);
                    AppPlaces = await places(app_id);
                    AppSettingsThemes = await themes(app_id);
                    USER_TIMEZONE = await setting(app_id, 'en', 'TIMEZONE');
                    USER_DIRECTION = await setting(app_id, 'en', 'DIRECTION');
                    USER_ARABIC_SCRIPT = await setting(app_id, 'en', 'ARABIC_SCRIPT');
                }
                getAppComponents().then(function(){
                    read_app_files(app_id, files, (err, app)=>{
                        if (err)
                            reject(err);
                        else{
                            //Locales tag used more than once, use RegExp for that
                            app = app.replace(
                                new RegExp('<AppLocales/>', 'g'),
                                `${AppLocales}`);
                            app = app.replace(
                                    '<AppCountries/>',
                                    `${AppCountries}`);
                            app = app.replace(
                                    '<AppPlaces/>',
                                    `${AppPlaces}`);
                            app = app.replace(
                                    '<AppSettingsThemes/>',
                                    `${AppSettingsThemes}`);
                            app = app.replace(
                                    '<USER_LOCALE/>',
                                    `${AppLocales}`);
                            app = app.replace(
                                    '<AppTimezones/>',
                                    `${USER_TIMEZONE}`);
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
                                                 null,
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