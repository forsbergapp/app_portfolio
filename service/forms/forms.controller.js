const { createLog, createLogAdmin} = require ("../../service/db/app_portfolio/app_log/app_log.service");
const { createLogAppSE} = require("../../service/log/log.controller");
const { getIp, getIpAdmin} = require ("../../service/geolocation/geolocation.controller");
module.exports = {
  getForm: (req, res, app_id, params, callBack) => {
    //getIp and createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    getIp(req, res, (err, result)=>{
        let gps_place = result.geoplugin_city + ', ' +
                        result.geoplugin_regionName + ', ' +
                        result.geoplugin_countryName;
        //check if maintenance
        const { getParameter} = require ("../../service/db/app_portfolio/app_parameter/app_parameter.service");
        getParameter(req.query.app_id, process.env.COMMON_APP_ID,'SERVER_MAINTENANCE',  (err, db_SERVER_MAINTENANCE)=>{
            if (err)
                createLogAppSE(app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
                    return callBack(err, null);
                })
            else{
                if (db_SERVER_MAINTENANCE==1){
                    const { getMaintenance } = require("../../apps");
                    const app = getMaintenance(app_id,
                                                result.geoplugin_latitude,
                                                result.geoplugin_longitude,
                                                gps_place)
                    .then(function(app_result){
                        createLog(req.query.app_id,
                                  { app_id : app_id,
                                    app_module : 'FORMS',
                                    app_module_type : 'MAINTENANCE',
                                    app_module_request : null,
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
                                    client_latitude : result.geoplugin_latitude,
                                    client_longitude : result.geoplugin_longitude
                                    }, (err,results)  => {
                                        return callBack(null, app_result);
                        });
                    });
                }
                else{
                    const { getApp } = require(`../../apps/app${app_id}/client`);
                    const app = getApp(app_id, 
                                        params,
                                        result.geoplugin_latitude,
                                        result.geoplugin_longitude, 
                                        gps_place)
                    .then(function(app_result){
                        createLog(req.query.app_id,
                                  { app_id : app_id,
                                    app_module : 'FORMS',
                                    app_module_type : 'APP',
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
                                    client_latitude : result.geoplugin_latitude,
                                    client_longitude : result.geoplugin_longitude
                                    }, (err,results)  => {
                                        return callBack(null, app_result)
                        });
                    });            
                }
            }
        })
    })
  },
  getFormAdmin: (req, res, app_id, callBack) => {
    //getIp and createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    getIpAdmin(req, res, (err, result)=>{
        let gps_place = result.geoplugin_city + ', ' +
                        result.geoplugin_regionName + ', ' +
                        result.geoplugin_countryName;
        const { getAdmin } = require("../../apps/admin/client");
        const app = getAdmin(app_id,
                             result.geoplugin_latitude,
                             result.geoplugin_longitude, 
                             gps_place)
        .then(function(app_result){
            createLogAdmin(req.query.app_id,
                            { app_id : app_id,
                                app_module : 'FORMS',
                                app_module_type : 'ADMIN',
                                app_module_request : null,
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
                                client_latitude : result.geoplugin_latitude,
                                client_longitude : result.geoplugin_longitude
                                }, (err,results)  => {
                                    return callBack(null, app_result);
                            });
        })
    })
  },
  getAdminSecure: (req, res) => {
        const { getAdminSecure } = require("../../apps/admin/src/secure");
        req.query.app_user_id = null;
        req.query.callback=1;    
        getIpAdmin(req, res, (err, result)=>{
            let gps_place = result.geoplugin_city + ', ' +
                            result.geoplugin_regionName + ', ' +
                            result.geoplugin_countryName;
            getAdminSecure(req.query.app_id, (err, app_result)=>{
                createLogAdmin(req.query.app_id,
                                { app_id : req.query.app_id,
                                    app_module : 'FORMS',
                                    app_module_type : 'ADMIN_SECURE',
                                    app_module_request : null,
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
                                    client_latitude : result.geoplugin_latitude,
                                    client_longitude : result.geoplugin_longitude
                                    }, (err,results)  => {
                                        return res.status(200).send(
                                            app_result
                                        );
                                });
            })
        })
  }
}