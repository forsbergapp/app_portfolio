const { render_common_html, render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id, params) => {
    return new Promise((resolve, reject) => {
        const files = [ 
            ['APP', process.cwd() + '/apps/app3/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/app3/src/head.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/app3/src/dialogues.html']
            ];
        if (params==null || params =='1' || params =='2' || params =='3' ){
            render_app_html(files, (err, app_files)=>{
                render_common_html(app_id, app_files, null, 'FORM', false, null, false, false, false, false).then((app)=>{
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
        else
            resolve(0);        
    });
};
export{createApp};