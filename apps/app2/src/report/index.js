const { read_app_files } = await import(`file://${process.cwd()}/apps/apps.service.js`);

const createReport = (app_id, module, locale) => {
    return new Promise((resolve, reject) => {
        const files = [
            ['REPORT', process.cwd() + '/apps/app2/src/report/' + module],
            ['<ReportHead/>', process.cwd() + '/apps/app2/src/report/head.html'],
            ['<ReportCommonHead/>', process.cwd() + '/apps/common/src/report/head.html'],
            ['<ReportCommonFonts/>', process.cwd() + '/apps/common/src/fonts.html'],
            ['<AppCommonFonts/>', process.cwd() + '/apps/app2/src/fonts.html'],
            ['<ReportPaper/>', process.cwd() + '/apps/app2/src/report/paper.html'],
            ['<ReportCommonBody/>', process.cwd() + '/apps/common/src/report/body.html'],
            ['<ReportCommonBodyMaintenance/>', process.cwd() + '/apps/common/src/body_maintenance.html'],
            ['<ReportCommonBodyBroadcast/>', process.cwd() + '/apps/common/src/body_broadcast.html']
        ];
        read_app_files(app_id, files, (err, report)=>{
            if (err)
                reject(err);
            else{
                resolve(report);
            }
        })
    })
}
export{createReport};