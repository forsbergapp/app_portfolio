const {default:express} = await import('express');
const server = (app) =>{
  const APP2_ID = 2;
  //app2 directories
  app.use('/app2/css',express.static(process.cwd() + '/apps/app2/css'));
  app.use('/app2/js',express.static(process.cwd() + '/apps/app2/js'));
  app.use('/app2/images',express.static(process.cwd() + '/apps/app2/images'));
  //routes
  //app 2 pwa service worker, placed in root
  app.get("/sw.js",(req, res,next) => {
    import(`file://${process.cwd()}/apps/apps.service.js`).then(({ check_app_subdomain}) => {
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
    import(`file://${process.cwd()}/apps/apps.service.js`).then(({ getInfo, check_app_subdomain}) => {
      if (check_app_subdomain(APP2_ID, req.headers.host)) {
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
      }
      else
        next();
    })
  });
  //app 2 progressive webapp menifest
  app.get("/app2/manifest.json", (req, res, next) => {
    import(`file://${process.cwd()}/apps/apps.service.js`).then(({ check_app_subdomain}) => {
      if (check_app_subdomain(APP2_ID, req.headers.host)){
        return res.send(    `{
                                "short_name": "Timetables",
                                "name": "Timetables",
                                "description": "Timetables",
                                "start_url": "/",
                                "display": "standalone",
                                "background_color": "#FFFFFF",
                                "theme_color": "#51abff",
                                "orientation": "portrait-primary",
                                "icons": [
                                {
                                    "src": "/app2/images/pwa/icon-192x192.png",
                                    "type": "image/png",
                                    "sizes": "192x192"
                                },
                                {
                                    "src": "/app2/images/pwa/icon-512x512.png",
                                    "type": "image/png",
                                    "sizes": "512x512"
                                }
                                ],
                                "scope": "/"
                            }`);
      }
      else
        next();
    })
  });
  //app 2 show profile directly from url
  app.get('/:user', (req, res,next) => {
    import(`file://${process.cwd()}/apps/apps.service.js`).then(({ check_app_subdomain}) => {
      if (check_app_subdomain(APP2_ID, req.headers.host) &&
        req.params.user !== '' && 
        req.params.user!=='manifest.json' &&
        req.params.user!=='sw.js' &&
        req.params.user!=='css' &&
        req.params.user!=='images' &&
        req.params.user!=='info' &&
        req.params.user!=='js') {
        import(`file://${process.cwd()}/apps/apps.controller.js`).then(({ getApp}) => {
          getApp(req, res, APP2_ID, req.params.user, (err, app_result)=>{
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
    import(`file://${process.cwd()}/apps/apps.service.js`).then(({ check_app_subdomain}) => {
      if (check_app_subdomain(APP2_ID, req.headers.host)){
        import(`file://${process.cwd()}/apps/apps.controller.js`).then(({ getApp}) => {
          getApp(req, res, APP2_ID, null,(err, app_result)=>{
              return res.send(app_result);
          })
        })
      }
      else
        next();
    })
  });
}
export {server}