const fs = require("fs");
const { createLogAppSE } = require("../../service/log/log.service");
const { getAppStartParameters } = require("../../service/db/api/app_parameter/app_parameter.service");
module.exports = {
    getApp:(app_id, username) => {
        return new Promise(function (resolve, reject){
            function main(app_id){
                const {promises: {readFile}} = require("fs");
                const { countries } = require("./src/countries");
                const { locales } = require("./src/locales");
                const { places } = require("./src/places");
                const { themes } = require("./src/themes");
                const files = [
                  ['APP', __dirname + '/src/index.html'],
                  ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                  ['<AppCommonHeadMap/>', __dirname + '/../common/src/head_map.html'],
                  ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
                  ['<AppCommonProfileDetail/>', __dirname + '/../common/src/profile_detail.html'], //Profile tag in common body

                  ['<AppHead/>', __dirname + '/src/head.html'],
                  ['<AppToolbarTop/>', __dirname + '/src/toolbar_top.html'],
                  ['<AppPaper/>', __dirname + '/src/paper.html'],
                  ['<AppSettingsTabNavigation/>', __dirname + '/src/settings_tab_navigation.html'],
                  ['<AppSettingsTabNavigationTab1/>', __dirname + '/src/settings_tab_navigation_tab1.html'],
                  ['<AppSettingsTabNavigationTab2/>', __dirname + '/src/settings_tab_navigation_tab2.html'],
                  ['<AppSettingsTabNavigationTab3/>', __dirname + '/src/settings_tab_navigation_tab3.html'],
                  ['<AppSettingsTabNavigationTab4/>', __dirname + '/src/settings_tab_navigation_tab4.html'],
                  ['<AppSettingsTabNavigationTab5/>', __dirname + '/src/settings_tab_navigation_tab5.html'],
                  ['<AppSettingsTabNavigationTab6/>', __dirname + '/src/settings_tab_navigation_tab6.html'],
                  ['<AppSettingsTabNavigationTab7UserLoggedIn/>', __dirname + '/src/settings_tab_navigation_tab7_user_logged_in.html'],
                  ['<AppSettingsTabNavigationTab7UserSettings/>', __dirname + '/src/settings_tab_navigation_tab7_user_settings.html'],
                  
                  ['<AppProfileInfo/>', __dirname + '/src/profile_info.html'], /*Profile tag in common body*/
                  ['<AppProfileTop/>', __dirname + '/src/profile_top.html'],   //Profile tag in common body
                  ['<AppWindowInfo/>', __dirname + '/src/window_info.html'],
                  ['<AppWindowPreviewReport/>', __dirname + '/src/window_preview_report.html'],
                  ['<AppDialogues/>', __dirname + '/src/dialogues.html'],
                  ['<AppToolbarBottom/>', __dirname + '/src/toolbar_bottom.html']
                ];
                let AppCountries;
                let AppLocales;
                let AppPlaces;
                let AppThemes;
                async function getAppComponents() {
                    //modules with fetch from database
                    AppCountries = await countries(app_id);
                    AppLocales = await locales(app_id);
                    AppPlaces = await places(app_id);
                    AppThemes = await themes(app_id);
                }
                getAppComponents().then(function(){
                    let i = 0;
                    Promise.all(files.map(file => {
                        return readFile(file[1], 'utf8');
                    })).then(fileBuffers => {
                        let app ='';
                        fileBuffers.forEach(fileBuffer => {
                            if (app=='')
                                app = fileBuffer.toString();
                            else
                                app = app.replace(
                                        files[i][0],
                                        `${fileBuffer.toString()}`);
                            i++;
                        });
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
                                '<AppThemes/>',
                                `${AppThemes}`);
                        getAppStartParameters(process.env.APP0_ID, (err,result) =>{
                            if (err)
                                reject(err);
                            else{
                                let parameters = {   
                                    app_id: app_id,
                                    module: 'APP',
                                    module_type: 'INIT',
                                    exception_app_function: 'app_exception',
                                    close_eventsource: null,
                                    ui: true,
                                    service_auth: result[0].service_auth,
                                    app_rest_client_id: result[0].app_rest_client_id,
                                    app_rest_client_secret: result[0].app_rest_client_secret,
                                    rest_app_parameter: result[0].rest_app_parameter
                                }    
                                app = app.replace(
                                    '<ITEM_COMMON_PARAMETERS/>',
                                    JSON.stringify(parameters));
                                resolve(app);
                            }
                        })
                    }).catch(err => {
                        createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                        reject (err);
                    });
                });
            }
            if (username!=null){
                const {getProfileUser} = require("../../service/db/api/user_account/user_account.service");
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