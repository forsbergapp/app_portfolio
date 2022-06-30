async function read_app_files(app_id, files, callBack){
    const {promises: {readFile}} = require("fs");
    let i = 0;
    Promise.all(files.map(file => {
        return readFile(file[1], 'utf8');
    })).then(fileBuffers => {
        let app ='';
        fileBuffers.forEach(fileBuffer => {
            if (app=='')
                app = fileBuffer.toString();
            else
                app = app.replace(
                        files[i][0],
                        `${fileBuffer.toString()}`);
            i++;
        });
        callBack(null, app);
    })
    .catch(err => {
        const { createLogAppSE } = require("../service/log/log.service");
        createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
        callBack(err, null);
    });
}
async function get_module_with_init(app_id, 
                                    exception_app_function,
                                    close_eventsource,
                                    ui,
                                    admin,
                                    gps_lat,
                                    gps_long,
                                    gps_place,
                                    module, callBack){
    const { getAppStartParameters } = require("../service/db/api/app_parameter/app_parameter.service");
    getAppStartParameters(process.env.MAIN_APP_ID, (err,result) =>{
        if (err)
            callBack(err, null);
        else{
            let parameters = {   
                app_id: app_id,
                exception_app_function: exception_app_function,
                close_eventsource: close_eventsource,
                ui: ui,
                admin: admin,
                service_auth: result[0].service_auth,
                app_rest_client_id: result[0].app_rest_client_id,
                app_rest_client_secret: result[0].app_rest_client_secret,
                rest_app_parameter: result[0].rest_app_parameter,
                gps_lat: gps_lat, 
                gps_long: gps_long, 
                gps_place: gps_place
            };
            module = module.replace(
                    '<ITEM_COMMON_PARAMETERS/>',
                    JSON.stringify(parameters));
            callBack(null, module);
        }
    })
}
module.exports = {
    getMaintenance:(app_id, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', __dirname + '/common/src/index_maintenance.html'],
                ['<AppHead/>', __dirname + '/common/src/head_maintenance.html'],
                ['<AppCommonHead/>', __dirname + '/common/src/head.html'],
                ['<AppCommonBody/>', __dirname + '/common/src/body.html'],
                ['<AppCommonProfileDetail/>', __dirname + '/common/src/profile_detail.html'] //Profile tag in common body
              ];
            read_app_files(app_id, files, (err, app)=>{
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
                    //maintenance can be used all app_id
                    get_module_with_init(app_id, 
                                         'app_exception',
                                         null,
                                         true,
                                         null,
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
module.exports.read_app_files = read_app_files;
module.exports.get_module_with_init = get_module_with_init;