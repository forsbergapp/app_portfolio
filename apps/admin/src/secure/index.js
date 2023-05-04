const { read_app_files, get_module_with_init} = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createAdminSecure = (app_id, system_admin, user_account_id, gps_lat, gps_long, gps_place, locale) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['APP', process.cwd() + '/apps/admin/src/secure/index.html'],
            ['<AppHeadJS/>', process.cwd() + '/apps/admin/src/secure/admin.js'],
            ['<AppAdminMainHTML/>', process.cwd() + '/apps/admin/src/secure/main.html'],
            ['<AppAdminDialogueHTML/>', process.cwd() + '/apps/admin/src/secure/dialogue.html']
        ];
        read_app_files('', files, (err, app)=>{
            if (err)
                reject(err);
            else{
                /*replace commented development tags with production tags*/
                app = app.replace(  '/*<APP_SCRIPT_START/>*/',
                                    '<SCRIPT>');
                app = app.replace(  '/*<APP_SCRIPT_END/>*/',
                                    '</SCRIPT>');
                get_module_with_init(app_id, 
                                     locale,
                                     system_admin,
                                     user_account_id,
                                     'app.admin_logoff_app',
                                     true, //close eventsource and create new as logged in
                                     false, //ui
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
export {createAdminSecure}