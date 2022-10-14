const fs = require("fs");
const { read_app_files, get_module_with_init_admin } = require("../../../");
module.exports = {
    getAdminSecure:(app_id, gps_lat, gps_long, gps_place, admin_id) => {    
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', __dirname + '/index.html'],
                ['<AppHeadJS/>', __dirname + '/admin.js'],
                ['<AppHeadCSS/>', __dirname + '/admin.css'],
                ['<AppDashboard/>', __dirname + '/dashboard.html']
            ];
            read_app_files('', files, (err, app)=>{
                if (err)
                    reject(err);
                else{
                    get_module_with_init_admin(app_id, 
                                        'admin_logoff_app',
                                        true, //close eventsource and create new as logged in
                                        false, //ui
                                        true, //admin
                                        admin_id,
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