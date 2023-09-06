const { render_common_html, read_app_files } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id, username, locale) => {
    return new Promise((resolve, reject) => {
        const main = async (app_id) => {
            const files = [
                ['APP', process.cwd() + '/apps/app1/src/index.html'],                
                ['<AppHead/>', process.cwd() + '/apps/app1/src/head.html'],
                ['<AppBackground/>', process.cwd() + '/apps/app1/src/background.html'],
                ['<AppToolbarBottom/>', process.cwd() + '/apps/app1/src/toolbar_bottom.html'],
                ['<AppDialogues/>', process.cwd() + '/apps/app1/src/dialogues.html']
                ];
            //file to add after common HTML rendered
            const fs = await import('node:fs');
            const profile_info = await fs.promises.readFile(`${process.cwd()}/apps/app1/src/profile_info.html`, 'utf8');
            const profile_info_cloud = await fs.promises.readFile(`${process.cwd()}/apps/common/src/profile_info_cloud.html`, 'utf8');
            const app_themes = await fs.promises.readFile(`${process.cwd()}/apps/app1/src/app_themes.html`, 'utf8');
            read_app_files(files, (err, app_files)=>{
                render_common_html(app_id, app_files, locale, 'FORM', false, null, false, true, true).then((app)=>{
                    if (err)
                        reject(err);
                    else{
                        //render after COMMON:
                        app.app = app.app.replace('<AppProfileInfo/>', profile_info);
                        app.app = app.app.replace('<CommonBodyThemes/>', app_themes);
                        //render CommonBodyProfileInfoCloud after above, this function only available for this app
                        app.app = app.app.replace('<CommonBodyProfileInfoCloud/>', profile_info_cloud);
                        //APP Profile tag not used in common body
                        app.app = app.app.replace(
                                '<AppProfileTop/>',
                                '');   
                        resolve(app.app);
                    }
                });
            });
        };
        if (username!=null){
            import(`file://${process.cwd()}/server/dbapi/app_portfolio/user_account/user_account.service.js`).then(({getProfileUser}) => {
                getProfileUser(app_id, null, username, null, (err,result)=>{
                    if (result)
                        main(app_id);
                    else{
                        //return 0 meaning redirect to /
                        resolve (0);
                    }
                });
            });
        }
        else
            main(app_id);          
    });
};
export {createApp};