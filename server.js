global.SERVER_ROOT = __dirname;
const { ConfigServerGlobals} = require( global.SERVER_ROOT + '/server/server.service');
ConfigServerGlobals();
//Express framework
const express = require ('express');
//logging
const { setLogVariables} = require( global.SERVER_ROOT + '/service/log/log.service');
const { createLogServerI, createLogServerE} = require(global.SERVER_ROOT + '/service/log/log.controller');
//https
const https = require('https');
//read from file system
const fs = require('fs');
//to configure Content Security Policy
const helmet = require('helmet');
//Create express application
const app = express();
//configuration file

require('dotenv').config({path:global.SERVER_ROOT+'/config/.env'})

//Logging variables
setLogVariables();

//set timezone
process.env.TZ = 'UTC';

//set Helmet to configure Content Security Policy
const { policy_directives} = require(global.SERVER_ROOT + '/service/auth/auth.controller');
policy_directives((err, result_directives)=>{
  if (err)
    null;
  else{
      app.use(
        helmet({
          crossOriginEmbedderPolicy: false,
          contentSecurityPolicy: {
            directives: result_directives
          }
        })
      );
      // Helmet referrer policy
      app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
  }
})
// set middleware JSON maximum size
app.use(express.json({ limit: process.env.SERVER_JSON_LIMIT }));
//define what headers are allowed
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});

//middleware
//logging
app.use((err,req,res,next) => {
  createLogServerE(req, res, err).then(function(){
    next();
  });
})
//middleware
//access control with log of stopped requests
//logs only if error
app.use((req,res,next) => {
  //access control
  const { access_control} = require(global.SERVER_ROOT + '/service/auth/auth.controller');
  access_control(req, res, (err, result)=>{
		if(err){
      null;
    }
		else{
      if (result)
        res.end;
      else
        next();
    }
	});
})
//middleware
//check request
//logs only if error
app.use(function(req, res, next) {
  const {check_request} = require (global.SERVER_ROOT + '/service/auth/auth.controller');
  check_request(req, (err, result) =>{
    if (err){
      res.statusCode = 500;
      createLogServerE(req, res, err).then(function(){
        res.redirect('https://' + req.headers.host);
      })
    }
    else{
      next();
    }
  })
});
app.use(function(req, res, next) {  
  res.on('finish',()=>{
    //logs the result after REST API has modified req and res
    createLogServerI(null, req, res).then(function(){
      res.end;
    });
  })
  next();
});

//set routing configuration
//server
const serverRouter = require(global.SERVER_ROOT + '/server/server.router');
//service auth
const authRouter = require(global.SERVER_ROOT + '/service/auth/auth.router');
const authAdminRouter = require(global.SERVER_ROOT + '/service/auth/admin/admin.router');
//service broadcast
const broadcastRouter = require(global.SERVER_ROOT + '/service/broadcast/broadcast.router');
//service db
const adminRouter = require(global.SERVER_ROOT + '/service/db/admin/admin.router');
const appRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/app/app.router');
const app_categoryRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/app_category/app_category.router');
const app_logRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/app_log/app_log.router');
const app_objectRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/app_object/app_object.router');
const app_parameterRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/app_parameter/app_parameter.router');
const app_roleRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/app_role/app_role.router');
const countryRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/country/country.router');
const identity_providerRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/identity_provider/identity_provider.router');
const languageLocaleRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/language/locale/locale.router');
const message_translationRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/message_translation/message_translation.router');
const parameter_typeRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/parameter_type/parameter_type.router');
const settingRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/setting/setting.router');
const user_accountRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/user_account/user_account.router');
const user_account_appRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/user_account_app/user_account_app.router');
const user_account_likeRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/user_account_like/user_account_like.router');
const user_account_logonRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/user_account_logon/user_account_logon.router');
const user_account_followRouter = require(global.SERVER_ROOT + process.env.SERVICE_DB_REST_API_PATH + '/user_account_follow/user_account_follow.router');
//service geolocation
const geolocationRouter = require(global.SERVER_ROOT + '/service/geolocation/geolocation.router');
//service log
const logRouter = require(global.SERVER_ROOT + '/service/log/log.router');
//service mail
const mailRouter = require(global.SERVER_ROOT + '/service/mail/mail.router');
//service forms
const formsRouter = require(global.SERVER_ROOT + '/service/forms/forms.router');
//service report
const reportRouter = require(global.SERVER_ROOT + '/service/report/report.router');
//service worldcities
const worldcitiesRouter = require(global.SERVER_ROOT + '/service/worldcities/worldcities.router');

