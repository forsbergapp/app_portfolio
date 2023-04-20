const APP2_ID = 2;
//app2 directories
app.use('/app2/css',express.static(process.cwd() + '/apps/app2/css'));
app.use('/app2/js',express.static(process.cwd() + '/apps/app2/js'));
app.use('/app2/images',express.static(process.cwd() + '/apps/app2/images'));
//routes
//app 2 pwa service worker, placed in root
app.get("/sw.js",(req, res,next) => {
  import(`file://${process.cwd()}/apps/index.js`).then(({ check_app_subdomain}) => {
    if (check_app_subdomain(APP2_ID, req.headers.host)) {
        res.type('application/javascript');
        res.setHeader('Service-Worker-Allowed', '/')
        res.status(200);
        return res.sendFile(process.cwd()  + "/apps/app2/sw.js");
    }
    else
      next();
  })
});
app.get("/info/:info", (req, res, next) => {
  import(`file://${process.cwd()}/apps/index.js`).then(({ check_app_subdomain}) => {
    if (check_app_subdomain(APP2_ID, req.headers.host)) {
        import(`file://${process.cwd()}/apps/index.js`).then(({ getInfo}) => {
          switch (req.params.info){
            case 'about':
            case 'disclaimer':
            case 'privacy_policy':
            case 'terms':{
              if (typeof req.query.lang_code !='undefined'){
                req.query.lang_code = 'en';
              }
              getInfo(APP2_ID, req.params.info, req.query.lang_code, (err, info_result)=>{
                res.send(info_result);
              })
              break;
            }
            default:{
              res.send(null);
              break;
            }
          }
        });
    }
    else
      next();
  })
});
//app 2 progressive webapp menifest
app.get("/app2/manifest.json", (req, res, next) => {
  import(`file://${process.cwd()}/apps/index.js`).then(({ check_app_subdomain}) => {
    if (check_app_subdomain(APP2_ID, req.headers.host)){
      import(`file://${process.cwd()}/server/server.service.js`).then(({ConfigGet}) => {
        import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}/app_parameter/app_parameter.service.js`).then(({ getParameters }) => {
          getParameters(APP2_ID, APP2_ID, (err, results) =>{
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
              for (let i = 0; i < json.length; i++) {
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
              return res.send(    `{
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
                                  }`);
            } 
          })
        })
      })
    }
    else
      next();
  })
});
//app 2 show profile directly from url
app.get('/:user', (req, res,next) => {
  import(`file://${process.cwd()}/apps/index.js`).then(({ check_app_subdomain}) => {
    if (check_app_subdomain(APP2_ID, req.headers.host) &&
      req.params.user !== '' && 
      req.params.user!=='manifest.json' &&
      req.params.user!=='sw.js' &&
      req.params.user!=='css' &&
      req.params.user!=='images' &&
      req.params.user!=='info' &&
      req.params.user!=='js') {
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/forms/forms.controller.js`).then(({ getForm}) => {
        getForm(req, res, APP2_ID, req.params.user, (err, app_result)=>{
          //if app_result=0 means here redirect to /
          if (app_result==0)
            return res.redirect('/');
          else
            return res.send(app_result);
        })
      });
    }
  else
    next();
  })
});
app.get('/', (req, res, next) => {
  import(`file://${process.cwd()}/apps/index.js`).then(({ check_app_subdomain}) => {
    if (check_app_subdomain(APP2_ID, req.headers.host)){
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/forms/forms.controller.js`).then(({ getForm}) => {
        getForm(req, res, APP2_ID, null,(err, app_result)=>{
            return res.send(app_result);
        })
      })
    }
    else
      next();
  })
});
//routes to database rest api
//ES6 IIFE arrow function
(async () => {
  const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
  const rest_api_path = `${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/db${ConfigGet(1, 'SERVICE_DB', 'REST_RESOURCE_SCHEMA')}`;
  

  const { checkAccessToken, checkDataToken} = await import(`file://${process.cwd()}${ConfigGet(1, 'SERVER', 'REST_RESOURCE_SERVICE')}/auth/auth.controller.js`);
  const { getPlace } = await import(`file://${process.cwd()}/apps/app2/service/db/app2_place/app2_place.controller.js`);
  const { getThemes } = await import(`file://${process.cwd()}/apps/app2/service/db/app2_theme/app2_theme.controller.js`);
  const { createUserSetting, 
    getUserSettingsByUserId, 
    getProfileUserSetting,
    getProfileUserSettings,
    getProfileUserSettingDetail,
    getProfileTop,
    getUserSetting,
    updateUserSetting, 
    deleteUserSetting} = await import(`file://${process.cwd()}/apps/app2/service/db/app2_user_setting/app2_user_setting.controller.js`);
  const { likeUserSetting, unlikeUserSetting} = await import(`file://${process.cwd()}/apps/app2/service/db/app2_user_setting_like/app2_user_setting_like.controller.js`);
  const { insertUserSettingView} = await import(`file://${process.cwd()}/apps/app2/service/db/app2_user_setting_view/app2_user_setting_view.controller.js`);
  
  const {log_router}  = await import(`file://${process.cwd()}/router.js`);

  //router
  const {Router} = await import('express');
  const router = [Router()];

  router[0].use(log_router);
  router[0].get("/",  checkDataToken, getPlace);
  app.use(`${rest_api_path}/app2_place`, router[0]);

  router.push(Router());
  router[1].use(log_router);
  router[1].get("/",  checkDataToken, getThemes);
  app.use(`${rest_api_path}/app2_theme`, router[1]);
  
  router.push(Router());
  router[2].use(log_router);
  router[2].get("/:id", checkDataToken, getUserSetting);
  router[2].get("/user_account_id/:id", checkDataToken, getUserSettingsByUserId);
  router[2].get("/profile/:id", checkDataToken, getProfileUserSetting);
  router[2].get("/profile/all/:id", checkDataToken, getProfileUserSettings);
  router[2].get("/profile/detail/:id", checkAccessToken, getProfileUserSettingDetail);
  router[2].get("/profile/top/:statchoice", checkDataToken, getProfileTop);
  router[2].post("/", checkAccessToken, createUserSetting);
  router[2].put("/:id", checkAccessToken, updateUserSetting);
  router[2].delete("/:id", checkAccessToken, deleteUserSetting);  
  app.use(`${rest_api_path}/app2_user_setting`, router[2]);
  
  router.push(Router());
  router[3].use(log_router);
  router[3].post("/:id", checkAccessToken, likeUserSetting);
  router[3].delete("/:id", checkAccessToken, unlikeUserSetting);
  app.use(`${rest_api_path}/app2_user_setting_like`, router[3]);
  
  router.push(Router());
  router[4].use(log_router);
  router[4].post("/", checkDataToken, insertUserSettingView);
  app.use(`${rest_api_path}/app2_user_setting_view`, router[4]);

})();