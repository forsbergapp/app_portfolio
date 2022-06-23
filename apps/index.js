const fs = require("fs");
const { createLogAppSE } = require("../service/log/log.service");
const { getAppStartParameters } = require("../service/db/api/app_parameter/app_parameter.service");
module.exports = {
    getApp:(app_id) => {
        return new Promise(function (resolve, reject){
            const {promises: {readFile}} = require("fs");
            const files = [
                ['APP', __dirname + '/app0/src/index.html'],
                ['<AppCommonHead/>', __dirname + '/common/src/head.html'],
                ['<AppCommonBody/>', __dirname + '/common/src/body.html'],
                ['<AppCommonProfileDetail/>', __dirname + '/common/src/profile_detail.html'], //Profile tag in common body

                ['<AppHead/>', __dirname + '/app0/src/head.html'],
                ['<AppUserAccount/>', __dirname + '/app0/src/user_account.html'],
                ['<AppToggle/>', __dirname + '/app0/src/toogle.html'],
                ['<AppMoon/>', __dirname + '/app0/src/moon.html'],
                ['<AppSun/>', __dirname + '/app0/src/sun.html'],
                ['<AppBackground/>', __dirname + '/app0/src/background.html'],
                ['<AppDialogues/>', __dirname + '/app0/src/dialogues.html'],
                ['<AppProfileInfo/>', __dirname + '/app0/src/profile_info.html'],   /*Profile tag in common body*/
                ['<AppWindowInfo/>', __dirname + '/app0/src/window_info.html']
              ];
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
                //Profile tag not used in common body
                app = app.replace(
                        '<AppProfileTop/>',
                        '');        
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
        })
    },
    getAdmin:() => {
        return new Promise(function (resolve, reject){
            const {promises: {readFile}} = require("fs");
            const files = [
                ['APP', __dirname + '/admin/src/index.html'],
                ['<AppHead/>', __dirname + '/admin/src/head.html'],
                ['<AppCommonHead/>', __dirname + '/common/src/head.html'],
                ['<AppCommonHeadMap/>', __dirname + '/common/src/head_map.html'],
                ['<AppCommonHeadChart/>', __dirname + '/common/src/head_chart.html'],
                ['<AppCommonBody/>', __dirname + '/common/src/body.html'],
                ['<AppCommonProfileDetail/>', __dirname + '/common/src/profile_detail.html'], //Profile tag in common body
                ['<AppDialogues/>', __dirname + '/admin/src/dialogues.html']
              ];
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
                //Profile tag not used in common body
                app = app.replace(
                        '<AppProfileInfo/>',
                        '');
                //Profile tag not used in common body
                app = app.replace(
                        '<AppProfileTop/>',
                        '');        
                getAppStartParameters(process.env.APP0_ID, (err,result) =>{
                    if (err)
                        reject(err);
                    else{
                        let parameters = {   
                            app_id: '',
                            module: 'APP',
                            module_type: 'INIT',
                            exception_app_function: 'admin_exception_before',
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
        })
    },
    getMaintenance:(app_id) => {
        return new Promise(function (resolve, reject){
            const {promises: {readFile}} = require("fs");
            const files = [
                ['APP', __dirname + '/common/src/index_maintenance.html'],
                ['<AppHead/>', __dirname + '/common/src/head_maintenance.html'],
                ['<AppCommonHead/>', __dirname + '/common/src/head.html'],
                ['<AppCommonBody/>', __dirname + '/common/src/body.html'],
                ['<AppCommonProfileDetail/>', __dirname + '/common/src/profile_detail.html'] //Profile tag in common body
              ];
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
                //replace appid in index file
                app = app.replace(
                        '<APP_ID/>',
                        `${app_id==''?null:app_id}`);
                //Profile tag not used in common body
                app = app.replace(
                        '<AppProfileInfo/>',
                        '');
                //Profile tag not used in common body
                app = app.replace(
                        '<AppProfileTop/>',
                        '');        
                getAppStartParameters(process.env.APP0_ID, (err,result) =>{
                    if (err)
                        reject(err);
                    else{
                        let parameters = {   
                            app_id: '',
                            module: 'APP',
                            module_type: 'MAINTENANCE',
                            exception_app_function: 'app_exception',
                            close_eventsource: null,
                            ui: true,
                            service_auth: result[0].service_auth,
                            app_rest_client_id: result[0].app_rest_client_id,
                            app_rest_client_secret: result[0].app_rest_client_secret,
                            rest_app_parameter: result[0].rest_app_parameter
                        };
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
        })
    }
}