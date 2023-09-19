const { render_common_html, render_app_html } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createReport = (app_id, module) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['REPORT', process.cwd() + '/apps/app2/src/report/' + module],
            ['<ReportHead/>', process.cwd() + '/apps/app2/src/report/head.html'],
            ['<AppCommonFonts/>', process.cwd() + '/apps/app2/src/fonts.html'],
            ['<ReportPaper/>', process.cwd() + '/apps/app2/src/report/paper.html']
        ];
        render_app_html(files, (err, report)=>{
            render_common_html(app_id, report,null, 'REPORT', false, null, false, false, false, false).then((report)=>{
                if (err)
                    reject(err);
                else{
                    resolve(report.app);
                }
            });
        });
    });
};
export{createReport};