const fs = require("fs");
const { createLogAppSE } = require("../../../../service/log/log.service");
module.exports = {
    getAdmin:(callBack) => {    
        fs.readFile(__dirname + '/index.html', 'utf-8', (err, app_result) => {
            if (err) {
                createLogAppSE(null, __appfilename, __appfunction, __appline, err);
                return callBack(err);
            }
            else{
                //module html files
                const AppHeadJS = fs.readFileSync(__dirname + '/admin.js', 'utf8');
                const AppHeadCSS = fs.readFileSync(__dirname + '/admin.css', 'utf8');
                const AppDashboard = fs.readFileSync(__dirname + '/dashboard.html', 'utf8');
                async function getAppComponents() {                        
                    var app = app_result.replace(
                        '<AppHeadJS/>',
                        `${AppHeadJS}`);
                    app = app.replace(
                        '<AppHeadCSS/>',
                        `${AppHeadCSS}`);
                    app = app.replace(
                        '<AppDashboard/>',
                        `${AppDashboard}`);
                    return callBack(null, app);
                }
                getAppComponents();
            }
        });
    }
}