const { apps_start_ok } = await import(`file://${process.cwd()}/apps/apps.service.js`);
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const { render_common_html, read_app_files, getUserPreferences } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createAdmin = (app_id, locale) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['APP', process.cwd() + '/apps/admin/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/admin/src/head.html'],
            ['<AppMenu/>', process.cwd() + '/apps/admin/src/menu.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/admin/src/dialogues.html'],
            ['<AppSecure/>', process.cwd() + '/apps/admin/src/secure.html']
            ];
        if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && apps_start_ok()==true){
            getUserPreferences(app_id, locale).then((user_preferences) => {
                read_app_files(files, (err, app)=>{
                    render_common_html(app_id, app,	'FORM', true, '<AppUserAccount/>', true).then((app)=>{
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
                            resolve(app);
                        }
                    });
                });
            });
        }
        else{
            read_app_files(files, (err, app)=>{
                render_common_html(app,	'FORM', true, '<AppUserAccount/>', true).then((app)=>{
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
                        resolve(app);
                    }
                });
            });
        }
        
    });
};
export {createAdmin};