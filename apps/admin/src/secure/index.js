const fs = require("fs");
const { createLogAppSE } = require("../../../../service/log/log.controller");
module.exports = {
    getAdmin:(callBack) => {    
        const {promises: {readFile}} = require("fs");
        const files = [
            ['APP', __dirname + '/index.html'],
            ['<AppHeadJS/>', __dirname + '/admin.js'],
            ['<AppHeadCSS/>', __dirname + '/admin.css'],
            ['<AppDashboard/>', __dirname + '/dashboard.html']
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
            return callBack(null, app);
        }).catch(err => {
            createLogAppSE(null, __appfilename, __appfunction, __appline, err);
            return callBack(err);
        });
    }
}