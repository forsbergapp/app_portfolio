const fs = require("fs");
const { createLogAppSE } = require("../../service/log/log.service");
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
                resolve(app);
            }).catch(err => {
                createLogAppSE(null, __appfilename, __appfunction, __appline, err);
                reject(err);
            });
        })
    }
}