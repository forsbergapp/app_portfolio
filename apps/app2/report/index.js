const { read_app_files, get_module_with_init } = require("../../");
module.exports = {
    getReport:(app_id, module, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['REPORT', __dirname + '/' + module],
                ['<ReportHead/>', __dirname + '/head.html'],
                ['<ReportCommonHeadPrayTimes/>', __dirname + '/../../common/src/head_praytimes.html'],
                ['<ReportCommonHeadRegional/>', __dirname + '/../../common/src/head_regional.html'],
                ['<ReportCommonHeadQRCode/>', __dirname + '/../../common/src/head_qrcode.html'],
                ['<ReportCommonHead/>', __dirname + '/../../common/report/head.html'],
                ['<ReportPaper/>', __dirname + '/paper.html'],
                ['<ReportCommonBody/>', __dirname + '/../../common/report/body.html'],
                ['<ReportCommonBodyMaintenance/>', __dirname + '/../../common/src/body_maintenance.html'],
                ['<ReportCommonBodyBroadcast/>', __dirname + '/../../common/src/body_broadcast.html']
            ];
            read_app_files(app_id, files, (err, report)=>{
                if (err)
                    reject(err);
                else{
                    get_module_with_init(app_id, 
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