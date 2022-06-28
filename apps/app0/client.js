const { getAppStartParameters } = require("../../service/db/api/app_parameter/app_parameter.service");
const { read_app_files } = require("../");
module.exports = {
    getApp:(app_id, params, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', __dirname + '/src/index.html'],
                ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
                ['<AppCommonProfileDetail/>', __dirname + '/../common/src/profile_detail.html'], //Profile tag in common body

                ['<AppHead/>', __dirname + '/src/head.html'],
                ['<AppUserAccount/>', __dirname + '/src/user_account.html'],
                ['<AppToggle/>', __dirname + '/src/toogle.html'],
                ['<AppBackground/>', __dirname + '/src/background.html'],
                ['<AppDialogues/>', __dirname + '/src/dialogues.html'],
                ['<AppProfileInfo/>', __dirname + '/src/profile_info.html'],   /*Profile tag in common body*/
                ['<AppWindowInfo/>', __dirname + '/src/window_info.html']
              ];
              read_app_files(files, (err, app)=>{
                if (err)
                    reject(err);
                else{
                    //Profile tag not used in common body
                    app = app.replace(
                        '<AppProfileTop/>',
                        '');        
                    getAppStartParameters(process.env.MAIN_APP_ID, (err,result) =>{
                        if (err)
                            reject(err);
                        else{
                            let parameters = {   
                                app_id: app_id,
                                exception_app_function: 'app_exception',
                                close_eventsource: null,
                                ui: true,
                                admin: null,
                                service_auth: result[0].service_auth,
                                app_rest_client_id: result[0].app_rest_client_id,
                                app_rest_client_secret: result[0].app_rest_client_secret,
                                rest_app_parameter: result[0].rest_app_parameter,
                                gps_lat: gps_lat, 
                                gps_long: gps_long, 
                                gps_place: gps_place
                            }    
                            app = app.replace(
                                '<ITEM_COMMON_PARAMETERS/>',
                                JSON.stringify(parameters));
                            resolve(app);
                        }
                    })
                }
            })           
        })
    }
}