//variables
//module to use Express framework
const express = require ("express");
//logging
const { createLogServer, createLogAppSE} = require("./service/log/log.service");

//module to use https
const https = require("https");
//module to read from file system
const fs = require("fs");
//module to configure Content Security Policy
const helmet = require("helmet");
//module to save variables outside code
require("dotenv").config();
//SSL files for HTTPS
const options = {
	key: fs.readFileSync(process.env.SERVER_HTTPS_KEY),
	cert: fs.readFileSync(process.env.SERVER_HTTPS_CERT)
};
//Create express application
const app = express();
//Logging variables
Object.defineProperty(global, '__stack', {
  get: function() {
          var orig = Error.prepareStackTrace;
          Error.prepareStackTrace = function(_, stack) {
              return stack;
          };
          var err = new Error;
          Error.captureStackTrace(err, arguments.callee);
          var stack = err.stack;
          Error.prepareStackTrace = orig;
          return stack;
      }
});
Object.defineProperty(global, '__appline', {
  get: function() {
          return __stack[1].getLineNumber();
      }
});
Object.defineProperty(global, '__appfunction', {
  get: function() {
          return __stack[1].getFunctionName();
      }
});
Object.defineProperty(global, '__appfilename', {
    get: function() {
      let filename = __stack[1].getFileName();
      return filename.substring(__dirname.length).replace(/\\/g, "/");
      } 
});
//set middleware to configure Content Security Policy
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"], 
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'api.mapbox.com', 'apis.google.com', 'connect.facebook.net', '*.facebook.com'],
        "script-src-attr": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'use.fontawesome.com', 'api.mapbox.com'],
        "font-src": ["self", 'fonts.gstatic.com', 'use.fontawesome.com'],
        "img-src": ["*", 'data:', 'blob:'],
        connectSrc: ["*"],
        childSrc: ["'self'", 'blob:'],
        "object-src": ["'self'", 'data:'],
        frameSrc: ["'self'", 'data:', 'accounts.google.com', 'www.facebook.com'],
      },
    }
  })
);
// set middleware JSON maximum size
app.use(express.json({ limit: process.env.SERVER_JSON_LIMIT }));
//define what headers are allowed
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

//Logging middleware
app.use((err,req,res,next) => {
  createLogServer(err, req, res);
  next();
})
app.use((req,res,next) => {
  //access control
  const { access_control} = require("./service/auth/auth.controller");
  access_control(req, res, (http_err_code, result)=>{
		if(http_err_code)      
      return res.status(http_err_code).send('stop');
		else
      if (process.env.SERVICE_LOG_ENABLE_SERVER_VERBOSE==1){
        const getCircularReplacer = () => {
          const seen = new WeakSet();
          return (key, value) => {
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) {
                return;
              }
              seen.add(value);
            }
            return value;
          };
        };
        createLogServer(null, null, null, 'res:' + JSON.stringify(res, getCircularReplacer()));
      }
      else{
        if (process.env.SERVICE_LOG_ENABLE_SERVER_INFO==1)
          createLogServer(null, req, res);
      }        
      next();
	});
})
//set routing configuration
//service auth
const authRouter = require("./service/auth/auth.router");
const authAdminRouter = require("./service/auth/admin/admin.router");
//service db
const appRouter = require("./service/db/api/app/app.router");
const app_logRouter = require("./service/db/api/app_log/app_log.router");
const app_objectRouter = require("./service/db/api/app_object/app_object.router");
const app_parameterRouter = require("./service/db/api/app_parameter/app_parameter.router");
const countryRouter = require("./service/db/api/country/country.router");
const languageLocaleRouter = require("./service/db/api/language/locale/locale.router");
const message_translationRouter = require("./service/db/api/message_translation/message_translation.router");
const user_accountRouter = require("./service/db/api/user_account/user_account.router");
const user_account_likeRouter = require("./service/db/api/user_account_like/user_account_like.router");
const user_account_followRouter = require("./service/db/api/user_account_follow/user_account_follow.router");
const app1_app_timetables_placeRouter = require("./service/db/api/app_timetables_place/app_timetables_place.router");
const app1_app_timetables_themeRouter = require("./service/db/api/app_timetables_theme/app_timetables_theme.router");
const app1_app_timetables_user_settingRouter = require("./service/db/api/app_timetables_user_setting/app_timetables_user_setting.router");
const app1_app_timetables_user_setting_likeRouter = require("./service/db/api/app_timetables_user_setting_like/app_timetables_user_setting_like.router");
const app1_app_timetables_user_setting_viewRouter = require("./service/db/api/app_timetables_user_setting_view/app_timetables_user_setting_view.router");
//service geolocation
const geolocationRouter = require("./service/geolocation/geolocation.router");
//service mail
const mailRouter = require("./service/mail/mail.router");
//service forms
const formsRouter = require("./service/forms/forms.router");
//service report
const reportRouter = require("./service/report/report.router");
//service worldcities
const worldcitiesRouter = require("./service/worldcities/worldcities.router");

