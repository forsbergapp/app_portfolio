const fs = require("fs");
const { createLogAppSE } = require("../service/log/log.service");
module.exports = {
    getApp:(app_id) => {
        return new Promise(function (resolve, reject){
            const AppCommonHead = fs.readFileSync(__dirname + '/common/src/head.html', 'utf8');
            const AppCommonBody = fs.readFileSync(__dirname + '/common/src/body.html', 'utf8');
            const AppCommonProfileInfoSearch = fs.readFileSync(__dirname + '/common/src/profile_info_search.html', 'utf8');
            const AppCommonProfileInfo = fs.readFileSync(__dirname + '/common/src/profile_info.html', 'utf8');
            const AppCommonProfileDetail = fs.readFileSync(__dirname + '/common/src/profile_detail.html', 'utf8');
            const AppCommonProfileTop = fs.readFileSync(__dirname + '/common/src/profile_top.html', 'utf8');
            const AppCommonProfileTopList = fs.readFileSync(__dirname + '/common/src/profile_top_list.html', 'utf8');
            const AppCommonProfileInfoApps = fs.readFileSync(__dirname + '/common/src/profile_info_apps.html', 'utf8');
            fs.readFile(__dirname + '/app0/src/index.html', 'utf-8', (err, app_result) => {
                if (err) {
                    createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    resolve (err);  
                }
                else{
                    //module html files
                    const AppHead = fs.readFileSync(__dirname + '/app0/src/head.html', 'utf8');
                    const AppUserAccount = fs.readFileSync(__dirname + '/app0/src/user_account.html', 'utf8');
                    const AppToggle = fs.readFileSync(__dirname + '/app0/src/toogle.html', 'utf8');
                    const AppMoon = fs.readFileSync(__dirname + '/app0/src/moon.html', 'utf8');
                    const AppSun = fs.readFileSync(__dirname + '/app0/src/sun.html', 'utf8');
                    const AppBackground = fs.readFileSync(__dirname + '/app0/src/background.html', 'utf8');
                    const AppDialogues = fs.readFileSync(__dirname + '/app0/src/dialogues.html', 'utf8');
                    const AppWindowInfo = fs.readFileSync(__dirname + '/app0/src/window_info.html', 'utf8');
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<AppCommonHead/>',
                            `${AppCommonHead}`);    
                        app = app.replace(
                            '<AppUserAccount/>',
                            `${AppUserAccount}`);
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
                            '<AppCommonProfileInfoSearch/>',
                            `${AppCommonProfileInfoSearch}`);
                        app = app.replace(
                            '<AppCommonProfileInfo/>',
                            `${AppCommonProfileInfo}`);
                        app = app.replace(
                            '<AppCommonProfileDetail/>',
                            `${AppCommonProfileDetail}`);
                        app = app.replace(
                            '<AppCommonProfileTop/>',
                            `${AppCommonProfileTop}`);
                        app = app.replace(
                            '<AppCommonProfileTopList/>',
                            `${AppCommonProfileTopList}`);
                        app = app.replace(
                            '<AppCommonProfileInfoApps/>',
                            `${AppCommonProfileInfoApps}`);
                        app = app.replace(
                            '<AppDialogues/>',
                            `${AppDialogues}`);
                        app = app.replace(
                            '<AppWindowInfo/>',
                            `${AppWindowInfo}`);
                        app = app.replace(
                            '<AppCommonBody/>',
                            `${AppCommonBody}`);
                        resolve (app);
                    }
                    getAppComponents();
                }
            });
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
                    const AppHead = fs.readFileSync(__dirname + '/admin/src/head.html', 'utf8');
                    const AppDialogues = fs.readFileSync(__dirname + '/admin/src/dialogues.html', 'utf8');
                    const AppCommonHead = fs.readFileSync(__dirname + '/common/src/head.html', 'utf8');
                    const AppCommonHeadMap = fs.readFileSync(__dirname + '/common/src/head_map.html', 'utf8');
                    const AppCommonHeadChart = fs.readFileSync(__dirname + '/common/src/head_chart.html', 'utf8');
                    const AppCommonBody = fs.readFileSync(__dirname + '/common/src/body.html', 'utf8');
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<AppCommonHead/>',
                            `${AppCommonHead}`);
                        app = app.replace(
                            '<AppCommonHeadMap/>',
                            `${AppCommonHeadMap}`);
                        app = app.replace(
                            '<AppCommonHeadChart/>',
                            `${AppCommonHeadChart}`);
                        app = app.replace(
                            '<AppDialogues/>',
                            `${AppDialogues}`);
                        app = app.replace(
                            '<AppCommonBody/>',
                            `${AppCommonBody}`);
                        resolve (app);
                    }
                    getAppComponents();
                }
            });
        })
    },
    getMaintenance:(app_id) => {
        return new Promise(function (resolve, reject){
            fs.readFile(__dirname + '/common/src/index_maintenance.html', 'utf-8', (err, app_result) => {
                if (err) {
                    createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    resolve (err);  
                }
                else{
                    const AppHead = fs.readFileSync(__dirname + '/common/src/head_maintenance.html', 'utf8');
                    const AppCommonHead = fs.readFileSync(__dirname + '/common/src/head.html', 'utf8');
                    const AppCommonBody = fs.readFileSync(__dirname + '/common/src/body.html', 'utf8');
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<APP_ID/>',
                            `${app_id==''?null:app_id}`);
                        app = app.replace(
                            '<AppCommonHead/>',
                            `${AppCommonHead}`);
                        app = app.replace(
                            '<AppCommonBody/>',
                            `${AppCommonBody}`);
                        resolve (app);
                    }
                    getAppComponents();
                }
            });
        })
    }
}