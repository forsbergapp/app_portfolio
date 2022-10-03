const APP1_ID = 1;
//app 1 directories
app.use('/app1/css',express.static(__dirname + '/app1/css'));
app.use('/app1/images',express.static(__dirname + '/app1/images'));
app.use('/app1/js',express.static(__dirname + '/app1/js'));
app.get("/info/:info",function (req, res, next) {
    //redirect from http to https
    if (req.protocol=='http')
      res.redirect('https://' + req.headers.host);
    else{
      if (req.headers.host.substring(0,req.headers.host.indexOf('.'))=='' ||
        req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
          const { getInfo} = require("./");
          switch (req.params.info){
            case 'datamodel.jpg':{
              res.sendFile(__dirname + "/app1/images/datamodel.jpg");
              break;
            }
            case 'app_portfolio.png':{
                res.sendFile(__dirname + "/app1/images/app_portfolio.png");
                break;
            }
            default:{
              if (typeof req.query.lang_code !='undefined'){
                req.query.lang_code = 'en';
              }
              getInfo(APP1_ID, req.params.info, req.query.lang_code, (err, info_result)=>{
                res.send(info_result);
              })
              break;
            }
          }
      }
      else
        next();
    }
});
app.get('/:user',function (req, res, next) {
  //redirect from http to https
  if (req.protocol=='http')
    return res.redirect('https://' + req.headers.host);
  //redirect naked domain to www
  if (((req.headers.host.split('.').length - 1) == 1) &&
      req.headers.host.indexOf('localhost')==-1)
    return res.redirect('https://www.' + req.headers.host);
  if ((req.headers.host.substring(0,req.headers.host.indexOf('.'))=='' ||
      req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www') &&
      req.params.user !== '' && 
      req.params.user!=='robots.txt' &&
      req.params.user!=='manifest.json' &&
      req.params.user!=='favicon.ico' &&
      req.params.user!=='sw.js' &&
      req.params.user!=='css' &&
      req.params.user!=='images' &&
      req.params.user!=='js' &&
      req.params.user!=='service'){
      const { getForm} = require("../service/forms/forms.controller");
      getForm(req, res, APP1_ID, req.params.user,(err, app_result)=>{
          //if app_result=0 means here redirect to /
          if (app_result==0)
            return res.redirect('/');
          else
            return res.send(app_result);
      })
  }
  else
      next();
});
//config root url
app.get('/',function (req, res, next) {
  //redirect from http to https
  if (req.protocol=='http')
    return res.redirect('https://' + req.headers.host);
  //redirect naked domain to www
  if (((req.headers.host.split('.').length - 1) == 1) &&
      req.headers.host.indexOf('localhost')==-1)
    return res.redirect('https://www.' + req.headers.host);
  if (req.headers.host.substring(0,req.headers.host.indexOf('.'))=='' ||
      req.headers.host.substring(0,req.headers.host.indexOf('.'))=='www'){
      const { getForm} = require("../service/forms/forms.controller");
      getForm(req, res, APP1_ID, null,(err, app_result)=>{
          return res.send(app_result);
      })
  }
  else
      next();
});