//SERVER
//set REST API endpoints and connect to routers
//authorization
app.use("/service/auth", authRouter);
app.use("/service/auth/admin", authAdminRouter);
//service database
app.use("/service/db/api/app", appRouter);
app.use("/service/db/api/app_log", app_logRouter);
app.use("/service/db/api/app_object", app_objectRouter);
app.use("/service/db/api/app_parameter", app_parameterRouter);
app.use("/service/db/api/country", countryRouter);
app.use("/service/db/api/language/locale", languageLocaleRouter);
app.use("/service/db/api/message_translation", message_translationRouter);
app.use("/service/db/api/user_account", user_accountRouter);
app.use("/service/db/api/user_account_like", user_account_likeRouter);
app.use("/service/db/api/user_account_follow", user_account_followRouter);
app.use("/service/db/api/app_timetables_place", app1_app_timetables_placeRouter);
app.use("/service/db/api/app_timetables_theme", app1_app_timetables_themeRouter);
app.use("/service/db/api/app_timetables_user_setting", app1_app_timetables_user_settingRouter);
app.use("/service/db/api/app_timetables_user_setting_like", app1_app_timetables_user_setting_likeRouter);
app.use("/service/db/api/app_timetables_user_setting_view", app1_app_timetables_user_setting_viewRouter);
//service geolocation
app.use("/service/geolocation", geolocationRouter);
//service mail
app.use("/service/mail", mailRouter);
//service forms
app.use("/service/forms", formsRouter);
//service report
app.use("/service/report", reportRouter);
//service worldcities
app.use("/service/worldcities", worldcitiesRouter);

//set timezone
process.env.TZ = 'UTC';

//CLIENT
//for SSL verification using letsencrypt, enable if validating domains
//app.use("/.well-known/acme-challenge/",express.static(__dirname + '/.well-known/acme-challenge/'));
//app.use(express.static(__dirname, { dotfiles: 'allow' }));

//admin directories
app.use('/admin/js',express.static(__dirname + '/apps/admin/js'));
app.use('/admin/css',express.static(__dirname + '/apps/admin/css'));
//common directories
app.use('/common/js',express.static(__dirname + '/apps/common/js'));
app.use('/common/css',express.static(__dirname + '/apps/common/css'));
//app 0 directories
app.use('/app0/info',express.static(__dirname + '/apps/app0/info'));
app.use('/app0/css',express.static(__dirname + '/apps/app0/css'));
app.use('/app0/images',express.static(__dirname + '/apps/app0/images'));
app.use('/app0/js',express.static(__dirname + '/apps/app0/js'));
//app 1 directories
app.use('/app1/css',express.static(__dirname + '/apps/app1/css'));
app.use('/app1/js',express.static(__dirname + '/apps/app1/js'));
app.use('/app1/info',express.static(__dirname + '/apps/app1/info'));
app.use('/app1/images',express.static(__dirname + '/apps/app1/images'));
//app 2 directory
app.use('/app2',express.static(__dirname + '/apps/app2'));

app.get("/admin",function (req, res, next) {
  //redirect from http to https
  if (req.protocol=='http')
    return res.redirect('https://' + req.headers.host + "/admin");
  else{
    const { getParameter} = require ("./service/db/api/app_parameter/app_parameter.service");
    getParameter(process.env.APP0_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
      if (err)
        createLogAppSE(process.env.APP0_ID, __appfilename, __appfunction, __appline, err);      
      else{
          if (db_SERVER_MAINTENANCE==1)
            return res.sendFile(__dirname + "/apps/admin/index_maintenance.html");
          else{
            const { getAdmin } = require ("./service/forms/forms.controller");
            getAdmin( (err, app_result)=>{
              return res.send(app_result);
            })
          }
          
      }
    })
  }
});
app.get("/admin/:sub",function (req, res, next) {
    return res.redirect('https://' + req.headers.host + "/admin");
});
//app 1 pwa service worker, placed in root
app.get("/sw.js",function (req, res,next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1') {
      res.type('application/javascript');
      res.setHeader('Service-Worker-Allowed', '/')
      res.status(200);
      return res.sendFile(__dirname + "/app1/sw.js");
  }
  else
    next();
});
//app 1 progressive webapp menifest
app.get("/app1/manifest.json",function (req, res) {
  const { getManifest} = require("./service/forms/forms.controller");
  getManifest(process.env.APP1_ID, (err, manifest)=>{
      return res.send(manifest);
  })
});
//app 1 show profile directly from url
app.get('/:user', function(req, res,next) {
  //this is only for app 1
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1' &&
      req.params.user !== '' && 
      req.params.user!=='robots.txt' &&
      req.params.user!=='manifest.json' &&
      req.params.user!=='favicon.ico' &&
      req.params.user!=='sw.js' &&
      req.params.user!=='css' &&
      req.params.user!=='images' &&
      req.params.user!=='js' &&
      req.params.user!=='app1' &&
      req.params.user!=='app2' &&
      req.params.user!=='service') {
      if (req.protocol=='http')
        return res.redirect('https://' + req.headers.host);
      else{
        const { getParameter} = require ("./service/db/api/app_parameter/app_parameter.service");
        getParameter(process.env.APP0_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
          if (err)
            createLogAppSE(process.env.APP1_ID, __appfilename, __appfunction, __appline, err);      
          else{
              if (db_SERVER_MAINTENANCE==1)
                return res.sendFile(__dirname + "/apps/app1/index_maintenance.html");
              else{
                  const { getForm} = require("./service/forms/forms.controller");
                  getForm(process.env.APP1_ID, req.params.user, (err, app_result)=>{
                    //if err=0 means here redirect to /
                    if (err==0)
                      return res.redirect('/');
                    else
                      return res.send(app_result);
                  })
              }
          }
        })
      }
    }
  else
    next();
});

