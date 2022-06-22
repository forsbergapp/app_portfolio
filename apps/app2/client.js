const fs = require("fs");
const { createLogAppSE } = require("../../service/log/log.service");
module.exports = {
    getApp:(app_id, params) => {
        return new Promise(function (resolve, reject){
            const AppCommonHead = fs.readFileSync(__dirname + '/../common/src/head.html', 'utf8');
            const AppCommonBody = fs.readFileSync(__dirname + '/../common/src/body.html', 'utf8');
            const AppCommonProfileDetail = fs.readFileSync(__dirname + '/../common/src/profile_detail.html', 'utf8');
            fs.readFile(__dirname + '/src/index.html', 'utf-8', (err, app_result) => {
                if (err) {
                    createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    resolve (err);  
                }
                else{
                    const AppHead = fs.readFileSync(__dirname + '/src/head.html', 'utf8');
                    const AppWindowInfo = fs.readFileSync(__dirname + '/src/window_info.html', 'utf8');
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<AppCommonHead/>',
                            `${AppCommonHead}`);
                        app = app.replace(
                            '<AppWindowInfo/>',
                            `${AppWindowInfo}`);
                        app = app.replace(
                            '<AppCommonBody/>',
                            `${AppCommonBody}`);
                        //Profile tag not used in common body
                        app = app.replace(
                            '<AppProfileInfo/>',
                            '');
                        //Profile tag AppCommonProfileDetail in common body
                        app = app.replace(
                            '<AppCommonProfileDetail/>',
                            `${AppCommonProfileDetail}`);
                        //Profile tag not used in common body
                        app = app.replace(
                            '<AppProfileTop/>',
                            '');
                        resolve (app);
                    }
                    getAppComponents();
                }
            });
        })
    }
}