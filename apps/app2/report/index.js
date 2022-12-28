const { read_app_files, get_module_with_init } = require(global.SERVER_ROOT + "/apps");
module.exports = {
    getReport:(app_id, module, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['REPORT', global.SERVER_ROOT + '/apps/app2/report/' + module],
                ['<ReportHead/>', global.SERVER_ROOT + '/apps/app2/report/head.html'],
                ['<ReportCommonHeadPrayTimes/>', global.SERVER_ROOT + '/apps/common/src/head_praytimes.html'],
                ['<ReportCommonHeadRegional/>', global.SERVER_ROOT + '/apps/common/src/head_regional.html'],
                ['<ReportCommonHeadQRCode/>', global.SERVER_ROOT + '/apps/common/src/head_qrcode.html'],
                ['<ReportCommonHead/>', global.SERVER_ROOT + '/apps/common/report/head.html'],
                ['<ReportPaper/>', global.SERVER_ROOT + '/apps/app2/report/paper.html'],
                ['<ReportCommonBody/>', global.SERVER_ROOT + '/apps/common/report/body.html'],
                ['<ReportCommonBodyMaintenance/>', global.SERVER_ROOT + '/apps/common/src/body_maintenance.html'],
                ['<ReportCommonBodyBroadcast/>', global.SERVER_ROOT + '/apps/common/src/body_broadcast.html']
            ];
            read_app_files(app_id, files, (err, report)=>{
                if (err)
                    reject(err);
                else{
                    get_module_with_init(app_id, 
                                         null,
                                         null,
                                        'report_exception',
                                        null,
                                        false,
                                        gps_lat,
                                        gps_long,
                                        gps_place,
                                        report, (err, report_init) =>{
                        if (err)
                            reject(err);
                        else{
                            resolve(report_init);
                        }
                    })
                }
            })
        })
    }
}