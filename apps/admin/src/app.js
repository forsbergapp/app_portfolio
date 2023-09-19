const { apps_start_ok } = await import(`file://${process.cwd()}/apps/apps.service.js`);
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const { render_app_with_data, render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createAdmin = (app_id, locale) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['APP', process.cwd() + '/apps/admin/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/admin/src/head.html'],
            ['<AppMenu/>', process.cwd() + '/apps/admin/src/menu.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/admin/src/dialogues.html'],
            ['<AppSecure/>', process.cwd() + '/apps/admin/src/secure.html']
            ];
        let render_locales, render_settings, render_provider_buttons;
        if (ConfigGet(1, 'SERVICE_DB', 'START')=='1' && apps_start_ok()==true){
            render_locales = true;
            render_settings= true;
            render_provider_buttons=true;
        }
        else{
            render_locales = false;
            render_settings= false;
            render_provider_buttons=false;
        }
        render_app_html(app_id, files, {locale:locale, 
                                        module_type:'FORM', 
                                        map: true, 
                                        user_account_custom_tag:'<AppUserAccount/>',
                                        app_themes:true, 
                                        render_locales:render_locales, 
                                        render_settings:render_settings, 
                                        render_provider_buttons:render_provider_buttons
                                    }, (err, app)=>{
            if (err)
                reject(err);
            else{
                const render_variables = [];
                //APP Profile tag not used in common body
                render_variables.push(['AppProfileInfo','']);
                //APP Profile tag not used in common body
                render_variables.push(['AppProfileTop','']);
                resolve(render_app_with_data(app.app, render_variables));
            }
        });
    });
};
export {createAdmin};