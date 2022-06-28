const { getAppStartParameters } = require("../../service/db/api/app_parameter/app_parameter.service");
const { read_app_files } = require("../");
module.exports = {
    getAdmin:(gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', __dirname + '/src/index.html'],
                ['<AppHead/>', __dirname + '/src/head.html'],
                ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                ['<AppCommonHeadMap/>', __dirname + '/../common/src/head_map.html'],
                ['<AppCommonHeadChart/>', __dirname + '/../common/src/head_chart.html'],
                ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
                ['<AppCommonProfileDetail/>', __dirname + '/../common/src/profile_detail.html'], //Profile tag in common body
                ['<AppDialogues/>', __dirname + '/src/dialogues.html']
              ];
            read_app_files(files, (err, app)=>{
                if (err)
                    reject(err);
                else{
                    //Profile tag not used in common body
                    app = app.replace(
                        '<AppProfileInfo/>',
                        '');
                    //Profile tag not used in common body
                    app = app.replace(
                        '<AppProfileTop/>',
                        '');        
                    getAppStartParameters(process.env.MAIN_APP_ID, (err,result) =>{
                        if (err)
                            reject(err);
                        else{
                            let parameters = {   
                                app_id: '',
                                exception_app_function: 'admin_exception_before',
                                close_eventsource: null,
                                ui: true,
                                admin: true,
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