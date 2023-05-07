const { admin_pool_started } = await import(`file://${process.cwd()}/service/db/admin/admin.service.js`);
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const { read_app_files, get_module_with_init, getUserPreferences } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createAdmin = (app_id, locale) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['APP', process.cwd() + '/apps/admin/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/admin/src/head.html'],
            ['<AppCommonHead/>', process.cwd() + '/apps/common/src/head.html'],
            ['<AppCommonFonts/>', process.cwd() + '/apps/common/src/fonts.html'],
            ['<AppCommonHeadMap/>', process.cwd() + '/apps/common/src/head_map.html'],
            ['<AppCommonProfileSearch/>', process.cwd() + '/apps/common/src/profile_search.html'],
            ['<AppCommonUserAccount/>', process.cwd() + '/apps/common/src/user_account.html'],
            ['<AppMenu/>', process.cwd() + '/apps/admin/src/menu.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/admin/src/dialogues.html'],
            ['<AppSecure/>', process.cwd() + '/apps/admin/src/secure.html'],
            ['<AppThemes/>', process.cwd() + '/apps/common/src/app_themes.html'],
            ['<AppCommonBody/>', process.cwd() + '/apps/common/src/body.html'],
            ['<AppCommonBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html'],
            ['<AppCommonProfileDetail/>', process.cwd() + '/apps/common/src/profile_detail.html'], //Profile tag in common body
            ['<AppCommonProfileBtnTop/>', process.cwd() + '/apps/common/src/profile_btn_top.html']            
            ];
        if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && admin_pool_started()==1){
            getUserPreferences(app_id, locale).then((user_preferences) => {
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
                                            locale,
                                            null,
                                            null,  
                                            'app.admin_exception',
                                            true, //ui
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
                                         locale,
                                         1,  //system admin, no db available
                                         null,  
                                         'app.admin_exception_before',
                                         true, //ui
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
export {createAdmin}