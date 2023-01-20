//ES2020 import() and ES2022 top level await
const express = await import('express');
const {CheckFirstTime, InitConfig, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

InitConfig().then(function(){
  //Create express application
    const app = express.default();

    (async function(){
      //set routing configuration
      //server
      import(`file://${process.cwd()}/server/server.router.js`).then(function({router}){
        app.use('/server', router);
      })
      //service auth
      import(`file://${process.cwd()}/service/auth/auth.router.js`).then(function({router}){
        app.use('/service/auth', router);
      })
      //service authAdmin
      import(`file://${process.cwd()}/service/auth/admin/admin.router.js`).then(function({router}){
        app.use('/service/auth/admin', router);
      })
      //service broadcast
      import(`file://${process.cwd()}/service/broadcast/broadcast.router.js`).then(function({router}){
        app.use('/service/broadcast', router);
      })
      //service db
      import(`file://${process.cwd()}/service/db/admin/admin.router.js`).then(function({router}){
        app.use('/service/db/admin', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app/app.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/app', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_category/app_category.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/app_category', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_log/app_log.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/app_log', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_object/app_object.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/app_object', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_parameter/app_parameter.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/app_parameter', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/app_role/app_role.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/app_role', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/country/country.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/country', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/identity_provider/identity_provider.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/identity_provider', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/language/locale/locale.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/language/locale', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/message_translation/message_translation.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/message_translation', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/parameter_type/parameter_type.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/parameter_type', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/setting/setting.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/setting', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/user_account/user_account.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/user_account', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/user_account_app/user_account_app.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/user_account_app', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/user_account_like/user_account_like.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/user_account_like', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/user_account_logon/user_account_logon.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/user_account_logon', router);
      })
      import(`file://${process.cwd()}${ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH')}/user_account_follow/user_account_follow.router.js`).then(function({router}){
        app.use(ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH') + '/user_account_follow', router);
      })
      //service geolocation
      import(`file://${process.cwd()}/service/geolocation/geolocation.router.js`).then(function({router}){
        app.use('/service/geolocation', router);
      })
      //service log
      import(`file://${process.cwd()}/service/log/log.router.js`).then(function({router}){
        app.use('/service/log', router);
      })
      //service mail
      import(`file://${process.cwd()}/service/mail/mail.router.js`).then(function({router}){
        app.use('/service/mail', router);
      })
      //service forms
      import(`file://${process.cwd()}/service/forms/forms.router.js`).then(function({router}){
        app.use('/service/forms', router);
      })
      //service report
      import(`file://${process.cwd()}/service/report/report.router.js`).then(function({router}){
        app.use('/service/report', router);
      })
      //service worldcities
      import(`file://${process.cwd()}/service/worldcities/worldcities.router.js`).then(function({router}){
        app.use('/service/worldcities', router);
      })
    })().then(function(){
      
      //set timezone
      process.env.TZ = 'UTC';

      import(`file://${process.cwd()}/service/auth/auth.controller.js`).then(function({ policy_directives}){
        policy_directives((err, result_directives)=>{
          if (err)
            null;
          else{
              import('helmet').then(function({default: helmet}){
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
              })
          }
        })
      })

      // set middleware JSON maximum size
      app.use(express.json({ limit: ConfigGet(1, 'SERVER', 'JSON_LIMIT') }));
      //define what headers are allowed
      app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        next();
      });

      //middleware
      //logging
      app.use((err,req,res,next) => {
        import(`file://${process.cwd()}/service/log/log.controller.js`).then(function({createLogServerE}){
          createLogServerE(req, res, err).then(function(){
            next();
          });
        })
      })
      //middleware
      //access control with log of stopped requests
      //logs only if error
      app.use((req,res,next) => {
        import(`file://${process.cwd()}/service/auth/auth.controller.js`).then(function({ access_control}){
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
      })
      //middleware
      //check request
      //logs only if error
      app.use(function(req, res, next) {
        import(`file://${process.cwd()}/service/auth/auth.controller.js`).then(function({check_request}){
          check_request(req, (err, result) =>{
            if (err){
              res.statusCode = 500;
              import(`file://${process.cwd()}/service/log/log.controller.js`).then(function({createLogServerE}){
                createLogServerE(req, res, err).then(function(){
                  res.redirect(req.headers.host);
                })
              })
            }
            else{
              next();
            }
          })
        })
      });
      app.use(function(req, res, next) { 
        //convert query id parameters from string to integer
        //req.params can be modified in controller
        if (req.query.app_id)
          req.query.app_id = parseInt(req.query.app_id);
        if (req.query.id)
          req.query.id = parseInt(req.query.id);
        if (req.query.user_account_logon_user_account_id)
          req.query.user_account_logon_user_account_id = parseInt(req.query.user_account_logon_user_account_id);
        if (req.query.user_account_id)
          req.query.user_account_id = parseInt(req.query.user_account_id);
        if (req.query.app_user_id)
          req.query.app_user_id = parseInt(req.query.app_user_id);
        if (req.query.client_id)
          req.query.client_id = parseInt(req.query.client_id);
        res.on('finish',()=>{
          //logs the result after REST API has modified req and res
          import(`file://${process.cwd()}/service/log/log.controller.js`).then(function({createLogServerI}){
            createLogServerI(null, req, res).then(function(){
              res.end;
            });
          })
        })
        next();
      });

      //for SSL verification using letsencrypt, enable if validating domains
      //app.use('/.well-known/acme-challenge/',express.static(process.cwd() + '/.well-known/acme-challenge/'));
      //app.use(express.static(process.cwd(), { dotfiles: 'allow' }));

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
        //if first time, when no system admin exists, then redirect everything to admin
        if (CheckFirstTime() && req.originalUrl !='/admin' && req.headers.referer==undefined)
          return res.redirect('http://' + req.headers.host + '/admin');
        else{
          //redirect naked domain to www except for localhost
          if (((req.headers.host.split('.').length - 1) == 1) &&
            req.headers.host.indexOf('localhost')==-1)
            if (req.protocol=='http' && ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1')
              return res.redirect('https://' + 'www.' + req.headers.host + req.originalUrl);
            else
              return res.redirect('http://' + 'www.' + req.headers.host + req.originalUrl);
          else{
            //redirect from http to https if https enabled
            if (req.protocol=='http' && ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1')
              return res.redirect('https://' + req.headers.host + req.originalUrl);
            else{
              return next();
            }
          }
        }
      })
      import(`file://${process.cwd()}/service/db/admin/admin.service.js`).then(function({DBStart}){
        DBStart().then(function(result){
          import(`file://${process.cwd()}/apps/index.js`).then(function({AppsStart}){
            AppsStart(express, app).then(function(){
              import(`file://${process.cwd()}/service/broadcast/broadcast.service.js`).then(function({BroadcastCheckMaintenance}){
                BroadcastCheckMaintenance();
              })
            })
          })
        })  
      })

      //start HTTP
      app.listen(ConfigGet(1, 'SERVER', 'PORT'), () => {
        import(`file://${process.cwd()}/service/log/log.controller.js`).then(function({createLogServerI}){
          createLogServerI('HTTP Server up and running on PORT: ' + ConfigGet(1, 'SERVER', 'PORT'));
        })
      });
      if (ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1'){
        //start HTTPS
        //SSL files for HTTPS
        let options;
        import('node:fs').then(function(fs){
          fs.readFile(process.cwd() + ConfigGet(1, 'SERVER', 'HTTPS_KEY'), 'utf8', (error, fileBuffer) => {
            let env_key = fileBuffer.toString();
            fs.readFile(process.cwd() + ConfigGet(1, 'SERVER', 'HTTPS_CERT'), 'utf8', (error, fileBuffer) => {
              let env_cert = fileBuffer.toString();
              options = {
                key: env_key,
                cert: env_cert
              };
              import('node:https').then(function(https){
                https.createServer(options, app).listen(ConfigGet(1, 'SERVER', 'HTTPS_PORT'), () => {
                  import(`file://${process.cwd()}/service/log/log.controller.js`).then(function({createLogServerI}){
                    createLogServerI('HTTPS Server up and running on PORT: ' + ConfigGet(1, 'SERVER', 'HTTPS_PORT'));
                  })
                }); 
              });
            });  
          });
        })
      }
    })
});
