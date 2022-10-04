const { read_app_files, get_module_with_init_admin } = require("../");
module.exports = {
    getAdmin:(app_id, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', __dirname + '/src/index.html'],
                ['<AppHead/>', __dirname + '/src/head.html'],
                ['<AppCommonHead/>', __dirname + '/../common/src/head.html'],
                ['<AppCommonHeadMap/>', __dirname + '/../common/src/head_map.html'],
                ['<AppCommonProfileSearch/>', __dirname + '/../common/src/profile_search.html'],
                ['<AppCommonUserAccount/>', __dirname + '/../common/src/user_account.html'],
                ['<AppCommonBody/>', __dirname + '/../common/src/body.html'],
                ['<AppCommonProfileDetail/>', __dirname + '/../common/src/profile_detail.html'], //Profile tag in common body
                ['<AppDialogues/>', __dirname + '/src/dialogues.html']
              ];
            read_app_files('', files, (err, app)=>{
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
                    get_module_with_init_admin(app_id, 
                                         'admin_exception_before',
                                         null,
                                         true,
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