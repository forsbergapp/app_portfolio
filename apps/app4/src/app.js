const { render_common_html, read_app_files } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createApp = (app_id) => {
    return new Promise((resolve, reject) => {
        const files = [ 
            ['APP', process.cwd() + '/apps/app4/src/index.html'],
            ['<AppHead/>', process.cwd() + '/apps/app4/src/head.html'],
            ['<AppBody/>', process.cwd() + '/apps/app4/src/body.html']
            ];
        read_app_files(files, (err, app_files)=>{
            render_common_html(app_id, app_files, null, 'FORM', true, null, false, false, false, false).then((app)=>{
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
    });
};
export{createApp};