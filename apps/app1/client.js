const fs = require("fs");
const { createLogAppSE } = require("../../service/log/log.service");
module.exports = {
    getApp:(app_id, username) => {
        return new Promise(function (resolve, reject){
            function main(app_id){
                const AppHeadCommon = fs.readFileSync(__dirname + '/../common/src/head.html', 'utf8');
                const AppBodyCommon = fs.readFileSync(__dirname + '/../common/src/body.html', 'utf8');
                fs.readFile(__dirname + '/src/index.html', 'utf-8', (err, app_result) => {
                    if (err) {
                        createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                        resolve (err);  
                    }
                    else{
                        const AppHead = fs.readFileSync(__dirname + '/src/head.html', 'utf8');
                        const AppToolbarTop = fs.readFileSync(__dirname + '/src/toolbar_top.html', 'utf8');
                        const AppPaper = fs.readFileSync(__dirname + '/src/paper.html', 'utf8');
                        const AppSettingsTabNavigation = fs.readFileSync(__dirname + '/src/settings_tab_navigation.html', 'utf8');
                        const AppSettingsTabNavigationTab1 = fs.readFileSync(__dirname + '/src/settings_tab_navigation_tab1.html', 'utf8');
                        const AppSettingsTabNavigationTab2 = fs.readFileSync(__dirname + '/src/settings_tab_navigation_tab2.html', 'utf8');
                        const AppSettingsTabNavigationTab3 = fs.readFileSync(__dirname + '/src/settings_tab_navigation_tab3.html', 'utf8');
                        const AppSettingsTabNavigationTab4 = fs.readFileSync(__dirname + '/src/settings_tab_navigation_tab4.html', 'utf8');
                        const AppSettingsTabNavigationTab5 = fs.readFileSync(__dirname + '/src/settings_tab_navigation_tab5.html', 'utf8');
                        const AppSettingsTabNavigationTab6 = fs.readFileSync(__dirname + '/src/settings_tab_navigation_tab6.html', 'utf8');
                        const AppSettingsTabNavigationTab7 = fs.readFileSync(__dirname + '/src/settings_tab_navigation_tab7.html', 'utf8');
                        const AppProfileInfoSearch = fs.readFileSync(__dirname + '/src/profile_info_search.html', 'utf8');
                        const AppProfileInfo = fs.readFileSync(__dirname + '/src/profile_info.html', 'utf8');
                        const AppProfileTop = fs.readFileSync(__dirname + '/src/profile_top.html', 'utf8');
                        const AppWindowInfo = fs.readFileSync(__dirname + '/src/window_info.html', 'utf8');
                        const AppWindowPreviewReport = fs.readFileSync(__dirname + '/src/window_preview_report.html', 'utf8');
                        const AppDialogues = fs.readFileSync(__dirname + '/src/dialogues.html', 'utf8');
                        const AppToolbarBottom = fs.readFileSync(__dirname + '/src/toolbar_bottom.html', 'utf8');        
                        const { countries } = require("./src/countries");
                        const { locales } = require("./src/locales");
                        const { places } = require("./src/places");
                        const { themes } = require("./src/themes");
                        async function getAppComponents() {
                            //modules with fetch from database
                            const AppCountries = await countries(app_id);
                            const AppLocales = await locales(app_id);
                            const AppPlaces = await places(app_id);
                            const AppThemes = await themes(app_id);
                            
                            var app = app_result.replace(
                                '<AppHead/>',
                                `${AppHead}`);
                            app = app.replace(
                                '<AppHeadCommon/>',
                                `${AppHeadCommon}`);
                            app = app.replace(
                                '<AppToolbarTop/>',
                                `${AppToolbarTop}`);
                            app = app.replace(
                                '<AppPaper/>',
                                `${AppPaper}`);
                            app = app.replace(
                                '<AppSettingsTabNavigation/>',
                                `${AppSettingsTabNavigation}`);
                            app = app.replace(
                                '<AppSettingsTabNavigationTab1/>',
                                `${AppSettingsTabNavigationTab1}`);
                            //Locales tag used more than once, use RegExp for that
                            app = app.replace(
                                new RegExp('<AppLocales/>', 'g'),
                                `${AppLocales}`);
                            app = app.replace(
                                '<AppSettingsTabNavigationTab2/>',
                                `${AppSettingsTabNavigationTab2}`);
                            app = app.replace(
                                '<AppCountries/>',
                                `${AppCountries}`);
                            app = app.replace(
                                '<AppPlaces/>',
                                `${AppPlaces}`);
                            app = app.replace(
                                '<AppSettingsTabNavigationTab3/>',
                                `${AppSettingsTabNavigationTab3}`);
                            app = app.replace(
                                '<AppThemes/>',
                                `${AppThemes}`);
                            app = app.replace(
                                '<AppSettingsTabNavigationTab4/>',
                                `${AppSettingsTabNavigationTab4}`);
                            app = app.replace(
                                '<AppSettingsTabNavigationTab5/>',
                                `${AppSettingsTabNavigationTab5}`);
                            app = app.replace(
                                '<AppSettingsTabNavigationTab6/>',
                                `${AppSettingsTabNavigationTab6}`);
                            app = app.replace(
                                '<AppSettingsTabNavigationTab7/>',
                                `${AppSettingsTabNavigationTab7}`);    
                            app = app.replace(
                                '<AppProfileInfoSearch/>',
                                `${AppProfileInfoSearch}`);    
                            app = app.replace(
                                '<AppProfileInfo/>',
                                `${AppProfileInfo}`);    
                            app = app.replace(
                                '<AppProfileTop/>',
                                `${AppProfileTop}`);    
                            app = app.replace(
                                '<AppWindowInfo/>',
                                `${AppWindowInfo}`);    
                            app = app.replace(
                                '<AppWindowPreviewReport/>',
                                `${AppWindowPreviewReport}`);    
                            app = app.replace(
                                '<AppDialogues/>',
                                `${AppDialogues}`);
                            app = app.replace(
                                '<AppToolbarBottom/>',
                                `${AppToolbarBottom}`);
                            app = app.replace(
                                '<AppBodyCommon/>',
                                `${AppBodyCommon}`);
                            resolve (app);
                        }
                        getAppComponents();
                    }
                });
            }
            if (username!=null){
                const {getProfileUser} = require("../../service/db/api/user_account/user_account.service");
                getProfileUser(app_id, null, username, null, (err,result)=>{
                    if (result)
                        main(app_id);
                    else{
                        //return 0 meaning redirect to /
                        return callBack(0);
                    }
                })
            }
            else
                main(app_id);

        })
    }
}