//info for search bots
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});
app.get('/favicon.ico', function (req, res) {
  switch (req.headers.host.substring(0,req.headers.host.indexOf('.'))){
    case '':
    case 'www':{
      res.sendFile(__dirname + "/apps/app0/images/favicon.ico");
      break;
    }
    case 'app1':{
      res.sendFile(__dirname + "/apps/app1/images/favicon.ico");
      break;
    }
    case 'app2':{
      res.sendFile(__dirname + "/apps/app2/images/favicon.ico");
      break;
    }
    default:{
      res.sendFile(__dirname + "/apps/app0/images/favicon.ico");
      break; 
    }
  }
});

//config root url
app.get('/',function (req, res) {
  //redirect from http to https
  if (req.protocol=='http')
    return res.redirect('https://' + req.headers.host);
  //redirect naked domain to www
  if (((req.headers.host.split('.').length - 1) == 1) &&
      req.headers.host.indexOf('localhost')==0)
    return res.redirect('https://www.' + req.headers.host);
  switch (req.headers.host.substring(0,req.headers.host.indexOf('.'))){
    case '':
    case 'www':{
      const { getParameter} = require ("./service/db/api/app_parameter/app_parameter.service");
      getParameter(process.env.APP0_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
        if (err)
          createLogAppSE(process.env.APP0_ID, __appfilename, __appfunction, __appline, err);      
        else{
            if (db_SERVER_MAINTENANCE==1)
              return res.sendFile(__dirname + "/apps/app0/index_maintenance.html");
            else{
              const { getForm} = require("./service/forms/forms.controller");
              getForm(process.env.APP0_ID, null,(err, app_result)=>{
                  return res.send(app_result);
              })
            }
        }
      })
      break;
    }
    case 'app1':{
      const { getParameter} = require ("./service/db/api/app_parameter/app_parameter.service");
      getParameter(process.env.APP0_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
        if (err)
          createLogAppSE(process.env.APP1_ID, __appfilename, __appfunction, __appline, err);      
        else{
            if (db_SERVER_MAINTENANCE==1)
              return res.sendFile(__dirname + "/apps/app1/index_maintenance.html");
            else{
              const { getForm} = require("./service/forms/forms.controller");
              getForm(process.env.APP1_ID, null,(err, app_result)=>{
                  return res.send(app_result);
              })
            }
        }
      })
      break;
    }
    case 'app2':{
      const { getParameter} = require ("./service/db/api/app_parameter/app_parameter.service");
      getParameter(process.env.APP0_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
        if (err)
          createLogAppSE(process.env.APP2_ID, __appfilename, __appfunction, __appline, err);      
        else{
            if (db_SERVER_MAINTENANCE==1)
              return res.sendFile(__dirname + "/apps/app2/index_maintenance.html");
            else{
              const { getForm} = require("./service/forms/forms.controller");
              getForm(process.env.APP2_ID, null,(err, app_result)=>{
                  return res.send(app_result);
              })
            }
        }
      })
      break;
    }
    default:{
      //all other subdomains not registered redirect to root
      if (req.headers.host.indexOf('localhost')>0)
        return res.redirect('https://localhost');
      else
        return res.redirect('https://www.' + req.headers.host);
      break; 
    }
  }
});

//start HTTP and HTTPS
app.listen(process.env.SERVER_PORT, () => {
  createLogServer(null, null, null, "HTTP Server up and running on PORT: " + process.env.SERVER_PORT);
});
https.createServer(options, app).listen(process.env.SERVER_HTTPS_PORT, () => {
  createLogServer(null, null, null, "HTTPS Server up and running on PORT: " + process.env.SERVER_HTTPS_PORT);
});
