/*
  App startup file
  Starts in this order:
  1. Variables
  2. Loads configuration or creates new configuration if first time
      default configurations found here:
      /server/default_auth_blockip.json
      /server/default_auth_policy.json
      /server/default_auth_user.json
      /server/default_auth_user_agent.json
      /server/default_config.json
  3. Sets process info
  4. Middlewares
  5. Routes
  6. Database if enabled
  7. Apps if enabled
  8. Maintenance check
  9. HTTP server
  10. HTTPS server if enabled
*/
//1. VARIABLES
//ES2020 import() and ES2022 top level await
const express = await import('express');
const {default: helmet} = await import('helmet');
const {CheckFirstTime, InitConfig, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

//2. START CONFIGURATION
InitConfig().then(function(){
  //Create express application
  const app = express.default();
  async function load_routers(){
    //mount routers to endpoints
    const rest_api_path = ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH');
    //array of  [endpoint, router file]:
    const files = [
      ['/server',                             '/server/server.router.js'],
      ['/service/auth',                       '/service/auth/auth.router.js'],
      ['/service/auth/admin',                 '/service/auth/admin/admin.router.js'],
      ['/service/broadcast',                  '/service/broadcast/broadcast.router.js'],
      ['/service/db/admin',                   '/service/db/admin/admin.router.js'],
      [rest_api_path + '/app',                rest_api_path + '/app/app.router.js'],
      [rest_api_path + '/app_category',       rest_api_path + '/app_category/app_category.router.js'],
      [rest_api_path + '/app_log',            rest_api_path + '/app_log/app_log.router.js'],
      [rest_api_path + '/app_object',         rest_api_path + '/app_object/app_object.router.js'],
      [rest_api_path + '/app_parameter',      rest_api_path + '/app_parameter/app_parameter.router.js'],
      [rest_api_path + '/app_role',           rest_api_path + '/app_role/app_role.router.js'],
      [rest_api_path + '/country',            rest_api_path + '/country/country.router.js'],
      [rest_api_path + '/identity_provider',  rest_api_path + '/identity_provider/identity_provider.router.js'],
      [rest_api_path + '/language/locale',    rest_api_path + '/language/locale/locale.router.js'],
      [rest_api_path + '/message_translation',rest_api_path + '/message_translation/message_translation.router.js'],
      [rest_api_path + '/parameter_type',     rest_api_path + '/parameter_type/parameter_type.router.js'],
      [rest_api_path + '/setting',            rest_api_path + '/setting/setting.router.js'],
      [rest_api_path + '/user_account',       rest_api_path + '/user_account/user_account.router.js'],
      [rest_api_path + '/user_account_app',   rest_api_path + '/user_account_app/user_account_app.router.js'],
      [rest_api_path + '/user_account_like',  rest_api_path + '/user_account_like/user_account_like.router.js'],
      [rest_api_path + '/user_account_logon', rest_api_path + '/user_account_logon/user_account_logon.router.js'],
      [rest_api_path + '/user_account_follow',rest_api_path + '/user_account_follow/user_account_follow.router.js'],
      ['/service/forms',                      '/service/forms/forms.router.js'],
      ['/service/geolocation',                '/service/geolocation/geolocation.router.js'],
      ['/service/log',                        '/service/log/log.router.js'],
      ['/service/mail',                       '/service/mail/mail.router.js'],
      ['/service/report',                     '/service/report/report.router.js'],
      ['/service/worldcities',                '/service/worldcities/worldcities.router.js']
      ];  
    //ES6 for of loop
    for (const file of files){
      //ES2020 import with ES6 template literals
      await import(`file://${process.cwd()}${file[1]}`).then(function({router}){
        // MIDDLEWARE
        // endpoint, router file
        app.use(file[0], router);
      })
    }
  }
  (async function(){
    return await new Promise(function(resolve){
      //configuration of Content Security Policies
      import(`file://${process.cwd()}/service/auth/auth.controller.js`).then(function({ policy_directives}){
        policy_directives((err, result_directives)=>{
          if (err){
            import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogServerI}){
              createLogServerI('Content Security Policies error :' + err).then(function(){
                resolve();
              })
            })
          }
          else
            resolve(result_directives);
        })
      })
    })
  })().then(function(result_directives){
        //3. PROCESS INFO
        //set timezone
        process.env.TZ = 'UTC';
        //
        //4. MIDDLEWARE
        //
        //Helmet Content Security Policies
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
        //define what headers are allowed
        app.use(function(req, res, next) {
          res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed');
          res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
          next();
        });
        // set JSON maximum size
        app.use(express.json({ limit: ConfigGet(1, 'SERVER', 'JSON_LIMIT') }));
        //logging
        app.use((err,req,res,next) => {
          import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogServerE}){
            createLogServerE(req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                            req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], err).then(function(){
                              next();
            });
          })
        })
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
        //check request
        //logs only if error
        app.use(function(req, res, next) {
          import(`file://${process.cwd()}/service/auth/auth.controller.js`).then(function({check_request}){
            check_request(req, (err, result) =>{
              if (err){
                res.statusCode = 500;
                import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogServerE}){
                  createLogServerE(req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                                  req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], err).then(function(){
                    res.redirect(req.headers.host);
                  });
                })
              }
              else{
                next();
              }
            })
          })
        });
        //convert query id parameters from string to integer
        app.use(function(req, res, next) { 
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
            import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogServerI}){
              createLogServerI(null,
                req,
                req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                res.statusCode, res.statusMessage, 
                req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(function(){
                res.end;
              });
            })
          })
          next();
        });
        //check if SSL verification using letsencrypt should be enabled when validating domains
        if (ConfigGet(1, 'SERVER', 'HTTPS_SSL_VERIFICATION')=='1'){
          let ssl_verification_path = ConfigGet(1, 'SERVER', 'HTTPS_SSL_VERIFICATION_PATH');
          app.use(ssl_verification_path,express.static(process.cwd() + ssl_verification_path));
          app.use(express.static(process.cwd(), { dotfiles: 'allow' }));
        };
        //5. ROUTES
        //get before apps code
        //info for search bots
        app.get('/robots.txt', function (req, res) {
          res.type('text/plain');
          res.send('User-agent: *\nDisallow: /');
        });
        //browser favorite icon to ignore
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
        load_routers().then(function(){
          //6. START DATABASE
          import(`file://${process.cwd()}/service/db/admin/admin.service.js`).then(function({DBStart}){
            DBStart().then(function(result){
              import(`file://${process.cwd()}/apps/index.js`).then(function({AppsStart}){
                //7. START APPS
                AppsStart(express, app).then(function(){
                  import(`file://${process.cwd()}/service/broadcast/broadcast.service.js`).then(function({BroadcastCheckMaintenance}){
                    //8. START MAINTENANCE CHECK
                    BroadcastCheckMaintenance();
                  })
                })
              })
            })  
          })
          //9. START HTTP SERVER
          app.listen(ConfigGet(1, 'SERVER', 'PORT'), () => {
            import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogServerI}){
                createLogServerI('HTTP Server up and running on PORT: ' + ConfigGet(1, 'SERVER', 'PORT')).then(function(){
                  null;
                });
              })
          });
          if (ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1'){
            //10. START HTTPS SERVER
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
                      import(`file://${process.cwd()}/service/log/log.service.js`).then(function({createLogServerI}){
                        createLogServerI('HTTPS Server up and running on PORT: ' + ConfigGet(1, 'SERVER', 'HTTPS_PORT')).then(function(){
                          null;
                        });
                      })
                    }); 
                  });
                });  
              });
            })
          }
        })
      })
});
