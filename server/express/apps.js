/** @module server/express/apps */

// eslint-disable-next-line no-unused-vars
import * as Types from './../../types.js';

const {ConfigGet, ConfigGetApps, ConfigGetApp} = await import(`file://${process.cwd()}/server/server.service.js`);
const {apps_start_ok, getInfo, getApp, getReport, getMaintenance} = await import(`file://${process.cwd()}/apps/apps.service.js`);
const fs = await import('node:fs');
const {getNumberValue} = await import(`file://${process.cwd()}/server/server.service.js`);
/**
 * Returns parameters for apps
 * @param {Types.req} req 
 * @returns {Types.req_app_parameters} 
 */
const req_app_param = req =>{return{    ip:                     req.ip, 
                                        method:                 req.method,
                                        headers_user_agent:     req.headers['user-agent'],
                                        headers_accept_language:req.headers['accept-language'],
                                        headers_host:           req.headers.host,
                                        body:                   req.body};
                            };
/**
 * Returns parameters for reports
 * url is used for QR Code and last query parameter is removed
 * @param {Types.req} req 
 * @returns {Types.req_report_parameters} 
 */
const req_report_param = req =>{return{ reportid:               req.query.reportid, 
                                            messagequeue:           req.query.messagequeue,
                                            ps:                     req.query.ps,
                                            hf:                     req.query.hf,
                                            uid_view:               getNumberValue(req.query.uid_view),
                                            protocol:               req.protocol,
                                            ip:                     req.ip,
                                            method:                 req.method,
                                            headers_user_agent:     req.headers['user-agent'],
                                            headers_accept_language:req.headers['accept-language'],
                                            headers_host:           req.headers.host,
                                            url:                    `${req.protocol}://${req.headers.host}${req.originalUrl.substr(0,req.originalUrl.indexOf('&uid_view='))}`,
                                            body:                   req.body};
                            };
/**
 * Gets module with application name, app service parameters with optional countries
 * 
 * @async
 * @param {Types.express} app
 */
 const serverExpressApps = async (app) => {

    const {default:express} = await import('express');

    app.use('/common',express.static(process.cwd() + '/apps/common/public'));

    for (const app_config of ConfigGetApps())
        app.use(app_config.ENDPOINT,express.static(process.cwd() + app_config.PATH));
    
    //routes
    
    app.get('/sw.js',(/**@type {Types.req} */req, /**@type {Types.res} */ res, /**@type {function} */ next) => {
        const app_id = ConfigGetApp(req.headers.host, 'SUBDOMAIN');
        fs.readFile(process.cwd() + `${ConfigGetApp(app_id, 'PATH')}/sw.js`, 'utf8', (error, fileBuffer) => {
            //show empty if any error for this file
            if (error){
                res.statusCode = 500;
                res.statusMessage = error;
                next();
            }
            else{
                res.type('text/javascript');
                res.send(fileBuffer.toString());
            }
        });
    });
                          
    app.get('/info/:info',(/**@type {Types.req} */req, /**@type {Types.res} */ res, /**@type {function} */ next) => {
        const app_id = ConfigGetApp(req.headers.host, 'SUBDOMAIN');
        if (apps_start_ok()==true)
            if (ConfigGetApp(app_id, 'SHOWINFO')==1)
                switch (req.params.info){
                    case 'about':
                    case 'disclaimer':
                    case 'privacy_policy':
                    case 'terms':{
                        if (typeof req.query.lang_code !='undefined'){
                            req.query.lang_code = 'en';
                        }
                        getInfo(app_id, req.params.info, req.query.lang_code, (/**@type{Types.error}*/err, /**@type{Types.info_page_data}}*/info_result)=>{
                            //show empty if any error
                            if (err){
                                res.statusCode = 500;
                                res.statusMessage = err;
                                next();
                            }
                            else
                                res.send(info_result);
                        });
                        break;
                    }
                    default:{
                        res.send(null);
                        break;
                    }
                }
            else
                next();
        else
            getMaintenance(app_id)
            .then((/**@type{string}*/app_result) => {
                res.send(app_result);
            });
    });
    app.get('/reports',(/** @type{Types.req}*/req, /**@type {Types.res} */ res) => {
        const app_id = ConfigGetApp(req.headers.host, 'SUBDOMAIN');
        if (app_id == 0){
            res.statusCode = 503;
            res.statusMessage = '';
            res.send('');
        }
        else{
            //const data = {...}
            getReport(req_report_param(req), app_id, (/**@type{Types.error}*/err, /**@type{string}*/report_result)=>{
                //redirect if any error
                if (err){
                    res.statusCode = 500;
                    res.statusMessage = err;
                    res.send(err.message);
                }
                else{
                    if ((req.headers['content-type']) && req.headers['content-type'].startsWith('application/pdf')){
                        res.type('application/pdf');
                        res.send(report_result);
                        //res.end(report_result, 'binary');
                    }
                    else    
                        res.send(report_result);
                }
                    
            });
        }
            
    });
    app.get('/',(/** @type{Types.req}*/req, /** @type{Types.res}*/res) => {
        const app_id = ConfigGetApp(req.headers.host, 'SUBDOMAIN');
        getApp(req_app_param(req), app_id, null,(/**@type{Types.error}*/err, /**@type{string}*/app_result)=>{
            //show empty if any error
            if (err){
                res.statusCode = 500;
                res.statusMessage = err;
                res.end();
            }
            else
                return res.send(app_result);
        });
    });
    app.get('/:sub',(/** @type{Types.req}*/req, /** @type{Types.res}*/res, /**@type{function}*/next) => {
        const app_id = ConfigGetApp(req.headers.host, 'SUBDOMAIN');
        if (getNumberValue(ConfigGet('SERVER', 'APP_COMMON_APP_ID')) == app_id)
            return res.redirect('/');
        else
            if (ConfigGetApp(app_id, 'SHOWPARAM') == 1 && req.params.sub !== '' && !req.params.sub.startsWith('/apps'))
                getApp(req_app_param(req), app_id, req.params.sub, (/**@type{Types.error}*/err, /**@type{string}*/app_result)=>{
                    //show empty if any error
                    if (err){
                        res.statusCode = 500;
                        res.statusMessage = err;
                        res.send(err);
                    }
                    else{
                        //if app_result=null means here redirect to /
                        if (app_result==null)
                            return res.redirect('/');
                        else
                            return res.send(app_result);
                    }
                });
            else
                next();
    });
};
export {serverExpressApps};