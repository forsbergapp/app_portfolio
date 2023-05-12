const { read_app_files, get_module_with_init, getUserPreferences } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id, username, locale) => {
    return new Promise((resolve, reject) => {
        const main = (app_id) => {
            const files = [
                ['APP', process.cwd() + '/apps/app1/src/index.html'],
                ['<AppCommonHead/>', process.cwd() + '/apps/common/src/head.html'],
                ['<AppCommonFonts/>', process.cwd() + '/apps/common/src/fonts.html'],
                ['<AppCommonBody/>', process.cwd() + '/apps/common/src/body.html'],
                ['<AppCommonBodyMaintenance/>', process.cwd() + '/apps/common/src/body_maintenance.html'],
                ['<AppCommonBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html'],
                ['<AppCommonProfileDetail/>', process.cwd() + '/apps/common/src/profile_detail.html'], //Profile tag in common body
                ['<AppCommonProfileSearch/>', process.cwd() + '/apps/common/src/profile_search.html'],
                ['<AppCommonUserAccount/>', process.cwd() + '/apps/common/src/user_account.html'],
                

                ['<AppHead/>', process.cwd() + '/apps/app1/src/head.html'],
                ['<AppThemes/>', process.cwd() + '/apps/app1/src/app_themes.html'],
                ['<AppBackground/>', process.cwd() + '/apps/app1/src/background.html'],
                ['<AppToolbarBottom/>', process.cwd() + '/apps/app1/src/toolbar_bottom.html'],
                ['<AppDialogues/>', process.cwd() + '/apps/app1/src/dialogues.html'],
                ['<AppProfileInfo/>', process.cwd() + '/apps/app1/src/profile_info.html'],   /*Profile tag in common body*/
                ['<AppCommonProfileBtnTop/>', process.cwd() + '/apps/common/src/profile_btn_top.html'], /*AppCommonProfileBtnTop inside AppToolbarBttom */
                ['<AppCommonProfileInfoCloud/>', process.cwd() + '/apps/common/src/profile_info_cloud.html'] /*AppCommonProfileInfoCloud inside AppProfileInfo */
                ];
            getUserPreferences(app_id, locale).then((user_preferences) => {
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
        if (username!=null){
            import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
                import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/user_account/user_account.service.js`).then(({getProfileUser}) => {
                    getProfileUser(app_id, null, username, null, (err,result)=>{
                        if (result)
                            main(app_id);
                        else{
                            //return 0 meaning redirect to /
                            resolve (0);
                        }
                    })
                });
            })
        }
        else
            main(app_id);          
    })
}
export {createApp}