const {default:express} = await import('express');
const {ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);
const server = (app) =>{  
  const APP1_ID = 1;
  //app 1 directories
  app.use('/app1/css',express.static(process.cwd() + '/apps/app1/css'));
  app.use('/app1/images',express.static(process.cwd() + '/apps/app1/images'));
  app.use('/app1/js',express.static(process.cwd() + '/apps/app1/js'));
  //routes
  app.get("/info/:info",(req, res, next) => {
      import(`file://${process.cwd()}/apps/apps.service.js`).then(({ check_app_subdomain}) => {
        if (check_app_subdomain(APP1_ID, req.headers.host) ||
          req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
            switch (req.params.info){
              case 'about':
              case 'disclaimer':
              case 'privacy_policy':
              case 'terms':{
                if (typeof req.query.lang_code !='undefined'){
                  req.query.lang_code = 'en';
                }
                getInfo(APP1_ID, req.params.info, req.query.lang_code, (err, info_result)=>{
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
  app.get('/:user',(req, res, next) => {
    import(`file://${process.cwd()}/apps/apps.service.js`).then(({ check_app_subdomain}) => {
      if ((check_app_subdomain(APP1_ID, req.headers.host) ||
          req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www') &&
          req.params.user !== '' && 
          req.params.user!=='manifest.json' &&
          req.params.user!=='sw.js' &&
          req.params.user!=='css' &&
          req.params.user!=='images' &&
          req.params.user!=='info' &&
          req.params.user!=='js'){
          import(`file://${process.cwd()}/apps/apps.controller.js`).then(({ getApp}) => {
            getApp(req, res, APP1_ID, req.params.user,(err, app_result)=>{
                //if app_result=0 means here redirect to /
                if (app_result==0)
                  return res.redirect('/');
                else
                  return res.send(app_result);
            })
          })
      }
      else
          next();
    })
  });
  //config root url
  app.get('/',(req, res, next) => {
    import(`file://${process.cwd()}/apps/apps.service.js`).then(({ check_app_subdomain}) => {
      if (check_app_subdomain(APP1_ID, req.headers.host) ||
          req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
            import(`file://${process.cwd()}/apps/apps.controller.js`).then(({ getApp}) => {
              getApp(req, res, APP1_ID, null,(err, app_result)=>{
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