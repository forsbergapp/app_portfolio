const fs = require("fs");
const { createLogAppSE } = require("../service/log/log.service");
module.exports = {
    getApp:(app_id) => {
        return new Promise(function (resolve, reject){
            const AppHeadCommon = fs.readFileSync(__dirname + '/common/src/head.html', 'utf8');
            const AppBodyCommon = fs.readFileSync(__dirname + '/common/src/body.html', 'utf8');
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
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<AppHeadCommon/>',
                            `${AppHeadCommon}`);    
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
                            '<AppBodyCommon/>',
                            `${AppBodyCommon}`);
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
                    const AppHeadCommon = fs.readFileSync(__dirname + '/common/src/head.html', 'utf8');
                    const AppBodyCommon = fs.readFileSync(__dirname + '/common/src/body.html', 'utf8');
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<AppHeadCommon/>',
                            `${AppHeadCommon}`);
                        app = app.replace(
                            '<AppDialogues/>',
                            `${AppDialogues}`);
                        app = app.replace(
                            '<AppBodyCommon/>',
                            `${AppBodyCommon}`);
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
                    const AppHeadCommon = fs.readFileSync(__dirname + '/common/src/head.html', 'utf8');
                    const AppBodyCommon = fs.readFileSync(__dirname + '/common/src/body.html', 'utf8');
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<APP_ID/>',
                            `${app_id==''?null:app_id}`);
                        app = app.replace(
                            '<AppHeadCommon/>',
                            `${AppHeadCommon}`);
                        app = app.replace(
                            '<AppBodyCommon/>',
                            `${AppBodyCommon}`);
                        resolve (app);
                    }
                    getAppComponents();
                }
            });
        })
    }
}