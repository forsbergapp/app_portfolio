const { read_app_files, get_module_with_init } = require(global.SERVER_ROOT + "/apps");
module.exports = {
    getApp:(app_id, params, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', global.SERVER_ROOT + '/apps/app3/src/index.html'],
                ['<AppCommonHeadFontawesome/>', global.SERVER_ROOT + '/apps/common/src/head_fontawesome.html'],
                ['<AppCommonHead/>', global.SERVER_ROOT + '/apps/common/src/head.html'],
                ['<AppCommonBody/>', global.SERVER_ROOT + '/apps/common/src/body.html'],
                ['<AppCommonBodyMaintenance/>', global.SERVER_ROOT + '/apps/common/src/body_maintenance.html'],
                ['<AppCommonBodyBroadcast/>', global.SERVER_ROOT + '/apps/common/src/body_broadcast.html'],    
                /*Profile tag AppCommonProfileDetail in common body */
                ['<AppCommonProfileDetail/>', global.SERVER_ROOT + '/apps/common/src/profile_detail.html'], 
                ['<AppCommonProfileSearch/>', global.SERVER_ROOT + '/apps/common/src/profile_search.html'],
                ['<AppCommonUserAccount/>', global.SERVER_ROOT + '/apps/common/src/user_account.html'],
                ['<AppHead/>', global.SERVER_ROOT + '/apps/app3/src/head.html'],
                ['<AppDialogues/>', __dirname + '/src/dialogues.html']
              ];
            read_app_files(app_id, files, (err, app)=>{
                if (err)
                    reject(err);
                else{
                    //APP Profile tag not used in common body
                    app = app.replace(
                        '<AppProfileInfo/>',
                        '');
                    //APP Profile tag not used in common body
                    app = app.replace(
                        '<AppProfileTop/>',
                        '');
                    get_module_with_init(app_id, 
                                         null,
                                         null,
                                         'app_exception',
                                         null,
                                         true,
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