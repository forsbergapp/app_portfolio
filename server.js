//variables
//module to use Express framework
const express = require ("express");
//logging
const { createLogServer, createLogAppSE} = require("./service/log/log.controller");

//module to use https
const https = require("https");
//module to read from file system
const fs = require("fs");
//module to configure Content Security Policy
const helmet = require("helmet");
//module to save variables outside code
require('dotenv').config({path:__dirname+'/config/.env'})

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
//set Helmet to configure Content Security Policy
const { policy_directives} = require("./service/auth/auth.controller");
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
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

//Logging middleware
app.use((err,req,res,next) => {
  createLogServer(req, res, process.env.MAIN_APP_ID, null, err);
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
        createLogServer(null, null, process.env.MAIN_APP_ID, 'res:' + JSON.stringify(res, getCircularReplacer()), null);
      }
      else{
        if (process.env.SERVICE_LOG_ENABLE_SERVER_INFO==1)
          createLogServer(req, res, process.env.MAIN_APP_ID, null, null);
      }        
      next();
	});
})
//set routing configuration
//service auth
const authRouter = require("./service/auth/auth.router");
const authAdminRouter = require("./service/auth/admin/admin.router");
//service broadcast
const broadcastRouter = require("./service/broadcast/broadcast.router");
//service db
const appRouter = require("./service/db/api/app/app.router");
const app_logRouter = require("./service/db/api/app_log/app_log.router");
const app_objectRouter = require("./service/db/api/app_object/app_object.router");
const app_parameterRouter = require("./service/db/api/app_parameter/app_parameter.router");
const countryRouter = require("./service/db/api/country/country.router");
const languageLocaleRouter = require("./service/db/api/language/locale/locale.router");
const message_translationRouter = require("./service/db/api/message_translation/message_translation.router");
const parameter_typeRouter = require("./service/db/api/parameter_type/parameter_type.router");
const user_accountRouter = require("./service/db/api/user_account/user_account.router");
const user_account_appRouter = require("./service/db/api/user_account_app/user_account_app.router");
const user_account_likeRouter = require("./service/db/api/user_account_like/user_account_like.router");
const user_account_followRouter = require("./service/db/api/user_account_follow/user_account_follow.router");
//service geolocation
const geolocationRouter = require("./service/geolocation/geolocation.router");
//service log
const logRouter = require("./service/log/log.router");
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
//service broadcast
app.use("/service/broadcast", broadcastRouter);
//service database
app.use("/service/db/api/app", appRouter);
app.use("/service/db/api/app_log", app_logRouter);
app.use("/service/db/api/app_object", app_objectRouter);
app.use("/service/db/api/app_parameter", app_parameterRouter);
app.use("/service/db/api/country", countryRouter);
app.use("/service/db/api/language/locale", languageLocaleRouter);
app.use("/service/db/api/message_translation", message_translationRouter);
app.use("/service/db/api/parameter_type", parameter_typeRouter);
app.use("/service/db/api/user_account", user_accountRouter);
app.use("/service/db/api/user_account_app", user_account_appRouter);
app.use("/service/db/api/user_account_like", user_account_likeRouter);
app.use("/service/db/api/user_account_follow", user_account_followRouter);
//service geolocation
app.use("/service/geolocation", geolocationRouter);
//service log
app.use("/service/log", logRouter);
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
app.use('/app0/css',express.static(__dirname + '/apps/app0/css'));
app.use('/app0/images',express.static(__dirname + '/apps/app0/images'));
app.use('/app0/js',express.static(__dirname + '/apps/app0/js'));

app.use(function(req, res, next) {
  var err = null;
  try {
      decodeURIComponent(req.path)
  }
  catch(e) {
      err = e;
  }
  if (err){
      createLogAppSE(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, `Not valid url input, req.url ${req.url} err:${err}`, (err_log, result_log)=>{
        return res.redirect('https://' + req.headers.host);
      });
  }
  next();
});


