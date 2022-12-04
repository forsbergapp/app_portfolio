const { read_app_files, get_module_with_init } = require("../");
module.exports = {
    getApp:(app_id, username, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            function main(app_id){
                const { locales } = require(__dirname + '/../common/src/locales');
                const { setting } = require(__dirname + '/../common/src/setting');
                const files = [
                    ['APP', __dirname + '/src/index.html'],
                    ['<AppCommonHeadFontawesome/>', __dirname + '/../common/src/head_fontawesome.html'],
                    ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                    ['<AppCommonHeadQRCode/>', __dirname + '/../common/src/head_qrcode.html'],
                    ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
                    ['<AppCommonBodyMaintenance/>', __dirname + '/../common/src/body_maintenance.html'],
                    ['<AppCommonBodyBroadcast/>', __dirname + '/../common/src/body_broadcast.html'],
                    ['<AppCommonProfileDetail/>', __dirname + '/../common/src/profile_detail.html'], //Profile tag in common body
                    ['<AppCommonProfileSearch/>', __dirname + '/../common/src/profile_search.html'],
                    ['<AppCommonUserAccount/>', __dirname + '/../common/src/user_account.html'],
                    
    
                    ['<AppHead/>', __dirname + '/src/head.html'],
                    ['<AppThemes/>', __dirname + '/src/toogle.html'],
                    ['<AppBackground/>', __dirname + '/src/background.html'],
                    ['<AppToolbarBottom/>', __dirname + '/src/toolbar_bottom.html'],
                    ['<AppDialogues/>', __dirname + '/src/dialogues.html'],
                    ['<AppProfileInfo/>', __dirname + '/src/profile_info.html'],   /*Profile tag in common body*/
                    ['<AppCommonProfileBtnTop/>', __dirname + '/../common/src/profile_btn_top.html'] /*AppCommonProfileBtnTop inside AppToolbarBttom */
                  ];
                let USER_LOCALE;
                let USER_TIMEZONE;
                let USER_DIRECTION;
                let USER_ARABIC_SCRIPT;
                async function getAppComponents() {
                    //modules with fetch from database
                    USER_LOCALE = await locales(app_id);
                    USER_TIMEZONE = await setting(app_id, 'en', 'TIMEZONE');
                    USER_DIRECTION = await setting(app_id, 'en', 'DIRECTION');
                    USER_ARABIC_SCRIPT = await setting(app_id, 'en', 'ARABIC_SCRIPT');
                }
                getAppComponents().then(function(){
                    read_app_files(app_id, files, (err, app)=>{
                        if (err)
                            reject(err);
                        else{
                            app = app.replace(
                                    '<USER_LOCALE/>',
                                    `${USER_LOCALE}`);
                            app = app.replace(
                                    '<USER_TIMEZONE/>',
                                    `${USER_TIMEZONE}`);
                            app = app.replace(
                                    '<USER_DIRECTION/>',
                                    `<option id='' value=''></option>${USER_DIRECTION}`);
                            app = app.replace(
                                    '<USER_ARABIC_SCRIPT/>',
                                    `<option id='' value=''></option>${USER_ARABIC_SCRIPT}`);
                            //Profile tag not used in common body
                            app = app.replace(
                                    '<AppProfileTop/>',
                                    '');   
                            get_module_with_init(app_id, 
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
                const {getProfileUser} = require("../../service/db/app_portfolio/user_account/user_account.service");
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