const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
const { read_app_files, get_module_with_init, getUserPreferences } = require(global.SERVER_ROOT + "/apps");
module.exports = {
    getApp:(app_id, username, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            function main(app_id){
                const files = [
                    ['APP', global.SERVER_ROOT + '/apps/app1/src/index.html'],
                    ['<AppCommonHeadFontawesome/>', global.SERVER_ROOT + '/apps/common/src/head_fontawesome.html'],
                    ['<AppCommonHead/>', global.SERVER_ROOT + '/apps/common/src/head.html'],
                    ['<AppCommonHeadQRCode/>', global.SERVER_ROOT + '/apps/common/src/head_qrcode.html'],
                    ['<AppCommonBody/>', global.SERVER_ROOT + '/apps/common/src/body.html'],
                    ['<AppCommonBodyMaintenance/>', global.SERVER_ROOT + '/apps/common/src/body_maintenance.html'],
                    ['<AppCommonBodyBroadcast/>', global.SERVER_ROOT + '/apps/common/src/body_broadcast.html'],
                    ['<AppCommonProfileDetail/>', global.SERVER_ROOT + '/apps/common/src/profile_detail.html'], //Profile tag in common body
                    ['<AppCommonProfileSearch/>', global.SERVER_ROOT + '/apps/common/src/profile_search.html'],
                    ['<AppCommonUserAccount/>', global.SERVER_ROOT + '/apps/common/src/user_account.html'],
                    
    
                    ['<AppHead/>', global.SERVER_ROOT + '/apps/app1/src/head.html'],
                    ['<AppThemes/>', global.SERVER_ROOT + '/apps/app1/src/app_themes.html'],
                    ['<AppBackground/>', global.SERVER_ROOT + '/apps/app1/src/background.html'],
                    ['<AppToolbarBottom/>', global.SERVER_ROOT + '/apps/app1/src/toolbar_bottom.html'],
                    ['<AppDialogues/>', global.SERVER_ROOT + '/apps/app1/src/dialogues.html'],
                    ['<AppProfileInfo/>', global.SERVER_ROOT + '/apps/app1/src/profile_info.html'],   /*Profile tag in common body*/
                    ['<AppCommonProfileBtnTop/>', global.SERVER_ROOT + '/apps/common/src/profile_btn_top.html'] /*AppCommonProfileBtnTop inside AppToolbarBttom */
                  ];
                getUserPreferences(app_id).then(function(user_preferences){
                    read_app_files(app_id, files, (err, app)=>{
                        if (err)
                            reject(err);
                        else{
                            //COMMON, set user preferences content
                            app = app.replace(
                                    '<USER_LOCALE/>',
                                    `${user_preferences.user_locales}`);
                            app = app.replace(
                                    '<USER_TIMEZONE/>',
                                    `${user_preferences.user_timezones}`);
                            app = app.replace(
                                    '<USER_DIRECTION/>',
                                    `<option id='' value=''></option>${user_preferences.user_directions}`);
                            app = app.replace(
                                    '<USER_ARABIC_SCRIPT/>',
                                    `<option id='' value=''></option>${user_preferences.user_arabic_scripts}`);
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
            if (username!=null){
                const {getProfileUser} = require(global.SERVER_ROOT +  ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + "/user_account/user_account.service");
                getProfileUser(app_id, null, username, null, (err,result)=>{
                    if (result)
                        main(app_id);
                    else{
                        //return 0 meaning redirect to /
                        resolve (0);
                    }
                })
            }
            else
                main(app_id);          
        })
    }
}