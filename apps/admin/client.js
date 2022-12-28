const {ConfigGet} = require(global.SERVER_ROOT + '/server/server.service');
const { read_app_files, get_module_with_init, getUserPreferences } = require(global.SERVER_ROOT + "/apps");
module.exports = {
    getAdmin:(app_id, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', global.SERVER_ROOT + '/apps/admin/src/index.html'],
                ['<AppHead/>', global.SERVER_ROOT + '/apps/admin/src/head.html'],
                ['<AppCommonHead/>', global.SERVER_ROOT + '/apps/common/src/head.html'],
                ['<AppCommonHeadMap/>', global.SERVER_ROOT + '/apps/common/src/head_map.html'],
                ['<AppCommonHeadQRCode/>', global.SERVER_ROOT + '/apps/common/src/head_qrcode.html'],
                ['<AppCommonHeadFontawesome/>', global.SERVER_ROOT + '/apps/common/src/head_fontawesome.html'],
                ['<AppCommonProfileSearch/>', global.SERVER_ROOT + '/apps/common/src/profile_search.html'],
                ['<AppCommonUserAccount/>', global.SERVER_ROOT + '/apps/common/src/user_account.html'],
                ['<AppThemes/>', global.SERVER_ROOT + '/apps/common/src/app_themes.html'],
                ['<AppCommonBody/>', global.SERVER_ROOT + '/apps/common/src/body.html'],
                ['<AppCommonBodyBroadcast/>', global.SERVER_ROOT + '/apps/common/src/body_broadcast.html'],
                ['<AppCommonProfileDetail/>', global.SERVER_ROOT + '/apps/common/src/profile_detail.html'], //Profile tag in common body
                ['<AppCommonProfileBtnTop/>', global.SERVER_ROOT + '/apps/common/src/profile_btn_top.html'],
                ['<AppDialogues/>', global.SERVER_ROOT + '/apps/admin/src/dialogues.html']
              ];
            if (ConfigGet(1, 'SERVICE_DB', 'START')=='1'){
                getUserPreferences(app_id).then(function(user_preferences){
                    read_app_files('', files, (err, app)=>{
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
                                '<AppProfileInfo/>',
                                '');
                            //APP Profile tag not used in common body
                            app = app.replace(
                                '<AppProfileTop/>',
                                '');
                            get_module_with_init(app_id,
                                                null,
                                                null,  
                                                'admin_exception_before',
                                                null, //do not close eventsource before
                                                true, //ui
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
            else{
                read_app_files('', files, (err, app)=>{
                    if (err)
                        reject(err);
                    else{
                        //COMMON, set user preferences content
                        app = app.replace(
                            '<USER_LOCALE/>',
                            '');
                        app = app.replace(
                            '<USER_TIMEZONE/>',
                            '');
                        app = app.replace(
                            '<USER_DIRECTION/>',
                            '');
                        app = app.replace(
                            '<USER_ARABIC_SCRIPT/>',
                            '');
                        //APP Profile tag not used in common body
                        app = app.replace(
                            '<AppProfileInfo/>',
                            '');
                        //APP Profile tag not used in common body
                        app = app.replace(
                            '<AppProfileTop/>',
                            '');
                        get_module_with_init(app_id,
                                            1,  //system admin, no db available
                                            null,  
                                            'admin_exception_before',
                                            null, //do not close eventsource before
                                            true, //ui
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
            }
            
        })
    }
}