//set REST API endpoints and connect to routers
//config
app.use('/server', serverRouter);
//authorization
app.use('/service/auth', authRouter);
app.use('/service/auth/admin', authAdminRouter);
//service broadcast
app.use('/service/broadcast', broadcastRouter);
//service db
app.use('/service/db/admin', adminRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/app', appRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/app_category', app_categoryRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/app_log', app_logRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/app_object', app_objectRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/app_parameter', app_parameterRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/app_role', app_roleRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/country', countryRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/identity_provider', identity_providerRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/language/locale', languageLocaleRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/message_translation', message_translationRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/parameter_type', parameter_typeRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/setting', settingRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/user_account', user_accountRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/user_account_app', user_account_appRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/user_account_like', user_account_likeRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/user_account_logon', user_account_logonRouter);
app.use(process.env.SERVICE_DB_REST_API_PATH + '/user_account_follow', user_account_followRouter);
//service geolocation
app.use('/service/geolocation', geolocationRouter);
//service log
app.use('/service/log', logRouter);
//service mail
app.use('/service/mail', mailRouter);
//service forms
app.use('/service/forms', formsRouter);
//service report
app.use('/service/report', reportRouter);
//service worldcities
app.use('/service/worldcities', worldcitiesRouter);

//for SSL verification using letsencrypt, enable if validating domains
//app.use('/.well-known/acme-challenge/',express.static(__dirname + '/.well-known/acme-challenge/'));
//app.use(express.static(__dirname, { dotfiles: 'allow' }));

//server get before apps code
//info for search bots
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /');
});
app.get('/favicon.ico', function (req, res) {
  res.send('');
});
//change all requests from http to https and naked domains with prefix https://www. except localhost
app.get('*', function (req,res, next){
    //redirect from http to https
    if (req.protocol=='http')
      return res.redirect('https://' + req.headers.host + req.originalUrl);
    //redirect naked domain to www except for localhost
    if (((req.headers.host.split('.').length - 1) == 1) &&
       req.headers.host.indexOf('localhost')==-1)
      return res.redirect('https://www.' + req.headers.host + req.originalUrl);
    else
      next();
})
const {DBStart} = require (global.SERVER_ROOT + '/service/db/admin/admin.service');
const {AppsStart} = require (global.SERVER_ROOT + '/apps');
const {BroadcastCheckMaintenance} = require(global.SERVER_ROOT + '/service/broadcast/broadcast.service')

let dbstart = DBStart().then(function(){
  AppsStart(express, app).then(function(){
    BroadcastCheckMaintenance();
  })
})

//start HTTP
app.listen(process.env.SERVER_PORT, () => {
  createLogServerI('HTTP Server up and running on PORT: ' + process.env.SERVER_PORT);
});
if (process.env.SERVER_HTTPS_ENABLE==1){
  //start HTTPS
  //SSL files for HTTPS
  let options;
  fs.readFile(global.SERVER_ROOT + process.env.SERVER_HTTPS_KEY, 'utf8', (error, fileBuffer) => {
    let env_key = fileBuffer.toString();
    fs.readFile(global.SERVER_ROOT + process.env.SERVER_HTTPS_CERT, 'utf8', (error, fileBuffer) => {
      let env_cert = fileBuffer.toString();
      options = {
        key: env_key,
        cert: env_cert
      };
      https.createServer(options, app).listen(process.env.SERVER_HTTPS_PORT, () => {
        createLogServerI('HTTPS Server up and running on PORT: ' + process.env.SERVER_HTTPS_PORT);
      }); 
    });  
  });
}
