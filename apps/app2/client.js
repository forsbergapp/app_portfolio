const fs = require("fs");
const { createLogAppSE } = require("../../service/log/log.service");
const { getAppStartParameters } = require("../../service/db/api/app_parameter/app_parameter.service");
module.exports = {
    getApp:(app_id, params) => {
        return new Promise(function (resolve, reject){
            const {promises: {readFile}} = require("fs");
            const files = [
                ['APP', __dirname + '/src/index.html'],
                ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
                /*Profile tag AppCommonProfileDetail in common body */
                ['<AppCommonProfileDetail/>', __dirname + '/../common/src/profile_detail.html'], 
                ['<AppHead/>', __dirname + '/src/head.html'],
                ['<AppWindowInfo/>', __dirname + '/src/window_info.html']
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
                createLogAppSE(null, __appfilename, __appfunction, __appline, err);
                reject(err);
            });
        })
    }
}