const {init_db, mysql_pool, oracle_pool} = require ("./service/db/config/database");
init_db((err, result) =>{
  if (err)
      null;
  else{
    let json;
    const { getAppDBParameters } = require ("./service/db/api/app_parameter/app_parameter.service");
    //app_id inparameter for log, all apps will be returned
    getAppDBParameters(process.env.MAIN_APP_ID,(err, results) =>{
      if (err) {
        createLogAppSE(process.env.MAIN_APP_ID, __appfilename, __appfunction, __appline, `getAppDBParameters, err:${err}`, (err_log, result_log)=>{
          null;
        })
      }
      else {
        json = JSON.parse(JSON.stringify(results));
        function start_pool(app_id, db_user, db_password){
          const fs = require("fs");
          function load_dynamic_code(app_id){
            //load dynamic server app code
            fs.readFile(`./apps/app${app_id}/server.js`, 'utf8', (error, fileBuffer) => {
              eval(fileBuffer);
            });
          }
          if (process.env.SERVICE_DB_USE==1){
            mysql_pool(app_id, db_user, db_password, (err, result) =>{
              load_dynamic_code(app_id);
            });
          }
          else if (process.env.SERVICE_DB_USE==2){
            oracle_pool(app_id, db_user, db_password, (err, result)=>{
              load_dynamic_code(app_id);
            });
          }
        }
        for (var i = 1; i < json.length; i++) {
          start_pool(json[i].id, json[i].db_user, json[i].db_password);
        }
      }
    }); 
  }
})
app.get("/admin",function (req, res, next) {
  //redirect from http to https
  if (req.protocol=='http')
    return res.redirect('https://' + req.headers.host + "/admin");
  else{
    const { getForm } = require ("./service/forms/forms.controller");
    getForm(req, res, null, null, (err, app_result)=>{
      return res.send(app_result);
    })
  }
});
app.get("/admin/:sub",function (req, res, next) {
    return res.redirect('https://' + req.headers.host + "/admin");
});
app.get("/info/:info",function (req, res, next) {
  //redirect from http to https
  if (req.protocol=='http')
    res.redirect('https://' + req.headers.host);
  else{
    if (req.headers.host.substring(0,req.headers.host.indexOf('.'))=='' ||
      req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
        const { getInfo} = require("./apps");
        switch (req.params.info){
          case 'datamodel.jpg':{
            res.sendFile(__dirname + "/apps/app0/info/datamodel.jpg");
            break;
          }
          case 'app_portfolio.jpg':{
              res.sendFile(__dirname + "/apps/app0/info/app_portfolio.jpg");
              break;
          }
          default:{
            if (typeof req.query.lang_code !='undefined'){
              req.query.lang_code = 'en';
            }
            getInfo(process.env.MAIN_APP_ID, req.params.info, req.query.lang_code, (err, info_result)=>{
              res.send(info_result);
            })
            break;
          }
        }
    }
    else
      next();
  }
});

//info for search bots, same for all apps
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});
app.get('/favicon.ico', function (req, res, next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.'))=='' ||
      req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
        res.sendFile(__dirname + "/apps/app0/images/favicon.ico");
  }
  else
    next();
});
app.get('/:user',function (req, res, next) {
  //redirect from http to https
  if (req.protocol=='http')
    return res.redirect('https://' + req.headers.host);
  //redirect naked domain to www
  if (((req.headers.host.split('.').length - 1) == 1) &&
      req.headers.host.indexOf('localhost')==-1)
    return res.redirect('https://www.' + req.headers.host);
  if ((req.headers.host.substring(0,req.headers.host.indexOf('.'))=='' ||
      req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www') &&
      req.params.user !== '' && 
      req.params.user!=='robots.txt' &&
      req.params.user!=='manifest.json' &&
      req.params.user!=='favicon.ico' &&
      req.params.user!=='sw.js' &&
      req.params.user!=='css' &&
      req.params.user!=='images' &&
      req.params.user!=='js' &&
      req.params.user!=='service'){
      const { getForm} = require("./service/forms/forms.controller");
      getForm(req, res, process.env.MAIN_APP_ID, req.params.user,(err, app_result)=>{
          //if app_result=0 means here redirect to /
          if (app_result==0)
            return res.redirect('/');
          else
            return res.send(app_result);
      })
  }
  else
      next();
});
//config root url
app.get('/',function (req, res, next) {
  //redirect from http to https
  if (req.protocol=='http')
    return res.redirect('https://' + req.headers.host);
  //redirect naked domain to www
  if (((req.headers.host.split('.').length - 1) == 1) &&
      req.headers.host.indexOf('localhost')==-1)
    return res.redirect('https://www.' + req.headers.host);
  if (req.headers.host.substring(0,req.headers.host.indexOf('.'))=='' ||
      req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
      const { getForm} = require("./service/forms/forms.controller");
      getForm(req, res, process.env.MAIN_APP_ID, null,(err, app_result)=>{
          return res.send(app_result);
      })
  }
  else
      next();
});
//start HTTP and HTTPS
app.listen(process.env.SERVER_PORT, () => {
  createLogServer(null, null, process.env.MAIN_APP_ID, "HTTP Server up and running on PORT: " + process.env.SERVER_PORT, null);
});
//SSL files for HTTPS
let options;
fs.readFile(process.env.SERVER_HTTPS_KEY, 'utf8', (error, fileBuffer) => {
  let env_key = fileBuffer.toString();
  fs.readFile(process.env.SERVER_HTTPS_CERT, 'utf8', (error, fileBuffer) => {
    let env_cert = fileBuffer.toString();
    options = {
      key: env_key,
      cert: env_cert
    };
    https.createServer(options, app).listen(process.env.SERVER_HTTPS_PORT, () => {
      createLogServer(null, null, process.env.MAIN_APP_ID, "HTTPS Server up and running on PORT: " + process.env.SERVER_HTTPS_PORT, null);
    });    
  });  
});
