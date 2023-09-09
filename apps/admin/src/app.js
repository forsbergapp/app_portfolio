const { apps_start_ok } = await import(`file://${process.cwd()}/apps/apps.service.js`);
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const { render_common_html, read_app_files } = await import(`file://${process.cwd()}/apps/apps.service.js`);

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
            read_app_files(files, (err, app)=>{
                render_common_html(app_id, app,	locale, 'FORM', true, '<AppUserAccount/>', true, true, true, true).then((app)=>{
                    if (err)
                        reject(err);
                    else{
                        //APP Profile tag not used in common body
                        app.app = app.app.replace(
                            '<AppProfileInfo/>',
                            '');
                        //APP Profile tag not used in common body
                        app.app = app.app.replace(
                            '<AppProfileTop/>',
                            '');
                        resolve(app.app);
                    }
                });
            });
        }
        else{
            read_app_files(files, (err, app_files)=>{
                render_common_html(app_id, app_files, locale, 'FORM', true, '<AppUserAccount/>', true, false, false, false).then((app)=>{
                    if (err)
                        reject(err);
                    else{
                        //APP Profile tag not used in common body
                        app.app = app.app.replace(
                            '<AppProfileInfo/>',
                            '');
                        //APP Profile tag not used in common body
                        app.app = app.app.replace(
                            '<AppProfileTop/>',
                            '');
                        resolve(app.app);
                    }
                });
            });
        }
        
    });
};
export {createAdmin};