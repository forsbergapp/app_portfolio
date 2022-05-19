const fs = require("fs");
const { createLogAppSE } = require("../../service/log/log.service");
module.exports = {
    getApp:(app_id, params) => {
        return new Promise(function (resolve, reject){
            const AppHeadCommon = fs.readFileSync(__dirname + '/../common/src/head.html', 'utf8');
            const AppBodyCommon = fs.readFileSync(__dirname + '/../common/src/body.html', 'utf8');
            fs.readFile(__dirname + '/src/index.html', 'utf-8', (err, app_result) => {
                if (err) {
                    createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    resolve (err);  
                }
                else{
                    const AppHead = fs.readFileSync(__dirname + '/src/head.html', 'utf8');
                    const AppDialogues = fs.readFileSync(__dirname + '/src/dialogues.html', 'utf8');
                    const AppWindowInfo = fs.readFileSync(__dirname + '/src/window_info.html', 'utf8');
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
    }
}