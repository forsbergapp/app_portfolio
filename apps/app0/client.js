const { read_app_files, get_module_with_init } = require("../");
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
              read_app_files(app_id, files, (err, app)=>{
                if (err)
                    reject(err);
                else{
                    //Profile tag not used in common body
                    app = app.replace(
                        '<AppProfileTop/>',
                        '');   
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