const { read_app_files, get_module_with_init } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id, params, locale) => {
    return new Promise((resolve, reject) => {
        const files = [ 
            ['APP', process.cwd() + '/apps/app3/src/index.html'],
            ['<AppCommonHead/>', process.cwd() + '/apps/common/src/head.html'],
            ['<AppCommonFonts/>', process.cwd() + '/apps/common/src/fonts.html'],
            ['<AppCommonBody/>', process.cwd() + '/apps/common/src/body.html'],
            ['<AppCommonBodyMaintenance/>', process.cwd() + '/apps/common/src/body_maintenance.html'],
            ['<AppCommonBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html'],    
            /*Profile tag AppCommonProfileDetail in common body */
            ['<AppCommonProfileDetail/>', process.cwd() + '/apps/common/src/profile_detail.html'], 
            ['<AppCommonProfileSearch/>', process.cwd() + '/apps/common/src/profile_search.html'],
            ['<AppCommonUserAccount/>', process.cwd() + '/apps/common/src/user_account.html'],
            ['<AppHead/>', process.cwd() + '/apps/app3/src/head.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/app3/src/dialogues.html']
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
                                     locale,
                                     null,
                                     null,
                                     'app.app_exception',
                                     true,
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
export{createApp}