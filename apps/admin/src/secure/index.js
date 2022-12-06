const fs = require("fs");
const { read_app_files, get_module_with_init } = require("../../../");
module.exports = {
    getAdminSecure:(app_id, system_admin, user_account_id, gps_lat, gps_long, gps_place) => {    
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', __dirname + '/index.html'],
                ['<AppHeadJS/>', __dirname + '/admin.js'],
                ['<AppHeadCSS/>', __dirname + '/admin.css'],
                ['<AppAdminMainHTML/>', __dirname + '/main.html'],
                ['<AppAdminDialogueHTML/>', __dirname + '/dialogue.html']
            ];
            read_app_files('', files, (err, app)=>{
                if (err)
                    reject(err);
                else{
                    get_module_with_init(app_id, 
                                         system_admin,
                                         user_account_id,
                                        'admin_logoff_app',
                                        true, //close eventsource and create new as logged in
                                        false, //ui
                                        gps_lat,
                                        gps_long,
                                        gps_place,
                                        app, (err, app_init) =>{
                        if (err)
                            reject(err);
                        else{
                            resolve(app_init);
                        }
                    })
                }
            })
        })
    }
}