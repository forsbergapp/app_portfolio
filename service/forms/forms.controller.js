const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getIp} = require ("../../service/geolocation/geolocation.controller");
function app_log(req, app_id, app_module_type, params, gps_latitude, gps_longitude, gps_place){
    const logData ={
        app_id : app_id,
        app_module : 'FORMS',
        app_module_type : app_module_type,
        app_module_request : params,
        app_module_result : gps_place,
        app_user_id : null,
        user_language : null,
        user_timezone : null,
        user_number_system : null,
        user_platform : null,
        server_remote_addr : req.ip,
        server_user_agent : req.headers["user-agent"],
        server_http_host : req.headers["host"],
        server_http_accept_language : req.headers["accept-language"],
        user_gps_latitude : gps_latitude,
        user_gps_longitude : gps_longitude
    }
    createLog(logData, (err,results)  => {
        null;
    }); 
}
module.exports = {
  getForm: (req, res, app_id, params, callBack) => {
    //getIp and createLog needs app_id, use main app_id for admin
    req.query.app_id = app_id ?? process.env.MAIN_APP_ID;
    req.query.app_user_id = null;
    req.query.callback=1;
    let app_module_type;
    getIp(req, res, (err, result)=>{
        let gps_place = result.geoplugin_city + ', ' +
                        result.geoplugin_regionName + ', ' +
                        result.geoplugin_countryName;
        if (app_id == null || app_id == '') {
            //admin
            const { getAdmin } = require("../../apps/admin/client");
            app_module_type = 'ADMIN';
            const app = getAdmin(result.geoplugin_latitude,
                                    result.geoplugin_longitude, 
                                    gps_place)
            .then(function(app_result){
                app_log(req, 
                        process.env.MAIN_APP_ID, 
                        app_module_type, 
                        null,
                        result.gps_latitude, 
                        result.gps_longitude, 
                        gps_place);
                return callBack(null, app_result);
            })
        }
        else{
            //other apps
            const { getApp } = require(`../../apps/app${app_id}/client`);
            app_module_type = 'INIT';
            const app = getApp(app_id, 
                            params,
                            result.geoplugin_latitude,
                            result.geoplugin_longitude, 
                            gps_place)
            .then(function(app_result){
                app_log(req, 
                        app_id, 
                        app_module_type, 
                        params,
                        result.geoplugin_latitude,
                        result.geoplugin_longitude, 
                        gps_place);
                return callBack(null, app_result)
            });            
        }
    })
  },
  getAdminSecure: (req, res) => {
        const { getAdmin } = require("../../apps/admin/src/secure");
        //admin does not use app_id so use main app_id when calling
        //main app functionality
        req.query.app_id = process.env.MAIN_APP_ID;
        req.query.app_user_id = null;
        req.query.callback=1;    
        getIp(req, res, (err, result)=>{
            let gps_place = result.geoplugin_city + ', ' +
                            result.geoplugin_regionName + ', ' +
                            result.geoplugin_countryName;
            getAdmin((err, app_result)=>{
                app_log(req, 
                        process.env.MAIN_APP_ID, 
                        'ADMIN_SECURE', 
                        null,
                        result.gps_latitude, 
                        result.gps_longitude, 
                        gps_place);
                return res.status(200).send(
                    app_result
                );
            })
        })
  },
  getMaintenance: (req, res, app_id, callBack) => {
        const { getMaintenance } = require("../../apps");
        req.query.app_id = app_id;
        req.query.app_user_id = null;
        req.query.callback=1;
        getIp(req, res, (err, result)=>{
            let gps_place = result.geoplugin_city + ', ' +
                            result.geoplugin_regionName + ', ' +
                            result.geoplugin_countryName;
            const app = getMaintenance(app_id,
                                       result.geoplugin_latitude,
                                       result.geoplugin_longitude, 
                                       gps_place)
            .then(function(app_result){
                app_log(req, 
                        app_id, 
                        'MAINTENANCE', 
                        null,
                        result.gps_latitude, 
                        result.gps_longitude, 
                        gps_place);
                return callBack(null, app_result);
            });
        })
	}
}