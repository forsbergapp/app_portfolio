const { render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id, params) => {
    return new Promise((resolve, reject) => {
        const files = [ 
            ['APP', process.cwd() + '/apps/app3/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/app3/src/head.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/app3/src/dialogues.html']
            ];
        if (params==null || params =='1' || params =='2' || params =='3' ){
            render_app_html(app_id, files, {locale:null, 
                                            module_type:'FORM', 
                                            map: false, 
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
        }
        else
            resolve(0);        
    });
};
export{createApp};