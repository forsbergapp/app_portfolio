const fs = require("fs");
const { createLogAppSE } = require("../service/log/log.service");
module.exports = {
    getApp:(app_id) => {
        return new Promise(function (resolve, reject){
            switch(app_id){
                case '0':{
                    fs.readFile(__dirname + '/app0/src/index.html', 'utf-8', (err, app_result) => {
                        if (err) {
                            createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                            resolve (err);  
                        }
                        else{
                            //module html files
                            const AppHead = fs.readFileSync(__dirname + '/app0/src/head.html', 'utf8');
                            const AppToggle = fs.readFileSync(__dirname + '/app0/src/toogle.html', 'utf8');
                            const AppMoon = fs.readFileSync(__dirname + '/app0/src/moon.html', 'utf8');
                            const AppSun = fs.readFileSync(__dirname + '/app0/src/sun.html', 'utf8');
                            const AppBackground = fs.readFileSync(__dirname + '/app0/src/background.html', 'utf8');
                            const AppDialogues = fs.readFileSync(__dirname + '/app0/src/dialogues.html', 'utf8');
                            const AppWindowInfo = fs.readFileSync(__dirname + '/app0/src/window_info.html', 'utf8');
                            const AppCommon = fs.readFileSync(__dirname + '/common/src/common.html', 'utf8');
                            async function getAppComponents() {                        
                                var app = app_result.replace(
                                    '<AppHead/>',
                                    `${AppHead}`);
                                app = app.replace(
                                    '<AppToggle/>',
                                    `${AppToggle}`);
                                app = app.replace(
                                    '<AppMoon/>',
                                    `${AppMoon}`);
                                app = app.replace(
                                    '<AppSun/>',
                                    `${AppSun}`);
                                app = app.replace(
                                    '<AppBackground/>',
                                    `${AppBackground}`);
                                app = app.replace(
                                    '<AppDialogues/>',
                                    `${AppDialogues}`);
                                app = app.replace(
                                    '<AppWindowInfo/>',
                                    `${AppWindowInfo}`);
                                app = app.replace(
                                    '<AppCommon/>',
                                    `${AppCommon}`);
                                resolve (app);
                            }
                            getAppComponents();
                        }
                    });
                    break;
                }
                case '1':{
                    fs.readFile(__dirname + '/app1/src/index.html', 'utf-8', (err, app_result) => {
                        if (err) {
                            createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                            resolve (err);  
                        }
                        else{
                            //module html files
                            const AppHead = fs.readFileSync(__dirname + '/app1/src/head.html', 'utf8');
                            const AppToolbarTop = fs.readFileSync(__dirname + '/app1/src/toolbar_top.html', 'utf8');
                            const AppPaper = fs.readFileSync(__dirname + '/app1/src/paper.html', 'utf8');
                            const AppSettingsTabNavigation = fs.readFileSync(__dirname + '/app1/src/settings_tab_navigation.html', 'utf8');
                            const AppSettingsTabNavigationTab1 = fs.readFileSync(__dirname + '/app1/src/settings_tab_navigation_tab1.html', 'utf8');
                            const AppSettingsTabNavigationTab2 = fs.readFileSync(__dirname + '/app1/src/settings_tab_navigation_tab2.html', 'utf8');
                            const AppSettingsTabNavigationTab3 = fs.readFileSync(__dirname + '/app1/src/settings_tab_navigation_tab3.html', 'utf8');
                            const AppSettingsTabNavigationTab4 = fs.readFileSync(__dirname + '/app1/src/settings_tab_navigation_tab4.html', 'utf8');
                            const AppSettingsTabNavigationTab5 = fs.readFileSync(__dirname + '/app1/src/settings_tab_navigation_tab5.html', 'utf8');
                            const AppSettingsTabNavigationTab6 = fs.readFileSync(__dirname + '/app1/src/settings_tab_navigation_tab6.html', 'utf8');
                            const AppSettingsTabNavigationTab7 = fs.readFileSync(__dirname + '/app1/src/settings_tab_navigation_tab7.html', 'utf8');
                            const AppProfileInfoSearch = fs.readFileSync(__dirname + '/app1/src/profile_info_search.html', 'utf8');
                            const AppProfileInfo = fs.readFileSync(__dirname + '/app1/src/profile_info.html', 'utf8');
                            const AppProfileTop = fs.readFileSync(__dirname + '/app1/src/profile_top.html', 'utf8');
                            const AppWindowInfo = fs.readFileSync(__dirname + '/app1/src/window_info.html', 'utf8');
                            const AppWindowPreviewReport = fs.readFileSync(__dirname + '/app1/src/window_preview_report.html', 'utf8');
                            const AppDialogues = fs.readFileSync(__dirname + '/app1/src/dialogues.html', 'utf8');
                            const AppToolbarBottom = fs.readFileSync(__dirname + '/app1/src/toolbar_bottom.html', 'utf8');
                            const AppCommon = fs.readFileSync(__dirname + '/common/src/common.html', 'utf8');
        
                            const { countries } = require("./app1/src/countries");
                            const { locales } = require("./app1/src/locales");
                            const { places } = require("./app1/src/places");
                            const { themes } = require("./app1/src/themes");
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
                                    '<AppCommon/>',
                                    `${AppCommon}`);
                                resolve (app);
                            }
                            getAppComponents();
                        }
                    });
                    break;
                }
                case '2':{
                    fs.readFile(__dirname + '/app0/src/index.html', 'utf-8', (err, app_result) => {
                        if (err) {
                            createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                            resolve (err);  
                        }
                        else{
                            //module html files
                            const AppHead = fs.readFileSync(__dirname + '/app2/src/head.html', 'utf8');
                            const AppWindowInfo = fs.readFileSync(__dirname + '/app2/src/window_info.html', 'utf8');
                            const AppCommon = fs.readFileSync(__dirname + '/common/src/common.html', 'utf8');
                            async function getAppComponents() {                        
                                var app = app_result.replace(
                                    '<AppHead/>',
                                    `${AppHead}`);
                                app = app.replace(
                                    '<AppWindowInfo/>',
                                    `${AppWindowInfo}`);
                                app = app.replace(
                                    '<AppCommon/>',
                                    `${AppCommon}`);
                                resolve (app);
                            }
                            getAppComponents();
                        }
                    });
                    break;
                }
            }
        })
    },
    getAdmin:() => {
        return new Promise(function (resolve, reject){
            fs.readFile(__dirname + '/admin/src/index.html', 'utf-8', (err, app_result) => {
                if (err) {
                    createLogAppSE(null, __appfilename, __appfunction, __appline, err);
                    resolve (err);  
                }
                else{
                    //module html files
                    const AppHead = fs.readFileSync(__dirname + '/admin/src/head.html', 'utf8');
                    const AppDialogues = fs.readFileSync(__dirname + '/admin/src/dialogues.html', 'utf8');
                    const AppCommon = fs.readFileSync(__dirname + '/common/src/common.html', 'utf8');
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<AppDialogues/>',
                            `${AppDialogues}`);
                        app = app.replace(
                            '<AppCommon/>',
                            `${AppCommon}`);
                        resolve (app);
                    }
                    getAppComponents();
                }
            });
        })
    }
}