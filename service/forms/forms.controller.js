const { createLog} = require ("../../service/db/api/app_log/app_log.service");
const { getIp} = require ("../../service/geolocation/geolocation.controller");
function app_log(app_id, app_module_type, request, result, app_user_id,
                 user_language, user_timezone,user_number_system,user_platform,
                 server_remote_addr, server_user_agent, server_http_host,server_http_accept_language,
                 client_latitude,client_longitude){
    const logData ={
        app_id : app_id,
        app_module : 'FORMS',
        app_module_type : app_module_type,
        app_module_request : request,
        app_module_result : result,
        app_user_id : app_user_id,
        user_language : user_language,
        user_timezone : user_timezone,
        user_number_system : user_number_system,
        user_platform : user_platform,
        server_remote_addr : server_remote_addr,
        server_user_agent : server_user_agent,
        server_http_host : server_http_host,
        server_http_accept_language : server_http_accept_language,
        client_latitude : client_latitude,
        client_longitude : client_longitude
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
                app_log(process.env.MAIN_APP_ID, 
                        app_module_type, 
                        params,
                        gps_place,
                        null,
                        null,
                        null,
                        null,
                        null,
                        req.ip,
                        req.headers["user-agent"],
                        req.headers["host"],
                        req.headers["accept-language"],
                        result.geoplugin_latitude, 
                        result.geoplugin_longitude);
                return callBack(null, app_result);
            })
        }
        else{
            //other apps
            const { getApp } = require(`../../apps/app${app_id}/client`);
            app_module_type = 'APP';
            const app = getApp(app_id, 
                            params,
                            result.geoplugin_latitude,
                            result.geoplugin_longitude, 
                            gps_place)
            .then(function(app_result){
                app_log(app_id, 
                        app_module_type, 
                        params,
                        gps_place,
                        null,
                        null,
                        null,
                        null,
                        null,
                        req.ip,
                        req.headers["user-agent"],
                        req.headers["host"],
                        req.headers["accept-language"],
                        result.geoplugin_latitude, 
                        result.geoplugin_longitude);
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
                app_log(process.env.MAIN_APP_ID, 
                        'ADMIN_SECURE', 
                        null,
                        gps_place,
                        null,
                        null,
                        null,
                        null,
                        null,
                        req.ip,
                        req.headers["user-agent"],
                        req.headers["host"],
                        req.headers["accept-language"],
                        result.geoplugin_latitude, 
                        result.geoplugin_longitude);
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
                app_log(app_id, 
                        'MAINTENANCE',
                        null,
                        gps_place,
                        null,
                        null,
                        null,
                        null,
                        null,
                        req.ip,
                        req.headers["user-agent"],
                        req.headers["host"],
                        req.headers["accept-language"],
                        result.geoplugin_latitude, 
                        result.geoplugin_longitude);
                return callBack(null, app_result);
            });
        })
	}
}