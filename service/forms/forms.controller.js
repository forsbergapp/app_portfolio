const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
const { createLog, createLogAdmin} = require (global.SERVER_ROOT +  ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + "/app_log/app_log.service");
const { getIp, getIpAdmin, getIpSystemAdmin} = require (global.SERVER_ROOT + "/service/geolocation/geolocation.controller");
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
        if (ConfigGet(0, null, 'MAINTENANCE')=='1'){
            const { getMaintenance } = require(global.SERVER_ROOT + "/apps");
            const app = getMaintenance(app_id,
                                        result.geoplugin_latitude,
                                        result.geoplugin_longitude,
                                        gps_place)
            .then(function(app_result){
                return callBack(null, app_result);
            });
        }
        else{
            const { getApp } = require(global.SERVER_ROOT + `/apps/app${app_id}/client`);
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
    })
  },
  getFormAdmin: (req, res, app_id, callBack) => {
    //getIp and createLog needs app_id
    req.query.app_id = app_id;
    req.query.app_user_id = null;
    req.query.callback=1;
    if (ConfigGet(1, 'SERVICE_DB', 'START')=='1'){
        getIpAdmin(req, res, (err, result)=>{
            let gps_place = result.geoplugin_city + ', ' +
                            result.geoplugin_regionName + ', ' +
                            result.geoplugin_countryName;
            const { getAdmin } = require(global.SERVER_ROOT + "/apps/admin/client");
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
    }
    else{
        getIpSystemAdmin(req, res, (err, result)=>{
            let gps_place = result.geoplugin_city + ', ' +
                            result.geoplugin_regionName + ', ' +
                            result.geoplugin_countryName;
            const { getAdmin } = require(global.SERVER_ROOT + "/apps/admin/client");
            const { createLogAppCI } = require(global.SERVER_ROOT + "/service/log/log.controller");
            const app = getAdmin(app_id,
                                 result.geoplugin_latitude,
                                 result.geoplugin_longitude, 
                                 gps_place)
            .then(function(app_result){
                createLogAppCI(req, res, __appfilename, __appfunction, __appline, 'SYSTEM ADMIN Forms Admin').then(function(){
                    return callBack(null, app_result);
                })
            })
        })
    }
  },
  getAdminSecure: (req, res) => {
        const { getAdminSecure } = require(global.SERVER_ROOT + "/apps/admin/src/secure");
        const { createLogAppCI } = require(global.SERVER_ROOT + "/service/log/log.controller");
        try {
            const app = getAdminSecure(req.query.app_id,
                1,      //system admin=1
                null,
                null,
                null, 
                null)
            .then(function(app_result){
                createLogAppCI(req, res, __appfilename, __appfunction, __appline, 'SYSTEM ADMIN Forms admin secure').then(function(){
                    return res.status(200).json({
                        app: app_result
                    });
                })
            })    
        } catch (error) {
            return res.status(500).json({
                error
            });
        }     
  }
}