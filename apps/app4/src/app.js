const { render_app_with_data, render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id) => {
    return new Promise((resolve, reject) => {
        const files = [ 
            ['APP', process.cwd() + '/apps/app4/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/app4/src/head.html'],
            ['<AppBody/>', process.cwd() + '/apps/app4/src/body.html']
            ];
        render_app_html(app_id, files, {locale:null,
                                        module_type:'FORM',
                                        map: true,
                                        user_account_custom_tag:null,
                                        app_themes:false, 
                                        render_locales:false, 
                                        render_settings:false, 
                                        render_provider_buttons:false
                                    },(err, app)=>{
            if (err)
                reject(err);
            else{
                //APP Profile tag not used in common body
                const render_variables = [];
                render_variables.push(['AppProfileInfo','']);
                //APP Profile tag not used in common body
                render_variables.push(['AppProfileTop','']);
                resolve(render_app_with_data(app.app, render_variables));
            }
        });
    });
};
export{createApp};