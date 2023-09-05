const { render_common_html, read_app_files } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id, params) => {
    return new Promise((resolve, reject) => {
        const files = [ 
            ['APP', process.cwd() + '/apps/app3/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/app3/src/head.html'],
            ['<AppDialogues/>', process.cwd() + '/apps/app3/src/dialogues.html']
            ];
        if (params==null || params =='1' || params =='2' || params =='3' ){
            read_app_files(files, (err, app)=>{
                render_common_html(app_id, app,	'FORM', false, null, false).then((app)=>{
                    if (err)
                        reject(err);
                    else{
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
        else
            resolve(0);        
    });
};
export{createApp};