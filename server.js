//variables
//module to use Express framework
const express = require ("express");
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
//set routing configuration
//service auth
const authRouter = require("./service/auth/auth.router");
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
//service report
const reportRouter = require("./service/report/report.router");
//service worldcities
const worldcitiesRouter = require("./service/worldcities/worldcities.router");

//set middleware to configure Content Security Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], 
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'api.mapbox.com', 'apis.google.com', 'connect.facebook.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'use.fontawesome.com', 'api.mapbox.com'],
        fontSrc: ["self", 'fonts.gstatic.com', 'use.fontawesome.com'],
        imgSrc: ["*", 'data:', 'blob:'],
        connectSrc: ["'self'", 'api.mapbox.com', 'events.mapbox.com', 'www.facebook.com', 'graph.facebook.com'],
        childSrc: ["'self'", 'blob:'],
        objectSrc: ["'self'", 'data:'],
        frameSrc: ["'self'", 'data:', 'accounts.google.com', 'www.facebook.com'],
      },
    }
  })
  );
// set middleware JSON maximum size
app.use(express.json({ limit: process.env.SERVER_JSON_LIMIT }));
//define what headers are allowed
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});
//SERVER
//set REST API endpoints and connect to routers
//authorization
app.use("/service/auth", authRouter);
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

//app 1 directories
app.use('/app1/css',express.static(__dirname + '/app1/css'));
app.use('/app1/js',express.static(__dirname + '/app1/js'));
app.use('/app1/info',express.static(__dirname + '/app1/info'));
app.use('/app1/images',express.static(__dirname + '/app1/images'));

//app 1 progressive webapp menifest
app.get("/app1/manifest.json",function (req, res,next) {
    res.type('text/plain')
    res.send(`{
                "short_name": "${process.env.APP1_PWA_SHORT_NAME}",
                "name": "${process.env.APP1_PWA_NAME}",
                "description": "${process.env.APP1_PWA_DESCRIPTION}",
                "start_url": "${process.env.APP1_PWA_START_URL}",
                "display": "${process.env.APP1_PWA_DISPLAY}",
                "background_color": "${process.env.APP1_PWA_BACKGROUND_COLOR}",
                "theme_color": "${process.env.APP1_PWA_THEME_COLOR}",
                "orientation": "${process.env.APP1_PWA_ORIENTATION}",
                "icons": [
                  {
                    "src": "${process.env.APP1_PWA_ICONS1_SRC}",
                    "type": "${process.env.APP1_PWA_ICONS1_TYPE}",
                    "sizes": "${process.env.APP1_PWA_ICONS1_SIZES}"
                  },
                  {
                    "src": "${process.env.APP1_PWA_ICONS2_SRC}",
                    "type": "${process.env.APP1_PWA_ICONS2_TYPE}",
                    "sizes": "${process.env.APP1_PWA_ICONS2_SIZES}"
                  }
                ],
                "scope": "${process.env.APP1_PWA_SCOPE}"
              }`
      );
});
//app 1 show profile directly from url
app.get('/:user', function(req, res,next) {
  //this is only for app 1
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1' &&
      req.params.user !== '' && 
      req.params.user!=='robots.txt' &&
      req.params.user!=='manifest.json' &&
      req.params.user!=='css' &&
      req.params.user!=='images' &&
      req.params.user!=='js' &&
      req.params.user!=='app1' &&
      req.params.user!=='app2' &&
      req.params.user!=='service') {
      if (req.protocol=='http')
        return res.redirect('https://' + req.headers.host);
      else{
        const {getProfileUsername} = require("./service/db/api/user_account/user_account.service");
        getProfileUsername(req.params.user,null, (err,result)=>{
          if (result){
            // return app 1
            const { getApp } = require("./app1/app");
            res.setHeader('Content-Type', 'text/html');
            const app = getApp()
            .then(function(app_result){
              return res.send(app_result);
            });
          }
          else            
            return res.redirect('/');
        })
      }
    }
  else
    next();
});

//propertymanagement app directories
app.use('/app2',express.static(__dirname + '/app2'));
//common directories
app.use('/app0/css',express.static(__dirname + '/app0/css'));
app.use('/app0/images',express.static(__dirname + '/app0/images'));
app.use('/app0/js',express.static(__dirname + '/app0/js'));

//info for search bots
app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
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
      res.setHeader('Content-Type', 'text/html');
      return res.sendFile(__dirname + "/app0/index.html");
      break;
    }
    case 'app0':{
      return res.sendFile(__dirname + "/app0/info/datamodel.pdf");
      break;
    }
    case 'app1':{
      //app 1 generates startup html with some data from database
      const { getApp } = require("./app1/app");
      res.setHeader('Content-Type', 'text/html');
      const app = getApp(1)
      .then(function(app_result){
        return res.send(app_result);
      });
      break;
    }
    case 'app2':{
      return res.sendFile(__dirname + "/app2/datamodel.pdf");
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
	console.log("HTTP Server up and running on PORT: ", process.env.SERVER_PORT);
});
https.createServer(options, app).listen(process.env.SERVER_HTTPS_PORT, () => {
	console.log("HTTPS Server up and running on PORT: ", process.env.SERVER_HTTPS_PORT);
});
