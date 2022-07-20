const { read_app_files, get_module_with_init } = require("../");
module.exports = {
    getApp:(app_id, username, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            function main(app_id){
                const files = [
                    ['APP', __dirname + '/src/index.html'],
                    ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                    ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
                    ['<AppCommonProfileDetail/>', __dirname + '/../common/src/profile_detail.html'], //Profile tag in common body
                    ['<AppCommonProfileSearch/>', __dirname + '/../common/src/profile_search.html'],

                    ['<AppHead/>', __dirname + '/src/head.html'],
                    ['<AppUserAccount/>', __dirname + '/src/user_account.html'],
                    ['<AppToggle/>', __dirname + '/src/toogle.html'],
                    ['<AppBackground/>', __dirname + '/src/background.html'],
                    ['<AppDialogues/>', __dirname + '/src/dialogues.html'],
                    ['<AppProfileInfo/>', __dirname + '/src/profile_info.html']   /*Profile tag in common body*/
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
            }
            if (username!=null){
                const {getProfileUser} = require("../../service/db/api/user_account/user_account.service");
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