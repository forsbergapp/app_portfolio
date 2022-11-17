const { getParameters_server } = require ("../service/db/app_portfolio/app_parameter/app_parameter.service");
const { getApp } = require("../service/db/app_portfolio/app/app.service");
const { createLogAppSE } = require("../service/log/log.controller");
async function getInfo(app_id, info, lang_code, callBack){
    async function get_parameters(callBack){            
        getApp(app_id, app_id, lang_code, (err, result_app)=>{
            getParameters_server(app_id, app_id, (err, result)=>{
                //app_parameter table
                let db_info_email_policy;
                let db_info_email_disclaimer;
                let db_info_email_terms;
                let db_info_link_policy_url;
                let db_info_link_disclaimer_url;
                let db_info_link_terms_url;
                let db_info_link_about_url;            
                if (err) {
                    createLogAppSE(app_id, __appfilename, __appfunction, __appline, err);
                    callBack(err, null);
                }
                else{
                    let json = JSON.parse(JSON.stringify(result));
                    for (var i = 0; i < json.length; i++){
                        if (json[i].parameter_name=='INFO_EMAIL_POLICY')
                            db_info_email_policy = json[i].parameter_value;
                        if (json[i].parameter_name=='INFO_EMAIL_DISCLAIMER')
                            db_info_email_disclaimer = json[i].parameter_value;
                        if (json[i].parameter_name=='INFO_EMAIL_TERMS')
                            db_info_email_terms = json[i].parameter_value;
                        if (json[i].parameter_name=='INFO_LINK_POLICY_URL')
                            db_info_link_policy_url = json[i].parameter_value;
                        if (json[i].parameter_name=='INFO_LINK_DISCLAIMER_URL')
                            db_info_link_disclaimer_url = json[i].parameter_value;
                        if (json[i].parameter_name=='INFO_LINK_TERMS_URL')
                            db_info_link_terms_url = json[i].parameter_value;
                        if (json[i].parameter_name=='INFO_LINK_ABOUT_URL')
                            db_info_link_about_url = json[i].parameter_value;
                    }
                    callBack(null, {app_name: result_app[0].app_name,
                                    app_url: result_app[0].url,
                                    info_email_policy: db_info_email_policy,
                                    info_email_disclaimer: db_info_email_disclaimer,
                                    info_email_terms: db_info_email_terms,
                                    info_link_policy_url: db_info_link_policy_url,
                                    info_link_disclaimer_url: db_info_link_disclaimer_url,
                                    info_link_terms_url: db_info_link_terms_url,
                                    info_link_about_url: db_info_link_about_url
                                    })
                }
            })    
        })
    }
    let info_html1 = `<!DOCTYPE html>
                      <html>
                        <head>
                            <meta charset='UTF-8'>
                            <link rel='stylesheet' type='text/css' href='/common/css/common_info.css' />
                        </head>	
                        <body >`;
    let info_html2 = `  </body>
                      </html>`;
    switch (info){
    case 'privacy_policy':{
        get_parameters((err, result)=>{
            const fs = require("fs");
            fs.readFile(__dirname + `/app${app_id}${result.info_link_policy_url}.html`, 'utf8', (error, fileBuffer) => {
                let infopage = fileBuffer.toString();
                infopage = infopage.replace('<APPNAME1/>', result.app_name );
                infopage = infopage.replace('<APPNAME2/>', result.app_name );
                infopage = infopage.replace('<APPURL_HREF/>', result.app_url );
                infopage = infopage.replace('<APPURL_INNERTEXT/>', result.app_url );
                infopage = infopage.replace('<APPEMAIL_HREF/>', 'mailto:' + result.info_email_policy );
                infopage = infopage.replace('<APPEMAIL_INNERTEXT/>', result.info_email_policy );
                callBack(null, info_html1 + infopage + info_html2);
            })
        })
        break;
    }
    case 'disclaimer':{
        get_parameters((err, result)=>{
            const fs = require("fs");
            fs.readFile(__dirname + `/app${app_id}${result.info_link_disclaimer_url}.html`, 'utf8', (error, fileBuffer) => {
                let infopage = fileBuffer.toString();
                infopage = infopage.replace('<APPNAME1/>', result.app_name );
                infopage = infopage.replace('<APPNAME2/>', result.app_name );
                infopage = infopage.replace('<APPNAME3/>', result.app_name );
                infopage = infopage.replace('<APPEMAIL_HREF/>', 'mailto:' + result.info_email_disclaimer );
                infopage = infopage.replace('<APPEMAIL_INNERTEXT/>', result.info_email_disclaimer );
                callBack(null, info_html1 + infopage + info_html2);
            })
        })
        break;
    }
    case 'terms':{
        get_parameters((err, result)=>{
            const fs = require("fs");
            fs.readFile(__dirname + `/app${app_id}${result.info_link_terms_url}.html`, 'utf8', (error, fileBuffer) => {
                let infopage = fileBuffer.toString();
                infopage = infopage.replace('<APPNAME/>', result.app_name );
                infopage = infopage.replace('<APPURL_HREF/>', result.app_url );
                infopage = infopage.replace('<APPURL_INNERTEXT/>', result.app_url );
                infopage = infopage.replace('<APPEMAIL_HREF/>', 'mailto:' + result.info_email_terms );
                infopage = infopage.replace('<APPEMAIL_INNERTEXT/>', result.info_email_terms );
                callBack(null, info_html1 + infopage + info_html2);
            })
        })
        break;
    }
    case 'about':{
        get_parameters((err, result)=>{
            const fs = require("fs");
            fs.readFile(__dirname + `/app${app_id}${result.info_link_about_url}.html`, 'utf8', (error, fileBuffer) => {
                callBack(null, info_html1 + fileBuffer.toString() + info_html2);
            })
        });
        break;
    }
    default:
        callBack(null, null);
        break;
    }
}
async function read_app_files(app_id, files, callBack){
    const {promises: {readFile}} = require("fs");
    let i = 0;
    Promise.all(files.map(file => {
        return readFile(file[1], 'utf8');
    })).then(fileBuffers => {
        let app ='';
        fileBuffers.forEach(fileBuffer => {
            if (app=='')
                app = fileBuffer.toString();
            else
                app = app.replace(
                        files[i][0],
                        `${fileBuffer.toString()}`);
            i++;
        });
        callBack(null, app);
    })
    .catch(err => {
        createLogAppSE(app_id, __appfilename, __appfunction, __appline, err, (err_log, result_log)=>{
            callBack(err, null);
        })
    });
}
async function get_module_with_init(app_id, 
                                    exception_app_function,
                                    close_eventsource,
                                    ui,
                                    admin,
                                    gps_lat,
                                    gps_long,
                                    gps_place,
                                    module, callBack){
    const { getAppStartParameters } = require("../service/db/app_portfolio/app_parameter/app_parameter.service");
    getAppStartParameters(app_id, (err,result) =>{
        if (err)
            callBack(err, null);
        else{
            let parameters = {   
                app_id: app_id,
                app_name: result[0].app_name,
                app_url: result[0].app_url,
                app_logo: result[0].app_logo,
                exception_app_function: exception_app_function,
                close_eventsource: close_eventsource,
                ui: ui,
                admin: admin,
                service_auth: result[0].service_auth,
                app_rest_client_id: result[0].app_rest_client_id,
                app_rest_client_secret: result[0].app_rest_client_secret,
                rest_app_parameter: result[0].rest_app_parameter,
                gps_lat: gps_lat, 
                gps_long: gps_long, 
                gps_place: gps_place
            };
            module = module.replace(
                    '<ITEM_COMMON_PARAMETERS/>',
                    JSON.stringify(parameters));
            callBack(null, module);
        }
    })
}
async function get_module_with_init_admin(app_id, 
                                    exception_app_function,
                                    close_eventsource,
                                    ui,
                                    admin_in,
                                    admin_id_in,
                                    gps_lat,
                                    gps_long,
                                    gps_place,
                                    module, callBack){
    const { getAppStartParametersAdmin } = require("../service/db/app_portfolio/app_parameter/app_parameter.service");
    getAppStartParametersAdmin(app_id, (err,result) =>{
        if (err)
            callBack(err, null);
        else{
            let parameters = {   
                app_id: app_id,
                app_name: result[0].app_name,
                app_url: result[0].app_url,
                app_logo: result[0].app_logo,
                exception_app_function: exception_app_function,
                close_eventsource: close_eventsource,
                ui: ui,
                admin: admin_in,
                admin_id: admin_id_in,
                service_auth: result[0].service_auth,
                app_rest_client_id: result[0].app_rest_client_id,
                app_rest_client_secret: result[0].app_rest_client_secret,
                rest_app_parameter: result[0].rest_app_parameter,
                gps_lat: gps_lat, 
                gps_long: gps_long, 
                gps_place: gps_place
            };
            module = module.replace(
                    '<ITEM_COMMON_PARAMETERS/>',
                    JSON.stringify(parameters));
            callBack(null, module);
        }
    })
}
async function get_email_verification(data, email, baseUrl, lang_code, callBack){
    email = email.replace('<Logo/>', 
                        `<img id='app_logo' src='${data.protocol}://${data.host}${baseUrl}/logo?id=${data.app_id}&uid=${data.app_user_id}&et=${data.emailType}'>`);
    email = email.replace('<Verification_code/>', 
                        `${data.verificationCode}`);
    email = email.replace('<Footer/>', 
                        `<a target='_blank' href='${data.protocol}://${data.host}'>${data.protocol}://${data.host}</a>`);
    callBack(null, {"subject": '❂❂❂❂❂❂',
                    "email": email});
}
module.exports = {
    AppsStart:async (express, app) => {
        //express needed for dynamic code loading even if not used here, 
        //inparameter app variable depends on express
        //const express = require ("express");
        function load_dynamic_code(app_id){
            const fs = require("fs");
            let filename;
            //load dynamic server app code
            if (app_id == parseInt(process.env.COMMON_APP_ID))
              filename = `/admin/server.js`;
            else
              filename = `/app${app_id}/server.js`
            fs.readFile(__dirname + filename, 'utf8', (error, fileBuffer) => {
                //start one step debug server dynamic loaded code here
                eval(fileBuffer);
            });
        }
        const { getAppsAdmin } = require ("../service/db/app_portfolio/app/app.service");
        getAppsAdmin(process.env.COMMON_APP_ID, null, (err, results) =>{
            if (err) {
                createLogAppSE(process.env.COMMON_APP_ID, __appfilename, __appfunction, __appline, `getAppsAdmin, err:${err}`, (err_log, result_log)=>{
                null;
                })
            }
            else {
                let json;
                json = JSON.parse(JSON.stringify(results));
                //start app pools
                for (var app_id = 0; app_id < json.length; app_id++) {
                    load_dynamic_code(app_id);
                }
            }
        })
    },
    getMaintenance:(app_id, gps_lat, gps_long, gps_place) => {
        return new Promise(function (resolve, reject){
            const files = [
                ['APP', __dirname + '/common/src/index_maintenance.html'],
                ['<AppCommonHeadMaintenance/>', __dirname + '/common/src/head_maintenance.html'],
                ['<AppCommonBodyMaintenance/>', __dirname + '/common/src/body_maintenance.html'],
                ['<AppCommonBodyBroadcast/>', __dirname + '/common/src/body_broadcast.html'] 
              ];
            read_app_files(app_id, files, (err, app)=>{
                if (err)
                    reject(err);
                else{
                    //maintenance can be used from all app_id
                    let parameters = {   
                        app_id: app_id
                    };
                    app = app.replace('<ITEM_COMMON_PARAMETERS/>',
                                      JSON.stringify(parameters));
                    resolve(app);
                }
            })
        })
    },
    getMail:(app_id, data, baseUrl) => {
        return new Promise(function (resolve, reject){
            let mailfile = '';
            let files= [];
            //email type 1-4 implented are emails with verification code
            if (parseInt(data.emailType)==1 || 
                parseInt(data.emailType)==2 || 
                parseInt(data.emailType)==3 ||
                parseInt(data.emailType)==4){
                files = [
                    ['MAIL', __dirname + '/common/mail/mail.html'],
                    ['<MailHeader/>', __dirname + `/app${app_id}/mail/mail_header_verification.html`],
                    ['<MailBody/>', __dirname + `/app${app_id}/mail/mail_body_verification.html`]
                ];
            }
            read_app_files(app_id, files, (err, email)=>{
                if (err)
                    reject(err);
                else{
                    //email type 1-4 are emails with verification code
                    get_email_verification(data, email, baseUrl, data.lang_code, (err,email_verification)=>{
                        if (err)
                            reject(err);
                        else
                            resolve({"subject":         email_verification.subject, 
                                     "html":            email_verification.email});    
                    })
                }
            })
        })
    },
    check_app_subdomain: (app_id, host) =>{
        //if using test subdomains, dns wil point to correct server
        switch (app_id){
            case parseInt(process.env.COMMON_APP_ID):{
                //show admin app for all subdomains
                return true;
            }
            case 1:{
                //app1, www, test.app1, test or localhost
                if (host.indexOf(process.env.SERVER_TEST_SUBDOMAIN + `.app${app_id}`) == 0 ||
                    host.substring(0,host.indexOf('.')) == `app${app_id}` ||
                    host.substring(0,host.indexOf('.')) == process.env.SERVER_TEST_SUBDOMAIN ||
                    host.substring(0,host.indexOf('.')) == '' ||
                    host.substring(0,host.indexOf('.')) == 'www')
                    return true;
                else
                    return false;
            }
            default:{
                //test.app[app_id] or app[app_id]
                if (host.indexOf(process.env.SERVER_TEST_SUBDOMAIN + `.app${app_id}`) == 0 ||
                    host.substring(0,host.indexOf('.')) == `app${app_id}`)
                    return true;
                else
                    return false;
            }
        }
    }
}
module.exports.getInfo = getInfo;
module.exports.read_app_files = read_app_files;
module.exports.get_module_with_init = get_module_with_init;
module.exports.get_module_with_init_admin = get_module_with_init_admin;
module.exports.get_email_verification = get_email_verification;