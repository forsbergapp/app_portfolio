const app1_placeRouter = require("./service/db/app_portfolio/app1_place/app1_place.router");
const app1_themeRouter = require("./service/db/app_portfolio/app1_theme/app1_theme.router");
const app1_user_settingRouter = require("./service/db/app_portfolio/app1_user_setting/app1_user_setting.router");
const app1_user_setting_likeRouter = require("./service/db/app_portfolio/app1_user_setting_like/app1_user_setting_like.router");
const app1_user_setting_viewRouter = require("./service/db/app_portfolio/app1_user_setting_view/app1_user_setting_view.router");
const APP1_ID = 1;
app.use("/service/db/app_portfolio/app1_place", app1_placeRouter);
app.use("/service/db/app_portfolio/app1_theme", app1_themeRouter);
app.use("/service/db/app_portfolio/app1_user_setting", app1_user_settingRouter);
app.use("/service/db/app_portfolio/app1_user_setting_like", app1_user_setting_likeRouter);
app.use("/service/db/app_portfolio/app1_user_setting_view", app1_user_setting_viewRouter);

app.use('/app1/css',express.static(__dirname + '/apps/app1/css'));
app.use('/app1/js',express.static(__dirname + '/apps/app1/js'));
app.use('/app1/info',express.static(__dirname + '/apps/app1/info'));
app.use('/app1/images',express.static(__dirname + '/apps/app1/images'));

//app 1 pwa service worker, placed in root
app.get("/sw.js",function (req, res,next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1') {
      res.type('application/javascript');
      res.setHeader('Service-Worker-Allowed', '/')
      res.status(200);
      return res.sendFile(__dirname + "/apps/app1/sw.js");
  }
  else
    next();
});

app.get("/info/:info",function (req, res, next) {
  //redirect from http to https
  if (req.protocol=='http')
    res.redirect('https://' + req.headers.host);
  else{
    if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1') {
        const { getInfo} = require("./apps");
        if (typeof req.query.lang_code !='undefined'){
          req.query.lang_code = 'en';
        }
        getInfo(APP1_ID, req.params.info, req.query.lang_code, (err, info_result)=>{
          res.send(info_result);
        })
    }
    else
      next();
  }
});

//app 1 progressive webapp menifest
app.get("/app1/manifest.json",function (req, res, next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1'){
    const { getParameters } = require ("./service/db/app_portfolio/app_parameter/app_parameter.service");
    getParameters(APP1_ID,(err, results) =>{
      if (err) {
        return res.send(err);
      }
      else {
        let json = JSON.parse(JSON.stringify(results));
        let pwa_short_name;
        let pwa_name;
        let pwa_description;
        let pwa_start_url;
        let pwa_display;
        let pwa_background_color;
        let pwa_theme_color;
        let pwa_orientation;
        let pwa_icons1_src;
        let pwa_icons1_type;
        let pwa_icons1_sizes;
        let pwa_icons2_src;
        let pwa_icons2_type;
        let pwa_icons2_sizes;
        let pwa_scope;
        for (var i = 0; i < json.length; i++) {
          if (json[i].parameter_name=='PWA_SHORT_NAME')
            pwa_short_name = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_NAME')
            pwa_name = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_DESCRIPTION')
            pwa_description = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_START_URL')
            pwa_start_url = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_DISPLAY')
            pwa_display = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_BACKGROUND_COLOR')
            pwa_background_color = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_THEME_COLOR')
            pwa_theme_color = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_ORIENTATION')
            pwa_orientation = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_ICONS1_SRC')
            pwa_icons1_src = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_ICONS1_TYPE')
            pwa_icons1_type = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_ICONS1_SIZES')
            pwa_icons1_sizes = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_ICONS2_SRC')
            pwa_icons2_src = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_ICONS2_TYPE')
            pwa_icons2_type = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_ICONS2_SIZES')
            pwa_icons2_sizes = json[i].parameter_value;
          if (json[i].parameter_name=='PWA_SCOPE')
            pwa_scope = json[i].parameter_value;
        }
        return res.send(JSON.stringify(JSON.parse(
                            `{
                                "short_name": "${pwa_short_name}",
                                "name": "${pwa_name}",
                                "description": "${pwa_description}",
                                "start_url": "${pwa_start_url}",
                                "display": "${pwa_display}",
                                "background_color": "${pwa_background_color}",
                                "theme_color": "${pwa_theme_color}",
                                "orientation": "${pwa_orientation}",
                                "icons": [
                                {
                                    "src": "${pwa_icons1_src}",
                                    "type": "${pwa_icons1_type}",
                                    "sizes": "${pwa_icons1_sizes}"
                                },
                                {
                                    "src": "${pwa_icons2_src}",
                                    "type": "${pwa_icons2_type}",
                                    "sizes": "${pwa_icons2_sizes}"
                                }
                                ],
                                "scope": "${pwa_scope}"
                            }`),null,2)
                        );
      } 
    })
  }
  else
    next();
});
app.get('/favicon.ico', function (req, res, next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1')
    res.sendFile(__dirname + "/apps/app1/images/favicon.ico");
  else
    next();
});
//app 1 show profile directly from url
app.get('/:user', function(req, res,next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1' &&
      req.params.user !== '' && 
      req.params.user!=='robots.txt' &&
      req.params.user!=='manifest.json' &&
      req.params.user!=='favicon.ico' &&
      req.params.user!=='sw.js' &&
      req.params.user!=='css' &&
      req.params.user!=='images' &&
      req.params.user!=='js' &&
      req.params.user!=='service') {
      if (req.protocol=='http')
        return res.redirect('https://' + req.headers.host);
      else{
        const { getForm} = require("./service/forms/forms.controller");
        getForm(req, res, APP1_ID, req.params.user, (err, app_result)=>{
          //if app_result=0 means here redirect to /
          if (app_result==0)
            return res.redirect('/');
          else
            return res.send(app_result);
        })
      }
    }
  else
    next();
});
app.get('/',function (req, res, next) {
  if (req.headers.host.substring(0,req.headers.host.indexOf('.')) == 'app1'){
    //redirect from http to https
    if (req.protocol=='http')
      return res.redirect('https://' + req.headers.host);
    const { getForm} = require("./service/forms/forms.controller");
    getForm(req, res, APP1_ID, null,(err, app_result)=>{
        return res.send(app_result);
    })
  }
  else
    next();
});