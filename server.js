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
const {default: compression} = await import('compression');
const {default: helmet} = await import('helmet');
const {CheckFirstTime, InitConfig, ConfigGet} = await import(`file://${process.cwd()}/server/server.service.js`);

//2. START CONFIGURATION
InitConfig().then(() => {
  //Create express application
  const app = express.default();
  //use compression for better performance
  app.use(compression());
  
  const load_routers = async () => {
    return new Promise ((resolve)=>{
      const rest_api_path = ConfigGet(1, 'SERVICE_DB', 'REST_API_PATH');
      //ES2020 import with ES6 template literals and object destructuring
      import(`file://${process.cwd()}/router.js`).then(({setRouters}) => {
        setRouters(app, rest_api_path).then(() =>{
            resolve();
        })
      })
    })
    
  }
  //ES6 IIFE arrow function
  (async () =>{
    return await new Promise((resolve) => {
      //configuration of Content Security Policies
      import(`file://${process.cwd()}/service/auth/auth.controller.js`).then(({ policy_directives}) => {
        policy_directives((err, result_directives)=>{
          if (err){
            import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogServerI}) => {
              createLogServerI('Content Security Policies error :' + err).then(() => {
                resolve();
              })
            })
          }
          else
            resolve(result_directives);
        })
      })
    })
  })().then((result_directives) => {
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
        app.use((req, res, next) => {
          res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, Service-Worker-Allowed');
          res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
          next();
        });
        // set JSON maximum size
        app.use(express.json({ limit: ConfigGet(1, 'SERVER', 'JSON_LIMIT') }));
        //access control with log of stopped requests
        //logs only if error
        app.use((req,res,next) => {
          import(`file://${process.cwd()}/service/auth/auth.controller.js`).then(({ access_control}) => {
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
        app.use((req, res, next) => {
          import(`file://${process.cwd()}/service/auth/auth.controller.js`).then(({check_request}) => {
            check_request(req, (err, result) =>{
              if (err){
                res.statusCode = 500;
                import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogServerE}) => {
                  createLogServerE(req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                                  req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], err).then(() => {
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
        //and logs after response is finished
        app.use((req, res, next) => { 
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
            import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogServerI}) => {
              createLogServerI(null,
                req,
                req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, 
                res.statusCode, res.statusMessage, 
                req.headers['user-agent'], req.headers['accept-language'], req.headers['referer']).then(() => {
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
        app.get('/robots.txt',  (req, res) => {
          res.type('text/plain');
          res.send('User-agent: *\nDisallow: /');
        });
        //browser favorite icon to ignore
        app.get('/favicon.ico', (req, res) => {
          res.send('');
        });
        //change all requests from http to https and naked domains with prefix https://www. except localhost
        app.get('*', (req,res, next) => {
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
        load_routers().then(() => {
          //6. START DATABASE
          import(`file://${process.cwd()}/service/db/admin/admin.service.js`).then(({DBStart}) => {
            DBStart().then((result) => {
              import(`file://${process.cwd()}/apps/index.js`).then(({AppsStart}) => {
                //7. START APPS
                AppsStart(express, app).then(() => {
                  import(`file://${process.cwd()}/service/broadcast/broadcast.service.js`).then(({BroadcastCheckMaintenance}) => {
                    //8. START MAINTENANCE CHECK
                    BroadcastCheckMaintenance();
                  })
                })
              })
            })  
          })
          //error logging
          app.use((err,req,res,next) => {
            import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogServerE}) => {
              createLogServerE(req.ip, req.get('host'), req.protocol, req.originalUrl, req.method, res.statusCode, 
                              req.headers['user-agent'], req.headers['accept-language'], req.headers['referer'], err).then(() => {
                                next();
              });
            })
          })
          //9. START HTTP SERVER
          app.listen(ConfigGet(1, 'SERVER', 'PORT'), () => {
            import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogServerI}) => {
                createLogServerI('HTTP Server up and running on PORT: ' + ConfigGet(1, 'SERVER', 'PORT')).then(() => {
                  null;
                });
              })
          });
          if (ConfigGet(1, 'SERVER', 'HTTPS_ENABLE')=='1'){
            //10. START HTTPS SERVER
            //SSL files for HTTPS
            let options;
            import('node:fs').then((fs) => {
              fs.readFile(process.cwd() + ConfigGet(1, 'SERVER', 'HTTPS_KEY'), 'utf8', (error, fileBuffer) => {
                let env_key = fileBuffer.toString();
                fs.readFile(process.cwd() + ConfigGet(1, 'SERVER', 'HTTPS_CERT'), 'utf8', (error, fileBuffer) => {
                  let env_cert = fileBuffer.toString();
                  options = {
                    key: env_key,
                    cert: env_cert
                  };
                  import('node:https').then((https) => {
                    https.createServer(options, app).listen(ConfigGet(1, 'SERVER', 'HTTPS_PORT'), () => {
                      import(`file://${process.cwd()}/service/log/log.service.js`).then(({createLogServerI}) => {
                        createLogServerI('HTTPS Server up and running on PORT: ' + ConfigGet(1, 'SERVER', 'HTTPS_PORT')).then(() => {
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
