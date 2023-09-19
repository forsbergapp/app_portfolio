const { render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

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
            render_app_html(app_id, files, {locale:locale, 
                                            module_type:'FORM', 
                                            map: false, 
                                            user_account_custom_tag:null,
                                            app_themes:false, 
                                            render_locales:true, 
                                            render_settings:true, 
                                            render_provider_buttons:true
                                        },(err, app)=>{
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