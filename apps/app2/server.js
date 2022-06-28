const APP2_ID = 2;
//app 2 directory
app.use('/app2',express.static(__dirname + '/apps/app2'));

app.get('/favicon.ico', function (req, res, next) {
    switch (req.headers.host.substring(0,req.headers.host.indexOf('.'))){
      case 'app2':{
        res.sendFile(__dirname + "/apps/app2/images/favicon.ico");
        break;
      }
      default:{
        next();
      }
    }
  });
  
  app.get('/',function (req, res, next) {
    //redirect from http to https
    if (req.protocol=='http')
      return res.redirect('https://' + req.headers.host);
    //redirect naked domain to www
    if (((req.headers.host.split('.').length - 1) == 1) &&
        req.headers.host.indexOf('localhost')==-1)
      return res.redirect('https://www.' + req.headers.host);
    switch (req.headers.host.substring(0,req.headers.host.indexOf('.'))){
      case 'app2':{
        const { getParameter} = require ("./service/db/api/app_parameter/app_parameter.service");
        getParameter(process.env.MAIN_APP_ID,'SERVER_MAINTENANCE', (err, db_SERVER_MAINTENANCE)=>{
          if (err)
            createLogAppSE(APP2_ID, __appfilename, __appfunction, __appline, err);      
          else{
              if (db_SERVER_MAINTENANCE==1){
                const { getMaintenance} = require("./service/forms/forms.controller");
                getMaintenance(req, res, APP2_ID,(err, app_result)=>{
                    return res.send(app_result);
                })
              }
              else{
                const { getForm} = require("./service/forms/forms.controller");
                getForm(req, res, APP2_ID, null,(err, app_result)=>{
                    return res.send(app_result);
                })
              }
          }
        })
        break;
      }
      default:{
        next();
      }
    }
  });