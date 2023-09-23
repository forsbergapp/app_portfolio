const { render_app_with_data, render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id, params) => {
    return new Promise((resolve, reject) => {
        const files = [ 
            ['APP', process.cwd() + '/apps/app4/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/app4/src/head.html'],
            ['<AppBody/>', process.cwd() + '/apps/app4/src/body.html']
            ];
        if (params==null || params =='1' || params =='2' || params =='3' ){
            render_app_html(app_id, files, {locale:null,
                                            module_type:'FORM',
                                            map: true,
                                            custom_tag_profile_search:null,
                                            custom_tag_user_account:null,
                                            custom_tag_profile_top:null,
                                            app_themes:false, 
                                            render_locales:false, 
                                            render_settings:true, 
                                            render_provider_buttons:false
                                        },(err, app)=>{
                if (err)
                    reject(err);
                else{
                    const render_variables = [];
                    //APP Profile tag not used in common body
                    render_variables.push(['AppProfileInfo','']);
                    //APP Profile tag not used in common body
                    render_variables.push(['AppProfileTop','']);
                    resolve({app:render_app_with_data(app.app, render_variables),
                                map_styles: app.settings.map_styles,
                                map:true});
                }
            });
        }
        else
            resolve(0);
    });
};
export{createApp};