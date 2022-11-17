//Express framework
const express = require ("express");
//logging
const { createLogServer} = require("./service/log/log.controller");
//https
const https = require("https");
//read from file system
const fs = require("fs");
//to configure Content Security Policy
const helmet = require("helmet");
//Create express application
const app = express();
//configuration file
require('dotenv').config({path:__dirname+'/config/.env'})

//Logging variables
//global declaration
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
//set timezone
process.env.TZ = 'UTC';

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
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});

//middleware
//logging
app.use((err,req,res,next) => {
  createLogServer(req, res, null, err);
  next();
})
//middleware
//access control
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
        createLogServer(req, null, 'res:' + JSON.stringify(res, getCircularReplacer()), null);
      }
      else{
        if (process.env.SERVICE_LOG_ENABLE_SERVER_INFO==1)
          createLogServer(req, res, null, null);
      }        
      next();
	});
})
//middleware
//check request
app.use(function(req, res, next) {
  const {check_request} = require ("./service/auth/auth.controller");
  check_request(req, (err, result) =>{
    if (err)
      res.redirect('https://' + req.headers.host);
    else{
      next();
    }
  })
});

//set routing configuration
//server
const serverRouter = require("./server/server.router");
//service auth
const authRouter = require("./service/auth/auth.router");
const authAdminRouter = require("./service/auth/admin/admin.router");
//service broadcast
const broadcastRouter = require("./service/broadcast/broadcast.router");
//service db
const adminRouter = require("./service/db/admin/admin.router");
const appRouter = require("./service/db/app_portfolio/app/app.router");
const app_categoryRouter = require("./service/db/app_portfolio/app_category/app_category.router");
const app_logRouter = require("./service/db/app_portfolio/app_log/app_log.router");
const app_objectRouter = require("./service/db/app_portfolio/app_object/app_object.router");
const app_parameterRouter = require("./service/db/app_portfolio/app_parameter/app_parameter.router");
const countryRouter = require("./service/db/app_portfolio/country/country.router");
const identity_providerRouter = require("./service/db/app_portfolio/identity_provider/identity_provider.router");
const languageLocaleRouter = require("./service/db/app_portfolio/language/locale/locale.router");
const message_translationRouter = require("./service/db/app_portfolio/message_translation/message_translation.router");
const parameter_typeRouter = require("./service/db/app_portfolio/parameter_type/parameter_type.router");
const settingRouter = require("./service/db/app_portfolio/setting/setting.router");
const user_accountRouter = require("./service/db/app_portfolio/user_account/user_account.router");
const user_account_appRouter = require("./service/db/app_portfolio/user_account_app/user_account_app.router");
const user_account_likeRouter = require("./service/db/app_portfolio/user_account_like/user_account_like.router");
const user_account_followRouter = require("./service/db/app_portfolio/user_account_follow/user_account_follow.router");
//service db common
const commonRouter = require("./service/db/common/common.router");
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

//set REST API endpoints and connect to routers
//config
app.use("/server", serverRouter);
//authorization
app.use("/service/auth", authRouter);
app.use("/service/auth/admin", authAdminRouter);
//service broadcast
app.use("/service/broadcast", broadcastRouter);
//service db
app.use("/service/db/admin", adminRouter);
app.use("/service/db/app_portfolio/app", appRouter);
app.use("/service/db/app_portfolio/app_category", app_categoryRouter);
app.use("/service/db/app_portfolio/app_log", app_logRouter);
app.use("/service/db/app_portfolio/app_object", app_objectRouter);
app.use("/service/db/app_portfolio/app_parameter", app_parameterRouter);
app.use("/service/db/app_portfolio/country", countryRouter);
app.use("/service/db/app_portfolio/identity_provider", identity_providerRouter);
app.use("/service/db/app_portfolio/language/locale", languageLocaleRouter);
app.use("/service/db/app_portfolio/message_translation", message_translationRouter);
app.use("/service/db/app_portfolio/parameter_type", parameter_typeRouter);
app.use("/service/db/app_portfolio/setting", settingRouter);
app.use("/service/db/app_portfolio/user_account", user_accountRouter);
app.use("/service/db/app_portfolio/user_account_app", user_account_appRouter);
app.use("/service/db/app_portfolio/user_account_like", user_account_likeRouter);
app.use("/service/db/app_portfolio/user_account_follow", user_account_followRouter);
//service db common
app.use("/service/db/common", commonRouter);
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

//for SSL verification using letsencrypt, enable if validating domains
//app.use("/.well-known/acme-challenge/",express.static(__dirname + '/.well-known/acme-challenge/'));
//app.use(express.static(__dirname, { dotfiles: 'allow' }));

//server get before apps code
//info for search bots
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});
app.get('/favicon.ico', function (req, res) {
  res.send("");
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
const {DBStart} = require ("./service/db/admin/admin.service");
const {AppsStart} = require ("./apps");

let dbstart = DBStart().then(function(){
  AppsStart(express, app, (err, result) =>{
    null;
  })
})

//start HTTP and HTTPS
app.listen(process.env.SERVER_PORT, () => {
  createLogServer(null, null, "HTTP Server up and running on PORT: " + process.env.SERVER_PORT, null);
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
      createLogServer(null, null, "HTTPS Server up and running on PORT: " + process.env.SERVER_HTTPS_PORT, null);
    });    
  });  
});
