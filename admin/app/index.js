const fs = require("fs");
const { createLogAppSE } = require("../../service/log/log.service");
module.exports = {
    getAdmin:() => {
        return new Promise(function (resolve, reject){
            fs.readFile(__dirname + '/index.html', 'utf-8', (err, app_result) => {
                if (err) {
                    createLogAppSE(null, __appfilename, __appfunction, __appline, err);
                    resolve (err);  
                }
                else{
                    //module html files
                    const AppHead = fs.readFileSync(__dirname + '/head.html', 'utf8');
                    const AppDialogues = fs.readFileSync(__dirname + '/dialogues.html', 'utf8');
                    async function getAppComponents() {                        
                        var app = app_result.replace(
                            '<AppHead/>',
                            `${AppHead}`);
                        app = app.replace(
                            '<AppDialogues/>',
                            `${AppDialogues}`);
                        resolve (app);
                    }
                    getAppComponents();
                }
            });
        })
    }
}